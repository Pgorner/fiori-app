declare module "sap/cux/home/MenuItem" {
    /*!
     * SAP UI development toolkit for HTML5 (SAPUI5)
     *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
     */
    import type { MetadataOptions } from "sap/ui/core/Element";
    import Element from "sap/ui/core/Element";
    import { $MenuItemSettings } from "sap/cux/home/MenuItem";
    /**
     *
     * Class for managing and storing menu items.
     *
     * @extends Element
     *
     * @author SAP SE
     * @version 0.0.1
     * @since 1.121
     *
     * @internal
     * @experimental Since 1.121
     * @public
     *
     * @alias sap.cux.home.MenuItem
     */
    export default class MenuItem extends Element {
        constructor(id?: string | $MenuItemSettings);
        constructor(id?: string, settings?: $MenuItemSettings);
        static readonly metadata: MetadataOptions;
    }
}
//# sourceMappingURL=MenuItem.d.ts.map