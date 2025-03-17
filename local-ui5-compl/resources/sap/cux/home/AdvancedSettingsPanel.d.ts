declare module "sap/cux/home/AdvancedSettingsPanel" {
    import type { MetadataOptions } from "sap/ui/core/Element";
    import { ValueState } from "sap/ui/core/library";
    import BaseSettingsPanel from "sap/cux/home/BaseSettingsPanel";
    import { IAppPersonalization, ISection, ISectionAndVisualization, IVisualization } from "sap/cux/home/interface/AppsInterface";
    import { ICardManifest } from "sap/cux/home/interface/CardsInterface";
    import { IPage } from "sap/cux/home/interface/PageSpaceInterface";
    import { IPersonalizationData } from "sap/cux/home/utils/UshellPersonalizer";
    enum ImportExportType {
        IMPORT = "import",
        EXPORT = "export"
    }
    interface IExportData {
        apps?: ISection[];
        tiles?: ISectionAndVisualization[];
        favouritePages: ISectionAndVisualization[] | IPage[];
        cards?: ICardManifest[];
        personalization?: IPersonalizationData;
    }
    interface IExportSections {
        title: string;
        selected: boolean | undefined;
        enabled: boolean | undefined;
        status?: ValueState;
    }
    type SectionOrVisualization = ISectionAndVisualization[] | IVisualization[];
    interface IExportImportFile {
        host?: string;
        createdDate?: Date;
        sections?: SectionOrVisualization | [];
        groupInfo?: IAppPersonalization[] | IVisualization[] | [];
        tiles?: SectionOrVisualization;
        cards?: ICardManifest[];
        favouritePages: IPage[] | ISectionAndVisualization[];
        apps?: ISection[] | [];
    }
    interface ApiResponse {
        value: {
            fileContent: string;
        }[];
    }
    const BASE_URL = "/sap/opu/odata4/ui2/insights_srv/srvd/ui2/";
    const REPO_BASE_URL: string;
    const EXPORT_API: string;
    const MYINSIGHT_SECTION_ID = "AZHJGRIT78TG7Y65RF6EPFJ9U";
    /**
     *
     * Class for My Home Advanced Settings Panel.
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
     * @alias sap.cux.home.AdvancedSettingsPanel
     */
    export default class AdvancedSettingsPanel extends BaseSettingsPanel {
        private oControlModel;
        private oImportExportTab;
        private oFileNameInput;
        private oSelectedTab;
        private oExportList;
        private oImportList;
        private oImportBtn;
        private oExportBtn;
        private oEventBus;
        private oAppManagerInstance;
        private oPageManagerInstance;
        private oPersonalizerInstance;
        private cardHelperInstance;
        private persData;
        private oContentVBox;
        private oExportMessage;
        private oImportMessage;
        private oDetailPage;
        private oSectionsImported;
        private oUserPersonalization;
        static readonly metadata: MetadataOptions;
        private _recommendationSettingsPanel;
        private _importExportPanel;
        /**
         * Init lifecycle method
         *
         * @public
         * @override
         */
        init(): void;
        private setImportExportList;
        /**
         *
         * @param sType selected tab type
         * Set import / export button enable property and selectedkey of importexport tab
         */
        private enableDisableActions;
        /**
         *
         * @param sType selected tab type
         * Set import/ export message values
         */
        private setExportImportValues;
        /**
         * Sets the outer content VBox for the Advanced Settings Panel.
         * @returns VBox
         */
        private getContent;
        /**
         * Returns the import/export panel.
         *
         * @private
         * @returns {Panel} The import/export panel.
         */
        private _getImportExportPanel;
        /**
         * Returns the import button.
         *
         * @private
         * @returns {Button} import button.
         */
        private _getImportButton;
        /**
         * Returns the export button.
         *
         * @private
         * @returns {Button} export button.
         */
        private _getExportButton;
        /**
         * Returns the inner content for the Advanced Settings Panel.
         *
         * @private
         * @returns {Control} The control containing the Advanced Settings Panel content.
         */
        private addInnerContent;
        /**
         *
         * @returns {List} export section list
         */
        private setExportSectionList;
        /**
         *
         * @returns {List} import section list
         */
        private setImportSectionList;
        /**
         * Selection change event handler for export and import sections
         * @param isImport boolean value to check if import or export tab is selected
         */
        private onSectionsSelectionChange;
        /**
         * Handler for import button press
         *
         */
        private onImportPress;
        /**
         * Invokes import of apps,tiles,pages and cards data
         * @param oImportData import data
         * @returns Promise<IExportSections[]>
         */
        private importSections;
        private importApps;
        private importTiles;
        private importFavPages;
        private importCards;
        /**
         *  Updates status of sections being imported
         *	@param {string} sSectionTitle - section title
         * 	@param {boolean} errorState - error state
         * 	@returns {void}
         */
        private updateImportStatus;
        /**
         *  Resets the import model values
         *  @param {boolean} onOpen - value to show if the reset call is happening while opening the dialog for the first time
         * 	@private
         */
        resetImportModel(onOpen?: boolean): void;
        /**
         * 	Find visualizations that are not already present in the favsections
         * @param aImportedSections
         * @returns {Promise<ISection[] | []>} aImportedSections
         */
        private getDeltaSectionViz;
        private getDeltaAuthSectionViz;
        private filterAuthSectionViz;
        /**
         * Filter authorized favorite pages
         *
         * @param {Array} aFavPages - array of favorite pages
         * @returns {Promise} resolves to an array of authorized pages
         */
        private filterAuthFavPages;
        /**
         * Filter authorized cards
         *
         * @param {Array} aCards - array of cards
         * @returns {Promise} resolves to an array of authorized cards
         */
        private filterAuthCards;
        /**
         * Handles change event for fileuploader on import file
         *
         * @returns {Promise} resolves to available import sections being shown
         */
        private onFileImport;
        private filterAuthorizedImportData;
        private readFileContent;
        private _getPersonalizationData;
        private loadUserPersonalizationData;
        /**
         * Returns selected sections out of provided sections
         *
         * @param {Array} aSections - array of sections to show in import/export
         * @returns {Array} array of selected sections
         */
        getSelectedSections(aSections: IExportSections[]): IExportSections[];
        /**
         * Returns if section is selected
         *
         * @param {Array} oSections - import/export sections
         * @param {String} sSectionId - import/export section id
         * @returns {boolean} returns true if section is selected
         */
        isSectionSelected(sections: IExportSections[], sectionId: string): boolean;
        /**
         * Returns import/export sections
         *
         * @param {object} oData - export/import data
         * @param {ImportExportType} sType - export/import type
         * @param {number} iInsightCardsCount - cards count
         * @returns {Array} array of import/export sections
         */
        private getImportedSections;
        private getDeltaFavPages;
        private getInsightCards;
        /**
         * Handles export button press
         */
        private onExportPress;
        private getExportFileContent;
        /**
         * Handles user personalization error, shows the error msg and reset values
         *
         * @param {string} sType - type of import/export
         * @param {boolean} bShowError - flag to show or hide error msg
         * @param {string} sErrorMsg - error msg text
         * @param {string} sErrorType - error msg type
         */
        private handleUserPersonalizationError;
        /**
         * Handles import/export tab select
         *
         * @param {object} oEvent - IconTabBarSeelect event
         */
        private onImportExportTabSelect;
        /**
         * Handles export file name input change
         *
         * @param {object} oEvent - event
         */
        private onFileNameInputChange;
        private onResetImportApps;
        /**
         * Generates the recommendation settings panel
         * @returns {Panel} recommendation settings panel
         * @private
         */
        private _getRecommendationSettingsPanel;
        /**
         * Adds recommendation settings panel to the content vbox, if recommendation feature is enabled
         * @returns {Promise<void>}
         * @private
         */
        private _setRecommendationSettingsPanel;
        /**
         * Handles recommendation setting change
         *
         * @param {CheckBox$SelectEvent} event - checkbox select event
         * @private
         */
        private onRecommendationSettingChange;
    }
}
//# sourceMappingURL=AdvancedSettingsPanel.d.ts.map