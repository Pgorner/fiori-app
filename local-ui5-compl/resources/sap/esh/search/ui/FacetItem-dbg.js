/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define([], function () {
  "use strict";

  class FacetItem {
    selected;
    level;
    filterCondition;
    value;
    label;
    facetTitle;
    facetAttribute;
    valueLabel;
    advanced;
    listed;
    icon;
    visible;
    constructor(properties) {
      const oProperties = properties || {};
      this.selected = oProperties.selected || false;
      this.level = oProperties.level || 0;
      this.filterCondition = oProperties.filterCondition;
      this.value = oProperties.value || ""; // value here means count
      this.label = typeof oProperties.label === "undefined" ? "" : oProperties.label + "";
      this.facetTitle = oProperties.facetTitle || "";
      this.facetAttribute = oProperties.facetAttribute || "";
      this.valueLabel = this.value;
      this.advanced = oProperties.advanced || false;
      this.listed = oProperties.listed || false;
      this.icon = oProperties.icon;
      this.visible = oProperties.visible || true;
    }
    equals(otherFacetItem) {
      return this.facetTitle === otherFacetItem.facetTitle && this.label === otherFacetItem.label && this.value === otherFacetItem.value && this.filterCondition.equals(otherFacetItem.filterCondition);
    }
    clone() {
      const newFacetItem = new FacetItem();
      newFacetItem.facetTitle = this.facetTitle;
      newFacetItem.selected = this.selected;
      newFacetItem.label = this.label;
      newFacetItem.icon = this.icon;
      newFacetItem.level = this.level;
      newFacetItem.value = this.value;
      newFacetItem.valueLabel = this.valueLabel;
      newFacetItem.filterCondition = this.filterCondition.clone();
      return newFacetItem;
    }
  }
  return FacetItem;
});
})();