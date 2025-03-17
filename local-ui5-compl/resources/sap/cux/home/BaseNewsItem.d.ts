declare module "sap/cux/home/BaseNewsItem" {
    /*!
     * SAP UI development toolkit for HTML5 (SAPUI5)
     *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
     */
    import ResourceBundle from "sap/base/i18n/ResourceBundle";
    import GenericTile from "sap/m/GenericTile";
    import type { MetadataOptions } from "sap/ui/core/Element";
    import Element from "sap/ui/core/Element";
    import { $BaseNewsItemSettings } from "sap/cux/home/BaseNewsItem";
    interface INews {
        url?: string;
        title: string;
        description: string;
        pubDate: string;
        imageUrl: string;
        expandFields?: string;
    }
    /**
     *
     * Base class for managing and storing News items.
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
     * @alias sap.cux.home.BaseNewsItem
     */
    export default abstract class BaseNewsItem extends Element {
        constructor(idOrSettings?: string | $BaseNewsItemSettings);
        constructor(id?: string, settings?: $BaseNewsItemSettings);
        protected _oTile: GenericTile;
        protected _i18nBundle: ResourceBundle;
        static readonly metadata: MetadataOptions;
        /**
         * Init lifecycle method
         *
         * @private
         * @override
         */
        init(): void;
        /**
         * Retrieves the tile control associated with the news item.
         * If the tile control does not exist, it is created.
         * @returns {sap.m.Tile} The tile control.
         */
        getTile(): GenericTile;
        /**
         * Creates the tile control associated with the news item.
         * @private
         */
        createTile(): void;
    }
}
//# sourceMappingURL=BaseNewsItem.d.ts.map