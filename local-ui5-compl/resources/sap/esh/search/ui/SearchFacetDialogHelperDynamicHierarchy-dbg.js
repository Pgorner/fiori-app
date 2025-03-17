/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["./FacetItem"], function (__FacetItem) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const FacetItem = _interopRequireDefault(__FacetItem);
  async function updateDetailPageforDynamicHierarchy(model, dynamicHierarchyFacet, filters) {
    function handleSetFilter(node, set, filterCondition) {
      const facet = node.getData().facet;
      const facetItem = createFilterFacetItemForDynamicHierarchy(facet, filterCondition);
      if (set) {
        model.addFilter(facetItem);
      } else {
        model.removeFilter(facetItem);
      }
    }
    const facetFilter = dynamicHierarchyFacet.sina.createFilter({
      dataSource: model.getDataSource()
    });
    // firstly add static hierachy facets
    const nonFilterByConditions = model.getNonFilterByFilterConditions();
    if (nonFilterByConditions.length > 0) {
      for (const nonFilterByCondition of nonFilterByConditions) {
        facetFilter.autoInsertCondition(nonFilterByCondition);
      }
    }
    for (const filter of filters) {
      facetFilter.autoInsertCondition(filter.filterCondition);
    }
    dynamicHierarchyFacet.setFilter(facetFilter);
    dynamicHierarchyFacet.setHandleSetFilter(handleSetFilter);
    await dynamicHierarchyFacet.treeNodeFactory.updateRecursively();
    dynamicHierarchyFacet.updateNodesFromHierarchyNodePaths(model.getProperty("/hierarchyNodePaths"));
    dynamicHierarchyFacet.mixinFilterNodes();
    dynamicHierarchyFacet.treeNodeFactory.updateUI();
  }
  function createFilterFacetItemForDynamicHierarchy(facet, condition) {
    return new FacetItem({
      selected: false,
      level: 0,
      filterCondition: condition,
      value: condition.value,
      valueLabel: condition.valueLabel,
      label: facet.title,
      facetTitle: facet.title,
      facetAttribute: facet.attributeId,
      advanced: true,
      listed: true,
      icon: null,
      visible: true
    });
  }
  var __exports = {
    __esModule: true
  };
  __exports.updateDetailPageforDynamicHierarchy = updateDetailPageforDynamicHierarchy;
  __exports.createFilterFacetItemForDynamicHierarchy = createFilterFacetItemForDynamicHierarchy;
  return __exports;
});
})();