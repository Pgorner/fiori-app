/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["../sina/i18n"], function (___sina_i18n) {
  "use strict";

  const getText = ___sina_i18n["getText"]; // =========================================================================
  // Base Exception Class
  // =========================================================================
  class SinaError extends Error {
    message;
    details;
    solution;
    context;
    //stack: string; // remove stack here because it is base class defined
    name;
    previous;
    constructor(properties) {
      super(properties.message);
      this.message = properties.message;
      this.details = properties?.details;
      this.solution = properties.solution;
      this.context = properties?.context;
      this.name = properties.name ?? "SinaError";
      this.previous = properties.previous;
    }
    toString() {
      return this.name + ": " + this.message;
    }
  }

  // =========================================================================
  // List of all Sina Exceptions
  // =========================================================================

  class InternalSinaError extends SinaError {
    constructor(props) {
      const properties = {
        name: "InternalSinaError",
        message: props.message ?? getText("error.sina.InternalSinaError"),
        details: props.details,
        previous: props.previous
      };
      super(properties);
    }
  }
  var ServerErrorCode = /*#__PURE__*/function (ServerErrorCode) {
    ServerErrorCode["E001"] = "E001";
    ServerErrorCode["E100"] = "E100";
    ServerErrorCode["E101"] = "E101";
    ServerErrorCode["E102"] = "E102";
    ServerErrorCode["E200"] = "E200";
    ServerErrorCode["E201"] = "E201";
    ServerErrorCode["E202"] = "E202";
    ServerErrorCode["E203"] = "E203";
    ServerErrorCode["E300"] = "E300";
    ServerErrorCode["E400"] = "E400";
    return ServerErrorCode;
  }(ServerErrorCode || {}); // Duplicate search result list items
  class ServerError extends SinaError {
    code;
    dataSourceErrors;
    request;
    response;
    resultSet;
    constructor(properties) {
      super({
        name: "ServerError",
        message: properties.message,
        details: properties.details,
        previous: properties.previous
      });
      this.code = properties.code;
      this.dataSourceErrors = properties.dataSourceErrors;
      this.request = properties.request;
      this.response = properties.response;
    }
  }
  class NoConnectionError extends SinaError {
    constructor(url) {
      super({
        name: "NoConnectionError",
        message: getText("error.sina.NoConnectionError", [url])
      });
    }
  }
  class LanguageHeaderError extends SinaError {
    constructor(props) {
      super({
        name: "LanguageHeaderError",
        message: props.message || getText("errr.sina.LanguageHeaderError"),
        details: props.details,
        previous: props.previous
      });
    }
  }
  class NoJSONDateError extends SinaError {
    constructor(message) {
      const properties = {
        name: "NoJSONDateError",
        message: message ?? getText("error.sina.NoJSONDateError")
      };
      super(properties);
    }
  }
  class TimeOutError extends SinaError {
    constructor(message) {
      const properties = {
        name: "TimeOutError",
        message: message ?? getText("error.sina.TimeOutError")
      };
      super(properties);
    }
  }
  class NotImplementedError extends SinaError {
    constructor() {
      super({
        message: "Not implemented",
        name: "ESHNotImplementedError"
      });
    }
  }
  class ForcedBySearchTermTestError extends SinaError {
    static forcedBySearchTerm = "EshForceErrorSearchterm";
    constructor() {
      const properties = {
        name: "ForcedBySearchTermTestError",
        message: `Forced error, triggered by search term '${ForcedBySearchTermTestError.forcedBySearchTerm}'.`
      };
      super(properties);
    }
  }
  class UnknownAttributeTypeError extends SinaError {
    constructor(attributeType, previous) {
      const properties = {
        name: "UnknownAttributeTypeError",
        message: getText("error.sina.UnknownAttributeTypeError", [attributeType]),
        previous
      };
      super(properties);
    }
  }
  class JSONParseError extends SinaError {
    constructor(message, previous) {
      const properties = {
        name: "JSONParseError",
        message: message ?? getText("error.sina.JSONParseError"),
        previous
      };
      super(properties);
    }
  }
  class MetadataParserError extends SinaError {
    constructor(message, previous) {
      const properties = {
        name: "MetadataParserError",
        message: message ?? getText("error.sina.MetadataParserError"),
        previous
      };
      super(properties);
    }
  }
  class UnknownComparisonOperatorError extends SinaError {
    constructor(operator) {
      const properties = {
        name: "UnknownComparisonOperatorError",
        message: getText("error.sina.UnknownComparisonOperatorError", [operator])
      };
      super(properties);
    }
  }
  class UnknownLogicalOperatorError extends SinaError {
    constructor(operator) {
      const properties = {
        name: "UnknownLogicalOperatorError",
        message: getText("error.sina.UnknownLogicalOperatorError", [operator])
      };
      super(properties);
    }
  }
  class UnknownPresentationUsageError extends SinaError {
    constructor(presentationUsage) {
      const properties = {
        name: "UnknownPresentationUsageError",
        message: getText("error.sina.UnknownPresentationUsageError", [presentationUsage])
      };
      super(properties);
    }
  }
  class UnknownDataTypeError extends SinaError {
    constructor(dataType) {
      const properties = {
        name: "UnknownDataTypeError",
        message: getText("error.sina.UnknownDataTypeError", [dataType])
      };
      super(properties);
    }
  }
  class UnknownConditionTypeError extends SinaError {
    constructor(conditionType) {
      const properties = {
        name: "UnknownConditionTypeError",
        message: getText("error.sina.UnknownConditionTypeError", [conditionType])
      };
      super(properties);
    }
  }
  class OnlyComplexConditionAllowedError extends SinaError {
    constructor() {
      const properties = {
        name: "OnlyComplexConditionAllowedError",
        message: getText("error.sina.OnlyComplexConditionAllowedError")
      };
      super(properties);
    }
  }
  class ResponseFormatError extends SinaError {
    constructor(previous, expectedResponseDataFormat, responseData) {
      let detectedformat = "undetected";
      if (responseData?.startsWith("<html") || responseData?.startsWith("<HTML")) {
        detectedformat = "HTML";
      } else if (responseData?.startsWith("<?xml") || responseData?.startsWith("<?XML")) {
        detectedformat = "XML";
      }
      const properties = {
        name: "ResponseFormatError",
        message: getText("error.sina.ResponseFormatError", [expectedResponseDataFormat, detectedformat, responseData.substring(0, 25)]),
        previous: previous
      };
      super(properties);
    }
  }
  class ESHNotActiveError extends SinaError {
    constructor(message) {
      const properties = {
        name: "ESHNotActiveError",
        message: message ?? getText("error.sina.ESHNotActiveError")
      };
      super(properties);
    }
  }
  class ESHNoBusinessObjectDatasourceError extends SinaError {
    constructor(message) {
      const properties = {
        name: "ESHNoBusinessObjectDatasourceError",
        message: message ?? getText("error.sina.ESHNoBusinessObjectDatasourceError")
      };
      super(properties);
    }
  }
  class FacetsParseError extends SinaError {
    constructor(message) {
      const properties = {
        name: "FacetsParseError",
        message: message ?? getText("error.sina.FacetsParseError")
      };
      super(properties);
    }
  }
  class WhyFoundAttributeMetadataMissingError extends SinaError {
    constructor(attributeId) {
      const properties = {
        name: "WhyFoundAttributeMetadataMissingError",
        message: getText("error.sina.WhyFoundAttributeMetadataMissingError", [attributeId])
      };
      super(properties);
    }
  }
  class TimeConversionError extends SinaError {
    constructor(value) {
      const properties = {
        name: "TimeConversionError",
        message: getText("error.sina.TimeConversionError", [value])
      };
      super(properties);
    }
  }
  class DateConversionError extends SinaError {
    constructor(value) {
      const properties = {
        name: "DateConversionError",
        message: getText("error.sina.DateConversionError", [value])
      };
      super(properties);
    }
  }
  class CanOnlyAutoInsertComplexConditionError extends SinaError {
    constructor() {
      const properties = {
        name: "CanOnlyAutoInsertComplexConditionError",
        message: getText("error.sina.CanOnlyAutoInsertComplexConditionError")
      };
      super(properties);
    }
  }
  class CanNotCreateAlreadyExistingDataSourceError extends SinaError {
    constructor(dataSourceId) {
      const properties = {
        name: "CanNotCreateAlreadyExistingDataSourceError",
        message: getText("error.sina.CanNotCreateAlreadyExistingDataSourceError", [dataSourceId])
      };
      super(properties);
    }
  }
  class DataSourceInURLDoesNotExistError extends SinaError {
    constructor(dataSourceId) {
      const properties = {
        name: "DataSourceInURLDoesNotExistError",
        message: getText("error.sina.DataSourceInURLDoesNotExistError", [dataSourceId])
      };
      super(properties);
    }
  }
  class DataSourceAttributeMetadataNotFoundError extends SinaError {
    constructor(attributeId, dataSourceId) {
      const properties = {
        name: "DataSourceAttributeMetadataNotFoundError",
        message: getText("error.sina.DataSourceAttributeMetadataNotFoundError.message", [attributeId, dataSourceId]),
        solution: getText("error.sina.DataSourceAttributeMetadataNotFoundError.solution")
      };
      super(properties);
    }
  }
  class NoValidEnterpriseSearchAPIConfigurationFoundError extends SinaError {
    constructor(providersTried, err) {
      const properties = {
        name: "NoValidEnterpriseSearchAPIConfigurationFoundError",
        message: getText("error.sina.NoValidEnterpriseSearchAPIConfigurationFoundError.error", [providersTried]),
        solution: getText("error.sina.NoValidEnterpriseSearchAPIConfigurationFoundError.solution")
      };
      if (err) {
        properties.previous = err;
      }
      super(properties);
    }
  }
  class SinaConfigurationError extends SinaError {
    constructor(functionName, err) {
      const properties = {
        name: "SinaConfigurationError",
        message: getText("error.sina.SinaConfigurationError", [functionName]),
        previous: err
      };
      super(properties);
    }
  }
  class QueryIsReadOnlyError extends SinaError {
    constructor() {
      const properties = {
        name: "QueryIsReadOnlyError",
        message: getText("error.sina.QueryIsReadOnlyError")
      };
      super(properties);
    }
  }
  class InBetweenConditionInConsistent extends SinaError {
    constructor(message) {
      const properties = {
        name: "InBetweenConditionInConsistent",
        message: message ?? getText("error.sina.InBetweenConditionInConsistent.message"),
        solution: getText("error.sina.InBetweenConditionInConsistent.solution")
      };
      super(properties);
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.SinaError = SinaError;
  __exports.InternalSinaError = InternalSinaError;
  __exports.ServerErrorCode = ServerErrorCode;
  __exports.ServerError = ServerError;
  __exports.NoConnectionError = NoConnectionError;
  __exports.LanguageHeaderError = LanguageHeaderError;
  __exports.NoJSONDateError = NoJSONDateError;
  __exports.TimeOutError = TimeOutError;
  __exports.NotImplementedError = NotImplementedError;
  __exports.ForcedBySearchTermTestError = ForcedBySearchTermTestError;
  __exports.UnknownAttributeTypeError = UnknownAttributeTypeError;
  __exports.JSONParseError = JSONParseError;
  __exports.MetadataParserError = MetadataParserError;
  __exports.UnknownComparisonOperatorError = UnknownComparisonOperatorError;
  __exports.UnknownLogicalOperatorError = UnknownLogicalOperatorError;
  __exports.UnknownPresentationUsageError = UnknownPresentationUsageError;
  __exports.UnknownDataTypeError = UnknownDataTypeError;
  __exports.UnknownConditionTypeError = UnknownConditionTypeError;
  __exports.OnlyComplexConditionAllowedError = OnlyComplexConditionAllowedError;
  __exports.ResponseFormatError = ResponseFormatError;
  __exports.ESHNotActiveError = ESHNotActiveError;
  __exports.ESHNoBusinessObjectDatasourceError = ESHNoBusinessObjectDatasourceError;
  __exports.FacetsParseError = FacetsParseError;
  __exports.WhyFoundAttributeMetadataMissingError = WhyFoundAttributeMetadataMissingError;
  __exports.TimeConversionError = TimeConversionError;
  __exports.DateConversionError = DateConversionError;
  __exports.CanOnlyAutoInsertComplexConditionError = CanOnlyAutoInsertComplexConditionError;
  __exports.CanNotCreateAlreadyExistingDataSourceError = CanNotCreateAlreadyExistingDataSourceError;
  __exports.DataSourceInURLDoesNotExistError = DataSourceInURLDoesNotExistError;
  __exports.DataSourceAttributeMetadataNotFoundError = DataSourceAttributeMetadataNotFoundError;
  __exports.NoValidEnterpriseSearchAPIConfigurationFoundError = NoValidEnterpriseSearchAPIConfigurationFoundError;
  __exports.SinaConfigurationError = SinaConfigurationError;
  __exports.QueryIsReadOnlyError = QueryIsReadOnlyError;
  __exports.InBetweenConditionInConsistent = InBetweenConditionInConsistent;
  return __exports;
});
})();