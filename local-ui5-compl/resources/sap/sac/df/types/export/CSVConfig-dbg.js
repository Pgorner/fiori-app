/*
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap*/
sap.ui.define(
  "sap/sac/df/types/export/CSVConfig",
  [
    "sap/ui/base/ManagedObject",
    "sap/sac/df/firefly/library"
  ],
  function (ManagedObject, FF) {
    "use strict";
    return ManagedObject.extend(
      "sap.sac.df.types.export.CSVConfig",
      {
        metadata: {
          properties: {
            delimiter: {
              type: "string",
              defaultValue: ","
            }
          }
        },
        getFireflyConfig: function (fileName) {
          var export_config = FF.CsvConfig.createDefault(FF.PrFactory.createStructure(), fileName);
          export_config.setDelimiter(this.getDelimiter());
          return export_config;
        }
      }
    );
  }
);
