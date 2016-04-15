﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PowerTables.Templating.BuiltIn
{
    public class CellWrapperTemplateRegion<T> :ModeledTemplateRegion<ICellModel<T>>, 
        IProvidesContent,
        IProvidesTracking

    {
        

        public bool IsTrackSet { get; set; }

        public CellWrapperTemplateRegion(string prefix, string id, TextWriter writer) : base(prefix, id, writer)
        {
        }
    }

    public interface ICellModel
    {
        /// <summary>
        /// Column related to cell
        /// </summary>
        IColumn Column { get; }

        /// <summary>
        /// Data for this particular cell
        /// </summary>
        object Data { get; }
    }

    /// <summary>
    /// Model interface for cell wrapper
    /// </summary>
    public interface ICellModel<T> : ICellModel
    {
        /// <summary>
        /// Row related to cell
        /// </summary>
        IRowModel<T> Row { get; }

        

        /// <summary>
        /// Data object
        /// </summary>
        T DataObject { get; }
        
    }

    public static class CellWrapperExtensions
    {
        public static CellWrapperTemplateRegion<T> CellWrapper<T>(this TemplatesPageBase t, string templateId = "cellWrapper")
        {
            return new CellWrapperTemplateRegion<T>(t.Model.Prefix,templateId,t.Output);
        }

        public static CellWrapperTemplateRegion<dynamic> CellWrapper(this TemplatesPageBase t, string templateId = "cellWrapper")
        {
            return new CellWrapperTemplateRegion<dynamic>(t.Model.Prefix,templateId, t.Output);
        }
    }
}
