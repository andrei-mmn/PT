﻿using System;
using System.Globalization;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using Newtonsoft.Json.Linq;

namespace PowerTables.Configuration
{
    /// <summary>
    /// Extensions for table configurator
    /// </summary>
    public static class ConfiguratorExtensions
    {
        /// <summary>
        /// Checks that specified column belongs to target table data
        /// </summary>
        /// <param name="c">Table configurator</param>
        /// <param name="column">Column PropertyInfo</param>
        public static PropertyInfo CheckTableColum(this IConfigurator c, PropertyInfo column)
        {
            CheckTableColum(c, column.Name);

            //if (c.TableColumnsDictionary[column.Name] != column) throw new Exception(
            //     String.Format("Property {0} does not belong to table of type {1}", column.Name, c.TableType.FullName));
            // todo : does not work with inherited properties
            return c.TableColumnsDictionary[column.Name];
        }

        /// <summary>
        /// Determines is there column of specific name in configurator
        /// </summary>
        /// <param name="conf">Table configurator</param>
        /// <param name="columnName">Raw column name</param>
        /// <returns>True if column presents,false otherwise</returns>
        public static bool HasColumn(IConfigurator conf, string columnName)
        {
            return conf.TableColumnsDictionary.ContainsKey(columnName);
        }

        /// <summary>
        /// Returns type of column with specfied name
        /// </summary>
        /// <param name="conf">Configurator</param>
        /// <param name="columnName">Raw column name</param>
        /// <returns>Type of column having mentioned column name</returns>
        public static Type GetColumnType(IConfigurator conf, string columnName)
        {
            if (!HasColumn(conf, columnName)) return null;
            return conf.TableColumnsDictionary[columnName].PropertyType;
        }

        /// <summary>
        /// Checks that specified column belongs to target table data
        /// </summary>
        /// <param name="c">Table configurator</param>
        /// <param name="column">Column name</param>
        public static void CheckTableColum(this IConfigurator c, string column)
        {
            if (!c.TableColumnsDictionary.ContainsKey(column)) throw new Exception(
               String.Format("Property {0} does not belong to table of type {1}", column, c.TableType.FullName));

        }

        /// <summary>
        /// Disables or enables immediate fetching of table data from server
        /// </summary>
        /// <param name="c">Table configurator</param>
        /// <param name="load">Load (or not)</param>
        /// <returns>Fluent</returns>
        public static Configurator<TSourceData, TTableData> LoadImmediately<TSourceData, TTableData>(this Configurator<TSourceData, TTableData> c, bool load) where TTableData : new()
        {
            c.TableConfiguration.LoadImmediately = load;
            return c;
        }

        /// <summary>
        /// Set cell element. The default is "td". Without parentheses
        /// </summary>
        /// <param name="c">Table configurator</param>
        /// <param name="cellElement">Cell HTML tag</param>
        /// <returns>Fluent</returns>
        public static Configurator<TSourceData, TTableData> Cell<TSourceData, TTableData>(this Configurator<TSourceData, TTableData> c, string cellElement) where TTableData : new()
        {
            c.TableConfiguration.DefaultCellElement = cellElement;
            return c;
        }

        /// <summary>
        /// Set row element. The default is "tr". Without parentheses
        /// </summary>
        /// <param name="c">Table configurator</param>
        /// <param name="rowElement">Row HTML tag</param>
        /// <returns>Fluent</returns>
        public static Configurator<TSourceData, TTableData> Row<TSourceData, TTableData>(this Configurator<TSourceData, TTableData> c, string rowElement) where TTableData : new()
        {
            c.TableConfiguration.DefaultRowElement = rowElement;
            return c;
        }

        /// <summary>
        /// Sets main operational URL of whole table. 
        /// Usually this URL should point to controller action that will return result of .HandleResponse/ await .HandleResponseAsync of table handler
        /// </summary>
        /// <param name="c">Table configurator</param>
        /// <param name="url">Server handling URL</param>
        /// <returns></returns>
        public static Configurator<TSourceData, TTableData> Url<TSourceData, TTableData>(this Configurator<TSourceData, TTableData> c, string url) where TTableData : new()
        {
            c.TableConfiguration.OperationalAjaxUrl = url;
            return c;
        }

