/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["../BusyIndicator", "./TreeCache"], function (___BusyIndicator, ___TreeCache) {
  "use strict";

  const DummyBusyIndicator = ___BusyIndicator["DummyBusyIndicator"];
  const TreeCache = ___TreeCache["TreeCache"];
  class BaseTreeNodeFactory {
    cache;
    rootTreeNodePath;
    testMode;
    constructor(rootTreeNodePath, testMode) {
      this.rootTreeNodePath = rootTreeNodePath;
      this.testMode = testMode;
      this.cache = new TreeCache();
    }
  }
  class TreeNodeFactory extends BaseTreeNodeFactory {
    model;
    treeNodeMap = {};
    rootTreeNode;
    treeViews = [];
    treeNodeConstructor;
    busyIndicator;
    constructor(props) {
      super(props.rootTreeNodePath, props.testMode);
      this.rootTreeNodePath = props.rootTreeNodePath;
      this.model = props.model;
      this.treeNodeConstructor = props.treeNodeConstructor;
      this.busyIndicator = props.busyIndicator ?? new DummyBusyIndicator();
    }
    static create(props) {
      const treeNodeFactory = new TreeNodeFactory(props);
      return treeNodeFactory;
    }
    createRootTreeNode(...props) {
      props[0].expandable = true;
      props[0].expanded = true;
      this.rootTreeNode = this.createTreeNode(...props);
      this.registerTreeNode(this.rootTreeNode);
      return this.rootTreeNode;
    }
    createTreeNode(...props) {
      const treeNode = new this.treeNodeConstructor(...props);
      return treeNode;
    }
    registerTreeNode(treeNode) {
      if (this.treeNodeMap[treeNode.id]) {
        throw "duplicate tree id" + treeNode.id;
      }
      treeNode.setTreeNodeFactory(this);
      this.treeNodeMap[treeNode.id] = treeNode;
    }
    deRegisterTreeNode(treeNode) {
      treeNode.setTreeNodeFactory(null);
      delete this.treeNodeMap[treeNode.id];
    }
    getTreeNode(id) {
      return this.treeNodeMap[id];
    }
    setRootTreeNodePath(rootTreeNodePath) {
      this.rootTreeNodePath = rootTreeNodePath;
    }
    updateUI() {
      this.model.setProperty(this.rootTreeNodePath, {
        childTreeNodes: []
      });
      this.model.setProperty(this.rootTreeNodePath, this.rootTreeNode);
      for (const treeView of this.treeViews) {
        treeView.expandTreeNodes();
      }
    }
    saveFocus() {
      for (const treeView of this.treeViews) {
        treeView.saveFocus();
      }
    }
    restoreFocus() {
      for (const treeView of this.treeViews) {
        treeView.restoreFocus();
      }
    }
    setBusy(isBusy) {
      this.busyIndicator.setBusy(isBusy);
    }
    registerTreeView(treeView) {
      this.treeViews.push(treeView);
    }
    deRegisterTreeView(treeView) {
      const index = this.treeViews.indexOf(treeView);
      if (index >= 0) {
        this.treeViews.splice(index, 1);
      }
    }
    getRootTreeNode() {
      return this.rootTreeNode;
    }
    async updateRecursively(updateUI) {
      try {
        this.setBusy(true);
        await this.rootTreeNode.updateRecursively();
        if (updateUI) {
          await this.updateUI();
        }
      } finally {
        this.setBusy(false);
      }
    }
    delete() {
      this.getRootTreeNode().delete();
    }
  }
  TreeNodeFactory.BaseTreeNodeFactory = BaseTreeNodeFactory;
  return TreeNodeFactory;
});
})();