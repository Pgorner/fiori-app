/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define([],function(){"use strict";function e(){const e=typeof window.InstallTrigger!=="undefined";const n=false||!!document.documentMode;const t=!n&&!!window.StyleMedia;const o=!!window.chrome&&!!window.chrome.webstore;const i=[];if(n||t){const e=window.navigator.browserLanguage||window.navigator.language;i.splice(0,0,this._getLanguageCountryObject(e))}else if(e||o){const e=window.navigator.language;const n=window.navigator.languages.slice();const t=n.indexOf(e);if(t>-1){n.splice(t,1)}i.splice(0,0,this._getLanguageCountryObject(e));for(let e=0;e<n.length;e++){const t=this._getLanguageCountryObject(n[e]);if(t){i.splice(i.length,0,t)}}}else{i.splice(0,0,this._getLanguageCountryObject(window.navigator.language))}return i}function n(e){let n;let t;if(e.length===2){n=e;t=""}else if(e.length===5&&e.indexOf("-")===2){n=e.substr(0,2);t=e.substr(3)}else{return undefined}return{Language:n,Country:t}}var t={__esModule:true};t.getLanguagePreferences=e;t._getLanguageCountryObject=n;return t})})();
//# sourceMappingURL=lang.js.map