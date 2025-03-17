/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["../../i18n", "sap/m/Select", "sap/m/library", "sap/ui/core/Item", "sap/ui/model/BindingMode", "../../eventlogging/UserEvents"], function (__i18n, Select, sap_m_library, Item, BindingMode, ____eventlogging_UserEvents) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const i18n = _interopRequireDefault(__i18n);
  const SelectType = sap_m_library["SelectType"];
  const UserEventType = ____eventlogging_UserEvents["UserEventType"];
  /**
   * @namespace sap.esh.search.ui.controls
   */
  const SearchSelect = Select.extend("sap.esh.search.ui.controls.SearchSelect", {
    renderer: {
      apiVersion: 2
    },
    constructor: function _constructor(sId, settings) {
      Select.prototype.constructor.call(this, sId, settings);
      this.bindProperty("visible", {
        path: "/businessObjSearchEnabled"
      });
      this.setAutoAdjustWidth(true);
      this.bindItems({
        path: "/dataSources",
        template: new Item("", {
          key: "{id}",
          text: "{labelPlural}"
        })
      });
      this.bindProperty("selectedKey", {
        path: "/uiFilter/dataSource/id",
        mode: BindingMode.OneWay
      });
      this.bindProperty("tooltip", {
        parts: [{
          path: "/uiFilter/dataSource/labelPlural"
        }],
        formatter: labelPlural => {
          return i18n.getText("searchInPlaceholder", [labelPlural]);
        }
      });
      this.attachChange(() => {
        const item = this.getSelectedItem();
        const context = item.getBindingContext();
        const dataSource = context.getObject();
        const oModel = this.getModel();
        oModel.setDataSource(dataSource, false);
        oModel.abortSuggestions();
        oModel.eventLogger.logEvent({
          type: UserEventType.DROPDOWN_SELECT_DS,
          dataSourceKey: dataSource.id
        });
      });
      this.bindProperty("enabled", {
        parts: [{
          path: "/initializingObjSearch"
        }],
        formatter: initializingObjSearch => !initializingObjSearch
      });
      this.addStyleClass("searchSelect");
    },
    setDisplayMode: function _setDisplayMode(mode) {
      switch (mode) {
        case "icon":
          this.setType(SelectType.IconOnly);
          this.setIcon("sap-icon://slim-arrow-down");
          break;
        case "default":
          this.setType(SelectType.Default);
          break;
        default:
          break;
      }
    }
  });
  return SearchSelect;
});
})();