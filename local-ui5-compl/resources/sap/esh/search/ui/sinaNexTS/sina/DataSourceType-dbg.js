/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define([], function () {
  "use strict";

  var DataSourceType = /*#__PURE__*/function (DataSourceType) {
    DataSourceType["BusinessObject"] = "BusinessObject";
    DataSourceType["Category"] = "Category";
    DataSourceType["UserCategory"] = "UserCategory";
    return DataSourceType;
  }(DataSourceType || {});
  var DataSourceSubType = /*#__PURE__*/function (DataSourceSubType) {
    DataSourceSubType["Filtered"] = "Filtered";
    return DataSourceSubType;
  }(DataSourceSubType || {});
  var __exports = {
    __esModule: true
  };
  __exports.DataSourceType = DataSourceType;
  __exports.DataSourceSubType = DataSourceSubType;
  return __exports;
});
})();