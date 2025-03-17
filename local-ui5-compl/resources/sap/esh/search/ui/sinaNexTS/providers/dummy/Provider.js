/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../../core/errors","../AbstractProvider"],function(e,r){"use strict";const t=e["NotImplementedError"];const n=r["AbstractProvider"];class o extends n{executeSearchQuery(){throw new t}executeChartQuery(){throw new t}executeHierarchyQuery(e){throw new t}async executeSuggestionQuery(){throw new t}id="dummy";async initAsync(){return Promise.resolve()}}var c={__esModule:true};c.Provider=o;return c})})();
//# sourceMappingURL=Provider.js.map