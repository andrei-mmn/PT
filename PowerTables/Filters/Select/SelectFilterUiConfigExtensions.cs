﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using Newtonsoft.Json.Linq;
using PowerTables.Plugins;

namespace PowerTables.Filters.Select
{
    /// <summary>
    /// Extensions for Select Filter UI
    /// </summary>
    public static class SelectFilterUiConfigExtensions
    {
        /// <summary>
        /// Allows or disallows "any" selection
        /// </summary>
        /// <param name="config">Configuration</param>
        /// <param name="anyText">"any" select item text</param>
        /// <param name="allowAny">Add "any" element to select item or not</param>
        /// <returns></returns>
        public static PluginConfigurationWrapper<SelectFilterUiConfig> SelectAny(this PluginConfigurationWrapper<SelectFilterUiConfig> config, bool allowAny = true, string anyText = "Any")
        {
            config.Configuration.NothingText = anyText;
            config.Configuration.AllowSelectNothing = allowAny;
            return config;
        }

        /// <summary>
        /// Sets select items for filter UI
        /// </summary>
        /// <param name="config">Configuration</param>
        /// <param name="items">Select list with available values</param>
        /// <returns></returns>
        public static PluginConfigurationWrapper<SelectFilterUiConfig> SelectItems(this PluginConfigurationWrapper<SelectFilterUiConfig> config,
            IEnumerable<SelectListItem> items)
        {
            config.Configuration.Items = items.ToList();
            return config;
        }

        /// <summary>
        /// Specifies raw default value for filter. This methods acts like .Default but consumes raw string 
        /// that will be put to filter box without any conversion. 
        /// </summary>
        /// <param name="config">Configuration</param>
        /// <param name="value">Raw value string</param>
        /// <returns>UI builder</returns>
        public static PluginConfigurationWrapper<SelectFilterUiConfig> RawDefault(this PluginConfigurationWrapper<SelectFilterUiConfig> config, string value)
        {
            config.Configuration.Items.ForEach(c => c.Selected = false);
            if (value != null)
            {
                var selected = config.Configuration.Items.FirstOrDefault(c => c.Value == value);
                if (selected != null)
                {
                    selected.Selected = true;
                }
                else
                {
                    throw new Exception(String.Format(
                        "Cannot find item in list with value '{0}' to make it default", value));
                }
            }
            return config;
        }
    }
}
