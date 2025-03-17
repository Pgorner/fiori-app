/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../../sina/DataSourceType", "./MetadataParser", "./HierarchyMetadataParser", "../../core/errors", "../../sina/i18n"], function (____sina_DataSourceType, ___MetadataParser, ___HierarchyMetadataParser, ____core_errors, ____sina_i18n) {
  "use strict";

  /* eslint-disable @typescript-eslint/no-var-requires */
  /* eslint-disable @typescript-eslint/no-this-alias */
  const DataSourceType = ____sina_DataSourceType["DataSourceType"];
  const MetadataParser = ___MetadataParser["MetadataParser"];
  const HierarchyMetadataParser = ___HierarchyMetadataParser["HierarchyMetadataParser"];
  const MetadataParserError = ____core_errors["MetadataParserError"];
  const getText = ____sina_i18n["getText"];
  /**
   * MetadataParser for XML odata metadata of HANAs esh_search() procedure
   * See https://pages.github.tools.sap/hana-enterprise-search/hana-search-documentation/2024_QRC1/esh/metadata_call/
   */
  class MetadataParserXML extends MetadataParser {
    jsDOMWindow;
    constructor(provider) {
      super(provider);
    }
    async _getWindow() {
      if (typeof window === "undefined") {
        if (typeof this.jsDOMWindow === "undefined") {
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          const jsdom = require("jsdom");
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          const fs = require("fs");
          const jquery = fs.readFileSync("./node_modules/jquery/dist/jquery.js", "utf-8");
          const dom = new jsdom.JSDOM("<html><script>" + jquery + "</script><body></body></html>", {
            runScripts: "dangerously"
          });
          this.jsDOMWindow = dom.window;
          dom.window.$ = dom.window.jQuery;
        }
        return this.jsDOMWindow;
      }
      return window;
    }
    async fireRequest(client, url) {
      const response = await client.getXML(url);
      return response;
    }
    async parseResponse(metaXML) {
      const that = this;
      if (typeof metaXML === "string") {
        // all in one metadata map
        const allInOneMap = {
          businessObjectMap: new Map(),
          // entity map with attributes and entityset name as key
          businessObjectList: [],
          // list of all entities for convenience
          dataSourceMap: new Map(),
          // datasource map with entityset name as key
          dataSourcesList: [] // list of all datasources for convenience
        };
        const window = await this._getWindow();
        const xmlDoc = window.$.parseXML(metaXML);
        const schemaNode = window.$(xmlDoc).find("Schema");
        const $schemaNode = window.$(schemaNode);
        const helperMap = await that._parseEntityType($schemaNode, window);
        that._parseEntityContainer($schemaNode, helperMap, allInOneMap, window);
        return allInOneMap;
      } else {
        throw new MetadataParserError(getText("error.sina.metadataParserNotStringError"));
      }
    }

    //parse entityset and its attributes from EntityType
    async _parseEntityType(schema, window) {
      const that = this;
      const helperMap = {};
      schema = window.$(schema);
      const hierarchyMetadataParser = new HierarchyMetadataParser(window.$);
      const loadResourceBundlePromises = [];
      schema.find("EntityType").each(function () {
        const entityTypeName = window.$(this).attr("Name");
        const entitySet = {
          schema: schema.attr("Namespace"),
          keys: [],
          attributeMap: new Map(),
          resourceBundle: undefined,
          labelResourceBundle: undefined,
          label: "",
          labelPlural: "",
          annotations: {},
          hierarchyDefinitionsMap: new Map(),
          icon: "",
          name: "",
          dataSource: undefined
        };
        helperMap[entityTypeName] = entitySet;

        //oData keys for accessing a entity
        window.$(this).find("Key>PropertyRef").each(function () {
          entitySet.keys.push(window.$(this).attr("Name"));
        });
        window.$(this).find('>Annotation[Term="EnterpriseSearch.hierarchy.parentChild"]').each(function () {
          entitySet.hierarchyDefinitionsMap = hierarchyMetadataParser.parse(entityTypeName, this);
        });
        window.$(this).find('Annotation[Term="Search.searchable"]').each(function () {
          //window.$(this).find('Annotation').each(function () {
          // if (window.$(this).attr('Term') === 'EnterpriseSearchHana.uiResource.label.bundle') {
          //     var resourceUrl = window.$(this).attr('String');
          //     try {
          //         entitySet.resourceBundle = jQuery.sap.resources({
          //             url: resourceUrl,
          //             language: sap.ui.getCore().getConfiguration().getLanguage()
          //         });
          //     } catch (e) {
          //         sinaLog.error("Resource bundle of " + entityTypeName + " '" + resourceUrl + "' can't be found:" + e.toString());
          //     }

          //Get sibling annotation element of attr EnterpriseSearchHana.uiResource.label.key
          window.$(this).siblings("Annotation").each(function () {
            const $element = window.$(this);
            let annotationName = $element.attr("Term");
            if (annotationName !== undefined && annotationName.length > 0) {
              annotationName = annotationName.toUpperCase();
              const annotationValue = that._getValueFromElement(this, window);
              if (annotationName === "ENTERPRISESEARCHHANA.UIRESOURCE.LABEL.BUNDLE") {
                entitySet.resourceBundle = annotationValue;
              } else if (annotationName === "ENTERPRISESEARCHHANA.UIRESOURCE.LABEL.KEY") {
                const sKey = annotationValue;
                if (typeof sKey === "string" && sKey && entitySet.resourceBundle) {
                  loadResourceBundlePromises.push(that.provider.getTextFromResourceBundle(entitySet.resourceBundle, sKey).then(sTranslatedText => {
                    if (sTranslatedText) {
                      entitySet.labelResourceBundle = sTranslatedText;
                    }
                  }).catch(e => {
                    that.log.error("Resource bundle of " + entityTypeName + " '" + entitySet.resourceBundle + "' can't be found:" + e.toString());
                  }));
                }
              } else if (annotationName === "UI.HEADERINFO.TYPENAME") {
                if (typeof annotationValue === "string") {
                  entitySet.label = annotationValue;
                }
              } else if (annotationName === "UI.HEADERINFO.TYPENAMEPLURAL") {
                if (typeof annotationValue === "string") {
                  entitySet.labelPlural = annotationValue;
                }
              } else if (annotationName === "UI.HEADERINFO.TITLE.TYPE") {
                that._setAnnotationValue(entitySet.annotations, annotationName, annotationValue);
              } else if (annotationName === "UI.HEADERINFO.TITLE.VALUEQUALIFIER") {
                that._setAnnotationValue(entitySet.annotations, annotationName, annotationValue);
              } else if (annotationName === "UI.HEADERINFO.TYPEIMAGEURL") {
                if (typeof annotationValue === "string") {
                  entitySet.icon = annotationValue;
                }
              } else {
                // var annoAttributes = window.$(this)[0].attributes;
                // // In case of collection, say usageMode, it shall be handled differently
                // if (annoAttributes.length === 2) {
                //     var annoTerm = annoAttributes.item(0).value.toUpperCase();
                //     var annoValue = annoAttributes.item(1).value;
                //     entitySet.annotations[annoTerm] = annoValue;
                // }

                that._setAnnotationValue(entitySet.annotations, annotationName, annotationValue);
              }
            }
          });
          //}
        });

        //Loop attributes
        window.$(this).find("Property").each(function (index) {
          const attributeName = window.$(this).attr("Name") || "";
          // A schema of supported annotations is required in order to eliminate this any
          const attribute = {
            labelRaw: attributeName,
            label: "",
            type: window.$(this).attr("Type") || "",
            presentationUsage: [],
            // accessUsage: [],
            isFacet: false,
            isSortable: false,
            supportsTextSearch: false,
            displayOrder: index,
            annotationsAttr: {},
            unknownAnnotation: [],
            hierarchyDefinition: entitySet.hierarchyDefinitionsMap[attributeName],
            facetPosition: 0,
            facetIconUrlAttributeName: "",
            isKey: false,
            isFilteringAttribute: undefined
          };
          entitySet.attributeMap[attributeName] = attribute;
          window.$(this).find("Annotation").each(function () {
            let annotationName = window.$(this).attr("Term");
            if (annotationName !== undefined && annotationName.length > 0) {
              annotationName = annotationName.toUpperCase();
              let annotationValue = that._getValueFromElement(this, window);
              if (annotationValue == undefined) {
                window.$(this).children("Collection").children("Record").each(function () {
                  annotationValue = annotationValue || [];
                  const arrayEntry = {};
                  annotationValue.push(arrayEntry);
                  window.$(this).children("PropertyValue").each(function () {
                    let entryAnnoName = window.$(this).attr("Property");
                    if (entryAnnoName !== undefined && entryAnnoName.length > 0) {
                      entryAnnoName = entryAnnoName.toUpperCase();
                      const entryAnnoValue = that._getValueFromElement(this, window);
                      if (entryAnnoValue !== undefined) {
                        arrayEntry[entryAnnoName] = entryAnnoValue;
                      }
                    }
                  });
                });
              }
              if (annotationValue !== undefined) {
                switch (annotationName) {
                  case "SAP.COMMON.LABEL":
                    if (!attribute.label) {
                      attribute.label = annotationValue;
                    }
                    break;
                  case "ENTERPRISESEARCHHANA.UIRESOURCE.LABEL.KEY":
                    if (annotationValue && entitySet.resourceBundle) {
                      loadResourceBundlePromises.push(that.provider.getTextFromResourceBundle(entitySet.resourceBundle, annotationValue).then(sTranslatedText => {
                        if (sTranslatedText) {
                          attribute.label = sTranslatedText;
                        }
                      }).catch(e => {
                        that.log.error("Resource bundle of " + entityTypeName + " '" + entitySet.resourceBundle + "' can't be found:" + e.toString());
                      }));
                    }
                    break;
                  case "ENTERPRISESEARCH.KEY":
                    attribute.isKey = annotationValue;
                    break;
                  case "ENTERPRISESEARCH.PRESENTATIONMODE":
                    window.$(this).find("Collection>String").each(function () {
                      const presentationUsage = that._getValueFromElement(this, window);
                      // presentationUsage = that.presentationUsageConversionMap[presentationUsage];
                      if (presentationUsage) {
                        attribute.presentationUsage.push(presentationUsage);
                      }
                    });
                    break;
                  // case 'EnterpriseSearch.usageMode': // No longer available in v5
                  //     window.$(this).find('Collection>String').each(function() {
                  //         var accessUsage = annotationValue;
                  //         accessUsage = that.accessUsageConversionMap[accessUsage];
                  //         if (accessUsage) {
                  //             attribute.accessUsage.push(accessUsage);
                  //         }
                  //     });
                  //     break;
                  case "ENTERPRISESEARCHHANA.ISSORTABLE":
                    attribute.isSortable = annotationValue;
                    break;
                  case "ENTERPRISESEARCHHANA.SUPPORTSTEXTSEARCH":
                    attribute.supportsTextSearch = annotationValue;
                    break;
                  case "ENTERPRISESEARCH.FILTERINGFACET.DEFAULT":
                    attribute.isFacet = annotationValue;
                    break;
                  case "ENTERPRISESEARCH.FILTERINGFACET.DISPLAYPOSITION":
                    attribute.facetPosition = annotationValue;
                    break;
                  case "ENTERPRISESEARCH.FILTERINGFACET.ICONURL":
                    attribute.facetIconUrlAttributeName = annotationValue;
                    break;
                  case "ENTERPRISESEARCH.FILTERINGATTRIBUTE.DEFAULT":
                    attribute.isFilteringAttribute = annotationValue;
                    break;
                  case "ENTERPRISESEARCH.FILTERINGATTRIBUTE.DISPLAYPOSITION":
                    attribute.facetPosition = annotationValue;
                    break;
                  case "ENTERPRISESEARCH.FILTERINGATTRIBUTE.ICONURL":
                    attribute.facetIconUrlAttributeName = annotationValue;
                    break;
                  case "ENTERPRISESEARCH.DISPLAYORDER":
                    attribute.displayOrder = annotationValue;
                    break;
                  // case '@EnterpriseSearch.filteringFacet.numberOfValues':
                  //     attribute.numberOfFacetValues = annotationValue;
                  default:
                    if (annotationName.startsWith("UI") || annotationName.startsWith("OBJECTMODEL") || annotationName.startsWith("SEMANTICS")) {
                      that._setAnnotationValue(attribute.annotationsAttr, annotationName, annotationValue);
                    } else {
                      attribute.unknownAnnotation.push(window.$(this));
                    }
                }
              }
            }
          });
          const identification = attribute.annotationsAttr.UI && attribute.annotationsAttr.UI.IDENTIFICATION;
          if (identification) {
            if (identification.POSITION !== undefined) {
              attribute.displayOrder = identification.POSITION;
            } else if (Array.isArray(identification)) {
              for (let i = 0; i < identification.length; i++) {
                if (identification[i].TYPE == undefined && identification[i].POSITION !== undefined) {
                  attribute.displayOrder = identification[i].POSITION;
                  break;
                }
              }
            }
          }
        });
      });
      await Promise.all(loadResourceBundlePromises);
      return helperMap;
    }
    _getValueFromElement(element, window) {
      //string | number | boolean | undefined {
      const $element = window.$(element);
      const textValue = $element.text();
      if (textValue && textValue.trim().length > 0) {
        return textValue;
      }
      try {
        if ($element.attr("String") !== undefined) {
          return $element.attr("String");
        } else if ($element.attr("Decimal") !== undefined) {
          const floatValue = Number.parseFloat($element.attr("Decimal") || "");
          if (!isNaN(floatValue)) {
            return floatValue;
          }
        } else if ($element.attr("Int") !== undefined) {
          const intValue = Number.parseInt($element.attr("Int") || "", 10);
          if (!isNaN(intValue)) {
            return intValue;
          }
        } else if ($element.attr("Bool") !== undefined) {
          return $element.attr("Bool") == "true";
        }
      } catch (e) {
        this.log.error("Error parsing annotation value: " + e.toString());
      }
    }

    //parse datasources from EntityContainer
    _parseEntityContainer(schemaXML, helperMap, allInOneMap, window) {
      const that = this;
      schemaXML.find("EntityContainer>EntitySet").each(function () {
        if (window.$(this).attr("Name") && window.$(this).attr("EntityType")) {
          const name = window.$(this).attr("Name") || "";
          const entityTypeFullQualified = window.$(this).attr("EntityType") || "";

          // var schema = entityTypeFullQualified.slice(0, entityTypeFullQualified.lastIndexOf('.'));
          const entityType = entityTypeFullQualified.slice(entityTypeFullQualified.lastIndexOf(".") + 1);
          const entitySet = helperMap[entityType];
          if (entitySet === undefined) {
            throw "EntityType " + entityType + " has no corresponding meta data!";
          }
          const newDatasource = that.sina.createDataSource({
            id: name,
            label: entitySet.labelResourceBundle || entitySet.label || name,
            labelPlural: entitySet.labelResourceBundle || entitySet.labelPlural || entitySet.label || name,
            icon: entitySet.icon || "",
            type: DataSourceType.BusinessObject,
            attributesMetadata: [{
              id: "dummy"
            }] // fill with dummy attribute
          });
          newDatasource.annotations = entitySet.annotations;
          allInOneMap.dataSourceMap[newDatasource.id] = newDatasource;
          allInOneMap.dataSourcesList.push(newDatasource);

          //that.fillMetadataBuffer(newDatasource, entitySet);
          entitySet.name = name;
          entitySet.dataSource = newDatasource;
          allInOneMap.businessObjectMap[name] = entitySet;
          allInOneMap.businessObjectList.push(entitySet);
        }
      });
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.MetadataParserXML = MetadataParserXML;
  return __exports;
});
})();