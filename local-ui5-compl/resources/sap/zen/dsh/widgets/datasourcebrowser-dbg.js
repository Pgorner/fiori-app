/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
  [
    "jquery.sap.global",
    "sap/base/Log",
    "sap/ui/core/mvc/XMLView",
    "sap/ui/table/Table",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/resource/ResourceModel",
    "sap/zen/dsh/utils/BaseHandler"
  ],
  function(
    jQuery, Log, XMLView, Table, JSONModel,ResourceModel, BaseHandler
  ){
    "use strict";
    XMLView.extend(
      "com.sap.ip.bi.DataSourceBrowser",
      {
        initDesignStudio : function() {
        },
        renderer : {},
        constructor : function(id, mSettings) {
          this.controlProperties = mSettings.dsControlProperties;
          jQuery.sap.registerModulePath(
            "dsb",
            "zen.res/zen.rt.components.ui5/datasourcebrowser/js"
          );
          if (BaseHandler.dispatcher.isMainMode()) {
            XMLView.call(this, id, {
              viewName : "dsb.dsb_m",
              type : sap.ui.core.mvc.ViewType.JSON
            });
          } else {
            XMLView.call(this, id, {
              viewName : "dsb.dsb",
              type : sap.ui.core.mvc.ViewType.JSON
            });
          }
          return this;
        }
      }
    );
  }
);
