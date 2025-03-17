/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../eshObjects/src/index"],function(e){"use strict";const t=e["Expression"];const r=e["LogicalOperator"];const a=e["SEARCH_DEFAULTS"];const s=e["parseFreeStyleText"];function o(e){let o=e.resourcePath||"/$all";if(e.metadataCall===true){if(e.metadataObjects){if(e.metadataObjects.entitySets){o+="/EntitySets("+e.metadataObjects.entitySets+")"}}return o}if(e.suggestTerm){o=o+`/${encodeURIComponent("GetSuggestion(term='"+e.suggestTerm.replace(/'/g,"''")+"')")}`}const c=new t({operator:r.and,items:[]});if(!e){e={query:a.query,scope:a.scope,$select:[],facets:[]}}else{if(!e.query){e.query=a.query}if(!e.scope){e.scope=a.scope}if(!e.$select){e.$select=[]}if(!e.facets){e.facets=[]}}if(e.oDataFilter){c.items.push(e.oDataFilter)}if(c.items.length>0){e.oDataFilter=c}const i=o;let n="SCOPE:"+e.scope;if(e.searchQueryFilter){const t=e.searchQueryFilter.toStatement().trim();if(t.length>0){if(n!==""){n+=" "}n+=t}}if(e.freeStyleText){if(n!==""){n+=" "}const t=s(e.freeStyleText);n+=t.toStatement()}const u={};for(const t of Object.keys(e)){switch(t){case"query":if(e.$apply){break}let r=n===""?"":"filter(Search.search(query='"+n+"')";if(e.oDataFilter&&e.oDataFilter.items.length>0){r+=" and "+e.oDataFilter.toStatement()}if(n!==""){r+=")"}if(e.groupby&&e.groupby.properties&&e.groupby.properties.length>0){r+=`/groupby((${e.groupby.properties.join(",")})`;if(e.groupby.aggregateCountAlias&&e.groupby.aggregateCountAlias!==""){r+=`,aggregate($count as ${e.groupby.aggregateCountAlias})`}r+=")"}if(r!==""){u.$apply=r}break;case"$orderby":if(e.$orderby){u.$orderby=e.$orderby.map(e=>e.key+" "+e.order).join(",")}break;case"facets":case"$select":if(e[t].length>0){u[t]=e[t].join(",")}break;case"$top":case"$skip":case"$count":case"whyfound":case"estimate":case"wherefound":case"language":case"facetlimit":u[t]=e[t];break;case"resourcePath":default:break}}const f=Object.keys(u).map(e=>encodeURIComponent(e)+"="+encodeURIComponent(u[e])).join("&");return f===""?i:i+"?"+f}var c={__esModule:true};c.createEshSearchQueryUrl=o;return c})})();
//# sourceMappingURL=eshHelperQL.js.map