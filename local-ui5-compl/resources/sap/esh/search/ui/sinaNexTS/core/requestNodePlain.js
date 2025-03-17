/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define(["./ajaxUtil"],function(t){"use strict";const e=t["addEncodedUrlParameters"];function a(t){return new Promise(a=>{const s=t.url.startsWith("https")?require("https"):require("http");const r=e(t.url,t.parameters);const n=new URL(r);const d={rejectUnauthorized:false,hostname:n.hostname,path:n.pathname+n.search,port:n.port,method:t.method,headers:t.headers};if(t.data){d.headers["Content-Length"]=""+Buffer.byteLength(t.data)}const o=s.request(d,t=>{let e="";t.on("data",t=>{e+=t});t.on("end",()=>{a({status:t.statusCode,statusText:t.statusMessage,data:e,headers:t.headers})})});o.on("error",t=>{a({status:0,statusText:""+t,data:"",headers:{}})});if(t.data){o.write(t.data)}o.end()})}var s={__esModule:true};s.requestNodePlain=a;return s})})();
//# sourceMappingURL=requestNodePlain.js.map