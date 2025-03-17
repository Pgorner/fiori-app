/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define(["./SuggestionType"],function(e){"use strict";const t=e["RecentEntriesLimit"];class s{model;suggestionHandler;constructor(e){this.model=e.model;this.suggestionHandler=e.suggestionHandler}abortSuggestions(){return}async getSuggestions(){if(this.model.getSearchBoxTerm().length>0){return Promise.resolve([])}let e=this.model.recentlyUsedStorage.getItems();e=e.slice(0,t);return Promise.resolve(e)}}return s})})();
//# sourceMappingURL=RecentlyUsedSuggestionProvider.js.map