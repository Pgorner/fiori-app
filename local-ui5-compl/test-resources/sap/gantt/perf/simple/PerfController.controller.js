sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/table/TreeTable",
	"sap/ui/table/Column",
	"sap/gantt/simple/GanttChartContainer",
	"sap/gantt/simple/GanttChartWithTable",
	"sap/gantt/simple/ContainerToolbar",
	"sap/gantt/simple/BaseImage",
	"sap/gantt/simple/BaseCalendar",
	"sap/gantt/simple/Relationship",
	"sap/gantt/simple/BaseRectangle",
	"sap/gantt/simple/BaseText",
	"sap/gantt/simple/GanttRowSettings",
	"sap/gantt/simple/GanttPrinting",

	"sap/gantt/def/cal/Calendar",
	"sap/gantt/def/cal/TimeInterval",
	"sap/gantt/def/cal/CalendarDefs",

	"sap/gantt/axistime/ProportionZoomStrategy",
	"sap/gantt2/simple/PerfSetting",
	"sap/ui/core/mvc/Controller",
	"sap/gantt/misc/Utility",
	"sap/ui/table/rowmodes/Auto"
], function (JSONModel, TreeTable, Column,
	GanttChartContainer, GanttChartWithTable, ContainerToolbar, BaseImage, BaseCalendar, Relationship, BaseRectangle, BaseText, GanttRowSettings, GanttPrinting,
	Calendar, TimeInterval, CalendarDefs, ProportionZoomStrategy, PerfSetting, Controller, Utility, AutoRowMode) {
		"use strict";

		GanttRowSettings = GanttRowSettings.extend("sap.gantt.simple.test.GanttRowSettings", {
			metadata: {
				aggregations: {
					tasks: { type: "sap.gantt.simple.BaseShape", multiple: true, singularName: "task" },
					texts: { type: "sap.gantt.simple.BaseShape", multiple: true, singularName: "text" },
					warnings: { type: "sap.gantt.simple.BaseShape", multiple: true, singularName: "warning" },
					calendars: { type: "sap.gantt.simple.BaseShape", multiple: true, singularName: "calander" },
					relationships: { type: "sap.gantt.simple.BaseShape", multiple: true, singularName: "relationship" }
				}
			}
		});

		return Controller.extend("sap.gantt2.perf.controller.App", {
			onInit: function () {
				this.oGanttContainer = null;
				this.scenarioId = null;
				this.ALL_SCENARIOS = {
					"scenario1": {
						numberOfRow: 30,
						numberOfShape: 10,
						numberOfColumns: 10,
						levelOfHierarchy: 3,
						numberOfView: 1,
						includeToolbar: false,
						showCalendar: false,
						showWarning: false,
						showText: false,
						showRelationship: true,
						printingBatchSize: 50
					},
					"scenario2": {
						numberOfRow: 10,
						numberOfShape: 10,
						numberOfColumns: 10,
						levelOfHierarchy: 4,
						numberOfView: 1,
						includeToolbar: false,
						showCalendar: false,
						showWarning: false,
						showText: false,
						showRelationship: true,
						printingBatchSize: 50
					},
					"scenario3": {
						numberOfRow: 100,
						numberOfShape: 500,
						numberOfColumns: 50,
						levelOfHierarchy: 1,
						numberOfView: 1,
						includeToolbar: false,
						showCalendar: true,
						showWarning: false,
						showText: true,
						showRelationship: false,
						printingBatchSize: 50
					},
					"scenario4": {
						numberOfRow: 500,
						numberOfShape: 100,
						numberOfColumns: 100,
						levelOfHierarchy: 1,
						numberOfView: 1,
						includeToolbar: false,
						showCalendar: true,
						showWarning: true,
						showText: true,
						showRelationship: false,
						printingBatchSize: 50
					},
					"scenario5": {
						numberOfRow: 250,
						numberOfShape: 100,
						numberOfColumns: 100,
						levelOfHierarchy: 1,
						numberOfView: 1,
						includeToolbar: false,
						showCalendar: true,
						showWarning: true,
						showText: true,
						showRelationship: true,
						printingBatchSize: 50
					},
					"scenario6": {
						numberOfRow: 30000,
						numberOfShape: 10,
						numberOfColumns: 10,
						levelOfHierarchy: 1,
						numberOfView: 1,
						includeToolbar: false,
						showCalendar: false,
						showWarning: false,
						showText: false,
						showRelationship: true,
						printingBatchSize: 50
					},
					"scenario7": {
						numberOfRow: 200,
						numberOfShape: 3,
						numberOfColumns: 5,
						levelOfHierarchy: 1,
						numberOfView: 1,
						includeToolbar: false,
						showCalendar: false,
						showWarning: false,
						showText: false,
						showRelationship: true,
						printingBatchSize: 50
					}
				};
			},

			onExportPDF: function () {
				var oGanttPrinting = new GanttPrinting({
					ganttChart: this.oGanttContainer.getGanttCharts()[0]
				});
				oGanttPrinting.open();
			},

			onExportSinglePagePDF: function () {
				var oGanttPrinting = new GanttPrinting({
					ganttChart: this.oGanttContainer.getGanttCharts()[0]
				});
				oGanttPrinting.openPdfPreview();
			},

			onScenarioChanged: function (oEvent) {
				var oItem = oEvent.getParameter("item");
				var oParent = oItem.getParent();
				var clearIcon = function (oParent) {
					oParent.getItems().forEach(function (oItem) { oItem.setIcon(""); });
				};
				clearIcon(oParent);
				oItem.setIcon("sap-icon://accept");
				this.scenatioId = oItem.getText();
				this.setInfoLabels(true);
			},

			setInfoLabels: function (bScenarioChanged) {
				var oHierarchiesInfoLabel = this.getView().byId("levelOfHierarchy");
				var oRowsInfoLabel = this.getView().byId("numberOfRow");
				var oShapesInfoLabel = this.getView().byId("numberOfShape");
				var oColumnsInfoLabel = this.getView().byId("numberOfColumns");
				var oPrintingBatchSizeLabel = this.getView().byId("printingBatchSize");
				var oRelationshipsInfoLabel = this.getView().byId("numberOfRelationship");
				var oWarningsInfoLabel = this.getView().byId("showWarnings");
				var oCalendarsInfoLabel = this.getView().byId("showCalendars");
				var oTextsInfoLabel = this.getView().byId("showTexts");

				var oCustomizedHierachiesInput = this.getView().byId("customizedHierachies");
				var oCustomizedRowsInput = this.getView().byId("customizedRows");
				var oCustomizedShapesPerRowInput = this.getView().byId("customizedShapesPerRow");
				var oCustomizedColumnsInput = this.getView().byId("customizedColumns");
				var oPrintingBatchSizeInput = this.getView().byId("customizedPrintingBatchSize");

				oHierarchiesInfoLabel.setText("hierarchies: " + (bScenarioChanged ? this.ALL_SCENARIOS[this.scenatioId].levelOfHierarchy : parseInt(this.getView().byId("customizedHierachies").getValue())) + ",");
				oRowsInfoLabel.setText("rows: " + (bScenarioChanged ? this.ALL_SCENARIOS[this.scenatioId].numberOfRow : parseInt(this.getView().byId("customizedRows").getValue())) + ",");
				oShapesInfoLabel.setText("shapes per row: " + (bScenarioChanged ? this.ALL_SCENARIOS[this.scenatioId].numberOfShape : parseInt(this.getView().byId("customizedShapesPerRow").getValue())) + ",");
				oColumnsInfoLabel.setText("Columns: " + (bScenarioChanged ? this.ALL_SCENARIOS[this.scenatioId].numberOfColumns : parseInt(this.getView().byId("customizedColumns").getValue())) + ",");
				oPrintingBatchSizeLabel.setText("Printing Batch Size: " + (bScenarioChanged ? this.ALL_SCENARIOS[this.scenatioId].printingBatchSize : parseInt(this.getView().byId("customizedPrintingBatchSize").getValue())) + ",");
				oRelationshipsInfoLabel.setText("relationships: " + (bScenarioChanged ? this.ALL_SCENARIOS[this.scenatioId].showRelationship : this.getView().byId("relationships").getSelected()) + ",");
				oWarningsInfoLabel.setText("warnings: " + (bScenarioChanged ? this.ALL_SCENARIOS[this.scenatioId].showWarning : this.getView().byId("warnings").getSelected()) + ",");
				oCalendarsInfoLabel.setText("calendars: " + (bScenarioChanged ? this.ALL_SCENARIOS[this.scenatioId].showCalendar : this.getView().byId("calendars").getSelected()) + ",");
				oTextsInfoLabel.setText("texts: " + (bScenarioChanged ? this.ALL_SCENARIOS[this.scenatioId].showText : this.getView().byId("texts").getSelected()));

				oCustomizedHierachiesInput.setValue(bScenarioChanged ? this.ALL_SCENARIOS[this.scenatioId].levelOfHierarchy : parseInt(this.getView().byId("customizedHierachies").getValue()));
				oCustomizedRowsInput.setValue(bScenarioChanged ? this.ALL_SCENARIOS[this.scenatioId].numberOfRow : parseInt(this.getView().byId("customizedRows").getValue()));
				oCustomizedShapesPerRowInput.setValue(bScenarioChanged ? this.ALL_SCENARIOS[this.scenatioId].numberOfShape : parseInt(this.getView().byId("customizedShapesPerRow").getValue()));
				oCustomizedColumnsInput.setValue(bScenarioChanged ? this.ALL_SCENARIOS[this.scenatioId].numberOfColumns : parseInt(this.getView().byId("customizedColumns").getValue()));
				oPrintingBatchSizeInput.setValue(bScenarioChanged ? this.ALL_SCENARIOS[this.scenatioId].printingBatchSize : parseInt(this.getView().byId("customizedPrintingBatchSize").getValue()));

				if (bScenarioChanged) {
					this.getView().byId("relationships").setSelected(this.ALL_SCENARIOS[this.scenatioId].showRelationship);
					this.getView().byId("calendars").setSelected(this.ALL_SCENARIOS[this.scenatioId].showCalendar);
					this.getView().byId("warnings").setSelected(this.ALL_SCENARIOS[this.scenatioId].showWarning);
					this.getView().byId("texts").setSelected(this.ALL_SCENARIOS[this.scenatioId].showText);
				}

			},

			createModel: function () {
				this.getView().setBusy(true);
				var mSettings = Object.assign({}, this.ALL_SCENARIOS[this.scenatioId]);
				mSettings.showRelationship = this.getView().byId("relationships").getSelected();
				mSettings.showCalendar = this.getView().byId("calendars").getSelected();
				mSettings.showWarning = this.getView().byId("warnings").getSelected();
				mSettings.showText = this.getView().byId("texts").getSelected();
				mSettings.levelOfHierarchy = parseInt(this.getView().byId("customizedHierachies").getValue()) || mSettings.levelOfHierarchy;
				mSettings.numberOfRow = parseInt(this.getView().byId("customizedRows").getValue()) || mSettings.numberOfRow;
				mSettings.numberOfShape = parseInt(this.getView().byId("customizedShapesPerRow").getValue()) || mSettings.numberOfShape;
				mSettings.numberOfColumns = parseInt(this.getView().byId("customizedColumns").getValue()) || mSettings.numberOfColumns;
				this.setInfoLabels();
				this.oPerfSetting = new PerfSetting(Object.assign({}, mSettings));
				var oData = this.oPerfSetting.generate();
				this.oModel = new JSONModel();
				this.oModel.setSizeLimit(1000000);
				this.oModel.setData(oData);
				this.getView().setBusy(false);
				this.getView().byId("createGantt").setEnabled(true);
				sap.m.MessageToast.show("Data Created Succesfully!!");
			},

			onAction: function (oEvent) {
				var status = oEvent.getSource().getText();
				if (status === "Create Gantt") {
					this.insertGantt();
					this.bindJSON();
					this.getView().byId("largeDataScroll").setEnabled(true);
					oEvent.getSource().setText("Destroy Gantt");
				} else {
					this.removeGantt();
					this.getView().byId("largeDataScroll").setEnabled(false);
					oEvent.getSource().setText("Create Gantt");
				}
			},

			bindJSON: function () {
				this.oGanttContainer.setModel(this.oModel, "data");
			},

			insertGantt: function () {
				this.createGanttChartContainer();
				var iPrintingBatchSize = parseInt(this.getView().byId("customizedPrintingBatchSize").getValue());
				this.oGanttContainer.getGanttCharts()[0].setPrintingBatchSize(iPrintingBatchSize);
				var oPage = this.getView().byId("page");
				oPage.addContent(this.oGanttContainer);
			},

			removeGantt: function () {
				var oPage = this.getView().byId("page");
				oPage.removeContent(this.oGanttContainer);
			},

			createGanttChartContainer: function () {
				var bRls = this.oPerfSetting.getShowRelationship();
				var bWarning = this.oPerfSetting.getShowWarning();
				var bCalendar = this.oPerfSetting.getShowCalendar();
				var bText = this.oPerfSetting.getShowText();
				var mRowSettings = {
					rowId: "{data>ObjectID}",
					tasks: {
						path: "data>Tasks",
						template: new BaseRectangle({
							selectable: true,
							resizable: true,
							draggable: true,
							fill: "#0092D1",
							time: "{data>StartDate}",
							shapeId: "{data>TaskID}",
							endTime: "{data>EndDate}"
						}),
						templateShareable: true
					}
				};
				if (bRls) {
					mRowSettings.relationships = {
						path: "data>Relationships",
						template: new Relationship({
							selectable: true,
							type: "{data>RelationType}",
							shapeId: "{data>RelationID}",
							predecessor: "{data>PredecTaskID}",
							successor: "{data>SuccTaskID}"
						}),
						templateShareable: true
					};
				}
				if (bWarning) {
					mRowSettings.warnings = {
						path: "data>Warnings",
						template: new BaseImage({
							src: "{data>src}",
							time: "{data>time}"
						}),
						templateShareable: true
					};
				}
				if (bCalendar) {
					mRowSettings.calendars = {
						path: "data>/Calendars",
						template: new BaseCalendar({
							calendarName: "workingDays"
						}),
						templateShareable: true
					};
				}
				if (bText) {
					mRowSettings.texts = {
						path: "data>Texts",
						template: new BaseText({
							text: "{data>Content}",
							time: "{data>StartDate}",
							endTime: "{data>EndDate}"
						}),
						templateShareable: true
					};
				}
				var mRows = {
					path: "data>/root",
					parameters: {
						arrayNames: ["children"]
					}
				};

				var oTableGantt = new GanttChartWithTable({
					table: new TreeTable({
						rowSettingsTemplate: new GanttRowSettings(mRowSettings),
						extension: new sap.m.OverflowToolbar({
							content: [
								new sap.m.Button({
									icon: "sap-icon://expand",
									press: function (oEvent) {
										var oTable = oTableGantt.getTable();
										var aSelectedRows = oTable.getSelectedIndices();
										oTable.expand(aSelectedRows);
									}
								}),
								new sap.m.Button({
									icon: "sap-icon://collapse",
									press: function (oEvent) {
										var oTable = oTableGantt.getTable();
										var aSelectedRows = oTable.getSelectedIndices();
										oTable.collapse(aSelectedRows);
									}
								})
							]
						}),
						rowMode: new AutoRowMode(),
						columns: this.oPerfSetting.columnData,
						rows: mRows
					}),
					axisTimeStrategy: new ProportionZoomStrategy({
						totalHorizon: this.oPerfSetting.getTimeHorizon(),
						visibleHorizon: this.oPerfSetting.getTimeHorizon()
					}),
					shapeResize: onShapeResize,
					shapeDrop: onShapeDrop
				});
				if (bCalendar) {
					oTableGantt.setCalendarDef(new CalendarDefs({
						defs: {
							path: "data>/Calendars",
							template: new Calendar({
								key: "workingDays",
								timeIntervals: {
									path: "data>CalendarInterval",
									template: new TimeInterval({
										startTime: "{data>StartDate}",
										endTime: "{data>EndDate}"
									}),
									templateShareable: true
								}
							})
						}
					}));
				}
				this.oGanttContainer = new GanttChartContainer({
					ganttCharts: [oTableGantt],
					toolbar: new ContainerToolbar()
				});

				function onShapeDrop(oEvent) {
					var oDataModel = this.getModel("data");
					var oNewDateTime = oEvent.getParameter("newDateTime");
					var oDraggedShapeDates = oEvent.getParameter("draggedShapeDates");
					var sLastDraggedShapeUid = oEvent.getParameter("lastDraggedShapeUid");
					var oOldStartDateTime = oDraggedShapeDates[sLastDraggedShapeUid].time;
					var oOldEndDateTime = oDraggedShapeDates[sLastDraggedShapeUid].endTime;
					var iMoveWidthInMs = oNewDateTime.getTime() - oOldStartDateTime.getTime();
					if (oTableGantt.getGhostAlignment() === sap.gantt.dragdrop.GhostAlignment.End) {
						iMoveWidthInMs = oNewDateTime.getTime() - oOldEndDateTime.getTime();
					}

					var getBindingContextPath = function (sShapeUid) {
						var oParsedUid = Utility.parseUid(sShapeUid);
						return oParsedUid.shapeDataName;
					};

					Object.keys(oDraggedShapeDates).forEach(function (sShapeUid) {
						var sPath = getBindingContextPath(sShapeUid);
						var oOldDateTime = oDraggedShapeDates[sShapeUid].time;
						var oOldEndDateTime = oDraggedShapeDates[sShapeUid].endTime;
						var oNewDateTime = new Date(oOldDateTime.getTime() + iMoveWidthInMs);
						var oNewEndDateTime = new Date(oOldEndDateTime.getTime() + iMoveWidthInMs);
						oDataModel.setProperty(sPath + "/StartDate", oNewDateTime, true);
						oDataModel.setProperty(sPath + "/EndDate", oNewEndDateTime, true);
					});
				}

				function onShapeResize(oEvent) {
					var oShape = oEvent.getParameter("shape"),
						aNewTimes = oEvent.getParameter("newTime");
					oShape.setTime(aNewTimes[0]);
					oShape.setEndTime(aNewTimes[1]);
				}
			},
			fnSetLargeDataScrolling: function (oEvent) {
				if (this.oGanttContainer) {
					var status = oEvent.getSource().getText();
					if (status === "Enable Large Data Scroll") {
						this.oGanttContainer.getGanttCharts()[0].setLargeDataScrolling(true);
						oEvent.getSource().setText("Disable Large Data Scroll");
					} else {
						this.oGanttContainer.getGanttCharts()[0].setLargeDataScrolling(false);
						oEvent.getSource().setText("Enable Large Data Scroll");
					}
				}
			}

		});

	});
