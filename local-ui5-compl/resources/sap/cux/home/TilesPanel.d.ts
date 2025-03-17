declare module "sap/cux/home/TilesPanel" {
    import Button from "sap/m/Button";
    import Control from "sap/ui/core/Control";
    import type { MetadataOptions } from "sap/ui/core/Element";
    import BasePanel from "sap/cux/home/BasePanel";
    import MenuItem from "sap/cux/home/MenuItem";
    import { $TilesPanelSettings } from "sap/cux/home/TilesPanel";
    enum tilesMenuItems {
        REFRESH = "tiles-refresh",
        ADD_APPS = "tiles-addSmartApps",
        EDIT_TILES = "tiles-editTiles"
    }
    enum DisplayFormat {
        Standard = "standard",
        StandardWide = "standardWide"
    }
    const _showAddApps: () => boolean;
    /**
     *
     * Tiles Panel class for managing and storing Insights Tiles.
     *
     * @extends sap.cux.home.BasePanel
     *
     * @author SAP SE
     * @version 0.0.1
     * @since 1.122.0
     *
     * @internal
     * @experimental Since 1.122
     * @public
     *
     * @alias sap.cux.home.TilesPanel
     */
    export default class TilesPanel extends BasePanel {
        constructor(idOrSettings?: string | $TilesPanelSettings);
        constructor(id?: string, settings?: $TilesPanelSettings);
        private _oData;
        private _insightsSectionTitle;
        private _addFromFavDialogId;
        private appManagerInstance;
        private VizInstantiationService;
        private tilesContainer;
        private aInsightsApps;
        private _controlModel;
        _controlMap: Map<string, Control | Element>;
        menuItems: MenuItem[];
        actionButtons: Button[];
        private oEventBus;
        private insightsContainer;
        static readonly metadata: MetadataOptions;
        init(): Promise<void>;
        /**
         * Toggles the activity of tiles on route change.
         *
         * @private
         * @returns {void}
         */
        private _toggleTileActivity;
        /**
         * Takes the visualizations and add it to the provided section id
         * @param {IVisualization[]} aSectionViz - array of visualizations
         * @param {string} sSectionId - section id where the visualizations to be added
         * @returns {any}
         */
        private _addSectionViz;
        private _importdone;
        private _setupHeader;
        renderPanel(bRefresh?: boolean): Promise<void>;
        refreshData(refreshTiles?: boolean): Promise<void>;
        private _createWrapperFlexBox;
        private _handleTilesDnd;
        private _DragnDropTiles;
        private handleEditTiles;
        handleRemoveActions(): void;
        handleAddActions(): void;
        private _closeAddFromFavDialog;
        /**
         * Navigates to the App Finder with optional group Id.
         * @async
         * @private
         * @param {string} [groupId] - Optional group Id
         */
        private navigateToAppFinder;
        /**
         * Retrieves the key of the legend color based on the provided color value.
         * @param {string} color - The color value for which to retrieve the legend color key.
         * @returns {string} The legend color key corresponding to the provided color value, or the default background color key if not found.
         * @private
         */
        private _getLegendColor;
        /**
         * Handles the addition of tiles from favorite apps.
         * @returns {Promise<void>} A Promise that resolves when the operation is complete.
         * @private
         */
        private _handleAddFromFavApps;
        private _getFavToAdd;
        /**
         * Retrieves the selected Apps from the dialog.
         * @returns {sap.m.ListItemBase[]} An array of selected Apps.
         * @private
         */
        private _getSelectedInsights;
        private _generateAddFromFavAppsListItems;
        private _generateAddFromFavAppsDialog;
        private _addFromFavApps;
        /**
         * Calculates the number of visible tiles that can fit within the available width of the parent container.
         *
         * @private
         * @param {ICustomVisualization[]} insightsApps - An array of custom visualizations to be displayed as tiles.
         * @returns {number} - The number of visible tiles.
         */
        private _calculateVisibleTileCount;
        /**
         * Adjusts the layout of the tiles panel based on the current layout and device type.
         *
         * @private
         * @override
         */
        _adjustLayout(): void;
        private _getInsightsContainer;
    }
}
//# sourceMappingURL=TilesPanel.d.ts.map