/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
  [
    "jquery.sap.global",
    "sap/base/Log",
    "sap/sac/df/thirdparty/lodash",
    "sap/zen/dsh/utils/BaseHandler",
    "sap/zen/dsh/widgets/sdk_handler",
    "sap/zen/dsh/widgets/sdkcontrol"
  ],
  function(jQuery, Log, _, BaseHandler,sdkHandler, SdkControl){
    "use strict";
    var DatasourceHandler = function() {
      sdkHandler.getClass().apply(this, arguments);

      this.create = function(oChainedControl, oControlProperties, oComponentProperties) {
        var id = oControlProperties["id"];
        var oControl = new SdkControl(id);
        oControl.storeProperties(oControlProperties, oComponentProperties);
        oControl.widget.init();
        oControl.widget.dispatchProperties(oControlProperties, oComponentProperties);
        return oControl;
      };
      this.getType = function() {
        return "sdkdatasource";
      };
    };
    var instance = new DatasourceHandler();
    BaseHandler.dispatcher.addHandlers(instance.getType(), instance);
    return instance;
  }
);
