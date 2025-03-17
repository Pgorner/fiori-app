/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
  [
    "jquery.sap.global",
    "sap/base/Log",
    "sap/m/TextArea"
  ],
  function(jQuery, Log, TextArea){
    "use strict";
    return TextArea.extend(
      "com.sap.ip.bi.TextArea",
      {
        initDesignStudio: function() {
          var that = this;
          that.attachChange(function() {
            that.fireDesignStudioPropertiesChangedAndEvent(["value"], "onChange");
          });
          this.setWrapping("Soft");
          this.addStyleClass("zenTextArea");
        },
        setValue: function(value) {
          TextArea.prototype.setValue.call(this, value);
          this.fireDesignStudioPropertiesChanged(["value"]);
        },
        renderer: {},
      }
    );
  }
);
