/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
  [
    "jquery.sap.global",
    "sap/base/Log",
    "sap/m/Switch"
  ],
  function(jQuery, Log, Switch){
    "use strict";
    return Switch.extend(
      "com.sap.ip.bi.Switch",
      {
        metadata : {
          properties : {
            mode : {type: "string", defaultValue: "OnOff"},
          }
        },
        initDesignStudio: function() {
          var me = this;
          this.attachChange(function() {
            me.fireDesignStudioPropertiesChangedAndEvent(["state"], "onChange");
          });
        },
        setMode: function(mode) {
          var type;
          var onText;
          var offText;

          // For clarity, explicitly define for each mode
          if(mode==="Blank") {
            onText = " ";
            offText = " ";
            type = sap.m.SwitchType.Default;
          }
          else if(mode==="AcceptReject") {
            onText = "";
            offText = "";
            type = sap.m.SwitchType.AcceptReject;
          }
          else { // OnOff
            onText = "";
            offText = "";
            type = sap.m.SwitchType.Default;
          }
          this.setCustomTextOn(onText);
          this.setCustomTextOff(offText);
          this.setType(type);
          this.setProperty("mode", mode);
        },
        renderer: {},
      });
  }
);
