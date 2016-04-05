﻿using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Web.Mvc;

using Newtonsoft.Json;
using PowerTables.Configuration.Json;
using PowerTables.Defaults;
using PowerTables.Filters;
using PowerTables.ResponseProcessing;

namespace PowerTables.Configuration
{
    /// <summary>
    /// PowerTables table configurator. 
    /// This class stores configuration for all columns, filters, plugins etc and also 
    /// server processing configuration. It is able to extract necessary JSON configuration and provide it to 
    /// client side. 
    /// This class is entry point for entire PowerTables. 
    /// It is configurable in a fluent way so feel free to write tables configuration 
    /// as fluent method chains. Then simply create table configurator where it is needed and 
    /// configure with corresponding method chain. 
    /// To draw table on a web page create placeholder div, assign ID to it 
    /// then call <see cref="JsonConfig"/> method to obtain javascript configuration code to be inserted 
    /// to page. 
    /// </summary>
    /// <typeparam name="TSourceData">Type of source raw data</typeparam>
    /// <typeparam name="TTableData">Type of target table data</typeparam>
    public class Configurator<TSourceData, TTableData> : IConfigurator where TTableData : new()
    {
        #region Private fields
        private readonly TableConfiguration _tableConfiguration;
        private readonly Dictionary<PropertyInfo, IColumnConfigurator> _configurators = new Dictionary<PropertyInfo, IColumnConfigurator>();
        private readonly Dictionary<PropertyInfo, ColumnConfiguration> _columnsConfiguration = new Dictionary<PropertyInfo, ColumnConfiguration>();

        private readonly PropertyInfo[] _tableColumns;
        private readonly IReadOnlyDictionary<string, PropertyInfo> _tableColumnsDictionary;
        private readonly IReadOnlyDictionary<string, PropertyInfo> _sourceColumnsDictionary;

        private readonly Dictionary<string, Type> _commandHandlersTypes = new Dictionary<string, Type>();
        private readonly HashSet<IResponseModifier> _responseModifiers = new HashSet<IResponseModifier>();
        private readonly HashSet<IFilter> _filters = new HashSet<IFilter>();
        private readonly Dictionary<string, IColumnFilter> _colFilters = new Dictionary<string, IColumnFilter>();

        private readonly Dictionary<PropertyInfo, Delegate> _mappingDelegates = new Dictionary<PropertyInfo, Delegate>();

        private readonly Dictionary<PropertyInfo, LambdaExpression> _orderingExpressions = new Dictionary<PropertyInfo, LambdaExpression>();
        private Func<IQueryable<TSourceData>, IQueryable<TTableData>> _projection;
        private LambdaExpression _fallbackOrdering;
        #endregion

        #region Properties

        /// <summary>
        /// Field containing expression for ordering fallback value. 
        /// Use corresponding configuration method to set this property. 
        /// See <see cref="ConfiguratorExtensions.OrderFallback{TSourceData,TTableData,T}"/>
        /// </summary>
        public LambdaExpression FallbackOrdering
        {
            get { return _fallbackOrdering; }
            internal set
            {
                if (_fallbackOrdering != null)
                {
                    throw new Exception("Fallback ordering could be set only once. Probably there is configuration issue. To avoid this message please use Configurator.RegisterFallbackOrdering(...) method.");
                }
                _fallbackOrdering = value;
            }
        }

        /// <summary>
        /// Projection function used to map source IQueryable to target IQueryable
        /// </summary>
        public Func<IQueryable<TSourceData>, IQueryable<TTableData>> Projection
        {
            get { return _projection; }
            internal set
            {
                if (_mappingDelegates.Any())
                {
                    throw new Exception(
                        "Mapping delegates and projection could not be used at the same time. Please don't configure projection either remove all .MappedFrom(...) calls");
                }
                _projection = value;
            }
        }

        internal IReadOnlyDictionary<string, Type> CommandHandlerTypes { get { return _commandHandlersTypes; } }
        internal HashSet<IResponseModifier> ResponseModifiers { get { return _responseModifiers; } }

