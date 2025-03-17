/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define(["./ajaxUtil"],function(e){"use strict";const t=e["addEncodedUrlParameters"];const s=e["parseHeaders"];async function n(e){return new Promise(function(n){const r=new XMLHttpRequest;r.onreadystatechange=function(){if(r.readyState==4){n({data:r.responseText,headers:s(r.getAllResponseHeaders()),status:r.status,statusText:r.statusText});return}};const a=t(e.url,e.parameters);r.open(e.method,a,true);for(const t in e.headers){const s=e.headers[t];r.setRequestHeader(t,s)}r.send(e.data)})}var r={__esModule:true};r.requestBrowser=n;return r})})();
//# sourceMappingURL=requestBrowser.js.map