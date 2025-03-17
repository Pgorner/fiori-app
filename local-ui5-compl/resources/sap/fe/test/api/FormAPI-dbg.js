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
		"sap/fe/test/builder/FEBuilder",
		"sap/fe/test/builder/MacroFieldBuilder",
		"sap/base/Log"
	],
	function (BaseAPI, Utils, OpaBuilder, FEBuilder, MacroFieldBuilder, Log) {
		"use strict";

		/**
		 * A form identifier
		 * @typedef {object} FormIdentifier
		 * @property {string} section The facet ID
		 * @property {string} fieldGroup The fieldgroup ID
		 * @property {boolean} [isHeaderFacet] Is it about the editable header facet
		 * @name sap.fe.test.api.FormIdentifier
		 * @public
		 */

		/**
		 * Constructs a new FormAPI instance.
		 * @param {sap.fe.test.builder.FEBuilder} oFormBuilder The {@link sap.fe.test.builder.FEBuilder} instance used to interact with the UI
		 * @param {string} [vFormDescription] Description (optional) of the form to be used for logging messages
		 * @returns {sap.fe.test.api.FormAPI} The new instance
		 * @alias sap.fe.test.api.FormAPI
		 * @class
		 * @hideconstructor
		 * @public
		 */
		var FormAPI = function (oFormBuilder, vFormDescription) {
			if (!Utils.isOfType(oFormBuilder, FEBuilder)) {
				throw new Error("oFormBuilder parameter must be a FEBuilder instance");
			}
			return BaseAPI.call(this, oFormBuilder, vFormDescription);
		};
		FormAPI.prototype = Object.create(BaseAPI.prototype);
		FormAPI.prototype.constructor = FormAPI;

		FormAPI.prototype.createFieldBuilder = function (vFieldIdentifier) {
			var oBuilder = new MacroFieldBuilder(this.getOpaInstance(), this.getBuilder().build());

			if (vFieldIdentifier.fieldGroup) {
				oBuilder.has(OpaBuilder.Matchers.children(this._getBuilderForFieldGroup(vFieldIdentifier)));
			}
			return oBuilder
				.has(OpaBuilder.Matchers.children(this._getBuilderForFormElement(vFieldIdentifier)))
				.has(FEBuilder.Matchers.singleElement())
				.has(OpaBuilder.Matchers.children(this.createFieldMatcher(vFieldIdentifier)))
				.has(FEBuilder.Matchers.singleElement());
		};

		FormAPI.prototype._getBuilderForFormElement = function (vFieldIdentifier) {
			return FEBuilder.create(this.getOpaInstance()) // identifying the FormElement
				.hasType("sap.ui.layout.form.FormElement")
				.hasSome(
					this.createFormElementMatcher(vFieldIdentifier, "DataField"),
					this.createFormElementMatcher(vFieldIdentifier, "DataFieldWithNavigationPath"),
					this.createFormElementMatcher(vFieldIdentifier, "DataFieldWithUrl"),
					this.createFormElementMatcher(vFieldIdentifier, "DataFieldForAnnotation"),
					this.createFormElementMatcher(vFieldIdentifier, "DataFieldWithIntentBasedNavigation")
				);
		};

		FormAPI.prototype._getBuilderForFieldGroup = function (vFieldIdentifier) {
			return FEBuilder.create(this.getOpaInstance()) // identifying the FieldGroup
				.hasType("sap.ui.layout.form.FormContainer")
				.has(this.createFieldGroupMatcher(vFieldIdentifier));
		};

		return FormAPI;
	}
);
