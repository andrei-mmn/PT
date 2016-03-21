﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using PowerTables.Configuration;

namespace PowerTables.Mvc.Models
{
    public enum SomeEnum
    {
        One,
        Two,
        Three,
        Four
    }

    public class SourceData
    {
        public int Id { get; set; }
        public byte GroupType { get; set; }
        public string VeryName { get; set; }
        public int ItemsCount { get; set; }
        public double Cost { get; set; }
        public bool IcloudLock { get; set; }

        public int? NullableValue { get; set; }
        public DateTime CurrentDate { get; set; }

        public DateTime? NullableDate { get; set; }
    }

    public class SomeBehind
    {
        public int BehindProperty { get; set; }
    }

    public class TargetData : SomeBehind
    {
        public int Id { get; set; }
        public string GroupName { get; set; }

        public int ItemsCount { get; set; }

        public double Cost { get; set; }

        public SomeEnum EnumValue { get; set; }
        public bool IcloudLock { get; set; }

        public int NullableValue { get; set; }

        public DateTime CurrentDate { get; set; }
        public DateTime? NullableDate { get; set; }

        public int SomethingDataOnly { get; set; }

        public int SomeCustomTemplate { get; set; }

    }

    public class RequestStaticData
    {
        public int SomeId { get; set; }
        public DateTime SomeDate { get; set; }
        public string SomeString { get; set; }
        public bool SomeBool { get; set; }
    }

    public class ResponseInfo
    {
        public string QueryTime { get; set; }

        public int TotalRecords { get; set; }

        public int Shown { get; set; }

        public const string ResponseInfoTemplate = "<p>Shown {{Shown}} records of {{TotalRecords}}</p>";
    }

    public class AboutViewModel
    {
        public Configurator<SourceData, TargetData> Configuration { get; set; }

        public RequestStaticData Statics { get; set; }
    }
}