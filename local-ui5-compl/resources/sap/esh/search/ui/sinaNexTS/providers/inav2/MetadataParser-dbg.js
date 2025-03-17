/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../../core/errors", "../../sina/AttributeFormatType", "../../sina/AttributeType", "../../sina/MatchingStrategy"], function (____core_errors, ____sina_AttributeFormatType, ____sina_AttributeType, ____sina_MatchingStrategy) {
  "use strict";

  const UnknownDataTypeError = ____core_errors["UnknownDataTypeError"];
  const UnknownPresentationUsageError = ____core_errors["UnknownPresentationUsageError"];
  const AttributeFormatType = ____sina_AttributeFormatType["AttributeFormatType"];
  const AttributeType = ____sina_AttributeType["AttributeType"];
  const MatchingStrategy = ____sina_MatchingStrategy["MatchingStrategy"];
  class MetadataParser {
    provider;
    sina;
    constructor(provider) {
      this.provider = provider;
      this.sina = provider.sina;
    }
    normalizeAttributeMetadata(attributeMetadata) {
      attributeMetadata.IsKey = attributeMetadata.isKey; // normalize, probably a typo in abap ina
    }
    parseRequestAttributes(dataSource, data) {
      const dimensions = data.Cube.Dimensions;
      const filteredAttributes = [];
      for (let i = 0; i < dimensions.length; ++i) {
        const dimension = dimensions[i];
        if (dimension.Name.slice(0, 2) === "$$") {
          continue;
        }
        const attribute = dimension.Attributes[0];
        this.normalizeAttributeMetadata(attribute);
        filteredAttributes.push(attribute);
      }
      this.provider.fillInternalMetadata(dataSource, "metadataRequest", filteredAttributes);
    }
    parseResponseAttributes(dataSource, data) {
      const filteredAttributes = [];
      const attributes = data.Cube.Dimensions[0].Attributes;
      for (let i = 0; i < attributes.length; ++i) {
        const attribute = attributes[i];
        if (attribute.Name.slice(0, 2) === "$$") {
          continue;
        }
        this.normalizeAttributeMetadata(attribute);
        filteredAttributes.push(attribute);
      }
      this.provider.fillInternalMetadata(dataSource, "metadataRequest", filteredAttributes);
    }
    parseMetadataRequestMetadata(dataSource, data) {
      // parse metadata loaded via explicitely metadata request
      // (this metadata includes hasFulltextIndex information but not the display order information)

      // check whether buffer already filled
      const metadataLoadStatus = this.provider.getInternalMetadataLoadStatus(dataSource);
      if (metadataLoadStatus.metadataRequest) {
        return;
      }
      // parse attribute metadata
      this.parseRequestAttributes(dataSource, data);
      this.parseResponseAttributes(dataSource, data);
      // fill public metadata from internal metadata
      this.fillPublicMetadataBuffer(dataSource);
    }
    parseSearchRequestMetadata(itemData) {
      // parse metadata loaded implicitly by search request
      // (this metadata includes the display order information but not the hasFulltextIndex information)

      // get data source from data
      const dataSource = this.sina.getDataSource(itemData.$$DataSourceMetaData$$[0].ObjectName);
      // check whether buffer already filled
      const metadataLoadStatus = this.provider.getInternalMetadataLoadStatus(dataSource);
      if (metadataLoadStatus.searchRequest) {
        return;
      }
      // fill internal metadata buffer
      this.provider.fillInternalMetadata(dataSource, "searchRequest", itemData.$$AttributeMetadata$$);
      // fill public metadata from internal metadata
      this.fillPublicMetadataBuffer(dataSource);
      // calculate attribute display sequence from sequence in result item
      this.calculateAttributeDisplayOrder(dataSource, itemData);
    }
    fillPublicMetadataBuffer(dataSource) {
      // clear old public metadata
      dataSource.attributesMetadata = [];
      dataSource.attributeMetadataMap = {};
      // create new public metadata
      const attributesMetadata = this.provider.getInternalMetadataAttributes(dataSource);
      for (let i = 0; i < attributesMetadata.length; ++i) {
        const attributeMetadata = attributesMetadata[i];
        const attributeTypeAndFormat = this._parseAttributeTypeAndFormat(attributeMetadata);
        const publicAttributeMetadata = this.sina._createAttributeMetadata({
          type: attributeTypeAndFormat.type,
          format: attributeTypeAndFormat.format,
          id: attributeMetadata.Name,
          label: attributeMetadata.Description,
          isSortable: this._parseIsSortable(attributeMetadata),
          isKey: attributeMetadata.IsKey,
          matchingStrategy: this._parseMatchingStrategy(attributeMetadata),
          usage: this._parseUsage(attributeMetadata)
        });
        dataSource.attributesMetadata.push(publicAttributeMetadata);
        dataSource.attributeMetadataMap[attributeMetadata.Name] = publicAttributeMetadata;
      }
      dataSource._configure();
    }
    calculateAttributeDisplayOrder(dataSource, itemData) {
      let attributeId, attributeMetadata, i;
      const titleAttributes = [];
      const detailAttributesPrio1 = [];
      const detailAttributesPrio2 = [];
      const detailAttributes = [];

      // distribute attributes in lists according to presentationUsage
      for (let j = 0; j < itemData.$$ResultItemAttributes$$.length; ++j) {
        const attributeData = itemData.$$ResultItemAttributes$$[j];
        const attributeInternalMetadata = this.provider.getInternalMetadataAttribute(dataSource, attributeData.Name);
        if (attributeInternalMetadata.presentationUsage.indexOf("Title") >= 0 || attributeInternalMetadata.IsTitle) {
          titleAttributes.push(attributeData.Name);
        }
        if (attributeInternalMetadata.presentationUsage.indexOf("Summary") >= 0 || attributeInternalMetadata.presentationUsage.indexOf("Image") >= 0 || attributeInternalMetadata.presentationUsage.indexOf("Thumbnail") >= 0) {
          detailAttributesPrio1.push(attributeData.Name);
        } else if (attributeInternalMetadata.presentationUsage.indexOf("Detail") >= 0) {
          detailAttributesPrio2.push(attributeData.Name);
        }
      }

      // calculate title display order
      for (i = 0; i < titleAttributes.length; ++i) {
        attributeId = titleAttributes[i];
        attributeMetadata = dataSource.getAttributeMetadata(attributeId);
        attributeMetadata.usage.Title.displayOrder = i;
      }

      // calculate attribute area display order
      detailAttributes.push(...detailAttributesPrio1);
      detailAttributes.push(...detailAttributesPrio2);
      for (i = 0; i < detailAttributes.length; ++i) {
        attributeId = detailAttributes[i];
        attributeMetadata = dataSource.getAttributeMetadata(attributeId);
        attributeMetadata.usage.Detail.displayOrder = i;
      }
    }
    _parseIsSortable(attributeMetadata) {
      if (typeof attributeMetadata.IsSortable === "undefined") {
        return false;
      }
      return attributeMetadata.IsSortable;
    }
    _parseMatchingStrategy(attributeMetadata) {
      if (attributeMetadata.hasFulltextIndex) {
        return MatchingStrategy.Text;
      }
      return MatchingStrategy.Exact;
    }
    _parseUsage(attributeMetadata) {
      const usage = {};
      if (attributeMetadata.presentationUsage.indexOf("Title") >= 0 || attributeMetadata.IsTitle) {
        usage.Title = {
          displayOrder: 0
        };
      }
      if (attributeMetadata.presentationUsage.indexOf("Summary") >= 0 || attributeMetadata.presentationUsage.indexOf("Image") >= 0 || attributeMetadata.presentationUsage.indexOf("Thumbnail") >= 0 || attributeMetadata.presentationUsage.indexOf("Detail") >= 0) {
        usage.Detail = {
          displayOrder: 0
        };
      }
      if (attributeMetadata.accessUsage.indexOf("AutoFacet") >= 0) {
        usage.Facet = {
          displayOrder: 0
        };
      }
      if (attributeMetadata.accessUsage.indexOf("AdvancedSearch") >= 0) {
        usage.AdvancedSearch = {
          displayOrder: 0
        };
      }
      return usage;
    }
    _parseAttributeTypeAndFormat(attributeMetadata) {
      // 1. evaluate presentation usage
      for (let i = 0; i < attributeMetadata.presentationUsage.length; i++) {
        const presentationUsage = attributeMetadata.presentationUsage[i];
        switch (presentationUsage) {
          case "Summary":
            continue;
          case "Detail":
            continue;
          case "Title":
            continue;
          case "Hidden":
            continue;
          case "FactSheet":
            continue;
          case "Thumbnail":
          case "Image":
            return {
              type: AttributeType.ImageUrl
            };
          case "Text":
            return {
              type: AttributeType.String,
              format: AttributeFormatType.LongText
            };
          default:
            throw new UnknownPresentationUsageError(presentationUsage);
        }
      }

      // 2. evaluate data type
      switch (attributeMetadata.DataType) {
        case "Integer":
        case "Long":
          return {
            type: AttributeType.Integer
          };
        case "Double":
          return {
            type: AttributeType.Double
          };
        case "String":
          return {
            type: AttributeType.String
          };
        case "Date":
          return {
            type: AttributeType.Date
          };
        case "Time":
          return {
            type: AttributeType.Time
          };
        case "Timestamp":
          return {
            type: AttributeType.Timestamp
          };
        case "GeoJson":
          return {
            type: AttributeType.GeoJson
          };
        default:
          throw new UnknownDataTypeError(attributeMetadata.DataType);
      }
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.MetadataParser = MetadataParser;
  return __exports;
});
})();