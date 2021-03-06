﻿using System.IO;
using System.Web.Mvc;
using PowerTables.Templating;
using PowerTables.Templating.Handlebars;

namespace PowerTables.Plugins.Toolbar
{
    public class ToolbarTemplateRegion : PluginTemplateRegion, IModelProvider<IToolbarViewModel>
    {
        public string ExistingModel { get; private set; }

        public ToolbarTemplateRegion(IViewPlugins page, string id)
            : base(page, id)
        {
        }
    }

    public class ButtonsSetTemplateRegion : HbTagRegion
        , IModelProvider<ToolbarButtonClientConfiguration>
        , IProvidesMarking
        , IProvidesEventsBinding
    {
        public ButtonsSetTemplateRegion(TextWriter writer)
            : base("each", "Configuration.Buttons", writer)
        {
        }

        public string ExistingModel { get; private set; }
    }

    /// <summary>
    /// ViewModel for toolbar plugin
    /// </summary>
    public interface IToolbarViewModel
    {
        /// <summary>
        /// Client configuration
        /// </summary>
        ToolbarButtonsClientConfiguration Configuration { get; }
    }

    public static class ToolbarTemplatingExtensions
    {
        /// <summary>
        /// Template region for toolbar plugin
        /// </summary>
        /// <param name="t"></param>
        /// <param name="templateId">Template ID (default is "toolbar")</param>
        public static ToolbarTemplateRegion Toolbar(this IViewPlugins t, string templateId = "toolbar")
        {
            return new ToolbarTemplateRegion(t, "toolbar");
        }

        /// <summary>
        /// Buttons of Toolbar plugin
        /// </summary>
        /// <param name="t"></param>
        /// <returns></returns>
        public static ButtonsSetTemplateRegion Buttons(this ToolbarTemplateRegion t)
        {
            return new ButtonsSetTemplateRegion(t.Writer);
        }

        /// <summary>
        /// Binds button action for specified button
        /// </summary>
        /// <param name="m"></param>
        /// <param name="eventId">DOM event</param>
        /// <returns></returns>
        public static MvcHtmlString BindButton(this ButtonsSetTemplateRegion m, string eventId)
        {
            var mark = m.Mark("AllButtons", m.CleanValue(c => c.InternalId));
            var events = m.BindEvent("buttonHandleEvent", eventId, m.CleanValue(c => c.InternalId));
            return MvcHtmlString.Create(mark + " " + events);
        }
    }

}
