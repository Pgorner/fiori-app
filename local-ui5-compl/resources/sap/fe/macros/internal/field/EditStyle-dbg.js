/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/base/BindingToolkit", "sap/fe/base/EventDelegateHook", "sap/fe/core/converters/MetaModelConverter", "sap/fe/core/formatters/CollaborationFormatter", "sap/fe/core/templating/PropertyFormatters", "sap/fe/core/templating/PropertyHelper", "sap/fe/core/templating/UIFormatters", "sap/fe/macros/controls/CollaborationHBox", "sap/fe/macros/controls/RadioButtons", "sap/fe/macros/field/FieldTemplating", "sap/fe/macros/internal/valuehelp/ValueHelpTemplating", "sap/m/Avatar", "sap/m/CheckBox", "sap/m/DatePicker", "sap/m/DateTimePicker", "sap/m/FlexItemData", "sap/m/Input", "sap/m/MaskInput", "sap/m/MaskInputRule", "sap/m/RatingIndicator", "sap/m/TextArea", "sap/m/TimePicker", "sap/ui/core/CustomData", "sap/ui/mdc/Field", "sap/ui/mdc/enums/FieldEditMode", "../../field/FieldHelper", "../../field/TextAreaEx", "sap/fe/base/jsx-runtime/jsx", "sap/fe/base/jsx-runtime/jsxs"], function (BindingToolkit, EventDelegateHook, MetaModelConverter, CollaborationFormatters, PropertyFormatters, PropertyHelper, UIFormatter, CollaborationHBox, RadioButtons, FieldTemplating, ValueHelpTemplating, Avatar, CheckBox, DatePicker, DateTimePicker, FlexItemData, Input, MaskInput, MaskInputRule, RatingIndicator, TextArea, TimePicker, CustomData, Field, FieldEditMode, FieldHelper, TextAreaEx, _jsx, _jsxs) {
  "use strict";

  var getTextAlignment = FieldTemplating.getTextAlignment;
  var getMultipleLinesForDataField = FieldTemplating.getMultipleLinesForDataField;
  var hasValueHelpWithFixedValues = PropertyHelper.hasValueHelpWithFixedValues;
  var getRelativePropertyPath = PropertyFormatters.getRelativePropertyPath;
  var pathInModel = BindingToolkit.pathInModel;
  var compileExpression = BindingToolkit.compileExpression;
  const EditStyle = {
    /**
     * An internal helper to retrieve the reused layout data.
     * @param internalField Reference to the current internal field instance
     * @returns An XML-based string with the definition of the field control
     */
    getLayoutData(internalField) {
      let layoutData = "";
      if (internalField.collaborationEnabled) {
        layoutData = _jsx(FlexItemData, {
          growFactor: "9"
        });
      }
      return layoutData;
    },
    /**
     * Generates the avatar control next a field locked.
     * @param internalField Reference to the current internal field instance
     * @returns An XML-based string with the definition of the avatar
     */
    getCollaborationAvatar(internalField) {
      const collaborationHasActivityExpression = compileExpression(internalField.collaborationExpression);
      const collaborationInitialsExpression = compileExpression(UIFormatter.getCollaborationExpression(internalField.dataModelPath, CollaborationFormatters.getCollaborationActivityInitials));
      const collaborationColorExpression = compileExpression(UIFormatter.getCollaborationExpression(internalField.dataModelPath, CollaborationFormatters.getCollaborationActivityColor));
      return _jsx(Avatar, {
        "core:require": "{FieldRuntime: 'sap/fe/macros/field/FieldRuntime'}",
        visible: collaborationHasActivityExpression,
        initials: collaborationInitialsExpression,
        displaySize: "Custom",
        customDisplaySize: "1.5rem",
        customFontSize: "0.8rem",
        backgroundColor: collaborationColorExpression,
        press: "FieldRuntime.showCollaborationEditUser(${$source>/}, ${$view>/})",
        children: {
          dependents: _jsx(EventDelegateHook, {
            stopTapPropagation: true
          })
        }
      });
    },
    /**
     * Generates a template for one of the pickers reference in the type.
     * @param internalField Reference to the current internal field instance
     * @param type Reference to one of the edit style picker types
     * @returns An XML-based string with the definition of the field control
     */
    getDateTimePickerGeneric(internalField, type) {
      const dataModelObjectPath = MetaModelConverter.getInvolvedDataModelObjects(internalField.metaPath, internalField.contextPath);
      const textAlign = getTextAlignment(dataModelObjectPath, internalField.formatOptions, internalField.editModeAsObject);
      const dateTimePickerProperties = {
        "core:require": "{FieldAPI: 'sap/fe/macros/field/FieldAPI'}",
        id: internalField.editStyleId,
        width: "100%",
        editable: internalField.editableExpression,
        enabled: internalField.enabledExpression,
        required: internalField.requiredExpression,
        textAlign: textAlign,
        ariaLabelledBy: internalField.ariaLabelledBy,
        value: internalField.valueBindingExpression,
        fieldGroupIds: internalField.fieldGroupIds,
        showTimezone: internalField.showTimezone,
        minDate: type === "DateTimePicker" || type === "DatePicker" ? internalField.minDateExpression : undefined,
        maxDate: type === "DateTimePicker" || type === "DatePicker" ? internalField.maxDateExpression : undefined,
        change: type === "DateTimePicker" ? internalField.change || internalField.eventHandlers.change : internalField.eventHandlers.change,
        liveChange: internalField.liveChangeEnabled ? internalField.eventHandlers.liveChange : undefined,
        validateFieldGroup: internalField.eventHandlers.validateFieldGroup
      };
      function getDateTimePicker(dateTimePickerType) {
        let dateTimePicker;
        switch (dateTimePickerType) {
          case "DatePicker":
            dateTimePicker = _jsx(DatePicker, {
              ...dateTimePickerProperties,
              children: {
                customData: _jsx(CustomData, {
                  value: internalField.dataSourcePath
                }, "sourcePath")
              }
            });
            break;
          case "DateTimePicker":
            dateTimePicker = _jsx(DateTimePicker, {
              ...dateTimePickerProperties,
              children: {
                customData: _jsx(CustomData, {
                  value: internalField.dataSourcePath
                }, "sourcePath")
              }
            });
            break;
          case "TimePicker":
            dateTimePicker = _jsx(TimePicker, {
              ...dateTimePickerProperties,
              children: {
                customData: _jsx(CustomData, {
                  value: internalField.dataSourcePath
                }, "sourcePath")
              }
            });
            break;
        }
        return dateTimePicker;
      }
      return getDateTimePicker(type);
    },
    /**
     * Generates the Input template.
     * @param internalField Reference to the current internal field instance
     * @returns An XML-based string with the definition of the field control
     */
    getInputTemplate(internalField) {
      const dataModelObjectPath = MetaModelConverter.getInvolvedDataModelObjects(internalField.metaPath, internalField.contextPath);
      const textAlign = getTextAlignment(dataModelObjectPath, internalField.formatOptions, internalField.editModeAsObject);
      return _jsx(Input, {
        "core:require": "{FieldAPI: 'sap/fe/macros/field/FieldAPI'}",
        id: internalField.editStyleId,
        value: internalField.valueBindingExpression,
        placeholder: internalField.editStylePlaceholder,
        width: "100%",
        editable: internalField.editableExpression,
        description: internalField.staticDescription,
        enabled: internalField.enabledExpression,
        required: internalField.requiredExpression,
        fieldGroupIds: internalField.fieldGroupIds,
        textAlign: textAlign,
        ariaLabelledBy: internalField.ariaLabelledBy,
        maxLength: internalField.formatOptions.textMaxLength,
        change: internalField.eventHandlers.change,
        liveChange: internalField.liveChangeEnabled ? internalField.eventHandlers.liveChange : undefined,
        validateFieldGroup: internalField.eventHandlers.validateFieldGroup,
        children: {
          layoutData: EditStyle.getLayoutData(internalField),
          customData: _jsx(CustomData, {
            value: internalField.dataSourcePath
          }, "sourcePath")
        }
      });
    },
    /**
     * Returns if a field shall be templated as a radio button group.
     * @param internalField Reference to the current internal field instance
     * @returns The evaluation result
     */
    showAsRadioButton(internalField) {
      // Determine if we need to render the field as a radio button group
      // TODO: Remove the next two lines once UX updated the vocabulary module including the new experimental annotation
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const radioButtonConfigured = internalField.property.annotations?.Common?.ValueListWithFixedValues && hasValueHelpWithFixedValues(internalField.property) === true && (internalField.property.annotations.Common.ValueListWithFixedValues.annotations?.Common?.ValueListShowValuesImmediately && internalField.property.annotations.Common.ValueListWithFixedValues.annotations?.Common?.ValueListShowValuesImmediately.valueOf() === true || internalField.formatOptions.fieldEditStyle === "RadioButtons");

      // Exclude not supported cases
      // - ValueListParamaterInOut / ...Out must not be empty
      // - ValueListRelevantQualifiers annotation must not be used
      // Further cases may not make sense with radio buttons but we do not explicitly exclude them but mention this in documentation.
      // Check documentation, discuss and decide before adding further restrictions here.
      const valueListParameterInOut = internalField.property?.annotations?.Common?.ValueList?.Parameters.find(valueListParameter => (valueListParameter.$Type === "com.sap.vocabularies.Common.v1.ValueListParameterInOut" || valueListParameter.$Type === "com.sap.vocabularies.Common.v1.ValueListParameterOut") && valueListParameter.LocalDataProperty.value === internalField.property.name);
      return radioButtonConfigured && valueListParameterInOut !== undefined && !internalField.property.annotations?.Common?.ValueListRelevantQualifiers;
    },
    /**
     * Generates the RadioButton template.
     * @param internalField Reference to the current internal field instance
     * @returns An XML-based string with the radio button definition
     */
    getRadioButtonTemplate(internalField) {
      const fixedValuesPath = "/" + internalField.property?.annotations?.Common?.ValueList?.CollectionPath;
      const valueListParameterInOut = internalField.property?.annotations?.Common?.ValueList?.Parameters.find(valueListParameter => (valueListParameter.$Type === "com.sap.vocabularies.Common.v1.ValueListParameterInOut" || valueListParameter.$Type === "com.sap.vocabularies.Common.v1.ValueListParameterOut") && valueListParameter.LocalDataProperty.value === internalField.property.name);

      // we know that a valueListProperty exists because we check this already in showAsRadioButton
      const valueListKeyPath = pathInModel(valueListParameterInOut.ValueListProperty);
      let valueListDescriptionPath;
      const valueHelpKeyTextAnnotationPath = internalField.dataModelPath.targetEntityType.resolvePath(fixedValuesPath).entityType.keys[0].annotations?.Common?.Text?.path;
      if (valueHelpKeyTextAnnotationPath) {
        valueListDescriptionPath = pathInModel(valueHelpKeyTextAnnotationPath);
      } else {
        valueListDescriptionPath = valueListKeyPath;
      }
      return _jsx(RadioButtons, {
        id: internalField.editStyleId,
        requiredExpression: internalField.requiredExpression,
        validateFieldGroup: "FieldRuntime.onValidateFieldGroup($event)",
        fixedValuesPath: fixedValuesPath,
        fieldGroupIds: internalField.fieldGroupIds,
        value: internalField.valueBindingExpression,
        enabledExpression: internalField.enabledExpression,
        radioButtonTextProperty: valueListDescriptionPath,
        radioButtonKeyProperty: valueListKeyPath,
        horizontalLayout: internalField.formatOptions.radioButtonsHorizontalLayout
      });
    },
    /**
     * Generates the InputWithValueHelp template.
     * @param internalField Reference to the current internal field instance
     * @returns An XML-based string with the definition of the field control
     */
    getInputWithValueHelpTemplate(internalField) {
      const dataFieldDataModelObjectPath = MetaModelConverter.getInvolvedDataModelObjects(internalField.metaPath, internalField.contextPath);
      const delegate = FieldHelper.computeFieldBaseDelegate("sap/fe/macros/field/FieldBaseDelegate", internalField.formatOptions.retrieveTextFromValueList);
      const display = UIFormatter.getFieldDisplay(internalField.property, internalField.formatOptions.displayMode, internalField.editModeAsObject);
      const hasMultilineAnnotation = !!internalField.property?.annotations?.UI?.MultiLineText;
      const multipleLines = getMultipleLinesForDataField(internalField, hasMultilineAnnotation);
      const propertyContext = internalField.metaPath.getModel().createBindingContext("Value", internalField.metaPath);
      const valueHelpPropertyContext = internalField.metaPath.getModel().createBindingContext(FieldHelper.valueHelpProperty(propertyContext));
      const valueHelp = ValueHelpTemplating.generateID(internalField._vhFlexId, internalField.vhIdPrefix, getRelativePropertyPath(propertyContext, {
        context: propertyContext
      }), getRelativePropertyPath(valueHelpPropertyContext, {
        context: valueHelpPropertyContext
      }));
      const textAlign = getTextAlignment(dataFieldDataModelObjectPath, internalField.formatOptions, internalField.editModeAsObject, true);
      const label = FieldHelper.computeLabelText(internalField, {
        context: internalField.metaPath
      });
      let optionalContentEdit = "";
      if (internalField.property.type === "Edm.String" && hasMultilineAnnotation) {
        optionalContentEdit = _jsx(TextArea, {
          value: internalField.valueBindingExpression,
          required: internalField.requiredExpression,
          rows: internalField.formatOptions.textLinesEdit,
          growing: internalField.formatOptions.textMaxLines > 0 ? true : undefined,
          growingMaxLines: internalField.formatOptions.textMaxLines,
          width: "100%",
          change: internalField.eventHandlers.change,
          fieldGroupIds: internalField.fieldGroupIds
        });
      }
      let optionalLayoutData = "";
      if (internalField.collaborationEnabled === true) {
        optionalLayoutData = _jsx(FlexItemData, {
          growFactor: "9"
        });
      }
      if (this.showAsRadioButton(internalField) !== true) {
        return _jsx(Field, {
          "core:require": "{FieldAPI: 'sap/fe/macros/field/FieldAPI'}",
          delegate: delegate,
          id: internalField.editStyleId,
          value: internalField.valueBindingExpression,
          placeholder: internalField.editStylePlaceholder,
          valueState: internalField.valueState,
          editMode: internalField.editMode,
          width: "100%",
          required: internalField.requiredExpression,
          additionalValue: internalField.textBindingExpression,
          display: display,
          multipleLines: multipleLines === false ? undefined : multipleLines,
          valueHelp: valueHelp,
          fieldGroupIds: internalField.fieldGroupIds,
          textAlign: textAlign,
          ariaLabelledBy: internalField.ariaLabelledBy,
          label: label,
          change: internalField.eventHandlers.change,
          liveChange: internalField.liveChangeEnabled ? internalField.eventHandlers.liveChange : undefined,
          validateFieldGroup: internalField.eventHandlers.validateFieldGroup,
          children: {
            contentEdit: optionalContentEdit,
            layoutData: optionalLayoutData,
            customData: _jsx(CustomData, {
              value: internalField.dataSourcePath
            }, "sourcePath")
          }
        });
      } else {
        return this.getRadioButtonTemplate(internalField);
      }
    },
    /**
     * Generates the CheckBox template.
     * @param internalField Reference to the current internal field instance
     * @returns An XML-based string with the definition of the field control
     */
    getCheckBoxTemplate(internalField) {
      return _jsx(CheckBox, {
        "core:require": "{FieldAPI: 'sap/fe/macros/field/FieldAPI'}",
        id: internalField.editStyleId,
        selected: internalField.valueBindingExpression,
        editable: internalField.editableExpression,
        enabled: internalField.enabledExpression,
        fieldGroupIds: internalField.fieldGroupIds,
        ariaLabelledBy: internalField.ariaLabelledBy,
        select: internalField.eventHandlers.change,
        validateFieldGroup: internalField.eventHandlers.validateFieldGroup,
        children: {
          customData: _jsx(CustomData, {
            value: internalField.dataSourcePath
          }, "sourcePath")
        }
      });
    },
    /**
     * Generates the TextArea template.
     * @param internalField Reference to the current internal field instance
     * @returns An XML-based string with the definition of the field control
     */
    getTextAreaTemplate(internalField) {
      const growing = internalField.formatOptions.textMaxLines ? true : false;
      const showExceededText = !!internalField.formatOptions.textMaxLength;

      //unfortunately this one is a "different" layoutData than the others, therefore the reuse function from above cannot be used for the textArea template
      let layoutData = "";
      if (internalField.collaborationEnabled) {
        layoutData = _jsx(FlexItemData, {
          growFactor: "9"
        });
      }
      return _jsx(TextAreaEx, {
        "core:require": "{FieldAPI: 'sap/fe/macros/field/FieldAPI'}",
        id: internalField.editStyleId,
        value: internalField.valueBindingExpression,
        placeholder: internalField.editStylePlaceholder,
        required: internalField.requiredExpression,
        rows: internalField.formatOptions.textLinesEdit,
        growing: growing,
        growingMaxLines: internalField.formatOptions.textMaxLines,
        cols: 300 //As the default is 20, the "cols" property is configured with a value of 300 to guarantee that the textarea will occupy all the available space.
        ,
        width: "100%",
        editable: internalField.editableExpression,
        enabled: internalField.enabledExpression,
        fieldGroupIds: internalField.fieldGroupIds,
        ariaLabelledBy: internalField.ariaLabelledBy,
        maxLength: internalField.formatOptions.textMaxLength,
        showExceededText: showExceededText,
        change: internalField.eventHandlers.change,
        liveChange: internalField.liveChangeEnabled || internalField.formatOptions.textMaxLength ? internalField.eventHandlers.liveChange : undefined,
        validateFieldGroup: internalField.eventHandlers.validateFieldGroup,
        children: {
          layoutData: layoutData,
          customData: _jsx(CustomData, {
            value: internalField.dataSourcePath
          }, "sourcePath")
        }
      });
    },
    /**
     * Generates the RatingIndicator template.
     * @param internalField Reference to the current internal field instance
     * @returns An XML-based string with the definition of the field control
     */
    getRatingIndicatorTemplate: internalField => {
      const tooltip = internalField.ratingIndicatorTooltip || "{sap.fe.i18n>T_COMMON_RATING_INDICATOR_TITLE_LABEL}";
      return _jsx(RatingIndicator, {
        id: internalField.editStyleId,
        maxValue: internalField.ratingIndicatorTargetValue,
        value: internalField.valueBindingExpression,
        tooltip: tooltip,
        iconSize: "1.375rem",
        class: "sapUiTinyMarginTopBottom",
        editable: "true",
        children: {
          layoutData: EditStyle.getLayoutData(internalField)
        }
      });
    },
    /**
     * Helps to calculate the content edit functionality / templating.
     * Including a wrapper an hbox in case of collaboration mode finally
     * it calls internally EditStyle.getTemplate.
     * @param internalField Reference to the current internal field instance
     * @returns An XML-based string with the definition of the field control
     */
    getTemplateWithWrapper(internalField) {
      let contentEdit;
      if (internalField.editMode !== FieldEditMode.Display && !!internalField.editStyle) {
        if (internalField.collaborationEnabled ?? false) {
          contentEdit = _jsxs(CollaborationHBox, {
            width: "100%",
            alignItems: "End",
            children: [EditStyle.getTemplate(internalField), EditStyle.getCollaborationAvatar(internalField)]
          });
        } else {
          contentEdit = EditStyle.getTemplate(internalField);
        }
      }
      return contentEdit || "";
    },
    /**
     * Generates the InputMask template.
     * @param internalField Reference to the current internal field instance
     * @returns An XML-based string with the definition of the field control
     */
    getInputMaskTemplate(internalField) {
      const optionalMaskInputRules = [];
      const dataModelObjectPath = MetaModelConverter.getInvolvedDataModelObjects(internalField.metaPath, internalField.contextPath);
      const textAlign = getTextAlignment(dataModelObjectPath, internalField.formatOptions, internalField.editModeAsObject);
      if (internalField.mask?.maskRule) {
        for (const rule of internalField.mask.maskRule) {
          optionalMaskInputRules.push(_jsx(MaskInputRule, {
            maskFormatSymbol: rule.symbol,
            regex: rule.regex
          }));
        }
      }
      return _jsx(MaskInput, {
        "core:require": "{FieldAPI: 'sap/fe/macros/field/FieldAPI'}",
        id: internalField.editStyleId,
        value: internalField.valueBindingExpression,
        placeholder: internalField.editStylePlaceholder,
        width: "100%",
        editable: internalField.editableExpression,
        ariaLabelledBy: internalField.ariaLabelledBy,
        mask: internalField.mask?.mask,
        enabled: internalField.enabledExpression,
        required: internalField.requiredExpression,
        fieldGroupIds: internalField.fieldGroupIds,
        textAlign: textAlign,
        placeholderSymbol: internalField.mask?.placeholderSymbol,
        liveChange: internalField.eventHandlers.liveChange,
        validateFieldGroup: internalField.eventHandlers.validateFieldGroup,
        children: {
          rules: optionalMaskInputRules,
          customData: _jsx(CustomData, {
            value: internalField.dataSourcePath
          }, "sourcePath")
        }
      });
    },
    /**
     * Entry point for further templating processings.
     * @param internalField Reference to the current internal field instance
     * @returns An XML-based string with the definition of the field control
     */
    getTemplate: internalField => {
      let innerFieldContent;
      switch (internalField.editStyle) {
        case "CheckBox":
          innerFieldContent = EditStyle.getCheckBoxTemplate(internalField);
          break;
        case "DatePicker":
        case "DateTimePicker":
        case "TimePicker":
          {
            innerFieldContent = EditStyle.getDateTimePickerGeneric(internalField, internalField.editStyle);
            break;
          }
        case "Input":
          {
            innerFieldContent = EditStyle.getInputTemplate(internalField);
            break;
          }
        case "InputWithValueHelp":
          {
            innerFieldContent = EditStyle.getInputWithValueHelpTemplate(internalField);
            break;
          }
        case "RatingIndicator":
          innerFieldContent = EditStyle.getRatingIndicatorTemplate(internalField);
          break;
        case "TextArea":
          innerFieldContent = EditStyle.getTextAreaTemplate(internalField);
          break;
        case "InputMask":
          innerFieldContent = EditStyle.getInputMaskTemplate(internalField);
          break;
        default:
      }
      return innerFieldContent;
    }
  };
  return EditStyle;
}, false);
//# sourceMappingURL=EditStyle-dbg.js.map
