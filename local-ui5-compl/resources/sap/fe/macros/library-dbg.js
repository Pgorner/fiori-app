/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/f/library", "sap/fe/controls/library", "sap/fe/core/AppComponent", "sap/fe/core/library", "sap/fe/macros/coreUI/factory", "sap/fe/macros/filter/FilterOperatorUtils", "sap/fe/macros/filter/type/MultiValue", "sap/fe/macros/filter/type/Range", "sap/fe/macros/formatters/TableFormatter", "sap/fe/macros/macroLibrary", "sap/ui/core/CustomData", "sap/ui/core/Fragment", "sap/ui/core/Lib", "sap/ui/core/XMLTemplateProcessor", "sap/ui/core/library", "sap/ui/mdc/field/ConditionsType", "sap/ui/mdc/library", "sap/ui/unified/library"], function (Log, _library, _library2, AppComponent, _library3, _factory, FilterOperatorUtils, _MultiValue, _Range, _TableFormatter, _macroLibrary, CustomData, Fragment, Library, _XMLTemplateProcessor, _library4, _ConditionsType, _library5, _library6) {
  "use strict";

  var _exports = {};
  /**
   * Library containing the building blocks for SAP Fiori elements.
   * @namespace
   * @public
   */
  const macrosNamespace = "sap.fe.macros";

  // library dependencies
  _exports.macrosNamespace = macrosNamespace;
  const thisLib = Library.init({
    name: "sap.fe.macros",
    apiVersion: 2,
    dependencies: ["sap.ui.core", "sap.ui.mdc", "sap.ui.unified", "sap.fe.core", "sap.fe.navigation", "sap.fe.controls", "sap.m", "sap.f"],
    types: ["sap.fe.macros.NavigationType"],
    interfaces: [],
    controls: [],
    elements: [],
    // eslint-disable-next-line no-template-curly-in-string
    version: "1.132.0",
    noLibraryCSS: true,
    extensions: {
      flChangeHandlers: {
        "sap.fe.macros.controls.FilterBar": "sap/ui/mdc/flexibility/FilterBar",
        "sap.fe.macros.controls.Section": "sap/uxap/flexibility/ObjectPageSection"
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  });
  thisLib.NavigationType = {
    /**
     * For External Navigation
     * @public
     */
    External: "External",
    /**
     * For In-Page Navigation
     * @public
     */
    InPage: "InPage",
    /**
     * For No Navigation
     * @public
     */
    None: "None"
  };
  Fragment.registerType("CUSTOM", {
    load: Fragment.getType?.("XML").load,
    init: async function (mSettings) {
      const currentController = mSettings.containingView.getController();
      let targetControllerExtension = currentController;
      if (currentController && !currentController.isA("sap.fe.core.ExtensionAPI")) {
        targetControllerExtension = currentController.getExtensionAPI(mSettings.id);
      }
      mSettings.containingView = {
        oController: targetControllerExtension
      };
      const childCustomData = mSettings.childCustomData ?? undefined;
      delete mSettings.childCustomData;
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }
      const result = await Fragment.getType("XML").init.apply(this, [mSettings, args]);
      if (childCustomData && result?.isA("sap.ui.core.Control")) {
        for (const customDataKey in childCustomData) {
          // UI5 adds 'bindingString' when its an adaptation project (SNOW: DINC0143515), which results in errors later
          if (customDataKey === "bindingString") {
            delete childCustomData[customDataKey];
            continue;
          }
          result.addCustomData(new CustomData({
            key: customDataKey,
            value: childCustomData[customDataKey]
          }));
        }
      }
      return result;
    }
  });
  Library.load({
    name: "sap.fe.macros"
  }).then(() => {
    AppComponent.registerInstanceDependentProcessForStartUp(FilterOperatorUtils.processCustomFilterOperators);
    return;
  }).catch(error => {
    Log.error(`Error loading 'sap.fe.macros`, error);
  });
  return thisLib;
}, false);
