/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["jquery.sap.global","sap/sac/df/thirdparty/lodash","sap/zen/dsh/utils/BaseHandler"],function(jQuery,a){"use strict";var r=function(){};r.prototype.createDataPointStyle=function(r){var t=r.getConditionalFormatValues();var n=a.reduce(t,function(a,r,t){a.push({dataContext:r,properties:{color:e(t)},displayName:""+t});return a},[]);return{rules:n}};function e(a){var r="sapzencrosstab-DataCellAlert"+a+"Background";return t(r)}function t(a){var r=jQuery("<div style='display:none'></div>").appendTo("body");r.addClass(a);var e=r.css("background-color");r.remove();return e}return r});
//# sourceMappingURL=info_conditional_format_mapper.js.map