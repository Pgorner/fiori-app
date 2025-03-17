/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define(["../../sina/HierarchyQuery"],function(e){"use strict";const r=e["HierarchyQuery"];class n{parseHierarchyFacet(e,n,t){const a=e instanceof r?e.nodeId:"$$ROOT$$";const i=e.sina.createHierarchyQuery({filter:e.filter.clone(),attributeId:n.id,nodeId:a,nlq:e.nlq});const o=e.sina._createHierarchyResultSet({query:i,node:null,items:[],title:t["@com.sap.vocabularies.Common.v1.Label"]||""});const s={};const c=[];const d=t.Items||[];for(const r of d){const t=r[n.id];let a=s[t];if(!a){a=e.sina.createHierarchyNode({id:t,label:r[n.id+"@com.sap.vocabularies.Common.v1.Text"],count:r._Count,hasChildren:r._HasChildren});c.push(a);s[t]=a}else{a.label=r[n.id+"@com.sap.vocabularies.Common.v1.Text"];a.count=r._Count}const i=JSON.parse(r._Parent)[n.id];let o=s[i];if(!o){o=e.sina.createHierarchyNode({id:i});c.push(o);s[i]=o}o.addChildNode(a)}const l=c.find(e=>e.id===a);o.node=l;return o}}var t={__esModule:true};t.HierarchyParser=n;return t})})();
//# sourceMappingURL=HierarchyParser.js.map