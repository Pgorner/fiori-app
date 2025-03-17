/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../../core/util","./Formatter"],function(e,r){"use strict";const t=r["Formatter"];class a extends t{initAsync(){return Promise.resolve()}format(r){return e.removePureAdvancedSearchFacets(r)}formatAsync(r){r=e.removePureAdvancedSearchFacets(r);return Promise.resolve(r)}}var c={__esModule:true};c.RemovePureAdvancedSearchFacetsFormatter=a;return c})})();
//# sourceMappingURL=RemovePureAdvancedSearchFacetsFormatter.js.map