/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["../SearchFacetDialogModel", "./facets/SearchFacetDialog", "../eventlogging/UserEvents"], function (__SearchFacetDialogModel, __SearchFacetDialog, ___eventlogging_UserEvents) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const SearchFacetDialogModel = _interopRequireDefault(__SearchFacetDialogModel);
  const SearchFacetDialog = _interopRequireDefault(__SearchFacetDialog);
  const UserEventType = ___eventlogging_UserEvents["UserEventType"];
  async function openShowMoreDialog(options) {
    const oSearchFacetDialogModel = new SearchFacetDialogModel({
      searchModel: options.searchModel
    });
    await oSearchFacetDialogModel.initAsync();
    oSearchFacetDialogModel.setData(options.searchModel.getData());
    oSearchFacetDialogModel.config = options.searchModel.config;
    oSearchFacetDialogModel.sinaNext = options.searchModel.sinaNext;
    oSearchFacetDialogModel.prepareFacetList();
    const searchFacetDialogSettings = {
      selectedAttribute: options.dimension,
      selectedTabBarIndex: options.selectedTabBarIndex,
      tabBarItems: options.tabBarItems
    };
    const oDialog = new SearchFacetDialog(`${options.searchModel.config.id}-SearchFacetDialog`, searchFacetDialogSettings);
    oDialog.setModel(oSearchFacetDialogModel);
    oDialog.setModel(options.searchModel, "searchModel");
    // reference to page, so dialog can be destroy in onExit()
    const compositeControl = options.searchModel.getSearchCompositeControlInstanceByChildControl(options.sourceControl);
    if (compositeControl) {
      compositeControl["oFacetDialog"] = oDialog;
    }
    oDialog.open();
    options.searchModel.eventLogger.logEvent({
      type: UserEventType.FACET_SHOW_MORE,
      referencedAttribute: options.dimension
    });
  }
  var __exports = {
    __esModule: true
  };
  __exports.openShowMoreDialog = openShowMoreDialog;
  return __exports;
});
})();