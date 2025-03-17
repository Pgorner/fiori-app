/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./MdcFieldBuilder","sap/fe/test/Utils"],function(t,e){"use strict";var o=function(){return t.apply(this,arguments)};o.create=function(t){return new o(t)};o.prototype=Object.create(t.prototype);o.prototype.constructor=o;o.prototype.hasValue=function(e,o){return t.prototype.hasConditionValues.apply(this,arguments)};o.prototype.doChangeValue=function(e,o){if(o){this.do(function(t){t.setConditions([])})}return t.prototype.doChangeValue.call(this,e)};o.Matchers={};o.Actions={};return o});
//# sourceMappingURL=MdcFilterFieldBuilder.js.map