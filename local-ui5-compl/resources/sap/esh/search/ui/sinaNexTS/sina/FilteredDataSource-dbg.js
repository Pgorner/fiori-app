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
  class FilteredDataSource extends DataSource {
    dataSource;
    filterCondition;
    constructor(properties) {
      properties.annotations = properties.annotations ?? properties.dataSource.annotations;
      properties.hidden = properties.hidden ?? properties.dataSource.hidden;
      properties.attributesMetadata = properties.attributesMetadata ?? properties.dataSource.attributesMetadata;
      properties.attributeMetadataMap = properties.attributeMetadataMap ?? properties.dataSource.attributeMetadataMap;
      properties.attributeGroupsMetadata = properties.attributeGroupsMetadata ?? properties.dataSource.attributeGroupsMetadata;
      properties.attributeGroupMetadataMap = properties.attributeGroupMetadataMap ?? properties.dataSource.attributeGroupMetadataMap;
      properties.isHierarchyDataSource = properties.isHierarchyDataSource ?? properties.dataSource.isHierarchyDataSource;
      properties.hierarchyName = properties.hierarchyName ?? properties.dataSource.hierarchyName;
      properties.hierarchyDisplayType = properties.hierarchyDisplayType ?? properties.dataSource.hierarchyDisplayType;
      properties.hierarchyAttribute = properties.hierarchyAttribute ?? properties.dataSource.hierarchyAttribute;
      super(properties);
      this.dataSource = properties.dataSource;
      this.filterCondition = properties.filterCondition;
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.FilteredDataSource = FilteredDataSource;
  return __exports;
});
})();