sap.ui.define(
	[
		"sap/suite/ui/generic/template/genericUtilities/controlStateWrapperFactory/SmartTableChartCommon",
	],
	function (SmartTableChartCommon) {
		"use strict";

		var oSandbox,
			oController,
			oFactory,
			oControl,
			sInitializationEvent;

		QUnit.module("genericUtilities.controlStateWrapperFactory.SmartVariantManagementWrapper", {
				beforeEach: function () {
					oSandbox = sinon.sandbox.create();
					oControl = getControl();
					oController = getController();
					oFactory = getFactory();
					sInitializationEvent = "sInitializationEvent";
				},
				afterEach: function () {
					oControl = null;
					oFactory = null;
					oController = null;
					oSandbox.restore();
				},
			}
		);

		QUnit.test("constructor - passing vTarget as string", function (assert) {
			oControl.isInitialised.returns(false);

			var oWrapper = new SmartTableChartCommon("vTarget", oController, oFactory, sInitializationEvent);
			assert.ok(oControl.isInitialised.notCalled, "oControl.isInitialised was not called at construction time");

			oWrapper.setControl(oControl);
			assert.ok(oControl.isInitialised.calledOnce, "oControl.isInitialised was called after oWrapper.fnSetControl() call");
			assert.ok(oControl.attachEvent.calledOnce, "oControl.attachEvent was called");
			assert.ok(oControl.attachEvent.firstCall.args[0] === sInitializationEvent, "oControl.attachEvent subscribe to correct event");
			assert.ok(oControl.getSmartVariant.calledOnce, "oControl.getSmartVariant called once");
		});

		QUnit.test("setControl, oSmartControl.getSmartVariant() = null, oSmartControl.getUseVariantManagement() = true, oSmartControl.getVariantManagement() = null -> subscribe to oSmartControl.attachAfterVariantInitialise event to wait till control will be initialized", function (assert) {
			oControl.isInitialised.returns(true);
			oControl.getSmartVariant.returns(null);
			oControl.getUseVariantManagement.returns(true);
			oControl.getVariantManagement.returns(null);

			getWrapper();

			assert.ok(oControl.getSmartVariant.calledThrice, "oControl.getSmartVariant was called 3 times");
			assert.ok(oControl.getUseVariantManagement.calledOnce, "oControl.getUseVariantManagement was called ");
			assert.ok(oControl.getVariantManagement.calledOnce, "oControl.getVariantManagement was called ");
			assert.ok(oControl.attachAfterVariantInitialise.calledOnce, "oControl.attachAfterVariantInitialise was called ");
		});

		QUnit.test("setControl, oSmartControl.getSmartVariant() = null, oSmartControl.getUseVariantManagement() = true, oSmartControl.getVariantManagement() = valid variant management -> initialize wrapper by calling oFactory.getControlStateWrapper() method", function (assert) {
			oControl.isInitialised.returns(true);
			oControl.getSmartVariant.returns(null);
			oControl.getUseVariantManagement.returns(true);
			oControl.getVariantManagement.returns("oVariantManagementControl");

			getWrapper();

			assert.ok(oControl.getSmartVariant.calledThrice, "oControl.getSmartVariant was called 3 times");
			assert.ok(oControl.getUseVariantManagement.calledOnce, "oControl.getUseVariantManagement was called ");
			assert.ok(oControl.getVariantManagement.calledOnce, "oControl.getVariantManagement was called ");
			assert.ok(oFactory.getControlStateWrapper.calledOnce, "oFactory.getControlStateWrapper was called ");
			assert.ok(oFactory.getControlStateWrapper.firstCall.args[0] === "oVariantManagementControl", "oFactory.getControlStateWrapper was called with correct first parameter");
			assert.ok(oFactory.getControlStateWrapper.firstCall.args[1].managedControlWrappers.length === 1, "oFactory.getControlStateWrapper was called with correct second parameter");
		});

		[
			{ input: undefined, output: undefined },
			{ input: {}, output: {} },
			{ input: {bVariantModified: null}, output: {modified: null} },
			{ input: {bVariantModified: true}, output: {modified: true} },
			{ input: {sVariantId: null}, output: {variantId: null} },
			{ input: {sVariantId: "variant001"}, output: {variantId: "variant001"} },
			{ input: {oUiState: null}, output: {} },
			{ input: {oUiState: {dataA01: "valueA01"}, managedControlStates: {dataB01: "valueB01"}}, output: {} },
			{ input: {oUiState: {dataA01: "valueA01"}, managedControlStates: null}, output: {managedControlStates: {localId: {oUiState: {dataA01: "valueA01"}}}} },
		].forEach(function(data){
			QUnit.test("setState() - " + JSON.stringify(data.input), function (assert) {
				var done = assert.async();

				oControl.isInitialised.returns(true);
				oControl.getSmartVariant.returns(null);
				oControl.getUseVariantManagement.returns(true);
				oControl.getVariantManagement.returns("oVariantManagementControl");

				var oWrapper = getWrapper();
				oWrapper.setState(data.input);

				setTimeout(function () {
					assert.ok(oFactory.oVariantManagementStateWrapper.setState.calledOnce, "oVariantManagementStateWrapper.setState was called ");
					assert.ok(oFactory.oVariantManagementStateWrapper.setState.firstCall.calledWithExactly(data.input && data.output ? Object.assign({}, data.input, data.output):data.output), "oVariantManagementStateWrapper.setState was called with correct data");
					done();
				});
			});
		});



		function getControl() {
			return {
				getUiState: sinon.stub(),
				setUiState: sinon.stub(),
				setCurrentVariantId: sinon.stub(),
				attachUiStateChange: sinon.stub(),
				getId: sinon.stub(),
				isInitialised: sinon.stub(),
				attachEvent: sinon.stub(),
				getSmartVariant: sinon.stub(),
				getUseVariantManagement: sinon.stub(),
				getVariantManagement: sinon.stub(),
				attachAfterVariantInitialise: sinon.stub(),
			};
		}

		function getController() {
			var oView = getView();
			return {
				oView: oView,
				getView: sinon.stub().returns(oView),
			};
		}

		function getView() {
			return {
				getLocalId: sinon.stub().returns("localId"),
			};
		}

		function getFactory() {
			var oVariantManagementStateWrapper = getVariantManagementStateWrapper();
			return {
				oVariantManagementStateWrapper: oVariantManagementStateWrapper,
				getControlStateWrapper: sinon.stub().returns(oVariantManagementStateWrapper),
			};
		}

		function getVariantManagementStateWrapper() {
			return {
				attachStateChanged: sinon.stub(),
				setState: sinon.stub(),
				getState: sinon.stub(),
			};
		}

		function getWrapper() {
			return new SmartTableChartCommon(oControl, oController, oFactory, sInitializationEvent);
		}
});
