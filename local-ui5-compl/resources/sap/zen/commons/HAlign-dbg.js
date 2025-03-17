/*!
 * SAPUI5
    (c) Copyright 2009-2020 SAP SE. All rights reserved
  
 */
/*global sap*/
sap.ui.define(
  "sap/zen/commons/HAlign", [],
  function () {
    "use strict";
    /**
     * Horizontal alignment, e.g. of a layout cell's content within the cell's borders.
     * Note that some values depend on the current locale's writing direction while
     * others do not.
     *
     * @enum {string}
     * @alias sap.zen.commons.HAlign
     * @public
     * @deprecated Since version 1.89.0, Please use the WD Grid control instead.
     */
    var HAlign = {
      /**
       *
       * Aligned towards the beginning of a line, in the current locale's writing direction.
       *
       * @public
       */
      Begin : "Begin",
      /**
       *
       * Horizontally centered.
       *
       * @public
       */
      Center : "Center",
      /**
       *
       * Aligned towards the end of a line, in the current locale's writing direction.
       *
       * @public
       */
      End : "End",
      /**
       *
       * Left aligned, regardless of the current locale's writing direction.
       *
       * @public
       */
      Left : "Left",
      /**
       *
       * Right aligned, regardless of the current locale's writing direction.
       *
       * @public
       */
      Right : "Right"
    };
    return HAlign;
  }
);
