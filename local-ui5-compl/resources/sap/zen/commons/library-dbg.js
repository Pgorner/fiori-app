/*!
 * SAPUI5
    (c) Copyright 2009-2020 SAP SE. All rights reserved
  
 */
/*global sap*/
sap.ui.define(
  [
    "sap/zen/commons/utils/jQuery",
    "sap/base/Log",
    "sap/zen/commons/BackgroundDesign",
    "sap/zen/commons/HAlign",
    "sap/zen/commons/VAlign",
    "sap/zen/commons/Padding",
    "sap/zen/commons/Separation",
    "sap/ui/core/library",
    "sap/m/library",
    "sap/ui/layout/library"
  ],
  function(
    jQuery, Log, BackgroundDesign, HAlign, VAlign, Padding, Separation
  ) {
    "use strict";
    /**
     * Common basic controls, mainly intended for desktop scenarios
     *
     * @namespace
     * @name sap.zen.commons
     * @author SAP SE
     * @version 1.132.0
     * @public
     */
    // delegate further initialization of this library to the Core
    sap.ui.getCore().initLibrary({
      name : "sap.zen.commons",
      version: "1.132.0",
      dependencies : ["sap.ui.core","sap.ui.layout","sap.m"],
      types: [
        "sap.zen.commons.BackgroundDesign",
        "sap.zen.commons.HAlign",
        "sap.zen.commons.Padding",
        "sap.zen.commons.Separation",
        "sap.zen.commons.VAlign"
      ],
      interfaces: [
      ],
      controls: [
        "sap.zen.commons.layout.AbsoluteLayout",
        "sap.zen.commons.layout.MatrixLayout"
      ],
      elements: [
        "sap.zen.commons.layout.MatrixLayoutCell",
        "sap.zen.commons.layout.MatrixLayoutRow",
        "sap.zen.commons.layout.PositionContainer"
      ]
    });
    /**
     * Design Studio Commons Library.
     * Intended only to be used within S/4 HANA Fiori applications.
     * @namespace
     * @name sap.zen.commons
     * @author SAP SE
     * @public
     */
    var thisLib = sap.zen.commons;
    thisLib.BackgroundDesign = BackgroundDesign;
    thisLib.HAlign = HAlign;
    thisLib.Padding = Padding;
    thisLib.Separation = Separation;
    thisLib.VAlign = VAlign;
    thisLib.Log = Log;
    return sap.zen.commons;
  }
);
