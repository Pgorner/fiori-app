/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/base/Log", "sap/cards/ap/common/services/RetrieveCard", "sap/m/MessageBox", "sap/ui/VersionInfo", "sap/ui/core/Fragment", "sap/ui/core/Lib", "sap/ui/model/resource/ResourceModel", "./app/CardGeneratorDialogController", "./helpers/ApplicationInfo", "./helpers/CardGeneratorModel", "./helpers/IntegrationCardHelper", "./odata/ODataUtils"], function (Log, sap_cards_ap_common_services_RetrieveCard, MessageBox, VersionInfo, Fragment, CoreLib, ResourceModel, ___app_CardGeneratorDialogController, ___helpers_ApplicationInfo, ___helpers_CardGeneratorModel, ___helpers_IntegrationCardHelper, ___odata_ODataUtils) {
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
  const initializeAsync = function (oAppComponent) {
    try {
      const oResourceBundle = CoreLib.getResourceBundleFor("sap.cards.ap.generator.i18n");
      const resourceModel = new ResourceModel({
        bundleUrl: oResourceBundle.oUrlInfo.url,
        bundle: oResourceBundle //Reuse created bundle to stop extra network calls
      });
      const applicationInfo = ApplicationInfo.createInstance(oAppComponent);
      return Promise.resolve(applicationInfo.validateCardGeneration()).then(function (bValidConfiguration) {
        if (!bValidConfiguration) {
          const warningMsg = resourceModel.getObject("GENERATE_CARD_NOT_SUPPORTED");
          MessageBox.warning(warningMsg, {
            actions: MessageBox.Action.OK,
            emphasizedAction: MessageBox.Action.OK
          });
          return;
        }
        if (!cardGeneratorDialog) {
          cardGeneratorDialog = Fragment.load({
            id: "cardGeneratorDialog",
            name: "sap.cards.ap.generator.app.CardGeneratorDialog",
            controller: CardGeneratorDialogController
          });
        }
        let mCardManifest;
        return Promise.resolve(VersionInfo.load({
          library: "sap.ui.core"
        })).then(function (sapCoreVersionInfo) {
          function _temp2() {
            return Promise.resolve(getCardGeneratorDialogModel(oAppComponent, mCardManifest)).then(function (dialogModel) {
              cardGeneratorDialog.then(function (oDialog) {
                try {
                  const mManifest = oAppComponent.getManifest();
                  const cardTitle = mManifest["sap.app"].title;
                  const cardSubtitle = mManifest["sap.app"].description;
                  const sapAppId = mManifest["sap.app"].id;
                  const oAppModel = oAppComponent.getModel();
                  if (!oAppModel) {
                    throw new Error("No model found in the view");
                  }
                  const {
                    odataModel,
                    serviceUrl,
                    entitySet,
                    entitySetWithObjectContext
                  } = applicationInfo.fetchDetails();
                  const bODataV4 = odataModel === ODataModelVersion.V4;
                  const sServiceUrl = serviceUrl;
                  const entitySetName = entitySet;
                  return Promise.resolve(createPathWithEntityContext(entitySetWithObjectContext, oAppModel, bODataV4)).then(function (path) {
                    const mIntegrationCardManifest = updateExistingCardManifest(mCardManifest, dialogModel.getProperty("/configuration/$data")) || createInitialManifest({
                      title: cardTitle,
                      subTitle: cardSubtitle,
                      service: sServiceUrl,
                      entitySet: path,
                      serviceModel: oAppModel,
                      sapAppId: sapAppId,
                      sapCoreVersionInfo,
                      entitySetName,
                      data: dialogModel.getProperty("/configuration/$data")
                    });
                    if (!oDialog.getModel("i18n")) {
                      oDialog.setModel(resourceModel, "i18n");
                    }
                    renderCardPreview(mIntegrationCardManifest);
                    oDialog.setModel(dialogModel);
                    CardGeneratorDialogController.initialize(oAppComponent, oDialog, entitySetName);
                    oDialog.open();
                    const element = document.getElementById("cardGeneratorDialog--contentSplitter");
                    if (element) {
                      element.style.backgroundColor = "#f8f8f8";
                    }
                    return oDialog;
                  });
                } catch (e) {
                  return Promise.reject(e);
                }
              }).catch(function (oError) {
                Log.error("Error while loading or initializing the dialog:", oError);
              });
            });
          }
          const _temp = _catch(function () {
            return Promise.resolve(getObjectPageCardManifestForPreview(oAppComponent, {
              cardType: CardTypes.INTEGRATION,
              includeActions: false,
              hideActions: false,
              isDesignMode: true
            })).then(function (_getObjectPageCardMan) {
              mCardManifest = _getObjectPageCardMan;
            });
          }, function () {
            Log.error("Error while fetching the card manifest.");
          });
          return _temp && _temp.then ? _temp.then(_temp2) : _temp2(_temp);
        });
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
  const getObjectPageCardManifestForPreview = sap_cards_ap_common_services_RetrieveCard["getObjectPageCardManifestForPreview"];
  const CardGeneratorDialogController = ___app_CardGeneratorDialogController["CardGeneratorDialogController"];
  const ApplicationInfo = ___helpers_ApplicationInfo["ApplicationInfo"];
  const ODataModelVersion = ___helpers_ApplicationInfo["ODataModelVersion"];
  const getCardGeneratorDialogModel = ___helpers_CardGeneratorModel["getCardGeneratorDialogModel"];
  const createInitialManifest = ___helpers_IntegrationCardHelper["createInitialManifest"];
  const renderCardPreview = ___helpers_IntegrationCardHelper["renderCardPreview"];
  const updateExistingCardManifest = ___helpers_IntegrationCardHelper["updateExistingCardManifest"];
  const createPathWithEntityContext = ___odata_ODataUtils["createPathWithEntityContext"];
  var CardTypes = /*#__PURE__*/function (CardTypes) {
    CardTypes["INTEGRATION"] = "integration";
    CardTypes["ADAPTIVE"] = "adaptive";
    return CardTypes;
  }(CardTypes || {});
  let cardGeneratorDialog;
  var __exports = {
    __esModule: true
  };
  __exports.initializeAsync = initializeAsync;
  return __exports;
});
//# sourceMappingURL=CardGenerator-dbg-dbg.js.map
