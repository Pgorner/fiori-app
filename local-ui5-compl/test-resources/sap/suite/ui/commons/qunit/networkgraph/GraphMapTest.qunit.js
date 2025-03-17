sap.ui.define([
	"./TestUtils",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/ui/qunit/utils/nextUIUpdate",
	"sap/ui/core/Lib"
], function (GraphTestUtils, createAndAppendDiv, nextUIUpdate, CoreLib) {
	"use strict";

	var styleElement = document.createElement("style");
	var oResourceBundle = CoreLib.getResourceBundleFor("sap.suite.ui.commons");
	styleElement.textContent =
		"html, body" +
		"		height: 100%;" +
		"}" +
		".NetworkGraphQunitContentHeight {" +
		"		height : 100%;" +
		"}";
	document.head.appendChild(styleElement);

	createAndAppendDiv("content").className = "NetworkGraphQunitContentHeight";

	QUnit.module("Network graph map");

	QUnit.test("Map triggers map ready & unique id test for Buttons.", async function (assert) {
		var mContent = GraphTestUtils.buildGraphWithMap({
				nodes: [
					{
						key: 0,
						title: "Title"
					}
				]
			}, {
				directRenderNodeLimit: 0
			}),
			fnDone = assert.async();

		assert.expect(5);
		var sIdNode = mContent.graph.getNodes()[0].getId(),
			sIdMap = mContent.map.getId(),
			sLeftButtons = "-leftdivbuttons",
			sRightButtons = "-rightdivbuttons",
			sStatusIconWrapper = "-statusiconwrapper",
			sIdLeftButtons = sIdNode + sIdMap + sLeftButtons,
			sIdRightButtons = sIdNode + sIdMap + sRightButtons,
			sIdsStatusIconWrapper = sIdNode + sIdMap + sStatusIconWrapper;

		mContent.map.attachMapReady(function () {
			assert.ok(true, "Map should trigger ready event.");
			assert.equal(this.$().find(".sapSuiteUiCommonsNetworkGraphDivActionButtons")[0].id,sIdLeftButtons, "LeftButtons id contains sufix map");
			assert.equal(this.$().find(".sapSuiteUiCommonsNetworkGraphDivActionButtons")[1].id,sIdRightButtons, "RightButtons id contains sufix map");
			assert.equal(this.$().find(".sapSuiteUiCommonsNetworkNodeDivInfoWrapper")[0].id,sIdsStatusIconWrapper, "StatusIconWrapper id contains sufix map");
			assert.equal(this.$().find(".sapSuiteUiCommonsNetworkGraphMapSvg").attr("aria-hidden"), "true", "Screen readout not required as map is not part of navigation hence for map aria-hidden set as true");
			fnDone();
			mContent.all.destroy();
		});

		mContent.all.placeAt("content");
		await nextUIUpdate();
	});

	QUnit.test("Test visibility", async function (assert) {
		var mContent = GraphTestUtils.buildGraphWithMap({
				nodes: [
					{
						key: 0,
						title: "Title"
					}
				]
			}, {
				directRenderNodeLimit: 0
			}),
			fnDone = assert.async();

			//
		var sIdNode = mContent.graph.getNodes()[0].getId(),
			sIdMap = mContent.map.getId(),
			sLeftButtons = "-leftdivbuttons",
			sRightButtons = "-rightdivbuttons",
			sStatusIconWrapper = "-statusiconwrapper",
			sIdLeftButtons = sIdNode + sIdMap + sLeftButtons,
			sIdRightButtons = sIdNode + sIdMap + sRightButtons,
			sIdsStatusIconWrapper = sIdNode + sIdMap + sStatusIconWrapper,
			bisGraphMapVisible = true;

		mContent.graph.attachGraphReady(function () {
			assert.ok(true, "Graph should trigger ready event.");
			if (!mContent.map.getDomRef()) {
				assert.ok("Map not created.");
			}
			if (!bisGraphMapVisible) {
				fnDone();
				mContent.all.destroy();
			}
		});
		mContent.map.attachMapReady(function () {
			if (this.getDomRef()) {
				assert.ok(true, "Map should trigger ready event.");
				assert.equal(this.$().find(".sapSuiteUiCommonsNetworkGraphDivActionButtons")[0].id,sIdLeftButtons, "LeftButtons id contains sufix map");
				assert.equal(this.$().find(".sapSuiteUiCommonsNetworkGraphDivActionButtons")[1].id,sIdRightButtons, "RightButtons id contains sufix map");
				assert.equal(this.$().find(".sapSuiteUiCommonsNetworkNodeDivInfoWrapper")[0].id,sIdsStatusIconWrapper, "StatusIconWrapper id contains sufix map");
				assert.equal(this.$().find(".sapSuiteUiCommonsNetworkGraphMapSvg").attr("aria-hidden"), "true", "Screen readout not required as map is not part of navigation hence for map aria-hidden set as true");
			}
			mContent.map.setVisible(false);
			bisGraphMapVisible = false;
			mContent.graph.invalidate();
		});

		mContent.all.placeAt("content");
		await nextUIUpdate();
	});

	QUnit.test("Replacing graph rerenders map.", async function (assert) {
		var mContent = GraphTestUtils.buildGraphWithMap({
				nodes: [
					{
						key: 0
					}
				]
			}, {
				directRenderNodeLimit: 0
			}),
			fnDone = assert.async(),
			oSecondGraph = GraphTestUtils.buildGraph({
				nodes: [
					{
						key: 0
					},
					{
						key: 1
					}
				],
				lines: [
					{
						from: 0,
						to: 1
					}
				]
			}),
			bFirstRun = true,
			aPromisses = [
				new Promise(function (resolve, reject) {
					mContent.map.attachMapReady(resolve);
				}),
				new Promise(function (resolve, reject) {
					oSecondGraph.attachGraphReady(resolve);
				})
			];

		assert.expect(2);
		mContent.all.addItem(oSecondGraph);

		Promise.all(aPromisses).then(function () {
			assert.equal(mContent.map.$().find(".sapSuiteUiCommonsNetworkGraphDivNode").length, 1, "There should be only one node.");
			mContent.map.setGraph(oSecondGraph);
			bFirstRun = false;
		});

		mContent.map.attachMapReady(function () {
			if (!bFirstRun) {
				assert.equal(mContent.map.$().find(".sapSuiteUiCommonsNetworkGraphDivNode").length, 2, "There should be two nodes.");
				fnDone();
				mContent.all.destroy();
			}
		});

		mContent.all.placeAt("content");
		await nextUIUpdate();
	});

	QUnit.test("Test Accessibility for SVG's", async function (assert) {
		var mContent = GraphTestUtils.buildGraphWithMap({
				nodes: [
					{
						key: 0,
						title: "Title"
					}
				]
			}, {
				directRenderNodeLimit: 0
			}),
			fnDone = assert.async();

		mContent.map.attachMapReady(function () {
			assert.equal(mContent.map.getDomRef().querySelector(".sapSuiteUiCommonsNetworkGraphMapSvg").getAttribute("aria-label"),oResourceBundle.getText("NETWORK_GRAPH_OVERVIEW_SVG_ACCESSIBILITY_LABEL") ,"Correct aria-label is set.");
			assert.equal(mContent.map.getDomRef().querySelector(".sapSuiteUiCommonsNetworkGraphSvgNavigator").getAttribute("aria-label"),oResourceBundle.getText("NETWORK_GRAPH_NAVIGATOR_SVG_ACCESSIBILITY_LABEL") ,"Correct aria-label is set.");
			mContent.all.destroy();
			fnDone();
		});

		mContent.all.placeAt("content");
		await nextUIUpdate();
	});
});
