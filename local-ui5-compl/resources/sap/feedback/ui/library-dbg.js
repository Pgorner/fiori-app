/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
"use strict";

sap.ui.define(["sap/ui/core/library", "sap/ui/core/Lib"], function (sap_ui_core_library, Lib) {
  "use strict";

  // delegate further initialization of this library to the Core

  var thisLib = Lib.init({
    apiVersion: 2,
    name: 'sap.feedback.ui',
    dependencies: ['sap.ui.core'],
    interfaces: [],
    elements: [],
    noLibraryCSS: true,
    version: '1.132.0'
  });
  return thisLib;
});
