sap.ui.define([
	"./TestUtils",
	"jquery.sap.global",
	"sap/m/Link",
	"sap/ui/core/Popup",
	"sap/suite/ui/commons/networkgraph/ActionButton",
	"sap/suite/ui/commons/networkgraph/SvgBase",
	"sap/suite/ui/commons/networkgraph/Node",
	"sap/ui/core/IconPool",
	"sap/suite/ui/commons/networkgraph/Graph",
	"sap/suite/ui/commons/networkgraph/ElementAttribute",
	"sap/ui/model/json/JSONModel",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/ui/qunit/utils/nextUIUpdate"
], function (GraphTestUtils, jQuery, Link, Popup, ActionButton, SvgBase, Node, IconPool, Graph, ElementAttribute, JSONModel, createAndAppendDiv, nextUIUpdate) {
	"use strict";

	var styleElement = document.createElement("style");
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

	QUnit.module("Network graph nodes");

	QUnit.test("Node events [press, collapseExpand] are fired correctly.", async function (assert) {
		var oGraph = GraphTestUtils.buildGraph(
			{
				nodes: [
					{key: 0},
					{key: 1}
				],
				lines: [
					{
						from: 0,
						to: 1
					}
				]
			}),
			oNode0 = oGraph.getNodes()[0],
			fnPressDone = assert.async(),
			fnCollapseExpandDone = assert.async(),
			fnGraphReadyDone = assert.async();

		assert.expect(2);
		oGraph.attachGraphReady(async function () {
			jQuery(oNode0.getFocusDomRef()).trigger({
                type: 'click',
                which: 1
            });
			await nextUIUpdate();
			oNode0.$("actionCollapse").children().click();
			fnGraphReadyDone();
		});
		oNode0.attachPress(function () {
			assert.ok(true, "Press event should fire correctly.");
			fnPressDone();
		});
		oNode0.attachCollapseExpand(function () {
			assert.ok(true, "CollapseExpand event should fire correctly");
			fnCollapseExpandDone();
			oGraph.destroy();
		});

		oGraph.placeAt("content");
		await nextUIUpdate();
	});

	// Action buttons

	async function performeActionButtonTest(mOptions) {
		var oGraph, oNode0,
			assert = mOptions.assert,
			fnDone = assert.async();

		if (mOptions.fnGraphFactory) {
			oGraph = mOptions.fnGraphFactory();
		} else {
			oGraph = GraphTestUtils.buildGraph(mOptions.oData);
		}
		oNode0 = oGraph.getNodes()[0];
		assert.expect(mOptions.expect);

		oGraph.attachGraphReady(async function () {
			function finish() {
				oGraph.destroy();
				fnDone();
			}

			jQuery(oNode0.getFocusDomRef()).trigger({
                type: 'click',
                which: 1
            });
			await nextUIUpdate();
			var oResult = mOptions.fnCheck(oGraph, oNode0);
			if (oResult && typeof oResult.then === "function") {
				oResult.then(finish);
			} else {
				finish();
			}
		});

		oGraph.placeAt("content");
		await nextUIUpdate();
	}

	QUnit.test("Default action buttons visible.", async function (assert) {
		await performeActionButtonTest({
			fnGraphFactory: function () {
				var oGraph = GraphTestUtils.buildGraph({
					nodes: [
						{
							key: 0,
							description: "description"
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
				});

				oGraph.getNodes()[0].addActionLink(new Link({text: "link"}));
				return oGraph;
			},
			expect: 6,
			assert: assert,
			fnCheck: function (oGraph, oNode) {
				assert.ok(oNode.getDomRef("actionCollapse"), "Collapse button should be rendered.");
				assert.ok(oNode.getDomRef("actionDetail"), "Details button should be rendered.");
				assert.ok(oNode.getDomRef("actionLinks"), "Links button should be rendered.");
				assert.ok(oNode.$("actionButtons").find(".sapSuiteUiCommonsNetworkGraphDivActionButtonDisabled").length === 0, "All action buttons should be enabled.");
				assert.ok(oNode.hasStyleClass("sapMPointer"),"Pointer class is present");
				assert.equal(oNode.getDomRef("actionDetail").querySelectorAll(".sapSuiteUiCommonsNetworkGraphIcon")[0].children[0].innerHTML, IconPool.getIconInfo("sap-icon://menu2").content,"Default Menu Icon 'sap-icon//:menu2'");
			}
		});
	});

	QUnit.test("Action buttons not visible when disabled.", async function (assert) {
		await performeActionButtonTest({
			fnGraphFactory: function () {
				return GraphTestUtils.buildGraph({
					nodes: [
						{
							key: 0,
							showExpandButton: false,
							showActionLinksButton: false,
							showDetailButton: false
						}
					]
				});
			},
			expect: 4,
			assert: assert,
			fnCheck: function (oGraph, oNode) {
				assert.ok(!oNode.getDomRef("actionCollapse"), "Collapse button should not be visible.");
				assert.ok(!oNode.getDomRef("actionDetail"), "Details button should not be visible.");
				assert.ok(!oNode.getDomRef("actionLinks"), "Links button should not be visible.");
				assert.notOk(oNode.hasStyleClass("sapMPointer"),"Pointer class is not present");
			}
		});
	});

	QUnit.test("Collapse/expand button not enabled for nodes without children.", async function (assert) {
		await performeActionButtonTest({
			oData: {
				nodes: [
					{
						key: 0
					}
				]
			},
			expect: 2,
			assert: assert,
			fnCheck: function (oGraph, oNode) {
				var $button = oNode.$("actionCollapse");
				assert.ok($button.length === 1, "Collapse button should be rendered.");
				assert.ok($button.find(".sapSuiteUiCommonsNetworkGraphDivActionButtonDisabled").length > 0, "Collapse button should be disabled.");
			}
		});
	});

	QUnit.test("Details button not enabled for nodes without any detail.", async function (assert) {
		await performeActionButtonTest({
			oData: {
				nodes: [
					{
						key: 0
					}
				]
			},
			expect: 2,
			assert: assert,
			fnCheck: function (oGraph, oNode) {
				var $button = oNode.$("actionDetail");
				assert.ok($button.length === 1, "Detail button should be rendered.");
				assert.ok($button.find(".sapSuiteUiCommonsNetworkGraphDivActionButtonDisabled").length > 0, "Detail button should be disabled.");
			}
		});
	});

	QUnit.test("Details button enabled for nodes with attributes but without detail.", async function (assert) {
		await performeActionButtonTest({
			oData: {
				nodes: [
					{
						key: 0,
						attributes: [
							{
								label: "l",
								value: "v"
							}
						]
					}
				]
			},
			expect: 2,
			assert: assert,
			fnCheck: function (oGraph, oNode) {
				var $button = oNode.$("actionDetail");
				assert.ok($button.length === 1, "Detail button should be rendered.");
				assert.ok($button.find(".sapSuiteUiCommonsNetworkNodeActionButtonDisabled").length === 0, "Detail button should be enabled.");
			}
		});
	});

	QUnit.test("Detail window opens when user clicks on node's detail button.", async function (assert) {
		var openSpy = sinon.spy(Popup.prototype, "open");
		await performeActionButtonTest({
			oData: {
				nodes: [
					{
						key: 0,
						description: "description"
					}
				]
			},
			expect: 1,
			assert: assert,
			fnCheck: function (oGraph, oNode) {
				var $button = oNode.$("actionDetail");
				$button.children().click();
				assert.equal(openSpy.callCount, 1, "Tooltip popup should have been opened.");
				openSpy.restore();
			}
		});
	});

	QUnit.test("Details windows does not shows when user clicks on details button when there are no details.", async function (assert) {
		var openSpy = sinon.spy(Popup.prototype, "open");
		await performeActionButtonTest({
			oData: {
				nodes: [
					{
						key: 0
					}
				]
			},
			expect: 1,
			assert: assert,
			fnCheck: function (oGraph, oNode) {
				var $button = oNode.$("actionDetail");
				$button.children().click();
				assert.equal(openSpy.callCount, 0, "Popup open is not supposed to be called.");
				openSpy.restore();
			}
		});
	});

	QUnit.test("Click on a collapse button collapses a child.", async function (assert) {
		await performeActionButtonTest({
			oData: {
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
			},
			expect: 2,
			assert: assert,
			fnCheck: async function (oGraph, oNode) {
				var $button = oNode.$("actionCollapse"),
					oNode2 = oGraph.getNodes()[1];
				$button.click();
				await nextUIUpdate();
				assert.ok(oNode.getCollapsed(), "Child node should be collapsed.");
				assert.equal(oNode2.$().css("display"), "none", "Child not shouldn't be visible.");
			}
		});
	});

	QUnit.test("Max 4 custom action buttons get rendered.", async function (assert) {
		var aActionButtons = [],
			aPressCallbackResults = [];
		for (var i = 0; i < 10; i++) {
			aActionButtons.push(new ActionButton({
				icon: "sap-icon://sap-ui5",
				press: actionButtonPress
			}));
		}

		function actionButtonPress(oEvent) {
			var oSource = oEvent.getSource();
			for (var i = 0; i < 4; i++) {
				if (oSource === aActionButtons[i]) {
					aPressCallbackResults[i] = true;
				}
			}
		}

		await performeActionButtonTest({
			fnGraphFactory: function () {
				var oNode = new Node({
					key: 0,
					showExpandButton: false,
					showActionLinksButton: false,
					showDetailButton: false,
					actionButtons: aActionButtons
				});

				return new Graph({
					nodes: [oNode],
					renderType: "Svg"
				});
			},
			expect: 6,
			assert: assert,
			fnCheck: function (oGraph, oNode) {
				var $button, i;
				for (i = 0; i < 4; i++) {
					$button = oNode.getActionButtons()[i].$();
					assert.ok($button.get(0), "Action button should be visible.");
					$button.children().click();
				}
				for (i = 0; i < 4; i++) {
					if (!aPressCallbackResults[i]) {
						assert.ok(false, "Action button No. " + i + " wasn't pressed.");
					}
				}
				assert.notOk(aPressCallbackResults[4], "Last button shouldn't be pressed.");
				assert.equal(oNode.$("actionButtons").find("g").length, 8, "8 action buttons are supposed to be rendered.");
			}
		});
	});

	QUnit.test("Cursor Pointer Tests for Action Button", async function (assert) {
		var aActionButtons = [];
		for (var i = 0; i < 1; i++) {
			aActionButtons.push(new ActionButton({
				icon: "sap-icon://sap-ui5"
			}));
		}

		await performeActionButtonTest({
			fnGraphFactory: function () {
				var oNode = new Node({
					key: 0,
					actionButtons: aActionButtons,
					showExpandButton: false,
					showActionLinksButton: false,
					showDetailButton: false
				});

				return new Graph({
					nodes: [oNode]
				});
			},
			expect: 2,
			assert: assert,
			fnCheck: async function (oGraph, oNode) {
				assert.ok(oNode.hasStyleClass("sapMPointer"), "Pointer class has been rendered");
				oNode.getActionButtons()[0].destroy();
				oNode.invalidate();
				await nextUIUpdate();
				assert.notOk(oNode.hasStyleClass("sapMPointer"), "Pointer class has not been rendered");
			}
		});
	});

	QUnit.test("Max 8 action buttons get rendered.", async function (assert) {
		var aActionButtons = [],
			aPressCallbackResults = [];
		for (var i = 0; i < 8; i++) {
			aActionButtons.push(new ActionButton({
				icon: "sap-icon://sap-ui5",
				press: actionButtonPress
			}));
		}

		function actionButtonPress(oEvent) {
			var oSource = oEvent.getSource();
			for (var i = 0; i < 8; i++) {
				if (oSource === aActionButtons[i]) {
					aPressCallbackResults[i] = true;
				}
			}
		}

		await performeActionButtonTest({
			fnGraphFactory: function () {
				var oNode = new Node({
					key: 0,
					actionButtons: aActionButtons
				});

				return new Graph({
					nodes: [oNode],
					renderType: "Svg"
				});
			},
			expect: 5,
			assert: assert,
			fnCheck: function (oGraph, oNode) {
				var $button, i;
				$button = oNode.getActionButtons()[0].$();
				assert.ok($button.get(0), "Action button 0 should be visible.");
				$button.children().click();

				for (i = 6; i < 8; i++) {
					$button = oNode.getActionButtons()[i].$();
					assert.notOk($button.get(0), "Action button shouldn't be visible.");
				}
				assert.ok(aPressCallbackResults[0], "First action button should have been pressed");
				for (i = 1; i < 4; i++) {
					if (aPressCallbackResults[i]) {
						assert.ok(false, "Action button No. " + i + " shouldn't have been pressed.");
					}
				}
				assert.equal(oNode.$("actionButtons").find("g").length, 8, "8 action buttons are supposed to be rendered.");
			}
		});
	});

	QUnit.test("Box nodes with multiline scales better.", async function (assert) {
		var oGraph = GraphTestUtils.buildGraph(
			{
				nodes: [
					{
						key: 0,
						title: "[.......0][.......1] [.......2][.......3] [.......0][.......1] [.......2][.......3]",
						maxWidth: 200
					},
					{
						key: 1,
						title: "[.......0][.......1] [.......2][.......3] [.......0][.......1] [.......2][.......3]",
						titleLineSize: 10,
						maxWidth: 200
					},
					{
						key: 2,
						shape: "Box",
						title: "[.......0][.......1] [.......2][.......3] [.......0][.......1] [.......2][.......3]",
						maxWidth: 200
					},
					{
						key: 3,
						shape: "Box",
						title: "[.......0][.......1] [.......2][.......3] [.......0][.......1] [.......2][.......3]",
						titleLineSize: 10,
						maxWidth: 200
					}
				]
			}),
			oSingleLineNode = oGraph.getNodes()[0],
			oMultiLineNode = oGraph.getNodes()[1],
			fnDone = assert.async(),
			fnAssert = function () {
				assert.ok(oSingleLineNode.$().height() < oMultiLineNode.$().height(), "Multiline title should stretch vertically.");

				// max width for circle nodes
				assert.equal(oSingleLineNode.$().width(), 200, "Width of node");
				assert.equal(oMultiLineNode.$().width(), 200, "Width of node");

				oSingleLineNode = oGraph.getNodes()[2];
				oMultiLineNode = oGraph.getNodes()[3];

				// 2 pixels are borders
				assert.equal(oSingleLineNode.$().width(), 202, "Width of node");
				assert.equal(oMultiLineNode.$().width(), 202, "Width of node");
			};

		assert.expect(5);

		await GraphTestUtils.runAsyncAssert(oGraph, fnAssert, fnDone);
		await nextUIUpdate();
	});

	// Action links

	QUnit.test("Links button not enabled for nodes without any visible links.", async function (assert) {
		await performeActionButtonTest({
			fnGraphFactory: function () {
				var oGraph = GraphTestUtils.buildGraph({
					nodes: [
						{
							key: 0
						}
					]
				});

				var oLink = new Link({text: "link"});
				oLink.setVisible(false);
				oGraph.getNodes()[0].addActionLink(oLink);
				return oGraph;
			},
			expect: 2,
			assert: assert,
			fnCheck: function (oGraph, oNode) {
				var $button = oNode.$("actionLinks");
				assert.ok($button.length === 1, "Links button should be rendered.");
				assert.ok($button.find(".sapSuiteUiCommonsNetworkGraphDivActionButtonDisabled").length > 0, "Links button should be disabled.");
			}
		});
	});

	QUnit.test("Links window shows when user clicks on links button.", async function (assert) {
		var openSpy = sinon.spy(Popup.prototype, "open");
		await performeActionButtonTest({
			fnGraphFactory: function () {
				var oGraph = GraphTestUtils.buildGraph({
					nodes: [
						{
							key: 0
						}
					]
				});

				oGraph.getNodes()[0].addActionLink(new Link({text: "link"}));
				return oGraph;
			},
			expect: 1,
			assert: assert,
			fnCheck: function (oGraph, oNode) {
				var $button = oNode.$("actionLinks");
				$button.children().click();
				assert.equal(openSpy.callCount, 1, "Tooltip popup should have been opened.");
				openSpy.restore();
			}
		});
	});

	QUnit.test("Links window does not show when user clicks on links button when there are no links.", async function (assert) {
		var openSpy = sinon.spy(Popup.prototype, "open");
		await performeActionButtonTest({
			oData: {
				nodes: [
					{
						key: 0
					}
				]
			},
			expect: 1,
			assert: assert,
			fnCheck: function (oGraph, oNode) {
				var $button = oNode.$("actionLinks");
				$button.children().click();
				assert.equal(openSpy.callCount, 0, "Popup open is not supposed to be called.");
				openSpy.restore();
			}
		});
	});

	// multiline
	QUnit.test("Correct multiline calculation.", async function (assert) {
		var oGraph = GraphTestUtils.buildGraph(
			{
				nodes: [
					{
						key: 0,
						title: "TitleA TitleB TitleC TitleD TitleE TitleF TitleG TitleH TitleI TitleJ TitleK",
						titleLineSize: 0,
						width: 140
					},
					{
						key: 1,
						title: "TitleA TitleB TitleC TitleD TitleE TitleF TitleG TitleH TitleI TitleJ TitleK",
						titleLineSize: 2,
						width: 140
					},
					{
						key: 2,
						title: "TitleA TitleB TitleC TitleD TitleE TitleF TitleG TitleH TitleI TitleJ TitleK",
						titleLineSize: 1,
						width: 140
					},
					{
						key: 3,
						title: "TitleATitleBTitleCTitleDTitleETitleFTitleG",
						titleLineSize: 0,
						width: 140
					}
				]
			}),
			fnDone = assert.async(),
			fnAssert = function () {
				var getLines = function (i) {
					var iHeight = oGraph.getNodes()[i].$().find(".sapSuiteUiCommonsNetworkGraphDivNodeTitleText").height / 16;

					if (iHeight < 1.5) {
						return 1;
					}
					if (iHeight < 2.5) {
						return 2;
					}
					if (iHeight < 3.5) {
						return 3;
					}
					if (iHeight < 4.5) {
						return 4;
					}

					return 5;
				};

				assert.ok(getLines(0), 4, "4 lines");
				assert.ok(getLines(1), 2, "2 lines");
				assert.ok(getLines(2), 3, "1 line");
				assert.ok(getLines(3), 1, "1 line");
			};

		assert.expect(4);

		await GraphTestUtils.runAsyncAssert(oGraph, fnAssert, fnDone);
	});

	QUnit.test("Nodes render properly when height and width are set using setter methods", async function (assert) {
		var oGraph = GraphTestUtils.buildGraph(
			{
				nodes: [
					{
						key: 0,
						title: "Title"
					}
				]
			}),
			oNode = oGraph.getNodes()[0],
			fnDone = assert.async(),
			fnAssert = function () {
				oGraph.preventInvalidation(true);
				oNode.setWidth(300);
				oNode.setHeight(300);
				assert.equal(oNode.getWidth(), 300, "Node should have correct width.");
				assert.equal(oNode.getHeight(), 300, "Node should have correct height.");
				oGraph.preventInvalidation(false);
			};

		assert.expect(2);

		await GraphTestUtils.runAsyncAssert(oGraph, fnAssert, fnDone);
	});

	QUnit.test("Test _sanitizeTitleLines", async function(assert) {
		var oGraph = GraphTestUtils.buildGraph(
			{
				nodes: [
					{
						key: 0,
						title: "TitleA TitleB TitleC TitleD TitleE TitleF TitleG TitleH TitleI TitleJ TitleK",
						titleLineSize: 0,
						width: 140
					}
				]
			}),
			fnDone = assert.async(),
			fnAssert = function() {
				var aTitleLines = [
					["TitleA TitleB TitleC TitleD"],
					["TitleE TitleF TitleG TitleH"],
					["TitleI TitleJ TitleK"]
				];
				var aSantizedTitleLines = oGraph.getNodes()[0]._sanitizeTitleLines(aTitleLines);
				var aLine1 = aSantizedTitleLines[0];
				assert.ok(Array.isArray(aLine1), true , "On Santize tile lines are correctly transformed to [][]");
			};

		assert.expect(1);

		await GraphTestUtils.runAsyncAssert(oGraph, fnAssert, fnDone);
	});

	// Width and maxWidth

	QUnit.test("Box nodes respect width property for small content.", async function (assert) {
		var oGraph = GraphTestUtils.buildGraph(
			{
				nodes: [
					{
						key: 0,
						title: "Title",
						width: 300
					}
				]
			}),
			oNode = oGraph.getNodes()[0],
			fnDone = assert.async(),
			fnAssert = function () {
				assert.equal(oNode._iWidth, 300, "Node should have correct width.");
			};

		assert.expect(1);

		await GraphTestUtils.runAsyncAssert(oGraph, fnAssert, fnDone);
	});

	QUnit.test("Box nodes respect width property for big content.", async function (assert) {
		var oGraph = GraphTestUtils.buildGraph(
			{
				nodes: [
					{
						key: 0,
						title: "Title - Very long title Very long title Very long title Very long title Very long title",
						width: 300
					}
				]
			}),
			oNode = oGraph.getNodes()[0],
			fnDone = assert.async(),
			fnAssert = function () {
				var iRealWidth = oNode.$().width();
				assert.equal(oNode._iWidth, 300, "Node should have correct width.");
				assert.ok((iRealWidth > 270 && iRealWidth <= 300), "Node should have correct real width.");
			};

		assert.expect(2);

		await GraphTestUtils.runAsyncAssert(oGraph, fnAssert, fnDone);
	});

	QUnit.test("Box nodes respect maxWidth property for big content.", async function (assert) {
		var oGraph = GraphTestUtils.buildGraph(
			{
				nodes: [
					{
						key: 0,
						title: "Title - Very long title Very long title Very long title Very long title Very long title",
						maxWidth: 300
					}
				]
			}),
			oNode = oGraph.getNodes()[0],
			fnDone = assert.async(),
			fnAssert = function () {
				var iRealWidth = oNode.$().width();
				assert.equal(oNode._iWidth, 300, "Node should have correct width.");
				assert.ok((iRealWidth > 270 && iRealWidth <= 300), "Node should have correct real width.");
			};

		assert.expect(2);

		await GraphTestUtils.runAsyncAssert(oGraph, fnAssert, fnDone);
	});

	QUnit.test("Width has priority over maxWidth.", async function (assert) {
		var oGraph = GraphTestUtils.buildGraph(
			{
				nodes: [
					{
						key: 0,
						title: "Title - Very long title Very long title Very long title",
						maxWidth: 300,
						width: 200
					}
				]
			}),
			oNode = oGraph.getNodes()[0],
			fnDone = assert.async(),
			fnAssert = function () {
				var iRealWidth = oNode.$().width();
				assert.equal(oNode._iWidth, 200, "Node should have correct width.");
				assert.ok((iRealWidth > 170 && iRealWidth <= 200), "Node should have correct real width.");
			};

		assert.expect(2);

		await GraphTestUtils.runAsyncAssert(oGraph, fnAssert, fnDone);
	});

	// Icon

	QUnit.test("An icon gets rendered.", async function (assert) {
		function testIconPresent(oControl) {
			var $icon = oControl.$().find(".sapSuiteUiCommonsNetworkGraphDivNodeCircleIcon span, .sapSuiteUiCommonsNetworkGraphDivNodeIconTitle span");

			assert.ok($icon[0], "An icon should be in the graph.");
			assert.equal($icon[0].innerText.charCodeAt(0), 0xe21b, "Icon should correct one.");
			assert.equal($icon.css("font-family"), "SAP-icons", "Font family rendered.");
		}

		var oGraph = GraphTestUtils.buildGraph(
			{
				nodes: [
					{
						key: 0,
						group: "g1",
						icon: "sap-icon://sap-ui5"
					},
					{
						key: 1,
						icon: "sap-icon://sap-ui5",
						shape: "Box"
					}
				],
				groups: [
					{
						key: "g1",
						icon: "sap-icon://sap-ui5"
					}
				]
			}),
			oCircleNode = oGraph.getNodes()[0],
			oBoxNode = oGraph.getNodes()[1],
			fnDone = assert.async(),
			fnAssert = function () {
				testIconPresent(oCircleNode);
				testIconPresent(oBoxNode);
				// so far group is rendered without icon
				// testIconPresent(oGroup);
			};
		oGraph.setRenderType("Html");

		assert.expect(6);

		await GraphTestUtils.runAsyncAssert(oGraph, fnAssert, fnDone);
	});

	// Attribute

	QUnit.test("An attribute gets rendered, invisible ones are not.", async function (assert) {
		var oGraph = GraphTestUtils.buildGraph(
			{
				nodes: [
					{
						key: 0,
						title: "Title",
						icon: "sap-icon://sap-ui5",
						shape: "Box",
						maxWidth: 200,
						attributes: [
							{
								label: "L1",
								value: "V1",
								visible: false
							},
							{
								label: "L2",
								value: "V2",
								visible: true
							},
							{
								label: "L3",
								value: "V3",
								visible: false
							}
						]
					}
				]
			}),
			oNode = oGraph.getNodes()[0],
			fnDone = assert.async(),
			fnAssert = function () {
				var iRows = oNode.$().find(".sapSuiteUiCommonsNetworkGraphDivNodeAttributesRow").length;
				assert.equal(iRows, 1, "Only one attribute rendered");

				var oAttr = oNode.getVisibleAttributes()[0];

				assert.equal(oAttr.$("label")[0].innerText, "L2", "Correct labels should be rendered.");
				assert.equal(oAttr.$("value")[0].innerText, "V2", "Correct values should be rendered.");
			};

		oGraph.setRenderType("Html");

		assert.expect(3);

		await GraphTestUtils.runAsyncAssert(oGraph, fnAssert, fnDone);
	});

	QUnit.skip("Attributes for nodes with maxWidth are trimmed correctly.", async function (assert) {
		var oGraph = GraphTestUtils.buildGraph(
			{
				nodes: [
					{
						key: 0,
						title: "Title",
						icon: "sap-icon://sap-ui5",
						maxWidth: 200,
						shape: "Box",
						attributes: [
							{
								value: "Very long value Very long value Very long value Very long value"
							}
						]
					}
				]
			}),
			oNode = oGraph.getNodes()[0],
			fnDone = assert.async(),
			fnAssert = function () {
				assert.ok(oNode.getDomRef().getBBox().width <= 100, "Long attribute should be trimmed.");
			};

		assert.expect(1);

		await GraphTestUtils.runAsyncAssert(oGraph, fnAssert, fnDone);
	});

	// Invalidate on node

	QUnit.skip("Invalidate on node rerenders content.", async function (assert) {
		var oGraph = GraphTestUtils.buildGraph(
			{
				nodes: [
					{
						key: 0,
						title: "Title"
					}
				]
			}),
			oNode = oGraph.getNodes()[0],
			fnDone = assert.async(),
			fnAssert = async function () {
				oNode.setTitle("Title 2");
				await nextUIUpdate();
				assert.equal(oNode.$().find("text.sapSuiteUiCommonsNetworkNodeTitle").text(), "Title 2", "Correct title should be rendered.");
			};

		assert.expect(1);

		await GraphTestUtils.runAsyncAssert(oGraph, fnAssert, fnDone);
	});

	QUnit.skip("Invalidate on node rerenders content on IE.", async function (assert) {
		var oStub = sinon.stub(SvgBase.prototype, "_isMSBrowser"),
			oGraph = GraphTestUtils.buildGraph(
				{
					nodes: [
						{
							key: 0,
							title: "Title"
						}
					]
				}),
			oNode = oGraph.getNodes()[0],
			fnDone = assert.async(),
			fnAssert = async function () {
				oNode.setTitle("Title 2");
				await nextUIUpdate();
				assert.equal(oNode.$().find("text.sapSuiteUiCommonsNetworkNodeTitle").text(), "Title 2", "Correct title should be rendered.");
				oStub.restore();
			};

		assert.expect(1);
		oStub.returns(true);

		await GraphTestUtils.runAsyncAssert(oGraph, fnAssert, fnDone);
	});

	QUnit.skip("Invalidate on box node rerenders content on IE.", async function (assert) {
		var oGraph = GraphTestUtils.buildGraph(
			{
				nodes: [
					{
						key: 0,
						title: "Title",
						shape: "Box",
						attributes: [
							{
								label: "L1",
								value: "V1"
							},
							{
								label: "L2",
								value: "V2"
							}
						]
					}
				]
			}),
			oNode = oGraph.getNodes()[0],
			fnDone = assert.async(),
			fnAssert = async function () {
				// dy is ie specific fix so it will differ from other browsers.
				var sOriginalHtml = oNode.$().outerHTML().replace(/(\s)?dy="[^"]*"/, ""),
					oStub = sinon.stub(SvgBase.prototype, "_isMSBrowser");
				oStub.returns(true);
				oNode.invalidate();
				await nextUIUpdate();
				assert.equal(oNode.$().outerHTML().replace(/(\s)?dy="[^"]*"/, ""), sOriginalHtml, "HTML after invalidate shouldn't change.");
				oStub.restore();
			};

		assert.expect(1);

		await GraphTestUtils.runAsyncAssert(oGraph, fnAssert, fnDone);
	});

	QUnit.test("Status is set even without parent graph", function (assert) {
		var sStatus = "testStatus";
		var oNode = new Node({
			key: 0,
			status: sStatus
		});
		assert.notOk(oNode.showActionButtons());
		assert.equal(oNode.getStatus(), sStatus, "Status should be correctly set");
	});

	QUnit.test("Node is rendered correctly when attributes are updated after the graph is rendered", function (assert) {
		var fnDone = assert.async(),
			oModel = new JSONModel({
				nodes: [
					{
						key: 0,
						title: "Test title"
					}
				]
			}),
			oNewData = {
				nodes: [
					{
						attributes: [
							{
								label: "Test label",
								value: "Test value"
							}
						]
					}
				]
			},
			oGraph = new Graph({
				renderType: "Svg",
				nodes: {
					path: "/nodes",
					template: new Node({
						key: "{key}",
						title: "{title}",
						shape: "Box",
						attributes: {
							path: "attributes",
							template: new ElementAttribute({
								label: "{label}",
								value: "{value}"
							})
						}
					})
				}
			}),
			bFirstPass = true,
			iOriginalHeight;

		oGraph.setModel(oModel);
		assert.expect(2);
		oGraph.attachGraphReady(async function () {
			if (bFirstPass) {
				iOriginalHeight = oGraph.getNodes()[0].getDomRef("innerBox").getBoundingClientRect().height;
				oModel.setData(oNewData, true);
				await nextUIUpdate();
				assert.notOk(oGraph.getNodes()[0].getDomRef("innerBox")); //Node should be gone from the dom as invalidate should have been triggered
				bFirstPass = false;
			} else {
				var iNewHeight = oGraph.getNodes()[0].getDomRef("innerBox").getBoundingClientRect().height;
				assert.ok(iOriginalHeight < iNewHeight, "Height after attributes are bound should be bigger. Befor height: " + iOriginalHeight + " after height: " + iNewHeight);
				oGraph.destroy();
				fnDone();
			}
		});
		oGraph.placeAt("content");
	});

	QUnit.test("Node is rendered correctly when in HTML rendering mode.", async function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
				nodes: [
					{key: 0, group: 1}, {key: 1, group: 2}
				],
				lines: [
					{from: 0, to: 1}
				],
				groups: [
					{key: 1}, {key: 2, collapsed: true}
				]
			}),
			fnAssert = function () {
				assert.ok(true, "Node should be rendered correctly.");
			},
			fnDone = assert.async();

		assert.expect(1);
		await GraphTestUtils.runAsyncAssert(oGraph, fnAssert, fnDone);
	});

	QUnit.test("Visibility tests", function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
				nodes: [
					{
						"key": 0,
						"title": "0",
						"icon": "sap-icon://checklist",
						"status": "Error",
						"visible": true
					},
					{
						"key": 1,
						"title": "1",
						"icon": "sap-icon://checklist",
						"status": "Error",
						"visible": false
					},
					{
						"key": 2,
						"title": "2",
						"icon": "sap-icon://checklist",
						"status": "Error",
						"visible": true
					},
					{
						"key": 3,
						"title": "3",
						"icon": "sap-icon://checklist",
						"status": "Error",
						"group": "F"
					}],
				lines: [
					{
						"from": 0,
						"to": 1,
						"visible": false
					},
					{
						"from": 0,
						"to": 1,
						"visible": true
					},
					{
						"from": 2,
						"to": 3
					}
				],
				groups: [
					{
						"key": "F",
						"title": "Farmer",
						"visible": false,
						"collapsed": false
					}
				]
			}),
			fnDone = assert.async();

		oGraph.setRenderType("Html");

		oGraph.placeAt("content");
		assert.expect(11);

		// await GraphTestUtils.runAsyncAssert(oGraph, fnAssert, fnDone);
		oGraph.attachGraphReady(async function () {
			// nodes rendered
			var aNodes = this.getNodes(),
				aLines = this.getLines(),
				aGroups = this.getGroups();
			if (aNodes && aNodes[0] && aNodes[0].$()){
				assert.ok(aNodes[0].$().is(":visible"), "node 0 - visible");
			}
			if (aNodes && aNodes[1] && aNodes[1].$()){
				assert.ok(aNodes[1].$().is(":hidden"), "node 1 - hidden");
				aNodes[1].setVisible(true);
				await nextUIUpdate();
				assert.ok(aNodes[1].$().is(":visible"), "node 1 - visible");
			}
			if (aNodes && aNodes[2] && aNodes[2].$()){
				assert.ok(aNodes[2].$().is(":visible"), "node 2 - visible");
			}
			if (aNodes && aNodes[3] && aNodes[3].$()){
				assert.ok(aNodes[3].$().is(":hidden"), "node 3 - hidden");
			}
			if (aGroups && aGroups[0] && aGroups[0].$()){
				assert.equal(aGroups[0].$().length, 0, "group not rendered");

				this.getGroups()[0].setVisible(true);
				await nextUIUpdate();

				assert.equal(aGroups[0].$().length, 1, "group not rendered");
			}
			if (aNodes && aNodes[3] && aNodes[3].$()){
				assert.ok(aNodes[3].$().is(":visible"), "node 3 - visible");
			}

			if (aLines && aLines[0] && aLines[0].$()){
				assert.equal(aLines[0].$().css("display"), "none", "line 0 - hidden");
			if (aLines[1] && aLines[1].$()){
				assert.ok(aLines[1].$().is(":visible"), "line 1 - visible");
			}
				aLines[0].setVisible(true);
				await nextUIUpdate();
				assert.ok(aLines[0].$().is(":visible"), "line 0 - visible");
			}
			fnDone();
			oGraph.destroy();
		});
	});

	QUnit.test("isOnScreen", function (assert) {
		var oNode = new Node({
			x: 10,
			y: 100
		});
		oNode._iWidth = 100;
		oNode._iHeight = 100;

		assert.ok(oNode._isOnScreen(0, 300, 0, 300), "Node should be on big enough screen.");
		assert.ok(oNode._isOnScreen(50, 100, 150, 250), "Node should be reported on screen if part of it is there.");
		assert.ok(oNode._isOnScreen(20, 30, 110, 120), "Node should be reported on screen when larger than screen.");
		assert.notOk(oNode._isOnScreen(1000, 2000, 1000, 2000), "Node should not be reported on screen when the screen is far away.");
		assert.notOk(oNode._isOnScreen(0, 300, 300, 400), "Node should not be reported on screen when only one dimension matches.");
	});

	QUnit.test("icon size", function (assert) {
		var fnDone = assert.async();

		var oGraph = GraphTestUtils.buildGraph({
			nodes: [
				{
					"key": 0,
					"icon": "sap-icon://checklist",
					"iconSize": 45
				}]
		});
		oGraph.placeAt("content");
		assert.expect(1);

		oGraph.attachGraphReady(function () {
			assert.ok(oGraph.getNodes()[0].$().find(".sapSuiteUiCommonsNetworkGraphIcon").css("font-size"), "45px");
			fnDone();
			oGraph.destroy();
		});
	});

	QUnit.test("Attributes - invalidate", function (assert) {
		var fnDone = assert.async();

		var oGraph = GraphTestUtils.buildGraph(
			{
				nodes: [
					{
						key: 0,
						title: "Title",
						icon: "sap-icon://sap-ui5",
						shape: "Box",
						maxWidth: 200,
						attributes: [
							{
								label: "L1",
								value: "V1",
								visible: true
							}
						]
					}
				]
			});

		oGraph.placeAt("content");
		assert.expect(2);

		oGraph.attachGraphReady(async function () {
			var oAttr = oGraph.getNodes()[0].getAttributes()[0],
				$attr = oAttr.$();

			var sLbl = $attr.find(".sapSuiteUiCommonsNetworkGraphDivNodeLabels span").text();
			assert.equal(sLbl, "L1", "1");

			oAttr.setLabel("CHANGED");
			await nextUIUpdate();

			assert.equal(oGraph.getNodes()[0].getAttributes()[0].$().find(".sapSuiteUiCommonsNetworkGraphDivNodeLabels").text(), "CHANGED", "2");
			fnDone();
			oGraph.destroy();
		});
	});
	// header
	QUnit.test("Header : Removing Header content and checking header classes", async function (assert) {
		var oGraph = GraphTestUtils.buildGraph(
			{
				nodes: [
					{
						key: 0,
						title: "Title",
						icon: "sap-icon://sap-ui5",
						shape: "Box",
						maxWidth: 200,
						attributes: [
							{
								label: "L1",
								value: "V1",
								visible: true
							}
						]
					},
					{
						key: 1,
						title: "Title",
						shape: "Box",
						maxWidth: 200,
						attributes: [
							{
								label: "L2",
								value: "V2",
								visible: true
							}
						]
					},
					{
						key: 2,
						shape: "Box",
						maxWidth: 200,
						attributes: [
							{
								label: "L3",
								value: "V3",
								visible: true
							}
						]
					}
				]
			}),
			oFirstNode = oGraph.getNodes()[0],
			oSecondNode = oGraph.getNodes()[1],
			oThirdNode = oGraph.getNodes()[2],
			fnDone = assert.async(),
			fnAssert = function () {
				assert.equal(oFirstNode.getDomRef("header").className,"sapSuiteUiCommonsNetworkGraphDivHeader sapSuiteUiCommonsNetworkGraphDivHeaderColor", "Node with header title and icon has correct classes.");
				assert.equal(oSecondNode.getDomRef("header").className,"sapSuiteUiCommonsNetworkGraphDivHeader sapSuiteUiCommonsNetworkGraphDivHeaderColor", "Node with header title has correct classes.");
				assert.equal(oThirdNode.getDomRef("header").className,"sapSuiteUiCommonsNetworkGraphDivHeader", "Node without header title and icon has correct classes.");
			};

		assert.expect(3);

		await GraphTestUtils.runAsyncAssert(oGraph, fnAssert, fnDone);
	});

	//Attributes
	QUnit.test("lable/value/description in Attributes for nodes with longer length get trimmed correctly with word-break.", function (assert) {
		var fnDone = assert.async();
		var oGraph = GraphTestUtils.buildGraph(
			{
				nodes: [
					{
						key: 0,
						title: "Title",
						icon: "sap-icon://sap-ui5",
						maxWidth: 200,
						shape: "Box",
						description: "this is thelongdescriptionicanwritesothankyou",
						attributes: [
							{	label: 4,
								value: "Very long valueVerylongvalueVerylong value Very long value"
							}
						]
					}
				]
			}),
			oNode = oGraph.getNodes()[0];
			oGraph.placeAt("content");
			assert.expect(2);

			oGraph.attachGraphReady(function () {
			assert.ok(getComputedStyle(oNode.getAttributes()[0]._oValue.getDomRef())["word-break"] === 'break-word', "Long words in value should be trimmed/break.");
			assert.ok(getComputedStyle(oNode.getAttributes()[0]._oLabel.getDomRef())["word-break"] === 'break-word', "Long words in label should be trimmed/break.");
			fnDone();
			oGraph.destroy();
		});

	});
});
