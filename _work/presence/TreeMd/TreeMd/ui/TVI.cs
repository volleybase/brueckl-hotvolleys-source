using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
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
        internal bool presentation;

        private StackPanel spTitle;
        private TextBox tbTitle;
        private Expander exTitle;
        private TextBox tbText = null;
        private WebBrowser wb;
        private RowDefinition rdIn;
        private int rdInMinHeight = 25;
        private GridSplitter splitter;
        private RowDefinition rdSplitter;

        #region -- is dirty? ---------------------------------------------------

        private string oldTitle;
        private string oldInfo;
        private bool oldExpanded;
        private bool oldExpandedContent;
        private int oldHeight;
        private bool oldPresentation;

        internal bool IsDirty
        {
            get
            {
                bool dirty = oldTitle != title || oldInfo != info || oldExpanded != IsExpanded 
                    || oldExpandedContent != (exTitle != null ? exTitle.IsExpanded : false) 
                    || oldHeight != displayHeight || oldPresentation != presentation;

                if (!dirty)
                {
                    foreach (object obj in this.Items)
                    {
                        if (obj is TVI tvi)
                        {
                            dirty = dirty || tvi.IsDirty;
                        }
                    }
                }

                return dirty;
            }
        }

        internal void ResetDirty()
        {
            _initDirty(title, info, IsExpanded, exTitle != null ? exTitle.IsExpanded : false, displayHeight, presentation);
            foreach (object obj in this.Items)
            {
                if (obj is TVI tvi)
                {
                    tvi.ResetDirty();
                }
            }
        }

        private void _initDirty(string title, string info,
            bool expanded, bool expandedContent,
            int height, bool presentation)
        {
            oldTitle = title;
            oldInfo = info;
            oldExpanded = expanded;
            oldExpandedContent = expandedContent;
            oldHeight = height;
            oldPresentation = presentation;
        }

        #endregion

        public TVI(string title, string info, 
            bool expanded, bool expandedContent, 
            int height, bool presentation) : base()
        {
            // store data
            this.title = title;
            this.info = info;
            this.displayHeight = height >= rdInMinHeight ? height : 150;
            this.presentation = presentation;

            // old data to detect if item is to save
            _initDirty(title, info, expanded, expandedContent, height, presentation);

            // create and init ui
            this.Header = title;
            this.FontWeight = FontWeights.Bold;
            this.ContextMenu = MainWindow._createCM(false, this);

            // create children
            Grid grid = null;
            if (!presentation)
            {
                grid = new Grid();
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
            }

            tbTitle = new TextBox()
            {
                FontWeight = FontWeights.Bold,
                Text = title,
                HorizontalAlignment = HorizontalAlignment.Stretch
            };

            if (grid != null)
            {
                spTitle = new StackPanel()
                {
                    Orientation = Orientation.Horizontal
                };
                spTitle.Children.Add(tbTitle);

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
                    Text = info,
                    TextWrapping = TextWrapping.Wrap,
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
                wb.NavigateToString(_md2html(info));

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
            }
            else
            {
                this.Items.Add(tbTitle);
            }

            tbTitle.TextChanged += TbTitle_TextChanged;
            if (tbText != null)
            {
                tbText.TextChanged += TbText_TextChanged;
                tbText.SizeChanged += TbText_SizeChanged;
            }
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
            if (presentation)
            {
                this.tbTitle.Width = w - 50;
            }
            else
            {
                this.spTitle.Width = w - 50;
                this.tbTitle.Width = w - 72;
                this.wb.Width = w - 350;
            }
        }

        private string _md2html(string text)
        {
            string txt = text;

            string str;
            if (string.IsNullOrEmpty(txt))
            {
                str = "&lt;&lt;empty&gt;&gt;";
            }
            else
            {
                string container = "{{content}}";

                // look for presentation item as ancestor
                bool inPresentation = false;
                TVI tviP = this.Parent as TVI;
                while (tviP != null)
                {
                    if (tviP.presentation)
                    {
                        inPresentation = true;
                        break;
                    }
                    tviP = tviP.Parent as TVI;
                }

                if (inPresentation)
                {
                    Regex regexImgTxt = new Regex(@"^(!\[[^\]]+\]\([^\n]+\))(\r?\n)(.+)$", RegexOptions.Singleline);
                    Match matchImgTxt = regexImgTxt.Match(txt);
                    GroupCollection grps = matchImgTxt.Groups;

                    // check for presentation item with image and text
                    if (grps.Count == 4)
                    {
                        // group 0: everything
                        // group 1: image
                        // group 2: new line between image and text
                        // group 3: text
                        container = "<div class=\"presentation\">{{content}}</div>";
                        txt = grps[1] + Environment.NewLine
                            + "<div class=\"presentation_text\">" + grps[3] + "</div>";
                    }
                    else
                    {
                        container = "<div class=\"presentation full\">{{content}}</div>";
                    }
                }

                // inject markdown
                str = container.Replace("{{content}}", MainWindow._md2html(txt));

                // inject complete file name for image preview
                string basedir = @"file:///" + App.images;
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
                height = displayHeight,
                presentation = presentation
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

            // detect type: empyty, presentation, presentation item
            string type = null;
            bool inPresentation = false;
            TVI tviP = this.Parent as TVI;
            while (tviP != null)
            {
                if (tviP.presentation)
                {
                    inPresentation = true;
                    break;
                }
                tviP = tviP.Parent as TVI;
            }
            if (presentation)
            {
                type = "presentation";
            }
            else if (inPresentation)
            {
                type = "presentation_item";
            }

            ItemExport item = new ItemExport()
            {
                type = type,
                title = MainWindow._title(title),
                info = presentation ? null : MainWindow._md2html(info),
                items = items
            };

            return item;
        }

        #endregion
    }
}
