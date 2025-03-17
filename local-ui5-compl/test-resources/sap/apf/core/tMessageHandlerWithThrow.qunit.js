/* global QUnit */
sap.ui.define([
	"sap/apf/core/constants",
	"sap/apf/core/messageDefinition",
	"sap/apf/core/messageHandler",
	"sap/apf/testhelper/helper",
	"sap/apf/core/messageObject"
], function(
	coreConstants,
	messageDefinition,
	MessageHandler,
	helper
) {
	'use strict';

	helper.injectURLParameters({
		"notrycatch" : "true"
	});

	QUnit.module("Test throw", {
		beforeEach : function(assert) {

			this.oMessageHandler = new MessageHandler();
			this.oMessageHandler.setLifeTimePhaseRunning();
			this.oMessageHandler.loadConfig(messageDefinition, true);
		}
	});

	QUnit.test("WHEN fatal message is put AND UI Callback is registered", function(assert) {
		assert.expect(3);
		var thatAssert = assert;
		var oMessageHandler = this.oMessageHandler;

		function assertCallbackFunctionIsCalled(oMessageObject) {
			var sCode = oMessageObject.getCode();
			thatAssert.equal(sCode, coreConstants.message.code.errorExitTriggered, "THEN UI callback is called with correct code for fatal");
			sCode = oMessageObject.getPrevious().getCode();
			thatAssert.equal(sCode, '5100', "original fatal error");
		}

		this.oMessageHandler.activateOnErrorHandling(true);
		this.oMessageHandler.setMessageCallback(assertCallbackFunctionIsCalled);

		assert.throws(function() {
			oMessageHandler.putMessage(oMessageHandler.createMessageObject({
				code : '5100'
			}));
		}, "THEN exception is thrown as expected");
	});

	QUnit.test("GIVEN 2 putMessage() A = error and B = technError WHEN fatal putMessage() called last THEN A and B shall logged in getLogMessages()", function(assert) {
		assert.expect(2);
		var thatAssert = assert;
		var oMessageHandler = this.oMessageHandler;

		oMessageHandler.activateOnErrorHandling(true);
		var fnCallback = function(oMessageObject) {
			if (oMessageObject.getSeverity() === "fatal") {
				var aLogMessages = oMessageHandler.getLogMessages();
				thatAssert.equal(aLogMessages.length, 2, "Two messages in log expected");
			}
		};

		this.oMessageHandler.setMessageCallback(fnCallback);
		//technicalError
		oMessageHandler.putMessage(oMessageHandler.createMessageObject({
			code : "3001",
			aParameters : [ "unknownKey" ],
			oCallingObject : this
		}));
		//error
		oMessageHandler.putMessage(oMessageHandler.createMessageObject({
			code : "5201",
			aParameters : [ "testParam" ],
			oCallingObject : this
		}));

		assert.throws(function() {
			oMessageHandler.putMessage(oMessageHandler.createMessageObject({
				code : '5100',
				oCallingObject : this
			}));
		}, "exception");

	});

});
