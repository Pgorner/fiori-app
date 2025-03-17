/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["./BaseDiamond"],function(e){"use strict";var t=e.extend("sap.gantt.simple.AdhocDiamond",{metadata:{events:{press:{},mouseEnter:{},mouseLeave:{}}},renderer:{apiVersion:2}});t.prototype.onclick=function(e){this.firePress(e)};t.prototype.onmouseover=function(e){this.fireMouseEnter(e)};t.prototype.onmouseout=function(e){this.fireMouseLeave(e)};t.prototype.renderElement=function(t,o){e.prototype.renderElement.apply(this,arguments)};return t},true);
//# sourceMappingURL=AdhocDiamond.js.map