/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["../core/clone", "./AttributeMetadata", "./DataSource", "./NavigationTarget", "./SearchResultSet", "./SearchResultSetItem", "./SearchResultSetItemAttribute"], function (___core_clone, ___AttributeMetadata, ___DataSource, ___NavigationTarget, ___SearchResultSet, ___SearchResultSetItem, ___SearchResultSetItemAttribute) {
  "use strict";

  const CloneService = ___core_clone["CloneService"];
  const AttributeMetadata = ___AttributeMetadata["AttributeMetadata"];
  const DataSource = ___DataSource["DataSource"];
  const NavigationTarget = ___NavigationTarget["NavigationTarget"];
  const SearchResultSet = ___SearchResultSet["SearchResultSet"];
  const SearchResultSetItem = ___SearchResultSetItem["SearchResultSetItem"];
  const SearchResultSetItemAttribute = ___SearchResultSetItemAttribute["SearchResultSetItemAttribute"];
  /* 
  - clone service which clones sina objects
  - the clone includes only public (= to be used by stakeholder developers) properties
  */
  const cloneService = new CloneService({
    classes: [{
      class: SearchResultSet,
      properties: ["items"]
    }, {
      class: SearchResultSetItem,
      properties: ["attributes", "attributesMap", "dataSource", "defaultNavigationTarget", "detailAttributes", "navigationTargets", "titleAttributes", "titleDescriptionAttributes"]
    }, {
      class: SearchResultSetItemAttribute,
      properties: ["id", "value", "valueFormatted", "valueHighlighted", "defaultNavigationTarget", "isHighlighted", "metadata", "navigationTargets"]
    }, {
      class: DataSource,
      properties: ["id", "label", "labelPlural"]
    }, {
      class: AttributeMetadata,
      properties: ["id", "label", "type", "isKey", "format"]
    }, {
      class: NavigationTarget,
      cloneFunction: obj => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const objInClosure = obj;
        return {
          text: obj.text,
          tooltip: obj.tooltip,
          icon: obj.icon,
          target: obj.target,
          targetUrl: obj.targetUrl,
          targetFunction: typeof obj.targetFunction === "function" ? obj.targetFunction.bind(objInClosure) : undefined,
          performNavigation: typeof obj.performNavigation === "function" ? obj.performNavigation.bind(objInClosure) : undefined
        };
      }
    }]
  });
  function clonePublic(obj) {
    return cloneService.clone(obj);
  }
  var __exports = {
    __esModule: true
  };
  __exports.clonePublic = clonePublic;
  return __exports;
});
})();