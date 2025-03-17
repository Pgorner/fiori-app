/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";sap.ui.define(["sap/m/library","./BaseNewsItem"],function(t,e){"use strict";function r(t){return t&&t.__esModule&&typeof t.default!=="undefined"?t.default:t}const s=t["URLHelper"];const i=r(e);const n=i.extend("sap.cux.home.NewsItem",{metadata:{library:"sap.cux.home",properties:{url:{type:"string",group:"Misc",defaultValue:""}}},constructor:function t(e,r){i.prototype.constructor.call(this,e,r)},init:function t(){i.prototype.init.call(this);this._oTile.attachPress(this,this.pressNewsItem.bind(this))},setUrl:function t(e){this._oTile.setUrl(e);return this.setProperty("url",e,true)},getUrl:function t(){return this.getProperty("url")},pressNewsItem:function t(){s.redirect(this.getUrl(),true)}});return n});
//# sourceMappingURL=NewsItem-dbg.js.map