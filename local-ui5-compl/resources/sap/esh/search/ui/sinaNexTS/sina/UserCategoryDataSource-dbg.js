/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./DataSource"], function (___DataSource) {
  "use strict";

  const DataSource = ___DataSource["DataSource"];
  class UserCategoryDataSource extends DataSource {
    includeApps = false;
    subDataSources = [];
    undefinedSubDataSourceIds = [];
    constructor(properties) {
      super(properties);
      this.includeApps = properties.includeApps;
      this.subDataSources = properties.subDataSources ?? this.subDataSources;
      this.undefinedSubDataSourceIds = properties.undefinedSubDataSourceIds ?? this.undefinedSubDataSourceIds;
    }

    // includeApps
    isIncludeApps() {
      return this.includeApps;
    }
    setIncludeApps(includeApps) {
      this.includeApps = includeApps;
    }

    // subDataSource
    addSubDataSource(dataSource) {
      this.subDataSources.push(dataSource);
    }
    clearSubDataSources() {
      this.subDataSources = [];
    }
    getSubDataSources() {
      return this.subDataSources;
    }
    hasSubDataSource(subDataSourceId) {
      for (const subDataSource of this.subDataSources) {
        //  if (subDataSource) {
        if (subDataSource.id === subDataSourceId) {
          return true;
        }
        //   }
      }
      return false;
    }

    // undefinedSubDataSourceIds
    addUndefinedSubDataSourceId(id) {
      this.undefinedSubDataSourceIds.push(id);
    }
    clearUndefinedSubDataSourceIds() {
      this.undefinedSubDataSourceIds = [];
    }
    getUndefinedSubDataSourceIds() {
      return this.undefinedSubDataSourceIds;
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.UserCategoryDataSource = UserCategoryDataSource;
  return __exports;
});
})();