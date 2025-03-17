/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/thirdparty/jquery","sap/ui/Device"],function(jQuery,e){"use strict";var t={};var n={xPosOfEvent:function(t){return e.browser.edge?t.clientX:t.pageX},xPosOfSvgElement:function(e,t){return this.xPosOfEvent(e)-(t.offset().left||e.offsetX)},getEventSVGPoint:function(e,t){var n=e.createSVGPoint();n.x=this.xPosOfEvent(t);n.y=t.pageY||t.clientY;n=n.matrixTransform(e.getScreenCTM().inverse());n.svgId=e.id;return n},getSvgScreenPoint:function(e,t){var n=e.createSVGPoint();n.x=this.xPosOfEvent(t);n.y=t.pageY||t.clientY;n=n.matrixTransform(e.getScreenCTM());n.svgId=e.id;return n},getEventPosition:function(e){return{pageX:this.xPosOfEvent(e),pageY:e.pageY}},updateCursorPosition:function(e){t={pageX:e.pageX,pageY:e.pageY,clientX:e.clientX,clientY:e.clientY}},getLatestCursorPosition:function(){return t},getCursorElement:function(){var e=document.elementFromPoint(t.clientX,t.clientY);return jQuery(e).control(0)}};return n},true);
//# sourceMappingURL=CoordinateUtils.js.map