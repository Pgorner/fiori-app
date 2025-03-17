/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/helpers/StableIdHelper", "sap/fe/macros/ValueHelp", "sap/m/HBox", "sap/m/VBox", "sap/ui/mdc/enums/FieldEditMode", "../../controls/FieldWrapper", "../../field/FieldHelper", "./DisplayStyle", "./EditStyle", "sap/fe/base/jsx-runtime/jsx", "sap/fe/base/jsx-runtime/jsxs"], function (StableIdHelper, ValueHelp, HBox, VBox, FieldEditMode, FieldWrapper, FieldHelper, DisplayStyle, EditStyle, _jsx, _jsxs) {
  "use strict";

  var _exports = {};
  var generate = StableIdHelper.generate;
  /**
   * The function calculates the corresponding ValueHelp field in case it´s
   * defined for the specific control.
   * @param internalField
   * @returns An XML-based string with a possible ValueHelp control.
   */
  function getPossibleValueHelpTemplate(internalField) {
    const vhp = FieldHelper.valueHelpProperty(internalField.valueHelpMetaPath);
    const vhpCtx = internalField.valueHelpMetaPath.getModel().createBindingContext(vhp, internalField.valueHelpMetaPath);
    const hasValueHelpAnnotations = FieldHelper.hasValueHelpAnnotation(vhpCtx.getObject("@"));
    if (hasValueHelpAnnotations && internalField.showValueHelpTemplate == true) {
      // depending on whether this one has a value help annotation included, add the dependent
      return _jsx(ValueHelp, {
        _flexId: `${internalField.id}-content_FieldValueHelp`,
        metaPath: vhpCtx.getPath(),
        contextPath: internalField.contextPath?.getPath()
      });
    }
    return "";
  }

  /**
   * Create the fieldWrapper control for use cases with display and edit styles.
   * @param internalField Reference to the current internal field instance
   * @returns An XML-based string with the definition of the field control
   */
  _exports.getPossibleValueHelpTemplate = getPossibleValueHelpTemplate;
  function createFieldWrapper(internalField) {
    let fieldWrapperID;
    if (internalField._flexId) {
      fieldWrapperID = internalField._flexId;
    } else if (internalField.idPrefix) {
      fieldWrapperID = generate([internalField.idPrefix, "Field-content"]);
    } else {
      fieldWrapperID = undefined;
    }

    // compute the display part and the edit part for the fieldwrapper control
    const contentDisplay = DisplayStyle.getTemplate(internalField);
    // content edit part needs to be wrapped further with an hbox in case of collaboration mode
    // that´s why we need to call this special helper here which finally calls internally EditStyle.getTemplate
    // const contentEdit = EditStyle.getTemplateWithWrapper(internalField, controller, handleChange, fieldAPI);
    const contentEdit = EditStyle.getTemplateWithWrapper(internalField);
    return _jsx(FieldWrapper, {
      id: fieldWrapperID,
      editMode: internalField.editMode,
      visible: internalField.visible,
      width: "100%",
      textAlign: internalField.textAlign,
      class: internalField.class
      // TODO Field needs to be migrated
      ,
      validateFieldGroup: ".collaborativeDraft.handleContentFocusOut",
      children: {
        contentDisplay: contentDisplay,
        contentEdit: contentEdit
      }
    });
  }

  /**
   * Helps to calculate the field structure wrapper.
   * @param internalField Reference to the current internal field instance
   * @returns An XML-based string with the definition of the field control
   */
  _exports.createFieldWrapper = createFieldWrapper;
  function getFieldStructureTemplate(internalField) {
    //compute the field in case of mentioned display styles
    if (internalField.displayStyle === "Avatar" || internalField.displayStyle === "Contact" || internalField.displayStyle === "Button" || internalField.displayStyle === "File") {
      // check for special handling in case a file type is used with the collaboration mode
      // (renders an avatar directly)
      if (internalField.displayStyle === "File" && (internalField.collaborationEnabled ?? false) && internalField.editMode !== FieldEditMode.Display) {
        return _jsxs(HBox, {
          width: "100%",
          alignItems: "End",
          children: [_jsx(VBox, {
            width: "100%",
            children: DisplayStyle.getFileTemplate(internalField)
          }), EditStyle.getCollaborationAvatar(internalField)]
        });
      } else {
        //for all other cases render the displayStyles with a field api wrapper
        return DisplayStyle.getTemplate(internalField);
      }
    } else if (internalField.formatOptions.fieldMode === "nowrapper" && internalField.editMode === FieldEditMode.Display) {
      //renders a display based building block (e.g. a button) that has no field api wrapper around it.
      return DisplayStyle.getTemplate(internalField);
    } else {
      //for all other cases create a field wrapper
      return createFieldWrapper(internalField);
    }
  }
  _exports.getFieldStructureTemplate = getFieldStructureTemplate;
  return _exports;
}, false);
//# sourceMappingURL=FieldStructure-dbg.js.map
