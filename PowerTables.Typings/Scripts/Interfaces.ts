//     This code was generated by a Reinforced.Typings tool. 
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.


module PowerTables {
	/**
	* Interface of checkboxify plugin. 
	*             Plugin id is "Checkboxify"
	*/
	export interface ICheckboxifyPlugin
	{
		/**
		* Retrieves array of checked items ids
		*
		* @param _ 
		* @returns Array of ids
		*/
		getSelection() : string[];
		/**
		* Selects or deselects all elements based on parameter
		*
		* @param select When true, all elements will be selected. No ones otherwise
		*/
		selectAll(select: boolean) : void;
		/**
		* Resets all the table selection
		*
		* @param _ 
		*/
		resetSelection() : void;
		/**
		* Selects or deselects item with specified Id
		*
		* @param itemId Item Id to select
		* @param selected True to select, false to reset selection
		*/
		selectItem(itemId: string, selected: boolean) : void;
	}
	/**
	* The respons that is being sent to client script. 
	*             This entity contains query results to be shown in table and also additional data
	*/
	export interface IPowerTablesResponse
	{
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
		AdditionalData: { [key:string]: any };
		/** Query succeeded: true/false */
		Success: boolean;
		/** Error message if not sucess */
		Message: string;
		/** Exception stack trace (if exists) */
		ExceptionStackTrace: string;
	}
	/** Data request constructed in Javascript, passed to server and extracted from ControllerContext */
	export interface IPowerTableRequest
	{
		/** Command (default is "query") */
		Command: string;
		/** Data query itself */
		Query: PowerTables.IQuery;
	}
	/** Data query (part of request) */
	export interface IQuery
	{
		/** Paging information */
		Paging: PowerTables.IPaging;
		/** Ordering information. Key = column name, Ordering = ordering */
		Orderings: { [key:string]: PowerTables.Ordering };
		/** Filtering arguments. Key = column name, Value = filter argument */
		Filterings: { [key:string]: string };
		/** Additional data. Random KV object */
		AdditionalData: { [key:string]: string };
		/** Static data extractable via PowerTablesHandler */
		StaticDataJson: string;
	}
	/** Paging information */
	export interface IPaging
	{
		/** Required page index */
		PageIndex: number;
		/** Required page size */
		PageSize: number;
	}
	/** Ordering */
	export enum Ordering { 
		/** Ascending */
		Ascending = 0, 
		/** Descending */
		Descending = 1, 
		/** Ordering is not applied */
		Neutral = 2, 
	}
}
module PowerTables.Configuration.Json {
	/** Configuration JSON object for whole table */
	export interface ITableConfiguration
	{
		/**
		* Appends empty filter if there are no filters for any columns. 
		*             This option fits good in case of table form-factor
		*/
		EmptyFiltersPlaceholder: string;
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
		DatePickerFunction: (e:any, format:string) => void;
		/** Table columns */
		Columns: PowerTables.Configuration.Json.IColumnConfiguration[];
		/** Custom plugins configuration. Key: pluginId, Value: configuration */
		PluginsConfiguration: { [key:string]: PowerTables.Configuration.Json.IPluginConfiguration };
		/** Static data that will be embedded into table and sent within each request */
		StaticData: string;
	}
	/** Table column JSON configuration */
	export interface IColumnConfiguration
	{
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
		CellRenderingValueFunction: (a:any) => string;
		/** CLR column type */
		ColumnType: string;
		/** Is column data-only (never being displayed actually) */
		IsDataOnly: boolean;
		/** Is column type Enumeration */
		IsEnum: boolean;
		/** Is column nullable */
		IsNullable: boolean;
	}
	/** Plugin JSON configuration */
	export interface IPluginConfiguration
	{
		/** Plugin ID */
		PluginId: string;
		/** Plugin placement */
		Placement: string;
		/** Plugin configuration itself */
		Configuration: any;
		/** Plugin order among particular placement */
		Order: number;
	}
}
module PowerTables.Plugins.Checkboxify {
	/**
	* Client configuration for Checkboxify plugin. 
	*             See <see cref="T:PowerTables.Plugins.Checkboxify.CheckboxifyExtensions" />
	*/
	export interface ICheckboxifyClientConfig
	{
		SelectionColumnName: string;
		ResetOnReload: boolean;
		EnableSelectAll: boolean;
		SelectAllSelectsUndisplayedData: boolean;
		SelectedRowClass: string;
		SelectAllOnlyIfAllData: boolean;
		CheckboxifyColumnName: string;
		SelectAllLocation: PowerTables.Plugins.Checkboxify.SelectAllLocation;
	}
	export enum SelectAllLocation { 
		FiltersHeader = 0, 
		ColumnHeader = 1, 
	}
}
module PowerTables.Plugins.Formwatch {
	export interface IFormwatchClientConfiguration
	{
		FieldsConfiguration: PowerTables.Plugins.Formwatch.IFormwatchFieldData[];
	}
	export interface IFormwatchFieldData
	{
		FieldJsonName: string;
		FieldSelector: string;
		FieldValueFunction: () => any;
		TriggerSearchOnEvents: string[];
		ConstantValue: string;
		SearchTriggerDelay: number;
		SetConstantIfNotSupplied: boolean;
	}
}
module PowerTables.Plugins.Hideout {
	/**
	* Client configuration for Hideout plugin. 
	*             See <see cref="T:PowerTables.Plugins.Hideout.HideoutExtensions" />
	*/
	export interface IHideoutClientConfiguration
	{
		ShowMenu: boolean;
		HidebleColumnsNames: string[];
		ReloadTableOnChangeHidden: boolean;
	}
}
module PowerTables.Filters.Range {
	/** UI configuration for range filterr */
	export interface IRangeFilterUiConfig
	{
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
		/** Turn this filter to be working on client-side */
		ClientFiltering: boolean;
		/**
		* Specifies custom client filtering function. 
		*             Function type: (datarow:any, fromValue:string, toValue:string, query:IQuery) =&gt; boolean
		*             dataRow: JSON-ed TTableObject
		*             fromValue: min. value entered to filter
		*             toValue: max. value entered to filter
		*             query: IQuery object
		*             Returns: true for satisfying objects, false otherwise
		*/
		ClientFilteringFunction: (object: any, fromValue:string, toValue:string, query: IQuery)=>boolean;
	}
}
module PowerTables.Filters.Value {
	/** UI configuration for value filter */
	export interface IValueFilterUiConfig
	{
		/** Placeholder text */
		Placeholder: string;
		/** Delay between field change and request processing begins */
		InputDelay: number;
		/** Preselected value */
		DefaultValue: string;
		/** Column name this filter associated with */
		ColumnName: string;
		/** Turn this filter to be working on client-side */
		ClientFiltering: boolean;
		/**
		* Specifies custom client filtering function. 
		*             Function type: (datarow:any, filterValue:string, query:IQuery) =&gt; boolean
		*             dataRow: JSON-ed TTableObject
		*             filterValue: value entered to filter
		*             query: IQuery object
		*             Returns: true for satisfying objects, false otherwise
		*/
		ClientFilteringFunction: (object: any, filterValue:string, query: IQuery)=>boolean;
	}
}
module PowerTables.Plugins.ResponseInfo {
	export interface IResponseInfoClientConfiguration
	{
		/** Use handlebars syntax with IResponse as context */
		TemplateText: string;
		ResponseObjectOverride: boolean;
	}
}
module System.Web.Mvc {
	export interface ISelectListItem
	{
		Disabled: boolean;
		Selected: boolean;
		Text: string;
		Value: string;
	}
}
module PowerTables.Filters.Select {
	/** UI configuration for select filter */
	export interface ISelectFilterUiConfig
	{
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
		/** Turn this filter to be working on client-side */
		ClientFiltering: boolean;
		/**
		* Specifies custom client filtering function. 
		*             Function type: (datarow:any, filterSelection:string[], query:IQuery) =&gt; boolean
		*             dataRow: JSON-ed TTableObject
		*             filterSelection: selected values
		*             query: IQuery object
		*             Returns: true for satisfying objects, false otherwise
		*/
		ClientFilteringFunction: (object: any, selectedValues:string[], query: IQuery)=>boolean;
	}
}
module PowerTables.Plugins.Limit {
	/**
	* Client configuration for Limit plugin. 
	*             See <see cref="T:PowerTables.Plugins.Limit.LimitPluginExtensions" />
	*/
	export interface ILimitClientConfiguration
	{
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
module PowerTables.Plugins.Ordering {
	/**
	* Client per-column configuration for ordering. 
	*             See <see cref="T:PowerTables.Plugins.Ordering.OrderingExtensions" />
	*/
	export interface IOrderingConfiguration
	{
		/** Default orderings for columns. Key - column RawName, Value - ordering direction */
		DefaultOrderingsForColumns: { [key:string]: PowerTables.Ordering };
		/** Columns that are sortable on client-side with corresponding comparer functions */
		ClientSortableColumns: {[key:string]:(a:any,b:any) => number};
	}
}
module PowerTables.Plugins.Paging {
	/**
	* Client configuration for Paging plugin. 
	*             See <see cref="T:PowerTables.Plugins.Paging.PagingExtensions" />
	*/
	export interface IPagingClientConfiguration
	{
		ArrowsMode: boolean;
		UsePeriods: boolean;
		PagesToHideUnderPeriod: number;
		UseFirstLastPage: boolean;
		UseGotoPage: boolean;
		EnableClientPaging: boolean;
	}
}
module PowerTables.Plugins.Toolbar {
	export interface IToolbarButtonsClientConfiguration
	{
		Buttons: PowerTables.Plugins.Toolbar.IToolbarButtonClientConfiguration[];
	}
	export interface IToolbarButtonClientConfiguration
	{
		Id: string;
		Css: string;
		Style: string;
		HtmlContent: string;
		Command: string;
		BlackoutWhileCommand: boolean;
		DisableIfNothingChecked: boolean;
		Title: string;
		/** Function (table:PowerTables.PowerTable, response:IPowerTablesResponse) =&gt; void */
		CommandCallbackFunction: (table:any /*PowerTables.PowerTable*/,response:IPowerTablesResponse)=>void;
		/** Function (continuation: ( queryModifier?:(a:IQuery) =&gt; IQuery ) =&gt; void ) =&gt; void */
		ConfirmationFunction: (continuation:(queryModifier?:(a:IQuery)=>void)=>void)=>void;
		/** Function (table:any (PowerTables.PowerTable), menuElement:any)=&gt;void */
		OnClick: (table:any /*PowerTables.PowerTable*/,menuElement:any)=>void;
		Submenu: PowerTables.Plugins.Toolbar.IToolbarButtonClientConfiguration[];
		HasSubmenu: boolean;
		IsMenu: boolean;
		Separator: boolean;
		TempId: string;
	}
}
module PowerTables.Plugins.Total {
	export interface ITotalResponse
	{
		TotalsForColumns: { [key:string]: string };
	}
	export interface ITotalClientConfiguration
	{
		ShowOnTop: boolean;
		ColumnsValueFunctions: { [key:string] : (a:any)=>string };
	}
}
