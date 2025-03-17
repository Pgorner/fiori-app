/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../core/core","./Query","./SuggestionType","./SuggestionCalculationMode","./DataSourceType","../core/errors"],function(e,t,s,r,o,i){"use strict";const n=t["Query"];const a=s["SuggestionType"];const c=r["SuggestionCalculationMode"];const u=o["DataSourceSubType"];const l=o["DataSourceType"];const y=i["QueryIsReadOnlyError"];class f extends n{calculationModes=(()=>[c.Data,c.History])();types=(()=>[a.DataSource,a.Object,a.SearchTerm])();constructor(e){super(e);this.types=e.types??this.types;this.calculationModes=e.calculationModes??this.calculationModes}async _formatResultSetAsync(t){const s=t.query;if(s.types.indexOf(a.Object)>=0&&s.filter.dataSource.type===s.sina.DataSourceType.BusinessObject){return e.executeSequentialAsync(this.sina.suggestionResultSetFormatters,function(e){return e.formatAsync(t)})}}setTypes(e){this.types=e}setCalculationModes(e){this.calculationModes=e}_createReadOnlyClone(){const e=this.clone();e.getResultSetAsync=function(){throw new y};return e}clone(){const e=new f({label:this.label,icon:this.icon,skip:this.skip,top:this.top,nlq:this.nlq,filter:this.filter.clone(),sortOrder:this.sortOrder,sina:this.sina,types:this.types,calculationModes:this.calculationModes});e.types=this.types.slice();e.calculationModes=this.calculationModes.slice();return e}equals(t){if(!(t instanceof f)){return false}if(!super.equals(t)){return false}if(!t){return false}return e.equals(this.types,t.types,false)&&e.equals(this.calculationModes,t.calculationModes,false)}async _execute(e){return this._doExecuteSuggestionQuery(e)}async _doExecuteSuggestionQuery(e){const t=this._filteredQueryTransform(e);const s=await this.sina.provider.executeSuggestionQuery(t);return this._filteredQueryBackTransform(e,s)}_filteredQueryTransform(e){return this._genericFilteredQueryTransform(e)}_filteredQueryBackTransform(e,t){if(e.filter.dataSource.type!==l.BusinessObject||e.filter.dataSource.subType!==u.Filtered){return t}t.query=e;let s;for(const r of t.items){switch(r.type){case a.SearchTerm:s=e.filter.clone();s.searchTerm=r.filter.searchTerm;r.filter=s;break;case a.Object:break;default:throw"program error, not supported suggestion type "+r.type}}return t}}var d={__esModule:true};d.SuggestionQuery=f;return d})})();
//# sourceMappingURL=SuggestionQuery.js.map