﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using PowerTables.Configuration;
using PowerTables.Mvc.Models.Tutorial;

namespace PowerTables.Mvc.Models
{
    


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

        public long TotalRecords { get; set; }

        public int Shown { get; set; }

        public const string ResponseInfoTemplate = "<p>Shown {{Shown}} records of {{TotalRecords}}</p>";
    }

    public class AboutViewModel
    {
        public Configurator<Toy, Row> Configuration { get; set; }

        public RequestStaticData Statics { get; set; }
    }
}