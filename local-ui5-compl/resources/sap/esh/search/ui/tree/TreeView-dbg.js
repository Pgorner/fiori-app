/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["sap/m/Tree", "../SearchHelper", "sap/m/library"], function (Tree, ___SearchHelper, sap_m_library) {
  "use strict";

  const delayedExecution = ___SearchHelper["delayedExecution"];
  const ListSeparators = sap_m_library["ListSeparators"];
  /**
   * @namespace sap.esh.search.ui.tree.TreeView
   */
  const TreeView = Tree.extend("sap.esh.search.ui.tree.TreeView.TreeView", {
    renderer: {
      apiVersion: 2
    },
    metadata: {
      properties: {
        treeNodeFactory: {
          type: "object"
        }
      }
    },
    constructor: function _constructor(sId, options) {
      if (typeof sId === "object") {
        options = sId;
      }
      options.toggleOpenState = event => {
        this.handleToggleOpenState(event);
      };
      Tree.prototype.constructor.call(this, sId, options);
      this.setShowSeparators(ListSeparators.None);
      this.expandTreeNodes = delayedExecution(this.expandTreeNodes, 200);
      this.setBusyIndicatorDelay(200);
    },
    saveFocus: function _saveFocus() {
      const domRef = this.getDomRef();
      if (!domRef) {
        this.focusTreeNodeId = undefined;
        return;
      }
      const childDomRefs = domRef.querySelectorAll(".sapMTreeItemBase");
      for (let i = 0; i < childDomRefs.length; ++i) {
        const childDomRef = childDomRefs.item(i);
        if (childDomRef === document.activeElement) {
          this.focusTreeNodeId = childDomRef.getAttribute("data-esh-tree-node-id");
          return;
        }
      }
      this.focusTreeNodeId = undefined;
    },
    restoreFocus: async function _restoreFocus() {
      const isFocused = () => {
        return document.activeElement.getAttribute("data-esh-tree-node-id") === this.focusTreeNodeId;
      };
      const setFocus = () => {
        const items = this.getItems();
        for (const item of items) {
          if (item.getBindingContext().getObject().id === this.focusTreeNodeId) {
            item.focus();
            return;
          }
        }
      };
      const wait = delay => new Promise(function (resolve) {
        setTimeout(resolve, delay);
      });
      for (let i = 0; i < 10; ++i) {
        await wait(200);
        if (isFocused()) {
          return;
        }
        setFocus();
      }
    },
    setTreeNodeFactory: function _setTreeNodeFactory(treeNodeFactory) {
      this.setProperty("treeNodeFactory", treeNodeFactory);
      if (treeNodeFactory) {
        treeNodeFactory.registerTreeView(this);
      }
    },
    getTreeNodeFactory: function _getTreeNodeFactory() {
      return this.getProperty("treeNodeFactory");
    },
    destroy: function _destroy(bSuppressInvalidate) {
      Tree.prototype.destroy.call(this, bSuppressInvalidate);
      this.getTreeNodeFactory().deRegisterTreeView(this);
    },
    handleToggleOpenState: function _handleToggleOpenState(event) {
      const treeNode = event.getParameter("itemContext").getObject(); // TODO: remove any once ui5 type is implemented
      treeNode.setExpanded(event.getParameter("expanded"), true);
    },
    expandTreeNodes: function _expandTreeNodes() {
      if (this.isDestroyed()) {
        return;
      }
      this.collapseAll();
      this.expandTreeNodeRecursively(this.getTreeNodeFactory().getRootTreeNode());
    },
    expandTreeNodeRecursively: function _expandTreeNodeRecursively(treeNode) {
      if (treeNode.expanded) {
        this.doExpand(treeNode);
      }
      for (const childTreeNode of treeNode.childTreeNodes) {
        if (childTreeNode.id === "dummy") {
          continue;
        }
        this.expandTreeNodeRecursively(childTreeNode);
      }
    },
    doExpand: function _doExpand(treeNode) {
      const items = this.getItems();
      for (let i = 0; i < items.length; ++i) {
        const item = items[i];
        const context = item.getBindingContext();
        if (!context) {
          continue;
        }
        const itemTreeNode = context.getObject();
        if (itemTreeNode === treeNode) {
          this.expand(i);
          return;
        }
      }
    }
  });
  return TreeView;
});
})();