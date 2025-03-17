/*global QUnit */
sap.ui.define([
	"sap/apf/testhelper/doubles/createUiApiAsPromise",
	"sap/apf/testhelper/doubles/navigationHandler",
	"sap/apf/testhelper/doubles/request",
	"sap/apf/testhelper/doubles/sessionHandlerStubbedAjax",
	"sap/ui/core/Element",
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"sap/ui/thirdparty/jquery",
	'sap/apf/testhelper/helper',
	'sap/apf/testhelper/interfaces/IfUiInstance',
	'sap/apf/testhelper/doubles/UiInstance',
	'sap/apf/testhelper/config/sampleConfiguration',
	'sap/apf/testhelper/odata/sampleServiceData',
	'sap/apf/testhelper/doubles/metadata',
	'sap/apf/testhelper/doubles/Representation',
	'sap/apf/testhelper/stub/textResourceHandlerStub',
	"sap/apf/core/utils/uriGenerator"
], function(
	createUiApiAsPromise,
	NavigationHandlerDouble,
	RequestDouble,
	SessionHandlerStubbedAjax,
	Element,
	Opa5,
	opaTest,
	jQuery
) {
	"use strict";

	var oGlobalApi;
	function firePressOnElementByTitle(title){
		var done;
		jQuery('.sapMLIB').each(function(name, element){ 
			var attribute = Element.getElementById(element.getAttribute("id"));
			if(!done && attribute.mProperties.title === title){
				attribute.firePress();// click on the representation
				done = true;
			}
		}); 
	}
	var arrangement = Opa5.extend("arrangement", {
		globalSetup : function() {

			function NewMetadataDouble() {
				var metadata;
				this.getPropertyMetadata = function(sPropertyName) {
					if (sPropertyName === "CustomerName") {
						metadata = {
							"aggregation-role" : "dimension",
							"dataType" : {
								"maxLength" : "10",
								"type" : "Edm.String"
							},
							"label" : "Customer Name",
							"name" : "CustomerName"
						};
						return metadata;
					}
					if (sPropertyName === "DaysSalesOutstanding") {
						metadata = {
							"aggregation-role" : "measure",
							"dataType" : {
								"maxLength" : "10",
								"type" : "Edm.String"
							},
							"label" : "DSO",
							"name" : "DaysSalesOutstanding"
						};
						return metadata;
					}
				};
			}

			var inject = {
					constructors : {
						SessionHandler : SessionHandlerStubbedAjax,
						Metadata : NewMetadataDouble,
						Request : RequestDouble,
						NavigationHandler : NavigationHandlerDouble
					}
			};

			createUiApiAsPromise(undefined, sap.ui.require.toUrl("sap/apf/testhelper/config/applicationConfigurationIntegration.json"), inject).done(function(api){
				oGlobalApi = api;
				oGlobalApi.oCompContainer.placeAt("stepContainerContent");
			});
		}
	});
	var action = Opa5.extend("action", {
		representationClickStepGallery : function(oCurrentStep, bStepChanged) {
			oGlobalApi.oUiApi.getAddAnalysisStepButton().firePress();
			firePressOnElementByTitle("categoryTitle"); // Navigating to second page (steps)
			firePressOnElementByTitle("RevenueByCustomer"); //Navigating to third page (representations)

			return this.waitFor({
				timeout : 2000,
				check : function() {
					var representationList = jQuery(".sapMLIB").length; // list has only the current content on the hierarchical dialog
					if (representationList > 2) {
						return representationList;
					}
				},
				success : function() {
					firePressOnElementByTitle("Pie Chart"); //create step
				},
				error : function() {
					Opa5.assert.ok(false, "Representation List not rendered!!");
				}
			});
		},
		createStep : function() {
			return this.waitFor({
				timeout : 2000,
				check : function() {
					var bIsStepCreated = false;
					var stepLength = oGlobalApi.oCoreApi.getSteps().length;
					if (stepLength > 0) {
						bIsStepCreated = true;
					}
					return bIsStepCreated;
				},
				error : function() {
					Opa5.assert.ok(false, "Step creation failed!!!");
					self.globalTearDown();
				}
			});
		}
	});
	var assertion = Opa5.extend("assertion", {
		checkStepContainer : function() {
			var self = this;
			var assert = QUnit.assert;
			return this.waitFor({
				timeout : 3000,
				check : function() {
					var bStepCrested = false;
					var stepLength = oGlobalApi.oCoreApi.getSteps().length;
					var contentRight = (oGlobalApi.oUiApi.getStepContainer().getStepToolbar().chartToolbar.getToolBar().getContentRight().length === 10) ? true : false;
					if (stepLength > 0 && contentRight > 0) {
						bStepCrested = true;
					}
					return bStepCrested;
				},
				success : function() {
					var assert = Opa5.assert;
					assert.ok(oGlobalApi.oCoreApi.getSteps().length > 0, "Step created on click of representation in step gallery");
					var chartInStepContainer = oGlobalApi.oUiApi.getStepContainer().getStepToolbar().getContent()[0].getCharts();
					assert.strictEqual(oGlobalApi.oCoreApi.getSteps().length, 1, "Step is added to the layout");
					assert.strictEqual(chartInStepContainer.length, 1, "One chart is available in the step container");
					var selectedRepTypeMainContent = oGlobalApi.oCoreApi.getSteps()[0].getSelectedRepresentation().getMainContent("localText2").getVizType();
					var chartTypeInStepContainer = oGlobalApi.oUiApi.getStepContainer().getStepToolbar().getContent()[0].getCharts()[0].getVizType();
					var chartTypeInStepTemplate = oGlobalApi.oCoreApi.getStepTemplates()[0].getRepresentationInfo()[0].representationId;
					assert.strictEqual(chartTypeInStepTemplate, "PieChart", "Representation type in the step created is " + chartTypeInStepTemplate);
					assert.strictEqual(chartTypeInStepContainer, "pie", "Representation type " + chartTypeInStepContainer + "added in step container");
					assert.strictEqual(selectedRepTypeMainContent, "pie", "Selected representation type is " + selectedRepTypeMainContent);
					//strictEqual(selectedRepTypeThumbnailContent, selectedRepTypeMainContent, "Representation type is same in thumbnail and step container");
					assert.strictEqual(chartTypeInStepContainer, selectedRepTypeMainContent, "Representation type added in step container is same as the selected representation type");
					self.globalTearDown();
				},
				error : function() {
					assert.ok(false, "StepContainer not rendered!!!");
					self.globalTearDown();
				}
			});
		},
		globalTearDown : function() {
			jQuery("#stepContainerContent").remove();
		}
	});
	Opa5.extendConfig({
		arrangements : new arrangement(),
		actions : new action(),
		assertions : new assertion()
	});
	opaTest("Creation of step on click of a representation in the step gallery", function(Given, When, Then) {
		Given.globalSetup(); // Arrangements
		When.representationClickStepGallery().and.createStep(); //Actions
		Then.checkStepContainer(); // Assertions
	});
});
