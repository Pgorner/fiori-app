declare module "sap/cux/home/PageSettingsPanel" {
    import BaseSettingsPanel from "sap/cux/home/BaseSettingsPanel";
    /**
     *
     * Class for My Home Page Settings Panel.
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
     * @alias sap.cux.home.PageSettingsPanel
     */
    export default class PageSettingsPanel extends BaseSettingsPanel {
        private PageManagerInstance;
        private aAllPages;
        private aFavPages;
        private aSpaces;
        private oWrapperVBox;
        private oSearchField;
        private sSearchQuery;
        private oMessage;
        private oPagesListVBox;
        private oNoDataHBox;
        private _initialNavigation;
        /**
         * Init lifecycle method
         *
         * @public
         * @override
         */
        init(): void;
        /**
         * Handler for panel navigation event.
         * Initialize the Page Settings Panel on navigation, if it is not already initializaed.
         * @private
         */
        private onPanelNavigated;
        /**
         * Initialize the Page Settings Panel.
         * @private
         */
        private _initializePanel;
        private _showMessageStrip;
        private _seHeaderMessage;
        private _showToolbar;
        private _showPagesList;
        private _createPagesList;
        private _renderPages;
        private _createHeaderToolbar;
        private _pageSelectHandler;
        private _onPagesSearch;
        private _filterSpacesPages;
    }
}
//# sourceMappingURL=PageSettingsPanel.d.ts.map