sap.ui.define(function () {

	"use strict";

	return {
		name: "QUnit TestSuite for sap.gantt.simple",

		/**
		 * An Object with default settings for all tests.
		 *
		 * The defaults and the test configuration will be merged recursively in a way
		 * that the merge contains properties from both, defaults and test config;
		 * if a property is defined by both config objects, the value from the test config will be used.
		 * There's no special handling for other types of values, e.g an array value in the defaults
		 * will be replaced by an array value in the test config.
		 */
		defaults: {
			group: "Default",
			qunit: {
				version: 2                  // Whether QUnit should be loaded and if so, what version
			},
			sinon: {
				version: 4                  // Whether Sinon should be loaded and if so, what version
			},
			ui5: {
				language: "en-US",
				rtl: false,                 // Whether to run the tests in RTL mode
				libs: [
					"sap.ui.table",
					"sap.m",
					"sap.ui.layout",
					"sap.tnt"
				],                          // Libraries to load upfront in addition to the library which is tested (sap.ui.table), if null no libs are loaded
				"xx-waitForTheme": true     // Whether the start of the test should be delayed until the theme is applied
			},
			coverage: {
				only: "[sap/gantt/simple]",   // Which files to show in the coverage report, if null, no files are excluded from coverage
				branchCoverage: true        // Whether to enable standard branch coverage
			},
			loader: {
				paths: {
					"sap/gantt/simple/test": "test-resources/sap/gantt/qunit/simple",
					"sap/gantt/test/simple": "test-resources/sap/gantt/simple",
					"sap/ui/core/qunit": "test-resources/sap/ui/core/qunit/"
				}
			},
			page: "test-resources/sap/gantt/qunit/simple/teststarter.qunit.html?test={name}",
			autostart: true                 // Whether to call QUnit.start() when the test setup is done
		},
		tests: {
			"shapes/Task" : {
				coverage: {
					only: ["sap/gantt/simple/shapes/Task"]
				}
			},
			"BaseCalendar": {
				group: "Shape",
				coverage: {
					only: null /*full report*/
				}
			},
			"BaseChevron": {
				coverage: {
					only: ["sap/gantt/simple/BaseChevron"]
				}
			},
			"BaseRectangle": {
				coverage: {
					only: ["sap/gantt/simple/BaseRectangle"]
				}
			},
			"BaseCursor": {
				coverage: {
					only: ["sap/gantt/simple/BaseCursor"]
				}
			},
			"BaseConditionalShape": {
				coverage: {
					only: ["sap/gantt/simple/BaseConditionalShape"]
				}
			},
			"BaseDiamond": {
				coverage: {
					only: ["sap/gantt/simple/BaseDiamond"]
				}
			},
			"BaseGroup": {
				coverage: {
					only: ["sap/gantt/simple/BaseGroup"]
				}
			},
			"BaseImage": {
				coverage: {
					only: ["sap/gantt/simple/BaseImage"]
				}
			},
			"BaseLine": {
				coverage: {
					only: ["sap/gantt/simple/BaseLine"]
				}
			},
			"BasePath": {
				coverage: {
					only: ["sap/gantt/simple/BasePath"]
				}
			},
			"BaseShape": {
				coverage: {
					only: ["sap/gantt/simple/BaseShape"]
				}
			},
			"BaseText": {
				coverage: {
					only: ["sap/gantt/simple/BaseText"]
				}
			},
			"ShapeStyle": {
				coverage: {
					only: ["sap/gantt/simple/ShapeStyle"]
				}
			},
			"DateTimeFormat": {},
			"DeltaLine": {
				coverage: {
					only: ["sap/gantt/simple/DeltaLine"]
				}
			},
			"DeltaLineRenderer": {
				coverage: {
					only: ["sap/gantt/simple/DeltaLineRenderer"]
				}
			},
			"BaseTriangle": {
				coverage: {
					only: ["sap/gantt/simple/BaseTriangle"]
				}
			},
			"BaseDeltaRectangle": {
				coverage: {
					only: ["sap/gantt/simple/BaseDeltaRectangle"]
				}
			},
			"ContainerToolbar": {
				coverage: {
					only: ["sap/gantt/simple/ContainerToolbar", "sap/gantt/simple/FindAndSelectUtils"]
				}
			},
			"ExpandModel": {
				coverage: {
					only: ["sap/gantt/simple/ExpandModel", "sap/gantt/simple/RenderUtils", "sap/gantt/simple/FindAndSelectUtils"]
				}
			},
			"GanttChartContainer": {
				coverage: {
					only: ["sap/gantt/simple/GanttChartContainer"]
				}
			},
			"GanttChartWithTable": {
				sinon: true,
				coverage: {
					only: ["sap/gantt/simple/GanttChartWithTable"]
				}
			},
			"GanttHeader": {
				coverage: {
					only: ["sap/gantt/simple/GanttHeader"]
				}
			},
			"GanttConnectExtension": {
				coverage: {
					only: ["sap/gantt/simple/GanttConnectExtension"]
				}
			},
			"GanttDragDropExtension": {
				coverage: {
					only: ["sap/gantt/simple/GanttDragDropExtension"]
				}
			},
			"GanttZoomExtension": {
				coverage: {
					only: ["sap/gantt/simple/GanttZoomExtension"]
				}
			},
			"GanttScrollExtension": {
				coverage: {
					only: ["sap/gantt/simple/GanttScrollExtension"]
				}
			},
			"GanttLassoExtension": {
				coverage: {
					only: ["sap/gantt/simple/GanttLassoExtension"]
				}
			},
			"GanttPointerExtension": {
				coverage: {
					only: ["sap/gantt/simple/GanttPointerExtension"]
				}
			},
			"GanttPopoverExtension": {
				coverage: {
					only: ["sap/gantt/simple/GanttPopoverExtension"]
				}
			},
			"GanttPrinting": {
				coverage: {
					only: ["sap/gantt/simple/GanttPrinting"]
				}
			},
			"GanttResizeExtension": {
				coverage: {
					only: ["sap/gantt/simple/GanttResizeExtension"]
				}
			},
			"GanttUtils": {
				coverage: {
					only: ["sap/gantt/simple/GanttUtils"]
				}
			},
			"UtilizationChart": {
				coverage: {
					only: ["sap/gantt/simple/UtilizationChart"]
				}
			},
			"StockChart": {
				coverage: {
					only: ["sap/gantt/simple/StockChart"]
				}
			},
			"GanttRowAction": {
				coverage: {
					only: ["sap/gantt/simple/GanttRowAction"]
				}
			},
			"GanttRowSettings": {
				coverage: {
					only: ["sap/gantt/simple/GanttRowSettings"]
				}
			},
			"RenderUtils": {
				coverage: {
					only: ["sap/gantt/simple/RenderUtils"]
				}
			},
			"InnerGanttChartRenderer": {
				coverage: {
					only: ["sap/gantt/simple/InnerGanttChartRenderer"]
				}
			},
			"LegendContainer": {
				coverage: {
					only: ["sap/gantt/simple/LegendContainer", "sap/gantt/simple/ListLegendRenderer"]
				}
			},
			"SelectionModel": {
				coverage: {
					only: ["sap/gantt/simple/SelectionModel"]
				}
			},
			"Relationship": {
				coverage: {
					only: ["sap/gantt/simple/Relationship"]
				}
			},
			"AdhocLine": {
				coverage: {
					only: ["sap/gantt/simple/AdhocLine", "sap/gantt/simple/AdhocDiamond"]
				}
			},
			"HighlightModel": {
				coverage: {
					only: ["sap/gantt/simple/HighlightModel"]
				}
			},
			"GanttChartInRTLMode": {
				sinon: true,
				coverage: {
					only: ["sap/gantt/simple/GanttChartInRTLMode"]
				}
			},
			"RenderUtilsInRTLMode": {
				sinon: true,
				coverage: {
					only: ["sap/gantt/simple/RenderUtilsInRTLMode"]
				}
			},
			"RelationshipInRTLMode": {
				sinon: true,
				coverage: {
					only: ["sap/gantt/simple/RelationshipInRTLMode"]
				}
			},
			"GanttResizeExtensionInRTLMode": {
				sinon: true,
				coverage: {
					only: ["sap/gantt/simple/GanttResizeExtensionInRTLMode"]
				}
			},
			"GanttConnectExtensionInRTL": {
				sinon: true,
				coverage: {
					only: ["sap/gantt/simple/GanttConnectExtensionInRTL"]
				}
			},
			"GanttDragDropExtensionInRTL": {
				sinon: true,
				coverage: {
					only: ["sap/gantt/simple/GanttDragDropExtensionInRTL"]
				}
			},
			"Memoizer": {
				sinon: true,
				coverage: {
					only: ["sap/gantt/simple/Memoizer"]
				}
			},
			"skipTime/WeekPattern": {
				coverage: {
					only: ["sap/gantt/skipTime/WeekPattern"]
				}
			},
			"skipTime/DayInterval": {
				sinon: true,
				coverage: {
					only: ["sap/gantt/skipTime/DayInterval"]
				}
			},
			"skipTime/SkipInterval": {
				sinon: true,
				coverage: {
					only: ["sap/gantt/skipTime/SkipInterval"]
				}
			},
			"PrintConfig": {
				coverage: {
					only: ["sap/gantt/simple/PrintConfig"]
				}
			},
			"misc/AxisTime": {
                                coverage: {
					only: ["sap/gantt/misc/AxisTime"]
				}
			},
			"axistime/AxisTimeStrategyBase": {
				sinon: true,
                                coverage: {
					only: ["sap/gantt/axistime/AxisTimeStrategyBase"]
				}
			},
			"axistime/FullScreenStrategy": {
				sinon: false,
                                coverage: {
					only: ["sap/gantt/axistime/FullScreenStrategy"]
				}
			},
			"axistime/ProportionZoomStrategy": {
				sinon: true,
                                coverage: {
					only: ["sap/gantt/axistime/ProportionZoomStrategy"]
				}
			},
			"axistime/StepwiseZoomStrategy": {
				sinon: true,
                                coverage: {
					only: ["sap/gantt/axistime/StepwiseZoomStrategy"]
				}
			},
			"GanttSearchSidePanel": {
				coverage: {
					only: ["sap/gantt/simple/GanttSearchSidePanel", "sap/gantt/simple/FindAndSelectUtils"]
				}
			}
		}
	};
});
