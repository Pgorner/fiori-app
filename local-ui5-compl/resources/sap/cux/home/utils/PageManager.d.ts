declare module "sap/cux/home/utils/PageManager" {
    /*!
     * SAP UI development toolkit for HTML5 (SAPUI5)
     *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
     */
    import BaseObject from "sap/ui/base/Object";
    import Component from "sap/ui/core/Component";
    import { ISpacePagePersonalization } from "sap/cux/home/interface/KeyUserInterface";
    import { IPage, ISpace } from "sap/cux/home/interface/PageSpaceInterface";
    import ColorUtils from "sap/cux/home/utils/ColorUtils";
    import UShellPersonalizer from "sap/cux/home/utils/UshellPersonalizer";
    /**
     *
     * Provides the PageManager Class used for fetch and process user pages.
     *
     * @extends sap.ui.BaseObject
     *
     * @author SAP SE
     * @version 0.0.1
     * @since 1.121.0
     *
     * @private
     * @experimental Since 1.121
     * @hidden
     *
     * @alias sap.cux.home.utils.PageManager
     */
    export default class PageManager extends BaseObject {
        colorUtils: typeof ColorUtils;
        persContainerId: string;
        oOwnerComponent: Component;
        _aSpaces: ISpace[];
        _aPages: IPage[];
        aFavPages: IPage[];
        oPersonalizer: UShellPersonalizer;
        oGetFavPagesPromise: Promise<IPage[]>;
        static oCacheInstances: {
            [key: string]: PageManager;
        };
        private _eventBus;
        private constructor();
        static getInstance(persContainerId: string, oOwnerComponent: Component): PageManager;
        private _getPersonalization;
        fetchAllAvailableSpaces(): Promise<ISpace[]>;
        fetchAllAvailablePages(bFetchDistinctPages?: boolean): Promise<IPage[]>;
        private _getDefaultPages;
        private _getIconForPage;
        private _applyIconsForFavPages;
        getFavPages(aFavPages: IPage[], bUpdatePersonalisation?: boolean): Promise<IPage[]>;
        getFavoritePages(bForceUpdate?: boolean): Promise<any[]>;
        private _getFavPages;
        applyColorPersonalizations(personalizations?: ISpacePagePersonalization[]): Promise<void>;
        applyIconPersonalizations(personalizations?: ISpacePagePersonalization[]): Promise<void>;
    }
}
//# sourceMappingURL=PageManager.d.ts.map