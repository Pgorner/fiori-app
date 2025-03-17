/**
 * tests for the sap.suite.ui.generic.template.lib.StatePreserver
 */

sap.ui.define(["testUtils/sinonEnhanced", "sap/suite/ui/generic/template/lib/StatePreserver", "sap/suite/ui/generic/template/lib/navigation/routingHelper"
], function(sinon, StatePreserver, routingHelper) {
	"use strict";
	
	var oSandbox;
	var oComponentRegistryEntry = {
		viewLevel: {},
		utils: {
			getHeaderDataAvailablePromise: function(){
				return new Promise(function(fnResolve){ setTimeout(fnResolve, 100); });
			},
			isComponentActive: function(){
				return true;
			}
		}
	};
	var oNavigationControllerProxy = { };
	var oApplicationProxy = {
		areTwoKnownPathesIdentical: function(sPath1, sPath2, bIsRoot){
			if (bIsRoot !== (oComponentRegistryEntry.viewLevel === 1)){
				throw new Error("Root detection seems not to be valid");
			}
			return Promise.resolve(!!sPath1 && !!sPath2 && sPath1 === sPath2);
		}	
	};
	var oTemplateContract = {
		oNavigationControllerProxy: oNavigationControllerProxy,
		oApplicationProxy: oApplicationProxy,
		componentRegistry: {
			theComponentId: oComponentRegistryEntry
		},
		oBusyHelper: {
			getUnbusy: Function.prototype
		}
	};
	var oAppComponent = {};
	var oSettings = {
		oComponent: {
			getId: function(){
				return "theComponentId";
			},
			getAppComponent: function(){
				return oAppComponent;
			}
		},
		appStateName: "test-name"
	};
	
	QUnit.module("sap.suite.ui.generic.template.lib.StatePreserver instantiation", {}, function(){
		QUnit.test("Shall be instantiable", function(assert) {
			var oStatePreserver = new StatePreserver(oTemplateContract, oSettings);
			assert.ok(oStatePreserver, "StatePreserver should be instantiable");
		});
	});
	
	var oStatePreserver;

	QUnit.module("sap.suite.ui.generic.template.lib.StatePreserver", {
		beforeEach: function() {
			oSandbox = sinon.sandbox.create();
			oSandbox.stub(routingHelper, "getCrossAppNavServicePromise", function(){
				return Promise.resolve({
					createEmptyAppState: function(){
						return {
							getKey: function (){return "";},
							setData: Function.prototype,
							save: Function.prototype
						}} 
				});
			});
			oStatePreserver = new StatePreserver(oTemplateContract, oSettings);
		},
		afterEach: function() {
			oSandbox.restore();
		}
	}, function(){
		function fnSetNavigateByExchangingQueryParamNoKey(assert){
			// Remark: This helper function creates a stub for the navigation method that directly contains assertions. This is due to the fact that
			// originally, the (at least in case of stateChanged) the actual navigation happened asynchronously, without providing the user any information
			// when it happened. Originally, (other) users (then this test) did not need to know, when navigation has happened (in the meantime, also extensionAPI
			// needs to provide it, thus stateChanged returns a corresponding promise).
			var done = assert.async();
			oSandbox.stub(oNavigationControllerProxy, "navigateByExchangingQueryParam", function(sAppStateName, sKey){
				assert.strictEqual(sAppStateName, oSettings.appStateName, "AppStateName must be used correctly");
				assert.equal(sKey, "", "No key must be used in this scenario");
				done();
				return Promise.resolve();
			});
		}
		
		QUnit.test("Set the page to the first state", function(assert){
			var done = assert.async();
			fnSetNavigateByExchangingQueryParamNoKey(assert);
			oSandbox.stub(oSettings, "applyState", function(oState){
				assert.deepEqual(oState, Object.create(null), "State must be empty initially");
				done();
			});
			oStatePreserver.applyAppState("firstKey", false);
		});
		
		QUnit.test("State change must be handled: No state at all", function(assert) {
			fnSetNavigateByExchangingQueryParamNoKey(assert);
			oSandbox.spy(oSettings, "getCurrentState");
			oSandbox.stub(oSettings, "applyState", Function.prototype);
			var mAppStates = Object.create(null);
			mAppStates[oSettings.appStateName] = "dummy";
			oSandbox.stub(oNavigationControllerProxy, "getAppStateFromShell", function(sKey){
				return Promise.reject();
			});
			oStatePreserver.getAsStateChanger().isStateChange(mAppStates);
			oStatePreserver.applyAppState("xyz", false);
			oStatePreserver.stateChanged();
		});
		
		QUnit.test("State change must be handled: State without any lifecycle information", function(assert) {
			fnSetNavigateByExchangingQueryParamNoKey(assert);
			var oMyData = { a: 1, b: 2};
			oSandbox.stub(oSettings, "getCurrentState", function(){
				return {
					info:{
						data: oMyData
					}	
				};
			});
			oSandbox.stub(oSettings, "applyState", Function.prototype);
			var mAppStates = Object.create(null);
			mAppStates[oSettings.appStateName] = "dummy";
			oSandbox.stub(oNavigationControllerProxy, "getAppStateFromShell", function(sKey){
				return Promise.reject();
			});		
			oStatePreserver.getAsStateChanger().isStateChange(mAppStates);
			oStatePreserver.applyAppState("xyz", false);
			oStatePreserver.stateChanged();
		});
		
		QUnit.test("oSettings.applyState must be called when a url is caught that contains an app state", function(assert){
			// arrange
			var done = assert.async();
			var mAppStates = Object.create(null);
			var sMyAppStateKey = "myAppStateKey";
			mAppStates[oSettings.appStateName] = sMyAppStateKey;
			var oUrlState = {
					permanentEntries: {
						myProperty1: {
							data: 1,
							lifecycle: {
								permanent: true
							}
						},
						myProperty2: {
							data: {
								mySubProperty: 2
							},
							lifecycle: {
								permanent: true
							}
						},					
					}
			};
			var oGetAppStateFromShellStub = oSandbox.stub(oNavigationControllerProxy, "getAppStateFromShell", function(sKey){
				// Remark: this function is being called twice from one call of applyAppState, once with sKey being the key provided in URL and with with undefined
				return sKey ? Promise.resolve(oUrlState) : Promise.reject();
			});
			var oSettingsStateAppliedPromise = new Promise(function(resolve){
				oSandbox.stub(oSettings, "applyState", function(oState){
					resolve(oState);
				});
			});
			oStatePreserver.getAsStateChanger().isStateChange(mAppStates);
			
			// act
			// Now simulate that a route is caught that implicitly contains oUrlState 
			oStatePreserver.applyAppState("<new binding path>", true);
			
			// assert
			oSettingsStateAppliedPromise.then(function(oState){
				assert.equal(oGetAppStateFromShellStub.firstCall.args[0], sMyAppStateKey, "Shell service must be called with the key provided from outside");
				assert.deepEqual(oState, {
					myProperty1: 1,
					myProperty2: {
						mySubProperty: 2
					}
				}, "Correct state must have been passed to the applyState callback");
				done(); // The test was successfull when applyState has been called (with the correct state)
			});
		});
		
	});

	var oStateChanger;
	QUnit.module("StatePreserver as StateChanger", {
		beforeEach: function() {
			oSandbox = sinon.sandbox.create();
			oSandbox.stub(routingHelper, "getCrossAppNavServicePromise", function(){
				return Promise.resolve({
					createEmptyAppState: function(){
						return {
							getKey: function (){return "";},
							setData: Function.prototype,
							save: Function.prototype
						}} 
				});
			});
			oStateChanger = new StatePreserver(oTemplateContract, oSettings).getAsStateChanger();
		},
		afterEach: function() {
			oSandbox.restore();
		}
	}, function(){
		QUnit.test("isStateChange should return false, when being called while statePreserver is in 'sleeping phase'", function(assert){
			// arrange
			var mAppStates = Object.create(null);
			var sMyAppStateKey = "myAppStateKey";
			mAppStates[oSettings.appStateName] = sMyAppStateKey;
			
			// act
			// Now simulate that a route is caught that implicitly contains oUrlState 
			// Remark: isStateChange is not transient but also changes internal state of statePreserver. This is not tested here!
			var bResult = oStateChanger.isStateChange(mAppStates);
			
			// assert
			assert.notOk(bResult, "In this scenario, isStateChange should return false");
		});
	});
});