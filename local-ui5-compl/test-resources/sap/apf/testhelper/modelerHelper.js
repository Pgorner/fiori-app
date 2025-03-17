/**
 * Helper for creating standard objects of the modeler
 */
sap.ui.define([
	"sap/apf/core/constants",
	"sap/apf/core/metadataFactory",
	"sap/apf/modeler/core/instance",
	"sap/apf/testhelper/authTestHelper",
	"sap/apf/testhelper/mockServer/wrapper",
	"sap/apf/utils/exportToGlobal"
], function(
	coreConstants,
	MetadataFactory,
	ModelerCoreInstance,
	AuthTestHelper,
	mockServer,
	exportToGlobal
) {
	'use strict';

	/**
	 * @alias sap.apf.testhelper.modelerHelper
	 */
	var modelerHelper = {};
	modelerHelper.createApplicationHandler = function(context, callback, serviceRoot) {
		var sRoot = serviceRoot || "/sap/hba/r/apf/core/odata/modeler/AnalyticalConfiguration.xsodata";
		context.persistenceConfiguration = {
			serviceRoot : sRoot,
			developmentLanguage : "NN"
		};
		context.modelerCore = new ModelerCoreInstance(context.persistenceConfiguration, {
			constructors : {
				MetadataFactory : context.MetadataFactory || MetadataFactory
			},
			probe : function(instances) {
				context.persistenceProxy = instances.persistenceProxy; // get instance of persistence proxy
				context.messageHandler = instances.messageHandler;
			}
		});
		context.modelerCore.getApplicationHandler(callback);
	};
	/**
	 * called in setup results in: context.configurationEditor, context.configurationHandler, context.applicationHandler,
	 * context.applicationCreatedForTest = guid of the application
	 */
	modelerHelper.createConfigurationEditor = function(context, applicationConfiguration, serviceRoot, callback, assert, done) {

		modelerHelper.createApplicationHandler(context, function(appHandler) {
			context.applicationHandler = appHandler;
			context.applicationHandler.setAndSave(applicationConfiguration, loadConfigurationHandler);
		}, serviceRoot);
		function loadConfigurationHandler(applicationCreatedForTest, metadata, messageObject) {
			context.applicationCreatedForTest = applicationCreatedForTest;
			if (messageObject) {
				assert.ok(messageObject, "creation of application failed");
				context.applicationCreatedForTest = undefined;
				done();
			} else {
				context.modelerCore.getConfigurationHandler(context.applicationCreatedForTest, createConfiguration);
			}
		}
		function createConfiguration(configurationHandler, messageObject) {
			var configurationObject = {
				AnalyticalConfigurationName : "test config A"
			};
			var tempConfigId;
			context.configurationHandler = configurationHandler;
			if (messageObject) {
				assert.ok(messageObject, "error occurred when loading the configurations and texts");
				context.applicationCreatedForTest = undefined;
				done();
			} else {
				tempConfigId = context.configurationHandler.setConfiguration(configurationObject);
				context.configurationHandler.loadConfiguration(tempConfigId, rememberConfigurationEditor);
			}
		}
		function rememberConfigurationEditor(configurationEditor) {
			context.configurationEditor = configurationEditor;
			callback();
		}
	};
	modelerHelper.createConfigurationEditorWithSave = function(isMockServerActive, context, applicationConfiguration, callbackForSetup, callbackAfterSave, assert, done) {
		if (isMockServerActive) {
			coreConstants.developmentLanguage = 'NN'; // <== overwrite '' with 'NN' for mock server use to avoid the creation of a GUID.
			mockServer.activateDso();
			mockServer.activateModeler();
			modelerHelper.createConfigurationEditor(context, applicationConfiguration, undefined, createConfigEditorcallback, assert, done);
		} else {
			new AuthTestHelper(done, function() {
				modelerHelper.createConfigurationEditor(context, applicationConfiguration, "/sap/hba/r/apf/core/odata/modeler/AnalyticalConfiguration.xsodata", createConfigEditorcallback, assert, done);
			});
		}
		function createConfigEditorcallback() {
			var ret = callbackForSetup();
			if (ret && ret.done) {
				ret.done(function(){
					context.configurationEditor.save(saveCallback);
				});
			} else {
				context.configurationEditor.save(saveCallback);	
			}
		}
		function saveCallback(configurationId, metaData, messageObject) {
			context.configurationIdCreatedByTest = configurationId;
			context.modelerCore = new ModelerCoreInstance(context.persistenceConfiguration);
			context.modelerCore.getApplicationHandler(function() {
				context.modelerCore.getConfigurationHandler(context.applicationCreatedForTest, function(configurationHandler, messageObject) {
					context.configurationHandler = configurationHandler;
					context.configurationHandler.loadConfiguration(context.configurationIdCreatedByTest, function(configurationEditor) {
						context.configurationEditor = configurationEditor;
						callbackAfterSave();
					});
				});
			});
		}
	};
	modelerHelper.removeApplication = function(context, assert) {
		if (context.applicationCreatedForTest && context.applicationHandler) {
			var done = assert.async();
			context.applicationHandler.removeApplication(context.applicationCreatedForTest, function() {
				done();
			});
		}
	};

	exportToGlobal("sap.apf.testhelper.modelerHelper", modelerHelper);

	return modelerHelper;
});

