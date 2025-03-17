declare module "sap/cux/home/BaseNewsPanel" {
    import VBox from "sap/m/VBox";
    import type { MetadataOptions } from "sap/ui/core/Element";
    import VerticalLayout from "sap/ui/layout/VerticalLayout";
    import { $BaseNewsPanelSettings } from "sap/cux/home/BaseNewsPanel";
    import BasePanel from "sap/cux/home/BasePanel";
    /**
     *
     * Base Panel class for managing and storing News.
     *
     * @extends sap.cux.home.BasePanel
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
     * @alias sap.cux.home.BaseNewsPanel
     */
    export default abstract class BaseNewsPanel extends BasePanel {
        constructor(idOrSettings?: string | $BaseNewsPanelSettings);
        constructor(id?: string, settings?: $BaseNewsPanelSettings);
        private errorCard;
        private newsVerticalLayout;
        static readonly metadata: MetadataOptions;
        /**
         * Init lifecycle method
         *
         * @private
         * @override
         */
        init(): void;
        /**
         * Generates app wrapper for displaying apps.
         * @private
         * @returns The generated apps wrapper.
         */
        protected getNewsWrapper(): VerticalLayout;
        /**
         * Generates the error message wrapper with illustrated message.
         * @private
         * @returns Wrapper with illustrated message.
         */
        protected generateErrorMessage(): VBox;
        /**
         * Handles the edit news event.
         * Opens the news dialog for managing news data.
         * @private
         */
        protected handleEditNews(): void;
    }
}
//# sourceMappingURL=BaseNewsPanel.d.ts.map