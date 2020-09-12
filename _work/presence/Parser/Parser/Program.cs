using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

using Microsoft.Office.Core;
using Microsoft.Office.Interop.Excel;
using Markdig;
using Newtonsoft.Json.Linq;

namespace Parser
{
    class ExcelReader
    {
        private Application xlApp = null;
        private Workbook workbook = null;
        public Worksheet worksheet = null;

        public void Open(string filename, string sheetname)
        {
            xlApp = new Application();
            workbook = xlApp.Workbooks.Open(filename, 0, true, 5, "", "", true, XlPlatform.xlWindows, "\t", false, false, 0, false, 1, 0);
            worksheet = (Worksheet)workbook.Worksheets[sheetname];
        }

        public void Close()
        {
            workbook.Close(false, null, null);
            xlApp.Quit();

            Marshal.ReleaseComObject(worksheet);
            Marshal.ReleaseComObject(workbook);
            Marshal.ReleaseComObject(xlApp);
        }
    }

    class Program
    {
        #region -- The fields. ------------------------------------------------

        private static string fnTpl = @"D:\workdir\brueckl-hotvolleys-source\_work\herzhirn\herzhirn.html";
        private static string fnOut = @"D:\workdir\brueckl-hotvolleys-source\teambuilding\herzhirn_21\index.html";

        private static string fnTargetsA = @"D:\workdir\brueckl-hotvolleys-source\data\training\targets_a.json";
        private static bool rawMode = false;

        private static string fnTodos = @"D:\workdir\brueckl-hotvolleys-source\data\training\";

        #endregion

        #region -- The main entry point. --------------------------------------

        static void Main(string[] args)
        {
            Log("--------------------------------------------------------------------------------------");

            bool ok = false;
            if (args.Length >= 2)
            {
                string filename = args[0],
                    mode = args[1];
                for (int i = 2; i < args.Length; ++i)
                {
                    if (args[i] == "--raw")
                    {
                        rawMode = true;
                    }
                }
                if (File.Exists(filename))
                {
                    switch (mode)
                    {
                        case "HerzHirn":
                            Log("Herz + Hirn");
                            ok = ExportHerzHirn(filename, mode);
                            break;
                        case "Individuelle Hinweise":
                            Log(mode);
                            ok = ExportTargets(filename, mode);
                            break;
                        case "Todos":
                            Log(mode);
                            ok = ExportTodos(filename, mode);
                            break;
                    }
                }
            }

            if (!ok)
            {
                Log("Parser filename modus");
                Log("  filename: The file name of the excel file to read.");
                Log("  modus: HerzHirn, Targets, Todos");
            }
            else
            {
                Log("Done.");
            }

            Log("--------------------------------------------------------------------------------------");
            System.Console.WriteLine("Press Enter...");
            System.Console.ReadLine();
        }

        #endregion

        #region -- Herz + Hirn ------------------------------------------------

        private static bool ExportHerzHirn(string filename, string sheetname)
        {
            bool ok = false;

            ExcelReader er = new ExcelReader();
            er.Open(filename, sheetname);

            Range rg = er.worksheet.UsedRange;

            string a1 = (string)((Range)rg.Cells[1, 1]).Text;
            Log(a1);
            string[] parts = a1.Split(new char[] { ',' });
            if (parts.Length != 2)
            {
                Log("Invalid region: " + a1 + "!");
            }
            else
            {
                int lastCol = _getCol(parts[0].Trim());
                int lastRow = _getRow(parts[1].Trim());

                var items = _readItems(er.worksheet, 2, lastRow, 1, lastCol);

                // read template
                string tpl = File.ReadAllText(fnTpl, Encoding.UTF8);

                // write target
                string result = tpl.Replace("{{data}}", "var data = " + items[0].ToString() + ";");
                File.WriteAllText(fnOut, result, Encoding.UTF8);
                ok = true;
            }

            //workbook.Close(false, null, null);
            //xlApp.Quit();

            //Marshal.ReleaseComObject(worksheet);
            //Marshal.ReleaseComObject(workbook);
            //Marshal.ReleaseComObject(xlApp);
            er.Close();
            return ok;
        }

        private static int _getCol(string colinfo)
        {
            int res = 0;
            byte[] ASCIIValues = Encoding.ASCII.GetBytes(colinfo);
            for (int i = 0; i < ASCIIValues.Length; ++i)
            {
                res = res * 26 + ASCIIValues[i] - 64;
            }
            return res;
        }
        private static int _getRow(string rowinfo)
        {
            if (int.TryParse(rowinfo, out int result))
            {
                return result;
            }
            return 0;
        }

