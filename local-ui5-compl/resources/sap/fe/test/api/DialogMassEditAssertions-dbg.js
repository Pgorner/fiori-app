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
		 * Constructs a new DialogMassEditAssertions instance.
		 * @param {sap.fe.test.builder.DialogBuilder} oDialogBuilder The {@link sap.fe.test.builder.DialogBuilder} instance used to interact with the UI
		 * @param {string} [vDialogDescription] Description (optional) of the dialog to be used for logging messages
		 * @returns {sap.fe.test.api.DialogMassEditAssertions} The new instance
		 * @extends sap.fe.test.api.DialogAssertions
		 * @alias sap.fe.test.api.DialogMassEditAssertions
		 * @class
		 * @hideconstructor
		 * @private
		 */
		var DialogMassEditAssertions = function (oDialogBuilder, vDialogDescription) {
			return DialogAssertions.call(this, oDialogBuilder, vDialogDescription, 0);
		};
		DialogMassEditAssertions.prototype = Object.create(DialogAssertions.prototype);
		DialogMassEditAssertions.prototype.constructor = DialogMassEditAssertions;
		DialogMassEditAssertions.prototype.isAction = false;

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
		 * Check the value of the defined filter field.
		 * @param {string | sap.fe.test.api.MassEditFieldIdentifier} vMassEditFieldIdentifier The identifier for the mass edit field
		 * @param {string | sap.fe.test.api.MassEditValue} vMassEditValue The new target value
		 * @param {object} [mState] The state of the mass edit field
		 * @param {object} [mProperties] The Properties of the mass edit field
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @private
		 */
		DialogMassEditAssertions.prototype.iCheckField = function (vMassEditFieldIdentifier, vMassEditValue, mState, mProperties) {
			var that = this,
				sProperty = Utils.isOfType(vMassEditFieldIdentifier, String) ? vMassEditFieldIdentifier : vMassEditFieldIdentifier.property,
				vValue =
					vMassEditValue &&
					(Utils.isOfType(vMassEditValue, String) ? vMassEditValue : vMassEditValue.rawText || vMassEditValue.dropDownText),
				fieldRegEx = new RegExp("^MED(.*)" + sProperty + "$", "gi");
			var sControlType;

			var vTest = FEBuilder.create(this.getOpaInstance()).isDialogElement();
			var vIdMatcher = FEBuilder.Matchers.id(fieldRegEx);
			var vMatcher = [FEBuilder.Matchers.states(mState), vIdMatcher];
			if (mState && mState.visible === false) {
				// two possibilities for non-visible action: either visible property is false, or the control wasn't rendered at all
				vMatcher = OpaBuilder.Matchers.some(vMatcher, OpaBuilder.Matchers.not(vIdMatcher));
				vTest = vTest.has(vMatcher);
			} else {
				vTest = vTest
					.has(vMatcher)
					.hasProperties(mProperties)
					.check(function (aSelect) {
						sControlType = aSelect && aSelect[0] && aSelect[0].getMetadata().getName();
						return (
							aSelect.length === 1 &&
							(sControlType === "sap.m.ComboBox" || sControlType === "sap.fe.macros.controls.MassEditSelect")
						);
					})
					.success(function (aSelect) {
						var oSelect = aSelect[0],
							oRet = OpaBuilder.create().hasId(oSelect.getId());

						if (sControlType === "sap.m.ComboBox") {
							oRet = oRet.hasProperties({ value: vValue });
						} else if (sControlType === "sap.fe.macros.controls.MassEditSelect") {
							oRet = oRet.has(function (oSelectControl) {
								return oSelectControl.getSelectedItem() ? oSelectControl.getSelectedItem().getText() === vValue : false;
							});
						}

						return oRet
							.description(
								Utils.formatMessage(
									"Value selection '{3}' found for '{0}' in mass edit dialog '{1}'",
									sProperty,
									that.getIdentifier(),
									vValue.toString()
								)
							)
							.execute();
					})
					.description(
						Utils.formatMessage("Mass edit dropdown for '{0}' found in dialog '{1}'", sProperty, that.getIdentifier())
					);
			}

			return that.prepareResult(vTest.execute());
		};

		/**
		 * Check the suggestions of the defined filter field.
		 * @param {string | sap.fe.test.api.MassEditFieldIdentifier} vMassEditFieldIdentifier The identifier for the mass edit field
		 * @param {string | sap.fe.test.api.MassEditValue} vMassEditValue The new target value
		 * @param {object} [mState] The state of the mass edit field
		 * @param {object} [mProperties] The Properties of the mass edit field
		 * @param {boolean} [bExists] Should the suggestion exist. Default is true
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @private
		 */
		DialogMassEditAssertions.prototype.iCheckFieldSuggestions = function (
			vMassEditFieldIdentifier,
			vMassEditValue,
			mState,
			mProperties,
			bExists
		) {
			var that = this,
				sProperty = Utils.isOfType(vMassEditFieldIdentifier, String) ? vMassEditFieldIdentifier : vMassEditFieldIdentifier.property,
				vValue =
					vMassEditValue &&
					(Utils.isOfType(vMassEditValue, String) ? vMassEditValue : vMassEditValue.dropDownText || vMassEditValue.rawText),
				fieldRegEx = new RegExp("^MED(.*)" + sProperty + "$", "gi");

			return that.prepareResult(
				FEBuilder.create(this.getOpaInstance())
					.isDialogElement()
					.hasId(fieldRegEx)
					.hasState(mState)
					.hasProperties(mProperties)
					.check(function (aSelect) {
						var oRet = false,
							oSelect = aSelect && aSelect[0],
							sControlType = aSelect && aSelect[0] && aSelect[0].getMetadata().getName();

						if (
							aSelect.length === 1 &&
							(sControlType === "sap.m.ComboBox" || sControlType === "sap.fe.macros.controls.MassEditSelect")
						) {
							var aItems = oSelect.getItems(),
								iIndex = (aItems || []).findIndex(function (oItem) {
									return oItem.getText() === vValue;
								}),
								bFound = iIndex != -1;

							oRet = (bExists !== false) === bFound;
						}
						return oRet;
					})
					.description(Utils.formatMessage("Mass edit dropdown for '{0}' found in dialog '{1}'", sProperty, that.getIdentifier()))
					.execute()
			);
		};

		return DialogMassEditAssertions;
	}
);
