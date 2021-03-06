﻿module PowerTables.Plugins {
    /**
     * Base class for plugins. 
     * It contains necessary infrastructure for convinence of plugins creation
     */
    export class PluginBase<TConfiguration> implements IPlugin {

        public init(masterTable: IMasterTable): void {
            this.MasterTable = masterTable;
            this.Configuration = this.RawConfig.Configuration;
            this.subscribe(masterTable.Events);
            this.registerAdditionalHelpers(masterTable.Renderer.HandlebarsInstance);
        }

        /**
         * Raw plugin configuration
         */
        public RawConfig: Configuration.Json.IPluginConfiguration;

        /**
         * Plugin location ID
         */
        public PluginLocation: string;

        /**
         * Plugin's visual states collection. 
         * Usually it is not used, but always it is better to have one 
         */
        public VisualStates: PowerTables.Rendering.VisualState;

        /**
         * Plugin configuration object
         */
        protected Configuration: TConfiguration;

        /**
         * Reference to master table this plugin belongs to
         */
        public MasterTable: IMasterTable;

        /**
         * Events subscription method. 
         * In derived class here should be subscription to various events
         * 
         * @param e Events manager         
         */
        protected subscribe(e: EventsManager): void {
            if (this.afterDrawn != null) {
                this.MasterTable.Events.AfterLayoutRendered.subscribe(this.afterDrawn.bind(this), this.RawConfig.PluginId);
            }
        }

        /**
         * In this method you can register any additional Handlebars.js helpers in case of your 
         * templates needs ones
         * 
         * @param hb Handlebars instance
         * @returns {} 
         */
        protected registerAdditionalHelpers(hb: Handlebars.IHandlebars): void { }

        /**
         * Function that is called after plugin is drawn
         * 
         * @param e Event arguments         
         */
        protected afterDrawn: (e: ITableEventArgs<any>) => void = null;

        /**
         * Plugin order among particular placement
         */
        public Order: number;

        /**
         * Default render function using TemplateId from plugin configuration
         * @param e Templates provider
         * @returns content string
         */
        public defaultRender(e: ITemplatesProvider): string {
            return e.getCachedTemplate(this.RawConfig.TemplateId)(this);
        }
    }
}