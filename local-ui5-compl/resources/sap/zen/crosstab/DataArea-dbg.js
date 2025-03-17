/*!
 * (c) Copyright 2010-2019 SAP SE or an SAP affiliate company.
 */
/*global sap*/
sap.ui.define(
  [
    "jquery.sap.global",
    "sap/zen/crosstab/BaseArea",
    "sap/zen/crosstab/rendering/RenderingConstants"
  ],
  function(jQuery, BaseArea, RenderingConstants){
    "use strict";
    jQuery.sap.declare("sap.zen.crosstab.DataArea");
    sap.zen.crosstab.DataArea = function (oCrosstab) {
      BaseArea.call(this, oCrosstab);
      this.sAreaType = RenderingConstants.TYPE_DATA_AREA;
    };

    sap.zen.crosstab.DataArea.prototype = jQuery.sap.newObject(BaseArea.prototype);
    sap.zen.crosstab.DataArea.prototype.renderArea = function (oRenderManager) {
      this.renderContainerStructure(
        oRenderManager, "sapzencrosstab-DataArea",
        this.oCrosstab.isVCutOff(), this.oCrosstab.isHCutOff()
      );
    };
    sap.zen.crosstab.DataArea.prototype.insertCell = function (oCell, iRow, iCol) {
      sap.zen.crosstab.BaseArea.prototype.insertCell.call(this, oCell, iRow, iCol);
      if (iCol === this.oDataModel.getColCnt() - 1 && oCell) {
        oCell.addStyle(RenderingConstants.STYLE_LAST_IN_ROW);
      }
      if (iRow === this.oDataModel.getRowCnt() - 1 && oCell) {
        oCell.addStyle(RenderingConstants.STYLE_LAST_IN_COL);
      }
    };
    sap.zen.crosstab.DataArea.prototype.getSelectedCellsByHeaderSelection = function (oHeaderCell, bRemoveSelection) {
      var oResultCells = {};
      var oArea = oHeaderCell.getArea();
      if (oArea.isRowHeaderArea()) {
        var iStartRow = oHeaderCell.getRow();
        var iEndRow = 0;
        var iStartCol = 0;
        if (!bRemoveSelection) {
          iEndRow = Math.min((iStartRow + oHeaderCell.getRowSpan()), (this.getRenderStartRow() + this.getRenderRowCnt()));
          iStartCol = this.getRenderStartCol();

        } else {
          iEndRow = iStartRow + oHeaderCell.getRowSpan();
        }

        for (var i = iStartRow; i < iEndRow; i++) {
          var aCellsInRow =  this.oDataModel.getAllLoadedCellsByRow(this, i);
          for(var j = 0; j < aCellsInRow.length; j++) {
            oResultCells[aCellsInRow[j].getId()] = aCellsInRow[j];
          }
        }
      } else if (oArea.isColHeaderArea()) {
        var iEndCol = 0;
        if (!bRemoveSelection) {
          iEndCol = Math.min((iStartCol + oHeaderCell.getColSpan()), (this.getRenderStartCol() + this.getRenderColCnt()));
          iStartRow = this.getRenderStartRow();
        } else {
          iEndCol = iStartCol + oHeaderCell.getColSpan();
        }
        for (i = iStartCol; i < iEndCol; i++) {
          var aCellsInCol = this.oDataModel.getAllLoadedCellsByCol(this, i);
          for( j = 0; j < aCellsInCol.length; j++){
            oResultCells[aCellsInCol[j].getId()] = aCellsInCol[j];
          }
        }
      }
      return oResultCells;
    };
    return sap.zen.crosstab.DataArea;
  }
);
