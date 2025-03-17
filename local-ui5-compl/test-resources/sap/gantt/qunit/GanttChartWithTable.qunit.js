/*global QUnit, sinon */
sap.ui.define([
	"sap/gantt/GanttChartWithTable",
	"sap/m/Label",
	"sap/ui/model/json/JSONModel",
	"sap/ui/table/Column",
	"sap/ui/table/plugins/MultiSelectionPlugin",
	"sap/ui/qunit/QUnitUtils",
	"sap/gantt/qunit/data/DataProducer",
	"sap/ui/Device",
	"sap/ui/core/Core"
], function(GanttChartWithTable, Label, JSONModel, Column, MultiSelectionPlugin, qutils, DataProducer, Device, Core){
	"use strict";

	// qutils.delayTestStart();
	QUnit.module("Basic Rendering Tests", {
		beforeEach: function () {
			var oDataProducer = new DataProducer();
			oDataProducer.produceData();
			// create model and load data
			var oModel = new JSONModel();
			oModel.setData(oDataProducer.getData("sap_hierarchy"));

			// create GanttChart
			this.oGanttChartWithTable = new GanttChartWithTable({
				columns: [new Column({
					label: new Label({
						text: "Unique ID"
					}),
					sortProperty: "uuid",
					filterProperty: "uuid",
					template: new Label({
						text: {
							path: "uuid",
							model: "test"
						}
					})
				})],
				rows: {
					path: "test>/root",
					parameters: {
						arrayNames: ["children"]
					}
				}
			});
			this.oGanttChartWithTable.setModel(oModel, "test");
			this.oGanttChartWithTable.placeAt("qunit-fixture");
			Core.applyChanges();
		},
		afterEach: function () {
			this.oGanttChartWithTable.destroy();
		}
	});
	QUnit.test("TreeTable API test", function (assert) {
		var done = assert.async();
		assert.equal(this.oGanttChartWithTable.getSelectedIndex(), this.oGanttChartWithTable._getSelectionHandler().getSelectedIndex(), "Default selected index");
		this.oGanttChartWithTable.setSelectedIndex(0);
		assert.equal(this.oGanttChartWithTable.getSelectedIndex(), this.oGanttChartWithTable._getSelectionHandler().getSelectedIndex(), "Return index that was set");

		assert.equal(this.oGanttChartWithTable.getVisibleRowCount(), this.oGanttChartWithTable._oTT.getVisibleRowCount(), "Number of visible rows");

		assert.equal(this.oGanttChartWithTable.getRows().length, this.oGanttChartWithTable._oTT.getRows().length, "Number of rows");

		assert.equal(this.oGanttChartWithTable.getFirstVisibleRow(), 0, "Default visible row");
		this.oGanttChartWithTable.setFirstVisibleRow(1);
		assert.equal(this.oGanttChartWithTable.getFirstVisibleRow(), 1, "Should be 1");

		//Flat mode test
	  setTimeout(function () {
		assert.ok(this.oGanttChartWithTable._oTT.$().find(".sapUiTableTreeIcon").length > 0, "Tree Icons available in TreeMode");
		this.oGanttChartWithTable.setUseFlatMode(true);
		var _adjustChartHeaderHeightSpy = sinon.spy(this.oGanttChartWithTable, "_adjustChartHeaderHeight");
		var _onTTRowUpdateSpy = sinon.spy(this.oGanttChartWithTable, "_onTTRowUpdate");
		setTimeout(function () {
			var iGanttHeaderHeight = this.oGanttChartWithTable.$().find(".sapGanttChartHeader").height();
			var $tableExtDiv = this.oGanttChartWithTable._oTT.$().find(".sapUiTableExt");
			var $tableHeaderDiv = this.oGanttChartWithTable._oTT.$().find(".sapUiTableColHdrCnt");
			var oTableDivHeight = (Device.browser.name === "ff") ? $tableHeaderDiv.outerHeight() : $tableHeaderDiv.height();
			var iGanttChartHeaderHeight = ($tableExtDiv ? $tableExtDiv.outerHeight() : 0) + oTableDivHeight + 1;
			assert.ok(_adjustChartHeaderHeightSpy.calledBefore(_onTTRowUpdateSpy));
			assert.ok(_adjustChartHeaderHeightSpy.called);
			assert.equal(iGanttHeaderHeight,iGanttChartHeaderHeight, "Table Header height and GanttChart Header Height are equal.");
			assert.equal(this.oGanttChartWithTable._oTT.getVisibleRowCount(), this.oGanttChartWithTable._oTC.getVisibleRowCount(), "Visible Row Counts are equal.");
			assert.strictEqual(this.oGanttChartWithTable._oTT.$().find(".sapUiTableTreeIcon").length, 0, "Tree Icons not available in FlatMode");
			_adjustChartHeaderHeightSpy.restore();
			_onTTRowUpdateSpy.restore();
			done();
		}.bind(this), 500);
	  }.bind(this), 500);
	});

	QUnit.module("Collapse/Expand mock tests", {
		beforeEach: function () {
			this.oGanttChartWithTable = new GanttChartWithTable();
		},
		afterEach: function () {
			this.oGanttChartWithTable.destroy();
		}
	});

	QUnit.test("Expand test", function (assert) {
		var iInitialRowIndex = 0;
		this.oGanttChartWithTable._oTT.expand = function (iRowIndex) {
			assert.equal(iRowIndex, iInitialRowIndex, "Expand method of TreeTable was called with correct parameter");
		};
		assert.equal(this.oGanttChartWithTable.expand(iInitialRowIndex), this.oGanttChartWithTable, "The object GanttChartWithTable was returned");
	});

	QUnit.test("Collapse test", function (assert) {
		var iInitialRowIndex = 0;
		this.oGanttChartWithTable._oTT.collapse = function (iRowIndex) {
			assert.equal(iRowIndex, iInitialRowIndex, "Collapse method of TreeTable was called with correct parameter");
		};
		assert.equal(this.oGanttChartWithTable.collapse(iInitialRowIndex), this.oGanttChartWithTable, "The object GanttChartWithTable was returned");
	});

	QUnit.module("Functions", {
		beforeEach: function () {
			this.oGanttChartWithTable = new sap.gantt.GanttChartWithTable();
		},
		afterEach: function () {
			this.oGanttChartWithTable.destroy();
		}
	});

	QUnit.test("Test for getShapeSelectionMode function", function (assert) {
		//get default value
		assert.strictEqual("MultiWithKeyboard", this.oGanttChartWithTable.getShapeSelectionMode(), "Equal to default");

		this.oGanttChartWithTable.setProperty("shapeSelectionMode", "Single");
		assert.strictEqual("Single", this.oGanttChartWithTable.getShapeSelectionMode(), "Equal to expected value");
	});

	QUnit.test("Test for setShapeSelectionMode function", function (assert) {
		this.oGanttChartWithTable.setShapeSelectionMode("None");
		assert.strictEqual("None", this.oGanttChartWithTable.getProperty("shapeSelectionMode"), "Changed to expectation");
	});

	QUnit.test("Test for getSelectionMode function", function (assert) {
		//get default value
		assert.strictEqual("MultiWithKeyboard", this.oGanttChartWithTable.getSelectionMode(), "Equal to default");

		this.oGanttChartWithTable.setProperty("selectionMode", "Single");
		assert.strictEqual("Single", this.oGanttChartWithTable.getSelectionMode(), "Equal to expected value");
	});

	QUnit.test("Test for setSelectionMode function", function (assert) {
		this.oGanttChartWithTable.setSelectionMode("None");
		assert.strictEqual("None", this.oGanttChartWithTable.getProperty("selectionMode"), "Changed to expectation");
	});

	QUnit.test("Test for useSelectionPlugin function", function (assert) {
		var oLeftTable = this.oGanttChartWithTable.getAggregation("_selectionPanel");
		var oRightTable = this.oGanttChartWithTable.getAggregation("_chart").getAggregation("_treeTable");

		assert.strictEqual(
			this.oGanttChartWithTable._getSelectionHandler(), this.oGanttChartWithTable.getAggregation("_selectionPanel"),
			"Selection plugin should NOT be used by default."
		);
		assert.notOk(oLeftTable._hasSelectionPlugin(), "Selection panel should NOT have selection plugin set by default.");
		assert.notOk(oRightTable._hasSelectionPlugin(), "Tree table should NOT have selection plugin set by default.");

		var oSelectionPlugin1 = new MultiSelectionPlugin({limit: 0});
		this.oGanttChartWithTable.useSelectionPlugin(oSelectionPlugin1);

		assert.strictEqual(
			this.oGanttChartWithTable._getSelectionHandler(), oSelectionPlugin1,
			"Selection plugin should be used after setting it."
		);
		assert.ok(oLeftTable._hasSelectionPlugin(), "Selection panel should have selection plugin set after setting it.");
		assert.ok(oRightTable._hasSelectionPlugin(), "Tree table should have selection plugin set after setting it.");

		this.oGanttChartWithTable.useSelectionPlugin(); // no parameter removes the selection plugin

		assert.strictEqual(
			this.oGanttChartWithTable._getSelectionHandler(), this.oGanttChartWithTable.getAggregation("_selectionPanel"),
			"Selection plugin should NOT be used after removing it."
		);
		assert.notOk(oLeftTable._hasSelectionPlugin(), "Selection panel should NOT have selection plugin set after removing usage of it.");
		assert.notOk(oRightTable._hasSelectionPlugin(), "Tree table should NOT have selection plugin set after removing usage of it.");

		var oSelectionPlugin2 = new MultiSelectionPlugin({limit: 0});
		this.oGanttChartWithTable.useSelectionPlugin(oSelectionPlugin1);
		this.oGanttChartWithTable.useSelectionPlugin(oSelectionPlugin2);

		assert.strictEqual(
			this.oGanttChartWithTable._getSelectionHandler(), oSelectionPlugin2,
			"The latest set selection plugin should be used."
		);
		assert.ok(oLeftTable._hasSelectionPlugin(), "Selection panel should have selection plugin set after setting it.");
		assert.ok(oRightTable._hasSelectionPlugin(), "Tree table should have selection plugin set after setting it.");

		this.oGanttChartWithTable.useSelectionPlugin(); // no parameter removes the selection plugin

		assert.strictEqual(
			this.oGanttChartWithTable._getSelectionHandler(), this.oGanttChartWithTable.getAggregation("_selectionPanel"),
			"Selection plugin should NOT be used after removing it even if multiple ones were set previously."
		);
		assert.notOk(oLeftTable._hasSelectionPlugin(), "Selection panel should NOT have selection plugin set after removing usage of it.");
		assert.notOk(oRightTable._hasSelectionPlugin(), "Tree table should NOT have selection plugin set after removing usage of it.");

		assert.strictEqual(oLeftTable.getPlugins().length, 0, "Selection panel should NOT have any selection plugins left.");
		assert.strictEqual(oRightTable.getPlugins().length, 0, "Tree table should NOT have any selection plugins left.");
	});

	QUnit.module("ShapeInRow - testing shapes styling", {
		beforeEach: function () {
			var oData = {
				"root": {
				  "id": "root",
				  "children": [
					{
					  "text": "truck01",
					  "plate": "WEF201",
					  "plate_expire": "20200819000000",
					  "id": "0000",
					  "activity": [
						{
						  "status": "x",
						  "type": "a",
						  "startTime": "20160329000000",
						  "endTime": "20160410000000",
						  "fill": "red",
						  "truncateWidth": 207
						},
					  {
						  "status": "x",
						  "type": "a",
						  "startTime": "20160319000000",
						  "endTime": "20160415000000",
						  "fill": "green",
						  "truncateWidth": 466
						}
					  ],
					  "children": [
						{
						  "text": "trailer01",
						  "plate": "EA12321",
						  "id": "0001",
						  "activity": [
							{
							  "status": "y",
							  "type": "b",
							  "startTime": "20160331000000",
							  "endTime": "20160409000000",
								"fill": "blue"
							},
							  {
							  "status": "y",
							  "type": "b",
							  "startTime": "20160301000000",
							  "endTime": "20160401000000",
							  "fill": "pink"
							}
						  ]
						}
					  ]
					}
				  ]
				}
			};
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(oData);
			var oShapeConfig = new sap.gantt.config.Shape({
				key: "chartConfig",
				shapeDataName: "activity",
				shapeClassName: "sap.gantt.shape.Group",
				shapeProperties: {
					time: "{startTime}",
					endTime: "{endTime}",
					isDuration: true
				},
				groupAggregation: [
					new sap.gantt.config.Shape({
						shapeClassName: "sap.gantt.shape.Rectangle",
						shapeProperties: {
							id: "shapes01",
							time: "{startTime}",
							endTime: "{endTime}",
							fill: "{fill}",
							isDuration: true
						}
					}),
					new sap.gantt.config.Shape({
						shapeClassName: "sap.gantt.shape.Text",
						shapeProperties: {
							time: "{startTime}",
							endTime: "{endTime}",
							text: "this is a very very very very very very very very very very very very very very very very very very very very very very very very Long Title",
							truncateWidth: "{truncateWidth}",
							isDuration: false,
							fill:"red",
							fillOpacity:0.1,
							fontSize:10
						}
					})
				]
			});
			var oProportionZoomStrategy = new sap.gantt.axistime.ProportionZoomStrategy({
				totalHorizon: new sap.gantt.config.TimeHorizon({
					startTime: "20160301000000",
					endTime: "20160701000000"
				}),
				visibleHorizon: new sap.gantt.config.TimeHorizon({
					startTime: "20160301000000",
					endTime: "20160501000000"
				}),
				calendarType: sap.ui.core.CalendarType.Japanese
			});
			this.oGantt = new sap.gantt.GanttChartWithTable({
				columns: [new sap.ui.table.Column({
					label: "Text",
					template: "text"
				})],
				axisTimeStrategy: oProportionZoomStrategy,
				height: "410px",
				shapeDataNames: ["activity"],
				shapes: [oShapeConfig],
				rows: {
					path: "/root",
					parameters: {
						arrayNames: ["children"]
					}
				}
			});
			this.oGantt.setModel(oModel);
			var oGanttParent = this.oGantt.getAggregation("_chart");
			this.oGantt.getAggregation("_selectionPanel").attachRowSelectionChange(oGanttParent._onRowSelectionChange, oGanttParent);
			this.oGantt.placeAt('content');
		},
		afterEach: function () {
			this.oGantt.destroy();
		}
	});

	QUnit.test("Test the styling of the shapes", function (assert) {
		var done = assert.async();
		setTimeout(function () {
			var oShape1 = this.oGantt.getDomRef().getElementsByClassName("sapGanttChartSvg")[0].getElementsByTagName("rect")[0];
			var oShape2 = this.oGantt.getDomRef().getElementsByClassName("sapGanttChartSvg")[0].getElementsByTagName("rect")[1];
			assert.strictEqual(oShape1.style.fill, oShape1.__data__.fill, "Styling applied");
			assert.strictEqual(oShape2.style.fill, oShape2.__data__.fill, "Styling applied");
			done();
		}.bind(this), 5000);
	});

	QUnit.test("Test TruncateWidth: Chrome:95", function (assert) {
		var done = assert.async();
		var sCurrentBrowser = Device.browser.name;
		var iCurrentBrowserVersion = Device.browser.version;
		sap.ui.Device.browser.name = "cr";
		sap.ui.Device.browser.version = 95;
		setTimeout(function () {
			var oText1 = this.oGantt.getDomRef().getElementsByClassName("sapGanttChartSvg")[0].getElementsByTagName("text")[0];
			var oTSpan1 = oText1.children[0];
			assert.ok( Number(oTSpan1.getAttribute("textLength")) != 12, "Ellipsis Width is correct.");

			var oText2 = this.oGantt.getDomRef().getElementsByClassName("sapGanttChartSvg")[0].getElementsByTagName("text")[1];
			var oTSpan2 = oText2.children[0];
			assert.ok(Number(oTSpan2.getAttribute("textLength")) != 12, "Ellipsis Width is correct.");

			sap.ui.Device.browser.name = sCurrentBrowser;
			sap.ui.Device.browser.version = iCurrentBrowserVersion;
			done();
		}.bind(this), 5000);
	});

	QUnit.test("Test TruncateWidth: Chrome:96", function (assert) {
		var done = assert.async();
		var sCurrentBrowser = sap.ui.Device.browser.name;
		var iCurrentBrowserVersion = sap.ui.Device.browser.version;
		Device.browser.name = "cr";
		Device.browser.version = 96;
		setTimeout(function () {
			var oText1 = this.oGantt.getDomRef().getElementsByClassName("sapGanttChartSvg")[0].getElementsByTagName("text")[0];
			var oTSpan1 = oText1.children[0];
			assert.equal(Number(oTSpan1.getAttribute("textLength")), 12, "Ellipsis Width is correct.");

			var oText2 = this.oGantt.getDomRef().getElementsByClassName("sapGanttChartSvg")[0].getElementsByTagName("text")[1];
			var oTSpan2 = oText2.children[0];
			assert.equal(Number(oTSpan2.getAttribute("textLength")), 12, "Ellipsis Width is correct.");

			Device.browser.name = sCurrentBrowser;
			Device.browser.version = iCurrentBrowserVersion;
			done();
		}.bind(this), 5000);
	});

}, false);
