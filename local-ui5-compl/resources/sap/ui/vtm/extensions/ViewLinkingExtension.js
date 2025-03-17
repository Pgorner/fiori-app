/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["jquery.sap.global","sap/ui/core/Control","../Extension"],function(jQuery,t,i){"use strict";var e=i.extend("sap.ui.vtm.extensions.ViewLinkingExtension",{metadata:{interfaces:["sap.ui.vtm.interfaces.IViewLinkingExtension"]},constructor:function(t,e){i.apply(this,arguments)},initialize:function(){this._skipCount=new Map;this.applyPanelHandler(function(t){var i=t.getViewport();i.attachEvent("frameRenderingFinished",function(i){if(!this.getEnabled()){return}var e=this._getPrimaryPanel();if(i.getSource()!=e.getViewport()){return}this._updateViews(t)}.bind(this))}.bind(this));this.attachEnabledChanged(function(t){if(this.getEnabled()){var i=this._getPrimaryPanel();if(i){this._updateViews(i)}}}.bind(this))},_getPrimaryPanel:function(){var t=this._vtm.getPanels();if(!t||!t.length){return null}return this._vtm.getActivePanel()||t[0]},_updateViews:function(t){var i=t.getViewport();if(!i.getInitialized()){return}var e=i.getCameraInfo();var n=this._vtm.getPanels();n.forEach(function(i){if(i!==t){var n=i.getViewport();if(n.getInitialized()){n.setCameraInfo(e)}}})}});return e});
//# sourceMappingURL=ViewLinkingExtension.js.map