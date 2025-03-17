/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../sinaNexTS/sina/System"], function (___sinaNexTS_sina_System) {
  "use strict";

  const System = ___sinaNexTS_sina_System["System"];
  class FrontendSystem {
    static fioriFrontendSystemInfo;
    static getSystem() {
      if (typeof FrontendSystem.fioriFrontendSystemInfo === "undefined" && typeof window !== "undefined" && window.sap && window.sap.ushell && window.sap.ushell.Container) {
        FrontendSystem.fioriFrontendSystemInfo = new System({
          id: window.sap.ushell.Container.getLogonSystem().getName() + "." + window.sap.ushell.Container.getLogonSystem().getClient(),
          label: window.sap.ushell.Container.getLogonSystem().getName() + " " + window.sap.ushell.Container.getLogonSystem().getClient()
        });
      }
      return FrontendSystem.fioriFrontendSystemInfo;
    }
  }
  return FrontendSystem;
});
})();