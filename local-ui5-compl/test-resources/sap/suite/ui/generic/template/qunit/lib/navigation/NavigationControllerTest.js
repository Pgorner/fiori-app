/**
 * tests for the sap.suite.ui.generic.template.lib.navigation.NavigationController
 */
sap.ui.define([
	"testUtils/sinonEnhanced",
	"sap/m/NavContainer",
	"sap/m/routing/Router",
	"sap/ui/core/routing/Router",
	"sap/ui/core/routing/Views",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/model/json/JSONModel",
	"sap/suite/ui/generic/template/lib/AppComponent",
	"sap/suite/ui/generic/template/lib/navigation/NavigationController",
	"sap/suite/ui/generic/template/genericUtilities/testableHelper",
	"sap/suite/ui/generic/template/lib/navigation/routingHelper"
], function (sinon, NavContainer, MRouter, Router, Views, ODataModel, JSONModel, AppComponent, NavigationController, testableHelper, routingHelper) {
	"use strict";

	var oConfig = {
		"pages": [{
			"entitySet": "I_AIS_E_SalesOrder_A",
			"component": {
				"name": "sap.suite.ui.generic.template.ListReport"
			}
		}]
	};
	var oTemplatePrivateModel;
	var oRouter;
	var oTemplateContract;
	function getTemplateContract (){
		return {
			oApplicationProxy: {
				onAfterNavigate: Function.prototype,
				onBypassed: Function.prototype,
				onRouteMatched: Function.prototype
			},
			oBusyHelper: {
				setBusy: sinon.stub(),
				setBusyReason: sinon.stub()
			},
			aStateChangers: [],
			componentRegistry: {
				component1: {
					route: "SalesOrder",
					methods: {
					},
					utils: {
						getTemplatePrivateModel: function () {
							return oTemplatePrivateModel;
						},
						suspendBinding: Function.prototype
					},
					oControllerUtils: {
						oServices: {
							oTemplateCapabilities: {}
						}
					},
					oStatePreserverPromise: {
						then: Function.prototype
					},
					viewRegistered: Promise.resolve()
				}
			},
			oPagesDataLoadedObserver: {
				getProcessFinished: function () {
					return {
						then: Function.prototype
					};
				}
			},
			routeViewLevel1: {
				pattern: ""
			},
			oShellServicePromise: {
				then: function() {
					return new Promise(function(resolve, reject) {});
				}
			},
			oStatePreserversAvailablePromise: Promise.resolve(),
			oHeaderLoadingObserver: {
				addObserver: sinon.stub()
			}
		}
	};
	var oAppComponent;
	var oQueue = {
		makeQueuable: function(fnQueued){
			return fnQueued;
		},
		start: function(){
			return oQueue;
		},
		stop: Function.prototype
	};
	var oHashChangerStub;
	var oSandbox;
	var oTargets
	function getTargets() {
		return {
			addTarget: sinon.stub(),
			display: sinon.stub().returns("oDisplayPromise")
		}
	};
	var oTemplatePrivateGlobalModel;
	var oStubForPrivate;

	var sHistoryKey = "t";
	var oModel = sinon.createStubInstance(ODataModel);
	var oMetaModel = {
		loaded: function () {
			return {
				then: function (fnThen) {}
			};
		}
	};
	oModel.getMetaModel.returns(oMetaModel);
	var oNavigationController; // the object under test

	QUnit.module("sap.suite.ui.generic.template.lib.navigation.NavigationController", {
		beforeEach: function () {
			oStubForPrivate = testableHelper.startTest();
			var oStaticStub = testableHelper.getStaticStub();
			sHistoryKey =  sHistoryKey + "t";
			oSandbox = sinon.sandbox.create();
			oSandbox.stub(oStaticStub, "Queue", function() {
				return oQueue;
			});
			oSandbox.stub(routingHelper, "generateRoutingStructure", function(oTemplateContractPar){
				if (oTemplateContract === oTemplateContractPar){
					return {
						then: function(fnExecute){
							fnExecute();
							return Promise.resolve();
						}
					};
				}
			});
			oSandbox.stub(oStubForPrivate, "getParsedShellHashFromFLP", function(){
				return {
					then: function(fnExecute){
						fnExecute();
						return Promise.resolve();
					}
				};
			})
			oHashChangerStub = {
				replaceHash: sinon.stub(),
				setHash: sinon.stub(),
				getHash: sinon.stub()
			};
			oAppComponent = sinon.createStubInstance(AppComponent);
			oAppComponent.getManifestEntry.returns({});
			oAppComponent.getConfig = function () {
				return oConfig;
			};
			oTemplatePrivateGlobalModel = {
				bindProperty: function (sPath) {
					return {
						attachChange: function (fnHandleNavigationMenu) {}
					};
				},
				setProperty: function(sPath, sValue){

				},
				getProperty: function(){}
			};
			oTemplatePrivateModel = new JSONModel();
			var oNavigationHost = sinon.createStubInstance(NavContainer);
			oTemplateContract = getTemplateContract();
			oTemplateContract.oAppComponent = oAppComponent;
			oTemplateContract.oNavigationHost = oNavigationHost;
			oTemplateContract.getText = Function.prototype;
			oTemplateContract.oTemplatePrivateGlobalModel = oTemplatePrivateGlobalModel;
			var oModel = sinon.createStubInstance(ODataModel);
			oMetaModel = {
				loaded: function () {
					return {
						then: function (fnThen) {}
					};
				}
			};
			oModel.getMetaModel.returns(oMetaModel);
			oTemplateContract.oAppComponent.getOwnModels = function(){
				return {
					undefined: oModel,
					templatePrivateGlobalModel: oTemplatePrivateGlobalModel,
					templatePrivateModel: oTemplatePrivateModel
				};
			};
			oAppComponent.getModel.returns(oModel);
			oTargets = getTargets();
			oRouter = sinon.createStubInstance(Router);
			oRouter.getTargets.returns(oTargets);
			oRouter.getHashChanger.returns(oHashChangerStub);
			oAppComponent.getRouter.returns(oRouter);
			oRouter._oViews = sinon.createStubInstance(Views);
			oNavigationController = new NavigationController(oTemplateContract);
			oTemplateContract.mEntityTree = Object.create(null);
			oTemplateContract.mRoutingTree = Object.create(null);
			oTemplateContract.mEntityTree.SalesOrderItem = {
				sRouteName: "SalesOrderItem",
				entitySet: "SalesOrderItem",
				display: oSandbox.stub(),
				level: 2,
				fCLLevel: 0,
				parent: "SalesOrder",
				parentRoute: "SalesOrder",
				getPath: function(iMode, aKeys){
					var sRet = "SalesOrderItem({keys2})";
					if (aKeys){
						sRet = sRet.replace("{keys2}", aKeys[2]);
					}
					if (iMode > 1){
						sRet = "/" + sRet;
					}
					return sRet;
				},
				contextPath: "SalesOrderItem({keys2})"
			};
			oTemplateContract.mEntityTree.SalesOrder = {
				sRouteName: "SalesOrder",
				entitySet: "SalesOrder",
				display: oSandbox.stub(),
				page: {
					component: {
						name: "sap.suite.ui.generic.template.ListReport"
					},
					entitySet: "SalesOrder"
				},
				level: 1,
				fCLLevel: 0,
				children: ["SalesOrderItem"],
				parentRoute: "root",
				getPath: function(iMode){
					return iMode === 1 ? "" : "SalesOrder";
				},
				contextPath: "SalesOrder"
			};
			oTemplateContract.mRoutingTree.SalesOrderItem = oTemplateContract.mEntityTree.SalesOrderItem;
			oTemplateContract.mRoutingTree.SalesOrder = oTemplateContract.mEntityTree.SalesOrder;
			oTemplateContract.mRoutingTree.root = {
				sRouteName: "root",
				level: 0,
				display: oSandbox.stub(),
				fCLLevel: 0,
				children: ["SalesOrder"],
				getPath:function(){
					return "";
				}
			};
			oTemplateContract.oTemplatePrivateGlobalModel = new JSONModel();
		},
		afterEach: function () {
			oNavigationController.destroy();
			oSandbox.restore();
			testableHelper.endTest();
		}
	});

	QUnit.test("Shall be instantiable", function (assert) {
		assert.ok(oNavigationController);
		assert.ok(!oHashChangerStub.setHash.called, "Instantiation should not set hash");
		assert.ok(!oHashChangerStub.replaceHash.called, "Instantiation should not replace hash");
	});

	function fnTestNavigateToContext(bReplace){
		QUnit.test("navigateToContext shall call navTo on the Router with correct parameters when navigating to a main object with bReplace: " + bReplace, function (assert) {
			var done = assert.async();
			setTimeout(function(){
				oStubForPrivate.setHistoryKey(sHistoryKey);
				oStubForPrivate.setCurrentIdentity({
					treeNode: oTemplateContract.mEntityTree.SalesOrder,
					keys: ["", "124"],
					appStates: Object.create(null)
				});
				var sPath = "/SalesOrder(123)";
				var oContext = {
					getPath: function () {
						return sPath;
					},
					getModel: function () {
						return oModel;
					}
				};
				oSandbox.stub(oTemplateContract.oApplicationProxy, "getIdentityKeyForContext", function () {
					return ["", "123"];
				});
				oNavigationController.navigateToContext(oContext, null, bReplace);
				setTimeout(function() {
					assert.ok(!oHashChangerStub.replaceHash.called, "replaceHash must not have been called");
					assert.ok(!oHashChangerStub.setHash.called, "setHash must not have been called");
					assert.ok(oRouter.navTo.calledOnce, "navTo must have been called exactly once");
					var aArguments = oRouter.navTo.firstCall.args;
					assert.strictEqual(aArguments.length, 3, "Correct number of arguments must have been passed");
					assert.strictEqual(aArguments[0], "SalesOrderquery", "Correct route must have been passed");
					assert.deepEqual(aArguments[1], {
						keys1: "123",
						query: {
							"sap-iapp-state--history": sHistoryKey
						}
					}, "Correct keys must have been passed");
					assert.strictEqual(aArguments[2], !!bReplace, "replace parameter must have been passed correctly");
					done();
				}, 0);
			}, 0);
		});

		QUnit.test("navigateToContext shall call navTo on the Router with correct parameters when navigating to a sub object with bReplace: " + bReplace, function (assert) {
			var sPath = "/SalesOrderItem(12345)";
			var oContext = {
				getPath: function () {
					return sPath;
				},
				getModel: function () {
					return oModel;
				}
			};
			var done = assert.async();
			setTimeout(function(){
				oStubForPrivate.setHistoryKey(sHistoryKey);
				oStubForPrivate.setCurrentIdentity({
					treeNode: oTemplateContract.mEntityTree.SalesOrder,
					keys: ["", "123"],
					appStates: Object.create(null)
				});
				oStubForPrivate.setCurrentIdentity({
					treeNode: oTemplateContract.mEntityTree.SalesOrderItem,
					keys: ["", "123", "123xy"],
					appStates: Object.create(null)
				});
				oSandbox.stub(oTemplateContract.oApplicationProxy, "getIdentityKeyForContext", function () {
					return ["", "123", "12345"];
				});
				oNavigationController.navigateToContext(oContext, null, bReplace);
				setTimeout(function () {
					assert.ok(!oHashChangerStub.replaceHash.called, "replaceHash must not have been called");
					assert.ok(!oHashChangerStub.setHash.called, "setHash must not have been called");
					assert.ok(oRouter.navTo.calledOnce, "navTo must have been called exactly once");
					var aArguments = oRouter.navTo.firstCall.args;
					assert.strictEqual(aArguments.length, 3, "Correct number of arguments must have been passed");
					assert.strictEqual(aArguments[0], "SalesOrderItemquery", "Correct route must have been passed");
					assert.deepEqual(aArguments[1], {
						keys1: "123",
						keys2: "12345",
						query: {
							"sap-iapp-state--history": sHistoryKey
						}
					}, "Correct keys must have been passed");
					assert.strictEqual(aArguments[2], !!bReplace, "replace parameter must have been passed correctly");
					done();
				}, 0);
			}, 0);
		});

		QUnit.test("navigateToContext shall call navTo on the Router with correct parameters when navigating to a sibling sub object with bReplace: " + bReplace, function (assert) {
			var sPath = "/SalesOrderItem(12345)";
			var oContext = {
				getPath: function () {
					return sPath;
				},
				getModel: function () {
					return oModel;
				}
			};
			var done = assert.async();
			setTimeout(function(){
				oStubForPrivate.setHistoryKey(sHistoryKey);
				oStubForPrivate.setCurrentIdentity({
					treeNode: oTemplateContract.mEntityTree.SalesOrderItem,
					keys: ["", "123", "123xy"],
					appStates: Object.create(null)
				});
				oSandbox.stub(oTemplateContract.oApplicationProxy, "getIdentityKeyForContext", function () {
					return ["", "123", "12345"];
				});

				oNavigationController.navigateToContext(oContext, null, bReplace);
				setTimeout(function () {
					assert.ok(!oHashChangerStub.replaceHash.called, "replaceHash must not have been called");
					assert.ok(!oHashChangerStub.setHash.called, "setHash must not have been called");
					assert.ok(oRouter.navTo.calledOnce, "navTo must have been called exactly once");
					var aArguments = oRouter.navTo.firstCall.args;
					assert.strictEqual(aArguments.length, 3, "Correct number of arguments must have been passed");
					assert.strictEqual(aArguments[0], "SalesOrderItemquery", "Correct route must have been passed");
					assert.deepEqual(aArguments[1], {
						keys1: "123",
						keys2: "12345",
						query: {
							"sap-iapp-state--history": sHistoryKey
						}
					}, "Correct keys must have been passed");
					assert.strictEqual(aArguments[2], !!bReplace, "replace parameter must have been passed correctly");
					done();
				}, 0);
			}, 0);
		});

		QUnit.test("navigateToRoot shall call navTo on the Router correctly with bReplace: " + bReplace, function (assert) {
			var done = assert.async();
			setTimeout(function(){
				oStubForPrivate.setHistoryKey(sHistoryKey);
				oStubForPrivate.setCurrentIdentity({
					treeNode: oTemplateContract.mEntityTree.SalesOrder,
					keys: ["", "123"],
					appStates: Object.create(null)
				});
				oSandbox.stub(oTemplateContract.oApplicationProxy, "getIdentityKeyForContext", function () {
					return ["", "123"];
				});
				oNavigationController.navigateToRoot(bReplace);
				setTimeout(function() {
					assert.ok(oRouter.navTo.calledOnce, "navTo must have been called");
					var aArguments = oRouter.navTo.firstCall.args;
					assert.strictEqual(aArguments.length, 3, "Correct number of arguments must have been passed");
					assert.strictEqual(aArguments[0], "rootquery", "Correct route must have been passed");
					assert.deepEqual(aArguments[1], {
						query: {
							"sap-iapp-state--history": sHistoryKey
						}
					}, "Correct keys must have been passed");
					assert.strictEqual(aArguments[2], !!bReplace, "replace parameter must have been passed correctly");
					done();
				}, 0);
			}, 0);
		});
	}

	fnTestNavigateToContext();
	fnTestNavigateToContext(true);

	QUnit.test("navigateToMessagePage shall navigate to the right target", function (assert) {
		var done = assert.async();
		setTimeout(function(){
			oStubForPrivate.setCurrentIdentity({
				keys: [],
				appStates: Object.create(null)
			});
			var mParams = {
				title: "SomeTitle",
				text: "SomeText",
				messageType: "ErrorScreen",
				description: "SomeDescription"
			};

			oTemplateContract.oTemplatePrivateGlobalModel = {
				setProperty: sinon.stub()
			};
			oNavigationController.navigateToMessagePage(mParams);
			assert.ok(oTemplateContract.oTemplatePrivateGlobalModel.setProperty.calledOnce, "Properties must have been set");
			var oArgs = oTemplateContract.oTemplatePrivateGlobalModel.setProperty.firstCall.args;
			assert.strictEqual(oArgs[0], "/generic/messagePage", "properties for message test must have been set");
			assert.deepEqual(oArgs[1], {
				text: "SomeText",
				messageType: "ErrorScreen",
				description: "SomeDescription",
				additionalContent: undefined
			}, "correct properties must have been set");
			assert.ok(oTargets.display.calledOnce, "display must have been called");
			assert.ok(oTargets.display.calledWithExactly("messagePage"), "display must have been called with correct parameter");
			assert.ok(oTemplateContract.oBusyHelper.setBusy.calledThrice, "oBusyHelper.setBusy was called");
			assert.ok(oTemplateContract.oBusyHelper.setBusy.thirdCall.calledWithExactly("oDisplayPromise"), "oBusyHelper.setBusy was called with 'oDisplayPromise'");
			delete oTemplateContract.oTemplatePrivateGlobalModel;
			done();
		}, 0);
	});

	QUnit.test("navigateToMessagePage shall navigate to the right target and take icon from entitySet", function (assert) {
		var done = assert.async();
		setTimeout(function(){
			oStubForPrivate.setCurrentIdentity({
				keys: [],
				appStates: Object.create(null)
			});
			var mParams = {
				entitySet: "SalesOrder",
				description: "SomeDescription",
				title: "SomeTitle",
				text: "SomeText",
				messageType: "UnableToLoad"
			};

			oTemplateContract.oTemplatePrivateGlobalModel = {
				setProperty: sinon.stub()
			};
			oNavigationController.navigateToMessagePage(mParams);
			assert.ok(oTemplateContract.oTemplatePrivateGlobalModel.setProperty.calledOnce, "Properties must have been set");
			var oArgs = oTemplateContract.oTemplatePrivateGlobalModel.setProperty.firstCall.args;
			assert.strictEqual(oArgs[0], "/generic/messagePage", "properties for message test must have been set");
			assert.deepEqual(oArgs[1], {
				text: "SomeText",
				description: "SomeDescription",
				messageType: "UnableToLoad",
				additionalContent: undefined
			}, "correct properties must have been set");
			assert.ok(oTargets.display.calledOnce, "display must have been called");
			assert.ok(oTargets.display.calledWithExactly("messagePage"), "display must have been called with correct parameter");
			assert.ok(oTemplateContract.oBusyHelper.setBusy.calledThrice, "oBusyHelper.setBusy was called");
			assert.ok(oTemplateContract.oBusyHelper.setBusy.thirdCall.calledWithExactly("oDisplayPromise"), "oBusyHelper.setBusy was called with 'oDisplayPromise'");
			delete oTemplateContract.oTemplatePrivateGlobalModel;
			done();
		}, 0);
	});

	function getComponent1() {
		var fnOnActivate = sinon.stub();
		fnOnActivate.returns(Promise.reject());
		return {
			getId: function () {
				return "component1";
			},
			onActivate: fnOnActivate
		};
	}

	QUnit.test("Test preloadComponent method of NavigationControllerProxy", function(assert) {
		// Arrange
		var oPrepareHostViewStub = sinon.stub();
		oStubForPrivate.setPrepareHostView(oPrepareHostViewStub);

		// Invoke
		oStubForPrivate.preloadComponent("SalesOrder");
		// Assert
		assert.ok(oPrepareHostViewStub.calledOnce, "Method prepareHostView is called");
		assert.deepEqual(oPrepareHostViewStub.args[0][0], oTemplateContract.mRoutingTree.SalesOrder,
			"Method prepareHostView is called with correct treeNode instance");
	});

	QUnit.test("Test prepareHostView method of NavigationControllerProxy - called once", function (assert) {
		// Arrange
		var oTheComponentContainer = {
			setModel: sinon.stub(),
			setComponent: sinon.stub()
		};
		var oHostViewPromise = Promise.resolve({
			byId: sinon.stub().returns(oTheComponentContainer)
		});
		var oCreateHostViewStub = sinon.stub().returns(oHostViewPromise);
		oStubForPrivate.setCreateHostView(oCreateHostViewStub);

		var oViews = {
			setView: sinon.stub()
		};
		oRouter.getViews = sinon.stub().returns(oViews);

		// Invoke
		oStubForPrivate.prepareHostView({
			treeNode: oTemplateContract.mEntityTree.SalesOrder,
			sRouteName: "SalesOrder"
		});
		// Assert
		assert.ok(oCreateHostViewStub.calledOnce, "Method prepareHostView is called once");
	});

	QUnit.test("Test prepareHostView method of NavigationControllerProxy - called twice", function (assert) {
		// Arrange
		var oTheComponentContainer = {
			setModel: sinon.stub(),
			setComponent: sinon.stub()
		};
		var oHostViewPromise = Promise.resolve({
			byId: sinon.stub().returns(oTheComponentContainer)
		});
		var oCreateHostViewStub = sinon.stub().returns(oHostViewPromise);
		oStubForPrivate.setCreateHostView(oCreateHostViewStub);

		var oViews = {
			setView: sinon.stub()
		};
		oRouter.getViews = sinon.stub().returns(oViews);

		// Invoke
		oStubForPrivate.prepareHostView({
			treeNode: oTemplateContract.mEntityTree.SalesOrder,
			sRouteName: "SalesOrder"
		});
		oStubForPrivate.prepareHostView({
			treeNode: oTemplateContract.mEntityTree.SalesOrderItem,
			sRouteName: "SalesOrderItem"
		});
		// Assert
		assert.ok(oCreateHostViewStub.calledTwice, "Method prepareHostView is called twice");
	});

	QUnit.test("Test prepareHostView method of NavigationControllerProxy - called once with duplicate id", function (assert) {
		// Arrange
		var oTheComponentContainer = {
			setModel: sinon.stub(),
			setComponent: sinon.stub()
		};
		var oHostViewPromise = Promise.resolve({
			byId: sinon.stub().returns(oTheComponentContainer)
		});
		var oCreateHostViewStub = sinon.stub().returns(oHostViewPromise);
		oStubForPrivate.setCreateHostView(oCreateHostViewStub);

		var oViews = {
			setView: sinon.stub()
		};
		oRouter.getViews = sinon.stub().returns(oViews);

		// Invoke
		oStubForPrivate.prepareHostView({
			treeNode: oTemplateContract.mEntityTree.SalesOrder,
			sRouteName: "SalesOrder"
		});
		oStubForPrivate.prepareHostView({
			treeNode: oTemplateContract.mEntityTree.SalesOrder,
			sRouteName: "SalesOrder"
		});
		// Assert
		assert.ok(oCreateHostViewStub.calledOnce, "Method prepareHostView is called once");
	});

	QUnit.test("Test prepareHostView method of NavigationControllerProxy", function (assert) {
		// Arrange
		var oTheComponentContainer = {
			setModel: sinon.stub(),
			setComponent: sinon.stub()
		};
		
		var oHostViewPromise = Promise.resolve({
			byId: sinon.stub().returns(oTheComponentContainer)
		})
		oStubForPrivate.setCreateHostView(function() {
			return oHostViewPromise;
		});
		var oComponentStub = {
			onBeforeRendering: sinon.stub()
		};
		var fnCreateOriginal = sap.ui.core.Component.create;
		sap.ui.core.Component.create = sinon.stub().returns(Promise.resolve(oComponentStub));
		var oViews = {
			setView: sinon.stub()
		};
		oRouter.getViews = sinon.stub().returns(oViews);
		oTemplateContract.oAppComponent.runAsOwner = function(fnMethodToExecute) {
			fnMethodToExecute();
			return Promise.resolve();
		};

		var done = assert.async();

		// Invoke
		oStubForPrivate.preloadComponent("SalesOrder");
		oHostViewPromise.then(function (oHostView) {
			// Assert
			assert.strictEqual(oHostView.byId.args[0][0], "host",
			"Method byId should be called only with 'host' as Id");
			assert.deepEqual(oViews.setView.args[0][1], oHostViewPromise,
				"First invocation of setView: Second parameter should be the host view creation promise");
			assert.deepEqual(oViews.setView.args[1][1], oHostView,
				"Second invocation of setView: Second parameter should be the actual host view");

			setTimeout(function() {
				assert.ok(oTheComponentContainer.setComponent.calledOnce,
					"Component should be set to the ComponentContainer");
				assert.strictEqual(oTheComponentContainer.setModel.callCount, 3,
					"Models should be propogated to the ComponentContainer");
				done();

				// Restore
				sap.ui.core.Component.create = fnCreateOriginal;
			}, 100);
		});
	});

	QUnit.test("routeMatched event of the router shall call activateComponent", function (assert) {
		var done = assert.async();
		setTimeout(function(){
			oStubForPrivate.setHistoryKey(sHistoryKey);
			var oComponent = getComponent1();
			oTemplateContract.mEntityTree.SalesOrderItem.componentCreated = {
				then: function (fnThen) {
					return fnThen(oComponent);
				}
			};
			var fRouteMatched = oRouter.attachRouteMatched.args[0][0];
			var fThis = oRouter.attachRouteMatched.args[0][1];
			var fBeforeRouteMatched = oRouter.attachBeforeRouteMatched.args[0][0];
			var oEventParam = {
				getParameter: sinon.stub()
			};

			var oRouteConfig = {
				name: "SalesOrderItemquery",
				target: "theTarget",
				entitySet: "SalesOrderItem",
				viewLevel: 1,
				pattern: "",
				contextPath: ""
			};
			var oArgs = {
				"?query": {
					"sap-iapp-state--history": 	sHistoryKey
				}
			};
			oEventParam.getParameter.withArgs("config").returns(oRouteConfig);
			oEventParam.getParameter.withArgs("arguments").returns(oArgs);
			var bBindComponentCalled = false;
			oSandbox.stub(oTemplateContract.componentRegistry.component1.utils, "bindComponent", function(){
				assert.ok(!bBindComponentCalled, "bindComponent should be called only once");
				bBindComponentCalled = true;
				return Promise.resolve();
			});
			oSandbox.stub(oTemplateContract.componentRegistry.component1.utils, "refreshBinding", function(){
				assert.ok(bBindComponentCalled, "bindComponent must have been called before refreshBinding");
				done();
			});
			var oHostView = {
				byId: function(sId){
					assert.equal(sId, "host", "only id 'host' should be used on host view");
					return oTheComponentContainer;
				},
				getController: function(){
					return {
						setRouteName: function(sRoutename){
							assert.equal(sRoutename, "SalesOrderItem", "routename should be correct");
						}
					};
				}
			};
			var oHostViewPromise = Promise.resolve(oHostView);
			var fnSetView = oSandbox.spy();
			oRouter.getViews.returns({
				setView: fnSetView
			});
			var oTheComponentContainer = {};
			oStubForPrivate.setCreateHostView(function(){
				return oHostViewPromise;
			});
			oSandbox.stub(oStubForPrivate, "createTemplateComponent", function(oComponentContainer, sRoute){
				assert.strictEqual(oComponentContainer, oTheComponentContainer, "Create component in the correct container");
				assert.equal(sRoute, "SalesOrderItem", "Correct route must have been used");
			});
			setTimeout(function(){
				fBeforeRouteMatched.call(fThis, oEventParam);
				assert.ok(fnSetView.calledOnce);
				assert.equal(fnSetView.args[0][0], "SalesOrderItem", "View must be set at the router with correct target");
				assert.strictEqual(fnSetView.args[0][1], oHostViewPromise, "Correct view must be set for that target");
				fRouteMatched.call(fThis, oEventParam);
			}, 0);
		}, 0);
	});

	QUnit.test("routeMatched event of the router - test for 'root' operation", function (assert) {
		var done = assert.async();
		setTimeout(function(){
			oStubForPrivate.setHistoryKey(sHistoryKey);
			var oComponent = getComponent1();
			oTemplateContract.mRoutingTree.root.componentCreated = {
				then: function (fnThen) {
					return fnThen(oComponent);
				}
			};

			var fRouteMatched = oRouter.attachRouteMatched.args[0][0];
			var fThis = oRouter.attachRouteMatched.args[0][1];
			var fBeforeRouteMatched = oRouter.attachBeforeRouteMatched.args[0][0];
			var oEventParam = {
				getParameter: sinon.stub()
			};
			var oRouteConfig = {
				name: "root",
				operation: "root",
				target: "root",
				viewLevel: 0
			};
			var oArgs = {
				"?query": {
					"sap-iapp-state--history": 	sHistoryKey
				}
			};
			oEventParam.getParameter.withArgs("config").returns(oRouteConfig);
			oEventParam.getParameter.withArgs("arguments").returns(oArgs);
			var bBindComponentCalled = false;
			oSandbox.stub(oTemplateContract.componentRegistry.component1.utils, "bindComponent", function(){
				assert.ok(!bBindComponentCalled, "bindComponent should be called only once");
				bBindComponentCalled = true;
				return Promise.resolve();
			});
			oSandbox.stub(oTemplateContract.componentRegistry.component1.utils, "refreshBinding", function(){
				assert.ok(bBindComponentCalled, "bindComponent must have been called before refreshBinding");
				done();
			});
			var oHostView = {
				byId: function(sId){
					assert.equal(sId, "host", "only id 'host' should be used on host view");
					return oTheComponentContainer;
				},
				getController: function(){
					return {
						setRouteName: function(sRoutename){
							assert.equal(sRoutename, "root", "routename should be correct");
						}
					};
				}
			};
			var oHostViewPromise = Promise.resolve(oHostView);
			var fnSetView = oSandbox.spy();
			oRouter.getViews.returns({
				setView: fnSetView
			});
			var oTheComponentContainer = {};
			oStubForPrivate.setCreateHostView(function(){
				return oHostViewPromise;
			});
			oSandbox.stub(oStubForPrivate, "createTemplateComponent", function(oComponentContainer, sRoute){
				assert.strictEqual(oComponentContainer, oTheComponentContainer, "Create component in the correct container");
				assert.equal(sRoute, "root", "Correct route must have been used");
			});
			setTimeout(function(){
				fBeforeRouteMatched.call(fThis, oEventParam);
				assert.ok(fnSetView.calledOnce);
				assert.equal(fnSetView.args[0][0], "root", "View must be set at the router with correct target");
				assert.strictEqual(fnSetView.args[0][1], oHostViewPromise, "Correct view must be set for that target");
				fRouteMatched.call(fThis, oEventParam);
			}, 0);
		}, 0);
	});

	QUnit.test("routeMatched event of the router", function (assert) {
		var done = assert.async();
		setTimeout(function(){
			oStubForPrivate.setHistoryKey(sHistoryKey);
			var sBindingPath = "/SalesOrderItem(12345)";
			var sPattern = "SalesOrder({keys1})/toItem({keys2})";
			var sEntity = "SalesOrderItem";
			var sNavigationProp = "toItem";
			var oComponent = getComponent1();
			oTemplateContract.mRoutingTree.SalesOrderItem.componentCreated = {
				then: function (fnThen) {
					return fnThen(oComponent);
				}
			};

			var fRouteMatched = oRouter.attachRouteMatched.args[0][0];
			var fThis = oRouter.attachRouteMatched.args[0][1];
			var fBeforeRouteMatched = oRouter.attachBeforeRouteMatched.args[0][0];
			var oEventParam = {
				getParameter: sinon.stub()
			};
			var oRouteConfig = {
				name: sEntity,
				operation: "detail",
				pattern: sPattern,
				navigationProperty: sNavigationProp,
				entitySet: sEntity,
				target: "ttt",
				viewLevel: 2
			};
			var oArgs = {
				keys1: "123",
				keys2: "12345",
				"?query": {
					"sap-iapp-state--history": 	sHistoryKey
				}
			};
			oEventParam.getParameter.withArgs("config").returns(oRouteConfig);
			oEventParam.getParameter.withArgs("arguments").returns(oArgs);
			var bBindComponentCalled = false;
			oSandbox.stub(oTemplateContract.componentRegistry.component1.utils, "bindComponent", function(){
				assert.ok(!bBindComponentCalled, "bindComponent should be called only once");
				bBindComponentCalled = true;
				return Promise.resolve();
			});
			oSandbox.stub(oTemplateContract.componentRegistry.component1.utils, "refreshBinding", function(){
				assert.ok(bBindComponentCalled, "bindComponent must have been called before refreshBinding");
				done();
			});
			var oHostView = {
				byId: function(sId){
					assert.equal(sId, "host", "only id 'host' should be used on host view");
					return oTheComponentContainer;
				},
				getController: function(){
					return {
						setRouteName: function(sRoutename){
							assert.equal(sRoutename, "SalesOrderItem", "routename should be correct");
						}
					};
				}
			};
			var oHostViewPromise = Promise.resolve(oHostView);
			var fnSetView = oSandbox.spy();
			oRouter.getViews.returns({
				setView: fnSetView
			});
			var oTheComponentContainer = {};
			oStubForPrivate.setCreateHostView(function(){
				return oHostViewPromise;
			});
			oSandbox.stub(oStubForPrivate, "createTemplateComponent", function(oComponentContainer, sRoute){
				assert.strictEqual(oComponentContainer, oTheComponentContainer, "Create component in the correct container");
				assert.equal(sRoute, "SalesOrderItem", "Correct route must have been used");
			});
			setTimeout(function(){
				fBeforeRouteMatched.call(fThis, oEventParam);
				assert.ok(fnSetView.calledOnce);
				assert.equal(fnSetView.args[0][0], "SalesOrderItem", "View must be set at the router with correct target");
				assert.strictEqual(fnSetView.args[0][1], oHostViewPromise, "Correct view must be set for that target");
				fRouteMatched.call(fThis, oEventParam);
			}, 0);
		}, 0);
	});

	QUnit.test("Test the Component details when the component is not preloaded", function (assert) {
		var oComponentContainer = {
			setComponent: Function.prototype
		},
		done = assert.async(),
		oExpectedComponent,
		oComponentCreatePromise = Promise.prototype;
		oTemplateContract.oAppComponent.runAsOwner = function (fnMethodToExecute) {
			fnMethodToExecute();
			return Promise.resolve();
		};
		oSandbox.stub(sap.ui.core.Component, "create", function (oParams) {
			oExpectedComponent = {
				name: oParams.name,
				settings: oParams.settings,
				handleValidation: oParams.handleValidation,
				manifest: oParams.manifest,
				id: oParams.id
			};
			oComponentCreatePromise = Promise.resolve(oExpectedComponent);
			return oComponentCreatePromise;
		});
		var oSetComponentSpy = oSandbox.spy(oComponentContainer, "setComponent");

		oStubForPrivate.createTemplateComponent(oComponentContainer, "SalesOrder", false);

		oComponentCreatePromise.then(function () {
			assert.ok(oSetComponentSpy.calledOnce, "setComponent has been called");
			assert.ok(oSetComponentSpy.calledWithExactly(oExpectedComponent), "setComponent has been called with correct component data");
			done();
		});
	});

	QUnit.test("Test the Component details when the component is preloaded", function (assert) {
		var oComponentContainer = {
			setComponent: Function.prototype,
			setModel: Function.prototype
		},
		done = assert.async(),
		oExpectedComponent,
		oComponentCreatePromise = Promise.prototype;
		oTemplateContract.oAppComponent.runAsOwner = function (fnMethodToExecute) {
			fnMethodToExecute();
			return Promise.resolve();
		};
		oSandbox.stub(sap.ui.core.Component, "create", function (oParams) {
			oExpectedComponent = {
				name: oParams.name,
				settings: oParams.settings,
				handleValidation: oParams.handleValidation,
				manifest: oParams.manifest,
				id: oParams.id
			};
			oComponentCreatePromise = Promise.resolve(oExpectedComponent);
			return oComponentCreatePromise;
		});
		var oSetComponentSpy = oSandbox.spy(oComponentContainer, "setComponent");

		oStubForPrivate.createTemplateComponent(oComponentContainer, "SalesOrder", true);

		oComponentCreatePromise.then(function () {
			assert.ok(oSetComponentSpy.calledOnce, "setComponent has been called");
			assert.ok(oSetComponentSpy.calledWithExactly(oExpectedComponent), "setComponent has been called with correct component data");
			done();
		});
	});

	QUnit.test("Test getRouteInfoByHash method of NavigationControllerProxy", (assert) => {
		// Arrange
		const oAppRouter = new MRouter();
		
		const oProductRoute = {
			name: `STTA_C_MP_Product`,
			target: `STTA_C_MP_Product`,
			pattern: `STTA_C_MP_Product({keys1})`
		};
		oAppRouter.addRoute(oProductRoute);

		// Case 1: Hash matches with route
		let sInputHash = `/STTA_C_MP_Product('2500000351')`;
		let oResultRoute = oStubForPrivate.getRouteInfoByHash(oAppRouter, sInputHash);
		assert.equal(oResultRoute.name, oProductRoute.name, `Route matches with the hash: ${sInputHash}`);
		// Case 2: Nested app route
		sInputHash = `detail/U7_S_INBOX/000004035761/TaskCollection(InstanceID='000004035761')&/STTA_C_MP_Product('2500000351')`;
		oResultRoute = oStubForPrivate.getRouteInfoByHash(oAppRouter, sInputHash);
		assert.equal(oResultRoute.name, oProductRoute.name, `Route matches with the nested app hash: ${sInputHash}`);
		// Case 3: Nested app route prefixed with the app name ("/PurchaseRequisition-displayMyInbox-detail")
		sInputHash = `detail/U7_S_INBOX/000004035761/TaskCollection(InstanceID='000004035761')&/PurchaseRequisition-displayMyInbox-detail/STTA_C_MP_Product('2500000351')`;
		oResultRoute = oStubForPrivate.getRouteInfoByHash(oAppRouter, sInputHash);
		assert.equal(oResultRoute.name, oProductRoute.name, `Route matches with the nested app hash prefixed with app name: ${sInputHash}`);
		// Case 4: Invalid hash
		sInputHash = `root`;
		oResultRoute = oStubForPrivate.getRouteInfoByHash(oAppRouter, sInputHash);
		assert.notOk(oResultRoute, `There is no matching route found for the hash: ${sInputHash}`);
	});

	QUnit.test("Test getIsStateChange method of NavigationControllerProxy", (assert) => {
		var aStateChangers = [
			{
				isStateChange: function () {
					return false;
				}
			},
			{
				isStateChange: function (state) {
					return state;
				}
			}
		];
		// Case 1: aStateChangers and appStates are empty
		assert.notOk(oStubForPrivate.getIsStateChange([], undefined), "getIsStateChange returns false when aStateChangers and appStates are empty");
		// Case 2: aStateChangers are empty and appStates are false
		assert.notOk(oStubForPrivate.getIsStateChange([], false), "getIsStateChange returns false when aStateChangers are empty and appStates are false");
		// Case 3: aStateChangers are empty and appStates are true
		assert.notOk(oStubForPrivate.getIsStateChange([], true), "getIsStateChange returns false when aStateChangers are empty and appStates are true");
		// Case 4: appStates are empty
		assert.notOk(oStubForPrivate.getIsStateChange(aStateChangers, undefined), "getIsStateChange returns false when appStates are empty");
		// Case 5: appStates are false
		assert.notOk(oStubForPrivate.getIsStateChange(aStateChangers, false), "getIsStateChange returns false when appStates are false");
		// Case 6: appStates are true
		assert.ok(oStubForPrivate.getIsStateChange(aStateChangers, true), "getIsStateChange returns true when appStates are true");
		// Case 7: appStates are true in FCL
		assert.notOk(oStubForPrivate.getIsStateChange(aStateChangers, true, true), "getIsStateChange returns false when appStates are true in FCL");
	});
});
