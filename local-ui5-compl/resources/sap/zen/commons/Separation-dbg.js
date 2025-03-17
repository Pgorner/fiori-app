/*!
 * SAPUI5
    (c) Copyright 2009-2020 SAP SE. All rights reserved
  
 */
/*global sap*/
sap.ui.define(
  "sap/zen/commons/Separation", [],
  function () {
    "use strict";
    /**
     * Separation, e.g. of a layout cell from its neighbor, via a vertical gutter of
     * defined width, with or without a vertical line in its middle.
     *
     * @enum {string}
     * @public
     * @alias sap.zen.commons.Separation
     * @deprecated Since version 1.89.0, Please use the WD Grid control instead.
     */
    var Separation = {
      /**
       *
       * No gutter at all (0px), and without a vertical line, of course.
       *
       * @public
       */
      None : "None",
      /**
       *
       * A small (17px) vertical gutter without a vertical line.
       *
       * @public
       */
      Small : "Small",
      /**
       *
       * A small (17px) vertical gutter with a vertical line in its middle.
       *
       * @public
       */
      SmallWithLine : "SmallWithLine",
      /**
       *
       * A medium (31px) vertical gutter without a vertical line.
       *
       * @public
       */
      Medium : "Medium",
      /**
       *
       * A medium (31px) vertical gutter with a vertical line in its middle.
       *
       * @public
       */
      MediumWithLine : "MediumWithLine",
      /**
       *
       * A large (63px) vertical gutter without a vertical line.
       *
       * @public
       */
      Large : "Large",
      /**
       *
       * A large (63px) vertical gutter with a vertical line in its middle.
       *
       * @public
       */
      LargeWithLine : "LargeWithLine"
    };
    return Separation;
  }
);