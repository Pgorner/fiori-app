/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/ui/core/Lib", "../changeHandler/LayoutHandler"], function (Lib, __LayoutHandler) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const LayoutHandler = _interopRequireDefault(__LayoutHandler);
  const designtime = {
    actions: {
      remove: null,
      settings: {
        icon: "sap-icon://edit",
        name: Lib.getResourceBundleFor("sap.cux.home.i18n").getText("editCurrentPage"),
        isEnabled: true,
        handler: (oWrapperControl, mPropertyBag) => {
          return LayoutHandler.loadPersonalizationDialog(oWrapperControl, mPropertyBag).then(aChanges => {
            return aChanges;
          });
        }
      }
    }
  };
  return designtime;
});
//# sourceMappingURL=Layout-dbg-dbg.designtime.js.map
