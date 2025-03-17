/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.define(["sap/ui/core/Lib", "sap/ui/core/XMLTemplateProcessor", "sap/ui/core/library", "sap/ui/thirdparty/jquery"], function (Lib, _XMLTemplateProcessor, _library, _jquery) {
  "use strict";

  var _exports = {};
  /**
   * Library containing the building blocks for SAP Fiori elements.
   * @namespace
   * @public
   */
  const managecache = "sap.fe.plugins.managecache";

  // library dependencies
  _exports.managecache = managecache;
  const thisLib = Lib.init({
    apiVersion: 2,
    name: "sap.fe.plugins.managecache",
    dependencies: ["sap.ui.core", "sap.m"],
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJtYW5hZ2VjYWNoZSIsIl9leHBvcnRzIiwidGhpc0xpYiIsIkxpYiIsImluaXQiLCJhcGlWZXJzaW9uIiwibmFtZSIsImRlcGVuZGVuY2llcyIsInR5cGVzIiwiaW50ZXJmYWNlcyIsImNvbnRyb2xzIiwiZWxlbWVudHMiLCJ2ZXJzaW9uIiwibm9MaWJyYXJ5Q1NTIl0sInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyJsaWJyYXJ5LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBMaWIgZnJvbSBcInNhcC91aS9jb3JlL0xpYlwiO1xuaW1wb3J0IFwic2FwL3VpL2NvcmUvWE1MVGVtcGxhdGVQcm9jZXNzb3JcIjtcbmltcG9ydCBcInNhcC91aS9jb3JlL2xpYnJhcnlcIjtcbmltcG9ydCBcInNhcC91aS90aGlyZHBhcnR5L2pxdWVyeVwiO1xuXG4vKipcbiAqIExpYnJhcnkgY29udGFpbmluZyB0aGUgYnVpbGRpbmcgYmxvY2tzIGZvciBTQVAgRmlvcmkgZWxlbWVudHMuXG4gKiBAbmFtZXNwYWNlXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCBtYW5hZ2VjYWNoZSA9IFwic2FwLmZlLnBsdWdpbnMubWFuYWdlY2FjaGVcIjtcblxuLy8gbGlicmFyeSBkZXBlbmRlbmNpZXNcbmNvbnN0IHRoaXNMaWIgPSBMaWIuaW5pdCh7XG5cdGFwaVZlcnNpb246IDIsXG5cdG5hbWU6IFwic2FwLmZlLnBsdWdpbnMubWFuYWdlY2FjaGVcIixcblx0ZGVwZW5kZW5jaWVzOiBbXCJzYXAudWkuY29yZVwiLCBcInNhcC5tXCJdLFxuXHR0eXBlczogW10sXG5cdGludGVyZmFjZXM6IFtdLFxuXHRjb250cm9sczogW10sXG5cdGVsZW1lbnRzOiBbXSxcblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXRlbXBsYXRlLWN1cmx5LWluLXN0cmluZ1xuXHR2ZXJzaW9uOiBcIiR7dmVyc2lvbn1cIixcblx0bm9MaWJyYXJ5Q1NTOiB0cnVlXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgdGhpc0xpYjtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7RUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0VBQ08sTUFBTUEsV0FBVyxHQUFHLDRCQUE0Qjs7RUFFdkQ7RUFBQUMsUUFBQSxDQUFBRCxXQUFBLEdBQUFBLFdBQUE7RUFDQSxNQUFNRSxPQUFPLEdBQUdDLEdBQUcsQ0FBQ0MsSUFBSSxDQUFDO0lBQ3hCQyxVQUFVLEVBQUUsQ0FBQztJQUNiQyxJQUFJLEVBQUUsNEJBQTRCO0lBQ2xDQyxZQUFZLEVBQUUsQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDO0lBQ3RDQyxLQUFLLEVBQUUsRUFBRTtJQUNUQyxVQUFVLEVBQUUsRUFBRTtJQUNkQyxRQUFRLEVBQUUsRUFBRTtJQUNaQyxRQUFRLEVBQUUsRUFBRTtJQUNaO0lBQ0FDLE9BQU8sRUFBRSxZQUFZO0lBQ3JCQyxZQUFZLEVBQUU7RUFDZixDQUFDLENBQUM7RUFBQyxPQUVZWCxPQUFPO0FBQUEiLCJpZ25vcmVMaXN0IjpbXX0=