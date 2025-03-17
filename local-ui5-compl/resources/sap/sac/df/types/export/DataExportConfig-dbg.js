/*
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap*/
sap.ui.define(
  "sap/sac/df/types/export/DataExportConfig",
  [
    "sap/ui/base/ManagedObject",
    "sap/sac/df/firefly/library",
    "sap/sac/df/types/export/OverwriteTexts",
    "sap/sac/df/types/export/XLSConfig",
    "sap/sac/df/types/export/CSVConfig",
    "sap/sac/df/types/export/PDFConfig"
  ],
  function (ManagedObject, FF, OverwriteTexts, XLSConfig, CSVConfig, PDFConfig) {
    "use strict";
    return ManagedObject.extend(
      "sap.sac.df.types.export.DataExportConfig",
      {
        metadata: {
          properties: {
            type: {
              type: "string",
              defaultValue: "XLSX"
            },
            fileName: {
              type: "string",
              defaultValue: "Untitled"
            },
            expandHierarchy: {
              type: "boolean",
              defaultValue: false
            },
            enablePdfAppendix: {
              type: "boolean",
              defaultValue: false
            },
            displayDialog: {
              type: "boolean",
              defaultValue: false
            },
            overwriteTexts: {
              type: "object",
              defaultValue: {}
            },
            XLS: {
              type: "sap.sac.df.types.export.XLSConfig"
            },
            CSV: {
              type: "sap.sac.df.types.export.CSVConfig"
            },
            PDF: {
              type: "sap.sac.df.types.export.PDFConfig"
            }
          }
        },
        init: function () {
          this.setXLS(new XLSConfig());
          this.setCSV(new CSVConfig());
          this.setPDF(new PDFConfig());
          this.setOverwriteTexts(OverwriteTexts.getDefault());
        },
        putOverwriteText: function (key, value) {
          this.getOverwriteTexts().put(key, value);
        },
        addOverwriteTextsToQm : function (oFFApplicationSettings) {
          var keys = this.getOverwriteTexts().getKeysAsIterator();
          while (keys.hasNext()) {
            var key = keys.next();
            if (!oFFApplicationSettings.getOverwriteTexts().containsKey(key)) {
              oFFApplicationSettings.putOverwriteText(key, this.getOverwriteTexts().getByKey(key));
            }
          }
        },
        getFireflyConfig: function () {
          var export_config = null;
          var exportType = this.getType();
          if (exportType === FF.BaseExportConfig.XLSX_EXPORT) {
            export_config = this.getXLS().getFireflyConfig(this.getFileName());
          } else if (exportType === FF.BaseExportConfig.CSV_EXPORT) {
            export_config = this.getCSV().getFireflyConfig(this.getFileName());
          } else if (exportType === FF.BaseExportConfig.PDF_EXPORT) {
            export_config = this.getPDF().getFireflyConfig(this.getFileName());
          }
          if(export_config) {
            export_config.setExpandHierarchy(this.getExpandHierarchy());
            export_config.setEnablePdfAppendix(this.getEnablePdfAppendix());
          }
          return export_config;
        }
      }
    );
  }
);
