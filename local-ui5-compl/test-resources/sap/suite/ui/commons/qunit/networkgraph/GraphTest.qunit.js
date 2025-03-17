/*global QUnit, sinon*/
sap.ui.define([
	"./TestUtils",
	"sap/suite/ui/commons/networkgraph/Graph",
	"./TestLayout",
	"sap/suite/ui/commons/networkgraph/Node",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/suite/ui/commons/networkgraph/layout/NoopLayout",
	"sap/suite/ui/commons/networkgraph/layout/SwimLaneChainLayout",
	"sap/ui/thirdparty/sinon",
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/core/theming/Parameters",
	"sap/ui/core/Core",
	"sap/ui/core/InvisibleMessage",
	"sap/ui/qunit/utils/nextUIUpdate",
	"sap/ui/core/Lib",
	"sap/ui/core/Element",
	"sap/base/i18n/Localization",
	"sap/ui/core/Theming",
	"sap/ui/Device"
], function (
	GraphTestUtils,
	Graph,
	TestLayout,
	Node,
	createAndAppendDiv,
	NoopLayout,
	SwimLaneChainLayout,
	sinon,
	QUnitUtils,
	Parameters,
	Core,
	InvisibleMessage,
	nextUIUpdate,
	CoreLib,
	Element,
	Localization,
	Theming,
	Device
) {
	"use strict";

	var styleElement = document.createElement("style");
	var oResourceBundle = CoreLib.getResourceBundleFor("sap.suite.ui.commons");
	styleElement.textContent =
		"html, body" +
		"		height: 100%;" +
		"}" +
		".NetworkGraphQunitContentHeight {" +
		"		height : 100%;" +
		"}" +
		".NetworkGraphQunitResultHeight {" +
		"		height: 100%;" +
		"		overflow-y: hidden;" +
		"}";
	document.head.appendChild(styleElement);

	createAndAppendDiv("content").className = "NetworkGraphQunitContentHeight";
	createAndAppendDiv("qunit_results").className = "NetworkGraphQunitResultHeight";

	var horizon_Color = {
		Header: "rgb(29, 45, 62)",
		Border: "rgb(120, 143, 166)",
		Background: "rgba(0, 0, 0, 0)",
		Hover_Header: "rgb(29, 45, 62)",
		Selected_Border: "rgb(120, 143, 166)",
		DefaultHoverBg: "rgba(0, 0, 0, 0)",
		DefaultHoverBorder: "rgb(120, 143, 166)",
		DefaultSelectedColor: "rgb(29, 45, 62)",
		SelectedBgColor: "rgb(235, 248, 255)",
		DefaultSelectedBorderColor: "rgb(120, 143, 166)",
		SelectedHoverBgColor: "rgb(235, 248, 255)",
		DefaultSelectedLine: "rgb(0, 112, 177)"
	};

	function hexToRgb(hex) {
		var result = /^#?([a-f\d]{1,2})([a-f\d]{1,2})([a-f\d]{1,2})$/i.exec(hex);
		var clr = result ? {
			r: parseInt(result[1].length === 1 ? result[1] + result[1] : result[1], 16),
			g: parseInt(result[2].length === 1 ? result[2] + result[2] : result[2], 16),
			b: parseInt(result[3].length === 1 ? result[3] + result[3] : result[3], 16)
		} : null;
		if (clr) {
			return "rgb(" + clr.r + ", " + clr.g + ", " + clr.b + ")";
		}
		return hex;
	}

	var fnBoxCheckColors = function (assert, oNode, mAttributes, sPrefix) {
		var $header = oNode.$("header"),
			$wrapper = oNode.$("wrapper"),
			$headerContent = $header.find(".sapSuiteUiCommonsNetworkGraphDivNodeTitle");

		assert.equal(hexToRgb($headerContent.css("color")), mAttributes.headerContent, "(" + sPrefix + ") Header content");
		assert.ok(hexToRgb($header.css("background-color")) == mAttributes.background || $header.css("background-color") === "transparent"
			, "(" + sPrefix + ") Background color");
		assert.equal(hexToRgb($wrapper.css("border-top-color")), mAttributes.border, "(" + sPrefix + ") Border color");

		// attributes
		var $rows = oNode.$().find(".sapSuiteUiCommonsNetworkGraphDivNodeAttributes").children();
		$rows.each(function (i, oRow) {
			var sColor = jQuery(oRow).find(".sapSuiteUiCommonsNetworkGraphDivNodeLabels>span").css("color");
			assert.equal(hexToRgb(sColor), mAttributes.rows[i], "Attr Row [" + i + "]");

		});
	};

	QUnit.module("Network graph general functionality test");

	QUnit.skip("Panning graph with mouse.", async function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
			nodes: [
				{ key: 0 }, { key: 1 }, { key: 2 }, { key: 3 }, { key: 4 },
				{ key: 5 }, { key: 6 }, { key: 7 }, { key: 8 }, { key: 9 }
			],
			lines: [
				{ from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 3 }, { from: 3, to: 4 },
				{ from: 5, to: 6 }, { from: 6, to: 7 }, { from: 7, to: 8 }, { from: 8, to: 9 }
			]
		}),
			fnDone = assert.async(),
			iScrollerLeft, iScrollerTop,
			mParams;

		assert.expect(2);
		oGraph.attachGraphReady(async function () {
			// Zoom enough for the graph to be larger then the screen
			for (var i = 0; i < 9; i++) {
				oGraph._zoom({ deltaY: 1 });
			}

			mParams = GraphTestUtils.getGraphMouseParams(oGraph);
			oGraph._mouseDown(mParams.clientX, mParams.clientY);
			await nextUIUpdate();
			iScrollerLeft = oGraph.$scroller.get(0).scrollLeft;
			iScrollerTop = oGraph.$scroller.get(0).scrollTop;
			oGraph._mouseMove(10, 10);
			await nextUIUpdate();
			assert.ok(oGraph.$scroller.get(0).scrollLeft > iScrollerLeft, "Graph should have moved to the right.");
			assert.ok(oGraph.$scroller.get(0).scrollTop > iScrollerTop, "Graph should have moved to the bottom.");
			mParams = GraphTestUtils.getGraphMouseParams(oGraph);
			oGraph._mouseUp(mParams.clientX, mParams.clientY);
			await nextUIUpdate();

			oGraph.destroy();
			fnDone();
		});

		oGraph.placeAt("content");
		await nextUIUpdate();
	});

	QUnit.test("Expand/Collapse button must announce information when pressed enter", async function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
			nodes: [
				{ key: 0, title: "Zero", shape: "Box", group: "A" },
				{ key: 1, title: "One", shape: "Box", group: "A" },
				{ key: 2, title: "Two", shape: "Box", group: "B" }
			],
			lines: [
				{ from: 0, to: 1 }, { from: 0, to: 2 }, { from: 1, to: 2 }
			],
			groups: [
				{ key: "A", title: "GroupA" }, { key: "B" }
			]
		}),
			fnDone = assert.async();
		oGraph.attachGraphReady(async function () {
			var oButton = new sap.m.Button().placeAt("qunit-fixture");
			await nextUIUpdate();
			var item = oGraph;
			var oFocus = { item: item, button: oButton.getDomRef() };
			var flag = true;
			oGraph._oFocus = oFocus;
			var oUpdateAccessibiltySpy = sinon.spy(Graph.prototype, "_updateAccessibility");
			oGraph.setFocus(oFocus, flag);
			if (flag) {
				assert.ok(oUpdateAccessibiltySpy.called, "_updateAccessibility function is called");
			}
			flag = false;
			oGraph.setFocus(oFocus, flag);
			if (flag == false) {
				assert.ok(oUpdateAccessibiltySpy.called, "_updateAccessibility function is called");
			}

			oGraph.destroy();
			fnDone();
		});

		oGraph.placeAt("content");
		await nextUIUpdate();
	});

	QUnit.test("Pinch Zoom Testing", async function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
			nodes: [
				{ key: 0, title: "Zero", shape: "Box", group: "A" },
				{ key: 1, title: "One", shape: "Box", group: "A" },
				{ key: 2, title: "Two", shape: "Box", group: "B" }
			],
			lines: [
				{ from: 0, to: 1 }, { from: 0, to: 2 }, { from: 1, to: 2 }
			],
			groups: [
				{ key: "A", title: "GroupA" }, { key: "B" }
			]
		}),
			fnDone = assert.async();
		oGraph.attachGraphReady(function () {
			//Arrange
			var oWrapper = oGraph.$scroller,
				touch1 = {
					clientX: 515.2000122070312,
					clientY: 285,
					force: 0.5,
					identifier: 0,
					pageX: 515.2000122070312,
					pageY: 285,
					radiusX: 0.4000000059604645,
					radiusY: 0.4000000059604645,
					rotationAngle: 0,
					screenX: 835.2000122070312,
					screenY: 456
				},
				touch2 = {
					clientX: 632,
					clientY: 133,
					force: 0.5,
					identifier: 1,
					pageX: 632,
					pageY: 133,
					radiusX: 0.4000000059604645,
					radiusY: 0.800000011920929,
					rotationAngle: 0,
					screenX: 952,
					screenY: 304
				},
				preventDefaultSpy = sinon.spy(),
				oFakeEvent = {
					target: oWrapper,
					preventDefault: preventDefaultSpy,
					touches: { 0: touch1, 1: touch2, length: 2 }
				};
			QUnitUtils.triggerEvent("touchmove", oWrapper, oFakeEvent);
			assert.ok(preventDefaultSpy.calledOnce, "Prevent Default on the Event with target should have been called once");
			oGraph.destroy();
			fnDone();
		});
		oGraph.placeAt("content");
		await nextUIUpdate();
	});

	QUnit.test("Order of rendered layers - HTML", async function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
			nodes: [
				{ key: 0, title: "ABC" },
				{ key: 1, title: "OPQ", group: "A" }
			],
			lines: [
				{ from: 0, to: 1, title: "0-1" }
			],
			groups: [
				{ key: "A", title: "GHI" }
			]
		}),
			fnDone = assert.async();

		oGraph.setRenderType("Html");
		assert.expect(7);

		oGraph.attachGraphReady(function () {
			var aChildren = oGraph.$("innerscroller").children();
			assert.notEqual(aChildren[0].id.indexOf("tooltiplayer"), -1, "line tooltips");
			assert.notEqual(aChildren[1].id.indexOf("divgroups"), -1, "groups");
			assert.notEqual(aChildren[2].id.indexOf("divnodes"), -1, "nodes");
			assert.notEqual(aChildren[3].id.indexOf("networkGraphSvg"), -1, "svg");
			assert.notEqual(aChildren[4].id.indexOf("background"), -1, "background");
			assert.equal(aChildren.length, 5, "children");
			assert.equal(oGraph._searchField.getSuggestionItems().length, oGraph._searchField.getModel().oData.items.length, "SearchField contents are equal.");
			oGraph.destroy();
			fnDone();
		});

		oGraph.placeAt("content");
		await nextUIUpdate();
	});

	QUnit.test("Order of rendered layers - SVG", async function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
			nodes: [
				{ key: 0, title: "ABC" },
				{ key: 1, title: "OPQ", group: "A" }
			],
			lines: [
				{ from: 0, to: 1, title: "0-1" }
			],
			groups: [
				{ key: "A", title: "GHI" }
			]
		}),
			fnDone = assert.async();

		assert.expect(5);
		oGraph.setRenderType("Svg");

		oGraph.attachGraphReady(function () {
			var aChildren = oGraph.$("innerscroller").children();
			assert.notEqual(aChildren[0].id.indexOf("tooltiplayer"), -1, "line tooltips");
			assert.notEqual(aChildren[1].id.indexOf("divgroups"), -1, "groups");
			assert.notEqual(aChildren[2].id.indexOf("networkGraphSvg"), -1, "svg");
			assert.equal(aChildren.length, 3, "children");
			assert.equal(oGraph._searchField.getSuggestionItems().length, oGraph._searchField.getModel().oData.items.length, "SeaarchField contents are equal.");
			oGraph.destroy();
			fnDone();
		});

		oGraph.placeAt("content");
		await nextUIUpdate();
	});

	QUnit.test("Test SearchField content size.", async function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
			nodes: createNodes()
		}),
			fnDone = assert.async();

		function createNodes() {
			var aNodes = [];
			for (var i = 0; i < 150; i++) {
				aNodes.push({ key: i, title: "Title" + i });
			}
			return aNodes;
		}

		oGraph.attachGraphReady(function () {
			assert.equal(oGraph._searchField.getSuggestionItems().length, oGraph._searchField.getModel().oData.items.length, "SeaarchField contents are equal.");
			oGraph.destroy();
			fnDone();
		});

		oGraph.placeAt("content");
		await nextUIUpdate();
	});
	QUnit.test("Legend accessibility test on zoom", async function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
			nodes: createNodes()
		})
		function createNodes() {
			var aNodes = [];
			for (var i = 0; i < 10; i++) {
				aNodes.push({ key: i, title: "Title" + i });
			}
			return aNodes;
		}
		oGraph.placeAt("content");
		await nextUIUpdate();
		const sOverflow = oGraph.$legend.css("overflow");
		assert.equal(sOverflow, "scroll", "Legend is accessible on all zoom levels");
                oGraph.destroy();
	});
	QUnit.test("Setting width and height of graph causes invalidation and results in appropriate screen sizes.", async function (assert) {
		var oGraph = GraphTestUtils.getAtomGraph(),
			fnDone = assert.async(),
			iScreenWidth, iScreenHeight,
			fNewWidthRate, fNewHeightRate,
			mAsyncChain = {
				eventName: "graphReady",
				iterations: [
					{
						action: function () {
							iScreenWidth = oGraph.$().width();
							iScreenHeight = oGraph.$().height();
							oGraph.setWidth("50%").setHeight("150%");
						},
						assert: function () {
							fNewWidthRate = oGraph.$().width() / iScreenWidth;
							assert.ok(GraphTestUtils.equalEnough(fNewWidthRate, 0.5), "Screen width should change by 0.5.");
							fNewHeightRate = oGraph.$().height() / iScreenHeight;
							assert.ok(GraphTestUtils.equalEnough(fNewHeightRate.toFixed(1), 1.5), "Screen width should change by 1.5");
						}
					},
					{
						action: function () {
							oGraph.setWidth("640px").setHeight("480px");
						},
						assert: function () {
							assert.equal(oGraph.$().width(), 640, "Screen width should change to 640 pixels.");
							assert.equal(oGraph.$().height(), 480, "Screen height should change to 480 pixels.");
						}
					},
					{
						action: function () {
							oGraph.setWidth("auto").setHeight("auto");
						},
						assert: function () {
							var node = oGraph.getNodes()[0];
							var nodeWidth = node.getX() + node._iWidth + 50; // 50 = SIZE_OFFSET_X
							var nodeHeight = node.getY() + node._iHeight + 20; // 20 = SIZE_OFFSET_Y
							assert.equal(oGraph.$().width(), nodeWidth, "Screen width should auto size.");
							assert.equal(oGraph.$("wrapper").height(), nodeHeight, "Screen height should auto size.");
						}
					},
					{
						action: function () {
							oGraph.setWidth("80em").setHeight("50em");
						},
						assert: function () {
							assert.ok(true, "Relative values should trigger invalidations.");
						}
					}
				]
			};

		assert.expect(7);
		await GraphTestUtils.runAsyncActionAssertChain(oGraph, mAsyncChain, fnDone);
	});

	QUnit.test("Zoom works correctly and triggers expected events.", async function (assert) {
		var oGraph = GraphTestUtils.getAtomGraph(),
			fnDone = assert.async(),
			mSyncChain = {
				eventName: "zoomChanged",
				iterations: [
					{
						action: function () {
							oGraph._zoom({ deltaY: 1 });
						},
						assert: function () {
							assert.ok(oGraph._fZoomLevel > 1, "Graph should be magnified after zoom-in.");
							assert.ok(oGraph._oZoomLevelInvisibleText.getText(), "Zoom Button has the correct Accesibility Label: " + oGraph._oZoomLevelInvisibleText.getText());
						}
					},
					{
						action: function () {
							oGraph._zoom({ deltaY: -1 });
						},
						assert: function () {
							assert.ok(oGraph._fZoomLevel == 1, "Graph should be back to no-zoom after zoom-out.");
							assert.ok(oGraph._oZoomLevelInvisibleText.getText(), "Zoom Button has the correct Accesibility Label: " + oGraph._oZoomLevelInvisibleText.getText());
						}
					},
					{
						action: function () {
							oGraph._zoom({ deltaY: -1 });
						},
						assert: function () {
							assert.ok(oGraph._fZoomLevel < 1, "Graph should be minified after another zoom-out.");
							assert.ok(oGraph._oZoomLevelInvisibleText.getText(), "Zoom Button has the correct Accesibility Label: " + oGraph._oZoomLevelInvisibleText.getText());
						}
					},
					{
						action: function () {
							oGraph._zoom({ deltaY: 1 });
						},
						assert: function () {
							assert.equal(oGraph._fZoomLevel, 1, "Graph should have correct zoom-in level");
							assert.ok(oGraph._oZoomLevelInvisibleText.getText(), "Zoom Button has the correct Accesibility Label: " + oGraph._oZoomLevelInvisibleText.getText());
						}
					},
					{
						action: function () {
							oGraph._zoom({ zoomLevel: 2 });
						},
						assert: function () {
							assert.equal(oGraph._fZoomLevel, 2, "Graph should have correct zoom-in level");
							assert.ok(oGraph._oZoomLevelInvisibleText.getText(), "Zoom Button has the correct Accesibility Label: " + oGraph._oZoomLevelInvisibleText.getText());
						}
					},
					{
						action: function () {
							oGraph._zoom({ zoomLevel: 0.2 });
						},
						assert: function () {
							assert.equal(oGraph._fZoomLevel, 0.2, "Graph should have correct zoom-in level");
							assert.ok(oGraph._oZoomLevelInvisibleText.getText(), "Zoom Button has the correct Accesibility Label: " + oGraph._oZoomLevelInvisibleText.getText());
						}
					},
					{
						action: function () {
							oGraph._zoom({ zoomLevel: 200, deltaY: -1 });
						},
						assert: function () {
							assert.equal(oGraph._fZoomLevel, 200, "Graph should have correct zoom-in level");
							assert.ok(oGraph._oZoomLevelInvisibleText.getText(), "Zoom Button has the correct Accesibility Label: " + oGraph._oZoomLevelInvisibleText.getText());
						}
					},
					{
						action: function () {
							oGraph._zoom({ zoomLevel: -10 });
						},
						assert: function () {
							assert.equal(oGraph._fZoomLevel, 0, "Graph should have correct zoom-in level");
							assert.ok(oGraph._oZoomLevelInvisibleText.getText(), "Zoom Button has the correct Accesibility Label: " + oGraph._oZoomLevelInvisibleText.getText());
						}
					},
					{
						action: function () {
							oGraph._fZoomLevel = 0.43;
							oGraph._zoom({ deltaY: 1 });
						},
						assert: function () {
							assert.equal(oGraph._fZoomLevel, 0.5, "Graph should have correct zoom-in level");
							assert.ok(oGraph._oZoomLevelInvisibleText.getText(), "Zoom Button has the correct Accesibility Label: " + oGraph._oZoomLevelInvisibleText.getText());
						}
					},
					{
						action: function () {
							oGraph._fZoomLevel = 0.43;
							oGraph._zoom({ deltaY: -1 });
						},
						assert: function () {
							assert.equal(oGraph._fZoomLevel, 0.33, "Graph should have correct zoom-in level");
							assert.ok(oGraph._oZoomLevelInvisibleText.getText(), "Zoom Button has the correct Accesibility Label: " + oGraph._oZoomLevelInvisibleText.getText());
						}
					}
				]
			};

		assert.expect(20);
		oGraph.attachGraphReady(async function () {
			await GraphTestUtils.runSyncActionAssertChain(oGraph, mSyncChain, fnDone);
		});

		oGraph.placeAt("content");
		await nextUIUpdate();
	});

	QUnit.test("Public zoom calls private _zoom with correct parameters", function (assert) {
		var oGraph = GraphTestUtils.getAtomGraph(),
			aParams = [
				{
					oCallParams: {},
					oTestParams: { deltaY: 1 }
				},
				{
					oCallParams: { x: 1 },
					oTestParams: { deltaY: 1, x: 1 }
				},
				{
					oCallParams: { x: 1, y: 1 },
					oTestParams: { deltaY: 1, x: 1, y: 1, point: { x: 1, y: 1 } }
				},
				{
					oCallParams: { zoomin: true },
					oTestParams: { zoomin: true, deltaY: 1 }
				},
				{
					oCallParams: { zoomin: false },
					oTestParams: { zoomin: false, deltaY: -1 }
				},
				{
					oCallParams: { zoomin: false, x: -10, y: -10 },
					oTestParams: { zoomin: false, deltaY: -1, x: -10, y: -10, point: { x: -10, y: -10 } }
				},
				{
					oCallParams: { zoomLevel: 0 },
					oTestParams: { deltaY: 1, zoomLevel: 0 }
				},
				{
					oCallParams: { zoomLevel: 3, zoomin: false },
					oTestParams: { zoomin: false, deltaY: -1, zoomLevel: 3 }
				}
			],
			oZoomStub = sinon.stub(oGraph, "_zoom");

		aParams.forEach(function (oParams, iIndex) {
			oGraph.zoom(oParams.oCallParams);
			assert.equal(oZoomStub.args[iIndex].length, 1, "_zoom should be called with correct number of parameters");
			assert.deepEqual(oZoomStub.args[iIndex][0], oParams.oTestParams, "_zoom should be called with correct params");
		});

		oGraph.destroy();
	});

	var testEnableWheelZoom = async function (assert, enableWheelZoom) {
		var oGraph = GraphTestUtils.getAtomGraph(),
			fnDone = assert.async();
		var zoomParams = {
			point: {
				x: 42,
				y: 24
			},
			deltaY: -10
		};
		var zoom = sinon.spy(Graph.prototype, "_zoom");
		var getZoomText = sinon.spy(Graph.prototype, "_getZoomText");
		var cleanUp = function () {
			zoom.restore();
			getZoomText.restore();
			fnDone();
			oGraph.destroy();
		};
		oGraph.setEnableWheelZoom(enableWheelZoom);
		oGraph.setProperty('_smoothWheelZoom', 0);

		oGraph.attachGraphReady(function () {
			var oEventWithoutCtrl = {
				x: 42,
				y: 24,
				deltaY: 10,
				div: oGraph.$("ctrlalert"),
				ctrl: false
			};
			var oEventWithCtrl = {
				x: 42,
				y: 24,
				deltaY: 10,
				div: oGraph.$("ctrlalert"),
				ctrl: true
			};
			var res = oGraph._wheel(oEventWithCtrl);
			assert.ok(res, "_wheel returns true");
			assert.ok(zoom.calledWith(zoomParams), "setEnableWheelZoom=" + enableWheelZoom + ", _zoom was called, if CTRL key was used.");
			zoom.reset();
			assert.ok(getZoomText.called, "_getZoomText called");
			getZoomText.reset();

			res = oGraph._wheel(oEventWithoutCtrl);
			if (enableWheelZoom) {
				assert.ok(res, "_wheel returns true");
				assert.ok(zoom.calledWith(zoomParams), "setEnableWheelZoom=" + enableWheelZoom + ", _zoom was called, if CTRL key was not used.");
				assert.ok(getZoomText.called, "_getZoomText called");
				cleanUp();
			} else {
				assert.notOk(res, "_wheel returns false");
				assert.notOk(zoom.called, "setEnableWheelZoom=" + enableWheelZoom + ", _zoom was not called, if CTRL key was not used.");
				assert.notOk(getZoomText.called, "_getZoomText not called");
				assert.equal(oGraph.$("ctrlalert").css("opacity"), "0", "opacity should be zero");
				cleanUp();
			}
		});

		oGraph.placeAt("content");
		await nextUIUpdate();
	};

	QUnit.test("Zoom status to be announce when pressed on the zoom to fit button", async function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
			nodes: [
				{ key: 0, title: "ABC" },
				{ key: 1, title: "OPQ", group: "A" }
			],
			lines: [
				{ from: 0, to: 1, title: "0-1" }
			],
			groups: [
				{ key: "A", title: "GHI" }
			]
		}),
			fnDone = assert.async();

		assert.expect(1);

		oGraph.attachGraphReady(function () {
			sinon.spy(oGraph.oInvisibleMessage, "announce");
			oGraph._fitToScreen();
			assert.ok(oGraph.oInvisibleMessage.announce.calledOnce, "The zoom level has been announced");
			oGraph.destroy();
			fnDone();
		});

		oGraph.placeAt("content");
		await nextUIUpdate();
	});

	QUnit.test("Invisible message should be initialized in onAfterRendering lifecycle hook", async function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
			nodes: [
				{ key: 0, title: "ABC" },
				{ key: 1, title: "OPQ", group: "A" }
			],
			lines: [
				{ from: 0, to: 1, title: "0-1" }
			],
			groups: [
				{ key: "A", title: "GHI" }
			]
		}),
			fnDone = assert.async();

		assert.expect(2);

		oGraph.attachGraphReady(function () {
			//Arrange
			var getInstanceSpy = sinon.spy(InvisibleMessage, "getInstance");
			assert.notOk(getInstanceSpy.callCount, "The invisible message is not instantiated");
			//Act
			oGraph.onAfterRendering();
			//Assert
			assert.ok(getInstanceSpy.calledOnce, "The invisible message is instantiated");
			oGraph.destroy();
			//cleanup
			getInstanceSpy.restore();
			fnDone();
		});
		oGraph.placeAt("content");
		await nextUIUpdate();
	});

	QUnit.test("Property enableWheelZoom=true is working properly.", function (assert) {
		testEnableWheelZoom(assert, true);
	});

	QUnit.test("Property enableWheelZoom=false is working properly.", function (assert) {
		testEnableWheelZoom(assert, false);
	});

	QUnit.test("Events must be attached only once when the graph gets invalidated more than once",async function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
			nodes: [
				{ key: 0, title: "ABC" },
				{ key: 1, title: "OPQ", group: "A" }
			],
			lines: [
				{ from: 0, to: 1, title: "0-1" }
			],
			groups: [
				{ key: "A", title: "GHI" }
			]
		}),
			fnDone = assert.async();

		assert.expect(1);
		oGraph.setProperty("_smoothWheelZoom", 0);

		oGraph.attachGraphReady(function () {
			//Arrange
			var wheelSpy = sinon.spy(oGraph, "_wheel");
			var oFakeEvent = {
				originalEvent:{
					clientX: 430,
					clientY: 151,
					deltaY: -100
				},
				ctrlKey: false
			}
			//Act
			QUnitUtils.triggerEvent("wheel", oGraph.$scroller, oFakeEvent);
			//Assert
			assert.ok(wheelSpy.calledOnce,"Wheel Event is invoked only once");
			oGraph.destroy();
			//cleanup
			wheelSpy.restore();
			fnDone();
		});
		oGraph.placeAt("content");
		await nextUIUpdate();
		oGraph.setEnableWheelZoom(false);
		await nextUIUpdate();
		oGraph.setEnableWheelZoom(true);
		await nextUIUpdate();
	});

	QUnit.test("Property enableWheelZoom=true & smoothWheelZoom is working properly.", async function (assert) {

		var oGraph = GraphTestUtils.getAtomGraph(),
		fnDone = assert.async(),
		zoomParams = {
			point: {
				x: 42,
				y: 24
			},
			deltaY: -10
		},
		zoom = sinon.spy(Graph.prototype, "_zoom"),
		getZoomText = sinon.spy(Graph.prototype, "_getZoomText"),
		cleanUp = function () {
			zoom.restore();
			getZoomText.restore();
			fnDone();
			oGraph.destroy();
		},
		enableWheelZoom = true,
		smoothWheelZoom = 40;

		oGraph.setEnableWheelZoom(enableWheelZoom);
		oGraph.setProperty('_smoothWheelZoom', smoothWheelZoom);
		oGraph.attachGraphReady(function () {
			var oEventWithoutCtrl = {
				x: 42,
				y: 24,
				deltaY: 10,
				div: oGraph.$("ctrlalert"),
				ctrl: false
			},
			oEventWithCtrl = {
				x: 42,
				y: 24,
				deltaY: 10,
				div: oGraph.$("ctrlalert"),
				ctrl: true
			},
			res = oGraph._wheel(oEventWithCtrl),
			delayedInterval = 0,
			delayedIntervalIncrement = 5;
			assert.ok(res, "_wheel returns true");
			assert.ok(zoom.calledWith(zoomParams), "setEnableWheelZoom=" + enableWheelZoom + ", _zoom was called, if CTRL key was used.");
			var intervalId = setInterval(() => {
				res = oGraph._wheel(oEventWithoutCtrl);
				delayedInterval += delayedIntervalIncrement;
				if (delayedInterval > smoothWheelZoom){
					assert.ok(zoom.calledWith(zoomParams), "setEnableWheelZoom=" + enableWheelZoom + ", _zoom was called, if CTRL key was used.");
					assert.ok(zoom.calledTwice, "zoom is called only twice even though _wheel is invoked " + (delayedInterval / delayedIntervalIncrement) + " times due to smoothWheelZoom");
					clearInterval(intervalId);
					cleanUp();
				}
			},delayedIntervalIncrement);
		});

		oGraph.placeAt("content");
		await nextUIUpdate();
	});

	QUnit.test("Search confirmation selects desired node or line.", async function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
			nodes: [
				{ key: 0, title: "ABC" },
				{ key: 1, title: "OPQ", group: "A" },
				{ key: 2, title: "XYZ" }
			],
			lines: [
				{ from: 0, to: 1, title: "0-1" },
				{ from: 2, to: 1, title: "2-1" },
				{ from: 0, to: 2, title: "0-2" }
			],
			groups: [
				{ key: "A", title: "GHI" }
			]
		}),
			fnDone = assert.async(),
			mSyncChain = {
				eventName: "selectionChange",
				iterations: [
					{
						action: function () {
							oGraph._search("OPQ");
						},
						assert: function () {
							assert.equal(
								GraphTestUtils.getNodesSelectionFingerprint(oGraph),
								"FTF",
								"Node OPQ that has been searched for should be the only one selected.");
						}
					},
					{
						action: function () {
							oGraph._search("ABC");
						},
						assert: function () {
							assert.equal(
								GraphTestUtils.getNodesSelectionFingerprint(oGraph),
								"TFF",
								"Node ABC that has been searched for should be the only one selected.");
						}
					},
					{
						action: function () {
							oGraph._search("2-1 (XYZ -> OPQ)");
						},
						assert: function () {
							assert.equal(
								GraphTestUtils.getLinesSelectionFingerprint(oGraph),
								"FTF",
								"Line 2-1 that has been searched for should be the only one selected.");
						}
					},
					{
						action: function () {
							oGraph._search();
						},
						assert: function () {
							assert.equal(
								GraphTestUtils.getNodesSelectionFingerprint(oGraph),
								"FFF",
								"All should be deselected after invalid search.");
						}
					}
				]
			};

		assert.expect(4);
		oGraph.attachGraphReady(async function () {
			await GraphTestUtils.runSyncActionAssertChain(oGraph, mSyncChain, fnDone);
		});

		oGraph.placeAt("content");
		await nextUIUpdate();
	});

	QUnit.test("Toggling fit to screen.", async function (assert) {
		var oGraph = GraphTestUtils.getAtomGraph(),
			fnDone = assert.async();

		assert.expect(1);
		oGraph.attachGraphReady(function () {
			oGraph._fitToScreen();
			assert.ok(true, "Graph is now Fit@SAP.");
			fnDone();
			oGraph.destroy();
		});

		oGraph.placeAt("content");
		await nextUIUpdate();
	});

	QUnit.test("Background image gets rendered.", function (assert) {
		var oGraph = GraphTestUtils.getAtomGraph(),
			fnDone = assert.async(),
			fnAssert = function () {
				var sImg = oGraph.$("networkGraphSvg").css("background-image");
				assert.ok(sImg && sImg.search(/.*sap.jpg.*/) !== -1, "Background should be rendered.");
			};

		assert.expect(1);
		oGraph.setBackgroundImage("test-resources/sap/suite/ui/commons/qunit/networkgraph/sap.jpg");

		GraphTestUtils.runAsyncAssert(oGraph, fnAssert, fnDone);
	});

	QUnit.test("Layouting events [afterLayouting, beforeLayouting] are all fired, and in correct order.", async function (assert) {
		var oGraph = GraphTestUtils.getAtomGraph(),
			fnDoneBefore = assert.async(),
			fnDoneAfter = assert.async(),
			bBeforeDone = false,
			bAfterDone = false;

		assert.expect(2);
		oGraph.attachBeforeLayouting(function () {
			assert.notOk(bAfterDone, "Event 'beforeLayouting' should be fired well before 'afterLayouting'.");
			bBeforeDone = true;
			fnDoneBefore();
		});
		oGraph.attachAfterLayouting(function () {
			assert.ok(bBeforeDone, "Event 'afterLayouting' should be fired well after 'beforeLayouting'.");
			bAfterDone = false;
			fnDoneAfter();
			oGraph.destroy();
		});

		oGraph.placeAt("content");
		await nextUIUpdate();
	});

	//Disabled test because of intermittent behaviour
	/*QUnit.test("Search field suggestions.", function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
				nodes: [
					{key: 0, title: "Abraka"},
					{key: 1, title: "Dabra", group: "A"},
					{key: 2, title: "Hadra", group: "B"}
				],
				lines: [
					{from: 0, to: 1, title: "Cobra"},
					{from: 1, to: 2, title: "Opera"},
					{from: 2, to: 0, title: "Aura"}
				],
				groups: [
					{key: "A", title: "Ludra"},
					{key: "B", title: "Ovar"}
				]
			}),
			fnDone = assert.async();

		assert.expect(3);
		oGraph.attachGraphReady(function () {
			oGraph._suggest("ra");
			assert.equal(
				GraphTestUtils.getElementsKeyList(oGraph._searchField.getSuggestionItems()),
				"0, 1, 2, A, line_0-1[0], line_1-2[1], line_2-0[2]",
				"Suggestions for the term 'ra' should be as expected.");
			oGraph._suggest("dra");
			assert.equal(
				GraphTestUtils.getElementsKeyList(oGraph._searchField.getSuggestionItems()),
				"2, A, line_1-2[1], line_2-0[2]",
				"Suggestions for the term 'dra' should be as expected.");
			oGraph._suggest("dragon");
			assert.equal(
				oGraph._searchField.getSuggestionItems(),
				0,
				"There should be no suggestions for the term 'dragon'.");
			fnDone();
			oGraph.destroy();
		});

		oGraph.placeAt("content");
		await nextUIUpdate();
	});*/

	QUnit.test("Graph ready fires after the last layouting is done.", async function (assert) {
		var oGraph = new Graph({
			nodes: [new Node({
				key: 0,
				x: 0,
				y: 0
			})]
		}),
			aResolves = [],
			fnDone = assert.async(),
			iLayoutsCalled = 0;

		function resolveNext() {
			setTimeout(function () {
				var resolve = aResolves.shift();
				if (resolve) {
					resolve();
					resolveNext();
				}
			});
		}

		assert.expect(2);
		oGraph.setLayoutAlgorithm(new TestLayout(function (fnResolve) {
			iLayoutsCalled++;
			aResolves.push(fnResolve);
		}));
		oGraph.attachGraphReady(function () {
			assert.equal(aResolves.length, 0, "Not all layouting jobs were called.");
			assert.equal(iLayoutsCalled, 2, "Graph ready fired before second layouting was finished.");
			fnDone();
			oGraph.destroy();
		});

		oGraph.placeAt("content");
		await nextUIUpdate();

		oGraph.addNode(new Node({
			key: 1,
			x: 100,
			y: 100
		}));
		await nextUIUpdate();

		resolveNext();
	});

	QUnit.test("Only the latest layouting algorythm modifies the content.", async function (assert) {
		var oGraph = new Graph({
			nodes: [new Node({
				key: 0,
				x: 0,
				y: 0
			})]
		}),
			aResolves = [],
			fnDone = assert.async(),
			iLayoutsCalled = 0;

		function resolveNext() {
			setTimeout(function () {
				var obj = aResolves.shift();
				if (obj) {
					if (obj.layoutNo === 1) {
						assert.ok(obj.layoutTask.isTerminated(), "First task should be terminated.");
					} else {
						oGraph.getNodes()[0].setX(1);
					}
					obj.resolve();
					resolveNext();
				}
			});
		}

		assert.expect(2);
		oGraph.setLayoutAlgorithm(new TestLayout(function (fnResolve, fnReject, oLayoutTask) {
			iLayoutsCalled++;
			aResolves.push({ resolve: fnResolve, layoutNo: iLayoutsCalled, layoutTask: oLayoutTask });
		}));
		oGraph.attachGraphReady(function () {
			assert.equal(oGraph.getNodes()[0].getX(), 1, "Node position should be set by second layouting task but it's not.");
			fnDone();
			oGraph.destroy();
		});

		oGraph.placeAt("content");
		await nextUIUpdate();

		oGraph.addNode(new Node({
			key: 1,
			x: 100,
			y: 100
		}));
		await nextUIUpdate();

		resolveNext();
	});

	QUnit.test("updateLegend calls inner _createLegend method", async function (assert) {
		var oGraph = new Graph(),
			fnDone = assert.async();

		sinon.spy(oGraph, "_createLegend");

		oGraph = GraphTestUtils.buildGraph({
			statuses: [{ key: "Test", borderColor: "red" }],
			nodes: [{ key: 0, status: "Test" }]
		}, oGraph);

		assert.expect(1);

		oGraph.attachGraphReady(function () {
			assert.ok(oGraph._createLegend.calledOnce, "_createLegend should be called once");

			fnDone();
			oGraph.destroy();
		});

		oGraph.placeAt("content");
		await nextUIUpdate();
	});
	
        QUnit.test("The legend's width should be 100% on phone devices", async function (assert) {
		Device.system.phone = true;
		// Set the test container's width to simulate a 320px device
		var oTestContainer = document.getElementById("content");
		var sActualWidth = oTestContainer.style.width;
		oTestContainer.style.width = "320px";

		var oGraph = new Graph(),
			fnDone = assert.async();

		oGraph = GraphTestUtils.buildGraph({
			statuses: [{ key: "Test", borderColor: "red" }],
			nodes: [{ key: 0, status: "Test" }]
		}, oGraph);

		assert.expect(2);

		oGraph.attachGraphReady(function () {

			// Call the updateLegend function to trigger the legend update
			oGraph.$legend.show();

			// Get the legend element
			var oLegendElement = oGraph.getDomRef().querySelector('.sapSuiteUiCommonsNetworkGraphLegend');

			// Check if the width is set to 100% 
			assert.ok(oLegendElement.getAttribute("style").includes("100%"), "The legend's width should be 100% of the viewport (320px).");
			assert.equal(oLegendElement.tabIndex, -1, "tabIndex is removed.");

			Device.system.phone = false;
			oTestContainer.style.width = sActualWidth;
                        oGraph.destroy();
			fnDone();
		});

		oGraph.placeAt("content");
		await nextUIUpdate();
	});
  
        QUnit.test("updateLegend is called when status set on element", async function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
			nodes: [
				{ key: 0, title: "ABC" },
				{ key: 1, title: "OPQ", group: "A" },
				{ key: 2, title: "XYZ" }
			],
			lines: [
				{ from: 0, to: 1, title: "0-1" },
				{ from: 2, to: 1, title: "2-1" },
				{ from: 0, to: 2, title: "0-2" }
			],
			groups: [
				{ key: "A", title: "GHI" }
			]
		}),
			fnDone = assert.async();


		var oLegendStub = sinon.stub(oGraph, "updateLegend");

		oGraph.attachGraphReady(function () {
			oGraph.getNodes()[0].setStatus("test");
			oGraph.getLines()[0].setStatus("test");
			oGraph.getGroups()[0].setStatus("test");

			assert.equal(oLegendStub.callCount, 3, "updateLegend called correct number of times");

			oGraph.destroy();
			fnDone();
		});

		oGraph.placeAt("content");
		await nextUIUpdate();
	});

	QUnit.test("Legend test", async function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
			statuses: [{ key: "Custom", "borderColor": "red" }],
			nodes: [
				{ key: 0, title: "ABC", status: "Standard" },
				{ key: 1, title: "OPQ", status: "Error" },
				{ key: 2, title: "OPQ", status: "Custom" }
			]
		}),
			fnDone = assert.async();

		oGraph.attachGraphReady(function () {
			var $lines = oGraph.$().find(".sapSuiteUiCommonsNetworkGraphLegendLineLabel");

			assert.equal($lines[0].innerText, "Custom", "custom");
			assert.equal($lines[1].innerText, "Error", "error");
			assert.equal($lines[2].innerText, "Standard", "standard");

			oGraph.setCustomLegendLabel({
				status: "Error",
				label: "AError"
			});

			$lines = oGraph.$().find(".sapSuiteUiCommonsNetworkGraphLegendLineLabel");
			var oLegend = document.querySelector(".sapSuiteUiCommonsNetworkGraphLegendColorLine");

			assert.equal($lines[0].innerText, "AError", "Error");
			assert.equal($lines[1].innerText, "Custom", "Custom");
			assert.equal($lines[2].innerText, "Standard", "standard");

			var sColor = Parameters.get({
				name: ["sapContent_ForegroundBorderColor"],
				callback: function(sColor) {
					assert.equal(getComputedStyle(oLegend).borderWidth.slice(0,-2) * 1,0.0625 * 16,"Same width has been applied");
					assert.equal(getComputedStyle(oLegend).borderStyle,"solid","Same style has been applied");
					assert.equal(getComputedStyle(oLegend).borderColor,hexToRgb(sColor),"Same color has been applied");
				   oGraph.destroy();
				   fnDone();
				}
			 });
			 if (sColor) {
				assert.equal(getComputedStyle(oLegend).borderWidth.slice(0,-2) * 1,0.0625 * 16,"Same width has been applied");
				assert.equal(getComputedStyle(oLegend).borderStyle,"solid","Same style has been applied");
				assert.equal(getComputedStyle( oLegend).borderColor,hexToRgb(sColor),"Same color has been applied");
				oGraph.destroy();
				fnDone();
			 }
		});

		oGraph.placeAt("content");
		await nextUIUpdate();
	});

	QUnit.test("toggle fullscreen tests", async function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
			nodes: [
				{ key: 0, title: "ABC" }
			]
		}),
			fnDone = assert.async();

		assert.expect(5);

		oGraph.attachGraphReady(function () {

			assert.equal(oGraph.isFullScreen(), false, "fullscreen is off");
			oGraph.toggleFullScreen();
			assert.equal(oGraph.isFullScreen(), true, "fullscreen is on");
			assert.ok(!oGraph._oFullScreenDialog.getVerticalScrolling(), "Dialog's vertical scrolling is off");
			assert.ok(!oGraph._oFullScreenDialog.getHorizontalScrolling(), "Dialog's horizontal scrolling is off");
			oGraph.toggleFullScreen();
			assert.equal(oGraph.isFullScreen(), false, "fullscreen is off");

			oGraph.destroy();
			fnDone();
		});

		oGraph.placeAt("content");
		await nextUIUpdate();
	});


	var fnFireMouseWheel = function (oGraph, iDelta) {
		var event = jQuery.Event("wheel", {
			originalEvent: {
				deltaY: iDelta,
				clientX: 500,
				clientY: 500
			}
		});
		oGraph.$scroller.trigger(event);
	};

	QUnit.test("Zooming allowed", async function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
			nodes: [
				{ key: 0, title: "ABC" }
			]
		}),
			fnDone = assert.async();

		assert.expect(5);

		var fnFireEvent = function (iDelta) {
			fnFireMouseWheel(oGraph, iDelta);
		};
		oGraph.setProperty('_smoothWheelZoom', 0);
		oGraph.attachGraphReady(function () {
			fnFireEvent(-1);
			assert.equal(oGraph._fZoomLevel, 1.1, "Zoom out");
			fnFireEvent(-1);
			assert.equal(oGraph._fZoomLevel, 1.25, "Zoom out");
			fnFireEvent(-1);
			assert.equal(oGraph._fZoomLevel, 1.5, "Zoom out");
			fnFireEvent(1);
			fnFireEvent(1);
			fnFireEvent(1);
			fnFireEvent(1);
			assert.equal(oGraph._fZoomLevel, 0.9, "Zoom in");
			fnFireEvent(1);
			assert.equal(oGraph._fZoomLevel, 0.8, "Zoom in");
			oGraph.destroy();
			fnDone();
		});

		oGraph.placeAt("content");
		await nextUIUpdate();
	});

	QUnit.test("Zooming not allowed", async function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
			nodes: [
				{ key: 0, title: "ABC" }
			]
		}),
			fnDone = assert.async();

		oGraph.setEnableZoom(false);

		assert.expect(2);

		var fnFireEvent = function (iDelta) {
			fnFireMouseWheel(oGraph, iDelta);
		};

		oGraph.attachGraphReady(function () {
			fnFireEvent(-1);
			assert.equal(oGraph._fZoomLevel, 1, "Zoom out");
			fnFireEvent(1);
			assert.equal(oGraph._fZoomLevel, 1, "Zoom int");
			oGraph.destroy();
			fnDone();
		});

		oGraph.placeAt("content");
		await nextUIUpdate();
	});

	QUnit.test("Zooming with ctrl", async function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
			nodes: [
				{ key: 0, title: "ABC" }
			]
		}),
			fnDone = assert.async();

		oGraph.setEnableWheelZoom(false);
		oGraph.setProperty('_smoothWheelZoom', 0);

		assert.expect(5);

		var fnFireEvent = function (iDelta) {
			fnFireMouseWheel(oGraph, iDelta);
		};

		var fnFireWithCtrl = function (iDelta) {
			var event = jQuery.Event("wheel", {
				ctrlKey: true,
				originalEvent: {
					deltaY: iDelta,
					clientX: 500,
					clientY: 500
				}
			});
			oGraph.$scroller.trigger(event);

		};

		oGraph.attachGraphReady(function () {
			fnFireEvent(-1);
			assert.equal(oGraph._fZoomLevel, 1, "Zoom out");
			fnFireEvent(1);
			assert.equal(oGraph._fZoomLevel, 1, "Zoom in");
			fnFireWithCtrl(-1);
			assert.equal(oGraph._fZoomLevel, 1.1, "Zoom out");
			fnFireWithCtrl(1);
			assert.equal(oGraph._fZoomLevel, 1, "Zoom in");
			fnFireWithCtrl(1);
			assert.equal(oGraph._fZoomLevel, 0.9, "Zoom in");

			oGraph.destroy();
			fnDone();
		});

		oGraph.placeAt("content");
		await nextUIUpdate();
	});

	QUnit.test("No Data", async function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
			nodes: [
				{ key: 0, title: "ABC" }
			]
		}),
			fnDone = assert.async();

		assert.expect(2);
		oGraph.setNoData(true);
		oGraph.setNoDataText("Test");

		oGraph.attachGraphReady(function () {
			assert.equal(oGraph.$().find(".sapSuiteUiCommonsNetworkGraphNoDataWrapper").length, 1, "No data is rendered");
			assert.equal(oGraph.$().find(".sapSuiteUiCommonsNetworkGraphNoDataLabel").text(), "Test", "Text");

			oGraph.destroy();
			fnDone();
		});

		oGraph.placeAt("content");
		await nextUIUpdate();
	});

	QUnit.test("Disable Toolbar buttons", async function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
			nodes: [
				{ key: 0, title: "ABC" }
			]
		}),
			fnDone = assert.async();

		assert.expect(2);
		oGraph.setNoData(true);
		// disabling the toolbar buttons
		oGraph.setDisableToolbarButtons(false);

		oGraph.attachGraphReady(function () {
			assert.equal(oGraph.$().find(".sapSuiteUiCommonsNetworkGraphNoDataWrapper").length, 1, "No data is rendered");
			assert.equal(oGraph._toolbar.getEnabled(), false, "Toolbar is disabled");
			oGraph.destroy();
			fnDone();
		});

		oGraph.placeAt("content");
		await nextUIUpdate();
	});

	QUnit.test("Max width with small size", async function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
			nodes: [
				{
					key: 0,
					title: "test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test ",
					shape: "Box",
					maxWidth: 500
				},
				{
					key: 1,
					titleLineSize: 0,
					title: "test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test testtest test test test test test test test test test test test test test test test test test test test test test test test test test test test test testtest test test test test test test test test test test test test test test test test test test test test test test test test test test test test testtest test test test test test test test test test test test test test test test test test test test test test test test test test test test test testtest test test test test test test test test test test test test test test test test test test test test test test test test test test test test testtest test test test test test test test test test test test test test test test test test test test test test test test test test test test test testtest test test test test test test test test test test test test test test test test test test test test test test test test test test test test testtest test test test test test test test test test test test test test test test test test test test test test test test test test test test test testtest test test test test test test test test test test test test test test test test test test test test test test test test test test test test testtest test test test test test test test test test test test test test test test test test test test test test test test test test test test test testtest test test test test test test test test test test test test test test test test test test test test test test test test test test test test testtest test test test test test test test test test test test test test test test test test test test test test test test test test test test test testtest test test test test test test test test test test test test test test test test test test test test test test test test test test test test testtest test test test test test test test test test test test test test test test test test test test test test test test test test test test test testtest test test test test test test test test test test test test test test test test test test test test test test test test test test test test testtest test test test test test test test test test test test test test test test test test test test test test test test test test test test test test",
					shape: "Box",
					maxWidth: 500
				}
			]
		}),
			fnDone = assert.async();
		oGraph.setWidth("100px");
		oGraph.setHeight("100px");

		assert.expect(4);

		var iState = 0;
		oGraph.attachGraphReady(function () {
			assert.equal(oGraph.getNodes()[0].$().width(), 502, "Max width even when graph is small");
			assert.equal(oGraph.getNodes()[1].$().width(), 502, "Max width even when graph is small");

			if (iState === 0) {
				oGraph.invalidate();
				iState++;
			} else {
				oGraph.destroy();
				fnDone();
			}
		});

		oGraph.placeAt("content");
		await nextUIUpdate();
	});

	QUnit.test("Invalidation", async function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
			nodes: [
				{
					key: 0,
					x: 50,
					y: 50
				}
			]
		}),
			fnDone = assert.async();
		assert.expect(4);
		oGraph.setLayoutAlgorithm(new NoopLayout());

		oGraph.attachGraphReady(async function () {
			var $node = oGraph.getNodes()[0].$();
			assert.equal($node.css("left"), "50px", "Max width even when graph is small");
			assert.equal($node.css("top"), "50px", "Max width even when graph is small");

			oGraph.getNodes()[0].invalidate();
			await nextUIUpdate();

			assert.equal($node.css("left"), "50px", "Max width even when graph is small");
			assert.equal($node.css("top"), "50px", "Max width even when graph is small");

			oGraph.destroy();
			fnDone();
		});

		oGraph.placeAt("content");
		await nextUIUpdate();
	});

	QUnit.test("Accessibility Testing", async function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
			nodes: [
				{
					key: 0,
					title: "Title A",
					status: "Success"
				}
			],
			statuses: [
				{
					key: "Success",
					title: "Success Title"
				}
			]
		}),
			fnDone = assert.async();
		var aNodes = oGraph.getNodes();
		oGraph._selectNode({
			element: aNodes[0]
		});
		assert.expect(10);

		oGraph.attachGraphReady(function () {
			assert.equal(oGraph.$().attr("role"), "graphics-document", "role was rendered successfully for network graph");
			assert.equal(oGraph.$().attr("aria-roledescription"), oResourceBundle.getText("NETWORK_GRAPH_ACCESSIBILITY_LABEL"), "Aria role description was rendered successfully for network graph");
			assert.equal(oGraph.$().attr("aria-description"), oResourceBundle.getText("NETWORK_GRAPH_ACCESSIBILITY_DESCRIPTION"), "Aria description was rendered successfully for network graph");
			assert.equal(oGraph._zoomIn.getAriaDescribedBy()[0], oGraph._oZoomLevelInvisibleText.getId(), "Aria described by for Zoom in button");
			assert.equal(oGraph._zoomOut.getAriaDescribedBy()[0], oGraph._oZoomLevelInvisibleText.getId(), "Aria described by for Zoom out button");

			var oActionButton = oGraph.$().find(".sapSuiteUiCommonsNetworkGraphDivActionButtonBackground")[0],
				sAriaLabelActionButton = oGraph.getNodes()[0]._getActionButtonTitle(oActionButton) + " " + oGraph.getNodes()[0]._oExpandState;
			var sExpectedLabel = "Right Expand/Collapse Action Button Expanded";
			var sNodeLabel = oGraph.getNodes()[0]._getAccessibilityLabel(),
				sExpectedNodeLabel = "Node Title A the status is Success Title Selected.Press spacebar to toggle the state";

			assert.equal(sAriaLabelActionButton, sExpectedLabel, "Aria label for action button contains title information");
			assert.equal(sNodeLabel, sExpectedNodeLabel, "Aria label for Node with status information");
			assert.equal(oGraph.$().find(".sapSuiteUiCommonsNetworkGraphDivGroups").attr("aria-hidden"), "true", "Screen readout used hence for groups aria-hidden set as true");
			assert.equal(oGraph.$().find(".sapSuiteUiCommonsNetworkGraphDivNodes").attr("aria-hidden"), "true", "Screen readout used hence for nodes aria-hidden set as true");
			//de-selecting the node
			oGraph._selectNode({
				element: aNodes[0]
			});
			sExpectedNodeLabel = "Node Title A the status is Success Title.Press spacebar to toggle the state";
			sNodeLabel = oGraph.getNodes()[0]._getAccessibilityLabel();
			assert.equal(sNodeLabel, sExpectedNodeLabel, "Aria label for Node with status information");
			oGraph.destroy();
			fnDone();
		});
		oGraph.placeAt("content");
		await nextUIUpdate();
	});

	QUnit.test("Accessibility Testing: Test aria value for Action Button", async function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
			nodes: [
				{
					key: 0,
					title: "Title A",
					status: "Success",
					showExpandButton: true,
					actionButtons: [{
						title: "Test"
					}
					]
				}
			],
			statuses: [
				{
					key: "Success",
					title: "Success Title"
				}
			]
		}, null, false, false, true),
			fnDone = assert.async();
		var aNodes = oGraph.getNodes();
		oGraph._selectNode({
			element: aNodes[0]
		});

		oGraph.attachGraphReady(function () {
			var aActionButton = oGraph.$().find(".sapSuiteUiCommonsNetworkGraphDivActionButtonBackground");
			for (let index = 0; index < 2; index++) {
				var sAriaLabelActionButton = oGraph.getNodes()[0]._getActionButtonTitle(aActionButton[index]) + " " + oGraph.getNodes()[0]._oExpandState;
				var sExpectedLabel = "";
				sExpectedLabel = index == 0
					? oResourceBundle.getText("NETWORK_GRAPH_ACCESSIBILITY_ACTION_BUTTONS_LEFT") + " "  + oGraph.getNodes()[0].getActionButtons()[0].getTitle()
					+ " " + oResourceBundle.getText("NETWORK_GRAPH_ACCESSIBILITY_ACTION_BUTTON") + " "  + oResourceBundle.getText("NETWORK_GRAPH_EXPANDED")
					: oResourceBundle.getText("NETWORK_GRAPH_ACCESSIBILITY_ACTION_BUTTONS_RIGHT") + " " + oResourceBundle.getText("NETWORK_GRAPH_EXPAND_COLLAPSE")
					+ " " + oResourceBundle.getText("NETWORK_GRAPH_ACCESSIBILITY_ACTION_BUTTON")  + " " + oResourceBundle.getText("NETWORK_GRAPH_EXPANDED");
				assert.equal(sAriaLabelActionButton, sExpectedLabel, "Aria label for action button contains title information");
			}
			oGraph.destroy();
			fnDone();
		});
		oGraph.placeAt("content");
		await nextUIUpdate();
	});

	QUnit.test("Ensure Full screen Open/Close and Exit destroys fullscreen instance", async function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
			nodes: [
				{ key: 0, title: "ABC" }
			]
		}),
			fnDone = assert.async();
		oGraph.attachGraphReady(function () {
			assert.equal(oGraph.isFullScreen(), false, "fullscreen is off");
			oGraph.toggleFullScreen();
			assert.equal(oGraph.isFullScreen(), true, "fullscreen is on");
			oGraph.toggleFullScreen();
			assert.equal(oGraph.isFullScreen(), false, "fullscreen is off");
			sinon.stub(oGraph._oFullScreenUtil, "cleanUpFullScreen");
			oGraph.exit();
			assert.ok(oGraph._oFullScreenUtil.cleanUpFullScreen.calledOnce);
			fnDone();
		});
		oGraph.placeAt("content");
		await nextUIUpdate();
	});

	QUnit.test("Legend Click", async function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
			nodes: [
				{ key: 0, title: "ABC" },
				{ key: 1, title: "OPQ", group: "A" },
				{ key: 2, title: "XYZ" }
			],
			lines: [
				{ from: 0, to: 1, title: "0-1" },
				{ from: 2, to: 1, title: "2-1" },
				{ from: 0, to: 2, title: "0-2" }
			],
			groups: [
				{ key: "A", title: "GHI" }
			]
		}),
			fnDone = assert.async();

		var istate = 0;
		oGraph.attachGraphReady(function () {
			if (istate == 0) {
				assert.equal(oGraph.getDomRef("legend").style.display, "none", "Legends Details is Hidden");
				Element.getElementById(this.getId() + "-legendButton").firePress({ pressed: true });
				Element.getElementById(this.getId() + "-legendButton").setPressed(true);
				istate++;
				oGraph.rerender();
			} else if (istate == 1) {
				assert.equal(oGraph.getDomRef("legend").style.display, "block", "Legends Details is Visible");
				Element.getElementById(this.getId() + "-legendButton").setPressed(false);
				istate++;
				oGraph.rerender();
			} else if (istate == 2) {
				assert.equal(oGraph.getDomRef("legend").style.display, "none", "Legends Details is Hidden");
				istate++;
				oGraph.rerender();
			} else if (istate == 3) {
				oGraph.destroy();
				fnDone();
			}
		});
		oGraph.placeAt("content");
		await nextUIUpdate();
	});

	QUnit.test("SwimLaneLayout - collapsed Group for Orientation Languages", async function (assert) {
		var aOrientationLanguage = ["en", "ja", "zh-TW", "zh-CN", "ko"]; // Orientation Languages
		var sCurrentLanguage = Localization.getLanguage();
		var oGraph = GraphTestUtils.buildGraph({
			nodes: [
				{ key: 0, title: "Node1", group: "A" },
				{ key: 1, title: "Node2", group: "A" },
				{ key: 2, title: "Node3", group: "B" },
				{ key: 3, title: "Node4", group: "C" }
			],
			lines: [
				{ from: 0, to: 1, title: "0-1" },
				{ from: 2, to: 1, title: "2-1" },
				{ from: 0, to: 2, title: "0-2" },
				{ from: 2, to: 3, title: "0-2" }
			],
			groups: [
				{ key: "A", title: "Group1", collapsed: true },
				{ key: "B", title: "Group2" },
				{ key: "C", title: "Group3" }
			]
		}),
			fnDone = assert.async();
		oGraph.setLayoutAlgorithm(new SwimLaneChainLayout());
		var iState = 0;
		oGraph.attachGraphReady(function () {
			var sStyle = oGraph.getDomRef().querySelectorAll(".sapSuiteUiCommonsNetworkGroupHeaderTitle")[0].getAttribute("style");
			if (iState == aOrientationLanguage.length - 1) {
				oGraph.destroy();
				Localization.setLanguage(sCurrentLanguage);
				fnDone();
			} else if (iState == 0) {
				assert.equal(sStyle, null, "No Text Orientation added for English.");
				iState++;
				Localization.setLanguage(aOrientationLanguage[iState]);
			} else {
				assert.ok(sStyle.indexOf("text-orientation") > -1, "Text Orientation added for Orientation Language: " + aOrientationLanguage[iState]);
				iState++;
				Localization.setLanguage(aOrientationLanguage[iState]);
			}
		});
		oGraph.placeAt("content");
		await nextUIUpdate();
	});

	QUnit.test("SwimLaneLayout - collapsed Group for Orientation Languages with Custom Status", async function (assert) {
		var aOrientationLanguage = ["en", "ja", "zh-TW", "zh-CN", "ko"]; // Orientation Languages
		var sCurrentLanguage = Localization.getLanguage();
		var oGraph = GraphTestUtils.buildGraph({
			statuses: [{ key: "Custom", "contentColor": "red" }],
			nodes: [
				{ key: 0, title: "Node1", group: "A" },
				{ key: 1, title: "Node2", group: "A" },
				{ key: 2, title: "Node3", group: "B" },
				{ key: 3, title: "Node4", group: "C" }
			],
			lines: [
				{ from: 0, to: 1, title: "0-1" },
				{ from: 2, to: 1, title: "2-1" },
				{ from: 0, to: 2, title: "0-2" },
				{ from: 2, to: 3, title: "0-2" }
			],
			groups: [
				{ key: "A", title: "Group1", collapsed: true, status: "Custom" },
				{ key: "B", title: "Group2" },
				{ key: "C", title: "Group3" }
			]
		}),
			fnDone = assert.async();
		oGraph.setLayoutAlgorithm(new SwimLaneChainLayout());
		var iState = 0;
		oGraph.attachGraphReady(function () {
			var sStyle = oGraph.getDomRef().querySelectorAll(".sapSuiteUiCommonsNetworkGroupHeaderTitle")[0].getAttribute("style");
			if (iState == aOrientationLanguage.length - 1) {
				oGraph.destroy();
				Localization.setLanguage(sCurrentLanguage);
				fnDone();
			} else if (iState == 0) {
				assert.ok(sStyle.indexOf("text-orientation") == -1, "No Text Orientation added for English.");
				assert.ok(sStyle.indexOf("red") > -1, "Custom Status color red has been added to Header Title.");
				iState++;
				Localization.setLanguage(aOrientationLanguage[iState]);
			} else {
				assert.ok(sStyle.indexOf("red") > -1, "Custom Status color red has been added to Header Title.");
				assert.ok(sStyle.indexOf("text-orientation") > -1, "Text Orientation added for Orientation Language: " + aOrientationLanguage[iState]);
				iState++;
				Localization.setLanguage(aOrientationLanguage[iState]);
			}
		});
		oGraph.placeAt("content");
		await nextUIUpdate();
	});

	QUnit.test("Graph should adapt to the new zoom level when it is rerendered", async function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
			nodes: [
				{
					key: 0,
					title: "Title A",
					status: "Success"
				}
			],
			statuses: [
				{
					key: "Success",
					title: "Success Title"
				}
			]
		}),
			fnDone = assert.async();
		assert.expect(2);
		oGraph._fZoomLevel = 0.33; //setting the zoom level to 33%

		oGraph.attachGraphReady(function () {
			assert.equal(oGraph.$svg.width(), oGraph.$background.width(), "Width of the svg is same as the background div");
			assert.equal(oGraph.$svg.height(), oGraph.$background.height(), "Height of the svg is same as the background div");
			oGraph.destroy();
			fnDone();
		});
		oGraph.placeAt("content");
		await nextUIUpdate();
	});

	QUnit.module("Validate colors.", {
		beforeEach: function () {
			this.sOriginalTheme = Theming.getTheme();
			this.sRequiredTheme = null;
			this.applyTheme = function (sTheme, fnCallBack) {
				var fnThemeApplied = (oEvent) => {
					Theming.detachApplied(fnThemeApplied.bind(this));
					if (typeof fnCallBack === "function") {
						fnCallBack.bind(this)();
						fnCallBack = undefined;
					}
				};
				Theming.setTheme(sTheme);
				Theming.attachApplied(fnThemeApplied.bind(this));
			};
		},
		afterEach: function (assert) {
			var done = assert.async();
			this.applyTheme(this.sOriginalTheme, done);
		},
		createGraph: function () {
			this.oGraph = GraphTestUtils.buildGraph({
				nodes: [
					{ key: "A", title: "Zero", shape: "Box", group: "A", status: "Success" },
					{ key: "B", title: "One", shape: "Box", group: "B", status: "Warning" },
					{ key: "C", title: "Two", shape: "Box", group: "C", status: "Error" },
					{ key: "D", title: "Three", shape: "Box", group: "D", status: "Information" },
					{ key: "E", title: "Four", shape: "Box", group: "E", status: "Neutral" }
				],
				groups: [
					{ key: "A", status: "Success", title: "A" },
					{ key: "B", status: "Warning", title: "B" },
					{ key: "C", status: "Error", title: "C" },
					{ key: "D", status: "Information", title: "D" },
					{ key: "E", status: "Neutral", title: "E" }
				]
			});
		},
		applyColorAsserts: function (assert, oGraphDomRef, oKey, sBorderColor, sBackgroundColor, isGroup) {
			var oGraphHeaderDomRef = isGroup ? oGraphDomRef.querySelector(".sapSuiteUiCommonsNetworkGroupHeader") : oGraphDomRef,
				oGraphBoderColor = window.getComputedStyle(oGraphDomRef).borderColor,
				oGraphHeaderBoderColor = window.getComputedStyle(oGraphHeaderDomRef).borderColor,
				oGraphHeaderBackgroundColor = window.getComputedStyle(oGraphHeaderDomRef).backgroundColor,
				oParamBorderColor = Parameters.get(sBorderColor),
				oHexParamBorderColor = hexToRgb(oParamBorderColor),
				oParamBackgroundColor = Parameters.get(sBackgroundColor),
				oHexParamBackgroundColor = hexToRgb(oParamBackgroundColor);

			if (oHexParamBorderColor != oParamBorderColor) {
				assert.ok(oGraphBoderColor.indexOf(oHexParamBorderColor) >= 0, "Header:" + oKey + " DOM Border Colors are set correctly");
				assert.ok(oGraphHeaderBoderColor.indexOf(oHexParamBorderColor) >= 0, "Header:" + oKey + " Header DOM Border Colors are set correctly");
			}

			if (oHexParamBackgroundColor != oParamBackgroundColor) {
				assert.ok(oGraphHeaderBackgroundColor.indexOf(oHexParamBackgroundColor) >= 0, "Header:" + oKey + " Header DOM BackgroundColors are set correctly");
			}
		},
		applyGraphReady: function (fnDone, assert, isGroup) {
			var onGraphReady = function () {
				var aGraphElement = isGroup ? this.oGraph.getGroups() : this.oGraph.getNodes();
				for (var i = 0; i < aGraphElement.length; i++) {
					var oKey = aGraphElement[i].getKey(),
						oGraphDomRef = isGroup ? aGraphElement[i].getDomRef() : aGraphElement[i].getDomRef("header");
					switch (oKey) {
						case "A":
							this.applyColorAsserts(assert, oGraphDomRef, oKey, "sapSuccessBorderColor", "sapSuccessBackground", isGroup);
							break;
						case "B":
							this.applyColorAsserts(assert, oGraphDomRef, oKey, "sapWarningBorderColor", "sapWarningBackground", isGroup);
							break;
						case "C":
							this.applyColorAsserts(assert, oGraphDomRef, oKey, "sapErrorBorderColor", "sapErrorBackground", isGroup);
							break;
						case "D":
							this.applyColorAsserts(assert, oGraphDomRef, oKey, "sapInformationBorderColor", "sapInformationBackground", isGroup);
							break;
						default:
							this.applyColorAsserts(assert, oGraphDomRef, oKey, "sapNeutralBorderColor", "sapNeutralBackground", isGroup);
							break;
					}
				}
				this.oGraph.detachGraphReady(onGraphReady); // Detach the event listener
				fnDone(); // Call done callback once all asserts are applied
			}.bind(this);

			this.oGraph.attachGraphReady(onGraphReady); // Attach the event listener
		}
	});

	QUnit.test("Node Headers in HCB Theme", async function (assert) {
		var fnDone = assert.async();
		this.createGraph();
		this.applyGraphReady(fnDone, assert, false);
		this.oGraph.placeAt("content");
		await nextUIUpdate();
	});

	QUnit.test("Node Headers in HCW Theme", async function (assert) {
		var fnDone = assert.async();
		this.createGraph();
		this.applyGraphReady(fnDone, assert, false);
		this.oGraph.placeAt("content");
		await nextUIUpdate();
	});

	QUnit.test("Node Headers in Horizon Theme", async function (assert) {
		var fnDone = assert.async();
		this.createGraph();
		this.applyGraphReady(fnDone, assert, false);
		this.oGraph.placeAt("content");
		await nextUIUpdate();
	});

	QUnit.test("Group Headers in sap_horizon Theme", function (assert) {
		var done = assert.async();
		this.applyTheme("sap_horizon", async function () {
			this.createGraph();
			this.applyGraphReady(done, assert, true);
			this.oGraph.placeAt("content");
			await nextUIUpdate();
		});
	});

	QUnit.test("Node Headers selected states in Horizon Theme", function (assert) {
		var done = assert.async();
		this.applyTheme("sap_horizon", async function () {
			var oGraph = GraphTestUtils.buildGraph({
				nodes: [
					{ key: 0, title: "Zero", shape: "Box", group: "A" },
					{ key: 1, title: "One", shape: "Box", group: "A" },
					{ key: 2, title: "Two", shape: "Box", group: "B" }
				],
				lines: [
					{ from: 0, to: 1 }, { from: 0, to: 2 }, { from: 1, to: 2 }
				],
				groups: [
					{ key: "A" }, { key: "B" }
				]
			});
			oGraph.setLayoutAlgorithm(new SwimLaneChainLayout());

			oGraph.attachEvent("graphReady", function () {
				var aNodes = oGraph.getNodes(),
					oNode = aNodes[0];

				oNode._onClick();
				fnBoxCheckColors(assert, oNode, {
					headerContent: horizon_Color.Header,
					background: horizon_Color.SelectedBgColor,
					border: horizon_Color.Selected_Border
				}, "Selected");

				oNode.getParent().deselect();

				oNode = aNodes[1];

				oNode._mouseOver();
				fnBoxCheckColors(assert, oNode, {
					headerContent: horizon_Color.Hover_Header,
					background: horizon_Color.DefaultHoverBg,
					border: horizon_Color.DefaultHoverBorder
				}, "Hover");

				oNode._mouseOut();

				oNode._mouseOver();
				oNode._onClick();

				fnBoxCheckColors(assert, oNode, {
					headerContent: horizon_Color.DefaultSelectedColor,
					background: horizon_Color.SelectedHoverBgColor,
					border: horizon_Color.DefaultSelectedBorderColor
				}, "SelectedHover");

				oNode.getParent().deselect();
				oNode._mouseOut();


				fnBoxCheckColors(assert, oNode, {
					headerContent: horizon_Color.Header,
					background: horizon_Color.Background,
					border: horizon_Color.Border
				}, "Default");
				oGraph.destroy();
			});

			oGraph.placeAt("content");
			await nextUIUpdate();
			done();
		});
	});

	QUnit.module("Accessibility Tests");

	QUnit.test("Test Accessibility Title for Group", async function (assert) {
		var done = assert.async(),
			oGraph = GraphTestUtils.buildGraph({
				nodes: [
					{ key: 0, title: "Zero", shape: "Box", group: "A" },
					{ key: 1, title: "One", shape: "Box", group: "A" },
					{ key: 2, title: "Two", shape: "Box", group: "B" }
				],
				lines: [
					{ from: 0, to: 1 }, { from: 0, to: 2 }, { from: 1, to: 2 }
				],
				groups: [
					{ key: "A", title: "GroupA" }, { key: "B" }
				]
			});
		oGraph.getGroups()[0].setHeaderCheckBoxState("Unchecked");
		oGraph.setLayoutAlgorithm(new SwimLaneChainLayout());

		oGraph.attachGraphReady(function () {
			var oFocus, oGroup;
			oGroup = oGraph.getGroups();
			oGraph.setFocus({ item: oGroup[0] });
			oFocus = oGraph.getFocus();
			assert.equal(oFocus.item, oGroup[0], "The focus should be shifted to Group Detail for Group 1.");
			assert.equal(oFocus.groupInFocused, true, "The focus should be on full Group.");
			assert.equal(oFocus.button, undefined, "The Focus shouldn't be on the Menu Butotn.");
			assert.equal(oGraph.getDomRef("accessibility").innerHTML, "Group GroupA", "Accessibility Title has been set correctly.");
			oGraph.setFocus({ item: oGroup[1] });
			oFocus = oGraph.getFocus();
			assert.equal(oFocus.item, oGroup[1], "The focus should be shifted to Group Detail for Group 2.");
			assert.equal(oFocus.button, "menu", "The Focus should be on the Menu Butotn.");
			assert.equal(oGraph.getDomRef("accessibility").innerHTML, "Group Detail Action Button", "Accessibility Title has been set correctly.");
			assert.equal(oGraph.getGroups()[0].$().find(".sapSuiteUiCommonsNetworkGraphHeaderCheckboxInner").attr('aria-label'), "GroupA", "Accessibility aria-label for group checkbox");
			done();
		});
		oGraph.placeAt("content");
		await nextUIUpdate();
	});
	QUnit.test("Test if the Accesibility is changing if its moving away from the Network Graph", async function (assert) {
		var done = assert.async(),
			oGraph = GraphTestUtils.buildGraph({
				nodes: [
					{ key: 0, title: "Zero", shape: "Box", group: "A" },
					{ key: 1, title: "One", shape: "Box", group: "A" },
					{ key: 2, title: "Two", shape: "Box", group: "B" }
				],
				lines: [
					{ from: 0, to: 1 }, { from: 0, to: 2 }, { from: 1, to: 2 }
				],
				groups: [
					{ key: "A", title: "GroupA" }, { key: "B" }
				]
			}),
			fnDone = assert.async();
		oGraph.attachGraphReady(function () {
			var oFocus = { item: null, button: null };
			oGraph._updateAccessibility(oFocus);
			assert.equal(oGraph.getDomRef("accessibility").innerHTML, " ", "Accessibility Title has been set to default correctly.");
			fnDone();
		});
		oGraph.placeAt("content");
		await nextUIUpdate();
		done();
	});

	QUnit.test("Test if the new focus styles are applied in the Network Graph", function (assert) {
		var done = assert.async(),
			oGraph = GraphTestUtils.buildGraph({
				nodes: [
					{key: 0, title: "Zero", shape: "Box", group: "A"},
					{key: 1, title: "One", shape: "Box", group: "A"},
					{key: 2, title: "Two", shape: "Box", group: "B"}
				],
				lines: [
					{from: 0, to: 1}, {from: 0, to: 2}, {from: 1, to: 2}
				],
				groups: [
					{key: "A", title: "GroupA"}, {key: "B"}
				]
			}),
		fnDone = assert.async();
		oGraph.attachGraphReady(function () {
			simulateCssEvent(":focus");
			var mParameters = Parameters.get({
				name: ["sapUiContentFocusWidth", "sapUiContentFocusStyle", "sapUiContentFocusColor"],
				callback: function(mParams) {
					var {sapUiContentFocusWidth,sapUiContentFocusStyle,sapUiContentFocusColor} = mParams;
					assert.equal(getComputedStyle(oGraph.getDomRef("wrapper")).outlineWidth.slice(0,-2) * 1,sapUiContentFocusWidth.slice(0,-3) * 16,"Same width has been applied");
					assert.equal(getComputedStyle(oGraph.getDomRef("wrapper")).outlineStyle,sapUiContentFocusStyle,"Same style has been applied");
					assert.equal(getComputedStyle(oGraph.getDomRef("wrapper")).outlineColor,hexToRgb(sapUiContentFocusColor),"Same color has been applied");
				   simulateCssEvent("stop");
				   fnDone();
				}
			 });
			 if (mParameters) {
				var {sapUiContentFocusWidth,sapUiContentFocusStyle,sapUiContentFocusColor} = mParameters;
				assert.equal(getComputedStyle(oGraph.getDomRef("wrapper")).outlineWidth.slice(0,-2) * 1,sapUiContentFocusWidth.slice(0,-3) * 16,"Same width has been applied");
				assert.equal(getComputedStyle(oGraph.getDomRef("wrapper")).outlineStyle,sapUiContentFocusStyle,"Same style has been applied");
				assert.equal(getComputedStyle( oGraph.getDomRef("wrapper")).outlineColor,hexToRgb(sapUiContentFocusColor),"Same color has been applied");
				simulateCssEvent("stop");
				fnDone();
			 }
		});
		oGraph.placeAt("content");
		Core.applyChanges();
		done();
	});

	QUnit.test("Test Accessibility for SVG's", async function (assert) {
		var done = assert.async(),
			oGraph = GraphTestUtils.buildGraph({
				nodes: [
					{ key: 0, title: "Zero", shape: "Box", group: "A" },
					{ key: 1, title: "One", shape: "Box", group: "A" },
					{ key: 2, title: "Two", shape: "Box", group: "B" }
				],
				lines: [
					{ from: 0, to: 1 }, { from: 0, to: 2 }, { from: 1, to: 2 }
				],
				groups: [
					{ key: "A", title: "GroupA" }, { key: "B" }
				]
			});

		oGraph.attachGraphReady(function () {
			assert.equal(oGraph.getDomRef().querySelector(".sapSuiteUiCommonsNetworkGraphSvg").getAttribute("aria-label"),oResourceBundle.getText("NETWORK_GRAPH_SVG_ACCESSIBILITY_LABEL") ,"Correct aria-label is set.");
			oGraph.destroy();
			done();
		});
		oGraph.placeAt("content");
		await nextUIUpdate();
	});
});

function simulateCssEvent(type){
	var id = 'simulatedStyle';
	var generateEvent = function(selector){
		var style = "";
		for (var i in document.styleSheets) {
			var rules = document.styleSheets[i].cssRules;
			for (var r in rules) {
				if (rules[r].cssText && rules[r].selectorText){
					if (rules[r].selectorText.indexOf(selector) > -1){
						var regex = new RegExp(selector,"g");
						var text = rules[r].cssText.replace(regex,"");
						style += text + "\n";
					}
				}
			}
		}
		document.querySelector("head").insertAdjacentHTML("beforeend","<style id=" + id + ">" + style + "</style>");
	};
	var stopEvent = function(){
		document.querySelector("#" + id).remove();
	};
	if (type === "stop") {
		return stopEvent();
	} else {
		return generateEvent(type);
	}
}