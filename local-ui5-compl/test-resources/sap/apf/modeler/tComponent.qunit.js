sap.ui.define([
	'sap/apf/cloudFoundry/modelerProxy',
	'sap/apf/core/layeredRepositoryProxy',
	'sap/apf/core/odataProxy',
	'sap/apf/modeler/Component',
	'sap/apf/modeler/core/instance',
	'sap/apf/testhelper/helper',
	'sap/apf/testhelper/modelerComponent/Component',
	'sap/apf/integration/withDoubles/platforms/componentFactory',
	'sap/apf/testhelper/doubles/metadata',
	'sap/base/util/extend',
	'sap/m/routing/Router',
	'sap/ui/core/ComponentContainer',
	'sap/ui/thirdparty/sinon'
], function(
	modelerProxy,
	LayeredRepositoryProxy,
	OdataProxy,
	ModelerComponent,
	ModelerCoreInstance,
	helper,
	TestModelerComponent,
	ComponentFactory,
	Metadata,
	extend,
	SapMRouter,
	ComponentContainer,
	sinon
) {
	'use strict';

	helper.injectURLParameters({
		"createContent" : "false"
	});
	function setup(context) {
		context.sandbox = sinon.sandbox.create();
		context.injectInstanceIntoComponent = function(InstanceStub, ComponentClass) {
			var originalGetInjections = ComponentClass.prototype.getInjections;
			this.sandbox.stub(ComponentClass.prototype, "getInjections", function() {
				return extend(
					originalGetInjections.call(ComponentClass.prototype),
					{
						constructors: {
							Instance: InstanceStub
						} 
					}
				);
			});
		};
	}
	function teardown(context) {
		context.oComponentContainer.destroy();
		context.sandbox.restore();
	}

	QUnit.module("Extension of Modeler Component", {
		beforeEach : function() {
			setup(this);
		},
		afterEach : function() {
			teardown(this);
		}
	});

	QUnit.test("WHEN sap.m.routing.Router is defined as router in manifest", function(assert) {
		assert.expect(2);
		var comp;

		function InstanceStub(persistenceConfiguration, inject) {
			this.getUriGenerator = function() {
				return new function() {
					this.getApfLocation = function() {
						return "PathOfNoInterest";
					};
				};
			};
			this.setCallbackForMessageHandling = function(fnCallback) {
			};
		}
		this.injectInstanceIntoComponent(InstanceStub, TestModelerComponent);

		this.sandbox.stub(SapMRouter.prototype, "initialize", function() {
			assert.ok(true, "THEN correct router is initialized");
		});
		this.sandbox.stub(SapMRouter.prototype, "destroy", function() {
			assert.ok(true, "THEN router is finally destroyed");
		});
		this.sandbox.stub(SapMRouter.prototype, "getTargets", function() {
			return { destroy : function() {}};
		});
		this.sandbox.stub(SapMRouter.prototype, "getViews", function() {
			return { destroy : function() {}};
		});
		comp = new TestModelerComponent();
		this.oComponentContainer = new ComponentContainer("TestApplication", {
			height : "100%"
		});
		this.oComponentContainer.setComponent(comp);
		this.oComponentContainer.placeAt("componentContainer");
		// destroy so that the 2nd assert is called before the sandbox restores the stubbed methods
		this.oComponentContainer.destroy();
	});

	QUnit.test("WHEN a component extends the modeler component", function(assert) {
		assert.expect(3);
		var comp;

		function InstanceStub(persistenceConfiguration, inject) {
			this.getUriGenerator = function() {
				return new function() {
					this.getApfLocation = function() {
						return "PathOfNoInterest";
					};
				};
			};
			this.setCallbackForMessageHandling = function(fnCallback) {
			};
			assert.strictEqual(typeof inject.functions.getNavigationTargetForGenericRuntime, 'function',
				"THEN function getNavigationTargetForGenericRuntime is injected");
			assert.strictEqual(typeof inject.functions.getCatalogServiceUri, 'function',
				"THEN function getCatalogServiceUri is injected");
			assert.ok(inject.instances.component, "THEN component is injected");
		}
		this.injectInstanceIntoComponent(InstanceStub, TestModelerComponent);

		comp = new TestModelerComponent();
		this.oComponentContainer = new ComponentContainer("TestApplication", {
			height : "100%"
		});
		this.oComponentContainer.setComponent(comp);
		this.oComponentContainer.placeAt("componentContainer");
		
	});
	QUnit.test("WHEN a component extends the modeler component and in manifest activateLrep is set to true", function(assert) {
		assert.expect(3);
		var spyModelerProxy = sinon.spy(modelerProxy, "ModelerProxy");
		var spyOdataProxy = sinon.spy(OdataProxy);
		var spyLayeredRepositoryProxy = sinon.spy(LayeredRepositoryProxy);
		var origGetInjecitons = TestModelerComponent.prototype.getInjections;
		sinon.stub(TestModelerComponent.prototype, "getInjections", function() {
			return extend(
				origGetInjecitons.call(TestModelerComponent.prototype),
				{
					constructors: {
						LayeredRepositoryProxy: spyLayeredRepositoryProxy,
						OdataProxy: spyOdataProxy
					}
				}
			);
		});
		var comp = new TestModelerComponent();
		this.oComponentContainer = new ComponentContainer("TestApplication", {
			height : "100%"
		});
		this.oComponentContainer.setComponent(comp);
		this.oComponentContainer.placeAt("componentContainer");
		assert.strictEqual(spyModelerProxy.callCount, 0, "THEN Modeler Proxy was NOT created");
		assert.strictEqual(spyOdataProxy.callCount, 0, "THEN OData Proxy was NOT created");
		assert.strictEqual(spyLayeredRepositoryProxy.callCount, 1, "THEN Layered Repository Proxy was created");
		TestModelerComponent.prototype.getInjections.restore();
		spyModelerProxy.restore();
	});
	QUnit.test("Injection of getRuntimeUrl", function(assert) {
		assert.expect(1);
		var instance;
		function InstanceStub(persistenceConfiguration, inject) {
			ModelerCoreInstance.call(this, persistenceConfiguration, inject);
			this.getUriGenerator = function() {
				return new function() {
					this.getApfLocation = function() {
						return "PathOfNoInterest";
					};
				};
			};
			this.setCallbackForMessageHandling = function(fnCallback) {
			};
			instance = this;
		}
		this.injectInstanceIntoComponent(InstanceStub, TestModelerComponent);

		var comp = new TestModelerComponent();
		this.oComponentContainer = new ComponentContainer("TestApplication", {
			height : "100%"
		});
		this.oComponentContainer.setComponent(comp);
		this.oComponentContainer.placeAt("componentContainer");
		instance.navigateToGenericRuntime("AppID", "ConfigID", function(URL){
			assert.strictEqual(URL, "testURL", "injected getRuntimeUrl called and used");
		});
	});
	QUnit.module("Injection of catalog service function into instance", {
		beforeEach : function() {
			setup(this);
		},
		afterEach : function() {
			teardown(this);
		}
	});
	QUnit.test("WHEN manifest provides catalog service", function(assert) {
		var comp;
		sap.ui.controller("sap.apf.modeler.ui.controller.applicationList", {
			onInit : function() {
				console.log("hello");
			}
		});
		
		function InstanceStub(persistenceConfiguration, inject) {
			this.getUriGenerator = function() {
				return new function() {
					this.getApfLocation = function() {
						return "PathOfNoInterest";
					};
				};
			};
			this.setCallbackForMessageHandling = function(fnCallback) {
			};
			assert.equal(inject.functions.getCatalogServiceUri(), "/sap/opu/odata/iwfnd/catalogservice;v=2", "THEN the injected function for catalog service provides the expected uri");
		}
		this.injectInstanceIntoComponent(InstanceStub, ModelerComponent);

		comp = new ModelerComponent();
		this.oComponentContainer = new ComponentContainer("TestApplication", {
			height : "100%"
		});
		this.oComponentContainer.setComponent(comp);
		this.oComponentContainer.placeAt("componentContainer");
	});
	QUnit.test("WHEN manifest provides outbound navigation to runtime", function(assert) {
		var comp;
		sap.ui.controller("sap.apf.modeler.ui.controller.applicationList", {
			onInit : function() {
			}
		});
		function InstanceStub(persistenceConfiguration, inject) {
			this.getUriGenerator = function() {
				return new function() {
					this.getApfLocation = function() {
						return "PathOfNoInterest";
					};
				};
			};
			this.setCallbackForMessageHandling = function(fnCallback) {
			};
			var expectedNavigationTarget = {
				"action" : "executeAPFConfiguration",
				"semanticObject" : "FioriApplication"
			};
			assert.deepEqual(inject.functions.getNavigationTargetForGenericRuntime(), expectedNavigationTarget,
				"THEN the injected function for navigation targets returns the expected semantic object and action");
		}
		this.injectInstanceIntoComponent(InstanceStub, ModelerComponent);
		comp = new ModelerComponent();
		this.oComponentContainer = new ComponentContainer("TestApplication", {
			height : "100%"
		});
		this.oComponentContainer.setComponent(comp);
		this.oComponentContainer.placeAt("componentContainer");
	});
	QUnit.module("Injection of function isUsingCloudFoundryProxy", {
		beforeEach : function() {
			this.spyModelerProxy = sinon.spy(modelerProxy, "ModelerProxy");
			this.spyOdataProxy = sinon.spy(OdataProxy);
			this.spyLayeredRepositoryProxy = sinon.spy(LayeredRepositoryProxy);
			this.manifestForModelerCloudFoundry = {
				"sap.app": {
					dataSources: {
						"apf.designTime.customer.applications": {
							uri: "/hugo"
						},
						"apf.designTime.customer.analyticalConfigurations": {
							uri: "/otto"
						},
						"apf.designTime.customer.applicationAndAnalyticalConfiguration": {
							uri: "/hans"
						},
						"apf.designTime.textFileAndAnalyticalConfigurations": {
							uri: "/walter"
						},
						"apf.designTime.textFiles": {
							uri: "/ingo"
						},
						"apf.designTime.vendor.importToCustomerLayer": {
							uri: "/vendorContent"
						},
						"apf.designTime.vendor.analyticalConfigurations": {
							uri: "/vendorContentConf"
						}
					}
				}
			};
		},
		afterEach : function() {
			this.spyModelerProxy.restore();
		}
	});
	QUnit.test("WHEN function isUsingCloudFoundryProxy is injected", function(assert){
		assert.expect(3);
		var spyCoreInstance = sinon.spy(ModelerCoreInstance);

		function isUsingCloudFoundryProxy() {
			assert.ok(true, "THEN isUsingCloudFoundryProxy has been called");
			return true;
		}
		var oComponent = ComponentFactory.createModelerComponent(undefined, {
			functions: {
				isUsingCloudFoundryProxy : isUsingCloudFoundryProxy
			},
			constructors: {
				Instance: spyCoreInstance,
				LayeredRepositoryProxy: this.spyLayeredRepositoryProxy,
				OdataProxy: this.spyOdataProxy
			}
		}, undefined, this.manifestForModelerCloudFoundry, true);
		var oComponentContainer = new ComponentContainer("TestApplication", {
			height : "100%"
		});
		oComponentContainer.setComponent(oComponent);
		oComponentContainer.placeAt("componentContainer");
		assert.strictEqual(spyCoreInstance.callCount, 1, "THEN core instance is created");
		var coreInject = spyCoreInstance.getCall(0).args[1];
		assert.strictEqual(coreInject.functions.isUsingCloudFoundryProxy, isUsingCloudFoundryProxy,
				"THEN function for cloud foundry proxy activation is also injected into instance");
		oComponentContainer.destroy();
	});
	QUnit.test("Inject of isUsingCloudFoundryProxy function which returns true", function(assert){
		var oComponent = ComponentFactory.createModelerComponent(undefined, {
			constructors: {
				LayeredRepositoryProxy: this.spyLayeredRepositoryProxy,
				OdataProxy: this.spyOdataProxy
			},
			functions: {
				isUsingCloudFoundryProxy : function() { return true; }
			}
		}, undefined, this.manifestForModelerCloudFoundry, true);
		var oComponentContainer = new ComponentContainer("TestApplication", {
			height : "100%"
		});
		oComponentContainer.setComponent(oComponent);
		oComponentContainer.placeAt("componentContainer");
		assert.strictEqual(this.spyModelerProxy.callCount, 1, "THEN Modeler Proxy is created");
		assert.strictEqual(this.spyOdataProxy.callCount, 0, "THEN OData Proxy is NOT created");
		assert.strictEqual(this.spyLayeredRepositoryProxy.callCount, 0, "THEN Layered Repository Proxy is NOT created");
		oComponentContainer.destroy();
	});
	QUnit.test("Inject of isUsingCloudFoundryProxy function which returns false", function(assert){
		var oComponent = ComponentFactory.createModelerComponent(undefined, {
			constructors: {
				LayeredRepositoryProxy: this.spyLayeredRepositoryProxy,
				OdataProxy: this.spyOdataProxy
			},
			functions: {
				isUsingCloudFoundryProxy : function() { return false; }
			}
		}, undefined, this.manifestForModelerCloudFoundry, true);
		var oComponentContainer = new ComponentContainer("TestApplication", {
			height : "100%"
		});
		oComponentContainer.setComponent(oComponent);
		oComponentContainer.placeAt("componentContainer");
		assert.strictEqual(this.spyModelerProxy.callCount, 0, "THEN Modeler Proxy is NOT created");
		assert.strictEqual(this.spyOdataProxy.callCount, 1, "THEN OData Proxy is created");
		assert.strictEqual(this.spyLayeredRepositoryProxy.callCount, 0, "THEN Layered Repository Proxy is NOT created");
		oComponentContainer.destroy();
	});
});