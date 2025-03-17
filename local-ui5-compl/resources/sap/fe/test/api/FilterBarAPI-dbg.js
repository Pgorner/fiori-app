/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(
	[
		"./BaseAPI",
		"sap/fe/test/Utils",
		"sap/ui/test/OpaBuilder",
		"sap/ui/test/actions/Action",
		"sap/fe/test/builder/FEBuilder",
		"sap/fe/test/builder/MdcFilterBarBuilder",
		"sap/fe/test/builder/MdcFilterFieldBuilder"
	],
	function (BaseAPI, Utils, OpaBuilder, Action, FEBuilder, FilterBarBuilder, FilterFieldBuilder) {
		"use strict";

		/**
		 * A filter field identifier
		 * @typedef {object} FilterFieldIdentifier
		 * @property {string} property The name of the property
		 * @name sap.fe.test.api.FilterFieldIdentifier
		 * @public
		 */

		/**
		 * Constructs a new FilterBarAPI instance.
		 * @param {sap.fe.test.builder.FilterBarBuilder} oFilterBarBuilder The {@link sap.fe.test.builder.FilterBarBuilder} instance used to interact with the UI
		 * @param {string} [vFilterBarDescription] Description (optional) of the filter bar to be used for logging messages
		 * @returns {sap.fe.test.api.FilterBarAPI} The new instance
		 * @alias sap.fe.test.api.FilterBarAPI
		 * @class
		 * @hideconstructor
		 * @public
		 */
		var FilterBarAPI = function (oFilterBarBuilder, vFilterBarDescription) {
			if (!Utils.isOfType(oFilterBarBuilder, FilterBarBuilder)) {
				throw new Error("oFilterBarBuilder parameter must be a FilterBarBuilder instance");
			}
			return BaseAPI.call(this, oFilterBarBuilder, vFilterBarDescription);
		};
		FilterBarAPI.prototype = Object.create(BaseAPI.prototype);
		FilterBarAPI.prototype.constructor = FilterBarAPI;

		/**
		 * Retrieve a filter field by its identifier.
		 * @param {sap.fe.test.builder.FilterBarBuilder} oFilterBarBuilder The builder of the filter bar to which the field belongs
		 * @param {string | sap.fe.test.api.FilterFieldIdentifier} vFieldIdentifier The identifier of the field in the filter bar
		 * @param {any} mState
		 * @returns {sap.fe.test.builder.FilterFieldBuilder} The FieldBuilder instance
		 * @ui5-restricted
		 */
		FilterBarAPI.createFilterFieldBuilder = function (oFilterBarBuilder, vFieldIdentifier, mState) {
			var vFieldMatcher;

			if (Utils.isOfType(vFieldIdentifier, String)) {
				vFieldMatcher = OpaBuilder.Matchers.properties({ label: vFieldIdentifier });
			} else {
				vFieldMatcher = FEBuilder.Matchers.id(
					RegExp(Utils.formatMessage("::FilterField::{0}$", vFieldIdentifier.property.replace(/\/|\*\//g, "::")))
				);
			}
			oFilterBarBuilder.hasField(vFieldMatcher, mState, true);

			return FilterFieldBuilder.create(oFilterBarBuilder.getOpaInstance()).options(oFilterBarBuilder.build());
		};

		/**
		 * Opens the filter bar adaptation. It can be used in an action chain as well as in an assertion chain.
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */
		FilterBarAPI.prototype.iOpenFilterAdaptation = function () {
			var oFilterBarBuilder = this.getBuilder();
			return this.prepareResult(
				oFilterBarBuilder
					.doOpenSettings()
					.success(
						// the default view is a basic ungrouped list with growing enabled - lets switch to the grouped view...
						FEBuilder.create(this.getOpaInstance())
							.isDialogElement()
							.hasType("sap.m.Button")
							.hasProperties({
								icon: "sap-icon://group-2"
							})
							.doPress()
							.success(
								// ...and expand all groups for easy testing...
								FEBuilder.create(this.getOpaInstance())
									.hasType("sap.m.Panel")
									.isDialogElement()
									// ...and ensure that all filter fields are visible by expanding all filter groups (panels) if not yet done
									.doConditional(function (oPanel) {
										return !oPanel.getExpanded();
									}, OpaBuilder.Actions.press("expandButton"))
							)
					)
					.description(Utils.formatMessage("Opening the filter bar adaptation dialog for '{0}'", this.getIdentifier()))
					.execute()
			);
		};

		/**
		 * Confirms the filter bar adaptation. It can be used in an action chain as well as in an assertion chain.
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */
		FilterBarAPI.prototype.iConfirmFilterAdaptation = function () {
			return this.prepareResult(
				FilterBarBuilder.createAdaptationDialogBuilder(this.getOpaInstance())
					.doPressFooterButton(OpaBuilder.Matchers.resourceBundle("text", "sap.ui.mdc", "p13nDialog.OK"))
					.description(Utils.formatMessage("Closing the filter bar adaptation dialog for '{0}'", this.getIdentifier()))
					.execute()
			);
		};

		/**
		 * Helper method to adapt filter fields. If no actions are given, this function can be used for checking only.
		 * During execution it checks for an already open adaptation popover. If it does not exist, it is opened before
		 * the check/interaction of the filter fields, and closed directly afterwards.
		 * @param {string | sap.fe.test.api.FilterFieldIdentifier} vFieldIdentifier The identifier of the field
		 * @param {object} [mState] Defines the expected state of the adaptation filter field
		 * @param {Function|Array|sap.ui.test.actions.Action} [vActions] The actions to be executed on found adaptation field
		 * @param {string} sDescription The description of the check or adaptation
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @ui5-restricted
		 */
		FilterBarAPI.prototype.filterFieldAdaptation = function (vFieldIdentifier, mState, vActions, sDescription) {
			var aArguments = Utils.parseArguments([[String, Object], Object, [Function, Array, Action], String], arguments),
				oBuilder = FEBuilder.create(this.getOpaInstance()),
				bPopoverOpen,
				oAdaptColumnBuilder = FEBuilder.create(this.getOpaInstance())
					// NOTE: when using List instead of Group layout, the type is sap.m.ColumnListItem (consider this when the switching layout option becomes available)
					.hasType("sap.m.CustomListItem")
					.isDialogElement(),
				oAdaptationDialogBuilder = FilterBarBuilder.createAdaptationDialogBuilder(this.getOpaInstance());

			vFieldIdentifier = aArguments[0];
			if (Utils.isOfType(vFieldIdentifier, String)) {
				oAdaptColumnBuilder.has(OpaBuilder.Matchers.bindingProperties(BaseAPI.MDC_P13N_MODEL, { label: vFieldIdentifier }));
			} else {
				oAdaptColumnBuilder.has(OpaBuilder.Matchers.bindingProperties(BaseAPI.MDC_P13N_MODEL, { name: vFieldIdentifier.property }));
			}

			mState = aArguments[1];
			if (mState.visible !== undefined) {
				mState.exists = mState.visible;
				delete mState.visible;
			}
			if (mState.selected !== undefined) {
				mState.visible = mState.selected;
				delete mState.selected;
			}
			var bCheckForNotVisible = mState && mState.exists === false;
			if (!bCheckForNotVisible && !Utils.isOfType(mState, [null, undefined])) {
				oAdaptColumnBuilder.has(OpaBuilder.Matchers.bindingProperties(BaseAPI.MDC_P13N_MODEL, mState));
			}

			vActions = aArguments[2];
			if (!Utils.isOfType(vActions, [null, undefined])) {
				oAdaptationDialogBuilder.do(vActions);
			}

			sDescription = aArguments[3];
			return this.prepareResult(
				oBuilder
					.success(
						function () {
							bPopoverOpen = FEBuilder.controlsExist(oAdaptationDialogBuilder);

							if (!bPopoverOpen) {
								this.iOpenFilterAdaptation();
							}

							if (!bPopoverOpen) {
								oAdaptationDialogBuilder.success(this.iConfirmFilterAdaptation.bind(this));
							}

							return oAdaptationDialogBuilder
								.has(OpaBuilder.Matchers.children(oAdaptColumnBuilder))
								.has(function (aFoundAdaptationColumns) {
									if (bCheckForNotVisible) {
										return aFoundAdaptationColumns.length === 0;
									}
									return FEBuilder.Matchers.atIndex(0)(aFoundAdaptationColumns);
								})
								.description(sDescription)
								.execute();
						}.bind(this)
					)
					.execute()
			);
		};

		return FilterBarAPI;
	}
);
