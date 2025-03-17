declare module "sap/cux/home/Layout" {
    /*!
     * SAP UI development toolkit for HTML5 (SAPUI5)
     *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
     */
    import { Event } from "jquery";
    import { MetadataOptions } from "sap/ui/core/Element";
    import BaseLayout, { $BaseLayoutSettings } from "sap/cux/home/BaseLayout";
    import BaseLayoutRenderer from "sap/cux/home/BaseLayoutRenderer";
    interface IElement {
        completeId: string;
        sContainerType: string;
        blocked: boolean;
        visible: boolean;
        title: string;
        text: string;
    }
    interface UserActionProperties {
        id: string;
        icon: string;
        text: string;
        tooltip: string;
        press: () => void;
    }
    /**
     *
     * Layout class for the My Home layout.
     *
     * @extends BaseLayout
     *
     * @author SAP SE
     * @version 0.0.1
     * @since 1.121
     *
     * @internal
     * @experimental Since 1.121
     * @public
     *
     * @alias sap.cux.home.Layout
     */
    export default class Layout extends BaseLayout {
        private _layoutSettingsPanel;
        private _advancedSettingsPanel;
        private _isCustomNews;
        private _pagesAvailable;
        private _toDoAccessible;
        private _aOrderedSections;
        private _noDataContainer;
        private _shellUserActions;
        private _userActionsAdded;
        private _keyUserPersonalization;
        private _isDefaultSettingsDialog;
        private _customNoDataContainerPresent;
        static readonly metadata: MetadataOptions;
        static renderer: typeof BaseLayoutRenderer;
        /**
         * Constructor for a new layout.
         *
         * @param {string} [id] ID for the new control, generated automatically if an ID is not provided
         * @param {object} [settings] Initial settings for the new control
         */
        constructor(id?: string, settings?: $BaseLayoutSettings);
        /**
         * Init lifecycle method
         *
         * @private
         * @async
         * @override
         */
        init(): void;
        /**
         * Adds all user actions to the Fiori launchpad.
         *
         * @private
         */
        private _addUserActions;
        /**
         * Opens the settings dialog for the layout.
         * Overriden from the BaseLayout to ensure of all panels
         * to the dialog if not already added.
         *
         * @private
         * @param {string} selectedKey The key of the panel to navigate to
         * @override
         */
        openSettingsDialog(selectedKey?: string, context?: object): Promise<void>;
        /**
         * Close Settings Dialog
         *
         * @private
         *
         */
        closeSettingsDialog(): void;
        /**
         * onBeforeRendering lifecycle method
         *
         * @private
         * @override
         */
        onBeforeRendering(event: Event): Promise<void>;
        /**
         * Sets up the settings dialog for the layout.
         *
         * @private
         */
        private _setupSettingsDialog;
        /**
         * Get default settings dialog
         * @private
         * @returns {BaseSettingsDialog} Default settings dialog
         */
        private _getDefaultSettingsDialog;
        /**
         * Get default Settings Panel
         *
         * @private
         */
        private _getDefaultSettingsPanel;
        /**
         * Adds all settings panels to the settings dialog, including
         * the layout settings panel and advanced settings panel.
         *
         * @private
         */
        private _addPanelsToSettingsDialog;
        /**
         * Sorts settings panels based on a predefined order.
         *
         * @private
         * @returns {BaseSettingsPanel[]} Sorted settings panels.
         */
        private _sortPanels;
        /**
         * Retrieves the advanced settings panel associated with the layout.
         *
         * @private
         * @returns {AdvancedSettingsPanel} The advanced settings panel.
         */
        private _getAdvancedSettingsPanel;
        /**
         * Retrieves the layout settings panel associated with the layout.
         *
         * @private
         * @returns {LayoutSettingsPanel} The layout settings panel.
         */
        private _getLayoutSettingsPanel;
        /**
         * Prepares the layout data.
         *
         * @private
         */
        private _prepareLayoutData;
        /**
         * Sets the text value for the section
         * @private
         */
        private _setTextValue;
        /**
         * Sets the visibility of the no data container
         *
         * @private
         */
        setNoDataContainerVisibility(contentVisible: boolean): void;
        /**
         * Calculates the state of the sections based on the layout's content.
         * @private
         */
        _calculateSectionsState(): Promise<void>;
        /**
         * Sets the section details based on the layout's content.
         * @private
         */
        private setSectionDetails;
        /**
         * Check whether My Interest section is blocked or not
         * @private
         */
        private checkPagesBlocked;
        /**
         * Check whether For Me Today section is blocked or not
         * @private
         */
        private checkToDoBlocked;
        /**
         * Sets up the key user settings dialog for the layout.
         *
         * @private
         */
        private _setupKeyUserSettingsDialog;
        /**
         * Return the pages availability value
         * @private
         */
        getpagesAvailable(): boolean;
        /**
         * Return the To-Dos availability value
         * @private
         */
        isToDoAccessible(): boolean;
        /**
         * Return whether customNews available or not
         */
        customNewAvailable(): boolean;
        /**
         * Returns the set of sections present within the layout
         *
         * @private
         */
        getSections(): IElement[];
        /**
         * Sets the sections present within the layout
         *
         * @private
         */
        setSections(sections: IElement[]): void;
        /**
         * Resets the ordered sections of the layout.
         *
         * @private
         */
        resetSections(): void;
    }
}
//# sourceMappingURL=Layout.d.ts.map