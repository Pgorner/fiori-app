/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../sinaNexTS/sina/System"],function(e){"use strict";const n=e["System"];class t{static fioriFrontendSystemInfo;static getSystem(){if(typeof t.fioriFrontendSystemInfo==="undefined"&&typeof window!=="undefined"&&window.sap&&window.sap.ushell&&window.sap.ushell.Container){t.fioriFrontendSystemInfo=new n({id:window.sap.ushell.Container.getLogonSystem().getName()+"."+window.sap.ushell.Container.getLogonSystem().getClient(),label:window.sap.ushell.Container.getLogonSystem().getName()+" "+window.sap.ushell.Container.getLogonSystem().getClient()})}return t.fioriFrontendSystemInfo}}return t})})();
//# sourceMappingURL=FrontendSystem.js.map