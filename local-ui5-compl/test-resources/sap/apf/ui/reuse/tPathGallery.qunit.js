/*global sinon */
sap.ui.define([
	"sap/apf/testhelper/doubles/createUiApiAsPromise",
	"sap/apf/testhelper/odata/savedPaths",
	"sap/ui/core/Element",
	"sap/ui/core/mvc/View",
	"sap/ui/core/mvc/ViewType",
	"sap/ui/qunit/utils/nextUIUpdate",
	"sap/ui/thirdparty/jquery",
	"sap/apf/testhelper/doubles/UiInstance",
	"sap/apf/testhelper/helper"
], function(createUiApiAsPromise, savedPaths, Element, View, ViewType, nextUIUpdate, jQuery) {
	"use strict";
	var oGlobalApi, oPathGallery;
	function getDialogByEmptyTitle() {
		sap.ui.getCore().applyChanges();
		var oExpectedDialog;
		jQuery('.sapMDialog').each(function(name, element) {
			var oDialog = Element.getElementById(element.getAttribute("id"));
			if (oDialog.getTitle() === "") { // empty tile
				oExpectedDialog = oDialog;
			}
		});
		return oExpectedDialog;
	}
	function clickItemOnDialog() {
		var selectionDialog = getDialogByEmptyTitle();
		selectionDialog.getContent()[0].getPages()[0].getContent()[0].getItems()[0].firePress();
		sap.ui.getCore().applyChanges();
		selectionDialog.getContent()[0].getPages()[1].getContent()[0].getItems()[0].firePress();
		sap.ui.getCore().applyChanges();
	}
	function destroyDialog() {
		var selectionDialog = getDialogByEmptyTitle();
		if (selectionDialog !== undefined && selectionDialog.isOpen()) {
			selectionDialog.destroy();
		}
	}
	function getFormattedDate(utcDate) {
		var numberPattern = /\d+/g;
		var timeStamp = parseInt(utcDate.match(numberPattern)[0], 10);
		var date = ((new Date(timeStamp)).toString()).split(' ');
		var formatteddate = date[1] + "-" + date[2] + "-" + date[3];
		return formatteddate;
	}
	function responseObjStub(oResponse) {
		return {
			path : {
				SerializedAnalysisPath : {
					context : {}
				}
			}
		};
	}
	function openPathDouble(oResponse, entityTypeMetaData, messageObj) {
		return function(guid, callback, activeStepIndex) {
			callback(oResponse, entityTypeMetaData, messageObj);
		};
	}
	QUnit.module("Path Gallery Unit Tests", {
		beforeEach : function(assert) {
			var that = this;
			var done = assert.async();
			createUiApiAsPromise().done(async function(api){
				oGlobalApi = api;
				var oInject;
				var getDataForPathGallery = async function(data) {
					var galleryData = data.paths;
					for( var i in galleryData) {
						var noOfSteps = galleryData[i].StructuredAnalysisPath.steps.length;
						var dateToShow = getFormattedDate(galleryData[i].LastChangeUTCDateTime);
						galleryData[i].guid = galleryData[i].AnalysisPath;
						galleryData[i].title = galleryData[i].AnalysisPathName;
						galleryData[i].StructuredAnalysisPath.noOfSteps = noOfSteps;
						galleryData[i].description = dateToShow + "  -   (" + oGlobalApi.oCoreApi.getTextNotHtmlEncoded("no-of-steps", [ noOfSteps ]) + ")";
						galleryData[i].summary = galleryData[i].AnalysisPathName + "- (" + dateToShow + ") - (" + oGlobalApi.oCoreApi.getTextNotHtmlEncoded("no-of-steps", [ noOfSteps ]) + ")";
					}
					var jsonData = {
							GalleryElements : galleryData
					};
					oInject = {
							uiApi : oGlobalApi.oUiApi,
							oCoreApi : oGlobalApi.oCoreApi,
							oContext : oGlobalApi.oContext,
							oSerializationMediator : oGlobalApi.oSerializationMediator
					};
					oPathGallery = await View.create({
						viewName : "module:sap/apf/ui/reuse/view/pathGallery.view",
						viewData : {
							oInject : oInject,
							jsonData : jsonData
						}
					});
					that.stub_putMessage = sinon.stub(oInject.oCoreApi, "putMessage", function(){});
				};
				var aSavedPaths = savedPaths.getSavedPaths();
				await getDataForPathGallery(aSavedPaths);
				done();
			});

		},
		afterEach : function() {
			this.stub_putMessage.restore();
			oGlobalApi.oCompContainer.destroy();
		}
	});
	QUnit.test("When Opening Selection Dilaog, the dialog opens with correct dataset", async function(assert) {
		//action
		await oPathGallery.getController().openPathGallery();
		var jsonData = oPathGallery.getViewData().jsonData;
		await nextUIUpdate();
		var selectPathDialog = getDialogByEmptyTitle();
		var dialogItemlength = selectPathDialog.getContent()[0].getPages()[0].getContent()[0].getItems().length;
		var dialogItemTitle = selectPathDialog.getContent()[0].getPages()[0].getContent()[0].getItems()[0].getTitle();
		var descriptionOnUi = selectPathDialog.getContent()[0].getPages()[0].getContent()[0].getItems()[0].getDescription();
		var dateToShow = getFormattedDate(jsonData.GalleryElements[0].LastChangeUTCDateTime);
		var noOfSteps = jsonData.GalleryElements[0].StructuredAnalysisPath.steps.length;
		var description = dateToShow + "  -   (" + oGlobalApi.oCoreApi.getTextNotHtmlEncoded("no-of-steps", [ noOfSteps ]) + ")";
		//assert
		assert.ok(selectPathDialog, "Then the selection Dialog is available");
		assert.strictEqual(selectPathDialog.isOpen(), true, "Then Path Gallery Dialog is Open");
		assert.strictEqual(selectPathDialog.hasStyleClass("sapUiSizeCompact"), true, "Path Gallery Dialog has the style class");
		assert.strictEqual(jsonData.GalleryElements.length, dialogItemlength, "Then Number of paths shown in Path gallery are same as those present in the Path Gallery Data");
		assert.strictEqual(jsonData.GalleryElements[0].AnalysisPathName, dialogItemTitle, "Then Path Name shown in path Gallery is same as present in the Path Gallery Data");
		assert.strictEqual(description, descriptionOnUi, "Then Description(Last modified date and total number of steps) of path shown in path Gallery is same as present in the Path Gallery Data");
		//cleanup
		destroyDialog();
	});
	QUnit.test("When open path is successfully called (response exists, messageobject is undefined)", async function(assert) {
		//arrangement
		var analysisPathController = oGlobalApi.oUiApi.getAnalysisPath().getController();
		await oPathGallery.getController().openPathGallery();
		await nextUIUpdate();
		oGlobalApi.oCoreApi.setPathName("TestPath");
		var spyOpen = sinon.stub(oGlobalApi.oSerializationMediator, 'openPath', openPathDouble(responseObjStub(), {}));
		var updatePathSpy = sinon.spy(oGlobalApi.oCoreApi, 'updatePath');
		var refreshAnalysisPathSpy = sinon.spy(analysisPathController, 'refresh');
		var contextChangedSpy = sinon.spy(oGlobalApi.oUiApi, 'contextChanged');
		//action
		clickItemOnDialog();
		//assert
		assert.strictEqual(spyOpen.calledOnce, true, "Then Open Path called");
		assert.strictEqual(oGlobalApi.oUiApi.getLayoutView().getController().oSavedPathName.getText(), "TestPath", "Title of the path set correctly");
		assert.strictEqual(oGlobalApi.oCoreApi.isDirty(), false, "Dirty state of the path has been set to false");
		assert.strictEqual(this.stub_putMessage.called, false, "Then Error Message is set for No Response");
		assert.strictEqual(refreshAnalysisPathSpy.calledOnce, true, "Then analysis path is refreshed");
		assert.strictEqual(updatePathSpy.calledOnce, true, "Then update path is called once");
		assert.strictEqual(contextChangedSpy.calledOnce, true, "Then context is changed");
		//cleanup
		destroyDialog();
		oGlobalApi.oSerializationMediator.openPath.restore();
	});
	QUnit.test("When open path is unsuccessfully called (response is empty, messageObject is undefined)", async function(assert) {
		//arrangement
		await oPathGallery.getController().openPathGallery();
		var analysisPathController = oGlobalApi.oUiApi.getAnalysisPath().getController();
		await nextUIUpdate();
		oGlobalApi.oCoreApi.setPathName("TestPath");
		var spyOpen = sinon.stub(oGlobalApi.oSerializationMediator, 'openPath', openPathDouble("", {}));
		var updatePathSpy = sinon.spy(oGlobalApi.oCoreApi, 'updatePath');
		var refreshAnalysisPathSpy = sinon.spy(analysisPathController, 'refresh');
		var contextChangedSpy = sinon.spy(oGlobalApi.oUiApi, 'contextChanged');
		//action
		clickItemOnDialog();
		//assert
		assert.strictEqual(spyOpen.calledOnce, true, "Then Open path called");
		assert.strictEqual(this.stub_putMessage.called, true, "Then Error Message is set for No Response");
		assert.notEqual(oGlobalApi.oUiApi.getLayoutView().byId("analysisPathTitle").getText(), "TestPath", "Title of the path not set-Path not opened on UI.");
		assert.strictEqual(refreshAnalysisPathSpy.calledOnce, false, "Then analysis path is refreshed");
		assert.strictEqual(updatePathSpy.calledOnce, false, "Then update path is called once");
		assert.strictEqual(contextChangedSpy.calledOnce, false, "Then context is changed");
		//cleanup
		destroyDialog();
		oGlobalApi.oSerializationMediator.openPath.restore();
	});
	QUnit.test("When open path is unsuccessfully called (response exists, messageObject is present)", async function(assert) {
		//arrangement
		await oPathGallery.getController().openPathGallery();
		var analysisPathController = oGlobalApi.oUiApi.getAnalysisPath().getController();
		await nextUIUpdate();
		var selectionDialog = getDialogByEmptyTitle();
		var oMessageObject = oGlobalApi.oCoreApi.createMessageObject({
			code : "6008",
			aParameters : [ "TestPath" ]
		});
		var pathName = selectionDialog.getContent()[0].getPages()[0].getContent()[0].getItems()[0].getTitle();
		oGlobalApi.oCoreApi.setPathName("TestPath");
		var spyOpen = sinon.stub(oGlobalApi.oSerializationMediator, 'openPath', openPathDouble(responseObjStub(), {}, oMessageObject));
		var updatePathSpy = sinon.spy(oGlobalApi.oCoreApi, 'updatePath');
		var refreshAnalysisPathSpy = sinon.spy(analysisPathController, 'refresh');
		var contextChangedSpy = sinon.spy(oGlobalApi.oUiApi, 'contextChanged');
		//action
		clickItemOnDialog();
		//assert
		assert.strictEqual(spyOpen.calledOnce, true, "Then Open path called");
		assert.strictEqual(this.stub_putMessage.called, true, "Then Error Message is set for No Response");
		assert.notEqual(oGlobalApi.oUiApi.getLayoutView().byId("analysisPathTitle").getText(), pathName, "Title of the path not set-Path not opened on UI.");
		assert.strictEqual(refreshAnalysisPathSpy.calledOnce, false, "Then analysis path is refreshed");
		assert.strictEqual(updatePathSpy.calledOnce, false, "Then update path is called once");
		assert.strictEqual(contextChangedSpy.calledOnce, false, "Then context is changed");
		//cleanup
		destroyDialog();
		oGlobalApi.oSerializationMediator.openPath.restore();
	});
});
