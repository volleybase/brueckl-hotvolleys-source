using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;

namespace TreeMd
{
    public class TVI : TreeViewItem
    {
        internal string title;
        internal string info;
      
        private int displayHeight;

        private StackPanel spTitle;
        private TextBox tbTitle;
        private Expander exTitle;
        private TextBox tbText;
        private WebBrowser wb;
        private RowDefinition rdIn;
        private int rdInMinHeight = 25;
        private GridSplitter splitter;
        private RowDefinition rdSplitter;

        public TVI(string title, string text, bool expanded, bool expandedContent, int height) : base()
        {
            this.title = title;
            this.info = text;
            this.displayHeight = height >= rdInMinHeight ? height : 150;

            this.Header = title;
            this.FontWeight = FontWeights.Bold;
            this.ContextMenu = MainWindow._createCM(false, this);

            // create children
            Grid grid = new Grid();
            this.Items.Add(grid);
            grid.HorizontalAlignment = HorizontalAlignment.Stretch;

            grid.RowDefinitions.Add(new RowDefinition()
            {
                Height = GridLength.Auto
            });
            rdIn = new RowDefinition()
            {
                Height = new GridLength(displayHeight, GridUnitType.Pixel),
                MinHeight = rdInMinHeight
            };
            grid.RowDefinitions.Add(rdIn);

            rdSplitter = new RowDefinition()
            {
                Height = GridLength.Auto
            };
            grid.RowDefinitions.Add(rdSplitter);
            grid.RowDefinitions.Add(new RowDefinition()
            {
                Height = new GridLength(1, GridUnitType.Pixel)
            });

            grid.ColumnDefinitions.Add(new ColumnDefinition()
            {
                Width = new GridLength(300, GridUnitType.Pixel)
            });
            grid.ColumnDefinitions.Add(new ColumnDefinition()
            {
                Width = GridLength.Auto
            });

            spTitle = new StackPanel()
            {
                Orientation = Orientation.Horizontal
            };
            tbTitle = new TextBox()
            {
                FontWeight = FontWeights.Bold,
                Text = title,
                HorizontalAlignment = HorizontalAlignment.Stretch
            };
            spTitle.Children.Add(tbTitle);
            //Grid.SetColumn(tbTitle, 0);
            //Grid.SetRow(tbTitle, 0);
            //Grid.SetColumnSpan(tbTitle, 2);
            //grid.Children.Add(tbTitle);

            exTitle = new Expander()
            {
                Width = 23,
                HorizontalAlignment = HorizontalAlignment.Right,
                IsExpanded = expandedContent
            };
            exTitle.Expanded += Ex_Expanded;
            exTitle.Collapsed += Ex_Collapsed;
            spTitle.Children.Add(exTitle);

            Grid.SetColumn(spTitle, 0);
            Grid.SetRow(spTitle, 0);
            Grid.SetColumnSpan(spTitle, 2);
            grid.Children.Add(spTitle);

            tbText = new TextBox()
            {
                FontWeight = FontWeights.Normal,
                Text = text,
                AcceptsReturn = true,
                HorizontalAlignment = HorizontalAlignment.Stretch,
                VerticalAlignment = VerticalAlignment.Stretch
            };
            Grid.SetColumn(tbText, 0);
            Grid.SetRow(tbText, 1);
            grid.Children.Add(tbText);

            wb = new WebBrowser()
            {
                HorizontalAlignment = HorizontalAlignment.Stretch,
                VerticalAlignment = VerticalAlignment.Stretch
            };
            Grid.SetColumn(wb, 1);
            Grid.SetRow(wb, 1);
            grid.Children.Add(wb);
            wb.NavigateToString(_md2html(text));


            /*
            <GridSplitter Width="2" ResizeBehavior="PreviousAndNext" Grid.Column="1"/>
            <Border BorderBrush="Gray" BorderThickness="1" Grid.Column="2" Margin="2"/>
            */
            splitter = new GridSplitter()
            {
                VerticalAlignment = VerticalAlignment.Stretch,
                HorizontalAlignment = HorizontalAlignment.Stretch,
                Height = 5,
                ResizeBehavior = GridResizeBehavior.BasedOnAlignment
            };
            Grid.SetRow(splitter, 2);
            Grid.SetColumnSpan(splitter, 2);
            grid.Children.Add(splitter);

            Border border = new Border()
            {
                BorderBrush = Brushes.Gray,
                BorderThickness = new Thickness(1)
            };
            Grid.SetRow(border, 3);
            Grid.SetColumnSpan(border, 2);
            grid.Children.Add(border);

            if (!expandedContent)
            {
                Ex_Collapsed(null, null);
            }

            tbTitle.TextChanged += TbTitle_TextChanged;
            tbText.TextChanged += TbText_TextChanged;
            tbText.SizeChanged += TbText_SizeChanged;
            this.SizeChanged += TVI_SizeChanged;
        }

