/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["jquery.sap.global","../Extension"],function(jQuery,e){"use strict";var t=e.extend("sap.ui.vtm.extensions.InitialViewExtension",{metadata:{interfaces:["sap.ui.vtm.interfaces.IInitialViewExtension"],properties:{predefinedView:{type:"sap.ui.vtm.PredefinedView"}}},constructor:function(t,i){e.apply(this,arguments)},initialize:function(e){var t=false;e.getScene().attachLoadCompleted(function(i){var n=e.getPanels();var a=i.getParameter("succeeded");if(!this.getEnabled()||!a||t||!n.length){return}t=true;var r=e.getExtensionByInterface("sap.ui.vtm.interfaces.IViewLinkingExtension");var s=r&&r.getEnabled();var o=this.getPredefinedView();var f=function(e){var t=e.getViewport();if(o){t.setPredefinedView(o)}else{t.zoomToAll(0)}};if(s){var c=e.getActivePanel()||n[0];f(c)}else{n.forEach(f)}}.bind(this))}});return t});
//# sourceMappingURL=InitialViewExtension.js.map