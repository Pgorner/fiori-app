/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([],function(){"use strict";var e={};var t={fetch:function(t,r,n){if(!(t in e)||n){e[t]=this._fetch(t,r)}return e[t]},_fetch:function(e,r){return new Promise(function(n,s){var o,u,i=this._getExpectedResponseType(e,r);function f(r){u=r.type==="load"&&(o.status===200||o.status===0);if(!u){s(new Error("could not fetch '"+e+"': "+o.status));return}n(t._readResponse(o))}o=new XMLHttpRequest;o.open("GET",e,true);o.responseType=i;o.onload=o.onerror=f;o.send()}.bind(this))},_readResponse:function(e){var t=e.responseType,r=t==="text"?e.responseText:e.response;if(t==="arraybuffer"){r=new Uint8Array(r)}return r},_getExpectedResponseType:function(e,t){if(e.match(/.+(.js|.ts|.json|.less|.xml|.html|.properties|.css|.svg|.md|.txt|.feature|.yaml|.yml)$/i)||t){return"text"}return"arraybuffer"}};return t},true);
//# sourceMappingURL=ResourceDownloadUtil.js.map