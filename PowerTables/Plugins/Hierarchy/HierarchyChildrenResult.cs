﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PowerTables.ResponseProcessing;

namespace PowerTables.Plugins.Hierarchy
{
    public class HierarchyChildrenResult : JsonNetResult
    {
        /// <summary>
        /// Creates new hierarchy children result from set of child nodes
        /// </summary>
        /// <param name="items"></param>
        /// <returns></returns>
        public static HierarchyChildrenResult FromChildren(IEnumerable<IHierarchyItem> items)
        {
            return new HierarchyChildrenResult()
            {
                Data = new HierarchyChildrenInfo()
                {
                    HierarchyItems = items.ToArray()
                }
            };
        }
    }

    public class HierarchyChildrenInfo
    {
        public IHierarchyItem[] HierarchyItems { get; set; }
    }
}
