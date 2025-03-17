/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../../sina/SinaObject", "../../core/util", "./typeConverter", "../../sina/AttributeType", "../tools/WhyfoundProcessor"], function (____sina_SinaObject, util, typeConverter, ____sina_AttributeType, ___tools_WhyfoundProcessor) {
  "use strict";

  const SinaObject = ____sina_SinaObject["SinaObject"];
  const AttributeType = ____sina_AttributeType["AttributeType"];
  const WhyfoundProcessor = ___tools_WhyfoundProcessor["WhyfoundProcessor"]; // import { ObjectSuggestion } from "../../sina/ObjectSuggestion";
  class ItemParser extends SinaObject {
    provider;
    suvNavTargetResolver;
    constructor(provider) {
      super();
      this.provider = provider;
      this.sina = provider.sina;
      this.suvNavTargetResolver = this.sina._createSuvNavTargetResolver();
    }
    parse(searchQuery, data) {
      if (data.ResultList.SearchResults === null) {
        return Promise.resolve([]);
      }
      const itemsData = data.ResultList.SearchResults.results;
      return this.parseItems(itemsData);
    }
    parseItems(itemsData) {
      const itemProms = [];
      for (let i = 0; i < itemsData.length; ++i) {
        const itemData = itemsData[i];
        const itemProm = this.parseItem(itemData);
        itemProms.push(itemProm);
      }
      return Promise.all(itemProms);
    }
    async parseItem(itemData) {
      let j;
      const allAttributes = {}; // all server attributes (response attributes, hit attributes, ...)
      const titleAttributes = [];
      const titleDescriptionAttributes = [];
      const attributes = [];
      const detailAttributes = [];
      const semanticObjectTypeAttributes = [];
      let fallbackDefaultNavigationTarget;
      const dataSource = this.sina.getDataSource(itemData.DataSourceId);
      let attributeData, metadata, attribute, semanticObjectType;
      const score = Number(itemData.Score) / 100;
      const suvHighlightTerms = [];
      let suvAttribute, suvAttributeName, suvUrlAttribute, suvMimeTypeAttribute;
      const suvAttributes = {};
      let whyFounds = {};
      const whyFoundProcessor = new WhyfoundProcessor(this.sina);
      for (j = 0; j < itemData.Attributes.results.length; j++) {
        attributeData = itemData.Attributes.results[j];
        metadata = dataSource.getAttributeMetadata(attributeData.Id);
        attribute = this.sina._createSearchResultSetItemAttribute({
          id: attributeData.Id,
          label: metadata.label,
          value: typeConverter.odata2Sina(metadata.type, attributeData.Value),
          valueFormatted: metadata.type === AttributeType.Timestamp ? undefined : attributeData.ValueFormatted,
          // Problem: Backend is not able to format timestamp value according to browser time zone.
          // Solution: ignore server timestamp valueFomatted and format raw value in ResultValueFormatter
          valueHighlighted: attributeData.Snippet,
          isHighlighted: attributeData.Snippet.indexOf("<b>") > -1 && attributeData.Snippet.indexOf("</b>") > -1,
          metadata: metadata,
          groups: []
        });

        // envalue valueFormatted in ResultValueFormatter.js
        //attribute.valueFormatted = attributeData.ValueFormatted;
        //attribute.valueHighlighted = attributeData.Snippet || attributeData.ValueFormatted;

        allAttributes[attribute.id] = attribute;

        // collect highlight terms needed for creation of suv viewer link
        util.appendRemovingDuplicates(suvHighlightTerms, util.extractHighlightedTerms(attribute.valueHighlighted));
        if (metadata.suvUrlAttribute && metadata.suvMimeTypeAttribute) {
          suvUrlAttribute = allAttributes[metadata.suvUrlAttribute] || metadata.suvUrlAttribute.id;
          suvMimeTypeAttribute = allAttributes[metadata.suvMimeTypeAttribute] || metadata.suvMimeTypeAttribute.id;
          suvAttributes[attributeData.Id] = {
            suvThumbnailAttribute: attribute,
            suvTargetUrlAttribute: suvUrlAttribute,
            suvTargetMimeTypeAttribute: suvMimeTypeAttribute
          };
        }
        if (metadata.usage.Navigation) {
          if (metadata.usage.Navigation.mainNavigation) {
            fallbackDefaultNavigationTarget = this.sina.createNavigationTarget({
              text: attribute.value,
              targetUrl: attribute.value,
              target: "_blank"
            });
          }
        }
        attributes.push(attribute);
        if (metadata.usage.Detail) {
          detailAttributes.push(attribute);
        }
        if (metadata.usage.Title) {
          titleAttributes.push(attribute);
        }
        if (metadata.usage.TitleDescription) {
          titleDescriptionAttributes.push(attribute);
        }
        semanticObjectType = dataSource.attributeMetadataMap[attribute.id]._private.semanticObjectType;
        if (semanticObjectType && semanticObjectType.length > 0) {
          semanticObjectTypeAttributes.push({
            name: semanticObjectType,
            value: attribute.value,
            type: attribute.metadata.type
          });
        }

        // push response attributes (highlighted and not visible) to whyFounds
        if (attribute.isHighlighted || attribute.descriptionAttribute && attribute.descriptionAttribute.isHighlighted) {
          if (!this._isVisible(metadata) && typeof whyFounds[attribute.id] === "undefined") {
            // this._isVisible means:
            // attribute is used as title or title description or detail, or
            // attribute is in Template of ancestor group attribute, that is used as title or title description or detail
            whyFounds[attribute.id] = [attribute.valueHighlighted];
          }
        }
      }
      for (suvAttributeName in suvAttributes) {
        suvAttribute = suvAttributes[suvAttributeName];
        if (typeof suvAttribute.suvTargetUrlAttribute === "string") {
          suvAttribute.suvTargetUrlAttribute = allAttributes[suvAttribute.suvTargetUrlAttribute];
        }
        if (typeof suvAttribute.suvTargetMimeTypeAttribute === "string") {
          suvAttribute.suvTargetMimeTypeAttribute = allAttributes[suvAttribute.suvTargetMimeTypeAttribute];
        }
        if (!(suvAttribute.suvTargetUrlAttribute || suvAttribute.suvTargetMimeTypeAttribute)) {
          delete suvAttributes[suvAttributeName];
        }
      }

      // sort attributes
      titleAttributes.sort(function (a1, a2) {
        return a1.metadata.usage.Title.displayOrder - a2.metadata.usage.Title.displayOrder;
      });
      detailAttributes.sort(function (a1, a2) {
        return a1.metadata.usage.Detail.displayOrder - a2.metadata.usage.Detail.displayOrder;
      });
      this.suvNavTargetResolver.resolveSuvNavTargets(dataSource, suvAttributes, suvHighlightTerms);
      const searchResultSetItem = this.sina._createSearchResultSetItem({
        dataSource: dataSource,
        attributes: attributes,
        titleAttributes: titleAttributes,
        titleDescriptionAttributes: titleDescriptionAttributes,
        detailAttributes: detailAttributes,
        defaultNavigationTarget: fallbackDefaultNavigationTarget,
        navigationTargets: [],
        score: score
      });
      searchResultSetItem._private.allAttributesMap = allAttributes;
      searchResultSetItem._private.semanticObjectTypeAttributes = semanticObjectTypeAttributes;
      const itemPostParser = this.sina._createItemPostParser({
        searchResultSetItem: searchResultSetItem
      });
      const ungrouppedDetailAttributes = searchResultSetItem.detailAttributes;
      const postResultSetItem = await itemPostParser.postParseResultSetItem();
      whyFounds = this._pushAdditionalWhyFounds(itemData, whyFounds, ungrouppedDetailAttributes); // push request attributes (highlighted and not visible) to whyFounds
      return await whyFoundProcessor.processAdditionalWhyfoundAttributes(whyFounds, postResultSetItem);
    }

    // check single attribute is visible (stand-alone or in group attribute)
    _isVisible(metadata) {
      if (typeof metadata.usage.Title !== "undefined" || typeof metadata.usage.Detail !== "undefined" || typeof metadata.isDescription !== "undefined") {
        return true;
      }
      if (Array.isArray(metadata.groups)) {
        // const isVisible = false;
        for (let i = 0; i < metadata.groups.length; i++) {
          const group = metadata.groups[i].group;
          if (this._isVisible(group) && this._isInTamplate(metadata.id, group)) {
            return true;
          }
        }
        return false;
      }
      return false;
    }

    // check child attribute in template of group attribute
    _isInTamplate(id, group) {
      if (group.template && group.attributes && group.attributes.length > 0) {
        const nameInTemplate = this._getNameInGroup(id, group.attributes);
        if (nameInTemplate && group.template.includes("{" + nameInTemplate + "}")) {
          return true;
        }
      }
      return false;
    }

    // get child attribute's alias name used in template of group attribute
    // eslint-disable-next-line
    _getNameInGroup(id, attributesInGroup) {
      for (let i = 0; i < attributesInGroup.length; i++) {
        if (attributesInGroup[i].attribute.id === id) {
          return attributesInGroup[i].nameInGroup;
        }
      }
      return undefined;
    }

    // push highlighted request attribute
    // eslint-disable-next-line
    _pushAdditionalWhyFounds(itemData, whyFounds, ungrouppedDetailAttributes) {
      if (itemData.HitAttributes && Array.isArray(itemData.HitAttributes.results)) {
        for (let i = 0; i < itemData.HitAttributes.results.length; i++) {
          const attributeData = itemData.HitAttributes.results[i];
          if (typeof whyFounds[attributeData.Id] === "undefined" && !this._isUngrouppedDetailAttribute(attributeData.Id, ungrouppedDetailAttributes)) {
            // avoid duplicated whyfounds:
            // attribute is a response attribute + highlighted + visible
            // and it is a request attribute + highlighted (hitAttribute)
            whyFounds[attributeData.Id] = [attributeData.Snippet];
          }
        }
      }
      return whyFounds;
    }

    // check attribute (hitAttribue) has been already in ungroupped detail attribute set
    // eslint-disable-next-line
    _isUngrouppedDetailAttribute(id, ungrouppedDetailAttributes) {
      for (let k = 0; k < ungrouppedDetailAttributes.length; k++) {
        if (id === ungrouppedDetailAttributes[k].id) {
          return true;
        }
      }
      return false;
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.ItemParser = ItemParser;
  return __exports;
});
})();