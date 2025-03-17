/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/cards/ap/common/adaptiveCards/AdaptiveCardRenderer", "sap/cards/ap/transpiler/cardTranspiler/Transpile", "sap/ui/core/Element", "../odata/ODataUtils"], function (sap_cards_ap_common_adaptiveCards_AdaptiveCardRenderer, sap_cards_ap_transpiler_cardTranspiler_Transpile, CoreElement, ODataUtils) {
  "use strict";

  const getAdaptiveCardForRendering = sap_cards_ap_common_adaptiveCards_AdaptiveCardRenderer["getAdaptiveCardForRendering"];
  const convertIntegrationCardToAdaptive = sap_cards_ap_transpiler_cardTranspiler_Transpile["convertIntegrationCardToAdaptive"];
  /**
   * Transpiles an Integration Card into an Adaptive Card.
   *
   * @param {JSONModel} oDialogModel - The Integration Card to transpile.
   * @returns {AdaptiveCard} The resulting Adaptive Card.
   * @throws {TranspilationError} If the Integration Card cannot be transpiled.
   */
  function transpileIntegrationCardToAdaptive(oDialogModel) {
    const oCard = CoreElement.getElementById("cardGeneratorDialog--cardPreview");
    const oManifest = oCard.getManifest();
    const keyParameters = oDialogModel.getProperty("/configuration/keyParameters");
    const appIntent = oDialogModel.getProperty("/configuration/appIntent");
    const oAdaptiveCardManifest = convertIntegrationCardToAdaptive(oManifest, appIntent, keyParameters);
    const adaptiveCardData = Object.assign({}, oDialogModel.getProperty("/configuration/$data"));
    const properties = oDialogModel.getProperty("/configuration/properties");
    properties.forEach(function (property) {
      if (property?.isDate && adaptiveCardData[property?.name] && typeof adaptiveCardData[property?.name] === "object") {
        const dateValue = adaptiveCardData[property?.name];
        adaptiveCardData[property?.name] = dateValue?.toISOString() ? dateValue?.toISOString() : adaptiveCardData[property?.name];
      }
    });
    iterateObject(adaptiveCardData);
    oAdaptiveCardManifest.$data = adaptiveCardData;
    const sHostConfig = CoreElement.getElementById("cardGeneratorDialog--preview-select").getSelectedItem().getBindingContext("previewOptions").getProperty("hostConfig");
    let renderedCard;
    if (sHostConfig) {
      renderedCard = getAdaptiveCardForRendering(sHostConfig, oAdaptiveCardManifest);
    }
    const adaptiveCardPreview = document.querySelector("#adaptiveCardPreview");
    if (adaptiveCardPreview && renderedCard) {
      setTimeout(function () {
        adaptiveCardPreview.innerHTML = "";
        updateEmptyStrings(renderedCard);
        adaptiveCardPreview.appendChild(renderedCard);
      });
    }
  }

  /**
   * Function to update &minus; strings in the rendered card textblock to '-'
   * as JS Engine will not understand &minus; and will not render it to '-'.
   *
   * @param renderedCard
   */
  function updateEmptyStrings(renderedCard) {
    const nodeList = renderedCard.querySelectorAll(".ac-textBlock");
    const nodeArray = Array.from(nodeList);
    nodeArray.forEach(node => {
      if (node.textContent?.includes("&minus;")) {
        node.textContent = "-";
      }
    });
  }

  /**
   * Iterates over the properties of the given adaptive card data object and processes each key.
   *
   * @param {AdaptiveCardData} adaptiveCardData - The adaptive card data object to iterate over.
   * @returns {void}
   */
  function iterateObject(adaptiveCardData) {
    for (const key in adaptiveCardData) {
      if (adaptiveCardData.hasOwnProperty(key)) {
        processKey(adaptiveCardData, key);
      }
    }
  }

  /**
   * Processes a key in the adaptive card data object. If the value associated with the key is an object
   * and has a valid EDM type, it converts the value to an ISO string if possible. It also recursively
   * iterates over the object if the value is an object.
   *
   * @param {AdaptiveCardData} adaptiveCardData - The adaptive card data object containing the key to process.
   * @param {string} key - The key in the adaptive card data object to process.
   */
  function processKey(adaptiveCardData, key) {
    const value = adaptiveCardData[key];
    if (typeof value === 'object' && value !== null) {
      if (ODataUtils.isPropertyTypeDate(value?.__edmType)) {
        adaptiveCardData[key] = value?.toISOString ? value.toISOString() : value;
      }
      iterateObject(value);
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.transpileIntegrationCardToAdaptive = transpileIntegrationCardToAdaptive;
  return __exports;
});
//# sourceMappingURL=Transpiler-dbg-dbg.js.map
