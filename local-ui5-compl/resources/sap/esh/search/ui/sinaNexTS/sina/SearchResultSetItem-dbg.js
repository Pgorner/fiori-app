/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./ResultSetItem", "../core/core"], function (___ResultSetItem, ___core_core) {
  "use strict";

  const ResultSetItem = ___ResultSetItem["ResultSetItem"];
  const generateGuid = ___core_core["generateGuid"];
  class SearchResultSetItem extends ResultSetItem {
    // _meta: {
    //     properties: {
    //         dataSource: {
    //             required: true
    //         },
    //         titleAttributes: {
    //             required: true,
    //             aggregation: true
    //         },
    //         titleDescriptionAttributes: {
    //             required: false,
    //             aggregation: true
    //         },
    //         detailAttributes: {
    //             required: true,
    //             aggregation: true
    //         },
    //         defaultNavigationTarget: {
    //             required: false,
    //             aggregation: true
    //         },
    //         navigationTargets: {
    //             required: false,
    //             aggregation: true
    //         },
    //         score: {
    //             required: false,
    //             default: 0
    //         }
    //     }
    // },

    dataSource;
    attributes;
    attributesMap;
    titleAttributes;
    titleDescriptionAttributes;
    detailAttributes;
    defaultNavigationTarget;
    navigationTargets;
    score = 0;
    hierarchyNodePaths;
    constructor(properties) {
      super(properties);
      this.dataSource = properties.dataSource ?? this.dataSource;
      this.setAttributes(properties.attributes || []);
      this.setTitleAttributes(properties.titleAttributes);
      this.setTitleDescriptionAttributes(properties.titleDescriptionAttributes);
      this.setDetailAttributes(properties.detailAttributes);
      this.setDefaultNavigationTarget(properties.defaultNavigationTarget);
      this.setNavigationTargets(properties.navigationTargets || []);
      this.score = properties.score ?? this.score;
      this.hierarchyNodePaths = properties.hierarchyNodePaths ?? this.hierarchyNodePaths;
    }
    setDefaultNavigationTarget(navigationTarget) {
      if (!navigationTarget) {
        this.defaultNavigationTarget = undefined;
        return;
      }
      this.defaultNavigationTarget = navigationTarget;
      navigationTarget.parent = this;
    }
    setNavigationTargets(navigationTargets) {
      this.navigationTargets = [];
      if (!navigationTargets) {
        return;
      }
      for (const navigationTarget of navigationTargets) {
        this.addNavigationTarget(navigationTarget);
      }
    }
    addNavigationTarget(navigationTarget) {
      this.navigationTargets.push(navigationTarget);
      navigationTarget.parent = this;
    }
    setAttributes(attributes) {
      this.attributes = [];
      this.attributesMap = {};
      for (const attribute of attributes) {
        this.attributes.push(attribute);
        this.attributesMap[attribute.id] = attribute;
        attribute.parent = this;
      }
    }
    setTitleAttributes(titleAttributes) {
      this.titleAttributes = [];
      if (!Array.isArray(titleAttributes) || titleAttributes.length < 1) {
        return this;
      }
      for (let i = 0; i < titleAttributes.length; i++) {
        const item = titleAttributes[i];
        item.parent = this;
        this.titleAttributes.push(item);
      }
      return this;
    }
    setTitleDescriptionAttributes(titleDescriptionAttributes) {
      this.titleDescriptionAttributes = [];
      if (!Array.isArray(titleDescriptionAttributes) || titleDescriptionAttributes.length < 1) {
        return this;
      }
      for (let i = 0; i < titleDescriptionAttributes.length; i++) {
        const item = titleDescriptionAttributes[i];
        item.parent = this;
        this.titleDescriptionAttributes.push(item);
      }
      return this;
    }
    setDetailAttributes(detailAttributes) {
      this.detailAttributes = [];
      if (!Array.isArray(detailAttributes) || detailAttributes.length < 1) {
        return this;
      }
      for (let i = 0; i < detailAttributes.length; i++) {
        const item = detailAttributes[i];
        item.parent = this;
        this.detailAttributes.push(item);
      }
      return this;
    }
    get key() {
      const parts = [];
      parts.push(this.dataSource.id);
      for (const titleAttribute of this.titleAttributes) {
        const subAttributes = titleAttribute.getSubAttributes();
        for (const subAttribute of subAttributes) {
          parts.push(subAttribute.value);
        }
      }
      if (parts.length === 1) {
        // no title attributes -> use guid
        parts.push(generateGuid());
      }
      return parts.join("-");
    }
    toString() {
      let i;
      const result = [];
      const title = [];
      for (i = 0; i < this.titleAttributes.length; ++i) {
        const titleAttribute = this.titleAttributes[i];
        title.push(titleAttribute.toString());
      }
      result.push("--" + title.join(" "));
      for (i = 0; i < this.detailAttributes.length; ++i) {
        const detailAttribute = this.detailAttributes[i];
        result.push(detailAttribute.toString());
      }
      return result.join("\n");
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.SearchResultSetItem = SearchResultSetItem;
  return __exports;
});
})();