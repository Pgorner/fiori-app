/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";sap.ui.define(["sap/ushell/Container","./BaseApp"],function(e,t){"use strict";function n(e){return e&&e.__esModule&&typeof e.default!=="undefined"?e.default:e}const r=n(t);const u=r.extend("sap.cux.home.App",{metadata:{library:"sap.cux.home",properties:{url:{type:"string",group:"Misc",defaultValue:""},vizId:{type:"string",group:"Misc",defaultValue:""}}},constructor:function e(t,n){r.prototype.constructor.call(this,t,n)},_launchApp:function t(){try{const t=this;return Promise.resolve(e.getServiceAsync("SpaceContent")).then(function(e){return Promise.resolve(e.launchTileTarget(t.getUrl(),t.getTitle())).then(function(){})})}catch(e){return Promise.reject(e)}},_handlePress:function e(){if(this.getUrl()){void this._launchApp()}}});return u});
//# sourceMappingURL=App-dbg.js.map