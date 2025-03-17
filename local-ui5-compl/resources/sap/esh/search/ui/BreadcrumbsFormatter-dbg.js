/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["./sinaNexTS/sina/HierarchyDisplayType"], function (___sinaNexTS_sina_HierarchyDisplayType) {
  "use strict";

  const HierarchyDisplayType = ___sinaNexTS_sina_HierarchyDisplayType["HierarchyDisplayType"];
  class Formatter {
    model;
    constructor(model) {
      this.model = model;
    }
    formatNodePaths(searchResultSet) {
      if (searchResultSet) {
        const path = this._selectNodePath(searchResultSet);
        if (path) {
          return path.path;
        }
      }
      return [];
    }
    formatHierarchyAttribute(searchResultSet) {
      if (searchResultSet) {
        const path = this._selectNodePath(searchResultSet);
        if (path) {
          return path.name;
        }
      }
      return "";
    }
    _selectNodePath(searchResultSet) {
      const paths = searchResultSet.hierarchyNodePaths;
      if (paths && Array.isArray(paths) && paths.length > 0) {
        for (let i = 0; i < paths.length; i++) {
          const path = paths[i];
          const attributeName = path.name;
          if (path && Array.isArray(path.path) && attributeName) {
            const attrMetadata = searchResultSet.query.getDataSource()?.attributesMetadata?.find(attributeMetadata => attributeMetadata.id === attributeName);
            if (attrMetadata && attrMetadata.isHierarchy === true && (attrMetadata.hierarchyDisplayType === HierarchyDisplayType.HierarchyResultView || attrMetadata.hierarchyDisplayType === HierarchyDisplayType.StaticHierarchyFacet)) {
              return path;
            }
          }
        }
      }
      return null;
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.Formatter = Formatter;
  return __exports;
});
})();