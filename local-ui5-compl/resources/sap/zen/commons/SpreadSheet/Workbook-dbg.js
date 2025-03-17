/*!
 * SAPUI5
    (c) Copyright 2009-2020 SAP SE. All rights reserved
  
 */
/*global sap, ArrayBuffer, Uint8Array, window*/
sap.ui.define(
  "sap/zen/commons/SpreadSheet/Workbook",
  [
    "sap/zen/commons/thirdparty/xlsx-protobi"
  ],
  function (XLSX) {
    function Workbook(){
      var that = this;
      that.SheetNames = [];
      that.Sheets = {};
      that.allowStyles = true;
      that.formatIndexMap = {};
      that.formatIndex = 164;
      that.addWorksheet = function(sheetName) {
        var loWorkSheet = {};
        that.SheetNames.push(sheetName);
        that.Sheets[sheetName] = loWorkSheet;
        loWorkSheet.curRow = -1;
        loWorkSheet.maxRow = -1;
        loWorkSheet.maxCol = -1;
        loWorkSheet["!merges"] = [];
        return loWorkSheet;
      };
      that.closeWorkSheet =function(oXlsWorksheet) {
        var loRange = that.getRange(0, 0, oXlsWorksheet.maxRow + 1, oXlsWorksheet.maxCol + 1);
        oXlsWorksheet["!ref"] = XLSX.utils.encode_range(loRange);
      };
      that.getRow = function(oXlsWorksheet, rowIndex) {
        var loRow = {};
        loRow.ws = oXlsWorksheet;
        loRow.row = rowIndex;
        loRow.curCol = -1;
        return loRow;
      };
      that.createRow = function(oXlsWorksheet) {
        oXlsWorksheet.curRow++;
        var loRow = that.getRow(oXlsWorksheet, oXlsWorksheet.curRow);
        if (oXlsWorksheet.curRow > oXlsWorksheet.maxRow) {
          oXlsWorksheet.maxRow = oXlsWorksheet.curRow;
        }
        return loRow;
      };
      that.getCell = function(oXlsWorksheetRow, columnIndex) {
        var loCell = {};
        loCell.ws = oXlsWorksheetRow.ws;
        loCell.row = oXlsWorksheetRow.row;
        loCell.column = columnIndex;
        var lCellRef = that.getCellRef(loCell.row, loCell.column);
        oXlsWorksheetRow.ws[lCellRef] = loCell;
        return loCell;
      };
      that.getCellRef = function(rowIndex, columnIndex) {
        var loCellRef = XLSX.utils.encode_cell({
          r : rowIndex,
          c : columnIndex
        });
        return loCellRef.toString();
      };
      that.addCell = function(oXlsWorksheetRow) {
        oXlsWorksheetRow.curCol++;
        var loCell = that.getCell(oXlsWorksheetRow, oXlsWorksheetRow.curCol);
        if (oXlsWorksheetRow.curCol > oXlsWorksheetRow.ws.maxCol) {
          oXlsWorksheetRow.ws.maxCol = oXlsWorksheetRow.curCol;
        }
        return loCell;
      };
      that.copyCell = function(oXlsWorkSheetCellSource, oXlsWorkSheetCellTarget) {
        if (oXlsWorkSheetCellSource.s) {
          oXlsWorkSheetCellTarget.s = oXlsWorkSheetCellSource.s;
        }
        if (oXlsWorkSheetCellSource.v) {
          oXlsWorkSheetCellTarget.v = oXlsWorkSheetCellSource.v;
        }
        if (oXlsWorkSheetCellSource.t) {
          oXlsWorkSheetCellTarget.t = oXlsWorkSheetCellSource.t;
        }
        if (oXlsWorkSheetCellSource.f) {
          oXlsWorkSheetCellTarget.f = oXlsWorkSheetCellSource.f;
        }
        if (oXlsWorkSheetCellSource.z) {
          oXlsWorkSheetCellTarget.z = oXlsWorkSheetCellSource.z;
        }
        if (oXlsWorkSheetCellSource.w) {
          oXlsWorkSheetCellTarget.w = oXlsWorkSheetCellSource.w;
        }
      };
      that.mergeCell = function(oXlsWorksheetCell, rowspan, colspan) {
        var lRowspan = rowspan, lColspan = colspan;
        if (lRowspan < 1) {
          lRowspan = 1;
        }
        if (lColspan < 1) {
          lColspan = 1;
        }
        // get the Range
        var loRange = that.getRange(oXlsWorksheetCell.row, oXlsWorksheetCell.column, oXlsWorksheetCell.row + lRowspan - 1, oXlsWorksheetCell.column + lColspan -1);
        // set the Cell merge information (Cell Content Range)
        if (lRowspan > 1 || lColspan > 1) {
          oXlsWorksheetCell.ws["!merges"].push(loRange);
        }
        // handle content to be merged
        var loRow = null, loCell = null, i = 0;
        for (i = 1; i < lRowspan; i++) {
          loRow = that.getRow(oXlsWorksheetCell.ws, oXlsWorksheetCell.row + i);
          loCell = that.getCell(loRow, oXlsWorksheetCell.column);
          that.copyCell(oXlsWorksheetCell, loCell);
        }
        for (i = 1; i < lColspan; i++) {
          loRow = that.getRow(oXlsWorksheetCell.ws, oXlsWorksheetCell.row);
          loCell = that.getCell(loRow, oXlsWorksheetCell.column + i);
          that.copyCell(oXlsWorksheetCell, loCell);
        }
      };
      that.getRange = function(fromRowIndex, fromColumnIndex, toRowIndex, toColumnIndex) {
        return {
          s : {
            r : fromRowIndex,
            c : fromColumnIndex
          },
          e : {
            r : toRowIndex,
            c : toColumnIndex
          }
        };
      };
      that.setCell = function(
        oXlsWorksheetCell,
        oCellInfo) {
        /* https://github.com/protobi/js-xlsx#cell-object
         *
         * Cell Object
         * Key  Description
         * v    raw value (see Data Types section for more info)
         * w    formatted text (if applicable)
         * t    cell type: b Boolean, n Number, e error, s String, d Date
         * f    cell formula (if applicable)
         * r    rich text encoding (if applicable)
         * h    HTML rendering of the rich text (if applicable)
         * c    comments associated with the cell **
         * z    number format string associated with the cell (if requested)
         * l    cell hyperlink object (.Target holds link, .tooltip is tooltip)
         * s    the style/theme of the cell (if applicable)
         */
        if (oXlsWorksheetCell.row > oXlsWorksheetCell.ws.maxRow) {
          oXlsWorksheetCell.ws.maxRow = oXlsWorksheetCell.row;
        }
        if (oXlsWorksheetCell.column > oXlsWorksheetCell.ws.maxCol) {
          oXlsWorksheetCell.ws.maxCol = oXlsWorksheetCell.column;
        }
        // handle Cell Style information
        var lsRGBFillColorGroup = "FFDCE6F0"; // #DCE6F0 > RGB(220,230,240)
        var lsRGBFillColorBorder = "FFCCCCCC"; // #CCCCCC > RGB(204,204,204)
        var lsRGBFillColorHeader = "FFE5E5E5"; // #E5E5E5 > RGB(229,229,229)
        var lsRGBFillColorTotal = "FFFFFF00"; // #FFFF00 > RGB(255,255,0)
        var lsDefaultFontName = "Calibri";
        var lsDefaultFontSize = 11;
        var lsDefaultAlignmentVertical = "top";
        var lsDefaultAlignmentHorizontal = "left";
        var loDefaultBorderValue = {style: "medium", color: {rgb: lsRGBFillColorBorder}};
        var loDefaultBorder = {top: loDefaultBorderValue, bottom: loDefaultBorderValue, left: loDefaultBorderValue, right: loDefaultBorderValue};
        var loStyleNone = {
          font: {name: lsDefaultFontName, sz:lsDefaultFontSize, bold: false},
          //fill: {fgColor: {}},
          alignment: {vertical: lsDefaultAlignmentVertical, horizontal: lsDefaultAlignmentHorizontal, wrapText: false, indent: 0}};
        var loStyleDefault = {
          font: {name: lsDefaultFontName, sz:lsDefaultFontSize, bold: false},
          //fill: {fgColor: {}},
          alignment: {vertical: lsDefaultAlignmentVertical, horizontal: lsDefaultAlignmentHorizontal, wrapText: false, indent: 0},
          border: loDefaultBorder};
        var loStyleGroup = {
          font: {name: lsDefaultFontName, sz:lsDefaultFontSize, bold: false},
          fill: {fgColor: {rgb: lsRGBFillColorGroup}},
          alignment: {vertical: lsDefaultAlignmentVertical, horizontal: lsDefaultAlignmentHorizontal, wrapText: false, indent: 0},
          border: loDefaultBorder};
        var loStyleHeader = {
          font: {name: lsDefaultFontName, sz:lsDefaultFontSize, bold: false},
          fill: {fgColor: {rgb: lsRGBFillColorHeader}},
          alignment: {vertical: lsDefaultAlignmentVertical, horizontal: lsDefaultAlignmentHorizontal, wrapText: false, indent: 0},
          border: loDefaultBorder};
        var loStyleTotal = {
          font: {name: lsDefaultFontName, sz:lsDefaultFontSize, bold: false},
          fill: {fgColor: {rgb: lsRGBFillColorTotal}},
          alignment: {vertical: lsDefaultAlignmentVertical, horizontal: lsDefaultAlignmentHorizontal, wrapText: false, indent: 0},
          border: loDefaultBorder};
        // Cell Style
        if (oCellInfo.getStyle().toString() !== "NONE" && that.allowStyles === true) {
          if (oCellInfo.getStyle().toString() === "GROUP") {
            oXlsWorksheetCell.s = loStyleGroup;
          } else if (oCellInfo.getStyle().toString() === "HEADER") {
            oXlsWorksheetCell.s = loStyleHeader;
          } else if (oCellInfo.getStyle().toString() === "TOTAL") {
            oXlsWorksheetCell.s = loStyleTotal;
          } else {
            oXlsWorksheetCell.s = loStyleDefault;
          }
        } else {
          oXlsWorksheetCell.s = loStyleNone;
        }
        // Cell Value + Cell Value Type + Cell Horizontal Alignment
        oXlsWorksheetCell.v = oCellInfo.getFormattedValue();
        oXlsWorksheetCell.t = "s";
        oXlsWorksheetCell.s.alignment.horizontal = "left";
        if (oCellInfo.getValueType().toString() === "NUMBER" || oCellInfo.getValueType().toString() === "NUMBER_AS_STRING") {
          oXlsWorksheetCell.s.alignment.horizontal = "right";
          if (oCellInfo.getValueType().toString() === "NUMBER") {
            oXlsWorksheetCell.v = oCellInfo.getValue();
            oXlsWorksheetCell.t = "n";
          }
        } else if (oCellInfo.getValueType().toString() === "DATE") {
          oXlsWorksheetCell.v = oCellInfo.getValue();
          oXlsWorksheetCell.t = "d";
        }
        // Cell Formula
        if (oCellInfo.getFormula()) {
          oXlsWorksheetCell.f = oCellInfo.getFormula();
        }
        // Cell Format String
        if (oCellInfo.getValueType().toString() === "NUMBER_AS_STRING") {
          oCellInfo.setFormatString(null);
        }
        if (oCellInfo.getValueType().toString() === "NUMBER") {
          oXlsWorksheetCell.s.numFmt = oCellInfo.getFormatString();
        }
        if (oCellInfo.getFormatString() != null && oCellInfo.getFormatString().length > 0) {
          // set format to cell
          oXlsWorksheetCell.z = oCellInfo.getFormatString();
          var lFormatIndex = that.formatIndexMap[oCellInfo.getFormatString()];
          if (!lFormatIndex) {
            // find unused format index
            while (XLSX.SSF.get_table()[that.formatIndex]) {
              that.formatIndex++;
            }
            // save format index for format
            lFormatIndex = that.formatIndex;
            that.formatIndexMap[oCellInfo.getFormatString()] = lFormatIndex;
            // increase global format index
            that.formatIndex++;
            // register new format
            XLSX.SSF.load(oCellInfo.getFormatString(), lFormatIndex);
          }
          oXlsWorksheetCell.z = XLSX.SSF.get_table()[lFormatIndex];
          // format cell (should write correct external value to cell.w based on cell.z)
          XLSX.utils.format_cell(oXlsWorksheetCell);
        } else {
          oXlsWorksheetCell.w = oCellInfo.getFormattedValue();
        }
        // handle merge of Cell
        that.mergeCell(oXlsWorksheetCell, oCellInfo.getRowSpan(), oCellInfo.getColSpan());
      };
      that.save = function(filename) {
        var lBuffer = that.getAsBinary();
        var lBlob = new Blob(
          [ lBuffer ],
          {type : "application/octet-stream"});
        var lUrl = URL.createObjectURL(lBlob);
        var saveData = (function() {
          var lElement = document.createElement("a");
          document.body.appendChild(lElement);
          lElement.style = "display: none";
          return function(lUrl, filename) {
            lElement.href = lUrl;
            lElement.download = filename;
            lElement.click();
          };
        }());
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(lBlob, filename);
        } else {
          saveData(lUrl, filename);
        }
        var f = function() {
          window.URL.revokeObjectURL(lUrl);
        };
        setTimeout(f, 1);
      };
      that.getAsBinary = function() {
        var lWorkbook = XLSX.write(
          that,
          {
            bookType : "xlsx", // Type of Workbook
            bookSST : true, // Generate Shared String Table **
            type : "binary", // Output data encoding
            cellDates : true // Store dates as type d (default is n)
          });
        function s2ab(stringValue) {
          var lBuffer = new ArrayBuffer(stringValue.length);
          var lView = new Uint8Array(lBuffer);
          for (var i = 0; i != stringValue.length; ++i) {
            lView[i] = stringValue.charCodeAt(i) & 0xFF;
          }
          return lBuffer;
        }
        var lBuffer = s2ab(lWorkbook);
        return lBuffer;
      };
    }
    return Workbook;
  }
);
