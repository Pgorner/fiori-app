/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["../../sina/HierarchyQuery"], function (____sina_HierarchyQuery) {
  "use strict";

  const HierarchyQuery = ____sina_HierarchyQuery["HierarchyQuery"];
  class HierarchyParser {
    parseHierarchyFacet(query, attributeMetadata, facetData) {
      const nodeId = query instanceof HierarchyQuery ? query.nodeId : "$$ROOT$$";
      const hierarchyQuery = query.sina.createHierarchyQuery({
        filter: query.filter.clone(),
        attributeId: attributeMetadata.id,
        nodeId: nodeId,
        nlq: query.nlq
      });
      const resultSet = query.sina._createHierarchyResultSet({
        query: hierarchyQuery,
        node: null,
        items: [],
        title: facetData["@com.sap.vocabularies.Common.v1.Label"] || ""
      });
      const nodeMap = {};
      const nodes = [];
      const items = facetData.Items || [];
      for (const item of items) {
        const id = item[attributeMetadata.id];
        // 1. create or update node
        let node = nodeMap[id];
        if (!node) {
          // 1.1 create node
          node = query.sina.createHierarchyNode({
            id: id,
            label: item[attributeMetadata.id + "@com.sap.vocabularies.Common.v1.Text"],
            count: item._Count,
            hasChildren: item._HasChildren
          });
          nodes.push(node);
          nodeMap[id] = node;
        } else {
          // 1.2 update node
          node.label = item[attributeMetadata.id + "@com.sap.vocabularies.Common.v1.Text"];
          node.count = item._Count;
        }
        // 2. add node to parent node
        const parentId = JSON.parse(item._Parent)[attributeMetadata.id];
        let parentNode = nodeMap[parentId];
        if (!parentNode) {
          parentNode = query.sina.createHierarchyNode({
            id: parentId
          });
          nodes.push(parentNode);
          nodeMap[parentId] = parentNode;
        }
        parentNode.addChildNode(node);
      }
      const node = nodes.find(node => node.id === nodeId);
      resultSet.node = node;
      return resultSet;
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.HierarchyParser = HierarchyParser;
  return __exports;
});
})();