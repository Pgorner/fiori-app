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
  class AttributeMetadataBase extends SinaObject {
    // _meta: {
    //     properties: {
    //         id: {
    //             required: true
    //         },
    //         usage: {
    //             required: true
    //         },
    //         displayOrder: {
    //             required: false
    //         },
    //         groups: { // array of AttributeGroupMembership instances
    //             required: false,
    //             default: function () {
    //                 return [];
    //             }
    //         }
    //     }
    // }

    id;
    usage;
    displayOrder;
    groups = [];
    type;
    format;
    semantics;
    constructor(properties) {
      super(properties);
      this.id = properties.id ?? this.id;
      this.usage = properties.usage ?? this.usage;
      this.displayOrder = properties.displayOrder ?? this.displayOrder;
      this.groups = properties.groups ?? this.groups;
      this.type = properties.type;
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.AttributeMetadataBase = AttributeMetadataBase;
  return __exports;
});
})();