/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../../sina/SearchResultSetItemAttributeGroup"], function (____sina_SearchResultSetItemAttributeGroup) {
  "use strict";

  const SearchResultSetItemAttributeGroup = ____sina_SearchResultSetItemAttributeGroup["SearchResultSetItemAttributeGroup"];
  class WhyfoundProcessor {
    sina;
    constructor(sina) {
      this.sina = sina;
    }
    processRegularWhyFoundAttributes(attributeName, structuredAttribute, whyFounds, metadata) {
      let attrWhyFound;

      // Process whyfound attributes which belongs to title, title description and detail
      for (const attributeNameWhyfound in whyFounds) {
        if (attributeNameWhyfound === attributeName && whyFounds[attributeNameWhyfound][0]) {
          // replace attribue value with whyfound value
          attrWhyFound = whyFounds[attributeNameWhyfound][0];
          if (metadata.usage.Title || metadata.usage.TitleDescription || metadata.usage.Detail) {
            delete whyFounds[attributeNameWhyfound];
          }
        }
      }
      attrWhyFound = this.calculateValueHighlighted(structuredAttribute, metadata, attrWhyFound);
      return attrWhyFound;
    }

    // Precondition: attribute group has been prepared in itemPostParser
    // If a remaining whyfound attribute (after the regular processing above) is no displayAttribute in a attribute group
    // it's either not modeled for display or just a request attribute.
    // Add it to detail attributes and will be displayed in case of no hit in other displayed attributes.
    async processAdditionalWhyfoundAttributes(whyFounds, searchResultSetItem) {
      // Check whether there is still whyfoundattr remaining
      // If yes, it means hits in request attributes
      // Convert it to attribute and concat it to detailAttributes
      // No display order normally, candidates for the additional line for whyfounds
      for (const restWhyfoundAttribute in whyFounds) {
        if (whyFounds[restWhyfoundAttribute] && whyFounds[restWhyfoundAttribute][0]) {
          const metadata = searchResultSetItem.dataSource.getAttributeMetadata(restWhyfoundAttribute);
          const attributeId = metadata.id || restWhyfoundAttribute;
          const valueTemp = whyFounds[restWhyfoundAttribute][0];
          let valueFormattedTemp = "";
          if (searchResultSetItem.attributesMap[restWhyfoundAttribute]) {
            valueFormattedTemp = searchResultSetItem.attributesMap[restWhyfoundAttribute].valueFormatted;
            valueFormattedTemp = typeof valueFormattedTemp === "string" ? valueFormattedTemp : JSON.stringify(valueFormattedTemp);
          }
          const valueHighlightedTemp = typeof valueTemp === "string" ? valueTemp : JSON.stringify(valueTemp);
          const wAttribute = this.sina._createSearchResultSetItemAttribute({
            id: attributeId,
            label: metadata.label || restWhyfoundAttribute,
            value: "",
            valueFormatted: valueFormattedTemp,
            valueHighlighted: valueHighlightedTemp,
            isHighlighted: true,
            metadata: metadata
          });
          const originalAttribute = searchResultSetItem.attributes.find(attr => attr.id === attributeId);

          // If the attribute is already part of display attribute of a group
          // it unnecessary to add it to detail attributes
          if (searchResultSetItem.detailAttributes.find(attr => attr instanceof SearchResultSetItemAttributeGroup && attr.isAttributeDisplayed(attributeId)) === undefined) {
            // If wAttribute is not in the original attributes, e.g. a request attribute, just add it
            if (originalAttribute === undefined) {
              searchResultSetItem.detailAttributes.push(wAttribute);
              searchResultSetItem.attributes.push(wAttribute);
              searchResultSetItem.attributesMap[attributeId] = wAttribute;
            } else if (originalAttribute.isHighlighted === true) {
              // Already highlighted originalAttribute
              searchResultSetItem.detailAttributes.push(originalAttribute);
            } else {
              // If wAttribute is already in the list of original attributes and not marked as highlighted yet,
              // replace valueHighlighted of originalAttribute from wAttribute and set isHighlighted to true
              originalAttribute.valueHighlighted = wAttribute.valueHighlighted;
              originalAttribute.isHighlighted = true;
              searchResultSetItem.detailAttributes.push(originalAttribute);
            }
          }
          delete whyFounds[restWhyfoundAttribute];
        }
      }
      return searchResultSetItem;
    }
    _getFirstItemIfArray(value) {
      if (Array.isArray(value)) {
        value = value[0];
      }
      return value;
    }

    // valueHiglighted  =
    // multiline: true => input.highlighted | input.snippet | why found
    // multiline: false => input.snippet | input.highlighted | why found
    calculateValueHighlighted(structuredAttribute, metadata, attrWhyFound) {
      const identifierHighlight = "com.sap.vocabularies.Search.v1.Highlighted";
      const identifierSnippet = "com.sap.vocabularies.Search.v1.Snippets";
      let value = "";
      if (metadata.format === "MultilineText") {
        value = structuredAttribute[identifierHighlight];
        if (value) {
          return this._getFirstItemIfArray(value);
        }
        value = structuredAttribute[identifierSnippet];
        if (value) {
          return this._getFirstItemIfArray(value);
        }
        return attrWhyFound;
      }
      value = structuredAttribute[identifierSnippet];
      if (value) {
        return this._getFirstItemIfArray(value);
      }
      value = structuredAttribute[identifierHighlight];
      if (value) {
        return this._getFirstItemIfArray(value);
      }
      return this._getFirstItemIfArray(attrWhyFound);
    }
    calIsHighlighted(attrWhyFound) {
      if (typeof attrWhyFound === "string" && attrWhyFound.length > 0 && attrWhyFound.indexOf("<b>") > -1 && attrWhyFound.indexOf("</b>") > -1) {
        return true;
      }

      // Must not come from Snippets and Highlighted
      if (Array.isArray(attrWhyFound) && attrWhyFound.length > 0) {
        return true;
      }
      return false;
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.WhyfoundProcessor = WhyfoundProcessor;
  return __exports;
});
})();