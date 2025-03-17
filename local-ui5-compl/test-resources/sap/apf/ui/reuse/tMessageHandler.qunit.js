/*global sinon */
sap.ui.define([
	"sap/apf/core/messageHandler",
	"sap/apf/testhelper/doubles/UiInstance",
	"sap/apf/testhelper/doubles/createUiApiAsPromise",
	"sap/base/Log",
	"sap/m/Dialog",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/mvc/View",
	"sap/ui/qunit/utils/nextUIUpdate",
	"sap/ui/thirdparty/jquery"
], function(MessageHandler, UiInstance, createUiApiAsPromise, Log, Dialog, MessageBox, MessageToast, Controller, View, nextUIUpdate, jQuery) {
	"use strict";
	var oGlobalApi, oView, oMessageObject, getTextSpy;
	function doNothing() {
	}
	function makeFatalErrorMessage(oCoreApiOrMessageHandler) {
			var oMessageObject = oCoreApiOrMessageHandler.createMessageObject({
				code : "10001"
			});
			oMessageObject.setSeverity("fatal");
			oMessageObject.setMessage("This is Fatal Message");
			return oMessageObject;
	}
	QUnit.module('Message Handler', {
		beforeEach : function(assert) {
			var done = assert.async();

			createUiApiAsPromise().done(async function(api){
				oGlobalApi = api;
				oView = await oGlobalApi.oUiApi.loadNotificationBar();
				getTextSpy = sinon.spy(oGlobalApi.oCoreApi, "getTextNotHtmlEncoded");
				oMessageObject = oGlobalApi.oCoreApi.createMessageObject({
					code : "10001"
				});
				done();
			});
		},
		afterEach : function() {
			oMessageObject = null;
			getTextSpy.restore();
			oView.destroy();
			oGlobalApi.oCompContainer.destroy();
		}
	});
	QUnit.test('When Calling show Message with Information Message', function(assert) {
		//arrangement
		var stubMessageBox;
		// spy on sap.m.MessageBox whilst muting side effects from SAP UI
		stubMessageBox = sinon.stub(MessageBox, 'information', doNothing);
		oMessageObject.setSeverity("information");
		oMessageObject.setMessage("This is an Information Message");

		//action
		oView.getController().showMessage(oMessageObject);

		//assert
		assert.ok(oMessageObject, "then Message Object created");
		assert.strictEqual(stubMessageBox.called, true, "then Message Toast shown");
		assert.strictEqual(stubMessageBox.getCall(0).args[0], "This is an Information Message", "then Message Box is opened on UI");

		//clean up
		stubMessageBox.restore();
	});
	QUnit.test('When Calling show Message with Error Message', function(assert) {
		//arrangement
		var stubMessageToastShow;
		stubMessageToastShow = sinon.stub(MessageToast, 'show', doNothing);
		oMessageObject.setSeverity("error");
		oMessageObject.setMessage("This is an Error Message");
		//action
		oView.getController().showMessage(oMessageObject);
		//assert
		assert.ok(oMessageObject, "then Error Message Object created");
		assert.strictEqual(stubMessageToastShow.called, true, "then Message Toast shown");
		assert.strictEqual(stubMessageToastShow.getCall(0).args[0], "This is an Error Message", "then Message Toast shown");
		//cleanup
		stubMessageToastShow.restore();
	});
	QUnit.test('When Calling show Message with Warning Message', function(assert) {
		//arrangement
		var stubMessageToastShow;
		stubMessageToastShow = sinon.stub(MessageToast, 'show', doNothing);
		oMessageObject.setSeverity("warning");
		oMessageObject.setMessage("This is Warning Message");
		//action
		oView.getController().showMessage(oMessageObject);
		//assert
		assert.ok(oMessageObject, "then Warning Message Object created");
		assert.strictEqual(stubMessageToastShow.called, true, "then Message Toast shown");
		assert.strictEqual(stubMessageToastShow.getCall(0).args[0], "This is Warning Message", "then Warning text is shown in toast");
		//cleanup
		MessageToast.show.restore();
	});
	QUnit.test('When calling show Message with Unknown Message', function(assert) {
		//arrangement
		var stubUnknownError;
		stubUnknownError = sinon.stub(Log, 'error', doNothing);
		oMessageObject.setSeverity("Unknown");
		oMessageObject.setMessage("This is Unknown Message");
		//action
		oView.getController().showMessage(oMessageObject);
		//assert
		assert.ok(oMessageObject, "then Unknown Message Object created");
		assert.strictEqual(stubUnknownError.called, true, "then unknown error is logged on console");
		//cleanup
		stubUnknownError.restore();
	});
	QUnit.test('When Session Timeout happens', async function(assert) {
		//arrangement
		var navToPrevPageSpy, oFatalDialog, isApfStateAvailableStub, getLogMessagesSpy;
		getLogMessagesSpy = sinon.stub(oGlobalApi.oCoreApi, 'getLogMessages', function() {
			return [ "5021", "101", "100" ];
		});
		isApfStateAvailableStub = sinon.stub(oGlobalApi.oCoreApi, 'isApfStateAvailable', function() {
			return false;
		});
		navToPrevPageSpy = sinon.stub(window.history, 'go', doNothing);
		oMessageObject.setSeverity("fatal");
		oMessageObject.setMessage("This is Fatal Message");
		//action
		oView.getController().showMessage(oMessageObject);
		oFatalDialog = oView.getController().byId("idFatalDialog");
		//assert
		assert.strictEqual(oFatalDialog.isOpen(), true, "then Error dialog is open");
		assert.strictEqual(getTextSpy.calledWith("error"), true, "then the title of dialog is fatal");
		oFatalDialog.getBeginButton().firePress();
		await nextUIUpdate();
		assert.strictEqual(navToPrevPageSpy.calledOnce, true, "then navigates to previous page");
		assert.strictEqual(getTextSpy.calledWith("application-reload"), true, "then message shown in popup for session timeout is shown correctly");
		// cleanups
		getLogMessagesSpy.restore();
		isApfStateAvailableStub.restore();
		navToPrevPageSpy.restore();
		oFatalDialog.destroy();
	});
	QUnit.test('When Fatal Error Happens and there is no last good valid state available', async function(assert) {
		//arrangement
		var oShowDetailsDialog, navToPrevPageSpy, oFatalDialog;
		sinon.stub(oGlobalApi.oCoreApi, 'isApfStateAvailable', function() {
			return false;
		});
		navToPrevPageSpy = sinon.stub(window.history, 'go', doNothing);
		oMessageObject.setSeverity("fatal");
		oMessageObject.setMessage("This is a Fatal Message");
		//action
		oView.getController().showMessage(oMessageObject);
		//assert
		oFatalDialog = oView.getController().byId("idFatalDialog");
		assert.ok(oMessageObject, "then Fatal Message Object created");
		assert.strictEqual(oFatalDialog.isOpen(), true, "then fatal error dialog is open");
		assert.strictEqual(getTextSpy.calledWith("error"), true, "then the title of dialog is fatal");
		assert.strictEqual(getTextSpy.calledWith("showDetails"), true, "then show details link is present inside the dialog");
		assert.strictEqual(getTextSpy.calledWith("close"), true, "then close button is present in the dialog ");
		assert.strictEqual(getTextSpy.calledWith("fatalErrorMessage"), true, "then fatal message is displayed in the dialog");
		//action - Click show details link
		oFatalDialog.getContent()[1].getItems()[0].firePress();
		//assert
		oShowDetailsDialog = oView.getController().byId("idShowDetailsDialog");
		assert.strictEqual(oShowDetailsDialog.isOpen(), true, "then Show Details dialog is opened on Ui");
		assert.strictEqual(getTextSpy.calledWith("close"), true, "then close button is present in the dialog ");
		//action - close the show details dialog and fatal dialog
		oShowDetailsDialog.getBeginButton().firePress();
		await nextUIUpdate();
		oFatalDialog.getBeginButton().firePress();
		await nextUIUpdate();
		//assert
		assert.strictEqual(navToPrevPageSpy.calledOnce, true, "then navigates to previous page");
		// cleanups
		navToPrevPageSpy.restore();
		oShowDetailsDialog.destroy();
		oFatalDialog.destroy();
	});
	QUnit.test('When Fatal Error happens,last valid state is available and on clicking on last valid state button in dialog ', async function(assert) {
		//arrangement
		var oShowDetailsDialog, oDeferred, updatePathSpy, setTitleSpy, removeallStepsSpy, carouselRerenderSpy, oShowValidStateDialog;
		sinon.stub(oGlobalApi.oCoreApi, 'isApfStateAvailable', function() {
			return true;
		});
		sinon.stub(oGlobalApi.oCoreApi, 'restoreApfState', function() {
			oDeferred = new jQuery.Deferred();
			return oDeferred.promise();
		});
		updatePathSpy = sinon.spy(oGlobalApi.oCoreApi, "updatePath");
		setTitleSpy = sinon.spy(oGlobalApi.oUiApi.getLayoutView().getController(), "setPathTitle");
		removeallStepsSpy = sinon.spy(oGlobalApi.oUiApi.getAnalysisPath().getCarouselView().getController(), "removeAllThumbnails");
		carouselRerenderSpy = sinon.spy(oGlobalApi.oUiApi.getAnalysisPath().getCarouselView(), "rerender");
		oMessageObject.setSeverity("fatal");
		oMessageObject.setMessage("This is a Fatal Message");
		//action
		oView.getController().showMessage(oMessageObject);
		//assert
		oShowValidStateDialog = oView.getController().byId("idShowValidStateDialog");
		assert.ok(oMessageObject, "then Fatal Message Object created");
		assert.strictEqual(oShowValidStateDialog.isOpen(), true, "then valid state dialog is open");
		assert.strictEqual(getTextSpy.calledWith("error"), true, "then the title of dialog is fatal");
		assert.strictEqual(getTextSpy.calledWith("showDetails"), true, "then show details link is present inside the dialog");
		assert.strictEqual(getTextSpy.calledWith("gobackToValidState"), true, "then button to go back to the valid state is present in the dialog ");
		assert.strictEqual(getTextSpy.calledWith("startNewAnalysis"), true, "then button to refresh the analysis path is present in the dialog ");
		assert.strictEqual(getTextSpy.calledWith("lastValidStateMessage"), true, "then fatal message is displayed in the dialog");
		//action - Click show details link
		oShowValidStateDialog.getContent()[1].getItems()[0].firePress();
		//assert
		oShowDetailsDialog = oView.getController().byId("idShowDetailsDialog");
		assert.strictEqual(oShowDetailsDialog.isOpen(), true, "then Show Details dialog is opened on Ui");
		assert.strictEqual(getTextSpy.calledWith("close"), true, "then close button is present in the dialog ");
		//action - close the show details dialog and click on button to go back to the last valid state
		oShowDetailsDialog.getBeginButton().firePress();
		await nextUIUpdate();
		oShowValidStateDialog.getBeginButton().firePress();
		oDeferred.resolve();
		await nextUIUpdate();
		//assert
		assert.strictEqual(updatePathSpy.calledOnce, true, "then path is updated");
		assert.strictEqual(setTitleSpy.calledOnce, true, "then title is set to the analysis path");
		assert.strictEqual(removeallStepsSpy.calledOnce, true, "then path all steps in path are removed");
		assert.strictEqual(carouselRerenderSpy.calledOnce, true, "then carousel is rerendered");
		// cleanups
		updatePathSpy.restore();
		setTitleSpy.restore();
		removeallStepsSpy.restore();
		carouselRerenderSpy.restore();
		oShowDetailsDialog.destroy();
		oShowValidStateDialog.destroy();
	});
	QUnit.test('When Fatal Error happens,last valid state is available and on clicking new path button in dialog ', async function(assert) {
		//arrangement
		var oShowValidStateDialog, oShowDetailsDialog, resetAnalysisPathSpy;
		sinon.stub(oGlobalApi.oCoreApi, 'isApfStateAvailable', function() {
			return true;
		});
		resetAnalysisPathSpy = sinon.spy(oGlobalApi.oUiApi.getAnalysisPath().getToolbar().getController(), "resetAnalysisPath");
		oMessageObject.setSeverity("fatal");
		oMessageObject.setMessage("This is a Fatal Message");
		//action
		oView.getController().showMessage(oMessageObject);
		//assert
		oShowValidStateDialog = oView.getController().byId("idShowValidStateDialog");
		assert.ok(oMessageObject, "then Fatal Message Object created");
		assert.strictEqual(oShowValidStateDialog.isOpen(), true, "then valid state dialog is open");
		assert.strictEqual(getTextSpy.calledWith("error"), true, "then the title of dialog is fatal");
		assert.strictEqual(getTextSpy.calledWith("showDetails"), true, "then show details link is present inside the dialog");
		assert.strictEqual(getTextSpy.calledWith("gobackToValidState"), true, "then button to go back to the valid state is present in the dialog ");
		assert.strictEqual(getTextSpy.calledWith("startNewAnalysis"), true, "then button to refresh the analysis path is present in the dialog ");
		assert.strictEqual(getTextSpy.calledWith("lastValidStateMessage"), true, "then fatal message is displayed in the dialog");
		//action - Click show details link
		oShowValidStateDialog.getContent()[1].getItems()[0].firePress();
		//assert
		oShowDetailsDialog = oView.getController().byId("idShowDetailsDialog");
		assert.strictEqual(oShowDetailsDialog.isOpen(), true, "then Show Details dialog is opened on Ui");
		assert.strictEqual(getTextSpy.calledWith("close"), true, "then close button is present in the dialog ");
		//action - close the show details dialog and click on new button to refresh the analysis path
		oShowDetailsDialog.getBeginButton().firePress();
		await nextUIUpdate();
		oShowValidStateDialog.getEndButton().firePress();
		await nextUIUpdate();
		//assert
		assert.strictEqual(resetAnalysisPathSpy.calledOnce, true, "then path is resetted");
		// cleanups
		resetAnalysisPathSpy.restore();
		oShowDetailsDialog.destroy();
		oShowValidStateDialog.destroy();
	});

	QUnit.module("MessageHandler closeFatalErrorDialog Injection");

	QUnit.test("When closeFatalErrorDialog is not injected Then the Error Dialog is opened", function(assert) {
		var done = assert.async();

		// arrangement
		createUiApiAsPromise(null, null, {}).done(async function(oGlobalApi) {
			var oView = await oGlobalApi.oUiApi.loadNotificationBar();
			var oMessageObject = makeFatalErrorMessage(oGlobalApi.oCoreApi)

			// action
			oView.getController().showMessage(oMessageObject);
			var oFatalDialog = oView.getController().byId("idFatalDialog");

			// assert
			assert.strictEqual(oFatalDialog.isOpen(), true, "then Error dialog is open");

			// cleanup
			oFatalDialog.destroy();
			oGlobalApi.oCompContainer.destroy();
			done();
		});
	});
	QUnit.test("Given closeFatalErrorDialog is not injected When the dialog is dismissed Then history.go is called", function(assert) {
		// arrangement
		var navToPrevPageSpy = sinon.stub(window.history, 'go', doNothing);
		return View.create({
			viewName: "module:sap/apf/ui/reuse/view/messageHandler.view",
			viewData: {
				oCoreApi: {
					isApfStateAvailable: function() { return false; },
					getLogMessages: function() { return []; },
					getTextNotHtmlEncoded: function(t) { return t; },
					getGenericExit: function() { return undefined; }
				},
				uiApi: {
					getLayoutView: function() { return { setBusy: doNothing }; }
				}
			}
		}).then(async function(oView) {
			// action
			oView.getController().showMessage(makeFatalErrorMessage(new MessageHandler()));
			oView.byId("idFatalDialog").getBeginButton().firePress();
			await nextUIUpdate();

			// assert
			assert.strictEqual(navToPrevPageSpy.calledOnce, true, "then navigates to previous page");
			// cleanup
			navToPrevPageSpy.restore();
		});
	});

	QUnit.test("When closeFatalErrorDialog is injected Then the Error Dialog is opened", function(assert) {
		var done = assert.async();
		var closeFatalErrorDialog = sinon.spy();

		// arrangement
		createUiApiAsPromise(null, null, {
			exits: {
				closeFatalErrorDialog: closeFatalErrorDialog
			}
		}).done(async function(oGlobalApi) {
			var oView = await oGlobalApi.oUiApi.loadNotificationBar();
			var oMessageObject = makeFatalErrorMessage(oGlobalApi.oCoreApi);

			// action
			oView.getController().showMessage(oMessageObject);
			var oFatalDialog = oView.getController().byId("idFatalDialog");

			// assert
			assert.strictEqual(oFatalDialog.isOpen(), true, "then Error dialog is open");

			// cleanup
			oFatalDialog.destroy();
			oGlobalApi.oCompContainer.destroy();
			done();
		});
	});
	QUnit.test("Given closeFatalErrorDialog is injected When the dialog is dismissed Then the injection and not history.go is called", function(assert) {
		// arrangement
		var navToPrevPageSpy = sinon.stub(window.history, 'go', doNothing);
		var closeFatalErrorDialog = sinon.spy();
		var oCoreApi = {
			isApfStateAvailable: function() { return false; },
			getLogMessages: function() { return []; },
			getTextNotHtmlEncoded: function(t) { return t; },
			getGenericExit: function() { return closeFatalErrorDialog; }
		};
		return View.create({
			viewName: "module:sap/apf/ui/reuse/view/messageHandler.view",
			viewData: {
				oCoreApi: oCoreApi,
				uiApi: {
					getLayoutView: function() { return { setBusy: doNothing }; }
				}
			}
		}).then(async function(oView) {
			// action
			oView.getController().showMessage(makeFatalErrorMessage(new MessageHandler()));
			oView.byId("idFatalDialog").getBeginButton().firePress();
			await nextUIUpdate();

			// assert
			assert.strictEqual(navToPrevPageSpy.calledOnce, false, "then does not navigate to previous page");
			assert.strictEqual(closeFatalErrorDialog.calledOnce, true, "then call injected method");
			assert.deepEqual(closeFatalErrorDialog.firstCall.args[0], oCoreApi, "then first parameter of call to exit is the core instance");
			assert.ok(closeFatalErrorDialog.firstCall.args[1] instanceof Controller, "then second parameter of call to exit is the Controller");
			assert.ok(closeFatalErrorDialog.firstCall.args[2] instanceof Dialog, "then third parameter of call to exit is the Dialog");

			// cleanup
			navToPrevPageSpy.restore();
		});
	});
});
