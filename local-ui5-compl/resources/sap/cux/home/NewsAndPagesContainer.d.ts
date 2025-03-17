declare module "sap/cux/home/NewsAndPagesContainer" {
    import type { MetadataOptions } from "sap/ui/core/Element";
    import BaseContainer, { $BaseContainerSettings } from "sap/cux/home/BaseContainer";
    import { INewsFeedVisibiliyChange, INewsPersData } from "sap/cux/home/interface/KeyUserInterface";
    interface IpanelLoaded {
        [key: string]: {
            loaded: boolean;
            count: number;
        };
    }
    /**
     *
     * Container class for managing and storing News and Pages.
     *
     * @extends sap.cux.home.BaseContainer
     *
     * @author SAP SE
     * @version 0.0.1
     * @since 1.121
     *
     * @internal
     * @experimental Since 1.121
     * @public
     *
     * @alias sap.cux.home.NewsAndPagesContainer
     */
    export default class NewsAndPagesContainer extends BaseContainer {
        static renderer: {
            apiVersion: number;
            render: (rm: import("sap/ui/core/RenderManager").default, control: BaseContainer) => void;
            renderContent: (rm: import("sap/ui/core/RenderManager").default, control: BaseContainer) => void;
        };
        static readonly metadata: MetadataOptions;
        private panelLoaded;
        private pagePanel;
        private newsPanel;
        constructor(idOrSettings?: string | $BaseContainerSettings);
        constructor(id?: string, settings?: $BaseContainerSettings);
        /**
         * Init lifecycle method
         *
         * @private
         * @override
         */
        init(): void;
        onBeforeRendering(): void;
        newsVisibilityChangeHandler(personalization: INewsFeedVisibiliyChange): void;
        newsPersonalization(personalizations: INewsPersData): void;
        panelLoadedFn(sPanelType: string, oVal: {
            loaded: boolean;
            count: number;
        }): void;
        adjustStyleLayout(bIsNewsTileVisible: boolean): void;
        /**
         * Adjusts the layout of the all panels in the container.
         *
         * @private
         * @override
         */
        adjustLayout(): void;
    }
}
//# sourceMappingURL=NewsAndPagesContainer.d.ts.map