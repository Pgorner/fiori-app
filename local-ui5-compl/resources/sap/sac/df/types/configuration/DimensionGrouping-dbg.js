/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap */
sap.ui.define(
  "sap/sac/df/types/configuration/DimensionGrouping",
  [
  ],
  function(){
    /**
     * Dimension group presentation
     *
     * @enum {string}
     * @alias sap.sac.df.types.configuration.DimensionGrouping
     * @experimental since version 1.129
     * @private
     */
    var DimensionGrouping = {
      /**
       * Flat presentation without grouping
       * @public
       **/
      Flat: "flat",
      /**
       * Dimension grouping is present and collapsed
       * @public
       **/
      Collapsed: "allCollapsed",
      /**
       * Dimension grouping is present and expanded
       * @public
       **/
      Expanded: "allCollapsed"
    };
    return DimensionGrouping;
  }
);
