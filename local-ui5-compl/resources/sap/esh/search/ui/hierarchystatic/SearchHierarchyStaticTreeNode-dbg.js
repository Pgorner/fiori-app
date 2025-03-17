/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["../eventlogging/UserEvents", "../tree/TreeNode"], function (___eventlogging_UserEvents, __TreeNode) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const UserEventType = ___eventlogging_UserEvents["UserEventType"];
  const TreeNode = _interopRequireDefault(__TreeNode);
  class SearchHierarchyStaticTreeNode extends TreeNode {
    hasFilter;
    icon;
    constructor(props) {
      super(props);
      this.icon = props.icon;
      this.getData().facet = props.facet;
    }
    async setExpanded(expanded, updateUI) {
      await super.setExpanded(expanded, false);
      this.getData().facet.mixinFilterNodes();
      if (updateUI) {
        this.getTreeNodeFactory().updateUI();
      }
    }
    async toggleFilter() {
      const facet = this.getData().facet;
      if (!this.hasFilter) {
        // set filter
        this.setFilter(true);
      } else {
        // remove filter
        this.setFilter(false);
      }
      await facet.activateFilters();
    }
    setFilter(set) {
      const facet = this.getData().facet;
      const filterCondition = facet.sina.createSimpleCondition({
        operator: facet.sina.ComparisonOperator.DescendantOf,
        attribute: facet.attributeId,
        attributeLabel: facet.title,
        // TODO
        value: this.id,
        valueLabel: this.label
      });
      const uiFilter = facet.model.getProperty("/uiFilter");
      if (set) {
        this.removeExistingFilters();
        if (facet.model.config.searchInAreaOverwriteMode) {
          facet.model.config.resetQuickSelectDataSourceAll(facet.model);
        }
        facet.model.setSearchBoxTerm("", false);
        facet.model.resetFilterByFilterConditions(false);
        uiFilter.autoInsertCondition(filterCondition);
        const userEventStaticFacetSelect = {
          type: UserEventType.STATIC_FACET_SELECT
        };
        facet.model.eventLogger.logEvent(userEventStaticFacetSelect);
      } else {
        uiFilter.autoRemoveCondition(filterCondition);
      }
    }
    removeExistingFilters() {
      const facet = this.getData().facet;
      const uiFilter = facet.model.getProperty("/uiFilter");
      const filterConditonsForRemoval = uiFilter.rootCondition.getAttributeConditions(facet.attributeId);
      for (const filterCondition of filterConditonsForRemoval) {
        uiFilter.autoRemoveCondition(filterCondition);
      }
    }
    async fetchChildTreeNodesImpl() {
      // helper functions
      const getId = item => {
        for (let i = 0; i < item.attributes.length; ++i) {
          const attribute = item.attributes[i];
          if (attribute.id === facet.attributeId) {
            return attribute.value;
          }
        }
      };
      const getLabel = item => {
        const label = [];
        for (let i = 0; i < item.titleAttributes.length; ++i) {
          const titleAttribute = item.titleAttributes[i];
          if (!titleAttribute.value.startsWith("sap-icon://")) {
            label.push(titleAttribute.valueFormatted);
          }
        }
        return label.join(" ");
      };
      const getIcon = item => {
        for (let i = 0; i < item.attributes.length; ++i) {
          const attribute = item.attributes[i];
          if (typeof attribute.value === "string" && attribute.value.startsWith("sap-icon://")) {
            return attribute.value;
          }
        }
        return "sap-icon://none";
      };
      const facet = this.getData().facet;
      const filter = facet.sina.createFilter({
        dataSource: facet.dataSource
      });
      filter.autoInsertCondition(facet.sina.createSimpleCondition({
        attribute: facet.attributeId,
        value: this.id,
        operator: facet.sina.ComparisonOperator.ChildOf
      }));
      const query = facet.sina.createSearchQuery({
        filter: filter,
        top: 100
      });
      const resultSet = await query.getResultSetAsync();
      if (resultSet.hasErrors()) {
        resultSet.getErrors().forEach(error => facet.model.errorHandler.onError(error));
      }
      const childTreeNodes = [];
      for (let i = 0; i < resultSet.items.length; ++i) {
        const item = resultSet.items[i];
        const node = facet.treeNodeFactory.createTreeNode({
          facet: facet,
          id: getId(item),
          label: getLabel(item),
          icon: getIcon(item),
          expandable: !item.attributesMap.HASHIERARCHYNODECHILD || item.attributesMap.HASHIERARCHYNODECHILD.value === "true"
        }); // ToDo, try to get rid of artificial attribute 'HASHIERARCHYNODECHILD'
        childTreeNodes.push(node);
      }
      return childTreeNodes;
    }
    updateNodePath(path, index) {
      if (path[index].id !== this.id) {
        throw new Error("program error"); // TODO
      }
      if (index + 1 >= path.length) {
        return;
      }
      const pathPart = path[index + 1];
      let childNode = this.getChildTreeNodeById(pathPart.id);
      if (!childNode) {
        const facet = this.getData().facet;
        childNode = facet.treeNodeFactory.createTreeNode({
          facet: facet,
          id: pathPart.id,
          label: pathPart.label
        });
        this.addChildTreeNode(childNode);
      }
      childNode.updateNodePath(path, index + 1);
    }
  }
  return SearchHierarchyStaticTreeNode;
});
})();