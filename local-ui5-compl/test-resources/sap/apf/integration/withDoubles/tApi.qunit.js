/*global QUnit, sinon */
sap.ui.define([
	"sap/apf/core/representationTypes",
	"sap/apf/testhelper/createComponentAsPromise",
	"sap/apf/testhelper/doubles/UiInstance",
	"sap/apf/testhelper/doubles/resourcePathHandler",
	"sap/apf/testhelper/interfaces/IfResourcePathHandler",
	"sap/apf/testhelper/doubles/sessionHandlerStubbedAjax",
	"sap/apf/testhelper/config/sampleConfiguration"
], function(
	representationTypes,
	createComponentAsPromise,
	UiInstanceDouble,
	ResourcePathHandlerDouble,
	IfResourcePathHandler,
	sessionHandlerStubbedAjax,
	sampleConfiguration
) {
	'use strict';

	function getConfiguration() {
		return {
			analyticalConfigurationName: "configForTesting-tApi",
			steps: [],
			requests: [],
			bindings: [],
			categories: [],
			representationTypes: [],
			navigationTargets: []
		};
	}

	QUnit.module('Create an isolated apf.Component with stubbed instance', {
		beforeEach: function() {
			var testContext = this;
			function ResourcePathHandlerPatched(inject) {
				IfResourcePathHandler.call(this, inject);
				ResourcePathHandlerDouble.call(this, inject);
				this.loadConfigFromFilePath = function () { // overwrite
					this.oCoreApi.loadAnalyticalConfiguration(getConfiguration());
					testContext.configWasLoaded = true;
				};
			}
			this.defaultInject = {
					constructors : {
						ResourcePathHandler : ResourcePathHandlerPatched,
						SessionHandler : sessionHandlerStubbedAjax,
						UiInstance : UiInstanceDouble
					}
			};
		}
	});
	QUnit.test("Empty stubs takes defaults", function (assert) {
		var testContext = this;
		var done = assert.async();
		createComponentAsPromise(this, 
				{ stubAjaxForResourcePaths : true, doubleUiInstance : true,  path : "pathOfNoInterest",  inject : this.defaultInject}).done(function(){
					assert.notEqual(testContext.oApi, undefined, "api exists");
					assert.notEqual(testContext.oComponent.getProbe(), undefined, "dependencies exists");
					assert.notEqual(testContext.oComponent.getProbe().apfApi, undefined, "dependencies.apfApi exists");
					testContext.oCompContainer.destroy();
					done();
				});

	});
	QUnit.test("Set analytical configuration", function (assert) {
		var testContext = this;
		var done = assert.async();
		createComponentAsPromise(this, 
				{ stubAjaxForResourcePaths : true, doubleUiInstance : true,  path : "pathOfNoInterest",  inject : this.defaultInject}).done(function(){
					assert.strictEqual(testContext.configWasLoaded , true, "testContext.configuration was used");
					testContext.oCompContainer.destroy();
					done();
				});
	});
	QUnit.test("Define the probe", function (assert) {
		var done = assert.async();
		createComponentAsPromise(this, 
				{ stubAjaxForResourcePaths : true, doubleUiInstance : true,  path : "pathOfNoInterest",  inject : this.defaultInject}).done(function(){
					assert.notStrictEqual(this.oComponent.getProbe(), undefined, "probe function called");
					this.oCompContainer.destroy();
					done();
				}.bind(this));
	});
	QUnit.test("Define the coreProbe", function (assert) {
		var testContext = this;
		this.defaultInject.coreProbe = function (coreDependencies) {
			testContext.coreProbe = coreDependencies;
		};
		var done = assert.async();
		createComponentAsPromise(this, 
				{ stubAjaxForResourcePaths : true, doubleUiInstance : true,  path : "pathOfNoInterest",  inject : this.defaultInject}).done(function(){


					assert.notEqual(testContext.coreProbe.resourcePathHandler, undefined, "resourcePathHandler exists in probe");
					testContext.oCompContainer.destroy();
					done();
				});
	});
	QUnit.test("Define the ResourcePathHandler double", function (assert) {
		var testContext = this;
		this.defaultInject.constructors.ResourcePathHandler = function (inject) {
			IfResourcePathHandler.call(this, inject);
			ResourcePathHandlerDouble.call(this, inject);
			this.loadConfigFromFilePath = function () {
				this.oCoreApi.loadAnalyticalConfiguration(getConfiguration());
				testContext.ownRPH = 4711;
			};
		};
		var done = assert.async();
		createComponentAsPromise(this, 
				{ stubAjaxForResourcePaths : true, doubleUiInstance: true,  path : "pathOfNoInterest",  inject : this.defaultInject}).done(function(){


					assert.strictEqual(testContext.ownRPH, 4711, "own resource path handler called");
					testContext.oCompContainer.destroy();
					done();
				});
	});
	QUnit.test("Define the UiInstance", function (assert) {
		var testContext = this;
		var done = assert.async();
		this.defaultInject.constructors.UiInstance = function (inject) {
			UiInstanceDouble.call(this, inject);
			testContext.ownUiInstance = 4711;
		};
		createComponentAsPromise(this, 
				{ stubAjaxForResourcePaths : true, doubleUiInstance : true,  path : "pathOfNoInterest",  inject : this.defaultInject}).done(function(){



					assert.strictEqual(testContext.ownUiInstance, 4711, "UiInstance function called");
					testContext.oCompContainer.destroy();
					done();
				});
	});
	QUnit.test("A core method can be tested using the coreProbe", function (assert) {
		var testContext = this;
		this.defaultInject.constructors.ResourcePathHandler = function (inject) {
			var handlerContext = this;
			IfResourcePathHandler.call(this, inject);
			ResourcePathHandlerDouble.call(this, inject);
			this.loadConfigFromFilePath = function () {
				handlerContext.oCoreApi.loadAnalyticalConfiguration(getConfiguration());
			};
		};
		this.defaultInject.coreProbe = function(dependencies) {
			testContext.coreDependencies = dependencies;
		};
		var done = assert.async();
		createComponentAsPromise(this, 
				{ stubAjaxForResourcePaths : true, doubleUiInstance : true,  path : "pathOfNoInterest",  inject : this.defaultInject}).done(function(){


					assert.notEqual(testContext.coreDependencies.resourcePathHandler, undefined, "coreDependencies.resourcePathHandler exists");
					var spy_configurationFactory = sinon.spy(testContext.coreDependencies.configurationFactory, "loadConfig");
					var spy_resourcePathHandler = sinon.spy(testContext.coreDependencies.resourcePathHandler, "loadConfigFromFilePath");

					testContext.coreDependencies.resourcePathHandler.loadConfigFromFilePath("pathThatCannotWork");

					assert.strictEqual(spy_resourcePathHandler.callCount, 1, "resourcePathHandler.loadConfigFromFilePath called once");
					assert.strictEqual(spy_configurationFactory.callCount, 1, "configurationFactory.loadConfig called once");
					testContext.oCompContainer.destroy();
					done();
				});
	});
	QUnit.test("Calling via api and Stubbing the method messageHandler.putMessage using sinon", function (assert) {
		var testContext = this;
		this.defaultInject.coreProbe = function(dependencies) {
			testContext.coreDependencies = dependencies;
		};
		var done = assert.async();
		createComponentAsPromise(this, 
				{ stubAjaxForResourcePaths : true, doubleUiInstance : true,  path : "pathOfNoInterest",  inject : this.defaultInject}).done(function(){

					assert.notEqual(testContext.oComponent.getProbe().messageHandler, undefined, "dependencies.messageHandler exists");
					var stub_messageHandler_putMessage = sinon.stub(testContext.oComponent.getProbe().messageHandler, "putMessage", function() {
						return null;
					});

					testContext.oApi.putMessage("none");

					assert.strictEqual(stub_messageHandler_putMessage.callCount, 1, "messageHandler.putMessage called once");
					testContext.oCompContainer.destroy();
					done();
				});
	});

	QUnit.module('Creating startFilterHandler with onBeforeStartUpPromise', {
		beforeEach: function(assert) {
			var testContext = this;
			function ResourcePathHandlerPatched(inject) {
				IfResourcePathHandler.call(this, inject);
				ResourcePathHandlerDouble.call(this, inject);
				this.loadConfigFromFilePath = function () { // overwrite
					this.oCoreApi.loadAnalyticalConfiguration(getConfiguration());
					testContext.configWasLoaded = true;
				};
			}
			this.defaultInject = {
					constructors : {
						ResourcePathHandler : ResourcePathHandlerPatched,
						SessionHandler : sessionHandlerStubbedAjax,
						UiInstance : UiInstanceDouble,
						StartFilterHandler : function (inject){
							inject.instances.onBeforeApfStartupPromise.done(function(){
								assert.ok(true, "Promise onBeforeApfStartup resolved");
							});
						}
					}
			};
		}
	});
	QUnit.test("Without on BeforeStartupCallback", function (assert) {
		assert.expect(1);
		var done = assert.async();
		createComponentAsPromise(this, 
				{ stubAjaxForResourcePaths : true, doubleUiInstance : true,  path : "pathOfNoInterest",  inject : this.defaultInject}).done(function(){
					done();
				});
	});
	QUnit.test("With on BeforeStartupCallback", function (assert) {
		assert.expect(2);
		var done = assert.async();
		createComponentAsPromise(this, 
				{ stubAjaxForResourcePaths : true, doubleUiInstance : true,  path : "pathOfNoInterest",  inject : this.defaultInject, onBeforeStartApfCallback : function(){
					assert.ok(true, "OnBeforeStartApfCallback called");
				}
				}).done(function(){
					done();
				});
	});
	QUnit.module("Create representation", {
		beforeEach : function() {
			var testContext = this;
			function ResourcePathHandlerPatched(inject) {
				IfResourcePathHandler.call(this, inject);
				ResourcePathHandlerDouble.call(this, inject);
				this.loadConfigFromFilePath = function () { // overwrite
					this.oCoreApi.loadAnalyticalConfiguration(getConfiguration());
					testContext.configWasLoaded = true;
				};
			}
			this.defaultInject = {
				constructors : {
					ResourcePathHandler : ResourcePathHandlerPatched,
					SessionHandler : sessionHandlerStubbedAjax,
					UiInstance : UiInstanceDouble
				}
			};
		}
	});
	QUnit.test("All representationTypes are instantiated", function (assert) {
		var done = assert.async();
		var componentParameters = { stubAjaxForResourcePaths : true, doubleUiInstance : true,  path : "pathOfNoInterest",  inject : this.defaultInject};
		var representationParameters = {
			dimensions : [],
			measures : [],
			requiredFilters : []
		};
		createComponentAsPromise(this, componentParameters).done(function(){
			var coreApi = this.oComponent.getProbe().coreApi;
			representationTypes().forEach(function(representationType){
				try {
					var rep = coreApi.createRepresentation(representationType.constructor, representationParameters);
					assert.ok(rep, representationType.id + "was successfully created");
				} catch (e){
					assert.ok(false, representationType.id + "was not created");
				}
			});
			done();
		}.bind(this));
	});
});
