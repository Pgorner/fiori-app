// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
  "sap/ui/core/Core",
  "sap/ui/integration/Extension",
  "sap/ushell/utils/DynamicTileRequest",
  "sap/ui/core/format/NumberFormat",
  "sap/base/Log",
  "sap/m/library",
  "sap/ui/core/library"
],
  function (
    Core,
    Extension,
    DynamicTileRequest,
    NumberFormat,
    Log,
    mLib,
    cLib
  ) {

  "use strict";

  /**
   * This Card Extension is used to handle requests of the TileCard representing a Dynamic Tile.
   * The Card Extension is loaded based on the sap.card/extension setting pointing to this module.
   *
   * In such case the TileCard manifest is configured with a data setting in the header that uses a
   * dataPath parameter of the TileCard manifest to do a fetch call.
   * This extension intercepts the fetch call.
   *
   * For the first fetch call it returns a new Response with
   * loading data { number: "..." } and
   * status 429, retryAfter, which is handled by the card itself to retrigger the fetch after 1 sec.
   *
   * It triggers a fetch call to get the real data that is returned for second fetch call
   * and all subsequent interval calls.
   *
   * For all subsequent fetch calls (based on card data setting 'refresh' and the retryAfter call)
   * the real data is fetched from the backend via DynamicTileRequest,
   * normalized and applied to the card data.
   *
   * The bindings of all settings will be updated.
   *
   * @alias sap.ushell.utils.tilecard.TileCardExtension
   * @class
   * @extends sap.ushell.utils.tilecard.TileCardExtension
   * @classdesc TileCardExtension
   *
   * @since 1.123.0
   * @private
   */
  const TileCardExtension = Extension.extend("sap.ushell.utils.workpage.TileCardExtension");

  TileCardExtension._DynamicTileRequest = DynamicTileRequest; // to allow test to simulate the request
  TileCardExtension._DynamicTileRequestTimeout = 30000; // 30 seconds, can be overridden in tests

  const oLogger = Log.getLogger("sap.ushell.utils.tilecard.TileCardExtension");

  const ValueColor = mLib.ValueColor;
  const ValueState = cLib.ValueState;

  const TileValueState = {
    Positive: "Positive",
    Negative: "Negative",
    Critical: "Critical"
  };

  const numberFactors = [
    { factor: 1000000, value: "M" },
    { factor: 1000, value: "k" }
  ];

  /**
   * Returns the corresponding ValueState of the given state for the settings of the TileCard.
   *
   * @param {string} sState the state from the data.
   *
   * @returns {ValueState} the corresponding ValueState for the state.
   *
   * @private
   * @since 1.123.0
   */
  function getValueState (sState) {
    if (sState === TileValueState.Positive) {
      return ValueState.Success;
    } else if (sState === TileValueState.Negative) {
      return ValueState.Error;
    } else if (sState === TileValueState.Critical) {
      return ValueState.Warning;
    }
    return ValueState[sState] || ValueState.None;
  }

  /**
   * Returns the corresponding ValueColor of the given state for the settingsof the TileCard.
   *
   * @param {string} sState the state from the data.
   *
   * @returns {ValueColor} the corresponding ValueColor for the state.
   *
   * @private
   * @since 1.123.0
   */
  function getValueColor (sState) {
    if (sState === TileValueState.Positive) {
      return ValueColor.Good;
    } else if (sState === TileValueState.Negative) {
      return ValueColor.Error;
    }
    return ValueColor[sState] || ValueColor.None;
  }

  /**
   * Returns the details text based on the current data.
   * If the data delivered an info, it is returned.
   * If the number delivered is "#" it returns error text.
   * Otherwise ""
   *
   * @param {object} oData the data of the DynamicTileRequest.
   * @param {string} sError the error text if normaization fails
   *
   * @returns {string} the text for the details.
   *
   * @private
   * @since 1.123.0
   */
  function getIndicatorDetails (oData, sError) {
    if (oData.info) {
      return oData.info;
    }
    if (oData.number === "#") {
      return sError;
    }
    return "";
  }

  /**
   * Returns the indicators state color based on the current data.
   *
   * @param {object} oData the data of the DynamicTileRequest.
   *
   * @returns {ValueColor} the corresponding ValueColor for the inidicator.
   *
   * @private
   * @since 1.123.0
   */
   function getIndicatorState (oData) {
    if (!oData.hasOwnProperty("number") || oData.number === "..." || oData.number === "#") {
      return ValueColor.None;
    }
    return getValueColor(oData.numberState);
  }

  /**
   * Returns the indicator number (teext) based on the current data.
   * If a number factor is given by the data, it is applied to the number
   *
   * @param {object} oData the data of the DynamicTileRequest.
   *
   * @returns {string} the number (text) for the indicator.
   *
   * @private
   * @since 1.123.0
   */
  function getIndicatorNumber (oData) {
    if (!oData.hasOwnProperty("number")) {
      oData.number = "...";
    }
    if (typeof oData.number === "string" && oData.number !== "...") {
      oData.number = parseFloat(oData.number);
      if (isNaN(oData.number)) {
        oData.number = "#";
      }
    }

    if (!isNaN(oData.number)) {
      if (!oData.hasOwnProperty("numberFactor")) {
        oData._data.unit = "";
        if (oData.number >= 1000) {
          const oFactor = numberFactors.find(function (oFactorEntry) {
            return oData.number / oFactorEntry.factor >= 1 && oData.number / (oFactorEntry.factor * 1000) < 1;
          });
          oData._data.unit = oFactor.value;
          oData.number = oData.number / oFactor.factor;
        }
      } else {
        oData._data.unit = oData.numberFactor;
      }

      if (!oData.hasOwnProperty("numberDigits") && oData._data.unit) {
        oData.numberDigits = 2;
      }
      const oFractFormat = NumberFormat.getFloatInstance({
        minFractionDigits: Math.min(oData.numberDigits, 3),
        maxFractionDigits: Math.min(oData.numberDigits, 3)
      });
      oData.number = oFractFormat.format(oData.number);
    }
    return oData.number;
  }

  /**
   * Normalizes the data from the DynamicTileRequest and adds _data for the bindings of the TileCard.
   * If data contains an array of results, they are summed and their parameters are collected,
   * but all other attributes are ignored.
   *
   * @param {object} oData the data of the DynamicTileRequest.
   * @param {string} sError the error text if normaization fails
   *
   * @returns {object} the normalized data.
   *
   * @private
   * @since 1.123.0
   */
  function normalizeTileData (oData, sError) {
    if (!isNaN(oData)) {
      oData = {
        number: oData
      };
    }
    if (Array.isArray(oData.results)) {
      // sum results if array oData.results
      oData.targetParams = oData.targetParams || [];
      oData.number = oData.results.reduce(
        function (nSum, oResult) {
          if (oResult.targetParams) {
            oData.targetParams.push(oResult.targetParams);
          }
          return nSum + (parseFloat(oResult.number) || 0);
        },
        0
      );
    }
    oData._data = {};
    oData._data.number = getIndicatorNumber(oData);
    oData._data.details = {};
    oData._data.details.text = getIndicatorDetails(oData, sError);
    oData._data.details.state = getValueState(oData.infoState);
    oData._data.state = getIndicatorState(oData);
    oData._data.trend = oData.stateArrow || null;
    oData._data.icon = oData.icon || null;
    oData._data.title = oData.title || null;
    oData._data.subtitle = oData.subtitle || null;
    if (Array.isArray(oData._data.targetParams)) {
      oData._data.targetParams = oData.targetParams.join("&");
    }
    return oData;
  }


  /**
   * Initialize the extensions instance.
   *
   * @private
   * @since 1.123.0
   */
  TileCardExtension.prototype.onCardReady = function () {
    this.bFirstRequest = true;
    this._oCurrentDataRequest = null;
    this._oCurrentDataRequestSendTS = 0;
    this._sErrorText = this.getCard().getTranslatedText("TileCard.Data.Error");
    this._sTimeoutText = this.getCard().getTranslatedText("TileCard.Data.Timeout");
    this._oErrorResponse = normalizeTileData({
      number: "...",
      info: this._sErrorText
    }, this._sErrorText);
    this._oTimeoutResponse = normalizeTileData({
      number: "...",
      info: this._sTimeoutText
    }, this._sErrorText);
  };

  /**
   * Called from the Card to fetch data and then applied by the Card as data to the header.
   *
   * @param {string} sResource The resource url to request
   *
   * @returns {Promise<Response>} A Response object containing the data.
   *
   * @private
   * @since 1.123.0
   */
  TileCardExtension.prototype.fetch = function (sResource) {
    if (sResource.startsWith("/.")) {
      sResource = sResource.substring(1);
    }
    if (!this.bFirstRequest && Date.now() - this._oCurrentDataRequestSendTS < 2000) {
      // do not send requests more often than every 2 seconds
      return this._oCurrentDataRequest;
    }
    //trigger the real request directly. real result might be available already after retry after 1 sec.
    this._oCurrentDataRequestSendTS = Date.now();
    this._oCurrentDataRequest = this._fetchTileCardData(sResource);

    if (this.bFirstRequest) {
      // the first request of the card should be answered immediately to show "..."
      this.bFirstRequest = false;
      return Promise.resolve(
        new Response(
          new Blob(
            ['number: "..."'],
            { type: "application/json" }
          ),
          { status: 429 } // status 429 Retry After handled in card as retryAfter
          )
        );
    }
    return this._oCurrentDataRequest;
  };

   /**
   * Requests and normalizes the data from the DynamicTileRequest.
   *
   * @param {string} sResource the resource url to fetch the data.
   *
   * @returns {Promise<object>} the normalized data object as a promise.
   *
   * @private
   * @since 1.123.0
   */
   TileCardExtension.prototype._fetchTileCardData = function (sResource) {
    let bTimedOut = false;
    const sErrorText = this._sErrorText;
    return new Promise(function (resolve) {
      // always use a timeout for the request.
      // The DynamicTileRequest depends on services that might never resolve and therefore the request is never finished.
      // To avoid this, the request is always timed out after TileCardExtension._DynamicTileRequestTimeout milliseconds.
      setTimeout(() => {
        bTimedOut = true;
        resolve(this._oTimeoutResponse);
      }, TileCardExtension._DynamicTileRequestTimeout);
        // additonal timeout for the request to delay the request for one ms to be able to test above timeout.
        setTimeout(() => {
          try {
            // eslint-disable-next-line no-new
          new TileCardExtension._DynamicTileRequest(sResource,
            function (oData) {
              oLogger.debug("Dynamic tileCard request successful.", sResource);
              if (!bTimedOut) {
                resolve(
                  normalizeTileData(oData, sErrorText)
                );
              }
            },
            function () {
              oLogger.info("Dynamic tileCard request failed.", sResource);
              if (!bTimedOut) {
                resolve(this._oErrorResponse);
              }
            }
          );
        } catch (ex) {
          oLogger.error("Dynamic tileCard normalization failed.", ex);
          if (!bTimedOut) {
            resolve(this._oErrorResponse);
          }
        }
      }, 1);
    }.bind(this)).then(function (oData) {
      var oHeader = Core.byId(this.getCard().getDomRef().id).getCardHeader();
      // apply the title and subtitle directly to the header without a binding.
      // in most cases the title/subtitle is not coming from the data.
      // if we would bind it, the title/subtitle would only be shown after the data request.
      if (oData.title) {
        oHeader.setTitle(oData.title);
      }
      if (oData.subtitle) {
        oHeader.setSubtitle(oData.subtitle);
      }
      return new Response(
        new Blob(
          [JSON.stringify(oData)],
          { type: "application/json" }
        ),
        { status: 200 }
      );
    }.bind(this))
    .catch(function (ex) {
      return new Response(
        new Blob(
          ["{}"],
          { type: "application/json" }
        ),
        { status: 200 }
      );
    });
  };

  return TileCardExtension;
});
