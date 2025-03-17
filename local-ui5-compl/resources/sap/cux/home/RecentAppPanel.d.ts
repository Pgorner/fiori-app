declare module "sap/cux/home/RecentAppPanel" {
    import type { MetadataOptions } from "sap/ui/core/Element";
    import DateFormat from "sap/ui/core/format/DateFormat";
    import BaseAppPersPanel, { $BaseAppPersPanelSettings } from "sap/cux/home/BaseAppPersPanel";
    interface IAppHistoryItem {
        name: string;
    }
    interface IAppHistory {
        dateStamp: number;
        apps: IAppHistoryItem[];
    }
    enum DateFilterOption {
        ALL = "ALL",
        TODAY = "TODAY",
        WEEK = "WEEK",
        TWO_WEEK = "TWO_WEEK",
        THREE_WEEK = "THREE_WEEK"
    }
    const GroupDateFormatter: DateFormat;
    const Constants: {
        OLDER_DATE_TIMESTAMP: number;
    };
    const formatConstantTimeInDate: (date: Date) => number;
    /**
     * Calculates the start and end dates of a week based on the given week offset.
     * @param weekOffset - The offset from the current week.
     * @returns An object containing the start and end dates of the week.
     */
    const getWeekRangeValues: (weekOffset: number) => {
        startDate: number;
        endDate: number;
    };
    /**
     * Calculates the timestamp of a date, that is a specified number of days before a given current date.
     *
     * @param {Date} currentTimeStamp - The current date to calculate days before.
     * @param {number} days - The number of days before the current date.
     * @returns {number} The timestamp of the date `days` before `currentDate`.
     */
    const getDaysBefore: (currentTimeStamp: number, days: number) => number;
    /**
     * Filters an app by date.
     * @private
     * @param {number} appTimeStamp - The timestamp of the app.
     * @param {number} startTimeStamp - The start timestamp for filtering.
     * @param {number} endTimeStamp - The end timestamp for filtering.
     * @returns A boolean indicating whether the app falls within the specified date range.
     */
    const isDateWithinRange: (appTimeStamp: number, startTimeStamp: number, endTimeStamp: number) => boolean;
    /**
     *
     * Provides class for managing Recently Used apps.
     *
     * @extends sap.cux.home.BaseAppPersPanel
     *
     * @author SAP SE
     * @version 0.0.1
     * @since 1.121.0
     *
     * @internal
     * @experimental Since 1.121
     * @public
     *
     * @alias sap.cux.home.RecentAppPanel
     */
    export default class RecentAppPanel extends BaseAppPersPanel {
        private _recentDayTimeStamp;
        private _recentApps;
        static readonly metadata: MetadataOptions;
        /**
         * Constructor for a new Recently Used apps Panel.
         *
         * @param {string} [id] ID for the new control, generated automatically if an ID is not provided
         * @param {object} [settings] Initial settings for the new control
         */
        constructor(id?: string, settings?: $BaseAppPersPanelSettings);
        init(): void;
        /**
         * Fetch recent apps and set apps aggregation
         * @private
         */
        loadApps(): Promise<void>;
        /**
         * Returns list of recent apps
         * @private
         * @returns {Promise<IActivity[]>} - Array of recent apps.
         */
        private _getRecentApps;
        /**
         * Returns list of actions available for selected app
         * @private
         * @param {boolean} isAppAddedInFavorite - true if app is already present in favorite, false otherwise.
         * @returns {sap.cux.home.MenuItem[]} - Array of list items.
         */
        private _getAppActions;
        /**
         * Redirects to the selected app url
         * @private
         * @param {sap.ui.base.Event} event - The event object.
         */
        private _resumeAppActivity;
        /**
         * Generates and returns a dialog for showing the history of recent applications.
         * @private
         * @returns The generated dialog for showing the history of recent applications.
         */
        private _generateHistoryDialog;
        /**
         * Generates the app history list.
         * @private
         * @returns The generated app history list.
         */
        private _generateAppHistoryList;
        /**
         * Generates the app history list filter.
         * @private
         * @returns The Select control for the app history list filter.
         */
        private _generateAppHistoryListFilter;
        /**
         * Generates and populates items in the app history list based on the provided list of items.
         * Clears existing items in the list before adding new items.
         *
         * @param {IAppHistory[]} appHistoryItems - Array of items to populate in the app history list.
         * @returns {void}
         * @private
         */
        private _generateAppHistoryListItems;
        /**
         * Opens the history dialog.
         * This method generates the show history dialog, retrieves the app history list,
         * generates the app history list items, and opens the dialog.
         * @private
         */
        private _openHistoryDialog;
        /**
         * Closes the history dialog.
         * @private
         */
        private _closeHistoryDialog;
        /**
         * Handles the change event of the date filter.
         * Updates the app history list based on the selected date filter.
         * @private
         * @param {Select$ChangeEvent} event - The select change event.
         */
        private _onDateFilterChange;
        /**
         * Generates a group header for the given date timestamp.
         *
         * @param {number} dateStamp - The timestamp representing the date.
         * @returns {GroupHeaderListItem} The generated group header list item.
         * @private
         */
        private _getGroupHeader;
        /**
         * Retrieves the application usage history based on recent app data.
         *
         * @returns {IAppHistory[]} Array of objects, where each object contains the date timestamp and the apps that are used on that date.
         * @private
         */
        private _getAppHistory;
        /**
         * Retrieves the filtered app history based on the selected date filter option.
         * @private
         * @param {DateFilterOption} selectedKey - The selected date filter option.
         * @returns {IAppHistory[]} An array of filtered app history.
         */
        private _getFilteredAppHistory;
        /**
         * Generates illustrated message for recent apps panel.
         * @private
         * @override
         * @returns {sap.m.IllustratedMessage} Illustrated error message.
         */
        protected generateIllustratedMessage(): import("sap/m/IllustratedMessage").default;
    }
}
//# sourceMappingURL=RecentAppPanel.d.ts.map