/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../../core/core", "./MetadataParserXML", "./MetadataParserJson", "./ItemParser", "./FacetParser", "./suggestionParser", "./eshObjects/src/index", "./conditionSerializerEshObj", "../../core/Log", "../../sina/SearchQuery", "../../sina/SortOrder", "../AbstractProvider", "../../sina/SuggestionType", "../../sina/ComplexCondition", "../../core/errors", "./HierarchyParser", "./HierarchyNodePathParser", "../../sina/SuggestionCalculationMode", "../../sina/DataSource", "../hana_odata/ajax", "./util", "./nlqParser"], function (core, ___MetadataParserXML, ___MetadataParserJson, ___ItemParser, ___FacetParser, ___suggestionParser, ___eshObjects_src_index, conditionSerializer, ____core_Log, ____sina_SearchQuery, ____sina_SortOrder, ___AbstractProvider, ____sina_SuggestionType, ____sina_ComplexCondition, ____core_errors, ___HierarchyParser, ___HierarchyNodePathParser, ____sina_SuggestionCalculationMode, ____sina_DataSource, ___hana_odata_ajax, ___util, ___nlqParser) {
  "use strict";

  const MetadataParserXML = ___MetadataParserXML["MetadataParserXML"];
  const MetadataParserJson = ___MetadataParserJson["MetadataParserJson"];
  const ItemParser = ___ItemParser["ItemParser"];
  const FacetParser = ___FacetParser["FacetParser"];
  const SuggestionParser = ___suggestionParser["SuggestionParser"];
  const getEshSearchQuery = ___eshObjects_src_index["getEshSearchQuery"];
  const Comparison = ___eshObjects_src_index["Comparison"];
  const Phrase = ___eshObjects_src_index["Phrase"];
  const Term = ___eshObjects_src_index["Term"];
  const EshObjComparisonOperator = ___eshObjects_src_index["SearchQueryComparisonOperator"];
  const ESOrderType = ___eshObjects_src_index["ESOrderType"];
  const HierarchyFacet = ___eshObjects_src_index["HierarchyFacet"];
  const Log = ____core_Log["Log"];
  const SearchQuery = ____sina_SearchQuery["SearchQuery"];
  const SortOrder = ____sina_SortOrder["SortOrder"];
  const AbstractProvider = ___AbstractProvider["AbstractProvider"];
  const SuggestionType = ____sina_SuggestionType["SuggestionType"];
  const ComplexCondition = ____sina_ComplexCondition["ComplexCondition"];
  const ESHNoBusinessObjectDatasourceError = ____core_errors["ESHNoBusinessObjectDatasourceError"];
  const ESHNotActiveError = ____core_errors["ESHNotActiveError"];
  const InternalSinaError = ____core_errors["InternalSinaError"];
  const HierarchyParser = ___HierarchyParser["HierarchyParser"];
  const HierarchyNodePathParser = ___HierarchyNodePathParser["HierarchyNodePathParser"];
  const SuggestionCalculationMode = ____sina_SuggestionCalculationMode["SuggestionCalculationMode"];
  const DataSource = ____sina_DataSource["DataSource"];
  const createAjaxClient = ___hana_odata_ajax["createAjaxClient"];
  const handleError = ___util["handleError"];
  const parseNlqInfo = ___nlqParser["parseNlqInfo"];
  var PresentationUsage = /*#__PURE__*/function (PresentationUsage) {
    PresentationUsage["TITLE"] = "TITLE";
    PresentationUsage["SUMMARY"] = "SUMMARY";
    PresentationUsage["DETAIL"] = "DETAIL";
    PresentationUsage["IMAGE"] = "IMAGE";
    PresentationUsage["THUMBNAIL"] = "THUMBNAIL";
    PresentationUsage["HIDDEN"] = "HIDDEN";
    return PresentationUsage;
  }(PresentationUsage || {});
  class Provider extends AbstractProvider {
    id = "hana_odata";
    ajaxClient;
    requestPrefix;
    metadataParser;
    itemParser;
    facetParser;
    suggestionParser;
    odataVersion;
    responseAttributes;
    facetAttributes;
    dataSourceConfigurations;
    metaDataSuffix;
    hierarchyNodePathParser;
    getTextFromResourceBundle;
    async initAsync(configuration) {
      this.getTextFromResourceBundle = configuration.getTextFromResourceBundle;
      this.requestPrefix = configuration.url;
      this.odataVersion = configuration.odataVersion;
      this.responseAttributes = configuration?.responseAttributes;
      this.facetAttributes = configuration?.facetAttributes;
      this.sina = configuration.sina;
      this.dataSourceConfigurations = configuration?.dataSourceConfigurations || [];
      if (this.dataSourceConfigurations.length === 0 && configuration.querySuffix) {
        // ToDo: Remove as soon as DWC has been migrated (querySuffix->dataSourceConfigurations)
        this.dataSourceConfigurations.push({
          id: "SEARCH_DESIGN",
          filterCondition: configuration.querySuffix
        });
      }
      this.metaDataSuffix = configuration.metaDataSuffix ?? "";
      this.ajaxClient = configuration.ajaxClient ?? createAjaxClient({
        getLanguage: typeof configuration.getLanguage === "function" ? configuration.getLanguage : undefined
      });
      const metaDataJsonType = configuration.metaDataJsonType;
      if (metaDataJsonType) {
        this.metadataParser = new MetadataParserJson(this);
      } else {
        this.metadataParser = new MetadataParserXML(this);
      }
      this.itemParser = new ItemParser(this);
      this.facetParser = new FacetParser(this);
      this.suggestionParser = new SuggestionParser(this);
      this.hierarchyNodePathParser = new HierarchyNodePathParser(this.sina);
      this.serverInfo = await this.loadServerInfo();
      if (!this.supports("Search")) {
        throw new ESHNotActiveError();
      }
      await this.loadBusinessObjectDataSources();
      if (this.sina.getBusinessObjectDataSources().length === 0) {
        return Promise.reject(new ESHNoBusinessObjectDatasourceError());
      }
      return {
        capabilities: this.sina._createCapabilities({
          fuzzy: false,
          nlq: true // there is not server info call at the moment so we assume always true configuration needs to be performed by configuration flag aiNlq
        })
      };
    }
    supports(service, capability) {
      const supportedServices = this.serverInfo.services;
      for (const supportedService in supportedServices) {
        if (supportedService === service) {
          if (!capability) {
            return true;
          }
          const supportedCapabilities = supportedServices[supportedService].Capabilities;
          for (let j = 0; j < supportedCapabilities.length; ++j) {
            const checkCapability = supportedCapabilities[j];
            if (checkCapability === capability) {
              return true;
            }
          }
        }
      }
      return false;
    }
    async loadServerInfo() {
      const simulatedHanaServerinfo = {
        rawServerInfo: {
          Services: [{
            Service: "Search",
            Capabilities: [{
              Capability: "SemanticObjectType"
            }]
          }, {
            Service: "Suggestions2",
            Capabilities: [{
              Capability: "ScopeTypes"
            }]
          }]
        },
        services: {
          Suggestions: {
            suggestionTypes: ["objectdata"]
          },
          Search: {
            capabilities: ["SemanticObjectType"]
          }
        }
      };
      return simulatedHanaServerinfo;
    }
    _prepareMetadataRequest() {
      const requestObj = {
        metadataCall: true,
        resourcePath: this.getPrefix() + "/$metadata"
      };
      if (typeof this.metaDataSuffix === "string" && this.metaDataSuffix.length > 0) {
        // TODO: for the temp compatibility of import wizard call, metaDataSuffix shall only contains entityset
        /* if (this.metaDataSuffix.startsWith("/EntitySets")) {
            this.metaDataSuffix = this.metaDataSuffix.replace(/\/EntitySets\(/, "");
            this.metaDataSuffix = this.metaDataSuffix.substring(0, this.metaDataSuffix.length - 1);
        } */
        requestObj.metadataObjects = {
          entitySets: this.metaDataSuffix
        };
      }
      return this.assembleUrl(requestObj);
    }
    async loadBusinessObjectDataSources() {
      const requestUrl = this._prepareMetadataRequest();
      const response = await this.metadataParser.fireRequest(this.ajaxClient, requestUrl);
      const allMetaDataMap = await this.metadataParser.parseResponse(response);
      for (let i = 0; i < allMetaDataMap.dataSourcesList.length; ++i) {
        const dataSource = allMetaDataMap.dataSourcesList[i];
        this.metadataParser.fillMetadataBuffer(dataSource, allMetaDataMap.businessObjectMap[dataSource.id]);
      }
    }
    assembleOrderBy(query) {
      const result = [];
      if (Array.isArray(query.sortOrder)) {
        for (let i = 0; i < query.sortOrder.length; ++i) {
          const sortKey = query.sortOrder[i];
          const sortOrder = sortKey.order === SortOrder.Descending ? ESOrderType.Descending : ESOrderType.Ascending;
          result.push({
            key: sortKey.id,
            order: sortOrder
          });
        }
      }
      return result;
    }
    assembleGroupBy(query) {
      const result = null;
      if (query.groupBy && query.groupBy.attributeName && query.groupBy.attributeName.length > 0) {
        result.properties = query.groupBy.attributeName;
        if (query.groupBy.aggregateCountAlias && query.groupBy.aggregateCountAlias !== "") {
          result.aggregateCountAlias = query.groupBy.aggregateCountAlias;
        }
      }
      return result;
    }
    executeSearchQuery(query) {
      const oUrlData = this._prepareSearchObjectSuggestionRequest(query);
      return this.fireSearchQuery(oUrlData);
    }
    _prepareSearchObjectSuggestionRequest(query) {
      // assemble request object
      const rootCondition = query.filter.rootCondition.clone();
      const filter = conditionSerializer.serialize(query.filter.dataSource, rootCondition);
      if (!Array.isArray(filter.items)) {
        filter.items = [];
      }
      const searchTerms = query.filter.searchTerm || "*";
      this.addFilterConditionToFilter(query, filter, this.dataSourceConfigurations);
      const dataSource = query.filter.dataSource;
      const top = query.top || 10;
      const skip = query.skip || 0;
      const sortOrder = this.assembleOrderBy(query);
      const searchOptions = {
        // query: searchTerms,
        resourcePath: this.getPrefix() + "/$all",
        $top: top,
        $skip: skip,
        whyfound: true,
        $count: true,
        $orderby: sortOrder,
        freeStyleText: searchTerms,
        searchQueryFilter: filter
      };
      if (dataSource !== this.sina.getAllDataSource()) {
        searchOptions.scope = dataSource.id;
      }
      // The second condition is to exclude hierarchy facets and object suggestions which are also SearchQuery
      if (this.sina?.configuration?.useValueHierarchy === true && top < 100) {
        let hierarchyAttribute = dataSource.hierarchyAttribute;
        const helperHierarchyDataource = dataSource.getHierarchyDataSource();
        if (helperHierarchyDataource instanceof DataSource) {
          hierarchyAttribute = helperHierarchyDataource.hierarchyAttribute;
        }
        if (hierarchyAttribute) {
          searchOptions.valuehierarchy = hierarchyAttribute;
        }
      }
      if (query instanceof SearchQuery) {
        if (typeof this.responseAttributes !== "undefined") {
          // an empty array is also supported. Even if there seems to be no enduser value, tests might want to check performance of a such request
          searchOptions.$select = this.responseAttributes; // rendering currently failing, if not all properties of metadata are requested
        }
        if (query.calculateFacets) {
          if (typeof this.facetAttributes !== "undefined") {
            // an empty array is also supported. Even if there seems to be no enduser value, tests might want to check performance of a such request
            searchOptions.facets = this.facetAttributes;
          } else {
            searchOptions.facets = ["all"];
          }
          searchOptions.facetlimit = query.facetTop || 5;
        }
        const groupBy = this.assembleGroupBy(query);
        if (groupBy) {
          searchOptions.groupby = groupBy;
          searchOptions.whyfound = false;
        }
      }
      const queryData = {
        url: this.assembleUrl(searchOptions, {
          nlq: query.nlq,
          doNotEsacpeFreeStyleText: this.sina?.configuration?.enableQueryLanguage
        }),
        query: query
      };
      return queryData;
    }
    async fireSearchQuery(oInputData) {
      return await handleError(async () => {
        // 1) fetch
        return (await this.ajaxClient.getJson(oInputData.url))?.data;
      }, async responseData => {
        // 2) parse
        return await this.parseSearchResponse(oInputData, responseData);
      });
    }
    async parseSearchResponse(oInputData, response) {
      this.metadataParser.parseDynamicMetadata(response);
      const hierarchyNodePaths = this.hierarchyNodePathParser.parse(response?.["@com.sap.vocabularies.Search.v1.ParentHierarchies"], oInputData.query);
      const items = await this.itemParser.parse(oInputData.query, response);
      let facets;
      const statistics = response["@com.sap.vocabularies.Search.v1.SearchStatistics"]?.ConnectorStatistics;
      if (oInputData.query.getDataSource() === this.sina.getAllDataSource() && statistics && Array.isArray(statistics) && statistics.length === 1) {
        const constructedDataSourceFacets = {
          "@com.sap.vocabularies.Search.v1.Facets": [{
            "@com.sap.vocabularies.Search.v1.Facet": {
              Dimensions: [{
                PropertyName: "scope",
                isConnectorFacet: true
              }]
            },
            Items: [{
              scope: statistics[0].OdataID,
              _Count: response["@odata.count"]
            }]
          }]
        };
        facets = await this.facetParser.parse(oInputData.query, constructedDataSourceFacets);
      } else {
        facets = await this.facetParser.parse(oInputData.query, response);
      }
      const nlqResult = parseNlqInfo(this.sina, response["@com.sap.vocabularies.Search.v1.Nlq"]);
      return this.sina._createSearchResultSet({
        title: "Search Result List",
        query: oInputData.query,
        items: items,
        totalCount: response["@odata.count"] || 0,
        facets: facets,
        hierarchyNodePaths: hierarchyNodePaths,
        nlqResult: nlqResult
      });
    }
    async _fireObjectSuggestionsQuery(query, oInputData) {
      return await handleError(async () => {
        // 1) fetch
        return (await this.ajaxClient.getJson(oInputData.url))?.data;
      }, async responseData => {
        // 2) parse
        this.metadataParser.parseDynamicMetadata(responseData);
        const searchItems = await this.itemParser.parse(oInputData.query, responseData);
        const objectSuggestions = this.suggestionParser.parseObjectSuggestions(oInputData.query /* cast from generic to specific struct */, searchItems);
        return this.sina._createSuggestionResultSet({
          title: "Suggestions",
          query: query,
          items: objectSuggestions
        });
      });
    }
    _prepareChartQueryRequest(query, rootCondition, resultDeletion) {
      const searchTerms = query.filter.searchTerm;
      const dataSource = query.filter.dataSource;
      const facetTop = 15; // default value for numeric range/interval facets

      // in value help mode delete current condition from root and prepare to construct the value help part of query
      const isValueHelpMode = resultDeletion.deleted || false;
      const filter = conditionSerializer.serialize(dataSource, rootCondition);
      if (!Array.isArray(filter.items)) {
        filter.items = [];
      }
      const top = query.top || 5;

      // construct search part of $apply
      if (isValueHelpMode === true) {
        // value help mode
        // attribute value "*" can only be used without EQ part
        // this will be changed on serverside later
        const valueString = resultDeletion.value;
        if (!resultDeletion.value || resultDeletion.value === "" || valueString.match(/^[*\s]+$/g) !== null) {
          resultDeletion.value = "*";
          filter.items.push(new Comparison({
            property: resultDeletion.attribute,
            operator: EshObjComparisonOperator.Search,
            value: new Term({
              term: "*"
            })
          }));
        } else {
          filter.items.push(new Comparison({
            property: resultDeletion.attribute,
            operator: EshObjComparisonOperator.EqualCaseInsensitive,
            value: new Phrase({
              phrase: resultDeletion.value + "*"
            })
          }));
        }
      }
      this.addFilterConditionToFilter(query, filter, this.dataSourceConfigurations);
      const chartOptions = {
        resourcePath: this.getPrefix() + "/$all",
        $top: 0,
        $count: true,
        searchQueryFilter: filter,
        freeStyleText: searchTerms
      };
      if (dataSource !== this.sina.getAllDataSource()) {
        chartOptions.scope = dataSource.id;
      }
      const facetScope = [];
      chartOptions.facetlimit = top;
      if (query.dimension) {
        facetScope.push(query.dimension);
        const metadata = query.filter.dataSource.getAttributeMetadata(query.dimension);
        if (metadata && (metadata.type === "Double" || metadata.type === "Integer") && top >= 20) {
          // facet limit decides number of intervals/ranges of numeric data types, but has no effect on date/time ranges
          chartOptions.facetlimit = facetTop;
        }
      }

      // no need to use this.responseAttributes/this.facetAttributes here ($select/facets)

      // just require own chart facet in case that
      chartOptions.facets = facetScope;

      // get Query Url
      return this.assembleUrl(chartOptions, {
        nlq: query.nlq
      });
    }
    async executeChartQuery(query) {
      const log = new Log();
      // in value help mode delete current condition from root and prepare to construct the value help part of query
      const rootCondition = query.filter.rootCondition.clone();
      const resultDeletion = rootCondition.removeAttributeConditions(query.dimension);
      const url = this._prepareChartQueryRequest(query, rootCondition, resultDeletion);
      return await handleError(async () => {
        // 1) fetch
        return (await this.ajaxClient.getJson(url))?.data;
      }, async responseData => {
        // 2) parse
        const facets = await this.facetParser.parse(query, responseData);
        if (facets.length > 0) {
          return facets[0];
        }
        let metadataLabel = "";
        const metadata = query.filter.dataSource.getAttributeMetadata(query.dimension);
        if (metadata && metadata.label) {
          metadataLabel = metadata.label;
        }
        return this.sina._createChartResultSet({
          title: metadataLabel,
          items: [],
          query: query,
          log: log
        });
      });
    }
    async executeHierarchyQuery(query) {
      const hierarchyParser = new HierarchyParser();
      const filter = conditionSerializer.serialize(query.filter.dataSource, query.filter.rootCondition);
      if (!Array.isArray(filter.items)) {
        filter.items = [];
      }
      this.addFilterConditionToFilter(query, filter, this.dataSourceConfigurations);

      // get Query Url
      const requestUrl = this.assembleUrl({
        resourcePath: this.getPrefix() + "/$all",
        $top: 0,
        searchQueryFilter: filter,
        freeStyleText: query.filter.searchTerm,
        scope: query.filter.dataSource.id,
        facets: [query.attributeId],
        facetroot: [new HierarchyFacet({
          facetColumn: query.attributeId,
          rootIds: [query.nodeId],
          levels: 1
        })]
        // no need to use this.responseAttributes/this.facetAttributes here ($select/facets)
      }, {
        nlq: query.nlq
      });
      return await handleError(async () => {
        // 1) fetch
        return (await this.ajaxClient.getJson(requestUrl))?.data;
      }, async responseData => {
        // 2) parse
        const attributeMetadata = query.filter.dataSource.getAttributeMetadata(query.attributeId);
        const facets = responseData["@com.sap.vocabularies.Search.v1.Facets"] || [];
        const facet = facets.find(facet => {
          const attributeId = core.getProperty(facet, ["@com.sap.vocabularies.Search.v1.Facet", "Dimensions", 0, "PropertyName"]);
          return attributeId === query.attributeId;
        });
        return hierarchyParser.parseHierarchyFacet(query, attributeMetadata, facet || {});
      });
    }
    async executeSuggestionQuery(query) {
      // handle regular suggestions and object suggestion separately because
      // object suggestions have only searchterms and no suggestionInput
      const [regularSuggestionsResultSet, objectSuggestionsResultSet] = await Promise.all([this.executeRegularSuggestionQuery(query), this.executeObjectSuggestionQuery(query)]);
      const resultSet = this.sina._createSuggestionResultSet({
        title: "Suggestions",
        query: query,
        items: [...objectSuggestionsResultSet.items, ...regularSuggestionsResultSet.items]
      });
      resultSet.addErrors(regularSuggestionsResultSet.getErrors());
      resultSet.addErrors(objectSuggestionsResultSet.getErrors());
      return resultSet;
    }
    isObjectSuggestionQuery(query) {
      return query.types.indexOf(SuggestionType.Object) >= 0 && query.filter.dataSource.type === query.sina.DataSourceType.BusinessObject;
    }
    async executeObjectSuggestionQuery(query) {
      // check query type
      if (!this.isObjectSuggestionQuery(query)) {
        return Promise.resolve(this.sina._createSuggestionResultSet({
          title: "Suggestions",
          query: query,
          items: []
        }));
      }
      const oUrlData = this._prepareSearchObjectSuggestionRequest(query);
      return this._fireObjectSuggestionsQuery(query, oUrlData);
    }
    executeRegularSuggestionQuery(query) {
      // HANA only supports searchterm suggestions without history
      if (query.calculationModes.includes(SuggestionCalculationMode.Data) && (query.types.includes(SuggestionType.SearchTerm) || query.types.includes(SuggestionType.SearchTermAI))) {
        return this._fireSuggestionQuery(query);
      }
      return Promise.resolve(this.sina._createSuggestionResultSet({
        title: "Suggestions",
        query: query,
        items: []
      }));
    }
    _prepareSuggestionQueryRequest(query) {
      /*
          type=scope for search connector names 
          currently only for technical names, shall be discussed
          Do we need count?
          $apply=filter part exactly as search query but move search terms to term parameter in getSuggestion
      */

      // split search term in query into (1) searchTerm (2) suggestionTerm
      // const searchTerm = this._escapeSearchTerm(query.filter.searchTerm);
      // const searchTerm = encodeURIComponent(
      //     query.filter.searchTerm
      // );
      const searchTerms = query.filter.searchTerm;
      const dataSource = query.filter.dataSource;
      const rootCondition = query.filter.rootCondition.clone();
      const filter = conditionSerializer.serialize(query.filter.dataSource, rootCondition);
      if (!Array.isArray(filter.items)) {
        filter.items = [];
      }
      const top = query.top || 10;
      const skip = query.skip || 0;
      this.addFilterConditionToFilter(query, filter, this.dataSourceConfigurations);
      const suggestionOptions = {
        suggestTerm: searchTerms,
        resourcePath: this.getPrefix() + "/$all",
        $top: top,
        $skip: skip,
        searchQueryFilter: filter
        // no need to use this.responseAttributes/this.facetAttributes here ($select/facets)
      };
      if (dataSource !== this.sina.getAllDataSource()) {
        suggestionOptions.scope = dataSource.id;
      }
      let nlq = query.nlq;

      // for search term ai suggestions set nlq flag
      if (query.types.indexOf(SuggestionType.SearchTermAI) >= 0) {
        if (query.types.length > 1) {
          throw new InternalSinaError({
            message: "inconsistent suggestion query: ai suggestion mixed with other suggestion"
          });
        }
        nlq = true;
      }
      return this.assembleUrl(suggestionOptions, {
        nlq: nlq,
        workaroundForEmptySuggestionTerm: true
      });
    }
    async _fireSuggestionQuery(query) {
      const url = this._prepareSuggestionQueryRequest(query);
      return await handleError(async () => {
        // 1) fetch
        return (await this.ajaxClient.getJson(url))?.data;
      }, async responseData => {
        // 2) parse
        let suggestions = [];
        if (responseData.value) {
          suggestions = this.suggestionParser.parse(query, responseData.value);
        }
        return this.sina._createSuggestionResultSet({
          title: "Suggestions",
          query: query,
          items: suggestions
        });
      });
    }
    addFilterConditionToFilter(query, filter, dataSourceConfigurations) {
      if (dataSourceConfigurations) {
        const dataSourceConfig = dataSourceConfigurations.filter(dsConfig => dsConfig.id === query.filter.dataSource.id)[0];
        if (dataSourceConfig?.filterCondition) {
          filter.items.push(this.convertFilterConditionToExpression(dataSourceConfig.filterCondition));
        }
      }
    }

    // getFilterValueFromConditionTree(
    //     dimension: any,
    //     conditionTree: {
    //         ConditionAttribute: any;
    //         ConditionValue: any;
    //         SubFilters: string | any[];
    //     }
    // ) {
    //     if (
    //         conditionTree.ConditionAttribute &&
    //         conditionTree.ConditionAttribute === dimension
    //     ) {
    //         return conditionTree.ConditionValue;
    //     } else if (conditionTree.SubFilters) {
    //         let i: number;
    //         let result = null;
    //         for (
    //             i = 0;
    //             result === null && i < conditionTree.SubFilters.length;
    //             i++
    //         ) {
    //             result = this.getFilterValueFromConditionTree(
    //                 dimension,
    //                 conditionTree.SubFilters[i]
    //             );
    //         }
    //         return result;
    //     }
    //     return null;
    // }

    getPrefix() {
      const odataVersion = this.odataVersion ?? "/v20411";
      const requestPrefix = this.requestPrefix ?? "/sap/es/odata";
      const prefix = requestPrefix + odataVersion;
      return prefix;
    }
    convertFilterConditionToExpression(filterCondition) {
      let filterConditionExpression = null;
      if (filterCondition && filterCondition instanceof ComplexCondition) {
        filterConditionExpression = conditionSerializer.serialize(null, filterCondition);
      }
      return filterConditionExpression;
    }
    getDebugInfo() {
      return "ESH API Provider: " + this.id;
    }
    assembleUrl(searchOptions, extendedSearchOptions) {
      // wrapper for getEshSearchQuery which adds functionality missing in getEshSearchQuery
      // missing functionality in getEshSearchQuery:
      // - cannot handle empty suggestions term
      // - cannot add nlq flag
      // - not escaping free style text

      // translate free style text to random string
      const dummyFreeStyleText = "FDGhfdhgfHFGHrdthfgcvgzjmbvndf";
      const freeStyleText = searchOptions?.freeStyleText;
      if (extendedSearchOptions?.doNotEsacpeFreeStyleText && searchOptions?.freeStyleText) {
        searchOptions.freeStyleText = dummyFreeStyleText;
      }

      // translate suggest term to random string
      const workaroundSuggestTerm = "fdjksghdfjkhvbbnfydfsd";
      if (extendedSearchOptions?.workaroundForEmptySuggestionTerm) {
        if (searchOptions.suggestTerm === "") {
          searchOptions.suggestTerm = workaroundSuggestTerm;
        }
      }

      // call original getEshSearchQuery
      let url = getEshSearchQuery(searchOptions);

      // add nlq parameter
      if (extendedSearchOptions?.nlq) {
        const index = url.indexOf("?");
        if (index >= 0) {
          url = url.slice(0, index + 1) + "nlq=true&" + url.slice(index + 1);
        } else {
          url += "?nlq=true";
        }
      }

      // backtranslate free style text
      if (extendedSearchOptions?.doNotEsacpeFreeStyleText) {
        if (searchOptions?.freeStyleText === dummyFreeStyleText) {
          url = url.replace(dummyFreeStyleText, encodeURIComponent("(" + freeStyleText + ")"));
        }
      }

      // backtranslate suggest term
      if (extendedSearchOptions?.workaroundForEmptySuggestionTerm) {
        if (searchOptions.suggestTerm === workaroundSuggestTerm) {
          url = url.replace(workaroundSuggestTerm, "");
        }
      }
      return url;
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.PresentationUsage = PresentationUsage;
  __exports.Provider = Provider;
  return __exports;
});
})();