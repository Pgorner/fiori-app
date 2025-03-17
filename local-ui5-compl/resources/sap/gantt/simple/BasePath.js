/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["./BaseShape","./RenderUtils","./BaseText"],function(e,t,r){"use strict";var n=e.extend("sap.gantt.simple.BasePath",{metadata:{library:"sap.gantt",properties:{d:{type:"string"}}},renderer:{apiVersion:2}});var a=["d","fill","stroke-dasharray","transform","style","opacity"];n.prototype.renderElement=function(e,n){this.writeElementData(e,"path",true);if(this.aCustomStyleClasses){this.aCustomStyleClasses.forEach(function(t){e.class(t)})}t.renderAttributes(e,n,a);e.attr("shape-rendering","crispedges");e.openEnd();t.renderTooltip(e,n);if(this.getShowAnimation()){t.renderElementAnimation(e,n)}e.close("path");t.renderElementTitle(e,n,function(e){return new r(e)})};return n},true);
//# sourceMappingURL=BasePath.js.map