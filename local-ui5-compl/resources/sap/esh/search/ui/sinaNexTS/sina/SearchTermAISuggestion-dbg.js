/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["./SearchTermSuggestion", "./SuggestionType"], function (___SearchTermSuggestion, ___SuggestionType) {
  "use strict";

  const SearchTermSuggestion = ___SearchTermSuggestion["SearchTermSuggestion"];
  const SuggestionType = ___SuggestionType["SuggestionType"];
  class SearchTermAISuggestion extends SearchTermSuggestion {
    type = (() => SuggestionType.SearchTermAI)();
  }
  var __exports = {
    __esModule: true
  };
  __exports.SearchTermAISuggestion = SearchTermAISuggestion;
  return __exports;
});
})();