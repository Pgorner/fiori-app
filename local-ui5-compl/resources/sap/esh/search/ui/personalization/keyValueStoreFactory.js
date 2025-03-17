/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define(["./BrowserPersonalizationStorage","./FLPPersonalizationStorage","./MemoryPersonalizationStorage"],function(e,r,t){"use strict";function n(e){return e&&e.__esModule&&typeof e.default!=="undefined"?e.default:e}const o=n(e);const a=n(r);const s=n(t);async function i(e,r,t){if(typeof e==="object"){return e}switch(e){case"auto":if(r){return a.create()}else{return o.create(t)}case"browser":return o.create(t);case"flp":return a.create();case"memory":return s.create();default:{let t=`    - 'auto' (automatic)\n    - 'browser' (browser storage)\n    - 'memory' (browser session storage)`;if(!r){t+=`\n    - 'flp' (Fiori Lauchpad, user storage service)`}const n=`Unknown Personalization Storage: '${e}'\n\nDetails:\n${t}\n\nYou can also provide a custom personalization storage (instance of a class, implementing the interface 'IKeyValueStore').`;return Promise.reject(new Error(n))}}}const c={create:i};return c})})();
//# sourceMappingURL=keyValueStoreFactory.js.map