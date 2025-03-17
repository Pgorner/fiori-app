/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * The SearchHierarchyDynamicFacetsFormatter is called from the search model after each search.
 * The formatter assembles the dynamic facets from the sina search result.
 */
sap.ui.define(["../sinaNexTS/sina/HierarchyDisplayType", "./SearchHierarchyDynamicFacet"], function (___sinaNexTS_sina_HierarchyDisplayType, __SearchHierarchyDynamicFacet) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const HierarchyDisplayType = ___sinaNexTS_sina_HierarchyDisplayType["HierarchyDisplayType"];
  const SearchHierarchyDynamicFacet = _interopRequireDefault(__SearchHierarchyDynamicFacet);
  class SearchHierarchyDynamicFacetsFormatter {
    testCounter;
    facetMap;
    facetFromMetadataMap;
    model;
    constructor(model) {
      this.testCounter = 0;
      this.facetMap = {};
      this.facetFromMetadataMap = {};
      this.model = model;
    }
    getFacetAttributes(resultSet) {
      // display facets which are included in the server response
      const facetAttributes = [];
      for (let i = 0; i < resultSet.facets.length; ++i) {
        const facetResultSet = resultSet.facets[i];
        if (facetResultSet.type !== resultSet.sina.FacetType.Hierarchy) {
          continue;
        }
        if (!facetResultSet["node"]) {
          // ToDo
          continue; // TODO: server error?
        }
        const facetAttribute = facetResultSet.query.attributeId; // ToDo
        if (facetAttributes.indexOf(facetAttribute) >= 0) {
          continue;
        }
        facetAttributes.push(facetAttribute);
      }

      // display facet for which filters are set
      const filterFacetAttributes = resultSet.query.filter.rootCondition.getAttributes();
      for (let j = 0; j < filterFacetAttributes.length; ++j) {
        const filterFacetAttribute = filterFacetAttributes[j];
        const filterFacetAttributeMetadata = resultSet.query.filter.dataSource.getAttributeMetadata(filterFacetAttribute);
        if (!(filterFacetAttributeMetadata.isHierarchy && filterFacetAttributeMetadata.usage && (filterFacetAttributeMetadata.usage.Facet && typeof filterFacetAttributeMetadata.usage.Facet.displayOrder === "number" || filterFacetAttributeMetadata.usage.AdvancedSearch && typeof filterFacetAttributeMetadata.usage.AdvancedSearch.displayOrder === "number"))) {
          continue;
        }
        if (facetAttributes.indexOf(filterFacetAttribute) >= 0) {
          continue;
        }
        facetAttributes.push(filterFacetAttribute);
      }
      return facetAttributes;
    }
    getFacetFromResultSet(resultSet, attributeId) {
      for (let i = 0; i < resultSet.facets.length; ++i) {
        const facetResultSet = resultSet.facets[i];
        if (attributeId === facetResultSet.query.attributeId) {
          // ToDo
          return facetResultSet;
        }
      }
    }
    async getFacet(resultSet, searchModel, attributeId) {
      const attributeMetadata = resultSet.query.filter.dataSource.getAttributeMetadata(attributeId);
      let facet = this.facetMap[attributeId];
      if (!facet) {
        facet = new SearchHierarchyDynamicFacet({
          model: searchModel,
          sina: resultSet.sina,
          dataSource: resultSet.query.filter.dataSource,
          attributeId: attributeId,
          title: attributeMetadata.label,
          filter: this.model.getProperty("/uiFilter"),
          modelPathPrefix: "/facets",
          isShowMoreDialog: false
        });
        this.facetMap[attributeId] = facet;
      }
      facet.setFilter(this.model.getProperty("/uiFilter"));
      const containsAttribute = resultSet.query.filter.rootCondition.containsAttribute(attributeId);
      const hasExpandedChildNode = facet.rootTreeNode && facet.rootTreeNode.hasExpandedChildNode();
      if (containsAttribute || hasExpandedChildNode) {
        await facet.treeNodeFactory.updateRecursively();
      } else {
        const facetResultSet = this.getFacetFromResultSet(resultSet, attributeId);
        facet.updateFromResultSet(facetResultSet);
      }
      facet.updateNodesFromHierarchyNodePaths(resultSet.hierarchyNodePaths);
      facet.mixinFilterNodes();
      return facet;
    }
    getFacets(resultSet, searchModel) {
      if (!this.model.config.FF_dynamicHierarchyFacets) {
        return Promise.resolve([]);
      }
      // determine which facets to be displayed
      const facetAttributes = this.getFacetAttributes(resultSet);
      // create/update facets
      const facets = [];
      for (let i = 0; i < facetAttributes.length; ++i) {
        const facetAttribute = facetAttributes[i];
        const facetPromise = this.getFacet(resultSet, searchModel, facetAttribute);
        facets.push(facetPromise);
      }
      return Promise.all(facets).then(function (result) {
        return Array.from(result);
      });
    }
    destroy() {
      for (const facetAttributeId in this.facetMap) {
        const facet = this.facetMap[facetAttributeId];
        facet.delete();
      }
      this.facetMap = {};
      for (const facetAttributeId in this.facetFromMetadataMap) {
        const facet = this.facetFromMetadataMap[facetAttributeId];
        facet.delete();
      }
      this.facetFromMetadataMap = {};
    }
    handleDataSourceChanged() {
      this.destroy();
    }
    getFacetFromMetadata(attributeId, dataSource, searchFacetDialogModel) {
      let facet = this.facetFromMetadataMap[attributeId];
      if (facet) {
        return facet;
      }
      const attributeMetadata = dataSource.getAttributeMetadata(attributeId);
      facet = new SearchHierarchyDynamicFacet({
        model: searchFacetDialogModel,
        sina: dataSource.sina,
        dataSource: dataSource,
        attributeId: attributeId,
        title: attributeMetadata.label,
        filter: this.model.getProperty("/uiFilter"),
        modelPathPrefix: "/facetDialog",
        isShowMoreDialog: true
      });
      this.facetFromMetadataMap[attributeId] = facet;
      return facet;
    }
    getFacetsFromMetadata(dataSource, searchFacetDialogModel) {
      const facets = [];
      if (!searchFacetDialogModel.config.FF_dynamicHierarchyFacetsInShowMore) {
        return facets;
      }
      for (const attributeMetadata of dataSource.attributesMetadata) {
        if (attributeMetadata.isHierarchy && attributeMetadata.hierarchyDisplayType === HierarchyDisplayType.DynamicHierarchyFacet) {
          facets.push(this.getFacetFromMetadata(attributeMetadata.id, dataSource, searchFacetDialogModel));
        }
      }
      return facets;
    }
  }
  return SearchHierarchyDynamicFacetsFormatter;
});
})();