/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["sap/base/Log", "./suggestions/SuggestionType", "./personalization/PersonalizationKeys"], function (Log, ___suggestions_SuggestionType, ___personalization_PersonalizationKeys) {
  "use strict";

  const Type = ___suggestions_SuggestionType["Type"];
  const SuggestionType = ___suggestions_SuggestionType["SuggestionType"];
  const RecentEntriesPosition = ___suggestions_SuggestionType["RecentEntriesPosition"];
  const PersonalizationKeys = ___personalization_PersonalizationKeys["PersonalizationKeys"];
  var StorageVersion = /*#__PURE__*/function (StorageVersion) {
    StorageVersion[StorageVersion["V2"] = 2] = "V2";
    return StorageVersion;
  }(StorageVersion || {});
  const objectSuggestionCopyProperties = ["uiSuggestionType", "label", "label1", "label2", "imageUrl", "imageIsCircular", "imageExists"];
  const searchSuggestionCopyProperties = ["uiSuggestionType", "label", "icon", "filterIcon"];
  const transactionSuggestionsCopyProperties = ["uiSuggestionType", "label", "url", "icon", "searchTerm"];
  class RecentlyUsedStorage {
    personalizationStorage;
    _oLogger;
    maxItems;
    key = (() => PersonalizationKeys.recentSearches)();
    searchModel;
    constructor(properties) {
      this.personalizationStorage = properties.personalizationStorage;
      this._oLogger = Log.getLogger("sap.esh.search.ui.RecentlyUsedStorage");
      this.maxItems = properties.maxItems || 10;
      this.searchModel = properties.searchModel;
    }
    async deleteAllItems() {
      this.personalizationStorage.deleteItem(this.key);
      return this.personalizationStorage.save();
    }
    getSerializedItemsInternal() {
      const serializedItems = this.personalizationStorage.getItem(this.key) ?? [];
      return serializedItems.filter(item => item.version >= StorageVersion.V2);
    }
    getItems() {
      const currentFilter = this.searchModel?.query?.filter;
      return this.getSerializedItemsInternal().map(serializedItem => this.deSerialize(serializedItem)).filter(item => {
        if (item.uiSuggestionType === Type.Search && item.filter.equals(currentFilter)) {
          return false;
        }
        return true;
      });
    }
    copyProperties(target, source, properties) {
      for (const property of properties) {
        target[property] = source[property];
      }
    }
    deSerialize(serializedItem) {
      const item = {
        label: ""
      };
      let tmpResult;
      switch (serializedItem.uiSuggestionType) {
        case SuggestionType.Object:
          this.copyProperties(item, serializedItem, objectSuggestionCopyProperties);
          item.titleNavigation = this.searchModel.sinaNext.parseNavigationTargetFromJson(serializedItem.titleNavigation);
          item.dataSource = this.searchModel.sinaNext.getDataSource(serializedItem.dataSource);
          break;
        case SuggestionType.Search:
          this.copyProperties(item, serializedItem, searchSuggestionCopyProperties);
          tmpResult = this.deSerializeSearchNavigationTarget(serializedItem.titleNavigation);
          item.titleNavigation = tmpResult.navigationTarget;
          item.filter = tmpResult.filter;
          break;
        case SuggestionType.Transaction:
          this.copyProperties(item, serializedItem, transactionSuggestionsCopyProperties);
          break;
      }
      item.position = RecentEntriesPosition;
      item.isRecentEntry = true;
      return item;
    }
    serialize(item) {
      const serializedRecentItem = {
        key: ""
      };
      switch (item.uiSuggestionType) {
        case SuggestionType.Object:
          this.copyProperties(serializedRecentItem, item, objectSuggestionCopyProperties);
          serializedRecentItem.titleNavigation = item.titleNavigation.toJson();
          serializedRecentItem.dataSource = item.dataSource.id;
          serializedRecentItem.key = item.uiSuggestionType + "/" + item.label1 + "/" + item.label2;
          break;
        case SuggestionType.Search:
          this.copyProperties(serializedRecentItem, item, searchSuggestionCopyProperties);
          serializedRecentItem.titleNavigation = this.serializeSearchNavigationTarget(item.titleNavigation);
          serializedRecentItem.key = item.uiSuggestionType + "/" + item.label;
          break;
        case SuggestionType.Transaction:
          this.copyProperties(serializedRecentItem, item, transactionSuggestionsCopyProperties);
          serializedRecentItem.key = item.uiSuggestionType + "/" + item.label;
          break;
      }
      serializedRecentItem.version = StorageVersion.V2;
      return serializedRecentItem;
    }
    serializeSearchNavigationTarget(searchNavigationTarget) {
      // parse navigation target
      const navigationTargetParamters = this.searchModel.parseSearchNavigationTarget(searchNavigationTarget);
      // recreate navigation target with forced updateUrl=true
      return this.searchModel.createSearchNavigationTarget(Object.assign(navigationTargetParamters, {
        updateUrl: true
      })).toJson();
    }
    deSerializeSearchNavigationTarget(navigationTargetJson) {
      // json -> navigation target
      const searchNavigationTarget = this.searchModel.sinaNext.parseNavigationTargetFromJson(navigationTargetJson);
      // parse navigation target
      const navigationTargetParameters = this.searchModel.parseSearchNavigationTarget(searchNavigationTarget);
      // recreate navigation target (this evaluates model.config.updateUrl and create a url based or target function based navigation target)
      return {
        filter: navigationTargetParameters.filter,
        navigationTarget: this.searchModel.createSearchNavigationTarget(navigationTargetParameters)
      };
    }

    /**
     * Adds a search to the recent store. Item at index 0 is newest entry. If item is omitted, the current search will be saved.
     **/
    addItem(item) {
      // check storage enabled
      if (!this.personalizationStorage.isStorageOfPersonalDataAllowed()) return;

      // serialize item
      const serializedItem = this.serialize(item);

      // remove existing items (with identical key)
      const serializedItems = this.getSerializedItemsInternal();
      serializedItems.some((item, index, items) => {
        if (item.key === serializedItem.key) {
          this._oLogger.debug("Removing already existing item " + serializedItem.key + " at pos " + index);
          items.splice(index, 1);
          return true;
        }
      });

      // remove oldest item if limit reached
      if (serializedItems.length >= this.maxItems) {
        const oldest = serializedItems.pop();
        this._oLogger.debug("Removing oldest item " + oldest.key);
      }

      // add new item
      this._oLogger.debug("Adding item " + serializedItem.key);
      serializedItems.unshift(serializedItem);
      this.personalizationStorage.setItem(this.key, serializedItems);
    }
  }
  return RecentlyUsedStorage;
});
})();