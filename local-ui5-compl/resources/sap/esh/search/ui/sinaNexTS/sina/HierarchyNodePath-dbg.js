/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["./SinaObject"], function (___SinaObject) {
  "use strict";

  const SinaObject = ___SinaObject["SinaObject"];
  class HierarchyNodePath extends SinaObject {
    name;
    path;
    constructor(properties) {
      super(properties);
      this.name = properties.name;
      this.path = properties.path;
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.HierarchyNodePath = HierarchyNodePath;
  return __exports;
});
})();