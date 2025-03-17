/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
sap.ui.define(["sap/sac/df/firefly/ff0210.io.native"],function(o){"use strict";o.IoExtModule=function(){};o.IoExtModule.prototype=new o.DfModule;o.IoExtModule.prototype._ff_c="IoExtModule";o.IoExtModule.s_module=null;o.IoExtModule.getInstance=function(){if(o.isNull(o.IoExtModule.s_module)){o.DfModule.checkInitialized(o.IoNativeModule.getInstance());o.IoExtModule.s_module=o.DfModule.startExt(new o.IoExtModule);o.DfModule.stopExt(o.IoExtModule.s_module)}return o.IoExtModule.s_module};o.IoExtModule.prototype.getName=function(){return"ff0230.io.ext"};o.IoExtModule.getInstance();return o});
//# sourceMappingURL=ff0230.io.ext.js.map