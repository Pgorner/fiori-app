/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * When manipulating the filter conditions (for instance changing the search term) hierarchy nodes may appear/disappear.
 * In case a filter is set for a disappeared hierarchy node we want to show the hierarchy node (without count) anyway.
 * The structure tree is always updated with hierarchy structure information from the server.
 * In case a node is not included in the server response the node may be taken from the structure tree.
 */
sap.ui.define([], function () {
  "use strict";

  class StructureTreeNode {
    id;
    label;
    tree;
    childNodes;
    childNodeMap;
    parentNode;
    constructor(properties) {
      this.id = properties.id;
      this.label = properties.label;
      this.tree = properties.tree;
      this.childNodes = [];
      this.childNodeMap = {};
      this.parentNode = null;
    }
    addChildNode(node) {
      this.childNodes.push(node);
      this.childNodeMap[node.id] = node;
      node.parentNode = this;
    }
    update(sinaNode) {
      for (let i = 0; i < sinaNode.childNodes.length; ++i) {
        const sinaChildNode = sinaNode.childNodes[i];
        let childNode = this.childNodeMap[sinaChildNode.id];
        if (!childNode) {
          childNode = this.tree.createNode({
            id: sinaChildNode.id,
            label: sinaChildNode.label
          });
          this.addChildNode(childNode);
        }
        childNode.update(sinaChildNode);
      }
    }
  }
  class StructureTree {
    node;
    nodeMap;
    constructor(options) {
      this.nodeMap = {};
      this.node = this.createNode(options.rootNode);
    }
    createNode(properties) {
      properties.tree = this;
      const node = new StructureTreeNode(properties);
      this.nodeMap[properties.id] = node;
      return node;
    }
    getNode(id) {
      return this.nodeMap[id];
    }
    update(sinaNode) {
      const node = this.nodeMap[sinaNode.id];
      if (!node) {
        throw new Error(`structure tree update failed, node does not exist: ${sinaNode?.id}`);
      }
      node.update(sinaNode);
    }
    updateFromHierarchyNodePath(hierarchyNodePath) {
      let parentNode;
      for (const hierarchyNode of hierarchyNodePath.path) {
        let node = this.getNode(hierarchyNode.id);
        if (!node) {
          node = this.createNode({
            id: hierarchyNode.id,
            label: hierarchyNode.label || hierarchyNode.id
          });
          if (!parentNode) {
            throw "program error, parent node not set";
          }
          parentNode.addChildNode(node);
        }
        parentNode = node;
      }
    }
  }
  StructureTree.StructureTreeNode = StructureTreeNode;
  return StructureTree;
});
})();