/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./ComparisonOperator", "./ComplexCondition", "./Filter", "./LogicalOperator", "./SearchResultSetItemAttribute", "./SearchResultSetItemAttributeGroup", "./SimpleCondition", "./HierarchyDisplayType"], function (___ComparisonOperator, ___ComplexCondition, ___Filter, ___LogicalOperator, ___SearchResultSetItemAttribute, ___SearchResultSetItemAttributeGroup, ___SimpleCondition, ___HierarchyDisplayType) {
  "use strict";

  const ComparisonOperator = ___ComparisonOperator["ComparisonOperator"];
  const ComplexCondition = ___ComplexCondition["ComplexCondition"];
  const Filter = ___Filter["Filter"];
  const LogicalOperator = ___LogicalOperator["LogicalOperator"];
  const SearchResultSetItemAttribute = ___SearchResultSetItemAttribute["SearchResultSetItemAttribute"];
  const SearchResultSetItemAttributeGroup = ___SearchResultSetItemAttributeGroup["SearchResultSetItemAttributeGroup"];
  const SimpleCondition = ___SimpleCondition["SimpleCondition"];
  const HierarchyDisplayType = ___HierarchyDisplayType["HierarchyDisplayType"];
  function convertOperator2Wildcards(value, operator) {
    if (operator === ComparisonOperator.Eq) {
      return value;
    }
    const result = [];
    const values = value.split(" ");
    for (let i = 0; i < values.length; i++) {
      let trimedValue = values[i].trim();
      if (trimedValue.length === 0) {
        continue;
      }
      switch (operator) {
        case ComparisonOperator.Co:
          trimedValue = "*" + trimedValue + "*";
          break;
        case ComparisonOperator.Bw:
          trimedValue = trimedValue + "*";
          break;
        case ComparisonOperator.Ew:
          trimedValue = "*" + trimedValue;
          break;
        default:
          break;
      }
      result.push(trimedValue);
    }
    return result.join(" ");
  }
  function getNavigationHierarchyDataSources(sina, hierarchyAttrId, hierarchyName, dataSource) {
    const navigationDataSources = [];
    if (hierarchyAttrId?.length && sina) {
      const boDataSources = sina.getBusinessObjectDataSources();
      boDataSources.forEach(boDataSource => {
        if (boDataSource.getHierarchyDataSource() === dataSource) {
          navigationDataSources.push(boDataSource);
        } else if (boDataSource.hierarchyName === hierarchyAttrId) {
          // avoid self reference
          return;
        } else {
          boDataSource.attributesMetadata.forEach(attribute => {
            if (attribute.hierarchyName === hierarchyName && attribute.id === hierarchyAttrId && attribute.hierarchyDisplayType === HierarchyDisplayType.HierarchyResultView || attribute.hierarchyDisplayType === HierarchyDisplayType.StaticHierarchyFacet) {
              navigationDataSources.push(boDataSource);
            }
          });
        }
      });
    }
    return navigationDataSources;
  }

  // Prepare title as value label in filter condition
  function assembleTitle(result) {
    const titleValueArray = [];
    result.titleAttributes.forEach(titleAttr => {
      if (titleAttr instanceof SearchResultSetItemAttributeGroup && Array.isArray(titleAttr.attributes)) {
        titleAttr.attributes.forEach(subAttributeGroup => {
          if (subAttributeGroup.attribute && subAttributeGroup.attribute instanceof SearchResultSetItemAttribute && subAttributeGroup.attribute.value?.startsWith("sap-icon://") !== true) {
            titleValueArray.push(subAttributeGroup.attribute.valueFormatted);
          }
        });
      } else if (titleAttr instanceof SearchResultSetItemAttribute) {
        if (titleAttr.value.startsWith("sap-icon://") !== true) {
          titleValueArray.push(titleAttr.valueFormatted);
        }
      }
    });
    return titleValueArray.filter(item => typeof item === "string" && item.trim() !== "").join(" ");
  }

  // Assemble down navigation to related descendants as bottom navigation toolbar link
  function assembleHierarchyDecendantsNavigations(result, attrName, attrValue, attrValueLabel, navigationDataSources) {
    const datasetCondition = new SimpleCondition({
      attribute: attrName,
      operator: ComparisonOperator.DescendantOf,
      value: attrValue,
      valueLabel: attrValueLabel
    });
    const wrapComplexConditionDS = new ComplexCondition({
      operator: LogicalOperator.And,
      conditions: [datasetCondition]
    });
    const rootConditionDS = new ComplexCondition({
      operator: LogicalOperator.And,
      conditions: [wrapComplexConditionDS]
    });
    navigationDataSources.forEach(navigationDataSource => {
      const filterDS = new Filter({
        dataSource: navigationDataSource,
        searchTerm: "",
        //navigation mode, ignore content in search input box
        rootCondition: rootConditionDS,
        sina: result.sina
      });
      result.navigationTargets.push(result.sina.createSearchNavigationTarget(filterDS, navigationDataSource.labelPlural));
    });
  }
  function stringifyValue(value) {
    if (typeof value === "string") {
      return value;
    }
    if (typeof value === "number" || typeof value === "boolean") {
      return String(value);
    }
    if (value === null || value === undefined) {
      return "";
    }
    if (typeof value === "object") {
      if (typeof value.toString === "function") {
        return value.toString();
      } else {
        return JSON.stringify(value);
      }
    }
    return "" + value;
  }
  var __exports = {
    __esModule: true
  };
  __exports.convertOperator2Wildcards = convertOperator2Wildcards;
  __exports.getNavigationHierarchyDataSources = getNavigationHierarchyDataSources;
  __exports.assembleTitle = assembleTitle;
  __exports.assembleHierarchyDecendantsNavigations = assembleHierarchyDecendantsNavigations;
  __exports.stringifyValue = stringifyValue;
  return __exports;
});
})();