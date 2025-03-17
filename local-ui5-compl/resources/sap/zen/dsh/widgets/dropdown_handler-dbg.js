/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
  [
    "jquery.sap.global",
    "sap/zen/dsh/utils/BaseHandler",
    "sap/ui/core/ListItem",
    "sap/m/Select",
    "sap/ui/commons/DropdownBox"
  ],
  function(jQuery, BaseHandler, ListItem) {
    "use strict";
    var DropDownListBoxHandler = function() {
      BaseHandler.apply(this, arguments);
      var dispatcher = BaseHandler.dispatcher;
      this.create = function(oChainedControl, oControlProperties) {
        var id = oControlProperties["id"];
        var oCombo = this.createDefaultProxy(id);
        var that = this;
        oCombo.setMaxHistoryItems(0);
        init(oCombo, oControlProperties);
        oCombo.attachChange(function(oControlEvent) {
          var key = null;
          var oItem = oControlEvent.getParameter("selectedItem");
          if(oItem){
            key = oItem.getKey();
            key += "|SeP|";
          }
          if (key !== null) {
            var command = that.prepareCommand(oControlProperties.command,"__KEYS__", key);
            eval(command);
          }
        });
        return oCombo;
      };
      this.update = function(oCombo, oControlProperties) {
        if (oControlProperties) {
          init(oCombo, oControlProperties);
        }
        return oCombo;
      };
      function init(oCombo, oControlProperties) {
        oCombo.removeAllItems();
        oCombo.setTooltip(oControlProperties.tooltip);
        oCombo.setEnabled(oControlProperties.enabled);
        var selectedItems = oControlProperties.selectedItems;
        var selectedItemKey = null;
        if (selectedItems && selectedItems[0]) {
          selectedItemKey = dispatcher.getValue(selectedItems[0], "key");
        }
        var items = oControlProperties.items;
        for ( var i = 0; i < items.length; i++) {
          var item = items[i];
          var key = item.item.key;
          var text = item.item.val_0;
          var oItem = new ListItem(i);
          oItem.setKey(key);
          if (text.length === 0) {
            text = key;
          }
          oItem.setText(text);
          oCombo.addItem(oItem);
          if (key === selectedItemKey) {
            oCombo.setSelectedKey(key);
          }
        }
      }
      this.getDefaultProxyClass = function(){
        return ["sap.m.Select", "sap.ui.commons.DropdownBox"];
      };
      this.provideFunctionMapping = function(){
        return [[null,"setMaxHistoryItems"]];
      };
      this.getDecorator = function() {
        return "DataSourceFixedHeightDecorator";
      };
      this.getType = function() {
        return "dropdown";
      };
    };
    var instance = new DropDownListBoxHandler();
    BaseHandler.dispatcher.addHandlers(instance.getType(), instance);
    return instance;
  }
);
