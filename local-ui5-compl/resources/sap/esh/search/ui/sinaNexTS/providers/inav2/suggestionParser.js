/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../../sina/SuggestionCalculationMode","./pivotTableParser"],function(e,a){"use strict";const t=e["SuggestionCalculationMode"];class r{provider;sina;constructor(e){this.provider=e;this.sina=e.sina}parseSuggestions(e,t){t=a.parse(t);const r=[];let s;let o;for(let a=0;a<t.cells.length;a++){s=null;const c=t.cells[a];if(c.$$Attribute$$!=="$$AllAttributes$$"){continue}switch(c.$$Term$$.Scope){case"SearchHistory":if(c.$$DataSource$$==="$$AllDataSources$$"){s=this.parseSearchTermSuggestion(e,c)}break;case"ObjectData":if(c.$$DataSource$$==="$$AllDataSources$$"){s=this.parseSearchTermSuggestion(e,c);o=s}else{s=this.parseSearchTermAndDataSourceSuggestion(e,c);if(s&&s.filter.dataSource!==o.filter.dataSource){o.childSuggestions.push(s)}s=null}break;case"DataSources":if(c.$$DataSource$$==="$$AllDataSources$$"){s=this.parseDataSourceSuggestion(e,c)}break}if(s){r.push(s)}}return r}parseDataSourceSuggestion(e,a){const r=this.sina.getDataSource(a.$$Term$$.Value);if(!r){return null}const s=e.filter.clone();s.setDataSource(r);return this.sina._createDataSourceSuggestion({calculationMode:t.Data,dataSource:r,label:a.$$Term$$.ValueFormatted})}parseSearchTermSuggestion(e,a){const t=this.parseCalculationMode(a.$$Term$$.Scope);const r=e.filter.clone();r.setSearchTerm(a.$$Term$$.Value);return this.sina._createSearchTermSuggestion({searchTerm:a.$$Term$$.Value,calculationMode:t,filter:r,label:a.$$Term$$.ValueFormatted})}parseSearchTermAndDataSourceSuggestion(e,a){const t=this.parseCalculationMode(a.$$Term$$.Scope);const r=e.filter.clone();r.setSearchTerm(a.$$Term$$.Value);const s=this.sina.getDataSource(a.$$DataSource$$);if(!s){return null}r.setDataSource(s);return this.sina._createSearchTermAndDataSourceSuggestion({searchTerm:a.$$Term$$.Value,dataSource:s,calculationMode:t,filter:r,label:a.$$Term$$.ValueFormatted})}parseCalculationMode(e){switch(e){case"SearchHistory":return t.History;case"ObjectData":return t.Data}}}function s(e,a,t){const s=new r(e);return s.parseSuggestions(a,t)}var o={__esModule:true};o.parse=s;return o})})();
//# sourceMappingURL=suggestionParser.js.map