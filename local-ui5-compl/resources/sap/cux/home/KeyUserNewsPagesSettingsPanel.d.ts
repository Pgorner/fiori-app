declare module "sap/cux/home/KeyUserNewsPagesSettingsPanel" {
    import type { MetadataOptions } from "sap/ui/core/Element";
    import BaseSettingsPanel from "sap/cux/home/BaseSettingsPanel";
    /**
     *
     * Class for News & Pages Settings Panel for KeyUser Settings Dialog.
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
     * @alias sap.cux.home.KeyUserNewsPagesSettingsPanel
     */
    export default class KeyUserNewsPagesSettingsPanel extends BaseSettingsPanel {
        static readonly metadata: MetadataOptions;
        private wrapperVBox;
        private newsPanel;
        private newsSettingsPanel;
        private newsSettingsList;
        private newsSettingsPage;
        private pagePanel;
        private pageSettingsPanel;
        private pageSettingsList;
        private pageSettingsDialog;
        private _eventBus;
        private newsFeedVisibility;
        private standardListItem;
        /**
         * Init lifecycle method
         *
         * @public
         * @override
         */
        init(): void;
        /**
         * Returns the content for the KeyUser News Pages Settings Panel.
         *
         * @private
         * @returns {VBox} The control containing the KeyUser News Pages Settings Panel content.
         */
        private getContent;
        /**
         * Load settings for the panel.
         *
         * @private
         */
        private loadSettings;
        private newsVisibilityChangeHandler;
        /**
         * Returns News Settings Panel to the content.
         *
         * @private
         * @returns {List} The control containing the News Settings Panel content.
         */
        private getNewsSettingsList;
        /**
         * Returns Page Settings Panel to the content.
         *
         * @private
         * @returns {List} The control containing the Page Settings Panel content.
         */
        private getPageSettingsList;
        private onNavBack;
        /**
         * Adds News Settings Page to the dialog.
         *
         * @private
         */
        private navigateToNewsSettingsPage;
        /**
         * Opens Page Settings Dialog.
         *
         * @private
         */
        private openPageSettingsDialog;
        /**
         * Handles Space Page Changes.
         *
         * @private
         * @param {Array<IKeyUserChange>} changes All Key User Changes.
         */
        private addNewsPagesChanges;
        isNewsChangesValid(): Promise<boolean>;
        onSaveClearChanges(): void;
        onCancelClearKeyUserChanges(): void;
    }
}
//# sourceMappingURL=KeyUserNewsPagesSettingsPanel.d.ts.map