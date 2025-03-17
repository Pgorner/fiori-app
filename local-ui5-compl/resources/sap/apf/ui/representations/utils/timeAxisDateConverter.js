/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
sap.ui.define(["sap/apf/utils/exportToGlobal"],function(o){"use strict";function e(){this.oConversionDate={};this.oDimensionInfo={}}e.prototype.constructor=e;e.prototype.bIsConversionToDateRequired=function(o,e){if(!this.oDimensionInfo||!this.oDimensionInfo[o]){return false}if(this.oDimensionInfo[o].conversionEvaluated){return this.oDimensionInfo[o].conversionRequired}this.oDimensionInfo[o].conversionEvaluated=true;if(this.oDimensionInfo[o].dataType==="date"&&e.getPropertyMetadata(o).semantics==="yearmonthday"){this.oDimensionInfo[o].conversionRequired=true;return true}this.oDimensionInfo[o].conversionRequired=false;return false};e.prototype.setConvertedDateLookUp=function(o){this.oConversionDate=o};e.prototype.getConvertedDateLookUp=function(){return this.oConversionDate};e.prototype.createPropertyInfo=function(o){var e=this;o.forEach(function(o){e.oDimensionInfo[o.fieldName]=o})};o("sap.apf.ui.representations.utils.TimeAxisDateConverter",e);return e});
//# sourceMappingURL=timeAxisDateConverter.js.map