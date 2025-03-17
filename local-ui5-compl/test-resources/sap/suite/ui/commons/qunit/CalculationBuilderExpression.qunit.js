sap.ui.define([
	"jquery.sap.global",
	"sap/suite/ui/commons/CalculationBuilder",
	"sap/suite/ui/commons/CalculationBuilderItem",
	"sap/suite/ui/commons/CalculationBuilderVariable",
	"sap/suite/ui/commons/CalculationBuilderFunction",
	"sap/suite/ui/commons/library",
	"sap/ui/core/Item",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/ui/qunit/utils/nextUIUpdate",
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/events/KeyCodes",
	"sap/ui/core/Lib"
], function (jQuery, CalculationBuilder, CalculationBuilderItem, CalculationBuilderVariable, CalculationBuilderFunction, suiteLibrary,
			 Item, createAndAppendDiv, nextUIUpdate, QUnitUtils, KeyCodes, CoreLib) {
	"use strict";

	createAndAppendDiv("content");

	var CalculationBuilderOperatorType = suiteLibrary.CalculationBuilderOperatorType,
		CalculationBuilderFunctionType = suiteLibrary.CalculationBuilderFunctionType,
		CalculationBuilderItemType = suiteLibrary.CalculationBuilderItemType;

	async function render(oElement) {
		oElement.placeAt("content");
		await nextUIUpdate();
	}

	function fnItemsToString(aItems) {
		var sItems = "";
		aItems.forEach(function (oItem) {
			sItems += oItem.getKey();
		});
		return sItems;
	}

	function fnSetItemsFromString(oCalculationBuilder, sExpression) {
		var aNewItems = oCalculationBuilder._oInput._stringToItems(sExpression);

		oCalculationBuilder.removeAllItems();
		aNewItems.forEach(function (oItem) {
			oCalculationBuilder.addItem(oItem);
		});
		return oCalculationBuilder;
	}

	QUnit.module("CalculationBuilderExpression", {
		beforeEach: async function () {
			this.oResourceBundle = CoreLib.getResourceBundleFor("sap.suite.ui.commons");
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
				],
				functions: [
					new CalculationBuilderFunction({
						key: "SUM",
						items: [
							new CalculationBuilderItem({
								key: ""
							}),
							new CalculationBuilderItem({
								key: ","
							}),
							new CalculationBuilderItem({
								key: ""
							})
						]
					})
				]
			}).placeAt("qunit-fixture");
			await nextUIUpdate();
		},
		afterEach: function () {
			this.oCalculationBuilder.destroy();
		}
	});

	QUnit.test("pressing space should perform the same action as pressing enter", async function (assert) {
		var oCalculationBuilder = this.oCalculationBuilder,
			oExpressionBuilder = oCalculationBuilder._oExpressionBuilder,
			oItem = new CalculationBuilderItem({
				key: "TestColumn1"
			});
		var oStub = sinon.spy(oExpressionBuilder, "_handleEnter");
		await render(oCalculationBuilder);

		oCalculationBuilder.addItem(oItem);
		await nextUIUpdate();

		var oItemDomRef = oItem.getDomRef();
		oItemDomRef.focus();
		QUnitUtils.triggerKeydown(oItemDomRef, KeyCodes.SPACE);
		await nextUIUpdate();

		assert.ok(oStub.calledOnce, "Enter handler called when space is pressed");
	});

	QUnit.test("title is present in popover", async function (assert) {
		var oCalculationBuilder = this.oCalculationBuilder,
			oExpressionBuilder = oCalculationBuilder._oExpressionBuilder;
		await render(oCalculationBuilder);
		assert.equal(oExpressionBuilder._oPopover.getTitle(), this.oResourceBundle.getText('CALCULATION_BUILDER_DIALOG_TITLE'), "Title is present in popover");
		assert.ok(oExpressionBuilder._oPopover.getShowHeader(), "Title is present in popover");
	});

	QUnit.test("Select/deselect and move one item to right (next)", async function (assert) {
		var oTestObject, $selectedItem, aItems, sExpression;

		var aTestObjects = [{
			startExpression: "1 + + +",
			endExpression: "+ 1 + +",
			direction: "next",
			moves: 1,
			selectedIndex: 0,
			text: "One move to right"
		}, {
			startExpression: "1 + + +",
			endExpression: "+ + + 1",
			direction: "next",
			moves: 4,
			selectedIndex: 0,
			text: "Max right index"
		}];

		assert.expect(aTestObjects.length);
		await render(this.oCalculationBuilder);

		for (var i = 0; i < aTestObjects.length; i++) {
			oTestObject = aTestObjects[i];
			sExpression = oTestObject.startExpression;

			for (var iMoves = 0; iMoves < oTestObject.moves; iMoves++) {
				fnSetItemsFromString(this.oCalculationBuilder, sExpression);
				await nextUIUpdate();

				aItems = this.oCalculationBuilder.getItems();
				$selectedItem = jQuery("#" + aItems[oTestObject.selectedIndex + iMoves].getId())[0];

				this.oCalculationBuilder._oExpressionBuilder._selectItem($selectedItem);
				this.oCalculationBuilder._oExpressionBuilder._moveItems(oTestObject.direction);
				await nextUIUpdate();

				sExpression = this.oCalculationBuilder._oInput._getText();
			}

			assert.equal(sExpression, oTestObject.endExpression, oTestObject.text);
		}
	});

	QUnit.test("Select Items from - to", async function (assert) {
		var oFirstItem, oSecondItem;

		assert.expect(3);

		fnSetItemsFromString(this.oCalculationBuilder, "+ + + + + +");
		await render(this.oCalculationBuilder);
		oFirstItem = this.oCalculationBuilder.getItems()[0];
		oSecondItem = this.oCalculationBuilder.getItems()[3];

		oFirstItem._buttonPress({
			ctrlKey: true
		});
		await nextUIUpdate();
		assert.equal(jQuery(".ui-selected").length, 1);

		oSecondItem._buttonPress({
			shiftKey: true
		});
		await nextUIUpdate();
		assert.equal(jQuery(".ui-selected").length, 4);

		oFirstItem._buttonPress({
			ctrlKey: true
		});
		await nextUIUpdate();
		assert.equal(jQuery(".ui-selected").length, 3);
	});

	QUnit.test("Get Variable by key", function (assert) {
		assert.expect(3);

		assert.equal(this.oCalculationBuilder._oExpressionBuilder._getVariableByKey("TestColumn"), null, "If key is not in columns return null.");
		assert.equal(this.oCalculationBuilder._oExpressionBuilder._getVariableByKey("TestColumn1"), this.oCalculationBuilder.getVariables()[0], "If item is in CalculationBuilder return column.");
		assert.equal(this.oCalculationBuilder._oExpressionBuilder._getVariableByKey("TestColumn2"), this.oCalculationBuilder.getVariables()[1], "If item is in CalculationBuilder return column.");
	});

	QUnit.test("Test Expand all columns", async function (assert) {
		var aItems = [
			new CalculationBuilderItem({
				key: "TestColumn2"
			}),
			new CalculationBuilderItem({
				key: CalculationBuilderOperatorType["+"]
			}),
			new CalculationBuilderItem({
				key: 200
			}),
			new CalculationBuilderItem({
				key: CalculationBuilderOperatorType["-"]
			}),
			new CalculationBuilderItem({
				key: "TestColumn1"
			})
		];

		assert.expect(3);

		// Set expression: TestColumn2 + 200 - TestColumn1
		aItems.forEach(function (oItem) {
			this.oCalculationBuilder.addItem(oItem);
		}.bind(this));
		await render(this.oCalculationBuilder);

		assert.equal(fnItemsToString(this.oCalculationBuilder.getItems()), "TestColumn2+200-TestColumn1");
		this.oCalculationBuilder._oExpressionBuilder._expandAllVariables();
		await nextUIUpdate();
		assert.equal(fnItemsToString(this.oCalculationBuilder.getItems()), "(TestColumn1)+200-(100)", "Expand all columns.");
		this.oCalculationBuilder._oExpressionBuilder._expandAllVariables();
		assert.equal(fnItemsToString(this.oCalculationBuilder.getItems()), "((100))+200-(100)", "Expand all columns.");
	});

	QUnit.test("Update or create new Item", async function (assert) {
		var oExpressionBuilder = this.oCalculationBuilder._oExpressionBuilder,
			oItem;

		assert.expect(15);

		await render(this.oCalculationBuilder);

		oExpressionBuilder._oCurrentItem = oExpressionBuilder._getNewItem();
		oExpressionBuilder._oCurrentItem._bIsNew = true;
		oExpressionBuilder._updateOrCreateItem({
			key: "123"
		});
		oItem = this.oCalculationBuilder.getItems()[0];
		assert.ok(oItem._isLiteral());
		assert.equal(oItem.getKey(), "123");
		assert.equal(oExpressionBuilder._oCurrentItem.getDomRef().getAttribute("role"), "button");
		assert.equal(oExpressionBuilder.getDomRef().querySelectorAll(".sapCalculationBuilderItem").length, 1, "One item has been added");

		oExpressionBuilder._oCurrentItem = oItem;
		oExpressionBuilder._oCurrentItem._bIsNew = false;
		oExpressionBuilder._updateOrCreateItem({
			key: CalculationBuilderFunctionType.ABS
		});
		assert.ok(oItem._isFunction());
		assert.equal(oItem.getKey(), CalculationBuilderFunctionType.ABS);
		assert.equal(oExpressionBuilder.getDomRef().querySelectorAll(".sapCalculationBuilderItem").length, 1, "One item has been added");


		oExpressionBuilder._oCurrentItem = oExpressionBuilder._getNewItem();
		oExpressionBuilder._oCurrentItem._bIsNew = true;
		oExpressionBuilder._updateOrCreateItem({
			key: "TestColumn1"
		});
		oItem = this.oCalculationBuilder.getItems()[1];
		assert.ok(oItem._isVariable());
		assert.equal(oItem.getKey(), "TestColumn1");
		assert.equal(oExpressionBuilder._oCurrentItem.getDomRef().getAttribute("role"), "button");
		assert.equal(oExpressionBuilder.getDomRef().querySelectorAll(".sapCalculationBuilderItem").length, 2, "Two items have been added");


		oExpressionBuilder._oCurrentItem = oExpressionBuilder._getNewItem();
		oExpressionBuilder._oCurrentItem._bIsNew = true;
		oExpressionBuilder._updateOrCreateItem({
			key: CalculationBuilderFunctionType.RoundUp
		});
		oItem = this.oCalculationBuilder.getItems()[2];
		assert.ok(oItem._isFunction());
		assert.equal(oItem.getKey(), CalculationBuilderFunctionType.RoundUp);
		assert.equal(oExpressionBuilder._oCurrentItem.getDomRef().getAttribute("role"), "button");
		assert.equal(oExpressionBuilder.getDomRef().querySelectorAll(".sapCalculationBuilderItem").length, 3, "3 items have been added");
	});

	QUnit.test("Validation test", async function (assert) {
		var aTestingObjects = [
				{expression: "1+2+3", errorCount: 0},
				{expression: "Round(Round(,),)", errorCount: 3},
				{expression: "Round(2, ()", errorCount: 3},
				{expression: "Round( , ) 5", errorCount: 3},
				{expression: "2 + + + * 3", errorCount: 2},
				{expression: "sum(2) 5", errorCount: 1},
				{expression: "-3-(-3)-Round(-(-3), -(-3))", errorCount: 0, text: "Unary minus support"},
				{expression: "+3+(+3)+Round(+(+3), +(+3))", errorCount: 0},
				{expression: "( 1 + TestColumn1 )", errorCount: 0},
				{expression: "+ 1", errorCount: 0},
				{expression: "1 +", errorCount: 1},
				{expression: "1 -", errorCount: 1},
				{expression: "1 /", errorCount: 1},
				{expression: "1 *", errorCount: 1},
				{expression: "ABS ( ) + 5", errorCount: 1},
				{
					errorCount: 0,
					expression: "+ ABS(1) - ABS(2) * ABS(3) / ABS(ABS(4))",
					text: "Before Function can be +, -, *, /, Function"
				},
				{
					errorCount: 0,
					expression: "+ TestColumn1 - TestColumn2 * TestColumn1 / ( TestColumn2 ) + 1 + 2 - 3 * 4 / 5 + ( - 6)",
					text: "After Column or Variable can be +, -, *, /, Function"
				}
			],
			oCalculationBuilder = this.oCalculationBuilder,
			oExpressionBuilder = oCalculationBuilder._oExpressionBuilder,
			oInput = oCalculationBuilder._oInput;

		assert.expect(aTestingObjects.length);
		await render(oCalculationBuilder);

		aTestingObjects.forEach(function (oTestingObject) {
			oCalculationBuilder.removeAllItems();
			oInput._stringToItems(oTestingObject.expression).forEach(function (oItem) {
				oCalculationBuilder.addItem(oItem);
			});
			assert.equal(oExpressionBuilder._validateSyntax().length, oTestingObject.errorCount, oTestingObject.text || "");
		});
	});

	QUnit.test("Validation of first/starting Item", async function (assert) {
		var aAllowedExpressions = [
				"+ 1", "- 1", "NOT 1"
			],
			aNotAllowedExpressions = [
				"* 1", "/ 1", "AND 1", "OR 1", "XOR 1", "< 1", "> 1", "<= 1", ">= 1", "= 1", "!= 1"
			],
			oCalculationBuilder = this.oCalculationBuilder,
			oExpressionBuilder = oCalculationBuilder._oExpressionBuilder,
			oInput = oCalculationBuilder._oInput;

		var fnTestArray = function (aExpressions, nErrorCount) {
			aExpressions.forEach(function (oExpression) {
				oCalculationBuilder.removeAllItems();
				oInput._stringToItems(oExpression).forEach(function (oItem) {
					oCalculationBuilder.addItem(oItem);
				});
				assert.equal(oExpressionBuilder._validateSyntax().length, nErrorCount, (nErrorCount > 0 ? "Not allowed: " : "Allowed: ") + oExpression);
			});
		};

		assert.expect(aAllowedExpressions.length + aNotAllowedExpressions.length);
		await render(oCalculationBuilder);

		fnTestArray(aAllowedExpressions, 0);
		fnTestArray(aNotAllowedExpressions, 1);
	});

	QUnit.test("Add item with wrong Key or Type", async function (assert) {
		var oCalculationBuilder = new CalculationBuilder({
				items: [
					new CalculationBuilderItem({
						key: "wrongKey"
					})
				]
			}),
			oItem1 = new CalculationBuilderItem({
				key: CalculationBuilderOperatorType["+"]
			});

		assert.expect(2);
		oCalculationBuilder.addItem(oItem1);
		await render(oCalculationBuilder);
		assert.equal(fnItemsToString(oCalculationBuilder.getItems()), "wrongKey+");
		assert.equal(oItem1.getType(), CalculationBuilderItemType.Operator);
		oCalculationBuilder.destroy();
	});

	QUnit.test("Custom tokens", async function (assert) {
		var oCalculationBuilder = new CalculationBuilder({
			items: [
				new CalculationBuilderItem({
					key: "CustomFunction"
				}),
				new CalculationBuilderItem({
					key: "CustomOperator"
				})
			],
			operators: [new Item({
				key: "CustomOperator",
				text: "custom operator"
			})],
			functions: [new CalculationBuilderFunction({
				key: "CustomFunction",
				label: "Custom function"
			})]
		});

		assert.expect(2);
		await render(oCalculationBuilder);
		var aItems = oCalculationBuilder.getItems();

		assert.equal(aItems[0].$().find(".sapCalculationBuilderItemLabel")[0].innerText, "Custom function", "Custom function");
		assert.equal(aItems[1].$().find(".sapCalculationBuilderItemLabel")[0].innerText, "custom operator", "custom operator");
		oCalculationBuilder.destroy();
	});

	QUnit.test("Function \"empty\" items", async function (assert) {
		var oCalculationBuilder = new CalculationBuilder({
			items: [
				new CalculationBuilderItem({
					key: "Abs"
				}),
				new CalculationBuilderItem({
					key: ""
				}),
				new CalculationBuilderItem({
					key: ")"
				})
			]
		});

		var oFunction = oCalculationBuilder._getFunctionMap()["round"];

		var fnCompare = function (sKeys) {
			var sItems = oCalculationBuilder.getItems().map(function (oItem) {
				return oItem.getKey();
			}).join(";");

			return sItems.toLowerCase() === sKeys.toLowerCase();
		};

		await render(oCalculationBuilder);


		oCalculationBuilder._oExpressionBuilder._oCurrentItem = oCalculationBuilder.getItems()[1];
		oCalculationBuilder._oExpressionBuilder._updateOrCreateItem({
			functionObject: oFunction,
			key: "Round",
			type: "Function"
		});

		assert.expect(4);
		var aKeys = ["abs", "round", "", ",", "", ")", ")"].join(";");
		assert.ok(fnCompare(aKeys), "Function params ABS");
		assert.equal(oCalculationBuilder.getExpression(), "Abs(Round(, ))", "Expression");

		oCalculationBuilder.setExpression("1+");
		await nextUIUpdate();

		// adding new item
		oCalculationBuilder._oExpressionBuilder._oCurrentItem = null;
		oCalculationBuilder._oExpressionBuilder._updateOrCreateItem({
			functionObject: oFunction,
			key: "Round",
			type: "Function"
		});

		var aKeys = ["1", "+", "Round", "", ",", "", ")"].join(";");
		assert.ok(fnCompare(aKeys), "Function params 1+Round");
		assert.equal(oCalculationBuilder.getExpression(), "1 + Round(, )", "Expression");

		oCalculationBuilder.destroy();
	});

	QUnit.test("Set expression tests", async function (assert) {
		var oCalculationBuilder = new CalculationBuilder({
			items: [
				new CalculationBuilderItem({
					key: "Abs"
				}),
				new CalculationBuilderItem({
					key: ""
				}),
				new CalculationBuilderItem({
					key: ")"
				})
			]
		});

		await render(oCalculationBuilder);

		assert.expect(11);
		assert.equal(oCalculationBuilder.getExpression(), "Abs()", "Expression");

		oCalculationBuilder.setExpression("1 +  1");
		await nextUIUpdate();
		assert.equal(oCalculationBuilder.getExpression(), "1 + 1", "Expression");

		oCalculationBuilder.setExpression("");
		await nextUIUpdate();
		assert.equal(oCalculationBuilder.getExpression(), "", "Expression");
		assert.equal(oCalculationBuilder.getItems().length, 0, "Expression");

		oCalculationBuilder.addItem(new CalculationBuilderItem({
			key: "1"
		}));
		oCalculationBuilder.addItem(new CalculationBuilderItem({
			key: "+"
		}));

		await nextUIUpdate();

		assert.equal(oCalculationBuilder.getExpression(), "1 +", "Expression");
		assert.equal(oCalculationBuilder.getItems().length, 2, "Expression");

		oCalculationBuilder.addItem(new CalculationBuilderItem({
			key: "Abs"
		}));
		oCalculationBuilder.addItem(new CalculationBuilderItem({
			key: ""
		}));
		oCalculationBuilder.addItem(new CalculationBuilderItem({
			key: ")"
		}));
		await nextUIUpdate();

		assert.equal(oCalculationBuilder.getExpression(), "1 + Abs()", "1 + Abs()");
		assert.equal(oCalculationBuilder.getItems().length, 5, "5 Items");

		oCalculationBuilder.removeAllItems();
		await nextUIUpdate();

		assert.equal(oCalculationBuilder.getExpression(), "");
		oCalculationBuilder.addItem(new CalculationBuilderItem({
			key: "+"
		}));

		await nextUIUpdate();
		assert.equal(oCalculationBuilder.$("input-input").text(), "+");
		assert.equal(oCalculationBuilder.getItems()[0].getKey(), "+");

		oCalculationBuilder.destroy();
	});

	QUnit.test("+/- tests", async function (assert) {
		var oCalculationBuilder = new CalculationBuilder();
		oCalculationBuilder.setExpression("10+10");
		await render(oCalculationBuilder);
		assert.ok(oCalculationBuilder.getErrors().length === 0, "No error");

		oCalculationBuilder.setExpression("10+ + 10");
		await nextUIUpdate();
		assert.ok(oCalculationBuilder.getErrors().length === 0, "No error");

		oCalculationBuilder.setExpression("10+ + +10");
		await nextUIUpdate();
		assert.ok(oCalculationBuilder.getErrors().length === 1, "1 error");

		oCalculationBuilder.setExpression("10+ + 10");
		await nextUIUpdate();
		assert.ok(oCalculationBuilder.getErrors().length === 0, "No error - test without rendering (just validation)");

		oCalculationBuilder.setExpression("10+ +  + - 10");
		await nextUIUpdate();
		assert.ok(oCalculationBuilder.getErrors().length === 2, "2 errors");

		oCalculationBuilder.setExpression("10+ - 10");
		await nextUIUpdate();
		assert.ok(oCalculationBuilder.getErrors().length === 0, "No error - with minus");

		oCalculationBuilder.setExpression("10 - - 10");
		await nextUIUpdate();
		assert.ok(oCalculationBuilder.getErrors().length === 0, "No error");

		oCalculationBuilder.setExpression("10 - - +10");
		await nextUIUpdate();
		assert.ok(oCalculationBuilder.getErrors().length === 1, "1 error");

		oCalculationBuilder.destroy();
	});

	QUnit.test("Delimiter hover test", async function (assert) {
		var $selectedItem, aItems, $selectedItemDelimiter, $newItemButton,
			fnDone = assert.async();

		await render(this.oCalculationBuilder);

		fnSetItemsFromString(this.oCalculationBuilder, "1 + 2");
		await nextUIUpdate();

		aItems = this.oCalculationBuilder.getItems();
		$selectedItem = jQuery(jQuery("#" + aItems[0].getId())[0]);
		$selectedItemDelimiter = jQuery($selectedItem.next(".sapCalculationBuilderDelimiter")[0]);
		$newItemButton = $selectedItemDelimiter.find(".sapCalculationBuilderDelimiterNewButton");
		$selectedItemDelimiter.trigger("mouseover");

		assert.equal($newItemButton.css("display"), "none", "new button hidden initially");

		setTimeout(function() {
			assert.equal($newItemButton.css("display"), "block", "new button visible upon delimiter mouseover");
			$selectedItemDelimiter.trigger("mouseout");

			setTimeout(function(){
				assert.equal($newItemButton.css("display"), "none", "new button hidden upon delimiter mouseout");
				fnDone();
			}, 800);

		}, 800);
	});
});
