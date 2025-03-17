/*!
 * (c) Copyright 2010-2019 SAP SE or an SAP affiliate company.
 */
/*global sap*/
sap.ui.define(
  [
    "jquery.sap.global",
    "sap/zen/crosstab/rendering/RenderingConstants",
    "sap/zen/crosstab/utils/Utils"
  ],
  function(jQuery, RenderingConstants, Utils){
    "use strict";
    jQuery.sap.declare("sap.zen.crosstab.CrosstabRenderer");
    /**
     * @class Crosstab renderer.
     * @static
     */
    sap.zen.crosstab.CrosstabRenderer = {};
    /**
     * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
     *
     * @param {sap.ui.core.RenderManager}
     *            oRenderManager the RenderManager that can be used for writing to the Render-Output-Buffer
     * @param {sap.ui.core.Control}
     *            oControl an object representation of the control that should be rendered
     */
    sap.zen.crosstab.CrosstabRenderer.render = function (rm, oControl) {
      oControl.prepareContainer();

      var sCrosstabWidth = oControl.getWidth();
      if (sCrosstabWidth === "auto") {
        sCrosstabWidth = "100%";
      }
      var sCrosstabHeight = oControl.getHeight();
      if (sCrosstabHeight === "auto") {
        sCrosstabHeight = "100%";
      }

      // write the HTML into the render manager
      rm.openStart("div", oControl);
      rm.style("overflow", "hidden");
      if (sCrosstabWidth) {
        rm.style("width", sCrosstabWidth);
      }
      if (sCrosstabHeight) {
        rm.style("height", sCrosstabHeight);
      }
      if (Utils.isMainMode()) {
        rm.class("sapzencrosstab-FontSize-MainMode");
      }
      rm.class("sapzencrosstab-CrosstabComponent");
      if(oControl.getTransferDataCommand() && oControl.getTransferDataCommand().length > 0){
        rm.class("sapzencrosstab-InputEnabled");
      }

      if (oControl.getRenderMode() === RenderingConstants.RENDERMODE_FILL) {
        rm.style("visibility", "hidden");
        rm.class("sapzencrosstab-TableDiv").class("sapzencrosstab-TableDivBackground");
      }
      rm.openEnd();
      if (oControl.getRenderMode() === RenderingConstants.RENDERMODE_COMPACT) {
        rm.openStart("div", oControl.getId() + "_altRenderModeTableDiv");
        rm.style("visibility", "hidden");
        rm.style("width", "100%");
        rm.style("height", "100%");
        rm.class("sapzencrosstab-TableDiv").class("sapzencrosstab-TableDivBackground");
        rm.openEnd();
      }
      rm.openStart("div", oControl.getId() + "_renderSizeDiv");
      rm.class("sapzencrosstab-RenderSizeDiv");
      rm.openEnd();

      rm.openStart("table", oControl.getId() + "_table");
      rm.class("sapzencrosstab-Crosstab");
      rm.openEnd(); // table element

      // first row
      rm.openStart("tr", oControl.getId() + "_upperSection");
      rm.openEnd();

      sap.zen.crosstab.CrosstabRenderer.writeCell(
        rm, oControl.getId() + "_upperLeft", oControl.getDimensionHeaderArea(),
        oControl
      );
      sap.zen.crosstab.CrosstabRenderer.writeCell(
        rm, oControl.getId() + "_upperRight", oControl.getColumnHeaderArea(),
        oControl
      );

      rm.close("tr");

      // second row
      rm.openStart("tr", oControl.getId() + "_lowerSection");
      rm.openEnd();

      sap.zen.crosstab.CrosstabRenderer.writeCell(
        rm, oControl.getId() + "_lowerLeft", oControl.getRowHeaderArea(),
        oControl
      );
      sap.zen.crosstab.CrosstabRenderer.writeCell(rm, oControl.getId() + "_lowerRight", oControl.getDataArea(), oControl);

      rm.close("tr");

      rm.close("table");
      rm.close("div");

      // Toolbar
      if (oControl.getPropertyBag().hasToolbar()) {
        rm.openStart("div", oControl.getId() + "_toolbar");
        rm.class("sapzencrosstab-ToolbarDiv");
        rm.style("position", "absolute");
        rm.style("bottom", "0px");
        rm.openEnd();
        rm.close("div");
      }

      rm.openStart("div", oControl.getId() + "_loadingAnimationDiv");
      rm.class("sapzencrosstab-loadingAnimationDiv");
      rm.style("visibility", "hidden");
      rm.openEnd();

      rm.openStart("div");
      rm.class("sapzencrosstab-loadingAnimation");
      rm.openEnd();
      rm.close("div");

      rm.close("div");

      // measure div to determine hierarchy width/height
      rm.openStart("div", oControl.getId() + "_measureDiv");
      rm.class(oControl.getPropertyBag().isCozyMode() ? "sapzencrosstab-HierarchyIndentCozy" : "sapzencrosstab-HierarchyIndent");
      rm.style("visibility", "none");
      rm.openEnd();
      rm.close("div");

      // exception measure div to determine symbol width
      rm.openStart("div", oControl.getId() + "_exceptionMeasureDiv");
      rm.class("sapzencrosstab-SymbolAlertDimensions");
      rm.style("visibility", "none");
      rm.openEnd();
      rm.close("div");

      // Resize div for moveable header resizer if the header can be resized by the user
      if (oControl.isUserHeaderResizeAllowed() && (oControl.hasDataArea() || oControl.hasColHeaderArea()) && (oControl.hasDimensionHeaderArea() || oControl.hasRowHeaderArea())) {
        rm.openStart("div", oControl.getId() + "_headerResizeHandle");
        rm.class("sapzencrosstab-headerResizeHandleWidth");
        rm.style("position", "absolute");
        rm.style("top", "0px");
        rm.style("height", "100%");
        rm.openEnd();
        rm.close("div");
      }

      // Column resize ruler
      if (oControl.getPropertyBag().isEnableColResize()) {
        rm.openStart("div", oControl.getId() + "_colResizeRuler");
        rm.class("sapzencrosstab-colResizeRuler");
        rm.style("visibility", "hidden");
        rm.openEnd();
        rm.close("div");
      }

      if (oControl.getRenderMode() === RenderingConstants.RENDERMODE_COMPACT) {
        rm.close("div");
      }

      rm.openStart("div", oControl.getId() + "_resizeFrame");
      rm.class("sapzencrosstab-TableDiv");
      rm.style("visibility", "hidden");
      rm.style("width", sCrosstabWidth);
      rm.style("height", sCrosstabHeight);
      rm.openEnd();
      rm.close("div");

      rm.openStart("div", oControl.getId() + "_resizeDiv");
      rm.class("sapzencrosstab-ResizeDiv");
      rm.style("width", "100%");
      rm.style("height", "100%");
      rm.style("visibility", "hidden");
      rm.openEnd();
      rm.close("div");

      if (oControl.getGlassPane().length === 0) {
        rm.openStart("div", oControl.getId() + "_glassPane");
        rm.style("position", "absolute");
        rm.style("top", "0px");
        if (oControl.getPropertyBag().isRtl()) {
          rm.style("right", "0px");
        } else {
          rm.style("left", "0px");
        }
        rm.style("width", "100%");
        rm.style("height", "100%");
        rm.openEnd();
        rm.close("div");
      }

      rm.close("div");
    };

    sap.zen.crosstab.CrosstabRenderer.writeCell = function (rm, sId, oArea, oControl) {
      rm.openStart("td", sId);
      rm.style("padding", "0px");
      rm.openEnd();
      rm.openStart("div", sId + "_scrollDiv");
      rm.style("overflow", "hidden");
      rm.openEnd();
      oArea.renderArea(rm, oControl);
      rm.close("div");
      rm.close("td");
    };
    return sap.zen.crosstab.CrosstabRenderer;
  }
);
