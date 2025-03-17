declare module "sap/cux/home/utils/DecisionDialog" {
    import ResourceBundle from "sap/base/i18n/ResourceBundle";
    import Dialog from "sap/m/Dialog";
    import { ButtonType } from "sap/m/library";
    import Event from "sap/ui/base/Event";
    import BaseObject from "sap/ui/base/Object";
    import { ValueState } from "sap/ui/core/library";
    import { Task } from "sap/cux/home/TaskPanel";
    import { TaskPriority } from "sap/cux/home/ToDoPanel";
    enum ReasonRequired {
        Required = "REQUIRED",
        Optional = "OPTIONAL"
    }
    interface DecisionOption {
        SAP__Origin: string;
        InstanceID: string;
        Nature: ButtonType;
        DecisionKey: string;
        CommentMandatory: boolean;
        DecisionText: string;
        ReasonRequired: ReasonRequired;
    }
    interface ReasonOption {
        [key: string]: string;
    }
    interface ReasonOptionSettings {
        show: boolean;
        required: boolean;
        reasonOptions?: ReasonOption[];
    }
    interface DecisionDialogSettings {
        badgeIcon: string;
        badgeValueState: string;
        showNote: boolean;
        noteMandatory: boolean;
        question: string;
        title: string;
        confirmButtonLabel: string;
        textAreaLabel: string;
        priorityText: string;
        showFeedbackMessage: boolean;
        reasonOptionsSettings: ReasonOptionSettings;
        confirmActionHandler: (note: string, reasonCode: string) => void;
        cancelActionHandler: () => void;
    }
    interface IDecisionDialog extends Dialog {
        _bClosedViaButton: boolean;
    }
    interface DialogSettings {
        dialogSettings: DecisionDialogSettings;
        submitButtonEnabled: boolean;
    }
    interface ODataError {
        response: {
            body: string;
        };
        responseText: string;
        error: {
            message: {
                value: string;
            };
        };
    }
    interface MultiSelectDecisionResult {
        [key: string]: DecisionOption[];
    }
    interface ActionButton {
        type: ButtonType;
        text: string;
        pressHandler: (refresh: Refresh) => Promise<void> | void;
    }
    interface Refresh {
        (forceRefresh: boolean): void;
    }
    const decideButtonNature: (decisionOption: DecisionOption) => ButtonType;
    const getActionButton: (decisionOption: DecisionOption, i18nBundle: ResourceBundle, task: Task, baseUrl: string) => ActionButton;
    /**
     * Gets the icon frame badge based on the task priority.
     *
     * This method returns a specific badge string for tasks with high or very high priority.
     * For tasks with lower priorities, it returns an empty string.
     *
     * @param {TaskPriority} priority - The priority level of the task.
     * @returns {string} The badge string for high priority tasks, or an empty string for others.
     */
    function getIconFrameBadge(priority: TaskPriority): string;
    /**
     * Converts a priority string to a Priority enum value.
     * If the priority string is not recognized, it returns the default value "None".
     *
     * @param {TaskPriority} priority - The priority string to convert.
     * @returns {ValueState} The corresponding Priority enum value.
     */
    function getIconFrameBadgeValueState(priority: TaskPriority): ValueState;
    /**
     *
     * Helper class for Decision Dialog handling.
     *
     * @extends BaseObject
     *
     * @author SAP SE
     * @version 0.0.1
     * @since 1.121
     *
     * @internal
     * @experimental Since 1.121
     * @private
     *
     * @alias sap.cux.home.utils.DecisionDialog
     */
    export default class DecisionDialog extends BaseObject {
        private decisionOption;
        private i18nBundle;
        private refreshView;
        private task;
        private confirmationDialogPromise;
        private confirmationDialogModel;
        private dataServiceModel;
        private baseUrl;
        constructor(decisionOption: DecisionOption, i18nBundle: ResourceBundle, task: Task, baseUrl: string, refreshView: Refresh);
        /**
         * Handles the change event of the reason option ComboBox.
         *
         * @private
         * @param {Event} event - The event object.
         * @returns {void}
         */
        handleReasonOptionChange(event: Event): void;
        /**
         * Toggles the state of the submit button based on the dialog settings.
         *
         * @private
         * @returns {void}
         */
        _toggleSubmitButtonState(): void;
        /**
         * Reads reason options from the backend.
         *
         * @private
         * @param {string} origin - The SAP origin.
         * @param {string} instance - The instance ID.
         * @param {string} decisionKey - The decision key.
         * @param {Function} onSuccess - The success callback function.
         * @param {Function} onError - The error callback function.
         * @returns {void}
         */
        private readReasonOptions;
        /**
         * Load the reason options which are part of this decision option.
         *
         * @private
         * @returns {Promise<ReasonOptionSettings | null>} - containing resolved array of reason options
         */
        private loadReasonOptions;
        /**
         * Open the decision dialog for the inbox task selected.
         *
         * @private
         * @param {DecisionDialogSettings} dialogSettings - contains the settings for the decision dialog
         */
        private openDecisionDialog;
        /**
         * Submit handler for the decision dialog
         *
         * @private
         */
        confirmActionHandler(): void;
        /**
         * Handler for cancel action in the decision dialog
         *
         * @private
         */
        handleCancel(): void;
        /**
         * After close dialog handler in the decision dialog
         *
         * @private
         */
        handleAfterClose(): void;
        /**
         * Creates an OData request with the specified parameters.
         *
         * @private
         * @param {string} path - The path of the OData request.
         * @param {Record<string, string>} urlParams - The URL parameters of the request.
         * @param {Function} fnSuccess - The success callback function.
         * @param {Function} fnError - The error callback function.
         * @returns {void}
         */
        private createODataRequest;
        /**
         * Sends an action to the backend.
         *
         * @private
         * @param {string} importName - The name of the function import or action.
         * @param {DecisionOption} decision - The decision option.
         * @param {string} note - The note to be included with the action.
         * @param {string} reasonOptionCode - The reason option code.
         * @param {Task} task - The task associated with the action.
         * @returns {void}
         */
        private sendAction;
        /**
         * Shows the decision dialog.
         *
         * @private
         * @returns {Promise<void>}
         */
        private showDecisionDialog;
        /**
         * Initiates the decisionDialog
         *
         * @static
         * @param {DecisionOption} decisionOption - Decision Option
         * @param {ResourceModel} i18nBundle - The resource bundle for internationalization.
         * @param {Task} task - Task Instance
         * @param {Refresh} refresh - Refresh function
         */
        static decisionDialogMethod(decisionOption: DecisionOption, i18nBundle: ResourceBundle, task: Task, baseUrl: string, refresh: Refresh): Promise<void>;
        /**
         * Retrieves task actions based on the task and multi-select decision results.
         *
         * @static
         * @param {Task} task - The task for which actions are retrieved.
         * @param {string} baseUrl - The base URL.
         * @param {MultiSelectDecisionResult} multiSelectDecisionResults - The multi-select decision results.
         * @param {ResourceBundle} i18nBundle - The resource bundle for internationalization.
         * @returns {ActionButton[]} An array of action buttons.
         */
        static getTaskActions(task: Task, baseUrl: string, multiSelectDecisionResults: MultiSelectDecisionResult, i18nBundle: ResourceBundle): ActionButton[];
    }
}
//# sourceMappingURL=DecisionDialog.d.ts.map