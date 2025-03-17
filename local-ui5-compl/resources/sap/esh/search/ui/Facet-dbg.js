/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define([], function () {
  "use strict";

  class Facet {
    title;
    facetType;
    dimension;
    dataType;
    matchingStrategy;
    items;
    items4pie; // ToDo, not really elegant to have pie-chart specific properties here
    totalCount;
    visible;
    position;
    constructor(properties) {
      this.title = properties.title;
      this.facetType = properties.facetType; //datasource or attribute
      this.dimension = properties.dimension;
      this.dataType = properties.dataType;
      this.matchingStrategy = properties.matchingStrategy;
      this.items = properties.items || [];
      this.totalCount = properties.totalCount;
      this.visible = properties.visible || true;
    }

    /**
     * Checks if the facet has the given filter condition
     * @param   {object}  filterCondition the condition to check for in this facet
     * @returns {Boolean} true if the filtercondition was found in this facet
     */
    hasFilterCondition(filterCondition) {
      for (let i = 0, len = this.items.length; i < len; i++) {
        const fc = this.items[i].filterCondition;
        if (fc.equals && fc.equals(filterCondition)) {
          return true;
        }
      }
      return false;
    }

    /**
     * Checks if this facet has at least one filter condition
     * @returns {Boolean} true if it has at least one filter condition, false otherwise
     */
    hasFilterConditions() {
      for (let i = 0, len = this.items.length; i < len; i++) {
        if (this.items[i].filterCondition) {
          return true;
        }
      }
      return false;
    }
    removeItem(facetItem) {
      for (let i = 0, len = this.items.length; i < len; i++) {
        const fc = this.items[i].filterCondition;
        if (fc.equals && facetItem.filterCondition && fc.equals(facetItem.filterCondition)) {
          return this.items.splice(i, 1);
        }
      }
    }
  }
  return Facet;
});
})();