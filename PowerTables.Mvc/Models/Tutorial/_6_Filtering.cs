﻿using System.Linq;
using System.Web.Mvc.Html;
using PowerTables.Configuration;
using PowerTables.Filters;
using PowerTables.Filters.Multi;
using PowerTables.Filters.Range;
using PowerTables.Filters.Select;
using PowerTables.Filters.Value;
using PowerTables.FrequentlyUsed;

namespace PowerTables.Mvc.Models.Tutorial
{
    public static partial class Tutorial
    {
        public static Configurator<SourceData, TargetData> Filtering(this Configurator<SourceData, TargetData> conf)
        {
            conf.Pagination();

            conf.Column(c => c.ItemsCount).Title("Shows items count, Filters min.cost")
                .FilterValue(c => c.ItemsCount, ui =>
                {
                    ui.Configuration.Placeholder = "Minimum cost";
                    ui.Configuration.DefaultValue = conf.ToFilterDefaultString(50);
                    ui.Configuration.InputDelay = 50;
                    ui.Configuration.ClientFiltering("function(obj,value) { return obj.Cost > parseFloat(value); }");
                })
                .By((q, v) => q.Where(c => c.Cost > v));

            conf.Column(c => c.GroupName).FilterValue(c => c.VeryName, ui =>
            {
                ui.Configuration.DefaultValue = conf.ToFilterDefaultString("Alpha");
            });

            conf.Column(c => c.Cost).FilterRange(c => c.Cost, ui =>
            {
                ui.Configuration.FromPlaceholder = "Min. Cost";
                ui.Configuration.ToPlaceholder = "Max. Cost";
            });

            conf.Column(c => c.Id).Title("Id (only client filter)").FilterRangeUi(ui =>
            {
                ui.Configuration.FromPlaceholder = "Min. Id";
                ui.Configuration.ToPlaceholder = "Max. Id";
                ui.Configuration.InputDelay = 50;
                ui.Configuration.ClientFiltering();
            });

            conf.Column(c => c.EnumValue).Title("Enum (client multiple)")
                .FilterMultiSelect(c => c.GroupType,
                    ui =>
                    {
                        ui.Configuration.SelectItems(EnumHelper.GetSelectList(typeof(SomeEnum)));
                        ui.Configuration.ClientFiltering();
                    });

            conf.Column(c => c.IcloudLock).Title("iCloud Locked (server filter)").FilterBoolean(c => c.IcloudLock, "On", "Off", "Any");
            
            conf.Column(c => c.CurrentDate).FilterValue(c => c.CurrentDate); // datepicker will be added automatically
            return conf;
        }
    }
}