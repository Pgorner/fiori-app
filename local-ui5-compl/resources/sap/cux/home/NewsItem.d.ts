declare module "sap/cux/home/NewsItem" {
    import type { MetadataOptions } from "sap/ui/core/Element";
    import BaseNewsItem from "sap/cux/home/BaseNewsItem";
    import { $NewsItemSettings } from "sap/cux/home/NewsItem";
    /**
     *
     * Class for managing and storing News items.
     *
     * @extends sap.cux.home.BaseNewsItem
     *
     * @author SAP SE
     * @version 0.0.1
     * @since 1.121
     *
     * @internal
     * @experimental Since 1.121
     * @private
     *
     * @alias sap.cux.home.NewsItem
     */
    export default class NewsItem extends BaseNewsItem {
        constructor(idOrSettings?: string | $NewsItemSettings);
        constructor(id?: string, settings?: $NewsItemSettings);
        static readonly metadata: MetadataOptions;
        /**
         * Init lifecycle method
         *
         * @private
         * @override
         */
        init(): void;
        /**
         * Handles the press event on the news item, redirecting the user to the specified URL.
         */
        private pressNewsItem;
    }
}
//# sourceMappingURL=NewsItem.d.ts.map