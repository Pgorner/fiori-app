/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log"],function(e){"use strict";e.info("Load CssPlugin");function t(){}var n=function(){return document.head||document.getElementsByTagName("head")[0]||document.documentElement};t.prototype.normalize=function(e,t){if(!/\.css$/.test(e)){e=e+".css"}return t(e)};t.prototype.load=function(e,t,o){var r=t.toUrl?t.toUrl(e):e;var i=document.createElement("link");i.type="text/css";i.rel="stylesheet";i.href=r;i.onload=function(){o(this.sheet);this.onerror=this.onload=null};i.onerror=function(){o.error(new Error("Failed to load "+this.href));this.onerror=this.onload=null};n().appendChild(i)};t.prototype.pluginBuilder="cssBuilder";return t});
//# sourceMappingURL=CssPlugin.js.map