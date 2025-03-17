declare module "sap/cux/home/Group" {
    /*!
     * SAP UI development toolkit for HTML5 (SAPUI5)
     *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
     */
    import type { MetadataOptions } from "sap/ui/core/Element";
    import BaseApp from "sap/cux/home/BaseApp";
    import { $GroupSettings } from "sap/cux/home/Group";
    /**
     *
     * Class for managing apps group.
     *
     * @extends sap.cux.home.BaseApp
     *
     * @author SAP SE
     * @version 0.0.1
     * @since 1.121.0
     *
     * @private
     * @experimental Since 1.121
     *
     * @alias sap.cux.home.Group
     */
    export default class Group extends BaseApp {
        constructor(idOrSettings?: string | $GroupSettings);
        constructor(id?: string, settings?: $GroupSettings);
        static readonly metadata: MetadataOptions;
        /**
         * Handles the press event for a group.
         * Retrieves the parent of the group and shows the group detail dialog.
         * @private
         */
        _handlePress(): void;
    }
}
//# sourceMappingURL=Group.d.ts.map