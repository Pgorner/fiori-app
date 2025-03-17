/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2012 SAP AG. All rights reserved
 */
sap.ui.define(["./library","sap/ui/core/Control","./ContainerContentRenderer"],function(t,e,n){"use strict";var i=e.extend("sap.ui.vbm.ContainerContent",{metadata:{library:"sap.ui.vbm",properties:{icon:{type:"string",group:"Misc",defaultValue:null},title:{type:"string",group:"Misc",defaultValue:null}},aggregations:{content:{type:"sap.ui.core.Control",multiple:false}},renderer:n}});i.prototype.setContent=function(t){if(t instanceof sap.ui.vbm.GeoMap){t.setNavcontrolVisible(false);t.setWidth("100%");t.setHeight("100%")}this.setAggregation("content",t);return this};return i});
//# sourceMappingURL=ContainerContent.js.map