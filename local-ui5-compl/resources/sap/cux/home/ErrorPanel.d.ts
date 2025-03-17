declare module "sap/cux/home/ErrorPanel" {
    import { MetadataOptions } from "sap/ui/core/Component";
    import BasePanel from "sap/cux/home/BasePanel";
    import { $ErrorPanelSettings } from "sap/cux/home/ErrorPanel";
    /**
     *
     * Panel class for displaying Error Message.
     *
     * @extends sap.cux.home.BasePanel
     *
     * @author SAP SE
     * @version 0.0.1
     * @since 1.122.0
     *
     * @internal
     * @experimental Since 1.122
     * @private
     *
     * @alias sap.cux.home.ErrorPanel
     */
    export default class ErrorPanel extends BasePanel {
        constructor(idOrSettings?: string | $ErrorPanelSettings);
        constructor(id?: string, settings?: $ErrorPanelSettings);
        static readonly metadata: MetadataOptions;
        private _oWrapperNoCardsVBox;
        getData(): void;
    }
}
//# sourceMappingURL=ErrorPanel.d.ts.map