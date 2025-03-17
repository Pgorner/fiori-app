declare module "sap/cux/home/BaseAppPersPanel" {
    import GenericTile from "sap/m/GenericTile";
    import type { MetadataOptions } from "sap/ui/core/Element";
    import BaseAppPanel from "sap/cux/home/BaseAppPanel";
    import { $BaseAppPersPanelSettings } from "sap/cux/home/BaseAppPersPanel";
    import { IAppPersonalization } from "sap/cux/home/interface/AppsInterface";
    import { IPersonalizationData } from "sap/cux/home/utils/UshellPersonalizer";
    /**
     *
     * Provides the BaseAppPersPanel Class which is BaseAppPanel with personalisation.
     *
     * @extends sap.cux.home.BaseAppPanel
     *
     * @author SAP SE
     * @version 0.0.1
     * @since 1.121.0
     *
     * @abstract
     * @internal
     * @experimental Since 1.121
     * @private
     *
     * @alias sap.cux.home.BaseAppPersPanel
     */
    export default abstract class BaseAppPersPanel extends BaseAppPanel {
        private _pageManagerInstance;
        private _favPageVisualizations;
        private _eventBus;
        constructor(idOrSettings?: string | $BaseAppPersPanelSettings);
        constructor(id?: string, settings?: $BaseAppPersPanelSettings);
        static readonly metadata: MetadataOptions;
        init(): void;
        /**
         * Retrieves the personalizer instance.
         * @returns {Promise<sap.cux.home.UshellPersonalizer>} A promise resolving to the personalizer instance.
         * @throws {Error} Throws an error if no container ID is provided for personalization.
         * @private
         */
        private _getPersonalizer;
        /**
         * Retrieves personalization data.
         * @returns {Promise<IPersonalizationData>} A promise that resolves with the personalization data.
         * @private
         */
        protected getPersonalization(): Promise<IPersonalizationData>;
        /**
         * Sets the personalization data.
         * @param {IPersonalizationData} persData - The personalization data to set.
         * @returns {Promise<void>} A promise that resolves when the personalization data is set.
         * @private
         */
        protected setPersonalization(persData: IPersonalizationData): Promise<void>;
        /**
         * Returns array of personalized favorite apps
         *
         * @returns {Promise} resolves to return array of personalized favorite apps
         */
        protected _getAppPersonalization(): Promise<IAppPersonalization[]>;
        /**
         * Sets the personalization data.
         * @param {IAppPersonalization[]} appsPersonalization - Personalization data for favorite apps.
         * @returns {Promise<void>} A promise that resolves when the personalization data is set.
         * @private
         */
        protected setFavAppsPersonalization(appsPersonalization: IAppPersonalization[]): Promise<void>;
        /**
         * Applies personalization settings to the tiles.
         * Retrieves tiles from the generated apps wrapper and applies personalization settings to each tile.
         * Personalization settings include background color and icon customization.
         * @private
         * @async
         */
        applyPersonalization(): Promise<void>;
        /**
         * Applies personalization settings to the provided tiles.
         * @param {Array} tiles - An array of tiles to apply personalization settings to.
         * @param {string} [groupId] - Optional group ID for filtering personalization settings.
         * @param {boolean} [shouldReload=true] - A flag indicating whether to reload page visualizations.
         * @returns {Promise<void>} A promise that resolves when personalization settings are applied to the tiles.
         * @private
         */
        protected _applyTilesPersonalization(tiles: GenericTile[], groupId?: string, shouldReload?: boolean): Promise<void>;
        /**
         * Retrieves the corresponding App or Group object associated with the given tile.
         * @param {GenericTile} tile - The tile for which to retrieve the corresponding item.
         * @param {Group[]} groups - An array of Group objects.
         * @param {App[]} apps - An array of App objects.
         * @returns {App | Group | undefined} The corresponding App or Group object, or undefined if not found.
         * @private
         */
        private _getItem;
        /**
         * Retrieves the color and icon associated with the specified item based on personalizations.
         * @param {App | Group | undefined} item - The App or Group object for which to retrieve personalization data.
         * @param {IAppPersonalization[] | undefined} personalizations - An array of personalization objects.
         * @param {ICustomVisualization[]} favPageVisualizations - An array of favorite page visualizations.
         * @param {string | undefined} groupId - The ID of the group to which the item belongs.
         * @returns {IItemPersonalization} An object containing the color and icon associated with the item.
         * @private
         */
        private _getItemPersonalization;
        /**
         * Retrieves favorite pages.
         * @returns {Promise<Array>} A promise that resolves with an array of favorite pages.
         * @private
         */
        private _getFavPages;
        /**
         * Retrieves visualizations for all favorite pages based on the provided parameters.
         * @param {Array} pages - An array of favorite pages.
         * @param {boolean} shouldReload - A flag indicating whether to reload page visualizations.
         * @returns {Promise<Array>} A promise that resolves with an array of favorite page visualizations.
         * @private
         */
        private _getAllFavPageApps;
        /**
         * Loads visualizations for all specified pages.
         * @param {Array} pages - An array of pages.
         * @param {boolean} [shouldFetchDistinctApps=false] - A flag indicating whether to fetch distinct pages.
         * @returns {Promise<Array>} A promise that resolves with an array of page visualizations.
         * @private
         */
        private _loadAllPageVisualizations;
        /**
         * Returns default app icon.
         * @returns {string} The icon URL for the app.
         * @private
         */
        protected getAppIcon(): string;
        /**
         * Retrieves the icon for the specified app, prioritizing the favorite page icon if available.
         * @param {sap.cux.home.App} app - The app object.
         * @param {string} favPageIcon - The icon for the app from the favorite page.
         * @returns {string} The icon URL for the app.
         * @private
         */
        private _getFavAppIcon;
    }
}
//# sourceMappingURL=BaseAppPersPanel.d.ts.map