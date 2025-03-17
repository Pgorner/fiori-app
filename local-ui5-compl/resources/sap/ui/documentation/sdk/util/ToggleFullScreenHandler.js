/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([],function(){"use strict";var t={updateMode:function(t,e,i){var p=this._getSplitApp(i).getMode()==="ShowHideMode";if(p){this._getSplitApp(i).setMode("HideMode")}else{this._getSplitApp(i).setMode("ShowHideMode")}this.updateControl(t.getSource(),e,i,p)},_getSplitApp:function(t){if(!this._oSplitApp){this._oSplitApp=t.getSplitApp()}return this._oSplitApp},updateControl:function(t,e,i,p){if(arguments.length===3){p=!(this._getSplitApp(i).getMode()==="ShowHideMode")}if(!p){t.setTooltip("Show this sample in full screen mode");t.setIcon("sap-icon://full-screen")}else{t.setTooltip("Show this sample in the detail view of a split container.");t.setIcon("sap-icon://exit-full-screen")}},cleanUp:function(){this._oSplitApp=null}};return t},true);
//# sourceMappingURL=ToggleFullScreenHandler.js.map