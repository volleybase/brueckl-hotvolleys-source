using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace TreeMd
{
#pragma warning disable CS0649, IDE1006

    ///// <summary>
    ///// An item of the data to export.
    ///// </summary>
    //public interface IBaseItem
    //{
    //    string title { get; }
    //    string info { get; }
    //    List<IBaseItem> items { get; }
    //}

    /// <summary>
    /// An item of the data (with the internal data).
    /// </summary>
    internal class Item
    {
        [Newtonsoft.Json.JsonProperty(Order=1)]
        public string title { get; set; }

        [Newtonsoft.Json.JsonProperty(Order = 2)]
        public string info { get; set; }

        [Newtonsoft.Json.JsonProperty(Order = 3)]
        public List<Item> items { get; set; }

        [Newtonsoft.Json.JsonProperty(Order = 4)]
        public bool expanded;

        [Newtonsoft.Json.JsonProperty(Order = 5)]
        public bool expandedContent;

        [Newtonsoft.Json.JsonProperty(Order = 6)]
        public int height;
    }

    /// <summary>
    /// An item of the data for export.
    /// </summary>
    internal class ItemExport
    {
        [Newtonsoft.Json.JsonProperty(Order = 1)]
        public string title { get; set; }

        [Newtonsoft.Json.JsonProperty(Order = 2)]
        public string info { get; set; }

        [Newtonsoft.Json.JsonProperty(Order = 3)]
        public List<ItemExport> items { get; set; }
    }

#pragma warning restore CS0649, IDE1006
}
