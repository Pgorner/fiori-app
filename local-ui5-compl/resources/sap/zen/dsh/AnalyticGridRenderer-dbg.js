/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
  [
    "jquery.sap.global",
    "sap/base/Log",
    "sap/zen/dsh/DshRenderer"
  ],
  function(jQuery,Log, DshRenderer){
    Log.info("Loading Analytic Grid Renderer");
    jQuery.sap.declare("sap.zen.dsh.AnalyticGridRenderer");
    sap.zen.dsh.AnalyticGridRenderer = DshRenderer;
    
    return DshRenderer;
  }
);
