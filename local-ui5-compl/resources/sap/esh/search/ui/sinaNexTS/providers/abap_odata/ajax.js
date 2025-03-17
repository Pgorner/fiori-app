/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../../core/AjaxClient","./ajaxErrorFactory","./ajaxTemplates","../../core/defaultAjaxErrorFactory"],function(e,t,r,n){"use strict";const s=e["AjaxClient"];const i=t["ajaxErrorFactory"];const o=r["isSearchRequest"];const c=r["isChartRequest"];const a=r["isValueHelperRequest"];const u=r["isSuggestionRequest"];const l=r["isObjectSuggestionRequest"];const d=r["isNavigationEvent"];const f=n["createDefaultAjaxErrorFactory"];const x=function(e){if(e.SubFilters!==undefined){delete e.ActAsQueryPart;for(let t=0;t<e.SubFilters.length;t++){this._removeActAsQueryPart(e.SubFilters[t])}}};function S(e){const t={csrf:true,errorFactories:[i,f()],errorFormatters:[],requestNormalization:function(e){if(e===null){return""}if(d(e)){return{NotToRecord:true}}if(o(e)||c(e)||a(e)||u(e)||l(e)){delete e.d.QueryOptions.ClientSessionID;delete e.d.QueryOptions.ClientCallTimestamp;delete e.d.QueryOptions.ClientServiceName;delete e.d.QueryOptions.ClientLastExecutionID;let t=JSON.stringify(e);const r='"DataSources":[';const n="]";const s=t.indexOf(r);const i=s+t.substring(s).indexOf(n)+n.length;const d=',"ExcludedDataSources":[]';t=[t.slice(0,i),d,t.slice(i)].join("");e=JSON.parse(t);if(e.d.Filter&&(o(e)||c(e)||a(e)||u(e)||l(e))){x(e.d.Filter)}}return e}};e=Object.assign({},t,e);const r=new s(e);return r}var j={__esModule:true};j.createAjaxClient=S;return j})})();
//# sourceMappingURL=ajax.js.map