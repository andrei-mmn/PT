﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace PowerTables.Configuration.Json
{
    public static class JsonConfigurationExtensions
    {
        public static ColumnConfiguration Column(this TableConfiguration tconf, PropertyInfo property)
        {
            var name = property.Name;
            var idx = tconf.Columns.Single(c => c.RawColumnName == name);
            return idx;
        }

        public static void ReplaceFilterConfig(this ColumnConfiguration tconf, TableConfiguration table, string key, object filterConfig)
        {
            ReplacePluginConfig(table, string.Format("{0}-{1}", key, tconf.RawColumnName), filterConfig, "filter");
        }

        /// <summary>
        /// Replaces plugin configuration with whole new configuration
        /// </summary>
        /// <param name="conf">Table configuration</param>
        /// <param name="pluginId">Plugin ID</param>
        /// <param name="pluginConfig">Configuration object</param>
        /// <param name="placement">Plugin placement</param>
        public static void ReplacePluginConfig(this TableConfiguration conf, string pluginId, object pluginConfig, string placement = null)
        {
            var key = string.IsNullOrEmpty(placement) ? pluginId : String.Concat(placement, "-", pluginId);
            conf.PluginsConfiguration[key] = new PluginConfiguration(pluginId)
            {
                Configuration = pluginConfig,
                Placement = placement
            };
        }

        /// <summary>
        /// Updates or creates and updates configuration for specified plugin
        /// </summary>
        /// <typeparam name="TConfig">Plugin configuration type</typeparam>
        /// <param name="conf">Table configuration</param>
        /// <param name="pluginId">Plugin ID</param>
        /// <param name="pluginConfiguration">Configuration function</param>
        /// <param name="placement">Plugin placement</param>
        public static void UpdatePluginConfig<TConfig>(this TableConfiguration conf, string pluginId, Action<TConfig> pluginConfiguration, string placement = null)
            where TConfig : new()
        {

            var key = string.IsNullOrEmpty(placement) ? pluginId : String.Concat(placement, "-", pluginId);
            PluginConfiguration config = null;
            if (!conf.PluginsConfiguration.ContainsKey(key))
            {
                config = new PluginConfiguration(pluginId)
                {
                    Placement = placement,
                    Configuration = new TConfig()
                };
                conf.PluginsConfiguration[key] = config;
            }
            else
            {
                config = conf.PluginsConfiguration[key];
            }
            pluginConfiguration((TConfig)config.Configuration);
        }

        /// <summary>
        /// Retrieves configuration for specified plugin
        /// </summary>
        /// <typeparam name="TConfig">Plugin configuration type</typeparam>
        /// <param name="conf">Table JSON configuration</param>
        /// <param name="pluginId">Plugin ID</param>
        /// <param name="placement">Plugin placement</param>
        /// <returns></returns>
        public static TConfig GetPluginConfig<TConfig>(this TableConfiguration conf, string pluginId, string placement = null) where TConfig : class
        {
            var key = string.IsNullOrEmpty(placement) ? pluginId : String.Concat(placement, "-", pluginId);

            if (!conf.PluginsConfiguration.ContainsKey(key)) return null;
            var config = conf.PluginsConfiguration[key];
            return (TConfig)config.Configuration;
        }
    }
}
