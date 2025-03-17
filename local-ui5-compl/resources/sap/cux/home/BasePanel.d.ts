declare module "sap/cux/home/BasePanel" {
    /*!
     * SAP UI development toolkit for HTML5 (SAPUI5)
     *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
     */
    import ResourceBundle from "sap/base/i18n/ResourceBundle";
    import Control from "sap/ui/core/Control";
    import type { MetadataOptions } from "sap/ui/core/Element";
    import Element from "sap/ui/core/Element";
    import { $BasePanelSettings } from "sap/cux/home/BasePanel";
    import { DeviceType } from "sap/cux/home/utils/Device";
    /**
     *
     * Abstract base panel class for My Home layout control panel.
     *
     * @extends sap.ui.core.Element
     *
     * @author SAP SE
     * @version 0.0.1
     * @since 1.121
     *
     * @abstract
     * @internal
     * @experimental Since 1.121
     * @private
     *
     * @alias sap.cux.home.BasePanel
     */
    export default abstract class BasePanel extends Element {
        protected _i18nBundle: ResourceBundle;
        private _content;
        constructor(id?: string | $BasePanelSettings);
        constructor(id?: string, settings?: $BasePanelSettings);
        static readonly metadata: MetadataOptions;
        /**
         * Init lifecycle method
         *
         * @private
         * @override
         */
        init(): void;
        /**
         * Cache and return panel content since the content would
         * have a different inner control as parent after rendering
         *
         * @private
         * @returns {Control[]} - array of panel content
         */
        _getContent(): Control[];
        /**
         * Overridden method for adding content to a panel so that
         * it's added to the corresponding layout-specific inner
         * control as well
         *
         * @private
         * @param {Control} control - control to be added to the content
         */
        _addContent(control: Control): void;
        /**
         * Updates the count information of IconTabFilter of IconTabBar inner control
         * in case of SideBySide layout
         *
         * @private
         * @param {string} count - updated count information
         */
        _setCount(count?: string): void;
        /**
         * Retrieves the device type for the current panel.
         *
         * @private
         * @returns {DeviceType} - The device type of the parent container if it exists,
         * otherwise calculates and returns the device type based on the current device width.
         */
        protected getDeviceType(): DeviceType;
    }
}
//# sourceMappingURL=BasePanel.d.ts.map