/*
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap*/
sap.ui.define(
  "sap/sac/df/types/export/XLSConfig",
  [
    "sap/ui/base/ManagedObject",
    "sap/sac/df/firefly/library"
  ],
  function (ManagedObject, FF) {
    "use strict";
    return ManagedObject.extend(
      "sap.sac.df.types.export.XLSConfig",
      {
        metadata: {
          properties: {
            autoFilterActive: {
              type: "boolean",
              defaultValue: true
            }
          }
        },
        getFireflyConfig: function (fileName) {
          var export_config = FF.XlsConfig.createDefault(FF.PrFactory.createStructure(), fileName);
          export_config.setAutoFilterActive(this.getAutoFilterActive());
          return export_config;
        }
      }
    );
  }
);
