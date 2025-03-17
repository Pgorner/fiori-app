/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/UIProvider", "sap/fe/macros/coreUI/CreateDialog", "sap/fe/macros/coreUI/ParameterDialog"], function (UIProvider, CreateDialog, ParameterDialog) {
  "use strict";

  var setCoreUIFactory = UIProvider.setCoreUIFactory;
  const factory = {
    newCreateDialog(contextToUpdate, fieldNames, appComponent, mode, parentControl) {
      return new CreateDialog(contextToUpdate, fieldNames, appComponent, mode, parentControl);
    },
    newParameterDialog(action, actionContext, parameters, parameterValues, entitySetName, view, messageHandler, strictHandlingUtilities, callbacks, ignoreETag) {
      return new ParameterDialog(action, actionContext, parameters, parameterValues, entitySetName, view, messageHandler, strictHandlingUtilities, callbacks, ignoreETag);
    }
  };
  setCoreUIFactory(factory);
}, false);
//# sourceMappingURL=factory-dbg.js.map
