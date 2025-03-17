sap.ui.define([
	'sap/apf/testhelper/interfaces/IfApfApi',
	'sap/apf/utils/exportToGlobal',
	'sap/apf/utils/filter',
	'sap/apf/utils/utils'
], function(
	IfApfApi,
	exportToGlobal,
	Filter,
	utils
) {
	"use strict";

	/**
	 * @description Constructor, simply clones the configuration object and sets
	 * @param oBindingConfig
	 * @alias sap.apf.testhelper.doubles.ApfApi
	 */
	function ApfApi(oInject) {
		var that = this;
		var oCoreApi = oInject.instances.coreApi;
		this.doubleCreateRepresentation = function() {
			oCoreApi.createRepresentation = function(RepresentationConstructor, oConfig) {
				var Representation = utils.extractFunctionFromModulePathString(RepresentationConstructor);
				return new Representation(that, oConfig);
			};
			return this;
		};
		this.doubleCreateFilter = function() {
			this.createFilter = function(arg1, arg2, arg3) {
				return new Filter(oInject.messageHandler, arg1, arg2, arg3);
			};
			return this;
		};
		this.doubleStandardMethods = function() {
			this.check = function(oExpr) {
				oCoreApi.check(oExpr);
			};
			this.putMessage = function(oMessage) {
				return oCoreApi.putMessage(oMessage);
			};
			this.createMessageObject = function(oConfig) {
				return oCoreApi.createMessageObject(oConfig);
			};
			this.activateOnErrorHandling = function(bHandling) {
				return oCoreApi.activateOnErrorHandling(bHandling);
			};
			this.setCallbackForMessageHandling = function(fnCallback) {
				return oCoreApi.setCallbackForMessageHandling(fnCallback);
			};
			return this;
		};
	}
	ApfApi.prototype = new IfApfApi();
	ApfApi.prototype.constructor = ApfApi;

	exportToGlobal("sap.apf.testhelper.doubles.ApfApi", ApfApi);

	return ApfApi
});
