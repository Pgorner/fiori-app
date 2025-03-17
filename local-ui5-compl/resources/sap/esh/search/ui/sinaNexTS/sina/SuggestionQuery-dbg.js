/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../core/core", "./Query", "./SuggestionType", "./SuggestionCalculationMode", "./DataSourceType", "../core/errors"], function (core, ___Query, ___SuggestionType, ___SuggestionCalculationMode, ___DataSourceType, ___core_errors) {
  "use strict";

  const Query = ___Query["Query"];
  const SuggestionType = ___SuggestionType["SuggestionType"];
  const SuggestionCalculationMode = ___SuggestionCalculationMode["SuggestionCalculationMode"];
  const DataSourceSubType = ___DataSourceType["DataSourceSubType"];
  const DataSourceType = ___DataSourceType["DataSourceType"];
  const QueryIsReadOnlyError = ___core_errors["QueryIsReadOnlyError"];
  class SuggestionQuery extends Query {
    // _meta: {
    //     properties: {
    //         types: {
    //             default: function () {
    //                 return [SuggestionType.DataSource, SuggestionType.Object, SuggestionType.SearchTerm];
    //             },
    //             setter: true
    //         },
    //         calculationModes: {
    //             default: function () {
    //                 return [SuggestionCalculationMode.Data, SuggestionCalculationMode.History];
    //             },
    //             setter: true
    //         }
    //     }
    // },

    calculationModes = (() => [SuggestionCalculationMode.Data, SuggestionCalculationMode.History])();
    types = (() => [SuggestionType.DataSource, SuggestionType.Object, SuggestionType.SearchTerm])();
    constructor(properties) {
      super(properties);
      this.types = properties.types ?? this.types;
      this.calculationModes = properties.calculationModes ?? this.calculationModes;
    }
    async _formatResultSetAsync(resultSet) {
      const query = resultSet.query;
      if (query.types.indexOf(SuggestionType.Object) >= 0 && query.filter.dataSource.type === query.sina.DataSourceType.BusinessObject) {
        return core.executeSequentialAsync(this.sina.suggestionResultSetFormatters, function (formatter) {
          return formatter.formatAsync(resultSet);
        });
      }
    }
    setTypes(types) {
      this.types = types;
    }
    setCalculationModes(calculationModes) {
      this.calculationModes = calculationModes;
    }
    _createReadOnlyClone() {
      const query = this.clone();
      query.getResultSetAsync = function () {
        throw new QueryIsReadOnlyError();
      };
      return query;
    }
    clone() {
      const clone = new SuggestionQuery({
        label: this.label,
        icon: this.icon,
        skip: this.skip,
        top: this.top,
        nlq: this.nlq,
        filter: this.filter.clone(),
        sortOrder: this.sortOrder,
        sina: this.sina,
        types: this.types,
        calculationModes: this.calculationModes
      });
      clone.types = this.types.slice();
      clone.calculationModes = this.calculationModes.slice();
      return clone;
    }
    equals(other) {
      if (!(other instanceof SuggestionQuery)) {
        return false;
      }
      if (!super.equals(other)) {
        return false;
      }
      if (!other) {
        return false;
      }
      return core.equals(this.types, other.types, false) && core.equals(this.calculationModes, other.calculationModes, false);
    }
    async _execute(query) {
      return this._doExecuteSuggestionQuery(query);
    }
    async _doExecuteSuggestionQuery(query) {
      const transformedQuery = this._filteredQueryTransform(query);
      const resultSet = await this.sina.provider.executeSuggestionQuery(transformedQuery);
      return this._filteredQueryBackTransform(query, resultSet);
    }
    _filteredQueryTransform(query) {
      return this._genericFilteredQueryTransform(query);
    }
    _filteredQueryBackTransform(query, resultSet) {
      if (query.filter.dataSource.type !== DataSourceType.BusinessObject || query.filter.dataSource.subType !== DataSourceSubType.Filtered) {
        return resultSet;
      }
      resultSet.query = query;
      let filter;
      for (const suggestion of resultSet.items) {
        switch (suggestion.type) {
          case SuggestionType.SearchTerm:
            filter = query.filter.clone();
            filter.searchTerm = suggestion.filter.searchTerm;
            suggestion.filter = filter;
            break;
          case SuggestionType.Object:
            // do not backtransform datasource in object
            break;
          default:
            throw "program error, not supported suggestion type " + suggestion.type;
        }
      }
      return resultSet;
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.SuggestionQuery = SuggestionQuery;
  return __exports;
});
})();