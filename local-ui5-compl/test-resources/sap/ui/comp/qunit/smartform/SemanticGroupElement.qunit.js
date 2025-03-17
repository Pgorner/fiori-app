
/* global QUnit, sinon */

sap.ui.define([
	"sap/ui/comp/library",
	"sap/ui/comp/smartform/SemanticGroupElement",
	"sap/ui/core/CustomData",
	"sap/ui/comp/smartfield/SmartField",
	"sap/ui/comp/smartfield/SmartLabel",
	"sap/ui/comp/navpopover/SmartLink",
	"sap/ui/comp/smartfield/Configuration",
	"sap/m/Label",
	"sap/m/Input",
	"sap/m/Text",
	"sap/ui/core/Element",
	"sap/ui/core/TooltipBase",
	"sap/base/util/merge"
],
	function(
		CompLib,
		SemanticGroupElement,
		CustomData,
		SmartField,
		SmartLabel,
		SmartLink,
		Configuration,
		Label,
		Input,
		Text,
		Element,
		TooltipBase,
		merge
	) {
	"use strict";

	var oSemanticGroupElement;

	// fake sap.ui.require to test async loading
	var aAsyncModules = [];
	function fakeSapUiRequire() {
		var fnSapUiRequire = sap.ui.require;
		sap.ui.require = function(vDependencies, fnCallback, fnErrCallback) {
			if (typeof vDependencies === 'string' && aAsyncModules.indexOf(vDependencies) >= 0) {
				return undefined;
			} else {
				return fnSapUiRequire(vDependencies, fnCallback, fnErrCallback);
			}
		};
		merge(sap.ui.require, fnSapUiRequire);
		sap.ui.require.restore = function() {
			sap.ui.require = fnSapUiRequire;
		};
	}

	function initTest() {
		fakeSapUiRequire();
		oSemanticGroupElement = new SemanticGroupElement("SGE1");
	}

	function afterTest() {
		oSemanticGroupElement.destroy();
		oSemanticGroupElement = undefined;
		aAsyncModules = [];
		sap.ui.require.restore();
	}

	QUnit.module("Instance", {
		beforeEach: initTest,
		afterEach: afterTest
	});

	QUnit.test("Shall be instantiable", function(assert) {
		assert.ok(oSemanticGroupElement, "SemanticGroupElement is created");
	});

	QUnit.test("getFormElement", function(assert) {
		var oFormElement = oSemanticGroupElement.getFormElement();
		assert.equal(oFormElement, oSemanticGroupElement);
	});

	QUnit.test("Delimiter", function(assert) {
		assert.equal(oSemanticGroupElement.getDelimiter(), "/", "default delimiter");
		oSemanticGroupElement.setDelimiter("*");
		assert.equal(oSemanticGroupElement.getDelimiter(), "*", "new delimiter");
	});

	QUnit.test("getDataSourceLabel works as expected", function (assert) {
		// Arrange
		var oSmartField = new SmartField(),
			oSFGetDataSourceLabelStub = this.stub(oSmartField, "getDataSourceLabel").returns("MyTestLabel");

		oSemanticGroupElement.addElement(oSmartField);

		// Act
		oSemanticGroupElement.getDataSourceLabel();

		// Assert
		assert.strictEqual(oSFGetDataSourceLabelStub.callCount, 1, "Method is called once");
		assert.strictEqual(typeof oSemanticGroupElement.getDataSourceLabel, "function", "Protected method is available");
		assert.strictEqual(oSemanticGroupElement.getDataSourceLabel(), "MyTestLabel", "Method returns initial empty string value");

		// Cleanup
		oSFGetDataSourceLabelStub.restore();
		oSmartField.destroy();
	});

	QUnit.module("Elements", {
		beforeEach: initTest,
		afterEach: afterTest
	});

	QUnit.test("addElement", function(assert) {
		var oSmartField = new SmartField();

		oSemanticGroupElement.addElement(oSmartField);
		var aFields = oSemanticGroupElement.getFields();
		assert.equal(aFields.length, 1, "Control is added to \"fields\" aggregation");
		aFields = oSemanticGroupElement.getAggregation("elements", []);
		assert.equal(aFields.length, 0, "Control is not added to \"elements\" aggregation");
		assert.equal(oSmartField.getControlContext(), CompLib.smartfield.ControlContextType.Form, "ControlContext set on SmartField");

		oSemanticGroupElement.addElement();
		aFields = oSemanticGroupElement.getFields();
		assert.equal(aFields.length, 1, "Nothing is added to \"fields\" aggregation");

		assert.equal(oSemanticGroupElement.getDelimiter(), "/", "default delimiter");
	});

	QUnit.test("getElements", function(assert) {
		var oSmartField1 = new SmartField();
		var oSmartField2 = new SmartField();

		oSemanticGroupElement.addElement(oSmartField1);
		oSemanticGroupElement.addElement(oSmartField2);

		var aElements = oSemanticGroupElement.getElements();

		assert.equal(aElements.length, 2, "added elements returned");

		assert.equal(oSemanticGroupElement.getDelimiter(), "/", "default delimiter");
	});

	QUnit.test("indexOfElement", function(assert) {
		var oSmartField1 = new SmartField();
		var oSmartField2 = new SmartField();

		oSemanticGroupElement.addElement(oSmartField1);
		oSemanticGroupElement.addElement(oSmartField2);

		var iIndex = oSemanticGroupElement.indexOfElement(oSmartField1);
		assert.equal(iIndex, 0, "SmartField1 index");

		iIndex = oSemanticGroupElement.indexOfElement(oSmartField2);
		assert.equal(iIndex, 1, "SmartField2 index");

		oSmartField1.destroy();
		oSmartField2.destroy();
	});

	QUnit.test("insertElement", function(assert) {
		var oSmartField1 = new SmartField("SF1");
		var oSmartField2 = new SmartField("SF2");

		oSemanticGroupElement.insertElement(oSmartField1, 0);
		oSemanticGroupElement.insertElement(oSmartField2, 0);

		var aFields = oSemanticGroupElement.getFields();
		assert.equal(aFields.length, 2, "Controls are inserted to \"fields\" aggregation");
		assert.equal(aFields[0].getId(), "SF2", "Field2 is first field");
		assert.equal(aFields[1].getId(), "SF1", "Field1 is second field");
		var aElements = oSemanticGroupElement.getElements();
		assert.equal(aElements.length, 2, "Controls are returned by getElements");
		assert.equal(aElements[0].getId(), "SF2", "Field2 is first element");
		assert.equal(aElements[1].getId(), "SF1", "Field1 is second element");
		assert.equal(oSmartField1.getControlContext(), CompLib.smartfield.ControlContextType.Form, "ControlContext set on SmartField1");
		assert.equal(oSmartField2.getControlContext(), CompLib.smartfield.ControlContextType.Form, "ControlContext set on SmartField2");

		oSemanticGroupElement.insertElement(null, 0);
		aElements = oSemanticGroupElement.getElements();
		assert.equal(aElements.length, 2, "Nothing inserted");
	});

	QUnit.test("removeElement", function(assert) {
		var oSmartField0 = new SmartField("SF0");
		var oSmartField1 = new SmartField("SmartField1");
		var oSmartField2 = new SmartField("SF2");

		oSemanticGroupElement.addElement(oSmartField0);
		oSemanticGroupElement.addElement(oSmartField1);
		oSemanticGroupElement.addElement(oSmartField2);

		var oRemovedElement0 = oSemanticGroupElement.removeElement(0);
		assert.equal(oSmartField0, oRemovedElement0, "Field0 removed");
		assert.equal(oSmartField0.getControlContext(), CompLib.smartfield.ControlContextType.None, "ControlContext reset on SmartField0");

		var oRemovedElement1 = oSemanticGroupElement.removeElement(oSmartField1);
		assert.equal(oSmartField1, oRemovedElement1, "Field1 removed");
		assert.equal(oSmartField1.getControlContext(), CompLib.smartfield.ControlContextType.None, "ControlContext reset on SmartField1");

		var oRemovedElement2 = oSemanticGroupElement.removeElement("SF2");
		assert.equal(oSmartField2, oRemovedElement2, "Field2 removed");
		assert.equal(oSemanticGroupElement.getElements().length, 0, "All fields removed");
		assert.equal(oSmartField2.getControlContext(), CompLib.smartfield.ControlContextType.None, "ControlContext reset on SmartField2");

		oSmartField0.destroy();
		oSmartField1.destroy();
		oSmartField2.destroy();
	});

	QUnit.test("removeAllElements", function(assert) {
		var oSmartField0 = new SmartField();
		var oSmartField1 = new SmartField();

		oSemanticGroupElement.addElement(oSmartField0);
		oSemanticGroupElement.addElement(oSmartField1);

		var aRemoved = oSemanticGroupElement.removeAllElements();

		assert.deepEqual(aRemoved, [oSmartField0, oSmartField1], "All fields removed");
		assert.equal(oSemanticGroupElement.getElements().length, 0, "All fields removed");
		assert.equal(oSmartField0.getControlContext(), CompLib.smartfield.ControlContextType.None, "ControlContext reset on SmartField0");
		assert.equal(oSmartField1.getControlContext(), CompLib.smartfield.ControlContextType.None, "ControlContext reset on SmartField1");

		oSmartField0.destroy();
		oSmartField1.destroy();
	});

	QUnit.test("destroyElements", function(assert) {
		var oSmartField0 = new SmartField("SF1");
		var oSmartField1 = new SmartField("SF2");

		oSemanticGroupElement.addElement(oSmartField0);
		oSemanticGroupElement.addElement(oSmartField1);

		oSemanticGroupElement.destroyElements();

		assert.equal(oSemanticGroupElement.getElements().length, 0, "All fields removed");
		assert.notOk(Element.getElementById("SF1"), "Field1 is destroyed");
		assert.notOk(Element.getElementById("SF2"), "Field2 is destroyed");

	});

	QUnit.module("Label", {
		beforeEach: initTest,
		afterEach: afterTest
	});

	QUnit.test("setLabel as string", function(assert) {
		oSemanticGroupElement.setLabel("SOME TEXT");

		var sLabel = oSemanticGroupElement.getLabel();
		assert.ok(sLabel, "Label is not initial");
		assert.ok(typeof sLabel === "string", "Label is string");
		assert.equal(sLabel, "SOME TEXT", "Label text OK");

		var oLabel = oSemanticGroupElement.getLabelControl();
		assert.ok(oLabel, "Label control is not initial");
		assert.ok(oLabel instanceof Label, "Label control is sap.m.Label");
		assert.equal(oLabel.getText(), "SOME TEXT", "Label control text OK");
	});

	QUnit.test("setLabel as object", function(assert) {
		var oLabel = new Label("L1", {text: "SOME TEXT"});
		oSemanticGroupElement.setLabel(oLabel);

		var oLabelNew = oSemanticGroupElement.getLabel();
		assert.ok(oLabelNew, "Label is not initial");
		assert.ok(oLabel === oLabelNew, "Label is set");

		oLabelNew = oSemanticGroupElement.getLabelControl();
		assert.ok(oLabel === oLabelNew, "Label is used");
	});

	QUnit.test("getLabelText", function(assert) {
		oSemanticGroupElement.setLabel(new Label({
			text: "SOME TEXT"
		}));

		var sLabelText = oSemanticGroupElement.getLabelText();
		assert.equal(sLabelText, "SOME TEXT", "text is OK");
	});

	QUnit.test("Label text used with SmartField", function(assert) {
		oSemanticGroupElement.setLabel("Test");
		var oSmartField = new SmartField();
		oSemanticGroupElement.addElement(oSmartField);

		var oLabel = oSemanticGroupElement.getLabelControl();
		assert.ok(oLabel, "Label is not initial");
		assert.ok(oLabel instanceof SmartLabel, "Label is SmartLabel");
		assert.equal(oLabel.getLabelFor(), oSmartField.getId(), "Label points to SmartField");
		assert.equal(oLabel.getText(), "Test", "Label text used");
		assert.ok(oLabel._getField() === oSmartField, "Label._getField() points to SmartField");
		assert.equal(oSmartField.getTextLabel(), "Test", "Smartfield textLabel OK");

		// if text changes, existing Label must be reused
		oLabel._bXXXMyLabel = true;
		oSemanticGroupElement.setLabel("Label");
		var oLabelAfter = oSemanticGroupElement.getLabelControl();
		assert.ok(oLabelAfter._bXXXMyLabel, "Label reused");
		assert.equal(oLabelAfter.getText(), "Label", "Label has new text");

		// if Label assigned from outside, existing SmartLabel must be used
		var oNewLabel = new Label("L1", {text: "new Label", tooltip: "Label Tooltip"});
		oSemanticGroupElement.setLabel(oNewLabel);
		oLabelAfter = oSemanticGroupElement.getLabelControl();
		assert.ok(oLabelAfter instanceof SmartLabel, "Label is SmartLabel");
		assert.equal(oLabelAfter.getText(), "new Label", "Label has new text");

		oNewLabel.setText("new Text");
		assert.equal(oLabelAfter.getText(), "new Text", "Label has new text");

		oSemanticGroupElement.setLabel();
		oLabelAfter = oSemanticGroupElement.getLabelControl();
		assert.ok(oLabelAfter instanceof SmartLabel, "Label is SmartLabel");
		assert.notOk(oLabelAfter.getText(), "Label has no text");
		assert.notOk(oSmartField.getTextLabel(), "Smartfield has no textLabel");

		oSmartField.setTextLabel("XXX");
		oSemanticGroupElement.setLabel("YYY");
		oLabelAfter = oSemanticGroupElement.getLabelControl();
		assert.ok(oLabelAfter instanceof SmartLabel, "Label is SmartLabel");
		assert.equal(oLabelAfter.getText(), "YYY", "Label text");
		assert.equal(oSmartField.getTextLabel(), "YYY", "Smartfield textLabel");

		oSemanticGroupElement.removeElement(oSmartField);
		oLabelAfter = oSemanticGroupElement.getLabelControl();
		assert.ok(oLabelAfter instanceof Label, "Label is SmartLabel");
		assert.equal(oLabelAfter.getText(), "YYY", "Label text");
		assert.equal(oSmartField.getTextLabel(), "XXX", "Smartfield textLabel");

		oSmartField.destroy();
		oNewLabel.destroy();
	});

	QUnit.test("Label with text from SmartField", function(assert) {
		var oSmartField = new SmartField("SF1", {textLabel: "Hello"});
		oSemanticGroupElement.addElement(oSmartField);

		var oLabel = oSemanticGroupElement.getLabelControl();
		assert.ok(oLabel, "Label is not initial");
		assert.ok(oLabel instanceof SmartLabel, "Label is SmartLabel");
		assert.equal(oLabel.getLabelFor(), oSmartField.getId(), "Label points to SmartField");
		assert.equal(oLabel.getText(), "Hello", "Label text used");
		assert.equal(oSemanticGroupElement.getLabelText(), "Hello", "getLabelText returns SmartFields label text");
		assert.ok(oLabel._getField() === oSmartField, "Label._getField() points to SmartField");
		assert.equal(oSmartField.getTextLabel(), "Hello", "Smartfield textLabel OK");
		var sLabelId = oLabel.getId();

		oSemanticGroupElement.removeElement(oSmartField);
		oLabel = oSemanticGroupElement.getLabelControl();
		assert.notOk(!!oLabel, "no Label on SemanticGroupElement");
		assert.notOk(Element.getElementById(sLabelId), "Label is destroyed");
		oSmartField.destroy();
	});

	QUnit.test("Label from different SmartFields", function(assert) {
		oSemanticGroupElement.setLabel("LABEL");
		var oSmartField0 = new SmartField("SF0");
		var oSmartField1 = new SmartField("SF1", {textLabel:"Hello"});
		var oSmartField2 = new SmartField("SF2");

		oSemanticGroupElement.addElement(oSmartField0);
		oSemanticGroupElement.addElement(oSmartField1);
		oSemanticGroupElement.setElementForLabel(1);

		var oLabel = oSemanticGroupElement.getLabelControl();
		assert.ok(oLabel, "Label is not initial");
		assert.ok(oLabel instanceof SmartLabel, "Label is SmartLabel");
		assert.equal(oLabel.getLabelFor(), oSmartField1.getId(), "Label points to SmartField1");
		assert.equal(oLabel.getText(), "LABEL", "Label text used"); // SmartFields Label must not overwrite explicit set Label

		oSemanticGroupElement.addElement(oSmartField2);
		oLabel = oSemanticGroupElement.getLabelControl();
		assert.equal(oLabel.getLabelFor(), oSmartField1.getId(), "Label still points to SmartField1");

		oSemanticGroupElement.removeElement(oSmartField1);
		oLabel = oSemanticGroupElement.getLabelControl();
		assert.ok(oLabel, "Label is not initial");
		assert.equal(oLabel.getLabelFor(), oSmartField2.getId(), "Label points to SmartField2 after SmartField1 removed");
		assert.equal(oSmartField1.getTextLabel(), "Hello", "SmartField1 has original TextLabel set");

		oSemanticGroupElement.setElementForLabel(2);
		oSemanticGroupElement.removeElement(oSmartField0);
		oLabel = oSemanticGroupElement.getLabelControl();
		assert.ok(oLabel, "Label is not initial");
		assert.notOk(oLabel instanceof SmartLabel, "Label is not a SmartLabel");
		assert.equal(oLabel.getText(), "LABEL", "Label text used");

		oSemanticGroupElement.removeElement(oSmartField2);
		oLabel = oSemanticGroupElement.getLabelControl();
		assert.ok(oLabel, "Label is not initial");
		assert.notOk(oLabel instanceof SmartLabel, "Label is not a SmartLabel");
		assert.equal(oLabel.getText(), "LABEL", "Label text used");
		assert.notOk(oSmartField2.getTextLabel(), "SmartField2 has no TextLabel set");

		oSmartField0.destroy();
		oSmartField1.destroy();
		oSmartField2.destroy();
	});

	QUnit.test("moving Label from one SemanticGroupElement to an other", function(assert) {
		// it's an key user adaptation use case
		var oGroupElement2 = new SemanticGroupElement("GE2");
		var oSmartField1 = new SmartField("SF1", {textLabel:"SF1"});
		var oSmartField2 = new SmartField("SF2", {textLabel:"SF2"});
		oSemanticGroupElement.addElement(oSmartField1);
		oGroupElement2.addElement(oSmartField2);

		var oLabel1 = oSemanticGroupElement.getLabelControl();
		var oLabel2 = oGroupElement2.getLabelControl();
		assert.ok(oLabel1, "Label1 is not initial");
		assert.ok(oLabel1 instanceof SmartLabel, "Label1 is SmartLabel");
		assert.equal(oLabel1.getLabelFor(), oSmartField1.getId(), "Label1 points to SmartField1");
		assert.equal(oLabel1.getText(), "SF1", "SmartField1 Text used");
		assert.ok(oLabel2, "Label2 is not initial");
		assert.ok(oLabel2 instanceof SmartLabel, "Label2 is SmartLabel");
		assert.equal(oLabel2.getLabelFor(), oSmartField2.getId(), "Label2 points to SmartField2");
		assert.equal(oLabel2.getText(), "SF2", "SmartField2 Text used");

		oGroupElement2.removeElement(oSmartField2);
		oSemanticGroupElement.insertElement(oSmartField2, 0);
		oLabel1 = oSemanticGroupElement.getLabelControl();
		oLabel2 = oGroupElement2.getLabelControl();
		assert.ok(oLabel1, "Label1 is not initial");
		assert.ok(oLabel1 instanceof SmartLabel, "Label1 is SmartLabel");
		assert.equal(oLabel1.getLabelFor(), oSmartField2.getId(), "Label1 points to SmartField2");
		assert.equal(oLabel1.getText(), "SF2", "SmartField2 Text used");
		assert.notOk(oLabel2, "Label2 is initial");

		oSemanticGroupElement.removeElement(oSmartField1);
		oGroupElement2.addElement(oSmartField1);
		oLabel1 = oSemanticGroupElement.getLabelControl();
		oLabel2 = oGroupElement2.getLabelControl();
		assert.ok(oLabel1, "Label1 is not initial");
		assert.ok(oLabel1 instanceof SmartLabel, "Label1 is SmartLabel");
		assert.equal(oLabel1.getLabelFor(), oSmartField2.getId(), "Label1 points to SmartField2");
		assert.equal(oLabel1.getText(), "SF2", "SmartField2 Text used");
		assert.ok(oLabel2, "Label2 is not initial");
		assert.ok(oLabel2 instanceof SmartLabel, "Label2 is SmartLabel");
		assert.equal(oLabel2.getLabelFor(), oSmartField1.getId(), "Label1 points to SmartField2");
		assert.equal(oLabel2.getText(), "SF1", "SmartField1 Text used");

		oGroupElement2.destroy();
	});

	QUnit.test("setElementForLabel", function(assert) {
		oSemanticGroupElement.setElementForLabel(2);
		assert.equal(oSemanticGroupElement.getElementForLabel(), 2, "returned value OK");
	});

	QUnit.test("Label required (set on Label)", function(assert) {
		var oLabel = new Label("L1", {text: "Label", required: true});
		oSemanticGroupElement.setLabel(oLabel);
		var oField1 = new SmartField("I1");
		oSemanticGroupElement.addElement(oField1);
		assert.ok(oLabel.isRequired(), "Label flagged as required");
	});

	QUnit.test("Label required (set on SmartField)", function(assert) {
		oSemanticGroupElement.setLabel("Test");
		oSemanticGroupElement.setProperty("_editable", true); // as only editable fields can be required
		var oSmartField1 = new SmartField({mandatory: true});
		var oSmartField2 = new SmartField();
		oSemanticGroupElement.addElement(oSmartField1);
		oSemanticGroupElement.addElement(oSmartField2);
		var oLabel = oSemanticGroupElement.getLabelControl();
		assert.ok(oLabel.isRequired(), "Label flagged as required");

		sinon.spy(oLabel, "invalidate");
		oSmartField1.setMandatory(false);
		assert.notOk(oLabel.isRequired(), "Label not flagged as required");
		assert.ok(oLabel.invalidate.called, "Label invalidated");

		oSmartField2.setMandatory(true);
		assert.ok(oLabel.isRequired(), "Label flagged as required");
	});

	QUnit.test("Label displayOnly", function(assert) {
		var oLabel = new Label("L1", {text: "Label"});
		oSemanticGroupElement.setLabel(oLabel);
		assert.notOk(oLabel.isDisplayOnly(), "Label gets default DisplayOnly value");

		oLabel.setDisplayOnly(true);
		assert.ok(oLabel.isDisplayOnly(), "Label gets it's own DisplayOnly value");
	});

	QUnit.test("Label wrapping", function(assert) {
		var oLabel = new Label("L1", {text: "Label"});
		oSemanticGroupElement.setLabel(oLabel);
		assert.ok(oLabel.isWrapping(), "Label gets wrapping as default");

		var oSmartField = new SmartField();
		oSemanticGroupElement.addElement(oSmartField);

		var oMyLabel = oSemanticGroupElement.getLabelControl();
		assert.ok(oMyLabel.isWrapping(), "Label gets wrapping as default");

		oLabel.setWrapping(false);
		assert.notOk(oMyLabel.isWrapping(), "Label gets it's own wrapping value");
		oLabel.destroy();

		oSemanticGroupElement.setLabel("Label");
		oMyLabel = oSemanticGroupElement.getLabelControl();
		assert.ok(oMyLabel.isWrapping(), "Label gets wrapping as default");
	});

	QUnit.test("_getFieldRelevantForLabel", function(assert) {
		var oSmartField0 = new SmartField();
		var oSmartField1 = new SmartField();

		oSemanticGroupElement.addElement(oSmartField0);
		oSemanticGroupElement.addElement(oSmartField1);
		oSemanticGroupElement.setElementForLabel(1);

		var oField = oSemanticGroupElement._getFieldRelevantForLabel();
		assert.ok(oField === oSmartField1, "SmartField1 is used for Label");
	});

	QUnit.test("destroyLabel", function(assert) {
		oSemanticGroupElement.setLabel("Test");
		var oSmartField = new SmartField("SF1", {textLabel: "Hello"});
		oSemanticGroupElement.addElement(oSmartField);
		oSemanticGroupElement.destroyLabel();

		assert.notOk(oSemanticGroupElement.getLabel(), "getLabel returns no Label");
		var oLabel = oSemanticGroupElement.getLabelControl();
		assert.ok(oLabel, "Label is not initial");
		assert.ok(oLabel instanceof SmartLabel, "Label is SmartLabel");
		assert.equal(oLabel.getLabelFor(), oSmartField.getId(), "Label points to SmartField");
		assert.equal(oLabel.getText(), "Hello", "Label text used");
		assert.ok(oLabel._getField() === oSmartField, "Label._getField() points to SmartField");
		assert.equal(oSmartField.getTextLabel(), "Hello", "Smartfield textLabel");

		var oNewLabel = new Label("L1", {text: "new Label", tooltip: "Label Tooltip"});
		oSemanticGroupElement.setLabel(oNewLabel);
		oSemanticGroupElement.destroyLabel();
		assert.notOk(!!oSemanticGroupElement.getLabel(), "getLabel returns no Label");
		oLabel = oSemanticGroupElement.getLabelControl();
		assert.notOk(Element.getElementById("L1"), "New Label is destroyed");
		assert.ok(oLabel instanceof SmartLabel, "Label is SmartLabel");
		assert.equal(oLabel.getText(), "Hello", "Label has old text");
	});

	QUnit.module("Tooltip", {
		beforeEach: initTest,
		afterEach: afterTest
	});

	QUnit.test("setTooltip as string", function(assert) {
		oSemanticGroupElement.setTooltip("SOME TOOLTIP");

		var sTooltip = oSemanticGroupElement.getTooltip();
		assert.ok(sTooltip, "Tooltip is not initial");
		assert.ok(typeof sTooltip === "string", "Tooltip is string");
		assert.equal(sTooltip, "SOME TOOLTIP", "Tooltip text OK");
	});

	QUnit.test("setTooltip as object", function(assert) {
		var oTooltip = new TooltipBase({text: "SOME TOOLTIP"});
		oSemanticGroupElement.setTooltip(oTooltip);

		var oTooltipNew = oSemanticGroupElement.getTooltip();
		assert.ok(oTooltipNew, "Tooltip is not initial");
		assert.ok(oTooltip === oTooltipNew, "Tooltip is the same like set");
		assert.equal(oTooltipNew.getText(), "SOME TOOLTIP", "Tooltip text is OK");
	});

	QUnit.test("Tooltip assigned to label", function(assert) {
		oSemanticGroupElement.setTooltip("Tooltip");
		var oField1 = new Text();
		oSemanticGroupElement.addElement(oField1);

		var oLabel = oSemanticGroupElement.getLabelControl();
		assert.equal(oLabel.getTooltip(), "Tooltip", "Label has Tooltip from SemanticGroupElement");

		oSemanticGroupElement.setTooltip("Tooltip2");
		oLabel = oSemanticGroupElement.getLabelControl();
		assert.equal(oLabel.getTooltip(), "Tooltip2", "Label has new Tooltip");
	});

	QUnit.test("Tooltip assigned to SmartField", function(assert) {
		var oTooltip = new TooltipBase({text: "Tooltip"});
		oSemanticGroupElement.setTooltip(oTooltip);
		var oField1 = new SmartField();
		oSemanticGroupElement.addElement(oField1);

		assert.equal(oField1.getTooltipLabel(), "Tooltip", "SmartField has TooltipLabel from SemanticGroupElement");

		oSemanticGroupElement.setTooltip("Tooltip2");
		assert.equal(oField1.getTooltipLabel(), "Tooltip2", "SmartField has new TooltipLabel");

		var oLabel = new Label("L1", {text: "Label", tooltip: "Label Tooltip"});
		oSemanticGroupElement.setLabel(oLabel);

		assert.equal(oField1.getTooltipLabel(), "Label Tooltip", "SmartField has new TooltipLabel");
	});

	QUnit.module("CustomData", {
		beforeEach: initTest,
		afterEach: afterTest
	});

	QUnit.test("Precedence (BCP: 2270118842)", function (assert) {
		// Arrange
		var oSF = new SmartField(),
			oPropagated = new CustomData({key: "defaultTextInEditModeSource", value: "ValueListNoValidation"}),
			oSpecific = new CustomData({key: "defaultTextInEditModeSource", value: "ValueList"});

		// ACT
		oSF.addCustomData(oSpecific);
		oSemanticGroupElement.addElement(oSF);
		oSemanticGroupElement.addCustomData(oPropagated);

		// Assert
		assert.strictEqual(
			oSF.data("defaultTextInEditModeSource"),
			oSpecific.getValue(),
			"Specific custom data not overridden by propagation"
		);
		assert.strictEqual(oSF.getCustomData()[0], oSpecific,
			"Instance is the same as set");

		// Cleanup
		oSF.destroy();
	});

	QUnit.test("addCustomData", function(assert) {
		var oSmartField1 = new SmartField();
		var oSmartField2 = new SmartField();
		var oSmartField3 = new SmartField();
		var oCustomData = new CustomData({key: "KEY", value: "VALUE"});
		var oCustomData2 = new CustomData({key: "sap.ui.fl:AppliedChanges", value: "VALUE"});
		var oCustomData3 = new CustomData({key: "sap-ui-custom-settings", value: "VALUE"});

		oSemanticGroupElement.addElement(oSmartField1);
		oSemanticGroupElement.addCustomData(oCustomData);
		oSemanticGroupElement.addCustomData(oCustomData2); // must not be inherited
		oSemanticGroupElement.addCustomData(oCustomData3); // must not be inherited
		oSemanticGroupElement.addElement(oSmartField2);
		oSemanticGroupElement.insertElement(oSmartField3, 0);

		var aCustomData = oSemanticGroupElement.getCustomData();
		assert.equal(aCustomData.length, 3, "CustomData set on SemanticGroupElement");
		assert.equal(aCustomData[0], oCustomData, "CustomData set on SemanticGroupElement");
		assert.equal(aCustomData[1], oCustomData2, "CustomData set on SemanticGroupElement");
		assert.equal(aCustomData[2], oCustomData3, "CustomData set on SemanticGroupElement");

		aCustomData = oSmartField1.getCustomData();
		assert.equal(aCustomData.length, 1, "Only one CustomData on SmartField");
		assert.equal(aCustomData[0].getKey(), oCustomData.getKey(), "CustomData on SmartField same key");
		assert.equal(aCustomData[0].getValue(), oCustomData.getValue(), "CustomData on SmartField same value");
		assert.ok(aCustomData[0].getId() != oCustomData.getId(), "Different instance of CustomData on SmartField");

		aCustomData = oSmartField2.getCustomData();
		assert.equal(aCustomData.length, 1, "Only one CustomData on SmartField2");
		assert.equal(aCustomData[0].getKey(), oCustomData.getKey(), "CustomData on SmartField2 same key");
		assert.equal(aCustomData[0].getValue(), oCustomData.getValue(), "CustomData on SmartField2 same value");
		assert.ok(aCustomData[0].getId() != oCustomData.getId(), "Different instance of CustomData on SmartField2");

		aCustomData = oSmartField3.getCustomData();
		assert.equal(aCustomData.length, 1, "Only one CustomData on SmartField3");
		assert.equal(aCustomData[0].getKey(), oCustomData.getKey(), "CustomData on SmartField3 same key");
		assert.equal(aCustomData[0].getValue(), oCustomData.getValue(), "CustomData on SmartField3 same value");
		assert.ok(aCustomData[0].getId() != oCustomData.getId(), "Different instance of CustomData on SmartField3");

		oSemanticGroupElement.removeElement(oSmartField2);
		aCustomData = oSmartField2.getCustomData();
		assert.equal(aCustomData.length, 0, "no CustomData on SmartField2 after remove");
		oSmartField2.destroy();

		oSemanticGroupElement.addCustomData(); // should not break
		aCustomData = oSemanticGroupElement.getCustomData();
		assert.equal(aCustomData.length, 3, "no new CustomData set on SemanticGroupElement");
	});

	QUnit.test("insertCustomData", function(assert) {
		var oSmartField1 = new SmartField();
		var oCustomData = new CustomData({key: "KEY", value: "VALUE"});
		var oCustomData2 = new CustomData({key: "sap.ui.fl:AppliedChanges", value: "VALUE"});
		var oCustomData3 = new CustomData({key: "sap-ui-custom-settings", value: "VALUE"});

		oSemanticGroupElement.addElement(oSmartField1);
		oSemanticGroupElement.insertCustomData(oCustomData, 0);
		oSemanticGroupElement.insertCustomData(oCustomData2, 0); // must not be inherited
		oSemanticGroupElement.insertCustomData(oCustomData3, 1); // must not be inherited

		var aCustomData = oSemanticGroupElement.getCustomData();
		assert.equal(aCustomData.length, 3, "CustomData set on SemanticGroupElement");
		assert.equal(aCustomData[0], oCustomData2, "CustomData set on SemanticGroupElement");
		assert.equal(aCustomData[1], oCustomData3, "CustomData set on SemanticGroupElement");
		assert.equal(aCustomData[2], oCustomData, "CustomData set on SemanticGroupElement");

		aCustomData = oSmartField1.getCustomData();
		assert.equal(aCustomData.length, 1, "Only one CustomData on SmartField");
		assert.equal(aCustomData[0].getKey(), oCustomData.getKey(), "CustomData on SmartField same key");
		assert.equal(aCustomData[0].getValue(), oCustomData.getValue(), "CustomData on SmartField same value");
		assert.ok(aCustomData[0].getId() != oCustomData.getId(), "Different instance of CustomData on SmartField");

		oSemanticGroupElement.insertCustomData(null, 0); // should not break
		aCustomData = oSemanticGroupElement.getCustomData();
		assert.equal(aCustomData.length, 3, "no new CustomData set on SemanticGroupElement");
	});

	QUnit.test("removeCustomData", function(assert) {
		var oSmartField1 = new SmartField({
			customData: new CustomData({key: "KEY0", value: "VALUE0"})
		});
		var oCustomData1 = new CustomData({key: "KEY1", value: "VALUE1"});
		var oCustomData2 = new CustomData({key: "KEY2", value: "VALUE2"});

		oSemanticGroupElement.addElement(oSmartField1);
		oSemanticGroupElement.addCustomData(oCustomData1);
		oSemanticGroupElement.addCustomData(oCustomData2);
		oSemanticGroupElement.removeCustomData(1);

		var aCustomData = oSmartField1.getCustomData();
		assert.equal(aCustomData.length, 2, "CustomData removed from SmartField");
		assert.equal(aCustomData[0].getKey(), "KEY0", "first customData left");
		assert.equal(aCustomData[1].getKey(), "KEY1", "last customData left");

		oCustomData1.destroy();
	});

	QUnit.test("removeAllCustomData", function(assert) {
		var oSmartField1 = new SmartField({
			customData: new CustomData({key: "KEY0", value: "VALUE0"})
		});
		var oCustomData1 = new CustomData({key: "KEY1", value: "VALUE1"});
		var oCustomData2 = new CustomData({key: "KEY2", value: "VALUE2"});

		oSemanticGroupElement.addElement(oSmartField1);
		oSemanticGroupElement.addCustomData(oCustomData1);
		oSemanticGroupElement.addCustomData(oCustomData2);
		var aCustomData = oSemanticGroupElement.removeAllCustomData();

		assert.equal(aCustomData.length, 2, "two CustomData removed from SmartField");
		aCustomData = oSmartField1.getCustomData();
		assert.equal(aCustomData.length, 1, "CustomData removed from SmartField");
		assert.equal(aCustomData[0].getKey(), "KEY0", "first customData left");

		oCustomData1.destroy();
		oCustomData2.destroy();
	});

	QUnit.test("destroyCustomData", function(assert) {
		var oSmartField1 = new SmartField({
			customData: new CustomData({key: "KEY0", value: "VALUE0"})
		});
		var oCustomData1 = new CustomData("CD1", {key: "KEY1", value: "VALUE1"});
		var oCustomData2 = new CustomData("CD2", {key: "KEY2", value: "VALUE2"});

		oSemanticGroupElement.addElement(oSmartField1);
		oSemanticGroupElement.addCustomData(oCustomData1);
		oSemanticGroupElement.addCustomData(oCustomData2);
		oSemanticGroupElement.destroyCustomData();

		var aCustomData = oSmartField1.getCustomData();
		assert.equal(aCustomData.length, 1, "CustomData removed from SmartField");
		assert.equal(aCustomData[0].getKey(), "KEY0", "first customData left");
		assert.notOk(Element.getElementById("CD1"), "CustomData destroyed");
	});

	QUnit.test("displayBehaviour set via SemanticGroupElement customData shall be set to smart fields", function(assert) {
		var oSmartField1 = new SmartField();
		oSmartField1.setConfiguration(new Configuration({
			"displayBehaviour": "idOnly"
		}));
		var oSmartField2 = new SmartField();

		oSemanticGroupElement.addElement(oSmartField1);
		oSemanticGroupElement.addElement(oSmartField2);

		oSemanticGroupElement.addCustomData(new CustomData({
			"key": "defaultDropDownDisplayBehaviour",
			"value": "idAndDescription"
		}));

		var aFields = oSemanticGroupElement.getFieldsForRendering();
		assert.equal(oSmartField1.getConfiguration().getDisplayBehaviour(), "idOnly", "do not overwrite settings on smart field level");
		assert.notOk(oSmartField2.getConfiguration(), "SmartField2 has no configuration");
		assert.equal(oSmartField2.data("defaultDropDownDisplayBehaviour"), "idAndDescription", "value transformed to smart field");
		assert.equal(oSemanticGroupElement.getProperty("_editable"), false, "display mode");
		assert.notOk(aFields[1] && aFields[1].isA("sap.m.Text"), "Delimiter not rendered");
		assert.equal(aFields[1] && aFields[1].getText && aFields[1].getText(), undefined, "Delimiter symbol shouldn't be rendered in display mode");

	});

	QUnit.module("Other", {
		beforeEach: initTest,
		afterEach: afterTest
	});

	QUnit.test("setVisible", function(assert) {
		var bVisibleChanged = false;
		oSemanticGroupElement.attachVisibleChanged(function(oEvent) {
			bVisibleChanged = true;
		});

		assert.notOk(oSemanticGroupElement.isVisible(), "SemanticGroupElement is not visible as no fields are assigned");

		oSemanticGroupElement.setVisible(false);
		assert.notOk(oSemanticGroupElement.getVisible(), "Visibility set");
		assert.notOk(oSemanticGroupElement.isVisible(), "SemanticGroupElement is not visible");
		assert.notOk(bVisibleChanged, "VisibleChanged event not fired");
		bVisibleChanged = false;

		oSemanticGroupElement.setVisible(true);
		assert.ok(oSemanticGroupElement.getVisible(), "Visibility set");
		assert.ok(oSemanticGroupElement.isVisible(), "SemanticGroupElement is visible as explicit set");
		assert.ok(bVisibleChanged, "VisibleChanged event fired");
	});

	QUnit.test("visibility from elements", function(assert) {
		var bVisibleChanged = false;
		oSemanticGroupElement.attachVisibleChanged(function(oEvent) {
			bVisibleChanged = true;
		});

		var oSmartField = new SmartField();
		oSemanticGroupElement.addElement(oSmartField);
		assert.ok(oSemanticGroupElement.isVisible(), "SemanticGroupElement visible because of visible field");
		assert.ok(bVisibleChanged, "VisibleChanged event fired");
		bVisibleChanged = false;

		sinon.spy(oSemanticGroupElement, "invalidate");
		oSmartField.setVisible(false);
		assert.notOk(oSemanticGroupElement.isVisible(), "SemanticGroupElement invisible because of invisible field");
		assert.ok(oSemanticGroupElement.getVisible(), "SemanticGroupElement visible property still set");
		assert.ok(bVisibleChanged, "VisibleChanged event fired");
		assert.ok(oSemanticGroupElement.invalidate.called, "SemanticGroupElement invalidated");
		bVisibleChanged = false;

		oSmartField.setVisible(true);
		assert.ok(oSemanticGroupElement.isVisible(), "SemanticGroupElement visible because of visible field");
		assert.ok(bVisibleChanged, "VisibleChanged event fired");
		bVisibleChanged = false;

		oSmartField.setVisible(false);
		bVisibleChanged = false;
		oSemanticGroupElement.setVisible(true);
		assert.ok(oSemanticGroupElement.isVisible(), "SemanticGroupElement visible because set on property");
		assert.ok(bVisibleChanged, "VisibleChanged event fired");
	});

	QUnit.test("getVisibleBasedOnElements", function(assert) {
		var oSmartField0 = new SmartField({
			visible: false
		});
		var oSmartField1 = new SmartField({
			visible: false
		});

		var bVisible = oSemanticGroupElement.getVisibleBasedOnElements();
		assert.notOk(bVisible, "not visible if no fields are assigned");

		oSemanticGroupElement.addElement(oSmartField0);
		oSemanticGroupElement.addElement(oSmartField1);

		bVisible = oSemanticGroupElement.getVisibleBasedOnElements();
		assert.notOk(bVisible, "not visible if all fields are not visible");

		oSmartField1.setVisible(true);
		bVisible = oSemanticGroupElement.getVisibleBasedOnElements();
		assert.ok(bVisible, "visible if at least one field is visible");
	});

	QUnit.test("clone", function(assert) {
		var oSmartField1 = new SmartField("SF1", {textLabel: "Hello"});
		var oSmartField2 = new SmartField("SF2");
		var oLabel = new Label("L1", {text: "Label"});
		var oCustomData = new CustomData("CD1", {key: "KEY", value: "VALUE"});

		oSemanticGroupElement.addCustomData(oCustomData);
		oSemanticGroupElement.setLabel(oLabel);
		oSemanticGroupElement.addElement(oSmartField1);
		oSemanticGroupElement.addElement(oSmartField2);

		var oClone = oSemanticGroupElement.clone("myClone");

		// check if original is still OK
		var aElements = oSemanticGroupElement.getElements();
		assert.equal(aElements.length, 2, "Original: has 2 Elements");
		assert.equal(aElements[0].getId(), "SF1", "Original: first element");
		assert.equal(aElements[1].getId(), "SF2", "Original: second element");
		assert.equal(oSemanticGroupElement.getLabelText(), "Label", "Original: Label text");
		assert.equal(oSemanticGroupElement.getLabel().getId(), "L1", "Original: Label");
		assert.equal(oSemanticGroupElement._getLabel().getId(), "SF1-label", "Original: used Label");
		var aCustomData = oSemanticGroupElement.getCustomData();
		assert.equal(aCustomData.length, 1, "Original: Only one CustomData on SemanticGroupElement");
		assert.equal(aCustomData[0], oCustomData, "Original: CustomData");
		aCustomData = oSmartField1.getCustomData();
		assert.equal(aCustomData.length, 1, "Original: Only one CustomData on SmartField1");
		assert.ok(aCustomData[0]._bFromSemanticGroupElement, "Original: CustomData on SmartField created by SemanticGroupElement");
		assert.ok(oSemanticGroupElement.isVisible(), "Original: SemanticGroupElement is visible");
		oSmartField1.setVisible(false);
		oSmartField2.setVisible(false);
		assert.notOk(oSemanticGroupElement.isVisible(), "Original: SemanticGroupElement is invisible after fields are set to invisible");

		// check clone
		aElements = oClone.getElements();
		assert.equal(aElements.length, 2, "Clone: has 2 Elements");
		assert.equal(aElements[0].getId(), "SF1-myClone", "Clone: first element");
		assert.equal(aElements[1].getId(), "SF2-myClone", "Clone: second element");
		assert.equal(oClone.getLabelText(), "Label", "Clone: Label text");
		assert.equal(oClone.getLabel().getId(), "L1-myClone", "Clone: Label");
		assert.equal(oClone._getLabel().getId(), "SF1-myClone-label", "Clone: used Label");
		aCustomData = oClone.getCustomData();
		assert.equal(aCustomData.length, 1, "Clone: Only one CustomData on oSemanticGroupElement");
		assert.equal(aCustomData[0].getId(), "CD1-myClone", "Clone: CustomData");
		aCustomData = aElements[0].getCustomData();
		assert.equal(aCustomData.length, 1, "Clone: Only one CustomData on SmartField1");
		assert.ok(aCustomData[0]._bFromSemanticGroupElement, "Clone: CustomData on SmartField created by SemanticGroupElement");
		assert.ok(oClone.isVisible(), "Clone: SemanticGroupElement is visible");
		aElements[0].setVisible(false);
		aElements[1].setVisible(false);
		assert.notOk(oClone.isVisible(), "Clone: SemanticGroupElement is invisible after fields are set to invisible");

		oClone.destroy();
	});
	QUnit.module("Edit mode", {
		beforeEach: function() {
			initTest();
			oSemanticGroupElement._setEditable(true);
		},
		afterEach: afterTest
	});

	QUnit.test("two fields", function(assert) {
		var oLabel = new Label("L1", {text: "Test"});
		oSemanticGroupElement.setLabel(oLabel);
		var oField1 = new SmartField("F1", {value: "Text 1"});
		var oField2 = new SmartField("F2", {value: "Text 2"});
		oSemanticGroupElement.addElement(oField1);
		oSemanticGroupElement.addElement(oField2);
		var aFields = oSemanticGroupElement.getFieldsForRendering();

		assert.equal(oSemanticGroupElement.getProperty("_editable"), true, "Edit mode");
		assert.equal(aFields.length, 3, "3 controls rendered");
		assert.equal(aFields[0], oField1, "First field rendered");
		assert.ok(aFields[1] && aFields[1].isA("sap.m.Text"), "Delimiter rendered");
		assert.equal(aFields[1] && aFields[1].getText && aFields[1].getText(), "/", "Delimiter symbol rendered");
		assert.ok(aFields[2] && aFields[2] === oField2, "Second field rendered");
	});

	QUnit.test("three fields", function(assert) {
		var oLabel = new Label("L1", {text: "Test"});
		oSemanticGroupElement.setLabel(oLabel);
		var oField1 = new SmartField("F1", {value: "Text 1"});
		var oField2 = new SmartField("F2", {value: "Text 2"});
		var oField3 = new SmartField("F3", {value: "Text 3"});
		oSemanticGroupElement.addElement(oField1);
		oSemanticGroupElement.addElement(oField2);
		oSemanticGroupElement.insertElement(oField3, 0);
		var aFields = oSemanticGroupElement.getFieldsForRendering();

		assert.equal(oSemanticGroupElement.getProperty("_editable"), true, "display mode");
		assert.equal(aFields.length, 5, "5 controls rendered");
		assert.ok(aFields[0] === oField3, "Third field rendered");
		assert.ok(aFields[1] && aFields[1].isA("sap.m.Text"), "Delimiter rendered");
		assert.equal(aFields[1] && aFields[1].getText && aFields[1].getText(), "/", "Delimiter symbol rendered");
		assert.ok(aFields[2] && aFields[2] === oField1, "First field rendered");
		assert.ok(aFields[3] && aFields[3].isA("sap.m.Text"), "Delimiter rendered");
		assert.equal(aFields[3] && aFields[3].getText && aFields[3].getText(), "/", "Delimiter symbol rendered");
		assert.ok(aFields[4] && aFields[4] === oField2, "Second field rendered");
	});

	QUnit.test("two fields with aria-labelledby to InvisibleText", function (assert) {
		// Arrange
		const oSmartField1 = new SmartField("id1", {textLabel: "Ivan"}),
			oSmartField2 = new SmartField("id2"),
			sLabel1 = "sLabel1",
			sLabel2 = "sLabel2",
			fnStub1 = sinon.stub(oSmartField1, "getDataSourceLabel").returns(sLabel1),
			fnStub2 = sinon.stub(oSmartField2, "getDataSourceLabel").returns(sLabel2),
			oInput1 = new Input(),
			oInput2 = new Input();

		// Act
		oSemanticGroupElement.addElement(oSmartField1);
		oSemanticGroupElement.addElement(oSmartField2);
		oSmartField1.fireInnerControlsCreated([oInput1]);
		oSmartField2.fireInnerControlsCreated([oInput2]);

		// Assert
		assert.equal(oSmartField1.getAggregation("_ariaLabelInvisibleText")[0].getText(), sLabel1);
		assert.equal(oSmartField2.getAggregation("_ariaLabelInvisibleText")[0].getText(), sLabel2);

		// Clean up
		oInput1.destroy();
		oInput2.destroy();
		fnStub1.restore();
		fnStub2.restore();
	});

});
