sap.ui.define(function() {

	"use strict";
	return {
		name: "TestSuite for sap.suite.ui.commons",
		defaults: {
			title: "{name} - sap.suite.ui.commons",
			bootCore: true,
			ui5: {
				libs: ["sap.suite.ui.commons"],
				theme: "sap_bluecrystal",
				noConflict: false,
				preload: "auto"
			},
			qunit: {
				version: 2,
				reorder: false
			},
			sinon: {
				version: "edge",
				qunitBridge: true,
				useFakeTimers: false
			},
			module: "./{name}.qunit"
		},
		tests: {
			/**
			 * @deprecated Since version 1.32
			 */
			BusinessCard: {
				ui5: {
					libs: ["sap.ui.commons", "sap.ui.ux3", "sap.suite.ui.commons"],
					language: "en"
				}
			},
			/**
			 * @deprecated Since version 1.25
			 */
			ChartTile: {
				title: "Chart Tile QUnit page",
				ui5: {
					libs: ["sap.m", "sap.suite.ui.commons"]
				}
			},
			/**
			 * @deprecated Since version 1.34
			 */
			ColumnMicroChart: {
				title: "ColumnMicroChart QUnit page",
				ui5: {
					libs: ["sap.m", "sap.suite.ui.microchart", "sap.suite.ui.commons"],
					theme: "sap_belize",
					"xx-waitForTheme": "init"
				}
			},
			/**
			 * @deprecated Since version 1.34
			 */
			ComparisonChart: {
				title: "Comparison Chart QUnit page",
				ui5: {
					libs: ["sap.m", "sap.suite.ui.microchart", "sap.suite.ui.commons"],
					theme: "sap_belize",
					"xx-waitForTheme": "init"
				}
			},
			/**
			 * @deprecated Since version 1.34
			 */
			DateRangeScroller: {},
			/**
			 * @deprecated Since version 1.34
			 */
			DateRangeSlider: {},
			/**
			 * @deprecated Since version 1.34
			 */
			DateRangeSliderInternal: {},
			/**
			 * @deprecated Since version 1.34
			 */
			DeltaMicroChart: {
				ui5: {
					libs: ["sap.m", "sap.ui.commons", "sap.suite.ui.microchart", "sap.suite.ui.commons"],
					theme: "sap_belize",
					language: "en",
					"xx-waitForTheme": "init"
				}
			},
			/**
			 * @deprecated Since version 1.34
			 */
			DynamicContainer: {
				ui5: {
					libs: ["sap.m", "sap.ui.commons", "sap.suite.ui.commons"],
					language: "en"
				}
			},
			/**
			 * @deprecated Since version 1.32
			 */
			FacetOverview: {
				ui5: {
					libs: ["sap.m", "sap.ui.commons", "sap.ui.ux3", "sap.suite.ui.commons"],
					language: "en"
				}
			},
			FeedAggregator: {},
			/**
			 * @deprecated Since version 1.25
			 */
			FeedItemHeader: {
				ui5: {
					libs: ["sap.m", "sap.ui.commons", "sap.suite.ui.commons"]
				}
			},
			FeedItemUtils: {},
			/**
			 * @deprecated Since version 1.25
			 */
			FeedTile: {
				ui5: {
					language: "en"
				}
			},
			/**
			 * @deprecated Since version 1.34
			 */
			GenericTile: {
				ui5: {
					libs: ["sap.m", "sap.suite.ui.commons"],
					theme: "sap_belize",
					language: "en"
				}
			},
			/**
			 * @deprecated Since version 1.34
			 */
			HarveyBallMicroChart: {
				ui5: {
					libs: ["sap.ui.commons", "sap.suite.ui.microchart", "sap.suite.ui.commons"],
					theme: "sap_belize",
					"xx-waitForTheme": "init"
				}
			},
			/**
			 * @deprecated Since version 1.44.0
			 */
			HeaderCell: {
				ui5: {
					libs: ["sap.suite.ui.commons"],
					theme: "sap_belize",
					language: "en"
				}
			},
			/**
			 * @deprecated Since version 1.44
			 */
			HeaderContainer: {
				ui5: {
					libs: ["sap.m", "sap.suite.ui.commons"],
					theme: "sap_belize",
					language: "en"
				}
			},
			/**
			 * @deprecated Since version 1.25
			 */
			InfoTile: {
				ui5: {
					libs: ["sap.m", "sap.ui.commons", "sap.suite.ui.commons"]
				}
			},
			/**
			 * @deprecated Since version 1.34
			 */
			JamContent: {
				ui5: {
					libs: ["sap.m", "sap.suite.ui.commons"],
					language: "en"
				}
			},
			/**
			 * @deprecated Since version 1.25
			 */
			LaunchTile: {
				ui5: {
					libs: ["sap.m", "sap.ui.commons", "sap.suite.ui.commons"]
				}
			},
			/**
			 * @deprecated Since version 1.32
			 */
			LinkActionSheet: {
				ui5: {
					libs: ["sap.m", "sap.ui.commons", "sap.suite.ui.commons"]
				}
			},
			/**
			 * @deprecated Since version 1.34
			 */
			MicroAreaChart: {
				ui5: {
					libs: ["sap.m", "sap.ui.commons", "sap.suite.ui.microchart", "sap.suite.ui.commons"],
					theme: "sap_belize",
					language: "en",
					"xx-waitForTheme": "init"
				}
			},
			/**
			 * @deprecated Since version 1.25
			 */
			MonitoringContent: {
				ui5: {
					libs: ["sap.m", "sap.suite.ui.commons"],
					language: "en"
				}
			},
			/**
			 * @deprecated Since version 1.25
			 */
			MonitoringTile: {
				ui5: {
					libs: ["sap.m", "sap.suite.ui.commons"],
					language: "en"
				}
			},
			/**
			 * @deprecated Since version 1.34
			 */
			NewsContent: {
				ui5: {
					libs: ["sap.m", "sap.suite.ui.commons"],
					language: "en"
				}
			},
			/**
			 * @deprecated Since version 1.32
			 */
			NoteTaker: {},
			/**
			 * @deprecated Since version 1.32
			 */
			NoteTakerCard: {
				ui5: {
					language: "en"
				}
			},
			/**
			 * @deprecated Since version 1.32
			 */
			NoteTakerFeeder: {
				ui5: {
					libs: ["sap.ui.commons", "sap.suite.ui.commons"],
					language: "en"
				}
			},
			/**
			 * @deprecated Since version 1.34
			 */
			NumericContent: {
				ui5: {
					libs: ["sap.m", "sap.suite.ui.commons"],
					theme: "sap_belize",
					language: "en"
				}
			},
			/**
			 * @deprecated Since version 1.25
			 */
			NumericTile: {
				ui5: {
					libs: ["sap.m", "sap.suite.ui.commons"],
					language: "en"
				}
			},
			/**
			 * @deprecated Since version 1.34
			 */
			PictureZoomIn: {
				ui5: {
					libs: ["sap.m", "sap.ui.commons", "sap.suite.ui.commons"],
					language: "en"
				}
			},
			/**
			 * @deprecated Since version 1.34
			 */
			SplitButton: {},
			/**
			 * @deprecated Since version 1.32
			 */
			ThingCollection: {
				ui5: {
					libs: ["sap.ui.commons", "sap.ui.ux3", "sap.suite.ui.commons"],
					language: "en"
				}
			},
			/**
			 *  @deprecated Since version 1.32
			 */
			ThreePanelThingInspector: {
				ui5: {
					libs: ["sap.ui.commons", "sap.ui.ux3", "sap.suite.ui.commons"]
				}
			},
			/**
			 * @deprecated Since version 1.32
			 */
			ThreePanelThingViewer: {
				ui5: {
					libs: ["sap.ui.commons", "sap.ui.ux3", "sap.suite.ui.commons"]
				}
			},
			/**
			 * @deprecated Since version 1.34
			 */
			TileContent: {
				ui5: {
					libs: ["sap.m", "sap.suite.ui.commons"],
					language: "en"
				}
			},
			/**
			 * @deprecated Since version 1.32
			 */
			UnifiedThingGroup: {},
			/**
			 * @deprecated Since version 1.32
			 */
			UnifiedThingInspector: {
				ui5: {
					libs: ["sap.m", "sap.ui.commons", "sap.suite.ui.commons"]
				}
			},
			/**
			 * @deprecated Since version 1.32
			 */
			VerticalNavigationBar: {
				ui5: {
					language: "en"
				}
			},
			/**
			 * @deprecated Since version 1.32
			 */
			ViewRepeater: {
				ui5: {
					libs: ["sap.ui.commons", "sap.ui.ux3", "sap.suite.ui.commons"],
					language: "en"
				}
			}
		}
	};
});
