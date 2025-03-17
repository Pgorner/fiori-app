/*
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap, Promise*/
sap.ui.define(
  "sap/sac/df/utils/ConfigLoader", [
    "sap/ui/model/json/JSONModel"
  ],
  function (JSONModel) {
    "use strict";


    function ConfigLoader() {
      this.loadConfigFromFile = function (sPath) {
        return new Promise((resolve) => {
          let oConfigFile = sap.ui.require.toUrl(sPath);
          const jsonTemplate = new JSONModel(oConfigFile);
          jsonTemplate.attachRequestCompleted(oEvent => {
            resolve(oEvent.getSource().getData());
          });
        });
      };
    }

    return new ConfigLoader();
  }
);
