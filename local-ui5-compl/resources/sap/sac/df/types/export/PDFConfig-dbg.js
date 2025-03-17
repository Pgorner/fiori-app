/*
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap*/
sap.ui.define(
  "sap/sac/df/types/export/PDFConfig",
  [
    "sap/ui/base/ManagedObject",
    "sap/sac/df/firefly/library"
  ],
  function (ManagedObject, FF) {
    "use strict";
    return ManagedObject.extend(
      "sap.sac.df.types.export.PDFConfig",
      {
        metadata: {
          properties: {
            pageSize: {
              type: "string",
              defaultValue: "a4"
            },
            fontSize: {
              type: "number",
              defaultValue: 6
            },
            orientation: {
              type: "string",
              defaultValue: "landscape"
            },
            builtInFont: {
              type: "string",
              defaultValue: "Helvetica"
            },
            autoSize: {
              type: "boolean",
              defaultValue: true
            },
            freezeRows: {
              type: "number"
            },
            numberLocation: {
              type: "string"
            },
            enablePdfAppendix: {
              type: "boolean",
              defaultValue: false
            }
          }
        },
        getFireflyConfig: function (fileName) {
          var export_config = FF.PdfConfig.createDefault(FF.PrFactory.createStructure(), fileName);
          export_config.setPageSize(this.getPageSize());
          export_config.setFontSize(this.getFontSize());
          export_config.setOrientation(this.getOrientation());
          export_config.setBuiltInFont(this.getBuiltInFont());
          export_config.setAutoSize(this.getAutoSize());
          export_config.setFreezeRows(this.getFreezeRows());
          export_config.setNumberLocation(this.getNumberLocation());
          export_config.setEnablePdfAppendix(this.getEnablePdfAppendix());
          return export_config;
        },
        PAGE_SIZE_LEGAL: FF.PdfConfig.PAGE_SIZE_LEGAL,
        PAGE_SIZE_LETTER: FF.PdfConfig.PAGE_SIZE_LETTER,
        PAGE_SIZE_A5: FF.PdfConfig.PAGE_SIZE_A5,
        PAGE_SIZE_A4: FF.PdfConfig.PAGE_SIZE_A4,
        PAGE_SIZE_A3: FF.PdfConfig.PAGE_SIZE_A3,
        PAGE_SIZE_A2: FF.PdfConfig.PAGE_SIZE_A2,
        PDF_ORIENT_LANDSCAPE: FF.PdfConfig.PDF_ORIENT_LANDSCAPE,
        PDF_ORIENT_PORTRAIT: FF.PdfConfig.PDF_ORIENT_PORTRAIT,
        PAGE_NUMBER_LOC_FOOTER: FF.PdfConfig.PAGE_NUMBER_LOC_FOOTER,
        PAGE_NUMBER_LOC_HEADER: FF.PdfConfig.PAGE_NUMBER_LOC_HEADER,
        PAGE_NUMBER_LOC_NONE: FF.PdfConfig.PAGE_NUMBER_LOC_NONE
      }
    );
  }
);
