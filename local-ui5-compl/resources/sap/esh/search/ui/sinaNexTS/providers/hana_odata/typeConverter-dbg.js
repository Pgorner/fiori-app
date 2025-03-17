/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../../sina/util", "../../sina/AttributeType", "../../core/errors", "../tools/TypeConverterUtil"], function (sinaUtil, ____sina_AttributeType, ____core_errors, ___tools_TypeConverterUtil) {
  "use strict";

  const AttributeType = ____sina_AttributeType["AttributeType"];
  const UnknownAttributeTypeError = ____core_errors["UnknownAttributeTypeError"];
  const convertToSinaDouble = ___tools_TypeConverterUtil["convertToSinaDouble"];
  const convertToSinaInteger = ___tools_TypeConverterUtil["convertToSinaInteger"];
  const convertToSinaStringImageUrlImageBlob = ___tools_TypeConverterUtil["convertToSinaStringImageUrlImageBlob"];
  const convertToSinaGeoJson = ___tools_TypeConverterUtil["convertToSinaGeoJson"];
  const convertToSinaDate = ___tools_TypeConverterUtil["convertToSinaDate"];
  const convertToSinaTime = ___tools_TypeConverterUtil["convertToSinaTime"];
  const convertToSinaTimestamp = ___tools_TypeConverterUtil["convertToSinaTimestamp"];
  function sina2Odata(attributeType, value, context) {
    switch (attributeType) {
      case AttributeType.Double:
        return value.toString();
      case AttributeType.Integer:
        return value.toString();
      case AttributeType.String:
        return sina2OdataString(value, context);
      case AttributeType.ImageUrl:
      case AttributeType.ImageBlob:
        return value;
      case AttributeType.GeoJson:
        return JSON.stringify(value);
      case AttributeType.Date:
        return sina2OdataDate(value);
      case AttributeType.Time:
        return sina2OdataTime(value);
      case AttributeType.Timestamp:
        return sina2OdataTimestamp(value);
      default:
        throw new UnknownAttributeTypeError(attributeType);
    }
  }
  function sina2OdataString(value, context) {
    return sinaUtil.convertOperator2Wildcards(value, context?.operator);
  }
  function odata2Sina(attributeType, value) {
    switch (attributeType) {
      case AttributeType.Double:
        return convertToSinaDouble(value);
      case AttributeType.Integer:
        return convertToSinaInteger(value);
      case AttributeType.String:
      case AttributeType.ImageUrl:
      case AttributeType.ImageBlob:
        return convertToSinaStringImageUrlImageBlob(attributeType, value);
      case AttributeType.GeoJson:
        return convertToSinaGeoJson(attributeType, value);
      case AttributeType.Date:
        return convertToSinaDate(value);
      case AttributeType.Time:
        return convertToSinaTime(value);
      case AttributeType.Timestamp:
        return convertToSinaTimestamp(value);
      default:
        throw new UnknownAttributeTypeError(attributeType);
    }
  }
  function convertValueToString(value) {
    if (!value) {
      return "";
    } else if (typeof value === "string") {
      return value;
    } else if (typeof value === "boolean" || typeof value === "number" || typeof value === "bigint") {
      return value.toString();
    } else if (value instanceof Date) {
      return value.toLocaleDateString();
    } else if (typeof value === "object") {
      return JSON.stringify(value);
    } else {
      return "";
    }
  }
  function sina2OdataTimestamp(value) {
    // odata:2017-12-31T23:59:59.0000000Z
    // sina: Date object

    if (typeof value === "string") {
      if (value.length === 0) {
        return "";
      }
      if (value === "$$now$$") {
        value = new Date();
      }
    }
    const year = value.getUTCFullYear();
    const month = value.getUTCMonth() + 1;
    const day = value.getUTCDate();
    const hour = value.getUTCHours();
    const minute = value.getUTCMinutes();
    const seconds = value.getUTCSeconds();

    // Why not use Date.toISOString()?
    const result = addLeadingZeros(year.toString(), 4) + "-" + addLeadingZeros(month.toString(), 2) + "-" + addLeadingZeros(day.toString(), 2) + "T" + addLeadingZeros(hour.toString(), 2) + ":" + addLeadingZeros(minute.toString(), 2) + ":" + addLeadingZeros(seconds.toString(), 2) + "Z";
    // this.addLeadingZeros(microseconds.toString(), 7) + 'Z'; // According to oData standard, it should be omitted

    return result;
  }
  function sina2OdataTime(value) {
    // odata: hh:mm:ss
    // sina: hh:mm:ss
    return value;
    //            return value.slice(0, 2) + value.slice(3, 5) + value.slice(6, 8);
  }
  function sina2OdataDate(value) {
    // odata: YYYY-MM-DD
    // sina: YYYY/MM/DD
    if (value.length === 0) {
      return "";
    }
    return value.slice(0, 4) + "-" + value.slice(5, 7) + "-" + value.slice(8, 10);
    //return value.slice(0, 4) + value.slice(5, 7) + value.slice(8, 10);
  }
  function addLeadingZeros(value, length) {
    return "00000000000000".slice(0, length - value.length) + value;
  }
  var __exports = {
    __esModule: true
  };
  __exports.sina2Odata = sina2Odata;
  __exports.sina2OdataString = sina2OdataString;
  __exports.odata2Sina = odata2Sina;
  __exports.convertValueToString = convertValueToString;
  __exports.sina2OdataTimestamp = sina2OdataTimestamp;
  __exports.sina2OdataTime = sina2OdataTime;
  __exports.sina2OdataDate = sina2OdataDate;
  __exports.addLeadingZeros = addLeadingZeros;
  return __exports;
});
})();