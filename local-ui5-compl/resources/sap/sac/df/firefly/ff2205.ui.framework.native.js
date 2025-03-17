/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
sap.ui.define(["sap/sac/df/firefly/ff2200.ui"],function(e){"use strict";e.UiFrameworkNativeModule=function(){e.DfModule.call(this);this._ff_c="UiFrameworkNativeModule"};e.UiFrameworkNativeModule.prototype=new e.DfModule;e.UiFrameworkNativeModule.s_module=null;e.UiFrameworkNativeModule.getInstance=function(){if(e.UiFrameworkNativeModule.s_module===null){e.DfModule.checkInitialized(e.KernelNativeModule.getInstance());e.UiFrameworkNativeModule.s_module=e.DfModule.startExt(new e.UiFrameworkNativeModule);e.DfModule.stopExt(e.UiFrameworkNativeModule.s_module)}return e.UiFrameworkNativeModule.s_module};e.UiFrameworkNativeModule.prototype.getName=function(){return"ff2205.ui.framework.native"};e.UiFrameworkNativeModule.getInstance();return e});
//# sourceMappingURL=ff2205.ui.framework.native.js.map