/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../error/ErrorHandler","sap/ui/Device","./JsSearchFactory","sap/base/Log","../error/errors","../SearchModel"],function(t,e,i,r,s,o){"use strict";function n(t){return t&&t.__esModule&&typeof t.default!=="undefined"?t.default:t}const a=n(t);const l=n(i);const c=s["AppSearchError"];const h=s["AppSearchSearchTermExceedsLimitsError"];const u=s["ESHUIError"];const g=n(o);class p{errorHandler;initPromise;searchEngine;logger=(()=>r.getLogger("sap.esh.search.ui.appsearch.catalogsearch"))();constructor(){this.errorHandler=a.getInstance({model:g.getModelSingleton({},"flp")});this.initPromise=this.initAsync()}async initAsync(){if(this.initPromise){return this.initPromise}try{const t=await window.sap.ushell.Container.getServiceAsync("SearchableContent");const i=await t.getApps();const r=this.formatApps(i);this.logger.debug(`Adding ${r.length} flp apps to the search index`);let s=true;const o=e&&e.browser&&e.browser.msie||false;if(!String.prototype.normalize||o){s=false}this.searchEngine=l.createJsSearch({objects:r,fields:["title","subtitle","keywords"],shouldNormalize:s,algorithm:{id:"contains-ranked",options:[50,49,40,39,5,4,51]}})}catch(t){const e=new u("FLP SearchableContent Service Failed - App Search won't be available.");e.previous=t;throw e}}formatApps(t){const e=[];t.forEach(function(t){t.visualizations.forEach(function(t){let i=t.title;if(t.subtitle){i=i+" - "+t.subtitle}e.push({title:t.title||"",subtitle:t.subtitle||"",keywords:t.keywords?t.keywords.join(" "):"",icon:t.icon||"",label:i,visualization:t,url:t.targetURL})})});return e}prefetch(){}async search(t){const e=1e3;if(t.searchTerm?.length>e){throw new h(e)}try{await this.initAsync();const e=this.searchEngine.search({searchFor:t.searchTerm,top:t.top,skip:t.skip});const i=[];for(let t=0;t<e.results.length;++t){const r=e.results[t];const s=Object.assign({},r.object);let o=s.title;let n=false;if(typeof r.highlighted==="object"&&r.highlighted){if("title"in r.highlighted&&typeof r.highlighted.title==="string"){o=r.highlighted.title}if("subtitle"in r.highlighted&&typeof r.highlighted.subtitle==="string"){o=o+" - "+r.highlighted.subtitle;n=true}}if(!n&&s.subtitle){o=o+" - "+s.subtitle}s.label=o;i.push(s)}return{totalCount:e.totalCount,tiles:i}}catch(t){const e=new c(t);e.previous=t;this.errorHandler.onError(e);return{totalCount:0,tiles:[]}}}}return p})})();
//# sourceMappingURL=CatalogSearch.js.map