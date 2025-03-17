/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * The SearchHierarchyDynamicFacet class is used for the model representation of dynamic hierarchy facets.
 * * The corresponding UI control is SearchFacetHierarchyDynamic.
 */
sap.ui.define(["../tree/TreeNodeFactory", "./SearchHierarchyDynamicTreeNode", "./StructureTree", "../controls/facets/FacetTypeUI"], function (__TreeNodeFactory, __SearchHierarchyDynamicTreeNode, __StructureTree, ___controls_facets_FacetTypeUI) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const TreeNodeFactory = _interopRequireDefault(__TreeNodeFactory);
  const SearchHierarchyDynamicTreeNode = _interopRequireDefault(__SearchHierarchyDynamicTreeNode);
  const StructureTree = _interopRequireDefault(__StructureTree);
  const FacetTypeUI = ___controls_facets_FacetTypeUI["FacetTypeUI"];
  class SearchHierarchyDynamicFacet {
    static rootNodeId = "$$ROOT$$";
    model;
    sina;
    dataSource;
    attributeId;
    title;
    filter;
    modelPathPrefix;
    isShowMoreDialog;
    handleSetFilter;
    filterCount;
    dimension;
    facetType;
    facetIndex;
    structureTree;
    notDisplayedFilterConditions;
    treeNodeFactory;
    rootTreeNode;
    constructor(properties) {
      this.model = properties.model;
      this.sina = properties.sina;
      this.dataSource = properties.dataSource;
      this.attributeId = properties.attributeId;
      this.dimension = this.attributeId; // alias for compatability with the simple attribute facets
      this.title = properties.title;
      this.filter = properties.filter;
      this.modelPathPrefix = properties.modelPathPrefix;
      this.isShowMoreDialog = properties.isShowMoreDialog;
      this.handleSetFilter = properties.handleSetFilter;
      this.filterCount = this.filter.rootCondition.getAttributeConditions(this.attributeId).length;
      this.facetType = FacetTypeUI.Hierarchy;
      this.facetIndex = -1;
      this.structureTree = new StructureTree({
        rootNode: {
          id: SearchHierarchyDynamicFacet.rootNodeId,
          label: "root"
        }
      });
      this.notDisplayedFilterConditions = [];
      this.treeNodeFactory = TreeNodeFactory.create({
        model: this.model,
        rootTreeNodePath: `/facets/${this.facetIndex}/rootTreeNode`,
        // updated in setFacetIndex
        treeNodeConstructor: SearchHierarchyDynamicTreeNode,
        busyIndicator: this.model.busyIndicator
      });
      this.rootTreeNode = this.treeNodeFactory.createRootTreeNode({
        id: SearchHierarchyDynamicFacet.rootNodeId,
        label: "Root",
        count: 0,
        facet: this
      });
    }
    setFilter(filter) {
      this.filter = filter;
    }
    setHandleSetFilter(handleSetFilter) {
      this.handleSetFilter = handleSetFilter;
    }
    setFacetIndex(index) {
      this.facetIndex = index;
      this.treeNodeFactory.setRootTreeNodePath(`${this.modelPathPrefix}/${this.facetIndex}/rootTreeNode`);
    }
    updateStructureTree(sinaNode) {
      this.structureTree.update(sinaNode);
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
    updateFromResultSet(resultSet) {
      const childTreeNodes = [];
      for (const childNode of resultSet.node.childNodes) {
        childTreeNodes.push(this.treeNodeFactory.createTreeNode({
          id: childNode.id,
          label: childNode.label,
          count: childNode.count,
          facet: this,
          expandable: childNode.hasChildren
        }));
      }
      this.rootTreeNode.updateChildren(childTreeNodes);
      this.updateStructureTree(resultSet.node);
      return Promise.resolve();
    }
    getComplexConditionOfFacet() {
      for (let i = 0; i < this.filter.rootCondition.conditions.length; ++i) {
        const complexCondition = this.filter.rootCondition.conditions[i];
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
      for (let i = 0; i < complexCondition.conditions.length; ++i) {
        const condition = complexCondition.conditions[i];
        filterConditions.push(condition);
      }
      return filterConditions;
    }
    mixinFilterNodes() {
      // reset filter flag for complete tree
      this.rootTreeNode.hasFilter = false;
      this.rootTreeNode.visitChildNodesRecursively(function (treeNode) {
        treeNode.hasFilter = false;
      });
      // update filter flag from filter conditions
      let treeNodeId;
      const notDisplayedFilterConditions = [];
      const filterConditions = this.getFilterConditions();
      for (let i = 0; i < filterConditions.length; ++i) {
        const filterCondition = filterConditions[i];
        treeNodeId = filterCondition.value; // ToDo
        const treeNode = this.treeNodeFactory.getTreeNode(treeNodeId);
        if (treeNode) {
          treeNode.hasFilter = true;
        } else {
          notDisplayedFilterConditions.push(filterCondition);
        }
      }
      // add tree nodes for filters not in tree
      for (let j = 0; j < notDisplayedFilterConditions.length; ++j) {
        const notDisplayedFilterCondition = notDisplayedFilterConditions[j];
        treeNodeId = notDisplayedFilterCondition.value;
        // try to add filter node via structure tree
        if (this.addMissingFilterNode(treeNodeId)) {
          // in case of success delete from notDisplayedFilterConditions list
          notDisplayedFilterConditions.splice(j, 1);
          j--;
        }
      }
      this.notDisplayedFilterConditions = notDisplayedFilterConditions;
      this.calculateCheckboxStatus();
      this.calculateFilterCount();
    }
    calculateFilterCount() {
      const filterCount = this.filter.rootCondition.getAttributeConditions(this.attributeId).length;
      this.model.setProperty(`${this.modelPathPrefix}/${this.facetIndex}/filterCount`, filterCount);
    }
    addMissingFilterNode(id) {
      const getOrCreateTreeNode = structureTreeNode => {
        let treeNode = this.treeNodeFactory.getTreeNode(structureTreeNode.id);
        if (treeNode) {
          if (treeNode.isVisible()) {
            return treeNode;
          } else {
            return null;
          }
        }
        if (!structureTreeNode.parentNode) {
          throw new Error("program error parent node missing for " + structureTreeNode.id);
        }
        const parentTreeNode = getOrCreateTreeNode(structureTreeNode.parentNode);
        if (!parentTreeNode) {
          return null;
        }
        treeNode = this.treeNodeFactory.createTreeNode({
          id: structureTreeNode.id,
          label: structureTreeNode.label,
          count: 0,
          facet: this
        });
        parentTreeNode.addChildTreeNode(treeNode);
        return treeNode;
      };
      const structureTreeNode = this.structureTree.getNode(id);
      if (!structureTreeNode) {
        return false;
      }
      const treeNode = getOrCreateTreeNode(structureTreeNode);
      if (!treeNode) {
        return false;
      }
      treeNode.hasFilter = true;
      return true;
    }
    calculateCheckboxStatus() {
      // reset
      this.rootTreeNode.selected = false;
      this.rootTreeNode.partiallySelected = false;
      this.rootTreeNode.visitChildNodesRecursively(function (node) {
        node.selected = false;
        node.partiallySelected = false;
      });
      // collect leafs
      const leafNodes = [];
      if (!this.rootTreeNode.hasChildNodes()) {
        leafNodes.push(this.rootTreeNode);
      }
      this.rootTreeNode.visitChildNodesRecursively(function (node) {
        if (!node.hasChildNodes()) {
          leafNodes.push(node);
        }
      });
      // calculate selected and partiallySelected
      for (let i = 0; i < leafNodes.length; ++i) {
        const leafNode = leafNodes[i];
        this.calculateCheckboxStatusFromLeafNode(leafNode);
      }
    }
    calculateCheckboxStatusFromLeafNode(leafNode) {
      let node = leafNode;
      let markPartiallySelected = false;
      while (node) {
        if (node.selected && node.partiallySelected) {
          return;
        }
        if (node.hasFilter) {
          node.selected = true;
          node.partiallySelected = false;
          markPartiallySelected = true;
        } else {
          if (markPartiallySelected) {
            node.selected = true;
            node.partiallySelected = true;
          }
        }
        node = node.getParentTreeNode();
      }
    }
    handleModelUpdate() {
      this.treeNodeFactory.updateUI();
    }
    delete() {
      this.treeNodeFactory.delete();
    }
    updateNodesFromHierarchyNodePaths(hierarchyNodePaths) {
      for (const hierarchyNodePath of hierarchyNodePaths) {
        if (hierarchyNodePath.name !== this.attributeId) {
          continue;
        }
        this.structureTree.updateFromHierarchyNodePath(hierarchyNodePath);
      }
    }
  }
  return SearchHierarchyDynamicFacet;
});
})();