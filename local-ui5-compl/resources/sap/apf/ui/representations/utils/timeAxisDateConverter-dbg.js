/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
/* global sap */
sap.ui.define([
	"sap/apf/utils/exportToGlobal"
], function(exportToGlobal) {
	"use strict";
	/*
	 * @alias sap.apf.ui.representations.utils.TimeAxisDateConverter
	 */
	function TimeAxisDateConverter() {
		this.oConversionDate = {};
		this.oDimensionInfo = {};
	}
	TimeAxisDateConverter.prototype.constructor = TimeAxisDateConverter;
	TimeAxisDateConverter.prototype.bIsConversionToDateRequired = function(fieldName, oMetadata) {
		if (!this.oDimensionInfo || !this.oDimensionInfo[fieldName]) {
			return false;
		}
		if (this.oDimensionInfo[fieldName].conversionEvaluated) {
			return this.oDimensionInfo[fieldName].conversionRequired;
		}
		this.oDimensionInfo[fieldName].conversionEvaluated = true;
		if (this.oDimensionInfo[fieldName].dataType === "date" && oMetadata.getPropertyMetadata(fieldName).semantics === "yearmonthday") {
			this.oDimensionInfo[fieldName].conversionRequired = true;
			return true;
		}
		this.oDimensionInfo[fieldName].conversionRequired = false;
		return false;
	};
	TimeAxisDateConverter.prototype.setConvertedDateLookUp = function(oConversionDate) {
		this.oConversionDate = oConversionDate;
	};
	TimeAxisDateConverter.prototype.getConvertedDateLookUp = function() {
		return this.oConversionDate;
	};
	TimeAxisDateConverter.prototype.createPropertyInfo = function(aProperties) {
		var oTimeAxisConvertorInstance = this;
		aProperties.forEach(function(oProperty) {
			oTimeAxisConvertorInstance.oDimensionInfo[oProperty.fieldName] = oProperty;
		});
	};

	// compatiblity export as the global name and the module name differ
	exportToGlobal("sap.apf.ui.representations.utils.TimeAxisDateConverter", TimeAxisDateConverter);

	return TimeAxisDateConverter;
});