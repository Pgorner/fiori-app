/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2014 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.ca.ui.PictureViewerItem");jQuery.sap.require("sap.ca.ui.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.ca.ui.PictureViewerItem",{metadata:{deprecated:true,library:"sap.ca.ui",properties:{src:{type:"string",group:"Misc",defaultValue:null}},aggregations:{image:{type:"sap.m.Image",multiple:false}}}});sap.ca.ui.PictureViewerItem.prototype.setSrc=function(e){this.setProperty("src",e);var r=this.getImage();if(r==null){r=new sap.m.Image}r.setSrc(e);this.setImage(r);return this};sap.ca.ui.PictureViewerItem.prototype.exit=function(){var e=this.getImage();if(e){e.destroy()}};
//# sourceMappingURL=PictureViewerItem.js.map