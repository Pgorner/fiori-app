/* eslint-disable linebreak-style */
/*global QUnit, sinon */

sap.ui.define([
	"sap/ui/core/Core",
	"sap/gantt/simple/StockChart",
	"sap/gantt/simple/StockChartDimension",
	"sap/gantt/simple/StockChartPeriod",
	"sap/gantt/misc/AxisTime",
	"sap/gantt/misc/Format",
	"sap/ui/core/theming/Parameters",
	"sap/gantt/simple/GanttRowSettings",
	"sap/gantt/simple/test/GanttQUnitUtils",
	"sap/gantt/simple/GanttChartWithTable",
	"sap/ui/table/TreeTable",
	"sap/gantt/axistime/ProportionZoomStrategy",
	"sap/gantt/config/TimeHorizon",
	"sap/base/Log",
	"sap/gantt/utils/GanttChartConfigurationUtils",
	"sap/ui/core/Theming",
	"sap/ui/core/RenderManager"
],function(
	Core,
	StockChart,
	StockChartDimension,
	StockChartPeriod,
	AxisTime,
	Format,
	Parameters,
	GanttRowSettings,
	GanttQUnitUtils,
	GanttChartWithTable,
	TreeTable,
	ProportionZoomStrategy,
	TimeHorizon,
	Log,
	GanttChartConfigurationUtils,
	Theming,
	RenderManager
) {
	"use strict";

	var placeAt = function(oElement) {
		var target = document.getElementById("content");
		var oRm = new RenderManager();
		oRm.openStart("svg", "svg-container");
		oRm.attr("xmlns", "http://www.w3.org/2000/svg");
		oRm.attr("width", "500");
		oRm.attr("height", "100");
		oRm.attr("viewBox", "0 0 500 100");
		oRm.attr("version", "1.1");
		oRm.openEnd();
		oElement.renderElement(oRm, oElement);
		oRm.close('svg');
		oRm.flush(target);
		oRm.destroy();
	};

	var mockAxisTime = function(oElement, aTimeRange) {
		oElement.setRowYCenter(50);
		oElement._iBaseRowHeight = 100;
		oElement.mAxisTime = new AxisTime(aTimeRange, [0, 500]);
	};

	var aTimeRange = [Format.abapTimestampToDate("20180101000000"), Format.abapTimestampToDate("20180331235959")];

	// ================================================================================
	// Stock Chart
	// ================================================================================
	QUnit.module("StockChart Basic", {
		before: function () {
			this.oTheme = GanttChartConfigurationUtils.getTheme();
		},
		beforeEach: function() {
			this.oStockChart = new StockChart({
				time: aTimeRange[0],
				endTime: aTimeRange[1],
				stockChartDimensions: [
					new StockChartDimension({
						name: "Test1",
						dimensionStrokeDasharray: "10,4"
					}),
					new StockChartDimension({
						name: "Test2",
						dimensionStrokeDasharray: "5,5",
						isThreshold : true,
						relativePoint: 10
					})
				]
			});

			mockAxisTime(this.oStockChart, aTimeRange);
			placeAt(this.oStockChart);
		},
		afterEach: function() {
			this.oStockChart.destroy();
			this.oStockChart = null;
		},
		after: function () {
			Theming.setTheme(this.oTheme);
		}
	});

	QUnit.test("Initial Rendering", function(assert) {
		assert.notEqual(window.document.getElementById(this.oStockChart.getId()), null, "SC Svg Element should be rendered");
	});

	QUnit.test("Property - Default Values - Theme Belize", function(assert) {
		assert.equal(this.oStockChart.getShowMiddleLine(), true, "Default showMiddleLine");
		assert.equal(this.oStockChart.getMinValue(), "0", "Default MinValue");
		assert.equal(this.oStockChart.getMaxValue(), "100", "Default MaxValue");

		for (var i = 0; i < this.oStockChart.getStockChartDimensions().length; i++){
			var oDimension = this.oStockChart.getStockChartDimensions()[i];
			assert.equal(oDimension.getName(), i == 0 ? "Test1" : "Test2", "Default Name");
			assert.equal(oDimension.getDimensionPathColor(), Parameters.get("sapUiChartNeutral"), "Default DimensionPathColor " + oDimension.getDimensionPathColor());
			assert.equal(oDimension.getRemainCapacityColor(), Parameters.get("sapUiChartNeutral"), "Default remainCapacityColor " + oDimension.getRemainCapacityColor());
			assert.equal(oDimension.getRemainCapacityColorNegative(), Parameters.get("sapUiChartBad"), "Default remainCapacityColorNegative " + oDimension.getRemainCapacityColorNegative());
			assert.equal(oDimension.getRelativePoint(),  i == 0 ? 0 : 10, "Default relativePoint");
			assert.equal(document.getElementById(oDimension.getId() + "-scPath").getAttribute("stroke-dasharray"),oDimension.getDimensionStrokeDasharray(), "StrokeDashArray is set correctly." + oDimension.getDimensionStrokeDasharray() );
		}
	});

	QUnit.test("Property - Default Values - Theme sap_fiori_3_hcw", function(assert) {
		var done = assert.async();
		Theming.setTheme("sap_fiori_3_hcw");
		setTimeout(function() {
			assert.equal(this.oStockChart.getShowMiddleLine(), true, "Default showMiddleLine");
			assert.equal(this.oStockChart.getMinValue(), "0", "Default MinValue");
			assert.equal(this.oStockChart.getMaxValue(), "100", "Default MaxValue");

			for (var i = 0; i < this.oStockChart.getStockChartDimensions().length; i++){
				var oDimension = this.oStockChart.getStockChartDimensions()[i];
				assert.equal(oDimension.getName(), i == 0 ? "Test1" : "Test2", "Default Name");
				assert.equal(oDimension.getDimensionPathColor(), Parameters.get("sapUiChartNeutral"), "Default DimensionPathColor " + oDimension.getDimensionPathColor());
				assert.equal(oDimension.getRemainCapacityColor(), Parameters.get("sapUiChartNeutral"), "Default remainCapacityColor " + oDimension.getRemainCapacityColor());
				assert.equal(oDimension.getRelativePoint(),  i == 0 ? 0 : 10, "Default relativePoint");
				assert.equal(document.getElementById(oDimension.getId() + "-scPath").getAttribute("stroke-dasharray"),oDimension.getDimensionStrokeDasharray(), "StrokeDashArray is set correctly." + oDimension.getDimensionStrokeDasharray() );
			}
			done();
		}.bind(this), 1000);
	});

	QUnit.test("Property - Default Values - Theme sap_fiori_3_hcb", function(assert) {
		var done = assert.async();
		Theming.setTheme("sap_fiori_3_hcb");
		setTimeout(function() {
			assert.equal(this.oStockChart.getShowMiddleLine(), true, "Default showMiddleLine");
			assert.equal(this.oStockChart.getMinValue(), "0", "Default MinValue");
			assert.equal(this.oStockChart.getMaxValue(), "100", "Default MaxValue");

			for (var i = 0; i < this.oStockChart.getStockChartDimensions().length; i++){
				var oDimension = this.oStockChart.getStockChartDimensions()[i];
				assert.equal(oDimension.getName(), i == 0 ? "Test1" : "Test2", "Default Name");
				assert.equal(oDimension.getDimensionPathColor(), Parameters.get("sapUiChartNeutral"), "Default DimensionPathColor " + oDimension.getDimensionPathColor());
				assert.equal(oDimension.getRemainCapacityColor(), Parameters.get("sapUiChartNeutral"), "Default remainCapacityColor " + oDimension.getRemainCapacityColor());
				assert.equal(oDimension.getRemainCapacityColorNegative(), Parameters.get("sapUiChartBad"), "Default remainCapacityColorNegative " + oDimension.getRemainCapacityColorNegative());
				assert.equal(oDimension.getRelativePoint(),  i == 0 ? 0 : 10, "Default relativePoint");
				assert.equal(document.getElementById(oDimension.getId() + "-scPath").getAttribute("stroke-dasharray"),oDimension.getDimensionStrokeDasharray(), "StrokeDashArray is set correctly." + oDimension.getDimensionStrokeDasharray() );
			}
			done();
		}.bind(this), 1000);
	});

	QUnit.test("Property - Default Values - Theme sap_fiori_3_dark", function(assert) {
		var done = assert.async();
		Theming.setTheme("sap_fiori_3_dark");
		setTimeout(function() {
			assert.equal(this.oStockChart.getShowMiddleLine(), true, "Default showMiddleLine");
			assert.equal(this.oStockChart.getMinValue(), "0", "Default MinValue");
			assert.equal(this.oStockChart.getMaxValue(), "100", "Default MaxValue");

			for (var i = 0; i < this.oStockChart.getStockChartDimensions().length; i++){
				var oDimension = this.oStockChart.getStockChartDimensions()[i];
				assert.equal(oDimension.getName(), i == 0 ? "Test1" : "Test2", "Default Name");
				assert.equal(oDimension.getDimensionPathColor(), Parameters.get("sapUiChartNeutral"), "Default DimensionPathColor " + oDimension.getDimensionPathColor());
				assert.equal(oDimension.getRemainCapacityColor(), Parameters.get("sapUiChartNeutral"), "Default remainCapacityColor " + oDimension.getRemainCapacityColor());
				assert.equal(oDimension.getRemainCapacityColorNegative(), Parameters.get("sapUiChartBad"), "Default remainCapacityColorNegative " + oDimension.getRemainCapacityColorNegative());
				assert.equal(oDimension.getRelativePoint(),  i == 0 ? 0 : 10, "Default relativePoint");
				assert.equal(document.getElementById(oDimension.getId() + "-scPath").getAttribute("stroke-dasharray"),oDimension.getDimensionStrokeDasharray(), "StrokeDashArray is set correctly." + oDimension.getDimensionStrokeDasharray() );
			}
			done();
		}.bind(this), 1000);
	});

	QUnit.test("Property - Default Values - Theme sap_horizon", function(assert) {
		var done = assert.async();
		Theming.setTheme("sap_horizon");
		setTimeout(function() {
			assert.equal(this.oStockChart.getShowMiddleLine(), true, "Default showMiddleLine");
			assert.equal(this.oStockChart.getMinValue(), "0", "Default MinValue");
			assert.equal(this.oStockChart.getMaxValue(), "100", "Default MaxValue");

			for (var i = 0; i < this.oStockChart.getStockChartDimensions().length; i++){
				var oDimension = this.oStockChart.getStockChartDimensions()[i];
				assert.equal(oDimension.getName(), i == 0 ? "Test1" : "Test2", "Default Name");
				assert.equal(oDimension.getDimensionPathColor(), Parameters.get("sapUiChartNeutral"), "Default DimensionPathColor " + oDimension.getDimensionPathColor());
				assert.equal(oDimension.getRemainCapacityColor(), Parameters.get("sapUiChartNeutral"), "Default remainCapacityColor " + oDimension.getRemainCapacityColor());
				assert.equal(oDimension.getRemainCapacityColorNegative(), Parameters.get("sapUiChartBad"), "Default remainCapacityColorNegative " + oDimension.getRemainCapacityColorNegative());
				assert.equal(oDimension.getRelativePoint(),  i == 0 ? 0 : 10, "Default relativePoint");
				assert.equal(document.getElementById(oDimension.getId() + "-scPath").getAttribute("stroke-dasharray"),oDimension.getDimensionStrokeDasharray(), "StrokeDashArray is set correctly." + oDimension.getDimensionStrokeDasharray() );
			}
			done();
		}.bind(this), 1000);
	});

	QUnit.test("Property - Default Values - Theme sap_horizon_dark", function(assert) {
		var done = assert.async();
		Theming.setTheme("sap_horizon_dark");
		setTimeout(function() {
			assert.equal(this.oStockChart.getShowMiddleLine(), true, "Default showMiddleLine");
			assert.equal(this.oStockChart.getMinValue(), "0", "Default MinValue");
			assert.equal(this.oStockChart.getMaxValue(), "100", "Default MaxValue");

			for (var i = 0; i < this.oStockChart.getStockChartDimensions().length; i++){
				var oDimension = this.oStockChart.getStockChartDimensions()[i];
				assert.equal(oDimension.getName(), i == 0 ? "Test1" : "Test2", "Default Name");
				assert.equal(oDimension.getDimensionPathColor(), Parameters.get("sapUiChartNeutral"), "Default DimensionPathColor " + oDimension.getDimensionPathColor());
				assert.equal(oDimension.getRemainCapacityColor(), Parameters.get("sapUiChartNeutral"), "Default remainCapacityColor " + oDimension.getRemainCapacityColor());
				assert.equal(oDimension.getRemainCapacityColorNegative(), Parameters.get("sapUiChartBad"), "Default remainCapacityColorNegative " + oDimension.getRemainCapacityColorNegative());
				assert.equal(oDimension.getRelativePoint(),  i == 0 ? 0 : 10, "Default relativePoint");
				assert.equal(document.getElementById(oDimension.getId() + "-scPath").getAttribute("stroke-dasharray"),oDimension.getDimensionStrokeDasharray(), "StrokeDashArray is set correctly." + oDimension.getDimensionStrokeDasharray() );
			}
			done();
		}.bind(this), 1000);
	});

	QUnit.test("Property - Calculated values", function(assert) {
		assert.equal(this.oStockChart.getHeight(), 100, "Height default value is inherit to row height");
		assert.equal(this.oStockChart.getWidth(), 500, "The SC shape width is correct");
	});

	var aPositivePeriods = [
		{
			from: "20180101000000",
			to: "20180101000000",
			value: 0
		},
		{
			from: "20180101000000",
			to: "20180201000000",
			value: 0
		},
		{
			from: "20180201000000",
			to: "20180201000000",
			value: 100
		},
		{
			from: "20180201000000",
			to: "20180301000000",
			value: 100
		},
		{
			from: "20180301000000",
			to: "20180301000000",
			value: 0
		},
		{
			from: "20180301000000",
			to: "20180331000000",
			value: 0
		}
	].map(function(oItem){
		oItem.from = Format.abapTimestampToDate(oItem.from);
		oItem.to = Format.abapTimestampToDate(oItem.to);
		return oItem;
	});

    var aPositiveThresholdPeriods = [
		{
			from: "20180101000000",
			to: "20180101000000",
			value: 0
		},
		{
			from: "20180101000000",
			to: "20180110000000",
			value: 40
		},
		{
			from: "20180110000000",
			to: "20180120000000",
			value: 80
		},
		{
			from: "20180120000000",
			to: "20180301000000",
			value: 80
		},
		{
			from: "20180301000000",
			to: "20180331000000",
			value: 20
		},
		{
			from: "20180331000000",
			to: "20180331000000",
			value: 10
		}
	].map(function(oItem){
		oItem.from = Format.abapTimestampToDate(oItem.from);
		oItem.to = Format.abapTimestampToDate(oItem.to);
		return oItem;
	});


	QUnit.module("StockChart with Positive / OverCapacity Periods", {
		beforeEach: function(){
			var oJSONModel = new sap.ui.model.json.JSONModel();
			oJSONModel.setData(aPositivePeriods);
			this.oStockChart = new StockChart({
				time: aTimeRange[0],
				endTime: aTimeRange[1],
				stockChartDimensions: [
					new StockChartDimension({
						name: "Weight",
						dimensionPathColor: "yellow",
						remainCapacityColor: "pink",
						stockChartPeriods: {
							path :"/",
							template: new StockChartPeriod({
								from: "{from}",
								to: "{to}",
								value: "{value}"
							}),
							templateSharable: true
						}
					})
				]
			});
			this.oStockChart.setModel(oJSONModel);
		},
		afterEach: function() {
			// this.oStockChart.destroy();
			// this.oStockChart = null;
		}
	});

	QUnit.test("Aggregation binding: dimension & periods", function(assert) {
		assert.equal(this.oStockChart.getStockChartDimensions().length, 1, "1 dimension bound to SC");

		var oDimension = this.oStockChart.getStockChartDimensions()[0];
		assert.equal(oDimension.getName(), "Weight", "dimension name set correctly");
		assert.equal(oDimension.getDimensionPathColor(), "yellow", "dimension color set correctly");
		assert.equal(oDimension.getRemainCapacityColor(), "pink", "remainCapacityColor set correctly");
		assert.equal(oDimension.getRelativePoint(), 0, "relativePoint set correctly");
		assert.equal(oDimension.getStockChartPeriods().length, 6, "6 periods belongs to first dimension");
	});

	QUnit.test("Rendering - with dimensions", function(assert) {
		mockAxisTime(this.oStockChart, aTimeRange);
		placeAt(this.oStockChart);

		var oStockChartDom = window.document.getElementById(this.oStockChart.getId());
		assert.equal(oStockChartDom.classList.value.indexOf("sapGanttStock"), 0, "DOM has correct class name");

		assert.ok(this.oStockChart.getDomRef(), "The element DOM is found");

		var oDimension = this.oStockChart.getStockChartDimensions()[0],
			sClipPathId = oDimension.getId() + "-clipPath";
		// there will be a clipPath generated for this dimension
		assert.ok(window.document.getElementById(sClipPathId) != null, "dimension clippath rendered");

		// each dimension has a path, a rectangle which refer to the over comsumption clip-path and normal clip-Path
		assert.ok(window.document.getElementById(oDimension.getId() + "-scPath"), "The dimension has the actual path DOM");
		assert.ok(window.document.getElementById(oDimension.getId() + "-scRect"), "The dimension has a rectangle clip the remain consuption");
		assert.equal(window.document.getElementById(oDimension.getId() + "-scRect").getAttribute("fill"), "pink", "remainCapacityColor set correctly");

		// middleLine is rendered
		assert.ok(oStockChartDom.querySelector("path.sapGanttStockMiddleLine"), "middle line is rendered");
		assert.ok(this.oStockChart.getDomRef("middleLine"), "there is an element with -middleLine suffix");

		assert.equal(window.document.getElementById(oDimension.getParent().getId()).getElementsByTagName("g")[0].children[0].getAttribute("id"), oDimension.getId() + "-scRect", "Should draw Rect first");
		assert.equal(window.document.getElementById(oDimension.getParent().getId()).getElementsByTagName("g")[1].children[0].getAttribute("id"), oDimension.getId() + "-scPath", "Should draw path after rect");

		// rendered has correct tooltip rectangles, the other 3 has 0 width so will not rendered
		assert.equal(oStockChartDom.querySelectorAll(".sc-tooltips rect").length, 4, "DOM has 4 rectangles to show tooltips");
		if (oStockChartDom.querySelectorAll(".sc-tooltips title")) {
			oStockChartDom.querySelectorAll(".sc-tooltips title").forEach(function(oTitle) {
				if (oTitle && oTitle.innerHTML) {
					if (oTitle.innerHTML.split(":").length > 0 && oTitle.innerHTML.split(":")[1]) {
						assert.equal(oTitle.innerHTML.split(":")[1].indexOf(' '), 0, "Space is present after :");
					}
				}
			});
		}

		// there is a sc background renderedS
		assert.equal(window.document.getElementById(oDimension.getId() + "-scRect").getBBox().height, 92, "Element has the correct height");

		//Check path of the Created Dimension
		var sSplitPath  = document.getElementById(oDimension.getId() + "-scPath").getAttribute("d").split("L")[0].trim().split(" ")[2];
		assert.equal(sSplitPath, 96, "Element is placed correctly");

		//Check path of the Created Dimension ClipPath
		sSplitPath  = document.getElementById(oDimension.getId() + "-clipPath").children[0].getAttribute("d").split("L")[0].trim().split(" ")[2];
		assert.equal(sSplitPath, 96, "Element is placed correctly");
	});

    var aPositiveDimensionWithThreshold = {"mainDimension" : aPositivePeriods, "thresholdPeriods" : aPositiveThresholdPeriods};

    QUnit.module("StockChart with Positive Threshold Period", {
		beforeEach: function(){
			var oJSONModel = new sap.ui.model.json.JSONModel();
			oJSONModel.setData(aPositiveDimensionWithThreshold);
			this.oStockChart = new StockChart({
				time: aTimeRange[0],
				endTime: aTimeRange[1],
				stockChartDimensions: [
					new StockChartDimension({
						name: "Weight",
						dimensionPathColor: "yellow",
						remainCapacityColor: "pink",
						stockChartPeriods: {
							path :"/mainDimension",
							template: new StockChartPeriod({
								from: "{from}",
								to: "{to}",
								value: "{value}"
							}),
							templateSharable: true
						}
					}),
                    new StockChartDimension({
						name: "Weight limit",
						dimensionPathColor: "red",
						remainCapacityColor: "red",
                        isThreshold: true,
                        relativePoint: 10,
						stockChartPeriods: {
							path :"/thresholdPeriods",
							template: new StockChartPeriod({
								from: "{from}",
								to: "{to}",
								value: "{value}"
							}),
							templateSharable: true
						}
					})

				]
			});
			this.oStockChart.setModel(oJSONModel);
		},
		afterEach: function() {
			this.oStockChart.destroy();
			this.oStockChart = null;
		}
	});

	QUnit.test("Aggregation binding: dimensions & periods", function(assert) {
		assert.equal(this.oStockChart.getStockChartDimensions().length, 2, "2 dimensions bound to SC");

		var oMainDimension = this.oStockChart.getStockChartDimensions()[0];
        var oThresholdDimension = this.oStockChart.getStockChartDimensions()[1];
		assert.equal(oMainDimension.getName(), "Weight", "dimension name set correctly");
		assert.equal(oMainDimension.getDimensionPathColor(), "yellow", "dimension color set correctly");
		assert.equal(oMainDimension.getRemainCapacityColor(), "pink", "remainCapacityColor set correctly");
		assert.equal(oMainDimension.getRelativePoint(), 0, "relativePoint set correctly");
		assert.equal(oMainDimension.getStockChartPeriods().length, 6, "6 periods belongs to first dimension");
        assert.equal(oThresholdDimension.getIsThreshold(), true, "isThreshold property is et to true for threshold dimension");
        assert.equal(oThresholdDimension.getName(), "Weight limit", "threshold dimension name set correctly");
		assert.equal(oThresholdDimension.getDimensionPathColor(), "red", "threshold dimension color set correctly");
		assert.equal(oThresholdDimension.getRemainCapacityColor(), "red", "threshold remainCapacityColor set correctly");
		assert.equal(oThresholdDimension.getRelativePoint(), 10, "relativePoint set correctly");
		assert.equal(oThresholdDimension.getStockChartPeriods().length, 6, "6 periods belongs to threshold dimension");
	});

	QUnit.test("Rendering - with dimensions", function(assert) {
		mockAxisTime(this.oStockChart, aTimeRange);
		placeAt(this.oStockChart);

		var oStockChartDom = window.document.getElementById(this.oStockChart.getId());
		assert.equal(oStockChartDom.classList.value.indexOf("sapGanttStock"), 0, "DOM has correct class name");

		assert.ok(this.oStockChart.getDomRef(), "The element DOM is found");

		var oDimension = this.oStockChart.getStockChartDimensions()[0],
			sClipPathId = oDimension.getId() + "-clipPath";

        var thresholdDimension = this.oStockChart.getStockChartDimensions()[1],
            thresholdClipPathId = thresholdDimension.getId() + "-clipPath";
		// there will be a clipPath generated for this dimension
		assert.ok(window.document.getElementById(sClipPathId) != null, "dimension clippath rendered");
        //there will be a clippath generated for threshold dimension
        assert.ok(window.document.getElementById(thresholdClipPathId) != null, "threshold clippath rendered");

		// each dimension has a path, a rectangle which refer to the over comsumption clip-path and normal clip-Path
		assert.ok(window.document.getElementById(oDimension.getId() + "-scPath"), "The main dimension has the actual path DOM");
		assert.ok(window.document.getElementById(oDimension.getId() + "-scRect"), "The main dimension has a rectangle clip the remain consuption");

        assert.ok(window.document.getElementById(thresholdDimension.getId() + "-scPath"), "The threshold dimension has the actual path DOM");
		assert.ok(window.document.getElementById(thresholdDimension.getId() + "-scRect"), "The threshold dimension has a rectangle clip the remain consuption");

		// middleLine is rendered
		assert.ok(oStockChartDom.querySelector("path.sapGanttStockMiddleLine"), "middle line is rendered");
		assert.ok(this.oStockChart.getDomRef("middleLine"), "there is an element with -middleLine suffix");

		assert.equal(window.document.getElementById(oDimension.getParent().getId()).getElementsByTagName("g")[0].children[0].getAttribute("id"), oDimension.getId() + "-scRect", "Should draw Rect first");
		assert.equal(window.document.getElementById(oDimension.getParent().getId()).getElementsByTagName("g")[2].children[0].getAttribute("id"), oDimension.getId() + "-scPath", "Should draw path after rect");

		// rendered has correct tooltip rectangles, the other 3 has 0 width so will not rendered
		assert.equal(oStockChartDom.querySelectorAll(".sc-tooltips rect").length, 9, "DOM has 9 rectangles to show tooltips");
		if (oStockChartDom.querySelectorAll(".sc-tooltips title")) {
			oStockChartDom.querySelectorAll(".sc-tooltips title").forEach(function(oTitle) {
				if (oTitle && oTitle.innerHTML) {
					if (oTitle.innerHTML.split(":").length > 0 && oTitle.innerHTML.split(":")[1]) {
						assert.equal(oTitle.innerHTML.split(":")[1].indexOf(' '), 0, "Space is present after :");
					}
				}
			});
		}

		// there is a sc background rendered
		assert.equal(window.document.getElementById(oDimension.getId() + "-scRect").getBBox().height, 92, "Element has the correct height");

		//Check path of the Created Dimension
		var sSplitPath  = document.getElementById(oDimension.getId() + "-scPath").getAttribute("d").split("L")[0].trim().split(" ")[2];
		assert.equal(sSplitPath, 96, "Element is placed correctly");

		//Check path of the Created Dimension ClipPath
		sSplitPath  = document.getElementById(oDimension.getId() + "-clipPath").children[0].getAttribute("d").split("L")[0].trim().split(" ")[2];
		assert.equal(sSplitPath, 96, "Element is placed correctly");
	});

	var aNegativeThresholds = [
        {
			from: "20180101000000",
			to: "20180331000000",
			value: -80
		}
    ].map(function(oItem){
		oItem.from = Format.abapTimestampToDate(oItem.from);
		oItem.to = Format.abapTimestampToDate(oItem.to);
		return oItem;
	});

	var aPositiveDimensionWithNegativeThreshold = {"mainDimension" : aPositivePeriods, "thresholdPeriods" : aNegativeThresholds};
	QUnit.module("StockChart with Positive Period and Negative Threshold Period", {
		beforeEach: function(){
			var oJSONModel = new sap.ui.model.json.JSONModel();
			oJSONModel.setData(aPositiveDimensionWithNegativeThreshold);
			this.oStockChart = new StockChart({
				time: aTimeRange[0],
				endTime: aTimeRange[1],
				stockChartDimensions: [
					new StockChartDimension({
						name: "Weight",
						dimensionPathColor: "yellow",
						remainCapacityColor: "pink",
						stockChartPeriods: {
							path :"/mainDimension",
							template: new StockChartPeriod({
								from: "{from}",
								to: "{to}",
								value: "{value}"
							}),
							templateSharable: true
						}
					}),
                    new StockChartDimension({
						name: "Weight limit",
						dimensionPathColor: "red",
						remainCapacityColor: "red",
                        isThreshold: true,
                        relativePoint: 10,
						stockChartPeriods: {
							path :"/thresholdPeriods",
							template: new StockChartPeriod({
								from: "{from}",
								to: "{to}",
								value: "{value}"
							}),
							templateSharable: true
						}
					})

				]
			});
			this.oStockChart.setModel(oJSONModel);
		},
		afterEach: function() {
			this.oStockChart.destroy();
			this.oStockChart = null;
		}
	});

	QUnit.test("Aggregation binding: dimensions & periods", function(assert) {
		assert.equal(this.oStockChart.getStockChartDimensions().length, 2, "2 dimensions bound to SC");

		var oMainDimension = this.oStockChart.getStockChartDimensions()[0];
        var oThresholdDimension = this.oStockChart.getStockChartDimensions()[1];
		assert.equal(oMainDimension.getName(), "Weight", "dimension name set correctly");
		assert.equal(oMainDimension.getDimensionPathColor(), "yellow", "dimension color set correctly");
		assert.equal(oMainDimension.getRemainCapacityColor(), "pink", "remainCapacityColor set correctly");
		assert.equal(oMainDimension.getRelativePoint(), 0, "relativePoint set correctly");
		assert.equal(oMainDimension.getStockChartPeriods().length, 6, "6 periods belongs to first dimension");
        assert.equal(oThresholdDimension.getIsThreshold(), true, "isThreshold property is et to true for threshold dimension");
        assert.equal(oThresholdDimension.getName(), "Weight limit", "threshold dimension name set correctly");
		assert.equal(oThresholdDimension.getDimensionPathColor(), "red", "threshold dimension color set correctly");
		assert.equal(oThresholdDimension.getRemainCapacityColor(), "red", "threshold remainCapacityColor set correctly");
		assert.equal(oThresholdDimension.getRelativePoint(), 10, "relativePoint set correctly");
		assert.equal(oThresholdDimension.getStockChartPeriods().length, 1, "1 periods belongs to threshold dimension");
	});

	QUnit.test("Rendering - with dimensions", function(assert) {
		mockAxisTime(this.oStockChart, aTimeRange);
		placeAt(this.oStockChart);

		var oStockChartDom = window.document.getElementById(this.oStockChart.getId());
		assert.equal(oStockChartDom.classList.value.indexOf("sapGanttStock"), 0, "DOM has correct class name");

		assert.ok(this.oStockChart.getDomRef(), "The element DOM is found");

		var oDimension = this.oStockChart.getStockChartDimensions()[0],
			sClipPathId = oDimension.getId() + "-clipPath";

        var thresholdDimension = this.oStockChart.getStockChartDimensions()[1],
            thresholdClipPathId = thresholdDimension.getId() + "-clipPath";
		// there will be a clipPath generated for this dimension
		assert.ok(window.document.getElementById(sClipPathId) != null, "dimension clippath rendered");
        //there will be a clippath generated for threshold dimension
        assert.ok(window.document.getElementById(thresholdClipPathId) != null, "threshold clippath rendered");

		// each dimension has a path, a rectangle which refer to the over comsumption clip-path and normal clip-Path
		assert.ok(window.document.getElementById(oDimension.getId() + "-scPath"), "The main dimension has the actual path DOM");
		assert.ok(window.document.getElementById(oDimension.getId() + "-scRect"), "The main dimension has a rectangle clip the remain consuption");

        assert.ok(window.document.getElementById(thresholdDimension.getId() + "-scPath"), "The threshold dimension has the actual path DOM");
		assert.ok(window.document.getElementById(thresholdDimension.getId() + "-scRect"), "The threshold dimension has a rectangle clip the remain consuption");

		// middleLine is rendered
		assert.ok(oStockChartDom.querySelector("path.sapGanttStockMiddleLine"), "middle line is rendered");
		assert.ok(this.oStockChart.getDomRef("middleLine"), "there is an element with -middleLine suffix");

		assert.equal(window.document.getElementById(oDimension.getParent().getId()).getElementsByTagName("g")[0].children[0].getAttribute("id"), oDimension.getId() + "-scRect", "Should draw Rect first");
		assert.equal(window.document.getElementById(oDimension.getParent().getId()).getElementsByTagName("g")[2].children[0].getAttribute("id"), oDimension.getId() + "-scPath", "Should draw path after rect");

		assert.equal(oStockChartDom.querySelectorAll(".sc-tooltips rect").length, 6, "DOM has 6 rectangles to show tooltips");

		// there is a sc background rendered
		assert.equal(window.document.getElementById(oDimension.getId() + "-scRect").getBBox().height, 92, "Element has the correct height");

		//Check path of the Created Dimension
		var sSplitPath  = document.getElementById(oDimension.getId() + "-scPath").getAttribute("d").split("L")[0].trim().split(" ")[2];
		assert.equal(sSplitPath, 96, "Element is placed correctly");

		//Check path of the Created Dimension ClipPath
		sSplitPath  = document.getElementById(oDimension.getId() + "-clipPath").children[0].getAttribute("d").split("L")[0].trim().split(" ")[2];
		assert.equal(sSplitPath, 96, "Element is placed correctly");
	});

	var aCombinedPeriods = [
		{
			from: "20180101000000",
			to: "20180101000000",
			value: 0
		},
		{
			from: "20180101000000",
			to: "20180201000000",
			value: 0
		},
		{
			from: "20180201000000",
			to: "20180201000000",
			value: 100
		},
		{
			from: "20180201000000",
			to: "20180301000000",
			value: 100
		},
		{
			from: "20180301000000",
			to: "20180301000000",
			value: -80
		},
		{
			from: "20180301000000",
			to: "20180331000000",
			value: -80
		}
	].map(function(oItem){
		oItem.from = Format.abapTimestampToDate(oItem.from);
		oItem.to = Format.abapTimestampToDate(oItem.to);
		return oItem;
	});

	var aCombinednWithNegativeThreshold = {"mainDimension" : aCombinedPeriods, "thresholdPeriods" : aNegativeThresholds};
	QUnit.module("StockChart with Combined Period and Negative Threshold Period", {
		beforeEach: function(){
			var oJSONModel = new sap.ui.model.json.JSONModel();
			oJSONModel.setData(aCombinednWithNegativeThreshold);
			this.oStockChart = new StockChart({
				time: aTimeRange[0],
				endTime: aTimeRange[1],
				stockChartDimensions: [
					new StockChartDimension({
						name: "Weight",
						dimensionPathColor: "yellow",
						remainCapacityColor: "pink",
						stockChartPeriods: {
							path :"/mainDimension",
							template: new StockChartPeriod({
								from: "{from}",
								to: "{to}",
								value: "{value}"
							}),
							templateSharable: true
						}
					}),
                    new StockChartDimension({
						name: "Weight limit",
						dimensionPathColor: "red",
						remainCapacityColor: "red",
                        isThreshold: true,
                        relativePoint: 10,
						stockChartPeriods: {
							path :"/thresholdPeriods",
							template: new StockChartPeriod({
								from: "{from}",
								to: "{to}",
								value: "{value}"
							}),
							templateSharable: true
						}
					})

				]
			});
			this.oStockChart.setModel(oJSONModel);
		},
		afterEach: function() {
			this.oStockChart.destroy();
			this.oStockChart = null;
		}
	});

	QUnit.test("Aggregation binding: dimensions & periods", function(assert) {
		assert.equal(this.oStockChart.getStockChartDimensions().length, 2, "2 dimensions bound to SC");

		var oMainDimension = this.oStockChart.getStockChartDimensions()[0];
        var oThresholdDimension = this.oStockChart.getStockChartDimensions()[1];
		assert.equal(oMainDimension.getName(), "Weight", "dimension name set correctly");
		assert.equal(oMainDimension.getDimensionPathColor(), "yellow", "dimension color set correctly");
		assert.equal(oMainDimension.getRemainCapacityColor(), "pink", "remainCapacityColor set correctly");
		assert.equal(oMainDimension.getRelativePoint(), 0, "relativePoint set correctly");
		assert.equal(oMainDimension.getStockChartPeriods().length, 6, "6 periods belongs to first dimension");
        assert.equal(oThresholdDimension.getIsThreshold(), true, "isThreshold property is et to true for threshold dimension");
        assert.equal(oThresholdDimension.getName(), "Weight limit", "threshold dimension name set correctly");
		assert.equal(oThresholdDimension.getDimensionPathColor(), "red", "threshold dimension color set correctly");
		assert.equal(oThresholdDimension.getRemainCapacityColor(), "red", "threshold remainCapacityColor set correctly");
		assert.equal(oThresholdDimension.getRelativePoint(), 10, "relativePoint set correctly");
		assert.equal(oThresholdDimension.getStockChartPeriods().length, 1, "1 periods belongs to threshold dimension");
	});

	QUnit.test("Rendering - with dimensions", function(assert) {
		mockAxisTime(this.oStockChart, aTimeRange);
		placeAt(this.oStockChart);

		var oStockChartDom = window.document.getElementById(this.oStockChart.getId());
		assert.equal(oStockChartDom.classList.value.indexOf("sapGanttStock"), 0, "DOM has correct class name");

		assert.ok(this.oStockChart.getDomRef(), "The element DOM is found");

		var oDimension = this.oStockChart.getStockChartDimensions()[0],
			sClipPathId = oDimension.getId() + "-clipPath";

        var thresholdDimension = this.oStockChart.getStockChartDimensions()[1],
            thresholdClipPathId = thresholdDimension.getId() + "-clipPath";
		// there will be a clipPath generated for this dimension
		assert.ok(window.document.getElementById(sClipPathId) != null, "dimension clippath rendered");
        //there will be a clippath generated for threshold dimension
        assert.ok(window.document.getElementById(thresholdClipPathId) != null, "threshold clippath rendered");

		// each dimension has a path, a rectangle which refer to the over comsumption clip-path and normal clip-Path
		assert.ok(window.document.getElementById(oDimension.getId() + "-scPath"), "The main dimension has the actual path DOM");
		assert.ok(window.document.getElementById(oDimension.getId() + "-scRect"), "The main dimension has a rectangle clip the remain consuption");

        assert.ok(window.document.getElementById(thresholdDimension.getId() + "-scPath"), "The threshold dimension has the actual path DOM");
		assert.ok(window.document.getElementById(thresholdDimension.getId() + "-scRect"), "The threshold dimension has a rectangle clip the remain consuption");

		// middleLine is rendered
		assert.ok(oStockChartDom.querySelector("path.sapGanttStockMiddleLine"), "middle line is rendered");
		assert.ok(this.oStockChart.getDomRef("middleLine"), "there is an element with -middleLine suffix");

		assert.equal(window.document.getElementById(oDimension.getParent().getId()).getElementsByTagName("g")[0].children[0].getAttribute("id"), oDimension.getId() + "-scRect", "Should draw Rect first");
		assert.equal(window.document.getElementById(oDimension.getParent().getId()).getElementsByTagName("g")[2].children[0].getAttribute("id"), oDimension.getId() + "-scPath", "Should draw path after rect");

		assert.equal(oStockChartDom.querySelectorAll(".sc-tooltips rect").length, 6, "DOM has 6 rectangles to show tooltips");

		// there is a sc background rendered
		assert.equal(window.document.getElementById(oDimension.getId() + "-scRect").getBBox().height, 92, "Element has the correct height");

		//Check path of the Created Dimension
		var sSplitPath  = document.getElementById(oDimension.getId() + "-scPath").getAttribute("d").split("L")[0].trim().split(" ")[2];
		assert.equal(sSplitPath, 96, "Element is placed correctly");

		//Check path of the Created Dimension ClipPath
		sSplitPath  = document.getElementById(oDimension.getId() + "-clipPath").children[0].getAttribute("d").split("L")[0].trim().split(" ")[2];
		assert.equal(sSplitPath, 96, "Element is placed correctly");
	});


	var aPositiveRelativePeriods = [
		{
			from: "20180101000000",
			to: "20180101000000",
			value: 20
		},
		{
			from: "20180101000000",
			to: "20180201000000",
			value: 20
		},
		{
			from: "20180201000000",
			to: "20180201000000",
			value: 100
		},
		{
			from: "20180201000000",
			to: "20180301000000",
			value: 100
		},
		{
			from: "20180301000000",
			to: "20180301000000",
			value: 20
		},
		{
			from: "20180301000000",
			to: "20180331000000",
			value: 20
		}
	].map(function(oItem){
		oItem.from = Format.abapTimestampToDate(oItem.from);
		oItem.to = Format.abapTimestampToDate(oItem.to);
		return oItem;
	});

	QUnit.module("StockChart with Positive / OverCapacity / RelativePoint Periods", {
		beforeEach: function(){
			var oJSONModel = new sap.ui.model.json.JSONModel();
			oJSONModel.setData(aPositiveRelativePeriods);
			this.oStockChart = new StockChart({
				time: aTimeRange[0],
				endTime: aTimeRange[1],
				stockChartDimensions: [
					new StockChartDimension({
						name: "Weight",
						dimensionPathColor: "yellow",
						remainCapacityColor: "pink",
						relativePoint: 20,
						stockChartPeriods: {
							path :"/",
							template: new StockChartPeriod({
								from: "{from}",
								to: "{to}",
								value: "{value}"
							}),
							templateSharable: true
						}
					})
				]
			});
			this.oStockChart.setModel(oJSONModel);
		},
		afterEach: function() {
			this.oStockChart.destroy();
			this.oStockChart = null;
		}
	});

	QUnit.test("Aggregation binding: dimension & periods", function(assert) {
		assert.equal(this.oStockChart.getStockChartDimensions().length, 1, "1 dimension bound to sc");

		var oDimension = this.oStockChart.getStockChartDimensions()[0];
		assert.equal(oDimension.getName(), "Weight", "dimension name set correctly");
		assert.equal(oDimension.getDimensionPathColor(), "yellow", "dimension color set correctly");
		assert.equal(oDimension.getRemainCapacityColor(), "pink", "remainCapacityColor set correctly");
		assert.equal(oDimension.getRelativePoint(), 20, "relativePoint set correctly");
		assert.equal(oDimension.getStockChartPeriods().length, 6, "6 periods belongs to first dimension");
	});

	QUnit.test("Rendering - with dimensions", function(assert) {
		mockAxisTime(this.oStockChart, aTimeRange);
		placeAt(this.oStockChart);

		var oStockChartDom = window.document.getElementById(this.oStockChart.getId());
		assert.equal(oStockChartDom.classList.value.indexOf("sapGanttStock"), 0, "DOM has correct class name");

		assert.ok(this.oStockChart.getDomRef(), "The element DOM is found");

		var oDimension = this.oStockChart.getStockChartDimensions()[0],
			sClipPathId = oDimension.getId() + "-clipPath";
		// there will be a clipPath generated for this dimension
		assert.ok(window.document.getElementById(sClipPathId) != null, "dimension clippath rendered");

		// each dimension has a path, a rectangle which refer to the over comsumption clip-path and normal clip-Path
		assert.ok(window.document.getElementById(oDimension.getId() + "-scPath"), "The dimension has the actual path DOM");
		assert.ok(window.document.getElementById(oDimension.getId() + "-scRect"), "The dimension has a rectangle clip the remain consuption");

		// middleLine is rendered
		assert.ok(oStockChartDom.querySelector("path.sapGanttStockMiddleLine"), "middle line is rendered");
		assert.ok(this.oStockChart.getDomRef("middleLine"), "there is an element with -middleLine suffix");

		assert.equal(window.document.getElementById(oDimension.getParent().getId()).getElementsByTagName("g")[0].children[0].getAttribute("id"), oDimension.getId() + "-scRect", "Should draw Rect first");
		assert.equal(window.document.getElementById(oDimension.getParent().getId()).getElementsByTagName("g")[1].children[0].getAttribute("id"), oDimension.getId() + "-scPath", "Should draw path after rect");

		// rendered has correct tooltip rectangles, the other 3 has 0 width so will not rendered
		assert.equal(oStockChartDom.querySelectorAll(".sc-tooltips rect").length, 4, "DOM has 4 rectangles to show tooltips");
		if (oStockChartDom.querySelectorAll(".sc-tooltips title")) {
			oStockChartDom.querySelectorAll(".sc-tooltips title").forEach(function(oTitle) {
				if (oTitle && oTitle.innerHTML) {
					if (oTitle.innerHTML.split(":").length > 0 && oTitle.innerHTML.split(":")[1]) {
						assert.equal(oTitle.innerHTML.split(":")[1].indexOf(' '), 0, "Space is present after :");
					}
				}
			});
		}

		// there is a sc background rendered
		assert.equal(window.document.getElementById(oDimension.getId() + "-scRect").getBBox().height, 92, "Element scRect has the correct height");

		//Check path of the Created Dimension Path
		var sSplitPath  = document.getElementById(oDimension.getId() + "-scPath").getAttribute("d").split("L")[0].trim().split(" ")[2];
		assert.equal(sSplitPath, 77.6, "Element is placed correctly");

		//Check path of the Created Dimension Path
		sSplitPath  = document.getElementById(oDimension.getId() + "-clipPath").children[0].getAttribute("d").split("L")[0].trim().split(" ")[2];
		assert.equal(sSplitPath, 77.6, "Element is placed correctly");
	});

    var aPositiveRelDimensionWithThreshold = {"mainDimension" : aPositiveRelativePeriods, "thresholdPeriods" : aPositiveThresholdPeriods};

    QUnit.module("StockChart with Positive / OverCapacity / RelativePoint Periods and Positive Threshold", {
		beforeEach: function(){
			var oJSONModel = new sap.ui.model.json.JSONModel();
			oJSONModel.setData(aPositiveRelDimensionWithThreshold);
			this.oStockChart = new StockChart({
				time: aTimeRange[0],
				endTime: aTimeRange[1],
				stockChartDimensions: [
					new StockChartDimension({
						name: "Weight",
						dimensionPathColor: "yellow",
						remainCapacityColor: "pink",
						relativePoint: 20,
						stockChartPeriods: {
							path :"/mainDimension",
							template: new StockChartPeriod({
								from: "{from}",
								to: "{to}",
								value: "{value}"
							}),
							templateSharable: true
						}
					}),
                    new StockChartDimension({
						name: "Weight limit",
						dimensionPathColor: "red",
						remainCapacityColor: "red",
                        isThreshold: true,
                        relativePoint: 30,
						stockChartPeriods: {
							path :"/thresholdPeriods",
							template: new StockChartPeriod({
								from: "{from}",
								to: "{to}",
								value: "{value}"
							}),
							templateSharable: true
						}
					})
				]
			});
			this.oStockChart.setModel(oJSONModel);
		},
		afterEach: function() {
			this.oStockChart.destroy();
			this.oStockChart = null;
		}
	});

    QUnit.test("Aggregation binding: dimensions & periods", function(assert) {
		assert.equal(this.oStockChart.getStockChartDimensions().length, 2, "2 dimensions bound to SC");

		var oMainDimension = this.oStockChart.getStockChartDimensions()[0];
        var oThresholdDimension = this.oStockChart.getStockChartDimensions()[1];
		assert.equal(oMainDimension.getName(), "Weight", "dimension name set correctly");
		assert.equal(oMainDimension.getDimensionPathColor(), "yellow", "dimension color set correctly");
		assert.equal(oMainDimension.getRemainCapacityColor(), "pink", "remainCapacityColor set correctly");
		assert.equal(oMainDimension.getRelativePoint(), 20, "relativePoint set correctly");
		assert.equal(oMainDimension.getStockChartPeriods().length, 6, "6 periods belongs to first dimension");
        assert.equal(oThresholdDimension.getIsThreshold(), true, "isThreshold property is et to true for threshold dimension");
        assert.equal(oThresholdDimension.getName(), "Weight limit", "threshold dimension name set correctly");
		assert.equal(oThresholdDimension.getDimensionPathColor(), "red", "threshold dimension color set correctly");
		assert.equal(oThresholdDimension.getRemainCapacityColor(), "red", "threshold remainCapacityColor set correctly");
		assert.equal(oThresholdDimension.getRelativePoint(), 30, "relativePoint set correctly");
		assert.equal(oThresholdDimension.getStockChartPeriods().length, 6, "6 periods belongs to threshold dimension");
	});

	QUnit.test("Rendering - with dimensions", function(assert) {
		mockAxisTime(this.oStockChart, aTimeRange);
		placeAt(this.oStockChart);

		var oStockChartDom = window.document.getElementById(this.oStockChart.getId());
		assert.equal(oStockChartDom.classList.value.indexOf("sapGanttStock"), 0, "DOM has correct class name");

		assert.ok(this.oStockChart.getDomRef(), "The element DOM is found");

		var oDimension = this.oStockChart.getStockChartDimensions()[0],
			sClipPathId = oDimension.getId() + "-clipPath";

        var thresholdDimension = this.oStockChart.getStockChartDimensions()[1],
            thresholdClipPathId = thresholdDimension.getId() + "-clipPath";
		// there will be a clipPath generated for this dimension
		assert.ok(window.document.getElementById(sClipPathId) != null, "dimension clippath rendered");
        //there will be a clippath generated for threshold dimension
        assert.ok(window.document.getElementById(thresholdClipPathId) != null, "threshold clippath rendered");

		// each dimension has a path, a rectangle which refer to the over comsumption clip-path and normal clip-Path
		assert.ok(window.document.getElementById(oDimension.getId() + "-scPath"), "The main dimension has the actual path DOM");
		assert.ok(window.document.getElementById(oDimension.getId() + "-scRect"), "The main dimension has a rectangle clip the remain consuption");

        assert.ok(window.document.getElementById(thresholdDimension.getId() + "-scPath"), "The threshold dimension has the actual path DOM");
		assert.ok(window.document.getElementById(thresholdDimension.getId() + "-scRect"), "The threshold dimension has a rectangle clip the remain consuption");

		// middleLine is rendered
		assert.ok(oStockChartDom.querySelector("path.sapGanttStockMiddleLine"), "middle line is rendered");
		assert.ok(this.oStockChart.getDomRef("middleLine"), "there is an element with -middleLine suffix");

		assert.equal(window.document.getElementById(oDimension.getParent().getId()).getElementsByTagName("g")[0].children[0].getAttribute("id"), oDimension.getId() + "-scRect", "Should draw Rect first");
		assert.equal(window.document.getElementById(oDimension.getParent().getId()).getElementsByTagName("g")[2].children[0].getAttribute("id"), oDimension.getId() + "-scPath", "Should draw path after rect");

		// rendered has correct tooltip rectangles, the other 3 has 0 width so will not rendered
		assert.equal(oStockChartDom.querySelectorAll(".sc-tooltips rect").length, 9, "DOM has 9 rectangles to show tooltips");
		if (oStockChartDom.querySelectorAll(".sc-tooltips title")) {
			oStockChartDom.querySelectorAll(".sc-tooltips title").forEach(function(oTitle) {
				if (oTitle && oTitle.innerHTML) {
					if (oTitle.innerHTML.split(":").length > 0 && oTitle.innerHTML.split(":")[1]) {
						assert.equal(oTitle.innerHTML.split(":")[1].indexOf(' '), 0, "Space is present after :");
					}
				}
			});
		}

		// there is a sc background rendered
		assert.equal(window.document.getElementById(oDimension.getId() + "-scRect").getBBox().height, 92, "Element has the correct height");

		//Check path of the Created Dimension
		var sSplitPath  = document.getElementById(oDimension.getId() + "-scPath").getAttribute("d").split("L")[0].trim().split(" ")[2];
		assert.equal(sSplitPath, 77.6, "Element is placed correctly");

		//Check path of the Created Dimension ClipPath
		sSplitPath  = document.getElementById(oDimension.getId() + "-clipPath").children[0].getAttribute("d").split("L")[0].trim().split(" ")[2];
		assert.equal(sSplitPath, 77.6, "Element is placed correctly");
	});

	var aNegativePeriods = [
		{
			from: "20180101000000",
			to: "20180201000000",
			value: -10
		},
		{
			from: "20180201000000",
			to: "20180201000000",
			value: -100
		},
		{
			from: "20180201000000",
			to: "20180301000000",
			value: -100
		},
		{
			from: "20180301000000",
			to: "20180331000000",
			value: -10
		}
	].map(function(oItem){
		oItem.from = Format.abapTimestampToDate(oItem.from);
		oItem.to = Format.abapTimestampToDate(oItem.to);
		return oItem;
	});

    var aNegativeThresholds = [
        {
			from: "20180101000000",
			to: "20180331000000",
			value: -80
		}
    ].map(function(oItem){
		oItem.from = Format.abapTimestampToDate(oItem.from);
		oItem.to = Format.abapTimestampToDate(oItem.to);
		return oItem;
	});

	QUnit.module("StockChart with Negative / Relative / Min = -100 / Max = 0 Periods", {
		beforeEach: function(){
			var oJSONModel = new sap.ui.model.json.JSONModel();
			oJSONModel.setData(aNegativePeriods);
			this.oStockChart = new StockChart({
				time: aTimeRange[0],
				endTime: aTimeRange[1],
				minValue: -100,
				maxValue: 0,
				stockChartDimensions: [
					new StockChartDimension({
						name: "Weight",
						dimensionPathColor: "yellow",
						remainCapacityColorNegative: "blue",
						relativePoint: 0,
						stockChartPeriods: {
							path :"/",
							template: new StockChartPeriod({
								from: "{from}",
								to: "{to}",
								value: "{value}"
							}),
							templateSharable: true
						}
					})
				]
			});
			this.oStockChart.setModel(oJSONModel);
		},
		afterEach: function() {
			this.oStockChart.destroy();
			this.oStockChart = null;
		},
		getYActual: function(periodValue) {
			var iHeightPaddingPixel = 8;
			var iHeight = this.oStockChart.getHeight(),
			iY = this.oStockChart.getRowYCenter() - iHeight / 2,
			iRowY = this.oStockChart.getShowCompactView() ? iY + (iHeightPaddingPixel / 2) : iY,
			iRowHeight = this.oStockChart.getShowCompactView() ? iHeight - iHeightPaddingPixel : iHeight;
			var yOrigin = iRowY + iRowHeight;
			var iPercentageHeight = iRowHeight * (this.oStockChart._createTransform(periodValue) / (100));
			var yActual = yOrigin - iPercentageHeight;
			return yActual;
		}
	});

	QUnit.test("Aggregation binding: dimension & periods", function(assert) {
		assert.equal(this.oStockChart.getStockChartDimensions().length, 1, "1 dimension bound to sc");

		var oDimension = this.oStockChart.getStockChartDimensions()[0];
		assert.equal(oDimension.getName(), "Weight", "dimension name set correctly");
		assert.equal(oDimension.getDimensionPathColor(), "yellow", "dimensionPathColor set correctly");
		assert.equal(oDimension.getRelativePoint(), 0, "relativePoint set correctly");
		assert.equal(oDimension.getRemainCapacityColorNegative(), "blue", "remainCapacityColorNegative set correctly");
		assert.equal(oDimension.getStockChartPeriods().length, 4, "4 periods belongs to first dimension");
		assert.equal(this.oStockChart.getMinValue(), (-100), "minValue set correctly");
		assert.equal(this.oStockChart.getMaxValue(), 0, "maxValue set correctly");
	});

	QUnit.test("Rendering - with dimensions", function(assert) {
		mockAxisTime(this.oStockChart, aTimeRange);
		placeAt(this.oStockChart);

		var oStockChartDom = window.document.getElementById(this.oStockChart.getId());
		assert.equal(oStockChartDom.classList.value.indexOf("sapGanttStock"), 0, "DOM has correct class name");

		assert.ok(this.oStockChart.getDomRef(), "The element DOM is found");

		var oDimension = this.oStockChart.getStockChartDimensions()[0],
			sClipPathId = oDimension.getId() + "-clipPath";
		// there will be a clipPath generated for this dimension
		assert.ok(window.document.getElementById(sClipPathId) != null, "dimension clippath rendered");

		// each dimension has a path, a rectangle which refer to the over comsumption clip-path and normal clip-Path
		assert.ok(window.document.getElementById(oDimension.getId() + "-scPath"), "The dimension has the actual path DOM");
		assert.ok(window.document.getElementById(oDimension.getId() + "-scRectNegative"), "The dimension has a rectangle clip the remain consuption");
		assert.equal(window.document.getElementById(oDimension.getId() + "-scRectNegative").getAttribute("fill"), "blue", "remainCapacityColorNegative set correctly");

		// middleLine is rendered
		assert.ok(oStockChartDom.querySelector("path.sapGanttStockMiddleLine"), "middle line is rendered");
		assert.ok(this.oStockChart.getDomRef("middleLine"), "there is an element with -middleLine suffix");

		assert.equal(window.document.getElementById(oDimension.getParent().getId()).getElementsByTagName("g")[0].children[0].getAttribute("id"), oDimension.getId() + "-scRectNegative", "Should draw Rect first");
		assert.equal(window.document.getElementById(oDimension.getParent().getId()).getElementsByTagName("g")[1].children[0].getAttribute("id"), oDimension.getId() + "-scPath", "Should draw path after rect");

		// rendered has correct tooltip rectangles, the other 3 has 0 width so will not rendered
		assert.equal(oStockChartDom.querySelectorAll(".sc-tooltips rect").length, 4, "DOM has 4 rectangles to show tooltips");
		if (oStockChartDom.querySelectorAll(".sc-tooltips title")) {
			oStockChartDom.querySelectorAll(".sc-tooltips title").forEach(function(oTitle) {
				if (oTitle && oTitle.innerHTML) {
					if (oTitle.innerHTML.split(":").length > 0 && oTitle.innerHTML.split(":")[1]) {
						assert.equal(oTitle.innerHTML.split(":")[1].indexOf(' '), 0, "Space is present after :");
					}
				}
			});
		}

		// there is a sc background rendered
		assert.equal(window.document.getElementById(oDimension.getId() + "-scRectNegative").getBBox().height, 92, "Element scRect has the correct height");

		//Check path of the Created Dimension
		var sSplitPath  = document.getElementById(oDimension.getId() + "-scPath").getAttribute("d").split("L")[0].trim().split(" ")[2];
		var sTotalPaths = document.getElementById(oDimension.getId() + "-scPath").getAttribute("d").split("L").length;
		var sSplitPathEnd = document.getElementById(oDimension.getId() + "-scPath").getAttribute("d").split("L")[sTotalPaths - 1].trim().split(" ")[1];
		var sPathStartValue = this.getYActual(oDimension.getStockChartPeriods()[0].getValue());
		assert.equal(sSplitPath, sPathStartValue, "Element scPath starts from actual value");

		var sPathEndValue = this.getYActual(oDimension.getStockChartPeriods()[oDimension.getStockChartPeriods().length - 1].getValue());
		assert.equal(sSplitPathEnd, sPathEndValue, "Element scPath Ends at actual value");


		//Check path of the Created Dimension ClipPath
		sSplitPath  = document.getElementById(oDimension.getId() + "-clipPath").children[0].getAttribute("d").split("L")[0].trim().split(" ")[2];
		assert.equal(sSplitPath, 4, "Element clipPath is placed correctly");

		//yActual = yOrigin - PercentageHeight
		assert.ok(this.getYActual(100) >  this.getYActual(200), "PercentageHeight of stockchart period 200 should be greaterthan period 100");
	});

	var aOnlyNegativePeriods = [
		{
			from: "20180101000000",
			to: "20180201000000",
			value: -100
		},
		{
			from: "20180301000000",
			to: "20180331000000",
			value: -100
		}
	].map(function(oItem){
		oItem.from = Format.abapTimestampToDate(oItem.from);
		oItem.to = Format.abapTimestampToDate(oItem.to);
		return oItem;
	});

	QUnit.module("StockChart with only Negative Periods relative point 0", {
		beforeEach: function(){
			var oJSONModel = new sap.ui.model.json.JSONModel();
			oJSONModel.setData(aOnlyNegativePeriods);
			this.oStockChart = new StockChart({
				time: aTimeRange[0],
				endTime: aTimeRange[1],
				minValue: -100,
				maxValue: 0,
				stockChartDimensions: [
					new StockChartDimension({
						name: "Weight",
						dimensionPathColor: "yellow",
						remainCapacityColorNegative: "red",
						relativePoint: 0,
						stockChartPeriods: {
							path :"/",
							template: new StockChartPeriod({
								from: "{from}",
								to: "{to}",
								value: "{value}"
							}),
							templateSharable: true
						}
					})
				]
			});
			this.oStockChart.setModel(oJSONModel);
		},
		afterEach: function() {
			this.oStockChart.destroy();
			this.oStockChart = null;
		},
		getYActual: function(periodValue) {
			var iHeightPaddingPixel = 8;
			var iHeight = this.oStockChart.getHeight(),
			iY = this.oStockChart.getRowYCenter() - iHeight / 2,
			iRowY = this.oStockChart.getShowCompactView() ? iY + (iHeightPaddingPixel / 2) : iY,
			iRowHeight = this.oStockChart.getShowCompactView() ? iHeight - iHeightPaddingPixel : iHeight;
			var yOrigin = iRowY + iRowHeight;
			var iPercentageHeight = iRowHeight * (this.oStockChart._createTransform(periodValue) / (100));
			var yActual = yOrigin - iPercentageHeight;
			return yActual;
		}
	});

	QUnit.test("Aggregation binding: dimension & periods", function(assert) {
		assert.equal(this.oStockChart.getStockChartDimensions().length, 1, "1 dimension bound to sc");

		var oDimension = this.oStockChart.getStockChartDimensions()[0];
		assert.equal(oDimension.getName(), "Weight", "dimension name set correctly");
		assert.equal(oDimension.getDimensionPathColor(), "yellow", "dimensionPathColor set correctly");
		assert.equal(oDimension.getRelativePoint(), 0, "relativePoint set correctly");
		assert.equal(oDimension.getRemainCapacityColorNegative(), "red", "remainCapacityColorNegative set correctly");
		assert.equal(oDimension.getStockChartPeriods().length, 2, "2 periods belongs to first dimension");
		assert.equal(this.oStockChart.getMinValue(), (-100), "minValue set correctly");
		assert.equal(this.oStockChart.getMaxValue(), 0, "maxValue set correctly");
	});

	QUnit.test("Rendering - with dimensions", function(assert) {
		mockAxisTime(this.oStockChart, aTimeRange);
		placeAt(this.oStockChart);

		var oStockChartDom = window.document.getElementById(this.oStockChart.getId());
		assert.equal(oStockChartDom.classList.value.indexOf("sapGanttStock"), 0, "DOM has correct class name");

		assert.ok(this.oStockChart.getDomRef(), "The element DOM is found");

		var oDimension = this.oStockChart.getStockChartDimensions()[0],
			sClipPathId = oDimension.getId() + "-clipPath";
		// there will be a clipPath generated for this dimension
		assert.ok(window.document.getElementById(sClipPathId) != null, "dimension clippath rendered");

		// each dimension has a path, a rectangle which refer to the over comsumption clip-path and normal clip-Path
		assert.ok(window.document.getElementById(oDimension.getId() + "-scPath"), "The dimension has the actual path DOM");
		assert.ok(window.document.getElementById(oDimension.getId() + "-scRectNegative"), "The dimension has a rectangle clip the remain consuption");

		// middleLine is rendered
		assert.ok(oStockChartDom.querySelector("path.sapGanttStockMiddleLine"), "middle line is rendered");
		assert.ok(this.oStockChart.getDomRef("middleLine"), "there is an element with -middleLine suffix");

		assert.equal(window.document.getElementById(oDimension.getParent().getId()).getElementsByTagName("g")[0].children[0].getAttribute("id"), oDimension.getId() + "-scRectNegative", "Should draw Rect first");
		assert.equal(window.document.getElementById(oDimension.getParent().getId()).getElementsByTagName("g")[1].children[0].getAttribute("id"), oDimension.getId() + "-scPath", "Should draw path after rect");

		// rendered has correct tooltip rectangles, the other 3 has 0 width so will not rendered
		assert.equal(oStockChartDom.querySelectorAll(".sc-tooltips rect").length, 4, "DOM has 4 rectangles to show tooltips");
		if (oStockChartDom.querySelectorAll(".sc-tooltips title")) {
			oStockChartDom.querySelectorAll(".sc-tooltips title").forEach(function(oTitle) {
				if (oTitle && oTitle.innerHTML) {
					if (oTitle.innerHTML.split(":").length > 0 && oTitle.innerHTML.split(":")[1]) {
						assert.equal(oTitle.innerHTML.split(":")[1].indexOf(' '), 0, "Space is present after :");
					}
				}
			});
		}

		// there is a sc background rendered
		assert.equal(window.document.getElementById(oDimension.getId() + "-scRectNegative").getBBox().height, 92, "Element scRect has the correct height");

		//Check negative fill color
		assert.equal(window.document.getElementById(oDimension.getId() + "-scRectNegative").getAttribute("fill"), oDimension.getRemainCapacityColorNegative(), "Rect is rendered correctly with remainingCapacityColorNegative.");

		//Check path of the Created Dimension
		var sSplitPath  = document.getElementById(oDimension.getId() + "-scPath").getAttribute("d").split("L")[0].trim().split(" ")[2];
		var sTotalPaths = document.getElementById(oDimension.getId() + "-scPath").getAttribute("d").split("L").length;
		var sSplitPathEnd = document.getElementById(oDimension.getId() + "-scPath").getAttribute("d").split("L")[sTotalPaths - 1].trim().split(" ")[1];
		var sPathStartValue = this.getYActual(oDimension.getStockChartPeriods()[0].getValue());
		assert.equal(sSplitPath, sPathStartValue, "Element scPath starts from actual value");

		var sPathEndValue = this.getYActual(oDimension.getStockChartPeriods()[oDimension.getStockChartPeriods().length - 1].getValue());
		assert.equal(sSplitPathEnd, sPathEndValue, "Element scPath Ends at actual value");

		//Check path of the Created Dimension ClipPath
		sSplitPath  = document.getElementById(oDimension.getId() + "-clipPath").children[0].getAttribute("d").split("L")[0].trim().split(" ")[2];
		assert.equal(sSplitPath, 4, "Element clipPath is placed correctly");
	});

    var aDimensionWithNegativeThreshold = {"mainDimension" : aNegativePeriods, "thresholdPeriods" : aNegativeThresholds};
    QUnit.module("StockChart with Negative period and negative threshold", {
		beforeEach: function(){
			var oJSONModel = new sap.ui.model.json.JSONModel();
			oJSONModel.setData(aDimensionWithNegativeThreshold);
			this.oStockChart = new StockChart({
				time: aTimeRange[0],
				endTime: aTimeRange[1],
				minValue: -100,
				maxValue: 0,
				stockChartDimensions: [
					new StockChartDimension({
						name: "Weight",
						dimensionPathColor: "yellow",
						remainCapacityColorNegative: "blue",
						relativePoint: 0,
						stockChartPeriods: {
							path :"/mainDimension",
							template: new StockChartPeriod({
								from: "{from}",
								to: "{to}",
								value: "{value}"
							}),
							templateSharable: true
						}
					}),
                    new StockChartDimension({
						name: "Weight limit",
						dimensionPathColor: "red",
						remainCapacityColor: "red",
                        isThreshold: true,
                        relativePoint: -10,
						stockChartPeriods: {
							path :"/thresholdPeriods",
							template: new StockChartPeriod({
								from: "{from}",
								to: "{to}",
								value: "{value}"
							}),
							templateSharable: true
						}
					})
				]
			});
			this.oStockChart.setModel(oJSONModel);
		},
		afterEach: function() {
			this.oStockChart.destroy();
			this.oStockChart = null;
		},
		getYActual: function(periodValue) {
			var iHeightPaddingPixel = 8;
			var iHeight = this.oStockChart.getHeight(),
			iY = this.oStockChart.getRowYCenter() - iHeight / 2,
			iRowY = this.oStockChart.getShowCompactView() ? iY + (iHeightPaddingPixel / 2) : iY,
			iRowHeight = this.oStockChart.getShowCompactView() ? iHeight - iHeightPaddingPixel : iHeight;
			var yOrigin = iRowY + iRowHeight;
			var iPercentageHeight = iRowHeight * (this.oStockChart._createTransform(periodValue) / (100));
			var yActual = yOrigin - iPercentageHeight;
			return yActual;
		}
	});

    QUnit.test("Aggregation binding: dimensions & periods", function(assert) {
		assert.equal(this.oStockChart.getStockChartDimensions().length, 2, "2 dimensions bound to SC");

		var oMainDimension = this.oStockChart.getStockChartDimensions()[0];
        var oThresholdDimension = this.oStockChart.getStockChartDimensions()[1];
		assert.equal(oMainDimension.getName(), "Weight", "dimension name set correctly");
		assert.equal(oMainDimension.getDimensionPathColor(), "yellow", "dimension color set correctly");
		assert.equal(oMainDimension.getRemainCapacityColor(), Parameters.get("sapUiChartNeutral"), "remainCapacityColor set correctly");
		assert.equal(oMainDimension.getRelativePoint(), 0, "relativePoint set correctly");
		assert.equal(oMainDimension.getStockChartPeriods().length, 4, "4 periods belongs to first dimension");
        assert.equal(oThresholdDimension.getIsThreshold(), true, "isThreshold property is et to true for threshold dimension");
        assert.equal(oThresholdDimension.getName(), "Weight limit", "threshold dimension name set correctly");
		assert.equal(oThresholdDimension.getDimensionPathColor(), "red", "threshold dimension color set correctly");
		assert.equal(oThresholdDimension.getRemainCapacityColor(), "red", "threshold remainCapacityColor set correctly");
		assert.equal(oThresholdDimension.getRelativePoint(), -10, "relativePoint set correctly");
		assert.equal(oThresholdDimension.getStockChartPeriods().length, 1, "1 periods belongs to threshold dimension");
        assert.equal(this.oStockChart.getMinValue(), (-100), "minValue set correctly");
		assert.equal(this.oStockChart.getMaxValue(), 0, "maxValue set correctly");
	});

	QUnit.test("Rendering - with dimensions", function(assert) {
		mockAxisTime(this.oStockChart, aTimeRange);
		placeAt(this.oStockChart);

		var oStockChartDom = window.document.getElementById(this.oStockChart.getId());
		assert.equal(oStockChartDom.classList.value.indexOf("sapGanttStock"), 0, "DOM has correct class name");

		assert.ok(this.oStockChart.getDomRef(), "The element DOM is found");

		var oDimension = this.oStockChart.getStockChartDimensions()[0],
			sClipPathId = oDimension.getId() + "-clipPath";

        var thresholdDimension = this.oStockChart.getStockChartDimensions()[1],
            thresholdClipPathId = thresholdDimension.getId() + "-clipPath";
		// there will be a clipPath generated for this dimension
		assert.ok(window.document.getElementById(sClipPathId) != null, "dimension clippath rendered");
        //there will be a clippath generated for threshold dimension
        assert.ok(window.document.getElementById(thresholdClipPathId) != null, "threshold clippath rendered");

		// each dimension has a path, a rectangle which refer to the over comsumption clip-path and normal clip-Path
		assert.ok(window.document.getElementById(oDimension.getId() + "-scPath"), "The main dimension has the actual path DOM");
		assert.ok(window.document.getElementById(oDimension.getId() + "-scRectNegative"), "The main dimension has a rectangle clip the remain consuption");

		assert.equal(window.document.getElementById(oDimension.getParent().getId()).getElementsByTagName("g")[0].children[0].getAttribute("id"), oDimension.getId() + "-scRectNegative", "Should draw Rect first");
		assert.equal(window.document.getElementById(oDimension.getParent().getId()).getElementsByTagName("g")[2].children[0].getAttribute("id"), oDimension.getId() + "-scPath", "Should draw path after rect");

        assert.ok(window.document.getElementById(thresholdDimension.getId() + "-scPath"), "The threshold dimension has the actual path DOM");
		assert.ok(window.document.getElementById(thresholdDimension.getId() + "-scRect"), "The threshold dimension has a rectangle clip the remain consuption");

		// middleLine is rendered
		assert.ok(oStockChartDom.querySelector("path.sapGanttStockMiddleLine"), "middle line is rendered");
		assert.ok(this.oStockChart.getDomRef("middleLine"), "there is an element with -middleLine suffix");

		// rendered has correct tooltip rectangles, the other 3 has 0 width so will not rendered
		assert.equal(oStockChartDom.querySelectorAll(".sc-tooltips rect").length, 6, "DOM has 6 rectangles to show tooltips");
		if (oStockChartDom.querySelectorAll(".sc-tooltips title")) {
			oStockChartDom.querySelectorAll(".sc-tooltips title").forEach(function(oTitle) {
				if (oTitle && oTitle.innerHTML) {
					if (oTitle.innerHTML.split(":").length > 0 && oTitle.innerHTML.split(":")[1]) {
						assert.equal(oTitle.innerHTML.split(":")[1].indexOf(' '), 0, "Space is present after :");
					}
				}
			});
		}

		// there is a sc background rendered
		assert.equal(window.document.getElementById(oDimension.getId() + "-scRectNegative").getBBox().height, 92, "Element has the correct height");

		//Check path of the Created Dimension
		var sSplitPath  = document.getElementById(oDimension.getId() + "-scPath").getAttribute("d").split("L")[0].trim().split(" ")[2];
		var sTotalPaths = document.getElementById(oDimension.getId() + "-scPath").getAttribute("d").split("L").length;
		var sSplitPathEnd = document.getElementById(oDimension.getId() + "-scPath").getAttribute("d").split("L")[sTotalPaths - 1].trim().split(" ")[1];
		var sPathStartValue = this.getYActual(oDimension.getStockChartPeriods()[0].getValue());
		assert.equal(sSplitPath, sPathStartValue, "Element scPath starts from actual value");

		var sPathEndValue = this.getYActual(oDimension.getStockChartPeriods()[oDimension.getStockChartPeriods().length - 1].getValue());
		assert.equal(sSplitPathEnd, sPathEndValue, "Element scPath Ends at actual value");

		//Check path of the Created Dimension ClipPath
		sSplitPath  = document.getElementById(oDimension.getId() + "-clipPath").children[0].getAttribute("d").split("L")[0].trim().split(" ")[2];
		assert.equal(sSplitPath, 4, "Element is placed correctly");
	});

	QUnit.module("StockChart with Negative / Relaative / Min = -100 / Max = 100 Periods", {
		beforeEach: function(){
			var oJSONModel = new sap.ui.model.json.JSONModel();
			oJSONModel.setData(aNegativePeriods);
			this.oStockChart = new StockChart({
				time: aTimeRange[0],
				endTime: aTimeRange[1],
				minValue: -100,
				maxValue: 100,
				stockChartDimensions: [
					new StockChartDimension({
						name: "Weight",
						dimensionPathColor: "yellow",
						remainCapacityColorNegative: "blue",
						relativePoint: 0,
						stockChartPeriods: {
							path :"/",
							template: new StockChartPeriod({
								from: "{from}",
								to: "{to}",
								value: "{value}"
							}),
							templateSharable: true
						}
					})
				]
			});
			this.oStockChart.setModel(oJSONModel);
		},
		afterEach: function() {
			this.oStockChart.destroy();
			this.oStockChart = null;
		},
		getYActual: function(periodValue) {
			var iHeightPaddingPixel = 8;
			var iHeight = this.oStockChart.getHeight(),
			iY = this.oStockChart.getRowYCenter() - iHeight / 2,
			iRowY = this.oStockChart.getShowCompactView() ? iY + (iHeightPaddingPixel / 2) : iY,
			iRowHeight = this.oStockChart.getShowCompactView() ? iHeight - iHeightPaddingPixel : iHeight;
			var yOrigin = iRowY + iRowHeight;
			var iPercentageHeight = iRowHeight * (this.oStockChart._createTransform(periodValue) / (100));
			var yActual = yOrigin - iPercentageHeight;
			return yActual;
		}
	});

	QUnit.test("Aggregation binding: dimension & periods", function(assert) {
		assert.equal(this.oStockChart.getStockChartDimensions().length, 1, "1 dimension bound to sc");

		var oDimension = this.oStockChart.getStockChartDimensions()[0];
		assert.equal(oDimension.getName(), "Weight", "dimension name set correctly");
		assert.equal(oDimension.getDimensionPathColor(), "yellow", "dimensionPathColor set correctly");
		assert.equal(oDimension.getRelativePoint(), 0, "relativePoint set correctly");
		assert.equal(oDimension.getRemainCapacityColorNegative(), "blue", "remainCapacityColorNegative set correctly");
		assert.equal(oDimension.getStockChartPeriods().length, 4, "4 periods belongs to first dimension");
		assert.equal(this.oStockChart.getMinValue(), (-100), "minValue set correctly");
		assert.equal(this.oStockChart.getMaxValue(), 100, "maxValue set correctly");
	});

	QUnit.test("Rendering - with dimensions", function(assert) {
		mockAxisTime(this.oStockChart, aTimeRange);
		placeAt(this.oStockChart);

		var oStockChartDom = window.document.getElementById(this.oStockChart.getId());
		assert.equal(oStockChartDom.classList.value.indexOf("sapGanttStock"), 0, "DOM has correct class name");

		assert.ok(this.oStockChart.getDomRef(), "The element DOM is found");

		var oDimension = this.oStockChart.getStockChartDimensions()[0],
			sClipPathId = oDimension.getId() + "-clipPath";
		// there will be a clipPath generated for this dimension
		assert.ok(window.document.getElementById(sClipPathId) != null, "dimension clippath rendered");

		// each dimension has a path, a rectangle which refer to the over comsumption clip-path and normal clip-Path
		assert.ok(window.document.getElementById(oDimension.getId() + "-scPath"), "The dimension has the actual path DOM");
		assert.ok(window.document.getElementById(oDimension.getId() + "-scRectNegative"), "The dimension has a rectangle clip the remain consuption");

		// middleLine is rendered
		assert.ok(oStockChartDom.querySelector("path.sapGanttStockMiddleLine"), "middle line is rendered");
		assert.ok(this.oStockChart.getDomRef("middleLine"), "there is an element with -middleLine suffix");

		assert.equal(window.document.getElementById(oDimension.getParent().getId()).getElementsByTagName("g")[0].children[0].getAttribute("id"), oDimension.getId() + "-scRectNegative", "Should draw Rect first");
		assert.equal(window.document.getElementById(oDimension.getParent().getId()).getElementsByTagName("g")[1].children[0].getAttribute("id"), oDimension.getId() + "-scPath", "Should draw path after rect");

		// rendered has correct tooltip rectangles, the other 3 has 0 width so will not rendered
		assert.equal(oStockChartDom.querySelectorAll(".sc-tooltips rect").length, 4, "DOM has 4 rectangles to show tooltips");
		if (oStockChartDom.querySelectorAll(".sc-tooltips title")) {
			oStockChartDom.querySelectorAll(".sc-tooltips title").forEach(function(oTitle) {
				if (oTitle && oTitle.innerHTML) {
					if (oTitle.innerHTML.split(":").length > 0 && oTitle.innerHTML.split(":")[1]) {
						assert.equal(oTitle.innerHTML.split(":")[1].indexOf(' '), 0, "Space is present after :");
					}
				}
			});
		}

		// there is a sc background rendered
		assert.equal(window.document.getElementById(oDimension.getId() + "-scRectNegative").getBBox().height, 92, "Element scRectNegative has the correct height");

		//Check path of the Created Dimension
		var sSplitPath  = document.getElementById(oDimension.getId() + "-scPath").getAttribute("d").split("L")[0].trim().split(" ")[2];
		var sTotalPaths = document.getElementById(oDimension.getId() + "-scPath").getAttribute("d").split("L").length;
		var sSplitPathEnd = document.getElementById(oDimension.getId() + "-scPath").getAttribute("d").split("L")[sTotalPaths - 1].trim().split(" ")[1];
		var sPathStartValue = this.getYActual(oDimension.getStockChartPeriods()[0].getValue());
		assert.equal(sSplitPath, sPathStartValue, "Element scPath starts from actual value");

		var sPathEndValue = this.getYActual(oDimension.getStockChartPeriods()[oDimension.getStockChartPeriods().length - 1].getValue());
		assert.equal(sSplitPathEnd, sPathEndValue, "Element scPath Ends at actual value");

		//Check path of the Created Dimension ClipPath
		sSplitPath  = document.getElementById(oDimension.getId() + "-clipPath").children[0].getAttribute("d").split("L")[0].trim().split(" ")[2];
		assert.equal(sSplitPath, 50, "Element clipPath is placed correctly");
	});

    var aPositiveSlantPeriods = [
		{
			from: "20180101000000",
			to: "20180101000000",
			value: 0
		},
		{
			from: "20180201000000",
			to: "20180301000000",
			value: 100
		},
		{
			from: "20180307000000",
			to: "20180317000000",
			value: 80
		},
		{
			from: "20180327000000",
			to: "20180331000000",
			value: 0
		}
	].map(function(oItem){
		oItem.from = Format.abapTimestampToDate(oItem.from);
		oItem.to = Format.abapTimestampToDate(oItem.to);
		return oItem;
	});

    var aPositiveThresholdsStraight = [
        {
			from: "20180101000000",
			to: "20180331000000",
			value: 40
		}
    ].map(function(oItem){
		oItem.from = Format.abapTimestampToDate(oItem.from);
		oItem.to = Format.abapTimestampToDate(oItem.to);
		return oItem;
	});

    var aPositiveThresholdSlant = [
        {
			from: "20180101000000",
			to: "20180101000000",
			value: 0
		},
		{
			from: "20180251000000",
			to: "20180300000000",
			value: 60
		},
		{
			from: "20180309000000",
			to: "20180315000000",
			value: 40
		},
		{
			from: "20180328000000",
			to: "20180331000000",
			value: 0
		}
    ].map(function(oItem){
		oItem.from = Format.abapTimestampToDate(oItem.from);
		oItem.to = Format.abapTimestampToDate(oItem.to);
		return oItem;
	});

    var aSlantDimensionWithPositiveThreshold = {"mainDimension" : aPositiveSlantPeriods, "thresholdPeriods" : aPositiveThresholdsStraight};

    QUnit.module("StockChart with slant period and straight threshold", {
		beforeEach: function(){
			var oJSONModel = new sap.ui.model.json.JSONModel();
			oJSONModel.setData(aSlantDimensionWithPositiveThreshold);
			this.oStockChart = new StockChart({
				time: aTimeRange[0],
				endTime: aTimeRange[1],
				minValue: -100,
				maxValue: 0,
				stockChartDimensions: [
					new StockChartDimension({
						name: "Weight",
						dimensionPathColor: "yellow",
						remainCapacityColorNegative: "blue",
						relativePoint: 0,
						stockChartPeriods: {
							path :"/mainDimension",
							template: new StockChartPeriod({
								from: "{from}",
								to: "{to}",
								value: "{value}"
							}),
							templateSharable: true
						}
					}),
                    new StockChartDimension({
						name: "Weight limit",
						dimensionPathColor: "red",
						remainCapacityColor: "red",
                        isThreshold: true,
                        relativePoint: 10,
						stockChartPeriods: {
							path :"/thresholdPeriods",
							template: new StockChartPeriod({
								from: "{from}",
								to: "{to}",
								value: "{value}"
							}),
							templateSharable: true
						}
					})
				]
			});
			this.oStockChart.setModel(oJSONModel);
		},
		afterEach: function() {
			this.oStockChart.destroy();
			this.oStockChart = null;
		}
	});

    QUnit.test("Aggregation binding: dimensions & periods", function(assert) {
		assert.equal(this.oStockChart.getStockChartDimensions().length, 2, "2 dimensions bound to SC");

		var oMainDimension = this.oStockChart.getStockChartDimensions()[0];
        var oThresholdDimension = this.oStockChart.getStockChartDimensions()[1];
		assert.equal(oMainDimension.getName(), "Weight", "dimension name set correctly");
		assert.equal(oMainDimension.getDimensionPathColor(), "yellow", "dimension color set correctly");
		assert.equal(oMainDimension.getRemainCapacityColor(), Parameters.get("sapUiChartNeutral"), "remainCapacityColor set correctly");
		assert.equal(oMainDimension.getRelativePoint(), 0, "relativePoint set correctly");
		assert.equal(oMainDimension.getStockChartPeriods().length, 4, "4 periods belongs to first dimension");
        assert.equal(oThresholdDimension.getIsThreshold(), true, "isThreshold property is et to true for threshold dimension");
        assert.equal(oThresholdDimension.getName(), "Weight limit", "threshold dimension name set correctly");
		assert.equal(oThresholdDimension.getDimensionPathColor(), "red", "threshold dimension color set correctly");
		assert.equal(oThresholdDimension.getRemainCapacityColor(), "red", "threshold remainCapacityColor set correctly");
		assert.equal(oThresholdDimension.getRelativePoint(), 10, "relativePoint set correctly");
		assert.equal(oThresholdDimension.getStockChartPeriods().length, 1, "1 periods belongs to threshold dimension");
        assert.equal(this.oStockChart.getMinValue(), (-100), "minValue set correctly");
		assert.equal(this.oStockChart.getMaxValue(), 0, "maxValue set correctly");
	});

	QUnit.test("Rendering - with dimensions", function(assert) {
		mockAxisTime(this.oStockChart, aTimeRange);
		placeAt(this.oStockChart);

		var oStockChartDom = window.document.getElementById(this.oStockChart.getId());
		assert.equal(oStockChartDom.classList.value.indexOf("sapGanttStock"), 0, "DOM has correct class name");

		assert.ok(this.oStockChart.getDomRef(), "The element DOM is found");

		var oDimension = this.oStockChart.getStockChartDimensions()[0],
			sClipPathId = oDimension.getId() + "-clipPath";

        var thresholdDimension = this.oStockChart.getStockChartDimensions()[1],
            thresholdClipPathId = thresholdDimension.getId() + "-clipPath";
		// there will be a clipPath generated for this dimension
		assert.ok(window.document.getElementById(sClipPathId) != null, "dimension clippath rendered");
        //there will be a clippath generated for threshold dimension
        assert.ok(window.document.getElementById(thresholdClipPathId) != null, "threshold clippath rendered");

		// each dimension has a path, a rectangle which refer to the over comsumption clip-path and normal clip-Path
		assert.ok(window.document.getElementById(oDimension.getId() + "-scPath"), "The main dimension has the actual path DOM");
		assert.ok(window.document.getElementById(oDimension.getId() + "-scRect"), "The main dimension has a rectangle clip the remain consuption");

        assert.ok(window.document.getElementById(thresholdDimension.getId() + "-scPath"), "The threshold dimension has the actual path DOM");
		assert.ok(window.document.getElementById(thresholdDimension.getId() + "-scRect"), "The threshold dimension has a rectangle clip the remain consuption");

		// middleLine is rendered
		assert.ok(oStockChartDom.querySelector("path.sapGanttStockMiddleLine"), "middle line is rendered");
		assert.ok(this.oStockChart.getDomRef("middleLine"), "there is an element with -middleLine suffix");

		assert.equal(window.document.getElementById(oDimension.getParent().getId()).getElementsByTagName("g")[0].children[0].getAttribute("id"), oDimension.getId() + "-scRect", "Should draw Rect first");
		assert.equal(window.document.getElementById(oDimension.getParent().getId()).getElementsByTagName("g")[2].children[0].getAttribute("id"), oDimension.getId() + "-scPath", "Should draw path after rect");

		// rendered has correct tooltip rectangles, the other 3 has 0 width so will not rendered
		assert.equal(oStockChartDom.querySelectorAll(".sc-tooltips rect").length, 9, "DOM has 9 rectangles to show tooltips");
		if (oStockChartDom.querySelectorAll(".sc-tooltips title")) {
			oStockChartDom.querySelectorAll(".sc-tooltips title").forEach(function(oTitle) {
				if (oTitle && oTitle.innerHTML) {
					if (oTitle.innerHTML.split(":").length > 0 && oTitle.innerHTML.split(":")[1]) {
						assert.equal(oTitle.innerHTML.split(":")[1].indexOf(' '), 0, "Space is present after :");
					}
				}
			});
		}

		// there is a sc background rendered
		assert.equal(window.document.getElementById(oDimension.getId() + "-scRect").getBBox().height, 92, "Element has the correct height");

		//Check path of the Created Dimension
		var sSplitPath  = document.getElementById(oDimension.getId() + "-scPath").getAttribute("d").split("L")[0].trim().split(" ")[2];
		assert.equal(sSplitPath, 4, "Element is placed correctly");

		//Check path of the Created Dimension ClipPath
		sSplitPath  = document.getElementById(oDimension.getId() + "-clipPath").children[0].getAttribute("d").split("L")[0].trim().split(" ")[2];
		assert.equal(sSplitPath, 4, "Element is placed correctly");
	});

    var aPositiveDimensionWithSlantedThreshold = {"mainDimension" : aPositiveSlantPeriods, "thresholdPeriods" : aPositiveThresholdSlant};

    QUnit.module("StockChart with slant period and slanted threshold", {
		beforeEach: function(){
			var oJSONModel = new sap.ui.model.json.JSONModel();
			oJSONModel.setData(aPositiveDimensionWithSlantedThreshold);
			this.oStockChart = new StockChart({
				time: aTimeRange[0],
				endTime: aTimeRange[1],
				minValue: -100,
				maxValue: 0,
				stockChartDimensions: [
					new StockChartDimension({
						name: "Weight",
						dimensionPathColor: "yellow",
						remainCapacityColorNegative: "blue",
						relativePoint: 0,
						stockChartPeriods: {
							path :"/mainDimension",
							template: new StockChartPeriod({
								from: "{from}",
								to: "{to}",
								value: "{value}"
							}),
							templateSharable: true
						}
					}),
                    new StockChartDimension({
						name: "Weight limit",
						dimensionPathColor: "red",
						remainCapacityColor: "red",
                        isThreshold: true,
                        relativePoint: 10,
						stockChartPeriods: {
							path :"/thresholdPeriods",
							template: new StockChartPeriod({
								from: "{from}",
								to: "{to}",
								value: "{value}"
							}),
							templateSharable: true
						}
					})
				]
			});
			this.oStockChart.setModel(oJSONModel);
		},
		afterEach: function() {
			this.oStockChart.destroy();
			this.oStockChart = null;
		}
	});

    QUnit.test("Aggregation binding: dimensions & periods", function(assert) {
		assert.equal(this.oStockChart.getStockChartDimensions().length, 2, "2 dimensions bound to SC");

		var oMainDimension = this.oStockChart.getStockChartDimensions()[0];
        var oThresholdDimension = this.oStockChart.getStockChartDimensions()[1];
		assert.equal(oMainDimension.getName(), "Weight", "dimension name set correctly");
		assert.equal(oMainDimension.getDimensionPathColor(), "yellow", "dimension color set correctly");
		assert.equal(oMainDimension.getRemainCapacityColor(), Parameters.get("sapUiChartNeutral"), "remainCapacityColor set correctly");
		assert.equal(oMainDimension.getRelativePoint(), 0, "relativePoint set correctly");
		assert.equal(oMainDimension.getStockChartPeriods().length, 4, "4 periods belongs to first dimension");
        assert.equal(oThresholdDimension.getIsThreshold(), true, "isThreshold property is et to true for threshold dimension");
        assert.equal(oThresholdDimension.getName(), "Weight limit", "threshold dimension name set correctly");
		assert.equal(oThresholdDimension.getDimensionPathColor(), "red", "threshold dimension color set correctly");
		assert.equal(oThresholdDimension.getRemainCapacityColor(), "red", "threshold remainCapacityColor set correctly");
		assert.equal(oThresholdDimension.getRelativePoint(), 10, "relativePoint set correctly");
		assert.equal(oThresholdDimension.getStockChartPeriods().length, 4, "4 periods belongs to threshold dimension");
        assert.equal(this.oStockChart.getMinValue(), (-100), "minValue set correctly");
		assert.equal(this.oStockChart.getMaxValue(), 0, "maxValue set correctly");
	});

	QUnit.test("Rendering - with dimensions", function(assert) {
		mockAxisTime(this.oStockChart, aTimeRange);
		placeAt(this.oStockChart);

		var oStockChartDom = window.document.getElementById(this.oStockChart.getId());
		assert.equal(oStockChartDom.classList.value.indexOf("sapGanttStock"), 0, "DOM has correct class name");

		assert.ok(this.oStockChart.getDomRef(), "The element DOM is found");

		var oDimension = this.oStockChart.getStockChartDimensions()[0],
			sClipPathId = oDimension.getId() + "-clipPath";

        var thresholdDimension = this.oStockChart.getStockChartDimensions()[1],
            thresholdClipPathId = thresholdDimension.getId() + "-clipPath";
		// there will be a clipPath generated for this dimension
		assert.ok(window.document.getElementById(sClipPathId) != null, "dimension clippath rendered");
        //there will be a clippath generated for threshold dimension
        assert.ok(window.document.getElementById(thresholdClipPathId) != null, "threshold clippath rendered");

		// each dimension has a path, a rectangle which refer to the over comsumption clip-path and normal clip-Path
		assert.ok(window.document.getElementById(oDimension.getId() + "-scPath"), "The main dimension has the actual path DOM");
		assert.ok(window.document.getElementById(oDimension.getId() + "-scRect"), "The main dimension has a rectangle clip the remain consuption");

        assert.ok(window.document.getElementById(thresholdDimension.getId() + "-scPath"), "The threshold dimension has the actual path DOM");
		assert.ok(window.document.getElementById(thresholdDimension.getId() + "-scRect"), "The threshold dimension has a rectangle clip the remain consuption");

		// middleLine is rendered
		assert.ok(oStockChartDom.querySelector("path.sapGanttStockMiddleLine"), "middle line is rendered");
		assert.ok(this.oStockChart.getDomRef("middleLine"), "there is an element with -middleLine suffix");

		assert.equal(window.document.getElementById(oDimension.getParent().getId()).getElementsByTagName("g")[0].children[0].getAttribute("id"), oDimension.getId() + "-scRect", "Should draw Rect first");
		assert.equal(window.document.getElementById(oDimension.getParent().getId()).getElementsByTagName("g")[2].children[0].getAttribute("id"), oDimension.getId() + "-scPath", "Should draw path after rect");

		// rendered has correct tooltip rectangles, the other 3 has 0 width so will not rendered
		assert.equal(oStockChartDom.querySelectorAll(".sc-tooltips rect").length, 14, "DOM has 14 rectangles to show tooltips");
		if (oStockChartDom.querySelectorAll(".sc-tooltips title")) {
			oStockChartDom.querySelectorAll(".sc-tooltips title").forEach(function(oTitle) {
				if (oTitle && oTitle.innerHTML) {
					if (oTitle.innerHTML.split(":").length > 0 && oTitle.innerHTML.split(":")[1]) {
						assert.equal(oTitle.innerHTML.split(":")[1].indexOf(' '), 0, "Space is present after :");
					}
				}
			});
		}

		// there is a sc background rendered
		assert.equal(window.document.getElementById(oDimension.getId() + "-scRect").getBBox().height, 92, "Element has the correct height");

		//Check path of the Created Dimension
		var sSplitPath  = document.getElementById(oDimension.getId() + "-scPath").getAttribute("d").split("L")[0].trim().split(" ")[2];
		assert.equal(sSplitPath, 4, "Element is placed correctly");

		//Check path of the Created Dimension ClipPath
		sSplitPath  = document.getElementById(oDimension.getId() + "-clipPath").children[0].getAttribute("d").split("L")[0].trim().split(" ")[2];
		assert.equal(sSplitPath, 4, "Element is placed correctly");
	});

	var aPositiveDimensionWithNoThreshold = {"mainDimension" : aPositiveSlantPeriods, "thresholdPeriods" : []};

    QUnit.module("StockChart with slant period and no Threshold period", {
		beforeEach: function(){
			var oJSONModel = new sap.ui.model.json.JSONModel();
			oJSONModel.setData(aPositiveDimensionWithNoThreshold);
			this.oStockChart = new StockChart({
				time: aTimeRange[0],
				endTime: aTimeRange[1],
				minValue: -100,
				maxValue: 0,
				stockChartDimensions: [
					new StockChartDimension({
						name: "Weight",
						dimensionPathColor: "yellow",
						remainCapacityColorNegative: "blue",
						relativePoint: 0,
						stockChartPeriods: {
							path :"/mainDimension",
							template: new StockChartPeriod({
								from: "{from}",
								to: "{to}",
								value: "{value}"
							}),
							templateSharable: true
						}
					}),
                    new StockChartDimension({
						name: "Weight limit",
						dimensionPathColor: "red",
						remainCapacityColor: "red",
                        isThreshold: true,
                        relativePoint: 10,
						stockChartPeriods: {
							path :"/thresholdPeriods",
							template: new StockChartPeriod({
								from: "{from}",
								to: "{to}",
								value: "{value}"
							}),
							templateSharable: true
						}
					})
				]
			});
			this.oStockChart.setModel(oJSONModel);
		},
		afterEach: function() {
			this.oStockChart.destroy();
			this.oStockChart = null;
		}
	});

    QUnit.test("Aggregation binding: dimensions & periods", function(assert) {
		assert.equal(this.oStockChart.getStockChartDimensions().length, 2, "2 dimensions bound to SC");

		var oMainDimension = this.oStockChart.getStockChartDimensions()[0];
        var oThresholdDimension = this.oStockChart.getStockChartDimensions()[1];
		assert.equal(oMainDimension.getName(), "Weight", "dimension name set correctly");
		assert.equal(oMainDimension.getDimensionPathColor(), "yellow", "dimension color set correctly");
		assert.equal(oMainDimension.getRemainCapacityColor(), Parameters.get("sapUiChartNeutral"), "remainCapacityColor set correctly");
		assert.equal(oMainDimension.getRelativePoint(), 0, "relativePoint set correctly");
		assert.equal(oMainDimension.getStockChartPeriods().length, 4, "4 periods belongs to first dimension");
        assert.equal(oThresholdDimension.getIsThreshold(), true, "isThreshold property is et to true for threshold dimension");
        assert.equal(oThresholdDimension.getName(), "Weight limit", "threshold dimension name set correctly");
		assert.equal(oThresholdDimension.getDimensionPathColor(), "red", "threshold dimension color set correctly");
		assert.equal(oThresholdDimension.getRemainCapacityColor(), "red", "threshold remainCapacityColor set correctly");
		assert.equal(oThresholdDimension.getRelativePoint(), 10, "relativePoint set correctly");
		assert.equal(oThresholdDimension.getStockChartPeriods().length, 0, "0 periods belongs to threshold dimension");
        assert.equal(this.oStockChart.getMinValue(), (-100), "minValue set correctly");
		assert.equal(this.oStockChart.getMaxValue(), 0, "maxValue set correctly");
	});

	QUnit.test("Rendering - with dimensions", function(assert) {
		mockAxisTime(this.oStockChart, aTimeRange);
		placeAt(this.oStockChart);

		var oStockChartDom = window.document.getElementById(this.oStockChart.getId());
		assert.equal(oStockChartDom.classList.value.indexOf("sapGanttStock"), 0, "DOM has correct class name");

		assert.ok(this.oStockChart.getDomRef(), "The element DOM is found");

		var oDimension = this.oStockChart.getStockChartDimensions()[0],
			sClipPathId = oDimension.getId() + "-clipPath";

        var thresholdDimension = this.oStockChart.getStockChartDimensions()[1],
            thresholdClipPathId = thresholdDimension.getId() + "-clipPath";
		// there will be a clipPath generated for this dimension
		assert.ok(window.document.getElementById(sClipPathId) != null, "dimension clippath rendered");
        //there will be a clippath generated for threshold dimension
        assert.ok(window.document.getElementById(thresholdClipPathId) != null, "threshold clippath rendered");

		// each dimension has a path, a rectangle which refer to the over comsumption clip-path and normal clip-Path
		assert.ok(window.document.getElementById(oDimension.getId() + "-scPath"), "The main dimension has the actual path DOM");
		assert.ok(window.document.getElementById(oDimension.getId() + "-scRect"), "The main dimension has a rectangle clip the remain consuption");

        assert.ok(window.document.getElementById(thresholdDimension.getId() + "-scPath"), "The threshold dimension has the actual path DOM");
		assert.ok(window.document.getElementById(thresholdDimension.getId() + "-scRect"), "The threshold dimension has a rectangle clip the remain consuption");

		// middleLine is rendered
		assert.ok(oStockChartDom.querySelector("path.sapGanttStockMiddleLine"), "middle line is rendered");
		assert.ok(this.oStockChart.getDomRef("middleLine"), "there is an element with -middleLine suffix");

		assert.equal(window.document.getElementById(oDimension.getParent().getId()).getElementsByTagName("g")[0].children[0].getAttribute("id"), oDimension.getId() + "-scRect", "Should draw Rect first");
		assert.equal(window.document.getElementById(oDimension.getParent().getId()).getElementsByTagName("g")[2].children[0].getAttribute("id"), oDimension.getId() + "-scPath", "Should draw path after rect");

		// rendered has correct tooltip rectangles, the other 3 has 0 width so will not rendered
		assert.equal(oStockChartDom.querySelectorAll(".sc-tooltips rect").length, 7, "DOM has 7 rectangles to show tooltips");
		if (oStockChartDom.querySelectorAll(".sc-tooltips title")) {
			oStockChartDom.querySelectorAll(".sc-tooltips title").forEach(function(oTitle) {
				if (oTitle && oTitle.innerHTML) {
					if (oTitle.innerHTML.split(":").length > 0 && oTitle.innerHTML.split(":")[1]) {
						assert.equal(oTitle.innerHTML.split(":")[1].indexOf(' '), 0, "Space is present after :");
					}
				}
			});
		}

		// there is a sc background rendered
		assert.equal(window.document.getElementById(oDimension.getId() + "-scRect").getBBox().height, 92, "Element has the correct height");

		//Check path of the Created Dimension
		var sSplitPath  = document.getElementById(oDimension.getId() + "-scPath").getAttribute("d").split("L")[0].trim().split(" ")[2];
		assert.equal(sSplitPath, 4, "Element is placed correctly");

		//Check path of the Created Dimension ClipPath
		sSplitPath  = document.getElementById(oDimension.getId() + "-clipPath").children[0].getAttribute("d").split("L")[0].trim().split(" ")[2];
		assert.equal(sSplitPath, 4, "Element is placed correctly");

		var fnError = sinon.spy(Log, "error");
		var aErrors = [];
		assert.equal(aErrors.length, 0, "Error was not logged so far");
		fnError.restore();
	});

	QUnit.module("GanttChart Validate CalendarDef", {
		afterEach: function () {
			this.gantt.destroy();
		},
		getYActual: function(periodValue) {
			var iHeightPaddingPixel = 8;
			var stockChart = this.gantt.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0];
			var iHeight = stockChart.getHeight(),
			iY = stockChart.getRowYCenter() - iHeight / 2,
			iRowY = stockChart.getShowCompactView() ? iY + (iHeightPaddingPixel / 2) : iY,
			iRowHeight = stockChart.getShowCompactView() ? iHeight - iHeightPaddingPixel : iHeight;
			var yOrigin = iRowY + iRowHeight;
			var iPercentageHeight = iRowHeight * (stockChart._createTransform(periodValue) / (100));
			var yActual = yOrigin - iPercentageHeight;
			return yActual;
		}

	});

	QUnit.test("Check for CalendarDefs in key attribute", function (assert) {
		var oData = {
			root: {
				rows: [aPositiveDimensionWithThreshold]
			}
		};
		var oJSONModel = new sap.ui.model.json.JSONModel();
		oJSONModel.setData(oData);
		this.gantt = new GanttChartWithTable({
			table: new TreeTable({
				id: "table",
				rows: {
					path: "/root",
					parameters: {arrayNames: ["rows"]}
				},
				rowSettingsTemplate: new GanttRowSettings({
						shapes1: [
							new StockChart({
								time: aTimeRange[0],
								endTime: aTimeRange[1],
								stockChartDimensions: [
									new StockChartDimension({
										name: "Weight",
										dimensionPathColor: "yellow",
										remainCapacityColor: "pink",
										stockChartPeriods: {
											path :"mainDimension",
											relativePoint: 20,
											template: new StockChartPeriod({
												from: "{from}",
												to: "{to}",
												value: "{value}"
											}),
											templateSharable: true
										}
									}),
									new StockChartDimension({
										name: "Weight limit",
										dimensionPathColor: "red",
										remainCapacityColor: "red",
										isThreshold: true,
										relativePoint:10,
										stockChartPeriods: {
											path :"thresholdPeriods",
											template: new StockChartPeriod({
												from: "{from}",
												to: "{to}",
												value: "{value}"
											}),
											templateSharable: true
										}
									})
								]
							})
						]
				})
			}),
			axisTimeStrategy: new ProportionZoomStrategy({
				totalHorizon: new TimeHorizon({
					startTime:"20180101000000",
					endTime: "20180331235959"
				}),
				visibleHorizon: new TimeHorizon({
					startTime:"20180101000000",
					endTime: "20180331235959"
				})
			})
		});
		this.gantt.setModel(oJSONModel);
		this.gantt.placeAt("qunit-fixture");
		var done = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
			setTimeout(function () {

				var oStockChart = this.gantt.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0];
				var oStockChartDom = window.document.getElementsByClassName("sapGanttStock")[0];

				assert.equal(oStockChartDom.classList.value.indexOf("sapGanttStock"), 0, "DOM has correct class name");

				assert.ok(this.gantt.fnStockChartMouseMoveListener, "fnStockChartMouseMoveListener Handler created");

				assert.ok(oStockChartDom.querySelector(".stockChartTooltip"), "stockChartTooltip Rectangle is created");

				assert.ok(oStockChart.getDomRef(), "The element DOM is found");

				var oDimension = oStockChart.getStockChartDimensions()[0],
					sClipPathId = oDimension.getId() + "-clipPath";

				var thresholdDimension = oStockChart.getStockChartDimensions()[1],
					thresholdClipPathId = thresholdDimension.getId() + "-clipPath";
				// there will be a clipPath generated for this dimension
				assert.ok(window.document.getElementById(sClipPathId) != null, "dimension clippath rendered");
				//there will be a clippath generated for threshold dimension
				assert.ok(window.document.getElementById(thresholdClipPathId) != null, "threshold clippath rendered");

				// each dimension has a path, a rectangle which refer to the over comsumption clip-path and normal clip-Path
				assert.ok(window.document.getElementById(oDimension.getId() + "-scPath"), "The main dimension has the actual path DOM");
				assert.ok(window.document.getElementById(oDimension.getId() + "-scRect"), "The main dimension has a rectangle clip the remain consuption");

				assert.ok(window.document.getElementById(thresholdDimension.getId() + "-scPath"), "The threshold dimension has the actual path DOM");
				assert.ok(window.document.getElementById(thresholdDimension.getId() + "-scRect"), "The threshold dimension has a rectangle clip the remain consuption");

				// middleLine is rendered
				assert.ok(oStockChartDom.querySelector("path.sapGanttStockMiddleLine"), "middle line is rendered");
				assert.ok(oStockChart.getDomRef("middleLine"), "there is an element with -middleLine suffix");

				assert.equal(window.document.getElementById(oDimension.getParent().getId()).getElementsByTagName("g")[0].children[0].getAttribute("id"), oDimension.getId() + "-scRect", "Should draw Rect first");
				assert.equal(window.document.getElementById(oDimension.getParent().getId()).getElementsByTagName("g")[2].children[0].getAttribute("id"), oDimension.getId() + "-scPath", "Should draw path after rect");

				// rendered has correct tooltip rectangles, the other 3 has 0 width so will not rendered
				assert.equal(oStockChartDom.querySelectorAll(".sc-tooltips rect").length, 9, "DOM has 9 rectangles to show tooltips");
				if (oStockChartDom.querySelectorAll(".sc-tooltips title")) {
					oStockChartDom.querySelectorAll(".sc-tooltips title").forEach(function(oTitle) {
						if (oTitle && oTitle.innerHTML) {
							if (oTitle.innerHTML.split(":").length > 0 && oTitle.innerHTML.split(":")[1]) {
								assert.equal(oTitle.innerHTML.split(":")[1].indexOf(' '), 0, "Space is present after :");
							}
						}
					});
				}

				// there is a sc background rendered
				assert.equal(window.document.getElementById(oDimension.getId() + "-scRect").getBBox().height, 25, "Element has the correct height");

				//Check path of the Created Dimension
				var sSplitPath  = document.getElementById(oDimension.getId() + "-scPath").getAttribute("d").split("L")[0].trim().split(" ")[2];
				var sPathStartValue = this.getYActual(oDimension.getStockChartPeriods()[0].getValue());
				assert.equal(sSplitPath, sPathStartValue, "Element is placed correctly");

				//Check path of the Created Dimension ClipPath
				sSplitPath  = document.getElementById(oDimension.getId() + "-clipPath").children[0].getAttribute("d").split("L")[0].trim().split(" ")[2];
				assert.equal(sSplitPath, sPathStartValue, "Element is placed correctly");

				done();
			}.bind(this), 500); // need to wait because Table updates its rows async (50ms)
		}.bind(this));
	});



	var aPositiveDimensionPeriodsFiltered = [
		{
			from: "20180101000000",
			to: "20180201000000",
			value: 0
		},
		{
			from: "20180201000000",
			to: "20180301000000",
			value: 100
		},
		{
			from: "20180301000000",
			to: "20180331000000",
			value: 0
		}
	].map(function(oItem){
		oItem.from = Format.abapTimestampToDate(oItem.from);
		oItem.to = Format.abapTimestampToDate(oItem.to);
		return oItem;
	});

    var aPositiveThresholdPeriodsFiltered = [
		{
			from: "20180101000000",
			to: "20180201000000",
			value: 0
		},
		{
			from: "20180201000000",
			to: "20180301000000",
			value: 100
		},
		{
			from: "20180301000000",
			to: "20180331000000",
			value: 50
		}
	].map(function(oItem){
		oItem.from = Format.abapTimestampToDate(oItem.from);
		oItem.to = Format.abapTimestampToDate(oItem.to);
		return oItem;
	});

    var aPositiveDimensionWithThresholdFiltered = {"mainDimension" : aPositiveDimensionPeriodsFiltered, "thresholdPeriods" : aPositiveThresholdPeriodsFiltered};

    QUnit.module("StockChart with Filtered Threshold Period", {
		beforeEach: function(){
			var oJSONModel = new sap.ui.model.json.JSONModel();
			oJSONModel.setData(aPositiveDimensionWithThresholdFiltered);
			this.oStockChart = new StockChart({
				time: aTimeRange[0],
				endTime: aTimeRange[1],
				stockChartDimensions: [
					new StockChartDimension({
						name: "Weight",
						dimensionPathColor: "yellow",
						remainCapacityColor: "pink",
						stockChartPeriods: {
							path :"/mainDimension",
							template: new StockChartPeriod({
								from: "{from}",
								to: "{to}",
								value: "{value}"
							}),
							templateSharable: true
						}
					}),
                    new StockChartDimension({
						name: "Weight limit",
						dimensionPathColor: "red",
						remainCapacityColor: "red",
                        isThreshold: true,
                        relativePoint: 10,
						stockChartPeriods: {
							path :"/thresholdPeriods",
							template: new StockChartPeriod({
								from: "{from}",
								to: "{to}",
								value: "{value}"
							}),
							templateSharable: true
						}
					})

				]
			});
			this.oStockChart.setModel(oJSONModel);
		},
		afterEach: function() {
			this.oStockChart.destroy();
			this.oStockChart = null;
		}
	});


	QUnit.test("Filtered Threshold to have thresholds inside dimension period", function(assert) {
		mockAxisTime(this.oStockChart, aTimeRange);
		placeAt(this.oStockChart);
		var oMainDimension = this.oStockChart.getStockChartDimensions()[0];
        var oThresholdDimension = this.oStockChart.getStockChartDimensions()[1];
		var oDimensionPeriods = oMainDimension.getStockChartPeriods();
		var oThresholdPeriods = oThresholdDimension.getStockChartPeriods();
		assert.equal(oMainDimension.getRelativePoint(), 0, "relativePoint set correctly");
		assert.equal(oMainDimension.getStockChartPeriods().length, 3, "3 periods belongs to  dimension");
		assert.equal(oThresholdDimension.getRelativePoint(), 10, "relativePoint set correctly");
		assert.equal(oThresholdDimension.getStockChartPeriods().length, 3, "3 periods belongs to  threshold");

        var thresholdClipPathId = oThresholdDimension.getId() + "-clipPath",
					sClipPathId = oMainDimension.getId() + "-clipPath";
		// there will be a clipPath generated for this dimension
		assert.ok(window.document.getElementById(sClipPathId) != null, "dimension clippath rendered");
        //there will be a clippath generated for threshold dimension
        assert.ok(window.document.getElementById(thresholdClipPathId) != null, "threshold clippath rendered");

		// each dimension has a path, a rectangle which refer to the over comsumption clip-path and normal clip-Path
		assert.ok(window.document.getElementById(oMainDimension.getId() + "-scPath"), "The main dimension has the actual path DOM");
		assert.ok(window.document.getElementById(oMainDimension.getId() + "-scRect"), "The main dimension has a rectangle clip the remain consuption");

        assert.ok(window.document.getElementById(oThresholdDimension.getId() + "-scPath"), "The threshold dimension has the actual path DOM");
		assert.ok(window.document.getElementById(oThresholdDimension.getId() + "-scRect"), "The threshold dimension has a rectangle clip the remain consuption");

		assert.equal(this.oStockChart._getFilterThresholdPeriods(oThresholdPeriods,oDimensionPeriods,1).length ,1,"filtered threshold value set properly");
	});

});
