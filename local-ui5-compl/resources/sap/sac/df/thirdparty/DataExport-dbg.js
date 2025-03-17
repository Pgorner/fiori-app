/*
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
// To enable the loading of our thirdparty export bundle and also get access to the exported objects,
// we have to tell ui5 what the bundle exports globally and ues a shim for this.
sap.ui.loader.config({
  shim: {
    "sap/sac/df/thirdparty/ff-data-export.main": {
      amd: true,
      exports: "sapDataExport" // name of the global variable under which we export our external API
    }
  }
});
sap.ui.define("sap/sac/df/thirdparty/DataExport", ["sap/sac/df/thirdparty/ff-data-export.main"], function (sapDataExport) {
  return sapDataExport;
});
