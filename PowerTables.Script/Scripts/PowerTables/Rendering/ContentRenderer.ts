﻿module PowerTables.Rendering {

    /**
     * Part of renderer that is responsible for rendering of dynamically loaded content
     */
    export class ContentRenderer {
        constructor(templatesProvider: ITemplatesProvider, stack: Rendering.RenderingStack, instances: InstanceManager) {
            this._hb = templatesProvider.HandlebarsInstance;
            this._templatesProvider = templatesProvider;
            this._stack = stack;
            this._instances = instances;
            this.cacheColumnRenderers(this._instances.Columns);
        }

        private _hb: Handlebars.IHandlebars;
        private _templatesProvider: ITemplatesProvider;
        private _columnsRenderFunctions: { [key: string]: (x: ICell) => string } = {};
        private _stack: RenderingStack;
        private _instances: InstanceManager;

        /**
         * Renders supplied table rows to string
         * 
         * @param rows Table rows
         * @returns String containing HTML of table rows
         */
        public renderBody(rows: IRow[]): string {
            var result: string = '';
            var wrapper: (arg: any) => string = this._templatesProvider.getCachedTemplate('rowWrapper');
            for (var i: number = 0; i < rows.length; i++) {
                var rw: IRow = rows[i];
                this._stack.push(RenderingContextType.Row, rw);
                if (rw.renderElement) {
                    result += rw.renderElement(this._templatesProvider);
                } else {

                    result += wrapper(rw);
                }
                this._stack.popContext();
            }
            return result;
        }

        public renderContent(columnName?: string) {
            var result: string = '';
            switch (this._stack.Current.Type) {
            case RenderingContextType.Row:
                var row: IRow = <IRow> this._stack.Current.Object;
                var columns: IColumn[] = this._instances.getUiColumns();
                var cellWrapper: (arg: any) => string = this._templatesProvider.getCachedTemplate('cellWrapper');
                for (var i: number = 0; i < columns.length; i++) {
                    var cell: ICell = row.Cells[columns[i].RawName];
                    this._stack.push(RenderingContextType.Cell, cell, columns[i].RawName);
                    if (cell.renderElement) result += cell.renderElement(this._templatesProvider);
                    else result += cellWrapper(cell);
                    this._stack.popContext();
                }
                break;
            case RenderingContextType.Cell:
                var tmpl: (x: ICell) => string = this._columnsRenderFunctions[(<ICell>this._stack.Current.Object).Column.RawName];
                result += tmpl((<ICell>this._stack.Current.Object));
                break;
            }
            return result;
        }

        private cacheColumnRenderers(columns: { [key: string]: IColumn }) {
            for (var key in columns) {
                if (columns.hasOwnProperty(key)) {
                    var columnConfig: Configuration.Json.IColumnConfiguration = columns[key].Configuration;
                    if (columnConfig.CellRenderingValueFunction) {
                        this._columnsRenderFunctions[columnConfig.RawColumnName] =
                        (x: ICell) => {
                            return x.Column.Configuration.CellRenderingValueFunction(x.DataObject);
                        };
                        continue;
                    }
                    if (columnConfig.CellRenderingTemplateId) {
                        var compiled: HandlebarsTemplateDelegate = this._hb.compile(document.getElementById(columnConfig.CellRenderingTemplateId).innerHTML);
                        this._columnsRenderFunctions[columnConfig.RawColumnName] =
                        (compl => (x: ICell) => compl(x.DataObject))(compiled);
                        continue;
                    }
                    this._columnsRenderFunctions[columnConfig.RawColumnName] =
                    (x: ICell) => ((x.Data !== null && x.Data !== undefined) ? x.Data : '');
                }
            };
        }


        /**
         * Adds/replaces column rendering function for specified column
         * 
         * @param column Column to cache renderer for
         * @param fn Rendering function          
         */
        public cacheColumnRenderingFunction(column: IColumn, fn: (x: ICell) => string) {
            this._columnsRenderFunctions[column.Configuration.RawColumnName] = fn;
        }
    }
}