﻿using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;
using System.Web.Mvc;

namespace PowerTables.Templating
{
    /// <summary>
    /// Set of extension methods to interact with handlebars.js
    /// </summary>
    public static class HbExtensions
    {
        private static string TraversePropertyLambda(LambdaExpression lambda)
        {
            Stack<string> properties = new Stack<string>();
            MemberExpression current = lambda.Body as MemberExpression;

            do
            {
                if (current == null) throw new Exception("Here should be property");
                var pi = current.Member as PropertyInfo;
                if (pi == null) throw new Exception("Here should be property");
                var propName = pi.Name;
                var attr = pi.GetCustomAttribute<OverrideHbFieldNameAttribute>();
                if (attr != null) propName = attr.Name;
                properties.Push(propName);
                if (current.Expression.NodeType == ExpressionType.Parameter) break;
                current = current.Expression as MemberExpression;
            } while (true);

            StringBuilder sb = new StringBuilder();
            while (properties.Count > 0)
            {
                sb.Append(properties.Pop());
                if (properties.Count > 0) sb.Append(".");
            }
            return sb.ToString();
        }

        /// <summary>
        /// Renders handlebars "if" directive in region
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="t"></param>
        /// <param name="condition"></param>
        /// <returns></returns>
        public static HbTagRegion If<T>(this IModelProvider<T> t, Expression<Func<T, bool>> condition)
        {
            var proname = TraversePropertyLambda(condition);
            return new HbTagRegion("if", proname, t.Writer);
        }

        /// <summary>
        /// Renders handlebars "if" directive in region
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="t"></param>
        /// <param name="field"></param>
        /// <returns></returns>
        public static HbTagRegion IfEquals<T, TData>(this IModelProvider<T> t, Expression<Func<T, TData>> field, string comparisonConstant)
        {
            var proname = TraversePropertyLambda(field);
            return new HbTagRegion("ifq", string.Format("{0} {1}", proname, comparisonConstant), t.Writer);
        }

        /// <summary>
        /// Renders custom Lattice handlebars "if" helper that compares property and string
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="t"></param>
        /// <param name="field"></param>
        /// <returns></returns>
        public static HbTagRegion IfStrEquals<T>(this IModelProvider<T> t, Expression<Func<T, string>> field, string comparisonConstant)
        {
            var proname = TraversePropertyLambda(field);
            return new HbTagRegion("ifq", string.Format("{0} \"{1}\"", proname, comparisonConstant), t.Writer);
        }


        /// <summary>
        /// Renders handlebars "unless" directive in region
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="t"></param>
        /// <param name="condition"></param>
        /// <returns></returns>
        public static HbTagRegion Unless<T>(this IModelProvider<T> t, Expression<Func<T, bool>> condition)
        {
            var proname = TraversePropertyLambda(condition);
            return new HbTagRegion("unless", proname, t.Writer);
        }


        /// <summary>
        /// Renders handlebars "each" directive in region
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="t"></param>
        /// <param name="condition"></param>
        /// <returns></returns>
        public static ParametrizedHbTagRegion<TElement> Each<T, TElement>(this IModelProvider<T> t, Expression<Func<T, IEnumerable<TElement>>> condition)
        {
            var proname = TraversePropertyLambda(condition);
            return new ParametrizedHbTagRegion<TElement>("each", proname, t.Writer);
        }

        /// <summary>
        /// Outputs placeholder for handlebars value
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <typeparam name="TData"></typeparam>
        /// <param name="t"></param>
        /// <param name="valueField">Value expression</param>
        /// <returns></returns>
        public static MvcHtmlString Value<T, TData>(this IModelProvider<T> t, Expression<Func<T, TData>> valueField)
        {
            var proname = TraversePropertyLambda(valueField);
            return MvcHtmlString.Create(string.Concat("{{", proname, "}}"));
        }

        /// <summary>
        /// Outputs placeholder for handlebars value
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <typeparam name="TData"></typeparam>
        /// <param name="t"></param>
        /// <param name="valueField">Value expression</param>
        /// <returns></returns>
        public static MvcHtmlString HtmlValue<T, TData>(this IModelProvider<T> t, Expression<Func<T, TData>> valueField)
        {
            var proname = TraversePropertyLambda(valueField);
            return MvcHtmlString.Create(string.Concat("{{{", proname, "}}}"));
        }

        public static MvcHtmlString Content<T,TModel,TData>(this T t, Expression<Func<TModel,TData>> parameter )
            where T:IProvidesColumnContent,IModelProvider<TModel>
        {
            return MvcHtmlString.Create(string.Format("{{{{{{Content {0}}}}}}}", TraversePropertyLambda(parameter)));
        }
    }
}
