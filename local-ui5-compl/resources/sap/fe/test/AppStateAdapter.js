/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.define(["sap/ui/thirdparty/jquery"],function(jQuery){"use strict";var e={};let t=function(){function t(){}e=t;var n=t.prototype;n.saveAppState=function e(t,n,a,o,r){const s=fetch("/sap/bc/appState",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({key:t,sessionKey:n,value:a,appName:o,component:r})});const c=jQuery.Deferred();s.then(async e=>e.json()).then(e=>{c.resolve(e)}).catch(e=>{c.reject(e)});return c.promise()};n.loadAppState=function e(t){const n=jQuery.Deferred();const a=fetch(`/sap/bc/appState/${t}`,{method:"GET"});a.then(async e=>e.json()).then(e=>{n.resolve(e.key,e.value)}).catch(e=>{n.reject(e)});return n.promise()};return t}();e=t;return e},false);
//# sourceMappingURL=AppStateAdapter.js.map