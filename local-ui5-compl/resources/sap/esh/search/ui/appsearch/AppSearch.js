/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./CatalogSearch"],function(t){"use strict";function e(t){return t&&t.__esModule&&typeof t.default!=="undefined"?t.default:t}const r=e(t);class s{catalogSearch;searchProviders;constructor(){this.catalogSearch=new r;this.searchProviders=[this.catalogSearch]}prefetch(){for(let t=0;t<this.searchProviders.length;t++){const e=this.searchProviders[t];e.prefetch()}}async search(t){const e=[];for(let r=0;r<this.searchProviders.length;r++){const s=this.searchProviders[r];e.push(s.search(t))}return Promise.all(e).then(function(t){const e={totalCount:0,tiles:[]};for(let r=0;r<t.length;r++){const s=t[r];e.totalCount+=s.totalCount;e.tiles.push(...s.tiles)}return e})}}return s})})();
//# sourceMappingURL=AppSearch.js.map