        public TableConfiguration TableConfiguration { get { return _tableConfiguration; } }
        public Type SourceType { get { return typeof(TSourceData); } }
        public Type TableType { get { return typeof(TTableData); } }
        public PropertyInfo[] TableColumns { get { return _tableColumns; } }
        public IReadOnlyDictionary<string, PropertyInfo> TableColumnsDictionary { get { return _tableColumnsDictionary; } }


        #endregion

        /// <summary>
        /// Constructs new table configurator
        /// </summary>
        public Configurator()
        {
            PropertyInfo[] sourceColumns;
            ReflectionCache.GetCachedProperties<TTableData>(out _tableColumns, out _tableColumnsDictionary);
            ReflectionCache.GetCachedProperties<TSourceData>(out sourceColumns, out _sourceColumnsDictionary);

            _tableConfiguration = new TableConfiguration();
            InitializeColumnsConfiguration();
            RegisterCommandHandler<DefaultCommandHandler>(DefaultCommandHandler.CommandId);
        }


        private void InitializeColumnsConfiguration()
        {
            foreach (var tableDataProperty in _tableColumns)
            {
                var typeName = tableDataProperty.PropertyType.Name;
                if (tableDataProperty.PropertyType.IsNullable())
                {
                    typeName = tableDataProperty.PropertyType.GetArg().Name + "?";
                }
                var columnConfiguration = new ColumnConfiguration
                {
                    ColumnType = typeName,
                    RawColumnName = tableDataProperty.Name,
                    Title = tableDataProperty.Name,
                };
                var attr = tableDataProperty.GetCustomAttribute<DisplayAttribute>();
                if (attr != null)
                {
                    if (!string.IsNullOrEmpty(attr.Name)) columnConfiguration.Title = attr.Name;
                }
                _columnsConfiguration[tableDataProperty] = columnConfiguration;
                _tableConfiguration.Columns.Add(columnConfiguration);
            }
        }

        #region Configurator
        /// <summary>
        /// Retrieves column configurator
        /// </summary>
        /// <typeparam name="TColType">Column type</typeparam>
        /// <param name="column">Column</param>
        /// <returns>Corresponding column configurator</returns>
        public ColumnUsage<TSourceData, TTableData, TColType> @Column<TColType>(Expression<Func<TTableData, TColType>> column)
        {
            var targetProperty = LambdaHelpers.ParsePropertyLambda(column);
            targetProperty = _tableColumnsDictionary[targetProperty.Name];
            if (_configurators.ContainsKey(targetProperty)) return (ColumnUsage<TSourceData, TTableData, TColType>)_configurators[targetProperty];
            ColumnUsage<TSourceData, TTableData, TColType> usage = new ColumnUsage<TSourceData, TTableData, TColType>(this, column, GetColumnConfiguration(targetProperty));
            _configurators[targetProperty] = usage;
            return usage;
        }

       
        public ColumnConfiguration GetColumnConfiguration(PropertyInfo property)
        {
            return _columnsConfiguration[property];
        }

        /// <summary>
        /// Retrieves column ordering expression
        /// </summary>
        public LambdaExpression GetOrderingExpression(string columnName)
        {
            this.CheckTableColum(columnName);
            return _orderingExpressions[_tableColumnsDictionary[columnName]];
        }

        #endregion

        #region Result operations

        /// <summary>
        /// Wraps result object into existing array at specified index
        /// </summary>
        /// <param name="dataArray">Existing data array</param>
        /// <param name="index">Index</param>
        /// <param name="value">Result row</param>
        public void EncodeResult(object[] dataArray, ref int index, object value)
        {
            foreach (var p in _tableColumns)
            {
                dataArray[index] = p.GetValue(value, null);
                index++;
            }
        }
        public object[] EncodeResults(object[] resultRows)
        {
            object[] result = new object[resultRows.Length * TableColumns.Length];
            int index = 0;
            foreach (var resultRow in resultRows)
            {
                EncodeResult(result, ref index, resultRow);
            }
            return result;
        }
        
        public object[] EncodeResults(IEnumerable resultRows, int resultsCount)
        {
            object[] result = new object[resultsCount * TableColumns.Length];
            int index = 0;
            foreach (var resultRow in resultRows)
            {
                EncodeResult(result, ref index, resultRow);
            }
            return result;
        }

