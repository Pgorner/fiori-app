/* globals sap, sinon */
sap.ui.define([
	"sap/apf/core/messageObject",
	"sap/apf/testhelper/doubles/createUiApiAsPromise",
	"sap/apf/testhelper/doubles/navigationHandler",
	"sap/apf/testhelper/doubles/sessionHandlerStubbedAjax",
	"sap/apf/testhelper/stub/ajaxStub",
	"sap/apf/testhelper/stub/textResourceHandlerStub",
	"sap/m/Dialog",
	"sap/m/Link",
	"sap/m/Page",
	"sap/ui/core/Element",
	"sap/ui/layout/VerticalLayout",
	"sap/ui/qunit/utils/nextUIUpdate",
	"sap/ui/thirdparty/jquery",
	"sap/ui/thirdparty/qunit-2",
	"sap/ui/thirdparty/sinon",
	"sap/apf/testhelper/interfaces/IfUiInstance",
	"sap/apf/testhelper/doubles/UiInstance",
	"sap/apf/testhelper/helper",
	"sap/apf/testhelper/odata/sampleServiceData",
	"sap/apf/testhelper/doubles/request",
	"sap/apf/testhelper/doubles/metadata",
	"sap/apf/testhelper/doubles/Representation",
	'sap/apf/ui/instance',
	"sap/apf/core/utils/uriGenerator"
], function(
	MessageObject,
	createUiApiAsPromise,
	NavigationHandlerDouble,
	SessionHandlerStubbedAjax,
	ajaxStub,
	textResourceHandlerStub,
	Dialog,
	Link,
	Page,
	Element,
	VerticalLayout,
	nextUIUpdate,
	jQuery
) {
	"use strict";
	QUnit.module("Step Gallery - Unit Test", {
		beforeEach : function(assert) {
			ajaxStub.stubJQueryAjax();
			textResourceHandlerStub.setup(this);
			var inject = {
				constructors : {
					NavigationHandler : NavigationHandlerDouble,
					SessionHandler : SessionHandlerStubbedAjax
				}
			};
			var done = assert.async();
			createUiApiAsPromise(undefined, undefined, inject).done(function(api) {
				this.oGlobalApi = api;
				var self = this;
				this.spyPutMessage = function(oMessage) {
					self.oMessage = oMessage;
				};
				sinon.stub(this.oGlobalApi.oCoreApi, 'putMessage', this.spyPutMessage);
				this.createStep = function() {
					return this;
				};
				this.spyCreateStep = sinon.spy(this.createStep);
				sinon.stub(this.oGlobalApi.oCoreApi, 'createStep', this.spyCreateStep);
				this.spyFacetFilter = function() {
					return this;
				};
				this.spyGetLayoutView = function() {
					this.layout = new VerticalLayout();
					this.layout.getController = function() {
						this.resetAllFilters = function(param) {
							return param;
						};
						this.setMasterTitle = function() {
							return null;
						};
						this.setDetailTitle = function() {
							return null;
						};
						this.setMasterHeaderButton = function() {
							return null;
						};
						this.addMasterFooterContentLeft = function() {
							return null;
						};
						this.detailTitleRemoveAllContent = function() {
							return null;
						};
						return this;
					};
					return this.layout;
				};
				sinon.stub(this.oGlobalApi.oUiApi, "getLayoutView", this.spyGetLayoutView);
				this.oStepGalleryView = this.oGlobalApi.oUiApi.getAnalysisPath().getCarouselView().getStepGallery();
				this.oStepGalleryController = this.oStepGalleryView.oController;
				this.jsonData = this.oStepGalleryController.getGalleryElementsData();
				this.categoriesAvailable = this.jsonData.GalleryElements.length;
				done();
			}.bind(this));
		},
		afterEach : function() {
			textResourceHandlerStub.teardown();
			jQuery.ajax.restore();
			this.oGlobalApi.oCoreApi.putMessage.restore();
			this.oGlobalApi.oCoreApi.createStep.restore();
			this.oGlobalApi.oUiApi.getLayoutView.restore();
			if (this.oStepGalleryController.oHierchicalSelectDialog && this.oStepGalleryController.oHierchicalSelectDialog !== null) {
				this.oStepGalleryController.oHierchicalSelectDialog.destroy();
			}
			this.oGlobalApi.oCompContainer.destroy();
		}
	});
	function _addStepCheckWithMessageObjectStub(stepId) {
		var oCheckAddStepDeferred = jQuery.Deferred();
		var oMessageObject = {
			getMessage : function() {
				return "message";
			},
			getPrevious : function() {
				return undefined;
			}
		};
		oCheckAddStepDeferred.resolve(false, oMessageObject);
		return oCheckAddStepDeferred.promise();
	}
	function _addStepCheckWithNoMessageObjectStub(stepId) {
		var oCheckAddStepDeferred = jQuery.Deferred();
		oCheckAddStepDeferred.resolve(true);
		return oCheckAddStepDeferred.promise();
	}
	QUnit.test('Step gallery view and controller availability', function(assert) {
		assert.ok(this.oStepGalleryView, 'step gallery view is available');
		assert.ok(this.oStepGalleryController, 'step gallery controller is available');
	});
	QUnit.test('Preparation of Dialog Content', function(assert) {
		assert.ok(this.jsonData, "jsonData data for each section Available");
		assert.ok(this.categoriesAvailable === this.oGlobalApi.oCoreApi.getCategories().length, "Shows all Categories avilable in the configuration");
	});
	QUnit.test("API availability in step gallery Controller", function(assert) {
		assert.ok(typeof this.oStepGalleryController.getGalleryElementsData === "function", "getGalleryElementsData API available on the step gallery controller");
		assert.ok(typeof this.oStepGalleryController.getStepDetails === "function", "getStepDetails API available on the step gallery controller");
		assert.ok(typeof this.oStepGalleryController.openHierarchicalSelectDialog === "function", "openHierarchicalSelectDialog API available on the step gallery controller");
		assert.ok(typeof this.oStepGalleryController.onStepPress === "function", "onStepPress API available on the step gallery controller");
	});
	QUnit.test('getGalleryElementsData() test', function(assert) {
		var stepGalleryElementsData = this.oStepGalleryController.getGalleryElementsData();
		var i;
		var self = this;
		var categories = self.oGlobalApi.oCoreApi.getCategories();
		var getStepsInCategory = function(categoryId) { // returns the steps in a category given a category id
			var stepsInCategory = [];
			categories.forEach(function(category) {
				if (category.id === categoryId) {
					category.stepTemplates.forEach(function(stepTemplate) {
						stepsInCategory.push(stepTemplate.id);
					});
				}
			});
			return stepsInCategory;
		};
		var stepsInCategory;
		assert.ok(stepGalleryElementsData, "getGalleryElementsData() called and Step gallery elements data available");
		for(i = 0; i < stepGalleryElementsData.GalleryElements.length; i++) {
			if (this.oGlobalApi.oCoreApi.getCategories()[i].id === stepGalleryElementsData.GalleryElements[i].id) {
				assert.equal(stepGalleryElementsData.GalleryElements[i].id, this.oGlobalApi.oCoreApi.getCategories()[i].id, "Category matched in configuration and step gallery");
				stepsInCategory = getStepsInCategory(this.oGlobalApi.oCoreApi.getCategories()[i].id);
			}
			assert.equal(stepsInCategory.length, stepGalleryElementsData.GalleryElements[i].stepTemplates.length, "Same number of steps are present in the gallery in category " + stepGalleryElementsData.GalleryElements[i].id);
		}
	});
	QUnit.test('getStepDetails() test', function(assert) {
		var expectedStepDetails = this.jsonData.GalleryElements[2].stepTemplates[1];
		var stepDetails = this.oStepGalleryController.getStepDetails(2, 1);
		assert.ok(stepDetails, "getStepDetails() called and Step details data available");
		assert.equal(expectedStepDetails.id, stepDetails.id, "Id of the step matched with the expected id of the step : " + stepDetails.id);
		assert.equal(expectedStepDetails.maintitle, stepDetails.maintitle, "Main title of the step matched with the expected title of the step : " + stepDetails.maintitle);
		assert.equal(expectedStepDetails.representationtypes.length, stepDetails.representationtypes.length, "Number of the representations of the step matched with the expected representationtypes of the step : "
				+ stepDetails.representationtypes.length);
	});
	QUnit.test('openHierarchicalSelectDialog() - Opening of step gallery and closing it', async function(assert) {
		this.oStepGalleryController.openHierarchicalSelectDialog(); // opening the step gallery
		const whenOpened2 = this.oStepGalleryController.openHierarchicalSelectDialog(); // opening step gallery for second time, previous instance has to get destroyed before creating new one
		var self = this;
		await whenOpened2;
		assert.strictEqual(self.oStepGalleryController.oHierchicalSelectDialog.isOpen(), true, "openHierarchicalSelectDialog() called and Step gallery opened");
		Element.getElementById(jQuery(".sapMDialog")[0].id).getEndButton().firePress();
		assert.strictEqual(jQuery(".sapMDialog").length, 0, "Step gallery closed");
	});
	QUnit.test('onStepPress() test', async function(assert) {
		assert.equal(this.oGlobalApi.oCoreApi.getSteps().length, 0, "No step present");
		var stepId = this.oGlobalApi.oCoreApi.getStepTemplates()[2].id;
		var representationType = this.oGlobalApi.oCoreApi.getStepTemplates()[2].getRepresentationInfo()[0].representationId;
		await this.oStepGalleryController.openHierarchicalSelectDialog();
		sinon.stub(this.oGlobalApi.oCoreApi, 'checkAddStep', _addStepCheckWithNoMessageObjectStub);
		this.oStepGalleryController.onStepPress(stepId, representationType);
		assert.strictEqual(this.oStepGalleryController.byId("idAddStepCheckDialog"), undefined, "then the message for not adding the step is not shown");
		this.oGlobalApi.oCoreApi.checkAddStep.restore();
		this.oStepGalleryController.oHierchicalSelectDialog.close();
	});
	
	QUnit.test('On adding a step which is not allowed to be added in the path', async function(assert) {
		//arrange
		var stepId = this.oGlobalApi.oCoreApi.getStepTemplates()[6].id;
		var representationType = this.oGlobalApi.oCoreApi.getStepTemplates()[6].getRepresentationInfo()[0].representationId;

		await this.oStepGalleryController.openHierarchicalSelectDialog();
		await nextUIUpdate();
		sinon.stub(this.oGlobalApi.oCoreApi, 'checkAddStep', _addStepCheckWithMessageObjectStub);
		sinon.spy(this.oStepGalleryController, "openAddStepCheckDialog");
		//act
		this.oStepGalleryController.onStepPress(stepId, representationType);
		//assert
		assert.strictEqual(this.oStepGalleryController.openAddStepCheckDialog.callCount, 1, "openAddStepCheckDialog called exactly once");
		await this.oStepGalleryController.openAddStepCheckDialog.returnValues[0]; // wait for the dialog to be loaded and opened
		assert.strictEqual(this.oStepGalleryController.byId("idAddStepCheckDialog") instanceof Dialog, true, "then the message for not adding the step is shown in the dialog");
		assert.strictEqual(this.oStepGalleryController.byId("idAddStepCheckDialog").getTitle(), "Warning", "the dialog is a warning for not adding the steps");
		assert.strictEqual(this.oStepGalleryController.byId("idShowDetailsLinkForAddStep") instanceof Link, true, "then there is a link available for details of the message");
		assert.strictEqual(this.oStepGalleryController.byId("idShowDetailsLinkForAddStep").getText(), "Show Details", "the title of the link is set correctly");
		//act - press the show details link
		this.oStepGalleryController.byId("idShowDetailsLinkForAddStep").firePress();
		await nextUIUpdate();
		//assert
		assert.strictEqual(this.oStepGalleryController.byId("idShowDetailsDialogForAddStep") instanceof Dialog, true, "then the detail message for not adding the step is shown in the dialog");
		this.oStepGalleryController.byId("idAddStepCheckDialog").close();
		this.oStepGalleryController.byId("idShowDetailsDialogForAddStep").close();
		await nextUIUpdate();
		//cleanup
		this.oGlobalApi.oCoreApi.checkAddStep.restore();
		this.oStepGalleryController.oHierchicalSelectDialog.close();
	});
	QUnit.test('Negative testing - getGalleryElementsData() test with no category in config', function(assert) {
		this.spyGetCategories = function() {
			return [];
		};
		sinon.stub(this.oGlobalApi.oCoreApi, 'getCategories', this.spyGetCategories);
		this.oStepGalleryController.getGalleryElementsData();
		var oMessageObject = this.oMessage;
		assert.ok(oMessageObject instanceof MessageObject, "Message object created is an instance of sap.apf.core.MessageObject");
		assert.equal(oMessageObject.getParameters()[0], "Categories", "Parameter of the message object is " + oMessageObject.getParameters()[0]);
		assert.equal(oMessageObject.getCode(), "6001", "Code of the message object is " + oMessageObject.getCode());
		this.oGlobalApi.oCoreApi.getCategories.restore();
	});
	QUnit.test('Negative testing - getGalleryElementsData() test with no steps in categories', function(assert) {
		this.spyGetStepTemplates = function() {
			return [];
		};
		sinon.stub(this.oGlobalApi.oCoreApi, 'getStepTemplates', this.spyGetStepTemplates);
		this.oStepGalleryController.getGalleryElementsData();
		var oMessageObject = this.oMessage;
		assert.ok(oMessageObject instanceof MessageObject, "Message object created is an instance of sap.apf.core.MessageObject");
		assert.equal(oMessageObject.getParameters()[0], "Step", "Parameter of the message object is " + oMessageObject.getParameters()[0]);
		assert.equal(oMessageObject.getParameters()[1], "Category", "Parameter of the message object is " + oMessageObject.getParameters()[1]);
		assert.equal(oMessageObject.getCode(), "6002", "Code of the message object is " + oMessageObject.getCode());
		this.oGlobalApi.oCoreApi.getStepTemplates.restore();
	});
	QUnit.test('Negative testing - getGalleryElementsData() test with missing label information in category', function(assert) {
		this.spyGetCategories = function() {
			var categories = [ {
				type : "category",
				id : "categoryTemplate1",
				stepTemplates : []
			} ];
			return categories;
		};
		sinon.stub(this.oGlobalApi.oCoreApi, 'getCategories', this.spyGetCategories);
		this.oStepGalleryController.getGalleryElementsData();
		var oMessageObject = this.oMessage;
		assert.ok(oMessageObject instanceof MessageObject, "Message object created is an instance of sap.apf.core.MessageObject");
		assert.equal(oMessageObject.getParameters()[0], "Label", "Parameter of the message object is " + oMessageObject.getParameters()[0]);
		assert.equal(oMessageObject.getParameters()[1], "Category: undefined", "Parameter of the message object is " + oMessageObject.getParameters()[1]);
		assert.equal(oMessageObject.getCode(), "6002", "Code of the message object is " + oMessageObject.getCode());
		this.oGlobalApi.oCoreApi.getCategories.restore();
	});
	QUnit.test('Negative testing - getGalleryElementsData() test with missing label information in step template', function(assert) {
		var that = this;
		this.spyGetStepTemplates = function() {
			var stepTemplates = [ {
				type : "step",
				id : "stepTemplate1",
				getRepresentationInfo : function() {
					return [ {
						picture : "sap-icon://line-chart",
						label : {
							type : "label",
							key : "LineChart",
							kind : "text"
						}
					} ];
				}
			} ];
			return stepTemplates;
		};
		sinon.stub(this.oGlobalApi.oCoreApi, 'getStepTemplates', this.spyGetStepTemplates);
		this.spyGetCategories = function() {
			var categories = [ {
				type : "category",
				id : "categoryTemplate1",
				stepTemplates : that.spyGetStepTemplates()
			} ];
			return categories;
		};
		sinon.stub(this.oGlobalApi.oCoreApi, 'getCategories', this.spyGetCategories);
		this.oStepGalleryController.getGalleryElementsData(); //CUT
		var oMessageObject = this.oMessage;
		assert.ok(oMessageObject instanceof MessageObject, "Message object created is an instance of sap.apf.core.MessageObject");
		assert.equal(oMessageObject.getParameters()[0], "Title", "Parameter of the message object is " + oMessageObject.getParameters()[0]);
		assert.equal(oMessageObject.getCode(), "6003", "Code of the message object is " + oMessageObject.getCode());
		this.oGlobalApi.oCoreApi.getStepTemplates.restore();
	});
	QUnit.test('Stable IDs for the step gallery', async function(assert) {
		await this.oStepGalleryController.openHierarchicalSelectDialog(); // opening the step gallery
		var pages = this.oStepGalleryController.oHierchicalSelectDialog.getContent()[0].mAggregations.pages;
		assert.strictEqual(pages[0].sId, "idStepGalleryCategoryPage", "THEN step gallery category page exists");
		assert.ok(pages[0] instanceof Page, "THEN type of page as expected");
		assert.strictEqual(pages[1].sId, "idStepGalleryStepPage", "THEN step gallery step page exists");
		assert.ok(pages[1] instanceof Page, "THEN type of page as expected");
		assert.strictEqual(pages[2].sId, "idStepGalleryRepresentationPage", "THEN step gallery representation page exists");
		assert.ok(pages[2] instanceof Page, "THEN type of page as expected");
		this.oStepGalleryController.oHierchicalSelectDialog.close();
	});
});
