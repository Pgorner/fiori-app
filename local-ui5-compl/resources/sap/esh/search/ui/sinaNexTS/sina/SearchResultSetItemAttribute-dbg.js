/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./SearchResultSetItemAttributeBase"], function (___SearchResultSetItemAttributeBase) {
  "use strict";

  const SearchResultSetItemAttributeBase = ___SearchResultSetItemAttributeBase["SearchResultSetItemAttributeBase"];
  class SearchResultSetItemAttribute extends SearchResultSetItemAttributeBase {
    // _meta: {
    //     properties: {
    //         label: {
    //             required: true
    //         },
    //         value: {
    //             required: true
    //         },
    //         valueFormatted: {
    //             required: false
    //         },
    //         valueHighlighted: {
    //             required: false
    //         },
    //         isHighlighted: {
    //             required: true
    //         },
    //         unitOfMeasure: {
    //             required: false
    //         },
    //         description: {
    //             required: false
    //         },
    //         defaultNavigationTarget: {
    //             required: false,
    //             aggregation: true
    //         },
    //         navigationTargets: {
    //             required: false,
    //             aggregation: true
    //         }
    //     }
    // },

    value;
    valueFormatted;
    valueHighlighted;
    isHighlighted;
    unitOfMeasure;
    description;
    defaultNavigationTarget;
    navigationTargets;
    iconUrl;
    tooltip;
    constructor(properties) {
      super(properties);
      this.value = properties.value;
      this.valueFormatted = properties.valueFormatted;
      this.valueHighlighted = properties.valueHighlighted;
      this.isHighlighted = properties.isHighlighted;
      this.unitOfMeasure = properties.unitOfMeasure;
      this.description = properties.description;
      this.setDefaultNavigationTarget(properties.defaultNavigationTarget);
      this.setNavigationTargets(properties.navigationTargets || []);
      this.metadata = properties.metadata;
      this.iconUrl = properties.iconUrl;
      this.tooltip = properties.tooltip;
    }
    setDefaultNavigationTarget(navigationTarget) {
      if (!navigationTarget) {
        this.defaultNavigationTarget = null;
        return;
      }
      this.defaultNavigationTarget = navigationTarget;
      navigationTarget.parent = this;
    }
    setNavigationTargets(navigationTargets) {
      this.navigationTargets = [];
      if (!navigationTargets) {
        return;
      }
      for (const navigationTarget of navigationTargets) {
        this.addNavigationTarget(navigationTarget);
      }
    }
    addNavigationTarget(navigationTarget) {
      this.navigationTargets.push(navigationTarget);
      navigationTarget.parent = this;
    }
    toString() {
      return this.label + ":" + this.valueFormatted;
    }
    getSubAttributes() {
      return [this];
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.SearchResultSetItemAttribute = SearchResultSetItemAttribute;
  return __exports;
});
})();