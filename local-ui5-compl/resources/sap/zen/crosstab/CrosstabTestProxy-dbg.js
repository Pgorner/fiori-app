/*!
 * (c) Copyright 2010-2019 SAP SE or an SAP affiliate company.
 */
/*global sap*/
sap.ui.define(
  [
    "jquery.sap.global",
    "sap/zen/crosstab/ColResizer"
  ],
  function(jQuery, ColResizer){
    "use strict";
    jQuery.sap.declare("sap.zen.crosstab.CrosstabTestProxy");
    sap.zen.crosstab.CrosstabTestProxy = function(oCrosstab, oEventHandler) {
      var bTestAction = false;
      var oColResizer = new ColResizer(oCrosstab);
      function fireHoverOrSelect(oArea, iRow, iCol, fAction) {
        var oCell = oArea.getDataModel().getCellWithSpan(iRow, iCol);
        if (oCell) {
          var e = {};
          var oDomCell = jQuery(document.getElementById(oCell.getId()));
          if (oDomCell && oDomCell.length > 0) {
            e.target = oDomCell[0];
            fAction(e);
          }
        }
      }
      this.hoverCell = function (oArea, iRow, iCol) {
        fireHoverOrSelect(oArea, iRow, iCol, oEventHandler.executeOnMouseEnter);
      };
      this.selectCell = function (oArea, iRow, iCol) {
        fireHoverOrSelect(oArea, iRow, iCol, oEventHandler.executeOnClickAction);
      };
      this.setTestAction = function(bIsTestAction) {
        bTestAction = bIsTestAction;
      };
      this.getTestAction = function() {
        return bTestAction;
      };
      this.testClickSortOrHierarchy = function(oArea, iRow, iCol) {
        var oCell = oArea.getDataModel().getCellWithSpan(iRow, iCol);
        if (oCell) {
          var oTarget = jQuery("#sort_" + oCell.getId());
          if (oTarget && oTarget.length > 0) {
            var e = {};
            e.target = oTarget[0];
            oEventHandler.executeOnClickAction(e);
          }
        }
      };
      this.doubleClickColResize = function (iRow, iCol) {
        var oCell = oCrosstab.getColumnHeaderArea().getCell(iRow, iCol);
        if (oCell) {
          var sId = "resi_" + oCell.getId();
          var e = {};
          e.target = {};
          e.target.id = sId;
          oColResizer.onDoubleClick(e);
        }
      };
    };
    return sap.zen.crosstab.CrosstabTestProxy;
  }
);
