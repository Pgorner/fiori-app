/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./Suggestion","./SuggestionType"],function(e,s){"use strict";const t=e["Suggestion"];const i=s["SuggestionType"];class r extends t{type=(()=>i.SearchTerm)();searchTerm;filter;childSuggestions=[];constructor(e){super(e);this.searchTerm=e.searchTerm??this.searchTerm;this.filter=e.filter??this.filter;this.childSuggestions=e.childSuggestions??this.childSuggestions}}var n={__esModule:true};n.SearchTermSuggestion=r;return n})})();
//# sourceMappingURL=SearchTermSuggestion.js.map