﻿using System;
using System.IO;
using PowerTables.Configuration.Json;
using PowerTables.Templating.Handlebars;

namespace PowerTables.Templating.BuiltIn
{
    public class PluignWrapperTemplateRegion<T> :
        ModeledTemplateRegion<IPluginWrapperModel<T>>,
        IProvidesEventsBinding,
        IProvidesContent,
        IProvidesTracking
    {
        public PluignWrapperTemplateRegion(string prefix,string templateId, TextWriter writer)
            : base(prefix, templateId, writer)
        {
        }



        public bool IsTrackSet { get; set; }

        public override void Dispose()
        {
            if (!IsTrackSet) throw new Exception("Tracking element required for plugin wrapper");
            base.Dispose();
        }
    }

    public interface IPluginWrapperModel<T>
    {
        PluginConfiguration RawConfig { get; }

        T Configuration { get; }

        string PluginLocation { get; }
    }

    public static class PluginWrapperExtensions
    {
        public static PluignWrapperTemplateRegion<dynamic> PluginWrapper(this ITemplatesScope t, string templateId = "pluginWrapper")
        {
            return new PluignWrapperTemplateRegion<dynamic>(t.TemplatesPrefix, templateId, t.Output);
        }

        public static PluignWrapperTemplateRegion<T> PluginWrapper<T>(this ITemplatesScope t, string templateId = "pluginWrapper")
        {
            return new PluignWrapperTemplateRegion<T>(t.TemplatesPrefix,templateId, t.Output);
        }

        /// <summary>
        /// Template region being used if plugin is having specified location
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="pw"></param>
        /// <param name="locationPart">Part of plugin location</param>
        /// <returns></returns>
        public static HbTagRegion IfPlacement<T>(this PluignWrapperTemplateRegion<T> pw, string locationPart)
        {
            return new HbTagRegion("ifloc", String.Concat("\"", locationPart, "\""), pw.Writer);
        }
    }
}