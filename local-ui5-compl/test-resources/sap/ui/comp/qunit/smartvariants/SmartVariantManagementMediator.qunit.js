/* global QUnit, sinon */
sap.ui.define([
	"sap/ui/comp/smartvariants/SmartVariantManagementMediator",
	"sap/ui/comp/smartvariants/SmartVariantManagementModel",
	"sap/ui/model/BindingMode",
	"test-resources/sap/ui/comp/testutils/opa/TestUtils",
	"sap/base/Log",
	"./Util"
], function(
	SmartVariantManagementMediator,
	SmartVariantManagementModel,
	BindingMode,
	TestUtils,
	Log,
	Util
) {
	"use strict";

	const mPropertyValues = {
		"defaultVariantKey": "DEFAULT",
		"editable": false,
		"headerLevel": "H1",
		"selectionKey": "OTHERVARIANT",
		"showExecuteOnSelection": true,
		"showSetAsDefault": false,
		"showShare": true,
		"standardItemText": "STANDARD",
		"titleStyle": "H2",
		"useFavorites": true,
		"variantCreationByUserAllowed": false
	};

	QUnit.module("init", {
		before: function () {
			this.fnGetDefaultModelNameSpy = sinon.spy(SmartVariantManagementModel, "getDefaultModelName");
			this.oSmartVariantManagementMediator = new SmartVariantManagementMediator();
		},
		after: function() {
			this.oSmartVariantManagementMediator.destroy();
			this.oSmartVariantManagementMediator = undefined;

			this.fnGetDefaultModelNameSpy.restore();
		}
	});

	QUnit.test("should set 'STANDARDVARIANTKEY'", function(assert) {
		assert.equal(this.oSmartVariantManagementMediator.STANDARDVARIANTKEY, "*standard*", "should set 'oResourceBundle'");
	});

	QUnit.test("should set 'oResourceBundle'", function(assert) {
		assert.ok(this.oSmartVariantManagementMediator.oResourceBundle, "should set 'oResourceBundle'");
	});

	QUnit.test("should create internal SmartVariantManagementModel", function (assert) {
		assert.ok(this.oSmartVariantManagementMediator.oModel, "should set internal model");
		assert.ok(this.oSmartVariantManagementMediator.oModel.isA("sap.ui.comp.smartvariants.SmartVariantManagementModel"), "should be a 'sap.ui.comp.smartvariants.SmartVariantManagementModel'");
		assert.ok(this.fnGetDefaultModelNameSpy.called, "should call 'getDefaultModelName' method of SmartVariantManagementModel");
		assert.equal(this.oSmartVariantManagementMediator.getModelName(), SmartVariantManagementModel.getDefaultModelName(), "should set correct 'modelName' property to default of SmartVariantManagementModel");
	});

	QUnit.test("should create an embedded VariantManagement", function (assert) {
		const oEmbeddedVM = this.oSmartVariantManagementMediator._oVM;

		assert.ok(oEmbeddedVM, "should set embedded VariantManagement");
		assert.ok(oEmbeddedVM.isA("sap.m.VariantManagement"), "should be a 'sap.m.VariantManagement'");
		assert.ok(this.oSmartVariantManagementMediator.getAggregation("_embeddedVM"), "should set private aggregation '_embeddedVM'");
		assert.equal(this.oSmartVariantManagementMediator.getAggregation("_embeddedVM"), oEmbeddedVM, "should be private aggregation '_embeddedVM'");
	});

	QUnit.test("should set event handlings correctly on embedded VariantManagement", function (assert) {
		const oEmbeddedVM = this.oSmartVariantManagementMediator._oVM;

		const aEvents = ["manage", "save", "select"];
		aEvents.forEach((sEventName) => {
			const sEventHandlerFunction = `_on${Util.fnCapitalizeFirstLetter(sEventName)}`;
			assert.equal(oEmbeddedVM.mEventRegistry[sEventName].length, 1, `should set 1 event handler function for event '${sEventName}'`);
			assert.equal(oEmbeddedVM.mEventRegistry[sEventName][0].fFunction, this.oSmartVariantManagementMediator[sEventHandlerFunction], `should set correct event handler function for event '${sEventName}'`);
		});
		assert.equal(Object.entries(oEmbeddedVM.mEventRegistry).length, aEvents.length, `should only provide event handler functions for given events '${aEvents.toString()}'`);
	});

	QUnit.test("should create binding context for the embedded VariantManagement", function (assert) {
		const sModelName = SmartVariantManagementModel.getDefaultModelName();
		const oBindingContext = this.oSmartVariantManagementMediator.getBindingContext(sModelName);

		assert.ok(oBindingContext, `should have a BindingContext for model ${sModelName}`);
		assert.equal(oBindingContext.getPath(), SmartVariantManagementModel.getDefaultContextPath(), "should set binding context path to default of SmartVariantManagementModel");

		const oEmbeddedVM = this.oSmartVariantManagementMediator._oVM;
		const oEmbeddedVMModel = oEmbeddedVM.getModel(sModelName);

		assert.ok(oEmbeddedVMModel, "should add internal SmartVariantManagementModel to embedded VariantManagement");
		assert.ok(oEmbeddedVMModel.isA("sap.ui.comp.smartvariants.SmartVariantManagementModel"), "should be a 'sap.ui.comp.smartvariants.SmartVariantManagementModel'");
		assert.equal(oEmbeddedVMModel, this.oSmartVariantManagementMediator.oModel, "should be the same Model");

		assert.ok(this.oSmartVariantManagementMediator._oItemsTemplate, "should provide a template for 'items' aggregation binding");
		assert.ok(oEmbeddedVM.getBindingInfo("items"), "should have a BindingInfo for 'items' binding");
		assert.equal(oEmbeddedVM.getBindingInfo("items").path, "/data/variants", "should set correct path for 'items' binding");
		assert.equal(oEmbeddedVM.getBindingInfo("items").template, this.oSmartVariantManagementMediator._oItemsTemplate, "should provide correct template for 'items' aggregation binding");

		Object.entries(Util.mModelToVariantManagementMapping).forEach(([sNameInModel, sNameInVariantMangement]) => {
			const sBindingMode = sNameInVariantMangement === "selectedKey" ?  BindingMode.TwoWay : BindingMode.OneWay;

			assert.ok(oEmbeddedVM.getBindingInfo(sNameInVariantMangement), `should have a BindingInfo for property '${sNameInVariantMangement}'`);
			assert.equal(oEmbeddedVM.getBindingInfo(sNameInVariantMangement).binding.sPath, `${SmartVariantManagementModel.getDefaultContextPath()}/${sNameInModel}`, `should bind property '${sNameInVariantMangement}' to correct path`);
			assert.equal(oEmbeddedVM.getBindingInfo(sNameInVariantMangement).binding.sMode, sBindingMode, `should bind property with mode '${sBindingMode}'`);
		});

		assert.equal(oEmbeddedVM.getPopoverTitle(), TestUtils.getTextFromResourceBundle("sap.ui.comp", "VARIANT_MANAGEMENT_VARIANTS"), "should set 'popoverTitle'");
	});

	QUnit.module("_bindPropertiesToVM", {
		beforeEach: function () {
			this.oSmartVariantManagementMediator = new SmartVariantManagementMediator();
			this.oEmbeddedVM = this.oSmartVariantManagementMediator._oVM;

			this.fnBindPropertyStub = sinon.stub(this.oEmbeddedVM, "bindProperty");
		},
		afterEach: function() {
			this.oSmartVariantManagementMediator.destroy();
			this.oSmartVariantManagementMediator = undefined;
			this.oEmbeddedVM = undefined;

			this.fnBindPropertyStub.restore();
		}
	});

	QUnit.test("should do nothing when parameters are missing", function(assert) {
		assert.ok(this.fnBindPropertyStub.notCalled, "should not call 'bindProperty' on embedded VM initially");

		this.oSmartVariantManagementMediator._bindPropertiesToVM();
		assert.ok(this.fnBindPropertyStub.notCalled, "should not call 'bindProperty' on embedded VM when no model name or properties provided");

		this.oSmartVariantManagementMediator._bindPropertiesToVM("modelName");
		assert.ok(this.fnBindPropertyStub.notCalled, "should not call 'bindProperty' on embedded VM when only model name is provided");

		this.oSmartVariantManagementMediator._bindPropertiesToVM("modelName", []);
		assert.ok(this.fnBindPropertyStub.notCalled, "should not call 'bindProperty' on embedded VM when model name is provided but properties are empty");
	});

	QUnit.test("should use this._oVM if no oVM provided in parameters", function(assert) {
		assert.ok(this.fnBindPropertyStub.notCalled, "should not call 'bindProperty' on embedded VM initially");

		const mPropertiesToBind = Object.entries(Util.mModelToVariantManagementMapping).map(([sNameInModel, sNameInVariantMangement]) => {
			return {
				nameInModel: sNameInModel,
				nameInVariantMangement: sNameInVariantMangement
			};
		});
		const sModelName = "modelName";
		this.oSmartVariantManagementMediator._bindPropertiesToVM(sModelName, mPropertiesToBind);

		assert.equal(this.fnBindPropertyStub.callCount, mPropertiesToBind.length, "should call 'bindProperty' on embedded VM for each property");
		mPropertiesToBind.forEach((oVariantManagementPropertyMapping) => {
			const oBindingMode = {};
			if (oVariantManagementPropertyMapping.nameInVariantMangement === "selectedKey") {
				oBindingMode.mode = BindingMode.TwoWay;
			}
			assert.ok(this.fnBindPropertyStub.calledWith(oVariantManagementPropertyMapping.nameInVariantMangement, {
				path: `${this.oSmartVariantManagementMediator.oContext}/${oVariantManagementPropertyMapping.nameInModel}`,
				model: sModelName,
				...oBindingMode
			}), "should call 'bindProperty' on embedded VM with correct parameters");
		});
	});

	QUnit.module("exit / destroy");

	["exit", "destroy"].forEach((sMethodName) => {
		QUnit.test(`should clear internal variables on '${sMethodName}'`, (assert) => {
			const oSmartVariantManagementMediator = new SmartVariantManagementMediator();

			const fnDestroyEmbeddedVMSpy = sinon.spy(oSmartVariantManagementMediator, "_destroyEmbeddedVM");
			const fnItemsTemplateDestroySpy = sinon.spy(oSmartVariantManagementMediator._oItemsTemplate, "destroy");
			const fnModelDestorySpy = sinon.spy(oSmartVariantManagementMediator.oModel, "destroy");

			oSmartVariantManagementMediator[sMethodName](); // call exit / destroy

			assert.ok(fnDestroyEmbeddedVMSpy.calledOnce, "should call '_destroyEmbeddedVM'");

			assert.ok(fnItemsTemplateDestroySpy.calledOnce, "should call 'destroy' on '_oItemsTemplate'");
			assert.equal(oSmartVariantManagementMediator._oItemsTemplate, undefined, "should set '_oItemsTemplate' to undefined");

			assert.ok(fnModelDestorySpy.calledOnce, "should call 'destroy' on 'oModel'");
			assert.equal(oSmartVariantManagementMediator.oModel, undefined, "should set 'oModel' to undefined");

			assert.equal(oSmartVariantManagementMediator._fRegisteredApplyAutomaticallyOnStandardVariant, null, "should set '_fRegisteredApplyAutomaticallyOnStandardVariant' to null");
			assert.equal(oSmartVariantManagementMediator.oContext, undefined, "should set 'oContext' to undefined");
			assert.equal(oSmartVariantManagementMediator.oResourceBundle, undefined, "should set 'oResourceBundle' to undefined");
		});
	});

	QUnit.test("should clear embedded VariantManagement in '_destroyEmbeddedVM'", (assert) => {
		const oSmartVariantManagementMediator = new SmartVariantManagementMediator();

		const fnEmbeddedVMDestroySpy = sinon.spy(oSmartVariantManagementMediator._oVM, "destroy");
		const fnEmbeddedVMDetachManageSpy = sinon.spy(oSmartVariantManagementMediator._oVM, "detachManage");
		const fnEmbeddedVMDetachSaveSpy = sinon.spy(oSmartVariantManagementMediator._oVM, "detachSave");
		const fnEmbeddedVMDetachSelectSpy = sinon.spy(oSmartVariantManagementMediator._oVM, "detachSelect");

		oSmartVariantManagementMediator._destroyEmbeddedVM();

		assert.ok(fnEmbeddedVMDestroySpy.calledOnce, "should call 'destroy' on '_oVM'");
		assert.ok(fnEmbeddedVMDetachManageSpy.calledOnce, "should call 'detachManage' on '_oVM'");
		assert.ok(fnEmbeddedVMDetachSaveSpy.calledOnce, "should call 'detachSave' on '_oVM'");
		assert.ok(fnEmbeddedVMDetachSelectSpy.calledOnce, "should call 'detachSelect' on '_oVM'");
		assert.equal(oSmartVariantManagementMediator._oVM, undefined, "should set '_oVM' to undefined");
	});

	QUnit.module("Embedded VariantManagement event handlings", {
		before: function () {
			this.oSmartVariantManagementMediator = new SmartVariantManagementMediator();
		},
		after: function() {
			this.oSmartVariantManagementMediator.destroy();
			this.oSmartVariantManagementMediator = undefined;
		}
	});

	QUnit.test("_onManage", function(assert) {
		// const fnOnManageSpy = sinon.spy(this.oSmartVariantManagementMediator, "_onManage");
		const fnFireManageSpy = sinon.spy(this.oSmartVariantManagementMediator, "fireManage");

		// assert.ok(fnOnManageSpy.notCalled, "should not call event handling for 'manage' initially");
		assert.ok(fnFireManageSpy.notCalled, "should not fire 'manage' event initially");

		const oEvent = {
			parameter: "value"
		};
		this.oSmartVariantManagementMediator._oVM.fireManage(oEvent);

		// TODO: clarify why this returns false
		// assert.ok(fnOnManageSpy.calledOnce, "should call event handling for 'manage'");
		assert.ok(fnFireManageSpy.calledOnce, "should fire 'manage' event");
		assert.ok(fnFireManageSpy.calledWith({
			...oEvent,
			id: this.oSmartVariantManagementMediator._oVM.getId()
		}), "should fire 'manage' event with correct paramters");

		// fnOnManageSpy.restore();
		fnFireManageSpy.restore();
	});

	QUnit.test("_onSave", function(assert) {
		// const fnOnSaveSpy = sinon.spy(this.oSmartVariantManagementMediator, "_onSave");
		const fnFireSaveSpy = sinon.spy(this.oSmartVariantManagementMediator, "fireSave");

		// assert.ok(fnOnSaveSpy.notCalled, "should not call event handling for 'save' initially");
		assert.ok(fnFireSaveSpy.notCalled, "should not fire 'save' event initially");

		let oEvent = {
			parameter: "value"
		};
		this.oSmartVariantManagementMediator._oVM.fireSave(oEvent);

		// TODO: clarify why this returns false
		// assert.ok(fnOnSaveSpy.calledOnce, "should call event handling for 'save'");
		assert.ok(fnFireSaveSpy.calledOnce, "should fire 'save' event");
		assert.ok(fnFireSaveSpy.calledWith({
			...oEvent,
			id: this.oSmartVariantManagementMediator._oVM.getId()
		}), "should fire 'save' event with correct paramters");

		// fnOnSaveSpy.reset();
		fnFireSaveSpy.reset();

		oEvent = {
			execute: "executeValue",
			"public": "publicValue"
		};
		this.oSmartVariantManagementMediator._oVM.fireSave(oEvent);

		// TODO: clarify why this returns false
		// assert.ok(fnOnSaveSpy.calledOnce, "should call event handling for 'save'");
		assert.ok(fnFireSaveSpy.calledOnce, "should fire 'save' event");
		assert.ok(fnFireSaveSpy.calledWith({
			...oEvent,
			exe: oEvent.execute,
			/**
			* @deprecated As of version 1.120.0, the concept has been discarded.
			*/
			global: oEvent["public"],
			id: this.oSmartVariantManagementMediator._oVM.getId()
		}), "should fire 'save' event with correct paramters");

		// fnOnSaveSpy.restore();
		fnFireSaveSpy.restore();
	});

	QUnit.test("_onSelect", function(assert) {
		// const fnOnSelectSpy = sinon.spy(this.oSmartVariantManagementMediator, "_onSelect");
		const fnFireSelectSpy = sinon.spy(this.oSmartVariantManagementMediator, "fireSelect");

		// assert.ok(fnOnSelectSpy.notCalled, "should not call event handling for 'select' initially");
		assert.ok(fnFireSelectSpy.notCalled, "should not fire 'select' event initially");

		const oEvent = {
			parameter: "value"
		};
		this.oSmartVariantManagementMediator._oVM.fireSelect(oEvent);

		// TODO: clarify why this returns false
		// assert.ok(fnOnSelectSpy.calledOnce, "should call event handling for 'select'");
		assert.ok(fnFireSelectSpy.calledOnce, "should fire 'select' event");
		assert.ok(fnFireSelectSpy.calledWith({
			...oEvent,
			id: this.oSmartVariantManagementMediator._oVM.getId()
		}), "should fire 'select' event with correct paramters");

		// fnOnSelectSpy.restore();
		fnFireSelectSpy.restore();
	});

	QUnit.module("Events", {

	});

	QUnit.module("Properties", {
		beforeEach: function() {
			this.oSmartVariantManagementMediator = new SmartVariantManagementMediator();
			this.fnSetPropertyInModelSpy = sinon.spy(this.oSmartVariantManagementMediator, "_setPropertyInModel");
		},
		afterEach: function() {
			this.oSmartVariantManagementMediator.destroy();
			this.oSmartVariantManagementMediator = undefined;
			this.fnSetPropertyInModelSpy.restore();
		}
	});

	Object.entries(Util.mPropertiesToModelMapping).forEach(([sPropertyName, sNameInModel]) => {
		QUnit.test(`should set '${sNameInModel}' in model when setting '${sPropertyName}' in Mediator`, function (assert) {
			const vValue = mPropertyValues[sPropertyName];
			const sSetterName = `set${Util.fnCapitalizeFirstLetter(sPropertyName)}`;

			this.oSmartVariantManagementMediator[sSetterName](vValue);

			assert.ok(this.fnSetPropertyInModelSpy.calledWith(sNameInModel, vValue), `should call '_setPropertyInModel' with property name '${sNameInModel}'`);
			assert.equal(this.oSmartVariantManagementMediator.getProperty(sPropertyName), vValue, `should set mediator property '${sPropertyName}' to '${vValue}'`);
			assert.equal(this.oSmartVariantManagementMediator.oModel.getProperty(`${SmartVariantManagementModel.getDefaultContextPath()}/${sNameInModel}`), vValue, `should set model property '${sNameInModel}' to '${vValue}'`);
		});
	});

	Object.entries({
		"currentVariantKey": "selectionKey"
	}).forEach(([sPropertyName, sForwardedName]) => {
		QUnit.test(`should forward getter of '${sPropertyName}' to '${sForwardedName}'`, function (assert) {
			const fnForwardedGetterSpy = sinon.spy(this.oSmartVariantManagementMediator, `get${Util.fnCapitalizeFirstLetter(sForwardedName)}`);

			assert.ok(fnForwardedGetterSpy.notCalled, "should not have called forwarded getter");

			this.oSmartVariantManagementMediator[`get${Util.fnCapitalizeFirstLetter(sPropertyName)}`]();

			assert.ok(fnForwardedGetterSpy.calledOnce, "should have called forwarded getter");

			fnForwardedGetterSpy.restore();
		});
		QUnit.test(`should forward setter of '${sPropertyName}' to '${sForwardedName}'`, function (assert) {
			const fnForwardedSetterSpy = sinon.spy(this.oSmartVariantManagementMediator, `set${Util.fnCapitalizeFirstLetter(sForwardedName)}`);

			assert.ok(fnForwardedSetterSpy.notCalled, "should not have called forwarded setter");

			this.oSmartVariantManagementMediator[`set${Util.fnCapitalizeFirstLetter(sPropertyName)}`](undefined);

			assert.ok(fnForwardedSetterSpy.calledOnce, "should have called forwarded setter");

			fnForwardedSetterSpy.restore();
		});
	});

	QUnit.test("should forward 'currentVariantGetModified' to 'getModified'", function (assert) {
		const fnForwardedGetterSpy = sinon.spy(this.oSmartVariantManagementMediator, "getModified");

		assert.ok(fnForwardedGetterSpy.notCalled, "should not have called forwarded getter");

		this.oSmartVariantManagementMediator.currentVariantGetModified();

		assert.ok(fnForwardedGetterSpy.calledOnce, "should have called forwarded getter");

		fnForwardedGetterSpy.restore();
	});

	QUnit.test("should forward 'currentVariantSetModified' to 'setModified'", function (assert) {
		const fnForwardedGetterSpy = sinon.spy(this.oSmartVariantManagementMediator, "setModified");

		assert.ok(fnForwardedGetterSpy.notCalled, "should not have called forwarded setter");

		this.oSmartVariantManagementMediator.currentVariantSetModified(true);

		assert.ok(fnForwardedGetterSpy.calledOnce, "should have called forwarded setter");
		assert.ok(fnForwardedGetterSpy.calledWith(true), "should have called forwarded setter with correct parameter");

		fnForwardedGetterSpy.restore();
	});

	QUnit.test("should call 'getCurrentVariant' on model when calling 'getSelectionKey'", function(assert) {
		const fnGetCurrentVariantSpy = sinon.spy(this.oSmartVariantManagementMediator.oModel, "getCurrentVariant");

		assert.ok(fnGetCurrentVariantSpy.notCalled, "should not have called forwarded getter");

		this.oSmartVariantManagementMediator.getSelectionKey();

		assert.ok(fnGetCurrentVariantSpy.calledOnce, "should have called forwarded getter");
	});

	QUnit.test("should forward 'modified' getter and setter to model", function(assert) {
		const fnGetModifiedSpy = sinon.spy(this.oSmartVariantManagementMediator.oModel, "getModified");
		const fnSetModifiedSpy = sinon.spy(this.oSmartVariantManagementMediator.oModel, "setModified");

		assert.ok(fnGetModifiedSpy.notCalled, "should not have called forwarded getter");
		assert.ok(fnSetModifiedSpy.notCalled, "should not have called forwarded setter");

		this.oSmartVariantManagementMediator.getModified();

		assert.ok(fnGetModifiedSpy.calledOnce, "should have called forwarded getter");
		assert.ok(fnSetModifiedSpy.notCalled, "should not have called forwarded setter");

		this.oSmartVariantManagementMediator.setModified(true);

		assert.ok(fnGetModifiedSpy.calledOnce, "should have called forwarded getter");
		assert.ok(fnSetModifiedSpy.calledOnce, "should have called forwarded setter");
	});

	QUnit.test("should set style classes on 'setEnabled'", function(assert) {
		const aContent = this.oSmartVariantManagementMediator._oVM.oVariantLayout.getContent();

		assert.equal(this.oSmartVariantManagementMediator.getEnabled(), true, "should have 'true' as default value of 'enabled' property");
		assert.equal(aContent[0].aCustomStyleClasses.includes("sapMVarMngmtClickable"), true, "should have default style class 'sapMVarMngmtClickable' on first content");
		assert.equal(aContent[2].aCustomStyleClasses.includes("sapMVarMngmtClickable"), true, "should have default style class 'sapMVarMngmtClickable' on third content");

		assert.equal(aContent[0].aCustomStyleClasses.includes("sapMVarMngmtDisabled"), false, "should not have style class 'sapMVarMngmtDisabled' on first content");
		assert.equal(aContent[1].aCustomStyleClasses.includes("sapMVarMngmtDisabled"), false, "should not have style class 'sapMVarMngmtDisabled' on second content");
		assert.equal(aContent[2].aCustomStyleClasses.includes("sapMVarMngmtDisabled"), false, "should not have style class 'sapMVarMngmtDisabled' on third content");

		assert.equal(this.oSmartVariantManagementMediator._oVM.bPopoverOpen, undefined, "should have 'undefined' as embedded VariantManagements bPopoverOpen value");

		this.oSmartVariantManagementMediator.setEnabled(false);

		assert.equal(this.oSmartVariantManagementMediator.getEnabled(), false, "should set 'enabled' property to 'false'");
		assert.equal(aContent[0].aCustomStyleClasses.includes("sapMVarMngmtClickable"), false, "should remove style class 'sapMVarMngmtClickable' on first content");
		assert.equal(aContent[2].aCustomStyleClasses.includes("sapMVarMngmtClickable"), false, "should remove style class 'sapMVarMngmtClickable' on third content");

		assert.equal(aContent[0].aCustomStyleClasses.includes("sapMVarMngmtDisabled"), true, "should add style class 'sapMVarMngmtDisabled' on first content");
		assert.equal(aContent[1].aCustomStyleClasses.includes("sapMVarMngmtDisabled"), true, "should add style class 'sapMVarMngmtDisabled' on second content");
		assert.equal(aContent[2].aCustomStyleClasses.includes("sapMVarMngmtDisabled"), true, "should add style class 'sapMVarMngmtDisabled' on third content");

		assert.equal(this.oSmartVariantManagementMediator._oVM.bPopoverOpen, true, "should have 'true' as embedded VariantManagements bPopoverOpen value");


		this.oSmartVariantManagementMediator.setEnabled(true);

		assert.equal(this.oSmartVariantManagementMediator.getEnabled(), true, "should set 'enabled' property to 'true'");
		assert.equal(aContent[0].aCustomStyleClasses.includes("sapMVarMngmtClickable"), true, "should add style class 'sapMVarMngmtClickable' on first content");
		assert.equal(aContent[2].aCustomStyleClasses.includes("sapMVarMngmtClickable"), true, "should add style class 'sapMVarMngmtClickable' on third content");

		assert.equal(aContent[0].aCustomStyleClasses.includes("sapMVarMngmtDisabled"), false, "should remove style class 'sapMVarMngmtDisabled' on first content");
		assert.equal(aContent[1].aCustomStyleClasses.includes("sapMVarMngmtDisabled"), false, "should remove style class 'sapMVarMngmtDisabled' on second content");
		assert.equal(aContent[2].aCustomStyleClasses.includes("sapMVarMngmtDisabled"), false, "should remove style class 'sapMVarMngmtDisabled' on third content");

		assert.equal(this.oSmartVariantManagementMediator._oVM.bPopoverOpen, false, "should have 'true' as embedded VariantManagements bPopoverOpen value");
	});

	QUnit.module("Aggregations");

	QUnit.test("should call 'getVariants' when calling 'getVariantItems'", function (assert) {
		const oSmartVariantManagementMediator = new SmartVariantManagementMediator();
		const fnGetVariantsSpy = sinon.spy(oSmartVariantManagementMediator, "getVariants");

		assert.ok(fnGetVariantsSpy.notCalled, "should have not called 'getVariants'");

		oSmartVariantManagementMediator.getVariantItems();
		assert.ok(fnGetVariantsSpy.calledOnce, "should have called 'getVariants'");
	});

	QUnit.test("should call 'getItems' on embedded VariantManagement when calling 'getVariants'", function (assert) {
		const oSmartVariantManagementMediator = new SmartVariantManagementMediator();
		const fnGetItemsSpy = sinon.spy(oSmartVariantManagementMediator._oVM, "getItems");

		assert.ok(fnGetItemsSpy.notCalled, "should have not called 'getItems'");

		assert.deepEqual(oSmartVariantManagementMediator.getVariants(), [], "should return empty array");
		assert.ok(fnGetItemsSpy.calledOnce, "should have called 'getItems'");

		oSmartVariantManagementMediator._oVM.destroy();
		oSmartVariantManagementMediator._oVM = undefined;
		assert.deepEqual(oSmartVariantManagementMediator.getVariants(), [], "should return empty array when embedded VariantManagement is destroyed");
		assert.ok(fnGetItemsSpy.calledOnce, "should not call 'getItems'");
	});

	QUnit.module("SmartVariantManagementModel forwarding", {
		beforeEach: function () {
			this.oSmartVariantManagementMediator = new SmartVariantManagementMediator();
			this.oModel = this.oSmartVariantManagementMediator.oModel;
			this.oSettings = {
				sourceInstance: this.oSmartVariantManagementMediator,
				forwardedInstance: this.oModel,
				parameters: [],
				expectedParameters: undefined,
				preventExecution: false
			};
		},
		afterEach: function() {
			this.oSmartVariantManagementMediator.destroy();
			this.oSmartVariantManagementMediator = undefined;
			this.oModel = undefined;
		}
	});

	QUnit.test("should forward '_checkUpdate' call to SmartVariantManagementModel", function (assert) {
		Util.fnCheckIfMethodCallIsForwarded(assert, {
			...this.oSettings,
			methodName: "_checkUpdate",
			forwardedMethodName: "checkUpdate",
			expectedParameters: [true]
		});
	});

	QUnit.test("should forward '_getIdxSorted' call to SmartVariantManagementModel", function (assert) {
		Util.fnCheckIfMethodCallIsForwarded(assert, {
			...this.oSettings,
			methodName: "_getIdxSorted",
			forwardedMethodName: "getIdxSorted",
			parameters: ["KEY"]
		});
	});

	QUnit.test("should forward '_removeViewItem' call to SmartVariantManagementModel", function (assert) {
		Util.fnCheckIfMethodCallIsForwarded(assert, {
			...this.oSettings,
			methodName: "_removeViewItem",
			forwardedMethodName: "removeVariant",
			parameters: ["KEY"]
		});
	});

	QUnit.test("should forward '_reorderList' call to SmartVariantManagementModel", function (assert) {
		Util.fnCheckIfMethodCallIsForwarded(assert, {
			...this.oSettings,
			methodName: "_reorderList",
			forwardedMethodName: "reorderVariants",
			parameters: ["KEY", "NEW TITLE"]
		});
	});

	QUnit.test("should forward '_updateView' call to SmartVariantManagementModel", function (assert) {
		Util.fnCheckIfMethodCallIsForwarded(assert, {
			...this.oSettings,
			methodName: "_updateView",
			forwardedMethodName: "updateView",
			parameters: ["KEY", "PROPERTY NAME", false]
		});
	});

	QUnit.module("Embedded VariantManagement forwarding", {
		beforeEach: function () {
			this.oSmartVariantManagementMediator = new SmartVariantManagementMediator();
			this.oEmbeddedVM = this.oSmartVariantManagementMediator._oVM;
			this.oSettings = {
				sourceInstance: this.oSmartVariantManagementMediator,
				forwardedInstance: this.oEmbeddedVM,
				parameters: [],
				expectedParameters: undefined,
				preventExecution: false
			};
		},
		afterEach: function() {
			this.oSmartVariantManagementMediator.destroy();
			this.oSmartVariantManagementMediator = undefined;
			this.oEmbeddedVM = undefined;
		}
	});

	QUnit.test("should return embedded VariantManagement when calling '_getEmbeddedVM'", function(assert) {
		assert.deepEqual(this.oSmartVariantManagementMediator._getEmbeddedVM(), this.oEmbeddedVM, "should return embedded VariantManagement");
	});

	// 1 to 1 forwarding
	[
		"_createSaveAsDialog",
		"openManagementDialog",
		"getInErrorState",
		"getShowAsText",
		"getStandardVariantKey"
	].forEach((sMethodName) => {
		QUnit.test(`should forward '${sMethodName}' call to embedded VariantManagement`, function (assert) {
			Util.fnCheckIfMethodCallIsForwarded(assert, {
				...this.oSettings,
				methodName: sMethodName
			});
		});
	});

	QUnit.test("should forward 'setInErrorState' call to embedded VariantManagement", function(assert) {
		const oTitle = this.oEmbeddedVM.getTitle();
		const fnGetTitleSpy = sinon.spy(this.oEmbeddedVM, "getTitle"),
			fnDetermineStandardVariantNameStub = sinon.stub(this.oSmartVariantManagementMediator, "_determineStandardVariantName"),
			fnTitleSetTextSpy = sinon.spy(oTitle, "setText");

		assert.ok(fnGetTitleSpy.notCalled, "should not call 'getTitle' initially");
		assert.ok(fnDetermineStandardVariantNameStub.notCalled, "should not call '_determineStandardVariantName' initially");
		assert.ok(fnTitleSetTextSpy.notCalled, "should not call 'setText' on title initially");

		Util.fnCheckIfMethodCallIsForwarded(assert, {
			...this.oSettings,
			methodName: "setInErrorState",
			parameters: [false]
		});

		assert.ok(fnGetTitleSpy.calledOnce, "should call 'getTitle'");
		assert.ok(fnDetermineStandardVariantNameStub.notCalled, "should not call '_determineStandardVariantName'");
		assert.ok(fnTitleSetTextSpy.notCalled, "should not call 'setText' on title");
		assert.equal(this.oSmartVariantManagementMediator.getInErrorState(), false, "should set 'inErrorState' property");

		Util.fnCheckIfMethodCallIsForwarded(assert, {
			...this.oSettings,
			methodName: "setInErrorState",
			parameters: [true]
		});

		assert.ok(fnGetTitleSpy.calledTwice, "should call 'getTitle'");
		assert.ok(fnDetermineStandardVariantNameStub.calledOnce, "should call '_determineStandardVariantName'");
		assert.ok(fnTitleSetTextSpy.calledOnce, "should call 'setText' on title");
		assert.equal(this.oSmartVariantManagementMediator.getInErrorState(), true, "should set 'inErrorState' property");

		fnGetTitleSpy.restore();
		fnDetermineStandardVariantNameStub.restore();
		fnDetermineStandardVariantNameStub.restore();
	});

	QUnit.test("should forward '_handleVariantSaveAs' call to embedded VariantManagement", function (assert) {
		Util.fnCheckIfMethodCallIsForwarded(assert, {
			...this.oSettings,
			methodName: "_handleVariantSaveAs",
			parameters: ["NEW_VARIANT_NAME"],
			preventExecution: true
		});
	});

	QUnit.test("should forward '_destroyManageDialog' call to embedded VariantManagement", function (assert) {
		Util.fnCheckIfMethodCallIsForwarded(assert, {
			...this.oSettings,
			methodName: "_destroyManageDialog",
			forwardedMethodName: "destroyManageDialog"
		});
	});

	QUnit.test("should set 'displayTextForExecuteOnSelectionForStandardVariant' also in embedded VariantManagement", function (assert) {
		const sValue = "NEW_DISPLAY_TEXT";
		Util.fnCheckIfMethodCallIsForwarded(assert, {
			...this.oSettings,
			methodName: "setDisplayTextForExecuteOnSelectionForStandardVariant",
			parameters: [sValue]
		});

		assert.equal(this.oSmartVariantManagementMediator.getDisplayTextForExecuteOnSelectionForStandardVariant(), sValue, "should set property correctly in mediator");
		assert.equal(this.oEmbeddedVM.getDisplayTextForExecuteOnSelectionForStandardVariant(), sValue, "should set property correctly in embedded Variant Management");
	});

	QUnit.test("should forward 'setPopoverTitle' to embedded VariantManagement", function (assert) {
		Util.fnCheckIfMethodCallIsForwarded(assert, {
			...this.oSettings,
			methodName: "setPopoverTitle",
			parameters: ["TEST TITLE"]
		});
	});

	QUnit.test("should forward 'setShowAsText' to embedded VariantManagement", function (assert) {
		Util.fnCheckIfMethodCallIsForwarded(assert, {
			...this.oSettings,
			methodName: "setShowAsText",
			parameters: [true]
		});
	});

	QUnit.test("should forward 'getShowCreateTile' to embedded VariantManagement", function (assert) {
		Util.fnCheckIfMethodCallIsForwarded(assert, {
			...this.oSettings,
			methodName: "getShowCreateTile",
			forwardedMethodName: "_getShowCreateTile"
		});
	});

	QUnit.test("should set 'showCreateTile' also in embedded VariantManagement", function (assert) {
		const bValue = true;
		Util.fnCheckIfMethodCallIsForwarded(assert, {
			...this.oSettings,
			methodName: "setShowCreateTile",
			forwardedMethodName: "_setShowCreateTile",
			parameters: [bValue]
		});

		assert.equal(this.oSmartVariantManagementMediator.getProperty("showCreateTile"), bValue, "should set property correctly in mediator");
		assert.equal(this.oEmbeddedVM._getShowCreateTile(), bValue, "should set property correctly in embedded Variant Management");
	});

	QUnit.test("should forward 'setStandardVariantKey' to embedded VariantManagement", function (assert) {
		Util.fnCheckIfMethodCallIsForwarded(assert, {
			...this.oSettings,
			methodName: "setStandardVariantKey",
			parameters: ["KEY"]
		});
	});

	QUnit.test("should forward '_setStandardVariantKey' to embedded VariantManagement", function (assert) {
		Util.fnCheckIfMethodCallIsForwarded(assert, {
			...this.oSettings,
			methodName: "_setStandardVariantKey",
			forwardedMethodName: "setStandardVariantKey",
			parameters: ["KEY"]
		});
	});

	QUnit.test("should forward 'getVariantByKey' to embedded VariantManagement", function (assert) {
		Util.fnCheckIfMethodCallIsForwarded(assert, {
			...this.oSettings,
			methodName: "getVariantByKey",
			forwardedMethodName: "_getItemByKey",
			parameters: ["KEY"]
		});
	});

	QUnit.test("should return null when calling 'getVariantByKey' and no embedded VariantManagement is set", function(assert) {
		this.oSmartVariantManagementMediator._oVM.destroy();
		this.oSmartVariantManagementMediator._oVM = undefined;

		assert.equal(this.oSmartVariantManagementMediator.getVariantByKey(), null, "should return null");
	});

	QUnit.test("should forward getFocusDomRef to embedded VariantManagement", function(assert) {
		const fnGetFocusDomRefSpy = sinon.spy(this.oSmartVariantManagementMediator._oVM.oVariantPopoverTrigger, "getFocusDomRef");
		assert.ok(fnGetFocusDomRefSpy.notCalled, "should not call 'getFocusDomRef' on embedded VariantManagement");

		let vFocusedDomRef = this.oSmartVariantManagementMediator.getFocusDomRef();
		assert.ok(fnGetFocusDomRefSpy.calledOnce, "should call 'getFocusDomRef' on embedded VariantManagement");
		assert.equal(vFocusedDomRef, this.oSmartVariantManagementMediator._oVM.oVariantPopoverTrigger.getFocusDomRef(), "should return correct focus DomRef");

		fnGetFocusDomRefSpy.reset();
		this.oSmartVariantManagementMediator._oVM = undefined;
		assert.ok(fnGetFocusDomRefSpy.notCalled, "should not call 'getFocusDomRef' on embedded VariantManagement");

		vFocusedDomRef = this.oSmartVariantManagementMediator.getFocusDomRef();
		assert.ok(fnGetFocusDomRefSpy.notCalled, "should not call 'getFocusDomRef' on embedded VariantManagement");
		assert.equal(vFocusedDomRef, null, "should return null");
	});

	QUnit.module("IToolbarInteractiveControl relevant methods", {
		before: function () {
			this.oSmartVariantManagementMediator = new SmartVariantManagementMediator();
		},
		after: function() {
			this.oSmartVariantManagementMediator.destroy();
			this.oSmartVariantManagementMediator = undefined;
		}
	});

	QUnit.test("'getOverflowToolbarConfig'", function (assert) {
		assert.deepEqual(this.oSmartVariantManagementMediator.getOverflowToolbarConfig(), {
			canOverflow: false,
			invalidationEvents: ["save", "manage", "select"]
		}, "should return correct config");
	});

	QUnit.test("'_getToolbarInteractive'", function (assert) {
		assert.equal(this.oSmartVariantManagementMediator._getToolbarInteractive(), true, "should return 'true''");
	});

	QUnit.module("ApplyAutomatically on Variant", {
		beforeEach: function() {
			this.oSmartVariantManagementMediator = new SmartVariantManagementMediator();
		},
		afterEach: function() {
			this.oSmartVariantManagementMediator.destroy();
			this.oSmartVariantManagementMediator = undefined;
		}
	});

	QUnit.test("registerApplyAutomaticallyOnStandardVariant", function(assert) {
		const fnCallback = sinon.stub();
		assert.equal(this.oSmartVariantManagementMediator._fRegisteredApplyAutomaticallyOnStandardVariant, undefined, "should have correct initial value for '_fRegisteredApplyAutomaticallyOnStandardVariant'");

		this.oSmartVariantManagementMediator.registerApplyAutomaticallyOnStandardVariant(fnCallback);
		assert.equal(this.oSmartVariantManagementMediator._fRegisteredApplyAutomaticallyOnStandardVariant, fnCallback, "should set correct value for '_fRegisteredApplyAutomaticallyOnStandardVariant'");
		this.oSmartVariantManagementMediator._fRegisteredApplyAutomaticallyOnStandardVariant();
		assert.ok(fnCallback.calledOnce, "should call the callback function");
	});

	QUnit.test("getApplyAutomaticallyOnVariant: should return 'false' when variant is undefined", function(assert) {
		const fnCallback = sinon.stub();
		this.oSmartVariantManagementMediator.registerApplyAutomaticallyOnStandardVariant(fnCallback);

		assert.equal(this.oSmartVariantManagementMediator.getApplyAutomaticallyOnVariant(), false, "should return false");
		assert.equal(this.oSmartVariantManagementMediator.getApplyAutomaticallyOnVariant(undefined), false, "should return false");
		assert.equal(this.oSmartVariantManagementMediator.getApplyAutomaticallyOnVariant(false), false, "should return false");
		assert.equal(this.oSmartVariantManagementMediator.getApplyAutomaticallyOnVariant(null), false, "should return false");

		assert.ok(fnCallback.notCalled, "should not call the callback function");
	});

	QUnit.test("getApplyAutomaticallyOnVariant: should return 'executeOnSelect' of variant when '_fRegisteredApplyAutomaticallyOnStandardVariant' is not set", function(assert) {
		assert.equal(this.oSmartVariantManagementMediator.getApplyAutomaticallyOnVariant(), false, "should return false");
		assert.equal(this.oSmartVariantManagementMediator.getApplyAutomaticallyOnVariant({
			executeOnSelect: false
		}), false, "should return false");
		assert.equal(this.oSmartVariantManagementMediator.getApplyAutomaticallyOnVariant({
			executeOnSelect: true
		}), true, "should return true");
	});

	QUnit.test("getApplyAutomaticallyOnVariant: should return 'executeOnSelect' of variant when 'displayTextForExecuteOnSelectionForStandardVariant' is false", function(assert) {
		const fnCallback = sinon.stub();
		this.oSmartVariantManagementMediator.registerApplyAutomaticallyOnStandardVariant(fnCallback);

		assert.equal(this.oSmartVariantManagementMediator.getApplyAutomaticallyOnVariant(), false, "should return false");
		assert.equal(this.oSmartVariantManagementMediator.getApplyAutomaticallyOnVariant({
			executeOnSelect: false
		}), false, "should return false");
		assert.equal(this.oSmartVariantManagementMediator.getApplyAutomaticallyOnVariant({
			executeOnSelect: true
		}), true, "should return true");

		assert.ok(fnCallback.notCalled, "should not call the callback function");
	});

	QUnit.test("getApplyAutomaticallyOnVariant: should return 'executeOnSelect' of variant when it's 'key' is not the standardVariantKey", function(assert) {
		const fnCallback = sinon.stub();
		this.oSmartVariantManagementMediator.registerApplyAutomaticallyOnStandardVariant(fnCallback);
		this.oSmartVariantManagementMediator.setDisplayTextForExecuteOnSelectionForStandardVariant(true);

		assert.equal(this.oSmartVariantManagementMediator.getApplyAutomaticallyOnVariant(), false, "should return false");
		assert.equal(this.oSmartVariantManagementMediator.getApplyAutomaticallyOnVariant({
			executeOnSelect: false
		}), false, "should return false");
		assert.equal(this.oSmartVariantManagementMediator.getApplyAutomaticallyOnVariant({
			executeOnSelect: true
		}), true, "should return true");

		assert.ok(fnCallback.notCalled, "should not call the callback function");
	});

	QUnit.test("should call the callback function when variant has same key as standardVariantKey", function(assert) {
		const fnCallback = sinon.stub().returns(true);
		this.oSmartVariantManagementMediator.registerApplyAutomaticallyOnStandardVariant(fnCallback);
		this.oSmartVariantManagementMediator.setDisplayTextForExecuteOnSelectionForStandardVariant(true);

		const oVariant = {
			key: this.oSmartVariantManagementMediator.getStandardVariantKey()
		};

		assert.equal(this.oSmartVariantManagementMediator.getApplyAutomaticallyOnVariant(oVariant), true, "should return true");

		assert.ok(fnCallback.calledOnce, "should call the callback function");
		assert.ok(fnCallback.calledWith(oVariant), "should call the callback function with correct parameters");
	});

	QUnit.test("should log error that is thrown by callback function and return executeOnSelect value of variant", function(assert) {
		const fnCallback = () => {
			throw new Error("Dummy Error");
		};
		const fnLogErrorSpy = sinon.spy(Log, "error");
		this.oSmartVariantManagementMediator.registerApplyAutomaticallyOnStandardVariant(fnCallback);
		this.oSmartVariantManagementMediator.setDisplayTextForExecuteOnSelectionForStandardVariant(true);

		assert.ok(fnLogErrorSpy.notCalled, "should not log an error");
		const oVariant = {
			executeOnSelect: true,
			key: this.oSmartVariantManagementMediator.getStandardVariantKey()
		};

		assert.equal(this.oSmartVariantManagementMediator.getApplyAutomaticallyOnVariant(oVariant), true, "should return true");
		assert.ok(fnLogErrorSpy.calledOnce, "should log an error");
		assert.ok(fnLogErrorSpy.calledWith("callback for determination of apply automatically on standard variant failed"), "should log correct error message");
	});

	QUnit.module("getItemByKey", {
		before: function () {
			this.oSmartVariantManagementMediator = new SmartVariantManagementMediator();
		},
		after: function() {
			this.oSmartVariantManagementMediator.destroy();
			this.oSmartVariantManagementMediator = undefined;
		}
	});

	QUnit.test("should return null", function(assert) {
		assert.equal(this.oSmartVariantManagementMediator.getItemByKey("any key"), null, "should return null when no variant items set");
		assert.equal(this.oSmartVariantManagementMediator.getItemByKey(), null, "should return null when no variant items set");

		this.oSmartVariantManagementMediator.getVariants = () => {
			return [
				{
					getKey: () => "key"
				}
			];
		};

		assert.equal(this.oSmartVariantManagementMediator.getItemByKey("other key"), null, "should return null when no variant item has the given key");
		assert.equal(this.oSmartVariantManagementMediator.getItemByKey(), null, "should return null when no key given");
	});

	QUnit.test("should return item with given key", function(assert) {
		const oItem = {
			getKey: () => "key"
		};
		this.oSmartVariantManagementMediator.getVariants = () => {
			return [ oItem ];
		};
		assert.deepEqual(this.oSmartVariantManagementMediator.getItemByKey("key"), oItem, "should return item when it has the given key");
	});

	QUnit.module("_assignUser", {
		beforeEach: function () {
			this.oSmartVariantManagementMediator = new SmartVariantManagementMediator();
			this.fnSetAuthorStub = sinon.stub();
			this.oItem = {
				getKey: () => "key",
				setAuthor: this.fnSetAuthorStub
			};
			this.oSmartVariantManagementMediator._oVM._getItems = () => [this.oItem];
		},
		afterEach: function() {
			this.oSmartVariantManagementMediator.destroy();
			this.oSmartVariantManagementMediator = undefined;

			this.oItem = undefined;
			this.fnSetAuthorStub = undefined;
		}
	});

	QUnit.test("should do nothing when item with given key can't be found", function(assert) {
		assert.ok(this.fnSetAuthorStub.notCalled ,"should not call setAuthor on item initially");

		this.oSmartVariantManagementMediator._assignUser("other key", "user name");

		assert.ok(this.fnSetAuthorStub.notCalled ,"should not call setAuthor on item");
	});

	QUnit.test("should call 'setAuthor' on item", function(assert) {
		assert.ok(this.fnSetAuthorStub.notCalled ,"should not call setAuthor on item initially");

		const sUserName = "user name";
		this.oSmartVariantManagementMediator._assignUser("key", sUserName);

		assert.ok(this.fnSetAuthorStub.calledOnce ,"should call setAuthor on item");
		assert.ok(this.fnSetAuthorStub.calledWith(sUserName) ,"should call setAuthor on item with correct user name");
	});

	QUnit.module("_reapplyExecuteOnSelectForStandardVariantItem", {
		beforeEach: function () {
			this.oSmartVariantManagementMediator = new SmartVariantManagementMediator();
			this.oModel = this.oSmartVariantManagementMediator.oModel;

			this.fnGetVariantsStub = sinon.stub();
			this.fnSetVariantsStub = sinon.stub();
			this.fnFindVariantIndexStub = sinon.stub();
			this.oModel.getVariants = this.fnGetVariantsStub;
			this.oModel.setVariants = this.fnSetVariantsStub;
			this.oModel.findVariantIndex = this.fnFindVariantIndexStub;
		},
		afterEach: function() {
			this.oSmartVariantManagementMediator.destroy();
			this.oSmartVariantManagementMediator = undefined;
			this.oModel = undefined;

			this.fnGetVariantsStub = undefined;
			this.fnSetVariantsStub = undefined;
			this.fnFindVariantIndexStub = undefined;
		}
	});

	QUnit.test("should do nothing when no item with standard variant key extists", function(assert) {
		this.fnGetVariantsStub.returns([]);
		this.fnFindVariantIndexStub.returns(-1);

		assert.ok(this.fnGetVariantsStub.notCalled, "should not call 'getVariants' on SmartVariantManagementModel initially");
		assert.ok(this.fnFindVariantIndexStub.notCalled, "should not call 'findVariantIndex' on SmartVariantManagementModel initially");
		assert.ok(this.fnSetVariantsStub.notCalled, "should not call 'setVariants' on SmartVariantManagementModel initially");

		this.oSmartVariantManagementMediator._reapplyExecuteOnSelectForStandardVariantItem(true);

		assert.ok(this.fnGetVariantsStub.calledOnce, "should call 'getVariants' on SmartVariantManagementModel");
		assert.ok(this.fnFindVariantIndexStub.calledOnce, "should call 'findVariantIndex' on SmartVariantManagementModel");
		assert.ok(this.fnSetVariantsStub.notCalled, "should not call 'setVariants' on SmartVariantManagementModel");
	});

	QUnit.test("should set 'executeOnSelect' and 'originalExecuteOnSelect' on item with standard variant key", function(assert) {
		const aVariants = [
			{
				executeOnSelect: false,
				originalExecuteOnSelect: false
			}
		];
		this.fnGetVariantsStub.returns(aVariants);
		this.fnFindVariantIndexStub.returns(0);

		assert.ok(this.fnGetVariantsStub.notCalled, "should not call 'getVariants' on SmartVariantManagementModel initially");
		assert.ok(this.fnFindVariantIndexStub.notCalled, "should not call 'findVariantIndex' on SmartVariantManagementModel initially");
		assert.ok(this.fnSetVariantsStub.notCalled, "should not call 'setVariants' on SmartVariantManagementModel initially");

		this.oSmartVariantManagementMediator._reapplyExecuteOnSelectForStandardVariantItem(true);

		assert.ok(this.fnGetVariantsStub.calledOnce, "should call 'getVariants' on SmartVariantManagementModel");
		assert.ok(this.fnFindVariantIndexStub.calledOnce, "should call 'findVariantIndex' on SmartVariantManagementModel");
		assert.ok(this.fnSetVariantsStub.calledOnce, "should call 'setVariants' on SmartVariantManagementModel");
		assert.ok(this.fnSetVariantsStub.calledWith([
			{
				executeOnSelect: true,
				originalExecuteOnSelect: true
			}
		]), "should call 'setVariants' on SmartVariantManagementModel with correct parameters");
	});

	QUnit.module("resolveTitleBindings", {
		beforeEach: function () {
			this.oSmartVariantManagementMediator = new SmartVariantManagementMediator();
			this.fnGetModelStub = sinon.stub();
			this.oSmartVariantManagementMediator.getModel = this.fnGetModelStub;
			this.fnAttachEventOnceSpy = sinon.spy(this.oSmartVariantManagementMediator, "attachEventOnce");
			this.oModel = this.oSmartVariantManagementMediator.oModel;

			this.fnPrepareVariantsForTitleBindingsStub = sinon.stub();
			this.oModel.prepareVariantsForTitleBindings = this.fnPrepareVariantsForTitleBindingsStub;

			this.fnReorderVariantsStub = sinon.stub();
			this.oModel.reorderVariants = this.fnReorderVariantsStub;
		},
		afterEach: function() {
			this.oSmartVariantManagementMediator.destroy();
			this.oSmartVariantManagementMediator = undefined;
			this.oModel = undefined;

			this.fnPrepareVariantsForTitleBindingsStub = undefined;
			this.fnReorderVariantsStub = undefined;
			this.fnGetModelStub = undefined;
			this.fnAttachEventOnceSpy.restore();
		}
	});

	const fnCheckInitialState = function(assert) {
		assert.ok(this.fnPrepareVariantsForTitleBindingsStub.notCalled, "should not call 'prepareVariantsForTitleBindings' on SmartVariantManagementModel initially");
		assert.ok(this.fnGetModelStub.notCalled, "should not call 'getModel' initially");
		assert.ok(this.fnReorderVariantsStub.notCalled, "should not call 'reorderVariants' on SmartVariantManagementModel initially");
		assert.ok(this.fnAttachEventOnceSpy.notCalled, "should not call 'attachEventOnce' initially");
	};

	QUnit.test("should do nothing when empty array is provided", function(assert) {
		fnCheckInitialState.call(this, assert);

		const mViewsToCheck = [];
		this.fnPrepareVariantsForTitleBindingsStub.returns(mViewsToCheck);
		this.oSmartVariantManagementMediator.resolveTitleBindings(mViewsToCheck);

		assert.ok(this.fnPrepareVariantsForTitleBindingsStub.calledOnce, "should call 'prepareVariantsForTitleBindings' on SmartVariantManagementModel");
		assert.ok(this.fnPrepareVariantsForTitleBindingsStub.calledWith(this.oSmartVariantManagementMediator.oContext?.sPath, mViewsToCheck), "should call 'prepareVariantsForTitleBindings' on SmartVariantManagementModel with correct parameters");

		assert.ok(this.fnGetModelStub.notCalled, "should not call 'getModel'");
		assert.ok(this.fnReorderVariantsStub.notCalled, "should not call 'reorderVariants' on SmartVariantManagementModel");
		assert.ok(this.fnAttachEventOnceSpy.notCalled, "should not call 'attachEventOnce'");
	});

	QUnit.test("should attach to 'modelContextChange' event once when there is no resource model on view", function(assert) {
		fnCheckInitialState.call(this, assert);

		this.fnGetModelStub.returns(undefined);

		const sResourceModel = "test_model_name_1";
		const sOtherResourceModel = "test_model_name_2";
		const mViewsToCheck = [
			{
				sResourceModel
			},
			{
				sResourceModel
			},
			{
				sResourceModel: sOtherResourceModel
			}
		];
		this.fnPrepareVariantsForTitleBindingsStub.returns(mViewsToCheck);
		this.oSmartVariantManagementMediator.resolveTitleBindings(mViewsToCheck);

		assert.ok(this.fnPrepareVariantsForTitleBindingsStub.calledOnce, "should call 'prepareVariantsForTitleBindings' on SmartVariantManagementModel");
		assert.ok(this.fnPrepareVariantsForTitleBindingsStub.calledWith(this.oSmartVariantManagementMediator.oContext?.sPath, mViewsToCheck), "should call 'prepareVariantsForTitleBindings' on SmartVariantManagementModel with correct parameters");
		assert.ok(this.fnGetModelStub.calledThrice, "should call 'getModel' three times");
		assert.ok(this.fnReorderVariantsStub.notCalled, "should not call 'reorderVariants' on SmartVariantManagementModel");
		assert.ok(this.fnAttachEventOnceSpy.calledTwice, "should call 'attachEventOnce' twice");
	});

	QUnit.test("should call 'getResourceBundle', 'getText' and 'reorderVariants' with the translated text if resource model is present", function(assert) {
		fnCheckInitialState.call(this, assert);

		const sResourceModel = "test_model_name_1";
		const sOtherResourceModel = "test_model_name_2";
		const sResourceKey_1 = "test_resource_key_1";
		const sResourceKey_2 = "test_resource_key_2";

		const sResolvedTitle_1 = "test_title_1";
		const sResolvedTitle_2 = "test_title_2";

		const fnGetTextStub = sinon.stub();
		fnGetTextStub.withArgs(sResourceKey_1).returns(sResolvedTitle_1);
		fnGetTextStub.withArgs(sResourceKey_2).returns(sResolvedTitle_2);

		const fnGetResourceBundleStub = sinon.stub().returns({
			getText: fnGetTextStub
		});

		this.fnGetModelStub.withArgs(sResourceModel).returns({
			getResourceBundle: fnGetResourceBundleStub
		});
		const mViewsToCheck = [
			{
				key: "KEY_1",
				sResourceModel,
				sResourceKey: sResourceKey_1
			},
			{
				key: "KEY_2",
				sResourceModel,
				sResourceKey: sResourceKey_2
			},
			{
				sResourceModel: sOtherResourceModel
			}
		];
		this.fnPrepareVariantsForTitleBindingsStub.returns(mViewsToCheck);
		this.oSmartVariantManagementMediator.resolveTitleBindings(mViewsToCheck);

		assert.ok(this.fnPrepareVariantsForTitleBindingsStub.calledOnce, "should call 'prepareVariantsForTitleBindings' on SmartVariantManagementModel");
		assert.ok(this.fnPrepareVariantsForTitleBindingsStub.calledWith(this.oSmartVariantManagementMediator.oContext?.sPath, mViewsToCheck), "should call 'prepareVariantsForTitleBindings' on SmartVariantManagementModel with correct parameters");
		assert.ok(this.fnGetModelStub.calledThrice, "should call 'getModel' three times");
		assert.ok(this.fnReorderVariantsStub.calledTwice, "should call 'reorderVariants' on SmartVariantManagementModel twice");
		assert.ok(this.fnReorderVariantsStub.calledWith(mViewsToCheck[0].key, sResolvedTitle_1), "should call 'reorderVariants' on SmartVariantManagementModel with correct parameters");
		assert.ok(this.fnReorderVariantsStub.calledWith(mViewsToCheck[1].key, sResolvedTitle_2), "should call 'reorderVariants' on SmartVariantManagementModel with correct parameters");
		assert.ok(this.fnAttachEventOnceSpy.calledOnce, "should call 'attachEventOnce' once");
	});

	QUnit.module("_determineStandardVariantName", {
		beforeEach: function () {
			this.oSmartVariantManagementMediator = new SmartVariantManagementMediator();
		},
		afterEach: function() {
			this.oSmartVariantManagementMediator.destroy();
			this.oSmartVariantManagementMediator = undefined;
		}
	});

	QUnit.test("should return resoruce bundle text 'VARIANT_MANAGEMENT_STANDARD'", function (assert) {
		const sResourceBundleText = this.oSmartVariantManagementMediator.oResourceBundle.getText("VARIANT_MANAGEMENT_STANDARD");
		assert.equal(this.oSmartVariantManagementMediator._determineStandardVariantName(), sResourceBundleText, "should return resource bundle text 'VARIANT_MANAGEMENT_STANDARD' when default variant is undefined");

		this.oSmartVariantManagementMediator.setDefaultVariantKey(this.oSmartVariantManagementMediator.STANDARDVARIANTKEY);
		assert.equal(this.oSmartVariantManagementMediator._determineStandardVariantName(), sResourceBundleText, "should return resource bundle text 'VARIANT_MANAGEMENT_STANDARD' when standard item text is undefined");
	});

	QUnit.test("should return standard item text", function (assert) {
		const sStandardItemText = "standard item text";
		this.oSmartVariantManagementMediator.setDefaultVariantKey(this.oSmartVariantManagementMediator.STANDARDVARIANTKEY);
		this.oSmartVariantManagementMediator.setStandardItemText(sStandardItemText);

		assert.equal(this.oSmartVariantManagementMediator._determineStandardVariantName(), sStandardItemText, "should return standard item text");
	});

});