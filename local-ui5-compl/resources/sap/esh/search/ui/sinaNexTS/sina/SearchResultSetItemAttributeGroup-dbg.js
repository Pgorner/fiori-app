/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./SearchResultSetItemAttributeBase"], function (___SearchResultSetItemAttributeBase) {
  "use strict";

  const SearchResultSetItemAttributeBase = ___SearchResultSetItemAttributeBase["SearchResultSetItemAttributeBase"];
  class SearchResultSetItemAttributeGroup extends SearchResultSetItemAttributeBase {
    // _meta: {
    //     properties: {
    //         template: {
    //             required: false
    //         },
    //         attributes: {
    //             required: true,
    //             default: function () {
    //                 return [];
    //             }
    //         }
    //         displayAttributes: {
    //             required: false,
    //             default: function () {
    //                 return [];
    //             }
    //         }
    //     }
    // }

    template;
    attributes = [];
    displayAttributes = [];
    constructor(properties) {
      super(properties);
      this.template = properties.template ?? this.template;
      this.attributes = properties.attributes ?? this.attributes;
      this.displayAttributes = properties.displayAttributes ?? this.displayAttributes;
    }
    toString() {
      let valueFormatted = "",
        pos = 0;
      let match;
      const regex = RegExp("{[a-z]+}", "gi");
      while ((match = regex.exec(this.template)) !== null) {
        valueFormatted += this.template.substring(pos, match.index);
        const attributeName = match[0].slice(1, -1);
        valueFormatted += this.attributes[attributeName] && this.attributes[attributeName].valueFormatted || ""; // TODO: What if this.attributes[attributeName] is a group?
        pos = regex.lastIndex;
      }
      valueFormatted += this.template.substring(pos);
      return this.label + ":" + valueFormatted;
    }
    isAttributeDisplayed(attributeId) {
      if (Array.isArray(this.displayAttributes)) {
        return this.displayAttributes.includes(attributeId);
      }
      return false;
    }
    getSubAttributes() {
      const attributes = [];
      for (const attributeMemberShip of this.attributes) {
        attributes.push(...attributeMemberShip.attribute.getSubAttributes());
      }
      return attributes;
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.SearchResultSetItemAttributeGroup = SearchResultSetItemAttributeGroup;
  return __exports;
});
})();