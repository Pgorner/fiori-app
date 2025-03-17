//.../S4-FIORI-CORE-5/icd.discreteindustries.jiscall.manages1/blob/main/webapp/ext/controller/HourRangeType.js
//.../S4-FIORI-CORE-5/icd.discreteindustries.jitgoodsreceipt.posts1/blob/main/webapp/ext/controller/HourRangeType.js
//.../S4-FIORI-CORE-5/icd.discreteindustries.transferstockforjitsupplytoproduction/blob/main/webapp/ext/controller/HourRangeType.js
//.../S4-FIORI-CORE-5/icd.discreteindustries.transferstockforjitsupplytoproduction/blob/main/webapp/ext/controller/HourRangeType.js
//.../S4-FIORI-CORE-5/icd.discreteindustries.releasesequencedjitcallstoproduction/blob/main/webapp/ext/controller/HourRangeType.js
//.../S4-FIORI-CORE-5/icd.discreteindustries.stockavailabilityanalysis/blob/main/webapp/ext/controller/HourRangeType.js
//.../S4-FIORI-CORE-5/icd.discreteindustries.releasesummarizedjitcallstoproduction/blob/main/webapp/ext/controller/HourRangeType.js
//.../S4-FIORI-CORE-5/icd.discreteindustries.createoutbounddeliveryfromjitcall/blob/main/webapp/ext/controller/HourRangeType.js
//.../S4-FIORI-CORE-5/icd.discreteindustries.createoutbounddeliveryfromseqjitcall/blob/main/webapp/ext/controller/HourRangeType.js
//.../S4-FIORI-CORE-5/icd.discreteindustries.confirmproductionofcomponentgroups/blob/main/webapp/ext/controller/HourRangeType.js
//.../S4-FIORI-CORE-5/icd.discreteindustries.jitcomponents.monitors1/blob/main/webapp/ext/controller/HourRangeType.js
//.../S4-FIORI-CORE-5/icd.discreteindustries.jitcomponentgroups.monitors1/blob/main/webapp/ext/controller/HourRangeType.js


