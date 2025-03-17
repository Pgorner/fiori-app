/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(
	[
		"./FilterBarAPI",
		"sap/fe/test/Utils",
		"sap/fe/macros/filterBar/DraftEditState",
		"sap/fe/test/builder/FEBuilder",
		"sap/ui/test/Opa5",
		"sap/ui/test/OpaBuilder",
		"sap/fe/test/builder/VMBuilder"
	],
	function (FilterBarAPI, Utils, EditState, FEBuilder, Opa5, OpaBuilder, VMBuilder) {
		"use strict";

		/**
		 * Constructs a new FilterBarActions instance.
		 * @param {sap.fe.test.builder.FilterBarBuilder} oFilterBarBuilder The {@link sap.fe.test.builder.FilterBarBuilder} instance used to interact with the UI
		 * @param {string} [vFilterBarDescription] Description (optional) of the filter bar to be used for logging messages
		 * @returns {sap.fe.test.api.FilterBarActions} The new instance
		 * @alias sap.fe.test.api.FilterBarActions
		 * @class
		 * @extends sap.fe.test.api.FilterBarAPI
		 * @hideconstructor
		 * @public
		 */
		var FilterBarActions = function (oFilterBarBuilder, vFilterBarDescription) {
			return FilterBarAPI.call(this, oFilterBarBuilder, vFilterBarDescription);
		};
		FilterBarActions.prototype = Object.create(FilterBarAPI.prototype);
		FilterBarActions.prototype.constructor = FilterBarActions;
		FilterBarActions.prototype.isAction = true;

		/**
		 * Changes the value of the defined filter field.
		 * @param {string | sap.fe.test.api.FilterFieldIdentifier} vFieldIdentifier The identifier for the filter field
		 * @param {string} [vValue] The new target value
		 * @param {boolean} [bClearFirst] Set to <code>true</code> to clear previously set filters, otherwise all previously set values will be kept
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */
		FilterBarActions.prototype.iChangeFilterField = function (vFieldIdentifier, vValue, bClearFirst) {
			var aArguments = Utils.parseArguments([[String, Object], String, Boolean], arguments),
				oFieldBuilder = FilterBarAPI.createFilterFieldBuilder(this.getBuilder(), aArguments[0]);

			return this.prepareResult(
				oFieldBuilder
					.doChangeValue(aArguments[1], aArguments[2])
					.description(
						Utils.formatMessage(
							"Changing the filter field '{1}' of filter bar '{0}' by adding '{2}' (was cleared first: {3})",
							this.getIdentifier(),
							aArguments[0],
							aArguments[1],
							!!aArguments[2]
						)
					)
					.execute()
			);
		};

		/**
		 * Opens the value help of the given field.
		 * @param {string | sap.fe.test.api.FilterFieldIdentifier} vFieldIdentifier The identifier of the filter field
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, that can be used for chaining statements
		 * @public
		 */
		FilterBarActions.prototype.iOpenValueHelp = function (vFieldIdentifier) {
			var oFieldBuilder = FilterBarAPI.createFilterFieldBuilder(this.getBuilder(), vFieldIdentifier);
			return this.prepareResult(
				oFieldBuilder
					.doOpenValueHelp()
					.description(
						Utils.formatMessage(
							"Opening the value help for filter field '{1}' of filter bar '{0}'",
							this.getIdentifier(),
							vFieldIdentifier
						)
					)
					.execute()
			);
		};

		/**
		 * Changes the search field.
		 * @param {string} [sSearchText] The new search text
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */
		FilterBarActions.prototype.iChangeSearchField = function (sSearchText) {
			var oFilterBarBuilder = this.getBuilder();
			return this.prepareResult(
				oFilterBarBuilder
					.doChangeSearch(sSearchText)
					.description(
						Utils.formatMessage(
							"Changing the search text on filter bar '{0}' to '{1}'",
							this.getIdentifier(),
							sSearchText || ""
						)
					)
					.execute()
			);
		};

		/**
		 * Resets the search field.
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */
		FilterBarActions.prototype.iResetSearchField = function () {
			var oFilterBarBuilder = this.getBuilder();
			return this.prepareResult(
				oFilterBarBuilder
					.doResetSearch()
					.description(Utils.formatMessage("Resetting the search field on filter bar '{0}'", this.getIdentifier()))
					.execute()
			);
		};

		/**
		 * Changes the editing status filter field.
		 * @param {sap.fe.test.api.EditState} sEditState Value of an edit state
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */
		FilterBarActions.prototype.iChangeEditingStatus = function (sEditState) {
			var oFilterBarBuilder = this.getBuilder();
			return this.prepareResult(
				oFilterBarBuilder
					.doChangeEditingStatus(sEditState && EditState[sEditState])
					.description(
						Utils.formatMessage(
							"Changing the editing status on filter bar '{0}' to '{1}'",
							this.getIdentifier(),
							sEditState && EditState[sEditState].display
						)
					)
					.execute()
			);
		};

		/**
		 * Executes the search with the current filters.
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */
		FilterBarActions.prototype.iExecuteSearch = function () {
			var oFilterBarBuilder = this.getBuilder();
			return this.prepareResult(
				oFilterBarBuilder
					.doSearch()
					.description(Utils.formatMessage("Executing search on filter bar '{0}'", this.getIdentifier()))
					.execute()
			);
		};

		/**
		 * Adds a field as a filter field.
		 * @param {string | sap.fe.test.api.FilterFieldIdentifier} vFieldIdentifier The identifier of the field
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */
		FilterBarActions.prototype.iAddAdaptationFilterField = function (vFieldIdentifier) {
			return this.filterFieldAdaptation(
				vFieldIdentifier,
				{ selected: false },
				OpaBuilder.Actions.press("selectMulti"),
				Utils.formatMessage("Adding field '{1}' to filter bar '{0}'", this.getIdentifier(), vFieldIdentifier)
			);
		};

		/**
		 * Removes a field as a filter field.
		 * @param {string | sap.fe.test.api.FilterFieldIdentifier} vFieldIdentifier The identifier of the field
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */
		FilterBarActions.prototype.iRemoveAdaptationFilterField = function (vFieldIdentifier) {
			return this.filterFieldAdaptation(
				vFieldIdentifier,
				{ selected: true },
				OpaBuilder.Actions.press("selectMulti"),
				Utils.formatMessage("Removing field '{1}' to filter bar '{0}'", this.getIdentifier(), vFieldIdentifier)
			);
		};

		/**
		 * Executes a keyboard shortcut.
		 * @param {string} sShortcut Pattern for the shortcut
		 * @param {string | sap.fe.test.api.FilterFieldIdentifier} [vFieldIdentifier] The identifier of the field
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */
		FilterBarActions.prototype.iExecuteKeyboardShortcut = function (sShortcut, vFieldIdentifier) {
			var oBuilder = vFieldIdentifier
				? FilterBarAPI.createFilterFieldBuilder(this.getBuilder(), vFieldIdentifier)
				: this.getBuilder();
			return this.prepareResult(
				oBuilder
					.doPressKeyboardShortcut(sShortcut)
					.description(
						Utils.formatMessage(
							"Execute keyboard shortcut '{1}' on filter bar '{0}' on field '{2}'",
							this.getIdentifier(),
							sShortcut,
							vFieldIdentifier
						)
					)
					.execute()
			);
		};

		/**
		 * Saves a variant under the given name, or overwrites the current variant.
		 * @param {string} [sVariantName] The name of the new variant. If no new variant name is defined, the current variant will be overwritten.
		 * @param {string} [bSetAsDefault] Saves the new variant with option "Set as Default".
		 * @param {string} [bApplyAutomatically] Saves the new variant with option "Apply Automatically".
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */
		FilterBarActions.prototype.iSaveVariant = function (sVariantName, bSetAsDefault, bApplyAutomatically) {
			var fnSuccessFunction = Utils.isOfType(sVariantName, String)
				? function (oFilterBar) {
						return VMBuilder.create(this)
							.hasId(oFilterBar.getId() + "::VariantManagement")
							.doSaveAs(sVariantName, bSetAsDefault, bApplyAutomatically)
							.description(
								Utils.formatMessage(
									"Saving variant for '{0}' as '{1}' with default='{2}' and applyAutomatically='{3}'",
									this.getIdentifier(),
									sVariantName,
									!!bSetAsDefault,
									!!bApplyAutomatically
								)
							)
							.execute();
				  }
				: function (oFilterBar) {
						return VMBuilder.create(this)
							.hasId(oFilterBar.getId() + "::VariantManagement")
							.doSave()
							.description(Utils.formatMessage("Saving current variant for '{0}'", this.getIdentifier()))
							.execute();
				  };

			return this.prepareResult(this.getBuilder().success(fnSuccessFunction.bind(this)).execute());
		};

		/**
		 * Selects the chosen variant.
		 * @param {string} sVariantName The name of the variant to be selected
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */
		FilterBarActions.prototype.iSelectVariant = function (sVariantName) {
			return this.prepareResult(
				this.getBuilder()
					.success(
						function (oFilterBar) {
							return VMBuilder.create(this)
								.hasId(oFilterBar.getId() + "::VariantManagement")
								.doSelectVariant(sVariantName)
								.description(Utils.formatMessage("Selecting variant '{1}' from '{0}'", this.getIdentifier(), sVariantName))
								.execute();
						}.bind(this)
					)
					.execute()
			);
		};

		FilterBarActions.prototype.iSelectVisualFilter = function (sVisualFilterIdentifier, sLabelValue, bIsSelected) {
			// var that = this;
			return this.prepareResult(
				OpaBuilder.create(this)
					.hasType("sap.fe.macros.controls.filterbar.VisualFilter")
					.hasId(new RegExp(sVisualFilterIdentifier, "i"))
					.success(function (aVisualFilter) {
						var oVisualFilter = aVisualFilter[0];
						var selectItem;
						var oInteractiveChart = oVisualFilter.getItems()[1].getItems()[0];
						var aItems =
							(oInteractiveChart.isA("sap.suite.ui.microchart.InteractiveLineChart") && oInteractiveChart.getPoints()) ||
							(oInteractiveChart.isA("sap.suite.ui.microchart.InteractiveBarChart") && oInteractiveChart.getBars());
						aItems.forEach(function (oItem) {
							if (oItem.getLabel() == sLabelValue) {
								selectItem = oItem;
							}
						});
						if (!selectItem) {
							selectItem = aItems[0];
						}
						if (oInteractiveChart.isA("sap.suite.ui.microchart.InteractiveLineChart")) {
							var aLineChartPoints = oInteractiveChart.getSelectedPoints();
							return oInteractiveChart.fireSelectionChanged({
								selectedPoints: aLineChartPoints,
								point: selectItem,
								selected: bIsSelected
							});
						} else if (oInteractiveChart.isA("sap.suite.ui.microchart.InteractiveBarChart")) {
							var aBarChartPoints = oInteractiveChart.getSelectedBars();
							return oInteractiveChart.fireSelectionChanged({
								selectedPoints: aBarChartPoints,
								point: selectItem,
								selected: bIsSelected
							});
						}
					})
					.description("Selecting an item in " + sVisualFilterIdentifier + " VisualFilter")
					.execute()
			);
		};
		FilterBarActions.prototype.iOpenVisualFilterValueHelp = function (sVisualFilterIdentifier) {
			return this.prepareResult(
				OpaBuilder.create(this)
					.hasType("sap.fe.macros.controls.filterbar.VisualFilter")
					.hasId(new RegExp(sVisualFilterIdentifier, "i"))
					.success(function (aVisualFilter) {
						var sVFId = aVisualFilter[0].getId();
						OpaBuilder.create(this)
							.hasType("sap.m.Button")
							.hasId(sVFId + "::VisualFilterValueHelpButton")
							.doPress()
							.execute();
					})
					.description("Open ValueHelp Dialog " + sVisualFilterIdentifier + " VisualFilter")
					.execute()
			);
		};
		return FilterBarActions;
	}
);
