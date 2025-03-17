/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap*/
sap.ui.define(
[
"sap/sac/df/firefly/ff2200.ui"
],
function(oFF)
{
"use strict";
/// <summary>Initializer for static constants.</summary>
oFF.UiFrameworkNativeModule = function() {
   oFF.DfModule.call(this);
  this._ff_c = "UiFrameworkNativeModule";
};

oFF.UiFrameworkNativeModule.prototype = new oFF.DfModule();
oFF.UiFrameworkNativeModule.s_module = null;

oFF.UiFrameworkNativeModule.getInstance = function() {
  if (oFF.UiFrameworkNativeModule.s_module === null) {
    oFF.DfModule.checkInitialized(oFF.KernelNativeModule.getInstance());

    oFF.UiFrameworkNativeModule.s_module = oFF.DfModule.startExt(new oFF.UiFrameworkNativeModule());

    //stuff to init

    oFF.DfModule.stopExt(oFF.UiFrameworkNativeModule.s_module);
  }

  return oFF.UiFrameworkNativeModule.s_module;
};

oFF.UiFrameworkNativeModule.prototype.getName = function() {
  return "ff2205.ui.framework.native";
};

oFF.UiFrameworkNativeModule.getInstance();


return oFF;
} );