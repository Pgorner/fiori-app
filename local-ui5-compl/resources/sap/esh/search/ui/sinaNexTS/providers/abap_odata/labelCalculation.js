/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../../core/LabelCalculator"],function(l){"use strict";const a=l["LabelCalculator"];function e(){return new a({key:function(l){return[l.labelPlural,l.system.id]},data:function(l){return{label:l.label,labelPlural:l.labelPlural}},setLabel:function(l,a,e){a[0]=e.label;l.label=a.join(" ");a[0]=e.labelPlural;l.labelPlural=a.join(" ")},setFallbackLabel:function(l,a){l.label=a.labelPlural+" duplicate "+l.id;l.labelPlural=l.label}})}var u={__esModule:true};u.createLabelCalculator=e;return u})})();
//# sourceMappingURL=labelCalculation.js.map