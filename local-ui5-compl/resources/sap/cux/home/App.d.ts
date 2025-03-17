declare module "sap/cux/home/App" {
    /*!
     * SAP UI development toolkit for HTML5 (SAPUI5)
     *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
     */
    import type { MetadataOptions } from "sap/ui/core/Element";
    import { $AppSettings } from "sap/cux/home/App";
    import BaseApp from "sap/cux/home/BaseApp";
    /**
     *
     * App class for managing and storing Apps.
     *
     * @extends sap.cux.home.BaseApp
     *
     * @author SAP SE
     * @version 0.0.1
     * @since 1.121.0
     *
     * @internal
     * @experimental Since 1.121
     * @private
     *
     * @alias sap.cux.home.App
     */
    export default class App extends BaseApp {
        constructor(idOrSettings?: string | $AppSettings);
        constructor(id?: string, settings?: $AppSettings);
        static readonly metadata: MetadataOptions;
        /**
         * Navigates to the clicked app
         * @private
         */
        private _launchApp;
        /**
         * App Press Handler
         * @private
         */
        _handlePress(): void;
    }
}
//# sourceMappingURL=App.d.ts.map