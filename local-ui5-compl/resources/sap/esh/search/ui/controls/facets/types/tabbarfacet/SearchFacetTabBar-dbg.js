/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["./SearchFacetTabBarBase", "./SearchFacetSimpleList"], function (__SearchFacetTabBarBase, __SearchFacetSimpleList) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const SearchFacetTabBarBase = _interopRequireDefault(__SearchFacetTabBarBase);
  const SearchFacetSimpleList = _interopRequireDefault(__SearchFacetSimpleList);
  /**
   * Attribute facet (list, pie chart, bar chart) - tab bar
   */
  /**
   * @namespace sap.esh.search.ui.controls
   */
  const SearchFacetTabBar = SearchFacetTabBarBase.extend("sap.esh.search.ui.controls.SearchFacetTabBar", {
    renderer: {
      apiVersion: 2
    },
    constructor: function _constructor(sId, settings) {
      SearchFacetTabBarBase.prototype.constructor.call(this, sId, settings);
    },
    switchFacetType: function _switchFacetType(facetType) {
      const aIconTabFilter = this.getAggregation("items");
      for (const iconTabFilter of aIconTabFilter) {
        const facet = iconTabFilter.getContent()[0];
        if (facet instanceof SearchFacetSimpleList) {
          facet.switchFacetType(facetType);
        }
      }
    },
    getFacetType: function _getFacetType() {
      const tabBarItems = this.getAggregation("items");
      const tabBarItem = tabBarItems[0];
      const facet = tabBarItem.getContent()[0];
      return facet.getProperty("facetType");
    },
    attachSelectionChange: function _attachSelectionChange() {
      //
    }
  });
  return SearchFacetTabBar;
});
})();