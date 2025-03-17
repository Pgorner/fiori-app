/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../core/core", "../core/errors", "../core/util", "./AttributeType", "./AttributeFormatType", "./AttributeGroupTextArrangement", "./DataSourceType", "./MatchingStrategy", "./LogicalOperator", "./ComparisonOperator", "./FacetType", "./SuggestionCalculationMode", "./SuggestionType", "./SortOrder", "./ConditionType", "../providers/tools/cds/CDSAnnotationsParser", "../providers/tools/sors/NavigationTargetGenerator", "./SearchResultSet", "./SearchResultSetItem", "./SearchResultSetItemAttribute", "./ObjectSuggestion", "./SearchQuery", "./ChartQuery", "./SuggestionQuery", "./DataSourceQuery", "./Filter", "./ComplexCondition", "./SimpleCondition", "./AttributeMetadata", "./AttributeGroupMetadata", "./AttributeGroupMembership", "./SearchResultSetItemAttributeGroup", "./SearchResultSetItemAttributeGroupMembership", "./SearchTermSuggestion", "./SearchTermAndDataSourceSuggestion", "./DataSourceSuggestion", "./SuggestionResultSet", "./ChartResultSet", "./DataSourceResultSet", "./ChartResultSetItem", "./DataSourceResultSetItem", "./Capabilities", "./Configuration", "./NavigationTarget", "./DataSource", "./UserCategoryDataSource", "../providers/tools/ItemPostParser", "../providers/tools/fiori/SuvNavTargetResolver", "../providers/tools/fiori/FioriIntentsResolver", "./formatters/ResultValueFormatter", "./formatters/NavtargetsInResultSetFormatter", "./formatters/HierarchyResultSetFormatter", "./FilteredDataSource", "../providers/inav2/Provider", "../providers/abap_odata/Provider", "./HierarchyQuery", "./HierarchyNode", "./HierarchyResultSet", "../providers/inav2/typeConverter", "./HierarchyNodePath", "./HierarchyDisplayType", "./formatters/SuggestionResultValueFormatter", "./SearchTermAISuggestion"], function (core, errors, util, ___AttributeType, ___AttributeFormatType, ___AttributeGroupTextArrangement, ___DataSourceType, ___MatchingStrategy, ___LogicalOperator, ___ComparisonOperator, ___FacetType, ___SuggestionCalculationMode, ___SuggestionType, ___SortOrder, ___ConditionType, ___providers_tools_cds_CDSAnnotationsParser, ___providers_tools_sors_NavigationTargetGenerator, ___SearchResultSet, ___SearchResultSetItem, ___SearchResultSetItemAttribute, ___ObjectSuggestion, ___SearchQuery, ___ChartQuery, ___SuggestionQuery, ___DataSourceQuery, ___Filter, ___ComplexCondition, ___SimpleCondition, ___AttributeMetadata, ___AttributeGroupMetadata, ___AttributeGroupMembership, ___SearchResultSetItemAttributeGroup, ___SearchResultSetItemAttributeGroupMembership, ___SearchTermSuggestion, ___SearchTermAndDataSourceSuggestion, ___DataSourceSuggestion, ___SuggestionResultSet, ___ChartResultSet, ___DataSourceResultSet, ___ChartResultSetItem, ___DataSourceResultSetItem, ___Capabilities, ___Configuration, ___NavigationTarget, ___DataSource, ___UserCategoryDataSource, ___providers_tools_ItemPostParser, ___providers_tools_fiori_SuvNavTargetResolver, ___providers_tools_fiori_FioriIntentsResolver, ___formatters_ResultValueFormatter, ___formatters_NavtargetsInResultSetFormatter, ___formatters_HierarchyResultSetFormatter, ___FilteredDataSource, ___providers_inav2_Provider, ___providers_abap_odata_Provider, ___HierarchyQuery, ___HierarchyNode, ___HierarchyResultSet, inav2TypeConverter, ___HierarchyNodePath, ___HierarchyDisplayType, ___formatters_SuggestionResultValueFormatter, ___SearchTermAISuggestion) {
  "use strict";

  const AttributeType = ___AttributeType["AttributeType"];
  const AttributeFormatType = ___AttributeFormatType["AttributeFormatType"];
  const AttributeGroupTextArrangement = ___AttributeGroupTextArrangement["AttributeGroupTextArrangement"];
  const DataSourceSubType = ___DataSourceType["DataSourceSubType"];
  const DataSourceType = ___DataSourceType["DataSourceType"];
  const MatchingStrategy = ___MatchingStrategy["MatchingStrategy"];
  const LogicalOperator = ___LogicalOperator["LogicalOperator"];
  const ComparisonOperator = ___ComparisonOperator["ComparisonOperator"];
  const FacetType = ___FacetType["FacetType"];
  const SuggestionCalculationMode = ___SuggestionCalculationMode["SuggestionCalculationMode"];
  const SuggestionType = ___SuggestionType["SuggestionType"];
  const SortOrder = ___SortOrder["SortOrder"];
  const ConditionType = ___ConditionType["ConditionType"];
  const CDSAnnotationsParser = ___providers_tools_cds_CDSAnnotationsParser["CDSAnnotationsParser"];
  const SorsNavigationTargetGenerator = ___providers_tools_sors_NavigationTargetGenerator["NavigationTargetGenerator"];
  const SearchResultSet = ___SearchResultSet["SearchResultSet"];
  const SearchResultSetItem = ___SearchResultSetItem["SearchResultSetItem"];
  const SearchResultSetItemAttribute = ___SearchResultSetItemAttribute["SearchResultSetItemAttribute"];
  const ObjectSuggestion = ___ObjectSuggestion["ObjectSuggestion"];
  const SearchQuery = ___SearchQuery["SearchQuery"];
  const ChartQuery = ___ChartQuery["ChartQuery"];
  const SuggestionQuery = ___SuggestionQuery["SuggestionQuery"];
  const DataSourceQuery = ___DataSourceQuery["DataSourceQuery"];
  const Filter = ___Filter["Filter"];
  const ComplexCondition = ___ComplexCondition["ComplexCondition"];
  const SimpleCondition = ___SimpleCondition["SimpleCondition"];
  const AttributeMetadata = ___AttributeMetadata["AttributeMetadata"];
  const AttributeGroupMetadata = ___AttributeGroupMetadata["AttributeGroupMetadata"];
  const AttributeGroupMembership = ___AttributeGroupMembership["AttributeGroupMembership"];
  const SearchResultSetItemAttributeGroup = ___SearchResultSetItemAttributeGroup["SearchResultSetItemAttributeGroup"];
  const SearchResultSetItemAttributeGroupMembership = ___SearchResultSetItemAttributeGroupMembership["SearchResultSetItemAttributeGroupMembership"];
  const SearchTermSuggestion = ___SearchTermSuggestion["SearchTermSuggestion"];
  const SearchTermAndDataSourceSuggestion = ___SearchTermAndDataSourceSuggestion["SearchTermAndDataSourceSuggestion"];
  const DataSourceSuggestion = ___DataSourceSuggestion["DataSourceSuggestion"];
  const SuggestionResultSet = ___SuggestionResultSet["SuggestionResultSet"];
  const ChartResultSet = ___ChartResultSet["ChartResultSet"];
  const DataSourceResultSet = ___DataSourceResultSet["DataSourceResultSet"];
  const ChartResultSetItem = ___ChartResultSetItem["ChartResultSetItem"];
  const DataSourceResultSetItem = ___DataSourceResultSetItem["DataSourceResultSetItem"];
  const Capabilities = ___Capabilities["Capabilities"];
  const Configuration = ___Configuration["Configuration"];
  const NavigationTarget = ___NavigationTarget["NavigationTarget"];
  const DataSource = ___DataSource["DataSource"];
  const UserCategoryDataSource = ___UserCategoryDataSource["UserCategoryDataSource"];
  const ItemPostParser = ___providers_tools_ItemPostParser["ItemPostParser"];
  const SuvNavTargetResolver = ___providers_tools_fiori_SuvNavTargetResolver["SuvNavTargetResolver"];
  const FioriIntentsResolver = ___providers_tools_fiori_FioriIntentsResolver["FioriIntentsResolver"];
  const ResultValueFormatter = ___formatters_ResultValueFormatter["ResultValueFormatter"];
  const NavtargetsInResultSetFormatter = ___formatters_NavtargetsInResultSetFormatter["NavtargetsInResultSetFormatter"];
  const HierarchyResultSetFormatter = ___formatters_HierarchyResultSetFormatter["HierarchyResultSetFormatter"];
  const FilteredDataSource = ___FilteredDataSource["FilteredDataSource"];
  const InAV2Provider = ___providers_inav2_Provider["Provider"];
  const ABAPODataProvider = ___providers_abap_odata_Provider["Provider"];
  const HierarchyQuery = ___HierarchyQuery["HierarchyQuery"];
  const HierarchyNode = ___HierarchyNode["HierarchyNode"];
  const HierarchyResultSet = ___HierarchyResultSet["HierarchyResultSet"];
  const HierarchyNodePath = ___HierarchyNodePath["HierarchyNodePath"];
  const HierarchyDisplayType = ___HierarchyDisplayType["HierarchyDisplayType"];
  const SuggestionResultValueFormatter = ___formatters_SuggestionResultValueFormatter["SuggestionResultValueFormatter"];
  const ESHNoBusinessObjectDatasourceError = errors["ESHNoBusinessObjectDatasourceError"];
  const SearchTermAISuggestion = ___SearchTermAISuggestion["SearchTermAISuggestion"];
  /**
   * The Enterprise Search Client API.
   */
  class Sina {
    errorList = [];
    inav2TypeConverter;
    provider;
    createSearchNavigationTarget;
    createSearchQuery;
    createChartQuery;
    createHierarchyQuery;
    createSuggestionQuery;
    createDataSourceQuery;
    createFilter;
    createComplexCondition;
    createSimpleCondition;
    createHierarchyNode;
    createHierarchyNodePath;
    _createAttributeMetadata;
    _createAttributeGroupMetadata;
    _createAttributeGroupMembership;
    _createSearchResultSetItemAttribute;
    _createSearchResultSetItemAttributeGroup;
    _createSearchResultSetItemAttributeGroupMembership;
    _createSearchResultSetItem;
    _createSearchResultSet;
    _createSearchTermSuggestion;
    _createSearchTermAISuggestion;
    _createSearchTermAndDataSourceSuggestion;
    _createDataSourceSuggestion;
    _createObjectSuggestion;
    _createSuggestionResultSet;
    _createChartResultSet;
    _createHierarchyResultSet;
    _createChartResultSetItem;
    _createDataSourceResultSetItem;
    _createCapabilities;
    _createConfiguration;
    _createNavigationTarget;
    createNavigationTarget;
    _createSorsNavigationTargetGenerator;
    _createFioriIntentsResolver;
    _createCDSAnnotationsParser;
    _createItemPostParser;
    _createSuvNavTargetResolver;
    searchResultSetFormatters;
    suggestionResultSetFormatters;
    chartResultSetFormatters;
    metadataFormatters;
    dataSources;
    dataSourceMap;
    allDataSource;
    DataSourceType;
    HierarchyDisplayType;
    DataSourceSubType;
    isDummyProvider;
    configurationPromise;
    capabilities;
    core;
    errors;
    util;
    SortOrder;
    ComparisonOperator;
    LogicalOperator;
    AttributeGroupTextArrangement;
    AttributeType;
    AttributeFormatType;
    FacetType;
    SuggestionType;
    ConditionType;
    SuggestionCalculationMode;
    MatchingStrategy;
    configuration;
    constructor(provider) {
      this.core = core; // convenience: expose core lib
      this.errors = errors; // convenience: expose core lib
      this.util = util; // convenience: expose util lib
      this.inav2TypeConverter = inav2TypeConverter; // do not use except for inav2 compatability
      this.provider = provider;
      this.createSearchQuery = this.createSinaObjectFactory(SearchQuery);
      this.createChartQuery = this.createSinaObjectFactory(ChartQuery);
      this.createHierarchyQuery = this.createSinaObjectFactory(HierarchyQuery);
      this.createSuggestionQuery = this.createSinaObjectFactory(SuggestionQuery);
      this.createDataSourceQuery = this.createSinaObjectFactory(DataSourceQuery);
      this.createFilter = this.createSinaObjectFactory(Filter);
      this.createComplexCondition = this.createSinaObjectFactory(ComplexCondition);
      this.createSimpleCondition = this.createSinaObjectFactory(SimpleCondition);
      this.createHierarchyNode = this.createSinaObjectFactory(HierarchyNode);
      this.createHierarchyNodePath = this.createSinaObjectFactory(HierarchyNodePath);
      this._createAttributeMetadata = this.createSinaObjectFactory(AttributeMetadata);
      this._createAttributeGroupMetadata = this.createSinaObjectFactory(AttributeGroupMetadata);
      this._createAttributeGroupMembership = this.createSinaObjectFactory(AttributeGroupMembership);
      this._createSearchResultSetItemAttribute = this.createSinaObjectFactory(SearchResultSetItemAttribute);
      this._createSearchResultSetItemAttributeGroup = this.createSinaObjectFactory(SearchResultSetItemAttributeGroup);
      this._createSearchResultSetItemAttributeGroupMembership = this.createSinaObjectFactory(SearchResultSetItemAttributeGroupMembership);
      this._createSearchResultSetItem = this.createSinaObjectFactory(SearchResultSetItem);
      this._createSearchResultSet = this.createSinaObjectFactory(SearchResultSet);
      this._createSearchTermSuggestion = this.createSinaObjectFactory(SearchTermSuggestion);
      this._createSearchTermAISuggestion = this.createSinaObjectFactory(SearchTermAISuggestion);
      this._createSearchTermAndDataSourceSuggestion = this.createSinaObjectFactory(SearchTermAndDataSourceSuggestion);
      this._createDataSourceSuggestion = this.createSinaObjectFactory(DataSourceSuggestion);
      this._createObjectSuggestion = this.createSinaObjectFactory(ObjectSuggestion);
      this._createSuggestionResultSet = this.createSinaObjectFactory(SuggestionResultSet);
      this._createChartResultSet = this.createSinaObjectFactory(ChartResultSet);
      this._createHierarchyResultSet = this.createSinaObjectFactory(HierarchyResultSet);
      this._createChartResultSetItem = this.createSinaObjectFactory(ChartResultSetItem);
      this._createDataSourceResultSetItem = this.createSinaObjectFactory(DataSourceResultSetItem);
      this._createCapabilities = this.createSinaObjectFactory(Capabilities);
      this._createConfiguration = this.createSinaObjectFactory(Configuration);
      this._createNavigationTarget = this.createSinaObjectFactory(NavigationTarget); // deprecated
      this.createNavigationTarget = this.createSinaObjectFactory(NavigationTarget);
      this._createSorsNavigationTargetGenerator = this.createSinaObjectFactory(SorsNavigationTargetGenerator);
      this._createFioriIntentsResolver = this.createSinaObjectFactory(FioriIntentsResolver);
      this._createCDSAnnotationsParser = this.createSinaObjectFactory(CDSAnnotationsParser);
      this._createItemPostParser = this.createSinaObjectFactory(ItemPostParser);
      this._createSuvNavTargetResolver = this.createSinaObjectFactory(SuvNavTargetResolver);
      this.searchResultSetFormatters = [];
      this.suggestionResultSetFormatters = [];
      this.chartResultSetFormatters = [];
      this.metadataFormatters = [];
      this.dataSources = [];
      this.dataSourceMap = {};
      this.allDataSource = this.createDataSource({
        id: "All",
        label: "All",
        type: DataSourceType.Category
      });
      this.DataSourceType = DataSourceType;
      this.DataSourceSubType = DataSourceSubType;
      this.HierarchyDisplayType = HierarchyDisplayType;
      this.AttributeGroupTextArrangement = AttributeGroupTextArrangement;
      this.AttributeType = AttributeType;
      this.AttributeFormatType = AttributeFormatType;
      this.FacetType = FacetType;
      this.SuggestionType = SuggestionType;
      this.ConditionType = ConditionType;
      this.SuggestionCalculationMode = SuggestionCalculationMode;
      this.SortOrder = SortOrder;
      this.MatchingStrategy = MatchingStrategy;
      this.ComparisonOperator = ComparisonOperator;
      this.LogicalOperator = LogicalOperator;
    }
    hasErrors() {
      return this.errorList.length > 0;
    }
    getErrors() {
      return this.errorList;
    }
    addError(error) {
      this.errorList.push(error);
    }
    addErrors(errors) {
      this.errorList.push(...errors);
    }
    initInternalSearchResultSetFormatters(configuration) {
      this.searchResultSetFormatters.push(new NavtargetsInResultSetFormatter());
      // this.searchResultSetFormatters.push(new RemovePureAdvancedSearchFacetsFormatter());
      this.searchResultSetFormatters.push(new ResultValueFormatter({
        ui5NumberFormat: configuration.NumberFormat,
        ui5DateFormat: configuration.DateFormat
      }));
      this.searchResultSetFormatters.push(new HierarchyResultSetFormatter());
    }
    initInternalSuggestionResultValueFormatter(configuration) {
      this.suggestionResultSetFormatters.push(new SuggestionResultValueFormatter({
        ui5NumberFormat: configuration.NumberFormat,
        ui5DateFormat: configuration.DateFormat
      }));
    }
    async initAsync(configuration) {
      this.configuration = configuration;
      this.isDummyProvider = configuration.provider.indexOf("dummy") > -1;
      this.provider.label = configuration.label;
      this.initInternalSearchResultSetFormatters(configuration);
      this.initInternalSuggestionResultValueFormatter(configuration);

      // init custom formatters shall after the registration of the internal formatters
      try {
        await this.initCustomFormattersAsync(configuration);
      } catch (err) {
        throw new errors.SinaConfigurationError("_evaluateConfigurationAsync", err);
      }
      configuration.sina = this;
      let initializationResult = await this.provider.initAsync(configuration);
      initializationResult = initializationResult || {
        capabilities: null
      };
      this.capabilities = initializationResult.capabilities || this._createCapabilities({
        sina: this
      });

      // run meta data formatters
      // shall after the registration of the custom meta data formatter(initCustomFormattersAsync)
      try {
        await this._formatMetadataAsync();
      } catch (err) {
        throw new errors.SinaConfigurationError("metadataformatter(s)->formatAsync", err);
      }
      // initialization
      if (configuration.initAsync) {
        try {
          await configuration.initAsync(this);
        } catch (err) {
          throw new errors.SinaConfigurationError("configuration->initAsync", err);
        }
      }
      if (this.getBusinessObjectDataSources().length === 0 && !this.isDummyProvider) {
        throw new ESHNoBusinessObjectDatasourceError();
      }
    }
    _formatMetadataAsync() {
      return core.executeSequentialAsync(this.metadataFormatters, function (formatter) {
        return formatter.formatAsync({
          dataSources: this.dataSources
        });
      }.bind(this));
    }
    async initCustomFormattersAsync(configuration) {
      const promises = [];

      // search result set formatters
      if (configuration.searchResultSetFormatters) {
        for (let i = 0; i < configuration.searchResultSetFormatters.length; ++i) {
          const searchResultSetFormatter = configuration.searchResultSetFormatters[i];
          this.searchResultSetFormatters.push(searchResultSetFormatter);
          if (searchResultSetFormatter.initAsync) {
            promises.push(searchResultSetFormatter.initAsync());
          }
        }
      }

      // suggestion result set formatters
      if (configuration.suggestionResultSetFormatters) {
        for (let i = 0; i < configuration.suggestionResultSetFormatters.length; ++i) {
          const suggestionResultSetFormatter = configuration.suggestionResultSetFormatters[i];
          this.suggestionResultSetFormatters.push(suggestionResultSetFormatter);
          if (suggestionResultSetFormatter.initAsync) {
            promises.push(suggestionResultSetFormatter.initAsync());
          }
        }
      }

      // chart result set formatters
      if (configuration.chartResultSetFormatters) {
        for (let i = 0; i < configuration.chartResultSetFormatters.length; ++i) {
          const chartResultSetFormatter = configuration.chartResultSetFormatters[i];
          this.chartResultSetFormatters.push(chartResultSetFormatter);
          if (chartResultSetFormatter.initAsync) {
            promises.push(chartResultSetFormatter.initAsync());
          }
        }
      }

      // metadata formatters
      if (configuration.metadataFormatters) {
        for (let j = 0; j < configuration.metadataFormatters.length; ++j) {
          const metadataFormatter = configuration.metadataFormatters[j];
          this.metadataFormatters.push(metadataFormatter);
          if (metadataFormatter.initAsync) {
            promises.push(metadataFormatter.initAsync());
          }
        }
      }
      return Promise.all(promises);
    }
    async loadMetadata(dataSource) {
      // do not use
      // only for compatability inav2
      if (this.provider instanceof InAV2Provider) {
        if (this.provider.loadMetadata) {
          return this.provider.loadMetadata(dataSource);
        }
      }
      return Promise.resolve();
    }
    createDataSourceMap(dataSources) {
      const map = {};
      for (let i = 0; i < dataSources.length; ++i) {
        const dataSource = dataSources[i];
        map[dataSource.id] = dataSource;
      }
      return map;
    }
    createSinaObjectFactory(Clazz) {
      return function (properties) {
        properties = properties ?? {
          sina: this
        };
        properties.sina = this;
        try {
          return new Clazz(properties);
        } finally {
          delete properties.sina;
        }
      };
    }
    _createDataSourceResultSet(properties) {
      const filteredItems = this.removeHierarchyDataSources(properties.items, item => item.dataSource);
      properties.items = filteredItems;
      const dataSourceResultSet = new DataSourceResultSet(properties);
      dataSourceResultSet.sina = this;
      return dataSourceResultSet;
    }
    isNeededCache = {};
    removeHierarchyDataSources(list, getDataSource) {
      const isNeeded = dataSourceToBeChecked => {
        const cache = this.isNeededCache[dataSourceToBeChecked.id];
        if (typeof cache !== "undefined") {
          return cache;
        }
        for (const dataSource of this.dataSources) {
          for (const attributeMetaData of dataSource.attributesMetadata) {
            if (attributeMetaData.hierarchyName === dataSourceToBeChecked.hierarchyName && attributeMetaData.hierarchyDisplayType === HierarchyDisplayType.HierarchyResultView) {
              this.isNeededCache[dataSourceToBeChecked.id] = true;
              return true;
            }
          }
        }
        this.isNeededCache[dataSourceToBeChecked.id] = false;
        return false;
      };
      for (let i = 0; i < list.length; i++) {
        const element = list[i];
        const dataSource = getDataSource(element);
        if (!dataSource.isHierarchyDataSource) {
          continue;
        }
        if (!isNeeded(dataSource)) {
          list.splice(i, 1);
          i--;
        }
      }
      return list;
    }
    createDataSource(properties) {
      properties.sina = this;
      let dataSource;
      switch (properties.type) {
        case DataSourceType.BusinessObject:
          switch (properties.subType) {
            case DataSourceSubType.Filtered:
              dataSource = new FilteredDataSource(properties);
              break;
            default:
              dataSource = new DataSource(properties);
          }
          break;
        case DataSourceType.UserCategory:
          dataSource = new UserCategoryDataSource(properties);
          break;
        default:
          dataSource = new DataSource(properties);
      }
      if (this.dataSourceMap[dataSource.id]) {
        throw new errors.CanNotCreateAlreadyExistingDataSourceError(dataSource.id);
      }
      this._addDataSource(dataSource);
      return dataSource;
    }

    /**
     *
     * @deprecated Use sina.createDataSource() instead
     */
    _createDataSource(properties) {
      return this.createDataSource(properties);
    }
    _addDataSource(dataSource) {
      if (dataSource.type === DataSourceType.BusinessObject && dataSource.subType === DataSourceSubType.Filtered) {
        // 1 filtered datasources
        let insertIndex = -1;
        for (let i = this.dataSources.length - 1; i >= 1; --i) {
          const checkDataSource = this.dataSources[i];
          if (checkDataSource.type === DataSourceType.BusinessObject && checkDataSource.subType === DataSourceSubType.Filtered) {
            insertIndex = i;
            break;
          }
        }
        if (insertIndex >= 0) {
          this.dataSources.splice(insertIndex + 1, 0, dataSource);
        } else {
          this.dataSources.push(dataSource);
        }
      } else {
        // 2 other datasources
        this.dataSources.push(dataSource);
      }
      this.dataSourceMap[dataSource.id] = dataSource;
    }
    getAllDataSource() {
      return this.allDataSource;
    }
    getBusinessObjectDataSources() {
      const result = [];
      for (let i = 0; i < this.dataSources.length; ++i) {
        const dataSource = this.dataSources[i];
        if (!dataSource.hidden && dataSource.type === DataSourceType.BusinessObject && dataSource.subType !== DataSourceSubType.Filtered) {
          result.push(dataSource);
        }
      }
      return this.removeHierarchyDataSources(result, dataSource => dataSource);
    }
    getDataSource(id) {
      return this.dataSourceMap[id];
    }
    async getConfigurationAsync(properties = {}) {
      if (this.provider instanceof InAV2Provider || this.provider instanceof ABAPODataProvider) {
        if (this.configurationPromise && !properties.forceReload) {
          return this.configurationPromise;
        }
        this.configurationPromise = this.provider.getConfigurationAsync();
        return this.configurationPromise;
      }
      return Promise.resolve(this._createConfiguration({
        personalizedSearch: false,
        isPersonalizedSearchEditable: false
      }));
    }
    logUserEvent(event) {
      this.provider.logUserEvent(event);
    }
    getDebugInfo() {
      return this.provider.getDebugInfo();
    }
    parseDataSourceFromJson(json) {
      let dataSource = this.getDataSource(json.id);
      if (dataSource) {
        return dataSource;
      }
      if (json.type !== DataSourceType.Category) {
        throw new errors.DataSourceInURLDoesNotExistError(json.id);
      }
      dataSource = this._createDataSource(json);
      return dataSource;
    }
    parseSimpleConditionFromJson(json) {
      let value;
      if (core.isObject(json.value)) {
        value = util.dateFromJson(json.value);
      } else {
        value = json.value;
      }
      // Following should satisfy no-unneeded-ternary eslint rule:
      let userDefined;
      if (json.userDefined) {
        userDefined = true;
      } else {
        userDefined = false;
      }
      let isDynamicValue;
      if (json.dynamic) {
        isDynamicValue = true;
      } else {
        isDynamicValue = false;
      }
      return this.createSimpleCondition({
        operator: json.operator,
        attribute: json.attribute,
        value: value,
        attributeLabel: json.attributeLabel,
        valueLabel: json.valueLabel,
        userDefined: userDefined,
        isDynamicValue: isDynamicValue
      });
    }
    parseComplexConditionFromJson(json) {
      const conditions = [];
      for (let i = 0; i < json.conditions.length; ++i) {
        const conditionJson = json.conditions[i];
        conditions.push(this.parseConditionFromJson(conditionJson));
      }
      // Following should satisfy no-unneeded-ternary eslint rule:
      let userDefined;
      if (json.userDefined) {
        userDefined = true;
      } else {
        userDefined = false;
      }
      return this.createComplexCondition({
        operator: json.operator,
        conditions: conditions,
        attributeLabel: json.attributeLabel,
        valueLabel: json.valueLabel,
        userDefined: userDefined
      });
    }
    parseConditionFromJson(json) {
      switch (json.type) {
        case ConditionType.Simple:
          return this.parseSimpleConditionFromJson(json);
        case ConditionType.Complex:
          return this.parseComplexConditionFromJson(json);
        default:
          throw new errors.UnknownConditionTypeError(json.type);
      }
    }
    parseFilterFromJson(json) {
      const rootCondition = this.parseConditionFromJson(json.rootCondition);
      if (rootCondition instanceof ComplexCondition) {
        return this.createFilter({
          searchTerm: json?.searchTerm,
          rootCondition,
          dataSource: this.parseDataSourceFromJson(json.dataSource)
        });
      } else {
        throw new errors.OnlyComplexConditionAllowedError();
      }
    }
    parseNavigationTargetFromJson(json) {
      return this.createNavigationTarget(json);
    }

    // Assemble hiearchy down navigation link as title navigation
    createStaticHierarchySearchNavigationTarget(hierarchyNodeId, hierarchyNodeLabel, dataSource, navigationTargetLabel, hierarchyNodeAttributeName) {
      if (!hierarchyNodeAttributeName) {
        hierarchyNodeAttributeName = dataSource.hierarchyAttribute;
        if (!hierarchyNodeAttributeName) {
          const helperHierarchyDataource = dataSource.getHierarchyDataSource();
          if (helperHierarchyDataource && helperHierarchyDataource.hierarchyAttribute) {
            hierarchyNodeAttributeName = helperHierarchyDataource.hierarchyAttribute;
          } else {
            return null;
          }
        }
      }
      const filter = new Filter({
        dataSource: dataSource,
        searchTerm: "",
        //navigation mode, ignore content in search input box
        sina: this
      });

      // DescendantOf $$ROOT$$ === search for all without any filter condition
      if (hierarchyNodeId !== "$$ROOT$$") {
        // Set operator as DescendantOf and let Sina SearchQuery _executeSearchQuery decide the final operator/operators
        const childrenCondition = new SimpleCondition({
          attribute: hierarchyNodeAttributeName,
          operator: ComparisonOperator.DescendantOf,
          value: hierarchyNodeId,
          valueLabel: hierarchyNodeLabel
        });
        filter.autoInsertCondition(childrenCondition);
      }
      return this.createSearchNavigationTarget(filter, navigationTargetLabel || "Children Folders");
    }
    getHierarchyDataSource(hierarchyName) {
      const dataSources = this.dataSources;
      for (let i = 0; i < dataSources.length; ++i) {
        const dataSource = dataSources[i];
        if (dataSource.type !== this.DataSourceType.BusinessObject) {
          continue;
        }
        if (!dataSource.isHierarchyDataSource) {
          continue;
        }
        if (hierarchyName === dataSource.hierarchyName) {
          return dataSource;
        }
      }
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.Sina = Sina;
  return __exports;
});
})();