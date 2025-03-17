declare module "sap/cux/home/BasePagePanel" {
    /*!
     * SAP UI development toolkit for HTML5 (SAPUI5)
     *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
     */
    import type { MetadataOptions } from "sap/ui/core/Element";
    import { $BasePagePanelSettings } from "sap/cux/home/BasePagePanel";
    import BasePanel from "sap/cux/home/BasePanel";
    /**
     *
     * Base Panel class for managing and storing Pages.
     *
     * @extends sap.ui.core.BasePanel
     *
     * @author SAP SE
     * @version 0.0.1
     * @since 1.121
     *
     * @abstract
     * @internal
     * @experimental Since 1.121
     * @private
     *
     * @alias sap.cux.home.BasePagePanel
     */
    export default abstract class BasePagePanel extends BasePanel {
        constructor(idOrSettings?: string | $BasePagePanelSettings);
        constructor(id?: string, settings?: $BasePagePanelSettings);
        static readonly metadata: MetadataOptions;
    }
}
//# sourceMappingURL=BasePagePanel.d.ts.map