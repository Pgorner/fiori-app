/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap*/
/**
 * Initialization Code and shared classes of library sap.zen.dsh.
 */
sap.ui.define(
  [
    "sap/zen/dsh/ValueHelpRangeOperation",
    "sap/zen/dsh/utils/dependencies",
    "sap/ui/core/library",
    "sap/ui/layout/library",
    "sap/ui/table/library",
    "sap/m/library",
    "sap/ui/generic/app/library",
    "sap/zen/commons/library",
    "sap/zen/crosstab/library",
    "sap/sac/df/library",
    "sap/ui/comp/library",
    "sap/m/library",
  ],
  function(
    ValueHelpRangeOperation
  ) {
    /**
     * Design Studio Runtime Library.  Intended only to be used within S/4 HANA Fiori applications.
     *
     * @namespace
     * @alias sap.zen.dsh
     * @public
     * @author SAP SE
     * @version 1.132.0
     */
    var thisLib = sap.ui.getCore().initLibrary(
      {
        name : "sap.zen.dsh",
        dependencies : [
          "sap.ui.core",
          "sap.ui.table",
          "sap.ui.layout",
          "sap.m",
          "sap.zen.commons",
          "sap.zen.crosstab",
          "sap.sac.df"
        ],
        components:[],
        types: [],
        interfaces: [],
        controls: [
          "sap.zen.dsh.AnalyticGrid",
          "sap.zen.dsh.Dsh"
        ],
        models:[
        ],
        elements: [],
        noLibraryCSS: true,
        version: "1.132.0"
      }
    );
   
    thisLib.ValueHelpRangeOperation = ValueHelpRangeOperation;
    return thisLib;
  }
);
