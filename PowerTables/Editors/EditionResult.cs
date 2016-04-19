﻿using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using PowerTables.ResponseProcessing;

namespace PowerTables.Editors
{
    public class TableUpdateResult : JsonNetResult
    {
        public TableUpdateResult(EditionResult result)
        {
            Data = result;
        }

        public TableUpdateResult(IEditionResultContainer result)
        {
            Data = result.EditionResult;
        }
    }

    public class EditionResult
    {
        [JsonProperty("__XqTFFhTxSu")]
        public bool IsUpdateResult { get { return true; } }

        public object ConfirmedObject { get; set; }

        public AdjustmentData TableAdjustments { get; set; }

        public Dictionary<string, AdjustmentData> OtherTablesAdjustments { get; set; }

        public EditionResult()
        {
            TableAdjustments = new AdjustmentData();
            OtherTablesAdjustments = new Dictionary<string, AdjustmentData>();
        }
    }

    public class AdjustmentData
    {
        public List<object> Removals { get; private set; }

        public List<object> Updates { get; private set; }

        public AdjustmentData()
        {
            Removals = new List<object>();
            Updates = new List<object>();
        }
    }

    public class AdjustmentDataWrapper<T>
    {

        private readonly AdjustmentData _data;

        public AdjustmentDataWrapper(AdjustmentData data)
        {
            _data = data;
        }

        public AdjustmentDataWrapper<T> AddOrUpdate(T obj)
        {
            _data.Updates.Add(obj);
            return this;
        }

        public AdjustmentDataWrapper<T> AddOrUpdate(IEnumerable<T> obj)
        {
            foreach (var v in obj)
            {
                _data.Updates.Add(v);
            }

            return this;
        }

        public AdjustmentDataWrapper<T> Remove(T obj)
        {
            _data.Removals.Add(obj);
            return this;
        }
    }

    public class EditionResultWrapper<T> : IEditionResultContainer
    {
        private readonly EditionResult _result;

        public EditionResultWrapper(EditionResult result)
        {
            _result = result;
            Adjustments = new AdjustmentDataWrapper<T>(_result.TableAdjustments);
        }

        public void Confirm(T obj)
        {
            _result.ConfirmedObject = obj;
        }

        public T ConfirmedObject { get { return (T)_result.ConfirmedObject; } }

        public AdjustmentDataWrapper<T> Adjustments { get; private set; }

        public void AdjustAnotherTable<T2>(string tableId, Action<AdjustmentDataWrapper<T2>> otherTableAdjustments)
        {
            if (!_result.OtherTablesAdjustments.ContainsKey(tableId))
            {
                _result.OtherTablesAdjustments[tableId] = new AdjustmentData();
            }
            AdjustmentDataWrapper<T2> adj = new AdjustmentDataWrapper<T2>(_result.OtherTablesAdjustments[tableId]);
            otherTableAdjustments(adj);
        }

        public EditionResult EditionResult { get { return _result; } }
    }

    public interface IEditionResultContainer
    {
        EditionResult EditionResult { get; }
    }
}
