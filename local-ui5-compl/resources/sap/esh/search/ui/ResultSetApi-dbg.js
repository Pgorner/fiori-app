/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define([], function () {
  "use strict";

  /**
   * Result set
   */
  /**
   * Result set item
   */
  var AttributeType = /*#__PURE__*/function (AttributeType) {
    AttributeType["Double"] = "Double";
    AttributeType["Integer"] = "Integer";
    AttributeType["String"] = "String";
    AttributeType["ImageUrl"] = "ImageUrl";
    AttributeType["ImageBlob"] = "ImageBlob";
    AttributeType["Timestamp"] = "Timestamp";
    return AttributeType;
  }(AttributeType || {});
  var __exports = {
    __esModule: true
  };
  __exports.AttributeType = AttributeType;
  return __exports;
});
})();