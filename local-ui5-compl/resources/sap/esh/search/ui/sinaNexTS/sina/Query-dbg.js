/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["../core/core", "../core/util", "./SinaObject", "./Filter", "./LogicalOperator", "../core/errors", "./FilteredDataSource"], function (core, util, ___SinaObject, ___Filter, ___LogicalOperator, ___core_errors, ___FilteredDataSource) {
  "use strict";

  const SinaObject = ___SinaObject["SinaObject"];
  const Filter = ___Filter["Filter"];
  const LogicalOperator = ___LogicalOperator["LogicalOperator"];
  const QueryIsReadOnlyError = ___core_errors["QueryIsReadOnlyError"];
  const FilteredDataSource = ___FilteredDataSource["FilteredDataSource"];
  class Query extends SinaObject {
    label;
    icon;
    filter;
    requestTimeout = false;
    sortOrder;
    skip;
    top;
    nlq;
    _lastQuery;
    _resultSetPromise;
    constructor(properties) {
      super(properties);
      this.top = properties.top ?? 10;
      this.skip = properties.skip ?? 0;
      this.nlq = properties.nlq ?? false;
      this.sortOrder = properties.sortOrder ?? [];
      this.filter = properties.filter ?? this.filter ?? new Filter({
        sina: this.sina
      });
      this.icon = properties.icon;
      this.label = properties.label;
      if (properties.dataSource) {
        this.filter.setDataSource(properties.dataSource);
      }
      if (properties.searchTerm) {
        this.filter.setSearchTerm(properties.searchTerm);
      }
      if (properties.rootCondition) {
        this.filter.setRootCondition(properties.rootCondition);
      }
      if (this.requestTimeout) {
        // this._execute = util.timeoutDecorator(this._execute, this.requestTimeout);
      }
      if (!properties.suppressRefuseOutdatedResponsesDecorator) {
        this._execute = util.refuseOutdatedResponsesDecorator(this._execute);
      }
    }
    setTop(top = 10) {
      this.top = top;
    }
    setSkip(skip = 0) {
      this.skip = skip;
    }
    setNlq(nlq) {
      this.nlq = nlq;
    }
    setSortOrder(sortOrder) {
      this.sortOrder = sortOrder;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async _execute(query) {
      return Promise.resolve(null);
    }
    clone() {
      return; // implement in subclass
    }
    equals(other) {
      return other instanceof Query && this.icon === other.icon && this.label === other.label && this.top === other.top && this.skip === other.skip && this.nlq === other.nlq && this.filter.equals(other.filter) && core.equals(this.sortOrder, other.sortOrder);
    }
    abort() {
      // TODO: Promise has no abort
      // this._execute.abort(); // call abort on decorator
    }
    async getResultSetAsync() {
      if (this._lastQuery) {
        // if query has not changed -> return existing result set
        if (this.equals(this._lastQuery
        // EqualsMode.CheckFireQuery
        )) {
          return this._resultSetPromise;
        }

        // filter changed -> set skip=0
        if (!this.filter.equals(this._lastQuery.filter)) {
          this.setSkip(0);
        }
      }

      // create a read only clone
      this._lastQuery = this._createReadOnlyClone();

      // delegate to subclass implementation
      let resultSet;
      this._resultSetPromise = Promise.resolve().then(function () {
        return this._execute(this._lastQuery);
      }.bind(this)).then(function (iResultSet) {
        resultSet = iResultSet;
        return this._formatResultSetAsync(resultSet); // formatter modifies result set
      }.bind(this)).then(function () {
        return resultSet;
      }.bind(this));
      return this._resultSetPromise;
    }
    _genericFilteredQueryTransform(query) {
      // check for filtered datasource
      if (!(query.filter.dataSource instanceof FilteredDataSource)) {
        return query;
      }
      // assemble root condition of transformed query
      let rootCondition;
      if (query.filter.dataSource.filterCondition) {
        if (query.filter.rootCondition.conditions.length > 0) {
          rootCondition = this.sina.createComplexCondition({
            operator: LogicalOperator.And,
            conditions: [query.filter.dataSource.filterCondition, query.filter.rootCondition]
          });
        } else {
          rootCondition = query.filter.dataSource.filterCondition;
        }
      } else {
        rootCondition = query.filter.rootCondition;
      }
      // create transformed query
      const filter = this.sina.createFilter({
        dataSource: query.filter.dataSource.dataSource,
        searchTerm: query.filter.searchTerm,
        rootCondition: rootCondition
      });
      const transformedQuery = query.clone();
      transformedQuery.filter = filter; // do not call setter because this would invalidate top and skip
      return transformedQuery;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _formatResultSetAsync(resultSet) {
      return Promise.resolve();
    }
    _setResultSet(resultSet) {
      this._lastQuery = this._createReadOnlyClone();
      this._resultSetPromise = Promise.resolve().then(function () {
        return this._formatResultSetAsync(resultSet);
      }.bind(this)).then(function () {
        return resultSet;
      });
      return this._resultSetPromise;
    }
    _createReadOnlyClone() {
      const query = this.clone();
      query.getResultSetAsync = function () {
        throw new QueryIsReadOnlyError();
      };
      return query;
    }
    resetResultSet() {
      this._lastQuery = null;
      this._resultSetPromise = null;
    }
    getSearchTerm() {
      return this.filter.searchTerm;
    }
    getDataSource() {
      return this.filter.dataSource;
    }
    getRootCondition() {
      return this.filter.rootCondition;
    }
    setSearchTerm(searchTerm) {
      this.filter.setSearchTerm(searchTerm);
    }
    setDataSource(dataSource) {
      this.filter.setDataSource(dataSource);
    }
    setRootCondition(rootCondition) {
      this.filter.setRootCondition(rootCondition);
    }
    resetConditions() {
      this.filter.resetConditions();
    }
    autoInsertCondition(condition) {
      this.filter.autoInsertCondition(condition);
    }
    autoRemoveCondition(condition) {
      this.filter.autoRemoveCondition(condition);
    }
    setFilter(filter) {
      if (!this.filter.equals(filter)) {
        this.setSkip(0);
      }
      this.filter = filter;
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.Query = Query;
  return __exports;
});
})();