/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define(["../../i18n","sap/esh/search/ui/SearchHelper","sap/m/Button","sap/ui/core/IconPool"],function(t,e,n,r){"use strict";function s(t){return t&&t.__esModule&&typeof t.default!=="undefined"?t.default:t}const o=s(t);const i=n.extend("sap.esh.search.ui.controls.SearchButton",{renderer:{apiVersion:2},constructor:function t(s,i){n.prototype.constructor.call(this,s,i);this.setIcon(r.getIconURI("search"));this.setTooltip(o.getText("search"));this.bindProperty("enabled",{parts:[{path:"/initializingObjSearch"}],formatter:function(t){return!e.isSearchAppActive()||!t}});this.addStyleClass("searchBtn")}});return i})})();
//# sourceMappingURL=SearchButton.js.map