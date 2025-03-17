/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * The SearchHierarchyStaticFacet class is used for the model representation of static hierarchy facets.
 * The corresponding UI control is SearchFacetHierarchyStatic.
 */
sap.ui.define(["../tree/TreeNodeFactory", "./SearchHierarchyStaticTreeNode", "../SearchHelperSequentializeDecorator", "../controls/facets/FacetTypeUI"], function (__TreeNodeFactory, __SearchHierarchyStaticTreeNode, ___SearchHelperSequentializeDecorator, ___controls_facets_FacetTypeUI) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const TreeNodeFactory = _interopRequireDefault(__TreeNodeFactory);
  const SearchHierarchyStaticTreeNode = _interopRequireDefault(__SearchHierarchyStaticTreeNode);
  const sequentializedExecution = ___SearchHelperSequentializeDecorator["sequentializedExecution"];
  const FacetTypeUI = ___controls_facets_FacetTypeUI["FacetTypeUI"];
  class SearchHierarchyStaticFacet {
    static rootNodeId = "$$ROOT$$";
    model;
    attributeId;
    dataSource;
    filter;
    title;
    sina;
    facetType; // ToDo
    facetIndex;
    position;
    treeNodeFactory;
    rootTreeNode;
    constructor(properties) {
      this.model = properties.model;
      this.sina = this.model.sinaNext;
      this.attributeId = properties.attributeId;
      this.dataSource = properties.dataSource;
      this.filter = properties.filter;
      this.facetType = FacetTypeUI.HierarchyStatic;
      this.title = properties.title;
      this.facetIndex = -1;
      this.position = -1;
      this.treeNodeFactory = TreeNodeFactory.create({
        model: this.model,
        rootTreeNodePath: `/facets/${this.facetIndex}/rootTreeNode`,
        // updated in setFacetIndex
        treeNodeConstructor: SearchHierarchyStaticTreeNode,
        busyIndicator: this.model.busyIndicator
      });
      this.rootTreeNode = this.treeNodeFactory.createRootTreeNode({
        id: SearchHierarchyStaticFacet.rootNodeId,
        label: "Root",
        facet: this
      });
      this.updateTree = sequentializedExecution(this.updateTree);
    }
    setFacetIndex(index) {
      this.facetIndex = index;
      this.treeNodeFactory.setRootTreeNodePath(`/facets/${this.facetIndex}/rootTreeNode`);
    }
    async initAsync() {
      const childTreeNodes = await this.rootTreeNode.fetchChildTreeNodes();
      this.rootTreeNode.addChildTreeNodes(childTreeNodes);
    }
    async activateFilters() {
      try {
        await this.model.fireSearchQuery({
          preserveFormerResults: false
        });
        this.model.notifyFilterChanged();
      } finally {
        //
      }
    }
    updateTree() {
      // not sure whether sequentialized decorator does work on async methods
      // therefore use this wrapper
      return this.doUpdateTree();
    }
    async doUpdateTree() {
      await this.treeNodeFactory.updateRecursively();
      await this.mixinFilterNodes();
      this.treeNodeFactory.updateUI();
    }
    getComplexConditionOfFacet() {
      for (const complexCondition of this.filter.rootCondition.conditions) {
        if (complexCondition.containsAttribute(this.attributeId)) {
          return complexCondition;
        }
      }
      return null;
    }
    getFilterConditions() {
      const filterConditions = [];
      const complexCondition = this.getComplexConditionOfFacet();
      if (!complexCondition) {
        return filterConditions;
      }
      for (const condition of complexCondition.conditions) {
        filterConditions.push(condition);
      }
      return filterConditions;
    }
    async mixinFilterNodes() {
      // reset filter flags for complete tree
      this.rootTreeNode.hasFilter = false;
      this.rootTreeNode.visitChildNodesRecursively(function (node) {
        node.hasFilter = false;
      });
      // set filter flag from filter conditions
      const filterConditions = this.getFilterConditions();
      for (const filterCondition of filterConditions) {
        const node = this.treeNodeFactory.getTreeNode(filterCondition.value);
        if (!node) {
          continue; // TODO shall never happen
        }
        node.hasFilter = true;
      }
      // auto expand first filter
      await this.autoExpandFirstFilterNode();
    }
    handleModelUpdate() {
      this.treeNodeFactory.updateUI();
    }
    delete() {
      this.treeNodeFactory.delete();
    }
    async autoExpandFirstFilterNode() {
      // determine first node with filter
      let firstFilterNode = null;
      this.rootTreeNode.visitChildNodesRecursively(function (node) {
        if (node.hasFilter && !firstFilterNode) {
          firstFilterNode = node;
        }
      });
      if (!firstFilterNode) {
        return;
      }
      if (firstFilterNode.isVisible()) {
        return;
      }
      // expand nodes following path to root node
      let node = firstFilterNode.getParentTreeNode();
      while (node) {
        node.expanded = true;
        node = node.getParentTreeNode();
      }
      // update tree
      await this.treeNodeFactory.updateRecursively();
    }
    updateNodesFromHierarchyNodePaths(hierarchyNodePaths) {
      for (let i = 0; i < hierarchyNodePaths.length; ++i) {
        const hierarchyNodePath = hierarchyNodePaths[i];
        if (hierarchyNodePath.name !== this.attributeId) {
          continue;
        }
        this.rootTreeNode.updateNodePath(hierarchyNodePath.path, 0);
      }
    }
  }
  return SearchHierarchyStaticFacet;
});
})();