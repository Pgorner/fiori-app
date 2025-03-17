/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/helpers/StableIdHelper", "sap/ui/mdc/enums/FieldEditMode", "../../field/FieldAPI", "./FieldStructure", "sap/fe/base/jsx-runtime/jsxs"], function (StableIdHelper, FieldEditMode, FieldAPI, FieldStructure, _jsxs) {
  "use strict";

  var _exports = {};
  var getPossibleValueHelpTemplate = FieldStructure.getPossibleValueHelpTemplate;
  var generate = StableIdHelper.generate;
  function getTemplateWithFieldApi(internalField, template) {
    let id;
    if (internalField.formatOptions.fieldMode === "nowrapper" && internalField.editMode === FieldEditMode.Display) {
      return template;
    }
    if (internalField._apiId) {
      id = internalField._apiId;
    } else if (internalField.idPrefix) {
      id = generate([internalField.idPrefix, "Field"]);
    } else {
      id = undefined;
    }
    if (internalField.change === null || internalField.change === "null") {
      internalField.change = undefined;
    }
    return _jsxs(FieldAPI, {
      "core:require": "{TableAPI: 'sap/fe/macros/table/TableAPI'}",
      change: internalField.change,
      liveChange: internalField.onLiveChange,
      focusin: ".collaborativeDraft.handleContentFocusIn",
      id: id,
      _flexId: internalField._flexId,
      idPrefix: internalField.idPrefix,
      vhIdPrefix: internalField.vhIdPrefix,
      contextPath: internalField.contextPath?.getPath(),
      metaPath: internalField.metaPath.getPath(),
      navigateAfterAction: internalField.navigateAfterAction,
      editMode: internalField.editMode,
      wrap: internalField.wrap,
      class: internalField.class,
      ariaLabelledBy: internalField.ariaLabelledBy,
      textAlign: internalField.textAlign,
      semanticObject: internalField.semanticObject,
      showErrorObjectStatus: internalField.showErrorObjectStatus,
      readOnly: internalField.readOnly,
      value: internalField.value,
      description: internalField.description,
      required: internalField.requiredExpression,
      editable: internalField.editableExpression,
      collaborationEnabled: internalField.collaborationEnabled,
      visible: internalField.visible,
      mainPropertyRelativePath: internalField.mainPropertyRelativePath,
      customValueBinding: internalField.value?.slice(0, 1) === "{" ? internalField.value : undefined // we don't need the customValueBinding set if internalField.value is not a binding as this is only used to enable binding refreshes
      ,
      children: [template, {
        dependents: getPossibleValueHelpTemplate(internalField)
      }]
    });
  }
  _exports.getTemplateWithFieldApi = getTemplateWithFieldApi;
  return _exports;
}, false);
//# sourceMappingURL=FieldBlockStructure-dbg.js.map
