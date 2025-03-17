/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["../../core/Log", "../../sina/AttributeType", "../../sina/AttributeFormatType", "../../sina/MatchingStrategy", "../../core/errors", "../../sina/i18n"], function (____core_Log, ____sina_AttributeType, ____sina_AttributeFormatType, ____sina_MatchingStrategy, ____core_errors, ____sina_i18n) {
  "use strict";

  const Log = ____core_Log["Log"];
  const AttributeType = ____sina_AttributeType["AttributeType"];
  const AttributeFormatType = ____sina_AttributeFormatType["AttributeFormatType"];
  const MatchingStrategy = ____sina_MatchingStrategy["MatchingStrategy"];
  const UnknownAttributeTypeError = ____core_errors["UnknownAttributeTypeError"];
  const UnknownPresentationUsageError = ____core_errors["UnknownPresentationUsageError"];
  const getText = ____sina_i18n["getText"];
  var AccessUsageConversionMap = /*#__PURE__*/function (AccessUsageConversionMap) {
    AccessUsageConversionMap[AccessUsageConversionMap["AUTO_FACET"] = 0] = "AUTO_FACET";
    AccessUsageConversionMap[AccessUsageConversionMap["SUGGESTION"] = 1] = "SUGGESTION";
    return AccessUsageConversionMap;
  }(AccessUsageConversionMap || {});
  var PresentationUsageConversionMap = /*#__PURE__*/function (PresentationUsageConversionMap) {
    PresentationUsageConversionMap[PresentationUsageConversionMap["TITLE"] = 0] = "TITLE";
    PresentationUsageConversionMap[PresentationUsageConversionMap["SUMMARY"] = 1] = "SUMMARY";
    PresentationUsageConversionMap[PresentationUsageConversionMap["DETAIL"] = 2] = "DETAIL";
    PresentationUsageConversionMap[PresentationUsageConversionMap["IMAGE"] = 3] = "IMAGE";
    PresentationUsageConversionMap[PresentationUsageConversionMap["THUMBNAIL"] = 4] = "THUMBNAIL";
    PresentationUsageConversionMap[PresentationUsageConversionMap["HIDDEN"] = 5] = "HIDDEN";
    return PresentationUsageConversionMap;
  }(PresentationUsageConversionMap || {});
  class MetadataParser {
    log;
    provider;
    presentationUsageConversionMap;
    accessUsageConversionMap;
    sina;
    constructor(provider) {
      this.log = new Log("hana_odata metadata parser");
      this.provider = provider;
      this.sina = provider.sina;
    }
    // annotations: Object to store parsed annotations as properties
    // annotationName: Name of annotation in Dot Notation: UI.IDENTIFICATION.POSITION
    // value: can be a single value, like a string, or an array of objects, like UI.IDENTIFICATION = [ { POSITION: 5 }, { POSITION: 6, TYPE:AS_CONNECTED_FIELD, VALUEQUALIFIER:'somegroup' } ]
    _setAnnotationValue(annotations, annotationName, value) {
      const annotationParts = annotationName.split(".");
      let annotationPart;
      let annotationPointer = annotations;
      const dummyEntryName = "___temporaryDummyEntriesForArrays___";
      let i;

      // Step 01: create object structure for annoation
      for (i = 0; i < annotationParts.length - 1; i++) {
        annotationPart = annotationParts[i];
        if (annotationPointer[annotationPart] === undefined) {
          annotationPointer[annotationPart] = {};
          annotationPointer = annotationPointer[annotationPart];
        } else if (Array.isArray(annotationPointer[annotationPart])) {
          // at this level an array was created for a previous annotation with the same name
          // thus we need to create a dummy entry in that array for merging the current
          // annotation into the array structure
          annotationPointer[dummyEntryName] = annotationPointer[dummyEntryName] || {};
          if (!annotationPointer[dummyEntryName][annotationPart]) {
            annotationPointer[dummyEntryName][annotationPart] = {};
            annotationPointer[annotationPart].push(annotationPointer[dummyEntryName][annotationPart]);
          }
          annotationPointer = annotationPointer[dummyEntryName][annotationPart];
        } else if (typeof annotationPointer[annotationPart] === "object") {
          annotationPointer = annotationPointer[annotationPart];
        } else if (typeof annotationPointer[annotationPart] === "boolean") {
          // for handling something like this:
          //      @Semantics.URL: true
          //      @Semantics.URL.mimeType: "anotherAttribute"
          // if @Semantics.URL.mimeType is set, than @Semantics.URL is implicitely assumed to be 'true'
          annotationPointer[annotationPart] = {};
          annotationPointer = annotationPointer[annotationPart];
        } else {
          // should never happen!
          return;
        }
      }

      // Step 02: set value for annotation.
      if (i < annotationParts.length) {
        annotationPart = annotationParts[i];
        if (annotationPointer[annotationPart] === undefined) {
          // value can be simple value, like string, or array
          annotationPointer[annotationPart] = value;
        } else if (Array.isArray(annotationPointer[annotationPart])) {
          // existing value could be an array, in which case the new value needs to be mixed in
          if (Array.isArray(value)) {
            // new value is an array, which can be appended to the existing array value
            annotationPointer[annotationPart] = annotationPointer[annotationPart].concat(value);
          } else {
            // new value is a simple value. In this case create a dummy entry in the existing array
            // (or use the dummy entry which had been created before) and add the new value to that entry.
            annotationPointer[dummyEntryName] = annotationPointer[dummyEntryName] || {};
            if (!annotationPointer[dummyEntryName][annotationPart]) {
              annotationPointer[dummyEntryName][annotationPart] = value;
              annotationPointer[annotationPart].push(annotationPointer[dummyEntryName][annotationPart]);
            } else {
              for (const propName in value) {
                if (!annotationPointer[dummyEntryName][annotationPart][propName]) {
                  annotationPointer[dummyEntryName][annotationPart][propName] = value[propName];
                }
              }
            }
          }
        }
      }
    }
    fillMetadataBuffer(dataSource, attributes) {
      if (dataSource.attributesMetadata[0].id !== "dummy") {
        // check if buffer already filled
        return;
      }
      dataSource.attributesMetadata = [];
      dataSource.attributeMetadataMap = {};
      const cdsAnnotations = {
        dataSourceAnnotations: {},
        // Key-Value-Map for CDS annotations
        attributeAnnotations: {} // Key-Value-Map (keys: attribute names) of Key-Value-Maps (keys: annotation names) for CDS annotations
      };
      cdsAnnotations.dataSourceAnnotations = dataSource.annotations;
      for (const attributeMetadata in attributes.attributeMap) {
        try {
          this.fillPublicMetadataBuffer(dataSource, attributes.attributeMap[attributeMetadata], cdsAnnotations);
        } catch (e) {
          // not allowed by linter:
          this.log.error("Attribue " + attributeMetadata + " of DataSource " + dataSource.label + " can not be filled in meta data" + e.toString());
        }
      }
      const parser = this.sina._createCDSAnnotationsParser({
        dataSource: dataSource,
        cdsAnnotations: cdsAnnotations
      });
      parser.parseCDSAnnotationsForDataSource();
    }
    fillPublicMetadataBuffer(dataSource, attributeMetadata, cdsAnnotations) {
      const displayOrderIndex = attributeMetadata.displayOrder;

      // Prepare annotations for being passed over to the CDS annotations parser
      const attributeAnnotations = cdsAnnotations.attributeAnnotations[attributeMetadata.labelRaw] = {};
      // var attributeAnnotationsSrc = attributeMetadata.annotationsAttr;

      // jQuery.extend(attributeAnnotations, attributeMetadata.annotationsAttr);
      for (const propName in attributeMetadata.annotationsAttr) {
        attributeAnnotations[propName] = attributeMetadata.annotationsAttr[propName];
      }

      // if this attribute has a Semantics property but no semantics annotation, create a new semantics annotation that corresponds to Semantics propery.
      // var hasSemanticsAnnotation = false,
      //     semanticsPrefix = "SEMANTICS.";
      // for(var key in attributeAnnotationsSrc){
      //     attributeAnnotations[key] = attributeAnnotationsSrc[key];
      // }
      // for (var j = 0; j < attributeAnnotationsSrc.length; j++) {

      // if (hasSemanticsAnnotation || attributeAnnotationsSrc[j].Name.substr(0, semanticsPrefix.length) == semanticsPrefix) {
      //     hasSemanticsAnnotation = true;
      // }
      // }
      // if (attributeMetadata.Semantics && !hasSemanticsAnnotation) {
      //     var semanticsValue;
      //     switch (attributeMetadata.Semantics) {
      //     case "EMAIL.ADDRESS":
      //     case "TELEPHONE.TYPE":
      //     case "CURRENCYCODE":
      //     case "UNITOFMEASURE":
      //         semanticsValue = "TRUE";
      //         break;
      //     case "QUANTITY.UNITOFMEASURE":
      //     case "AMOUNT.CURRENCYCODE":
      //         semanticsValue = attributeMetadata.UnitAttribute;
      //         break;
      //     }
      //     if (semanticsValue) {
      //         attributeAnnotations[semanticsPrefix + attributeMetadata.Semantics] = semanticsValue;
      //     }
      // }

      const typeAndFormat = this._parseAttributeTypeAndFormat(attributeMetadata, dataSource, attributeMetadata.labelRaw);
      if (typeAndFormat && typeAndFormat.type) {
        const publicAttributeMetadata = this.sina._createAttributeMetadata({
          id: attributeMetadata.labelRaw,
          label: attributeMetadata.label || attributeMetadata.labelRaw,
          isKey: attributeMetadata.isKey || false,
          isSortable: attributeMetadata.isSortable,
          usage: this._parseUsage(attributeMetadata, displayOrderIndex) || {},
          type: typeAndFormat.type,
          format: typeAndFormat.format,
          matchingStrategy: this._parseMatchingStrategy(attributeMetadata),
          isHierarchy: !!attributeMetadata.hierarchyDefinition,
          hierarchyName: attributeMetadata?.hierarchyDefinition?.name,
          hierarchyDisplayType: attributeMetadata?.hierarchyDefinition?.displayType
        });

        // move flag isHierarchyDefinition from attribute to datasource
        if (attributeMetadata.hierarchyDefinition && attributeMetadata.hierarchyDefinition?.isHierarchyDefinition) {
          dataSource.isHierarchyDataSource = true;
          dataSource.hierarchyName = attributeMetadata.hierarchyDefinition?.name;
          dataSource.hierarchyAttribute = attributeMetadata.hierarchyDefinition?.attributeName;
          dataSource.hierarchyDisplayType = attributeMetadata.hierarchyDefinition?.displayType;
        }
        publicAttributeMetadata._private.semanticObjectType = attributeMetadata.SemanticObjectTypeId;
        dataSource.attributesMetadata.push(publicAttributeMetadata);
        dataSource.attributeMetadataMap[publicAttributeMetadata.id] = publicAttributeMetadata;
      }
    }
    _parseMatchingStrategy(attributeMetadata) {
      if (attributeMetadata.supportsTextSearch === true) {
        return MatchingStrategy.Text;
      }
      return MatchingStrategy.Exact;
    }
    _parseAttributeTypeAndFormat(attributeMetadata,
    // server side attribute metadata
    dataSource, attributeId) {
      for (let i = 0; i < attributeMetadata.presentationUsage.length; i++) {
        const presentationUsage = attributeMetadata.presentationUsage[i] || "";
        switch (presentationUsage.toUpperCase()) {
          case "SUMMARY":
            continue;
          case "DETAIL":
            continue;
          case "TITLE":
            continue;
          case "HIDDEN":
            continue;
          case "FACTSHEET":
            continue;
          case "THUMBNAIL":
          case "IMAGE":
            return {
              type: AttributeType.ImageUrl
            };
          case "LONGTEXT":
            return {
              type: AttributeType.String,
              format: AttributeFormatType.LongText
            };
          default:
            throw new UnknownPresentationUsageError(presentationUsage);
        }
      }
      switch (attributeMetadata.type) {
        case "Edm.Binary":
          if (attributeMetadata.annotationsAttr) {
            if (attributeMetadata.annotationsAttr.SEMANTICS && attributeMetadata.annotationsAttr.SEMANTICS.CONTACT && attributeMetadata.annotationsAttr.SEMANTICS.CONTACT.PHOTO || attributeMetadata.annotationsAttr.SEMANTICS && attributeMetadata.annotationsAttr.SEMANTICS.IMAGEURL) {
              return {
                type: AttributeType.ImageBlob
              };
            }
          }
          return {
            type: AttributeType.String
          };
          break;
        case "Edm.String":
        case "Edm.PrimitiveType":
        case "Edm.Boolean":
        case "Edm.Byte":
        case "Edm.Guid":
          return {
            type: AttributeType.String
          };
        case "Edm.Double":
        case "Edm.Decimal":
        case "Edm.Float":
        case "Edm.Single":
        case "Edm.SingleRange":
          return {
            type: AttributeType.Double
          };
        case "Edm.Int16":
        case "Edm.Int32":
        case "Edm.Int64":
          return {
            type: AttributeType.Integer
          };
        // case "Edm.Time": // HANA 1.0 types not supported anymore
        case "Edm.TimeOfDay":
          return {
            type: AttributeType.Time
          };
        case "Edm.Date":
          return {
            type: AttributeType.Date
          };
        // case "Edm.DateTime": // HANA 1.0 types not supported anymore
        case "Edm.DateTimeOffset":
          return {
            type: AttributeType.Timestamp
          };
        case "Collection(Edm.String)":
          return {
            type: AttributeType.String
          };
        case "Edm.GeometryPoint":
        case "Edm.GeographyPoint":
        case "GeoJson":
          return {
            type: AttributeType.GeoJson
          };
        default:
          if (attributeMetadata.type && attributeMetadata.type.startsWith("Collection")) {
            this.log.warn("Unsupported data type " + attributeMetadata.type + " of attribute " + attributeMetadata.labelRaw + " in " + dataSource.label);
            return {
              type: AttributeType.String
            };
          }
          throw new UnknownAttributeTypeError(getText("error.sina.unsupportedOdataType", [attributeMetadata.type, attributeMetadata.labelRaw || attributeId, dataSource.label]));
      }
    }
    _parseUsage(attributeMetadata, displayOrderIndex) {
      const usage = {};
      for (let i = 0; i < attributeMetadata.presentationUsage.length; i++) {
        const id = attributeMetadata.presentationUsage[i].toUpperCase() || "";
        if (id === "TITLE") {
          usage.Title = {
            displayOrder: displayOrderIndex
          };
        }
        if (id === "SUMMARY" || id === "DETAIL" || id === "IMAGE" || id === "THUMBNAIL" || id === "LONGTEXT"
        //||id === "#HIDDEN"
        ) {
          usage.Detail = {
            displayOrder: displayOrderIndex
          };
        }
      }
      if (attributeMetadata.isFacet) {
        usage.AdvancedSearch = {
          displayOrder: attributeMetadata.facetPosition || displayOrderIndex || 100,
          iconUrlAttributeName: attributeMetadata.facetIconUrlAttributeName
        };
        usage.Facet = {
          displayOrder: attributeMetadata.facetPosition || displayOrderIndex || 100,
          iconUrlAttributeName: attributeMetadata.facetIconUrlAttributeName
        };
      }
      if (attributeMetadata.isFilteringAttribute) {
        usage.AdvancedSearch = {
          displayOrder: attributeMetadata.facetPosition || displayOrderIndex || 100,
          iconUrlAttributeName: attributeMetadata.facetIconUrlAttributeName
        };
      }
      return usage;
    }
    parseDynamicMetadata(searchResult) {
      // check that we have dynamic metadata
      if (!searchResult) {
        return;
      }
      const metadata = searchResult["@com.sap.vocabularies.Search.v1.Metadata"];
      if (!metadata) {
        return;
      }

      // generate attributes from dynamic metadata
      for (const dataSourceId in metadata) {
        const dataSourceMetadata = metadata[dataSourceId];
        for (const attributeId in dataSourceMetadata) {
          if (attributeId === "$Kind") {
            continue;
          }
          const dynamicAttributeMetadata = dataSourceMetadata[attributeId];
          this.parseDynamicAttributeMetadata(this.sina.getDataSource(dataSourceId), attributeId, dynamicAttributeMetadata);
        }
      }
    }
    parseDynamicAttributeMetadata(dataSource, attributeId, dynamicAttributeMetadata) {
      const typeAndFormat = this._parseAttributeTypeAndFormat({
        presentationUsage: [],
        type: dynamicAttributeMetadata.$Type
      }, dataSource, attributeId);
      let attributeMetadata;
      try {
        attributeMetadata = dataSource.getAttributeMetadata(attributeId);
      } catch (e) {
        this.log.warn("Error while getting attribute metadata: " + e);
      }
      if (attributeMetadata) {
        // update
        if (!attributeMetadata._private.dynamic) {
          return; // only update dynamic attributes
        }
        attributeMetadata.label = dynamicAttributeMetadata["@SAP.Common.Label"];
        attributeMetadata.type = typeAndFormat.type;
        attributeMetadata.format = typeAndFormat?.format;
        attributeMetadata.usage = dynamicAttributeMetadata["@EnterpriseSearch.filteringFacet.default"] === true ? {
          Facet: {
            displayOrder: dynamicAttributeMetadata["@EnterpriseSearch.filteringFacet.displayPosition"] || attributeMetadata.usage?.Facet?.displayOrder || 20,
            iconUrlAttributeName: dynamicAttributeMetadata["@EnterpriseSearch.filteringFacet.iconUrl"] || attributeMetadata.iconUrlAttributeName || ""
          }
        } : {};
        attributeMetadata.isSortable = dynamicAttributeMetadata["@EnterpriseSearchHana.isSortable"] || attributeMetadata.isSortable || false;
      } else {
        // append
        attributeMetadata = this.sina._createAttributeMetadata({
          id: attributeId,
          label: dynamicAttributeMetadata["@SAP.Common.Label"],
          isKey: false,
          isSortable: dynamicAttributeMetadata["@EnterpriseSearchHana.isSortable"] || false,
          usage: dynamicAttributeMetadata["@EnterpriseSearch.filteringFacet.default"] === true ? {
            Facet: {
              displayOrder: dynamicAttributeMetadata["@EnterpriseSearch.filteringFacet.displayPosition"] || 20,
              iconUrlAttributeName: dynamicAttributeMetadata["@EnterpriseSearch.filteringFacet.iconUrl"] || ""
            }
          } : {},
          type: typeAndFormat.type,
          format: typeAndFormat?.format,
          matchingStrategy: MatchingStrategy.Exact,
          _private: {
            dynamic: true
          }
        });
        dataSource.attributesMetadata.push(attributeMetadata);
        dataSource.attributeMetadataMap[attributeMetadata.id] = attributeMetadata;
      }
    }
    getUniqueDataSourceFromSearchResult(searchResult) {
      const data = searchResult.data;
      if (!data) {
        return;
      }
      const items = data.value;
      if (!items) {
        return;
      }
      let dataSourceId, prevDataSourceId;
      for (let i = 0; i < items.length; ++i) {
        const item = items[i];
        const context = item["@odata.context"];
        if (!context) {
          return;
        }
        dataSourceId = context.split("#")[1];
        if (!dataSourceId) {
          return;
        }
        if (prevDataSourceId && prevDataSourceId !== dataSourceId) {
          return;
        }
        prevDataSourceId = dataSourceId;
      }
      return this.sina.getDataSource(dataSourceId);
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.MetadataParser = MetadataParser;
  return __exports;
});
})();