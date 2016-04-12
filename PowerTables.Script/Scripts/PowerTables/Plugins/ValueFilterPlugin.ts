﻿module PowerTables.Plugins {
    import ValueFilterUiConfig = Filters.Value.IValueFilterUiConfig;

    export class ValueFilterPlugin extends FilterBase<ValueFilterUiConfig> {
        private _filteringIsBeingExecuted: boolean = false;
        private _inpTimeout: any;
        private _previousValue: string;
        private _associatedColumn: IColumn;

        public FilterValueProvider: HTMLInputElement;

        private getValue() {
            return this.FilterValueProvider.value;
        }

        public handleValueChanged() {

            if (this._filteringIsBeingExecuted) return;

            if (this.getValue() === this._previousValue) {
                return;
            }
            this._previousValue = this.getValue();
            if (this.Configuration.InputDelay > 0) {
                clearTimeout(this._inpTimeout);
                this._inpTimeout = setTimeout(() => {
                    this._filteringIsBeingExecuted = true;
                    this.MasterTable.Controller.reload();
                    this._filteringIsBeingExecuted = false;
                }, this.Configuration.InputDelay);

            } else {
                this._filteringIsBeingExecuted = true;
                this.MasterTable.Controller.reload();
                this._filteringIsBeingExecuted = false;
            }
        }

        public renderContent(templatesProvider: ITemplatesProvider): string {
            return templatesProvider.getCachedTemplate('valueFilter')(this);
        }

        public init(masterTable: IMasterTable): void {
            super.init(masterTable);
            if (this.Configuration.ClientFiltering) {
                this.itIsClientFilter();
            }
            this._associatedColumn = this.MasterTable.InstanceManager.Columns[this.Configuration.ColumnName];
        }


        public filterPredicate(rowObject: any, query: IQuery): boolean {
            var fval: string = query.Filterings[this._associatedColumn.RawName];
            if (!fval) return true;

            if (this.Configuration.ClientFilteringFunction) {
                return this.Configuration.ClientFilteringFunction(rowObject, fval, query);
            }

            if (!query.Filterings.hasOwnProperty(this._associatedColumn.RawName)) return true;
            var objVal = rowObject[this._associatedColumn.RawName];
            if (objVal == null) return false;
            if (this._associatedColumn.IsString) {
                var entries: string[] = fval.split(/\s/);
                for (var i: number = 0; i < entries.length; i++) {
                    var e: string = entries[i].trim();
                    if (e.length > 0) {
                        if (objVal.indexOf(e) > -1) return true;
                    }
                }
            }

            if (this._associatedColumn.IsFloat) {
                var f: number = parseFloat(fval);
                return objVal === f;
            }

            if (this._associatedColumn.IsInteger || this._associatedColumn.IsEnum) {
                var int: number = parseInt(fval);
                return objVal === int;
            }

            if (this._associatedColumn.IsBoolean) {
                var bv: boolean = fval.toLocaleUpperCase() === 'TRUE' ? true :
                    fval.toLocaleUpperCase() === 'FALSE' ? false : null;
                if (bv == null) {
                    bv = parseInt(fval) > 0;
                }
                return objVal === bv;
            }

            return true;
        }

        public modifyQuery(query: IQuery, scope: QueryScope): void {
            var val: string = this.getValue();
            if (!val || val.length === 0) return;
            if (this.Configuration.ClientFiltering && scope === QueryScope.Client || scope === QueryScope.Transboundary) {
                query.Filterings[this._associatedColumn.RawName] = val;
            }
            if ((!this.Configuration.ClientFiltering) && scope === QueryScope.Server || scope === QueryScope.Transboundary) {
                query.Filterings[this._associatedColumn.RawName] = val;
            }
        }
    }

    ComponentsContainer.registerComponent('ValueFilter', ValueFilterPlugin);
}