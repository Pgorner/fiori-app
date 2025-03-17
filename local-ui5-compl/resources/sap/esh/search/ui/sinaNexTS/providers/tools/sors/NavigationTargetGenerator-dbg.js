/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../../../core/util", "../../../core/core", "./JoinConditions", "../../../sina/SinaObject"], function (util, core, ___JoinConditions, _____sina_SinaObject) {
  "use strict";

  const JoinConditions = ___JoinConditions["JoinConditions"];
  const SinaObject = _____sina_SinaObject["SinaObject"];
  class NavigationTargetGenerator extends SinaObject {
    active;
    getPropertyMetadata;
    urlPrefix;
    navigationTargetTemplatesInitialized;
    navigationTargetTemplatesMap;
    objectTypeMap;
    ignoredSemanticObjectTypes;
    constructor(properties) {
      super(properties);
      this.active = this.checkActive();
      this.getPropertyMetadata = properties.getPropertyMetadata;
      this.urlPrefix = properties.urlPrefix;
      this.navigationTargetTemplatesInitialized = false;
      this.navigationTargetTemplatesMap = {};
      this.objectTypeMap = {};
      this.ignoredSemanticObjectTypes = {
        LastChangedByUser: true,
        CreationDate: true,
        CreatedByUser: true
      };
    }
    checkActive() {
      const sors = util.getUrlParameter("sors");
      if (sors === "true") {
        return true;
      }
      return false;
    }
    cleanup() {
      this.objectTypeMap = null;
    }
    registerObjectType(objectTypeMetadata) {
      if (!this.active) {
        return;
      }
      const metadata = {
        type: objectTypeMetadata.type,
        label: objectTypeMetadata.label,
        propertyMap: {}
      };
      this.objectTypeMap[objectTypeMetadata.type] = metadata;
      for (let i = 0; i < objectTypeMetadata.properties.length; ++i) {
        const property = objectTypeMetadata.properties[i];
        const propertyMetadata = this.getPropertyMetadata(property);
        this.filterSemanticObjectType(propertyMetadata);
        metadata.propertyMap[propertyMetadata.name] = propertyMetadata;
      }
    }
    filterSemanticObjectType(property) {
      if (this.ignoredSemanticObjectTypes[property.semanticObjectType]) {
        delete property.semanticObjectType;
      }
    }
    finishRegistration() {
      if (!this.active) {
        return;
      }
      this.calculateNavigationTargetTemplates();
    }
    calculateNavigationTargetTemplates() {
      if (this.navigationTargetTemplatesInitialized) {
        return;
      }
      const joinConditionsMap = this.collectJoinConditions();
      this.navigationTargetTemplatesMap = this.createNavTargetTemplatesFromJoinConditions(joinConditionsMap);
      this.cleanup();
      this.navigationTargetTemplatesInitialized = true;
    }
    createNavTargetTemplatesFromJoinConditions(joinConditionsMap) {
      const navigationTargetTemplatesMap = {};
      for (const sourceObjectType in joinConditionsMap) {
        const objectTypeJoinConditionsMap = joinConditionsMap[sourceObjectType];
        const navigationTargets = [];
        for (const targetObjectType in objectTypeJoinConditionsMap) {
          const joinConditions = objectTypeJoinConditionsMap[targetObjectType];
          if (!joinConditions) {
            continue;
          }
          navigationTargets.push(...joinConditions.generateNavigationTargetTemplates());
        }
        if (navigationTargets.length !== 0) {
          navigationTargetTemplatesMap[sourceObjectType] = navigationTargets;
        }
      }
      return navigationTargetTemplatesMap;
    }
    collectJoinConditions() {
      const semanticObjectTypeMap = this.createIndex();
      const joinConditionsMap = {};
      for (const objectType in this.objectTypeMap) {
        const objectTypeJoinConditionsMap = this.collectJoinConditionsForObjectType(semanticObjectTypeMap, objectType);
        if (!core.isEmptyObject(objectTypeJoinConditionsMap)) {
          joinConditionsMap[objectType] = objectTypeJoinConditionsMap;
        }
      }
      return joinConditionsMap;
    }
    collectJoinConditionsForObjectType(semanticObjectTypeMap, objectType) {
      const objectTypeJoinConditionsMap = {};
      const objectTypeMetadata = this.objectTypeMap[objectType];
      const getJoinConditions = function (targetObjectType) {
        let joinConditions = objectTypeJoinConditionsMap[targetObjectType];
        if (!joinConditions) {
          joinConditions = new JoinConditions({
            sina: this.sina,
            navigationTargetGenerator: this,
            sourceObjectType: objectType,
            targetObjectType: targetObjectType
          });
          objectTypeJoinConditionsMap[targetObjectType] = joinConditions;
        }
        return joinConditions;
      }.bind(this);
      for (const propertyName in objectTypeMetadata.propertyMap) {
        const property = objectTypeMetadata.propertyMap[propertyName];
        const semanticObjectType = property.semanticObjectType;
        if (!property.response) {
          continue;
        }
        if (!semanticObjectType) {
          continue;
        }
        const targetObjectTypeMap = semanticObjectTypeMap[semanticObjectType];
        for (const targetObjectType in targetObjectTypeMap) {
          if (targetObjectType === objectTypeMetadata.type) {
            continue;
          }
          const targetObjectTypeMetadata = this.objectTypeMap[targetObjectType];
          const targetPropertyNameMap = targetObjectTypeMap[targetObjectType];
          for (const targetPropertyName in targetPropertyNameMap) {
            const targetProperty = targetObjectTypeMetadata.propertyMap[targetPropertyName];
            if (!targetProperty.request) {
              continue;
            }
            const joinConditions = getJoinConditions(targetObjectType);
            joinConditions.add({
              sourcePropertyName: propertyName,
              targetPropertyName: targetPropertyName,
              semanticObjectType: semanticObjectType
            });
          }
        }
      }
      return objectTypeJoinConditionsMap;
    }
    createIndex() {
      const semanticObjectTypeMap = {}; // semantic object type / business object type / property name
      for (const objectType in this.objectTypeMap) {
        this.createIndexForObjectType(semanticObjectTypeMap, objectType);
      }
      return semanticObjectTypeMap;
    }
    createIndexForObjectType(semanticObjectTypeMap, objectType) {
      const objectTypeMetadata = this.objectTypeMap[objectType];
      for (const propertyName in objectTypeMetadata.propertyMap) {
        const property = objectTypeMetadata.propertyMap[propertyName];
        const semanticObjectType = property.semanticObjectType;
        if (!semanticObjectType) {
          continue;
        }
        let objectTypeMap = semanticObjectTypeMap[semanticObjectType];
        if (!objectTypeMap) {
          objectTypeMap = {};
          semanticObjectTypeMap[semanticObjectType] = objectTypeMap;
        }
        let propertyNameMap = objectTypeMap[objectTypeMetadata.type];
        if (!propertyNameMap) {
          propertyNameMap = {};
          objectTypeMap[objectTypeMetadata.type] = propertyNameMap;
        }
        let propertyFlag = propertyNameMap[propertyName];
        if (!propertyFlag) {
          propertyFlag = true;
          propertyNameMap[propertyName] = true;
        }
      }
    }
    formatItem(item) {
      const collectAttributes = function (data, attributes) {
        for (let i = 0; i < attributes.length; ++i) {
          const attribute = attributes[i];
          data[attribute.id] = attribute;
        }
      };
      const data = {};
      collectAttributes(data, item.detailAttributes);
      collectAttributes(data, item.titleAttributes);
      return data;
    }
    generateNavigationTargetsForItem(item) {
      const navigationTargetTemplates = this.navigationTargetTemplatesMap[item.dataSource.id];
      if (!navigationTargetTemplates) {
        return undefined;
      }
      const formattedItem = this.formatItem(item);
      const navigationTargets = [];
      for (let i = 0; i < navigationTargetTemplates.length; ++i) {
        const navigationTargetTemplate = navigationTargetTemplates[i];
        const navigationTarget = navigationTargetTemplate.generate(formattedItem);
        if (!navigationTarget) {
          continue;
        }
        navigationTargets.push(navigationTarget);
      }
      return navigationTargets;
    }
    generateNavigationTargets(searchResultSet) {
      if (!this.active) {
        return;
      }
      for (let i = 0; i < searchResultSet.items.length; ++i) {
        const item = searchResultSet.items[i];
        const navigationTargets = this.generateNavigationTargetsForItem(item);
        item.setNavigationTargets(navigationTargets);
      }
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.NavigationTargetGenerator = NavigationTargetGenerator;
  return __exports;
});
})();