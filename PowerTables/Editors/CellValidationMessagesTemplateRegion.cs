﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using PowerTables.Templating;
using PowerTables.Templating.Handlebars;

namespace PowerTables.Editors
{
    public class CellValidationMessagesTemplateRegion : TemplateRegion
        ,IModelProvider<IValidationMessagesViewModel>
    {
        public CellValidationMessagesTemplateRegion(string prefix, string id, TextWriter writer)
            : base(prefix, id, writer)
        {
        }

        public string ExistingModel { get; private set; }
    }

    public interface IValidationMessagesViewModel
    {
        IHbArray<IValidationMessageViewModel> Messages { get; }

        bool IsRowEdit { get; }

        bool IsFormEdit { get; }
    }

    public interface IValidationMessageViewModel
    {
        string Code { get; }

        string Message { get; }
    }

    public interface ISpecialInvalidStateViewModel
    {
        [OverrideHbFieldName("renderedValidationMessages")]
        string ValidationMessages { get; }
    }


    public static class CellValidationMessagesTemplateExtensions
    {
        public static MvcHtmlString WhenInvalid<T>(this CellEditorTemplateRegionBase<T> t, Action<SpecialVisualStateDescription<ISpecialInvalidStateViewModel>> state) where T : ICellEditorViewModel
        {
            return t.State("invalid", VisualState.FromSpecialDelegate(state));
        }

        public static CellValidationMessagesTemplateRegion Editor_ValidationMessages(this IViewPlugins t,
            string templateId = "cellValidationMessages")
        {
            return new CellValidationMessagesTemplateRegion(t.Model.Prefix, templateId, t.Writer);
        }

    }
}
