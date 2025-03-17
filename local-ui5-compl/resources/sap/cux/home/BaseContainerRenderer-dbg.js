/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";sap.ui.define(["./library"],function(e){"use strict";const t=e["LayoutType"];var n={apiVersion:2,render:function(e,n){e.openStart("div",n).class("sapCuxBaseContainer");if(n.getProperty("layout")===t.SideBySide){e.class("sapCuxSideBySide")}else if(n.getProperty("layout")===t.Horizontal){e.class("sapCuxHorizontal")}else{e.class("sapCuxVertical")}e.style("width",n.getWidth());e.style("height",n.getHeight());e.openEnd();this.renderContent(e,n);e.close("div")},renderContent:function(e,t){if(t.getContent()?.length>0){e.openStart("div",t.getId()+"-header").class("sapUiBaseContainerHeader").openEnd();e.renderControl(t._getHeader());e.close("div");e.openStart("div",t.getId()+"-content").class("sapUiBaseContainerContent").openEnd();e.renderControl(t._getInnerControl());e.close("div")}}};return n});
//# sourceMappingURL=BaseContainerRenderer-dbg.js.map