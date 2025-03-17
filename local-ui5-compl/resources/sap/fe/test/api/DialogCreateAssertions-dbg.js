/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(
	["./DialogAssertions", "sap/ui/test/OpaBuilder", "sap/fe/test/builder/FEBuilder", "sap/fe/test/Utils"],
	function (DialogAssertions, OpaBuilder, FEBuilder, Utils) {
		"use strict";

		/**
		 * Constructs a new DialogCreateAssertions instance.
		 * @param {sap.fe.test.builder.DialogBuilder} oDialogBuilder The {@link sap.fe.test.builder.DialogBuilder} instance used to interact with the UI
		 * @param {string} [vDialogDescription] Description (optional) of the dialog to be used for logging messages
		 * @returns {sap.fe.test.api.DialogCreateAssertions} The new instance
		 * @extends sap.fe.test.api.DialogAssertions
		 * @alias sap.fe.test.api.DialogCreateAssertions
		 * @class
		 * @hideconstructor
		 * @public
		 */
		var DialogCreateAssertions = function (oDialogBuilder, vDialogDescription) {
			return DialogAssertions.call(this, oDialogBuilder, vDialogDescription, 0);
		};
		DialogCreateAssertions.prototype = Object.create(DialogAssertions.prototype);
		DialogCreateAssertions.prototype.constructor = DialogCreateAssertions;
		DialogCreateAssertions.prototype.isAction = false;

		/**
		 * Checks the <code>Create</code> action on the dialog.
		 * @param {object} [mState] Defines the expected state of the button
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */
		DialogCreateAssertions.prototype.iCheckCreate = function (mState) {
			return this.prepareResult(
				this.getBuilder()
					.hasFooterButton(
						OpaBuilder.Matchers.resourceBundle(
							"text",
							"sap.fe.core",
							"C_TRANSACTION_HELPER_SAPFE_ACTION_CREATE_BUTTON_CONTINUE"
						),
						mState
					)
					.description(
						Utils.formatMessage("Checking that dialog '{0}' has create button with state '{1}'", this.getIdentifier(), mState)
					)
					.execute()
			);
		};

		return DialogCreateAssertions;
	}
);
