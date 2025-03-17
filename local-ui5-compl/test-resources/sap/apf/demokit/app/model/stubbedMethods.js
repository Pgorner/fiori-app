/*global URLSearchParams, sinon */
sap.ui.define([
	"sap/ui/thirdparty/jquery"
], function(jQuery) {
	"use strict";

	return function(oTokenForServices) {
		var fnStub = function() {
			// ajax stubing for xscrf token
			var fnOriginalAjax = jQuery.ajax;
			function ajaxStubbed(oConfig) {
				var fnOriginalSuccess = oConfig.success;
				/*if (typeof fnOriginalSuccess === "function" && oConfig.type === "HEAD" && oConfig.url.search("annotation.xml") !== -1) {
					tmp = {};
					fnOriginalSuccess(tmp, "success", undefined);
				} else */
				if (typeof fnOriginalSuccess === "function"
					&& (oConfig.url === oTokenForServices.sAppOdataPath || oConfig.url === oTokenForServices.sPersistencyOdataPath)) {
					var oFakeXMLHttpRequest = {
						getResponseHeader: function(arg) {
							if (arg === "x-sap-login-page") {
								return null;
							}
							return arg;
						}
					};
					fnOriginalSuccess([], "success", oFakeXMLHttpRequest);
				} else {
					var modPath = sap.ui.require.toUrl('sap/apf/demokit/app');
					var oURLParameters = new URLSearchParams(window.location.search);
					if (oURLParameters.get("smartFilterBar") === "true" && oConfig.url === modPath + "/config/AnalyticalConfiguration.json") {
						oConfig.url = modPath + "/config/AnalyticalConfigurationWithSFB.json";
					}
					return fnOriginalAjax(oConfig);
				}
			}
			this.stubJqueryAjax = sinon.stub(jQuery, "ajax", ajaxStubbed);
		};
		var fnRestore = function() {
			this.stubJqueryAjax.restore();
		};
		return {
			fnStub : fnStub,
			fnRestore : fnRestore
		};
	};

});
