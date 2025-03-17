/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./DataSourceType","./FacetQuery"],function(e,t){"use strict";const r=e["DataSourceSubType"];const i=e["DataSourceType"];const s=t["FacetQuery"];class n extends s{attributeId;nodeId;constructor(e){super(e);this.top=e.top??30;this.attributeId=e.attributeId;this.nodeId=e.nodeId}equals(e){return e instanceof n&&super.equals(e)&&this.nodeId===e.nodeId}clone(){return new n({label:this.label,icon:this.icon,top:this.top,skip:this.skip,nlq:this.nlq,sortOrder:this.sortOrder,filter:this.filter.clone(),searchTerm:this.getSearchTerm(),sina:this.sina,attributeId:this.attributeId,nodeId:this.nodeId})}async _execute(e){return this._doExecuteHierarchyQuery(e)}async _doExecuteHierarchyQuery(e){const t=this._filteredQueryTransform(e);const r=await this.sina.provider.executeHierarchyQuery(t);return this._filteredQueryBackTransform(e,r)}_filteredQueryTransform(e){return this._genericFilteredQueryTransform(e)}_filteredQueryBackTransform(e,t){if(e.filter.dataSource.type!==i.BusinessObject||e.filter.dataSource.subType!==r.Filtered){return t}t.query=e;return t}}var u={__esModule:true};u.HierarchyQuery=n;return u})})();
//# sourceMappingURL=HierarchyQuery.js.map