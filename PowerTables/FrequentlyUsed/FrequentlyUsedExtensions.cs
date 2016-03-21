﻿using System;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Web.Mvc;
using System.Web.Mvc.Html;
using Newtonsoft.Json.Linq;
using PowerTables.Configuration;
using PowerTables.Filters.Select;
using PowerTables.Filters.Value;

namespace PowerTables.FrequentlyUsed
{
    public static class FrequentlyUsedExtensions
    {
        /// <summary>
        /// Shortcut for creating JS function that formats enum-typed column values to specified text specified using enum's fields [Display] attribute.
        /// This method uses MVC GetSelectList function to retrieve enum values.
        /// </summary>
        /// <param name="column">Colum to apply formatting</param>
        /// <returns>Fluent</returns>
        public static ColumnUsage<TSourceData, TTableData, TTableColumn> FormatEnumWithDisplayAttribute
            <TSourceData, TTableData, TTableColumn>(
            this ColumnUsage<TSourceData, TTableData, TTableColumn> column
            ) where TTableData : new()
        {
            const string funtemplate = "function (a) {{ switch(a.{1}) {{ {0} }} }}";

            var enumType = typeof(TTableColumn);
            if (typeof(Nullable<>).IsAssignableFrom(enumType))
            {
                enumType = enumType.GetGenericArguments()[0];
            }
            if (!typeof(Enum).IsAssignableFrom(enumType))
            {
                throw new Exception(
                    String.Format("This method is only applicable for enum columns. {0} column of table {1} is not of enum type",
                    column.ColumnProperty.Name,
                    typeof(TTableData).FullName
                    ));
            }
            var items = EnumHelper.GetSelectList(enumType);
            var cases = items.Select(c => string.Format("case {0}: return \"{1}\";", c.Value, c.Text)).ToList();
            cases.Add("default: return \"\";");
            var code = string.Format(funtemplate, string.Join(String.Empty, cases), column.ColumnProperty.Name);
            column.ValueFunction(code);
            return column;
        }

        /// <summary>
        /// Shortcut for creating JS function that formats boolean column values to specified text
        /// </summary>
        /// <typeparam name="TSourceData"></typeparam>
        /// <typeparam name="TTableData"></typeparam>
        /// <param name="column">Column</param>
        /// <param name="trueText">Text when value is TRUE</param>
        /// <param name="falseText">Text when value is FALSE</param>
        /// <returns>Fluent</returns>
        public static ColumnUsage<TSourceData, TTableData, bool> TextForBoolean
            <TSourceData, TTableData>(
            this ColumnUsage<TSourceData, TTableData, bool> column, string trueText, string falseText
            ) where TTableData : new()
        {
            const string funtemplate = "function (a) {{  if (!a.{0}) return \"{2}\"; else return \"{1}\"; }}";
            column.ColumnConfiguration.CellRenderingValueFunction = new JRaw(String.Format(funtemplate, column.ColumnProperty.Name, trueText, falseText));
            return column;
        }


       /// <summary>
       /// Shortcut for creating multi-select filter for boolean value
       /// </summary>
       /// <typeparam name="TSourceData"></typeparam>
       /// <typeparam name="TTableData"></typeparam>
       /// <param name="column">Column configuration</param>
       /// <param name="sourceColumn">Source column</param>
       /// <param name="trueText">Text for true</param>
       /// <param name="falseText">Text for false</param>
       /// <param name="bothText">Text for both value (a.k.a. "not matter")</param>
       /// <param name="allowBoth">Allow "not matter" case or not</param>
       /// <returns>Value filter</returns>
        public static ValueColumnFilter<TSourceData, bool>
            FilterBoolean
            <TSourceData, TTableData>(
            this ColumnUsage<TSourceData, TTableData, bool> column,
            Expression<Func<TSourceData, bool>> sourceColumn,
            string trueText, string falseText, string bothText = null, bool allowBoth = true
            ) where TTableData : new()
        {
            var items = new[]
            {
                new SelectListItem {Text = trueText,Value = "True"}, 
                new SelectListItem {Text = falseText,Value = "False"} 
            };

            return column.FilterSelect(sourceColumn, items, allowBoth, bothText);
        }

        private static void DoDateFormatColumnUsage<TSourceData, TTableData, TTableColumn>(ColumnUsage<TSourceData, TTableData, TTableColumn> col, string format = null, bool utc = false) where TTableData : new()
        {
            if (string.IsNullOrEmpty(format))
            {
                format = col.Configurator.TableConfiguration.ClientDateTimeFormat;
            }
            const string template = "function(v) {{ if (v.{0}) return dateFormat(v.{0},'{1}',{2}); else return ''; }}";
            var code = string.Format(template, col.ColumnProperty.Name, format, utc ? "true" : "false");

            col.ValueFunction(code);
        }

        /// <summary>
        /// Shortcut for JS function formatting DateTime column value with dateformat.js
        /// </summary>
        /// <param name="col">Column</param>
        /// <param name="format">dateformat.js-friendly format</param>
        /// <param name="utc">"utc" parameter to be supplied to dateformat.js</param>
        public static ColumnUsage<TSourceData, TTableData, DateTime> FormatDateWithDateformatJs<TSourceData, TTableData>(
            this ColumnUsage<TSourceData, TTableData, DateTime> col, string format = null, bool utc = false) where TTableData : new()
        {
            DoDateFormatColumnUsage(col,format,utc);
            return col;
        }

        /// <summary>
        /// Shortcut for JS function formatting DateTime column value with dateformat.js
        /// </summary>
        /// <param name="col">Column</param>
        /// <param name="format">dateformat.js-friendly format</param>
        /// <param name="utc">"utc" parameter to be supplied to dateformat.js</param>
        public static ColumnUsage<TSourceData, TTableData, DateTime?> FormatDateWithDateformatJs<TSourceData, TTableData>(
            this ColumnUsage<TSourceData, TTableData, DateTime?> col, string format = null, bool utc = false) where TTableData : new()
        {

            DoDateFormatColumnUsage(col, format, utc);
            return col;
        }

        /// <summary>
        /// Shortcut for bootstrap glyphicon
        /// </summary>
        /// <param name="glyphiconName">Bootstrap blyphicon class</param>
        /// <param name="flt">Conditional float value</param>
        /// <returns>HTML, span-wrapped string for desired glyphicon</returns>
        public static string GlyphIcon(this string glyphiconName,string flt = null)
        {
            if (string.IsNullOrEmpty(flt))
            {
                return String.Format("<span class=\"glyphicon glyphicon-{0}\"></span>   ", glyphiconName);
            }
            return String.Format("<span class=\"glyphicon glyphicon-{0}\" style=\"float:{1}\"></span>   ", glyphiconName,flt);
        }

       

        
    }
}