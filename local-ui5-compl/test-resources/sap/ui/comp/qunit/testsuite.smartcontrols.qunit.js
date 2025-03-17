sap.ui.define([
	"sap/ui/Device"
],function(
	Device
){
	"use strict";
	var oUnitTest =  {
		name: "Library 'sap.ui.comp'",
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
					"sap/ui/core/qunit": "test-resources/sap/ui/core/qunit/"
				}
			},
			autostart: true,
			module: "./{name}.qunit"
		},
		tests: {
			"FilterBar": {
				group: "FilterBar Testsuite",
				page: "test-resources/sap/ui/comp/qunit/filterbar/testsuite.filterbar.qunit.html"
			},
			"NavPopover": {
				group: "NavPopover Testsuite",
				page: "test-resources/sap/ui/comp/qunit/navpopover/testsuite.navpopover.qunit.html"
			},
			"OData": {
				group: "OData Testsuite",
				page: "test-resources/sap/ui/comp/qunit/odata/testsuite.odata.qunit.html"
			},
			"Providers": {
				group: "Providers Testsuite",
				page: "test-resources/sap/ui/comp/qunit/providers/testsuite.providers.qunit.html"
			},
			"HistoryValues": {
				group: "HistoryValues Testsuite",
				page: "test-resources/sap/ui/comp/qunit/historyvalues/testsuite.historyvalues.qunit.html"
			},
			"SmartField": {
				group: "SmartField Testsuite",
				page: "test-resources/sap/ui/comp/qunit/smartfield/testsuite.smartfield.qunit.html"
			},
			"SmartFilterBar": {
				group: "SmartFilterBar Testsuite",
				page: "test-resources/sap/ui/comp/qunit/smartfilterbar/testsuite.smartfilterbar.qunit.html"
			},
			"SmartTable": {
				group: "SmartTable Testsuite",
				page: "test-resources/sap/ui/comp/qunit/smarttable/testsuite.smarttable.qunit.html"
			},
			"SmartVariants": {
				group: "SmartVariants Testsuite",
				page: "test-resources/sap/ui/comp/qunit/smartvariants/testsuite.smartvariants.qunit.html"
			},
			/**
			 * @deprecated
			 */
			"Variants": {
				group: "Variants Testsuite",
				page: "test-resources/sap/ui/comp/qunit/variants/testsuite.variants.qunit.html"
			},
			"SmartForm": {
				group: "SmartForm Testsuite",
				page: "test-resources/sap/ui/comp/qunit/smartform/testsuite.smartform.qunit.html"
			},
			"Personalization": {
				group: "Personalization Testsuite",
				page: "test-resources/sap/ui/comp/qunit/personalization/testsuite.personalization.qunit.html" //TBD: Move Personalization to the new approach
			},
			"ValueHelpDialog": {
				group: "ValueHelpDialog Testsuite",
				page: "test-resources/sap/ui/comp/qunit/valuehelpdialog/testsuite.valuehelpdialog.qunit.html"
			},
			"P13n": {
				group: "P13n Testsuite",
				page: "test-resources/sap/ui/comp/qunit/p13n/testsuite.p13n.qunit.html"
			},
			"smartchart/SmartChart": {
				group: "SmartChart",
				coverage: {
					only: "sap/ui/comp/smartchart/SmartChart.js"
				},
				uriParams: {
					// test compares actual source of Chart#setVisibleMeasures with expected patch base
					"sap-ui-debug": "sap/chart/Chart"
				},
				ui5: {
					libs: [
						"sap.ui.comp", "sap.ui.fl"
					]
				}
			},
			"ExploredSamples": {
				group: "ExploredSamples",
				module: "./ExploredSamples.qunit", //overwrite default --> different folder layer
				autostart: false
			},
			"Setters": {
				group: "Setters",
				module: "./Setters.qunit",
				autostart: false
			},
			"smarttable/SmartTable": {
				group: "SmartTable",
				coverage: {
					only: "sap/ui/comp/smarttable/SmartTable.js"
				},
				ui5: {
					theme: "sap_horizon"
				}
			},
			"smarttable/opaTests/SmartTableRTA.opa": {
				group: "SmartTable",
				ui5: {
					resourceroots: {
						"test.sap.ui.comp.smarttable": "test-resources/sap/ui/comp/smarttable"
					},
					theme: "sap_horizon"
				}
			},
			"smarttable/opaTests/SmartTableExportJourney.opa": {
				group: "SmartTable",
				ui5: {
					resourceroots: {
						"test.sap.ui.comp.smarttable": "test-resources/sap/ui/comp/smarttable"
					},
					theme: "sap_horizon"
				}
			},
			"smarttable/opaTests/SmartTableShowHideDetailsJourney.opa": {
				group: "SmartTable",
				ui5: {
					resourceroots: {
						"test.sap.ui.comp.smarttable": "test-resources/sap/ui/comp/smarttable"
					},
					theme: "sap_horizon"
				}
			},
			"smartlist/SmartList": {
				group: "SmartList",
				coverage: {
					only: "sap/ui/comp/smartlist/SmartList.js"
				}
			},
			"state/UIState": {
				group: "state",
				coverage: {
					only: "sap/ui/comp/state/UIState.js"
				}
			},
			"designtime/Designtime": {
				group: "DesignTime",
				module: "./designtime/Designtime.qunit"
			},
			"designtime/Library": {
				group: "DesignTime",
				module: "./designtime/Library.qunit",
				sinon: false
			},
			"designtime/Designtime_SmartTable": {
				group: "DesignTime",
				module: "./designtime/Designtime_SmartTable.qunit"
			},
			"smartfield/flexibility/SmartFieldWriteDelegate": {
				group: "Flexibility",
				coverage: {
					only: "sap/ui/comp/smartfield/flexibility/SmartFieldWriteDelegate"
				},
				ui5: {
					resourceroots: {
						"sap.ui.comp.test.flexibility": "test-resources/sap/ui/comp/qunit/smartfield/flexibility/testdata/"
					},
					language: "en"
				}
			},
			"config/condition/DateRangeType": {
				group: "Condition",
				coverage: {
					only: [
						"sap/ui/comp/config/condition/Type.js",
						"sap/ui/comp/config/condition/DateRangeType.js"
					]
				}
			},
			"util/MultiUnitUtil": {
				skip: Device.system.phone,
				group: "Util",
				coverage: {
					only: "sap/ui/comp/util/MultiUnitUtil.js"
				}
			},
			"util/FormatUtil": {
				group: "Util",
				coverage: {
					only: "sap/ui/comp/util/FormatUtil.js"
				}
			},
			"util/DateTimeUtil": {
				group: "Util",
				coverage: {
					only: "sap/ui/comp/util/DateTimeUtil.js"
				}
			},
			"util/FilterUtil": {
				group: "Util",
				coverage: {
					only: "sap/ui/comp/util/FilterUtil.js"
				}
			},
			"util/SharedUtil": {
				group: "Util",
				coverage: {
					only: "sap/ui/comp/util/SharedUtil.js"
				}
			},
			"util/TableUtil": {
				group: "Util",
				coverage: {
					only: "sap/ui/comp/util/TableUtil.js"
				}
			},
			"type/Interval": {
				group: "Type",
				module: "./type/Interval.qunit",
				sinon: false,
				coverage: {
				  only: "sap/ui/comp/type/Interval.js"
				}
			 },
			"SmartFilterBar/Timezone": {
				group: "SmartFilterBar Timezone Testsuite",
				page: "test-resources/sap/ui/comp/qunit/smartcontrolstimezone/testsuite.smartfilterbar.timezone.qunit.html"
			},
			"SmartTable/Timezone": {
				group: "SmartTable Timezone Testsuite",
				page: "test-resources/sap/ui/comp/qunit/smartcontrolstimezone/testsuite.smarttable.timezone.qunit.html"
			},
			"SmartChart/Timezone": {
				group: "SmartChart Timezone Testsuite",
				page: "test-resources/sap/ui/comp/qunit/smartcontrolstimezone/testsuite.smartchart.timezone.qunit.html"
			}
		}
	};

	return oUnitTest;
});
