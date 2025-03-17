/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define(["sap/ui/layout/VerticalLayout"],function(t){"use strict";const e=t.extend("sap.esh.search.ui.controls.SearchResultContainer",{renderer:{apiVersion:2},constructor:function e(s){t.prototype.constructor.call(this,s);this.data("sap-ui-fastnavgroup","true",true);this.addStyleClass("sapUshellSearchResultContainer");this.addStyleClass("sapElisaSearchResultContainer")},getNoResultScreen:function t(){return this.noResultScreen},setNoResultScreen:function t(e){this.noResultScreen=e}});return e})})();
//# sourceMappingURL=SearchResultContainer.js.map