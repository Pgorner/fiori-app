/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(
	[
		"./FilterBarAPI",
		"sap/fe/test/Utils",
		"sap/fe/test/builder/FEBuilder",
		"sap/ui/test/OpaBuilder",
		"sap/fe/macros/filterBar/DraftEditState"
	],
	function (FilterBarAPI, Utils, FEBuilder, OpaBuilder, EditState) {
		"use strict";

		/**
		 * Constructs a new FilterBarAssertions instance.
		 * @param {sap.fe.test.builder.FilterBarBuilder} oFilterBarBuilder The {@link sap.fe.test.builder.FilterBarBuilder} instance used to interact with the UI
		 * @param {string} [vFilterBarDescription] Description (optional) of the filter bar to be used for logging messages
		 * @returns {sap.fe.test.api.FilterBarAssertions} The new instance
		 * @alias sap.fe.test.api.FilterBarAssertions
		 * @class
		 * @extends sap.fe.test.api.FilterBarAPI
		 * @hideconstructor
		 * @public
		 */
		var FilterBarAssertions = function (oFilterBarBuilder, vFilterBarDescription) {
			return FilterBarAPI.call(this, oFilterBarBuilder, vFilterBarDescription);
		};
		FilterBarAssertions.prototype = Object.create(FilterBarAPI.prototype);
		FilterBarAssertions.prototype.constructor = FilterBarAssertions;
		FilterBarAssertions.prototype.isAction = false;

		/**
		 * Checks the filter bar.
		 * @param {object} [mFilterBarState] Defines the expected state of the filter bar
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */
		FilterBarAssertions.prototype.iCheckState = function (mFilterBarState) {
			var oFilterBarBuilder = this.getBuilder(),
				sDescription = this.getIdentifier();

			if (sDescription) {
				oFilterBarBuilder.description(
					Utils.formatMessage("Checking filter bar '{0}' for state='{1}'", this.getIdentifier(), mFilterBarState)
				);
			}

			return this.prepareResult(oFilterBarBuilder.hasState(mFilterBarState).execute());
		};

		/**
		 * Checks a filter field.
		 * If <code>vConditionValues</code> is <code>undefined</code>, the current condition values are ignored.
		 * @param {object | sap.fe.test.api.FilterFieldIdentifier} vFieldIdentifier The identifier of the filter field
		 * @param {string|object|Array} [vConditionValues] The expected value(s) of the filter field
		 * @param {string} [sOperator] The expected operator
		 * @param {object} [mState] Defines the expected state of the filter field
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */
		FilterBarAssertions.prototype.iCheckFilterField = function (vFieldIdentifier, vConditionValues, sOperator, mState) {
			var aArguments = Utils.parseArguments([[String, Object], [String, Array, Object, Boolean], String, Object], arguments),
				oFieldBuilder = FilterBarAPI.createFilterFieldBuilder(this.getBuilder(), aArguments[0], aArguments[3]);

			if (!aArguments[3] || aArguments[3].visible !== false) {
				oFieldBuilder.hasValue(aArguments[1], aArguments[2]);
			}

			return this.prepareResult(
				oFieldBuilder
					.description(
						Utils.formatMessage(
							"Checking the field '{1}' of filter bar '{0}' for condition values='{2}' and operator='{3}' and state='{4}'",
							this.getIdentifier(),
							aArguments[0],
							aArguments[1],
							aArguments[2],
							aArguments[3]
						)
					)
					.execute()
			);
		};

		/**
		 * Checks if the focus is on the filter field.
		 * @param {string} [sFilterFieldLabel] The field label
		 * @returns {object} The result of the {@link sa p.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */

		FilterBarAssertions.prototype.iSeeFocusOnFilterField = function (sFilterFieldLabel) {
			var oFilterBarBuilder = this.getBuilder();
			return this.prepareResult(
				oFilterBarBuilder
					.hasFocusOnFilterField(sFilterFieldLabel)
					.description(Utils.formatMessage("Checking focus on Filter Field '{0}' ", sFilterFieldLabel))
					.execute()
			);
		};

		/**
		 * Checks if the focus is on the Go Button of the filter bar.
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */

		FilterBarAssertions.prototype.iSeeFocusOnGoButton = function () {
			var oFilterBarBuilder = this.getBuilder();
			return this.prepareResult(
				oFilterBarBuilder.hasFocusOnGoButton().description(Utils.formatMessage("Checking focus on the Go Button' ")).execute()
			);
		};

		/**
		 * Checks the search field in the filter bar. If the <code>sSearchText</code> parameter is <code>undefined</code>, the search text is not validated.
		 * @param {string} [sSearchText] The expected text in the search field
		 * @param {object} [mState] Defines the expected state of the search field
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */
		FilterBarAssertions.prototype.iCheckSearchField = function (sSearchText, mState) {
			var aArguments = Utils.parseArguments([String, Object], arguments),
				oFilterBarBuilder = this.getBuilder();
			return this.prepareResult(
				oFilterBarBuilder
					.hasSearchField(aArguments[0], aArguments[1])
					.description(
						Utils.formatMessage(
							"Checking the search field on filter bar '{0}' having search text '{1}' and state='{2}'",
							this.getIdentifier(),
							aArguments[0] || "",
							aArguments[1]
						)
					)
					.execute()
			);
		};

		/**
		 * Check the filter field for the editing status.
		 * @param {sap.fe.test.api.EditState} [sEditState] The expected edit state value
		 * @param {object} [mFieldState] Defines the expected state of the filter field
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */
		FilterBarAssertions.prototype.iCheckEditingStatus = function (sEditState, mFieldState) {
			var aArguments = Utils.parseArguments([String, Object], arguments),
				oFilterBarBuilder = this.getBuilder();
			return this.prepareResult(
				oFilterBarBuilder
					.hasEditingStatus(aArguments[0] && EditState[aArguments[0]], aArguments[1])
					.description(
						Utils.formatMessage(
							"Checking the editing status of filter bar '{0}' for value='{1}' and state='{2}'",
							this.getIdentifier(),
							aArguments[0] && EditState[aArguments[0]].display,
							aArguments[1]
						)
					)
					.execute()
			);
		};

		/**
		 * Checks the search button.
		 * @param {object} [mState] Defines the expected state of the Go button
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */
		FilterBarAssertions.prototype.iCheckSearch = function (mState) {
			var oFilterBarBuilder = this.getBuilder();
			return this.prepareResult(
				oFilterBarBuilder
					.hasProperties({ showGoButton: !mState || mState.visible === undefined ? true : mState.visible })
					.description(Utils.formatMessage("Checking search on filter bar '{0}' for state='{1}'", this.getIdentifier(), mState))
					.execute()
			);
		};

		/**
		 * Checks whether the filter adaptation dialog is open.
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */
		FilterBarAssertions.prototype.iCheckFilterAdaptation = function () {
			var oAdaptationPopoverBuilder = FEBuilder.createPopoverBuilder(
				this.getOpaInstance(),
				OpaBuilder.Matchers.resourceBundle("title", "sap.ui.mdc", "filterbar.ADAPT_TITLE")
			);
			return this.prepareResult(
				oAdaptationPopoverBuilder
					.description(Utils.formatMessage("Checking filter adaptation dialog for filter bar '{0}'", this.getIdentifier()))
					.execute()
			);
		};

		/**
		 * Checks a field in the adaptation dialog.
		 * @param {string | sap.fe.test.api.FilterFieldIdentifier} vFieldIdentifier The identifier of the filter field, or its label
		 * @param {object} [mState] Defines the expected state of the filter field in the adaptation dialog
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */
		FilterBarAssertions.prototype.iCheckAdaptationFilterField = function (vFieldIdentifier, mState) {
			return this.filterFieldAdaptation(
				vFieldIdentifier,
				mState,
				Utils.formatMessage(
					"Checking adaptation filter field '{1}' on filter bar '{0}' for state='{2}'",
					this.getIdentifier(),
					vFieldIdentifier,
					mState
				)
			);
		};

		FilterBarAssertions.prototype.iCheckVisualFilterSelections = function (sVisualFilterIdentifier, aLabelValues) {
			return this.prepareResult(
				OpaBuilder.create(this)
					.hasType("sap.fe.macros.controls.filterbar.VisualFilter")
					.check(function (aVisualFilters) {
						var oVisualFilter;
						for (var i = 0; i < aVisualFilters.length; i++) {
							if (
								aVisualFilters[i]
									.getParent()
									.getId()
									.indexOf("FilterField::" + sVisualFilterIdentifier) > -1
							) {
								oVisualFilter = aVisualFilters[i];
								break;
							}
						}
						var oInteractiveChart = oVisualFilter.getItems()[1].getItems()[0];
						var aSelectedItems =
							(oInteractiveChart.isA("sap.suite.ui.microchart.InteractiveLineChart") &&
								oInteractiveChart.getSelectedPoints()) ||
							(oInteractiveChart.isA("sap.suite.ui.microchart.InteractiveBarChart") && oInteractiveChart.getSelectedBars());
						var aSelectedValues = [];
						aSelectedItems.forEach(function (oItem) {
							aSelectedValues.push(oItem.getLabel());
						});
						aLabelValues.sort();
						aSelectedValues.sort();
						if (aLabelValues.length !== aSelectedValues.length) {
							return false;
						}
						for (var j = 0; j < aLabelValues.length; j++) {
							if (aLabelValues[j] !== aSelectedValues[j]) {
								return false;
							}
						}
						return true;
					})
					.description("Checking Selections of " + sVisualFilterIdentifier + " VisualFilter")
					.execute()
			);
		};

		FilterBarAssertions.prototype.iCheckVisualFilterTitleAndToolTip = function (sVisualFilterIdentifier, sTitle, sToolTip) {
			return this.prepareResult(
				OpaBuilder.create(this)
					.hasType("sap.fe.macros.controls.filterbar.VisualFilter")
					.check(function (aVisualFilters) {
						var oVisualFilter;
						for (var i = 0; i < aVisualFilters.length; i++) {
							if (
								aVisualFilters[i]
									.getParent()
									.getId()
									.indexOf("FilterField::" + sVisualFilterIdentifier) > -1
							) {
								oVisualFilter = aVisualFilters[i];
								break;
							}
						}
						var sMeasureDimensionTitle = oVisualFilter.getItems()[0].getItems()[0].getContent()[0];
						var sScaleUOMTitle = oVisualFilter.getItems()[0].getItems()[0].getContent()[1];
						var sScaleUOMTitleText = sScaleUOMTitle ? sScaleUOMTitle.getText() : " | ";
						return (
							sTitle ===
								sMeasureDimensionTitle.getText() +
									(sScaleUOMTitleText === " " || sScaleUOMTitleText === " | " ? "" : sScaleUOMTitle.getText()) &&
							sToolTip === sMeasureDimensionTitle.getTooltip()
						);
					})
					.description("Checking Title and Tooltip of " + sVisualFilterIdentifier + " VisualFilter")
					.execute()
			);
		};

		FilterBarAssertions.prototype.iCheckVisualFilterValueHelp = function (sVisualFilterIdentifier, iCount) {
			return this.prepareResult(
				OpaBuilder.create(this)
					.hasType("sap.fe.macros.controls.filterbar.VisualFilter")
					.check(function (aVisualFilters) {
						var oVisualFilter;
						for (var i = 0; i < aVisualFilters.length; i++) {
							if (
								aVisualFilters[i]
									.getParent()
									.getId()
									.indexOf("FilterField::" + sVisualFilterIdentifier) > -1
							) {
								oVisualFilter = aVisualFilters[i];
								break;
							}
						}
						var sValueHelp = oVisualFilter.getItems()[0].getItems()[0].getContent()[3];
						var sValueHelpCount = sValueHelp ? sValueHelp.getText() : undefined;
						return sValueHelp && sValueHelpCount === iCount;
					})
					.description("Checking Value Help and its count of " + sVisualFilterIdentifier + " VisualFilter")
					.execute()
			);
		};

		FilterBarAssertions.prototype.iCheckVisualFilterCriticality = function (sVisualFilterIdentifier, sLabelValue, sCriticality) {
			return this.prepareResult(
				OpaBuilder.create(this)
					.hasType("sap.fe.macros.controls.filterbar.VisualFilter")
					.check(function (aVisualFilters) {
						var oVisualFilter;
						for (var i = 0; i < aVisualFilters.length; i++) {
							if (
								aVisualFilters[i]
									.getParent()
									.getId()
									.indexOf("FilterField::" + sVisualFilterIdentifier) > -1
							) {
								oVisualFilter = aVisualFilters[i];
								break;
							}
						}
						var oInteractiveChart = oVisualFilter.getItems()[1].getItems()[0];
						var aItems =
							(oInteractiveChart.isA("sap.suite.ui.microchart.InteractiveLineChart") && oInteractiveChart.getPoints()) ||
							(oInteractiveChart.isA("sap.suite.ui.microchart.InteractiveBarChart") && oInteractiveChart.getBars());
						for (var j = 0; j < aItems.length; j++) {
							if (aItems[j].getLabel() === sLabelValue && aItems[j].getColor() === sCriticality) {
								return true;
							}
						}
						return false;
					})
					.description("Checking Criticality of " + sLabelValue + " Item")
					.execute()
			);
		};

		FilterBarAssertions.prototype.iCheckVisualFilterValues = function (sVisualFilterIdentifier, aValues) {
			return this.prepareResult(
				OpaBuilder.create(this)
					.hasType("sap.fe.macros.controls.filterbar.VisualFilter")
					.check(function (aVisualFilters) {
						var oVisualFilter;
						for (var i = 0; i < aVisualFilters.length; i++) {
							if (
								aVisualFilters[i]
									.getParent()
									.getId()
									.indexOf("FilterField::" + sVisualFilterIdentifier) > -1
							) {
								oVisualFilter = aVisualFilters[i];
								break;
							}
						}
						var oInteractiveChart = oVisualFilter.getItems()[1].getItems()[0];
						var aItems =
							(oInteractiveChart.isA("sap.suite.ui.microchart.InteractiveLineChart") && oInteractiveChart.getPoints()) ||
							(oInteractiveChart.isA("sap.suite.ui.microchart.InteractiveBarChart") && oInteractiveChart.getBars());
						if (aItems.length !== aValues.length) {
							return false;
						}
						for (var j = 0; j < aItems.length; j++) {
							if (aItems[j].getDisplayedValue() !== aValues[j]) {
								return false;
							}
						}
						return true;
					})
					.description("Checking Values of " + sVisualFilterIdentifier + " VisualFilter")
					.execute()
			);
		};

		FilterBarAssertions.prototype.iCheckErrorMessageAndTitle = function (sVisualFilterIdentifier, sErrorMessage, sErrorMessageTitle) {
			return this.prepareResult(
				OpaBuilder.create(this)
					.hasType("sap.fe.macros.controls.filterbar.VisualFilter")
					.check(function (aVisualFilters) {
						var oVisualFilter;
						for (var i = 0; i < aVisualFilters.length; i++) {
							if (
								aVisualFilters[i]
									.getParent()
									.getId()
									.indexOf("FilterField::" + sVisualFilterIdentifier) > -1
							) {
								oVisualFilter = aVisualFilters[i];
								break;
							}
						}
						var oInteractiveChart = oVisualFilter.getItems()[1].getItems()[0];
						var sText = oInteractiveChart.getErrorMessage();
						var sTitle = oInteractiveChart.getErrorMessageTitle();
						return sText === sErrorMessage && sTitle === sErrorMessageTitle;
					})
					.description("Checking error message and title of " + sVisualFilterIdentifier + " VisualFilter")
					.execute()
			);
		};

		FilterBarAssertions.prototype.iCheckIsVisualFilterRequired = function (sVisualFilterIdentifier) {
			return this.prepareResult(
				OpaBuilder.create(this)
					.hasType("sap.fe.macros.controls.filterbar.VisualFilter")
					.check(function (aVisualFilters) {
						var oVisualFilter;
						for (var i = 0; i < aVisualFilters.length; i++) {
							if (
								aVisualFilters[i]
									.getParent()
									.getId()
									.indexOf("FilterField::" + sVisualFilterIdentifier) > -1
							) {
								oVisualFilter = aVisualFilters[i];
								break;
							}
						}
						var oLabel = oVisualFilter.getItems()[0].getItems()[0].getContent()[0];
						return oLabel.isA("sap.m.Label") && oLabel.getVisible() && oLabel.getRequired();
					})
					.description("Checking Whether " + sVisualFilterIdentifier + " VisualFilter is Mandatory")
					.execute()
			);
		};

		return FilterBarAssertions;
	}
);
