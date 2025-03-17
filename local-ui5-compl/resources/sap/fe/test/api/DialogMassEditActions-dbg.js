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
		 * Constructs a new DialogMassEditActions instance.
		 * @param {sap.fe.test.builder.DialogBuilder} oDialogBuilder The {@link sap.fe.test.builder.DialogBuilder} instance used to interact with the UI
		 * @param {string} [vDialogDescription] Description (optional) of the dialog to be used for logging messages
		 * @returns {sap.fe.test.api.DialogMassEditActions} The new instance
		 * @extends sap.fe.test.api.DialogActions
		 * @alias sap.fe.test.api.DialogMassEditActions
		 * @class
		 * @hideconstructor
		 * @private
		 */
		var DialogMassEditActions = function (oDialogBuilder, vDialogDescription) {
			return DialogActions.call(this, oDialogBuilder, vDialogDescription, 0);
		};
		DialogMassEditActions.prototype = Object.create(DialogActions.prototype);
		DialogMassEditActions.prototype.constructor = DialogMassEditActions;
		DialogMassEditActions.prototype.isAction = true;

		/**
		 * A mass edit field identifier
		 * @typedef {object} MassEditFieldIdentifier
		 * @property {string} property The name of the property
		 * @name sap.fe.test.api.MassEditFieldIdentifier
		 * @private
		 */

		/**
		 * A mass edit field value
		 * @typedef {object} MassEditValue
		 * @property {string} dropDownText The dropdown text for the selection
		 * @property {string} rawText The raw text for the selection
		 * @name sap.fe.test.api.MassEditValue
		 * @private
		 */

		/**
		 * Changes the value of the defined filter field.
		 * @param {string | sap.fe.test.api.MassEditFieldIdentifier} vMassEditFieldIdentifier The identifier for the mass edit field
		 * @param {string | sap.fe.test.api.MassEditValue} vMassEditValue The new target value
		 * @param {object} [mState] The state of the mass edit field
		 * @param {object} [mProperties] The Properties of the mass edit field
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @private
		 */
		DialogMassEditActions.prototype.iChangeField = function (vMassEditFieldIdentifier, vMassEditValue, mState, mProperties) {
			var that = this,
				sProperty = Utils.isOfType(vMassEditFieldIdentifier, String) ? vMassEditFieldIdentifier : vMassEditFieldIdentifier.property,
				vValue = vMassEditValue && (Utils.isOfType(vMassEditValue, String) ? { rawText: vMassEditValue } : vMassEditValue),
				fieldRegEx = new RegExp("^MED(.*)" + sProperty + "$", "gi");

			return that.prepareResult(
				FEBuilder.create(this.getOpaInstance())
					.isDialogElement()
					.has(FEBuilder.Matchers.id(fieldRegEx))
					.hasState(mState)
					.hasProperties(mProperties)
					.doPress()
					.success(function (aSelect) {
						var oRet,
							oSelect = aSelect[0],
							sControlType = oSelect.getMetadata().getName();
						if (vValue.dropDownText) {
							oRet = OpaBuilder.create()
								.hasType("sap.ui.core.Item")
								.has(OpaBuilder.Matchers.ancestor(oSelect[0], false))
								.hasProperties({ text: vValue.dropDownText })
								.doPress()
								.description(
									Utils.formatMessage(
										"Value '{3}' selected for '{0}' in mass edit dialog '{1}'",
										sProperty,
										that.getIdentifier(),
										vValue.dropDownText
									)
								)
								.execute();
						} else if (vValue.rawText && sControlType === "sap.m.ComboBox") {
							oRet = OpaBuilder.create()
								.hasId(oSelect.getId())
								.doEnterText(vValue.rawText)
								.description(
									Utils.formatMessage(
										"Value '{3}' entered for '{0}' in mass edit dialog '{1}'",
										sProperty,
										that.getIdentifier(),
										vValue.rawText
									)
								)
								.execute();
						}

						return oRet;
					})
					.description(Utils.formatMessage("Mass edit dropdown for '{0}' found in dialog '{1}'", sProperty, that.getIdentifier()))
					.execute()
			);
		};

		return DialogMassEditActions;
	}
);
