﻿module PowerTables.Plugins.Editors {
    import SelectListEditorUiConfig = PowerTables.Editors.SelectList.ISelectListEditorUiConfig;
    import SelectListItem = System.Web.Mvc.ISelectListItem;
    import StateChangedEvent = PowerTables.Rendering.IStateChangedEvent;

    export class SelectListEditor extends CellEditorBase<SelectListEditorUiConfig> {
        List: HTMLSelectElement;
        Items: SelectListItem[];
        SelectedItem: SelectListItem;
        
        public getValue(errors: string[]): any {
            var selectedOption = this.List.options.item(this.List.selectedIndex);
            var item = <string>selectedOption.value.toString();
            var value = null;
            if (item.length === 0) {
                if (this.Column.IsString && this.Configuration.AllowEmptyString) value = item;
                if (this.Column.Configuration.IsNullable) value = null;
                else {
                    errors.push(`Value must be provided for ${this.Column.Configuration.Title}`);
                }
            } else {

                if (this.Column.IsEnum || this.Column.IsInteger) value = parseInt(item);
                else if (this.Column.IsFloat) value = parseFloat(item);
                else if (this.Column.IsBoolean) value = item.toUpperCase() === 'TRUE';
                else if (this.Column.IsDateTime) value = this.MasterTable.Date.parse(item);
                else errors.push(`Unknown value for ${this.Column.Configuration.Title}`);
            }
            
            return value;
        }

        public setValue(value: any): void {
            var strvalue = this.Column.IsDateTime ? this.MasterTable.Date.serialize(value) : value.toString();
            for (var i = 0; i < this.List.options.length; i++) {
                if (this.List.options.item(i).value === strvalue) {
                    this.List.options.item(i).selected = true;
                }
            }
            for (var i = 0; i < this.Items.length; i++) {
                if (this.Items[i].Value == strvalue) {
                    this.SelectedItem = this.Items[i];
                    break;
                }
            }
            this.VisualStates.mixinState('selected');
        }

        public onStateChange(e: StateChangedEvent) {
            if (e.State !== 'selected' && e.State !== 'saving') {
                this.VisualStates.mixinState('selected');
            }
        }

        public init(masterTable: IMasterTable): void {
            super.init(masterTable);
            this.Items = this.Configuration.SelectListItems;
            if (this.Configuration.AddEmptyElement) {
                var empty = <SelectListItem>{
                    Text: this.Configuration.EmptyElementText,
                    Value: '',
                    Disabled: false,
                    Selected: false
                };
                this.Items = [empty].concat(this.Items);
            }
        }

        public renderContent(templatesProvider: ITemplatesProvider): string {
            return templatesProvider.getCachedTemplate('selectListEditor')(this);
        }

        public onAfterRender(e: HTMLElement): void {
            if (this.VisualStates) {
                this.VisualStates.subscribeStateChange(this.onStateChange.bind(this));
            }
        }

        public changedHandler(e: PowerTables.Rendering.ITemplateBoundEvent): void {
            super.changedHandler(e);
            var item = this.List.options.item(this.List.selectedIndex).value;
            for (var i = 0; i < this.Items.length; i++) {
                if (this.Items[i].Value == item) {
                    this.SelectedItem = this.Items[i];
                    break;
                }
            }
            this.VisualStates.mixinState('selected');
            
        }

        public focus(): void {
            this.List.focus();
        }
    }

    ComponentsContainer.registerComponent('SelectListEditor', SelectListEditor);
} 