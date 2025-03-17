sap.ui.define([
	'sap/apf/utils/exportToGlobal',
	'sap/apf/utils/utils',
	'sap/apf/internal/server/userData'
], function(
	exportToGlobal,
	utils,
	userData
) {
	'use strict';
	/**
	 * @class authorization test helper for abap based gateway system
	 * @param  {function} callback this function is executed, when the new instance creation has finished.
	 * @param  {object} config configuration of services on the gateway system
	 * @param  {string} config.serviceRoot a ODATA service root of the system
	 * @alias sap.apf.testhelper.AuthTestHelperAbap
	 */
	function AuthTestHelperAbap(fnDone, callback, config) {
		var xsrfToken;
		/**
		 * @description Returns the XSRF token as string
		 * @returns {String}
		 */
		this.getXsrfToken = function() {
			return utils.createPromise(xsrfToken);
		};
		function init() {
			jQuery.ajax({
				url : config.serviceRoot + "$metadata",
				type : "GET",
				beforeSend : function(xhr) {
					xhr.setRequestHeader("x-csrf-token", "Fetch");
				},
				username : userData.abapSystem.user,
				password : userData.abapSystem.password,
				async : false,
				cache : false,
				success : function(data, textStatus, XMLHttpRequest) {
					xsrfToken = XMLHttpRequest.getResponseHeader("x-csrf-token");
					if (!xsrfToken) {
						fnDone();
						throw new Error("x-scrf-token not available");
					}
					callback();
				},
				error : function(oJqXHR, sStatus, sErrorThrown) {
					fnDone();
					throw new Error(sErrorThrown);
				}
			});
		}
		init();
	}

	exportToGlobal("sap.apf.testhelper.AuthTestHelperAbap", AuthTestHelperAbap);

	return AuthTestHelperAbap;
});
