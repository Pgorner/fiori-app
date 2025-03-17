/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(
	[
		"./BaseAPI",
		"sap/fe/test/Utils",
		"sap/fe/test/builder/FEBuilder",
		"sap/fe/test/builder/MdcFieldBuilder",
		"sap/fe/test/builder/DialogBuilder"
	],
	function (BaseAPI, Utils, FEBuilder, MdcFieldBuilder, DialogBuilder) {
		"use strict";

		/**
		 * Constructs a new DialogAPI instance.
		 * @param {sap.fe.test.builder.DialogBuilder} oDialogBuilder The {@link sap.fe.test.builder.DialogBuilder} instance used to interact with the UI
		 * @param {string} [vDialogDescription] Description (optional) of the dialog to be used for logging messages
		 * @param {number} [iConfirmButtonIndex] Index of the 'confirm' button in the button aggregation; the default setting is 0 (first button from the left)
		 * @returns {sap.fe.test.api.DialogAPI} The new instance
		 * @class
		 * @private
		 */
		var DialogAPI = function (oDialogBuilder, vDialogDescription, iConfirmButtonIndex) {
			if (!Utils.isOfType(oDialogBuilder, DialogBuilder)) {
				throw new Error("oDialogBuilder parameter must be a DialogBuilder instance");
			}
			this._iConfirmButtonIndex = iConfirmButtonIndex || 0;
			this._iConfirmDiscardDraftButtonIndex = this._iConfirmButtonIndex + 1; // second button in the list
			return BaseAPI.call(this, oDialogBuilder, vDialogDescription);
		};
		DialogAPI.prototype = Object.create(BaseAPI.prototype);
		DialogAPI.prototype.constructor = DialogAPI;

		/**
		 * Creates a matcher for fields within create and action dialogs.
		 * @param {sap.fe.test.api.FieldIdentifier | string} vFieldIdentifier Identifier to be used for the matcher
		 * @param {object} oDialogIdentifier Identifier for the dialog (create/action)
		 * @returns {object} A matcher
		 * @private
		 */
		DialogAPI.prototype._createFieldMatcher = function (vFieldIdentifier, oDialogIdentifier) {
			var vMatcher, sFieldId;
			if (!Utils.isOfType(vFieldIdentifier, String)) {
				if (typeof vFieldIdentifier.property === "string") {
					sFieldId =
						oDialogIdentifier && oDialogIdentifier.type === "Create"
							? "CreateDialog::" + vFieldIdentifier.property.replaceAll("/", "::")
							: "APD_::" + vFieldIdentifier.property.replaceAll("/", "::");
				} else {
					throw new Error(
						"The 'property' parameter for creating a control ID for a field in an action dialog is not supported: " +
							vFieldIdentifier.property
					);
				}
				vMatcher = FEBuilder.Matchers.id(new RegExp(Utils.formatMessage("{0}", sFieldId)));
			} else {
				// identify a field by its label
				//vMatcher = FEBuilder.Matchers.label(vFieldIdentifier);
			}
			return vMatcher;
		};

		DialogAPI.prototype._createFieldBuilder = function (vFieldIdentifier, oDialogIdentifier) {
			var oMdcFieldBuilder = new MdcFieldBuilder(this.getOpaInstance());
			return oMdcFieldBuilder
				.isDialogElement()
				.hasType("sap.ui.mdc.Field")
				.has(this._createFieldMatcher(vFieldIdentifier, oDialogIdentifier));
		};

		DialogAPI.prototype._getConfirmButtonMatcher = function () {
			var iConfirmButtonIndex = this._iConfirmButtonIndex;
			return function (oButton) {
				var aButtons = oButton.getParent().getButtons();
				// Confirm is (usually) the first button
				return aButtons.indexOf(oButton) === Math.min(aButtons.length - 1, iConfirmButtonIndex);
			};
		};

		DialogAPI.prototype._getCancelButtonMatcher = function () {
			var iConfirmButtonIndex = this._iConfirmButtonIndex;
			return function (oButton) {
				var aButtons = oButton.getParent().getButtons();
				// Cancel is (usually) right next to the first (confirm) button and (usually) the last one in the list
				return aButtons.length > 2
					? aButtons.indexOf(oButton) === aButtons.length - 1
					: aButtons.indexOf(oButton) === Math.min(aButtons.length - 1, iConfirmButtonIndex + 1);
			};
		};

		DialogAPI.prototype._getConfirmDiscardDraftButtonMatcher = function () {
			var iConfirmDiscardDraftButtonIndex = this._iConfirmDiscardDraftButtonIndex;
			return function (oButton) {
				var aButtons = oButton.getParent().getButtons();
				// for the KeepDraft/DiscardDraft message, the DiscardDraft button is the second in the list
				return aButtons.indexOf(oButton) === iConfirmDiscardDraftButtonIndex;
			};
		};

		return DialogAPI;
	}
);
