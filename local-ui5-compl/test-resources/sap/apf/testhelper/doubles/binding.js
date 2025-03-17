sap.ui.define([
	// "sap/apf/core/utils/Filter",
	"sap/apf/utils/exportToGlobal"
], function(
	// CoreFilter,
	exportToGlobal
) {
	"use strict";
	/**
	 * @description Constructor, simply clones the configuration object and sets
	 * @param oBindingConfig
	 * @alias sap.apf.testhelper.doubles.Binding
	 */
	function Binding(oInject, oBindingConfig) {
		this.type = "binding";

	//	var oTestFilter = new CoreFilter(oInject.messageHandler);
	//
	//	this.getFilter = function() {       
	//		return oTestFilter;
	//	};

		this.setData = function(oDataResponse) {
			// sets the data
		};
		
		this.getRepresentationInfo = function() {
		};

		this.getSelectedRepresentationInfo = function() { 
		};

		this.getRequestOptions = function() { 
		};
	}

	exportToGlobal("sap.apf.testhelper.doubles.Binding", Binding);

	return Binding;
});
