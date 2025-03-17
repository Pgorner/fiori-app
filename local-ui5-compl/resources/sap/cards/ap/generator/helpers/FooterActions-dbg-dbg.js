/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/base/Log", "sap/m/library", "sap/ui/core/Lib", "../helpers/ApplicationInfo", "../helpers/I18nHelper"], function (Log, sap_m_library, CoreLib, ___helpers_ApplicationInfo, ___helpers_I18nHelper) {
  "use strict";

  const _iteratorSymbol = /*#__PURE__*/typeof Symbol !== "undefined" ? Symbol.iterator || (Symbol.iterator = Symbol("Symbol.iterator")) : "@@iterator";
  function _settle(pact, state, value) {
    if (!pact.s) {
      if (value instanceof _Pact) {
        if (value.s) {
          if (state & 1) {
            state = value.s;
          }
          value = value.v;
        } else {
          value.o = _settle.bind(null, pact, state);
          return;
        }
      }
      if (value && value.then) {
        value.then(_settle.bind(null, pact, state), _settle.bind(null, pact, 2));
        return;
      }
      pact.s = state;
      pact.v = value;
      const observer = pact.o;
      if (observer) {
        observer(pact);
      }
    }
  }
  const _Pact = /*#__PURE__*/function () {
    function _Pact() {}
    _Pact.prototype.then = function (onFulfilled, onRejected) {
      const result = new _Pact();
      const state = this.s;
      if (state) {
        const callback = state & 1 ? onFulfilled : onRejected;
        if (callback) {
          try {
            _settle(result, 1, callback(this.v));
          } catch (e) {
            _settle(result, 2, e);
          }
          return result;
        } else {
          return this;
        }
      }
      this.o = function (_this) {
        try {
          const value = _this.v;
          if (_this.s & 1) {
            _settle(result, 1, onFulfilled ? onFulfilled(value) : value);
          } else if (onRejected) {
            _settle(result, 1, onRejected(value));
          } else {
            _settle(result, 2, value);
          }
        } catch (e) {
          _settle(result, 2, e);
        }
      };
      return result;
    };
    return _Pact;
  }();
  function _isSettledPact(thenable) {
    return thenable instanceof _Pact && thenable.s & 1;
  }
  function _forTo(array, body, check) {
    var i = -1,
      pact,
      reject;
    function _cycle(result) {
      try {
        while (++i < array.length && (!check || !check())) {
          result = body(i);
          if (result && result.then) {
            if (_isSettledPact(result)) {
              result = result.v;
            } else {
              result.then(_cycle, reject || (reject = _settle.bind(null, pact = new _Pact(), 2)));
              return;
            }
          }
        }
        if (pact) {
          _settle(pact, 1, result);
        } else {
          pact = result;
        }
      } catch (e) {
        _settle(pact || (pact = new _Pact()), 2, e);
      }
    }
    _cycle();
    return pact;
  }
  /**
   * Adds the action to the card manifest
   * @param manifest The card manifest
   * @param controlProperties The control properties
   * @param context
   */
  const addActionToCardManifest = function (manifest, controlProperties, context) {
    try {
      const bODataV4 = context.dialog.getModel().getProperty("/configuration/actions/bODataV4");
      const metaModel = context.appModel.getMetaModel();
      return Promise.resolve(getAdaptiveCardAction(controlProperties, bODataV4, metaModel, context)).then(function (actionInfo) {
        addActionToCardFooter(manifest, actionInfo, controlProperties);
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
  /**
   * Removes the action from the card manifest
   * @param manifest The card manifest
   * @param controlProperties The control properties
   */
  function _forOf(target, body, check) {
    if (typeof target[_iteratorSymbol] === "function") {
      var iterator = target[_iteratorSymbol](),
        step,
        pact,
        reject;
      function _cycle(result) {
        try {
          while (!(step = iterator.next()).done && (!check || !check())) {
            result = body(step.value);
            if (result && result.then) {
              if (_isSettledPact(result)) {
                result = result.v;
              } else {
                result.then(_cycle, reject || (reject = _settle.bind(null, pact = new _Pact(), 2)));
                return;
              }
            }
          }
          if (pact) {
            _settle(pact, 1, result);
          } else {
            pact = result;
          }
        } catch (e) {
          _settle(pact || (pact = new _Pact()), 2, e);
        }
      }
      _cycle();
      if (iterator.return) {
        var _fixup = function (value) {
          try {
            if (!step.done) {
              iterator.return();
            }
          } catch (e) {}
          return value;
        };
        if (pact && pact.then) {
          return pact.then(_fixup, function (e) {
            throw _fixup(e);
          });
        }
        _fixup();
      }
      return pact;
    }
    // No support for Symbol.iterator
    if (!("length" in target)) {
      throw new TypeError("Object is not iterable");
    }
    // Handle live collections properly
    var values = [];
    for (var i = 0; i < target.length; i++) {
      values.push(target[i]);
    }
    return _forTo(values, function (i) {
      return body(values[i]);
    }, check);
  }
  const ButtonType = sap_m_library["ButtonType"];
  const ApplicationInfo = ___helpers_ApplicationInfo["ApplicationInfo"];
  const ODataModelVersion = ___helpers_ApplicationInfo["ODataModelVersion"];
  const resolveI18nTextFromResourceModel = ___helpers_I18nHelper["resolveI18nTextFromResourceModel"];
  /**
   * Forms the action info from the data field
   * @param dataField The data field
   * @param bODataV4 The OData version
   * @returns Action info
   */
  function formActionInfoFromDataField(dataField, bODataV4, metaModel, entitySetName) {
    let metadataAnnotationInfo = {
      isConfirmationRequired: false,
      enablePath: ""
    };
    if (bODataV4) {
      metadataAnnotationInfo = getMetadataAnnotationInfoV4(dataField, metaModel, entitySetName);
    } else {
      metadataAnnotationInfo = getMetadataAnnotationInfoV2(dataField, metaModel);
    }
    return {
      label: bODataV4 ? dataField.Label : dataField.Label.String,
      action: bODataV4 ? dataField.Action : dataField.Action.String.split("/")[1],
      isConfirmationRequired: metadataAnnotationInfo.isConfirmationRequired || false,
      enablePath: metadataAnnotationInfo.enablePath
    };
  }

  /**
   * Gets the button type for the card
   * @param actionStyle The action style
   * @returns The button type
   */

  function getButtonTypeForCard(actionStyle) {
    if (actionStyle === "Positive") {
      return ButtonType.Accept;
    }
    if (actionStyle === "Negative") {
      return ButtonType.Reject;
    }
    return ButtonType.Default;
  }

  /**
   *
   * Adds action information to integration card configuration parameters
   *
   * @param manifest
   * @param actionInfo
   * @param controlProperties
   */
  function addActionInfoToConfigParameters(manifest, actionInfo, controlProperties) {
    if (!manifest["sap.card"].configuration) {
      manifest["sap.card"].configuration = {
        parameters: {
          footerActionParameters: {},
          _adaptiveFooterActionParameters: {}
        }
      };
    } else if (manifest["sap.card"].configuration && !manifest["sap.card"].configuration.parameters) {
      manifest["sap.card"].configuration.parameters = {
        footerActionParameters: {},
        _adaptiveFooterActionParameters: {}
      };
    }
    const cardConfiguration = manifest["sap.card"].configuration;
    const configParams = cardConfiguration.parameters;
    if (configParams && !configParams._adaptiveFooterActionParameters) {
      configParams._adaptiveFooterActionParameters = {};
    }
    if (configParams && !configParams.footerActionParameters) {
      configParams.footerActionParameters = {};
    }
    if (configParams?._adaptiveFooterActionParameters && configParams?.footerActionParameters) {
      configParams.footerActionParameters[controlProperties.titleKey] = actionInfo.parameters || {};
      configParams._adaptiveFooterActionParameters[controlProperties.titleKey] = actionInfo || {};
    }
  }

  /**
   *
   * Removes action information from integration card configuration parameters
   *
   * @param manifest
   * @param controlProperties
   */
  function removeActionInfoFromConfigParams(manifest, controlProperties) {
    const cardConfiguration = manifest["sap.card"].configuration;
    const configParams = cardConfiguration?.parameters;
    if (configParams?._adaptiveFooterActionParameters && configParams?.footerActionParameters) {
      delete configParams.footerActionParameters[controlProperties.titleKey];
      delete configParams._adaptiveFooterActionParameters[controlProperties.titleKey];
    }
  }

  /**
   *
   * Updates the style and enablePath for the adaptive card action
   *
   * @param manifest
   * @param controlProperties
   * @param adaptiveCardStyle
   * @param enablePath
   */
  function updateAdaptiveCardInfo(manifest, controlProperties, adaptiveCardStyle, enablePath) {
    const cardConfiguration = manifest["sap.card"].configuration;
    const configParams = cardConfiguration?.parameters;
    if (configParams?._adaptiveFooterActionParameters && configParams?.footerActionParameters) {
      const adaptiveCardActionInfo = configParams._adaptiveFooterActionParameters[controlProperties.titleKey];
      adaptiveCardActionInfo.style = adaptiveCardStyle;
      adaptiveCardActionInfo.enablePath = enablePath;
    }
  }

  /**
   * Adds the action to the card footer
   * @param manifest The card manifest
   * @param actionInfo The action info
   */
  function addActionToCardFooter(manifest, actionInfo, controlProperties) {
    let cardFooter = manifest["sap.card"].footer;
    if (!cardFooter) {
      manifest["sap.card"].footer = {
        actionsStrip: []
      };
      cardFooter = manifest["sap.card"].footer;
    }
    const actionLength = cardFooter.actionsStrip.length;
    if (actionLength < 2) {
      cardFooter.actionsStrip.push({
        type: "Button",
        visible: false,
        text: actionInfo.label,
        buttonType: getButtonTypeForCard(actionInfo.style),
        actions: [{
          type: "custom",
          enabled: actionInfo.enablePath ? "${" + actionInfo.enablePath + "}" : "true",
          parameters: "{{parameters.footerActionParameters." + controlProperties.titleKey + "}}"
        }]
      });
      addActionInfoToConfigParameters(manifest, actionInfo, controlProperties);
    }
  }

  /**
   * Gets the action styles for the card
   * @returns The action styles
   */
  function getActionStyles() {
    const actionStyles = [{
      name: "Default",
      label: "Default",
      labelWithValue: "Default"
    }, {
      name: "Positive",
      label: "Positive",
      labelWithValue: "Positive"
    }, {
      name: "Negative",
      label: "Negative",
      labelWithValue: "Negative"
    }];
    return actionStyles;
  }

  /**
   * Forms action info from the data field
   * @param dataFields The data fields
   * @param bODataV4 The OData version
   * @returns Action info
   */
  function getActionFromDataField(dataFields, bODataV4, metaModel, entitySetName) {
    const actions = [];
    const dataFieldForAnnotation = "com.sap.vocabularies.UI.v1.DataFieldForAction";
    dataFields?.filter(function (dataField) {
      const dataFieldType = bODataV4 ? dataField?.$Type : dataField?.RecordType;
      return dataFieldType === dataFieldForAnnotation;
    }).map(function (dataField) {
      const actionInfo = formActionInfoFromDataField(dataField, bODataV4, metaModel, entitySetName);
      actions.push(actionInfo);
    });
    return actions;
  }

  /**
   *
   * Updates the action parameter data to the model data.
   * Resolves the i18n keys for label, errorMessage and placeholder properties of adaptive card action parameters.
   *
   *
   * @param actionParameters
   * @param data
   * @param resourceBundle
   */
  const updateActionParameterData = function (actionParameters, data, resourceBundle) {
    try {
      return Promise.resolve(_forOf(actionParameters, function (actionParameter) {
        if (resourceBundle) {
          actionParameter.label = resolveI18nTextFromResourceModel(actionParameter.label, resourceBundle);
          actionParameter.errorMessage = resolveI18nTextFromResourceModel(actionParameter?.errorMessage || "", resourceBundle);
          actionParameter.placeholder = resolveI18nTextFromResourceModel(actionParameter?.placeholder || "", resourceBundle);
        }
        const actionParameterConfig = actionParameter.configuration;
        const valueHelpEntitySet = actionParameterConfig?.entitySet;
        const _temp = function () {
          if (valueHelpEntitySet) {
            return Promise.resolve(updateModelData(data, actionParameterConfig?.serviceUrl, valueHelpEntitySet)).then(function () {});
          }
        }();
        if (_temp && _temp.then) return _temp.then(function () {});
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  /**
   *
   * Gets the saved action from card manifest
   * Resolves i18n keys to text for label and ok button used for Submit type of action in adaptive card.
   *
   * @param cardManifest
   * @param data
   * @param resourceBundle
   * @returns
   */
  const getActionsFromManifest = function (cardManifest, data, resourceBundle) {
    try {
      let _exit = false;
      function _temp7(_result) {
        return _exit ? _result : [{
          title: "",
          titleKey: "",
          style: "Default",
          enablePathKey: "",
          isStyleControlEnabled: false
        }];
      }
      const cardConfiguration = cardManifest["sap.card"].configuration;
      const configParams = cardConfiguration?.parameters;
      const actions = [];
      const _temp6 = function () {
        if (configParams?._adaptiveFooterActionParameters) {
          function _temp5() {
            _exit = true;
            return actions;
          }
          const _adaptiveFooterActionParameters = configParams._adaptiveFooterActionParameters;
          const aKeys = Object.keys(_adaptiveFooterActionParameters);
          const _temp4 = _forOf(aKeys, function (key) {
            function _temp3() {
              let style = "Default";
              if (action.style === "positive") {
                style = "Positive";
              } else if (action.style === "destructive") {
                style = "Negative";
              }
              const actionInfo = {
                title: action.label,
                titleKey: key,
                style: style,
                enablePathKey: action.enablePath,
                isStyleControlEnabled: true,
                isConfirmationRequired: action.data?.isConfirmationRequired || false,
                triggerActionText: action.triggerActionText
              };
              actions.push(actionInfo);
            }
            const action = _adaptiveFooterActionParameters[key];
            if (resourceBundle) {
              action.label = resolveI18nTextFromResourceModel(action.label, resourceBundle);
              action.triggerActionText = resolveI18nTextFromResourceModel(action.triggerActionText, resourceBundle);
            }
            const _temp2 = function () {
              if (action.actionParameters?.length) {
                return Promise.resolve(updateActionParameterData(action.actionParameters, data, resourceBundle)).then(function () {});
              }
            }();
            return _temp2 && _temp2.then ? _temp2.then(_temp3) : _temp3(_temp2);
          });
          return _temp4 && _temp4.then ? _temp4.then(_temp5) : _temp5(_temp4);
        }
      }();
      return Promise.resolve(_temp6 && _temp6.then ? _temp6.then(_temp7) : _temp7(_temp6));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  /**
   * Gets the saved actions if exists in card manifest otherwise an initial action with default values
   *
   * @param resourceModel
   * @param data
   * @param mCardManifest
   * @returns
   */
  const getDefaultAction = function (resourceModel, data, mCardManifest) {
    try {
      let _exit2 = false;
      function _temp9(_result2) {
        return _exit2 ? _result2 : [{
          title: "",
          titleKey: "",
          style: "Default",
          enablePathKey: "",
          isStyleControlEnabled: false
        }];
      }
      const _temp8 = function () {
        if (mCardManifest && data) {
          return Promise.resolve(getActionsFromManifest(mCardManifest, data, resourceModel)).then(function (_await$getActionsFrom) {
            _exit2 = true;
            return _await$getActionsFrom;
          });
        }
      }();
      return Promise.resolve(_temp8 && _temp8.then ? _temp8.then(_temp9) : _temp9(_temp8));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  /**
   * Gets the card actions
   * @param appComponent The app component
   * @param entitySetName The entity set name
   * @param bODataV4 The OData version
   * @returns The card actions
   */
  function getCardActions(appComponent, entitySetName, bODataV4) {
    const appModel = bODataV4 ? appComponent.getModel() : appComponent.getModel(),
      metaModel = appModel.getMetaModel(),
      entitySet = bODataV4 ? metaModel.getObject("/" + entitySetName) : metaModel.getODataEntitySet(entitySetName),
      entityTypeName = bODataV4 ? entitySet?.$Type : entitySet?.entityType,
      entityType = bODataV4 ? metaModel.getObject("/" + entityTypeName) : metaModel.getODataEntityType(entityTypeName),
      identificationPath = bODataV4 ? "@com.sap.vocabularies.UI.v1.Identification" : "com.sap.vocabularies.UI.v1.Identification";
    let entityTypeAnnotation = {};
    if (bODataV4) {
      entityTypeAnnotation = metaModel.getObject("/" + entityTypeName + "@");
    }
    const entityTypeKeys = bODataV4 ? Object.keys(entityTypeAnnotation) : Object.keys(entityType);
    const identificationAnnotation = entityTypeKeys?.filter(key => {
      return key === identificationPath;
    });
    let dataFields = [];
    if (identificationAnnotation?.length) {
      dataFields = bODataV4 ? entityTypeAnnotation[identificationPath] : entityType[identificationPath];
    }
    return getActionFromDataField(dataFields, bODataV4, metaModel, entitySetName);
  }
  function removeActionFromManifest(manifest, controlProperties) {
    const cardFooter = manifest["sap.card"]?.footer;
    const actionLength = cardFooter?.actionsStrip.length;
    if (actionLength && cardFooter) {
      const relatedAction = cardFooter.actionsStrip.filter(actionsStrip => {
        const cardParameters = actionsStrip.actions[0].parameters;
        return cardParameters !== "{{parameters.footerActionParameters." + controlProperties.titleKey + "}}";
      });
      if (relatedAction.length) {
        cardFooter.actionsStrip = relatedAction;
      } else {
        delete manifest["sap.card"]?.footer;
      }
      removeActionInfoFromConfigParams(manifest, controlProperties);
    }
  }

  /**
   * Updates the actions in the footer of the card manifest based on the provided control properties.
   *
   * @param {CardManifest} manifest - The card manifest object that contains the footer actions.
   */
  function resetCardActions(manifest) {
    manifest["sap.card"].footer = {
      actionsStrip: []
    };
    const cardConfiguration = manifest["sap.card"].configuration;
    const configParams = cardConfiguration?.parameters;
    if (configParams) {
      configParams._adaptiveFooterActionParameters = {};
      configParams.footerActionParameters = {};
    }
  }

  /**
   * Updates the actions in the footer of the card manifest based on the provided control properties.
   *
   * @param {CardManifest} manifest - The card manifest object that contains the footer actions.
   * @param {ControlProperties} controlProperties - The control properties used to update the footer actions.
   */
  function updateCardManifestAction(manifest, controlProperties) {
    const cardFooter = manifest["sap.card"].footer;
    const actionLength = cardFooter?.actionsStrip.length;
    if (actionLength && cardFooter) {
      cardFooter.actionsStrip.forEach(actionsStrip => {
        const action = actionsStrip.actions[0];
        const cardParameters = action.parameters;
        if (cardParameters === "{{parameters.footerActionParameters." + controlProperties.titleKey + "}}") {
          const isEnabledExpression = controlProperties.enablePathKey ? "${" + controlProperties.enablePathKey + "}" : "true";
          const adaptiveCardStyle = getActionStyle(controlProperties);
          actionsStrip.buttonType = getButtonTypeForCard(controlProperties.style);
          action.enabled = isEnabledExpression;
          updateAdaptiveCardInfo(manifest, controlProperties, adaptiveCardStyle, controlProperties.enablePathKey || "");
        }
      });
    }
  }

  /**
   * Gets the action style
   * @param controlProperties The control properties
   * @returns Action style
   */

  function getActionStyle(controlProperties) {
    let actionStyle = "default";
    if (controlProperties.style === "Positive") {
      actionStyle = "positive";
    } else if (controlProperties.style === "Negative") {
      actionStyle = "destructive";
    }
    return actionStyle;
  }

  /**
   *
   * Gets the OData V2 action parameters for the card
   *
   * @param parameters The parameters
   * @param context The context
   * @returns The OData V2 action parameters
   */
  const getActionParameters = function (parameters, context) {
    try {
      const actionParameters = [];
      const oResourceBundle = CoreLib.getResourceBundleFor("sap.cards.ap.generator.i18n");
      const _temp12 = _forOf(parameters, function (parameter) {
        function _temp11() {
          actionParameters.push(actionParamInfoToAdd);
        }
        const EnumMember = parameter?.["com.sap.vocabularies.Common.v1.FieldControl"]?.EnumMember;
        const isRequired = EnumMember === "com.sap.vocabularies.Common.v1.FieldControlType/Mandatory" || parameter?.nullable === "false";
        const actionParamInfoToAdd = {
          label: parameter?.["sap:label"] || parameter?.name || "",
          id: parameter?.name || "",
          isRequired: isRequired,
          errorMessage: isRequired ? oResourceBundle.getText("GENERATOR_ADAPTIVE_CARD_ACTION_PARAMETERS_ERROR_MESSAGE") : "",
          placeholder: ""
        };
        const _temp10 = function () {
          if (parameter?.["sap:value-list"] === "fixed-values") {
            return Promise.resolve(getActionParameterConfigurationV2(parameter, context)).then(function (actionParameterConfig) {
              if (actionParameterConfig?.entitySet) {
                actionParamInfoToAdd.configuration = actionParameterConfig;
                actionParamInfoToAdd.placeholder = oResourceBundle.getText("GENERATOR_ADAPTIVE_CARD_ACTION_PARAMETERS_PLACEHOLDER");
              }
            });
          }
        }();
        return _temp10 && _temp10.then ? _temp10.then(_temp11) : _temp11(_temp10);
      });
      return Promise.resolve(_temp12 && _temp12.then ? _temp12.then(function () {
        return actionParameters;
      }) : actionParameters);
    } catch (e) {
      return Promise.reject(e);
    }
  };

  /**
   * Forms the Adaptive Card action from the control properties
   * @param controlProperties The control properties
   * @param bODataV4 The OData version
   * @param metaModel The meta model
   * @param context Context
   * @returns The action info
   */
  const getAdaptiveCardAction = function (controlProperties, bODataV4, metaModel, context) {
    try {
      const oResourceBundle = CoreLib.getResourceBundleFor("sap.cards.ap.generator.i18n");
      const actionStyle = getActionStyle(controlProperties);
      let actionParameters = [];
      let functionImportInfo;
      const data = {
        isConfirmationRequired: controlProperties.isConfirmationRequired || false
      };
      const enabledPathKey = controlProperties.enablePathKey;
      const actionInfo = {
        style: actionStyle,
        verb: "",
        label: controlProperties.title,
        actionParameters: [],
        data: data,
        enablePath: enabledPathKey || "",
        triggerActionText: oResourceBundle.getText("GENERATOR_ADAPTIVE_CARD_SUBMIT_ACTION_OK_BUTTON")
      };
      if (bODataV4) {
        return Promise.resolve(getActionParams(controlProperties, metaModel, context)).then(function (_getActionParams) {
          actionParameters = _getActionParams;
          actionInfo.verb = getActionVerb(controlProperties, metaModel);
          actionInfo.actionParameters = actionParameters || [];
          return actionInfo;
        });
      } else {
        functionImportInfo = getFunctionImportInfo(controlProperties, metaModel, context);
        actionInfo.verb = controlProperties.titleKey;
        actionInfo.parameters = functionImportInfo?.mActionParams?.parameterData;
        return Promise.resolve(getActionParameters(functionImportInfo?.mActionParams?.additionalParameters, context)).then(function (_getActionParameters) {
          actionInfo.actionParameters = _getActionParameters;
          data.actionParams = {
            keys: Object.keys(functionImportInfo?.mActionParams?.parameterData)
          };
          actionInfo.data = data;
          return actionInfo;
        });
      }
    } catch (e) {
      return Promise.reject(e);
    }
  };

  /**
   * Gets the related bound action for OData V4 model
   * @param actionValue The action value
   * @param actionType The action type
   * @returns Bound action
   */

  function getRelatedBoundAction(actionValue, actionType) {
    return actionValue?.filter(action => {
      const isBoundAction = action?.$IsBound;
      if (isBoundAction) {
        return action?.$Parameter?.some(actionParam => {
          return actionType === actionParam?.$Type;
        });
      }
    });
  }

  /**
   * Returns the related unbound actions for OData V4 model
   * @param actionValue The action value
   * @returns
   */
  function getRelatedUnboundActions(actionValue) {
    return actionValue?.filter(action => {
      return !action?.$IsBound;
    });
  }

  /**
   * Gets the valuehelp info for OData V4 metamodel
   *
   * @param metaModel
   * @param contextPath
   * @param actionParamName
   * @returns
   */
  const getValueHelpInfo = function (metaModel, contextPath, actionParamName) {
    try {
      return Promise.resolve(metaModel.requestValueListInfo(contextPath, true)).then(function (valueListInfo) {
        const valueListAnnotationInfo = valueListInfo?.[""];
        const valueListModel = valueListAnnotationInfo?.$model;
        const valueListPropertyName = getValueListPropertyName(valueListAnnotationInfo, actionParamName || "");
        const valueHelpEntitySet = valueListAnnotationInfo?.["CollectionPath"];
        const valueHelpAnnotation = valueListModel?.getMetaModel()?.getObject(`/${valueHelpEntitySet}/${valueListPropertyName}@`);
        return {
          valueHelpAnnotation,
          valueListPropertyName,
          valueHelpEntitySet,
          valueListModelServiceUrl: valueListModel?.getServiceUrl()
        };
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  /**
   * Returns the action parameter name for OData V4 model
   * @param context
   * @param actionVerb
   * @param actionParamName
   * @returns The action parameter label for OData V4 model
   */
  const getActionParameterName = function (context, actionVerb, actionParamName) {
    try {
      let _exit3 = false;
      return Promise.resolve(function () {
        if (actionParamName) {
          function _temp15(_result3) {
            return _exit3 ? _result3 : actionParameterAnnotation?.["@com.sap.vocabularies.Common.v1.Label"] || actionParamName;
          }
          const entitySetName = context.entitySet;
          const metaModel = context.appModel.getMetaModel();
          const contextPath = `/${entitySetName}/${actionVerb}/${actionParamName}`;
          const entitySet = metaModel.getObject("/" + context?.entitySet);
          const actionParameterAnnotation = metaModel.getObject("/" + entitySet?.$Type + "/" + actionParamName + "@");
          const _temp14 = function () {
            if (metaModel.getObject(`${contextPath}@`)?.["@com.sap.vocabularies.Common.v1.ValueListWithFixedValues"]) {
              return Promise.resolve(getValueHelpInfo(metaModel, contextPath, actionParamName)).then(function (_ref) {
                let {
                  valueHelpAnnotation
                } = _ref;
                const _temp13 = actionParameterAnnotation?.["@com.sap.vocabularies.Common.v1.Label"] || valueHelpAnnotation?.["@com.sap.vocabularies.Common.v1.Label"];
                _exit3 = true;
                return _temp13;
              });
            }
          }();
          return _temp14 && _temp14.then ? _temp14.then(_temp15) : _temp15(_temp14);
        }
      }());
    } catch (e) {
      return Promise.reject(e);
    }
  };

  /**
   * Returns the value list property name from annotations
   *
   * @param oValueList
   * @param sPropertyName
   * @returns
   */
  function getValueListPropertyName(oValueList, sPropertyName) {
    const oValueListParameter = oValueList?.Parameters.find(function (oParameter) {
      return oParameter?.LocalDataProperty?.$PropertyPath === sPropertyName;
    });
    return oValueListParameter?.ValueListProperty;
  }

  /**
   * Function to get the action parameter value based on the text arrangement annotation
   *
   * @param propertyPath
   * @param descriptionPath
   * @param textArrangementType
   * @returns
   */
  function getActionParameterValue(propertyPath, descriptionPath, textArrangementType) {
    if (textArrangementType === "TextOnly") {
      return "${" + descriptionPath + "}";
    } else if (textArrangementType === "TextLast") {
      return "${" + propertyPath + "}" + " (" + "${" + descriptionPath + "}" + ")";
    } else if (textArrangementType === "TextSeparate") {
      return "${" + propertyPath + "}";
    }
    return "${" + descriptionPath + "}" + " (${" + propertyPath + "})";
  }

  /**
   * Updates the model data with value help data for the action parameter
   *
   * @param data
   * @param serviceUrl
   * @param valueHelpEntitySet
   */
  const updateModelData = function (data, serviceUrl, valueHelpEntitySet) {
    try {
      return Promise.resolve(fetch(serviceUrl)).then(function (valueHelpData) {
        const {
          odataModel
        } = ApplicationInfo.getInstance().fetchDetails();
        const bODataV4 = odataModel === ODataModelVersion.V4;
        const _temp16 = function () {
          if (valueHelpData && typeof valueHelpData.json === "function") {
            return Promise.resolve(valueHelpData.json()).then(function (valueHelpDataJson) {
              const valueHelpDataValue = bODataV4 ? valueHelpDataJson?.value : valueHelpDataJson?.d?.results;
              if (valueHelpDataValue?.length) {
                data[valueHelpEntitySet] = valueHelpDataValue;
              }
            });
          }
        }();
        if (_temp16 && _temp16.then) return _temp16.then(function () {});
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  /**
   * Get Action Parameter Data for OData V4 model
   *
   * @param context
   * @param actionVerb
   * @param actionParamName
   * @returns
   */
  const getActionParameterConfiguration = function (context, actionVerb, actionParamName) {
    try {
      const actionParameterConfig = {
        serviceUrl: "",
        value: "",
        entitySet: "",
        title: ""
      };
      if (!actionParamName) {
        return Promise.resolve(actionParameterConfig);
      }
      const entitySetName = context.entitySet;
      const oDialogModel = context.dialog.getModel();
      const metaModel = context.appModel.getMetaModel();
      const contextPath = `/${entitySetName}/${actionVerb}/${actionParamName}`;
      const actionParamAnnotations = metaModel.getObject(`${contextPath}@`);
      if (!actionParamAnnotations?.["@com.sap.vocabularies.Common.v1.ValueListWithFixedValues"]) {
        return Promise.resolve(actionParameterConfig);
      }
      return Promise.resolve(getValueHelpInfo(metaModel, contextPath, actionParamName)).then(function (_ref2) {
        let {
          valueHelpAnnotation,
          valueListPropertyName,
          valueHelpEntitySet,
          valueListModelServiceUrl
        } = _ref2;
        const textArrangementPath = valueHelpAnnotation?.["@com.sap.vocabularies.Common.v1.Text"]?.$Path;
        const textArrangementAnnotation = valueHelpAnnotation?.["@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement"];
        const actionParameterValue = textArrangementAnnotation?.$EnumMember && valueListPropertyName && textArrangementPath || valueListPropertyName && textArrangementPath ? getActionParameterValue(valueListPropertyName, textArrangementPath, textArrangementAnnotation?.$EnumMember?.split("/")[1]) : "${" + valueListPropertyName + "}";
        let serviceUrl = valueListModelServiceUrl;
        serviceUrl = valueListPropertyName && textArrangementPath ? `${serviceUrl}${valueHelpEntitySet}?$select=${valueListPropertyName},${textArrangementPath}` : `${serviceUrl}${valueHelpEntitySet}?$select=${valueListPropertyName}`;
        serviceUrl = `${serviceUrl}&skip=0&$top=20`;
        const data = oDialogModel.getProperty("/configuration/$data");
        return Promise.resolve(updateModelData(data, serviceUrl, valueHelpEntitySet)).then(function () {
          oDialogModel.setProperty("/configuration/$data", data);
          return {
            entitySet: valueHelpEntitySet,
            serviceUrl: serviceUrl,
            value: actionParameterValue,
            title: "${" + valueListPropertyName + "}"
          };
        });
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  /**
   * Get Action Parameter Info for OData V4 application's Action
   *
   * The action parameter will consist of errorMessage and placeholder which will be used by adaptive card.
   * Currently the errorMessage and placeholder will have values only for actions having dropdown value as input.
   *
   * @param relatedAction The related action
   * @param context The context
   * @param actionVerb The action verb
   * @param isBoundAction Is bound action
   * @returns The action parameter info
   */
  const getActionParameterInfo = function (relatedAction, context, actionVerb, isBoundAction) {
    try {
      let _exit4 = false;
      const actionParamInfo = [];
      let actionIndex = 0;
      return Promise.resolve(function () {
        if (relatedAction && relatedAction.$Parameter) {
          const oResourceBundle = CoreLib.getResourceBundleFor("sap.cards.ap.generator.i18n");
          return _forOf(relatedAction.$Parameter, function (actionParam) {
            function _temp18() {
              actionIndex++;
              if (actionIndex === relatedAction.$Parameter.length) {
                _exit4 = true;
                return actionParamInfo;
              }
            }
            const isActionRequired = !isBoundAction || isBoundAction && actionIndex > 0;
            const _temp17 = function () {
              if (isActionRequired) {
                const isRequired = actionParam.$Nullable === false;
                const _actionParam$$Name = actionParam.$Name;
                return Promise.resolve(getActionParameterName(context, actionVerb, actionParam.$Name)).then(function (_getActionParameterNa) {
                  const actionParamInfoToAdd = {
                    isRequired: isRequired,
                    id: _actionParam$$Name,
                    label: _getActionParameterNa,
                    errorMessage: isRequired ? oResourceBundle.getText("GENERATOR_ADAPTIVE_CARD_ACTION_PARAMETERS_ERROR_MESSAGE") : "",
                    placeholder: ""
                  };
                  return Promise.resolve(getActionParameterConfiguration(context, actionVerb, actionParam.$Name)).then(function (_getActionParameterCo) {
                    const actionParameterConfig = _getActionParameterCo;
                    if (actionParameterConfig?.entitySet) {
                      actionParamInfoToAdd["configuration"] = actionParameterConfig;
                      actionParamInfoToAdd.placeholder = oResourceBundle.getText("GENERATOR_ADAPTIVE_CARD_ACTION_PARAMETERS_PLACEHOLDER");
                    }
                    actionParamInfo.push(actionParamInfoToAdd);
                  });
                });
              }
            }();
            return _temp17 && _temp17.then ? _temp17.then(_temp18) : _temp18(_temp17);
          }, function () {
            return _exit4;
          });
        }
      }());
    } catch (e) {
      return Promise.reject(e);
    }
  };

  /**
   * Gets the enabled value from annotation
   *
   * @param actionAnnotation
   * @returns
   */
  function getEnabledValueFromAnnotation(actionAnnotation) {
    if (actionAnnotation) {
      const operationAvailable = actionAnnotation["@Org.OData.Core.V1.OperationAvailable"];
      if (operationAvailable?.$Path) {
        return operationAvailable.$Path;
      } else if (operationAvailable?.Bool) {
        return operationAvailable.Bool;
      }
    }
    return "";
  }

  /**
   * Gets the critical value from annotation
   *
   * @param oCriticalAnnotation
   * @returns
   */
  function getCriticalValueFromAnnotation(oCriticalAnnotation) {
    if (!oCriticalAnnotation) {
      return false;
    }
    if (oCriticalAnnotation.Bool === undefined) {
      return true;
    }
    const oParameterValue = oCriticalAnnotation.Bool;
    if (typeof oParameterValue === "string") {
      const oActionValue = oParameterValue.toLowerCase();
      return !(oActionValue == "false" || oActionValue == "" || oActionValue == " ");
    }
    return !!oParameterValue;
  }

  /**
   *
   * Returns the metadata annotation info for OData V4 model ( enabled or critical value coming from metadata annotations )
   *
   * @param dataField
   * @param metaModel
   * @param entityTypeName
   * @returns
   */

  function getMetadataAnnotationInfoV4(dataField, metaModel, entitySetName) {
    const dataFieldAction = dataField.Action;
    const actionVerb = dataFieldAction.indexOf("(") > -1 ? dataFieldAction.split("(")[0] : dataFieldAction;
    const actionAnnotation = metaModel.getObject("/" + entitySetName + "/" + actionVerb + "@");
    const enablePath = getEnabledValueFromAnnotation(actionAnnotation);
    const isConfirmationRequired = getCriticalValueFromAnnotation(actionAnnotation?.["@com.sap.vocabularies.UI.v1.Critical"]);
    return {
      enablePath: enablePath,
      isConfirmationRequired: isConfirmationRequired
    };
  }

  /**
   * Get the metadata annotation info for OData V2 model
   *
   * @param dataField
   * @param metaModel
   * @returns
   */
  function getMetadataAnnotationInfoV2(dataField, metaModel) {
    const functionName = dataField.Action.String.split("/")[1];
    const functionImport = metaModel.getODataFunctionImport(functionName);
    return {
      enablePath: functionImport?.["sap:applicable-path"] || "",
      isConfirmationRequired: getCriticalValueFromAnnotation(functionImport?.["com.sap.vocabularies.Common.v1.IsActionCritical"])
    };
  }

  /**
   * Gets the action parameters for OData V4 model
   * @param controlProperties The control properties
   * @param metaModel The meta model
   * @param context The context
   * @returns Action parameters
   */
  const getActionParams = function (controlProperties, metaModel, context) {
    try {
      const titleKey = controlProperties.titleKey || "";
      const actionVerb = titleKey.indexOf("(") > -1 ? titleKey.split("(")[0] : titleKey;
      const actionValue = metaModel.getObject(`/${context.entitySet}/${actionVerb}`);
      let actionType = titleKey.indexOf("(") > -1 ? titleKey?.split("(")[1] : "";
      actionType = actionType.indexOf(")") > -1 ? actionType.replace(")", "") : actionType;

      //Get action Parameters for unbound action
      if (actionValue?.$kind === "ActionImport" && actionValue?.$Action) {
        const unBoundActions = metaModel.getObject("/" + actionValue?.$Action);
        const relatedUnboundAction = getRelatedUnboundActions(unBoundActions);
        return getActionParameterInfo(relatedUnboundAction[0], context, actionVerb);
      }

      //Get action Parameters for Bound actions
      const relatedBoundAction = getRelatedBoundAction(actionValue, actionType);
      return Promise.resolve(function () {
        if (relatedBoundAction?.length && relatedBoundAction[0]?.$Parameter != null && relatedBoundAction[0]?.$Parameter.length > 1) {
          return Promise.resolve(getActionParameterInfo(relatedBoundAction[0], context, actionVerb, true));
        }
      }());
    } catch (e) {
      return Promise.reject(e);
    }
  };

  /**
   * Get the action verb for OData V4 model
   * @param controlProperties The control properties
   * @param metaModel The meta model
   * @returns Returns the action string
   */
  function getActionVerb(controlProperties, metaModel) {
    const titleKey = controlProperties.titleKey || "";
    const actionVerb = titleKey.indexOf("(") > -1 ? titleKey.split("(")[0] : titleKey;
    const actionValue = metaModel.getObject("/" + actionVerb) || [];
    let actionType = titleKey.indexOf("(") > -1 ? titleKey.split("(")[1] : "";
    actionType = actionType.indexOf(")") > -1 ? actionType.replace(")", "") : actionType;

    //Get action string for unbound action
    if (actionValue?.$kind === "ActionImport" && actionValue?.$Action) {
      return titleKey?.split("/")[1];
    }
    const relatedBoundAction = getRelatedBoundAction(actionValue, actionType);
    //Get action string for bound action
    if (relatedBoundAction?.length) {
      return actionVerb;
    }
    return actionVerb;
  }

  /**
   * Get the function import info for OData V2 model's action
   *
   * @param controlProperties The control properties
   * @param metaModel The meta model
   * @param context Current context
   * @returns Functionimport info
   */
  function getFunctionImportInfo(controlProperties, metaModel, context) {
    const functionName = controlProperties.titleKey;
    const functionImport = metaModel.getODataFunctionImport(functionName);
    const oContextObject = context.dialog.getModel().getProperty("/configuration/$data");
    const entitySet = metaModel.getODataEntitySet(context?.entitySet);
    const entityType = metaModel.getODataEntityType(entitySet?.entityType);
    const mKeyProperties = getPropertyKeys(entityType);
    const oSkipProperties = {};
    const mActionParams = {
      parameterData: {},
      additionalParameters: []
    };
    functionImport?.parameter?.forEach(function (importParameter) {
      addParameterLabel(importParameter, entityType, metaModel);
      const parameterName = importParameter?.name || "";
      const isKey = !!mKeyProperties[parameterName];
      let parameterValue;
      if (oContextObject?.hasOwnProperty(parameterName)) {
        parameterValue = oContextObject[parameterName];
      } else if (isKey && oContextObject && functionImport["sap:action-for"]) {
        // parameter is key but not part of the current projection - raise error
        Log.error("Key parameter of action not found in current context: " + parameterName);
        throw new Error("Key parameter of action not found in current context: " + parameterName);
      }
      mActionParams.parameterData[parameterName] = parameterValue;
      const skip = !!oSkipProperties[parameterName];
      if (!skip && (!isKey || !functionImport["sap:action-for"]) && importParameter.mode.toUpperCase() == "IN") {
        // offer as optional parameter with default value from context
        mActionParams.additionalParameters.push(importParameter);
      }
    });
    return {
      mActionParams: mActionParams,
      functionImport: functionImport
    };
  }

  /**
   * Get the property keys for the entity type
   * @param entityType The entity type
   * @returns The property keys map
   */
  const getPropertyKeys = function (entityType) {
    const oKeyMap = {};
    entityType.key.propertyRef.forEach(property => {
      if (property.name) {
        oKeyMap[property.name] = true;
      }
    });
    return oKeyMap;
  };

  /**
   * Adds the parameter label to the entity type property
   *
   * @param parameter The Action parameter
   * @param entityType The entity type
   * @param metaModel The meta model
   */
  const addParameterLabel = function (parameter, entityType, metaModel) {
    if (entityType && parameter && !parameter["com.sap.vocabularies.Common.v1.Label"]) {
      const property = metaModel.getODataProperty(entityType, parameter.name, false);
      if (property && property["com.sap.vocabularies.Common.v1.Label"]) {
        // copy label from property to parameter with same name as default if no label is set for function import parameter
        parameter["com.sap.vocabularies.Common.v1.Label"] = property["com.sap.vocabularies.Common.v1.Label"];
      }
    }
  };

  /**
   *
   * Returns the service URL, valueListPropertyPath, descriptionPath for OData V2 model using the value list parameters
   *
   * @param serviceUrlPrefix
   * @param valueListParameters
   * @returns
   */
  function getParameterConfigFromValueList(serviceUrlPrefix, valueListParameters) {
    const selectProps = [];
    let valueListPropertyPath = "",
      descriptionPath = "";
    valueListParameters.forEach(valueListParameter => {
      const valueListProperty = valueListParameter?.ValueListProperty?.String;
      if (valueListProperty) {
        selectProps.push(valueListProperty);
        descriptionPath = valueListParameter?.RecordType === "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly" ? valueListProperty : descriptionPath;
        valueListPropertyPath = valueListParameter?.RecordType === "com.sap.vocabularies.Common.v1.ValueListParameterInOut" ? valueListProperty : valueListPropertyPath;
      }
    });
    const serviceUrl = `${serviceUrlPrefix}?$select=${selectProps.join(",")}`;
    return {
      serviceUrl,
      valueListPropertyPath,
      descriptionPath
    };
  }

  /**
   *
   * Get the action parameter configuration for OData V2 model
   *
   * @param parameter
   * @param context
   * @returns The action parameter configuration for OData V2 model
   */
  const getActionParameterConfigurationV2 = function (parameter, context) {
    try {
      const actionParameterConfig = {
        serviceUrl: "",
        value: "",
        entitySet: "",
        title: ""
      };
      if (!parameter) {
        return Promise.resolve(actionParameterConfig);
      }
      const ValueListAnnotation = parameter?.["com.sap.vocabularies.Common.v1.ValueList"];
      const valueListParameters = ValueListAnnotation?.Parameters;
      const entitySetName = ValueListAnnotation?.CollectionPath?.String;
      const {
        serviceUrl,
        valueListPropertyPath,
        descriptionPath
      } = getParameterConfigFromValueList(`${context.appModel.sServiceUrl}/${entitySetName}`, valueListParameters);
      let textArrangementType = "TextOnly";
      if (parameter?.["com.sap.vocabularies.UI.v1.TextArrangement"]) {
        textArrangementType = parameter["com.sap.vocabularies.UI.v1.TextArrangement"]?.EnumMember?.split("/")[1];
      }
      const actionParameterValue = valueListPropertyPath && descriptionPath ? getActionParameterValue(valueListPropertyPath, descriptionPath, textArrangementType) : "${" + valueListPropertyPath + "}";
      const oDialogModel = context.dialog.getModel();
      const data = oDialogModel.getProperty("/configuration/$data");
      return Promise.resolve(updateModelData(data, serviceUrl, entitySetName)).then(function () {
        oDialogModel.setProperty("/configuration/$data", data);
        return {
          entitySet: entitySetName,
          serviceUrl: serviceUrl,
          value: actionParameterValue,
          title: "${" + valueListPropertyPath + "}"
        };
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
  var __exports = {
    __esModule: true
  };
  __exports.getActionStyles = getActionStyles;
  __exports.getDefaultAction = getDefaultAction;
  __exports.getCardActions = getCardActions;
  __exports.addActionToCardManifest = addActionToCardManifest;
  __exports.removeActionFromManifest = removeActionFromManifest;
  __exports.resetCardActions = resetCardActions;
  __exports.updateCardManifestAction = updateCardManifestAction;
  __exports.getActionParameterValue = getActionParameterValue;
  __exports.updateModelData = updateModelData;
  __exports.getActionParameterConfigurationV2 = getActionParameterConfigurationV2;
  return __exports;
});
//# sourceMappingURL=FooterActions-dbg-dbg.js.map
