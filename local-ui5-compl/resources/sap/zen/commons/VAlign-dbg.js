/*!
 * SAPUI5
    (c) Copyright 2009-2020 SAP SE. All rights reserved
  
 */
/*global sap*/
sap.ui.define(
  "sap/zen/commons/VAlign", [],
  function () {
    "use strict";
    /**
     * Vertical alignment, e.g. of a layout cell's content within the cell's borders.
     *
     * @enum {string}
     * @public
     * @alias sap.zen.commons.VAlign
     * @deprecated Since version 1.89.0, Please use the WD Grid control instead.
     */
    var VAlign = {
      /**
       *
       * Aligned at the bottom.
       *
       * @public
       */
      Bottom : "Bottom",
      /**
       *
       * Vertically centered.
       *
       * @public
       */
      Middle : "Middle",
      /**
       *
       * Aligned at the top.
       *
       * @public
       */
      Top : "Top"
    };
    return VAlign;
  }
);
