/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/cards/ap/transpiler/cardTranspiler/Transpile", "sap/fe/navigation/SelectionVariant", "../helpers/ApplicationInfo", "../helpers/I18nHelper", "../odata/ODataUtils"], function (sap_cards_ap_transpiler_cardTranspiler_Transpile, SelectionVariant, ___helpers_ApplicationInfo, ___helpers_I18nHelper, ___odata_ODataUtils) {
  "use strict";

  function _catch(body, recover) {
    try {
      var result = body();
    } catch (e) {
      return recover(e);
    }
    if (result && result.then) {
      return result.then(void 0, recover);
    }
    return result;
  }
  const convertIntegrationCardToAdaptive = sap_cards_ap_transpiler_cardTranspiler_Transpile["convertIntegrationCardToAdaptive"];
  const ODataModelVersion = ___helpers_ApplicationInfo["ODataModelVersion"];
  const fetchApplicationInfo = ___helpers_ApplicationInfo["fetchApplicationInfo"];
  const resolvei18nTextsForIntegrationCard = ___helpers_I18nHelper["resolvei18nTextsForIntegrationCard"];
  const createContextParameter = ___odata_ODataUtils["createContextParameter"];
  /**
   * The card types
   *
   * @alias sap.cards.ap.common.services.RetrieveCard.CardTypes
   * @private
   * @restricted sap.fe, sap.ui.generic.app
   */
  var CardTypes = /*#__PURE__*/function (CardTypes) {
    CardTypes["INTEGRATION"] = "integration";
    CardTypes["ADAPTIVE"] = "adaptive";
    return CardTypes;
  }(CardTypes || {});
  /**
   * The options for fetching the card manifest
   *
   * @alias sap.cards.ap.common.services.RetrieveCard.CardManifestFetchOptions
   * @private
   * @restricted sap.fe, sap.ui.generic.app
   */
  /**
   * Fetches the card path from the application manifest
   *
   * @param {CardType} type - The type of card
   * @param {string} entitySet - The entity set
   * @param {AppManifest} applicationManifest - The application manifest
   * @returns The card path
   */
  const getCardPath = (type, entitySet, applicationManifest) => {
    const manifest = type === CardTypes.INTEGRATION ? "manifest.json" : "adaptive-manifest.json";
    const sapCardsAP = applicationManifest["sap.cards.ap"];
    if (sapCardsAP === undefined || Object.keys(sapCardsAP).length === 0) {
      return "";
    }
    const cardsConfig = sapCardsAP["embeds"]["ObjectPage"];
    if (cardsConfig === undefined || Object.keys(cardsConfig["manifests"]).length === 0) {
      return "";
    }
    const defaultCard = cardsConfig["manifests"][entitySet || cardsConfig.default][0];
    const localUri = defaultCard.localUri.endsWith("/") ? defaultCard.localUri : defaultCard.localUri + "/";
    return "/" + localUri + manifest;
  };

  /**
   * clean up the unnecessary variant information
   *
   * @param selectionVariant
   * @returns
   */
  const cleanupVariantInformation = selectionVariant => {
    if (selectionVariant.hasOwnProperty("SelectionVariantID")) {
      delete selectionVariant.SelectionVariantID;
    } else if (selectionVariant.hasOwnProperty("PresentationVariantID")) {
      delete selectionVariant.PresentationVariantID;
    }
    delete selectionVariant.Text;
    delete selectionVariant.ODataFilterExpression;
    delete selectionVariant.Version;
    delete selectionVariant.FilterContextUrl;
    delete selectionVariant.ParameterContextUrl;
    return selectionVariant;
  };

  /**
   * Fetches the manifest from the given url
   *
   * @param {string} url - The url of the manifest
   * @returns The manifest
   */
  const fetchManifest = function (url) {
    return Promise.resolve(_catch(function () {
      return Promise.resolve(fetch(url)).then(function (response) {
        return Promise.resolve(response.json());
      });
    }, function () {
      return null;
    }));
  };
  /**
   * Fetches the card manifest for the object page
   *
   * @param {Component} appComponent
   * @param {CardHostParam} hostOptions
   * @param {Boolean} isDesignMode
   * @returns The card manifest
   * @private
   */
  const _getObjectPageCardManifest = function (appComponent, hostOptions) {
    let isDesignMode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    try {
      function _temp2() {
        const cardsPath = getCardPath(cardType || CardTypes.INTEGRATION, entitySet, applicationManifest);
        if (cardsPath.length === 0) {
          return Promise.reject("No cards available for this application");
        }
        const cardUrl = applicationUrlOnAbap.endsWith("/") ? applicationUrlOnAbap.substring(0, applicationUrlOnAbap.length - 1) + cardsPath : applicationUrlOnAbap + cardsPath;
        return fetchManifest(cardUrl);
      }
      const {
        entitySet,
        cardType
      } = hostOptions;
      let applicationManifest = appComponent.getManifest();
      const sapPlatformAbap = applicationManifest["sap.platform.abap"];
      const applicationUrlOnAbap = sapPlatformAbap?.uri || "";
      const _temp = function () {
        if (isDesignMode) {
          return Promise.resolve(fetchManifest(applicationUrlOnAbap + "/manifest.json")).then(function (_fetchManifest) {
            applicationManifest = _fetchManifest;
          });
        }
      }();
      return Promise.resolve(_temp && _temp.then ? _temp.then(_temp2) : _temp2(_temp));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  /**
   * Add actions to the card header
   *  - ibnTarget contains the semantic object and action
   *  - ibnParams contains the context parameters and sap-xapp-state-data - which is the stringified selection variant of the context parameters
   *
   * @param cardManifest
   * @param applicationInfo
   */
  const addActionsToCardHeader = function (cardManifest, applicationInfo) {
    try {
      const {
        semanticObject,
        action,
        entitySetWithObjectContext,
        appModel,
        odataModel
      } = applicationInfo;
      const header = cardManifest["sap.card"]["header"];
      const ibnParams = {};
      const selectionVariant = new SelectionVariant();
      const isODataV4 = odataModel === ODataModelVersion.V4;
      return Promise.resolve(createContextParameter(entitySetWithObjectContext, appModel, isODataV4)).then(function (context) {
        context.split(",").forEach(function (param) {
          const [key, value] = param.split("=");
          ibnParams[key] = value;
          selectionVariant.addSelectOption(key, "I", "EQ", value);
        });
        ibnParams["sap-xapp-state-data"] = JSON.stringify({
          selectionVariant: cleanupVariantInformation(selectionVariant.toJSONObject())
        });
        header.actions = [{
          type: "Navigation",
          parameters: {
            ibnTarget: {
              semanticObject,
              action
            },
            ibnParams
          }
        }];
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
  /**
   * Checks if the leanDT card exists in the application at runtime or not
   *
   * @param appComponent
   * @param isDesignMode
   * @returns boolean
   */
  const checkIfCardExists = function (appComponent) {
    let isDesignMode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    const mApplicationManifest = appComponent.getManifest();
    return !(!mApplicationManifest["sap.cards.ap"] && !isDesignMode);
  };

  /**
   * Function to handle the hide actions for the card
   *
   * @param appComponent
   * @param mManifest
   */
  const handleHideActions = function (appComponent, mManifest) {
    const appManifest = appComponent.getManifest();
    const cardsConfig = appManifest["sap.cards.ap"]?.embeds.ObjectPage;
    if (cardsConfig && Object.keys(cardsConfig["manifests"]).length > 0) {
      const defaultEntitySet = cardsConfig?.["default"];
      const hideActions = defaultEntitySet && cardsConfig["manifests"][defaultEntitySet]?.[0]?.hideActions || false;
      const mParameters = mManifest?.["sap.card"]?.configuration?.parameters;
      if (hideActions && mParameters?._adaptiveFooterActionParameters) {
        delete mParameters["_adaptiveFooterActionParameters"];
      }
      if (hideActions && mParameters?.footerActionParameters) {
        delete mParameters["footerActionParameters"];
      }
      if (hideActions && mManifest?.["sap.card"]?.footer) {
        delete mManifest["sap.card"]["footer"];
      }
    }
  };

  /**
   * Fetches key parameters for the given application component.
   *
   * @param {Component} appComponent - The application component.
   * @returns {Promise<KeyParameter[]>} - A promise that resolves to an array of key parameters.
   */
  const getKeyParameters = function (appComponent) {
    try {
      return Promise.resolve(fetchApplicationInfo(appComponent)).then(function (applicationInfo) {
        const {
          entitySetWithObjectContext,
          appModel,
          odataModel
        } = applicationInfo;
        const bODataV4 = odataModel === ODataModelVersion.V4;
        return Promise.resolve(createContextParameter(entitySetWithObjectContext, appModel, bODataV4)).then(function (objectPath) {
          return objectPath.split(",").map(parameter => {
            const [key, value] = parameter.split("=");
            const formattedValue = value.replace("guid", "").replaceAll("'", "");
            return {
              key,
              formattedValue
            };
          });
        });
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  /**
   * Updates the data path of the card header in the provided card manifest by reference.
   *
   * @param {CardManifest} cardManifest - The card manifest object that contains the header data.
   */
  function updateHeaderDataPath(cardManifest) {
    const headerData = cardManifest["sap.card"].header.data;
    if (headerData?.path && headerData.path !== "/header/d/") {
      headerData.path = "/header/d/";
    }
  }

  /**
   * Fetches the card manifest for the object page
   *
   * @param {Component} appComponent The root component of the application
   * @param {CardManifestFetchOptions} fetchOptions The options
   * @returns {Promise<any>} The card manifest
   * @private
   * @since 1.124.0
   * @restricted sap.fe, sap.ui.generic.app
   */
  const getObjectPageCardManifestForPreview = function (appComponent, fetchOptions) {
    try {
      const isDesignMode = fetchOptions?.isDesignMode;
      if (!checkIfCardExists(appComponent, isDesignMode ?? false)) {
        return Promise.reject("No cards available for this application");
      }
      return Promise.resolve(fetchApplicationInfo(appComponent, {
        isDesignMode
      })).then(function (applicationInfo) {
        const {
          componentName,
          entitySet,
          context,
          resourceBundle,
          semanticObject,
          action
        } = applicationInfo;
        const hostOptions = {
          cardType: CardTypes.INTEGRATION,
          componentName: componentName,
          entitySet: entitySet,
          context
        };
        return Promise.resolve(_getObjectPageCardManifest(appComponent, hostOptions, fetchOptions?.isDesignMode ?? false)).then(function (cardManifest) {
          return !cardManifest || Object.keys(cardManifest).length === 0 ? Promise.reject("No cards available for this application") : Promise.resolve(getKeyParameters(appComponent)).then(function (keyParameters) {
            if (fetchOptions?.hideActions ?? true) {
              handleHideActions(appComponent, cardManifest);
            }
            const cardType = fetchOptions?.cardType || CardTypes.INTEGRATION;
            if (cardType === CardTypes.INTEGRATION) {
              function _temp4() {
                updateHeaderDataPath(cardManifest);
                return resolvei18nTextsForIntegrationCard(cardManifest, resourceBundle);
              }
              cardManifest["sap.card"]["data"]["request"]["headers"]["Accept-Language"] ??= "{{parameters.LOCALE}}";
              const parameters = cardManifest["sap.card"].configuration.parameters;
              const data = cardManifest["sap.card"]["data"];
              const contentUrl = data["request"]["batch"]["content"]["url"];
              if (contentUrl.includes("{{parameters.contextParameters}}")) {
                /**
                 * Replace the contextParameters with the object context
                 * This is required for the integration card to fetch the data until all the manifests are regenerated.
                 */
                cardManifest["sap.card"]["configuration"]["parameters"]["contextParameters"] = {
                  type: "string",
                  value: hostOptions.context
                };
              }
              keyParameters.forEach(parameter => {
                if (parameters[parameter.key] !== undefined) {
                  parameters[parameter.key]["value"] = parameter.formattedValue;
                }
              });
              const _temp3 = function () {
                if (fetchOptions?.includeActions ?? true) {
                  return Promise.resolve(addActionsToCardHeader(cardManifest, applicationInfo)).then(function () {});
                }
              }();
              return _temp3 && _temp3.then ? _temp3.then(_temp4) : _temp4(_temp3);
            } else {
              const cardManifestWithResolvedI18nTexts = resolvei18nTextsForIntegrationCard(cardManifest, resourceBundle);
              return convertIntegrationCardToAdaptive(cardManifestWithResolvedI18nTexts, `${semanticObject}-${action}`, keyParameters);
            }
          });
        });
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
  var __exports = {
    __esModule: true
  };
  __exports.CardTypes = CardTypes;
  __exports.getCardPath = getCardPath;
  __exports.fetchManifest = fetchManifest;
  __exports._getObjectPageCardManifest = _getObjectPageCardManifest;
  __exports.getKeyParameters = getKeyParameters;
  __exports.getObjectPageCardManifestForPreview = getObjectPageCardManifestForPreview;
  return __exports;
});
//# sourceMappingURL=RetrieveCard-dbg-dbg.js.map
