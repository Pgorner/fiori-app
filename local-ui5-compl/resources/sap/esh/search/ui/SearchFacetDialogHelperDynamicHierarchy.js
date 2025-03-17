/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define(["./FacetItem"],function(e){"use strict";function t(e){return e&&e.__esModule&&typeof e.default!=="undefined"?e.default:e}const i=t(e);async function a(e,t,i){function a(t,i,a){const n=t.getData().facet;const o=r(n,a);if(i){e.addFilter(o)}else{e.removeFilter(o)}}const n=t.sina.createFilter({dataSource:e.getDataSource()});const o=e.getNonFilterByFilterConditions();if(o.length>0){for(const e of o){n.autoInsertCondition(e)}}for(const e of i){n.autoInsertCondition(e.filterCondition)}t.setFilter(n);t.setHandleSetFilter(a);await t.treeNodeFactory.updateRecursively();t.updateNodesFromHierarchyNodePaths(e.getProperty("/hierarchyNodePaths"));t.mixinFilterNodes();t.treeNodeFactory.updateUI()}function r(e,t){return new i({selected:false,level:0,filterCondition:t,value:t.value,valueLabel:t.valueLabel,label:e.title,facetTitle:e.title,facetAttribute:e.attributeId,advanced:true,listed:true,icon:null,visible:true})}var n={__esModule:true};n.updateDetailPageforDynamicHierarchy=a;n.createFilterFacetItemForDynamicHierarchy=r;return n})})();
//# sourceMappingURL=SearchFacetDialogHelperDynamicHierarchy.js.map