/*!
 * SAPUI5
 * (c) Copyright 2009-2024 SAP SE. All rights reserved.
 */
sap.ui.define([
	// "sap/ui/mdc/ChartDelegate",
	"sap/ui/mdc/odata/v4/vizChart/ChartDelegate",
	"sap/ui/mdc/enums/FieldDisplay",
	"sap/base/Log",
	"sap/ui/mdc/enums/ChartItemRoleType",
	"sap/ui/mdc/FilterField",
	"sap/ui/mdc/odata/TypeMap",
	"sap/ui/comp/providers/ChartProvider"
], function(ChartDelegate, FieldDisplay, Log, ChartItemRoleType, FilterField, ODataTypeMap, ChartProvider) {
	"use strict";

	var ODataV2ChartDelegate = Object.assign({}, ChartDelegate);
	//Store the fetched properties during pre-processing in here
	var aCachedProps;


	// Used for creating filterFields on Filter panel
	ODataV2ChartDelegate.getFilterDelegate = function() {
		return {
			addItem: function(oMDCChart, sPropertyKey, mPropertyBag) {
				return Promise.resolve(new FilterField( { propertyKey: sPropertyKey, delegate: {name: "test/sap/ui/comp/smartchart/FieldBaseODataV2.delegate"}, conditions:`{$filters>/conditions/${sPropertyKey}}`}));
			}
	// 		addCondition: function(sPropertyName, oChart, mPropertyBag) {
	// 			return BooksFBDelegate.addCondition(sPropertyName, oChart, mPropertyBag);
	// 		},
	// 		removeCondition: function(sPropertyName, oChart, mPropertyBag) {
	// 			return BooksFBDelegate.removeCondition(sPropertyName, oChart, mPropertyBag);
	// 		}
};
	};


	// set an OData V2 Typemap
	ODataV2ChartDelegate.getTypeMap = function(oPayload) {
		return ODataTypeMap;
	};

	ODataV2ChartDelegate.addItem = function(oMDCChart, sPropertyKey, mPropertyBag, sRole){
		//Pre-Processing -> Cache the needed propertyInfos
		if (mPropertyBag.modifier.targets === "xmlTree") {
			return this.checkPropertyInfo(sPropertyKey, oMDCChart, mPropertyBag).then(function(){

					return this.fetchProperties(oMDCChart, mPropertyBag).then(function(aFetchedProps){
						if (aFetchedProps) {
							var oMDCItem = this.getMDCItemPrePos(sPropertyKey, oMDCChart, sRole, aFetchedProps, mPropertyBag);
							return oMDCItem;
						}

						return ChartDelegate.addItem.call(this, oMDCChart, sPropertyKey, mPropertyBag, sRole);
					}.bind(this));
			}.bind(this));

		}

		return ChartDelegate.addItem.call(this, oMDCChart, sPropertyKey, mPropertyBag, sRole);
	};

	var fnGetFetchedPropertiesObject = function() {
		return aCachedProps;
	};
	var fnSetFetchedPropertiesObject = function(aProperties) {
		aCachedProps = aProperties;
	};

	var fnAddPropertyInfoEntry = function(oControl, sPropertyName, aPropertyInfo, aFetchedProperties, oModifier) {

		if (aFetchedProperties) {
			var nIdx = aFetchedProperties.findIndex(function(oEntry) {
				return oEntry.name === sPropertyName;
			});

			if (nIdx >= 0) {
				aPropertyInfo.push(aFetchedProperties[nIdx]);
				oModifier.setProperty(oControl, "propertyInfo", aPropertyInfo);
			} else {
				Log.error("ChartItemFlex-ChangeHandler: no property info for '" + sPropertyName + "'");
			}
		}
	};

	ODataV2ChartDelegate.getMDCItemPrePos = function(sPropertyName, oMDCChart, sRole, aProps, mPropertyBag){
		var oModifier = mPropertyBag.modifier;
		var oPropertyInfo = aProps.find(function(oEntry) {
			return oEntry.name === sPropertyName;
		});

		if (!oPropertyInfo) {
			return null;
		}

		return oModifier.getProperty(oMDCChart, "id").then(function(sId){
			if (oPropertyInfo.groupable) {

				return oModifier.createControl("sap.ui.mdc.chart.Item", mPropertyBag.appComponent, mPropertyBag.view, sId + "--GroupableItem--" + sPropertyName,{
					propertyKey: oPropertyInfo.name,
					label: oPropertyInfo.label,
					type: "groupable",
					role: sRole ? sRole : "category"
				});
			}

			if (oPropertyInfo.aggregatable) {

				return oModifier.createControl("sap.ui.mdc.chart.Item", mPropertyBag.appComponent, mPropertyBag.view, sId + "--AggregatableItem--" + sPropertyName,{
					propertyKey: oPropertyInfo.name,
					label: oPropertyInfo.label,
					type: "aggregatable",
					role: sRole ? sRole : "axis1"
				});
			}

			return null;
		});

	};

	ODataV2ChartDelegate.checkPropertyInfo = function(sPropertyName, oControl, mPropertyBag){
		var oModifier = mPropertyBag.modifier;
		return oModifier.getProperty(oControl, "propertyInfo")
		.then(function(aPropertyInfo) {
			var nIdx = aPropertyInfo.findIndex(function(oEntry) {
				return oEntry.name === sPropertyName;
			});

			if (nIdx < 0) {

				var aFetchedProperties = fnGetFetchedPropertiesObject();
				if (aFetchedProperties) {
					fnAddPropertyInfoEntry(oControl, sPropertyName, aPropertyInfo, aFetchedProperties, oModifier);
				} else {
					return this.fetchProperties(oControl, mPropertyBag)
					.then(function(aProperties) {
						fnSetFetchedPropertiesObject(aProperties);
						fnAddPropertyInfoEntry(oControl, sPropertyName, aPropertyInfo, aProperties, oModifier);
					});
				}
			}
		}.bind(this));
	};

	/**
	 * Override for pre-processing case
	 */
	ODataV2ChartDelegate.fetchProperties = function (oChart) {
		var oMetadataInfo = oChart.getDelegate().payload;

		var oChartProvider = new ChartProvider({
			entitySet: oMetadataInfo.collectionName,
			// ignoredFields: this.getIgnoredFields(),
			// dateFormatSettings: this.data("dateFormatSettings"),
			// defaultDropDownDisplayBehaviour: this.data("defaultDimensionDisplayBehaviour"),
			// skipAnnotationParse: this.data("skipAnnotationParse"),
			// chartQualifier: this.data("chartQualifier"),
			// presentationVariantQualifier: this.data("presentationVariantQualifier"),
			model: oChart.getModel()
			// chartLibrary: ChartLibrary,
			// criticalityType: CriticalityType,
			// notAssignedText: this.getNotAssignedText()
		});

		var aFields = oChartProvider.getChartViewMetadata().fields;
		// Log.debug(JSON.stringify(aFields));

		var aModelInfos	= [];
		aFields.forEach((oField) => {
			aModelInfos.push(
				{
					"name": oField.name,
					"path": oField.name,
					"dataType": oField.type,
					// "maxConditions": ODataMetaModelUtil.isMultiValueFilterExpression(oFilterRestrictionsInfo[sKey]?.allowedExpressions) ? -1 : 1,
					"constraints": oField.constraints,
					"formatOptions": oField.formatOptions,
					"label": oField.fieldLabel,
					"sortable": oField.sortable,
					"filterable": oField.filterable,
					"groupable": oField.aggregationRole === "dimension",
					"aggregatable": oField.aggregationRole === "measure",
					"role": oField.aggregationRole === "measure" ? "axis1" : "category",
					"textProperty": oField.description || oField.timezone, // the path for the text Property
					// "textFormatter": oField.customFormatter || {displayBehavior: oField.displayBehaviour},
					"timeUnitType": oField.timeUnitType
				}
			);
		});

		// aModelInfos = oChart.getModel(oMetadataInfo.infomodel).getData();
		return Promise.resolve(aModelInfos);
	};

	// ODataV2ChartDelegate.fetchProperties = function (oMDCChart, mPropertyBag) {

	// 	//Custom handling for fetchProperties during pre-processing
	// 	if (mPropertyBag && mPropertyBag.modifier.targets === "xmlTree") {
	// 		var oModifier = mPropertyBag.modifier;

	// 		return oModifier.getProperty(oMDCChart, "delegate")
	// 				.then(function(oDelegate){
	// 					var sModelName =  oDelegate.payload.modelName === null ? undefined : oDelegate.payload.model;
	// 					var oModel = mPropertyBag.appComponent.getModel(sModelName);

	// 					return this._createPropertyInfos(oMDCChart, oModel);
	// 				}.bind(this));
	// 	}

	// 	return ChartDelegate.fetchProperties.call(this, oMDCChart);
	// };

	/*
	ODataV2ChartDelegate._createPropertyInfos = function (oMDCChart, oModel) {
		var oDelegatePayload = oMDCChart.getDelegate().payload;
		var aProperties = [];
		var sEntitySetPath = "/" + oDelegatePayload.collectionName;
		var oMetaModel = oModel.getMetaModel();

		return Promise.all([
			oMetaModel.requestObject(sEntitySetPath + "/"), oMetaModel.requestObject(sEntitySetPath + "@")
		]).then(function (aResults) {
			var oEntityType = aResults[0], mEntitySetAnnotations = aResults[1];
			var oSortRestrictions = mEntitySetAnnotations["@Org.OData.Capabilities.V1.SortRestrictions"] || {};
			var oSortRestrictionsInfo = ODataMetaModelUtil.getSortRestrictionsInfo(oSortRestrictions);
			var oFilterRestrictions = mEntitySetAnnotations["@Org.OData.Capabilities.V1.FilterRestrictions"];
			var oFilterRestrictionsInfo = ODataMetaModelUtil.getFilterRestrictionsInfo(oFilterRestrictions);

			for (var sKey in oEntityType) {
				var oObj = oEntityType[sKey];

				if (oObj && oObj.$kind === "Property") {
					// ignore (as for now) all complex properties
					// not clear if they might be nesting (complex in complex)
					// not clear how they are represented in non-filterable annotation
					// etc.
					if (oObj.$isCollection) {
						//Log.warning("Complex property with type " + oObj.$Type + " has been ignored");
						continue;
					}

					var oPropertyAnnotations = oMetaModel.getObject(sEntitySetPath + "/" + sKey + "@");

					if (sKey === "modifiedAt" || sKey === "createdAt" || sKey === "currency_code") {
						oPropertyAnnotations["@Org.OData.Aggregation.V1.Groupable"] = true;
					}

					const mConstraints = {};
					if (oObj.$Precision > 0) {
						mConstraints.precision = oObj.$Precision;
					}

					//TODO: Check what we want to do with properties neither aggregatable nor groupable
					//Right now: skip them, since we can't create a chart from it
					if (!oPropertyAnnotations["@Org.OData.Aggregation.V1.Aggregatable"] && !oPropertyAnnotations["@Org.OData.Aggregation.V1.Groupable"]) {
						continue;
					}

					if (oPropertyAnnotations["@Org.OData.Aggregation.V1.Aggregatable"]){
						aProperties = aProperties.concat(this._createPropertyInfosForAggregatable(sKey, oPropertyAnnotations, oObj, oFilterRestrictionsInfo, oSortRestrictionsInfo));
					}

					if (oPropertyAnnotations["@Org.OData.Aggregation.V1.Groupable"]) {

						var sTextProperty = oPropertyAnnotations["@com.sap.vocabularies.Common.v1.Text"] ? oPropertyAnnotations["@com.sap.vocabularies.Common.v1.Text"].$Path  : null;

						if (sTextProperty && sTextProperty.indexOf("/") > -1) {
							sTextProperty = null; //Expand is not supported
						}

						// let sSortKey = sKey;
						// if (oPropertyAnnotations["@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement"]?.$EnumMember === "com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly" && sTextProperty) {
						// 	sSortKey = sTextProperty;
						// }

						aProperties.push({
							name: sKey,
							path: sKey,
							label: oPropertyAnnotations["@com.sap.vocabularies.Common.v1.Label"] || sKey,
							sortable: oSortRestrictionsInfo[sKey] ? oSortRestrictionsInfo[sKey].sortable : true,
							// sortKey: sSortKey,
							filterable: oFilterRestrictionsInfo[sKey] ? oFilterRestrictionsInfo[sKey].filterable : true,
							groupable: true,
							aggregatable: false,
							maxConditions: ODataMetaModelUtil.isMultiValueFilterExpression(oFilterRestrictionsInfo[sKey]?.allowedExpressions) ? -1 : 1,
							// visible: sKey !== "modifiedAt", via visible a dimension can be removed from the settings dialog.
							constraints: mConstraints,
							dataType: oObj.$Type,
							role: ChartItemRoleType.category, //standard, normally this should be interpreted from UI.Chart annotation
							textProperty: sTextProperty,
							textFormatter: oPropertyAnnotations["@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement"]
						});

					}
				}
			}

			// DelegateCache.add(oMDCChart, {
			// 	"ID": {dataTypeFormatOptions: {groupingEnabled: false}},
			// 	"author_ID": {dataTypeFormatOptions: {groupingEnabled: false}, valueHelp: "FH1", display: FieldDisplay.Description},
			// 	"title": {valueHelp: "FH4"},
			// 	"published": {valueHelp: "FHPublished", operators: [OperatorName.EQ, OperatorName.GT, OperatorName.LT, OperatorName.BT, "MEDIEVAL", "RENAISSANCE", "MODERN", OperatorName.LASTYEAR]},
			// 	"language_code": {dataTypeConstraints: {nullable: false, maxLength: 3}, valueHelp: "FHLanguage", maxConditions: 1, display: FieldDisplay.Description},
			// 	"stock": {maxConditions: 1, operators: [OperatorName.BT]},
			// 	"classification_code": {valueHelp: "FHClassification", display: FieldDisplay.Description},
			// 	"genre_code": {valueHelp: "FHGenre", display: FieldDisplay.Description},
			// 	"subgenre_code": {valueHelp: "FHSubGenre", display: FieldDisplay.Description},
			// 	"detailgenre_code": {valueHelp: "FHDetailGenre", display: FieldDisplay.Description},
			// 	"currency_code": {valueHelp: "FH-Currency", display: FieldDisplay.Value, maxConditions: 1, operators: [OperatorName.EQ]},
			// 	"createdAt": {maxConditions: 1, operators: ["MYDATE", "MYDATERANGE", OperatorName.EQ, OperatorName.GE, OperatorName.LE, OperatorName.BT, OperatorName.LT, OperatorName.TODAY, OperatorName.YESTERDAY, OperatorName.TOMORROW, OperatorName.LASTDAYS, "MYNEXTDAYS", OperatorName.THISWEEK, OperatorName.THISMONTH, OperatorName.THISQUARTER, OperatorName.THISYEAR, OperatorName.NEXTHOURS, OperatorName.NEXTMINUTES, OperatorName.LASTHOURS]}
			// }, "$Filters");

			return aProperties;
		}.bind(this));

	};
*/
	ODataV2ChartDelegate.updateBindingInfo = function(oChart, oBindingInfo) {
		ChartDelegate.updateBindingInfo.apply(this, arguments);
	};

    ODataV2ChartDelegate.formatText = function(vValue, sDesc) {
		if (this.textFormatter instanceof Function) {
			return this.textFormatter(vValue, sDesc);
		}

		const sValue = this.typeConfig?.typeInstance?.formatValue(vValue, "string") || vValue;

        if (sDesc) {
            const sDisplayBehavior = this.textFormatter?.displayBehavior;
            if (!sDisplayBehavior || sDisplayBehavior === "descriptionAndId") {
                return `${sDesc} (${sValue})`;
            } else if (sDisplayBehavior === "idAndDescription") {
                return `${sValue} (${sDesc})`;
            } else if (sDisplayBehavior === "descriptionOnly") {
                return sDesc;
            }
        }
        return sDesc ? sDesc : sValue;
    };


	return ODataV2ChartDelegate;
}, /* bExport= */ true);
