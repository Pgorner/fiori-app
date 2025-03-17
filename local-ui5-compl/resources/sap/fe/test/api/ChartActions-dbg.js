/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(
	["./BaseAPI", "sap/fe/test/Utils", "sap/ui/test/OpaBuilder", "sap/fe/test/builder/FEBuilder"],
	function (BaseAPI, Utils, OpaBuilder) {
		"use strict";

		/**
		 * Constructs a new ChartActions instance.
		 *
		 * TODO this API does not fit the criteria for public API and needs some rework. Not considered critical for apps though.
		 * @param {sap.fe.test.builder.FEBuilder} oBuilderInstance  The {@link sap.fe.test.builder.FEBuilder} instance used to interact with the UI
		 * @param {string} [vChartDescription] Description (optional) of the chart to be used for logging messages
		 * @returns {sap.fe.test.api.ChartActions} The new instance
		 * @class
		 * @private
		 */
		var Actions = function (oBuilderInstance, vChartDescription) {
			return BaseAPI.call(this, oBuilderInstance, vChartDescription);
		};
		Actions.prototype = Object.create(BaseAPI.prototype);
		Actions.prototype.constructor = Actions;
		Actions.prototype.isAction = true;

		/**
		 * Selects the specified rows.
		 * @param {object} [mRowValues] a map of columns (either name or index) to its value, e.g. <code>{ 0: "Max", "Last Name": "Mustermann" }</code>
		 * @param {object} [mRowState] a map of states. Supported row states are
		 * <code><pre>
		 * 	{
		 * 		selected: true|false,
		 * 		focused: true|false
		 * 	}
		 * </pre></code>
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @private
		 */

		Actions.prototype.iSelectItems = function (innerData, bClearSelection) {
			if (typeof bClearSelection === "boolean") {
				bClearSelection = !!bClearSelection;
			} else {
				bClearSelection = true;
			}
			return OpaBuilder.create(this)
				.hasType("sap.chart.Chart")
				.check(function (oChart) {
					var bResult;
					var vizFrame = oChart[0]._getVizFrame();
					if (vizFrame) {
						var data = innerData
							? [
									{
										data: innerData
									}
							  ]
							: [];
						bResult = vizFrame.vizSelection(data, {
							clearSelection: bClearSelection
						});
					}
					return bResult;
				}, true)
				.description("Do not see the First Column Expand Button")
				.execute();
		};

		Actions.prototype.iChangeChartType = function (sType) {
			return OpaBuilder.create(this)
				.hasType("sap.ui.core.Icon")
				.hasProperties({
					src: "sap-icon://vertical-bar-chart"
				})
				.doPress()
				.success(function () {
					return OpaBuilder.create(this)
						.hasType("sap.m.StandardListItem")
						.hasProperties({
							icon: "sap-icon://horizontal-bar-chart"
						})
						.doPress()
						.description("blablabla")
						.execute();
				})
				.description("Opened the Dialog")
				.execute();
		};

		Actions.prototype.iDrillDown = function (sDimension) {
			return OpaBuilder.create(this)
				.hasType("sap.m.Button")
				.hasProperties({
					text: "View By"
				})
				.doPress()
				.success(function () {
					return OpaBuilder.create(this)
						.hasType("sap.m.StandardListItem")
						.hasProperties({
							title: sDimension
						})
						.doPress()
						.description("blablabla")
						.execute();
				})
				.description("Opened the Dialog")
				.execute();
		};

		Actions.prototype.iExecuteActionWithText = function (sText) {
			return OpaBuilder.create(this)
				.hasType("sap.m.Button")
				.hasProperties({
					text: sText
				})
				.doPress()
				.description("Clicked on button" + sText)
				.execute();
		};

		return Actions;
	}
);