        /// <summary>
        /// Wraps result object into existing array at specified index
        /// </summary>
        /// <param name="resultRows">Existing data set</param>
        public object[] EncodeResults(IQueryable<TTableData> resultRows)
        {
            var results = resultRows.ToArray();
            return EncodeResults(results, results.Length);
        }


        public object[] EncodeResults<T>(IQueryable<T> resultRows)
        {
            var results = resultRows.ToArray();
            return EncodeResults(results, results.Length);
        }
        #endregion

      
        #region Registrations

        public void RegisterCommandHandler<THandler>(string command)
            where THandler : ICommandHandler
        {
            if (_commandHandlersTypes.ContainsKey(command))
            {
                var existingHandler = _commandHandlersTypes[command];

                string error =
                    String.Format(
                        "Duplicate column handler specification for command '{0}'. This command is already handled by {1}"
                        , command
                        , existingHandler.FullName
                        );

                throw new Exception(error);
            }
            _commandHandlersTypes.Add(command, typeof(THandler));
        }

        
        public void RegisterResponseModifier(IResponseModifier modifier)
        {

            if (!_responseModifiers.Contains(modifier))
            {
                _responseModifiers.Add(modifier);
            }
        }
        
        public void RegisterFilter(IFilter typedFilter)
        {
            if (_filters.Contains(typedFilter))
            {
                throw new Exception("This instance of filter is already exists on table");
            }
            _filters.Add(typedFilter);
            var columnFilter = typedFilter as IColumnFilter;
            if (columnFilter != null)
            {
                _colFilters[columnFilter.ColumnName] = columnFilter;
            }
        }
        
        public IColumnFilter GetFilter(string columnName)
        {
            if (!_colFilters.ContainsKey(columnName)) return null;
            return _colFilters[columnName];
        }

        internal IEnumerable<ITypedFilter<T>> GetFilters<T>()
        {
            return _filters.Cast<ITypedFilter<T>>();
        }

        /// <summary>
        /// Register delegate for evaluating specific colum from source data
        /// </summary>
        /// <param name="tableColumn">Table column</param>
        /// <param name="mappingMethod">Function for evaluation</param>
        public void RegisterMapping(PropertyInfo tableColumn, Delegate mappingMethod)
        {
            tableColumn = this.CheckTableColum(tableColumn);
            if (_projection != null)
            {
                throw new Exception(
                        "Mapping delegates and projection could not be used at the same time. Please don't configure projection either remove all .MappedFrom(...) calls");

            }
            _mappingDelegates[tableColumn] = mappingMethod;
        }

        /// <summary>
        /// Associates ordering expression with column
        /// </summary>
        /// <param name="column">Column</param>
        /// <param name="expression">Ordering lambda expression</param>
        public void RegisterOrderingExpression(PropertyInfo column, LambdaExpression expression)
        {
            column = this.CheckTableColum(column);
            _orderingExpressions[column] = expression;
        }
        #endregion

        #region Initialization code

        /// <summary>
        /// Returns MvcHtmlString that contains JSON table configuration that is used to construct
        /// Javascript PowerTables object. 
        /// PowerTables client-side is highly dependant on large JSON configuration. 
        /// So <see cref="Configurator{TSourceData,TTableData}"/> is initially set of helper methods 
        /// helping to build this JSON configuration. 
        /// This overload of JsonConfig consumes "static data". Static data is data class that 
        /// is well-known before table initialization and is being sent within every request. 
        /// You are not able to change it during request handling but can use it to store any payload 
        /// that is known before table construction.
        /// </summary>
        /// <typeparam name="TStaticData">Static data type</typeparam>
        /// <param name="rootId">Id of an HTML element that will contain table</param>
        /// <param name="staticData">Static data instance</param>
        /// <returns>MvcHtmlString containing javascript initialization code</returns>
        public MvcHtmlString JsonConfig<TStaticData>(string rootId, TStaticData staticData = null) where TStaticData : class
        {
            TableConfiguration tc = TableConfiguration;
            tc.TableRootId = rootId;
            if (staticData != null)
            {
                tc.StaticData = JsonConvert.SerializeObject(staticData);
            }
            string json = JsonConvert.SerializeObject(tc, SerializationSettings.ConfigSerializationSettings);
            return MvcHtmlString.Create(json);
        }

