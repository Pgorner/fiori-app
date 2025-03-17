/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.define(["sap/ui/core/Lib", "sap/ui/core/library"], function (Library, _library) {
  "use strict";

  /**
   * Test library for SAP Fiori elements
   * @namespace
   * @name sap.fe.test
   * @public
   */

  // library dependencies
  const thisLib = Library.init({
    name: "sap.fe.test",
    apiVersion: 2,
    dependencies: ["sap.ui.core"],
    types: [],
    interfaces: [],
    controls: [],
    elements: [],
    // eslint-disable-next-line no-template-curly-in-string
    version: "1.132.0",
    noLibraryCSS: true
  });
  return thisLib;
}, false);
