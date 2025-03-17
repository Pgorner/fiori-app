/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../../core/LabelCalculator"],function(l){"use strict";const e=l["LabelCalculator"];const a=function(l){if(l[6]!=="~"){return{system:"__DUMMY",client:"__DUMMY"}}return{system:l.slice(0,3),client:l.slice(3,6)}};function t(){return new e({key:function(l){const e=a(l.id);return[l.labelPlural,e.system,e.client]},data:function(l){return{label:l.label,labelPlural:l.labelPlural}},setLabel:function(l,e,a){e[0]=a.label;l.label=e.join(" ");e[0]=a.labelPlural;l.labelPlural=e.join(" ")},setFallbackLabel:function(l,e){l.label=e.labelPlural+" duplicate "+l.id;l.labelPlural=l.label}})}var n={__esModule:true};n.createLabelCalculator=t;return n})})();
//# sourceMappingURL=labelCalculation.js.map