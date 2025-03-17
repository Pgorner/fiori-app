/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap*/

// To enable the loading of our thirdparty grid bundle and also get access to the exported objects,
// we have to tell ui5 what the bundle exports globally and ues a shim for this.
sap.ui.loader.config({
  shim: {
    "sap/sac/df/thirdparty/sac.internal.grid.prod.2.24.0-f9585dd81ddf2dd4978f59850f7ddd20bebac8f5": {
      amd: true,
      exports: "sapSacGrid" // name of the global variable under which we export our external API
    },
    "sap/sac/df/thirdparty/interact":{
      amd: true,
      exports: "interact"
    },
    "sap/sac/df/thirdparty/antlr3-all-min": {
      amd: true,
      exports: "org"
    }
  }
});

/**
 * Initialization Code and shared classes of library sap.sac.df.
 */
sap.ui.define(
  [
    "sap/sac/df/types/SystemType",
    "sap/sac/df/thirdparty/sac.internal.grid.prod.2.24.0-f9585dd81ddf2dd4978f59850f7ddd20bebac8f5",
    "sap/ui/core/Lib",
    "sap/ui/dom/includeStylesheet",
    "sap/sac/df/thirdparty/interact",
    "sap/ui/core/library",
    "sap/ui/layout/library",
    "sap/ui/layout/cssgrid/GridBasicLayout",
    "sap/ui/table/library",
    "sap/f/library",
    "sap/m/library",
    "sap/sac/df/utils/FpaIcons",
    "sap/sac/df/thirdparty/antlr3-all-min"
  ],
  function(
    SystemType,
    sapSacGrid,
    Library,
    IncludeStylesheet
  ) {
    /**
     * Dragonfly Library.  Provides models and control to access Multidimensional Data via InA protocol and Firefly library
     *
     * @namespace
     * @alias sap.sac.df
     * @public
     * @experimental
     * @author SAP SE
     * @version 1.132.0
     */

    var thisLib = Library.init(
      {
        name: "sap.sac.df",
        dependencies: [
          "sap.ui.core",
          "sap.ui.layout",
          "sap.ui.table",
          "sap.m",
          "sap.ui.mdc",
          "sap.ui.fl",
          "sap.tnt"
        ],
        types: [
          "sap.sac.df.types.SystemType"
        ],
        interfaces: [],
        controls: [
          "sap.sac.df.FlexAnalysis",
          "sap.sac.df.Grid",
          "sap.sac.df.DesignerPanel",
          "sap.sac.df.FilterBar",
          "sap.sac.df.FilterPanel"
        ],
        elements: [
          "sap.sac.df.FlexAnalysisPanel"
        ],
        version: "1.132.0",
        extensions: {
          flChangeHandlers: {
            "sap.sac.df.FilterBar": "sap/ui/mdc/flexibility/FilterBar",
            "sap.sac.df.changeHandler.MultiDimModelChangeHandler": "sap/sac/df/changeHandler/flexibility/MultiDimModelChangeHandler",
            "sap.sac.df.changeHandler._ModelChangeHandler": "sap/sac/df/changeHandler/flexibility/_ModelChangeHandler"
          }
        }
      }
    );

    IncludeStylesheet(sap.ui.require.toUrl("sap/sac/df/firefly/css/firefly.styles.css"));
    IncludeStylesheet(sap.ui.require.toUrl("sap/sac/df/firefly/css/firefly.styles.sapui5.css"));

    thisLib.types = {};
    /**
     *  @alias sap.sac.df.types.SystemType
     */
    thisLib.types.SystemType = SystemType;

    window.sactable = sapSacGrid;
    return thisLib;
  }
);
