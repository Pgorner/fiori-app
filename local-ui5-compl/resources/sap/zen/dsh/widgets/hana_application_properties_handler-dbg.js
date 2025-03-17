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
  function(jQuery, BaseHandler){
    sap.zen.Application_properties = function () {
      "use strict";
      BaseHandler.apply(this, arguments);
      this.createAndAdd = function (oChainedControl, oControlProperties) {
        var customcss = oControlProperties.customCss;
        if(customcss) {
          if(document.createStyleSheet) {
            document.createStyleSheet(customcss);
          } else {
            jQuery("head").append(
              jQuery(
                "<link rel='stylesheet' href='"+customcss+"' type='text/css' media='screen' />")
            );
          }
        }
        return null;
      };
      this.updateComponent = function () {
        return null;
      };
      this.getType = function(){
        return "application_properties";
      };
    };
    var instance = new sap.zen.Application_properties();
    BaseHandler.dispatcher.addHandlers(instance.getType(), instance, "Decorator");
    return instance;
  }
);
