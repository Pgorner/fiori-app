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

  function isSearchRequest(obj) {
    if (typeof obj === "object") {
      const obj2 = obj;
      if (typeof obj2.d === "object") {
        const obj3 = obj2;
        if (typeof obj3.d.QueryOptions === "object") {
          const QueryOptions = obj3.d.QueryOptions;
          if (typeof QueryOptions.SearchType === "string" && QueryOptions.SearchType === "") {
            return true;
          }
        }
      }
    }
    return false;
  }
  const searchRequest = {
    d: {
      Filter: {},
      Id: "1",
      QueryOptions: {
        SearchTerms: "",
        Top: 10,
        Skip: 0,
        SearchType: "",
        ClientSessionID: "",
        ClientCallTimestamp: "",
        // "\/Date(1496917054000)\/"
        ClientServiceName: "",
        ClientLastExecutionID: ""
      },
      DataSources: [],
      OrderBy: [],
      ResultList: {
        SearchResults: [{
          HitAttributes: [],
          Attributes: []
        }]
      },
      ExecutionDetails: [],
      MaxFacetValues: 5,
      Facets: [{
        Values: []
      }]
    }
  };
  function isChartRequest(obj) {
    if (typeof obj === "object") {
      const obj2 = obj;
      if (typeof obj2.d === "object") {
        const obj3 = obj2;
        if (typeof obj3.d.QueryOptions === "object") {
          const obj4 = obj3;
          return typeof obj4.d.QueryOptions.SearchType === "string" && obj4.d.QueryOptions.SearchType === "F";
        }
      }
    }
    return false;
  }
  const chartRequest = {
    d: {
      Id: "1",
      DataSources: [],
      Filter: {},
      QueryOptions: {
        SearchTerms: "",
        Skip: 0,
        SearchType: "F",
        ClientSessionID: "",
        ClientCallTimestamp: "",
        // "\/Date(1496917054000)\/"
        ClientServiceName: "",
        ClientLastExecutionID: ""
      },
      FacetRequests: [],
      //conditionGroupsByAttributes
      MaxFacetValues: 5,
      Facets: [{
        Values: []
      }],
      ExecutionDetails: []
    }
  };
  function isValueHelperRequest(obj) {
    if (typeof obj === "object") {
      const obj2 = obj;
      if (typeof obj2.d === "object") {
        const obj3 = obj2;
        if (typeof obj3.d.ValueHelpAttribute === "string") return true;
      }
    }
    return false;
  }
  const valueHelperRequest = {
    d: {
      Id: "1",
      ValueHelpAttribute: "",
      ValueFilter: "",
      DataSources: [],
      Filter: {},
      QueryOptions: {
        SearchTerms: "",
        Top: 1000,
        Skip: 0,
        SearchType: "V",
        ClientSessionID: "",
        ClientCallTimestamp: "",
        // "\/Date(1496917054000)\/"
        ClientServiceName: "",
        ClientLastExecutionID: ""
      },
      ValueHelp: []
    }
  };
  function isSuggestionRequest(obj) {
    if (typeof obj === "object") {
      const obj2 = obj;
      if (typeof obj2.d === "object") {
        const obj3 = obj2;
        if (typeof obj3.d.SuggestionInput === "string") return true;
      }
    }
    return false;
  }
  const suggestionRequest = {
    d: {
      Id: "1",
      SuggestionInput: "",
      IncludeAttributeSuggestions: false,
      IncludeHistorySuggestions: false,
      IncludeDataSourceSuggestions: false,
      DetailLevel: 1,
      QueryOptions: {
        Top: 0,
        Skip: 0,
        SearchType: "S",
        SearchTerms: "",
        ClientSessionID: "",
        ClientCallTimestamp: "",
        // "\/Date(1496917054000)\/"
        ClientServiceName: "",
        ClientLastExecutionID: ""
      },
      Filter: {},
      DataSources: [],
      Suggestions: [],
      ExecutionDetails: []
    }
  };
  function isObjectSuggestionRequest(obj) {
    if (typeof obj === "object") {
      const obj2 = obj;
      if (typeof obj2.d === "object") {
        const obj3 = obj2;
        if (obj3.d.IncludeAttributeSuggestions !== "undefined" && obj3.d.IncludeAttributeSuggestions === true) return true;
      }
    }
    return false;
  }
  const objectSuggestionRequest = {
    d: {
      Id: "1",
      IncludeAttributeSuggestions: true,
      QueryOptions: {
        SearchTerms: "a",
        Top: 10,
        Skip: 0,
        ClientSessionID: "",
        ClientCallTimestamp: "",
        // "\/Date(1496917054000)\/"
        ClientServiceName: "",
        ClientLastExecutionID: ""
      },
      DataSources: [{
        Id: "UIA000~EPM_BPA_DEMO~",
        Type: "View"
      }],
      ObjectSuggestions: {
        SearchResults: [{
          HitAttributes: [],
          Attributes: []
        }]
      },
      Filter: {},
      ExecutionDetails: []
    }
  };
  function isNavigationEvent(obj) {
    if (typeof obj === "object") {
      const obj2 = obj;
      return typeof obj2.SemanticObjectType === "string" && typeof obj2.Intent === "string" && typeof obj2.System === "string" && typeof obj2.Client === "string" && Array.isArray(obj2.Parameters);
    }
    return false;
  }
  var __exports = {
    __esModule: true
  };
  __exports.isSearchRequest = isSearchRequest;
  __exports.searchRequest = searchRequest;
  __exports.isChartRequest = isChartRequest;
  __exports.chartRequest = chartRequest;
  __exports.isValueHelperRequest = isValueHelperRequest;
  __exports.valueHelperRequest = valueHelperRequest;
  __exports.isSuggestionRequest = isSuggestionRequest;
  __exports.suggestionRequest = suggestionRequest;
  __exports.isObjectSuggestionRequest = isObjectSuggestionRequest;
  __exports.objectSuggestionRequest = objectSuggestionRequest;
  __exports.isNavigationEvent = isNavigationEvent;
  return __exports;
});
})();