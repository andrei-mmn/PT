﻿using System.IO;
using PowerTables.Templating.Handlebars;

namespace PowerTables.Templating
{
    public class ParametrizedHbTagRegion<T> : HbTagRegion, IModelProvider<T>,IProvidesEventsBinding
    {
        public ParametrizedHbTagRegion(string tag, string args, TextWriter writer, string existingModel = null) : base(tag, args, writer)
        {
            ExistingModel = existingModel;
        }

        public string ExistingModel { get; private set; }
    }
}
