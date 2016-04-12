var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var PowerTables;
(function (PowerTables) {
    var Plugins;
    (function (Plugins) {
        /**
         * Base class for creating filters
         */
        var FilterBase = (function (_super) {
            __extends(FilterBase, _super);
            function FilterBase() {
                _super.apply(this, arguments);
            }
            FilterBase.prototype.modifyQuery = function (query, scope) { };
            FilterBase.prototype.init = function (masterTable) {
                _super.prototype.init.call(this, masterTable);
                this.MasterTable.Loader.registerQueryPartProvider(this);
            };
            /**
             * Call this method inside init and override filterPredicate method to make this filter
             * participate in client-side filtering
             */
            FilterBase.prototype.itIsClientFilter = function () {
                this.MasterTable.DataHolder.registerClientFilter(this);
            };
            FilterBase.prototype.filterPredicate = function (rowObject, query) { throw new Error("Please override this method"); };
            FilterBase.prototype.selectData = function (sourceDataSet, query) { throw new Error("Please override this method"); };
            return FilterBase;
        })(Plugins.PluginBase);
        Plugins.FilterBase = FilterBase;
    })(Plugins = PowerTables.Plugins || (PowerTables.Plugins = {}));
})(PowerTables || (PowerTables = {}));
//# sourceMappingURL=FilterBase.js.map