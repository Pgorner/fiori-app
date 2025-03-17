/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["./SearchConfigurationSettings", "sap/base/Log", "./sinaNexTS/core/Log", "./navigationtrackers/CustomNavigationTracker", "./navigationtrackers/EventLoggerNavigationTracker", "sap/base/i18n/ResourceBundle", "sap/ui/core/format/NumberFormat", "sap/ui/core/format/DateFormat", "./i18n", "sap/base/i18n/Localization"], function (___SearchConfigurationSettings, Log, ___sinaNexTS_core_Log, ___navigationtrackers_CustomNavigationTracker, ___navigationtrackers_EventLoggerNavigationTracker, ResourceBundle, UI5NumberFormat, UI5DateFormat, __i18n, Localization) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const sinaParameters = ___SearchConfigurationSettings["sinaParameters"];
  const Severity = ___sinaNexTS_core_Log["Severity"];
  const generateCustomNavigationTracker = ___navigationtrackers_CustomNavigationTracker["generateCustomNavigationTracker"];
  const generateEventLoggerNavigationTracker = ___navigationtrackers_EventLoggerNavigationTracker["generateEventLoggerNavigationTracker"];
  const i18n = _interopRequireDefault(__i18n);
  class SinaConfigurator {
    model;
    loadedResourceBundles;
    constructor(model) {
      this.model = model;
      this.loadedResourceBundles = new Map();
    }
    configure(sinaConfigurations) {
      const resultSinaConfigurations = [];
      for (const sinaConfiguration of sinaConfigurations) {
        resultSinaConfigurations.push(this.configureSina(sinaConfiguration, {
          configureLogging: true,
          configureCommonParameters: true,
          configureNavigationTrackers: true,
          configureGetTextFromResourceBundle: true,
          configureFormatLibrary: true,
          configureGetText: true,
          configureLanguage: true
        }));
      }
      return resultSinaConfigurations;
    }
    configureSina(sinaConfiguration, configurationOptions) {
      sinaConfiguration = this.normalizeConfiguration(sinaConfiguration);
      if (configurationOptions.configureCommonParameters) {
        this.configureCommonParameters(sinaConfiguration);
      }
      if (configurationOptions.configureFormatLibrary) {
        this.configureFormatLibrary(sinaConfiguration);
      }
      if (configurationOptions.configureLogging) {
        this.configureLogging(sinaConfiguration);
      }
      if (configurationOptions.configureNavigationTrackers) {
        this.configureNavigationTracking(sinaConfiguration);
      }
      if (configurationOptions.configureGetTextFromResourceBundle) {
        this.configureGetTextFromResourceBundle(sinaConfiguration);
      }
      if (configurationOptions.configureGetText) {
        this.configureGetText(sinaConfiguration);
      }
      if (configurationOptions.configureLanguage) {
        this.configureLanguage(sinaConfiguration);
      }
      if (sinaConfiguration.subProviders) {
        sinaConfiguration.subProviders = sinaConfiguration.subProviders.map(subProviderConfiguration => this.configureSina(subProviderConfiguration, {
          configureNavigationTrackers: true
        }));
      }
      return sinaConfiguration;
    }
    normalizeConfiguration(sinaConfiguration) {
      if (typeof sinaConfiguration === "string") {
        return {
          provider: sinaConfiguration,
          url: ""
        };
      }
      return sinaConfiguration;
    }
    configureLanguage(sinaConfiguration) {
      if (this.model.config.isUshell && typeof sap.cf === "undefined") {
        // is ushell but not cFLP / workzone (which defines sap.cf global)
        // which does not have a sap-usercontext cookie to determine the users language
        // do nothing, language setting will be done by ushell
        return;
      }
      if (!sinaConfiguration.getLanguage) {
        const getLanguageFunction = () => Localization.getLanguage();
        sinaConfiguration["getLanguage"] = getLanguageFunction;
      }
    }
    configureNavigationTracking(sinaConfiguration) {
      sinaConfiguration.navigationTrackers = sinaConfiguration.navigationTrackers || [];
      sinaConfiguration.navigationTrackers.push(generateCustomNavigationTracker(this.model));
      sinaConfiguration.navigationTrackers.push(generateEventLoggerNavigationTracker(this.model));
    }
    configureCommonParameters(sinaConfiguration) {
      for (const parameterName of sinaParameters) {
        if (!sinaConfiguration[parameterName]) {
          sinaConfiguration[parameterName] = this.model.config[parameterName];
        }
      }
    }
    configureFormatLibrary(sinaConfiguration) {
      sinaConfiguration.NumberFormat = UI5NumberFormat;
      sinaConfiguration.DateFormat = UI5DateFormat;
    }
    configureLogging(sinaConfiguration) {
      const sinaUI5Log = Log.getLogger("sap.esh.search.ui.sina");
      // log target
      sinaConfiguration.logTarget = {
        debug: sinaUI5Log.debug,
        info: sinaUI5Log.info,
        warn: sinaUI5Log.warning,
        error: sinaUI5Log.error
      };
      // map UI5 loglevel to Sina loglevel:
      let sinaLogLevel = Severity.ERROR;
      switch (sinaUI5Log.getLevel()) {
        case Log.Level.ALL:
        case Log.Level.TRACE:
        case Log.Level.DEBUG:
          sinaLogLevel = Severity.DEBUG;
          break;
        case Log.Level.INFO:
          sinaLogLevel = Severity.INFO;
          break;
        case Log.Level.WARNING:
          sinaLogLevel = Severity.WARN;
          break;
      }
      sinaConfiguration.logLevel = sinaLogLevel;
    }
    configureGetTextFromResourceBundle(sinaConfiguration) {
      sinaConfiguration.getTextFromResourceBundle = async (url, key) => {
        let resourceBundle;
        if (this.loadedResourceBundles.has(url)) {
          resourceBundle = this.loadedResourceBundles.get(url);
        } else {
          resourceBundle = await ResourceBundle.create({
            url: url
          });
          this.loadedResourceBundles.set(url, resourceBundle);
        }
        return resourceBundle.getText(key);
      };
    }
    configureGetText(sinaConfiguration) {
      sinaConfiguration.getText = i18n.getText.bind(i18n);
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.SinaConfigurator = SinaConfigurator;
  return __exports;
});
})();