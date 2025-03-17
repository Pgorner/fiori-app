declare module "sap/cux/home/InsightsTilesSettingsPanel" {
    import ColumnListItem from "sap/m/ColumnListItem";
    import BaseSettingsPanel from "sap/cux/home/BaseSettingsPanel";
    interface IDragEvent {
        draggedControl: ColumnListItem;
        droppedControl: ColumnListItem;
    }
    /**
     *
     * Class for My Home Insights Tiles Settings Panel.
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
     * @alias sap.cux.home.InsightsTilesSettingsPanel
     */
    export default class InsightsTilesSettingsPanel extends BaseSettingsPanel {
        private _wrapperId;
        private _controlMap;
        private _allInsightsApps;
        private appManagerInstance;
        /**
         * Init lifecycle method
         *
         * @public
         * @override
         */
        init(): Promise<void>;
        /**
         * Add the Message Strip to the wrapper FlexBox.
         *
         * @private
         */
        private _showMessageStrip;
        /**
         * Add the Header ToolBar to the wrapper FlexBox.
         *
         * @private
         */
        private _showToolbar;
        /**
         * Handles Search Field change
         * @private
         */
        private _onTilesSearch;
        /**
         * Adds Tiles List Table to Wrapper FlexBox
         * @private
         */
        private _showTilesList;
        /**
         * Creates Table to Render Tiles List
         * @private
         */
        private _createTableWithContainer;
        /**
         * Handles Drag Drop of Tiles
         * @private
         */
        private _handleTilesDrop;
        /**
         * Create Table Rows
         * @private
         */
        private _createTableRows;
        /**
         * Create ColumnListItem for each Insights App
         * @private
         */
        private _createColumnListItem;
        /**
         * Handles Convert Tile
         * @private
         */
        private _onConvertTilePress;
        /**
         * Deletes Insights App
         * @private
         */
        private _onDeleteApp;
        /**
         * Handle Delete App Confirmation Decision
         * @private
         */
        private _handleDeleteApp;
        /**
         * Returns wrapper FlexBox
         * @private
         */
        private _getWrapperFlexBox;
        /**
         * Returns Tiles Panel
         * @private
         */
        private _getTilePanel;
    }
}
//# sourceMappingURL=InsightsTilesSettingsPanel.d.ts.map