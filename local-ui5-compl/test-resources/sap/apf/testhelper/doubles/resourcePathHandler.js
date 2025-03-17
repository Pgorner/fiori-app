sap.ui.define([
	"sap/apf/core/constants",
	"sap/apf/core/messageDefinition",
	"sap/apf/testhelper/config/sampleConfiguration",
	"sap/apf/testhelper/interfaces/IfResourcePathHandler",
	"sap/apf/utils/exportToGlobal"
], function(
	coreConstants,
	messageDefinition,
	sampleConfig,
	IfResourcePathHandler,
	exportToGlobal
) {
	'use strict';
	/**
	 * @description Constructor, simply clones the resource path handler
	 *              interface object
	 * @param oInject
	 * @alias sap.apf.testhelper.doubles.ResourcePathHandler
	 */
	function ResourcePathHandler(oInject) {
		var that = this;
		this.oMessageHandler = oInject.instances.messageHandler;
		this.oCoreApi = oInject.instances.coreApi;
		if (oInject.corePromise) {
			setTimeout(function(){
				oInject.corePromise.resolve();
			}, 1);
		}
		this.doLoadMessageConfigurations = function() {
			that.loadConfigFromFilePath = function() {
				oInject.instances.messageHandler
						.loadConfig(messageDefinition, true);
				oInject.instances.messageHandler
						.loadConfig(getApplicationMessageDefinitions());
			};
			that.loadConfigFromFilePath();
			return this;
		};

		this.getApfMessages = function() {
			return messageDefinition;
		};
		this.getAppMessages = function() {
			return getApplicationMessageDefinitions();
		};
		this.getConfigurationProperties = function() {
			return jQuery.Deferred().resolve({
				appName : "appName"
			});
		};

	}

	ResourcePathHandler.prototype = new IfResourcePathHandler();
	ResourcePathHandler.prototype.constructor = ResourcePathHandler;

	ResourcePathHandler.setupForPersistenceTests = function() {
		ResourcePathHandler.prototype.loadConfigFromFilePath = function() {
			this.oMessageHandler.loadConfig(this.getApfMessages(), true);
			this.oMessageHandler.loadConfig(this.getAppMessages());
			var oConfiguration = sampleConfig.getSampleConfiguration();
			this.oCoreApi.loadAnalyticalConfiguration(oConfiguration);
		};

		ResourcePathHandler.prototype.getResourceLocation = function(
				param) {

			var determineTestResourcePath = function() {
				var sHref = jQuery(location).attr('href');

				// HTML QUnit based
				// extract deployment project and use it as path to test
				// resources
				sHref = sHref.replace(location.protocol + "//" + location.host,
						"");
				sHref = sHref.slice(0, sHref.indexOf("test-resources"));
				return sHref + "test-resources/sap/apf";
			};
			if (param === "apfUiTextBundle") {
				var sConfigPath = determineTestResourcePath()
						+ '/resources/i18n/apfUi.properties';
				return sConfigPath;
			} else if (param === "applicationUiTextBundle") {
				var sAppTextPath = determineTestResourcePath()
						+ '/resources/i18n/test_texts.properties';
				return sAppTextPath;
			}
		};
		ResourcePathHandler.prototype.getApplicationConfigurationURL = function() {
			return "/path/to/applicationConfiguration.json";
		};
		ResourcePathHandler.prototype.getPersistenceConfiguration = function() {
			return jQuery
					.Deferred()
					.resolve(
							{
								"path" : {
									"service" : "/sap/hba/r/apf/core/odata/apf.xsodata",
									"entitySet" : coreConstants.entitySets.analysisPath
								}
							});
		};
	};
	/**
	 * 
	 * @returns {*[]}
	 */
	function getApplicationMessageDefinitions() {
		return [ {
			"code" : "8000",
			"severity" : "warning",
			"key" : "8000"
		}, {
			"code" : "8001",
			"severity" : "fatal",
			"key" : "8001"
		}, {
			"code" : "10000",
			"severity" : "warning",
			"rawText" : "I am a rawtext warning message"
		}, {
			"code" : "10001",
			"severity" : "error",
			"rawText" : "I am a rawtext error message"
		}, {
			"code" : "10002",
			"severity" : "error",
			"logOnly" : "true",
			"rawText" : "I am a rawtext error message"
		}, {
			"code" : "10003",
			"severity" : "undefined",
			"rawText" : "I am a rawtext info message"
		} ];
	}

	exportToGlobal("sap.apf.testhelper.doubles.ResourcePathHandler", ResourcePathHandler);

	return ResourcePathHandler;
});
