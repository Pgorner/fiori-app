//.../S4-FIORI-CORE-2/cus.o2c.lib.gentools.s1/blob/main/src/sap/cus/o2c/lib/gentools/s1/controls/SemanticDateRangeType.js
//.../S4-FIORI-CORE-2/cus.o2c.lib.gentools.s1/blob/main/src/sap/cus/o2c/lib/gentools/s1/controls/SemanticDateRangeType.js

sap.ui.define([
		"sap/ui/comp/config/condition/DateRangeType",
		"sap/ui/model/odata/v2/ODataModel",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"sap/ui/core/date/UniversalDate",
		"sap/ui/core/library",
		"./Utils"],
	function(DateRangeType, ODataModel, Filter, FilterOperator, UniversalDate, coreLibrary, Utils) {
		"use strict";

		var ValueState = coreLibrary.ValueState;

		/**
		 * @class
		 * The SemanticDateRangeType is the implementation of a customized ConditionType for providing
		 * date ranges based on the requirements of FI-CA.
		 *
		 * Requires UI5 1.36.3 and higher
		 *
		 * @extends sap.ui.comp.config.condition.DateRangeType
		 * @constructor
		 * @public
		 * @alias sap.cus.o2c.lib.gentools.s1.controls.SemanticDateRangeType
		 */
		var SemanticDateRangeType = DateRangeType.extend("Test10",
			/** @lends sap.cus.o2c.lib.gentools.s1.controls.SemanticDateRangeType.prototype */ {

				/**
				 * list for arguments: sFieldName, oFilterProvider, oFieldViewMetadata
				 */
				constructor: function() {
					DateRangeType.apply(this, arguments);
					this._sDefaultOperation = "DATERANGE";
				}
			});

		SemanticDateRangeType.Operations = {};

		SemanticDateRangeType.FICAOperations = ["LAST_DAYS_TO_DATE",
			"LAST_MONTHS_TO_DATE",
			"LAST_YEARS_TO_DATE",
			"NEXT_DAYS_FROM_DATE",
			"NEXT_MONTHS_FROM_DATE",
			"NEXT_YEARS_FROM_DATE"
		];

		SemanticDateRangeType._IntFilterSuggestItemFICA = function( sValue, oItem, oInstance ){
			var bIsFICAOperation = false;
			var sSelectedOperationKey = oItem.getProperty("key");
			// eslint-disable-next-line no-undef
			if (SemanticDateRangeType.FICAOperations.includes(sSelectedOperationKey)) {
				bIsFICAOperation = true;
			}

			if (!bIsFICAOperation){
				return DateRangeType._IntFilterSuggestItem(sValue, oItem, oInstance);
			}



			var xPos = this.basicLanguageText.indexOf( "{0}" );
			var sPart1;
			var sPart2;
			if ( xPos >= 0 ) {
				sPart1 = this.basicLanguageText.slice( 0, xPos ).trim();
				sPart2 = this.basicLanguageText.slice( xPos + 3 ).trim();
			}

			var aParts = sValue.split( " " );
			if ( aParts.length < 1 || aParts.length > 10 ) {
				return false;
			}
			var bMatch = false;
			var sNumber;
			var isValidNumber = function( sValue ) {
				// eslint-disable-next-line radix
				return !!sValue.match( /(?!(0))(^[0-9]+$)/ ) && parseInt( sValue, 10 ) > 0;
			};

			if (sPart1.toLowerCase().startsWith(aParts[ 0 ].toLowerCase()) ) {
				// starts with the first word
				if ( aParts[ 1 ] ) {
					if ( isValidNumber( aParts[ 1 ] ) ) {
						// second part is number
						sNumber = aParts[ 1 ];
						if ( aParts[ 2 ] ) {
							if (sPart2.toLowerCase().startsWith(aParts[ 2 ].toLowerCase())) {
								bMatch = true;
							}
						} else {
							bMatch = true;
						}
					}
				} else {
					// only first part -> OK
					bMatch = true;
				}
			} else if ( isValidNumber( aParts[ 0 ] ) && aParts.length < 3 ) {
				// starts with number
				sNumber = aParts[ 0 ];
				if ( aParts[ 1 ] ) {
					if (sPart2.toLowerCase().startsWith(aParts[ 1 ].toLowerCase())) {
						bMatch = true;
					}
				} else {
					// only number -> OK
					bMatch = true;
				}
			} else if (sPart2.toLowerCase().startsWith(aParts[0].toLowerCase()) && aParts.length == 1 ) {
				// starts with last word
				bMatch = true;
			}

			if ( bMatch && sNumber ) {
				var sType;
				switch ( this.category ) {
					case "FICA.DATE.INT":
						sType = "FICA_DAY";
						break;
					case "FICA.WEEK.INT":
						sType = "FICA_WEEK";
						break;
					case "FICA.MONTH.INT":
						sType = "FICA_MONTH";
						break;
					case "FICA.QUARTER.INT":
						sType = "FICA_QUARTER";
						break;
					case "FICA.YEAR.INT":
						sType = "FICA_YEAR";
						break;

					default:
						sType = "FICA_DAY";
						break;
				}

				// eslint-disable-next-line radix
				var iNumber = parseInt(sNumber, 10);
				var bFlag = true;
				if ( this.key && this.key.startsWith("LAST") ) {
					iNumber = iNumber * -1;
					bFlag = false;
				}

				var aDates = SemanticDateRangeType.getDateRangeFICA( iNumber, sType, true, bFlag, bFlag );
				var oDateFormatter = oInstance._getDateFormatter( true );
				if ( Math.abs( iNumber ) === 1 && this.singulareBasicLanguageText ) {
					oItem.setText( this.singulareBasicLanguageText );
					if (sType !== "FICA_DAY") {
						oItem.setAdditionalText( oDateFormatter.format( aDates[ 0 ] ) + " - " + oDateFormatter.format( aDates[ 1 ] ) );
					} else {
						oItem.setAdditionalText( oDateFormatter.format( aDates[ 0 ] ));
					}
				} else {
					oItem.setText( oInstance._fillNumberToText( this.basicLanguageText, sNumber ) );
					oItem.setAdditionalText( oDateFormatter.format( aDates[ 0 ] ) + " - " + oDateFormatter.format( aDates[ 1 ] ) );
				}
				// eslint-disable-next-line radix
				oItem._value1 = parseInt( sNumber, 10 );
			} else {
				oItem.setAdditionalText( null );
				oItem.setText( this.languageText );
				oItem._value1 = null;
			}
			return bMatch;
		};

		SemanticDateRangeType.getDateRangeFICA = function ( iValue, sType, oUniversalDate, bCalcBaseStartDate, bIgnoreCurrentInterval ) {
			if ( oUniversalDate === true ) {
				bCalcBaseStartDate = true;
				oUniversalDate = null;
			}

			if ( !oUniversalDate ) {
				oUniversalDate = new UniversalDate();
			} else if ( !( oUniversalDate instanceof UniversalDate ) ) {
				throw new Error( "Date must be a UniversalDate object " + this );
			}

			var oStartDate = new UniversalDate(),
				oEndDate;
			if ( oUniversalDate ) {
				oStartDate.getJSDate().setTime( oUniversalDate.getTime() );
				oStartDate = DateRangeType.setStartTime( oStartDate );
			}
			if ( iValue !== 0 && !isNaN( iValue ) ) {
				if ( sType === "FICA_DAY"){
					oEndDate = new UniversalDate( oStartDate );
					if (iValue < 0){
						oEndDate.setDate( oStartDate.getDate() + iValue + 1);
					} else {
						oEndDate.setDate( oStartDate.getDate() + iValue - 1);
					}

				} else if ( sType === "FICA_MONTH"){
					oEndDate = new UniversalDate( oStartDate);
					oEndDate.setDate( 1 );
					if (iValue < 0){
						oEndDate.setMonth( oStartDate.getMonth() + iValue + 1);
					} else {
						oEndDate.setMonth( oStartDate.getMonth() + iValue - 1);
					}
				} else if ( sType === "FICA_YEAR"){
					oEndDate = new UniversalDate( oStartDate);
					oEndDate.setDate( 1 );
					oEndDate.setMonth( 0 );
					if (iValue < 0){
						oEndDate.setFullYear( oStartDate.getFullYear() + iValue + 1);
					} else {
						oEndDate.setFullYear( oStartDate.getFullYear() + iValue - 1);
					}
				}
			}

			if ( !oEndDate ) {
				return [];
			}

			if ( oEndDate.getTime() < oStartDate.getTime() ) {
				// swap start/end date
				oEndDate = [ oStartDate, oStartDate = oEndDate ][ 0 ];
			}

			return [
				DateRangeType.setStartTime( oStartDate ), DateRangeType.setEndTime( oEndDate )
			];
		};

		SemanticDateRangeType.initializeOperations = function() {

			var oUtils = new Utils(this);
			var oResourceBundle = oUtils.getBundle();

			SemanticDateRangeType.Operations.LAST_DAYS_TO_DATE = {
				key: "LAST_DAYS_TO_DATE",
				textKey: oResourceBundle.getText("LAST_DAYS_TO_DATE"),
				languageText: oResourceBundle.getText("LAST_DAYS_TO_DATE"),
				category:  {
					key: "FICA",
					bundle: "applicationUnderTest.smartfilterbar_DDR.i18n"
				},
				defaultValues: [1],
				type: "int",
				descriptionTextKeys: ["CONDITION_DATERANGETYPE_SINGLE_DAY", "CONDITION_DATERANGETYPE_MULTIPLE_DAYS"],
				display: "start",
				getControls: DateRangeType.ControlFactory,
				order: 1001,
				value1: null,
				singularTextKey: oResourceBundle.getText("DATERANGE_DAY_SINGULAR"),
				filterSuggestItem: SemanticDateRangeType._IntFilterSuggestItemFICA
			};

			SemanticDateRangeType.Operations.LAST_MONTHS_TO_DATE = {
				key: "LAST_MONTHS_TO_DATE",
				textKey: oResourceBundle.getText("LAST_MONTHS_TO_DATE"),
				languageText: oResourceBundle.getText("LAST_MONTHS_TO_DATE"),
				category: {
					key: "FICA",
					bundle: "applicationUnderTest.smartfilterbar_DDR.i18n"
				},
				defaultValues: [12],
				type: "int",
				descriptionTextKeys: ["CONDITION_DATERANGETYPE_SINGLE_MONTH", "CONDITION_DATERANGETYPE_MULTIPLE_MONTHS"],
				display: "start",
				getControls: DateRangeType.ControlFactory,
				order: 1002,
				value1: null,
				singularTextKey: oResourceBundle.getText("DATERANGE_MONTH_SINGULAR"),
				filterSuggestItem: SemanticDateRangeType._IntFilterSuggestItemFICA
			};

			SemanticDateRangeType.Operations.LAST_YEARS_TO_DATE = {
				key: "LAST_YEARS_TO_DATE",
				textKey: oResourceBundle.getText("LAST_YEARS_TO_DATE"),
				languageText: oResourceBundle.getText("LAST_YEARS_TO_DATE"),
				category:  {
					key: "FICA",
					bundle: "applicationUnderTest.smartfilterbar_DDR.i18n"
				},
				defaultValues: [1],
				type: "int",
				descriptionTextKeys: ["CONDITION_DATERANGETYPE_SINGLE_YEAR", "CONDITION_DATERANGETYPE_MULTIPLE_YEARS"],
				display: "start",
				getControls: DateRangeType.ControlFactory,
				order: 1003,
				value1: null,
				singularTextKey: oResourceBundle.getText("DATERANGE_YEAR_SINGULAR"),
				filterSuggestItem: SemanticDateRangeType._IntFilterSuggestItemFICA
			};

			SemanticDateRangeType.Operations.NEXT_DAYS_FROM_DATE = {
				key: "NEXT_DAYS_FROM_DATE",
				textKey: oResourceBundle.getText("NEXTDAYS_INCL"),
				languageText: oResourceBundle.getText("NEXTDAYS_INCL"),
				category:  {
					key: "FICA",
					bundle: "applicationUnderTest.smartfilterbar_DDR.i18n"
				},
				defaultValues: [1],
				type: "int",
				descriptionTextKeys: ["CONDITION_DATERANGETYPE_SINGLE_DAY", "CONDITION_DATERANGETYPE_MULTIPLE_DAYS"],
				display: "start",
				getControls: DateRangeType.ControlFactory,
				order: 1004,
				value1: null,
				singularTextKey: oResourceBundle.getText("DATERANGE_DAY_SINGULAR"),
				filterSuggestItem: SemanticDateRangeType._IntFilterSuggestItemFICA
			};

			SemanticDateRangeType.Operations.NEXT_MONTHS_FROM_DATE = {
				key: "NEXT_MONTHS_FROM_DATE",
				textKey: oResourceBundle.getText("NEXTMONTHS_INCL"),
				languageText: oResourceBundle.getText("NEXTMONTHS_INCL"),
				category:  {
					key: "FICA",
					bundle: "applicationUnderTest.smartfilterbar_DDR.i18n"
				},
				defaultValues: [12],
				type: "int",
				descriptionTextKeys: ["CONDITION_DATERANGETYPE_SINGLE_MONTH", "CONDITION_DATERANGETYPE_MULTIPLE_MONTHS"],
				display: "start",
				getControls: DateRangeType.ControlFactory,
				order: 1005,
				value1: null,
				singularTextKey: oResourceBundle.getText("DATERANGE_MONTH_SINGULAR"),
				filterSuggestItem: SemanticDateRangeType._IntFilterSuggestItemFICA
			};

			SemanticDateRangeType.Operations.NEXT_YEARS_FROM_DATE = {
				key: "NEXT_YEARS_FROM_DATE",
				textKey: oResourceBundle.getText("NEXTYEARS_INCL"),
				languageText: oResourceBundle.getText("NEXTYEARS_INCL"),
				category:  {
					key: "FICA",
					bundle: "applicationUnderTest.smartfilterbar_DDR.i18n"
				},
				defaultValues: [1],
				type: "int",
				descriptionTextKeys: ["CONDITION_DATERANGETYPE_SINGLE_YEAR", "CONDITION_DATERANGETYPE_MULTIPLE_YEARS"],
				display: "start",
				getControls: DateRangeType.ControlFactory,
				order: 1006,
				value1: null,
				singularTextKey: oResourceBundle.getText("DATERANGE_YEAR_SINGULAR"),
				filterSuggestItem: SemanticDateRangeType._IntFilterSuggestItemFICA
			};

			/*SemanticDateRangeType.FICAOperations.forEach(function(el){
				SemanticDateRangeType.Operations[el] = DateRangeType.getFixedRangeOperation(
						el,
						oResourceBundle.getText(el),
						"FICA"
						);
				SemanticDateRangeType.Operations[el].type = "int";
				SemanticDateRangeType.Operations[el].defaultValues = [1];
				SemanticDateRangeType.Operations[el].display ="start";
				//SemanticDateRangeType.Operations[el].textKey = ""+el;
				SemanticDateRangeType.Operations[el].descriptionTextKeys = ["Tag", "Tage"];
			});*/

		};

		// SemanticDateRangeType.prototype.getTranslatedText = function(textKey, sBundleName) {

		// 	if (typeof textKey === "object") {
		// 		if($.inArray(textKey.key, SemanticDateRangeType.FICAOperations)) {
		// 			var oUtils = new Utils(this);
		// 			var oResourceBundle = oUtils.getBundle();
		// 			return oResourceBundle.getText(textKey.key);
		// 		}
		// 	}

		// 	// default
		// 	return DateRangeType.prototype.getTranslatedText(textKey, sBundleName);

		// 	/*var sTranslatedText = DateRangeType.prototype.getTranslatedText(textKey, sBundleName);
		// 	if(textKey === sTranslatedText) {
		// 		var oUtils = new Utils(this);
		// 		var oResourceBundle = oUtils.getBundle();
		// 		sTranslatedText = oResourceBundle.getText()
		// 	}

		// 	return sTranslatedText;*/
		// };

		SemanticDateRangeType.initializeOperations();

		SemanticDateRangeType.prototype.getOperations = function() {
			var aOperations = DateRangeType.prototype.getOperations.apply(this,[]);
			var that = this;
			// add the FICA operations
			SemanticDateRangeType.FICAOperations.forEach(function(el){
				if (that._filterOperation(SemanticDateRangeType.Operations[el])) {
					aOperations.push(SemanticDateRangeType.Operations[el]);
				}
			});

			return aOperations;
		};


		SemanticDateRangeType.prototype.getFilterRanges = function() {
			var oCondition = this.getCondition(),
				aValues = [];
			var oSmartFilterBar = this.getParent();

			var oUtils = new Utils(this);
			var oTextBundle = oUtils.getBundle();

			var sValueStateText = "";
			var bErrorFlag = false;
			var iDateRangeMaxValue;

			if ( ( oCondition.operation === "LAST_DAYS_TO_DATE" || oCondition.operation === "LASTDAYS" ) && oCondition.value1){
				if (oCondition.value1 !== 1){
					iDateRangeMaxValue = 9999;
					if (oCondition.value1 > iDateRangeMaxValue){
						sValueStateText = oTextBundle.getText("dateRangeErrorDays", [iDateRangeMaxValue]);
						bErrorFlag = true;
					} else {
						aValues = DateRangeType.getDateRange(-oCondition.value1 + 1, "DAY", true);
						oCondition.value1 = aValues[0];
						oCondition.value2 = DateRangeType.getDateRange(1, "DAY", true)[1];
					}
				} else {
					aValues = DateRangeType.getDateRange(1, "DAY", true);
					oCondition.value1 = aValues[0];
					oCondition.value2 = aValues[1];
				}
			} else if (oCondition.operation === "LAST_MONTHS_TO_DATE" && oCondition.value1) {
				if (oCondition.value1 !== 1){
					iDateRangeMaxValue = 9999;
					if (oCondition.value1 > iDateRangeMaxValue){
						sValueStateText = oTextBundle.getText("dateRangeErrorMonths", [iDateRangeMaxValue]);
						bErrorFlag = true;
					} else {
						aValues = DateRangeType.getDateRange(-oCondition.value1 + 1, "MONTH", true);
						oCondition.value1 = aValues[0];
						oCondition.value2 = DateRangeType.getDateRange(1, "DAY", true)[1];
					}
				} else {
					aValues = DateRangeType.getDateRange(1, "MONTH", true);
					oCondition.value1 = aValues[0];
					oCondition.value2 = DateRangeType.getDateRange(1, "DAY", true)[1];
				}
			} else if (oCondition.operation === "LAST_YEARS_TO_DATE" && oCondition.value1) {
				if (oCondition.value1 !== 1){
					iDateRangeMaxValue = 2000;
					if (oCondition.value1 > iDateRangeMaxValue){
						sValueStateText = oTextBundle.getText("dateRangeErrorYears", [iDateRangeMaxValue]);
						bErrorFlag = true;
					} else {
						aValues = DateRangeType.getDateRange(-oCondition.value1 + 1, "YEAR", true);
						oCondition.value1 = aValues[0];
						oCondition.value2 = DateRangeType.getDateRange(1, "DAY", true)[1];
					}
				} else {
					aValues = DateRangeType.getDateRange(1, "YEAR", true);
					oCondition.value1 = aValues[0];
					oCondition.value2 = DateRangeType.getDateRange(1, "DAY", true)[1];
				}
			} else if (oCondition.operation === "NEXT_DAYS_FROM_DATE" && oCondition.value1) {
				iDateRangeMaxValue = 9999;
				if (oCondition.value1 > iDateRangeMaxValue){
					sValueStateText = oTextBundle.getText("dateRangeErrorDays", [iDateRangeMaxValue]);
					bErrorFlag = true;
				} else {
					aValues = DateRangeType.getDateRange(oCondition.value1, "DAY", true);
					oCondition.value1 = DateRangeType.getDateRange(1, "DAY", true)[0];
					oCondition.value2 = aValues[1];
				}
			} else if (oCondition.operation === "NEXT_MONTHS_FROM_DATE" && oCondition.value1) {
				iDateRangeMaxValue = 9999;
				if (oCondition.value1 > iDateRangeMaxValue){
					sValueStateText = oTextBundle.getText("dateRangeErrorMonths", [iDateRangeMaxValue]);
					bErrorFlag = true;
				} else {
					aValues = DateRangeType.getDateRange(oCondition.value1, "MONTH", true);
					oCondition.value1 = DateRangeType.getDateRange(1, "DAY", true)[0];
					oCondition.value2 = aValues[1];
				}
			} else if (oCondition.operation === "NEXT_YEARS_FROM_DATE" && oCondition.value1) {
				iDateRangeMaxValue = 7000;
				if (oCondition.value1 > iDateRangeMaxValue){
					sValueStateText = oTextBundle.getText("dateRangeErrorYears", [iDateRangeMaxValue]);
					bErrorFlag = true;
				} else {
					aValues = DateRangeType.getDateRange(oCondition.value1, "YEAR", true);
					oCondition.value1 = DateRangeType.getDateRange(1, "DAY", true)[0];
					oCondition.value2 = aValues[1];
				}
			} else {
				return DateRangeType.prototype.getFilterRanges.apply(this,arguments);
			}


			if (oSmartFilterBar.isInitialised()) {
				var oFilterControl = oSmartFilterBar.getControlByKey(oCondition.key);
				if ( bErrorFlag === true ){
					if (oFilterControl && oFilterControl.setValueState) {
						oFilterControl.setValueState(ValueState.Error);
					}
				} else {
					if (oFilterControl && oFilterControl.setValueState) {
						oFilterControl.setValueState(ValueState.None);
					}
				}
				if (oFilterControl && oFilterControl.setValueStateText) {
					oFilterControl.setValueStateText(sValueStateText);
				}
			}

			if (oCondition.value1 instanceof UniversalDate) {
				oCondition.value1 = oCondition.value1.oDate;
			}
			if (oCondition.value2 instanceof UniversalDate) {
				oCondition.value2 = oCondition.value2.oDate;
			}
			if (oCondition.operation === "FROM") {
				if (!(this.isValidCondition() && oCondition.value1)) {
					return [];
				}
				oCondition.operation = "GE";
				delete oCondition.value2;
			} else if (oCondition.operation === "TO") {
				if (!(this.isValidCondition() && oCondition.value1)) {
					return [];
				}
				oCondition.operation = "LE";
				delete oCondition.value2;

				if (this._bIgnoreTime) {
					oCondition.value1 = DateRangeType.setStartTime(oCondition.value1).oDate;
				} else {
					oCondition.value1 = DateRangeType.setEndTime(oCondition.value1).oDate;
				}
			} else {
				if (!(this.isValidCondition() && oCondition.value1 && oCondition.value2)) {
					return [];
				}
				oCondition.operation = "BT";

				if (this._bIgnoreTime) {
					// set the time to 00:00:00
					oCondition.value2 = DateRangeType.setStartTime(oCondition.value2).oDate;
				} else {
					// include the day and set time to 23:59:59:999
					oCondition.value2 = DateRangeType.setEndTime(oCondition.value2).oDate;
				}
			}

			oCondition.exclude = false;
			oCondition.keyField = oCondition.key;
			delete oCondition.key;

			return [
				oCondition
			];

		};

		return SemanticDateRangeType;
	}, /* bExport= */true);
