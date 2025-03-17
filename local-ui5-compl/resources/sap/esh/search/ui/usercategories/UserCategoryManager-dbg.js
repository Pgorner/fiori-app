/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["../i18n", "sap/esh/search/ui/SearchHelper", "../error/errors", "../personalization/PersonalizationKeys"], function (__i18n, sap_esh_search_ui_SearchHelper, ___error_errors, ___personalization_PersonalizationKeys) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const i18n = _interopRequireDefault(__i18n);
  const isSearchAppActive = sap_esh_search_ui_SearchHelper["isSearchAppActive"];
  const ProgramError = ___error_errors["ProgramError"];
  const PersonalizationKeys = ___personalization_PersonalizationKeys["PersonalizationKeys"];
  const myFavDataStore = PersonalizationKeys.myFavorites;
  class UserCategoryManager {
    active;
    lastActive;
    categories;
    personalizationStorage;
    sina;
    static async create(properties) {
      const instance = new UserCategoryManager(properties);
      await instance.initAsync();
      return instance;
    }
    constructor(properties) {
      this.active = false;
      this.lastActive = false;
      this.categories = [];
      this.personalizationStorage = properties.personalizationStorage;
      this.sina = properties.sina;
    }
    initAsync() {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that = this;
      let userCategory;
      let sinaSubDataSources;
      const undefinedSubDataSourceIds = [];
      const myFavData = this.personalizationStorage.getItem(myFavDataStore);
      if (!this.isPersonalizationStorageItem(myFavData)) {
        throw new ProgramError(null, "wrong myFavData type");
      }

      /* // example for storage
                      personalizationStorageInstance.setItem('my-fav-data', {
                          active: true,
                          userCatgories: [{
                              id: 'MyFavorites',
                              includeApps: true
                              subDataSources: [{
                                  id: 'CD$ALL~ZESH_EPM_P_DEMO~'
                              }, {
                                  id: 'CD$ALL~ZESH_EPM_S_DEMO~'
                              }]
                          }]
                      });*/

      // No FavData exists
      if (!myFavData) {
        userCategory = this.sina.createDataSource({
          id: "MyFavorites",
          label: i18n.getText("label_userFavorites"),
          labelPlural: i18n.getText("label_userFavorites"),
          type: this.sina.DataSourceType.UserCategory,
          includeApps: false,
          subDataSources: [],
          undefinedSubDataSourceIds: []
        });
        this.categories.push(userCategory);
        return Promise.resolve();
      }
      this.setFavActive(myFavData.active);
      if (!this.isFavActive()) {
        // null or undefined
        this.setFavActive(false);
      }
      this.setLastFavActive(this.isFavActive());

      // convert subDataSources from personalizationStorage into sina datasources
      // if not possible -> add subDataSource to undefinedSubDataSourceIds

      for (const favUserCategory of myFavData.userCatgories) {
        const subDataSources = favUserCategory.subDataSources;
        if (subDataSources) {
          sinaSubDataSources = subDataSources.map(function (dataSource) {
            const sinaSubDataSource = that.sina.getDataSource(dataSource.id);
            if (!sinaSubDataSource) {
              undefinedSubDataSourceIds.push(dataSource.id);
            }
            return sinaSubDataSource;
          });
        } else {
          sinaSubDataSources = [];
        }

        // delete all undefined entries (datasources which do not exist currently)
        sinaSubDataSources = sinaSubDataSources.filter(x => x);

        // DataSourceType.UserCategory: switch in sina.js createDataSource depending on DataSourceType
        userCategory = this.sina.createDataSource({
          id: favUserCategory.id,
          label: i18n.getText("label_userFavorites"),
          labelPlural: i18n.getText("label_userFavorites"),
          type: this.sina.DataSourceType.UserCategory,
          includeApps: favUserCategory.includeApps || false,
          subDataSources: sinaSubDataSources,
          undefinedSubDataSourceIds: undefinedSubDataSourceIds
        });
        this.categories.push(userCategory);
      }
      return Promise.resolve();
    }
    isPersonalizationStorageItem(object) {
      return true;
    }
    getCategory(id) {
      for (const category of this.categories) {
        if (category.id === id) {
          return category;
        }
      }
      return null;
    }
    isFavActive() {
      return this.active;
    }
    setFavActive(active) {
      this.active = active;
    }
    isLastFavActive() {
      return this.lastActive;
    }
    setLastFavActive(value) {
      this.lastActive = value;
    }
    save() {
      const categoriesJson = [];

      // check change of subDataSources
      // convert sina -> Fav format
      for (const category of this.categories) {
        const subDataSourceList = [];
        // add subDataSources (active)
        for (const subDataSource of category.subDataSources) {
          subDataSourceList.push({
            id: subDataSource.id
          });
        }
        // add undefinedSubDataSources (inactive)
        for (const undefinedSubDataSourceId of category.undefinedSubDataSourceIds) {
          subDataSourceList.push({
            id: undefinedSubDataSourceId
          });
        }
        categoriesJson.push({
          id: category.id,
          includeApps: category.includeApps,
          subDataSources: subDataSourceList
        });
      }
      this.personalizationStorage.setItem(myFavDataStore, {
        active: this.isFavActive(),
        userCatgories: categoriesJson
      });
      // save must be finished before reload
      // timeout necessary for MessageToast display with success message for save
      this.personalizationStorage.saveNotDelayed().then(function () {
        //search used and flag for 'Use Personalized Search Scope' changed => reset to home URL required
        //refresh of search dropdown listbox
        if (isSearchAppActive() && this.isLastFavActive() !== this.isFavActive()) {
          const result = new RegExp(/^[^#]*#/).exec(window.location.href); //new RegExp('^[^#]*') without # /
          const sUrl = result[0];
          setTimeout(function () {
            window.location.assign(sUrl);
            window.location.reload();
          }, 2000);
        } else if (
        //search not used and flag for 'Use Personalized Search Scope' changed --> refresh of search dropdown listbox OR
        //when search used and flag for 'Use Personalized Search Scope' not changed --> refresh for tree update after change of My Favorites
        !isSearchAppActive() && this.isLastFavActive() !== this.isFavActive() || isSearchAppActive() && this.isLastFavActive() === this.isFavActive()) {
          setTimeout(function () {
            window.location.reload();
          }, 2000);
        }
      }.bind(this));
    }
  }
  return UserCategoryManager;
});
})();