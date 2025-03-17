/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["../i18n", "./SuggestionType"], function (__i18n, __SuggestionType) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const i18n = _interopRequireDefault(__i18n);
  const SuggestionType = _interopRequireDefault(__SuggestionType);
  const Type = __SuggestionType["Type"];
  function assembleLabel(searchModel) {
    // if the model has has a selected hierarchy node (folder), use that:
    const hierarchyNodePathLength = searchModel.getProperty("/breadcrumbsHierarchyNodePaths").length;
    if (hierarchyNodePathLength > 0) {
      let breadCrumb = "";
      let pathSep = " > ";
      let hierarchyNodes = searchModel.getProperty("/breadcrumbsHierarchyNodePaths").slice();
      if (document.documentElement.getAttribute("dir") === "rtl") {
        pathSep = " < ";
        hierarchyNodes = hierarchyNodes.reverse();
      }
      hierarchyNodes.forEach((hierarchyNode, index) => {
        breadCrumb += hierarchyNode.label;
        if (++index < hierarchyNodePathLength) {
          breadCrumb += pathSep;
        }
      });
      return i18n.getText("resultsIn", ["<span>" + searchModel.getSearchBoxTerm() + "</span>", breadCrumb]);
    }
    // if the model has more than one data source, add the data source to the label:
    if (searchModel.getProperty("/dataSources").length > 1) {
      return i18n.getText("resultsIn", ["<span>" + searchModel.getSearchBoxTerm() + "</span>", searchModel.getDataSource().labelPlural]);
    }
    // fallback just use searchterm
    return searchModel.getSearchBoxTerm();
  }
  function hasFilter(searchModel) {
    const filter = searchModel.getProperty("/uiFilter");
    const dataSource = filter.dataSource;
    const staticHierarchyAttributeId = dataSource.getStaticHierarchyAttributeMetadata()?.id;
    const spaceNameAttributeId = searchModel.config?.dimensionNameSpace_Description;
    const filterAttributes = filter.rootCondition.getAttributes().filter(attributeId => {
      // ignore static hierarchy filter conditions
      if (staticHierarchyAttributeId && staticHierarchyAttributeId === attributeId) {
        return false;
      }
      // ignore space facet filter conditions
      if (spaceNameAttributeId && spaceNameAttributeId === attributeId) {
        return false;
      }
      return true;
    });
    return filterAttributes.length > 0;
  }
  function createSearchSuggestionForCurrentSearch(searchModel) {
    const searchTerm = searchModel.getSearchBoxTerm();
    if (!searchTerm || searchTerm === "*" || searchTerm === "") return;
    return {
      label: assembleLabel(searchModel),
      icon: "sap-icon://search",
      titleNavigation: searchModel.createSearchNavigationTargetCurrentState(),
      uiSuggestionType: Type.Search,
      position: SuggestionType.properties.Search.position,
      filterIcon: hasFilter(searchModel) ? "sap-icon://filter" : ""
    };
  }
  var __exports = {
    __esModule: true
  };
  __exports.createSearchSuggestionForCurrentSearch = createSearchSuggestionForCurrentSearch;
  return __exports;
});
})();