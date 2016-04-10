var PowerTables;
(function (PowerTables) {
    /**
     * Class that is responsible for holding and managing data loaded from server
     */
    var DataHolder = (function () {
        function DataHolder(rawColumnNames, isColumnDateTimeFunc, events, instances) {
            this._comparators = {};
            this._filters = [];
            this._anyClientFiltration = false;
            /**
             * Selector of source data on client-side
             */
            this.Selector = null;
            this._rawColumnNames = rawColumnNames;
            this._isColumnDateTimeFunc = isColumnDateTimeFunc;
            this._events = events;
            this._instances = instances;
        }
        /**
         * Registers client filter
         *
         * @param filter Client filter
         */
        DataHolder.prototype.registerClientFilter = function (filter) {
            this._anyClientFiltration = true;
            this._filters.push(filter);
        };
        /**
         * Registers new client ordering comparer function
         *
         * @param dataField Field for which this comparator is applicable
         * @param comparator Comparator fn that should return 0 if entries are equal, -1 if a<b, +1 if a>b
         * @returns {}
         */
        DataHolder.prototype.registerClientOrdering = function (dataField, comparator) {
            this._anyClientFiltration = true;
            this._comparators[dataField] = comparator;
        };
        /**
         * Is there any client filtration pending
         * @returns True if there are any actions to be performed on query after loading, false otherwise
         */
        DataHolder.prototype.isClientFiltrationPending = function () {
            return ((!(!this.Selector)) || this._anyClientFiltration);
        };
        /**
        * Parses response from server and turns it to objects array
        */
        DataHolder.prototype.storeResponse = function (response, clientQuery) {
            var data = [];
            var obj = {};
            var currentColIndex = 0;
            var currentCol = this._rawColumnNames[currentColIndex];
            for (var i = 0; i < response.Data.length; i++) {
                if (this._isColumnDateTimeFunc(currentCol)) {
                    if (response.Data[i]) {
                        obj[currentCol] = Date.parse(response.Data[i]);
                    }
                    else {
                        obj[currentCol] = null;
                    }
                }
                else {
                    obj[currentCol] = response.Data[i];
                }
                currentColIndex++;
                if (currentColIndex >= this._rawColumnNames.length) {
                    currentColIndex = 0;
                    data.push(obj);
                    obj = {};
                }
                currentCol = this._rawColumnNames[currentColIndex];
            }
            this.StoredData = data;
            this.filterStoredData(clientQuery);
        };
        /**
         * Filters supplied data set using client query
         *
         * @param objects Data set
         * @param query Client query
         * @returns {Array} Array of filtered items
         */
        DataHolder.prototype.filterSet = function (objects, query) {
            var result = [];
            if (this._filters.length !== 0) {
                for (var i = 0; i < this.StoredData.length; i++) {
                    var obj = this.StoredData[i];
                    var acceptable = true;
                    for (var j = 0; j < this._filters.length; j++) {
                        var filter = this._filters[j];
                        acceptable = filter.filterPredicate(obj, query);
                        if (!acceptable)
                            break;
                    }
                    if (!acceptable)
                        continue;
                    result.push(obj);
                }
                return result;
            }
            return null;
        };
        /**
        * Orders supplied data set using client query
        *
        * @param objects Data set
        * @param query Client query
        * @returns {Array} Array of ordered items
        */
        DataHolder.prototype.orderSet = function (objects, query) {
            if (query.Orderings) {
                var sortFn = '';
                var comparersArg = '';
                var orderFns = [];
                for (var orderingKey in query.Orderings) {
                    if (query.Orderings.hasOwnProperty(orderingKey)) {
                        var orderingDirection = query.Orderings[orderingKey];
                        if (orderingDirection === PowerTables.Ordering.Neutral)
                            continue;
                        if (!this._comparators[orderingKey])
                            continue;
                        var negate = orderingDirection === PowerTables.Ordering.Descending;
                        sortFn += "cc = f" + orderFns.length + "(a,b); ";
                        comparersArg += "f" + orderFns.length + ",";
                        orderFns.push(this._comparators[orderingKey]);
                        sortFn += "if (cc!=0) return " + (negate ? '-cc' : 'cc') + "; ";
                    }
                }
                comparersArg = comparersArg.substr(0, comparersArg.length - 1);
                sortFn = "function(" + comparersArg + "){ return function (a,b) { var cc = 0; " + sortFn + " return 0; } }";
                var sortFunction = eval(sortFn).apply(null, orderFns);
                var ordered = objects.sort(sortFunction);
                return ordered;
            }
            return null;
        };
        /**
         * Filter recent data and store it to currently displaying data
         *
         * @param query Table query
         * @returns {}
         */
        DataHolder.prototype.filterStoredData = function (query) {
            this.DisplayedData = this.StoredData;
            this.RecentClientQuery = query;
            if (this.isClientFiltrationPending() && (!(!query))) {
                var filtered = this.filterSet(this.DisplayedData, query);
                if (filtered)
                    this.DisplayedData = filtered;
                var ordered = this.orderSet(this.DisplayedData, query);
                if (ordered)
                    this.DisplayedData = ordered;
                if (this.Selector) {
                    this.DisplayedData = this.Selector.selectData(this.DisplayedData, query);
                }
            }
        };
        /**
         * Filter recent data and store it to currently displaying data
         * using query that was previously applied to local data
         */
        DataHolder.prototype.filterStoredDataWithPreviousQuery = function () {
            this.filterStoredData(this.RecentClientQuery);
        };
        /**
         * Finds data matching predicate among locally stored data
         *
         * @param predicate Filtering predicate returning true for required objects
         * @returns Array of ILocalLookupResults
         */
        DataHolder.prototype.localLookup = function (predicate) {
            var result = [];
            for (var i = 0; i < this.StoredData.length; i++) {
                if (predicate(this.StoredData[i])) {
                    result.push({
                        DataObject: this.StoredData[i],
                        IsCurrentlyDisplaying: false,
                        LoadedIndex: i,
                        DisplayedIndex: -1
                    });
                }
            }
            for (var j = 0; j < result.length; j++) {
                var idx = this.DisplayedData.indexOf(result[j].DataObject);
                if (idx >= 0) {
                    result[j].IsCurrentlyDisplaying = true;
                    result[j].DisplayedIndex = idx;
                }
            }
            return result;
        };
        /**
         * Finds data object among currently displayed and returns ILocalLookupResult
         * containing also Loaded-set index of this data object
         *
         * @param index Index of desired data object among locally displaying data
         * @returns ILocalLookupResult
         */
        DataHolder.prototype.localLookupDisplayedData = function (index) {
            if (index < 0)
                return null;
            if (index > this.DisplayedData.length)
                return null;
            var result = {
                DataObject: this.DisplayedData[index],
                IsCurrentlyDisplaying: true,
                DisplayedIndex: index,
                LoadedIndex: this.StoredData.indexOf(this.DisplayedData[index])
            };
            return result;
        };
        /**
         * Finds data object among recently loaded and returns ILocalLookupResult
         * containing also Loaded-set index of this data object
         *
         * @param index Index of desired data object among locally displaying data
         * @returns ILocalLookupResult
         */
        DataHolder.prototype.localLookupStoredData = function (index) {
            if (index < 0)
                return null;
            if (index > this.StoredData.length)
                return null;
            var result = {
                DataObject: this.StoredData[index],
                IsCurrentlyDisplaying: true,
                DisplayedIndex: this.DisplayedData.indexOf(this.StoredData[index]),
                LoadedIndex: index
            };
            return result;
        };
        return DataHolder;
    })();
    PowerTables.DataHolder = DataHolder;
})(PowerTables || (PowerTables = {}));
//# sourceMappingURL=DataHolder.js.map