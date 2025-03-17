/*global QUnit, sap */
sap.ui.define([
	'sap/apf/core/sessionHandler',
	'sap/apf/testhelper/createComponentAsPromise',
	'sap/apf/testhelper/helper',
	'sap/apf/testhelper/doubles/UiInstance',
	'sap/ui/thirdparty/jquery',
	'sap/apf/testhelper/config/sampleConfiguration',
	'sap/apf/testhelper/odata/sampleServiceData',
	'sap/apf/testhelper/interfaces/IfResourcePathHandler',
	'sap/apf/testhelper/odata/savedPaths',
	'sap/apf/testhelper/doubles/request',
	'sap/apf/testhelper/doubles/Representation',
	'sap/apf/testhelper/doubles/metadata',
	'sap/apf/testhelper/doubles/resourcePathHandler',
	'sap/apf/Component'
], function (
	SessionHandler,
	createComponentAsPromise,
	helper,
	UiInstance,
	jQuery
) {
	'use strict';

	helper.injectURLParameters({
		"error-handling": "true"
	});

	QUnit.module("Empty application configuration", {
		afterEach: function () {
			this.oCompContainer && this.oCompContainer.destroy();
		}
	});

	QUnit.test("WHEN empty analytical configuration file is loaded", function (assert) {

		var done = assert.async();

		function ajaxWrapper(oParam1, oParam2) {
			var deferred = jQuery.Deferred();
			if (oParam1 && oParam1.type !== 'HEAD' && oParam1.url.indexOf("sampleConfiguration.json") > 0) {
				jQuery.ajax(oParam1, oParam2).done(function(arg1, arg2, arg3){
					deferred.resolve({}, arg2, arg3);
				});
				return deferred.promise();
			} else if (oParam1.success) {
				var fnOriginalSuccess = oParam1.success;
				oParam1.success = function (oData, sStatus, oJqXHR) {
					if (oData && oData.applicationConfiguration) {
						var sResponse = JSON.stringify(oData);
						var sHref = jQuery(location).attr('href');
						sHref = sHref.replace(location.protocol + "//" + location.host, "");
						sHref = sHref.slice(0, sHref.indexOf("test-resources"));
						sResponse = sResponse.replace(/\/apf-test\//g, sHref);
						oData = JSON.parse(sResponse);
					}
					fnOriginalSuccess(oData, sStatus, oJqXHR);
				};
				return jQuery.ajax(oParam1, oParam2);
			}
			jQuery.ajax(oParam1, oParam2).done(function(oData, sStatus, oJqXHR){
				if (oData && oData.applicationConfiguration) {
					var sResponse = JSON.stringify(oData);
					var sHref = jQuery(location).attr('href');
					sHref = sHref.replace(location.protocol + "//" + location.host, "");
					sHref = sHref.slice(0, sHref.indexOf("test-resources"));
					sResponse = sResponse.replace(/\/apf-test\//g, sHref);
					oData = JSON.parse(sResponse);
				}
				deferred.resolve(oData, sStatus, oJqXHR);
			});
			return deferred.promise();
		}

		var inject = {
				constructors : {
					SessionHandler: SessionHandler,
					UiInstance: UiInstance
				},
				functions : {
					ajax: ajaxWrapper,
					messageCallbackForStartup: function(messageObject) {
						assert.equal(messageObject.getPrevious().getCode(), "5102", "THEN error message 5102 as expected");
						done();
					}
				}
		};
		createComponentAsPromise(this, 
				{ componentId : "CompAjax1",  inject : inject, componentData : {}});
	});

	QUnit.module("Empty Application Configuration", {
		afterEach: function () {
			this.oCompContainer.destroy();
		}
	});

	QUnit.test("WHEN Empty application configuration is loaded THEN fatal message", function (assert) {
		var done = assert.async();
		function ajaxWrapperThatReturnsEmptyApplicationDefinition(oParam1, oParam2) {
			if (oParam1 && oParam1.type !== 'HEAD' && oParam1.url.indexOf("applicationConfiguration.json") > 0) {
				var deferred = jQuery.Deferred();
				jQuery.ajax(oParam1, oParam2).done(function(arg1, arg2, arg3){
					deferred.resolve({}, arg2, arg3);
				});
				return deferred.promise();
			}
			return jQuery.ajax(oParam1, oParam2);
		}
		var inject = {
				constructors : {
					SessionHandler: SessionHandler,
					UiInstance: UiInstance
				},
				functions : {
					ajax: ajaxWrapperThatReturnsEmptyApplicationDefinition,
					messageCallbackForStartup: function(messageObject) {
						assert.equal(messageObject.getPrevious().getCode(), "5055", "THEN error message 5055 as expected");
						done();
					}
				}
		};
		createComponentAsPromise(this, 
				{ componentId : "CompAjax1",  inject : inject, componentData : {}});
		
	});
});
