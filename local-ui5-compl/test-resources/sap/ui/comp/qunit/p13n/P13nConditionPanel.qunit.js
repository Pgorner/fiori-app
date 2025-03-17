/*global QUnit, sinon */
sap.ui.define([
	"sap/ui/comp/p13n/P13nConditionPanel",
	"sap/m/ComboBox",
	"sap/ui/core/Item",
	"sap/ui/comp/filterbar/FilterGroupItem",
	"sap/m/library",
	'sap/ui/core/InvisibleMessage',
	"sap/ui/core/Lib",
	'sap/ui/core/library',
	'sap/ui/layout/Grid',
	"sap/m/Input"
], function(
	P13nConditionPanel,
	ComboBox,
	Item,
	FilterGroupItem,
	library,
	InvisibleMessage,
	Library,
	coreLibrary,
	Grid,
	Input
) {
	"use strict";

	var oRBComp = Library.getResourceBundleFor("sap.ui.comp"),
		InvisibleMessageMode = coreLibrary.InvisibleMessageMode;

	QUnit.module("Events", {
		beforeEach: function() {
			this.oP13nConditionPanel = new P13nConditionPanel();
		},
		afterEach: function() {
			this.oP13nConditionPanel = null;
		}
	});

	QUnit.test("fireDataChange with Exclude Operation", function (assert) {
		// Arrange
		var done = assert.async();
		this.oP13nConditionPanel.attachDataChange(function(oEvent){
			var oNewData = oEvent.getParameter("newData");
			// Assert
			assert.strictEqual(
				oNewData.operation,
				"Contains",
				"Types should match"
			);
			done();
		});

		// Act
		this.oP13nConditionPanel.fireDataChange({
			key: "sKey",
			index: 1,
			operation: "remove",
			newData: {
				"index": 1,
				"key": "condition_1",
				"exclude": false,
				"operation": "NotContains",
				"keyField": "ItemId",
				"value1": "TESTVOD1",
				"value2": null
			  }
		});
	});

	QUnit.test("_createValueField should return a combobox for fields with fixed values", function(assert) {
		// Arrange
		var oControl,
			sName = "CompanyName",
			oConditionGrid = this.oP13nConditionPanel._oConditionsGrid.getContent()[0],
			oKeyField = {key: sName, text: "Name", type: "string", maxLength: "20"};

		P13nConditionPanel._createKeyFieldTypeInstance(oKeyField);
		sinon.stub(this.oP13nConditionPanel, "data").returns([{name: sName}]);

		// Act
		oControl = this.oP13nConditionPanel._createValueField(oKeyField, "sInfo", oConditionGrid);

		// Assert
		assert.equal(oControl.isA("sap.m.ComboBox"), true, "The value control is of type sap.m.ComboBox");

	});

	QUnit.test("_createValueField with onpaste event checking conditions creation for include filters", function(assert) {
		// Arrange
		var done = assert.async(),
			oControl,
			sName = "CompanyName",
			oConditionGrid = this.oP13nConditionPanel._oConditionsGrid.getContent()[0],
			oKeyField = {key: sName, text: "Name", type: "string", maxLength: "20"},
			sStringWithLineEndings = "A\r\nB\r\nC\r",
			oEvent = {
				originalEvent: {
					clipboardData: {
						getData: function () {
							return sStringWithLineEndings;
						},
						setData: function () {}
					}
				}
			};


		P13nConditionPanel._createKeyFieldTypeInstance(oKeyField);
		oControl = this.oP13nConditionPanel._createValueField(oKeyField, "sInfo", oConditionGrid);
		oControl.setSelectedKey("Contains");
		oConditionGrid.operation = oControl;
		oEvent["srcControl"] = oControl;
		sinon.stub(oControl, "getParent").returns(oConditionGrid);
		sinon.stub(this.oP13nConditionPanel, "_getCurrentKeyFieldItem").returns(oKeyField);

		this.oP13nConditionPanel.attachEvent("dataChange", function () {
			if (this.getConditions().length === 3){
				// Assert
				assert.equal(this.getConditions()[0].value1, "A", "The condition is correctly created with A value");
				assert.equal(this.getConditions()[0].text, "*A*", "The condition is correctly created with A text");
				assert.equal(this.getConditions()[1].value1, "B", "The condition is correctly created with B value");
				assert.equal(this.getConditions()[1].text, "*B*", "The condition is correctly created with B text");
				assert.equal(this.getConditions()[2].value1, "C", "The condition is correctly created with C value");
				assert.equal(this.getConditions()[2].text, "*C*", "The condition is correctly created with C ");
				done();
			}
		});

		//Act
		oControl.onpaste(oEvent);

	});

	QUnit.test("_createValueField with onpaste event checking conditions creation for exclude filters", function(assert) {
		// Arrange
		var done = assert.async(),
			oControl,
			sName = "CompanyName",
			oConditionGrid = this.oP13nConditionPanel._oConditionsGrid.getContent()[0],
			oKeyField = {key: sName, text: "Name", type: "string", maxLength: "20"},
			sStringWithLineEndings = "A\r\nB\r\nC\r",
			oEvent = {
				originalEvent: {
					clipboardData: {
						getData: function () {
							return sStringWithLineEndings;
						},
						setData: function () {}
					}
				}
			};


		P13nConditionPanel._createKeyFieldTypeInstance(oKeyField);
		oControl = this.oP13nConditionPanel._createValueField(oKeyField, "sInfo", oConditionGrid);
		oControl.setSelectedKey("EQ");
		oConditionGrid.operation = oControl;
		oEvent["srcControl"] = oControl;
		sinon.stub(oControl, "getParent").returns(oConditionGrid);
		sinon.stub(this.oP13nConditionPanel, "_getCurrentKeyFieldItem").returns(oKeyField);
		sinon.stub(this.oP13nConditionPanel, "getExclude").returns(true);

		this.oP13nConditionPanel.attachEvent("dataChange", function () {
			if (this.getConditions().length === 3){
				// Assert
				assert.equal(this.getConditions()[0].value1, "A", "The condition is correctly created with A value");
				assert.equal(this.getConditions()[0].text, "!(=A)", "The condition is correctly created with A text");
				assert.equal(this.getConditions()[1].value1, "B", "The condition is correctly created with B value");
				assert.equal(this.getConditions()[1].text, "!(=B)", "The condition is correctly created with B text");
				assert.equal(this.getConditions()[2].value1, "C", "The condition is correctly created with C value");
				assert.equal(this.getConditions()[2].text, "!(=C)", "The condition is correctly created with C ");
				done();
			}
		});

		//Act
		oControl.onpaste(oEvent);

	});

	QUnit.test("_createValueField add delegate on after rendering on mobile device when the type is numeric", function(assert) {
		// Arrange
		var oControl,
			oP13nConditionPanel = new P13nConditionPanel(),
			sName = "CompanyNumber",
			oConditionGrid = this.oP13nConditionPanel._oConditionsGrid.getContent()[0],
			oKeyField = {key: sName, text: "Name", type: "numeric", maxLength: "20"};

		sinon.stub(oP13nConditionPanel, "_isPhone").returns(true);
		// Act

		oControl = oP13nConditionPanel._createValueField(oKeyField, "sInfo", oConditionGrid);
		sinon.stub(oControl, "getParent").returns(oConditionGrid);

		// Assert
		assert.equal(oControl.aDelegates.length, 2, "Delegates should be 2 ");
		assert.ok(oControl.aDelegates[1].oDelegate.onAfterRendering instanceof Function, "Has onAfterRendering delegate");
	});

	QUnit.test("_createValueField don't add delegate on after rendering on mobile device when the type is not numeric", function(assert) {
		// Arrange
		var oControl,
			oP13nConditionPanel = new P13nConditionPanel(),
			sName = "CompanyName",
			oConditionGrid = this.oP13nConditionPanel._oConditionsGrid.getContent()[0],
			oKeyField = {key: sName, text: "Name", type: "string", maxLength: "20"};

		sinon.stub(oP13nConditionPanel, "_isPhone").returns(true);
		sinon.stub(oP13nConditionPanel, "_isTablet").returns(true);

		// Act

		oControl = oP13nConditionPanel._createValueField(oKeyField, "sInfo", oConditionGrid);
		sinon.stub(oControl, "getParent").returns(oConditionGrid);

		// Assert
		assert.equal(oControl.aDelegates.length, 1, "Delegates should be 2 ");
	});

	QUnit.test("_createValueField don't add delegate on after rendering when is not on mobile device", function(assert) {
		// Arrange
		var oControl,
			oP13nConditionPanel = new P13nConditionPanel(),
			sName = "CompanyName",
			oConditionGrid = this.oP13nConditionPanel._oConditionsGrid.getContent()[0],
			oKeyField = {key: sName, text: "Name", type: "numeric", maxLength: "20"};

		sinon.stub(oP13nConditionPanel, "_isPhone").returns(false);
		sinon.stub(oP13nConditionPanel, "_isTablet").returns(false);
		// Act

		oControl = oP13nConditionPanel._createValueField(oKeyField, "sInfo", oConditionGrid);
		sinon.stub(oControl, "getParent").returns(oConditionGrid);

		// Assert
		assert.equal(oControl.aDelegates.length, 1, "Delegates should be 2 ");
	});


	QUnit.test("_enableCondition should disable the condition dropdown for boolean fields", function(assert) {
		// Arrange
		var oConditionGrid = this.oP13nConditionPanel._oConditionsGrid.getContent()[0];
		sinon.stub(this.oP13nConditionPanel, "_getCurrentKeyFieldItem").returns({type: "boolean"});

		// Act
		this.oP13nConditionPanel._enableCondition(oConditionGrid, true);

		// Assert
		assert.equal(oConditionGrid.operation.getEnabled(), false, "Operations dropdown is not enabled");
	});

	QUnit.test("_getValueTextFromField should return the selected key if there is any", function(assert) {
		// Arrange
		var oControl = new ComboBox({
			value: "Value",
			items: [new Item({ key: "Key", text: "Text"})]
		});
		oControl.setSelectedKey("Key");
		var sValueText = this.oP13nConditionPanel._getValueTextFromField(oControl);

		assert.equal(sValueText, "Key", "The key is correctly returned");
	});

	QUnit.test("_getValueTextFromField should return selected key if it is empty string as well", function(assert) {
		// Arrange
		var oControl = new ComboBox({
			value: "Value",
			items: [new Item({ key: "", text: "Text"})]
		});
		oControl.setSelectedKey("Key");
		var sValueText = this.oP13nConditionPanel._getValueTextFromField(oControl);

		assert.equal(sValueText, "", "The key is correctly returned");
	});

	QUnit.test("_changeField event should not be called when the valueState is 'Error'", function (assert) {
		// Arrange
		var oFakeEvent = {
			getSource: function () {
				return new ComboBox();
			}
		},
		oStub = this.stub(this.oP13nConditionPanel, "_changeField");
		this.oP13nConditionPanel._makeFieldValid = function (oComboBox) {
			oComboBox.setValueState("Error");
		};
		// Act
		this.oP13nConditionPanel._handleComboBoxChangeEvent(null, oFakeEvent);
		// Assert
		assert.strictEqual(oStub.callCount, 0);
	 });

	QUnit.test("Check is default operation set", function (assert) {
		// Arrange
		var done = assert.async();
		var oConditionPanel = new P13nConditionPanel({defaultOperation:"EQ"});

		// Assert
		assert.equal(oConditionPanel.getDefaultOperation(), "EQ", "The value of default opetation should be 'EQ'");

		done();
		});

	QUnit.module("Accessibility", {
		beforeEach: function() {
			this.oP13nConditionPanel = new P13nConditionPanel();
		},
		afterEach: function() {
			this.oP13nConditionPanel = null;
		}
	});

	QUnit.test("After _createConditionRow value field should have correct aria-labelledBy", function(assert) {

		// Arrange
			var P13nConditionOperation = library.P13nConditionOperation,
				oCondition0 = { "key": "i0", "text": "", "operation": P13nConditionOperation.Ascending, "keyField": "Date", "value1": ""},
				aConditions = [oCondition0];

			 // system under test
			 var oP13nConditionPanel = new P13nConditionPanel({
				 maxConditions: -1
			 });

			 oP13nConditionPanel.setConditions(aConditions);

			 // assertions
			 var sIdP13nConditionPanelValueFieldAriaLabelledBy = oP13nConditionPanel._oConditionsGrid.getAggregation("content")[0].value1.getAriaLabelledBy()[0];
			 assert.strictEqual(sIdP13nConditionPanelValueFieldAriaLabelledBy, oP13nConditionPanel._oInvisibleTextOperatorInputValue.sId, "id of invisible text and id of getter ariaDescribedBy of the field should be equal");

	});

	QUnit.test("Add Button should correctly announce that condition is added", function(assert) {
		// Arrange
		sinon.stub(this.oP13nConditionPanel, "_handleAddCondition");
		this.oP13nConditionPanel._addButtons(this.oP13nConditionPanel._oConditionsGrid);
		this.oP13nConditionPanel._oInvisibleMessage = InvisibleMessage.getInstance();
		var oInvisibleMessageSpy = sinon.spy(this.oP13nConditionPanel._oInvisibleMessage, "announce");

		// Act
		this.oP13nConditionPanel._oConditionsGrid["add"].firePress();

		// Assert
		assert.equal(oInvisibleMessageSpy.calledWith(oRBComp.getText("VALUEHELPDLG_CONDITIONPANEL_CONDITION_ADDED"), InvisibleMessageMode.Polite), true, "Announcement for removed condition is correct");
		assert.equal(this.oP13nConditionPanel._handleAddCondition.called, true, "Handler for add condition is added");

		// Cleanup
		oInvisibleMessageSpy.restore();
	});

	QUnit.test("Add Button in the toolbar header should correctly announce that condition is added", function(assert) {
		// Arrange
		sinon.stub(this.oP13nConditionPanel, "_handleAddCondition");
		this.oP13nConditionPanel._createPaginatorToolbar();
		this.oP13nConditionPanel._oInvisibleMessage = InvisibleMessage.getInstance();
		var oInvisibleMessageSpy = sinon.spy(this.oP13nConditionPanel._oInvisibleMessage, "announce");

		// Act
		this.oP13nConditionPanel._oAddButton.firePress();

		// Assert
		assert.equal(oInvisibleMessageSpy.calledWith(oRBComp.getText("VALUEHELPDLG_CONDITIONPANEL_CONDITION_ADDED"), InvisibleMessageMode.Polite), true, "Announcement for removed condition is correct");
		assert.equal(this.oP13nConditionPanel._handleAddCondition.called, true, "Handler for add condition is added");

		// Cleanup
		oInvisibleMessageSpy.restore();
	});


	QUnit.test("Remove Button should correctly announce that condition is removed", function(assert) {
		// Arrange
		sinon.stub(this.oP13nConditionPanel, "_handleRemoveCondition");
		this.oP13nConditionPanel._addButtons(this.oP13nConditionPanel._oConditionsGrid);
		this.oP13nConditionPanel._oInvisibleMessage = InvisibleMessage.getInstance();
		var oInvisibleMessageSpy = sinon.spy(this.oP13nConditionPanel._oInvisibleMessage, "announce");

		// Act
		this.oP13nConditionPanel._oConditionsGrid["remove"].firePress();

		// Assert
		assert.equal(oInvisibleMessageSpy.calledWith(oRBComp.getText("VALUEHELPDLG_CONDITIONPANEL_CONDITION_REMOVED"), InvisibleMessageMode.Polite), true,  "Announcement for removed condition is correct");

		// Cleanup
		oInvisibleMessageSpy.restore();
	});

	QUnit.test("Remove Button should not announce that condition is removed if it is the first condition and it is empty", function(assert) {
		// Arrange
		this.oP13nConditionPanel._oInvisibleMessage = InvisibleMessage.getInstance();
		const oInvisibleMessageSpy = sinon.spy(this.oP13nConditionPanel._oInvisibleMessage, "announce"),
			oConditionGrid = new Grid();

		oConditionGrid.value1 = new Input();
		sinon.stub(this.oP13nConditionPanel, "_handleRemoveCondition");
		this.oP13nConditionPanel._addButtons(oConditionGrid);

		// Act
		oConditionGrid["remove"].firePress();

		// Assert
		assert.equal(oInvisibleMessageSpy.notCalled, true,  "Announcement for removed condition is not read out");

		// Cleanup
		oInvisibleMessageSpy.restore();
		oConditionGrid.destroy();
	});

	QUnit.test("Check whether Pagination is visible and Prev/Next buttons are enabled", function(assert) {
		// Arrange
		const oCondition = {"text": "=0001", "operation": "EQ", "keyField": "CompanyCode", "value1": "0001", "exclude": false},
			aConditions = [];
		let oToolbar,
			oPrevButton,
			oNextButton;

		for (let i = 0; i < this.oP13nConditionPanel._iConditionPageSize; i++) {
			oCondition.key = "key" + i;
			aConditions.push(oCondition);
		}
		this.oP13nConditionPanel.setConditions(aConditions);
		oPrevButton = this.oP13nConditionPanel._oPrevButton;
		oNextButton = this.oP13nConditionPanel._oNextButton;
		oToolbar = this.oP13nConditionPanel.getAggregation("content")[0];

		// assertions
		assert.strictEqual(typeof (oPrevButton), "undefined");
		assert.strictEqual(typeof (oNextButton), "undefined");
		assert.ok(typeof (oToolbar.isA("sap.ui.core.InvisibleText")));

		// Act
		aConditions.push(oCondition);
		this.oP13nConditionPanel.setConditions(aConditions);
		oPrevButton = this.oP13nConditionPanel._oPrevButton;
		oNextButton = this.oP13nConditionPanel._oNextButton;
		oToolbar = this.oP13nConditionPanel.getAggregation("content")[0];

		// assertions
		assert.ok(typeof (oPrevButton.isA("sap.m.Button")));
		assert.ok(typeof (oNextButton.isA("sap.m.Button")));
		assert.ok(typeof (oToolbar.isA("sap.m.OverflowToolbar")));
		assert.ok(!oPrevButton.getEnabled());
		assert.ok(oNextButton.getEnabled());

		// Act
		oNextButton.firePress();

		// assertions
		assert.ok(oPrevButton.getEnabled());
		assert.ok(!oNextButton.getEnabled());
	});

	QUnit.start();
});
