﻿module PowerTables.Plugins.Editors {
    import TemplateBoundEvent = PowerTables.Rendering.ITemplateBoundEvent;
    import State = PowerTables.Rendering.IState;

    export class CellEditorBase<T> extends PluginBase<T> implements ICellEditor {
        
        /**
         * Is current editor valid (flag set by master editor)
         */
        public IsValid:boolean;

        /**
         * True when field is single, false when multiple (e.g. row edit, form edit)
         */
        public CanComplete: boolean;

        /**
         * True when cell editor is part of row edit, otherwise false
         */
        public IsRowEdit: boolean;

        /**
         * True when cell editor is part of form edit, otherwise false
         */
        public IsFormEdit: boolean;

        /**
         * Original, locally displayed data object
         */
        public DataObject: any;

        /**
         * Value for particular editor column
         */
        public Data: any;

        /**
         * Retrieves original value for this particular cell editor
         * 
         * @returns {Any} Original, unchanged value
         */
        protected getThisOriginalValue(): any {
            return this.DataObject[this.Column.RawName];
        }

        /**
         * Resets editor value to initial settings
         */
        public reset(): void {
            this.setValue(this.getThisOriginalValue());
        }

        /**
         * Data object that is modified within editing process
         */
        public ModifiedDataObject: any;

        /**
         * Reference to parent editor
         */
        public Row: Editor;

        /**
         * Corresponding column
         */
        public Column: IColumn;

        /**
         * Flag when initial value setting occures
         */
        public IsInitialValueSetting:boolean;

        /**
         * Returns entered editor value
         * 
         * @returns {} 
         */
        public getValue(errors: string[]): any { throw new Error("Not implemented"); }

        /**
         * Sets editor value from the outside
         */
        public setValue(value: any): void { throw new Error("Not implemented"); }

        /**
         * Template-bound event raising on changing this editor's value 
         */
        public changedHandler(e: TemplateBoundEvent): void {
            if (this.IsInitialValueSetting) return;
            this.Row.notifyChanged(this);
        }

        /**
         * Event handler for commit (save edited, ok, submit etc) event raised from inside of CellEditor
         * Commit leads to validation. Cell editor should be notified
         */
        public commitHandler(e: TemplateBoundEvent): void {
            this.Row.commit(this);
        }

        /**
         * Event handler for reject (cancel editing) event raised from inside of CellEditor
         * Cell editor should be notified
         */
        public rejectHandler(e: TemplateBoundEvent): void {
            this.Row.reject(this);
        }

        /**
         * Called when cell editor has been drawn
         * 
         * @param e HTML element where editor is rendered
         * @returns {} 
         */
        public onAfterRender(e: HTMLElement): void { }

        /**
         * Needed by editor in some cases
         * 
         * @returns {} 
         */
        public focus(): void{ }

        public OriginalContent(): string {
            return this.MasterTable.Renderer.ContentRenderer.renderCell(this);
        }
    }

    export interface ICellEditor extends IPlugin, ICell {
        /**
         * Plugin's visual states collection. 
         * Usually it is not used, but always it is better to have one 
         */
        VisualStates: PowerTables.Rendering.VisualState;

        /**
         * Original, locally displayed data object
         */
        DataObject: any;

        /**
         * Data object that is modified within editing process
         */
        ModifiedDataObject: any;
        
        /**
         * Returns entered editor value
         * 
         * @param errors Validation errors collection
         * @returns {} 
         */
        getValue(errors: string[]): any;

        /**
         * Sets editor value from the outside
         */
        setValue(value: any): void;
        
        /**
         * Corresponding column
         */
        Column: IColumn;

        /**
         * Resets editor value to initial settings
         */
        reset(): void;

        /**
         * True when field is single, false when multiple (e.g. row edit, form edit)
         */
        CanComplete: boolean;

        /**
         * True when cell editor is part of row edit, otherwise false
         */
        IsRowEdit: boolean;

        /**
         * True when cell editor is part of form edit, otherwise false
         */
        IsFormEdit: boolean;

        /**
         * Flag when initial value setting occures
         */
        IsInitialValueSetting: boolean;

        /**
        * Called when cell editor has been drawn
        * 
        * @param e HTML element where editor is rendered
        * @returns {} 
        */
        onAfterRender(e: HTMLElement): void;

        /**
         * Is current editor valid (flag set by master editor)
         */
        IsValid: boolean;

        /**
         * Needed by editor in some cases
         * 
         * @returns {} 
         */
        focus(): void;
    }
} 