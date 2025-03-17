/**
 * tests for the sap.suite.ui.generic.template.lib.CRUDManager
 */

sap.ui.define(["testUtils/sinonEnhanced", "sap/suite/ui/generic/template/genericUtilities/testableHelper",
                "sap/suite/ui/generic/template/lib/MessageUtils", "sap/suite/ui/generic/template/lib/CRUDManager"
], function(sinon, testableHelper, MessageUtils, CRUDManager) {
	"use strict";

	var oAppComponent = {
		getId: function(){
			return "theAppComponentId";
		}
	};
	
	var oContext = Object.freeze({});
	var oView = {
		getBindingContext: function(){
			return oContext;
		},
		getModel: function() {
			return {
				getMetaModel: function() {
					return {
						getODataEntityContainer : function() {
							return ({
								"Org.OData.Capabilities.V1.BatchSupport": {
									"ReferencesAcrossChangeSetsSupported": {
										"Bool": "true"
									}
								}
							});
						},
						getODataFunctionImport : function() {
							return ({
								"returnType": ""
							});
						},
						getODataEntitySet : function() {
							return ({
								"entityType": ""
							});
						},
						getODataEntityType : function() {
							return ({
								"key": []
							});
						}
					};
				},
				metadataLoaded: function(){
					return Promise.resolve();
				},
				annotationsLoaded: function(){
					return Promise.resolve();
				},
				invalidateEntry: Function.prototype
			}
		}
	};
	var oController = {
		getView: function(){
			return oView;
		},
		customizeMsgModelforTransientMessages: function(){
			return;
		}
	};
	var oComponentUtils = {
		isDraftEnabled: function() {},
		registerContext: function() {},
		getRootExpand: function() {},
		getCRUDActionHandler: function() {}
	};
	var oCommonUtils = {
		getTableOrListBindingInfo: function (){
		}
	};
	var bIsBusy;
	var oBusyHelper = {
		isBusy: function(){
			return bIsBusy;
		},
		setBusyReason: function() {

		}
	};
	var oServices = Object.freeze({
		oDraftController: {},
		oApplication: {
			getComponentUtilsIfLoaded: Function.prototype
		},
		oTemplateCapabilities: {
			oMessageButtonHelper: {
				getContextFilter: function () { return {}; }
			}
		}
	});
	var sandbox, oStubForPrivate;
	var oCRUDManager;

	QUnit.module("activateDraftEntity", {
		beforeEach: function() {
			sandbox = sinon.sandbox.create();
			oStubForPrivate = testableHelper.startTest();
			bIsBusy = false;
			oCRUDManager = new CRUDManager(oController, oComponentUtils, oServices, oCommonUtils, oBusyHelper);
		},
		afterEach: function() {
			testableHelper.endTest();
			sandbox.restore();
		}
	});

	QUnit.test("activateDraftEntity - does not run when busy", function(assert) {
		bIsBusy = true;
		var done = assert.async();
		var oActivationPromise = oCRUDManager.activateDraftEntity();
		oActivationPromise.catch(done);
		assert.ok(true, "function was executed without exception");
	});

	QUnit.test("activateDraftEntity - with passing Expand Params (if present)", function(assert) {
		
		var oResponse;
		var aBusyPromises = [];
		sandbox.stub(oBusyHelper, "setBusy", function(oPromise){
			aBusyPromises.push(oPromise);
			bIsBusy = true;
		});
		var done = assert.async();
		var fnActivationResolved;

		sandbox.stub(oComponentUtils, "getRootExpand", function () {
			return "to_dummyContext1,to_dummyContext2";
		});
		
		sandbox.stub(oServices.oDraftController, "activateDraftEntity", function(){
			sandbox.stub(oServices.oDraftController, "fetchHeader", function(oSibCtx){
				assert.strictEqual(oSibCtx, oSiblingContext, "Correct sibling context must have been passed to the draft controller");
			});
			return new Promise(function(fnResolve){
				fnActivationResolved = fnResolve;
			});
		});
		sandbox.stub(oServices.oApplication, "activationStarted", function(){
			return Promise.resolve();
		});
		sandbox.stub(oServices.oApplication, "getComponentUtilsIfLoaded", function(){
			return null;
		});
		var oSiblingContext = {};
		sandbox.stub(oServices.oApplication, "getDraftSiblingPromise", function(){
			return Promise.resolve(oSiblingContext);
		});
		sandbox.stub(oController, "getOwnerComponent", function(){
			return {
				getModel: function(){
					return {
						invalidateEntry: function(){	
							return Promise.resolve();						
						}
					};
				},
				getEntitySet: function(){
					return "theEntitySet";
				},
				getAppComponent: function(){
					return oAppComponent;
				}				
			};
		});

		var oResult = oCRUDManager.activateDraftEntity();
		oResult.then(function() {
			assert.equal("to_dummyContext1,to_dummyContext2",oServices.oDraftController.activateDraftEntity.getCall(0).args[2], "Correct Expand params are passed");
			done();
		}, function () {
			assert.notOk(true, "...that is rejected");
			done();
		});

		Promise.all(aBusyPromises).then(function(){
			bIsBusy = false;			
		});
		setTimeout(function(){
			sandbox.stub(oServices.oApplication, "getDialogFragmentForView", Function.prototype);
			fnActivationResolved(oResponse);
		}, 0);
	});


	function fnTestActivation(bWithExpand, assert) {

		var oResponse;
		var aBusyPromises = [];
		sandbox.stub(oBusyHelper, "setBusy", function(oPromise){
			aBusyPromises.push(oPromise);
			bIsBusy = true;
		});
		var done = assert.async();
		var fnActivationResolved;
		var bIsActivated = false;
		var bIsApplicationInformed = false;
		var bIsCallerInformed = false;
		sandbox.stub(oServices.oDraftController, "activateDraftEntity", function(oCtx){
			assert.strictEqual(oCtx, oContext, "Correct context must have been passed to the draft controller");
			assert.ok(!fnActivationResolved, "Activation must not be called twice");
			sandbox.stub(oServices.oDraftController, "fetchHeader", function(oSibCtx){
				assert.strictEqual(oSibCtx, oSiblingContext, "Correct sibling context must have been passed to the draft controller");
			});
			return new Promise(function(fnResolve){
				fnActivationResolved = fnResolve;
			});
		});
		sandbox.stub(oServices.oApplication, "activationStarted", function(oCtx, oActivationPromise){
			assert.strictEqual(oCtx, oContext, "Correct context must have been passed to Application");
			oActivationPromise.then(function(){
				assert.ok(bIsActivated, "Activation must have taken place before ActivationPromise ended");
				bIsApplicationInformed = true;
				if (bIsCallerInformed && !bIsBusy){
					done();
				}
			});
		});
		var oSiblingContext = {};
		sandbox.stub(oServices.oApplication, "getDraftSiblingPromise", function(){
			return Promise.resolve(oSiblingContext);
		});
		sandbox.stub(oController, "getOwnerComponent", function(){
			return {
				getModel: function(){
					return {
						invalidateEntry: function(oEntry){
							assert.equal(oSiblingContext, oEntry, "(active) Sibling must be passed to the model for invalidation");
						}
					};
				},
				getEntitySet: function(){
					return "theEntitySet";
				},
				getAppComponent: function(){
					return oAppComponent;
				}
			};
		});
		var oCRUDPromise = oCRUDManager.activateDraftEntity();
		oCRUDPromise.then(function(oRep){
			assert.strictEqual(oRep, oResponse, "response must have been passed to the caller");
			assert.ok(bIsActivated, "Activation must have taken place before caller is informed");
			bIsCallerInformed = true;
			if (bIsApplicationInformed && !bIsBusy){
				done();
			}
		});
		Promise.all(aBusyPromises).then(function(){
			bIsBusy = false;
			if (bIsCallerInformed && bIsApplicationInformed){
				done();
			}
		});
		setTimeout(function(){
			bIsActivated = true;
			var sPath = {};
			oResponse = {
				context: {
					getPath: function(){
						return sPath;
					}
				}
			};
			var aExpand = ["abc", "def"];
			sandbox.stub(oComponentUtils, "getPreprocessorsData", function(){
				return {
					rootContextExpand: bWithExpand && aExpand
				};
			});
			sandbox.stub(oServices.oApplication, "getDialogFragmentForView", Function.prototype);
			if (bWithExpand){
				sandbox.stub(oView, "getModel", function(sName){
					assert.ok(!sName, "Only default model must be accessed");
					return {
						read: function(vPath, oOptions){
							assert.strictEqual(vPath, sPath, "Path must be used in read correctly");
							assert.strictEqual(oOptions.urlParameters["$select"], "abc,def", "Select clause must be set correctly");
							assert.strictEqual(oOptions.urlParameters["$expand"], "abc,def", "Expand clause must be set correctly");
							setTimeout(oOptions.success, 0);
						}
					};
				});
			}
			fnActivationResolved(oResponse);
		}, 0);
	}

	QUnit.test("activateDraftEntity - runs correctly when not busy and no expands", fnTestActivation.bind(null, false));

	QUnit.test("activateDraftEntity - runs correctly when not busy and with expands", fnTestActivation.bind(null, true));


	QUnit.module("Call action", {
		beforeEach: function() {
			sandbox = sinon.sandbox.create();
			oStubForPrivate = testableHelper.startTest();
			bIsBusy = false;
			oCRUDManager = new CRUDManager(oController, oComponentUtils, oServices, oCommonUtils, oBusyHelper);
		},
		afterEach: function() {
			testableHelper.endTest();
			sandbox.restore();
		}
	})

	QUnit.test("Call action with or without parameters, successful", function(assert){
		
		var fnParametersEntered;
		var oBackendResult;
		var oParameterPopupPromise;
		var oActionUtil = {
				call: function(){
					oParameterPopupPromise = new Promise(function(resolve){
						fnParametersEntered = resolve;
					});
					return oParameterPopupPromise;
				},
				getExecutedSuccessfully: function(){
					return true;
				}
		}
		sandbox.stub(oStubForPrivate, "getActionUtil", function(){
			return oActionUtil;
		});
		sandbox.stub(oBusyHelper, "setBusy");
		// preparation for the call itself
		sandbox.stub(oServices.oApplication, "performAfterSideEffectExecution", function(fn){
			fn();
			// parameters entered
			var fnBackendSuccess;
			var oBackendPromise = new Promise(function(resolve){
				fnBackendSuccess = resolve;
			});
			fnParametersEntered({executionPromise: oBackendPromise});

			// check
			oParameterPopupPromise.then(function(){
				assert.ok(oBusyHelper.setBusy.calledOnce, "BusyHelper called");
				assert.ok(oBusyHelper.setBusy.calledWith(oBackendPromise), "...with Backend Promise")
			});

			// provide result from backend
			oBackendResult = {response:{response:{statusCode:200}}};
			fnBackendSuccess(oBackendResult);
		});
		

		// actual call
		var mParameters = {
			sourceControlHandler: {
				getBindingInfo: Function.prototype,
				getModel: Function.prototype,
				getEntitySet: Function.prototype
			}
		};

		// preparation for result handling
		sandbox.stub(oController, "getOwnerComponent", function(){
			return {
				getAppComponent: function(){
					return {
						getId: Function.prototype
					}
				},
				getCreationEntitySet: function(){
					return false;
				},
				getEntitySet: Function.prototype,
			};
		});

		var oResult = oCRUDManager.callAction(mParameters);

		// check
		assert.ok(oResult instanceof Promise, "CallAction returned a Promise");
		assert.notOk(oBusyHelper.setBusy.called, "BusyHelper not called yet");

		// checks after promise settled
		var done = assert.async();
		oResult.then(function(oResult){
			assert.ok(true, "Promise from CallAction is resolved..");
				assert.equal(oResult[0], oBackendResult.response, "...to the result returned from backend");
				done();
		}, function(){
			assert.notOk(true, "Promise from CallAction is rejected");
			done();
		});
	});

	QUnit.test("Call action with or without parameters, error from backend", function(assert){
		
		var fnParametersEntered;
		var oParameterPopupPromise;
		var oBackendError;
		var oActionUtil = {
				call: function(){
					oParameterPopupPromise = new Promise(function(resolve){
						fnParametersEntered = resolve;
					});
					return oParameterPopupPromise;
				},
				getExecutedSuccessfully: function () {
					return false;
				}
		}
		sandbox.stub(oStubForPrivate, "getActionUtil", function(){
			return oActionUtil;
		});
		sandbox.stub(oBusyHelper, "setBusy");

		// preparation for the call itself
		sandbox.stub(oServices.oApplication, "performAfterSideEffectExecution", function(fn){
			fn();
			// parameters entered
			var fnBackendError;
			var oBackendPromise = new Promise(function(resolve, reject){
				fnBackendError = reject;
			});
			fnParametersEntered({executionPromise: oBackendPromise});

			// check
			oParameterPopupPromise.then(function(){
				assert.ok(oBusyHelper.setBusy.calledOnce, "BusyHelper called");
				assert.ok(oBusyHelper.setBusy.calledWith(oBackendPromise), "...with Backend Promise")
			});

			// preparation for result handling
			sandbox.stub(MessageUtils, "handleError", Function.prototype);

			// provide error from backend
			oBackendError = {error:{
				error:{
					statusCode: 401
				}
			}};
			fnBackendError(oBackendError);
			
		});

		sandbox.stub(oController, "getOwnerComponent", function(){
			return {
				getAppComponent: function(){
					return {
						getId: Function.prototype
					}
				},
				getCreationEntitySet: function(){
					return false;
				},
				getEntitySet: Function.prototype,
			};
		});

		// actual call
		var mParameters = {};
		var oResult = oCRUDManager.callAction(mParameters);

		// check
		assert.ok(oResult instanceof Promise, "CallAction returned a Promise");
		assert.notOk(oBusyHelper.setBusy.called, "BusyHelper not called yet");

		// checks after promise settled
		var done = assert.async();
		oResult.then(function(){
			assert.notOk(true, "Promise from CallAction is resolved..");
				done();
		}, function(oError){
			assert.ok(true, "Promise from CallAction is rejected..");
			assert.equal(oError[0], oBackendError.error, "...to the error returned from backend");
			done();
		});
	});

	QUnit.test("Call action with parameters, user cancels", function(assert){
		
		var fnUserCancellation;
		var oActionUtil = {
				call: function(){
					return new Promise(function(resolve,reject){
						fnUserCancellation = reject;
					});
				}
		}
		sandbox.stub(oStubForPrivate, "getActionUtil", function(){
			return oActionUtil;
		});
		sandbox.stub(oBusyHelper, "setBusy");

		sandbox.stub(oController, "getOwnerComponent", function(){
			return {
				getAppComponent: function(){
					return {
						getId: Function.prototype
					}
				},
				getCreationEntitySet: function(){
					return false;
				},
				getEntitySet: Function.prototype,
			};
		});

		// preparation for the call itself
		sandbox.stub(oServices.oApplication, "performAfterSideEffectExecution", function(fn){
			fn();
			// user cancels
			fnUserCancellation();
		});

		// actual call
		var mParameters = {};
		var oResult = oCRUDManager.callAction(mParameters);

		// check
		assert.ok(oResult instanceof Promise, "CallAction returned a Promise");	

		// checks after promise settled
		var done = assert.async();
		oResult.then(function(){
			assert.notOk(true, "...that is resolved");
			done();
		}, function(oError){
			assert.ok(true, "...that is rejected");
			assert.equal(oError, null, "...without any error");
			assert.notOk(oBusyHelper.setBusy.called, "BusyHelper not called");
			done();
		});
	});

	QUnit.module("deleteEntity", {
		beforeEach: function() {
			sandbox = sinon.sandbox.create();
			oStubForPrivate = testableHelper.startTest();
			bIsBusy = false;
			oCRUDManager = new CRUDManager(oController, oComponentUtils, oServices, oCommonUtils, oBusyHelper);
		},
		afterEach: function() {
			testableHelper.endTest();
			sandbox.restore();
		}
	});

});
