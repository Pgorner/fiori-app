/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["../../sina/AttributeType", "../../core/errors", "./AttributeTypeFallbackValue", "../../sina/i18n"], function (____sina_AttributeType, ____core_errors, ___AttributeTypeFallbackValue, ____sina_i18n) {
  "use strict";

  const AttributeType = ____sina_AttributeType["AttributeType"];
  const InternalSinaError = ____core_errors["InternalSinaError"];
  const JSONParseError = ____core_errors["JSONParseError"];
  const AttributeTypeFallbackValue = ___AttributeTypeFallbackValue["AttributeTypeFallbackValue"];
  const getText = ____sina_i18n["getText"];
  function convertToSinaDouble(value) {
    if (typeof value === "undefined" || value === null || value === "" || typeof value === "boolean" || Array.isArray(value) || typeof value === "object") {
      return AttributeTypeFallbackValue.Double;
    } else if (typeof value === "string") {
      return parseFloat(value);
    } else if (typeof value === "bigint" || typeof value === "number") {
      return value;
    }
    return AttributeTypeFallbackValue.Double;
  }
  function convertToSinaInteger(value) {
    if (typeof value === "undefined" || value === null || value === "" || typeof value === "boolean" || Array.isArray(value) || typeof value === "object") {
      return AttributeTypeFallbackValue.Integer;
    } else if (typeof value === "string") {
      return parseInt(value, 10);
    } else if (typeof value === "bigint" || typeof value === "number") {
      return value | 0;
    }
    return AttributeTypeFallbackValue.Integer;
  }
  function convertToSinaStringImageUrlImageBlob(attributeType, value) {
    if (typeof value === "undefined" || value === null || value === "") {
      return "";
    } else if (typeof value === "boolean") {
      // "true" or "false" makes no sense for ImageUrl or ImageBlob
      if (attributeType === AttributeType.ImageUrl || attributeType === AttributeType.ImageBlob) {
        return AttributeTypeFallbackValue.ImageUrl;
      }
      return value.toString();
    } else if (Array.isArray(value)) {
      if (attributeType === AttributeType.String) {
        if (value.length === 0) {
          return "";
        } else {
          // support of collection of string or simple objects
          // Limitation: not applicable as filter condition value
          // for internal display use only
          let collectionValue = "";
          for (let i = 0; i < value.length; i++) {
            try {
              value[i] = JSON.stringify(value[i]);
            } catch (e) {
              throw new InternalSinaError({
                message: getText("error.sina.stringifyError", [value[i]]),
                previous: e
              });
            }
            if (i === 0) {
              collectionValue = value[i];
            } else {
              collectionValue = collectionValue + "; " + value[i];
            }
          }
          return collectionValue;
        }
      }
    } else if (typeof value === "object") {
      return AttributeTypeFallbackValue.String; // TODO: validate JSON.stringify(value);
    } else if (typeof value === "string") {
      return value;
    } else if (typeof value === "bigint" || typeof value === "number") {
      return value.toString();
    }
    return AttributeTypeFallbackValue.String;
  }
  function convertToSinaGeoJson(attributeType, value) {
    if (typeof value === "undefined" || value === null || value === "" || typeof value === "boolean" || typeof value === "bigint" || typeof value === "number" || Array.isArray(value)) {
      return AttributeTypeFallbackValue.GeoJson;
    } else if (typeof value === "object") {
      return value;
    } else if (typeof value === "string") {
      try {
        return JSON.parse(value);
      } catch (error) {
        throw new JSONParseError(getText("error.sina.geoJsonParseError", [value]), error);
      }
    }
    return AttributeTypeFallbackValue.GeoJson;
  }
  function convertToSinaDate(value) {
    if (typeof value === "undefined" || value === null || value === "" || typeof value === "boolean" || Array.isArray(value) || typeof value === "object" || typeof value === "bigint" || typeof value === "number") {
      return AttributeTypeFallbackValue.Date;
    } else if (typeof value === "string") {
      return odata2SinaDate(value);
    }
    return AttributeTypeFallbackValue.Date;
  }
  function convertToSinaTime(value) {
    if (typeof value === "undefined" || value === null || value === "" || typeof value === "boolean" || Array.isArray(value) || typeof value === "object" || typeof value === "bigint" || typeof value === "number") {
      return AttributeTypeFallbackValue.Time;
    } else if (typeof value === "string") {
      return odata2SinaTime(value);
    }
    return AttributeTypeFallbackValue.Time;
  }
  function convertToSinaTimestamp(value) {
    if (typeof value === "undefined" || value === null || value === "" || typeof value === "boolean" || Array.isArray(value) || typeof value === "object" || typeof value === "bigint" || typeof value === "number") {
      return AttributeTypeFallbackValue.Timestamp;
    } else if (typeof value === "string") {
      return odata2SinaTimestamp(value);
    }
    return AttributeTypeFallbackValue.Timestamp;
  }
  function odata2SinaDate(value) {
    // odata: YYYY-MM-DD
    // sina: YYYY/MM/DD
    value = value.trim();
    return value.slice(0, 4) + "/" + value.slice(5, 7) + "/" + value.slice(8, 10);
    //return value.slice(0, 4) + '/' + value.slice(4, 6) + '/' + value.slice(6, 8);
  }
  function odata2SinaTime(value) {
    // odata: hh:mm:ss
    // sina: hh:mm:ss
    value = value.trim();
    return value;
    //            if(value.indexOf(":") === 2){
    //                return value;
    //            }else{
    //                return value.slice(0, 2) + ':' + value.slice(2, 4) + ':' + value.slice(4, 6);
    //            }
  }
  function odata2SinaTimestamp(value) {
    // odata:2017-12-31T23:59:59.0000000Z
    // sina: Date object of UTC
    return new Date(Date.parse(value));

    /*
    value = value.trim();
     var year, month, day, hour, minute, seconds;
    year = parseInt(value.slice(0, 4), 10);
    month = parseInt(value.slice(5, 7), 10);
    day = parseInt(value.slice(8, 10), 10);
    hour = parseInt(value.slice(11, 13), 10);
    minute = parseInt(value.slice(14, 16), 10);
    seconds = parseInt(value.slice(17, 19), 10);
     return new Date(Date.UTC(year, month - 1, day, hour, minute, seconds));
    */
  }
  var __exports = {
    __esModule: true
  };
  __exports.convertToSinaDouble = convertToSinaDouble;
  __exports.convertToSinaInteger = convertToSinaInteger;
  __exports.convertToSinaStringImageUrlImageBlob = convertToSinaStringImageUrlImageBlob;
  __exports.convertToSinaGeoJson = convertToSinaGeoJson;
  __exports.convertToSinaDate = convertToSinaDate;
  __exports.convertToSinaTime = convertToSinaTime;
  __exports.convertToSinaTimestamp = convertToSinaTimestamp;
  __exports.odata2SinaDate = odata2SinaDate;
  __exports.odata2SinaTime = odata2SinaTime;
  __exports.odata2SinaTimestamp = odata2SinaTimestamp;
  return __exports;
});
})();