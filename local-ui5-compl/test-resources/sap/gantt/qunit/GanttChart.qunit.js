/*global QUnit */
sap.ui.define([
	"sap/gantt/def/SvgDefs",
	"sap/gantt/def/pattern/SlashPattern",
	"sap/gantt/qunit/data/DataProducer",
	"sap/ui/qunit/QUnitUtils",
	"sap/gantt/test/shape/OrderShape",
	"sap/gantt/test/shape/CustomSelectedShape"
], function(SvgDefs, SlashPattern, DataProducer, qutils) {
	"use strict";


	var oSvgDefs = new SvgDefs({
		defs: [new SlashPattern("pattern_slash_grey", {
			stroke: "#CAC7BA"
		}), new SlashPattern("pattern_slash_blue", {
			stroke: "#008FD3"
		}), new SlashPattern("pattern_slash_green", {
			stroke: "#99D101"
		}), new SlashPattern("pattern_slash_orange", {
			stroke: "#F39B02"
		}), new SlashPattern("pattern_slash_lightblue", {
			stroke: "#9FCFEB"
		})]
	});

	var aChartSchemesConfig = [
		new sap.gantt.config.ChartScheme({
			key: "ac_main",
			rowSpan: 1,
			shapeKeys: ["order", "order_overlap_shortage", "order_overlap_meet", "order_overlap_surplus", "ActivityKey", "activity_overlap", "phase", "task", "calendar"] //, "dt", "warning"
		}), new sap.gantt.config.ChartScheme({
			key: "ubc_hr",
			rowSpan: 2,
			modeKey: "C",
			shapeKeys: ["ubc"]
		}), new sap.gantt.config.ChartScheme({
			key: "ulc_main",
			name: "Utilization",
			icon: "./image/utilization.png",
			rowSpan: 2,
			modeKey: "U",
			haveBackground: true,
			shapeKeys: ["ulc"]
		}),
		new sap.gantt.config.ChartScheme({
			key: "ac_expand_overlap",
			name: "Overlaps",
			icon: "./image/overlap.png",
			rowSpan: 1,
			shapeKeys: ["order_greedy", "activity_greedy"]
		}),
		new sap.gantt.config.ChartScheme({
			key: "ubc_expand_hr",
			name: "Details",
			icon: "./image/overlap.png",
			rowSpan: 1,
			modeKey: "C",
			shapeKeys: ["activity_greedy", "ubc_overcapacity_projection"]
		})
	];

	function createGanttChart() {
		var oDataProducer = new DataProducer();
		oDataProducer.produceData("RESOURCES");
		// create model and load data
		var oModel = new sap.ui.model.json.JSONModel();
		oModel.setData(oDataProducer.getData("RESOURCES"));

		// create GanttChart
		var oGanttChart = new sap.gantt.GanttChart({
			timeAxis: new sap.gantt.config.TimeAxis({
				planHorizon: new sap.gantt.config.TimeHorizon({
					startTime: "20140912000000",
					endTime: "20151027060610"
				}),
				initHorizon: new sap.gantt.config.TimeHorizon({
					startTime: "20140920121212",
					endTime: "20141027000000"
				})
			}),
			chartSchemes: aChartSchemesConfig,
			svgDefs: oSvgDefs,
			shapeDataNames: ["activity"],
			shapes: [new sap.gantt.config.Shape({
				key: "activity",
				shapeDataName: "activity",
				shapeClassName: "sap.gantt.test.shape.OrderShape",
				selectedClassName: "sap.gantt.test.shape.CustomSelectedShape",
				shapeProperties: {
					time: "{startTime}",
					endTime: "{endTime}",
					title: "{tooltip}",
					rx: 0,
					ry: 0,
					isDuration: true
				}
			})],
			rows: {
				path: "test>/root",
				parameters: {
					arrayNames: ["children"]
				}
			}
		});
		oGanttChart.setTimeZoomRate(1);
		oGanttChart.setModel(oModel, "test");
		oGanttChart.placeAt("content");
		oGanttChart.handleExpandChartChange(true, aChartSchemesConfig, [0, 1]);
		return oGanttChart;
	}

	function createGanttChartWithContainer() {

		var oDataProducer = new DataProducer();
		oDataProducer.produceData("RESOURCES");
		// create model and load data
		var oModel = new sap.ui.model.json.JSONModel();
		oModel.setData(oDataProducer.getData("RESOURCES"));

		var aToolbarSchemesConfig = [
			new sap.gantt.config.ToolbarScheme({
				key: "GLOBAL_TOOLBAR",
				expandChart: new sap.gantt.config.ExpandChartGroup({
					position: "L1",
					overflowPriority: sap.m.OverflowToolbarPriority.High,
					showArrowText: true,
					expandCharts: [
						new sap.gantt.config.ExpandChart({
							isExpand: true,
							icon: "sap-icon://along-stacked-chart", //"sap-icon://arrow-bottom",
							tooltip: "Show Detail.",
							chartSchemeKeys: ["ac_expand_overlap", "ubc_expand_hr"]
						}),
						new sap.gantt.config.ExpandChart({
							isExpand: false,
							icon: "sap-icon://along-stacked-chart", //"sap-icon://arrow-top",
							tooltip: "Hide Detail.",
							chartSchemeKeys: ["ac_expand_overlap", "ubc_expand_hr"]
						})
					]
				}),
				toolbarDesign: sap.m.ToolbarDesign.Solid
			})
		];

		var oGanttcontainer = new sap.gantt.GanttChartContainer();
		// create GanttChart
		var oGanttChart = new sap.gantt.GanttChartWithTable({
			columns: [
				new sap.ui.table.Column({
					label: "uuid",
					width: "130px",
					template: "test>uuid"
				}),
				new sap.ui.table.Column({
					label: "plate",
					width: "100px",
					template: "test>plate"
				}),
				new sap.ui.table.Column({
					label: "type",
					width: "50px",
					template: "test>type"
				})
			],
			timeAxis: new sap.gantt.config.TimeAxis({
				planHorizon: new sap.gantt.config.TimeHorizon({
					startTime: "20140101000000",
					endTime: "20161027060610"
				}),
				initHorizon: new sap.gantt.config.TimeHorizon({
					startTime: "20140920120000",
					endTime: "20141027000000"
				})
			}),
			chartSchemes: aChartSchemesConfig,
			svgDefs: oSvgDefs,
			shapeDataNames: ["activity"],
			shapes: [
				new sap.gantt.config.Shape({
				key: "activity",
				shapeDataName: "activity",
				shapeClassName: "sap.gantt.test.shape.OrderShape",
				shapeProperties: {
					time: "{test>startTime}",
					endTime: "{test>endTime}",
					title: "{test>tooltip}",
					rx: 0,
					ry: 0,
					isDuration: true
				}
			})],
			rows: {
				path: "test>/root",
				parameters: {
					arrayNames: ["children"]
				}
			}
		});
		oGanttcontainer.addGanttChart(oGanttChart);
		oGanttChart.setTimeZoomRate(1);
		oGanttChart.setModel(oModel, "test");
		oGanttcontainer.setToolbarSchemes(aToolbarSchemesConfig);
		oGanttcontainer.setContainerLayouts([
			new sap.gantt.config.ContainerLayout({
				key: "sap.gantt.sample.gantt_layout",
				text: "Gantt Layout",
				toolbarSchemeKey: "GLOBAL_TOOLBAR"
			})
		]);
		oGanttcontainer.setContainerLayoutKey("sap.gantt.sample.gantt_layout");
		oGanttcontainer.placeAt("qunit-fixture");
		return oGanttChart;
	}

	// qutils.delayTestStart(8000);
	QUnit.module("Gantt Chart - Basic Rendering Test");

	QUnit.test("Gantt Chart set timeAxis", function (assert) {
		var oGanttChart = createGanttChart();
		var oNewTimeAxis = new sap.gantt.config.TimeAxis({
			planHorizon: sap.gantt.config.DEFAULT_PLAN_HORIZON
		});

		oGanttChart.setTimeAxis(oNewTimeAxis);
		var oCurrentVisibleHorizon = oGanttChart.getAxisTimeStrategy().getVisibleHorizon();

		assert.strictEqual(oCurrentVisibleHorizon.getStartTime(), sap.gantt.config.DEFAULT_INIT_HORIZON.getStartTime(), "Set initHorizon without start time and end time failed: start time not equal");
		assert.strictEqual(oCurrentVisibleHorizon.getEndTime(), sap.gantt.config.DEFAULT_INIT_HORIZON.getEndTime(), "Set initHorizon without start time and end time failed: end time not equal");
		oGanttChart.destroy();
	});

	QUnit.test("Gantt Chart Rendering Ok", function (assert) {
		var done = assert.async();
		var oGanttChart = createGanttChart();
		setTimeout(function () {
			assert.equal(oGanttChart.$().find(".sapGanttChartSvg").length, 1, "Chart SVG created correctly");
			oGanttChart.destroy();
			done();
		}, 1000);
	});

	QUnit.test("Test for setZoomRate function", function (assert) {
		var oGanttChart = createGanttChart();
		var oStrategy = oGanttChart.getAxisTimeStrategy(),
			oOldStartTime = oStrategy.getVisibleHorizon().getStartTime(),
			oOldEndTime = oStrategy.getVisibleHorizon().getEndTime();

		var done = assert.async();
		setTimeout(function () {
			oGanttChart.setTimeZoomRate(0.7);
			var oNewHorizon = oStrategy.getVisibleHorizon();
			assert.ok((oOldStartTime !== oNewHorizon.getStartTime()) || (oOldEndTime !== oNewHorizon.getEndTime()), "visibleHorizon start and end time changed after setZoomRate");
			oGanttChart.destroy();
			done();
		}, 1000);

	});

	QUnit.test("Gantt Chart _prepareHorizontalDrawingRange", function (assert) {
		var oGanttChart = createGanttChart();
		var bReady = oGanttChart._prepareHorizontalDrawingRange();
		var iVisibleWidth = oGanttChart.getVisibleWidth();

		if (bReady) {
			assert.ok(oGanttChart._oStatusSet.nWidth >= iVisibleWidth, "nWidth should be no less than iVisibleWidth");
		} else {
			assert.ok(true, "OK");
		}
		oGanttChart.destroy();

	});

	QUnit.test("(RTL mode) Gantt Chart _prepareHorizontalDrawingRange", function (assert) {
		var oGanttChart = createGanttChart();
		sap.ui.getCore().getConfiguration().setRTL(true);
		var bReady = oGanttChart._prepareHorizontalDrawingRange();
		var iVisibleWidth = oGanttChart.getVisibleWidth();

		if (bReady) {
			assert.ok(oGanttChart._oStatusSet.nWidth >= iVisibleWidth, "nWidth should be no less than iVisibleWidth");
		} else {
			assert.ok(true, "OK");
		}
		oGanttChart.destroy();
		sap.ui.getCore().getConfiguration().setRTL(false);
	});

	QUnit.test("GanttChart is aligned after Chart Scroll in Expand view", function(assert){
		var oGanttChart = createGanttChartWithContainer();
		var fnDone = assert.async();
		function addAsserts(assert) {
			var oGanttChartSVG = document.getElementsByClassName("sapGanttChartSvg");
			var oGanttChartSVGMask = document.getElementsByClassName("sapGanttSPMaskSvg");
			if (oGanttChartSVG && oGanttChartSVG[0] && oGanttChartSVG[0].getAttribute("style") && oGanttChartSVG[0].getAttribute("style").indexOf("transform") > 0
				&& oGanttChartSVGMask && oGanttChartSVGMask[0] && oGanttChartSVGMask[0].getAttribute("style") && oGanttChartSVGMask[0].getAttribute("style").indexOf("transform") > 0) {
					var sChartSVGY = document.getElementsByClassName("sapGanttChartSvg")[0].getAttribute("style").substring(oGanttChartSVG[0].getAttribute("style").indexOf("transform"));
					var sChartSVGMaskY = document.getElementsByClassName("sapGanttSPMaskSvg")[0].getAttribute("style").substring(oGanttChartSVGMask[0].getAttribute("style").indexOf("transform"));
					assert.equal(sChartSVGY, sChartSVGMaskY, "Transform is set correctly" + sChartSVGMaskY);
			}
		}
		setTimeout(function () {
			oGanttChart._oTT.selectAll();
			setTimeout(function () {
				oGanttChart.handleExpandChartChange(true, aChartSchemesConfig, oGanttChart._oTT.getSelectedIndices());
				setTimeout(function () {
					var oGanttScrollBar = oGanttChart._oTC.getDomRef(sap.ui.table.SharedDomRef.VerticalScrollBar);
					oGanttScrollBar.scrollTop = 500;
					setTimeout(function () {
						assert.ok(oGanttChart.getDomRef(), "Chart is rendered.");
						addAsserts(assert);
						oGanttScrollBar.scrollTop = 600;
						setTimeout(function () {
							addAsserts(assert);
							oGanttScrollBar.scrollTop = 0;
							setTimeout(function () {
								addAsserts(assert);
								oGanttScrollBar.scrollTop = 300;
								setTimeout(function () {
									addAsserts(assert);
									oGanttChart.destroy();
									fnDone();
								}, 500);
							}, 500);
						}, 500);
					}, 500);
				}, 5000);
			}, 5000);
		}, 5000);
	});

	QUnit.module("shapeSelectionMode property", {
		beforeEach: function () {
			this.oGanttChart = new sap.gantt.GanttChart();
		},
		afterEach: function () {
			this.oGanttChart.destroy();
		}
	});

	QUnit.test("Test for getShapeSelectionMode function", function (assert) {
		//get default value
		assert.strictEqual("MultiWithKeyboard", this.oGanttChart.getShapeSelectionMode(), "Equal to default");

		this.oGanttChart.setProperty("shapeSelectionMode", "Single");
		assert.strictEqual("Single", this.oGanttChart.getShapeSelectionMode(), "Equal to expected value");
	});

	QUnit.test("Test for setShapeSelectionMode function", function (assert) {
		this.oGanttChart.setShapeSelectionMode("None");
		assert.strictEqual("None", this.oGanttChart.getProperty("shapeSelectionMode"), "Changed to expectation");
	});

	//Test for deprecated function
	QUnit.module("selectionMode property", {
		beforeEach: function () {
			this.oGanttChart = new sap.gantt.GanttChart();
		},
		afterEach: function () {
			this.oGanttChart.destroy();
		}
	});

	QUnit.test("Test for getSelectionMode function", function (assert) {
		//get default value
		assert.strictEqual("MultiWithKeyboard", this.oGanttChart.getSelectionMode(), "Equal to default");

		this.oGanttChart.setProperty("selectionMode", "Single");
		assert.strictEqual("Single", this.oGanttChart.getSelectionMode(), "Equal to expected value");
	});

	QUnit.test("Test for setSelectionMode function", function (assert) {
		this.oGanttChart.setSelectionMode("None");
		assert.strictEqual("None", this.oGanttChart.getProperty("selectionMode"), "Changed to expectation");
	});

	QUnit.module("Gantt Chart - Shape Drag", {
		afterEach: function () {
			this.oGantt.destroy();
		}
	});

	QUnit.test("Test for Shape drag with multiple shapes within group", function (assert) {
		var fnDone = assert.async();
		this.oGantt = createGantt();
		setTimeout(function () {
			var oClonedDom = this.oGantt.getDomRef().querySelectorAll(".sapGanttShapeSvgText")[0].parentElement;
			var aXCords = [];
			var aXNewCords = [];
			jQuery(oClonedDom).children().each(function(index, oNode) {
				var oJQueryNode = jQuery(oNode);
				if (!oJQueryNode.is('text') && !oJQueryNode.is('title')) { // skip text/title type
					aXCords.push(parseFloat(oJQueryNode.attr("x")));
				}
			});
			this.oGantt._oGanttChart._resetShadowRelativePosition(jQuery(oClonedDom), undefined, undefined, d3.select(oClonedDom).data());
			jQuery(oClonedDom).children().each(function(index, oNode) {
				var oJQueryNode = jQuery(oNode);
				if (!oJQueryNode.is('text') && !oJQueryNode.is('title')) { // skip text/title type
					aXNewCords.push(parseFloat(oJQueryNode.attr("x")));
				}
			});
			fnDone();
			assert.ok(aXNewCords.indexOf(0) != -1, "First Element has x Cord as 0.");
			assert.ok(aXNewCords.indexOf(Math.max(aXCords[0], aXCords[1]) - Math.min(aXCords[0], aXCords[1])) != -1, "Second Element has x Cord as difference of first and the second Shape.");
		}.bind(this), 2000);
	});

	QUnit.test("Test for Shape drag with single within group", function (assert) {
		var fnDone = assert.async();
		this.oGantt = createGantt(true);
		setTimeout(function () {
			var oClonedDom = this.oGantt.getDomRef().querySelectorAll(".sapGanttShapeSvgText")[0].parentElement;
			var aXCords = [];
			var aXNewCords = [];
			jQuery(oClonedDom).children().each(function(index, oNode) {
				var oJQueryNode = jQuery(oNode);
				if (!oJQueryNode.is('text') && !oJQueryNode.is('title')) { // skip text/title type
					aXCords.push(parseFloat(oJQueryNode.attr("x")));
				}
			});
			this.oGantt._oGanttChart._resetShadowRelativePosition(jQuery(oClonedDom), undefined, undefined, d3.select(oClonedDom).data());
			jQuery(oClonedDom).children().each(function(index, oNode) {
				var oJQueryNode = jQuery(oNode);
				if (!oJQueryNode.is('text') && !oJQueryNode.is('title')) { // skip text/title type
					aXNewCords.push(parseFloat(oJQueryNode.attr("x")));
				}
			});
			fnDone();
			assert.ok(((aXNewCords[0] == aXNewCords[1]) && (aXNewCords[0] == 0)), "Visible First Element has x Cord as 0.");
		}.bind(this), 2000);
	});

	function createGantt(bSingleShape) {
		var oData = {
			"root": {
				"id": "root",
				"children": [{
					"ResourceName": "Arvind",
					"OrgUnit": "5987648",
					"RelativeUsgae": "19",
					"id": "0000",
					"Assignment": [{
						"status": "x",
						"type": "3",
						"beg_timestamp":"20201104171946",
						"end_timestamp":"20201105171946",
						"description":"Design UI",
						"pbeg_timestamp": "20201103171947",
						"pend_timestamp":"20201104171946"
					}]
				}]
			}
		};
		if (bSingleShape) {
			delete oData.root.children[0].Assignment[0]["pbeg_timestamp"];
			delete oData.root.children[0].Assignment[0]["pend_timestamp"];
		}
		var oShapeConfigAssignment = new sap.gantt.config.Shape({
			key: "chartConfig1",
			shapeClassName: "sap.gantt.shape.Group",
			shapeDataName: "Assignment",
			shapeProperties: {
				time: "{beg_timestamp}",
				endTime: "{end_timestamp}",
				isDuration: true,
				enableDnD: true,
				title: "Test"
			},
			groupAggregation:[
				new sap.gantt.config.Shape({
					shapeClassName: "sap.gantt.shape.Rectangle",
					shapeProperties: {
						time: "{beg_timestamp}",
						endTime: "{end_timestamp}",
						fill:"purple",
						isDuration: true,
						height:"28"
					}
				}),
				new sap.gantt.config.Shape({
					shapeClassName: "sap.gantt.shape.Rectangle",
					shapeProperties: {
						time: "{pbeg_timestamp}",
						endTime: "{pend_timestamp}",
						fill:"orange",
						isDuration: true,
						height:"18"
					}
				}),
				new sap.gantt.config.Shape({
					shapeClassName: "sap.gantt.shape.Text",
					shapeProperties: {
						time: "{end_timestamp}",
						text: "Test",
						fill:"red",
						fillOpacity:0.1,
						fontSize:10
					}
				})
			]
		});
		var oGantt = new sap.gantt.GanttChartWithTable({
			columns: [
				new sap.ui.table.Column({
					label: "Resource Name",
					width: "130px",
					template: "ResourceName"
				}),
				new sap.ui.table.Column({
					label: "Org Unit",
					width: "100px",
					template: "OrgUnit"
				}),
				new sap.ui.table.Column({
					label: "Relative Usgae",
					width: "50px",
					template: "RelativeUsgae"
				})
			],
			timeAxis: new sap.gantt.config.TimeAxis({
				planHorizon: new sap.gantt.config.TimeHorizon({
					startTime: "20201001000000",
					endTime: "20201130000000"
				})
			}),
			shapeDataNames: ["Assignment"],
			shapes: [oShapeConfigAssignment],
			rows: {
				path: "/root",
				parameters: {
					arrayNames: ["children"]
				}
			}
		});
		var oModel = new sap.ui.model.json.JSONModel();
		oModel.setData(oData);
		oGantt.setModel(oModel);
		oGantt.placeAt('qunit-fixture');
		sap.ui.getCore().applyChanges();
		return oGantt;
	}

}, false);
