/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap */
sap.ui.define(
  "sap/sac/df/types/configuration/ContextMenuVariant",
  [
  ],
  function(){
    /**
     * Variant of context menu configuration
     *
     * @enum {string}
     * @alias sap.sac.df.types.configuration.ContextMenuVariant
     * @experimental since version 1.129
     * @private
     */
    var ContextMenuVariant = {
      /**
       * Default SAPUI5 configuration
       * @public
       **/
      sapui5: "sap-ui5",
      /**
       * Multidimensional Analysis configuration
       * @public
       **/
      mda: "mda",
      /**
       * Review Booklet configuration
       * @public
       **/
      reviewbooklet: "reviewbooklet"
    };
    return ContextMenuVariant;
  }
);
