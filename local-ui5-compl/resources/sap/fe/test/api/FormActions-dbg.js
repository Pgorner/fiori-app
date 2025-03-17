/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(
	[
		"./FormAPI",
		"sap/fe/test/Utils",
		"sap/ui/test/OpaBuilder",
		"sap/fe/test/builder/FEBuilder",
		"sap/fe/test/builder/MacroFieldBuilder",
		"sap/fe/test/builder/OverflowToolbarBuilder"
	],
	function (FormAPI, Utils, OpaBuilder, FEBuilder, MacroFieldBuilder, OverflowToolbarBuilder) {
		"use strict";

		/**
		 * Constructs a new FormActions instance.
		 * @param {sap.fe.test.builder.FEBuilder} oFormBuilder The {@link sap.fe.test.builder.FEBuilder} instance used to interact with the UI
		 * @param {string} [vFormDescription] Description (optional) of the form to be used for logging messages
		 * @returns {sap.fe.test.api.FormActions} The new instance
		 * @alias sap.fe.test.api.FormActions
		 * @class
		 * @extends sap.fe.test.api.FormAPI
		 * @hideconstructor
		 * @public
		 */
		var FormActions = function (oFormBuilder, vFormDescription) {
			return FormAPI.call(this, oFormBuilder, vFormDescription);
		};
		FormActions.prototype = Object.create(FormAPI.prototype);
		FormActions.prototype.constructor = FormActions;
		FormActions.prototype.isAction = true;

		function _executeShowMoreShowLess(vOpaInstance, bShowMore) {
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
				OpaBuilder.create(vOpaInstance)
					.hasId(new RegExp(Utils.formatMessage("{0}$", sButtonSuffix)))
					.has(function (oElement) {
						return oElement.getId().substring(oElement.getId().lastIndexOf("::") + 2) === sSubSectionId + sButtonSuffix;
					})
					.doPress()
					.description(Utils.formatMessage("Pressing '{0}' action", sButtonSuffix))
					.execute()
			);
		}

		/**
		 * Executes an action assigned to a form in a subsection.
		 * @param {string | sap.fe.test.api.ActionIdentifier} vActionIdentifier The identifier of the action or its label
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */
		FormActions.prototype.iExecuteAction = function (vActionIdentifier) {
			var oFormBuilder = this.getBuilder(),
				vFormDescription = this.getIdentifier(),
				sFormContainerId;
			if (vFormDescription.fieldGroupId === undefined) {
				// Action Button in Section Header
				return this.prepareResult(
					oFormBuilder
						.doOnSubSectionToolBar(this.createActionMatcher(vActionIdentifier))
						.description(Utils.formatMessage("Pressing action '{1}' on form '{0}'", this.getIdentifier(), vActionIdentifier))
						.execute()
				);
			} else {
				// Action Button in Form Container Toolbar ("Inline Action")
				sFormContainerId =
					vFormDescription.fullSubSectionId.substring(0, vFormDescription.fullSubSectionId.indexOf("--")) +
					"--" +
					vFormDescription.fieldGroupId;
				return this.prepareResult(
					OverflowToolbarBuilder.create(this)
						.hasId(sFormContainerId + "::FormActionsToolbar")
						.doOnContent(this.createActionMatcher(vActionIdentifier))
						.execute()
				);
			}
		};

		/**
		 * Executes the Show More action of a form in a subsection.
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */
		FormActions.prototype.iExecuteShowMore = function () {
			return _executeShowMoreShowLess(this, true);
		};

		/**
		 * Executes the Show Less action of a form in a subsection.
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */
		FormActions.prototype.iExecuteShowLess = function () {
			return _executeShowMoreShowLess(this, false);
		};

		/**
		 * Clicks a link within a form.
		 * @param {sap.fe.test.api.FieldIdentifier | string} vFieldIdentifier The identifier of the field
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */
		FormActions.prototype.iClickLink = function (vFieldIdentifier) {
			return this.prepareResult(
				this.createFieldBuilder(vFieldIdentifier)
					.hasState({ controlType: "sap.m.Link" })
					.doPress()
					.description(Utils.formatMessage("Clicking link '{1}' on form '{0}'", this.getIdentifier(), vFieldIdentifier))
					.execute()
			);
		};

		FormActions.prototype.iClickObjectStatus = function (vFieldIdentifier) {
			return this.prepareResult(
				this.createFieldBuilder(vFieldIdentifier)
					.hasState({ controlType: "sap.m.ObjectStatus" })
					.doPress()
					.description(Utils.formatMessage("Clicking ObjectStatus '{1}' on form '{0}'", this.getIdentifier(), vFieldIdentifier))
					.execute()
			);
		};
		/**
		 * Toggles the value of a checkbox within a form.
		 * @param {sap.fe.test.api.FieldIdentifier} vFieldIdentifier The identifier of the field
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */
		FormActions.prototype.iClickCheckBox = function (vFieldIdentifier) {
			return this.prepareResult(
				this.createFieldBuilder(vFieldIdentifier)
					.hasState({ controlType: "sap.m.CheckBox" })
					.doPress()
					.description(Utils.formatMessage("Clicking checkBox '{1}' on form '{0}'", this.getIdentifier(), vFieldIdentifier))
					.execute()
			);
		};

		/**
		 * Changes the value of a field within a form.
		 * @param {sap.fe.test.api.FieldIdentifier | string} vFieldIdentifier The identifier of the field
		 * @param {string} [sValue] The value to be set for the field
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */
		FormActions.prototype.iChangeField = function (vFieldIdentifier, sValue) {
			return this.prepareResult(
				this.createFieldBuilder(vFieldIdentifier)
					.doEnterText(sValue, true, false, true)
					.description(
						Utils.formatMessage(
							"Entering value '{1}' into field '{2}' on form '{0}'",
							this.getIdentifier(),
							sValue,
							vFieldIdentifier
						)
					)
					.execute()
			);
		};

		/**
		 * Opens the value help of the given field.
		 * @param {string | sap.fe.test.api.FieldIdentifier} vFieldIdentifier The identifier of the field
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function that can be used for chaining statements
		 * @public
		 */
		FormActions.prototype.iOpenValueHelp = function (vFieldIdentifier) {
			return this.prepareResult(
				this.createFieldBuilder(vFieldIdentifier)
					.hasState({ visible: true })
					.doOpenValueHelp()
					.description(
						Utils.formatMessage("Opening the value help for field '{1}' on form '{0}'", this.getIdentifier(), vFieldIdentifier)
					)
					.execute()
			);
		};

		return FormActions;
	}
);
