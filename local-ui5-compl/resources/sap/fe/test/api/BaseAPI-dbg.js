/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(
	["sap/fe/test/Utils", "sap/ui/test/Opa5", "sap/ui/test/OpaBuilder", "sap/fe/test/builder/FEBuilder", "sap/m/p13n/BasePanel"],
	function (Utils, Opa5, OpaBuilder, FEBuilder, MdcP13nBasePanel) {
		"use strict";

		/**
		 * A table identifier
		 * @typedef {object} TableIdentifier
		 * @property {string} property The name of the navigation property used for the table
		 * @property {string} [qualifier] The name of a qualifier for the table
		 * @name sap.fe.test.api.TableIdentifier
		 * @public
		 */

		/**
		 * A dialog identifier
		 * @typedef {object} DialogIdentifier
		 * @property {sap.fe.test.api.DialogType} type The type of the dialog
		 * @name sap.fe.test.api.DialogIdentifier
		 * @public
		 */

		/**
		 * An action identifier
		 * @typedef {object} ActionIdentifier
		 * @property {string} service The name of the service
		 * @property {string} action The name of the action
		 * @property {boolean} [unbound] Defines whether the action is a bound action (default: false)
		 * @name sap.fe.test.api.ActionIdentifier
		 * @public
		 */

		/**
		 * A field identifier
		 * @typedef {object} FieldIdentifier
		 * @property {string} [fieldGroup] The name of the field group containing the field
		 * @property {string} property The name of the field
		 * @property {string} [connectedFields] The name of the connected field containing the field
		 * @name sap.fe.test.api.FieldIdentifier
		 * @public
		 */

		/**
		 * A section identifier
		 * @typedef {object} SectionIdentifier
		 * @property {string} section The name of the section facet
		 * @property {string} [subSection] The name of the sub-section facet
		 * @name sap.fe.test.api.SectionIdentifier
		 * @public
		 */

		/**
		 * An action parameter dialog field identifier
		 * @typedef {object} ActionDialogFieldIdentifier
		 * @property {string} property The name of the field
		 * @name sap.fe.test.api.ActionDialogFieldIdentifier
		 * @public
		 */

		/**
		 * An dialog field identifier
		 * @typedef {object} DialogFieldIdentifier
		 * @property {string} property The name of the field
		 * In case of an action parameter dialog, this is the fieldname only
		 * <code><pre>
		 * {
		 *     property: <fieldname>
		 * }
		 * </pre></code>
		 * In case of a create dialog, the concatenation of the entity and fieldname has to be provided
		 * <code><pre>
		 * {
		 *     property: <entity>::<fieldname>
		 * }
		 * </pre></code>
		 * @name sap.fe.test.api.DialogFieldIdentifier
		 * @public
		 */

		/**
		 * A view identifier
		 * @typedef {object} ViewIdentifier
		 * @property {string} key The name of the view as defined in the manifest file
		 * @name sap.fe.test.api.ViewIdentifier
		 * @public
		 */

		function _findParentChainFunction(oResult, sChainKeyword) {
			var oAnd = oResult.and;
			if (sChainKeyword in oAnd) {
				return _findParentChainFunction(oAnd[sChainKeyword], sChainKeyword);
			}
			return oAnd;
		}

		var BaseApi = function (oOpaBuilder, vIdentifier) {
			this._oBuilder = oOpaBuilder;
			this._vIdentifier = vIdentifier;
		};

		BaseApi.MDC_P13N_MODEL = MdcP13nBasePanel.prototype.P13N_MODEL;

		/**
		 * Defines whether the current API is meant for actions (<code>true</code>) or assertions (<code>false</code>).
		 * It is used to enable parent chaining via <code>and.when</code> or <code>and.then</code>.
		 * @type {boolean}
		 * @public
		 * @ui5-restricted
		 */
		BaseApi.prototype.isAction = undefined;

		/**
		 * Gets a new builder instance based on the given one.
		 * @returns {sap.ui.test.OpaBuilder} An OpaBuilder instance
		 * @public
		 * @ui5-restricted
		 */
		BaseApi.prototype.getBuilder = function () {
			return new this._oBuilder.constructor(this._oBuilder.getOpaInstance(), this._oBuilder.build());
		};

		/**
		 * Gets the underlying Opa5 instance.
		 * @returns {sap.ui.test.Opa5} An Opa instance
		 * @public
		 * @ui5-restricted
		 */
		BaseApi.prototype.getOpaInstance = function () {
			return this._oBuilder.getOpaInstance();
		};

		BaseApi.prototype.getIdentifier = function () {
			return this._vIdentifier;
		};

		BaseApi.prototype.prepareResult = function (oWaitForResult) {
			var oParentChain = _findParentChainFunction(oWaitForResult, this.isAction ? "when" : "then");
			oWaitForResult.and = this;
			if (!Utils.isOfType(this.isAction, [null, undefined])) {
				oWaitForResult.and[this.isAction ? "when" : "then"] = oParentChain;
			}
			return oWaitForResult;
		};

		/**
		 * Creates a matcher for actions.
		 * @param {sap.fe.api.ActionIdentifier | string} vActionIdentifier Identifier to be used for the matcher.
		 * @returns {object} A matcher
		 * @private
		 */
		BaseApi.prototype.createActionMatcher = function (vActionIdentifier) {
			var vMatcher, sActionId;

			if (!Utils.isOfType(vActionIdentifier, String)) {
				if (typeof vActionIdentifier.service === "string" && typeof vActionIdentifier.action === "string") {
					sActionId = vActionIdentifier.service + (vActionIdentifier.unbound ? "::" : ".") + vActionIdentifier.action;
					vMatcher = FEBuilder.Matchers.id(new RegExp(Utils.formatMessage("{0}$", sActionId)));
				} else {
					throw new Error(
						"not supported service and action parameters for creating a control id: " +
							vActionIdentifier.service +
							"/" +
							vActionIdentifier.action
					);
				}
			} else {
				vMatcher = OpaBuilder.Matchers.properties({ text: vActionIdentifier });
			}
			return vMatcher;
		};

		/**
		 * Creates a matcher for fields.
		 * @param {sap.fe.test.api.FieldIdentifier | string} vFieldIdentifier Identifier to be used for the matcher
		 * @returns {object} A matcher
		 * @private
		 */
		BaseApi.prototype.createFieldMatcher = function (vFieldIdentifier) {
			var vMatcher, sFieldId;
			if (!Utils.isOfType(vFieldIdentifier, String)) {
				if (typeof vFieldIdentifier.property === "string") {
					if (vFieldIdentifier.connectedFields) {
						sFieldId =
							"ConnectedFields::" +
							vFieldIdentifier.connectedFields +
							"::" +
							vFieldIdentifier.property.replaceAll("/", "::") +
							"::Field";
					} else {
						sFieldId = vFieldIdentifier.property.replaceAll("/", "::") + "::Field";
					}
					return OpaBuilder.Matchers.some.apply(
						null,
						["DataField", "DataFieldWithURL", "DataFieldForAnnotation"].reduce(function (aMatchers, sDataFieldType) {
							return aMatchers.concat([
								FEBuilder.Matchers.id(new RegExp(Utils.formatMessage("::{0}::{1}$", sDataFieldType, sFieldId)))
							]);
						}, [])
					);
				} else {
					throw new Error(
						"The 'property' parameter for creating a control ID for a field is not supported: " + vFieldIdentifier.property
					);
				}
			} else {
				// identify a field by its label
				vMatcher = FEBuilder.Matchers.label(vFieldIdentifier);
			}
			return vMatcher;
		};

		/**
		 * Creates a matcher for FormElements (sap.ui.layout.form.FormElement).
		 * @param {sap.fe.test.api.FieldIdentifier | string} vFormElementIdentifier Identifier of the field to be used for the matcher
		 * @param {string} sDataFieldType Added as prefix for the id. Can be values like 'DataField',
		 * 'DataFieldWithUrl', 'DataFieldWithNavigationPath', etc.
		 * @returns {object} A matcher
		 * @private
		 */
		BaseApi.prototype.createFormElementMatcher = function (vFormElementIdentifier, sDataFieldType) {
			var vMatcher, sFormElementId;
			if (!Utils.isOfType(vFormElementIdentifier, String)) {
				if (vFormElementIdentifier.property && typeof vFormElementIdentifier.property === "string") {
					if (vFormElementIdentifier.connectedFields) {
						sFormElementId =
							"SemanticFormElement::" + sDataFieldType + "::ConnectedFields::" + vFormElementIdentifier.connectedFields;
					} else {
						sFormElementId = "FormElement::" + sDataFieldType + "::" + vFormElementIdentifier.property.replaceAll("/", "::");
					}
					vMatcher = FEBuilder.Matchers.id(new RegExp(Utils.formatMessage("{0}$", sFormElementId)));
				} else {
					throw new Error("Unsupported parameter for creating a control id for a FormElement");
				}
			} else {
				vMatcher = OpaBuilder.Matchers.properties({ label: vFormElementIdentifier });
			}
			return vMatcher;
		};

		/**
		 * Create a matcher for FieldGroups (sap.ui.layout.form.FormContainer).
		 * @param {object | string} vFieldGroupIdentifier Identifier of the field-group to be used for the matcher.
		 * if passed as an object, the following pattern will be considered:
		 * <code><pre>
		 * 	{
		 * 		fieldGroup: <fieldgroup-name>
		 *  }
		 * </pre></code>
		 * if passed as string, the content of the field will be checked with property 'title'
		 * @returns {object} A matcher
		 * @private
		 */
		BaseApi.prototype.createFieldGroupMatcher = function (vFieldGroupIdentifier) {
			var vMatcher, sFieldGroupId;
			if (!Utils.isOfType(vFieldGroupIdentifier, String)) {
				if (vFieldGroupIdentifier.fieldGroup && typeof vFieldGroupIdentifier.fieldGroup === "string") {
					sFieldGroupId = "FormContainer::" + vFieldGroupIdentifier.fieldGroup;
					vMatcher = FEBuilder.Matchers.id(new RegExp(Utils.formatMessage("{0}$", sFieldGroupId)));
				} else {
					throw new Error(
						Utils.formatMessage(
							"The parameter for creating a control ID for a FieldGroup is not supported: {0}",
							vFieldGroupIdentifier
						)
					);
				}
			} else {
				vMatcher = OpaBuilder.Matchers.properties({ title: vFieldGroupIdentifier });
			}
			return vMatcher;
		};

		return BaseApi;
	}
);
