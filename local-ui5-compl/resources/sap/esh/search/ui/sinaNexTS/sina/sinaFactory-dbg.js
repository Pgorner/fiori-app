/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../core/util", "./Sina", "../providers/abap_odata/Provider", "../providers/hana_odata/Provider", "../providers/sample/Provider", "../providers/inav2/Provider", "../providers/dummy/Provider", "../providers/multi/Provider", "../core/Log", "../core/errors", "./SinaConfiguration", "./i18n"], function (util, ___Sina, ___providers_abap_odata_Provider, ___providers_hana_odata_Provider, ___providers_sample_Provider, ___providers_inav2_Provider, ___providers_dummy_Provider, ___providers_multi_Provider, sinaLog, ___core_errors, ___SinaConfiguration, ___i18n) {
  "use strict";

  const Sina = ___Sina["Sina"];
  const ABAPODataProvider = ___providers_abap_odata_Provider["Provider"];
  const HANAODataProvider = ___providers_hana_odata_Provider["Provider"];
  const SampleProvider = ___providers_sample_Provider["Provider"];
  const INAV2Provider = ___providers_inav2_Provider["Provider"];
  const DummyProvider = ___providers_dummy_Provider["Provider"];
  const MultiProvider = ___providers_multi_Provider["MultiProvider"];
  const NoValidEnterpriseSearchAPIConfigurationFoundError = ___core_errors["NoValidEnterpriseSearchAPIConfigurationFoundError"];
  const AvailableProviders = ___SinaConfiguration["AvailableProviders"];
  const _normalizeConfiguration = ___SinaConfiguration["_normalizeConfiguration"];
  const injectGetText = ___i18n["injectGetText"];
  if (typeof process !== "undefined" && process.env && process.env.NODE_ENV && process.env.NODE_ENV === "debug") {
    const logTest = new sinaLog.Log();
    sinaLog.Log.level = sinaLog.Severity.DEBUG;
    logTest.debug("SINA log level set to debug!");
  }
  async function createAsync(configuration) {
    const normalizedConfiguration = await _normalizeConfiguration(configuration);
    if (normalizedConfiguration.getText) {
      injectGetText(normalizedConfiguration.getText);
    }
    if (normalizedConfiguration.logTarget) {
      sinaLog.Log.persistency = normalizedConfiguration.logTarget;
    }
    if (typeof normalizedConfiguration.logLevel !== "undefined") {
      sinaLog.Log.level = normalizedConfiguration.logLevel;
    }
    const log = new sinaLog.Log("sinaFactory");
    log.debug("Creating new sina (esh client) instance using provider " + normalizedConfiguration.provider);
    let providerInstance;
    switch (normalizedConfiguration.provider) {
      case AvailableProviders.HANA_ODATA:
        {
          providerInstance = new HANAODataProvider();
          break;
        }
      case AvailableProviders.ABAP_ODATA:
        {
          providerInstance = new ABAPODataProvider();
          break;
        }
      case AvailableProviders.INAV2:
        {
          providerInstance = new INAV2Provider();
          break;
        }
      case AvailableProviders.MULTI:
        {
          providerInstance = new MultiProvider();
          break;
        }
      case AvailableProviders.SAMPLE:
        {
          providerInstance = new SampleProvider();
          break;
        }
      case AvailableProviders.DUMMY:
        {
          providerInstance = new DummyProvider();
          break;
        }
      default:
        {
          throw new Error("Unknown Provider: '" + normalizedConfiguration.provider + "' - Available Providers: " + AvailableProviders.HANA_ODATA + ", " + AvailableProviders.ABAP_ODATA + ", " + AvailableProviders.INAV2 + ", " + AvailableProviders.MULTI + ", " + AvailableProviders.SAMPLE + ", " + AvailableProviders.DUMMY);
        }
    }
    const sina = new Sina(providerInstance);
    await sina.initAsync(normalizedConfiguration);
    return sina;
  }
  function createByTrialAsync(inputConfigurations, checkSuccessCallback) {
    let configurations;

    // normalize configurations
    return Promise.all(inputConfigurations.map(_normalizeConfiguration.bind(this))).then(function (normalizedConfigurations) {
      // mixin url configuration into configurations
      configurations = normalizedConfigurations;
      return _mixinUrlConfiguration(configurations);
    }.bind(this)).then(function () {
      // recursive creation of sina by loop at configurations
      // (first configuration which successfully creates sina wins)
      return _createSinaRecursively(configurations, checkSuccessCallback);
    }.bind(this));
  }
  async function _readConfigurationFromUrl() {
    const sinaConfiguration = util.getUrlParameter("sinaConfiguration");
    if (sinaConfiguration) {
      return _normalizeConfiguration(sinaConfiguration);
    }
    const sinaProvider = util.getUrlParameter("sinaProvider");
    if (sinaProvider) {
      return _normalizeConfiguration(sinaProvider);
    }
    return Promise.resolve();
  }
  async function _createSinaRecursively(configurations, checkSuccessCallback) {
    const log = new sinaLog.Log("sinaFactory");
    const errors = [];
    // set default for checkSuccesCallback
    checkSuccessCallback = checkSuccessCallback || function () {
      return true;
    };
    const providersTried = [];
    // helper for recursion
    const doCreate = function (index) {
      if (index >= configurations.length) {
        let finalError;
        if (errors.length >= 1) {
          // display error of last sina config (this is what at least shall work)
          // - FLP:     ABAP OData and INA are failing -> at least app-search shall work
          // - DWC/SAC: Only one config -> shalll work
          finalError = new NoValidEnterpriseSearchAPIConfigurationFoundError(providersTried.join(", "), errors[errors.length - 1].error);
        } else {
          // no error details/previous (fallback, not expected)
          finalError = new NoValidEnterpriseSearchAPIConfigurationFoundError(providersTried.join(", "));
        }
        return Promise.reject(finalError);
      }
      const configuration = configurations[index];
      providersTried.push(configuration.provider);
      return createAsync(configuration).then(function (sina) {
        if (checkSuccessCallback(sina)) {
          return sina;
        }
        return doCreate(index + 1);
      }, function (error) {
        log.info(error);
        errors.push({
          index: index,
          error: error
        });
        return doCreate(index + 1);
      });
    }.bind(this);

    // start recursion
    return doCreate(0);
  }
  async function _mixinUrlConfiguration(configurations) {
    const configurationFromUrl = await _readConfigurationFromUrl();
    if (!configurationFromUrl) {
      return;
    }
    if (configurations.length === 1) {
      // 1) just merge url configuration into configuration
      _mergeConfiguration(configurations[0], configurationFromUrl);
      return;
    } else {
      // 2) use url configuration also for filtering (legacy: useful for forcing flp to use inav2 for a abap system which offers abap_odata and inav2)
      let found = false;
      for (let i = 0; i < configurations.length; ++i) {
        const configuration = configurations[i];

        // ignore dummy provider
        if (configuration.provider === AvailableProviders.DUMMY) {
          continue;
        }

        // remove not matching providers
        if (configuration.provider !== configurationFromUrl.provider) {
          configurations.splice(i, 1);
          i--;
          continue;
        }

        // merge ulr configuration into configuration
        found = true;
        _mergeConfiguration(configuration, configurationFromUrl);
      }
      if (!found) {
        configurations.splice(0, 0, configurationFromUrl);
      }
    }
  }
  function _mergeConfiguration(configuration1, configuration2) {
    // TODO: deep merge
    for (const property in configuration2) {
      configuration1[property] = configuration2[property];
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.createAsync = createAsync;
  __exports.createByTrialAsync = createByTrialAsync;
  return __exports;
});
})();