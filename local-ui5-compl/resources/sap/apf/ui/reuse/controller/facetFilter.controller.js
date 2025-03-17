/*!
* SAP APF Analysis Path Framework
* 
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
*/
sap.ui.define(["sap/apf/ui/utils/facetFilterListHandler","sap/m/FacetFilter","sap/ui/Device","sap/ui/core/mvc/Controller"],function(e,t,i,a){"use strict";function r(t){t.getView().byId("idAPFFacetFilter").removeAllLists();var i=t.getView().getViewData();var a=i.aConfiguredFilters;a.forEach(function(a){var r=new e(i.oCoreApi,i.oUiApi,a);t.getView().byId("idAPFFacetFilter").addList(r.createFacetFilterList())})}return a.extend("sap.apf.ui.reuse.controller.facetFilter",{onInit:function(){var e=this;if(i.system.desktop){e.getView().addStyleClass("sapUiSizeCompact")}r(e)},onResetPress:function(){var e=this;e.getView().getViewData().oStartFilterHandler.resetVisibleStartFilters();e.getView().getViewData().oUiApi.selectionChanged(true)}})});
//# sourceMappingURL=facetFilter.controller.js.map