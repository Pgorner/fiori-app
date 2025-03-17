/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/base/Log", "sap/base/i18n/Formatting", "sap/fe/navigation/NavigationHandler", "sap/fe/navigation/SelectionVariant", "sap/m/GenericTile", "sap/m/Text", "sap/m/TileContent", "sap/m/library", "sap/ui/core/Component", "sap/ui/core/format/DateFormat", "sap/ui/core/format/NumberFormat", "sap/ui/model/odata/v4/ODataModel", "sap/ushell/api/S4MyHome", "./ToDoPanel"], function (Log, Formatting, NavigationHandler, SelectionVariant, GenericTile, Text, TileContent, sap_m_library, Component, DateFormat, NumberFormat, ODataModel, S4MyHome, __ToDoPanel) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
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
  const LoadState = sap_m_library["LoadState"];
  const URLHelper = sap_m_library["URLHelper"];
  const ValueColor = sap_m_library["ValueColor"];
  const ToDoPanel = _interopRequireDefault(__ToDoPanel);
  class NavigationHelperError {}

  /**
   *
   * Panel class for managing and storing Situation cards.
   *
   * @extends ToDoPanel
   *
   * @author SAP SE
   * @version 0.0.1
   * @since 1.121
   *
   * @internal
   * @experimental Since 1.121
   * @public
   *
   * @alias sap.cux.home.SituationPanel
   */
  const SituationPanel = ToDoPanel.extend("sap.cux.home.SituationPanel", {
    /**
     * Constructor for a new Situation Panel.
     *
     * @param {string} [id] ID for the new control, generated automatically if an ID is not provided
     * @param {object} [settings] Initial settings for the new control
     */
    constructor: function _constructor(id, settings) {
      ToDoPanel.prototype.constructor.call(this, id, settings);
    },
    /**
     * Init lifecycle method
     *
     * @private
     * @override
     */
    init: function _init() {
      ToDoPanel.prototype.init.call(this);

      //Configure Header
      this.setProperty("key", "situations");
      this.setProperty("title", this._i18nBundle.getText("situationsTabTitle"));
    },
    /**
     * Generates request URLs for fetching data based on the specified card count.
     * Overridden method to provide situation-specific URLs.
     *
     * @private
     * @override
     * @param {number} cardCount - The number of cards to retrieve.
     * @returns {string[]} An array of request URLs.
     */
    generateRequestUrls: function _generateRequestUrls(cardCount) {
      const language = Formatting.getLanguageTag().language || "";
      return [this.getCountUrl(), `${this.getDataUrl()}&$expand=_InstanceAttribute($expand=_InstanceAttributeValue($filter=(Language eq '${language.toUpperCase()}' or Language eq ''))),_InstanceText($filter=(Language eq '${language.toUpperCase()}' or Language eq ''))&$skip=0&$top=${cardCount}`];
    },
    /**
     * Generates a card template for situations.
     * Overridden method from To-Do panel to generate situation-specific card template.
     *
     * @private
     * @override
     * @param {string} id The ID for the template card.
     * @param {Context} context The context object.
     * @returns {Control} The generated card control template.
     */
    generateCardTemplate: function _generateCardTemplate(id, context) {
      return new GenericTile(`${id}-actionTile`, {
        mode: "ActionMode",
        frameType: "TwoByOne",
        pressEnabled: true,
        header: this._getSituationMessage(context.getProperty("_InstanceText/0/SituationTitle"), context.getProperty("_InstanceAttribute")),
        headerImage: "sap-icon://alert",
        valueColor: ValueColor.Critical,
        state: context.getProperty("status"),
        press: event => {
          void this._onPressSituation(event);
        },
        tileContent: [new TileContent(`${id}-actionTileContent`, {
          content: new Text(`${id}-text`, {
            text: this._getSituationMessage(context.getProperty("_InstanceText/0/SituationText"), context.getProperty("_InstanceAttribute"))
          }),
          footer: S4MyHome.formatDate(context.getProperty("SitnInstceCreatedAtDateTime"))
        })]
      });
    },
    /**
     * Compose the situation message by replacing placeholders with formatted parameter values.
     *
     * @private
     * @param {string} rawText - The raw text containing placeholders.
     * @param {InstanceAttribute[]} params - An array of parameters to replace in the text.
     * @returns {string} The composed text with replaced placeholders.
     */
    _getSituationMessage: function _getSituationMessage(rawText) {
      let params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      if (!rawText?.split) {
        return rawText;
      }
      let composedText = rawText.replaceAll("\n", " ");
      params.forEach(param => {
        if (param.SitnInstceAttribName?.length > 0) {
          const attributeSource = `0${param.SitnInstceAttribSource}`;
          const paramName = `${attributeSource}.${param.SitnInstceAttribName}`;
          const matchedAttributes = param._InstanceAttributeValue.reduce(function (matchedAttributes, attribute) {
            if (attribute.SitnInstceAttribSource === param.SitnInstceAttribSource && attribute.SitnInstceAttribName === param.SitnInstceAttribName) {
              matchedAttributes.push(attribute);
            }
            return matchedAttributes;
          }, []);
          const formattedValues = [];
          matchedAttributes.forEach(attributeMatched => {
            let rawVal = attributeMatched?.SitnInstceAttribValue?.trim() || "";
            let formattedVal;
            switch (param.SitnInstceAttribEntityType) {
              case "Edm.DateTime":
                formattedVal = this._getDateFormatter().format(this._getDateFormatter().parse(rawVal));
                break;
              case "Edm.Decimal":
                // If the parameter string ends with a minus sign, move it to the first position
                if (rawVal.endsWith("-")) {
                  rawVal = `-${rawVal.substring(0, rawVal.length - 1)}`;
                }
                formattedVal = this._getNumberFormatter().format(Number(rawVal));
                break;
              default:
                formattedVal = rawVal;
            }
            formattedValues.push(formattedVal);
          });

          // Replace placeholders with formatted values
          composedText = composedText.split(`{${paramName}}`).join(formattedValues.join(", "));
        }
      });
      return composedText;
    },
    /**
     * Gets the date formatter instance using the medium date pattern.
     *
     * @returns {DateFormat} The date formatter instance.
     */
    _getDateFormatter: function _getDateFormatter() {
      if (!this._dateFormatter) {
        const datePattern = Formatting.getDatePattern("medium") || "dd/MM/yyyy";
        this._dateFormatter = DateFormat.getDateInstance({
          pattern: datePattern
        });
      }
      return this._dateFormatter;
    },
    /**
     * Gets the number formatter instance using the settings retrieved from Configuration.
     *
     * @returns {NumberFormat} The number formatter instance.
     */
    _getNumberFormatter: function _getNumberFormatter() {
      if (!this._decimalFormatter) {
        this._decimalFormatter = NumberFormat.getFloatInstance({
          decimalSeparator: Formatting.getNumberSymbol("decimal") || ".",
          groupingSeparator: Formatting.getNumberSymbol("group") || ",",
          groupingEnabled: true
        });
      }
      return this._decimalFormatter;
    },
    /**
     * Handle the press event for a situation.
     *
     * @private
     * @param {Event} event - The event object.
     */
    _onPressSituation: function _onPressSituation(event) {
      try {
        const _this = this;
        const control = event.getSource();
        const context = control.getBindingContext();
        const {
          status,
          SitnInstceKey: id,
          SitnEngineType
        } = context?.getObject();
        const url = _this.getTargetAppUrl();
        const _temp3 = function () {
          if (status !== LoadState.Loading) {
            const _temp2 = function () {
              if (id) {
                const _temp = _catch(function () {
                  return Promise.resolve(_this._fetchNavigationTargetData(id, SitnEngineType)).then(function (_this$_fetchNavigatio) {
                    const navigationTargetData = _this$_fetchNavigatio;
                    return Promise.resolve(_this._executeNavigation(navigationTargetData, Component.getOwnerComponentFor(_this.getParent()))).then(function () {});
                  });
                }, function (error) {
                  if (error instanceof NavigationHelperError && SitnEngineType === "1" && error._sErrorCode === "NavigationHandler.isIntentSupported.notSupported") {
                    // Navigate to the situations app
                    URLHelper.redirect(_this.getTargetAppUrl(), false);
                  }
                });
                if (_temp && _temp.then) return _temp.then(function () {});
              } else {
                URLHelper.redirect(url, false);
              }
            }();
            if (_temp2 && _temp2.then) return _temp2.then(function () {});
          }
        }();
        return Promise.resolve(_temp3 && _temp3.then ? _temp3.then(function () {}) : void 0);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Retrieves the Situations model. If the model does not exist, it creates a new one.
     *
     * @private
     * @returns {ODataModel} The Situations model instance.
     */
    _getSituationsModel: function _getSituationsModel() {
      if (!this._situationsModel) {
        this._situationsModel = new ODataModel({
          serviceUrl: "/sap/opu/odata4/sap/a_sitn2mblinstce_v4/srvd/sap/a_sitn2mblinstce_srv/0002/"
        });
      }
      return this._situationsModel;
    },
    /**
     * Fetches navigation target data based on the provided instance ID.
     *
     * @private
     * @async
     * @param {string} instanceId - The instance ID for which to fetch navigation data.
     * @param {string} situationEngineType - Situation Engine Type
     * @returns {Promise<NavigationTargetData>} A promise that resolves with an object containing navigation data.
     */
    _fetchNavigationTargetData: function _fetchNavigationTargetData(instanceId, situationEngineType) {
      try {
        const _this2 = this;
        return Promise.resolve(_catch(function () {
          if (situationEngineType === "1") {
            const oContextBindingNavigation = _this2._getSituationsModel().bindContext(`/Navigation/${instanceId}`, undefined, {
              $expand: {
                _NavigationParam: {
                  $select: ["SituationNotifParamName", "SituationNotifParameterVal"]
                }
              },
              $select: ["SitnInstanceID", "SitnSemanticObject", "SitnSemanticObjectAction"]
            });
            return Promise.resolve(oContextBindingNavigation.requestObject()).then(function (_oContextBindingNavig) {
              return _oContextBindingNavig;
            });
          } else {
            return Promise.resolve({
              SitnInstanceID: instanceId,
              SitnSemanticObject: "SituationInstance",
              SitnSemanticObjectAction: "display",
              _NavigationParam: [{
                SituationNotifParamName: "ui-type",
                SituationNotifParameterVal: "extended"
              }, {
                SituationNotifParamName: "SitnInstceKey",
                SituationNotifParameterVal: instanceId
              }]
            });
          }
        }, function (error) {
          Log.error(error instanceof Error ? error.message : "");
        }));
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Executes navigation based on provided data.
     *
     * @private
     * @param {NavigationData} oData - Data object containing navigation parameters.
     * @param {Component} ownerComponent - The owner component initiating the navigation.
     * @returns {Promise<void>} A promise that resolves or rejects based on the navigation result.
     */
    _executeNavigation: function _executeNavigation(oData, ownerComponent) {
      return new Promise((resolve, reject) => {
        //@ts-expect-error: params
        const navigationHandler = new NavigationHandler(ownerComponent);
        const oSelectionVariant = new SelectionVariant();
        oData._NavigationParam?.map(function (param) {
          if (param.SituationNotifParamName) {
            oSelectionVariant.addSelectOption(param.SituationNotifParamName, "I", "EQ", param.SituationNotifParameterVal);
          }
        });
        const sNavigationParameters = oSelectionVariant.toJSONString();
        navigationHandler.navigate(oData.SitnSemanticObject, oData.SitnSemanticObjectAction, sNavigationParameters, resolve, error => reject(error));
      });
    },
    /**
     * Get the text for the "No Data" message.
     *
     * @private
     * @returns {string} The text for the "No Data" message.
     */
    getNoDataText: function _getNoDataText() {
      return this._i18nBundle.getText("noSituationTitle");
    }
  });
  return SituationPanel;
});
//# sourceMappingURL=SituationPanel-dbg-dbg.js.map
