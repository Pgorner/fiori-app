/**
 * HL March 15.03.2014
 * TODO
 * It is not valid in UI5 as it should not rely on jQuery(document).ready(function()
 * Needs to be reworked or moved to a different location.
 * The unit under test is unclear.
 */

// this cannot be done as qunit test, because the asserts are caught
QUnit.config.autostart = true;

sap.ui.require([
	"sap/apf/core/messageHandler",
	"sap/apf/core/resourcePathHandler",
	"sap/apf/core/utils/uriGenerator",
	"sap/apf/core",
	"sap/ui/thirdparty/jquery"
], function(MessageHandler, ResourcePathHandler, uriGenerator, core, jQuery) {
	'use strict';

	var TestHelper = function() {
		var that = this;
		this.hasBeenCalled = false;
		this.doMessageHandling = function(oMessage) {
			that.hasBeenCalled = true;
			jQuery("#messages").append("Callback function, that should display the messages, has been called");
			jQuery("#messages").append(" Code:" + oMessage.getCode() + " Text : " + "'" + oMessage.getMessage() + "'");
			throw new Error("APFapf1972");
		};
	};
	
	function executeTest() {
		core.check = function(booleExpr, sMessage, sCode) {
			if (!booleExpr) {
				throw new Error(sMessage);
			}
		};
		core.getUriGenerator = function() {
			return uriGenerator;
		};
	    this.fnCheckForTimeout = core.checkForTimeout;
	    core.checkForTimeout = function(jqXHR) {
	           return undefined;
	    };
		var oResourcePathHandler = new ResourcePathHandler();
		core.getResourceLocation = function(sId) {
			return oResourcePathHandler.getResourceLocation(sId);
		};
		var oMessageHandler = new MessageHandler();
		core.loadMessageConfiguration = function(aMessages) {
			oMessageHandler.loadConfig(aMessages);
		};
		core.loadAnalyticalConfiguration = function(oConfig) {
		};
		oResourcePathHandler.loadConfigFromFilePath("/sap.apf.core.test/test-resources/helper/config/applicationConfiguration.json");
		var oHelper = new TestHelper();
		var callbackFunction = oHelper.doMessageHandling;
		oMessageHandler.activateOnErrorHandling(true);
		oMessageHandler.setMessageCallback(callbackFunction);
		// testing, that nothing is triggered, if assertion is ok
		jQuery("#messages").append("Only msg 10002 is expected - look in the log  for '...I am a rawtext error message'- :");
		if (oHelper.hasBeenCalled == true) {
			jQuery("#messages").append("<p>Error registered function has already been called</p>");
		}
		oMessageHandler.putMessage(oMessageHandler.createMessageObject({
			code : "10002",
			params : []
		}));
	}
	
	
	QUnit.module("tMessageHandlerLogging");
	QUnit.test("on ready", function(assert){
		executeTest();
		assert.ok(false);
	});

	jQuery(function() {
		QUnit.start();
	});
});	
