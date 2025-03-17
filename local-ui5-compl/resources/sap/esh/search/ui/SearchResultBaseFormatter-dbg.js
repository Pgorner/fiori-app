/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["./error/ErrorHandler", "./i18n"], function (__ErrorHandler, __i18n) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const ErrorHandler = _interopRequireDefault(__ErrorHandler);
  const i18n = _interopRequireDefault(__i18n);
  class SearchResultBaseFormatter {
    model;
    errorHandler;
    constructor(model) {
      this.model = model;
      this.errorHandler = ErrorHandler.getInstance();
    }

    /*
     * ===================================
     * format attributes for search result sort dialog
     * ===================================
     */
    formatSortAttributes() {
      const sortAttributes = [];
      const sina = this.model.sinaNext;
      const datasource = this.model.getDataSource();
      const attributesMetadata = sina.dataSourceMap[datasource.id].attributesMetadata;
      if (!Array.isArray(attributesMetadata) || attributesMetadata.length === 0) {
        return [];
      }

      // sortable attributes
      for (let i = 0; i < attributesMetadata.length; i++) {
        const attribute = attributesMetadata[i];
        if (attribute.isSortable) {
          sortAttributes.push({
            name: attribute.label,
            key: "searchSortAttributeKey" + i,
            attributeId: attribute.id
          });
        }
      }
      const compareAttributes = (a, b) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      };
      sortAttributes.sort(compareAttributes);

      // default sort attribute, server ranking
      sortAttributes.unshift({
        name: i18n.getText("defaultRank"),
        key: "searchSortAttributeKeyDefault",
        attributeId: "DEFAULT_SORT_ATTRIBUTE"
      });

      // set selected
      let orderBy = this.model.getOrderBy().orderBy;
      if (typeof orderBy === "undefined") {
        orderBy = "DEFAULT_SORT_ATTRIBUTE";
      }
      for (let i = 0; i < sortAttributes.length; i++) {
        if (sortAttributes[i].attributeId === orderBy) {
          sortAttributes[i].selected = true;
        } else {
          sortAttributes[i].selected = false;
        }
      }
      return sortAttributes;
    }
  }
  return SearchResultBaseFormatter;
});
})();