        private static JArray _readItems(Worksheet sheet, int startRow, int lastRow, int col, int lastCol)
        {
            JArray result = new JArray();

            for (int row = startRow; row <= lastRow; ++row)
            {
                string title = (sheet.Cells[row, col] as Range)?.Text as string;
                if (!string.IsNullOrEmpty(title))
                {
                    JObject item = new JObject
                    {
                        { "title", new JValue(_tit(title)) }
                    };

                    string info = (sheet.Cells[row + 1, col] as Range)?.Text as string;
                    if (string.IsNullOrEmpty(info))
                    {
                        info = String.Empty;
                    }
                    item.Add("info", new JValue(_txt(info)));

                    if (col < lastCol)
                    {
                        int lastRow2 = row + 3;
                        string title2;
                        do
                        {
                            title2 = (sheet.Cells[lastRow2, col] as Range)?.Text as string;
                            if (string.IsNullOrEmpty(title2))
                            {
                                title2 = String.Empty;
                                ++lastRow2;
                            }
                            else
                            {
                                --lastRow2;
                            }
                        } while (title2 == String.Empty && lastRow2 < lastRow);

                        JArray items = _readItems(sheet, row + 2, lastRow2, col + 1, lastCol);
                        if (items.Count > 0)
                        {
                            item.Add("items", items);
                        }
                    }

                    result.Add(item);
                    ++row;
                }
            }

            return result;
        }

        #endregion

        #region -- create text for title and content(markdown) ----------------

        private static string _tit(string txt)
        {
            return txt
                .Replace("&", "&amp;")
                .Replace("<", "&lt;")
                .Replace(">", "&gt;")
                .Replace("\"", "&quot;");
        }

        private static string _txt(string txt)
        {
            if (rawMode)
            {
                return txt;
            }

            var pipeline = new MarkdownPipelineBuilder().UseAdvancedExtensions().Build();
            return Markdown.ToHtml(txt, pipeline)
                .TrimEnd('\n')
                // ?? .Replace(">\n<", "><")
                .Replace("\n", "<br>");
        }

        #endregion

        #region -- Logging ----------------------------------------------------

        private static void Log(string txt)
        {
            System.Diagnostics.Debug.WriteLine(txt);
            System.Console.WriteLine(txt);
        }

        #endregion

        #region -- Individuelle Hinweise --------------------------------------

        private static bool ExportTargets(string filename, string sheetname)
        {
            bool ok = false;

            ExcelReader er = new ExcelReader();
            er.Open(filename, sheetname);

            //Range rg = er.worksheet.UsedRange;

            int row = 0,
                limit = 5;

            bool search = true;
            JObject items = new JObject();
            while (search)
            {
                Range rgName = (Range)er.worksheet.Cells[++row, 2];
                Range rgText = (Range)er.worksheet.Cells[row, 3];

                // check height to ignore hidden lines
                double h = (double)rgName.Height;
                if (h > 0)
                {
                    string name = rgName.Text as string;
                    string text = rgText.Text as string;
                    if (string.IsNullOrEmpty(name) || string.IsNullOrEmpty(text))
                    {
                        if (--limit <= 0)
                        {
                            search = false;
                        }
                    }
                    else
                    {
                        limit = 5;
                        // Log(row + " - " + name + "\n" + text);
                        items.Add(name, new JValue(_txt(text)));
                    }
                }
            }
            // Log(items.ToString());
            File.WriteAllText(fnTargetsA, items.ToString(), Encoding.UTF8);
            ok = true;
            er.Close();
            return ok;
        }

        #endregion

        #region -- Todos --

        private static bool ExportTodos(string filename, string sheetname)
        {
            bool ok = false;

            ExcelReader er = new ExcelReader();
            er.Open(filename, sheetname);

            int col = 0,
                initLimit = 5,
                limit = initLimit;
            bool search = true;
            while (search)
            {
                Range rgFn = (Range)er.worksheet.Cells[2, ++col];
                Range rgTxt = (Range)er.worksheet.Cells[3, col];

                // check height to ignore hidden lines
                double w = (double)rgTxt.Width;
                if (w > 0)
                {
                    string fn = rgFn.Text as string;
                    string txt = rgTxt.Text as string;
                    if (string.IsNullOrWhiteSpace(fn) || string.IsNullOrWhiteSpace(txt))
                    {
                        if (--limit <= 0)
                        {
                            search = false;
                        }
                    }
                    else
                    {
                        limit = initLimit;
                        Log(col + " - " + fn);

                        JValue value = new JValue(_txt(txt));
                        // File.WriteAllText(fnTodos + fn, "\"" + value.ToString() + "\"", Encoding.UTF8);
                        File.WriteAllText(fnTodos + fn, value.ToString(), Encoding.UTF8);
                    }
                }
            }

            ok = true;
            er.Close();

            return ok;
        }

        #endregion
    }
}