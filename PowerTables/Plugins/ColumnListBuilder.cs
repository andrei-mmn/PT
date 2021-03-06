﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using PowerTables.Configuration;

namespace PowerTables.Plugins
{
    /// <summary>
    /// Helper builder used to specify required columns
    /// </summary>
    /// <typeparam name="TSourceData"></typeparam>
    /// <typeparam name="TTableData"></typeparam>
    public class ColumnListBuilder<TSourceData, TTableData> where TTableData : new()
    {
        private readonly Configurator<TSourceData, TTableData> _configurator;
        private readonly List<string> _colNames;
        private readonly IReadOnlyCollection<string> _colNamesRo;

        /// <summary>
        /// Required columns names
        /// </summary>
        public IReadOnlyCollection<string> Names
        {
            get { return _colNamesRo; }
        }

        /// <summary>
        /// Constructs new columns list helper builder
        /// </summary>
        /// <param name="configurator"></param>
        public ColumnListBuilder(Configurator<TSourceData, TTableData> configurator)
        {
            _configurator = configurator;
            _colNames = new List<string>();
            _colNamesRo = _colNames.AsReadOnly();
        }

        /// <summary>
        /// Include specified column
        /// </summary>
        /// <typeparam name="TTableColumn"></typeparam>
        /// <param name="column">Column to include</param>
        /// <returns>Fluent</returns>
        public ColumnListBuilder<TSourceData, TTableData> Include<TTableColumn>(
            Expression<Func<TTableData, TTableColumn>> column)
        {
            var info = LambdaHelpers.ParsePropertyLambda(column);
            if (_colNames.Contains(info.Name)) return this;
            _colNames.Add(info.Name);
            return this;
        }

        /// <summary>
        /// Include all columns
        /// </summary>
        /// <returns>Fluent</returns>
        public ColumnListBuilder<TSourceData, TTableData> IncludeAll()
        {
            _colNames.AddRange(_configurator.TableColumnsDictionary.Select(c => c.Key));
            return this;
        }

        /// <summary>
        /// Exclude specified column
        /// </summary>
        /// <typeparam name="TTableColumn"></typeparam>
        /// <param name="column">Column</param>
        /// <returns>Fluent</returns>
        public ColumnListBuilder<TSourceData, TTableData> Except<TTableColumn>(
            Expression<Func<TTableData, TTableColumn>> column)
        {
            var info = LambdaHelpers.ParsePropertyLambda(column);
            if (!_colNames.Contains(info.Name)) return this;
            _colNames.Remove(info.Name);
            return this;
        }
    }
}
