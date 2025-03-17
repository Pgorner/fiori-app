/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(
	["./DialogActions", "sap/fe/test/Utils", "sap/ui/test/OpaBuilder", "sap/fe/test/builder/FEBuilder"],
	function (DialogActions, Utils, OpaBuilder, FEBuilder) {
		"use strict";

		/**
		 * Constructs a new DialogMessageActions instance.
		 * @param {sap.fe.test.builder.DialogBuilder} oDialogBuilder The {@link sap.fe.test.builder.DialogBuilder} instance used to interact with the UI
		 * @param {string} [vDialogDescription] Description (optional) of the dialog to be used for logging messages
		 * @returns {sap.fe.test.api.DialogMessageActions} The new instance
		 * @extends sap.fe.test.api.DialogActions
		 * @alias sap.fe.test.api.DialogMessageActions
		 * @class
		 * @hideconstructor
		 * @public
		 */
		var DialogMessageActions = function (oDialogBuilder, vDialogDescription) {
			return DialogActions.call(this, oDialogBuilder, vDialogDescription, 0);
		};
		DialogMessageActions.prototype = Object.create(DialogActions.prototype);
		DialogMessageActions.prototype.constructor = DialogMessageActions;
		DialogMessageActions.prototype.isAction = true;

		/**
		 * Executes the <code>Back</code> action on the message dialog.
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */
		DialogMessageActions.prototype.iExecuteBack = function () {
			return this.prepareResult(
				this.getBuilder()
					.doPressHeaderButton(OpaBuilder.Matchers.properties({ icon: "sap-icon://nav-back" }))
					.description(Utils.formatMessage("Pressing back button on dialog '{0}'", this.getIdentifier()))
					.execute()
			);
		};

		/**
		 * Executes the <code>Refresh</code> action on the message dialog.
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */
		DialogMessageActions.prototype.iExecuteRefresh = function () {
			return this.prepareResult(
				this.getBuilder()
					.doPressFooterButton(OpaBuilder.Matchers.resourceBundle("text", "sap.fe.core", "C_COMMON_SAPFE_REFRESH"))
					.description(Utils.formatMessage("Pressing refresh button on dialog '{0}'", this.getIdentifier()))
					.execute()
			);
		};

		/**
		 * Selects the specified entry in the draft data loss popup.
		 * @param {any} optionKey
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */
		DialogMessageActions.prototype.iSelectDraftDataLossOption = function (optionKey) {
			// The logic below uses customData for identifying the entry in list in the dialog
			// which needs to be pressed
			// The dialog's XML fragment for the custom data and the used keys
			return this.prepareResult(
				FEBuilder.create()
					.hasType("sap.m.List")
					.isDialogElement(true)
					.has(OpaBuilder.Matchers.aggregation("items"))
					.has(function (oItem) {
						return oItem.find(function (element) {
							return element.data("itemKey") === optionKey;
						});
					})
					.doPress()
					.description("Selecting option with key {0} in draft data loss popup")
					.execute()
			);
		};

		return DialogMessageActions;
	}
);
