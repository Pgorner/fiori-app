sap.ui.define([
	"jquery.sap.global",
	"sap/suite/ui/commons/CalculationBuilder",
	"sap/suite/ui/commons/CalculationBuilderFunction",
	"sap/suite/ui/commons/CalculationBuilderItem",
	"sap/suite/ui/commons/CalculationBuilderVariable",
	"sap/suite/ui/commons/library",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/ui/core/Core",
	"sap/ui/core/Lib",
	"sap/ui/qunit/utils/nextUIUpdate"
], function (jQuery, CalculationBuilder, CalculationBuilderFunction, CalculationBuilderItem, CalculationBuilderVariable, suiteLibrary, createAndAppendDiv, Core, CoreLib, nextUIUpdate) {
	"use strict";

	createAndAppendDiv("content");

	var CalculationBuilderOperatorType = suiteLibrary.CalculationBuilderOperatorType,
		CalculationBuilderFunctionType = suiteLibrary.CalculationBuilderFunctionType;

	var oResourceBundle = CoreLib.getResourceBundleFor("sap.suite.ui.commons");

	async function render(oElement) {
		oElement.placeAt("content");
		await nextUIUpdate();
	}

	QUnit.module("CalculationBuilder", {
		beforeEach: function () {
			this.oCalculationBuilder = new CalculationBuilder({
				title: "Calculation Builder",
				variables: [
					new CalculationBuilderVariable({
						key: "TestColumn1",
						items: [
							new CalculationBuilderItem({
								key: 100
							})
						]
					}),
					new CalculationBuilderVariable({
						key: "TestColumn2",
						items: [
							new CalculationBuilderItem({
								key: "TestColumn1"
							})
						]
					})
				]
			});
		},
		afterEach: function () {
			this.oCalculationBuilder.destroy();
		}
	});

	QUnit.test("Check Calculation builder sort functions aggregation", async function (assert) {
		var aItems = [
			new CalculationBuilder({
				key: "ABS",
				title: "ABS - Absolute Value"
			}),
			new CalculationBuilder({
				key: "CustomFunction",
				title: "Custom function"
			}),
			new CalculationBuilder({
				key: "Round",
				title: "Round"
			}),
			new CalculationBuilder({
				key: "RoundDown",
				title: "Round Down"
			}),
			new CalculationBuilder({
				key: "RoundUp",
				title: "Round Up"
			}),
			new CalculationBuilder({
				key: "SQRT",
				title: "SQRT"
			}),
			new CalculationBuilder({
				key: "tokenFunction",
				title: "Token function"
			})
		], oTestObject;

		assert.expect(7);

		this.oCalculationBuilder = new CalculationBuilder({
			functions: [new CalculationBuilderFunction({
				key: "CustomFunction",
				label: "Custom function"
			}),
			({
				key: "tokenFunction",
				label: "Token function"
			})
		]
		});
		await render(this.oCalculationBuilder);
		oTestObject = this.oCalculationBuilder._getAllFunctions();

		for (var i = 0; i < aItems.length; i++) {
			assert.equal(oTestObject[i].title, aItems[i].getTitle(), "okay");
		}
	});

	QUnit.test("Test toggle Expression Field", async function (assert) {
		var oToggleButton, oExpressionField;

		assert.expect(3);

		await render(this.oCalculationBuilder);
		oToggleButton = this.oCalculationBuilder.getToolbar()?.getContent()[2];
		oExpressionField = jQuery(".sapCalculationBuilderInputOuterWrapper");
		assert.ok(oExpressionField.is(":visible"));

		oToggleButton.firePress();
		await nextUIUpdate();
		assert.ok(oExpressionField.is(":hidden"));

		oToggleButton.firePress();
		await nextUIUpdate();
		assert.ok(oExpressionField.is(":visible"));
	});

	QUnit.test("Test clone", function (assert) {
		var sIdSuffix = "test",
			oClone = this.oCalculationBuilder.clone(sIdSuffix);

		assert.ok(oClone, "Clone created successfully");
		assert.ok(oClone.getId().includes(sIdSuffix), "Clone has correct id appended");
	});



	QUnit.test("Test Enter key press", async function (assert) {
		var aItems = [
				new CalculationBuilderItem({
					key: CalculationBuilderFunctionType.RoundUp
				}),
				new CalculationBuilderItem({
					key: 200
				}),
				new CalculationBuilderItem({
					key: CalculationBuilderOperatorType["+"]
				}),
				new CalculationBuilderItem({
					key: "TestColumn1"
				}),
				new CalculationBuilderItem({
					key: CalculationBuilderOperatorType["-"]
				}),
				new CalculationBuilderItem({
					key: CalculationBuilderFunctionType.ABS
				}),
				new CalculationBuilderItem({
					key: CalculationBuilderOperatorType["+"]
				}),
				new CalculationBuilderItem({
					key: 100
				}),
				new CalculationBuilderItem({
					key: CalculationBuilderOperatorType[")"]
				}),
				new CalculationBuilderItem({
					key: CalculationBuilderOperatorType[")"]
				})
			],
			oItem, oPopover;

		assert.expect(6);

		// Set expression: RoundUp ( 200 + TestColumn1 - ABS ( + 100 ) )
		aItems.forEach(function (oItem) {
			this.oCalculationBuilder.addItem(oItem);
		}.bind(this));

		oItem = this.oCalculationBuilder.getItems()[0];
		await render(this.oCalculationBuilder);
		oPopover = this.oCalculationBuilder._oExpressionBuilder._oPopover;
		assert.notOk(oPopover.isOpen());

		this.oCalculationBuilder._oExpressionBuilder.onsapenter({
			target: oItem.$()[0]
		});
		assert.ok(oPopover.isOpen());
		await new Promise((resolve, reject) => {
			oPopover.attachAfterOpen(() => {
				resolve();
			});
		});

		this.oCalculationBuilder._oExpressionBuilder.onsapenter({
			target: oItem.$()[1]
		});
		assert.ok(oPopover.isOpen());
		await nextUIUpdate();

		this.oCalculationBuilder._oExpressionBuilder.onsapenter({
			target: oItem.$()[3]
		});
		assert.ok(oPopover.isOpen());
		await nextUIUpdate();

		this.oCalculationBuilder._oExpressionBuilder.onsapenter({
			target: oItem.$()[5]
		});
		assert.ok(oPopover.isOpen());
		await nextUIUpdate();

		oPopover.close();

		await new Promise((resolve, reject) => {
			oPopover.attachAfterClose(() => {
				resolve();
			});
		});

		assert.ok(oPopover.$().is(":hidden"));
	});

	QUnit.test("Test the popover description", async function (assert) {
		var oPopover;

		await render(this.oCalculationBuilder);

		oPopover = this.oCalculationBuilder._oExpressionBuilder._oPopover;

		var oDescription = oPopover.getContent()[0].getPages()[0].getContent()[2].getItems()[0].getItems();

		for (var i = 0; i < oDescription.length; i++) {
			assert.ok(oDescription[i].getWrapping(), true);
		}
	});

	QUnit.test("Deleting items", async function (assert) {
		var oItem = new CalculationBuilderItem({
			key: 100
		});

		assert.expect(2);

		this.oCalculationBuilder.addItem(oItem);
		await render(this.oCalculationBuilder);
		assert.equal(oItem.getKey(), "100");

		this.oCalculationBuilder._oExpressionBuilder._oCurrentItem = oItem;
		this.oCalculationBuilder._oExpressionBuilder._deleteItem();
		await nextUIUpdate();
		assert.ok(this.oCalculationBuilder.getItems().length === 0);
	});

	QUnit.test("Converting items to template", function (assert) {
		var aConvertedItems,
			aCorrectTemplate = ["", ",", "", ",", ""],
			nCorrectTemplateLength = aCorrectTemplate.length,
			aItems = [
				new CalculationBuilderItem({
					key: CalculationBuilderOperatorType[""]
				}),
				new CalculationBuilderItem({
					key: CalculationBuilderOperatorType[","]
				}),
				new CalculationBuilderItem({
					key: CalculationBuilderOperatorType[""]
				}),
				new CalculationBuilderItem({
					key: CalculationBuilderOperatorType[","]
				}),
				new CalculationBuilderItem({
					key: CalculationBuilderOperatorType[""]
				})
			];

		assert.expect(1 + nCorrectTemplateLength);

		aConvertedItems = this.oCalculationBuilder._convertToTemplate(aItems);
		assert.equal(aConvertedItems.length, nCorrectTemplateLength);

		for (var i = 0; i < nCorrectTemplateLength; i++) {
			assert.equal(aConvertedItems[i], aCorrectTemplate[i]);
		}
	});

	QUnit.test("Setting expression",async function (assert) {
		var sNewExpression = "123 + 456";

		assert.expect(1);

		this.oCalculationBuilder.setExpression(sNewExpression);
		assert.equal(this.oCalculationBuilder.getExpression(), sNewExpression);

		await render(this.oCalculationBuilder);
		this.oCalculationBuilder._oExpressionBuilder._fireChange();
		this.oCalculationBuilder._oInput.fireChange();
	});

	QUnit.test("Allowed function", function (assert) {
		var oFunctionMap = this.oCalculationBuilder._getFunctionMap(),
			sFunctionType = CalculationBuilderFunctionType.Case.toLowerCase();

		assert.expect(3);
		assert.notOk(oFunctionMap[sFunctionType].hasOwnProperty("allowed"));

		this.oCalculationBuilder.allowFunction(sFunctionType, false);
		assert.notOk(oFunctionMap[sFunctionType].allowed);

		this.oCalculationBuilder.allowFunction(sFunctionType, true);
		assert.ok(oFunctionMap[sFunctionType].allowed);
	});

	QUnit.test("DefaultSettings", async function (assert) {
		// emtpy builder
		var oCalculationBuilder = new CalculationBuilder({});
		await render(oCalculationBuilder);

		assert.expect(7);
		assert.equal(oCalculationBuilder.getItems().length, 0, "items length");

		oCalculationBuilder.destroy();
		oCalculationBuilder = new CalculationBuilder({
			items: [
				new CalculationBuilderItem({
					key: "A"
				})
			]
		});
		await render(oCalculationBuilder);

		assert.equal(oCalculationBuilder.getItems().length, 1, "items length");
		assert.equal(oCalculationBuilder.getItems()[0].getKey(), "A", "items length");

		oCalculationBuilder.destroy();
		oCalculationBuilder = new CalculationBuilder({
			items: [
				new CalculationBuilderItem({
					key: "A"
				})
			],
			expression: "B"
		});
		await render(oCalculationBuilder);

		assert.equal(oCalculationBuilder.getItems().length, 1, "items length");
		assert.equal(oCalculationBuilder.getItems()[0].getKey(), "B", "items length- priority of expression");

		oCalculationBuilder.destroy();
		oCalculationBuilder = new CalculationBuilder({
			expression: "B"
		});
		await render(oCalculationBuilder);

		assert.equal(oCalculationBuilder.getItems().length, 1, "items length");
		assert.equal(oCalculationBuilder.getItems()[0].getKey(), "B", "items length");
		oCalculationBuilder.destroy();
	});

	QUnit.test("String constnats", async function (assert) {
		// emtpy builder
		var oCalculationBuilder = new CalculationBuilder({
			allowStringLiterals: true,
			expression: "\"\" + 5"
		});
		await render(oCalculationBuilder);

		assert.equal(oCalculationBuilder.getItems().length, 3, "items length");
		assert.equal(oCalculationBuilder.getItems()[0].getKey(), "\"\"", "item key");

		oCalculationBuilder.setExpression("1");
		await nextUIUpdate();

		assert.equal(oCalculationBuilder.getItems().length, 1, "items length");
		assert.equal(oCalculationBuilder.getItems()[0].getKey(), "1", "item key");

		var oExpressionBuilder = oCalculationBuilder._oExpressionBuilder;
		oExpressionBuilder._oCurrentItem = oCalculationBuilder.getItems()[0];
		oExpressionBuilder._updateOrCreateItem({
			key: "\"\""
		});
		await nextUIUpdate();

		assert.equal(oCalculationBuilder.getItems().length, 1, "items length");
		assert.equal(oCalculationBuilder.getItems()[0].getKey(), "\"\"", "item key");
		assert.equal(oCalculationBuilder.getExpression(), "\"\"", "item key");

		oCalculationBuilder.setExpression("\"a\" + \"\"");
		await nextUIUpdate();

		assert.equal(oCalculationBuilder.getItems().length, 3, "items length");
		assert.equal(oCalculationBuilder.getItems()[0].getKey(), "\"a\"", "item key");
		assert.equal(oCalculationBuilder.getItems()[1].getKey(), "+", "item key");
		assert.equal(oCalculationBuilder.getItems()[2].getKey(), "\"\"", "item key");

		assert.equal(oCalculationBuilder.getExpression(), "\"a\" + \"\"", "item key");

		// allowStringLiterals = false
		oCalculationBuilder.setAllowStringLiterals(false);
		oCalculationBuilder.setExpression("\"\"");
		await nextUIUpdate();

		assert.equal(oExpressionBuilder._aErrors.length, 1, "item key");
		oCalculationBuilder.setAllowStringLiterals(true);
		await nextUIUpdate();
		assert.equal(oExpressionBuilder._aErrors.length, 0, "item key");

		oCalculationBuilder.setExpression("");
		oCalculationBuilder.setAllowStringLiterals(false);
		await nextUIUpdate();

		oExpressionBuilder._oCurrentItem = oExpressionBuilder._getNewItem();
		oExpressionBuilder._oCurrentItem._bIsNew = true;
		oExpressionBuilder._updateOrCreateItem({
			key: "\"\""
		});

		await nextUIUpdate();
		assert.equal(oExpressionBuilder._aErrors.length, 1, "item key");

		oCalculationBuilder.destroy();
	});

	QUnit.test("Runtime", async function (assert) {
		var oCalculationBuilder = new CalculationBuilder({
			allowStringLiterals: true,
			expression: "a + 5"
		});
		await render(oCalculationBuilder);
		assert.ok(oCalculationBuilder._oExpressionBuilder._aErrors.length > 0, "Errors");
		assert.ok(oCalculationBuilder.$("input-input").hasClass("sapCalculationBuilderInputError"), "Has error class");


		oCalculationBuilder.addVariable(new CalculationBuilderVariable({
			key: "a"
		}));
		await nextUIUpdate();
		oCalculationBuilder.validate();
		assert.ok(oCalculationBuilder._oExpressionBuilder._aErrors.length === 0, "Errors");
		assert.ok(!oCalculationBuilder.$("input-input").hasClass("sapCalculationBuilderInputError"), "Has error class");

		await nextUIUpdate();
		assert.ok(oCalculationBuilder._oExpressionBuilder._aErrors.length === 0, "Errors");
		assert.ok(!oCalculationBuilder.$("input-input").hasClass("sapCalculationBuilderInputError"), "Has error class");

		oCalculationBuilder.destroy();
	});

	QUnit.test("Calculation Builder Variable Popup", async function(assert){
        var oCalculationBuilder = new CalculationBuilder({
            allowStringLiterals: true,
            expression: "a + 5"
        });
        oCalculationBuilder.addVariable(new CalculationBuilderVariable({
            key: "a"
        }));
        var calBuilderVariable = sinon.stub(oCalculationBuilder, "getVariables").returns([]);
        await render(oCalculationBuilder);
        await nextUIUpdate();
		assert.equal(Object.keys(oCalculationBuilder._oExpressionBuilder._mGroups).length, 1, "variable added");
        calBuilderVariable.restore();
    });

	QUnit.test("Error states", async function (assert) {
		var oCalculationBuilder = new CalculationBuilder({
			expression: "",
			layoutType: "VisualOnly"
		});
		await render(oCalculationBuilder);
		assert.ok(!oCalculationBuilder.$("erroricon").is(":visible"), "Not visible");

		oCalculationBuilder.appendError({
			title: "Maslo"
		});
		oCalculationBuilder.updateErrorsDisplay();

		assert.ok(!oCalculationBuilder.$("erroricon").is(":visible"), "Visible");

		oCalculationBuilder.setLayoutType("TextualOnly");
		await nextUIUpdate();

		assert.ok(!oCalculationBuilder.$("input-input").hasClass("sapCalculationBuilderInputError"), "No Error");

		oCalculationBuilder.appendError({
			title: "Maslo"
		});
		oCalculationBuilder.updateErrorsDisplay();

		assert.ok(oCalculationBuilder.$("input-input").hasClass("sapCalculationBuilderInputError"), "No Error");
		var oCalculationBuilderDom = oCalculationBuilder.getDomRef();
		if (oCalculationBuilderDom && oCalculationBuilderDom.querySelectorAll(".sapCalculationBuilderInputErrorArea") && oCalculationBuilderDom.querySelectorAll(".sapCalculationBuilderInputErrorArea")[0]) {
			assert.ok(getComputedStyle(oCalculationBuilderDom.querySelectorAll(".sapCalculationBuilderInputErrorArea")[0]).zIndex, "Z-Index is set");
                }
		oCalculationBuilder.destroy();
	});

	QUnit.test("Check direct inputs for Operators and Literals on main Popover page.", async function (assert) {
		var oCalculationBuilder = new CalculationBuilder({
			allowStringLiterals: true
		});
		await render(oCalculationBuilder);

		// Main page
		var sMainPageId = oCalculationBuilder.getId() + "-expression-pagemain";
		var oNavContainer = oCalculationBuilder._oExpressionBuilder._oPopover.getContent()[0];
		assert.ok(oNavContainer, "Popover has navigation container");
		var oCurrentPage = oNavContainer.getCurrentPage();
		assert.strictEqual(oCurrentPage.getId(), sMainPageId, "Main page is shown in popup");
		var aMainPageContent = oCurrentPage.getContent();
		assert.ok((aMainPageContent.length > 0) && aMainPageContent[1], "Literals Page content OK");

		// Outer wrapper
		var oOuterWrapper = aMainPageContent[1];
		assert.ok(oOuterWrapper.hasStyleClass("sapCalculationBuilderItemPopupOperatorsAndInputWrapper"), "Outer wrapper styling is correct.");
		assert.ok(oOuterWrapper.isA("sap.m.VBox"), "Operator and Literal input are wrapped in a VBox");

		// Wrapper content
		var aMainPageContentItems = oOuterWrapper.getItems();
		assert.ok((aMainPageContentItems.length > 0) && aMainPageContentItems[0] && aMainPageContentItems[1], "Content Items OK");

		// Operators
		var aOperatorsWrapper = aMainPageContentItems[0];
		assert.ok(aOperatorsWrapper.isA("sap.m.HBox"), "Operators are wrapped in a HBox");
		assert.ok(
			aOperatorsWrapper.hasStyleClass("sapCalculationBuilderItemPopupOperators")
			&& aOperatorsWrapper.hasStyleClass("sapCalculationBuilderItemPopupOptionItem"), "Operators wrapper styling is correct."
		);

		// Individual operator items
		var aOrderedExpectedDefaultOperators = ["+", "-", "/", "*", "(", ")", ","];
		aOperatorsWrapper.getItems().forEach(function(oItem, i) {
			assert.ok(oItem.isA("sap.m.Button"), "Item in Operators is a button.");
			assert.strictEqual(oItem.getText(), aOrderedExpectedDefaultOperators[i],
				"Button should have text: " + aOrderedExpectedDefaultOperators[i] + ", has: " + oItem.getText());
		});

		// Literal input - wrapper
		var aLiteralsInputWrapper = aMainPageContentItems[1];
		assert.ok(aLiteralsInputWrapper.isA("sap.m.VBox"), "Literal input is wrapped in a VBox");
		assert.ok(
			aLiteralsInputWrapper.hasStyleClass("sapCalculationBuilderItemPopupLiteralLabelAndInput")
			&& aLiteralsInputWrapper.hasStyleClass("sapCalculationBuilderItemPopupOptionItem"), "Literals input wrapper styling is correct."
		);

		// Individual items in Literals section
		var aLiteralsItems = aLiteralsInputWrapper.getItems();
		assert.ok((aLiteralsItems.length > 0) && aLiteralsItems[0] && aLiteralsItems[1], "Literals wrapper content OK.");
		var oLiteralLabel = aLiteralsItems[0];
		var oLiteralInput = aLiteralsItems[1];
		assert.ok(oLiteralLabel.isA("sap.m.Label"), "Label found");
		assert.strictEqual(oLiteralLabel.getText(), oResourceBundle.getText("CALCULATION_BUILDER_LITERAL_INPUT_LABEL"));
		assert.ok(oLiteralInput.isA("sap.m.Input"), "Input found");
		assert.strictEqual(oLiteralInput.getPlaceholder(), oResourceBundle.getText("CALCULATION_BUILDER_ADD_LITERAL_FIELD_PLACEHOLDER_ANY_STRING"));

		// Switch to Numeric Literals only
		oCalculationBuilder.setAllowStringLiterals(false);
		await nextUIUpdate(); // required refresh

		// retrieve input again because the control is reinstantiated
		// shortcuts with try/catch to not have a hundred lines to get to the controls
		try {
			oLiteralInput = oCalculationBuilder._oExpressionBuilder._oPopover.getContent()[0].getCurrentPage().getContent()[1].getItems()[1].getItems()[1];
		} catch (err) {
			assert.ok(false, "Could not reach Literals input after changing 'allowStringLiterals' property. Error: " + err.message);
			return;
		}
		assert.ok(oLiteralInput.isA("sap.m.StepInput"), "Literal input should be a StepInput control now");

		oCalculationBuilder.destroy();
	});

	QUnit.test("Check validation of Literals input and footer button behavior.", async function (assert) {
		var oCalculationBuilder = new CalculationBuilder({
			allowStringLiterals: true
		});
		await render(oCalculationBuilder);
		var oLiteralsInput;

		// open up the popover - otherwise valueState changes are postponed by the sap.m.Input
		oCalculationBuilder._oExpressionBuilder._getNewItem()._buttonPress({});

		// shortcuts with try/catch to not have a hundred lines to get to the controls
		// if any of them are missing it is a failure anyway
		try {
			oLiteralsInput = oCalculationBuilder._oExpressionBuilder._oPopover.getContent()[0].getCurrentPage().getContent()[1].getItems()[1].getItems()[1];
		} catch (err) {
			assert.ok(false, "Could not reach Literals input - check popover structure. Error: " + err.message);
			return;
		}

		var oPageFooter;
		try {
			oPageFooter = oCalculationBuilder._oExpressionBuilder._oPopover.getContent()[0].getCurrentPage().getFooter();
		} catch (err) {
			assert.ok(false, "Could not reach footer bar - check popover structure. Error: " + err.message);
			return;
		}

		var aFooterItems = oPageFooter.getContent();
		assert.ok((aFooterItems.length > 0), "Footer Items OK");

		// spacer
		var oTlbrSpacer = aFooterItems[0];
		assert.ok(oTlbrSpacer.isA("sap.m.ToolbarSpacer"), "Toolbar spacer present in footer");

		// ok button
		var oOkButton = aFooterItems[1];
		assert.ok(oOkButton.isA("sap.m.Button"), "Button present in footer on position 1");
		assert.strictEqual(oOkButton.getText(), oResourceBundle.getText("CALCULATION_BUILDER_CONFIRM_BUTTON"),
			"Button has text " + oResourceBundle.getText("CALCULATION_BUILDER_CONFIRM_BUTTON"));
		assert.notOk(oOkButton.getEnabled(), "OK Button is not clickable");

		// delete button
		var oDeleteButton = aFooterItems[2];
		assert.ok(oDeleteButton.isA("sap.m.Button"), "Button present in footer on position 2");
		assert.strictEqual(oDeleteButton.getText(), oResourceBundle.getText("CALCULATION_BUILDER_DELETE_BUTTON"),
			"Button has text " + oResourceBundle.getText("CALCULATION_BUILDER_DELETE_BUTTON"));
		assert.notOk(oDeleteButton.getEnabled(), "Delete button is not clickable");

		// close button
		var oCloseButton = aFooterItems[3];
		assert.ok(oCloseButton.isA("sap.m.Button"), "Button present in footer on position 2");
		assert.strictEqual(oCloseButton.getText(), oResourceBundle.getText("CALCULATION_BUILDER_CLOSE_BUTTON"),
			"Button has text " + oResourceBundle.getText("CALCULATION_BUILDER_CLOSE_BUTTON"));
		assert.ok(oCloseButton.getEnabled(), "Close button is clickable");

		// validation
		oLiteralsInput.setValue("\"");
		oLiteralsInput.fireLiveChange({value: "\""}); // .setValue does not trigger event
		assert.ok(oLiteralsInput.getValueState() === "Error", "Input is in error state.");
		assert.notOk(oOkButton.getEnabled(), "OK button is not clickable anymore");

		// delete button for existing item
		oCalculationBuilder.updateOrCreateItem("\"SomeString\"");
		var oLiteralItem = oCalculationBuilder.getItems()[0];
		assert.ok(oLiteralItem, "Item created");
		oLiteralItem._buttonPress({});

		// delete button needs to be re-retrieved due to rerendering on open
		try {
			oDeleteButton = oCalculationBuilder._oExpressionBuilder._oPopover.getContent()[0].getCurrentPage().getFooter().getContent()[2];
		} catch (err) {
			assert.ok(false, "Could not reach delete button - check popover structure. Error: " + err.message);
			return;
		}
		assert.ok(oDeleteButton.getEnabled(), "Delete button is now clickable");

		oCalculationBuilder.destroy();
	});

	QUnit.test("Ensure that navigation open/closes the fullscreen", async function (assert) {
		await render(this.oCalculationBuilder);
		var oToggleMethodSpy = this.spy(this.oCalculationBuilder, "_toggleFullScreen");
		var oToggleButton = this.oCalculationBuilder.getToolbar().getContent()[4];
		assert.equal(this.oCalculationBuilder._bIsFullScreen, false, "fullscreen is off");
		oToggleButton.firePress();
		assert.strictEqual(document.activeElement.getAttribute('aria-label'), oResourceBundle.getText("CALCULATION_BUILDER_ENTER_FULL_SCREEN_BUTTON"), 'The toggle button has focus in full screen');
		assert.equal(oToggleMethodSpy.calledWith(oToggleButton), true, "Toggle Method has been called");
		assert.equal(this.oCalculationBuilder._bIsFullScreen, true, "fullscreen is on");
		assert.equal(this.oCalculationBuilder._bIsFullScreen, true, "fullscreen is on");
		oToggleButton.firePress();
		assert.equal(this.oCalculationBuilder._bIsFullScreen, false, "fullscreen is off");

	});
	QUnit.test("Ensure tooltip and icon is set correctly in fullscreen", async function (assert) {
		await render(this.oCalculationBuilder);
		var oToggleButton = this.oCalculationBuilder.getToolbar().getContent()[4];
		assert.equal(this.oCalculationBuilder.getToolbar().getContent()[4].getTooltip_AsString(), oResourceBundle.getText("CALCULATION_BUILDER_ENTER_FULL_SCREEN_BUTTON"), "Enter Full Screen Tooltip set correctly");
		assert.equal(this.oCalculationBuilder.getToolbar().getContent()[4].getIcon(), "sap-icon://full-screen", "Enter Full Screen Icon set correctly");
		oToggleButton.firePress();
		assert.equal(this.oCalculationBuilder._bIsFullScreen, true, "fullscreen is on");
		assert.equal(this.oCalculationBuilder.getToolbar().getContent()[4].getTooltip_AsString(), oResourceBundle.getText("CALCULATION_BUILDER_EXIT_FULL_SCREEN_BUTTON"), "Exit Full Screen Tooltip set correctly");
		assert.equal(this.oCalculationBuilder.getToolbar().getContent()[4].getIcon(), "sap-icon://exit-full-screen", "Exit Full Screen Icon set correctly");

	});
	QUnit.test("Ensure the variable map is updated upon aggregation update", async function (assert) {
		await render(this.oCalculationBuilder);
		assert.ok(this.oCalculationBuilder._oExpressionBuilder._mVariableMap["testcolumn1"],"TestColumn1 exists in the map");
		this.oCalculationBuilder.addVariable(new CalculationBuilderVariable({
			key: "NewColumn"
		}));
		await nextUIUpdate();
		assert.ok(this.oCalculationBuilder._oExpressionBuilder._mVariableMap["newcolumn"],"NewColumn exists in the map");
	});

});
