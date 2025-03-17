/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define(["./ajaxUtil"],function(t){"use strict";const e=t["addEncodedUrlParameters"];async function s(t){const s=require("node-fetch");const a=t.url.startsWith("https")?require("https"):require("http");const r=new a.Agent({rejectUnauthorized:false});const n={agent:r,headers:t.headers,method:t.method};if(typeof t.data!=="undefined"){n.body=t.data}const o=e(t.url,t.parameters);const u=t=>{const e={};for(const s in t){const a=t[s];if(a instanceof Array&&a.length===1){e[s]=a[0]}else{e[s]=a}}return e};try{const t=await s(o,n);const e=await t.text();return{status:t.status,statusText:t.statusText,data:e||"",headers:u(t.headers.raw())}}catch(t){return{status:0,statusText:""+t,data:"",headers:{}}}}var a={__esModule:true};a.requestNodeFetch=s;return a})})();
//# sourceMappingURL=requestNodeFetch.js.map