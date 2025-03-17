declare module "sap/cux/home/KeyUserPagesSettingsPanel" {
    import type { MetadataOptions } from "sap/ui/core/Element";
    import BaseSettingsPanel from "sap/cux/home/BaseSettingsPanel";
    /**
     *
     * Class for Pages Settings Panel for KeyUser Settings Dialog.
     *
     * @extends BaseSettingsPanel
     *
     * @author SAP SE
     * @version 0.0.1
     * @since 1.121
     *
     * @internal
     * @experimental Since 1.121
     * @private
     *
     * @alias sap.cux.home.KeyUserPagesSettingsPanel
     */
    export default class KeyUserPagesSettingsPanel extends BaseSettingsPanel {
        static readonly metadata: MetadataOptions;
        private controlMap;
        private controlModel;
        private pageManagerInstance;
        private selectedContext;
        private _eventBus;
        private keyuserSpaceColorChanges;
        private keyuserPageColorChanges;
        private keyuserSpaceIconChanges;
        private keyuserPageIconChanges;
        /**
         * Init lifecycle method
         *
         * @public
         * @override
         */
        init(): void;
        /**
         * Returns the content for the KeyUser Pages Settings Panel.
         *
         * @private
         * @returns {VBox} The control containing the KeyUser Pages Settings Panel content.
         */
        private getContent;
        /**
         * Load settings for the panel.
         *
         * @private
         */
        private loadSettings;
        /**
         * Add Dialog Content.
         *
         * @private
         */
        private addDialogContent;
        /**
         * Get Space Pages List Items.
         *
         * @private
         * @returns {FlexBox} The control containing the Space Pages List Items.
         */
        private getSpacePagesListItems;
        /**
         * Get details view for the selected space or page.
         *
         * @private
         * @returns {FlexBox} The control containing the Details.
         */
        private getDetailsView;
        /**
         * Get Color Palette.
         *
         * @private
         * @returns {VBox} The control containing the Color Palette.
         */
        private getColorPalette;
        /**
         * Get Icon List.
         *
         * @private
         * @returns {VBox} The control containing the Icon List.
         */
        private getIconList;
        /**
         * Prepare spaces and pages data.
         *
         * @private
         */
        private prepareSpacesPagesData;
        /**
         * Refresh color.
         *
         * @param {string} sColor The color to refresh.
         * @returns {string} The refreshed color.
         */
        private refreshColor;
        /**
         * Handle Tree Table Row Selection.
         *
         * @param {Event} oEvent The event object.
         * @private
         */
        private handleTreeTableRowSelection;
        /**
         * Prepare icon list.
         *
         * @private
         */
        private prepareIconList;
        /**
         * Handle Icon Search.
         *
         * @param {Event} oEvent The event object.
         * @private
         */
        private handleIconSearch;
        /**
         * Handle Color Select.
         *
         * @param {Event} oEvent The event object.
         * @private
         */
        private _handleColorSelect;
        /**
         * Handle Icon Select.
         *
         * @param {Event} oEvent The event object.
         * @private
         */
        private _handleIconSelect;
        /**
         * Convert color to legend.
         *
         * @param {string} sColor The color to convert.
         * @returns {string} The converted color.
         * @private
         */
        private _convertColorToLegend;
        /**
         * Handle Switch Change.
         *
         * @param {Event} oEvent The event object.
         * @private
         */
        private _handleSwitchChange;
        /**
         * Apply inner page coloring.
         *
         * @param {ISpace} oSpace The space object.
         * @param {string} sColorKey The color key.
         * @param {string} sColorValue The color value.
         * @param {boolean} bApplyColorToAllPages The flag to apply color to all pages.
         * @private
         */
        private _applyInnerPageColoring;
        /**
         * Get Inner Pages of Space.
         *
         * @returns {ISpace} Space.
         * @private
         */
        private _getInnerPages;
        /**
         * Merge Key User Changes.
         *
         * @private
         */
        private _mergeKeyUserChanges;
        /**
         * Handle Dialog Close.
         *
         * @private
         */
        private _handleDialogClose;
    }
}
//# sourceMappingURL=KeyUserPagesSettingsPanel.d.ts.map