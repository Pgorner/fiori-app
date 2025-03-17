/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./DataSource"],function(a){"use strict";const t=a["DataSource"];class e extends t{dataSource;filterCondition;constructor(a){a.annotations=a.annotations??a.dataSource.annotations;a.hidden=a.hidden??a.dataSource.hidden;a.attributesMetadata=a.attributesMetadata??a.dataSource.attributesMetadata;a.attributeMetadataMap=a.attributeMetadataMap??a.dataSource.attributeMetadataMap;a.attributeGroupsMetadata=a.attributeGroupsMetadata??a.dataSource.attributeGroupsMetadata;a.attributeGroupMetadataMap=a.attributeGroupMetadataMap??a.dataSource.attributeGroupMetadataMap;a.isHierarchyDataSource=a.isHierarchyDataSource??a.dataSource.isHierarchyDataSource;a.hierarchyName=a.hierarchyName??a.dataSource.hierarchyName;a.hierarchyDisplayType=a.hierarchyDisplayType??a.dataSource.hierarchyDisplayType;a.hierarchyAttribute=a.hierarchyAttribute??a.dataSource.hierarchyAttribute;super(a);this.dataSource=a.dataSource;this.filterCondition=a.filterCondition}}var r={__esModule:true};r.FilteredDataSource=e;return r})})();
//# sourceMappingURL=FilteredDataSource.js.map