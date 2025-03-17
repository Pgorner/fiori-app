/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap*/
sap.ui.define(
[
"sap/sac/df/firefly/ff0210.io.native"
],
function(oFF)
{
"use strict";

oFF.IoExtModule = function() {};
oFF.IoExtModule.prototype = new oFF.DfModule();
oFF.IoExtModule.prototype._ff_c = "IoExtModule";

oFF.IoExtModule.s_module = null;
oFF.IoExtModule.getInstance = function()
{
	if (oFF.isNull(oFF.IoExtModule.s_module))
	{
		oFF.DfModule.checkInitialized(oFF.IoNativeModule.getInstance());
		oFF.IoExtModule.s_module = oFF.DfModule.startExt(new oFF.IoExtModule());
		oFF.DfModule.stopExt(oFF.IoExtModule.s_module);
	}
	return oFF.IoExtModule.s_module;
};
oFF.IoExtModule.prototype.getName = function()
{
	return "ff0230.io.ext";
};

oFF.IoExtModule.getInstance();

return oFF;
} );