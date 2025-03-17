/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 * POC
 */
sap.ui.define(["sap/ui/base/Object"],function(n){"use strict";var e=n.extend("sap.insights.channels.ContextChannel",{constructor:function(){this.providers=[]},init:function(){return new Promise(function(n,e){const t=sap.ui.require("sap/ushell/Container");if(t){t.getServiceAsync("MessageBroker").then(function(e){this.broker=e;n(this)}.bind(this))}else{e("S/CUBE is not yet supported")}}.bind(this))},registerProvider:function(n){this.providers.push(n)},unregisterProvider:function(n){const e=this.providers.indexOf(n);this.providers.splice(e,1)},getContext:function(){if(this.providers.length>0){const n=this.providers[this.providers.length-1].getContext();return n.then(function(n){return this.withAppInfo(n)}.bind(this))}else{return this.withAppInfo({})}},withAppInfo:function(n){return this.getAppInfo().then(function(e){if(e&&n){n["nw.core.flp.shell"]={appInfo:e}}return n}).catch(function(){return n})},getAppInfo:function(){return new Promise(function(n){const e=sap.ui.require("sap/ushell/Container");if(e){e.getServiceAsync("AppLifeCycle").then(function(n){if(n&&n.getCurrentApplication){return n.getCurrentApplication().getAllAppInfo()}return undefined}).then(function(e){n(e)}).catch(function(){n()})}else{n()}})}});var t;return{getInstance:function(){if(!t){t=new e;return t.init()}else{return Promise.resolve(t)}}}});
//# sourceMappingURL=ContextChannel.js.map