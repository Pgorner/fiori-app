/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./Suggestion", "./SuggestionType"], function (___Suggestion, ___SuggestionType) {
  "use strict";

  const Suggestion = ___Suggestion["Suggestion"];
  const SuggestionType = ___SuggestionType["SuggestionType"];
  class SearchTermSuggestion extends Suggestion {
    type = (() => SuggestionType.SearchTerm)();

    // _meta: {
    //     properties: {
    //         searchTerm: {
    //             required: true
    //         },
    //         filter: {
    //             required: true
    //         },
    //         childSuggestions: {
    //             required: false,
    //             default: function () {
    //                 return [];
    //             }
    //         }
    //     }
    // }

    searchTerm;
    filter;
    childSuggestions = [];
    constructor(properties) {
      super(properties);
      this.searchTerm = properties.searchTerm ?? this.searchTerm;
      this.filter = properties.filter ?? this.filter;
      this.childSuggestions = properties.childSuggestions ?? this.childSuggestions;
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.SearchTermSuggestion = SearchTermSuggestion;
  return __exports;
});
})();