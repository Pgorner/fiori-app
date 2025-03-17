/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/core/Element"], function(Element){
	"use strict";

	/**
	 *  Constructor for a new Stock Chart Period
	 *
	 * @param {string} [sId] ID of the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * <p>
	 * StockChartPeriod is used by <code>sap.gantt.simple.StockChart</code>
	 * It represents a time period that a specific stock usages
	 * </p>
	 *
	 * <p> StockChartPeriod is defined as an aggregation of <code>sap.gantt.simple.StockChartDimension</code>
	 *
	 * @extends sap.ui.core.Element
	 *
	 * @author SAP SE
	 * @version 1.132.0
	 *
	 * @constructor
	 * @public
	 * @alias sap.gantt.simple.StockChartPeriod
	 */
	var StockChartPeriod = Element.extend("sap.gantt.simple.StockChartPeriod", {
		metadata: {
			library: "sap.gantt",
			properties: {

				/**
				 * from date time of period
				 */
				from: {type: "object"},

				/**
				 * to date time of period
				 */
				to: {type: "object"},

				/**
				 * The value of the actual consumption capacity.
				 */
				value: {type: "float",  group: "Data", defaultValue: 0 }
			}
		}
	});

	return StockChartPeriod;

}, /**bExport*/true);
