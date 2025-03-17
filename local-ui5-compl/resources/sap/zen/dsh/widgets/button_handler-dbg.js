/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
  [
    "jquery.sap.global",
    "sap/zen/dsh/utils/BaseHandler"
  ],
  function(jQuery,BaseHandler){
    "use strict";
    var ButtonHandler = function() {
      BaseHandler.apply(this, arguments);
      var dispatcher = BaseHandler.dispatcher;
      var init = function(oButton, oControlProperties) {
        var text = dispatcher.getValue(oControlProperties, "caption");
        var tooltip = oControlProperties.tooltip;
        var image = oControlProperties.image;
        oButton.setText(text);
        oButton.setTooltip(tooltip);
        oButton.setEnabled(oControlProperties.enabled);
        if (BaseHandler.dispatcher.isMainMode()) {
          var buttonType = oControlProperties.buttontype || "Default";
          oButton.setType(buttonType);

        }
        if (image && image.length > 0) {
          oButton.setIcon(image);
          if(oControlProperties.iconfirst){
            oButton.setIconFirst(true);
          }  else {
            oButton.setIconFirst(false);
          }
        } else {
          oButton.setIcon(null);
        }
      };
      this.create = function(oChainedControl, oControlProperties) {
        var id = oControlProperties["id"];
        var oButton = this.createButtonWithHeight(id);
        init(oButton, oControlProperties);
        if (oControlProperties.onclick) {
          oButton.attachPress(function () {
            new Function(oControlProperties.onclick)();
          });
        }
        return oButton;
      };

      this.update = function(oControl, oControlProperties) {
        if (oControlProperties) {
          init(oControl, oControlProperties);
        }
      };
      this.getType = function() {
        return "button";
      };
    };
    var instance = new ButtonHandler();
    BaseHandler.dispatcher.addHandlers("button", instance);
    return instance;
  }
);
