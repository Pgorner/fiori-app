/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/cards/ap/common/services/RetrieveCard", "sap/ui/core/Lib", "sap/ui/model/json/JSONModel", "../odata/ODataUtils", "./ApplicationInfo", "./FooterActions", "./Formatter", "./IntegrationCardHelper", "./NavigationProperty", "./PropertyExpression"], function (sap_cards_ap_common_services_RetrieveCard, CoreLib, JSONModel, ___odata_ODataUtils, ___ApplicationInfo, ___FooterActions, ___Formatter, ___IntegrationCardHelper, ___NavigationProperty, ___PropertyExpression) {
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
  const getCardActionInfo = function (oAppComponent, data, resourceModel, mCardManifest) {
    try {
      function _temp2(_getDefaultAction) {
        return {
          annotationActions: cardActions,
          addedActions: _getDefaultAction,
          bODataV4: bODataV4,
          styles: getActionStyles(),
          isAddActionEnabled: true,
          actionExists: cardActions.length > 0
        };
      }
      const {
        odataModel,
        entitySet
      } = ApplicationInfo.getInstance().fetchDetails();
      const bODataV4 = odataModel === ODataModelVersion.V4;
      const cardActions = getCardActions(oAppComponent, entitySet, bODataV4);
      const _temp = cardActions.length > 0;
      return Promise.resolve(_temp ? Promise.resolve(getDefaultAction(resourceModel, data, mCardManifest)).then(_temp2) : _temp2([]));
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
  const getKeyParameters = sap_cards_ap_common_services_RetrieveCard["getKeyParameters"];
  const createPathWithEntityContext = ___odata_ODataUtils["createPathWithEntityContext"];
  const fetchDataAsync = ___odata_ODataUtils["fetchDataAsync"];
  const getLabelForEntitySet = ___odata_ODataUtils["getLabelForEntitySet"];
  const getNavigationPropertyInfoFromEntity = ___odata_ODataUtils["getNavigationPropertyInfoFromEntity"];
  const getPropertyInfoFromEntity = ___odata_ODataUtils["getPropertyInfoFromEntity"];
  const ApplicationInfo = ___ApplicationInfo["ApplicationInfo"];
  const ODataModelVersion = ___ApplicationInfo["ODataModelVersion"];
  const getActionStyles = ___FooterActions["getActionStyles"];
  const getCardActions = ___FooterActions["getCardActions"];
  const getDefaultAction = ___FooterActions["getDefaultAction"];
  const formatPropertyDropdownValues = ___Formatter["formatPropertyDropdownValues"];
  const getDefaultPropertyFormatterConfig = ___Formatter["getDefaultPropertyFormatterConfig"];
  const getDefaultPropertyFormatterConfigForNavProperties = ___Formatter["getDefaultPropertyFormatterConfigForNavProperties"];
  const parseCard = ___IntegrationCardHelper["parseCard"];
  const getNavigationPropertiesWithLabel = ___NavigationProperty["getNavigationPropertiesWithLabel"];
  const resolvePropertyPathFromExpression = ___PropertyExpression["resolvePropertyPathFromExpression"];
  /**
   * Description for the interface CardGeneratorDialogConfiguration
   * @interface CardGeneratorDialogConfiguration
   * @property {string} title The title of the card
   * @property {string} subtitle The subtitle of the card
   * @property {string} headerUOM The header unit of measure
   * @property {MainIndicatorOptions} mainIndicatorOptions The main indicator options
   * @property {string} mainIndicatorStatusKey The main indicator status key
   * @property {string} mainIndicatorStatusUnit The main indicator status unit
   * @property {string} entitySet The entity set
   * @property {Array<ObjectCardGroups>} groups The groups of the card displayed on content
   * @property {Array<object>} properties The properties
   * @property {AdvancedFormattingOptions} advancedFormattingOptions The advanced formatting options
   * @property {Array<object>} selectedTrendOptions The selected trend options
   * @property {Array<object>} selectedIndicatorOptions The selected indicator options
   * @property {TrendOptions} trendOptions The trend options
   * @property {object} $data Data used for adaptive card preview
   * @property {object} targetUnit The target unit
   * @property {object} deviationUnit The deviation unit
   * @property {boolean} groupLimitReached Flag maintained to check if the group limit is reached
   * @property {Array<KeyParameter>} keyParameters The key parameters
   */
  const UnitCollection = [{
    Name: "K",
    Value: "K"
  }, {
    Name: "%",
    Value: "%"
  }];

  /**
   * Merges the default property formatters with the user provided property formatters
   *
   * @param {FormatterConfigurationMap} defaultPropertyFormatters The default property formatters
   * @param {FormatterConfigurationMap} userProvidedPropertyFormatters The user provided property formatters
   * @returns {FormatterConfigurationMap} The merged property formatters
   * @private
   *
   */
  function _mergePropertyFormatters() {
    let defaultPropertyFormatters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    let userProvidedPropertyFormatters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    const mergedFormatters = [...userProvidedPropertyFormatters];
    for (const propertyFormatter of defaultPropertyFormatters) {
      if (!mergedFormatters.find(formatter => formatter.property === propertyFormatter.property)) {
        mergedFormatters.push({
          ...propertyFormatter
        });
      }
    }
    return mergedFormatters;
  }
  function updateUnitOfMeasures(unitOfMeasures, formatterConfigsWithUnit) {
    formatterConfigsWithUnit.forEach(formatter => {
      const matchingProperty = unitOfMeasures.find(unitConfig => unitConfig.name === formatter.property);
      let value = formatter.parameters?.[0].value?.replace(/\$\{/g, "");
      value = value?.replace(/\}/g, "");
      const formatterProperty = formatter.property;
      if (matchingProperty && value) {
        matchingProperty.propertyKeyForDescription = value;
        matchingProperty.value = value;
      } else if (value && formatterProperty) {
        unitOfMeasures.push({
          propertyKeyForDescription: value,
          name: formatterProperty,
          propertyKeyForId: formatterProperty,
          value: value
        });
      }
    });
    return unitOfMeasures;
  }
  const getCardGeneratorDialogModel = function (oAppComponent, mCardManifest) {
    try {
      const applicationInfo = ApplicationInfo.getInstance().fetchDetails();
      const oResourceBundle = CoreLib.getResourceBundleFor("sap.cards.ap.generator.i18n");
      const mManifest = oAppComponent.getManifest();
      const oAppModel = oAppComponent.getModel();
      const cardTitle = mManifest["sap.app"].title;
      const cardSubtitle = mManifest["sap.app"].description;
      const {
        entitySetWithObjectContext,
        serviceUrl,
        semanticObject,
        action
      } = applicationInfo;
      const entitySetName = applicationInfo.entitySet;
      const bODataV4 = applicationInfo.odataModel === ODataModelVersion.V4;
      const entitySet = getLabelForEntitySet(bODataV4 ? oAppModel : oAppModel, entitySetName);
      const properties = getPropertyInfoFromEntity(bODataV4 ? oAppModel : oAppModel, entitySetName, false);
      const propertiesWithNavigation = getPropertyInfoFromEntity(bODataV4 ? oAppModel : oAppModel, entitySetName, true, oResourceBundle);
      const navigationProperty = getNavigationPropertyInfoFromEntity(bODataV4 ? oAppModel : oAppModel, entitySetName);
      const selectProperties = properties.map(property => property.name);
      let urlParameters = {};
      if (selectProperties.length) {
        urlParameters = {
          $select: selectProperties.join(",")
        };
      }
      return Promise.resolve(createPathWithEntityContext(entitySetWithObjectContext, oAppModel, bODataV4)).then(function (path) {
        return Promise.resolve(fetchDataAsync(serviceUrl, path, bODataV4, urlParameters)).then(function (data) {
          function _temp16() {
            propertyValueFormatters = _mergePropertyFormatters(propertyValueFormatters, parsedManifest?.formatterConfigurationFromCardManifest);
            addLabelsForProperties(propertiesWithNavigation, data, mData, unitOfMeasures);
            const mainIndicatorOptions = parsedManifest?.mainIndicatorOptions;
            const mainIndicatorCriticalityOptions = mainIndicatorOptions?.criticalityOptions || [];
            const selectedKeyCriticality = mainIndicatorCriticalityOptions.length ? mainIndicatorCriticalityOptions[0].criticality : "";
            const mainIndicatorStatusKey = parsedManifest?.mainIndicatorOptions.mainIndicatorStatusKey || "";
            const trends = parsedManifest?.mainIndicatorOptions.trendOptions;
            const sideIndicators = parsedManifest?.sideIndicatorOptions;
            const mainIndicatorNavigationSelectedKey = parsedManifest?.mainIndicatorOptions.mainIndicatorNavigationSelectedKey || "";
            const navigationValue = parsedManifest?.mainIndicatorOptions.navigationValue || "";
            const selectedNavigationalProperties = [];
            return Promise.resolve(getNavigationPropertiesWithLabel(oAppComponent, mainIndicatorStatusKey, path)).then(function (_ref) {
              let {
                propertiesWithLabel,
                navigationPropertyData
              } = _ref;
              const selectedNavigationPropertyHeader = {
                name: mainIndicatorStatusKey,
                value: propertiesWithLabel
              };
              updateNavigationPropertiesWithLabel(navigationProperty, mainIndicatorStatusKey, selectedNavigationPropertyHeader.value);
              if (mainIndicatorStatusKey.length > 0 && (mData[mainIndicatorStatusKey] === null || mData[mainIndicatorStatusKey] === undefined)) {
                mData[mainIndicatorStatusKey] = navigationPropertyData[mainIndicatorStatusKey];
              }
              if (selectedNavigationPropertyHeader.name) {
                selectedNavigationalProperties.push(selectedNavigationPropertyHeader);
              }
              const mainIndicatorNavigationSelectedValue = selectedNavigationPropertyHeader.value.find(value => value.name === mainIndicatorNavigationSelectedKey)?.labelWithValue || "";
              const formatterConfigsWithUnit = parsedManifest?.formatterConfigurationFromCardManifest.filter(formatterConfig => formatterConfig.formatterName === "format.unit") || [];
              const advancedFormattingOptions = {
                unitOfMeasures: formatterConfigsWithUnit.length > 0 ? updateUnitOfMeasures(unitOfMeasures, formatterConfigsWithUnit) : unitOfMeasures,
                textArrangements: parsedManifest?.textArrangementsFromCardManifest || [],
                propertyValueFormatters: propertyValueFormatters,
                sourceCriticalityProperty: [],
                targetFormatterProperty: "",
                sourceUoMProperty: mainIndicatorOptions?.mainIndicatorStatusKey || "",
                selectedKeyCriticality: selectedKeyCriticality,
                textArrangementSourceProperty: mainIndicatorStatusKey,
                isPropertyFormattingEnabled: !!(mainIndicatorStatusKey && mainIndicatorNavigationSelectedKey === "")
              };
              const mainIndicatorStatusUnit = mainIndicatorStatusKey && propertiesWithNavigation.find(property => property.name === mainIndicatorStatusKey)?.labelWithValue || "";
              const _temp14 = `${entitySet}`,
                _temp13 = parsedManifest?.groups || [{
                  title: oResourceBundle?.getText("GENERATOR_DEFAULT_GROUP_NAME", [1]),
                  items: [{
                    label: "",
                    value: "",
                    isEnabled: false,
                    name: "",
                    navigationProperty: "",
                    isNavigationEnabled: false
                  }]
                }],
                _temp12 = trends,
                _temp11 = parsedManifest?.headerUOM || "",
                _temp10 = parsedManifest?.subtitle || cardSubtitle,
                _temp9 = parsedManifest?.title || cardTitle;
              return Promise.resolve(getCardActionInfo(oAppComponent, mData, oAppComponent.getModel("i18n"), mCardManifest)).then(function (_getCardActionInfo) {
                return Promise.resolve(getKeyParameters(oAppComponent)).then(function (_getKeyParameters) {
                  const dialogModelData = {
                    title: _temp14,
                    configuration: {
                      title: _temp9,
                      subtitle: _temp10,
                      headerUOM: _temp11,
                      mainIndicatorOptions: {
                        criticality: mainIndicatorCriticalityOptions
                      },
                      advancedFormattingOptions: advancedFormattingOptions,
                      trendOptions: _temp12,
                      indicatorsValue: sideIndicators,
                      selectedTrendOptions: trends ? [trends] : [],
                      selectedIndicatorOptions: sideIndicators ? [sideIndicators] : [],
                      selectedNavigationPropertyHeader,
                      selectedContentNavigation: [],
                      selectedHeaderNavigation: [],
                      navigationProperty,
                      mainIndicatorNavigationSelectedValue,
                      mainIndicatorStatusKey,
                      navigationValue,
                      mainIndicatorNavigationSelectedKey,
                      mainIndicatorStatusUnit,
                      selectedNavigationalProperties,
                      entitySet: entitySet,
                      oDataV4: bODataV4,
                      serviceUrl: serviceUrl,
                      properties: properties,
                      propertiesWithNavigation: propertiesWithNavigation,
                      groups: _temp13,
                      $data: mData,
                      targetUnit: UnitCollection,
                      deviationUnit: UnitCollection,
                      errorControls: [],
                      actions: _getCardActionInfo,
                      groupLimitReached: false,
                      keyParameters: _getKeyParameters,
                      appIntent: `${semanticObject}-${action}`
                    }
                  };
                  const dialogModel = new JSONModel(dialogModelData);
                  return dialogModel;
                });
              });
            });
          }
          const unitOfMeasures = [];
          const mData = {};
          // We are adding labels and values for properties
          addLabelsForProperties(properties, data, mData, unitOfMeasures);
          let propertyValueFormatters = getDefaultPropertyFormatterConfig(oResourceBundle, properties);
          const propertyValueFormattersForNavigationalProperties = getDefaultPropertyFormatterConfigForNavProperties(oResourceBundle, navigationProperty);
          propertyValueFormatters = _mergePropertyFormatters(propertyValueFormatters, propertyValueFormattersForNavigationalProperties);
          let parsedManifest;
          const _temp15 = function () {
            if (mCardManifest) {
              function _temp8() {
                return _forOf(parsedManifest.groups, function (group) {
                  return _forOf(group.items, function (item) {
                    const propertyPath = resolvePropertyPathFromExpression(item.value, mCardManifest);
                    const _temp6 = function () {
                      if (propertyPath?.includes("/")) {
                        const [navigationEntitySet, property] = propertyPath.replace(/[{}]/g, "").split("/");
                        return Promise.resolve(getNavigationPropertiesWithLabel(oAppComponent, navigationEntitySet, path)).then(function (_ref2) {
                          let {
                            propertiesWithLabel,
                            navigationPropertyData
                          } = _ref2;
                          item.navigationalProperties = propertiesWithLabel;
                          item.isNavigationEnabled = true;
                          item.isEnabled = false;
                          item.navigationProperty = property;
                          updateNavigationPropertiesWithLabel(navigationProperty, navigationEntitySet, item.navigationalProperties);
                          if (mData[navigationEntitySet] === null || mData[navigationEntitySet] === undefined) {
                            mData[navigationEntitySet] = navigationPropertyData[navigationEntitySet];
                          }
                        });
                      }
                    }();
                    if (_temp6 && _temp6.then) return _temp6.then(function () {});
                  });
                });
              }
              parsedManifest = parseCard(mCardManifest, oAppComponent.getModel("i18n"), properties);
              const _temp7 = _forOf(parsedManifest.textArrangementsFromCardManifest, function (textArrangement) {
                function _temp5() {
                  const _temp3 = function () {
                    if (textArrangement.isNavigationForId) {
                      const navigationEntitySet = textArrangement.propertyKeyForId;
                      return Promise.resolve(getNavigationPropertiesWithLabel(oAppComponent, navigationEntitySet, path)).then(function (_ref3) {
                        let {
                          propertiesWithLabel,
                          navigationPropertyData
                        } = _ref3;
                        textArrangement.navigationalPropertiesForId = propertiesWithLabel;
                        updateNavigationPropertiesWithLabel(navigationProperty, navigationEntitySet, textArrangement.navigationalPropertiesForId);
                        if (mData[navigationEntitySet] === null || mData[navigationEntitySet] === undefined) {
                          mData[navigationEntitySet] = navigationPropertyData[navigationEntitySet];
                        }
                      });
                    }
                  }();
                  if (_temp3 && _temp3.then) return _temp3.then(function () {});
                }
                const _temp4 = function () {
                  if (textArrangement.isNavigationForDescription) {
                    const navigationEntitySet = textArrangement.propertyKeyForDescription;
                    return Promise.resolve(getNavigationPropertiesWithLabel(oAppComponent, navigationEntitySet, path)).then(function (_ref4) {
                      let {
                        propertiesWithLabel,
                        navigationPropertyData
                      } = _ref4;
                      textArrangement.navigationalPropertiesForDescription = propertiesWithLabel;
                      updateNavigationPropertiesWithLabel(navigationProperty, navigationEntitySet, textArrangement.navigationalPropertiesForDescription);
                      if (mData[navigationEntitySet] === null || mData[navigationEntitySet] === undefined) {
                        mData[navigationEntitySet] = navigationPropertyData[navigationEntitySet];
                      }
                    });
                  }
                }();
                return _temp4 && _temp4.then ? _temp4.then(_temp5) : _temp5(_temp4);
              });
              return _temp7 && _temp7.then ? _temp7.then(_temp8) : _temp8(_temp7);
            }
          }();
          return _temp15 && _temp15.then ? _temp15.then(_temp16) : _temp16(_temp15);
        });
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
  function addLabelsForProperties(properties, data, mData, unitOfMeasures) {
    properties.forEach(property => {
      if (property.name && data[property.name] !== undefined && data[property.name] !== null) {
        const value = formatPropertyDropdownValues(property, data[property.name]);
        property.value = data[property.name];
        property.labelWithValue = value;
        const propertyExists = unitOfMeasures.find(uomProperty => uomProperty.name === property.name);
        if (property.UOM && property.name && !propertyExists) {
          unitOfMeasures.push({
            propertyKeyForDescription: property.UOM,
            name: property.name,
            propertyKeyForId: property.name,
            value: property.UOM
          });
        }
        mData[property.name] = data[property.name];
      } else {
        property.labelWithValue = property.category ? `${property.label}` : `${property.label} (<empty>)`;
      }
    });
  }
  function updateNavigationPropertiesWithLabel(navigationProperties, navigationEntityName, propertiesWithLabel) {
    const navigationProperty = navigationProperties.find(property => property.name === navigationEntityName);
    if (!navigationProperty) {
      return;
    }
    navigationProperty.properties = [...propertiesWithLabel];
  }
  var __exports = {
    __esModule: true
  };
  __exports._mergePropertyFormatters = _mergePropertyFormatters;
  __exports.getCardActionInfo = getCardActionInfo;
  __exports.updateUnitOfMeasures = updateUnitOfMeasures;
  __exports.getCardGeneratorDialogModel = getCardGeneratorDialogModel;
  __exports.addLabelsForProperties = addLabelsForProperties;
  return __exports;
});
//# sourceMappingURL=CardGeneratorModel-dbg-dbg.js.map
