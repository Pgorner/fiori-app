/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/base/BindingToolkit", "sap/fe/core/controls/CommandExecution", "sap/fe/base/jsx-runtime/jsx"], function (BindingToolkit, CommandExecution, _jsx) {
  "use strict";

  var _exports = {};
  var resolveBindingString = BindingToolkit.resolveBindingString;
  function getCommandExecutionForAction(commandName, action, parameters) {
    let executeFunction;
    let isEnabled;
    const actionVisible = action.visible ? resolveBindingString(action.visible) : undefined;
    const actionEnabled = action.enabled ? resolveBindingString(action.enabled) : undefined;
    switch (action.type) {
      case "ForAction":
        executeFunction = parameters.onExecuteAction;
        isEnabled = parameters.isActionEnabled !== undefined ? resolveBindingString(parameters.isActionEnabled) : actionEnabled;
        break;
      case "ForNavigation":
        executeFunction = parameters.onExecuteIBN;
        isEnabled = parameters.isIBNEnabled !== undefined ? resolveBindingString(parameters.isIBNEnabled) : actionEnabled;
        break;
      default:
        executeFunction = parameters.onExecuteManifest;
        isEnabled = parameters.isEnabled !== undefined ? resolveBindingString(parameters.isEnabled) : actionEnabled;
    }
    return _jsx(CommandExecution, {
      "core:require": "{FPM: 'sap/fe/core/helpers/FPMHelper'}",
      execute: executeFunction,
      enabled: isEnabled,
      visible: parameters.visible ?? actionVisible,
      command: commandName ?? action.command
    });
  }
  _exports.getCommandExecutionForAction = getCommandExecutionForAction;
  return _exports;
}, false);
//# sourceMappingURL=ActionCommand-dbg.js.map
