/*!
 * (c) Copyright 2010-2019 SAP SE or an SAP affiliate company.
 */
/*global sap*/
sap.ui.define(
  [
    "sap/zen/crosstab/rendering/RenderingConstants",
    "sap/zen/crosstab/IHeaderCell",
    "sap/zen/crosstab/TextConstants",
    "sap/zen/crosstab/utils/Utils"
  ],
  function(RenderingConstants, IHeaderCell, TextConstants, Utils) {
    "use strict";
    /**
     * @namespace HeaderCell renderer.
     * @alias sap.zen.crosstab.HeaderCellRenderer
     */
    var HeaderCellRenderer = {
      apiVersion: 1 // still uses rm.write to write cell content which might contain markup
    };
    /**
     * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
     *
     * @param {sap.ui.core.RenderManager}
     *            rm the RenderManager that can be used for writing to the Render-Output-Buffer
     * @param {sap.zen.crosstab.HeaderCell}
     *            oControl an object representation of the control that should be rendered
     */
    HeaderCellRenderer.render = function (rm, oControl) {
      var oArea = oControl.getArea();
      var fRenderCallback = oArea.getRenderCellCallback();
      var oCrosstab = oArea.getCrosstab();
      var iRowspan = oControl.getEffectiveRowSpan();
      var iColspan = oControl.getEffectiveColSpan();
      var oAdditionalStyles = null;
      if (fRenderCallback) {
        var oCallbackResult = fRenderCallback(new IHeaderCell(oControl));
        oAdditionalStyles = oCallbackResult.additionalStyles;
      }
      // Text to be rendered
      var sRenderText = oControl.getFormattedText();
      var sSort = oControl.getSort();
      var sDrillState = oControl.getDrillState();
      // Styles
      var sCssClasses = oControl.getCssClassNames(oCrosstab.isIE8Mode(), oCrosstab.getPropertyBag().isRtl(), oCrosstab.getUtils().isMsIE());
      if (sSort) {
        // Empty css class to enable hover effects
        sCssClasses += " sapzencrosstab-HeaderCellSortable";
      }
      if (sDrillState) {
        sCssClasses += " sapzencrosstab-HeaderCellHierarchy";
      }
      // write the HTML into the render manager
      rm.openStart("td", oControl);
      rm.attr("class", sCssClasses);
      rm.attr("tabindex", RenderingConstants.TABINDEX);
      if (iColspan > 1) {
        rm.attr("colspan", iColspan);
      }
      if (iRowspan > 1) {
        rm.attr("rowspan", iRowspan);
      }
      rm.openEnd(); // td element
      // cell layout div
      rm.openStart("div", oControl.getId() + "_cellLayoutDiv");
      rm.attr("tabindex", RenderingConstants.TABINDEX);
      rm.class("sapzencrosstab-cellLayoutDiv");
      if (oControl.isEntryEnabled()) {
        // prepare for postprocessing logic workaround in adjustColWidths of RenderEngine
        rm.style("width", "0px");
      }
      rm.openEnd(); // div element
      if (oControl.isEntryEnabled()) {
        rm.openStart("table").style("width", "100%").style("border-spacing", "0px").openEnd().openStart("tbody").openEnd();
        rm.openStart("tr").openEnd();
        rm.openStart("td").style("width", "100%").style("padding", "0px 5px 0px 0px").openEnd();
      }
      // cell content div
      rm.openStart("div", oControl.getId() + "_contentDiv");
      rm.attr("tabindex",RenderingConstants.TABINDEX);
      // tooltip
      if (sRenderText) {
        rm.attr("title", sRenderText);
      }
      rm.class("sapzencrosstab-HeaderCellContentDiv");
      if (oControl.isLoading()) {
        rm.class("sapzencrosstab-LoadingCellContentDiv");
      }
      if (oAdditionalStyles) {
        for ( var sStyleKey in oAdditionalStyles) {
          rm.style(sStyleKey, oAdditionalStyles[sStyleKey]);
        }
      }
      if (oControl.isEntryEnabled()) {
        rm.style("width", "100%");
      }
      rm.openEnd(); // div element
      renderCellContent();
      renderColResizer();
      rm.close("div"); // cell content div
      rm.close("div"); // cell layout div
      if (oControl.isEntryEnabled()) {
        rm.close("td");
        rm.openStart("td").style("padding", "0px").openEnd();
        rm.openStart("div", "vhlp_" + oControl.getId());
        rm.class("sapzencrosstab-HeaderCellDivValueHelp" + (Utils.isMainMode() ? "-MainMode" : ""));
        rm.class("sapzencrosstab-HeaderCellValueHelp");
        rm.openEnd();
        rm.close("div");
        rm.close("td");
        rm.close("tr");
        rm.close("tbody").close("table");
      }
      rm.close("td");
      function renderCellContent() {
        if (sSort || sDrillState) {
          createCellContentTable(sSort, sDrillState);
        } else {
          rm.write(sRenderText);
        }
      }
      function createCellContent() {
        rm.openStart("div", oControl.getId() + "_textContentDiv");
        rm.attr("tabindex", RenderingConstants.TABINDEX);
        // ellipsis handling when content is too large
        rm.style("overflow", "hidden");
        rm.style("text-overflow", "ellipsis");
        rm.openEnd();
        rm.write(sRenderText);
        rm.close("div");
      }
      function createCellContentTable() {
        rm.openStart("table").openEnd().openStart("tbody").openEnd();
        insertColHeaderHierarchySpacerLinesBefore();
        rm.openStart("tr").openEnd();
        insertHierarchyActionImage();
        insertTextContent();
        insertSortingImage();
        insertRowHeaderHierarchSpacerDivAfter();
        rm.close("tr");
        insertColHeaderHierarchySpacerLinesAfter();
        rm.close("tbody").close("table");
      }
      function insertHierarchyActionImage() {
        if (sDrillState) {
          var iLevel = oControl.getLevel();
          var isRowHeaderArea = oControl.getArea().isRowHeaderArea();
          var sClass = "sapzencrosstab-HeaderCellDivHierarchy ";
          if (oControl.getHierarchyAction()) {
            if (sDrillState === "O") {
              sClass += "sapzencrosstab-CollapseNode";
              if (oControl.getNodeAlignment() === "bottom") {
                sClass += " sapzencrosstab-BottomNode";
              }
            } else if (sDrillState === "C") {
              sClass += "sapzencrosstab-ExpandNode";
              if (sap.ui.getCore().getConfiguration().getRTL()) {
                sClass += "-RTL";
              }
            }
            if (sDrillState === "O" || sDrillState === "C") {
              sClass += " sapzencrosstab-PointerCursor";
            }
          }
          // insert space before text
          if (iLevel > 0) {
            if (isRowHeaderArea) {
              var iWidth = iLevel * oCrosstab.getHierarchyIndentWidth();
              rm.openStart("td").openEnd();
              rm.openStart("div");
              rm.attr("tabindex", RenderingConstants.TABINDEX);
              rm.style("width", iWidth + "px");
              rm.class("sapzencrosstab-HierarchySpacerDivBefore");
              rm.attr("xtabspacer-cellid", oControl.getId());
              rm.openEnd().close("div");
              rm.close("td");
            }
          }
          if ((sDrillState === "L" && iLevel > 0) || sDrillState !== "L") {
            rm.openStart("td").openEnd();
            if (oControl.getHierarchyAction()) {
              rm.openStart("div", "hier_" + oControl.getId());
            } else {
              rm.openStart("div");
            }
            rm.attr("class", sClass);
            // Tooltip
            var sHierarchyTooltip = oControl.getHierarchyTooltip();
            if (sHierarchyTooltip) {
              rm.attr("title", sHierarchyTooltip);
            }
            rm.openEnd().close("div");
            rm.close("td");
          }
        }
      }
      function insertTextContent() {
        rm.openStart("td").openEnd();
        createCellContent();
        rm.close("td");
      }
      function createSortingImage() {
        if (sSort) {
          var iTextIndex = 0;
          rm.openStart("div", "sort_" + oControl.getId());
          rm.class("sapzencrosstab-HeaderCellDivSortable");
          if (sSort === "NONE") {
            rm.class("sapzencrosstab-HeaderCellSortNone");
            iTextIndex = 0;
          } else if (sSort === "ASC") {
            rm.class("sapzencrosstab-HeaderCellSortAsc");
            iTextIndex = 1;
          } else if (sSort === "DESC") {
            rm.class("sapzencrosstab-HeaderCellSortDesc");
            iTextIndex = 2;
          }
          // Tooltip
          var sSortTooltip = oCrosstab.getPropertyBag().getSortingToolTip(iTextIndex);
          if (sSortTooltip) {
            rm.attr("title", sSortTooltip);
          }
          rm.openEnd().close("div");
        }
      }
      function insertSortingImage() {
        if (sSort) {
          rm.openStart("td").openEnd();
          createSortingImage();
          rm.close("td");
        }
      }
      function insertRowHeaderHierarchSpacerDivAfter () {
        if (sDrillState && oControl.getArea().isRowHeaderArea()) {
          var iLevel = oControl.getLevel();
          var iMaxLevel = oCrosstab.getRowHeaderHierarchyLevels()[oControl.getCol()];
          var iDiff = iMaxLevel - iLevel;
          if (iDiff > 0) {
            var iWidth = iDiff * oCrosstab.getHierarchyIndentWidth();
            rm.openStart("td").openEnd();
            rm.openStart("div");
            rm.attr("tabindex", RenderingConstants.TABINDEX);
            rm.style("width", iWidth + "px");
            rm.class("sapzencrosstab-HierarchySpacerDivAfter");
            rm.attr("xtabspacer-cellid", oControl.getId());
            rm.openEnd().close("div");
            rm.close("td");
          }
        }
      }
      function insertColHeaderHierarchySpacerLinesBefore() {
        if (sDrillState) {
          var iLevel = oControl.getLevel();
          if (iLevel > 0 && oControl.getArea().isColHeaderArea()) {
            var iHeight = iLevel * oCrosstab.getHierarchyIndentHeight();
            rm.openStart("tr").openEnd().openStart("td").openEnd();
            rm.openStart("div");
            rm.attr("tabindex", RenderingConstants.TABINDEX);
            rm.class("sapzencrosstab-HierarchySpacerLinesBefore");
            rm.attr("xtabspacer-cellid", oControl.getId());
            rm.style("height", iHeight + "px");
            rm.openEnd().close("div");
            rm.close("td").close("tr");
          }
        }
      }
      function insertColHeaderHierarchySpacerLinesAfter () {
        if (sDrillState && oControl.getArea().isColHeaderArea()) {
          var iLevel = oControl.getLevel();
          var iMaxLevel = oCrosstab.getColHeaderHierarchyLevels()[oControl.getRow()];
          var iDiff = iMaxLevel - iLevel;
          if (iDiff > 0) {
            var iHeight = iDiff * oCrosstab.getHierarchyIndentHeight();
            rm.openStart("tr").openEnd().openStart("td").openEnd();
            rm.openStart("div");
            rm.attr("tabindex", RenderingConstants.TABINDEX);
            rm.class("sapzencrosstab-HierarchySpacerLinesAfter");
            rm.attr("xtabspacer-cellid", oControl.getId());
            rm.style("height", iHeight + "px");
            rm.openEnd().close("div");
            rm.close("td").close("tr");
          }
        }
      }
      function renderColResizer() {
        if (oCrosstab.getPropertyBag().isEnableColResize() === true) {
          if (oArea.isColHeaderArea() || oArea.isDimHeaderArea()) {
            if (oCrosstab.getPropertyBag().isTestMobileMode() || oCrosstab.getPropertyBag().isMobileMode()) {
              oControl.setMobileResize(true);
            } else {
              // resize handle div
              rm.openStart("div", "resi_" + oControl.getId());
              if(sSort){
                //Some themes need a different spacing for the resize handle if a sort icon is present in the same cell
                rm.class("sapzencrosstab-columnResizeHandleWithSort");
              } else {
                rm.class("sapzencrosstab-columnResizeHandle");
              }
              rm.attr("title", oCrosstab.getPropertyBag().getText(
                TextConstants.COLWIDTH_ADJUST_TEXT_KEY));
              rm.openEnd(); // div element
              rm.close("div");
              oControl.setMobileResize(false);
            }
          }
        }
      }
    };

    return HeaderCellRenderer;

  }, true
);
