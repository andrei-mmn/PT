﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using PowerTables.Plugins.Formwatch;

namespace PowerTables.Plugins.Toolbar
{
    /// <summary>
    /// Builder for toolbar item (button or submenu)
    /// </summary>
    public class ToolbarItemBuilder
    {
        private readonly ToolbarButtonClientConfiguration _configuration;

        /// <summary>
        /// JSON toolbar button configuration
        /// </summary>
        public ToolbarButtonClientConfiguration Configuration
        {
            get { return _configuration; }
        }

        public ToolbarItemBuilder(ToolbarButtonClientConfiguration configuration)
        {
            _configuration = configuration;
        }

        public ToolbarItemBuilder HtmlContent(string content)
        {
            _configuration.HtmlContent = content;
            return this;
        }

        public ToolbarItemBuilder Title(string title)
        {
            _configuration.Title = title;
            return this;
        }

        public ToolbarItemBuilder Css(string css)
        {
            _configuration.Css = css;
            return this;
        }

        public ToolbarItemBuilder Style(string styleString)
        {
            _configuration.Style = styleString;
            return this;
        }

        public ToolbarItemBuilder Id(string id)
        {
            _configuration.Id = id;
            return this;
        }

        public ToolbarItemBuilder DisableIfNothingChecked(bool disable = true)
        {
            _configuration.DisableIfNothingChecked = disable;
            return this;
        }

        public ToolbarItemBuilder OnClick(string function)
        {
            _configuration.OnClick = new JRaw(function);
            return this;
        }

        public ToolbarItemBuilder Disabled(bool disabled = true)
        {
            _configuration.IsDisabled = disabled;
            return this;
        }

        public ToolbarItemBuilder Confirmation(string confirmationTemplateId,string targetElementSelector)
        {
            _configuration.ConfirmationTemplateId = confirmationTemplateId;
            _configuration.ConfirmationTargetSelector = targetElementSelector;
            return this;
        }

        public ToolbarItemBuilder ConfirmationForm<TForm>(Action<FormWatchBuilder<TForm>> formWatchBuilder)
        {
            FormWatchBuilder<TForm> bld = new FormWatchBuilder<TForm>();
            formWatchBuilder(bld);
            _configuration.ConfirmationFormConfiguration = bld.ClientConfig.FieldsConfiguration;
            return this;
        }
    }
}
