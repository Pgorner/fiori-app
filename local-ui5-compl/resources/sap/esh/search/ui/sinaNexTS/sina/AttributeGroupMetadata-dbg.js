/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./AttributeType", "./AttributeMetadataBase"], function (___AttributeType, ___AttributeMetadataBase) {
  "use strict";

  const AttributeType = ___AttributeType["AttributeType"];
  const AttributeMetadataBase = ___AttributeMetadataBase["AttributeMetadataBase"];
  class AttributeGroupMetadata extends AttributeMetadataBase {
    // _meta: {
    //     properties: {
    //         type: { // overwrite
    //             required: false,
    //             default: AttributeType.Group
    //         },
    //         label: { // overwrite
    //             required: false
    //         },
    //         isSortable: { // overwrite
    //             required: false,
    //             default: false
    //         },
    //         template: {
    //             required: false
    //         },
    //         attributes: { // array of AttributeGroupMembership instances
    //             required: true,
    //             default: function () {
    //                 return [];
    //             }
    //         }
    //         displayAttributes{ // array of attibutes to be displayed
    //             required: false,
    //             default: function () {
    //                 return [];
    //             }
    //         }
    //     }
    // }

    type = (() => AttributeType.Group)();
    label;
    isSortable = false;
    template;
    attributes = [];
    displayAttributes = [];
    constructor(properties) {
      super(properties);
      this.id = properties.id ?? this.id;
      this.usage = properties.usage ?? this.usage;
      this.label = properties.label ?? this.label;
      this.isSortable = properties.isSortable ?? this.isSortable;
      this.template = properties.template ?? this.template;
      this.attributes = properties.attributes ?? this.attributes;
      this.displayAttributes = properties.displayAttributes ?? this.displayAttributes;
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.AttributeGroupMetadata = AttributeGroupMetadata;
  return __exports;
});
})();