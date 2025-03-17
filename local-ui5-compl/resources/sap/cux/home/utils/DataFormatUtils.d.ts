declare module "sap/cux/home/utils/DataFormatUtils" {
    /*!
     * SAP UI development toolkit for HTML5 (SAPUI5)
     *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
     */
    import { ValueColor } from "sap/m/library";
    import BaseObject from "sap/ui/base/Object";
    import DateFormat from "sap/ui/core/format/DateFormat";
    import { IVisualization } from "sap/cux/home/interface/AppsInterface";
    import { TaskPriority } from "sap/cux/home/ToDoPanel";
    const oRelativeDateTimeFormatter: DateFormat;
    const oRelativeDateFormatter: DateFormat;
    /**
     *
     * Provides util methods for Date Formatting.
     *
     * @extends sap.ui.BaseObject
     *
     * @author SAP SE
     * @version 0.0.1
     * @since 1.122.0
     *
     * @private
     * @experimental Since 1.122
     * @hidden
     *
     * @alias sap.cux.home.utils.DataFormatUtils
     */
    class DataFormatUtils extends BaseObject {
        toPriority(oTask: {
            criticality: ValueColor;
        }): 1 | 2 | 3 | 99;
        toTaskPriorityText(sPriority: TaskPriority): "veryHighPriority" | "highPriority" | "mediumPriority" | "lowPriority" | "nonePriority";
        /**
         * Formats a given date as a relative date and time string.
         *
         * @param {Date} oDate - The input date to format as a relative date and time string.
         * @returns {string} A string representing the input date in a relative date and time format.
         */
        toRelativeDateTime(oDate: Date): string;
        /**
         * Converts a given date to a relative date string.
         *
         * @param {Date} iTimeStamp - The input timestamp to convert to a relative date string.
         * @returns {string} A relative date string with the first letter capitalized.
         */
        toRelativeDate(iTimeStamp: Date): string;
        createBookMarkData(oBookMark: IVisualization): BookmarkParameters;
        getImportance(oDataField: unknown): number;
        sortCollectionByImportance(aCollection: Array<unknown>): unknown[];
        getLeanURL(targetURL: string): string;
    }
    const _default: DataFormatUtils;
    export default _default;
}
//# sourceMappingURL=DataFormatUtils.d.ts.map