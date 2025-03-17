/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../../../sina/SinaObject", "../../../sina/AttributeGroupTextArrangement", "../../../sina/AttributeType", "../../../sina/AttributeFormatType", "../../../sina/AttributeSemanticsType", "../../../core/Log"], function (_____sina_SinaObject, _____sina_AttributeGroupTextArrangement, _____sina_AttributeType, _____sina_AttributeFormatType, _____sina_AttributeSemanticsType, _____core_Log) {
  "use strict";

  const SinaObject = _____sina_SinaObject["SinaObject"];
  const AttributeGroupTextArrangement = _____sina_AttributeGroupTextArrangement["AttributeGroupTextArrangement"];
  const AttributeType = _____sina_AttributeType["AttributeType"];
  const AttributeFormatType = _____sina_AttributeFormatType["AttributeFormatType"];
  const AttributeSemanticsType = _____sina_AttributeSemanticsType["AttributeSemanticsType"];
  const Log = _____core_Log["Log"];
  class CDSAnnotationsParser extends SinaObject {
    _datasource;
    _cdsAnnotations;
    _parsedAttributes;
    _knownAttributeGroups;
    _knownAttributeGroupsArray;
    _attributeGroupReplacements;
    _AttributeUsagePrio;
    _detailUsageStubsMap;
    _detailUsageStubsPrioHigh;
    _detailUsageStubsPrioMedium;
    _detailUsageStubsPrioNone;
    _defaultTextArrangement;
    _parsingResult;
    log = (() => new Log("hana odata cds annotations parser"))();
    constructor(properties) {
      super(properties);
      this._datasource = properties.dataSource;
      this._cdsAnnotations = properties.cdsAnnotations;
      this._parsedAttributes = {};
      this._knownAttributeGroups = {};
      this._knownAttributeGroupsArray = [];
      this._attributeGroupReplacements = {};
      this._AttributeUsagePrio = {
        HIGH: "HIGH",
        MEDIUM: "MEDIUM",
        NONE: "NONE"
      };

      /*
              Example Usage Stub:
              var usage = {
                  attribute: <some attribute or attribute group object>,
                  displayOrder: <integer vaue>,
                  prio: <Enumeration this._AttributeUsagePrio>,
                  obsolete: <boolean>
              }
           */
      this._detailUsageStubsMap = {};
      this._detailUsageStubsPrioHigh = [];
      this._detailUsageStubsPrioMedium = [];
      this._detailUsageStubsPrioNone = [];
      this._defaultTextArrangement = AttributeGroupTextArrangement.TextLast;
    }

    /////////////////////////////////
    // Main Parse Function
    ///
    parseCDSAnnotationsForDataSource() {
      this._parsingResult = {
        dataSourceIsCdsBased: false,
        detailAttributesAreSorted: false,
        titleAttributesAreSorted: false
      };

      // CDS Annotations Object looks like:
      // cdsAnnotations = {
      //     dataSourceAnnotations: {}, // JSON object representing the structure of CDS annotations
      //     attributeAnnotations: {} // Key-Value-Map (keys: attribute names) of JSON objects representing the structure of CDS annotations per attribute
      // };

      this._parseDefaultTextArrangement();
      this._parseAttributeAnnotations();
      this._parseDataSourceAnnotations();
      return this._parsingResult;
    }

    //////////////////////////////////////////////////////////
    // Setters and Getters for internal Variables
    //////////////////////////////////////////////////////////

    _addDetailUsageStub(attribute, displayOrder, prio) {
      let attributeId;
      if (typeof attribute === "string") {
        attributeId = attribute;
        attribute = undefined;
      } else {
        attributeId = attribute.id;
      }
      const usageStub = {
        attribute: attribute,
        displayOrder: displayOrder,
        prio: prio,
        obsolete: false
      };
      this._detailUsageStubsMap[attributeId] = usageStub;
      if (prio === this._AttributeUsagePrio.HIGH) {
        this._detailUsageStubsPrioHigh.push(usageStub);
      } else if (prio === this._AttributeUsagePrio.MEDIUM) {
        this._detailUsageStubsPrioMedium.push(usageStub);
      } else {
        this._detailUsageStubsPrioNone.push(usageStub);
      }
    }
    _getDetailUsageStub(attribute) {
      if (!attribute) {
        return undefined;
      }
      let attributeId;
      if (typeof attribute === "string") {
        attributeId = attribute;
      } else {
        attributeId = attribute.id;
      }
      return this._detailUsageStubsMap[attributeId];
    }
    _setParsedAttribute(attributeName, attribute) {
      this._parsedAttributes[attributeName.toUpperCase()] = attribute;
    }
    _getParsedAttribute(attributeName) {
      return this._parsedAttributes[attributeName.toUpperCase()];
    }
    _setknownAttributeGroup(qualifier, attributeGroup) {
      this._knownAttributeGroups[qualifier.toUpperCase()] = attributeGroup;
    }
    _getknownAttributeGroup(qualifier) {
      return this._knownAttributeGroups[qualifier.toUpperCase()];
    }

    ////////////////////////////////////////////////////
    // Set default Text Arrangement for Descriptions
    ///
    _parseDefaultTextArrangement() {
      try {
        const defaultTextArrangement = this._deriveTextArrangementFromCdsAnnotation(this._cdsAnnotations.dataSourceAnnotations.UI && this._cdsAnnotations.dataSourceAnnotations.UI.TEXTARRANGEMENT);
        this._defaultTextArrangement = defaultTextArrangement || this._defaultTextArrangement;
      } catch (e) {
        this.log.warn("Could not parse default text arrangement for datasource: " + e);
      }
    }

    //////////////////////////////////////////////////////////////////////
    // Parse Data Source Annotations
    //////////////////////////////////////////////////////////////////////

    _parseDataSourceAnnotations() {
      if (Object.keys(this._cdsAnnotations.dataSourceAnnotations).length > 0) {
        try {
          const ui = this._cdsAnnotations.dataSourceAnnotations.UI;
          const headerInfo = ui && ui.HEADERINFO;
          const title = headerInfo && headerInfo.TITLE;
          let type, groupQualifier, attributeGroup;
          if (title) {
            type = title.TYPE && title.TYPE.toUpperCase();
            if (type === "AS_CONNECTED_FIELDS") {
              groupQualifier = title.VALUEQUALIFIER;
              if (groupQualifier && groupQualifier.trim().length > 0) {
                attributeGroup = this._getknownAttributeGroup(groupQualifier);
                if (attributeGroup) {
                  //&& attributeGroup === titleAttribute.group) {
                  attributeGroup.usage.Title = {
                    displayOrder: 1
                  };
                }
              }
            } else if (!type) {
              const titleAttributeName = title.VALUE;
              if (titleAttributeName) {
                const titleAttribute = this._getParsedAttribute(titleAttributeName);
                if (titleAttribute) {
                  titleAttribute.usage.Title = {
                    displayOrder: 1
                  };
                }
              }
            }
            const urlAttributeName = title.URL;
            if (urlAttributeName) {
              const urlAttribute = this._getParsedAttribute(urlAttributeName);
              if (urlAttribute) {
                urlAttribute.usage.Navigation = {
                  mainNavigation: true
                };
              }
            }
          }
          const description = headerInfo && headerInfo.DESCRIPTION;
          if (description) {
            type = description.TYPE;
            if (type === "AS_CONNECTED_FIELDS") {
              groupQualifier = description.VALUEQUALIFIER;
              if (groupQualifier && groupQualifier.trim().length > 0) {
                attributeGroup = this._getknownAttributeGroup(groupQualifier);
                if (attributeGroup) {
                  //&& attributeGroup === titleAttribute.group) {
                  attributeGroup.usage.TitleDescription = {
                    displayOrder: 1
                  };
                }
              }
            } else if (!type) {
              const titleDescriptionAttributeName = description.VALUE;
              if (titleDescriptionAttributeName) {
                const titleDescriptionAttribute = this._getParsedAttribute(titleDescriptionAttributeName);
                if (titleDescriptionAttribute) {
                  titleDescriptionAttribute.usage.TitleDescription = {};
                }
              }
            }
          }
          const titleIconAttributeName = headerInfo && headerInfo.IMAGEURL;
          if (titleIconAttributeName) {
            const titleIconAttribute = this._getParsedAttribute(titleIconAttributeName);
            if (titleIconAttribute) {
              titleIconAttribute.usage.Title = {};
              titleIconAttribute.type = this.sina.AttributeType.ImageUrl;
            }
          }
        } catch (e) {
          this.log.warn("Could not parse attribute for datasource: " + e);
        }
      }
    }

    //////////////////////////////////////////////////////////////////////
    // Parse Attribute Annotations
    //////////////////////////////////////////////////////////////////////

    _parseAttributeAnnotations() {
      for (const attributeId in this._datasource.attributeMetadataMap) {
        this._parseSingleAttribute(attributeId);
      }
      this._datasource.attributesMetadata = this._datasource.attributesMetadata.concat(this._knownAttributeGroupsArray);
      this._datasource.attributeMetadataMap = Object.assign(this._datasource.attributeMetadataMap, this._knownAttributeGroups);
      this._sortAttributes();
    }
    _parseSingleAttribute(attributeId) {
      let parsedAttribute = this._getParsedAttribute(attributeId);
      if (!parsedAttribute) {
        parsedAttribute = this._getPropertyFromObject(this._datasource.attributeMetadataMap, attributeId);
        if (parsedAttribute && parsedAttribute.id) {
          this._setParsedAttribute(parsedAttribute.id, parsedAttribute);
          const attributeAnnotations = this._cdsAnnotations.attributeAnnotations[parsedAttribute.id] || {};
          if (Object.keys(attributeAnnotations).length > 0) {
            this._parsingResult.dataSourceIsCdsBased = true;
            try {
              // catch and write any parsing error to browser console

              if (attributeAnnotations.UI !== undefined) {
                /// Identification (Positions, URLs)
                this._parseSingleAnnotationOrArray(parsedAttribute, attributeAnnotations.UI.IDENTIFICATION, this._parseIdentification);

                /// Groups
                this._parseSingleAnnotationOrArray(parsedAttribute, attributeAnnotations.UI.CONNECTEDFIELDS, this._parseConnectedFields);
                this._parseURLsForDocumentResultItemThumbnail(parsedAttribute, attributeAnnotations.UI.IDENTIFICATION, attributeAnnotations.SEMANTICS);
                if (attributeAnnotations.UI.MULTILINETEXT !== undefined) {
                  parsedAttribute.format = AttributeFormatType.MultilineText;
                }
              }
              this._parseSemantics(parsedAttribute, attributeAnnotations.SEMANTICS);
              this._parseDescriptionAttribute(parsedAttribute, attributeAnnotations.OBJECTMODEL, attributeAnnotations.UI);
            } catch (e) {
              this.log.warn("Could not parse attribute for datasource: " + e);
            }
          }
        }
      }
      return parsedAttribute;
    }
    _parseConnectedFields(attribute, connectedFields) {
      const qualifier = connectedFields.QUALIFIER;
      if (qualifier) {
        const attributesMap = {};
        if (connectedFields.NAME) {
          attributesMap[connectedFields.NAME] = attribute;
        }
        this._createAttributeGroup(qualifier, connectedFields.GROUPLABEL, connectedFields.TEMPLATE, attributesMap);
      }
    }
    _createAttributeGroup(qualifier, label, template, attributesMap, displayAttributes) {
      let attributeGroup = this._getknownAttributeGroup(qualifier);
      if (!attributeGroup) {
        attributeGroup = this.sina._createAttributeGroupMetadata({
          id: qualifier,
          // equals original qualifier (not converted to lower case)
          label: label || "",
          type: AttributeType.Group,
          template: template || "",
          attributes: [],
          usage: {},
          displayAttributes: displayAttributes || []
        });
        this._setknownAttributeGroup(qualifier, attributeGroup);
        this._knownAttributeGroupsArray.push(attributeGroup);
        this._datasource.attributeGroupsMetadata.push(attributeGroup);
        this._datasource.attributeGroupMetadataMap[qualifier] = attributeGroup;
        const usageStub = this._getDetailUsageStub(qualifier);
        if (usageStub) {
          usageStub.attribute = attributeGroup;
        }
      } else {
        if (label && !attributeGroup.label) {
          attributeGroup.label = label;
        }
        if (template && !attributeGroup.template) {
          attributeGroup.template = template;
        }
        if (displayAttributes && !attributeGroup.displayAttributes) {
          attributeGroup.displayAttributes = displayAttributes;
        }
      }
      if (attributesMap) {
        for (const nameOfAttributeInGroup in attributesMap) {
          const attribute = attributesMap[nameOfAttributeInGroup];
          const attributeGroupMembership = this.sina._createAttributeGroupMembership({
            group: attributeGroup,
            attribute: attribute,
            nameInGroup: nameOfAttributeInGroup
          });
          attributeGroup.attributes.push(attributeGroupMembership);
          attribute.groups.push(attributeGroupMembership);
        }
      }
      return attributeGroup;
    }

    // display position and potential iconUrlAttribute which referred to attribute
    _parseIdentification(attribute, identification) {
      this._parseAttributePositions(attribute, identification);
      this._parseIconUrlAttributeName(attribute, identification);
    }
    _parseIconUrlAttributeName(attribute, identification) {
      if (identification) {
        if (Array.isArray(identification)) {
          // in case @UI.identification is an array, we look for the first entry which holds a URL sub-entry
          for (let i = 0; i < identification.length; i++) {
            if (identification[i].ICONURL) {
              attribute.iconUrlAttibuteName = identification[i].ICONURL;
              break;
            }
          }
        } else if (identification.ICONURL) {
          attribute.iconUrlAttributeName = identification.ICONURL;
        }
      }
    }
    _parseAttributePositions(attribute, identification) {
      // Following also takes care of a fallback:
      // in case that there is an importance, but no position (like it could have happened in the past), set position to a default (Number.MAX_VALUE)

      const importance = identification.IMPORTANCE && identification.IMPORTANCE.toUpperCase();
      let position = identification.POSITION;
      if (importance && !position) {
        position = Number.MAX_VALUE;
      }
      if (position !== undefined) {
        switch (importance) {
          case "HIGH":
          case "MEDIUM":
          case undefined:
            {
              position = this._parsePosition(position);
              const type = identification.TYPE && identification.TYPE.toUpperCase();
              switch (type) {
                case "AS_CONNECTED_FIELDS":
                  {
                    const qualifier = identification.VALUEQUALIFIER;
                    if (qualifier) {
                      const attributeGroup = this._getknownAttributeGroup(qualifier);
                      if (attributeGroup) {
                        // We already know the group
                        attribute = attributeGroup;
                      } else {
                        // We don't know the group yet, so we remember the usage for later
                        attribute = qualifier;
                      }
                    }
                  }
                // fall-through to undefined case..
                // eslint-disable-next-line no-fallthrough
                case undefined:
                  {
                    // if type is anything but AS_CONNECTED_FIELDS or undefined, we'll ignore the position
                    const usageStub = this._getDetailUsageStub(attribute);
                    if (usageStub) {
                      if (!usageStub.attribute && typeof attribute !== "string") {
                        usageStub.attribute = attribute;
                      }
                    } else {
                      let prio;
                      if (importance === "HIGH") {
                        prio = this._AttributeUsagePrio.HIGH;
                      } else if (importance === "MEDIUM") {
                        prio = this._AttributeUsagePrio.MEDIUM;
                      } else {
                        prio = this._AttributeUsagePrio.NONE;
                      }
                      this._addDetailUsageStub(attribute, position, prio);
                    }
                  }
              }
            }
        }
      }
    }

    // @UI.identification.url: 'SUV_URL'
    // @Semantics.imageUrl
    // ESH_FL_TASK.THUMBNAIL_URL AS THUMB_URL,
    //
    // @Semantics.url.mimeType: ‘SUV_MIME‘
    // @UI.hidden
    // ESH_FL_TASK.SUV_URL AS SUV_URL,
    //
    // @UI.hidden
    // ESH_FL_TAS.SUV_MIME AS SUV_MIME,
    //
    _parseURLsForDocumentResultItemThumbnail(attribute, identification, semantics) {
      if (!(semantics && semantics.IMAGEURL)) {
        return;
      }
      let urlAttributeName;
      if (identification) {
        if (Array.isArray(identification)) {
          // in case @UI.identification is an array, we look for the first entry which holds a URL sub-entry
          for (let i = 0; i < identification.length; i++) {
            if (identification[i].URL) {
              urlAttributeName = identification[i].URL;
              break;
            }
          }
        } else {
          urlAttributeName = identification.URL;
        }
      }
      if (urlAttributeName && semantics && semantics.IMAGEURL) {
        const urlAttributeAnnotations = this._getPropertyFromObject(this._cdsAnnotations.attributeAnnotations, urlAttributeName);
        if (urlAttributeAnnotations) {
          const mimeTypeAttributeName = urlAttributeAnnotations.SEMANTICS && urlAttributeAnnotations.SEMANTICS.URL && urlAttributeAnnotations.SEMANTICS.URL.MIMETYPE;
          if (mimeTypeAttributeName) {
            const urlAttribute = this._getPropertyFromObject(this._datasource.attributeMetadataMap, urlAttributeName);
            const mimeTypeAttribute = this._getPropertyFromObject(this._datasource.attributeMetadataMap, mimeTypeAttributeName);
            attribute.suvUrlAttribute = urlAttribute;
            attribute.suvMimeTypeAttribute = mimeTypeAttribute;
            attribute.format = AttributeFormatType.DocumentThumbnail;
          }
        }
      }
    }
    _parseSemantics(attribute, semantics) {
      if (semantics) {
        if (semantics.CONTACT && semantics.CONTACT.PHOTO !== undefined) {
          attribute.format = AttributeFormatType.Round;
          if (attribute.type !== AttributeType.ImageBlob) {
            attribute.type = AttributeType.ImageUrl;
          }
        }
        if (semantics.IMAGEURL !== undefined) {
          if (attribute.type !== AttributeType.ImageBlob) {
            attribute.type = AttributeType.ImageUrl;
          }
        }
        if (semantics.NAME !== undefined) {
          if (semantics.NAME.GIVENNAME !== undefined) {
            attribute.semantics = AttributeSemanticsType.FirstName;
          }
          if (semantics.NAME.FAMILYNAME !== undefined) {
            attribute.semantics = AttributeSemanticsType.LastName;
          }
        }
        if (semantics.EMAIL && semantics.EMAIL.ADDRESS !== undefined) {
          attribute.semantics = AttributeSemanticsType.EmailAddress;
        }
        if (semantics.TELEPHONE && semantics.TELEPHONE.TYPE !== undefined) {
          attribute.semantics = AttributeSemanticsType.PhoneNr;
        }
        if (semantics && semantics.URL !== undefined) {
          attribute.semantics = AttributeSemanticsType.HTTPURL;
        }
        if (semantics && semantics.CURRENCYCODE !== undefined) {
          attribute._private.isCurrency = true;
        }
        if (semantics && semantics.UNITOFMEASURE !== undefined) {
          attribute._private.isUnitOfMeasure = true;
        }
        let unitOfMeasureAttribute, currencyCodeAttribute, template;
        let displayAttributes;
        const unitOfMeasure = semantics.QUANTITY && semantics.QUANTITY.UNITOFMEASURE;
        if (unitOfMeasure) {
          displayAttributes = [];
          attribute._private.isQuantity = true;
          unitOfMeasureAttribute = this._parseSingleAttribute(unitOfMeasure);
          if (unitOfMeasureAttribute) {
            if (unitOfMeasureAttribute._private.isUnitOfMeasure) {
              template = "{" + attribute.id + "} {" + unitOfMeasureAttribute.id + "}";
              displayAttributes.push(attribute.id);
              displayAttributes.push(unitOfMeasureAttribute.id);
              this._createAttributeGroupForParentChildAttributes(attribute, unitOfMeasureAttribute, "____UnitOfMeasureGroup", template, displayAttributes);
            }
          }
        }
        const currencyCode = semantics.AMOUNT && semantics.AMOUNT.CURRENCYCODE;
        if (currencyCode) {
          displayAttributes = [];
          currencyCodeAttribute = this._parseSingleAttribute(currencyCode);
          if (currencyCodeAttribute) {
            if (currencyCodeAttribute._private.isCurrency) {
              template = "{" + attribute.id + "} {" + currencyCodeAttribute.id + "}";
              displayAttributes.push(attribute.id);
              displayAttributes.push(currencyCodeAttribute.id);
              this._createAttributeGroupForParentChildAttributes(attribute, currencyCodeAttribute, "____CurrencyGroup", template, displayAttributes);
            }
          }
        }
      }
    }
    _parseDescriptionAttribute(attribute, objectModel, ui) {
      let descriptionAttributeName = objectModel && objectModel.TEXT && objectModel.TEXT.ELEMENT;
      if (descriptionAttributeName) {
        if (Array.isArray(descriptionAttributeName)) {
          if (descriptionAttributeName.length > 0) {
            descriptionAttributeName = descriptionAttributeName[0];
          } else {
            return;
          }
        }
        const descriptionAttribute = this._parseSingleAttribute(descriptionAttributeName);
        if (descriptionAttribute) {
          const textArrangement = this._deriveTextArrangementFromCdsAnnotation(ui && ui.TEXTARRANGEMENT) || this._defaultTextArrangement;
          const useParentheses = !(attribute.semantics == AttributeSemanticsType.FirstName && descriptionAttribute.semantics == AttributeSemanticsType.LastName || descriptionAttribute.semantics == AttributeSemanticsType.FirstName && attribute.semantics == AttributeSemanticsType.LastName);
          const parenthesesOpen = useParentheses ? "(" : "";
          const parenthesesClose = useParentheses ? ")" : "";
          let template;
          if (textArrangement === AttributeGroupTextArrangement.TextFirst) {
            template = "{" + descriptionAttribute.id + "} " + parenthesesOpen + "{" + attribute.id + "}" + parenthesesClose;
          } else if (textArrangement === AttributeGroupTextArrangement.TextLast) {
            template = "{" + attribute.id + "} " + parenthesesOpen + "{" + descriptionAttribute.id + "}" + parenthesesClose;
          } else if (textArrangement === AttributeGroupTextArrangement.TextOnly) {
            template = "{" + descriptionAttribute.id + "}";
          } else {
            template = "{" + attribute.id + "} " + parenthesesOpen + "{" + descriptionAttribute.id + "}" + parenthesesClose;
          }

          // Prepare the list of attributes to be displayed in UI
          const displayAttributes = [];
          if (textArrangement === AttributeGroupTextArrangement.TextOnly) {
            displayAttributes.push(descriptionAttribute.id);
          } else {
            displayAttributes.push(attribute.id);
            displayAttributes.push(descriptionAttribute.id);
          }
          const attributeGroup = this._createAttributeGroupForParentChildAttributes(attribute, descriptionAttribute, "____Description", template, displayAttributes);
          attributeGroup._private.isDescription = true;
          attributeGroup._private.textArrangement = textArrangement;
          if (attribute._private.isUnitOfMeasure || descriptionAttribute._private.isUnitOfMeasure) {
            attributeGroup._private.isUnitOfMeasure = true;
          }
          if (attribute._private.isCurrency || descriptionAttribute._private.isCurrency) {
            attributeGroup._private.isCurrency = true;
          }
        }
      }
    }
    _deriveTextArrangementFromCdsAnnotation(cdsTextArrangement) {
      if (cdsTextArrangement) {
        switch (cdsTextArrangement.toUpperCase()) {
          case "TEXT_FIRST":
            return AttributeGroupTextArrangement.TextFirst;
          case "TEXT_LAST":
            return AttributeGroupTextArrangement.TextLast;
          case "TEXT_ONLY":
          case "#TEXT_ONLY":
            return AttributeGroupTextArrangement.TextOnly;
          case "TEXT_SEPARATE":
            return AttributeGroupTextArrangement.TextSeparate;
        }
      }
      return undefined;
    }
    _createAttributeGroupForParentChildAttributes(parentAttribute, childAttribute, qualifierSuffix, template, displayAttributes) {
      const qualifier = parentAttribute.id + qualifierSuffix;
      const attributesMap = {};
      attributesMap[parentAttribute.id] = parentAttribute;
      attributesMap[childAttribute.id] = childAttribute;
      const attributeGroup = this._createAttributeGroup(qualifier, parentAttribute.label, template, attributesMap, displayAttributes);
      const obsoleteUsageStub = this._getDetailUsageStub(parentAttribute);
      if (obsoleteUsageStub) {
        obsoleteUsageStub.obsolete = true;
        this._addDetailUsageStub(attributeGroup, obsoleteUsageStub.displayOrder, obsoleteUsageStub.prio);
      }
      this._replaceAttributeWithGroup(parentAttribute, attributeGroup);
      attributeGroup._private.parentAttribute = parentAttribute;
      attributeGroup._private.childAttribute = childAttribute;
      if (childAttribute._private && childAttribute._private.isCurrency) {
        attributeGroup._private.isCurrency = true;
      }
      if (childAttribute._private && childAttribute._private.isUnitOfMeasure) {
        attributeGroup._private.isUnitOfMeasure = true;
      }
      return attributeGroup;
    }
    _replaceAttributeWithGroup(attribute, attributeGroupReplacement) {
      this._setParsedAttribute(attribute.id, attributeGroupReplacement);
      for (let i = 0; i < attribute.groups.length; i++) {
        const groupMembership = attribute.groups[i];
        if (groupMembership.group != attributeGroupReplacement) {
          groupMembership.attribute = attributeGroupReplacement;
        }
      }
    }
    _sortAttributes() {
      const sortFunction = function (entry1, entry2) {
        if (entry1.displayOrder < entry2.displayOrder) {
          return -1;
        } else if (entry1.displayOrder > entry2.displayOrder) {
          return 1;
        }
        return 0;
      };
      let i, allEntries;
      if (this._detailUsageStubsPrioHigh.length > 0 || this._detailUsageStubsPrioMedium.length > 0) {
        this._detailUsageStubsPrioHigh.sort(sortFunction);
        this._detailUsageStubsPrioMedium.sort(sortFunction);
        const _allEntries = this._detailUsageStubsPrioHigh.concat(this._detailUsageStubsPrioMedium);
        for (i = 0; i < _allEntries.length; i++) {
          if (!_allEntries[i].obsolete) {
            allEntries = _allEntries;
            break;
          }
        }
      }
      if (!allEntries) {
        allEntries = this._detailUsageStubsPrioNone.sort(sortFunction);
      }
      for (i = 0; i < allEntries.length; i++) {
        const entry = allEntries[i];
        if (!entry.obsolete && entry.attribute && typeof entry.attribute !== "string") {
          entry.attribute.usage = entry.attribute.usage || {};
          entry.attribute.usage.Detail = {
            displayOrder: i
          };
        }
      }
      this._parsingResult.detailAttributesAreSorted = true;
    }
    _parseSingleAnnotationOrArray(attribute, annotation, parseFunction) {
      if (annotation !== undefined) {
        if (Array.isArray(annotation)) {
          for (let j = 0; j < annotation.length; j++) {
            parseFunction.apply(this, [attribute, annotation[j]]);
          }
        } else {
          parseFunction.apply(this, [attribute, annotation]);
        }
      }
    }
    _parsePosition(position) {
      if (typeof position === "string") {
        try {
          position = parseInt(position, 10);
        } catch (e) {
          this.log.warn("Could not parse position as integer: " + position + " (" + e + ")");
          position = Number.MAX_VALUE;
        }
      }
      if (typeof position !== "number" || isNaN(position)) {
        position = Number.MAX_VALUE; // or use Number.POSITIVE_INFINITY ?
      }
      return position;
    }

    // get a property from an object, even if the property names differ regarding case-sensitivity
    _getPropertyFromObject(object, propertyName) {
      if (object[propertyName]) {
        return object[propertyName];
      }
      propertyName = propertyName.toLowerCase();
      for (const key in object) {
        if (key.toLowerCase() === propertyName) {
          return object[key];
        }
      }
      return undefined;
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.CDSAnnotationsParser = CDSAnnotationsParser;
  return __exports;
});
})();