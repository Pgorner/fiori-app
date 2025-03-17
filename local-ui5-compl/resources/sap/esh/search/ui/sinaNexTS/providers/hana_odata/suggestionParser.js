/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../../sina/SuggestionCalculationMode","../../sina/SuggestionType","../../core/errors"],function(e,t,a){"use strict";const r=e["SuggestionCalculationMode"];const i=t["SuggestionType"];const s=a["InternalSinaError"];class n{provider;sina;constructor(e){this.provider=e;this.sina=e.sina}parse(e,t){const a=[];let r;let i;for(let s=0;s<t.length;s++){r=null;i=t[s];r=this.parseSearchTermSuggestion(e,i);if(r){a.push(r)}}return a}parseDataSourceSuggestion(e,t){const a=this.sina.SuggestionCalculationMode.Data;const r=this.sina.getDataSource(t.FromDataSource);if(!r){return null}const i=e.filter.clone();i.setDataSource(r);return this.sina._createDataSourceSuggestion({calculationMode:a,dataSource:r,label:t.SearchTermsHighlighted})}parseSearchTermSuggestion(e,t){const a=e.filter.clone();a.setSearchTerm(t.term);if(e.types.indexOf(i.SearchTermAI)>=0){if(e.types.length>1){throw new s({message:"mix of ai suggestions with other suggestions not allowed"})}if(!t.term){return null}return this.sina._createSearchTermAISuggestion({searchTerm:t.term,calculationMode:this.sina.SuggestionCalculationMode.Data,filter:a,label:t.highlighted||t.term})}else{return this.sina._createSearchTermSuggestion({searchTerm:t.term,calculationMode:this.sina.SuggestionCalculationMode.Data,filter:a,label:t.highlighted||t.term})}}parseSearchTermAndDataSourceSuggestion(e,t){const a=this.parseCalculationMode(t.Type);const r=e.filter.clone();r.setSearchTerm(t.SearchTerms);const i=this.sina.getDataSource(t.FromDataSource);if(!i){return null}r.setDataSource(i);return this.sina._createSearchTermAndDataSourceSuggestion({searchTerm:t.SearchTerms,dataSource:i,calculationMode:a,filter:r,label:t.SearchTermsHighlighted})}parseObjectSuggestions(e,t){const a=[];for(let e=0;e<t.length;++e){const r=t[e];this.fillValueHighlighted(r);const i=r.titleAttributes.map(function(e){return e.valueFormatted||""}).join(" ");const s=this.sina._createObjectSuggestion({calculationMode:this.sina.SuggestionCalculationMode.Data,label:i,object:r});a.push(s)}return a}fillValueHighlighted(e){const t=function(e){if(!e){return}for(let t=0;t<e.length;++t){const a=e[t];if(!a.valueHighlighted){if(typeof a.valueFormatted==="string"&&a.valueFormatted.startsWith("sap-icon://")===true){a.valueHighlighted=""}else{a.valueHighlighted=a.valueFormatted}}}};t(e.detailAttributes);t(e.titleAttributes)}parseCalculationMode(e){switch(e){case"H":return r.History;case"A":case"M":return r.Data}}}var o={__esModule:true};o.SuggestionParser=n;return o})})();
//# sourceMappingURL=suggestionParser.js.map