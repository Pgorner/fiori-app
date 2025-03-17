/**
 * tests for the sap.suite.ui.generic.template.lib.CRUDHelper
 */

sap.ui.define([
	"testUtils/sinonEnhanced",
	"sap/suite/ui/generic/template/genericUtilities/testableHelper",
	"sap/suite/ui/generic/template/lib/CRUDHelper",
	"sap/m/MessageBox",
	"sap/suite/ui/generic/template/genericUtilities/CacheHelper",
	"sap/suite/ui/generic/template/lib/MessageUtils",
	"sap/ui/model/Filter",
	"sap/ui/core/message/Message",
	"sap/ui/core/message/MessageType",
	"sap/ui/model/json/JSONModel",
], function(sinon, testableHelper, CRUDHelper, MessageBox, CacheHelper, MessageUtils, Filter, Message, MessageType, JSONModel) {
	"use strict";

	var oDraftContext = {};
	var oDraftController = {
			getDraftContext: function(){return oDraftContext;}
	};
	var oTransactionController = {
			getDraftController: function(){return oDraftController;}
	};
	var oModel = {
		createBindingContext: function(a, b, c, fnCallBack) { fnCallBack(oBindingContext); },
		invalidateEntry: function() { return Promise.resolve(); }
	};
	var sBindingPath = "BindingPath";
	var oBindingContext = {
		sPath: sBindingPath,
		oModel
	};

	var oTemplateContract = {
		oBusyHelper: {
			setBusy: Function.prototype,
			getUnbusy: function () { return Promise.resolve(); }
		},
		oApplicationProxy: {},
		getText: function (sArg) {
			return sArg;
		},
		oTemplatePrivateGlobalModel: {
			setProperty: Function.prototype
		},
		nDelayedDraftTimerInSeconds: 20		// default delayed draft timer
	};

	var sandbox;
	var oStubForPrivate;

	QUnit.module("lib.CRUDHelper Edit", {
		beforeEach: function() {
			sandbox = sinon.sandbox.create();
			oStubForPrivate = testableHelper.startTest();
		},
		afterEach: function() {
			testableHelper.endTest();
			sandbox.restore();
		}
	});

	QUnit.test("draft, no preserve change, active", async function(assert) {
		// prepare
		sandbox.stub(oDraftContext, "isDraftEnabled", function() {
			return true;
		});
		sandbox.stub(oDraftContext, "hasPreserveChanges", function() {
			return false;
		});
		sandbox.stub(oModel, "read", function(sPath, mParameters) {
			mParameters.success({});
		});
		var oTransactionControllerResult = {};
		sandbox.stub(oTransactionController, "editEntity", function(){return Promise.resolve(oTransactionControllerResult);});

		// execute
		var oEditPromise = CRUDHelper.edit(oTransactionController, "EntitySet", "BindingPath", oModel, oTemplateContract);

		// check
		assert.ok(oEditPromise instanceof Promise, "Edit returned a Promise");
		try {
			var oCRUDHelperResult = await oEditPromise;
			assert.ok(true, "..that is resolved");

			assert.ok(oModel.read.calledOnce, "Model read called (once!)");
			assert.equal(oModel.read.getCall(0).args[0], "BindingPath", "... with meaningful path");
			assert.deepEqual(oModel.read.getCall(0).args[1].urlParameters, { "$expand": "DraftAdministrativeData" }, "... and needed urlParamters");

			assert.ok(oTransactionController.editEntity.calledOnce, "TransactionController editEntity called (once!)");
			assert.equal(oTransactionController.editEntity.getCall(0).args[0].sPath, "BindingPath", "... with path");
			assert.equal(oTransactionController.editEntity.getCall(0).args[0].oModel, oModel, "... and model");
			assert.notOk(oTransactionController.editEntity.getCall(0).args[1], "BindingPath", "... and preserveChanges = false");

			assert.equal(oCRUDHelperResult, oTransactionControllerResult, "Resolved to result from TransactionController");
		} catch {
				assert.notOk(true, "..that is rejected");
		}
	});

	QUnit.test("draft, no preserve change, own draft", async function(assert) {
		// prepare
		sandbox.stub(oDraftContext, "isDraftEnabled", function(){return true;});
		sandbox.stub(oDraftContext, "hasPreserveChanges", function() {
			return false;
		});
		sandbox.stub(oModel, "read", function(sPath, mParameters) {
			mParameters.success({
				DraftAdministrativeData: {
					DraftIsCreatedByMe: true
				}
			});
		});
		var oTransactionControllerResult = {};
		sandbox.stub(oTransactionController, "editEntity", function(){return Promise.resolve(oTransactionControllerResult);});

		// execute
		var oEditPromise = CRUDHelper.edit(oTransactionController, "EntitySet", sBindingPath, oModel, oTemplateContract);

		// check
		assert.ok(oEditPromise instanceof Promise, "Edit returned a Promise");
		try {
			var oCRUDHelperResult = await oEditPromise;
			assert.ok(true, "..that is resolved");

			assert.ok(oModel.read.calledOnce, "Model read called (once!)");
			assert.equal(oModel.read.getCall(0).args[0], "BindingPath", "... with meaningful path");
			assert.deepEqual(oModel.read.getCall(0).args[1].urlParameters, {"$expand": "DraftAdministrativeData"}, "... and needed urlParamters");

			assert.ok(oTransactionController.editEntity.calledOnce, "TransactionController editEntity called (once!)");
			assert.equal(oTransactionController.editEntity.getCall(0).args[0].sPath, "BindingPath", "... with path");
			assert.equal(oTransactionController.editEntity.getCall(0).args[0].oModel, oModel, "... and model");
			assert.notOk(oTransactionController.editEntity.getCall(0).args[1], "BindingPath", "... and preserveChanges = false");

			assert.equal(oCRUDHelperResult,oTransactionControllerResult, "Resolved to result from TransactionController");
		} catch {
				assert.notOk(true, "..that is rejected");
		}
	});

	QUnit.test("draft, no preserve change, locked", async function(assert) {
		// prepare
		sandbox.stub(oDraftContext, "isDraftEnabled", function(){return true;});
		sandbox.stub(oDraftContext, "hasPreserveChanges", function() {
			return false;
		});
		sandbox.stub(oModel, "read", function(sPath, mParameters) {
			mParameters.success({
				DraftAdministrativeData: {
					DraftIsCreatedByMe: false,
					InProcessByUser: "Other User",
					InProcessByUserDescription: "Other User description"
				}
			});
		});
		sandbox.stub(oTransactionController, "editEntity");

		// execute
		var oEditPromise = CRUDHelper.edit(oTransactionController, "EntitySet", "BindingPath", oModel, oTemplateContract);

		// check
		assert.ok(oEditPromise instanceof Promise, "Edit returned a Promise");
		try {
			await oEditPromise;
			assert.notOk(true, "..that is resolved");
		} catch (oCRUDHelperResult) {
			assert.ok(true, "..that is rejected");

			assert.ok(oModel.read.calledOnce, "Model read called (once!)");
			assert.equal(oModel.read.getCall(0).args[0], "BindingPath", "... with meaningful path");
			assert.deepEqual(oModel.read.getCall(0).args[1].urlParameters, {"$expand": "DraftAdministrativeData"}, "... and needed urlParamters");

			assert.notOk(oTransactionController.editEntity.called, "TransactionController editEntity not called");

			assert.deepEqual(oCRUDHelperResult,{lockedByUser: "Other User description"}, "Rejected with locking user description");
		}
	});

	QUnit.test("draft, no preserve change, unsaved changes, user cancels", async function(assert) {
		// prepare
		sandbox.stub(oDraftContext, "isDraftEnabled", function(){return true;});
		sandbox.stub(oDraftContext, "hasPreserveChanges", function() {
			return false;
		});
		sandbox.stub(oModel, "read", function(sPath, mParameters) {
			mParameters.success({
				DraftAdministrativeData: {
					DraftIsCreatedByMe: false,
					InProcessByUser: "",
					InProcessByUserDescription: "",
					LastChangedByUser: "Other User",
					LastChangedByUserDescription: "Other User description"
				}
			});
		});
		sandbox.stub(oTransactionController, "editEntity");
		sandbox.stub(MessageBox, "warning", function(argString,argObject) {
			argObject.onClose("CANCEL");
		});

		// execute
		var oEditPromise = CRUDHelper.edit(oTransactionController, "EntitySet", "BindingPath", oModel, oTemplateContract);

		// check
		assert.ok(oEditPromise instanceof Promise, "Edit returned a Promise");
		try {
			await oEditPromise;
			assert.notOk(true, "..that is resolved");
		} catch (oCRUDHelperResult) {
			assert.ok(true, "..that is rejected");

			assert.ok(oModel.read.calledOnce, "Model read called (once!)");
			assert.equal(oModel.read.getCall(0).args[0], "BindingPath", "... with meaningful path");
			assert.deepEqual(oModel.read.getCall(0).args[1].urlParameters, {"$expand": "DraftAdministrativeData"}, "... and needed urlParamters");
			assert.ok(MessageBox.warning.calledOnce, "and unSavedChanges Dialog Opened");
			assert.notOk(oTransactionController.editEntity.called, "TransactionController editEntity not called");
			assert.deepEqual(oCRUDHelperResult,{lockedByUser: "Other User description"}, "Rejected with locking user description");
		}
	});

	QUnit.test("draft, no preserve change, unsaved changes, user decides to override", async function(assert) {
		// prepare
		sandbox.stub(oDraftContext, "isDraftEnabled", function(){return true;});
		sandbox.stub(oDraftContext, "hasPreserveChanges", function() {
			return false;
		});
		sandbox.stub(oModel, "read", function(sPath, mParameters) {
			mParameters.success({
				DraftAdministrativeData: {
					DraftIsCreatedByMe: false,
					InProcessByUser: "",
					InProcessByUserDescription: "",
					LastChangedByUser: "Other User",
					LastChangedByUserDescription: "Other User description"
				}
			});
		});
		var oTransactionControllerResult = {};
		sandbox.stub(oTransactionController, "editEntity", function(){return Promise.resolve(oTransactionControllerResult);});
		sandbox.stub(MessageBox, "warning", function(argString,argObject) {
			argObject.onClose("Edit");
		});

		// execute
		var oEditPromise = CRUDHelper.edit(oTransactionController, "EntitySet", "BindingPath", oModel, oTemplateContract);

		// check
		assert.ok(oEditPromise instanceof Promise, "Edit returned a Promise");
		try {
			var oCRUDHelperResult = await oEditPromise;
			assert.ok(true, "..that is resolved");

			assert.ok(oModel.read.calledOnce, "Model read called (once!)");
			assert.equal(oModel.read.getCall(0).args[0], "BindingPath", "... with meaningful path");
			assert.deepEqual(oModel.read.getCall(0).args[1].urlParameters, {"$expand": "DraftAdministrativeData"}, "... and needed urlParamters");
			assert.ok(MessageBox.warning.calledOnce, "and unSavedChanges Dialog Opened");
			assert.ok(oTransactionController.editEntity.calledOnce, "TransactionController editEntity called (once!)");
			assert.equal(oTransactionController.editEntity.getCall(0).args[0].sPath, "BindingPath", "... with path");
			assert.equal(oTransactionController.editEntity.getCall(0).args[0].oModel, oModel, "... and model");
			assert.notOk(oTransactionController.editEntity.getCall(0).args[1], "BindingPath", "... and preserveChanges = false");

			assert.equal(oCRUDHelperResult,oTransactionControllerResult, "Resolved to result from TransactionController");
		} catch {
				assert.notOk(true, "..that is rejected");
		}
	});

	QUnit.module("lib.CRUDHelper directEdit", {
		beforeEach: function() {
			sandbox = sinon.sandbox.create();
			sap.ui.getCore().getMessageManager().removeAllMessages();
		},
		afterEach: function() {
			sap.ui.getCore().getMessageManager().removeAllMessages();
			sandbox.restore();
		}
	});

	QUnit.test("Should reject if - draft, unsaved changes, user cancels", async function (assert) {
		var oModel = {
			createBindingContext: function (a, b, c, fnCallBack) { fnCallBack(oBindingContext); }
		};
		var oApplication = {
			removeTransientMessages: Function.prototype,
			getBusyHelper: () => {
				return {
					setBusy: Function.prototype
				};
			}
		};
		// draft
		sandbox.stub(oDraftContext, "isDraftEnabled", function() { return true; });
		sandbox.stub(oTransactionController, "editEntity", () => Promise.reject({
			response: {
				statusCode: "409"
			}
		}));
		// fnReadDraftAdministrativeData - unsaved changes
		sandbox.stub(oModel, "read", function(sPath, mParameters) {
			mParameters.success({
				DraftAdministrativeData: {
					DraftIsCreatedByMe: false,
					InProcessByUser: "",
					InProcessByUserDescription: "",
					LastChangedByUser: "Other User",
					LastChangedByUserDescription: "Other User description"
				}
			});
		});
		// fnUnsavedChangesDialog - user cancels
		var oViewProxy;
		var bOpenInEditMode = true;
		var oCommonUtils = {};
		sandbox.stub(oCommonUtils, "getText", (sArg) => sArg);
		sandbox.stub(MessageBox, "warning", function(argString, argObject) {
			argObject.onClose("CANCEL");
		});

		try {
			await Promise.race([
				CRUDHelper.directEdit(oTransactionController, "EntitySet", "BindingPath", oModel, oApplication, oCommonUtils, undefined, oViewProxy, bOpenInEditMode),
				new Promise((_, reject) => setTimeout(
					() => reject({
						message: "directEdit promise never fulfills - test timed out",
						timeout: true
					}),
					0
				))
			]);
			assert.ok(false, "directEdit correctly rejects with 'cancelled' flag");
		} catch (oError) {
			assert.ok(!oError.timeout, "directEdit fulfills and does not time out");
			assert.ok(oError.cancelled, "directEdit correctly rejects with 'cancelled' flag");
		}
	});

	var oMetaModel = {};
	var fnHasDraft;
	var oApplicationController = {
		getTransactionController: function(){
			return {
				getDraftController: function(){
					return {
						getDraftContext: function(){
							return {
								hasDraft: function(oContext){
									return fnHasDraft(oContext);
								}
							};
						}
					};
				}
			};
		}
	};
	var fnPropertyChanged;
	oTemplateContract.oAppComponent = {
		getModel: function(){
			return {
				attachPropertyChange: function(fnHandler){
					fnPropertyChanged = fnHandler;
				},
				getMetaModel: function (){
					return oMetaModel;
				}
			};
		},
		getApplicationController: function(){
			return oApplicationController;
		},
		getNavigationController: function(){
			return {};
		},
	};
	QUnit.module("lib.CRUDHelper propertyChange", {
		beforeEach: function() {
			sandbox = sinon.sandbox.create();
			CRUDHelper.enableAutomaticDraftSaving(oTemplateContract);
		},
		afterEach: function() {
			fnPropertyChanged = null;
			fnHasDraft = null;
			sandbox.restore();
		}
	});

	function fnPropertyChangeTest(oContext, sPath, bIsDraft, sExpectedEntitySet, oEntitySet, bCallIsExpected, assert){
		sandbox.stub(oMetaModel, "getODataEntitySet", function(sEntitySet){
			assert.strictEqual(sEntitySet, sExpectedEntitySet, "Read metadata for expected entity set");
			return oEntitySet;
		});
		fnHasDraft = function(oTheContext){
			assert.strictEqual(oTheContext, oContext, "Draft check must be done for the correct context");
			return bIsDraft;
		};
		var oEvent = {
			getParameter: function(sParameter){
				if (sParameter === "context"){
					return oContext;
				}
				if (sParameter === "path"){
					return sPath;
				}
				assert.ok(false, "Only parameters 'path' and 'context' may be retrieved");
			}
		};
		var oPropertyChangedSpy = bCallIsExpected && sandbox.stub(oApplicationController, "propertyChanged", function(){
			return Promise.resolve();
		});
		var fnMarkCurrentDraftAsModifiedSpy = bCallIsExpected && sandbox.stub(oTemplateContract.oApplicationProxy, "markCurrentDraftAsModified", function(){
				return;
		});
		fnPropertyChanged(oEvent);
		if (oPropertyChangedSpy){
			assert.ok(oPropertyChangedSpy.calledOnce, "propertyChanged on ApplicationController must have been called");
			assert.ok(oPropertyChangedSpy.calledWithExactly(sPath, oContext, 20), "propertyChanged on ApplicationController must have been called with correct parameters");
		}
		if (fnMarkCurrentDraftAsModifiedSpy){
			assert.ok(fnMarkCurrentDraftAsModifiedSpy.calledOnce, "markCurrentDraftAsModified must have been called");
		}
	}

	QUnit.test("Parameter entered in Popup for Action with parameter", fnPropertyChangeTest.bind(null, {
		getPath: function() {
			return "/entitySetFunctionImport(key)";
		}
	}, "aPath", true, "entitySetFunctionImport", null, false));

	QUnit.test("Normal property change", fnPropertyChangeTest.bind(null, {
		getPath: function() {
			return "/TheEntitySet";
		}
	}, "aPath", true, "TheEntitySet", {}, true));

	QUnit.test("Normal property change but non-draft", fnPropertyChangeTest.bind(null, {
		getPath: function() {
			return "/TheEntitySet";
		}
	}, "aPath", false, "TheEntitySet", {}, false));

	QUnit.module("lib.CRUDHelper activateDraftEntity", {
		beforeEach: function() {
			sandbox = sinon.sandbox.create();
			sap.ui.getCore().getMessageManager().removeAllMessages();
		},
		afterEach: function() {
			sap.ui.getCore().getMessageManager().removeAllMessages();
			sandbox.restore();
		}
	});

	[
		{
			title: "Successfully activate draft",
			activateDraftEntity: function(fnResolve, fnReject, params) {
				fnResolve("activateDraftEntity.resolve");
			},
			assertResolve: function(assert, params) {
				assert.ok(params.result === "activateDraftEntity.resolve", "Draft was successfully activated");
				assert.ok(sap.ui.getCore().getMessageManager().getMessageModel().bindList("/").getContexts().length === 0, "'PreviousMessage01' message was removed from message model");
			},
			assertReject: function(assert, params) {
				assert.ok(false, "... not ok.")
			},
		},
		{
			title: "Activate draft - failed. State messages - no new, only previous one. 412 transient messages - no. As current messages stay same we immediately reject.",
			activateDraftEntity: function(fnResolve, fnReject, params) {
				fnReject("activateDraftEntity.reject");
			},
			assertResolve: function(assert, params) {
				assert.ok(false, "... not ok. Code should reject.")
			},
			assertReject: function(assert, params) {
				assert.ok(params.oServices.oApplication.getTransientMessages.notCalled, "We didn't loaded transient messages.");
				assert.ok(sap.ui.getCore().getMessageManager().getMessageModel().bindList("/").getContexts().length === 1, "Previous message preserved.");
			},
		},
		{
			title: "Activate draft - failed. New state messages - not present. 412 transient messages - only warning. Remove transient messages and call oCRUDActionHandler.handleCRUDScenario with 412 warning messages.",
			activateDraftEntity: function(fnResolve, fnReject, params) {
				sap.ui.getCore().getMessageManager().removeAllMessages();
				params.oServices.oApplication.getTransientMessages.returns([
					{message: "Transient 412 warning 01", type: MessageType.Warning, technicalDetails: {statusCode: "412", headers: {"preference-applied": "handling=strict"}}},
				]);
				fnReject("activateDraftEntity.reject");
			},
			assertResolve: function(assert, params) {
				assert.ok(false, "... not ok. Code should reject.")
			},
			assertReject: function(assert, params) {
				assert.ok(params.oServices.oApplication.getTransientMessages.calledOnce, "Loaded transient messages.");
				assert.ok(params.oServices.oApplication.registerCustomMessageProvider.calledOnce, "oServices.oApplication.registerCustomMessageProvider called.");
				assert.ok(params.oServices.oApplication.removeTransientMessages.calledOnce, "Removed transient messages.");
				assert.ok(params.oComponentUtils.oCRUDActionHandler.handleCRUDScenario.calledOnce, "oCRUDActionHandler.handleCRUDScenario has been called.");
				assert.ok(params.oComponentUtils.oCRUDActionHandler.handleCRUDScenario.firstCall.args[0] === 4, "oCRUDActionHandler.handleCRUDScenario has been called with correct (1) parameter");
				assert.ok(params.oComponentUtils.oCRUDActionHandler.handleCRUDScenario.firstCall.args[3] === "Activate", "oCRUDActionHandler.handleCRUDScenario has been called with correct (3) parameter");
				assert.ok(params.oComponentUtils.oCRUDActionHandler.handleCRUDScenario.firstCall.args[4].messagesForUserDecison[0].message === "Transient 412 warning 01", "oCRUDActionHandler.handleCRUDScenario has been called with correct message");
				assert.ok(sap.ui.getCore().getMessageManager().getMessageModel().bindList("/").getContexts().length === 0, "Correct message count in message model.");
			},
		},
		{
			title: "Activate draft - failed. New state messages - not present. 412 transient messages - only errors. Call MessageUtils.handleError.",
			activateDraftEntity: function(fnResolve, fnReject, params) {
				sap.ui.getCore().getMessageManager().removeAllMessages();
				params.oServices.oApplication.getTransientMessages.returns([
					{message: "Transient 412 error 01", type: MessageType.Error, technicalDetails: {statusCode: "412", headers: {"preference-applied": "handling=strict"}}},
				]);
				fnReject("activateDraftEntity.reject");
			},
			assertResolve: function(assert, params) {
				assert.ok(false, "... not ok. Code should reject.")
			},
			assertReject: function(assert, params) {
				assert.ok(params.oServices.oApplication.getTransientMessages.calledOnce, "Loaded transient messages.");
				assert.ok(params.oServices.oApplication.removeTransientMessages.notCalled, "Removed transient messages not called.");
				assert.ok(MessageUtils.handleError.calledOnce, "MessageUtils.handleError had been called.");
				assert.ok(sap.ui.getCore().getMessageManager().getMessageModel().bindList("/").getContexts().length === 0, "Correct message count in message model.");
			},
		},
		{
			title: "Activate draft - failed. New state messages - not present. 412 transient messages - warning + error. Remove transient messages and call oCRUDActionHandler.handleCRUDScenario with 412 warning messages.",
			activateDraftEntity: function(fnResolve, fnReject, params) {
				sap.ui.getCore().getMessageManager().removeAllMessages();
				params.oServices.oApplication.getTransientMessages.returns([
					{message: "Transient 412 warning 01", type: MessageType.Warning, technicalDetails: {statusCode: "412", headers: {"preference-applied": "handling=strict"}}},
					{message: "Transient 412 error 01", type: MessageType.Error, technicalDetails: {statusCode: "412", headers: {"preference-applied": "handling=strict"}}},
				]);
				fnReject("activateDraftEntity.reject");
			},
			assertResolve: function(assert, params) {
				assert.ok(false, "... not ok. Code should reject.")
			},
			assertReject: function(assert, params) {
				assert.ok(params.oServices.oApplication.getTransientMessages.calledOnce, "Loaded transient messages.");
				assert.ok(params.oServices.oApplication.registerCustomMessageProvider.calledOnce, "oServices.oApplication.registerCustomMessageProvider called.");
				assert.ok(params.oServices.oApplication.removeTransientMessages.calledOnce, "Removed transient messages.");
				assert.ok(params.oComponentUtils.oCRUDActionHandler.handleCRUDScenario.calledOnce, "oCRUDActionHandler.handleCRUDScenario has been called.");
				assert.ok(params.oComponentUtils.oCRUDActionHandler.handleCRUDScenario.firstCall.args[0] === 4, "oCRUDActionHandler.handleCRUDScenario has been called with correct (1) parameter");
				assert.ok(params.oComponentUtils.oCRUDActionHandler.handleCRUDScenario.firstCall.args[3] === "Activate", "oCRUDActionHandler.handleCRUDScenario has been called with correct (3) parameter");
				assert.ok(params.oComponentUtils.oCRUDActionHandler.handleCRUDScenario.firstCall.args[4].messagesForUserDecison[0].message === "Transient 412 warning 01", "oCRUDActionHandler.handleCRUDScenario has been called with correct message");
				assert.ok(params.oComponentUtils.oCRUDActionHandler.handleCRUDScenario.firstCall.args[4].messagesForUserDecison.length === 1, "oCRUDActionHandler.handleCRUDScenario has been called with correct message count");
				assert.ok(sap.ui.getCore().getMessageManager().getMessageModel().bindList("/").getContexts().length === 0, "Correct message count in message model.");
			},
		},
		{
			title: "Activate draft - failed. New state messages - only errors. 412 transient messages - no. Remove transient messages and show message popover.",
			activateDraftEntity: function(fnResolve, fnReject, params) {
				sap.ui.getCore().getMessageManager().removeAllMessages();
				addMessage({message: "NewMessage01", type: MessageType.Error, processor: params.processor, target: params.target, persistent: false});
				// No transient messages
				params.oServices.oApplication.getTransientMessages.returns([]);
				fnReject("activateDraftEntity.reject");
			},
			assertResolve: function(assert, params) {
				assert.ok(false, "... not ok. Code should reject.")
			},
			assertReject: function(assert, params) {
				assert.ok(params.oServices.oApplication.getTransientMessages.calledOnce, "Loaded transient messages.");
				assert.ok(params.oServices.oApplication.removeTransientMessages.calledOnce, "Removed transient messages.");
				assert.ok(params.oServices.oTemplateCapabilities.oMessageButtonHelper.showMessagePopover.calledOnce, "Show message popup.");
				assert.ok(sap.ui.getCore().getMessageManager().getMessageModel().bindList("/").getContexts().length === 1, "Correct message count in message model.");
			},
		},
		{
			title: "Activate draft - failed. New state messages - only errors. 412 transient messages - only warnings. Remove transient messages and show message popover.",
			activateDraftEntity: function(fnResolve, fnReject, params) {
				sap.ui.getCore().getMessageManager().removeAllMessages();
				addMessage({message: "NewMessage01", type: MessageType.Error, processor: params.processor, target: params.target, persistent: false});
				// No transient messages
				params.oServices.oApplication.getTransientMessages.returns([
					{message: "Transient 412 warning 01", type: MessageType.Warning, technicalDetails: {statusCode: "412", headers: {"preference-applied": "handling=strict"}}},
				]);
				fnReject("activateDraftEntity.reject");
			},
			assertResolve: function(assert, params) {
				assert.ok(false, "... not ok. Code should reject.")
			},
			assertReject: function(assert, params) {
				assert.ok(params.oServices.oApplication.getTransientMessages.calledOnce, "Loaded transient messages.");
				assert.ok(params.oServices.oApplication.removeTransientMessages.calledOnce, "Removed transient messages.");
				assert.ok(params.oServices.oTemplateCapabilities.oMessageButtonHelper.showMessagePopover.calledOnce, "Show message popup.");
				assert.ok(sap.ui.getCore().getMessageManager().getMessageModel().bindList("/").getContexts().length === 1, "Correct message count in message model.");
			},
		},
		{
			title: "Activate draft - failed. New state messages - only errors. 412 transient messages - only errors. Remove transient messages and show message popover.",
			activateDraftEntity: function(fnResolve, fnReject, params) {
				sap.ui.getCore().getMessageManager().removeAllMessages();
				addMessage({message: "NewMessage01", type: MessageType.Error, processor: params.processor, target: params.target, persistent: false});
				// No transient messages
				params.oServices.oApplication.getTransientMessages.returns([
					{message: "Transient 412 error 01", type: MessageType.Error, technicalDetails: {statusCode: "412", headers: {"preference-applied": "handling=strict"}}},
				]);
				fnReject("activateDraftEntity.reject");
			},
			assertResolve: function(assert, params) {
				assert.ok(false, "... not ok. Code should reject.")
			},
			assertReject: function(assert, params) {
				assert.ok(params.oServices.oApplication.getTransientMessages.calledOnce, "Loaded transient messages.");
				assert.ok(params.oServices.oApplication.removeTransientMessages.calledOnce, "Removed transient messages.");
				assert.ok(params.oServices.oTemplateCapabilities.oMessageButtonHelper.showMessagePopover.calledOnce, "Show message popup.");
				assert.ok(sap.ui.getCore().getMessageManager().getMessageModel().bindList("/").getContexts().length === 1, "Correct message count in message model.");
			},
		},
		{
			title: "Activate draft - failed. New state messages - only errors. 412 transient messages - warnings + errors. Remove transient messages and show message popover.",
			activateDraftEntity: function(fnResolve, fnReject, params) {
				sap.ui.getCore().getMessageManager().removeAllMessages();
				addMessage({message: "NewMessage01", type: MessageType.Error, processor: params.processor, target: params.target, persistent: false});
				// No transient messages
				params.oServices.oApplication.getTransientMessages.returns([
					{message: "Transient 412 warning 01", type: MessageType.Error, technicalDetails: {statusCode: "412", headers: {"preference-applied": "handling=strict"}}},
					{message: "Transient 412 error 01", type: MessageType.Error, technicalDetails: {statusCode: "412", headers: {"preference-applied": "handling=strict"}}},
				]);
				fnReject("activateDraftEntity.reject");
			},
			assertResolve: function(assert, params) {
				assert.ok(false, "... not ok. Code should reject.")
			},
			assertReject: function(assert, params) {
				assert.ok(params.oServices.oApplication.getTransientMessages.calledOnce, "Loaded transient messages.");
				assert.ok(params.oServices.oApplication.removeTransientMessages.calledOnce, "Removed transient messages.");
				assert.ok(params.oServices.oTemplateCapabilities.oMessageButtonHelper.showMessagePopover.calledOnce, "Show message popup.");
				assert.ok(sap.ui.getCore().getMessageManager().getMessageModel().bindList("/").getContexts().length === 1, "Correct message count in message model.");
			},
		},
		{
			title: "Activate draft - failed. New state messages - only warnings. 412 transient messages - no. Call MessageUtils.handleError to handle warnings.",
			activateDraftEntity: function(fnResolve, fnReject, params) {
				sap.ui.getCore().getMessageManager().removeAllMessages();
				addMessage({message: "NewMessage01", type: MessageType.Warning, processor: params.processor, target: params.target, persistent: false});
				// No transient messages
				params.oServices.oApplication.getTransientMessages.returns([]);
				fnReject("activateDraftEntity.reject");
			},
			assertResolve: function(assert, params) {
				assert.ok(false, "... not ok. Code should reject.")
			},
			assertReject: function(assert, params) {
				assert.ok(params.oServices.oApplication.getTransientMessages.calledOnce, "Loaded transient messages.");
				assert.ok(params.oServices.oApplication.removeTransientMessages.notCalled, "Removed transient messages not called.");
				assert.ok(MessageUtils.handleError.calledOnce, "MessageUtils.handleError had been called.");
				assert.ok(sap.ui.getCore().getMessageManager().getMessageModel().bindList("/").getContexts().length === 1, "Correct message count in message model.");
			},
		},
		{
			title: "Activate draft - failed. New state messages - only warnings. 412 transient messages - only warnings. Remove transient messages and call oCRUDActionHandler.handleCRUDScenario with state warning messages.",
			activateDraftEntity: function(fnResolve, fnReject, params) {
				sap.ui.getCore().getMessageManager().removeAllMessages();
				addMessage({message: "NewMessage01", type: MessageType.Warning, processor: params.processor, target: params.target, persistent: false});
				// No transient messages
				params.oServices.oApplication.getTransientMessages.returns([
					{message: "Transient 412 warning 01", type: MessageType.Warning, technicalDetails: {statusCode: "412", headers: {"preference-applied": "handling=strict"}}},
				]);
				fnReject("activateDraftEntity.reject");
			},
			assertResolve: function(assert, params) {
				assert.ok(false, "... not ok. Code should reject.")
			},
			assertReject: function(assert, params) {
				assert.ok(params.oServices.oApplication.getTransientMessages.calledOnce, "Loaded transient messages.");
				assert.ok(params.oServices.oApplication.registerCustomMessageProvider.notCalled, "oServices.oApplication.registerCustomMessageProvider not called.");
				assert.ok(params.oServices.oApplication.removeTransientMessages.calledOnce, "Removed transient messages.");
				assert.ok(params.oComponentUtils.oCRUDActionHandler.handleCRUDScenario.calledOnce, "oCRUDActionHandler.handleCRUDScenario has been called.");
				assert.ok(params.oComponentUtils.oCRUDActionHandler.handleCRUDScenario.firstCall.args[0] === 4, "oCRUDActionHandler.handleCRUDScenario has been called with correct (1) parameter");
				assert.ok(params.oComponentUtils.oCRUDActionHandler.handleCRUDScenario.firstCall.args[3] === "Activate", "oCRUDActionHandler.handleCRUDScenario has been called with correct (3) parameter");
				assert.ok(params.oComponentUtils.oCRUDActionHandler.handleCRUDScenario.firstCall.args[4].messagesForUserDecison[0].message === "NewMessage01", "oCRUDActionHandler.handleCRUDScenario has been called with correct message");
				assert.ok(params.oComponentUtils.oCRUDActionHandler.handleCRUDScenario.firstCall.args[4].messagesForUserDecison.length === 1, "oCRUDActionHandler.handleCRUDScenario has been called with correct message count");
				assert.ok(sap.ui.getCore().getMessageManager().getMessageModel().bindList("/").getContexts().length === 1, "Correct message count in message model.");
			},
		},
		{
			title: "Activate draft - failed. New state messages - only warnings. 412 transient messages - only errors. Remove transient messages and call oCRUDActionHandler.handleCRUDScenario with state warning messages.",
			activateDraftEntity: function(fnResolve, fnReject, params) {
				sap.ui.getCore().getMessageManager().removeAllMessages();
				addMessage({message: "NewMessage01", type: MessageType.Warning, processor: params.processor, target: params.target, persistent: false});
				// No transient messages
				params.oServices.oApplication.getTransientMessages.returns([
					{message: "Transient 412 error 01", type: MessageType.Error, technicalDetails: {statusCode: "412", headers: {"preference-applied": "handling=strict"}}},
				]);
				fnReject("activateDraftEntity.reject");
			},
			assertResolve: function(assert, params) {
				assert.ok(false, "... not ok. Code should reject.")
			},
			assertReject: function(assert, params) {
				assert.ok(params.oServices.oApplication.getTransientMessages.calledOnce, "Loaded transient messages.");
				assert.ok(params.oServices.oApplication.registerCustomMessageProvider.notCalled, "oServices.oApplication.registerCustomMessageProvider not called.");
				assert.ok(params.oServices.oApplication.removeTransientMessages.calledOnce, "Removed transient messages.");
				assert.ok(params.oComponentUtils.oCRUDActionHandler.handleCRUDScenario.calledOnce, "oCRUDActionHandler.handleCRUDScenario has been called.");
				assert.ok(params.oComponentUtils.oCRUDActionHandler.handleCRUDScenario.firstCall.args[0] === 4, "oCRUDActionHandler.handleCRUDScenario has been called with correct (1) parameter");
				assert.ok(params.oComponentUtils.oCRUDActionHandler.handleCRUDScenario.firstCall.args[3] === "Activate", "oCRUDActionHandler.handleCRUDScenario has been called with correct (3) parameter");
				assert.ok(params.oComponentUtils.oCRUDActionHandler.handleCRUDScenario.firstCall.args[4].messagesForUserDecison[0].message === "NewMessage01", "oCRUDActionHandler.handleCRUDScenario has been called with correct message");
				assert.ok(params.oComponentUtils.oCRUDActionHandler.handleCRUDScenario.firstCall.args[4].messagesForUserDecison.length === 1, "oCRUDActionHandler.handleCRUDScenario has been called with correct message count");
				assert.ok(sap.ui.getCore().getMessageManager().getMessageModel().bindList("/").getContexts().length === 1, "Correct message count in message model.");
			},
		},
		{
			title: "Activate draft - failed. New state messages - only warnings. 412 transient messages - warning + errors. Remove transient messages and call oCRUDActionHandler.handleCRUDScenario with state warning messages.",
			activateDraftEntity: function(fnResolve, fnReject, params) {
				sap.ui.getCore().getMessageManager().removeAllMessages();
				addMessage({message: "NewMessage01", type: MessageType.Warning, processor: params.processor, target: params.target, persistent: false});
				// No transient messages
				params.oServices.oApplication.getTransientMessages.returns([
					{message: "Transient 412 warning 01", type: MessageType.Warning, technicalDetails: {statusCode: "412", headers: {"preference-applied": "handling=strict"}}},
					{message: "Transient 412 error 01", type: MessageType.Error, technicalDetails: {statusCode: "412", headers: {"preference-applied": "handling=strict"}}},
				]);
				fnReject("activateDraftEntity.reject");
			},
			assertResolve: function(assert, params) {
				assert.ok(false, "... not ok. Code should reject.")
			},
			assertReject: function(assert, params) {
				assert.ok(params.oServices.oApplication.getTransientMessages.calledOnce, "Loaded transient messages.");
				assert.ok(params.oServices.oApplication.registerCustomMessageProvider.notCalled, "oServices.oApplication.registerCustomMessageProvider not called.");
				assert.ok(params.oServices.oApplication.removeTransientMessages.calledOnce, "Removed transient messages.");
				assert.ok(params.oComponentUtils.oCRUDActionHandler.handleCRUDScenario.calledOnce, "oCRUDActionHandler.handleCRUDScenario has been called.");
				assert.ok(params.oComponentUtils.oCRUDActionHandler.handleCRUDScenario.firstCall.args[0] === 4, "oCRUDActionHandler.handleCRUDScenario has been called with correct (1) parameter");
				assert.ok(params.oComponentUtils.oCRUDActionHandler.handleCRUDScenario.firstCall.args[3] === "Activate", "oCRUDActionHandler.handleCRUDScenario has been called with correct (3) parameter");
				assert.ok(params.oComponentUtils.oCRUDActionHandler.handleCRUDScenario.firstCall.args[4].messagesForUserDecison[0].message === "NewMessage01", "oCRUDActionHandler.handleCRUDScenario has been called with correct message");
				assert.ok(params.oComponentUtils.oCRUDActionHandler.handleCRUDScenario.firstCall.args[4].messagesForUserDecison.length === 1, "oCRUDActionHandler.handleCRUDScenario has been called with correct message count");
				assert.ok(sap.ui.getCore().getMessageManager().getMessageModel().bindList("/").getContexts().length === 1, "Correct message count in message model.");
			},
		},
		{
			title: "Activate draft - failed. New state messages - warnings + errors. 412 transient messages - no. Remove transient messages and show message popover.",
			activateDraftEntity: function(fnResolve, fnReject, params) {
				sap.ui.getCore().getMessageManager().removeAllMessages();
				addMessage({message: "NewMessage01", type: MessageType.Warning, processor: params.processor, target: params.target, persistent: false});
				addMessage({message: "NewMessage02", type: MessageType.Error, processor: params.processor, target: params.target, persistent: false});
				// No transient messages
				params.oServices.oApplication.getTransientMessages.returns([]);
				fnReject("activateDraftEntity.reject");
			},
			assertResolve: function(assert, params) {
				assert.ok(false, "... not ok. Code should reject.")
			},
			assertReject: function(assert, params) {
				assert.ok(params.oServices.oApplication.getTransientMessages.calledOnce, "Loaded transient messages.");
				assert.ok(params.oServices.oApplication.removeTransientMessages.calledOnce, "Removed transient messages.");
				assert.ok(params.oServices.oTemplateCapabilities.oMessageButtonHelper.showMessagePopover.calledOnce, "Show message popup.");
				assert.ok(sap.ui.getCore().getMessageManager().getMessageModel().bindList("/").getContexts().length === 2, "Correct message count in message model.");
			},
		},
		{
			title: "Activate draft - failed. New state messages - warnings + errors. 412 transient messages - only warning. Remove transient messages and show message popover.",
			activateDraftEntity: function(fnResolve, fnReject, params) {
				sap.ui.getCore().getMessageManager().removeAllMessages();
				addMessage({message: "NewMessage01", type: MessageType.Warning, processor: params.processor, target: params.target, persistent: false});
				addMessage({message: "NewMessage02", type: MessageType.Error, processor: params.processor, target: params.target, persistent: false});
				// No transient messages
				params.oServices.oApplication.getTransientMessages.returns([
					{message: "Transient 412 warning 01", type: MessageType.Warning, technicalDetails: {statusCode: "412", headers: {"preference-applied": "handling=strict"}}},
				]);
				fnReject("activateDraftEntity.reject");
			},
			assertResolve: function(assert, params) {
				assert.ok(false, "... not ok. Code should reject.")
			},
			assertReject: function(assert, params) {
				assert.ok(params.oServices.oApplication.getTransientMessages.calledOnce, "Loaded transient messages.");
				assert.ok(params.oServices.oApplication.removeTransientMessages.calledOnce, "Removed transient messages.");
				assert.ok(params.oServices.oTemplateCapabilities.oMessageButtonHelper.showMessagePopover.calledOnce, "Show message popup.");
				assert.ok(sap.ui.getCore().getMessageManager().getMessageModel().bindList("/").getContexts().length === 2, "Correct message count in message model.");
			},
		},
		{
			title: "Activate draft - failed. New state messages - warnings + errors. 412 transient messages - only error. Remove transient messages and show message popover.",
			activateDraftEntity: function(fnResolve, fnReject, params) {
				sap.ui.getCore().getMessageManager().removeAllMessages();
				addMessage({message: "NewMessage01", type: MessageType.Warning, processor: params.processor, target: params.target, persistent: false});
				addMessage({message: "NewMessage02", type: MessageType.Error, processor: params.processor, target: params.target, persistent: false});
				// No transient messages
				params.oServices.oApplication.getTransientMessages.returns([
					{message: "Transient 412 error 01", type: MessageType.Error, technicalDetails: {statusCode: "412", headers: {"preference-applied": "handling=strict"}}},
				]);
				fnReject("activateDraftEntity.reject");
			},
			assertResolve: function(assert, params) {
				assert.ok(false, "... not ok. Code should reject.")
			},
			assertReject: function(assert, params) {
				assert.ok(params.oServices.oApplication.getTransientMessages.calledOnce, "Loaded transient messages.");
				assert.ok(params.oServices.oApplication.removeTransientMessages.calledOnce, "Removed transient messages.");
				assert.ok(params.oServices.oTemplateCapabilities.oMessageButtonHelper.showMessagePopover.calledOnce, "Show message popup.");
				assert.ok(sap.ui.getCore().getMessageManager().getMessageModel().bindList("/").getContexts().length === 2, "Correct message count in message model.");
			},
		},
		{
			title: "Activate draft - failed. New state messages - warnings + errors. 412 transient messages - warning + error. Remove transient messages and show message popover.",
			activateDraftEntity: function(fnResolve, fnReject, params) {
				sap.ui.getCore().getMessageManager().removeAllMessages();
				addMessage({message: "NewMessage01", type: MessageType.Warning, processor: params.processor, target: params.target, persistent: false});
				addMessage({message: "NewMessage02", type: MessageType.Error, processor: params.processor, target: params.target, persistent: false});
				// No transient messages
				params.oServices.oApplication.getTransientMessages.returns([
					{message: "Transient 412 warning 01", type: MessageType.Warning, technicalDetails: {statusCode: "412", headers: {"preference-applied": "handling=strict"}}},
					{message: "Transient 412 error 01", type: MessageType.Error, technicalDetails: {statusCode: "412", headers: {"preference-applied": "handling=strict"}}},
				]);
				fnReject("activateDraftEntity.reject");
			},
			assertResolve: function(assert, params) {
				assert.ok(false, "... not ok. Code should reject.")
			},
			assertReject: function(assert, params) {
				assert.ok(params.oServices.oApplication.getTransientMessages.calledOnce, "Loaded transient messages.");
				assert.ok(params.oServices.oApplication.removeTransientMessages.calledOnce, "Removed transient messages.");
				assert.ok(params.oServices.oTemplateCapabilities.oMessageButtonHelper.showMessagePopover.calledOnce, "Show message popup.");
				assert.ok(sap.ui.getCore().getMessageManager().getMessageModel().bindList("/").getContexts().length === 2, "Correct message count in message model.");
			},
		},
	].forEach(function(data) {
		QUnit.test(data.title, function(assert) {
			// prepare
			var done = assert.async(),
				processor = new JSONModel(),
				target = "/object1",
				oCreateDialogContext = "context",
				oCreateWithDialogFilter = new Filter({
					path: "aTargets",
					test: function(aTargets) {
						return aTargets.some(function(sTarget){
							return sTarget.startsWith(target);
						});
					}
				}),
				oBusyHelper = getBusyHelper(),
				oServices = getServices(),
				oController = getController(),
				oComponentUtils = getComponentUtils();

			sandbox.stub(CacheHelper, "getInfoForContentIdPromise", function() {
				return Promise.resolve({
					contentIdRequestPossible: true,
					parametersForContentIdRequest: {
						sRootExpand : "to_dummyContext1,to_dummyContext2"
					}
				});
			});
			sandbox.stub(MessageUtils, "handleError");
			// add messages before save
			addMessage({message: "PreviousMessage01", type: MessageType.Error, processor: processor, target: target, persistent: false});
			oServices.oApplication.getDraftSiblingPromise.returns(Promise.resolve(false));

			// execute
			var oPromise = CRUDHelper.activateDraftEntity(oCreateDialogContext, oCreateWithDialogFilter, oBusyHelper, oServices, oController, oComponentUtils);
			var fnResolve, fnReject,
			oPromise = new Promise(function(resolve, reject) {
				fnResolve = resolve;
				fnReject = reject;
			});
			oServices.oDraftController.activateDraftEntity.returns(oPromise);
			setTimeout(function() {
				data.activateDraftEntity(fnResolve, fnReject, {oServices, oComponentUtils, processor, target});
				// assert
				oPromise
					.then(function(result) {
						data.assertResolve(assert, {result});
						done();
					})
					.catch(function(error) {
						data.assertReject(assert, {oServices, oComponentUtils});
						done();
					});
			}, 0);
		});
	});

	function getBusyHelper() {
		return {
			isBusy: sinon.stub().returns(false),
			setBusy: sinon.stub(),
		};
	};

	function getController() {
		var oView = getView(),
			oOwnerComponent = getOwnerComponent();
		return {
			oView: oView,
			oOwnerComponent: oOwnerComponent,
			getView: sinon.stub().returns(oView),
			getOwnerComponent: sinon.stub().returns(oOwnerComponent),
		};
	};

	function getView() {
		return {
			getBindingContext: sinon.stub(),
			getModel: sinon.stub(),
		};
	};

	function getOwnerComponent() {
		var oAppComponent = getAppComponent();
		return {
			oAppComponent: oAppComponent,
			getEntitySet: sinon.stub(),
			getAppComponent: sinon.stub().returns(oAppComponent),
		};
	};

	function getAppComponent() {
		return {
			getId: sinon.stub(),
		};
	};

	function getServices() {
		return {
			oApplication: {
				getDraftSiblingPromise: sinon.stub(),
				activationStarted: sinon.stub(),
				getTransientMessages: sinon.stub(),
				removeTransientMessages: sinon.stub(),
				registerCustomMessageProvider: sinon.stub(),
			},
			oDraftController: {
				activateDraftEntity: sinon.stub(),
			},
			oTemplateCapabilities: {
				oMessageButtonHelper: {
					showMessagePopover: sinon.stub(),
				}
			}
		};
	};

	function addMessage(oMessage) {
		sap.ui
			.getCore()
			.getMessageManager()
			.addMessages(
				new Message({
					message: oMessage.message,
					description: oMessage.message + " Description",
					type: oMessage.type,
					processor: oMessage.processor,
					target: oMessage.target,
					persistent: oMessage.persistent !== undefined ? oMessage.persistent : false,
				})
			);
	}

	function getComponentUtils() {
		var oCRUDActionHandler = getCRUDActionHandler();
		return {
			oCRUDActionHandler: oCRUDActionHandler,
			getRootExpand: "oComponentUtils.getRootExpand",
			getCRUDActionHandler: sinon.stub().returns(oCRUDActionHandler)
		};
	}

	function getCRUDActionHandler() {
		return {
			handleCRUDScenario: sinon.stub()
		}
	}
});
