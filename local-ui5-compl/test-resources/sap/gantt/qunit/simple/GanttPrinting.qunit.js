/* global QUnit, sinon*/

sap.ui.define([
	"sap/gantt/misc/Format",
	"sap/gantt/simple/GanttRowSettings",
	"sap/gantt/test/simple/SteppedTask",
	"sap/gantt/simple/ContainerToolbar",
	"sap/gantt/simple/GanttPrinting",
	"sap/gantt/simple/test/GanttQUnitUtils",
	"sap/ui/core/Core",
	"sap/ui/test/actions/Press",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/Sorter",
	"sap/gantt/simple/BaseRectangle",
	"sap/gantt/def/pattern/SlashPattern",
	"sap/gantt/def/pattern/BackSlashPattern",
	"sap/gantt/def/SvgDefs",
	"sap/gantt/simple/GanttChartContainer",
	"sap/gantt/def/gradient/LinearGradient",
	"sap/gantt/def/gradient/Stop",
	"sap/gantt/simple/Relationship",
	"sap/gantt/utils/GanttChartConfigurationUtils",
	"sap/ui/core/Lib",
	"sap/gantt/simple/test/nextUIUpdate",
	"sap/gantt/simple/PrintDialogTemplate",
	"sap/gantt/simple/PrintUtils",
	"sap/m/Button",
	"sap/gantt/simple/PrintConfig"
],  function (Format, GanttRowSettings, SteppedTask, ContainerToolbar, GanttPrinting, utils, Core, Press, Filter, FilterOperator, Sorter, BaseRectangle, SlashPattern, BackSlashPattern, SvgDefs, GanttChartContainer, LinearGradient, Stop, Relationship, GanttChartConfigurationUtils, Lib,
	nextUIUpdate,PrintDialogTemplate,PrintUtils,Button,PrintConfig) {
	"use strict";


	var oRb = Lib.getResourceBundleFor("sap.gantt");

	QUnit.module("Basic", {
		beforeEach: function () {
			this.sut = new GanttPrinting();
		},
		afterEach: function () {
			this.sut.destroy();
		}
	});

	QUnit.test("Default dialog options", function (assert) {
		var _oPaperSizes = PrintUtils._getPaperConfiguarations();
		assert.deepEqual(this.sut._oModel.getData(), {
			"compressionQuality": 75,
			"cropMarks": false,
			"cropMarksOffset": 11.34,
			"cropMarksWeight": 0.25,
			"duration": "all",
			"endDate": this.sut._oModel.getProperty("/endDate"),
			"exportAll": true,
			"exportAsJPEG": true,
			"exportRange": "",
			"footerText": "",
			"headerText": "",
			"lastPageNumber": undefined,
			"marginBottom": 18.9,
			"marginLeft": 18.9,
			"marginLocked": false,
			"marginRight": 18.9,
			"marginTop": 18.9,
			"marginType": "default",
			"multiplePage": true,
			"orientationMessage": oRb.getText("GNT_PRNTG_SINGLE_PAGE_LANDSCAPE"),
			"paperHeight": _oPaperSizes.A4.height,
			"paperSize": "A4",
			"paperWidth": _oPaperSizes.A4.width,
			"portrait": true,
			"previewPageNumber": 1,
			"qualityWarning": false,
			"repeatSelectionPanel": false,
			"scale": 100,
			"showFooterText": false,
			"showHeaderText": false,
			"showOrientationMessage": false,
			"showPageNumber": false,
			"startDate": this.sut._oModel.getProperty("/startDate"),
			"unit": "mm"
		}, "Default dialog options should be correct.");
	});

	QUnit.module("Rendering - Optimised", {
		beforeEach: function () {
			this.oGantt = utils.createGantt(true, null, true);
			this.oGantt.setEnableChartOverflowToolbar(true);

			// limit the total horizon to prevent Gantt being too large
			var oTotalHorizon = this.oGantt.getAxisTimeStrategy().getTotalHorizon();
			var oVisibleHorizon = this.oGantt.getAxisTimeStrategy().getVisibleHorizon();
			var dNewTotalStartTime = Format.abapTimestampToDate(oVisibleHorizon.getStartTime());
			var dNewTotalEndTime = Format.abapTimestampToDate(oVisibleHorizon.getEndTime());
			dNewTotalStartTime.setDate(dNewTotalStartTime.getDate() - 15);
			dNewTotalEndTime.setDate(dNewTotalEndTime.getDate() + 15);

			oTotalHorizon.setStartTime(dNewTotalStartTime);
			oTotalHorizon.setEndTime(dNewTotalEndTime);

			// set fixed width to prevent different Gantt rendering on different window size
			document.getElementById("qunit-fixture").style.width = "1920px";
			this.oGantt.placeAt("qunit-fixture");
		},
		afterEach: function () {
			utils.destroyGantt();
		}
	});

	QUnit.test("PDF Export dialog - open and change duration after error screen", function (assert) {
		var fnDone = assert.async();
		return utils.waitForGanttRendered(this.oGantt).then(function () {
				this.oGantt.getAxisTimeStrategy().setZoomLevel(4);
				return utils.waitForGanttRendered(this.oGantt).then(function () {
						this.sut = new GanttPrinting({
							ganttChart: this.oGantt
						});
						return this.sut.open().then(async function () {
								await nextUIUpdate();
								var oTimelineOption  = this.sut._ganttChartClone.getAxisTimeStrategy().getTimeLineOption().innerInterval.unit;
								assert.strictEqual(this.sut._oClonedGanttDiv.id, "","id is not set in error screen scenario");
								// change the Duration option to the Next Week
								var fnPress = new Press();
								fnPress.executeOn(this.sut._oComboBoxDuration);
								fnPress.executeOn(this.sut._oComboBoxDuration._getList().getItems()[1]); // Next Week

								return utils.waitForGanttRendered(this.sut._ganttChartClone).then(function () {
									return new Promise(function (fnResolve) {
										// wait for the busy indicator of the canvas preview
										var iIntervalId = setInterval(function () {
											if (!this.sut._oFlexBoxPreview.getBusy()) {
												clearInterval(iIntervalId);
												fnResolve();
											}
										}.bind(this), 100);
									}.bind(this)).then(function () {
										assert.strictEqual(
										this.sut._ganttChartClone.getAxisTimeStrategy().getTimeLineOption().innerInterval.unit,oTimelineOption,
										"The timeLine option should remain the same after setting duration to 1 week."
										);
										resetGanttPrinting(this.sut);
										fnDone();
									}.bind(this));
								}.bind(this));
						}.bind(this));
				}.bind(this));
		}.bind(this));
	});

	QUnit.test("PDF Export dialog - open and change duration", function (assert) {
		var fnDone = assert.async();
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			setTimeout(function() {
				this.oGantt.getTable().expandToLevel(1);
				return utils.waitForGanttRendered(this.oGantt).then(function () {
					setTimeout(function() {
						this.sut = new GanttPrinting({
							ganttChart: this.oGantt
						});
						return this.sut.open().then(function () {
							setTimeout(async function() {
								await nextUIUpdate();
								var oAxisTimeStrategy = this.oGantt.getAxisTimeStrategy();
								var oCloneAxisTimeStrategy = this.sut._ganttChartClone.getAxisTimeStrategy();
								assert.strictEqual(document.getElementById(this.sut._ganttChartClone.getId() + "-ganttHeaderOverflowToolbar"), null, "Cloned gantt chart should not have overflow toolbar");
								assert.strictEqual(oCloneAxisTimeStrategy.getTotalHorizon().getStartTime(), oAxisTimeStrategy.getTotalHorizon().getStartTime(), "Cloned gantt total horizon start time should be same as original gantt total horizon start time");
								assert.strictEqual(oCloneAxisTimeStrategy.getTotalHorizon().getEndTime(), oAxisTimeStrategy.getTotalHorizon().getEndTime(), "Cloned gantt total horizon end time should be same as original gantt total horizon end time");
								assert.strictEqual(oCloneAxisTimeStrategy.getVisibleHorizon().getStartTime(), oAxisTimeStrategy.getTotalHorizon().getStartTime(), "Cloned gantt visible horizon start time should be same as original gantt total horizon start time");
								assert.strictEqual(oCloneAxisTimeStrategy.getVisibleHorizon().getEndTime(), oAxisTimeStrategy.getTotalHorizon().getEndTime(), "Cloned gantt visible horizon end time should be same as original gantt total horizon end time");

								var iCurrentPages = this.sut._getPagesInARow();
								// Assert 1 (Dialog opened and loaded)
								assert.strictEqual(
									this.sut._oDialog.getContent()[0].getItems()[0].getItems()[2].getItems()[2].getText(), "1 of " + iCurrentPages,
									"The text between the page number buttons should be correct."
								);
								assert.ok(
									this.sut._ganttChartClone.getInnerGantt().$("svg").find(".rowBackgrounds").children().length >= 24,
									"Cloned Gantt should have at least 24 rows rendered (8 + 16 expanded)."
								);
								assert.strictEqual(
									this.sut._ganttChartClone.getInnerGantt().$("svg").find(".sapGanttChartShapes").children().length, 24,
									"Cloned Gantt should have 24 shapes rendered."
								);
								assert.strictEqual(
									document.getElementById(this.sut.getId() + "-progressDialog"), null,
									"Progress indicator shouldn't be there for large printing batch size."
								);
								var sTimeLineOptionUnit = this.sut._ganttChartClone.getAxisTimeStrategy().getTimeLineOption().innerInterval.unit;

								// change the Duration option to the Next Week
								var fnPress = new Press();
								fnPress.executeOn(this.sut._oComboBoxDuration);
								fnPress.executeOn(this.sut._oComboBoxDuration._getList().getItems()[1]); // Next Week

								return utils.waitForGanttRendered(this.sut._ganttChartClone).then(function () {
									return new Promise(function (fnResolve) {
										// wait for the busy indicator of the canvas preview
										var iIntervalId = setInterval(function () {
											if (!this.sut._oFlexBoxPreview.getBusy()) {
												clearInterval(iIntervalId);
												fnResolve();
											}
										}.bind(this), 100);
									}.bind(this)).then(function () {
										var iCurrentPages = this.sut._getPagesInARow();
										// Assert 2 (Dialog preview is updated after duration was changed to the Next Week)
										assert.strictEqual(
											this.sut._oDialog.getContent()[0].getItems()[0].getItems()[2].getItems()[2].getText(), "1 of " + iCurrentPages,
											"The text between the page number buttons should be correct after setting duration to the next week."
										);
										assert.ok(
											this.sut._ganttChartClone.getTable().getRows().length >= 24,
											"Cloned Gantt should have at least 24 rows rendered (8 + 16 expanded) after setting duration to the next week."
										);
										assert.strictEqual(
											this.sut._ganttChartClone.getAxisTimeStrategy().getTimeLineOption().innerInterval.unit, sTimeLineOptionUnit,
											"The timeLine option should remain the same after setting duration to 1 week."
										);
										// assert for the number of shapes would be here if someone manages to write it
										resetGanttPrinting(this.sut);
										fnDone();
									}.bind(this));
								}.bind(this));
							}.bind(this), 500);
						}.bind(this));
					}.bind(this), 500);
				}.bind(this));
			}.bind(this), 500);
		}.bind(this));
	});

	QUnit.test("PDF Export - Validate Missing Table Binding", function (assert) {
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			this.printGantt = new GanttPrinting({
				ganttChart: this.oGantt
			});
			this.printGantt._ganttChartClone.getTable().getBindingInfo("rows").binding = null;
			return this.printGantt.open().then(function () {
				var iCurrentPages = this.printGantt._getPagesInARow();
				assert.ok(this.printGantt._ganttChartClone.getTable().getBindingInfo("rows").binding != null, "The binding of the table has been updated accordingly.");
				assert.strictEqual(this.printGantt._oDialog.getContent()[0].getItems()[0].getItems()[2].getItems()[2].getText(), "1 of " + iCurrentPages, "The text between the page number buttons should be correct.");
				assert.strictEqual(this.printGantt._ganttChartClone.getInnerGantt().$("svg").find(".sapGanttChartShapes").children().length, 8, "Cloned Gantt should have 8 shapes rendered.");
				resetGanttPrinting(this.printGantt);
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("PDF Export - Validate Missing Table Binding when Gantt chart is too large", function (assert) {
		// Increase the total horizon to make Gantt chart large
		var oTotalHorizon = this.oGantt.getAxisTimeStrategy().getTotalHorizon();
		var oVisibleHorizon = this.oGantt.getAxisTimeStrategy().getVisibleHorizon();
		var dNewTotalStartTime = Format.abapTimestampToDate(oVisibleHorizon.getStartTime());
		var dNewTotalEndTime = Format.abapTimestampToDate(oVisibleHorizon.getEndTime());
		dNewTotalStartTime.setDate(-7);
		dNewTotalEndTime.setDate(dNewTotalStartTime.getDate() + 700);

		oTotalHorizon.setStartTime(dNewTotalStartTime);
		oTotalHorizon.setEndTime(dNewTotalEndTime);

		return utils.waitForGanttRendered(this.oGantt).then(function () {
			this.printGantt = new GanttPrinting({
				ganttChart: this.oGantt
			});
			this.printGantt._ganttChartClone.getTable().getBindingInfo("rows").binding = null;
			return this.printGantt.open().then(function () {
				assert.ok(this.printGantt._ganttChartClone.getTable().getBindingInfo("rows").binding == null, "The binding of the table should not be added in case of error");
				resetGanttPrinting(this.printGantt);
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("PDF Export - Validate Missing Filter and sorter parameter", function (assert) {
		var oGanttAxisStrategyHorizon = this.oGantt.getAxisTimeStrategy().getTotalHorizon(),
			fromDateFilter = Format.abapTimestampToDate(oGanttAxisStrategyHorizon.getStartTime()),
			toDateFilter = Format.abapTimestampToDate(oGanttAxisStrategyHorizon.getEndTime()),
			oFilter = new Filter({
					path: "StartDate",
					operator: FilterOperator.BT,
					value1: fromDateFilter,
					value2: toDateFilter
			}),
			oSorter = new Sorter("StartDate", true),
			sCustomParams = "$select=MaintenanceOrder,MaintenanceOrderDesc,MaintenanceOrderInternalID,OrderStartDateTime,OrderEndDateTime,ProcessingStatus,ProcessingStatusText,OrderOperationRowLevel,OrderOperationParentRowID,OrderOperationRowID,OrderOperationIsExpanded,MaintOrderRoutingNumber,LatestAcceptableCompletionDate,MainWorkCenter,MaintPriority,MaintPriorityDesc,FunctionalLocationName,FunctionalLocation";
		this.oGantt.getTable().getBinding("rows").filter(oFilter, sap.ui.model.FilterType.Application);
		this.oGantt.getTable().getBinding("rows").sort(oSorter);
		this.oGantt.getTable().getBinding("rows")['sCustomParams'] = sCustomParams;
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			this.printGantt = new GanttPrinting({
				ganttChart: this.oGantt
			});
			this.printGantt._ganttChartClone.getTable().getBindingInfo("rows").binding = null;
			return this.printGantt.open().then(function () {
				var sCustomParamsCloned = this.printGantt._ganttChartClone.getTable().getBindingInfo("rows").binding.sCustomParams;
				assert.deepEqual(sCustomParamsCloned, sCustomParams, "The binding has the correct custom params applied.");
				var oPrintGanttFilter = this.printGantt._ganttChartClone.getTable().getBindingInfo("rows").binding.aApplicationFilters;
				assert.deepEqual(oPrintGanttFilter[0], oFilter, "The binding has the correct filter applied.");
				var oPrintGanttSorter = this.printGantt._ganttChartClone.getTable().getBindingInfo("rows").binding.aSorters[0];
				assert.deepEqual(oPrintGanttSorter, oSorter, "The binding has the correct sorter applied.");
				resetGanttPrinting(this.printGantt);
			}.bind(this));
		}.bind(this));
	});
	QUnit.test("PDF Export - Validate Missing non application Filter parameter", function (assert) {
			var oFilter = [new Filter({
				path: "Name",
				operator: FilterOperator.Contains,
				value1: "Row"
		})];
		this.oGantt.getTable().getBinding("rows").filter(oFilter);
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			this.printGantt = new GanttPrinting({
				ganttChart: this.oGantt
			});
			this.printGantt._ganttChartClone.getTable().getBindingInfo("rows").binding = null;
			return this.printGantt.open().then(function () {
				var oClonnedGanttRowBinding = this.printGantt._ganttChartClone.getTable().getBinding("rows");
				assert.deepEqual(oClonnedGanttRowBinding.aFilters[0], oFilter[0], "The binding has the correct filter applied.");
				resetGanttPrinting(this.printGantt);
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("PDF Export - Validate Scale Level of Gantt Chart", function (assert) {
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			this.printGantt = new GanttPrinting({
				ganttChart: this.oGantt
			});
			return this.printGantt.open().then(function () {
				assert.equal(this.printGantt._oGanttCanvas.width, parseFloat(this.printGantt._oClonedGanttDiv.style.width) * 2, "Canvas Width of html2canvas has been scaled by 2.");
				assert.equal(this.printGantt._oGanttCanvas.height, parseFloat(this.printGantt._oClonedGanttDiv.style.height) * 2, "Canvas Height of html2canvas has been scaled by 2.");
				resetGanttPrinting(this.printGantt);
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("PDF Export - Validate single page messages", function (assert) {
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			// expand all rows
			this.oGantt.getTable().expandToLevel(1);

			return utils.waitForGanttRendered(this.oGantt).then(function () {
				this.sut = new GanttPrinting({
					ganttChart: this.oGantt
				});
				return this.sut.open().then(async function () {
					await nextUIUpdate();
					assert.strictEqual(this.sut._oModel.getProperty("/showOrientationMessage"), false, "No orientation message when multiplePage is selected");
					assert.strictEqual(this.sut._oModel.getProperty("/qualityWarning"), false, "No quality warning message when multiplePage is selected");

					// change to singlePage
					var fnPress = new Press();
					fnPress.executeOn(this.sut._radioGroupPage.getButtons()[1]); // Single Page

					return utils.waitForGanttRendered(this.sut._ganttChartClone).then(function () {
						return new Promise(function (fnResolve) {
							// wait for the busy indicator of the canvas preview
							var iIntervalId = setInterval(function () {
								if (!this.sut._oFlexBoxPreview.getBusy()) {
									clearInterval(iIntervalId);
									fnResolve();
								}
							}.bind(this), 100);
						}.bind(this)).then(function () {
							assert.strictEqual(this.sut._oModel.getProperty("/showOrientationMessage"), true, "Display orientation message because better orientation is not selected");
							assert.strictEqual(this.sut._oModel.getProperty("/orientationMessage"), oRb.getText("GNT_PRNTG_SINGLE_PAGE_LANDSCAPE"), "Landscape is the better orientation");

							fnPress.executeOn(this.sut._radioGroupOrientation.getButtons()[1]); // Landscape

							return utils.waitForGanttRendered(this.sut._ganttChartClone).then(function () {
								return new Promise(function (fnResolve) {
									// wait for the busy indicator of the canvas preview
									var iIntervalId = setInterval(function () {
										if (!this.sut._oFlexBoxPreview.getBusy()) {
											clearInterval(iIntervalId);
											fnResolve();
										}
									}.bind(this), 100);
								}.bind(this)).then(function () {
									assert.strictEqual(this.sut._oModel.getProperty("/showOrientationMessage"), false, "No orientation message because better orientation is selected");
									assert.strictEqual(this.sut._oModel.getProperty("/qualityWarning"), false, "No quality warning message because number of pages in either direction <= 3");
									resetGanttPrinting(this.sut);
								}.bind(this));
							}.bind(this));
						}.bind(this));
					}.bind(this));
				}.bind(this));
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("PDF Export - Downscaling PDF on export", function (assert) {
		return utils.waitForGanttRendered(this.oGantt).then(function () {
				this.sut = new GanttPrinting({
					ganttChart: this.oGantt
				});
				return this.sut.open().then(async function () {
					await nextUIUpdate();
					this.sut._oModel.setProperty("/scale", 150);	// change scale to 150
					this.sut._updateDialogPreview();
					var fnPress = new Press();
					var fnDownScalePDF = sinon.spy(this.sut, "_downScaleCanvas");
					sinon.stub(this.sut, "_downloadPdf");

					return utils.waitForGanttRendered(this.sut._ganttChartClone).then(function () {
						fnPress.executeOn(this.sut._oButtonExport); // Export PDF
						assert.equal(fnDownScalePDF.callCount, 0, "No downscaling as scale > 100");

						this.sut._oModel.setProperty("/scale", 75);	// change scale to 75
						this.sut._updateDialogPreview();

						return utils.waitForGanttRendered(this.sut._ganttChartClone).then(function () {
							fnPress.executeOn(this.sut._oButtonExport); // Export PDF
							assert.equal(fnDownScalePDF.callCount, this.sut._getPagesInARow(), "Downscaling called for each page as scale < 100");
							resetGanttPrinting(this.sut);
						}.bind(this));
					}.bind(this));
				}.bind(this));
		}.bind(this));
	});

	QUnit.test("PDF Export - Validate Expand and Collapse rows", function (assert) {
		var oTable = this.oGantt.getTable();
		var oRowBinding = oTable.getBinding("rows");
		oTable.expandToLevel(1);
		oRowBinding.collapse(0);
		oRowBinding.collapse(1);
		oRowBinding.collapse(5);
		oRowBinding.expand(0);
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			this.sut = new GanttPrinting({
				ganttChart: this.oGantt
			});
			return this.sut.open().then(function () {
				var oInnerGanttDom = this.sut._ganttChartClone.getInnerGantt().getDomRef();
				assert.ok(oInnerGanttDom.querySelector(".rowBackgrounds").children.length >= 20, "Cloned Gantt should have at least 20 rows rendered (8 + 12 expanded)");
				assert.strictEqual(oInnerGanttDom.querySelector(".sapGanttChartShapes").children.length, 20, "Cloned Gantt should have 20 shapes rendered");
				resetGanttPrinting(this.sut);
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("PDF Export - Test date validations", function (assert) {
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			this.sut = new GanttPrinting({
				ganttChart: this.oGantt
			});
			return this.sut.open().then(function () {
				var oTotalHorizon = this.oGantt.getAxisTimeStrategy().getTotalHorizon();
				var oDate = Format.abapTimestampToDate(oTotalHorizon.getStartTime());
				var oDate1 = new Date(oDate);
				oDate.setDate(oDate.getDate() + 30);
				var fnUpdateGanttCanvas = sinon.spy(this.sut, "_updateGanttCanvas");
				this.sut._oDatePickerFrom.setValue("May 1x, 2023");
				this.sut._oDatePickerFrom.fireChangeEvent();
				assert.equal(fnUpdateGanttCanvas.callCount, 0, "Update canvas should not be called");
				assert.equal(this.sut._oDatePickerFrom.getValueState(), "Error", "Invalid date error");
				assert.equal(this.sut._oDatePickerTo.getValueState(), "None", "No error");
				this.sut._oDatePickerFrom.setDateValue(oDate);
				this.sut._oDatePickerFrom.fireChangeEvent();
				assert.equal(fnUpdateGanttCanvas.callCount, 1, "Update canvas should be called");
				assert.equal(this.sut._oDatePickerFrom.getValueState(), "None", "No error");
				fnUpdateGanttCanvas.restore();
				fnUpdateGanttCanvas = sinon.spy(this.sut, "_updateGanttCanvas");
				oDate1.setDate(oDate1.getDate() + 20);
				this.sut._oDatePickerTo.setDateValue(oDate1);
				this.sut._oDatePickerTo.fireChangeEvent();
				assert.equal(fnUpdateGanttCanvas.callCount, 0, "Update canvas should not be called");
				assert.equal(this.sut._oDatePickerFrom.getValueState(), "Error", "Invalid date error");
				assert.equal(this.sut._oDatePickerTo.getValueState(), "Error", "Invalid date error");
				this.sut._oDatePickerFrom.setValue("Apr 1x, 2023");
				this.sut._oDatePickerFrom.fireChangeEvent();
				assert.equal(fnUpdateGanttCanvas.callCount, 0, "Update canvas should not be called");
				assert.equal(this.sut._oDatePickerFrom.getValueState(), "Error", "Invalid date error");
				assert.equal(this.sut._oDatePickerTo.getValueState(), "None", "No error");
				oDate.setDate(oDate.getDate() - 20);
				this.sut._oDatePickerFrom.setDateValue(oDate);
				this.sut._oDatePickerFrom.fireChangeEvent();
				assert.equal(fnUpdateGanttCanvas.callCount, 1, "Update canvas should be called");
				assert.equal(this.sut._oDatePickerFrom.getValueState(), "None", "No error");
				assert.equal(this.sut._oDatePickerTo.getValueState(), "None", "No error");
				resetGanttPrinting(this.sut);
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("PDF Export - Validate maxLines in gantt printing", function (assert) {
		this.oGantt.getTable().getColumns().forEach(function(oColumn){
			oColumn.getTemplate().setWrapping(true);
			oColumn.getTemplate().setMaxLines(2);
		});
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			this.printGantt = new GanttPrinting({
				ganttChart: this.oGantt
			});
			var fnUpdateTable = function (oTable) {
				oTable.getColumns().forEach(function(oColumn){
					oColumn.getTemplate().setMaxLines(0);
				});
			};
			return this.printGantt.open(fnUpdateTable).then(function () {
				assert.strictEqual(this.printGantt._getOriginalGanttChart().getTable().getColumns()[0].getTemplate().getMaxLines(), 2, "Original gantt table should have maxLines");
				assert.strictEqual(this.printGantt._getOriginalGanttChart().getTable().getColumns()[1].getTemplate().getMaxLines(), 2, "Original gantt table should have maxLines");
				assert.equal(this.printGantt._ganttChartClone.getTable().getColumns()[0].getTemplate().getMaxLines(), 0, "Cloned gantt table should not have maxLines");
				assert.equal(this.printGantt._ganttChartClone.getTable().getColumns()[1].getTemplate().getMaxLines(), 0, "Cloned gantt table should not have maxLines");
				assert.notEqual(this.printGantt._getOriginalGanttChart().getDomRef().getElementsByClassName("sapMTextLineClamp").length, 0, "webkit display class exists for original gantt");
				assert.strictEqual(this.printGantt._ganttChartClone.getDomRef().getElementsByClassName("sapMTextLineClamp").length, 0, "webkit display class do not exist for cloned gantt");
				resetGanttPrinting(this.printGantt);
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("PDF Export - Validate date pickers in gantt printing dialog", function (assert) {
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			this.printGantt = new GanttPrinting({
				ganttChart: this.oGantt
			});
			var oVisibleHorizon = this.oGantt.getAxisTimeStrategy().getVisibleHorizon();
			var oTotalHorizon = this.oGantt.getAxisTimeStrategy().getTotalHorizon();
			var fnUpdateTable = function (oTable) {
				var oAxisTimeStrategy = oTable.getParent().getAxisTimeStrategy();
				var oNewTotalHorizon = oAxisTimeStrategy.getTotalHorizon().clone();
				oNewTotalHorizon.setStartTime(oVisibleHorizon.getStartTime());
				oNewTotalHorizon.setEndTime(oVisibleHorizon.getEndTime());
				oAxisTimeStrategy.setTotalHorizon(oNewTotalHorizon);
			};
			return this.printGantt.open(fnUpdateTable).then(function () {
				var oStart = this.printGantt._oDatePickerFrom.getDateValue();
				var oEnd = this.printGantt._oDatePickerTo.getDateValue();
				assert.strictEqual(Format.dateToAbapTimestamp(oStart), oVisibleHorizon.getStartTime(), "Date picker start date should be correct");
				assert.strictEqual(Format.dateToAbapTimestamp(oEnd), oVisibleHorizon.getEndTime(), "Date picker end date should be correct");
				var oMinDate1 = this.printGantt._oDatePickerFrom.getMinDate();
				var oMinDate2 = this.printGantt._oDatePickerTo.getMinDate();
				var oMaxDate1 = this.printGantt._oDatePickerFrom.getMaxDate();
				var oMaxDate2 = this.printGantt._oDatePickerTo.getMaxDate();
				assert.strictEqual(Format.dateToAbapTimestamp(oMinDate1), oTotalHorizon.getStartTime(), "Date picker min date should be same as original gantt total horizon start time");
				assert.strictEqual(Format.dateToAbapTimestamp(oMinDate2), oTotalHorizon.getStartTime(), "Date picker min date should be same as original gantt total horizon start time");
				assert.strictEqual(Format.dateToAbapTimestamp(oMaxDate1), oTotalHorizon.getEndTime(), "Date picker max date should be same as original gantt total horizon end time");
				assert.strictEqual(Format.dateToAbapTimestamp(oMaxDate2), oTotalHorizon.getEndTime(), "Date picker max date should be same as original gantt total horizon end time");
				resetGanttPrinting(this.printGantt);
			}.bind(this));
		}.bind(this));
	});

	QUnit.module("Rendering - Different display types", {
		beforeEach: function(){
			this.oGantt = utils.createGantt(true, null, true);

			// limit the total horizon to prevent Gantt being too large
			var oTotalHorizon = this.oGantt.getAxisTimeStrategy().getTotalHorizon();
			var oVisibleHorizon = this.oGantt.getAxisTimeStrategy().getVisibleHorizon();
			var dNewTotalStartTime = Format.abapTimestampToDate(oVisibleHorizon.getStartTime());
			var dNewTotalEndTime = Format.abapTimestampToDate(oVisibleHorizon.getEndTime());
			dNewTotalStartTime.setDate(-7);
			dNewTotalEndTime.setDate(dNewTotalStartTime.getDate() + 7);

			oTotalHorizon.setStartTime(dNewTotalStartTime);
			oTotalHorizon.setEndTime(dNewTotalEndTime);

			// set fixed width to prevent different Gantt rendering on different window size
			document.getElementById("qunit-fixture").style.width = "1920px";

			this.oGanttContainer = new GanttChartContainer({
				toolbar: new ContainerToolbar({
					showDisplayTypeButton: true
				}),
				ganttCharts: [this.oGantt]
			});
			this.oGanttContainer.placeAt("qunit-fixture");
		},
		afterEach: function(){
			this.oGanttContainer.destroy();
		}
	});

	QUnit.test("PDF Export - Validate displayType Table", function (assert) {
		var done = assert.async();
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			setTimeout(function () {
				this.oGantt.setDisplayType("Table");
				this.printGantt = new GanttPrinting({
					ganttChart: this.oGantt
				});
				return this.printGantt.open().then(function () {
					var iCurrentPages = this.printGantt._getPagesInARow();
					assert.strictEqual(this.printGantt._oDialog.getContent()[0].getItems()[0].getItems()[2].getItems()[2].getText(), "1 of " + iCurrentPages, "The text between the page number buttons should be correct");
					this.printGantt._oButtonClose.firePress();
					setTimeout(function () {
						assert.strictEqual(this.oGantt.getDisplayType(), "Table", "Display type for original gantt should be Table after print dialog is closed");
						assert.strictEqual(this.oGantt.getParent().getToolbar()._oDisplayTypeSegmentedButton.getSelectedKey(), "Table", "Table button should be selected on the container toolbar");
						done();
					}.bind(this), 500);
				}.bind(this));
			}.bind(this), 500);
		}.bind(this));
	});

	QUnit.test("PDF Export - Validate displayType Chart", function (assert) {
		this.oGantt.setDisplayType("Chart");
		var done = assert.async();
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			setTimeout(function () {
				this.printGantt = new GanttPrinting({
					ganttChart: this.oGantt
				});
				return this.printGantt.open().then(function () {
					var iCurrentPages = this.printGantt._getPagesInARow();
					assert.strictEqual(this.printGantt._oDialog.getContent()[0].getItems()[0].getItems()[2].getItems()[2].getText(), "1 of " + iCurrentPages, "The text between the page number buttons should be correct");
					this.printGantt._oButtonClose.firePress();
					setTimeout(function () {
						assert.strictEqual(this.oGantt.getDisplayType(), "Chart", "Display type for original gantt should be Chart after print dialog is closed");
						assert.strictEqual(this.oGantt.getParent().getToolbar()._oDisplayTypeSegmentedButton.getSelectedKey(), "Chart", "Chart button should be selected on the container toolbar");
						done();
					}.bind(this), 500);
				}.bind(this));
			}.bind(this), 500);
		}.bind(this));
	});

	QUnit.module("Rendering - Progress Indicator Dialog", {
		beforeEach: function () {
			this.oGantt = utils.createGantt(true, null, true);

			// limit the total horizon to prevent Gantt being too large
			var oTotalHorizon = this.oGantt.getAxisTimeStrategy().getTotalHorizon();
			var oVisibleHorizon = this.oGantt.getAxisTimeStrategy().getVisibleHorizon();
			var dNewTotalStartTime = Format.abapTimestampToDate(oVisibleHorizon.getStartTime());
			var dNewTotalEndTime = Format.abapTimestampToDate(oVisibleHorizon.getEndTime());
			dNewTotalStartTime.setDate(-7);
			dNewTotalEndTime.setDate(dNewTotalStartTime.getDate() + 7);

			oTotalHorizon.setStartTime(dNewTotalStartTime);
			oTotalHorizon.setEndTime(dNewTotalEndTime);

			this.oGantt.setPrintingBatchSize(5);

			// set fixed width to prevent different Gantt rendering on different window size
			document.getElementById("qunit-fixture").style.width = "1920px";
			this.oGantt.placeAt("qunit-fixture");
		},
		afterEach: function () {
			utils.destroyGantt();
		}
	});

	QUnit.test("PDF Export - Validate progress indicator", function (assert) {
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			this.printGantt = new GanttPrinting({
				ganttChart: this.oGantt
			});
			return this.printGantt.open().then(function () {
				assert.notEqual(document.getElementById(this.printGantt.getId() + "-progressDialog"), null, "Progress indicator should be there.");
				assert.strictEqual(this.printGantt._oProgressIndicator.getPercentValue() > 0, true, "Progress bar should have started moving.");
				this.printGantt._closeProgressIndicator();
			}.bind(this));
		}.bind(this));
	});

	QUnit.module("Rendering - Expanded rows", {
		beforeEach: function() {
			this.oGantt = utils.createGantt(true, new GanttRowSettings({
				rowId: "{Id}",
				shapes1: [
					new SteppedTask({
						shapeId: "{Id}",
						expandable: true,
						task: new BaseRectangle({
							time: "{StartDate}",
							endTime: "{EndDate}",
							fill: "#008FD3",
							height: 20
						}),
						breaks: {
							path: "breaks",
							template: new BaseRectangle({
								scheme: "break",
								time: "{StartDate}",
								endTime: "{EndDate}",
								fill: "red",
								height: 20
							}),
							templateShareable: true
						}
					})
				]
			}), true/**bCreate expand data */);

			this.oGantt.addShapeScheme(new sap.gantt.simple.ShapeScheme({
				key: "break",
				rowSpan: 1
			}));

			// limit the total horizon to prevent Gantt being too large
			var oTotalHorizon = this.oGantt.getAxisTimeStrategy().getTotalHorizon();
			var oVisibleHorizon = this.oGantt.getAxisTimeStrategy().getVisibleHorizon();
			var dNewTotalStartTime = Format.abapTimestampToDate(oVisibleHorizon.getStartTime());
			var dNewTotalEndTime = Format.abapTimestampToDate(oVisibleHorizon.getEndTime());
			dNewTotalStartTime.setDate(-7);
			dNewTotalEndTime.setDate(dNewTotalStartTime.getDate() + 7);

			oTotalHorizon.setStartTime(dNewTotalStartTime);
			oTotalHorizon.setEndTime(dNewTotalEndTime);

			// set fixed width to prevent different Gantt rendering on different window size
			document.getElementById("qunit-fixture").style.width = "1920px";
			this.oGantt.placeAt("qunit-fixture");
		},
		afterEach: function() {
			utils.destroyGantt();
		}
	});

	QUnit.test("PDF Export - Validate expanded rows", function (assert) {
		var aExpandIndex = [0, 2];

		return utils.waitForGanttRendered(this.oGantt).then(function () {
			return new Promise(function (resolve) {
				setTimeout(function () {
					this.oGantt.expand("break", aExpandIndex);
					resolve();
				}.bind(this), 400); // leave 400 ms to render completely
			}.bind(this)).then(function () {
				this.sut = new GanttPrinting({
					ganttChart: this.oGantt
				});
				return this.sut.open().then(async function () {
					await nextUIUpdate();
					var aClonedRowHeights = this.sut._ganttChartClone.getTable()._aRowHeights;
					var iSum = 0;
					for (var i = 0; i < aClonedRowHeights.length; i++) {
						iSum = iSum + aClonedRowHeights[i];
					}
					var iCloneDivHeight = document.getElementById("clonedGanttDiv").offsetHeight;
					assert.strictEqual((iCloneDivHeight >= iSum), true, "Rows are expanded in gantt print preview");
					resetGanttPrinting(this.sut);
				}.bind(this));
			}.bind(this));
		}.bind(this));
	});

	QUnit.module("Rendering - Shape with linearGradient in GanttChartWithTable", {
		beforeEach: function () {
			this.oSvgDefs = new SvgDefs({
				defs: [
					new LinearGradient("linearGradient", {
						x1: 0,
						x2: 0,
						y1: 0,
						y2: 1,
						stops: [new Stop({
							offSet: 0,
							stopColor: "#1DA9C1"
						}), new Stop({
							offSet: 0.5,
							stopColor: "#FFC700"
						}), new Stop({
							offSet: 1,
							stopColor: "#1DA9C1"
						})]
					})
				]
			});
			this.oGantt = utils.createGantt(true, new GanttRowSettings({
				rowId: "{Id}",
				shapes1: [
					new BaseRectangle({
						shapeId: "{Id}",
						time: "{StartDate}",
						endTime: "{EndDate}",
						title: "{Name}",
						fill: "url(#linearGradient)",
						selectable: true,
						connectable: true,
						horizontalTextAlignment: "Start"
					})
				]
			}), true);
			this.oGantt.setSvgDefs(this.oSvgDefs);
			this.oGantt.setPrintingBatchSize(0);

			// limit the total horizon to prevent Gantt being too large
			var oTotalHorizon = this.oGantt.getAxisTimeStrategy().getTotalHorizon();
			var oVisibleHorizon = this.oGantt.getAxisTimeStrategy().getVisibleHorizon();
			var dNewTotalStartTime = Format.abapTimestampToDate(oVisibleHorizon.getStartTime());
			var dNewTotalEndTime = Format.abapTimestampToDate(oVisibleHorizon.getEndTime());
			dNewTotalStartTime.setDate(-7);
			dNewTotalEndTime.setDate(dNewTotalStartTime.getDate() + 7);

			oTotalHorizon.setStartTime(dNewTotalStartTime);
			oTotalHorizon.setEndTime(dNewTotalEndTime);

			// set fixed width to prevent different Gantt rendering on different window size
			document.getElementById("qunit-fixture").style.width = "1920px";
			this.oGantt.placeAt("qunit-fixture");
		},
		afterEach: function () {
			utils.destroyGantt();
		}
	});

	QUnit.test("PDF Export - Validate linearGradients", function (assert) {
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			var fnOriginalGanttRender = sinon.spy(this.oGantt, "onBeforeRendering");
			this.printGantt = new GanttPrinting({
				ganttChart: this.oGantt
			});
			return this.printGantt.open().then(function () {
				var clonedSvgDefs = this.printGantt._ganttChartClone.getDomRef().querySelector(".sapGanttChartSvgDefs");
				var sCloneGradientId = clonedSvgDefs.children[1].children[0].id;
				var sOriginalGradientId = this.oGantt.getSvgDefs().getDefs()[0].getId();
				var oShapeFill = this.printGantt._ganttChartClone.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0].getFill();
				assert.equal(sCloneGradientId, sOriginalGradientId, "Clone linear gradient Id is same as original gradient Id");
				assert.equal(clonedSvgDefs.parentElement, document.getElementsByClassName("sapGanttChartSvg")[1], "svg defs are child elements of gantt chart svg");
				assert.equal(oShapeFill.slice(5,-1), sCloneGradientId, "Cloned gantt shapes have correct fill");
				assert.equal(fnOriginalGanttRender.callCount, 0, "Original gantt should not be rendered when printing");
				resetGanttPrinting(this.printGantt);
			}.bind(this));
		}.bind(this));
	});

	QUnit.module("Shape with linearGradient rendering in single page", {
		beforeEach: function () {
			this.oSvgDefs = new SvgDefs({
				defs: [
					new LinearGradient("linearGradient", {
						x1: "0%",
						x2: "100%",
						y1: "0%",
						y2: "0%",
						stops: [new Stop({
							offSet: "0%",
							stopColor: "#1DA9C1"
						}), new Stop({
							offSet: "0%",
							stopColor: "#1DA9C1"
						}), new Stop({
							offSet: "0%",
							stopColor: "#FFC700"
						}), new Stop({
							offSet: "50%",
							stopColor: "#FFC700"
						}), new Stop({
							offSet: "50%",
							stopColor: "#1DA9C1"
						}), new Stop({
							offSet: "100%",
							stopColor: "#1DA9C1"
						})]
					})
				]
			});
			this.oGantt = utils.createGantt(true, new GanttRowSettings({
				rowId: "{Id}",
				shapes1: [
					new BaseRectangle({
						shapeId: "{Id}",
						time: "{StartDate}",
						endTime: "{EndDate}",
						title: "{Name}",
						fill: "url(#linearGradient)",
						selectable: true,
						connectable: true,
						horizontalTextAlignment: "Start"
					})
				]
			}), true);
			this.oGantt.setSvgDefs(this.oSvgDefs);
			this.oGantt.setPrintingBatchSize(0);

			// limit the total horizon to prevent Gantt being too large
			var oTotalHorizon = this.oGantt.getAxisTimeStrategy().getTotalHorizon();
			var oVisibleHorizon = this.oGantt.getAxisTimeStrategy().getVisibleHorizon();
			var dNewTotalStartTime = Format.abapTimestampToDate(oVisibleHorizon.getStartTime());
			var dNewTotalEndTime = Format.abapTimestampToDate(oVisibleHorizon.getEndTime());
			dNewTotalStartTime.setDate(-7);
			dNewTotalEndTime.setDate(dNewTotalStartTime.getDate() + 7);

			oTotalHorizon.setStartTime(dNewTotalStartTime);
			oTotalHorizon.setEndTime(dNewTotalEndTime);

			// set fixed width to prevent different Gantt rendering on different window size
			document.getElementById("qunit-fixture").style.width = "1920px";
			this.oGantt.placeAt("qunit-fixture");
		},
		afterEach: function () {
			utils.destroyGantt();
		}
	});

	QUnit.test("PDF Export - Validate linearGradients Single page", function (assert) {
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			this.printGantt = new GanttPrinting({
				ganttChart: this.oGantt
			});
			return this.printGantt.openPdfPreview().then(function () {
				var shape = document.querySelectorAll(".sapGanttChartShapes")[1].getElementsByTagName("rect")[0];
				assert.equal(this.printGantt._getOriginalGanttChart().getSvgDefs().getDefs().length, 1, "Original gantt has linear gradient");
				assert.equal(this.printGantt._ganttChartClone.getSvgDefs().getDefs().length, 1, "Cloned gantt has linear gradient");
				assert.equal(shape.style.fill,'url("#linearGradient")',"shape has linear gradient fill");
				assert.ok(shape.style.length < 10 ,"unnecessary styles are not added");
				assert.equal(document.getElementsByTagName("linearGradient")[0].getAttribute("x2"), "1", "values are not set in percentage");
				assert.equal(document.getElementsByTagName("linearGradient")[0].children.length, 4 ,"starting multiple zero offsets are removed");
				resetGanttPrinting(this.printGantt);
			}.bind(this));
		}.bind(this));
	});

	QUnit.module("Rendering - Non Optimised", {
		beforeEach: function () {
			this.oGantt = utils.createGantt(true, null, true);
			this.oGantt.setPrintingBatchSize(0);
			this.oGantt.setEnableChartOverflowToolbar(true);

			// limit the total horizon to prevent Gantt being too large
			var oTotalHorizon = this.oGantt.getAxisTimeStrategy().getTotalHorizon();
			var oVisibleHorizon = this.oGantt.getAxisTimeStrategy().getVisibleHorizon();
			var dNewTotalStartTime = Format.abapTimestampToDate(oVisibleHorizon.getStartTime());
			var dNewTotalEndTime = Format.abapTimestampToDate(oVisibleHorizon.getEndTime());
			dNewTotalStartTime.setDate(-7);
			dNewTotalEndTime.setDate(dNewTotalStartTime.getDate() + 7);

			oTotalHorizon.setStartTime(dNewTotalStartTime);
			oTotalHorizon.setEndTime(dNewTotalEndTime);

			// set fixed width to prevent different Gantt rendering on different window size
			document.getElementById("qunit-fixture").style.width = "1920px";
			this.oGantt.placeAt("qunit-fixture");
		},
		afterEach: function () {
			utils.destroyGantt();
		}
	});

	QUnit.test("PDF check labels for screen reader", function (assert) {
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			return utils.waitForGanttRendered(this.oGantt).then(function () {
				this.sut = new GanttPrinting({
					ganttChart: this.oGantt
				});
				return this.sut.open().then(async function () {
					await nextUIUpdate();
					assert.strictEqual(true,true);

					function findElementsWithAriaLabelledBy(elementId) {
						var elementsWithAriaLabelledBy = [];
						// Get all elements that have 'aria-labelledby' attribute
						var elementsWithAriaLabel = document.querySelectorAll('[aria-labelledby]');
						// Loop through the elements and check if 'aria-labelledby' contains the elementId along with other characters
						elementsWithAriaLabel.forEach((element) => {
						  var ariaLabelledByValue = element.getAttribute('aria-labelledby');
						  if (ariaLabelledByValue && ariaLabelledByValue.includes(elementId) && ariaLabelledByValue.startsWith(elementId) && !ariaLabelledByValue.endsWith(elementId)) {
							elementsWithAriaLabelledBy.push(element);
						  }
						});
						return elementsWithAriaLabelledBy;
					  }
					assert.strictEqual(this.sut._radioGroupPage.getButtons()[0].getAriaLabelledBy()[0],this.sut._oExportType.getId(),"Export Type label found");
					assert.strictEqual(this.sut._radioGroupPage.getButtons()[1].getAriaLabelledBy()[0],this.sut._oExportType.getId(),"Export Type label found");
					assert.strictEqual(this.sut._radioGroupOrientation.getButtons()[0].getAriaLabelledBy()[0],this.sut._oOrientationLabell.getId(),"Orientation label found");
					assert.strictEqual(this.sut._radioGroupOrientation.getButtons()[1].getAriaLabelledBy()[0],this.sut._oOrientationLabell.getId(),"Orientation label found");
					assert.strictEqual(this.sut._oComboBoxPaperSizes.getAriaLabelledBy()[0],this.sut._oPaperSizeLabel.getId(),"Paper Size Label found");
					assert.strictEqual(this.sut._oInputPaperWidth.getAriaLabelledBy()[0],this.sut._oWidthLabel.getId(),"Width Label found");
					assert.strictEqual(this.sut._oInputPaperHeight.getAriaLabelledBy()[0],this.sut._oHeightLabel.getId(),"Height Label found");
					assert.strictEqual(this.sut._oComboBoxUnit.getAriaLabelledBy()[0],this.sut._oUnitLabel.getId(),"Unit Label found");
					assert.strictEqual(this.sut._oComboBoxDuration.getAriaLabelledBy()[0],this.sut._oDurationComboLabel.getId(),"Duration Label found");
					assert.strictEqual(this.sut._oDatePickerFrom.getAriaLabelledBy()[0],this.sut._oStartDateLabel.getId(),"Start Date Label found");
					assert.strictEqual(this.sut._oDatePickerTo.getAriaLabelledBy()[0],this.sut._oEndDateLabel.getId(),"End Date Label found");
					var elementsWithAriaLabelledBy = findElementsWithAriaLabelledBy(this.sut._oScaleLabel.getId());
					assert.ok(elementsWithAriaLabelledBy[0].getAttribute('aria-labelledby').includes(this.sut._oScaleLabel.getId()),"Scale element found");
					elementsWithAriaLabelledBy = findElementsWithAriaLabelledBy(this.sut._oRangeLabel.getId());
					assert.ok(elementsWithAriaLabelledBy[0].getAttribute('aria-labelledby').includes(this.sut._oRangeLabel.getId()),"Page Range element found");
					assert.ok(elementsWithAriaLabelledBy[1].getAttribute('aria-labelledby').includes(this.sut._oRangeLabel.getId()),"Page Range element found");
					elementsWithAriaLabelledBy = findElementsWithAriaLabelledBy(this.sut._oHeaderFooterLabel.getId());
					assert.ok(elementsWithAriaLabelledBy[0].getAttribute('aria-labelledby').includes(this.sut._oHeaderFooterLabel.getId()),"Header Text element found");
					assert.strictEqual(this.sut._oLabelWithSwitchLabel.getId(),this.sut._oSwitch.getAriaLabelledBy()[0],"Switch label found");
					assert.strictEqual(this.sut._oMargin.getId(),this.sut._oMarginComboBox.getAriaLabelledBy()[0],"Margin label found");
					var fnPress = new Press();
					fnPress.executeOn(this.sut._oMarginComboBox);
					fnPress.executeOn(this.sut._oMarginComboBox._getList().getItems()[2]);
					fnPress.executeOn(this.sut._oComboBoxDuration);
					fnPress.executeOn(this.sut._oComboBoxDuration._getList().getItems()[1]); // Next Week
					assert.strictEqual(this.sut._oMarginTop.getId(),this.sut._oInputMarginTop.getAriaLabelledBy()[0],"Top label found");
					assert.strictEqual(this.sut._oMarginRight.getId(),this.sut._oInputMarginRight.getAriaLabelledBy()[0],"Right label found");
					assert.strictEqual(this.sut._oMarginLeft.getId(),this.sut._oInputMarginLeft.getAriaLabelledBy()[0],"Left label found");
					assert.strictEqual(this.sut._oMarginBottom.getId(),this.sut._oInputMarginBottom.getAriaLabelledBy()[0],"Bottom label found");
					assert.strictEqual(this.sut._oCompressExportType.getId(),this.sut._oCompressExportTypeRadio.getButtons()[0].getAriaLabelledBy()[0],"Export Type Label Found");
					assert.strictEqual(this.sut._oCompressExportType.getId(),this.sut._oCompressExportTypeRadio.getButtons()[1].getAriaLabelledBy()[0],"Export Type Label Found");
					assert.strictEqual(this.sut._oCompressQuality.getId(),this.sut._oComboBoxCompression.getAriaLabelledBy()[0],"Quality Label found");
					elementsWithAriaLabelledBy = findElementsWithAriaLabelledBy(this.sut._oCompressQuality.getId());
					assert.ok(elementsWithAriaLabelledBy[0].getAttribute("aria-labelledby").includes(this.sut._oCompressQuality.getId()),"Quality Label found");
					resetGanttPrinting(this.sut);
					}.bind(this));
				}.bind(this));
		}.bind(this));
	});

	QUnit.test("PDF check for field labels", function (assert) {
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			// expand all rows
			this.oGantt.getTable().expandToLevel(1);

			return utils.waitForGanttRendered(this.oGantt).then(function () {
				this.sut = new GanttPrinting({
					ganttChart: this.oGantt
				});
				return this.sut.open().then(async function () {
					await nextUIUpdate();
					function getTextContent(element) {
						return jQuery(element.getParent().getDomRef()).contents().filter(function () {
							return this.classList.contains("sapMLabel");
						}).text();
					}

					  function hasCssClass(element, className) {
						return element.getParent().getDomRef().classList.contains(className);
					  }

					  // check if labels are present or not
					  assert.ok(getTextContent(this.sut._oInputPaperWidth).includes("Width"), "Width element found");
					  assert.ok(getTextContent(this.sut._oInputPaperHeight).includes("Height"), "Height element found");
					  assert.ok(getTextContent(this.sut._oComboBoxUnit).includes("Unit"), "Unit element found");
					  assert.ok(getTextContent(this.sut._oDatePickerFrom).includes("Start Date"), "Start Date label found");
					  assert.ok(getTextContent(this.sut._oDatePickerTo).includes("End Date"), "End Date label found");
					  // check if css style is set for fields
					  assert.ok(
						hasCssClass(this.sut._oDatePickerFrom, "sapGanttPrintingSmallRightMargin"),
						"Right CSS class is present"
					  );
					  assert.ok(
						hasCssClass(this.sut._oDatePickerTo, "sapGanttPrintingSmallLeftMargin"),
						"Left CSS class is present"
					  );
					  assert.ok(
						hasCssClass(this.sut._oInputPaperWidth, "sapGanttPrintingSmallRightMargin"),
						"Right CSS class is present"
					  );
					  assert.ok(
						hasCssClass(this.sut._oInputPaperHeight, "sapGanttPrintingSmallLeftMargin"),
						"Left CSS class is present"
					  );
							resetGanttPrinting(this.sut);
				}.bind(this));
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("PDF Export dialog - open and change duration", function (assert) {
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			// expand all rows
			this.oGantt.getTable().expandToLevel(1);

			return utils.waitForGanttRendered(this.oGantt).then(function () {
				this.sut = new GanttPrinting({
					ganttChart: this.oGantt
				});
				return this.sut.open().then(async function () {
					await nextUIUpdate();
					var oAxisTimeStrategy = this.oGantt.getAxisTimeStrategy();
					var oCloneAxisTimeStrategy = this.sut._ganttChartClone.getAxisTimeStrategy();
					assert.strictEqual(document.getElementById(this.sut._ganttChartClone.getId() + "-ganttHeaderOverflowToolbar"), null, "Cloned gantt chart should not have overflow toolbar");
					assert.strictEqual(oCloneAxisTimeStrategy.getTotalHorizon().getStartTime(), oAxisTimeStrategy.getTotalHorizon().getStartTime(), "Cloned gantt total horizon start time should be same as original gantt total horizon start time");
					assert.strictEqual(oCloneAxisTimeStrategy.getTotalHorizon().getEndTime(), oAxisTimeStrategy.getTotalHorizon().getEndTime(), "Cloned gantt total horizon end time should be same as original gantt total horizon end time");
					assert.strictEqual(oCloneAxisTimeStrategy.getVisibleHorizon().getStartTime(), oAxisTimeStrategy.getTotalHorizon().getStartTime(), "Cloned gantt visible horizon start time should be same as original gantt total horizon start time");
					assert.strictEqual(oCloneAxisTimeStrategy.getVisibleHorizon().getEndTime(), oAxisTimeStrategy.getTotalHorizon().getEndTime(), "Cloned gantt visible horizon end time should be same as original gantt total horizon end time");

					var iCurrentPages = this.sut._getPagesInARow();
					// Assert 1 (Dialog opened and loaded)
					assert.strictEqual(
						this.sut._oDialog.getContent()[0].getItems()[0].getItems()[2].getItems()[2].getText(), "1 of " + iCurrentPages,
						"The text between the page number buttons should be correct."
					);
					assert.ok(
						this.sut._ganttChartClone.getInnerGantt().$("svg").find(".rowBackgrounds").children().length >= 24,
						"Cloned Gantt should have at least 24 rows rendered (8 + 16 expanded)."
					);
					assert.strictEqual(
						this.sut._ganttChartClone.getInnerGantt().$("svg").find(".sapGanttChartShapes").children().length, 24,
						"Cloned Gantt should have 24 shapes rendered."
					);
					var sTimeLineOptionUnit = this.sut._ganttChartClone.getAxisTimeStrategy().getTimeLineOption().innerInterval.unit;

					// change the Duration option to the Next Week
					var fnPress = new Press();
					fnPress.executeOn(this.sut._oComboBoxDuration);
					fnPress.executeOn(this.sut._oComboBoxDuration._getList().getItems()[1]); // Next Week

					return utils.waitForGanttRendered(this.sut._ganttChartClone).then(function () {
						return new Promise(function (fnResolve) {
							// wait for the busy indicator of the canvas preview
							var iIntervalId = setInterval(function () {
								if (!this.sut._oFlexBoxPreview.getBusy()) {
									clearInterval(iIntervalId);
									fnResolve();
								}
							}.bind(this), 500);
						}.bind(this)).then(function () {
							var iCurrentPages = this.sut._getPagesInARow();
							// Assert 2 (Dialog preview is updated after duration was changed to the Next Week)
							assert.strictEqual(
								this.sut._oDialog.getContent()[0].getItems()[0].getItems()[2].getItems()[2].getText(), "1 of " + iCurrentPages,
								"The text between the page number buttons should be correct after setting duration to the next week."
							);
							assert.ok(
								this.sut._ganttChartClone.getInnerGantt().$("svg").find(".rowBackgrounds").children().length >= 24,
								"Cloned Gantt should have at least 24 rows rendered (8 + 16 expanded) after setting duration to the next week."
							);
							assert.strictEqual(
								this.sut._getOriginalGanttChart().getAxisTimeStrategy().getTimeLineOption().innerInterval.unit, sTimeLineOptionUnit,
								"The timeLine option should remain the same after setting duration to 1 week."
							);
							// assert for the number of shapes would be here if someone manages to write it
							resetGanttPrinting(this.sut);
						}.bind(this));
					}.bind(this));
				}.bind(this));
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("PDF Export - Validate Missing Table Binding", function (assert) {
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			this.printGantt = new GanttPrinting({
				ganttChart: this.oGantt
			});
			this.printGantt._ganttChartClone.getTable().getBindingInfo("rows").binding = null;
			return this.printGantt.open().then(function () {
				var iCurrentPages = this.printGantt._getPagesInARow();
				assert.ok(this.printGantt._ganttChartClone.getTable().getBindingInfo("rows").binding != null, "The binding of the table has been updated accordingly.");
				assert.strictEqual(this.printGantt._oDialog.getContent()[0].getItems()[0].getItems()[2].getItems()[2].getText(), "1 of " + iCurrentPages, "The text between the page number buttons should be correct.");
				assert.strictEqual(this.printGantt._ganttChartClone.getInnerGantt().$("svg").find(".sapGanttChartShapes").children().length, 8, "Cloned Gantt should have 8 shapes rendered.");
				resetGanttPrinting(this.printGantt);
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("PDF Export - Validate Missing Table Binding when Gantt chart is too large", function (assert) {
		// Increase the total horizon to make Gantt chart large
		var oTotalHorizon = this.oGantt.getAxisTimeStrategy().getTotalHorizon();
		var oVisibleHorizon = this.oGantt.getAxisTimeStrategy().getVisibleHorizon();
		var dNewTotalStartTime = Format.abapTimestampToDate(oVisibleHorizon.getStartTime());
		var dNewTotalEndTime = Format.abapTimestampToDate(oVisibleHorizon.getEndTime());
		dNewTotalStartTime.setDate(-7);
		dNewTotalEndTime.setDate(dNewTotalStartTime.getDate() + 700);

		oTotalHorizon.setStartTime(dNewTotalStartTime);
		oTotalHorizon.setEndTime(dNewTotalEndTime);

		return utils.waitForGanttRendered(this.oGantt).then(function () {
			this.printGantt = new GanttPrinting({
				ganttChart: this.oGantt
			});
			this.printGantt._ganttChartClone.getTable().getBindingInfo("rows").binding = null;
			return this.printGantt.open().then(function () {
				assert.ok(this.printGantt._ganttChartClone.getTable().getBindingInfo("rows").binding == null, "The binding of the table should not be added in case of error");
				resetGanttPrinting(this.printGantt);
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("PDF Export - Validate Missing Filter and sorter parameter", function (assert) {
		var oGanttAxisStrategyHorizon = this.oGantt.getAxisTimeStrategy().getTotalHorizon(),
			fromDateFilter = Format.abapTimestampToDate(oGanttAxisStrategyHorizon.getStartTime()),
			toDateFilter = Format.abapTimestampToDate(oGanttAxisStrategyHorizon.getEndTime()),
			oFilter = new Filter({
					path: "StartDate",
					operator: FilterOperator.BT,
					value1: fromDateFilter,
					value2: toDateFilter
			}),
			oSorter = new Sorter("StartDate", true),
			sCustomParams = "$select=MaintenanceOrder,MaintenanceOrderDesc,MaintenanceOrderInternalID,OrderStartDateTime,OrderEndDateTime,ProcessingStatus,ProcessingStatusText,OrderOperationRowLevel,OrderOperationParentRowID,OrderOperationRowID,OrderOperationIsExpanded,MaintOrderRoutingNumber,LatestAcceptableCompletionDate,MainWorkCenter,MaintPriority,MaintPriorityDesc,FunctionalLocationName,FunctionalLocation";
		this.oGantt.getTable().getBinding("rows").filter(oFilter, sap.ui.model.FilterType.Application);
		this.oGantt.getTable().getBinding("rows").sort(oSorter);
		this.oGantt.getTable().getBinding("rows")['sCustomParams'] = sCustomParams;
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			this.printGantt = new GanttPrinting({
				ganttChart: this.oGantt
			});
			this.printGantt._ganttChartClone.getTable().getBindingInfo("rows").binding = null;
			return this.printGantt.open().then(function () {
				var sCustomParamsCloned = this.printGantt._ganttChartClone.getTable().getBindingInfo("rows").binding.sCustomParams;
				assert.deepEqual(sCustomParamsCloned, sCustomParams, "The binding has the correct custom params applied.");
				var oPrintGanttFilter = this.printGantt._ganttChartClone.getTable().getBindingInfo("rows").binding.aApplicationFilters;
				assert.deepEqual(oPrintGanttFilter[0], oFilter, "The binding has the correct filter applied.");
				var oPrintGanttSorter = this.printGantt._ganttChartClone.getTable().getBindingInfo("rows").binding.aSorters[0];
				assert.deepEqual(oPrintGanttSorter, oSorter, "The binding has the correct sorter applied.");
				resetGanttPrinting(this.printGantt);
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("PDF Export - Validate Scale Level of Gantt Chart", function (assert) {
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			this.printGantt = new GanttPrinting({
				ganttChart: this.oGantt
			});
			return this.printGantt.open().then(function () {
				assert.equal(this.printGantt._oGanttCanvas.width, parseFloat(this.printGantt._oGanttCanvas.style.width) * 2, "Canvas Width of html2canvas has been scaled by 2.");
				assert.equal(this.printGantt._oGanttCanvas.height, parseFloat(this.printGantt._oGanttCanvas.style.height) * 2, "Canvas Height of html2canvas has been scaled by 2.");
				resetGanttPrinting(this.printGantt);
			}.bind(this));
		}.bind(this));
	});

	QUnit.module("Rendering with sap.ui.table.Table", {
		beforeEach: async function () {
			this.oShape = new  BaseRectangle({
				id: "r1",
				shapeId: "r1",
				time: new Date(1514831400000),
				endTime: new Date(1514917800000)
			});
			this.oGantt = utils.createSimpleGantt(this.oShape, "20180101000000", "20180105000000");
			await nextUIUpdate();
			// set fixed width to prevent different Gantt rendering on different window size
			document.getElementById("qunit-fixture").style.width = "1920px";
			this.oGantt.placeAt("qunit-fixture");
		},
		afterEach: function () {
			this.oShape.destroy();
			this.oShape = undefined;
			this.oGantt.destroy();
			this.oGantt = undefined;
		}
	});
	QUnit.test("PDF Export - Exporting Gantt with sap.ui.table.Table", function (assert) {
		var fnDone = assert.async();
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			setTimeout(function() {
				this.printGantt = new GanttPrinting({
					ganttChart: this.oGantt
				});
				return this.printGantt.open().then(async function () {
					await nextUIUpdate();
					setTimeout(function() {
						var iCurrentPages = this.printGantt._getPagesInARow();
						assert.strictEqual(
							this.printGantt._oDialog.getContent()[0].getItems()[0].getItems()[2].getItems()[2].getText(), "1 of " + iCurrentPages,
							"The text between the page number buttons should be correct."
						);
						assert.strictEqual(
							this.printGantt._ganttChartClone.getInnerGantt().$("svg").find(".sapGanttChartShapes").children().length, 1,
							"Cloned Gantt should have 1 shape rendered."
						);
						fnDone();
						resetGanttPrinting(this.printGantt);
					}.bind(this), 500);
				}.bind(this));
			}.bind(this), 500);
		}.bind(this));
	});

	QUnit.module("Rendering - Shape with SlashPattern in GanttChartWithTable", {
		beforeEach: function () {
			this.oSvgDefs = new SvgDefs({
				defs: [
					new SlashPattern("testing1", {
					stroke: "#CAC7BA"
					}),
					new SlashPattern("testing", {
						stroke: "red"
					}),
					new BackSlashPattern("testing_1", {
						stroke: "green"
					}),
					new BackSlashPattern("testing-1", {
						stroke: "blue"
					})
				]
			});
			this.oGantt = utils.createGantt(true, new GanttRowSettings({
				rowId: "{Id}",
				shapes1: [
					new BaseRectangle({
						shapeId: "{Id}",
						time: "{StartDate}",
						endTime: "{EndDate}",
						title: "{Name}",
						fill: "url(#testing1)",
						selectable: true,
						connectable: true,
						horizontalTextAlignment: "Start"
					})
				]
			}), true);
			this.oGantt.setSvgDefs(this.oSvgDefs);
			this.oGantt.setPrintingBatchSize(0);

			// limit the total horizon to prevent Gantt being too large
			var oTotalHorizon = this.oGantt.getAxisTimeStrategy().getTotalHorizon();
			var oVisibleHorizon = this.oGantt.getAxisTimeStrategy().getVisibleHorizon();
			var dNewTotalStartTime = Format.abapTimestampToDate(oVisibleHorizon.getStartTime());
			var dNewTotalEndTime = Format.abapTimestampToDate(oVisibleHorizon.getEndTime());
			dNewTotalStartTime.setDate(-7);
			dNewTotalEndTime.setDate(dNewTotalStartTime.getDate() + 7);

			oTotalHorizon.setStartTime(dNewTotalStartTime);
			oTotalHorizon.setEndTime(dNewTotalEndTime);

			// set fixed width to prevent different Gantt rendering on different window size
			document.getElementById("qunit-fixture").style.width = "1920px";
			this.oGantt.placeAt("qunit-fixture");
		},
		afterEach: function () {
			utils.destroyGantt();
		}
	});

	QUnit.test("PDF Export - Validate slashPatterns", function (assert) {
		var done = assert.async();
		var iDefsCount = 0;
		var aPaintServerDefsPattern;
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			setTimeout(function () {
				var aChildElements = this.oGantt.getDomRef().querySelector(".sapGanttChartSvgDefs").childNodes;
				for (var i = 0; i < aChildElements.length; i++) {
					if (aChildElements[i].nodeName === "defs") {
						iDefsCount++;
						assert.ok(iDefsCount, " " + iDefsCount + "defs should be added.");
						if (aChildElements[i].id.length > 0) {
							assert.equal(aChildElements[i].children.length , 4, "4 pattern should be added fo the SlashPattern.");
							aPaintServerDefsPattern = aChildElements[i].children;
						}
					}
				}
				for (var i = 0; i < aPaintServerDefsPattern.length; i++) {
					assert.equal(aPaintServerDefsPattern[i].id, this.oSvgDefs.getDefs()[i].getId(), "Pattern id are similar to original SVG Defs." + this.oSvgDefs.getDefs()[i].getId());
				}

				this.oGantt.getTable().getRows().forEach(function(oRow, index) {
					oRow.getAggregation("_settings").getShapes1().forEach(function(oShape) {
						assert.ok(oShape.getFill(), "Current Fill Pattern for the main Gantt Row " + (index + 1) + "is" + oShape.getFill());
					});
				});

				this.printGantt = new GanttPrinting({
					ganttChart: this.oGantt
				});
				iDefsCount = 0;
				return this.printGantt.open().then(function () {
					assert.equal(this.printGantt._oGanttCanvas.width, parseFloat(this.printGantt._oGanttCanvas.style.width) * 2, "Canvas Width of html2canvas has been scaled by 2.");
					assert.equal(this.printGantt._oGanttCanvas.height, parseFloat(this.printGantt._oGanttCanvas.style.height) * 2, "Canvas Height of html2canvas has been scaled by 2.");

					var aChildElements = this.printGantt._ganttChartClone.getDomRef().querySelector(".sapGanttChartSvgDefs").childNodes;
					for (var i = 0; i < aChildElements.length; i++) {
						if (aChildElements[i].nodeName === "defs") {
							iDefsCount++;
							assert.ok(iDefsCount, " " + iDefsCount + "defs should be added.");
							if (aChildElements[i].id.length  > 0) {
								assert.equal(aChildElements[i].children.length , 4, "4 pattern should be added fo the SlashPattern.");
								aPaintServerDefsPattern = aChildElements[i].children;
							}
						}
					}
					for (var i = 0; i < aPaintServerDefsPattern.length; i++) {
						assert.equal(aPaintServerDefsPattern[i].id, this.oSvgDefs.getDefs()[i].getId(), "Pattern id are similar to original SVG Defs." + this.oSvgDefs.getDefs()[i].getId());
					}

					this.printGantt._ganttChartClone.getTable().getRows().forEach(function(oRow) {
						oRow.getAggregation("_settings").getShapes1().forEach(function(oShape) {
							assert.ok(oShape.getFill(), "Current Fill Pattern is" + oShape.getFill());
						});
					});

					resetGanttPrinting(this.printGantt);
					iDefsCount = 0;
					this.oGantt.getTable().getRows().forEach(function(oRow) {
						oRow.getAggregation("_settings").getShapes1().forEach(function(oShape) {
							oShape.setFill("url(#testing)");
						});
					});
					this.oGantt.getTable().getRowSettingsTemplate().getShapes1()[0].setFill("url(#testing)");
					return utils.waitForGanttRendered(this.oGantt).then(function () {
						setTimeout(function () {
							var aChildElements = this.oGantt.getDomRef().querySelector(".sapGanttChartSvgDefs").childNodes;
							for (var i = 0; i < aChildElements.length; i++) {
								if (aChildElements[i].nodeName === "defs") {
									iDefsCount++;
									assert.ok(iDefsCount, " " + iDefsCount + "defs should be added.");
									if (aChildElements[i].id.length  > 0) {
										assert.equal(aChildElements[i].children.length , 4, "4 pattern should be added fo the SlashPattern.");
										aPaintServerDefsPattern = aChildElements[i].children;
									}
								}
							}
							for (var i = 0; i < aPaintServerDefsPattern.length; i++) {
								assert.equal(aPaintServerDefsPattern[i].id, this.oSvgDefs.getDefs()[i].getId(), "Pattern id are similar to original SVG Defs." + this.oSvgDefs.getDefs()[i].getId());
							}

							this.oGantt.getTable().getRows().forEach(function(oRow, index) {
								oRow.getAggregation("_settings").getShapes1().forEach(function(oShape) {
									assert.ok(oShape.getFill(), "Current Fill Pattern for the main Gantt Row " + (index + 1) + "is" + oShape.getFill());
								});
							});

							this.printGantt = new GanttPrinting({
								ganttChart: this.oGantt
							});
							iDefsCount = 0;
							return this.printGantt.open().then(function () {
								assert.equal(this.printGantt._oGanttCanvas.width, parseFloat(this.printGantt._oGanttCanvas.style.width) * 2, "Canvas Width of html2canvas has been scaled by 2.");
								assert.equal(this.printGantt._oGanttCanvas.height, parseFloat(this.printGantt._oGanttCanvas.style.height) * 2, "Canvas Height of html2canvas has been scaled by 2.");

								var aChildElements = this.printGantt._ganttChartClone.getDomRef().querySelector(".sapGanttChartSvgDefs").childNodes;
								for (var i = 0; i < aChildElements.length; i++) {
									if (aChildElements[i].nodeName === "defs") {
										iDefsCount++;
										assert.ok(iDefsCount, " " + iDefsCount + "defs should be added.");
										if (aChildElements[i].id.length  > 0) {
											assert.equal(aChildElements[i].children.length , 4, "4 pattern should be added fo the SlashPattern.");
											aPaintServerDefsPattern = aChildElements[i].children;
										}
									}
								}
								for (var i = 0; i < aPaintServerDefsPattern.length; i++) {
									assert.equal(aPaintServerDefsPattern[i].id, this.oSvgDefs.getDefs()[i].getId(), "Pattern id are similar to original SVG Defs." + this.oSvgDefs.getDefs()[i].getId());
								}

								this.printGantt._ganttChartClone.getTable().getRows().forEach(function(oRow) {
									oRow.getAggregation("_settings").getShapes1().forEach(function(oShape) {
										assert.ok(oShape.getFill(), "Current Fill Pattern is" + oShape.getFill());
									});
								});

								resetGanttPrinting(this.printGantt);
								iDefsCount = 0;
								this.oGantt.getTable().getRows().forEach(function(oRow) {
									oRow.getAggregation("_settings").getShapes1().forEach(function(oShape) {
										oShape.setFill("url(#testing_1)");
									});
								});
								this.oGantt.getTable().getRowSettingsTemplate().getShapes1()[0].setFill("url(#testing_1)");
								return utils.waitForGanttRendered(this.oGantt).then(function () {
									setTimeout(function () {
										var aChildElements = this.oGantt.getDomRef().querySelector(".sapGanttChartSvgDefs").childNodes;
										for (var i = 0; i < aChildElements.length; i++) {
											if (aChildElements[i].nodeName === "defs") {
												iDefsCount++;
												assert.ok(iDefsCount, " " + iDefsCount + "defs should be added.");
												if (aChildElements[i].id.length  > 0) {
													assert.equal(aChildElements[i].children.length , 4, "4 pattern should be added fo the SlashPattern.");
													aPaintServerDefsPattern = aChildElements[i].children;
												}
											}
										}
										for (var i = 0; i < aPaintServerDefsPattern.length; i++) {
											assert.equal(aPaintServerDefsPattern[i].id, this.oSvgDefs.getDefs()[i].getId(), "Pattern id are similar to original SVG Defs." + this.oSvgDefs.getDefs()[i].getId());
										}

										this.oGantt.getTable().getRows().forEach(function(oRow, index) {
											oRow.getAggregation("_settings").getShapes1().forEach(function(oShape) {
												assert.ok(oShape.getFill(), "Current Fill Pattern for the main Gantt Row " + (index + 1) + "is" + oShape.getFill());
											});
										});

										this.printGantt = new GanttPrinting({
											ganttChart: this.oGantt
										});
										iDefsCount = 0;
										return this.printGantt.open().then(function () {
											assert.equal(this.printGantt._oGanttCanvas.width, parseFloat(this.printGantt._oGanttCanvas.style.width) * 2, "Canvas Width of html2canvas has been scaled by 2.");
											assert.equal(this.printGantt._oGanttCanvas.height, parseFloat(this.printGantt._oGanttCanvas.style.height) * 2, "Canvas Height of html2canvas has been scaled by 2.");

											var aChildElements = this.printGantt._ganttChartClone.getDomRef().querySelector(".sapGanttChartSvgDefs").childNodes;
											for (var i = 0; i < aChildElements.length; i++) {
												if (aChildElements[i].nodeName === "defs") {
													iDefsCount++;
													assert.ok(iDefsCount, " " + iDefsCount + "defs should be added.");
													if (aChildElements[i].id.length  > 0) {
														assert.equal(aChildElements[i].children.length , 4, "4 pattern should be added fo the SlashPattern.");
														aPaintServerDefsPattern = aChildElements[i].children;
													}
												}
											}
											for (var i = 0; i < aPaintServerDefsPattern.length; i++) {
												assert.equal(aPaintServerDefsPattern[i].id, this.oSvgDefs.getDefs()[i].getId(), "Pattern id are similar to original SVG Defs." + this.oSvgDefs.getDefs()[i].getId());
											}

											this.printGantt._ganttChartClone.getTable().getRows().forEach(function(oRow) {
												oRow.getAggregation("_settings").getShapes1().forEach(function(oShape) {
													assert.ok(oShape.getFill(), "Current Fill Pattern is" + oShape.getFill());
												});
											});

											resetGanttPrinting(this.printGantt);
											iDefsCount = 0;
											this.oGantt.getTable().getRows().forEach(function(oRow) {
												oRow.getAggregation("_settings").getShapes1().forEach(function(oShape) {
													oShape.setFill("url(#testing-1)");
												});
											});
											this.oGantt.getTable().getRowSettingsTemplate().getShapes1()[0].setFill("url(#testing-1)");
											return utils.waitForGanttRendered(this.oGantt).then(function () {
												setTimeout(function () {
													var aChildElements = this.oGantt.getDomRef().querySelector(".sapGanttChartSvgDefs").childNodes;
													for (var i = 0; i < aChildElements.length; i++) {
														if (aChildElements[i].nodeName === "defs") {
															iDefsCount++;
															assert.ok(iDefsCount, " " + iDefsCount + "defs should be added.");
															if (aChildElements[i].id.length  > 0) {
																assert.equal(aChildElements[i].children.length , 4, "4 pattern should be added fo the SlashPattern.");
																aPaintServerDefsPattern = aChildElements[i].children;
															}
														}
													}
													for (var i = 0; i < aPaintServerDefsPattern.length; i++) {
														assert.equal(aPaintServerDefsPattern[i].id, this.oSvgDefs.getDefs()[i].getId(), "Pattern id are similar to original SVG Defs." + this.oSvgDefs.getDefs()[i].getId());
													}

													this.oGantt.getTable().getRows().forEach(function(oRow, index) {
														oRow.getAggregation("_settings").getShapes1().forEach(function(oShape) {
															assert.ok(oShape.getFill(), "Current Fill Pattern for the main Gantt Row " + (index + 1) + "is" + oShape.getFill());
														});
													});

													this.printGantt = new GanttPrinting({
														ganttChart: this.oGantt
													});
													iDefsCount = 0;
													return this.printGantt.open().then(function () {
														assert.equal(this.printGantt._oGanttCanvas.width, parseFloat(this.printGantt._oGanttCanvas.style.width) * 2, "Canvas Width of html2canvas has been scaled by 2.");
														assert.equal(this.printGantt._oGanttCanvas.height, parseFloat(this.printGantt._oGanttCanvas.style.height) * 2, "Canvas Height of html2canvas has been scaled by 2.");

														var aChildElements = this.printGantt._ganttChartClone.getDomRef().querySelector(".sapGanttChartSvgDefs").childNodes;
														for (var i = 0; i < aChildElements.length; i++) {
															if (aChildElements[i].nodeName === "defs") {
																iDefsCount++;
																assert.ok(iDefsCount, " " + iDefsCount + "defs should be added.");
																if (aChildElements[i].id.length  > 0) {
																	assert.equal(aChildElements[i].children.length , 4, "4 pattern should be added fo the SlashPattern.");
																	aPaintServerDefsPattern = aChildElements[i].children;
																}
															}
														}
														for (var i = 0; i < aPaintServerDefsPattern.length; i++) {
															assert.equal(aPaintServerDefsPattern[i].id, this.oSvgDefs.getDefs()[i].getId(), "Pattern id are similar to original SVG Defs." + this.oSvgDefs.getDefs()[i].getId());
														}

														this.printGantt._ganttChartClone.getTable().getRows().forEach(function(oRow) {
															oRow.getAggregation("_settings").getShapes1().forEach(function(oShape) {
																assert.ok(oShape.getFill(), "Current Fill Pattern is" + oShape.getFill());
															});
														});
														resetGanttPrinting(this.printGantt);
														done();
													}.bind(this));
												}.bind(this), 500); // Upated time to 500 ms to wait for the Gantt to complete loading and Table to update its rows.
											}.bind(this));
										}.bind(this));
									}.bind(this), 500); // Upated time to 500 ms to wait for the Gantt to complete loading and Table to update its rows.
								}.bind(this));
							}.bind(this));
						}.bind(this), 500); // Upated time to 500 ms to wait for the Gantt to complete loading and Table to update its rows.
					}.bind(this));
				}.bind(this));
			}.bind(this), 500); // Upated time to 500 ms to wait for the Gantt to complete loading and Table to update its rows.
		}.bind(this));
	});

	QUnit.module("Rendering - Shape with SlashPattern in GanttChartContainer", {
		beforeEach: function(){
			this.oSvgDefs = new SvgDefs({
				defs: [
					new SlashPattern("testing1", {
					stroke: "#CAC7BA"
					}),
					new SlashPattern("testing", {
						stroke: "red"
					}),
					new BackSlashPattern("testing_1", {
						stroke: "green"
					}),
					new BackSlashPattern("testing-1", {
						stroke: "blue"
					})
				]
			});
			this.oGantt = utils.createGantt(true, new GanttRowSettings({
				rowId: "{Id}",
				shapes1: [
					new BaseRectangle({
						shapeId: "{Id}",
						time: "{StartDate}",
						endTime: "{EndDate}",
						title: "{Name}",
						fill: "url(#testing1)",
						selectable: true,
						connectable: true,
						horizontalTextAlignment: "Start"
					})
				]
			}), true);

			this.oGantt.setPrintingBatchSize(0);

			// limit the total horizon to prevent Gantt being too large
			var oTotalHorizon = this.oGantt.getAxisTimeStrategy().getTotalHorizon();
			var oVisibleHorizon = this.oGantt.getAxisTimeStrategy().getVisibleHorizon();
			var dNewTotalStartTime = Format.abapTimestampToDate(oVisibleHorizon.getStartTime());
			var dNewTotalEndTime = Format.abapTimestampToDate(oVisibleHorizon.getEndTime());
			dNewTotalStartTime.setDate(-7);
			dNewTotalEndTime.setDate(dNewTotalStartTime.getDate() + 7);

			oTotalHorizon.setStartTime(dNewTotalStartTime);
			oTotalHorizon.setEndTime(dNewTotalEndTime);

			// set fixed width to prevent different Gantt rendering on different window size
			document.getElementById("qunit-fixture").style.width = "1920px";

			this.oGanttContainer = new GanttChartContainer({
				ganttCharts: [this.oGantt]
			});

			this.oGanttContainer.setSvgDefs(this.oSvgDefs);

			this.oGanttContainer.placeAt("qunit-fixture");
		},
		afterEach: function(){
			this.oGanttContainer.destroy();
		}
	});

	QUnit.test("PDF Export - Validate slashPatterns", function (assert) {
		var done = assert.async();
		var iDefsCount = 0;
		var aPaintServerDefsPattern;
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			setTimeout(function () {
				var aChildElements = this.oGantt.getDomRef().querySelector(".sapGanttChartSvgDefs").childNodes;
				for (var i = 0; i < aChildElements.length; i++) {
					if (aChildElements[i].nodeName === "defs") {
						iDefsCount++;
						assert.ok(iDefsCount, " " + iDefsCount + "defs should be added.");
						if (aChildElements[i].id.length > 0) {
							assert.equal(aChildElements[i].children.length , 4, "4 pattern should be added fo the SlashPattern.");
							aPaintServerDefsPattern = aChildElements[i].children;
						}
					}
				}
				for (var i = 0; i < aPaintServerDefsPattern.length; i++) {
					assert.equal(aPaintServerDefsPattern[i].id, this.oSvgDefs.getDefs()[i].getId(), "Pattern id are similar to original SVG Defs." + this.oSvgDefs.getDefs()[i].getId());
				}

				this.oGantt.getTable().getRows().forEach(function(oRow, index) {
					oRow.getAggregation("_settings").getShapes1().forEach(function(oShape) {
						assert.ok(oShape.getFill(), "Current Fill Pattern for the main Gantt Row " + (index + 1) + "is" + oShape.getFill());
					});
				});

				this.printGantt = new GanttPrinting({
					ganttChart: this.oGantt
				});
				iDefsCount = 0;
				return this.printGantt.open().then(function () {
					assert.equal(this.printGantt._oGanttCanvas.width, parseFloat(this.printGantt._oGanttCanvas.style.width) * 2, "Canvas Width of html2canvas has been scaled by 2.");
					assert.equal(this.printGantt._oGanttCanvas.height, parseFloat(this.printGantt._oGanttCanvas.style.height) * 2, "Canvas Height of html2canvas has been scaled by 2.");

					var aChildElements = this.printGantt._ganttChartClone.getDomRef().querySelector(".sapGanttChartSvgDefs").childNodes;
					for (var i = 0; i < aChildElements.length; i++) {
						if (aChildElements[i].nodeName === "defs") {
							iDefsCount++;
							assert.ok(iDefsCount, " " + iDefsCount + "defs should be added.");
							if (aChildElements[i].id.length > 0) {
								assert.equal(aChildElements[i].children.length , 4, "4 pattern should be added fo the SlashPattern.");
								aPaintServerDefsPattern = aChildElements[i].children;
							}
						}
					}
					for (var i = 0; i < aPaintServerDefsPattern.length; i++) {
						assert.equal(aPaintServerDefsPattern[i].id, this.oSvgDefs.getDefs()[i].getId(), "Pattern id are similar to original SVG Defs." + this.oSvgDefs.getDefs()[i].getId());
					}

					this.printGantt._ganttChartClone.getTable().getRows().forEach(function(oRow) {
						oRow.getAggregation("_settings").getShapes1().forEach(function(oShape) {
							assert.ok(oShape.getFill(), "Current Fill Pattern is" + oShape.getFill());
						});
					});

					resetGanttPrinting(this.printGantt);
					iDefsCount = 0;
					this.oGantt.getTable().getRows().forEach(function(oRow) {
						oRow.getAggregation("_settings").getShapes1().forEach(function(oShape) {
							oShape.setFill("url(#testing)");
						});
					});
					this.oGantt.getTable().getRowSettingsTemplate().getShapes1()[0].setFill("url(#testing)");
					return utils.waitForGanttRendered(this.oGantt).then(function () {
						setTimeout(function () {
							var aChildElements = this.oGantt.getDomRef().querySelector(".sapGanttChartSvgDefs").childNodes;
							for (var i = 0; i < aChildElements.length; i++) {
								if (aChildElements[i].nodeName === "defs") {
									iDefsCount++;
									assert.ok(iDefsCount, " " + iDefsCount + "defs should be added.");
									if (aChildElements[i].id.length > 0) {
										assert.equal(aChildElements[i].children.length , 4, "4 pattern should be added fo the SlashPattern.");
										aPaintServerDefsPattern = aChildElements[i].children;
									}
								}
							}
							for (var i = 0; i < aPaintServerDefsPattern.length; i++) {
								assert.equal(aPaintServerDefsPattern[i].id, this.oSvgDefs.getDefs()[i].getId(), "Pattern id are similar to original SVG Defs." + this.oSvgDefs.getDefs()[i].getId());
							}

							this.oGantt.getTable().getRows().forEach(function(oRow, index) {
								oRow.getAggregation("_settings").getShapes1().forEach(function(oShape) {
									assert.ok(oShape.getFill(), "Current Fill Pattern for the main Gantt Row " + (index + 1) + "is" + oShape.getFill());
								});
							});

							this.printGantt = new GanttPrinting({
								ganttChart: this.oGantt
							});
							iDefsCount = 0;
							return this.printGantt.open().then(function () {
								assert.equal(this.printGantt._oGanttCanvas.width, parseFloat(this.printGantt._oGanttCanvas.style.width) * 2, "Canvas Width of html2canvas has been scaled by 2.");
								assert.equal(this.printGantt._oGanttCanvas.height, parseFloat(this.printGantt._oGanttCanvas.style.height) * 2, "Canvas Height of html2canvas has been scaled by 2.");

								var aChildElements = this.printGantt._ganttChartClone.getDomRef().querySelector(".sapGanttChartSvgDefs").childNodes;
								for (var i = 0; i < aChildElements.length; i++) {
									if (aChildElements[i].nodeName === "defs") {
										iDefsCount++;
										assert.ok(iDefsCount, " " + iDefsCount + "defs should be added.");
										if (aChildElements[i].id.length > 0) {
											assert.equal(aChildElements[i].children.length , 4, "4 pattern should be added fo the SlashPattern.");
											aPaintServerDefsPattern = aChildElements[i].children;
										}
									}
								}
								for (var i = 0; i < aPaintServerDefsPattern.length; i++) {
									assert.equal(aPaintServerDefsPattern[i].id, this.oSvgDefs.getDefs()[i].getId(), "Pattern id are similar to original SVG Defs." + this.oSvgDefs.getDefs()[i].getId());
								}

								this.printGantt._ganttChartClone.getTable().getRows().forEach(function(oRow) {
									oRow.getAggregation("_settings").getShapes1().forEach(function(oShape) {
										assert.ok(oShape.getFill(), "Current Fill Pattern is" + oShape.getFill());
									});
								});

								resetGanttPrinting(this.printGantt);
								iDefsCount = 0;
								this.oGantt.getTable().getRows().forEach(function(oRow) {
									oRow.getAggregation("_settings").getShapes1().forEach(function(oShape) {
										oShape.setFill("url(#testing_1)");
									});
								});
								this.oGantt.getTable().getRowSettingsTemplate().getShapes1()[0].setFill("url(#testing_1)");
								return utils.waitForGanttRendered(this.oGantt).then(function () {
									setTimeout(function () {
										var aChildElements = this.oGantt.getDomRef().querySelector(".sapGanttChartSvgDefs").childNodes;
										for (var i = 0; i < aChildElements.length; i++) {
											if (aChildElements[i].nodeName === "defs") {
												iDefsCount++;
												assert.ok(iDefsCount, " " + iDefsCount + "defs should be added.");
												if (aChildElements[i].id.length > 0) {
													assert.equal(aChildElements[i].children.length , 4, "4 pattern should be added fo the SlashPattern.");
													aPaintServerDefsPattern = aChildElements[i].children;
												}
											}
										}
										for (var i = 0; i < aPaintServerDefsPattern.length; i++) {
											assert.equal(aPaintServerDefsPattern[i].id, this.oSvgDefs.getDefs()[i].getId(), "Pattern id are similar to original SVG Defs." + this.oSvgDefs.getDefs()[i].getId());
										}

										this.oGantt.getTable().getRows().forEach(function(oRow, index) {
											oRow.getAggregation("_settings").getShapes1().forEach(function(oShape) {
												assert.ok(oShape.getFill(), "Current Fill Pattern for the main Gantt Row " + (index + 1) + "is" + oShape.getFill());
											});
										});

										this.printGantt = new GanttPrinting({
											ganttChart: this.oGantt
										});
										iDefsCount = 0;
										return this.printGantt.open().then(function () {
											assert.equal(this.printGantt._oGanttCanvas.width, parseFloat(this.printGantt._oGanttCanvas.style.width) * 2, "Canvas Width of html2canvas has been scaled by 2.");
											assert.equal(this.printGantt._oGanttCanvas.height, parseFloat(this.printGantt._oGanttCanvas.style.height) * 2, "Canvas Height of html2canvas has been scaled by 2.");

											var aChildElements = this.printGantt._ganttChartClone.getDomRef().querySelector(".sapGanttChartSvgDefs").childNodes;
											for (var i = 0; i < aChildElements.length; i++) {
												if (aChildElements[i].nodeName === "defs") {
													iDefsCount++;
													assert.ok(iDefsCount, " " + iDefsCount + "defs should be added.");
													if (aChildElements[i].id.length > 0) {
														assert.equal(aChildElements[i].children.length , 4, "4 pattern should be added fo the SlashPattern.");
														aPaintServerDefsPattern = aChildElements[i].children;
													}
												}
											}
											for (var i = 0; i < aPaintServerDefsPattern.length; i++) {
												assert.equal(aPaintServerDefsPattern[i].id, this.oSvgDefs.getDefs()[i].getId(), "Pattern id are similar to original SVG Defs." + this.oSvgDefs.getDefs()[i].getId());
											}

											this.printGantt._ganttChartClone.getTable().getRows().forEach(function(oRow) {
												oRow.getAggregation("_settings").getShapes1().forEach(function(oShape) {
													assert.ok(oShape.getFill(), "Current Fill Pattern is" + oShape.getFill());
												});
											});

											resetGanttPrinting(this.printGantt);
											iDefsCount = 0;
											this.oGantt.getTable().getRows().forEach(function(oRow) {
												oRow.getAggregation("_settings").getShapes1().forEach(function(oShape) {
													oShape.setFill("url(#testing-1)");
												});
											});
											this.oGantt.getTable().getRowSettingsTemplate().getShapes1()[0].setFill("url(#testing-1)");
											return utils.waitForGanttRendered(this.oGantt).then(function () {
												setTimeout(function () {
													var aChildElements = this.oGantt.getDomRef().querySelector(".sapGanttChartSvgDefs").childNodes;
													for (var i = 0; i < aChildElements.length; i++) {
														if (aChildElements[i].nodeName === "defs") {
															iDefsCount++;
															assert.ok(iDefsCount, " " + iDefsCount + "defs should be added.");
															if (aChildElements[i].id.length > 0) {
																assert.equal(aChildElements[i].children.length , 4, "4 pattern should be added fo the SlashPattern.");
																aPaintServerDefsPattern = aChildElements[i].children;
															}
														}
													}
													for (var i = 0; i < aPaintServerDefsPattern.length; i++) {
														assert.equal(aPaintServerDefsPattern[i].id, this.oSvgDefs.getDefs()[i].getId(), "Pattern id are similar to original SVG Defs." + this.oSvgDefs.getDefs()[i].getId());
													}

													this.oGantt.getTable().getRows().forEach(function(oRow, index) {
														oRow.getAggregation("_settings").getShapes1().forEach(function(oShape) {
															assert.ok(oShape.getFill(), "Current Fill Pattern for the main Gantt Row " + (index + 1) + "is" + oShape.getFill());
														});
													});

													this.printGantt = new GanttPrinting({
														ganttChart: this.oGantt
													});
													iDefsCount = 0;
													return this.printGantt.open().then(function () {
														assert.equal(this.printGantt._oGanttCanvas.width, parseFloat(this.printGantt._oGanttCanvas.style.width) * 2, "Canvas Width of html2canvas has been scaled by 2.");
														assert.equal(this.printGantt._oGanttCanvas.height, parseFloat(this.printGantt._oGanttCanvas.style.height) * 2, "Canvas Height of html2canvas has been scaled by 2.");

														var aChildElements = this.printGantt._ganttChartClone.getDomRef().querySelector(".sapGanttChartSvgDefs").childNodes;
														for (var i = 0; i < aChildElements.length; i++) {
															if (aChildElements[i].nodeName === "defs") {
																iDefsCount++;
																assert.ok(iDefsCount, " " + iDefsCount + "defs should be added.");
																if (aChildElements[i].id.length > 0) {
																	assert.equal(aChildElements[i].children.length , 4, "4 pattern should be added fo the SlashPattern.");
																	aPaintServerDefsPattern = aChildElements[i].children;
																}
															}
														}
														for (var i = 0; i < aPaintServerDefsPattern.length; i++) {
															assert.equal(aPaintServerDefsPattern[i].id, this.oSvgDefs.getDefs()[i].getId(), "Pattern id are similar to original SVG Defs." + this.oSvgDefs.getDefs()[i].getId());
														}

														this.printGantt._ganttChartClone.getTable().getRows().forEach(function(oRow) {
															oRow.getAggregation("_settings").getShapes1().forEach(function(oShape) {
																assert.ok(oShape.getFill(), "Current Fill Pattern is" + oShape.getFill());
															});
														});
														resetGanttPrinting(this.printGantt);
														done();
													}.bind(this));
												}.bind(this), 500); // Upated time to 500 ms to wait for the Gantt to complete loading and Table to update its rows.
											}.bind(this));
										}.bind(this));
									}.bind(this), 500); // Upated time to 500 ms to wait for the Gantt to complete loading and Table to update its rows.
								}.bind(this));
							}.bind(this));
						}.bind(this), 500); // Upated time to 500 ms to wait for the Gantt to complete loading and Table to update its rows.
					}.bind(this));
				}.bind(this));
			}.bind(this), 500); // Upated time to 500 ms to wait for the Gantt to complete loading and Table to update its rows.
		}.bind(this));
	});

	QUnit.module("Rendering - Single Page PDF", {
		beforeEach: function () {
			this.oGantt = utils.createGantt(true, null, true);
			this.oGantt.setEnableChartOverflowToolbar(true);

			// limit the total horizon to prevent Gantt being too large
			var oTotalHorizon = this.oGantt.getAxisTimeStrategy().getTotalHorizon();
			var oVisibleHorizon = this.oGantt.getAxisTimeStrategy().getVisibleHorizon();
			var dNewTotalStartTime = Format.abapTimestampToDate(oVisibleHorizon.getStartTime());
			var dNewTotalEndTime = Format.abapTimestampToDate(oVisibleHorizon.getEndTime());
			dNewTotalStartTime.setDate(dNewTotalStartTime.getDate() - 15);
			dNewTotalEndTime.setDate(dNewTotalEndTime.getDate() + 15);

			oTotalHorizon.setStartTime(dNewTotalStartTime);
			oTotalHorizon.setEndTime(dNewTotalEndTime);

			// set fixed width to prevent different Gantt rendering on different window size
			document.getElementById("qunit-fixture").style.width = "1920px";
			this.oGantt.placeAt("qunit-fixture");
		},
		afterEach: function () {
			utils.destroyGantt();
		}
	});

	QUnit.test("PDF Export dialog - open dialog", function (assert) {
		var fnDone = assert.async();
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			this.oGantt.getTable().expandToLevel(1);
			return utils.waitForGanttRendered(this.oGantt).then(function () {
				this.sut = new GanttPrinting({
					ganttChart: this.oGantt
				});
				return this.sut.openPdfPreview().then(async function () {
					await nextUIUpdate();
					var oAxisTimeStrategy = this.oGantt.getAxisTimeStrategy();
					var oCloneAxisTimeStrategy = this.sut._ganttChartClone.getAxisTimeStrategy();
					assert.strictEqual(document.getElementById(this.sut._ganttChartClone.getId() + "-ganttHeaderOverflowToolbar"), null, "Cloned gantt chart should not have overflow toolbar");
					assert.strictEqual(oCloneAxisTimeStrategy.getTotalHorizon().getStartTime(), oAxisTimeStrategy.getTotalHorizon().getStartTime(), "Cloned gantt total horizon start time should be same as original gantt total horizon start time");
					assert.strictEqual(oCloneAxisTimeStrategy.getTotalHorizon().getEndTime(), oAxisTimeStrategy.getTotalHorizon().getEndTime(), "Cloned gantt total horizon end time should be same as original gantt total horizon end time");
					assert.strictEqual(oCloneAxisTimeStrategy.getVisibleHorizon().getStartTime(), oAxisTimeStrategy.getTotalHorizon().getStartTime(), "Cloned gantt visible horizon start time should be same as original gantt total horizon start time");
					assert.strictEqual(oCloneAxisTimeStrategy.getVisibleHorizon().getEndTime(), oAxisTimeStrategy.getTotalHorizon().getEndTime(), "Cloned gantt visible horizon end time should be same as original gantt total horizon end time");

					assert.ok(
						this.sut._oDomToPrint[0].getElementsByClassName("rowBackgrounds")[0].children.length >= 24,
						"Cloned Gantt should have at least 24 rows rendered (8 + 16 expanded)."
					);
					assert.strictEqual(
						this.sut._oDomToPrint[0].getElementsByClassName("sapGanttChartShapes")[0].children.length, 24,
						"Cloned Gantt should have 24 shapes rendered."
					);
					assert.strictEqual(
						document.getElementById(this.sut.getId() + "-progressDialog"), null,
						"Progress indicator shouldn't be there for large printing batch size."
					);

					resetGanttPrinting(this.sut);
					fnDone();
				}.bind(this));
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("PDF Export - Validate Missing Table Binding", function (assert) {
		var fnDone = assert.async();
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			this.sut = new GanttPrinting({
				ganttChart: this.oGantt
			});
			this.sut._ganttChartClone.getTable().getBindingInfo("rows").binding = null;
			return this.sut.openPdfPreview().then(function () {
				assert.ok(this.sut._ganttChartClone.getTable().getBindingInfo("rows").binding != null, "The binding of the table has been updated accordingly.");
				assert.strictEqual(this.sut._oDomToPrint[0].getElementsByClassName("sapGanttChartShapes")[0].children.length, 8, "Cloned Gantt should have 8 shapes rendered.");
				resetGanttPrinting(this.sut);
				fnDone();
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("PDF Export - Validate Missing Table Binding when Gantt chart is too large", function (assert) {
		// Increase the total horizon to make Gantt chart large
		var oTotalHorizon = this.oGantt.getAxisTimeStrategy().getTotalHorizon();
		var oVisibleHorizon = this.oGantt.getAxisTimeStrategy().getVisibleHorizon();
		var dNewTotalStartTime = Format.abapTimestampToDate(oVisibleHorizon.getStartTime());
		var dNewTotalEndTime = Format.abapTimestampToDate(oVisibleHorizon.getEndTime());
		dNewTotalStartTime.setDate(-7);
		dNewTotalEndTime.setDate(dNewTotalStartTime.getDate() + 700);

		oTotalHorizon.setStartTime(dNewTotalStartTime);
		oTotalHorizon.setEndTime(dNewTotalEndTime);

		return utils.waitForGanttRendered(this.oGantt).then(function () {
			this.sut = new GanttPrinting({
				ganttChart: this.oGantt
			});
			this.sut._ganttChartClone.getTable().getBindingInfo("rows").binding = null;
			return this.sut.openPdfPreview().then(function () {
				assert.ok(this.sut._ganttChartClone.getTable().getBindingInfo("rows").binding != null, "The binding of the table has been updated accordingly.");
				resetGanttPrinting(this.sut);
			}.bind(this));
		}.bind(this));
	});

	QUnit.module("Rendering - Path elements on single page PDF", {
		beforeEach: function () {
			this.oGantt = utils.createGantt(true, new GanttRowSettings({
				rowId: "{Id}",
				shapes1: [
					new BaseRectangle({
						shapeId: "{Id}",
						time: "{StartDate}",
						endTime: "{EndDate}",
						title: "{Name}",
						fill: "green",
						selectable: true,
						connectable: true
					})
				],
				relationships: [
					new Relationship({
						shapeId: "rel-1",
						type: "FinishToStart",
						predecessor: "0",
						successor: "2",
						shapeTypeStart: "Square",
						shapeTypeEnd: "Circle",
						endShapeColor: "rgb(255, 0, 0)",
						startShapeColor: "rgb(0, 0, 255)"
					})
				]
			}), true);

			// limit the total horizon to prevent Gantt being too large
			var oTotalHorizon = this.oGantt.getAxisTimeStrategy().getTotalHorizon();
			var oVisibleHorizon = this.oGantt.getAxisTimeStrategy().getVisibleHorizon();
			var dNewTotalStartTime = Format.abapTimestampToDate(oVisibleHorizon.getStartTime());
			var dNewTotalEndTime = Format.abapTimestampToDate(oVisibleHorizon.getEndTime());
			dNewTotalStartTime.setDate(dNewTotalStartTime.getDate() - 15);
			dNewTotalEndTime.setDate(dNewTotalEndTime.getDate() + 15);

			oTotalHorizon.setStartTime(dNewTotalStartTime);
			oTotalHorizon.setEndTime(dNewTotalEndTime);

			// set fixed width to prevent different Gantt rendering on different window size
			document.getElementById("qunit-fixture").style.width = "1920px";
			this.oGantt.placeAt("qunit-fixture");
		},
		afterEach: function () {
			utils.destroyGantt();
		}
	});

	QUnit.test("PDF Export - Validate path element styles", function (assert) {
		var fnDone = assert.async();
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			this.sut = new GanttPrinting({
				ganttChart: this.oGantt
			});
			return this.sut.openPdfPreview().then(function () {
				var oRelationshipPathDom = document.getElementsByClassName("sapGanttChartRls")[1].getElementsByTagName("path");
				Array.prototype.slice.call(oRelationshipPathDom).forEach(function(oPathDom) {
					if (oPathDom.style.d) {
						this.sut._setStyleToPath(oPathDom);
						assert.strictEqual(oPathDom.style.d, "", "Path should not have d as style");
					}
				}.bind(this));
				assert.strictEqual(oRelationshipPathDom[1].style.fill, "none", "Correct fill style");
				assert.strictEqual(oRelationshipPathDom[2].style.fill, "rgb(0, 0, 255)", "Correct fill style");
				assert.strictEqual(oRelationshipPathDom[3].style.fill, "rgb(255, 0, 0)", "Correct fill style");
				resetGanttPrinting(this.sut);
				fnDone();
			}.bind(this));
		}.bind(this));
	});

	QUnit.module("Header and Footer", {
		beforeEach: function () {
			this.oGantt = utils.createGantt(true, null, true);
			this.oGantt.setEnableChartOverflowToolbar(true);

			// limit the total horizon to prevent Gantt being too large
			var oTotalHorizon = this.oGantt.getAxisTimeStrategy().getTotalHorizon();
			var oVisibleHorizon = this.oGantt.getAxisTimeStrategy().getVisibleHorizon();
			var dNewTotalStartTime = Format.abapTimestampToDate(oVisibleHorizon.getStartTime());
			var dNewTotalEndTime = Format.abapTimestampToDate(oVisibleHorizon.getEndTime());
			dNewTotalStartTime.setDate(dNewTotalStartTime.getDate() - 15);
			dNewTotalEndTime.setDate(dNewTotalEndTime.getDate() + 15);

			oTotalHorizon.setStartTime(dNewTotalStartTime);
			oTotalHorizon.setEndTime(dNewTotalEndTime);

			// set fixed width to prevent different Gantt rendering on different window size
			document.getElementById("qunit-fixture").style.width = "1920px";
			this.oGantt.placeAt("qunit-fixture");
		},
		afterEach: function () {
			utils.destroyGantt();
		}
	});

	QUnit.test("Validate Header/Footer", function (assert) {
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			this.sut = new GanttPrinting({
				ganttChart: this.oGantt
			});
			return this.sut.open().then(async function () {
				await nextUIUpdate();

				// paragraph in header with more than 190(maximum limit) characters
				var oHeader = this.sut._oDialog.getContent()[0].getItems()[1].getContent()[0].getItems()[17].getItems()[1];
				oHeader.setEnabled(true);
				oHeader.setValue("The computer is one of the marvels of modern science. Its origin may be traced to the mechanical calculating machine that was invented by Charles Babbage, an English mathematician, in 1834.The paragraph");
				oHeader.fireLiveChange();

				// paragraph in footer with more than 190(maximum limit) characters
				var oFooter = this.sut._oDialog.getContent()[0].getItems()[1].getContent()[0].getItems()[18].getItems()[1];
				oFooter.setEnabled(true);
				oFooter.setValue("The computer is one of the marvels of modern science. Its origin may be traced to the mechanical calculating machine that was invented by Charles Babbage, an English mathematician, in 1834.The paragraph");
				oFooter.fireLiveChange();

				var fnPress = new Press();

				return utils.waitForGanttRendered(this.sut._ganttChartClone).then(function () {
					return new Promise(function (fnResolve) {
						// wait for the busy indicator of the canvas preview
						var iIntervalId = setInterval(function () {
							if (!this.sut._oFlexBoxPreview.getBusy()) {
								clearInterval(iIntervalId);
								fnResolve();
							}
						}.bind(this), 100);
					}.bind(this)).then(function () {
						assert.strictEqual(this.sut._oModel.getData().headerText.length, 190, "Header with max length 190 allowed");
						assert.strictEqual(this.sut._oModel.getData().footerText.length, 190, "Footer with max length 190 allowed");

						//change paper width
						fnPress.executeOn(this.sut._oComboBoxPaperSizes);
						fnPress.executeOn(this.sut._oComboBoxPaperSizes._getList().getItems()[0]);

						var fXTextPosition = this.sut._mHeaderFooterInfo.position;

						//change paper margins
						this.sut._oInputMarginTop.setValue("10");
						this.sut._oInputMarginTop.fireChange();
						this.sut._oInputMarginBottom.setValue("10");
						this.sut._oInputMarginBottom.fireChange();
						this.sut._oInputMarginLeft.setValue("20");
						this.sut._oInputMarginLeft.fireChange();
						this.sut._oInputMarginRight.setValue("20");
						this.sut._oInputMarginRight.fireChange();

						return utils.waitForGanttRendered(this.sut._ganttChartClone).then(function () {
							return new Promise(function (fnResolve) {
								// wait for the busy indicator of the canvas preview
								var iIntervalId = setInterval(function () {
									if (!this.sut._oFlexBoxPreview.getBusy()) {
										clearInterval(iIntervalId);
										fnResolve();
									}
								}.bind(this), 100);
							}.bind(this)).then(function () {
								assert.strictEqual(this.sut._mHeaderFooterInfo.headerText.slice(this.sut._mHeaderFooterInfo.headerText.length - 3), "...", "Header text ends with ellipses(...) for lesser paper width");
								assert.strictEqual(this.sut._mHeaderFooterInfo.footerText.slice(this.sut._mHeaderFooterInfo.footerText.length - 3), "...", "Footer text ends with ellipses(...) for lesser paper width");
								assert.strictEqual(this.sut._mHeaderFooterInfo.position, fXTextPosition, "Header/Footer does not move with change in margins");

								resetGanttPrinting(this.sut);
							}.bind(this));
						}.bind(this));
					}.bind(this));
				}.bind(this));
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("Validate Header/Footer in Single Page Printing", function (assert) {
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			this.sut = new GanttPrinting({
				ganttChart: this.oGantt
			});
			return this.sut.openPdfPreview().then(async function () {
				await nextUIUpdate();

				var oHeader = this.sut._oDialog.getContent()[0].getItems()[1].getContent()[0].getItems()[9].getItems()[1];
				oHeader.setEnabled(true);
				oHeader.setValue("The computer is one of the marvels of modern science. Its origin may be traced to the mechanical calculating machine that was invented by Charles Babbage, an English mathematician, in 1834.The paragraph");
				oHeader.fireLiveChange();

				var oFooter = this.sut._oDialog.getContent()[0].getItems()[1].getContent()[0].getItems()[10].getItems()[1];
				oFooter.setEnabled(true);
				oFooter.setValue("The computer is one of the marvels of modern science. Its origin may be traced to the mechanical calculating machine that was invented by Charles Babbage, an English mathematician, in 1834.The paragraph");
				oFooter.fireLiveChange();

				return utils.waitForGanttRendered(this.sut._ganttChartClone).then(function () {
					assert.strictEqual(this.sut._oModel.getData().headerText.length, 190, "Header with max length 190 allowed");
					assert.strictEqual(this.sut._oModel.getData().footerText.length, 190, "Footer with max length 190 allowed");

					//change paper width
					this.sut._oInputPaperWidth.setValue(150);
					this.sut._oInputPaperWidth.fireChange();

					var fXTextPosition = this.sut._mHeaderFooterInfo.position;

					//change paper margins
					this.sut._oInputMarginTop.setValue("10");
					this.sut._oInputMarginTop.fireChange();
					this.sut._oInputMarginBottom.setValue("10");
					this.sut._oInputMarginBottom.fireChange();
					this.sut._oInputMarginLeft.setValue("20");
					this.sut._oInputMarginLeft.fireChange();
					this.sut._oInputMarginRight.setValue("20");
					this.sut._oInputMarginRight.fireChange();

					return utils.waitForGanttRendered(this.sut._ganttChartClone).then(function () {
						assert.strictEqual((this.sut._mHeaderFooterInfo.oPdf.getPageWidth() / this.sut._oModel.getProperty("/paperWidth")).toFixed(2), "0.56", "Correct ratio to convert px to pt");
						assert.strictEqual((this.sut._mHeaderFooterInfo.oPdf.getPageHeight() / this.sut._oModel.getProperty("/paperHeight")).toFixed(2), "0.56", "Correct ratio to convert px to pt");
						assert.strictEqual(this.sut._oModel.getData().marginTop * 0.56, this.sut._pageMargin[0], "Margin Top is scaled");
						assert.strictEqual(this.sut._oModel.getData().marginRight * 0.56, this.sut._pageMargin[1], "Margin Right is scaled");
						assert.strictEqual(this.sut._oModel.getData().marginBottom * 0.56, this.sut._pageMargin[2], "Margin Bottom is scaled");
						assert.strictEqual(this.sut._oModel.getData().marginLeft * 0.56, this.sut._pageMargin[3], "Margin Left is scaled");
						assert.strictEqual(this.sut._mHeaderFooterInfo.oPdf.getFontSize(), 6.5, "Font Size of Header/Footer in Single Page is set to 6.5");
						assert.strictEqual(this.sut._mHeaderFooterInfo.position, fXTextPosition, "Header/Footer does not move with change in margins");
						assert.strictEqual(this.sut._mHeaderFooterInfo.headerText.slice(this.sut._mHeaderFooterInfo.headerText.length - 3), "...", "Header text ends with ellipses(...) for lesser paper width");
						assert.strictEqual(this.sut._mHeaderFooterInfo.footerText.slice(this.sut._mHeaderFooterInfo.footerText.length - 3), "...", "Footer text ends with ellipses(...) for lesser paper width");
						resetGanttPrinting(this.sut);
					}.bind(this));
				}.bind(this));
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("Validate single page in pdf", function (assert) {
		var done = assert.async();
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			this.sut = new GanttPrinting({ ganttChart: this.oGantt });
			return this.sut.openPdfPreview().then(function () {
				var oPdf = this.sut._mHeaderFooterInfo.oPdf;
				oPdf.addPage(); var oJSPDFhtmlStub = sinon.stub(oPdf, "html");
				sinon.stub(this.sut, "_updatePdfPreview");
				setTimeout(function () {
					var fnCallback = oJSPDFhtmlStub.getCall(0).args[1].callback;
					assert.equal(oPdf.getNumberOfPages(), 2, "More than 1 page");
					fnCallback(this.sut._mHeaderFooterInfo.oPdf);
					assert.equal(oPdf.getNumberOfPages(), 1, "Only 1 page in single page pdf");
					resetGanttPrinting(this.sut);
					done();
				}.bind(this), 500);
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("Validate gantt svg clipping in single page pdf", function (assert) {
		var done = assert.async();
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			this.sut = new GanttPrinting({ ganttChart: this.oGantt });
			return this.sut.openPdfPreview().then(function () {
				var oPdf = this.sut._mHeaderFooterInfo.oPdf;
				sinon.stub(oPdf, "html");
				setTimeout(function () {
					var oMergedSVG = this.sut._mHeaderFooterInfo.mergedSVG;
					var oClipRectDef = oMergedSVG.lastChild.firstChild;
					assert.strictEqual(oMergedSVG.getAttribute("clip-path"), "url(#" + oClipRectDef.id + ")", "Correct clip path def");
					assert.strictEqual(oClipRectDef.firstChild.getAttribute("width"), this.sut._oDomToPrint[0].getElementsByTagName("section")[1].style.width.slice(0,-2), "Correct width of clip rect");
					assert.strictEqual(Number(oClipRectDef.firstChild.getAttribute("height")), this.sut._oDomToPrintHeight, "Correct height of clip rect");
					resetGanttPrinting(this.sut);
					done();
				}.bind(this), 500);
			}.bind(this));
		}.bind(this));
	});
	QUnit.test("Validate rowContentHeight in rowMode", function (assert) {
		var done = assert.async();
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			this.sut = new GanttPrinting({ ganttChart: this.oGantt });
			return this.sut.open().then(function () {
				var oClonedGantt = this.sut._ganttChartClone;
				var oOriginalGantt = this.oGantt;
				assert.ok(oClonedGantt.getTable().getRowMode().getRowContentHeight() > 0, "Row content height is set for row mode");
				assert.strictEqual(oClonedGantt.getTable().getRowMode().getRowContentHeight(), Math.ceil(oOriginalGantt.getTableRowHeights()[0]), "RowcontentHeight is same as original Gantt");
				resetGanttPrinting(this.sut);
				done();
			}.bind(this));
		}.bind(this));
	});
	QUnit.test("Validate rowContentHeight in rowMode for single page pdf", function (assert) {
		var done = assert.async();
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			this.sut = new GanttPrinting({ ganttChart: this.oGantt });
			return this.sut.openPdfPreview().then(function () {
				var oClonedGantt = this.sut._ganttChartClone;
				var oOriginalGantt = this.oGantt;
				assert.ok(oClonedGantt.getTable().getRowMode().getRowContentHeight() > 0, "Row content height is set for row mode");
				assert.strictEqual(oClonedGantt.getTable().getRowMode().getRowContentHeight(), Math.ceil(oOriginalGantt.getTableRowHeights()[0]), "RowcontentHeight is same as original Gantt");
				resetGanttPrinting(this.sut);
				done();
			}.bind(this));
		}.bind(this));
	});
	QUnit.test("Validate decimal numbers in paper height and width input", function (assert) {
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			this.sut = new GanttPrinting({ ganttChart: this.oGantt });
			return this.sut.open().then(function () {
				this.sut._oInputPaperWidth.setValue(100.5);
				this.sut._oInputPaperWidth.fireChange();
				this.sut._oInputPaperHeight.setValue(50.5);
				this.sut._oInputPaperHeight.fireChange();
				var iPageRowCount =  this.sut._getPagesInARow();
				var iPageColCount =  this.sut._getPagesInAColumn();
				GanttChartConfigurationUtils.setABAPNumberFormat("Y");	// setting ',' as decimal separator
				this.sut._oInputPaperWidth.setValue(100.50);
				this.sut._oInputPaperWidth.fireChange();
				this.sut._oInputPaperHeight.setValue(50.50);
				this.sut._oInputPaperHeight.fireChange();
				assert.strictEqual(this.sut._getPagesInARow(), iPageRowCount, "Correct number of pages in a row irrespective of decimal separator");
				assert.strictEqual(this.sut._getPagesInAColumn(), iPageColCount, "Correct number of pages in a column irrespective of decimal separator");
				GanttChartConfigurationUtils.setABAPNumberFormat();
				resetGanttPrinting(this.sut);
			}.bind(this));
		}.bind(this));
	});

	QUnit.module("PDF export Save configuration", {
		beforeEach: function(){
			this.oGantt = utils.createGantt(true, null, true);

			// Limits the total horizon to prevent the Gantt chart from being too large.
			var oTotalHorizon = this.oGantt.getAxisTimeStrategy().getTotalHorizon();
			var oVisibleHorizon = this.oGantt.getAxisTimeStrategy().getVisibleHorizon();
			var dNewTotalStartTime = Format.abapTimestampToDate(oVisibleHorizon.getStartTime());
			var dNewTotalEndTime = Format.abapTimestampToDate(oVisibleHorizon.getEndTime());
			dNewTotalStartTime.setDate(-7);
			dNewTotalEndTime.setDate(dNewTotalStartTime.getDate() + 7);

			oTotalHorizon.setStartTime(dNewTotalStartTime);
			oTotalHorizon.setEndTime(dNewTotalEndTime);

			//Sets fixed width to prevent Gantt from rendering differently on different window size.
			document.getElementById("qunit-fixture").style.width = "1920px";

			this.oGanttContainer = new GanttChartContainer({
				toolbar: new ContainerToolbar({
					showDisplayTypeButton: true
				}),
				ganttCharts: [this.oGantt]
			});
			this.oGanttContainer.placeAt("qunit-fixture");
		},
		afterEach: function(){
			this.oGanttContainer.destroy();
		}
	});

	QUnit.test("Validate aggregations of PDF export Save configuration", function (assert) {
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			this.sut = new GanttPrinting({ ganttChart: this.oGantt });
			return this.sut.open(null,new PrintDialogTemplate({
				footerButtons: [
					new Button({
						text: "Save"
					})
				]
			})).then(async function () {
				await nextUIUpdate();
				assert.equal(this.sut._footerButtons.length,1, "Custom buttons are added");
				assert.equal(this.sut._oDialog.getButtons()[0].getText(),"Save", "Print button text is correct");
				resetGanttPrinting(this.sut);
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("Validate methods of PDF export Save configuration", function (assert) {
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			this.sut = new GanttPrinting({ ganttChart: this.oGantt });
			var oData = new PrintConfig({
				pageConfig:{
					"portrait": false,
					"paperSize": "A2",
					"paperWidth": 50,
					"paperHeight": 100
				}
			});
			this.sut.setPrintData(oData);
			return this.sut.open(null,new PrintDialogTemplate({
				footerButtons: [
					new Button({
						text: "Save"
					})
				]
			})).then(async function () {
				await nextUIUpdate();
				var returnedData = this.sut.getPrintData().pageConfig;
				assert.equal(returnedData['portrait'],false, "portrait data is set correctly");
				assert.equal(returnedData['paperSize'],"A2", "paperSize data is set correctly");
				assert.equal(returnedData['paperWidth'],420, "A2 paperWidth is set correctly");
				assert.equal(returnedData['paperHeight'],594, "A2 paperHeight is set correctly");
				resetGanttPrinting(this.sut);
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("Validate aggregations of PDF export Save configuration - Single Page", function (assert) {
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			this.sut = new GanttPrinting({ ganttChart: this.oGantt });
			return this.sut.openPdfPreview(null,new PrintDialogTemplate({
				footerButtons: [
					new Button({
						text: "Save"
					})
				]
			})).then(async function () {
				await nextUIUpdate();
				assert.equal(this.sut._footerButtons.length,1, "Custom buttons are added");
				assert.equal(this.sut._oDialog.getButtons()[0].getText(),"Save", "Print button text is correct");
				resetGanttPrinting(this.sut);
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("Validate methods of PDF export Save configuration - Single Page", function (assert) {
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			this.sut = new GanttPrinting({ ganttChart: this.oGantt });
			var oData = new PrintConfig({
				pageConfig:{
					"portrait": false,
					"paperSize": "A2",
					"paperWidth": 50,
					"paperHeight": 100
				}
			});
			this.sut.setPrintData(oData);
			return this.sut.openPdfPreview(null,new PrintDialogTemplate({
				footerButtons: [
					new Button({
						text: "Save"
					})
				]
			})).then(async function () {
				await nextUIUpdate();
				var returnedData = this.sut.getPrintData().pageConfig;
				assert.equal(returnedData['portrait'],false, "portrait data is set correctly");
				assert.equal(returnedData['paperSize'],"A2", "paperSize data is set correctly");
				assert.equal(returnedData['paperWidth'],420, "A2 paperWidth is set correctly");
				assert.equal(returnedData['paperHeight'],594, "A2 paperHeight is set correctly");
				resetGanttPrinting(this.sut);
			}.bind(this));
		}.bind(this));
	});

	//Function to reset the GanttChart Printing parameters.
	function resetGanttPrinting(gantt) {
		gantt._ganttChartClone.destroy();
		gantt._ganttChartContainer.destroy();
		document.body.removeChild(gantt._oClonedGanttDiv);
		gantt._oDialog.close();
		gantt._oDialog.destroy();
		gantt.destroy();
	}
});
