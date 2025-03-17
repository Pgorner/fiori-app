declare module "sap/cux/home/AppsContainer" {
    import GenericTile from "sap/m/GenericTile";
    import { IconTabBar$SelectEvent } from "sap/m/IconTabBar";
    import type { MetadataOptions } from "sap/ui/core/Element";
    import App from "sap/cux/home/App";
    import BaseAppPanel from "sap/cux/home/BaseAppPanel";
    import BaseContainer, { $BaseContainerSettings } from "sap/cux/home/BaseContainer";
    const getDefaultAppColor: () => {
        key: string;
        value: import("sap/ui/core/theming/Parameters").Value;
        assigned: boolean;
    };
    const CONSTANTS: {
        PLACEHOLDER_ITEMS_COUNT: number;
    };
    /**
     *
     * Container class for managing and storing apps.
     *
     * @extends sap.cux.home.BaseContainer
     *
     * @author SAP SE
     * @version 0.0.1
     * @since 1.121
     *
     * @internal
     * @experimental Since 1.121
     * @public
     *
     * @alias sap.cux.home.AppsContainer
     */
    export default class AppsContainer extends BaseContainer {
        private _oEventBus;
        private _shellNavigationHandler;
        private _isInitialRender;
        static readonly renderer: {
            apiVersion: number;
            render: (rm: import("sap/ui/core/RenderManager").default, control: BaseContainer) => void;
            renderContent: (rm: import("sap/ui/core/RenderManager").default, control: BaseContainer) => void;
        };
        static readonly metadata: MetadataOptions;
        /**
         * Constructor for a new app container.
         *
         * @param {string} [id] ID for the new control, generated automatically if an ID is not provided
         * @param {object} [settings] Initial settings for the new control
         */
        constructor(id?: string, settings?: $BaseContainerSettings);
        /**
         * Init lifecycle method
         *
         * @private
         * @override
         */
        init(): void;
        /**
         * Exit lifecycle method
         * Clean up event handlers
         * @private
         */
        exit(): void;
        /**
         * onBeforeRendering lifecycle method
         *
         * @private
         * @override
         */
        onBeforeRendering(): void;
        /**
         * Handler for navigation event.
         * @private
         * Sets the panels dirty if navigated to different page.
         */
        private _onShellNavigated;
        /**
         * Set all panels dirty state to true, to refresh all panels
         * @private
         */
        private _setPanelsDirty;
        /**
         * Generate placeholer for the panel.
         * @private
         * @param {BaseAppPanel} panel - Panel for which placeholders has to be generated.
         */
        private _generatePlaceholder;
        /**
         * Loads and sets the apps.
         * @private
         * @param {BaseAppPanel} panel - Panel for which apps has to be loaded.
         * @returns {Promise<void>} resolves when apps are loaded.
         */
        private _setApps;
        /**
         * Updates the content of the panel by replacing existing items with new apps and groups.
         * This method selects the appropriate wrapper based on the device type, and add apps/group or mobile cards to the wrapper.
         *
         * @param {BaseAppPanel} panel - The panel whose content needs to be updated.
         * @returns {void}
         * @private
         */
        private _updatePanelContent;
        /**
         * Updates the visibility of the panel's content based on the current state and device type.
         * This method determines whether to display the apps or an error message based on the presence of apps and groups.
         * It also adjusts the visibility of different containers depending on whether the device is a phone or not.
         *
         * @param {BaseAppPanel} panel - The panel whose content visibility needs to be updated.
         * @returns {void}
         * @private
         */
        private _updatePanelContentVisibility;
        /**
         * Generates generic tile based on app.
         * @private
         * @param {sap.cux.home.App} app - App.
         * @returns {sap.m.GenericTile}.
         */
        _getAppTile(app: App): GenericTile;
        /**
         * Generates generic tile based on group.
         * @private
         * @param {sap.cux.home.Group} group - Group.
         * @returns {sap.m.GenericTile}.
         */
        private _getGroupTile;
        /**
         * Overridden method for selection of panel in the IconTabBar.
         * Loads the apps in selected panel
         * @private
         * @returns {Promise<void>} resolves when apps are loaded on panel selection.
         */
        protected _onPanelSelect(event: IconTabBar$SelectEvent): Promise<void>;
        /**
         * Refresh apps for all the panels.
         * @private
         * @returns {Promise<void>} resolves when all panels are set to dirty and apps for current panel are refreshed.
         */
        _refreshAllPanels(): Promise<void>;
        /**
         * Refresh apps for selected panel.
         * @private
         * @param {BaseAppPanel} panel - Panel that has be refreshed.
         * @returns {Promise<void>} resolves when apps are refreshed.
         */
        refreshPanel(panel: BaseAppPanel): Promise<void>;
        /**
         * Toggles the visibility of the tab view based on the supported panels.
         * @private
         */
        private _toggleTabView;
        /**
         * Handles the supported state of the current panel.
         * If the panel is supported, it adds the panel to the content.
         * If the panel is not supported, it removes the panel from the content.
         * @param {BaseAppPanel} currentPanel - The panel to handle the supported state for.
         * @private
         */
        private _onPanelSupported;
        /**
         * Toggles the visibility of the panel.
         * @param {BaseAppPanel} panel - The panel to toggle the visibility for.
         * @param {boolean} isVisible - The visibility state of the panel.
         * @private
         */
        private _togglePanelVisibility;
        /**
         * Removes unsupported panels from the container.
         * @private
         */
        private _removeUnsupportedPanels;
        /**
         * Attaches an event handler to the "supported" event for each panel in the container.
         * @private
         */
        private _attachPanelSupportedEvent;
        /**
         * Adjusts the layout and visibility based on the device type.
         *
         * This method adjusts the layout type and visibility of containers based on whether the device is a phone
         * or not. It sets the container's layout property, toggles visibility of panels and their containers, and
         * adjusts background design accordingly.
         *
         * @private
         * @returns {void}
         */
        adjustLayout(): void;
        /**
         * Generates mobile card panel and add given apps/groups in the panel.
         *
         * @private
         * @returns {sap.m.Panel} The newly created mobile card panel.
         */
        private _generateMobileCards;
        /**
         * Generates group/app generic tiles for given apps/groups.
         *
         * @private
         * @param {BaseApp[]} items - Apps/Groups for which tiles has to be generated.
         * @returns {sap.m.GenericTile[]} The generated tiles.
         */
        private _generateTiles;
        /**
         * Adds given items into the wrapper.
         * @param {HeaderContainer | GridContainer} wrapper - wrapper for which items has to be added.
         * @param {Panel[] | GenericTile[]} items - items to be added.
         * @param {string} aggregationName - aggregation name to which items has to be added.
         * @private
         */
        private _addWrapperContent;
    }
}
//# sourceMappingURL=AppsContainer.d.ts.map