/**
 * tests for the sap.suite.ui.generic.template.extensionAPI.NavigationController
 */

sap.ui.define(["testUtils/sinonEnhanced",
	"sap/suite/ui/generic/template/genericUtilities/testableHelper",
	"sap/suite/ui/generic/template/extensionAPI/NavigationController"
], function (sinon,
	testableHelper,
	NavigationController) {
	"use strict";

	var oSandbox;
	var oTemplateUtils = {
		oComponentUtils: {
			isDraftEnabled: Function.prototype
		},
		oServices: {
			oApplicationController: {
				synchronizeDraftAsync: Function.prototype
			},
			oApplication: {
				navigateToSubContext: Function.prototype
			}
		}
	};
	var oNavigationController = new NavigationController(oTemplateUtils);

	function fnGeneralStartup() {
		oSandbox = sinon.sandbox.create();
	}

	function fnGeneralTeardown() {
		oSandbox.restore();
		testableHelper.endTest();
	}

	QUnit.module("extensionAPI.NavigationController", {
		beforeEach: fnGeneralStartup,
		afterEach: fnGeneralTeardown
	});

	QUnit.test("Test navigateInternal function - call to synchronizeDraftAsync for draft apps", function (assert) {
		oSandbox.stub(oTemplateUtils.oComponentUtils, "isDraftEnabled").returns(true);
		var oSynchronizeDraftAsyncStub = oSandbox.stub(oTemplateUtils.oServices.oApplicationController, "synchronizeDraftAsync", function() {
			return Promise.resolve();
		});

		oNavigationController.navigateInternal([], {});

		assert.equal(oSynchronizeDraftAsyncStub.calledOnce, true, "synchronizeDraftAsync method should be called for draft apps.");
	});

	QUnit.test("Test navigateInternal function - call to synchronizeDraftAsync for non draft apps", function (assert) {
		oSandbox.stub(oTemplateUtils.oComponentUtils, "isDraftEnabled").returns(false);
		var oSynchronizeDraftAsyncStub = oSandbox.stub(oTemplateUtils.oServices.oApplicationController, "synchronizeDraftAsync", function() {
			return Promise.resolve();
		});

		oNavigationController.navigateInternal([], {});

		assert.equal(oSynchronizeDraftAsyncStub.called, false, "synchronizeDraftAsync method should not be called for draft apps.");
	});
});