/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["../i18n", "./SinaBaseSuggestionProvider", "./SinaObjectSuggestionFormatter", "./SuggestionType", "sap/esh/search/ui/SearchHelper", "../sinaNexTS/sina/SearchResultSetItemAttribute", "sap/ui/Device"], function (__i18n, __SinaBaseSuggestionProvider, __SinaObjectSuggestionFormatter, ___SuggestionType, SearchHelper, ___sinaNexTS_sina_SearchResultSetItemAttribute, Device) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const i18n = _interopRequireDefault(__i18n);
  const SinaBaseSuggestionProvider = _interopRequireDefault(__SinaBaseSuggestionProvider);
  const SinaObjectSuggestionFormatter = _interopRequireDefault(__SinaObjectSuggestionFormatter);
  const UISuggestionType = ___SuggestionType["Type"];
  const UISuggestionTypeProperties = ___SuggestionType["SuggestionType"];
  const SearchResultSetItemAttribute = ___sinaNexTS_sina_SearchResultSetItemAttribute["SearchResultSetItemAttribute"];
  class SinaSuggestionProvider extends SinaBaseSuggestionProvider {
    suggestionLimit;
    suggestionStartingCharacters;
    model;
    sinaObjectSuggestionFormatter;
    suggestions;
    firstObjectDataSuggestion;
    numberSuggestionsByType;
    suggestionHandler;

    // init
    // ===================================================================
    constructor(options) {
      // call super constructor
      super(options.sinaNext);
      this.model = options.model;
      this.suggestionTypes = options.suggestionTypes;
      this.suggestionHandler = options.suggestionHandler;
      this.suggestionLimit = Device.system.phone ? 5 : 7;
      this.suggestionStartingCharacters = this.model.config.suggestionStartingCharacters;
      // this.dataSourceDeferred = null;
      this.sinaObjectSuggestionFormatter = new SinaObjectSuggestionFormatter();
    }

    // abort suggestions
    // ===================================================================
    abortSuggestions() {
      this.suggestionQuery.abort();
    }

    // get suggestions
    // ===================================================================
    async getSuggestions(filter) {
      // reset global fields
      this.suggestions = [];
      this.firstObjectDataSuggestion = true;
      this.numberSuggestionsByType = {};
      for (let i = 0; i < UISuggestionTypeProperties.types.length; ++i) {
        const suggestionType = UISuggestionTypeProperties.types[i];
        this.numberSuggestionsByType[suggestionType] = 0;
      }

      // history based search term suggestions only starting by default from 1. character
      const suggestionTerm = filter.searchTerm;
      if (this.suggestionTypes.length === 1 && this.suggestionTypes.indexOf(UISuggestionType.SearchTermHistory) >= 0 && suggestionTerm.length < 1) {
        return [];
      }

      // data based search term suggestions only starting by default from 3. character
      if (this.suggestionTypes.length === 1 && this.suggestionTypes.indexOf(UISuggestionType.SearchTermData) >= 0 && suggestionTerm.length < this.suggestionStartingCharacters) {
        return [];
      }

      // object suggestions only starting by default from 3. character
      if (this.suggestionTypes.length === 1 && this.suggestionTypes.indexOf(UISuggestionType.Object) >= 0 && suggestionTerm.length < this.suggestionStartingCharacters) {
        return [];
      }

      // data source suggestions only for ds=all and My Favorites
      if (this.suggestionTypes.length === 1 && this.suggestionTypes.indexOf(UISuggestionType.DataSource) >= 0 && this.model.getDataSource() !== this.model.sinaNext.allDataSource && this.model.getDataSource() !== this.model.favDataSource) {
        return [];
      }

      // data source suggestions only starting from 1. character
      if (this.suggestionTypes.length === 1 && this.suggestionTypes.indexOf(UISuggestionType.DataSource) >= 0 && suggestionTerm.length < 1) {
        return [];
      }

      // ai suggestions only if ai is active
      if (this.suggestionTypes.length === 1 && this.suggestionTypes.indexOf(UISuggestionType.SearchTermAI) >= 0 && !this.model.isNlqActive()) {
        return [];
      }

      // handle client side datasource-suggestions for all and apps
      this.createAllAndAppDsSuggestions();

      // check that BO search is enabled
      if (!this.model.config.searchBusinessObjects) {
        return Promise.resolve(this.suggestions);
      }

      // no server request for ds = apps
      if (this.model.getDataSource() === this.model.appDataSource) {
        return Promise.resolve(this.suggestions);
      }

      // prepare sina suggestion query
      this.prepareSuggestionQuery(filter);

      // fire sina suggestion query
      const resultSet = await this.suggestionQuery.getResultSetAsync();
      // concatenate searchterm + suggestion term
      const sinaSuggestions = resultSet.items;

      // assemble items from result set
      this.formatSinaSuggestions(sinaSuggestions);
      return this.suggestions;
    }

    // client side datasource suggestions for all and apps
    // ===================================================================
    createAllAndAppDsSuggestions() {
      if (this.suggestionTypes.indexOf(UISuggestionType.DataSource) < 0) {
        return;
      }
      if (this.model.getDataSource() !== this.model.allDataSource && this.model.getDataSource() !== this.model.favDataSource) {
        return;
      }
      const dataSources = [];
      if (this.model.getDataSource() === this.model.allDataSource) {
        dataSources.unshift(this.model.appDataSource);
        dataSources.unshift(this.model.allDataSource);
      }
      if (this.model.getDataSource() === this.model.favDataSource) {
        if (this.model.favDataSource.includeApps) {
          dataSources.unshift(this.model.appDataSource);
        }
        dataSources.unshift(this.model.favDataSource);
      }
      const suggestionTerms = this.model.getProperty("/uiFilter/searchTerm");
      const suggestionTermsIgnoreStar = suggestionTerms.replace(/\*/g, "");
      const oTester = new SearchHelper.Tester(suggestionTermsIgnoreStar);
      for (let i = 0; i < dataSources.length; ++i) {
        const dataSource = dataSources[i];
        if (dataSource.id === this.model.getDataSource().id) {
          continue;
        }
        const oTestResult = oTester.test(dataSource.label);
        if (oTestResult.bMatch === true) {
          // limit number of suggestions
          if (this.isSuggestionLimitReached(UISuggestionType.DataSource)) {
            return;
          }

          // create suggestion
          const suggestion = {
            sina: this.sinaNext,
            label: "<i>" + i18n.getText("searchInPlaceholder", [""]) + "</i> " + oTestResult.sHighlightedText,
            dataSource: dataSource,
            position: UISuggestionTypeProperties.properties.DataSource.position,
            type: this.sinaNext.SuggestionType.DataSource,
            calculationMode: this.sinaNext.SuggestionCalculationMode.Data,
            uiSuggestionType: UISuggestionType.DataSource
          };
          this.addSuggestion(suggestion);
        }
      }
    }

    // check suggestion limit
    // ===================================================================
    isSuggestionLimitReached(suggestionType) {
      const limit = this.suggestionHandler.getSuggestionLimit(suggestionType);
      const numberSuggestions = this.numberSuggestionsByType[suggestionType];
      if (numberSuggestions >= limit) {
        return true;
      }
      return false;
    }

    // preformat of suggestions: add ui position and ui suggestion type
    // ===================================================================
    preFormatSuggestions(sinaSuggestions) {
      for (let i = 0; i < sinaSuggestions.length; ++i) {
        const sinaSuggestion = sinaSuggestions[i];
        const uiSuggestion = sinaSuggestion;
        // suggestion type
        uiSuggestion.uiSuggestionType = this.getSuggestionType(sinaSuggestion);
        // set position
        uiSuggestion.position = UISuggestionTypeProperties.properties[uiSuggestion.uiSuggestionType].position;
        // key
        this.assembleKey(uiSuggestion);
        // process children
        if (uiSuggestion.childSuggestions) {
          this.preFormatSuggestions(uiSuggestion.childSuggestions);
        }
      }
    }

    // assemble key
    // ===================================================================
    assembleKey(sinaSuggestion) {
      switch (sinaSuggestion.uiSuggestionType) {
        case UISuggestionType.DataSource:
          sinaSuggestion.key = UISuggestionType.DataSource + sinaSuggestion.dataSource.id;
          break;
        case UISuggestionType.SearchTermData:
          sinaSuggestion.key = UISuggestionType.SearchTermData + sinaSuggestion.searchTerm;
          if (sinaSuggestion.dataSource) {
            sinaSuggestion.key += sinaSuggestion.dataSource.id;
          }
          break;
        case UISuggestionType.SearchTermHistory:
          sinaSuggestion.key = UISuggestionType.SearchTermData + sinaSuggestion.searchTerm; // use type SearchTermData : in ui history and data based suggestions are identical
          if (sinaSuggestion.dataSource) {
            sinaSuggestion.key += sinaSuggestion.dataSource.id;
          }
          break;
        case UISuggestionType.SearchTermAI:
          sinaSuggestion.key = UISuggestionType.SearchTermAI + sinaSuggestion.searchTerm;
          break;
        case UISuggestionType.Object:
          {
            // const objKey = sinaSuggestion.object.title
            //     ? sinaSuggestion.object.title
            //     : sinaSuggestion.object.detailAttributes[0].value;
            // Does an object really have a title??
            const detailAttr = sinaSuggestion.object.detailAttributes[0];
            if (detailAttr instanceof SearchResultSetItemAttribute) {
              const objKey = detailAttr.value;
              sinaSuggestion.key = UISuggestionType.Object + objKey;
            }
            break;
          }
      }
    }

    // add sina suggestions
    // ===================================================================
    formatSinaSuggestions(sinaSuggestions) {
      // preprocess add ui position and key to all suggestions
      this.preFormatSuggestions(sinaSuggestions);

      // process suggestions
      for (let i = 0; i < sinaSuggestions.length; ++i) {
        const sinaSuggestion = sinaSuggestions[i];

        // limit number of suggestions
        if (this.isSuggestionLimitReached(sinaSuggestion.uiSuggestionType)) {
          continue;
        }

        // format according to type
        switch (sinaSuggestion.uiSuggestionType) {
          case UISuggestionType.DataSource:
            if (this.model.getDataSource() !== this.model.allDataSource && this.model.getDataSource() !== this.model.favDataSource) {
              continue;
            }
            //sinaSuggestion.label = /*<i>' + i18n.getText("searchInPlaceholder", [""]) + '</i> ' +*/ sinaSuggestion.label;
            this.addSuggestion(sinaSuggestion);
            break;
          case UISuggestionType.SearchTermData:
            this.formatSearchTermDataSuggestion(sinaSuggestion);
            break;
          case UISuggestionType.SearchTermHistory:
            this.addSuggestion(sinaSuggestion);
            break;
          case UISuggestionType.SearchTermAI:
            this.addSuggestion(sinaSuggestion);
            break;
          case UISuggestionType.Object:
          case UISuggestionType.Transaction:
            {
              const sinaObjectSuggestion = {
                ...sinaSuggestion,
                dataSource: sinaSuggestion.object.dataSource,
                object: sinaSuggestion.object
              };
              this.sinaObjectSuggestionFormatter.format(this, sinaObjectSuggestion);
              break;
            }
          default:
            break;
        }
      }
      return this.suggestions;
    }

    // add suggestion
    // ===================================================================
    addSuggestion(suggestion) {
      this.suggestions.push(suggestion);
      this.numberSuggestionsByType[suggestion.uiSuggestionType] += 1;
    }

    // format search term suggestion
    // ===================================================================
    formatSearchTermDataSuggestion(sinaSuggestion) {
      if (this.model.getDataSource() === this.model.allDataSource) {
        // 1. model datasource is all
        if (this.firstObjectDataSuggestion) {
          // 1.1 first suggestion (display also child suggestions)
          this.firstObjectDataSuggestion = false;
          if (sinaSuggestion.childSuggestions.length > 0) {
            sinaSuggestion.label = this.assembleSearchInSuggestionLabel(sinaSuggestion);
            sinaSuggestion.grouped = true;
            this.addSuggestion(sinaSuggestion);
            this.addChildSuggestions(sinaSuggestion);
          } else {
            this.addSuggestion(sinaSuggestion);
          }
        } else {
          // 1.2 subsequent suggestions (ignore child suggestions)
          this.addSuggestion(sinaSuggestion);
        }
      } else {
        // 2. model datasource is a connector
        this.addSuggestion(sinaSuggestion);
      }
    }

    // add child suggestions
    // ===================================================================
    addChildSuggestions(sinaSuggestion) {
      // max 2 child suggestions
      for (let i = 0; i < Math.min(2, sinaSuggestion.childSuggestions.length); ++i) {
        // check limit
        if (this.isSuggestionLimitReached(UISuggestionType.SearchTermData)) {
          return;
        }

        // add suggestion
        const sinaChildSuggestion = sinaSuggestion.childSuggestions[i];
        sinaChildSuggestion.label = this.assembleSearchInSuggestionLabel(sinaChildSuggestion);
        sinaChildSuggestion.grouped = true;
        this.addSuggestion(sinaChildSuggestion);
      }
    }

    // assemble search in suggestion label
    // ===================================================================
    assembleSearchInSuggestionLabel(sinaSuggestion) {
      return i18n.getText("resultsIn", ["<span>" + sinaSuggestion.label + "</span>", sinaSuggestion.filter.dataSource.labelPlural]);
    }

    // get type of sina suggestion
    // ===================================================================
    getSuggestionType(sinaSuggestion) {
      switch (sinaSuggestion.type) {
        case this.sinaNext.SuggestionType.SearchTerm:
          if (sinaSuggestion.calculationMode === this.sinaNext.SuggestionCalculationMode.History) {
            return UISuggestionType.SearchTermHistory;
          }
          return UISuggestionType.SearchTermData;
        case this.sinaNext.SuggestionType.SearchTermAndDataSource:
          if (sinaSuggestion.calculationMode === this.sinaNext.SuggestionCalculationMode.History) {
            return UISuggestionType.SearchTermHistory;
          }
          return UISuggestionType.SearchTermData;
        case this.sinaNext.SuggestionType.SearchTermAI:
          return UISuggestionType.SearchTermAI;
        case this.sinaNext.SuggestionType.DataSource:
          return UISuggestionType.DataSource;
        case this.sinaNext.SuggestionType.Object:
          return UISuggestionType.Object;
      }
    }
  }
  return SinaSuggestionProvider;
});
})();