/*!
 * (c) Copyright 2010-2019 SAP SE or an SAP affiliate company.
 */
/*global sap*/
sap.ui.define(
  [
    "sap/zen/crosstab/rendering/RenderingConstants",
    "sap/zen/crosstab/IDataCell"
  ],
  function(RenderingConstants, IDataCell){
    "use strict";
    /**
     * @namespace DataCell renderer.
     * @alias sap.zen.crosstab.DataCell
     */
    var DataCellRenderer = {
      apiVersion: 1  // needs to be in sync with HeaderCellRenderer.js
    };
    /**
     * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
     *
     * @param {sap.ui.core.RenderManager}
     *            rm the RenderManager that can be used for writing to the Render-Output-Buffer
     * @param {sap.zen.crosstab.DataCell}
     *            oControl an object representation of the control that should be rendered
     */
    DataCellRenderer.render = function (rm, oControl) {
      "use strict";
      var oArea = oControl.getArea();
      var oCrosstab = oArea.getCrosstab();
      var fRenderCallback = oArea.getRenderCellCallback();
      var sRenderText = oControl.getText();
      var oAdditionalStyles = null;
      if (fRenderCallback) {
        var oCallbackResult = fRenderCallback(new IDataCell(oControl));
        oAdditionalStyles = oCallbackResult.additionalStyles;
        sRenderText = oCallbackResult.renderText;
      }
      // write the HTML into the render manager
      rm.openStart("td", oControl);
      var sCssClasses = oControl.getCssClassNames(oCrosstab.isIE8Mode(), oCrosstab.getPropertyBag().isRtl(), oCrosstab.getUtils().isMsIE());
      rm.attr("class", sCssClasses);
      rm.attr("tabindex", RenderingConstants.TABINDEX);
      rm.openEnd(); // SPAN element
      rm.openStart("div", oControl.getId() + "_contentDiv");
      rm.attr("tabindex", RenderingConstants.TABINDEX);
      rm.class("sapzencrosstab-DataCellContentDiv");
      if (oControl.isLoading()) {
        rm.class("sapzencrosstab-LoadingCellContentDiv");
      }
      if (oAdditionalStyles) {
        for ( var sStyleKey in oAdditionalStyles) {
          rm.sStyle(sStyleKey, oAdditionalStyles[sStyleKey]);
        }
      }
      rm.openEnd();
      rm.text(sRenderText);
      rm.close("div");
      rm.close("td");
    };
    return DataCellRenderer;
  }, true
);
