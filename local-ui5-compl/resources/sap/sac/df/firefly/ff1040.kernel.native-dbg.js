/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap*/
sap.ui.define(
[
"sap/sac/df/firefly/ff1030.kernel.impl"
],
function(oFF)
{
"use strict";
/// <summary>Initializer for static constants.</summary>
oFF.KernelNativeModule = function()
{
       oFF.DfModule.call(this);
    this._ff_c = "KernelNativeModule";
};
oFF.KernelNativeModule.prototype = new oFF.DfModule();
oFF.KernelNativeModule.s_module = null;

oFF.KernelNativeModule.getInstance = function()
{
       var oNativeModule = oFF.KernelNativeModule;
    
    if (oNativeModule.s_module === null)
    {
        if ( oFF.KernelImplModule.getInstance() === null)
        {
            throw new Error("Initialization Exception");
        }

		oNativeModule.s_module = oFF.DfModule.startExt(new oFF.KernelNativeModule());

        if(oFF.isXs()){
            oFF.RpcFunctionInaServerFactory.staticSetup();
        }
        if(!oFF.isXs() && !oFF.isUi5()){
            oFF.NativeModuleLoader.staticSetup();
		}
        
        oFF.DfModule.stopExt(oNativeModule.s_module);
    }

    return oNativeModule.s_module;
};

oFF.KernelNativeModule.prototype.getName = function()
{
	return "ff1040.kernel.native";
};

oFF.KernelNativeModule.getInstance();


return oFF;
} );