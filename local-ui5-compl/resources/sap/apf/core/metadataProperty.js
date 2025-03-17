/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define(["sap/apf/utils/exportToGlobal"],function(t){"use strict";function e(t){var r=this;var i=false;var a=false;this.isKey=function(){return i};this.isParameterEntitySetKeyProperty=function(){return a};this.getAttribute=function(t){if(typeof this[t]!=="function"){return this[t]}};this.clone=function(){return new e(t)};function n(t,e){switch(t){case"isKey":if(e===true){i=true}break;case"isParameterEntitySetKeyProperty":if(e===true){a=true}break;default:if(typeof r[t]!=="function"){r[t]=e}}return r}function u(){for(var e in t){switch(e){case"dataType":for(var r in t.dataType){n(r,t.dataType[r])}break;default:n(e,t[e])}}}u()}t("sap.apf.core.MetadataProperty",e);return{constructor:e}},true);
//# sourceMappingURL=metadataProperty.js.map