/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/m/library", "sap/ui/base/Object", "sap/ui/core/format/DateFormat", "../ToDoPanel"], function (sap_m_library, BaseObject, DateFormat, ___ToDoPanel) {
  "use strict";

  const ValueColor = sap_m_library["ValueColor"];
  const TaskPriority = ___ToDoPanel["TaskPriority"];
  const oRelativeDateTimeFormatter = DateFormat.getDateTimeInstance({
    style: "medium",
    relative: true,
    relativeStyle: "short"
  });
  const oRelativeDateFormatter = DateFormat.getDateInstance({
    relative: true
  });

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
  const DataFormatUtils = BaseObject.extend("sap.cux.home.utils.DataFormatUtils", {
    toPriority: function _toPriority(oTask) {
      switch (oTask.criticality) {
        case ValueColor.Error:
          return 1;
        case ValueColor.Critical:
          return 2;
        case ValueColor.Neutral:
          return 3;
        default:
          return 99;
      }
    },
    toTaskPriorityText: function _toTaskPriorityText(sPriority) {
      switch (sPriority) {
        case TaskPriority.VERY_HIGH:
          return "veryHighPriority";
        case TaskPriority.HIGH:
          return "highPriority";
        case TaskPriority.MEDIUM:
          return "mediumPriority";
        case TaskPriority.LOW:
          return "lowPriority";
        default:
          return "nonePriority";
      }
    },
    /**
     * Formats a given date as a relative date and time string.
     *
     * @param {Date} oDate - The input date to format as a relative date and time string.
     * @returns {string} A string representing the input date in a relative date and time format.
     */
    toRelativeDateTime: function _toRelativeDateTime(oDate) {
      return oRelativeDateTimeFormatter.format(new Date(oDate));
    },
    /**
     * Converts a given date to a relative date string.
     *
     * @param {Date} iTimeStamp - The input timestamp to convert to a relative date string.
     * @returns {string} A relative date string with the first letter capitalized.
     */
    toRelativeDate: function _toRelativeDate(iTimeStamp) {
      const sRelativeDate = oRelativeDateFormatter.format(new Date(iTimeStamp));
      return sRelativeDate.charAt(0).toUpperCase() + sRelativeDate.slice(1);
    },
    createBookMarkData: function _createBookMarkData(oBookMark) {
      const finalBookMarkData = {
        title: oBookMark.title || "",
        url: oBookMark.targetURL,
        icon: oBookMark.icon,
        info: oBookMark.info,
        subtitle: oBookMark.subtitle,
        serviceUrl: oBookMark.indicatorDataSource && oBookMark.indicatorDataSource.path,
        numberUnit: oBookMark.numberUnit,
        vizType: oBookMark.vizType,
        vizConfig: oBookMark.vizConfig,
        dataSource: oBookMark.dataSource
      };
      return finalBookMarkData;
    },
    getImportance: function _getImportance(oDataField) {
      let sImportance,
        iImportance = -1;
      if (oDataField["importance"]) {
        sImportance = oDataField["importance"].EnumMember;
        switch (sImportance) {
          case "com.sap.vocabularies.UI.v1.ImportanceType/High":
            iImportance = 1;
            break;
          case "com.sap.vocabularies.UI.v1.ImportanceType/Medium":
            iImportance = 2;
            break;
          case "com.sap.vocabularies.UI.v1.ImportanceType/Low":
            iImportance = 3;
            break;
          default:
            break;
        }
      } else {
        iImportance = 2; // default importance to be considered as Medium
      }
      return iImportance;
    },
    sortCollectionByImportance: function _sortCollectionByImportance(aCollection) {
      return aCollection.sort((oFirstData, oSecondData) => {
        const iFirstDataImportance = this.getImportance(oFirstData);
        const iSecondDataImportance = this.getImportance(oSecondData);
        return iFirstDataImportance < iSecondDataImportance ? -1 : 1;
      });
    },
    getLeanURL: function _getLeanURL(targetURL) {
      const url = targetURL;
      const constructFullUrl = function (query, url) {
        const fullURL = new URL(window.location.href);
        fullURL.search = query;
        fullURL.hash = url;
        return fullURL.toString();
      };

      // append appState only in the case when targetURL starts with "#"
      if ((url || "").charAt(0) !== "#") {
        return url;
      }
      let query = window.location.search;
      if (!query) {
        query = "?sap-ushell-config=lean";
      } else if (query.indexOf("sap-ushell-config=") >= -1) {
        // avoid duplicates: lean FLP opens a link again
        query += "&sap-ushell-config=lean";
      }
      return constructFullUrl(query, url);
    }
  });
  var __exports = new DataFormatUtils();
  return __exports;
});
//# sourceMappingURL=DataFormatUtils-dbg-dbg.js.map
