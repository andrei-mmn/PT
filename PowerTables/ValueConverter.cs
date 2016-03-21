﻿using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using PowerTables.Configuration;

namespace PowerTables
{
    public static class ValueConverter
    {
        /// <summary>
        /// Determines is type derived from Nullable or not
        /// </summary>
        /// <param name="t">Type</param>
        /// <returns>True if type is nullable value type. False otherwise</returns>
        public static bool IsNullable(this Type t)
        {
            return (t.IsGenericType && (t.GetGenericTypeDefinition() == typeof(Nullable<>)));
        }

        /// <summary>
        /// Retrieves first type argument of type
        /// </summary>
        /// <param name="t">Type</param>
        /// <returns>First type argument</returns>
        public static Type GetArg(this Type t)
        {
            return t.GetGenericArguments()[0];
        }

        public static TTarget Convert<TTarget>(string src,IConfigurator conf)
        {
            return (TTarget) Convert(src, typeof (TTarget), conf);
        }

        public static object Convert(string src, Type targetType, IConfigurator conf)
        {
            if (string.IsNullOrEmpty(src)) return null;
            
            if (targetType == typeof(DateTime))
            {
                return conf.ParseDateTime(src);
            }

            if (targetType.IsNullable())
            {
                var tw = targetType.GetArg();
                object arg = Convert(src, tw,conf);
                return Activator.CreateInstance(targetType, arg);
            }

            if (targetType.IsEnum)
            {
                return Enum.Parse(targetType, src);
            }

            var converter = TypeDescriptor.GetConverter(src.GetType());
            if (converter.CanConvertTo(targetType))
            {
                return converter.ConvertTo(src, targetType);
            }

            return System.Convert.ChangeType(src, targetType);
        }

        public static object MapValue(object src, Type targetType, IConfigurator conf)
        {
            if (src == null) return null;
            if (src is string)
            {
                if (string.IsNullOrEmpty(src.ToString()))
                {
                    return null;
                }
            }
            if (targetType == typeof (DateTime) && src is string)
            {
                return conf.ParseDateTime((string) src);
            }

            if (targetType.IsNullable())
            {
                var tw = targetType.GetArg();
                object arg = MapValue(src, tw, conf);
                return Activator.CreateInstance(targetType, arg);
            }

            var converter = TypeDescriptor.GetConverter(src.GetType());
            if (converter.CanConvertTo(targetType))
            {
                return converter.ConvertTo(src, targetType);
            }

            return System.Convert.ChangeType(src, targetType);
        }
    }
}