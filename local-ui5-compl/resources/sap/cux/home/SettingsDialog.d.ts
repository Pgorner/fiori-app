declare module "sap/cux/home/SettingsDialog" {
    /*!
     * SAP UI development toolkit for HTML5 (SAPUI5)
     *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
     */
    import { Event as JQueryEvent } from "jquery";
    import BaseSettingsDialog from "sap/cux/home/BaseSettingsDialog";
    /**
     *
     * Dialog class for My Home Settings.
     *
     * @extends BaseSettingsDialog
     *
     * @author SAP SE
     * @version 0.0.1
     * @since 1.121
     *
     * @internal
     * @experimental Since 1.121
     * @private
     *
     * @alias sap.cux.home.SettingsDialog
     */
    export default class SettingsDialog extends BaseSettingsDialog {
        private _controlMap;
        private _menuBtn;
        private _menuList;
        private _masterPage;
        private _splitApp;
        private _deviceType;
        static renderer: {
            apiVersion: number;
        };
        /**
         * Init lifecycle method
         *
         * @public
         * @override
         */
        init(): void;
        /**
         * Creates and sets a custom header for the SettingsDialog.
         *
         * @private
         * @returns {Bar} The custom header bar for the SettingsDialog.
         */
        private _setCustomHeader;
        /**
         * Toggles the visibility of the master page in the SettingsDialog based on the current device width.
         * If the device width is less than 600 pixels or equal to or greater than 1024 pixels, the master
         * page is always shown. Otherwise, it toggles the visibility of the master page.
         *
         * @private
         */
        private _toggleMasterPage;
        /**
         * Update header button
         *
         * @param {boolean} isMasterShown If master page is shown
         * @private
         */
        private _updateHeaderButtonVisibility;
        /**
         * Generates the content for the SettingsDialog, including the master page and split app.
         *
         * @private
         * @returns {SplitApp} The split app containing the master page and detail pages for the SettingsDialog.
         */
        private _getPageContent;
        /**
         * Navigates to the detail page associated with the selected item in the master page list.
         *
         * @private
         * @param {Event} event The item press event from the master page list.
         */
        private _navigateToDetailPage;
        /**
         * Hides the navigation button associated with the provided event.
         *
         * @private
         * @param {Event} event The event triggering the hide action.
         */
        private _hideNavigationButton;
        /**
         * onBeforeRendering lifecycle method.
         * Prepares the SettingsDialog content and navigate to the selected detail page.
         *
         * @public
         * @override
         */
        onBeforeRendering(event: JQueryEvent): void;
        /**
         * Generates a list item for the master page list based on the settings panel.
         * The list item displays the title and icon of the settings panel.
         *
         * @private
         * @param {BaseSettingsPanel} settingsPanel The settings panel for which to generate the list item.
         * @returns {StandardListItem} The list item control representing the settings panel in the master page list.
         */
        private _getPageListItem;
        /**
         * Generates a detail page for the SettingsDialog based on the provided settings panel.
         *
         * @private
         * @param {BaseSettingsPanel} settingsPanel The settings panel for which to generate the detail page.
         * @returns {Page} The detail page control representing the settings panel.
         */
        private _getDetailPage;
    }
}
//# sourceMappingURL=SettingsDialog.d.ts.map