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

  const SinaObject = ___SinaObject["SinaObject"];
  class SearchResultSetItemAttributeGroupMembership extends SinaObject {
    // _meta: {
    //     properties: {
    //         group: {
    //             required: true
    //         },
    //         attribute: {
    //             required: true
    //         },
    //         metadata: {
    //             required: true
    //         }
    //     }
    // }

    group;
    attribute;
    metadata;
    valueFormatted = ""; // TODO: superfluous?

    constructor(properties) {
      super(properties);
      this.group = properties.group ?? this.group;
      this.attribute = properties.attribute ?? this.attribute;
      this.metadata = properties.metadata ?? this.metadata;
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.SearchResultSetItemAttributeGroupMembership = SearchResultSetItemAttributeGroupMembership;
  return __exports;
});
})();