        /// <summary>
        /// Sets up datetime configuration for table.
        /// Since handling DateTime through JSON, JS/HTML and MVC is big problem then here
        /// we have this method which will allow you to specify custom JS function for constructing datepicker
        /// and also specifying client and server date formats.
        /// </summary>
        /// <param name="c">Table configurator</param>
        /// <param name="datePickerFunction">JS function text to create datepicker. It supplies "input" element to be datepickered as first argument and client format string as second argument</param>
        /// <param name="clientDateTimeFormat">DateTime format that will be used on client-side</param>
        /// <param name="serverDateTimeFormat">DateTime format that will be used to deserialize client datetime string on server</param>
        /// <returns></returns>
        public static Configurator<TSourceData, TTableData> DatePicker<TSourceData, TTableData>(this Configurator<TSourceData, TTableData> c, string datePickerFunction, string clientDateTimeFormat, string serverDateTimeFormat) where TTableData : new()
        {
            c.TableConfiguration.DatePickerFunction = new JRaw(datePickerFunction);
            c.TableConfiguration.ClientDateTimeFormat = clientDateTimeFormat;
            c.TableConfiguration.ServerDateTimeFormat = serverDateTimeFormat;
            return c;
        }

        /// <summary>
        /// Method to apply for converting TSourceData (source data records) to TTargetData (data records that should be displayed in table)
        /// </summary>
        /// <param name="c">Table configurator</param>
        /// <param name="projectionExpression">Function that will be applied to source set (filtered, ordered and cut) to get resulting set</param>
        /// <returns>Fluent</returns>
        public static Configurator<TSourceData, TTableData> ProjectDataWith<TSourceData, TTableData>(this Configurator<TSourceData, TTableData> c,
            Func<IQueryable<TSourceData>, IQueryable<TTableData>> projectionExpression) where TTableData : new()
        {
            c.Projection = projectionExpression;
            return c;
        }

        /// <summary>
        /// Parses DateTime from string according to table configuration settings
        /// </summary>
        /// <param name="conf">Table configurator</param>
        /// <param name="dateTime">Date-Time in string form</param>
        /// <returns>Datetime instance</returns>
        public static DateTime ParseDateTime(this IConfigurator conf, string dateTime)
        {
            if (!string.IsNullOrEmpty(conf.TableConfiguration.ServerDateTimeFormat))
            {
                return DateTime.ParseExact(dateTime, conf.TableConfiguration.ServerDateTimeFormat,
                    CultureInfo.InvariantCulture);
            }
            return DateTime.Parse(dateTime);
        }

        /// <summary>
        /// Registers column mapping to be used in case of disabled .ProjectDataWith. 
        /// .MappedFrom functions are being called simultaneously when evaluating resulting data set to be sent to client
        /// </summary>
        /// <param name="conf">Table configurator</param>
        /// <param name="converter">Mapping function</param>
        /// <returns></returns>
        public static ColumnUsage<TSourceData, TTableData, TTableColumn> MappedFrom<TSourceData, TTableData, TTableColumn>(this ColumnUsage<TSourceData, TTableData, TTableColumn> conf, Func<TSourceData, TTableColumn> converter) where TTableData : new()
        {
            conf.Configurator.RegisterMapping(conf.ColumnProperty, converter);
            return conf;
        }

        /// <summary>
        /// Sets up column title
        /// </summary>
        /// <param name="conf">Column</param>
        /// <param name="title">Title text</param>
        /// <returns>Fluent</returns>
        public static ColumnUsage<TSourceData, TTableData, TTableColumn> Title<TSourceData, TTableData, TTableColumn>(this ColumnUsage<TSourceData, TTableData, TTableColumn> conf, string title) where TTableData : new()
        {
            conf.ColumnConfiguration.Title = title;
            return conf;
        }

        /// <summary>
        /// Specifies handlebarsjs template id to be used for rendering of this column. 
        /// Specified template will be compiled at the beginnig of processing. 
        /// JSON-ed TTableData is used as tempalte model. So you can use all columns and not only current  
        /// column value
        /// </summary>
        /// <param name="conf">Column</param>
        /// <param name="templateId">Template id (without "#" or other selectors)</param>
        /// <returns>Fluent</returns>
        public static ColumnUsage<TSourceData, TTableData, TTableColumn> TemplateId<TSourceData, TTableData, TTableColumn>(this ColumnUsage<TSourceData, TTableData, TTableColumn> conf, string templateId) where TTableData : new()
        {
            if (
                (conf.ColumnConfiguration.CellRenderingHtmlFunction != null)
                || (conf.ColumnConfiguration.CellRenderingValueFunction != null))
            {
                throw new Exception("Column has already specified HTML or value function. TemplateId is redundant. Please remove it.");
            }
            conf.ColumnConfiguration.CellRenderingTemplateId = templateId;
            return conf;
        }

