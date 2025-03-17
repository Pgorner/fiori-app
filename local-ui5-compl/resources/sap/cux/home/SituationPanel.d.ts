declare module "sap/cux/home/SituationPanel" {
    import { LoadState } from "sap/m/library";
    import Control from "sap/ui/core/Control";
    import Context from "sap/ui/model/Context";
    import ToDoPanel, { $ToDoPanelSettings, IToDoPanel } from "sap/cux/home/ToDoPanel";
    interface Situation {
        SitnInstceKey: string;
        SitnInstceCreatedAtDateTime: string;
        SitnEngineType: string;
        _InstanceAttribute: InstanceAttribute[];
        _InstanceText: InstanceText;
        status?: LoadState;
    }
    interface InstanceAttribute {
        SitnInstceKey: string;
        SitnInstceAttribName: string;
        SitnInstceAttribSource: string;
        SitnInstceAttribEntityType: string;
        _InstanceAttributeValue: InstanceAttributeValue[];
    }
    interface InstanceAttributeValue {
        SitnInstceKey: string;
        SitnInstceAttribName: string;
        SitnInstceAttribSource: string;
        SitnInstceAttribValue: string;
    }
    interface InstanceText {
        SituationTitle: string;
        SituationText: string;
    }
    interface NavigationData {
        SitnInstanceID: string;
        SitnSemanticObject: string;
        SitnSemanticObjectAction: string;
        _NavigationParam: NavigationParam[];
    }
    interface NavigationParam {
        SituationNotifParamName: string;
        SituationNotifParameterVal: string;
    }
    class NavigationHelperError {
        _sErrorCode: string;
    }
    /**
     *
     * Panel class for managing and storing Situation cards.
     *
     * @extends ToDoPanel
     *
     * @author SAP SE
     * @version 0.0.1
     * @since 1.121
     *
     * @internal
     * @experimental Since 1.121
     * @public
     *
     * @alias sap.cux.home.SituationPanel
     */
    export default class SituationPanel extends ToDoPanel implements IToDoPanel {
        private _situationsModel;
        private _dateFormatter;
        private _decimalFormatter;
        /**
         * Constructor for a new Situation Panel.
         *
         * @param {string} [id] ID for the new control, generated automatically if an ID is not provided
         * @param {object} [settings] Initial settings for the new control
         */
        constructor(id?: string, settings?: $ToDoPanelSettings);
        /**
         * Init lifecycle method
         *
         * @private
         * @override
         */
        init(): void;
        /**
         * Generates request URLs for fetching data based on the specified card count.
         * Overridden method to provide situation-specific URLs.
         *
         * @private
         * @override
         * @param {number} cardCount - The number of cards to retrieve.
         * @returns {string[]} An array of request URLs.
         */
        generateRequestUrls(cardCount: number): string[];
        /**
         * Generates a card template for situations.
         * Overridden method from To-Do panel to generate situation-specific card template.
         *
         * @private
         * @override
         * @param {string} id The ID for the template card.
         * @param {Context} context The context object.
         * @returns {Control} The generated card control template.
         */
        generateCardTemplate(id: string, context: Context): Control;
        /**
         * Compose the situation message by replacing placeholders with formatted parameter values.
         *
         * @private
         * @param {string} rawText - The raw text containing placeholders.
         * @param {InstanceAttribute[]} params - An array of parameters to replace in the text.
         * @returns {string} The composed text with replaced placeholders.
         */
        private _getSituationMessage;
        /**
         * Gets the date formatter instance using the medium date pattern.
         *
         * @returns {DateFormat} The date formatter instance.
         */
        private _getDateFormatter;
        /**
         * Gets the number formatter instance using the settings retrieved from Configuration.
         *
         * @returns {NumberFormat} The number formatter instance.
         */
        private _getNumberFormatter;
        /**
         * Handle the press event for a situation.
         *
         * @private
         * @param {Event} event - The event object.
         */
        private _onPressSituation;
        /**
         * Retrieves the Situations model. If the model does not exist, it creates a new one.
         *
         * @private
         * @returns {ODataModel} The Situations model instance.
         */
        private _getSituationsModel;
        /**
         * Fetches navigation target data based on the provided instance ID.
         *
         * @private
         * @async
         * @param {string} instanceId - The instance ID for which to fetch navigation data.
         * @param {string} situationEngineType - Situation Engine Type
         * @returns {Promise<NavigationTargetData>} A promise that resolves with an object containing navigation data.
         */
        private _fetchNavigationTargetData;
        /**
         * Executes navigation based on provided data.
         *
         * @private
         * @param {NavigationData} oData - Data object containing navigation parameters.
         * @param {Component} ownerComponent - The owner component initiating the navigation.
         * @returns {Promise<void>} A promise that resolves or rejects based on the navigation result.
         */
        private _executeNavigation;
        /**
         * Get the text for the "No Data" message.
         *
         * @private
         * @returns {string} The text for the "No Data" message.
         */
        getNoDataText(): string;
    }
}
//# sourceMappingURL=SituationPanel.d.ts.map