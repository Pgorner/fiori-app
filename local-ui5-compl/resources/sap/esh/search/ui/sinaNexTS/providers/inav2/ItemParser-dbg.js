/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../../core/util", "./typeConverter", "./pivotTableParser", "../../core/errors"], function (util, typeConverter, pivotTableParser, ____core_errors) {
  "use strict";

  const WhyFoundAttributeMetadataMissingError = ____core_errors["WhyFoundAttributeMetadataMissingError"];
  class ItemParser {
    provider;
    sina;
    intentsResolver;
    constructor(provider) {
      this.provider = provider;
      this.sina = provider.sina;
      this.intentsResolver = this.sina._createFioriIntentsResolver();
    }
    parse(searchQuery, data) {
      const totalCount = this.parseTotalCount(data);
      data = pivotTableParser.parse(data);
      if (data.axes.length === 0) {
        return Promise.resolve({
          totalCount: 0,
          items: []
        });
      }
      const itemsData = data.axes[0];
      const itemProms = [];
      for (let i = 0; i < itemsData.length; ++i) {
        const itemData = itemsData[i];
        this.provider.metadataParser.parseSearchRequestMetadata(itemData);
        const itemProm = this.parseItem(itemData);
        itemProms.push(itemProm);
      }
      return Promise.all(itemProms).then(function (items) {
        return {
          totalCount: totalCount,
          items: items
        };
      });
    }
    parseTotalCount(data) {
      if (data.ItemLists && data.ItemLists[0] && data.ItemLists[0].TotalCount) {
        return data.ItemLists[0].TotalCount.Value;
      }
      return 0;
    }
    parseItem(itemData) {
      const titleAttributes = [];
      const detailAttributes = [];
      const semanticObjectTypeAttributes = [];
      const dataSource = this.sina.getDataSource(itemData.$$DataSourceMetaData$$[0].ObjectName);
      for (let m = 0; m < itemData.$$ResultItemAttributes$$.length; ++m) {
        const attributeData = itemData.$$ResultItemAttributes$$[m];
        const metadata = dataSource.getAttributeMetadata(attributeData.Name);
        const attribute = this.sina._createSearchResultSetItemAttribute({
          id: attributeData.Name,
          label: dataSource.getAttributeMetadata(attributeData.Name).label,
          value: typeConverter.ina2Sina(metadata.type, attributeData.Value),
          valueFormatted: attributeData.ValueFormatted || attributeData.Value,
          valueHighlighted: attributeData.ValueFormatted || attributeData.Value,
          isHighlighted: false,
          metadata: metadata
        });
        if (metadata.usage.Title) {
          titleAttributes.push(attribute);
        }
        if (metadata.usage.Detail) {
          detailAttributes.push(attribute);
        }

        // TO DO maybe get metadata out of metadata buffer?
        for (let i = 0; i < itemData.$$AttributeMetadata$$.length; i++) {
          const attributeMetadata = itemData.$$AttributeMetadata$$[i];
          if (attributeMetadata.Name == attributeData.Name) {
            if (attributeMetadata.SemanticObjectType && attributeMetadata.SemanticObjectType.length > 0) {
              semanticObjectTypeAttributes.push({
                name: attributeMetadata.SemanticObjectType,
                value: attribute.value,
                type: attribute.metadata.type
              });
            }
            break;
          }
        }
      }
      titleAttributes.sort(function (a1, a2) {
        return a1.metadata.usage.Title.displayOrder - a2.metadata.usage.Title.displayOrder;
      });
      detailAttributes.sort(function (a1, a2) {
        return a1.metadata.usage.Detail.displayOrder - a2.metadata.usage.Detail.displayOrder;
      });
      this.parseWhyFound(dataSource, titleAttributes, detailAttributes, itemData);
      let fallbackDefaultNavigationTarget;
      for (let k = 0; k < itemData.$$RelatedActions$$.length; ++k) {
        const relatedAction = itemData.$$RelatedActions$$[k];
        if (relatedAction.Type === "GeneralUri" || relatedAction.Type === "SAPNavigation") {
          const label = relatedAction.Description;
          const targetUrl = encodeURI(relatedAction.Uri);
          fallbackDefaultNavigationTarget = this.sina.createNavigationTarget({
            text: label,
            targetUrl: targetUrl
          });
        }
      }
      const semanticObjectType = itemData.$$DataSourceMetaData$$[0].SemanticObjectType;
      const systemId = itemData.$$DataSourceMetaData$$[0].SystemId;
      const client = itemData.$$DataSourceMetaData$$[0].Client;
      return this.intentsResolver.resolveIntents({
        semanticObjectType: semanticObjectType,
        semanticObjectTypeAttributes: semanticObjectTypeAttributes,
        systemId: systemId,
        client: client,
        fallbackDefaultNavigationTarget: fallbackDefaultNavigationTarget
      }).then(function (intents) {
        const defaultNavigationTarget = intents && intents.defaultNavigationTarget;
        const navigationTargets = intents && intents.navigationTargets;
        const item = this.sina._createSearchResultSetItem({
          dataSource: dataSource,
          titleAttributes: titleAttributes,
          titleDescriptionAttributes: [],
          detailAttributes: detailAttributes,
          defaultNavigationTarget: defaultNavigationTarget,
          navigationTargets: navigationTargets
        });
        return item;
      }.bind(this));
    }
    parseWhyFound(dataSource, titleAttributes, detailAttributes, itemData) {
      // 1. move why found to title and detail attributes
      let i, whyFound, whyFoundAttributeId, j, attribute;
      for (i = 0; i < itemData.$$WhyFound$$.length; i++) {
        whyFound = itemData.$$WhyFound$$[i];
        whyFoundAttributeId = this.getResponseAttributeId(dataSource, whyFound.Name);
        for (j = 0; j < titleAttributes.length; ++j) {
          attribute = titleAttributes[j];
          if (whyFoundAttributeId === attribute.id) {
            whyFound.matched = true;
            attribute.valueHighlighted = whyFound.Value;
            attribute.isHighlighted = true;
            break;
          }
        }
        for (j = 0; j < detailAttributes.length; ++j) {
          attribute = detailAttributes[j];
          if (whyFoundAttributeId === attribute.id) {
            whyFound.matched = true;
            attribute.valueHighlighted = whyFound.Value;
            attribute.isHighlighted = true;
            break;
          }
        }
      }

      // 2. for why founds without title or detail attribute: create artifical attribute and append to detail attributes
      for (i = 0; i < itemData.$$WhyFound$$.length; i++) {
        whyFound = itemData.$$WhyFound$$[i];
        if (whyFound.matched) {
          continue;
        }
        whyFoundAttributeId = this.getResponseAttributeId(dataSource, whyFound.Name);
        const metadata = dataSource.getAttributeMetadata(whyFoundAttributeId);
        if (!metadata) {
          throw new WhyFoundAttributeMetadataMissingError(whyFoundAttributeId);
        }
        attribute = this.sina._createSearchResultSetItemAttribute({
          id: metadata.id,
          label: metadata.label,
          value: null,
          valueFormatted: util.filterString(whyFound.Value, ["<b>", "</b>"]),
          valueHighlighted: whyFound.Value,
          isHighlighted: true,
          metadata: metadata
        });
        detailAttributes.push(attribute);
      }
    }
    getResponseAttributeId(dataSource, requestAttributeId) {
      const requestAttributeMetadata = this.provider.getInternalMetadataAttribute(dataSource, requestAttributeId);
      if (!requestAttributeMetadata) {
        return requestAttributeId;
      }
      const responseAttributeMetadata = this.provider.getInternalMetadataAttribute(dataSource, requestAttributeMetadata.correspondingSearchAttributeName);
      if (!responseAttributeMetadata) {
        return requestAttributeId;
      }
      return responseAttributeMetadata.Name;
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.ItemParser = ItemParser;
  return __exports;
});
})();