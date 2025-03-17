/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/cards/ap/common/library", "sap/cards/ap/transpiler/library", "sap/m/library", "sap/tnt/library", "sap/ui/core/Lib", "sap/ui/core/library", "sap/ui/integration/library"], function (sap_cards_ap_common_library, sap_cards_ap_transpiler_library, sap_m_library, sap_tnt_library, CoreLib, sap_ui_core_library, sap_ui_integration_library) {
  "use strict";

  const thisLib = CoreLib.init({
    name: "sap.cards.ap.generator",
    version: "1.132.0",
    apiVersion: 2,
    dependencies: ["sap.ui.core", "sap.m", "sap.tnt", "sap.ui.integration", "sap.cards.ap.common", "sap.cards.ap.transpiler"],
    types: [],
    interfaces: [],
    controls: [],
    elements: [],
    noLibraryCSS: true
  });
  return thisLib;
});
