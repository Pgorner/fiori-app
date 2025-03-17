/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./Suggestion","./SuggestionType"],function(t,e){"use strict";const u=t["Suggestion"];const o=e["SuggestionType"];class s extends u{type=(()=>o.DataSource)();dataSource;constructor(t){super(t);this.dataSource=t.dataSource??this.dataSource}}var a={__esModule:true};a.DataSourceSuggestion=s;return a})})();
//# sourceMappingURL=DataSourceSuggestion.js.map