/*global QUnit, sinon */
sap.ui.define([
	"sap/ui/generic/app/util/ActionUtil",
	"sap/m/MessageBox",
	"sap/m/Dialog",
	"sap/ui/generic/app/util/ModelUtil",
	"sap/base/util/deepEqual",
	"sap/m/Button"
], function(ActionUtil, MessageBox, Dialog, ModelUtil, deepEqual, Button) {
	"use strict";

	var oFunctionImport,
	aSelectedContexts,
	oEntitySet,
	oEntityType,
	oView,
	oController,
	oOwnerComponent,
	oComponent,
	oTransactionController,
	oApplicationController,
	oModel,
	oMetaMOdel,
	oActionUtil,
	oResourceBundle,
	mContextIndependentParameterData = {};
	QUnit.module("sap.ui.generic.app.util.ActionUtil", {
		beforeEach: function () {
			oFunctionImport = {
				"entitySet": "Dummy",
				"extensions": [],
				"httpMethod": "GET",
				"name": "DummyAction",
				"returnType": "",
				"sap:action-for": "Dummy",
				"sap:applicable-path": "",
				"parameter": [
					{
						"name": "Key1",
						"type": "Edm.String",
						"mode": "In",
						"nullable": "true"
					},
					{
						"name": "Key2",
						"type": "Edm.String",
						"mode": "In",
						"nullable": "true"
					},
					{
						"name": "Optional1",
						"type": "Edm.String",
						"mode": "In",
						"nullable": "true"
					},
					{
						"name": "Optional2",
						"type": "Edm.Boolean",
						"mode": "In",
						"nullable": "true"
					},
					{
						"name": "Optional3",
						"type": "Edm.String",
						"mode": "In",
						"nullable": "true"
					},
					{
						"name": "Optional4",
						"type": "Edm.Boolean",
						"mode": "Out",
						"nullable": "true"
					},
					{
						"name": "Optional5",
						"type": "Edm.String",
						"mode": "Out",
						"nullable": "true"
					}

				]
			};
			aSelectedContexts = [
				{
					getObject: function () {
						return {
							hasOwnProperty: function (sKey) {
								return sKey === "Key1" || sKey === "Key2";
							},
							"Key1": "1",
							"Key2": "true"
						};
					},
					getModel: function() {
						return {
							getMetaModel: function () {
								return {
									getODataEntitySet: function() {
										return oEntitySet;
									},
									getODataEntityType: function () {
										return oEntityType;
									}
								};
							}
						};
					}
				},
				{
					getObject: function () {
						return {
							hasOwnProperty: function (sKey) {
								return sKey === "Key1" || sKey === "Key2";
							},
							"Key1": "2",
							"Key2": "false"
						};
					}
				},
				{
					getObject: function () {
						return {
							hasOwnProperty: function (sKey) {
								return sKey === "Key1" || sKey === "Key2";
							},
							"Key1": "3",
							"Key2": "true"
						};
					}
				}
			];
			ModelUtil.getEntityTypeFromContext = sinon.stub().returns(oEntityType);
			oEntitySet = {
				entitySet: "Dummy"
			};
			oEntityType = {
				key: {
					propertyRef: [
						{
							name: "Key1"
						},
						{
							name: "Key2"
						}
					]
				}
			};
			oMetaMOdel = {
				getODataFunctionImport: sinon.stub().returns(oFunctionImport),
				getODataEntitySet: sinon.stub().returns(oEntitySet),
				getODataEntityType: sinon.stub().returns(oEntityType),
				getODataProperty: sinon.stub().returns(undefined)
			};
			oModel = {	
				getMetaModel: sinon.stub().returns(oMetaMOdel)
			};
			oView = {
				getModel: sinon.stub().returns(oModel),
				$: sinon.stub().returns({
					closest: sinon.stub().returns([])
				})
			};
			oTransactionController = {
				getDefaultValues: sinon.stub().returns(mContextIndependentParameterData)
			};
			oApplicationController = {
				getTransactionController: sinon.stub().returns(oTransactionController)
			};
			oComponent = {};
			oResourceBundle = {
				hasText: sinon.stub().returns(true),
				getText: sinon.stub().returns("Test Action - Confirmation Message")
			};
			oOwnerComponent = {	
				getAppComponent: sinon.stub().returns({	
					getModel: sinon.stub().returns({
						getResourceBundle: sinon.stub().returns(oResourceBundle)
					})
				})
			};
			oController = {
				getComponent: sinon.stub().returns(oComponent),
				getOwnerComponent: sinon.stub().returns(oOwnerComponent),
				getApplicationController: sinon.stub().returns(oApplicationController),
				getView: sinon.stub().returns(oView),
				handleSuccess: sinon.stub(),
				_getCompactModeStyleClass: sinon.stub()
			};

			oActionUtil = new ActionUtil({
				controller: oController,
				applicationController: oApplicationController,
				contexts: aSelectedContexts,
				functionImport: oFunctionImport,
				actionLabel: "Test Action",
				isDraftEnabled: true,
				contextIndependentParameterData: mContextIndependentParameterData
			});

			oActionUtil.setEntityType = sinon.stub();
			oActionUtil.getEntityType = sinon.stub().returns(oEntityType);
			oActionUtil.getIsBoundAction = sinon.stub().returns(true);
		}
	});

	QUnit.test("Shall be instantiable", function (assert) {
		assert.ok(oActionUtil);
	});

	QUnit.test("Call function should throw an error in case of missing FunctionImport", function (assert) {
		// Prepare
		var done = assert.async();
		var oActionUtil1 = new ActionUtil();

		// Act
		var oReturnPromise = oActionUtil1.call(true);

		oReturnPromise.catch(function(oError) {
			// Assert
			assert.ok(oError, "Call function should throw an error in case of missing FunctionImport details");

			done();
		});
	});

	QUnit.test("Confirmation dialog should be shown for critical actions", function (assert) {
		// Prepare test data
		var done = assert.async();
		oFunctionImport["com.sap.vocabularies.Common.v1.IsActionCritical"] = true;
		var oMessageBoxConfirmStub = sinon.stub(MessageBox, "confirm", function(sMessage, mParameters) {
			mParameters.onClose("OK");
		});
		var _prepareParamsAndInvokeActionStub = sinon.stub(oActionUtil, "_prepareParamsAndInvokeAction", function() {
			return oActionUtil._callMethodPromise.resolve();
		});

		// Call function
		oActionUtil.call(true).then(function() {
			// Assert
			assert.ok(deepEqual(oActionUtil.setEntityType.args[0][0], oEntityType), "In case of a bound action, EntityType retrieved from the context needs should be set to ActionUtil");
			assert.ok(oMessageBoxConfirmStub.calledOnce, "Confirmation Message Box has to be called for critical action");
			assert.equal(oMessageBoxConfirmStub.args[0][0], "Test Action - Confirmation Message", "Confirmation Message Box has to be called with action label");
			assert.equal((oMessageBoxConfirmStub.args[0][1])["title"], "Test Action", "Confirmation Message Box has to be called with action label");
			assert.ok(_prepareParamsAndInvokeActionStub.calledOnce, "_prepareParamsAndInvokeAction has to be called after confirmation");
			
			// Clean up
			oMessageBoxConfirmStub.restore();
			_prepareParamsAndInvokeActionStub.restore();

			done();
		});
	});

	QUnit.test("Confirmation dialog should not be shown for non-critical actions", function (assert) {
		// Prepare test data
		var done = assert.async();
		var oMessageBoxConfirmStub = sinon.stub(MessageBox, "confirm", function(sMessage, mParameters) {
			mParameters.onClose("OK");
		});
		var _prepareParamsAndInvokeActionStub = sinon.stub(oActionUtil, "_prepareParamsAndInvokeAction", function() {
			return oActionUtil._callMethodPromise.resolve();
		});

		// Call function
		oActionUtil.call(true).then(function() {
			// Assert
			assert.ok(deepEqual(oActionUtil.setEntityType.args[0][0], oEntityType), "In case of a bound action, EntityType retrieved from the context needs should be set to ActionUtil");
			assert.equal(oMessageBoxConfirmStub.callCount, 0, "Confirmation Message Box should not to be called action is not annotated as critical");
			assert.ok(_prepareParamsAndInvokeActionStub.calledOnce, "_prepareParamsAndInvokeAction has to be called after confirmation");

			// Clean up
			oMessageBoxConfirmStub.restore();
			_prepareParamsAndInvokeActionStub.restore();

			done();
		});
	});

	QUnit.test("Canceling confirmation, call method should reject execution", function (assert) {
		// Prepare test data
		var done = assert.async();
		oFunctionImport["com.sap.vocabularies.Common.v1.IsActionCritical"] = true;
		var oMessageBoxConfirmStub = sinon.stub(MessageBox, "confirm", function(sMessage, mParameters) {
			mParameters.onClose("CANCEL");
		});

		// Call function
		oActionUtil.call(true).catch(function(oError) {
			// Assert
			assert.ok(oError, "Call function reject the promise in case of user cancel the confirmation dialog");

			// Clean up
			oMessageBoxConfirmStub.restore();

			done();
		});
	});

	QUnit.test("Test prepareParameters method and ensure correct values are set - with ContextIndependentParameters", function (assert) {
		// Prepare test data
		var done = assert.async();
		mContextIndependentParameterData = {
			"Optional1": "Op1",
			"Optional2": "Op2",
			"Optional3": "Op3"
		};
		oTransactionController.getDefaultValues.returns(Promise.resolve({
			"Optional1": "Op1",
			"Optional3": "Op5",
			"Optional2": "Op4"
		}));
		sinon.stub(oActionUtil, "_checkAndUpdateLabelAnnotation");
		oActionUtil.setContextIndependentParameterData = sinon.stub();

		// Call function
		oActionUtil._prepareParameters().then(function(oActionParamInfo) {
			// Assert
			assert.equal(oActionUtil.setContextIndependentParameterData.args[0][0]["Optional3"], "Op5", "Context independent parameter data should be overridden by the default values");
			assert.equal(oActionUtil.setContextIndependentParameterData.args[0][0]["Optional2"], "Op4", "Context independent parameter data should be overridden by the default values");
			assert.equal(oActionUtil.setContextIndependentParameterData.args[0][0]["Optional1"], "Op1", "Context independent parameter data should be carry forwarded in case of missing default value");
			done();
		});
	});

	QUnit.test("Test prepareParameters method and ensure correct values are set", function (assert) {
		// Prepare test data
		var done = assert.async();
		var _checkAndUpdateLabelAnnotationStub = sinon.stub(oActionUtil, "_checkAndUpdateLabelAnnotation");
		oActionUtil.setContextIndependentParameterData = sinon.stub();

		// Call function
		oActionUtil._prepareParameters().then(function(oActionParamInfo) {
			// Assert
			assert.ok(oTransactionController.getDefaultValues.calledOnce, "Default Values should be fetched for action parameters");
			assert.ok(!oActionUtil.setContextIndependentParameterData.calledOnce, "Context independent parameter data should be set");
			assert.equal(oTransactionController.getDefaultValues.args[0][0], aSelectedContexts, "Selected contexts should be passed to fetch default values");
			assert.equal(oTransactionController.getDefaultValues.args[0][1], mContextIndependentParameterData, "Context independent parameters should be passed to fetch default values");
			assert.equal(oTransactionController.getDefaultValues.args[0][3], oFunctionImport.name, "Function Import name should be passed to fetch default values");
			assert.equal(_checkAndUpdateLabelAnnotationStub.callCount, 7, "_checkAndUpdateLabelAnnotation for each property of action parameters");
			assert.equal(Object.keys(oActionParamInfo.inParameters).length, 5, "Action parameter of type 'In' should be returned");
			assert.equal(oActionParamInfo.contextSpecificParameterData.length, 3, "Action parameter information should be returned");
			assert.equal(oActionParamInfo.contextSpecificParameterData[0]["Key1"], "1", "First context Key1 should have value 1");
			assert.equal(oActionParamInfo.contextSpecificParameterData[0]["Key2"], "true", "First context Key2 should have value true");
			assert.equal(oActionParamInfo.contextSpecificParameterData[1]["Key1"], 2, "Second context Key1 should have value 2");
			assert.equal(oActionParamInfo.contextSpecificParameterData[1]["Key2"], "false", "Second context Key2 should have value false");
			assert.equal(oActionParamInfo.contextSpecificParameterData[2]["Key1"], 3, "Third context Key1 should have value 3");
			assert.equal(oActionParamInfo.contextSpecificParameterData[2]["Key2"], "true", "Third context Key1 should have value 3");
			done();
		});
	});

	QUnit.test("Test _initiateCall with empty inParameters & strict mode to true", function (assert) {
		// Prepare test data
		var oActionParamInfo = {
			inParameters: {},
			contextSpecificParameterData: []
		};
		var _callStub = sinon.stub(oActionUtil, "_call");
		oActionUtil.getContextIndependentParameterData = sinon.stub().returns(mContextIndependentParameterData);
		oActionUtil.getIsDraftEnabled = sinon.stub().returns(true);

		// Call function
		oActionUtil._initiateCall(oActionParamInfo, true);

		// Assert
		assert.ok(_callStub.calledOnce, "Call method should be called as there are no in parameters for the action");
		assert.equal(_callStub.args[0][0], mContextIndependentParameterData, "Context independent parameter data should be passed to call method");
		assert.equal(_callStub.args[0][1], true, "Draft enabled flag should be passed to call method");
		assert.equal(_callStub.args[0][2]["Prefer"], "handling=strict", "Header should be set to strict handling");

	});

	QUnit.test("Test _initiateCall with empty inParameters & lenient mode to true", function (assert) {
		// Prepare test data
		var oActionParamInfo = {
			inParameters: {},
			contextSpecificParameterData: []
		};
		var _callStub = sinon.stub(oActionUtil, "_call");
		oActionUtil.getContextIndependentParameterData = sinon.stub().returns(mContextIndependentParameterData);
		oActionUtil.getIsDraftEnabled = sinon.stub().returns(false);

		// Call function
		oActionUtil._initiateCall(oActionParamInfo, false);

		// Assert
		assert.ok(_callStub.calledOnce, "Call method should be called as there are no in parameters for the action");
		assert.equal(_callStub.args[0][0], mContextIndependentParameterData, "Context independent parameter data should be passed to call method");
		assert.equal(_callStub.args[0][1], false, "Draft enabled flag should be passed to call method");
		assert.equal(_callStub.args[0][2]["Prefer"], "handling=lenient", "Header should be set to lenient handling");

	});

	QUnit.test("Test _initiateCall with non-empty inParameters", function (assert) {
		// Prepare test data
		var oActionParamInfo = {
			inParameters: {
				"Optional1": {
					metadata: {
						name: "Optional1"
					}
				},
				"Optional2": {
					metadata: {
						name: "Optional2"
					}
				}
			},
			contextSpecificParameterData: []
		};
		var _callStub = sinon.stub(oActionUtil, "_call");
		oActionUtil["sap:action-for"] = undefined;
		oActionUtil.getContextIndependentParameterData = sinon.stub().returns(mContextIndependentParameterData);
		oActionUtil.getIsDraftEnabled = sinon.stub().returns(false);
		oActionUtil.getIsCreateAction = sinon.stub().returns(true);
		oActionUtil.getIsBoundAction = sinon.stub().returns(false);

		// Call function
		oActionUtil._initiateCall(oActionParamInfo, false);

		// Assert
		assert.equal(oActionUtil.setEntityType.callCount, 0, "In case of unbound action, EntityType should not be set to ActionUtil");
		assert.ok(_callStub.calledOnce, "Call method should be called as there are no in parameters for the action");
		assert.equal(_callStub.args[0][0], mContextIndependentParameterData, "Context independent parameter data should be passed to call method");
		assert.equal(_callStub.args[0][1], false, "Draft enabled flag should be passed to call method");
		assert.equal(_callStub.args[0][2]["Prefer"], "handling=lenient", "Header should be set to lenient handling");

	});

	QUnit.test("Test _initiateCall with inParameters & lenient mode to false. Parameters dialog should not shown", function (assert) {
		// Prepare test data
		var done = assert.async();
		var oActionParamInfo = {
			inParameters: {
				"Key1": {
					metadata: {
						name: "Key1"
					},
					isKey: true
				},
				"Key2": {
					metadata: {
						name: "Key2"
					},
					isKey: true
				},
				"Optional1": {
					metadata: {
						name: "Optional1"
					}
				},
				"Optional2": {
					metadata: {
						name: "Optional2"
					}
				}
			},
			contextSpecificParameterData: [
				{
					"Key1": "1",
					"Key2": "true"
				},
				{
					"Key1": "2",
					"Key2": "false"
				},
				{
					"Key1": "3",
					"Key2": "true"
				}
			],
			hasParametersRequiringUserInput: true
		};
		var oActionModel1 = {
			setProperty: sinon.stub()
		};
		var oActionContext1 = {
			getModel: sinon.stub().returns(oActionModel1)
		};
		var oActionModel2 = {
			setProperty: sinon.stub()
		};
		var oActionContext2 = {
			getModel: sinon.stub().returns(oActionModel2)
		};
		var oActionModel3 = {
			setProperty: sinon.stub()
		};
		var oActionContext3 = {
			getModel: sinon.stub().returns(oActionModel3)
		};

		oApplicationController.synchronizeDraftAsync = sinon.stub().returns(Promise.resolve());
		oApplicationController._getChangeSetFunc = sinon.stub();
		oApplicationController._getChangeSetFunc.func = function() {
			return function(index) {
				return "ActionChangeSet" + index;
			};
		};
		oApplicationController.getNewActionContext = sinon.stub();
		oApplicationController.getNewActionContext.func = function(sFunctionImportName, oContext) {
			var oContextObject = oContext.getObject();
			if (oContextObject["Key1"] === "1") {
				return {
					context: Promise.resolve(oActionContext1)
				};
			} else if (oContextObject["Key1"] === "2") {
				return {
					context: Promise.resolve(oActionContext2)
				};
			}

			return {
				context: Promise.resolve(oActionContext3)
			};
		};
		oActionUtil._triggerActionPromise = sinon.stub();
		oActionUtil._triggerActionPromise.func = function() {
			oActionUtil._callMethodPromise.resolve();
		};
		
		var oCallMethodPromise = new Promise(function(resolve, reject) {
			oActionUtil._callMethodPromise = {
				resolve: resolve,
				reject: reject
			};
		});

		// Call function
		oActionUtil._initiateCall(oActionParamInfo, false);

		oCallMethodPromise.then(function() {
			// Assert
			assert.equal(oActionModel1.setProperty.args[0][0], "Key1", "Parameter name 'Key1' should be set in model");
			assert.equal(oActionModel1.setProperty.args[0][1], "1", "Parameter value '1' should be set in model");
			assert.equal(oActionModel1.setProperty.args[1][0], "Key2", "Parameter name 'Key2' should be set in model");
			assert.equal(oActionModel1.setProperty.args[1][1], "true", "Parameter value 'true' should be set in model");
			assert.equal(oActionModel2.setProperty.args[0][0], "Key1", "Parameter name 'Key1' should be set in model");
			assert.equal(oActionModel2.setProperty.args[0][1], "2", "Parameter value '1' should be set in model");
			assert.equal(oActionModel2.setProperty.args[1][0], "Key2", "Parameter name 'Key2' should be set in model");
			assert.equal(oActionModel2.setProperty.args[1][1], "false", "Parameter value 'false' should be set in model");
			assert.equal(oActionModel3.setProperty.args[0][0], "Key1", "Parameter name 'Key1' should be set in model");
			assert.equal(oActionModel3.setProperty.args[0][1], "3", "Parameter value '1' should be set in model");
			assert.equal(oActionModel3.setProperty.args[1][0], "Key2", "Parameter name 'Key3' should be set in model");
			assert.equal(oActionModel3.setProperty.args[1][1], "true", "Parameter value 'true' should be set in model");

			done();
		});
	});

	QUnit.test("Test _initiateCall with inParameters & in strict mode. Parameter dialog should display all non-key parameters", function (assert) {
		// Prepare test data
		var done = assert.async();
		var oActionParamInfo = {
			inParameters: {
				"Key1": {
					metadata: {
						name: "Key1"
					},
					isKey: true
				},
				"Key2": {
					metadata: {
						name: "Key2"
					},
					isKey: true
				},
				"Optional1": {
					metadata: {
						name: "Optional1"
					}
				},
				"Optional2": {
					metadata: {
						name: "Optional2"
					}
				}
			},
			contextSpecificParameterData: [
				{
					"Key1": "1",
					"Key2": "true"
				},
				{
					"Key1": "2",
					"Key2": "false"
				},
				{
					"Key1": "3",
					"Key2": "true"
				}
			],
			hasParametersRequiringUserInput: true
		};
		var oActionModel = {
			setProperty: sinon.stub()
		};
		var oActionContext1 = {
			getModel: sinon.stub().returns(oActionModel)
		};
		var oActionContext2 = {
			getModel: sinon.stub().returns(oActionModel)
		};

		oApplicationController.synchronizeDraftAsync = sinon.stub().returns(Promise.resolve());
		oApplicationController._getChangeSetFunc = sinon.stub();
		oApplicationController._getChangeSetFunc.func = function() {
			return function(index) {
				return "ActionChangeSet" + index;
			};
		};
		oApplicationController.getNewActionContext = sinon.stub();
		oApplicationController.getNewActionContext.func = function(sFunctionImportName, oContext) {
			var oContextObject = oContext.getObject();
			if (oContextObject["Key1"] === "1") {
				return {
					context: Promise.resolve(oActionContext1)
				};
			}

			return {
				context: Promise.resolve(oActionContext2)
			};
		};
		oActionUtil._triggerActionPromise = sinon.stub();
		oActionUtil._triggerActionPromise.func = function() {
			oActionUtil._callMethodPromise.resolve();
		};
		
		var oCallMethodPromise = new Promise(function(resolve, reject) {
			oActionUtil._callMethodPromise = {
				resolve: resolve,
				reject: reject
			};
		});

		oActionUtil.setActionButtonText("Custom Action Button Text");
		var oButtonSetTextStub = sinon.stub(Button.prototype, "setText");

		var oBeginButton;
		var oDialogSetBeginButtonStub = sinon.stub(Dialog.prototype, "setBeginButton", function(oButton) {
			oBeginButton = oButton;
		});
		var oDialogOpenStub = sinon.stub(Dialog.prototype, "open", function() {
			oBeginButton.firePress();
		});
		var oDialogSetTitle = sinon.stub(Dialog.prototype, "setTitle");
		var oAddContentSpy = sinon.spy(Dialog.prototype, "addContent");

		// Call function
		oActionUtil._initiateCall(oActionParamInfo, true);

		oCallMethodPromise.then(function() {
			// Assert
			assert.ok(oDialogOpenStub.calledOnce, "When a non-create action is executed in strict mode & all non-key parameters should be shown in dialog");
			assert.ok(oDialogSetTitle.calledOnce, "Dialog title should be set");
			assert.equal(oDialogSetTitle.args[0][0], "Test Action", "Dialog title should be set to action label");
			assert.equal(oButtonSetTextStub.args[0][0], "Custom Action Button Text", "Action Button Text should be set instead of Action Title");
			assert.ok(oAddContentSpy.getCall(0).args[0] instanceof sap.ui.comp.smartform.SmartForm, "Dialog should contain SmartForm");
			assert.equal(oAddContentSpy.getCall(0).args[0].getVisibleProperties().length, 2, "Dialog should have both non-key properties");
			assert.equal(oAddContentSpy.getCall(0).args[0].getVisibleProperties()[0], "Optional1", "First property should be Optional1");
			assert.equal(oAddContentSpy.getCall(0).args[0].getVisibleProperties()[1], "Optional2", "Second property should be Optional2");
			done();

			// Clean up
			oDialogSetBeginButtonStub.restore();
			oButtonSetTextStub.restore();
			oDialogOpenStub.restore();
			oDialogSetTitle.restore();
			oAddContentSpy.restore();
		});
	});

	QUnit.test("Test _initiateCall with inParameters & in strict mode. Parameter dialog should display, action button & dialog title should be same", function (assert) {
		// Prepare test data
		var done = assert.async();
		var oActionParamInfo = {
			inParameters: {
				"Key1": {
					metadata: {
						name: "Key1"
					},
					isKey: true
				},
				"Key2": {
					metadata: {
						name: "Key2"
					},
					isKey: true
				},
				"Optional1": {
					metadata: {
						name: "Optional4"
					}
				},
				"Optional2": {
					metadata: {
						name: "Optional5"
					}
				}
			},
			contextSpecificParameterData: [
				{
					"Key1": "1",
					"Key2": "true"
				},
				{
					"Key1": "2",
					"Key2": "false"
				},
				{
					"Key1": "3",
					"Key2": "true"
				}
			],
			hasParametersRequiringUserInput: true
		};
		var oActionModel = {
			setProperty: sinon.stub()
		};
		var oActionContext1 = {
			getModel: sinon.stub().returns(oActionModel)
		};
		var oActionContext2 = {
			getModel: sinon.stub().returns(oActionModel)
		};

		oApplicationController.synchronizeDraftAsync = sinon.stub().returns(Promise.resolve());
		oApplicationController._getChangeSetFunc = sinon.stub();
		oApplicationController._getChangeSetFunc.func = function() {
			return function(index) {
				return "ActionChangeSet" + index;
			};
		};
		oApplicationController.getNewActionContext = sinon.stub();
		oApplicationController.getNewActionContext.func = function(sFunctionImportName, oContext) {
			var oContextObject = oContext.getObject();
			if (oContextObject["Key1"] === "1") {
				return {
					context: Promise.resolve(oActionContext1)
				};
			}

			return {
				context: Promise.resolve(oActionContext2)
			};
		};
		oActionUtil._triggerActionPromise = sinon.stub();
		oActionUtil._triggerActionPromise.func = function() {
			oActionUtil._callMethodPromise.resolve();
		};
		
		var oCallMethodPromise = new Promise(function(resolve, reject) {
			oActionUtil._callMethodPromise = {
				resolve: resolve,
				reject: reject
			};
		});

		var oButtonSetTextStub = sinon.stub(Button.prototype, "setText");

		var oBeginButton;
		var oDialogSetBeginButtonStub = sinon.stub(Dialog.prototype, "setBeginButton", function(oButton) {
			oBeginButton = oButton;
		});
		var oDialogOpenStub = sinon.stub(Dialog.prototype, "open", function() {
			oBeginButton.firePress();
		});
		var oDialogSetTitle = sinon.stub(Dialog.prototype, "setTitle");
		var oAddContentSpy = sinon.spy(Dialog.prototype, "addContent");

		// Call function
		oActionUtil._initiateCall(oActionParamInfo, true);

		oCallMethodPromise.then(function() {
			// Assert
			assert.ok(oDialogOpenStub.calledOnce, "When a non-create action is executed in strict mode & all non-key parameters should be shown in dialog");
			assert.equal(oDialogSetTitle.args[0][0], "Test Action", "Dialog title should be set to action label");
			assert.equal(oButtonSetTextStub.args[0][0], "Test Action", "Action Title should also be shown as Action button text");
			done();

			// Clean up
			oDialogSetBeginButtonStub.restore();
			oButtonSetTextStub.restore();
			oDialogOpenStub.restore();
			oDialogSetTitle.restore();
			oAddContentSpy.restore();
		});
	});

	QUnit.test("Test _buildParametersForm for unbound action in strict mode. Parameter dialog should have non-key parameters in non-create action", function (assert) {
		// Prepare test data
		var oActionParamInfo = {
			inParameters: {
				"Key11": {
					metadata: {
						name: "Key11"
					},
					isKey: true
				},
				"Key12": {
					metadata: {
						name: "Key12"
					},
					isKey: true
				},
				"Optional11": {
					metadata: {
						name: "Optional11"
					}
				},
				"Optional12": {
					metadata: {
						name: "Optional12"
					}
				}
			},
			contextSpecificParameterData: [
				{
					"Key11": "1",
					"Key12": "true"
				},
				{
					"Key11": "2",
					"Key12": "false"
				},
				{
					"Key11": "3",
					"Key12": "true"
				}
			],
			hasParametersRequiringUserInput: true
		};
		var oActionModel1 = {
			setProperty: sinon.stub()
		};
		var oActionContext1 = {
			getModel: sinon.stub().returns(oActionModel1)
		};

		oActionUtil.getIsBoundAction = sinon.stub().returns(false);

		// Call function
		var oParameterForm = oActionUtil._buildParametersForm(oActionParamInfo, oActionContext1);
		var oSmartForm = oParameterForm.form;
		assert.ok(oSmartForm instanceof sap.ui.comp.smartform.SmartForm, "SmartForm should be created for non-key parameters");
		assert.equal(oSmartForm.getVisibleProperties().length, 4, "Dialog should have both key & non-key properties");
		assert.equal(oSmartForm.getVisibleProperties()[0], "Key11", "First property should be Key11");
		assert.equal(oSmartForm.getVisibleProperties()[1], "Key12", "Second property should be Key12");
		assert.equal(oSmartForm.getVisibleProperties()[2], "Optional11", "First property should be Optional11");
		assert.equal(oSmartForm.getVisibleProperties()[3], "Optional12", "Second property should be Optional12");
	});

	QUnit.test("Test _triggerActionPromise - Multiple selected contexts scenario with a Boolean action parameter", function (assert) {
		// Prepare test data
		var oActionParamInfo = {
			inParameters: {
				"Key11": {
					metadata: {
						name: "Key11"
					},
					isKey: true
				},
				"Key12": {
					metadata: {
						name: "Key12"
					},
					isKey: true
				},
				"Optional11": {
					metadata: {
						name: "Optional11"
					}
				},
				"Optional12": {
					metadata: {
						name: "Optional12",
						type: "Edm.Boolean"
					}
				},
				"Optional13": {
					metadata: {
						name: "Optional13"
					}
				}
			},
			contextSpecificParameterData: [
				{
					"Key11": "1",
					"Key12": "true"
				},
				{
					"Key11": "2",
					"Key12": "false"
				},
				{
					"Key11": "3",
					"Key12": "true"
				}
			],
			isBoundAction: true
		};
		var oActionModel = {
			setProperty: sinon.stub()
		};
		var oActionContext = {
			getObject: sinon.stub().returns({
				"Optional11": "Op1",
				"Optional12": undefined,
				"Optional13": undefined
			}),
			getModel: sinon.stub().returns(oActionModel)
		};
		var oActionContext2 = {
			getModel: sinon.stub().returns(oActionModel)
		};
		var oActionContext3 = {
			getModel: sinon.stub().returns(oActionModel)
		};
		var aActionContexts = [	oActionContext, oActionContext2, oActionContext3 ];
		var aFuncHandles = [
			{
				context: Promise.resolve(oActionContext),
				result: Promise.resolve()
			},
			{
				context: Promise.resolve(oActionContext2),
				result: Promise.resolve()
			},
			{
				context: Promise.resolve(oActionContext3),
				result: Promise.resolve()
			}
		];

		oApplicationController._checkAtLeastOneSuccess = function (EntityContext, aResults) {
			aResults = [{response: ""}, {response: ""}, {response: ""}];
			return true;
		};
		oApplicationController._newPromiseAll = sinon.stub();
		oApplicationController._newPromiseAll.func = function(aPromises) {
			return Promise.resolve(function() {
				var aResults = [{response: ""}, {response: ""}, {response: ""}];
				return aResults;
			});
		};
		oApplicationController.submitActionContext = sinon.stub();

		var oCallMethodPromise = new Promise(function(resolve, reject) {
			oActionUtil._callMethodPromise = {
				resolve: resolve,
				reject: reject
			};
		});

		// Call function
		oActionUtil._triggerActionPromise(aFuncHandles, aSelectedContexts, oActionParamInfo, aActionContexts, true);

		// Assert
		var expectedCalls = [
			{ property: "Optional11", value: "Op1", context: oActionContext2, text: "Optional11 should be set in model" },
			{ property: "Optional11", value: "Op1", context: oActionContext3, text: "Optional11 should be set in model" },
			{ property: "Optional12", value: false, context: oActionContext, text: "Boolean properties which are not checked comes in the context as undefined & it should be set to false else SAP Gateway can't handle the request" },
			{ property: "Optional12", value: false, context: oActionContext2, text: "Boolean properties which are not checked comes in the context as undefined & it should be set to false else SAP Gateway can't handle the request" },
			{ property: "Optional12", value: false, context: oActionContext3, text: "Boolean properties which are not checked comes in the context as undefined & it should be set to false else SAP Gateway can't handle the request" },
			{ property: "Optional13", value: undefined, context: oActionContext, text: "Optional13 should be set as undefined if it comes as null" },
			{ property: "Optional13", value: undefined, context: oActionContext2, text: "Optional13 should be set as undefined if it comes as null" },
			{ property: "Optional13", value: undefined, context: oActionContext3, text: "Optional13 should be set as undefined if it comes as null" },
		];
		
		assert.equal(oActionModel.setProperty.callCount, expectedCalls.length, "Model setProperty should be called " + expectedCalls.length + " times");
		
		expectedCalls.forEach(function(call, index) {
			assert.equal(oActionModel.setProperty.args[index][0], call.property, call.text);
			assert.equal(oActionModel.setProperty.args[index][1], call.value, "Property value should be set in model");
			assert.equal(oActionModel.setProperty.args[index][2], call.context, call.context + " should be passed as an argument");
			assert.equal(oActionModel.setProperty.args[index][3], true, "setProperty should be allowed to execute in async mode");
		});
	

		assert.equal(oApplicationController.submitActionContext.callCount, 3, "submitActionContext should be called thrice");
		assert.equal(oApplicationController.submitActionContext.args[0][0], aSelectedContexts[0], "Selected entity context should be passed as an argument");
		assert.equal(oApplicationController.submitActionContext.args[0][1], oActionContext, "oActionContext should be passed as an argument");
		assert.equal(oApplicationController.submitActionContext.args[0][2], "DummyAction", "Action name has to be passed as argument");
		assert.equal(oApplicationController.submitActionContext.args[1][0], aSelectedContexts[1], "Selected entity context should be passed as an argument");
		assert.equal(oApplicationController.submitActionContext.args[1][1], oActionContext2, "oActionContext2 should be passed as an argument");
		assert.equal(oApplicationController.submitActionContext.args[1][2], "DummyAction", "Action name has to be passed as argument");
		assert.equal(oApplicationController.submitActionContext.args[2][0], aSelectedContexts[2], "Selected entity context should be passed as an argument");
		assert.equal(oApplicationController.submitActionContext.args[2][1], oActionContext3, "oActionContext3 should be passed as an argument");
		assert.equal(oApplicationController.submitActionContext.args[2][2], "DummyAction", "Action name has to be passed as argument");

	});
	function setupTestData(isBoolean, optional12Value) {
		var oActionParamInfo = {
			inParameters: {
				"Key11": {
					metadata: {
						name: "Key11"
					},
					isKey: true
				},
				"Key12": {
					metadata: {
						name: "Key12"
					},
					isKey: true
				},
				"Optional11": {
					metadata: {
						name: "Optional11"
					}
				},
				"Optional12": {
					metadata: {
						name: "Optional12",
						type: isBoolean ? "Edm.Boolean" : "Edm.NonBoolean"
					}
				}
			},
			contextSpecificParameterData: [
				{
					"Key11": "1",
					"Key12": "true"
				},
				{
					"Key11": "2",
					"Key12": "false"
				},
				{
					"Key11": "3",
					"Key12": "true"
				}
			],
			isBoundAction: true
		};
		var oActionModel = {
			setProperty: sinon.stub()
		};
		var oActionContext = {
			getObject: sinon.stub().returns({
				"Optional11": "Op1",
				"Optional12": optional12Value
			}),
			getModel: sinon.stub().returns(oActionModel)
		};
		var aActionContexts = [oActionContext];
		var aFuncHandles = [
			{
				context: Promise.resolve(oActionContext),
				result: Promise.resolve()
			}
		];

		oApplicationController._checkAtLeastOneSuccess = function (EntityContext, aResults) {
			aResults = [{ response: "" }, { response: "" }, { response: "" }];
			return true;
		};
		oApplicationController._checkAtLeastOneSuccess = sinon.stub().returns(true);
		oApplicationController._newPromiseAll = sinon.stub();
		oApplicationController._newPromiseAll.func = function (aPromises) {
			return Promise.resolve(function () {
				var aResults = [{ response: "" }, { response: "" }, { response: "" }];
				return aResults;
			});
		};
		oApplicationController.submitActionContext = sinon.stub();

		var oCallMethodPromise = new Promise(function (resolve, reject) {
			oActionUtil._callMethodPromise = {
				resolve: resolve,
				reject: reject
			};
		});

		return {
			oActionParamInfo,
			oActionModel,
			aFuncHandles,
			aActionContexts
		};
	}

	QUnit.test("Test _triggerActionPromise - Single selected Context scenario with Boolean action parameter with true value ", function (assert) {
		var testData = setupTestData(true, true);

		// Call function
		oActionUtil._triggerActionPromise(testData.aFuncHandles, aSelectedContexts, testData.oActionParamInfo, testData.aActionContexts, true);

		// Assert
		assert.equal(testData.oActionModel.setProperty.callCount, 0, "All value are expected to be set on the model. As the Boolean property is true, there is no need to force-full setting of the Property");
	});

	QUnit.test("Test _triggerActionPromise - Single selected Context scenario with Non Boolean action parameter with null value ", function (assert) {
		var testData = setupTestData(false, null);

		// Call function
		oActionUtil._triggerActionPromise(testData.aFuncHandles, aSelectedContexts, testData.oActionParamInfo, testData.aActionContexts, true);

		// Assert
		assert.equal(testData.oActionModel.setProperty.callCount, 1, "All value are expected to be set on the model. As the Boolean property is true, there is no need to forceful setting of the Property, but for Non-Boolean property, it should be set to undefined");
	});
});