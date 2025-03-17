/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["jquery.sap.global","sap/ui/core/Element","sap/ui/vk/ContentResource"],function(jQuery,t,e){"use strict";var i=t.extend("sap.ui.vtm.Viewable",{metadata:{properties:{source:{type:"any"},name:{type:"string"},rootNodeIds:{type:"string[]"},relativeMatrix:{type:"sap.ui.vtm.Matrix"}}},init:function(){this._vkContentResource=new sap.ui.vk.ContentResource({sourceId:this.getId(),sourceType:"vds"});this.setRelativeMatrix(sap.ui.vtm.MatrixUtilities.createIdentity())},getSourceId:function(){return this.getId()},setSource:function(t){this.setProperty("source",t);this._vkContentResource.setSource(t);return this},setName:function(t){this.setProperty("name",t);this._vkContentResource.setName(t);return this},setRelativeMatrix:function(t){this.setProperty("relativeMatrix",t);this._vkContentResource.setLocalMatrix(sap.ui.vtm.MatrixUtilities.toVkMatrix(t))},_getContentResource:function(){return this._vkContentResource},getSourceString:function(){var t=this.getSource();return typeof t==="string"?t:t.name}});return i});
//# sourceMappingURL=Viewable.js.map