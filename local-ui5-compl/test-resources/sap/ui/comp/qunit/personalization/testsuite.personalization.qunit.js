sap.ui.define([
    "sap/ui/Device"
],function(Device){
	"use strict";
	var oUnitTest =  {
		name: "Library 'sap.ui.comp' - Personalization Tests",
		defaults: {
			group:"Library",
			qunit: {
				version: 2
			},
			sinon: {
				version: 4
			},
			ui5: {
				language: "en-US",
				rtl: false, //Whether to run the tests in RTL mode
				libs: [
					"sap.ui.comp"
				],
				"xx-waitForTheme": true
			},
			coverage: {
				only: "[sap/ui/comp]",
				never: "[sap/viz]",
				branchCoverage: true
			},
			loader: {
				paths: {
					"sap/ui/comp/qunit": "test-resources/sap/ui/comp/qunit",
					"sap/ui/core/qunit": "test-resources/sap/ui/core/qunit/",
					"test/sap/ui/comp/personalization": "test-resources/sap/ui/comp/qunit/personalization"
				}
			},
			autostart: true,
			module: "./{name}.qunit"
		},
		tests: {
			"Util": {
			},
			"Controller": {
				ui5: {
					libs: [
						"sap.m",
						"sap.ui.comp",
						"sap.ui.table"
					]
				}
			},
			"ColumnsController": {
			},
			"BaseController": {
			},
			"SelectionController": {
			},
			"SortController": {
			},
			"FilterController": {
			},
			"GroupController": {
			},
			"Validator": {
			},
			"ColumnHelper": {
			},
            /**
             * @deprecated
             */
			"DimeasureController": {
			},
			"opaTests/Personalization.opa": {
				group: "Personalization"
			},
			"opaTests/PersonalizationTableJourney": {
				group: "Personalization"
			},
			"opaTests/PersonalizationSmartTableResponsiveTableJourney": {
				group: "Personalization"
			},
			/*"opaTests/PersonalizationChartJourney": {
				group: "Personalization"
			},*/
			"opaTests/PersonalizationChart01.opa": {
				group: "Personalization"
			},
			"opaTests/PersonalizationChart02.opa": {
				group: "Personalization"
			},
			"opaTests/PersonalizationChartRestore.opa": {
				group: "Personalization"
			},
			"opaTests/PersonalizationChartVariants.opa": {
				group: "Personalization"
			},
			"opaTests/PersonalizationColumnMenu.opa": {
				group: "Personalization"
			},
			"opaTests/PersonalizationCustomController.opa": {
				group: "Personalization"
			},
			"opaTests/PersonalizationDataSuiteFormat.opa": {
				group: "Personalization"
			},
			"opaTests/PersonalizationDataSuiteFormatForSmartChart.opa": {
				group: "Personalization"
			},
			"opaTests/PersonalizationFeatureToggle.opa": {
				group: "Personalization"
			},
			"opaTests/PersonalizationFeatureToggleUsage.opa": {
				group: "Personalization"
			},
			"opaTests/PersonalizationFilterDate.opa": {
				group: "Personalization"
			},
			"opaTests/PersonalizationFilterDDR_useDRT.opa": {
				group: "Personalization"
			},
			"opaTests/PersonalizationFilterDDR_Types.opa": {
				group: "Personalization"
			},
			"opaTests/PersonalizationFilterIsCalendar.opa": {
				group: "Personalization"
			},
			"opaTests/PersonalizationFilterDecimal.opa": {
				group: "Personalization"
			},
			"opaTests/PersonalizationFilterDouble.opa": {
				group: "Personalization"
			},
			"opaTests/PersonalizationFilterEmptyForDates.opa": {
				group: "Personalization"
			},
			"opaTests/PersonalizationFilterEmptyForStrings.opa": {
				group: "Personalization"
			},
			"opaTests/PersonalizationFilterExcludeOperations.opa": {
				group: "Personalization"
			},
			"opaTests/PersonalizationFilterGeneric.opa": {
				group: "Personalization"
			},
			"opaTests/PersonalizationFilterPanel": {
				group: "Personalization"
			},
			"opaTests/PersonalizationFilterString.opa": {
				group: "Personalization"
			},
			"opaTests/PersonalizationFilterStringExclude.opa": {
				group: "Personalization"
			},
			"opaTests/PersonalizationLoadVariants.opa": {
				group: "Personalization"
			},
			"opaTests/PersonalizationLoadVariantsResponsiveTable01.opa": {
				group: "Personalization"
			},
			"opaTests/PersonalizationLoadVariantsResponsiveTable02.opa": {
				group: "Personalization"
			},
			"opaTests/PersonalizationLoadVariantsResponsiveTable03.opa": {
				group: "Personalization"
			},
			"opaTests/PersonalizationLoadVariantsResponsiveTable04.opa": {
				group: "Personalization"
			},
			"opaTests/PersonalizationLoadVariantsResponsiveTable05.opa": {
				group: "Personalization"
			},
			"opaTests/PersonalizationLoadVariantsResponsiveTable06.opa": {
				group: "Personalization"
			},
			"opaTests/PersonalizationLoadVariantsResponsiveTable07.opa": {
				group: "Personalization"
			},
			"opaTests/PersonalizationLoadVariantsResponsiveTable08.opa": {
				group: "Personalization"
			},
			"opaTests/PersonalizationLoadVariantsResponsiveTable09.opa": {
				group: "Personalization"
			},
			"opaTests/PersonalizationLoadVariantsResponsiveTable10.opa": {
				group: "Personalization"
			},/*
			* P13nColumnsPanel is deprecated with 1.91
			"opaTests/PersonalizationP13nColumnsPanel.opa": {
				group: "Personalization"
			},*/
			"opaTests/PersonalizationPerformance.opa": {
				group: "Personalization"
			},
			"opaTests/PersonalizationPresentationVariant.opa": {
				group: "Personalization"
			},
			"opaTests/PersonalizationResponsive.opa": {
				group: "Personalization"
			},
			"opaTests/PersonalizationRestore.opa": {
				group: "Personalization"
			},
			"opaTests/PersonalizationRestoreCancel.opa": {
				group: "Personalization"
			},
			"opaTests/PersonalizationRestoreColumns.opa": {
				group: "Personalization"
			},
			"opaTests/PersonalizationRestoreGroup.opa": {
				group: "Personalization"
			},
			"opaTests/PersonalizationRestoreWithVariant.opa": {
				group: "Personalization"
			},
			"opaTests/PersonalizationRestoreWithVariantII.opa": {
				group: "Personalization"
			},
			"opaTests/PersonalizationSmartTableRTA.opa": {
				group: "Personalization",
				ui5: {
					resourceroots: {
						"sap.ui.comp.qunit.personalization.test": "test-resources/sap/ui/comp/qunit/personalization/test",
						"test.sap.ui.comp.personalization": "test-resources/sap/ui/comp/qunit/personalization"
					}
				}
			},
			"opaTests/PersonalizationTableJSONModel.opa": {
				group: "Personalization",
				ui5: {
					resourceroots: {
						"sap.ui.comp.qunit.personalization.test": "test-resources/sap/ui/comp/qunit/personalization/test",
						"test.sap.ui.comp.personalization": "test-resources/sap/ui/comp/qunit/personalization"
					}
				}
			}
		}
	};

	return oUnitTest;

});
