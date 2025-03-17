/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./SinaObject"], function (___SinaObject) {
  "use strict";

  const SinaObject = ___SinaObject["SinaObject"]; // _meta: {
  //     properties: {
  //         attributeLabel: {
  //             required: false
  //         },
  //         valueLabel: {
  //             required: false
  //         },
  //         userDefined: {
  //             required: false
  //         }
  //     }
  // }
  class Condition extends SinaObject {
    type;
    attributeLabel;
    valueLabel;
    userDefined;
    operator;
    constructor(properties) {
      super({
        sina: properties.sina
      });
      this.attributeLabel = properties.attributeLabel;
      this.valueLabel = properties.valueLabel;
      this.userDefined = properties.userDefined;
    }
    getAttributes() {
      const attributeMap = {};
      this._collectAttributes(attributeMap);
      return Object.keys(attributeMap);
    }
    getConditionsByAttribute(attribute) {
      const filterConditions = [];
      this._collectFilterConditions(attribute, filterConditions);
      return filterConditions;
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.Condition = Condition;
  return __exports;
});
})();