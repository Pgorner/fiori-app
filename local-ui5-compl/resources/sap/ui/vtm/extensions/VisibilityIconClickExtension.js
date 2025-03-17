/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["jquery.sap.global","sap/ui/core/Control","../Extension"],function(jQuery,i,t){"use strict";var e=t.extend("sap.ui.vtm.extensions.VisibilityIconClickExtension",{metadata:{interfaces:["sap.ui.vtm.interfaces.IVisibilityIconClickExtension","sap.ui.vtm.interfaces.IVisibilityHeaderIconClickExtension"]},constructor:function(i,e){t.apply(this,arguments)},initialize:function(){this.applyPanelHandler(function(i){var t=i.getTree();var e=i.getViewport();t.attachVisibilityIconClicked(function(i){if(!this.getEnabled()){return}var n=i.getParameter("item");var a=i.getParameter("visibility");var r=!a;var s=i.getParameter("control");s.setVisibility(r);this._onTreeItemVisibilityClicked(t,e,n,r)}.bind(this));t.attachVisibilityHeaderIconClicked(function(i){if(!this.getEnabled()){return}var e=i.getParameter("visibility");var n=!e;var a=i.getParameter("control");a.setVisibility(n);t.setVisibility(t.getRootItems(),n,true)}.bind(this))}.bind(this))},_onTreeItemVisibilityClicked:function(i,t,e,n){var a=i.getSelectedItems();var r=a&&a.indexOf(e)>=0;if(!r){a=[e]}i.setVisibility(a,n,true)}});return e});
//# sourceMappingURL=VisibilityIconClickExtension.js.map