/* global QUnit, sinon */
/*!
 * SAPUI5
 * (c) Copyright 2009-2024 SAP SE. All rights reserved.
 */
sap.ui.define([
	"sap/ui/core/Core",
	"sap/ui/core/library",
	"sap/ui/core/util/MockServer",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/comp/smartfield/SmartField",
	"sap/ui/comp/smartfield/SmartLabel",
	"sap/m/VBox",
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/model/BindingMode",
	"sap/ui/core/CustomData",
	"sap/ui/comp/smartform/GroupElement",
	"sap/ui/comp/smartform/Group",
	"sap/ui/comp/smartform/SmartForm",
	"sap/ui/comp/smartfield/TextArrangementDelegate",
	"sap/ui/core/format/DateFormat",
	"sap/ui/comp/smartfield/ControlFactoryBase",
	"./SmartFieldTestWrapper",
	"sap/ui/qunit/utils/nextUIUpdate",
	"sap/ui/comp/smartfield/ODataControlFactory",
	"sap/ui/comp/providers/ValueListProvider",
	"sap/m/ComboBox"

], function(
	Core,
	coreLibrary,
	MockServer,
	ODataModel,
	SmartField,
	SmartLabel,
	VBox,
	QUnitUtils,
	BindingMode,
	CustomData,
	GroupElement,
	Group,
	SmartForm,
	TextArrangementDelegate,
	DateFormat,
	ControlFactoryBase,
	SmartFieldTestWrapper,
	nextUIUpdate,
	ODataControlFactory,
	ValueListProvider,
	ComboBox
) {
	"use strict";
	var ValueState = coreLibrary.ValueState;
	var oMockServer = new MockServer({
		rootUri: "odata/"
	});

	oMockServer.simulate("test-resources/sap/ui/comp/shared/mockserver/metadata.xml", "test-resources/sap/ui/comp/shared/mockserver/");
	oMockServer.start();
	var oDataModel = new ODataModel("odata", {
		json: true,
		useBatch: true
	});
	oDataModel.setDefaultBindingMode(BindingMode.TwoWay);

	var oDataModel2 = new ODataModel("odata", {
		json: true,
		useBatch: true
	});
	oDataModel2.setDefaultBindingMode(BindingMode.TwoWay);

	function beforeEach() {
		this.oVBox = new VBox();
		this.oVBox.setModel(oDataModel); // note: by default the binding mode in OData is OneWay
		this.oVBox.bindObject({
			path: "/Products('1239102')"
		});
		this.oVBox.placeAt("qunit-fixture");
	}

	function afterEach() {

		if (this.oVBox) {
			this.oVBox.destroy();
			this.oVBox = null;
		}

		oDataModel.resetChanges();
	}

	function fnAssertInnerControlValue(sExpectedValue, bEditMode, oSmartField, fnResolve, assert) {
		oSmartField.attachEventOnce("innerControlsCreated", function() {

			var oInnerControl = oSmartField.getFirstInnerControl(),
				oDelegate = {
					onAfterRendering: function () {
						// We execute the delegate only once
						oInnerControl.removeDelegate(oDelegate);

						setTimeout(function () {
							// Assert
							assert.strictEqual(
								oInnerControl[bEditMode ? "getValue" : "getText"](),
								sExpectedValue,
								"Input has expected value"
							);

							if (fnResolve) {
								fnResolve();
							}
						}, 100 /* We let enough time for the control to update */);
					}
				};

			oInnerControl.addDelegate(oDelegate);
		});
	}

	/**
	 * Heuristic way of determining SmartField has finished last rendering including
	 * inner control updates.
	 */
	function fnGetSmartFieldReady (oSmartField) {
		return new Promise(function (fnResolve) {
			var iTimeout = new setTimeout(fnResolve, 200);

			oSmartField.attachInnerControlsCreated(function () {
				var oControl = oSmartField.getFirstInnerControl();

				clearTimeout(iTimeout);
				if (oControl) {
					oControl.addEventDelegate({
						onAfterRendering: function () {
							clearTimeout(iTimeout);
						}
					});
				}
			});
		});
	}

	var oQUnitModuleDefaultSettings = {
		beforeEach: beforeEach,
		afterEach: afterEach
	};

	QUnit.module("Binding mode propagation to inner controls", oQUnitModuleDefaultSettings);

	// BCP: 1980261903
	QUnit.test("Edm.String", function(assert) {
		var done = assert.async();

		// system under test (type String -> Input)
		var oSmartField = new SmartField({
			value: "{ path: 'Name', mode: 'OneWay' }"
		});

		// arrange
		oSmartField.attachInnerControlsCreated(function(oControlEvent) {
			var aInnerControls = oControlEvent.getSource().getInnerControls();
			var oControl = aInnerControls[0];
			var mBindingInfo = oControl.getBindingInfo("value");

			// assert
			assert.strictEqual(aInnerControls.length, 1, "There is one inner control");
			assert.strictEqual(oControl.isA("sap.m.Input"), true, "The inner control is an input field");
			assert.strictEqual(mBindingInfo.parts[0].mode, BindingMode.OneWay, "The binding mode is one-way");
			done();
		});

		this.oVBox.addItem(oSmartField);
	});

	QUnit.test("Edm.String propagate the formatted value to inner control", function(assert) {
		var done = assert.async();

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'Price' }",
			editable: false
		});

		// arrange
		oSmartField.attachInnerControlsCreated(function(oControlEvent) {
			var sValue = "Dummy value",
				oSmartControl = oControlEvent.getSource(),
				oInnerControl = oSmartControl.getFirstInnerControl(),
				sFormattedValue = oInnerControl.getText();

			// Act
			oSmartControl.setValue(sValue);

			// assert
			assert.equal(oInnerControl.getText(), sFormattedValue, "The formatted value is propagated to the inner control");
			done();
		});

		this.oVBox.addItem(oSmartField);
	});

	QUnit.test("Edm.String with com.sap.vocabularies.Common.v1.IsCalendarDate", function(assert) {
		var done = assert.async();

		// system under test (type String -> sap.m.DatePicker)
		var oSmartField = new SmartField({
			value: "{ path: 'StringDate', mode: 'OneWay' }"
		});

		// arrange
		oSmartField.attachInnerControlsCreated(function(oControlEvent) {
			var oSmartControl = oControlEvent.getSource();
			var aInnerControls = oSmartControl.getInnerControls();
			var oControl = aInnerControls[0];
			var mBindingInfo = oControl.getBindingInfo("value");

			// assert
			assert.strictEqual(aInnerControls.length, 1, "There is one inner control");
			assert.strictEqual(oControl.isA("sap.m.DatePicker"), true, "The inner control is an sap.m.DatePicker");
			assert.strictEqual(mBindingInfo.parts[0].mode, BindingMode.OneWay, "The binding mode is one-way");
			assert.notStrictEqual(oSmartControl.getValue(), "", "The valid date value is formatted to a date");
			done();
		});

		this.oVBox.addItem(oSmartField);
	});

	QUnit.test("Edm.String with com.sap.vocabularies.Common.v1.IsCalendarDate and invalid date", function(assert) {
		var done = assert.async();

		// system under test (type String -> sap.m.DatePicker)
		var oSmartField = new SmartField({
			value: "{ path: 'InvalidStringDate', mode: 'OneWay' }"
		});

		// arrange
		oSmartField.attachInnerControlsCreated(function(oControlEvent) {
			var oSmartControl = oControlEvent.getSource();
			var aInnerControls = oSmartControl.getInnerControls();
			var oControl = aInnerControls[0];
			var mBindingInfo = oControl.getBindingInfo("value");

			// assert
			assert.strictEqual(aInnerControls.length, 1, "There is one inner control");
			assert.strictEqual(oControl.isA("sap.m.DatePicker"), true, "The inner control is an sap.m.DatePicker");
			assert.strictEqual(mBindingInfo.parts[0].mode, BindingMode.OneWay, "The binding mode is one-way");
			assert.strictEqual(oSmartControl.getValue(), "", "The invalid date value is formatted to an empty string");
			done();
		});

		this.oVBox.addItem(oSmartField);
	});

	QUnit.test("Edm.DateTime", function(assert) {
		var done = assert.async();

		// system under test (type Date -> Date Picker (Date Time))
		var oSmartField = new SmartField({
			value: "{path: 'LastChanged', mode: 'OneWay'}"
		});

		// arrange
		oSmartField.attachInnerControlsCreated(function(oControlEvent) {
			var aInnerControls = oControlEvent.getSource().getInnerControls();
			var oControl = aInnerControls[0];
			var mBindingInfo = oControl.getBindingInfo("value");

			// assert
			assert.strictEqual(aInnerControls.length, 1, "There is one inner control");
			assert.strictEqual(oControl.isA("sap.m.DatePicker"), true, "The inner control is an date picker");
			assert.strictEqual(mBindingInfo.parts[0].mode, BindingMode.OneWay, "The binding mode is one-way");
			done();
		});

		this.oVBox.addItem(oSmartField);
	});

	QUnit.test("Edm.DateTimeOffset", function(assert) {
		var done = assert.async();

		// system under test (type Date -> Date Picker (Date Time))
		var oSmartField = new SmartField({
			value: "{path: 'AvailableSince', mode: 'OneWay'}"
		});

		// arrange
		oSmartField.attachInnerControlsCreated(function(oControlEvent) {
			var aInnerControls = oControlEvent.getSource().getInnerControls();
			var oControl = aInnerControls[0];
			var mBindingInfo = oControl.getBindingInfo("value");

			// assert
			assert.strictEqual(aInnerControls.length, 1, "There is one inner control");
			assert.strictEqual(oControl.isA("sap.m.DatePicker"), true, "The inner control is an date picker");
			assert.strictEqual(mBindingInfo.parts[0].mode, BindingMode.OneWay, "The binding mode is one-way");
			done();
		});

		this.oVBox.addItem(oSmartField);
	});

	QUnit.test("Edm.DateTime (sap:display-format=Date)", function(assert) {
		var done = assert.async();

		// system under test (type Date -> Date Picker (Date Time))
		var oSmartField = new SmartField({
			value: "{path: 'CreationDate', mode: 'OneWay'}"
		});

		// arrange
		oSmartField.attachInnerControlsCreated(function(oControlEvent) {
			var aInnerControls = oControlEvent.getSource().getInnerControls();
			var oControl = aInnerControls[0];
			var mBindingInfo = oControl.getBindingInfo("value");

			// assert
			assert.strictEqual(oControl.isA("sap.m.DatePicker"), true, "The inner control is an date picker");
			assert.strictEqual(aInnerControls.length, 1, "There is one inner control");
			assert.strictEqual(mBindingInfo.parts[0].mode, BindingMode.OneWay, "The binding mode is one-way");
			done();
		});

		this.oVBox.addItem(oSmartField);
	});

	QUnit.test("Edm.String (sap:semantics=yearmonthday)", function(assert) {
		var done = assert.async();

		// system under test (type Date -> Date Picker (Date Time))
		var oSmartField = new SmartField({
			value: "{path: 'DateStr', mode: 'OneWay'}"
		});

		// arrange
		oSmartField.attachInnerControlsCreated(function(oControlEvent) {
			var aInnerControls = oControlEvent.getSource().getInnerControls();
			var oControl = aInnerControls[0];
			var mBindingInfo = oControl.getBindingInfo("value");

			// assert
			assert.strictEqual(aInnerControls.length, 1, "There is one inner control");
			assert.strictEqual(oControl.isA("sap.m.DatePicker"), true, "The inner control is an date picker");
			assert.strictEqual(mBindingInfo.parts[0].mode, BindingMode.OneWay, "The binding mode is one-way");
			done();
		});

		this.oVBox.addItem(oSmartField);
	});

	QUnit.test("Combo box (fixed value list)", function(assert) {
		var done = assert.async();

		// system under test (fixed values Select control)
		var oSmartField = new SmartField({
			value: "{path: 'Category', mode: 'OneWay'}"
		});

		// arrange
		oSmartField.attachInnerControlsCreated(function(oControlEvent) {
			var aInnerControls = oControlEvent.getSource().getInnerControls();
			var oControl = aInnerControls[0];
			var mBindingInfo = oControl.getBindingInfo("enteredValue");

			// assert
			assert.strictEqual(aInnerControls.length, 1, "There is one inner control");
			assert.strictEqual(oControl.isA("sap.m.ComboBox"), true, "The inner control is an select");
			assert.strictEqual(mBindingInfo.parts[0].mode, BindingMode.OneWay, "The binding mode is one-way");
			done();
		});

		this.oVBox.addItem(oSmartField);
	});

	QUnit.test("Combo box (fixed value list) should be empty if the value is empty string", function(assert) {
		var done = assert.async();

		// system under test (fixed values Select control)
		var oSmartField = new SmartField({
			value: "{path: 'Category', mode: 'OneWay'}"
		}),
		sValue = "";

		// arrange
		oSmartField.attachEventOnce("innerControlsCreated", function(oControlEvent) {
			var oControl = oControlEvent.getSource().getFirstInnerControl();
			oControl.setValue(sValue);

			// assert
			assert.strictEqual(oControl.getValue(), sValue);

			done();
		});

		this.oVBox.addItem(oSmartField);
	});

	QUnit.test("Edm.Boolean (Check box)", function(assert) {
		var done = assert.async();

		// system under test (fixed values Select control)
		var oSmartField = new SmartField({
			value: "{path: 'Sale', mode: 'OneWay'}"
		});

		// arrange
		oSmartField.attachInnerControlsCreated(function(oControlEvent) {
			var aInnerControls = oControlEvent.getSource().getInnerControls();
			var oControl = aInnerControls[0];
			var mBindingInfo = oControl.getBindingInfo("selected");

			// assert
			assert.strictEqual(aInnerControls.length, 1, "There is one inner control");
			assert.strictEqual(oControl.isA("sap.m.CheckBox"), true, "The inner control is an check box");
			assert.strictEqual(mBindingInfo.parts[0].mode, BindingMode.OneWay, "The binding mode is one-way");
			done();
		});

		this.oVBox.addItem(oSmartField);
	});

	QUnit.module("Initialize event", oQUnitModuleDefaultSettings);

	// BCP: 1970182133
	// BCP: 1970183463
	QUnit.test("it should fire the initialize event after the control is fully initialized", function(assert) {
		var done = assert.async();

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'Name'}",
			editable: false // this setting triggers a different control flow (path) in the code
		});

		// arrange
		oSmartField.attachInnerControlsCreated(function(oControlEvent) {
			var oSmartField = oControlEvent.getSource();
			var aInnerControls = oSmartField.getInnerControls();

			// assert
			assert.strictEqual(aInnerControls.length, 1, "the inner controls should be created");
			assert.ok(oSmartField.getControlFactory(), "the factory should be created");
			done();
		});

		this.oVBox.addItem(oSmartField);
	});

	QUnit.test("modelContextChange should call _updateBindings for fixed-values", function(assert) {
		var done = assert.async();

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'Category' }",
			editable: false
		});

		// arrange
		oSmartField.attachInnerControlsCreated(async function() {
			// Arrange
			var oVLProvider = sinon.createStubInstance(ValueListProvider);
			sinon.stub(oSmartField.getControlFactory(), "getValueListProvider").returns(oVLProvider);

			// Act
			oSmartField.fireModelContextChange();
			await nextUIUpdate();
			oSmartField._getComputedMetadata().then(function() {
				// assert
				assert.equal(oVLProvider._updateBindings.called, true, "_updateBindings is called");
			});

			done();
		});

		this.oVBox.addItem(oSmartField);
	});

	QUnit.test("modelContextChange should set binding context to edit control", function(assert) {
		var done = assert.async();

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'Category' }",
			editable: false
		}),
		oComboBox = new ComboBox();

		// arrange
		oSmartField.attachInnerControlsCreated(async function() {
			// Arrange
			oSmartField._oControl.edit = oComboBox;

			// Act
			oSmartField.fireModelContextChange();
			await nextUIUpdate();
			oSmartField._getComputedMetadata().then(function() {
				// assert
				assert.ok(oComboBox.getBindingContext(), "Inner control has BindingContext");
				assert.equal(oComboBox.getBindingContext(), oSmartField.getBindingContext(), "Inner control has correct binding context from SF");
			});

			done();
		});

		this.oVBox.addItem(oSmartField);
	});

	QUnit.module("FieldControl editable and visible state handling", oQUnitModuleDefaultSettings);

	QUnit.test("it should not override the initial value of the editable property when the FieldControl's path is '' (empty)", function(assert) {

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'Name' }",
			editable: false
		});

		// act
		this.oVBox.addItem(oSmartField);
		// this.oVBox.placeAt("qunit-fixture");

		// assert
		assert.strictEqual(oSmartField.getEditable(), false);
	});

	// BCP: 1970202197
	QUnit.test("it should not override the editable property while the inner binding is being initialized", function(assert) {
		var done = assert.async();

		// system under test
		var oSmartField = new SmartField({
			entitySet: "Products",
			value: "{ path: 'Name' }",
			editable: false
		});

		// arrange
		oSmartField.attachEventOnce("innerControlsCreated", function() {
			var oFactory = oSmartField.getControlFactory();
			var oFieldControl = oFactory._oFieldControl;
			var sFieldControlPath = oFieldControl._oAnnotation.getFieldControlPath(oFactory.getEdmProperty());
			var bEntitySetAndEdmPropertyUpdatable = oFieldControl._getUpdatableStatic(oFactory.getMetaData());

			// assert
			// the assumption made in this test is that the edm:property named "Name" is not annotated with
			// the FieldControl annotation
			assert.strictEqual(bEntitySetAndEdmPropertyUpdatable, true);
			assert.strictEqual(oSmartField.getEditable(), false);
			assert.strictEqual(sFieldControlPath, undefined);

			done();
		});

		// act
		this.oVBox.addItem(oSmartField);
	});

	QUnit.test("it should reset the editable property to its default value (editable=true) if the metadata allows " +
				"the field to be updatable", function(assert) {

		var done = assert.async(2);

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'Name' }",
			editable: false
		});

		// arrange
		oSmartField.attachInnerControlsCreated(async function(oControlEvent) {
			var oFactory = oSmartField.getControlFactory();
			var oFieldControl = oFactory._oFieldControl;
			var sFieldControlPath = oFieldControl._oAnnotation.getFieldControlPath(oFactory.getEdmProperty());
			var bEntitySetAndEdmPropertyUpdatable = oFieldControl._getUpdatableStatic(oFactory.getMetaData());

			// act
			oSmartField.setEditable(null);
			await nextUIUpdate();

			// assert
			// the assumption made in this test is that the edm:property named "Name" is not annotated with
			// the FieldControl annotation, and that the entity set and the edm:property named "Name" are
			// updatable
			assert.strictEqual(bEntitySetAndEdmPropertyUpdatable, true);
			assert.strictEqual(sFieldControlPath, undefined);
			assert.strictEqual(oSmartField.getEditable(), true);
			done();
		});

		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
	});

	QUnit.test('it should set the UoM field to editable when the underlying edm:property is immutable', function(assert) {

		var done = assert.async(3);

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'Price' }",
			uomEditable: false
		});

		// arrange
		oSmartField.attachInnerControlsCreated(async function(oControlEvent) {
			var oFactory = oSmartField.getControlFactory(),
				oUoMNestedSmartField = this._getEmbeddedSmartField(),
				oCurrencyEdmProperty = oFactory.getMetaData().annotations.uom.property.property;

			// act
			oSmartField.setUomEditable(true);
			await nextUIUpdate();

			// assert
			assert.strictEqual(oCurrencyEdmProperty["Org.OData.Core.V1.Immutable"], undefined, 'the edm:property should be updatable (default)');
			oUoMNestedSmartField.attachInnerControlsCreated(function(oControlEvent) {
				assert.strictEqual(oUoMNestedSmartField.getEditable(), true);
				assert.strictEqual(oUoMNestedSmartField.getFirstInnerControl().getMetadata().getName(), "sap.m.Input");
				done();
			});
			done();
		});

		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
	});

	QUnit.test("the UoM field should be visible", function(assert) {

		var done = assert.async();

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'Price' }",
			uomVisible: false
		});

		// arrange
		oSmartField.attachInnerControlsCreated(async function(oControlEvent) {
			var oUoMNestedSmartField = this._getEmbeddedSmartField();

			// assert
			oUoMNestedSmartField.addEventDelegate({
				onAfterRendering: function () {
					assert.strictEqual(oUoMNestedSmartField.getVisible(), true);
					var sControlMetadataName = oUoMNestedSmartField.getFirstInnerControl().getMetadata().getName();
					assert.strictEqual(sControlMetadataName, "sap.m.Input");
					done();
				}
			});

			// act
			oSmartField.setUomVisible(true);
			await nextUIUpdate();
		});

		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
	});

	QUnit.test("The parent SmartField should fire Initialise event after the nested SmartField and both events should be fired only once per control.", function(assert) {
		// arrange
		var oSmartField,
			fnParentFireInitialiseSpy,
			fnNestedFireInitialiseSpy,
			done = assert.async();

		oSmartField = new SmartField({
			value: "{ path: 'Price' }"
		});

		fnParentFireInitialiseSpy = sinon.spy(oSmartField, "fireInitialise");

		oSmartField.attachInnerControlsCreated(function() {
			var oUoMNestedSmartField = this._getEmbeddedSmartField();

			fnNestedFireInitialiseSpy = sinon.spy(oUoMNestedSmartField, "fireInitialise");
		});

		oSmartField.attachInitialise(function() {
			// assert
			sinon.assert.callOrder(fnNestedFireInitialiseSpy, fnParentFireInitialiseSpy);
			assert.equal(fnNestedFireInitialiseSpy.callCount, 1, "Nested control fireInitialise fired only once");
			assert.equal(fnParentFireInitialiseSpy.callCount, 1, "Parent control fireInitialise fired only once");

			oSmartField.destroy();
			done();
		});

		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
	});

	QUnit.test("Initialise event should not be fired before metadata initialization", function(assert) {
		// arrange
		var oSmartField,
			fnParentFireInitialiseSpy,
			done = assert.async();

		oSmartField = new SmartField({
			value: "{ path: 'Price' }"
		});

		sinon.stub(ODataControlFactory.prototype, "getDataProperty").returns(undefined);
		fnParentFireInitialiseSpy = sinon.spy(oSmartField, "_fireInitialise");

		oSmartField.attachInnerControlsCreated(function() {
			oSmartField._processState();

			assert.equal(fnParentFireInitialiseSpy.callCount, 0, "Initialise does not get fired");

			ODataControlFactory.prototype.getDataProperty.restore();
			oSmartField.destroy();
			done();
		});

		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
	});

	// BCP: 1970375171
	QUnit.test("the UoM field should not be visible", function(assert) {

		var done = assert.async();

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'Price' }",
			uomVisible: true
		});

		// arrange
		oSmartField.attachInnerControlsCreated(async function(oControlEvent) {
			var oUoMNestedSmartField = this._getEmbeddedSmartField();

			// act
			oSmartField.setUomVisible(false);
			oSmartField._propagateToInnerControls();
			await nextUIUpdate();

			// assert
			assert.strictEqual(oUoMNestedSmartField.getBinding("visible").getExternalValue(), false);
			assert.strictEqual(oUoMNestedSmartField.getVisible(), false);
			done();
		});

		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
	});

	QUnit.test("the UoM field should not be visible if the underlying edm:property is annotated as hidden", function(assert) {

		var done = assert.async();

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'PriceCurrencyNotVisible' }",
			uomVisible: false,
			uomEditable: false
		});

		// arrange
		oSmartField.attachInnerControlsCreated(async function(oControlEvent) {
			var oUoMNestedSmartField = this._getEmbeddedSmartField();

			// act
			oSmartField.setUomVisible(true); // this API call should be
			await nextUIUpdate();

			// assert
			assert.strictEqual(oUoMNestedSmartField.getBinding("visible").getExternalValue(), false);
			var sControlMetadataName = oUoMNestedSmartField.getFirstInnerControl().getMetadata().getName();
			assert.strictEqual(sControlMetadataName, "sap.m.Text");
			done();
		});

		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
	});

	// BCP: 1970575713
	QUnit.test("it should not set the UoM field to visible after cloning if the uomVisible property is set to false", function(assert) {

		var done = assert.async();

		// system under test
		var oSmartField = new SmartField("smartfieldID1", {
			value: "{ path: 'Price' }",
			uomVisible: false
		});

		// arrange
		oSmartField.attachEventOnce("initialise", function(oControlEvent) {

			// act
			var oSmartFieldClone = oSmartField.clone();

			// arrange
			oSmartFieldClone.attachEventOnce("innerControlsCreated", async function(oControlEvent) {
				await nextUIUpdate();
				var oNestedSmartField = oSmartFieldClone._getEmbeddedSmartField();

				// assert
				assert.strictEqual(oNestedSmartField.getVisible(), false, "the UoM field should be hidden");
				assert.strictEqual(oNestedSmartField.isActive(), false, "the UoM field should be hidden");
				done();
			}, this);

			this.oVBox.addItem(oSmartFieldClone);
		}, this);

		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
	});

	QUnit.test("it should set the UoM field to read-only", function(assert) {

		var done = assert.async(3);

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'Price' }",
			uomEditable: true
		});

		// arrange
		oSmartField.attachInnerControlsCreated(async function(oControlEvent) {
			var oFactory = oSmartField.getControlFactory(),
				oUoMNestedSmartField = this._getEmbeddedSmartField(),
				oCurrencyEdmProperty = oFactory.getMetaData().annotations.uom.property.property;

			// act
			oSmartField.setUomEditable(false);
			await nextUIUpdate();

			// assert
			assert.strictEqual(oCurrencyEdmProperty["Org.OData.Core.V1.Immutable"], undefined, 'the edm:property should be updatable (default)');
			oUoMNestedSmartField.attachInnerControlsCreated(function(oControlEvent) {
				var sControlMetadataName = oUoMNestedSmartField.getFirstInnerControl().getMetadata().getName();
				assert.strictEqual(oUoMNestedSmartField.getEditable(), false);
				assert.strictEqual(sControlMetadataName, "sap.m.Text");
				done();
			});
			done();
		});

		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
	});
	QUnit.test("it should fire changeModelValue event when value of UoM field changes", async function(assert) {
		assert.expect(4);
		var done = assert.async(),
			sNewValue = "5",
			oSmartField = new SmartField({
				value: "{ path: 'Quantity' }",
				editable:true,
				uomEditable: true,
				uomVisible: true,
				changeModelValue: function (oEvent) {
					// assert
					assert.ok(true, "changeModelValue event fired");
					assert.strictEqual(
						oSmartField.getFirstInnerControl().getBinding("value").getValue()[0],
						sNewValue,
						"New value stored in the model by the time the event is fired"
					);
					assert.strictEqual(oEvent.getParameter("unitChanged"), false,
						"unitChanged parameter should be falsy as the change resulted from interaction with the amount field");
					assert.strictEqual(oEvent.getParameter("unitLastValueState"), "None",
						"unitLastValueState parameter should be 'None'");

					done();
				}
			});
		window.smart = oSmartField;

		// arrange
		oSmartField.attachInnerControlsCreated(async function(oControlEvent) {
			await nextUIUpdate();
			var oAmountInputFieldFocusDomRef = oSmartField.getFirstInnerControl().getFocusDomRef();

			// act
			oAmountInputFieldFocusDomRef.focus();
			QUnitUtils.triggerCharacterInput(oAmountInputFieldFocusDomRef, "1", sNewValue);
			oAmountInputFieldFocusDomRef.blur();
		}, this);

		this.oVBox.insertItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		await nextUIUpdate();
	});

	// BCP: 1980259594
	QUnit.test("it should not set the UoM field to editable if the underlying edm:property is updatable/immutable", function(assert) {

		var done = assert.async();

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'PriceCurrencyReadOnly' }",
			uomEditable: false
		});

		// arrange
		oSmartField.attachEventOnce("innerControlsCreated", async function(oControlEvent) {
			var oFactory = oSmartField.getControlFactory(),
				oUoMNestedSmartField = this._getEmbeddedSmartField(),
				oCurrencyEdmProperty = oFactory.getMetaData().annotations.uom.property.property;

			// act
			oSmartField.setUomEditable(true);
			await nextUIUpdate();

			// assert
			assert.strictEqual(oCurrencyEdmProperty["Org.OData.Core.V1.Immutable"].Bool, "true");
			assert.strictEqual(oUoMNestedSmartField.getBinding("editable").getExternalValue(), false);
			var sControlMetadataName = oUoMNestedSmartField.getFirstInnerControl().getMetadata().getName();
			assert.strictEqual(sControlMetadataName, "sap.m.Text");
			done();
		});

		this.oVBox.addItem(oSmartField);
	});

	// BCP: 1970185965
	QUnit.test("it should render a mandatory field", function(assert) {

		var done = assert.async();

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'Phone' }",
			mandatory: true
		});

		// arrange
		oSmartField.attachInitialise(function(oControlEvent) {
			var oFactory = oSmartField.getControlFactory();
			var oFieldControl = oFactory._oFieldControl;
			var oEdmProperty = oFactory.getEdmProperty();
			var sFieldControlPath = oFieldControl._oAnnotation.getFieldControlPath(oEdmProperty);

			// assert
			assert.strictEqual(oEdmProperty.nullable, "true", "the backend can accept nulled/empty values");
			assert.strictEqual(sFieldControlPath, undefined, "the FieldControl annotation is not specified");
			assert.strictEqual(oSmartField.getMandatory(), true, "the field should be mandatory");
			done();
		});

		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
	});

	QUnit.module("Time formatting", oQUnitModuleDefaultSettings);

	// BCP: 1980303513
	QUnit.test("it should format the value of the field typed as Edm.Time annotated with the @Common.Text " +
				"annotation correctly", function(assert) {
		var done = assert.async();

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'DeliveryTime' }",
			editable: false // this setting triggers a different control flow (path) in the code
		});

		// arrange
		oSmartField.attachInnerControlsCreated(function(oControlEvent) {
			var oTextField = oSmartField.getFirstInnerControl();
			var oEdmProperty = oSmartField.getControlFactory().getEdmProperty();
			var TEXT_ANNOTATION_TERM = "com.sap.vocabularies.Common.v1.Text";

			// assert
			assert.strictEqual(oTextField.getText().replace(/\s/g, " "), "9:00:21 AM");
			assert.ok(oEdmProperty.hasOwnProperty(TEXT_ANNOTATION_TERM));
			done();
		}, this);

		this.oVBox.addItem(oSmartField);
	});

	// BCP: 1970236005
	QUnit.test("it should format the value of the field typed as Edm.Time annotated with the @Common.Text and " +
				"@Common.SemanticObject annotations correctly", function(assert) {

		var done = assert.async();

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'ExpiredTime' }",
			editable: false // this setting triggers a different control flow (path) in the code
		});

		// arrange
		oSmartField.attachInnerControlsCreated(function(oControlEvent) {
			var oTextField = oSmartField.getFirstInnerControl();
			var oEdmProperty = oSmartField.getControlFactory().getEdmProperty();
			var TEXT_ANNOTATION_TERM = "com.sap.vocabularies.Common.v1.Text";
			var SEMANTIC_OBJECT_ANNOTATION_TERM = "com.sap.vocabularies.Common.v1.SemanticObject";

			// assert
			assert.strictEqual(oTextField.getText().replace(/\s/g, " "), "9:00:21 AM");
			assert.ok(oEdmProperty.hasOwnProperty(TEXT_ANNOTATION_TERM));
			assert.ok(oEdmProperty.hasOwnProperty(SEMANTIC_OBJECT_ANNOTATION_TERM));
			done();
		}, this);

		this.oVBox.addItem(oSmartField);
	});

	QUnit.module("Currency validation", oQUnitModuleDefaultSettings);

	// BCP: 1980097317
	QUnit.test("it should format the amount for JPY currencies without any digit to the right of the decimal point", function(assert) {
		var done = assert.async();

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'Price' }"
		});

		// arrange
		var oVBox = new VBox();
		oVBox.setModel(oDataModel);
		oVBox.bindObject({
			path: "/Products('1239103')"
		});

		oSmartField.attachEventOnce("innerControlsCreated", async function(oControlEvent) {
			var oFactory = oSmartField.getControlFactory(),
				oEdmProperty = oFactory.getEdmProperty(),
				oAmountInnerControl = oSmartField.getFirstInnerControl(),
				aBindingValues = oAmountInnerControl.getBinding("value").getValue(),
				sAmountBindingValue = aBindingValues[0],
				sCurrencyBindingValue = aBindingValues[1];

			oVBox.placeAt("qunit-fixture");
			await nextUIUpdate();

			// assert
			assert.strictEqual(oEdmProperty.precision, "13");
			assert.strictEqual(oEdmProperty.scale, "2");
			assert.strictEqual(oEdmProperty["Org.OData.Measures.V1.ISOCurrency"].Path, "CurrencyCode");
			assert.strictEqual(sAmountBindingValue, "100.00");
			assert.strictEqual(sCurrencyBindingValue, "JPY");

			// TODO: Temporary disabled to evaluate if this is even correct because we show values coming from the model without formatting.
			// EXPECTED_FORMATTED_VALUE = "100";
			// assert.strictEqual(oSmartField.getValue(), EXPECTED_FORMATTED_VALUE);
			// assert.strictEqual(oAmountInnerControl.getValue(), EXPECTED_FORMATTED_VALUE);
			// assert.strictEqual(oAmountInnerControl.getFocusDomRef().value, EXPECTED_FORMATTED_VALUE);

			// cleanup
			done();
		});

		oVBox.addItem(oSmartField);
		oVBox.placeAt("qunit-fixture");
	});

	QUnit.test("it should not store an invalid amount value in the binding when the field is subject to " +
				"data type constraints", async function(assert) {

		var done = assert.async();

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'Price' }"
		});

		// arrange
		oSmartField.attachEventOnce("innerControlsCreated", function(oControlEvent) {
			var oAmountInputField = oSmartField.getFirstInnerControl();
			var oAmountInputFieldFocusDomRef = oAmountInputField.getFocusDomRef();
			var oFireValidationSuccessSpy = this.spy(oAmountInputField, "fireValidationSuccess");
			var oFireChangeEventSpy = this.spy(oAmountInputField, "fireChange");
			var INITIAL_VALUE = "856.49";
			var INPUT_VALUE = "856.491";

			// act
			oAmountInputFieldFocusDomRef.focus();
			QUnitUtils.triggerCharacterInput(oAmountInputFieldFocusDomRef, "1", INPUT_VALUE);
			oAmountInputFieldFocusDomRef.blur();

			// when the value in the input field has changed and a blur event occurs on a sap.m.InputBase control, the change event is
			// fired async
			setTimeout(function() {

				// assert
				assert.strictEqual(oFireChangeEventSpy.callCount, 1, 'the amount text input field should fire the "change" event');
				assert.strictEqual(oFireValidationSuccessSpy.callCount, 0, 'the amount text input field should not fire the "validationSuccess" event');

				var aBindingValues = oAmountInputField.getBinding("value").getValue();
				var sAmountBindingValue = aBindingValues[0];

				assert.strictEqual(sAmountBindingValue, INITIAL_VALUE, "it should not update the binding value");
				done();
			}, 1);
		}, this);

		this.oVBox.insertItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		await nextUIUpdate();
	});

	// BCP: 1980461191
	QUnit.test("it should store the valid value in the model when the amount input field is in edit mode, " +
				"the currency field is invisible/read-only and the data type constraints are fulfilled (test case 1)", async function(assert) {

		var done = assert.async();

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'Price' }",
			uomVisible: false,
			uomEditable: false
		});

		// arrange
		oSmartField.attachEventOnce("innerControlsCreated", function(oControlEvent) {
			var oAmountInputField = oSmartField.getFirstInnerControl();
			var oAmountInputFieldFocusDomRef = oAmountInputField.getFocusDomRef();
			var oFireValidationSuccessSpy = this.spy(oAmountInputField, "fireValidationSuccess");
			var oFireChangeEventSpy = this.spy(oAmountInputField, "fireChange");
			var INPUT_VALUE = "100";

			// act
			oAmountInputFieldFocusDomRef.focus();
			QUnitUtils.triggerCharacterInput(oAmountInputFieldFocusDomRef, "1", INPUT_VALUE);
			oAmountInputFieldFocusDomRef.blur();

			// when the value in the input field has changed and a blur event occurs on a sap.m.InputBase control, the change event is
			// fired async
			setTimeout(function() {

				// assert
				assert.strictEqual(oFireChangeEventSpy.callCount, 1, 'the amount text input field should fire the "change" event');
				assert.strictEqual(oFireValidationSuccessSpy.callCount, 1, 'the amount text input field should fire the "validationSuccess" event');

				var aBindingValues = oAmountInputField.getBinding("value").getValue();
				var sAmountBindingValue = aBindingValues[0];

				assert.strictEqual(sAmountBindingValue, INPUT_VALUE, "it should update the binding value");
				done();
			}, 1);
		}, this);

		this.oVBox.insertItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		await nextUIUpdate();
	});

	QUnit.test("it should store the valid value in the model when the amount input field is in edit mode, " +
				"the currency value is empty, and the data type constraints are fulfilled (test case 2)", async function(assert) {

		var done = assert.async();

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'PriceEmptyCurrency' }"
		});

		// arrange
		var oVBox = new VBox();
		oVBox.setModel(oDataModel);
		oVBox.bindObject({
			path: "/Products('1239104')"
		});

		oSmartField.attachEventOnce("innerControlsCreated", function(oControlEvent) {
			var oAmountInputField = oSmartField.getFirstInnerControl();
			var oAmountInputFieldFocusDomRef = oAmountInputField.getFocusDomRef();
			var oFireValidationSuccessSpy = this.spy(oAmountInputField, "fireValidationSuccess");
			var oFireChangeEventSpy = this.spy(oAmountInputField, "fireChange");
			var INPUT_VALUE = "100";
			var oFactory = oSmartField.getControlFactory();
			var oEdmProperty = oFactory.getEdmProperty();

			// act
			oAmountInputFieldFocusDomRef.focus();
			QUnitUtils.triggerCharacterInput(oAmountInputFieldFocusDomRef, "1", INPUT_VALUE);
			oAmountInputFieldFocusDomRef.blur();

			// when the value in the input field has changed and a blur event occurs on a sap.m.InputBase control, the change event is
			// fired async
			setTimeout(function() {
				var aBindingValues = oAmountInputField.getBinding("value").getValue();
				var sAmountBindingValue = aBindingValues[0];
				var sCurrencyBindingValue = aBindingValues[1];

				// assert
				assert.strictEqual(oEdmProperty["Org.OData.Measures.V1.ISOCurrency"].Path, "CurrencyCodeEmpty");
				assert.strictEqual(sCurrencyBindingValue, "", "the currency should have an empty value stored in the binding/model");
				assert.strictEqual(oFireChangeEventSpy.callCount, 1, 'the amount text input field should fire the "change" event');
				assert.strictEqual(oFireValidationSuccessSpy.callCount, 1, 'the amount text input field should fire the "validationSuccess" event');
				assert.strictEqual(sAmountBindingValue, INPUT_VALUE, "it should update the binding value");

				// cleanup
				oVBox.destroy();
				done();
			}, 1);
		}, this);

		oVBox.insertItem(oSmartField);
		oVBox.placeAt("qunit-fixture");
		await nextUIUpdate();
	});

	QUnit.test("it should call the binding propertyChange event when the amount field is edited", async function(assert) {
		var done = assert.async(),
			oSmartField = new SmartField({
				value: "{ path: 'Price' }",
				uomVisible: true,
				uomEditable: false
			});

		assert.expect(1); // We expect only one assert

		// arrange
		oSmartField.attachInnerControlsCreated(function() {
			var oAmountInputField = oSmartField.getFirstInnerControl(),
				oAmountInputFieldFocusDomRef = oAmountInputField.getFocusDomRef(),
				oAmountFieldModel = oAmountInputField.getModel(),
				fnPropertyChangeHandler = function () {
					// cleanup
					oAmountFieldModel.detachPropertyChange(fnPropertyChangeHandler);

					// assert
					assert.ok(true, 'the propertyBinding "propertyChange" event should be fired oince');
					done();
				};

			oAmountFieldModel.attachPropertyChange(fnPropertyChangeHandler);

			// act
			oAmountInputFieldFocusDomRef.focus();
			QUnitUtils.triggerCharacterInput(oAmountInputFieldFocusDomRef, "1", "100");
			oAmountInputFieldFocusDomRef.blur();
		}, this);

		this.oVBox.insertItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		await nextUIUpdate();
	});

	QUnit.test("it should fire changeModelValue event when amount of currency field changes", async function(assert) {
		var done = assert.async(),
			sNewValue = "856.11";

		assert.expect(4);

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'Price' }",
			changeModelValue: function (oEvent) {
				// assert
				assert.ok(true, "changeModelValue event fired");
				assert.strictEqual(
					oSmartField.getFirstInnerControl().getBinding("value").getValue()[0],
					sNewValue,
					"New value stored in the model by the time the event is fired"
				);
				assert.strictEqual(oEvent.getParameter("unitChanged"), false,
					"unitChanged parameter should be falsy as the change resulted from interaction with the amount field");
				assert.strictEqual(oEvent.getParameter("unitLastValueState"), "None",
					"unitLastValueState parameter should be 'None'");

				done();
			}
		});

		// arrange
		oSmartField.attachInnerControlsCreated(async function(oControlEvent) {
			await nextUIUpdate();
			var oAmountInputFieldFocusDomRef = oSmartField.getFirstInnerControl().getFocusDomRef();

			// act
			oAmountInputFieldFocusDomRef.focus();
			QUnitUtils.triggerCharacterInput(oAmountInputFieldFocusDomRef, "1", sNewValue);
			oAmountInputFieldFocusDomRef.blur();
		}, this);

		this.oVBox.insertItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		await nextUIUpdate();
	});


	QUnit.test("it should fire changeModelValue with unitChanged parameter when unit changes", async function(assert) {
		var done = assert.async();

		assert.expect(5);

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'Price' }",
			changeModelValue: function (oEvent) {
				// assert
				assert.ok(true, "changeModelValue event fired");
				assert.strictEqual(oEvent.getParameter("valueChanged"), false,
					"valueChanged parameter should be falsy as the change resulted from interaction with the currency field");
				assert.strictEqual(oEvent.getParameter("valueLastValueState"), "None",
					"valueLastValueState parameter should be 'None'");
				assert.strictEqual(oEvent.getParameter("unitChanged"), true,
					"unitChanged parameter should be truthy as the change resulted from interaction with the currency field");
				assert.strictEqual(oEvent.getParameter("unitLastValueState"), "None",
					"unitLastValueState parameter should be 'None'");

				done();
			}
		});

		// arrange
		oSmartField.attachInnerControlsCreated(async function(oControlEvent) {
			await nextUIUpdate();
			var oCurrencyInputFieldFocusDomRef = oSmartField.getInnerControls()[1].getFocusDomRef();

			// act
			oCurrencyInputFieldFocusDomRef.focus();
			QUnitUtils.triggerCharacterInput(oCurrencyInputFieldFocusDomRef, "U", "USD");
			oCurrencyInputFieldFocusDomRef.blur();
		}, this);

		this.oVBox.insertItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		await nextUIUpdate();
	});

	QUnit.test("It should should store the currency value in UpperCase", async function(assert) {
		var done = assert.async();

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'Price' }"
		});

		// arrange
		oSmartField.attachInnerControlsCreated(async function(oControlEvent) {
			await nextUIUpdate();
			var oAmountInputField = oControlEvent.getParameters()[0];
			var oCurrencyInputField = oControlEvent.getParameters()[1];
			var oCurrencyInputFieldFocusDomRef = oCurrencyInputField.getFocusDomRef();

			// act
			QUnitUtils.triggerCharacterInput(oCurrencyInputFieldFocusDomRef, "u", "usd");
			oCurrencyInputField.onChange();

			// when the value in the input field has changed and a blur event occurs on a sap.m.InputBase control, the change event is
			// fired async
			setTimeout(function() {
				var aBindingValues = oAmountInputField.getBinding("value").getValue();
				var sCurrencyBindingValue = aBindingValues[1];

				assert.strictEqual(sCurrencyBindingValue, "USD", "it should update the binding value in UpperCase");
				done();
			}, 0);
		}, this);

		this.oVBox.insertItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		await nextUIUpdate();
	});

	QUnit.test("it should fire changeModelValue with unitChanged:false and unitLastValueState:Error parameter when unit changes", async function(assert) {
		var done = assert.async();

		assert.expect(5);

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'Price' }",
			changeModelValue: function (oEvent) {
				// assert
				assert.ok(true, "changeModelValue event fired");
				assert.strictEqual(oEvent.getParameter("valueChanged"), true,
					"valueChanged parameter should be truthy as the change resulted from interaction with the amount field");
				assert.strictEqual(oEvent.getParameter("valueLastValueState"), "Error",
					"valueLastValueState parameter should be 'Error' as the change resulted from interaction with " +
					"the 'amount' field but the 'currency' field was in error state.");
				assert.strictEqual(oEvent.getParameter("unitChanged"), false,
					"unitChanged parameter should be falsy as the change resulted from interaction with the amount field");
				assert.strictEqual(oEvent.getParameter("unitLastValueState"), "Error",
					"unitLastValueState parameter should be 'Error' as the change resulted from interaction with " +
					"the 'amount' field but the 'currency' field was in error state.");

				done();
			}
		});

		// arrange
		oSmartField.attachInnerControlsCreated(async function(oControlEvent) {
			await nextUIUpdate();

			var oAmountInputFieldFocusDomRef = oSmartField.getFirstInnerControl().getFocusDomRef();

			// act
			oSmartField.getInnerControls()[1].setValueState("Error");
			oAmountInputFieldFocusDomRef.focus();
			QUnitUtils.triggerCharacterInput(oAmountInputFieldFocusDomRef, "1", "100");
			oAmountInputFieldFocusDomRef.blur();
		}, this);

		this.oVBox.insertItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		await nextUIUpdate();
	});

	QUnit.test("with sap:variable-scale='true' it should ignore the provided service metadata scale", function (assert) {
		var done = assert.async();

		assert.expect(3);

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'PriceVariableScale' }"
		});

		// arrange
		oSmartField.attachInnerControlsCreated(async function(oControlEvent) {
			// Arrange
			var oAmountInputFieldFocusDomRef,
				oEdmProperty = oSmartField.getControlFactory().getEdmProperty();

			// Render the control
			this.oVBox.placeAt("qunit-fixture");
			await nextUIUpdate();

			// Arrange
			oAmountInputFieldFocusDomRef = oSmartField.getFirstInnerControl().getFocusDomRef();

			// Assert
			assert.strictEqual(oEdmProperty["sap:variable-scale"], "true", "Variable scale set in service metadata");
			assert.strictEqual(oEdmProperty.scale, "0", "Scale of 0 set in service metadata");

			// Act
			QUnitUtils.triggerCharacterInput(oAmountInputFieldFocusDomRef, "1", "100.01");

			// Assert
			oSmartField.checkValuesValidity()
				.then(function () {
					assert.ok(true,
						"The validation succeeded taking into account the currency scale and ignoring the service metadata scale"
					);
					done();
				})
				.catch(function () {
					assert.ok(false,
						"The validation should not take into account the provided service metadata scale=0 and should succeed"
					);
					done();
				});
		}, this);

		this.oVBox.insertItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
	});

	QUnit.module("ValueList and TextArrangement in display mode - not fixed list mode", {
		beforeEach: beforeEach,
		afterEach: afterEach,
		assertInnerControlValue: fnAssertInnerControlValue
	});

	QUnit.test("Key value exist in the attached value list", async function(assert) {
		var done = assert.async();
		assert.expect(1);

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'SecondCategory' }",
			editable: false
		});

		// Assert
		this.assertInnerControlValue("LT (Laptop)", false, oSmartField, done, assert);

		// Act
		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		await nextUIUpdate();
	});

	QUnit.test("Key value does not exist in the attached value list", async function(assert) {
		var done = assert.async();
		assert.expect(1);

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'ThirdCategory' }",
			editable: false
		});

		// Assert
		this.assertInnerControlValue("Non existing key", false, oSmartField, done, assert);

		// Act
		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		await nextUIUpdate();
	});

	QUnit.test("Default TextArrangement from control configuration", async function(assert) {
		var done = assert.async();
		assert.expect(1);

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'ForthCategory' }",
			editable: false
		}).addCustomData(new CustomData({
			key: "defaultInputFieldDisplayBehaviour",
			value: "idAndDescription"
		}));

		// Assert
		this.assertInnerControlValue("LT (Laptop)", false, oSmartField, done, assert);

		// Act
		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		await nextUIUpdate();
	});

	QUnit.test("TextArrangement local property value from `Type` annotation", async function(assert) {
		var done = assert.async();
		assert.expect(1);

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'FifthCategory' }",
			editable: false
		});

		// Assert
		this.assertInnerControlValue("Projector (LT)", false, oSmartField, done, assert);

		// Act
		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		await nextUIUpdate();
	});

	QUnit.test("Switch from mode 'editable' to 'display' with textInEditModeSource='ValueList'", async function(assert) {
		var done = assert.async();
		assert.expect(2);

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'SecondCategory' }",
			textInEditModeSource: "ValueList",
			editable: true
		});

		new Promise(function (fnResolve, fnReject) {

			// Assert
			this.assertInnerControlValue("LT (Laptop)", true, oSmartField, fnResolve, assert);

		}.bind(this)).then(function () {

			return new Promise(function (fnResolve, fnReject) {
				// Assert
				this.assertInnerControlValue("LT (Laptop)", false, oSmartField, fnResolve, assert);

				// Act
				oSmartField.setEditable(false);
			}.bind(this));

		}.bind(this)).then(function () {

			// We finished all assertions
			done();

		});

		// Act
		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		await nextUIUpdate();
	});

	QUnit.test("Switch from mode 'editable' to 'display' with textInEditModeSource='None'", async function(assert) {
		var done = assert.async();
		assert.expect(2);

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'SecondCategory' }",
			textInEditModeSource: "None",
			editable: true
		});

		new Promise(function (fnResolve, fnReject) {

			// Assert
			this.assertInnerControlValue("LT", true, oSmartField, fnResolve, assert);

		}.bind(this)).then(function () {

			return new Promise(function (fnResolve, fnReject) {

				// Assert
				this.assertInnerControlValue("LT (Laptop)", false, oSmartField, fnResolve, assert);

				// Act
				oSmartField.setEditable(false);

			}.bind(this));

		}.bind(this)).then(function () {
			// We finished all assertions
			done();
		});

		// Act
		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		await nextUIUpdate();
	});

	QUnit.test("Switch from mode 'display' to 'editable' with textInEditModeSource='ValueList'", async function(assert) {
		var done = assert.async();
		assert.expect(2);

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'SecondCategory' }",
			textInEditModeSource: "ValueList",
			editable: false
		});

		new Promise(function (fnResolve, fnReject) {

			// Assert
			this.assertInnerControlValue("LT (Laptop)", false, oSmartField, fnResolve, assert);

		}.bind(this)).then(function () {

			return new Promise(function (fnResolve, fnReject) {

				// Assert
				this.assertInnerControlValue("LT (Laptop)", true, oSmartField, fnResolve, assert);

				// Act
				oSmartField.setEditable(true);

			}.bind(this));

		}.bind(this)).then(function () {

			// We finished all assertions
			done();

		});

		// Act
		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		await nextUIUpdate();
	});

	QUnit.test("Switch from mode 'display' to 'editable' with textInEditModeSource='None'", async function(assert) {
		var done = assert.async();
		assert.expect(2);

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'SecondCategory' }",
			textInEditModeSource: "None",
			editable: false
		});

		new Promise(function (fnResolve, fnReject) {

			// Assert
			this.assertInnerControlValue("LT (Laptop)", false, oSmartField, fnResolve, assert);

		}.bind(this)).then(function () {

			return new Promise(function (fnResolve, fnReject) {

				// Assert
				this.assertInnerControlValue("LT", true, oSmartField, fnResolve, assert);

				// Act
				oSmartField.setEditable(true);

			}.bind(this));

		}.bind(this)).then(function () {

			// We finished all assertions
			done();

		});

		// Act
		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		await nextUIUpdate();
	});

	QUnit.test("fetchValueListReadOnly equals 'false'", async function(assert) {
		var done = assert.async();
		assert.expect(1);

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'SecondCategory' }",
			editable: false,
			fetchValueListReadOnly: false
		});

		// Assert
		this.assertInnerControlValue("LT", false, oSmartField, done, assert);

		// Act
		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		await nextUIUpdate();
	});

	// SmartField may be first added to the view via fragment with the binding context of the parent
	// initially propagated to it and after that exchanged with more specific binding context.
	// This is relevant for Smart Templates OP extension scenario.
	QUnit.test("Exchanging binding context should re-apply text arrangement", async function(assert) {
		var done = assert.async();
		assert.expect(2);

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'SecondCategory' }",
			editable: false
		});

		new Promise(function (fnResolve, fnReject) {

			// Assert
			this.assertInnerControlValue("LT (Laptop)", false, oSmartField, fnResolve, assert);

		}.bind(this)).then(function () {

			return new Promise(function (fnResolve, fnReject) {
				fnGetSmartFieldReady(oSmartField).then(function () {
					// Assert -> text arrangement is applied for the new binding context
					assert.strictEqual(oSmartField.getDomRef().innerText,
						"LT (Laptop)", "Text arrangement is applied for the new binding context");
					fnResolve();
				});

				// Act - Change the model to trigger change of binding context after
				// the control was rendered with another
				this.oVBox.setModel(oDataModel2);
			}.bind(this));

		}.bind(this)).then(function () {
			// We finished all assertions
			done();
		});

		// Act
		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		await nextUIUpdate();
	});

	QUnit.test("BCP: 2080185890 -> no request should be made if there is no sap:text annotation", async function(assert) {
		var done = assert.async(),
			aRequestsList;

		assert.expect(1);

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'SixthCategory' }",
			editable: false
		});

		// Attach to the mock server so we make sure no requests are send
		aRequestsList = oMockServer.getRequests();
		aRequestsList.push({
			method: 'GET',
			path: 'VL_SH_H_CATEGORY_NO_TEXT(.*)',
			response: function(oRequest /*, oResponse */) {
				assert.ok(false, "We should not make any value help requests in this scenario");
				assert.ok(
					oRequest.url.indexOf("undefined") === -1,
					"There should be no `undefined` in the request URL"
				);
			}
		});

		// Re-init the mock server
		oMockServer.stop();
		oMockServer.setRequests(aRequestsList);
		oMockServer.start();

		// Assert
		this.assertInnerControlValue("LT", false, oSmartField, function () {
			// Restore the mock server in timeout so we make sure no requests will be made
			setTimeout(function () {
				// Clean up the mock server
				aRequestsList = oMockServer.getRequests();
				aRequestsList.pop(); // Remove the request listener we have added -> Array.pop modifies the source array

				// Re-init the mock server
				oMockServer.stop();
				oMockServer.setRequests(aRequestsList);
				oMockServer.start();

				// We finish the test
				done();
			}, 200);
		}, assert);

		// Act
		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		await nextUIUpdate();
	});

	// TODO: Make separate request/response testing file and move such tests there
	QUnit.test("Only one request should be made if there is no value list annotation", async function(assert) {
		var done = assert.async(),
			oRequestSpy = this.spy(),
			aRequestsList;

		assert.expect(3);

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'CategoryName' }",
			editable: false
		});

		var fnRequestHandler = function (oEvent) {
			// Call our request SPY so it can collect the needed data
			oRequestSpy(oEvent.getParameter("oXhr").url);
		};

		// Attach to the mock server so we make sure no requests are send
		oMockServer.attachBefore("GET", fnRequestHandler);

		// Assert
		this.assertInnerControlValue("Projector", false, oSmartField, function () {
			// Restore the mock server in timeout so we make sure no requests will be made
			setTimeout(function () {
				oMockServer.detachBefore("GET", fnRequestHandler);
				assert.strictEqual(oRequestSpy.callCount, 1, "Mock server called only once with GET request");
				assert.strictEqual(
					oRequestSpy.getCall(0).args[0],
					"odata/Products('1239102')",
					"Request was retrieving the main record"
				);

				// Clean up the mock server
				aRequestsList = oMockServer.getRequests();
				aRequestsList.shift(); // Remove the request listener we have added -> Array.shift modifies the source array

				// Re-init the mock server
				oMockServer.stop();
				oMockServer.setRequests(aRequestsList);
				oMockServer.start();

				// We finish the test
				done();
			}, 200);
		}, assert);

		// Act
		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		await nextUIUpdate();
	});

	// QUnit.test("BCP: 2080189893 Switch from mode 'display' to 'editable' should not call reBind", function(assert) {
	// 	var done = assert.async(),
	// 		oRebindSpy;

	// 	assert.expect(3);

	// 	// system under test
	// 	var oSmartField = new SmartField({
	// 		value: "{ path: 'CategoryName' }",
	// 		editable: true
	// 	});

	// 	new Promise(function (fnResolve, fnReject) {

	// 		// Assert
	// 		this.assertInnerControlValue("Projector", true, oSmartField, function () {
	// 			var oFactory = oSmartField.getControlFactory();

	// 			// Attach spy's
	// 			oRebindSpy = this.spy(oFactory, "reBind");

	// 			fnResolve();
	// 		}.bind(this), assert);

	// 	}.bind(this)).then(function () {

	// 		return new Promise(function (fnResolve, fnReject) {

	// 			// Assert
	// 			this.assertInnerControlValue("Projector", false, oSmartField, fnResolve, assert);

	// 			// Act
	// 			oSmartField.setEditable(false);

	// 		}.bind(this));

	// 	}.bind(this)).then(function () {
	// 		// Assert
	// 		assert.strictEqual(oRebindSpy.callCount, 0, "reBind should not be called with no ValueList annotation");

	// 		// We finished all assertions
	// 		done();

	// 	});

	// 	// Act
	// 	this.oVBox.addItem(oSmartField);
	// 	this.oVBox.placeAt("qunit-fixture");
	// 	Core.applyChanges();
	// });

	QUnit.test("BCP: 2080189893 Switch from mode 'display' to 'editable' should fire initialise event only once and should not re-bind control properties twice", async function(assert) {
		var done = assert.async(),
			oInitialiseSpy = this.spy(),
			oSFBindPropertySpy,
			oFCBindPropertiesSpy;

		assert.expect(8);

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'SecondCategory' }",
			editable: true,
			initialise: oInitialiseSpy
		});

		oSFBindPropertySpy = this.spy(oSmartField, "bindProperty");

		new Promise(function (fnResolve, fnReject) {

			// Assert
			this.assertInnerControlValue("LT", true, oSmartField, function () {
				// Attach Field Control spy
				oFCBindPropertiesSpy = this.spy(oSmartField.getControlFactory()._oFieldControl, "bindProperties");

				fnResolve();
			}.bind(this), assert);

		}.bind(this)).then(function () {

			return new Promise(function (fnResolve, fnReject) {

				// Assert
				this.assertInnerControlValue("LT (Laptop)", false, oSmartField, fnResolve, assert);

				// Act
				oSmartField.setEditable(false);

			}.bind(this));

		}.bind(this)).then(function () {
			// Assert
			assert.strictEqual(oInitialiseSpy.callCount, 1, "initialized event called once during transition");
			assert.strictEqual(oFCBindPropertiesSpy.callCount, 0,
				"Field Control 'bindProperties' method should not be called during transition"
			);
			assert.strictEqual(oSFBindPropertySpy.callCount, 3, "SmartField bindProperty method");
			assert.strictEqual(
				oSFBindPropertySpy.getCalls().filter(function (oCall) {return oCall.args[0] === "editable";}).length,
				1,
				"SmartField bindProperty called for editable property once"
			);

			assert.strictEqual(
				oSFBindPropertySpy.getCalls().filter(function (oCall) {return oCall.args[0] === "visible";}).length,
				1,
				"SmartField bindProperty called for visible property once"
			);

			assert.strictEqual(
				oSFBindPropertySpy.getCalls().filter(function (oCall) {return oCall.args[0] === "mandatory";}).length,
				1,
				"SmartField bindProperty called for mandatory property once"
			);

			// We finished all assertions
			done();
		});

		// Act
		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		await nextUIUpdate();
	});

	QUnit.test("Two value list requests send on binding context update", async function(assert) {
		var done = assert.async(),
			oInitialiseSpy = this.spy(),
			oReadSpy = this.spy(TextArrangementDelegate.prototype, "readODataModel");

		assert.expect(3);

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'SecondCategory' }",
			editable: false,
			initialise: oInitialiseSpy,
			textInEditModeSource: "ValueList"
		});

		var oSmartForm = new SmartForm({
			groups: [
				new Group({
					groupElements: [
						new GroupElement({
							elements: [
								oSmartField
							]
						})
					]
				})
			]
		});

		new Promise(function (fnResolve, fnReject) {

			// Assert
			this.assertInnerControlValue("LT (Laptop)", false, oSmartField, fnResolve, assert);

		}.bind(this)).then(function () {
			// Act
			oSmartForm.bindObject({
				path: "/Products('1239102')"
			});

			// Assert
			assert.strictEqual(oSmartField.getTextInEditModeSource(), "ValueList", "Property set in display mode");

			// Assert
			setTimeout(function () {
				assert.strictEqual(oReadSpy.callCount, 2, "Read spy should be called twice");

				// We finished all assertions
				done();
			}, 200);

		});

		// Act
		this.oVBox.addItem(oSmartForm);
		this.oVBox.placeAt("qunit-fixture");
		await nextUIUpdate();
	});

	QUnit.test("_checkTextInDisplayModeValueList method checks display configuration from _getDisplayBehaviourConfiguration",
		async function(assert) {
			// Arrange
			var oSF = new SmartField({
					value: "{Category}"
				}),
				fnDone = assert.async();

			oSF.attachInitialise(function () {
				var oFactory = oSF.getControlFactory(),
					oSpy = this.spy(oFactory, "_getDisplayBehaviourConfiguration");
					oFactory._oMetaData.annotations.valuelist = "someValue";

				// Act
				oFactory._checkTextInDisplayModeValueList({mode: "display"});

				// Assert
				assert.strictEqual(oSpy.callCount, 1, "_getDisplayBehaviourConfiguration called once");

				// Cleanup
				oSpy.restore();
				oSF.destroy();

				// Conclude
				fnDone();
			}.bind(this));

			// Act
			this.oVBox.addItem(oSF);
			this.oVBox.placeAt("qunit-fixture");
			await nextUIUpdate();
		}
	);

	QUnit.test("Two value list requests send on binding context update", async function(assert) {
		var done = assert.async(),
			oInitialiseSpy = this.spy(),
			oReadSpy = this.spy(TextArrangementDelegate.prototype, "readODataModel");

		assert.expect(3);

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'SecondCategory' }",
			editable: false,
			initialise: oInitialiseSpy,
			textInEditModeSource: "ValueList"
		});

		var oSmartForm = new SmartForm({
			groups: [
				new Group({
					groupElements: [
						new GroupElement({
							elements: [
								oSmartField
							]
						})
					]
				})
			]
		});

		new Promise(function (fnResolve, fnReject) {

			// Assert
			this.assertInnerControlValue("LT (Laptop)", false, oSmartField, fnResolve, assert);

		}.bind(this)).then(function () {
			// Act
			oSmartForm.bindObject({
				path: "/Products('1239104')"
			});

			// Assert
			assert.strictEqual(oSmartField.getTextInEditModeSource(), "ValueList", "Property set in display mode");

			// Assert
			setTimeout(function () {
				assert.strictEqual(oReadSpy.callCount, 2, "Read spy should be called twice");

				// We finished all assertions
				done();
			}, 200);

		});

		// Act
		this.oVBox.addItem(oSmartForm);
		this.oVBox.placeAt("qunit-fixture");
		await nextUIUpdate();
	});

	QUnit.module("ValueList and TextArrangement in edit mode", {
		beforeEach: beforeEach,
		afterEach: afterEach,
		assertInnerControlValue: fnAssertInnerControlValue
	});


	QUnit.test("checkValuesValidity invoked when base control is in Error state, should not fallback to last valid value while staying in Error state.", async function(assert) {
		var done = assert.async();

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'SecondCategory' }",
			textInEditModeSource: "ValueList",
			editable: true
		});

		fnGetSmartFieldReady(oSmartField).then(async function() {
			// Arrange
			var oInput,
			oInputFocusDomRef;

			// Arrange
			await nextUIUpdate();
			oInput = oSmartField.getFirstInnerControl();
			oInputFocusDomRef = oSmartField.getFirstInnerControl().getFocusDomRef();
			// Act
			QUnitUtils.triggerCharacterInput(oInputFocusDomRef, "f", "ff");

			// Assert
			oSmartField.checkValuesValidity()
				.finally(function () {
					assert.strictEqual(oInput.getValue(), "ff",
						"The validation failed and the inner control value is the invalid value as expected"
					);
					assert.strictEqual(oInput.getValueState(), ValueState.Error,
						"ValueState is `Error` as expected"
					);
					done();
				});
		});

		this.oVBox.insertItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		await nextUIUpdate();
	});

	QUnit.test("BCP: 2080159141 -> setTextInEditModeSource called with 'ValueList' after control is initialized", async function(assert) {
		var done = assert.async();
		assert.expect(2);

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'SecondCategory' }",
			// textInEditModeSource: "None" -> default value
			editable: true
		});

		new Promise(function (fnResolve, fnReject) {

			// Assert
			this.assertInnerControlValue("LT", true, oSmartField, fnResolve, assert);

		}.bind(this)).then(function () {

			return new Promise(function (fnResolve, fnReject) {

				// Assert
				this.assertInnerControlValue("LT (Laptop)", true, oSmartField, fnResolve, assert);

				// Act
				oSmartField.setTextInEditModeSource("ValueList");

			}.bind(this));

		}.bind(this)).then(function () {

			// We finished all assertions
			done();

		});

		// Act
		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		await nextUIUpdate();
	});

	QUnit.test("BCP: 2080167558 -> setTextInEditModeSource with UpperCase annotation called with 'ValueList' after control is initialized", async function(assert) {
		var bEditMode = true, done = assert.async();
		assert.expect(2);

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'SeventhCategory' }",
			textInEditModeSource: "ValueList",
			editable: true,
			showSuggestion: false
		});

		// Act
		Promise.resolve().then(function () {
			return new Promise(function (fnResolve, fnReject) {
				// Assert
				return this.assertInnerControlValue("LT (Laptop)", bEditMode, oSmartField, fnResolve, assert);
			}.bind(this));
		}.bind(this)).then(function () {
			return new Promise(function (fnResolve, fnReject) {
				var oInnerControl = oSmartField.getFirstInnerControl(),
					oInnerControlFocusDomRef = oInnerControl.getFocusDomRef();

				// Act
				QUnitUtils.triggerCharacterInput(oInnerControlFocusDomRef, "1", "pr");
				oInnerControl.onChange();

				oSmartField.getBinding("value").attachChange(function(){
					fnResolve();
				});
			});
		}).then(function () {
			var oInnerControl = oSmartField.getFirstInnerControl();
			// Assert
			assert.strictEqual(
				oInnerControl[bEditMode ? "getValue" : "getText"](),
				"PR (Projector)",
				"Input has expected value"
			);
		}).then(function () {
			// We finished all assertions
			done();
		});

		// Act
		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		await nextUIUpdate();
	});

	QUnit.test("BCP: 2080300573 -> TextInEditModeSource and FieldControl supported simultaneously", async function(assert) {
		var done = assert.async(),
			oSmartField,
			oSmartForm;

		assert.expect(3);

		oSmartField = new SmartField({
			value: "{ path: 'SecondCategory' }",
			textInEditModeSource: "ValueList",
			editable: true
		});

		oSmartForm = new SmartForm({
			editable: true,
			groups: [
				new Group({
					groupElements: [
						new GroupElement({
							elements: [
								oSmartField
							]
						})
					]
				})
			]
		});

		oSmartField.attachInitialise(
			function () {
				assert.strictEqual(
					oSmartField.getFirstInnerControl().getLabels()[0].getText(),
					"Second Category",
					"Label text should match"
				);
				assert.strictEqual(
					oSmartField.getMandatory(),
					true,
					"SmartField should has it's property set to mandatory true"
				);
				assert.strictEqual(
					oSmartField.getFirstInnerControl().getRequired(),
					true,
					"Input should has it's property set to required true"
				);
				done();
			}
		);

		// Act
		this.oVBox.addItem(oSmartForm);
		this.oVBox.placeAt("qunit-fixture");
		await nextUIUpdate();
	});

	QUnit.test("BCP: 2080337523 -> Smart field to fire change event", async function(assert) {
		var done = assert.async(),
			oChangeSpy = this.spy(),
			oSmartField,
			oSmartForm;

		assert.expect(1);

		oSmartField = new SmartField({
			value: "{ path: 'SecondCategory' }",
			textInEditModeSource: "ValueList",
			editable: true,
			change: oChangeSpy
		});

		oSmartForm = new SmartForm({
			editable: true,
			groups: [
				new Group({
					groupElements: [
						new GroupElement({
							elements: [
								oSmartField
							]
						})
					]
				})
			]
		});
		oSmartField.attachInnerControlsCreated(
			function () {
				oSmartField.getFirstInnerControl().fireChange();
			}
		);
		oSmartField.attachChange(
			function () {
				assert.ok("SmartField should fire change");
				done();
			}
		);

		// Act
		this.oVBox.addItem(oSmartForm);
		this.oVBox.placeAt("qunit-fixture");
		await nextUIUpdate();
	});

	QUnit.test("Switch from mode 'display' to 'editable' with textInEditModeSource='ValueList'", async function(assert) {
		var done = assert.async(),
		oReadODataModelSpy;

		assert.expect(3);

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'SecondCategory' }",
			textInEditModeSource: "ValueList",
			editable: false
		});

		new Promise(function (fnResolve, fnReject) {

			// Assert
			this.assertInnerControlValue("LT (Laptop)", false, oSmartField, function () {
				oReadODataModelSpy = this.spy(oSmartField.getControlFactory().oTextArrangementDelegate, "readODataModel");
				fnResolve();
			}.bind(this), assert);

		}.bind(this)).then(function () {
			return new Promise(function (fnResolve, fnReject) {
				// Assert
				this.assertInnerControlValue("LT (Laptop)", true, oSmartField, fnResolve, assert);

				// Act
				oSmartField.setEditable(true);
			}.bind(this));

		}.bind(this)).then(function () {
			assert.strictEqual(oReadODataModelSpy.callCount, 1, "ReBind called when transitioning from disply to edit mode");

			// We finished all assertions
			done();
		});

		// Act
		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		await nextUIUpdate();
	});

	QUnit.test("Test defaultTextInEditModeSource with ValueList", async function(assert) {
		var done = assert.async(),
			oSmartField,
			oSmartForm;

		assert.expect(1);

		oSmartField = new SmartField({
			value: "{ path: 'SecondCategory' }",
			editable: true
		});

		oSmartForm = new SmartForm({
			editable: true,
			customData: [
				new CustomData({
				key: "defaultTextInEditModeSource",
				value: "ValueList"
			})],
			groups: [
				new Group({
					groupElements: [
						new GroupElement({
							elements: [
								oSmartField
							]
						})
					]
				})
			]
		});

		new Promise(function (fnResolve, fnReject) {

			// Assert
			this.assertInnerControlValue("LT (Laptop)", true, oSmartField, fnResolve, assert);

		}.bind(this)).then(function () {
			// We finished all assertions
			done();
		});


		// Act
		this.oVBox.addItem(oSmartForm);
		this.oVBox.placeAt("qunit-fixture");
		await nextUIUpdate();
	});

	QUnit.test("Test defaultTextInEditModeSource with ValueListNoValidation and isDigitalSequence", async function(assert) {
		var done = assert.async(),
			oSmartField,
			oSmartForm;

		assert.expect(4);

		oSmartField = new SmartField({
			value: "{ path: 'EightCategory' }",
			editable: true
		});

		oSmartForm = new SmartForm({
			editable: true,
			customData: [
				new CustomData({
					key: "defaultTextInEditModeSource",
					value: "ValueListNoValidation"
				})],
			groups: [
				new Group({
					groupElements: [
						new GroupElement({
							elements: [
								oSmartField
							]
						})
					]
				})
			]
		});

		new Promise(function (fnResolve, fnReject) {
			// Assert
			this.assertInnerControlValue("1 (Office)", true, oSmartField, fnResolve, assert);
		}.bind(this)).then(function () {
			return new Promise(function (fnResolve, fnReject) {
				var oInnerControl = oSmartField.getFirstInnerControl(),
					oInnerControlFocusDomRef = oInnerControl.getFocusDomRef();

				var oDelegate = {
					onAfterRendering: function () {
						// We execute the delegate only once
						oInnerControl.removeDelegate(oDelegate);

						assert.strictEqual(oInnerControl.getValueState(), "Error", "ValueState is `Error`");
						assert.strictEqual(
							oSmartField.getBinding("value").getValue(),
							"1",
							"Non numeric value is not stored in local model."
						);
						fnResolve();
					}
				};

				oInnerControl.addDelegate(oDelegate);

				// Act
				QUnitUtils.triggerCharacterInput(oInnerControlFocusDomRef, "a", "abc");
				oInnerControl.onChange();
			});
		}).then(function () {
			return new Promise(function (fnResolve, fnReject) {
				var oInnerControl = oSmartField.getFirstInnerControl(),
					oInnerControlFocusDomRef = oInnerControl.getFocusDomRef();

				// Act
				QUnitUtils.triggerCharacterInput(oInnerControlFocusDomRef, "4", "4");
				oInnerControl.onChange();

				oSmartField.getBinding("value").attachChange(function(oEvent){
					assert.strictEqual(
						oSmartField.getBinding("value").getValue(),
						"4",
						"Numeric value is stored in local model."
					);
					fnResolve();
				});
			});
		}).then(function () {
			// We finished all assertions
			done();
		});

		// Act
		this.oVBox.addItem(oSmartForm);
		this.oVBox.placeAt("qunit-fixture");
		await nextUIUpdate();
	});

	QUnit.test("BCP: 2070396210 We do not modify the reference provided via dateFormatSettings", async function(assert) {
		var done = assert.async(),
			oDateFormatSettings = {UTC: true, style: "short"},
			oSmartField;

		assert.expect(2);

		oSmartField = new SmartField({
			value: "{ path: 'AvailableSince' }",
			editable: false
		});

		oSmartField.data("dateFormatSettings", oDateFormatSettings);
		oSmartField.attachEventOnce("innerControlsCreated", function() {

		var oInnerControl = oSmartField.getFirstInnerControl(),
			oDelegate = {
				onAfterRendering: function () {
					// We execute the delegate only once
					oInnerControl.removeDelegate(oDelegate);

					// Assert
					assert.strictEqual(oDateFormatSettings.UTC, true, "object reference is not modified");
					assert.strictEqual(
						oInnerControl.getBinding("text").getType().oFormatOptions.UTC,
						false,
						"Reference provided to the type is with format options UTC=false"
					);

					done();
				}
			};

			oInnerControl.addDelegate(oDelegate);
		});

		// Act
		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		await nextUIUpdate();
	});

	QUnit.test("BCP: 2180272821 We do not modify the reference provided via dateFormatSettings", async function(assert) {
		var done = assert.async(),
			oDateFormatSettings = {UTC: true, style: "short"},
			oSmartField;

		assert.expect(2);

		oSmartField = new SmartField({
			id: "foooooooooooo",
			value: "{ path: 'AvailableSince' }",
			editable: true
		});

		oSmartField.data("dateFormatSettings", oDateFormatSettings);
		oSmartField.attachEventOnce("innerControlsCreated", function() {

		var oInnerControl = oSmartField.getFirstInnerControl(),
			oDelegate = {
				onAfterRendering: function () {
					// We execute the delegate only once
					oInnerControl.removeDelegate(oDelegate);

					// Assert
					assert.strictEqual(oDateFormatSettings.UTC, true, "object reference is not modified");
					assert.strictEqual(
						oInnerControl.getBinding("value").getType().oFormatOptions.UTC,
						false,
						"Reference provided to the type is with format options UTC=false"
					);

					done();
				}
			};

			oInnerControl.addDelegate(oDelegate);
		});

		// Act
		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		await nextUIUpdate();
	});

	QUnit.test("BCP: 2170215093 Edm.Guid with TextArrangement and TextOnly - hide 0-Guid", function(assert) {
		// Arrange
		var oSmartField = new SmartField({
				value: "{GroupGuid}",
				textInEditModeSource: "ValueListNoValidation"
			}),
			fnDone = assert.async();

		assert.expect(2);

		oSmartField.attachInnerControlsCreated(function(oControlEvent) {
			// Assert
			assert.strictEqual(oSmartField.getFirstInnerControl().getValue(), "", "Internal input has empty value");
			assert.strictEqual(oSmartField.getBinding("value").getValue(), "00000000-0000-0000-0000-000000000000",
				"Binding has the 0-Guid");

			// Cleanup
			fnDone();
		});

		// Act
		this.oVBox.addItem(oSmartField);
	});

	QUnit.module("Display-format='NonNegative' with TextArrangement display mode ", oQUnitModuleDefaultSettings);

	QUnit.test("Showing empty string instead of null in the case of display-format='NonNegative' and key '0'", async function(assert) {
		var done = assert.async(),
			oSmartField;

		assert.expect(1);

		oSmartField = new SmartField({
			value: "{ path: 'LanguageCode1' }",
			editable: false
		});

		oSmartField.attachInnerControlsCreated(function(oControlEvent) {
			var sValue = " (Titanium)",
				oSmartControl = oControlEvent.getSource(),
				oInnerControl = oSmartControl.getFirstInnerControl();

			// Act

			// Assert
			assert.equal(oInnerControl.getText(), sValue, "The formatted value is propagated to the inner control");
			done();
		});

		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		await nextUIUpdate();
	});

	QUnit.test("Showing empty string instead of null in the case of display-format='NonNegative' and key '0' fixed-list", async function(assert) {
		var done = assert.async(),
			oSmartField;

		assert.expect(1);

		oSmartField = new SmartField({
			value: "{ path: 'LanguageCode3' }",
			editable: false
		});

		oSmartField.attachInnerControlsCreated(function(oControlEvent) {
			var sValue = " (Titanium)",
				oSmartControl = oControlEvent.getSource(),
				oInnerControl = oSmartControl.getFirstInnerControl();

			// Act

			// Assert
			assert.equal(oInnerControl.getText(), sValue, "The formatted value is propagated to the inner control");
			done();
		});

		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		await nextUIUpdate();
	});

	QUnit.module("Date Format", oQUnitModuleDefaultSettings);

	QUnit.test("Formatting Edm.DateTime, sap:display-format='Date' and 'url' property", function(assert) {
		var fnDone = assert.async(),
			oFormat = {"UTC":true, "style":"short"},
			oSmartField;

		assert.expect(1);

		// system under test
		oSmartField = new SmartField({
			value: "{ path: 'CreationDate' }",
			url: "https://www.sap.com",
			editable: false
		});

		oSmartField.data("dateFormatSettings", oFormat);

		// arrange
		oSmartField.attachInnerControlsCreated(function() {
			var sExpectedDate = DateFormat.getDateInstance(oFormat).format(oSmartField.getBinding("value").getValue());

			// assert
			assert.strictEqual(oSmartField.getFirstInnerControl().getText(), sExpectedDate, "Date is formatted");
			fnDone();
		}, this);

		this.oVBox.addItem(oSmartField);
	});

	QUnit.module("RTA", oQUnitModuleDefaultSettings);

	QUnit.test("readODataLabel loads the label for non-initialized SmartField", function (assert) {
		// Arrange
		var oSmartField = new SmartField({
				value: "{Name}",
				visible: false, // Force the SmartField not to initialise,
				initialise: function () {
					assert.ok(false, "Control should not be initialised");
				},
				innerControlsCreated: function () {
					assert.ok(false, "Inner controls should not be created");
				}
			}),
			fnDone = assert.async();

		assert.expect(3);

		// Act
		oSmartField.setModel(oDataModel);
		oSmartField.bindObject({
			path: "/Products('1239102')",
			events: {
				dataReceived: function (e) {
					// Assert
					assert.strictEqual(oSmartField.getDataSourceLabel(), "", "Data source label is not retrieved.");

					// Act - force read the OData label
					oSmartField.readODataLabel().then(function (sLabel) {
						// Assert
						assert.strictEqual(sLabel, "Name", "Label is read from the OData service");
						assert.strictEqual(oSmartField.getDataSourceLabel(), "Name", "SmartField label now returns the label");
						fnDone();
					});
				}
			}
		});

	});
	QUnit.module("Display mode currency in smart form", oQUnitModuleDefaultSettings);

	QUnit.test('it should set the currency field to not editable when the amount property has sap:updatable= "false" but the form is editable', async function(assert) {

		var done = assert.async();
		assert.expect(8);

		// system under test
		var oFirstSmartField = new SmartFieldTestWrapper({
			value: "{ path: 'Amount' }"
		});
		var oSecondSmartField = new SmartFieldTestWrapper({
			value: "{ path: 'DeliveryAmount' }"
		});


		var oSmartForm = new SmartForm({
			editable: true,
			groups: [
				new Group({
					groupElements: [
						new GroupElement({
							elements: [
								oFirstSmartField
							]
						}),
						new GroupElement({
							elements: [
								oSecondSmartField
							]
						})
					]
				})
			]
		});

		Promise.all([
			oFirstSmartField.getTestReadyPromise(),
			oSecondSmartField.getTestReadyPromise()
		]).then(function () {
			var aInnerControls = oFirstSmartField.getInnerControls();
			assert.strictEqual(oFirstSmartField.getEditable(), true, "SmartField is editable");
			assert.strictEqual(aInnerControls.length, 2, "Inner controls length is 2");
			assert.strictEqual(aInnerControls[0].getEditable(), true, "First inner control is editable");
			assert.strictEqual(aInnerControls[1].getEditable(), true, "Second inner control is editable");

			aInnerControls = oSecondSmartField.getInnerControls();
			assert.strictEqual(oSecondSmartField.getEditable(), false, "SmartField is not editable");
			assert.strictEqual(aInnerControls.length, 2, "Inner controls length is 2");
			assert.strictEqual(aInnerControls[0].isA("sap.m.Text"), true, "First inner control is text");
			assert.strictEqual(aInnerControls[1].isA("sap.m.Text"), true, "Second inner control is text");
			// We finished all assertions
			done();
		});

		// Act
		this.oVBox.addItem(oSmartForm);
		this.oVBox.placeAt("qunit-fixture");
		await nextUIUpdate();
	});

	QUnit.test('it should set the currency field to not editable when the amount property has sap:updatable= "false" but the form is not editable', async function(assert) {

		var done = assert.async();
		assert.expect(8);

		// system under test
		var oFirstSmartField = new SmartFieldTestWrapper({
			value: "{ path: 'Amount' }"
		});
		var oSecondSmartField = new SmartFieldTestWrapper({
			value: "{ path: 'DeliveryAmount' }"
		});


		var oSmartForm = new SmartForm({
			editable: false,
			groups: [
				new Group({
					groupElements: [
						new GroupElement({
							elements: [
								oFirstSmartField
							]
						}),
						new GroupElement({
							elements: [
								oSecondSmartField
							]
						})
					]
				})
			]
		});

		Promise.all([
			oFirstSmartField.getTestReadyPromise(),
			oSecondSmartField.getTestReadyPromise()
		]).then(function () {
			var aInnerControls = oFirstSmartField.getInnerControls();
			assert.strictEqual(oFirstSmartField.getEditable(), true, "SmartField is editable");
			assert.strictEqual(aInnerControls.length, 2, "Inner controls length is 2");
			assert.strictEqual(aInnerControls[0].isA("sap.m.Text"), true, "First inner control is text");
			assert.strictEqual(aInnerControls[1].isA("sap.m.Text"), true, "Second inner control is text");

			aInnerControls = oSecondSmartField.getInnerControls();
			assert.strictEqual(oSecondSmartField.getEditable(), false, "SmartField is not editable");
			assert.strictEqual(aInnerControls.length, 2, "Inner controls length is 2");
			assert.strictEqual(aInnerControls[0].isA("sap.m.Text"), true, "First inner control is text");
			assert.strictEqual(aInnerControls[1].isA("sap.m.Text"), true, "Second inner control is text");
			// We finished all assertions
			done();
		});

		// Act
		this.oVBox.addItem(oSmartForm);
		this.oVBox.placeAt("qunit-fixture");
		await nextUIUpdate();
	});

	QUnit.test('it should set the currency field to editable when the amount property has sap:updatable= "false" but code sap:updatable= "true" and the form is editable', async function(assert) {

		var done = assert.async();
		assert.expect(8);

		// system under test
		var oFirstSmartField = new SmartFieldTestWrapper({
			value: "{ path: 'Amount' }"
		});
		var oSecondSmartField = new SmartFieldTestWrapper({
			value: "{ path: 'DeliveryAmount2' }"
		});


		var oSmartForm = new SmartForm({
			editable: true,
			groups: [
				new Group({
					groupElements: [
						new GroupElement({
							elements: [
								oFirstSmartField
							]
						}),
						new GroupElement({
							elements: [
								oSecondSmartField
							]
						})
					]
				})
			]
		});

		Promise.all([
			oFirstSmartField.getTestReadyPromise(),
			oSecondSmartField.getTestReadyPromise()
		]).then(function () {
			var aInnerControls = oFirstSmartField.getInnerControls();
			assert.strictEqual(oFirstSmartField.getEditable(), true, "SmartField is editable");
			assert.strictEqual(aInnerControls.length, 2, "Inner controls length is 2");
			assert.strictEqual(aInnerControls[0].getEditable(), true, "First inner control is editable");
			assert.strictEqual(aInnerControls[1].getEditable(), true, "Second inner control is editable");

			aInnerControls = oSecondSmartField.getInnerControls();
			assert.strictEqual(oSecondSmartField.getEditable(), false, "SmartField is not editable");
			assert.strictEqual(aInnerControls.length, 2, "Inner controls length is 2");
			assert.strictEqual(aInnerControls[0].isA("sap.m.Text"), true, "First inner control is text");
			assert.strictEqual(aInnerControls[1].getEditable(), true, "Second inner control is editable");
			// We finished all assertions
			done();
		});

		// Act
		this.oVBox.addItem(oSmartForm);
		this.oVBox.placeAt("qunit-fixture");
		await nextUIUpdate();
	});

	QUnit.test('it should set the currency field to editable when the amount property has sap:updatable= "false" but code sap:updatable= "true" and the form is not editable', async function(assert) {

		var done = assert.async();
		assert.expect(8);

		// system under test
		var oFirstSmartField = new SmartFieldTestWrapper({
			value: "{ path: 'Amount' }"
		});
		var oSecondSmartField = new SmartFieldTestWrapper({
			value: "{ path: 'DeliveryAmount2' }"
		});


		var oSmartForm = new SmartForm({
			editable: false,
			groups: [
				new Group({
					groupElements: [
						new GroupElement({
							elements: [
								oFirstSmartField
							]
						}),
						new GroupElement({
							elements: [
								oSecondSmartField
							]
						})
					]
				})
			]
		});

		Promise.all([
			oFirstSmartField.getTestReadyPromise(),
			oSecondSmartField.getTestReadyPromise()
		]).then(function () {
			var aInnerControls = oFirstSmartField.getInnerControls();
			assert.strictEqual(oFirstSmartField.getEditable(), true, "SmartField is editable");
			assert.strictEqual(aInnerControls.length, 2, "Inner controls length is 2");
			assert.strictEqual(aInnerControls[0].isA("sap.m.Text"), true, "First inner control is text");
			assert.strictEqual(aInnerControls[1].isA("sap.m.Text"), true, "Second inner control is text");

			aInnerControls = oSecondSmartField.getInnerControls();
			assert.strictEqual(oSecondSmartField.getEditable(), false, "SmartField is not editable");
			assert.strictEqual(aInnerControls.length, 2, "Inner controls length is 2");
			assert.strictEqual(aInnerControls[0].isA("sap.m.Text"), true, "First inner control is text");
			assert.strictEqual(aInnerControls[1].isA("sap.m.Text"), true, "Second inner control is text");
			// We finished all assertions
			done();
		});

		// Act
		this.oVBox.addItem(oSmartForm);
		this.oVBox.placeAt("qunit-fixture");
		await nextUIUpdate();
	});

	QUnit.test('it should set the currency field to editable when the amount property has sap:field-control editable but code sap:field-control not editable and the form is editable', async function(assert) {

		var done = assert.async();
		assert.expect(8);

		// system under test
		var oFirstSmartField = new SmartFieldTestWrapper({
			value: "{ path: 'Amount' }"
		});
		var oSecondSmartField = new SmartFieldTestWrapper({
			value: "{ path: 'Amount3' }"
		});


		var oSmartForm = new SmartForm({
			editable: true,
			groups: [
				new Group({
					groupElements: [
						new GroupElement({
							elements: [
								oFirstSmartField
							]
						}),
						new GroupElement({
							elements: [
								oSecondSmartField
							]
						})
					]
				})
			]
		});

		Promise.all([
			oFirstSmartField.getTestReadyPromise(),
			oSecondSmartField.getTestReadyPromise()
		]).then(function () {
			var aInnerControls = oFirstSmartField.getInnerControls();
			assert.strictEqual(oFirstSmartField.getEditable(), true, "SmartField is editable");
			assert.strictEqual(aInnerControls.length, 2, "Inner controls length is 2");
			assert.strictEqual(aInnerControls[0].getEditable(), true, "First inner control is editable");
			assert.strictEqual(aInnerControls[1].getEditable(), true, "Second inner control is editable");

			aInnerControls = oSecondSmartField.getInnerControls();
			assert.strictEqual(oSecondSmartField.getEditable(), false, "SmartField is not editable");
			assert.strictEqual(aInnerControls.length, 2, "Inner controls length is 2");
			assert.strictEqual(aInnerControls[0].isA("sap.m.Text"), true, "First inner control is text");
			assert.strictEqual(aInnerControls[1].getEditable(), true, "Second inner control is editable");

			// We finished all assertions
			done();
		});

		// Act
		this.oVBox.addItem(oSmartForm);
		this.oVBox.placeAt("qunit-fixture");
		await nextUIUpdate();
	});

	QUnit.test('it should set the currency field to editable when the amount property has ap:field-control editable but code sap:field-control not editable and the form is not editable', async function(assert) {

		var done = assert.async();
		assert.expect(8);

		// system under test
		var oFirstSmartField = new SmartFieldTestWrapper({
			value: "{ path: 'Amount' }"
		});
		var oSecondSmartField = new SmartFieldTestWrapper({
			value: "{ path: 'Amount3' }"
		});

		var oSmartForm = new SmartForm({
			editable: false,
			groups: [
				new Group({
					groupElements: [
						new GroupElement({
							elements: [
								oFirstSmartField
							]
						}),
						new GroupElement({
							elements: [
								oSecondSmartField
							]
						})
					]
				})
			]
		});

		Promise.all([
			oFirstSmartField.getTestReadyPromise(),
			oSecondSmartField.getTestReadyPromise()
		]).then(function () {
			var aInnerControls = oFirstSmartField.getInnerControls();
			assert.strictEqual(oFirstSmartField.getEditable(), true, "SmartField is editable");
			assert.strictEqual(aInnerControls.length, 2, "Inner controls length is 2");
			assert.strictEqual(aInnerControls[0].isA("sap.m.Text"), true, "First inner control is text");
			assert.strictEqual(aInnerControls[1].isA("sap.m.Text"), true, "Second inner control is text");

			aInnerControls = oSecondSmartField.getInnerControls();
			assert.strictEqual(oSecondSmartField.getEditable(), false, "SmartField is not editable");
			assert.strictEqual(aInnerControls.length, 2, "Inner controls length is 2");
			assert.strictEqual(aInnerControls[0].isA("sap.m.Text"), true, "First inner control is text");
			assert.strictEqual(aInnerControls[1].isA("sap.m.Text"), true, "Second inner control is text");
			// We finished all assertions
			done();
		});

		// Act
		this.oVBox.addItem(oSmartForm);
		this.oVBox.placeAt("qunit-fixture");
		await nextUIUpdate();
	});

	QUnit.module("LayoutData", oQUnitModuleDefaultSettings);

	QUnit.test("LayoutData is updated when SmartField and UoM Smartfield are editable", function(assert) {
		var oSmartField,
			oFactorySettings = {mode: "edit"},
			bIsAmoutEditable = true,
			bIsUoMEditable = oFactorySettings.mode === "edit",
			done = assert.async();

		// We will invoke updateControl programatically to make sure
		// that the LayoutData will be updated after the control is rendered and
		// will not be invalidated and rerendered for any reason.
		sinon.stub(ControlFactoryBase.prototype, "updateControl").returns();

		oSmartField = new SmartField({
			value: "{ path: 'Price' }",
			editable: bIsAmoutEditable,
			uomEditable: bIsUoMEditable
		});

		// arrange
		oSmartField.attachInnerControlsCreated(function() {
			var oUoMNestedSmartField = this._getEmbeddedSmartField(),
				oInnerInputControl = this.getFirstInnerControl(),
				oUoMLayoutData = oUoMNestedSmartField.getLayoutData(),
				oAmountLayoutData = oInnerInputControl.getLayoutData(),
				sUoMLayoutDataId = oUoMLayoutData.getId(),
				sAmountLayoutDataId = oAmountLayoutData.getId(),
				sUoMLayoutDataStyle = oUoMLayoutData.getDomRef().getAttribute("style"),
				sUoMLayoutDataClass = oUoMLayoutData.getDomRef().getAttribute("class"),
				sAmountLayoutDataStyle = oAmountLayoutData.getDomRef().getAttribute("style"),
				sAmountLayoutDataClass = oAmountLayoutData.getDomRef().getAttribute("class");

			// act
			ControlFactoryBase.prototype.updateControl.restore();
			oUoMNestedSmartField._oFactory.updateControl(oFactorySettings);

			// assert
			assert.strictEqual(oUoMNestedSmartField.getLayoutData().getId(), sUoMLayoutDataId, "The UoM LayoutData reference is the same");
			assert.notStrictEqual(oUoMNestedSmartField.getLayoutData().getDomRef().getAttribute("style"), sUoMLayoutDataStyle, "The UoM style is updated");
			assert.notStrictEqual(oUoMNestedSmartField.getLayoutData().getDomRef().getAttribute("class"), sUoMLayoutDataClass, "The UoM class is updated");

			assert.strictEqual(oInnerInputControl.getLayoutData().getId(), sAmountLayoutDataId, "The Amount LayoutData reference is the same");
			assert.notStrictEqual(oInnerInputControl.getLayoutData().getDomRef().getAttribute("style"), sAmountLayoutDataStyle, "The Amount style is updated");
			assert.notStrictEqual(oInnerInputControl.getLayoutData().getDomRef().getAttribute("class"), sAmountLayoutDataClass, "The Amount class is updated");
			done();
		});

		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
	});

	QUnit.test("LayoutData is updated when SmartField is editable but UoM Smartfield is not editable", function(assert) {
		var oSmartField,
			oFactorySettings = {mode: "display"},
			bIsAmoutEditable = true,
			bIsUoMEditable = oFactorySettings.mode === "edit",
			done = assert.async();

		// We will invoke updateControl programatically to make sure
		// that the LayoutData will be updated after the control is rendered and
		// will not be invalidated and rerendered for any reason.
		sinon.stub(ControlFactoryBase.prototype, "updateControl").returns();

		oSmartField = new SmartField({
			value: "{ path: 'Price' }",
			editable: bIsAmoutEditable,
			uomEditable: bIsUoMEditable
		});

		// arrange
		oSmartField.attachInnerControlsCreated(function() {
			var oUoMNestedSmartField = this._getEmbeddedSmartField(),
				oInnerInputControl = this.getFirstInnerControl(),
				oUoMLayoutData = oUoMNestedSmartField.getLayoutData(),
				oAmountLayoutData = oInnerInputControl.getLayoutData(),
				sUoMLayoutDataId = oUoMLayoutData.getId(),
				sAmountLayoutDataId = oAmountLayoutData.getId(),
				sUoMLayoutDataStyle = oUoMLayoutData.getDomRef().getAttribute("style"),
				sUoMLayoutDataClass = oUoMLayoutData.getDomRef().getAttribute("class"),
				sAmountLayoutDataStyle = oAmountLayoutData.getDomRef().getAttribute("style"),
				sAmountLayoutDataClass = oAmountLayoutData.getDomRef().getAttribute("class");

			// act
			ControlFactoryBase.prototype.updateControl.restore();
			oUoMNestedSmartField._oFactory.updateControl(oFactorySettings);

			// assert
			assert.strictEqual(oUoMNestedSmartField.getLayoutData().getId(), sUoMLayoutDataId, "The UoM LayoutData reference is the same");
			assert.notStrictEqual(oUoMNestedSmartField.getLayoutData().getDomRef().getAttribute("style"), sUoMLayoutDataStyle, "The UoM style is updated");
			assert.notStrictEqual(oUoMNestedSmartField.getLayoutData().getDomRef().getAttribute("class"), sUoMLayoutDataClass, "The UoM class is updated");

			assert.strictEqual(oInnerInputControl.getLayoutData().getId(), sAmountLayoutDataId, "The Amount LayoutData reference is the same");
			assert.notStrictEqual(oInnerInputControl.getLayoutData().getDomRef().getAttribute("style"), sAmountLayoutDataStyle, "The Amount style is updated");
			assert.strictEqual(oInnerInputControl.getLayoutData().getDomRef().getAttribute("class"), sAmountLayoutDataClass, "The Amount class is the same");
			done();
		});

		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
	});

	QUnit.test("LayoutData is updated when SmartField is not editable but UoM Smartfield is editable", function(assert) {
		var oSmartField,
			oFactorySettings = {mode: "edit"},
			bIsAmoutEditable = false,
			bIsUoMEditable = oFactorySettings.mode === "edit",
			done = assert.async();

		// We will invoke updateControl programatically to make sure
		// that the LayoutData will be updated after the control is rendered and
		// will not be invalidated and rerendered for any reason.
		sinon.stub(ControlFactoryBase.prototype, "updateControl").returns();

		oSmartField = new SmartField({
			value: "{ path: 'Price' }",
			editable: bIsAmoutEditable,
			uomEditable: bIsUoMEditable
		});

		// arrange
		oSmartField.attachInnerControlsCreated(function() {
			var oUoMNestedSmartField = this._getEmbeddedSmartField(),
				oInnerTextControl = this.getFirstInnerControl(),
				oUoMLayoutData = oUoMNestedSmartField.getLayoutData(),
				oAmountLayoutData = oInnerTextControl.getLayoutData(),
				sUoMLayoutDataId = oUoMLayoutData.getId(),
				sAmountLayoutDataId = oAmountLayoutData.getId(),
				sUoMLayoutDataStyle = oUoMLayoutData.getDomRef().getAttribute("style"),
				sUoMLayoutDataClass = oUoMLayoutData.getDomRef().getAttribute("class"),
				sAmountLayoutDataStyle = oAmountLayoutData.getDomRef().getAttribute("style"),
				sAmountLayoutDataClass = oAmountLayoutData.getDomRef().getAttribute("class");

			// act
			ControlFactoryBase.prototype.updateControl.restore();
			oUoMNestedSmartField._oFactory.updateControl(oFactorySettings);

			// assert
			assert.strictEqual(oUoMNestedSmartField.getLayoutData().getId(), sUoMLayoutDataId, "The UoM LayoutData reference is the same");
			assert.strictEqual(oUoMNestedSmartField.getLayoutData().getDomRef().getAttribute("style"), sUoMLayoutDataStyle, "The UoM style is the same");
			assert.strictEqual(oUoMNestedSmartField.getLayoutData().getDomRef().getAttribute("class"), sUoMLayoutDataClass, "The UoM class is the same");

			assert.strictEqual(oInnerTextControl.getLayoutData().getId(), sAmountLayoutDataId, "The Amount LayoutData reference is the same");
			assert.strictEqual(oInnerTextControl.getLayoutData().getDomRef().getAttribute("style"), sAmountLayoutDataStyle, "The Amount style is the same");
			assert.strictEqual(oInnerTextControl.getLayoutData().getDomRef().getAttribute("class"), sAmountLayoutDataClass, "The Amount class is the same");
			done();
		});

		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
	});

	QUnit.test("LayoutData is updated when SmartField and UoM Smartfield are not editable", function(assert) {
		var oSmartField,
			oFactorySettings = {mode: "display"},
			bIsAmoutEditable = false,
			bIsUoMEditable = oFactorySettings.mode === "edit",
			done = assert.async();

		// We will invoke updateControl programatically to make sure
		// that the LayoutData will be updated after the control is rendered and
		// will not be invalidated and rerendered for any reason.
		sinon.stub(ControlFactoryBase.prototype, "updateControl").returns();

		oSmartField = new SmartField({
			value: "{ path: 'Price' }",
			editable: bIsAmoutEditable,
			uomEditable: bIsUoMEditable
		});

		// arrange
		oSmartField.attachInnerControlsCreated(function() {
			var oUoMNestedSmartField = this._getEmbeddedSmartField(),
				oInnerTextControl = this.getFirstInnerControl(),
				oUoMLayoutData = oUoMNestedSmartField.getLayoutData(),
				oAmountLayoutData = oInnerTextControl.getLayoutData(),
				sUoMLayoutDataId = oUoMLayoutData.getId(),
				sAmountLayoutDataId = oAmountLayoutData.getId(),
				sUoMLayoutDataStyle = oUoMLayoutData.getDomRef().getAttribute("style"),
				sUoMLayoutDataClass = oUoMLayoutData.getDomRef().getAttribute("class"),
				sAmountLayoutDataStyle = oAmountLayoutData.getDomRef().getAttribute("style"),
				sAmountLayoutDataClass = oAmountLayoutData.getDomRef().getAttribute("class");

			// act
			ControlFactoryBase.prototype.updateControl.restore();
			oUoMNestedSmartField._oFactory.updateControl(oFactorySettings);

			// assert
			assert.strictEqual(oUoMNestedSmartField.getLayoutData().getId(), sUoMLayoutDataId, "The UoM LayoutData reference is the same");
			assert.strictEqual(oUoMNestedSmartField.getLayoutData().getDomRef().getAttribute("style"), sUoMLayoutDataStyle, "The UoM style is the same");
			assert.strictEqual(oUoMNestedSmartField.getLayoutData().getDomRef().getAttribute("class"), sUoMLayoutDataClass, "The UoM class is the same");

			assert.strictEqual(oInnerTextControl.getLayoutData().getId(), sAmountLayoutDataId, "The Amount LayoutData reference is the same");
			assert.strictEqual(oInnerTextControl.getLayoutData().getDomRef().getAttribute("style"), sAmountLayoutDataStyle, "The Amount style is the same");
			assert.strictEqual(oInnerTextControl.getLayoutData().getDomRef().getAttribute("class"), sAmountLayoutDataClass, "The Amount class is the same");
			done();
		});

		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
	});

	QUnit.module("configdata and created entries", {
		beforeEach: function () {
			this.oConfigData = {
				"annotations": {},
				"path": "Name",
				"modelObject": oDataModel,
				"entitySetObject": {
					"name": "Employees",
					"entityType": "EmployeesNamespace.Employee",
					"extensions": [{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}, {
						"name": "content-version",
						"value": "1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}],
					"sap:creatable": "false",
					"Org.OData.Capabilities.V1.InsertRestrictions": {"Insertable": {"Bool": "false"}},
					"sap:content-version": "1",
					"Org.OData.Capabilities.V1.SearchRestrictions": {"Searchable": {"Bool": "false"}}
				},
				"entityType": {
					"name": "Employee",
					"key": {"propertyRef": [{"name": "Id"}]},
					"property": [{
						"name": "Id",
						"type": "Edm.String",
						"extensions": [{
							"name": "label",
							"value": "Employee Id",
							"namespace": "http://www.sap.com/Protocols/SAPData"
						}],
						"sap:label": "Employee Id",
						"com.sap.vocabularies.Common.v1.Label": {"String": "Employee Id"}
					}, {
						"name": "Name",
						"type": "Edm.String",
						"extensions": [{
							"name": "label",
							"value": "Name",
							"namespace": "http://www.sap.com/Protocols/SAPData"
						}],
						"sap:label": "Name",
						"com.sap.vocabularies.Common.v1.Label": {"String": "Name"}
					}],
					"extensions": [{
						"name": "label",
						"value": "Employees",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}, {
						"name": "content-version",
						"value": "1",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}],
					"namespace": "EmployeesNamespace",
					"entityType": "EmployeesNamespace.Employee",
					"sap:label": "Employees",
					"com.sap.vocabularies.Common.v1.Label": {"String": "Employees"},
					"sap:content-version": "1"
				},
				"navigationPath": "",
				"property": {
					"property": {
						"name": "Name",
						"type": "Edm.String",
						"extensions": [{
							"name": "label",
							"value": "Name",
							"namespace": "http://www.sap.com/Protocols/SAPData"
						}],
						"sap:label": "Name",
						"com.sap.vocabularies.Common.v1.Label": {"String": "Name"}
					},
					"typePath": "Name",
					"valueListAnnotation": null,
					"valueListKeyProperty": null,
					"valueListEntitySet": null,
					"valueListEntityType": null
				}
			};
		},
		createTempRecord: function () {
			return new Promise(function (fnResolve) {
				oDataModel.getMetaModel().loaded().then(function() {
					var oContext = oDataModel.createEntry("/Products", {
							properties : {
								"Name": "Default value"
							}
						});

					this.tempRecordPath = oContext.getPath();
					fnResolve(oContext);
				}.bind(this));
			}.bind(this));
		},
		createSmartField: function () {
			return this.createTempRecord().then(function () {
				var oSF = new SmartField({value: "{Name}"});

				oSF.setModel(oDataModel);
				oSF.bindElement(this.tempRecordPath);
				oSF.data("configdata", {configdata: this.oConfigData});
				this.oSF = oSF;

				return oSF;
			}.bind(this));
		},
		afterEach: function () {
			// Remove SmartField
			if (this.oSF) {
				this.oSF.destroy();
				this.oSF = null;
			}
			// Remove temp record from model
			if (this.tempRecordPath) {
				oDataModel.resetChanges([this.tempRecordPath], false, true /* Remove created entries */);
			}
		}
	});

	QUnit.test("ignoreInsertRestrictions=true", function (assert) {
		// Arrange
		var fnDone = assert.async();

		// Arrange: Modify the ConfigData
		this.oConfigData.ignoreInsertRestrictions = true;

		this.createSmartField().then(function (oSF) {
			// Assert
			oSF.attachInnerControlsCreated(function () {
				assert.strictEqual(oSF.getEditable(), true, "Control should be editable");
				fnDone();
			});

			// Act
			oSF._forceInitialise();
		});
	});

	QUnit.test("No ignoreInsertRestrictions", function (assert) {
		// Arrange
		var fnDone = assert.async();

		this.createSmartField().then(function (oSF) {
			// Assert
			oSF.attachInnerControlsCreated(function () {
				assert.strictEqual(oSF.getEditable(), false, "Control should not be editable");
				fnDone();
			});

			// Act
			oSF._forceInitialise();
		});
	});

	QUnit.module("CustomData", oQUnitModuleDefaultSettings);

	QUnit.test("preserveDecimals", function (assert) {
		// Arrange
		var fnDone = assert.async(),
			oSF = new SmartField({value: "{Price}"});

		assert.expect(1);

		oSF.data("preserveDecimals", "false");

		oSF.attachInnerControlsCreated(function () {
			// Assert
			assert.strictEqual(
				oSF.getFirstInnerControl().getBinding("value").getType().getFormatOptions().preserveDecimals,
				false,
				"preserveDecimals configuration is propagated to the created OData type"
			);

			fnDone();
		});

		// Act
		this.oVBox.addItem(oSF);
	});

	QUnit.module("Numbers keyboard on mobile device",oQUnitModuleDefaultSettings);

	QUnit.test("added attributes on mobile device when type Byte", async function(assert) {
		var done = assert.async(),
			oSmartField;

		assert.expect(2);

		oSmartField = new SmartField({
			value: "{ path: 'Name_sr' }",
			editable: true
		});

		sinon.stub(oSmartField, "_isPhone").returns(true);
		sinon.stub(oSmartField, "_isTablet").returns(false);

		oSmartField.attachEventOnce("innerControlsCreated", function() {

			var oInnerControl = oSmartField.getFirstInnerControl(),
				oDelegate = {
					onAfterRendering: function () {
						// We execute the delegate only once
						oInnerControl.removeDelegate(oDelegate);

						setTimeout(function () {
							// Assert
							var oHtmlInput = oInnerControl.getDomRef('inner');
							assert.strictEqual(
								oHtmlInput.getAttribute('inputmode'),
								'decimal',
								"Html input has correct attribute 'inputmode'"
							);

							assert.strictEqual(
								oHtmlInput.getAttribute('pattern'),
								'[0-9]+([\.,][0-9]+)?',
								"Html input has correct attribute 'pattern'"
							);
							done();
						}, 100 /* We let enough time for the control to update */);
					}
				};

			oInnerControl.addDelegate(oDelegate);
		});

		// Act
		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		await nextUIUpdate();
	});

	QUnit.test("added attributes on tablet when type Byte", async function(assert) {
		var done = assert.async(),
			oSmartField;

		assert.expect(2);

		oSmartField = new SmartField({
			value: "{ path: 'Name_sr' }",
			editable: true
		});

		sinon.stub(oSmartField, "_isPhone").returns(false);
		sinon.stub(oSmartField, "_isTablet").returns(true);

		oSmartField.attachEventOnce("innerControlsCreated", function() {

			var oInnerControl = oSmartField.getFirstInnerControl(),
				oDelegate = {
					onAfterRendering: function () {
						// We execute the delegate only once
						oInnerControl.removeDelegate(oDelegate);

						setTimeout(function () {
							// Assert
							var oHtmlInput = oInnerControl.getDomRef('inner');
							assert.strictEqual(
								oHtmlInput.getAttribute('inputmode'),
								'decimal',
								"Html input has correct attribute 'inputmode'"
							);

							assert.strictEqual(
								oHtmlInput.getAttribute('pattern'),
								'[0-9]+([\.,][0-9]+)?',
								"Html input has correct attribute 'pattern'"
							);
							done();
						}, 100 /* We let enough time for the control to update */);
					}
				};

			oInnerControl.addDelegate(oDelegate);
		});

		// Act
		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		await nextUIUpdate();
	});

	QUnit.test("not added attributes for numeric keyboard when is not on mobile device type Byte", async function(assert) {
		var done = assert.async(),
			oSmartField;

		assert.expect(2);

		oSmartField = new SmartField({
			value: "{ path: 'Name_sr' }",
			editable: true
		});

		sinon.stub(oSmartField, "_isPhone").returns(false);
		sinon.stub(oSmartField, "_isTablet").returns(false);

		oSmartField.attachEventOnce("innerControlsCreated", function() {

			var oInnerControl = oSmartField.getFirstInnerControl(),
				oDelegate = {
					onAfterRendering: function () {
						// We execute the delegate only once
						oInnerControl.removeDelegate(oDelegate);

						setTimeout(function () {
							// Assert
							var oHtmlInput = oInnerControl.getDomRef('inner');
							assert.strictEqual(
								oHtmlInput.getAttribute('inputmode'),
								null,
								"Html input hasn't attribute 'inputmode'"
							);

							assert.strictEqual(
								oHtmlInput.getAttribute('pattern'),
								null,
								"Html input hasn't attribute 'pattern'"
							);
							done();
						}, 100 /* We let enough time for the control to update */);
					}
				};

			//done();

			oInnerControl.addDelegate(oDelegate);
		});

		// Act
		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		await nextUIUpdate();
	});

	QUnit.test("added attributes on mobile device when type Int16", async function(assert) {
		var done = assert.async(),
			oSmartField;

		assert.expect(2);

		oSmartField = new SmartField({
			value: "{ path: 'Int16' }",
			editable: true
		});

		sinon.stub(oSmartField, "_isPhone").returns(true);
		sinon.stub(oSmartField, "_isTablet").returns(false);

		oSmartField.attachEventOnce("innerControlsCreated", function() {

			var oInnerControl = oSmartField.getFirstInnerControl(),
				oDelegate = {
					onAfterRendering: function () {
						// We execute the delegate only once
						oInnerControl.removeDelegate(oDelegate);

						setTimeout(function () {
							// Assert
							var oHtmlInput = oInnerControl.getDomRef('inner');
							assert.strictEqual(
								oHtmlInput.getAttribute('inputmode'),
								'decimal',
								"Html input has correct attribute 'inputmode'"
							);

							assert.strictEqual(
								oHtmlInput.getAttribute('pattern'),
								'[0-9]+([\.,][0-9]+)?',
								"Html input has correct attribute 'pattern'"
							);
							done();
						}, 100 /* We let enough time for the control to update */);
					}
				};

			oInnerControl.addDelegate(oDelegate);
		});

		// Act
		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		await nextUIUpdate();
	});

	QUnit.test("added attributes on tablet when type Int16", async function(assert) {
		var done = assert.async(),
			oSmartField;

		assert.expect(2);

		oSmartField = new SmartField({
			value: "{ path: 'Int16' }",
			editable: true
		});

		sinon.stub(oSmartField, "_isPhone").returns(false);
		sinon.stub(oSmartField, "_isTablet").returns(true);

		oSmartField.attachEventOnce("innerControlsCreated", function() {

			var oInnerControl = oSmartField.getFirstInnerControl(),
				oDelegate = {
					onAfterRendering: function () {
						// We execute the delegate only once
						oInnerControl.removeDelegate(oDelegate);

						setTimeout(function () {
							// Assert
							var oHtmlInput = oInnerControl.getDomRef('inner');
							assert.strictEqual(
								oHtmlInput.getAttribute('inputmode'),
								'decimal',
								"Html input has correct attribute 'inputmode'"
							);

							assert.strictEqual(
								oHtmlInput.getAttribute('pattern'),
								'[0-9]+([\.,][0-9]+)?',
								"Html input has correct attribute 'pattern'"
							);
							done();
						}, 100 /* We let enough time for the control to update */);
					}
				};

			oInnerControl.addDelegate(oDelegate);
		});

		// Act
		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		await nextUIUpdate();
	});

	QUnit.test("not added attributes for numeric keyboard when is not on mobile device type Int16", async function(assert) {
		var done = assert.async(),
			oSmartField;

		assert.expect(2);

		oSmartField = new SmartField({
			value: "{ path: 'Int16' }",
			editable: true
		});

		sinon.stub(oSmartField, "_isPhone").returns(false);
		sinon.stub(oSmartField, "_isTablet").returns(false);

		oSmartField.attachEventOnce("innerControlsCreated", function() {

			var oInnerControl = oSmartField.getFirstInnerControl(),
				oDelegate = {
					onAfterRendering: function () {
						// We execute the delegate only once
						oInnerControl.removeDelegate(oDelegate);

						setTimeout(function () {
							// Assert
							var oHtmlInput = oInnerControl.getDomRef('inner');
							assert.strictEqual(
								oHtmlInput.getAttribute('inputmode'),
								null,
								"Html input hasn't attribute 'inputmode'"
							);

							assert.strictEqual(
								oHtmlInput.getAttribute('pattern'),
								null,
								"Html input hasn't attribute 'pattern'"
							);
							done();
						}, 100 /* We let enough time for the control to update */);
					}
				};

			oInnerControl.addDelegate(oDelegate);
		});

		// Act
		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		await nextUIUpdate();
	});

	QUnit.test("added attributes on tablet when type Int32", async function(assert) {
		var done = assert.async(),
			oSmartField;

		assert.expect(2);

		oSmartField = new SmartField({
			value: "{ path: 'Int32' }",
			editable: true
		});

		sinon.stub(oSmartField, "_isPhone").returns(false);
		sinon.stub(oSmartField, "_isTablet").returns(true);

		oSmartField.attachEventOnce("innerControlsCreated", function() {

			var oInnerControl = oSmartField.getFirstInnerControl(),
				oDelegate = {
					onAfterRendering: function () {
						// We execute the delegate only once
						oInnerControl.removeDelegate(oDelegate);

						setTimeout(function () {
							// Assert
							var oHtmlInput = oInnerControl.getDomRef('inner');
							assert.strictEqual(
								oHtmlInput.getAttribute('inputmode'),
								'decimal',
								"Html input has correct attribute 'inputmode'"
							);

							assert.strictEqual(
								oHtmlInput.getAttribute('pattern'),
								'[0-9]+([\.,][0-9]+)?',
								"Html input has correct attribute 'pattern'"
							);
							done();
						}, 100 /* We let enough time for the control to update */);
					}
				};

			oInnerControl.addDelegate(oDelegate);
		});

		// Act
		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		await nextUIUpdate();
	});

	QUnit.test("not added attributes for numeric keyboard when is not on mobile device type Int32", async function(assert) {
		var done = assert.async(),
			oSmartField;

		assert.expect(2);

		oSmartField = new SmartField({
			value: "{ path: 'Int32' }",
			editable: true
		});

		sinon.stub(oSmartField, "_isPhone").returns(false);
		sinon.stub(oSmartField, "_isTablet").returns(false);

		oSmartField.attachEventOnce("innerControlsCreated", function() {

			var oInnerControl = oSmartField.getFirstInnerControl(),
				oDelegate = {
					onAfterRendering: function () {
						// We execute the delegate only once
						oInnerControl.removeDelegate(oDelegate);

						setTimeout(function () {
							// Assert
							var oHtmlInput = oInnerControl.getDomRef('inner');
							assert.strictEqual(
								oHtmlInput.getAttribute('inputmode'),
								null,
								"Html input hasn't attribute 'inputmode'"
							);

							assert.strictEqual(
								oHtmlInput.getAttribute('pattern'),
								null,
								"Html input hasn't attribute 'pattern'"
							);
							done();
						}, 100 /* We let enough time for the control to update */);
					}
				};

			oInnerControl.addDelegate(oDelegate);
		});

		// Act
		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		await nextUIUpdate();
	});

	QUnit.test("added attributes on mobile device when type Int64", async function(assert) {
		var done = assert.async(),
			oSmartField;

		assert.expect(2);

		oSmartField = new SmartField({
			value: "{ path: 'Int64' }",
			editable: true
		});

		sinon.stub(oSmartField, "_isPhone").returns(true);
		sinon.stub(oSmartField, "_isTablet").returns(false);

		oSmartField.attachEventOnce("innerControlsCreated", function() {

			var oInnerControl = oSmartField.getFirstInnerControl(),
				oDelegate = {
					onAfterRendering: function () {
						// We execute the delegate only once
						oInnerControl.removeDelegate(oDelegate);

						setTimeout(function () {
							// Assert
							var oHtmlInput = oInnerControl.getDomRef('inner');
							assert.strictEqual(
								oHtmlInput.getAttribute('inputmode'),
								'decimal',
								"Html input has correct attribute 'inputmode'"
							);

							assert.strictEqual(
								oHtmlInput.getAttribute('pattern'),
								'[0-9]+([\.,][0-9]+)?',
								"Html input has correct attribute 'pattern'"
							);
							done();
						}, 100 /* We let enough time for the control to update */);
					}
				};

			oInnerControl.addDelegate(oDelegate);
		});

		// Act
		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		await nextUIUpdate();
	});

	QUnit.test("added attributes on tablet when type Int64", async function(assert) {
		var done = assert.async(),
			oSmartField;

		assert.expect(2);

		oSmartField = new SmartField({
			value: "{ path: 'Int64' }",
			editable: true
		});

		sinon.stub(oSmartField, "_isPhone").returns(false);
		sinon.stub(oSmartField, "_isTablet").returns(true);

		oSmartField.attachEventOnce("innerControlsCreated", function() {

			var oInnerControl = oSmartField.getFirstInnerControl(),
				oDelegate = {
					onAfterRendering: function () {
						// We execute the delegate only once
						oInnerControl.removeDelegate(oDelegate);

						setTimeout(function () {
							// Assert
							var oHtmlInput = oInnerControl.getDomRef('inner');
							assert.strictEqual(
								oHtmlInput.getAttribute('inputmode'),
								'decimal',
								"Html input has correct attribute 'inputmode'"
							);

							assert.strictEqual(
								oHtmlInput.getAttribute('pattern'),
								'[0-9]+([\.,][0-9]+)?',
								"Html input has correct attribute 'pattern'"
							);
							done();
						}, 100 /* We let enough time for the control to update */);
					}
				};

			oInnerControl.addDelegate(oDelegate);
		});

		// Act
		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		await nextUIUpdate();
	});

	QUnit.test("not added attributes for numeric keyboard when is not on mobile device type Int64", async function(assert) {
		var done = assert.async(),
			oSmartField;

		assert.expect(2);

		oSmartField = new SmartField({
			value: "{ path: 'Int64' }",
			editable: true
		});

		sinon.stub(oSmartField, "_isPhone").returns(false);
		sinon.stub(oSmartField, "_isTablet").returns(false);

		oSmartField.attachEventOnce("innerControlsCreated", function() {

			var oInnerControl = oSmartField.getFirstInnerControl(),
				oDelegate = {
					onAfterRendering: function () {
						// We execute the delegate only once
						oInnerControl.removeDelegate(oDelegate);

						setTimeout(function () {
							// Assert
							var oHtmlInput = oInnerControl.getDomRef('inner');
							assert.strictEqual(
								oHtmlInput.getAttribute('inputmode'),
								null,
								"Html input hasn't attribute 'inputmode'"
							);

							assert.strictEqual(
								oHtmlInput.getAttribute('pattern'),
								null,
								"Html input hasn't attribute 'pattern'"
							);
							done();
						}, 100 /* We let enough time for the control to update */);
					}
				};

			oInnerControl.addDelegate(oDelegate);
		});

		// Act
		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		await nextUIUpdate();
	});

	QUnit.test("added attributes on mobile device when type Single", async function(assert) {
		var done = assert.async(),
			oSmartField;

		assert.expect(2);

		oSmartField = new SmartField({
			value: "{ path: 'Single' }",
			editable: true
		});

		sinon.stub(oSmartField, "_isPhone").returns(true);
		sinon.stub(oSmartField, "_isTablet").returns(false);

		oSmartField.attachEventOnce("innerControlsCreated", function() {

			var oInnerControl = oSmartField.getFirstInnerControl(),
				oDelegate = {
					onAfterRendering: function () {
						// We execute the delegate only once
						oInnerControl.removeDelegate(oDelegate);

						setTimeout(function () {
							// Assert
							var oHtmlInput = oInnerControl.getDomRef('inner');
							assert.strictEqual(
								oHtmlInput.getAttribute('inputmode'),
								'decimal',
								"Html input has correct attribute 'inputmode'"
							);

							assert.strictEqual(
								oHtmlInput.getAttribute('pattern'),
								'[0-9]+([\.,][0-9]+)?',
								"Html input has correct attribute 'pattern'"
							);
							done();
						}, 100 /* We let enough time for the control to update */);
					}
				};

			oInnerControl.addDelegate(oDelegate);
		});

		// Act
		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		await nextUIUpdate();
	});

	QUnit.test("added attributes on tablet device when type Single", async function(assert) {
		var done = assert.async(),
			oSmartField;

		assert.expect(2);

		oSmartField = new SmartField({
			value: "{ path: 'Single' }",
			editable: true
		});

		sinon.stub(oSmartField, "_isPhone").returns(false);
		sinon.stub(oSmartField, "_isTablet").returns(true);

		oSmartField.attachEventOnce("innerControlsCreated", function() {

			var oInnerControl = oSmartField.getFirstInnerControl(),
				oDelegate = {
					onAfterRendering: function () {
						// We execute the delegate only once
						oInnerControl.removeDelegate(oDelegate);

						setTimeout(function () {
							// Assert
							var oHtmlInput = oInnerControl.getDomRef('inner');
							assert.strictEqual(
								oHtmlInput.getAttribute('inputmode'),
								'decimal',
								"Html input has correct attribute 'inputmode'"
							);

							assert.strictEqual(
								oHtmlInput.getAttribute('pattern'),
								'[0-9]+([\.,][0-9]+)?',
								"Html input has correct attribute 'pattern'"
							);
							done();
						}, 100 /* We let enough time for the control to update */);
					}
				};

			oInnerControl.addDelegate(oDelegate);
		});

		// Act
		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		await nextUIUpdate();
	});

	QUnit.test("not added attributes for numeric keyboard when is not on mobile device type Single", async function(assert) {
		var done = assert.async(),
			oSmartField;

		assert.expect(2);

		oSmartField = new SmartField({
			value: "{ path: 'Single' }",
			editable: true
		});

		sinon.stub(oSmartField, "_isPhone").returns(false);
		sinon.stub(oSmartField, "_isTablet").returns(false);

		oSmartField.attachEventOnce("innerControlsCreated", function() {

			var oInnerControl = oSmartField.getFirstInnerControl(),
				oDelegate = {
					onAfterRendering: function () {
						// We execute the delegate only once
						oInnerControl.removeDelegate(oDelegate);

						setTimeout(function () {
							// Assert
							var oHtmlInput = oInnerControl.getDomRef('inner');
							assert.strictEqual(
								oHtmlInput.getAttribute('inputmode'),
								null,
								"Html input hasn't attribute 'inputmode'"
							);

							assert.strictEqual(
								oHtmlInput.getAttribute('pattern'),
								null,
								"Html input hasn't attribute 'pattern'"
							);
							done();
						}, 100 /* We let enough time for the control to update */);
					}
				};

			oInnerControl.addDelegate(oDelegate);
		});

		// Act
		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		await nextUIUpdate();
	});

	QUnit.test("added attributes on mobile device when type StringNonNegative", async function(assert) {
		var done = assert.async(),
			oSmartField;

		assert.expect(2);

		oSmartField = new SmartField({
			value: "{ path: 'StringNonNegative' }",
			editable: true
		});

		sinon.stub(oSmartField, "_isPhone").returns(true);
		sinon.stub(oSmartField, "_isTablet").returns(false);

		oSmartField.attachEventOnce("innerControlsCreated", function() {

			var oInnerControl = oSmartField.getFirstInnerControl(),
				oDelegate = {
					onAfterRendering: function () {
						// We execute the delegate only once
						oInnerControl.removeDelegate(oDelegate);

						setTimeout(function () {
							// Assert
							var oHtmlInput = oInnerControl.getDomRef('inner');
							assert.strictEqual(
								oHtmlInput.getAttribute('inputmode'),
								'decimal',
								"Html input has correct attribute 'inputmode'"
							);

							assert.strictEqual(
								oHtmlInput.getAttribute('pattern'),
								'[0-9]+([\.,][0-9]+)?',
								"Html input has correct attribute 'pattern'"
							);
							done();
						}, 100 /* We let enough time for the control to update */);
					}
				};

			oInnerControl.addDelegate(oDelegate);
		});

		// Act
		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		await nextUIUpdate();
	});

	QUnit.test("added attributes on tablet when type StringNonNegative", async function(assert) {
		var done = assert.async(),
			oSmartField;

		assert.expect(2);

		oSmartField = new SmartField({
			value: "{ path: 'StringNonNegative' }",
			editable: true
		});

		sinon.stub(oSmartField, "_isPhone").returns(false);
		sinon.stub(oSmartField, "_isTablet").returns(true);

		oSmartField.attachEventOnce("innerControlsCreated", function() {

			var oInnerControl = oSmartField.getFirstInnerControl(),
				oDelegate = {
					onAfterRendering: function () {
						// We execute the delegate only once
						oInnerControl.removeDelegate(oDelegate);

						setTimeout(function () {
							// Assert
							var oHtmlInput = oInnerControl.getDomRef('inner');
							assert.strictEqual(
								oHtmlInput.getAttribute('inputmode'),
								'decimal',
								"Html input has correct attribute 'inputmode'"
							);

							assert.strictEqual(
								oHtmlInput.getAttribute('pattern'),
								'[0-9]+([\.,][0-9]+)?',
								"Html input has correct attribute 'pattern'"
							);
							done();
						}, 100 /* We let enough time for the control to update */);
					}
				};

			oInnerControl.addDelegate(oDelegate);
		});

		// Act
		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		await nextUIUpdate();
	});

	QUnit.test("not added attributes for numeric keyboard when is not on mobile device type StringNonNegative", async function(assert) {
		var done = assert.async(),
			oSmartField;

		assert.expect(2);

		oSmartField = new SmartField({
			value: "{ path: 'StringNonNegative' }",
			editable: true
		});

		sinon.stub(oSmartField, "_isPhone").returns(false);
		sinon.stub(oSmartField, "_isTablet").returns(false);

		oSmartField.attachEventOnce("innerControlsCreated", function() {

			var oInnerControl = oSmartField.getFirstInnerControl(),
				oDelegate = {
					onAfterRendering: function () {
						// We execute the delegate only once
						oInnerControl.removeDelegate(oDelegate);

						setTimeout(function () {
							// Assert
							var oHtmlInput = oInnerControl.getDomRef('inner');
							assert.strictEqual(
								oHtmlInput.getAttribute('inputmode'),
								null,
								"Html input hasn't attribute 'inputmode'"
							);

							assert.strictEqual(
								oHtmlInput.getAttribute('pattern'),
								null,
								"Html input hasn't attribute 'pattern'"
							);
							done();
						}, 100 /* We let enough time for the control to update */);
					}
				};

			oInnerControl.addDelegate(oDelegate);
		});

		// Act
		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		await nextUIUpdate();
	});

	QUnit.test("added attributes on mobile device when type Decimal", async function(assert) {
		var done = assert.async(),
			oSmartField;

		assert.expect(2);

		oSmartField = new SmartField({
			value: "{ path: 'Decimal' }",
			editable: true
		});

		sinon.stub(oSmartField, "_isPhone").returns(true);
		sinon.stub(oSmartField, "_isTablet").returns(false);

		oSmartField.attachEventOnce("innerControlsCreated", function() {

			var oInnerControl = oSmartField.getFirstInnerControl(),
				oDelegate = {
					onAfterRendering: function () {
						// We execute the delegate only once
						oInnerControl.removeDelegate(oDelegate);

						setTimeout(function () {
							// Assert
							var oHtmlInput = oInnerControl.getDomRef('inner');
							assert.strictEqual(
								oHtmlInput.getAttribute('inputmode'),
								'decimal',
								"Html input has correct attribute 'inputmode'"
							);

							assert.strictEqual(
								oHtmlInput.getAttribute('pattern'),
								'[0-9]+([.,][0-9]+)?',
								"Html input has correct attribute 'pattern'"
							);
							done();
						}, 100 /* We let enough time for the control to update */);
					}
				};

			oInnerControl.addDelegate(oDelegate);
		});

		// Act
		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		await nextUIUpdate();
	});

	QUnit.test("added attributes on tablet when type Decimal", async function(assert) {
		var done = assert.async(),
			oSmartField;

		assert.expect(2);

		oSmartField = new SmartField({
			value: "{ path: 'Decimal' }",
			editable: true
		});

		sinon.stub(oSmartField, "_isPhone").returns(false);
		sinon.stub(oSmartField, "_isTablet").returns(true);

		oSmartField.attachEventOnce("innerControlsCreated", function() {

			var oInnerControl = oSmartField.getFirstInnerControl(),
				oDelegate = {
					onAfterRendering: function () {
						// We execute the delegate only once
						oInnerControl.removeDelegate(oDelegate);

						setTimeout(function () {
							// Assert
							var oHtmlInput = oInnerControl.getDomRef('inner');
							assert.strictEqual(
								oHtmlInput.getAttribute('inputmode'),
								'decimal',
								"Html input has correct attribute 'inputmode'"
							);

							assert.strictEqual(
								oHtmlInput.getAttribute('pattern'),
								'[0-9]+([.,][0-9]+)?',
								"Html input has correct attribute 'pattern'"
							);
							done();
						}, 100 /* We let enough time for the control to update */);
					}
				};

			oInnerControl.addDelegate(oDelegate);
		});

		// Act
		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		await nextUIUpdate();
	});

	QUnit.test("not added attributes for numeric keyboard when is not on mobile device type Decimal", async function(assert) {
		var done = assert.async(),
			oSmartField;

		assert.expect(2);

		oSmartField = new SmartField({
			value: "{ path: 'Decimal' }",
			editable: true
		});

		sinon.stub(oSmartField, "_isPhone").returns(false);
		sinon.stub(oSmartField, "_isTablet").returns(false);

		oSmartField.attachEventOnce("innerControlsCreated", function() {

			var oInnerControl = oSmartField.getFirstInnerControl(),
				oDelegate = {
					onAfterRendering: function () {
						// We execute the delegate only once
						oInnerControl.removeDelegate(oDelegate);

						setTimeout(function () {
							// Assert
							var oHtmlInput = oInnerControl.getDomRef('inner');
							assert.strictEqual(
								oHtmlInput.getAttribute('inputmode'),
								null,
								"Html input hasn't attribute 'inputmode'"
							);

							assert.strictEqual(
								oHtmlInput.getAttribute('pattern'),
								null,
								"Html input hasn't attribute 'pattern'"
							);
							done();
						}, 100 /* We let enough time for the control to update */);
					}
				};

			oInnerControl.addDelegate(oDelegate);
		});

		// Act
		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		await nextUIUpdate();
	});

	QUnit.test("added attributes on mobile device when type Double", async function(assert) {
		var done = assert.async(),
			oSmartField;

		assert.expect(2);

		oSmartField = new SmartField({
			value: "{ path: 'Double' }",
			editable: true
		});

		sinon.stub(oSmartField, "_isPhone").returns(true);
		sinon.stub(oSmartField, "_isTablet").returns(false);

		oSmartField.attachEventOnce("innerControlsCreated", function() {

			var oInnerControl = oSmartField.getFirstInnerControl(),
				oDelegate = {
					onAfterRendering: function () {
						// We execute the delegate only once
						oInnerControl.removeDelegate(oDelegate);

						setTimeout(function () {
							// Assert
							var oHtmlInput = oInnerControl.getDomRef('inner');
							assert.strictEqual(
								oHtmlInput.getAttribute('inputmode'),
								'decimal',
								"Html input has correct attribute 'inputmode'"
							);

							assert.strictEqual(
								oHtmlInput.getAttribute('pattern'),
								'[0-9]+([.,][0-9]+)?',
								"Html input has correct attribute 'pattern'"
							);
							done();
						}, 100 /* We let enough time for the control to update */);
					}
				};

			oInnerControl.addDelegate(oDelegate);
		});

		// Act
		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		await nextUIUpdate();
	});

	QUnit.test("added attributes on tablet when type Double ", async function(assert) {
		var done = assert.async(),
			oSmartField;

		assert.expect(2);

		oSmartField = new SmartField({
			value: "{ path: 'Double' }",
			editable: true
		});

		sinon.stub(oSmartField, "_isPhone").returns(false);
		sinon.stub(oSmartField, "_isTablet").returns(true);

		oSmartField.attachEventOnce("innerControlsCreated", function() {

			var oInnerControl = oSmartField.getFirstInnerControl(),
				oDelegate = {
					onAfterRendering: function () {
						// We execute the delegate only once
						oInnerControl.removeDelegate(oDelegate);

						setTimeout(function () {
							// Assert
							var oHtmlInput = oInnerControl.getDomRef('inner');
							assert.strictEqual(
								oHtmlInput.getAttribute('inputmode'),
								'decimal',
								"Html input has correct attribute 'inputmode'"
							);

							assert.strictEqual(
								oHtmlInput.getAttribute('pattern'),
								'[0-9]+([.,][0-9]+)?',
								"Html input has correct attribute 'pattern'"
							);
							done();
						}, 100 /* We let enough time for the control to update */);
					}
				};

			oInnerControl.addDelegate(oDelegate);
		});

		// Act
		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		await nextUIUpdate();
	});

	QUnit.test("not added attributes for numeric keyboard when is not on mobile device type Double", async function(assert) {
		var done = assert.async(),
			oSmartField;

		assert.expect(2);

		oSmartField = new SmartField({
			value: "{ path: 'Double' }",
			editable: true
		});

		sinon.stub(oSmartField, "_isPhone").returns(false);
		sinon.stub(oSmartField, "_isTablet").returns(false);

		oSmartField.attachEventOnce("innerControlsCreated", function() {

			var oInnerControl = oSmartField.getFirstInnerControl(),
				oDelegate = {
					onAfterRendering: function () {
						// We execute the delegate only once
						oInnerControl.removeDelegate(oDelegate);

						setTimeout(function () {
							// Assert
							var oHtmlInput = oInnerControl.getDomRef('inner');
							assert.strictEqual(
								oHtmlInput.getAttribute('inputmode'),
								null,
								"Html input hasn't attribute 'inputmode'"
							);

							assert.strictEqual(
								oHtmlInput.getAttribute('pattern'),
								null,
								"Html input hasn't attribute 'pattern'"
							);
							done();
						}, 100 /* We let enough time for the control to update */);
					}
				};

			oInnerControl.addDelegate(oDelegate);
		});

		// Act
		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		await nextUIUpdate();
	});

	QUnit.test("not added attributes on mobile device when type String", async function(assert) {
		var done = assert.async(),
			oSmartField;

		assert.expect(2);

		oSmartField = new SmartField({
			value: "{ path: 'AmountCode3' }",
			editable: true
		});

		sinon.stub(oSmartField, "_isPhone").returns(true);
		sinon.stub(oSmartField, "_isTablet").returns(false);

		oSmartField.attachEventOnce("innerControlsCreated", function() {

			var oInnerControl = oSmartField.getFirstInnerControl(),
				oDelegate = {
					onAfterRendering: function () {
						// We execute the delegate only once
						oInnerControl.removeDelegate(oDelegate);

						setTimeout(function () {
							// Assert
							var oHtmlInput = oInnerControl.getDomRef('inner');
							assert.strictEqual(
								oHtmlInput.getAttribute('inputmode'),
								null,
								"Html input has correct attribute 'inputmode'"
							);

							assert.strictEqual(
								oHtmlInput.getAttribute('pattern'),
								null,
								"Html input has correct attribute 'pattern'"
							);
							done();
						}, 100 /* We let enough time for the control to update */);
					}
				};

			oInnerControl.addDelegate(oDelegate);
		});

		// Act
		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		await nextUIUpdate();
	});

	QUnit.test("not added attributes on mobile device when type String on tablet", async function(assert) {
		var done = assert.async(),
			oSmartField;

		assert.expect(2);

		oSmartField = new SmartField({
			value: "{ path: 'AmountCode3' }",
			editable: true
		});

		sinon.stub(oSmartField, "_isPhone").returns(false);
		sinon.stub(oSmartField, "_isTablet").returns(true);

		oSmartField.attachEventOnce("innerControlsCreated", function() {

			var oInnerControl = oSmartField.getFirstInnerControl(),
				oDelegate = {
					onAfterRendering: function () {
						// We execute the delegate only once
						oInnerControl.removeDelegate(oDelegate);

						setTimeout(function () {
							// Assert
							var oHtmlInput = oInnerControl.getDomRef('inner');
							assert.strictEqual(
								oHtmlInput.getAttribute('inputmode'),
								null,
								"Html input has correct attribute 'inputmode'"
							);

							assert.strictEqual(
								oHtmlInput.getAttribute('pattern'),
								null,
								"Html input has correct attribute 'pattern'"
							);
							done();
						}, 100 /* We let enough time for the control to update */);
					}
				};

			oInnerControl.addDelegate(oDelegate);
		});

		// Act
		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		await nextUIUpdate();
	});

	QUnit.module("SmartLink connection");

	QUnit.test("SNOW: CS20240007695146 Connection is restored when field is created at a later point in time and set visible", function(assert) {
		// Arrange
		var fnDone = assert.async(),
			oSmartLabel = new SmartLabel({visible: false}),
			oSmartField,
			oVBoxLabel = new VBox({items: oSmartLabel}),
			oVBoxField = new VBox();

		oVBoxLabel.setModel(oDataModel);
		oVBoxLabel.bindObject({
			path: "/Products('1239102')"
		});
		oVBoxLabel.placeAt("qunit-fixture");

		oVBoxField.setModel(oDataModel);
		oVBoxField.bindObject({
			path: "/Products('1239102')"
		});
		oVBoxField.placeAt("qunit-fixture");

		oSmartLabel.setLabelFor("myField");

		// Act
		setTimeout(function () {
			oSmartField = new SmartField("myField", {visible: false, value: "{Name}"});
			oVBoxField.addItem(oSmartField);
			oSmartField.setVisible(true);

			// Assert
			setTimeout(function () {
				assert.ok(oSmartLabel.getDomRef(), "SmartLabel is rendered!");
				fnDone();

				// Cleanup
				oVBoxField.destroy();
				oVBoxLabel.destroy();
			}, 1000);

		}, 0);

	});
});
