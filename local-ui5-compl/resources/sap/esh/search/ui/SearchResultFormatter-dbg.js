/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["./SearchResultBaseFormatter", "./sinaNexTS/sina/SearchResultSetItemAttribute", "./sinaNexTS/sina/NavigationTarget"], function (__SearchResultBaseFormatter, ___sinaNexTS_sina_SearchResultSetItemAttribute, ___sinaNexTS_sina_NavigationTarget) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const SearchResultBaseFormatter = _interopRequireDefault(__SearchResultBaseFormatter);
  const SearchResultSetItemAttribute = ___sinaNexTS_sina_SearchResultSetItemAttribute["SearchResultSetItemAttribute"];
  const NavigationTarget = ___sinaNexTS_sina_NavigationTarget["NavigationTarget"];
  class SearchResultFormatter extends SearchResultBaseFormatter {
    constructor(model) {
      super(model);
      this.model = model;
    }
    format(searchResultSet, terms, options) {
      options = options || {};
      options.suppressHighlightedValues = options.suppressHighlightedValues || false;
      const sina = searchResultSet.sina;
      const layoutCache = {};
      const formattedResultItems = [];
      const resultItems = searchResultSet.items;
      for (let i = 0; i < resultItems.length; i++) {
        const resultItem = resultItems[i];
        const formattedResultItem = {};
        const aItemAttributes = [];
        for (let z = 0; z < resultItem.detailAttributes.length; z++) {
          const detailAttribute = resultItem.detailAttributes[z];
          let attributeValue = "";
          let format = "";
          let defaultNavigationTarget = undefined;
          if (detailAttribute instanceof SearchResultSetItemAttribute) {
            attributeValue = detailAttribute.value;
            format = detailAttribute.metadata.format;
            defaultNavigationTarget = detailAttribute.defaultNavigationTarget;
          }
          switch (detailAttribute.metadata.type) {
            case sina.AttributeType.ImageBlob:
              if (attributeValue && attributeValue.trim().length > 0) {
                attributeValue = "data:;base64," + attributeValue;
              }
              break;
            case sina.AttributeType.ImageUrl:
              formattedResultItem.imageUrl = attributeValue;
              formattedResultItem.imageFormat = format ? format.toLowerCase() : undefined;
              if (defaultNavigationTarget) {
                formattedResultItem.imageNavigation = defaultNavigationTarget;
              }
              break;
            case sina.AttributeType.GeoJson:
              formattedResultItem.geoJson = {
                value: attributeValue,
                label: /* resultItem.title || */detailAttribute.label // ToDo
              };
              break;
            case sina.AttributeType.Group:
              {
                const attributeGroupAsAttribute = this._formatAttributeGroup(detailAttribute, options);
                aItemAttributes.push(attributeGroupAsAttribute);
                break;
              }
            case sina.AttributeType.Double:
            case sina.AttributeType.Integer:
            case sina.AttributeType.String:
            case sina.AttributeType.Date:
            case sina.AttributeType.Time:
            case sina.AttributeType.Timestamp:
              {
                const oItemAttribute = this._formatSingleAttribute(detailAttribute, options);
                aItemAttributes.push(oItemAttribute);
                break;
              }
          }
          // }
        }
        formattedResultItem.key = resultItem.key; // ToDo, key, keystatus n.a.
        formattedResultItem.keystatus = resultItem.keystatus;
        formattedResultItem.dataSource = resultItem.dataSource;
        formattedResultItem.dataSourceName = resultItem.dataSource.label;
        formattedResultItem.attributesMap = resultItem.attributesMap;
        formattedResultItem.sinaItem = resultItem;
        const itemHierarchyNodePaths = resultItem.hierarchyNodePaths;
        if (Array.isArray(itemHierarchyNodePaths) === true && itemHierarchyNodePaths.length > 0) {
          // Take the first NodePath even in multiple case
          formattedResultItem.hierarchyNodePath = itemHierarchyNodePaths[0];
        }
        if (resultItem.titleAttributes) {
          let titleAttribute, formattedTitleAttribute, formattedTitle;
          const title = [];
          let isTitleHighlighted = false;
          for (let z = 0; z < resultItem.titleAttributes.length; z++) {
            titleAttribute = resultItem.titleAttributes[z];
            if (titleAttribute.metadata.type === sina.AttributeType.Group) {
              formattedTitleAttribute = this._formatAttributeGroup(titleAttribute, options);
              isTitleHighlighted = isTitleHighlighted || formattedTitleAttribute.whyfound;
            } else if (titleAttribute.metadata.type === sina.AttributeType.ImageUrl) {
              formattedTitleAttribute = this._formatSingleAttribute(titleAttribute, options);
              formattedResultItem.titleIconUrl = titleAttribute.value;
              formattedTitleAttribute.value = "";
              isTitleHighlighted = isTitleHighlighted || false;
            } else {
              formattedTitleAttribute = this._formatSingleAttribute(titleAttribute, options);
              isTitleHighlighted = isTitleHighlighted || formattedTitleAttribute.whyfound;
            }
            if (titleAttribute.infoIconUrl) {
              formattedResultItem.titleInfoIconUrl = titleAttribute.infoIconUrl;
              formattedTitleAttribute.value = "";
              isTitleHighlighted = isTitleHighlighted || false;
            }
            formattedTitle = formattedTitleAttribute.value;
            title.push(formattedTitle);
          }
          formattedResultItem.title = title.join(" ");
          formattedResultItem.isTitleHighlighted = isTitleHighlighted;
        } else {
          formattedResultItem.title = options.suppressHighlightedValues ? resultItem.title // ToDo
          : resultItem.titleHighlighted; // ToDo
          formattedResultItem.isTitleHighlighted = options.suppressHighlightedValues ? false // ToDo
          : true; // ToDo
        }
        if (resultItem.titleDescriptionAttributes && resultItem.titleDescriptionAttributes.length > 0) {
          let titleDescriptionAttribute, formattedTitleDescriptionAttribute, formattedTitleDescription;
          const titleDescription = [];
          const titleDescriptionLabel = [];
          let isTitleDescriptionHighlighted = false;
          for (let z = 0; z < resultItem.titleDescriptionAttributes.length; z++) {
            titleDescriptionAttribute = resultItem.titleDescriptionAttributes[z];
            if (titleDescriptionAttribute.metadata.type === sina.AttributeType.Group) {
              formattedTitleDescriptionAttribute = this._formatAttributeGroup(titleDescriptionAttribute, options);
              isTitleDescriptionHighlighted = isTitleDescriptionHighlighted || formattedTitleDescriptionAttribute.whyfound;
            } else {
              formattedTitleDescriptionAttribute = this._formatSingleAttribute(titleDescriptionAttribute, options);
              isTitleDescriptionHighlighted = isTitleDescriptionHighlighted || formattedTitleDescriptionAttribute.whyfound;
            }
            formattedTitleDescription = formattedTitleDescriptionAttribute.value;
            titleDescription.push(formattedTitleDescription);
            titleDescriptionLabel.push(formattedTitleDescriptionAttribute.name);
          }
          formattedResultItem.titleDescription = titleDescription.join(" ");
          formattedResultItem.titleDescriptionLabel = titleDescriptionLabel.join(" ");
          formattedResultItem.isTitleDescriptionHighlighted = isTitleDescriptionHighlighted;
        }
        formattedResultItem.itemattributes = aItemAttributes;
        if (resultItem.defaultNavigationTarget) {
          formattedResultItem.titleNavigation = resultItem.defaultNavigationTarget;
          if (!formattedResultItem.title || formattedResultItem.title.length === 0) {
            formattedResultItem.title = resultItem.defaultNavigationTarget.text;
          }
        }
        if (resultItem.navigationTargets && resultItem.navigationTargets.length > 0) {
          formattedResultItem.navigationObjects = [];
          for (let j = 0; j < resultItem.navigationTargets.length; j++) {
            const navTarget = resultItem.navigationTargets[j];
            formattedResultItem.navigationObjects.push(navTarget);
          }
        }
        const layoutCacheForItemType = layoutCache[resultItem.dataSource.id] || {};
        layoutCache[resultItem.dataSource.id] = layoutCacheForItemType;
        formattedResultItem.layoutCache = layoutCacheForItemType;
        formattedResultItem.customItemStyleClass = "";
        formattedResultItem.selected = false;
        formattedResultItem.selectionEnabled = true;
        formattedResultItem.expanded = false;
        const additionalParameters = {};
        this._formatResultForDocuments(resultItem, additionalParameters);
        this._formatResultForNotes(resultItem, additionalParameters);
        formattedResultItem.additionalParameters = additionalParameters;
        formattedResultItem.positionInList = i;
        formattedResultItem.resultSetId = searchResultSet.id;
        formattedResultItems.push(formattedResultItem);
      }
      return formattedResultItems;
    }
    _formatAttributeGroup(attributeGroup, options) {
      // workaround for attribute icons which have been set via @ObjectModel.text.element
      // TODO: clarify which attribute is the text to be shown and which contains the icon URL
      if (attributeGroup.attributes.length === 2 && typeof attributeGroup.attributes[1].attribute.value === "string" && attributeGroup.attributes[1].attribute.value.startsWith("sap-icon://")) {
        const formattedAttr = this._formatSingleAttribute(attributeGroup.attributes[0].attribute, options);
        formattedAttr.iconUrl = attributeGroup.attributes[1].attribute.value;
        formattedAttr.key = attributeGroup.id;
        formattedAttr.sinaAttribute = attributeGroup; // used for spread sheet export
        formattedAttr.isTitle = false; // used in table view
        formattedAttr.isSortable = attributeGroup.metadata.isSortable; // used in sort dialog
        formattedAttr.displayOrder = attributeGroup.metadata.usage.Detail && attributeGroup.metadata.usage.Detail.displayOrder;

        // if (isLongtext) {
        //     formattedAttr.longtext = attributeGroupAsAttribute.value;
        // }
        return formattedAttr;
      }
      const attributeGroupAsAttribute = {};
      const attributes = {};
      attributeGroupAsAttribute.name = attributeGroup.label;
      let isHighlighted = false;
      let isLongtext = false;
      const privateGroupMetadata = attributeGroup.metadata._private;
      let parentAttribute, childAttribute;
      for (let i = 0; i < attributeGroup.attributes.length; i++) {
        const attributeGroupMembership = attributeGroup.attributes[i];
        const _attribute = attributeGroupMembership.attribute;
        const attributeNameInGroup = attributeGroupMembership.metadata.nameInGroup;
        let _formattedAttribute;
        if (_attribute.metadata.type === _attribute.sina.AttributeType.Group) {
          _formattedAttribute = this._formatAttributeGroup(_attribute, options);
        } else {
          _formattedAttribute = this._formatSingleAttribute(_attribute, options);
        }
        if (privateGroupMetadata) {
          if (privateGroupMetadata.parentAttribute === _attribute.metadata) {
            parentAttribute = _formattedAttribute;
          } else if (privateGroupMetadata.childAttribute === _attribute.metadata) {
            childAttribute = _formattedAttribute;
          }
        }
        if (_formattedAttribute.value) {
          attributes[attributeNameInGroup] = _formattedAttribute;
          isHighlighted = isHighlighted || _formattedAttribute.whyfound;
          isLongtext = isLongtext || _formattedAttribute.longtext !== undefined;
        }
      }
      attributeGroupAsAttribute.value = "";
      attributeGroupAsAttribute.valueRaw = undefined;
      attributeGroupAsAttribute.valueWithoutWhyfound = "";
      attributeGroupAsAttribute.whyfound = false;
      if (Object.keys(attributes).length > 0) {
        let regularFormatting = true;
        if (privateGroupMetadata && parentAttribute && childAttribute && (privateGroupMetadata.isUnitOfMeasure || privateGroupMetadata.isCurrency || privateGroupMetadata.isDescription)) {
          let parentAttributeValue = parentAttribute.value;
          let childAttributeValue = childAttribute.value;
          if (typeof parentAttributeValue === "string" && parentAttributeValue.trim().length < 1) {
            parentAttributeValue = undefined;
          }
          if (typeof childAttributeValue === "string" && childAttributeValue.trim().length < 1) {
            childAttributeValue = undefined;
          }
          if (!(parentAttributeValue && childAttributeValue)) {
            if (privateGroupMetadata.isUnitOfMeasure || privateGroupMetadata.isCurrency) {
              if (parentAttributeValue && !childAttributeValue) {
                attributeGroupAsAttribute.value = parentAttribute.value;
                attributeGroupAsAttribute.valueRaw = parentAttribute.valueRaw;
                attributeGroupAsAttribute.valueWithoutWhyfound = parentAttribute.valueWithoutWhyfound;
                regularFormatting = false;
              }
            } else if (privateGroupMetadata.isDescription) {
              const textArrangement = privateGroupMetadata.textArrangement;
              const sina = attributeGroup.sina;
              if (textArrangement === sina.AttributeGroupTextArrangement.TextFirst) {
                if (!parentAttributeValue && childAttributeValue) {
                  attributeGroupAsAttribute.value = childAttribute.value;
                  attributeGroupAsAttribute.valueRaw = childAttribute.valueRaw;
                  attributeGroupAsAttribute.valueWithoutWhyfound = childAttribute.valueWithoutWhyfound;
                  regularFormatting = false;
                }
              } else if (textArrangement === sina.AttributeGroupTextArrangement.TextLast) {
                if (parentAttributeValue && !childAttributeValue) {
                  attributeGroupAsAttribute.value = parentAttribute.value;
                  attributeGroupAsAttribute.valueRaw = parentAttribute.valueRaw;
                  attributeGroupAsAttribute.valueWithoutWhyfound = parentAttribute.valueWithoutWhyfound;
                  regularFormatting = false;
                }
              } else if (textArrangement === sina.AttributeGroupTextArrangement.TextOnly) {
                if (!childAttributeValue) {
                  regularFormatting = false;
                }
              }
            }
          }
        }
        if (regularFormatting) {
          attributeGroupAsAttribute.value = this._formatBasedOnGroupTemplate(attributeGroup.template, attributes, "value");
          attributeGroupAsAttribute.valueRaw = this._formatBasedOnGroupTemplate(attributeGroup.template, attributes, "valueRaw");
          attributeGroupAsAttribute.valueWithoutWhyfound = this._formatBasedOnGroupTemplate(attributeGroup.template, attributes, "valueWithoutWhyfound");
        }
        attributeGroupAsAttribute.whyfound = isHighlighted;
      }
      attributeGroupAsAttribute.key = attributeGroup.id;
      attributeGroupAsAttribute.sinaAttribute = attributeGroup; // used for spread sheet export
      attributeGroupAsAttribute.isTitle = false; // used in table view
      attributeGroupAsAttribute.isSortable = attributeGroup.metadata.isSortable; // used in sort dialog
      attributeGroupAsAttribute.displayOrder = attributeGroup.metadata.usage.Detail && attributeGroup.metadata.usage.Detail.displayOrder;
      if (isLongtext) {
        attributeGroupAsAttribute.longtext = attributeGroupAsAttribute.value;
      }
      if (!(attributeGroupAsAttribute.defaultNavigationTarget instanceof NavigationTarget)) {
        if (parentAttribute?.defaultNavigationTarget instanceof NavigationTarget) {
          attributeGroupAsAttribute.defaultNavigationTarget = parentAttribute.defaultNavigationTarget;
        } else if (childAttribute?.defaultNavigationTarget instanceof NavigationTarget) {
          attributeGroupAsAttribute.defaultNavigationTarget = childAttribute.defaultNavigationTarget;
        }
      }
      if (parentAttribute?.tooltip) {
        attributeGroupAsAttribute.tooltip = parentAttribute.tooltip;
      } else if (childAttribute?.tooltip) {
        attributeGroupAsAttribute.tooltip = childAttribute.tooltip;
      }
      if (!attributeGroupAsAttribute.iconUrl) {
        if (parentAttribute?.iconUrl) {
          attributeGroupAsAttribute.iconUrl = parentAttribute.iconUrl;
        } else if (childAttribute?.iconUrl) {
          attributeGroupAsAttribute.iconUrl = childAttribute.iconUrl;
        }
      }
      return attributeGroupAsAttribute;
    }
    _formatSingleAttribute(detailAttribute, options) {
      const oItemAttribute = {};
      const sina = detailAttribute.sina;
      oItemAttribute.name = detailAttribute.label;
      oItemAttribute.valueRaw = detailAttribute.value;
      oItemAttribute.value = options.suppressHighlightedValues ? detailAttribute.valueFormatted : detailAttribute.valueHighlighted;
      oItemAttribute.valueWithoutWhyfound = detailAttribute.valueFormatted; //result[propDisplay].valueWithoutWhyfound;

      // if (detailAttribute.isHighlighted && detailAttribute.metadata.type.toLowerCase() === "longtext") {
      //     // mix snippet into longtext values
      //     var valueHighlighted = detailAttribute.valueHighlighted;
      //     valueHighlighted = valueHighlighted.replace(/(^[.][.][.])|([.][.][.]$)/, "").trim();
      //     var valueUnHighlighted = valueHighlighted.replace(/[<]([/])?b[>]/g, "");
      //     oItemAttribute.value = detailAttribute.valueFormatted.replace(valueUnHighlighted, valueHighlighted);
      // }

      oItemAttribute.key = detailAttribute.id;
      oItemAttribute.sinaAttribute = detailAttribute; // used for spread sheet export
      oItemAttribute.isTitle = false; // used in table view
      oItemAttribute.isSortable = detailAttribute.metadata.isSortable; // used in sort dialog
      oItemAttribute.displayOrder = detailAttribute.metadata.usage.Detail && detailAttribute.metadata.usage.Detail.displayOrder;
      oItemAttribute.whyfound = detailAttribute.isHighlighted;
      if (detailAttribute.defaultNavigationTarget instanceof NavigationTarget) {
        oItemAttribute.defaultNavigationTarget = detailAttribute.defaultNavigationTarget;
      }
      if (typeof detailAttribute.tooltip === "string" && detailAttribute.tooltip.length > 0) {
        oItemAttribute.tooltip = detailAttribute.tooltip;
      }
      if (typeof detailAttribute.iconUrl === "string" && detailAttribute.iconUrl.length > 0 && detailAttribute.iconUrl.startsWith("sap-icon://")) {
        oItemAttribute.iconUrl = detailAttribute.iconUrl;
      }
      if (detailAttribute.metadata.format && (detailAttribute.metadata.format === sina.AttributeFormatType.MultilineText || detailAttribute.metadata.format === sina.AttributeFormatType.LongText)) {
        oItemAttribute.longtext = detailAttribute.valueHighlighted;
      }
      return oItemAttribute;
    }
    _formatBasedOnGroupTemplate(template, attributes, valuePropertyName) {
      if (!(template && attributes && valuePropertyName)) {
        return "";
      }
      const regex = /{\w+}/gi;
      let value = "";
      let pos = 0;
      let match;
      while ((match = regex.exec(template)) !== null) {
        value += template.substring(pos, match.index);
        const attributeName = match[0].slice(1, -1);
        value += attributes[attributeName] && attributes[attributeName][valuePropertyName] || "";
        pos = regex.lastIndex;
      }
      value += template.substring(pos);
      return value;
    }
    _formatResultForDocuments(resultItem, additionalParameters) {
      let keyFields = "";
      additionalParameters.isDocumentConnector = false;
      let detailAttribute;
      for (let j = 0; j < resultItem.detailAttributes.length; j++) {
        detailAttribute = resultItem.detailAttributes[j];
        if (detailAttribute.metadata.id === "FILE_PROPERTY") {
          additionalParameters.isDocumentConnector = true;
        }
        if (detailAttribute.metadata.isKey === true) {
          if (keyFields.length > 0) {
            keyFields += ";";
          }
          keyFields = keyFields + detailAttribute.metadata.id + "=" + detailAttribute.value; // encodeURIComponent(result[prop].valueRaw);
        }
      }

      // fileloader
      if (additionalParameters.isDocumentConnector === true) {
        const sidClient = ";o=sid(" + resultItem.dataSource.system + "." + resultItem.dataSource.client + ")";
        const connectorName = resultItem.dataSource.id;
        additionalParameters.imageUrl = "/sap/opu/odata/SAP/ESH_SEARCH_SRV" + sidClient + "/FileLoaderFiles(ConnectorId='" + connectorName + "',FileType='ThumbNail',SelectionParameters='" + keyFields + "')/$value";
        additionalParameters.titleUrl = "/sap/opu/odata/SAP/ESH_SEARCH_SRV" + sidClient + "/FileLoaderFiles(ConnectorId='" + connectorName + "',FileType='BinaryContent',SelectionParameters='" + keyFields + "')/$value";
        const suvlink = "/sap/opu/odata/SAP/ESH_SEARCH_SRV" + sidClient + "/FileLoaderFiles(ConnectorId='" + connectorName + "',FileType='SUVFile',SelectionParameters='" + keyFields + "')/$value";
        additionalParameters.suvlink = "/sap/bc/ui5_ui5/ui2/ushell/resources/sap/fileviewer/viewer/web/viewer.html?file=" + encodeURIComponent(suvlink);
        if (!resultItem.navigationObjects) {
          resultItem.navigationObjects = [];
        }
        const navOptions = {
          text: "Show Document",
          targetUrl: additionalParameters.suvlink,
          target: "_blank"
        };
        const navigationTarget = this.model.sinaNext.createNavigationTarget(navOptions);
        resultItem.navigationObjects.push(navigationTarget);
        for (let j = 0; j < resultItem.detailAttributes.length; j++) {
          detailAttribute = resultItem.detailAttributes[j];
          if (detailAttribute.id === "PHIO_ID_THUMBNAIL" && detailAttribute.value) {
            additionalParameters.containsThumbnail = true;
          }
          if (detailAttribute.id === "PHIO_ID_SUV" && detailAttribute.value) {
            additionalParameters.containsSuvFile = true;
          }
        }
      }
    }
    _formatResultForNotes(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    resultItem,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    additionalParameters) {
      //
    }
  }
  return SearchResultFormatter;
});
})();