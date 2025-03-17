sap.ui.define([
	"sap/apf/core/configurationFactory",
	"sap/apf/core/instance",
	"sap/apf/core/messageHandler",
	"sap/apf/core/resourcePathHandler",
	"sap/apf/core/utils/uriGenerator",
	"sap/apf/testhelper/interfaces/IfMessageHandler",
	"sap/apf/testhelper/interfaces/IfApfApi",
	"sap/apf/testhelper/interfaces/IfCoreApi",
	"sap/apf/api",
	"sap/apf/testhelper/interfaces/IfResourcePathHandler",
	"sap/apf/testhelper/interfaces/IfConfigurationFactory",
	"sap/apf/testhelper/doubles/coreApi",
	"sap/apf/utils/startParameter",
	"sap/ui/thirdparty/jquery"
], function(
	ConfigurationFactory,
	CoreInstance,
	MessageHandler,
	ResourcePathHandler,
	uriGenerator,
	IfMessageHandler,
	IfApfApi,
	IfCoreApi,
	Api,
	IfResourcePathHandler,
	IfConfigurationFactory,
	CoreApiDouble,
	StartParameter,
	jQuery
) {
	'use strict';

	function commonSetupInterfaces(assert, oContext) {
		oContext.getInject = function(fnClassName) {
			var oMessageHandler = new MessageHandler();
			var oCoreApi = new CoreApiDouble({
				instances : {
					messageHandler: oMessageHandler,
					startParameter : new StartParameter()
				},
				functions : {
					isUsingCloudFoundryProxy : function() { return false; }
				}
			});
			oCoreApi.getUriGenerator = function() {
				return uriGenerator;
			};
			return {
				instances : {
					messageHandler : oMessageHandler,
					coreApi : oCoreApi
				},
				functions : {
					isUsingCloudFoundryProxy : function() { return false; }
				}
			};
		};
		oContext.compareWithInterface = function(Class, Interface) {
			var oInject = this.getInject(Class);
			var oClass = new Class(oInject);
			var oIf = new Interface();
			this.compare(oClass, oIf);
		};
		oContext.compare = function(oClass, oIf) {
			var oClassProps = Object.getOwnPropertyNames(oClass).sort();
			var oIfProps = Object.getOwnPropertyNames(oIf).sort();
			assert.deepEqual(oClassProps, oIfProps);
		};
	}
	QUnit.module('Interfaces', {
		beforeEach : function(assert) {
			commonSetupInterfaces(assert, this);
		}
	});
	QUnit.test('Message Handler Interface has same public methods as the corresponding class', function(assert) {
		var oMessageHandler = new MessageHandler();
		var oIfMessageHandler = new IfMessageHandler();
		var oMessageHandlerProps = Object.getOwnPropertyNames(oMessageHandler).sort();
		var oIfMessageHandlerProps = Object.getOwnPropertyNames(oIfMessageHandler).sort();
		assert.deepEqual(oMessageHandlerProps, oIfMessageHandlerProps);
	});
	QUnit.test('Resource Path Handler Interface has same public methods as the corresponding class', function(assert) {
		this.compareWithInterface(ResourcePathHandler, IfResourcePathHandler);
	});
	QUnit.test('Configuration Factory Interface has same public methods as the corresponding class', function(assert) {
		this.compareWithInterface(ConfigurationFactory, IfConfigurationFactory);
	});
	QUnit.module('Apf and Core Api interfaces', {
		beforeEach : function(assert) {
			commonSetupInterfaces(assert, this);
		}
	});
	QUnit.test('Core Api Interface has same public methods as the corresponding class', function(assert) {
		var oMessageHandler = new MessageHandler();
		var oCoreApi = new CoreInstance.constructor({
			instances: {
				messageHandler : oMessageHandler,
				startParameter : new StartParameter()
			},
			functions : {
				isUsingCloudFoundryProxy : function() { return false; }
			}
		});
		var oIfCore = new IfCoreApi();
		this.oApi = new Api(null);
		oCoreApi.createRepresentation = null;
		oIfCore.createRepresentation = null;
		this.compare(oCoreApi, oIfCore);
	});
	QUnit.test('Apf Api has same public methods as the corresponding (test) Interface class', function(assert) {
		var oMessageHandler = new MessageHandler();
		this.oCoreApi = new CoreInstance.constructor({
			instances: {
				messageHandler : oMessageHandler,
				startParameter : new StartParameter()
			},
			functions : {
				isUsingCloudFoundryProxy : function() { return false; }
			},
			corePromise : new jQuery.Deferred()
		});
		this.oIfCore = new IfCoreApi();
		var oApi = new Api(null); // it is mandatory that API is created, otherwise createRepresentations is missing on coreApi!!!
		var oIfApi = new IfApfApi();
		oApi.constants = null; // patching deprecated constants away, so that the test runs green on relevant members
		oIfApi.constants = null;
		this.compare(oApi, oIfApi);
	});
});