/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["./SinaObject"], function (___SinaObject) {
  "use strict";

  const SinaObject = ___SinaObject["SinaObject"];
  class HierarchyNode extends SinaObject {
    id;
    label;
    count;
    hasChildren;
    icon;
    isFirst;
    isLast;
    parentNode;
    childNodes;
    childNodeMap;
    constructor(properties) {
      super(properties);
      this.id = properties.id;
      this.label = properties.label;
      this.count = properties.count;
      this.hasChildren = properties.hasChildren;
      this.icon = properties.icon;
      this.isFirst = properties.isFirst;
      this.isLast = properties.isLast;
      this.parentNode = null;
      this.childNodes = [];
      this.childNodeMap = {};
    }
    equals(other) {
      return this.id === other.id;
    }
    addChildNode(child) {
      if (this.childNodeMap[child.id]) {
        return;
      }
      this.childNodes.push(child);
      this.childNodeMap[child.id] = child;
      child.parentNode = this;
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.HierarchyNode = HierarchyNode;
  return __exports;
});
})();