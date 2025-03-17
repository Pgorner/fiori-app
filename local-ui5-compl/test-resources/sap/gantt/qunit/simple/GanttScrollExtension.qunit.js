/*global QUnit, sinon*/
sap.ui.define([
	"sap/gantt/simple/BaseRectangle",
	"sap/gantt/simple/BaseChevron",
	"sap/gantt/simple/GanttRowSettings",
	"sap/gantt/simple/test/GanttQUnitUtils",
	"sap/gantt/axistime/ProportionZoomStrategy",
	"sap/gantt/config/TimeHorizon",
	"sap/gantt/simple/GanttChartWithTable",
	"sap/ui/model/json/JSONModel",
	"sap/ui/table/TreeTable",
	"sap/gantt/simple/GanttChartContainer",
	"sap/ui/table/Column",
	"sap/m/Label",
	"sap/m/Panel",
	"sap/ui/table/rowmodes/Auto",
	"sap/gantt/simple/test/nextUIUpdate"
], function (BaseRectangle, BaseChevron, GanttRowSettings, utils,ProportionZoomStrategy,TimeHorizon,
	GanttChartWithTable,JSONModel,TreeTable, GanttChartContainer, Column, Label, Panel, AutoRowMode,nextUIUpdate) {
	"use strict";
	var fnCreateShapeBindingSettings = function () {
		return new GanttRowSettings({
			rowId: "{Id}",
			shapes1: [
				new BaseRectangle({
					shapeId: "{Id}",
					time: "{StartDate}",
					endTime: "{EndDate}",
					title: "{Name}",
					fill: "#008FD3",
					draggable: true,
					selectable: true,
					resizable: true
				})
			]
		});
	};

	QUnit.module("Functions - GanttScrollExtension", {
		beforeEach: function (assert) {
			this.oGanttChart = utils.createGantt(true, fnCreateShapeBindingSettings());

			window.oGanttChart.placeAt("qunit-fixture");
			this.oHandler = utils.createGanttHandler(this, this.oGanttChart);
		},
		afterEach: function (assert) {
			utils.destroyGantt();
			this.oHandler.destroy();
		}
	});

	QUnit.test("Test GanttScrollExtension -- Handle HorizontalMouseWheelScroll event", function (assert) {
		var done = assert.async();

		this.oHandler.onReady(function () {
			// disable zoom extension as it will clash with scroll extension
			var oZoomExtension = this.oGanttChart._getZoomExtension();
			sinon.stub(oZoomExtension, "isMouseWheelZoom").returns(false);

			var oScrollExtension = this.oGanttChart._getScrollExtension();
			var oHSBStub = sinon.stub(oScrollExtension, "getGanttHsb");

			var createStub = function () {
				var stub = {
					scrollLeft: 0
				};

				oHSBStub.returns(stub);

				return stub;
			};

			var fireEvent = function (oEvent) {
				var BrowserEvent = new CustomEvent("wheel", {
					detail: oEvent.detail
				});

				BrowserEvent.shiftKey = oEvent.shiftKey;
				BrowserEvent.ctrlKey = oEvent.ctrlKey;
				BrowserEvent.deltaX = oEvent.deltaX;
				BrowserEvent.deltaY = oEvent.deltaY;

				var stub = createStub();

				this.oGanttChart.getDomRef("svg").dispatchEvent(BrowserEvent);

				return {
					stub: stub
				};
			}.bind(this);

			var step1 = function (_results, callback) {
				// vertical scroll, skip handling
				var oEvent = {
					shiftKey: false,
					ctrlKey: false
				};

				assert.equal(fireEvent(oEvent).stub.scrollLeft, 0, "Scroll event not handled");

				callback();
			};

			var step2 = function (_results, callback) {
				// event should be handled by zoom extension, skip handling
				var oEvent = {
					shiftKey: true,
					ctrlKey: true
				};

				assert.equal(fireEvent(oEvent).stub.scrollLeft, 0, "Scroll event not handled");

				callback();
			};

			var step3 = function (_results, callback) {
				// not a horizontal scroll event, skip handling
				var oEvent = {
					shiftKey: false,
					ctrlKey: true
				};

				assert.equal(fireEvent(oEvent).stub.scrollLeft, 0, "Scroll event not handled");

				callback();
			};

			var step4 = function (_results, callback) {
				// deltaX > deltaY - not a horizontal scroll event, skip handling
				var oEvent = {
					shiftKey: true,
					ctrlKey: false,
					detail: 100,
					deltaX: 300,
					deltaY: 200
				};

				assert.equal(fireEvent(oEvent).stub.scrollLeft, 0, "Scroll event not handled");

				callback();
			};

			var step5 = function (_results, callback) {
				// deltaX < deltaY - horizontal scroll event
				var oEvent = {
					shiftKey: true,
					ctrlKey: false,
					detail: 100,
					deltaX: 200,
					deltaY: 300
				};

				assert.equal(fireEvent(oEvent).stub.scrollLeft, oEvent.deltaY, "Scroll event handled");

				callback();
			};

			this.oHandler.runSeries([step1, step2, step3, step4, step5], done, 100);
		});
	});

	QUnit.module("visibleHorizonUpdate event", {
        beforeEach: function () {
			this.gantt = new GanttChartWithTable({
				table: new TreeTable({
					columns: [
					],
					rowSettingsTemplate: new GanttRowSettings({
						rowId: "0"
					})
				}).bindRows("/root"),
				axisTimeStrategy: new ProportionZoomStrategy({
					totalHorizon: new TimeHorizon({
						startTime: "20131001000000",
						endTime: "20131001001000"
					}),
					visibleHorizon: new TimeHorizon({
						startTime: "20131001000000",
						endTime: "20131001000500"
					})
				})
			});

			var oData = {
				root : {
					name: "root",
					description: "root description",
					0: {
						Shape1ID: "0"
					}
				}
			};

			var oModel = new JSONModel();
			oModel.setData(oData);
			this.gantt.setModel(oModel);
			var oZoomStrategy = this.gantt.getAxisTime().getZoomStrategy();
			 var oOptions = oZoomStrategy.getTimeLineOptions();
			 oZoomStrategy.setFinestTimeLineOption(oOptions["1min"]);
			var sHeight = "500px";
			document.getElementById("qunit-fixture").style.height = sHeight;
			this.gantt.placeAt("qunit-fixture");
        },
        after: function () {
			this.gantt.destroy();
			this.gantt = null;
		}
    });

	QUnit.test("HorizontalScroll fired", function (assert) {
		var fnDone = assert.async();

		return utils.waitForGanttRendered(this.gantt).then(function () {
			var updateHorizon = sinon.spy(this.gantt, "fireVisibleHorizonUpdate");
			var hsb = document.getElementById(this.gantt.getId() + "-hsb");
			hsb.scrollTo(hsb.scrollLeft + 1000, 0);
			// wait for 400ms to check if scroll is getting executed multiple times.
			setTimeout(function() {
				assert.equal(updateHorizon.callCount, 1, "horizon updated");
				fnDone();
			}, 400);
		}.bind(this));
	});

	QUnit.module("Gantt Chart VH update", {
		beforeEach: function () {
			this.gantt = utils.createGanttWithOData();
			this.gantt.placeAt("qunit-fixture");
			return utils.waitForGanttRendered(this.gantt);
		},
		afterEach: function () {
			this.gantt.destroy();
		}
	});
	QUnit.test("Suppress VH update property ", function (assert) {
		var fnDone = assert.async();
		return utils.waitForGanttRendered(this.gantt).then(function () {
			this.gantt._getScrollExtension()._bSuppressSetVisibleHorizon = false;
			var currentScroll = sinon.stub(this.gantt._getScrollExtension(), "_getGanttHsbScrollLeft").returns(20);
			var expectedScroll = sinon.stub(this.gantt._getScrollExtension(), "_visibleHorizonToScrollLeft").returns(19.56);
			this.gantt._getScrollExtension()._scrollTableToVisibleHorizon(true);
			assert.equal(this.gantt._getScrollExtension()._bSuppressSetVisibleHorizon, false, "supress flag should remain false");
			currentScroll.restore();
			expectedScroll.restore();
			fnDone();
		}.bind(this));
	});

	QUnit.module("Horizontal lazy load", {
		beforeEach: function () {
            var oShape = [
                new BaseRectangle({
                    shapeId: "0",
                    time: sap.gantt.misc.Format.abapTimestampToDate("20181002000000"),
                    endTime: sap.gantt.misc.Format.abapTimestampToDate("20181022000000"),
                    height: 20
                })];
            this.gantt = utils.createSimpleGantt(oShape, "20131001000000", "20251129000000");
            this.gantt.placeAt("qunit-fixture");
        },
        afterEach: function () {
            this.gantt.destroy();
            this.gantt = null;
        }
	});

	QUnit.test("HorizontalScroll fired after delay for HLL enabled", function (assert) {
		var fnDone = assert.async();
		this.gantt.setHorizontalLazyLoadingEnabled(true);
		utils.waitForGanttRendered(this.gantt).then(function () {
			var oScrollExtension = this.gantt._getScrollExtension();
			var oStartTime, oUpdateVisibleHorizonStub;
			var oFunc = function () {
				var oEndDate = new Date();
				var iTimeDiff = oEndDate.getTime() - oStartTime.getTime();
				assert.ok(iTimeDiff >= 150, "update horizon called after delay");
				oUpdateVisibleHorizonStub.restore();
				fnDone();
			};
			oUpdateVisibleHorizonStub = sinon.stub(oScrollExtension, "updateVisibleHorizonIfNecessary", oFunc);
			var hsb = document.getElementById(this.gantt.getId() + "-hsb");
			oStartTime = new Date();
			hsb.scrollTo(hsb.scrollLeft + 5, 0);
		}.bind(this));
	});

	QUnit.test("HorizontalScroll fired without delay for HLL disabled", function (assert) {
		var fnDone = assert.async();
		utils.waitForGanttRendered(this.gantt).then(function () {
			var oScrollExtension = this.gantt._getScrollExtension();
			var oStartTime, oUpdateVisibleHorizonStub;
			var oFunc = function () {
				var oEndDate = new Date();
				var iTimeDiff = oEndDate.getTime() - oStartTime.getTime();
				assert.ok(iTimeDiff < 150, "update horizon called after scroll triggered");
				oUpdateVisibleHorizonStub.restore();
				fnDone();
			};
			oUpdateVisibleHorizonStub = sinon.stub(oScrollExtension, "updateVisibleHorizonIfNecessary", oFunc);
			var hsb = document.getElementById(this.gantt.getId() + "-hsb");
			oStartTime = new Date();
			hsb.scrollTo(hsb.scrollLeft + 5, 0);
		}.bind(this));
	});

	QUnit.module("Horizontal lazy load with Multiple GanttCharts in a Conatiner", {
		beforeEach: function () {
			return this.fnCreateGanttContainer();
        },
        afterEach: function () {
			this.oGanttChartContainer.destroy();
			this.oGanttChartContainer = undefined;
			this.oToolbar = undefined;
			this.aGanttCharts =  undefined;
			this.oGantt1 = undefined;
			this.oGantt2 =  undefined;
        },
		fnCreateGanttContainer: function () {
			this.oGanttChartContainer = new GanttChartContainer("container", {
				ganttCharts: [
					new GanttChartWithTable({
						table: new TreeTable({
							columns: [
								new Column({
									label: new Label({
										text: "Name"
									}),
									template: new Label({
										text: "{name}"
									})
								}),
								new Column({
									label: new Label({
										text: "Description"
									}),
									template: new Label({
										text: "{description}"
									})
								})
							],
							selectionMode: sap.ui.table.SelectionMode.Single,
							enableColumnReordering: true,
							expandFirstLevel: true,
							rowMode: new AutoRowMode({
								minRowCount: 3
							}),
							rowSettingsTemplate: new GanttRowSettings({
								rowId: "{Shape1ID}",
								shapes1: new BaseChevron({
									shapeId: "{Chevron1ID}",
									time: "{Chevron1StartDate}",
									endTime: "{Chevron1EndDate}",
									title: "{Chevron1Desc}",
									fill: "#0092D1",
									countInBirdEye: true
								}),
								shapes2: new BaseRectangle({
									shapeId: "{Rectangle1ID}",
									time: "{Rectangle1StartDate}",
									endTime: "{Rectangle1EndDate}",
									title: "{Rectangle1Desc}",
									fill: "#0092D1",
									countInBirdEye: false
								})
							})
						}).bindRows("/root"),
						axisTimeStrategy: new ProportionZoomStrategy({
							totalHorizon: new TimeHorizon({
								startTime: "20140628000000",
								endTime: "20170101000000"
							}),
							visibleHorizon: new TimeHorizon({
								startTime: "20150101000000",
								endTime: "20150315000000"
							})
						})
					}),
					new GanttChartWithTable({
						table: new TreeTable({
							columns: [
								new Column({
									label: new Label({
										text: "Name"
									}),
									template: new Label({
										text: "{name}"
									})
								}),
								new Column({
									label: new Label({
										text: "Description"
									}),
									template: new Label({
										text: "{description}"
									})
								})
							],
							selectionMode: sap.ui.table.SelectionMode.Single,
							enableColumnReordering: true,
							expandFirstLevel: true,
							rowMode: new AutoRowMode({
								minRowCount: 3
							}),
							rowSettingsTemplate: new GanttRowSettings({
								rowId: "{Shape2ID}",
								shapes1: new BaseChevron({
									shapeId: "{Chevron2ID}",
									time: "{Chevron2StartDate}",
									endTime: "{Chevron2EndDate}",
									title: "{Chevron2Desc}",
									fill: "#0092D1",
									countInBirdEye: true
								})
							})
						}).bindRows("/root"),
						axisTimeStrategy: new ProportionZoomStrategy({
							totalHorizon: new TimeHorizon({
								startTime: "20140628000000",
								endTime: "20170101000000"
							}),
							visibleHorizon: new TimeHorizon({
								startTime: "20150101000000",
								endTime: "20150315000000"
							})
						})
					})
				],
				enableTimeScrollSync: true
			});

			this.aGanttCharts = this.oGanttChartContainer.getGanttCharts();
			this.oGantt1 = this.aGanttCharts[0];
			this.oGantt2 = this.aGanttCharts[1];

			var sHeight = "500px";
			document.getElementById("qunit-fixture").style.height = sHeight;
			document.getElementById("qunit-fixture").style.width = "1920px";
			var oPanel = new Panel({
				height: sHeight,
				content: [this.oGanttChartContainer]
			});

			var oData = {
				root : {
					name: "root",
					description: "root description",
					0: {
						name: "item1",
						description: "item1 description",
						Shape1ID: "0",
						Chevron1ID: "0-0",
						Chevron1StartDate: new Date(2015, 4, 20),
						Chevron1EndDate: new Date(2015, 5, 21),
						Chevron1Desc: "Test Chevron 1",
						Rectangle1ID: "0-1",
						Rectangle1StartDate: new Date(2015, 2, 20),
						Rectangle1EndDate: new Date(2015, 3, 21),
						Rectangle1Desc: "Test Rectangle 1",
						Shape2ID: "1",
						Chevron2ID: "1-0",
						Chevron2StartDate: new Date(2015, 6, 20),
						Chevron2EndDate: new Date(2015, 7, 21),
						Chevron2Desc: "Test Chevron 2"
					}
				}
			};

			var oModel = new JSONModel();
			oModel.setData(oData);
			oPanel.setModel(oModel);

			oPanel.placeAt("qunit-fixture");

			return utils.waitForGanttRendered(this.oGanttChartContainer.getGanttCharts()[0], true);
		}
	});

	QUnit.test("HorizontalScroll fired after delay for HLL enabled", function (assert) {
		var fnDone = assert.async();
		this.oGanttChartContainer.getGanttCharts()[1].setHorizontalLazyLoadingEnabled(true);
		utils.waitForGanttRendered(this.oGanttChartContainer.getGanttCharts()[0]).then(function () {
			var oScrollExtension = this.oGanttChartContainer.getGanttCharts()[0]._getScrollExtension();
			var oStartTime, oUpdateVisibleHorizonStub;
			var oFunc = function () {
				var oEndDate = new Date();
				var iTimeDiff = oEndDate.getTime() - oStartTime.getTime();
				assert.ok(iTimeDiff >= 150, "update horizon called after delay");
				oUpdateVisibleHorizonStub.restore();
				fnDone();
			};
			oUpdateVisibleHorizonStub = sinon.stub(oScrollExtension, "updateVisibleHorizonIfNecessary", oFunc);
			var hsb = document.getElementById(this.oGanttChartContainer.getGanttCharts()[0].getId() + "-hsb");
			oStartTime = new Date();
			hsb.scrollTo(hsb.scrollLeft + 5, 0);
		}.bind(this));
	});

	QUnit.test("HorizontalScroll fired without delay for HLL disabled", function (assert) {
		var fnDone = assert.async();
		utils.waitForGanttRendered(this.oGanttChartContainer.getGanttCharts()[0]).then(function () {
			var oScrollExtension = this.oGanttChartContainer.getGanttCharts()[0]._getScrollExtension();
			var oStartTime, oUpdateVisibleHorizonStub;
			var oFunc = function () {
				var oEndDate = new Date();
				var iTimeDiff = oEndDate.getTime() - oStartTime.getTime();
				assert.ok(iTimeDiff < 150, "update horizon called after scroll triggered");
				oUpdateVisibleHorizonStub.restore();
				fnDone();
			};
			oUpdateVisibleHorizonStub = sinon.stub(oScrollExtension, "updateVisibleHorizonIfNecessary", oFunc);
			var hsb = document.getElementById(this.oGanttChartContainer.getGanttCharts()[0].getId() + "-hsb");
			oStartTime = new Date();
			hsb.scrollTo(hsb.scrollLeft + 5, 0);
		}.bind(this));
	});
});
