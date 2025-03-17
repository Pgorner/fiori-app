sap.ui.define([
	'sap/apf/core/instance',
	'sap/apf/core/utils/filter',
	'sap/apf/testhelper/interfaces/IfCoreApi',
	'sap/apf/utils/exportToGlobal',
	'sap/apf/utils/filter',
	'sap/apf/utils/startParameter'
], function(
	instance,
	CoreFilter,
	IfCoreApi,
	exportToGlobal,
	Filter,
	StartParameter
) {
	"use strict";
	/**
	 * @description Constructor, simply clones the configuration object and sets
	 * @param oBindingConfig
	 * @alias sap.apf.testhelper.doubles.CoreApi
	 */
	function CoreApi(oInject, oConfig) {
		var oSavedContextFilter;
		var oStartParameter = new StartParameter();
		this.doubleCreateFilter = function() {
			this.createFilter = function(arg1, arg2, arg3) {
				return new Filter(oInject.instances.messageHandler, arg1, arg2, arg3);
			};
			return this;
		};
		this.doubleMessaging = function() {
			this.check = function(oBooleExpr) {
				oInject.instances.messageHandler.check(oBooleExpr);
			};
			this.putMessage = function(oMessageObject) {
				oInject.instances.messageHandler.putMessage(oMessageObject);
			};
			this.createMessageObject = function(oConf) {
				return oInject.instances.messageHandler.createMessageObject(oConf);
			};
			return this;
		};
		this.doubleCumulativeFilter = function() {
			this.getCumulativeFilter = function() {
				if (oSavedContextFilter) {
					return jQuery.Deferred().resolve(oSavedContextFilter);
				}
				return jQuery.Deferred().resolve(new CoreFilter(oInject.instances.messageHandler));
			};
			this.setCumulativeFilter = function(oFilter) {
				oSavedContextFilter = oFilter;
			};
			return this;
		};
		this.getSmartFilterBarAsPromise = function(){
			var deferred = jQuery.Deferred().resolve(null);
			return deferred.promise();
		};
		this.getStartParameterFacade = function() {
			return oStartParameter;
		};
	}
	CoreApi.prototype = new IfCoreApi();
	CoreApi.prototype.constructor = CoreApi;

	exportToGlobal("sap.apf.testhelper.doubles.CoreApi", CoreApi);

	return CoreApi;
});
