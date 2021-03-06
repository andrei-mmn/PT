﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PowerTables.Filters
{
    /// <summary>
    /// Filter that is attached to specified column
    /// </summary>
    public interface IColumnFilter : IFilter
    {
        /// <summary>
        /// Column name which this filter belongs to
        /// </summary>
        string ColumnName { get; set; }
    }
}
