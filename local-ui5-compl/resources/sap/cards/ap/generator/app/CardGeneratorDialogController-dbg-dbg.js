/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/base/Log", "sap/base/util/merge", "sap/cards/ap/generator/odata/ODataUtils", "sap/cards/ap/transpiler/cardTranspiler/Transpile", "sap/m/MessageBox", "sap/m/MessageToast", "sap/ui/core/Element", "sap/ui/core/Fragment", "sap/ui/core/Popup", "sap/ui/core/library", "sap/ui/model/Filter", "sap/ui/model/json/JSONModel", "sap/ui/thirdparty/jquery", "../config/PreviewOptions", "../helpers/ApplicationInfo", "../helpers/Batch", "../helpers/FooterActions", "../helpers/Formatter", "../helpers/I18nHelper", "../helpers/IntegrationCardHelper", "../helpers/PropertyExpression", "../helpers/Transpiler", "../odata/ODataTypes", "../utils/CommonUtils"], function (Log, merge, ODataUtils, sap_cards_ap_transpiler_cardTranspiler_Transpile, MessageBox, MessageToast, CoreElement, Fragment, Popup, sap_ui_core_library, Filter, JSONModel, jQuery, ___config_PreviewOptions, ___helpers_ApplicationInfo, ___helpers_Batch, ___helpers_FooterActions, ___helpers_Formatter, ___helpers_I18nHelper, ___helpers_IntegrationCardHelper, ___helpers_PropertyExpression, ___helpers_Transpiler, ___odata_ODataTypes, ___utils_CommonUtils) {
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
  const toggleAdvancedSetting = function (toggleEvent) {
    try {
      const toggleButton = toggleEvent.getSource();
      toggleButton.setEnabled(false);
      const splitter = CoreElement.getElementById("cardGeneratorDialog--contentSplitter");
      const controller = {
        onCriticalityChange: criticalityChangeEvent => {
          updateCriticality(criticalityChangeEvent.getParameter("isCalcuationType") || false);
        },
        onArrangementsChange: function (arrangementChangeEvent) {
          return Promise.resolve(checkForNavigationProperty(arrangementChangeEvent)).then(function () {
            updateArrangements();
            const dialogModel = context.dialog.getModel();
            const groups = dialogModel.getProperty("/configuration/groups");
            for (let i = 0; i < groups?.[0].items.length; i++) {
              const item = groups[0].items[i];
              const uom = item.value.split(" ")[1] && item.value.split(" ")[1].slice(1, -1);
              if (uom !== "undefined" && uom !== undefined) {
                dialogModel.setProperty("/configuration/advancedFormattingOptions/targetProperty", uom);
              } else if (uom === undefined) {
                dialogModel.setProperty("/configuration/advancedFormattingOptions/targetProperty", "");
              }
              if (uom !== "undefined" && uom !== undefined && aPropsWithUoM?.indexOf(item?.name) === -1) {
                aPropsWithUoM.push(item?.name);
              }
            }
          });
        },
        onPropertyFormatterChangeFromAdvancedSettings: function () {
          updateHeaderArrangements();
        }
      };
      return Promise.resolve(Fragment.load({
        name: "sap.cards.ap.generator.app.fragments.AdvancedSettings",
        controller: controller
      }).then(function (advancedSettings) {
        if (!toggleButton.getPressed()) {
          const lastContentArea = splitter.getContentAreas()[1]; // position 1 is the advance panel
          splitter.removeContentArea(lastContentArea);
        } else {
          splitter.insertContentArea(advancedSettings, 1); // position 1 is the advance panel
        }
        toggleButton.setEnabled(true);
        setTimeout(() => {
          transpileIntegrationCardToAdaptive(context.dialog.getModel());
        }, 0);
      })).then(function () {});
    } catch (e) {
      return Promise.reject(e);
    }
  };
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
  const checkForNavigationProperty = function (event) {
    try {
      const selectedParameters = event.getParameters();
      const selectedItem = selectedParameters.selectedItem;
      if (!selectedItem) return Promise.resolve();
      const model = context.dialog.getModel();
      const navigationProperties = model.getProperty("/configuration/navigationProperty") || [];
      const selectedNavigationalProperties = model.getProperty("/configuration/selectedNavigationalProperties") || [];
      const existingIndex = selectedNavigationalProperties.findIndex(navItem => navItem.name === selectedItem.value);
      const selectedProperty = navigationProperties.find(prop => prop.name === selectedItem.value);
      const {
        name: selectedPropertyName = "",
        properties: selectedPropertyValues = []
      } = selectedProperty || {};
      const data = {
        name: selectedPropertyName,
        value: selectedPropertyValues
      };
      if (existingIndex === -1 && selectedProperty) {
        selectedNavigationalProperties.push(data);
      }
      model.setProperty("/configuration/selectedNavigationalProperties", selectedNavigationalProperties);
      const _temp5 = function () {
        if (selectedProperty) {
          return Promise.resolve(updateCardConfigurationData(selectedProperty.name, data)).then(function () {
            if (selectedParameters.textArrangementChanged) {
              selectedItem.navigationalPropertiesForId = data.value;
              selectedItem.isNavigationForId = data.value.length > 0;
              selectedItem.navigationKeyForId = "";
            } else {
              selectedItem.navigationalPropertiesForDescription = data.value;
              selectedItem.isNavigationForDescription = data.value.length > 0;
              selectedItem.navigationKeyForDescription = "";
            }
            selectedItem.value = ""; // to reset navigation combobox value in the card and dropdown.
          });
        } else {
          if (selectedParameters.textArrangementChanged) {
            selectedItem.isNavigationForId = false;
            selectedItem.navigationKeyForId = "";
          } else {
            selectedItem.isNavigationForDescription = false;
            selectedItem.navigationKeyForDescription = "";
          }
        }
      }();
      return Promise.resolve(_temp5 && _temp5.then ? _temp5.then(function () {}) : void 0);
    } catch (e) {
      return Promise.reject(e);
    }
  };
  const onPropertySelection = function (oEvent) {
    try {
      const control = oEvent.getSource();
      const selectedKey = control.getSelectedKey() || "";
      const newValue = oEvent.getParameter("newValue");
      const currentValue = selectedKey !== "" ? `{${selectedKey}}` : newValue;
      const oModel = context.dialog.getModel();
      validateContol(oEvent);
      return Promise.resolve(updateSelectedNavigationProperty(selectedKey, false)).then(function () {
        const selectedNavigationPropertiesContent = oModel.getProperty("/configuration/selectedNavigationPropertiesContent");
        oModel.setProperty("/configuration/advancedFormattingOptions/sourceProperty", selectedKey);
        const sPath = control?.getBindingContext()?.getPath();
        const group = oModel.getProperty(sPath);
        if (!selectedNavigationPropertiesContent?.value?.length) {
          group.value = selectedKey && getArrangements(currentValue, {
            unitOfMeasures: oModel.getProperty("/configuration/advancedFormattingOptions/unitOfMeasures"),
            textArrangements: oModel.getProperty("/configuration/advancedFormattingOptions/textArrangements"),
            propertyValueFormatters: oModel.getProperty("/configuration/advancedFormattingOptions/propertyValueFormatters")
          });
        } else {
          group.value = "";
          group.navigationProperty = "";
          group.navigationalProperties = selectedNavigationPropertiesContent?.value;
        }
        const propertyLabel = ODataUtils.getPropertyLabel(context.appModel, context.entitySet, selectedKey, PropertyInfoType.Property);
        group.label = selectedNavigationPropertiesContent?.value?.length ? "" : propertyLabel;
        group.isEnabled = propertyLabel?.length > 0 && !selectedNavigationPropertiesContent?.value?.length || false;
        group.isNavigationEnabled = selectedNavigationPropertiesContent?.value?.length > 0;
        oModel.refresh();
        updateCardGroups(oModel);
        transpileIntegrationCardToAdaptive(context.dialog.getModel());
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
  const okPressed = function () {
    try {
      const hasError = validateHeader();
      if (hasError) {
        return Promise.resolve();
      }
      const oCard = CoreElement.getElementById("cardGeneratorDialog--cardPreview");
      const mManifest = oCard.getManifest();
      return Promise.resolve(enhanceManifestWithInsights(mManifest, context.rootComponent)).then(function () {
        enhanceManifestWithConfigurationParameters(mManifest, context.dialog.getModel());
        createAndStoreGeneratedi18nKeys(mManifest);
        updateManifestWithSelectQueryParams(mManifest);
        const oModel = context.dialog.getModel();
        const keyParameters = oModel.getProperty("/configuration/keyParameters");
        const appIntent = oModel.getProperty("/configuration/appIntent");
        const oAdaptiveCardManifest = convertIntegrationCardToAdaptive(mManifest, appIntent, keyParameters);
        delete mManifest["sap.card"].configuration?.parameters?.contextParameters;
        const payload = {
          floorplan: "ObjectPage",
          localPath: `cards/op/${context.entitySet}`,
          fileName: "manifest.json",
          manifests: [{
            type: "integration",
            manifest: mManifest,
            default: true,
            entitySet: context.entitySet
          }, {
            type: "adaptive",
            manifest: oAdaptiveCardManifest,
            default: true,
            entitySet: context.entitySet
          }]
        };
        jQuery.ajax({
          type: "POST",
          url: "/cards/store",
          headers: {
            "Content-Type": "application/json"
          },
          data: JSON.stringify(payload),
          success: function () {
            MessageToast.show(getTranslatedText("CARD_SAVE_SUCCESS_MESSAGE"));
          },
          error: function (jqXHR, textStatus, errorThrown) {
            const errorMessage = `Unable to save the card: ${textStatus} - ${errorThrown} (Status: ${jqXHR.status} - ${jqXHR.statusText})`;
            Log.error(errorMessage);
            MessageBox.error(getTranslatedText("CARD_SAVE_ERROR_MESSAGE"));
          }
        });
        context.dialog.close();
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
  const updateSelectedNavigationProperty = function (selectedKey, isHeader) {
    try {
      const oModel = context.dialog.getModel();
      const navigationProperty = oModel.getProperty("/configuration/navigationProperty") || [];
      const selectedNavigationalProperties = oModel.getProperty("/configuration/selectedNavigationalProperties") || [];
      const existingIndex = selectedNavigationalProperties.findIndex(navItem => navItem.name === selectedKey);
      const selectedProperty = navigationProperty.find(prop => prop.name === selectedKey);
      const selectedPropertyName = selectedProperty?.name || "";
      const selectedPropertyValues = selectedProperty?.properties || [];
      const data = {
        name: selectedPropertyName,
        value: selectedPropertyValues
      };
      if (existingIndex === -1 && selectedProperty) {
        selectedNavigationalProperties.push(data);
      }
      oModel.setProperty("/configuration/selectedNavigationalProperties", selectedNavigationalProperties);
      if (isHeader) {
        oModel.setProperty("/configuration/selectedNavigationPropertyHeader", data);
      } else {
        oModel.setProperty("/configuration/selectedNavigationPropertiesContent", data);
      }
      const _temp4 = function () {
        if (selectedProperty) {
          return Promise.resolve(updateCardConfigurationData(selectedProperty.name, data)).then(function () {});
        }
      }();
      return Promise.resolve(_temp4 && _temp4.then ? _temp4.then(function () {}) : void 0);
    } catch (e) {
      return Promise.reject(e);
    }
  };
  /**
   * Handles the change event for card KPI value selection.
   * @param oEvent
   */
  const onStateIndicatorSelection = function (oEvent) {
    try {
      const getHeaderConfiguration = value => {
        const oModel = context.dialog.getModel();
        return {
          "sap.card": {
            header: {
              mainIndicator: {
                state: getCriticality(value),
                number: getArrangements(value, {
                  unitOfMeasures: oModel.getProperty("/configuration/advancedFormattingOptions/unitOfMeasures"),
                  textArrangements: oModel.getProperty("/configuration/advancedFormattingOptions/textArrangements"),
                  propertyValueFormatters: oModel.getProperty("/configuration/advancedFormattingOptions/propertyValueFormatters")
                })
              }
            }
          }
        };
      };
      const oModel = context.dialog.getModel();
      const control = oEvent.getSource();
      const selectedKey = control.getSelectedKey();
      return Promise.resolve(updateSelectedNavigationProperty(selectedKey, true)).then(function () {
        const selectedNavigationPropertyHeader = oModel.getProperty("/configuration/selectedNavigationPropertyHeader");
        const selectedValue = oEvent.getParameter("newValue");
        validateContol(oEvent, "stateIndicator");
        const currentValue = selectedKey !== "" ? `{${selectedKey}}` : selectedValue;
        oModel.setProperty("/configuration/mainIndicatorNavigationSelectedValue", "");
        oModel.setProperty("/configuration/mainIndicatorNavigationSelectedKey", "");
        oModel.setProperty("/configuration/advancedFormattingOptions/isPropertyFormattingEnabled", !!(selectedKey && !selectedNavigationPropertyHeader?.value?.length && selectedNavigationPropertyHeader?.name === ""));
        const properties = oModel.getProperty("/configuration/properties");
        const dataType = properties.find(prop => prop.name === selectedKey)?.type || "";
        const isDateType = ODataUtils.isPropertyTypeDate(dataType);
        const isNumberType = ["Edm.Decimal", "Edm.Int16", "Edm.Int32", "Edm.Double"].indexOf(dataType) > -1;
        oModel.setProperty("/configuration/mainIndicatorStatusKey", selectedKey);
        oModel.setProperty("/configuration/advancedFormattingOptions/isFormatterEnabled", isDateType || isNumberType);
        oModel.setProperty("/configuration/advancedFormattingOptions/textArrangementSourceProperty", currentValue);
        oModel.setProperty("/configuration/advancedFormattingOptions/textArrangementSelectedKey", selectedKey);
        if (oModel.getProperty("/configuration/trendOptions/sourceProperty") !== selectedKey) {
          oModel.setProperty("/configuration/trendOptions", {});
          oModel.setProperty("/configuration/indicatorsValue", {});
        }
        oModel.setProperty("/configuration/trendOptions/sourceProperty", selectedKey);
        oModel.setProperty("/configuration/indicatorsValue/sourceProperty", selectedKey);
        updateTrendForCardHeader();
        updateSideIndicatorsForHeader();
        oModel.setProperty("/configuration/navigationValue", "");
        if (!selectedNavigationPropertyHeader?.value.length) {
          updateCardHeader(oEvent, getHeaderConfiguration, "mainIndicator");
        } else {
          updateCardHeader(oEvent, getHeaderConfiguration, "navSelection");
        }
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
  /**
   * Disables or enables the apply unit of measure based on the selected property.
   * @param {JSONModel} model - The JSON model containing the configuration.
   * @param {string} selectedProperty - The name of the selected property.
   */
  const updateCardConfigurationData = function (selectedProperty, selectedNavigationProperty) {
    try {
      const {
        entitySetWithObjectContext
      } = ApplicationInfo.getInstance().fetchDetails();
      const oModel = context.dialog.getModel();
      const {
        serviceUrl,
        oDataV4,
        $data
      } = oModel.getProperty("/configuration");
      const queryParameters = {
        properties: [],
        navigationProperties: [{
          name: selectedProperty,
          properties: selectedNavigationProperty.value.map(property => property.name) || []
        }]
      };
      return Promise.resolve(ODataUtils.fetchDataAsync(serviceUrl, entitySetWithObjectContext, oDataV4, createUrlParameters(queryParameters))).then(function (result) {
        addLabelsForProperties(selectedNavigationProperty, result);
        $data[selectedProperty] = result[selectedProperty];
        oModel.setProperty("/configuration/$data", $data);
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
  const convertIntegrationCardToAdaptive = sap_cards_ap_transpiler_cardTranspiler_Transpile["convertIntegrationCardToAdaptive"];
  const ValueState = sap_ui_core_library["ValueState"];
  const PREVIEW_OPTIONS = ___config_PreviewOptions["PREVIEW_OPTIONS"];
  const ApplicationInfo = ___helpers_ApplicationInfo["ApplicationInfo"];
  const createUrlParameters = ___helpers_Batch["createUrlParameters"];
  const updateManifestWithSelectQueryParams = ___helpers_Batch["updateManifestWithSelectQueryParams"];
  const addActionToCardManifest = ___helpers_FooterActions["addActionToCardManifest"];
  const removeActionFromManifest = ___helpers_FooterActions["removeActionFromManifest"];
  const resetCardActions = ___helpers_FooterActions["resetCardActions"];
  const updateCardManifestAction = ___helpers_FooterActions["updateCardManifestAction"];
  const formatPropertyDropdownValues = ___helpers_Formatter["formatPropertyDropdownValues"];
  const createAndStoreGeneratedi18nKeys = ___helpers_I18nHelper["createAndStoreGeneratedi18nKeys"];
  const enhanceManifestWithConfigurationParameters = ___helpers_IntegrationCardHelper["enhanceManifestWithConfigurationParameters"];
  const enhanceManifestWithInsights = ___helpers_IntegrationCardHelper["enhanceManifestWithInsights"];
  const getCurrentCardManifest = ___helpers_IntegrationCardHelper["getCurrentCardManifest"];
  const renderCardPreview = ___helpers_IntegrationCardHelper["renderCardPreview"];
  const updateCardGroups = ___helpers_IntegrationCardHelper["updateCardGroups"];
  const getArrangements = ___helpers_PropertyExpression["getArrangements"];
  const resolvePropertyPathFromExpression = ___helpers_PropertyExpression["resolvePropertyPathFromExpression"];
  const transpileIntegrationCardToAdaptive = ___helpers_Transpiler["transpileIntegrationCardToAdaptive"];
  const PropertyInfoType = ___odata_ODataTypes["PropertyInfoType"];
  const isBinding = ___utils_CommonUtils["isBinding"];
  const context = {};
  const aPropsWithUoM = [];
  const MAX_GROUPS = 5;
  const MAX_GROUP_ITEMS = 5;
  const cardActionHandlers = {
    onActionAddClick: function () {
      const oModel = context.dialog.getModel();
      const addedActions = oModel.getProperty("/configuration/actions/addedActions");
      if (addedActions.length < 2) {
        addedActions.push({
          title: "",
          titleKey: "",
          style: "Default",
          enablePathKey: "",
          isStyleControlEnabled: false,
          isConfirmationRequired: false
        });
        oModel.setProperty("/configuration/actions/addedActions", addedActions);
      }
      oModel.setProperty("/configuration/actions/isAddActionEnabled", addedActions.length < 2);
    },
    onAddedActionDelete: function (oEvent) {
      const oModel = context.dialog.getModel();
      const control = oEvent?.getSource();
      const sPath = control?.getBindingContext()?.getPath();
      const actionIndex = Number(sPath?.split("/configuration/actions/addedActions/")[1]);
      const addedActions = oModel.getProperty("/configuration/actions/addedActions");
      const deletedAction = actionIndex !== undefined ? addedActions.splice(actionIndex, 1) : [];
      oModel.setProperty("/configuration/actions/addedActions", addedActions);
      oModel.setProperty("/configuration/actions/isAddActionEnabled", addedActions.length < 2);
      const manifest = getCurrentCardManifest();
      removeActionFromManifest(manifest, deletedAction[0]);
      renderCardPreview(manifest, context.dialog.getModel());
      transpileIntegrationCardToAdaptive(context.dialog.getModel());
    },
    validateSelectedAction: function (control) {
      const oModel = context.dialog.getModel();
      const annotationActions = oModel.getProperty("/configuration/actions/annotationActions");
      return annotationActions.some(annotationAction => {
        return annotationAction.label === control.getValue() && annotationAction.action === control.getSelectedKey();
      });
    },
    updateRelativeproperties: function (addedAction, sPath) {
      const oModel = context.dialog.getModel();
      const annotationActions = oModel.getProperty("/configuration/actions/annotationActions");
      const relatedAnnotationAction = annotationActions.filter(annotationAction => {
        return annotationAction.label === addedAction.title && annotationAction.action === addedAction.titleKey;
      });
      if (relatedAnnotationAction.length) {
        let enabledPath = relatedAnnotationAction[0].enablePath;
        enabledPath = enabledPath?.indexOf("_it/") > -1 ? enabledPath?.replace("_it/", "") : enabledPath; // Remove instance of _it/ from the path
        const isConfirmationRequired = relatedAnnotationAction[0].isConfirmationRequired;
        if (enabledPath) {
          addedAction.enablePathKey = enabledPath;
        }
        if (isConfirmationRequired) {
          addedAction.isConfirmationRequired = isConfirmationRequired;
        }
      }
      if (sPath) {
        oModel.setProperty(sPath, addedAction);
      }
    },
    filterCardActions: function (comboBox) {
      const dialogModel = context.dialog.getModel();
      const addedActions = dialogModel.getProperty("/configuration/actions/addedActions");
      const itemsBinding = comboBox.getBinding("items");
      const titleKey = comboBox.getSelectedKey();
      const actionToFilter = addedActions.filter(addedAction => addedAction.titleKey !== titleKey);
      const filter = actionToFilter.length ? new Filter("action", "NE", actionToFilter[0].titleKey) : [];
      itemsBinding.filter(filter);
    },
    loadActions: function (controlEvent) {
      const comboBox = controlEvent.getSource();
      const itemsBinding = comboBox.getBinding("items");
      if (itemsBinding?.isSuspended()) {
        itemsBinding.refresh(true);
        itemsBinding.resume();
      }
      comboBox.addEventDelegate({
        onBeforeRendering: this.filterCardActions.bind(null, comboBox)
      });
    },
    onAddedActionTitleChange: function (oEvent) {
      try {
        const _this = this;
        const oModel = context.dialog.getModel();
        const control = oEvent.getSource();
        const path = control?.getBindingContext()?.getPath();
        return Promise.resolve(function () {
          if (_this.validateSelectedAction(control)) {
            function _temp3() {
              renderCardPreview(manifest, context.dialog.getModel());
              transpileIntegrationCardToAdaptive(context.dialog.getModel());
            }
            const addedAction = oModel.getProperty(path);
            addedAction.titleKey = control.getSelectedKey();
            addedAction.title = control.getValue();
            addedAction.isStyleControlEnabled = true;
            _this.updateRelativeproperties(addedAction, path || "");
            control.setValueState(ValueState.None);
            const manifest = getCurrentCardManifest();
            resetCardActions(manifest);
            const addedActions = oModel.getProperty("/configuration/actions/addedActions");
            const _temp2 = _forOf(addedActions, function (action) {
              const _temp = function () {
                if (action.titleKey) {
                  return Promise.resolve(addActionToCardManifest(manifest, action, context)).then(function () {});
                }
              }();
              if (_temp && _temp.then) return _temp.then(function () {});
            });
            return _temp2 && _temp2.then ? _temp2.then(_temp3) : _temp3(_temp2);
          } else {
            control.setValueState(ValueState.Error);
            control.setValueStateText(getTranslatedText("GENERATOR_ACTION_ERROR_TEXT"));
            const errorControls = oModel.getProperty("/configuration/errorControls");
            errorControls?.push(control);
            control.focus();
          }
        }());
      } catch (e) {
        return Promise.reject(e);
      }
    },
    onAddedActionStyleChange: function (oEvent) {
      const oModel = context.dialog.getModel();
      const control = oEvent.getSource();
      const sPath = control?.getBindingContext()?.getPath();
      const addedAction = oModel.getProperty(sPath);
      addedAction.style = control.getSelectedKey();
      oModel.setProperty(sPath, addedAction);
      const manifest = getCurrentCardManifest();
      updateCardManifestAction(manifest, addedAction);
      renderCardPreview(manifest, context.dialog.getModel());
      transpileIntegrationCardToAdaptive(context.dialog.getModel());
    }
  };
  const CardGeneratorDialogController = {
    initialize: function (rootComponent, control, entitySet) {
      context.rootComponent = rootComponent;
      context.appModel = rootComponent.getModel();
      context.dialog = control;
      context.entitySet = entitySet;
      const oModel = new JSONModel(PREVIEW_OPTIONS);
      context?.dialog?.setModel(oModel, "previewOptions");
      const oModelDialog = context.dialog.getModel();
      updateCardGroups(oModelDialog);
    },
    okPressed,
    cancelPressed: closeDialog,
    onAddClick,
    onGroupAddClick,
    onGroupDeleteClick,
    onDeleteClick,
    onPropertySelection,
    updateContentNavigationSelection,
    onPropertyLabelChange,
    onTitleSelection,
    onSubTitleSelection,
    onGroupTitleChange,
    validateContol,
    onDrop,
    onHeaderUOMSelection,
    onStateIndicatorSelection,
    updateHeaderNavigationSelection,
    onHeightChange,
    onWidthChange,
    onResetPressed,
    onItemsActionsButtonPressed,
    onPreviewTypeChange,
    toggleAdvancedSetting,
    getTranslatedText,
    onPropertyFormatting,
    onActionAddClick: cardActionHandlers.onActionAddClick,
    onAddedActionDelete: cardActionHandlers.onAddedActionDelete,
    onAddedActionStyleChange: cardActionHandlers.onAddedActionStyleChange,
    onAddedActionTitleChange: cardActionHandlers.onAddedActionTitleChange,
    validateSelectedAction: cardActionHandlers.validateSelectedAction,
    updateRelativeproperties: cardActionHandlers.updateRelativeproperties,
    loadActions: cardActionHandlers.loadActions,
    filterCardActions: cardActionHandlers.filterCardActions,
    /* Methods exposed for testing */
    _updateTrendForCardHeader: updateTrendForCardHeader,
    _updateSideIndicatorsForHeader: updateSideIndicatorsForHeader,
    _setAdvancedFormattingOptionsEnablement: setAdvancedFormattingOptionsEnablement,
    _updateHeaderArrangements: updateHeaderArrangements,
    _updateArrangements: updateArrangements,
    _updateCriticality: updateCriticality,
    _validateHeader: validateHeader,
    applyCriticality: applyCriticality,
    applyUoMFormatting: applyUoMFormatting,
    onTrendDelete: onTrendDelete,
    loadAdvancedFormattingConfigurationFragment: loadAdvancedFormattingConfigurationFragment,
    addLabelsForProperties: addLabelsForProperties,
    checkForNavigationProperty: checkForNavigationProperty,
    disableOrEnableUOMAndTrend: disableOrEnableUOMAndTrend
  };
  function getCriticality(sPropertyName, isCalcuationType) {
    const oModel = context?.dialog?.getModel();
    const aMainIndicatorCriticality = oModel?.getProperty("/configuration/mainIndicatorOptions/criticality");
    const oMatchedCriticality = aMainIndicatorCriticality?.find(function (oCriticality) {
      return oCriticality?.name === sPropertyName || "{" + oCriticality?.name + "}" === sPropertyName;
    });
    if (oMatchedCriticality) {
      if (isBinding(oMatchedCriticality?.criticality)) {
        return "{= extension.formatters.formatCriticality($" + oMatchedCriticality?.criticality + ", 'color') }";
      }
      if (oMatchedCriticality?.activeCalculation || isCalcuationType) {
        const staticValues = {
          deviationLow: oMatchedCriticality?.deviationRangeLowValue,
          deviationHigh: oMatchedCriticality?.deviationRangeHighValue,
          toleranceLow: oMatchedCriticality?.toleranceRangeLowValue,
          toleranceHigh: oMatchedCriticality?.toleranceRangeHighValue,
          sImprovementDirection: oMatchedCriticality?.improvementDirection,
          oCriticalityConfigValues: {
            None: "Neutral",
            Negative: "Error",
            Critical: "Critical",
            Positive: "Good"
          }
        };
        return "{= extension.formatters.formatValueColor(${" + oMatchedCriticality?.name + "}," + JSON.stringify(staticValues) + ") }";
      }
      return oMatchedCriticality?.criticality;
    }
    return "None";
  }

  /**
   * This functions updates the enablement of the advanced formatting options based on the source property.
   * @param sourceProperty
   * @returns
   */
  function setAdvancedFormattingOptionsEnablement(sourceProperty) {
    const oModel = context.dialog.getModel();
    const mainIndicatorProperty = oModel.getProperty("/configuration/mainIndicatorStatusKey");
    oModel.setProperty("/configuration/trendOptions/sourceProperty", mainIndicatorProperty);
    oModel.setProperty("/configuration/indicatorsValue/sourceProperty", mainIndicatorProperty);
    const properties = oModel.getProperty("/configuration/properties");
    const unitsOfMeasure = oModel.getProperty("/configuration/advancedFormattingOptions/unitOfMeasures") || [];
    const propertyValueFormatters = oModel.getProperty("/configuration/advancedFormattingOptions/propertyValueFormatters") || [];
    const mainIndicatorCriticality = oModel.getProperty("/configuration/mainIndicatorOptions/criticality") || [];
    const selectedTrendOptions = oModel.getProperty("/configuration/selectedTrendOptions") || [];
    const selectedIndicatorOptions = oModel.getProperty("/configuration/selectedIndicatorOptions") || [];
    const dataType = properties.find(property => property.name === sourceProperty)?.type || "";
    const isDateType = ODataUtils.isPropertyTypeDate(dataType);
    const isNumberType = ["Edm.Decimal", "Edm.Int16", "Edm.Int32", "Edm.Double"].indexOf(dataType) > -1;
    let isFormatterApplied = propertyValueFormatters.some(function (formatterDetail) {
      return formatterDetail.property === sourceProperty || "{" + formatterDetail.property + "}" === sourceProperty;
    });
    const formatterApplied = propertyValueFormatters.filter(function (formatterDetail) {
      return formatterDetail.property === sourceProperty || "{" + formatterDetail.property + "}" === sourceProperty;
    })[0];
    if (formatterApplied?.formatterName === "format.unit" && typeof formatterApplied?.parameters[1].properties[0].value !== "number") {
      isFormatterApplied = false;
    }
    const isUOMApplied = unitsOfMeasure.some(function (arrangementDetail) {
      return arrangementDetail.name === sourceProperty;
    });
    const isCriticalityApplied = mainIndicatorCriticality.some(indicatorCriticality => {
      return indicatorCriticality.name === sourceProperty;
    });
    const isTrendApplied = selectedTrendOptions.some(function (trendDetail) {
      return trendDetail.sourceProperty === sourceProperty && trendDetail.downDifference;
    });
    const isIndicatorsApplied = selectedIndicatorOptions.some(function (indicatorDetail) {
      return indicatorDetail.sourceProperty === sourceProperty && indicatorDetail.targetUnit;
    });
    oModel.setProperty("/configuration/advancedFormattingOptions/isFormatterApplied", isFormatterApplied);
    oModel.setProperty("/configuration/advancedFormattingOptions/isFormatterEnabled", isDateType || isNumberType);
    oModel.setProperty("/configuration/advancedFormattingOptions/isUOMApplied", isUOMApplied);
    oModel.setProperty("/configuration/advancedFormattingOptions/isCriticalityApplied", isCriticalityApplied);
    oModel.setProperty("/configuration/advancedFormattingOptions/isTrendApplied", isTrendApplied);
    oModel.setProperty("/configuration/advancedFormattingOptions/isIndicatorsApplied", isIndicatorsApplied);
    const trendOptions = oModel.getProperty("/configuration/trendOptions");
    const indicatorsValue = oModel.getProperty("/configuration/indicatorsValue");
    if (trendOptions) {
      const {
        referenceValue,
        downDifference,
        upDifference
      } = trendOptions;
      if (referenceValue && downDifference && upDifference) {
        oModel.setProperty("/configuration/trendOptions/upDown", true);
      }
    }
    if (indicatorsValue) {
      const {
        targetValue,
        deviationValue,
        targetUnit,
        deviationUnit
      } = indicatorsValue;
      if (targetValue && deviationValue && targetUnit && deviationUnit) {
        oModel.setProperty("/configuration/indicatorsValue/targetDeviation", true);
      }
    }
  }

  /**
   * Updates "sap.card.header" property of integration card manifest and triggers rendering of the card preview.
   *
   * @param oEvent
   * @param key
   * @param fnGetHeaderConfig
   */
  function updateCardHeader(oEvent, fnGetHeaderConfig, key) {
    const control = oEvent.getSource();
    const selectedKey = control.getSelectedKey() || "";
    const newValue = oEvent.getParameter("newValue");
    let currentValue = selectedKey !== "" ? `{${selectedKey}}` : newValue;
    const oModel = context.dialog.getModel();
    if (key === "navSelection") {
      const navigationValue = oModel.getProperty("/configuration/navigationValue");
      currentValue = navigationValue ? `{${navigationValue}}` : "";
    }
    if (!selectedKey && key === "mainIndicator") {
      currentValue = "";
    }
    if (selectedKey !== "" || currentValue !== "") {
      control.setValueState(ValueState.None);
    }
    const sapCardHeader = fnGetHeaderConfig(currentValue);
    const currentManifest = getCurrentCardManifest();
    const oManifest = merge(currentManifest, sapCardHeader);
    if (currentValue === "" && key === "mainIndicator") {
      delete oManifest["sap.card"].header.mainIndicator;
      delete oManifest["sap.card"].header.sideIndicators;
    }
    oModel.setProperty("/configuration/advancedFormattingOptions/sourceProperty", selectedKey);
    renderCardPreview(oManifest, context.dialog.getModel());
    transpileIntegrationCardToAdaptive(context.dialog.getModel());
  }

  /**
   * Handles the change event for card title selection.
   * @param oEvent
   */
  function onTitleSelection(oEvent) {
    const getHeaderConfiguration = value => {
      return {
        "sap.card": {
          header: {
            title: value
          }
        }
      };
    };
    validateContol(oEvent, "title");
    updateCardHeader(oEvent, getHeaderConfiguration);
  }
  /**
   * Validates the control(control's selected key) based on the provided event and control name.
   * @param {Event} oEvent The event triggered by the control.
   * @param {string} [controlName] The name of the control being validated.
   */
  function validateContol(oEvent, controlName) {
    const control = oEvent.getSource();
    const selectedKey = control.getSelectedKey();
    const value = oEvent.getParameter("newValue");
    const oModel = context.dialog.getModel();
    const errorControls = oModel.getProperty("/configuration/errorControls");
    const resourceBundle = context.dialog.getModel("i18n").getResourceBundle();

    /**
     * Gets the key for the given control name.
     * @param {string} name The name of the control.
     * @returns {string} The key associated with the control name.
     */
    const getKey = name => {
      switch (name) {
        case "title":
          return resourceBundle.getText("GENERATOR_CARD_TITLE");
        case "stateIndicator":
          return resourceBundle.getText("GENERATOR_MAIN_INDICATOR");
        default:
          return resourceBundle.getText("GENERATOR_GROUP_PROPERTY");
      }
    };
    const controlErrorText = resourceBundle.getText("GENERIC_ERR_MSG", [getKey(controlName ?? "")]);
    if (!selectedKey && !value && controlName === "title") {
      errorControls?.push(control);
      control.setValueStateText(controlErrorText);
    } else if (!selectedKey && value) {
      errorControls?.push(control);
      control.setValueState(ValueState.Error);
      control.setValueStateText(controlErrorText);
    } else {
      errorControls?.forEach((errorControl, index) => {
        if (control.getId() === errorControl.getId()) {
          errorControls.splice(index, 1);
        }
      });
      control.setValueState(ValueState.None);
    }
  }

  /**
   * Handles the change event for card subtitle selection.
   * @param oEvent
   */
  function onSubTitleSelection(oEvent) {
    const getHeaderConfiguration = value => {
      const oModel = context.dialog.getModel();
      return {
        "sap.card": {
          header: {
            subTitle: getArrangements(value, {
              unitOfMeasures: oModel.getProperty("/configuration/advancedFormattingOptions/unitOfMeasures"),
              textArrangements: oModel.getProperty("/configuration/advancedFormattingOptions/textArrangements"),
              propertyValueFormatters: oModel.getProperty("/configuration/advancedFormattingOptions/propertyValueFormatters")
            })
          }
        }
      };
    };
    updateCardHeader(oEvent, getHeaderConfiguration);
  }

  /**
   * Handles the change event for card header UOM selection.
   * @param oEvent
   */
  function onHeaderUOMSelection(oEvent) {
    const getHeaderConfiguration = value => {
      const oModel = context.dialog.getModel();
      return {
        "sap.card": {
          header: {
            unitOfMeasurement: getArrangements(value, {
              unitOfMeasures: oModel.getProperty("/configuration/advancedFormattingOptions/unitOfMeasures"),
              textArrangements: oModel.getProperty("/configuration/advancedFormattingOptions/textArrangements"),
              propertyValueFormatters: oModel.getProperty("/configuration/advancedFormattingOptions/propertyValueFormatters")
            })
          }
        }
      };
    };
    updateCardHeader(oEvent, getHeaderConfiguration);
  }
  function addLabelsForProperties(selectedNavigationProperty, data) {
    if (selectedNavigationProperty.name && data[selectedNavigationProperty.name] !== undefined && data[selectedNavigationProperty.name] !== null) {
      const propVal = selectedNavigationProperty?.value;
      propVal?.forEach(ele => {
        const name = data[selectedNavigationProperty.name];
        if (name[ele.name] !== undefined && name[ele.name] !== null) {
          const propertyValue = name[ele.name];
          const value = formatPropertyDropdownValues(ele, propertyValue);
          ele.labelWithValue = value;
        } else {
          ele.labelWithValue = `${ele.label} (<empty>)`;
        }
      });
    } else {
      selectedNavigationProperty.value = [];
    }
  }
  function updateHeaderNavigationSelection(oEvent) {
    const oModel = context.dialog.getModel();
    const getHeaderConfiguration = value => ({
      "sap.card": {
        header: {
          mainIndicator: {
            number: getArrangements(value, {
              unitOfMeasures: oModel.getProperty("/configuration/advancedFormattingOptions/unitOfMeasures"),
              textArrangements: oModel.getProperty("/configuration/advancedFormattingOptions/textArrangements"),
              propertyValueFormatters: oModel.getProperty("/configuration/advancedFormattingOptions/propertyValueFormatters")
            })
          }
        }
      }
    });
    const control = oEvent.getSource();
    const selectedKey = control.getSelectedKey();
    const sourceProperty = oModel.getProperty("/configuration/mainIndicatorStatusKey");
    updateSelectedNavigation(selectedKey, sourceProperty, oModel, "header");
    oModel.setProperty("/configuration/navigationValue", `${sourceProperty}/${selectedKey}`);
    oModel.setProperty("/configuration/mainIndicatorNavigationSelectedKey", selectedKey);
    updateCardHeader(oEvent, getHeaderConfiguration, "navSelection");
  }
  function disableOrEnableUOMAndTrend(model, selectedProperty) {
    let typeSupported = true;
    const propertyType = model.getProperty("/configuration/properties").find(prop => prop.name === selectedProperty)?.type;
    const selectedValue = model.getProperty("/configuration/$data")[selectedProperty];
    if (propertyType === "Edm.String") {
      typeSupported = !isNaN(Number(selectedValue));
    }
    const isDateType = ODataUtils.isPropertyTypeDate(propertyType);
    const isUoMEnabled = !(propertyType === "Edm.Boolean" || propertyType === "Edm.Guid" || isDateType) && typeSupported;
    const isNumberType = ["Edm.Decimal", "Edm.Int16", "Edm.Int32", "Edm.Double"].indexOf(propertyType) > -1;
    model.setProperty("/configuration/advancedFormattingOptions/isUoMEnabled", isUoMEnabled);
    model.setProperty("/configuration/advancedFormattingOptions/isTrendEnabled", isNumberType);
  }
  function updateContentNavigationSelection(oEvent) {
    const control = oEvent.getSource();
    const selectedKey = control.getSelectedKey() || "";
    const oModel = context.dialog.getModel();
    const sPath = control?.getBindingContext()?.getPath();
    const group = oModel.getProperty(sPath);
    const currentValue = `{${group.name}/${selectedKey}}`;
    group.value = selectedKey && getArrangements(currentValue, {
      unitOfMeasures: oModel.getProperty("/configuration/advancedFormattingOptions/unitOfMeasures"),
      textArrangements: oModel.getProperty("/configuration/advancedFormattingOptions/textArrangements"),
      propertyValueFormatters: oModel.getProperty("/configuration/advancedFormattingOptions/propertyValueFormatters")
    });
    updateSelectedNavigation(selectedKey, group.name, oModel, "content");
    const navProperty = ODataUtils.getPropertyLabel(context.appModel, context.entitySet, group.name, PropertyInfoType.NavigationProperty);
    const property = navProperty?.properties?.find(oProperty => oProperty.name === selectedKey);
    const propertyLabel = property ? property.label : "";
    group.label = propertyLabel;
    oModel.refresh();
    updateCardGroups(oModel);
    transpileIntegrationCardToAdaptive(context.dialog.getModel());
  }
  function updateSelectedNavigation(selectedKey, sourceProperty, oModel, source) {
    const selectedNavigation = source === "header" ? oModel.getProperty("/configuration/selectedHeaderNavigation") : oModel.getProperty("/configuration/selectedContentNavigation");
    const existingIndex = selectedNavigation.findIndex(navItem => navItem.name === sourceProperty);
    if (existingIndex !== -1) {
      const existingItem = selectedNavigation[existingIndex];
      const navValues = existingItem?.value?.includes(selectedKey) ? existingItem.value : [...existingItem.value, selectedKey];
      selectedNavigation[existingIndex] = {
        ...existingItem,
        value: navValues
      };
    } else {
      const name = sourceProperty;
      selectedNavigation.push({
        name,
        value: [selectedKey]
      });
    }
    const propertyPath = source === "header" ? "/configuration/selectedHeaderNavigation" : "/configuration/selectedContentNavigation";
    oModel.setProperty(propertyPath, selectedNavigation);
  }
  function getTranslatedText(sKey) {
    return context.dialog.getModel("i18n").getObject(sKey);
  }
  function onAddClick(oEvent) {
    const oModel = context.dialog.getModel();
    const sPath = oEvent.getSource().getBindingContext().getPath();
    const group = oModel.getProperty(sPath);
    if (!group.items) {
      group.items = [];
    }
    const nextItemNumber = oModel.getProperty(sPath).items.length;
    const newItem = {
      label: null,
      value: `{/items/${nextItemNumber}}`,
      isEnabled: false,
      isNavigationEnabled: false,
      navigationalProperties: []
    };
    oModel.getProperty(sPath).items.push(newItem);
    const iItemsAdded = oModel.getProperty(sPath).items.length;
    oModel.setProperty(sPath + "/enableAddMoreGroupItems", true);
    if (iItemsAdded === MAX_GROUP_ITEMS) {
      oModel.setProperty(sPath + "/enableAddMoreGroupItems", false);
    }
    oModel.refresh();
  }
  function validateHeader() {
    let hasError = false;
    const oModel = context.dialog.getModel();
    const errorControls = oModel.getProperty("/configuration/errorControls");
    errorControls?.forEach(ele => {
      if (!ele.getValue() || ele.getValueState() == "Error") {
        ele.setValueState(ValueState.Error);
        hasError = true;
      }
    });
    return hasError;
  }
  function validateIndicatorsValues(buttonId) {
    const oModel = context.dialog.getModel();
    const indicatorsValue = oModel.getProperty("/configuration/indicatorsValue");
    let hasError = false;
    const {
      targetValue,
      deviationValue,
      targetUnit,
      deviationUnit
    } = indicatorsValue;
    if (!targetValue) {
      oModel.setProperty("/configuration/indicatorsValue/targetValueState", "Error");
      const targetInputId = buttonId + "--targetInputValue";
      setValueStateTextForControl(targetInputId, getTranslatedText("TARGET_VALUE_ERR_MSG"));
    }
    if (!deviationValue) {
      oModel.setProperty("/configuration/indicatorsValue/deviationValueState", "Error");
      const deviationInputId = buttonId + "--deviationInputValue";
      setValueStateTextForControl(deviationInputId, getTranslatedText("DEVIATION_VALUE_ERR_MSG"));
    }
    if (!targetUnit) {
      oModel.setProperty("/configuration/indicatorsValue/targetUnitValueState", "Error");
      const targetUnitInputId = buttonId + "--targetUnitInput";
      setValueStateTextForControl(targetUnitInputId, getTranslatedText("TARGET_UNIT_ERR_MSG"), true);
    }
    if (!deviationUnit) {
      oModel.setProperty("/configuration/indicatorsValue/deviationUnitValueState", "Error");
      const deviationUnitInputId = buttonId + "--deviationUnitInput";
      setValueStateTextForControl(deviationUnitInputId, getTranslatedText("DEVIATION_UNIT_ERR_MSG"), true);
    }
    if (!targetValue || !deviationValue || !targetUnit || !deviationUnit) {
      hasError = true;
    }
    return hasError;
  }
  function validateTrendValues(buttonId) {
    const oModel = context.dialog.getModel();
    const trendValues = oModel.getProperty("/configuration/trendOptions");
    let hasError = false;
    const {
      referenceValue,
      downDifference,
      upDifference
    } = trendValues;
    if (!referenceValue) {
      oModel.setProperty("/configuration/trendOptions/referenceValueState", "Error");
      const referenceInputId = buttonId + "--trendReferenceValueInput";
      setValueStateTextForControl(referenceInputId, getTranslatedText("REF_ERR_MSG"));
    }
    if (!downDifference) {
      oModel.setProperty("/configuration/trendOptions/downDifferenceValueState", "Error");
      const trendDownDifferenceInputId = buttonId + "--trendDownDifferenceInput";
      setValueStateTextForControl(trendDownDifferenceInputId, getTranslatedText("LOW_RANGE_ERR_MSG"));
    }
    if (!upDifference) {
      oModel.setProperty("/configuration/trendOptions/upDifferenceValueState", "Error");
      const trendUpDifferenceInputId = buttonId + "--trendUpDifferenceInput";
      setValueStateTextForControl(trendUpDifferenceInputId, getTranslatedText("HIGH_RANGE_ERR_MSG"));
    }
    if (!referenceValue || !downDifference || !upDifference) {
      hasError = true;
    }
    return hasError;
  }
  function setValueStateTextForControl(controlId, errorMessage, isSelectControl) {
    const elementControl = CoreElement?.getElementById(controlId);
    elementControl.key = errorMessage;
    const validateControl = isSelectControl ? !elementControl?.getSelectedKey() || elementControl.getValueState() == "Error" : !elementControl?.getValue() || elementControl.getValueState() == "Error";
    if (validateControl) {
      const resourceBundle = context?.dialog?.getModel("i18n").getResourceBundle();
      const validationText = resourceBundle?.getText("GENERIC_ERR_MSG", [elementControl?.key]);
      elementControl?.setValueStateText(validationText);
    }
  }
  function onGroupAddClick(oEvent) {
    //on click of Add new group.
    const oModel = context.dialog.getModel();
    const iLength = oModel.getProperty("/configuration/groups").length;
    const currentDefaultValue = context?.dialog.getModel("i18n")?.getResourceBundle()?.getText("GENERATOR_DEFAULT_GROUP_NAME", [iLength + 1]);
    oModel.getProperty("/configuration/groups").push({
      title: currentDefaultValue,
      items: [{
        label: null,
        value: "{/items/0}",
        isEnabled: false,
        isNavigationEnabled: false,
        navigationalProperties: []
      }],
      newItem: {
        label: null,
        value: null,
        isEnabled: false,
        isNavigationEnabled: false,
        navigationalProperties: []
      }
    });
    const groupLength = oModel.getProperty("/configuration/groups").length;
    if (groupLength === MAX_GROUPS) {
      oModel.setProperty("/configuration/groupLimitReached", true);
    }
    oModel.refresh();
    updateCardGroups(oModel);
    transpileIntegrationCardToAdaptive(context.dialog.getModel());
  }
  function onGroupDeleteClick(oEvent) {
    const oModel = context.dialog.getModel();
    const sPath = oEvent.getSource().getBindingContext().getPath();
    const groupIndex = sPath.split("/configuration/groups/")[1];
    oModel.getProperty("/configuration/groups").splice(groupIndex, 1);
    const groupLength = oModel.getProperty("/configuration/groups").length;
    if (groupLength < MAX_GROUPS) {
      oModel.setProperty("/configuration/groupLimitReached", false);
    }
    delete context._itemActionsMenu;
    oModel.refresh();
    updateCardGroups(oModel);
    transpileIntegrationCardToAdaptive(context.dialog.getModel());
  }
  function onGroupTitleChange(oEvent) {
    const currentValue = oEvent.getParameters().newValue;
    const oModel = context.dialog.getModel();
    const sPath = oEvent.getSource().getBindingContext().getPath();
    const group = oModel.getProperty(sPath);
    group.title = currentValue;
    oModel.refresh();
    updateCardGroups(oModel);
    transpileIntegrationCardToAdaptive(context.dialog.getModel());
  }
  function onDeleteClick(oEvent) {
    const oModel = context.dialog.getModel();
    const sPath = oEvent.getSource().getBindingContext().getPath();
    const [groupIndex, itemIndex] = sPath.match(/(\d+)/g).map(function (sValue) {
      return Number(sValue);
    });
    oModel.getProperty("/configuration/groups/" + groupIndex).items.splice(itemIndex, 1);
    const iLength = oModel.getProperty("/configuration/groups/" + groupIndex).items.length;
    if (iLength < MAX_GROUP_ITEMS) {
      oModel.setProperty("/configuration/groups/" + groupIndex + "/enableAddMoreGroupItems", true);
    }
    context._itemActionsMenu?.destroy();
    delete context._itemActionsMenu;
    oModel.refresh();
    updateCardGroups(oModel);
    transpileIntegrationCardToAdaptive(context.dialog.getModel());
  }

  /**
   * Updates the sap.card.header.mainIndicator.trend property of the integration card manifest and triggers rendering of the card preview.
   */
  function updateTrendForCardHeader() {
    const oModel = context.dialog.getModel();
    let trendOptions = oModel.getProperty("/configuration/trendOptions");
    const selectedTrendOptions = oModel.getProperty("/configuration/selectedTrendOptions");
    const sapCardHeader = {
      "sap.card": {
        header: {
          mainIndicator: {
            trend: "None"
          }
        }
      }
    };
    let selectedTrendOptionIndex = -1;
    selectedTrendOptions?.forEach((selectedTrendOption, index) => {
      if (selectedTrendOption.sourceProperty === trendOptions.sourceProperty) {
        selectedTrendOptionIndex = index;
        trendOptions = {
          ...selectedTrendOption,
          ...trendOptions
        };
        oModel.setProperty("/configuration/trendOptions", trendOptions);
      }
    });
    const {
      referenceValue,
      downDifference,
      upDifference,
      sourceProperty
    } = trendOptions;
    if (referenceValue && downDifference && upDifference && sourceProperty) {
      const newTrendValues = {
        referenceValue,
        downDifference,
        upDifference,
        sourceProperty
      };
      if (selectedTrendOptionIndex !== -1) {
        selectedTrendOptions[selectedTrendOptionIndex] = newTrendValues;
      } else {
        selectedTrendOptions.push(newTrendValues);
      }
      const staticValues = {
        referenceValue: Number(referenceValue),
        downDifference: Number(downDifference),
        upDifference: Number(upDifference)
      };
      sapCardHeader["sap.card"]["header"]["mainIndicator"]["trend"] = getTrendDirection(staticValues);
    }
    const currentManifest = getCurrentCardManifest();
    const oManifest = merge(currentManifest, sapCardHeader);
    renderCardPreview(oManifest, context.dialog.getModel());
    transpileIntegrationCardToAdaptive(context.dialog.getModel());
  }

  /**
   * Updates the sap.card.header.sideIndicators property of the integration card manifest and triggers rendering of the card preview.
   */
  function updateSideIndicatorsForHeader() {
    const oModel = context.dialog.getModel();
    let indicatorsValue = oModel.getProperty("/configuration/indicatorsValue");
    const selectedIndicatorOptions = oModel.getProperty("/configuration/selectedIndicatorOptions");
    let selectedIndicatorOptionIndex = -1;
    selectedIndicatorOptions?.forEach((selectedIndicatorOption, index) => {
      if (selectedIndicatorOption.sourceProperty === indicatorsValue.sourceProperty) {
        selectedIndicatorOptionIndex = index;
        indicatorsValue = {
          ...selectedIndicatorOption,
          ...indicatorsValue
        };
        oModel.setProperty("/configuration/indicatorsValue", indicatorsValue);
      }
    });
    let sapCardHeader = {
      "sap.card": {
        header: {
          sideIndicators: [{
            title: "",
            number: "",
            unit: ""
          }, {
            title: "",
            number: "",
            unit: ""
          }]
        }
      }
    };
    const {
      targetValue,
      deviationValue,
      targetUnit,
      deviationUnit,
      sourceProperty
    } = indicatorsValue;
    if (targetValue && deviationValue && targetUnit && deviationUnit && sourceProperty) {
      const indicatorsValueToAdd = {
        targetValue,
        deviationValue,
        targetUnit,
        deviationUnit,
        sourceProperty
      };
      if (selectedIndicatorOptionIndex !== -1) {
        selectedIndicatorOptions[selectedIndicatorOptionIndex] = indicatorsValueToAdd;
      } else {
        selectedIndicatorOptions.push(indicatorsValueToAdd);
      }
      oModel.setProperty("/configuration/indicatorsValue/targetDeviation", targetValue);
      sapCardHeader = {
        "sap.card": {
          header: {
            sideIndicators: [{
              title: "Target",
              number: targetValue,
              unit: targetUnit
            }, {
              title: "Deviation",
              number: deviationValue,
              unit: deviationUnit
            }]
          }
        }
      };
    }
    const currentManifest = getCurrentCardManifest();
    const oManifest = merge(currentManifest, sapCardHeader);
    renderCardPreview(oManifest, context.dialog.getModel());
    oModel.refresh();
    transpileIntegrationCardToAdaptive(context.dialog.getModel());
  }

  /**
   * Get trend direction based on the static values.
   * @param staticValues
   * @returns
   */
  function getTrendDirection(staticValues) {
    const oModel = context.dialog.getModel();
    const mainIndicatorKey = oModel.getProperty("/configuration/mainIndicatorStatusKey");
    const trendValues = oModel.getProperty("/configuration/trendOptions");
    const {
      referenceValue
    } = trendValues;
    if (mainIndicatorKey && staticValues) {
      oModel.setProperty("/configuration/trendOptions/upDown", referenceValue);
      return "{= extension.formatters.formatTrendIcon(${" + mainIndicatorKey + "}," + JSON.stringify(staticValues) + ") }";
    }
    return "None";
  }
  function onPropertyLabelChange(oEvent) {
    const currentValue = oEvent.getParameters().newValue;
    const oModel = context.dialog.getModel();
    const sPath = oEvent.getSource().getBindingContext().getPath();
    const group = oModel.getProperty(sPath);
    group.label = currentValue;
    oModel.refresh();
    updateCardGroups(oModel);
    transpileIntegrationCardToAdaptive(context.dialog.getModel());
  }
  function onDrop(oEvent) {
    const oDragged = oEvent.getParameter("draggedControl"),
      oDropped = oEvent.getParameter("droppedControl"),
      sInsertPosition = oEvent.getParameter("dropPosition"),
      oModel = context.dialog.getModel(),
      oDragPos = oDragged.getParent(),
      oDropPos = oDropped.getParent(),
      sDraggedPath = oDragPos.getBindingContext().getPath(),
      sDroppedPath = oDropPos.getBindingContext().getPath(),
      aDragItems = oModel.getProperty(sDraggedPath).items,
      aDropItems = oModel.getProperty(sDroppedPath).items,
      iDragPosition = oDragPos.indexOfItem(oDragged),
      iDropPosition = oDropPos.indexOfItem(oDropped);
    const oSelectedItem = aDragItems[iDragPosition];
    // insert the control in target aggregation, remove the item
    if (sInsertPosition === "Before" && aDropItems.length < MAX_GROUP_ITEMS) {
      aDragItems.splice(iDragPosition, 1);
      aDropItems.splice(iDropPosition, 0, oSelectedItem);
    } else if (sInsertPosition && aDropItems.length < MAX_GROUP_ITEMS) {
      aDragItems.splice(iDragPosition, 1);
      aDropItems.splice(iDropPosition + 1, 0, oSelectedItem);
    }
    if (aDragItems.length < MAX_GROUP_ITEMS) {
      oModel.setProperty(sDraggedPath + "/enableAddMoreGroupItems", true);
    }
    if (aDropItems.length === MAX_GROUP_ITEMS) {
      oModel.setProperty(sDroppedPath + "/enableAddMoreGroupItems", false);
    }
    oModel.refresh();
    updateCardGroups(oModel);
    transpileIntegrationCardToAdaptive(context.dialog.getModel());
  }
  function onResetPressed() {
    const oCard = CoreElement.getElementById("cardGeneratorDialog--cardPreview");
    oCard.setWidth();
    oCard.setHeight();
    CoreElement.getElementById("cardGeneratorDialog--widthInput").setValue("");
    CoreElement.getElementById("cardGeneratorDialog--heightInput").setValue("");
    oCard.refresh();
  }
  function onHeightChange(oEvent) {
    const oCard = CoreElement.getElementById("cardGeneratorDialog--cardPreview");
    const currentValue = Number(oEvent.getParameters().newValue);
    currentValue > 200 ? oCard.setHeight(currentValue + "px") : oCard.setHeight("232px");
    oCard.refresh();
  }
  function onWidthChange(oEvent) {
    const oCard = CoreElement.getElementById("cardGeneratorDialog--cardPreview");
    const currentValue = Number(oEvent.getParameters().newValue);
    currentValue > 200 ? oCard.setWidth(currentValue + "px") : oCard.setWidth("582px");
    oCard.refresh();
  }
  function closeDialog() {
    const oModel = context?.dialog?.getModel();
    const errorControls = oModel.getProperty("/configuration/errorControls");
    errorControls?.forEach(ele => {
      ele.setValueState(ValueState.None);
    });
    context?.dialog?.close();
  }
  function setCriticalitySourceProperty(sProperty) {
    const oModel = context?.dialog?.getModel();
    const mainIndicatorCriticality = oModel?.getProperty("/configuration/mainIndicatorOptions/criticality");
    let relavantCriticality;
    const relavantProperty = mainIndicatorCriticality?.filter(indicatorCriticality => {
      return indicatorCriticality?.name === sProperty;
    });
    if (relavantProperty) {
      relavantCriticality = JSON.parse(JSON.stringify(relavantProperty));
    }
    if (relavantProperty?.length === 1) {
      relavantCriticality[0].hostCriticality = relavantProperty[0].criticality;
      delete relavantCriticality.criticality;
      oModel?.setProperty("/configuration/advancedFormattingOptions/sourceCriticalityProperty", relavantCriticality);
    } else {
      oModel?.setProperty("/configuration/advancedFormattingOptions/sourceCriticalityProperty", [{
        name: sProperty
      }]);
    }
  }
  function onPropertyFormatting(oEvent) {
    const oSource = oEvent.getSource();
    const sProperty = context.dialog.getModel().getProperty("/configuration/mainIndicatorStatusKey");
    const oModel = context?.dialog?.getModel();
    oModel?.setProperty("/configuration/advancedFormattingOptions/targetFormatterProperty", sProperty);
    oModel?.setProperty("/configuration/advancedFormattingOptions/sourceUoMProperty", sProperty);
    disableOrEnableUOMAndTrend(oModel, sProperty);
    setCriticalitySourceProperty(sProperty);
    setAdvancedFormattingOptionsEnablement(sProperty);
    if (!context._advancedFormattingOptionsPopover) {
      Fragment.load({
        id: "advancedFormattingOptions",
        name: "sap.cards.ap.generator.app.fragments.configuration.AdvancedFormattingOptions",
        controller: {
          onFormatTypeSelection: oEvent => {
            const sourceItem = oEvent.getParameter("item");
            const oModel = context.dialog.getModel();
            const key = sourceItem.getKey();
            oModel.setProperty("/configuration/popoverContentType", key);
            const aUom = oModel.getProperty("/configuration/advancedFormattingOptions/unitOfMeasures");
            const sSourceUoMProperty = oModel.getProperty("/configuration/advancedFormattingOptions/sourceUoMProperty");
            if (aUom.length > 0) {
              const aSourceUom = aUom.filter(oProperty => {
                return oProperty.name === sSourceUoMProperty;
              })[0];
              if (aSourceUom) {
                oModel.setProperty("/configuration/advancedFormattingOptions/targetProperty", aSourceUom.value);
              }
            }
            if (aPropsWithUoM.indexOf(sSourceUoMProperty) === -1) {
              oModel.setProperty("/configuration/advancedFormattingOptions/targetProperty", "");
            }
            onAdvancedFormattingConfigOpen(oEvent, oSource);
          }
        }
      }).then(function (oPopover) {
        context._advancedFormattingOptionsPopover = oPopover;
        oSource.addDependent(oPopover);
        return oPopover;
      }).then(function (oPopover) {
        const oContext = oSource.getBindingContext();
        oPopover.setBindingContext(oContext);
        oPopover.openBy(oSource);
      });
    } else {
      const oContext = oSource.getBindingContext();
      context._advancedFormattingOptionsPopover.setBindingContext(oContext);
      context._advancedFormattingOptionsPopover.openBy(oSource);
    }
  }
  function onAdvancedFormattingConfigOpen(oEvent, oSource) {
    const oModel = context?.dialog?.getModel();
    const oConfigurationController = {
      onPopoverClose: oEvent => {
        const source = oEvent.getSource();
        source?.destroy();
      },
      // applyCriticalityFormattingForHeader: () => { },
      onPropertyFormatterChange: () => {
        updateArrangements();
        const buttonId = oSource?.getId();
        const oPopover = CoreElement.getElementById(buttonId + "--advanceFormattingPopover");
        oPopover?.close();
      },
      applyCriticality: () => applyCriticality(oEvent),
      applyUoMFormatting: () => applyUoMFormatting(),
      applyFormatting: () => {
        const buttonId = oSource?.getId();
        CoreElement.getElementById(buttonId + "--headerFormatterEditor").applyFormatter();
        transpileIntegrationCardToAdaptive(context.dialog.getModel());
      },
      resetValueState(oEvent, isSelectControl) {
        const control = oEvent.getSource();
        const currentValue = !isSelectControl ? oEvent.getParameters().newValue : control.getSelectedKey();
        if (currentValue !== "") {
          control.setValueState(ValueState.None);
        }
      },
      onDownDifferenceChange(oEvent) {
        oModel.setProperty("/configuration/trendOptions/downDifferenceValueState", "None");
        this.resetValueState(oEvent);
      },
      onUpDifferenceChange(oEvent) {
        oModel.setProperty("/configuration/trendOptions/upDifferenceValueState", "None");
        this.resetValueState(oEvent);
      },
      onReferenceValInputChange(oEvent) {
        oModel.setProperty("/configuration/trendOptions/referenceValueState", "None");
        this.resetValueState(oEvent);
      },
      onTargetValueChange(oEvent) {
        oModel.setProperty("/configuration/indicatorsValue/targetValueState", "None");
        this.resetValueState(oEvent);
      },
      onDeviationValueChange(oEvent) {
        oModel.setProperty("/configuration/indicatorsValue/deviationValueState", "None");
        this.resetValueState(oEvent);
      },
      onTargetUnitChange(oEvent) {
        oModel.setProperty("/configuration/indicatorsValue/targetUnitValueState", "None");
        this.resetValueState(oEvent, true);
      },
      onDeviationUnitChange(oEvent) {
        oModel.setProperty("/configuration/indicatorsValue/deviationUnitValueState", "None");
        this.resetValueState(oEvent, true);
      },
      applyIndicators: () => {
        const buttonId = oSource?.getId();
        const hasIndicatorsError = validateIndicatorsValues(buttonId);
        if (!hasIndicatorsError) {
          updateSideIndicatorsForHeader();
          context?._advancedFormattingConfigurationPopover?.close();
        }
      },
      applyTrendCalculation: () => {
        const buttonId = oSource?.getId();
        const hasTrendError = validateTrendValues(buttonId);
        if (!hasTrendError) {
          updateTrendForCardHeader();
          context?._advancedFormattingConfigurationPopover?.close();
        }
      },
      onDelete: () => {
        const oModel = context?.dialog?.getModel();
        const sourceUoMProperty = oModel?.getProperty("/configuration/advancedFormattingOptions/sourceUoMProperty");
        const iIndex = aPropsWithUoM?.indexOf(sourceUoMProperty);
        aPropsWithUoM?.splice(iIndex, 1);
        oModel?.setProperty("/configuration/advancedFormattingOptions/targetProperty", "");
        const itemsBindingPath = "/configuration/advancedFormattingOptions/unitOfMeasures",
          unitOfMeasures = oModel?.getProperty(itemsBindingPath);
        let relativeIndex = -1;
        const propertyValueFormatters = oModel.getProperty("/configuration/advancedFormattingOptions/propertyValueFormatters");
        const updatedPropertyValueFormatters = propertyValueFormatters.filter(formatter => formatter.property !== sourceUoMProperty);
        oModel.setProperty("/configuration/advancedFormattingOptions/propertyValueFormatters", updatedPropertyValueFormatters);
        for (let i = 0; i < unitOfMeasures.length; i++) {
          if (unitOfMeasures[i]?.name === sourceUoMProperty) {
            relativeIndex = i;
          }
        }
        if (relativeIndex >= 0 && itemsBindingPath) {
          const sPath = itemsBindingPath + "/" + relativeIndex;
          unitOfMeasures?.splice(sPath.slice(sPath.length - 1), 1);
          updateArrangements();
          oModel?.refresh();
        }
        context?._advancedFormattingConfigurationPopover?.close();
      },
      onTrendDelete: () => onTrendDelete(),
      onIndicatorsDelete: () => {
        const oModel = context?.dialog?.getModel();
        const indicatorsValue = oModel.getProperty("/configuration/indicatorsValue");
        const selectedIndicatorValues = oModel.getProperty("/configuration/selectedIndicatorOptions");
        let iIndex = -1;
        selectedIndicatorValues?.forEach((trend, index) => {
          if (trend.sourceProperty === indicatorsValue.sourceProperty) {
            iIndex = index;
          }
        });
        if (iIndex !== -1) {
          selectedIndicatorValues.splice(iIndex, 1);
        }
        oModel.setProperty("/configuration/indicatorsValue", {});
        updateSideIndicatorsForHeader();
        context?._advancedFormattingConfigurationPopover?.close();
      },
      onDeleteFormatter: () => {
        const buttonId = oSource?.getId();
        CoreElement.getElementById(buttonId + "--headerFormatterEditor").deleteFormatter();
        transpileIntegrationCardToAdaptive(context.dialog.getModel());
      },
      onDeleteCriticality: () => {
        const oModel = context.dialog.getModel();
        const buttonId = oSource?.getId();
        CoreElement.getElementById(buttonId + "--headerCriticalityEditor")._onDeleteButtonClicked();
        oModel.setProperty("/configuration/advancedFormattingOptions/selectedKeyCriticality", "");
        updateCriticality(false);
        context?._advancedFormattingConfigurationPopover?.close();
      }
    };
    if (oEvent?.getParameter("item")?.getKey?.() === "uom") {
      oConfigurationController.applyUoMFormatting();
    }
    if (oEvent.getSource()?.getParent()?.close) {
      oEvent.getSource().getParent().close();
    }
    loadAdvancedFormattingConfigurationFragment(oSource, oConfigurationController);
  }
  function applyCriticality(oEvent) {
    const oModel = context?.dialog?.getModel();
    const mainIndicatorCriticality = oModel?.getProperty("/configuration/mainIndicatorOptions/criticality");
    let sourceCriticalityProperty = oModel?.getProperty("/configuration/advancedFormattingOptions/sourceCriticalityProperty");
    sourceCriticalityProperty = sourceCriticalityProperty?.[0];
    if (sourceCriticalityProperty?.hostCriticality !== sourceCriticalityProperty?.criticality) {
      sourceCriticalityProperty.criticality = sourceCriticalityProperty.hostCriticality;
    }
    const propertyExists = mainIndicatorCriticality?.some(indicatorCriticality => {
      return indicatorCriticality?.name === sourceCriticalityProperty?.name;
    });
    if (!propertyExists && sourceCriticalityProperty) {
      delete sourceCriticalityProperty.hostCriticality;
      mainIndicatorCriticality?.push(sourceCriticalityProperty);
    } else {
      for (let i = 0; i < mainIndicatorCriticality.length; i++) {
        if (mainIndicatorCriticality[i]?.name === sourceCriticalityProperty?.name) {
          delete mainIndicatorCriticality[i];
          delete sourceCriticalityProperty.hostCriticality;
          mainIndicatorCriticality[i] = sourceCriticalityProperty;
        }
      }
    }
    oModel?.setProperty("/configuration/mainIndicatorOptions/criticality", mainIndicatorCriticality);
    updateCriticality(oEvent.getParameter("isCalcuationType") || false);
    context?._advancedFormattingConfigurationPopover?.close();
  }
  function applyUoMFormatting() {
    const oModel = context?.dialog?.getModel();
    const unitOfMeasures = oModel?.getProperty("/configuration/advancedFormattingOptions/unitOfMeasures"),
      sourceProperty = oModel.getProperty("/configuration/advancedFormattingOptions/sourceUoMProperty");
    let relavantProperty = unitOfMeasures?.filter(property => property?.name === sourceProperty),
      targetProperty = oModel?.getProperty("/configuration/advancedFormattingOptions/targetProperty");
    relavantProperty = relavantProperty?.[0];
    if (!targetProperty && relavantProperty) {
      oModel?.setProperty("/configuration/advancedFormattingOptions/targetProperty", relavantProperty?.propertyKeyForDescription);
    }
    targetProperty = oModel?.getProperty("/configuration/advancedFormattingOptions/targetProperty");
    const oData = {
      propertyKeyForDescription: targetProperty,
      name: sourceProperty,
      propertyKeyForId: sourceProperty,
      value: targetProperty
    };
    let bMatchingProperty = false;
    unitOfMeasures.forEach(oUom => {
      if (oUom.name === oData.name) {
        bMatchingProperty = true;
        oUom.propertyKeyForDescription = oData.value;
        oUom.value = oData.value;
      }
    });
    if (!bMatchingProperty && sourceProperty && targetProperty) {
      unitOfMeasures.push(oData);
    }
    oModel.setProperty("/configuration/advancedFormattingOptions/unitOfMeasures", unitOfMeasures);
    updateArrangements();
    for (let i = 0; i < unitOfMeasures.length; i++) {
      if (unitOfMeasures[i].value !== "" && aPropsWithUoM?.indexOf(unitOfMeasures[i]?.name) === -1) {
        aPropsWithUoM?.push(unitOfMeasures[i]?.name);
      }
    }
    context?._advancedFormattingConfigurationPopover?.close();
  }
  function onTrendDelete() {
    const oModel = context?.dialog?.getModel();
    const trendValues = oModel.getProperty("/configuration/trendOptions");
    const selectedTrendValues = oModel.getProperty("/configuration/selectedTrendOptions");
    let iIndex = -1;
    selectedTrendValues?.forEach((trend, index) => {
      if (trend.sourceProperty === trendValues.sourceProperty) {
        iIndex = index;
      }
    });
    if (iIndex !== -1) {
      selectedTrendValues.splice(iIndex, 1);
    }
    oModel.setProperty("/configuration/trendOptions", {});
    updateTrendForCardHeader();
    context?._advancedFormattingConfigurationPopover?.close();
  }
  function loadAdvancedFormattingConfigurationFragment(oSource, oConfigurationController) {
    Fragment.load({
      id: oSource.getId(),
      name: "sap.cards.ap.generator.app.fragments.configuration.AdvancedFormattingConfiguration",
      controller: oConfigurationController
    }).then(function (oPopover) {
      context._advancedFormattingConfigurationPopover = oPopover;
      const model = context.dialog.getModel();
      const mainIndicatorUnitText = model.getProperty("/configuration/mainIndicatorStatusUnit");
      const oResourceBundle = context.dialog.getModel("i18n").getResourceBundle();
      let sUomText, sFormatterText, criticalityText;
      if (oSource.getBindingContext()) {
        const sSelectedGroupItemPath = oSource.getBindingContext().sPath;
        const sSelectedGroupProperty = model.getProperty(sSelectedGroupItemPath)?.label;
        const sProperties = model.getProperty("/configuration/properties");
        const propertyLabelWithValue = sProperties?.filter(property => {
          return property.label === sSelectedGroupProperty;
        })[0].labelWithValue || sSelectedGroupProperty;
        sUomText = oResourceBundle.getText("SELECT_UOM_TEXT", [propertyLabelWithValue]);
        sFormatterText = oResourceBundle.getText("SELECT_FORMATTER_TEXT", [propertyLabelWithValue]);
        criticalityText = oResourceBundle.getText("SELECT_CRITICALITY_TEXT", [propertyLabelWithValue]);
      } else {
        sUomText = oResourceBundle.getText("SELECT_UOM_TEXT", [mainIndicatorUnitText]);
        sFormatterText = oResourceBundle.getText("SELECT_FORMATTER_TEXT", [mainIndicatorUnitText]);
        criticalityText = oResourceBundle.getText("SELECT_CRITICALITY_TEXT", [mainIndicatorUnitText]);
      }
      const sIndicatorsText = oResourceBundle.getText("SELECT_INDICATORS_TEXT", [mainIndicatorUnitText]);
      const sTrendCalculatorText = oResourceBundle.getText("TREND_CALCULATION_TEXT", [mainIndicatorUnitText]);
      const mLabels = {
        uomText: sUomText,
        criticalityText: criticalityText,
        formatterText: sFormatterText,
        indicatorsText: sIndicatorsText,
        trendCalculatorText: sTrendCalculatorText
      };
      oPopover.setModel(new JSONModel(mLabels), "i18nLabelText");
      oSource.addDependent(oPopover);
      return oPopover;
    }).then(function (oPopover) {
      const oContext = oSource.getBindingContext();
      oPopover.setBindingContext(oContext);
      oPopover.openBy(oSource);
      return oPopover;
    });
  }
  function onItemsActionsButtonPressed(oEvent) {
    const oModel = context?.dialog?.getModel();
    const sPath = oEvent?.getSource().getBindingContext().getPath();
    const sourceProperty = oModel?.getProperty(sPath)?.name;
    const oSource = oEvent.getSource();
    disableOrEnableUOMAndTrend(oModel, sourceProperty);
    setAdvancedFormattingOptionsEnablement(sourceProperty);
    const oController = {
      onNavigationActionSelect: oEvent => {
        const sId = oEvent.getParameter("item").getId();
        const oModel = context.dialog.getModel();
        if (sId === "formatter" || sId === "uom") {
          oModel.setProperty("/configuration/popoverContentType", sId);
          const sPath = oEvent.getSource().getBindingContext().getPath();
          oModel.setProperty("/configuration/advancedFormattingOptions/targetFormatterProperty", oModel.getProperty(sPath).name);
          oModel.setProperty("/configuration/advancedFormattingOptions/sourceUoMProperty", oModel.getProperty(sPath).name);
          const aUom = oModel.getProperty("/configuration/advancedFormattingOptions/unitOfMeasures");
          const sSourceUoMProperty = oModel.getProperty("/configuration/advancedFormattingOptions/sourceUoMProperty");
          if (aUom.length > 0) {
            const aSourceUom = aUom.filter(oProperty => {
              return oProperty.name === sSourceUoMProperty;
            })[0];
            if (aSourceUom) {
              oModel.setProperty("/configuration/advancedFormattingOptions/targetProperty", aSourceUom.value);
            }
          }
          if (aPropsWithUoM.length && aPropsWithUoM.indexOf(sSourceUoMProperty) === -1) {
            oModel.setProperty("/configuration/advancedFormattingOptions/targetProperty", "");
          }
          onAdvancedFormattingConfigOpen(oEvent, oEvent.getSource().getParent());
        } else if (sId === "criticality") {
          oModel.setProperty("/configuration/popoverContentType", sId);
          const sPath = oEvent.getSource().getBindingContext().getPath();
          if (oModel.getProperty(sPath)?.name) {
            setCriticalitySourceProperty(oModel.getProperty(sPath).name);
          }
          onAdvancedFormattingConfigOpen(oEvent, oEvent.getSource().getParent());
        } else if (sId === "actions") {
          // do nothing
        } else {
          const sourceItem = oEvent.getParameter("item");
          const customData = sourceItem.getCustomData();
          const customAction = customData.filter(custom => custom.getKey() === "action")[0];
          const actionType = customAction.getValue();
          const source = oEvent.getSource();
          const sPath = source.getBindingContext().getPath();
          const [groupIndex, itemIndex] = sPath.match(/(\d+)/g).map(sValue => Number(sValue));
          const group = oModel.getProperty("/configuration/groups/" + groupIndex);
          const item = group.items[itemIndex];
          if (actionType === "add") {
            let value = "";
            const key = sourceItem.getId();
            switch (key) {
              case "url":
                value = `${item.value}`;
                break;
              case "email":
                value = `mailto: ${item.value}`;
                break;
              case "tel":
                value = `tel: ${item.value}`;
                break;
              default:
                break;
            }
            if (value === "") {
              return;
            }
            const actions = [{
              type: "Navigation",
              parameters: {
                url: value
              }
            }];
            item["hasActions"] = true;
            item["actionType"] = key;
            item["actions"] = actions;
          }
          if (actionType === "remove" && item.hasActions) {
            delete item.hasActions;
            delete item.actionType;
            delete item.actions;
          }
        }
        oModel.refresh();
        updateCardGroups(oModel);
        transpileIntegrationCardToAdaptive(context.dialog.getModel());
      }
    };
    if (!context._itemActionsMenu || context?._itemActionsMenu?.isDestroyed()) {
      Fragment.load({
        name: "sap.cards.ap.generator.app.fragments.configuration.ItemActions",
        controller: oController
      }).then(function (oMenu) {
        context._itemActionsMenu = oMenu;
        const oContext = oSource.getBindingContext();
        oMenu.setBindingContext(oContext);
        oSource.addDependent(oMenu);
        context._itemActionsMenu.open(false, oSource, Popup.Dock.BeginTop, Popup.Dock.BeginBottom, oSource);
      }.bind(oController));
    } else {
      const oContext = oSource.getBindingContext();
      context._itemActionsMenu.setBindingContext(oContext);
      oSource.addDependent(context._itemActionsMenu);
      context._itemActionsMenu.open(false, oSource, Popup.Dock.BeginTop, Popup.Dock.BeginBottom, oSource);
    }
  }
  function onPreviewTypeChange(oEvent) {
    const selectedCardType = oEvent.getSource().getSelectedItem().getBindingContext("previewOptions").getProperty("type");
    const oCard = CoreElement.getElementById("cardGeneratorDialog--cardPreview");
    const oAdaptiveCardContainer = CoreElement.getElementById("cardGeneratorDialog--adaptiveCardPreviewContainer");
    const oCustomSize = CoreElement.getElementById("cardGeneratorDialog--custom-entry");
    oCard.setVisible(false);
    oAdaptiveCardContainer.setVisible(false);
    oCustomSize.setVisible(false);
    switch (selectedCardType) {
      case "adaptive":
        oAdaptiveCardContainer.setVisible(true);
        setTimeout(() => {
          transpileIntegrationCardToAdaptive(context.dialog.getModel());
        }, 0);
        break;
      case "custom":
        oCard.setVisible(true);
        oCustomSize.setVisible(true);
        break;
      case "integration":
        oCard.setVisible(true);
        oCard.setWidth(oEvent.getSource().getSelectedItem().getBindingContext("previewOptions").getProperty("width"));
        oCard.setHeight(oEvent.getSource().getSelectedItem().getBindingContext("previewOptions").getProperty("height"));
        break;
      default:
        oCard.setVisible(true);
        oCard.setWidth(oEvent.getSource().getSelectedItem().getBindingContext("previewOptions").getProperty("width"));
        oCard.setHeight(oEvent.getSource().getSelectedItem().getBindingContext("previewOptions").getProperty("height"));
        break;
    }
  }

  /**
   * Update the sap.card.header of the integration card manifest by appling latest text arrangements, unit of measurement and formatters and triggers rendering of the card preview.
   * - This method is triggered when text arrrangement, unit of measurement or formatters are changed.
   */
  function updateHeaderArrangements() {
    const oModel = context.dialog.getModel();
    const currentManifest = getCurrentCardManifest();
    const header = currentManifest["sap.card"].header;
    const subtitle = resolvePropertyPathFromExpression(header.subTitle, currentManifest);
    const unitOfMeasurement = resolvePropertyPathFromExpression(header.unitOfMeasurement, currentManifest);
    const mainIndicatorValue = oModel.getProperty("/configuration/navigationValue") || oModel.getProperty("/configuration/mainIndicatorStatusKey");
    const aUnitOfMeasures = oModel.getProperty("/configuration/advancedFormattingOptions/unitOfMeasures");
    const aTextArrangements = oModel.getProperty("/configuration/advancedFormattingOptions/textArrangements");
    const aPropertyValueFormatters = oModel.getProperty("/configuration/advancedFormattingOptions/propertyValueFormatters");
    const sapCardHeader = {
      "sap.card": {
        header: {
          mainIndicator: {
            number: mainIndicatorValue && getArrangements(`{${mainIndicatorValue}}`, {
              unitOfMeasures: aUnitOfMeasures,
              textArrangements: aTextArrangements,
              propertyValueFormatters: aPropertyValueFormatters
            })
          },
          subTitle: getArrangements(subtitle, {
            unitOfMeasures: aUnitOfMeasures,
            textArrangements: aTextArrangements,
            propertyValueFormatters: aPropertyValueFormatters
          }),
          unitOfMeasurement: getArrangements(unitOfMeasurement, {
            unitOfMeasures: aUnitOfMeasures,
            textArrangements: aTextArrangements,
            propertyValueFormatters: aPropertyValueFormatters
          })
        }
      }
    };
    const oManifest = merge(currentManifest, sapCardHeader);
    renderCardPreview(oManifest, context.dialog.getModel());
  }
  function updateArrangements() {
    const oModel = context.dialog.getModel();
    updateHeaderArrangements();
    const groups = oModel.getProperty("/configuration/groups");
    groups?.forEach(function (group) {
      group?.items?.forEach(groupItem => {
        if (groupItem.name && groupItem.name !== "") {
          const groupItemValue = groupItem.isNavigationEnabled ? `${groupItem.name}/${groupItem.navigationProperty}` : groupItem.name;
          groupItem.value = getArrangements(`{${groupItemValue}}`, {
            unitOfMeasures: oModel.getProperty("/configuration/advancedFormattingOptions/unitOfMeasures"),
            textArrangements: oModel.getProperty("/configuration/advancedFormattingOptions/textArrangements"),
            propertyValueFormatters: oModel.getProperty("/configuration/advancedFormattingOptions/propertyValueFormatters")
          });
        }
      });
    });
    oModel.refresh();
    updateCardGroups(oModel);
    transpileIntegrationCardToAdaptive(context.dialog.getModel());
  }
  function updateCriticality(isCalcuationType) {
    const currentManifest = getCurrentCardManifest();
    const oModel = context.dialog.getModel();
    const mainIndicator = currentManifest["sap.card"].header.mainIndicator;
    const groups = currentManifest["sap.card"].content.groups;
    if (!mainIndicator && groups.length < 1) {
      return;
    }
    let oManifest;
    if (mainIndicator) {
      const mainIndicatorValue = resolvePropertyPathFromExpression(mainIndicator.number, currentManifest);
      const sapCardHeader = {
        "sap.card": {
          header: {
            mainIndicator: {
              state: getCriticality(mainIndicatorValue || mainIndicator.number, isCalcuationType)
            }
          }
        }
      };
      oManifest = merge(currentManifest, sapCardHeader);
    } else {
      oManifest = currentManifest;
    }
    renderCardPreview(oManifest, context.dialog.getModel());
    updateCardGroups(oModel);
    transpileIntegrationCardToAdaptive(context.dialog.getModel());
  }
  var __exports = {
    __esModule: true
  };
  __exports.CardGeneratorDialogController = CardGeneratorDialogController;
  __exports.getCriticality = getCriticality;
  return __exports;
});
//# sourceMappingURL=CardGeneratorDialogController-dbg-dbg.js.map
