/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["../../sina/HierarchyDisplayType"], function (____sina_HierarchyDisplayType) {
  "use strict";

  const HierarchyDisplayType = ____sina_HierarchyDisplayType["HierarchyDisplayType"];
  class HierarchyMetadataParser {
    jQuery;
    constructor(jQuery) {
      this.jQuery = jQuery;
    }
    parse(entityTypeName, hierarchAnnotationNode) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that = this;
      const hierarchyDefinitionsMap = {};
      that.jQuery(hierarchAnnotationNode).find(">Collection").each(function () {
        that.jQuery(this).find(">Record").each(function () {
          const hierarchyDefinition = that.parseRecord(entityTypeName, this);
          hierarchyDefinitionsMap[hierarchyDefinition.attributeName] = hierarchyDefinition;
        });
      });
      return hierarchyDefinitionsMap;
    }
    parseRecord(entityTypeName, recordNode) {
      const hierarchyDefinition = {
        name: "",
        // name of hierarchy
        attributeName: "",
        // name of attribute
        displayType: HierarchyDisplayType.DynamicHierarchyFacet,
        isHierarchyDefinition: false,
        // entity set represents the hierarchy (self reference)
        parentAttributeName: "",
        // ??
        childAttributeName: "" // ??
      };
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that = this;
      that.jQuery(recordNode).find(">PropertyValue").each(function () {
        switch (that.jQuery(this).attr("Property")) {
          case "Definition":
            hierarchyDefinition.name = that.jQuery(this).attr("String");
            break;
          case "Name":
            hierarchyDefinition.attributeName = that.jQuery(this).attr("String");
            break;
          case "displayType":
            switch (that.jQuery(this).attr("String")) {
              case "TREE":
                hierarchyDefinition.displayType = HierarchyDisplayType.StaticHierarchyFacet;
                break;
              case "FLAT":
                hierarchyDefinition.displayType = HierarchyDisplayType.HierarchyResultView;
                break;
            }
            break;
          case "Recurse":
            Object.assign(hierarchyDefinition, that.parseRecurse(this));
        }
      });
      hierarchyDefinition.isHierarchyDefinition = that.calculateIsHierarchyDefinition(entityTypeName, hierarchyDefinition.name);

      // This is a helper hierarchy datasource, no displayType
      // DisplayType is defined by the hierarchy attribute of the main datasource
      if (hierarchyDefinition.isHierarchyDefinition) {
        delete hierarchyDefinition.displayType;
      }
      return hierarchyDefinition;
    }
    calculateIsHierarchyDefinition(entityTypeName, name) {
      // normalize entityTypeName
      if (entityTypeName.endsWith("Type")) {
        entityTypeName = entityTypeName.slice(0, -4);
      }
      // normalize hierarchy name
      name = name.replace(/[.:]/g, "");
      return entityTypeName === name;
    }
    parseRecurse(recurseNode) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that = this;
      const result = {
        parentAttributeName: "",
        childAttributeName: ""
      };
      that.jQuery(recurseNode).find("PropertyValue").each(function () {
        switch (that.jQuery(this).attr("Property")) {
          case "Parent":
            that.jQuery(this).find("Collection").each(function () {
              result.parentAttributeName = that.parseCollection(this);
            });
            break;
          case "Child":
            that.jQuery(this).find(">Collection").each(function () {
              result.childAttributeName = that.parseCollection(this);
            });
        }
      });
      return result;
    }
    parseCollection(collectionNode) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that = this;
      let attributeName;
      that.jQuery(collectionNode).find(">PropertyPath").each(function () {
        attributeName = that.jQuery(this).text();
      });
      return attributeName;
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.HierarchyMetadataParser = HierarchyMetadataParser;
  return __exports;
});
})();