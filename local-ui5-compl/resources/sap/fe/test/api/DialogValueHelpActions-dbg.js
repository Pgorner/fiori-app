/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(
	[
		"./DialogActions",
		"sap/fe/test/Utils",
		"sap/ui/test/OpaBuilder",
		"sap/fe/test/builder/FEBuilder",
		"sap/fe/test/builder/MdcFilterBarBuilder",
		"sap/fe/test/builder/MdcTableBuilder",
		"sap/fe/test/builder/MdcFieldBuilder",
		"./FilterBarAPI",
		"./TableAPI"
	],
	function (DialogActions, Utils, OpaBuilder, FEBuilder, FilterBarBuilder, TableBuilder, FieldBuilder, FilterBarAPI, TableAPI) {
		"use strict";

		/**
		 * Constructs a new DialogValueHelpActions instance.
		 * @param {sap.fe.test.builder.DialogBuilder} oDialogBuilder The {@link sap.fe.test.builder.DialogBuilder} instance used to interact with the UI
		 * @param {string} [vDialogDescription] Description (optional) of the dialog to be used for logging messages
		 * @returns {sap.fe.test.api.DialogValueHelpActions} The new instance
		 * @extends sap.fe.test.api.DialogActions
		 * @alias sap.fe.test.api.DialogValueHelpActions
		 * @hideconstructor
		 * @class
		 * @public
		 */
		var DialogValueHelpActions = function (oDialogBuilder, vDialogDescription) {
			return DialogActions.call(this, oDialogBuilder, vDialogDescription, 0);
		};
		DialogValueHelpActions.prototype = Object.create(DialogActions.prototype);
		DialogValueHelpActions.prototype.constructor = DialogValueHelpActions;
		DialogValueHelpActions.prototype.isAction = true;

		/**
		 * Navigates to the <code>Search and Select</code> tab.
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, that can be used for chaining statements
		 * @public
		 */
		DialogValueHelpActions.prototype.iGoToSearchAndSelect = function () {
			return this.prepareResult(
				FEBuilder.create(this.getOpaInstance())
					.isDialogElement()
					.hasType("sap.m.IconTabFilter")
					.has(FEBuilder.Matchers.id(/-VHP--fromList$/))
					.doPress()
					.description(Utils.formatMessage("Going to 'Search and Select' on value help dialog '{0}'", this.getIdentifier()))
					.execute()
			);
		};

		/**
		 * Navigates to the <code>Define Conditions</code> tab.
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, that can be used for chaining statements
		 * @public
		 */
		DialogValueHelpActions.prototype.iGoToDefineConditions = function () {
			return this.prepareResult(
				FEBuilder.create(this.getOpaInstance())
					.isDialogElement()
					.hasType("sap.m.IconTabFilter")
					.has(FEBuilder.Matchers.id(/-VHP--defineCondition$/))
					.doPress()
					.description(Utils.formatMessage("Going to 'Define Conditions' on value help dialog '{0}'", this.getIdentifier()))
					.execute()
			);
		};

		/**
		 * Clicks the <code>Hide/Show Filters</code> button.
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, that can be used for chaining statements
		 * @public
		 */
		DialogValueHelpActions.prototype.iExecuteShowHideFilters = function () {
			return this.prepareResult(
				FEBuilder.create(this.getOpaInstance())
					.isDialogElement()
					.hasType("sap.m.Button")
					.has(FEBuilder.Matchers.id(/::FilterBar-btnShowFilters$/))
					.doPress()
					.description(Utils.formatMessage("Pressing 'Show/Hide Filters' on value help dialog '{0}'", this.getIdentifier()))
					.execute()
			);
		};

		/**
		 * Changes the value of the search field.
		 * @param {string} [sSearchText] The new search value.
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, that can be used for chaining statements
		 * @public
		 */
		DialogValueHelpActions.prototype.iChangeSearchField = function (sSearchText) {
			var oFilterBarBuilder = FilterBarBuilder.create(this.getOpaInstance())
				.isDialogElement()
				.hasType("sap.ui.mdc.filterbar.vh.FilterBar");

			return this.prepareResult(
				oFilterBarBuilder
					.doChangeSearch(sSearchText)
					.description("Entering search text " + sSearchText)
					.execute()
			);
		};

		/**
		 * Starts the search.
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, that can be used for chaining statements
		 * @public
		 */
		DialogValueHelpActions.prototype.iExecuteSearch = function () {
			var oFilterBarBuilder = FilterBarBuilder.create(this.getOpaInstance())
				.isDialogElement()
				.hasType("sap.ui.mdc.filterbar.vh.FilterBar");

			return this.prepareResult(oFilterBarBuilder.doSearch().description("Starting value help search field search").execute());
		};

		/**
		 * Resets the search field value.
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, that can be used for chaining statements
		 * @public
		 */
		DialogValueHelpActions.prototype.iResetSearchField = function () {
			var oFilterBarBuilder = FilterBarBuilder.create(this.getOpaInstance())
				.isDialogElement()
				.hasType("sap.ui.mdc.filterbar.vh.FilterBar");

			return this.prepareResult(oFilterBarBuilder.doResetSearch().description("Resetting value help search field").execute());
		};

		/**
		 * Changes the value of a filter field.
		 * @param {string | sap.fe.test.api.FilterFieldIdentifier} vFieldIdentifier The identifier of the filter field
		 * @param {string} [vValue] The new target value.
		 * @param {boolean} [bClearFirst] Set to <code>true</code> to clear previously set filters, otherwise all previously set values will be kept
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, that can be used for chaining statements
		 * @public
		 */
		DialogValueHelpActions.prototype.iChangeFilterField = function (vFieldIdentifier, vValue, bClearFirst) {
			var aArguments = Utils.parseArguments([[String, Object], String, Boolean], arguments),
				oFilterBarBuilder = FilterBarBuilder.create(this.getOpaInstance())
					.isDialogElement()
					.hasType("sap.ui.mdc.filterbar.vh.FilterBar"),
				oFieldBuilder = FilterBarAPI.createFilterFieldBuilder(oFilterBarBuilder, aArguments[0]);

			return this.prepareResult(
				oFieldBuilder
					.doChangeValue(aArguments[1], aArguments[2])
					.description(
						Utils.formatMessage(
							"Changing the filter field '{1}' of value help dialog '{0}' by adding '{2}' (was cleared first: {3})",
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
		 * Selects the specified rows.
		 * @param {object | number} [vRowValues] Defines the row values of the target row. The pattern is:
		 * <code><pre>
		 * 	{
		 * 		&lt;column-name-or-index>: &lt;expected-value>
		 *  }
		 * </pre></code>
		 * Alternatively, the 0-based row index can be used.
		 * @param {object} [mState] Defines the expected state of the row
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, that can be used for chaining statements
		 * @public
		 */
		DialogValueHelpActions.prototype.iSelectRows = function (vRowValues, mState) {
			var aArguments = Utils.parseArguments([[Object, Number], Object], arguments),
				oTableBuilder = TableBuilder.createWrapper(this.getOpaInstance(), "sap.ui.table.Table").isDialogElement();
			return this.prepareResult(
				oTableBuilder
					.doSelectValueHelpTableRows(TableAPI.createRowMatchers(aArguments[0], aArguments[1]))
					.description(
						Utils.formatMessage(
							"Selecting rows of table in value help dialog '{0}' with values='{1}' and state='{2}'",
							this.getIdentifier(),
							aArguments[0],
							aArguments[1]
						)
					)
					.execute()
			);
		};

		/**
		 * Adds a new condition.
		 * @param {string} sOperator The condition operator, like EQ, BT, LT, GT (see also {@link sap.ui.model.filter.FilterOperator})
		 * @param {string | string[]} vValues The values to be set. If the operator requires more than one value, like BT (between),
		 * an array with the two entries is expected
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, that can be used for chaining statements
		 * @public
		 */
		DialogValueHelpActions.prototype.iAddCondition = function (sOperator, vValues) {
			return this.iChangeCondition(sOperator || "EQ", vValues, -1);
		};

		/**
		 * Changes an existing condition.
		 * @param {string} sOperator The condition operator, like EQ, BT, LT, GT (see also {@link sap.ui.model.filter.FilterOperator})
		 * @param {string | string[]} vValues The values to be set. If the operator requires more than one value like BT (between)
		 * an array with the two entries is expected
		 * @param {number} [iConditionIndex] The index of the condition to be altered. If not set, the index 0 is used
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, that can be used for chaining statements
		 * @public
		 */
		DialogValueHelpActions.prototype.iChangeCondition = function (sOperator, vValues, iConditionIndex) {
			iConditionIndex = iConditionIndex || 0;
			var bIsEmpty = vValues === undefined;
			vValues = bIsEmpty || Array.isArray(vValues) ? vValues : [vValues];
			var oCondition = {
				operator: sOperator,
				values: vValues,
				isEmpty: bIsEmpty,
				validated: "NotValidated"
			};
			return this.prepareResult(
				FEBuilder.create(this.getOpaInstance())
					.isDialogElement()
					.hasType("sap.ui.mdc.field.DefineConditionPanel")
					.do(function (oConditionsPanel) {
						var aConditions = [].concat(oConditionsPanel.getConditions());
						if (iConditionIndex === -1) {
							aConditions.push(oCondition);
						} else {
							aConditions[iConditionIndex] = oCondition;
						}
						oConditionsPanel.setConditions(aConditions);
					})
					.description(
						Utils.formatMessage(
							"Changing {1} on value help dialog '{0}' to '{2}'",
							this.getIdentifier(),
							iConditionIndex === -1 ? "newly added condition" : "condition at index " + iConditionIndex,
							oCondition
						)
					)
					.execute()
			);
		};

		/**
		 * Removes an existing condition.
		 * @param {number} [iConditionIndex] The index of the condition to be removed. If not set, the index 0 is used
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, that can be used for chaining statements
		 * @public
		 */
		DialogValueHelpActions.prototype.iRemoveCondition = function (iConditionIndex) {
			iConditionIndex = iConditionIndex || 0;
			return this.prepareResult(
				FEBuilder.create(this.getOpaInstance())
					.isDialogElement()
					.hasType("sap.ui.mdc.field.DefineConditionPanel")
					.do(function (oConditionsPanel) {
						var aConditions = [].concat(oConditionsPanel.getConditions());
						aConditions.splice(iConditionIndex, 1);
						oConditionsPanel.setConditions(aConditions);
					})
					.description(
						Utils.formatMessage(
							"Removing condition at index {1} on value help dialog '{0}'",
							this.getIdentifier(),
							iConditionIndex
						)
					)
					.execute()
			);
		};

		return DialogValueHelpActions;
	}
);
