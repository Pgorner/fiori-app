/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define([],function(){"use strict";function n(n){const e=[];for(const t in n){const o=n[t];e.push(encodeURIComponent(t)+"="+encodeURIComponent(o+""))}return e.join("&")}function e(e,t){if(!t){return e}const o=n(t);if(o.length>0){const n=e.indexOf("?");if(n>=0){e=e.slice(0,n)+"?"+o+"&"+e.slice(n+1)}else{e+="?"+o}}return e}function t(n){const e={};const t=n.split("\n");for(let n=0;n<t.length;++n){const o=t[n];const r=o.indexOf(":");if(r>=0){const n=o.slice(0,r).toLowerCase();const t=o.slice(r+1);e[n]=t.trim()}}return e}function o(n){for(const e in n){if(typeof n[e]!=="boolean"&&typeof n[e]!=="string"&&typeof n[e]!=="number"){return false}}return true}var r={__esModule:true};r.encodeUrlParameters=n;r.addEncodedUrlParameters=e;r.parseHeaders=t;r.isNumberStringBooleanRecord=o;return r})})();
//# sourceMappingURL=ajaxUtil.js.map