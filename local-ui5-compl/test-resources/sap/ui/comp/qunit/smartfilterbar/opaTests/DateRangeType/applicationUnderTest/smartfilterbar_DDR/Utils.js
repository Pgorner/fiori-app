sap.ui.define([
	"sap/base/i18n/Formatting",
	"sap/ui/core/Locale",
	"sap/ui/core/routing/HashChanger",
	"sap/ui/model/resource/ResourceModel"
], function(Formatting, Locale, HashChanger, ResourceModel) {
	"use strict";

	// create a new class
	var Utils = function(){
		//nothing
	};


	Utils.prototype.getBundle = function(sLocale,
										 sRootPath) {

		// get the i18n model and its ResourceModel
		var oi18nLibModel = new ResourceModel({
			bundleName: "applicationUnderTest.smartfilterbar_DDR.i18n.i18n",
			bundleLocale: new Locale(Formatting.getLanguageTag())
		});

		var oBundle = oi18nLibModel.getResourceBundle();

		return oBundle;

		// OLD coding before App Descriptor migration

//		var iIndex = sRootPath.indexOf("/ui5_ui5/");
//		var oBundle;
//
//		if (iIndex !== -1) {
//			// get the properties file for library in the BSP context
//
//			var sPath = window.location.pathname.slice(0, iIndex + 8);
//			sPath += "/sap/FICA_GENTOOLSS1/";
//
//			oBundle = ResourceBundle.create({
//				url : sPath + "sap/cus/o2c/lib/gentools/s1/i18n/i18n.properties",
//				locale : sLocale
//			});
//
//		} else {
//
//			var sUrl = sRootPath + "resources/sap/cus/o2c/lib/gentools/s1/i18n/i18n.properties";
//
//			//adopt sUrl if it runs in the local sandbox
//			if( sRootPath.indexOf("test-resources/sap/ushell/shells/sandbox/fioriSandbox.html") > 0) {
//
//				sUrl = sRootPath.substring(0,sRootPath.indexOf("test-resources/sap/ushell/shells/sandbox/fioriSandbox.html"))
//								+ "resources/sap/cus/o2c/lib/gentools/s1/i18n/i18n.properties";
//			}
//
//			var oObj = {
//				url : sUrl,
//				locale : sLocale
//			};
//
//			oBundle = ResourceBundle.create(oObj);
//
//		}
//
//		return oBundle;

	};

	Utils.prototype.findKeyInArray = function(sKey,
											  oArray) {
		var position = -1; // default value not found

		for (var i = 0; i < oArray.length; i++) {
			var tempKey = oArray[i].key;
			if (tempKey === undefined) {
				tempKey = oArray[i].getKey();
			}
			if (tempKey === sKey) {
				position = oArray[i];
			}
		}

		if (position >= 0) {
			return true;
		} else {
			return false;
		}
	};

	/**
	 * Adds the filters for semantic date ranges to the url for a request
	 * @public
	 * @param {sap.ui.comp.smartfilterbar.SmartFilterBar} oSmartFilterBar
	 * @param {array} aFieldNamesForSemanticControls - ["originalGlobalFieldName"]
	 * @returns {array} Array of Conditions
	 */
	Utils.prototype.getConditionsForSemanticFilters = function(oSmartFilterBar, aFieldNamesForSemanticControls){

		var aResult = [];

		if (!oSmartFilterBar || !oSmartFilterBar.isInitialised() || !aFieldNamesForSemanticControls) {
			return aResult;
		}

		for (var i = 0; i < aFieldNamesForSemanticControls.length; i++) {
			var oConditionType = oSmartFilterBar.getConditionTypeByKey(aFieldNamesForSemanticControls[i]);
			if (oConditionType) {
				var oCondition = oConditionType.getCondition();
				if (oCondition.value1){
					aResult.push(oCondition);
				}
			}
		}

		return aResult;

	};

	/**
	 * @public
	 * @returns {object} object with parameters of targetURL
	 */
	Utils.prototype.getTargetUrlParam = function() {
		// read settings from corresponding service/Target_URL from tile
		var oHashChanger = new HashChanger();
		/*global unescape */
		var targetUrl = unescape(oHashChanger.getHash());
		var pieces = {};
		var params = {};
		pieces = targetUrl.split("?");
		var piecesCount = pieces.length;

		var oResult = {};

		if (piecesCount > 1 && pieces[piecesCount - 1] !== undefined) {
			params = pieces[piecesCount - 1].split("&");

			var paramTupel = null;
			var paramValue = null;
			var arrayValue = null;
			for (var i = 0; i < params.length; i++) {
				paramTupel = params[i].split("=");
				if (paramTupel.length < 2) {
					continue;
				}
				paramValue = paramTupel[1].split("'");
				if (paramValue.length < 2) {
					continue;
				}
				switch (paramTupel[0]) {

					// currency
					case "DisplayCurrency":
					case "numberUnit":
						oResult.waers = paramValue[1];
						break;

					// company code (always as array)
					case "BUKRS":
					case "bukrs":
						oResult.bukrs = [];

						// check for multiple bukrs values
						arrayValue = paramValue[1].split(";");
						if (arrayValue.length < 2) {
							if (paramValue[1].length > 0) {
								oResult.bukrs.push(paramValue[1]);
							}
						} else {
							for (var j in arrayValue) {
								oResult.bukrs.push(arrayValue[j]);
							}
						}
						break;

					case "CompanyCode":
						if (typeof oResult.bukrs !== 'undefined' && oResult.bukrs.length === 0) {
							oResult.bukrs = [];

							// check for multiple bukrs values
							arrayValue = paramValue[1].split(";");
							if (arrayValue.length < 2) {
								if (paramValue[1].length > 0) {
									oResult.bukrs.push(paramValue[1]);
								}
							} else {
								for (var j in arrayValue) {
									oResult.bukrs.push(arrayValue[j]);
								}
							}
						}
						break;

					// contract account category (always array)
					case "VKTYP":
						oResult.vktyp = [];

						// check for multiple bukrs values
						arrayValue = paramValue[1].split(";");
						if (arrayValue.length < 2) {
							if (paramValue[1].length > 0) {
								oResult.vktyp.push(paramValue[1]);
							}
						} else {
							for (var j in arrayValue) {
								oResult.vktyp.push(arrayValue[j]);
							}
						}
						break;

					case "ContractAccountCategory":
						if (typeof oResult.vktyp !== "undefined" && oResult.vktyp.length === 0) {
							oResult.vktyp = [];

							// check for multiple bukrs values
							arrayValue = paramValue[1].split(";");
							if (arrayValue.length < 2) {
								if (paramValue[1].length > 0) {
									oResult.vktyp.push(paramValue[1]);
								}
							} else {
								for (var j in arrayValue) {
									oResult.vktyp.push(arrayValue[j]);
								}
							}
						}
						break;

					// number of intervals
					case "numberOfBars":
					case "intervalNumber":
						oResult.intervalNumber = parseInt(paramValue[1]);
						break;

					// number of units (days, weeks, months, ...) per bar / column
					case "widthBars":
					case "intervalWidth":
						oResult.intervalWidth = parseInt(paramValue[1]);
						break;

					// time unit, e.g. M=month, W=week
					case "widthUnit":
					case "intervalUnit":
						oResult.intervalUnit = paramValue[1];
						// in wave 6 Overdue used lowercase keys
						// for alignment with writeoff (as reuse library
						// is used) it is switched to uppercase
						// therefore convert to remain compatible with
						// older tiles using lowercase encoding
						oResult.intervalUnit.toUpperCase();
						break;

					// threshold for warning in tile
					case "threshold1":
						oResult.thresholdWarning = paramValue[1];
						break;

					// threshold for alert in tile
					case "threshold2":
						oResult.thresholdAlert = paramValue[1];
						break;

					// more data needed
					case "AdditionalDataRequested":
						oResult.more = paramValue[1];
						break;

					// dynamic fallback for all other parameters
					// parameter-name is used as key for result object
					// (array on demand)

					default:
						// check for multiple bukrs values
						arrayValue = paramValue[1].split(";");
						if (arrayValue.length < 2) {
							if (paramValue[1].length > 0) {
								oResult[paramTupel[0]] = paramValue[1];
							}
						} else {
							oResult[paramTupel[0]] = [];
							for (var j in arrayValue) {
								oResult[paramTupel[0]].push(arrayValue[j]);
							}
						}
						break;
				}
			}
		}

		return oResult;
	};


	return Utils;

});
