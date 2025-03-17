declare module "sap/cux/home/KeyUserSettingsDialog" {
    /*!
     * SAP UI development toolkit for HTML5 (SAPUI5)
     *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
     */
    import { Event as JQueryEvent } from "jquery";
    import NavContainer from "sap/m/NavContainer";
    import Page from "sap/m/Page";
    import { MetadataOptions } from "sap/ui/core/Component";
    import BaseSettingsDialog from "sap/cux/home/BaseSettingsDialog";
    /**
     *
     * Dialog class for Key User Settings.
     *
     * @extends BaseSettingsDialog
     *
     * @author SAP SE
     * @version 0.0.1
     * @since 1.121
     *
     * @internal
     * @experimental Since 1.122
     * @private
     *
     * @alias sap.cux.home.KeyUserSettingsDialog
     */
    export default class KeyUserSettingsDialog extends BaseSettingsDialog {
        static renderer: {
            apiVersion: number;
        };
        static readonly metadata: MetadataOptions;
        private controlMap;
        private detailPageMap;
        private _eventBus;
        /**
         * Init lifecycle method
         *
         * @public
         * @override
         */
        init(): void;
        /**
         * onBeforeRendering lifecycle method.
         * Prepares the SettingsDialog content.
         *
         * @public
         * @override
         */
        onBeforeRendering(event: JQueryEvent): void;
        /**
         * Returns the page content for the SettingsDialog.
         *
         * @private
         * @returns {Page} The page content for the SettingsDialog.
         */
        private getPage;
        /**
         * Navigates to the selected page.
         *
         * @param {Page} page The page to navigate to.
         */
        navigateToPage(page: Page | undefined): void;
        /**
         * Returns the details page for the selected panel.
         *
         * @param {BaseSettingsPanel} panel The selected panel.
         * @returns {Page | undefined} The details page for the selected panel.
         */
        getDetailsPage(containerId: string): Page | undefined;
        /**
         * Checks if the selected panel has a details page.
         *
         * @param {BaseSettingsPanel} panel The selected panel.
         * @returns {boolean} True if the selected panel has a details page, false otherwise.
         */
        hasDetailsPage(containerId: string): boolean;
        /**
         * Returns the NavContainer.
         *
         * @returns {NavContainer} NavContainer.
         */
        getNavContainer(): NavContainer;
        /**
         * Save the changes.
         *
         * @private
         */
        private saveChanges;
        private isValidChanges;
        /**
         * Create and add keyuser changes to layoutHandler
         *
         * @private
         */
        private createAndAddChanges;
        /**
         * Handle cancel event.
         *
         * @private
         */
        private handleCancel;
    }
}
//# sourceMappingURL=KeyUserSettingsDialog.d.ts.map