/*!
 * Copyright (c) 2009-2023 SAP SE, All Rights Reserved
 */
sap.ui.define([],function(){"use strict";const e={getAppLifeCycleService:function(){const n=e.getContainer();return n.getServiceAsync("AppLifeCycle").catch(function(e){const n="Error getting AppLifeCycle service from ushell container: "+e;throw new Error(n)})},getContainer:function(){const e=sap.ui.require("sap/ushell/Container");if(!e){throw new Error("Illegal state: shell container not available; this component must be executed in a unified shell runtime context.")}return e},getCurrentRunningApplication:function(){return e.getAppLifeCycleService().then(function(e){return e.getCurrentApplication()})}};return e});
//# sourceMappingURL=AppLifeCycleUtils.js.map