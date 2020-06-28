using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Windows;
using System.Windows.Controls;

using Markdig;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace TreeMd
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        #region -- The fields. -------------------------------------------------

        private static Item data;
        private static string caption;
        private bool showRoot = true;

        #endregion

        #region -- The constructor. --------------------------------------------

        public MainWindow()
        {
            if (!App.ok)
            {
                this.Close();
                return;
            }

            caption = Title;
            try
            {
                Item obj = JsonConvert.DeserializeObject<Item>(File.ReadAllText(App.filename));
                data = obj;
            }
            catch (Exception)
            {
                data = new Item()
                {
                    title = "Neu"
                };
            }

            //// debug reading
            //JsonSerializerSettings settings = new JsonSerializerSettings();
            //settings.NullValueHandling = NullValueHandling.Ignore;
            //string json = JsonConvert.SerializeObject(data, Formatting.Indented, settings);
            //File.WriteAllText(App.filename + "_old.json", json, Encoding.UTF8);

            InitializeComponent();
            tree.ContextMenu = MainWindow._createCM(true, tree);

            if (showRoot)
            {
                TVI tvi1 = new TVI(data.title, data.info, data.expanded, data.expandedContent, data.height);
                tree.Items.Add(tvi1);
                _addItems(tvi1, data.items);
                tvi1.IsExpanded = data.expanded;
            }
            else
            {
                foreach (Item it in data.items)
                {
                    TVI tvi1 = new TVI(it.title, it.info, it.expanded, it.expandedContent, it.height);
                    tree.Items.Add(tvi1);
                    _addItems(tvi1, it.items);
                    tvi1.IsExpanded = it.expanded;
                }
            }
        }

        private static void _addItems(TVI tviP, List<Item> items)
        {
            if (items != null)
            {
                foreach (Item it in items)
                {
                    TVI tvi = new TVI(it.title, it.info, it.expanded, it.expandedContent, it.height);
                    tviP.Items.Add(tvi);
                    _addItems(tvi, it.items);
                    tvi.IsExpanded = it.expanded;
                }
            }
        }

        #endregion

        #region -- The context menu. -------------------------------------------

        internal static ContextMenu _createCM(bool main, object target)
        {
            ContextMenu cm = new ContextMenu();
            cm.Opened += Cm_Opened;
            MenuItem mi = new MenuItem()
            {
                Name = "add",
                Header = main ? "Neues Hauptitem" : "Neues Item",
                Tag = target
            };
            cm.Items.Add(mi);
            mi.Click += Mi_Click;

            if (main)
            {
                mi = new MenuItem()
                {
                    Name = "save",
                    Header = "Speichern",
                    Tag = target
                };
                cm.Items.Add(mi);
                mi.Click += Mi_Click;

                mi = new MenuItem()
                {
                    Name = "export",
                    Header = "Exportieren",
                    Tag = target
                };
                cm.Items.Add(mi);
                mi.Click += Mi_Click;
            }
            else
            {
                if (target is TVI tvi)
                {
                    mi = new MenuItem()
                    {
                        Name = "del",
                        Header = "Lösche " + tvi.title,
                        Tag = target
                    };
                    cm.Items.Add(mi);
                    mi.Click += Mi_Click;
                }
            }

            if (!main)
            {
                cm.Items.Add(new Separator());

                mi = new MenuItem()
                {
                    Name = "move_up",
                    Header = "Hinauf",
                    Tag = target
                };
                cm.Items.Add(mi);
                mi.Click += Mi_Click;
                mi = new MenuItem()
                {
                    Name = "move_down",
                    Header = "Hinunter",
                    Tag = target
                };
                cm.Items.Add(mi);
                mi.Click += Mi_Click;
            }

            return cm;
        }

        private static void Cm_Opened(object sender, RoutedEventArgs e)
        {
            if (sender is ContextMenu cm)
            {
                foreach (Control mi0 in cm.Items)
                {
                    if (mi0 is MenuItem mi)
                    {
                        TVI tvi = mi.Tag as TVI;
                        switch (mi.Name)
                        {
                            case "move_up":
                                bool enabled = false;
                                TreeView tvP = tvi?.Parent as TreeView;
                                TVI tviP = tvi?.Parent as TVI;
                                ItemCollection items = tvP != null ? tvP.Items : tviP?.Items;

                                if (items != null)
                                {
                                    // index 0 is container of editor, but not for level 1
                                    int limit = tvP != null ? 0 : 1;
                                    enabled = items.IndexOf(tvi) > limit;
                                }

                                mi.IsEnabled = enabled;
                                break;

                            case "move_down":
                                enabled = false;
                                tvP = tvi?.Parent as TreeView;
                                tviP = tvi?.Parent as TVI;
                                items = tvP != null ? tvP.Items : tviP?.Items;

                                if (items != null)
                                {
                                    enabled = items.IndexOf(tvi) < items.Count - 1;
                                }

                                mi.IsEnabled = enabled;
                                break;
                        }
                    }
                }
            }
        }

        private static void Mi_Click(object sender, RoutedEventArgs e)
        {
            if (sender is MenuItem mi)
            {
                TreeView tv = mi.Tag as TreeView;
                TVI tvi = mi.Tag as TVI;

                switch (mi.Name)
                {
                    case "add":
                        if (tv != null)
                        {
                            tv.Items.Add(new TVI("Neu", "", true, true, 0));
                            return;
                        }
                        if (tvi != null)
                        {
                            tvi.Items.Add(new TVI("Neu", "", false, false, 0));
                            return;
                        }
                        break;

                    case "del":
                        if (tvi != null)
                        {
                            if (MessageBoxResult.Yes == MessageBox.Show("Wollen Sie " + tvi.title + " wirklich löschen?", caption,
                                MessageBoxButton.YesNo, MessageBoxImage.Question, MessageBoxResult.No))
                            {
                                object parent = tvi.Parent;
                                if (parent is TreeView tvParent)
                                {
                                    tvParent.Items.Remove(tvi);
                                    return;
                                }
                                if (parent is TVI tviParent)
                                {
                                    tviParent.Items.Remove(tvi);
                                    return;
                                }
                            }
                            return;
                        }
                        break;

                    case "move_up":
                        TreeView tvP = tvi?.Parent as TreeView;
                        TVI tviP = tvi?.Parent as TVI;
                        ItemCollection items = tvP != null ? tvP.Items : tviP?.Items;

                        if (items != null)
                        {
                            // index 0 is the container of the editors, but not for level 1
                            int limit = tvP != null ? 0 : 1,
                                pos = items.IndexOf(tvi);
                            if (pos > limit)
                            {
                                items.RemoveAt(pos);
                                items.Insert(pos - 1, tvi);
                            }
                        }
                        break;
                    case "move_down":
                        tvP = tvi?.Parent as TreeView;
                        tviP = tvi?.Parent as TVI;
                        items = tvP != null ? tvP.Items : tviP?.Items;

                        if (items != null)
                        {
                            int pos = items.IndexOf(tvi);
                            if (pos < items.Count - 1)
                            {
                                items.RemoveAt(pos);
                                items.Insert(pos + 1, tvi);
                            }
                        }
                        break;

                    case "save":
                    case "export":
                        try
                        {
                            string res, fn, msg;
                            JsonSerializerSettings settings = new JsonSerializerSettings()
                            {
                                Formatting = Formatting.Indented,
                                NullValueHandling = NullValueHandling.Ignore
                            };

                            if (mi.Name == "save")
                            {
                                res = JsonConvert.SerializeObject(((TVI)tv.Items[0]).AsItem(), settings);
                                fn = App.filename;
                                msg = "Gespeichert:" + Environment.NewLine + fn;
                            }
                            else
                            {
                                res = JsonConvert.SerializeObject(((TVI)tv.Items[0]).AsExportItem(), settings);
                                fn = App.filename.Replace(".work.", ".");
                                msg = "Exportiert:" + Environment.NewLine + fn;
                            }

                            File.WriteAllText(fn, res, Encoding.UTF8);
                            MessageBox.Show(msg, caption, MessageBoxButton.OK, MessageBoxImage.Information);
                        }
                        catch (Exception ex)
                        {
                            MessageBox.Show(ex.Message + Environment.NewLine + ex.StackTrace,
                                caption + " - Fehler", MessageBoxButton.OK, MessageBoxImage.Information);
                        }
                        break;
                }
            }
        }

        #endregion

        #region -- The writing. ------------------------------------------------

        private static string spaces = "                                                                                                     ";
        private static string quote = "\"";
        private static void _readItems(int indent, ItemCollection items, out string msg, out string data)
        {

            msg = string.Empty;
            data = "{" + Environment.NewLine;
            foreach (object tvi0 in items)
            {
                if (tvi0 is TVI tviX)
                {
                    if (msg.Length > 0)
                    {
                        msg += Environment.NewLine;
                    }
                    msg += _indent(indent + 1) + tviX.title;
                    data += _indent(indent + 1) + quote + "title" + quote + ": " + quote + _title(tviX.title) + quote + "," + Environment.NewLine;
                    data += _indent(indent + 1) + quote + "info" + quote + ": " + quote + _md2html(tviX.info) + quote;

                    _readItems(indent + 1, tviX.Items, out string msg2, out string data2);
                    if (msg2.Length > 0)
                    {
                        data += "," + Environment.NewLine;
                        msg += Environment.NewLine + msg2;
                        data += _indent(indent + 1) + quote + "items" + quote + ": " + data2;
                    }
                    if (items.IndexOf(tvi0) < items.Count - 1)
                    {
                        data += ",";
                    }
                    data += Environment.NewLine;
                }
            }
            data += _indent(indent) + "}";
        }

        private static string _indent(int indent)
        {
            return spaces.Substring(0, indent * 3);
        }

        //private static string _inf(string info)
        //{
        //    // return info.Replace(Environment.NewLine, "\\n").Replace("\n", "\\n");
        //    var pipeline = new MarkdownPipelineBuilder().UseAdvancedExtensions().Build();
        //    return Markdown.ToHtml(info, pipeline)
        //        .TrimEnd('\n')
        //        .Replace(">\n<", "><")
        //        .Replace("\n", "<br>");

        //}

        #endregion

        #region -- Output. -----------------------------------------------------

        internal static string _title(string title)
        {
            return title.Replace(quote, "&quote;").Replace("<", "&lt;").Replace(">", "&gt;").Replace("&", "&amp;");
        }

        /// <summary>
        /// Creates the html to display from the markdown source.
        /// </summary>
        /// <param name="info">The source code.</param>
        /// <returns>The html code.</returns>
        internal static string _md2html(string info)
        {
            var pipeline = new MarkdownPipelineBuilder().UseAdvancedExtensions().Build();
            return Markdown.ToHtml(info, pipeline)
                .TrimEnd('\n')
                .Replace(">\n<", "><")
                .Replace("\n", "<br>");
        }

        #endregion
    }
}
