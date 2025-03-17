/**
 * tests for the sap.suite.ui.generic.template.lib.CRUDActionHandler
 */

sap.ui.define(["testUtils/sinonEnhanced", "sap/suite/ui/generic/template/lib/CRUDActionHandler"
], function(sinon, CRUDActionHandler) {
	"use strict";

	var bSideEffectsRunning;
	var oApplicationProxy = {
		performAfterSideEffectExecution: function(fnFunction){
			bSideEffectsRunning = false;
			fnFunction();
		}
	};
	var bIsBusy;
	var bBusyTestWhileSideEffect;
	var oBusyHelper = {
		isBusy: function(){
			if (bSideEffectsRunning){
				bBusyTestWhileSideEffect = true;
			}
			return bIsBusy;
		}
	};
	var oNavigationControllerProxy = {
			getActiveComponents : function(){
				return ["abc","def"];
			}
	}
	var bShowConfirmationOnDraftActivate = false;
	var oTemplateContract = {
		componentRegistry: {
			abc: {
				methods: {
					showConfirmationOnDraftActivate: function(){
						return bShowConfirmationOnDraftActivate;
					},
					getMessageFilters: function() {
						return "Filter1"
					}
				}
			},
			def: {
				methods: {
					showConfirmationOnDraftActivate: function(){
						return bShowConfirmationOnDraftActivate;
					},
					getMessageFilters: function() {
						return "Filte2"
					}
				}
			}
		},
		oApplicationProxy: oApplicationProxy,
		oBusyHelper: oBusyHelper,
		oNavigationControllerProxy: oNavigationControllerProxy
	};
	var oController = {
		getOwnerComponent: function(){
			return {
				getId: function(){
					return "abc";
				}
			};
		}
	};
	var oCommonUtils = {
		getDialogFragmentAsync: Function.prototype // need for setup
	};

	QUnit.module("Initialization");

	QUnit.test("Test that class can be instantiated", function(assert) {
		var oCRUDActionHandler = new CRUDActionHandler(oTemplateContract, oController, oCommonUtils);
		assert.ok(oCRUDActionHandler, "Class must be instantiatable");
	});

	var oSandbox;
	var oCRUDActionHandler;
	var bWasExecuted;

	function fnGeneralSetup(bWithWarnings){
		oSandbox = sinon.sandbox.create();
		bShowConfirmationOnDraftActivate = !!bWithWarnings;
		bSideEffectsRunning = true;
		bIsBusy = false;
		bWasExecuted = false;
		bBusyTestWhileSideEffect = false;
		oCRUDActionHandler = new CRUDActionHandler(oTemplateContract, oController, oCommonUtils);
	}

	function fnExecute(){
		bWasExecuted = true;
	}

	function fnGeneralTeardown(){
		oSandbox.restore();
	}

	function finalTest(assert, fnFunction){
		var done = assert.async();
		setTimeout(function(){
			assert.ok(!bBusyTestWhileSideEffect, "Busy test must not be executed during side-effects");
			fnFunction();
			done();
		}, 500);
	}

	QUnit.module("Test handleCRUDScenario", {
		beforeEach: fnGeneralSetup,
		afterEach: fnGeneralTeardown
	});

	QUnit.test("Test that handleCRUDScenario is not called if app is busy", function(assert) {
		bIsBusy = true;
		oCRUDActionHandler.handleCRUDScenario(1, fnExecute);
		oCRUDActionHandler.handleCRUDScenario(2, fnExecute);
		finalTest(assert, function(){
			assert.ok(!bWasExecuted, "Operation must not have been executed in busy case");
		});
	});


});
