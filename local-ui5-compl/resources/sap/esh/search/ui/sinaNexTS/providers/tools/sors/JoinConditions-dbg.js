/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./NavigationTargetTemplate", "../../../sina/SinaObject"], function (___NavigationTargetTemplate, _____sina_SinaObject) {
  "use strict";

  const NavigationTargetTemplate = ___NavigationTargetTemplate["NavigationTargetTemplate"];
  const SinaObject = _____sina_SinaObject["SinaObject"];
  class JoinConditions extends SinaObject {
    navigationTargetGenerator;
    sourceObjectType;
    targetObjectType;
    conditions;
    constructor(properties) {
      super(properties);
      this.navigationTargetGenerator = properties.navigationTargetGenerator;
      this.sourceObjectType = properties.sourceObjectType;
      this.targetObjectType = properties.targetObjectType;
      this.conditions = [];
    }
    add(condition) {
      this.conditions.push(condition);
    }
    hasDuplicateSemanticObject() {
      const map = {};
      for (let i = 0; i < this.conditions.length; ++i) {
        const condition = this.conditions[i];
        if (map[condition.semanticObjectType]) {
          return true;
        }
        map[condition.semanticObjectType] = true;
      }
      return false;
    }
    hasDistinctValue(semanticObjectType, property) {
      let value;
      for (let i = 0; i < this.conditions.length; ++i) {
        const condition = this.conditions[i];
        if (condition.semanticObjectType !== semanticObjectType) {
          continue;
        }
        if (!value) {
          value = condition[property];
          continue;
        }
        if (value !== condition[property]) {
          return false;
        }
      }
      return true;
    }
    generateNavigationTargetTemplates() {
      if (this.hasDuplicateSemanticObject()) {
        return this.createSingleConditionsTemplates();
      }
      return this.createMultipleConditionsTemplates();
    }
    createSingleConditionsTemplates() {
      const navigationTargetTemplates = [];
      for (let i = 0; i < this.conditions.length; ++i) {
        const condition = this.conditions[i];
        const sourcePropertyNameDistinct = this.hasDistinctValue(condition.semanticObjectType, "sourcePropertyName");
        const targetPropertyNameDistinct = this.hasDistinctValue(condition.semanticObjectType, "targetPropertyName");
        if (!sourcePropertyNameDistinct && !targetPropertyNameDistinct) {
          continue;
        }
        const navigationTargetTemplate = new NavigationTargetTemplate({
          sina: this.sina,
          navigationTargetGenerator: this.navigationTargetGenerator,
          label: "dummy",
          sourceObjectType: this.sourceObjectType,
          targetObjectType: this.targetObjectType,
          conditions: [condition]
        });
        navigationTargetTemplate._condition = condition;
        navigationTargetTemplates.push(navigationTargetTemplate);
      }
      this.assembleSingleConditionTemplateLabels(navigationTargetTemplates);
      return navigationTargetTemplates;
    }
    createMultipleConditionsTemplates() {
      return [new NavigationTargetTemplate({
        sina: this.sina,
        navigationTargetGenerator: this.navigationTargetGenerator,
        label: this.navigationTargetGenerator.objectTypeMap[this.targetObjectType].label,
        sourceObjectType: this.sourceObjectType,
        targetObjectType: this.targetObjectType,
        conditions: this.conditions
      })];
    }
    assembleSingleConditionTemplateLabels(navigationTargets) {
      // assemble label based on target object and target property
      // collect in navigation target in map with label key
      const targetMap = {};
      let targets, labelKey, navigationTarget, metadata;
      for (let i = 0; i < navigationTargets.length; ++i) {
        navigationTarget = navigationTargets[i];
        metadata = this.navigationTargetGenerator.objectTypeMap[this.targetObjectType];
        labelKey = metadata.label + " to:" + metadata.propertyMap[navigationTarget._condition.targetPropertyName].label;
        navigationTarget.label = labelKey;
        targets = targetMap[labelKey];
        if (!targets) {
          targets = [];
          targetMap[labelKey] = targets;
        }
        targets.push(navigationTarget);
      }
      // assemble final label
      metadata = this.navigationTargetGenerator.objectTypeMap[this.sourceObjectType];
      for (labelKey in targetMap) {
        targets = targetMap[labelKey];
        if (targets.length > 1) {
          for (let j = 0; j < targets.length; ++j) {
            navigationTarget = targets[j];
            navigationTarget.label += " from:" + metadata.propertyMap[navigationTarget._condition.sourcePropertyName].label;
          }
        }
      }
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.JoinConditions = JoinConditions;
  return __exports;
});
})();