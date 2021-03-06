﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using PowerTables.Templating;

namespace PowerTables.Plugins.Loading
{
    public class LoadingPluginTemplateRegion : PluginTemplateRegion
    {
        

        /// <summary>
        /// Inidicates element that will be hidden when no loading and 
        /// element that will be shown when loading in progress
        /// </summary>
        /// <returns></returns>
        public MvcHtmlString ThisElementWillBlink()
        {
            return this.Mark("BlinkElement");
        }

        public LoadingPluginTemplateRegion(IViewPlugins page, string id) : base(page, id)
        {
        }
    }

    public static class LoadingPluginTemplateExtensions
    {
        /// <summary>
        /// Template for loading plugin
        /// </summary>
        /// <param name="t"></param>
        /// <returns></returns>
        public static LoadingPluginTemplateRegion Loading(this IViewPlugins t, string templateId = "loading")
        {
            return new LoadingPluginTemplateRegion(t, "loading");
        }
    }
}
