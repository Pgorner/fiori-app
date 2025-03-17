/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.define(["sap/ui/core/Element"], function (Element) {
  "use strict";

  var _exports = {};
  const INLINEEDIT_UPDATEGROUPID = "inlineEdit";

  /**
   * Toggles the control in local edit mode.
   * @param control The control to toggle
   * @param showInEdit Whether to show the control in edit mode
   */
  function toggleControlLocalEdit(control, showInEdit) {
    const uiModel = control.getModel("ui");
    const registeredBindingContexts = uiModel.getProperty("/registeredBindingContexts") ?? [];
    const controlId = control.getId();
    if (showInEdit) {
      const path = `/${controlId}`;
      uiModel.setProperty(path, {
        isEditable: true
      });
      control.bindElement({
        path,
        model: "ui"
      });
      registeredBindingContexts.push(controlId);
      uiModel.setProperty("/registeredBindingContexts", registeredBindingContexts);
    } else {
      control.unbindElement("ui");
      uiModel.setProperty("/registeredBindingContexts", registeredBindingContexts.filter(id => id !== controlId));
    }
  }

  /**
   * Leaves inline edit mode.
   * @param view The view
   */
  _exports.toggleControlLocalEdit = toggleControlLocalEdit;
  function leaveInlineEdit(view) {
    view.getModel().resetChanges(INLINEEDIT_UPDATEGROUPID);
    const uiModel = view.getModel("ui");
    const registeredBindingContexts = uiModel.getProperty("/registeredBindingContexts") ?? [];
    for (const controlId of registeredBindingContexts) {
      const control = Element.getElementById(controlId);
      if (control) {
        control.unbindElement("ui");
      }
    }
    uiModel.setProperty("/registeredBindingContexts", []);
  }
  _exports.leaveInlineEdit = leaveInlineEdit;
  return _exports;
}, false);
//# sourceMappingURL=InlineEditHelper-dbg.js.map
