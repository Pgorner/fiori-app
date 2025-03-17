/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
  [
    "jquery.sap.global"
  ],
  function(jQuery){
    jQuery.sap.declare("sap.zen.dsh.DshRenderer");
    /**
     * @class dsh renderer.
     * @static
     */
    var DshRenderer =  sap.zen.dsh.DshRenderer = {
      apiVersion: 2
    };
    /**
     * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
     *
     * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
     * @param {sap.zen.dsh.Dsh} oControl an object representation of the control that should be rendered
     */
    DshRenderer.render = function(oRm, oControl){
      // write the HTML into the render manager
      oRm.openStart("div", oControl);

      oRm.style("width", oControl.getWidth());
      oRm.style("height", oControl.getHeight());

      oRm.class("sapZenDshDsh");
      oRm.class("sapUiBody");
      oRm.openEnd();
      oRm.openStart("div", oControl.getId() + "sapbi_snippet_ROOT");
      oRm.class("sapbi_snippet_ROOT");
      oRm.class("sapUiBody");
      oRm.style("width", "100%");
      oRm.style("height", "100%");
      oRm.openEnd();
      oRm.close("div");
      oRm.close("div");
    };
    
    return DshRenderer;
  }
);
