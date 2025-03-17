declare module "sap/cux/home/library" {
    import "sap/ui/core/library";
    import "sap/ui/integration/library";
    /**
     * Root namespace for all the libraries related to Common User Experience.
     *
     * @namespace
     * @public
     * @since 1.121
     */
    export const cuxNamespace = "sap.cux";
    /**
     * This is an SAPUI5 library with controls specialized for common user experience.
     *
     * @namespace
     * @public
     * @since 1.121
     */
    export const cuxHomeNamespace = "sap.cux.home";
    const thisLib: {
        [key: string]: unknown;
    };
    /**
     * Supported layout types for {@link sap.cux.home.BaseContainer}.
     *
     * @enum {string}
     * @public
     * @since 1.121
     * @experimental Since 1.121
     */
    export enum LayoutType {
        /**
         * Panels are rendered side by side, for example To-Dos and Situaions, and Favorites, Recently Used and Frequently Used apps
         *
         * @public
         */
        SideBySide = "SideBySide",
        /**
         * Panels are rendered vertically, for example Insights Tiles and Insights Cards
         *
         * @public
         */
        Vertical = "Vertical",
        /**
         * Panels are rendered horizontally, for example Pages and News
         *
         * @public
         */
        Horizontal = "Horizontal"
    }
    /**
     * Supported News Types for {@link sap.cux.home.NewsPanel}.
     *
     * @enum {string}
     * @public
     * @since 1.121
     * @experimental Since 1.121
     */
    export enum NewsType {
        /**
         * Url is of type RSS
         * @public
         */
        RSS = "rss",
        /**
         * Url is of type feed
         * @public
         */
        Feed = "feed",
        /**
         * News is of type custom news feed
         *
         * @public
         */
        Custom = "customFeed"
    }
    export default thisLib;
}
//# sourceMappingURL=library.d.ts.map