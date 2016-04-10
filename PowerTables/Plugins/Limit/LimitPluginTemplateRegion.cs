﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using PowerTables.Templating;
using PowerTables.Templating.Handlebars;

namespace PowerTables.Plugins.Limit
{
    public class LimitPluginTemplateRegion : PluginTemplateRegion
        , IProvidesEventsBinding
        , IModelProvider<ILimitPluginViewModel>
    {
        public LimitPluginTemplateRegion(IViewPlugins page)
            : base(page, "limit")
        {
        }
    }

    /// <summary>
    /// Limit plugin viewmodel
    /// </summary>
    public interface ILimitPluginViewModel
    {
        /// <summary>
        /// Currently selected value
        /// </summary>
        string SelectedValue { get; }

        /// <summary>
        /// All available sizes
        /// </summary>
        IHbArray<ILimitSize> Sizes { get; }
    }

    /// <summary>
    /// Sizes list item
    /// </summary>
    public interface ILimitSize
    {
        /// <summary>
        /// Is current item separator
        /// </summary>
        bool IsSeparator { get; }

        /// <summary>
        /// Value for particular list item
        /// </summary>
        string Value { get; }

        /// <summary>
        /// Label for particular list item
        /// </summary>
        string Label { get; }
    }

    public static class LimitTemplatingExtensions
    {
        /// <summary>
        /// Template region for limit plugin
        /// </summary>
        /// <param name="t"></param>
        /// <returns></returns>
        public static LimitPluginTemplateRegion Limit(this IViewPlugins t)
        {
            return new LimitPluginTemplateRegion(t);
        }


        /// <summary>
        /// Binds limit changing event
        /// </summary>
        /// <param name="tpl"></param>
        /// <param name="eventId">DOM event id</param>
        /// <returns></returns>
        public static MvcHtmlString BindLimitChangeEvent(this ParametrizedHbTagRegion<ILimitSize> tpl, string eventId)
        {
            return tpl.BindEvent("changeLimitHandler", eventId, "Value");
        }

        /// <summary>
        /// Binds limit changing event to any element among plugin
        /// </summary>
        /// <param name="tpl"></param>
        /// <param name="eventId">DOM event id</param>
        /// <param name="value">Limit value</param>
        /// <returns></returns>
        public static MvcHtmlString BindLimitChangeEvent(this LimitPluginTemplateRegion tpl, string eventId,string value)
        {
            return tpl.BindEvent("changeLimitHandler", eventId, "Value");
        }

    }

}