/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../core/core","./DataSourceType","./FacetQuery"],function(e,t,r){"use strict";const s=t["DataSourceSubType"];const i=t["DataSourceType"];const n=r["FacetQuery"];class o extends n{top=5;dimension;constructor(e){super(e);this.top=e.top??this.top;this.dimension=e.dimension??this.dimension}equals(e){return e instanceof o&&super.equals(e)&&this.dimension===e.dimension}clone(){return new o({label:this.label,icon:this.icon,skip:this.skip,top:this.top,nlq:this.nlq,sortOrder:this.sortOrder,filter:this.filter.clone(),sina:this.sina,dimension:this.dimension})}async _formatResultSetAsync(t){return e.executeSequentialAsync(this.sina.chartResultSetFormatters,function(e){return e.formatAsync(t)})}async _execute(e){return this._doExecuteChartQuery(e)}async _doExecuteChartQuery(e){const t=this._filteredQueryTransform(e);const r=await this.sina.provider.executeChartQuery(t);return this._filteredQueryBackTransform(e,r)}_filteredQueryTransform(e){return this._genericFilteredQueryTransform(e)}_filteredQueryBackTransform(e,t){if(e.filter.dataSource.type!==i.BusinessObject||e.filter.dataSource.subType!==s.Filtered){return t}t.query=e;return t}}var u={__esModule:true};u.ChartQuery=o;return u})})();
//# sourceMappingURL=ChartQuery.js.map