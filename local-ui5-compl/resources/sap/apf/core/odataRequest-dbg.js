/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */

/*global sap */

sap.ui.define(
	[
		"sap/apf/core/utils/checkForTimeout",
		"sap/apf/utils/exportToGlobal",
		"sap/ui/model/odata/ODataUtils"
	],
	function(checkForTimeout, exportToGlobal, ODataUtils) {
		"use strict";
		/**
		 * @alias sap.apf.core.odataRequestWrapper
		 * @description Wraps a OData request in order to handle a server time-out. It uses a POST $batch operation wrapping the GET.
		 * @param {object} oInject Injected reference to data.js. This reference must be assigned to oInject.instances.datajs.
		 * @param {object} oRequest An Object that represents the HTTP request to be sent.
		 * @param {function} fnSuccess A callback function called after the response was successfully received and parsed.
		 * @param {function} fnError A callback function that is executed if the request fails. In case of time out the error object has property messageObject, that holds sap.apf.core.MessageObject.
		 * @param {object} oBatchHandler A handler object for the request data.
		 */
		function odataRequestWrapper(oInject, oRequest, fnSuccess, fnError, oBatchHandler) {
			var datajs = oInject.instances.datajs;
			function success(data, response) {
				var oMessage = checkForTimeout(response);
				var oError = {};

				if (oMessage) {
					oError.messageObject = oMessage;
					fnError(oError);
				} else {
					fnSuccess(data, response);
				}
			}
			function error(oError) {
				var oMessage = checkForTimeout(oError);

				if (oMessage) {
					oError.messageObject = oMessage;
				}
				fnError(oError);
			}

			var oMetadata = oRequest.serviceMetadata;
			var sapSystem = oInject.functions.getSapSystem();
			if (sapSystem && !oRequest.isSemanticObjectRequest) {
				var rSegmentCheck = /(\/[^\/]+)$/g;
				if (oRequest.requestUri && oRequest.requestUri[oRequest.requestUri.length - 1] === '/') {
					oRequest.requestUri = oRequest.requestUri.substring(0, oRequest.requestUri.length - 1);
				}
				var sLastSegment = oRequest.requestUri.match(rSegmentCheck)[0];
				var split = oRequest.requestUri.split(sLastSegment);
				var tmpRequestUri = ODataUtils.setOrigin(split[0], { force : true, alias : sapSystem});
				oRequest.requestUri = tmpRequestUri + sLastSegment;
			}
			datajs.request(oRequest, success, error, oBatchHandler, undefined, oMetadata);
		}

		// compatibility export, although the global name and the module name don't differ
		exportToGlobal("sap.apf.core.odataRequestWrapper", odataRequestWrapper);

		return odataRequestWrapper;
	}
);
