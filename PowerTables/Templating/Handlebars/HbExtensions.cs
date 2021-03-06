﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;
using System.Web.Mvc;
using PowerTables.Templating.Handlebars.Expressions;

namespace PowerTables.Templating.Handlebars
{
    /// <summary>
    /// Set of extension methods to interact with handlebars.js
    /// </summary>
    public static class HbExtensions
    {
        public static string TraversePropertyLambda(LambdaExpression lambda, string existing = null)
        {
            var visitor = new HbExpressionVisitor();
            visitor.Visit(lambda.Body);
            var ex = visitor.Retrieve();
            var expr = ex.Build();
            return string.IsNullOrEmpty(existing) ? expr : existing + "." + ex.Build();
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
            var proname = TraversePropertyLambda(condition, t.ExistingModel);
            return new HbTagRegion("if", proname, t.Writer);
        }

        /// <summary>
        /// Renders handlebars "if" directive in region
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="t"></param>
        /// <param name="condition"></param>
        /// <param name="textIf">Text if condition met</param>
        /// <returns></returns>
        public static MvcHtmlString If<T>(this IModelProvider<T> t, Expression<Func<T, bool>> condition, string textIf)
        {
            var proname = TraversePropertyLambda(condition, t.ExistingModel);
            var tr = new HbTagRegion("if", proname, t.Writer);
            t.Writer.Write(" ");
            t.Writer.Write(textIf);
            tr.Dispose();
            return MvcHtmlString.Empty;
        }

        /// <summary>
        /// Renders handlebars "if" directive in region
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="t"></param>
        /// <param name="condition"></param>
        /// <param name="textUnless">Text if condition is not met</param>
        /// <returns></returns>
        public static MvcHtmlString Unless<T>(this IModelProvider<T> t, Expression<Func<T, bool>> condition, string textUnless)
        {
            var proname = TraversePropertyLambda(condition, t.ExistingModel);
            var tr = new HbTagRegion("unless", proname, t.Writer);
            t.Writer.Write(" ");
            t.Writer.Write(textUnless);
            tr.Dispose();
            return MvcHtmlString.Empty;
        }


        /// <summary>
        /// Else helper
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="t"></param>
        /// <returns>{{else}} keyword</returns>
        public static MvcHtmlString Else<T>(this IModelProvider<T> t)
        {
            return MvcHtmlString.Create("{{else}}");
        }

        /// <summary>
        /// Else helper
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="t"></param>
        /// <returns>{{else}} keyword</returns>
        public static MvcHtmlString This<T>(this IModelProvider<T> t)
        {
            return MvcHtmlString.Create("{{this}}");
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
            var proname = TraversePropertyLambda(field, t.ExistingModel);
            return new HbTagRegion("ifq", string.Format("{0} {1}", proname, comparisonConstant), t.Writer);
        }

        /// <summary>
        /// Renders handlebars "if" directive in region
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="t"></param>
        /// <param name="field"></param>
        /// <returns></returns>
        public static HbTagRegion IfGt<T, TData>(this IModelProvider<T> t, Expression<Func<T, TData>> field, string comparisonConstant,bool inclusive=false)
        {
            var proname = TraversePropertyLambda(field, t.ExistingModel);
            return new HbTagRegion("ifcmp", string.Format("{0} {1} \"{2}\"", proname, comparisonConstant, inclusive?"a>=b":"a>b"), t.Writer);
        }

        /// <summary>
        /// Renders handlebars "if" directive in region
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="t"></param>
        /// <param name="field"></param>
        /// <returns></returns>
        public static HbTagRegion IfLt<T, TData>(this IModelProvider<T> t, Expression<Func<T, TData>> field, string comparisonConstant, bool inclusive = false)
        {
            var proname = TraversePropertyLambda(field, t.ExistingModel);
            return new HbTagRegion("ifcmp", string.Format("{0} {1} \"{2}\"", proname, comparisonConstant, inclusive ? "a<=b" : "a<b"), t.Writer);
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
            var proname = TraversePropertyLambda(field, t.ExistingModel);
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
            var proname = TraversePropertyLambda(condition, t.ExistingModel);
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
            var proname = TraversePropertyLambda(condition, t.ExistingModel);
            return new ParametrizedHbTagRegion<TElement>("each", proname, t.Writer);
        }

        /// <summary>
        /// Renders handlebars "each" directive in region
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="t"></param>
        /// <param name="condition"></param>
        /// <returns></returns>
        public static ParametrizedHbTagRegion<TElement> Each<T, TElement>(this IModelProvider<T> t, Expression<Func<T, IHbArray<TElement>>> condition)
        {
            var proname = TraversePropertyLambda(condition, t.ExistingModel);
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
            return MvcHtmlString.Create(string.Concat("{{", CleanValue(t, valueField), "}}"));
        }

        /// <summary>
        /// Returns clean value expression without HB parenthesis
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <typeparam name="TData"></typeparam>
        /// <param name="t"></param>
        /// <param name="valueField">Value expression</param>
        /// <returns></returns>
        public static string CleanValue<T, TData>(this IModelProvider<T> t, Expression<Func<T, TData>> valueField)
        {
            var proname = TraversePropertyLambda(valueField, t.ExistingModel);
            return proname;
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
            var proname = TraversePropertyLambda(valueField, t.ExistingModel);
            return MvcHtmlString.Create(string.Concat("{{{", proname, "}}}"));
        }

        /// <summary>
        /// Outputs ambience's HTML content supplying model value as parameter
        /// </summary>
        /// <param name="t">Template region</param>
        /// <param name="parameter">Parameter to be read as column name</param>
        /// <returns></returns>
        public static MvcHtmlString HtmlContent<T, TModel, TData>(this T t, Expression<Func<TModel, TData>> parameter)
            where T : IProvidesColumnContent, IModelProvider<TModel>
        {
            return MvcHtmlString.Create(string.Format("{{{{{{Content {0}}}}}}}", TraversePropertyLambda(parameter, t.ExistingModel)));
        }

        /// <summary>
        /// Binds event at specified element
        /// </summary>
        /// <param name="t">Template region</param>
        /// <param name="commaSeparatedFunction">Comma-separated functions list to be bound</param>
        /// <param name="commaSeparatedEvents">Comma-separated events list to be bound</param>
        /// <param name="eventArguments">Event arguments</param>
        /// <returns></returns>
        public static MvcHtmlString BindEvent<T, TModel, TData>(this T t, string commaSeparatedFunction, string commaSeparatedEvents,
            params Expression<Func<TModel, TData>>[] eventArguments)
            where T : IProvidesEventsBinding, IModelProvider<TModel>
        {
            var args = eventArguments.Select(c => TraversePropertyLambda(c, t.ExistingModel)).ToArray();
            return t.BindEvent(commaSeparatedFunction, commaSeparatedEvents, args);
        }
    }
}
