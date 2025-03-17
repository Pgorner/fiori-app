/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/cards/ap/transpiler/library", "sap/fe/navigation/library", "sap/ui/core/Lib", "sap/ui/core/library", "sap/ui/integration/library"], function (sap_cards_ap_transpiler_library, sap_fe_navigation_library, CoreLib, sap_ui_core_library, sap_ui_integration_library) {
  "use strict";

  const thisLib = CoreLib.init({
    name: "sap.cards.ap.common",
    version: "1.132.0",
    dependencies: ["sap.ui.core", "sap.ui.integration", "sap.fe.navigation", "sap.cards.ap.transpiler"],
    types: [],
    apiVersion: 2,
    interfaces: [],
    controls: [],
    elements: [],
    noLibraryCSS: true
  });
  return thisLib;
});
