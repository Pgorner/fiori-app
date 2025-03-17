/**
 * tests for the sap.suite.ui.generic.template.lib.multipleViews.MultipleTablesModeHelper.js
 */

sap.ui.define(
	[
		"testUtils/sinonEnhanced",
		"sap/suite/ui/generic/template/lib/multipleViews/MultipleTablesModeHelper",
	],
	function (
		sinon,
		MultipleTablesModeHelper
	) {
		"use strict";

		function getController() {
			var oInternalModel = {
				getOwnerComponent: {
					getEntitySet: sinon
						.stub()
						.returns(
							"oController.getOwnerComponent().getEntitySet()"
						),
				},
			};
			return {
				oInternalModel,
				getOwnerComponent: sinon
					.stub()
					.returns(oInternalModel.getOwnerComponent),
				byId: sinon.stub().returns("oController.byId"),
			};
		}

		function getTemplateUtils() {
			var oInternalModel = {
				oTemplatePrivateModel: {
					setProperty: sinon.stub(),
				},
			};
			var fnGetControlStateWrapper = function() {
				return {
					attachStateChanged: sinon.stub(),
						setState: sinon.stub(),
						getLocalId: sinon
							.stub()
							.returns(
								"oCommonUtils.getControlStateWrapper.getLocalId"
							),
				}
			}
			var oStubs = {
				oInternalModel,
				oComponentUtils: {
					getTemplatePrivateModel: sinon
						.stub()
						.returns(oInternalModel.oTemplatePrivateModel),
				},
				oCommonUtils: {
					getMetaModelEntityType: sinon.stub().returns({
						property:
							"oTemplateUtils.oCommonUtils.getMetaModelEntityType.property",
					}),
					getControlStateWrapper: sinon.stub()
				},
			};
			oStubs.oCommonUtils.getControlStateWrapper.onFirstCall().returns(fnGetControlStateWrapper()); // Return on first call
			oStubs.oCommonUtils.getControlStateWrapper.returns(fnGetControlStateWrapper()); // Default
			return oStubs;
		}

		function getConfiguration() {
			return {
				pathInTemplatePrivateModel:
					"getConfiguration.pathInTemplatePrivateModel",
				appStateChange: "getConfiguration.appStateChange",
			};
		}

		function getViewMeta() {
			return {
				presentationControlHandler: {
					getEntitySet: sinon
						.stub()
						.returns(
							"oViewMeta.presentationControlHandler.getEntitySet()"
						),
				},
				switchingKey: "oViewMeta.switchingKey",
			};
		}

		var oController, oTemplateUtils, oConfiguration, oMultipleTablesModeHelper;

		QUnit.module("MultipleTablesModeHelper", {
			beforeEach: function () {
				oController = getController();
				oTemplateUtils = getTemplateUtils();
				oConfiguration = getConfiguration();
				oMultipleTablesModeHelper = new MultipleTablesModeHelper(
					oController,
					oTemplateUtils,
					oConfiguration
				);
			},
			afterEach: function () {
				sinon.restore();
			},
		});

		QUnit.test("initialization", function (assert) {
			// prepare
			var mSwitchingKeyToViewMetaTmp = {
					key01: getViewMeta(),
				},
				fnRefreshOperation = sinon.stub();
			
			// assert
			assert.ok(oTemplateUtils.oComponentUtils.getTemplatePrivateModel.calledOnce, "oTemplateUtils.oComponentUtils.getTemplatePrivateModel has been called");
			assert.ok(oTemplateUtils.oInternalModel.oTemplatePrivateModel.setProperty.calledOnce, "oTemplatePrivateModel.setProperty has been called");
			assert.ok(oTemplateUtils.oInternalModel.oTemplatePrivateModel.setProperty.calledWithExactly(oConfiguration.pathInTemplatePrivateModel + "/implementingHelper", {ignoredFilters: []}), "oTemplatePrivateModel.setProperty has been called with correct parameters");
			assert.ok(oController.getOwnerComponent().getEntitySet.calledOnce, "oController.getOwnerComponent().getEntitySet() has been called");
			assert.ok(oTemplateUtils.oCommonUtils.getMetaModelEntityType.calledOnce, "oTemplateUtils.oCommonUtils.getMetaModelEntityType() has been called");
			assert.ok(oTemplateUtils.oCommonUtils.getMetaModelEntityType.firstCall.calledWithExactly("oController.getOwnerComponent().getEntitySet()"), "oTemplateUtils.oCommonUtils.getMetaModelEntityType() has been called with correct parameters");
			
			// act
			oMultipleTablesModeHelper.init(mSwitchingKeyToViewMetaTmp, fnRefreshOperation);
			
			// assert
			assert.ok(oTemplateUtils.oCommonUtils.getMetaModelEntityType.calledTwice, "oTemplateUtils.oCommonUtils.getMetaModelEntityType() has been called twice");
			assert.ok(oTemplateUtils.oCommonUtils.getMetaModelEntityType.secondCall.calledWithExactly("oViewMeta.presentationControlHandler.getEntitySet()"), "oTemplateUtils.oCommonUtils.getMetaModelEntityType() has been called second time with correct parameters");

			assert.ok(oTemplateUtils.oCommonUtils.getControlStateWrapper.calledTwice, "oTemplateUtils.oCommonUtils.getControlStateWrapper() has been called twice");
			assert.ok(oTemplateUtils.oCommonUtils.getControlStateWrapper.firstCall.calledWithExactly("oController.byId"), "oTemplateUtils.oCommonUtils.getControlStateWrapper() has been called first time with correct parameters");
			assert.ok(oTemplateUtils.oCommonUtils.getControlStateWrapper.secondCall.calledWithExactly("oController.byId"), "oTemplateUtils.oCommonUtils.getControlStateWrapper() has been called second time with correct parameters");

			assert.ok(oController.byId.calledTwice, "oController.byId() has been called twice");
			assert.ok(oController.byId.firstCall.calledWithExactly("listReport-oViewMeta.switchingKey"), "oController.byId() has been called first time with correct parameters");
			assert.ok(oController.byId.secondCall.calledWithExactly("Table::Toolbar::SearchField-oViewMeta.switchingKey"), "oController.byId() has been called second time with correct parameters");

			assert.ok(mSwitchingKeyToViewMetaTmp.key01.implementingHelperAttributes.entityTypeProperty === "oTemplateUtils.oCommonUtils.getMetaModelEntityType.property", "oViewMeta.implementingHelperAttributes.entityTypeProperty is correct");
			assert.ok(mSwitchingKeyToViewMetaTmp.key01.implementingHelperAttributes.dirtyState === 0, "oViewMeta.implementingHelperAttributes.dirtyState is correct");

			assert.ok(mSwitchingKeyToViewMetaTmp.key01.implementingHelperAttributes.controlStateWrapper.attachStateChanged.calledOnce, "oViewMeta.implementingHelperAttributes.controlStateWrapper.attachStateChanged have been called");
			assert.ok(mSwitchingKeyToViewMetaTmp.key01.implementingHelperAttributes.searchFieldWrapper.attachStateChanged.calledOnce, "oViewMeta.implementingHelperAttributes.searchFieldWrapper.attachStateChanged have been called");
			assert.ok(mSwitchingKeyToViewMetaTmp.key01.implementingHelperAttributes.controlStateWrapper.attachStateChanged.firstCall.calledWithExactly("getConfiguration.appStateChange"), "oViewMeta.implementingHelperAttributes.controlStateWrapper.attachStateChanged() has been called with correct parameters");
			assert.ok(mSwitchingKeyToViewMetaTmp.key01.implementingHelperAttributes.searchFieldWrapper.attachStateChanged.firstCall.calledWithExactly("getConfiguration.appStateChange"), "oViewMeta.implementingHelperAttributes.searchFieldWrapper.attachStateChanged() has been called with correct parameters");

			assert.ok(fnRefreshOperation.notCalled, "fnRefreshOperation not have been called")
		});

		QUnit.test("getGeneralContentStateWrapper bVMConnection", function(assert) {
			var mSwitchingKeyToViewMetaTmp = {
				key01: getViewMeta()
			};

			var fnRefreshOperation = sinon.stub();
			oMultipleTablesModeHelper.init(mSwitchingKeyToViewMetaTmp, fnRefreshOperation);

			var oGeneralContentStateWrapper = oMultipleTablesModeHelper.getGeneralContentStateWrapper();
			assert.ok(oGeneralContentStateWrapper.bVMConnection, "bVMConnection of the oMultipleViewsGeneralContentStateWrapper should be true");
		});

		[
			{
				oState: undefined,
			},
			{
				oState: {},
			},
		].forEach(function(entry) {
			QUnit.test(`getGeneralContentStateWrapper, setState(${JSON.stringify(entry.oState)})`, function(assert) {
				// prepare
				var mSwitchingKeyToViewMetaTmp = {
					key01: getViewMeta(),
				},
				fnRefreshOperation = sinon.stub();
				oMultipleTablesModeHelper.init(mSwitchingKeyToViewMetaTmp, fnRefreshOperation);
	
				// act
				var oGeneralContentStateWrapper = oMultipleTablesModeHelper.getGeneralContentStateWrapper();
				oGeneralContentStateWrapper.setState(entry.oState);
	
				// assert
				assert.ok(mSwitchingKeyToViewMetaTmp.key01.implementingHelperAttributes.controlStateWrapper.setState.notCalled, "oViewMeta.implementingHelperAttributes.controlStateWrapper.setState not have been called");
			});
		});

		QUnit.test("getGeneralContentStateWrapper, setState({controlStates: {some valid data}})", function(assert) {
			// prepare
			var mSwitchingKeyToViewMetaTmp = {
				key01: getViewMeta(),
			},
			fnRefreshOperation = sinon.stub();
			oMultipleTablesModeHelper.init(mSwitchingKeyToViewMetaTmp, fnRefreshOperation);

			// act
			var oGeneralContentStateWrapper = oMultipleTablesModeHelper.getGeneralContentStateWrapper();
			oGeneralContentStateWrapper.setState({
				controlStates: {
					"oCommonUtils.getControlStateWrapper.getLocalId": "oState.controlStates.view-state-data"
				}
			});

			// assert
			assert.ok(mSwitchingKeyToViewMetaTmp.key01.implementingHelperAttributes.controlStateWrapper.setState.calledOnce, "oViewMeta.implementingHelperAttributes.controlStateWrapper.setState have been called");
			assert.ok(mSwitchingKeyToViewMetaTmp.key01.implementingHelperAttributes.controlStateWrapper.setState.firstCall.calledWithExactly("oState.controlStates.view-state-data"), "oViewMeta.implementingHelperAttributes.controlStateWrapper.setState have been called with correct parameter");
			assert.ok(mSwitchingKeyToViewMetaTmp.key01.implementingHelperAttributes.controlStateWrapper.getLocalId.calledOnce, "oViewMeta.implementingHelperAttributes.controlStateWrapper.getLocalId have been called");
			
			assert.ok(mSwitchingKeyToViewMetaTmp.key01.implementingHelperAttributes.searchFieldWrapper.setState.calledOnce, "oViewMeta.implementingHelperAttributes.searchFieldWrapper.setState have been called");
			assert.ok(mSwitchingKeyToViewMetaTmp.key01.implementingHelperAttributes.searchFieldWrapper.setState.firstCall.calledWithExactly("oState.controlStates.view-state-data"), "oViewMeta.implementingHelperAttributes.searchFieldWrapper.setState have been called with correct parameter");
			assert.ok(mSwitchingKeyToViewMetaTmp.key01.implementingHelperAttributes.searchFieldWrapper.getLocalId.calledOnce, "oViewMeta.implementingHelperAttributes.searchFieldWrapper.getLocalId have been called");
		});
	}
);
