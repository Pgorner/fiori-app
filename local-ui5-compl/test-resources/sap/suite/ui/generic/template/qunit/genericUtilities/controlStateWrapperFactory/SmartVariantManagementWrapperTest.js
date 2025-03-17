sap.ui.define(
	[
		"sap/suite/ui/generic/template/genericUtilities/ControlStateWrapperFactory",
		"sap/suite/ui/generic/template/genericUtilities/controlStateWrapperFactory/SmartVariantManagementWrapper",
	],
	function (ControlStateWrapperFactory, SmartVariantManagementWrapper) {
		"use strict";

		var oSandbox, oController, oFactory, oControl, oSVM;

		QUnit.module("genericUtilities.controlStateWrapperFactory.SmartVariantManagementWrapper", {
				beforeEach: function () {
					oSandbox = sinon.sandbox.create();
					oControl = getControl("controlId");
					oController = getController(oControl);
					oFactory = new ControlStateWrapperFactory(oController);
					oSVM = getSVM();
				},
				afterEach: function () {
					oSVM = null;
					oControl = null;
					oFactory = null;
					oController = null;
					oSandbox.restore();
				},
			}
		);

		QUnit.test(
			"constructor - passing vTarget as string",
			function (assert) {
				var done = assert.async();
				oControl.bVMConnection = false;
				var oWrapper = new SmartVariantManagementWrapper("vTarget", oController, oFactory, getParams([oControl]));

				oWrapper.setControl(oSVM);

				setTimeout(function () {
					assert.ok(oControl.attachStateChanged.calledOnce, `oControl.bVMConnection is ${oControl.bVMConnection} and oControl.attachStateChanged was called at init. time`);
					oControl.attachStateChanged.firstCall.args[0]();
					assert.ok(oSVM.currentVariantSetModified.calledOnce, `oSmartVariantManagement.currentVariantSetModified was called`);
					assert.ok(oSVM.currentVariantSetModified.calledWithExactly(true), `oSmartVariantManagement.currentVariantSetModified was called with correct params`);
					done();
				}, 0);
			}
		);

		QUnit.test(
			"attachStateChanged",
			function (assert) {
				var done = assert.async(),
				oSVMWrapper = getSVMWrapper(),
				sHandler = "handler function";

				oSVMWrapper.attachStateChanged(sHandler);

				setTimeout(function () {
					assert.ok(oSVM.attachSelect.calledOnce, `oSmartVariantManagement.attachSelect was called`);
					assert.ok(oSVM.attachSelect.calledWithExactly(sHandler), `oSmartVariantManagement.attachSelect was called with correct params`);
					assert.ok(oSVM.attachAfterSave.calledOnce, `oSmartVariantManagement.attachAfterSave was called`);
					assert.ok(oSVM.attachAfterSave.calledWithExactly(sHandler), `oSmartVariantManagement.attachAfterSave was called with correct params`);
					assert.ok(oControl.attachStateChanged.calledOnce, `oWrapper.attachStateChanged was called`);
					done();
				}, 0);
			}
		);

		QUnit.test(
			"setState, oState = undefined",
			function (assert) {
				var done = assert.async(),
					oSVMWrapper = getSVMWrapper(),
					sVariantId = "default-variant-Id";

				oSVM.getDefaultVariantId.returns(sVariantId);

				oSVMWrapper.setState(undefined);

				setTimeout(function () {
					assert.ok(oSVM.getDefaultVariantId.calledOnce, `oSmartVariantManagement.getDefaultVariantId was called`);
					assert.ok(oSVM.setCurrentVariantId.calledOnce, `oSmartVariantManagement.setCurrentVariantId was called`);
					assert.ok(oSVM.setCurrentVariantId.calledWithExactly(sVariantId), `oSmartVariantManagement.setCurrentVariantId was called  with correct params`);
					done();
				}, 0);
			}
		);

		QUnit.test(
			"setState, oState = {modified: true}",
			function (assert) {
				var done = assert.async(),
					oSVMWrapper = getSVMWrapper(),
					oState = {modified: true, managedControlStates: { [oControl.id] : "control state"}};

				oSVMWrapper.setState(oState);

				setTimeout(function () {
					assert.ok(oSVM.setCurrentVariantId.calledOnce, `oSmartVariantManagement.setCurrentVariantId was called`);
					assert.ok(oSVM.setCurrentVariantId.calledWithExactly(""), `oSmartVariantManagement.setCurrentVariantId was called  with correct params`);
					assert.ok(oSVM.currentVariantSetModified.calledOnce, `oSmartVariantManagement.currentVariantSetModified was called`);
					assert.ok(oSVM.currentVariantSetModified.calledWithExactly(true), `oSmartVariantManagement.currentVariantSetModified was called with correct params`);

					assert.ok(oControl.setState.calledOnce, `oWrapper.setState was called`);
					assert.ok(oControl.setState.calledWithExactly(oState.managedControlStates[oControl.id]), `oWrapper.setState was called with correct params`);
					done();
				}, 0);
			}
		);

		QUnit.test(
			"setState, oState = {modified: false, managedControlStates: undefined}",
			function (assert) {
				var done = assert.async(),
					oSVMWrapper = getSVMWrapper(),
					oState = {modified: false, variantId: "state variant id"};

				oSVMWrapper.setState(oState);

				setTimeout(function () {
					assert.ok(oSVM.setCurrentVariantId.calledOnce, `oSmartVariantManagement.setCurrentVariantId was called`);
					assert.ok(oSVM.setCurrentVariantId.calledWithExactly(oState.variantId), `oSmartVariantManagement.setCurrentVariantId was called with correct params`);
					assert.ok(oSVM.currentVariantSetModified.notCalled, `oSmartVariantManagement.currentVariantSetModified was not called`);

					assert.ok(oControl.setState.notCalled, `oWrapper.setState was called`);
					done();
				}, 0);
			}
		);

		QUnit.test(
			"setState, oState = {modified: false, managedControlStates: {}}, oSmartFilterBarWrapper is not defined, oState.variantId === oSVM.getCurrentVariantId()",
			function (assert) {
				var done = assert.async(),
					oSVMWrapper = getSVMWrapper(),
					oState = {modified: false, variantId: "state variant id", managedControlStates: {[oControl.id] : "control state"}};
				oSVM.getCurrentVariantId.returns(oState.variantId);

				oSVMWrapper.setState(oState);

				setTimeout(function () {
					assert.ok(oSVM.setCurrentVariantId.calledOnce, `oSmartVariantManagement.setCurrentVariantId was called`);
					assert.ok(oSVM.setCurrentVariantId.calledWithExactly(oState.variantId), `oSmartVariantManagement.setCurrentVariantId was called with correct params`);
					assert.ok(oSVM.currentVariantSetModified.notCalled, `oSmartVariantManagement.currentVariantSetModified was not called`);

					assert.ok(oControl.getLocalId.calledOnce, `oSmartFilterBarWrapper.getLocalId was called`);
					assert.ok(oControl.setState.notCalled, `oSmartFilterBarWrapper.setState was called`);
					done();
				}, 0);
			}
		);

		QUnit.test(
			"setState, oState = {modified: false, managedControlStates: {}}, oSmartFilterBarWrapper is defined, oState.variantId !== oSVM.getCurrentVariantId()",
			function (assert) {
				oControl.setSVMWrapperCallbacks = sinon.stub();
				var done = assert.async(),
					oSVMWrapper = getSVMWrapper(),
					oState = {modified: false, variantId: "state variant id", managedControlStates: {[oControl.id]: "control state"}};
				oSVM.getCurrentVariantId.returns(oState.variantId + "-something");

				oSVMWrapper.setState(oState);

				setTimeout(function () {
					assert.ok(oSVM.setCurrentVariantId.calledOnce, `oSmartVariantManagement.setCurrentVariantId was called`);
					assert.ok(oSVM.setCurrentVariantId.calledWithExactly(oState.variantId), `oSmartVariantManagement.setCurrentVariantId was called  with correct params`);
					assert.ok(oSVM.currentVariantSetModified.calledOnce, `oSmartVariantManagement.currentVariantSetModified was not called`);
					assert.ok(oSVM.currentVariantSetModified.calledWithExactly(true), `oSmartVariantManagement.currentVariantSetModified was called with correct params`);

					assert.ok(oControl.getLocalId.calledTwice, `oControl.getLocalId was called`);
					assert.ok(oControl.setSVMWrapperCallbacks.calledOnce, `oSmartFilterBarWrapper.setSVMWrapperCallbacks was called`);
					assert.ok(oControl.suppressSelection.calledTwice, `oSmartFilterBarWrapper.suppressSelection was called`);
					assert.ok(oControl.suppressSelection.firstCall.calledWithExactly(true), `oSmartFilterBarWrapper.suppressSelection first call with correct params`);
					assert.ok(oControl.suppressSelection.secondCall.calledWithExactly(false), `oSmartFilterBarWrapper.suppressSelection second call with correct params`);
					assert.ok(oControl.setState.calledOnce, `oSmartFilterBarWrapper.setState was called`);
					assert.ok(oControl.setState.calledWithExactly(oState.managedControlStates[oControl.id]), `oSmartFilterBarWrapper.setState was called with correct params`);
					done();
				}, 0);
			}
		);

		QUnit.test(
			"fnSetVariant through setState, oState = {modified: false, variantId: '*standard*', managedControlStates: undefined}, oControl is SmartTable",
			function (assert) {
				var done = assert.async(),
					oSVMWrapper = getSVMWrapper(),
					oState = {modified: false, variantId: "*standard*"};

				oControl.isA.withArgs("sap.ui.comp.smarttable.SmartTable").returns(true);
				oControl.getCurrentVariantId.returns(oState.variantId);

				oSVMWrapper.setState(oState);

				setTimeout(function () {
					assert.ok(oSVM.setCurrentVariantId.calledOnce, `oSmartVariantManagement.setCurrentVariantId was called`);
					assert.ok(oSVM.setCurrentVariantId.calledWithExactly(oState.variantId), `oSmartVariantManagement.setCurrentVariantId was called with correct params`);

					assert.ok(oControl.isA.calledOnce, `oControl.isA was called`);
					assert.ok(oControl.attachAfterVariantInitialise.calledOnce, `oControl.attachAfterVariantInitialise was called`);
					oControl.attachAfterVariantInitialise.firstCall.args[0]();
					assert.ok(oControl.getCurrentVariantId.notCalled, `oControl.getCurrentVariantId was called`);
					assert.ok(oControl.setCurrentVariantId.notCalled, `oControl.setCurrentVariantId was not called`);
					assert.ok(oSVM.setModified.notCalled, `oSmartVariantManagement.setModified was not called`);
					done();
				}, 0);
			}
		);

		QUnit.test(
			"fnSetVariant through setState, oState = {modified: false, variantId: 'some variant', managedControlStates: undefined}, oControl is SmartTable, oState.variantId === oControl.getCurrentVariantId()",
			function (assert) {
				var done = assert.async(),
					oSVMWrapper = getSVMWrapper(),
					oState = {modified: false, variantId: "some variant"};

				oControl.isA.withArgs("sap.ui.comp.smarttable.SmartTable").returns(true);
				oControl.getCurrentVariantId.returns(oState.variantId);

				oSVMWrapper.setState(oState);

				setTimeout(function () {
					assert.ok(oSVM.setCurrentVariantId.calledOnce, `oSmartVariantManagement.setCurrentVariantId was called`);
					assert.ok(oSVM.setCurrentVariantId.calledWithExactly(oState.variantId), `oSmartVariantManagement.setCurrentVariantId was called with correct params`);

					assert.ok(oControl.isA.calledOnce, `oControl.isA was called`);
					assert.ok(oControl.attachAfterVariantInitialise.calledOnce, `oControl.attachAfterVariantInitialise was called`);
					oControl.attachAfterVariantInitialise.firstCall.args[0]();
					assert.ok(oControl.getCurrentVariantId.calledOnce, `oControl.getCurrentVariantId was called`);
					assert.ok(oControl.setCurrentVariantId.notCalled, `oControl.setCurrentVariantId was called`);
					assert.ok(oSVM.setModified.notCalled, `oSmartVariantManagement.setModified was called`);
					done();
				}, 0);
			}
		);

		QUnit.test(
			"fnSetVariant through setState, oState = {modified: false, variantId: 'some variant', managedControlStates: undefined}, oControl is SmartTable, oState.variantId !== oControl.getCurrentVariantId()",
			function (assert) {
				var done = assert.async(),
					oSVMWrapper = getSVMWrapper(),
					oState = {modified: false, variantId: "some variant"};

				oControl.isA.withArgs("sap.ui.comp.smarttable.SmartTable").returns(true);
				oControl.getCurrentVariantId.returns(oState.variantId + "-something");

				oSVMWrapper.setState(oState);

				setTimeout(function () {
					assert.ok(oSVM.setCurrentVariantId.calledOnce, `oSmartVariantManagement.setCurrentVariantId was called`);
					assert.ok(oSVM.setCurrentVariantId.calledWithExactly(oState.variantId), `oSmartVariantManagement.setCurrentVariantId was called with correct params`);

					assert.ok(oControl.isA.calledOnce, `oControl.isA was called`);
					assert.ok(oControl.attachAfterVariantInitialise.calledOnce, `oControl.attachAfterVariantInitialise was called`);
					oControl.attachAfterVariantInitialise.firstCall.args[0]();
					assert.ok(oControl.getCurrentVariantId.calledOnce, `oControl.getCurrentVariantId was called`);
					assert.ok(oControl.setCurrentVariantId.calledOnce, `oControl.setCurrentVariantId was called`);
					assert.ok(oControl.setCurrentVariantId.calledWithExactly(oState.variantId), `oControl.setCurrentVariantId was called with correct params`);
					assert.ok(oSVM.setModified.calledOnce, `oSmartVariantManagement.setModified was called`);
					assert.ok(oSVM.setModified.calledWithExactly(false), `oSmartVariantManagement.setModified was called with correct params`);
					done();
				}, 0);
			}
		);

    function getView(oViewControl) {
			return {
				byId: sinon.stub().returns(oViewControl),
				getLocalId: sinon.spy(function (sId) {
					return sId.split("--")[1];
				}),
			};
		}

		function getController(oViewControl) {
			var view = getView(oViewControl);
			return {
				view: view,
				getView: sinon.stub().withArgs(oViewControl.controlId).returns(view),
			};
		}

		function getControl(id) {
			return {
				id: id,
				bVMConnection: true,
				attachAfterVariantInitialise: sinon.stub(),
				getLocalId: sinon.stub().returns(id),
				isA: sinon.stub().returns(false),
				setState: sinon.stub(),
				attachStateChanged: sinon.stub(),
				suppressSelection: sinon.stub(),
				setCurrentVariantId: sinon.stub(),
				getCurrentVariantId: sinon.stub(),
			};
		}

		function getParams(managedControlWrappers, dynamicPageWrapper) {
			return {
				managedControlWrappers: managedControlWrappers ? managedControlWrappers : [],
				dynamicPageWrapper: dynamicPageWrapper ? dynamicPageWrapper : [],
			};
		}

		function getSVM() {
			return {
				currentVariantSetModified: sinon.stub(),
				currentVariantGetModified: sinon.stub(),
				setModified: sinon.stub(),
				setCurrentVariantId: sinon.stub(),
				getCurrentVariantId: sinon.stub(),
				getDefaultVariantId: sinon.stub(),
				attachSelect: sinon.stub(),
				attachAfterSave: sinon.stub(),
			};
		}

    function getSVMWrapper() {
      return new SmartVariantManagementWrapper(oSVM, oController, oFactory, getParams([oControl]));
    }
	}
);
