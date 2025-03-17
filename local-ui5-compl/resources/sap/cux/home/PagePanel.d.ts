declare module "sap/cux/home/PagePanel" {
    import FlexBox, { $FlexBoxSettings } from "sap/m/FlexBox";
    import { MetadataOptions } from "sap/ui/core/Element";
    import BasePagePanel, { $BasePagePanelSettings } from "sap/cux/home/BasePagePanel";
    import { ISpacePagePersonalization } from "sap/cux/home/interface/KeyUserInterface";
    import { IPage } from "sap/cux/home/interface/PageSpaceInterface";
    const maxTileSize = 15, minTileSize = 7;
    /**
     *
     * CustomFlexBox extending FlexBox to enable drag & drop.
     *
     * @extends sap.m.FlexBox
     *
     * @author SAP SE
     * @version 0.0.1
     * @since 1.122
     *
     * @internal
     * @experimental Since 1.121
     * @private
     *
     * @alias sap.cux.home.CustomFlexBox
     */
    class CustomFlexBox extends FlexBox {
        constructor(idOrSettings?: string | $FlexBoxSettings);
        constructor(id?: string, settings?: $FlexBoxSettings);
        static readonly metadata: MetadataOptions;
        static renderer: {
            apiVersion: number;
        };
    }
    /**
     *
     * Panel class for managing and storing Pages.
     *
     * @extends sap.cux.home.BasePagePanel
     *
     * @author SAP SE
     * @version 0.0.1
     * @since 1.122
     *
     * @internal
     * @experimental Since 1.121
     * @public
     *
     * @alias sap.cux.home.PagePanel
     */
    export default class PagePanel extends BasePagePanel {
        static readonly metadata: MetadataOptions;
        private _oWrapperFlexBox;
        private oPagePromise;
        private persContainerId;
        private PageManagerInstance;
        private aFavPages;
        private oInnerControls;
        private _oIllusMsg;
        private oAddPageBtn;
        private oPersonalizer;
        private oEventBus;
        /**
         * Constructor for a new Page panel.
         *
         * @param {string} [id] ID for the new control, generated automatically if an ID is not provided
         * @param {object} [settings] Initial settings for the new control
         */
        constructor(id?: string, settings?: $BasePagePanelSettings);
        init(): void;
        private _importdone;
        getData(forceUpdate?: boolean): Promise<IPage[]>;
        /**
         * Handles the edit page event.
         * Opens the page dialog for managing page data.
         * @param {Event} oEvent - The event object.
         * @private
         */
        private _handleEditPages;
        attachResizeHandler(bIsNewsTileVisible: boolean, containerWidth: number, pagesContentWrapper: FlexBox, containerWrapper: FlexBox): boolean;
        getUserAvailablePages(): Promise<IPage[]>;
        private _handleResizeForDesktop;
        private _getInnerControls;
        private _setFavPagesContent;
        private _createNoPageContent;
        private _setNoPageContent;
        private _setPropertyValues;
        private _handlePageDnd;
        private _DragnDropPages;
        applyColorPersonalizations(personalizations: Array<ISpacePagePersonalization>): void;
        applyIconPersonalizations(personalizations: Array<ISpacePagePersonalization>): void;
    }
}
//# sourceMappingURL=PagePanel.d.ts.map