        /// <summary>
        /// Specifies function that should return HTML string to be inserted to resulting table
        /// </summary>
        /// <param name="conf">Column</param>
        /// <param name="function">JS function text. Like "function(v){ ... }"</param>
        /// <returns>Fluent</returns>
        public static ColumnUsage<TSourceData, TTableData, TTableColumn> HtmlFunction<TSourceData, TTableData, TTableColumn>(this ColumnUsage<TSourceData, TTableData, TTableColumn> conf, string function) where TTableData : new()
        {

            if (
                !string.IsNullOrEmpty(conf.ColumnConfiguration.CellRenderingTemplateId)
                || (conf.ColumnConfiguration.CellRenderingValueFunction != null))
            {
                throw new Exception("Column has already specified TempalteId or value function. HTML function is redundant. Please remove it.");
            }
            conf.ColumnConfiguration.CellRenderingHtmlFunction = new JRaw(function);
            return conf;
        }

        /// <summary>
        /// Specifies function that should return plain text value string to be inserted to resulting table
        /// </summary>
        /// <param name="conf">Column</param>
        /// <param name="function">JS function text. Like "function(v){ ... }"</param>
        /// <returns>Fluent</returns>
        public static ColumnUsage<TSourceData, TTableData, TTableColumn> ValueFunction<TSourceData, TTableData, TTableColumn>
            (this ColumnUsage<TSourceData, TTableData, TTableColumn> conf, string function) where TTableData : new()
        {

            if (
                (conf.ColumnConfiguration.CellRenderingHtmlFunction != null)
                || !string.IsNullOrEmpty(conf.ColumnConfiguration.CellRenderingTemplateId))
            {
                throw new Exception("Column has already specified TemplateId or HTML function. ValueFunction is redundant. Please remove it.");
            }
            conf.ColumnConfiguration.CellRenderingValueFunction = new JRaw(function);
            return conf;
        }

        /// <summary>
        /// Throws exception if column already contains filter instance. 
        /// This method is only left for plugins development.
        /// </summary>
        /// <param name="conf">Column</param>
        public static void ThrowIfFilterPresents<TSourceData, TTableData, TTableColumn>(this ColumnUsage<TSourceData, TTableData, TTableColumn> conf) where TTableData : new()
        {
            if (conf.ColumnConfiguration.Filter != null)
            {
                throw new Exception(String.Format("there is already defined filter {0} on column {1}", conf.ColumnConfiguration.Filter.FilterKey, conf.ColumnProperty.Name));
            }
        }

        /// <summary>
        /// Sets up ordering fallback. 
        /// Some frameworks are not working if no OrderBy supplied (like EF). 
        /// So this function will specify "ordering fallback" - an .OrderBy that will be applied 
        /// to source set if no ordering provided.
        /// </summary>
        /// <param name="c">Table configurator</param>
        /// <param name="fallbackOrdering">Ordering expression</param>
        /// <returns>Fluent</returns>
        public static Configurator<TSourceData, TTableData> OrderFallback<TSourceData, TTableData, T>(
            this Configurator<TSourceData, TTableData> c,
            Expression<Func<TSourceData, T>> fallbackOrdering) where TTableData : new()
        {
            c.FallbackOrdering = fallbackOrdering;
            return c;
        }


        /// <summary>
        /// Instructs Lattice do not to create column for this property. 
        /// Specified column will be passed to client but will not be displayed in table. 
        /// It is useful to optimize table rendering by excluding data that not required as separate column 
        /// but still used for Value/HTML function
        /// </summary>
        /// <param name="conf">Column configuration</param>
        public static void DataOnly<TSourceData, TTableData, TTableColumn>
            (this ColumnUsage<TSourceData, TTableData, TTableColumn> conf) where TTableData : new()
        {
            conf.ColumnConfiguration.IsDataOnly = true;
        }
    }
}