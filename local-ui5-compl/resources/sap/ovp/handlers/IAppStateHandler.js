/*!
 * Copyright (c) 2009-2014 SAP SE, All Rights Reserved
 */
sap.ui.define(["sap/ovp/handlers/SmartFilterbarHandler","sap/ovp/handlers/MacroFilterbarHandler"],function(e,r){"use strict";return{getCurrentAppStatePromise:function(t,i){var n=i.oNavigationHandler;if(this.oAppStatePromise){this.rejectPreviousPromise&&this.rejectPreviousPromise("skip")}this.oAppStatePromise=new Promise(function(o,s){var a=i.getMacroFilterBar()?r:e;this.rejectPreviousPromise=s;return a.getFilterBarConfiguration(t,i).then(function(e){return n.storeInnerAppStateAsync(e,true).done(function(e){o(e)}).fail(function(e){s(e.getErrorCode())})})}.bind(this));return this.oAppStatePromise}}});
//# sourceMappingURL=IAppStateHandler.js.map