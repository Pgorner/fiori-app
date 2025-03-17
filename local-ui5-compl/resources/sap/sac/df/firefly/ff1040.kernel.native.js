/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
sap.ui.define(["sap/sac/df/firefly/ff1030.kernel.impl"],function(e){"use strict";e.KernelNativeModule=function(){e.DfModule.call(this);this._ff_c="KernelNativeModule"};e.KernelNativeModule.prototype=new e.DfModule;e.KernelNativeModule.s_module=null;e.KernelNativeModule.getInstance=function(){var t=e.KernelNativeModule;if(t.s_module===null){if(e.KernelImplModule.getInstance()===null){throw new Error("Initialization Exception")}t.s_module=e.DfModule.startExt(new e.KernelNativeModule);if(e.isXs()){e.RpcFunctionInaServerFactory.staticSetup()}if(!e.isXs()&&!e.isUi5()){e.NativeModuleLoader.staticSetup()}e.DfModule.stopExt(t.s_module)}return t.s_module};e.KernelNativeModule.prototype.getName=function(){return"ff1040.kernel.native"};e.KernelNativeModule.getInstance();return e});
//# sourceMappingURL=ff1040.kernel.native.js.map