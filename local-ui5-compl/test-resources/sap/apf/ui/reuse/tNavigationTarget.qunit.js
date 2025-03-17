//BlanketJS coverage (Add URL param 'coverage=true' to see coverage results)
/*global sinon */
sap.ui.define([
	"sap/apf/core/resourcePathHandler",
	"sap/apf/testhelper/doubles/createUiApiAsPromise",
	"sap/apf/testhelper/doubles/sessionHandlerStubbedAjax",
	"sap/apf/utils/utils",
	"sap/base/util/Deferred",
	"sap/ui/core/mvc/View",
	"sap/ui/layout/VerticalLayout",
	"sap/apf/testhelper/interfaces/IfUiInstance",
	"sap/apf/testhelper/doubles/UiInstance",
	"sap/apf/utils/navigationHandler",
	"sap/ui/thirdparty/sinon"
], function(
	ResourcePathHandler,
	createUiApiAsPromise,
	SessionHandlerStubbedAjax,
	utils,
	Deferred,
	View,
	VerticalLayout
) {
	"use strict";
	function doNothing() {
	}
	QUnit.module("Navigation target unit tests", {
		beforeEach : function(assert) {
			var self = this;
			var done = assert.async();
			var ResourcePathHandlerStubbed = function(inject){
				ResourcePathHandler.call(this, inject);
				this.getConfigurationProperties = function() {
					var appConfig = {
							appName : "sap-working-capital-analysis"
					};
					return utils.createPromise(appConfig);
				};
			};
			var inject = {
					constructors : {
						SessionHandler : SessionHandlerStubbedAjax,
						ResourcePathHandler : ResourcePathHandlerStubbed
					}
			};
			createUiApiAsPromise(undefined, undefined, inject).done(function(api){
				self.oGlobalApi = api;
				self.navTargetsWithoutStepSpecific = {
						global : [ {
							id : "NavigationTarget-1",
							semanticObject : "FioriApplication",
							action : "analyzeKPIDetails",
							text : "Analyze KPI Details"
						}, {
							id : "NavigationTarget-2",
							semanticObject : "APFI2ANav",
							action : "launchNavTarget",
							text : "Detailed Analysis"
						} ],
						stepSpecific : []
				};
				self.navTargetsWithoutStepSpecificAndCustomisedTitle = {
						global : [ {
							id : "NavigationTarget-2",
							semanticObject : "FioriApplication",
							action : "analyzeKPIDetails",
							text : "Analyze KPI Details",
							title : {
								key : "14948378644464830936530713146940",
								kind : "text",
								type : "label"
							}
						}],
						stepSpecific : []
				};
				self.navTargetsWithStepSpecific = {
						global : [ {
							id : "NavigationTarget-1",
							semanticObject : "FioriApplication",
							action : "analyzeKPIDetails",
							text : "Analyze KPI Details"
						}, {
							id : "NavigationTarget-2",
							semanticObject : "APFI2ANav",
							action : "launchNavTarget",
							text : "Detailed Analysis"
						} ],
						stepSpecific : [ {
							id : "NavigationTarget-3",
							semanticObject : "FioriApplication",
							action : "analyzeKPIDetails",
							text : "Analyze KPI Details"
						}, {
							id : "NavigationTarget-4",
							semanticObject : "APFI2ANav",
							action : "launchNavTarget",
							text : "Detailed Analysis"
						} ]
				};
				var stubGetTextEncoded = function(x) {
					return x;
				};
				
				var stubLoadNotificationBar = function() {
					var layout = new VerticalLayout();
					layout.getController = function() {
						return {
							showMessage : doNothing
						};
					};
					return Promise.resolve(layout);
				};
				var stubStepContainer = function() {
					return new VerticalLayout();
				};
				var stubAnalysisPath = function() {
					return new VerticalLayout();
				};
				
				sinon.stub(self.oGlobalApi.oCoreApi, 'getTextNotHtmlEncoded', stubGetTextEncoded);
				sinon.stub(self.oGlobalApi.oUiApi, 'loadNotificationBar', stubLoadNotificationBar);
				sinon.stub(self.oGlobalApi.oUiApi, 'getStepContainer', stubStepContainer);
				sinon.stub(self.oGlobalApi.oUiApi, 'getAnalysisPath', stubAnalysisPath);
				var getNavigationTargetsStub = new sinon.stub();
				var oDeferredFirstCall = new jQuery.Deferred();
				oDeferredFirstCall.resolve(self.navTargetsWithoutStepSpecific);
				var oDeferredSecondCall = new jQuery.Deferred();
				oDeferredSecondCall.resolve(self.navTargetsWithStepSpecific);
				var oDeferredThirdCall = new jQuery.Deferred();
				oDeferredThirdCall.resolve(self.navTargetsWithoutStepSpecificAndCustomisedTitle);
				getNavigationTargetsStub.onFirstCall().returns(oDeferredFirstCall.promise());
				getNavigationTargetsStub.onSecondCall().returns(oDeferredSecondCall.promise());
				getNavigationTargetsStub.onThirdCall().returns(oDeferredThirdCall.promise());
				self.layoutView = self.oGlobalApi.oUiApi.getLayoutView();
				self.layoutController = self.layoutView.getController();
				self.oNavigationHandler = self.layoutView.getViewData().oNavigationHandler;
				self.oNavigationHandler.getNavigationTargets = getNavigationTargetsStub;
				self.selectedNavTarget = "";
				self.navigateToAppSpy = function(selectedNavTarget) {
					self.selectedNavTarget = selectedNavTarget;
				};
				self.spyNavigateToApp = sinon.spy(self.navigateToAppSpy);
				sinon.stub(self.oNavigationHandler, "navigateToApp", self.spyNavigateToApp);
				done();
			});

		},
		afterEach : function() {
			this.oGlobalApi.oCoreApi.getTextNotHtmlEncoded.restore();
			this.oGlobalApi.oUiApi.loadNotificationBar.restore();
			this.oGlobalApi.oUiApi.getStepContainer.restore();
			this.oGlobalApi.oUiApi.getAnalysisPath.restore();
			this.oNavigationHandler.navigateToApp.restore();
			this.oGlobalApi.oCompContainer.destroy();
		}
	});
	QUnit.test("Populate open in popover and navigate", async function(assert) {
		/**
		 * as the view is loaded asynchronously on button press,
		 * we have to wait for the view to be loaded before accessing its content
		 */
		const buttonPressedAndViewCreated = () => {
			const deferred = new Deferred();

			// intercept View.create calls and resolve asfter view of interest has been created
			const origMethod = View.create;
			sinon.stub(View, "create", function(oConfig) {
				const result = origMethod.apply(this, arguments);
				if ( oConfig.viewName === "module:sap/apf/ui/reuse/view/navigationTarget.view") {
					result.then(() => {
						deferred.resolve();
						View.create.restore()
					});
				}
				return result;
			});

			// now simulate clicking the openInBtn
			this.layoutController.openInBtn.firePress();

			return deferred.promise;
		}

		//Global navigation target test
		await buttonPressedAndViewCreated();

		assert.deepEqual(this.layoutController.oNavListPopover.getContent()[0].getModel().getData().navTargets, this.navTargetsWithoutStepSpecific.global, "Open in pop over is populated with global navigation target actions");
		this.layoutController.oNavListPopover.getContent()[0].getItems()[0].firePress();
		assert.equal(this.selectedNavTarget, "NavigationTarget-1", "Global Navigation target is selected from the open in popover");
		assert.ok(this.spyNavigateToApp.called === true, "Navigated to selected global navigation target");

		//Step specific target test
		await buttonPressedAndViewCreated();

		var stepSpecificList = this.layoutController.oNavListPopover.getContent()[0].getModel().getData().navTargets;
		var globalList = this.layoutController.oNavListPopover.getContent()[2].getModel().getData().navTargets;
		var list = {
				global : globalList,
				stepSpecific : stepSpecificList
		};
		assert.deepEqual(list, this.navTargetsWithStepSpecific, "Open in pop over is populated with step specific and global navigation target actions");
		this.layoutController.oNavListPopover.getContent()[0].getItems()[0].firePress();
		assert.equal(this.selectedNavTarget, "NavigationTarget-3", "Step specific Navigation target is selected from the open in popover");
		assert.ok(this.spyNavigateToApp.called === true, "Navigated to selected step specific navigation target");

		//global navigation target with user defined title
		await buttonPressedAndViewCreated();

		var globalListWithCustomTitle = this.layoutController.oNavListPopover.getContent()[0].getModel().getData().navTargets;
		var listWithCustomTitle = {
				global : globalListWithCustomTitle,
				stepSpecific : []
		};
		this.layoutController.oNavListPopover.getContent()[0].getItems()[0].firePress();
		assert.equal(this.selectedNavTarget, "NavigationTarget-2", "Global Navigation target is selected from the open in popover");
		assert.deepEqual(listWithCustomTitle, this.navTargetsWithoutStepSpecificAndCustomisedTitle, "Open in pop over is populated with step specific and global navigation target actions with user defined title");
	});
});
