declare module "sap/cux/home/TaskPanel" {
    import Control from "sap/ui/core/Control";
    import { MetadataOptions } from "sap/ui/core/Element";
    import Context from "sap/ui/model/Context";
    import { $TaskPanelSettings } from "sap/cux/home/TaskPanel";
    import ToDoPanel, { CalculationProperties, IToDoPanel, RequestOptions, TaskPriority } from "sap/cux/home/ToDoPanel";
    import { ActionButton } from "sap/cux/home/utils/DecisionDialog";
    interface CustomAttribute {
        name?: string;
        label?: string;
        text?: string;
        type?: string;
        href?: string;
        format?: string;
        reference?: string;
        referenced?: string;
        textArrangement?: TextArrangement;
    }
    interface TaskCustomAttribute {
        Name: string;
        Value: string;
        ValueText: string;
        Label: string;
        Type: string;
        Rank: number;
        Format: string;
        FormattedValue: string;
        Reference: string;
        Referenced: string;
        TextArrangement: TextArrangement;
    }
    interface Task {
        SAP__Origin: string;
        CreatedBy: string;
        TaskTitle: string;
        CreatedByName: string;
        InstanceID: string;
        TaskDefinitionID: string;
        CompletionDeadline: string;
        CreatedOn: string;
        actions: ActionButton[];
        Priority: TaskPriority;
        CustomAttributeData: {
            results: TaskCustomAttribute[];
        };
        attributes: CustomAttribute[];
    }
    interface TaskDefintion {
        SAP__Origin: string;
        InstanceID: string;
        TaskDefinitionID: string;
    }
    interface TaskDefinitionCollection {
        TaskDefinitionID: string;
        CustomAttributeDefinitionData: {
            results: TaskCustomAttribute[];
        };
    }
    interface UserInfo {
        Email?: string;
    }
    enum Format {
        CURRENCYVALUE = "CURRENCYVALUE",
        CURRENCYCODE = "CURRENCYCODE",
        USER = "USER"
    }
    enum TextArrangement {
        TextFirst = "TextFirst",
        TextLast = "TextLast",
        TextOnly = "TextOnly",
        TextSeparate = "TextSeparate"
    }
    const Constants: {
        CARD_HEIGHT: {
            1: number;
            2: number;
            3: number;
            4: number;
        };
    };
    /**
     * Splits an array of task cards into smaller arrays, each with a maximum specified length.
     *
     * @param {Task[]} cards - The array of task cards to be split.
     * @param {number} maxLength - The maximum length of each sub-array.
     * @returns {Task[][]} - An array of sub-arrays, each containing a maximum of `maxLength` task cards.
     */
    function splitCards(cards: Task[], maxLength: number): Task[][];
    /**
     *
     * Panel class for managing and storing Task cards.
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
     * @alias sap.cux.home.TaskPanel
     */
    export default class TaskPanel extends ToDoPanel implements IToDoPanel {
        private _customAttributeMap;
        private userInfo;
        private _disableNavigation;
        private _taskDefinitionMap;
        private _overflowPopover;
        private _overflowList;
        constructor(id?: string | $TaskPanelSettings);
        constructor(id?: string, settings?: $TaskPanelSettings);
        static readonly metadata: MetadataOptions;
        /**
         * Init lifecycle method
         *
         * @private
         * @override
         */
        init(): void;
        /**
         * Generates request URLs for fetching data based on the specified card count.
         * Overridden method to provide task-specific URLs.
         *
         * @private
         * @override
         * @param {number} cardCount - The number of cards to retrieve.
         * @returns {string[]} An array of request URLs.
         */
        generateRequestUrls(cardCount: number): string[];
        /**
         * Generates a card template for tasks.
         * Overridden method from To-Do panel to generate task-specific card template.
         *
         * @private
         * @override
         * @param {string} id The ID for the template card.
         * @param {Context} context The context object.
         * @returns {Control} The generated card control template.
         */
        generateCardTemplate(id: string, context: Context): Control;
        /**
         * Handles the press event of the overflow button.
         * Opens a Popover containing overflow actions.
         *
         * @private
         * @param {Event} event - The press event triggered by the overflow button.
         * @param {Context} context - The context containing all actions.
         * @returns {void}
         */
        private _onOverflowButtonPress;
        /**
         * Creates or retrieves the overflow button Popover.
         *
         * @private
         * @param {ActionButton[]} actionButtons - The array of overflow actions.
         * @returns {Popover} The overflow button Popover.
         */
        private _getOverflowButtonPopover;
        /**
         * Sets up the overflow button list with the provided task-specific actions.
         *
         * @private
         * @param {ActionButton[]} actionButtons - The array of overflow actions.
         * @returns {void}
         */
        private _setupOverflowList;
        /**
         * Handles the button press event and executes the provided press handler function,
         * which refreshes the UI after the button press action.
         *
         * @private
         * @param {Function} pressHandler - The function to be executed when the button is pressed.
         * @returns {void}
         */
        private _onActionButtonPress;
        /**
         * Retrieves custom attributes for a given task and formats them for display.
         * If the task has completion deadline and creation date, those attributes are also included.
         * If the task has a creator, the creator's name is included as well.
         *
         * @param {Task} task - The task object for which custom attributes are retrieved.
         * @returns {CustomAttribute[]} - An array of formatted custom attributes.
         */
        private _getCustomAttributes;
        /**
         * Formats the given unit of measure value and description based on the specified text arrangement.
         *
         * @private
         * @param {TaskCustomAttribute} customAttribute The custom attribute object.
         * @param {TextArrangement} textArrangement The text arrangement option.
         * @returns {string} The formatted value.
         */
        private _arrangeText;
        /**
         * Formats a custom attribute value based on its format type.
         *
         * @param {CustomAttribute} customAttribute - The custom attribute object.
         * @param {TaskCustomAttribute[]} taskAttributes - The array of task attributes.
         * @returns {string} - The formatted value.
         */
        private _formatCustomAttribute;
        /**
         * Adds common attributes to the final attributes list based on the provided task.
         * Common attributes include completion deadline, creation date, and creator's name.
         *
         * @param {CustomAttribute[]} finalAttributes - The array of custom attributes to which the common attributes will be added.
         * @param {Task} task - The task object containing data for common attributes.
         */
        private _addCommonAttributes;
        /**
         * Format a date string to a custom date and time format.
         *
         * @private
         * @param {string} dateStr - The date string to format.
         * @param {string} pattern - The pattern to be used for formatting the date.
         * @returns {string} The formatted date string.
         */
        private _formatDate;
        /**
         * Parses different time formats supplied from the back-ends. It returns UNIX time stamp in milliseconds.
         * If Time Format contains unexpected symbols or Format is not recognized NaN is returned.
         * Referenced from: cross.fnd.fiori.inbox.CustomAttributeComparator
         *
         * @param {string | number} time date format to be parsed. If int UNIX time stamp in milliseconds is assumed.
         * @returns {number} UNIX time stamp in milliseconds. (milliseconds that have elapsed since 00:00:00 UTC, Thursday, 1 January 1970)
         * @private
         */
        private _getParsedTime;
        /**
         * Check whether given dateString is of format YYYYMMDD and is a valid value for Date object.
         *
         * @param {string} dateString - The datestring to be checked for validity
         * @returns {Date} if its a valid date return the date else false
         * @private
         */
        private _isValidDate;
        /**
         * Handles the press event of a task.
         *
         * @private
         * @param {Event} event - The press event.
         */
        private _onPressTask;
        /**
         * Get the task URL for a given task.
         *
         * @private
         * @param {string} originId - The origin ID of the task.
         * @param {string} instanceId - The instance ID of the task.
         * @returns {string} The task URL.
         */
        private _getTaskUrl;
        /**
         * Handles the click event on the "Created By" link.
         * Triggers email or opens a contact card if configuration is enabled
         *
         * @private
         * @param {Event} event - The event object.
         */
        private _onClickCreatedBy;
        /**
         * Fetches user details if required.
         *
         * @private
         * @param {string} originId - The origin ID.
         * @param {string} userId - The user ID.
         * @returns {Promise<UserInfo>} - A promise that resolves to the user information.
         */
        private _fetchUserDetailsIfRequired;
        /**
         * Fetches user information for a specific user.
         *
         * @private
         * @param {string} originId - The origin ID.
         * @param {string} userId - The user ID.
         * @returns {Promise<UserInfo>} - A promise that resolves to the user information.
         */
        private _fetchUserInfo;
        /**
         * Hook for processing data fetched from a batch call.
         * This method can be overridden to perform additional data processing operations.
         * In this implementation, it is consumed to handle task-related data, particularly
         * for extracting custom attributes if action cards are enabled.
         *
         * @private
         * @async
         * @param {unknown[]} results - Data retrieved from the batch call. Structure may vary based on the backend service.
         * @param {RequestOptions} options - Additional options for parsing the data.
         * @returns {Promise<void>} A Promise that resolves when the data processing is complete.
         */
        onDataReceived(results: unknown[], options: RequestOptions): Promise<void>;
        /**
         * Updates the tasks with attributes and actions.
         *
         * @private
         * @param {Task[]} tasks - The array of tasks to update.
         * @returns {Promise<Task[]>} A promise that resolves with the updated array of tasks.
         */
        private _updateTasks;
        /**
         * Adds custom attributes to each task in the provided array.
         *
         * @private
         * @param {Task[]} tasks - The array of tasks to which custom attributes will be added.
         * @returns {Task[]} - A new array of tasks, each with added custom attributes.
         */
        private _addCustomAttributes;
        /**
         * Adds actions to the tasks based on their task definitions.
         *
         * @private
         * @param {Task[]} tasks - The array of tasks to which actions will be added.
         * @returns {Task[]} The array of tasks with actions added.
         */
        private _addActions;
        /**
         * Downloads decision options for the provided task definitions.
         *
         * @private
         * @param {Record<string, TaskDefinition>} taskDefinitions - The task definitions for which decision options will be downloaded.
         * @returns {Promise<void>} A promise that resolves when all decision options are downloaded and processed.
         */
        private _downloadDecisionOptions;
        /**
         * Retrieves unique task definitions from the provided array of tasks.
         *
         * @private
         * @param {Task[]} tasks - The array of tasks from which to retrieve task definitions.
         * @returns {Record<string, TaskDefintion>} An object containing unique task definitions.
         */
        private _getTaskDefintions;
        /**
         * Extracts Custom Attribute Information to create an attribute map from raw attribute data
         * received from call, which is used while task processing
         *
         * @private
         * @param {TaskDefinitionCollection[]} taskDefinitions - array of raw tasks definitions
         */
        private _extractCustomAttributes;
        /**
         * Get the text for the "No Data" message.
         *
         * @private
         * @returns {string} The text for the "No Data" message.
         */
        getNoDataText(): string;
        /**
         * Calculates the number of vertical cards that can fit within the available height of the given DOM element.
         *
         * @private
         * @override
         * @param {Element} domRef - The DOM element to calculate the vertical card count for.
         * @returns {number} - The number of vertical cards that can fit within the available height.
         */
        getVerticalCardCount(domRef: Element, calculationProperties?: CalculationProperties): number;
    }
}
//# sourceMappingURL=TaskPanel.d.ts.map