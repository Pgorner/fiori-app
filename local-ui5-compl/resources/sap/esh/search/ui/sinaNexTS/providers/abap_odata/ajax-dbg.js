/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../../core/AjaxClient", "./ajaxErrorFactory", "./ajaxTemplates", "../../core/defaultAjaxErrorFactory"], function (____core_AjaxClient, ___ajaxErrorFactory, ___ajaxTemplates, ____core_defaultAjaxErrorFactory) {
  "use strict";

  const AjaxClient = ____core_AjaxClient["AjaxClient"];
  const ajaxErrorFactory = ___ajaxErrorFactory["ajaxErrorFactory"];
  const isSearchRequest = ___ajaxTemplates["isSearchRequest"];
  const isChartRequest = ___ajaxTemplates["isChartRequest"];
  const isValueHelperRequest = ___ajaxTemplates["isValueHelperRequest"];
  const isSuggestionRequest = ___ajaxTemplates["isSuggestionRequest"];
  const isObjectSuggestionRequest = ___ajaxTemplates["isObjectSuggestionRequest"];
  const isNavigationEvent = ___ajaxTemplates["isNavigationEvent"];
  const createDefaultAjaxErrorFactory = ____core_defaultAjaxErrorFactory["createDefaultAjaxErrorFactory"];
  const _removeActAsQueryPart = function (node) {
    if (node.SubFilters !== undefined) {
      // not a leaf
      delete node.ActAsQueryPart;
      for (let i = 0; i < node.SubFilters.length; i++) {
        this._removeActAsQueryPart(node.SubFilters[i]);
      }
    }
  };
  function createAjaxClient(properties) {
    const defaults = {
      csrf: true,
      errorFactories: [ajaxErrorFactory, createDefaultAjaxErrorFactory()],
      errorFormatters: [],
      requestNormalization: function (payload) {
        if (payload === null) {
          return "";
        }
        if (isNavigationEvent(payload)) {
          return {
            NotToRecord: true
          };
        }
        if (isSearchRequest(payload) || isChartRequest(payload) || isValueHelperRequest(payload) || isSuggestionRequest(payload) || isObjectSuggestionRequest(payload)) {
          delete payload.d.QueryOptions.ClientSessionID;
          delete payload.d.QueryOptions.ClientCallTimestamp;
          delete payload.d.QueryOptions.ClientServiceName;
          delete payload.d.QueryOptions.ClientLastExecutionID;

          // insert "ExcludedDataSources" in payload
          // properties' ordering is important in stringified payload
          // "ExcludedDataSources" should follow "DataSources"
          // find "DataSources":[...], and insert "ExcludedDataSources" after
          let payloadString = JSON.stringify(payload); // object -> string
          // eslint-disable-next-line quotes
          const headString = '"DataSources":[';
          // eslint-disable-next-line quotes
          const endString = "]";
          const headIndex = payloadString.indexOf(headString);
          const endIndex = headIndex + payloadString.substring(headIndex).indexOf(endString) + endString.length;
          // eslint-disable-next-line quotes
          const insertedString = ',"ExcludedDataSources":[]';
          payloadString = [payloadString.slice(0, endIndex), insertedString, payloadString.slice(endIndex)].join("");
          payload = JSON.parse(payloadString); // string -> object
          if (payload.d.Filter && (isSearchRequest(payload) || isChartRequest(payload) || isValueHelperRequest(payload) || isSuggestionRequest(payload) || isObjectSuggestionRequest(payload))) {
            _removeActAsQueryPart(payload.d.Filter);
          }
        }
        return payload;
      }
      //csrfByPassCache: true
    };
    properties = Object.assign({}, defaults, properties);
    const client = new AjaxClient(properties);
    return client;
  }
  var __exports = {
    __esModule: true
  };
  __exports.createAjaxClient = createAjaxClient;
  return __exports;
});
})();