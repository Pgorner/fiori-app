/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["../i18n", "sap/esh/search/ui/SearchHelper", "./SuggestionType"], function (__i18n, SearchHelper, ___SuggestionType) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const i18n = _interopRequireDefault(__i18n);
  const UISuggestionType = ___SuggestionType["Type"];
  const UISuggestionTypeProperties = ___SuggestionType["SuggestionType"];
  class AppSuggestionProvider {
    model;
    suggestApplications;
    suggestionHandler;
    constructor(options) {
      this.model = options.model;
      this.suggestionHandler = options.suggestionHandler;
      // decorate suggestion methods (decorator prevents request overtaking)
      this.suggestApplications = SearchHelper.refuseOutdatedRequests(this.suggestApplicationsNotDecorated);
    }
    abortSuggestions() {
      this.suggestApplications.abort();
    }
    combineSuggestionsWithIdenticalTitle(suggestions) {
      //            function JSONStringifyReplacer(key, value) {
      //                if (key === "sina") {
      //                    return undefined;
      //                }
      //                return value;
      //            }

      // collect suggestions in suggestionsTitleDict + create combined suggestions
      let suggestion;
      const suggestionsTitleDict = {};
      for (let i = 0; i < suggestions.length; i++) {
        suggestion = suggestions[i];
        const firstAppSuggestion = suggestionsTitleDict[suggestion.title + suggestion.subtitle];
        if (firstAppSuggestion) {
          if (!firstAppSuggestion.combinedSuggestionExists) {
            const combinedSuggestion = {
              title: "combinedAppSuggestion" + i,
              subtitle: suggestion.subtitle,
              sortIndex: firstAppSuggestion.sortIndex,
              url: this.model.createSearchNavigationTarget({
                top: this.model.appTopDefault,
                filter: this.model.sinaNext.createFilter({
                  dataSource: this.model.appDataSource,
                  searchTerm: suggestion.title
                }),
                encodeFilter: false
              }).targetUrl,
              label: i18n.getText("suggestion_in_apps", suggestion.label),
              icon: "sap-icon://search",
              keywords: "",
              uiSuggestionType: UISuggestionType.App
            };
            const inApps = i18n.getText("suggestion_in_apps", [""]);
            combinedSuggestion.label = combinedSuggestion.label.replace(inApps, "<i>" + inApps + "</i>");
            suggestionsTitleDict[combinedSuggestion.title + combinedSuggestion.subtitle] = combinedSuggestion;
            firstAppSuggestion.combinedSuggestionExists = true;
          }
        } else {
          suggestion.sortIndex = i;
          suggestionsTitleDict[suggestion.title + suggestion.subtitle] = suggestion;
        }
      }

      // filter out combined suggestions
      suggestions = [];
      for (const suggestionTitle in suggestionsTitleDict) {
        if (Object.prototype.hasOwnProperty.call(suggestionsTitleDict, suggestionTitle)) {
          // eslint-disable-line no-prototype-builtins
          suggestion = suggestionsTitleDict[suggestionTitle];
          if (!suggestion.combinedSuggestionExists) {
            suggestions.push(suggestion);
          }
        }
      }
      suggestions.sort(function (s1, s2) {
        return s1.sortIndex - s2.sortIndex;
      });
      return suggestions;
    }
    addAsterisk4ShowAllApps(searchTerms) {
      const searchTermsMatches = searchTerms.match(/\S+/g);
      if (searchTermsMatches.length > 0) {
        let searchTerm;
        const searchTermsArray = [];
        for (let i = 0; i < searchTermsMatches.length; i++) {
          searchTerm = searchTermsMatches[i];
          if (searchTerm && searchTerm.lastIndexOf("*") !== searchTerm.length - 1) {
            searchTermsArray.push(searchTerm + "*");
          } else {
            searchTermsArray.push(searchTerm);
          }
        }
        searchTerms = searchTermsArray.join(" ");
      }
      return searchTerms;
    }
    createShowMoreSuggestion(totalResults) {
      let title = i18n.getText("showAllNApps", [totalResults]);
      title = title.replace(/"/g, ""); //remove trailing ""
      const tooltip = title;
      const label = "<i>" + title + "</i>";
      return {
        title: title,
        tooltip: tooltip,
        label: label,
        dataSource: this.model.appDataSource,
        labelRaw: this.model.getProperty("/uiFilter/searchTerm"),
        uiSuggestionType: UISuggestionType.SearchTermData,
        searchTerm: this.model.getProperty("/uiFilter/searchTerm") || ""
      };
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async getSuggestions(filter) {
      // check that datasource is all, apps or my favorites and my favorites include apps:
      const dataSource = this.model.getDataSource();
      const userCategoryManager = this.model.userCategoryManager;
      const favoritesIncludeApps = userCategoryManager?.isFavActive() && userCategoryManager?.getCategory("MyFavorites")?.includeApps;
      if (dataSource !== this.model.allDataSource && dataSource !== this.model.appDataSource && !(dataSource === this.model.favDataSource && favoritesIncludeApps)) {
        return [];
      }

      // no suggestions for searchTerm length < 1
      if (filter.searchTerm.length < 1) {
        return [];
      }

      // get suggestions
      const suggestionTerm = this.model.getProperty("/uiFilter/searchTerm");
      const resultset = await this.suggestApplications(suggestionTerm);

      // combine suggestions with identical title
      let flpAppSuggestions = resultset.getElements();
      flpAppSuggestions = this.combineSuggestionsWithIdenticalTitle(flpAppSuggestions);
      let uiAppSuggestions = [];

      // set type, datasource and position
      for (const flpAppSuggestion of flpAppSuggestions) {
        const uiAppSuggestion = {
          ...flpAppSuggestion,
          uiSuggestionType: UISuggestionType.App,
          dataSource: this.model.appDataSource,
          position: UISuggestionTypeProperties.properties.App.position,
          key: UISuggestionTypeProperties.App + flpAppSuggestion.url + flpAppSuggestion.icon
        };
        uiAppSuggestions.push(uiAppSuggestion);
      }

      // limit app suggestions
      const appSuggestionLimit = this.suggestionHandler.getSuggestionLimit(UISuggestionType.App);
      uiAppSuggestions = uiAppSuggestions.slice(0, appSuggestionLimit);

      // if there are more apps available, add a "show all apps" suggestion at the end
      // but only if datasource is apps (nestle changes)
      if (resultset.totalResults > appSuggestionLimit && dataSource === this.model.appDataSource) {
        uiAppSuggestions.push(this.createShowMoreSuggestion(resultset.totalResults));
      }
      return uiAppSuggestions;
    }
    suggestApplicationsNotDecorated(searchTerm) {
      return window.sap.ushell.Container.getServiceAsync("Search").then(function (service) {
        return service.queryApplications({
          searchTerm: searchTerm,
          suggestion: true
        });
      });
    }
  }
  return AppSuggestionProvider;
});
})();