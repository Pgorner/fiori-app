/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../i18n"], function (__i18n) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const i18n = _interopRequireDefault(__i18n);
  class ESHUIError extends Error {
    name;
    message;
    details;
    previous;
    solution;
    constructor(propertiesOrMessage) {
      if (typeof propertiesOrMessage === "string") {
        propertiesOrMessage = {
          message: propertiesOrMessage
        };
      }
      super(propertiesOrMessage.message);
      if (propertiesOrMessage.message) {
        this.message = propertiesOrMessage.message;
      }
      if (propertiesOrMessage.details) {
        this.details = propertiesOrMessage.details;
      }
      if (propertiesOrMessage.previous) {
        this.previous = propertiesOrMessage.previous;
      }
      this.name = propertiesOrMessage.name || "ESHUIError";
      this.solution = propertiesOrMessage.solution;
    }
  }
  class ESHUIConstructionError extends ESHUIError {
    constructor(previousError) {
      const name = "ESHUIConstructionError";
      const message = i18n.getText("error.ESHUIConstructionError.message");
      super({
        name,
        message,
        previous: previousError
      });
    }
  }
  class ConfigurationExitError extends ESHUIError {
    constructor(customerExitName, applicationComponent, previousError) {
      const name = i18n.getText("error.ConfigurationExitError.title");
      const message = i18n.getText("error.ConfigurationExitError.message", [customerExitName]);
      const solution = i18n.getText("error.ConfigurationExitError.solution", [applicationComponent]);
      super({
        name,
        message,
        solution,
        previous: previousError
      });
    }
  }
  class UnknownDataSourceType extends ESHUIError {
    constructor(previousError) {
      const name = "UnknownDataSourceType";
      const message = i18n.getText("error.UnknownDataSourceType.message");
      const solution = i18n.getText("error.UnknownDataSourceType.solution");
      super({
        name,
        message,
        solution,
        previous: previousError
      });
    }
  }
  class UnknownFacetType extends ESHUIError {
    constructor(previousError) {
      const name = "UnknownFacetType";
      const message = i18n.getText("error.UnknownFacetType.message");
      const solution = i18n.getText("error.UnknownFacetType.solution");
      super({
        name,
        message,
        solution,
        previous: previousError
      });
    }
  }
  class ProgramError extends ESHUIError {
    constructor(previousError, message) {
      const name = "ProgramError";
      const solution = i18n.getText("error.TypeError.solution");
      super({
        name,
        message: message || i18n.getText("error.TypeError.message"),
        solution,
        previous: previousError
      });
    }
  }
  class AppSearchError extends ESHUIError {
    constructor(previousError, message) {
      const name = "AppSearchError";
      const solution = i18n.getText("error.AppSearchError.solution");
      super({
        name,
        message: message || i18n.getText("error.AppSearchError.message"),
        solution,
        previous: previousError
      });
    }
  }
  class AppSearchSearchTermExceedsLimitsError extends ESHUIError {
    constructor(searchTermLimit) {
      const name = "AppSearchSearchTermExceedsLimitsError";
      super({
        name,
        message: i18n.getText("error.AppSearchSearchTermExceedsLimitsError.message", [searchTermLimit])
      });
    }
  }
  class RequestTooLargeError extends ESHUIError {
    constructor(previousError, message) {
      const name = "RequestTooLargeError";
      const solution = i18n.getText("error.RequestTooLargeError.solution");
      super({
        name,
        message: message || i18n.getText("error.RequestTooLargeError.message"),
        solution,
        previous: previousError
      });
    }
  }
  class UrlParseError extends ESHUIError {
    constructor(previousError, message) {
      super({
        name: "UrlParseError",
        message: message || i18n.getText("error.UrlParseError.message"),
        solution: i18n.getText("error.UrlParseError.solution"),
        previous: previousError
      });
    }
  }
  class SearchTermExceedsLimitsError extends ESHUIError {
    constructor(searchTermLimit) {
      super({
        name: "SearchTermExceedsLimitError",
        message: i18n.getText("error.SearchTermExceedsLimitError.message", [searchTermLimit])
      });
    }
  }
  const module = {
    ESHUIConstructionError,
    ConfigurationExitError,
    UnknownDataSourceType,
    UnknownFacetType,
    ProgramError
  };
  module.ESHUIError = ESHUIError;
  module.AppSearchError = AppSearchError;
  module.AppSearchSearchTermExceedsLimitsError = AppSearchSearchTermExceedsLimitsError;
  module.RequestTooLargeError = RequestTooLargeError;
  module.UrlParseError = UrlParseError;
  module.SearchTermExceedsLimitsError = SearchTermExceedsLimitsError;
  return module;
});
})();