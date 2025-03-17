/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["../i18n", "sap/ui/model/json/JSONModel", "sap/esh/search/ui/SearchModel", "../personalization/PersonalizationKeys"], function (__i18n, JSONModel, SearchModel, ___personalization_PersonalizationKeys) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const i18n = _interopRequireDefault(__i18n);
  const PersonalizationKeys = ___personalization_PersonalizationKeys["PersonalizationKeys"]; // model class for search preferences view
  // =======================================================================
  class SearchPrefsModel extends JSONModel {
    searchModel;
    initializePromise;
    userCategory;
    userCategoryManager;
    configuration;

    //const path = "sap.esh.search.ui.userpref.SearchPrefsModel";
    asyncInit() {
      // check cache
      if (this.initializePromise) {
        return this.initializePromise;
      }
      this.initializePromise = (async () => {
        // get search model
        this.searchModel = SearchModel.getModelSingleton({}, "flp");

        // ensure that search model is initialized
        await this.searchModel.initAsync();

        // if bo search is disabled -> disable search prefs + return
        if (!this.searchModel.config.searchBusinessObjects) {
          this.setProperty("/isSearchPrefsActive", false);
          this.setProperty("/isPersonalizedSearchEditable", false);
          this.setProperty("/personalizedSearch", false);
          this.setProperty("/resetButtonWasClicked", false);
          return;
        }

        // activate search entry
        this.setProperty("/isSearchPrefsActive", true);

        // init subareas
        await this.initSearchPersonalization();
        await this.initMyFavorites();
        await this.initNlq();
      })();
      return this.initializePromise;
    }
    async initSearchPersonalization() {
      const sinaNext = this.searchModel.sinaNext;
      // set property for visibility of Personalized Search area (oPersSearchVBox)
      // not visible in case of cross system search
      this.setProperty("/isPersonalizedSearchAreaVisible", sinaNext.provider.id === "multi" ? false : true);
      this.configuration = await sinaNext.getConfigurationAsync({
        forceReload: true
      });
      this.setProperty("/isPersonalizedSearchEditable", this.configuration.isPersonalizedSearchEditable);
      this.setProperty("/personalizedSearch", this.configuration.personalizedSearch);
      this.setProperty("/resetButtonWasClicked", false);
    }
    async initMyFavorites() {
      this.setProperty("/isMyFavoritesAvailable", this.searchModel.isMyFavoritesAvailable());
      if (this.searchModel.isMyFavoritesAvailable()) {
        this.initSubDataSources();
      }
    }
    reload() {
      return this.asyncInit();
    }
    initSubDataSources() {
      const newDS = [];
      this.searchModel.getUserCategoryManager().then(userCategoryManager => {
        this.userCategoryManager = userCategoryManager;
        this.userCategory = userCategoryManager.getCategory("MyFavorites");
        // get datasources from sina
        const dataSources = this.searchModel.sinaNext.dataSources;
        dataSources.filter(x => (x.type === this.searchModel.sinaNext.DataSourceType.BusinessObject || x === this.searchModel.appDataSource) && x.id !== "CD$ALL~ESH_TRANSACTION~").forEach(x => {
          if (x === this.searchModel.appDataSource) {
            newDS.unshift({
              id: x.id,
              label: x.labelPlural,
              selected: this.userCategory.isIncludeApps(),
              undefined: false
            });
          } else {
            newDS.push({
              id: x.id,
              label: x.labelPlural,
              selected: this.userCategory.hasSubDataSource(x.id),
              undefined: false
            });
          }
        });

        // add undefinedSubDataSources to the top of the list
        const undefinedSubDataSources = this.userCategory.getUndefinedSubDataSourceIds().reverse();
        for (const undefinedSubDataSource of undefinedSubDataSources) {
          newDS.unshift({
            id: undefinedSubDataSource,
            label: undefinedSubDataSource + " " + i18n.getText("sp.connectorNotExists"),
            selected: true,
            undefined: true
          });
        }
        this.setProperty("/favActive", this.userCategoryManager.isFavActive());
        this.setProperty("/subDataSources", newDS);
        this.setProperty("/dataSourceCount", this.getNumberSubDataSources());
        this.setProperty("/selectedDataSourceCount", this.getNumberSelectedSubDataSources());
      });
    }
    async initNlq() {
      const isNlqAreaVisible = !!(this.searchModel.config.aiNlq && this.searchModel.sinaNext.capabilities.nlq);
      this.setProperty("/isNlqAreaVisible", isNlqAreaVisible);
      if (!isNlqAreaVisible) {
        return;
      }
      const nlqActive = this.searchModel.getPersonalizationStorageInstance().getItem(PersonalizationKeys.nlqActive);
      this.setProperty("/nlqActive", nlqActive);
    }
    async saveNlq() {
      this.searchModel.getPersonalizationStorageInstance().setItem(PersonalizationKeys.nlqActive, this.getProperty("/nlqActive"));
      await this.searchModel.getPersonalizationStorageInstance().save();
      this.searchModel.calculateIsNlqActive();
    }
    getNumberSubDataSources() {
      return this.getProperty("/subDataSources").length;
    }
    getNumberSelectedSubDataSources() {
      return this.getProperty("/subDataSources").filter(x => x.selected).length; //x.selected === true)
    }
    saveSubDataSources() {
      const subDataSources = this.getProperty("/subDataSources");
      this.userCategory.setIncludeApps(false);
      this.userCategoryManager.setFavActive(this.getProperty("/favActive"));
      this.userCategory.clearSubDataSources();
      this.userCategory.clearUndefinedSubDataSourceIds();
      for (const subDataSource of subDataSources) {
        if (subDataSource.selected === true) {
          if (subDataSource.id === this.searchModel.appDataSource.id) {
            this.userCategory.setIncludeApps(true);
          } else {
            const sinaSubDataSource = this.userCategoryManager.sina.getDataSource(subDataSource.id);
            if (sinaSubDataSource) {
              this.userCategory.addSubDataSource(sinaSubDataSource);
            } else {
              this.userCategory.addUndefinedSubDataSourceId(subDataSource.id);
            }
          }
        }
      }
      this.userCategoryManager.save();
    }

    //not used in future -> delete
    shortStatus() {
      return this.asyncInit().then(() => {
        return this.getProperty("/personalizedSearch") ? i18n.getText("sp.on") : i18n.getText("sp.off");
      });
    }
    isPersonalizedSearchActive() {
      return this.asyncInit().then(() => {
        return this.getProperty("/personalizedSearch");
      });
    }
    isSearchPrefsActive() {
      return this.asyncInit().then(() => {
        return this.getProperty("/isSearchPrefsActive");
      });
    }
    isMultiProvider() {
      return this.asyncInit().then(() => {
        return this.searchModel.sinaNext.provider.id === "multi";
      });
    }
    async savePreferences() {
      // nlq
      await this.saveNlq();
      // my favorites
      if (this.searchModel.isMyFavoritesAvailable()) {
        this.saveSubDataSources();
      }
      // search personaization
      if (this.configuration.isPersonalizedSearchEditable) {
        this.configuration.setPersonalizedSearch(this.getProperty("/personalizedSearch"));
        await this.configuration.saveAsync();
      }
      this.setProperty("/resetButtonWasClicked", false);
    }
    cancelPreferences() {
      this.setProperty("/personalizedSearch", this.configuration.personalizedSearch);
      this.setProperty("/resetButtonWasClicked", false);
      this.initNlq();
    }
    resetProfile() {
      return this.configuration.resetPersonalizedSearchDataAsync().then(() => {
        this.setProperty("/resetButtonWasClicked", true);
      });
    }
  }
  return SearchPrefsModel;
});
})();