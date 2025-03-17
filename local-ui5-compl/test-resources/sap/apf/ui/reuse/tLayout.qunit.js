/*global sinon */
sap.ui.define([
	"sap/apf/testhelper/doubles/createUiApiAsPromise",
	"sap/apf/testhelper/stub/ajaxStub",
	"sap/apf/utils/utils",
	"sap/f/DynamicPage",
	"sap/m/Bar",
	"sap/m/Button",
	"sap/m/Label",
	"sap/m/Page",
	"sap/m/ScrollContainer",
	"sap/ui/Device",
	"sap/ui/core/Element",
	"sap/ui/layout/VerticalLayout",
	"sap/ui/qunit/utils/nextUIUpdate",
	"sap/apf/testhelper/doubles/UiInstance",
	"sap/apf/testhelper/helper",
	"sap/apf/testhelper/odata/savedPaths"
], function(
	createUiApiAsPromise,
	ajaxStub,
	utils,
	DynamicPage,
	Bar,
	Button,
	Label,
	Page,
	ScrollContainer,
	Device,
	Element,
	VerticalLayout,
	nextUIUpdate
) {
	'use strict';
	function doNothing() {
	}
	var NavigationHandler = function(oInject){

		this.getNavigationTargets = function() {
			var deferred = jQuery.Deferred();
			deferred.resolve({
				global : ["atLeastOneGlobal"],
				stepSpecific : []
			});

			return deferred.promise();
		};
		this.checkMode = function() {
			var deferred = jQuery.Deferred();
			deferred.resolve({
				navigationMode : "forward"
			});
			return deferred.promise();
		};
	};
	
	function getDialog(key, oGlobalApi) {
		sap.ui.getCore().applyChanges();
		var title = oGlobalApi.oCoreApi.getTextNotHtmlEncoded(key);
		var oExpectedDialog;
		jQuery('.sapMDialog').each(function(name, element) {
			var oDialog = Element.getElementById(element.getAttribute("id"));
			if (title.indexOf(oDialog.getTitle()) !== -1 && oDialog.getTitle() !== "") { // matching even if text resource missing
				oExpectedDialog = oDialog;
			}
		});
		return oExpectedDialog;
	}
	function pressButtonsOfDialog(dialogId, buttonId, assert, layoutView, continuation) {
		var done = assert.async();
		var dialog = layoutView.byId(dialogId);
		// ensure the async callback afterClose has successfully completed.
		dialog.attachAfterClose(function() {
			sap.ui.getCore().applyChanges();
			continuation({});
			done();
		});
		layoutView.byId(buttonId).firePress();
		sap.ui.getCore().applyChanges();
	}
	//Below stubs and Doubles required for Navigation realted test cases...
	function savePathDouble(savedPathJson) {
		return function(arg1, arg2) {
			var callback;
			if (arg2 instanceof Function) {
				callback = arg2;
			}
			jQuery.getJSON(savedPathJson, function(data) {
				callback(data, {}, undefined);
			});
		};
	}
	function getStepsDouble() {
		return function() {
			return [ "firstStep", "secondStep", "thirdStep" ];
		};
	}
	function readPathsStub(callback) {
		var savedPathJson = "/pathOfNoInterest/savedPaths.json";
		jQuery.getJSON(savedPathJson, function(data) {
			var metaData, metaDataValue;
			var i;
			for(i = 0; i < data.paths.length; i++) {
				data.paths[i].StructuredAnalysisPath = {
						steps : [ 2, 4 ]
				};
			}
			metaData = {
					getEntityTypeMetadata : function() {
						metaDataValue = {
								maximumNumberOfSteps : 32,
								maxOccurs : 255
						};
						return metaDataValue;
					}
			};
			callback(data, metaData, undefined);
		});
	}
	// Below Stubs are required for layout functionality test cases
	function getTextEncodedStub(x) {
		return x;
	}
	
	function loadNotificationBarStub() {
		var layout = new VerticalLayout();
		layout.getController = function(){
			return {
				showMessage : doNothing
			};
		};
		return Promise.resolve(layout);
	}
	function getEventCallbackStub(eventType, oGlobalApi) {
		return oGlobalApi.oUiApi.getEventCallback(eventType);
	}
	function getStepContainerStub() {
		return new VerticalLayout();
	}
	function getFacetFilterControlStub() {
		var oControl = new VerticalLayout();
		oControl.getFilterExpression = function() {
			var filterExpresn = [];
			return filterExpresn;
		};
		oControl.resetAllFilters = function() {
			return "";
		};
		return oControl;
	}

	QUnit.module('APF UI Reuse', {
		beforeEach : function(assert) {
			var that = this;
			ajaxStub.stubJQueryAjax();
			var done = assert.async();
			var inject = {
					beforeStartupCallback : function() {
						sinon.stub(this.getProbe().coreApi, 'getTextNotHtmlEncoded', getTextEncodedStub);
					},
					constructors : {
						NavigationHandler : NavigationHandler
					}
			};
			createUiApiAsPromise(undefined, undefined, inject).done(function(api){
				that.oGlobalApi = api;
				sinon.stub(that.oGlobalApi.oUiApi, 'loadNotificationBar', loadNotificationBarStub);
				sinon.stub(that.oGlobalApi.oUiApi, 'getStepContainer', getStepContainerStub);
				sinon.stub(that.oGlobalApi.oApi, 'getEventCallback', getEventCallbackStub, that.oGlobalApi);
				sinon.stub(that.oGlobalApi.oUiApi, 'getEventCallback', getEventCallbackStub, that.oGlobalApi);
				that.layoutView = that.oGlobalApi.oUiApi.getLayoutView();
				done();
			});

		},
		afterEach : function() {
			var that = this;
			jQuery.ajax.restore();
			that.oGlobalApi.oCoreApi.getTextNotHtmlEncoded.restore();
			that.oGlobalApi.oUiApi.loadNotificationBar.restore();
			that.oGlobalApi.oUiApi.getStepContainer.restore();
			that.oGlobalApi.oApi.getEventCallback.restore();
			that.oGlobalApi.oUiApi.getEventCallback.restore();
			that.oGlobalApi.oCompContainer.destroy();
			Element.getElementById("stepList")?.destroy();
		}
	});
	QUnit.test('When Layout view is initialized', async function(assert) {
		//arrangement
		var spyLayoutView = sinon.spy(this.layoutView, 'onAfterRendering');
		//action
		this.layoutView.placeAt("qunit-fixture");
		await nextUIUpdate();
		this.layoutView.byId("applicationView").fireAfterMasterOpen();
		await nextUIUpdate();
		//assert
		assert.ok(this.layoutView, 'Layout View available');
		assert.strictEqual(spyLayoutView.called, true, "Then the layout renrendered successfully");
		assert.strictEqual(this.layoutView.byId("applicationPage").getTitle(), "appName", "Header Text is added to the layout");
		assert.strictEqual(this.layoutView.byId("stepContainer") instanceof Page, true, "StepContainer is added to layout");
		assert.strictEqual(this.layoutView.byId("analysisPath") instanceof Page, true, "AnalysisPath is added to layout");
		assert.strictEqual(this.layoutView.byId("analysisDynamicPage") instanceof DynamicPage, true, "Dynamic page is added to layout");
		assert.strictEqual(this.layoutView.byId("subHeader") instanceof ScrollContainer, true, "SubHeader is added to layout");
		assert.strictEqual(this.layoutView.byId("masterFooter") instanceof Bar, true, "MasterFooter is added to layout");
	});
	QUnit.test('When calling addMasterFooterContentRight', async function(assert) {
		//arrangement
		var oLabel = new Label({
			text : "Label 1"
		});
		var oLabel2 = new Label({
			text : "Label 2"
		});
		//action
		this.layoutView.byId("masterFooter").removeAllContentRight();
		this.layoutView.getController().addMasterFooterContentRight(oLabel);
		this.layoutView.getController().addMasterFooterContentRight(oLabel2);
		await nextUIUpdate();
		var checkContentRight = this.layoutView.byId("masterFooter").getContentRight()[0];
		//assert
		assert.strictEqual(oLabel, checkContentRight, "Then addMasterFooterContentRight() - control added to MasterFooterRight");
		assert.strictEqual(this.layoutView.byId("masterFooter").getContentRight()[1].getIcon(), "sap-icon://overflow", "Content overflow Button Added to Footer in case of multiple contents");
	});
	QUnit.test('When calling addMasterFooterContentLeft', async function(assert) {
		//arrangement
		var oLabel = new Label({
			text : "Label 1"
		});
		//action
		this.layoutView.byId("masterFooter").removeAllContentLeft();
		this.layoutView.getController().addMasterFooterContentLeft(oLabel);
		await nextUIUpdate();
		var checkContentLeft = this.layoutView.byId("masterFooter").getContentLeft()[0];
		//assert
		assert.strictEqual(oLabel, checkContentLeft, "addMasterFooterContentLeft() - control added to MasterFooterLeft");
	});
	QUnit.test('When calling addFacetFiler', async function(assert) {
		//action
		this.layoutView.getController().addFacetFilter(getFacetFilterControlStub());
		await nextUIUpdate();
		var subHeaderval = this.layoutView.byId("subHeader");
		var facetfilterval = subHeaderval.getContent();
		//assert
		assert.strictEqual(facetfilterval.length, 1, "Then the facetfilterview has added successfully");
	});
	QUnit.test('When calling showMaster', async function(assert) {
		//action
		this.layoutView.getController().showMaster();
		await nextUIUpdate();
		//assert
		assert.strictEqual(this.layoutView.byId("applicationView").isMasterShown(), true, "Then the master page has shown");
	});
	QUnit.test('When calling addMasterFooterContentLeft', async function(assert) {
		//arrangement
		var oLabel = new Label({
			text : "Label 1"
		});
		//action
		this.layoutView.getController().addMasterFooterContentLeft(oLabel);
		await nextUIUpdate();
		var checkContentLeft = this.layoutView.byId("masterFooter").getContentLeft()[0];
		//assert
		assert.strictEqual(oLabel, checkContentLeft, "Then addMasterFooterContentLeft() - control added to FooterLeft");
	});
	QUnit.test('When calling hideMaster', async function(assert) {
		//arrangement - Test for Phone
		Device.system.phone = true;
		await nextUIUpdate();
		//action
		this.layoutView.getController().hideMaster();
		//assert
		var currentPageID = this.layoutView.byId("applicationView").getCurrentPage().getId();
		var PageID = this.layoutView.byId("stepContainer").getId();
		assert.strictEqual(currentPageID, PageID, "Then Master is hidden and Current Page  in Phone StepContainer  Page");
		//cleanup
		Device.system.phone = false;
		await nextUIUpdate();
		//arrangement - Test for tablet
		Device.system.tablet = true;
		await nextUIUpdate();
		//action
		this.layoutView.getController().hideMaster();
		currentPageID = this.layoutView.byId("applicationView").getCurrentPage().getId();
		PageID = this.layoutView.byId("stepContainer").getId();
		//assert
		assert.strictEqual(currentPageID, PageID, "Then Master is hidden and Current Page  in tablet StepContainer  Page");
	});
	QUnit.test('When Adding Open In button(as Enabled)', async function(assert) {
		this.layoutView.byId("idOpenInButton").destroy();
		//action
		this.layoutView.getController().addOpenInButton();
		await nextUIUpdate();
		var checkContentRight = this.layoutView.byId("masterFooter").getContentRight()[0];
		//assert
		assert.ok(checkContentRight instanceof Button, "Open in button is added to the right side of the footer with a global Navigation Target");
		assert.strictEqual(this.layoutView.getController().openInBtn.getEnabled(), true, "Then the OpenIn Button is enabled");
	});
	QUnit.test('When Adding Open In button AND navigation targets exist', async function(assert) {
		this.layoutView.byId("idOpenInButton").destroy();
		//action
		this.layoutView.getController().addOpenInButton();
		await nextUIUpdate();
		var checkContentRight = this.layoutView.byId("masterFooter").getContentRight()[0];
		//assert
		assert.ok(checkContentRight instanceof Button, "Open in button is added to the right side of the footer with Navigation Target");
		assert.strictEqual(this.layoutView.getController().openInBtn.getEnabled(), true, "Then the OpenIn Button is Enabled");
	});
	QUnit.test('When Adding Open In button AND NO navigation targets exist', async function(assert) {
		this.layoutView.byId("idOpenInButton").destroy();
		var controller = this.layoutView.getController();

		function getEmptyNavigationTargets() {
			return utils.createPromise({
				global : [],
				stepSpecific : []
			});
		}
		//arrangement
		sinon.stub(controller.oNavigationHandler, 'getNavigationTargets', getEmptyNavigationTargets);
		//action
		controller.addOpenInButton();
		await nextUIUpdate();
		var checkContentRight = this.layoutView.byId("masterFooter").getContentRight()[0];
		//assert
		assert.ok(checkContentRight instanceof Button, "Open in button is added to the right side of the footer with Navigation Target");
		assert.strictEqual(controller.openInBtn.getEnabled(), false, "Then the OpenIn Button is NOT Enabled");
		controller.oNavigationHandler.getNavigationTargets.restore();
	});
	QUnit.test('when a non-dirty path and navigation to previous page happens', async function(assert) {
		// arrange
		var newPathDialog = this.layoutView.byId("idNewDialog");
		var navToPrevPage = sinon.stub(window.history, 'go', doNothing);
		const openNewMessageDialog = sinon.spy(this.layoutView.getController(), "_openNewMessageDialog");
		// assert
		assert.strictEqual(newPathDialog, undefined, "then before navigation button press, new dialog is not opened");
		// act
		this.layoutView.byId("applicationPage-navButton").firePress();
		await nextUIUpdate();
		// assert
		assert.strictEqual(openNewMessageDialog.callCount, 0, "_openNewMessageDialog was not called");
		assert.strictEqual(newPathDialog, undefined, "when navigation button press, new dialog not opened");
		assert.strictEqual(navToPrevPage.calledOnce, true, "then navigates to previous page");
		// cleanups
		navToPrevPage.restore();
		openNewMessageDialog.restore();
	});
	QUnit.test('when a dirty path and navigation to previous page happens,then clicking "Ok" button of new dialog then clicking "Cancel" button of save dialog', async function(assert) {
		// arrange
		var that = this;
		var savedPathJson = "/pathOfNoInterest/savedPaths.json";
		sinon.stub(that.oGlobalApi.oCoreApi, 'readPaths', readPathsStub);
		var newPathDialog = that.layoutView.byId("idNewDialog"), saveDialog;
		var analysisPath = that.oGlobalApi.oUiApi.getAnalysisPath();
		var toolBarController = analysisPath.getToolbar().getController();
		var layoutView = that.oGlobalApi.oUiApi.getLayoutView().getController();
		var pathName = "analysisPathName";
		layoutView.oSavedPathName.setText(pathName);
		// create spies and stubs
		var spySavePath = sinon.stub(toolBarController.oSerializationMediator, 'savePath', savePathDouble(savedPathJson));
		var navToPrevPage = sinon.stub(window.history, 'go', doNothing);
		sinon.stub(that.oGlobalApi.oCoreApi, 'getSteps', getStepsDouble());
		const openNewMessageDialog = sinon.spy(that.layoutView.getController(), "_openNewMessageDialog");
		//var stubReadPath = readPathsStub(savedPathJson, testContext);
		analysisPath.getController().refresh(0);
		await nextUIUpdate();
		// assert
		assert.strictEqual(newPathDialog, undefined, "before navigation button press: Analysis path to save dialog is not opened");
		// act
		that.layoutView.byId("applicationPage-navButton").firePress();
		await nextUIUpdate();
		assert.strictEqual(openNewMessageDialog.callCount, 1, "_openNewMessageDialog was called exactly once");
		await openNewMessageDialog.returnValues[0]; // wait for the open call before accessing the newPathDialog again
		newPathDialog = that.layoutView.byId("idNewDialog");
		// assert
		assert.ok(newPathDialog, "when navigation Button press: new dialog exist");
		assert.strictEqual(newPathDialog.isOpen(), true, "When navigation Button press: new dialog opened");
		pressButtonsOfDialog("idNewDialog", "idYesButton", assert, that.layoutView, function() {
			saveDialog = getDialog("save-analysis-path", that.oGlobalApi);
			assert.ok(saveDialog, " then save-analysis-path dialog exists");
			assert.strictEqual(saveDialog.isOpen(), true, "then Save dialog opened");
			var done = assert.async();
			saveDialog.getEndButton().firePress();
			sap.ui.getCore().applyChanges();
			saveDialog.attachAfterClose(function() {
				// assert
				saveDialog = getDialog("save-analysis-path", that.oGlobalApi);
				assert.strictEqual(saveDialog, undefined, "then Save dialog does not exist");
				assert.strictEqual(spySavePath.calledOnce, false, "when Cancel, then savePath not called");
				assert.strictEqual(navToPrevPage.calledOnce, false, "then remains in the same page");
				// cleanups
				navToPrevPage.restore();
				openNewMessageDialog.restore();
				done();
			});
		});
		// cleanups
		that.oGlobalApi.oCoreApi.readPaths.restore();
	});
	QUnit.test('when a dirty path and navigation to previous page happens,then clicking "Ok" button of new dialog then clicking "Ok" button of save dialog', async function(assert) {
		// arrange
		var that = this;
		var savedPathJson = "/pathOfNoInterest/savedPaths.json";
		var done;
		var newPathDialog = that.layoutView.byId("idNewDialog"), saveDialog;
		var analysisPath = that.oGlobalApi.oUiApi.getAnalysisPath();
		var toolBarController = analysisPath.getToolbar().getController();
		var pathName = "analysisPathName";
		var layoutView = that.oGlobalApi.oUiApi.getLayoutView().getController();
		layoutView.oSavedPathName.setText(pathName);
		// create spies and stubs
		var spySavePath = sinon.stub(toolBarController.oSerializationMediator, 'savePath', savePathDouble(savedPathJson));
		var navToPrevPage = sinon.stub(window.history, 'go', doNothing);
		const openNewMessageDialog = sinon.spy(that.layoutView.getController(), "_openNewMessageDialog");
		sinon.stub(that.oGlobalApi.oCoreApi, 'getSteps', getStepsDouble());
		sinon.stub(that.oGlobalApi.oCoreApi, 'readPaths', readPathsStub);
		analysisPath.getController().refresh(0);
		await nextUIUpdate();
		// assert
		assert.strictEqual(newPathDialog, undefined, "before navigation button press: Analysis path to save dialog not opened");
		// act
		that.layoutView.byId("applicationPage-navButton").firePress();
		await nextUIUpdate();
		assert.strictEqual(openNewMessageDialog.callCount, 1, "_openNewMessageDialog was called exactly once");
		await openNewMessageDialog.returnValues[0]; // wait for the open call before accessing the newPathDialog again
		newPathDialog = that.layoutView.byId("idNewDialog");
		// assert
		assert.ok(newPathDialog, "After navigation Button press: new dialog exist");
		assert.strictEqual(newPathDialog.isOpen(), true, "After navigation Button press: new opened");
		pressButtonsOfDialog("idNewDialog", "idYesButton", assert, that.layoutView, function() {
			saveDialog = getDialog("save-analysis-path", that.oGlobalApi);
			assert.ok(saveDialog, "then save-analysis-path dialog exists");
			assert.strictEqual(saveDialog.isOpen(), true, "then Save dialog is in open state");
			done = assert.async();
			saveDialog.getBeginButton().firePress();
			sap.ui.getCore().applyChanges();
			saveDialog.attachAfterClose(function() {
				// assert
				saveDialog = getDialog("save-analysis-path", that.oGlobalApi);
				assert.strictEqual(saveDialog, undefined, "then Save dialog does not exist");
				assert.strictEqual(spySavePath.calledOnce, true, "when ok then savePath called");
				assert.strictEqual(navToPrevPage.calledOnce, true, "then navigated to previous page");
				// cleanups
				navToPrevPage.restore();
				openNewMessageDialog.restore();
				done();
			});
		});
		// cleanups
		that.oGlobalApi.oCoreApi.readPaths.restore();
	});
	QUnit.test('when a dirty path and navigation to previous page happens,then clicking "No" button of new dialog', async function(assert) {
		// arrange
		var that = this;
		var newPathDialog = that.layoutView.byId("idNewDialog"), saveAnalysisPathDialog;
		var analysisPath = that.oGlobalApi.oUiApi.getAnalysisPath();
		var navToPrevPage = sinon.stub(window.history, 'go', doNothing);
		const openNewMessageDialog = sinon.spy(that.layoutView.getController(), "_openNewMessageDialog");
		sinon.stub(that.oGlobalApi.oCoreApi, 'getSteps', getStepsDouble());
		analysisPath.getController().refresh(0);
		await nextUIUpdate();
		// assert
		assert.strictEqual(newPathDialog, undefined, "Before navigation button press: Analysis path to save dialog not opened");
		// act
		that.layoutView.byId("applicationPage-navButton").firePress();
		await nextUIUpdate();
		assert.strictEqual(openNewMessageDialog.callCount, 1, "_openNewMessageDialog was called exactly once");
		await openNewMessageDialog.returnValues[0]; // wait for the open call before accessing the newPathDialog again
		newPathDialog = that.layoutView.byId("idNewDialog");
		// assert
		assert.ok(newPathDialog, "After navigation Button press: new dialog exist");
		assert.strictEqual(newPathDialog.isOpen(), true, "After navigation Button press: new dialog opened");
		pressButtonsOfDialog("idNewDialog", "idNoButton", assert, that.layoutView, function() {
			saveAnalysisPathDialog = getDialog("save-analysis-path", that.oGlobalApi);
			//assert
			assert.strictEqual(saveAnalysisPathDialog, undefined, "then Save dialog does not exist");
			assert.strictEqual(navToPrevPage.calledOnce, true, "Navigating to previous page");
		});
		// cleanups
		that.oGlobalApi.oCoreApi.getSteps.restore();
		navToPrevPage.restore();
		openNewMessageDialog.restore();
	});
	QUnit.test('when a dirty path and navigation to previous page happens,then clicking "Cancel" button of new dialog', async function(assert) {
		// arrange
		var that = this;
		var newPathDialog = that.layoutView.byId("idNewDialog"), saveAnalysisPathDialog;
		var analysisPath = that.oGlobalApi.oUiApi.getAnalysisPath();
		var navToPrevPage = sinon.stub(window.history, 'go', doNothing);
		const openNewMessageDialog = sinon.spy(that.layoutView.getController(), "_openNewMessageDialog");
		sinon.stub(that.oGlobalApi.oCoreApi, 'getSteps', getStepsDouble());
		analysisPath.getController().refresh(0);
		await nextUIUpdate();
		// assert
		assert.strictEqual(newPathDialog, undefined, "Before navigation button press: Analysis path to save dialog not opened");
		// act
		that.layoutView.byId("applicationPage-navButton").firePress();
		await nextUIUpdate();
		assert.strictEqual(openNewMessageDialog.callCount, 1, "_openNewMessageDialog was called exactly once");
		await openNewMessageDialog.returnValues[0]; // wait for the open call before accessing the newPathDialog again
		newPathDialog = that.layoutView.byId("idNewDialog");
		// assert
		assert.ok(newPathDialog, "After navigation Button press: new dialog exist");
		assert.strictEqual(newPathDialog.isOpen(), true, "After navigation Button press: new dialog opened");
		pressButtonsOfDialog("idNewDialog", "idCancelButton", assert, that.layoutView, function() {
			saveAnalysisPathDialog = getDialog("save-analysis-path", that.oGlobalApi);
			//assert
			assert.strictEqual(saveAnalysisPathDialog, undefined, "then Save dialog does not exist");
			assert.strictEqual(navToPrevPage.calledOnce, false, "Remains in the same page");
		});
		//cleanups
		that.oGlobalApi.oCoreApi.getSteps.restore();
		navToPrevPage.restore();
		openNewMessageDialog.restore();
	});
	QUnit.test("Test, whether id is assigned to the Open In.. Button", function(assert){
		var button = this.layoutView.byId("idOpenInButton");
		assert.ok(button instanceof Button, "THEN button can be accessed by id");
	});
});
