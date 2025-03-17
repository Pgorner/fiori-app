/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["./error/ErrorHandler"], function (__ErrorHandler) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const ErrorHandler = _interopRequireDefault(__ErrorHandler);
  function renderUrlFromParameters(model, top, filter, encodeFilter, orderBy) {
    const parameters = {
      top: top.toString(),
      filter: encodeFilter ? encodeURIComponent(JSON.stringify(filter.toJson())) : JSON.stringify(filter.toJson())
    };
    if (model.config.FF_sortOrderInUrl && orderBy && Object.keys(orderBy).length > 0) {
      if (orderBy.orderBy) {
        parameters.orderby = encodeURIComponent(orderBy.orderBy);
      }
      if (orderBy.sortOrder) {
        parameters.sortorder = orderBy.sortOrder; // ASC | DESC
      }
    }
    try {
      return model.config.renderSearchUrl(parameters);
    } catch (e) {
      const errorHandler = ErrorHandler.getInstance();
      errorHandler.onError(e);
      return "";
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.renderUrlFromParameters = renderUrlFromParameters;
  return __exports;
});
})();