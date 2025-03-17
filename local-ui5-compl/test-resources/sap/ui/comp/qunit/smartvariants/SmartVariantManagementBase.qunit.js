/* global QUnit, sinon */
sap.ui.define([
	"sap/ui/comp/smartvariants/SmartVariantManagementBase",
	"./Util"
], function(
	SmartVariantManagementBase,
	Util
) {
	"use strict";

	QUnit.module("init", {
		before: function () {
			this.oSmartVariantManagementBase = new SmartVariantManagementBase();
		},
		after: function() {
			this.oSmartVariantManagementBase.destroy();
			this.oSmartVariantManagementBase = undefined;
		}
	});

	QUnit.test("should set '_mVariants'", function(assert) {
		assert.deepEqual(this.oSmartVariantManagementBase._mVariants, {}, "should set empty object as value of '_mVariants'");
	});

	QUnit.test("should set '_mTranslatablePromises'", function(assert) {
		assert.deepEqual(this.oSmartVariantManagementBase._mTranslatablePromises, {}, "should set empty object as value of '_mTranslatablePromises'");
	});

	QUnit.test("should set STANDARDVARIANTKEY", function(assert) {
		assert.equal(this.oSmartVariantManagementBase.STANDARDVARIANTKEY, "*standard*", "should set correct value for STANDARDVARIANTKEY");
	});

	QUnit.test("should add style class 'sapUiCompVarMngmt'", function(assert) {
		assert.ok(this.oSmartVariantManagementBase.aCustomStyleClasses.includes("sapUiCompVarMngmt"), "should add style class 'sapUiCompVarMngmt'");
	});

	QUnit.module("SmartVariantManagementModel forwarding", {
		beforeEach: function () {
			this.oSmartVariantManagementBase = new SmartVariantManagementBase();
			this.oModel = this.oSmartVariantManagementBase.oModel;
			this.oSettings = {
				sourceInstance: this.oSmartVariantManagementBase,
				forwardedInstance: this.oModel,
				parameters: [],
				expectedParameters: undefined,
				preventExecution: false
			};
		},
		afterEach: function() {
			this.oSmartVariantManagementBase.destroy();
			this.oSmartVariantManagementBase = undefined;
			this.oModel = undefined;
		}
	});

	QUnit.test("should forward 'updateVariant' call to SmartVariantManagementModel", function (assert) {
		Util.fnCheckIfMethodCallIsForwarded(assert, {
			...this.oSettings,
			methodName: "updateVariant"
		});
	});

	QUnit.module("Embedded VariantManagement forwarding", {
		beforeEach: function () {
			this.oSmartVariantManagementBase = new SmartVariantManagementBase();
			this.oEmbeddedVM = this.oSmartVariantManagementBase._oVM;
			this.oSettings = {
				sourceInstance: this.oSmartVariantManagementBase,
				forwardedInstance: this.oEmbeddedVM,
				parameters: [],
				expectedParameters: undefined,
				preventExecution: false
			};
		},
		afterEach: function() {
			this.oSmartVariantManagementBase.destroy();
			this.oSmartVariantManagementBase = undefined;
			this.oEmbeddedVM = undefined;
		}
	});

	[
		"getTitle",
		"refreshTitle"
	].forEach((sMethodName) => {
		QUnit.test(`should forward '${sMethodName}' call to embedded VariantManagement`, function (assert) {
			Util.fnCheckIfMethodCallIsForwarded(assert, {
				...this.oSettings,
				methodName: sMethodName
			});
		});
	});

	QUnit.test("should return ManageDialog of embedded VariantManagement when calling 'getManageDialog'", function (assert) {
		assert.equal(this.oSmartVariantManagementBase.getManageDialog(), this.oEmbeddedVM.oManagementDialog, "should return oManagementDialog of embedded VariantManagement");

		this.oSmartVariantManagementBase._oVM = undefined;

		assert.equal(this.oSmartVariantManagementBase.getManageDialog(), null, "should return null if embedded VariantManagement is not set");
	});

	QUnit.module("'removeVariant'", {
		beforeEach: function() {
			this.oSmartVariantManagementBase = new SmartVariantManagementBase();
			this.sVariantId = "TEST_ID";
			this.oSmartVariantManagementBase._mVariants[this.sVariantId] = {};

			this.fnRemoveVariantMock = sinon.stub(this.oSmartVariantManagementBase.oModel, "removeVariant");
			this.fnActivateVariantMock = sinon.stub(this.oSmartVariantManagementBase, "activateVariant");
			this.fnSetDefaultVariantIdMock = sinon.stub(this.oSmartVariantManagementBase, "setDefaultVariantId");

			this.fnSetModifiedMock = sinon.stub(this.oSmartVariantManagementBase, "setModified");
			this.fnSetSelectionKeyMock = sinon.stub(this.oSmartVariantManagementBase, "setSelectionKey");
		},
		afterEach: function() {
			this.oSmartVariantManagementBase.destroy();
			this.oSmartVariantManagementBase = undefined;

			this.fnRemoveVariantMock.restore();
			this.fnActivateVariantMock.restore();
			this.fnSetDefaultVariantIdMock.restore();

			this.fnSetSelectionKeyMock.restore();
			this.fnSetModifiedMock.restore();
		}
	});

	const fnTestRemoveVariant = function (assert, mProperties) {
		assert.ok(this.fnRemoveVariantMock.notCalled, "should not call 'removeVariant' on SmartVariantManagementModel initially");
		assert.ok(this.fnActivateVariantMock.notCalled, "should not call 'activateVariant' initially");
		assert.ok(this.fnSetDefaultVariantIdMock.notCalled, "should not call 'setDefaultVariantId' initially");
		assert.ok(this.fnSetSelectionKeyMock.notCalled, "should not call 'setSelectionKey' initially");
		assert.ok(this.fnSetModifiedMock.notCalled, "should not call 'setModified' initially");

		assert.deepEqual(this.oSmartVariantManagementBase._mVariants[this.sVariantId], {}, "should have internal '_mVariants' entry");

		this.oSmartVariantManagementBase.removeVariant(mProperties);

		// check removeVariant
		if (mProperties.variantId) {
			assert.ok(this.fnRemoveVariantMock.calledOnce, "should call 'removeVariant' on SmartVariantManagementModel");
			assert.ok(this.fnRemoveVariantMock.calledWith(mProperties.variantId), "should call 'removeVariant' on SmartVariantManagementModel with correct parameters");
			assert.equal(this.oSmartVariantManagementBase._mVariants[mProperties.variantId], undefined, "should remove internal '_mVariants' entry");
		} else {
			assert.deepEqual(this.oSmartVariantManagementBase._mVariants[this.sVariantId], {}, "should not remove internal '_mVariants' entry");
			assert.ok(this.fnRemoveVariantMock.notCalled, "should not call 'removeVariant' on SmartVariantManagementModel");
		}

		// check activateVariant
		if (mProperties.previousVariantId) {
			assert.ok(this.fnActivateVariantMock.calledOnce, "should call 'activateVariant'");
			assert.ok(this.fnActivateVariantMock.calledWith(mProperties.previousVariantId), "should call 'activateVariant' with correct parameters");
		} else {
			assert.ok(this.fnActivateVariantMock.notCalled, "should not call 'activateVariant'");
		}

		// check setDefaultVariantId
		if (mProperties.previousDefault) {
			assert.ok(this.fnSetDefaultVariantIdMock.calledOnce, "should call 'setDefaultVariantId'");
			assert.ok(this.fnSetDefaultVariantIdMock.calledWith(mProperties.previousDefault), "should call 'setDefaultVariantId' with correct parameters");
		} else {
			assert.ok(this.fnSetDefaultVariantIdMock.notCalled, "should not call 'setDefaultVariantId'");
		}

		// never call these
		assert.ok(this.fnSetSelectionKeyMock.notCalled, "should not call 'setSelectionKey'");
		assert.ok(this.fnSetModifiedMock.notCalled, "should not call 'setModified'");
	};

	QUnit.test("should not do anything when properties are not provided", function(assert) {
		fnTestRemoveVariant.call(this, assert, {});
	});


	QUnit.test("should remove variant if properties provide 'variantId'", function(assert) {
		fnTestRemoveVariant.call(this, assert, {
			variantId: this.sVariantId
		});
	});

	QUnit.test("should activate previous variantId", function(assert) {
		fnTestRemoveVariant.call(this, assert, {
			previousVariantId: "PREVIOUS ID"
		});
	});

	QUnit.test("should set previous defaultVariantId", function(assert) {
		fnTestRemoveVariant.call(this, assert, {
			previousDefault: "PREVIOUS DEFAULT ID"
		});
	});

	QUnit.test("should do all above", function(assert) {
		fnTestRemoveVariant.call(this, assert, {
			variantId: this.sVariantId,
			previousVariantId: "PREVIOUS ID",
			previousDefault: "PREVIOUS DEFAULT ID"
		});
	});

	QUnit.module("'removeWeakVariant'", {
		beforeEach: function() {
			this.oSmartVariantManagementBase = new SmartVariantManagementBase();
			this.sVariantId = "TEST_ID";
			this.oSmartVariantManagementBase._mVariants[this.sVariantId] = {};

			this.fnRemoveVariantMock = sinon.stub(this.oSmartVariantManagementBase.oModel, "removeVariant");
			this.fnActivateVariantMock = sinon.stub(this.oSmartVariantManagementBase, "activateVariant");
			this.fnSetSelectionKeyMock = sinon.stub(this.oSmartVariantManagementBase, "setSelectionKey");
			this.fnSetDefaultVariantIdMock = sinon.stub(this.oSmartVariantManagementBase, "setDefaultVariantId");
			this.fnSetModifiedMock = sinon.stub(this.oSmartVariantManagementBase, "setModified");
		},
		afterEach: function() {
			this.oSmartVariantManagementBase.destroy();
			this.oSmartVariantManagementBase = undefined;

			this.fnRemoveVariantMock.restore();
			this.fnActivateVariantMock.restore();
			this.fnSetDefaultVariantIdMock.restore();
			this.fnSetSelectionKeyMock.restore();
			this.fnSetModifiedMock.restore();
		}
	});

	const fnTestRemoveWeakVariant = function (assert, mProperties) {
		// initial checks
		assert.ok(this.fnRemoveVariantMock.notCalled, "should not call 'removeVariant' on SmartVariantManagementModel initially");
		assert.ok(this.fnActivateVariantMock.notCalled, "should not call 'activateVariant' initially");
		assert.ok(this.fnSetDefaultVariantIdMock.notCalled, "should not call 'setDefaultVariantId' initially");
		assert.ok(this.fnSetSelectionKeyMock.notCalled, "should not call 'setSelectionKey' initially");
		assert.ok(this.fnSetModifiedMock.notCalled, "should not call 'setModified' initially");
		assert.deepEqual(this.oSmartVariantManagementBase._mVariants[this.sVariantId], {}, "should have internal '_mVariants' entry");

		this.oSmartVariantManagementBase.removeWeakVariant(mProperties);

		// should never call this method
		assert.ok(this.fnActivateVariantMock.notCalled, "should not call 'activateVariant'");

		// check removeVariant
		if (mProperties.variantId) {
			assert.ok(this.fnRemoveVariantMock.calledOnce, "should call 'removeVariant' on SmartVariantManagementModel");
			assert.ok(this.fnRemoveVariantMock.calledWith(mProperties.variantId), "should call 'removeVariant' on SmartVariantManagementModel with correct parameters");
			assert.equal(this.oSmartVariantManagementBase._mVariants[mProperties.variantId], undefined, "should remove internal '_mVariants' entry");
		} else {
			assert.deepEqual(this.oSmartVariantManagementBase._mVariants[this.sVariantId], {}, "should not remove internal '_mVariants' entry");
			assert.ok(this.fnRemoveVariantMock.notCalled, "should not call 'removeVariant' on SmartVariantManagementModel");
		}

		// check setSelectionKey
		if (mProperties.previousVariantId) {
			assert.ok(this.fnSetSelectionKeyMock.calledOnce, "should not call 'setSelectionKey'");
			assert.ok(this.fnSetSelectionKeyMock.calledWith(mProperties.previousVariantId), "should call 'setSelectionKey' with correct parameters");
		} else {
			assert.ok(this.fnSetSelectionKeyMock.notCalled, "should not call 'setSelectionKey'");
		}

		// check setDefaultVariantId
		if (mProperties.previousDefault) {
			assert.ok(this.fnSetDefaultVariantIdMock.calledOnce, "should call 'setDefaultVariantId'");
			assert.ok(this.fnSetDefaultVariantIdMock.calledWith(mProperties.previousDefault), "should call 'setDefaultVariantId' with correct parameters");
		} else {
			assert.ok(this.fnSetDefaultVariantIdMock.notCalled, "should not call 'setDefaultVariantId'");
		}

		//check setModified
		if (mProperties.previousDirtyFlag) {
			assert.ok(this.fnSetModifiedMock.calledOnce, "should call 'setModified'");
			assert.ok(this.fnSetModifiedMock.calledWith(mProperties.previousDirtyFlag), "should call 'setModified' with correct parameters");
		} else {
			assert.ok(this.fnSetModifiedMock.notCalled, "should not call 'setModified'");
		}
	};

	QUnit.test("should do nothing when properties are not provided", function(assert) {
		fnTestRemoveWeakVariant.call(this, assert, {});
		// fnTestRemoveWeakVariant.call(this, assert, undefined); TODO: should we test for undefined?
	});

	QUnit.test("should remove variant if properties provide 'variantId'", function(assert) {
		fnTestRemoveWeakVariant.call(this, assert, {
			variantId: this.sVariantId
		});
	});

	QUnit.test("should set selection key if properties provide 'previousVariantId'", function(assert) {
		fnTestRemoveWeakVariant.call(this, assert, {
			previousVariantId: "PREVIOUS ID"
		});
	});

	QUnit.test("should set previous defaultVariantId", function(assert) {
		fnTestRemoveWeakVariant.call(this, assert, {
			previousDefault: "PREVIOUS DEFAULT ID"
		});
	});

	QUnit.test("should set modified when 'previousDirtyFlag' is provided", function(assert) {
		fnTestRemoveWeakVariant.call(this, assert, {
			previousDirtyFlag: true
		});
	});

	QUnit.test("should do all above", function(assert) {
		fnTestRemoveWeakVariant.call(this, assert, {
			variantId: this.sVariantId,
			previousVariantId: "PREVIOUS ID",
			previousDefault: "PREVIOUS DEFAULT ID",
			previousDirtyFlag: true
		});
	});

	QUnit.module("DesignMode", {
		beforeEach: function () {
			this.oSmartVariantManagementBase = new SmartVariantManagementBase();
			this.fnSetDesignTimeModeSpy = sinon.spy(this.oSmartVariantManagementBase, "setDesignTimeMode");
		},
		afterEach: function() {
			this.oSmartVariantManagementBase.destroy();
			this.oSmartVariantManagementBase = undefined;

			this.fnSetDesignTimeModeSpy.restore();
		}
	});

	QUnit.test("'enteringDesignMode' should call 'setDesignTimeMode'", function (assert) {
		assert.ok(this.fnSetDesignTimeModeSpy.notCalled, "should not call 'setDesignTimeMode' initially");

		this.oSmartVariantManagementBase.enteringDesignMode();

		assert.ok(this.fnSetDesignTimeModeSpy.calledOnce, "should call 'setDesignTimeMode' when calling 'enteringDesignMode'");
		assert.ok(this.fnSetDesignTimeModeSpy.calledWith(true), "should call 'setDesignTimeMode' with 'true' when calling 'enteringDesignMode'");
	});

	QUnit.test("'leavingDesignMode' should call 'setDesignTimeMode'", function (assert) {
		assert.ok(this.fnSetDesignTimeModeSpy.notCalled, "should not call 'setDesignTimeMode' initially");

		this.oSmartVariantManagementBase.leavingDesignMode();

		assert.ok(this.fnSetDesignTimeModeSpy.calledOnce, "should call 'setDesignTimeMode' when calling 'leavingDesignMode'");
		assert.ok(this.fnSetDesignTimeModeSpy.calledWith(false), "should call 'setDesignTimeMode' with 'false' when calling 'leavingDesignMode'");
	});

	QUnit.test("'setDesignTimeMode' should set 'variantsEditable' in model and 'designMode' on embedded VariantManagement", function (assert) {
		const fnSetVariantsEditableSpy = sinon.spy(this.oSmartVariantManagementBase.oModel, "setVariantsEditable");
		const fnSetDesignModeSpy = sinon.spy(this.oSmartVariantManagementBase._oVM, "setDesignMode");

		assert.ok(fnSetVariantsEditableSpy.notCalled, "should not call 'setVariantsEditable' initially");
		assert.ok(fnSetDesignModeSpy.notCalled, "should not call 'setDesignMode' initially");

		this.oSmartVariantManagementBase.setDesignTimeMode(true);

		assert.ok(fnSetVariantsEditableSpy.calledOnce, "should call 'setVariantsEditable' when calling 'setDesignTimeMode'");
		assert.ok(fnSetVariantsEditableSpy.calledWith(false, this.oSmartVariantManagementBase.oContext?.path), "should call 'setVariantsEditable' with correct paramters");

		assert.ok(fnSetDesignModeSpy.calledOnce, "should call 'setDesignMode' when calling 'setDesignTimeMode'");
		assert.ok(fnSetDesignModeSpy.calledWith(true), "should call 'setDesignMode' with correct paramters");
	});
});

