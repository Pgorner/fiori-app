/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(
	["./FEBuilder", "sap/fe/test/Utils", "sap/ui/test/OpaBuilder", "sap/fe/test/builder/DialogBuilder", "sap/ui/test/Opa5"],
	function (FEBuilder, Utils, OpaBuilder, DialogBuilder, Opa5) {
		"use strict";

		var FilterBarBuilder = function () {
			return FEBuilder.apply(this, arguments);
		};

		FilterBarBuilder.create = function (oOpaInstance) {
			return new FilterBarBuilder(oOpaInstance);
		};

		FilterBarBuilder.prototype = Object.create(FEBuilder.prototype);
		FilterBarBuilder.prototype.constructor = FilterBarBuilder;

		FilterBarBuilder.createAdaptationDialogBuilder = function (oOpaInstance) {
			return DialogBuilder.create(oOpaInstance).hasAggregation("customHeader");
		};

		FilterBarBuilder.prototype.hasField = function (vFieldMatcher, mState, bReturnField) {
			var aArguments = Utils.parseArguments([[Array, Object, Function], Object, Boolean], arguments);
			vFieldMatcher = aArguments[0];
			mState = aArguments[1];
			bReturnField = aArguments[2];

			if (mState) {
				var vStatesMatcher = this.getStatesMatcher(mState);
				if (mState.visible === false) {
					// when checking for not visible, the either no field exists or existing field is not visible (like the provided state)
					return this.hasSome(
						OpaBuilder.Matchers.not(OpaBuilder.Matchers.aggregationMatcher("filterItems", vFieldMatcher)),
						OpaBuilder.Matchers.aggregationMatcher("filterItems", [vStatesMatcher].concat(vFieldMatcher || []))
					);
				}
				vFieldMatcher = [vStatesMatcher].concat(vFieldMatcher || []);
			}

			return bReturnField
				? this.has(OpaBuilder.Matchers.aggregation("filterItems", vFieldMatcher)).has(FEBuilder.Matchers.atIndex(0))
				: this.has(OpaBuilder.Matchers.aggregationMatcher("filterItems", vFieldMatcher));
		};

		FilterBarBuilder.prototype.hasFocusOnFilterField = function (sFieldLabel) {
			return this.has(function (oFilterBar) {
				var oTestCore = Opa5.getWindow().sap.ui.require("sap/ui/core/Core"),
					sFocusedEltId = oTestCore.getCurrentFocusedControlId();
				var oFilterItem = oFilterBar.getFilterItems().find(function (elt) {
					return elt.getLabel() === sFieldLabel;
				});
				return sFocusedEltId.includes(oFilterItem.getId());
			});
		};

		FilterBarBuilder.prototype.hasFocusOnGoButton = function () {
			return this.has(function (oFilterBar) {
				var oTestCore = Opa5.getWindow().sap.ui.require("sap/ui/core/Core"),
					sFocusedEltId = oTestCore.getCurrentFocusedControlId(),
					sSearchButtonId = oFilterBar.getId() + "-btnSearch";
				return sFocusedEltId === sSearchButtonId;
			});
		};

		FilterBarBuilder.prototype.hasEditingStatus = function (oEditState, mState) {
			var fnEditStateMatcher = OpaBuilder.Matchers.resourceBundle("label", "sap.fe.macros", "FILTERBAR_EDITING_STATUS");
			if (mState && "visible" in mState && mState.visible === false) {
				return this.has(function (oFilterBar) {
					return !oFilterBar.getFilterItems().some(FEBuilder.Matchers.match(fnEditStateMatcher));
				});
			}

			var aFilterItemsMatchers = [fnEditStateMatcher];
			if (oEditState) {
				aFilterItemsMatchers.push(
					OpaBuilder.Matchers.hasAggregation("contentEdit", OpaBuilder.Matchers.properties("selectedKey", oEditState.id))
				);
			}
			if (mState && Object.keys(mState).length) {
				aFilterItemsMatchers.push(FEBuilder.Matchers.states(mState));
			}

			return this.hasAggregation("filterItems", aFilterItemsMatchers);
		};

		FilterBarBuilder.prototype.hasSearchField = function (sSearchText, mState) {
			var aMatchers = [];
			if (mState) {
				if (mState.visible === false) {
					return this.has(function (oFilterBar) {
						return !oFilterBar.getBasicSearchField();
					});
				}
				aMatchers.push(FEBuilder.Matchers.states(mState));
			}
			if (sSearchText) {
				aMatchers.push(OpaBuilder.Matchers.properties({ value: sSearchText }));
			}

			return this.hasAggregation("basicSearchField", aMatchers);
		};

		FilterBarBuilder.prototype.doChangeEditingStatus = function (vEditState) {
			var fnEditStateMatcher = OpaBuilder.Matchers.resourceBundle("label", "sap.fe.macros", "FILTERBAR_EDITING_STATUS");
			return this.doOnAggregation("filterItems", fnEditStateMatcher, OpaBuilder.Actions.enterText(vEditState.display));
		};

		FilterBarBuilder.prototype.doChangeSearch = function (sSearchText) {
			return this.doOnAggregation("basicSearchField", OpaBuilder.Actions.enterText(sSearchText || ""));
		};

		FilterBarBuilder.prototype.doResetSearch = function () {
			return this.doOnAggregation("basicSearchField", OpaBuilder.Actions.press("inner-reset"));
		};

		FilterBarBuilder.prototype.doSearch = function () {
			return this.doPress("btnSearch");
		};

		FilterBarBuilder.prototype.doOpenSettings = function () {
			return this.doPress("btnAdapt");
		};

		return FilterBarBuilder;
	}
);
