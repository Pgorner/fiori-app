/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap */
sap.ui.define("sap/sac/df/types/SortDirection", [],
  function(){
    /**
     * Sort Direction
     *
     * @enum {string}
     * @alias sap.sac.df.types.SortDirection
     * @public
     * @experimental since version 1.130
     */
    var SortDirection = {
      /**
       * Ascending
       * @public
       **/
      Ascending: "ASCENDING",
      /**
       * Descending
       * @public
       **/
      Descending: "DESCENDING",
      /**
       * No sorting
       * @public
       **/
      None: "NONE"
    };
    return SortDirection;
  }
);
