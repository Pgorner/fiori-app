/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define(["sap/base/Log","sap/ui/core/Element"],function(e,t){"use strict";const a={isSearchFieldExpandedByDefault(){try{const e=t.getElementById("shell-header");if(!e||!e.isExtraLargeState){return false}const a=window.sap.ushell.Container.getRenderer("fiori2").getShellController();const n=a.getView();const r=(n.getViewData()?n.getViewData().config:{})||{};return r.openSearchAsDefault||e.isExtraLargeState()}catch(t){e.warning("Failed to determine default search field state",t);return false}}};return a})})();
//# sourceMappingURL=SearchShellHelperHorizonTheme.js.map