/*global MS_LOG_DEFAULT_IDENTIFER, _checkUseMockserver, _checkRegExp, _getParametersfromURL */
sap.ui.define([
	"sap/suite/ui/generic/template/genericUtilities/FeLogger"
],function(FeLogger) {
	"use strict";
	QUnit.module("genericUtilities.FeLogger", {
		beforeEach: function() {
			sinon.spy(console, "error");
			sinon.spy(console, "warn");
			sinon.spy(console, "info");
		},
		afterEach: function() {
			console.error.restore();
			console.warn.restore();
			console.info.restore();
		}
	});
	QUnit.test("Initialization", function (assert) {
		var oLogger = new FeLogger("js.AnnotationHelper");
		assert.equal(typeof oLogger.getLogger, "function", "getLogger function availability");
		assert.equal(typeof oLogger.Level, "object", "Level object availability");
	});

	QUnit.test("Log Level", function (assert) {
		var oFeLogger = new FeLogger("js.AnnotationHelper");
		var oLogger = oFeLogger.getLogger();
		var oLevel = oFeLogger.Level;
		oLogger.setLevel(oLevel.INFO);
		assert.equal(oLogger.getLevel(), oLevel.INFO, "Log level should be info");
		var oFelogger1 = new FeLogger('test');
		var oLogger1 = oFelogger1.getLogger();
		var oLevel1 = oFelogger1.Level;
		oLogger1.setLevel(4);
		assert.equal(oLogger1.getLevel(), oLevel1.DEBUG, "Log level should be debug");
	});

	QUnit.test("getLogger: component suffix", function (assert) {
		var oFeLogger = new FeLogger("js.AnnotationHelper");
		var oLogger = oFeLogger.getLogger();
		var oErrorLog = oLogger.error("test");
		assert.ok(console.error.lastCall.args[0].endsWith("FioriElements: js.AnnotationHelper"), "classname prefixed");
	});

	QUnit.test("FeLogger should log with error message", function (assert) {
		var fnSupportInfo = sinon.spy(function() {return "support Info";});
		var onLogEntry = sinon.spy();
		var oListener = {onLogEntry: onLogEntry};

		var oFeLogger = new FeLogger("js.AnnotationHelper");
		var oLogger = oFeLogger.getLogger();
		oFeLogger.addLogListener(oListener);
		oLogger.error("message", fnSupportInfo);
		assert.ok(onLogEntry.calledWith(sinon.match({message:"message", details:"spy", component:"FioriElements: js.AnnotationHelper"})),
				  "Log is with FioriElements prefix and error message");
	});

});
