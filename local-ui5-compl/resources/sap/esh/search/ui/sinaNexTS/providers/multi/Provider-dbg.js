/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../AbstractProvider", "./FacetMode", "./FederationType", "./ProviderHelper", "../../sina/Sina", "./FederationMethod", "../../core/Log", "../../sina/SinaConfiguration", "../abap_odata/Provider", "../hana_odata/Provider", "../sample/Provider", "../inav2/Provider", "../dummy/Provider", "../../core/errors", "../../sina/FacetType"], function (___AbstractProvider, ___FacetMode, ___FederationType, ___ProviderHelper, ____sina_Sina, FederationMethod, ____core_Log, ____sina_SinaConfiguration, ___abap_odata_Provider, ___hana_odata_Provider, ___sample_Provider, ___inav2_Provider, ___dummy_Provider, ____core_errors, ____sina_FacetType) {
  "use strict";

  /* eslint-disable @typescript-eslint/no-this-alias */
  const AbstractProvider = ___AbstractProvider["AbstractProvider"];
  const FacetMode = ___FacetMode["FacetMode"];
  const FederationType = ___FederationType["FederationType"];
  const ProviderHelper = ___ProviderHelper["ProviderHelper"];
  const Sina = ____sina_Sina["Sina"];
  const Log = ____core_Log["Log"];
  const AvailableProviders = ____sina_SinaConfiguration["AvailableProviders"];
  const _normalizeConfiguration = ____sina_SinaConfiguration["_normalizeConfiguration"];
  const ABAPODataProvider = ___abap_odata_Provider["Provider"];
  const HANAODataProvider = ___hana_odata_Provider["Provider"];
  const SampleProvider = ___sample_Provider["Provider"];
  const INAV2Provider = ___inav2_Provider["Provider"];
  const DummyProvider = ___dummy_Provider["Provider"];
  const NotImplementedError = ____core_errors["NotImplementedError"];
  const FacetType = ____sina_FacetType["FacetType"];
  var FilterDataSourceType = /*#__PURE__*/function (FilterDataSourceType) {
    FilterDataSourceType["All"] = "All";
    FilterDataSourceType["UserCategory"] = "UserCategory";
    FilterDataSourceType["BusinessObject"] = "BusinessObject";
    FilterDataSourceType["Category"] = "Category";
    return FilterDataSourceType;
  }(FilterDataSourceType || {});
  class MultiProvider extends AbstractProvider {
    log;
    id = "multi";
    facetMode;
    federationType;
    multiSina;
    multiDataSourceMap;
    providerHelper;
    federationMethod;
    async initAsync(properties) {
      this.log = new Log("MultiProvider");
      this.sina = properties.sina;
      this.facetMode = FacetMode[properties.facetMode] || FacetMode.flat;
      this.federationType = FederationType[properties.federationType] || FederationType.advanced_round_robin;
      this.multiSina = [];
      this.multiDataSourceMap = {}; //key: multiId, value: originalDataSource
      this.sina.dataSourceMap[this.sina.allDataSource.id] = this.sina.allDataSource;
      this.providerHelper = new ProviderHelper(this);
      switch (this.federationType) {
        case FederationType.advanced_round_robin:
          {
            this.federationMethod = new FederationMethod.AdvancedRoundRobin();
            break;
          }
        case FederationType.ranking:
          {
            this.federationMethod = new FederationMethod.Ranking();
            break;
          }
        case FederationType.round_robin:
          {
            this.federationMethod = new FederationMethod.RoundRobin();
            break;
          }
      }
      this.sina.capabilities = this.sina._createCapabilities({
        fuzzy: false
      });
      const creationPromises = [];
      properties.subProviders.forEach(configuration => {
        const creationPromise = this.createAsync(configuration).then(childSina => {
          this.providerHelper.updateProviderId(childSina);
          for (let i = 0; i < childSina.dataSources.length; i++) {
            const childDataSource = childSina.dataSources[i];
            const multiId = this.providerHelper.calculateMultiDataSourceId(childDataSource.id, childSina.provider.id);
            this.providerHelper.createMultiDataSource(multiId, childDataSource);
            this.multiDataSourceMap[multiId] = childDataSource;
          }
          this.multiSina.push(childSina);
          return childSina;
        });
        creationPromises.push(creationPromise);
      });
      let hasSubProvider = false;
      // straightforward workaround to use Promise.allSettled() with older Typescript version
      const promises = await Promise.allSettled(creationPromises);
      promises.forEach(promise => {
        if (promise.status === "rejected") {
          this.log.warn(`Error during creation of subprovider: ${promise.reason.stack}`);
        } else if (promise.status === "fulfilled") {
          hasSubProvider = true;
          if (promise.value.capabilities.fuzzy) {
            this.sina.capabilities.fuzzy = true;
          }
        }
      });
      if (!hasSubProvider) {
        const subProvidersString = properties.subProviders.map(configuration => {
          return configuration.label || configuration.contentProviderId;
        }).join(", ");
        this.log.error(`Error during creation of multi provider: No valid subproviders: ${subProvidersString}`);
        return Promise.reject();
      }
      this.sina.dataSources.sort(function (a, b) {
        return a.labelPlural.localeCompare(b.labelPlural);
      });
      return this.sina;
    }
    async createAsync(configuration) {
      this.log.debug(`Creating new sina (esh client) instance using provider ${configuration.provider}`);
      const normalizedConfiguration = await _normalizeConfiguration(configuration);
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
            throw new Error(`Unknown Provider: '${configuration.provider}' - Available Providers: ${AvailableProviders.HANA_ODATA}, ${AvailableProviders.ABAP_ODATA}, ${AvailableProviders.INAV2}, ${AvailableProviders.MULTI}, ${AvailableProviders.SAMPLE}, ${AvailableProviders.DUMMY}.`);
          }
      }
      const sina = new Sina(providerInstance);
      await sina.initAsync(normalizedConfiguration);
      return sina;
    }
    // return the filter datasource type of the datasource (All, UserCategory, BusinessObject, Category)
    getFilterDataSourceType(dataSource) {
      if (dataSource === this.sina.allDataSource) {
        return FilterDataSourceType.All;
      }
      if (dataSource.type === this.sina.DataSourceType.UserCategory) {
        return FilterDataSourceType.UserCategory;
      }
      if (dataSource.type === this.sina.DataSourceType.BusinessObject) {
        return FilterDataSourceType.BusinessObject;
      }
      if (dataSource.type === this.sina.DataSourceType.Category) {
        return FilterDataSourceType.Category;
      }
    }
    async handleAllSearch(query) {
      let childQuery;
      const queries = [];
      const searchResultSet = this.initializeSearchResultSet(query);
      const searchResultSetItemList = [];

      // search with all dataSource
      searchResultSet.facets.push(this.sina._createDataSourceResultSet({
        title: query.filter.dataSource.label,
        items: [],
        query: query
      }));
      for (let i = 0; i < this.multiSina.length; i++) {
        childQuery = this.multiSina[i].createSearchQuery({
          calculateFacets: query.calculateFacets,
          multiSelectFacets: query.multiSelectFacets,
          dataSource: this.multiSina[i].allDataSource,
          searchTerm: query.getSearchTerm(),
          top: query.top,
          skip: query.skip,
          nlq: query.nlq,
          sortOrder: query.sortOrder,
          sina: this.multiSina[i]
        });
        queries.push(childQuery.getResultSetAsync());
      }
      return Promise.all(queries).then(result => {
        for (let j = 0; j < result.length; j++) {
          const querySearchResultSet = result[j];
          for (let k = 0; k < querySearchResultSet.items.length; k++) {
            const resultItem = querySearchResultSet.items[k];
            const multiId = this.providerHelper.calculateMultiDataSourceId(resultItem.dataSource.id, resultItem.sina.provider.id);
            const dataSource = this.sina.dataSourceMap[multiId];
            resultItem.dataSource = dataSource;
            resultItem.sina = this.sina;
          }
          searchResultSet.totalCount += querySearchResultSet.totalCount;
          searchResultSetItemList.push(...querySearchResultSet.items);
          if (querySearchResultSet.facets[0]) {
            if (this.facetMode === FacetMode.tree) {
              const childDataSource = this.sina.getDataSource(this.providerHelper.calculateMultiDataSourceId(querySearchResultSet.query.filter.dataSource.id, querySearchResultSet.sina.provider.id));
              searchResultSet.facets[0].items.push(this.sina._createDataSourceResultSetItem({
                dataSource: childDataSource,
                dimensionValueFormatted: this.providerHelper.calculateMultiDataSourceLabel(querySearchResultSet.query.filter.dataSource.label, querySearchResultSet.sina.provider),
                measureValue: querySearchResultSet.totalCount,
                measureValueFormatted: querySearchResultSet.totalCount.toString()
              }));
            } else {
              const dataSourceFacets = this.providerHelper.updateDataSourceFacets(querySearchResultSet.facets);
              dataSourceFacets[0].items.forEach(facetItem => {
                searchResultSet.facets[0].items.push(facetItem);
              });
            }
          }
        }
        searchResultSet.items = this.federationMethod.sort(searchResultSetItemList);
        searchResultSet.items = searchResultSet.items.slice(query.skip, query.top);
        return searchResultSet;
      });
    }
    async handleUserCategorySearch(query) {
      let childQuery;
      const queries = [];
      const searchResultSet = this.initializeSearchResultSet(query);
      const searchResultSetItemList = [];

      // search with user defined dataSources (DataSourceType = "UserCategory")
      const myFavorites = query.filter.dataSource;
      const childFavorites = [];
      this.multiSina.forEach(childSina => {
        // supported provider (abap_odata, sample), create child favorites dataSource
        if (childSina.provider.id.startsWith("abap_odata") || childSina.provider.id.startsWith("sample")) {
          const childFavoritesDataSourceId = this.providerHelper.calculateMultiDataSourceId(myFavorites.id, childSina.provider.id);
          let providerFavorite = this.multiDataSourceMap[childFavoritesDataSourceId];
          // check if providerFavorite is included in this.multiDataSourceMap
          if (!providerFavorite) {
            providerFavorite = childSina.createDataSource({
              id: childFavoritesDataSourceId,
              label: myFavorites.label,
              labelPlural: myFavorites.labelPlural,
              type: myFavorites.type,
              subDataSources: [],
              undefinedSubDataSourceIds: []
            });
            // add providerFavorite to this.multiDataSourceMap
            this.multiDataSourceMap[childFavoritesDataSourceId] = providerFavorite;
          } else {
            // providerFavorite exists in this.multiDataSourceMap (initalize subDataSources)
            providerFavorite.subDataSources = [];
          }
        }
      });
      // loop subDataSources, split to get a list childFavorites with different providers
      myFavorites.subDataSources.forEach(subDataSource => {
        const childDataSource = this.multiDataSourceMap[subDataSource.id];
        const childDataSourceSina = childDataSource.sina;
        // abap_odata and sample provider can search with subDataSources, split with each abap_odata and sample provider
        if (childDataSourceSina.provider.id.startsWith("abap_odata") || childDataSourceSina.provider.id.startsWith("sample")) {
          const childFavoritesDataSourceId = this.providerHelper.calculateMultiDataSourceId(myFavorites.id, childDataSourceSina.provider.id);
          const providerFavorite = this.multiDataSourceMap[childFavoritesDataSourceId];
          if (providerFavorite.subDataSources.length === 0) {
            childFavorites.push(providerFavorite);
          }
          providerFavorite.subDataSources.push(childDataSource);
        }
        // other providers can only search with one dataSource, split as single dataSource
        // delete possible (else)
        else {
          childFavorites.push(childDataSource);
        }
      });
      childFavorites.forEach(childFavorite => {
        childQuery = childFavorite.sina.createSearchQuery({
          calculateFacets: query.calculateFacets,
          multiSelectFacets: query.multiSelectFacets,
          dataSource: childFavorite,
          searchTerm: query.getSearchTerm(),
          top: query.top,
          skip: query.skip,
          nlq: query.nlq,
          sortOrder: query.sortOrder,
          sina: childFavorite.sina
        });
        queries.push(childQuery.getResultSetAsync());
      });
      return Promise.all(queries).then(result => {
        searchResultSet.facets.push(this.sina._createDataSourceResultSet({
          title: query.filter.dataSource.label,
          items: [],
          query: query
        }));
        for (let j = 0; j < result.length; j++) {
          const querySearchResultSet = result[j];
          for (let k = 0; k < querySearchResultSet.items.length; k++) {
            const resultItem = querySearchResultSet.items[k];
            const multiId = this.providerHelper.calculateMultiDataSourceId(resultItem.dataSource.id, resultItem.sina.provider.id);
            const dataSource = this.sina.dataSourceMap[multiId];
            // update dataSource consisting of provider Id and dataSource Id
            resultItem.dataSource = dataSource;
            resultItem.sina = this.sina;
          }
          searchResultSet.totalCount += querySearchResultSet.totalCount;
          searchResultSetItemList.push(...querySearchResultSet.items);

          // favorite should certainly be a dataSource facet
          if (query.calculateFacets) {
            const childDataSource = querySearchResultSet.query.filter.dataSource;
            const childDataSourceResultSet = querySearchResultSet.sina._createDataSourceResultSet({
              title: childDataSource.label,
              items: [],
              query: querySearchResultSet.query
            });
            // manually create a dataSourceResultSet for abap_odata/sample one dataSource child favorite, resultSet has no facet
            if (querySearchResultSet.facets.length === 0 && querySearchResultSet.items.length > 0) {
              childDataSourceResultSet.items.push(querySearchResultSet.sina._createDataSourceResultSetItem({
                dataSource: childDataSource.subDataSources[0],
                dimensionValueFormatted: childDataSource.subDataSources[0].label,
                measureValue: querySearchResultSet.totalCount,
                measureValueFormatted: querySearchResultSet.totalCount.toString()
              }));
              querySearchResultSet.facets.push(childDataSourceResultSet);
            }
            // manually update a dataSourceResultSet for non abap_odata favorite, resultSet has chart facet
            if (querySearchResultSet.facets.length > 0 && querySearchResultSet.facets[0].type === FacetType.Chart && querySearchResultSet.items.length > 0) {
              childDataSourceResultSet.items.push(querySearchResultSet.sina._createDataSourceResultSetItem({
                dataSource: childDataSource,
                dimensionValueFormatted: childDataSource.label,
                measureValue: querySearchResultSet.totalCount,
                measureValueFormatted: querySearchResultSet.totalCount.toString()
              }));
              querySearchResultSet.facets = [childDataSourceResultSet];
            }
            // normally update a dataSourceResultSet
            if (querySearchResultSet.facets.length === 1 && querySearchResultSet.facets[0].type === FacetType.DataSource) {
              this.providerHelper.updateDataSourceFacets(querySearchResultSet.facets);
              searchResultSet.facets[0].items = searchResultSet.facets[0].items.concat(querySearchResultSet.facets[0].items);
            }
          }
        }
        searchResultSet.items = this.federationMethod.sort(searchResultSetItemList);
        searchResultSet.items = searchResultSet.items.slice(query.skip, query.top);
        return searchResultSet;
      });
    }
    async handleBusinessObjectSearch(query) {
      // search with single child provider dataSource
      const childDataSource = this.multiDataSourceMap[query.filter.dataSource.id];
      if (childDataSource === undefined) {
        // data source does not exist (or is a category)
        //    - example: On facet panel of FLP search click category, afterwards reload the page.
        //               -> This will fail because categories are not part of the data source droptown of FLP
        throw new Error(`Data source with id '${query.filter.dataSource.id}' does not exist.`);
      }
      const rootCondition = query.getRootCondition().clone();
      const searchResultSet = this.initializeSearchResultSet(query);
      this.providerHelper.updateRootCondition(rootCondition, childDataSource.sina);
      const childQuery = childDataSource.sina.createSearchQuery({
        calculateFacets: query.calculateFacets,
        multiSelectFacets: query.multiSelectFacets,
        dataSource: childDataSource,
        searchTerm: query.getSearchTerm(),
        rootCondition: query.getRootCondition(),
        top: query.top,
        skip: query.skip,
        nlq: query.nlq,
        sortOrder: query.sortOrder,
        sina: childDataSource.sina
      });
      return childQuery.getResultSetAsync().then(querySearchResultSet => {
        searchResultSet.items = querySearchResultSet.items;
        searchResultSet.totalCount = querySearchResultSet.totalCount;
        for (let i = 0; i < searchResultSet.items.length; i++) {
          const resultItem = searchResultSet.items[i];
          const resultItemMultiId = this.providerHelper.calculateMultiDataSourceId(resultItem.dataSource.id, resultItem.sina.provider.id);
          //update attributes metadata
          this.providerHelper.updateAttributesMetadata(resultItem.dataSource, this.sina.dataSourceMap[resultItemMultiId]);
          //set the facet result item dataSource as multi provider dataSource
          resultItem.dataSource = this.sina.dataSourceMap[resultItemMultiId];
          resultItem.sina = this.sina;
        }
        let multiFacets;
        //dataSource facet
        if (querySearchResultSet.facets.length === 1 && querySearchResultSet.facets[0].items[0].dataSource) {
          multiFacets = querySearchResultSet.facets;
          multiFacets[0].title = this.providerHelper.calculateMultiDataSourceLabel(querySearchResultSet.facets[0].title, querySearchResultSet.facets[0].sina.provider);
          this.providerHelper.updateDataSourceFacets(multiFacets);
        } else {
          //chart facet
          multiFacets = [];
          for (let k = 0; k < querySearchResultSet.facets.length; k++) {
            const chartResultSet = querySearchResultSet.facets[k];
            multiFacets.push(this.providerHelper.createMultiChartResultSet(chartResultSet));
          }
        }
        searchResultSet.facets = multiFacets;
        return searchResultSet;
      });
    }
    initializeSearchResultSet(query) {
      return this.sina._createSearchResultSet({
        title: "Search Multi Result List",
        query: query,
        items: [],
        totalCount: 0,
        facets: []
      });
    }
    executeSearchQuery(query) {
      switch (this.getFilterDataSourceType(query.filter.dataSource)) {
        // dataSource All
        case FilterDataSourceType.All:
          return this.handleAllSearch(query);
        // dataSource My Favorites
        case FilterDataSourceType.UserCategory:
          return this.handleUserCategorySearch(query);
        // dataSource Connector or Category
        case FilterDataSourceType.BusinessObject:
        case FilterDataSourceType.Category:
          return this.handleBusinessObjectSearch(query);
      }
    }
    executeChartQuery(query) {
      const that = this;
      const childDataSource = that.multiDataSourceMap[query.filter.dataSource.id];
      const rootCondition = query.getRootCondition().clone();
      that.providerHelper.updateRootCondition(rootCondition, childDataSource.sina);
      const childQuery = childDataSource.sina.createChartQuery({
        dimension: query.dimension,
        dataSource: childDataSource,
        searchTerm: query.getSearchTerm(),
        rootCondition: rootCondition,
        top: query.top,
        skip: query.skip,
        nlq: query.nlq,
        sortOrder: query.sortOrder
      });
      return childQuery.getResultSetAsync().then(function (chartResultSet) {
        return that.providerHelper.createMultiChartResultSet(chartResultSet);
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    executeHierarchyQuery(query) {
      throw new NotImplementedError();
    }
    async handleAllSuggestionSearch(query) {
      let childQuery;
      const queries = [];
      for (let i = 0; i < this.multiSina.length; i++) {
        childQuery = this.multiSina[i].createSuggestionQuery({
          types: query.types,
          calculationModes: query.calculationModes,
          dataSource: this.multiSina[i].allDataSource,
          searchTerm: query.getSearchTerm(),
          top: query.top,
          skip: query.skip,
          sortOrder: query.sortOrder
        });
        queries.push(childQuery.getResultSetAsync());
      }
      return Promise.allSettled(queries).then(results => {
        const mergedSuggestionResultSet = this.sina._createSuggestionResultSet({
          title: "Multi Suggestions",
          query: query,
          items: []
        });
        for (let j = 0; j < results.length; j++) {
          const result = results[j];
          if (result.status === "fulfilled") {
            const suggestionResultSet = this.providerHelper.updateSuggestionDataSource(result.value);
            mergedSuggestionResultSet.items = new FederationMethod.RoundRobin().mergeMultiResults(mergedSuggestionResultSet.items, suggestionResultSet.items, j + 1);
          }
        }
        return mergedSuggestionResultSet;
      });
    }
    async handleUserCategorySuggestionSearch(query) {
      if (query.types.indexOf(this.sina.SuggestionType.DataSource) >= 0) {
        return this.handleAllSuggestionSearch(query);
      } else {
        const emptySuggestionResultSet = this.sina._createSuggestionResultSet({
          title: "Multi Suggestions - My Favorites",
          query: query,
          items: []
        });
        return Promise.resolve(emptySuggestionResultSet);
      }
    }
    async handleBusinessObjectSuggestionSearch(query) {
      const childDataSource = this.multiDataSourceMap[query.filter.dataSource.id];
      const childFilter = childDataSource.sina.createFilter({
        searchTerm: query.getSearchTerm(),
        dataSource: childDataSource,
        rootCondition: query.filter.rootCondition.clone()
      });
      const childQuery = childDataSource.sina.createSuggestionQuery({
        types: query.types,
        calculationModes: query.calculationModes,
        top: query.top,
        skip: query.skip,
        sortOrder: query.sortOrder,
        filter: childFilter
      });
      return childQuery.getResultSetAsync().then(results => {
        return this.providerHelper.updateSuggestionDataSource(results);
      });
    }
    executeSuggestionQuery(query) {
      switch (this.getFilterDataSourceType(query.filter.dataSource)) {
        // dataSource All
        case FilterDataSourceType.All:
          return this.handleAllSuggestionSearch(query);
        // dataSource My Favorites
        case FilterDataSourceType.UserCategory:
          return this.handleUserCategorySuggestionSearch(query);
        // dataSource Connector or Category
        case FilterDataSourceType.BusinessObject:
        case FilterDataSourceType.Category:
          return this.handleBusinessObjectSuggestionSearch(query);
      }
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.MultiProvider = MultiProvider;
  return __exports;
});
})();