/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define(["./SearchFacetTabBarBase","./SearchFacetSimpleList"],function(t,e){"use strict";function n(t){return t&&t.__esModule&&typeof t.default!=="undefined"?t.default:t}const c=n(t);const o=n(e);const s=c.extend("sap.esh.search.ui.controls.SearchFacetTabBar",{renderer:{apiVersion:2},constructor:function t(e,n){c.prototype.constructor.call(this,e,n)},switchFacetType:function t(e){const n=this.getAggregation("items");for(const t of n){const n=t.getContent()[0];if(n instanceof o){n.switchFacetType(e)}}},getFacetType:function t(){const e=this.getAggregation("items");const n=e[0];const c=n.getContent()[0];return c.getProperty("facetType")},attachSelectionChange:function t(){}});return s})})();
//# sourceMappingURL=SearchFacetTabBar.js.map