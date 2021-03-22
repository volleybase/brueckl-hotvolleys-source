using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using System.Windows;

namespace TreeMd
{
    /// <summary>
    /// Interaction logic for App.xaml
    /// </summary>
    public partial class App : Application
    {
        internal static string filename = string.Empty;
        internal static string images = string.Empty;
        internal static string template = string.Empty;
        internal static bool ok = false;

        private void Application_Startup(object sender, StartupEventArgs e)
        {
            if (e.Args.Length > 1)
            {
                string fn = e.Args[0],
                    imgs = e.Args[1];

                if (File.Exists(fn) && Directory.Exists(imgs))
                {
                    filename = fn;
                    images = imgs;
                    if (!images.EndsWith("\\"))
                    {
                        images += "\\";
                    }
                    ok = true;
                }
            }
 
            if (ok)
            {
                try
                {
                    Assembly cur = Assembly.GetExecutingAssembly();
                    using (Stream stream = cur.GetManifestResourceStream("TreeMd.data.template.html"))
                    {
                        using (StreamReader reader = new StreamReader(stream))
                        {
                            string tpl = reader.ReadToEnd();
                            if (!string.IsNullOrEmpty(tpl))
                            {
                                template = tpl;
                            }
                        }
                    }
                }
                catch (Exception)
                {
                    ok = false;
                }
            }

            if (!ok)
            {
                MessageBox.Show("TreeMd <data.json> <preview-image-dir>", "Usage", MessageBoxButton.OK, MessageBoxImage.Information);
            }
        }
    }
}
