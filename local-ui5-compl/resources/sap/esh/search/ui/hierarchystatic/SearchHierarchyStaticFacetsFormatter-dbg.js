/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * The SearchHierarchyStaticFacetsFormatter is called from the search model after each search.
 * The formatter assembles the static facets from the sina search result.
 */
sap.ui.define(["./SearchHierarchyStaticFacet"], function (__SearchHierarchyStaticFacet) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const SearchHierarchyStaticFacet = _interopRequireDefault(__SearchHierarchyStaticFacet);
  class SearchHierarchyStaticFacetsFormatter {
    model;
    facetMap;
    constructor(model) {
      this.model = model;
      this.facetMap = {};
    }
    getFacetAttributes(resultSet) {
      const attributesMetadata = resultSet.query.filter.dataSource.attributesMetadata;
      const facetAttributes = [];
      for (let i = 0; i < attributesMetadata.length; ++i) {
        const attributeMetadata = attributesMetadata[i];
        if (!attributeMetadata.isHierarchy) {
          continue;
        }
        if (attributeMetadata.hierarchyDisplayType !== resultSet.sina.HierarchyDisplayType.StaticHierarchyFacet) {
          continue;
        }
        const dataSource = resultSet.sina.getHierarchyDataSource(attributeMetadata.hierarchyName);
        if (!dataSource) {
          continue;
        }
        facetAttributes.push({
          attributeId: attributeMetadata.id,
          dataSource: dataSource
        });
      }
      return facetAttributes;
    }
    async getFacet(resultSet, model, facetAttribute) {
      let facet;
      try {
        facet = this.facetMap[facetAttribute.attributeId];
        if (!facet) {
          const attributeMetadata = resultSet.query.filter.dataSource.getAttributeMetadata(facetAttribute.attributeId);
          facet = new SearchHierarchyStaticFacet({
            model: model,
            attributeId: facetAttribute.attributeId,
            dataSource: facetAttribute.dataSource,
            filter: model.getProperty("/uiFilter"),
            title: attributeMetadata.label
          });
          this.facetMap[facetAttribute.attributeId] = facet;
          facet.treeNodeFactory.cache.activate();
          await facet.initAsync();
        }
        facet.treeNodeFactory.cache.activate();
        facet.filter = model.getProperty("/uiFilter");
        facet.updateNodesFromHierarchyNodePaths(resultSet.hierarchyNodePaths);
        await facet.mixinFilterNodes();
        return facet;
      } finally {
        facet.treeNodeFactory.cache.deActivate();
      }
    }
    getFacets(resultSet) {
      if (!this.model.config.FF_staticHierarchyFacets) {
        return Promise.resolve([]);
      }
      if (!this.model.getProperty("/facetVisibility")) {
        return Promise.resolve([]);
      }
      const facetAttributes = this.getFacetAttributes(resultSet);
      const facetPromises = [];
      for (let i = 0; i < facetAttributes.length; ++i) {
        const facetAttribute = facetAttributes[i];
        const facet = this.getFacet(resultSet, this.model, facetAttribute);
        facetPromises.push(facet);
      }
      return Promise.all(facetPromises);
    }
    destroy() {
      for (const facetAttributeId in this.facetMap) {
        const facet = this.facetMap[facetAttributeId];
        facet.delete();
      }
      this.facetMap = {};
    }
    handleDataSourceChanged() {
      this.destroy();
    }
  }
  return SearchHierarchyStaticFacetsFormatter;
});
})();