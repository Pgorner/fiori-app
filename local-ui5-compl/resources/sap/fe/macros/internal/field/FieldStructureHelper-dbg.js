/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/base/BindingToolkit", "sap/fe/core/controllerextensions/collaboration/CollaborationCommon", "sap/fe/core/converters/MetaModelConverter", "sap/fe/core/converters/annotations/DataField", "sap/fe/core/formatters/CollaborationFormatter", "sap/fe/core/formatters/ValueFormatter", "sap/fe/core/helpers/BindingHelper", "sap/fe/core/helpers/MetaModelFunction", "sap/fe/core/helpers/ModelHelper", "sap/fe/core/helpers/StableIdHelper", "sap/fe/core/helpers/TitleHelper", "sap/fe/core/helpers/TypeGuards", "sap/fe/core/templating/DataModelPathHelper", "sap/fe/core/templating/PropertyHelper", "sap/fe/core/templating/SemanticObjectHelper", "sap/fe/core/templating/UIFormatters", "sap/fe/macros/field/FieldTemplating", "sap/fe/macros/internal/valuehelp/AdditionalValueFormatter", "sap/fe/macros/situations/SituationsIndicator", "sap/ui/mdc/enums/FieldEditMode"], function (BindingToolkit, CollaborationCommon, MetaModelConverter, DataField, CollaborationFormatters, valueFormatters, BindingHelper, MetaModelFunction, ModelHelper, StableIdHelper, TitleHelper, TypeGuards, DataModelPathHelper, PropertyHelper, SemanticObjectHelper, UIFormatters, FieldTemplating, additionalValueFormatter, SituationsIndicator, FieldEditMode) {
  "use strict";

  var _exports = {};
  var setEditStyleProperties = FieldTemplating.setEditStyleProperties;
  var isUsedInNavigationWithQuickViewFacets = FieldTemplating.isUsedInNavigationWithQuickViewFacets;
  var isRetrieveTextFromValueListEnabled = FieldTemplating.isRetrieveTextFromValueListEnabled;
  var hasPropertyInsertRestrictions = FieldTemplating.hasPropertyInsertRestrictions;
  var getVisibleExpression = FieldTemplating.getVisibleExpression;
  var getValueBinding = FieldTemplating.getValueBinding;
  var getTextBindingExpression = FieldTemplating.getTextBindingExpression;
  var getDraftIndicatorVisibleBinding = FieldTemplating.getDraftIndicatorVisibleBinding;
  var getDataModelObjectPathForValue = FieldTemplating.getDataModelObjectPathForValue;
  var manageSemanticObjectsForCurrentUser = SemanticObjectHelper.manageSemanticObjectsForCurrentUser;
  var getPropertyWithSemanticObject = SemanticObjectHelper.getPropertyWithSemanticObject;
  var isSemanticKey = PropertyHelper.isSemanticKey;
  var getAssociatedExternalIdPropertyPath = PropertyHelper.getAssociatedExternalIdPropertyPath;
  var getAssociatedExternalIdProperty = PropertyHelper.getAssociatedExternalIdProperty;
  var getTargetObjectPath = DataModelPathHelper.getTargetObjectPath;
  var getRelativePaths = DataModelPathHelper.getRelativePaths;
  var getContextRelativeTargetObjectPath = DataModelPathHelper.getContextRelativeTargetObjectPath;
  var isPropertyPathExpression = TypeGuards.isPropertyPathExpression;
  var isProperty = TypeGuards.isProperty;
  var getTitleBindingExpression = TitleHelper.getTitleBindingExpression;
  var generate = StableIdHelper.generate;
  var getRequiredPropertiesFromUpdateRestrictions = MetaModelFunction.getRequiredPropertiesFromUpdateRestrictions;
  var getRequiredPropertiesFromInsertRestrictions = MetaModelFunction.getRequiredPropertiesFromInsertRestrictions;
  var UI = BindingHelper.UI;
  var isDataField = DataField.isDataField;
  var CollaborationFieldGroupPrefix = CollaborationCommon.CollaborationFieldGroupPrefix;
  var wrapBindingExpression = BindingToolkit.wrapBindingExpression;
  var resolveBindingString = BindingToolkit.resolveBindingString;
  var pathInModel = BindingToolkit.pathInModel;
  var not = BindingToolkit.not;
  var ifElse = BindingToolkit.ifElse;
  var getExpressionFromAnnotation = BindingToolkit.getExpressionFromAnnotation;
  var formatWithTypeInformation = BindingToolkit.formatWithTypeInformation;
  var formatResult = BindingToolkit.formatResult;
  var fn = BindingToolkit.fn;
  var equal = BindingToolkit.equal;
  var constant = BindingToolkit.constant;
  var compileExpression = BindingToolkit.compileExpression;
  var and = BindingToolkit.and;
  function setUpField(internalField, controlConfiguration, settings, metaPath, contextPath) {
    const resultField = {
      ...internalField
    };
    resultField.change = internalField.change;
    resultField.metaPath = metaPath ? metaPath : internalField.metaPath;
    resultField.contextPath = contextPath ? contextPath : internalField.contextPath;
    resultField.visible = internalField.visible;
    resultField.liveChangeEnabled = !!internalField.onLiveChange || internalField.hasListeners?.("liveChange");
    resultField.semanticObject = internalField.semanticObject;
    resultField.value = internalField.value;
    resultField.mainPropertyRelativePath = internalField.mainPropertyRelativePath;

    //this currently works only for the internal field
    if (!resultField.vhIdPrefix) {
      resultField.vhIdPrefix = "FieldValueHelp";
      resultField._flexId = internalField.id;
      if (!resultField.idPrefix) {
        resultField.idPrefix = internalField.id;
      }
      resultField.showValueHelpTemplate = true;
    }
    resultField.formatOptions ??= {};
    resultField.formatOptions = getFormatOptions(resultField);
    resultField.valueHelpMetaPath = metaPath ? metaPath : resultField.metaPath;
    computeCommonProperties(resultField, settings);
    resultField.convertedMetaPath = setUpDataPointType(resultField.convertedMetaPath);
    setUpVisibleProperties(resultField);
    computeIDs(resultField);
    resultField.dataSourcePath = getTargetObjectPath(resultField.dataModelPath);

    /* EXTERNALID */
    computeExternalID(resultField);
    resultField.entityType = resultField.odataMetaModel.createBindingContext(`/${resultField.dataModelPath.targetEntityType.fullyQualifiedName}`);
    if (resultField.formatOptions?.forInlineCreationRows === true) {
      resultField.hasPropertyInsertRestrictions = hasPropertyInsertRestrictions(resultField.dataModelPath);
    }
    computeEditMode(resultField);
    computeCollaborationProperties(resultField);
    computeEditableExpressions(resultField);
    resultField.formatOptions = resultField.formatOptions ? resultField.formatOptions : {};
    setUpFormatOptions(resultField, resultField.dataModelPathExternalID || resultField.dataModelPath, controlConfiguration, settings);
    setUpDisplayStyle(resultField, resultField.convertedMetaPath, resultField.dataModelPath, settings);
    setUpEditStyle(resultField, settings?.appComponent);
    resultField.valueState = setUpValueState(resultField);
    if (resultField.editStyle === "InputWithValueHelp") {
      resultField.editStylePlaceholder = setInputWithValuehelpPlaceholder(resultField);
    }

    // ---------------------------------------- compute bindings----------------------------------------------------
    const aDisplayStylesWithoutPropText = ["Avatar", "AmountWithCurrency"];
    if (resultField.displayStyle && !aDisplayStylesWithoutPropText.includes(resultField.displayStyle) && resultField.dataModelPath.targetObject) {
      resultField.text = resultField.text ?? resultField.value ?? FieldTemplating.getTextBinding(resultField.dataModelPathExternalID || resultField.dataModelPath, resultField.formatOptions);
    } else {
      resultField.text = "";
    }
    if (resultField.formatOptions.showEmptyIndicator) {
      resultField.emptyIndicatorMode = String(resultField.formatOptions.showEmptyIndicator) === "true" ? "On" : undefined;
    } else {
      resultField.emptyIndicatorMode = undefined;
    }

    // If the target is a property with a DataFieldDefault, use this as data field
    if (isProperty(resultField.convertedMetaPath) && resultField.convertedMetaPath.annotations?.UI?.DataFieldDefault !== undefined) {
      resultField.metaPath = resultField.odataMetaModel.createBindingContext(`@${"com.sap.vocabularies.UI.v1.DataFieldDefault"}`, metaPath ? metaPath : resultField.metaPath);
    }
    if (resultField.readOnly !== undefined) {
      resultField.editMode = compileExpression(ifElse(equal(resolveBindingString(resultField.readOnly, "boolean"), true), "Display", "Editable"));
    }
    resultField.eventHandlers = {
      change: () => {},
      liveChange: () => {},
      validateFieldGroup: () => {}
    };
    return resultField;
  }

  /**
   * This helper computes the properties that are needed for the collaboration avatar.
   * @param internalField Reference to the current internal field instance
   */
  _exports.setUpField = setUpField;
  function computeCollaborationProperties(internalField) {
    const computedEditableExpression = UIFormatters.getEditableExpressionAsObject(internalField.propertyForFieldControl, internalField.convertedMetaPath, internalField.dataModelPath);
    if (ModelHelper.isCollaborationDraftSupported(internalField.odataMetaModel) && internalField.editMode !== FieldEditMode.Display) {
      const collaborationEnabled = true;
      // Expressions needed for Collaboration Visualization
      const collaborationExpression = UIFormatters.getCollaborationExpression(internalField.dataModelPath, CollaborationFormatters.hasCollaborationActivity);
      const editableExpression = compileExpression(and(computedEditableExpression, not(collaborationExpression)));
      const editMode = compileExpression(ifElse(collaborationExpression, constant("ReadOnly"), ifElse(and(UI.IsInactive, !!internalField.hasPropertyInsertRestrictions), "Display", internalField.editModeAsObject)));
      internalField.collaborationEnabled = collaborationEnabled;
      internalField.collaborationExpression = collaborationExpression;
      internalField.editableExpression = editableExpression;
      internalField.editMode = editMode;
    } else {
      internalField.editableExpression = compileExpression(computedEditableExpression);
    }
  }

  /**
   * This helper sets the common properties convertedMetaPath, dataModelPath
   * and property that can be reused in the individual templates if required.
   * @param internalField Reference to the current internal field instance
   * @param settings
   */
  _exports.computeCollaborationProperties = computeCollaborationProperties;
  function computeCommonProperties(internalField, settings) {
    internalField.convertedMetaPath = MetaModelConverter.convertMetaModelContext(internalField.metaPathContext ? internalField.metaPathContext : internalField.metaPath);
    let dataModelPath = MetaModelConverter.getInvolvedDataModelObjects(internalField.metaPathContext ? internalField.metaPathContext : internalField.metaPath, internalField.contextPath);
    dataModelPath = getDataModelObjectPathForValue(dataModelPath) || dataModelPath;
    internalField.dataModelPath = dataModelPath;
    internalField.property = dataModelPath.targetObject;
    internalField.odataMetaModel = settings.models.metaModel || settings.models.contextPath;
    internalField.propertyForFieldControl = dataModelPath?.targetObject?.Value ? (dataModelPath?.targetObject).Value : dataModelPath?.targetObject;
  }

  /**
   * Helper to computes some of the expression for further processing.
   * @param internalField Reference to the current internal field instance
   */
  _exports.computeCommonProperties = computeCommonProperties;
  function computeEditableExpressions(internalField) {
    const requiredPropertiesFromInsertRestrictions = getRequiredPropertiesFromInsertRestrictions((internalField.contextPathContext ? internalField.contextPathContext : internalField.contextPath)?.getPath().replaceAll("/$NavigationPropertyBinding/", "/"), internalField.odataMetaModel);
    const requiredPropertiesFromUpdateRestrictions = getRequiredPropertiesFromUpdateRestrictions((internalField.contextPathContext ? internalField.contextPathContext : internalField.contextPath)?.getPath().replaceAll("/$NavigationPropertyBinding/", "/"), internalField.odataMetaModel);
    const oRequiredProperties = {
      requiredPropertiesFromInsertRestrictions: requiredPropertiesFromInsertRestrictions,
      requiredPropertiesFromUpdateRestrictions: requiredPropertiesFromUpdateRestrictions
    };
    const liveChangeEnabled = internalField.liveChangeEnabled;
    const enabledExpression = UIFormatters.getEnabledExpression(internalField.propertyForFieldControl, internalField.convertedMetaPath, false, internalField.dataModelPath);
    const requiredExpression = UIFormatters.getRequiredExpression(internalField.propertyForFieldControl, internalField.convertedMetaPath, false, false, oRequiredProperties, internalField.dataModelPath);
    internalField.liveChangeEnabled = liveChangeEnabled;
    internalField.enabledExpression = enabledExpression;
    internalField.requiredExpression = requiredExpression;
  }
  _exports.computeEditableExpressions = computeEditableExpressions;
  function computeEditMode(internalField) {
    if (internalField.editMode !== undefined && internalField.editMode !== null) {
      // Even if it provided as a string it's a valid part of a binding expression that can be later combined into something else.
      internalField.editModeAsObject = internalField.editMode;
    } else {
      const measureReadOnly = internalField.formatOptions?.measureDisplayMode ? internalField.formatOptions.measureDisplayMode === "ReadOnly" : false;
      internalField.editModeAsObject = UIFormatters.getEditMode(internalField.propertyForFieldControl, internalField.dataModelPath, measureReadOnly, true, internalField.convertedMetaPath);
      internalField.editMode = compileExpression(ifElse(and(UI.IsInactive, !!internalField.hasPropertyInsertRestrictions), "Display", internalField.editModeAsObject));
    }
  }
  _exports.computeEditMode = computeEditMode;
  function computeExternalID(internalField) {
    const externalIDProperty = getAssociatedExternalIdProperty(internalField.property);
    if (externalIDProperty) {
      if (internalField.property) internalField.property.type = externalIDProperty.type;
      if (isDataField(internalField.convertedMetaPath)) {
        internalField.convertedMetaPath.Value.$target.type = externalIDProperty.type;
      }
      const externalIdPropertyPath = getAssociatedExternalIdPropertyPath(internalField.property);
      const externalIdContext = internalField.metaPath.getModel().createBindingContext(internalField.contextPath?.getPath() + "/" + externalIdPropertyPath, internalField.metaPath);
      internalField.convertedMetaPathExternalID = MetaModelConverter.convertMetaModelContext(externalIdContext);
      let dataModelPath = MetaModelConverter.getInvolvedDataModelObjects(externalIdContext, internalField.contextPath);
      dataModelPath = getDataModelObjectPathForValue(dataModelPath) || dataModelPath;
      internalField.dataModelPathExternalID = dataModelPath;
    }
  }

  /**
   * Calculate the fieldGroupIds for an Input or other edit control.
   * @param field
   * @param appComponent
   * @returns The fieldGroupIds
   */
  _exports.computeExternalID = computeExternalID;
  function computeFieldGroupIds(field, appComponent) {
    const typesForCollaborationFocusManagement = ["InputWithValueHelp", "TextArea", "DatePicker", "TimePicker", "DateTimePicker", "InputWithUnit", "Input", "InputMask"];
    if (!appComponent) {
      //for ValueHelp / Mass edit Templating the appComponent is not passed to the templating
      return;
    }
    const sideEffectService = appComponent.getSideEffectsService();
    const fieldGroupIds = sideEffectService.computeFieldGroupIds(field.dataModelPath.targetEntityType?.fullyQualifiedName ?? "", field.dataModelPath.targetObject?.fullyQualifiedName ?? "");
    if (field.collaborationEnabled && typesForCollaborationFocusManagement.includes(field.editStyle || "")) {
      const collaborationFieldGroup = `${CollaborationFieldGroupPrefix}${field.dataSourcePath}`;
      fieldGroupIds.push(collaborationFieldGroup);
      field.mainPropertyRelativePath = isProperty(field.dataModelPath.targetObject) ? getContextRelativeTargetObjectPath(field.dataModelPath) : undefined;
    }
    return fieldGroupIds.length ? fieldGroupIds.join(",") : undefined;
  }

  /**
   * This helper is for the ID of the InternalField according to several different scenarios.
   *
   * displayStyleId is used for all controls inside the field wrapper in display mode. A <sap.m.text> control would get this ID. An example is: ApplicationContext::Field-display.
   * editStyleId is used for all controls inside the field wrapper in edit mode. A <sap.ui.mdc.field> control would get this ID. An example is: ApplicationContext::Field-edit.
   *
   * If no wrapper exists the wrappers ID will be propagated to the first control displayed, A <sap.m.text> control would get this ID. An example is: ApplicationContext::Field-content.
   * @param internalField Reference to the current internal field instance
   */
  function computeIDs(internalField) {
    if (internalField._flexId) {
      internalField._apiId = internalField._flexId;
      internalField._flexId = getContentId(internalField._flexId);
      internalField._vhFlexId = `${internalField._flexId}_${internalField.vhIdPrefix}`;
    }
    if (internalField.idPrefix) {
      internalField.editStyleId = generate([internalField.idPrefix, "Field-edit"]);
    }
    //NoWrapperId scenario is for the LR table.
    if (internalField.formatOptions?.fieldMode === "nowrapper" && internalField.editMode === "Display") {
      if (internalField._flexId) {
        internalField.displayStyleId = internalField._flexId;
      } else {
        internalField.displayStyleId = internalField.idPrefix ? generate([internalField.idPrefix, "Field-content"]) : undefined;
      }
    } else if (internalField.idPrefix) {
      internalField.displayStyleId = generate([internalField.idPrefix, "Field-display"]);
    }
  }

  /**
   * Sets the internal formatOptions for the building block.
   * @param field
   * @returns A string with the internal formatOptions for the building block
   */
  _exports.computeIDs = computeIDs;
  function getFormatOptions(field) {
    return {
      ...field.formatOptions,
      textAlignMode: field.formatOptions.textAlignMode ?? "Form",
      showEmptyIndicator: field.formatOptions.showEmptyIndicator ?? true,
      displayMode: field.formatOptions.displayMode,
      measureDisplayMode: field.formatOptions.measureDisplayMode,
      textLinesEdit: field.formatOptions.textLinesEdit,
      textMaxLines: field.formatOptions.textMaxLines,
      textMaxCharactersDisplay: field.formatOptions.textMaxCharactersDisplay,
      textExpandBehaviorDisplay: field.formatOptions.textExpandBehaviorDisplay,
      textMaxLength: field.formatOptions.textMaxLength,
      fieldEditStyle: field.formatOptions.fieldEditStyle,
      radioButtonsHorizontalLayout: field.formatOptions.radioButtonsHorizontalLayout,
      showTime: field.formatOptions.showTime,
      showTimezone: field.formatOptions.showTimezone,
      showDate: field.formatOptions.showDate
    };
  }
  _exports.getFormatOptions = getFormatOptions;
  function getObjectIdentifierText(fieldFormatOptions, propertyDataModelObjectPath) {
    let propertyBindingExpression = pathInModel(getContextRelativeTargetObjectPath(propertyDataModelObjectPath));
    const targetDisplayMode = fieldFormatOptions?.displayMode;
    const propertyDefinition = isPropertyPathExpression(propertyDataModelObjectPath.targetObject) ? propertyDataModelObjectPath.targetObject.$target : propertyDataModelObjectPath.targetObject;
    const commonText = propertyDefinition.annotations?.Common?.Text;
    if (commonText === undefined) {
      return undefined;
    }
    propertyBindingExpression = formatWithTypeInformation(propertyDefinition, propertyBindingExpression);
    switch (targetDisplayMode) {
      case "ValueDescription":
        const relativeLocation = getRelativePaths(propertyDataModelObjectPath);
        return compileExpression(getExpressionFromAnnotation(commonText, relativeLocation));
      case "DescriptionValue":
        return compileExpression(formatResult([propertyBindingExpression], valueFormatters.formatToKeepWhitespace));
      default:
        return undefined;
    }
  }
  function getOverrides(controlConfiguration, id) {
    /*
    	Qualms: We need to use this TemplateProcessorSettings type to be able to iterate
    	over the properties later on and cast it afterwards as a field property type
    */
    const props = {};
    if (controlConfiguration) {
      const controlConfig = controlConfiguration[id];
      if (controlConfig) {
        Object.keys(controlConfig).forEach(function (configKey) {
          props[configKey] = controlConfig[configKey];
        });
      }
    }
    return props;
  }

  /**
   * Prepare the display style of the field in case of semantic objects or quickview facets.
   * @param internalField The field
   * @param settings
   * @param dataModelPath The DataModelObjectPath of the property
   * @param hasSemanticObjects
   * @param hasQuickView
   */
  function manageQuickViewForDisplayStyle(internalField, settings, dataModelPath, hasSemanticObjects, hasQuickView) {
    if (hasQuickView) {
      internalField.hasQuickView = true;
      internalField.quickViewType = "Facets";
    }
    if (hasSemanticObjects) {
      const foundSemanticObjects = manageSemanticObjectsForCurrentUser(internalField.semanticObject, dataModelPath, settings);
      if (foundSemanticObjects.hasReachableStaticSemanticObject || foundSemanticObjects.dynamicSemanticObjects.length) {
        internalField.hasQuickView = true;
        internalField.quickViewType = hasQuickView ? "FacetsAndSemanticLinks" : "SemanticLinks";
        internalField.dynamicSemanticObjects = foundSemanticObjects.hasReachableStaticSemanticObject !== true ? foundSemanticObjects.dynamicSemanticObjects : undefined;
      }
    }
  }

  /**
   * Check field to know if it has semantic object.
   * @param internalField The field
   * @param dataModelPath The DataModelObjectPath of the property
   * @returns True if field has a semantic object
   */
  function propertyOrNavigationPropertyHasSemanticObject(internalField, dataModelPath) {
    return !!getPropertyWithSemanticObject(dataModelPath) || internalField.semanticObject !== undefined && internalField.semanticObject !== "";
  }
  function setInputWithValuehelpPlaceholder(internalField) {
    let targetEntityType;
    const editStylePlaceholder = internalField.editStylePlaceholder;
    const fieldContainerType = internalField.formatOptions.textAlignMode;
    if (fieldContainerType === "Table") {
      targetEntityType = internalField.dataModelPath.targetEntityType;
    }
    const propertyPath = internalField.dataModelPath.targetObject?.name;
    const recommendationValue = pathInModel(`${propertyPath}@$ui5.fe.recommendations.placeholderValue`);
    const recommendationDescription = pathInModel(`${propertyPath}@$ui5.fe.recommendations.placeholderDescription`);
    const placeholderExp = formatResult([recommendationValue, recommendationDescription, pathInModel(`/recommendationsData`, "internal"), pathInModel(`/currentCtxt`, "internal"), pathInModel(`${propertyPath}@$ui5.fe.messageType`), editStylePlaceholder, internalField.formatOptions.displayMode], additionalValueFormatter.formatPlaceholder, targetEntityType);
    return compileExpression(placeholderExp);
  }
  _exports.setInputWithValuehelpPlaceholder = setInputWithValuehelpPlaceholder;
  function setUpDataPointType(dataField) {
    // data point annotations need not have $Type defined, so add it if missing
    const dataPointType = {
      ...dataField
    };
    if (dataField?.term === "com.sap.vocabularies.UI.v1.DataPoint") {
      dataPointType.$Type = dataField.$Type || "com.sap.vocabularies.UI.v1.DataPointType";
    }
    return dataPointType;
  }
  _exports.setUpDataPointType = setUpDataPointType;
  function setUpDisplayStyle(internalField, dataField, dataModelPath, settings) {
    const resultField = internalField;
    const property = dataModelPath.targetObject;
    if (!dataModelPath.targetObject) {
      resultField.displayStyle = "Text";
      return resultField;
    }
    resultField.hasUnitOrCurrency = property.annotations?.Measures?.Unit !== undefined || property.annotations?.Measures?.ISOCurrency !== undefined;
    resultField.hasValidAnalyticalCurrencyOrUnit = UIFormatters.hasValidAnalyticalCurrencyOrUnit(dataModelPath);
    resultField.textFromValueList = wrapBindingExpression(compileExpression(fn("FieldRuntime.retrieveTextFromValueList", [pathInModel(getContextRelativeTargetObjectPath(dataModelPath)), `/${property.fullyQualifiedName}`, resultField.formatOptions.displayMode])), false);
    if (property.annotations?.UI?.IsImage) {
      resultField.displayStyle = "File";
      return resultField;
    }
    if (property.annotations?.UI?.IsImageURL) {
      resultField.displayStyle = "Avatar";
      return resultField;
    }
    if (property.annotations?.UI?.InputMask) {
      resultField.displayStyle = "Text";
      return resultField;
    }
    // For compatibility reasons, Stream will be shown within an entity instance as circle if the entity is annotated as IsNaturalPerson
    // and neither IsImage nor IsImageURL annotation has been used.
    if (property.type === "Edm.Stream") {
      resultField.displayStyle = "File";
      return resultField;
    }
    setUpDraftIndicator(dataModelPath, resultField);
    switch (dataField.$Type) {
      case "com.sap.vocabularies.UI.v1.DataPointType":
        resultField.displayStyle = "DataPoint";
        return resultField;
      case "com.sap.vocabularies.UI.v1.DataFieldForAnnotation":
        if (dataField.Target?.$target?.$Type === "com.sap.vocabularies.UI.v1.DataPointType") {
          resultField.displayStyle = "DataPoint";
          return resultField;
        } else if (dataField.Target?.$target?.$Type === "com.sap.vocabularies.Communication.v1.ContactType") {
          resultField.displayStyle = "Contact";
          return resultField;
        }
        break;
      case "com.sap.vocabularies.UI.v1.DataFieldForAction":
      case "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation":
        resultField.displayStyle = "Button";
        return resultField;
      case "com.sap.vocabularies.UI.v1.DataFieldWithIntentBasedNavigation":
      case "com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath":
      case "com.sap.vocabularies.UI.v1.DataFieldWithAction":
        resultField.displayStyle = "Link";
        return resultField;
    }
    const hasQuickView = isUsedInNavigationWithQuickViewFacets(dataModelPath, property);
    const hasSemanticObjects = propertyOrNavigationPropertyHasSemanticObject(resultField, dataModelPath);
    if (isSemanticKey(property, dataModelPath) && resultField.formatOptions.semanticKeyStyle) {
      manageQuickViewForDisplayStyle(resultField, settings, dataModelPath, hasSemanticObjects, hasQuickView);
      setUpObjectIdentifierTitleAndText(resultField, dataModelPath);
      resultField.showErrorIndicator = dataModelPath.contextLocation?.targetObject?._type === "NavigationProperty" && !resultField.formatOptions.fieldGroupDraftIndicatorPropertyPath;
      resultField.situationsIndicatorPropertyPath = dataModelPath.targetObject.name;
      resultField.displayStyle = resultField.formatOptions.semanticKeyStyle === "ObjectIdentifier" ? "ObjectIdentifier" : "LabelSemanticKey";
      return resultField;
    }
    if (dataField.Criticality) {
      manageQuickViewForDisplayStyle(resultField, settings, dataModelPath, hasSemanticObjects, hasQuickView);
      resultField.displayStyle = "ObjectStatus";
      return resultField;
    }
    if (property.annotations?.Measures?.ISOCurrency && String(resultField.formatOptions.isCurrencyAligned) === "true" && resultField.formatOptions.measureDisplayMode !== "Hidden") {
      resultField.valueAsStringBindingExpression = resultField.value ? resultField.value : getValueBinding(dataModelPath, resultField.formatOptions, true, true, undefined, true);
      resultField.unitBindingExpression = compileExpression(UIFormatters.getBindingForUnitOrCurrency(dataModelPath));
      resultField.displayStyle = "AmountWithCurrency";
      return resultField;
    }
    if (property.annotations?.Communication?.IsEmailAddress || property.annotations?.Communication?.IsPhoneNumber) {
      resultField.displayStyle = "Link";
      return resultField;
    }
    if (property.annotations?.UI?.MultiLineText) {
      resultField.displayStyle = "ExpandableText";
      return resultField;
    }
    if (dataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldWithUrl") {
      resultField.displayStyle = "Link";
      return resultField;
    }
    resultField.displayStyle = "Text";
    manageQuickViewForDisplayStyle(resultField, settings, dataModelPath, hasSemanticObjects, hasQuickView);
    if (resultField.hasQuickView) {
      resultField.displayStyle = "LinkWithQuickView";
    }
    return resultField;
  }

  /**
   * This determines whether we should add a draft indicator within the field template.
   * @param dataModelPath DataModelObjectPath pointing to the main property for the field
   * @param internalField
   */
  _exports.setUpDisplayStyle = setUpDisplayStyle;
  function setUpDraftIndicator(dataModelPath, internalField) {
    if (isSemanticKey(dataModelPath.targetObject, dataModelPath)) {
      internalField.hasSituationsIndicator = SituationsIndicator.getSituationsNavigationProperty(dataModelPath.targetEntityType) !== undefined;
      if (dataModelPath.contextLocation?.targetEntitySet?.annotations?.Common?.DraftRoot && dataModelPath.targetEntitySet?.annotations?.Common?.DraftRoot && internalField.formatOptions?.hasDraftIndicator === true) {
        // In case of a grid table or tree table hasDraftIndicator will be false since the draft
        // indicator needs to be rendered into a separate column
        // Hence we then fall back to display styles ObjectIdentifier or LabelSemanticKey instead
        // of the combined ID and draft indicator style
        internalField.draftIndicatorVisible = getDraftIndicatorVisibleBinding(dataModelPath.targetObject?.name);
        internalField.addDraftIndicator = true;
      }
    }
  }
  function setUpEditStyle(field, appComponent) {
    const resultField = field;
    setEditStyleProperties(resultField, resultField.convertedMetaPath, resultField.dataModelPath);
    resultField.fieldGroupIds = computeFieldGroupIds(resultField, appComponent);
    return resultField;
  }
  _exports.setUpEditStyle = setUpEditStyle;
  function setUpObjectIdentifierTitleAndText(internalField, propertyDataModelObjectPath) {
    const semanticStyle = internalField.formatOptions?.semanticKeyStyle;
    const displayMode = internalField.formatOptions.displayMode;
    internalField.identifierTitle = getTitleBindingExpression(propertyDataModelObjectPath, getTextBindingExpression, {
      displayMode,
      splitTitleOnTwoLines: internalField.formatOptions.semanticKeyStyle === "ObjectIdentifier"
    }, undefined, undefined);
    internalField.identifierText = semanticStyle === "ObjectIdentifier" ? getObjectIdentifierText(internalField.formatOptions, propertyDataModelObjectPath) : undefined;
  }
  _exports.setUpObjectIdentifierTitleAndText = setUpObjectIdentifierTitleAndText;
  function setUpFormatOptions(internalField, dataModelPath, controlConfiguration, settings) {
    const overrideProps = getOverrides(controlConfiguration, (internalField.metaPathContext ? internalField.metaPathContext : internalField.metaPath).getPath());
    if (!internalField.formatOptions.displayMode) {
      internalField.formatOptions.displayMode = UIFormatters.getDisplayMode(dataModelPath);
    }
    if (internalField.formatOptions.displayMode === "Description") {
      internalField.valueAsStringBindingExpression = internalField.value ? internalField.value : getValueBinding(dataModelPath, internalField.formatOptions, true, true, undefined, true);
    }
    internalField.formatOptions.textLinesEdit = overrideProps.textLinesEdit || overrideProps.formatOptions && overrideProps.formatOptions.textLinesEdit || internalField.formatOptions.textLinesEdit || 4;
    internalField.formatOptions.textMaxLines = overrideProps.textMaxLines || overrideProps.formatOptions && overrideProps.formatOptions.textMaxLines || internalField.formatOptions.textMaxLines;

    // Retrieve text from value list as fallback feature for missing text annotation on the property
    if (settings.models.viewData?.getProperty("/retrieveTextFromValueList")) {
      internalField.formatOptions.retrieveTextFromValueList = isRetrieveTextFromValueListEnabled(dataModelPath.targetObject, internalField.formatOptions);
      if (internalField.formatOptions.retrieveTextFromValueList) {
        // Consider TextArrangement at EntityType otherwise set default display format 'DescriptionValue'
        const hasEntityTextArrangement = !!dataModelPath?.targetEntityType?.annotations?.UI?.TextArrangement;
        internalField.formatOptions.displayMode = hasEntityTextArrangement ? internalField.formatOptions.displayMode : "DescriptionValue";
      }
    }
  }
  _exports.setUpFormatOptions = setUpFormatOptions;
  function setUpValueState(internalField) {
    let valueStateExp;
    const fieldContainerType = internalField.formatOptions?.textAlignMode ? internalField.formatOptions?.textAlignMode : "Form";
    const propertyPathInModel = pathInModel(getContextRelativeTargetObjectPath(internalField.dataModelPath));
    const relativeLocation = getRelativePaths(internalField.dataModelPath);
    const textPath = getExpressionFromAnnotation(internalField.dataModelPath?.targetObject?.annotations?.Common?.Text, relativeLocation);
    const propertyPath = internalField.dataModelPath.targetObject?.name;
    const recommendationValue = pathInModel(`${propertyPath}@$ui5.fe.recommendations.placeholderValue`);
    const recommendationDescription = pathInModel(`${propertyPath}@$ui5.fe.recommendations.placeholderDescription`);
    if (fieldContainerType === "Table") {
      valueStateExp = formatResult([recommendationValue, recommendationDescription, pathInModel(`/recommendationsData`, "internal"), pathInModel(`/isEditable`, "ui"), internalField.dataSourcePath, propertyPathInModel, textPath], additionalValueFormatter.formatValueState, internalField.dataModelPath.targetEntityType);
    } else {
      valueStateExp = formatResult([recommendationValue, recommendationDescription, pathInModel(`/recommendationsData`, "internal"), pathInModel(`/isEditable`, "ui"), internalField.dataSourcePath, propertyPathInModel, textPath], additionalValueFormatter.formatValueState);
    }
    internalField.valueState = compileExpression(valueStateExp);
    return internalField.valueState;
  }
  _exports.setUpValueState = setUpValueState;
  function setUpVisibleProperties(internalField) {
    // we do this before enhancing the dataModelPath so that it still points at the DataField
    // const visibleProperties: Partial<InternalFieldBlock> = {};
    const propertyDataModelObjectPath = MetaModelConverter.getInvolvedDataModelObjects(internalField.metaPathContext ? internalField.metaPathContext : internalField.metaPath, internalField.contextPath);
    internalField.visible = internalField.visible ??= getVisibleExpression(propertyDataModelObjectPath, internalField.formatOptions);
    internalField.displayVisible = internalField.formatOptions?.fieldMode === "nowrapper" ? internalField.visible : undefined;
  }
  _exports.setUpVisibleProperties = setUpVisibleProperties;
  function getContentId(macroId) {
    return `${macroId}-content`;
  }
  return _exports;
}, false);
//# sourceMappingURL=FieldStructureHelper-dbg.js.map
