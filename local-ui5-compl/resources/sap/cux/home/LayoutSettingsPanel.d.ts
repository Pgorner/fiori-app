declare module "sap/cux/home/LayoutSettingsPanel" {
    import ResourceBundle from "sap/base/i18n/ResourceBundle";
    import type { MetadataOptions } from "sap/ui/core/Element";
    import BaseSettingsPanel, { $BaseSettingsPanelSettings } from "sap/cux/home/BaseSettingsPanel";
    /**
     *
     * Class for My Home Layout Settings Panel.
     *
     * @extends BaseSettingsPanel
     *
     * @author SAP SE
     * @version 0.0.1
     * @since 1.121
     *
     * @internal
     * @experimental Since 1.121
     * @private
     *
     * @alias sap.cux.home.LayoutSettingsPanel
     */
    export default class LayoutSettingsPanel extends BaseSettingsPanel {
        private _layoutTable;
        _i18nBundle: ResourceBundle;
        private _orderedSections;
        private _manageSectionsChanges;
        private _controlModel;
        private _allLayoutElements;
        private _isCollapseHandlerAttached;
        constructor(id?: string | $BaseSettingsPanelSettings);
        constructor(id?: string, settings?: $BaseSettingsPanelSettings);
        static readonly metadata: MetadataOptions;
        /**
         * Init lifecycle method
         *
         * @public
         * @override
         */
        init(): void;
        /**
         * Method to set visibility of the container sections
         * Toggle button pressed event handler
         *
         * @private
         */
        private createShowHideChangeFile;
        /**
         * Switches the layout to collapsed view if the current container is in expanded view
         *
         * @private
         * @param {BaseContainer} container - container instance to check
         * @returns {void}
         */
        private _switchToCollapsedViewIfRequired;
        /**
         * Method to load the sections
         *
         * @private
         */
        private _loadSections;
        /**
         * Rearranges the layout elements if their order has changed.
         *
         * @private
         */
        private _rearrangeLayoutIfRequired;
        /**
         * Returns the content for the Layout Settings Panel.
         *
         * @private
         * @returns {VBox} The control containing the Layout Settings Panel content.
         */
        private _getContent;
        /**
         * Returns the content for the Layout Settings Panel Header.
         *
         * @private
         * @returns {VBox} The control containing the Layout Settings Panel's Header content.
         */
        private _setHeaderIntro;
        /**
         * Returns the content for the Layout Table.
         *
         * @private
         * @returns {sap.ui.core.Control} The control containing the Layout Settings Panel'sTable.
         */
        private setLayoutTable;
        /**
         * Function to save section changes of MyHomeSettingsDialog
         *
         * @private
         */
        private _saveManageSectionsDialog;
        /**
         * Function to persist user changes
         *
         * @private
         */
        private _persistUserChanges;
        /**
         * Retrieves the actual index of a layout element by its ID.
         *
         * @private
         * @param {string} id - The ID of the layout element to find.
         * @returns {number} The index of the layout element.
         */
        private _getActualIndex;
        /**
         * Rearranges the layout elements by moving an element from the source index to the target index.
         *
         * @private
         * @param {number} sourceIndex - The index of the element to move.
         * @param {number} targetIndex - The index to move the element to.
         */
        private _rearrangeLayoutElements;
        /**
         * Function to execute drag and drop among sections
         *
         * @private
         */
        private onDropManageSections;
        /**
         * Function to reset MyHome settings changes
         *
         * @private
         */
        private resetMyhomeSettings;
    }
}
//# sourceMappingURL=LayoutSettingsPanel.d.ts.map