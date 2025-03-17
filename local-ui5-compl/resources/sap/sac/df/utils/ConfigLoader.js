/*
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
sap.ui.define("sap/sac/df/utils/ConfigLoader",["sap/ui/model/json/JSONModel"],function(e){"use strict";function t(){this.loadConfigFromFile=function(t){return new Promise(n=>{let o=sap.ui.require.toUrl(t);const i=new e(o);i.attachRequestCompleted(e=>{n(e.getSource().getData())})})}}return new t});
//# sourceMappingURL=ConfigLoader.js.map