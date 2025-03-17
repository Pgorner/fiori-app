/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["./sinaNexTS/providers/multi/FederationType", "./sinaNexTS/sina/SinaConfiguration"], function (___sinaNexTS_providers_multi_FederationType, ___sinaNexTS_sina_SinaConfiguration) {
  "use strict";

  const FederationType = ___sinaNexTS_providers_multi_FederationType["FederationType"];
  const AvailableProviders = ___sinaNexTS_sina_SinaConfiguration["AvailableProviders"];
  async function readCFlpConfiguration(sinaConfigurations) {
    if (!sap || !sap.cf) {
      return Promise.resolve(sinaConfigurations); // -> not active -> do nothing
    }

    // read content providers from cflp configuration
    const service = await window.sap.ushell.Container.getServiceAsync("CommonDataModel");
    const oApplications = await service.getApplications();

    // extract content provider ids
    const oContentProviders = Object.keys(oApplications).reduce(function (o, sApplicationKey) {
      const oApplication = oApplications[sApplicationKey];
      const sContentProviderId = oApplication["sap.app"] && oApplication["sap.app"].contentProviderId;
      if (sContentProviderId) {
        o[sContentProviderId] = true;
      }
      return o;
    }, {});
    const contentProviderIds = Object.keys(oContentProviders);

    // create sina provider configuration
    const promises = [];
    for (let i = 0; i < contentProviderIds.length; ++i) {
      const contentProviderId = contentProviderIds[i];
      promises.push(createContentProviderSinaConfiguration(contentProviderId));
    }
    let subSinaProviderConfigurations = await Promise.all(promises);
    if (!subSinaProviderConfigurations || subSinaProviderConfigurations.length === 0) {
      // fallback if configuration is empty
      return sinaConfigurations;
    } else {
      // assemble multi provider configuration
      subSinaProviderConfigurations = subSinaProviderConfigurations.filter(function (elem) {
        if (typeof elem !== "undefined") {
          return elem;
        }
      });
      return [{
        provider: AvailableProviders.MULTI,
        subProviders: subSinaProviderConfigurations,
        federationType: FederationType.advanced_round_robin,
        url: "" // not relevant for multi provider
      }, AvailableProviders.DUMMY];
    }
  }
  async function createContentProviderSinaConfiguration(contentProviderId) {
    const service = await window.sap.ushell.Container.getServiceAsync("ClientSideTargetResolution");
    const oSystemContext = await service.getSystemContext(contentProviderId);

    // uncoment for cflp jade dev env:
    /*const fixProtocol = {
        enable: async function () {
            this.ctr = await (function () {
                return new Promise((resolve) => {
                    sap.ui.require(
                        ["sap/ushell/services/ClientSideTargetResolution/SystemContext"],
                        function (ctr) {
                            resolve(ctr);
                        }
                    );
                });
            })();
            this._getProtocol = this.ctr._getProtocol;
            this.ctr._getProtocol = () => "https";
        },
        disable: function () {
            this.ctr._getProtocol = this._getProtocol;
        },
    };
    await fixProtocol.enable();*/

    const sRequestUrlForAppRouter = oSystemContext.getFullyQualifiedXhrUrl("sap/opu/odata/sap/ESH_SEARCH_SRV");
    const sinaProviderType = oSystemContext.getProperty("esearch.provider");
    if (!sinaProviderType) {
      // destination of this content provider has no launchpad.esearch.provider property
      // -> not relevant for search
      return;
    }
    return {
      contentProviderId,
      provider: sinaProviderType.toLowerCase(),
      label: contentProviderId,
      url: sRequestUrlForAppRouter
    };
  }
  var __exports = {
    __esModule: true
  };
  __exports.readCFlpConfiguration = readCFlpConfiguration;
  return __exports;
});
})();