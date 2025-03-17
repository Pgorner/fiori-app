/**
 * tests for the sap.suite.ui.generic.template.lib.ExtensionPoint
 */

sap.ui.define(["testUtils/sinonEnhanced",
                "sap/ui/generic/app/ApplicationController",
                "sap/suite/ui/generic/template/genericUtilities/AjaxHelper",
                "sap/suite/ui/generic/template/lib/AppComponent",
                "sap/suite/ui/generic/template/lib/CRUDHelper",
                "sap/suite/ui/generic/template/lib/navigation/NavigationController",
				"sap/suite/ui/generic/template/genericUtilities/testableHelper"],
	function(sinon, ApplicationController, AjaxHelper,
		AppComponent, CRUDHelper, NavigationController, testableHelper){
	"use strict";

	var oModel = {
		oMetadata: {
			isLoaded: function(){
				return true;
			},
			isFailed: function(){
				return false;
			}
		},
		attachPropertyChange: function(){},
		canoncialRequestsEnabled: function(){
			return false;
		},
		messageScopeSupported: function(){
			return Promise.resolve(false);
		},
		setPersistTechnicalMessages : function() {},
		setRetryAfterHandler: Function.prototype
	};
	var oTemplatePrivateGlobal = {
		setProperty: function() {}
	};
	var oApplicationController = {
		attachEvent: function(){},
		attachBeforeQueueItemProcess: function(){},
		attachOnQueueCompleted: function(){},
		attachOnQueueFailed: function(){}
	};

	var oAppComponent;
	var oStaticStub;
//
	var oSandbox;

	function fnGeneralSetup(){
			testableHelper.startTest();
			oStaticStub = testableHelper.getStaticStub();
			oSandbox = sinon.sandbox.create();
			oSandbox.stub(CRUDHelper, "enableAutomaticDraftSaving", Function.prototype);
			oSandbox.stub(oStaticStub, "NavigationController", function(){

			});

			oSandbox.stub(AppComponent.prototype, "getModel", function(sId){
				if(sId === "_templPrivGlobal") {
					return oTemplatePrivateGlobal;
				} else {
					return oModel;
				}
			});

			oSandbox.stub(AppComponent.prototype, "getManifestObject", function(){
				return {
					getEntry: function(){
						return {};
					},
					getComponentName: function() {
						return "TestingComponent"
					}
				};
			});
			oSandbox.stub(AppComponent.prototype, "getManifestEntry", function(){
				return { };
			});
			testableHelper.observeConstructor(ApplicationController, function(oM){
				if (oM !== oModel){
					throw new Error("ApplicationController must be instantiated with the OData model");
				}
				return oApplicationController;
			}, true);
	}
//
	function fnGeneralTeardown(){
			oSandbox.restore();
			testableHelper.endTest();
	}

	QUnit.module("Test ExtensionPoint", {
		beforeEach: fnGeneralSetup,
		afterEach: fnGeneralTeardown
	});

	QUnit.test("Dummy", function (assert) {
		assert.ok(true, "dummy test - Always Good!");
	});

	QUnit.module("Test features of the application descriptor", {
		beforeEach: function() {
			fnGeneralSetup();

			//aSetupArgs[0] is the getMethods function of AppComponent.js
			oAppComponent = new AppComponent();
		},
		afterEach: fnGeneralTeardown
	});

		//Variables needed for the tests
	var sManifestUrl130 = "test-resources/sap/suite/ui/generic/template/qunit/lib/testdata/manifest_v130.json",
		oManifest130 = AjaxHelper.syncGetJSON(sManifestUrl130).data;

	QUnit.test("Test getExtensionPoints Config", function(assert) {
		var oExpectedConfig = oManifest130["sap.ui5"].extends.extensions["sap.ui.controllerExtensions"],
			getManifestEntry = function(sPath) {
				assert.strictEqual(sPath, "sap.ui.generic.app", "Only path 'sap.ui.generic.app' must be accessed through getManifestEntry");
				return oManifest130[sPath];
			};
		oSandbox.stub(oAppComponent, "getMetadata", function() {
			return {
				getManifestEntry: getManifestEntry
			};
		});
		assert.ok(oExpectedConfig["sap.suite.ui.generic.template.ListReport.view.ListReport"], "ListReport ExtensionPoint available");
		assert.ok(oExpectedConfig["sap.suite.ui.generic.template.ObjectPage.view.Details"], "ObjectPage ExtensionPoint available");
	});
});
