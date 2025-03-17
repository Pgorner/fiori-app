/**
 * tests for the sap.suite.ui.generic.template.lib.Application
 */
sap.ui.define([
	"testUtils/sinonEnhanced",
	"sap/suite/ui/generic/template/lib/Application",
	"sap/suite/ui/generic/template/genericUtilities/testableHelper",
	"sap/fe/navigation/NavigationHandler"
], function (sinon, Application, testableHelper, NavigationHandler) {
	"use strict";

	QUnit.module("Correct determination of static private methods", {
		beforeEach: testableHelper.startTest,
		afterEach: testableHelper.endTest
	});

	function fnTestDensityClass(bTouch, aClassesInBody, sExpected, assert) {
		var oStaticStub = testableHelper.getStaticStub();
		var fnHasClass = function (sClass) {
			return aClassesInBody.some(function (currentValue) {
				return currentValue === sClass;
			});
		};
		if (!aClassesInBody.contains) {
			aClassesInBody.contains = function(className) {
				for (var i = 0; i<this.length; i++) {
					if (this[i] === className){
						return true
					}
				}
				return false;
			}
		}
		var sContentDensityClass = oStaticStub.Application_determineContentDensityClass(bTouch, {
			hasClass: fnHasClass,
			classList : aClassesInBody
		});
		assert.strictEqual(sContentDensityClass, sExpected, "Content density class must match");
	}

	QUnit.test("Test that density class is determined correctly on touch devices", fnTestDensityClass.bind(null, true, ["other"],
		"sapUiSizeCozy"));
	QUnit.test("Test that density class is determined correctly on non-touch devices", fnTestDensityClass.bind(null, false, ["other"],
		"sapUiSizeCompact"));
	QUnit.test("Test that density class is determined correctly on touch devices with preset density class", fnTestDensityClass.bind(null,
		true, ["sapUiSizeCozy"], ""));
	QUnit.test("Test that density class is determined correctly on non-touch devices with preset density class", fnTestDensityClass.bind(
		null, false, ["sapUiSizeCompact"], ""));
	QUnit.test("Test that attach to parent works correctly", function (assert) {
		var oStaticStub = testableHelper.getStaticStub();
		var oControl = {};
		var oParent = {};
		var oAddDependentSpy = sinon.spy(oParent, "addDependent");
		oStaticStub.Application_attachControlToParent(oControl, oParent);
		assert.ok(oAddDependentSpy.calledOnce, "control must have been added as dependent to parent");
		assert.ok(oAddDependentSpy.calledWithExactly(oControl), "correct control must have been added as dependent to parent");
	});

	QUnit.module("Startup tests");

	QUnit.test("Test that Application can be created", function (assert) {
		var oTemplateContract = {
			mBusyTopics: Object.create(null)
		};
		var oApplication = new Application(oTemplateContract);
		assert.ok(oApplication, "Application was created successfully");
		assert.ok(!!oTemplateContract.oApplicationProxy, "Proxy for application class has been inserted into the TemplateContract");
	});

	QUnit.module("Navigation handler tests");

	QUnit.test("Test the _navigateCallback method on NavigationHandler", function (assert) {
		var done = assert.async();

		var oTemplateContract = {
			mBusyTopics: {},
			oBusyHelper: {
				setBusyReason: Function.prototype
			},
			oAppComponent: {
				getOwnerComponent: function() {
					return {
						oComponentData: {},
						getComponentData: function() {
							return {};
						},
						getAppComponent: function() {
							return {
								getComponentData: function() {
									return {};
								},
							}
						}
					};
				}
			}
		};
		sinon.stub(NavigationHandler.prototype, "_getRouter").returns({});
		var oStubSetBusyReason = sinon.stub(oTemplateContract.oBusyHelper, "setBusyReason");

		function fnRestoreStubs() {
			oStubSetBusyReason.restore();
		}

		var oApplication = new Application(oTemplateContract);
		var oNavigationHandler = oApplication.getNavigationHandler();
		//Invoke the "navigateCallback" without any parameters
		oNavigationHandler._navigateCallback();
		
		assert.equal(oStubSetBusyReason.callCount, 1, "Logic to hide the busy helper should be invoked when navigateCallback is invoked without any parameter");	
		assert.deepEqual(oStubSetBusyReason.lastCall.args, ["exiting", false]);

		//Invoke the "navigateCallback" with a promise
		var oNavigationFinishedPromise = new Promise(function(resolve){
			setTimeout(resolve, 200);
		});

		oNavigationHandler._navigateCallback(oNavigationFinishedPromise);
		oNavigationFinishedPromise.then(function(){
			assert.equal(oStubSetBusyReason.callCount, 2, "Logic to hide the busy helper should be invoked when navigateCallback is invoked with a promise");
			assert.deepEqual(oStubSetBusyReason.lastCall.args, ["exiting", false]);
			fnRestoreStubs();
			done();
		});
	});
});
