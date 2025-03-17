declare module "sap/cux/home/ToDosContainer" {
    import Event from "sap/ui/base/Event";
    import { MetadataOptions } from "sap/ui/core/Element";
    import BaseContainer, { $BaseContainerSettings } from "sap/cux/home/BaseContainer";
    /**
     *
     * Container class for managing and storing To-Do cards.
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
     * @alias sap.cux.home.ToDosContainer
     */
    export default class ToDosContainer extends BaseContainer {
        private _isAuthCheckRequired;
        private _iconTabBarControl;
        static cardCount: number | undefined;
        static readonly metadata: MetadataOptions;
        static renderer: {
            apiVersion: number;
            render: (rm: import("sap/ui/core/RenderManager").default, control: BaseContainer) => void;
            renderContent: (rm: import("sap/ui/core/RenderManager").default, control: BaseContainer) => void;
        };
        /**
         * Constructor for a new To-Dos container.
         *
         * @param {string} [id] ID for the new control, generated automatically if an ID is not provided
         * @param {object} [settings] Initial settings for the new control
         */
        constructor(id?: string, settings?: $BaseContainerSettings);
        /**
         * Init lifecycle method
         *
         * @private
         * @override
         */
        init(): void;
        /**
         * onBeforeRendering lifecycle method
         *
         * @private
         * @override
         */
        onBeforeRendering(): Promise<void>;
        /**
         * Performs an authorization check for the ToDosContainer.
         * Checks if the authorization check is required and updates panel support accordingly.
         *
         * @private
         * @async
         * @returns {Promise<void>} A Promise that resolves when the authorization check is completed.
         * @throws {Error} If an error occurs during the authorization check.
         */
        private _performAuthCheck;
        /**
         * Handles unauthorized access to the ToDosContainer by hiding all inner controls
         *
         * @private
         * @param {Error} error - An optional custom error message or an Error object.
         */
        private _handleToDoUnauthorizedAccess;
        /**
         * Asynchronously loads all panels, ensuring the currently selected panel is loaded first.
         *
         * @private
         * @async
         * @param {boolean} forceRefresh - force refresh cards
         * @returns {Promise<void>} A promise that resolves when all panels are loaded.
         */
        private _loadAllPanels;
        /**
         * Overridden method for selection of panel in the IconTabBar.
         * Loads the selected panel and updates the header elements as well
         *
         * @private
         * @async
         * @override
         */
        protected _onPanelSelect(event: Event): Promise<void>;
        /**
         * Asynchronously refreshes the section by forcing all inner panels to be reloaded.
         *
         * @public
         * @async
         * @returns {Promise<void>} A promise that resolves when the section is successfully refreshed.
         */
        refreshData(): Promise<void>;
        /**
         * Gets the selected key of the To-Dos container.
         * If no selected key is set, it defaults to the first item.
         *
         * @public
         * @returns {string} The selected key.
         */
        getSelectedKey(): string;
        /**
         * Gets the default key for the ToDosContainer by returning the key of the first panel
         *
         * @private
         * @returns {string} The default key if it exists, or null if there are no panels
         */
        private _getDefaultKey;
        /**
         * Adjusts the layout of the all panels in the container.
         *
         * @private
         * @override
         */
        adjustLayout(): void;
    }
}
//# sourceMappingURL=ToDosContainer.d.ts.map