//     This code was generated by a Reinforced.Typings tool. 
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.

/// <reference path="../../PowerTables.Mvc/Scripts/typings/jquery/jquery.d.ts"/>

module PowerTables {
	/** Cell object */
	export interface ICell
	{
		/** Associated row */
		Row: PowerTables.IRow;
		/** Associated column */
		Column: PowerTables.IColumn;
		/** Data for this specific cell */
		Data: any;
		/** Whole data object associated with this specific cell */
		DataObject: any;
		/** Cell element */
		Element: any;
		/** Denotes fake cell without data */
		Fake: boolean;
	}
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
	export interface IColumn
	{
		RawName: string;
		Configuration: PowerTables.Configuration.Json.IColumnConfiguration;
		MasterTable: PowerTables.IPowerTable;
		Filter: PowerTables.IFilter;
		Elements: any;
		HeaderElement: any;
		Fake: boolean;
	}
	export interface IQueryPartProvider
	{
		modifyQuery(query: PowerTables.IQuery) : void;
	}
	export interface IRenderableComponent
	{
		Element: any;
		render(context?: any) : string;
		subscribeEvents(parentElement: JQuery) : void;
		setTemplateId(templateId?: string) : void;
		renderTo(parentElement: JQuery, context?: any) : any;
	}
	export interface IFilter extends PowerTables.IQueryPartProvider, PowerTables.IRenderableComponent
	{
		reset() : void;
	}
	export interface IPlugin extends PowerTables.IRenderableComponent
	{
		IsToolbarPlugin: boolean;
		IsQueryModifier: boolean;
		IsRenderable: boolean;
		PluginId: string;
		init(table: PowerTables.IPowerTable, pluginConfiguration: PowerTables.Configuration.Json.IPluginConfiguration) : void;
	}
	export interface IPowerTable
	{
		Columns: { [key:string]: PowerTables.IColumn };
		Filters: { [key:string]: PowerTables.IFilter };
		Configuration: PowerTables.Configuration.Json.ITableConfiguration;
		getPlugin<TPlugin>(pluginId: string, placement?: string) : TPlugin;
		reload() : void;
		requestServer(command: string, callback: (arg: any) => void, queryModifier?: (arg: PowerTables.IQuery) => PowerTables.IQuery) : void;
		isDateTime(columnName: string) : boolean;
		getColumnNames() : string[];
		registerQueryPartProvider(provider: PowerTables.IQueryPartProvider) : void;
	}
	export interface IRow
	{
		DataObject: any;
		Index: number;
		MasterTable: PowerTables.IPowerTable;
		Elements: any;
		Element: any;
		Fake: boolean;
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
	export interface ITableConfiguration
	{
		TableRootId: string;
		OperationalAjaxUrl: string;
		DefaultCellElement: string;
		DefaultRowElement: string;
		LoadImmediately: boolean;
		ServerDateTimeFormat: string;
		ClientDateTimeFormat: string;
		DatePickerFunction: (e:any, format:string) => void;
		Columns: PowerTables.Configuration.Json.IColumnConfiguration[];
		PluginsConfiguration: { [key:string]: PowerTables.Configuration.Json.IPluginConfiguration };
		/** Not cloneable! */
		StaticData: string;
		RawColumnNames: string[];
	}
	export interface IColumnConfiguration
	{
		Title: string;
		RawColumnName: string;
		Filter: PowerTables.Configuration.Json.IColumnFilterConfiguration;
		CellRenderingTemplateId: string;
		CellRenderingHtmlFunction: (a:any) => string;
		CellRenderingValueFunction: (a:any) => string;
		CellPluginsConfiguration: { [key:string]: any };
		ColumnType: string;
		IsDataOnly: boolean;
	}
	export interface IColumnFilterConfiguration
	{
		FilterKey: string;
		FilterConfiguration: any;
	}
	export interface IPluginConfiguration
	{
		PluginId: string;
		Placement: string;
		Configuration: any;
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
	export interface IHideoutCellConfiguration
	{
		Hidden: boolean;
	}
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
	export interface IRangeFilterClientConfig
	{
		FromPlaceholder: string;
		ToPlaceholder: string;
		InputDelay: number;
		FromValue: string;
		ToValue: string;
	}
}
module PowerTables.Filters.Value {
	export interface IValueFilterClientConfig
	{
		Placeholder: string;
		InputDelay: number;
		DefaultValue: string;
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
	/**
	* Client configuration for select filter. 
	*             See <see cref="T:PowerTables.Filters.Select.SelectFilterExtensions" />
	*/
	export interface ISelectFilterClientConfig
	{
		SelectedValue: string;
		AllowSelectNothing: boolean;
		IsMultiple: boolean;
		NothingText: string;
		Items: System.Web.Mvc.ISelectListItem[];
	}
}
module PowerTables.Plugins.Limit {
	/**
	* Client configuration for Limit plugin. 
	*             See <see cref="T:PowerTables.Plugins.Limit.LimitPluginExtensions" />
	*/
	export interface ILimitClientConfiguration
	{
		DefaultValue: string;
		LimitValues: number[];
		LimitLabels: string[];
		ReloadTableOnLimitChange: boolean;
	}
}
module PowerTables.Plugins.Ordering {
	/**
	* Client per-column configuration for ordering. 
	*             See <see cref="T:PowerTables.Plugins.Ordering.OrderingExtensions" />
	*/
	export interface IOrderableConfiguration
	{
		DefaultOrdering: PowerTables.Ordering;
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
		PreviousText: string;
		NextText: string;
		UsePeriods: boolean;
		PagesToHideUnderPeriod: number;
		UseFirstLastPage: boolean;
		UseGotoPage: boolean;
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