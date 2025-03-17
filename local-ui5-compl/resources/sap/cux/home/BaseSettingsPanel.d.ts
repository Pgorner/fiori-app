declare module "sap/cux/home/BaseSettingsPanel" {
    /*!
     * SAP UI development toolkit for HTML5 (SAPUI5)
     *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
     */
    import ResourceBundle from "sap/base/i18n/ResourceBundle";
    import type { MetadataOptions } from "sap/ui/core/Element";
    import Element from "sap/ui/core/Element";
    import BaseLayout from "sap/cux/home/BaseLayout";
    import BasePanel from "sap/cux/home/BasePanel";
    import { $BaseSettingsPanelSettings } from "sap/cux/home/BaseSettingsPanel";
    import { IKeyUserChange } from "sap/cux/home/interface/KeyUserInterface";
    /**
     *
     * Abstract base class for panels inside My Home Settings Dialog.
     *
     * @extends sap.ui.core.Element
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
     * @alias sap.cux.home.BaseSettingsPanel
     */
    export default abstract class BaseSettingsPanel extends Element {
        protected _i18nBundle: ResourceBundle;
        private _keyuserChanges;
        constructor(id?: string | $BaseSettingsPanelSettings);
        constructor(id?: string, settings?: $BaseSettingsPanelSettings);
        static readonly metadata: MetadataOptions;
        /**
         * Init lifecycle method
         *
         * @public
         * @override
         */
        init(): void;
        /**
         * Retrieves the BasePanel or BaseLayout associated with the BaseSettingsPanel.
         *
         * @returns {BasePanel | BaseLayout} The panel or layout associated with the BaseSettingsPanel
         * @private
         */
        protected _getPanel(): BasePanel | BaseLayout;
        /**
         * Persists the dialog state by setting a property on the parent layout
         * indicating that the settings dialog should be persisted.
         *
         * @private
         */
        protected _persistDialog(): void;
        /**
         * Returns the KeyUser Changes made by user.
         *
         * @public
         */
        getKeyUserChanges(): Array<IKeyUserChange>;
        /**
         * Add Changes made by user in case of KeyUser Settings Panel.
         *
         * @public
         */
        addKeyUserChanges(change: IKeyUserChange): void;
        /**
         * Clear all KeyUser Changes made by user.
         *
         * @public
         */
        clearKeyUserChanges(): void;
    }
}
//# sourceMappingURL=BaseSettingsPanel.d.ts.map