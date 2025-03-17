/*!
 * SAPUI5
    (c) Copyright 2009-2020 SAP SE. All rights reserved
  
 */
/*global sap*/
sap.ui.define(
  "sap/zen/commons/Padding", [],
  function () {
    "use strict";
    /**
     * Padding, e.g. of a layout cell's content within the cell's borders.
     * Note that all options except "None" include a padding of 2px at the top and
     * bottom, and differ only in the presence of a 4px padding towards the beginning
     * or end of a line, in the current locale's writing direction.
     *
     * @enum {string}
     * @public
     * @alias sap.zen.commons.Padding
     * @deprecated Since version 1.89.0, Please use the WD Grid control instead.
     * @experimental
     */
    var Padding = {
      /**
       *
       * No padding at all.
       *
       * @public
       */
      None : "None",
      /**
       *
       * Top and bottom padding of 2px.
       * Padding of 4px towards the beginning of a line, in the current locale's
       * writing direction, but none towards its end.
       *
       * @public
       */
      Begin : "Begin",
      /**
       *
       * Top and bottom padding of 2px.
       * Padding of 4px towards the end of a line, in the current locale's
       * writing direction, but none towards its beginning.
       *
       * @public
       */
      End : "End",
      /**
       *
       * Top and bottom padding of 2px.
       * Padding of 4px towards both the beginning and end of a line.
       *
       * @public
       */
      Both : "Both",
      /**
       *
       * Top and bottom padding of 2px.
       * No padding towards neither the beginning nor end of a line.
       *
       * @public
       */
      Neither : "Neither"
    };
    return Padding;
  }
);
