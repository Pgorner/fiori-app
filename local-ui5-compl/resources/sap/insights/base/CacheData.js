/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/base/Object"],function(e){"use strict";var t={};var r={};var n=e.extend("sap.insights.base.CacheData",{});function i(e,t,r,n){if(!t){return new Error("Please provide valid card ID.")}if(e[t]&&r){e[t][r]=n}else{e[t]=n}return e[t]}n.prototype.getCacheResponse=function(e){if(e){return t[e]}return t};n.prototype.setCacheResponse=function(e,r,n){return i(t,e,r,n)};n.prototype.getTempPromise=function(e){if(e){return r[e]}return r};n.prototype.setTempPromise=function(e,t,n){return i(r,e,t,n)};n.prototype.clearCache=function(e){if(e){t[e]=r[e]={}}else{t=r={}}};var o;return{getInstance:function(){if(!o){o=new n}return o}}});
//# sourceMappingURL=CacheData.js.map