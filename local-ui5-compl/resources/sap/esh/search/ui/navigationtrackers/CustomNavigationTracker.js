/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define(["../error/errors"],function(e){"use strict";function n(e){return e&&e.__esModule&&typeof e.default!=="undefined"?e.default:e}const t=n(e);function o(e){return n=>{try{e.config.beforeNavigation(e)}catch(n){const o=new t.ConfigurationExitError("beforeNavigation",e.config.applicationComponent,n);throw o}}}var r={__esModule:true};r.generateCustomNavigationTracker=o;return r})})();
//# sourceMappingURL=CustomNavigationTracker.js.map