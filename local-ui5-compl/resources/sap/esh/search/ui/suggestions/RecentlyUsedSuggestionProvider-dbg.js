/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["./SuggestionType"], function (___SuggestionType) {
  "use strict";

  const RecentEntriesLimit = ___SuggestionType["RecentEntriesLimit"];
  class RecentlyUsedSuggestionProvider {
    model;
    suggestionHandler;
    constructor(params) {
      this.model = params.model;
      this.suggestionHandler = params.suggestionHandler;
    }
    abortSuggestions() {
      return;
    }
    async getSuggestions() {
      if (this.model.getSearchBoxTerm().length > 0) {
        return Promise.resolve([]);
      }
      let recentlyUsedSuggestions = this.model.recentlyUsedStorage.getItems();
      recentlyUsedSuggestions = recentlyUsedSuggestions.slice(0, RecentEntriesLimit);
      return Promise.resolve(recentlyUsedSuggestions);
    }
  }
  return RecentlyUsedSuggestionProvider;
});
})();