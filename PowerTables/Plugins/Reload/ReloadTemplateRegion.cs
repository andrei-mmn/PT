﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using PowerTables.Templating;

namespace PowerTables.Plugins.Reload
{
    public class ReloadTemplateRegion : PluginTemplateRegion, IProvidesVisualState
    {
        public ReloadTemplateRegion(IViewPlugins page, string id)
            : base(page, id)
        {
        }
    }

    /// <summary>
    /// ViewModel for reload plugin
    /// </summary>
    public interface IReloadPlugin
    {
        /// <summary>
        /// Is plugin triggering force reload
        /// </summary>
        bool ForceReload { get; }
    }

    public static class ReloadTemplateExtensions
    {
        /// <summary>
        /// Template region for Reload plugin
        /// </summary>
        /// <param name="t"></param>
        /// <param name="templateId">Template ID</param>
        public static ReloadTemplateRegion Reload(this IViewPlugins t, string templateId = "reload")
        {
            return new ReloadTemplateRegion(t, templateId);
        }

        /// <summary>
        /// Binds event that initiates reloading
        /// </summary>
        /// <param name="t"></param>
        /// <param name="eventId">DOM Event ID</param>
        /// <returns></returns>
        public static MvcHtmlString BindTriggerReload(this ReloadTemplateRegion t, string eventId)
        {
            return t.BindEvent("triggerReload", eventId);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="t"></param>
        /// <param name="state"></param>
        /// <returns></returns>
        public static MvcHtmlString WhenLoading(this ReloadTemplateRegion t, Action<VisualState> state)
        {
            return t.State("loading", state);
        }
    }
}
