/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/util/uid", "sap/fe/base/BindingToolkit", "sap/fe/core/controls/FormElementWrapper", "sap/fe/core/converters/MetaModelConverter", "sap/fe/core/formatters/ValueFormatter", "sap/fe/core/helpers/StableIdHelper", "sap/fe/core/helpers/TypeGuards", "sap/fe/core/templating/CriticalityFormatters", "sap/fe/core/templating/DataModelPathHelper", "sap/fe/core/templating/UIFormatters", "sap/fe/macros/CommonHelper", "sap/fe/macros/field/FieldHelper", "sap/fe/macros/field/FieldTemplating", "sap/fe/macros/quickView/QuickView", "sap/m/Avatar", "sap/m/Button", "sap/m/ExpandableText", "sap/m/HBox", "sap/m/ImageCustomData", "sap/m/Label", "sap/m/Link", "sap/m/ObjectIdentifier", "sap/m/ObjectStatus", "sap/m/Text", "sap/m/VBox", "sap/m/library", "sap/ui/core/CustomData", "sap/ui/core/Icon", "sap/ui/mdc/enums/FieldEditMode", "sap/ui/unified/Currency", "sap/ui/unified/FileUploader", "../../contact/Contact", "../../contact/Email", "../../controls/ConditionalWrapper", "../../controls/FileWrapper", "../../controls/TextLink", "../../draftIndicator/DraftIndicator", "../../situations/SituationsIndicator", "../DataPoint", "sap/fe/base/jsx-runtime/jsx", "sap/fe/base/jsx-runtime/jsxs"], function (uid, BindingToolkit, FormElementWrapper, MetaModelConverter, valueFormatters, StableIdHelper, TypeGuards, CriticalityFormatters, DataModelPathHelper, UIFormatters, CommonHelper, FieldHelper, FieldTemplating, QuickView, Avatar, Button, ExpandableText, HBox, ImageCustomData, Label, Link, ObjectIdentifier, ObjectStatus, Text, VBox, library, CustomData, Icon, FieldEditMode, Currency, FileUploader, Contact, Email, ConditionalWrapper, FileWrapper, TextLink, DraftIndicator, SituationsIndicator, DataPoint, _jsx, _jsxs) {
  "use strict";

  var ObjectMarkerVisibility = library.ObjectMarkerVisibility;
  var LinkAccessibleRole = library.LinkAccessibleRole;
  var hasValidAnalyticalCurrencyOrUnit = UIFormatters.hasValidAnalyticalCurrencyOrUnit;
  var getContextRelativeTargetObjectPath = DataModelPathHelper.getContextRelativeTargetObjectPath;
  var enhanceDataModelPath = DataModelPathHelper.enhanceDataModelPath;
  var buildExpressionForCriticalityIcon = CriticalityFormatters.buildExpressionForCriticalityIcon;
  var buildExpressionForCriticalityColor = CriticalityFormatters.buildExpressionForCriticalityColor;
  var buildExpressionForCriticalityButtonType = CriticalityFormatters.buildExpressionForCriticalityButtonType;
  var isPathAnnotationExpression = TypeGuards.isPathAnnotationExpression;
  var generate = StableIdHelper.generate;
  var pathInModel = BindingToolkit.pathInModel;
  var not = BindingToolkit.not;
  var isPathInModelExpression = BindingToolkit.isPathInModelExpression;
  var ifElse = BindingToolkit.ifElse;
  var getExpressionFromAnnotation = BindingToolkit.getExpressionFromAnnotation;
  var formatResult = BindingToolkit.formatResult;
  var equal = BindingToolkit.equal;
  var constant = BindingToolkit.constant;
  var compileExpression = BindingToolkit.compileExpression;
  const DisplayStyle = {
    getPrecisionForCurrency(internalField) {
      let scale = internalField.property.scale ?? 5;
      if (typeof scale !== "number") {
        // Scale can be "variable" but it's not typed as such. In this case, Scale equals the precision
        scale = internalField.property.precision ?? 5;
      }
      return Math.min(scale, 5);
    },
    getCurrencyOrUnitControl(internalField, currencyOrUnit, visibleExpression) {
      return _jsx(Link, {
        "core:require": "{FIELDRUNTIME: 'sap/fe/macros/field/FieldRuntime'}",
        text: "{sap.fe.i18n>M_TABLE_SHOW_DETAILS}",
        press: `FIELDRUNTIME.displayAggregateDetails($event, '${getContextRelativeTargetObjectPath(internalField.dataModelPath)}')`,
        visible: visibleExpression,
        children: {
          dependents: currencyOrUnit
        }
      });
    },
    /**
     * Generates the AmountWithCurrency template.
     * @param internalField Reference to the current internal field instance
     * @returns An XML-based string with the definition of the field control
     */
    getAmountWithCurrencyTemplate(internalField) {
      const maxPrecision = DisplayStyle.getPrecisionForCurrency(internalField);

      // We don't display anything if the value is undefined
      const relativePropertyPath = getContextRelativeTargetObjectPath(internalField.dataModelPath);
      const overallVisible = not(equal(pathInModel(relativePropertyPath), undefined));
      if (internalField.formatOptions.isAnalytics) {
        const currency = _jsx(Currency, {
          stringValue: internalField.valueAsStringBindingExpression,
          currency: internalField.unitBindingExpression,
          useSymbol: "false",
          maxPrecision: maxPrecision,
          visible: overallVisible
        });
        return _jsx(ConditionalWrapper, {
          visible: internalField.displayVisible,
          condition: internalField.hasValidAnalyticalCurrencyOrUnit,
          children: {
            contentTrue: currency,
            contentFalse: this.getCurrencyOrUnitControl(internalField, currency, overallVisible)
          }
        });
      } else {
        return _jsx(FormElementWrapper, {
          formDoNotAdjustWidth: true,
          width: internalField.formatOptions.textAlignMode === "Table" ? "100%" : undefined,
          visible: overallVisible,
          children: _jsx(Currency, {
            visible: internalField.displayVisible,
            stringValue: internalField.valueAsStringBindingExpression,
            currency: internalField.unitBindingExpression,
            useSymbol: "false",
            maxPrecision: maxPrecision
          })
        });
      }
    },
    /**
     * Generates the Avatar template.
     * @param internalField Reference to the current internal field instance
     * @returns An XML-based string with the definition of the field control
     */
    getAvatarTemplate(internalField) {
      let avatarId;
      if (internalField._flexId) {
        avatarId = internalField._flexId;
      } else if (internalField.idPrefix) {
        avatarId = generate([internalField.idPrefix, "Field-content"]);
      }
      const avatarVisible = FieldTemplating.getVisibleExpression(internalField.dataModelPath);
      const avatarSrc = FieldTemplating.getValueBinding(internalField.dataModelPath, {});
      const avatarDisplayShape = FieldTemplating.getAvatarShape(internalField.dataModelPath);
      return _jsx(FormElementWrapper, {
        visible: avatarVisible,
        children: _jsx(Avatar, {
          id: avatarId,
          src: avatarSrc,
          displaySize: "S",
          class: "sapUiSmallMarginEnd",
          imageFitType: "Cover",
          displayShape: avatarDisplayShape
        })
      });
    },
    /**
     * Generates the button template.
     * @param internalField Reference to the current internal field instance
     * @returns An XML-based string with the definition of the field control
     */
    getButtonTemplate: internalField => {
      const icon = internalField.formatOptions?.showIconUrl ?? false ? internalField.convertedMetaPath.IconUrl : undefined;
      const text = !(internalField.formatOptions?.showIconUrl ?? false) ? internalField.convertedMetaPath.Label : undefined;
      const tooltip = internalField.formatOptions?.showIconUrl ?? false ? internalField.convertedMetaPath.Label : undefined;
      let buttonPress;
      let buttonIsBound;
      let buttonOperationAvailable;
      let buttonOperationAvailableFormatted;
      let navigationAvailable;
      if (internalField.convertedMetaPath.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction") {
        //Qualms: the getObject is a bad practice, but for now it´s fine as an intermediate step to avoid refactoring of the helper in addition
        const dataFieldObject = internalField.metaPath.getObject();
        buttonPress = FieldHelper.getPressEventForDataFieldActionButton(internalField, dataFieldObject);
        buttonIsBound = internalField.convertedMetaPath.ActionTarget ? internalField.convertedMetaPath.ActionTarget.isBound : true;
        buttonOperationAvailable = internalField.convertedMetaPath.ActionTarget ? internalField.convertedMetaPath.ActionTarget.annotations?.Core?.OperationAvailable : "false";
        buttonOperationAvailableFormatted = internalField.convertedMetaPath.ActionTarget ? undefined : "false";
        if (buttonOperationAvailable && buttonOperationAvailable !== "false") {
          const actionTarget = internalField.convertedMetaPath.ActionTarget;
          const bindingParamName = actionTarget.parameters[0].name;
          //QUALMS, needs to be checked whether this makes sense at that place, might be good in a dedicated helper function
          buttonOperationAvailableFormatted = compileExpression(getExpressionFromAnnotation(buttonOperationAvailable, [], undefined, path => {
            if (path.startsWith(bindingParamName)) {
              return path.replace(bindingParamName + "/", "");
            }
            return path;
          }));
        }
      }
      if (internalField.convertedMetaPath.$Type === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation") {
        buttonPress = CommonHelper.getPressHandlerForDataFieldForIBN(internalField.metaPath.getObject(), undefined, undefined);
        navigationAvailable = true;
        if (internalField.convertedMetaPath?.$Type === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation" && internalField.convertedMetaPath.NavigationAvailable !== undefined && String(internalField.formatOptions.ignoreNavigationAvailable) !== "true") {
          navigationAvailable = compileExpression(getExpressionFromAnnotation(internalField.convertedMetaPath.NavigationAvailable));
        }
      }
      let button = "";
      if (internalField.convertedMetaPath.$Type === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation") {
        button = _jsx(Button, {
          visible: internalField.visible,
          text: text,
          icon: icon,
          enabled: navigationAvailable,
          tooltip: tooltip,
          press: buttonPress
        });
      } else if (FieldHelper.isDataFieldActionButtonVisible(internalField.convertedMetaPath, buttonIsBound, buttonOperationAvailable)) {
        const enabled = FieldHelper.isDataFieldActionButtonEnabled(internalField.convertedMetaPath, buttonIsBound, buttonOperationAvailable, buttonOperationAvailableFormatted);
        const type = buildExpressionForCriticalityButtonType(internalField.dataModelPath);
        button = _jsx(Button, {
          class: internalField.class,
          text: text,
          icon: icon,
          tooltip: tooltip,
          press: buttonPress,
          enabled: enabled,
          visible: internalField.visible,
          type: type
        });
      }
      return button;
    },
    /**
     * Generates the Contact template.
     * @param internalField Reference to the current internal field instance
     * @returns An XML-based string with the definition of the field control
     */
    getContactTemplate(internalField) {
      const contactMetaPath = internalField.metaPath.getModel().createBindingContext("Target/$AnnotationPath", internalField.metaPath);
      const contactVisible = FieldTemplating.getVisibleExpression(internalField.dataModelPath);
      return _jsx(Contact, {
        idPrefix: internalField.idPrefix,
        ariaLabelledBy: internalField.ariaLabelledBy,
        metaPath: contactMetaPath.getPath(),
        contextPath: internalField.contextPath.getPath(),
        _flexId: internalField._flexId,
        visible: contactVisible,
        showEmptyIndicator: internalField.formatOptions.showEmptyIndicator
      });
    },
    /**
     * Generates the innerpart of the data point to be used in getDataPointTemplate.
     * @param internalField Reference to the current internal field instance
     * @param withConditionalWrapper Boolean value to determine whether the DataPoint
     * 					  			shall be generated for the conditional wrapper case
     * @returns An XML-based string with the definition of the field control
     */
    getDataPointInnerPart(internalField, withConditionalWrapper) {
      const convertedDataField = MetaModelConverter.convertMetaModelContext(internalField.metaPath);
      const metaPath = convertedDataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAnnotation" ? internalField.metaPath.getModel().createBindingContext("Target/$AnnotationPath", internalField.metaPath) : internalField.metaPath;
      const formatOptions = {
        measureDisplayMode: internalField.formatOptions.measureDisplayMode,
        showEmptyIndicator: internalField.formatOptions.showEmptyIndicator,
        isAnalytics: internalField.formatOptions.isAnalytics
      };
      return _jsx(DataPoint, {
        idPrefix: internalField.idPrefix,
        visible: !withConditionalWrapper ? internalField.displayVisible : "",
        ariaLabelledBy: internalField.ariaLabelledBy ? internalField.ariaLabelledBy : undefined,
        metaPath: metaPath.getPath(),
        contextPath: internalField.contextPath?.getPath(),
        value: internalField.value,
        children: {
          formatOptions: {
            formatOptions
          }
        }
      });
    },
    /**
     * Generates the DataPoint template.
     * @param internalField Reference to the current internal field instance
     * @returns An XML-based string with the definition of the field control
     */
    getDataPointTemplate(internalField) {
      if ((internalField.formatOptions.isAnalytics ?? false) && (internalField.hasUnitOrCurrency ?? false)) {
        return _jsx(ConditionalWrapper, {
          visible: internalField.displayVisible,
          condition: internalField.hasValidAnalyticalCurrencyOrUnit,
          children: {
            contentTrue: this.getDataPointInnerPart(internalField, true),
            contentFalse: this.getCurrencyOrUnitControl(internalField, this.getDataPointInnerPart(internalField, false))
          }
        });
      } else {
        return this.getDataPointInnerPart(internalField, false);
      }
    },
    /**
     * Generates the ExpandableText template.
     * @param internalField Reference to the current internal field instance
     * @returns An XML-based string with the definition of the field control
     */
    getExpandableText(internalField) {
      return _jsx(ExpandableText, {
        id: internalField?.displayStyleId,
        visible: internalField?.displayVisible,
        text: internalField.text,
        overflowMode: internalField?.formatOptions?.textExpandBehaviorDisplay,
        maxCharacters: internalField?.formatOptions?.textMaxCharactersDisplay,
        emptyIndicatorMode: internalField?.emptyIndicatorMode
      });
    },
    /**
     * Generates the File template.
     * @param internalField Reference to the current internal field instance
     * @returns An XML-based string with the definition of the field control
     */
    getFileTemplate(internalField) {
      let innerFilePart;
      const fileRelativePropertyPath = getContextRelativeTargetObjectPath(internalField.dataModelPath);
      const fileNameAnnotation = internalField.property.annotations.Core?.ContentDisposition?.Filename;
      let fileFilenameExpression;
      if (isPathAnnotationExpression(fileNameAnnotation)) {
        const fileNameDataModelPath = enhanceDataModelPath(internalField.dataModelPath, fileNameAnnotation.path);
        // This causes an expression parsing error: compileExpression(pathInModel(getContextRelativeTargetObjectPath(fileNameDataModelPath)));
        fileFilenameExpression = "{ path: '" + getContextRelativeTargetObjectPath(fileNameDataModelPath) + "' }";
      }
      const fileStreamNotEmpty = compileExpression(not(equal(pathInModel(`${fileRelativePropertyPath}@odata.mediaContentType`), null)));

      // FileWrapper
      const fileUploadUrl = FieldTemplating.getValueBinding(internalField.dataModelPath, {});
      const fileFilenamePath = internalField.property.annotations.Core?.ContentDisposition?.Filename?.path;
      const fileMediaType = internalField.property.annotations.Core?.MediaType && compileExpression(getExpressionFromAnnotation(internalField.property.annotations.Core?.MediaType));

      // template:if
      const fileIsImage = !!internalField.property.annotations.UI?.IsImageURL || !!internalField.property.annotations.UI?.IsImage || /image\//i.test(internalField.property.annotations.Core?.MediaType?.toString() ?? "");

      // Avatar
      const fileAvatarSrc = FieldTemplating.getValueBinding(internalField.dataModelPath, {});
      const fileAvatarDisplayShape = FieldTemplating.getAvatarShape(internalField.dataModelPath);

      // Icon
      const fileIconSrc = FieldHelper.getPathForIconSource(fileRelativePropertyPath);

      // Link
      const fileLinkText = FieldHelper.getFilenameExpr(fileFilenameExpression, "{sap.fe.i18n>M_FIELD_FILEUPLOADER_NOFILENAME_TEXT}");
      const fileLinkHref = FieldHelper.getDownloadUrl(fileUploadUrl ?? "");

      // Text
      const fileTextVisible = compileExpression(equal(pathInModel(`${fileRelativePropertyPath}@odata.mediaContentType`), null));
      let fileAcceptableMediaTypes;
      // FileUploader
      if (internalField.property.annotations.Core?.AcceptableMediaTypes) {
        const acceptedTypes = Array.from(internalField.property.annotations.Core.AcceptableMediaTypes).map(type => `'${type}'`);
        fileAcceptableMediaTypes = `{=odata.collection([${acceptedTypes.join(",")}])}`; // This does not feel right, but follows the logic of AnnotationHelper#value
      }
      const fileMaximumSize = FieldHelper.calculateMBfromByte(internalField.property.maxLength);
      if (fileIsImage) {
        innerFilePart = {
          avatar: _jsx(Avatar, {
            visible: internalField.displayVisible,
            src: fileAvatarSrc,
            displaySize: "S",
            class: "sapUiSmallMarginEnd",
            imageFitType: "Cover",
            displayShape: fileAvatarDisplayShape,
            children: {
              customData: _jsx(ImageCustomData, {
                paramName: "xcache"
              })
            }
          })
        };
      } else {
        innerFilePart = {
          icon: _jsx(Icon, {
            src: fileIconSrc,
            class: "sapUiSmallMarginEnd",
            visible: fileStreamNotEmpty
          }),
          link: _jsx(Link, {
            text: fileLinkText,
            target: "_blank",
            href: fileLinkHref,
            visible: fileStreamNotEmpty,
            wrapping: "true"
          }),
          text: _jsx(Text, {
            emptyIndicatorMode: internalField.emptyIndicatorMode,
            text: "",
            visible: fileTextVisible
          })
        };
      }
      if (internalField.editMode !== FieldEditMode.Display) {
        const beforeDialogOpen = internalField.collaborationEnabled ? "FIELDRUNTIME.handleOpenUploader" : undefined;
        const afterDialogOpen = internalField.collaborationEnabled ? "FIELDRUNTIME.handleCloseUploader" : undefined;
        innerFilePart = {
          ...innerFilePart,
          fileUploader: _jsx(FileUploader, {
            name: "FEV4FileUpload",
            visible: internalField.editableExpression,
            buttonOnly: "true",
            iconOnly: "true",
            multiple: "false",
            tooltip: "{sap.fe.i18n>M_FIELD_FILEUPLOADER_UPLOAD_BUTTON_TOOLTIP}",
            icon: "sap-icon://upload",
            style: "Transparent",
            sendXHR: "true",
            useMultipart: "false",
            sameFilenameAllowed: "true",
            mimeType: fileAcceptableMediaTypes,
            typeMissmatch: "FIELDRUNTIME.handleTypeMissmatch",
            maximumFileSize: fileMaximumSize,
            fileSizeExceed: "FIELDRUNTIME.handleFileSizeExceed",
            uploadOnChange: "false",
            uploadComplete: `FIELDRUNTIME.handleUploadComplete($event, ${fileFilenameExpression || "undefined"}, '${fileRelativePropertyPath}', $controller)`,
            httpRequestMethod: "Put",
            change: "FIELDRUNTIME.uploadStream($controller, $event)",
            beforeDialogOpen: beforeDialogOpen,
            afterDialogClose: afterDialogOpen,
            uploadStart: "FIELDRUNTIME.handleOpenUploader"
          }),
          deleteButton: _jsx(Button, {
            icon: "sap-icon://sys-cancel",
            type: "Transparent",
            press: `FIELDRUNTIME.removeStream($event, ${fileFilenameExpression || "undefined"}, '${fileRelativePropertyPath}', $controller)`,
            tooltip: "{sap.fe.i18n>M_FIELD_FILEUPLOADER_DELETE_BUTTON_TOOLTIP}",
            visible: internalField.editableExpression,
            enabled: fileStreamNotEmpty
          })
        };
      }
      return _jsx(FileWrapper, {
        "core:require": "{FIELDRUNTIME: 'sap/fe/macros/field/FieldRuntime'}",
        visible: internalField.visible,
        uploadUrl: fileUploadUrl,
        propertyPath: fileRelativePropertyPath,
        filename: fileFilenamePath,
        mediaType: fileMediaType,
        fieldGroupIds: internalField.fieldGroupIds,
        validateFieldGroup: "FIELDRUNTIME.onValidateFieldGroup($event)",
        "log:sourcePath": internalField.dataSourcePath,
        children: {
          innerFilePart
        }
      });
    },
    /**
     * Generates the Link template.
     * @param internalField Reference to the current internal field instance
     * @returns An XML-based string with the definition of the field control
     */
    getLinkTemplate(internalField) {
      let linkUrl;
      let linkPress;
      let iconUrl;
      let linkActived;
      let linkTarget;
      switch (internalField.convertedMetaPath.$Type) {
        case "com.sap.vocabularies.UI.v1.DataFieldWithIntentBasedNavigation":
          linkPress = CommonHelper.getPressHandlerForDataFieldForIBN(internalField.metaPath.getObject());
          return _jsx(Link, {
            id: internalField.displayStyleId,
            "core:require": "{WSR: 'sap/base/strings/whitespaceReplacer'}",
            visible: internalField.displayVisible,
            text: DisplayStyle.computeTextWithWhiteSpace(internalField),
            press: linkPress,
            ariaLabelledBy: internalField.ariaLabelledBy,
            emptyIndicatorMode: internalField.emptyIndicatorMode,
            class: "sapMTextRenderWhitespaceWrap",
            accessibleRole: LinkAccessibleRole.Button
          });
        case "com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath":
          linkPress = `FieldRuntime.onDataFieldWithNavigationPath(\${$source>/}, $controller, '${internalField.convertedMetaPath.Target.value}')`;
          return _jsx(Link, {
            id: internalField.displayStyleId,
            "core:require": "{FieldRuntime: 'sap/fe/macros/field/FieldRuntime'}",
            visible: internalField.displayVisible,
            text: internalField.text,
            press: linkPress,
            ariaLabelledBy: internalField.ariaLabelledBy,
            emptyIndicatorMode: internalField.emptyIndicatorMode,
            class: "sapMTextRenderWhitespaceWrap"
          });
        case "com.sap.vocabularies.UI.v1.DataFieldWithAction":
          linkPress = FieldHelper.getPressEventForDataFieldActionButton(internalField, internalField.metaPath.getObject());
          return _jsx(Link, {
            id: internalField.displayStyleId,
            visible: internalField.displayVisible,
            text: internalField.text,
            press: linkPress,
            ariaLabelledBy: internalField.ariaLabelledBy,
            emptyIndicatorMode: internalField.emptyIndicatorMode,
            class: "sapMTextRenderWhitespaceWrap",
            accessibleRole: LinkAccessibleRole.Button
          });
        case "com.sap.vocabularies.UI.v1.DataFieldWithUrl":
          const html5LinkTarget = internalField.property.annotations.HTML5?.LinkTarget;
          internalField.text = DisplayStyle.computeTextWithWhiteSpace(internalField);
          iconUrl = internalField.convertedMetaPath.IconUrl ? compileExpression(getExpressionFromAnnotation(internalField.convertedMetaPath.IconUrl)) : undefined;
          const linkBinding = getExpressionFromAnnotation(internalField.convertedMetaPath.Url);
          linkUrl = compileExpression(linkBinding);
          linkActived = compileExpression(not(equal(linkBinding, "")));
          linkTarget = html5LinkTarget && html5LinkTarget.toString();
      }
      if (internalField.property.annotations?.Communication?.IsEmailAddress || internalField.property.annotations?.Communication?.IsPhoneNumber) {
        const linkIsEmailAddress = internalField.property.annotations.Communication?.IsEmailAddress !== undefined;
        const linkIsPhoneNumber = internalField.property.annotations.Communication?.IsPhoneNumber !== undefined;
        const propertyValueBinding = FieldTemplating.getValueBinding(internalField.dataModelPath, {});
        const mailBlockId = internalField.displayStyleId ? internalField.displayStyleId : `mailBlock${uid()}`;
        if (linkIsEmailAddress) {
          linkUrl = `mailto:${propertyValueBinding}`;
          return _jsx(Email, {
            id: mailBlockId,
            visible: internalField.displayVisible,
            text: internalField.text,
            mail: propertyValueBinding,
            ariaLabelledBy: internalField.ariaLabelledBy ? internalField.ariaLabelledBy : undefined,
            emptyIndicatorMode: internalField.emptyIndicatorMode
          });
        }
        if (linkIsPhoneNumber) {
          linkUrl = `tel:${propertyValueBinding}`;
          return _jsx(Link, {
            id: internalField.displayStyleId,
            "core:require": "{WSR: 'sap/base/strings/whitespaceReplacer'}",
            visible: internalField.displayVisible,
            text: DisplayStyle.computeTextWithWhiteSpace(internalField),
            href: linkUrl,
            enabled: linkActived,
            ariaLabelledBy: internalField.ariaLabelledBy,
            emptyIndicatorMode: internalField.emptyIndicatorMode,
            class: "sapMTextRenderWhitespaceWrap"
          });
        }
      }
      if (iconUrl) {
        return _jsx(ObjectStatus, {
          "core:require": "{WSR: 'sap/base/strings/whitespaceReplacer', FieldRuntime: 'sap/fe/macros/field/FieldRuntime'}",
          id: internalField.displayStyleId,
          icon: iconUrl,
          visible: internalField.displayVisible,
          text: internalField.text,
          press: "FieldRuntime.openExternalLink",
          active: linkActived,
          emptyIndicatorMode: internalField.emptyIndicatorMode,
          ariaLabelledBy: internalField.ariaLabelledBy,
          children: {
            customData: _jsx(CustomData, {
              value: linkUrl
            }, "url")
          }
        });
      } else {
        return _jsx(Link, {
          id: internalField.displayStyleId,
          "core:require": "{WSR: 'sap/base/strings/whitespaceReplacer'}",
          visible: internalField.displayVisible,
          text: internalField.text,
          href: linkUrl,
          enabled: linkActived,
          target: linkTarget === undefined ? "_top" : linkTarget,
          wrapping: internalField.wrap === undefined ? true : internalField.wrap,
          ariaLabelledBy: internalField.ariaLabelledBy,
          emptyIndicatorMode: internalField.emptyIndicatorMode
        });
      }
    },
    /**
     * Find the foreign key of target entity which quick view Facets we want to display.
     * @param internalField Reference to the current internal field instance
     * @returns The key of the target entity
     */
    getForeignKeyForCustomData(internalField) {
      const relativePathToQuickViewEntity = QuickView.getRelativePathToQuickViewEntity(internalField.dataModelPath);
      if (relativePathToQuickViewEntity) {
        const targetNavigationProperties = internalField.dataModelPath.targetEntityType.navigationProperties;
        const targetNavProp = targetNavigationProperties.find(navProp => navProp.name === relativePathToQuickViewEntity);
        const refConstraint = targetNavProp?.referentialConstraint;
        const key = refConstraint?.length && typeof refConstraint[0] === "object" && refConstraint[0].targetProperty;
        const keyToFetch = key ? `${relativePathToQuickViewEntity}/${key}` : undefined;
        if (keyToFetch !== undefined) {
          return keyToFetch;
        }
      }
      return undefined;
    },
    /**
     * Generates the check expression for displaying or not a quickview.
     * @param internalField Reference to the current internal field instance
     * @returns The key of the target entity
     */
    getForeignKeyValueExpression(internalField) {
      const foreignKeyRelativePath = QuickView.getRelativePathToQuickViewEntity(internalField.dataModelPath) ? this.getForeignKeyForCustomData(internalField) : undefined;
      const expression = {
        path: `${foreignKeyRelativePath}`,
        _type: "PathInModel"
      };
      return `${compileExpression(ifElse(equal(foreignKeyRelativePath, undefined), constant(true), not(equal(null, expression))))}`;
    },
    /**
     * Generates the StandardLinkWithQuickView template.
     * @param internalField Reference to the current internal field instance
     * @param text The text to display
     * @returns An XML-based string with the definition of the field control
     */
    getStandardLinkWithQuickViewTemplate(internalField, text) {
      return _jsx(Link, {
        id: internalField.displayStyleId,
        "core:require": "{FieldRuntimeHelper: 'sap/fe/macros/field/FieldRuntimeHelper', WSR: 'sap/base/strings/whitespaceReplacer'}",
        text: text,
        visible: internalField.displayVisible,
        wrapping: internalField.wrap === undefined ? true : internalField.wrap,
        press: "FieldRuntimeHelper.pressLink",
        ariaLabelledBy: internalField.ariaLabelledBy,
        emptyIndicatorMode: internalField.emptyIndicatorMode,
        children: {
          customData: [_jsx(CustomData, {
            value: internalField.valueAsStringBindingExpression
          }, "loadValue")],
          dependents: DisplayStyle.getMdcLinkForQuickView(internalField)
        }
      });
    },
    /**
     * Generates the ConditionalLinkTemplate template.
     * @param internalField Reference to the current internal field instance
     * @param condition Condition to display a Link or a Text
     * @param text The text to display
     * @returns An XML-based string with the definition of the field control
     */
    getConditionalLinkWithQuickViewTemplate(internalField, condition, text) {
      return _jsx(TextLink, {
        id: internalField.displayStyleId,
        "core:require": "{FieldRuntimeHelper: 'sap/fe/macros/field/FieldRuntimeHelper', ValueFormatter: 'sap/fe/core/formatters/ValueFormatter', WSR: 'sap/base/strings/whitespaceReplacer'}",
        showAsLink: condition,
        semanticObject: internalField.semanticObject,
        text: text,
        wrapping: internalField.wrap === undefined ? true : internalField.wrap,
        press: "FieldRuntimeHelper.pressLink",
        ariaLabelledBy: internalField.ariaLabelledBy,
        emptyIndicatorMode: internalField.emptyIndicatorMode,
        children: {
          customData: [_jsx(CustomData, {
            value: internalField.valueAsStringBindingExpression
          }, "loadValue")],
          dependents: DisplayStyle.getMdcLinkForQuickView(internalField)
        }
      });
    },
    /**
     * Generates the ConditionalLinkTemplate template.
     * @param internalField Reference to the current internal field instance
     * @param condition Condition to display a Link or a Text
     * @param contentTrue The Control to display in case condition is true
     * @param contentFalse The Control to display in case condition is false
     * @returns An XML-based string with the definition of the field control
     */
    getConditionalWrapperForQuickViewTemplate(internalField, condition, contentTrue, contentFalse) {
      return _jsx(ConditionalWrapper, {
        visible: internalField.displayVisible,
        condition: condition,
        children: {
          contentTrue: contentTrue,
          contentFalse: contentFalse
        }
      });
    },
    /**
     * Generates the LinkWithQuickView template.
     * @param internalField Reference to the current internal field instance
     * @returns An XML-based string with the definition of the field control
     */
    getLinkWithQuickViewTemplate(internalField) {
      const text = internalField.formatOptions.retrieveTextFromValueList ? internalField.textFromValueList : DisplayStyle.computeTextWithWhiteSpace(internalField);
      const condition = this.getQuickViewCondition(internalField);
      if (condition === "true") {
        return this.getStandardLinkWithQuickViewTemplate(internalField, text);
      }
      return this.getConditionalLinkWithQuickViewTemplate(internalField, condition, text);
    },
    /**
     * Generates the Text template.
     * @param internalField Reference to the current internal field instance
     * @returns An XML-based string with the definition of the field control
     */
    getTextTemplate(internalField) {
      if (internalField.formatOptions.isAnalytics && internalField.hasUnitOrCurrency) {
        const content = DisplayStyle.getCurrencyOrUnitControl(internalField, _jsx(Text, {
          text: internalField.text,
          textAlign: "End"
        }));
        return _jsx(ConditionalWrapper, {
          visible: internalField.displayVisible,
          condition: internalField.hasValidAnalyticalCurrencyOrUnit,
          children: {
            contentTrue: _jsx(Text, {
              id: internalField.displayStyleId,
              text: internalField.text,
              emptyIndicatorMode: internalField.emptyIndicatorMode,
              renderWhitespace: "true",
              wrapping: internalField.wrap
            }),
            contentFalse: content
          }
        });
      } else if (internalField.formatOptions.retrieveTextFromValueList) {
        return _jsx(Text, {
          id: internalField.displayStyleId,
          visible: internalField.displayVisible,
          text: internalField.textFromValueList,
          "core:require": "{FieldRuntime: 'sap/fe/macros/field/FieldRuntime'}",
          emptyIndicatorMode: internalField.emptyIndicatorMode,
          renderWhitespace: "true"
        });
      } else {
        // When having a TextArrangement with TextOnly, RTA can only find the binding for the text, but not for the field.
        // To prevent that such a field can be added twice via RTA, we need to provide the field binding as a dummy custom binding.
        let customdata;
        if (internalField.formatOptions.displayMode === "Description" && internalField.valueAsStringBindingExpression) {
          customdata = _jsx(CustomData, {
            value: internalField.valueAsStringBindingExpression
          }, "fieldBinding");
        }
        return _jsx(Text, {
          id: internalField.displayStyleId,
          visible: internalField.displayVisible,
          text: internalField.text,
          wrapping: internalField.wrap,
          emptyIndicatorMode: internalField.emptyIndicatorMode,
          renderWhitespace: "true",
          children: customdata
        });
      }
    },
    /**
     * Generates the ObjectIdentifier template.
     * @param internalField Reference to the current internal field instance
     * @returns An XML-based string with the definition of the field control
     */
    getObjectIdentifier(internalField) {
      let dependents;
      let titleActive;
      if (internalField.hasQuickView) {
        titleActive = this.getQuickViewCondition(internalField);
        dependents = DisplayStyle.getMdcLinkForQuickView(internalField);
      } else {
        titleActive = false;
      }
      let identifier = _jsx(ObjectIdentifier, {
        "core:require": "{FieldRuntimeHelper: 'sap/fe/macros/field/FieldRuntimeHelper'}",
        id: internalField.displayStyleId,
        title: internalField.identifierTitle,
        text: internalField.identifierText,
        titleActive: titleActive,
        titlePress: "FieldRuntimeHelper.pressLink",
        ariaLabelledBy: internalField.ariaLabelledBy,
        emptyIndicatorMode: internalField.emptyIndicatorMode,
        children: {
          customData: [_jsx(CustomData, {
            value: internalField.valueAsStringBindingExpression
          }, "loadValue")],
          dependents: dependents
        }
      });
      if (internalField.hasSituationsIndicator) {
        identifier = _jsxs(HBox, {
          alignItems: "Center",
          justifyContent: "SpaceBetween",
          width: "100%",
          children: [identifier, _jsx(SituationsIndicator, {
            contextPath: internalField.contextPath.getPath(),
            propertyPath: internalField.situationsIndicatorPropertyPath
          })]
        });
      }
      if (internalField.showErrorIndicator && internalField.showErrorObjectStatus) {
        identifier = _jsxs(VBox, {
          children: [identifier, _jsx(ObjectStatus, {
            visible: internalField.showErrorObjectStatus,
            class: "sapUiSmallMarginBottom",
            text: "{sap.fe.i18n>Contains_Errors}",
            state: "Error"
          })]
        });
      }
      return identifier;
    },
    /**
     * Generates the ObjectStatus template.
     * @param internalField Reference to the current internal field instance
     * @returns An XML-based string with the definition of the field control
     */
    getObjectStatus(internalField) {
      let objectStatus;
      let requiredHelper = {
        "core:require": "{FieldRuntimeHelper: 'sap/fe/macros/field/FieldRuntimeHelper'}"
      };
      const dataModelObjectPath = MetaModelConverter.getInvolvedDataModelObjects(internalField.metaPath, internalField.contextPath);
      const enhancedValueDataModelPath = enhanceDataModelPath(dataModelObjectPath, dataModelObjectPath.targetObject?.Value.path);
      const condition = hasValidAnalyticalCurrencyOrUnit(enhancedValueDataModelPath);
      const convertedDataField = MetaModelConverter.getInvolvedDataModelObjects(internalField.metaPath);
      const criticalityIcon = buildExpressionForCriticalityIcon(convertedDataField);
      const state = buildExpressionForCriticalityColor(convertedDataField);
      const linkUrl = internalField.convertedMetaPath.Url ? compileExpression(getExpressionFromAnnotation(internalField.convertedMetaPath.Url)) : undefined;
      if (internalField.formatOptions.isAnalytics && internalField.hasUnitOrCurrency) {
        const content = DisplayStyle.getCurrencyOrUnitControl(internalField, _jsx(Text, {
          text: internalField.text,
          textAlign: "End"
        }));
        objectStatus = _jsx(ConditionalWrapper, {
          id: internalField.displayStyleId,
          condition: condition,
          children: {
            contentTrue: _jsx(ObjectStatus, {
              icon: criticalityIcon,
              state: state,
              visible: internalField.displayVisible,
              text: internalField.text,
              emptyIndicatorMode: internalField.emptyIndicatorMode,
              class: "sapMTextRenderWhitespaceWrap"
            }),
            contentFalse: content
          }
        });
      } else {
        let dependents;
        let active = false;
        let isActive;
        let pressAction;
        if (internalField.hasQuickView) {
          dependents = DisplayStyle.getMdcLinkForQuickView(internalField);
          isActive = this.getQuickViewCondition(internalField);
          pressAction = "FieldRuntimeHelper.pressLink";
        }
        if (linkUrl) {
          active = true;
          requiredHelper = {
            "core:require": "{FieldRuntime: 'sap/fe/macros/field/FieldRuntime'}"
          };
          pressAction = "FieldRuntime.openExternalLink";
        }
        objectStatus = _jsx(ObjectStatus, {
          id: internalField.displayStyleId,
          icon: criticalityIcon,
          state: state,
          text: internalField.text,
          visible: internalField.displayVisible,
          emptyIndicatorMode: internalField.emptyIndicatorMode,
          ...requiredHelper,
          active: isActive ? isActive : active,
          press: pressAction,
          ariaLabelledBy: internalField.ariaLabelledBy,
          children: {
            customData: [_jsx(CustomData, {
              value: internalField.valueAsStringBindingExpression
            }, "loadValue"), _jsx(CustomData, {
              value: linkUrl
            }, "url")],
            dependents: dependents
          }
        });
      }
      return objectStatus;
    },
    getMdcLinkForQuickView(internalField) {
      return new QuickView(internalField.dataModelPath, internalField.metaPath.getPath(), internalField.contextPath.getPath(), internalField.semanticObject).createContent();
    },
    /**
     * Generates the LabelSemantickey template.
     * @param internalField Reference to the current internal field instance
     * @returns An XML-based string with the definition of the field control
     */
    getLabelSemanticKey(internalField) {
      const contentTrue = _jsx(Link, {
        text: internalField.text,
        wrapping: "true",
        "core:require": "{FieldRuntimeHelper: 'sap/fe/macros/field/FieldRuntimeHelper'}",
        press: "FieldRuntimeHelper.pressLink",
        ariaLabelledBy: internalField.ariaLabelledBy,
        emptyIndicatorMode: internalField.emptyIndicatorMode,
        children: {
          customData: [_jsx(CustomData, {
            value: internalField.valueAsStringBindingExpression
          }, "loadValue")],
          dependents: DisplayStyle.getMdcLinkForQuickView(internalField)
        }
      });
      const contentFalse = _jsx(Label, {
        id: internalField.displayStyleId,
        visible: internalField.displayVisible,
        text: internalField.identifierTitle,
        design: "Bold"
      });
      if (internalField.hasQuickView) {
        const hasQuickview = this.getQuickViewCondition(internalField);
        if (hasQuickview === "true") {
          return contentTrue;
        } else {
          return this.getConditionalWrapperForQuickViewTemplate(internalField, hasQuickview, contentTrue, contentFalse);
        }
      }
      return _jsx(Label, {
        id: internalField.displayStyleId,
        visible: internalField.displayVisible,
        text: internalField.identifierTitle,
        design: "Bold"
      });
    },
    /**
     * Gets the template for the semantic key with draft indicator.
     * @param semanticKeyTemplate The template result without draft indicator
     * @param internalField Reference to the current internal field instance
     * @returns An XML-based string with the definition of the field control
     */
    addDraftIndicator(semanticKeyTemplate, internalField) {
      if (!internalField.formatOptions.fieldGroupDraftIndicatorPropertyPath) {
        // if the draftIndicator is not handled at the fieldGroup level
        //TODO could this be a boolean no draftIndicator
        semanticKeyTemplate = _jsx(FormElementWrapper, {
          visible: internalField.displayVisible,
          children: _jsxs(VBox, {
            class: FieldHelper.getMarginClass(internalField.formatOptions.compactSemanticKey),
            children: [semanticKeyTemplate, _jsx(DraftIndicator, {
              draftIndicatorType: ObjectMarkerVisibility.IconAndText,
              contextPath: internalField.contextPath.getPath(),
              visible: internalField.draftIndicatorVisible,
              ariaLabelledBy: internalField.ariaLabelledBy ? internalField.ariaLabelledBy : []
            })]
          })
        });
      }
      return semanticKeyTemplate;
    },
    /**
     * Computes the text property with the appropriate white space handling.
     * @param internalField Reference to the current internal field instance
     * @returns An XML-based string with the definition of the field control
     */
    computeTextWithWhiteSpace(internalField) {
      const text = FieldTemplating.getTextBinding(internalField.dataModelPath, internalField.formatOptions, true);
      return isPathInModelExpression(text) || typeof text === "string" ? compileExpression(formatResult([text], "WSR")) : compileExpression(text);
    },
    /**
     * Gets the condition for having an active link that opens the quick view.
     * @param internalField
     * @returns A compile binding expression for the condition.
     */
    getQuickViewCondition(internalField) {
      switch (internalField.quickViewType) {
        case "Facets":
          //there is quick viewFacets annotation only then we check if the navigation is reachable
          return this.getForeignKeyValueExpression(internalField);
        case "SemanticLinks":
          if (internalField.dynamicSemanticObjects) {
            const listOfDynamicSemanticObjects = [];
            if (internalField.semanticObject) {
              // If we see a dynamic expression with a formatter, we return false. The condition will be resolved later in TextLink control.
              return compileExpression(constant(false));
            }
            for (const semanticObjectExpression of internalField.dynamicSemanticObjects) {
              if (semanticObjectExpression._type === "PathInModel" || semanticObjectExpression._type === "Constant") {
                listOfDynamicSemanticObjects.push(semanticObjectExpression);
              } else {
                // If we see a dynamic expression ($edmJson), we return true.
                return compileExpression(constant(true));
              }
            }
            const semanticObjectsPath = [pathInModel("/semanticObjects", "internal")].concat(listOfDynamicSemanticObjects);
            return compileExpression(formatResult(semanticObjectsPath, valueFormatters.hasSemanticObjects));
          }
          return "true";
        default:
          // "facetsAndSemanticLinks"
          // if there is both facets and semantic links, we do not check if the navigation is reachable
          return "true";
      }
    },
    /**
     * Entry point for further templating processings.
     * @param internalField Reference to the current internal field instance
     * @returns An XML-based string with the definition of the field control
     */
    getTemplate: internalField => {
      let innerFieldContent;
      switch (internalField.displayStyle) {
        case "AmountWithCurrency":
          innerFieldContent = DisplayStyle.getAmountWithCurrencyTemplate(internalField);
          break;
        case "Avatar":
          innerFieldContent = DisplayStyle.getAvatarTemplate(internalField);
          break;
        case "Button":
          innerFieldContent = DisplayStyle.getButtonTemplate(internalField);
          break;
        case "Contact":
          innerFieldContent = DisplayStyle.getContactTemplate(internalField);
          break;
        case "DataPoint":
          innerFieldContent = DisplayStyle.getDataPointTemplate(internalField);
          break;
        case "ExpandableText":
          innerFieldContent = DisplayStyle.getExpandableText(internalField);
          break;
        case "File":
          innerFieldContent = DisplayStyle.getFileTemplate(internalField);
          break;
        case "Link":
          innerFieldContent = DisplayStyle.getLinkTemplate(internalField);
          break;
        case "LinkWithQuickView":
          innerFieldContent = DisplayStyle.getLinkWithQuickViewTemplate(internalField);
          break;
        case "ObjectIdentifier":
          innerFieldContent = DisplayStyle.getObjectIdentifier(internalField);
          break;
        case "ObjectStatus":
          {
            innerFieldContent = DisplayStyle.getObjectStatus(internalField);
            break;
          }
        case "LabelSemanticKey":
          innerFieldContent = DisplayStyle.getLabelSemanticKey(internalField);
          break;
        case "Text":
          innerFieldContent = DisplayStyle.getTextTemplate(internalField);
          break;
        default:
          innerFieldContent = "";
      }
      if (internalField.addDraftIndicator && innerFieldContent) {
        innerFieldContent = DisplayStyle.addDraftIndicator(innerFieldContent, internalField);
      }
      return innerFieldContent;
    }
  };
  return DisplayStyle;
}, false);
//# sourceMappingURL=DisplayStyle-dbg.js.map
