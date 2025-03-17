declare module "sap/cux/home/ToDoPanel" {
    import { Priority } from "sap/m/library";
    import Control from "sap/ui/core/Control";
    import type { MetadataOptions } from "sap/ui/core/Element";
    import DateFormat from "sap/ui/core/format/DateFormat";
    import Context from "sap/ui/model/Context";
    import BasePanel from "sap/cux/home/BasePanel";
    import { $ToDoPanelSettings } from "sap/cux/home/ToDoPanel";
    interface IToDoPanel {
        generateCardTemplate(id: string, context: Context): Control;
        generateRequestUrls?(cardCount: number): string[];
        onDataReceived?(data: unknown[], options?: RequestOptions): Promise<void>;
        getNoDataText?(): string;
    }
    interface Request {
        baseURL: string;
        requestURLs: string[];
        success(args: unknown[]): Promise<void>;
    }
    interface CalculationProperties {
        isPlaceholder?: boolean;
    }
    interface Intent {
        target: {
            semanticObject: string;
            action: string;
        };
        params: {
            [key: string]: string;
        };
    }
    interface RequestOptions {
        type: string;
        onlyCount?: boolean;
    }
    interface Response {
        d?: {
            results?: unknown[];
        };
        results?: unknown[];
        value?: unknown[];
    }
    enum TaskPriority {
        VERY_HIGH = "VERY_HIGH",
        HIGH = "HIGH",
        MEDIUM = "MEDIUM",
        LOW = "LOW"
    }
    const Constants: {
        SITUATION_ICON: string;
        PLACEHOLDER_ITEMS_COUNT: number;
        TODO_CARDS_LIMIT: number;
        TODO_SECTION_LIMIT: number;
        TODOS_REFRESH_INTERVAL: number;
        MOBILE_DEVICE_MAX_WIDTH: number;
        DEFAULT_TITLE_HEIGHT: number;
        DEFAULT_CARD_HEIGHT: number;
        DEFAULT_TAB_HEADER_HEIGHT: number;
    };
    /**
     * Calculates the card width based on the available width and certain constraints.
     *
     * @param {number} availableWidth - The available width for card rendering.
     * @returns {number} The calculated card width within specified constraints.
     */
    function calculateCardWidth(availableWidth: number): number;
    /**
     *
     * Abstract Panel class for managing and storing To-Do cards.
     *
     * @extends BasePanel
     *
     * @author SAP SE
     * @version 0.0.1
     * @since 1.121
     *
     * @abstract
     * @internal
     * @experimental Since 1.121
     * @public
     *
     * @alias sap.cux.home.ToDoPanel
     */
    export default abstract class ToDoPanel extends BasePanel implements IToDoPanel {
        protected _oData: Record<string, unknown>;
        protected requests: Request[];
        private _controlModel;
        private _toDoWrapper;
        private _cardContainer;
        private _mobileCardContainer;
        private _errorCard;
        private _errorMessage;
        private _refreshBtn;
        private _loadToDos;
        private _innerControlsBound;
        private _cardCount;
        constructor(id?: string | $ToDoPanelSettings);
        constructor(id?: string, settings?: $ToDoPanelSettings);
        static readonly metadata: MetadataOptions;
        static relativeDateFormatter: DateFormat;
        /**
         * Init lifecycle method
         *
         * @private
         * @override
         */
        init(): void;
        /**
         * Generates the card container (GridContainer) for displaying cards.
         *
         * @private
         * @returns {GridContainer} The generated card container.
         */
        private _generateCardContainer;
        /**
         * Generates the mobile card container (HeaderContainer) for displaying cards on mobile devices.
         *
         * @private
         * @returns {HeaderContainer} The generated mobile card container.
         */
        private _generateMobileCardContainer;
        /**
         * Generates the error message card for displaying error messages.
         *
         * @private
         * @returns {Card} The generated error message card.
         */
        private _generateErrorMessage;
        /**
         * Handler for the Refresh button for each panel.
         * Reloads the selected panel
         *
         * @async
         * @private
         */
        private _onPressRefresh;
        /**
         * Loads the To-Do cards for the panel.
         *
         * @private
         * @param {boolean} forceRefresh - force refresh cards
         * @returns {Promise<void>} A promise that resolves when the cards are loaded.
         */
        _loadCards(forceRefresh?: boolean): Promise<void>;
        /**
         * Update Container Header if the panel is exclusive
         *
         * @private
         */
        private _updateHeaderIfExclusive;
        /**
         * Creates a one-time binding of inner controls for the ToDoPanel.
         * @private
         */
        private _bindInnerControls;
        /**
         * Generate a default card template for the Current Panel.
         * An extended panel can have it's own template by overridding
         * this method and providing a custom card template.
         *
         * @public
         * @param {string} id The ID for the template.
         * @param {object} context The context for the template.
         * @returns {object} The generated card template.
         */
        generateCardTemplate(id: string, context: Context): Control;
        /**
         * Convert a priority string to a corresponding priority value.
         *
         * @private
         * @param {TaskPriority} priority - The task priority string.
         * @returns {string} The corresponding priority value.
         */
        _toPriority(priority: TaskPriority): Priority;
        /**
         * Convert a priority string to a corresponding priority text.
         *
         * @private
         * @param {Priority} priority - The priority string.
         * @returns {string} The corresponding priority text.
         */
        _toPriorityText(priority: Priority): string;
        /**
         * Generates placeholder tiles for the panel.
         *
         * @private
         */
        private _generatePlaceHolderTiles;
        /**
         * Calculates the number of visible cards that can fit within the available space of the To-Dos panel.
         *
         * @private
         * @param {CalculationProperties} [calculationProperties] - Optional properties to assist in the calculation.
         * @returns {number} - The number of visible cards.
         */
        private _getVisibleCardCount;
        /**
         * Checks if the current element is expanded to full screen.
         *
         * @private
         * @returns {boolean} - True if the element is expanded, otherwise false.
         */
        private _isElementExpanded;
        /**
         * Calculates the number of horizontal cards that can fit within the available width of the given DOM element.
         *
         * @private
         * @param {Element} domRef - The DOM element to calculate the horizontal card count for.
         * @returns {number} - The number of horizontal cards that can fit within the available width.
         */
        protected getHorizontalCardCount(domRef: Element): number;
        /**
         * Calculates the number of vertical cards that can fit within the available height of the given DOM element.
         *
         * @private
         * @param {Element} domRef - The DOM element to calculate the vertical card count for.
         * @returns {number} - The number of vertical cards that can fit within the available height.
         */
        protected getVerticalCardCount(domRef: Element): number;
        /**
         * Calculates the combined height of the title and tab header for the To-Dos panel.
         *
         * @private
         * @returns {number} - The combined height of the title and tab header.
         */
        protected calculateTitleHeight(): number;
        /**
         * Generates a request object for batch requests.
         *
         * @private
         * @param {RequestOptions} options - Additional properties for generating the request object.
         * @param {boolean} [options.onlyCount] - Whether to include only the count in the request.
         * @returns {Object} The generated request object.
         */
        private _generateRequestObject;
        /**
         * Generates request URLs for fetching data based on the specified card count.
         *
         * @private
         * @param {number} cardCount - The number of cards to retrieve.
         * @returns {string[]} An array of request URLs.
         */
        generateRequestUrls(cardCount: number): string[];
        /**
         * Hook for processing data fetched from a batch call.
         * This method can be overridden to perform additional data processing operations.
         *
         * @private
         * @async
         * @param {unknown[]} results - Data retrieved from the batch call.
         * @param {RequestOptions} options - Additional options for parsing the data.
         * Structure may vary based on the backend service.
         */
        onDataReceived(results?: unknown[], options?: RequestOptions): Promise<void>;
        /**
         * Handles the scenario when there are no cards to display.
         * Updates the illustration and description based on the selected panel and card count.
         *
         * @private
         */
        private _handleEmptyCards;
        /**
         * Checks if the panel is exclusive based on support and the number of panels.
         *
         * @private
         * @returns {boolean} True if the panel is exclusive, otherwise false.
         */
        private _isExclusivePanel;
        /**
         * Sets the interval for refreshing the section.
         *
         * @private
         */
        private _setSectionRefreshInterval;
        /**
         * Updates the refresh information and adjusts the layout.
         *
         * @private
         */
        _updateRefreshInformation(): void;
        /**
         * Adjusts the layout based on card count and device type.
         *
         * @private
         */
        _adjustLayout(): void;
        /**
         * Formats the given date to a relative date.
         *
         * @private
         * @param {Date} date Date object or Date String
         * @returns {string} Formatted Date
         */
        _toRelativeDateTime(date: Date): string;
        /**
         * Get the text for the "No Data" message.
         *
         * @private
         * @returns {string} The text for the "No Data" message.
         */
        getNoDataText(): string;
        /**
         * Parses the response object and returns the appropriate value.
         *
         * @private
         * @param {Object} response - The response object.
         * @param {Object} [response.d] - The 'd' property of the response object.
         * @param {Array} [response.d.results] - The results array.
         * @param {string|number} [response.d] - The 'd' property of the response object which may contain a numeric value.
         * @param {string|number} [response] - The response object which may contain a numeric value.
         * @param {string|number} [response.value] - The 'value' property of the response object which may contain a numeric value.
         * @returns {Response} - The parsed value extracted from the response object.
         */
        private _parseResponse;
        /**
         * Submits a batch request for multiple URLs and processes the responses.
         *
         * @private
         * @returns {Promise} A Promise that resolves when all batch requests are completed.
         */
        protected _submitBatch(): Promise<unknown[]>;
        /**
         * Handles errors by updating the data and logging the error.
         *
         * @private
         * @param {Error} error - The error object to handle.
         */
        private _handleError;
        /**
         * Clears the list of requests.
         *
         * @private
         */
        protected _clearRequests(): void;
        /**
         * Checks if the panel is loaded.
         *
         * @private
         * @returns {boolean} true if the panel is loaded, false otherwise.
         */
        _isLoaded(): boolean;
        /**
         * Set the loaded status of the ToDoPanel.
         *
         * @private
         * @param {boolean} isLoaded - The new loaded status to set for the ToDoPanel.
         */
        _setLoaded(isLoaded: boolean): void;
        /**
         * Gets the supported status of the panel.
         *
         * @private
         * @returns {boolean} The supported status of the panel.
         */
        _getSupported(): boolean;
        /**
         * Sets the supported status of the panel.
         *
         * @private
         * @param {boolean} value - The value to set for supported status.
         */
        _setSupported(isSupported: boolean): void;
        /**
         * Extracts the app intent from the target app URL.
         *
         * @private
         * @returns {Intent | null} The app intent object with target and parameters, or null if not found.
         */
        _getAppIntent(): Intent | null;
        /**
         * Switch to available tab if current panel has empty cards or has error
         *
         * @private
         * @async
         */
        private _switchTabIfRequired;
        /**
         * Handles the press event to view all items.
         *
         * @private
         */
        _onPressViewAll(): void;
        /**
         * Retrieves the count of cards in the panel.
         *
         * @private
         * @returns {number} The number of cards.
         */
        _getCardCount(): number;
        /**
         * Handles actions to be performed before the To-Dos panel is expanded.
         * If the panel has not been expanded before in full screen, the cards will be loaded once.
         *
         * @private
         */
        private _beforePanelExpand;
    }
}
//# sourceMappingURL=ToDoPanel.d.ts.map