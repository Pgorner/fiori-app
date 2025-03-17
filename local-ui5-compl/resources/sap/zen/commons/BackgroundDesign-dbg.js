/*!
 * SAPUI5
    (c) Copyright 2009-2020 SAP SE. All rights reserved
  
 */
/*global sap*/
sap.ui.define(
  "sap/zen/commons/BackgroundDesign", [],
  function () {
    "use strict";
    /**
     * Background design (i.e. color), e.g. of a layout cell.
     *
     * @enum {string}
     * @public
     * @deprecated Since version 1.89.0, Please use the WD Grid control instead.
     */
    var BackgroundDesign = {
      /**
       *
       * A background design suitable for borders.
       *
       * @public
       */
      Border : "Border",
      /**
       *
       * An opaque background design that looks dark filled.
       *
       * @public
       */
      Fill1 : "Fill1",
      /**
       *
       * An opaque background design that looks medium filled.
       *
       * @public
       */
      Fill2 : "Fill2",
      /**
       *
       * An opaque background design that looks light filled.
       *
       * @public
       */
      Fill3 : "Fill3",
      /**
       *
       * A background design suitable for headers.
       *
       * @public
       */
      Header : "Header",
      /**
       *
       * A plain but opaque background design.
       *
       * @public
       */
      Plain : "Plain",
      /**
       *
       * A transparent background.
       *
       * @public
       */
      Transparent : "Transparent"
    };
    return BackgroundDesign;
  }
);
