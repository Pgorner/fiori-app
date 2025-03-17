/*!
 * (c) Copyright 2010-2019 SAP SE or an SAP affiliate company.
 */
/*global sap*/
sap.ui.define(
  [
    "jquery.sap.global",
    "sap/ui/core/Control",
    "sap/zen/crosstab/CellStyleHandler",
    "sap/zen/crosstab/DataCellRenderer",
    "sap/zen/crosstab/rendering/RenderingConstants",
    "sap/zen/crosstab/utils/Utils",
    "sap/zen/crosstab/library"
  ],
  function(jQuery, Control, CellStyleHandler, DataCellRenderer, RenderingConstants, Utils){
    "use strict";
    // Provides control sap.zen.crosstab.DataCell.
    jQuery.sap.declare("sap.zen.crosstab.DataCell");
    /**
     * Constructor for a new DataCell.
     *
     * @param {string} [sId] id for the new control, generated automatically if no id is given
     * @param {object} [mSettings] initial settings for the new control
     *
     * @class
     * Add your documentation for the new DataCell
     * @extends sap.ui.core.Control
     *
     * @constructor
     * @public
     * @deprecated Since version 1.89.0, Please use the WD Grid control instead.
     * @alias sap.zen.crosstab.DataCell
     */
    var DataCell = Control.extend("sap.zen.crosstab.DataCell", /** @lends sap.zen.crosstab.DataCell.prototype */ {
      metadata : {
        library : "sap.zen.crosstab",
        properties : {
          /**
           * the text of the data cell
           */
          text : {type : "string", group : "Misc", defaultValue : null},

          /**
           * the area of the data cell
           */
          area : {type : "object", group : "Misc", defaultValue : null},

          /**
           * the row of the data cell
           */
          row : {type : "int", group : "Misc", defaultValue : null},

          /**
           * the column of the data cell
           */
          col : {type : "int", group : "Misc", defaultValue : null},

          /**
           * the table row of the data cell
           */
          tableRow : {type : "int", group : "Misc", defaultValue : null},

          /**
           * the table column of the data cell
           */
          tableCol : {type : "int", group : "Misc", defaultValue : null}
        }
      },
      renderer: DataCellRenderer
    });


    /**
     *
     * @name sap.zen.crosstab.DataCell#addStyle
     * @function
     * @param {string} sSStyle
     * @type void
     * @public
     */

    DataCell.prototype.init = function () {
      "use strict";
      this.aStyles = [];
      this.bLoading = false;
      this.bIsEntryEnabled = false;
      this.sUnit = "";
      this.sPassiveCellType = RenderingConstants.PASSIVE_CELL_TYPE_NORMAL;
      this.iNumberOfLineBreaks = 0;
    };
    DataCell.prototype.getCellType = function() {
      return RenderingConstants.TYPE_DATA_CELL;
    };
    DataCell.prototype.isHeaderCell = function() {
      return false;
    };
    DataCell.prototype.getCssClassNames = function (bIsIE8, bIsRtl, bIsMsIE) {
      return CellStyleHandler.getCssClasses(this.aStyles, bIsIE8, bIsRtl, bIsMsIE);
    };
    DataCell.prototype.getStyleIdList = function () {
      return this.aStyles;
    };
    DataCell.prototype.setStyleIdList = function (aNewStyles) {
      this.aStyles = aNewStyles;
    };
    DataCell.prototype.addStyle = function (sStyle) {
      var iStyleId = CellStyleHandler.getStyleId(
        sStyle,
        RenderingConstants.TYPE_DATA_CELL
      );
      if (this.aStyles.indexOf(iStyleId) === -1) {
        this.aStyles.push(iStyleId);
      }
    };
    DataCell.prototype.removeStyle = function (sStyle) {
      var iStyleId = CellStyleHandler.getStyleId(
        sStyle, RenderingConstants.TYPE_DATA_CELL
      );
      var iIndex = this.aStyles.indexOf(iStyleId);
      if (iIndex !== -1) {
        this.aStyles.splice(iIndex, 1);
      }
    };
    DataCell.prototype.hasStyle = function (sStyle) {
      var iStyleId = CellStyleHandler.getStyleId(
        sStyle, RenderingConstants.TYPE_DATA_CELL
      );
      var iIndex = this.aStyles.indexOf(iStyleId);
      if (iIndex === -1) {
        return false;
      } else {
        return true;
      }
    };
    DataCell.prototype.getColSpan = function () {
      return 1;
    };
    DataCell.prototype.getRowSpan = function () {
      return 1;
    };
    DataCell.prototype.getEffectiveColSpan = function () {
      return 1;
    };
    DataCell.prototype.getEffectiveRowSpan = function () {
      return 1;
    };
    DataCell.prototype.isLoading = function () {
      return this.bLoading;
    };
    DataCell.prototype.setLoading = function (bLoading) {
      this.bLoading = bLoading;
    };
    DataCell.prototype.isSelectable = function () {
      return false;
    };
    DataCell.prototype.getUnescapedText = function () {
      return Utils.unEscapeDisplayString(this.getText());
    };
    DataCell.prototype.setEntryEnabled = function (bIsEntryEnabled) {
      this.bIsEntryEnabled = bIsEntryEnabled;
    };
    DataCell.prototype.isEntryEnabled = function () {
      return this.bIsEntryEnabled;
    };
    DataCell.prototype.setUnit = function (sUnit) {
      this.sUnit = sUnit;
    };
    DataCell.prototype.getUnit = function () {
      return this.sUnit;
    };
    DataCell.prototype.getPassiveCellType = function () {
      return this.sPassiveCellType;
    };
    DataCell.prototype.setPassiveCellType = function (sPCellType) {
      this.sPassiveCellType = sPCellType;
    };
    DataCell.prototype.setNumberOfLineBreaks = function (iNumberOfLineBreaks) {
      this.iNumberOfLineBreaks = iNumberOfLineBreaks;
    };
    DataCell.prototype.getNumberOfLineBreaks = function () {
      return this.iNumberOfLineBreaks;
    };
    return DataCell;
  }
);
