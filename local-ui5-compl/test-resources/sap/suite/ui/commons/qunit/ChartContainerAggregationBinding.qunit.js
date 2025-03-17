sap.ui.define([
	"sap/suite/ui/commons/ChartContainerContent",
	"sap/viz/ui5/controls/VizFrame",
	"sap/ui/model/json/JSONModel",
	"sap/suite/ui/commons/ChartContainer",
	"sap/ui/qunit/utils/nextUIUpdate"
], function(ChartContainerContent, VizFrame, JSONModel, ChartContainer, nextUIUpdate) {
	"use strict";

	QUnit.module("Aggregation binding with factory function", {
		beforeEach : async function() {
			var aChartKeys,
				oModel,
				oFirstVizFrameContent,
				oSecondVizFrameContent;

			oFirstVizFrameContent = new ChartContainerContent("firstChartContainerContent",{
				content : new VizFrame("firstVizFrame")
			});
			oSecondVizFrameContent = new ChartContainerContent("secondChartContainerContent",{
				content : new VizFrame("secondVizFrame")
			});
			this.oChartContainer = new ChartContainer("chartContainer");

			aChartKeys = [
				{
					key : "first"
				},
				{
					key : "second"
				}
			];
			oModel = new JSONModel({
				"chartKeys" : aChartKeys
			});

			this.oChartContainer.setModel(oModel);

			this.oChartContainer.bindAggregation("content", "/chartKeys", function(sId, oContext) {
				var sKey = oContext.getProperty("key");
				if (sKey === "first") {
					return oFirstVizFrameContent;
				} else if (sKey === "second") {
					return oSecondVizFrameContent;
				}
			});

			this.oChartContainer.placeAt("qunit-fixture");
			await nextUIUpdate();
		},
		afterEach : function() {
			this.oChartContainer.destroy();
			this.oChartContainer = null;
		}
	});

	QUnit.test("The content aggregation is bound correctly", function(assert) {
		// Arrrange
		// Act
		// Assert
		assert.equal(this.oChartContainer.getContent().length, 2, "There are two contents in the aggregation");
	});

	QUnit.test("Call of public API function addContent", function(assert) {
		// Arrrange
		var oThirdVizFrameContent;
		oThirdVizFrameContent = new ChartContainerContent("thirdChartContainerContent",{
			content : new VizFrame("thirdVizFrame")
		});
		// Act
		this.oChartContainer.addContent(oThirdVizFrameContent);
		// Assert
		assert.equal(this.oChartContainer.getContent().length, 3, "The content aggregation is updated and there are three contents in the aggregation");
	});

	QUnit.test("Call of public API function removeAllAggregation with the aggregation content", function(assert) {
		// Arrrange
		// Act
		this.oChartContainer.removeAllAggregation("content", true);
		// Assert
		assert.equal(this.oChartContainer.getContent().length, 0, "The content aggregation is updated and there are no contents in the aggregation");
	});

	QUnit.module("Toolbar aggregation's property", {
		beforeEach : async function() {
			this.oVizFrameContent = new ChartContainerContent("chartContainerContentToolbar",{
				content : new VizFrame("vizFrameContent")
			});
			this.oChartContainer = new ChartContainer("chartContainerToolbar", {
				content : this.oVizFrameContent,
				title: "Sample",
				showLegend: false,
				showZoom: false,
				showLegendButton: false
			});
			this.oChartContainer.placeAt("qunit-fixture");
			await nextUIUpdate();
		},
		afterEach : function() {
			this.oChartContainer.destroy();
			this.oChartContainer = null;
		}
	});

	QUnit.test("The active property of 'toolbar' aggregation is true, only if Chart Container's title is present", async function(assert) {
		assert.equal(this.oChartContainer._oToolBar.getActive(), true, "The active property of 'toolbar' aggregation is true, if only the title is present");

		this.oChartContainer.setProperty("title", "");
		this.oChartContainer.setAggregation("toolbar", "");
		this.oChartContainer._bControlNotRendered = true;

		await nextUIUpdate();

		assert.equal(this.oChartContainer._oToolBar.getActive(), false, "The active property of 'toolbar' aggregation is false, if title is not present");

		this.oChartContainer.setProperty("showZoom", true);
		this.oChartContainer.setAggregation("toolbar", "");
		this.oChartContainer._bControlNotRendered = true;

		await nextUIUpdate();

		assert.equal(this.oChartContainer._oToolBar.getActive(), false, "The active property of 'toolbar' aggregation is false, if title is not present and Chart buttons are available ");

		this.oChartContainer.setProperty("title", "New Title");
		this.oChartContainer.setProperty("showZoom", true);
		this.oChartContainer.setAggregation("toolbar", "");
		this.oChartContainer._bControlNotRendered = true;

		await nextUIUpdate();

		assert.equal(this.oChartContainer._oToolBar.getActive(), false, "The active property of 'toolbar' aggregation is false, if title is present and Chart buttons are available ");
	});

});
