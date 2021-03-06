﻿using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;
using PowerTables.ResponseProcessing;

namespace PowerTables
{
    /// <summary>
    /// The respons that is being sent to client script. 
    /// This entity contains query results to be shown in table and also additional data
    /// </summary>
    public class PowerTablesResponse : IAdditionalDataProvider
    {
        public static bool EnableStackTraces = true;

        /// <summary>
        /// This property is unique identifier of Lattice response. 
        /// Just leave it in place and do not touch
        /// </summary>
        [JsonProperty(PropertyName = "__ZBnpwvibZm")]
        public bool IsLatticeResponse { get { return true; } }

        /// <summary>
        /// Table message associated with this response
        /// </summary>
        public TableMessage Message { get; set; }

        /// <summary>
        /// Total results count
        /// </summary>
        public long ResultsCount { get; set; }

        /// <summary>
        /// Current data page index 
        /// </summary>
        public int PageIndex { get; set; }

        /// <summary>
        /// Data itself (array of properties in order as declared for each object.
        /// <example>E.g.: if source table is class User { string Id; string Name } then this field should present resulting query in a following way: [User1.Id, User1.Name,User2.Id, User2.Name ...] etc</example>
        /// </summary>
        public object[] Data { get; set; }

        /// <summary>
        /// Additional data being serialized for client. 
        /// This field could contain anything that will be parsed on client side and corresponding actions will be performed. 
        /// See <see cref="IResponseModifier"/> 
        /// </summary>
        public Dictionary<string, object> AdditionalData { get; set; }

        /// <summary>
        /// Query succeeded: true/false
        /// </summary>
        public bool Success { get; set; }

        public void FormatException(Exception ex)
        {
            Success = false;
            StringBuilder sb = new StringBuilder();
            sb.AppendLine(ex.StackTrace);
            string msg = ex.Message;
            if (EnableStackTraces)
            {
                ex = ex.InnerException;
                while (ex != null)
                {
                    sb.AppendLine("___");
                    sb.AppendLine(ex.Message);
                    sb.AppendLine(ex.StackTrace);
                    ex = ex.InnerException;
                }
            }

            Message = TableMessage.Banner("error", msg, sb.ToString().Replace("\n", "<br/>"));

        }
    }
}