        /// <summary>
        /// Returns MvcHtmlString that contains JSON table configuration that is used to construct
        /// Javascript PowerTables object. 
        /// PowerTables client-side is highly dependant on large JSON configuration. 
        /// So <see cref="Configurator{TSourceData,TTableData}"/> is initially set of helper methods 
        /// helping to build this JSON configuration. 
        /// </summary>
        /// <param name="rootId">Id of an HTML element that will contain table</param>
        /// <returns>MvcHtmlString containing javascript initialization code</returns>
        public MvcHtmlString JsonConfig(string rootId)
        {
            return JsonConfig<object>(rootId);
        }

        /// <summary>
        /// Returns MvcHtmlString that contains Javascript initialization code (not only config) 
        /// for table. 
        /// PowerTables client-side is highly dependant on large JSON configuration. 
        /// So <see cref="Configurator{TSourceData,TTableData}"/> is initially set of helper methods 
        /// helping to build this JSON configuration. 
        /// This overload of InitializationCode consumes "static data". Static data is data class that 
        /// is well-known before table initialization and is being sent within every request. 
        /// You are not able to change it during request handling but can use it to store any payload 
        /// that is known before table construction.
        /// </summary>
        /// <typeparam name="TStaticData">Static data type</typeparam>
        /// <param name="rootId">Id of an HTML element that will contain table</param>
        /// <param name="variableName">Expression that new PowerTables javascript object will be assigned to</param>
        /// <param name="staticData">Static data instance</param>
        /// <returns>MvcHtmlString containing javascript initialization code</returns>
        public MvcHtmlString InitializationCode<TStaticData>(string rootId, string variableName, TStaticData staticData) where TStaticData : class
        {
            var jsonConfig = JsonConfig(rootId, staticData);
            const string codeTemplate = "{0} = new PowerTables.PowerTable({1});";
            return MvcHtmlString.Create(String.Format(codeTemplate, variableName, jsonConfig));
        }

        /// <summary>
        /// Returns MvcHtmlString that contains Javascript initialization code (not only config) 
        /// for table. 
        /// PowerTables client-side is highly dependant on large JSON configuration. 
        /// So <see cref="Configurator{TSourceData,TTableData}"/> is initially set of helper methods 
        /// helping to build this JSON configuration. 
        /// </summary>
        /// <param name="rootId">Id of an HTML element that will contain table</param>
        /// <param name="variableName">Expression that new PowerTables javascript object will be assigned to</param>
        /// <returns>MvcHtmlString containing javascript initialization code</returns>
        public MvcHtmlString InitializationCode(string rootId, string variableName)
        {
            return InitializationCode<object>(rootId, variableName, null);
        }
        #endregion

        /// <summary>
        /// Converts source data entry to table row according to mapping functions and property names
        /// </summary>
        /// <param name="src">Source data entry</param>
        /// <returns>Table row data entry</returns>
        public TTableData Map(TSourceData src)
        {
            var tableData = new TTableData();
            foreach (var tableDataProperty in _tableColumns)
            {
                if (_mappingDelegates.ContainsKey(tableDataProperty))
                {
                    object val = _mappingDelegates[tableDataProperty].DynamicInvoke(src);
                    tableDataProperty.SetValue(tableData, val);
                }
                else
                {
                    if (_sourceColumnsDictionary.ContainsKey(tableDataProperty.Name))
                    {
                        var srcProp = _sourceColumnsDictionary[tableDataProperty.Name];
                        object val = srcProp.GetValue(src);
                        object converted = ValueConverter.MapValue(val, tableDataProperty.PropertyType, this);
                        tableDataProperty.SetValue(tableData, converted);
                    }
                }
            }
            return tableData;
        }

        internal Func<int> CustomTotalCountFunction { get; set; }
    }
}
