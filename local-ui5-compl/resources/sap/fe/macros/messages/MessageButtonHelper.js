/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.define(["sap/m/Dialog","sap/ui/core/Element","sap/ui/mdc/valuehelp/Dialog","sap/ui/model/Filter"],function(e,t,n,i){"use strict";function r(r){const s=function(i){if(!i.length){return false}let s=t.getElementById(i[0]);while(s){if(s.getId()===r){return true}if(s instanceof e||s instanceof n){return false}s=s.getParent()}return false};return new i({path:"controlIds",test:s,caseSensitive:true})}const s={getCheckControlInViewFilter:r};return s},false);
//# sourceMappingURL=MessageButtonHelper.js.map