sap.ui.define([
	"sap/base/Log",
	"sap/base/util/deepClone",
	"sap/base/i18n/ResourceBundle"
], function (Log, deepClone, ResourceBundle) {
	'use strict';

	var oConfig;
	var AdaptiveCardHelper = {};
	var aActions = [];
	var aVisibleItemsData;
	var iMaxColumns = 3;
	var oSapSemantics = Object.freeze({
		unitOfMeasure: "unit-of-measure",
		currencyCode: "currency-code"
	});

	// function performs multiple level entity relation check to find the color
	var fnGetColorFromAnnotations = function (sCriticalityPath) {
		if (sCriticalityPath) {
			var sColorExp = sCriticalityPath.indexOf('/') > -1 ? sCriticalityPath.replaceAll('/', '.') : sCriticalityPath;
			return "${if(int(" + sColorExp + ") == 0, 'Default', if(int(" + sColorExp + ") == 1 , 'Attention', if(int(" + sColorExp + ") == 2 , 'Warning', 'Good')))}";
		}
		return 'Default';
	};

	var findFunc = function (sCompareProp, oProperty) {
		return oProperty && oProperty.name === sCompareProp || undefined;
	};

	// function performs multiple level entity relation check for potentially sensitive data
	var isPotentiallySensitive = function (sProperty, oController) {
		var oComponent = oConfig.component;
		var sEntitySet = oComponent.getEntitySet();
		var model = oComponent.getModel();
		var oMetaModel = model.getMetaModel();
		var oEntitySet = oMetaModel.getODataEntitySet(sEntitySet);
		var oEntityType = oMetaModel.getODataEntityType(oEntitySet.entityType);
		var aProperties = sProperty.split('/');
		var propLen = aProperties.length;
		var iLoop = 0;
		while (propLen > 0) {
			var oProperty =  oEntityType.property.find(findFunc.bind(null, aProperties[iLoop]));
			if (oProperty && oProperty["com.sap.vocabularies.PersonalData.v1.IsPotentiallySensitive"] && oProperty["com.sap.vocabularies.PersonalData.v1.IsPotentiallySensitive"].Bool === "true") {
				return true;
			} else if (propLen > 1) {
				var oNavigationEntitySet = oMetaModel.getODataAssociationEnd(oEntityType, aProperties[iLoop]);
				oEntityType = oMetaModel.getODataEntityType(oNavigationEntitySet.type);
				iLoop++;
			}
			propLen--;
		}
		return false;
	};

	// function performs multiple level entity relation check for potentially personal data
	var isPotentiallyPersonal = function (sProperty, oController) {
		var oComponent = oConfig.component;
		var sEntitySet = oComponent.getEntitySet();
		var model = oComponent.getModel();
		var oMetaModel = model.getMetaModel();
		var oEntitySet = oMetaModel.getODataEntitySet(sEntitySet);
		var oEntityType = oMetaModel.getODataEntityType(oEntitySet.entityType);
		var aProperties = sProperty.split('/');
		var propLen = aProperties.length;
		var iLoop = 0;
		while (propLen > 0) {
			var oProperty =  oEntityType.property.find(findFunc.bind(null, aProperties[iLoop]));
			if (oProperty && oProperty["com.sap.vocabularies.PersonalData.v1.IsPotentiallyPersonal"] && oProperty["com.sap.vocabularies.PersonalData.v1.IsPotentiallyPersonal"].Bool === "true") {
				return true;
			} else if (propLen > 1) {
				var oNavigationEntitySet = oMetaModel.getODataAssociationEnd(oEntityType, aProperties[iLoop]);
				oEntityType = oMetaModel.getODataEntityType(oNavigationEntitySet.type);
				iLoop++;
			}
			propLen--;
		}
		return false;
	};

	// function performs multiple level entity relation to get Edm.type
	var getEdmType = function (sProperty, oController) {
		var oComponent = oConfig.component;
		var sEntitySet = oComponent.getEntitySet();
		var model = oComponent.getModel();
		var oMetaModel = model.getMetaModel();
		var oEntitySet = oMetaModel.getODataEntitySet(sEntitySet);
		var oEntityType = oMetaModel.getODataEntityType(oEntitySet.entityType);
		var aProperties = sProperty.split('/');
		var propLen = aProperties.length;
		var iLoop = 0;
		while (propLen > 0) {
			var oProperty =  oEntityType.property.find(findFunc.bind(null, aProperties[iLoop]));
			if (oProperty) {
				var oSemantic = oEntityType.property.find(findFunc.bind(null, oProperty["sap:unit"]));
				return { sEdmType: oProperty["type"], sSapUnit: oProperty["sap:unit"], sSemantic: oSemantic ? oSemantic["sap:semantics"] : undefined };
			} else if (propLen > 1) {
				var oNavigationEntitySet = oMetaModel.getODataAssociationEnd(oEntityType, aProperties[iLoop]);
				oEntityType = oMetaModel.getODataEntityType(oNavigationEntitySet.type);
				iLoop++;
			}
			propLen--;
		}
		return { edmType: undefined, sSemantic: undefined, sSapUnit: undefined };
	};

	var fnGetVisiblePathForFC = function (oControl) {
		var visiblePathwithFormat = "";
		var oParent = oControl.getParent();
		if (oControl.getBindingPath("visible")) {
			visiblePathwithFormat = "${" + oControl.getBindingPath("visible") + " !=0}";
		} else if (oParent.getBindingPath("visible")) {
			visiblePathwithFormat = "${(" + oParent.getBindingPath("visible") + " == false || " + oParent.getBindingPath("visible") + " == '' || " + oParent.getBindingPath("visible") + " == 0)}";
		}
		return visiblePathwithFormat;
    };

	var fnExtractDataFromDataPoint = function (item, controller) {
		if (item.getItems().length > 1) {
			var oDataPointData = {
				type: "DataPoint",
				label: "",
				value: "",
				path: "",
				displayBehaviour: "",
				paths: {},
				objectStatus: "",
				color: "",
				edmType: "",
				visiblePath: ""
			};
			var aControls = item.getItems();
			oDataPointData.path = aControls[1].getBindingPath("value");
			oDataPointData.visiblePath = fnGetVisiblePathForFC(aControls[1]);
			if (isPotentiallySensitive(oDataPointData.path, controller)) {
				return null;
			}
			if (isPotentiallyPersonal(oDataPointData.path, controller)) {
				return null;
			}
			var data = getEdmType(oDataPointData.path, controller);
			oDataPointData.edmType = data.sEdmType;
			oDataPointData.semantic = data.sSemantic;
			oDataPointData.sapUnit = data.sSapUnit;
			oDataPointData.label = aControls[0].getText && aControls[0].getText();
			oDataPointData.value = aControls[1].getValue && aControls[1].getValue();

			var oConfiguration = aControls[1].getConfiguration && aControls[1].getConfiguration();
			oDataPointData.displayBehaviour = oConfiguration && oConfiguration.getDisplayBehaviour && oConfiguration.getDisplayBehaviour();

			if (aControls[1].getInnerControls) {
				var aInnerControls = aControls[1].getInnerControls();
				if (aInnerControls && aInnerControls.length > 0) {
					aInnerControls.forEach(function (control) {
						var oBindingText = control.getBinding("text");
						var oBindingInfoOfText = oBindingText && control.getBindingInfo("text");
						if (oBindingText && oBindingInfoOfText) {
							var aParts = oBindingInfoOfText.parts;
							if (aParts && aParts.length > 0) {
								aParts.forEach(function (part) {
									if (part.path !== oDataPointData.path && part.path !== "__$$SmartFieldNotExistingBindingPath") {
										oDataPointData.paths[part.path] = part.path;
									}
								});
							}
						}

						var oBindingState = control.getBinding("state");
						var oBindingInfoOfState = oBindingState && control.getBindingInfo("state");
						if (oBindingState && oBindingInfoOfState) {
							oDataPointData.objectStatus = control.getBindingPath("state");
							oDataPointData.color = fnGetColorFromAnnotations(oDataPointData.criticality);
							if (oDataPointData.path === oDataPointData.criticality) {
								oDataPointData.path = Object.keys(oDataPointData.paths)[0];
								oDataPointData.paths = [];
							}

						}
					});
				}
			}
			return oDataPointData;
		}
		return undefined;
	};

	var fnExtractDataFromPlainTextVBox = function (item, controller) {
		if (item.getItems().length > 1) {
			var oPlainTextData = {
				type: "PlainTextVBox",
				label: "",
				value: "",
				path: "",
				visiblePath: ""
			};
			var aControls = item.getItems();
			oPlainTextData.label = aControls[0].getText && aControls[0].getText();
			oPlainTextData.path = aControls[1].getBindingPath("text");
			oPlainTextData.visiblePath = fnGetVisiblePathForFC(aControls[1]);
			// if (isPotentiallySensitive(oDataPointData.path, controller)) {
			// 	return;
			// }
			oPlainTextData.value = aControls[1].getText && aControls[1].getText();
			return oPlainTextData;
		}
		return undefined;
	};

	var fnExtractDataFromForm = function (item, controller) {
		if (item.getItems().length > 0) {
			var oFormData = {
				type: "Form",
				header: "",
				fields: []
			};
			var aControls = item.getItems();
			var iLoopFrom = 0;
			if (aControls[0].getContent && aControls[0].getContent() === null && aControls[0].getText) {
				// This means first control is Header
				oFormData.header = aControls[0].getText();
				iLoopFrom = 1;
			}
			for (iLoopFrom; iLoopFrom < aControls.length; iLoopFrom++) {
				var element = aControls[iLoopFrom];
				var oFieldData = {
					type: "FormField",
					label: "",
					value: "",
					path: "",
					paths: {},
					displayBehaviour: "",
					expand: "",
					objectStatus: "",
					color: "",
					edmType: "",
                    visiblePath: ""
				};
				var aFieldControls = element.getItems();
				oFieldData.label = aFieldControls[0].getText && aFieldControls[0].getText();
				oFieldData.visiblePath = fnGetVisiblePathForFC(aFieldControls[1]);
				if (aFieldControls[1].getText) {
					oFieldData.path = aFieldControls[1].getBindingPath("text");
					oFieldData.value = aFieldControls[1].getText();
				} else {
					oFieldData.path = aFieldControls[1].getBindingPath("value");
					oFieldData.value = aFieldControls[1].getValue();
				}
				if (isPotentiallySensitive(oFieldData.path, controller)) {
					continue;
				}
				if (isPotentiallyPersonal(oFieldData.path, controller)) {
					continue;
				}
				var data = getEdmType(oFieldData.path, controller);
				oFieldData.edmType = data.sEdmType;
				oFieldData.sapUnit = data.sSapUnit;
				oFieldData.semantic = data.sSemantic;

				// For Value Help
				var oObjectBinding = aFieldControls[1].getObjectBinding && aFieldControls[1].getObjectBinding();
				if (oObjectBinding && oObjectBinding.getPath) {
					oFieldData.expand = aFieldControls[1].getObjectBinding().getPath();
				}

				var oConfiguration = aFieldControls[1].getConfiguration && aFieldControls[1].getConfiguration();
				oFieldData.displayBehaviour = oConfiguration && oConfiguration.getDisplayBehaviour && oConfiguration.getDisplayBehaviour();

				if (aFieldControls[1].getInnerControls) {
					var aInnerControls = aFieldControls[1].getInnerControls();
					if (aInnerControls && aInnerControls.length > 0) {
						for (var i = 0; i < aInnerControls.length; i++) {
							var control = aInnerControls[i];
							var oBinding = control.getBinding("text");
							var oBindingInfo = oBinding && control.getBindingInfo("text");
							if (oBinding && oBindingInfo) {
								var aParts = oBindingInfo.parts;
								if (aParts && aParts.length > 0) {
									for (var j = 0; j < aParts.length; j++) {
										var part = aParts[j];
										if (part.path !== oFieldData.path && part.path !== "__$$SmartFieldNotExistingBindingPath") {
											oFieldData.paths[part.path] = part.path;
										}
									}
								}
							}

							var oBindingState = control.getBinding("state");
							var oBindingInfoOfState = oBindingState && control.getBindingInfo("state");
							if (oBindingState && oBindingInfoOfState) {
								oFieldData.objectStatus = control.getBindingPath("state");
								oFieldData.color = fnGetColorFromAnnotations(oFieldData.objectStatus);
							}

						}
					}
				}
				oFormData.fields.push(oFieldData);
			}
			return oFormData;
		}
	};

	/**
	 * Create Nullish check expression
	 * @param {string} sPath Attribute binding to be evaluated for nullish values
	 * @param {string | undefined} sPath Attribute binding to be evaluated for nullish values
	 * @param {string | undefined} sPath Attribute binding to be evaluated for nullish values
	 * @returns {string} String Nullish check expression
	 */
	var fnGetNullishPathCheckString = function (sPath, sEdmType, sValue) {
		var sNullCheckPath = sPath + " == '' || " + sPath + " == null || " + sPath + " == undefined";
		if (sEdmType === "Edm.Decimal") {
			sNullCheckPath = sNullCheckPath + ' || ' + "formatNumber(float(" + sValue + "), 2) == '0.00'";
		}
		return sNullCheckPath;
	};

	/**
	 * Creates MS accepted conditional binding which will replace nullish resolved binding values ( '', null, undefined ) to -
	 * @param {string} sPath Attribute binding to be evaluated for nullish values 
	 * @returns {string} String MS accepted conditional binding
	 */
	var fnHandleDefaultValueForPath = function (sPath) {
		return fnGetNullishPathCheckString(sPath) + " ? '&minus;' : " + sPath;
	};

	/**
	 * Create generic MS accepted conditional binding based on params passed
	 * @param {string} sDefaultPath Attribute binding to be evaluated for nullish values 
	 * @param {string} sValue Attribute Value binding for path
	 * @param {string | undefined} sFirstParam Attribute parameter binding for the path
	 * @param {string | undefined} sSecondParam Attribute parameter binding for the path
	 * @returns {string} String MS accepted conditional binding
	 */
	var fnHandleValueForPath = function (sDefaultPath, sValue, sFirstParam, sSecondParam) {
		if (sFirstParam && sSecondParam) {
			return sDefaultPath + sValue + " + ' ' + " + "(" + sFirstParam + " ? " + sFirstParam + " : '') + ' ' + (" + fnGetNullishPathCheckString(sSecondParam) + " ? " + "' ' : " + "'(' + " + sSecondParam + " + ')')";
		} else if (sFirstParam) {
			return sDefaultPath + sValue + " + ' ' + (" + fnGetNullishPathCheckString(sFirstParam) + " ? " + "' ' : " + "'(' + " + sFirstParam + " + ')')";
		}
		return "";
	};

	var fnSetPath = function (oField) {
		var aPaths = [];
		if (oField.paths) {
			aPaths = Object.keys(oField.paths).filter(function(oPath) {
				return oPath !== oField.path && oPath.indexOf("##@@") === -1;
			});
		}
		var sValue =  oField.edmType === "Edm.Decimal" ? "formatNumber(float(" + oField.path + "), 2)" : oField.path;
		var sDefaultPathValue = fnHandleDefaultValueForPath(oField.path);
		var sId = null;
		var sDescription = null;
		var sPath;
		var sSapUnitConditionalPath = "";
		if (oField.semantic === oSapSemantics.unitOfMeasure) {
			sSapUnitConditionalPath = "(" + fnGetNullishPathCheckString(oField.sapUnit) + ")" + ' ? ' + sValue + " + ' ' + '&minus;' : " + "";
		} else if (oField.semantic === oSapSemantics.currencyCode) {
			sSapUnitConditionalPath = "(" + fnGetNullishPathCheckString(oField.sapUnit) + ")" + ' ? ' + " '&minus;' : " + "";
		}
		if (aPaths.length > 1) {
			var aDescriptionText = aPaths.filter(function(oPath) {
				return oPath.endsWith("_Text");
			});
			var aID = aPaths.filter(function(oPath) {
				return !oPath.endsWith("_Text");
			});
			if (aDescriptionText && aDescriptionText.length > 0) {
				sDescription = aDescriptionText[0];
			}
			if (aID && aID.length > 0){
				sId = aID[0];
			}
		} else if (aPaths.length > 0) {
			sDescription = aPaths[0];
		}
		
		if (oField.displayBehaviour) {
			switch (oField.displayBehaviour) {
				case "descriptionAndId": 
					if (sId && sDescription) {
						sPath = fnHandleValueForPath(sSapUnitConditionalPath, sValue, sDescription, sId);
					} else if (sId && !sDescription) {
						sPath = fnHandleValueForPath(sSapUnitConditionalPath, sValue, sId);
					} else if (sDescription && !sId) {
						sPath = sSapUnitConditionalPath + " (" + fnGetNullishPathCheckString(sValue) + " ? (" + fnHandleDefaultValueForPath(sDescription) + ") : (" + sDescription + " + ' ' + " +  "' (' + " + sValue + " + ')'" + "))";
					} else {
						sPath = sDefaultPathValue;
					}
					break;
				case "descriptionOnly":
					sPath = fnHandleDefaultValueForPath(sDescription);
					break;
				case "idAndDescription":
					if (sId && sDescription) {
						sPath = fnHandleValueForPath(sSapUnitConditionalPath, sValue, sId, sDescription);
					} else if (sId && !sDescription) {
						sPath = sSapUnitConditionalPath + sValue + " + ' ' + (" + sId + " ? " + sId + " : '')";
					} else if (!sId && sDescription) {
						sPath = fnHandleValueForPath(sSapUnitConditionalPath, sValue, sDescription);
					} else {
						sPath = sDefaultPathValue;
					}
					break;
				case "idOnly":
					sPath = sDefaultPathValue || sId;
					break;
				default:
					sPath = sDefaultPathValue;
					break;
			}
		} else {
			sPath = sDefaultPathValue;
		}
		sPath = sPath && sPath.indexOf('/') > -1 ? sPath.replaceAll('/', '.') : sPath;
		return "${" + sPath + "}";
	};

	var getWebUrl = function() {
		var oOwnerComponent = oConfig.component;
		var oAppComponent = oOwnerComponent.getAppComponent();
		var oAppManifest = oAppComponent.getManifestEntry("sap.app");
		var oComponentContainer = oOwnerComponent.getComponentContainer();
		var oElementBinding = oComponentContainer.getElementBinding();
		var oUrl = new URL(oConfig.url);
		var sServiceUrl = oUrl.origin + oAppManifest.dataSources.mainService.uri;
		var sElementBindingPath = oElementBinding.sPath;
		if (oAppManifest.dataSources.mainService.uri.endsWith("/") && sElementBindingPath.startsWith("/")) {
			sElementBindingPath = sElementBindingPath.substring(1, sElementBindingPath.length);
		}
		var sContextUrl = oUrl.origin + oAppManifest.dataSources.mainService.uri + sElementBindingPath + (oElementBinding.mParameters.expand ? "?$expand=" + encodeURIComponent(oElementBinding.mParameters.expand) : ""); 
		return {
			serviceUrl: sServiceUrl,
			contextUrl: sContextUrl
		};
	};

	var fnGenerateAdaptiveCard = function () {

		var oFormHeading = {
            "type": "TextBlock",
            "size": "Small",
            "weight": "Bolder",
            "text": "${form1}",
            "maxLines": 2,
            "wrap": true,
            "spacing": "Medium"
        };

		var oFormFieldHeader = {
			"type": "TextBlock",
			"size": "Small",
			"text": "${field1}",
			"maxLines": 1,
			"color": "Default",
			"weight": "Default",
			"wrap": false,
			"isSubtle": true
		};

		var oFormFieldValue = {
			"type": "TextBlock",
			"size": "Small",
			"text": "${field1desc}",
			"maxLines": 2,
			"wrap": true,
			"color": "Default"
		};

		var oColumSet = {
            "type": "ColumnSet",
            "columns": []
		};

		var oColumn = {
			"type": "Column",
			"items": [],
			"verticalContentAlignment": "Top",
			"width": 1
		};

		var oActionSet = {
			"type": "ActionSet",
            "actions": []
		};

		var oShowCard = {
			"type": "Action.ShowCard",
			"title": "",
			"style": "default",
			"card": {
				"type": "AdaptiveCard",
				"body": [
				],
				"actions": [
					{
						"type": "Action.Execute",
						"verb": "",
						"style": "positive",
						"title": "OK",
						"data": {
							"serviceURI": "",
							"contextURL": "",
							"actionParams": {
								"keys": [

								]
							},
							"isConfirmationRequired": false
						}
					}
				],
				"$schema": "http://adaptivecards.io/schemas/adaptive-card.json"
			}
		};

		var oInputText = {
			"type": "Input.Text",
			"id": "",
			"isMultiline": false,
			"isRequired": true,
			"label": ""
		};

		var oInputDateTime = {
			"type": "Input.Date",
			"id": "",
			"isRequired": true,
			"label": ""
		};

		var oAdaptiveCardJSON = {
			"type": "AdaptiveCard",
			"metadata": {
				"webUrl": getWebUrl().contextUrl
			},
			"msTeams": {
				"width": "full"
			},
			"body": [
				{
					"type": "ColumnSet",
					"columns": [
						{
							"type": "Column",
							"items": [
								{
									"type": "TextBlock",
									"size": "Medium",
									"weight": "Bolder",
									"text": oConfig.appTitle,
									"maxLines": 3
								},
								{
									"type": "TextBlock",
									"size": "Default",
									"weight": "Bolder",
									"text": "[" + oConfig.objectTitle + "](" + oConfig.url + ")",
									"maxLines": 1,
									"spacing": "None"
								},
								{
									"type": "TextBlock",
									"size": "Default",
									"text": oConfig.objectSubtitle,
									"maxLines": 1,
									"spacing": "None"
								}
							],
							"verticalContentAlignment": "Top",
							"width": "auto"
						}
					]
				}
			],
			"$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
			"version": "1.4"
		};

		if (aVisibleItemsData && aVisibleItemsData.length > 0){
			var oDataPointColumnSet;
			aVisibleItemsData.forEach(function(element) {
				var oFormTitleClone;
				var oFormFieldValueClone;
				var oFormFieldHeaderClone;
				var oColumnClone;
				if (element.type !== "DataPoint") {
					if (oDataPointColumnSet) {
						oAdaptiveCardJSON.body.push(oDataPointColumnSet);
					}
					oDataPointColumnSet = undefined;
				}
				switch (element.type) {
					case "Form":
						if (element.header && element.header.length > 0) {
							oFormTitleClone = deepClone(oFormHeading);
							oFormTitleClone.text = element.header;
							oAdaptiveCardJSON.body.push(oFormTitleClone);
						}
						var aFields = element.fields;
						var iTotalColums = Math.ceil(aFields.length / iMaxColumns);
						for (var i = 1; i <= iTotalColums; i++) {
							var iLoopEnd = i * iMaxColumns;
							var iLoopStart = iLoopEnd - iMaxColumns;
							var oColumnSetClone = deepClone(oColumSet);
							for (var j = iLoopStart; (j < iLoopEnd); j++) {
								var oField = aFields[j];
								oColumnClone = deepClone(oColumn);
								if (!oField) {
									oColumnSetClone.columns.push(oColumnClone);
									continue;
								}
								if (oField.label) {
									// console.log(oField);
									oFormFieldHeaderClone = deepClone(oFormFieldHeader);
									oFormFieldHeaderClone.text = oField.label;
									oColumnClone.items.push(oFormFieldHeaderClone);
									oFormFieldValueClone = deepClone(oFormFieldValue);
									oFormFieldValueClone.text = fnSetPath(oField);
									oFormFieldValueClone.color = oField.color ? oField.color : "Default";
									oColumnClone.items.push(oFormFieldValueClone);
									oColumnClone["$when"] = oField.visiblePath;
									oColumnSetClone.columns.push(oColumnClone);
								}
							}
							oAdaptiveCardJSON.body.push(oColumnSetClone);
						}
						break;
					case "PlainTextVBox":
						if (element.label) {
							oFormTitleClone = deepClone(oFormHeading);
							oFormTitleClone.text = element.label;
							oAdaptiveCardJSON.body.push(oFormTitleClone);
							oFormFieldValueClone = deepClone(oFormFieldValue);
							oFormFieldValueClone.text = fnSetPath(element);
							oAdaptiveCardJSON.body.push(oFormFieldValueClone);
							oFormTitleClone["$when"] = element.visiblePath;
							oFormFieldValueClone["$when"] = element.visiblePath;
						}
						break;
					case "DataPoint":
						if (!oDataPointColumnSet) {
							oDataPointColumnSet = deepClone(oColumSet);
						}
						if (element.label) {
							oColumnClone = deepClone(oColumn);
							oFormTitleClone = deepClone(oFormHeading);
							oFormTitleClone.text = element.label;
							oColumnClone.items.push(oFormTitleClone);
							oFormFieldValueClone = deepClone(oFormFieldValue);
							oFormFieldValueClone.text = fnSetPath(element);
							oFormFieldValueClone.color = element.color ? element.color : "Default";
							oColumnClone.items.push(oFormFieldValueClone);
							oColumnClone["$when"] = element.visiblePath;
							oDataPointColumnSet.columns.push(oColumnClone);
						}
						break;
					default:
						break;
				}
				if (oDataPointColumnSet && oDataPointColumnSet.columns.length === 3) {
					oAdaptiveCardJSON.body.push(oDataPointColumnSet);
					oDataPointColumnSet = undefined;
				}
			});
			if (oDataPointColumnSet) {
				oAdaptiveCardJSON.body.push(oDataPointColumnSet);
				oDataPointColumnSet = undefined;
			}
		}

		// Actions
		if (aActions.length > 0) {
			aActions.sort(function (action1, action2) {
				var importanceMap = {
					'com.sap.vocabularies.UI.v1.ImportanceType/High': 1,
					'com.sap.vocabularies.UI.v1.ImportanceType/Medium': 2
				};
				var iAction1Importance = importanceMap[action1.importance] || 3;
				var iAction2Importance = importanceMap[action2.importance] || 3;
				return iAction1Importance - iAction2Importance;
			});
			var oActionSetClone = deepClone(oActionSet);
			var iActionsAdded = 0;
			for (var i = 0; i < aActions.length; i++) {
				if (iActionsAdded === 2) {
					break;
				}
				var functionImportAction = aActions[i];
				var oShowCardClone = deepClone(oShowCard);
				if (functionImportAction.parameter && functionImportAction.parameter.additionalParameters && functionImportAction.parameter.additionalParameters.length > 0) {
					var aAdditionalParameter = functionImportAction.parameter.additionalParameters;
					for (var j = 0; j < aAdditionalParameter.length; j++) {
						var parameter = aAdditionalParameter[j];
						if (parameter.type === "Edm.String") {
							var oInputTextClone = deepClone(oInputText);
							oInputTextClone.label = parameter.name;
							oInputTextClone.id = parameter.name;
							oInputTextClone.isRequired = parameter.nullable === "true"; 
							oShowCardClone.card.body.push(oInputTextClone);
						} else if (parameter.type === "Edm.DateTime") {
							var oInputDateTimeClone = deepClone(oInputDateTime);
							oInputDateTimeClone.label = parameter.name;
							oInputDateTimeClone.id = parameter.name;
							oInputDateTimeClone.isRequired = parameter.nullable === "true"; 
							oShowCardClone.card.body.push(oInputDateTimeClone);
						}
					}
				}
				oShowCardClone.title = functionImportAction.label;
				oShowCardClone.card.actions[0].verb = functionImportAction.action;
				oShowCardClone.card.actions[0].data.serviceURI = getWebUrl().serviceUrl;
				oShowCardClone.card.actions[0].data.contextURL = getWebUrl().contextUrl;
				oShowCardClone.card.actions[0].data.isConfirmationRequired = functionImportAction.critical;
				if (functionImportAction.parameter.parameterData) {
					var aParameterDataKeys = Object.keys(functionImportAction.parameter.parameterData);
					for (var k = 0; k < aParameterDataKeys.length; k++) {
						var key = aParameterDataKeys[k];
						if (oShowCardClone.card.actions[0].data.actionParams.keys.indexOf(key) === -1) {
							oShowCardClone.card.actions[0].data.actionParams.keys.push(key);
						}
					}
				}
				var oActionButton = oShowCardClone;
				// The showcard body is blank, indicating that no input is necessary, and Action.Execute will be displayed directly.
				if (oShowCardClone.card.body.length === 0) {
					oShowCardClone.card.actions[0].title = oShowCardClone.title;
					oActionButton = oShowCardClone.card.actions[0];
				}

				var sVisiblePaths = (functionImportAction.hiddenPath ? functionImportAction.hiddenPath : true) +
					" && " +
					(functionImportAction.applicablePath ? functionImportAction.applicablePath : true);

				oActionButton["$when"] = "${" + sVisiblePaths + "}";
				// Checking if there is stylePath
				if (functionImportAction.stylePath.length > 0) {
					// adding positive button
					oActionButton["$when"] = "${" + sVisiblePaths + " && (" + functionImportAction.stylePath + " == '3' || " + functionImportAction.stylePath + " == 'UI.CriticalityType/Positive')}";
					oActionButton.style = "positive";
					oActionSetClone.actions.push(oActionButton);

					// adding negative button
					var oActionButtonCloneNegative = deepClone(oActionButton);
					oActionButtonCloneNegative["$when"] = "${" + sVisiblePaths + " && (" + functionImportAction.stylePath + " == '1' || " + functionImportAction.stylePath + " == 'UI.CriticalityType/Negative')}";
					oActionButtonCloneNegative.style = "destructive";
					oActionSetClone.actions.push(oActionButtonCloneNegative);
					iActionsAdded++;
				} else if (functionImportAction.styleValue.length > 0) {
					oActionButton.style = functionImportAction.styleValue;
					oActionSetClone.actions.push(oActionButton);
					iActionsAdded++;
				} else {
					oActionSetClone.actions.push(oActionButton);
					iActionsAdded++;
				}
				
			}
			oAdaptiveCardJSON.body.push(oActionSetClone);
		}

		//console.log(oAdaptiveCardJSON);
		return oAdaptiveCardJSON;
	};

	var fnGetVisibleHeaderData = function () {
		var oComponent = oConfig.component;
		var oController = oConfig.controller;
		var oHeaderContent = oController.byId("objectPage-OPHeaderContent");
		var isDynamicHeader = oComponent.getAppComponent().getObjectPageHeaderType() === "Dynamic";
		if (isDynamicHeader) {
			if (oHeaderContent && oHeaderContent.getContent()) {
				var aContent = oHeaderContent.getContent();
				var aVisibleContent = [];
				aContent.forEach(function (oItem) {
					if (oItem.getId().endsWith("DynamicHeaderContentFlexBox")) {
						// Check if item is DynamicHeaderContentFlexBox then adds items of it to aVisibleContent
						var aDynamicHeaderItems = oItem.getItems();
						aDynamicHeaderItems.forEach(function (oDynamicItem) {
							aVisibleContent.push(oDynamicItem);
						});
					} else {
						// Add other items (if present) to the aVisibleContent.
						aVisibleContent.push(oItem);
					}
				});
				aVisibleContent.forEach(function (oVisibleItem) {
					var oData;
					if (oVisibleItem.getId().endsWith("DataPoint")) {
						oData = fnExtractDataFromDataPoint(oVisibleItem, oController);
					} else if (oVisibleItem.getId().endsWith("PlainTextVBox")) {
						oData = fnExtractDataFromPlainTextVBox(oVisibleItem, oController);
					} else if (oVisibleItem.getId().endsWith("Form")) {
						oData = fnExtractDataFromForm(oVisibleItem, oController);
					}
					if (oData) {
						aVisibleItemsData.push(oData);
					}
				});
				// console.log("aVisibleContent", aVisibleContent);
				// console.log("aVisibleItemsData", aVisibleItemsData);
			}
		}
	};

	var getPropertyKeys = function(oEntityType) {
		var oKeyMap = {};

		if (oEntityType && oEntityType.key && oEntityType.key.propertyRef) {
			for (var i = 0; i < oEntityType.key.propertyRef.length; i++) {
				var sKeyName = oEntityType.key.propertyRef[i].name;
				oKeyMap[sKeyName] = true;
			}
		}
		return oKeyMap;
	};

	var addParameterLabel = function (oParameter, oEntityType, oMetaModel) {
		if (oEntityType && oParameter && !oParameter["com.sap.vocabularies.Common.v1.Label"]) {

			var oProperty = oMetaModel.getODataProperty(oEntityType, oParameter.name, false);
			if (oProperty && oProperty["com.sap.vocabularies.Common.v1.Label"]) {
				// copy label from property to parameter with same name as default if no label is set for function import parameter
				oParameter["com.sap.vocabularies.Common.v1.Label"] = oProperty["com.sap.vocabularies.Common.v1.Label"];
			}
		}
	};

	var isActionCritical = function (oFunctionImport) {
		var oCritical = oFunctionImport["com.sap.vocabularies.Common.v1.IsActionCritical"];

		if (!oCritical) {
			return false;
		}
		if (oCritical.Bool === undefined) {
			return true;
		}

		var oParameterValue = oCritical.Bool;

		if (typeof oParameterValue === "string") {
			var oActionValue = oParameterValue.toLowerCase();
			return !(oActionValue == "false" || oActionValue == "" || oActionValue == " ");
		}

		return !!oParameterValue;
	};

	var fnGetActionFromAnnotations = function () {
		var oController = oConfig.controller;
		var sI18nKeyForLabel;
		aActions = [];
		var oComponent = oConfig.component;
		var sEntitySet = oComponent.getEntitySet();
		var model = oComponent.getModel();
		var oAppi18nModel = oController.getView().getModel("@i18n").getResourceBundle();
		var oi18nModel = oController.getView().getModel("i18n").getResourceBundle();
		var sCopyLabel = oi18nModel.getText("COPY");
		var oMetaModel = model.getMetaModel();
		var oEntitySet = oMetaModel.getODataEntitySet(sEntitySet);
		var oEntityType = oMetaModel.getODataEntityType(oEntitySet.entityType);
		var aKeys = Object.keys(oEntityType);
		var aTargetAnnotation = aKeys.filter(function (sKey) {
			return sKey === "com.sap.vocabularies.UI.v1.Identification";
		});
		if (aTargetAnnotation.length > 0) {
			var aDataFields = oEntityType["com.sap.vocabularies.UI.v1.Identification"];
			for (var i = 0; i < aDataFields.length; i++) {
				var sActionlabel = aDataFields[i].Label && aDataFields[i].Label.String;
				if (sActionlabel) {
					sI18nKeyForLabel = sActionlabel.indexOf("i18n>") > 1 ? sActionlabel.split("i18n>")[1].replace("}", "") : "";
					if (sI18nKeyForLabel !== "") {
						sActionlabel = oAppi18nModel.getText(sI18nKeyForLabel);
					}
				}
				if (sActionlabel && sActionlabel.toUpperCase().indexOf(sCopyLabel.toUpperCase()) > -1) {
					continue;
				}
				if (aDataFields[i].RecordType === "com.sap.vocabularies.UI.v1.DataFieldForAction") {
					var sHiddenPath;
					if (aDataFields[i]["com.sap.vocabularies.UI.v1.Hidden"]) {
						if (aDataFields[i]["com.sap.vocabularies.UI.v1.Hidden"]["Bool"]) {
							var oHiddenAnnotationValue = aDataFields[i]["com.sap.vocabularies.UI.v1.Hidden"]["Bool"];
							if (typeof oHiddenAnnotationValue === "string") {
								var sHiddenValue = oHiddenAnnotationValue.toLowerCase();
								var isHidden = !(sHiddenValue == "false" || sHiddenValue == "" || sHiddenValue == " ");
								if (isHidden) {
									continue;
								}
							}
						} else if (aDataFields[i]["com.sap.vocabularies.UI.v1.Hidden"]["Path"]) {
							sHiddenPath = aDataFields[i]["com.sap.vocabularies.UI.v1.Hidden"]["Path"];
						} else {
							continue;
						}
					}

					// Action from the Footer will be excluded based on Determining property
					if (aDataFields[i]["Determining"]) {
						if (aDataFields[i]["Determining"]["Bool"]) {
							var oDeterminingAnnotationValue = aDataFields[i]["Determining"]["Bool"];
							if (typeof oDeterminingAnnotationValue === "string") {
								var sDeterminingValue = oDeterminingAnnotationValue.toLowerCase();
								var bIsDetermining = !(sDeterminingValue == "false" || sDeterminingValue == "" || sDeterminingValue == " ");
								if (bIsDetermining) {
									continue;
								}
							}
						} else {
							continue;
						}
					}
					var stylePath = "";
					var styleValue = "";
					if (aDataFields[i]["Criticality"]) {
						if (aDataFields[i]["Criticality"]["EnumMember"]) {
							var oCriticalityEnumValue = aDataFields[i]["Criticality"]["EnumMember"];
							if (oCriticalityEnumValue === "com.sap.vocabularies.UI.v1.CriticalityType/Negative" || oCriticalityEnumValue === "1") {
								styleValue = "destructive";
							} else {
								styleValue = "positive";
							}
						} else if (aDataFields[i]["Criticality"]["Path"]) {
							var path = aDataFields[i]["Criticality"]["Path"];
							if (path && path.length > 0) {
								path = path.replaceAll("/", ".");
								stylePath = path;
							}
						}
					}

					// isCopyAction to exclude
					if (aDataFields[i]["com.sap.vocabularies.UI.v1.IsCopyAction"]) {
						if (aDataFields[i]["com.sap.vocabularies.UI.v1.IsCopyAction"]["Bool"]) {
							var oIsCopyActionValue = aDataFields[i]["com.sap.vocabularies.UI.v1.IsCopyAction"]["Bool"];
							if (typeof oIsCopyActionValue === "string") {
								var sCopyValue = oIsCopyActionValue.toLowerCase();
								var bIsCopyAction = !(sCopyValue == "false" || sCopyValue == "" || sCopyValue == " ");
								if (bIsCopyAction) {
									continue;
								}
							}
						} else {
							continue;
						}
					}
					var sFunctionName = aDataFields[i].Action.String.split("/")[1];
					var oFunctionImport = oMetaModel.getODataFunctionImport(sFunctionName);
					var oContextObject = oController.getView().getBindingContext().getObject();
					var oKeyProperties = getPropertyKeys(oEntityType);
					var oParameterValue;
					var oSkipProperties = {};
					var mActionParams = {
						parameterData: {},
						additionalParameters: []
					};

					if (oFunctionImport.parameter) {
						for (var j = 0; j < oFunctionImport.parameter.length; j++) {
							var oParameter = oFunctionImport.parameter[j];
							addParameterLabel(oParameter, oEntityType, oMetaModel);

							var sParameterName = oParameter.name;
							var bIsKey = !!oKeyProperties[sParameterName];
							oParameterValue = undefined;

							if (oContextObject && oContextObject.hasOwnProperty(sParameterName)) {
								oParameterValue = oContextObject[sParameterName];
							} else if (bIsKey && oContextObject && oFunctionImport["sap:action-for"]) {
								// parameter is key but not part of the current projection - raise error
								Log.error("Key parameter of action not found in current context: " + sParameterName);
								throw new Error("Key parameter of action not found in current context: " + sParameterName);
							}

							mActionParams.parameterData[sParameterName] = oParameterValue;

							var skip = !!oSkipProperties[sParameterName];
							if (!skip && (!bIsKey || !oFunctionImport["sap:action-for"]) && oParameter.mode.toUpperCase() == "IN") {
								// offer as optional parameter with default value from context
								mActionParams.additionalParameters.push(oParameter);
							}

						}
					}

					var oAction = {
						type: "Action",
						label: sActionlabel,
						action: sFunctionName,
						parameter: mActionParams,
						critical: isActionCritical(oFunctionImport),
						rawFunctionImport: oFunctionImport,
						stylePath: stylePath,
						styleValue: styleValue,
						hiddenPath: sHiddenPath,
						applicablePath: oFunctionImport["sap:applicable-path"],
						importance: aDataFields[i]["com.sap.vocabularies.UI.v1.Importance"] ? aDataFields[i]["com.sap.vocabularies.UI.v1.Importance"]["EnumMember"] : "com.sap.vocabularies.UI.v1.ImportanceType/Low"
					};
					aActions.push(oAction);
				}
			}
		}
		// console.log(aActions);
	};

	var fnCreateManifestHeaderInfo = function () {
		fnGetVisibleHeaderData();
		fnGetActionFromAnnotations();
		return fnGenerateAdaptiveCard();
	};

	AdaptiveCardHelper.createAdaptiveCard = function (type, config) {
		aVisibleItemsData = [];
		var oAdaptiveCardJson;
		oConfig = config;
		switch (type) {
			case "HeaderInfo":
				oAdaptiveCardJson = fnCreateManifestHeaderInfo();
				break;
			default:
				break;
		}
		return oAdaptiveCardJson;
	};

	return AdaptiveCardHelper;
});