sap.ui.define(["sap/ui/comp/config/condition/DateRangeType", "sap/ui/core/date/UniversalDate",
		"sap/ui/comp/config/condition/Type", "sap/m/Text",
		"./ResourceModel"
	],
	function (DateRangeType, UniversalDate, Type, Text, ResourceModel) {
		"use strict";
		/**
		 * The HourRangeType is the implementation of a customized ConditionType for providing
		 * Hour ranges based on hours as filter criteria. It is used in the ControlConfiguration of the SmartFilterBar.
		 *
		 * @extends sap.ui.comp.config.condition.DateRangeType
		 * @constructor
		 *
		 * @public
		 */
		var HourRangeType = DateRangeType.extend("Test9", {
			constructor: function (sFieldName, oFilterProvider, oFieldViewMetadata) {
				DateRangeType.apply(this, [
					sFieldName, oFilterProvider, oFieldViewMetadata
				]);
			}
		});
		/**
		 * Returns the final list of available operations. After adding the custom operations.
		 * @returns {array} Final list of Available operations
		 *
		 * @protected
		 */
		HourRangeType.prototype.getOperations = function () {
			var aOperations = DateRangeType.prototype.getOperations.apply(this, []);
			aOperations = aOperations.filter(function (oCurrentItem) {
				if (oCurrentItem.key !== "TO") {
					return oCurrentItem;
				}
			}, this);
			if (aOperations instanceof Array) {
				["NEXT30MINUTES", "NEXTHOUR", "NEXT2HOURS", "NEXTXHOURS", "CLEARDATE"].map(function (sID, iIndex) {
					var oHourOperation = {
						key: sID,
						textKey: {
							key: sID,
							bundle: "applicationUnderTest.smartfilterbar_DDR.i18n"
						},
						order: 100,
						value1: null,
						type: "int",
						defaultValues: iIndex === 0 ? [30] : [iIndex],
						category: "FIXED.HOUR",
						onItemSelected: DateRangeType._IntOnItemSelected,
						onChange: DateRangeType._defaultOnChangeHandler,
						getControls: this.ControlFactory,
						descriptionTextKeys: [
							["CONDITION_DATERANGETYPE_SINGLE_HOUR", "CONDITION_DATERANGETYPE_MULTIPLE_HOURS"][iIndex]
						]
					};
					if (iIndex === 3) {
						oHourOperation.defaultValues = [1];
						oHourOperation.singularTextKey = {
							key: "NEXTHOUR",
							bundle: "sap.ui.comp.sample.smartcontrols.i18n"
						};
						// oHourOperation.descriptionTextKeys = ["CONDITION_DATERANGETYPE_SINGLE_HOUR", "CONDITION_DATERANGETYPE_MULTIPLE_HOURS"];
						oHourOperation.category = "DYNAMIC.HOUR";
						oHourOperation.filterSuggestItem = DateRangeType._IntFilterSuggestItem;
					}
					if (iIndex === 4) {
						oHourOperation.defaultValues = [""];
					}
					aOperations.push(oHourOperation);
				}, this);
			}
			return aOperations;
		};
		/**
		 * Returns the default values for selected operation
		 * @returns {object} Default values/operator to be used for selected operation
		 *
		 * @protected
		 */
		HourRangeType.prototype.getFilterRanges = function () {
			var oCondition = this.getCondition(),
				oReturnCondition;
			if (oCondition.operation === "NEXT30MINUTES" || oCondition.operation === "NEXTHOUR" || oCondition.operation === "NEXT2HOURS" ||
				oCondition.operation === "NEXTXHOURS") {
				var oStartDate, oEndDate = new UniversalDate(),
					iValue = oCondition.value1;
				oEndDate.getJSDate().setTime(new UniversalDate().getTime());
				if (iValue !== 0 && !isNaN(iValue) && iValue > 0) {
					// oStartDate = new UniversalDate(); // removed for the OPA
					var oNowDate = new Date();
					oStartDate = new Date(oNowDate.getFullYear(), oNowDate.getMonth(), oNowDate.getDate(), 0);
					if (oCondition.operation === "NEXT30MINUTES") {
						// Commented code is removed for the OPA test
						// var oCalculatedTimeInHours, oCalculatedTimeInMinutes;
						// oCalculatedTimeInMinutes = oStartDate.getMinutes() + 30;
						// // eslint-disable-next-line radix
						// oCalculatedTimeInHours = parseInt((oCalculatedTimeInMinutes / 60), 10);
						// // eslint-disable-next-line radix
						// oCalculatedTimeInMinutes = parseInt((oCalculatedTimeInMinutes % 60), 10);
						// oEndDate.setHours(oStartDate.getHours() + oCalculatedTimeInHours);
						// oEndDate.setMinutes(oCalculatedTimeInMinutes);
						oEndDate = new Date(oNowDate.getFullYear(), oNowDate.getMonth(), oNowDate.getDate(), 0, 30); // added for the OPA tests
					} else {
						oEndDate = new Date(oNowDate.getFullYear(), oNowDate.getMonth(), oNowDate.getDate()); // added for the OPA tests
						oEndDate.setHours(oStartDate.getHours() + iValue);
					}
				}
				oCondition.value1 = oStartDate;
				oCondition.value2 = oEndDate;
				if (oCondition.value1 instanceof UniversalDate) {
					oCondition.value1 = oCondition.value1.oDate;
				}
				if (oCondition.value2 instanceof UniversalDate) {
					oCondition.value2 = oCondition.value2.oDate;
				}
				oCondition.operation = "BT";
				oCondition.exclude = false;
				oCondition.keyField = oCondition.key;
				delete oCondition.key;
				oReturnCondition = [oCondition];
			} else {
				oReturnCondition = DateRangeType.prototype.getFilterRanges.apply(this, []);
			}
			return oReturnCondition;
		};
		/**
		 * Returns the control to be used for selected operation
		 * @param {object} oInstance Instance
		 * @param {array} aResult List of control
		 * @param {object} oOperation object of Operation
		 *
		 * @protected
		 */
		HourRangeType.prototype.ControlFactory = function (oInstance, aResult, oOperation) {
			if (oOperation.key === "NEXT30MINUTES" || oOperation.key === "NEXTHOUR" || oOperation.key === "NEXT2HOURS" || oOperation.key ===
				"NEXTXHOURS") {
				var oControl;
				if (oOperation.key === "NEXT30MINUTES" || oOperation.key === "NEXTHOUR" || oOperation.key === "NEXT2HOURS") {
					oControl = new Text(Type._createStableId(oInstance, "text"), {
						text: ResourceModel.geti18nResourceModel().getText(oOperation.key)
					});
					oControl.addStyleClass("sapUiCompFilterBarCTPaddingTop");
					aResult.push(oControl);
				} else if (oOperation.key === "NEXTXHOURS") {
					oControl = DateRangeType.getIntField(oInstance);
					aResult.push(oControl);
					if (oOperation.descriptionTextKeys) {
						oControl.setFieldWidth("auto");
						oControl.bindProperty("description", {
							path: "$smartEntityFilter>value1",
							type: "sap.ui.model.type.Integer",
							formatter: function () {
								var sTextKey = oOperation.descriptionTextKeys[0],
									sTextMulti = oOperation.descriptionTextKeys[1];
								if (this.getBinding("description").getValue() === 1) {
									return ResourceModel.geti18nResourceModel().getText(sTextKey);
								} else {
									return ResourceModel.geti18nResourceModel().getText(sTextMulti || sTextKey);
								}
							}
						});
					}
				}
			} else if (oOperation.key === "CLEARDATE") {
				// CLEARDATE nothing to be done here
			} else {
				DateRangeType.prototype.ControlFactory.apply(this, []);
			}
		};
		HourRangeType.prototype._updateProvider = function (oJson, bSync, bFireFilterChange) {
			//this.validate(false);
			oJson.ranges = this.getFilterRanges();
			oJson.items = [];
			var bSetCursor = false;
			var iCursorPos = 0;
			var iSelectionStart = 0;
			var iSelectionEnd = 0;
			//  update the formattedText and the inputstate which we display in the input field
			if (this.oModel.getData().currentoperation.languageText) {
				var oData = this.oModel.getData();
				var sFormattedText = oData.currentoperation.languageText;
				if (oData.currentoperation.basicLanguageText.indexOf("{0}") >= 0) {
					if (oJson.conditionTypeInfo.data.value1 != null && oJson.conditionTypeInfo.data.value1 != "") {
						// if (oJson.conditionTypeInfo.data.value1 === 1 && oData.currentoperation.singulareBasicLanguageText) {
						// 	sFormattedText = oData.currentoperation.singulareBasicLanguageText;
						// 	//sFormattedText = this._fillNumberToText(sFormattedText, oJson.conditionTypeInfo.data.value1);
						// } else {
						sFormattedText = this._fillNumberToText(oData.currentoperation.basicLanguageText, oJson.conditionTypeInfo.data.value1);
						// }
						this.oModel.setProperty("inputstate", "NONE", this.getContext());
					} else if (this._bSuggestItemSelected) {
						sFormattedText = this._fillNumberToText(oData.currentoperation.basicLanguageText);
						var xPos = oData.currentoperation.basicLanguageText.indexOf("{0}");
						iCursorPos = xPos + 1;
						iSelectionStart = xPos;
						iSelectionEnd = xPos + 1;
						bSetCursor = true;
					} else {
						sFormattedText = "";
						this.oModel.setProperty("inputstate", "NONE", this.getContext());
					}
				} else if (oData.currentoperation.textValue) {
					sFormattedText = oData.currentoperation.languageText + " (" + oData.currentoperation.textValue + ")";
					this.oModel.setProperty("inputstate", "NONE", this.getContext());
				} else {
					if (oJson.conditionTypeInfo.data.value1 !== null && oJson.conditionTypeInfo.data.value1 !== "") {
						var v1 = oJson.conditionTypeInfo.data.value1;
						var v2 = oJson.conditionTypeInfo.data.value2;
						var sValue;
						if (typeof v1 === "number" && oData.currentoperation.valueList) {
							// in case of number access the month from  the value List array
							sValue = oData.currentoperation.valueList[v1].text;
						} else if (v1 instanceof Date) {
							var oDateFormatter = this._getDateFormatter(false);
							if (oJson.conditionTypeInfo.data.operation !== "DATERANGE" && (v1 && !v2)) {
								sValue = oDateFormatter.format(v1);
							} else if (oJson.conditionTypeInfo.data.operation === "DATERANGE" && v1 && v2) {
								sValue = oDateFormatter.format(v1) + " - " + oDateFormatter.format(v2);
							} else if (oJson.conditionTypeInfo.data.operation === "DATERANGE" && v1 && !v2 && !(this._oPopup && this._oPopup.isOpen())) {
								sValue = oDateFormatter.format(v1) + " - ";
								bSetCursor = true;
							} else {
								sValue = "";
							}
						} else {
							sValue = oJson.conditionTypeInfo.data.value1;
						}
						if (sValue) {
							// sFormattedText = oData.currentoperation.languageText + " (" + sValue + ")";
							iCursorPos = sFormattedText.length - 1;
							this.oModel.setProperty("inputstate", "NONE", this.getContext());
						} else {
							sFormattedText = "";
						}
					} else {
						// not a valid condition
						sFormattedText = "";
					}
				}
				this._bSuggestItemSelected = false;
				this.oModel.setProperty("/formattedText", sFormattedText);
				if (bSetCursor && !(this._oPopup && this._oPopup.isOpen())) {
					// set cursor to placeholder
					this._oInput.$("inner").cursorPos(iCursorPos);
					if (iSelectionStart < iSelectionEnd) {
						this._oInput.selectText(iSelectionStart, iSelectionEnd);
					}
					this._oInput._lastValue = ""; // to recheck by focusout again as it might be an invalid value
				}
			}
			if (this.oFilterProvider) {
				this.oFilterProvider.oModel.setProperty("/" + this.sFieldName, oJson);
				this.oFilterProvider.setFilterData({}, false, this.sFieldName);
				if (bFireFilterChange && this.oFilterProvider._oSmartFilter) {
					//call the fireFilterChange syncron
					this.oFilterProvider._oSmartFilter.fireFilterChange();
				}
			}
		};
		return HourRangeType;
	}, /* bExport= */ true);
