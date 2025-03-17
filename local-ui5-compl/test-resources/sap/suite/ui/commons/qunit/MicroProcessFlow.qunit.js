sap.ui.define([
	"sap/suite/ui/commons/MicroProcessFlow",
	"sap/suite/ui/commons/MicroProcessFlowItem",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/suite/ui/microchart/RadialMicroChart",
	'sap/ui/core/library',
	"sap/m/Table",
	"sap/m/Column",
	"sap/m/Text",
	"sap/m/ColumnListItem",
	"sap/ui/comp/smartform/SmartForm",
	"sap/ui/comp/smartform/Group",
	"sap/ui/comp/smartform/GroupElement",
	"sap/ui/core/Core",
	"sap/ui/core/Lib",
	"sap/ui/core/Element",
	"sap/ui/core/Theming",
	"sap/ui/qunit/utils/nextUIUpdate",
	"sap/ui/core/Icon",
	"sap/ui/thirdparty/jquery"
], function(MicroProcessFlow, MicroProcessFlowItem, createAndAppendDiv, RadialMicroChart, coreLibrary, Table, Column, Text, ColumnListItem, SmartForm, Group, GroupElement, Core, CoreLib, Element, Theming, nextUIUpdate, Icon, jQuery) {

	var ValueState = coreLibrary.ValueState;
	var oResourceBundle = CoreLib.getResourceBundleFor("sap.suite.ui.commons");
	var styleElement = document.createElement("style");
	styleElement.textContent =
		"html, body {" +
		"       height: 100%;" +
		"}" +
		".MicroProcessFlowHeight {" +
		"		height: 100%;" +
		"}";
	document.head.appendChild(styleElement);
	createAndAppendDiv("qunit");
	createAndAppendDiv("content").className = "MicroProcessFlowHeight";
	createAndAppendDiv("qunit_results").className = "MicroProcessFlowHeight";

	QUnit.module("Micro Process Flow", {
	});

	QUnit.test("Micro process flow is rendered", async function (assert) {
		var oMicroProcessFlow = new MicroProcessFlow({
			content: [new MicroProcessFlowItem(), new MicroProcessFlowItem(), new MicroProcessFlowItem(), new MicroProcessFlowItem()]
		});
		var fnSetItemAccessibility = this.spy(oMicroProcessFlow.getContent()[0], "_setItemAccessibility");
		var fnSetItemContentAccessibility = this.spy(oMicroProcessFlow.getContent()[0], "_setItemContentAccessibility");
		oMicroProcessFlow.placeAt("content");
		await nextUIUpdate();

		assert.equal(4, oMicroProcessFlow.$("scrolling").children().length, "Correct number of children rendered");
		assert.equal(3, oMicroProcessFlow.$().find(".sapSuiteUiCommonsMicroProcessFlowItemSeparator").length, "Correct number of separators rendered");
		assert.ok(fnSetItemAccessibility.called, "Method: _setItemAccessibility is called");
		assert.ok(fnSetItemContentAccessibility.called, "Method: _setItemContentAccessibility is called");

		fnSetItemAccessibility.restore();
		fnSetItemContentAccessibility.restore();
		oMicroProcessFlow.destroy();

	});

	QUnit.test("Micro process flow render types", async function (assert) {
		// For scrolling type
		var oMicroProcessFlow = new MicroProcessFlow({
			renderType: "Scrolling",
			content: [new MicroProcessFlowItem(), new MicroProcessFlowItem(), new MicroProcessFlowItem(), new MicroProcessFlowItem()]
		});
		oMicroProcessFlow.placeAt("content");
		await nextUIUpdate();

		assert.equal(1, oMicroProcessFlow.$().find(".sapSuiteUiCommonsMicroProcessFlowLeftScroller").length, "Correct number of left scroller");
		assert.equal(1, oMicroProcessFlow.$().find(".sapSuiteUiCommonsMicroProcessFlowRightScroller").length, "Correct number of right scroller");

		// For scrolling with resize type
		oMicroProcessFlow.setRenderType("ScrollingWithResizer");
		await nextUIUpdate();
		assert.equal(1, oMicroProcessFlow.$().find(".sapSuiteUiCommonsMicroProcessFlowLeftScroller").length, "Correct number of left scroller for resize");
		assert.equal(1, oMicroProcessFlow.$().find(".sapSuiteUiCommonsMicroProcessFlowRightScroller").length, "Correct number of right scroller for resize");

		// For wrap type
		oMicroProcessFlow.setRenderType("Wrap");
		await nextUIUpdate();
		assert.equal(1, oMicroProcessFlow.$().find("[style='flex-wrap: wrap;']").length, "Correct rednder type wrap");

		// For no wrap type
		oMicroProcessFlow.setRenderType("NoWrap");
		await nextUIUpdate();
		assert.equal(0, oMicroProcessFlow.$().find("[style='flex-wrap: wrap;']").length, "Correct rednder type no wrap");

		//for setting ariaLabel
		oMicroProcessFlow.setAriaLabel("test ariaLabel");
		await nextUIUpdate();
		var slabel = oMicroProcessFlow.getAriaLabel();
		assert.equal(slabel,"test ariaLabel", "ok");

		oMicroProcessFlow.destroy();
	});

	QUnit.test("Removing of focus right and left scrollers", async function (assert) {
		// For scrolling type
		var oMicroProcessFlow = new MicroProcessFlow("microProcessFlow",{
			renderType: "Scrolling",
			content: [new MicroProcessFlowItem(), new MicroProcessFlowItem(), new MicroProcessFlowItem(), new MicroProcessFlowItem()]
		});
		oMicroProcessFlow.placeAt("content");
		await nextUIUpdate();

		assert.equal(document.querySelector("#microProcessFlow-leftscroller").getAttribute("tabindex"),"-1","Focus has been removed from the left scroller");
		assert.equal(document.querySelector("#microProcessFlow-rightscroller").getAttribute("tabindex"),"-1","Focus has been removed from the right scroller");
		oMicroProcessFlow.destroy();
		oMicroProcessFlow = null;
	});

	QUnit.test("Micro process flow aria-selected is false when non of the items are selected", async function (assert) {
		var oMicroProcessFlow = new MicroProcessFlow({
			renderType: "Scrolling",
			content: [new MicroProcessFlowItem(), new MicroProcessFlowItem(), new MicroProcessFlowItem(), new MicroProcessFlowItem()]
		});
		var fnSetItemContentAccessibility = this.spy(oMicroProcessFlow.getContent()[0], "_setItemContentAccessibility");
		var fnSetItemContentAccessibilityItem1 = this.spy(oMicroProcessFlow.getContent()[1], "_setItemContentAccessibility");
		oMicroProcessFlow.placeAt("content");
		await nextUIUpdate();

		assert.strictEqual(oMicroProcessFlow.getContent()[0].getFocusDomRef().getAttribute("aria-selected"), "false", "Aria-selected is set to false");
		oMicroProcessFlow.getContent()[0].getFocusDomRef().tabIndex = 0;
		oMicroProcessFlow.getContent()[0].getFocusDomRef().click();
		assert.ok(fnSetItemContentAccessibility.called, "Method: _setItemContentAccessibility is called for item 0");
		assert.strictEqual(oMicroProcessFlow.getContent()[0].getFocusDomRef().getAttribute("aria-selected"), "true", "Aria-selected is set to true");

		//After clicking the second item, first item aria-selected should be false
		oMicroProcessFlow.getContent()[1].getFocusDomRef().tabIndex = 0;
		oMicroProcessFlow.getContent()[1].getFocusDomRef().click();
		assert.ok(fnSetItemContentAccessibilityItem1.called, "Method: _setItemContentAccessibility is called for item 1");
		assert.strictEqual(oMicroProcessFlow.getContent()[0].getFocusDomRef().getAttribute("aria-selected"), "false", "Aria-selected is set to false");
	});

	QUnit.test("Micro process flow events check", async function (assert) {
		var oMicroProcessFlow = new MicroProcessFlow({
			renderType: "Scrolling",
			content: [new MicroProcessFlowItem(), new MicroProcessFlowItem(), new MicroProcessFlowItem(), new MicroProcessFlowItem()]
		});
		var fnSetItemContentAccessibility = this.spy(oMicroProcessFlow.getContent()[0], "_setItemContentAccessibility");
		oMicroProcessFlow.placeAt("content");
		await nextUIUpdate();

		oMicroProcessFlow.getContent()[0].$().trigger("mousedown");

		assert.ok(fnSetItemContentAccessibility.calledTwice, "Method: _setItemContentAccessibility is called twice");
		assert.ok(oMicroProcessFlow.getContent()[0].$("item").attr("class").includes("sapSuiteUiCommonsMicroProcessFlowItemPressed"), "Class: sapSuiteUiCommonsMicroProcessFlowItemPressed has been set");

		oMicroProcessFlow.getContent()[0].$().trigger("mouseup");

		assert.ok(fnSetItemContentAccessibility.calledThrice, "Method: _setItemContentAccessibility is called Thrice");
		assert.notOk(oMicroProcessFlow.getContent()[0].$("item").attr("class").includes("sapSuiteUiCommonsMicroProcessFlowItemPressed"), "Class: sapSuiteUiCommonsMicroProcessFlowItemPressed has been removed");
	});

	QUnit.test("Micro process flow aria-hidden is true for items with press event", async function (assert) {
		var fnDone = assert.async();
		var oMicroProcessFlow = new MicroProcessFlow({
			renderType: "Scrolling",
			content: [
				new MicroProcessFlowItem({
					press:"itemPress"
				}),
				new MicroProcessFlowItem({
					press:"itemPress"
				})
		]});
		var afterRenderDelegate = {
			onAfterRendering: function () {
				assert.strictEqual(oMicroProcessFlow.getContent()[0].getDomRef().firstChild.ariaHidden, "true", "Aria-hidden is true for microProcessFlow item with press event");
				assert.strictEqual(oMicroProcessFlow.getContent()[1].getDomRef().firstChild.ariaHidden, "true", "Aria-hidden is true for microProcessFlow item with press event");
				oMicroProcessFlow.removeEventDelegate(afterRenderDelegate);
				fnDone();
			}
		};
		oMicroProcessFlow.addEventDelegate(afterRenderDelegate);
		oMicroProcessFlow.placeAt("content");
		await nextUIUpdate();
	});

	QUnit.test("Micro process flow DOM", async function (assert) {
		var oMicroProcessFlow = new MicroProcessFlow({
			content: [new MicroProcessFlowItem(), new MicroProcessFlowItem(), new MicroProcessFlowItem(), new MicroProcessFlowItem()]
		});
		oMicroProcessFlow.placeAt("content");
		await nextUIUpdate();

		assert.equal(4, oMicroProcessFlow.$().find(".sapSuiteUiCommonsMicroProcessFlowContent .sapSuiteUiCommonsMicroProcessFlowScrolling").children().length, "Correct number of div");
		assert.equal(4, oMicroProcessFlow.$().find(".sapSuiteUiCommonsMicroProcessFlowContent .sapSuiteUiCommonsMicroProcessFlowScrolling .sapSuiteUiCommonsMicroProcessFlowItemWrapper").length, "Correct nesting of micro process flow items");
		oMicroProcessFlow.destroy();
	});

	QUnit.test("Micro process flow separator", async function (assert) {
		var oMicroProcessFlow = new MicroProcessFlow({
			content: [new MicroProcessFlowItem({
				showSeparator: false
			}), new MicroProcessFlowItem()]
		});
		oMicroProcessFlow.placeAt("content");
		await nextUIUpdate();

		assert.equal(0, oMicroProcessFlow.$().find(".sapSuiteUiCommonsMicroProcessFlowItemSeparator:visible").length, "Correct number of separators rendered");
		oMicroProcessFlow.destroy();

	});

	QUnit.test("Micro process intermediary", async function (assert) {
		var oMicroProcessFlow = new MicroProcessFlow({
			content: [new MicroProcessFlowItem({
				showIntermediary: true
			}), new MicroProcessFlowItem()]
		});
		oMicroProcessFlow.placeAt("content");
		await nextUIUpdate();

		assert.equal(1, oMicroProcessFlow.$().find(".sapSuiteUiCommonsMicroProcessFlowItemIntermediary").length, "Correct number of intermediary");
		oMicroProcessFlow.destroy();
	});


	QUnit.test("Micro process custom intermediary", async function (assert) {
		var oMicroProcessFlow = new MicroProcessFlow({
			content: [new MicroProcessFlowItem({
				showIntermediary: true,
				intermediary: [
					new Icon({
						src: "sap-icon://account"
					})
				]
			}), new MicroProcessFlowItem()]
		});
		oMicroProcessFlow.placeAt("content");
		await nextUIUpdate();

		assert.equal(1, oMicroProcessFlow.$().find(".sapSuiteUiCommonsMicroProcessFlowItemIntermediary span").length, "Correct number of custom intermediary");
		oMicroProcessFlow.destroy();
	});

	QUnit.test("Micro process default icons check", async function (assert) {
		var oMicroProcessFlow = new MicroProcessFlow({
			content: [
				new MicroProcessFlowItem({
					state: ValueState.Information
				}),
				new MicroProcessFlowItem({
					state: ValueState.Success
				}),
				new MicroProcessFlowItem({
					state: ValueState.Error
				}),
				new MicroProcessFlowItem({
					state: ValueState.Warning
				}), new MicroProcessFlowItem()]
		});
		oMicroProcessFlow.placeAt("content");
		await nextUIUpdate();

		assert.equal(oMicroProcessFlow.getContent()[0]._getIconByState(), "sap-icon://message-information", "Information icon is Updated");
		assert.equal(oMicroProcessFlow.getContent()[1]._getIconByState(), "sap-icon://message-success", "Success icon is Updated");
		assert.equal(oMicroProcessFlow.getContent()[2]._getIconByState(), "sap-icon://message-error", "Error icon is Updated");
		assert.equal(oMicroProcessFlow.getContent()[3]._getIconByState(), "sap-icon://message-warning", "Warning icon is Updated");

	});

	QUnit.test("Micro process state property", async function (assert) {
		var oMicroProcessFlow = new MicroProcessFlow({
			content: [new MicroProcessFlowItem({
				state: ValueState.Information
			}), new MicroProcessFlowItem({
				state: ValueState.Good
			}), new MicroProcessFlowItem()]
		});
		oMicroProcessFlow.placeAt("content");
		await nextUIUpdate();

		assert.equal(ValueState.Information, oMicroProcessFlow.getContent()[0].getState(), "Information state mapped");
		assert.equal(ValueState.Good, oMicroProcessFlow.getContent()[1].getState(), "Good state mapped");

		oMicroProcessFlow.getContent()[0].setState(ValueState.Good);
		oMicroProcessFlow.getContent()[1].setState(ValueState.Information);

		await nextUIUpdate();

		assert.equal(ValueState.Good, oMicroProcessFlow.getContent()[0].getState(), "Good state mapped");
		assert.equal(ValueState.Information, oMicroProcessFlow.getContent()[1].getState(), "Information state mapped");

		oMicroProcessFlow.destroy();
	});

	QUnit.test("Micro process step width", async function (assert) {
		var oMicroProcessFlow = new MicroProcessFlow({
			content: [new MicroProcessFlowItem({
				stepWidth: "300px"
			}), new MicroProcessFlowItem({
				stepWidth: "100%"
			}), new MicroProcessFlowItem()]
		});
		oMicroProcessFlow.placeAt("content");
		await nextUIUpdate();

		var iMaxHeight = oMicroProcessFlow._getMaxHeight();

		assert.equal(300, oMicroProcessFlow.getContent()[0].$().find(".sapSuiteUiCommonsMicroProcessFlowItemSeparatorWrapper").width(), "Correct fix width");
		assert.equal(oMicroProcessFlow.getContent()[1].$("separator").width(), iMaxHeight, "Correct percentage width");
		oMicroProcessFlow.destroy();
	});

	QUnit.test("Micro process custom control", async function (assert) {
		var oMicroProcessFlow = new MicroProcessFlow({
			content: [new MicroProcessFlowItem({
				customControl: new RadialMicroChart("graphCustomItem", {
					size: "M",
					percentage: "45"
				})
			}), new MicroProcessFlowItem()
			]
		});
		oMicroProcessFlow.placeAt("content");
		await nextUIUpdate();
		assert.equal(1, oMicroProcessFlow.$().find("#graphCustomItem").length, "Custom item");
		oMicroProcessFlow.destroy();

	});

	QUnit.test("Micro process press", async function (assert) {
		var oEvent = {
			preventDefault: function () { },
			stopPropagation: function () { }
		};
		var oMicroProcessFlow = new MicroProcessFlow({
			content: [new MicroProcessFlowItem({
				press: function () {
					assert.ok("pressed");
				}
			})
			]
		});
		oMicroProcessFlow.placeAt("content");
		await nextUIUpdate();

		oMicroProcessFlow.getContent()[0]._click(oEvent);
		oMicroProcessFlow.destroy();
	});

	QUnit.test("Micro process accessibility", async function (assert) {
		var TITLE = "testtitle";
		var oMicroProcessFlow = new MicroProcessFlow({
			content: [new MicroProcessFlowItem({
				title: TITLE,
				customControl: new RadialMicroChart("graphCustomItem", {
					size: "M",
					percentage: "45"
				})
			}), new MicroProcessFlowItem({
				title: TITLE
			})
			]
		});
		oMicroProcessFlow.placeAt("content");
		await nextUIUpdate();
		assert.equal(oMicroProcessFlow.$().attr("aria-roledescription"), oResourceBundle.getText("ACC_CTR_TYPE_MICRO_PROCESS_FLOW"), "MicroProcessFlow aria-roledescription was rendered successfully");
		oMicroProcessFlow.getContent().forEach(function (oItem) {
			var sItem = oItem.$("item").attr("aria-label") || "",
				sItemContent = oItem.$("itemContent").attr("aria-label") || "",
				bTitle = sItem.indexOf(TITLE) !== -1 || sItemContent.indexOf(TITLE) !== -1;

			assert.equal(true, bTitle, "Title match");
		});
		oMicroProcessFlow.destroy();
	});

	QUnit.test("Micro process flow scroll event with resize", async function (assert) {
		const contentArray = [];
		for (let i = 0; i < 15; i++){
			contentArray.push(new MicroProcessFlowItem());
		}
		var oMicroProcessFlow = new MicroProcessFlow({
			renderType: "ScrollingWithResizer",
			content: contentArray
		});
		var oItem = new ColumnListItem({
			press: [function (oEvent) {
				assert.notOk("pressed");
			}],
			type: "Navigation",
			cells: [oMicroProcessFlow]
		});

		var oTable = new Table({
			width: "400px",
			columns: [new Column({
				header: [new Text({ text: "Items" })]
			})],
			items: [oItem]
		});

		// Create spies for the press and scroll events
		var oSpy1 = sinon.spy(oItem, "firePress");
		var oSpy2 = sinon.spy(oMicroProcessFlow, "_scroll");

		// Place the table in the DOM
		oTable.placeAt("content");
		await nextUIUpdate();

		// Simulate a click on the right scroller
		var $rightScroller = oMicroProcessFlow.$().find(".sapSuiteUiCommonsMicroProcessFlowRightScroller");
		$rightScroller.click();
		assert.equal(oSpy2.calledOnce, true, "Scroll event is triggered from MicroProcessFlow");
		assert.equal(oSpy1.calledOnce, false, "Parent event is not triggered from scroll");

		// Check the initial count of scroll events bound to the right scroller
		const scrollEventCount = jQuery._data($rightScroller[0], "events").click.length;
		assert.equal(scrollEventCount, 1, "Right scroller click event is bound once initially");

		// Resize the table
		oTable.setWidth("300px");
		await nextUIUpdate();

		// Simulate another click after resizing
		$rightScroller.click();

		// Check the scroll event handler count after resizing
		const newScrollEventCount = jQuery._data($rightScroller[0], "events").click.length;
		assert.equal(newScrollEventCount, 1, "Right scroller click event is still bound once after resizing");

		// Cleanup
		oTable.destroy();
	});

	QUnit.test("Calculating the right scroller value while scrolling", async function (assert) {
		var oMicroProcessFlow = new MicroProcessFlow({
			renderType: "Scrolling",
			width:"100px",
			content: [new MicroProcessFlowItem(), new MicroProcessFlowItem(), new MicroProcessFlowItem(), new MicroProcessFlowItem(),
			new MicroProcessFlowItem(), new MicroProcessFlowItem(), new MicroProcessFlowItem(), new MicroProcessFlowItem()]
		});
		oMicroProcessFlow.placeAt("content");
		await nextUIUpdate();
		var iRightScrollValue = parseInt(document.getElementById(oMicroProcessFlow.getId() + "-rightscroller").innerText,10);
		var iNodes = oMicroProcessFlow.getContent().length;
		assert.equal(iRightScrollValue, iNodes - 1, "Initially Right Scroller Value Rendered Correctly");
		for (var i = 1; i <= iNodes - 1; i++) {
			oMicroProcessFlow.$().find(".sapSuiteUiCommonsMicroProcessFlowRightScroller").click();
			iRightScrollValue = parseInt(document.getElementById(oMicroProcessFlow.getId() + "-rightscroller").innerText,10);
			assert.equal(iRightScrollValue, iNodes - 1 - i, "Right Scroller Value Rendered Correctly");
		}
	});

	QUnit.test("Micro process flow Item Role", async function (assert) {
		var oMicroProcessFlow = new MicroProcessFlow({
			content: [new MicroProcessFlowItem(), new MicroProcessFlowItem(), new MicroProcessFlowItem(), new MicroProcessFlowItem()]
		});
		oMicroProcessFlow.placeAt("content");
		await nextUIUpdate();
		for (var i = 0; i < oMicroProcessFlow.getContent().length; i++) {
			assert.equal(oMicroProcessFlow.getContent()[i].getDomRef("itemContent").getAttribute("role"), "option", "role=option should be present");
		}

		oMicroProcessFlow.destroy();
	});


	QUnit.test("Exit destroys scroller instance", async function (assert) {
		var oMicroProcessFlow = new MicroProcessFlow({
			content: [new MicroProcessFlowItem(), new MicroProcessFlowItem(), new MicroProcessFlowItem(), new MicroProcessFlowItem()]
		});
		oMicroProcessFlow.setRenderType("Scrolling");
		oMicroProcessFlow.placeAt("content");
		await nextUIUpdate();
		sinon.stub(oMicroProcessFlow._oLeftScroller, "destroy");
		sinon.stub(oMicroProcessFlow._oRightScroller, "destroy");
		oMicroProcessFlow.exit();
		assert.ok(oMicroProcessFlow._oLeftScroller.destroy.calledOnce);
		assert.ok(oMicroProcessFlow._oRightScroller.destroy.calledOnce);
	});
	QUnit.test("get accessibility info returns an object", async function (assert) {
		var oMicroProcessFlow = new MicroProcessFlow({
			content: [new MicroProcessFlowItem(), new MicroProcessFlowItem(), new MicroProcessFlowItem(), new MicroProcessFlowItem()]
		});
		oMicroProcessFlow.placeAt("content");
		await nextUIUpdate();
		var oInfo = oMicroProcessFlow.getAccessibilityInfo();
		assert.ok(!!oInfo, "getAccessibilityInfo returns a info object");
		oMicroProcessFlow.destroy();
	});

	QUnit.test("Rendering inside a Smart Form", async function (assert) {
		var oMicroProcessFlow = new MicroProcessFlow({
			content: [new MicroProcessFlowItem(), new MicroProcessFlowItem(), new MicroProcessFlowItem(), new MicroProcessFlowItem()]
		});
		var oSmartForm = new SmartForm("smartForm1", {
			groups: [
				new Group({
					groupElements: [
						new GroupElement({
							elements: [oMicroProcessFlow]
						})
					]
				})
			]
		});
		oSmartForm.placeAt("content");
		await nextUIUpdate();

		var oSmartFormRef = Element.getElementById("smartForm1").getDomRef();
		var oMicroProcessFlowParent = oMicroProcessFlow.getParent().getParent().getParent().getParent();

		assert.ok(oMicroProcessFlowParent.getDomRef() == oSmartFormRef, "MicroProcessFlow is rendered inside SmartForm");
		assert.ok(oMicroProcessFlow.getFormDoNotAdjustWidth(), "MicroProcessFlow is not stretched for SmartForm");
		oSmartForm.destroy();
	});
	QUnit.test(
		"Check background color on hover for information item",
		async function (assert) {
			var oMicroProcessFlow = new MicroProcessFlow({
				content: [
					new MicroProcessFlowItem({
						state: ValueState.Information
					})
				]
			});

			function rgbToHex(rgb) {
				var result = rgb.match(/\d+/g); // Extract the R, G, B values
				var r = parseInt(result[0], 10).toString(16).padStart(2, "0");
				var g = parseInt(result[1], 10).toString(16).padStart(2, "0");
				var b = parseInt(result[2], 10).toString(16).padStart(2, "0");
				return `#${r}${g}${b}`;
			}
			oMicroProcessFlow.placeAt("content");
			await nextUIUpdate();

			var element = oMicroProcessFlow
				.$()
				.find(".sapSuiteUiCommonsMicroProcessFlowItemInformation")[0];

			simulateCssEvent(":hover");

			var backgroundColor = $(element).css("background-color");
			var backgroundColorHex = rgbToHex(backgroundColor);

			var expectedColor = sap.ui.core.theming.Parameters.get(
				"sapButton_Information_Hover_Background"
			);

			simulateCssEvent("stop");

			assert.equal(
				backgroundColorHex,
				expectedColor,
				"Background color on hover matches expected value"
			);
		}
	);
	QUnit.module("Height of the MicroProcessflow in horizon themes", {
		beforeEach: function() {
			this.sStartTheme = Theming.getTheme();
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
		afterEach: function(assert) {
			var done = assert.async();
			this.applyTheme(this.sStartTheme, done);
		}
	});
	QUnit.test("Checking if the height is set as 1.25rem for the MicroProcessFlowItem", async function(assert){
		var done = assert.async();
		var oMicroProcessFlow = new MicroProcessFlow("micro",{
			content: [new MicroProcessFlowItem("microItem"), new MicroProcessFlowItem(), new MicroProcessFlowItem(), new MicroProcessFlowItem()]
		});
		oMicroProcessFlow.placeAt("content");
		await nextUIUpdate();
		oMicroProcessFlow.addStyleClass("sapUiSizeCompact");
		this.applyTheme("sap_horizon", function() {
			assert.equal(getComputedStyle(document.querySelector("#microItem-itemContent")).height, "20px", "The height has been applied as expected");
			done();
		});
	});
    QUnit.test("_getLeftScroller Icon Validation", function(assert){
        var microProcessFlow = new MicroProcessFlow();
        var expectedIconSrc = "sap-icon://navigation-left-arrow";
        var leftScroller = microProcessFlow._getLeftScroller();
        assert.equal(leftScroller.getSrc(),expectedIconSrc,"Scroller has correct source");
    });

	QUnit.test("Micro process space press passing the event", async function (assert) {
		var oMicroProcessFlow = new MicroProcessFlow({
			content: [new MicroProcessFlowItem({
				press: function () {
					assert.ok("pressed");
				}
			})]
		});
		// Spy on _firePress method of microprocess flow item
		var firePressSpy = sinon.spy(oMicroProcessFlow, "_firePress");

		oMicroProcessFlow.placeAt("content");
		await nextUIUpdate();

		// Set the key property to simulate spacebar key press
		var e = jQuery.Event("keydown");
		e.key = " ";
		e.keyCode = 32;

		oMicroProcessFlow.getContent()[0].getFocusDomRef().tabIndex = 0;

		oMicroProcessFlow.onsapspace(e);
		// Check if _firePress is called with argument (event)
		assert.ok(firePressSpy.calledWith(sinon.match.any), "_firePress was called with default event");

		// Clean up
		firePressSpy.restore();
		oMicroProcessFlow.destroy();
	});
});
function simulateCssEvent(type) {
    var id = "simulatedStyle";
    var generateEvent = function (selector) {
        var style = "";
        for (var i in document.styleSheets) {
            var rules = document.styleSheets[i].cssRules;
            for (var r in rules) {
                if (rules[r].cssText && rules[r].selectorText) {
                    if (rules[r].selectorText.indexOf(selector) > -1) {
                        var regex = new RegExp(selector, "g");
                        var text = rules[r].cssText.replace(regex, "");
                        style += text + "\n";
                    }
                }
            }
        }
        document
            .querySelector("head")
            .insertAdjacentHTML(
                "beforeend",
                "<style id=" + id + ">" + style + "</style>"
            );
    };
    var stopEvent = function () {
        document.querySelector("#" + id).remove();
    };
    if (type === "stop") {
        return stopEvent();
    } else {
        return generateEvent(type);
    }
}
