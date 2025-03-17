/*!
 * (c) Copyright 2010-2019 SAP SE or an SAP affiliate company.
 */
/*global sap*/
sap.ui.define(
  [
    "jquery.sap.global",
    "sap/ui/core/Control",
    "sap/zen/crosstab/IHeaderCell",
    "sap/zen/crosstab/CellStyleHandler",
    "sap/zen/crosstab/HeaderCellRenderer",
    "sap/zen/crosstab/rendering/RenderingConstants",
    "sap/zen/crosstab/utils/Utils",
    "sap/zen/crosstab/library"
  ],
  function(
    jQuery, Control, IHeaderCell, CellStyleHandler, HeaderCellRenderer,
    RenderingConstants
  ){
    "use strict";
    // Provides control sap.zen.crosstab.HeaderCell.
    jQuery.sap.declare("sap.zen.crosstab.HeaderCell");
    /**
     * Constructor for a new HeaderCell.
     *
     * @param {string} [sId] id for the new control, generated automatically if no id is given
     * @param {object} [mSettings] initial settings for the new control
     *
     * @class
     * Add your documentation for the new HeaderCell
     * @extends sap.ui.core.Control
     *
     * @constructor
     * @public
     * @deprecated As of version 1.89.0, please use the WD Grid control instead.
     * @alias sap.zen.crosstab.HeaderCell
     */
    var HeaderCell = Control.extend("sap.zen.crosstab.HeaderCell", /** @lends sap.zen.crosstab.HeaderCell.prototype */ {
      metadata : {

        library : "sap.zen.crosstab",
        properties : {

          /**
           * Rowspan of the cell
           */
          rowSpan : {type : "int", group : "Misc", defaultValue : null},

          /**
           * Colspan of the cell
           */
          colSpan : {type : "int", group : "Misc", defaultValue : null},

          /**
           * Text of the cell
           */
          text : {type : "string", group : "Misc", defaultValue : null},

          /**
           * helper to format the cell
           */
          formatter : {type : "object", group : "Misc", defaultValue : null},

          /**
           * whether to merge the cell if the keys are equal
           */
          mergeKey : {type : "string", group : "Misc", defaultValue : null},

          /**
           * sorting
           */
          sort : {type : "string", group : "Misc", defaultValue : null},

          /**
           * sort action
           */
          sortAction : {type : "string", group : "Misc", defaultValue : null},

          /**
           * area of the cell
           */
          area : {type : "object", group : "Misc", defaultValue : null},

          /**
           * the effective col span
           */
          effectiveColSpan : {type : "int", group : "Misc", defaultValue : null},

          /**
           * the effective row span
           */
          effectiveRowSpan : {type : "int", group : "Misc", defaultValue : null},

          /**
           * the row of the cell in the crosstab
           */
          row : {type : "int", group : "Misc", defaultValue : null},

          /**
           * the column of the cell in the crosstab
           */
          col : {type : "int", group : "Misc", defaultValue : null},

          /**
           * the level of the cell
           */
          level : {type : "int", group : "Misc", defaultValue : null},

          /**
           * the drillstate of the cell
           */
          drillState : {type : "string", group : "Misc", defaultValue : null},

          /**
           * the hierarchy action of the cell
           */
          hierarchyAction : {type : "string", group : "Misc", defaultValue : null},

          /**
           * the hierarchy tooltip
           */
          hierarchyTooltip : {type : "string", group : "Misc", defaultValue : null},

          /**
           * the IE8 row span
           * @deprecated As of version 1.89.0, the concept has been discarded.
           */
          htmlIE8RowSpan : {type : "int", group : "Misc", defaultValue : 1},

          /**
           * the text sort index
           */
          sortTextIndex : {type : "int", group : "Misc", defaultValue : null},

          /**
           * the row of the tabe
           */
          tableRow : {type : "int", group : "Misc", defaultValue : null},

          /**
           * the column of the table
           */
          tableCol : {type : "int", group : "Misc", defaultValue : null},

          /**
           * the alignment of the cell
           */
          alignment : {type : "string", group : "Misc", defaultValue : null},

          /**
           * the id of the associated member
           */
          memberId : {type : "string", group : "Misc", defaultValue : null},

          /**
           * the id of the parent of the associated member
           */
          parentMemberId : {type : "string", group : "Misc", defaultValue : null},

          /**
           * the node alignment
           */
          nodeAlignment : {type : "string", group : "Misc", defaultValue : null}
        }
      },
      renderer: HeaderCellRenderer
    });

    HeaderCell.prototype.init = function () {
      this.aStyles = [];
      this.bLoading = false;
      this.bSelectable = false;
      this.bIsResult = false;
      this.bIsMobileResize = false;
      this.sUnit = "";
      this.bIsEntryEnabled = false;
      this.sPassiveCellType = RenderingConstants.PASSIVE_CELL_TYPE_NORMAL;
      this.iNumberOfLineBreaks = 0;
      this.sScalingAxis = null;
      this.bIsPivotCell = false;
      this.bIsSplitPivotCell = false;
      this.bIsRevertDrop = false;
    };

    HeaderCell.prototype.getCellType = function() {
      return RenderingConstants.TYPE_HEADER_CELL;
    };

    HeaderCell.prototype.isHeaderCell = function() {
      return true;
    };

    HeaderCell.prototype.getCssClassNames = function (bIsIE8, bIsRtl, bIsMsIE) {
      return CellStyleHandler.getCssClasses(this.aStyles, bIsIE8, bIsRtl, bIsMsIE);
    };

    HeaderCell.prototype.getStyleIdList = function () {
      return this.aStyles;
    };

    HeaderCell.prototype.setStyleIdList = function (aNewStyles) {
      this.aStyles = aNewStyles;
    };

    HeaderCell.prototype.addStyle = function (sStyle) {
      var iStyleId = CellStyleHandler.getStyleId(
        sStyle,
        RenderingConstants.TYPE_HEADER_CELL
      );
      if (this.aStyles.indexOf(iStyleId) === -1) {
        this.aStyles.push(iStyleId);
      }
    };

    HeaderCell.prototype.removeStyle = function (sStyle) {
      var iStyleId = CellStyleHandler.getStyleId(
        sStyle,
        RenderingConstants.TYPE_HEADER_CELL
      );
      var iIndex = this.aStyles.indexOf(iStyleId);
      if (iIndex !== -1) {
        this.aStyles.splice(iIndex, 1);
      }
    };

    HeaderCell.prototype.hasStyle = function (sStyle) {
      var iStyleId =CellStyleHandler.getStyleId(
        sStyle,
        RenderingConstants.TYPE_HEADER_CELL
      );
      var iIndex = this.aStyles.indexOf(iStyleId);
      if (iIndex === -1) {
        return false;
      } else {
        return true;
      }
    };

    HeaderCell.prototype.isLoading = function () {
      return this.bLoading;
    };

    HeaderCell.prototype.setLoading = function (bLoading) {
      this.bLoading = bLoading;
    };

    HeaderCell.prototype.isSelectable = function () {
      return this.bSelectable;
    };

    HeaderCell.prototype.setSelectable = function (bSelectable) {
      this.bSelectable = bSelectable;
    };

    HeaderCell.prototype.setResult = function (bIsResult) {
      this.bIsResult = bIsResult;
    };

    HeaderCell.prototype.isResult = function () {
      return this.bIsResult;
    };

    HeaderCell.prototype.getUnescapedText = function () {
      return sap.zen.crosstab.utils.Utils.unEscapeDisplayString(this.getText());
    };

    HeaderCell.prototype.isMobileResize = function () {
      return this.bIsMobileResize;
    };

    HeaderCell.prototype.setMobileResize = function (pbMobileResize) {
      this.bIsMobileResize = pbMobileResize;
    };

    HeaderCell.prototype.setEntryEnabled = function (bIsEntryEnabled) {
      this.bIsEntryEnabled = bIsEntryEnabled;
    };

    HeaderCell.prototype.isEntryEnabled = function () {
      return this.bIsEntryEnabled;
    };

    HeaderCell.prototype.setUnit = function (sUnit) {
      this.sUnit = sUnit;
    };

    HeaderCell.prototype.getUnit = function () {
      return this.sUnit;
    };

    HeaderCell.prototype.getPassiveCellType = function () {
      return this.sPassiveCellType;
    };

    HeaderCell.prototype.setPassiveCellType = function (sPCellType) {
      this.sPassiveCellType = sPCellType;
    };

    HeaderCell.prototype.setNumberOfLineBreaks = function (iNumberOfLineBreaks) {
      this.iNumberOfLineBreaks = iNumberOfLineBreaks;
    };

    HeaderCell.prototype.getNumberOfLineBreaks = function () {
      return this.iNumberOfLineBreaks;
    };

    HeaderCell.prototype.getScalingAxis = function() {
      return this.sScalingAxis;
    };

    HeaderCell.prototype.setScalingAxis = function(sScalingAxis) {
      this.sScalingAxis = sScalingAxis;
    };

    HeaderCell.prototype.isPivotCell = function() {
      return this.bIsPivotCell;
    };

    HeaderCell.prototype.setPivotCell = function(bIsPivotCell) {
      this.bIsPivotCell = bIsPivotCell;
    };

    HeaderCell.prototype.isSplitPivotCell = function() {
      return this.bIsSplitPivotCell;
    };

    HeaderCell.prototype.setSplitPivotCell = function(bIsSplitPivotCell) {
      this.bIsSplitPivotCell = bIsSplitPivotCell;
    };

    HeaderCell.prototype.isRevertDrop = function() {
      return this.bIsRevertDrop;
    };

    HeaderCell.prototype.setRevertDrop = function(bIsRevertDrop) {
      this.bIsRevertDrop = bIsRevertDrop;
    };

    HeaderCell.prototype.getFormattedText = function() {
      var lText = this.getText();

      var oArea = this.getArea();
      var fRenderCallback = oArea.getRenderCellCallback();
      if (fRenderCallback) {
        var oCallbackResult = fRenderCallback(
          new IHeaderCell(
          )
        );
        lText = oCallbackResult.renderText;
      }
      var oFormatter = this.getFormatter();
      if (oFormatter) {
        lText = oFormatter.format(lText);
      }
      return lText;
    };

    return HeaderCell;
  }
);
