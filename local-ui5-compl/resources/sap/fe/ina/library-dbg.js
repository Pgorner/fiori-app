/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/library", "sap/ui/core/Lib"], function (_library, Library) {
  "use strict";

  var _exports = {};
  /**
   * Library providing the integration of INA services into the SAP Fiori elements framework.
   * @namespace
   */
  const feInaNamespace = "sap.fe.ina";
  _exports.feInaNamespace = feInaNamespace;
  const thisLib = Library.init({
    name: "sap.fe.ina",
    apiVersion: 2,
    dependencies: ["sap.ui.core", "sap.fe.core"],
    types: [],
    interfaces: [],
    controls: [],
    elements: [],
    // eslint-disable-next-line no-template-curly-in-string
    version: "1.132.0",
    noLibraryCSS: true
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  });
  return thisLib;
}, false);
