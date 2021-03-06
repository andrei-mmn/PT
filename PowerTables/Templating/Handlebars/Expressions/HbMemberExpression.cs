﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PowerTables.Templating.Handlebars.Expressions
{
    class HbMemberExpression : HbExpression
    {
        public HbExpression Accessed { get; set; }

        public string MemberName { get; set; }
        public override string Build()
        {
            var field = Accessed.Build();
            if (!string.IsNullOrEmpty(field)) field = field + ".";
            return String.Format("{0}{1}", field, MemberName);
        }
    }
}