        private void Ex_Collapsed(object sender, RoutedEventArgs e)
        {
            rdIn.IsEnabled = false;
            tbText.IsEnabled = false;
            splitter.IsEnabled = false;
            rdIn.MinHeight = 0;
            rdIn.Height = new GridLength(0);
            rdSplitter.Height = new GridLength(0);
        }

        private void Ex_Expanded(object sender, RoutedEventArgs e)
        {
            rdIn.Height = new GridLength(this.displayHeight);
            rdIn.MinHeight = rdInMinHeight;
            rdIn.IsEnabled = true;
            tbText.IsEnabled = true;
            rdSplitter.Height = GridLength.Auto;
            splitter.IsEnabled = true;
        }

        private void TbText_SizeChanged(object sender, SizeChangedEventArgs e)
        {
            if (tbText.IsEnabled)
            {
                // update only if enabled - not on hiding because of expander
                this.displayHeight = (int)Math.Floor(Math.Max(rdIn.ActualHeight, rdIn.MinHeight));
            }
        }

        private void TVI_SizeChanged(object sender, SizeChangedEventArgs e)
        {
            double w = this.ActualWidth;
            //this.tbTitle.Width = w - 50;
            this.spTitle.Width = w - 50;
            this.tbTitle.Width = w - 72;
            this.wb.Width = w - 350;
        }

        private string _md2html(string text)
        {
            string str = text != null ? MainWindow._md2html(text) : string.Empty;
            if (string.IsNullOrEmpty(str))
            {
                str = "&lt;&lt;empty&gt;&gt;";
            }
            else
            {
                string basedir = @"file://" + App.images;
                int start = 0;

                do
                {
                    start = str.IndexOf("<img ", start);
                    if (start >= 0)
                    {
                        int srcPos = str.IndexOf(" src=\"", start);
                        if (srcPos > 0)
                        {
                            int endPos = str.IndexOf("\"", srcPos + 6);
                            if (endPos > 0)
                            {
                                string src = basedir + str.Substring(srcPos + 6, endPos - srcPos - 6);
                                str = str.Substring(0, srcPos + 6) + src + str.Substring(endPos);
                            }
                        }
                        start += 10;
                    }
                } while (start > 0);
            }

            return App.template.Replace("{{content}}", str);
        }

        private void TbText_TextChanged(object sender, TextChangedEventArgs e)
        {
            this.info = tbText.Text;
            wb.NavigateToString(_md2html(tbText.Text));
        }

        private void TbTitle_TextChanged(object sender, TextChangedEventArgs e)
        {
            this.title = tbTitle.Text;
            this.Header = tbTitle.Text;
        }

        #region -- Save & Export. ----------------------------------------------

        internal Item AsItem()
        {
            List<Item> items = null;
            foreach (object obj in this.Items)
            {
                if (obj is TVI tvi)
                {
                    if (items == null)
                    {
                        items = new List<Item>();
                    }
                    items.Add(tvi.AsItem());
                }
            }

            Item item = new Item()
            {
                title = title,
                info = info,
                items = items,
                expanded = IsExpanded,
                expandedContent = exTitle != null ? exTitle.IsExpanded : false,
                height = displayHeight
            };

            return item;
        }

        internal ItemExport AsExportItem()
        {
            List<ItemExport> items = null;
            foreach (object obj in this.Items)
            {
                if (obj is TVI tvi)
                {
                    if (items == null)
                    {
                        items = new List<ItemExport>();
                    }
                    items.Add(tvi.AsExportItem());
                }
            }

            ItemExport item = new ItemExport()
            {
                title = MainWindow._title(title),
                info = MainWindow._md2html(info),
                items = items
            };

            return item;
        }

        #endregion
    }
}
