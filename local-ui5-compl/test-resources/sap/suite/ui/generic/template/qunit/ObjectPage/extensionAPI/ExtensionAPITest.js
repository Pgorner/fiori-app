/**
 * tests for the sap.suite.ui.generic.template.ObjectPage.extensionAPI
 */

sap.ui.define(["testUtils/sinonEnhanced",
		"sap/suite/ui/generic/template/ObjectPage/extensionAPI/ExtensionAPI"], function(Sinon, ExtensionAPI) {
	"use strict";

	var sandbox;
	var sut;
	var oTemplateUtils = {
		oCommonUtils: {}
	};
	var oController = {};
	var oState = {};
	var oBase = {
		extensionAPI: {
			getTransactionControllerFunction: Function.prototype,
			getNavigationControllerFunction: Function.prototype
		}
	};

	QUnit.module("ObjectPage/ExtensionAPI/ExtensionAPI", {
		before: function() {
			sandbox = Sinon.sandbox.create();
			sut = new ExtensionAPI(oTemplateUtils, oController, oBase, oState);
		},
		after: function() {
			sandbox.restore();
		}
	}, function(){
		QUnit.test("invokeActions", function(assert) {
			var oExpectedResult = {};
			var oInvokeActionsForExtensionAPIStub = sandbox.stub(oTemplateUtils.oCommonUtils, "invokeActionsForExtensionAPI", function() {
				return Promise.resolve(oExpectedResult);
			})

			var oPromise = sut.invokeActions();
			assert.ok(oPromise instanceof Promise, "invokeActions returned a Promise");
			assert.ok(oInvokeActionsForExtensionAPIStub.calledOnce, "oInvokeActionsForExtensionAPI is called")
			assert.ok(oInvokeActionsForExtensionAPIStub.args[0][3].bSetBusy, "bSetBusy is set to true");

			var done = assert.async();
			setTimeout(function() {
				oPromise.then(function(oActualResult) {
					assert.equal(oActualResult, oExpectedResult, "...that was resolved to the same result as the promise returned from application controller");
					done();
				}, function() {
					assert.notOk(true, "...that was rejected");
					done();
				});
			});
			//cleanup
			oInvokeActionsForExtensionAPIStub.restore();
		});
	});

});
