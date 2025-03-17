/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define(["./error/ErrorHandler","./i18n"],function(e,t){"use strict";function r(e){return e&&e.__esModule&&typeof e.default!=="undefined"?e.default:e}const n=r(e);const a=r(t);class o{model;errorHandler;constructor(e){this.model=e;this.errorHandler=n.getInstance()}formatSortAttributes(){const e=[];const t=this.model.sinaNext;const r=this.model.getDataSource();const n=t.dataSourceMap[r.id].attributesMetadata;if(!Array.isArray(n)||n.length===0){return[]}for(let t=0;t<n.length;t++){const r=n[t];if(r.isSortable){e.push({name:r.label,key:"searchSortAttributeKey"+t,attributeId:r.id})}}const o=(e,t)=>{if(e.name<t.name){return-1}if(e.name>t.name){return 1}return 0};e.sort(o);e.unshift({name:a.getText("defaultRank"),key:"searchSortAttributeKeyDefault",attributeId:"DEFAULT_SORT_ATTRIBUTE"});let s=this.model.getOrderBy().orderBy;if(typeof s==="undefined"){s="DEFAULT_SORT_ATTRIBUTE"}for(let t=0;t<e.length;t++){if(e[t].attributeId===s){e[t].selected=true}else{e[t].selected=false}}return e}}return o})})();
//# sourceMappingURL=SearchResultBaseFormatter.js.map