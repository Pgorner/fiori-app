/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./SearchTermSuggestion","./SuggestionType"],function(e,t){"use strict";const r=e["SearchTermSuggestion"];const u=t["SuggestionType"];class a extends r{type=(()=>u.SearchTermAndDataSource)();dataSource;constructor(e){super(e);this.dataSource=e.dataSource??this.dataSource}}var c={__esModule:true};c.SearchTermAndDataSourceSuggestion=a;return c})})();
//# sourceMappingURL=SearchTermAndDataSourceSuggestion.js.map