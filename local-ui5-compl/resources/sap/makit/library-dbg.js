/*!
 * SAPUI5
 * (c) Copyright 2009-2024 SAP SE. All rights reserved.
 */

/*
 * Initialization Code and shared classes of library sap.makit.
 */
sap.ui.define([
	"sap/ui/core/Core",
	"sap/ui/core/library"
], function(Core, coreLibrary) {
	"use strict";

	/**
	 * Mobile Chart controls based on the Sybase MAKIT charting lib.
	 *
	 * @namespace
	 * @alias sap.makit
	 * @deprecated Since version 1.38.
	 * MAKIT charts have been replaced with sap.viz and vizFrame in 1.38. This library will not be supported anymore from 1.38.
	 * @public
	 */

	var thisLib = sap.ui.getCore().initLibrary({
		name : "sap.makit",
		dependencies : ["sap.ui.core"],
		types: [
			"sap.makit.ChartType",
			"sap.makit.LegendPosition",
			"sap.makit.SortOrder",
			"sap.makit.ValueBubblePosition",
			"sap.makit.ValueBubbleStyle"
		],
		interfaces: [],
		controls: [
			"sap.makit.Chart",
			"sap.makit.CombinationChart"
		],
		elements: [
			"sap.makit.Axis",
			"sap.makit.Category",
			"sap.makit.CategoryAxis",
			"sap.makit.Column",
			"sap.makit.Layer",
			"sap.makit.MakitLib",
			"sap.makit.Row",
			"sap.makit.Series",
			"sap.makit.Value",
			"sap.makit.ValueAxis",
			"sap.makit.ValueBubble"
		],
		version: "1.132.1"
	});

	/**
	 * Enumeration for chart type
	 *
	 * @author SAP SE
	 * @enum {string}
	 * @public
	 * @since 1.8
	 * @deprecated Since version 1.38.
	 * MAKIT charts have been replaced with sap.viz and vizFrame in 1.38. This control will not be supported anymore from 1.38.
	 */
	thisLib.ChartType = {

		/**
		 * Column chart
		 * @public
		 */
		Column : "Column",

		/**
		 * Line chart
		 * @public
		 */
		Line : "Line",

		/**
		 * Bubble chart
		 * @public
		 */
		Bubble : "Bubble",

		/**
		 * Horizontal table bar chart
		 * @public
		 */
		Bar : "Bar",

		/**
		 * Pie chart
		 * @public
		 */
		Pie : "Pie",

		/**
		 * Donut chart
		 * @public
		 */
		Donut : "Donut",

		/**
		 * Stacked column chart
		 * @public
		 */
		StackedColumn : "StackedColumn",

		/**
		 * 100% stacked column chart
		 * @public
		 */
		HundredPercentStackedColumn : "HundredPercentStackedColumn",

		/**
		 * Waterfall Column chart
		 * @public
		 */
		WaterfallColumn : "WaterfallColumn",

		/**
		 * Waterfall Bar chart
		 * @public
		 */
		WaterfallBar : "WaterfallBar"

	};
	/**
	 * Enumeration for legend position.
	 *
	 * @author SAP SE
	 * @enum {string}
	 * @public
	 * @deprecated Since version 1.38.
	 * MAKIT charts have been replaced with sap.viz and vizFrame in 1.38. This control will not be supported anymore from 1.38.
	 */
	thisLib.LegendPosition = {

		/**
		 * Legend location is on the top of the chart
		 * @public
		 */
		Top : "Top",

		/**
		 * Legend location is on the left of the chart
		 * @public
		 */
		Left : "Left",

		/**
		 * Legend location is on the bottom of the chart
		 * @public
		 */
		Bottom : "Bottom",

		/**
		 * Legend location is on the right of the chart
		 * @public
		 */
		Right : "Right",

		/**
		 * Hide the legend
		 * @public
		 */
		None : "None"

	};
	/**
	 * Enumeration for sort order
	 *
	 * @author SAP SE
	 * @enum {string}
	 * @public
	 * @since 1.8
	 * @deprecated Since version 1.38.
	 * MAKIT charts have been replaced with sap.viz and vizFrame in 1.38. This control will not be supported anymore from 1.38.
	 */
	thisLib.SortOrder = {

		/**
		 * Ascending sort
		 * @public
		 */
		Ascending : "Ascending",

		/**
		 * Descending sort
		 * @public
		 */
		Descending : "Descending",

		/**
		 * Partially sort
		 * @public
		 */
		Partial : "Partial",

		/**
		 * No sorting
		 * @public
		 */
		None : "None"

	};
	/**
	 * Position for Value Bubble only applies to Pie/Donut Chart.
	 *
	 * @author SAP SE
	 * @enum {string}
	 * @public
	 * @since 1.8
	 * @deprecated Since version 1.38.
	 * MAKIT charts have been replaced with sap.viz and vizFrame in 1.38. This control will not be supported anymore from 1.38.
	 */
	thisLib.ValueBubblePosition = {

		/**
		 * Value Bubble position set to above the chart
		 * @public
		 */
		Top : "Top",

		/**
		 * Value Bubble position set to beside the chart
		 * @public
		 */
		Side : "Side"

	};
	/**
	 * Enumeration for Value Bubble's positioning style. This applies all chart types except Pie/Donut/HBar chart.
	 *
	 * @author SAP SE
	 * @enum {string}
	 * @public
	 * @since 1.8
	 * @deprecated Since version 1.38.
	 * MAKIT charts have been replaced with sap.viz and vizFrame in 1.38. This control will not be supported anymore from 1.38.
	 */
	thisLib.ValueBubbleStyle = {

		/**
		 * The Value Bubble snaps above of the chart, the chart height will adjust accordingly.
		 * @public
		 */
		Top : "Top",

		/**
		 * The Value Bubble floats on the touch point, chart's size will not change.
		 * @public
		 */
		Float : "Float",

		/**
		 * The Value Bubble floats and snaps above of the chart, chart's size will not change.
		 * @public
		 */
		FloatTop : "FloatTop"

	};

	return thisLib;
});