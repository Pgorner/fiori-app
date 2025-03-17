declare module "sap/cux/home/Page" {
    /*!
     * SAP UI development toolkit for HTML5 (SAPUI5)
     *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
     */
    import Element, { MetadataOptions } from "sap/ui/core/Element";
    import { $PageSettings } from "sap/cux/home/Page";
    import { IPage } from "sap/cux/home/interface/PageSpaceInterface";
    /**
     *
     * Class for managing and storing Pages.
     *
     * @extends sap.ui.core.Element
     *
     * @author SAP SE
     * @version 0.0.1
     * @since 1.121
     *
     * @internal
     * @experimental Since 1.121
     * @private
     *
     * @alias sap.cux.home.Page
     */
    export default class Page extends Element {
        constructor(idOrSettings?: string | $PageSettings);
        constructor(id?: string, settings?: $PageSettings);
        static readonly metadata: MetadataOptions;
        onPageTilePress(oPage: IPage): Promise<void>;
    }
}
//# sourceMappingURL=Page.d.ts.map