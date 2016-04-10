/// <reference path="../../PowerTables.Script/Scripts/PowerTables/ExternalTypings.d.ts" />
declare module PowerTables {
    /**
    * Interface of checkboxify plugin.
    *             Plugin id is "Checkboxify"
    */
    interface ICheckboxifyPlugin {
        /**
        * Retrieves array of checked items ids
        *
        * @param _
        * @returns Array of ids
        */
        getSelection(): string[];
        /**
        * Selects or deselects all elements based on parameter
        *
        * @param select When true, all elements will be selected. No ones otherwise
        */
        selectAll(select: boolean): void;
        /**
        * Resets all the table selection
        *
        * @param _
        */
        resetSelection(): void;
        /**
        * Selects or deselects item with specified Id
        *
        * @param itemId Item Id to select
        * @param selected True to select, false to reset selection
        */
        selectItem(itemId: string, selected: boolean): void;
    }
    /**
    * The respons that is being sent to client script.
    *             This entity contains query results to be shown in table and also additional data
    */
    interface IPowerTablesResponse {
        /** Total results count */
        ResultsCount: number;
        /** Current data page index */
        PageIndex: number;
        /**
        * Data itself (array of properties in order as declared for each object.
        *             <example>E.g.: if source table is class User { string Id; string Name } then this field should present resulting query in a following way: [User1.Id, User1.Name,User2.Id, User2.Name ...] etc</example>
        */
        Data: any[];
        /**
        * Additional data being serialized for client.
        *             This field could contain anything that will be parsed on client side and corresponding actions will be performed.
        *             See <see cref="T:PowerTables.ResponseProcessing.IResponseModifier" />
        */
        AdditionalData: {
            [key: string]: any;
        };
        /** Query succeeded: true/false */
        Success: boolean;
        /** Error message if not sucess */
        Message: string;
        /** Exception stack trace (if exists) */
        ExceptionStackTrace: string;
    }
    /** Data request constructed in Javascript, passed to server and extracted from ControllerContext */
    interface IPowerTableRequest {
        /** Command (default is "query") */
        Command: string;
        /** Data query itself */
        Query: PowerTables.IQuery;
    }
    /** Data query (part of request) */
    interface IQuery {
        /** Paging information */
        Paging: PowerTables.IPaging;
        /** Ordering information. Key = column name, Ordering = ordering */
        Orderings: {
            [key: string]: PowerTables.Ordering;
        };
        /** Filtering arguments. Key = column name, Value = filter argument */
        Filterings: {
            [key: string]: string;
        };
        /** Additional data. Random KV object */
        AdditionalData: {
            [key: string]: string;
        };
        /** Static data extractable via PowerTablesHandler */
        StaticDataJson: string;
    }
    /** Paging information */
    interface IPaging {
        /** Required page index */
        PageIndex: number;
        /** Required page size */
        PageSize: number;
    }
    /** Ordering */
    enum Ordering {
        /** Ascending */
        Ascending = 0,
        /** Descending */
        Descending = 1,
        /** Ordering is not applied */
        Neutral = 2,
    }
}
declare module PowerTables.Configuration.Json {
    /** Configuration JSON object for whole table */
    interface ITableConfiguration {
        /** Templates prefix. It is used to distinguish several templates sets on single page from each other */
        Prefix: string;
        /** Root ID */
        TableRootId: string;
        /** URL for table requests (relative to website root) */
        OperationalAjaxUrl: string;
        /** When true, table data will be loaded immediately after initialization */
        LoadImmediately: boolean;
        /** DateTime format used on server to parse dates from client */
        ServerDateTimeFormat: string;
        /** JS-Date format used as literal on client-side */
        ClientDateTimeFormat: string;
        /** Function that turns input element to datapicker */
        DatePickerFunction: (e: any, format: string) => void;
        /** Table columns */
        Columns: PowerTables.Configuration.Json.IColumnConfiguration[];
        /** Custom plugins configuration. Key: pluginId, Value: configuration */
        PluginsConfiguration: {
            [key: string]: PowerTables.Configuration.Json.IPluginConfiguration;
        };
        /** Static data that will be embedded into table and sent within each request */
        StaticData: string;
    }
    /** Table column JSON configuration */
    interface IColumnConfiguration {
        /** Column title */
        Title: string;
        /** Raw column name */
        RawColumnName: string;
        /** Handlebars template ID for rendering */
        CellRenderingTemplateId: string;
        /**
        * Inline JS function that takes table row data object (TTableData) and
        *             turns it into HTML content that will be placed inside wrapper
        */
        CellRenderingValueFunction: (a: any) => string;
        /** CLR column type */
        ColumnType: string;
        /** Is column data-only (never being displayed actually) */
        IsDataOnly: boolean;
    }
    /** Plugin JSON configuration */
    interface IPluginConfiguration {
        /** Plugin ID */
        PluginId: string;
        /** Plugin placement */
        Placement: string;
        /** Plugin configuration itself */
        Configuration: any;
    }
}
declare module PowerTables.Plugins.Checkboxify {
    /**
    * Client configuration for Checkboxify plugin.
    *             See <see cref="T:PowerTables.Plugins.Checkboxify.CheckboxifyExtensions" />
    */
    interface ICheckboxifyClientConfig {
        SelectionColumnName: string;
        ResetOnReload: boolean;
        EnableSelectAll: boolean;
        SelectAllSelectsUndisplayedData: boolean;
        SelectedRowClass: string;
        SelectAllOnlyIfAllData: boolean;
        CheckboxifyColumnName: string;
        SelectAllLocation: PowerTables.Plugins.Checkboxify.SelectAllLocation;
    }
    enum SelectAllLocation {
        FiltersHeader = 0,
        ColumnHeader = 1,
    }
}
declare module PowerTables.Plugins.Formwatch {
    interface IFormwatchClientConfiguration {
        FieldsConfiguration: PowerTables.Plugins.Formwatch.IFormwatchFieldData[];
    }
    interface IFormwatchFieldData {
        FieldJsonName: string;
        FieldSelector: string;
        FieldValueFunction: () => any;
        TriggerSearchOnEvents: string[];
        ConstantValue: string;
        SearchTriggerDelay: number;
        SetConstantIfNotSupplied: boolean;
    }
}
declare module PowerTables.Plugins.Hideout {
    /**
    * Client configuration for Hideout plugin.
    *             See <see cref="T:PowerTables.Plugins.Hideout.HideoutExtensions" />
    */
    interface IHideoutClientConfiguration {
        ShowMenu: boolean;
        HidebleColumnsNames: string[];
        ReloadTableOnChangeHidden: boolean;
    }
}
declare module PowerTables.Filters.Range {
    /** UI configuration for range filterr */
    interface IRangeFilterUiConfig {
        /** Column name this filter associated with */
        ColumnName: string;
        /** Place holder for "From" field */
        FromPlaceholder: string;
        /** Placeholder for "To" field */
        ToPlaceholder: string;
        /** Delay between field change and request processing begins */
        InputDelay: number;
        /** "From" box preselected value */
        FromValue: string;
        /** "To" box preselected value */
        ToValue: string;
    }
}
declare module PowerTables.Filters.Value {
    /** UI configuration for value filter */
    interface IValueFilterUiConfig {
        /** Placeholder text */
        Placeholder: string;
        /** Delay between field change and request processing begins */
        InputDelay: number;
        /** Preselected value */
        DefaultValue: string;
        /** Column name this filter associated with */
        ColumnName: string;
    }
}
declare module PowerTables.Plugins.ResponseInfo {
    interface IResponseInfoClientConfiguration {
        /** Use handlebars syntax with IResponse as context */
        TemplateText: string;
        ResponseObjectOverride: boolean;
    }
}
declare module System.Web.Mvc {
    interface ISelectListItem {
        Disabled: boolean;
        Selected: boolean;
        Text: string;
        Value: string;
    }
}
declare module PowerTables.Filters.Select {
    /** UI configuration for select filter */
    interface ISelectFilterUiConfig {
        /** Preselected filter value */
        SelectedValue: string;
        /** When true, option to select "Any" entry will be added to filter */
        AllowSelectNothing: boolean;
        /** When true, ability to select multiple possible values will be available */
        IsMultiple: boolean;
        /** Text for "Any" select option */
        NothingText: string;
        /** Column name this filter associated with */
        ColumnName: string;
        /** Select filter value list */
        Items: System.Web.Mvc.ISelectListItem[];
    }
}
declare module PowerTables.Plugins.Limit {
    /**
    * Client configuration for Limit plugin.
    *             See <see cref="T:PowerTables.Plugins.Limit.LimitPluginExtensions" />
    */
    interface ILimitClientConfiguration {
        /** Value selected by default */
        DefaultValue: string;
        /** List of limit values */
        LimitValues: number[];
        /** List of corresponding limit labels */
        LimitLabels: string[];
        ReloadTableOnLimitChange: boolean;
        /**
        * When true, limiting will not be passed to server.
        *             All the limiting will be performed on client-side
        */
        EnableClientLimiting: boolean;
    }
}
declare module PowerTables.Plugins.Ordering {
    /**
    * Client per-column configuration for ordering.
    *             See <see cref="T:PowerTables.Plugins.Ordering.OrderingExtensions" />
    */
    interface IOrderingConfiguration {
        /** Default orderings for columns. Key - column RawName, Value - ordering direction */
        DefaultOrderingsForColumns: {
            [key: string]: PowerTables.Ordering;
        };
        /** Columns that are sortable on client-side with corresponding comparer functions */
        ClientSortableColumns: {
            [key: string]: (a: any, b: any) => number;
        };
    }
}
declare module PowerTables.Plugins.Paging {
    /**
    * Client configuration for Paging plugin.
    *             See <see cref="T:PowerTables.Plugins.Paging.PagingExtensions" />
    */
    interface IPagingClientConfiguration {
        ArrowsMode: boolean;
        UsePeriods: boolean;
        PagesToHideUnderPeriod: number;
        UseFirstLastPage: boolean;
        UseGotoPage: boolean;
        EnableClientPaging: boolean;
    }
}
declare module PowerTables.Plugins.Toolbar {
    interface IToolbarButtonsClientConfiguration {
        Buttons: PowerTables.Plugins.Toolbar.IToolbarButtonClientConfiguration[];
    }
    interface IToolbarButtonClientConfiguration {
        Id: string;
        Css: string;
        Style: string;
        HtmlContent: string;
        Command: string;
        BlackoutWhileCommand: boolean;
        DisableIfNothingChecked: boolean;
        Title: string;
        /** Function (table:PowerTables.PowerTable, response:IPowerTablesResponse) =&gt; void */
        CommandCallbackFunction: (table: any, response: IPowerTablesResponse) => void;
        /** Function (continuation: ( queryModifier?:(a:IQuery) =&gt; IQuery ) =&gt; void ) =&gt; void */
        ConfirmationFunction: (continuation: (queryModifier?: (a: IQuery) => void) => void) => void;
        /** Function (table:any (PowerTables.PowerTable), menuElement:any)=&gt;void */
        OnClick: (table: any, menuElement: any) => void;
        Submenu: PowerTables.Plugins.Toolbar.IToolbarButtonClientConfiguration[];
        HasSubmenu: boolean;
        IsMenu: boolean;
        Separator: boolean;
        TempId: string;
    }
}
declare module PowerTables.Plugins.Total {
    interface ITotalResponse {
        TotalsForColumns: {
            [key: string]: string;
        };
    }
    interface ITotalClientConfiguration {
        ShowOnTop: boolean;
        ColumnsValueFunctions: {
            [key: string]: (a: any) => string;
        };
    }
}
declare module PowerTables {
    /**
     * Components container for registration/resolving plugins
     */
    class ComponentsContainer {
        private static _components;
        /**
         * Registers component in components container for further instantiation
         * @param key Text ID for component
         * @param ctor Constructor function
         * @returns {}
         */
        static registerComponent(key: string, ctor: Function): void;
        /**
         * Instantiates component by its ID with specified arguments
         * @param key Text ID of desired component
         * @param args String arguments for instantiation
         * @returns {}
         */
        static resolveComponent<T>(key: string, args?: any[]): T;
    }
}
declare module PowerTables {
    import PluginConfiguration = PowerTables.Configuration.Json.IPluginConfiguration;
    /**
     * Client filter interface.
     * This interface is registerable in the DataHolder as
     * one of the part of filtering pipeline
     */
    interface IClientFilter {
        /**
         * Predicate function that must return 'true' for
         * row that is actually suitable to be displayed according to
         * implementor's settings
         *
         * @param rowObject Row table object
         * @param query Data query
         * @returns True if row is suitable to be shown. False otherwise
         */
        filterPredicate(rowObject: any, query: IQuery): boolean;
    }
    /**
     * Interface for modifying of source data set on client side
     */
    interface IClientTruncator {
        /**
         * This method should consume source
         * data set and produce resulting set.
         * Here you can truncate results e.g. apply paging.
         *
         * By technical reasons it can be only one client selector registered on table.
         *
         *
         * @param sourceDataSet Array of data objects received from server
         * @param query Data query
         */
        selectData(sourceDataSet: any[], query: IQuery): any[];
    }
    /**
     * Plugin interface.
     * Leave both render functions null to obtain non-displaying plugin
     */
    interface IPlugin extends IRenderable {
        /**
         * Raw configuration object including Plugin Id
         */
        RawConfig: PluginConfiguration;
        /**
         * Plugin Id including placement
         */
        PluginLocation: string;
        /**
         * Beginning of plugin lifecycle
         *
         * @param masterTable
         * @param configuration
         */
        init(masterTable: IMasterTable): void;
    }
    /**
     * Main table interface for breaking additional dependencies
     */
    interface IMasterTable {
        /**
        * API for raising and handling various table events
        */
        Events: EventsManager;
        /**
         * API for managing local data
         */
        DataHolder: DataHolder;
        /**
         * API for data loading
         */
        Loader: Loader;
        /**
         * API for rendering functionality
         */
        Renderer: Rendering.Renderer;
        /**
         * API for locating instances of different components
         */
        InstanceManager: InstanceManager;
        /**
         * API for overall workflow controlling
         */
        Controller: Controller;
    }
    /**
     * This enumeration distinguishes which way
     * underlying query will be used
     */
    enum QueryScope {
        /**
         * Mentioned query will be sent to server to obtain
         * data (probably) for further local filtration.
         * All locally filtered fields should be excluded from
         * underlying query
         */
        Server = 0,
        /**
         * Mentioned query will be used for local data filtration.
         * To gain performance, please exclude all data settings that were
         * applied during server request
         */
        Client = 1,
        /**
         * This query should contain both data for client and server filtering.
         * Transboundary queries are used to obtain query settings
         * that will be used on server side to retrieve data set that
         * will be used for server command handling, so server needs all filtering settings
         */
        Transboundary = 2,
    }
    /**
     * Interface for classes that are available to modify data query
     */
    interface IQueryPartProvider {
        /**
         * This method is called every time when master table needs
         * data query for its reasons. You will receive existing query part in
         * 'query' parameter and query scope denoting which this query will be used for
         * in 'scope' parameter
         *
         * @param query Existing query part
         * @param scope Query scope
         * @returns {}
         */
        modifyQuery(query: PowerTables.IQuery, scope: QueryScope): void;
    }
    /** Renderable entity */
    interface IRenderable {
        /**
        * Renders whole element to string using templates provider
        *
        * @param templatesProvider Cached templates provider
        * @returns String containing HTML code for element
        */
        renderElement?: (templatesProvider: PowerTables.ITemplatesProvider) => string;
        /**
        * Renders element to HTML string using templates provider
        *
        * @param templatesProvider Cached templates provider
        * @returns String containing HTML code for element
        */
        renderContent?: (templatesProvider: PowerTables.ITemplatesProvider) => string;
    }
    /** Cell object */
    interface ICell extends PowerTables.IRenderable {
        /** Associated row */
        Row: PowerTables.IRow;
        /** Associated column */
        Column: PowerTables.IColumn;
        /** Data for this specific cell */
        Data: any;
        /** Whole data object associated with this specific cell */
        DataObject: any;
    }
    /**
     * Colun header rendering object
     */
    interface IColumnHeader extends PowerTables.IRenderable {
        /**
         * Reference to containing column
         */
        Column: PowerTables.IColumn;
    }
    /**
     * Row object
     */
    interface IRow extends PowerTables.IRenderable {
        /**
         * Data object for row
         */
        DataObject: any;
        /**
         * Displaying index.
         * You can obtain data for this particular row from DataHolder
         * using localLookupDisplayedData method
         */
        Index: number;
        /**
         * Reference to table object this row belongs to
         */
        MasterTable: IMasterTable;
        /**
         * Cells collection for this particular row
         */
        Cells: {
            [key: string]: PowerTables.ICell;
        };
    }
    interface ITemplatesProvider {
        /** Current handlebars.js engine instance */
        HandlebarsInstance: Handlebars.IHandlebars;
        /**
        * Retrieves cached template handlebars function
        *
        * @param templateId Template id
        * @returns Handlebars function
        */
        getCachedTemplate(templateId: string): (arg: any) => string;
    }
    interface IColumn {
        /** Raw column name */
        RawName: string;
        /** Column configuration */
        Configuration: PowerTables.Configuration.Json.IColumnConfiguration;
        /** Reference to master table */
        MasterTable: IMasterTable;
        /** Column header */
        Header: IColumnHeader;
        /** Column order (left-to-right) */
        Order: number;
    }
}
declare module PowerTables {
    /**
     * Wrapper for table event with ability to subscribe/unsubscribe
     */
    class TableEvent<TEventArgs> {
        constructor(masterTable: any);
        private _masterTable;
        private _handlers;
        /**
         * Invokes event with overridden this arg and specified event args
         *
         * @param thisArg "this" argument to be substituted to callee
         * @param eventArgs Event args will be passed to callee
         */
        invoke(thisArg: any, eventArgs: TEventArgs): void;
        /**
         * Subscribes specified function to event with supplied string key.
         * Subscriber key is needed to have an ability to unsubscribe from event
         * and should reflect entity that has been subscriben
         *
         * @param handler Event handler to subscribe
         * @param subscriber Subscriber key to associate with handler
         */
        subscribe(handler: (e: ITableEventArgs<TEventArgs>) => any, subscriber: string): void;
        /**
         * Unsubscribes specified addressee from event
         * @param subscriber Subscriber key associated with handler
         */
        unsubscribe(subscriber: string): void;
    }
    /**
     * Events manager for table.
     * Contains all available events
     */
    class EventsManager {
        private _masterTable;
        constructor(masterTable: any);
        /**
         * "Before Layout Drawn" event.
         * Occurs before layout is actually drawn but after all table is initialized.
         */
        BeforeLayoutDrawn: TableEvent<any>;
        /**
         * "After Layout Drawn" event.
         * Occurs right after layout is drawn.
         */
        AfterLayoutDrawn: TableEvent<any>;
        /**
         * "Before Filter Gathering" event.
         * Occurs every time before sending request to server via Loader before
         * filtering information is being gathered. Here you can add your own
         * additional data to prepared query that will be probably overridden by
         * other query providers.
         */
        BeforeQueryGathering: TableEvent<IQueryGatheringEventArgs>;
        BeforeClientQueryGathering: TableEvent<IQueryGatheringEventArgs>;
        /**
         * "After Filter Gathering" event.
         * Occurs every time before sending request to server via Loader AFTER
         * filtering information is being gathered. Here you can add your own
         * additional data to prepared query that will probably override parameters
         * set by another query providers.
         */
        AfterQueryGathering: TableEvent<IQueryGatheringEventArgs>;
        AfterClientQueryGathering: TableEvent<IQueryGatheringEventArgs>;
        /**
         * "Before Loading" event.
         * Occurs every time right before calling XMLHttpRequest.send and
         * passing gathered filters to server
         */
        BeforeLoading: TableEvent<ILoadingEventArgs>;
        /**
         * "Deferred Data Received" event.
         * Occurs every time when server has answered to particular query with
         * with reference to deferred query. It means that server has memorized particular
         * request with specified token and will proceed data selection/other operations
         * when you query it by Operatioal AJAX URL + "?q=$Token$".
         *
         * This feature is usable when it is necessary e.g. to generate file (excel, PDF)
         * using current table filters
         */
        DeferredDataReceived: TableEvent<IDeferredDataEventArgs>;
        /**
         * "Loading Error" event.
         * Occurs every time when Loader encounters loading error.
         * It may be caused by server error or network (XMLHttp) error.
         * Anyway, error text/cause/stacktrace will be supplied as Reason
         * field of event args
         */
        LoadingError: TableEvent<ILoadingErrorEventArgs>;
        /**
         * "Columns Creation" event.
         * Occurs when full columns list formed and available for
         * modifying. Addition/removal/columns modification is acceptable
         */
        ColumnsCreation: TableEvent<{
            [key: string]: IColumn;
        }>;
        /**
         * "Data Received" event.
         * Occurs EVERY time when something is being received from server side.
         * Event argument is deserialized JSON data from server.
         */
        DataReceived: TableEvent<IDataEventArgs>;
        BeforeClientDataProcessing: TableEvent<IQuery>;
        /**
         * "After Loading" event.
         * Occurs every time after EVERY operation connected to server response handling
         * has been finished
         */
        AfterLoading: TableEvent<ILoadingEventArgs>;
        /**
         * "Before Client Rows Rendering" event.
         *
         * Occurs every time after after rows set for client-side was
         * modified but not rendered yet. Here you can add/remove/modify render for
         * particular rows
         */
        BeforeClientRowsRendering: TableEvent<IRow[]>;
        /**
         * Registers new event for events manager.
         * This method is to be used by plugins to provide their
         * own events.
         *
         * Events being added should be described in plugin's .d.ts file
         * as extensions to Events manager
         * @param eventName Event name
         * @returns {}
         */
        registerEvent<TEventArgs>(eventName: string): void;
    }
    /**
     * Event args wrapper for table
     */
    interface ITableEventArgs<T> {
        /**
         * Reverence to master table
         */
        MasterTable: any;
        /**
         * Event arguments
         */
        EventArgs: T;
    }
    /**
     * Event args for loading events
     */
    interface ILoadingEventArgs {
        /**
         * Query to be sent to server
         */
        Request: IPowerTableRequest;
        /**
         * Request object to be used while sending to server
         */
        XMLHttp: XMLHttpRequest;
    }
    interface ILoadingResponseEventArgs extends ILoadingEventArgs {
        /**
         * Response received from server
         */
        Response: IPowerTablesResponse;
    }
    /**
     * Event args for loading error event
     */
    interface ILoadingErrorEventArgs extends ILoadingEventArgs {
        /**
         * Error text
         */
        Reason: string;
        /**
         * Stack trace (if any)
         */
        StackTrace: string;
    }
    /**
     * Event args for deferred data received event
     */
    interface IDeferredDataEventArgs extends ILoadingEventArgs {
        /**
         * Token to obtain deferred data
         */
        Token: string;
        /**
         * URL that should be queries to obtain request result
         */
        DataUrl: string;
    }
    /**
     * Event args for data received event
     */
    interface IDataEventArgs extends ILoadingEventArgs {
        /**
         * Query response
         */
        Data: IPowerTablesResponse;
    }
    /**
     * Event args for query gathering process
     */
    interface IQueryGatheringEventArgs {
        /**
         * Query is being gathered
         */
        Query: IQuery;
        /**
         * Query scope that is used
         */
        Scope: QueryScope;
    }
}
declare module PowerTables {
    /**
     * This entity is responsible for integration of data between storage and rendere.
     * Also it provides functionality for table events subscription and
     * elements location
     */
    class Controller {
        constructor(masterTable: IMasterTable);
        private onLoadingError(e);
        private _masterTable;
        private _rootSelector;
        private _domEvents;
        private _cellDomSubscriptions;
        private _rowDomSubscriptions;
        private _attachFn;
        private _matches;
        /**
         * Initializes full reloading cycle
         * @returns {}
         */
        reload(): void;
        private localRedrawVisible();
        /**
         * Shows full-width table message
         * @param tableMessage Message of type ITableMessage
         * @returns {}
         */
        showTableMessage(tableMessage: ITableMessage): void;
        /**
         * Subscribe handler to any DOM event happening on particular table cell
         *
         * @param subscription Event subscription
         */
        subscribeCellEvent(subscription: IUiSubscription<ICellEventArgs>): void;
        /**
         * Subscribe handler to any DOM event happening on particular table row.
         * Note that handler will fire even if particular table cell event happened
         *
         * @param subscription Event subscription
         */
        subscribeRowEvent(subscription: IUiSubscription<IRowEventArgs>): void;
        private ensureEventSubscription(eventId);
        private onTableEvent(e);
        /**
         * Inserts data entry to local storage
         *
         * @param insertion Insertion command
         */
        insertLocalRow(insertion: IInsertRequest): void;
        /**
         * Removes data entry from local storage
         *
         * @param insertion Insertion command
         */
        deleteLocalRow(deletion: IDeleteRequest): void;
        /**
         * Updates data entry in local storage
         *
         * @param insertion Insertion command
         */
        updateLocalRow(update: IUpdateRequest): void;
        private localFullRefresh();
        private localVisibleReorder();
        produceRow(dataObject: any, idx: number, columns?: IColumn[]): IRow;
        private produceRows();
    }
    interface IRowEventArgs {
        /**
        * Master table reference
        */
        Table: IMasterTable;
        /**
         * Original event reference
         */
        OriginalEvent: Event;
        /**
         * Row index.
         * Data object can be restored using Table.DataHolder.localLookupDisplayedData(RowIndex)
         */
        DisplayingRowIndex: number;
    }
    /**
     * Event arguments for particular cell event
     */
    interface ICellEventArgs extends IRowEventArgs {
        /**
         * Column index related to particular cell.
         * Column object can be restored using Table.InstanceManager.getUiColumns()[ColumnIndex]
         */
        ColumnIndex: number;
    }
    interface ISubscription {
        /**
         * Event Id
         */
        EventId: string;
        /**
         * Selector of element
         */
        Selector?: string;
        /**
         * Subscription ID (for easier unsubscribe)
         */
        SubscriptionId: string;
        Handler: any;
    }
    /**
     * Information about UI subscription
     */
    interface IUiSubscription<TEventArgs> extends ISubscription {
        /**
         * Event handler
         *
         * @param e Event arguments
         */
        Handler: (e: TEventArgs) => any;
    }
    /**
     * Behavior of redrawing table after modification
     */
    enum RedrawBehavior {
        /**
         * To perform UI redraw, data will be entirely reloaded from server.
         * Local data will not be affected due to further reloading
         */
        ReloadFromServer = 0,
        /**
         * Filters will be reapplied only locally.
         * Currently displaying data will be entirely redrawn with client filters
         * using locally cached data from server.
         *
         * In this case, if modified rows are not satisfying any server conditions then
         * is will still stay in table. That may seem illogical for target users.
         */
        LocalFullRefresh = 1,
        /**
         * Filters will be reapplied locally but only on currently displaying data.
         *
         * In this case, deleted row will simply disappear, added row will be added to currently
         * displaying cells set and currently displaying set will be re-ordered, modified
         * row will be ordered among only displaying set without filtering.
         * This approach is quite fast and may be useful in various cases
         */
        LocalVisibleReorder = 2,
        /**
         * Simply redraw all the visible cells without additional filtering.
         *
         * May lead to glitches e.g. invalid elements count on page or invalid
         * items order. Most suitable for updating that does not touch filtering/ordering-sensetive
         * data.
         */
        RedrawVisible = 3,
        /**
         * Only particular row mentioned in modification request will be updated.
         * No server reloading, no reordering, no re-sorting. Row will stay in place or
         * will be added at specified position or will be simply disappear from currently displayed set.
         * In some cases such behavior may confuse users, but still stay suitable for most cases.
         * Of course, it will disappear after on next filtering if no more satisfying
         * filter conditions.
         */
        ParticularRowUpdate = 4,
        /**
         * Modification request will not affect UI anyhow until next filtering. Confusing.
         */
        DoNothing = 5,
    }
    /**
     * Base interface for modification commands
     */
    interface IModificationRequest {
        /**
         * Behavior of refreshing UI after data modification.
         * See help for RedrawBehavior for details
         */
        RedrawBehavior: RedrawBehavior;
        /**
         * Index of row among stored data
         */
        StorageRowIndex: number;
        /**
         * Index of row among displaying data
         */
        DisplayRowIndex: number;
    }
    /**
     * Data insertion request
     */
    interface IInsertRequest extends IModificationRequest {
        /**
         * Object to insert
         */
        DataObject: any;
    }
    /**
     * Data removal request
     */
    interface IDeleteRequest extends IModificationRequest {
    }
    /**
     * Data update request
     */
    interface IUpdateRequest extends IModificationRequest {
        /**
         * Function that will be called on object being updated
         *
         * @param object Data object
         */
        UpdateFn: (object: any) => void;
    }
    interface ITableMessage {
        Message: string;
        AdditionalData: string;
        MessageType: string;
        UiColumnsCount?: number;
    }
}
declare module PowerTables {
    /**
     * Class that is responsible for holding and managing data loaded from server
     */
    class DataHolder {
        constructor(rawColumnNames: string[], isColumnDateTimeFunc: (s: string) => boolean, events: EventsManager, instances: InstanceManager);
        private _rawColumnNames;
        private _isColumnDateTimeFunc;
        private _comparators;
        private _filters;
        private _anyClientFiltration;
        private _events;
        private _instances;
        /**
         * Data that actually is currently displayed in table
         */
        DisplayedData: any[];
        /**
         * Data that was recently loaded from server
         */
        StoredData: any[];
        /**
         * Enable query truncation from beginning during executing client queries
         */
        EnableClientSkip: boolean;
        /**
         * Enable query truncation by data cound during executing client queries
         */
        EnableClientTake: boolean;
        /**
         * Registers client filter
         *
         * @param filter Client filter
         */
        registerClientFilter(filter: IClientFilter): void;
        /**
         * Registers new client ordering comparer function
         *
         * @param dataField Field for which this comparator is applicable
         * @param comparator Comparator fn that should return 0 if entries are equal, -1 if a<b, +1 if a>b
         * @returns {}
         */
        registerClientOrdering(dataField: string, comparator: (a: any, b: any) => number): void;
        /**
         * Is there any client filtration pending
         * @returns True if there are any actions to be performed on query after loading, false otherwise
         */
        isClientFiltrationPending(): boolean;
        /**
        * Parses response from server and turns it to objects array
        */
        storeResponse(response: IPowerTablesResponse, clientQuery: IQuery): void;
        /**
         * Client query that was used to obtain recent local data set
         */
        RecentClientQuery: IQuery;
        /**
         * Filters supplied data set using client query
         *
         * @param objects Data set
         * @param query Client query
         * @returns {Array} Array of filtered items
         */
        filterSet(objects: any[], query: IQuery): any[];
        /**
        * Orders supplied data set using client query
        *
        * @param objects Data set
        * @param query Client query
        * @returns {Array} Array of ordered items
        */
        orderSet(objects: any[], query: IQuery): any[];
        /**
         * Filter recent data and store it to currently displaying data
         *
         * @param query Table query
         * @returns {}
         */
        filterStoredData(query: IQuery): void;
        /**
         * Filter recent data and store it to currently displaying data
         * using query that was previously applied to local data
         */
        filterStoredDataWithPreviousQuery(): void;
        /**
         * Finds data matching predicate among locally stored data
         *
         * @param predicate Filtering predicate returning true for required objects
         * @returns Array of ILocalLookupResults
         */
        localLookup(predicate: (object: any) => boolean): ILocalLookupResult[];
        /**
         * Finds data object among currently displayed and returns ILocalLookupResult
         * containing also Loaded-set index of this data object
         *
         * @param index Index of desired data object among locally displaying data
         * @returns ILocalLookupResult
         */
        localLookupDisplayedData(index: number): ILocalLookupResult;
        /**
         * Finds data object among recently loaded and returns ILocalLookupResult
         * containing also Loaded-set index of this data object
         *
         * @param index Index of desired data object among locally displaying data
         * @returns ILocalLookupResult
         */
        localLookupStoredData(index: number): ILocalLookupResult;
    }
    /**
     * Result of searching among local data
     */
    interface ILocalLookupResult {
        /**
         * Data object reference itself
         */
        DataObject: any;
        /**
         * Is data object currently displaying or not
         */
        IsCurrentlyDisplaying: boolean;
        /**
         * Row index among loaded data
         */
        LoadedIndex: number;
        /**
         * Row index among displayed data
         */
        DisplayedIndex: number;
    }
}
declare module PowerTables {
    import TableConfiguration = Configuration.Json.ITableConfiguration;
    /**
     * This thing is used to manage instances of columns, plugins etc.
     * It consumes PT configuration as source and provides caller with
     * plugins instances, variable ways to query them and accessing their properties
     */
    class InstanceManager {
        constructor(configuration: Configuration.Json.ITableConfiguration, masterTable: IMasterTable, events: EventsManager);
        /**
         * Dictionary containing current table columns configurations.
         * Key - raw column name. Value - IColumn instance
         */
        Columns: {
            [key: string]: IColumn;
        };
        /**
         * Dictionary containing all instances of table plugins.
         * Key - full plugin ID (incl. placement). Value - plugin itself
         */
        Plugins: {
            [key: string]: IPlugin;
        };
        /**
         * Events manager
         */
        private _events;
        /**
         * Table configuration
         */
        Configuration: TableConfiguration;
        private _rawColumnNames;
        private _masterTable;
        private initColumns();
        initPlugins(): void;
        /**
         * Reteives plugin at specified placement
         * @param pluginId Plugin ID
         * @param placement Pluign placement
         * @returns {}
         */
        getPlugin(pluginId: string, placement?: string): IPlugin;
        /**
         * Retrieves plugins list at specific placement
         *
         * @param placement Plugins placement
         * @returns {}
         */
        getPlugins(placement: string): IPlugin[];
        /**
         * Reteives plugin at specified placement
         * @param pluginId Plugin ID
         * @param placement Pluign placement
         * @returns {}
         */
        getColumnFilter<TPlugin>(columnName: string): TPlugin;
        /**
         * Determines is column of DateTime type or not
         * @param columnName Column name
         * @returns {}
         */
        isDateTime(columnName: string): boolean;
        /**
         * Determines is column of DateTime type or not
         * @param columnName Column name
         * @returns {}
         */
        isDateTimeColumn(column: IColumn): boolean;
        /**
         * Retrieves sequential columns names in corresponding order
         * @returns {}
         */
        getColumnNames(): string[];
        /**
         * Retrieves sequential columns names in corresponding order
         * @returns {}
         */
        getUiColumnNames(): string[];
        /**
         * Retreives columns suitable for UI rendering in corresponding order
         *
         * @returns {}
         */
        getUiColumns(): IColumn[];
        /**
         * Retrieves column by its raw name
         *
         * @param columnName Raw column name
         * @returns {}
         */
        getColumn(columnName: string): IColumn;
    }
}
declare module PowerTables {
    /**
     * Component that is responsible for querying server
     */
    class Loader {
        constructor(staticData: any, operationalAjaxUrl: string, events: EventsManager, dataHolder: DataHolder);
        private _queryPartProviders;
        private _previousRequest;
        private _staticData;
        private _operationalAjaxUrl;
        private _events;
        private _dataHolder;
        private _isFirstTimeLoading;
        /**
         * Registers new query part provider to be used while collecting
         * query data before sending it to server.
         *
         * @param provider instance implementing IQueryPartProvider interface
         * @returns {}
         */
        registerQueryPartProvider(provider: IQueryPartProvider): void;
        private gatherQuery(queryScope);
        private getXmlHttp();
        private _previousQueryString;
        private doServerQuery(data, clientQuery, callback);
        /**
         * Sends specified request to server and lets table handle it.
         * Always use this method to invoke table's server functionality because this method
         * correctly rises all events, handles errors etc
         *
         * @param command Query command
         * @param callback Callback that will be invoked after data received
         * @param queryModifier Inline query modifier for in-place query modification
         * @returns {}
         */
        requestServer(command: string, callback: (data: any) => void, queryModifier?: (a: IQuery) => IQuery): void;
    }
}
declare module PowerTables.Rendering {
    /**
     * Part of renderer that is responsible for rendering of dynamically loaded content
     */
    class ContentRenderer {
        constructor(templatesProvider: ITemplatesProvider, stack: PowerTables.Rendering.RenderingStack, instances: InstanceManager);
        private _hb;
        private _templatesProvider;
        private _columnsRenderFunctions;
        private _stack;
        private _instances;
        /**
         * Renders supplied table rows to string
         *
         * @param rows Table rows
         * @returns String containing HTML of table rows
         */
        renderBody(rows: IRow[]): string;
        renderContent(columnName?: string): string;
        private cacheColumnRenderers(columns);
    }
}
declare module PowerTables.Rendering.Html2Dom {
    class HtmlParserDefinitions {
        static startTag: RegExp;
        static endTag: RegExp;
        static attr: RegExp;
        static empty: {
            [key: string]: boolean;
        };
        static block: {
            [key: string]: boolean;
        };
        static inline: {
            [key: string]: boolean;
        };
        static closeSelf: {
            [key: string]: boolean;
        };
        static fillAttrs: {
            [key: string]: boolean;
        };
        static special: {
            [key: string]: boolean;
        };
        private static makeMap(str);
    }
    /**
     * Small HTML parser to turn user's HTMl to DOM
     * Thanks to John Resig, co-author of jQuery
     * http://ejohn.org/blog/pure-javascript-html-parser/
     */
    class HtmlParser {
        constructor();
        private _stack;
        private parse(html);
        private parseStartTag(tag, tagName, rest, unary);
        private parseEndTag(tag?, tagName?);
        private _curParentNode;
        private _elems;
        private _topNodes;
        private start(tagName, attrs, unary);
        private end(tag);
        private chars(text);
        html2Dom(html: string): HTMLElement;
    }
}
declare module PowerTables.Rendering {
    /**
     * Rendering stack class. Provives common helper
     * infrastructure for context-oriented rendering
     */
    class RenderingStack {
        private _contextStack;
        /**
         * Clears rendering stack
         * @returns {}
         */
        clear(): void;
        /**
         * Current rendering context
         */
        Current: IRenderingContext;
        /**
         * Pushes rendering context into stack
         * @param ctx
         * @returns {}
         */
        pushContext(ctx: IRenderingContext): void;
        /**
         * Pushes rendering context into stack
         * @param elementType What is being rendered
         * @param element Reference to object is being rendered
         * @param columnName Optional column name - for column-contexted rendering objects
         * @returns {}
         */
        push(elementType: RenderingContextType, element: IRenderable, columnName?: string): void;
        private getTrack(elementType, element);
        /**
         * Pops rendering context from stack
         * @returns {}
         */
        popContext(): void;
    }
    /**
     * Denotes current rendering context
     */
    interface IRenderingContext {
        /**
         * What is being rendered (Object type)
         */
        Type: RenderingContextType;
        /**
         * Reference to object is being rendered
         */
        Object?: IRenderable;
        /**
         * Optional column name - for column-contexted rendering objects
         */
        ColumnName?: string;
        /**
         * Rendering object track attribute
         */
        CurrentTrack: string;
    }
    /**
     * What renders in current helper method
     */
    enum RenderingContextType {
        /**
         * Plugin (0)
         */
        Plugin = 0,
        /**
         * Column header (1)
         */
        Header = 1,
        /**
         * Row (containing cells) (2)
         */
        Row = 2,
        /**
         * Cell (belonging to row and column) (3)
         */
        Cell = 3,
    }
}
declare module PowerTables.Rendering {
    /**
     * Layout renderer
     * Is responsive for common layout rendering (with plugins, columns, etc)
     */
    class LayoutRenderer {
        private _instances;
        private _templatesProvider;
        private _hb;
        private _eventsQueue;
        private _markQueue;
        private _stack;
        constructor(templates: ITemplatesProvider, stack: RenderingStack, instances: InstanceManager);
        /**
         * Applies binding of events left in events queue
         *
         * @param parentElement Parent element to lookup for event binding attributes
         * @returns {}
         */
        bindEventsQueue(parentElement: HTMLElement): void;
        private bodyHelper();
        private pluginHelper(pluginPosition, pluginId);
        private pluginsHelper(pluginPosition);
        /**
         * Renders specified plugin into string including its wrapper
         *
         * @param plugin Plugin interface
         * @returns {}
         */
        renderPlugin(plugin: IPlugin): string;
        private headerHelper(columnName);
        /**
         * Renders specified column's header into string including its wrapper
         *
         * @param column Column which header is about to be rendered
         * @returns {}
         */
        renderHeader(column: IColumn): string;
        private headersHelper();
        private bindEventHelper();
        private markHelper(fieldName);
        renderContent(columnName?: string): string;
    }
    /**
     * Event that was bound from template
     */
    interface ITemplateBoundEvent<T> {
        /**
         * Element triggered particular event
         */
        Element: HTMLElement;
        /**
         * Original DOM event
         */
        EventObject: Event;
        /**
         * Event received (to avoid using "this" in come cases)
         */
        Receiver: T;
        /**
         * Event argumetns
         */
        EventArguments: any[];
    }
}
declare module PowerTables.Rendering {
    /**
     * This module allows you to locate particular elements in table's DOM
     */
    class DOMLocator {
        constructor(bodyElement: HTMLElement, rootElement: HTMLElement, rootId: string);
        private _bodyElement;
        private _rootElement;
        private _rootIdPrefix;
        /**
         * Retrieves cell element by cell object
         *
         * @param cell Cell element
         * @returns {HTMLElement} Element containing cell (with wrapper)
         */
        getCellElement(cell: ICell): HTMLElement;
        /**
         * Retrieves cell element using supplied coordinates
         *
         * @param cell Cell element
         * @returns {HTMLElement} Element containing cell (with wrapper)
         */
        getCellElementByIndex(rowDisplayIndex: number, columnIndex: number): HTMLElement;
        /**
         * Retrieves row element (including wrapper)
         *
         * @param row Row
         * @returns HTML element
         */
        getRowElement(row: IRow): HTMLElement;
        /**
        * Retrieves row element (including wrapper) by specified row index
        *
        * @param row Row
        * @returns HTML element
        */
        getRowElementByIndex(rowDisplayingIndex: number): HTMLElement;
        /**
         * Retrieves data cells for specified column (including wrappers)
         *
         * @param column Column desired data cells belongs to
         * @returns HTML NodeList containing results
         */
        getColumnCellsElements(column: IColumn): NodeList;
        /**
         * Retrieves data cells for specified column (including wrappers) by column index
         *
         * @param column Column desired data cells belongs to
         * @returns HTML NodeList containing results
         */
        getColumnCellsElementsByColumnIndex(columnIndex: number): NodeList;
        /**
         * Retrieves data cells for whole row (including wrapper)
         *
         * @param row Row with data cells
         * @returns NodeList containing results
         */
        getRowCellsElements(row: IRow): NodeList;
        /**
         * Retrieves data cells for whole row (including wrapper)
         *
         * @param row Row with data cells
         * @returns NodeList containing results
         */
        getRowCellsElementsByIndex(rowDisplayingIndex: number): NodeList;
        /**
         * Retrieves HTML element for column header (including wrapper)
         *
         * @param header Column header
         * @returns HTML element
         */
        getHeaderElement(header: IColumnHeader): HTMLElement;
        /**
         * Retrieves HTML element for plugin (including wrapper)
         *
         * @param plugin Plugin
         * @returns HTML element
         */
        getPluginElement(plugin: IPlugin): HTMLElement;
        /**
         * Determines if supplied element is table row
         *
         * @param e Testing element
         * @returns {boolean} True when supplied element is row, false otherwise
         */
        isRow(e: HTMLElement): boolean;
        /**
         * Determines if supplied element is table cell
         *
         * @param e Testing element
         * @returns {boolean} True when supplied element is cell, false otherwise
         */
        isCell(e: HTMLElement): boolean;
    }
}
declare module PowerTables.Rendering {
    /**
     * Enity responsible for displaying table
     */
    class Renderer implements ITemplatesProvider {
        constructor(rootId: string, prefix: string, isColumnDateTimeFunc: (s: string) => boolean, instances: InstanceManager, events: EventsManager);
        /**
         * Parent element for whole table
         */
        RootElement: HTMLElement;
        /**
         * Parent element for table entries
         */
        BodyElement: HTMLElement;
        /**
        * Current handlebars.js engine instance
        */
        HandlebarsInstance: Handlebars.IHandlebars;
        /**
         * Locator of particular table parts in DOM
         */
        Locator: DOMLocator;
        private _isColumnDateTimeFunc;
        private _instances;
        private _layoutRenderer;
        private _contentRenderer;
        private _stack;
        private _datepickerFunction;
        private _templatesCache;
        private _rootId;
        private _events;
        private cacheTemplates(templatesPrefix);
        /**
         * Retrieves cached template handlebars function
         * @param Template Id
         * @returns Handlebars function
         */
        getCachedTemplate(templateId: string): (arg: any) => string;
        /**
         * Perform table layout inside specified root element
         */
        layout(): void;
        /**
         * Clear dynamically loaded table content and replace it with new one
         *
         * @param rows Set of table rows
         */
        body(rows: IRow[]): void;
        /**
         * Redraws specified plugin refreshing all its graphical state
         *
         * @param plugin Plugin to redraw
         * @returns {}
         */
        redrawPlugin(plugin: IPlugin): void;
        /**
         * Redraws specified row refreshing all its graphical state
         *
         * @param row
         * @returns {}
         */
        redrawRow(row: IRow): void;
        /**
         * Redraws specified row refreshing all its graphical state
         *
         * @param row
         * @returns {}
         */
        appendRow(row: IRow, afterRowAtIndex: number): void;
        /**
         * Removes referenced row by its index
         *
         * @param rowDisplayIndex
         * @returns {}
         */
        removeRowByIndex(rowDisplayIndex: number): void;
        /**
         * Redraws header for specified column
         *
         * @param column Column which header is to be redrawn
         */
        redrawHeader(column: IColumn): void;
        private createElement(html);
        private replaceElement(element, html);
        /**
         * Removes all dynamically loaded content in table
         *
         * @returns {}
         */
        clearBody(): void;
        contentHelper(columnName?: string): string;
        private trackHelper();
        private datepickerHelper();
        private ifqHelper(a, b, opts);
        private iflocHelper(location, opts);
    }
}
declare module PowerTables {
    /**
    * Helper class for producing track ids
    */
    class TrackHelper {
        /**
         * Returns string track ID for cell
         */
        static getCellTrack(cell: ICell): string;
        /**
         * Returns string track ID for cell
         */
        static getCellTrackByIndexes(rowIndex: number, columnIndex: number): string;
        /**
         * Returns string track ID for plugin
         */
        static getPluginTrack(plugin: IPlugin): string;
        /**
         * Returns string track ID for plugin
         */
        static getPluginTrackByLocation(pluginLocation: string): string;
        /**
         * Returns string track ID for header
         */
        static getHeaderTrack(header: IColumnHeader): string;
        /**
         * Returns string track ID for header
         */
        static getHeaderTrackByColumnName(columnName: string): string;
        /**
         * Returns string track ID for row
         */
        static getRowTrack(row: IRow): string;
        /**
         * Returns string track ID for row
         */
        static getRowTrackByIndex(index: number): string;
        /**
         * Parses cell track to retrieve column and row index
         *
         * @param e HTML element containing cell with wrapper
         * @returns {ICellLocation} Cell location
         */
        static getCellLocation(e: HTMLElement): ICellLocation;
        /**
         * Parses row track to retrieve row index
         *
         * @param e HTML element containing row with wrapper
         * @returns {number} Row index
         */
        static getRowIndex(e: HTMLElement): number;
    }
    /**
     * Interface describing cell location
     */
    interface ICellLocation {
        /**
         * Row index
         */
        RowIndex: number;
        /**
         * Column index
         */
        ColumnIndex: number;
    }
}
declare module PowerTables {
    import TableConfiguration = PowerTables.Configuration.Json.ITableConfiguration;
    class PowerTable implements IMasterTable {
        constructor(configuration: TableConfiguration);
        private _isReady;
        private bindReady();
        private _configuration;
        private initialize();
        /**
         * Reloads table content.
         * This method is left for backward compatibility
         *
         * @returns {}
         */
        reload(): void;
        /**
         * API for raising and handling various table events
         */
        Events: EventsManager;
        /**
         * API for managing local data
         */
        DataHolder: DataHolder;
        /**
         * API for data loading
         */
        Loader: Loader;
        /**
         * API for rendering functionality
         */
        Renderer: Rendering.Renderer;
        /**
         * API for locating instances of different components
         */
        InstanceManager: InstanceManager;
        /**
         * API for overall workflow controlling
         */
        Controller: Controller;
    }
}
declare module PowerTables.Plugins {
    /**
     * Base class for plugins.
     * It contains necessary infrastructure for convinence of plugins creation
     */
    class PluginBase<TConfiguration> implements IPlugin {
        init(masterTable: IMasterTable): void;
        RawConfig: PowerTables.Configuration.Json.IPluginConfiguration;
        PluginLocation: string;
        /**
         * Plugin configuration object
         */
        protected Configuration: TConfiguration;
        /**
         * Reference to master table this plugin belongs to
         */
        protected MasterTable: IMasterTable;
        /**
         * Events subscription method.
         * In derived class here should be subscription to various events
         *
         * @param e Events manager
         */
        protected subscribe(e: EventsManager): void;
        /**
         * In this method you can register any additional Handlebars.js helpers in case of your
         * templates needs ones
         *
         * @param hb Handlebars instance
         * @returns {}
         */
        protected registerAdditionalHelpers(hb: Handlebars.IHandlebars): void;
    }
}
declare module PowerTables.Plugins {
    /**
     * Base class for creating filters
     */
    class FilterBase<T> extends PluginBase<T> implements IQueryPartProvider, IClientFilter, IClientTruncator {
        modifyQuery(query: IQuery, scope: QueryScope): void;
        init(masterTable: IMasterTable): void;
        /**
         * Call this method inside init and override filterPredicate method to make this filter
         * participate in client-side filtering
         */
        protected itIsClientFilter(): void;
        filterPredicate(rowObject: any, query: IQuery): boolean;
        selectData(sourceDataSet: any[], query: IQuery): any[];
    }
}
declare module PowerTables.Plugins {
    class LoadingPlugin extends PluginBase<any> implements ILoadingPlugin {
        subscribe(e: EventsManager): void;
        private _blinkElement;
        showLoadingIndicator(): void;
        hideLoadingIndicator(): void;
        static Id: string;
        renderContent(templatesProvider: ITemplatesProvider): string;
    }
    /**
     * Loading indicator plugin.
     * Plugin Id: Loading
     */
    interface ILoadingPlugin {
        /**
         * Shows loading indicator
         */
        showLoadingIndicator(): void;
        /**
         * Hides loading indicator
         */
        hideLoadingIndicator(): void;
    }
}
declare module PowerTables.Plugins.Ordering {
    class OrderingPlugin extends FilterBase<IOrderingConfiguration> {
        private _clientOrderings;
        private _serverOrderings;
        subscribe(e: EventsManager): void;
        private overrideHeadersTemplates(columns);
        private updateOrdering(columnName, ordering);
        private specifyOrdering(object, ordering);
        private isClient(columnName);
        switchOrderingForColumn(columnName: string): void;
        protected nextOrdering(currentOrdering: PowerTables.Ordering): Ordering;
        private makeDefaultOrderingFunction(fieldName);
        init(masterTable: IMasterTable): void;
        private mixinOrderings(orderingsCollection, query);
        modifyQuery(query: IQuery, scope: QueryScope): void;
    }
}
declare module PowerTables.Plugins {
    import LimitClientConfiguration = PowerTables.Plugins.Limit.ILimitClientConfiguration;
    import TemplateBoundEvent = PowerTables.Rendering.ITemplateBoundEvent;
    class LimitPlugin extends FilterBase<LimitClientConfiguration> implements ILimitPlugin {
        renderContent(templatesProvider: ITemplatesProvider): string;
        changeLimitHandler(e: TemplateBoundEvent<ILimitPlugin>): void;
        changeLimit(limit: number): void;
        SelectedValue: string;
        private _limitSize;
        Sizes: ILimitSize[];
        modifyQuery(query: IQuery, scope: QueryScope): void;
        init(masterTable: IMasterTable): void;
        private onColumnsCreation();
    }
    /**
     * Size entry for limit plugin
     */
    interface ILimitSize {
        IsSeparator: boolean;
        Value: number;
        Label: string;
    }
    /**
     * Limit plugin interface
     */
    interface ILimitPlugin {
        /**
         * Changeable. Will refresh after plugin redraw
         */
        SelectedValue: string;
        /**
         * Changeable. Will refresh after plugin redraw
         */
        Sizes: ILimitSize[];
        /**
         * Changes limit settings and updates UI
         *
         * @param limit Selected limit
         * @returns {}
         */
        changeLimit(limit: number): any;
    }
}
declare module PowerTables.Plugins {
    import TemplateBoundEvent = PowerTables.Rendering.ITemplateBoundEvent;
    import PagingClientConfiguration = PowerTables.Plugins.Paging.IPagingClientConfiguration;
    class PagingPlugin extends FilterBase<PagingClientConfiguration> {
        Pages: IPagesElement[];
        Shown: boolean;
        NextArrow: boolean;
        PrevArrow: boolean;
        private _selectedPage;
        private _totalPages;
        private _pageSize;
        GotoPanel: HTMLElement;
        GotoBtn: HTMLElement;
        GotoInput: HTMLInputElement;
        private onFilterGathered(e);
        private onColumnsCreation();
        private onResponse(e);
        private onClientDataProcessing(e);
        private pageClick(page);
        gotoPageClick(e: TemplateBoundEvent<PagingPlugin>): void;
        navigateToPage(e: TemplateBoundEvent<PagingPlugin>): void;
        nextClick(e: TemplateBoundEvent<PagingPlugin>): void;
        previousClick(e: TemplateBoundEvent<PagingPlugin>): void;
        private constructPagesElements();
        renderContent(templatesProvider: ITemplatesProvider): string;
        validateGotopage(): void;
        modifyQuery(query: IQuery, scope: QueryScope): void;
        init(masterTable: IMasterTable): void;
    }
    interface IPagesElement {
        Prev?: boolean;
        Period?: boolean;
        ActivePage?: boolean;
        Page: number;
        First?: boolean;
        Last?: boolean;
        InActivePage?: boolean;
        DisPage?: () => string;
    }
}
