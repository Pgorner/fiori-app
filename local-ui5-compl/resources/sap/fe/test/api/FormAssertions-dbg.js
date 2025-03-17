/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(
	["./FormAPI", "sap/fe/test/Utils", "sap/ui/test/OpaBuilder", "sap/fe/test/builder/FEBuilder", "sap/fe/test/builder/MacroFieldBuilder"],
	function (FormAPI, Utils, OpaBuilder, FEBuilder, MacroFieldBuilder) {
		"use strict";

		/**
		 * Constructs a new FormAssertions instance.
		 * @param {sap.fe.test.builder.FEBuilder} oFormBuilder The {@link sap.fe.test.builder.FEBuilder} instance used to interact with the UI
		 * @param {string} [vFormDescription] Description (optional) of the form to be used for logging messages
		 * @returns {sap.fe.test.api.FormAssertions} The new instance
		 * @alias sap.fe.test.api.FormAssertions
		 * @class
		 * @extends sap.fe.test.api.FormAPI
		 * @hideconstructor
		 * @public
		 */
		var FormAssertions = function (oFormBuilder, vFormDescription) {
			return FormAPI.call(this, oFormBuilder, vFormDescription);
		};
		FormAssertions.prototype = Object.create(FormAPI.prototype);
		FormAssertions.prototype.constructor = FormAssertions;
		FormAssertions.prototype.isAction = false;

		function _checkShowMoreShowLess(vOpaInstance, bShowMore, mState) {
			var oFormBuilder = vOpaInstance.getBuilder(),
				sSubSectionId,
				sButtonSuffix = bShowMore ? "--seeMore" : "--seeLess";

			oFormBuilder
				.has(function (oElement) {
					sSubSectionId = oElement.getId().substring(oElement.getId().lastIndexOf("::") + 2);
					return true;
				})
				.execute();

			return vOpaInstance.prepareResult(
				FEBuilder.create(vOpaInstance)
					.hasId(new RegExp(Utils.formatMessage("{0}$", sButtonSuffix)))
					.has(function (oElement) {
						// check whether the control is in the correct SubSection
						return oElement.getId().substring(oElement.getId().lastIndexOf("::") + 2) === sSubSectionId + sButtonSuffix;
					})
					.hasState(mState)
					.description(Utils.formatMessage("Checking '{0}' action with state='{1}'", sButtonSuffix, mState))
					.execute()
			);
		}

		/**
		 * Checks the state of the form.
		 * @param {object} mState Defines the expected state of the form
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */
		FormAssertions.prototype.iCheckState = function (mState) {
			var oFormBuilder = this.getBuilder();
			return this.prepareResult(
				oFormBuilder
					.hasState(mState)
					.description(
						Utils.formatMessage(
							"Checking Form '{0}'{1}",
							this.getIdentifier(),
							mState ? Utils.formatMessage(" in state '{0}'", mState) : ""
						)
					)
					.execute()
			);
		};

		/**
		 * Checks the state of an action in a subsection.
		 * @param {string | sap.fe.test.api.ActionIdentifier} vActionIdentifier The identifier of an action
		 * @param {object} [mState] Defines the expected state of the button
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */
		FormAssertions.prototype.iCheckAction = function (vActionIdentifier, mState) {
			var aArguments = Utils.parseArguments([[Object, String], Object], arguments),
				oFormBuilder = this.getBuilder();

			return this.prepareResult(
				oFormBuilder
					.hasAggregation("actions", [this.createActionMatcher(vActionIdentifier), FEBuilder.Matchers.states(mState)])
					.description(Utils.formatMessage("Checking custom action '{0}' with state='{1}'", aArguments[0], aArguments[1]))
					.execute()
			);
		};

		/**
		 * Checks the Show More action of a form in a subsection.
		 * @param {object} [mState] Defines the expected state of the button
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */
		FormAssertions.prototype.iCheckShowMore = function (mState) {
			return _checkShowMoreShowLess(this, true, mState);
		};

		/**
		 * Checks the Show Less action of a form in a subsection.
		 * @param {object} [mState] Defines the expected state of the button
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */
		FormAssertions.prototype.iCheckShowLess = function (mState) {
			return _checkShowMoreShowLess(this, false, mState);
		};

		/**
		 * Checks the content and state of a field within a form.
		 * @param {string | sap.fe.test.api.FieldIdentifier} vFieldIdentifier The identifier of the field
		 * @param {string | Array | object} [vValue] Expected value(s) of the field.
		 * if passed as an object, the following pattern will be considered:
		 * <code><pre>
		 * {
		 *     value: <string>, 		// optional
		 *     description: <string> 	// optional
		 * }
		 * </pre></code>
		 * @param {object} [mState] Defines the expected state of the field
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */
		FormAssertions.prototype.iCheckField = function (vFieldIdentifier, vValue, mState) {
			var aArguments = Utils.parseArguments([[Object, String], [String, Array, Object], Object], arguments);
			return this.prepareResult(
				this.createFieldBuilder(vFieldIdentifier)
					.hasValue(aArguments[1])
					.hasState(aArguments[2])
					.description(
						Utils.formatMessage(
							"Checking field '{1}' on form '{0}' with value '{2}' and state='{3}'",
							this.getIdentifier(),
							aArguments[0],
							aArguments[1],
							aArguments[2]
						)
					)
					.execute()
			);
		};

		/**
		 * Checks the field is a link with the given text and state.
		 * @param {string | sap.fe.test.api.FieldIdentifier} vFieldIdentifier The identifier of the field
		 * @param {string} [sText] The link text
		 * @param {object} [mState] Defines the expected state of the field
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */
		FormAssertions.prototype.iCheckLink = function (vFieldIdentifier, sText, mState) {
			var aArguments = Utils.parseArguments([[Object, String], String, Object], arguments);
			return this.iCheckField(aArguments[0], aArguments[1], Utils.mergeObjects({ controlType: "sap.m.Link" }, aArguments[2]));
		};

		FormAssertions.prototype.iCheckFormContainersElementCount = function (sFormContainer, iCount, mState) {
			var aArguments = Utils.parseArguments([String, Number, Object], arguments),
				fullSubSectionId = this.getIdentifier().fullSubSectionId,
				mFormState = aArguments[2],
				sView = fullSubSectionId.split("--")[0],
				sForm = fullSubSectionId.split("--")[1].split("::")[2],
				sFormContainerId = sView + "--" + "fe::FormContainer::" + aArguments[0];
			return this.prepareResult(
				this.getBuilder()
					.hasId(sFormContainerId)
					.has(function (oFormContainer) {
						var oMatchingFormContainers;
						if (Object.keys(mFormState).length) {
							oMatchingFormContainers = oFormContainer.getFormElements().filter(function (oFormElement) {
								return Object.keys(mFormState).every(function (sFormElementKey) {
									return mFormState[sFormElementKey] === oFormElement.getProperty(sFormElementKey);
								});
							});
						} else {
							oMatchingFormContainers = oFormContainer.getFormElements();
						}
						return oMatchingFormContainers.length === iCount;
					})
					.description(
						Utils.formatMessage(
							"Form Container '{0}' on Form '{1}' has '{2}' Form Elements.",
							aArguments[0],
							sForm,
							aArguments[1]
						)
					)
					.execute()
			);
		};
		return FormAssertions;
	}
);
