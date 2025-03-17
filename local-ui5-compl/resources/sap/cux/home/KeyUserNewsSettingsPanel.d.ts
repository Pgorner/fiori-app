declare module "sap/cux/home/KeyUserNewsSettingsPanel" {
    import Event from "sap/ui/base/Event";
    import type { MetadataOptions } from "sap/ui/core/Element";
    import BaseSettingsPanel from "sap/cux/home/BaseSettingsPanel";
    const Constants: {
        NEWS_FEED_POST_API: string;
    };
    interface ShowError {
        showError: boolean;
        date: Date;
    }
    /**
     *
     * Class for News Settings Panel for KeyUser Settings Dialog.
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
     * @alias sap.cux.home.KeyUserNewsSettingsPanel
     */
    export default class KeyUserNewsSettingsPanel extends BaseSettingsPanel {
        static readonly metadata: MetadataOptions;
        private controlMap;
        private _eventBus;
        private customNewsVisibility;
        private validChanges;
        /**
         * Init lifecycle method
         *
         * @public
         * @override
         */
        init(): void;
        private getCurrentKeyUserChange;
        /**
         * Returns the content for the KeyUser news Settings Panel.
         *
         * @private
         * @returns {VBox} The control containing the KeyUser news Settings Panel content.
         */
        private getContent;
        isValidChanges(newsVisible: boolean): Promise<boolean>;
        clearNewsPanelChanges(): void;
        private addMessageStrip;
        private handleSelectCustomNewsFeed;
        /**
         * Add CheckBox for Custom News Feed.
         *
         * @private
         */
        private addCustomNewsFeedCheckBox;
        private onNewsUrlChange;
        private showMessageStrip;
        private getValidURL;
        removeUrlMesageStrip(): void;
        private onUrlLiveChange;
        private getMessageStrip;
        /**
         * Add SimpleForm for News URL.
         *
         * @private
         */
        private addNewsURLSimpleForm;
        private handleFileChange;
        private setNewsFeedEnabled;
        private getNewsFeedUploadBtn;
        private handleFileUploadError;
        handleFileDialogClose(event: Event): void;
        private handleNewsFeedFileUpload;
        private getUploadedFile;
        private getFileUploader;
        /**
         * Add SimpleForm for Custom News Upload Form.
         *
         * @private
         */
        private addCustomNewsUploadSimpleForm;
        /**
         * Load settings for the panel.
         *
         * @private
         */
        private loadSettings;
    }
}
//# sourceMappingURL=KeyUserNewsSettingsPanel.d.ts.map