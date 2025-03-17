/*!
 * SAPUI5
 * (c) Copyright 2009-2024 SAP SE. All rights reserved.
 */
sap.ui.define(["sap/ui/thirdparty/jquery","./library","sap/ui/core/Element","sap/m/library"],function(jQuery,r,e,a){"use strict";var t=a.ValueCSSColor;const l=r.MicroChartColorType;var u=e.extend("sap.suite.ui.microchart.StackedBarMicroChartBar",{metadata:{library:"sap.suite.ui.microchart",properties:{value:{type:"float",group:"Data",defaultValue:"0"},valueColor:{type:"string",defaultValue:null,group:"Appearance"},displayValue:{type:"string",group:"Data",defaultValue:null}}}});u.prototype.setValue=function(r,e){var a=jQuery.isNumeric(r);return this.setProperty("value",a?r:NaN,e)};u.prototype.setValueColor=function(r,e){var a=false;if(l.hasOwnProperty(r)||(r==null||r=="")){a=true}else{a=t.isValid(r)}if(r!=null&&!a){throw new Error(`Value ${r} is not valid for property "valueColor"`)}return this.setProperty("valueColor",a?r:null,e)};return u});
//# sourceMappingURL=StackedBarMicroChartBar.js.map