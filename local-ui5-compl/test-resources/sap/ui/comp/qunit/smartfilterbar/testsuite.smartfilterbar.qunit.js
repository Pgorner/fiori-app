sap.ui.define([
	"sap/ui/Device"
],function(
	Device
){
	"use strict";
	var oUnitTest =  {
		name: "Package 'sap.ui.comp.smartfilterbar'",
		defaults: {
			group: "SmartFilterBar",
			qunit: {
				version: 2
			},
			sinon: {
				version: 4
			},
			ui5: {
				language: "en-US",
				rtl: false,
				libs: [
					"sap.ui.comp"
				],
				"xx-waitForTheme": true
			},
			coverage: {
				only: "sap/ui/comp",
				branchCoverage: true
			},
			loader: {
				paths: {
					"sap/ui/comp/qunit": "test-resources/sap/ui/comp/qunit/",
					"sap/ui/core/qunit": "test-resources/sap/ui/core/qunit/",
					"sap/ui/comp/integration": "test-resources/sap/ui/comp/integration/"
				}
			},
			autostart: true,
			module: "./{name}.qunit"
		},
		tests: {
			"AdditionalConfigurationHelper": {
				group: "SmartFilterBar",
				coverage: {
					only: "sap/ui/comp/smartfilterbar/AdditionalConfigurationHelper.js"
				}
			},
			"ControlConfiguration": {
				group: "SmartFilterBar",
				coverage: {
					only: "sap/ui/comp/smartfilterbar/ControlConfiguration.js"
				}
			},
			"FilterProvider": {
				group: "SmartFilterBar",
				coverage: {
					only: "sap/ui/comp/smartfilterbar/FilterProvider.js"
				}
			},
			"FilterProviderDates": {
				skip: true, /* test was not active for 4 years, why? */
				group: "SmartFilterBar",
				coverage: {
					only: "sap/ui/comp/smartfilterbar/FilterProvider.js"
				}
			},
			"GroupConfiguration": {
				group: "SmartFilterBar",
				coverage: {
					only: "sap/ui/comp/smartfilterbar/GroupConfiguration.js"
				}
			},
			"SelectOption": {
				group: "SmartFilterBar",
				coverage: {
					only: "sap/ui/comp/smartfilterbar/SelectOption.js"
				}
			},
			"SmartFilterBar": {
				group: "SmartFilterBar",
				coverage: {
					only: "sap/ui/comp/smartfilterbar/SmartFilterBar.js"
				}
			},
			"SmartFilterBar_setFilterData": {
				skip: true, /* test was not active for 4 years, why? */
				group: "SmartFilterBar",
				coverage: {
					only: "sap/ui/comp/smartfilterbar/SmartFilterBar.js"
				}
			},
			"SFBMultiInput": {
				group: "SmartFilterBar",
				coverage: {
					only: "sap/ui/comp/smartfilterbar/SFBMultiInput.js"
				}
			},
			"SFBMultiComboBox": {
				group: "SmartFilterBar",
				coverage: {
					only: "sap/ui/comp/smartfilterbar/SFBMultiComboBox.js"
				}
			},
			"opaTests/FieldTypes/Opa.page1": {
				group: "SmartFilterBar",
				autostart: false
			},
			"opaTests/FieldTypes/Opa.page2": {
				group: "SmartFilterBar",
				autostart: false
			},
			"opaTests/FieldTypes/Opa.page3": {
				group: "SmartFilterBar",
				autostart: false
			},
			"opaTests/FieldTypes/Opa.page4": {
				group: "SmartFilterBar",
				autostart: false
			},
			"opaTests/FieldTypes/Opa.page5": {
				group: "SmartFilterBar",
				autostart: false
			},
			"opaTests/FieldTypes/Opa.page6": {
				group: "SmartFilterBar",
				autostart: false
			},
			"opaTests/FieldTypes/Opa.page7": {
				group: "SmartFilterBar",
				autostart: false
			},
			"opaTests/TextArrangement/Opa_smartfilterbar_TextArrangement": {
				group: "SmartFilterBar",
				autostart: false
			},
			"opaTests/FilterChange/FilterChangeOpa": {
				group: "SmartFilterBar"
			},
			/**
			 * @deprecated see <code>sap.ui.fl.apply.api.SmartVariantManagementApplyAPI</code>
			 */
			"opaTests/ReferenceApps/ReferenceApps": {
				group: "SmartFilterBar"
			},
			/**
			 * @deprecated see <code>sap.ui.fl.apply.api.SmartVariantManagementApplyAPI</code>
			 */
			"opaTests/ReferenceAppsDelayInBinding/ReferenceApps": {
				group: "SmartFilterBar"
			},
			"opaTests/DateRangeType/Opa.page1": {
				group: "SmartFilterBar"
			},
			"opaTests/DateRangeType/Opa.page2": {
				group: "SmartFilterBar"
			},
			"opaTests/DateRangeType/Opa.page3": {
				group: "SmartFilterBar"
			},
			"opaTests/DateRangeType/Opa.page4": {
				group: "SmartFilterBar"
			},
			"opaTests/DateRangeType/Opa.page5": {
				group: "SmartFilterBar"
			},
			"opaTests/DateRangeType/Opa": {
				group: "SmartFilterBar",
				skip: true // only for manual execution
			},
			"opaTests/DateRangeType/Opa_smartfilterbar_CalendarWeekNumbering": {
				group: "SmartFilterBar"
			},
			"opaTests/DateRangeType/Opa_smartfilterbar_DateRangeConfiguration": {
				group: "SmartFilterBar"
			},
			"opaTests/DateRangeType/Opa_smartfilterbar_DateTimeOffset_Timezone": {
				group: "SmartFilterBar"
			},
			"opaTests/DateRangeType/Opa_smartfilterbar_DateTypes_useDRT": {
				group: "SmartFilterBar"
			},
			"opaTests/DateRangeType/Opa_smartfilterbar_DDR_Last_Next": {
				group: "SmartFilterBar"
			},
			"opaTests/DateRangeType/Opa_smartfilterbar_DDR_DTO_Last_Next": {
				group: "SmartFilterBar"
			},
			"opaTests/DateRangeType/Opa_smartfilterbar_DateTypes_useDRT_Perso": {
				group: "SmartFilterBar"
			},
			"opaTests/DateRangeType/Opa_smartfilterbar_DDR_OutParameters": {
				group: "SmartFilterBar"
			},
			"opaTests/AdaptFiltersRearrange/Opa_smartfilterbar_AdaptFilterRearrange": {
				group: "SmartFilterBar"
			},
			"opaTests/SearchMatchesPattern/Opa_smartfilterbar_SearchPatternWarning": {
				group: "SmartFilterBar"
			},
			"opaTests/InitialValueIsSignificant/Opa_smartfilterbar_InitialValueIsSignificant": {
				group: "SmartFilterBar"
			},
			"opaTests/DateTimeOffset/Opa_SFB_Auto_BT": {
				group: "SmartFilterBar"
			},
			"opaTests/DateTimeOffset/Opa_SFB_Auto_EQ": {
				group: "SmartFilterBar"
			},
			"opaTests/DateTimeOffset/Opa_SFB_Auto_GE": {
				group: "SmartFilterBar"
			},
			"opaTests/DateTimeOffset/Opa_SFB_Auto_GT": {
				group: "SmartFilterBar"
			},
			"opaTests/DateTimeOffset/Opa_SFB_Auto_LE": {
				group: "SmartFilterBar"
			},
			"opaTests/DateTimeOffset/Opa_SFB_Auto_LT": {
				group: "SmartFilterBar"
			},
			"opaTests/DateTimeOffset/Opa_SFB_Auto_NotEQ": {
				group: "SmartFilterBar"
			},
			"opaTests/DateTimeOffset/Opa_SFB_Interval_BT": {
				group: "SmartFilterBar"
			},
			"opaTests/DateTimeOffset/Opa_SFB_Interval_EQ": {
				group: "SmartFilterBar"
			},
			"opaTests/IgnorePresentationVariant/IgnorePresentationVariant": {
				group: "SmartFilterBar"
			}
		}
	};

	return oUnitTest;
});
