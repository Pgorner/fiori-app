declare module "sap/cux/home/BaseAppPanel" {
    import GridContainer from "sap/f/GridContainer";
    import Button from "sap/m/Button";
    import GenericTile from "sap/m/GenericTile";
    import HeaderContainer from "sap/m/HeaderContainer";
    import IllustratedMessage from "sap/m/IllustratedMessage";
    import VBox from "sap/m/VBox";
    import Event from "sap/ui/base/Event";
    import Control from "sap/ui/core/Control";
    import type { MetadataOptions } from "sap/ui/core/Element";
    import App from "sap/cux/home/App";
    import { $BaseAppPanelSettings } from "sap/cux/home/BaseAppPanel";
    import BasePanel from "sap/cux/home/BasePanel";
    import Group from "sap/cux/home/Group";
    import MenuItem from "sap/cux/home/MenuItem";
    import { IActivity, ICustomVisualization } from "sap/cux/home/interface/AppsInterface";
    import AppManager from "sap/cux/home/utils/AppManager";
    /**
     *
     * Base App Panel class for managing and storing Apps.
     *
     * @extends sap.cux.home.BasePanel
     *
     * @author SAP SE
     * @version 0.0.1
     * @since 1.121.0
     *
     * @abstract
     * @internal
     * @experimental Since 1.121
     * @private
     *
     * @alias sap.cux.home.BaseAppPanel
     */
    export default abstract class BaseAppPanel extends BasePanel {
        private _isDirty;
        private _isMobileDirty;
        private _isLoaded;
        private _appsWrapper;
        private _errorCard;
        private _errorMessage;
        private _appsPanelWrapper;
        private _allAvailableVisualizations;
        private _catalogVisualizationCache;
        protected appManagerInstance: AppManager;
        private _isSupported;
        private _mobileAppsWrapper;
        protected _menuItems: MenuItem[];
        protected _actionButtons: Button[];
        protected _controlMap: Map<string, Control | Element>;
        constructor(idOrSettings?: string | $BaseAppPanelSettings);
        constructor(id?: string, settings?: $BaseAppPanelSettings);
        static readonly metadata: MetadataOptions;
        /**
         * This method must be implemented by panel, to set the apps that needs to be shown in the panel.
         * @abstract
         */
        abstract loadApps(): Promise<void>;
        init(): void;
        /**
         * Generates the wrapper for the apps panel, if it doesn't already exist
         *
         * @private
         * @override
         * @returns {sap.m.VBox} The apps panel wrapper.
         */
        protected _generateWrapper(): VBox;
        /**
         * Generates desktop apps wrapper for displaying apps.
         * @private
         * @returns {sap.m.VBox} The generated apps wrapper.
         */
        _generateDesktopAppsWrapper(): VBox;
        /**
         * Generates app wrapper (GridContainer) for displaying apps.
         * @private
         * @returns {sap.m.GridContainer} The generated apps wrapper.
         */
        _generateAppsWrapper(): GridContainer;
        /**
         * Generates wrapper for displaying apps in mobile mode.
         * @private
         * @returns {sap.m.HeaderContainer} The generated apps wrapper.
         */
        _generateMobileAppsWrapper(): HeaderContainer;
        /**
         * Generates the error message wrapper with illustrated message.
         * @private
         * @returns {sap.m.VBox} Wrapper with illustrated message.
         */
        _generateErrorMessage(): VBox;
        /**
         * Creates and returns app instances for given app objects
         * @private
         * @param {object[]} appObjects - Array of app object.
         * @returns {sap.cux.home.App[]} - Array of app instances
         */
        generateApps(visualizationsData: ICustomVisualization[]): App[];
        /**
         * Add multiple apps in the apps aggregation.
         * @param {sap.cux.home.App[]} apps - Array of apps.
         */
        setApps(apps: App[]): void;
        /**
         * Fetches and returns the tile visualizations for the current device type (Mobile or Desktop).
         *
         * @public
         * @param {GenericTile[]} tiles - This array will be updated with new tile data based on the device type.
         *
         * @returns {GenericTile[]} - returns updated tiles
         */
        fetchTileVisualization(tiles?: GenericTile[]): GenericTile[];
        /**
         * Convert array of provided activities to app
         * @private
         * @param {object[]} activities - Array of activities.
         * @returns {object[]} - Array of apps
         */
        protected convertActivitiesToVisualizations(activities: IActivity[]): Promise<IActivity[]>;
        /**
         * Returns promise that resolves to array of all available visualizations
         * @private
         * @returns {Promise} A Promise that resolves to array of all available visualizations.
         */
        private _getAllAvailableVisualizations;
        /**
         * Updates vizualization array with information - if vizualization is present in favorites .
         * @private
         * @param {object[]} visualizations - Array of vizualizations.
         * @returns {object[]} - Array of updated vizualizations.
         */
        private _updateVisualizationAvailability;
        /**
         * Updates user activity with provided vizualization info
         * @private
         * @param {object} activity - User activity.
         * @param {object} updatedVizConfig - Updated vizualization config.
         * @returns {object} - Updated user acitvity.
         */
        private _updateActivityInfo;
        /**
         * Finds the best matching visualization for a given activity from a list of matching visualizations.
         *
         * This method first attempts to find an exact match for the target URL of the activity among the matching visualizations.
         * If no exact match is found, it uses the URLParsingService to compare parameters of the target URLs to find the best match.
         * It then updates the activity information with the best matching visualization.
         *
         * @private
         * @param {IActivity} activity - The activity for which to find the best matching visualization.
         * @param {IVisualization[]} matchingVisualizations - A list of visualizations that match the activity.
         * @param {URLParsing} URLParsingService - A service used to parse and compare target URLs.
         * @returns {IVisualization | undefined} The best matching visualization, or undefined if no match is found.
         */
        private _findBestMatchingVisualization;
        /**
         * Filters matching visualizations based on activity parameters and assigns priority.
         *
         * This method compares the parameters of the activity with those of a matched visualization
         * to determine if they match.
         *
         * @private
         * @returns {boolean} Returns true if the visualization matches the activity, false otherwise.
         */
        private _filterMatchingVisualization;
        /**
         * Converts given user activity to vizualization
         * @private
         * @param {object} activity - User Activity.
         * @param {object[]} catalogVisualizations - array of all available visualizations in catalog.
         * @param {object} URLParsingService - URL parsing service.
         * @returns {object} - visualization
         */
        private _convertToVisualization;
        /**
         * Adds visualization to favorite apps
         * @private
         * @param {sap.ui.base.Event} event - The event object.
         */
        protected _addAppToFavorites(event: Event): Promise<void>;
        /**
         * Checks if the panel is loaded. If the panel is not loaded then placholders are shown otherwise not
         * @private
         * @returns {boolean} true if the panel is loaded, false otherwise.
         */
        isLoaded(): boolean;
        /**
         * Set the loaded status of the app panel.
         * @private
         * @param {boolean} val - The new loaded status to set for the app panel.
         */
        setLoaded(val: boolean): void;
        /**
         * Returns the dirty status of the app panel. If the panel is dirty then only re-render the apps
         * @private
         * @returns {boolean} true if the panel is dirty, false otherwise.
         */
        isDirty(): boolean;
        /**
         * Set the dirty status of the app panel.
         * @private
         * @param {boolean} val - The new dirty status to set for the app panel.
         */
        setDesktopViewDirty(val: boolean): void;
        /**
         * Returns the dirty status of the app mobile panel. If the panel is dirty then only re-render the apps
         * @private
         * @returns {boolean} true if the panel is dirty, false otherwise.
         */
        isMobileDirty(): boolean;
        /**
         * Set the dirty status of the app mobile panel.
         * @private
         * @param {boolean} val - The new dirty status to set for the app mobile panel.
         */
        setMobileViewDirty(val: boolean): void;
        /**
         * Sets aggregation for give control.
         * @param {Object} control - Control for which aggregation has to be set.
         * @param {Object[]} items - Items to be added in aggregation.
         * @param {string} aggregationName - Aggregation name
         * @private
         */
        _setAggregation: (control: Control | Group, items?: Control[] | App[], aggregationName?: string) => void;
        /**
         * Sets the busy state of panel.
         * @private
         * @param {boolean} isBusy - Indicates whether the panel should be set to busy state.
         */
        protected setBusy(isBusy: boolean): void;
        /**
         * Retrieves the group with the specified group Id.
         * @private
         * @param {string} groupId - The Id of the group.
         * @returns {sap.cux.home.Group} The group with the specified group Id, or null if not found.
         */
        protected _getGroup(groupId: string): Group;
        /**
         * Checks if the panel is supported.
         * @returns {boolean} True if the panel is supported, false otherwise.
         * @private
         */
        isSupported(): boolean;
        /**
         * Sets panel as supported or unsupported.
         * @param {boolean} isSupported true if the panel is supported, false otherwise.
         * @private
         */
        setSupported(isSupported: boolean): void;
        /**
         * Attaches user activity tracking based on the configuration.
         * If user activity tracking is enabled, it listens to changes in tracking activity configuration
         * and fires a 'supported' event accordingly.
         * @private
         */
        protected _attachUserActivityTracking(): void;
        /**
         * Refreshes the panel.
         * @public
         */
        protected refresh(): Promise<void>;
        /**
         * Generates default illustrated message for panel.
         * @private
         * @returns {sap.m.IllustratedMessage} Illustrated error message for panel.
         */
        protected generateIllustratedMessage(): IllustratedMessage;
    }
}
//# sourceMappingURL=BaseAppPanel.d.ts.map