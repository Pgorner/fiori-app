declare module "sap/cux/home/InsightsContainer" {
    /*!
     * SAP UI development toolkit for HTML5 (SAPUI5)
     *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
     */
    import BaseContainer, { $BaseContainerSettings } from "sap/cux/home/BaseContainer";
    import BasePanel from "sap/cux/home/BasePanel";
    import CardsPanel from "sap/cux/home/CardsPanel";
    import TilesPanel from "sap/cux/home/TilesPanel";
    const tilesPanelName: string;
    const cardsPanelName: string;
    const errorPanelName: string;
    /**
     *
     * Container class for managing and storing Insights Tiles and Insights Cards.
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
     * @alias sap.cux.home.InsightsContainer
     */
    export default class InsightsContainer extends BaseContainer {
        static renderer: {
            apiVersion: number;
            render: (rm: import("sap/ui/core/RenderManager").default, control: BaseContainer) => void;
            renderContent: (rm: import("sap/ui/core/RenderManager").default, control: BaseContainer) => void;
        };
        private _visiblePanels;
        private tilesPanel;
        private cardsPanel;
        private tilesCount;
        private cardsCount;
        private _errorPanel;
        private _isInitialRender;
        /**
         * Constructor for a new Insights container.
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
        onBeforeRendering(): void;
        /**
         * handleHidePanel
         */
        handleHidePanel(panel: BasePanel): void;
        private _addContainerHeader;
        private _removeContainerHeader;
        private _handleNoPanelMenuItems;
        private _handleTilesPanelMenuItems;
        private _handleCardsPanelMenuItems;
        updatePanelsItemCount(itemCount: number, panelName: string): void;
        unhidePanelIfHidden(panel: TilesPanel | CardsPanel): void;
        /**
         * Adjusts the layout of the container.
         *
         * @private
         * @override
         */
        adjustLayout(): void;
    }
}
//# sourceMappingURL=InsightsContainer.d.ts.map