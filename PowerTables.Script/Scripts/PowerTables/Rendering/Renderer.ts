﻿module PowerTables.Rendering {

    /**
     * Enity responsible for displaying table
     */
    export class Renderer implements ITemplatesProvider {
        constructor(rootId: string, prefix: string, instances: InstanceManager, events: EventsManager) {
            this._instances = instances;
            this._stack = new RenderingStack();
            this.RootElement = document.getElementById(rootId);
            this._rootId = rootId;
            this._events = events;

            this.HandlebarsInstance = Handlebars.create();

            this._layoutRenderer = new LayoutRenderer(this, this._stack, this._instances);
            this._contentRenderer = new ContentRenderer(this, this._stack, this._instances);
            this.BackBinder = new BackBinder(this.HandlebarsInstance, instances, this._stack);

            this.HandlebarsInstance.registerHelper("ifq", this.ifqHelper);
            this.HandlebarsInstance.registerHelper("ifloc", this.iflocHelper.bind(this));
            this.HandlebarsInstance.registerHelper('Content', this.contentHelper.bind(this));
            this.HandlebarsInstance.registerHelper('Track', this.trackHelper.bind(this));

            this.cacheTemplates(prefix);
        } 
        
        /**
         * Parent element for whole table
         */
        public RootElement: HTMLElement;

        /**
         * Parent element for table entries
         */
        public BodyElement: HTMLElement;

        /**
        * Current handlebars.js engine instance
        */
        public HandlebarsInstance: Handlebars.IHandlebars;

        /**
         * Locator of particular table parts in DOM
         */
        public Locator: DOMLocator;

        /**
         * BackBinder instance
         */
        public BackBinder: BackBinder;

        private _instances: InstanceManager;
        private _layoutRenderer: LayoutRenderer;
        private _contentRenderer: ContentRenderer;
        private _stack: RenderingStack;
        private _datepickerFunction: (e: HTMLElement) => void;
        private _templatesCache: { [key: string]: HandlebarsTemplateDelegate } = {};
        private _rootId: string;
        private _events: EventsManager;

        //#region Templates caching
        private cacheTemplates(templatesPrefix: string): void {
            var selector = `script[type="text/x-handlebars-template"][id^="${templatesPrefix}-"]`;
            var templates = document.querySelectorAll(selector);
            for (var i = 0; i < templates.length; i++) {
                var item = <HTMLElement>templates.item(i);
                var key = item.id.substring(templatesPrefix.length + 1);
                this._templatesCache[key] = this.HandlebarsInstance.compile(item.innerHTML);
            }
        }

        /**
         * Retrieves cached template handlebars function
         * @param Template Id 
         * @returns Handlebars function
         */
        public getCachedTemplate(templateId: string): (arg: any) => string {
            if (!this._templatesCache.hasOwnProperty(templateId))
                throw new Error(`Cannot find template ${templateId}`);
            return this._templatesCache[templateId];
        }

        //#endregion

        //#region Public methods
        /**
         * Perform table layout inside specified root element         
         */
        public layout(): void {
            this._events.BeforeLayoutRendered.invoke(this, null);

            var rendered = this.getCachedTemplate('layout')(null);
            this.RootElement.innerHTML = rendered;

            var bodyMarker = this.RootElement.querySelector('[data-track="tableBodyHere"]');
            if (!bodyMarker) throw new Error('{{Body}} placeholder is missing in table layout template');
            this.BodyElement = bodyMarker.parentElement;
            this.BodyElement.removeChild(bodyMarker);
            this.BackBinder.backBind(this.RootElement);
            this.Locator = new DOMLocator(this.BodyElement, this.RootElement, this._rootId);

            this._events.AfterLayoutRendered.invoke(this, null);
        }

        /**
         * Clear dynamically loaded table content and replace it with new one
         * 
         * @param rows Set of table rows         
         */
        public body(rows: IRow[]): void {
            this.clearBody();
            var html =  this._contentRenderer.renderBody(rows);
            this.BodyElement.innerHTML = html;
            this._events.AfterDataRendered.invoke(this, null);
        }

        /**
         * Redraws specified plugin refreshing all its graphical state 
         * 
         * @param plugin Plugin to redraw
         * @returns {} 
         */
        public redrawPlugin(plugin: IPlugin): void {
            this._stack.clear();
            var oldPluginElement = this.Locator.getPluginElement(plugin);
            var parent = oldPluginElement.parentElement;
            var parser = new PowerTables.Rendering.Html2Dom.HtmlParser();
            var html = this._layoutRenderer.renderPlugin(plugin);
            var newPluginElement = parser.html2Dom(html);

            parent.replaceChild(newPluginElement, oldPluginElement);
            this.BackBinder.backBind(newPluginElement);
        }

        /**
         * Redraws specified row refreshing all its graphical state
         * 
         * @param row 
         * @returns {} 
         */
        public redrawRow(row: IRow): void {
            this._stack.clear();
            var wrapper = this.getCachedTemplate('rowWrapper');
            var html;
            if (row.renderElement) {
                html = row.renderElement(this);
            } else {
                html = wrapper(row);
            }
            var oldElement = this.Locator.getRowElement(row);
            this.replaceElement(oldElement, html);
        }

        /**
         * Redraws specified row refreshing all its graphical state
         * 
         * @param row 
         * @returns {} 
         */
        public appendRow(row: IRow, afterRowAtIndex: number): void {
            this._stack.clear();
            var wrapper = this.getCachedTemplate('rowWrapper');
            var html;
            if (row.renderElement) {
                html = row.renderElement(this);
            } else {
                html = wrapper(row);
            }
            var referenceNode = this.Locator.getRowElementByIndex(afterRowAtIndex);
            var newRowElement = this.createElement(html);
            referenceNode.parentNode.insertBefore(newRowElement, referenceNode.nextSibling);
        }

        /**
         * Removes referenced row by its index
         * 
         * @param rowDisplayIndex 
         * @returns {} 
         */
        public removeRowByIndex(rowDisplayIndex: number): void {
            var referenceNode = this.Locator.getRowElementByIndex(rowDisplayIndex);
            referenceNode.parentElement.removeChild(referenceNode);
        }

        /**
         * Redraws header for specified column
         * 
         * @param column Column which header is to be redrawn         
         */
        public redrawHeader(column: IColumn): void {
            this._stack.clear();
            var html = this._layoutRenderer.renderHeader(column);
            var oldHeaderElement = this.Locator.getHeaderElement(column.Header);
            var newElement = this.replaceElement(oldHeaderElement, html);
            this.BackBinder.backBind(newElement.parentElement);
        }

        private createElement(html: string): HTMLElement {
            var parser = new PowerTables.Rendering.Html2Dom.HtmlParser();
            return parser.html2Dom(html);
        }

        private replaceElement(element: HTMLElement, html: string): HTMLElement {
            var node = this.createElement(html);
            element.parentElement.replaceChild(node, element);
            return node;
        }
        /**
         * Removes all dynamically loaded content in table
         * 
         * @returns {} 
         */
        public clearBody(): void {
            //this.BodyElement.innerHTML = '';
            while (this.BodyElement.firstChild) {
                this.BodyElement.removeChild(this.BodyElement.firstChild);
            }
        }
        //#endregion

        //#region Helpers
        public contentHelper(columnName?: string): string {
            if (this._stack.Current.Object.renderContent) {
                return this._stack.Current.Object.renderContent(this);
            } else {
                switch (this._stack.Current.Type) {
                    case RenderingContextType.Header:
                    case RenderingContextType.Plugin:
                        return this._layoutRenderer.renderContent(columnName);
                    case RenderingContextType.Row:
                    case RenderingContextType.Cell:
                        return this._contentRenderer.renderContent(columnName);
                    default:
                        throw new Error("Unknown rendering context type");

                }
            }
        }

        private trackHelper(): string {
            var trk = this._stack.Current.CurrentTrack;
            if (trk.length === 0) return '';
            return `data-track="${trk}"`;
        }

        private ifqHelper(a: any, b: any, opts: any) {
            if (a == b)
                return opts.fn(this);
            else
                return opts.inverse(this);
        }

        private iflocHelper(location: string, opts: any) {
            if (this._stack.Current.Type === RenderingContextType.Plugin) {
                var loc = (<IPlugin>this._stack.Current.Object).PluginLocation;
                if (loc.length < location.length) return opts.inverse(this);
                if (loc.length === location.length && loc === location) return opts.fn(this);
                if (loc.substring(0, location.length) === location) return opts.fn(this);
            }
            return opts.inverse(this);
        }
        //#endregion
    }
} 