/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../sina/AttributeSemanticsType", "../sina/SearchResultSetItemAttribute", "../sina/SearchResultSetItemAttributeGroup", "../sina/i18n", "./errors"], function (___sina_AttributeSemanticsType, ___sina_SearchResultSetItemAttribute, ___sina_SearchResultSetItemAttributeGroup, ___sina_i18n, ___errors) {
  "use strict";

  /* eslint-disable no-useless-escape */
  const AttributeSemanticsType = ___sina_AttributeSemanticsType["AttributeSemanticsType"];
  const SearchResultSetItemAttribute = ___sina_SearchResultSetItemAttribute["SearchResultSetItemAttribute"];
  const SearchResultSetItemAttributeGroup = ___sina_SearchResultSetItemAttributeGroup["SearchResultSetItemAttributeGroup"];
  const getText = ___sina_i18n["getText"];
  const NoJSONDateError = ___errors["NoJSONDateError"];
  const TimeOutError = ___errors["TimeOutError"];
  function hasOwnProperty(obj, prop) {
    return Object.prototype.hasOwnProperty.apply(obj, prop);
  }
  function timeoutDecorator(originalFunction, timeout) {
    const decoratedFunction = function (...args) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that = this;
      return new Promise(function (resolve, reject) {
        let outTimed = false;
        const timer = setTimeout(function () {
          outTimed = true;
          reject(new TimeOutError());
        }, timeout);
        return originalFunction.apply(that, args).then(function (response) {
          // success
          if (outTimed) {
            return;
          }
          clearTimeout(timer);
          resolve(response);
        }, function (error) {
          // error
          if (outTimed) {
            return;
          }
          clearTimeout(timer);
          reject(error);
        });
      });
    };
    return decoratedFunction;
  }
  function refuseOutdatedResponsesDecorator(originalFunction) {
    let maxRequestId = 0;
    const decoratedFunction = function (...args) {
      const requestId = ++maxRequestId;
      return originalFunction.apply(this, args).then(function (response) {
        // success
        return new Promise(function (resolve) {
          if (requestId !== maxRequestId) {
            return; // --> ignore
          }
          resolve(response); // --> forward
        });
      }, function (error) {
        // error
        return new Promise(function (resolve, reject) {
          if (requestId !== maxRequestId) {
            return; // --> ignore
          }
          reject(error); // --> forward
        });
      });
    };
    decoratedFunction.abort = function () {
      ++maxRequestId;
    };
    return decoratedFunction;
  }
  function getUrlParameter(name, url) {
    if (!url) {
      if (typeof window === "undefined") {
        return null;
      }
      url = window.location.href;
    }
    name = escapeRegExp(name);
    const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) {
      return null;
    }
    if (!results[2]) {
      return "";
    }
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }
  function filterString(text, removeStrings) {
    for (let i = 0; i < removeStrings.length; ++i) {
      const removeString = removeStrings[i];
      let index = 0;
      while (index >= 0) {
        index = text.indexOf(removeString);
        if (index >= 0) {
          text = text.slice(0, index) + text.slice(index + removeString.length);
        }
      }
    }
    return text;
  }
  function generateTimestamp() {
    const pad = function (num, size) {
      const s = "000000000" + num;
      return s.substr(s.length - size);
    };
    const d = new Date();
    return "" + d.getUTCFullYear() + pad(d.getUTCMonth() + 1, 2) + pad(d.getUTCDate(), 2) + pad(d.getUTCHours(), 2) + pad(d.getUTCMinutes(), 2) + pad(d.getUTCSeconds(), 2) + pad(d.getUTCMilliseconds(), 3);
  }
  class DelayedConsumer {
    timeDelay;
    consumer;
    consumerContext;
    objects;
    constructor(properties) {
      properties = properties || {};
      this.timeDelay = properties.timeDelay || 1000;
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      this.consumer = properties.consumer || function () {};
      this.consumerContext = properties.consumerContext || null;
      this.objects = [];
    }
    add(obj) {
      this.objects.push(obj);
      if (this.objects.length === 1) {
        setTimeout(this.consume.bind(this), this.timeDelay);
      }
    }
    consume() {
      this.consumer.apply(this.consumerContext, [this.objects]);
      this.objects = [];
    }
  }
  function dateToJson(date) {
    return {
      type: "Timestamp",
      value: date.toJSON()
    };
  }
  function dateFromJson(jsonDate) {
    if (jsonDate.type !== "Timestamp") {
      throw new NoJSONDateError(getText("error.sina.noTimestampJsonDateError", [jsonDate]));
    }
    return new Date(jsonDate.value);
  }
  function addPotentialNavTargets(resultSet) {
    if (resultSet.items) {
      //not avilable with sample provider
      const items = resultSet.items;
      for (let i = 0; i < items.length; i++) {
        let item = items[i];
        // process geo data
        item = addGeoDataIfAvailable(item);
        // process attributes
        const attributes = item.detailAttributes;
        for (let j = 0; j < attributes.length; j++) {
          const attribute = attributes[j];
          addPotentialNavTargetsToAttribute(attribute);
        }
      }
    }
    return resultSet;
  }
  function addPotentialNavTargetsToAttribute(attribute) {
    if (attribute instanceof SearchResultSetItemAttribute) {
      addPotentialNavTargetsToAttributeSimple(attribute);
    } else if (attribute instanceof SearchResultSetItemAttributeGroup) {
      addPotentialNavTargetsToAttributeGroup(attribute);
    }
  }
  function addPotentialNavTargetsToAttributeGroup(attribute) {
    // simplified not recursive algorithm:
    // - groups are expanded only one level
    // - for group children attributes we just add navtargets for @semantics.url annotation
    for (const attributeMembership of attribute.attributes) {
      const attribute = attributeMembership.attribute;
      if (!(attribute instanceof SearchResultSetItemAttribute)) {
        continue;
      }
      const metadata = attribute.metadata;
      const sina = attribute.sina;
      const value = attribute.value;
      if (metadata.semantics == AttributeSemanticsType.HTTPURL) {
        attribute.setDefaultNavigationTarget(sina.createNavigationTarget({
          text: value,
          targetUrl: value,
          target: "_blank"
        }));
      }
    }
  }
  function addPotentialNavTargetsToAttributeSimple(attribute) {
    const sina = attribute.sina;
    const value = attribute.value;
    const metadata = attribute.metadata;
    if (typeof value === "string" && attribute.metadata.type !== "ImageUrl") {
      const emails = value.match(/^[^\0-\x20,:;<>@\[\\\]^_`]+@[^\0-,.-@\[\\\]^_`\{\|\}~]+\.[^\0-,.-@\[\\\]^_`\{\|\}~]+$/g);
      const url = value.match(/^https?:\/\/(?=[^\/])\S+$/gi);
      if (metadata.semantics == AttributeSemanticsType.EmailAddress) {
        attribute.setDefaultNavigationTarget(sina.createNavigationTarget({
          text: value,
          targetUrl: "mailto:" + value
        }));
      } else if (metadata.semantics == AttributeSemanticsType.PhoneNr) {
        attribute.setDefaultNavigationTarget(sina.createNavigationTarget({
          text: value,
          targetUrl: "tel:" + value
        }));
      } else if (metadata.semantics == AttributeSemanticsType.HTTPURL) {
        attribute.setDefaultNavigationTarget(sina.createNavigationTarget({
          text: value,
          targetUrl: value,
          target: "_blank"
        }));
      } else if (emails !== null && emails.length === 1) {
        attribute.setDefaultNavigationTarget(sina.createNavigationTarget({
          text: emails[0],
          targetUrl: "mailto:" + emails[0]
        }));
      } else if (url !== null && url[0].match(/\w\w\w/) !== null) {
        attribute.setDefaultNavigationTarget(sina.createNavigationTarget({
          text: url[0],
          targetUrl: url[0],
          target: "_blank"
        }));
      }
    }
  }
  function removePureAdvancedSearchFacets(resultSet) {
    const dataSource = resultSet.sina.getDataSource(resultSet.query.filter.dataSource.id);
    for (let i = 0; i < resultSet.facets.length; i++) {
      const attributeId = resultSet.facets[i].query.dimension;
      const attributeMetaData = dataSource.attributeMetadataMap[attributeId];
      if (attributeMetaData && attributeMetaData.usage.AdvancedSearch && attributeMetaData.usage.Facet === undefined) {
        resultSet.facets.splice(i, 1);
        i = i - 1;
      }
    }
    return resultSet;
  }
  function isMapsAttribute(attribute, returnOnlyBool, i) {
    let res = false;
    let lat, lon, latIndex, lonIndex, latAttribName, lonAttribName;
    const name = attribute.id;
    const val = attribute.value;
    if (name.match(/latitude/i) !== null) {
      if (!isNaN(val)) {
        latAttribName = name;
        lat = val;
        latIndex = i;
      }
      res = true;
    } else if (name.match(/longitude/i) !== null) {
      if (!isNaN(val)) {
        lonAttribName = name;
        lon = val;
        lonIndex = i;
      }
      res = true;
    } else if (name.match(/LOC_4326/)) {
      lonIndex = i;
      latIndex = i;
      const oLoc4326 = JSON.parse(val);
      const aCoordinates = oLoc4326.coordinates;
      if (aCoordinates && aCoordinates.length > 1) {
        lon = aCoordinates[0];
        lat = aCoordinates[1];
      }
      res = true;
    }
    if (returnOnlyBool === undefined || returnOnlyBool === true) {
      return res;
    }
    return {
      lat: lat,
      lon: lon,
      latAttribName: latAttribName,
      lonAttribName: lonAttribName,
      latIndex: latIndex,
      lonIndex: lonIndex
    };
  }
  function addGeoDataIfAvailable(itemData) {
    //augment with new geodata attribute
    let res, lat, lon, dataSource, latIndex, lonIndex;
    const attributes = itemData.detailAttributes;
    for (let i = 0; i < attributes.length; i++) {
      res = isMapsAttribute(attributes[i], false, i);
      lat = res.lat ? res.lat : lat;
      lon = res.lon ? res.lon : lon;
      latIndex = res.latIndex ? res.latIndex : latIndex;
      lonIndex = res.lonIndex ? res.lonIndex : lonIndex;
      if (lat && lon) {
        break;
      }
    }
    if (lat && lon) {
      //remove lat and long from searchRsultITems

      if (latIndex === lonIndex) {
        attributes.splice(latIndex, 1);
      } else if (latIndex > lonIndex) {
        attributes.splice(latIndex, 1);
        attributes.splice(lonIndex, 1);
      } else {
        attributes.splice(lonIndex, 1);
        attributes.splice(latIndex, 1);
      }
      const newMetadata = {
        sina: itemData.sina,
        type: "GeoJson",
        id: "LOC_4326",
        label: "LOC_4326",
        isCurrency: false,
        IsBoolean: false,
        IsKey: false,
        IsSortable: true,
        isUnitOfMeasure: false,
        semanticObjectType: [],
        usage: {
          Map: "coordinates"
        }
      };
      //creaate new attribute and check whtether geojson metadata exists
      const valStr = '{ "type": "Point", "coordinates": [' + lon + ", " + lat + ", 0] }";
      const newAttribute = {
        id: "LOC_4326",
        label: "LOC_4326",
        isHighlighted: false,
        value: valStr,
        valueFormatted: valStr,
        valueHighlighted: itemData.sina,
        metadata: newMetadata,
        sina: itemData.sina
      };
      attributes.push(newAttribute);
      dataSource = itemData.sina.getDataSource(itemData.dataSource.id);
      if (!dataSource.attributeMetadataMap.LOC_4326) {
        dataSource.attributesMetadata.push(newMetadata);
        dataSource.attributeMetadataMap.LOC_4326 = newMetadata;
      } else {
        dataSource.attributeMetadataMap.LOC_4326.type = "GeoJson";
        dataSource.attributeMetadataMap.LOC_4326.usage = {
          Map: "coordinates"
        };
      }
    }
    return itemData;
  }
  function cacheDecorator(originalFunction) {
    const map = {};
    return function (id) {
      if (Object.prototype.hasOwnProperty.call(map, id)) {
        return map[id];
      }
      const value = originalFunction.apply(this, [id]);
      map[id] = value;
      return value;
    };
  }
  function escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  }
  function evaluateTemplate(template, obj) {
    const placeholderRegExp = new RegExp("{{([^{}]*)}}");
    const getProperty = function (template) {
      const match = placeholderRegExp.exec(template);
      if (!match) {
        return null;
      }
      return match[1];
    };
    const replaceProperty = function (template, property, value) {
      const propertyRegExp = new RegExp("{{" + escapeRegExp(property) + "}}", "g");
      template = template.replace(propertyRegExp, value);
      return template;
    };
    const execute = function (template) {
      const property = getProperty(template);
      if (!property) {
        return template;
      }
      template = replaceProperty(template, property, obj[property]);
      return execute(template);
    };
    return execute(template);
  }
  const extractRegExp = new RegExp("<b>(.*?)<\\/b>", "g");
  function extractHighlightedTerms(text) {
    let match;
    const result = [];
    do {
      match = extractRegExp.exec(text);
      if (match) {
        result.push(match[1]);
      }
    } while (match);
    return result;
  }
  function appendRemovingDuplicates(list1, list2) {
    for (let i = 0; i < list2.length; ++i) {
      const element = list2[i];
      if (list1.indexOf(element) < 0) {
        list1.push(element);
      }
    }
  }
  const reservedCharacters = ["\\", "-", "(", ")", "~", "^", "?", '"', ":", "'", "[", "]"];
  const reservedWords = ["AND", "OR", "NOT"];
  const reservedCharacters4FilterCondition = ["\\", '"', "*", "?", "'"];
  function replaceAll(original, search, replacement) {
    return original.split(search).join(replacement);
  }
  function escapeQuery(query) {
    let escapedQuery = query.trim();
    for (const specialCharacter of reservedCharacters) {
      if (specialCharacter === "'") {
        escapedQuery = replaceAll(escapedQuery, specialCharacter, "''");
      } else {
        escapedQuery = replaceAll(escapedQuery, specialCharacter, "\\" + specialCharacter);
      }
    }
    for (const specialWord of reservedWords) {
      if (escapedQuery === specialWord) {
        escapedQuery = '"' + specialWord + '"';
      }
      if (escapedQuery.startsWith(specialWord + " ")) {
        escapedQuery = '"' + specialWord + '" ' + escapedQuery.substring(specialWord.length + 1);
      }
      if (escapedQuery.endsWith(" " + specialWord)) {
        escapedQuery = escapedQuery.substring(0, escapedQuery.length - (specialWord.length + 1)) + ' "' + specialWord + '"';
      }
      escapedQuery = replaceAll(escapedQuery, " " + specialWord + " ", ' "' + specialWord + '" ');
    }
    if (escapedQuery === "") {
      escapedQuery = "*";
    }
    return escapedQuery;
  }
  function escapeFilterCondition(query) {
    let escapedQuery = query.trim();
    for (const specialCharacter of reservedCharacters4FilterCondition) {
      if (specialCharacter === "'") {
        escapedQuery = replaceAll(escapedQuery, specialCharacter, "''");
      } else {
        escapedQuery = replaceAll(escapedQuery, specialCharacter, "\\" + specialCharacter);
      }
    }
    if (escapedQuery === "") {
      escapedQuery = "*";
    }
    return escapedQuery;
  }
  var __exports = {
    __esModule: true
  };
  __exports.hasOwnProperty = hasOwnProperty;
  __exports.timeoutDecorator = timeoutDecorator;
  __exports.refuseOutdatedResponsesDecorator = refuseOutdatedResponsesDecorator;
  __exports.getUrlParameter = getUrlParameter;
  __exports.filterString = filterString;
  __exports.generateTimestamp = generateTimestamp;
  __exports.DelayedConsumer = DelayedConsumer;
  __exports.dateToJson = dateToJson;
  __exports.dateFromJson = dateFromJson;
  __exports.addPotentialNavTargets = addPotentialNavTargets;
  __exports.removePureAdvancedSearchFacets = removePureAdvancedSearchFacets;
  __exports.isMapsAttribute = isMapsAttribute;
  __exports.addGeoDataIfAvailable = addGeoDataIfAvailable;
  __exports.cacheDecorator = cacheDecorator;
  __exports.escapeRegExp = escapeRegExp;
  __exports.evaluateTemplate = evaluateTemplate;
  __exports.extractRegExp = extractRegExp;
  __exports.extractHighlightedTerms = extractHighlightedTerms;
  __exports.appendRemovingDuplicates = appendRemovingDuplicates;
  __exports.escapeQuery = escapeQuery;
  __exports.escapeFilterCondition = escapeFilterCondition;
  return __exports;
});
})();