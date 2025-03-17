sap.ui.define(["sap/suite/ui/generic/template/genericUtilities/metadataAnalyser",
	"sap/suite/ui/generic/template/lib/filterHelper",
	"sap/fe/navigation/SelectionVariant",
	"sap/base/util/deepExtend",
	"sap/suite/ui/generic/template/listTemplates/semanticDateRangeTypeHelper",
	"sap/ui/core/library",
	"sap/base/strings/formatMessage",
	"sap/suite/ui/generic/template/genericUtilities/FeLogger",
	"sap/base/util/ObjectPath"
], function (metadataAnalyser, filterHelper, SelectionVariant, deepExtend, semanticDateRangeTypeHelper, SapCoreLibrary, formatMessage, FeLogger, ObjectPath) {
	"use strict";

	var InsightsCardHelper = {};
	InsightsCardHelper.CardTypes = {
		TABLE : "Table",
		ANALYTICAL : "Analytical",
		LIST: "List",
		DT_CARD: "DT_CARD"
	};

	// shortcut for sap.ui.core.ValueState
	var ValueState = SapCoreLibrary.ValueState;
	var oLogger = new FeLogger("js.InsightsCardHelper").getLogger();

	InsightsCardHelper.createCardForPreview = function (oCardDefinition) {
		return createCardManifest(oCardDefinition);
	};

	/**
	 * This function prevents the card creation if the application has semantic date values
	 * @param {*} oState
	 * @returns {boolean}
	 */
	InsightsCardHelper.isCardCreationAllowed = function(oState) {
		return !semanticDateRangeTypeHelper.hasSemanticDateValue(oState);
	};

	InsightsCardHelper.getCardId = function(oAppComponent) {
		var oAppManifest = oAppComponent.getManifestEntry("sap.app");
		return "user." + oAppManifest.id + "." + Date.now();
	};
	var createCardManifest = function (oCardDefinition) {
		var oManifest = {};
		if (oCardDefinition.cardType === InsightsCardHelper.CardTypes.DT_CARD) {
			oManifest = oCardDefinition.descriptorContent;
			oManifest["sap.insights"] = fnCreateManifestSapInsight(oCardDefinition);
			return oManifest;
		}
		var oComponent = oCardDefinition['component'];
		var oAppComponent = oComponent.getAppComponent();
		var oUIManifest = oAppComponent.getManifestEntry("sap.ui");
		var oAppManifest = oAppComponent.getManifestEntry("sap.app");
		if (oAppManifest && oAppManifest["crossNavigation"]) {
			delete oAppManifest["crossNavigation"];
		}
		oAppManifest.type = "card";
		oAppManifest.id = InsightsCardHelper.getCardId(oAppComponent);
		oManifest["sap.app"] = fnCreateManifestSapApp(oAppManifest);
		oManifest["sap.ui"] = oUIManifest;
		oManifest["sap.card"] = fnCreateManifestSapCard(oCardDefinition);
		oManifest["sap.insights"] = fnCreateManifestSapInsight(oCardDefinition);
		oManifest["sap.ui5"] = fnCreateSapui5();
		return oManifest;
	};

	var getIAppStateKey = function (oTemplateUtils) {
		var oNavigationHandler = oTemplateUtils.oServices.oApplication.getNavigationHandler();
		return oNavigationHandler.getIAppStateKey();
	};

	var fnCreateSapui5 = function () {
		return {
			_version: "1.1.0",
			contentDensities: { compact: true, cozy: true },
			"dependencies": {
				"libs": {
					"sap.insights": {
						lazy: false
					}
				}
			}
		};
	};

	var fnCreateManifestSapApp = function (oAppManifest) {
		var oManifestAppData = deepExtend({}, oAppManifest);
		if (oManifestAppData && oManifestAppData.dataSources && oManifestAppData.dataSources.mainService && oManifestAppData.dataSources.mainService.settings) {
			oManifestAppData.dataSources["filterService"] = oManifestAppData.dataSources.mainService;
			oManifestAppData.dataSources["filterService"].settings["odataVersion"] = "2.0";
		}
		return oManifestAppData;
	};

	var fnCreateManifestSapCard = function (oCardDefinition) {
		var oCardConfig = {};
		var sComponentName = oCardDefinition['component'].getMetadata().getName();
		oCardConfig["type"] = getCardType(sComponentName);
		oCardConfig["configuration"] = fnCreateManifestSapCardConfig(oCardDefinition);
		oCardConfig["data"] = InsightsCardHelper.fnCreateManifestSapCardData(oCardDefinition, oCardConfig);
		oCardConfig["header"] = InsightsCardHelper.fnCreateManifestSapCardHeader(oCardDefinition, oCardConfig);
        oCardConfig["extension"] = "module:sap/insights/CardExtension";
		if (oCardConfig.type === "Analytical") {
			oCardConfig["content"] = InsightsCardHelper.fnCreateManifestSapAnalyticalCardContent(oCardDefinition, oCardConfig);
		} else {
			oCardConfig["content"] = InsightsCardHelper.fnCreateManifestSapTableCardContent(oCardDefinition, oCardConfig);
		}
        InsightsCardHelper.getCardActions(oCardDefinition, oCardConfig);
		return oCardConfig;
	};

	/**
		 * Create Manifest for Sap.insight component with the given card defination
		 *
		 * @param {Object} oCardDefinition
		 * @returns {object}
		 */
	var fnCreateManifestSapInsight = function (oCardDefinition) {
		var oComponent = oCardDefinition['component'],
			oCurrentControlHandler = oCardDefinition['currentControlHandler'],
			oAppManifest = oComponent.getAppComponent().getManifestEntry("sap.app"),
			sAppId = oAppManifest.id,
			bRTMode = "RT",
			oUI5VersionInfo = oComponent.getModel("_templPrivGlobal").getProperty("/generic/ui5VersionInfo");

		return {
			parentAppId: sAppId,
			cardType: bRTMode,
			allowedChartTypes: oCurrentControlHandler.getAvailableChartTypes && oCurrentControlHandler.getAvailableChartTypes(),
			"versions": {
				"ui5": oUI5VersionInfo.version + "-" + oUI5VersionInfo.buildTimestamp
			},
			"filterEntitySet": oCardDefinition.entitySet.name
		};
	};

	var getCardType = function (sComponentName) {
		switch (sComponentName) {
			case "sap.suite.ui.generic.template.ListReport.Component":
				return InsightsCardHelper.CardTypes.TABLE;
			case "sap.suite.ui.generic.template.AnalyticalListPage.Component":
				return InsightsCardHelper.CardTypes.ANALYTICAL;
			default:
				return InsightsCardHelper.CardTypes.LIST;
		}
	};

	var fnCreateManifestSapCardConfig = function (oCardDefinition) {
		var oCardConfiguration = {};
		var oComponent = oCardDefinition['component'];
		var sServiceUrl = oComponent.getModel().sServiceUrl;
		oCardConfiguration["parameters"] = InsightsCardHelper.getFilterDetails(oCardDefinition)["filters"];
		oCardConfiguration["parameters"]["_entitySet"] = {
			value: oCardDefinition.entitySet.name
		};
		oCardConfiguration["parameters"]["_urlSuffix"] = {
			value: "/Results"
		};
		oCardConfiguration["destinations"] = { service: { name: "(default)", defaultUrl: "/" } };
		oCardConfiguration["csrfTokens"] = {
			token1: {
				data: {
					request: {
						url: "{{destinations.service}}" + sServiceUrl,
						method: "HEAD",
						headers: {
							"X-CSRF-Token": "Fetch"
						}
					}
				}
			}
		};
		return oCardConfiguration;
	};

	/**
     * Create the configuration parameters for the generated card
     *  - Evaluate all the parameters to get the value for the manifest configuration.
     *  - Evaluate all filter properties which are common between both card and smart filter bar entity type.
     *  - Evaluate the SelectionAnnotation given for card.
     *  - Add all filters to '_relevantODataFilters', all parameters to '_relevantODataParameters' [ All means including mandatory ].
     *  - Add mandatory filters to '_mandatoryODataFilters' and mandatory parameters to '_mandatoryODataParameters'.
     *
     * @param {Object} oCardDefinition
     * @returns {object} oFinalSet The final configuration parameters
     */
	 InsightsCardHelper.getFilterDetails = function (oCardDefinition) {
        var oFinalSet = { filters: {} },
            oFinal = oFinalSet.filters,
            oSmartFilterbar = oCardDefinition.oSmartFilterbar,
            oFiltermodel = oSmartFilterbar && oSmartFilterbar.getModel(),
            oEntityModel = oCardDefinition.view.getModel(),
            oEntityType = oCardDefinition.entityType,
            aParameterSet = [],
            aRelevantFilter = [],
            aMandatoryParamSet = [],
            aMandatoryFilterSet = [],
            oSelectionVariant,
            aParameterKeys = [],
            aCommonFilterProperties = [],
            aParameterProperties = [];

        if (oFiltermodel) {
            var bParameterised = metadataAnalyser.checkAnalyticalParameterisedEntitySet(oFiltermodel, oCardDefinition.entitySet.name);
            if (bParameterised) {
                var oParametersInfo = metadataAnalyser.getParametersByEntitySet(oFiltermodel, oCardDefinition.entitySet.name);
                if (oParametersInfo.entitySetName) {
                    aParameterProperties = oParametersInfo.parameters || [];
                }
            }
        }
        var aParams = metadataAnalyser.getParametersByEntitySet(oEntityModel, oCardDefinition.entitySet.name, true).parameters;
        var sParamLabel = "";
        aParams.forEach(function (oParameter) {
			var sMandatoryProp = mandatoryParamCheck(oParameter);
			var sDefaultValue = filterHelper.getParameterDefaultValue(oEntityModel, oCardDefinition.entitySet.name, oParameter);
			var sParamActualValue = filterHelper.getParameterActualValue(oParameter, oSmartFilterbar);
			sParamLabel = filterHelper.getLabelForConfigParams(oParameter, oSmartFilterbar, oFinal, oCardDefinition, sDefaultValue);

            var bIsValidSemanticDateRange = filterHelper.IsSemanticDateRangeValid(oCardDefinition, oParameter);
            if (bIsValidSemanticDateRange) {
                filterHelper.setFilterRestrictionToSemanticDateRange(oParameter, true);
                sDefaultValue = filterHelper.getDateRangeDefaultValue(oCardDefinition, oParameter) || sDefaultValue;
                sParamActualValue = filterHelper.getDateRangeValue(sParamActualValue, oParameter, true) || sParamActualValue;

                if (sParamLabel && typeof sParamLabel === 'string') {
                    sParamLabel = sParamLabel.substring(0, sParamLabel.indexOf("(") - 1);
                } else if (sDefaultValue) {
                    sParamLabel = sDefaultValue;
                    filterHelper.getLabelForConfigParams(oParameter, oSmartFilterbar, oFinal, oCardDefinition, sDefaultValue, true);
                }
            }

            if (sMandatoryProp) {
                aMandatoryParamSet.push(oParameter);
            }
            oFinal[oParameter] = {
                value: sParamActualValue ? sParamActualValue : sDefaultValue,
                type: filterHelper.getPropertyType(oParameter),
                description: oParameter && oParameter.description,
                label: sParamLabel
            };
            oFinal[oParameter]["description"] = propertyExtensionData(oParameter, "description");
            aParameterSet.push(oParameter);
            aParameterKeys.push(oParameter);
        });
        aParameterProperties = aParameterProperties.filter(function(key) {
            return !aParameterKeys.includes(key);
        });
        if (oEntityType && oEntityType.property) {
            aCommonFilterProperties = filterHelper.getCommonFilterProperties(oEntityType.property, aParameterProperties);
        }
        for (var i = 0; i < aCommonFilterProperties.length; i++) {
            var oFilterProp = aCommonFilterProperties[i],
                sFilterVal = "";
            var oRelatedEntityProperty = getRelatedEntityProperty(oFilterProp, oEntityType.property);
            var sMandatoryParam = mandatoryParamCheck(oRelatedEntityProperty);
            var sDefaultValue = filterHelper.getFilterDefaultValue(oFilterProp.name, oEntityType) || oFilterProp.defaultValue || "";
            var sParamActualValue = filterHelper.getParameterActualValue(oFilterProp.name, oSmartFilterbar);

            if (aParameterKeys.includes(oFilterProp.name)) {
                sParamLabel = filterHelper.getLabelForConfigParams(oFilterProp.name, oSmartFilterbar, oFinal, oCardDefinition, sDefaultValue);

                var bIsValidSemanticDateRange = filterHelper.IsSemanticDateRangeValid(oCardDefinition, oFilterProp);
                if (bIsValidSemanticDateRange) {
                    filterHelper.setFilterRestrictionToSemanticDateRange(oFilterProp, true);
                    sDefaultValue = filterHelper.getDateRangeDefaultValue(oCardDefinition, oFilterProp.name) || sDefaultValue;
                    sParamActualValue = filterHelper.getDateRangeValue(sParamActualValue, oFilterProp, true) || sParamActualValue;

                    if (sParamLabel && typeof sParamLabel === 'string') {
                        sParamLabel = sParamLabel.substring(0, sParamLabel.indexOf("(") - 1);
                    } else if (sDefaultValue) {
                        sParamLabel = sDefaultValue;
                        filterHelper.getLabelForConfigParams(oFilterProp.name, oSmartFilterbar, oFinal, oCardDefinition, sDefaultValue, true);
                    }
                }
                oFinal[oFilterProp.name] = {
                    value: sParamActualValue ? sParamActualValue : sDefaultValue,
                    type: filterHelper.getPropertyType(oFilterProp),
                    description: oFilterProp && oFilterProp.description,
                    label: sParamLabel
                };
                if (sMandatoryParam) {
                    aMandatoryParamSet.push(sMandatoryParam);
                }
                aParameterSet.push(oFilterProp.name);
            } else {
                oSelectionVariant = new SelectionVariant();
                var aFilterLabel = filterHelper.getLabelForConfigParams(oFilterProp.name, oSmartFilterbar, oFinal, oCardDefinition, sDefaultValue);
                var bIsValidSemanticDateRange = filterHelper.IsSemanticDateRangeValid(oCardDefinition, oFilterProp);
                if (bIsValidSemanticDateRange) {
                    filterHelper.setFilterRestrictionToSemanticDateRange(oFilterProp, false);
                    filterHelper.addDateRangeValueToSV(oCardDefinition, oFilterProp, sDefaultValue, oSelectionVariant, aFilterLabel);
                } else if (sParamActualValue) {
                        filterHelper.addFiltervalues(oSmartFilterbar, oFilterProp.name, oSelectionVariant, aFilterLabel);
                    } else if (sDefaultValue) {
                        var sText = filterHelper.getRelatedTextToRange({Low : sDefaultValue}, aFilterLabel, oSmartFilterbar, oFilterProp.name);
                        oSelectionVariant.addSelectOption(oFilterProp.name, "I", "EQ", sDefaultValue, null, sText);
                    } else {
                        oSelectionVariant.addSelectOption(oFilterProp.name, "I", "EQ", sFilterVal);
                    }

                oFinal[oFilterProp.name] = {
                    value: oSelectionVariant.toJSONString(),
                    type: filterHelper.getPropertyType(oFilterProp),
                    description: oFilterProp && oFilterProp.description
                };

                oFinal[oFilterProp.name].value = filterHelper.enhanceVariant(oFinal[oFilterProp.name].value);

                if (sMandatoryParam) {
                    aMandatoryFilterSet.push(sMandatoryParam);
                }
                aRelevantFilter.push(oFilterProp.name);
            }
            oFinal[oFilterProp.name]["description"] = propertyExtensionData(oFilterProp, "description");
        }
		// Handle Custom Filters set from FE
		var oFECustomFilterData = oCardDefinition['oFECustomFilterData'];
		if (oFECustomFilterData) {
			oSelectionVariant = new SelectionVariant();
			oSelectionVariant.addSelectOption(oFECustomFilterData.name, "I", "EQ", oFECustomFilterData.value);
			oFinal[oFECustomFilterData.name] = {
				value: oSelectionVariant.toJSONString(),
				type: "string",
				description: ""
			};
			oFinal[oFECustomFilterData.name].value = filterHelper.enhanceVariant(oFinal[oFECustomFilterData.name].value);
			aRelevantFilter.push(oFECustomFilterData.name);
		}
		// Handle Basic Search set from FE
		var sBasicSearchName = oSmartFilterbar.getBasicSearchName(), sBasicSearchValue = oSmartFilterbar.getBasicSearchValue();
		if (sBasicSearchValue) {
			oSelectionVariant = new SelectionVariant();
			oSelectionVariant.addSelectOption(sBasicSearchName, "I", "EQ", sBasicSearchValue);
			oFinal[sBasicSearchName] = {
				value: oSelectionVariant.toJSONString(),
				type: "string",
				description: ""
			};
			oFinal[sBasicSearchName].value = filterHelper.enhanceVariant(oFinal[sBasicSearchName].value);
			aRelevantFilter.push(sBasicSearchName);
		}
        var aRelevant = aUniqueArray(aRelevantFilter);
        var aParameter = aUniqueArray(aParameterSet);
        var aMandatoryParam = aUniqueArray(aMandatoryParamSet);
        var aMandatoryFilter = aUniqueArray(aMandatoryFilterSet);
        filterHelper.updateRangeValue(oFinal);
        oFinal["_relevantODataFilters"] = { value: aRelevant };
        oFinal["_relevantODataParameters"] = { value: aParameter };
        oFinal["_mandatoryODataParameters"] = { value: aMandatoryParam };
        oFinal["_mandatoryODataFilters"] = { value: aMandatoryFilter };
        return oFinalSet;
    };

	var aUniqueArray = function (aArr) {
        return aArr && aArr.filter(function (element, index) {
            return aArr.indexOf(element) === index;
        });
    };

	var getRelatedEntityProperty = function(oFilterProp, aEntityProperties) {
        if (aEntityProperties && aEntityProperties.length) {
            var aEntityProperty = aEntityProperties.filter(function(oEntityProperty) {
                return oEntityProperty.name === oFilterProp.name;
            });

            return aEntityProperty && aEntityProperty[0];
        }
    };

	var mandatoryParamCheck = function (oPropertyTest) {
        var aDataValues = [];
        if (oPropertyTest && oPropertyTest.extensions) {
            aDataValues = oPropertyTest.extensions;
            for (var i = 0; i < aDataValues.length; i++) {
                if (aDataValues[i].name === "parameter" && aDataValues[i].value === "mandatory") {
                    return oPropertyTest.name;
                } else if (aDataValues[i].name === "required-in-filter" && aDataValues[i].value === "true") {
                    return oPropertyTest.name;
                }
            }
        }
    };

	var propertyExtensionData = function (oPropertyTest, sProperty) {
        var oDataValues;
        if (oPropertyTest && oPropertyTest[sProperty]) {
            return oPropertyTest[sProperty];
        } else if (oPropertyTest && oPropertyTest.extensions) {
            oDataValues = oPropertyTest.extensions;
            for (var i = 0; i < oDataValues.length; i++) {
                if (oDataValues[i].name === sProperty) {
                    return oDataValues[i].value;
                }
            }
        }
        return undefined;
    };

	/**
     * adds parameter to the request url
     * @param {string} url
     * @param {string} sQueryParamUrl
     * @returns {string} The request url after adding query parameters
     */

	var addQueryParam = function (sUrl, sQueryParamUrl) {
        if (sUrl && sQueryParamUrl) {
            if (sUrl.indexOf("?") === -1) {
                sUrl += "?" + sQueryParamUrl;
            } else {
                sUrl += "&" + sQueryParamUrl;
            }
        }
        return sUrl;
	};

	/**
	* Create Manifest for Data Property of Sap.Card component with the given card definition
	*
	* @param {Object} oCardDefinition
	* @param {Object} oSapCard
	* @returns {Object} oSapCardData Data property for Sap.Card component of the Manifest
	*/
	InsightsCardHelper.fnCreateManifestSapCardData = function (oCardDefinition, oSapCard) {
		var oSapCardData = {};
		// var oBatchObject = BatchHelper.getBatchObject(oCardDefinition, oSapCard["configuration"]);
		var oComponent = oCardDefinition['component'], sComponentName = oCardDefinition['component'].getMetadata().getName();
		var sServiceUrl = oComponent.getModel().sServiceUrl;
		var dataSource = sServiceUrl;
		var oCurrentControlHandler = oCardDefinition['currentControlHandler'];
		//  var isMTable = oCurrentControlHandler.isMTable();
		var sContentURL = '';
		if (oCurrentControlHandler.getBinding()) {
			sContentURL = oCurrentControlHandler.getBinding().getDownloadUrl();
		}

		if (sComponentName === "sap.suite.ui.generic.template.ListReport.Component") {
			var sTopQuery = "$top=15";
			sContentURL = addQueryParam(sContentURL, sTopQuery);
		}
		var sInlineCountQuery = "$inlinecount=allpages";
		sContentURL = addQueryParam(sContentURL, sInlineCountQuery);
		var oBatch = {};
		oBatch.content = {
			method: "GET",
			url: sContentURL,
			headers: {
				Accept: "application/json"
			}
		};
		oSapCardData["request"] = {
			url: "{{destinations.service}}" + dataSource + "/$batch",
			method: "POST",
			headers: {
				"X-CSRF-Token": "{{csrfTokens.token1}}"
			},
			batch: oBatch
		};
		return oSapCardData;
	};

	/**
	* Create Manifest for Header property of Sap.Card component with the given card defination
	*
	* @param {Object} oCardDefinition
	* @param {Object} oSapCard
	* @returns {Object} oSapCardHeader Header property for Sap.Card component of the Manifest
	*/
	InsightsCardHelper.fnCreateManifestSapCardHeader = function (oCardDefinition, oSapCard) {
		var oToolbar = oCardDefinition['currentControlHandler'].getToolbar();
		var sComponentName = oCardDefinition['component'].getMetadata().getName(), sTitleText = oToolbar.getTitleControl() && oToolbar.getTitleControl().getText();

		if (sTitleText && sTitleText.indexOf('(') > -1 && sComponentName === "sap.suite.ui.generic.template.ListReport.Component") {
			var aTitleText = sTitleText.split('(');
			sTitleText = aTitleText[0].trim();
		}
		var sCountPath = "__count";
		var sText = {
			text: "{= ${" + sCountPath + "} === '0' ? '' : ${" + sCountPath + "} }"
		};
		var oSapCardHeader = {
			"title": sTitleText,
			"subTitle": "",
			"actions": {},
			"status": sText,
            "data": {
				"path": "/content/d"
			}
		};
		return oSapCardHeader;
	};

	/**
  * Create Manifest for Content property of Sap.Card component with the given card defination
  *
  * @param {Object} oCardDefinition
  * @param {Object} oSapCard
  * @returns {Object} oSapCardContent Header property for Sap.Card component of the Manifest
  */
	InsightsCardHelper.fnCreateManifestSapTableCardContent = function (oCardDefinition, oSapCard) {
		var aColumns = fnGetColumnsToShow(oCardDefinition);
		var oSapCardContent = {
			"data": {
				"path": "/content/d/results"
			},
			"maxItems": 15,
			"row": {
				"columns": aColumns,
				"actions": {}
			}
		};
		return oSapCardContent;
	};

	var getLabel = function (sName, sType, oInnerChart) {
        var sLabel;
        var aMeasures = oInnerChart.getMeasures();
        var aDimensions = oInnerChart.getDimensions();
        if (sType === "Dimension") {
            sLabel = aDimensions.filter(function (oDimension) {
                    return oDimension.getName() === sName;
                })[0].getLabel() || sName;
        } else {
            sLabel = aMeasures.filter(function (oMeasure) {
                    return oMeasure.getName() === sName;
                })[0].getLabel() || sName;
        }
        return sLabel;
    };

	var getFeeds = function(oInnerChart) {
		var aCardFeeds = [],
			aVizFeeds = oInnerChart._getVizFrame().getFeeds(),
			aFeeds, aFeedType;
		for (var i = 0; i < aVizFeeds.length; i++) {
			aFeeds = aVizFeeds[i].getProperty("values");
			aFeedType = [];
			for (var j = 0; j < aFeeds.length; j++) {
				var sLabel = getLabel(aFeeds[j].getProperty("name"), aFeeds[j].getProperty("type"), oInnerChart);
				var oFeedType = {
					type: aVizFeeds[i].getProperty("type"),
					uid: aVizFeeds[i].getProperty("uid"),
					values: [sLabel]
				};
				aFeedType.push(oFeedType);
			}
			aCardFeeds = aCardFeeds.concat(aFeedType);
		}
		return aCardFeeds;
	};

	/**
	 * Create Manifest for Content property of Sap.Card component with the given card defination
	 *
	 * @param {Object} oCardDefinition
	 * @param {Object} oSapCard
	 * @returns {Object} oSapCardContent Header property for Sap.Card component of the Manifest
	 */
	InsightsCardHelper.fnCreateManifestSapAnalyticalCardContent = function (oCardDefinition, oCardConfig) {
		var oSapCardContent = {},
			oCurrentControlHandler = oCardDefinition['currentControlHandler'],
			oInnerChart = oCurrentControlHandler.getInnerChart(),
			aMeasureDetails = oInnerChart.getMeasures(),//oCurrentControlHandler.getBinding().getMeasureDetails(),
			aDimensionDetails = oInnerChart.getDimensions(),//oCurrentControlHandler.getBinding().getDimensionDetails(),
			aVisibleDimension = oInnerChart.getVisibleDimensions(),
			aVisibleMeasure = oInnerChart.getVisibleMeasures(),
			aInResltDimensions = oInnerChart.getInResultDimensions();
		//If application set InResultDimensions applied
		for (var i = 0; i < aInResltDimensions.length; i++) {
			aVisibleDimension.push(aInResltDimensions[i]);
		}
		oSapCardContent["data"] = {
			path: "/content/d/results"
		};
		oSapCardContent["chartType"] = oInnerChart.getChartType();
		oSapCardContent["measures"] = fnResolveChartMeasures(aMeasureDetails, aVisibleMeasure);
		oSapCardContent["dimensions"] = fnResolveChartDimensions(aDimensionDetails, aVisibleDimension, oCardDefinition);
		//_vizFrame private property is used with approval to get the Feeds from the innerChart.No public API to get the Feeds via Smartchart or innerChart
		oSapCardContent["feeds"] = getFeeds(oInnerChart);
		oSapCardContent["chartProperties"] = fnResolveChartProperties(oInnerChart);
		oSapCardContent["actionableArea"] = "Chart";
		oSapCardContent["actions"] = {};
		return oSapCardContent;
	};

	/**
	 * Extracts relevant visualization properties from the given vizProperties object based on the specified key.
	 *
	 * @param {Object} oVizProperties - The visualization properties object.
	 * @param {string} key - The key to extract properties from within the vizProperties object.
	 * @returns {Object|undefined} An object containing the filtered properties, or undefined if the key does not exist in the vizProperties object.
	 */
	function fnExtractRelevantVizProperties(oVizProperties, key) {
		const aPropertiesToFilter = ["axisTick", "axisLine", "label.visible", "label.formatString", "title.visible"];
		if (!oVizProperties?.[key]) {
			return undefined;
		}
		const oValueOrCategoryAxis = oVizProperties[key];
		const oFilteredProperties = {};
		aPropertiesToFilter.forEach(property => {
			const value = ObjectPath.get(property, oValueOrCategoryAxis);
			if (value !== undefined) {
				ObjectPath.set(property, value, oFilteredProperties);
			}
		});
		return oFilteredProperties;
	}

	const fnResolveChartProperties = function (oInnerChart) {
		const oVizProperties = oInnerChart.getProperty("vizProperties");
		const oAllVizProperties = oInnerChart.getVizProperties();
		const oChartProperties = Object.assign({}, oVizProperties);
		const aAxisKeys = ["valueAxis", "valueAxis2", "categoryAxis", "categoryAxis2"];
		aAxisKeys.forEach(key => {
			if (oAllVizProperties[key]) {
				oChartProperties[key] = fnExtractRelevantVizProperties(oAllVizProperties, key);
			}
		});
		return oChartProperties;
	};

	var fnResolveChartMeasures = function (aMeasureDetails, aVisibleMeasure) {
		var aMeasures = [];
		for (var prop in aMeasureDetails) {
			var elem = aMeasureDetails[prop];
			for (var i = 0; i < aVisibleMeasure.length; i++) {
				if (aVisibleMeasure[i] === elem.getName()) {
					aMeasures.push({ "name": elem.getLabel(), "value": "{" + elem.getName() + "}" });
					break;
				}
			}
		}
		return aMeasures;
	};

	var constructTextArrangement = function(oCardDefinition, description) {
		var oEntityType = oCardDefinition['entityType'];
		var oMetaModel = oCardDefinition['currentControlHandler'].getModel().getMetaModel();
		var oProperty = oMetaModel.getODataProperty(oEntityType, description.getName());
		var sPropertyName = "{" + oProperty.name + "}";
		var textPropertyName = "{" + description.getTextProperty() + "}";
		if (oProperty['com.sap.vocabularies.Common.v1.Text'] && oProperty['com.sap.vocabularies.Common.v1.Text'].Path) {
			var sTextArrangement = oProperty['com.sap.vocabularies.Common.v1.Text']['com.sap.vocabularies.UI.v1.TextArrangement'];
			if (!sTextArrangement) {
				sTextArrangement = oEntityType["com.sap.vocabularies.UI.v1.TextArrangement"];
			}
			var sTextArrangementType = sTextArrangement && sTextArrangement.EnumMember.split("/")[1];
			if (sTextArrangementType === "TextOnly") {
				sPropertyName = "{= $" + textPropertyName + " === '' ? '' : $" + textPropertyName + "}";
			} else if (sTextArrangementType === "TextLast") {
				sPropertyName = "{= $" + sPropertyName + " === '' ? '' : $" + sPropertyName + "}" + "{= $" + textPropertyName + " === '' ? '' : ' (' + ($" + textPropertyName + ") + ')'}";
			} else if (sTextArrangementType === "TextSeparate") {
				sPropertyName = "{= $" + sPropertyName + " === '' ? '' : $" + sPropertyName + "}";
			} else { // Default case
				sPropertyName = "{= $" + textPropertyName + " === '' ? '' : $" + textPropertyName + "}" + "{= $" + sPropertyName + " === '' ? '' : ' (' + ($" + sPropertyName + ") + ')'}";
			}
		}
		return sPropertyName;
	};

	var fnResolveChartDimensions = function (aDimensionDetails, aVisibleDimension, oCardDefinition) {
		var aDimensions = [];
		for (var prop in aDimensionDetails) {
			var elem = aDimensionDetails[prop];
			for (var i = 0; i < aVisibleDimension.length; i++) {
				if (aVisibleDimension[i] === elem.getName()) {
					if (elem.getTextProperty()) {
						aDimensions.push({
							"name": elem.getLabel(),
							"value": "{" + elem.getTextProperty() + "}",
							"displayValue": constructTextArrangement(oCardDefinition, elem)
						});
					} else {
						aDimensions.push({
							"name": elem.getLabel(),
							"value": "{" + elem.getName() + "}",
							"displayValue": constructTextArrangement(oCardDefinition, elem)
						});
					}
					break;
				}
			}
		}
		return aDimensions;
	};

    InsightsCardHelper.getCardActions = function (oCardDefinition, oSapCard) {
        var sHash = window.hasher.getHash(), aSemanticObjAction = sHash.split('&/')[0];

        if (aSemanticObjAction.includes('?')) {
            aSemanticObjAction = aSemanticObjAction.split('?')[0].split('-');
        } else {
            aSemanticObjAction = aSemanticObjAction.split('-');
        }

        var oHeaderParams = {
            "ibnTarget": {
                "semanticObject": aSemanticObjAction[0],
                "action": aSemanticObjAction[1]
            },
			"sensitiveProps": [],
			"ibnParams": {nhHybridIAppStateKey: getIAppStateKey(oCardDefinition.oTemplateUtils)}
        };

        var oHeaderParameterValue = [{
            "type": "Navigation",
            "parameters": "{= extension.formatters.getNavigationContext(${parameters>/headerState/value})}"
        }];

        var oContentParams = JSON.parse(JSON.stringify(oHeaderParams));

        var oContentParameterValue = [{
            "type": "Navigation",
            "parameters": "{= extension.formatters.getNavigationContext(${parameters>/contentState/value}, ${})}"
        }];

        oSapCard.configuration.parameters.headerState = {
            value : JSON.stringify(oHeaderParams)
        };
        oSapCard.configuration.parameters.contentState = {
            value : JSON.stringify(oContentParams)
        };

        oSapCard.header.actions = oHeaderParameterValue;
        if (oSapCard.type != "Analytical") {
			var oTemplatePrivateModel = oCardDefinition['component'].getModel("_templPriv");
			if (!oTemplatePrivateModel.getProperty("/listReport/bSupressCardRowNavigation")) {
				oSapCard.content.row.actions = oContentParameterValue;
			}
		}
	};

	var fnGetLineItemAnnotation = function (oCardDefinition) {
		var oEntityType = oCardDefinition['entityType'];
		var aCustomData = oCardDefinition['currentControlHandler'].getControl().getCustomData();
		var oCustomDataForLineItemQualifier = aCustomData.find(function(oCustomData){
			return oCustomData.getKey() === "lineItemQualifier";
		});
		var sLineItemSuffix = (oCustomDataForLineItemQualifier && oCustomDataForLineItemQualifier.getValue()) ? ("#" + oCustomDataForLineItemQualifier.getValue()) : "";
		return oEntityType["com.sap.vocabularies.UI.v1.LineItem" + sLineItemSuffix] || [];
	};

	var fnBuildExpressionForCriticalityColor = function (oCriticalityAnnotation) {
		var sFormatCriticalityExpression = ValueState.None;
			var sExpressionTemplate;
			var oCriticalityProperty = oCriticalityAnnotation.Criticality;

			if (oCriticalityProperty) {
				sExpressionTemplate = "'{'= ({0} === ''com.sap.vocabularies.UI.v1.CriticalityType/Negative'') || ({0} === ''1'') || ({0} === 1) ? ''" + ValueState.Error + "'' : " +
					"({0} === ''com.sap.vocabularies.UI.v1.CriticalityType/Critical'') || ({0} === ''2'') || ({0} === 2) ? ''" + ValueState.Warning + "'' : " +
					"({0} === ''com.sap.vocabularies.UI.v1.CriticalityType/Positive'') || ({0} === ''3'') || ({0} === 3) ? ''" + ValueState.Success + "'' : " +
					"''" + ValueState.None + "'' '}'";
				if (oCriticalityProperty.Path) {
					var sCriticalitySimplePath = "${" + oCriticalityProperty.Path + "}";
					sFormatCriticalityExpression = formatMessage(sExpressionTemplate, sCriticalitySimplePath);
				} else if (oCriticalityProperty.EnumMember) {
					var sCriticality = "'" + oCriticalityProperty.EnumMember + "'";
					sFormatCriticalityExpression = formatMessage(sExpressionTemplate, sCriticality);
				} else {
					oLogger.warning("Case not supported, returning the default sap.ui.core.ValueState.None");
				}
			} else {
				// Any other cases are not valid, the default value of 'None' will be returned
				oLogger.warning("Case not supported, returning the default sap.ui.core.ValueState.None");
			}

			return sFormatCriticalityExpression;
	};

	var fnGetColumnsToShow = function (oCardDefinition) {
		var oEntityType = oCardDefinition['entityType'];
		var oSmartTable = oCardDefinition['currentControlHandler'].getControl();
		var oMetaModel = oCardDefinition['currentControlHandler'].getModel().getMetaModel();
		var aColumns = [];
		var oCommonUtils = oCardDefinition.oTemplateUtils.oCommonUtils;
		oCardDefinition['currentControlHandler'].getVisibleProperties(true).filter(function (oColumn) {
			var oColumnData = oColumn.data("p13nData");
			var sColumnKeyDescription = (oColumnData && oColumnData.description) || "";
			var oProperty = oMetaModel.getODataProperty(oEntityType, oColumnData.leadingProperty);
			if (oCommonUtils.isSupportedColumn(oColumn, oProperty, oSmartTable)) {
				if (oProperty && (oProperty['sap:label'] || oProperty['com.sap.vocabularies.Common.v1.Label']) && oColumn.getVisible()) {
					var oColumnObject = {};
                    sColumnKeyDescription = "{" + sColumnKeyDescription + "}";
					var sColumnValue = "{" + oProperty.name + "}";
					var sNavigation = ""; //need to improve
					var oCriticalityAnnotation;
					var aSemKeyAnnotation = oEntityType["com.sap.vocabularies.Common.v1.SemanticKey"];
					var bIsPropertySemanticKey = !!aSemKeyAnnotation && aSemKeyAnnotation.some(function(oAnnotation){
						return oAnnotation.PropertyPath === oProperty.name;
					});
					var aLineItemAnnotation = fnGetLineItemAnnotation(oCardDefinition);
					var bIsCriticality = !!aLineItemAnnotation && aLineItemAnnotation.some(function(oAnnotation){
						oCriticalityAnnotation = oAnnotation;
						return (oAnnotation.Criticality && oAnnotation.Value && oAnnotation.Value.Path) === oProperty.name;
					});
					if (oProperty["Org.OData.Measures.V1.ISOCurrency"] && oProperty["Org.OData.Measures.V1.ISOCurrency"].Path) {
						sColumnValue = sColumnValue.concat(" " + "{" + sNavigation + oProperty["Org.OData.Measures.V1.ISOCurrency"].Path + "}");
					}
					if (oProperty["Org.OData.Measures.V1.Unit"] && oProperty["Org.OData.Measures.V1.Unit"].Path) {
						sColumnValue = sColumnValue.concat(" " + "{" + sNavigation + oProperty["Org.OData.Measures.V1.Unit"].Path + "}");
					}

					if (oProperty['com.sap.vocabularies.Common.v1.Text'] && oProperty['com.sap.vocabularies.Common.v1.Text'].Path) {
						var sTextArragement = oProperty['com.sap.vocabularies.Common.v1.Text']['com.sap.vocabularies.UI.v1.TextArrangement'];
						if (!sTextArragement) {
							sTextArragement = oEntityType["com.sap.vocabularies.UI.v1.TextArrangement"];
						}
						var sTextArrangementType = sTextArragement && sTextArragement.EnumMember.split("/")[1];
						if (bIsPropertySemanticKey && oCardDefinition.oTemplateUtils.oComponentUtils.isDraftEnabled()) {
							var sUnnamedObject = oCardDefinition['component'].getModel('i18n').getResourceBundle().getText('NEW_OBJECT');
							if (sTextArrangementType === "TextOnly") {
								oColumnObject['value'] = "{= $" + sColumnKeyDescription + " === '' ?  '" + sUnnamedObject + "'  : $" + sColumnKeyDescription + "}";
							} else if (sTextArrangementType === "TextLast") {
								oColumnObject['value'] =  "{= $" + sColumnValue + " === '' ?  '' : $" + sColumnValue + "}";
								oColumnObject.additionalText =  "{= $" + sColumnKeyDescription + " === '' ?  '" + sUnnamedObject + "' : $" + sColumnKeyDescription + "}";
							} else if (sTextArrangementType === "TextSeparate") {
								oColumnObject['value'] = "{= $" + sColumnValue + " === '' ? '' : $" + sColumnValue + "}";
							} else { // Default case
								oColumnObject['value'] =  "{= $" + sColumnKeyDescription + " === '' ?  '" + sUnnamedObject + "' : $" + sColumnKeyDescription + "}";
								oColumnObject.additionalText =  "{= $" + sColumnValue + " === '' ?  '' : $" + sColumnValue + "}";
							}
							oColumnObject.identifier = true;
						} else if (sTextArrangementType === "TextOnly") {
								oColumnObject['value'] = "{= $" + sColumnKeyDescription + " === '' ? '' : $" + sColumnKeyDescription + "}";
							} else if (sTextArrangementType === "TextLast") {
								oColumnObject['value'] = "{= $" + sColumnValue + " === '' ? '' : $" + sColumnValue + "}" + "{= $" + sColumnKeyDescription + " === '' ? '' : ' (' + ($" + sColumnKeyDescription + ") + ')'}";
							} else if (sTextArrangementType === "TextSeparate") {
								oColumnObject['value'] = "{= $" + sColumnValue + " === '' ? '' : $" + sColumnValue + "}";
							} else { // Default case
								oColumnObject['value'] = "{= $" + sColumnKeyDescription + " === '' ? '' : $" + sColumnKeyDescription + "}" + "{= $" + sColumnValue + " === '' ? '' : ' (' + ($" + sColumnValue + ") + ')'}";
							}
					} else {
						oColumnObject['value'] = sColumnValue;
						if (bIsPropertySemanticKey) {
							oColumnObject.identifier = bIsPropertySemanticKey;
						}
					}
					if (bIsCriticality) {
						oColumnObject.state = fnBuildExpressionForCriticalityColor(oCriticalityAnnotation);
						oColumnObject.showStateIcon = oCriticalityAnnotation.CriticalityRepresentation ? (oCriticalityAnnotation.CriticalityRepresentation.EnumMember !== "com.sap.vocabularies.UI.v1.CriticalityRepresentationType/WithoutIcon") : true;
					}
					if (oProperty['com.sap.vocabularies.Common.v1.Label'] && oProperty['com.sap.vocabularies.Common.v1.Label'].String) {
						var sLabel = oProperty['com.sap.vocabularies.Common.v1.Label'].String,
						oRB = oCardDefinition['component'].getModel('i18n').getResourceBundle();
						if (sLabel.match(/{@i18n>.+}/gi) && oRB) {
							oColumnObject['title'] = oRB.getText(sLabel.substring(sLabel.indexOf(">") + 1, sLabel.length - 1));
						} else {
							oColumnObject['title'] = sLabel;
						}
					} else {
						oColumnObject['title'] = oProperty['sap:label'];
					}
					if (oProperty.type === 'Edm.DateTime' || oProperty.type === 'Edm.DateTimeOffset') {
						var oFormatOption = JSON.stringify(oColumnData.typeInstance.oFormat.oFormatOptions).replace(/"/g, "'");
						oColumnObject['value'] = "{=$" + sColumnValue + " ? format.dateTime($" + sColumnValue + ", " + oFormatOption + ") : ''}";
					}
					aColumns.push(oColumnObject);
				}
			}
		});
		return aColumns;
	};

	return InsightsCardHelper;
});
