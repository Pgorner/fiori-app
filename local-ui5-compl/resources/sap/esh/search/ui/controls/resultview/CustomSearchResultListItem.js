/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define(["./SearchResultListItem"],function(t){"use strict";function e(t){return t&&t.__esModule&&typeof t.default!=="undefined"?t.default:t}const r=e(t);const n=r.extend("sap.esh.search.ui.controls.CustomSearchResultListItem",{renderer:{apiVersion:2},metadata:{properties:{content:{type:"sap.esh.search.ui.controls.CustomSearchResultListItemContent"}}},constructor:function t(e,n){r.prototype.constructor.call(this,e,n)},setupCustomContentControl:function t(){const e=this.getProperty("content");e.setTitle(this.getProperty("title"));e.setTitleUrl(this.getProperty("titleUrl"));e.setType(this.getProperty("type"));e.setImageUrl(this.getProperty("imageUrl"));e.setAttributes(this.getProperty("attributes"))},renderer:function t(e,n){n.setupCustomContentControl();r.prototype.getRenderer.call(this).render(arguments)},onAfterRendering:function t(){r.prototype.onAfterRendering.call(this);this.getProperty("content").getTitleVisibility()}});return n})})();
//# sourceMappingURL=CustomSearchResultListItem.js.map