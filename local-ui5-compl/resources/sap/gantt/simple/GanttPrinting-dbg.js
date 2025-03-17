/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

sap.ui.define([
		"sap/gantt/library",
		"sap/ui/thirdparty/jquery",
		"sap/ui/core/Element",
		"sap/ui/core/format/NumberFormat",
		"sap/m/Label",
		"sap/m/Text",
		"sap/m/Title",
		"sap/m/Dialog",
		"sap/m/ProgressIndicator",
		"sap/m/Button",
		"sap/m/Input",
		"sap/m/FlexBox",
		"sap/m/library",
		"sap/m/FlexItemData",
		"sap/m/ScrollContainer",
		"sap/m/ComboBox",
		"sap/m/RadioButton",
		"sap/m/RadioButtonGroup",
		"sap/m/CheckBox",
		"sap/m/Slider",
		"sap/m/ResponsiveScale",
		"sap/m/StepInput",
		"sap/m/DatePicker",
		"sap/m/DateTimePicker",
		"sap/m/BusyDialog",
		"sap/m/MessageStrip",
		"sap/m/Switch",
		"sap/m/Panel",
		"sap/m/TextArea",
		"sap/gantt/misc/Format",
		"sap/gantt/simple/GanttChartContainer",
		"sap/gantt/config/TimeHorizon",
		"sap/gantt/axistime/FullScreenStrategy",
		"sap/ui/core/Item",
		"sap/ui/core/HTML",
		"sap/ui/core/InvisibleText",
		"sap/ui/layout/VerticalLayout",
		"sap/ui/layout/HorizontalLayout",
		"sap/ui/layout/GridData",
		"sap/ui/layout/form/SimpleForm",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/theming/Parameters",
		"sap/ui/core/ResizeHandler",
		"sap/gantt/thirdparty/jspdf",
		"sap/gantt/thirdparty/html2canvas",
		"sap/gantt/thirdparty/svg2pdf",
		"./RenderUtils",
		"sap/m/PDFViewer",
		"sap/ui/Device",
		"sap/gantt/simple/GanttRowSettings",
		"sap/gantt/simple/AggregationUtils",
		"../simple/GanttUtils",
		"sap/ui/core/date/UI5Date",
		"sap/ui/core/format/DateFormat",
		"sap/ui/table/rowmodes/Fixed",
		"sap/ui/core/library",
		"sap/ui/model/FilterType",
		"sap/ui/model/odata/type/DateTimeOffset",
		"sap/ui/model/odata/type/String",
		"sap/ui/model/odata/type/DateTimeWithTimezone",
		"sap/ui/model/type/Integer",
		"sap/ui/model/type/Boolean",
		"sap/gantt/utils/GanttChartConfigurationUtils",
		"sap/ui/core/Lib",
		"sap/gantt/simple/PrintConfig",
		"sap/gantt/simple/PrintUtils"
	],	function (
		GanttLibrary,
		$,
		Element,
		NumberFormat,
		Label,
		Text,
		Title,
		Dialog,
		ProgressIndicator,
		Button,
		Input,
		FlexBox,
		MobileLibrary,
		FlexItemData,
		ScrollContainer,
		ComboBox,
		RadioButton,
		RadioButtonGroup,
		CheckBox,
		Slider,
		ResponsiveScale,
		StepInput,
		DatePicker,
		DateTimePicker,
		BusyDialog,
		MessageStrip,
		Switch,
		Panel,
		TextArea,
		Format,
		GanttChartContainer,
		TimeHorizon,
		FullScreenStrategy,
		Item,
		HTML,
		InvisibleText,
		VerticalLayout,
		HorizontalLayout,
		GridData,
		SimpleForm,
		JSONModel,
		Parameters,
		ResizeHandler,
		jsPDF,
		html2canvas,
		svg2pdf,
		RenderUtils,
		PDFViewer,
		Device,
		GanttRowSettings,
		AggregationUtils,
		GanttUtils,
		UI5Date,
		DateFormat,
		FixedRowMode,
		coreLibrary,
		FilterType,
		DateTimeOffset,
		String,
		DateTimeWithTimezone,
		Integer,
		Boolean,
		GanttChartConfigurationUtils,
		Lib,
		PrintConfig,
		PrintUtils
	) {
		"use strict";

		var FlexDirection = MobileLibrary.FlexDirection,
			GanttChartWithTableDisplayType = GanttLibrary.simple.GanttChartWithTableDisplayType;
		html2canvas = window.html2canvas;
		jsPDF = window.jsPDF;
		svg2pdf = window.svg2pdf;
		var ValueState = coreLibrary.ValueState;

		/**
		 * Constructor for a new GanttPrinting control.
		 *
		 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
		 * @param {object} [mSetting] Initial settings for the new control
		 *
		 * @class
		 * The <code>GanttPrinting</code> control enables you to export your Gantt chart as a PDF document.
		 * <br>Please note that the quality of the exported image in PDF is currently limited to a pixel density of 96 PPI and the area of the chart that can be exported is limited to a canvas area of 16,384 x 16,384 pixels (268,435,456 square pixels).
		 *
		 * @extend sap.ui.core.Element
		 *
		 * @author SAP SE
		 * @version 1.132.0
		 * @since 1.66
		 *
		 * @constructor
		 * @public
		 * @alias sap.gantt.simple.GanttPrinting
		 */
		var GanttPrinting = Element.extend("sap.gantt.simple.GanttPrinting", {
			metadata: {
				library: "sap.gantt",
				associations: {

					/**
					 * Gantt chart to be exported as PDF document.
					 */
					ganttChart: {
						type: "sap.gantt.simple.GanttChartWithTable",
						multiple: false
					}
				}
			}
		});

		var TEXTFONT = "9px Arial, Helvetica, sans-serif";
		var PAGENUMBERFONT = "12px Arial, Helvetica, sans-serif";
		var MAXCANVASSIZE = "16384";
		/* maximum canvas area is 16,384 x 16,384 pixels (268,435,456 square pixels). */
		var MAXHEADERFOOTERLENGTH = 190;  // 190 characters can be inserted when page is in default A4 portrait mode
		var JSPDFCONSTANT = 1.85;  // Constant to handle text width for jsPDF (ratio of CanvasContext.measureText().width and jsPDF.getTextWidth())
		/* When paper width in mm is converted to px, the dimensions are multiplied by 1.33 (scale factor of px) in jsPDF.
		To negate this and convert px to point -> paperWidth * 0.75 / 1.33 = paperWidth * 0.56 */
		var SCALEFACTORCONSTANT = 0.56;

		GanttPrinting.prototype.init = function () {

			this._oRb = Lib.getResourceBundleFor("sap.gantt");
			var _oPaperSizes = PrintUtils._getPaperConfiguarations();
			var defaultMargin  = PrintUtils._mmToPx(5);
			// size in px computed from mm and in

			this.oInitialValues = {
				"multiplePage": true,
				"qualityWarning": false,
				"showOrientationMessage": false,
				"orientationMessage": this._oRb.getText("GNT_PRNTG_SINGLE_PAGE_LANDSCAPE"),
				"portrait": true,
				"paperSize": "A4",
				"paperWidth": _oPaperSizes.A4.width,
				"paperHeight": _oPaperSizes.A4.height,
				"unit": "mm",
				"repeatSelectionPanel": false,
				"scale": 100,
				"duration": "all",
				"startDate": new Date(),
				"endDate": new Date(),
				"showPageNumber": false,
				"showHeaderText": false,
				"headerText": "",
				"showFooterText": false,
				"footerText": "",
				"exportAll": true,
				"exportRange": "",
				"exportAsJPEG": true,
				"compressionQuality": 75,
				"previewPageNumber": 1,
				"lastPageNumber": undefined,
				"marginType": "default",
				"marginLocked": false,
				"marginTop": defaultMargin,
				"marginRight": defaultMargin,
				"marginBottom": defaultMargin,
				"marginLeft": defaultMargin,
				"cropMarks": false,
				"cropMarksWeight": 0.25,
				"cropMarksOffset": PrintUtils._mmToPx(3)
			};

			this._oModel = new JSONModel(this.oInitialValues);

			this._oGanttCanvas = undefined;

			// 8mm
			this._iHeaderAndFooterHeight = PrintUtils._mmToPx(8);

			this._ganttChartContainer = new GanttChartContainer();

			this.sFont = null;

			this._oPdfPreview = null;
		};

		/* ================================================ */
		/* 					Public Methods					*/
		/* ================================================ */

		/**
		 *
		 * Exports the Gantt chart as PDF.
		 *
		 * @public
		 */
		GanttPrinting.prototype.export = function () {
			this._savePdf();
		};

		/**
		 *
		 * Exports the Gantt chart as a single page PDF.
		 *
		 * @since 1.111
		 */
		GanttPrinting.prototype.exportSinglePage = function () {
			var oDate = new Date();
			this.oSinglePagePdf.save("GanttChartExport-" + oDate.toISOString() + ".pdf");
		};

		/**
		 * Renders cloned gantt chart if non-RTL mode is there.
		 */
		GanttPrinting.prototype.renderGanttClone = function (bRender) {
			if (GanttChartConfigurationUtils.getRTL() && !bRender) {
				return Promise.resolve();
			}
			return new Promise(function (resolve) {
				this._ganttChartClone.getTable().attachEventOnce("_rowsUpdated", resolve, this);
				this._ganttChartClone.invalidate();
			}.bind(this));
		};

		/**
		 * Merges multiple canvases into one canvas.
		 *
		 * @param {array} aCanvasArray array of canvases
		 * @returns single canvas
		 * @public
		 */
		GanttPrinting.prototype.mergeCanvases = function (aCanvasArray) {
			var newCanvas = document.createElement('canvas'),
				ctx = newCanvas.getContext('2d'),
				width = aCanvasArray[0].width,
				temp = [],
				height = aCanvasArray.reduce(function (sum, item, index, aCanvasArray) {
					temp.push({
						cnv: item,
						y: sum
					});

					sum += aCanvasArray[index].height;
					return sum;
				}, 0);

			newCanvas.width = width;
			newCanvas.height = height;
			temp.forEach(function (n) {
				ctx.beginPath();
				ctx.drawImage(n.cnv, 0, n.y, width, n.cnv.height);
			});

			if (newCanvas.width > MAXCANVASSIZE || newCanvas.height > MAXCANVASSIZE) {
				this._oClonedGanttDiv.style.height = newCanvas.height + "px";
				this._oClonedGanttDiv.style.width = newCanvas.width + "px";
				return undefined;
			}

			return newCanvas;
		};

		/**
		 * Generates an array of canvases asynchronously by scrolling through entire Gantt chart
		 */
		GanttPrinting.prototype.generateCanvasAsync = function (index) {
			var counter = 0;
			var lastVal = this._getOriginalGanttChart().getTable()._getTotalRowCount() / this.iThreshold;
			this.bLast = lastVal > 1 ? false : true;
			var that = this;
			var canvasArray = [];
			var currentProgress = 0;
			// progress gets updated 4 times per batch and number of batches = Math.ceil(lastVal). Hence, progressIncrement after each step = 100/(4 * Math.ceil(lastVal))
			var progressIncrement = 25 / Math.ceil(lastVal);

			function updateProgressIndicator () {
				if (that._bMultipleBatches) {
					currentProgress += progressIncrement;
					that._oProgressIndicator.setPercentValue(currentProgress);
				}
			}

			function setVisibleRow (index) {
				if (that._bCancel) {
					return Promise.reject();
				}
				that._oClonedGanttDiv.style.height = MAXCANVASSIZE + "px";
				var rowVal = index * that.iThreshold;
				var iRowCount = that._getOriginalGanttChart().getTable()._getTotalRowCount();
				that.iThreshold = Math.min(that.iThreshold, iRowCount - rowVal);
				that.bLast = counter + 1 >= lastVal ? true : false;
				if (that._getOriginalGanttChart()._bExpandToggled) {
					that._ganttChartClone.getTable().setRowMode(new FixedRowMode({
						rowCount: that.iThreshold
					}));
				} else {
					var oCloneTable = that._ganttChartClone.getTable();
					var oRowMode = oCloneTable.getRowMode(), nRowHeight = 0;
					if (oRowMode && oRowMode.getRowContentHeight()) {
						nRowHeight = oRowMode.getRowContentHeight();
					} else {
						/**
						 * @deprecated As of version 1.119
						 */
						nRowHeight = oCloneTable.getRowHeight();
					}
					that._ganttChartClone.getTable().setRowMode(new FixedRowMode({
						rowCount: that.iThreshold,
						rowContentHeight: nRowHeight ? nRowHeight : Math.ceil(that._getOriginalGanttChart().getTableRowHeights()[0])
					}));
				}
				that.bFirst = (index === 0) ? true : false;
				that._ganttChartClone.getTable().setFirstVisibleRow(rowVal);
				if (GanttChartConfigurationUtils.getRTL()) {
					that._ganttChartClone._bRenderGanttClone = true;
				}
				return that._ganttChartClone.getInnerGantt().resolveWhenReady(that._originalHasRenderedShapes);
			}

			function generateAsync (index) {
				updateProgressIndicator();	// 1st progress update
				return setVisibleRow(index).then(function () {
					updateProgressIndicator();	// 2nd progress update
					that._bExpandCollapse = true;
					return that._expandAndCollapse();
				}).then(function () {
					that._ganttChartClone._bExpandRows = true;
					updateProgressIndicator();	// 3rd progress update
					return that._expandRowSettings();
				}).then(function () {
					that._ganttChartClone._bExpandRows = false;
					that._setCloneDivHeight();
					document.getElementById(that._ganttChartClone.getId() + "-sapGanttBackgroundTableContent").style.height = that._iContentHeight;
					document.getElementById(that._ganttChartClone.getTable().getId() + "-tableCCnt").style.height = that._iContentHeight;
					if (!that.bLast) {
						updateProgressIndicator();	// 4th progress update
					}
					return that._createGanttCanvas();
				}).then(function (oUpdatedCanvas) {
					return canvasArray.push(oUpdatedCanvas);
				}).then(function () {
					if (index === 0) {
						that._ganttChartClone.setShowGanttHeader(false);
					}
					counter = counter + 1;
					if (counter < lastVal) {
						generateAsync(counter);
					} else if (!that._bCancel) {
						that._oGanttCanvas = that.mergeCanvases(canvasArray);
						that._updateDialogPreview();
						that._oDialog.getContent()[0].setBusy(false);
						that._oFlexBoxPreview.setBusy(false);
						that._oButtonExport.setEnabled(true);

						if (that._bMultipleBatches) {
							that._oProgressIndicator.setPercentValue(100);	// pdf preview generated
							setTimeout(function() {
								that._closeProgressIndicator(true);
							}, 500);
						}
					} else {
						return Promise.reject();
					}
				}).catch(function () {});
			}

			return generateAsync(index);
		};

		GanttPrinting.prototype.generatePdfAsync = function (index) {
			var counter = 0;
			var lastVal = this._getOriginalGanttChart().getTable()._getTotalRowCount() / this.iThreshold;
			this.bLast = lastVal > 1 ? false : true;
			var that = this;
			// var canvasArray = [];
			var currentProgress = 0;
			// progress gets updated 4 times per batch and number of batches = Math.ceil(lastVal). Hence, progressIncrement after each step = 100/(4 * Math.ceil(lastVal))
			var progressIncrement = 25 / Math.ceil(lastVal);

			function updateProgressIndicator () {
				if (that._bMultipleBatches) {
					currentProgress += progressIncrement;
					that._oProgressIndicator.setPercentValue(currentProgress);
				}
			}

			function setVisibleRow (index) {
				if (that._bCancel) {
					return Promise.reject();
				}
				that._oClonedGanttDiv.style.height = MAXCANVASSIZE + "px";
				var rowVal = index * that.iThreshold;
				var iRowCount = that._getOriginalGanttChart().getTable()._getTotalRowCount();
				that.iThreshold = Math.min(that.iThreshold, iRowCount - rowVal);
				that.bLast = counter + 1 >= lastVal ? true : false;
				if (that._getOriginalGanttChart._bExpandToggled) {
					that._ganttChartClone.getTable().setRowMode(new FixedRowMode({
						rowCount: that.iThreshold
					}));
				} else {
					var oCloneTable = that._ganttChartClone.getTable();
					var oRowMode = oCloneTable.getRowMode(), nRowHeight = 0;
					if (oRowMode && oRowMode.getRowContentHeight()) {
						nRowHeight = oRowMode.getRowContentHeight();
					} else {
						/**
						 * @deprecated As of version 1.119
						 */
						nRowHeight = oCloneTable.getRowHeight();
					}
					that._ganttChartClone.getTable().setRowMode(new FixedRowMode({
						rowCount: that.iThreshold,
						rowContentHeight: nRowHeight ? nRowHeight : Math.ceil(that._getOriginalGanttChart().getTableRowHeights()[0])
					}));
				}
				that.bFirst = (index === 0) ? true : false;
				that._ganttChartClone.getTable().setFirstVisibleRow(rowVal);
				if (GanttChartConfigurationUtils.getRTL()) {
					that._ganttChartClone._bRenderGanttClone = true;
				}
				return that._ganttChartClone.getInnerGantt().resolveWhenReady(that._originalHasRenderedShapes);
			}

			function generateAsync (index) {
				updateProgressIndicator();	// 1st progress update
				return setVisibleRow(index).then(function () {
					updateProgressIndicator();	// 2nd progress update
					that._bExpandCollapse = true;
					return that._expandAndCollapse();
				}).then(function () {
					that._ganttChartClone._bExpandRows = true;
					updateProgressIndicator();	// 3rd progress update
					return that._expandRowSettings();
				}).then(function () {
					that._ganttChartClone._bExpandRows = false;
					that._setCloneDivHeight();
					document.getElementById(that._ganttChartClone.getId() + "-sapGanttBackgroundTableContent").style.height = that._iContentHeight;
					document.getElementById(that._ganttChartClone.getTable().getId() + "-tableCCnt").style.height = that._iContentHeight;
					if (!that.bLast) {
						updateProgressIndicator();	// 4th progress update
					}
					return that._createBatchList();
				}).then(function (oDom) {
					return that._oDomToPrint.push(oDom);
				}).then(function () {
					if (index === 0) {
						that._ganttChartClone.setShowGanttHeader(false);
					}
					counter = counter + 1;
					if (counter < lastVal) {
						generateAsync(counter);
					} else if (!that._bCancel) {
						if (that._bMultipleBatches) {
							that._oProgressIndicator.setPercentValue(100);	// pdf preview generated
							setTimeout(function() {
								that._closeProgressIndicator(true);
							}, 500);
						}
						return that._generateSvgToPdf();
					} else {
						return Promise.reject();
					}
				}).catch(function () {});
			}

			return generateAsync(index);
		};

		/**
		 * Save method for the print configuration when gantt variant management is enabled.
		 * @param {sap.ui.base.Event} oEvent Event object.
		 * @param {boolean} bSvgPage decides whether to save svg page or canvas page configuration.
		 * @private
		 */
		GanttPrinting.prototype._savePreset = function (oEvent,bSvgPage) {
			var ganttContainer = this._getOriginalGanttChart().getParent();
			if (ganttContainer && ganttContainer.isA("sap.gantt.simple.GanttChartContainer")){
				var printConfig = this.getPrintData();
				var aChanges = [];
					aChanges.push({
						"selectorElement": ganttContainer,
						"changeSpecificData": {
							"changeType": bSvgPage ? "GanttSVGPrinting" : "GanttCanvasPrinting",
							"content": {
								"propertyName": bSvgPage ? "svgPage" : "canvasPage"  ,
								"newValue": {
									pageConfig: printConfig.pageConfig,
									textConfig: printConfig.textConfig,
									marginConfig: printConfig.marginConfig,
									durationConfig: printConfig.durationConfig,
									exportConfig: printConfig.exportConfig
								},
								"oldValue": 	{
									pageConfig: this._onLoadValues.pageConfig,
									textConfig: this._onLoadValues.textConfig,
									marginConfig: this._onLoadValues.marginConfig,
									durationConfig: this._onLoadValues.durationConfig,
									exportConfig: this._onLoadValues.exportConfig
								}
							}
						}
					});
				//once changes are complete, write them
				ganttContainer._addChangesToControlPersonalizationWriteAPI(oEvent, aChanges);
				this._onLoadValues = this.getPrintData();
			}
		};

		/**
		 * Opens the print dialog.
		 * @param {function} fnUpdateTable Optional function which takes cloned gantt chart's table for modification. Applications can loop through the table columns and update certain properties like maxLines to overcome html2canvas limitations.
		 * @param {sap.gantt.simple.PrintDialogTemplate} printDialogTemplate which takes custom buttons to display on print Dialog
		 * @returns {Promise} A promise for chaining actions after the print dialog is ready.
		 * @public
		 */
		GanttPrinting.prototype.open = function (fnUpdateTable,printDialogTemplate) {
			if (!this.getGanttChart() || !this._getOriginalGanttChart().isA("sap.gantt.simple.GanttChartWithTable")) {
				throw new Error("Association 'ganttChart' of type 'sap.gantt.simple.GanttChartWithTable' is not set");
			}
			var that = this;
			if (fnUpdateTable) {
				fnUpdateTable(this._ganttChartClone.getTable());
			}
			this._createAndOpenDialog(false,printDialogTemplate);
			this._oDialog.getContent()[0].setBusy(true);
			this._oButtonExport.setEnabled(false);
			if (this._oButtonSave){
				this._oButtonSave.setEnabled(false);
			}
			if (this._ganttChartClone._enableOptimisation) {
				this._ganttChartClone.setShowGanttHeader(true);
				return this._drawClonedGantt(false).then(function () {
					if (that._bMultipleBatches) {
							that._openProgressDialog();
						}
						return that.generateCanvasAsync(0);
					}).catch(function(oErrorObj) {
						if (oErrorObj && oErrorObj.bMaxCanvasSizeExceeded  || oErrorObj.dateDurationNotSet ) {
							that._updateDialogPreviewCanvas();
							that._oDialog.getContent()[0].setBusy(false);
						}
					});
			} else {
				if (GanttChartConfigurationUtils.getRTL()) {
					that._ganttChartClone._bRenderGanttClone = true;
				}
				return this._drawClonedGantt(false).then(function () {
					that._bExpandCollapse = true;
					return that._expandAndCollapse();
				}).then(function (){
					that._ganttChartClone._bExpandRows = true;
					return that._expandRowSettings();
				}).then(function () {
					that._ganttChartClone._bExpandRows = false;
					that._setCloneDivHeightNonOptimised();
					document.getElementById(that._ganttChartClone.getId() + "-sapGanttBackgroundTableContent").style.height = that._iContentHeight;
					document.getElementById(that._ganttChartClone.getTable().getId() + "-tableCCnt").style.height = that._iContentHeight;
						return that._createGanttCanvas();
				}).then(function (oUpdatedCanvas) {
						that._oGanttCanvas = oUpdatedCanvas;
						that._updateDialogPreview();
						that._oDialog.getContent()[0].setBusy(false);
						that._oButtonExport.setEnabled(true);
				}).catch(function(oErrorObj) {
						if (oErrorObj && oErrorObj.bMaxCanvasSizeExceeded || oErrorObj.dateDurationNotSet) {
							that._updateDialogPreviewCanvas();
							that._oDialog.getContent()[0].setBusy(false);
						}
				});
			}
		};
		/**
		 * @param {boolean} bUpdate decides whether to show error dialog
		 * @private
		 */
		GanttPrinting.prototype._updateDialogErrorPDFPreview = function (bUpdate) {
			var oDialogPreviewDiv = this._oPdfDialogPreview.$().find(".sapGanttPdfPreviewPageDiv");
			var $dialogPreviewDiv = oDialogPreviewDiv[0];
			if (!bUpdate) {
				removeDialogPreviewChilds($dialogPreviewDiv);
			} else {
				this._oPreviewErrorMessageStrip =  new MessageStrip({
					text: this._oRb.getText("GNT_PRNTG_ERROR_DATEDURATION_PREVIEW"),
					showIcon: true,
					type: "Error"
				}).addStyleClass("sapGanttPrintingBottomMargin");
				var oPreviewErrorDiv = document.createElement("div");
				oPreviewErrorDiv.id = this.getId() + "-previewErrorMessageStrip";
				oPreviewErrorDiv.style.width = "50%";
				oPreviewErrorDiv.style.marginTop = "25%";
				oPreviewErrorDiv.style.marginLeft = "25%";
				$dialogPreviewDiv.appendChild(oPreviewErrorDiv);
				this._oPreviewErrorMessageStrip.placeAt(this.getId() + "-previewErrorMessageStrip");
			}
		};
		/**
		 * Opens the print dialog for single page printing.
		 * @param {function} fnUpdateTable Optional function which takes cloned gantt chart's table for modification. Applications can loop through the table columns and update certain properties like maxLines to overcome html2canvas limitations.
		 * @param {sap.gantt.simple.PrintDialogTemplate} printDialogTemplate which takes custom buttons to display on print Dialog
		 * @returns {Promise} A promise for chaining actions after the print dialog is ready.
		 * @since 1.111
		 */
		GanttPrinting.prototype.openPdfPreview = function (fnUpdateTable,printDialogTemplate) {
			if (!this.getGanttChart() || !this._getOriginalGanttChart().isA("sap.gantt.simple.GanttChartWithTable")) {
				throw new Error("Association 'ganttChart' of type 'sap.gantt.simple.GanttChartWithTable' is not set");
			}
			this._bSinglePage = true;
			this._oDomToPrint = [];
			this._oDomToPrintHeight = 0;
			this._oDomToPrintWidth = 0;
			var that = this;
			if (fnUpdateTable) {
				fnUpdateTable(this._ganttChartClone.getTable());
			}

			this._createAndOpenDialog(true,printDialogTemplate);
			this._oDialog.getContent()[0].setBusy(true);
			this._oButtonExport.setEnabled(false);
			if (this._oButtonSave){
				this._oButtonSave.setEnabled(false);
			}
			this._ganttChartClone.setShowGanttHeader(true);
			return this._drawClonedGantt(true).then(function () {
				if (that._bMultipleBatches) {
					that._openProgressDialog();
				}
				return that.generatePdfAsync(0);
			}).catch(function(oErrorObj) {
				if (oErrorObj) {
					if (oErrorObj.dateDurationNotSet) {
						that._updateDialogErrorPDFPreview(true);
					}
					that._oDialog.getContent()[0].setBusy(false);
				}
			});
		};

		/**
		 * Closes the print dialog.
		 *
		 * @public
		 */
		GanttPrinting.prototype.close = function () {
			var oGanttChart = this._getOriginalGanttChart();
			if (this._initialDisplayType === GanttChartWithTableDisplayType.Table) {
				oGanttChart.setSelectionPanelSize(this._initialSelectionPanelSize);
				oGanttChart.setDisplayType(this._initialDisplayType);
				if (oGanttChart.getParent() && oGanttChart.getParent().isA("sap.gantt.simple.GanttChartContainer") && oGanttChart.getParent().getToolbar()) {
					oGanttChart.getParent().getToolbar()._oDisplayTypeSegmentedButton.setSelectedKey(GanttChartWithTableDisplayType.Table);
				}
			}
			this._ganttChartClone.destroy();
			this._ganttChartClone = null;
			this._ganttChartContainer.destroy();
			this._ganttChartContainer = null;
			document.body.removeChild(this._oClonedGanttDiv);

			ResizeHandler.deregister(this._sResizeHandlerId);
			if (this._oPdfPreview) {
				this._oPdfPreview.destroy();
			}
			this._oDialog.close();
			this._oDialog.destroy();
			if (Device.browser.safari) {
				oGanttChart.getInnerGantt().invalidate();
			}
		};

		/**
		 * Closes the progress indicator dialog.
		 *
		 * @private
		 */
		GanttPrinting.prototype._closeProgressIndicator = function (bPreviewGenerated) {
			this._oProgressDialog.close();
			this._oProgressDialog.destroy();
			this._bCancel = true;
			if (!this._bUpdateGanttCanvas && !bPreviewGenerated) {
				this.close();
			}
		};

		/**
		 * Sets the Gantt chart to be exported as PDF.
		 *
		 * @param oGanttChart Gantt chart to export
		 * @returns {this}
		 * @public
		 */
		GanttPrinting.prototype.setGanttChart = function (oGanttChart) {
			this.setAssociation("ganttChart", oGanttChart);
			this._initialDisplayType = oGanttChart.getDisplayType();
			this._initialSelectionPanelSize = oGanttChart._iLastTableAreaSize ? oGanttChart._iLastTableAreaSize : oGanttChart.getSelectionPanelSize();
			var bDisplayTypeTable = this._initialDisplayType === GanttChartWithTableDisplayType.Table ? true : false;
			if (bDisplayTypeTable) {
				oGanttChart.setSelectionPanelSize("100%");
				oGanttChart.setDisplayType(GanttChartWithTableDisplayType.Both);
			}

			// aggregation - clone
			this._ganttChartClone = oGanttChart.clone();
			this._ganttChartClone._enableOptimisation = oGanttChart.getPrintingBatchSize() > 0 ? true : false;
			this._bUpdateGanttCanvas = false;
			this._bCancel = false;
			this._ganttChartClone.setEnableChartOverflowToolbar(false);
			// canvas scale
			this.canvasScale = 2;

			if (this._ganttChartClone._enableOptimisation) {
				this._ganttChartClone.getTable().destroyExtension();
				var iZoomLevel = bDisplayTypeTable ? 1 : Math.max((oGanttChart.getAxisTimeStrategy().getZoomLevel()), 1);
				this.iThreshold = Math.min(Math.round(oGanttChart.getPrintingBatchSize() / iZoomLevel), oGanttChart.getTable()._getTotalRowCount());
				this._bMultipleBatches = oGanttChart.getTable()._getTotalRowCount() > this.iThreshold;
				this.bFirst = true;
				if (this._getOriginalGanttChart._bExpandToggled) {
					this._ganttChartClone.getTable().setRowMode(new FixedRowMode({
						rowCount: this.iThreshold
					}));
				} else {
					var oCloneTable = this._ganttChartClone.getTable();
					var oRowMode = oCloneTable.getRowMode(), nRowHeight = 0;
					if (oRowMode && oRowMode.getRowContentHeight()) {
						nRowHeight = oRowMode.getRowContentHeight();
					} else {
						/**
						 * @deprecated As of version 1.119
						 */
						nRowHeight = oCloneTable.getRowHeight();
					}
					this._ganttChartClone.getTable().setRowMode(new FixedRowMode({
						rowCount: this.iThreshold,
						rowContentHeight: nRowHeight ? nRowHeight : Math.ceil(oGanttChart.getTableRowHeights()[0])
					}));
				}
				this._ganttChartClone.getTable().setThreshold(this.iThreshold);
				this._ganttChartClone.setParent(this._getOriginalGanttChart(), "originalGanttChart", true);
			} else {
				// Because of Models
				this._ganttChartContainer.setParent(this._getOriginalGanttChart(), "originalGanttChart", true);
			}

			this._addBackOriginalGanttRowBinding(this._ganttChartClone, oGanttChart);
			this._originalHasRenderedShapes = oGanttChart.getInnerGantt().hasRenderedShapes();

			// detach all events
			this._ganttChartClone.mEventRegistry = {};

			this._ganttChartClone.setHeight("100%");

			// set panel size in px from original gantt chart (default panel size is 30%)
			var iTableSize = oGanttChart._oSplitter._calculatedSizes[0];
			if (this._initialDisplayType === GanttChartWithTableDisplayType.Chart) {
				this._ganttChartClone.setProperty("selectionPanelSize", "1px", true);	// need some table area for gantt header to render
			} else {
				this._ganttChartClone.setProperty("selectionPanelSize", (iTableSize.toString() + "px"), true);
			}

			var oAxisTimeStrategy = oGanttChart.getAxisTimeStrategy();
			if (!oAxisTimeStrategy.isA("sap.gantt.axistime.FullScreenStrategy") && !bDisplayTypeTable) {
				oGanttChart.isPrint = true;
				oGanttChart._getScrollExtension()._updateVisibleHorizonForce();
				// set visible horizon to total horizon, we always need to see the full graph
				var oCloneAxisTimeStrategy = this._ganttChartClone.getAxisTimeStrategy();
				oCloneAxisTimeStrategy.setTotalHorizon(oAxisTimeStrategy.getTotalHorizon());
				oCloneAxisTimeStrategy.setVisibleHorizon(oAxisTimeStrategy.getTotalHorizon());
			}

			// calculate how many pixels are in a sec
			var oVisibleHorizon = oAxisTimeStrategy.getVisibleHorizon();
			var oVisibleHorizonDates = this._getHorizonDates(oVisibleHorizon);
			var iVisibleHorizonInSec = this._horizonWidthInSec(oVisibleHorizonDates);
			this._fPixelsBySec = oGanttChart.getVisibleWidth() / iVisibleHorizonInSec;
			this._ganttChartClone.isPrint = true;
			this._ganttChartClone._bClonedGantt = true; //Private Flag to indicate cloned GanttChart
			// not using ganttChartContainer when optimisation is enabled
			if (!this._ganttChartClone._enableOptimisation) {
				this._ganttChartContainer.addGanttChart(this._ganttChartClone);
			}
			return this;
		};

		/* ================================================= */
		/* 					Private methods					 */
		/* ================================================= */


		GanttPrinting.prototype._expandAndCollapse = function () {
			var that = this;
			return this._expandAndCollapseRow().then(function () {
				if (that._bExpandCollapse) {
					return that._expandAndCollapse();
				} else {
					return Promise.resolve();
				}
			});
		};

		GanttPrinting.prototype._expandAndCollapseRow = function () {
			// expansion state of the nodes is not duplicated during cloning
			// it is held in the binding and has to be copied after the binding is initialized on the cloned gantt
			if (this._bCancel) {
				this._bExpandCollapse = false;
				return Promise.reject();
			}
			var oOriginalGanttTable = this._getOriginalGanttChart().getTable();
			if (!oOriginalGanttTable.isA("sap.ui.table.TreeTable")) {
				this._bExpandCollapse = false;
				return this._ganttChartClone.getInnerGantt().resolveWhenReady(this._originalHasRenderedShapes);
			}
			var	oOrigRowsBinding = oOriginalGanttTable.getBinding("rows"),
				oCloneRowsBinding = this._ganttChartClone.getTable().getBinding("rows");
			for (var i = 0; i < oOrigRowsBinding.getLength(); i++) {
				if ((oCloneRowsBinding.findNode(i) !== undefined) && oOrigRowsBinding.isExpanded(i) && !oCloneRowsBinding.isExpanded(i)) {
					oCloneRowsBinding.expand(i);
					return this.renderGanttClone(true);
				} else if ((oCloneRowsBinding.findNode(i) !== undefined) && !oOrigRowsBinding.isExpanded(i) && oCloneRowsBinding.isExpanded(i)) {
					oCloneRowsBinding.collapse(i);
					return this.renderGanttClone(true);
				}
			}
			this._bExpandCollapse = false;
			return Promise.resolve();
		};

		/**
		 * This is to handle the expanded rows and inline shapes
		 */
		GanttPrinting.prototype._expandRowSettings = function () {
            if (this._bCancel) {
				return Promise.reject();
			}
			var bPrimary = this._ganttChartClone.getUseParentShapeOnExpand();
			var sScheme = this._ganttChartClone.getShapeSchemes().find(function(scheme){
				return bPrimary ? scheme.getPrimary() : !scheme.getPrimary();
			});

			var oGantt = this._getOriginalGanttChart();
			var oOverlapShapeIds = oGantt.oOverlapShapeIds;
			var aExpandIndices = oGantt._aExpandedIndices, aPseudoExpandIndices = [];
			var bPseudoShapeDisplay = this._ganttChartClone.getEnablePseudoShapes();

			if (bPseudoShapeDisplay) {
				for (var key in oOverlapShapeIds){
					if (oOverlapShapeIds[key].length > 0) {
						aPseudoExpandIndices.push(parseInt(key));
					}
				}
				if (aPseudoExpandIndices.length > 0) {
					aExpandIndices = aExpandIndices.filter(function(value){
						return aPseudoExpandIndices.indexOf(value) == -1;
					});
				}
			}
			if (aExpandIndices) {
				var aExpandedData;
				var iCount = 0, aExpandedRowUids = Object.keys(oGantt._oExpandModel.mExpanded);
				var iExpandedRowUidsCount = aExpandedRowUids.length;
				while (!aExpandedData && iCount != iExpandedRowUidsCount){
					var sUid = aExpandedRowUids[iCount];
					if (!oGantt._oExpandModel.mExpanded[sUid][1].expandSchemeShape){
						aExpandedData = oGantt._oExpandModel.mExpanded[sUid];
					}
					iCount++;
				}
				aExpandedData = aExpandedData ? aExpandedData : [];
				var aSchemesKeys = [];
				aExpandedData.forEach(function(obj){
					aSchemesKeys.push(obj.scheme);
				});
			}
			var aExpandScheme = aSchemesKeys && aSchemesKeys.length ? aSchemesKeys : sScheme && sScheme.getKey();
			if (aExpandScheme){
				if (!this._ganttChartClone._aExpandedIndices || this._ganttChartClone._aExpandedIndices.length === 0) {
					this._ganttChartClone.expand(aExpandScheme, aExpandIndices);
				}
			}
				if (bPseudoShapeDisplay && !this._ganttChartClone.oOverlapShapeIds) {
					aPseudoExpandIndices.forEach(function(iRowIndex) {
						this._oPseudoShape = null;
						this._expandPseudoShapeInRow(iRowIndex);
					}.bind(this));
				}
			return this._ganttChartClone.getInnerGantt().resolveWhenReady(this._originalHasRenderedShapes);
		};

		GanttPrinting.prototype._expandPseudoShapeInRow = function (iRowIndex) {
			if (this._bCancel) {
				return Promise.reject();
			}
			var oTable = this._ganttChartClone.getTable();
			var oRow = oTable.getRows()[iRowIndex];
			var oRowSetting = oRow ? oRow.getAggregation("_settings") : null;
			var oOverlapShapeIdsInRow = this._getOriginalGanttChart().oOverlapShapeIds[iRowIndex];
			if (oRowSetting) {
				var mAggregations = AggregationUtils.getAllNonLazyAggregations(oRowSetting);
				var aShapesInRow = Object.keys(mAggregations).filter(function(sName){
					return (sName.indexOf("calendars") === -1) && sName !== "relationships";
				}).map(function(sName){
					return oRowSetting.getAggregation(sName) || [];
				});

				aShapesInRow.forEach(function(aShapes) {
					if (aShapes && aShapes.length > 0 && !this._oPseudoShape) {
						var iIndex = 0;
						while (iIndex < aShapes.length && !this._oPseudoShape) {
							var oShape = aShapes[iIndex];
							if (oShape.isPseudoShape) {
								var aShapeIDs = oShape.aShapeIds;
								if (oOverlapShapeIdsInRow.indexOf(aShapeIDs[0]) !== -1) {
									this._oPseudoShape = oShape;
									oShape.onclick();
								}
							}
							iIndex++;
						}
					}
				}.bind(this));
			}
		};

		GanttPrinting.prototype._onResize = function () {
			if (this._oHTMLDialogPreview) {
				var $dialogPreviewContentDiv = this._oHTMLDialogPreview.getDomRef();
				$dialogPreviewContentDiv.style.overflow = "hidden";
				this._resizePrintingPreviewPage();
				// overflow has to be set to visible because of the page shadow
				$dialogPreviewContentDiv.style.overflow = "visible";
			}
		};

		GanttPrinting.prototype._onChangeUnitComboBox = function () {
			this._updatePaperSizeInputs();
			this._updateMarginInputs();
			// TODO add this with crop marks feature
			// this._updateCropMarksOffsetInput();
		};

		GanttPrinting.prototype._updatePaperSizeInputs = function () {
			var fPaperWidth = this._oModel.getProperty("/paperWidth"),
				fPaperHeight = this._oModel.getProperty("/paperHeight");

			this._setPaperSizeInputs(fPaperWidth, fPaperHeight);
		};

		GanttPrinting.prototype._setPaperSizeInputs = function (fPaperWidth, fPaperHeight) {
			var sUnit = this._oModel.getProperty("/unit");
			if (this._oInputPaperWidth) {
				this._oInputPaperWidth.setValue(PrintUtils._convertPxToUnit(fPaperWidth,sUnit));
			}
			if (this._oInputPaperHeight) {
				this._oInputPaperHeight.setValue(PrintUtils._convertPxToUnit(fPaperHeight,sUnit));
			}
		};

		GanttPrinting.prototype._setPaperSizesToModel = function (fPaperWidth, fPaperHeight) {
			// update sizes to the model
			this._oModel.setProperty("/paperWidth", fPaperWidth);
			this._oModel.setProperty("/paperHeight", fPaperHeight);
		};

		GanttPrinting.prototype._updatePaperSizeValues = function (bSinglePage, $event) {
			var sPaperSize = this._oModel.getProperty("/paperSize"),
				bPortrait = this._oModel.getProperty("/portrait"),
				fPaperWidth,
				fPaperHeight;

			if (!sPaperSize || sPaperSize === "Custom") {
				return;
			}

			var oSizes = PrintUtils._getPaperConfiguarations()[sPaperSize];
			if (bPortrait) {
				fPaperWidth = oSizes.width;
				fPaperHeight = oSizes.height;
			} else {
				fPaperWidth = oSizes.height;
				fPaperHeight = oSizes.width;
			}
			this._setPaperSizeInputs(fPaperWidth, fPaperHeight);
			this._setPaperSizesToModel(fPaperWidth, fPaperHeight);

			if (sPaperSize === "Letter" || sPaperSize === "Legal" || sPaperSize === "Tabloid") {
				this._oComboBoxUnit.setSelectedKey("in");
			} else {
				this._oComboBoxUnit.setSelectedKey("mm");
			}

			this._onChangeUnitComboBox();
			if (bSinglePage) {
				this._generateSvgToPdf();
			} else {
				this._updateDialogPreview();
			}
		};

		GanttPrinting.prototype._updatePaperOrientation = function (oEvent) {
			var fPaperWidth = this._oModel.getProperty("/paperWidth"),
				fPaperHeight = this._oModel.getProperty("/paperHeight");

			if (fPaperHeight > fPaperWidth) {
				this._oModel.setProperty("/portrait", true);
				this._radioGroupOrientation.setSelectedIndex(0);
			} else {
				this._oModel.setProperty("/portrait", false);
				this._radioGroupOrientation.setSelectedIndex(1);
			}
		};

		GanttPrinting.prototype._onChangePaperSizeInput = function (bSinglePage, oEvent) {
			var oChangedInput = oEvent.getSource();
			var sUnit  = this._oModel.getProperty("/unit");
			var fNewValue = PrintUtils._convertUnitToPx(NumberFormat.getFloatInstance({"groupingSeparator": ',',"decimalSeparator": "."}).parse(oChangedInput.getValue()),sUnit);

			if (oChangedInput === this._oInputPaperWidth) {
				this._oModel.setProperty("/paperWidth", fNewValue);
			} else {
				this._oModel.setProperty("/paperHeight", fNewValue);
			}

			this._oComboBoxPaperSizes.setSelectedKey("Custom");

			this._updatePaperOrientation();
			if (bSinglePage) {
				this._generateSvgToPdf();
			} else {
				this._updateDialogPreview();
			}
		};

		GanttPrinting.prototype._onChangeCompressionSlider = function (oEvent) {
			var oChangedSlider = oEvent.getSource();
			var iNewValue = oChangedSlider.getValue();

			this._setCompressionComboBoxItem(iNewValue);
		};

		GanttPrinting.prototype._setCompressionComboBoxItem = function (iNewValue) {
			if (iNewValue === 100) {
				this._oComboBoxCompression.setSelectedKey("maximum");
			} else if (iNewValue >= 75) {
				this._oComboBoxCompression.setSelectedKey("high");
			} else if (iNewValue >= 50) {
				this._oComboBoxCompression.setSelectedKey("medium");
			} else {
				this._oComboBoxCompression.setSelectedKey("low");
			}
		};

		GanttPrinting.prototype._onChangeCompressionComboBox = function (oEvent) {
			var sKey = oEvent.getSource().getSelectedKey();

			var mCompQuality = {
				maximum: 100,
				high: 75,
				medium: 50,
				low: 25
			};

			this._oModel.setProperty("/compressionQuality", mCompQuality[sKey]);
		};

		GanttPrinting.prototype._onChangeOrientation = function (bSinglePage, $event) {
			var fPaperWidth = this._oModel.getProperty("/paperWidth"),
				fPaperHeight = this._oModel.getProperty("/paperHeight");

			// swap values
			this._setPaperSizeInputs(fPaperHeight, fPaperWidth);
			this._setPaperSizesToModel(fPaperHeight, fPaperWidth);

			if (bSinglePage) {
				this._generateSvgToPdf();
			} else {
				this._updateDialogPreview();
			}
		};

		GanttPrinting.prototype._onChangeExportTypes = function () {
			this._updateDialogPreview();
		};

		GanttPrinting.prototype._setMarginInputs = function (fTop, fRight, fBottom, fLeft) {
			var sUnit = this._oModel.getProperty("/unit");
			this._oInputMarginTop.setValue(PrintUtils._convertPxToUnit(fTop,sUnit));
			this._oInputMarginRight.setValue(PrintUtils._convertPxToUnit(fRight,sUnit));
			this._oInputMarginBottom.setValue(PrintUtils._convertPxToUnit(fBottom,sUnit));
			this._oInputMarginLeft.setValue(PrintUtils._convertPxToUnit(fLeft,sUnit));
		};

		GanttPrinting.prototype._setMarginsToModel = function (fTop, fRight, fBottom, fLeft) {
			if (fTop !== undefined) {
				this._oModel.setProperty("/marginTop", fTop);
			}

			if (fRight !== undefined) {
				this._oModel.setProperty("/marginRight", fRight);
			}

			if (fBottom !== undefined) {
				this._oModel.setProperty("/marginBottom", fBottom);
			}

			if (fLeft !== undefined) {
				this._oModel.setProperty("/marginLeft", fLeft);
			}
		};

		GanttPrinting.prototype._onChangeMarginComboBox = function (bSinglePage , oEvent) {
			var sKey = oEvent.getSource().getSelectedKey();

			// default margin is 5mm
			var fMargin = PrintUtils._mmToPx(5);
			if (sKey === "none") {
				fMargin = 0;
			}

			this._setMarginsToModel(fMargin, fMargin, fMargin, fMargin);
			this._setMarginInputs(fMargin, fMargin, fMargin, fMargin);

			if (bSinglePage) {
				this._generateSvgToPdf();
			} else {
				this._updateDialogPreview();
			}
		};

		GanttPrinting.prototype._updateModelFromMarginInputs = function () {
			var fMarginTop,
				fMarginRight,
				fMarginBottom,
				fMarginLeft;
			var sUnit = this._oModel.getProperty("/unit");
			if (this._oInputMarginTop.getValueState() !== "Error") {
				fMarginTop = PrintUtils._convertUnitToPx(this._oInputMarginTop.getValue(),sUnit);
			}

			if (this._oInputMarginRight.getValueState() !== "Error") {
				fMarginRight = PrintUtils._convertUnitToPx(this._oInputMarginRight.getValue(),sUnit);
			}

			if (this._oInputMarginBottom.getValueState() !== "Error") {
				fMarginBottom = PrintUtils._convertUnitToPx(this._oInputMarginBottom.getValue(),sUnit);
			}

			if (this._oInputMarginLeft.getValueState() !== "Error") {
				fMarginLeft = PrintUtils._convertUnitToPx(this._oInputMarginLeft.getValue(),sUnit);
			}

			this._setMarginsToModel(fMarginTop, fMarginRight, fMarginBottom, fMarginLeft);
		};

		GanttPrinting.prototype._updateMarginInputs = function () {
			var fMarginTop = this._oModel.getProperty("/marginTop");
			var fMarginRight = this._oModel.getProperty("/marginRight");
			var fMarginBottom = this._oModel.getProperty("/marginBottom");
			var fMarginLeft = this._oModel.getProperty("/marginLeft");

			this._setMarginInputs(fMarginTop, fMarginRight, fMarginBottom, fMarginLeft);
		};

		GanttPrinting.prototype._updateCropMarksOffsetInput = function () {
			var fCropMarksOffset = this._oModel.getProperty("/cropMarksOffset");
			var sUnit = this._oModel.getProperty("/unit");
			this._oInputCropMarksOffset.setValue(PrintUtils._convertPxToUnit(fCropMarksOffset,sUnit));
		};

		GanttPrinting.prototype._onChangeMarginInput = function (bSinglePage , oEvent) {
			var oChangedInput = oEvent.getSource();

			if (oChangedInput.getValueState() === "Error") {
				return;
			}

			if (this._oModel.getProperty("/marginLocked")) {
				var sUnit = this._oModel.getProperty("/unit");
				var fNewValue = PrintUtils._convertUnitToPx(oChangedInput.getValue(),sUnit);

				this._setMarginInputs(fNewValue, fNewValue, fNewValue, fNewValue);
				this._setMarginsToModel(fNewValue, fNewValue, fNewValue, fNewValue);
			} else {
				this._updateModelFromMarginInputs();
			}

			if (bSinglePage) {
				this._generateSvgToPdf();
			} else {
				this._updateDialogPreview();
			}
		};

		GanttPrinting.prototype._onChangeCropMarksInput = function (oEvent) {
			var oChangedInput = oEvent.getSource();
			var sUnit = this._oModel.getProperty("/unit");
			var fNewValue = PrintUtils._convertUnitToPx(oChangedInput.getValue(),sUnit);

			this._oInputCropMarksOffset.setValue(PrintUtils._convertPxToUnit(fNewValue,sUnit));
			this._oModel.setProperty("/cropMarksOffset", fNewValue);
		};

		GanttPrinting.prototype._allRange = function () {
			this._oModel.setProperty("/startDate", this._oDatePickerFrom.getMinDate());
			this._oModel.setProperty("/endDate", this._oDatePickerTo.getMaxDate());
		};

		GanttPrinting.prototype._getFirstDayOfNextWeek = function (oDate) {
			var iFirstDayOfWeek = this._getOriginalGanttChart().getAxisTimeStrategy().getFirstDayOfWeek();
			var iDaysToFirstDayOfWeek = (iFirstDayOfWeek + 7 - oDate.getDay()) % 7;
			// if today is the first day of week add 7 days to move to the right date
			return new Date(oDate.getFullYear(), oDate.getMonth(), oDate.getDate() + (iDaysToFirstDayOfWeek === 0 ? 7 : iDaysToFirstDayOfWeek));
		};

		GanttPrinting.prototype._nextWeekRange = function () {
			var oNow = new Date();
			var oNextWeek = this._getFirstDayOfNextWeek(oNow);

			this._oModel.setProperty("/startDate", this._validateDate(oNextWeek));
			this._oModel.setProperty("/endDate", this._validateDate(new Date(oNextWeek.getFullYear(), oNextWeek.getMonth(), oNextWeek.getDate() + 7)));
		};

		GanttPrinting.prototype._getFirstDayOfNextMonth = function (oDate) {
			return new Date(oDate.getFullYear(), oDate.getMonth() + 1, 1);
		};

		GanttPrinting.prototype._nextMonthRange = function () {
			var oNow = new Date();

			this._oModel.setProperty("/startDate", this._validateDate(this._getFirstDayOfNextMonth(oNow)));
			this._oModel.setProperty("/endDate", this._validateDate(new Date(oNow.getFullYear(), oNow.getMonth() + 2, 1)));
		};

		GanttPrinting.prototype._validateDate = function (oDate) {
			var oMaxDate = this._oDatePickerTo.getMaxDate(),
				oMinDate = this._oDatePickerFrom.getMinDate();

			if (oDate.getTime() > oMaxDate.getTime()) {
				return oMaxDate;
			}

			if (oDate.getTime() < oMinDate.getTime()) {
				return oMinDate;
			}

			return oDate;
		};

		GanttPrinting.prototype._onChangeDurationComboBox = function (bSinglePage) {
			this._validateDurationInput();
			var sDurationValue = this._oModel.getProperty("/duration");

			switch (sDurationValue) {
				case "all": {
					this._allRange();
					break;
				}

				case "week": {
					this._nextWeekRange();
					break;
				}

				case "month": {
					this._nextMonthRange();
					break;
				}

				case "custom":
				default:
					return;
			}
			if (bSinglePage) {
				this._updateGanttPdf();
			} else {
				this._updateGanttCanvas();
			}
		};

		GanttPrinting.prototype._onChangeDurationDatePicker = function (bSinglePage) {
			this._oComboBoxDuration.setSelectedKey("custom");
			this._oComboBoxDuration.setValueState(ValueState.None);
			if (this._oDatePickerFrom.isValidValue() && this._oDatePickerTo.isValidValue()) {
				if ((this._oDatePickerFrom.getDateValue().getTime() <= this._oDatePickerTo.getDateValue().getTime())) {
					this._oDatePickerFrom.setValueState(ValueState.None);
					this._oDatePickerTo.setValueState(ValueState.None);
					if (bSinglePage) {
						this._updateGanttPdf();
					} else {
						this._updateGanttCanvas();
					}
				} else {
					this._oDatePickerFrom.setValueState(ValueState.Error);
					this._oDatePickerTo.setValueState(ValueState.Error);
				}
			} else {
				var sFromValueState = this._oDatePickerFrom.isValidValue() ? ValueState.None : ValueState.Error;
				var sToValueState = this._oDatePickerTo.isValidValue() ? ValueState.None : ValueState.Error;
				this._oDatePickerFrom.setValueState(sFromValueState);
				this._oDatePickerTo.setValueState(sToValueState);
			}
		};

		GanttPrinting.prototype._setEnabledPreviousButtons = function (bValue) {
			this._oButtonFirst.setEnabled(bValue);
			this._oButtonPrevious.setEnabled(bValue);
		};

		GanttPrinting.prototype._setEnabledNextButtons = function (bValue) {
			this._oButtonNext.setEnabled(bValue);
			this._oButtonLast.setEnabled(bValue);
		};

		GanttPrinting.prototype._updatePageNumberButtons = function () {
			if (!this._oGanttCanvas) {
				this._setEnabledNextButtons(false);
				this._setEnabledPreviousButtons(false);
				return;
			}

			var iCurrentPage = this._oModel.getProperty("/previewPageNumber"),
				iLastPage = this._oModel.getProperty("/lastPageNumber");

			// if iLastPage is undefined, allow to press next
			if (!iLastPage) {
				iLastPage = Number.MAX_SAFE_INTEGER;
			}

			if (iCurrentPage <= 1) {
				this._setEnabledPreviousButtons(false);
			}

			if (iCurrentPage >= iLastPage) {
				this._setEnabledNextButtons(false);
			}

			if (iCurrentPage > 1) {
				this._setEnabledPreviousButtons(true);
			}

			if (iCurrentPage < iLastPage) {
				this._setEnabledNextButtons(true);
			}
		};

		GanttPrinting.prototype._getHeaderHeight = function () {
			var bHeaderText = this._oModel.getProperty("/showHeaderText");
			if (bHeaderText) {
				return this._iHeaderAndFooterHeight;
			}

			return 0;
		};

		GanttPrinting.prototype._isFooterMultiline = function () {
			// footer is never multiline in single page mode
			if (!this._oModel.getProperty("/multiplePage")) {
				return false;
			}

			var bPageNumber = this._oModel.getProperty("/showPageNumber"),
				bFooterText = this._oModel.getProperty("/showFooterText");

			if (!bFooterText || !bPageNumber || this._bSinglePage ) {
				return false;
			}

			var sFooterText = this._oModel.getProperty("/footerText"),
				fPaperWidth = this._oModel.getProperty("/paperWidth"),
				fMargin;

			var bRTL = GanttChartConfigurationUtils.getRTL();
			if (bRTL) {
				fMargin = this._oModel.getProperty("/marginRight");
			} else {
				fMargin = this._oModel.getProperty("/marginLeft");
			}

			// to make it easier - number > 9 and < 100 has width roughly 14px
			// lets say average number width is 14px width -> 7px from the beginning to the center of the number
			var fPageNumberWidth = 7;

			var oCanvasContext = this._oGanttCanvas.getContext("2d");
			oCanvasContext.font = TEXTFONT;
			var fFooterTextWidth = oCanvasContext.measureText(sFooterText).width;

			if (fPaperWidth / 2 > (fMargin + PrintUtils._mmToPx(4) /* footer text padding */
				+ fFooterTextWidth + PrintUtils._mmToPx(10) /* space between text and page number */ + fPageNumberWidth)) {
				return false;
			} else {
				return true;
			}
		};

		GanttPrinting.prototype._getFooterHeight = function () {
			var bPageNumber = this._oModel.getProperty("/showPageNumber"),
				bFooterText = this._oModel.getProperty("/showFooterText");

			if (bFooterText && bPageNumber) {
				return this._isFooterMultiline() ? 2 * this._iHeaderAndFooterHeight : this._iHeaderAndFooterHeight;
			}

			if (bFooterText || bPageNumber) {
				return this._iHeaderAndFooterHeight;
			}

			return 0;
		};

		GanttPrinting.prototype._isShrinkableToOnePageByWidth = function () {
			var fPaperWidthRatio = this._getPaperContentWidth() / this._getPaperContentHeight(),
				fChartWidthRatio = this._oGanttCanvas.width / this._oGanttCanvas.height;

			return fPaperWidthRatio <= fChartWidthRatio;
		};

		GanttPrinting.prototype._isDomShrinkableToOnePageByWidth = function (oDomToPrintHeight, oDomToPrintWidth) {
			var fPaperWidthRatio = this._getPaperContentWidth() / this._getPaperContentHeight(),
				fChartWidthRatio = oDomToPrintWidth / oDomToPrintHeight;

			return fPaperWidthRatio <= fChartWidthRatio;
		};

		GanttPrinting.prototype._getPaperContentWidth = function () {
			var fPaperWidth = this._oModel.getProperty("/paperWidth"),
				fMarginLeft = this._oModel.getProperty("/marginLeft"),
				fMarginRight = this._oModel.getProperty("/marginRight");

			return fPaperWidth - fMarginLeft - fMarginRight;
		};

		GanttPrinting.prototype._getPaperContentHeight = function () {
			var fPaperHeight = this._oModel.getProperty("/paperHeight"),
				fMarginTop = this._oModel.getProperty("/marginTop"),
				fMarginBottom = this._oModel.getProperty("/marginBottom");

			return fPaperHeight - fMarginTop - this._getHeaderHeight() - fMarginBottom - this._getFooterHeight();
		};

		GanttPrinting.prototype._getScale = function () {
			return (100 / this._oModel.getProperty("/scale")) * 2;
		};

		GanttPrinting.prototype._getCroppingWidth = function () {
			return this._getScale() * this._getPaperContentWidth();
		};

		GanttPrinting.prototype._getCroppingHeight = function () {
			return this._getScale() * this._getPaperContentHeight();
		};

		GanttPrinting.prototype._getPagesInARow = function () {
			return Math.ceil(this._oGanttCanvas.width / this._getCroppingWidth());
		};

		GanttPrinting.prototype._getPagesInAColumn = function () {
			return Math.ceil(this._oGanttCanvas.height / this._getCroppingHeight());
		};

		GanttPrinting.prototype._updateLastPageNumber = function () {
			if (!this._oGanttCanvas) {
				return;
			}

			var iLastPage = this._getPagesInARow() * this._getPagesInAColumn();
			this._oModel.setProperty("/lastPageNumber", iLastPage);

			// if current page is higher then last page, set it to the last page
			var iCurrentPage = this._oModel.getProperty("/previewPageNumber");

			if (iCurrentPage > iLastPage) {
				this._oModel.setProperty("/previewPageNumber", iLastPage);
			}

		};

		GanttPrinting.prototype._onPressButtonFirst = function () {
			this._oModel.setProperty("/previewPageNumber", 1);

			this._updatePageNumberButtons();
			this._updateDialogPreviewCanvas();
		};

		GanttPrinting.prototype._onPressButtonPrevious = function () {
			var iCurrentPage = this._oModel.getProperty("/previewPageNumber");
			this._oModel.setProperty("/previewPageNumber", iCurrentPage - 1);

			this._updatePageNumberButtons();
			this._updateDialogPreviewCanvas();
		};

		GanttPrinting.prototype._onPressButtonNext = function () {
			var iCurrentPage = this._oModel.getProperty("/previewPageNumber");
			this._oModel.setProperty("/previewPageNumber", iCurrentPage + 1);

			this._updatePageNumberButtons();
			this._updateDialogPreviewCanvas();
		};

		GanttPrinting.prototype._onPressButtonLast = function () {
			var iLastPage = this._oModel.getProperty("/lastPageNumber");
			if (!iLastPage) {
				return;
			}
			this._oModel.setProperty("/previewPageNumber", iLastPage);

			this._updatePageNumberButtons();
			this._updateDialogPreviewCanvas();
		};

		GanttPrinting.prototype._getOriginalGanttChart = function () {
			return Element.getElementById(this.getAssociation("ganttChart"));
		};

		/**
		 * Returns cloned gantt div width
		 * @private
		 */
		GanttPrinting.prototype._getGanttCloneDivWidth = function (oTotalHorizon) {
			var oOriginalGanttChart = this._getOriginalGanttChart(),
				oTotalHorizonDates = this._getHorizonDates(oTotalHorizon),
				iTotalHorizonInSec = this._horizonWidthInSec(oTotalHorizonDates),
				iTotalHorizonInPx = Math.ceil(this._fPixelsBySec * iTotalHorizonInSec);

			var iTableAreaWidthInPx = oOriginalGanttChart.getDisplayType() === GanttChartWithTableDisplayType.Both ?
				oOriginalGanttChart.getTable().getDomRef().offsetWidth : 0;
			// add a magic constant which should cover splitbar, scrollbar, etc.
			return (iTableAreaWidthInPx + iTotalHorizonInPx + 10);
		};

		GanttPrinting.prototype._setGanttCloneDivWidth = function (oTotalHorizon) {
			this._oClonedGanttDiv.style.width = this._getGanttCloneDivWidth(oTotalHorizon).toString() + "px";
		};

		GanttPrinting.prototype._setGanttCloneDivHeight = function () {
			this._oClonedGanttDiv.style.height =  this._getGanttCloneDivHeight().toString() + "px";
		};

		/**
		 * Returns cloned gantt div height
		 * @private
		 */
		GanttPrinting.prototype._getGanttCloneDivHeight = function () {
			var oTable = this._getOriginalGanttChart().getTable();

			var iRowCount = oTable._getTotalRowCount(),
				aRenderedRowHeight = oTable._aRowHeights;

			var fSumOfRowHeights = aRenderedRowHeight.reduce(function (fTotal, fRowHeigh) {
				return fTotal + fRowHeigh;
			});

			// TODO improve calculation of Gantt chart height
			// estimate gantt chart height based on average height of rendered rows
			var iGanttHeight = Math.ceil((fSumOfRowHeights / aRenderedRowHeight.length) * iRowCount);

			// add a magic constant which should cover head, scrollbar, etc.
			this._iGanttHeight = iGanttHeight + 102;
			return this._iGanttHeight;
		};

		/**
		 * Recalculate cloned div height after the rows are rendered
		 */
		GanttPrinting.prototype._setCloneDivHeight = function () {
			var iCloneHeaderHeight = this.bFirst ? document.getElementById(this._ganttChartClone.getId() + "-header-svg").height.baseVal.value : 0;
			var iVisibleRowCount = this._ganttChartClone.getTable().getRowMode().getRowCount();
			var sum = 0;
			var iBuffer = this.bLast ? 3 : 0;
			var iFirstRowIndex = this._ganttChartClone.getTable().getRows()[0].getIndex();
			var iFirstVisibleRow = this._ganttChartClone.getTable().getFirstVisibleRow();
			var iIndex = Math.abs(iFirstRowIndex - iFirstVisibleRow);
			var aRenderedCloneRowHeight = this._ganttChartClone.getTable()._aRowHeights;
			for (var i = iIndex; i < iVisibleRowCount + iIndex; i++) {
				sum = sum + aRenderedCloneRowHeight[i];
			}
			this._iContentHeight = sum + "px";
			this._oClonedGanttDiv.style.height = (sum + iCloneHeaderHeight + iBuffer).toString() + "px";
		};

		/**
		 * Recalculate cloned div height after the rows are rendered for non-optimised approach
		 */
		GanttPrinting.prototype._setCloneDivHeightNonOptimised = function () {
			var iCloneHeaderHeight = document.getElementById(this._ganttChartClone.getId() + "-header-svg").height.baseVal.value;
			var iTotalRowCount = this._ganttChartClone.getTable()._getTotalRowCount();
			var sum = 1;
			var aRenderedCloneRowHeight = this._ganttChartClone.getTable()._aRowHeights;
			for (var i = 0; i < iTotalRowCount; i++) {
				var iRowHeight = aRenderedCloneRowHeight[i] ? aRenderedCloneRowHeight[i] : 0;
				sum = sum + iRowHeight;
			}
			this._iContentHeight = sum.toString() + "px";
			this._oClonedGanttDiv.style.height = (sum + iCloneHeaderHeight).toString() + "px";
		};

		GanttPrinting.prototype._createImgElementsFromSvgImages = function () {
			var $SvgContent = this._ganttChartClone.$().find("svg.sapGanttChartSvg");
			if (!$SvgContent.length) {
				return;
			}

			var oGanttContentBody = this._ganttChartClone.$().find(".sapGanttChartCnt")[0];
			if (!oGanttContentBody) {
				return;
			}
			oGanttContentBody.style.position = "relative";

			var $SvgImages = $SvgContent.find("image");
			for (var i = 0; i < $SvgImages.length; i++) {
				var oSvgImage = $SvgImages[i];

				var oImg = document.createElement("img");
				oImg.src = oSvgImage.getAttribute("href");
				oImg.style.position = "absolute";
				oImg.style.top = oSvgImage.getAttribute("y") + "px";
				oImg.style.left = oSvgImage.getAttribute("x") + "px";
				oImg.style.width = oSvgImage.getAttribute("width") + "px";
				oImg.style.height = oSvgImage.getAttribute("height") + "px";

				oGanttContentBody.appendChild(oImg);
			}
		};

		GanttPrinting.prototype._createGanttCanvas = function () {
			if (this._bCancel) {
				return Promise.reject();
			}
			// set svg style directly to the dom
			this._setStyleToGanttChartSvg(this._ganttChartClone);
			this._createImgElementsFromSvgImages();

			return html2canvas(this._oClonedGanttDiv, {
				allowTaint: true,
				scale: this.canvasScale,
				logging: false
			});
		};

		GanttPrinting.prototype._createBatchList = function () {
			if (this._bCancel) {
				return Promise.reject();
			}
			// set svg style directly to the dom
			this._setStyleToGanttChartSvg(this._ganttChartClone);
			this._oDomToPrintHeight += Number(this._oClonedGanttDiv.style.height.slice(0,-2));
			this._oDomToPrintWidth = Number(this._oClonedGanttDiv.style.width.slice(0,-2));
			// this._oDomToPrint.push(this._oClonedGanttDiv.cloneNode(true));
			return this._oClonedGanttDiv.cloneNode(true);
		};

		GanttPrinting.prototype._updateGanttPdf = function () {
			if (this._initialDisplayType === GanttChartWithTableDisplayType.Table) {
				return;
			}
			var oModel = this._oModel;
			// set new horizons values
			var oTimeStrategy = this._ganttChartClone.getAxisTimeStrategy();
			var oNewVisibleHorizon = oTimeStrategy.getVisibleHorizon().clone();
			var oNewTotalHorizon = oTimeStrategy.getTotalHorizon().clone();

			oNewVisibleHorizon.setStartTime(oModel.getProperty("/startDate"));
			oNewVisibleHorizon.setEndTime(oModel.getProperty("/endDate"));
			oNewTotalHorizon.setStartTime(oModel.getProperty("/startDate"));
			oNewTotalHorizon.setEndTime(oModel.getProperty("/endDate"));

			this._bCancel = false;
			this._oDomToPrint = [];
			this._oDomToPrintHeight = 0;
			this._oDomToPrintWidth = 0;

			if (!this._bMultipleBatches) {
				this._oFlexBoxPreview.setBusy(true);
				this._oButtonExport.setEnabled(false);
				if (this._oButtonSave){
					this._oButtonSave.setEnabled(false);
				}
			}

			var clonedGanttDivCreated;
			if (!this._oClonedGanttDiv.id){
				this._oClonedGanttDiv.id = "clonedGanttDiv";
				clonedGanttDivCreated = true;
				if (this._getOriginalGanttChart().$().closest(".sapUiSizeCompact").length > 0) {
					this._oClonedGanttDiv.classList.add("sapUiSizeCompact");
				}
				this._oClonedGanttDiv.style.position = "absolute";

				this._oClonedGanttDiv.style.top = "-17000px";
				this._oClonedGanttDiv.style.left = "-17000px";

				//ganttChartContainer is not used when optimization is enabled.
				if (this._ganttChartClone._enableOptimisation) {
					this._ganttChartClone.placeAt("clonedGanttDiv");
				} else {
					this._ganttChartContainer.placeAt("clonedGanttDiv");
				}
				this._updateDialogErrorPDFPreview(false);
			}
			if (clonedGanttDivCreated){
				clonedGanttDivCreated = false;
				//Checks if the binding is present for the table, and if they are not, the bindings are reset.
				this._addBackOriginalGanttRowBinding(this._ganttChartClone, this._getOriginalGanttChart());
			}
			this._setGanttCloneDivWidth(oNewTotalHorizon);
			this._setGanttCloneDivHeight();

			oTimeStrategy.setTotalHorizon(oNewTotalHorizon);
			oTimeStrategy.setVisibleHorizon(oNewVisibleHorizon);

			if (!this._ganttChartClone._enableOptimisation) {
				this._ganttChartClone.invalidate();
			}
			this._ganttChartClone._bRenderGanttClone = true;

			var oGanttChart = this._getOriginalGanttChart();
			var iZoomLevel = Math.max((oGanttChart.getAxisTimeStrategy().getZoomLevel()), 1);
			this.iThreshold = Math.min(Math.round(oGanttChart.getPrintingBatchSize() / iZoomLevel), oGanttChart.getTable()._getTotalRowCount());
			this._ganttChartClone.setShowGanttHeader(true);
			if (this._bMultipleBatches) {
				this._openProgressDialog();
			}
			this._ganttChartClone._bRenderGanttClone = false;
			return this.generatePdfAsync(0);
		};

		GanttPrinting.prototype._updateGanttCanvas = function () {
			if (this._initialDisplayType === GanttChartWithTableDisplayType.Table) {
				return;
			}
			var oModel = this._oModel;

			// set new horizons values
			var oTimeStrategy = this._ganttChartClone.getAxisTimeStrategy();
			var oNewVisibleHorizon = oTimeStrategy.getVisibleHorizon().clone();
			var oNewTotalHorizon = oTimeStrategy.getTotalHorizon().clone();
			oNewVisibleHorizon.setStartTime(oModel.getProperty("/startDate"));
			oNewVisibleHorizon.setEndTime(oModel.getProperty("/endDate"));
			oNewTotalHorizon.setStartTime(oModel.getProperty("/startDate"));
			oNewTotalHorizon.setEndTime(oModel.getProperty("/endDate"));
			var height = this._getGanttCloneDivHeight();
			var width  = this._getGanttCloneDivWidth(oNewTotalHorizon);
			if ((width * this.canvasScale) > MAXCANVASSIZE || (height * this.canvasScale) > MAXCANVASSIZE) {
				this._oClonedGanttDiv.error = true;
				this._oGanttCanvas = undefined;
				this._updateDialogPreviewCanvas();
				this._oFlexBoxPreview.setBusy(false);
				return undefined;
			}
			this._bUpdateGanttCanvas = true;
			this._bCancel = false;

			if (!this._bMultipleBatches) {
				this._oFlexBoxPreview.setBusy(true);
				this._oButtonExport.setEnabled(false);
				if (this._oButtonSave){
					this._oButtonSave.setEnabled(false);
				}
			}

			var clonedGanttDivCreated;
			if (!this._oClonedGanttDiv.id){
				this._oClonedGanttDiv.id = "clonedGanttDiv";
				clonedGanttDivCreated = true;
				if (this._getOriginalGanttChart().$().closest(".sapUiSizeCompact").length > 0) {
					this._oClonedGanttDiv.classList.add("sapUiSizeCompact");
				}
				this._oClonedGanttDiv.style.position = "absolute";

				this._oClonedGanttDiv.style.top = "-17000px";
				this._oClonedGanttDiv.style.left = "-17000px";

				// not using ganttChartContainer when optimisation is enabled
				if (this._ganttChartClone._enableOptimisation) {
					this._ganttChartClone.placeAt("clonedGanttDiv");
				} else {
					this._ganttChartContainer.placeAt("clonedGanttDiv");
				}

			}
			this._setGanttCloneDivWidth(oNewTotalHorizon);
			this._setGanttCloneDivHeight();
			if (clonedGanttDivCreated){
				clonedGanttDivCreated = false;
				//Check if the binding is present for the table is not reset the bindings back.
				this._addBackOriginalGanttRowBinding(this._ganttChartClone, this._getOriginalGanttChart());
			}
			oTimeStrategy.setTotalHorizon(oNewTotalHorizon);
			oTimeStrategy.setVisibleHorizon(oNewVisibleHorizon);

			if (!this._ganttChartClone._enableOptimisation) {
				this._ganttChartClone.invalidate();
			}
			this._ganttChartClone._bRenderGanttClone = true;

			if (this._ganttChartClone._enableOptimisation) {
				var oGanttChart = this._getOriginalGanttChart();
				var iZoomLevel = Math.max((oGanttChart.getAxisTimeStrategy().getZoomLevel()), 1);
				this.iThreshold = Math.min(Math.round(oGanttChart.getPrintingBatchSize() / iZoomLevel), oGanttChart.getTable()._getTotalRowCount());
				this._ganttChartClone.setShowGanttHeader(true);
				if (this._bMultipleBatches) {
					this._openProgressDialog();
				}
				this._ganttChartClone._bRenderGanttClone = false;
				return this.generateCanvasAsync(0);
			} else {
				this._oClonedGanttDiv.style.height = (this._iGanttHeight * 2) + "px";
				return this._ganttChartClone.getInnerGantt().resolveWhenReady(this._originalHasRenderedShapes).then(function () {
					this._ganttChartClone._bRenderGanttClone = false;
					return this.renderGanttClone().then(function () {
						this._setCloneDivHeightNonOptimised();
						document.getElementById(this._ganttChartClone.getId() + "-sapGanttBackgroundTableContent").style.height = this._iContentHeight;
						document.getElementById(this._ganttChartClone.getTable().getId() + "-tableCCnt").style.height = this._iContentHeight;
						this._createGanttCanvas().then(function (oUpdatedCanvas) {
							this._oGanttCanvas = oUpdatedCanvas;
							this._updateDialogPreview();
							this._oFlexBoxPreview.setBusy(false);
						}.bind(this)).catch(function () {
							this._oFlexBoxPreview.setBusy(false);
						}.bind(this));
					}.bind(this));
				}.bind(this)).catch(function () {
					this._oFlexBoxPreview.setBusy(false);
				}.bind(this));
			}
		};

		GanttPrinting.prototype._drawClonedGantt = function (bPdfPrint) {
			if (this._oClonedGanttDiv) {
				return Promise.reject();
			}
			// create div simulating Paper sizes
			this._oClonedGanttDiv = document.createElement("div");
			document.body.appendChild(this._oClonedGanttDiv);
			var height = this._getGanttCloneDivHeight();
			var width  = this._getGanttCloneDivWidth(this._ganttChartClone.getAxisTimeStrategy().getTotalHorizon());
			if (!bPdfPrint && ((width * this.canvasScale) > MAXCANVASSIZE || (height * this.canvasScale) > MAXCANVASSIZE)) {
				this._oClonedGanttDiv.error = true;
				return Promise.reject({bMaxCanvasSizeExceeded: true});
			}
			if (!this._validateDurationInput()) {
				this._oClonedGanttDiv.dateError = true;
				return Promise.reject({dateDurationNotSet: true});
			}
			this._oClonedGanttDiv.id = "clonedGanttDiv";
			if (this._getOriginalGanttChart().$().closest(".sapUiSizeCompact").length > 0) {
				this._oClonedGanttDiv.classList.add("sapUiSizeCompact");
			}
			this._oClonedGanttDiv.style.position = "absolute";

			this._oClonedGanttDiv.style.top = "-17000px";
			this._oClonedGanttDiv.style.left = "-17000px";
			// FOR TESTING
			// this._oClonedGanttDiv.style.top = "0px";
			// this._oClonedGanttDiv.style.left = "0px";
			// this._oClonedGanttDiv.style.zIndex = "100";


			this._setGanttCloneDivWidth(this._ganttChartClone.getAxisTimeStrategy().getTotalHorizon());
			this._setGanttCloneDivHeight();

			var oModel = this._oModel;
			var oTimeStrategy = this._ganttChartClone.getAxisTimeStrategy();
			oTimeStrategy.getVisibleHorizon().setStartTime(oModel.getProperty("/startDate"));
			oTimeStrategy.getVisibleHorizon().setEndTime(oModel.getProperty("/endDate"));

			// not using ganttChartContainer when optimisation is enabled
			if (this._ganttChartClone._enableOptimisation) {
				this._ganttChartClone.placeAt("clonedGanttDiv");
			} else {
				this._ganttChartContainer.placeAt("clonedGanttDiv");
			}
			//Check if the binding is present for the table is not reset the bindings back.
			this._addBackOriginalGanttRowBinding(this._ganttChartClone, this._getOriginalGanttChart());
			// rendering done by generateCanvasAsync function in case of optimised printing
			if (this._ganttChartClone._enableOptimisation) {
				return Promise.resolve();
			} else {
				this._oClonedGanttDiv.style.height = (this._iGanttHeight * 2) + "px";
				return this._ganttChartClone.getInnerGantt().resolveWhenReady(this._originalHasRenderedShapes);
			}
		};
		GanttPrinting.prototype._addBackOriginalGanttRowBinding = function (oClonedGantt, oOriginalGantt) {
			var oTable = oClonedGantt.getTable();
			if (oTable.getBindingInfo("rows").binding == null) {
				//binding is added
				oClonedGantt.oPropagatedProperties = oOriginalGantt._getPropertiesToPropagate();
				oClonedGantt.propagateProperties(true);
			}
			if (oClonedGantt.getEnablePseudoShapes()){
				var oClonedGanttRowSettingsTemp = oTable.getRowSettingsTemplate();
				var oOriginalGanttRowSettingsTemp = oOriginalGantt.getTable().getRowSettingsTemplate();
				if (oClonedGanttRowSettingsTemp && oOriginalGanttRowSettingsTemp.getBindingInfo("tasks") && !oClonedGanttRowSettingsTemp.getBindingInfo("tasks")){
					var oClone = GanttRowSettings.prototype.clone.call(oOriginalGanttRowSettingsTemp);
					oClonedGanttRowSettingsTemp.bindAggregation("tasks", oClone.getBindingInfo("tasks"));
				}
			}
			if (this._ganttChartClone._enableOptimisation) {
				if (this._getOriginalGanttChart._bExpandToggled) {
					oTable.setRowMode(new FixedRowMode({
						rowCount: this.iThreshold
					}));
				} else {
					var oCloneTable = this._ganttChartClone.getTable();
					var oRowMode = oCloneTable.getRowMode(), nRowHeight = 0;
					if (oRowMode && oRowMode.getRowContentHeight()) {
						nRowHeight = oRowMode.getRowContentHeight();
					} else {
						/**
						 * @deprecated As of version 1.119
						 */
						nRowHeight = oCloneTable.getRowHeight();
					}
					oTable.setRowMode(new FixedRowMode({
						rowCount: this.iThreshold,
						rowContentHeight: nRowHeight ? nRowHeight : Math.ceil(this._getOriginalGanttChart().getTableRowHeights()[0])
					}));
				}
				oTable.setThreshold(this.iThreshold);
			}
			var oOriginalRowBinding = oOriginalGantt.getTable().getBinding("rows"),
				oClonedRowBinding = oTable.getBinding("rows");
			if (oOriginalRowBinding) {
				if (oOriginalRowBinding.sCustomParams) {
					oClonedRowBinding.sCustomParams = oOriginalRowBinding.sCustomParams;
				}
				if (oOriginalRowBinding.aFilters && oOriginalRowBinding.aFilters.length > 0) {
					oClonedRowBinding.filter(oOriginalRowBinding.aFilters);
				}
				if (oOriginalRowBinding.aApplicationFilters && oOriginalRowBinding.aApplicationFilters.length > 0) {
					oClonedRowBinding.filter(oOriginalRowBinding.aApplicationFilters, FilterType.Application);
				}
				if (oOriginalRowBinding.aSorters && oOriginalRowBinding.aSorters.length > 0) {
					oClonedRowBinding.sort(oOriginalRowBinding.aSorters);
				}
			}
		};
		GanttPrinting.prototype._resizePrintingPreviewPage = function () {
			var $dialogPreviewContentDiv = this._oHTMLDialogPreview.getDomRef(),
				$dialogPreviewDiv = this._oHTMLDialogPreview.$().find(".sapGanttPrintingPreviewPageDiv")[0],
				fPreviewHeight = $dialogPreviewContentDiv.offsetHeight,
				fPaperHeight = this._oModel.getProperty("/paperHeight"),
				fPaperWidth = this._oModel.getProperty("/paperWidth"),
				bPortrait = this._oModel.getProperty("/portrait"),
				fRatio,
				fPreviewWidth;


			if (bPortrait) {
				fRatio = fPreviewHeight / fPaperHeight;
				fPreviewWidth = fPaperWidth * fRatio;
			} else {
				fRatio = fPreviewHeight / fPaperWidth;
				fPreviewWidth = fPreviewHeight;
				fPreviewHeight = fPaperHeight * fRatio;
			}

			$dialogPreviewDiv.style.width = fPreviewWidth.toString() + "px";
			$dialogPreviewDiv.style.height = fPreviewHeight.toString() + "px";
		};

		GanttPrinting.prototype._updateSinglePageMessages = function (fPaperCntWidth, fPaperCntHeight) {
			if (fPaperCntHeight > fPaperCntWidth) {
				this._oModel.setProperty("/orientationMessage", this._oRb.getText("GNT_PRNTG_SINGLE_PAGE_PORTRAIT"));
			} else {
				this._oModel.setProperty("/orientationMessage", this._oRb.getText("GNT_PRNTG_SINGLE_PAGE_LANDSCAPE"));
			}
			if (this._getPagesInARow() > 3 || this._getPagesInAColumn() > 3) {
				this._oModel.setProperty("/qualityWarning", true);
			} else {
				this._oModel.setProperty("/qualityWarning", false);
			}
			if ((fPaperCntHeight >= fPaperCntWidth && this._oModel.getProperty("/portrait")) || (fPaperCntHeight <= fPaperCntWidth && !this._oModel.getProperty("/portrait"))) {
				this._oModel.setProperty("/showOrientationMessage", false);
			} else {
				this._oModel.setProperty("/showOrientationMessage", true);
			}
		};


		GanttPrinting.prototype._getCanvasOfPageN = function (iPageNumber, bForExport) {
			var iLastPage = this._oModel.getProperty("/lastPageNumber");
			if (iPageNumber > iLastPage) {
				return null;
			}

			var oCanvas = document.createElement("canvas");
			var oCanvasContext = oCanvas.getContext("2d");
			oCanvasContext.imageSmoothingEnabled = false;

			var fCroppingWidth = this._getCroppingWidth(),
				fCroppingHeight = this._getCroppingHeight();

			var iPagesInARow = this._getPagesInARow();

			var fPaperWidth = this._oModel.getProperty("/paperWidth"),
				fPaperHeight = this._oModel.getProperty("/paperHeight");

			var fMarginTop = this._oModel.getProperty("/marginTop"),
				fMarginBottom = this._oModel.getProperty("/marginBottom"),
				fMarginLeft = this._oModel.getProperty("/marginLeft");

			var iColumn = (iPageNumber - 1) % iPagesInARow,
				iRow = Math.floor((iPageNumber - 1) / iPagesInARow);

			oCanvas.width = fPaperWidth;
			oCanvas.height = fPaperHeight;
			if (!bForExport) {
				oCanvas.style.height = "100%";
				oCanvas.style.width = "auto";
			}

			// set white background
			oCanvasContext.fillStyle = "white";
			oCanvasContext.fillRect(0, 0, oCanvas.width, oCanvas.height);

			oCanvasContext.fillStyle = Parameters.get("sapUiBaseText");
			oCanvasContext.textBaseline = "middle";
			oCanvasContext.font = TEXTFONT;
			var fXTextPosition;

			var bRTL = GanttChartConfigurationUtils.getRTL();
			if (bRTL) {
				oCanvasContext.textAlign = "right";
				fXTextPosition = fPaperWidth - PrintUtils._mmToPx(4);
				/* text padding */
			} else {
				oCanvasContext.textAlign = "left";
				fXTextPosition = PrintUtils._mmToPx(4);
				/* text padding */
			}

			var fEllipseWidth = oCanvasContext.measureText("...").width;
			var fTargetWidth = fPaperWidth - PrintUtils._mmToPx(4) - fEllipseWidth;

			var sHeaderText, sFooterText, iTruncatedChars, truncatePointRTL;
			// add header
			if (this._oModel.getProperty("/showHeaderText")) {

				sHeaderText = this._oModel.getProperty("/headerText");

				var fHeaderTextWidth = oCanvasContext.measureText(sHeaderText).width;

				if (fHeaderTextWidth > (fPaperWidth - PrintUtils._mmToPx(4))){
					iTruncatedChars = GanttUtils.geNumberOfTruncatedCharacters(fHeaderTextWidth, fTargetWidth, sHeaderText, oCanvasContext, oCanvasContext.measureText, true);

					if (bRTL) {
						truncatePointRTL = sHeaderText.length - iTruncatedChars;
						sHeaderText = "..." + sHeaderText.slice(truncatePointRTL, sHeaderText.length).trim();
					} else {
						sHeaderText = sHeaderText.slice(0, iTruncatedChars).trim() + "...";
					}
				}
				oCanvasContext.fillText(sHeaderText,
					fXTextPosition, (this._iHeaderAndFooterHeight / 2));
			}

			// add footer
			if (this._oModel.getProperty("/showFooterText")) {
				sFooterText = this._oModel.getProperty("/footerText");

				var fFooterTextWidth = oCanvasContext.measureText(sFooterText).width;

				if (fFooterTextWidth > (fPaperWidth - PrintUtils._mmToPx(4))){
					iTruncatedChars = GanttUtils.geNumberOfTruncatedCharacters(fFooterTextWidth, fTargetWidth, sFooterText, oCanvasContext, oCanvasContext.measureText, true);

					if (bRTL) {
						truncatePointRTL = sFooterText.length - iTruncatedChars;
						sFooterText = "..." + sFooterText.slice(truncatePointRTL, sFooterText.length).trim();
					} else {
						sFooterText = sFooterText.slice(0, iTruncatedChars).trim() + "...";
					}
				}

				oCanvasContext.fillText(sFooterText,
					fXTextPosition, fPaperHeight - (this._iHeaderAndFooterHeight / 2) -
					(this._isFooterMultiline() ? this._iHeaderAndFooterHeight : 0));
			}

			this._mHeaderFooterInfo = {
				headerText: sHeaderText,
				footerText: sFooterText,
				position: fXTextPosition
			};

			// add page number
			var bShowPageNumber = this._oModel.getProperty("/showPageNumber"),
				bMultiplePage = this._oModel.getProperty("/multiplePage"),
				fScale;

			if (bMultiplePage && bShowPageNumber) {
				oCanvasContext.font = PAGENUMBERFONT;
				oCanvasContext.textAlign = "center";
				oCanvasContext.fillText(iPageNumber.toString(),
					fPaperWidth / 2, fPaperHeight - fMarginBottom - (this._iHeaderAndFooterHeight / 2));
			}

			// multiple page mode
			if (bMultiplePage) {
				var fSourceX = iColumn * fCroppingWidth,
					fSourceY = iRow * fCroppingHeight,
					fLastPageContentHeight = 0,
					fLastPageContentWidth = 0;

				// the last horizontal images from the canvas
				var bLastHorizontalPage = false;
				if ((fSourceX + fCroppingWidth) > this._oGanttCanvas.width) {
					bLastHorizontalPage = true;

					fCroppingWidth = (this._oGanttCanvas.width - fSourceX);
					fLastPageContentWidth = fCroppingWidth / this._getScale();
				}

				// the last vertical images from the canvas
				var bLastVerticalPage = false;
				if ((fSourceY + fCroppingHeight) > this._oGanttCanvas.height) {
					bLastVerticalPage = true;

					fCroppingHeight = (this._oGanttCanvas.height - fSourceY);
					fLastPageContentHeight = fCroppingHeight / this._getScale();
				}

				fScale = (bLastHorizontalPage ? fLastPageContentWidth : this._getPaperContentWidth()) / fCroppingWidth;
				if (fScale < 0.5 && bForExport) {
					var oSingleCanvas = document.createElement('canvas');
					oSingleCanvas.width = fCroppingWidth;
					oSingleCanvas.height = fCroppingHeight;
					var oSingleCanvasContext = oSingleCanvas.getContext('2d');
					oSingleCanvasContext.drawImage(this._oGanttCanvas, fSourceX, fSourceY, fCroppingWidth, fCroppingHeight, 0, 0, fCroppingWidth, fCroppingHeight);
					this._downScaleCanvas(oSingleCanvas, oCanvasContext, fScale, 0, 0, oSingleCanvas.width, oSingleCanvas.height, fMarginLeft, fMarginTop + this._getHeaderHeight());
				} else {
					oCanvasContext.drawImage(this._oGanttCanvas,
						fSourceX, /* source x */
						fSourceY, /* source y */
						fCroppingWidth, /* source image width */
						fCroppingHeight, /* source image height */
						fMarginLeft, /* destination x */
						fMarginTop + this._getHeaderHeight(), /* destination y */
						bLastHorizontalPage ? fLastPageContentWidth : this._getPaperContentWidth(),
						bLastVerticalPage ? fLastPageContentHeight : this._getPaperContentHeight()
					);
				}
			} else { // single page mode
				var fPaperCntWidth = this._getPaperContentWidth(),
					fPaperCntHeight = this._getPaperContentHeight();

				var bShrinkByWidth = this._isShrinkableToOnePageByWidth();

				var fRatio;
				if (bShrinkByWidth) {
					fRatio = fPaperCntWidth / this._oGanttCanvas.width;
					fPaperCntHeight = this._oGanttCanvas.height * fRatio;
				} else {
					fRatio = fPaperCntHeight / this._oGanttCanvas.height;
					fPaperCntWidth = this._oGanttCanvas.width * fRatio;
				}
				this._updateSinglePageMessages(fPaperCntWidth, fPaperCntHeight);
				fScale = fPaperCntWidth / this._oGanttCanvas.width;
				if (fScale < 1 && bForExport) {
					this._downScaleCanvas(this._oGanttCanvas, oCanvasContext, fScale, 0, 0, this._oGanttCanvas.width, this._oGanttCanvas.height, fMarginLeft, fMarginTop + this._getHeaderHeight());
				} else {
					oCanvasContext.drawImage(this._oGanttCanvas,
						0, /* source x */
						0, /* source y */
						this._oGanttCanvas.width, /* source image width */
						this._oGanttCanvas.height, /* source image height */
						fMarginLeft, /* destination x */
						fMarginTop + this._getHeaderHeight(), /* destination y */
						fPaperCntWidth,
						fPaperCntHeight
					);
				}
			}

			return oCanvas;
		};

		GanttPrinting.prototype._getFXTextPosition = function () {
			var fXTextPosition;
			var fPaperWidth = this._oModel.getProperty("/paperWidth");

			var bRTL = GanttChartConfigurationUtils.getRTL();
			if (bRTL) {
				fXTextPosition = fPaperWidth - PrintUtils._mmToPx(4);
				/* text padding */
			} else {
				fXTextPosition = PrintUtils._mmToPx(4);
				/* text padding */
			}

			return fXTextPosition / (bRTL ? Math.trunc(JSPDFCONSTANT * 10) / 10 : JSPDFCONSTANT);
		};

		/**
		 * Downscale the canvas by scale < 1
		 *
		 * @param {object} oSourceCanvas Canvas to be downscaled
		 * @param {object} oCanvasContext Context of the canvas on which the downscaled canvas will be drawn
		 * @param {float} fScale Scale by which canvas will be downscaled
		 * @param {float} fSourceX Source canvas X coordinate
		 * @param {float} fSourceY Source canvas Y coordinate
		 * @param {float} fSourceWidth Source canvas width
		 * @param {float} fSourceHeight Source canvas height
		 * @param {float} fDestX Target canvas X coordinate
		 * @param {float} fDestY Target canvas Y coordinate
		 * @private
		 */
		GanttPrinting.prototype._downScaleCanvas = function (oSourceCanvas, oCanvasContext, fScale, fSourceX, fSourceY, fSourceWidth, fSourceHeight, fDestX, fDestY) {
			var oCanvasCopy = document.createElement('canvas');
			oCanvasCopy.width = fSourceWidth;
			oCanvasCopy.height = fSourceHeight;
			var oCanvasCopyContext = oCanvasCopy.getContext('2d');
			oCanvasCopyContext.drawImage(oSourceCanvas, fSourceX, fSourceY, fSourceWidth, fSourceHeight, 0, 0, fSourceWidth, fSourceHeight);

			var fScaleSquare = fScale * fScale;
			var fTargetWidth = Math.floor(fSourceWidth * fScale); // target canvas width
			var fTargetHeight = Math.floor(fSourceHeight * fScale); // target canvas height
			var iSourceX = 0, iSourceY = 0, iSourceIndex = 0;
			var iTargetX = 0, iTargetY = 0, yIndex = 0, iTargetIndex = 0;
			var iRoundedTargetX = 0, iRoundedTargetY = 0;

			var fWeight = 0, fWeightX = 0, fWeightY = 0; // weight of current source point in current target's point
			var fNextWeight = 0, fNextWeightX = 0, fNextWeightY = 0; // weight of current source point in next target's point
			var bCrossX = false, bCrossY = false; // check if scaled pixel cross the current pixel's right/bottom border respectively
			var aSourceBuffer = oCanvasCopy.getContext('2d').getImageData(0, 0, fSourceWidth, fSourceHeight).data;
			var aTargetBuffer = new Float32Array(3 * fTargetWidth * fTargetHeight);
			var fSourceR = 0, fSourceG = 0,  fSourceB = 0; // source's current point's r,g,b

			for (iSourceY = 0; iSourceY < fSourceHeight; iSourceY++) {
				iTargetY = iSourceY * fScale;
				iRoundedTargetY = 0 | iTargetY;
				yIndex = 3 * iRoundedTargetY * fTargetWidth;  // line index within target array
				bCrossY = (iRoundedTargetY !== (0 | ( iTargetY + fScale )));
				if (bCrossY) { // if pixel crosses target pixel's bottom border
					fWeightY = (iRoundedTargetY + 1 - iTargetY);
					fNextWeightY = (iTargetY + fScale - iRoundedTargetY - 1);
				}
				for (iSourceX = 0; iSourceX < fSourceWidth; iSourceX++, iSourceIndex += 4) {
					iTargetX = iSourceX * fScale;
					iRoundedTargetX = 0 | iTargetX;
					iTargetIndex = yIndex + iRoundedTargetX * 3; // target pixel index within target array
					bCrossX = (iRoundedTargetX !== (0 | (iTargetX + fScale)));
					if (bCrossX) { // if pixel crosses target pixel's right border
						fWeightX = (iRoundedTargetX + 1 - iTargetX);
						fNextWeightX = (iTargetX + fScale - iRoundedTargetX - 1);
					}
					fSourceR = aSourceBuffer[iSourceIndex];
					fSourceG = aSourceBuffer[iSourceIndex + 1];
					fSourceB = aSourceBuffer[iSourceIndex + 2];
					if (!bCrossX && !bCrossY) { // if pixel does not cross any border
						aTargetBuffer[iTargetIndex] += fSourceR * fScaleSquare;
						aTargetBuffer[iTargetIndex + 1] += fSourceG * fScaleSquare;
						aTargetBuffer[iTargetIndex + 2] += fSourceB * fScaleSquare;
					} else if (!bCrossX && bCrossY) { // if pixel crosses bottom border
						fWeight = fWeightY * fScale;
						aTargetBuffer[iTargetIndex] += fSourceR * fWeight;
						aTargetBuffer[iTargetIndex + 1] += fSourceG * fWeight;
						aTargetBuffer[iTargetIndex + 2] += fSourceB * fWeight;

						fNextWeight = fNextWeightY * fScale;
						aTargetBuffer[iTargetIndex + 3 * fTargetWidth] += fSourceR * fNextWeight;
						aTargetBuffer[iTargetIndex + 3 * fTargetWidth + 1] += fSourceG * fNextWeight;
						aTargetBuffer[iTargetIndex + 3 * fTargetWidth + 2] += fSourceB * fNextWeight;
					} else if (bCrossX && !bCrossY) { // if pixel crosses right border
						fWeight = fWeightX * fScale;
						aTargetBuffer[iTargetIndex] += fSourceR * fWeight;
						aTargetBuffer[iTargetIndex + 1] += fSourceG * fWeight;
						aTargetBuffer[iTargetIndex + 2] += fSourceB * fWeight;

						fNextWeight = fNextWeightX * fScale;
						aTargetBuffer[iTargetIndex + 3] += fSourceR * fNextWeight;
						aTargetBuffer[iTargetIndex + 4] += fSourceG * fNextWeight;
						aTargetBuffer[iTargetIndex + 5] += fSourceB * fNextWeight;
					} else { // crosses both borders
						fWeight = fWeightX * fWeightY;
						aTargetBuffer[iTargetIndex] += fSourceR * fWeight;
						aTargetBuffer[iTargetIndex + 1] += fSourceG * fWeight;
						aTargetBuffer[iTargetIndex + 2] += fSourceB * fWeight;
						// for iRoundedTargetX + 1 and iRoundedTargetY pixel
						fNextWeight = fNextWeightX * fWeightY;
						aTargetBuffer[iTargetIndex + 3] += fSourceR * fNextWeight;
						aTargetBuffer[iTargetIndex + 4] += fSourceG * fNextWeight;
						aTargetBuffer[iTargetIndex + 5] += fSourceB * fNextWeight;
						// for iRoundedTargetX and iRoundedTargetY + 1 pixel
						fNextWeight = fWeightX * fNextWeightY;
						aTargetBuffer[iTargetIndex + 3 * fTargetWidth] += fSourceR * fNextWeight;
						aTargetBuffer[iTargetIndex + 3 * fTargetWidth + 1] += fSourceG * fNextWeight;
						aTargetBuffer[iTargetIndex + 3 * fTargetWidth + 2] += fSourceB * fNextWeight;
						// for iRoundedTargetX + 1 and iRoundedTargetY +1 pixel
						fNextWeight = fNextWeightX * fNextWeightY;
						aTargetBuffer[iTargetIndex + 3 * fTargetWidth + 3] += fSourceR * fNextWeight;
						aTargetBuffer[iTargetIndex + 3 * fTargetWidth + 4] += fSourceG * fNextWeight;
						aTargetBuffer[iTargetIndex + 3 * fTargetWidth + 5] += fSourceB * fNextWeight;
					}
				}
			}

			// create result canvas
			var oResultCanvas = document.createElement('canvas');
			oResultCanvas.width = fTargetWidth;
			oResultCanvas.height = fTargetHeight;
			var oResultCanvasContext = oResultCanvas.getContext('2d');
			var aResultImage = oResultCanvasContext.getImageData(0, 0, fTargetWidth, fTargetHeight);
			var aTargetByteBuffer = aResultImage.data;

			// convert target float32 array into a UInt8Clamped Array
			var iPixelIndex = 0;
			for (iSourceIndex = 0, iTargetIndex = 0; iPixelIndex < fTargetWidth * fTargetHeight; iSourceIndex += 3, iTargetIndex += 4, iPixelIndex++) {
				aTargetByteBuffer[iTargetIndex] = 0 | ( aTargetBuffer[iSourceIndex]);
				aTargetByteBuffer[iTargetIndex + 1] = 0 | (aTargetBuffer[iSourceIndex + 1]);
				aTargetByteBuffer[iTargetIndex + 2] = 0 | (aTargetBuffer[iSourceIndex + 2]);
				aTargetByteBuffer[iTargetIndex + 3] = 255;
			}

			// writing result back to the original canvas context
			oCanvasContext.putImageData(aResultImage, fDestX, fDestY);
			return;
		};

		function removeDialogPreviewChilds($dialogPreviewDiv) {
			while ($dialogPreviewDiv.firstChild) {
				$dialogPreviewDiv.removeChild($dialogPreviewDiv.firstChild);
			}
		}

		GanttPrinting.prototype._createPreviewErrorMessageStrip = function (bTooHigh) {
			return new MessageStrip({
				text: this._oRb.getText(bTooHigh ? "GNT_PRNTG_ERROR_TOOHIGHCHART" : "GNT_PRNTG_ERROR_BIGCHART"),
				showIcon: true,
				type: "Error"
			});
		};

		GanttPrinting.prototype._updateDialogPreviewCanvas = function () {
			var oDialogPreviewDiv = this._oHTMLDialogPreview.$().find(".sapGanttPrintingPreviewPageDiv");
			var $dialogPreviewDiv = oDialogPreviewDiv[0];

			if (this._oGanttCanvas) {
				this._oButtonExport.setEnabled(true);
				if (this._oButtonSave){
					this._oButtonSave.setEnabled(true);
				}
				var bMultiplePage = this._oModel.getProperty("/multiplePage");
				if (bMultiplePage) {
					this._oModel.setProperty("/qualityWarning", false);
					this._oModel.setProperty("/showOrientationMessage", false);
				}
				// always return page 1 in single page mode
				var oCanvas = this._getCanvasOfPageN(bMultiplePage ? this._oModel.getProperty("/previewPageNumber") : 1, false);

				removeDialogPreviewChilds($dialogPreviewDiv);
				this._resizePrintingPreviewPage();
				$dialogPreviewDiv.appendChild(oCanvas);
			} else if (!this._oGanttCanvas
				&& (this._oClonedGanttDiv.offsetWidth > MAXCANVASSIZE
					|| this._oClonedGanttDiv.offsetHeight > MAXCANVASSIZE || this._oClonedGanttDiv.error || this._oClonedGanttDiv.dateError)) {

				this._resizePrintingPreviewPage();
				this._oModel.setProperty("/qualityWarning", false);
				this._oModel.setProperty("/showOrientationMessage", false);

				if (!this._oHTMLDialogPreview.$().find("#" + this.getId() + "-previewErrorMessageStrip").length) {
					removeDialogPreviewChilds($dialogPreviewDiv);

					if (!this._oPreviewErrorMessageStrip) {
						if (this._oClonedGanttDiv.error){
							this._oClonedGanttDiv.error = false;
							this._oPreviewErrorMessageStrip = this._createPreviewErrorMessageStrip(
								this._oClonedGanttDiv.offsetHeight > MAXCANVASSIZE);
						} else if (this._oClonedGanttDiv.dateError){
							this._oClonedGanttDiv.dateError = false;
							this._oPreviewErrorMessageStrip = new MessageStrip({
								text: this._oRb.getText("GNT_PRNTG_ERROR_DATEDURATION_PREVIEW"),
								showIcon: true,
								type: "Error"
							});
						}
					}
					var oPreviewErrorDiv = document.createElement("div");
					oPreviewErrorDiv.id = this.getId() + "-previewErrorMessageStrip";
					oPreviewErrorDiv.style.width = "80%";
					$dialogPreviewDiv.appendChild(oPreviewErrorDiv);

					this._oPreviewErrorMessageStrip.placeAt(this.getId() + "-previewErrorMessageStrip");
				}
			} else {
				throw new Error("Gantt chart canvas does not exist.");
			}

			oDialogPreviewDiv.addClass("sapGanttPrintingPreviewPageDivBorder");
		};

		GanttPrinting.prototype._updateDialogPreview = function () {
			this._updateLastPageNumber();
			this._updatePageNumberButtons();

			this._updateDialogPreviewCanvas();
		};

		GanttPrinting.prototype._setStylesToDom = function (oSvg) {

			function explicitlySetStyle(element) {
				if (element.style.fill.indexOf('url("#') === 0) {
                    return;
                }
				var cSSStyleDeclarationComputed = getComputedStyle(element);
				var i, len, key, value;
				var svgExcludedValues = ["height", "width", "min-height", "min-width"];
				var computedStyleStr = "";
				for (i = 0, len = cSSStyleDeclarationComputed.length; i < len; i++) {
					key = cSSStyleDeclarationComputed[i];
					if (!((element instanceof SVGElement) && svgExcludedValues.indexOf(key) >= 0)) {
						value = cSSStyleDeclarationComputed.getPropertyValue(key);
						computedStyleStr += key + ":" + value + ";";
					}
				}
				element.style = computedStyleStr;
			}

			function traverse(obj) {
				explicitlySetStyle(obj);
				visit(obj);

				function visit(node) {
					if (node && node.hasChildNodes()) {
						var child = node.firstChild;
						while (child) {
							if (child.nodeType === 1 && child.nodeName != "SCRIPT") {
								explicitlySetStyle(child);
								visit(child);
							}
							child = child.nextSibling;
						}
					}
				}
			}

			traverse(oSvg);
		};

		GanttPrinting.prototype._setStyleToGanttChartSvg = function (oGanttChart) {
			var $SvgChart = oGanttChart.$().find("svg.sapGanttChartSvg")[0];
			var $SvgChartHeader = oGanttChart.$().find("svg.sapGanttChartHeaderSvg")[0];

			if ($SvgChart) {
				this._setStylesToDom($SvgChart);
			}

			if ($SvgChartHeader) {
				this._setStylesToDom($SvgChartHeader);
			}
		};

		GanttPrinting.prototype._setStyleToGanttChartTable = function (oGanttChart) {
			var $ganttTable = oGanttChart.getElementsByClassName("sapUiTable")[0];
			if ($ganttTable) {
				this._setStylesToDom($ganttTable);
			}
		};

		GanttPrinting.prototype._getHorizonDates = function (oHorizon) {
			var sAbapStartTime = oHorizon.getStartTime();
			var sAbapEndTime = oHorizon.getEndTime();
			return {
				"startTime": new Date(Format.abapTimestampToDate(sAbapStartTime)),
				"endTime": new Date(Format.abapTimestampToDate(sAbapEndTime))
			};
		};

		GanttPrinting.prototype._horizonWidthInSec = function (oVisibleHorizonDates) {
			if (oVisibleHorizonDates && oVisibleHorizonDates.startTime && oVisibleHorizonDates.endTime) {
				return oVisibleHorizonDates.endTime.getTime() - oVisibleHorizonDates.startTime.getTime();
			}

			return 0;
		};

		GanttPrinting.prototype._pageToBeExported = function () {
			// in single page mode export only the first page
			if (!this._oModel.getProperty("/multiplePage")) {
				return [1];
			}
			var iLastPageNumber = this._oModel.getProperty("/lastPageNumber"),
				bExportAll = this._oModel.getProperty("/exportAll"),
				aResultArray = [];

			if (bExportAll || this._bSinglePage) {
				for (var i = 1; i <= iLastPageNumber; i++) {
					aResultArray.push(i);
				}

				return aResultArray;
			} else {
				var sExportRange = this._oModel.getProperty("/exportRange");
				sExportRange = sExportRange.replace(/\s/g, "");

				var oIntFormatter = NumberFormat.getIntegerInstance();

				var aRanges = sExportRange.split(",");
				aRanges.forEach(function (sRange) {

					// range e.g. 2-35
					if (sRange.indexOf("-") !== -1) {
						var aRange = sRange.split("-");
						var iFrom = oIntFormatter.parse(aRange[0]);
						var iTo = oIntFormatter.parse(aRange[1]);

						for (var i = iFrom; i <= iTo; i++) {
							aResultArray.push(i);
						}

					} else {  /* specific page */
						aResultArray.push(oIntFormatter.parse(sRange));
					}

				});

				return aResultArray;
			}
		};

		GanttPrinting.prototype._validateFields = function () {
			var bValidated = true;
			bValidated &= this._validateExportRangeInput();
			bValidated &= this._validateDurationInput();
			bValidated &= (this._oInputMarginTop.getValueState() !== "Error");
			bValidated &= (this._oInputMarginRight.getValueState() !== "Error");
			bValidated &= (this._oInputMarginBottom.getValueState() !== "Error");
			bValidated &= (this._oInputMarginLeft.getValueState() !== "Error");

			return bValidated;
		};

		GanttPrinting.prototype._setStyleToPath = function (oPathDom) {
			var aIncludePathStyles = ["fill", "fillOpacity", "stroke", "strokeWidth", "strokeDasharray", "strokeOpacity", "opacity", "transform"];
			var aStyleValues = [];
			aIncludePathStyles.forEach(function (sStyle){
				aStyleValues.push(oPathDom.style[sStyle]);
			});
			oPathDom.removeAttribute("style");
			aIncludePathStyles.forEach(function (sStyle, iIndex){
				oPathDom.style[sStyle] = aStyleValues[iIndex];
			});
		};

		GanttPrinting.prototype._updatePdfPreview = function (sBlob) {
			if (!this._oPdfPreview) {
				var $pdfPreviewHeight = this._oPdfDialogPreview.getParent().getDomRef().offsetHeight - 100;
				this._oPdfPreview = new PDFViewer({
					source: sBlob,
					width:"94%",
					height: $pdfPreviewHeight.toString() + 'px',
					showDownloadButton: false,
					isTrustedSource: true
				});

				// register blob url as whitelist.
				//if blob url is in the whitelist of UI5,it can be considered as validated.
				$.sap.addUrlWhitelist("blob");
				this._oPdfPreview.placeAt('sapGanttPdfPreviewDiv');
			} else {
				this._oPdfPreview.setSource(sBlob);
			}

			this._oDialog.getContent()[0].setBusy(false);
			this._oFlexBoxPreview.setBusy(false);
			this._oButtonExport.setEnabled(true);
			if (this._oButtonSave){
				this._oButtonSave.setEnabled(true);
			}
		};

		GanttPrinting.prototype._addClipRectDefs = function (oElement, xOffset, yOffset, fWidth, fHeight) {
			var oClipDef = document.createElement("defs");
			oElement.appendChild(oClipDef);

			var oClipPathElement = document.createElement("clipPath");
			oClipPathElement.setAttribute("id", "printClipRect");
			oClipDef.appendChild(oClipPathElement);

			var oRectElement = document.createElement("rect");
			oRectElement.setAttribute("x", xOffset);
			oRectElement.setAttribute("y", yOffset);
			oRectElement.setAttribute("width", fWidth);
			oRectElement.setAttribute("height", fHeight);
			oClipPathElement.appendChild(oRectElement);
		};

		GanttPrinting.prototype._generateSvgToPdf = function () {
			if (!this._validateFields()) {
				return;
			}

			this._oDialog.getContent()[0].setBusy(true);
			this._oFlexBoxPreview.setBusy(true);
			this._oButtonExport.setEnabled(false);
			if (this._oButtonSave){
				this._oButtonSave.setEnabled(false);
			}
			var that = this;

			var sOrientation = this._oModel.getProperty("/portrait") ? "p" : "l",
				fPaperWidth = this._oModel.getProperty("/paperWidth"),
				fPaperHeight = this._oModel.getProperty("/paperHeight"),
				fMarginTop = this._oModel.getProperty("/marginTop") * SCALEFACTORCONSTANT,
				fMarginRight = this._oModel.getProperty("/marginRight") * SCALEFACTORCONSTANT,
				fMarginBottom = this._oModel.getProperty("/marginBottom") * SCALEFACTORCONSTANT,
				fMarginLeft = this._oModel.getProperty("/marginLeft") * SCALEFACTORCONSTANT,
				sPaperSize = this._oModel.getProperty("/paperSize");
				var oOriginalGanttChart = this._ganttChartClone;
				var iTableAreaWidthInPx = oOriginalGanttChart.getDisplayType() === GanttChartWithTableDisplayType.Both ? oOriginalGanttChart.getTable().getDomRef().offsetWidth : 0;

			// multiply by SCALEFACTORCONSTANT to convert px to pt
			var oPdf = new jsPDF({
				orientation: sOrientation,
				unit: "px",
				format: sPaperSize === "Custom" ? [fPaperWidth * SCALEFACTORCONSTANT, fPaperHeight * SCALEFACTORCONSTANT] : sPaperSize.toLowerCase()
			});

			function genarateSinglePagePDF () {
				if (!this._getOriginalGanttChart()){
					return;
				}
				var mergedSVG = document.createElement("svg");
				mergedSVG.setAttribute("id", "mergedSvg");
				var iInnerGanttWidth = Number(this._oDomToPrint[0].style.width.slice(0,-2)) - Number(this._oDomToPrint[0].getElementsByTagName('section')[0].style.width.slice(0,-2)) - 16;
				if (counter === 0) {
					var oGanttHeaderSvg = this._oDomToPrint[counter].getElementsByClassName("sapGanttChartHeaderSvg")[0].cloneNode(true);
					oGanttHeaderSvg.children[0].setAttribute("style", "fill: " +  Parameters.get("sapUiListHeaderBackground") + ";width: " + iInnerGanttWidth);
					oGanttHeaderSvg.getElementsByTagName("rect")[1].setAttribute("width", iInnerGanttWidth + "px");
					if (oGanttHeaderSvg.getElementById("inner-header-g")) {
						oGanttHeaderSvg.getElementById("inner-header-g").children[0].setAttribute("width", iInnerGanttWidth + "px");
					}
					var nHeaderHeight = oGanttHeaderSvg.height.baseVal.value;
				}

				var oGanttChartSvg = this._oDomToPrint[counter].getElementsByClassName("sapGanttChartSvg")[0].cloneNode(true);
				var oSvgDefs = this._getOriginalGanttChart().getDomRef() ? this._getOriginalGanttChart().getDomRef().getElementsByClassName("sapGanttChartSvgDefs") : null;
				var oGanttChartSvgDef = (oSvgDefs && oSvgDefs.length > 0) ? oSvgDefs[0].cloneNode(true) : null;

				//Redrawing the vertical lines
				if (oGanttChartSvg.getElementsByClassName("sapGanttChartVerticalLine") && oGanttChartSvg.getElementsByClassName("sapGanttChartVerticalLine").length) {
					var sVerticalLinePath = this._generateVerticalLines(this._ganttChartClone, oGanttChartSvg.height.baseVal.value);
					if (sVerticalLinePath) {
						oGanttChartSvg.getElementsByClassName("sapGanttChartVerticalLine")[0].setAttribute("d", sVerticalLinePath);
						oGanttChartSvg.getElementsByClassName("sapGanttChartVerticalLine")[0].removeAttribute("style");
					} else {
						return;
					}
				}

				//Removing unwanted styles
				oGanttChartSvg.removeAttribute("style");
				if (counter === 0) {
					Array.prototype.slice.call(oGanttHeaderSvg.getElementsByTagName("path")).forEach(function (elm) {
						that._setStyleToPath(elm);
					});
				}
				Array.prototype.slice.call(oGanttChartSvg.getElementsByClassName("sapGanttChartShapes")[0].getElementsByTagName("path")).forEach(function (elm){
					that._setStyleToPath(elm);
				});

				Array.prototype.slice.call(oGanttChartSvg.getElementsByClassName("sapGanttChartRls")[0].getElementsByTagName("path")).forEach(function (elm){
					that._setStyleToPath(elm);
				});

				//Divider lines
				if (oGanttChartSvg.getElementsByClassName("sapGanttBackgroundSVGRowBorder").length) {
					Array.prototype.slice.call(oGanttChartSvg.getElementsByClassName("sapGanttBackgroundSVGRowBorder")).forEach(function(elm){
						elm.setAttribute('x2', iInnerGanttWidth);
						elm.setAttribute('y1', elm.getAttribute('y1') );
						elm.setAttribute('y2', elm.getAttribute('y2') );
					});
				}

				if (oGanttChartSvg.getElementsByClassName("sapGanttBackgroundSVGRow").length) {
					Array.prototype.slice.call(oGanttChartSvg.getElementsByClassName("sapGanttBackgroundSVGRow")).forEach(function(elm){
						elm.setAttribute("style", "fill: " +  Parameters.get("sapUiListBackground") + ";width: " + iInnerGanttWidth);
					});
				}

				this._setLinesHeight(oGanttChartSvg);
				if (counter === 0) {
					this._setCalenderDefsPosition(oGanttChartSvgDef, nScale, iTableAreaWidthInPx);
					mergedSVG.appendChild(oGanttHeaderSvg);
					oGanttChartSvg.setAttribute("y", nHeaderHeight);
				} else {
					oGanttChartSvg.setAttribute("y", 0);
				}

				//Merge Svg
				mergedSVG.appendChild(oGanttChartSvg);
				mergedSVG.appendChild(oGanttChartSvgDef);
				this._addClipRectDefs(mergedSVG, 0, 0, iInnerGanttWidth, this._oDomToPrintHeight);
				mergedSVG.setAttribute("clip-path", "url(#printClipRect)");
				this._mHeaderFooterInfo["mergedSVG"] = mergedSVG;

				var oPrintHTML = document.createElement('div');
				var oTable = this._oDomToPrint[counter].getElementsByTagName('section')[0].cloneNode(true);
				oPrintHTML.appendChild(oTable);

				//Adding splitter
				if (counter === 0) {
					var oSplitterBar = this._oDomToPrint[counter].getElementsByClassName('sapUiLoSplitterBar')[0].cloneNode(true);
					while (oSplitterBar.children.length > 0) {
						oSplitterBar.removeChild(oSplitterBar.firstChild);
					}
					var oOriginalSplitterStyles = window.getComputedStyle(this._getOriginalGanttChart().getDomRef().getElementsByClassName('sapUiLoSplitterBar')[0]);
					var sBackgroundColor = oOriginalSplitterStyles.backgroundColor ? oOriginalSplitterStyles.backgroundColor : "#c9d8e7";
					oSplitterBar.setAttribute("style", "background-color: " + sBackgroundColor + ";width: 1rem;display: inline-block; height: " + this._oDomToPrintHeight + "px");
					oSplitterBar.style.transform = "translate(" + iTableAreaWidthInPx + "px, -" + this._oDomToPrint[counter].style.height + ")";
					oPrintHTML.appendChild(oSplitterBar);
				}

				//Genearate PDF and Stitching with SVG.
				oPdf.html(oPrintHTML, {
					callback: function (oPdf) {
						var iPageCount = oPdf.internal.getNumberOfPages();
						while (iPageCount > 1) {
							oPdf.deletePage(iPageCount);
							iPageCount--;
						}
						svg2pdf(mergedSVG, oPdf, {
							xOffset: ((iTableAreaWidthInPx + 16) * nScale) + fMarginLeft,
							yOffset: yOffset,
							scale: nScale
						});
						counter++;
						if (counter >= that._oDomToPrint.length) {
							that.oSinglePagePdf = oPdf;
							that._updatePdfPreview(oPdf.output('bloburl'));
						} else {
							yOffset = yOffset + (Number(that._oDomToPrint[counter - 1].style.height.slice(0,-2)) * nScale);
							genarateSinglePagePDF.call(that);
						}

					},
					html2canvas: { scale: nScale, allowTaint: true },
					x: fMarginLeft,
					y: yOffset
				});
			}

			var counter = 0;
			var nHeaderFooterHeight = 0;
			var oDomToPrintHeight = this._oDomToPrintHeight * 2;
			var oDomToPrintWidth = this._oDomToPrintWidth * 2;

			// add header
			oPdf.setFontSize(6.5);

			var fEllipseWidth = oPdf.getTextWidth('...') * JSPDFCONSTANT;
			var fTargetWidth = fPaperWidth - PrintUtils._mmToPx(4) - fEllipseWidth;
			var sHeaderText, sFooterText, iTruncatedChars, truncatePointRTL;

			var bRTL = GanttChartConfigurationUtils.getRTL();
			var sHeaderFooterAlignment = bRTL ? "right" : "left";

			if (this._oModel.getProperty("/showHeaderText")) {
				sHeaderText = this._oModel.getProperty("/headerText");
				nHeaderFooterHeight = nHeaderFooterHeight + this._iHeaderAndFooterHeight;
				var fHeaderTextWidth = oPdf.getTextWidth(sHeaderText) * JSPDFCONSTANT;

				if (fHeaderTextWidth > (fPaperWidth - PrintUtils._mmToPx(4))){
					iTruncatedChars = GanttUtils.geNumberOfTruncatedCharacters(fHeaderTextWidth, fTargetWidth, sHeaderText, oPdf, oPdf.getTextWidth, false, JSPDFCONSTANT);
					if (bRTL) {
						truncatePointRTL = sHeaderText.length - iTruncatedChars;
						sHeaderText = "..." + sHeaderText.slice(truncatePointRTL, sHeaderText.length).trim();
					} else {
						sHeaderText = sHeaderText.slice(0, iTruncatedChars).trim() + "...";
					}
				}

				oPdf.text(sHeaderText, this._getFXTextPosition(), (this._iHeaderAndFooterHeight / (2 * JSPDFCONSTANT)), sHeaderFooterAlignment);
			}

			// add footer
			if (this._oModel.getProperty("/showFooterText")) {
				sFooterText = this._oModel.getProperty("/footerText");
				nHeaderFooterHeight = nHeaderFooterHeight + this._iHeaderAndFooterHeight;

				var fFooterTextWidth = oPdf.getTextWidth(sFooterText) * JSPDFCONSTANT;

				if (fFooterTextWidth > (fPaperWidth - PrintUtils._mmToPx(4))){
					iTruncatedChars = GanttUtils.geNumberOfTruncatedCharacters(fFooterTextWidth, fTargetWidth, sFooterText, oPdf, oPdf.getTextWidth, false, JSPDFCONSTANT);
					if (bRTL) {
						truncatePointRTL = sFooterText.length - iTruncatedChars;
						sFooterText = "..." + sFooterText.slice(truncatePointRTL, sFooterText.length).trim();
					} else {
						sFooterText = sFooterText.slice(0, iTruncatedChars).trim() + "...";
					}
				}

				oPdf.text(sFooterText, this._getFXTextPosition(), oPdf.getPageHeight() - (this._iHeaderAndFooterHeight / (2 * JSPDFCONSTANT)) -
				(this._isFooterMultiline() ? this._iHeaderAndFooterHeight / JSPDFCONSTANT : 0), sHeaderFooterAlignment);
			}

			this._mHeaderFooterInfo = {
				oPdf: oPdf,
				headerText: sHeaderText,
				footerText: sFooterText,
				position: this._getFXTextPosition()
			};

			var bShrinkByWidth = this._isDomShrinkableToOnePageByWidth(oDomToPrintHeight, oDomToPrintWidth);
			var nScale = bShrinkByWidth ? (fPaperWidth   * SCALEFACTORCONSTANT - fMarginRight - fMarginLeft) / this._oDomToPrintWidth : (fPaperHeight  * SCALEFACTORCONSTANT - fMarginTop - fMarginBottom - nHeaderFooterHeight) / this._oDomToPrintHeight;
			var yOffset = fMarginTop + that._getHeaderHeight();
			this._pageMargin = [fMarginTop, fMarginRight, fMarginBottom, fMarginLeft];

			if (this.sFont) {
				oPdf.addFileToVFS("SAP-icons.ttf", this.sFont);
				oPdf.addFont("SAP-icons.ttf", "SAP-icons", "normal");
				oPdf.setFont("SAP-icons");
				oPdf.setFontSize(9);
				genarateSinglePagePDF.call(this);
			} else {
				var sTheme = GanttChartConfigurationUtils.getTheme(),
				sPath = 'base';
				if (sTheme.indexOf("sap_horizon") > -1) {
					sPath = sTheme;
				}
				var sDownloadURI = sap.ui.require.toUrl("sap/ui/core/themes/" + sPath + "/fonts/SAP-icons.ttf");
				this._fetchFontAndGeneratePdf(sDownloadURI, oPdf, genarateSinglePagePDF);
			}
		};

		//Fetching SAP fonts and adding to PDF doc.
		GanttPrinting.prototype._fetchFontAndGeneratePdf = function (sDownloadURI, oPdf, genarateSinglePagePDF) {
			var that = this;
			fetch(sDownloadURI)
			.then(function(res) {
				return res.blob();
			}) // Gets the response and returns it as a blob
			.then(function(blob) {
				var fr = new FileReader();
				fr.onload = function() {
					if (fr.readyState === fr.DONE) {
						that.sFont = fr.result;
						oPdf.addFileToVFS("SAP-icons.ttf", that.sFont);
						oPdf.addFont("SAP-icons.ttf", "SAP-icons", "normal");
						oPdf.setFont("SAP-icons");
						oPdf.setFontSize(9);
						genarateSinglePagePDF.call(that);
					}
				};
				fr.readAsBinaryString(blob);
			}).catch(function(err) {
			});
		};

		//Setting y2 value for nowLine, AdhocLine and DeltaLine to print in PDF
		GanttPrinting.prototype._setLinesHeight = function (oGanttChartSvg) {
			var fGanttSvgHeight = oGanttChartSvg.height.baseVal.value;
			if (oGanttChartSvg.getElementsByClassName("sapGanttNowLineBodySvgLine").length) {
				oGanttChartSvg.getElementsByClassName("sapGanttNowLineBodySvgLine")[0].getElementsByTagName('line')[0].setAttribute('y2', fGanttSvgHeight);
			}
			if (oGanttChartSvg.getElementsByClassName("sapGanttChartAdhocLine").length) {
				Array.prototype.slice.call(oGanttChartSvg.getElementsByClassName("sapGanttChartAdhocLine")[0].getElementsByTagName("line")).forEach(function (elm){
					elm.setAttribute('y2', fGanttSvgHeight);
				});
			}
			if (oGanttChartSvg.getElementsByClassName("sapGanttChartDeltaLine").length) {
				Array.prototype.slice.call(oGanttChartSvg.getElementsByClassName("sapGanttChartDeltaLine")[0].getElementsByTagName("line")).forEach(function (elm){
					elm.setAttribute('y2', fGanttSvgHeight);
				});
			}
			if (oGanttChartSvg.getElementsByClassName("sapGanttChartAreaDeltaLine").length) {
				Array.prototype.slice.call(oGanttChartSvg.getElementsByClassName("sapGanttChartAreaDeltaLine")[0].getElementsByTagName("rect")).forEach(function (elm){
					elm.setAttribute('height', fGanttSvgHeight);
				});
			}
		};

		GanttPrinting.prototype._setCalenderDefsPosition = function (oGanttChartSvgDef, nScale, iTableAreaWidthInPx) {
			var fMarginRight = this._oModel.getProperty("/marginRight"),
				fMarginLeft = this._oModel.getProperty("/marginLeft");
			Array.prototype.slice.call(oGanttChartSvgDef.getElementsByTagName("rect")).forEach(function (elm) {
				elm.setAttribute('x', ((Number(elm.getAttribute('x')) + iTableAreaWidthInPx) * nScale) + (fMarginRight + fMarginLeft) + 32); // Adding the splitter width as well
				elm.setAttribute('width', Number(elm.getAttribute('width')) * nScale);
			});
		};

		GanttPrinting.prototype._savePdf = function () {
			if (!this._validateFields()) {
				return;
			}

			var sOrientation = this._oModel.getProperty("/portrait") ? "p" : "l",
				fPaperWidth = this._oModel.getProperty("/paperWidth"),
				fPaperHeight = this._oModel.getProperty("/paperHeight"),
				bExportAsJPEG = this._oModel.getProperty("/exportAsJPEG"),
				fCompressionQuality = this._oModel.getProperty("/compressionQuality") / 100,
				sPaperSize = this._oModel.getProperty("/paperSize");

			// multiply by SCALEFACTORCONSTANT to convert px to pt
			var oPdf = new jsPDF({
				orientation: sOrientation,
				unit: "px",
				format: sPaperSize === "Custom" ? [fPaperWidth * SCALEFACTORCONSTANT, fPaperHeight * SCALEFACTORCONSTANT] : sPaperSize.toLowerCase()
			});
			var aPages = this._pageToBeExported();
			for (var i = 0; i < aPages.length; i++) {
				var oCanvas = this._getCanvasOfPageN(aPages[i], true);

				if (!oCanvas) {
					continue;
				}

				if (i !== 0) {
					oPdf.addPage();
				}

				if (bExportAsJPEG) {
					oPdf.addImage(oCanvas.toDataURL("image/jpeg", fCompressionQuality), "JPEG", 0, 0);
				} else {
					oPdf.addImage(oCanvas.toDataURL("image/png"), "PNG", 0, 0);
				}
			}
			this._downloadPdf(oPdf);
		};

		GanttPrinting.prototype._downloadPdf = function (oPdf) {
			var oDate = new Date();
			oPdf.save("GanttChartExport-" + oDate.toISOString() + ".pdf");
		};

		GanttPrinting.prototype._generateVerticalLines = function (oGantt, iGanttSvgHeight) {
			var iRenderedWidth = Number(this._oDomToPrint[0].style.width.slice(0,-2)) -  Number(this._oDomToPrint[0].getElementsByTagName('section')[0].style.width.slice(0,-2)),
				oAxisTime = oGantt.getAxisTime();

			var sPathContent = "";
			if (oAxisTime) {
				var oZoomStrategy = oAxisTime.getZoomStrategy();
				var aTickTimeIntervals = oAxisTime.getTickTimeIntervalLabel(oZoomStrategy.getTimeLineOption(), null, [0, iRenderedWidth]);

				// the second item have all the tick time info
				var aTicks = aTickTimeIntervals[1];
				// By Default line width is 1, is need to minus the half width of line
				for (var i = 0; i < aTicks.length; i++) {
					sPathContent += " M" +
						" " + (aTicks[i].value - 1 / 2) +
						" 0" +
						" v " + iGanttSvgHeight;
				}
			}
			return sPathContent;
		};

		GanttPrinting.prototype._createPaperComboBox = function (bSinglePage) {
			this._oComboBoxPaperSizes = new ComboBox({
				selectedKey: "{setting>/paperSize}",
				change: this._updatePaperSizeValues.bind(this, bSinglePage),
				items: [
					new Item({
						key: "A5",
						text: "A5"
					}),
					new Item({
						key: "A4",
						text: "A4"
					}),
					new Item({
						key: "A3",
						text: "A3"
					}),
					new Item({
						key: "A2",
						text: "A2"
					}),
					new Item({
						key: "A1",
						text: "A1"
					}),
					new Item({
						key: "A0",
						text: "A0"
					}),
					new Item({
						key: "Letter",
						text: this._oRb.getText("GNT_PRNTG_PAPER_SIZE_LETTER")
					}),
					new Item({
						key: "Legal",
						text: this._oRb.getText("GNT_PRNTG_PAPER_SIZE_LEGAL")
					}),
					new Item({
						key: "Tabloid",
						text: this._oRb.getText("GNT_PRNTG_PAPER_SIZE_TABLOID")
					}),
					new Item({
						key: "Custom",
						text: this._oRb.getText("GNT_PRNTG_PAPER_SIZE_CUSTOM")
					})
				]
			});
			return this._oComboBoxPaperSizes;
		};

		GanttPrinting.prototype._createPaperSizeFields = function (bSinglePage) {
			this._oUnitLabel = new InvisibleText({
				text: this._oRb.getText("GNT_PRNTG_UNIT")
			});
			this._oUnitLabel.toStatic();
			this._oHeightLabel = new InvisibleText({
				text: this._oRb.getText("GNT_PRNTG_HEIGHT")
			});
			this._oHeightLabel.toStatic();
			this._oWidthLabel = new InvisibleText({
				text: this._oRb.getText("GNT_PRNTG_WIDTH")
			});
			this._oWidthLabel.toStatic();
			this._oInputPaperWidth = new Input({
				type: "Number",
				change: this._onChangePaperSizeInput.bind(this, bSinglePage),
				ariaLabelledBy: this._oWidthLabel
			});

			this._oInputPaperHeight = new Input({
				type: "Number",
				change: this._onChangePaperSizeInput.bind(this, bSinglePage),
				ariaLabelledBy: this._oHeightLabel
			});

			this._updatePaperSizeInputs();

			this._oComboBoxUnit = new ComboBox({
				selectedKey: "{setting>/unit}",
				change: this._onChangeUnitComboBox.bind(this),
				ariaLabelledBy: this._oUnitLabel,
				items: [
					new Item({
						key: "mm",
						text: this._oRb.getText("GNT_PRNTG_MILLIMETERS")
					}),
					new Item({
						key: "cm",
						text: this._oRb.getText("GNT_PRNTG_CENTIMETERS")
					}),
					new Item({
						key: "in",
						text: this._oRb.getText("GNT_PRNTG_INCHES")
					})
				]
			});

			var oWidthLayout = new FlexBox({
				renderType: "Bare",
				direction: FlexDirection.Column,
				items: [
					new Label({
						text: this._oRb.getText("GNT_PRNTG_WIDTH"),
						showColon: true
					}),
					this._oInputPaperWidth
				]
			}).addStyleClass("sapGanttPrintingSmallRightMargin");

			var oHeightLayout = new FlexBox({
				renderType: "Bare",
				direction: FlexDirection.Column,
				items: [
					new Label({
						text: this._oRb.getText("GNT_PRNTG_HEIGHT"),
						showColon: true
					}),
					this._oInputPaperHeight
				]
			}).addStyleClass("sapGanttPrintingSmallLeftMargin");

			var oUnitLayout = new FlexBox({
				renderType: "Bare",
				direction: FlexDirection.Column,
				items: [
					new Label({
						text: this._oRb.getText("GNT_PRNTG_UNIT"),
						showColon: true
					}),
					this._oComboBoxUnit
				]
			}).addStyleClass("sapGanttPrintingLeftMargin");

			var oFieldLayout = new FlexBox({
				renderType: "Bare",
				alignItems: "Center",
				justifyContent: "SpaceBetween",

				items: [
					oWidthLayout,
					new Text({
						text: "×"
					}).addStyleClass("sapGanttPrintingTopMargin"),
					oHeightLayout
				]
			});

			return new FlexBox({
				renderType: "Bare",
				alignItems: "Center",
				justifyContent: "SpaceBetween",
				items: [
					oFieldLayout,
					oUnitLayout
				]
			});
		};


		GanttPrinting.prototype._createDurationComboBox = function (bSinglePage) {
			var oTimeStrategy = this._getOriginalGanttChart().getAxisTimeStrategy(),
				oTotalHorizon = oTimeStrategy.getTotalHorizon(),
				oEndTime = new Date(Format.abapTimestampToDate(oTotalHorizon.getEndTime())),
				oDateNow = new Date();

			this._oComboBoxDuration = new ComboBox({
				selectedKey: "{setting>/duration}",
				change: this._onChangeDurationComboBox.bind(this, bSinglePage),
				items: [
					new Item({
						key: "all",
						text: this._oRb.getText("GNT_PRNTG_DURATION_ALL")
					}),
					new Item({
						key: "week",
						enabled: this._getFirstDayOfNextWeek(oDateNow).getTime() < oEndTime.getTime(),
						text: this._oRb.getText("GNT_PRNTG_DURATION_NEXT_WEEK")
					}),
					new Item({
						key: "month",
						enabled: this._getFirstDayOfNextMonth(oDateNow).getTime() < oEndTime.getTime(),
						text: this._oRb.getText("GNT_PRNTG_DURATION_NEXT_MONTH")
					}),
					new Item({
						key: "custom",
						text: this._oRb.getText("GNT_PRNTG_DURATION_CUSTOM")
					})
				]
			});

			return this._oComboBoxDuration;
		};

		GanttPrinting.prototype._createDatePicker = function (bSinglePage) {
			var oLocale  = this._ganttChartClone.getLocale();
			var oTotalHorizon = this._ganttChartClone.getAxisTimeStrategy().getTotalHorizon();
			var oStartTime = Format.abapTimestampToDate(oTotalHorizon.getStartTime());
			var oEndTime = Format.abapTimestampToDate(oTotalHorizon.getEndTime());
			this._customDates = {
				startDate : this._oModel.getProperty("/startDate"),
				endDate : this._oModel.getProperty("/endDate")
			};
			this._oModel.setProperty("/startDate",oStartTime);
			this._oModel.setProperty("/endDate", oEndTime);
			this._oModel.setProperty("/timezone", oLocale.getTimeZone());

			this._oStartDateLabel = new InvisibleText({
				text: this._oRb.getText("GNT_PRNTG_START_DATE")
			});
			this._oEndDateLabel = new InvisibleText({
				text: this._oRb.getText("GNT_PRNTG_END_DATE")
			});
			this._oStartDateLabel.toStatic();
			this._oEndDateLabel.toStatic();

			var oOriginalTotalHorizon = this._getOriginalGanttChart().getAxisTimeStrategy().getTotalHorizon();
			var oOriginalStartTime = Format.abapTimestampToDate(oOriginalTotalHorizon.getStartTime());
			var oOriginalEndTime = Format.abapTimestampToDate(oOriginalTotalHorizon.getEndTime());
			this._oDatePickerFrom = new DateTimePicker({
				minDate: UI5Date.getInstance(oOriginalStartTime),
				maxDate: UI5Date.getInstance(oOriginalEndTime),
				value: {
					parts: [{
						path: "setting>/startDate",
						type: new DateTimeOffset()
					},
					{
						path: 'setting>/timezone',
						type: new String()
					}
					],
					type: new DateTimeWithTimezone()
				},
				change: this._onChangeDurationDatePicker.bind(this, bSinglePage),
				enabled: true,
				timezone: oLocale.getTimeZone(),
				showTimezone: false,
				ariaLabelledBy: this._oStartDateLabel
			});

			this._oDatePickerTo = new DateTimePicker({
				minDate: UI5Date.getInstance(oOriginalStartTime),
				maxDate: UI5Date.getInstance(oOriginalEndTime),
				value: {
					parts: [{
						path: "setting>/endDate",
						type: new DateTimeOffset()
					},
					{
						path: 'setting>/timezone',
						type: new String()
					}
					],
					type: new DateTimeWithTimezone()
				},
				change: this._onChangeDurationDatePicker.bind(this, bSinglePage),
				enabled: true,
				ariaLabelledBy: this._oEndDateLabel,
				timezone: oLocale.getTimeZone(),
				showTimezone: false
			});


			var oStartDateUnit = new FlexBox({
				renderType: "Bare",
				direction: FlexDirection.Column,
				items: [
					new Label({
						text: this._oRb.getText("GNT_PRNTG_START_DATE"),
						showColon: true
					}),
					this._oDatePickerFrom
				]
			}).addStyleClass("sapGanttPrintingSmallRightMargin");

			var oEndDateUnit = new FlexBox({
				renderType: "Bare",
				direction: FlexDirection.Column,
				items: [
					new Label({
						text: this._oRb.getText("GNT_PRNTG_END_DATE"),
						showColon: true
					}),
					this._oDatePickerTo
				]
			}).addStyleClass("sapGanttPrintingSmallLeftMargin");
			this._updatedatePickerValues();
			return new FlexBox({
				renderType: "Bare",
				alignItems: "Center",
				justifyContent: "SpaceBetween",
				items: [
					oStartDateUnit,
					new Text({text: "~"}).addStyleClass("sapGanttPrintingTopMargin"),
					oEndDateUnit
				]
			});
		};
		/**
		 * Updates the date picker values as per the provided duration.
		 * @private
		 */
		GanttPrinting.prototype._updatedatePickerValues = function () {
			var sDuration = this._oModel.getProperty("/duration");
			if (sDuration === "all") {
				var oTotalHorizon = this._ganttChartClone.getAxisTimeStrategy().getTotalHorizon();
				var oStartTime = Format.abapTimestampToDate(oTotalHorizon.getStartTime());
				var oEndTime = Format.abapTimestampToDate(oTotalHorizon.getEndTime());
				this._oModel.setProperty("/startDate", this._validateDate(oStartTime));
				this._oModel.setProperty("/endDate", this._validateDate(oEndTime));
			} else if (sDuration === "week") {
				this._nextWeekRange();
			} else if (sDuration === "month") {
				this._nextMonthRange();
			} else if (sDuration === "custom") {
				this._oModel.setProperty("/startDate", this._validateDate(this._customDates.startDate));
				this._oModel.setProperty("/endDate", this._validateDate(this._customDates.endDate));
			}
			var oStartDate = this._oModel.getProperty("/startDate");
			var oEndDate = this._oModel.getProperty("/endDate");
			this._oDatePickerFrom.setValue(oStartDate);
			this._oDatePickerTo.setValue(oEndDate);

			var oTimeStrategy = this._ganttChartClone.getAxisTimeStrategy();
			var oNewVisibleHorizon = oTimeStrategy.getVisibleHorizon().clone();
			var oNewTotalHorizon = oTimeStrategy.getTotalHorizon().clone();

			oNewVisibleHorizon.setStartTime(this._oModel.getProperty("/startDate"));
			oNewVisibleHorizon.setEndTime(this._oModel.getProperty("/endDate"));
			oNewTotalHorizon.setStartTime(this._oModel.getProperty("/startDate"));
			oNewTotalHorizon.setEndTime(this._oModel.getProperty("/endDate"));

			oTimeStrategy.setTotalHorizon(oNewTotalHorizon);
			oTimeStrategy.setVisibleHorizon(oNewVisibleHorizon);
		};

		GanttPrinting.prototype._createScale = function () {
			return new Slider({
				min: 50,
				max: 200,
				step: 1,
				width: "25rem",
				value: "{setting>/scale}",
				visible: "{setting>/multiplePage}",
				liveChange: this._updateDialogPreview.bind(this),
				showAdvancedTooltip: true,
				inputsAsTooltips: true
			});
		};

		GanttPrinting.prototype._validateExportRangeInput = function () {
			// do not validate range field if we do not use it
			if (this._oModel.getProperty("/exportAll") || this._bSinglePage) {
				return true;
			}

			var sValue = this._oModel.getProperty("/exportRange").replace(/\s/g, "");
			if (/^((\d+),|(\d+-\d+),)*((\d+)|(\d+-\d+))+$/.test(sValue)) {
				this._oInputRange.setValueState("None");
				return true;
			}

			this._oInputRange.setValueState("Error");
			this._oInputRange.setValueStateText(this._oRb.getText("GNT_PRNTG_PAGE_RANGE_ERROR"));
			return false;
		};

		/**
		 * @returns {boolean} validity state of the provided duration input.
		 * @private
		 */
		GanttPrinting.prototype._validateDurationInput = function () {
			var sValue = this._oModel.getProperty("/duration");
			if (!["all",'week','month','custom'].includes(sValue)) {
				this._oComboBoxDuration.setValueState("Error");
				this._oComboBoxDuration.setValueStateText(this._oRb.getText("GNT_PRNTG_ERROR_DATEDURATION"));
				this._oDatePickerFrom.setValueState("Error");
				this._oDatePickerTo.setValueState("Error");
				return false;
			}
			this._oComboBoxDuration.setValueState("None");
			this._oDatePickerFrom.setValueState("None");
			this._oDatePickerTo.setValueState("None");
			return true;
		};

		GanttPrinting.prototype._createPageRange = function () {
			this._oRangeLabel = new InvisibleText({
				text: this._oRb.getText("GNT_PRNTG_PAGE_RANGE")
			});
			this._oRangeLabel.toStatic();
			var fnOnChangeRadioButtonRange = function (oEvent) {
				var iSelectedButton = oEvent.getSource().getSelectedIndex();
				if (iSelectedButton === 0) { // all
					this._oButtonExport.setEnabled(true);
					if (this._oButtonSave){
						this._oButtonSave.setEnabled(true);
					}
					this._oInputRange.setValueState("None");
				}
			};

			// eslint-disable-next-line no-return-assign
			return new FlexBox({
				renderType: "Bare",
				alignItems: "Center",
				visible: "{setting>/multiplePage}",
				justifyContent: "SpaceBetween",
				items: [
					new RadioButtonGroup({
						layoutData: new FlexItemData({
							shrinkFactor: 0,
							growFactor: 1
						}),
						selectedIndex: this._oModel.getProperty("/exportAll") ? 0 : 1,
						columns: 2,
						select: fnOnChangeRadioButtonRange.bind(this),
						buttons: [
							new RadioButton({
								id: "all",
								text: this._oRb.getText("GNT_PRNTG_PAGE_RANGE_ALL"),
								selected: "{setting>/exportAll}",
								ariaLabelledBy: this._oRangeLabel
							}),
							new RadioButton({
								id: "range",
								text: this._oRb.getText("GNT_PRNTG_PAGE_RANGE_RANGE") + " ",
								ariaLabelledBy: this._oRangeLabel
							})
						]
					}),
					this._oInputRange = new Input({
						layoutData: new FlexItemData({
							growFactor: 1
						}),
						value: "{setting>/exportRange}",
						change: this._validateExportRangeInput.bind(this),
						enabled: {
							path: "setting>/exportAll",
							formatter: function (bExportAll) {
								return !bExportAll;
							}
						},
						ariaLabelledBy: this._oRangeLabel
					}).addStyleClass("sapGanttPrintingPageRangeInput")
				]
			});
		};

		GanttPrinting.prototype._createLabelWithSwitch = function (sText, sStateBinding) {
			this._oLabelWithSwitchLabel = new InvisibleText({
				text: sText
			});
			this._oLabelWithSwitchLabel.toStatic();
			this._oSwitch = new Switch({
				state: sStateBinding,
				change: this._updateDialogPreview.bind(this),
				ariaLabelledBy: this._oLabelWithSwitchLabel
			});
			return new FlexBox({
				renderType: "Bare",
				visible: "{setting>/multiplePage}",
				alignItems: "Center",
				items: [
					new Label({
						text: sText,
						showColon: true
					}),
					this._oSwitch.addStyleClass("sapGanttPrintingSwitchPadding")
				]
			});
		};

		GanttPrinting.prototype._createCheckBoxWithInput = function (sText, bCheckBoxBinding, sValueBinding, bSinglePage) {
			var fnUpdateDialog = bSinglePage ? this._generateSvgToPdf : this._updateDialogPreview;
			var fnLiveChange = this._onLiveChange.bind(this);
			var oInput = new Input({
				width: "65%",
				value: sValueBinding,
				enabled: bCheckBoxBinding,
				valueLiveUpdate: true,
				valueStateText: this._oRb.getText("GNT_PRNTG_HEADER_FOOTER_TEXT_ERROR"),
				liveChange: function() {
					fnLiveChange(bSinglePage ,oInput, false);
				}
			});
			this._oHeaderFooterLabel = new InvisibleText({
				text: this._oRb.getText("GNT_PRNTG_HEADER_AND_FOOTER")
			});
			this._oHeaderFooterLabel.toStatic();
			oInput.onsapfocusleave = function() {
				fnLiveChange(bSinglePage ,oInput, true);
			};
			return new FlexBox({
				renderType: "Bare",
				alignItems: "Start",
				justifyContent: "SpaceBetween",
				items: [
					new CheckBox({
						selected: bCheckBoxBinding,
						text: sText + ":",
						select: fnUpdateDialog.bind(this),
						ariaLabelledBy: this._oHeaderFooterLabel
					}),
					oInput
				]
			});
		};

		GanttPrinting.prototype._onLiveChange = function(bSinglePage, oInput, bUpdateDialog) {
			if (oInput.getValue().length > MAXHEADERFOOTERLENGTH){
				oInput.setValue(oInput.getValue().slice(0, MAXHEADERFOOTERLENGTH));
				oInput.setValueState("Error");
			} else {
				oInput.setValueState("None");
			}
			if (bUpdateDialog){
				if (bSinglePage){
					this._generateSvgToPdf();
				} else {
					this._updateDialogPreview();
				}
			}
			return;
		};

		GanttPrinting.prototype._createPanel = function (sTitle, oContent) {
			return new Panel({
				expandable: true,
				expanded: false,
				headerText: sTitle,
				content: [
					new FlexBox({
						renderType: "Bare",
						direction: FlexDirection.Column,
						items: [
							oContent
						]
					})
				]
			});
		};

		GanttPrinting.prototype._createCompressionSlider = function () {
			return new Slider({
				min: 1,
				max: 100,
				step: 1,
				change: this._onChangeCompressionSlider.bind(this),
				value: {
					path: "setting>/compressionQuality",
					type: new Integer()
				},
				visible: "{setting>/exportAsJPEG}",
				showAdvancedTooltip: true,
				inputsAsTooltips: true
			});
		};

		GanttPrinting.prototype._createCompressionComboBox = function () {
			this._oComboBoxCompression = new ComboBox({
				visible: "{setting>/exportAsJPEG}",
				change: this._onChangeCompressionComboBox.bind(this),
				items: [
					new Item({
						key: "maximum",
						text: this._oRb.getText("GNT_PRNTG_COMPRESSION_MAXIMUM")
					}),
					new Item({
						key: "high",
						text: this._oRb.getText("GNT_PRNTG_COMPRESSION_HIGH")
					}),
					new Item({
						key: "medium",
						text: this._oRb.getText("GNT_PRNTG_COMPRESSION_MEDIUM")
					}),
					new Item({
						key: "low",
						text: this._oRb.getText("GNT_PRNTG_COMPRESSION_LOW")
					})
				]
			});

			// init
			var iCompressionValue = this._oModel.getProperty("/compressionQuality");
			this._setCompressionComboBoxItem(iCompressionValue);

			return this._oComboBoxCompression;
		};

		GanttPrinting.prototype._updateInputsStep = function (sUnit) {
			var fStep = 0.1;
			if (sUnit === "mm") {
				fStep = 1;
			}

			return fStep;
		};

		GanttPrinting.prototype._createMargin = function (bSinglePage) {
			this._oMargin = new InvisibleText({
				text: this._oRb.getText("GNT_PRNTG_MARGIN")
			});
			this._oMargin.toStatic();
			this._oMarginTop = new InvisibleText({
				text: this._oRb.getText("GNT_PRNTG_MARGIN_TOP")
			});
			this._oMarginTop.toStatic();
			this._oMarginLeft = new InvisibleText({
				text: this._oRb.getText("GNT_PRNTG_MARGIN_LEFT")
			});
			this._oMarginLeft.toStatic();
			this._oMarginBottom = new InvisibleText({
				text: this._oRb.getText("GNT_PRNTG_MARGIN_BOTTOM")
			});
			this._oMarginBottom.toStatic();
			this._oMarginRight = new InvisibleText({
				text: this._oRb.getText("GNT_PRNTG_MARGIN_RIGHT")
			});
			this._oMarginRight.toStatic();

			function setMaxMargin(fPaperSize) {
				var sUnit = this._oModel.getProperty("/unit");
				// max margin is 33.3% of paper size
				return Math.round(PrintUtils._convertPxToUnit(fPaperSize / 3,sUnit));
			}
			// eslint-disable-next-line no-return-assign
			return [
				new Label({
					text: this._oRb.getText("GNT_PRNTG_MARGIN"),
					showColon: true
				}),
				this._oMarginComboBox = new ComboBox({
					change: this._onChangeMarginComboBox.bind(this, bSinglePage),
					selectedKey: "{setting>/marginType}",
					ariaLabelledBy: this._oMargin,
					items: [
						new Item({
							key: "default",
							text: this._oRb.getText("GNT_PRNTG_MARGIN_DEFAULT")
						}),
						new Item({
							key: "none",
							text: this._oRb.getText("GNT_PRNTG_MARGIN_NONE")
						}),
						new Item({
							key: "custom",
							text: this._oRb.getText("GNT_PRNTG_MARGIN_CUSTOM")
						})
					]
				}),
				new FlexBox({
					renderType: "Bare",
					alignItems: "Center",
					visible: {
						path: "setting>/marginType",
						formatter: function (sMarginType) {
							return sMarginType === "custom";
						}
					},
					items: [
						new FlexBox({
							direction: FlexDirection.Column,
							layoutData: new FlexItemData({
								shrinkFactor: 0,
								growFactor: 0,
								baseSize: "8rem"
							}),
							items: [
								new Label({
									text: this._oRb.getText("GNT_PRNTG_MARGIN_TOP"),
									showColon: true
								}),
								this._oInputMarginTop = new StepInput({
									min: 0,
									step: {
										path: "setting>/unit",
										formatter: this._updateInputsStep
									},
									displayValuePrecision: 1,
									change: this._onChangeMarginInput.bind(this, bSinglePage),
									value: PrintUtils._convertPxToUnit(this._oModel.getProperty("/marginTop"),this._oModel.getProperty("/unit")),
									fieldWidth: "7rem",
									validationMode: "LiveChange",
									valueStateText: this._oRb.getText("GNT_PRNTG_MARGIN_HEIGHT_ERROR"),
									max: {
										parts: [
											{path: "setting>/paperHeight"},
											{path: "setting>/unit"}
										],
										formatter: setMaxMargin.bind(this)
									},
									description: "{setting>/unit}",
									ariaLabelledBy: this._oMarginTop
								}).addStyleClass("sapGanttPrintingBottomMargin"),
								new Label({
									text: this._oRb.getText("GNT_PRNTG_MARGIN_LEFT"),
									showColon: true
								}),
								this._oInputMarginLeft = new StepInput({
									min: 0,
									step: {
										path: "setting>/unit",
										formatter: this._updateInputsStep
									},
									displayValuePrecision: 1,
									change: this._onChangeMarginInput.bind(this, bSinglePage),
									value: PrintUtils._convertPxToUnit(this._oModel.getProperty("/marginLeft"),this._oModel.getProperty("/unit")),
									fieldWidth: "7rem",
									validationMode: "LiveChange",
									valueStateText: this._oRb.getText("GNT_PRNTG_MARGIN_WIDTH_ERROR"),
									max: {
										parts: [
											{path: "setting>/paperWidth"},
											{path: "setting>/unit"}
										],
										formatter: setMaxMargin.bind(this)
									},
									description: "{setting>/unit}",
									ariaLabelledBy: this._oMarginLeft
								})
							]
						}),
						new FlexBox({
							direction: FlexDirection.Column,
							layoutData: new FlexItemData({
								shrinkFactor: 0,
								growFactor: 0,
								baseSize: "8rem"
							}),
							items: [
								new Label({
									text: this._oRb.getText("GNT_PRNTG_MARGIN_BOTTOM"),
									showColon: true
								}),
								this._oInputMarginBottom = new StepInput({
									min: 0,
									step: {
										path: "setting>/unit",
										formatter: this._updateInputsStep
									},
									displayValuePrecision: 1,
									change: this._onChangeMarginInput.bind(this, bSinglePage),
									value: PrintUtils._convertPxToUnit(this._oModel.getProperty("/marginBottom"),this._oModel.getProperty("/unit")),
									fieldWidth: "7rem",
									validationMode: "LiveChange",
									valueStateText: this._oRb.getText("GNT_PRNTG_MARGIN_HEIGHT_ERROR"),
									max: {
										parts: [
											{path: "setting>/paperHeight"},
											{path: "setting>/unit"}
										],
										formatter: setMaxMargin.bind(this)
									},
									description: "{setting>/unit}",
									ariaLabelledBy : this._oMarginBottom
								}).addStyleClass("sapGanttPrintingBottomMargin"),
								new Label({
									text: this._oRb.getText("GNT_PRNTG_MARGIN_RIGHT"),
									showColon: true
								}),
								this._oInputMarginRight = new StepInput({
									min: 0,
									step: {
										path: "setting>/unit",
										formatter: this._updateInputsStep
									},
									displayValuePrecision: 1,
									change: this._onChangeMarginInput.bind(this, bSinglePage),
									value: PrintUtils._convertPxToUnit(this._oModel.getProperty("/marginRight"),this._oModel.getProperty("/unit")),
									fieldWidth: "7rem",
									validationMode: "LiveChange",
									valueStateText: this._oRb.getText("GNT_PRNTG_MARGIN_WIDTH_ERROR"),
									max: {
										parts: [
											{path: "setting>/paperWidth"},
											{path: "setting>/unit"}
										],
										formatter: setMaxMargin.bind(this)
									},
									description: "{setting>/unit}",
									ariaLabelledBy: this._oMarginRight
								})
							]
						}).addStyleClass("sapGanttPrintingLeftMargin"),
						new Button({
							icon: {
								path: "setting>/marginLocked",
								formatter: function (bMarginLocked) {
									if (bMarginLocked) {
										return "sap-icon://chain-link";
									}
									return "sap-icon://broken-link";
								}
							},
							press: function () {
								var bMarginLocked = this._oModel.getProperty("/marginLocked");
								this._oModel.setProperty("/marginLocked", !bMarginLocked);
							}.bind(this),
							type: "Transparent"
						}).addStyleClass("sapGanttPrintingLockButton sapGanttPrintingLeftMargin")
					]
				}).addStyleClass("sapGanttPrintingTopMargin sapGanttPrintingTopMargin")
			];
		};

		GanttPrinting.prototype._createCropMarks = function () {
			// eslint-disable-next-line no-return-assign
			return [
				new Switch({
					state: "{setting>/cropMarks}"
				}),
				new FlexBox({
					renderType: "Bare",
					visible: "{setting>/cropMarks}",
					items: [
						new FlexBox({
							direction: FlexDirection.Column,
							layoutData: new FlexItemData({
								shrinkFactor: 0,
								growFactor: 0,
								baseSize: "8rem"
							}),
							items: [
								new Label({text: "Weight:"}),
								new StepInput({
									min: 0,
									step: 0.05,
									displayValuePrecision: 2,
									value: "{setting>/cropMarksWeight}",
									fieldWidth: "7rem",
									description: "pt"
								})
							]
						}),
						new FlexBox({
							direction: FlexDirection.Column,
							layoutData: new FlexItemData({
								shrinkFactor: 0,
								growFactor: 0,
								baseSize: "8rem"
							}),
							items: [
								new Label({text: "Offset:"}),
								this._oInputCropMarksOffset = new StepInput({
									min: 0,
									step: {
										path: "setting>/unit",
										formatter: this._updateInputsStep
									},
									displayValuePrecision: 1,
									change: this._onChangeCropMarksInput.bind(this),
									value: PrintUtils._convertPxToUnit(this._oModel.getProperty("/cropMarksOffset"),this._oModel.getProperty("/unit")),
									fieldWidth: "7rem",
									description: "{setting>/unit}"
								})
							]
						}).addStyleClass("sapGanttPrintingLeftMargin")
					]
				}).addStyleClass("sapGanttPrintingTopMargin")
			];
		};

		GanttPrinting.prototype._createCompression = function () {
			// radio button group init
			var bExportAsJPEG = this._oModel.getProperty("/exportAsJPEG");
			this._oCompressExportType = new InvisibleText({
				text: this._oRb.getText("GNT_PRNTG_EXPORT_TYPES")
			});
			this._oCompressExportType.toStatic();
			this._oCompressQuality = new InvisibleText({
				text: this._oRb.getText("GNT_PRNTG_COMPRESSION_QUALITY")
			});
			this._oCompressQuality.toStatic();
			// eslint-disable-next-line no-return-assign
			return [
				new Label({
					text: this._oRb.getText("GNT_PRNTG_EXPORT_TYPES"),
					showColon: true
				}),
				this._oCompressExportTypeRadio = new RadioButtonGroup({
					columns: 2,
					selectedIndex: bExportAsJPEG ? 0 : 1,
					buttons: [
						new RadioButton({
							id: "jpeg",
							text: "JPEG",
							selected: "{setting>/exportAsJPEG}",
							ariaLabelledBy : this._oCompressExportType
						}),
						new RadioButton({
							id: "png",
							text: "PNG",
							ariaLabelledBy : this._oCompressExportType
						})
					]
				}).addStyleClass("sapGanttPrintingBottomMargin"),
				new Label({
					text: this._oRb.getText("GNT_PRNTG_COMPRESSION_QUALITY"),
					visible: "{setting>/exportAsJPEG}",
					showColon: true
				}),
				this._createCompressionComboBox().addAriaLabelledBy(this._oCompressQuality),
				this._createCompressionSlider().addAriaLabelledBy(this._oCompressQuality).addStyleClass("sapGanttPrintingTopMargin sapGanttPrintingBottomMargin"),
				new MessageStrip({
					text: this._oRb.getText("GNT_PRNTG_COMPRESSION_PNG_WARNING"),
					showIcon: true,
					type: "Warning",
					visible: {
						path: "setting>/exportAsJPEG",
						type: new Boolean(),
						formatter: function (bExportAsJPEG) {
							return !bExportAsJPEG;
						}
					}
				}).addStyleClass("sapGanttPrintingBottomMargin")
			];
		};

		GanttPrinting.prototype._createOptionsForm = function () {
			this._oOrientationLabell = new InvisibleText({
				text: this._oRb.getText("GNT_PRNTG_ORIENTATION")
			});
			this._oExportType = new InvisibleText({
				text: this._oRb.getText("GNT_PRNTG_EXPORT_TYPES")
			});
			this._oPaperSizeLabel = new InvisibleText({
				text: this._oRb.getText("GNT_PRNTG_PAPER_SIZE")
			});
			this._oDurationComboLabel = new InvisibleText({
				text: this._oRb.getText("GNT_PRNTG_DURATION")
			});
			this._oScaleLabel = new InvisibleText({
				text: this._oRb.getText("GNT_PRNTG_SCALE")
			});
			this._oOrientationLabell.toStatic();
			this._oExportType.toStatic();
			this._oPaperSizeLabel.toStatic();
			this._oDurationComboLabel.toStatic();
			this._oScaleLabel.toStatic();
			// eslint-disable-next-line no-return-assign
			return new FlexBox({
				renderType: "Bare",
				direction: FlexDirection.Column,
				items: [
					new Label({
						text: this._oRb.getText("GNT_PRNTG_EXPORT_TYPES"),
						showColon: true
					}),
					this._radioGroupPage = new RadioButtonGroup({
						columns: 2,
						selectedIndex: this._oModel.getProperty("/multiplePage") ? 0 : 1,
						select: this._onChangeExportTypes.bind(this),
						buttons: [
							new RadioButton({
								id: "Multiple",
								text: this._oRb.getText("GNT_PRNTG_MULTIPLE_PAGE"),
								selected: "{setting>/multiplePage}",
								ariaLabelledBy: this._oExportType
							}),
							new RadioButton({
								id: "Single",
								text: this._oRb.getText("GNT_PRNTG_SINGLE_PAGE"),
								ariaLabelledBy: this._oExportType
							})
						]
					}).addStyleClass("sapGanttPrintingBottomMargin"),
					new Label({
						text: this._oRb.getText("GNT_PRNTG_ORIENTATION"),
						showColon: true
					}),
					this._radioGroupOrientation = new RadioButtonGroup({
						columns: 2,
						selectedIndex: this._oModel.getProperty("/portrait") ? 0 : 1,
						select: this._onChangeOrientation.bind(this, false),
						buttons: [
							new RadioButton({
								id: "Portrait",
								text: this._oRb.getText("GNT_PRNTG_PORTRAIT"),
								selected: "{setting>/portrait}",
								ariaLabelledBy: this._oOrientationLabell
							}),
							new RadioButton({
								id: "Landscape",
								text: this._oRb.getText("GNT_PRNTG_LANDSCAPE"),
								ariaLabelledBy: this._oOrientationLabell
							})
						]
					}).addStyleClass("sapGanttPrintingBottomMargin"),

					new MessageStrip({
						text: "{setting>/orientationMessage}",
						type: "Information",
						showIcon: true,
						visible: "{setting>/showOrientationMessage}"
					}).addStyleClass("sapGanttPrintingSinglePageMessage"),

					new Label({
						text: this._oRb.getText("GNT_PRNTG_PAPER_SIZE"),
						showColon: true
					}),
					this._createPaperComboBox(false).addAriaLabelledBy(this._oPaperSizeLabel).addStyleClass("sapGanttPrintingBottomMargin"),
					this._createPaperSizeFields(false).addStyleClass("sapGanttPrintingBottomMargin"),

					new MessageStrip({
						text: this._oRb.getText("GNT_PRNTG_SINGLE_PAGE_QUALITY"),
						type: "Information",
						showIcon: true,
						visible: "{setting>/qualityWarning}"
					}).addStyleClass("sapGanttPrintingSinglePageMessage"),

					new Label({
						text: this._oRb.getText("GNT_PRNTG_DURATION"),
						showColon: true
					}),
					this._createDurationComboBox(false).addAriaLabelledBy(this._oDurationComboLabel).addStyleClass("sapGanttPrintingBottomMargin"),
					this._createDatePicker(false).addStyleClass("sapGanttPrintingBottomMargin"),

					new Label({
						text: this._oRb.getText("GNT_PRNTG_SCALE"),
						visible: "{setting>/multiplePage}",
						showColon: true
					}),
					this._createScale().addAriaLabelledBy(this._oScaleLabel).addStyleClass("sapGanttPrintingBottomMargin"),

					new Label({
						text: this._oRb.getText("GNT_PRNTG_PAGE_RANGE"),
						visible: "{setting>/multiplePage}",
						showColon: true
					}),
					this._createPageRange().addStyleClass("sapGanttPrintingBottomMargin"),

					// TODO add this feature
					// this._createLabelWithSwitch(this._oRb.getText("GNT_PRNTG_REPEAT_TABLE"), "{setting>/repeatSelectionPanel}").addStyleClass("sapGanttPrintingBottomMargin"),
					// new MessageStrip({
					// 	text: "The table cannot occupy more than 50% of its width on the format. Please change Gantt chart settings - shrink table width.",
					// 	showIcon: true,
					// 	type: "Error",
					// 	visible: false
					// }).addStyleClass("sapGanttPrintingBottomMargin"),

					new Label({
						text: this._oRb.getText("GNT_PRNTG_HEADER_AND_FOOTER"),
						showColon: true
					}),
					this._createCheckBoxWithInput(this._oRb.getText("GNT_PRNTG_HEADER"), "{setting>/showHeaderText}", "{setting>/headerText}"),
					this._createCheckBoxWithInput(this._oRb.getText("GNT_PRNTG_FOOTER"), "{setting>/showFooterText}", "{setting>/footerText}").addStyleClass("sapGanttPrintingBottomMargin"),

					this._createLabelWithSwitch(this._oRb.getText("GNT_PRNTG_SHOW_PAGE_NUMBER"), "{setting>/showPageNumber}").addStyleClass("sapGanttPrintingBottomMargin"),

					this._createPanel(this._oRb.getText("GNT_PRNTG_MARGIN"), this._createMargin(false)),
					// TODO add crop marks feature
					// this._createPanel("Crop marks", this._createCropMarks()),
					this._createPanel(this._oRb.getText("GNT_PRNTG_COMPRESSION"), this._createCompression())
				]
			});
		};

		GanttPrinting.prototype._createSinglePageForm = function () {
			 this._oOrientationLabel = new InvisibleText({
				text: this._oRb.getText("GNT_PRNTG_ORIENTATION")
			});
			this._oPaperSizeLabel = new InvisibleText({
				text: this._oRb.getText("GNT_PRNTG_PAPER_SIZE")
			});
			this._oDurationComboLabel = new InvisibleText({
				text: this._oRb.getText("GNT_PRNTG_DURATION")
			});
			this._oOrientationLabel.toStatic();
			this._oDurationComboLabel.toStatic();
			this._oPaperSizeLabel.toStatic();
			// eslint-disable-next-line no-return-assign
			return new FlexBox({
				renderType: "Bare",
				direction: FlexDirection.Column,
				items: [
					new Label({
						text: this._oRb.getText("GNT_PRNTG_ORIENTATION"),
						showColon: true
					}),
					this._radioGroupOrientation = new RadioButtonGroup({
						columns: 2,
						selectedIndex: this._oModel.getProperty("/portrait") ? 0 : 1,
						select: this._onChangeOrientation.bind(this, true),
						buttons: [
							new RadioButton({
								id: "Portrait",
								text: this._oRb.getText("GNT_PRNTG_PORTRAIT"),
								selected: "{setting>/portrait}",
								ariaLabelledBy: this._oOrientationLabel
							}),
							new RadioButton({
								id: "Landscape",
								text: this._oRb.getText("GNT_PRNTG_LANDSCAPE"),
								ariaLabelledBy: this._oOrientationLabel
							})
						]
					}).addStyleClass("sapGanttPrintingBottomMargin"),

					new Label({
						text: this._oRb.getText("GNT_PRNTG_PAPER_SIZE"),
						showColon: true
					}),
					this._createPaperComboBox(true).addStyleClass("sapGanttPrintingBottomMargin").addAriaLabelledBy(this._oPaperSizeLabel),
					this._createPaperSizeFields(true).addStyleClass("sapGanttPrintingBottomMargin"),

					new Label({
						text: this._oRb.getText("GNT_PRNTG_DURATION"),
						showColon: true
					}),
					this._createDurationComboBox(true).addAriaLabelledBy(this._oDurationComboLabel).addStyleClass("sapGanttPrintingBottomMargin"),
					this._createDatePicker(true).addStyleClass("sapGanttPrintingBottomMargin"),

					new Label({
						text: this._oRb.getText("GNT_PRNTG_HEADER_AND_FOOTER"),
						showColon: true
					}),
					this._createCheckBoxWithInput(this._oRb.getText("GNT_PRNTG_HEADER"), "{setting>/showHeaderText}", "{setting>/headerText}", true),
					this._createCheckBoxWithInput(this._oRb.getText("GNT_PRNTG_FOOTER"), "{setting>/showFooterText}", "{setting>/footerText}", true).addStyleClass("sapGanttPrintingBottomMargin"),

					this._createPanel(this._oRb.getText("GNT_PRNTG_MARGIN"), this._createMargin(true))
				]
			});
		};

		GanttPrinting.prototype._createDialogContent = function (bSinglePage) {
			var oDialogContent;
			if (bSinglePage) {
				oDialogContent = new FlexBox({
					renderType: "Bare",
					fitContainer: true,
					items: [
						this._oFlexBoxPreview = new FlexBox({
							renderType: "Bare",
							layoutData: new FlexItemData({
								shrinkFactor: 1,
								growFactor: 1,
								baseSize: "auto"
							}),
							direction: FlexDirection.Column,
							items: [
								new FlexBox({
									renderType: "Bare",
									layoutData: new FlexItemData({
										shrinkFactor: 0,
										growFactor: 0,
										baseSize: "3.5rem"
									})
								}),
								this._oPdfDialogPreview = new HTML({
									content: "<div class=\"sapGanttPdfPreviewContentDiv\"><div id=\"sapGanttPdfPreviewDiv\"class=\"sapGanttPdfPreviewPageDiv\"></div></div>"
								})
							]
						}).addStyleClass("sapGanttPrintingPreviewContent"),
						new ScrollContainer({
							horizontal: false,
							vertical: true,
							layoutData: new FlexItemData({
								shrinkFactor: 0,
								growFactor: 0,
								baseSize: "27rem"
							}),
							content: [
								this._createSinglePageForm().addStyleClass("sapGanttPrintingDialogSettings")
							]
						})
					]
				});
			} else {
				oDialogContent = new FlexBox({
					renderType: "Bare",
					fitContainer: true,
					items: [
						this._oFlexBoxPreview = new FlexBox({
							renderType: "Bare",
							layoutData: new FlexItemData({
								shrinkFactor: 1,
								growFactor: 1,
								baseSize: "auto"
							}),
							direction: FlexDirection.Column,
							items: [
								new FlexBox({
									renderType: "Bare",
									layoutData: new FlexItemData({
										shrinkFactor: 0,
										growFactor: 0,
										baseSize: "3.5rem"
									})
								}),
								this._oHTMLDialogPreview = new HTML({
									content: "<div class=\"sapGanttPrintingPreviewContentDiv\"><div class=\"sapGanttPrintingPreviewPageDiv\"></div></div>"
								}),
								new FlexBox({
									renderType: "Bare",
									justifyContent: "Center",
									alignItems: "Center",
									layoutData: new FlexItemData({
										shrinkFactor: 0,
										growFactor: 0,
										baseSize: "6rem"
									}),
									items: [
										this._oButtonFirst = new Button({
											icon: "sap-icon://close-command-field",
											visible: "{setting>/multiplePage}",
											press: this._onPressButtonFirst.bind(this),
											type: "Transparent",
											tooltip: this._oRb.getText("GNT_PRNTG_FIRST_PAGE_BUTTON")
										}).addStyleClass("sapGanttPrintingPreviewIconMarginRight"),
										this._oButtonPrevious = new Button({
											icon: "sap-icon://navigation-left-arrow",
											visible: "{setting>/multiplePage}",
											press: this._onPressButtonPrevious.bind(this),
											type: "Transparent",
											tooltip: this._oRb.getText("GNT_PRNTG_PREVIOUS_PAGE_BUTTON")
										}),
										new Text({
											textAlign: "Center",
											visible: "{setting>/multiplePage}",
											width: "7.25rem",
											text: {
												parts: [
													{path: "setting>/previewPageNumber"},
													{path: "setting>/lastPageNumber"}
												],
												formatter: function (iPageNumber, iLastPageNumber) {
													return iLastPageNumber ? this._oRb.getText("GNT_PRNTG_OF", [iPageNumber, iLastPageNumber]) : iPageNumber.toString();
												}.bind(this)
											}
										}).addStyleClass("sapGanttPrintingPreviewText"),
										this._oButtonNext = new Button({
											icon: "sap-icon://navigation-right-arrow",
											visible: "{setting>/multiplePage}",
											press: this._onPressButtonNext.bind(this),
											type: "Transparent",
											tooltip: this._oRb.getText("GNT_PRNTG_NEXT_PAGE_BUTTON")
										}).addStyleClass("sapGanttPrintingPreviewIconMarginRight"),
										this._oButtonLast = new Button({
											icon: "sap-icon://open-command-field",
											visible: "{setting>/multiplePage}",
											press: this._onPressButtonLast.bind(this),
											type: "Transparent",
											tooltip: this._oRb.getText("GNT_PRNTG_LAST_PAGE_BUTTON")
										})
									]
								}).addStyleClass("sapGanttPrintingPreviewFooter")
							]
						}).addStyleClass("sapGanttPrintingPreviewContent"),
						new ScrollContainer({
							horizontal: false,
							vertical: true,
							layoutData: new FlexItemData({
								shrinkFactor: 0,
								growFactor: 0,
								baseSize: "27rem"
							}),
							content: [
								this._createOptionsForm().addStyleClass("sapGanttPrintingDialogSettings")
							]
						})
					]
				});

				this._updatePageNumberButtons();
			}
			return oDialogContent;
		};
		/**
		 * Gets the print configuration class with the configuration data.
		 * @since 1.127
		 * @public
		 * @returns {sap.gantt.simple.PrintConfig} Print configuration class instance with print configuration data
		 */
		GanttPrinting.prototype.getPrintData = function(){
			var oConfigData = Object.assign({}, this._oModel.getData());
			var sUnit = this._oModel.getProperty("/unit");
			var objPrintConfigClass = new PrintConfig({
				pageConfig: {
					paperHeight: PrintUtils._convertPxToUnit(oConfigData.paperHeight,sUnit),
					paperWidth: PrintUtils._convertPxToUnit(oConfigData.paperWidth,sUnit),
					paperSize: oConfigData.paperSize,
					unit: oConfigData.unit,
					portrait: oConfigData.portrait,
					showPageNumber: oConfigData.showPageNumber
				},
				textConfig: {
					showHeaderText: oConfigData.showHeaderText,
					showFooterText: oConfigData.showFooterText,
					headerText: oConfigData.headerText,
					footerText: oConfigData.footerText
				},
				marginConfig: {
					marginLeft: PrintUtils._convertPxToUnit(oConfigData.marginLeft,sUnit),
					marginBottom: PrintUtils._convertPxToUnit(oConfigData.marginBottom,sUnit),
					marginRight: PrintUtils._convertPxToUnit(oConfigData.marginRight,sUnit),
					marginTop: PrintUtils._convertPxToUnit(oConfigData.marginTop,sUnit),
					marginLocked: oConfigData.marginLocked,
					marginType: oConfigData.marginType
				},
				durationConfig: {
					duration: oConfigData.duration,
					startDate: oConfigData.startDate,
					endDate: oConfigData.endDate
				},
				exportConfig: {
					exportAsJPEG: oConfigData.exportAsJPEG,
					exportRange: oConfigData.exportRange,
					exportAll: oConfigData.exportAll,
					compressionQuality: oConfigData.compressionQuality,
					scale: oConfigData.scale,
					multiplePage: oConfigData.multiplePage
				}
			});
			return objPrintConfigClass;
		};
		/**
		 * Sets the print configuration data.
		 * @since 1.127
		 * @public
		 * @param {sap.gantt.simple.PrintConfig} objClass configuration class instance with print configuration data.
		 */
		GanttPrinting.prototype.setPrintData = function(objClass){
			if (objClass){
				this._updateModel(objClass);
			} else {
				throw new Error("Invalid print config data is set");
			}
		};

		/**
		 * Updates the model with the provided print configuration data class.
		 * @param {sap.gantt.simple.PrintConfig} objClass configuration class instance with print configuration data.
		 * @private
		 */
		GanttPrinting.prototype._updateModel = function (objClass) {
			this._oModel = new JSONModel({
				...this.oInitialValues,
				...(objClass._getPageConfig() || {}),
				...(objClass._getTextConfig() || {}),
				...(objClass._getMarginConfig() || {}),
				...(objClass._getDurationConfig() || {}),
				...(objClass._getExportConfig() || {})
			});
			["paperHeight", "paperWidth", "marginTop", "marginLeft", "marginBottom", "marginRight"].forEach(function(property){
				this._oModel.setProperty(`/${property}`, PrintUtils._convertUnitToPx(this._oModel.getProperty(`/${property}`),this._oModel.getProperty("/unit")));
			}.bind(this));
		};

		GanttPrinting.prototype._createAndOpenDialog = function (bSinglePage,printDialogTemplate) {
			var footerButtonsArray;
			var ganttContainer = this._getOriginalGanttChart().getParent();
			if (ganttContainer && ganttContainer.isA("sap.gantt.simple.GanttChartContainer")){
				if (ganttContainer.getEnableVariantManagement()){
					this._onLoadValues = this.getPrintData();
					this._oButtonSave = new Button({
							text: "Save",
							press: function (oEvent) {
								this._savePreset(oEvent,bSinglePage);
							}.bind(this)
						});
						if (ganttContainer._variantData){
							var data = bSinglePage ?  ganttContainer._variantData.svgPage : ganttContainer._variantData.canvasPage;
							if (data) {
								this.setPrintData(data);
							}
						}
					footerButtonsArray = [this._oButtonSave];
				} else {
					footerButtonsArray = printDialogTemplate && printDialogTemplate.getFooterButtons() || [];
				}
			}

			var buttonsArray = footerButtonsArray && footerButtonsArray.map(function(button){
				return button.clone();
			});
			var fnExport = bSinglePage ? this.exportSinglePage : this.export;
			this._oDialog = new Dialog({
				title: this._oRb.getText("GNT_PRNTG_PDF_EXPORT_TITLE"),
				contentWidth: "100%",
				contentHeight: "100%",
				horizontalScrolling: false,
				verticalScrolling: false,
				content: [
					this._createDialogContent(bSinglePage)
				],
				buttons: [
					this._footerButtons = buttonsArray,
					this._oButtonExport = new Button({
						text: this._oRb.getText("GNT_PRNTG_EXPORT"),
						type: MobileLibrary.ButtonType.Emphasized,
						press: fnExport.bind(this)
					}),
					this._oButtonClose = new Button({
						text: this._oRb.getText("GNT_PRNTG_CANCEL"),
						press: function () {
							this.close();
						}.bind(this)
					})
				]
			}).addStyleClass("sapGanttPrintingDialog");

			this._oDialog.onsapescape = function (oEvent) {
				this.close();
				oEvent.preventDefault();
				oEvent.stopPropagation();
			}.bind(this);
			this._oDialog.setModel(this._oModel, "setting");
			this._oDialog.open();

			this._sResizeHandlerId = ResizeHandler.register(this._oDialog, this._onResize.bind(this));
		};

		/**
		 * Create and open progress indicator dialog.
		 *
		 * @private
		 */
		GanttPrinting.prototype._openProgressDialog = function () {
			this._oProgressIndicator = new ProgressIndicator({
				state: "Information",
				percentValue: 0
			});

			this._oProgressText = new Text({
				text: this._oRb.getText("GNT_PRNTG_PDF_PREVIEW"),
				textAlign: "Center"
			}).addStyleClass("sapGanttPrintingProgressText");

			this._oProgressIndicatorBox = new FlexBox(this.getId() + "-progressFlexBox", {
				direction: "Column",
				alignItems: "Center",
				items: [this._oProgressText, this._oProgressIndicator],
				renderType: "Bare"
			}).addStyleClass("sapGanttPrintingProgressBox");

			this._oProgressDialog = new Dialog(this.getId() + "-progressDialog", {
				contentWidth: "25%",
				showHeader: false,
				content: [this._oProgressIndicatorBox],
				buttons: [
					new Button({
						text: this._oRb.getText("GNT_PRNTG_CANCEL"),
						press: function () {
							this._closeProgressIndicator();
						}.bind(this)
					})
				]
			});
			this._oProgressDialog.open();
		};

		return GanttPrinting;
	});
