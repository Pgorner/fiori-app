declare module "sap/cux/home/NoDataContainer" {
    import { MetadataOptions } from "sap/ui/core/Element";
    import BaseContainer from "sap/cux/home/BaseContainer";
    import BasePanel from "sap/cux/home/BasePanel";
    /**
     *
     * Panel class to show no data content.
     *
     */
    class NoDataContentPanel extends BasePanel {
        static readonly metadata: MetadataOptions;
    }
    /**
     *
     * Container class to show no data content.
     *
     * @extends BaseContainer
     *
     * @author SAP SE
     * @version 0.0.1
     * @since 1.121
     *
     * @internal
     * @experimental Since 1.121
     * @public
     *
     * @alias sap.cux.home.NoDataContainer
     */
    export default class NoDataContainer extends BaseContainer {
        static readonly metadata: MetadataOptions;
        static renderer: {
            apiVersion: number;
            render: (rm: import("sap/ui/core/RenderManager").default, control: BaseContainer) => void;
            renderContent: (rm: import("sap/ui/core/RenderManager").default, control: BaseContainer) => void;
        };
        /**
         * Init lifecycle method
         *
         * @private
         */
        init(): void;
        /**
         * onBeforeRendering lifecycle method
         *
         * @private
         */
        onBeforeRendering(): void;
        /**
         * Set up default no-data content for the container.
         *
         * @private
         */
        private _setupDefaultContent;
    }
}
//# sourceMappingURL=NoDataContainer.d.ts.map