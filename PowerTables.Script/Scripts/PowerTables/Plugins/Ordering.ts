﻿module PowerTables.Plugins.Ordering {
    import TemplateBoundEvent = Rendering.ITemplateBoundEvent;

    export class OrderingPlugin extends FilterBase<IOrderingConfiguration> {
        private _clientOrderings: { [key: string]: PowerTables.Ordering } = {};
        private _serverOrderings: { [key: string]: PowerTables.Ordering } = {};

        public subscribe(e: EventsManager): void {
            e.ColumnsCreation.subscribe(v => {
                this.overrideHeadersTemplates(v.EventArgs);
            }, 'ordering');
        }

        private overrideHeadersTemplates(columns: { [key: string]: IColumn }) {
            var handler = (e: TemplateBoundEvent<ICustomHeader>) => {
                this.switchOrderingForColumn(e.Receiver.Column.RawName);
            }
            for (var ck in columns) {
                if (columns.hasOwnProperty(ck)) {
                    var ordering = this.Configuration.DefaultOrderingsForColumns[ck];
                    if (!ordering) continue;
                    var newHeader: ICustomHeader = {
                        Column: columns[ck],
                        switchOrdering: handler,
                        IsClientOrdering: this.isClient(ck)
                    };
                    this.updateOrdering(ck, ordering);
                    (function (hdr) {
                        hdr.renderElement = tp => {
                            return tp.getCachedTemplate('ordering')(hdr);
                        };
                    })(newHeader);

                    this.specifyOrdering(newHeader, ordering);
                    columns[ck].Header = newHeader;

                }
            }
        }

        private updateOrdering(columnName: string, ordering: PowerTables.Ordering) {
            if (this.isClient(columnName)) this._clientOrderings[columnName] = ordering;
            else this._serverOrderings[columnName] = ordering;
        }

        private specifyOrdering(object: ICustomHeader, ordering: PowerTables.Ordering) {
            object.IsNeutral = object.IsDescending = object.IsAscending = false;
            switch (ordering) {
                case PowerTables.Ordering.Neutral: object.IsNeutral = true; break;
                case PowerTables.Ordering.Descending: object.IsDescending = true; break;
                case PowerTables.Ordering.Ascending: object.IsAscending = true; break;
            }
        }

        private isClient(columnName: string): boolean {
            return this.Configuration.ClientSortableColumns.hasOwnProperty(columnName);
        }
        public switchOrderingForColumn(columnName: string) {
            if (!this.Configuration.DefaultOrderingsForColumns[columnName])
                throw new Error(`Ordering is not configured for column ${columnName}`);
            var coolHeader = <ICustomHeader>this.MasterTable.InstanceManager.Columns[columnName].Header;
            var orderingsCollection = this.isClient(columnName) ? this._clientOrderings : this._serverOrderings;
            var next = this.nextOrdering(orderingsCollection[columnName]);
            this.specifyOrdering(coolHeader, next);
            this.updateOrdering(columnName, next);
            this.MasterTable.Renderer.redrawHeader(coolHeader.Column);
            this.MasterTable.Controller.reload();
        }

        protected nextOrdering(currentOrdering: PowerTables.Ordering) {

            switch (currentOrdering) {
                case PowerTables.Ordering.Neutral: return PowerTables.Ordering.Ascending;
                case PowerTables.Ordering.Descending: return PowerTables.Ordering.Neutral;
                case PowerTables.Ordering.Ascending: return PowerTables.Ordering.Descending;
            }
        }

        private makeDefaultOrderingFunction(fieldName:string) {
            var self = this;
            return (function (field) {
                return function(a, b) {
                    var x = a[field], y = b[field];
                    if (x === y) return 0;
                    if (x == null || x == undefined) return -1;
                    if (y == null || y == undefined) return 1;
                    if (typeof x === "string") {
                        return x.localeCompare(y);
                    }
                    return (x > y) ? 1 : -1;
                }
            })(fieldName);
        }

        public init(masterTable: IMasterTable): void {
            super.init(masterTable);
            var hasClientOrderings = false;
            var fn: (a: any, b: any) => any;
            for (var cls in this.Configuration.ClientSortableColumns) {
                if (this.Configuration.ClientSortableColumns.hasOwnProperty(cls)) {
                    hasClientOrderings = true;

                    fn = this.Configuration.ClientSortableColumns[cls];
                    if (!fn) {
                        fn = this.makeDefaultOrderingFunction(cls);
                        this.Configuration.ClientSortableColumns[cls] = fn;
                    }
                    this.MasterTable.DataHolder.registerClientOrdering(cls, fn);
                }
            }

            if (hasClientOrderings) {
                // if we have at least 1 client ordering then we have to reorder whole 
                // received data on client
                // to avoid client ordering priority
                for (var serverColumn in this.Configuration.DefaultOrderingsForColumns) {
                    if (this.isClient(serverColumn)) continue;
                    fn = this.makeDefaultOrderingFunction(serverColumn);
                    this.MasterTable.DataHolder.registerClientOrdering(serverColumn, fn);
                }
            }
        }
        
        private mixinOrderings(orderingsCollection: { [key: string]: PowerTables.Ordering }, query: IQuery) {
            for (var clo in orderingsCollection) {
                if (orderingsCollection.hasOwnProperty(clo)) {
                    query.Orderings[clo] = orderingsCollection[clo];
                }
            }
        }

        public modifyQuery(query: IQuery, scope: QueryScope): void {
            this.mixinOrderings(this._serverOrderings, query);
            if (scope === QueryScope.Client || scope === QueryScope.Transboundary) {
               this.mixinOrderings(this._clientOrderings,query);
            }
        }
    }

    interface ICustomHeader extends IColumnHeader {
        switchOrdering: (e: TemplateBoundEvent<ICustomHeader>) => void;
        IsNeutral?: boolean;
        IsAscending?: boolean;
        IsDescending?: boolean;
        IsClientOrdering: boolean;
    }

    ComponentsContainer.registerComponent('Ordering', OrderingPlugin);
} 