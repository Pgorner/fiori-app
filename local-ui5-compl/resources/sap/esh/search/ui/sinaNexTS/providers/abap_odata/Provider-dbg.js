/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./ajax", "./ajaxTemplates", "./conditionSerializer", "../../core/core", "./dataSourceSerializer", "./labelCalculation", "./suggestionTermSplitter", "../AbstractProvider", "./FacetParser", "./ItemParser", "./suggestionParser", "./MetadataParser", "../../core/errors", "./nlqParser", "../../sina/SuggestionType"], function (___ajax, ajaxTemplates, conditionSerializer, core, dataSourceSerializer, labelCalculation, suggestionTermSplitter, ___AbstractProvider, ___FacetParser, ___ItemParser, ___suggestionParser, ___MetadataParser, ____core_errors, ___nlqParser, ____sina_SuggestionType) {
  "use strict";

  const createAjaxClient = ___ajax["createAjaxClient"];
  const AbstractProvider = ___AbstractProvider["AbstractProvider"];
  const FacetParser = ___FacetParser["FacetParser"];
  const ItemParser = ___ItemParser["ItemParser"];
  const SuggestionParser = ___suggestionParser["SuggestionParser"];
  const MetadataParser = ___MetadataParser["MetadataParser"];
  const ESHNotActiveError = ____core_errors["ESHNotActiveError"];
  const NotImplementedError = ____core_errors["NotImplementedError"];
  const parseNlqInfo = ___nlqParser["parseNlqInfo"];
  const SuggestionType = ____sina_SuggestionType["SuggestionType"];
  class Provider extends AbstractProvider {
    id = "abap_odata";
    contentProviderId;
    requestPrefix;
    ajaxClient;
    metadataLoadPromises;
    internalMetadata;
    labelCalculator;
    metadataParser;
    itemParser;
    facetParser;
    suggestionParser;
    sessionId;
    sorsNavigationTargetGenerator;
    serviceXML;
    async initAsync(configuration) {
      this.contentProviderId = configuration.contentProviderId;
      this.requestPrefix = configuration.url || "/sap/opu/odata/sap/ESH_SEARCH_SRV";
      this.sina = configuration.sina;
      this.ajaxClient = configuration.ajaxClient ?? createAjaxClient();
      this.metadataLoadPromises = {};
      this.internalMetadata = {};
      this.labelCalculator = labelCalculation.createLabelCalculator();
      this.metadataParser = new MetadataParser(this);
      this.itemParser = new ItemParser(this);
      this.facetParser = new FacetParser(this);
      this.suggestionParser = new SuggestionParser(this, this.itemParser);
      this.sessionId = core.generateGuid();
      this.sorsNavigationTargetGenerator = this.sina._createSorsNavigationTargetGenerator({
        urlPrefix: "#Action-search&/top=10&filter=",
        getPropertyMetadata(metadata) {
          return {
            name: metadata.id,
            label: metadata.label,
            semanticObjectType: metadata._private.semanticObjectType,
            response: !!(metadata.usage && (metadata.usage.Detail || metadata.usage.Title)),
            request: true
          };
        }
      });
      const serverInfo = await this.loadServerInfo();
      this.serverInfo = serverInfo.d.results[0];
      if (!this.supports("Search")) {
        throw new ESHNotActiveError();
      }
      await this.loadBusinessObjectDataSources();
      return {
        capabilities: this.sina._createCapabilities({
          fuzzy: false,
          nlq: this.supports("Search", "NLSSearch")
        })
      };
    }
    supports(service, capability) {
      // pseudo miscellaneous service
      // having InteractionEventLists and NavigationEvents capability
      if (service === "misc") {
        let annotationsQueryString = "";
        if (capability === "InteractionEventLists") {
          annotationsQueryString = "Schema[Namespace=ESH_SEARCH_SRV]>EntityContainer[Name=ESH_SEARCH_SRV_Entities]>EntitySet[Name=InteractionEventLists]";
        }
        if (capability === "NavigationEvents") {
          annotationsQueryString = "Schema[Namespace=ESH_SEARCH_SRV]>EntityContainer[Name=ESH_SEARCH_SRV_Entities]>EntitySet[Name=NavigationEvents]";
        }
        if (annotationsQueryString.length !== 0) {
          const nodes = this.querySelectorAll(annotationsQueryString);
          return nodes.length > 0;
        }
      }

      // server defined services
      for (let i = 0; i < this.serverInfo.Services.results.length; ++i) {
        const checkService = this.serverInfo.Services.results[i];
        if (checkService.Id == service) {
          if (!capability) {
            return true;
          }
          for (let j = 0; j < checkService.Capabilities.results.length; ++j) {
            const checkCapability = checkService.Capabilities.results[j];
            if (checkCapability.Id === capability) {
              return true;
            }
          }
        }
      }
      return false;
    }
    loadServerInfo() {
      const requestUrlServerInfos = this.buildQueryUrl(this.requestPrefix, "/ServerInfos?$expand=Services/Capabilities");
      const requestUrlMetadata = this.buildQueryUrl(this.requestPrefix, "/$metadata");
      const serverInfosProm = this.ajaxClient.getJson(requestUrlServerInfos);
      const metadataProm = this.ajaxClient.getXML(requestUrlMetadata);
      return Promise.all([serverInfosProm, metadataProm]).then(values => {
        const response = values[0];
        const serviceXML = values[1];
        if (core.isBrowserEnv()) {
          const oParser = new DOMParser();
          const oDOM = oParser.parseFromString(serviceXML, "text/xml");
          if (oDOM.documentElement.nodeName != "parsererror") {
            this.serviceXML = oDOM;
          }
        } else {
          // Node.js sina tests
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          const jsdom = require("jsdom");
          const dom = new jsdom.JSDOM(serviceXML);
          this.serviceXML = dom.window.document;
        }
        return response.data;
      }); // cast from generic response to provider specific response
    }
    loadBusinessObjectDataSources() {
      // complete requestUrlTemplate is "/DataSources?$expand=Annotations,Attributes/UIAreas,Attributes/Annotations&$filter=Type eq 'View' and IsInternal eq false";
      let requestUrlTemplate = "/DataSources?$expand=Annotations,Attributes/UIAreas,Attributes/Annotations&$filter=Type eq 'View'";
      if (this.serviceXML) {
        if (!this.isCDSAnnotationSupported()) {
          // Do not query for annotations in data sources request
          requestUrlTemplate = "/DataSources?$expand=Attributes/UIAreas&$filter=Type eq 'View'";
        }
        const isInternalPath = "Schema[Namespace=ESH_SEARCH_SRV]>EntityType[Name=DataSource]>Property[Name=IsInternal]";
        if (this.isQueryPropertySupported(isInternalPath)) {
          // add isInternal filter in data sources request
          requestUrlTemplate = requestUrlTemplate + " and IsInternal eq false";
        }
      }
      const requestUrl = this.buildQueryUrl(this.requestPrefix, requestUrlTemplate);
      return this.ajaxClient.getJson(requestUrl).then(function (response) {
        const dataSourcesData = response.data.d.results;
        this.metadataParser.parseDataSourceData(dataSourcesData, this.sorsNavigationTargetGenerator);
        this.sorsNavigationTargetGenerator.finishRegistration();
      }.bind(this));
    }
    isCDSAnnotationSupported() {
      if (!this.serviceXML) {
        return false;
      }
      const annotationsQueryString = "Schema[Namespace='ESH_SEARCH_SRV']>EntityType[Name='DataSource'][*|content-version='1']>NavigationProperty[Name='Annotations']," + "Schema[Namespace='ESH_SEARCH_SRV']>EntityType[Name='DataSourceAttribute'][*|content-version='1']>NavigationProperty[Name='Annotations']";
      const elements = this.querySelectorAll(annotationsQueryString);
      if (elements.length < 2) {
        // very old oData service
        return false;
      }

      // new oData service
      // may have more than 2 types of annotation in the futrue
      return true;
    }
    assembleOrderBy(query) {
      const result = [];
      for (let i = 0; i < query.sortOrder.length; ++i) {
        const sortKey = query.sortOrder[i];
        const sortOrder = sortKey.order === this.sina.SortOrder.Descending ? "desc" : "asc";
        result.push({
          AttributeId: sortKey.id,
          SortOrder: sortOrder
        });
      }
      return result;
    }
    async executeSearchQuery(query) {
      let requestTemplate = ajaxTemplates.searchRequest;
      const clientServiceNamePath = "Schema[Namespace=ESH_SEARCH_SRV]>EntityType[Name=SearchOptions]>Property[Name=ClientServiceName]";
      if (!this.isQueryPropertySupported(clientServiceNamePath)) {
        // remove ClientServiceName from data sources request
        delete requestTemplate.d.QueryOptions.ClientServiceName;
      }
      requestTemplate = JSON.parse(JSON.stringify(requestTemplate));
      const rootCondition = query.filter.rootCondition.clone();
      const filter = conditionSerializer.serialize(query.filter.dataSource, rootCondition);
      if (filter.SubFilters.length !== 0) {
        requestTemplate.d.Filter = filter;
      } else {
        delete requestTemplate.d.Filter;
      }
      requestTemplate.d.DataSources = dataSourceSerializer.serialize(query.filter.dataSource);
      requestTemplate.d.QueryOptions.SearchTerms = query.filter.searchTerm;
      requestTemplate.d.QueryOptions.Top = query.top;
      requestTemplate.d.QueryOptions.Skip = query.skip;
      requestTemplate.d.OrderBy = this.assembleOrderBy(query);
      this.addSessionId(requestTemplate);
      if (!query.calculateFacets) {
        delete requestTemplate.d.MaxFacetValues;
        delete requestTemplate.d.Facets;
      } else {
        requestTemplate.d.MaxFacetValues = 5;
        requestTemplate.d.Facets = [{
          Values: []
        }];
      }

      // nlq
      if (query.nlq) {
        requestTemplate.d.ActivateNLQ = true;
        requestTemplate.d.ResultList.NLQQueries = [{
          NLQConnectorQueries: []
        }];
      }

      // build request url
      const requestUrl = this.buildQueryUrl(this.requestPrefix, "/SearchQueries");

      // fire request
      const response = await this.ajaxClient.postJson(requestUrl, requestTemplate);

      // parse
      this.metadataParser.parseDynamicMetadata(response.data.d);
      const items = await this.itemParser.parse(query, response.data.d);
      const facets = await this.facetParser.parse(query, response.data.d);
      const nlqResult = parseNlqInfo(this.sina, response.data.d?.ResultList?.NLQQueries?.results);

      // create search result set
      const searchResultSet = this.sina._createSearchResultSet({
        id: response.data.d.ResultList.ExecutionID,
        title: "Search Result List",
        query: query,
        items: items,
        totalCount: response.data.d.ResultList.TotalHits,
        facets: facets,
        nlqResult: nlqResult
      });

      // generate navigation targets based on foreig keys
      this.sorsNavigationTargetGenerator.generateNavigationTargets(searchResultSet);
      return searchResultSet;
    }
    executeChartQuery(query) {
      let requestUrl = "";
      let requestTemplate;
      const rootCondition = query.filter.rootCondition.clone();
      let filter;
      if (this.decideValueHelp(query)) {
        // value help chart query
        requestTemplate = JSON.parse(JSON.stringify(ajaxTemplates.valueHelperRequest));
        this.removeClientOptions(requestTemplate);
        requestTemplate.d.ValueHelpAttribute = query.dimension;
        filter = conditionSerializer.serialize(query.filter.dataSource, rootCondition);
        if (filter.SubFilters.length !== 0) {
          requestTemplate.d.Filter = filter;
        } else {
          delete requestTemplate.d.Filter;
        }
        requestTemplate.d.ValueFilter = this.getFilterValueFromConditionTree(query.dimension, filter);
        requestTemplate.d.QueryOptions.SearchTerms = query.filter.searchTerm;
        requestTemplate.d.DataSources = dataSourceSerializer.serialize(query.filter.dataSource);
        requestUrl = this.buildQueryUrl(this.requestPrefix, "/ValueHelpQueries");
        // nlq not supported by backend
        /*if (query.nlq) {
            requestTemplate.d.ActivateNLQ = true;
        }*/
      } else {
        // normal chart query
        requestTemplate = JSON.parse(JSON.stringify(ajaxTemplates.chartRequest));
        filter = conditionSerializer.serialize(query.filter.dataSource, rootCondition);
        if (filter.SubFilters.length !== 0) {
          requestTemplate.d.Filter = filter;
        } else {
          delete requestTemplate.d.Filter;
        }
        requestTemplate.d.DataSources = dataSourceSerializer.serialize(query.filter.dataSource);
        requestTemplate.d.QueryOptions.SearchTerms = query.filter.searchTerm;
        requestTemplate.d.QueryOptions.Skip = 0;
        this.addSessionId(requestTemplate);
        requestTemplate.d.FacetRequests = [{
          DataSourceAttribute: query.dimension
        }];
        requestTemplate.d.MaxFacetValues = query.top;
        requestUrl = this.buildQueryUrl(this.requestPrefix, "/SearchQueries");
        // nlq
        if (query.nlq) {
          requestTemplate.d.ActivateNLQ = true;
        }
      }
      return this.ajaxClient.postJson(requestUrl, requestTemplate).then(function (response) {
        // DataSourceAttribute is facet attribute
        return this.facetParser.parse(query, response.data.d);
      }.bind(this)).then(function (facets) {
        if (facets.length > 0) {
          return facets[0];
        }
        return this.sina._createChartResultSet({
          title: query.filter.dataSource.getAttributeMetadata(query.dimension).label,
          items: [],
          query: query
        });
      }.bind(this));
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    executeHierarchyQuery(query) {
      throw new NotImplementedError();
    }
    decideValueHelp(query) {
      const conditions = query.filter.rootCondition.conditions;
      for (let i = 0; i < conditions.length; i++) {
        if (query.filter._getAttribute(conditions[i]) === query.dimension) {
          return true;
        }
      }
      return false;
    }
    async executeSuggestionQuery(query) {
      // handle regular suggestions and object suggestion separately because
      // object suggestions have only searchterms and no suggestionInput
      return Promise.all([this.executeRegularSuggestionQuery(query), this.executeObjectSuggestionQuery(query)]).then(function (results) {
        const suggestions = [];
        suggestions.push(...results[1]);
        suggestions.push(...results[0]);
        return this.sina._createSuggestionResultSet({
          title: "Suggestions",
          query: query,
          items: suggestions
        });
      }.bind(this));
    }
    isObjectSuggestionQuery(query) {
      return query.types.indexOf("Object") >= 0 && query.filter.dataSource.type === query.sina.DataSourceType.BusinessObject;
    }
    executeObjectSuggestionQuery(query) {
      // check query type
      if (!this.supports("ObjectSuggestions") || !this.isObjectSuggestionQuery(query)) {
        return Promise.resolve([]);
      }

      // build request
      const requestTemplate = JSON.parse(JSON.stringify(ajaxTemplates.objectSuggestionRequest));
      const rootCondition = query.filter.rootCondition.clone();
      const filter = conditionSerializer.serialize(query.filter.dataSource, rootCondition);
      if (filter.SubFilters.length !== 0) {
        requestTemplate.d.Filter = filter;
      } else {
        delete requestTemplate.d.Filter;
      }
      requestTemplate.d.DataSources = dataSourceSerializer.serialize(query.filter.dataSource);
      requestTemplate.d.QueryOptions.Top = query.top;
      requestTemplate.d.QueryOptions.Skip = query.skip;
      requestTemplate.d.QueryOptions.SearchTerms = query.filter.searchTerm;
      this.addSessionId(requestTemplate);

      // nlq
      if (query.nlq) {
        requestTemplate.d.ActivateNLQ = true;
      }

      // build request url
      const requestUrl = this.buildQueryUrl(this.requestPrefix, "/SuggestionsQueries");

      // fire request
      return this.ajaxClient.postJson(requestUrl, requestTemplate).then(response => this.suggestionParser.parseObjectSuggestions(query, response.data));
    }
    executeRegularSuggestionQuery(query) {
      // AI suggestions not supported
      if (query.types.indexOf(SuggestionType.SearchTermAI) >= 0) {
        return [];
      }
      const requestTemplate = JSON.parse(JSON.stringify(ajaxTemplates.suggestionRequest));

      // split search term in query into (1) searchTerm (2) suggestionTerm
      const searchTerm = query.filter.searchTerm;
      const splittedTerm = suggestionTermSplitter.split(searchTerm);

      // add search term to condition
      const rootCondition = query.filter.rootCondition.clone();

      // assemble request
      const filter = conditionSerializer.serialize(query.filter.dataSource, rootCondition);
      if (filter.SubFilters.length !== 0) {
        requestTemplate.d.Filter = filter;
      } else {
        delete requestTemplate.d.Filter;
      }
      requestTemplate.d.DataSources = dataSourceSerializer.serialize(query.filter.dataSource);
      requestTemplate.d.QueryOptions.Top = query.top;
      requestTemplate.d.QueryOptions.Skip = query.skip;
      requestTemplate.d.SuggestionInput = splittedTerm.suggestionTerm;
      requestTemplate.d.QueryOptions.SearchTerms = splittedTerm.searchTerm === null ? "" : splittedTerm.searchTerm;
      if (!this.includeSuggestionTypes(query, requestTemplate)) {
        // no regular suggestions requested -> return
        return [];
      }
      this.addSessionId(requestTemplate);

      // nlq
      if (query.nlq) {
        requestTemplate.d.ActivateNLQ = true;
      }

      // build request url
      const requestUrl = this.buildQueryUrl(this.requestPrefix, "/SuggestionsQueries");

      // fire request
      return this.ajaxClient.postJson(requestUrl, requestTemplate).then(response => this.suggestionParser.parseRegularSuggestions(query, response.data // cast from generic response to provider specific response
      )).then(suggestions => {
        suggestionTermSplitter.concatenate(splittedTerm, suggestions);
        return suggestions;
      });
    }
    includeSuggestionTypes(query, suggestionRequest) {
      const sina2OdataConversion = {
        SearchTerm: {
          Data: "IncludeAttributeSuggestions",
          History: "IncludeHistorySuggestions"
        },
        Object: {},
        DataSource: {
          Data: "IncludeDataSourceSuggestions"
        }
      };
      const suggestionTypes = query.types;
      const calculationModes = query.calculationModes;
      let success = false;
      for (let i = 0; i < suggestionTypes.length; i++) {
        const suggestionType = suggestionTypes[i];
        for (let j = 0; j < calculationModes.length; j++) {
          const calculationMode = calculationModes[j];
          const value = sina2OdataConversion[suggestionType][calculationMode];
          if (typeof value === "undefined") {
            continue;
          }
          suggestionRequest.d[value] = true;
          success = true;
        }
      }
      return success;
    }
    addSessionId(request) {
      request.d.QueryOptions.ClientSessionID = this.sessionId;
      const timeStamp = new Date().getTime();
      request.d.QueryOptions.ClientCallTimestamp = "\\/Date(" + timeStamp + ")\\/";
    }
    removeClientOptions(request) {
      delete request.d.QueryOptions.ClientSessionID;
      delete request.d.QueryOptions.ClientCallTimestamp;
      delete request.d.QueryOptions.ClientServiceName;
      delete request.d.QueryOptions.ClientLastExecutionID;
    }
    getFilterValueFromConditionTree(dimension, conditionTree) {
      if (conditionTree.ConditionAttribute && conditionTree.ConditionAttribute === dimension) {
        return conditionTree.ConditionValue;
      } else if (conditionTree.SubFilters) {
        let i;
        let result = null;
        for (i = 0; result === null && i < conditionTree.SubFilters.length; i++) {
          result = this.getFilterValueFromConditionTree(dimension, conditionTree.SubFilters[i]);
        }
        return result;
      }
      return null;
    }
    getConfigurationAsync() {
      let requestUrl = this.buildQueryUrl(this.requestPrefix, "/PersonalizedSearchMainSwitches?$filter=Selected eq true");
      return this.ajaxClient.getJson(requestUrl).then(response => {
        const config = {
          personalizedSearch: false,
          isPersonalizedSearchEditable: false
        };
        const responseData = response.data;
        switch (responseData.d.results[0].MainSwitch) {
          case 3:
            // Enabled after user‘s approval
            config.isPersonalizedSearchEditable = true;
            break;
          case 4:
            // Enabled until user‘s rejection
            config.isPersonalizedSearchEditable = true;
            break;
          case 2:
            // Enabled for all users
            config.isPersonalizedSearchEditable = false;
            break;
          case 1:
            // Disabled for all users
            config.isPersonalizedSearchEditable = false;
            break;
        }
        requestUrl = this.buildQueryUrl(this.requestPrefix, "/Users('<current>')");
        return this.ajaxClient.getJson(requestUrl).then(function (response) {
          if (response.data.d.IsEnabledForPersonalizedSearch) {
            config.personalizedSearch = true;
          }
          return this.sina._createConfiguration(config);
        }.bind(this));
      });
    }
    saveConfigurationAsync(configuration) {
      const data = {
        IsEnabledForPersonalizedSearch: configuration.personalizedSearch
      };
      const requestUrl = this.buildQueryUrl(this.requestPrefix, "/Users('<current>')");
      return this.ajaxClient.mergeJson(requestUrl, data);
    }
    resetPersonalizedSearchDataAsync() {
      const data = {
        ClearPersonalizedSearchHistory: true
      };
      const requestUrl = this.buildQueryUrl(this.requestPrefix, "/Users('<current>')");
      return this.ajaxClient.mergeJson(requestUrl, data);
    }
    buildQueryUrl(queryPrefix, queryPostfix) {
      if (typeof window === "undefined") {
        // sina mocha tests on node
        return queryPrefix + queryPostfix;
      }
      const windowUrl = window.location.href;
      let requestUrl = "";
      let systemStringBegin;
      let systemString = "";
      let systemInRequestUrl = "";

      // assign search backend system manuelly
      // url: esh-system=sid(PH6.002) -> query: ;o=sid(PH6.002)
      systemStringBegin = windowUrl.indexOf("esh-system=sid(");
      if (systemStringBegin !== -1) {
        const systemStringEnd = windowUrl.substring(systemStringBegin).indexOf(")");
        if (systemStringEnd !== -1) {
          systemString = windowUrl.substring(systemStringBegin + 15, systemStringBegin + systemStringEnd);
          if (systemString.length !== 0) {
            systemInRequestUrl = ";o=sid(" + systemString + ")";
          }
        }
      }

      // assign search backend system manuelly
      // url: esh-system=ALIASNAMEXYZCLNT002 -> query: ;o=sid(ALIASNAMEXYZCLNT002)
      if (systemString.length === 0) {
        systemStringBegin = windowUrl.indexOf("esh-system=");
        if (systemStringBegin !== -1) {
          const systemStringEnd1 = windowUrl.substring(systemStringBegin).indexOf("&");
          const systemStringEnd2 = windowUrl.substring(systemStringBegin).indexOf("#");
          if (systemStringEnd1 !== -1 && systemStringEnd2 !== -1) {
            if (systemStringEnd1 < systemStringEnd2) {
              systemString = windowUrl.substring(systemStringBegin + 11, systemStringBegin + systemStringEnd1);
            } else {
              systemString = windowUrl.substring(systemStringBegin + 11, systemStringBegin + systemStringEnd2);
            }
          }
          if (systemStringEnd1 !== -1 && systemStringEnd2 === -1) {
            systemString = windowUrl.substring(systemStringBegin + 11, systemStringBegin + systemStringEnd1);
          }
          if (systemStringEnd1 === -1 && systemStringEnd2 !== -1) {
            systemString = windowUrl.substring(systemStringBegin + 11, systemStringBegin + systemStringEnd2);
          }
          if (systemStringEnd1 === -1 && systemStringEnd2 === -1) {
            systemString = windowUrl.substring(systemStringBegin + 11);
          }
        }
        if (systemString.length !== 0) {
          systemInRequestUrl = ";o=" + systemString;
        }
      }
      requestUrl = queryPrefix + systemInRequestUrl + queryPostfix;
      return requestUrl;
    }
    getDebugInfo() {
      return `Searchsystem: ${this.serverInfo.SystemId} Client: ${this.serverInfo.Client} ESH Search API Provider: ${this.id}`;
    }
    isQueryPropertySupported(path) {
      if (this.serviceXML === undefined) {
        return false;
      }
      const elements = this.querySelectorAll(path);
      if (elements.length > 0) {
        return true;
      }
      return false;
    }
    transformPathToJsDomPath(query) {
      function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }
      function replaceAll(str, find, replace) {
        return str.replace(new RegExp(escapeRegExp(find), "g"), replace);
      }
      const replacementRules = [
      // tags to lowercase
      ["Schema", "schema"], ["EntityType", "entitytype"], ["EntityContainer", "entitycontainer"], ["EntitySet", "EntitySet"], ["NavigationProperty", "navigationproperty"], ["Property", "property"],
      // child selector to descendant selector
      [">", " "],
      // prefix by by namespace
      ["content-version", "sap:\\content-version"]];
      for (const replacementRule of replacementRules) {
        const [oldTerm, newTerm] = replacementRule;
        query = replaceAll(query, oldTerm, newTerm);
      }
      return query;
    }
    querySelectorAll(path) {
      if (this.serviceXML === undefined) {
        return undefined;
      }
      if (!core.isBrowserEnv()) {
        path = this.transformPathToJsDomPath(path);
      }
      return this.serviceXML.querySelectorAll(path);
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.Provider = Provider;
  return __exports;
});
})();