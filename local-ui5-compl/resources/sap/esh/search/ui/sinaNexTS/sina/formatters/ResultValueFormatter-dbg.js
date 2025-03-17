/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./Formatter", "../AttributeType", "../../sina/util", "../../core/Log"], function (___Formatter, ___AttributeType, ____sina_util, ____core_Log) {
  "use strict";

  /* eslint-disable @typescript-eslint/no-this-alias */
  const Formatter = ___Formatter["Formatter"];
  const AttributeType = ___AttributeType["AttributeType"];
  const stringifyValue = ____sina_util["stringifyValue"];
  const Log = ____core_Log["Log"];
  class ResultValueFormatter extends Formatter {
    sina;
    ui5NumberFormat;
    ui5DateFormat;
    log = (() => new Log("ResultvalueFormatter"))();
    constructor(properties) {
      super();
      this.ui5NumberFormat = properties?.ui5NumberFormat || undefined;
      this.ui5DateFormat = properties?.ui5DateFormat || undefined;
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    initAsync() {
      return Promise.resolve();
    }
    format(resultSet) {
      return this._formatItemsInUI5Form(resultSet);
    }
    formatAsync(resultSet) {
      resultSet = this._formatItemsInUI5Form(resultSet);
      return Promise.resolve(resultSet);
    }
    _formatItemsInUI5Form(resultSet) {
      const that = this;
      that.sina = resultSet.sina;
      resultSet.items.forEach(function (item) {
        that._formatItemInUI5Form(item);
      });
      return resultSet;
    }
    _formatItemInUI5Form(item) {
      const that = this;
      that.sina = item.sina;
      if (that.sina.getDataSource(item.dataSource.id) === undefined || that.sina.getDataSource(item.dataSource.id).attributeMetadataMap === undefined || Object.keys(that.sina.getDataSource(item.dataSource.id).attributeMetadataMap).length === 0) {
        return;
      }
      item.titleAttributes.forEach(function (attribute) {
        that.formatAttribute(attribute);
      });
      item.titleDescriptionAttributes.forEach(function (attribute) {
        that.formatAttribute(attribute);
      });
      item.detailAttributes.forEach(function (attribute) {
        that.formatAttribute(attribute);
      });

      // attributes are stored in following lists:
      // - item.titleAttributes (sub-set)
      // - item.titleDescriptionAttributes (sub-set)
      // - item.detailAttributes (sub-set)
      // - item.attributes (mother-set)
      // - item.attributesMap (mother-set)
      // Bug: some attributes are not pass-by-reference, format in one list, not effects others.
      // Example: additional whyfound attributes created by whyfoundprocessor
      // Workaround: format every list.

      item.attributes.forEach(function (attribute) {
        that.formatAttribute(attribute);
      });
    }

    // attribute could be single attribute or group attribute
    formatAttribute(attribute) {
      const that = this;

      // attribute "HASHIERARCHYNODECHILD" has undefined metadata
      if (attribute?.metadata?.type === undefined) {
        return;
      }
      if (attribute.metadata.type && attribute.metadata.type === AttributeType.Group) {
        // group attributes
        for (let i = 0; i < attribute.attributes.length; i++) {
          that.formatAttribute(attribute.attributes[i].attribute);
        }
      } else {
        // single attribute
        that.formatSingleAttribute(attribute);
      }
    }
    formatSingleAttribute(attribute) {
      attribute.valueFormatted = this.formatValue(attribute);
      if (attribute.valueHighlighted === undefined || attribute.valueHighlighted?.length === 0) {
        attribute.valueHighlighted = attribute.valueFormatted;
        if (attribute.isHighlighted) {
          // add client-side highlighted value
          attribute.valueHighlighted = "<b>" + attribute.valueHighlighted + "</b>";
        }
      }
    }
    formatValue(attribute) {
      if (typeof attribute?.valueFormatted === "string") {
        return attribute.valueFormatted;
      }
      return this.formatValueByUI5(attribute);
    }
    formatValueByUI5(attribute) {
      try {
        let formattedValue = "";
        let date = undefined;
        switch (attribute.metadata.type) {
          case AttributeType.Integer:
            formattedValue = this.ui5NumberFormat.getIntegerInstance().format(attribute.value);
            break;
          case AttributeType.Double:
            formattedValue = this.ui5NumberFormat.getFloatInstance().format(attribute.value);
            break;
          case AttributeType.Timestamp:
            // format: UTC date object -> time stamp string in time zone
            formattedValue = "";
            date = attribute.value;
            if (date instanceof Date && !isNaN(date.getTime())) {
              formattedValue = this.ui5DateFormat.getDateTimeInstance().format(date);
            }

            // attribute.value:                         formattedValue:
            // null                                     -> ""
            // undefined                                -> ""
            // ""                                       -> ""
            // new Date("2018-12-33T23:00:00.0000000Z") -> ""
            // new Date("2018-03-22T23:00:00.0000000Z") -> "2018.03.23, 00:00:00"
            // new Date("2018-03-22T23:00:00.000000Z")) -> "2018.03.23, 00:00:00"
            // new Date("2018-03-22,23:00:00.000"))     -> "2018.03.22, 23:00:00"
            // new Date("2018-03-2223:00:00.000000Z"))  -> ""
            break;
          case AttributeType.Date:
            // format: "YYYY/MM/DD" -> "DD.MM.YYYY" in UTC
            formattedValue = "";
            if (typeof attribute.value === "string") {
              date = new Date(attribute.value.replace(/\//g, "-")); // "YYYY-MM-DD" is ISO 8601 format standard, "YYYY/MM/DD" NOT
              // new Date("2018-12-31") = new Date("2018-12-31T00:00:00.0000000Z")
              if (date instanceof Date && !isNaN(date.getTime())) {
                formattedValue = this.ui5DateFormat.getDateInstance({
                  UTC: true
                }).format(date);
              }
            }

            // attribute.value:                         formattedValue:
            // null                                     -> ""
            // undefined                                -> ""
            // ""                                       -> ""
            // "2018-02-22"                             -> "2018.02.22"
            // "2018-02-2"                              -> "2018.02.01"
            // "2018-02-42"                             -> ""
            // "18-02-42"                               -> ""
            break;
          case AttributeType.Time:
            // format: "hh:mm:ss" -> "hh.mm.ss AM" in UTC
            formattedValue = "";
            if (typeof attribute.value === "string") {
              date = new Date("1970-01-01T" + attribute.value + ".0000000Z");
              if (date instanceof Date && !isNaN(date.getTime())) {
                formattedValue = this.ui5DateFormat.getTimeInstance({
                  UTC: true
                }).format(date);
              }
            }

            // attribute.value:                         formattedValue:
            // null                                     -> ""
            // undefined                                -> ""
            // ""                                       -> ""
            // "13:42:59"                               -> "13:42:59"
            // "33:42:59"                               -> ""
            break;
          default:
            formattedValue = stringifyValue(attribute?.value);
        }
        return formattedValue;
      } catch (error) {
        this.log.warn("Error in formatting value: " + error);
        return stringifyValue(attribute?.value);
      }
    }
    formatValueByPlainJS(attribute) {
      return stringifyValue(attribute.value);
      // stringifyValue convert value to string by checking typeof, NOT metadata type
      // value could have different type from metadata type due to server mistake
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.ResultValueFormatter = ResultValueFormatter;
  return __exports;
});
})();