﻿using System;
using System.Linq;
using System.Reflection;
using PowerTables.Configuration;
using PowerTables.Configuration.Json;

namespace PowerTables.Plugins.Hideout
{
    /// <summary>
    /// Extensions for Hideout plugin. 
    /// Hideout plugin is used to show/hide columns in resulting table. 
    /// Also this plugin optionally could output menu for dynamic showing and hiding 
    /// columns.
    /// </summary>
    public static class HideoutExtensions
    {
        public const string PluginId = "Hideout";

        /// <summary>
        /// Hides specified column on client-side. 
        /// Hidden column will not be displayed but will be rendered to DOM to be able hidden/shown by target user
        /// </summary>
        /// <param name="column">Column</param>
        /// <returns>Fluent</returns>
        public static ColumnUsage<TSourceData, TTableData, TTableColumn> 
            Hide
            <TSourceData, TTableData, TTableColumn>(
            this ColumnUsage<TSourceData, TTableData, TTableColumn> column) where TTableData : new()
        {
            var exConf = column.Configurator.TableConfiguration.GetPluginConfig<HideoutClientConfiguration>(PluginId);

            if (exConf == null)
            {
                column.Configurator.TableConfiguration.ReplacePluginConfig(PluginId,new HideoutClientConfiguration(){ShowMenu = false},PluginPosition.LeftBottom );
            }

            column.ColumnConfiguration.ReplacePluginConfig(PluginId,new HideoutCellConfiguration(){Hidden = true});
            return column;
        }

        /// <summary>
        /// Makes table to show/hide columns. 
        /// Also this method adds menu with ability to hide/show columns as an option. 
        /// Warning! This method should be called before using .Hide. Otherwise .Hide wont 
        /// take effect.
        /// </summary>
        /// <param name="conf">Table configurator</param>
        /// <param name="columns">Hideable columns to show in hideout menu</param>
        /// <param name="showMenu">Show menu or not</param>
        /// <param name="position">Menu position</param>
        /// <param name="reloadTableOnHide">When true then forces table reloading when user shows/hides columns</param>
        /// <returns>Fluent</returns>
        public static Configurator<TSourceData, TTableData> 
            HideoutMenu
            <TSourceData, TTableData>(
            this Configurator<TSourceData, TTableData> conf, 
            Action<ColumnListBuilder<TSourceData,TTableData>> columns,
            bool showMenu = true,
            PluginPosition position = PluginPosition.RightTop,
            bool reloadTableOnHide = false
            ) where TTableData : new()
        {
            ColumnListBuilder<TSourceData,TTableData> bldr = new ColumnListBuilder<TSourceData, TTableData>(conf);
            columns(bldr);
            HideoutClientConfiguration cc = new HideoutClientConfiguration()
            {
                ShowMenu = showMenu,
                HidebleColumnsNames = bldr.Names.ToList(),
                ReloadTableOnChangeHidden = reloadTableOnHide
            };
            conf.TableConfiguration.ReplacePluginConfig(PluginId, cc, position);

            return conf;

        }

        private const string HideoutHiddenAdditionalDataKey = "HideoutHidden";
        private const string HideoutShownAdditionalDataKey = "HideoutShown";

        #region Hidden columns in request
        /// <summary>
        /// Returns all columns that are being hidden on client-side
        /// </summary>
        /// <param name="request">Request</param>
        /// <param name="conf">Table configurator</param>
        /// <returns>Array of PropertyInfos that are hidden</returns>
        public static PropertyInfo[] GetHiddenColumns(this PowerTableRequest request, IConfigurator conf)
        {
            return GetHiddenColumns(request.Query, conf);
        }

        /// <summary>
        /// Returns all columns that are being hidden on client-side
        /// </summary>
        /// <param name="request">Request</param>
        /// <returns>Array of strings denoting names of hidden columns</returns>
        public static string[] GetHiddenColumns(this PowerTableRequest request)
        {
            return GetHiddenColumns(request.Query);
        }

        /// <summary>
        /// Returns all columns that are being hidden on client-side
        /// </summary>
        /// <param name="request">Request</param>
        /// <param name="conf">Table configurator</param>
        /// <returns>Array of PropertyInfos that are hidden</returns>
        public static PropertyInfo[] GetHiddenColumns(this Query request, IConfigurator conf)
        {
            var columns = GetHiddenColumns(request);
            return conf.TableColumnsDictionary.Where(c => columns.Contains(c.Key)).Select(c=>c.Value).ToArray();
        }

        /// <summary>
        /// Returns all columns that are being hidden on client-side
        /// </summary>
        /// <param name="request">Request</param>
        /// <returns>Array of strings denoting names of hidden columns</returns>
        public static string[] GetHiddenColumns(this Query request)
        {
            return GetColumns(request, HideoutHiddenAdditionalDataKey);
        }
        #endregion

        #region Shown columns in request
        /// <summary>
        /// Returns all columns that are being shown on client-side
        /// </summary>
        /// <param name="request">Request</param>
        /// <param name="conf">Table configurator</param>
        /// <returns>Array of PropertyInfos that are shown</returns>
        public static PropertyInfo[] GetShownColumns(this PowerTableRequest request, IConfigurator conf)
        {
            return GetShownColumns(request.Query, conf);
        }

        /// <summary>
        /// Returns all columns that are being shown on client-side
        /// </summary>
        /// <param name="request">Request</param>
        /// <returns>Array of strings denoting names of shown columns</returns>
        public static string[] GetShownColumns(this PowerTableRequest request)
        {
            return GetShownColumns(request.Query);
        }

        /// <summary>
        /// Returns all columns that are being shown on client-side
        /// </summary>
        /// <param name="request">Request</param>
        /// <param name="conf">Table configurator</param>
        /// <returns>Array of PropertyInfos that are shown</returns>
        public static PropertyInfo[] GetShownColumns(this Query request, IConfigurator conf)
        {
            var columns = GetHiddenColumns(request);
            return conf.TableColumnsDictionary.Where(c => columns.Contains(c.Key)).Select(c => c.Value).ToArray();
        }

        /// <summary>
        /// Returns all columns that are being shown on client-side
        /// </summary>
        /// <param name="request">Request</param>
        /// <returns>Array of strings denoting names of shown columns</returns>
        public static string[] GetShownColumns(this Query request)
        {
            return GetColumns(request, HideoutShownAdditionalDataKey);
        }
        #endregion

        private static string[] GetColumns(Query request, string key)
        {
            if (!request.AdditionalData.ContainsKey(key)) return new string[0];
            var cols = request.AdditionalData[key];
            return cols.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries);
        }
    }
}