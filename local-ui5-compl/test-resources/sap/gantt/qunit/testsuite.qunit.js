sap.ui.define(function() {

	"use strict";

	return {
		name: "QUnit TestSuite for sap.gantt 1.x",

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
			group: "Control",
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
					"sap.gantt"
				],                          // Libraries to load upfront in addition to the library which is tested (sap.ui.table), if null no libs are loaded
				"xx-waitForTheme": true     // Whether the start of the test should be delayed until the theme is applied
			},
			coverage: {
				only:	["sap/gantt"],      // Which files to show in the coverage report, if null, no files are excluded from coverage
				branchCoverage: true        // Whether to enable standard branch coverage
			},
			loader: {
				paths: {
					"sap/ui/core/qunit": "test-resources/sap/ui/core/qunit/",
					"sap/gantt/qunit": "test-resources/sap/gantt/qunit/",
					"sap/gantt/test/shape": "test-resources/sap/gantt/shape/"
				}
			},
			page: "test-resources/sap/gantt/qunit/teststarter.qunit.html?test={name}",
			autostart: true                 // Whether to call QUnit.start() when the test setup is done
		},
		tests: {
			// "designtime/Library": {
			// 	group: "designtime",
			// 	module: "./designtime/Library.qunit",
			// 	sinon: true
			// },
			/**
			 * @deprecated Since version 1.64
			 */
			"axistime/AxisTimeStrategyBase": {
				group: "Zooming",
				sinon: true
			},
			/**
			 * @deprecated Since version 1.64
			 */
			"axistime/FullScreenStrategy": {
				group: "Zooming",
				ui5: {
					libs: ["sap.gantt"]
				},
				sinon: false
			},
			/**
			 * @deprecated Since version 1.64
			 */
			"axistime/ProportionZoomStrategy": {
				group: "Zooming",
				ui5: {
					libs: ["sap.gantt"]
				},
				sinon: true
			},
			/**
			 * @deprecated Since version 1.64
			 */
			"axistime/StepwiseZoomStrategy": {
				group: "Zooming",
				ui5: {
					libs: ["sap.gantt"]
				},
				sinon: false
			},
			/**
			 * @deprecated Since version 1.64
			 */
			"config/ChartScheme": {
				group: "Shape Configuration Elements"
			},
			/**
			 * @deprecated Since version 1.64
			 */
			"config/ColumnAttribute": {
				group: "Shape Configuration Elements"
			},
			/**
			 * @deprecated Since version 1.64
			 */
			"config/ContainerLayout": {
				group: "Shape Configuration Elements"
			},
			/**
			 * @deprecated Since version 1.64
			 */
			"config/ExpandChart": {
				group: "Shape Configuration Elements"
			},
			/**
			 * @deprecated Since version 1.64
			 */
			"config/ExpandChartGroup":{
				group: "Shape Configuration Elements"
			},
			/**
			 * @deprecated Since version 1.64
			 */
			"config/GanttChartLayout":{
				group: "Shape Configuration Elements"
			},
			/**
			 * @deprecated Since version 1.64
			 */
			"config/Hierarchy":{
				group: "Shape Configuration Elements"
			},
			/**
			 * @deprecated Since version 1.64
			 */
			"config/HierarchyColumn":{
				group: "Shape Configuration Elements"
			},
			/**
			 * @deprecated Since version 1.64
			 */
			"config/LayoutGroup":{
				group: "Shape Configuration Elements"
			},
			"config/Locale":{
				group: "Shape Configuration Elements"
			},
			/**
			 * @deprecated Since version 1.64
			 */
			"config/Mode":{
				group: "Shape Configuration Elements"
			},
			/**
			 * @deprecated Since version 1.64
			 */
			"config/ModeGroup":{
				group: "Shape Configuration Elements"
			},
			/**
			 * @deprecated Since version 1.64
			 */
			"config/ObjectType":{
				group: "Shape Configuration Elements"
			},
			/**
			 * @deprecated Since version 1.64
			 */
			"config/SettingGroup":{
				group: "Shape Configuration Elements"
			},
			"config/SettingItem":{
				group: "Shape Configuration Elements"
			},
			/**
			 * @deprecated Since version 1.64
			 */
			"config/Shape":{
				group: "Shape Configuration Elements"
			},
			/**
			 * @deprecated Since version 1.44
			 */
			"config/TimeAxis":{
				group: "Shape Configuration Elements"
			},
			"config/TimeHorizon":{
				group: "Shape Configuration Elements"
			},
			/**
			 * @deprecated Since version 1.64
			 */
			"config/ToolbarGroup":{
				group: "Shape Configuration Elements"
			},
			/**
			 * @deprecated Since version 1.64
			 */
			"config/ToolbarScheme":{
				group: "Shape Configuration Elements"
			},
			/**
			 * @deprecated Since version 1.64
			 */
			"control/AssociateContainerLegend": {
				group: "Inner Control",
				ui5: {
					libs: ["sap.gantt", "sap.m"]
				}
			},
			/**
			 * @deprecated Since version 1.64
			 */
			"control/Cell": {
				group: "Inner Control"
			},
			/**
			 * @deprecated Since version 1.64
			 */
			"control/Toolbar": {
				group: "Inner Control"
			},

			"def/cal/Calendar": {
				group: "SVG Def"
			},
			"def/cal/TimeInterval": {
				group: "SVG Def"
			},

			"def/filter/MorphologyFilter": {
				group: "SVG Def"
			},
			"def/gradient/LinearGradient": {
				group: "SVG Def"
			},
			"def/gradient/RadialGradient": {
				group: "SVG Def"
			},
			"def/pattern/Slash": {
				group: "SVG Def"
			},

			/**
			 * @deprecated since 1.84
			*/
			"drawer/AdhocLine": {
				group: "Drawer",
				sinon: true
			},
			"drawer/CalendarPattern": {
				group: "Drawer"
			},
			"drawer/CursorLine": {
				group: "Drawer",
				sinon: true
			},
			"drawer/NowLine": {
				group: "Drawer",
				sinon: true
			},
			/**
			 * @deprecated Since version 1.64
			 */
			"drawer/ShapeCrossRow": {
				group: "Drawer"
			},
			/**
			 * @deprecated Since version 1.44
			 */
			"drawer/VerticalLine": {
				group: "Drawer",
				ui5: {
					libs: ["sap.gantt"]
				}
			},
			/**
			 * @deprecated Since version 1.64
			 */
			"misc/AxisOrdinal": {
				group: "Miscellaneous"
			},
			/**
			 * @deprecated Since version 1.64
			 */
			"misc/AxisTime": {
				group: "Miscellaneous"
			},
			"misc/Format": {
				group: "Miscellaneous"
			},
			"misc/RelativeTimeFormatter": {
				group: "Miscellaneous"
			},
			/**
			 * @deprecated Since version 1.44
			 */
			"misc/RTL": {
				group: "Miscellaneous",
				ui5: {
					rtl: true
				}
			},
			/**
			 * @deprecated Since version 1.44
			 */
			"misc/ShapeSelectionBehavior": {
				group: "Miscellaneous"
			},
			/**
			 * @deprecated Since version 1.44
			 */
			"misc/ShapeSelectionModel": {
				group: "Miscellaneous",
				sinon: true
			},
			/**
			 * @deprecated Since version 1.64
			 */
			"misc/Utility": {
				group: "Miscellaneous"
			},
			// "misc/UtilityDatum": {
			// 	group: "Miscellaneous"
			// },
			/**
			 * @deprecated Since version 1.64
			 */
			"shape/Circle": {
				"group": "Shape Element"
			},
			/**
			 * @deprecated Since version 1.64
			 */
			"shape/ClipPath": {
				"group": "Shape Element"
			},
			/**
			 * @deprecated Since version 1.64
			 */
			"shape/Line": {
				"group": "Shape Element"
			},
			/**
			 * @deprecated Since version 1.64
			 */
			"shape/Path": {
				"group": "Shape Element"
			},
			/**
			 * @deprecated Since version 1.64
			 */
			"shape/Polygon": {
				"group": "Shape Element"
			},
			/**
			 * @deprecated Since version 1.64
			 */
			"shape/Polyline": {
				"group": "Shape Element"
			},
			/**
			 * @deprecated Since version 1.64
			 */
			"shape/Rectangle": {
				"group": "Shape Element"
			},
			/**
			 * @deprecated Since version 1.64
			 */
			"shape/ResizeShadowShape": {
				"group": "Shape Element"
			},
			/**
			 * @deprecated Since version 1.64
			 */
			"shape/SelectedShape": {
				"group": "Shape Element"
			},
			/**
			 * @deprecated Since version 1.64
			 */
			"shape/Shape": {
				"group": "Shape Element"
			},
			/**
			 * @deprecated Since version 1.64
			 */
			"shape/Text": {
				"group": "Shape Element"
			},
			/**
			 * @deprecated Since version 1.64
			 */
			"shape/cal/Calendar": {
				"group": "Shape Element"
			},
			/**
			 * @deprecated Since version 1.64
			 */
			"shape/ext/Chevron": {
				"group": "Shape Element"
			},
			/**
			 * @deprecated Since version 1.64
			 */
			"shape/ext/Cursor": {
				"group": "Shape Element"
			},
			/**
			 * @deprecated Since version 1.64
			 */
			"shape/ext/Diamond": {
				"group": "Shape Element"
			},
			/**
			 * @deprecated Since version 1.64
			 */
			"shape/ext/Iconfont": {
				"group": "Shape Element"
			},
			/**
			 * @deprecated Since version 1.64
			 */
			"shape/ext/Pentangle": {
				"group": "Shape Element"
			},
			/**
			 * @deprecated Since version 1.64
			 */
			"shape/ext/TextRepeat": {
				"group": "Shape Element"
			},
			/**
			 * @deprecated Since version 1.64
			 */
			"shape/ext/Triangle": {
				"group": "Shape Element"
			},
			/**
			 * @deprecated Since version 1.64
			 */
			"shape/ext/ubc/UbcBorderPath": {
				"group": "Shape Element"
			},
			/**
			 * @deprecated Since version 1.64
			 */
			"shape/ext/ubc/UbcOverCapacityZonePolygon": {
				"group": "Shape Element"
			},
			/**
			 * @deprecated Since version 1.64
			 */
			"shape/ext/ubc/UbcShortageCapacityPolygon": {
				"group": "Shape Element"
			},
			/**
			 * @deprecated Since version 1.64
			 */
			"shape/ext/ubc/UbcTooltipRectangle": {
				"group": "Shape Element"
			},
			/**
			 * @deprecated Since version 1.64
			 */
			"shape/ext/ubc/UbcUnderCapacityZonePolygon": {
				"group": "Shape Element"
			},
			/**
			 * @deprecated Since version 1.64
			 */
			"shape/ext/ubc/UbcUsedPolygon": {
				"group": "Shape Element"
			},
			/**
			 * @deprecated Since version 1.64
			 */
			"shape/ext/ulc/UlcBorderPath": {
				"group": "Shape Element"
			},
			/**
			 * @deprecated Since version 1.64
			 */
			"shape/ext/ulc/UlcClipingPath": {
				"group": "Shape Element"
			},
			/**
			 * @deprecated Since version 1.64
			 */
			"shape/ext/ulc/UlcMiddleLine": {
				"group": "Shape Element"
			},
			/**
			 * @deprecated Since version 1.64
			 */
			"shape/ext/ulc/UlcOverCapacityZoneRectangle": {
				"group": "Shape Element"
			},
			/**
			 * @deprecated Since version 1.64
			 */
			"shape/ext/ulc/UlcOverClipRectangle": {
				"group": "Shape Element"
			},
			/**
			 * @deprecated Since version 1.64
			 */
			"shape/ext/ulc/UlcRectangle": {
				"group": "Shape Element"
			},
			/**
			 * @deprecated Since version 1.64
			 */
			"shape/ext/ulc/UlcTooltipRectangle": {
				"group": "Shape Element"
			},
			/**
			 * @deprecated Since version 1.64
			 */
			"shape/ext/ulc/UlcUnderClipRectangle": {
				"group": "Shape Element"
			},
			/**
			 * @deprecated Since version 1.64
			 */
			"AsyncLoading": {},
			/**
			 * @deprecated since 1.84
			*/
			"AdhocLine": {},
			// "AutoScrollHandler": {
			// 	ui5: {
			// 		libs: ["sap.gantt", "sap.ui.table"]
			// 	}
			// },

			/**
			 * @deprecated Since version 1.64
			 */
			"BirdEyeHandler": {},
			/**
			 * @deprecated since 1.63
			*/
			"ChartEvent": {},
			"CustomizedDataType": {
				ui5: {
					libs: ["sap.gantt"]
				}
			},
			"DateFormatConstant": {
				ui5: {
					libs: ["sap.gantt"]
				}
			},
			/**
			 * @deprecated Since version 1.64
			 */
			"GanttChart": {},
			/**
			 * @deprecated Since version 1.64
			 */
			"GanttChartContainer": {},
			/**
			 * @deprecated Since version 1.64
			 */
			"Special-ID-and-Type-OData": {
				module: "./GanttChartWithTable_oData_SpecifiedIdAndType.qunit",
				sinon: false /*uses Mockserver*/
			},
			/**
			 * @deprecated Since version 1.64
			 */
			"Special-ID-and-Type-JSON": {
				module: "./GanttChartWithTable_SpecifiedIdAndType.qunit"
			},
			/**
			 * @deprecated Since version 1.64
			 */
			"GanttChartWithTable": {},
			/**
			 * @deprecated Since version 1.64
			 */
			"MouseWheelHandler": {
				ui5: {
					libs: ["sap.gantt"]
				}
			},
			/**
			 * @deprecated Since version 1.64
			 */
			"Relationship": {},
			/**
			 * @deprecated Since version 1.64
			 */
			"RelationshipRTL": {
				ui5: {
					rtl: true
				}
			},
			/**
			 * @deprecated Since version 1.64
			 */
			"setTableProperties": {},
			/**
			 * @deprecated Since version 1.64
			 */
			"TableReference": {
				ui5: {
					libs: ["sap.gantt"]
				}
			},
			/**
			 * @deprecated Since version 1.64
			 */
			"TimePeriodZoomHandler": {
				ui5: {
					libs: ["sap.gantt"]
				}
			},
			"layouts/SidePanel": {
				group: "Layouts",
				ui5: {
					libs: ["sap.gantt"]
				},
				coverage: {
					only: ["sap/gantt/layouts/SidePanel"]
				}
			}
		}
	};
});
