/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./SinaObject", "./DataSourceType", "./AttributeMetadata", "./AttributeGroupMetadata", "../core/errors", "./HierarchyDisplayType", "./MatchingStrategy", "./AttributeType"], function (___SinaObject, ___DataSourceType, ___AttributeMetadata, ___AttributeGroupMetadata, ___core_errors, ___HierarchyDisplayType, ___MatchingStrategy, ___AttributeType) {
  "use strict";

  const SinaObject = ___SinaObject["SinaObject"];
  const DataSourceType = ___DataSourceType["DataSourceType"];
  const AttributeMetadata = ___AttributeMetadata["AttributeMetadata"];
  const AttributeGroupMetadata = ___AttributeGroupMetadata["AttributeGroupMetadata"];
  const DataSourceAttributeMetadataNotFoundError = ___core_errors["DataSourceAttributeMetadataNotFoundError"];
  const HierarchyDisplayType = ___HierarchyDisplayType["HierarchyDisplayType"];
  const MatchingStrategy = ___MatchingStrategy["MatchingStrategy"];
  const AttributeType = ___AttributeType["AttributeType"];
  class DataSource extends SinaObject {
    annotations;
    type;
    subType;
    id;
    label;
    labelPlural;
    icon;
    hidden = false;
    usage = {};
    attributesMetadata = [];
    attributeMetadataMap = {};
    attributeGroupsMetadata = [];
    attributeGroupMetadataMap = {};
    isHierarchyDataSource;
    hierarchyName;
    hierarchyDisplayType; // TODO to be removed (consider DI use case)
    hierarchyAttribute;
    _hierarchyDataSource;
    system;
    _hierarchyAttributeGroupMetadata;
    _staticHierarchyAttributeMetadata;
    static getAllDataSource() {
      return new DataSource({
        id: "All",
        label: "All",
        type: DataSourceType.Category
      });
    }
    constructor(properties) {
      super({
        sina: properties.sina
      });
      this.annotations = properties.annotations ?? this.annotations;
      this.type = properties.type ?? this.type;
      this.subType = properties.subType;
      this.id = properties.id ?? this.id;
      this.label = properties.label ?? this.label;
      this.labelPlural = properties.labelPlural ?? this.labelPlural;
      this.icon = properties.icon;
      this.hidden = properties.hidden ?? this.hidden;
      this.usage = properties.usage ?? this.usage;
      this.attributesMetadata = properties.attributesMetadata ?? this.attributesMetadata;
      this.attributeMetadataMap = properties.attributeMetadataMap ?? this.createAttributeMetadataMap(this.attributesMetadata);
      this.attributeGroupsMetadata = properties.attributeGroupsMetadata ?? this.attributeGroupsMetadata;
      this.attributeGroupMetadataMap = properties.attributeGroupMetadataMap ?? this.attributeGroupMetadataMap;
      this.isHierarchyDataSource = properties.isHierarchyDataSource;
      this.hierarchyName = properties.hierarchyName;
      this.hierarchyDisplayType = properties.hierarchyDisplayType;
      this.hierarchyAttribute = properties.hierarchyAttribute;
      if (!this.labelPlural || this.labelPlural.length === 0) {
        this.labelPlural = this.label;
      }
      if (this.type === DataSourceType.BusinessObject && this.attributesMetadata.length === 0) {
        /*      throw new DataSourceAttributeMetadataNotFoundError(
            "Could not find metadata for attributes in data source " + this.id + ". "
        );*/
      }

      // filtered datasources reuse the metadata of the referred datasource
      // (instances of attributeMetadataMap identical)
      // therefore the following line is deactivated
      // this.attributeMetadataMap = this.createAttributeMetadataMap(this.attributesMetadata);
    }

    // equals(): boolean {
    //     throw new Error(
    //         "use === operator for comparison of datasources"
    //     );
    // }

    _configure() {
      // do not use
      // legacy: only called from inav2 provider
      const metadataFormatters = this.sina.metadataFormatters;
      if (!metadataFormatters) {
        return;
      }
      for (let i = 0; i < metadataFormatters.length; ++i) {
        const metadataFormatter = metadataFormatters[i];
        metadataFormatter.format({
          dataSources: [this]
        });
      }
    }
    createAttributeMetadataMap(attributesMetadata = []) {
      const map = {};
      for (let i = 0; i < attributesMetadata.length; ++i) {
        const attributeMetadata = attributesMetadata[i];
        map[attributeMetadata.id] = attributeMetadata;
      }
      return map;
    }
    getAttributeMetadata(attributeId) {
      if (this.id === "All") {
        return this.getCommonAttributeMetadata(attributeId); // for all we have only common attributes
      }
      // Fake metadata for transaction suggestions because transaction connector is not part
      // of the connector dropdown and as such is not part of the connector metadata response:
      if (this.id === "CD$ALL~ESH_TRANSACTION~" && (attributeId === "TCDTEXT" || attributeId === "TCODE") && !this.attributeMetadataMap[attributeId]) {
        this.attributeMetadataMap[attributeId] = new AttributeMetadata({
          label: "label",
          isSortable: false,
          isKey: false,
          matchingStrategy: MatchingStrategy.Text,
          id: attributeId,
          usage: {
            Title: {
              displayOrder: 1
            }
          },
          type: AttributeType.String
        });
      }
      const attributeMetadata = this.attributeMetadataMap[attributeId];
      if (attributeMetadata) {
        return attributeMetadata;
      }
      throw new DataSourceAttributeMetadataNotFoundError(attributeId, this.id);
    }
    getAttributeGroupMetadata(attributeId) {
      if (this.attributeGroupMetadataMap) {
        const attributeGroupMetadata = this.attributeGroupMetadataMap[attributeId];
        if (attributeGroupMetadata) {
          return attributeGroupMetadata;
        }
      }
      throw new DataSourceAttributeMetadataNotFoundError(attributeId, this.id);
    }
    getCommonAttributeMetadata(attributeId) {
      for (const dataSource of this.sina.dataSources) {
        if (dataSource.type !== DataSourceType.BusinessObject) {
          continue;
        }
        const attributeMetadata = dataSource.attributeMetadataMap[attributeId];
        if (attributeMetadata) {
          return attributeMetadata;
        }
      }
      throw new DataSourceAttributeMetadataNotFoundError(attributeId, this.id);
    }
    getHierarchyDataSource() {
      if (this._hierarchyDataSource instanceof DataSource) {
        return this._hierarchyDataSource;
      }
      for (let i = 0; i < this.attributesMetadata.length; ++i) {
        const attributeMetadata = this.attributesMetadata[i];
        if (!attributeMetadata.isHierarchy) {
          continue;
        }
        if (attributeMetadata.hierarchyDisplayType === HierarchyDisplayType.StaticHierarchyFacet || attributeMetadata.hierarchyDisplayType === HierarchyDisplayType.HierarchyResultView) {
          this._hierarchyDataSource = this.sina.getHierarchyDataSource(attributeMetadata.hierarchyName);
          return this._hierarchyDataSource;
        }
      }
      return undefined;
    }
    getStaticHierarchyAttributeMetadata() {
      if (this._staticHierarchyAttributeMetadata) {
        return this._staticHierarchyAttributeMetadata;
      }
      for (let i = 0; i < this.attributesMetadata.length; ++i) {
        const attributeMetadata = this.attributesMetadata[i];
        if (!attributeMetadata.isHierarchy) {
          continue;
        }
        if (attributeMetadata.hierarchyDisplayType === HierarchyDisplayType.StaticHierarchyFacet) {
          this._staticHierarchyAttributeMetadata = attributeMetadata;
          return this._staticHierarchyAttributeMetadata;
        }
      }
      return undefined;
    }
    _getStaticHierarchyAttributeForDisplay() {
      if (this._hierarchyAttributeGroupMetadata instanceof AttributeGroupMetadata || this._hierarchyAttributeGroupMetadata instanceof AttributeMetadata) {
        return this._hierarchyAttributeGroupMetadata;
      }

      // own hierarchy attribute or the one of its helper hierarchy datasource
      const hierarchyAttributeId = this.hierarchyAttribute || this.getHierarchyDataSource()?.hierarchyAttribute;
      if (!hierarchyAttributeId) {
        return undefined;
      }
      // Check attributeGroup led by hierarchy attribute and semantic type textelement. One level is enough, unnecessary to consider recursive case.
      for (let i = 0; i < this.attributeGroupsMetadata.length; i++) {
        const attributeGroupMeta = this.attributeGroupsMetadata[i];
        const parentAttribute = attributeGroupMeta._private?.parentAttribute;
        if (parentAttribute instanceof AttributeMetadata && parentAttribute.id === hierarchyAttributeId && attributeGroupMeta._private?.isDescription === true) {
          this._hierarchyAttributeGroupMetadata = attributeGroupMeta;
          return this._hierarchyAttributeGroupMetadata;
        }
      }

      // return single hierarchy attributeMetadata
      this._hierarchyAttributeGroupMetadata = this.attributeMetadataMap[this.hierarchyAttribute];
      return this._hierarchyAttributeGroupMetadata;
    }
    toJson() {
      return {
        type: this.type,
        id: this.id,
        label: this.label,
        labelPlural: this.labelPlural
      };
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.DataSource = DataSource;
  return __exports;
});
})();