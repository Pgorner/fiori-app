declare module "sap/cux/home/BaseSettingsDialog" {
    /*!
     * SAP UI development toolkit for HTML5 (SAPUI5)
     *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
     */
    import ResourceBundle from "sap/base/i18n/ResourceBundle";
    import Dialog from "sap/m/Dialog";
    import type { MetadataOptions } from "sap/ui/core/Element";
    import { $BaseSettingsDialogSettings } from "sap/cux/home/BaseSettingsDialog";
    /**
     *
     * Abstract base class for My Home Settings Dialog.
     *
     * @extends Dialog
     *
     * @author SAP SE
     * @version 0.0.1
     * @since 1.121
     *
     * @internal
     * @experimental Since 1.121
     * @abstract
     * @private
     *
     * @alias sap.cux.home.BaseSettingsDialog
     */
    export default abstract class BaseSettingsDialog extends Dialog {
        protected _i18nBundle: ResourceBundle;
        private _panelCache;
        constructor(id?: string | $BaseSettingsDialogSettings);
        constructor(id?: string, settings?: $BaseSettingsDialogSettings);
        static readonly metadata: MetadataOptions;
        static renderer: {
            apiVersion: number;
        };
        /**
         * Init lifecycle method
         *
         * @public
         * @override
         */
        init(): void;
    }
}
//# sourceMappingURL=BaseSettingsDialog.d.ts.map