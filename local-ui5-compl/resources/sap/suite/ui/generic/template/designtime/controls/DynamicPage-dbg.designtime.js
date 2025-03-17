/*!
* SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
*/
sap.ui.define([
	"sap/base/util/deepClone",
	"sap/suite/ui/generic/template/designtime/utils/designtimeUtils",
	"sap/base/util/ObjectPath",
	"sap/suite/ui/generic/template/genericUtilities/testableHelper"
],
	function (deepClone, designtimeUtils, ObjectPath, testableHelper) {
		"use strict";

		/**
		 * @typedef {Object} DesigntimeSetting
		 * @property {string} id - The ID of the designtime setting.
		 * @property {string} name - The name of the designtime setting.
		 * @property {string} description - The description of the designtime setting.
		 * @property {PropertyValue} [value] - The default value of the designtime setting.
		 * @property {string} type - The type of the designtime setting.
		 * @property {Array.<Enum>} [enums] - The array of possible enum values for the designtime setting.
		 * @property {(mControlDetails: ControlInfo) => string} [getPath] - The path to the designtime setting in the manifest.
		 * @property {boolean} [bSupportsGlobalScope] - Indicates if the setting supports global scope. (Default: false)
		 * @property {string[]} [restrictedTo] - The array of components for which the setting is restricted.
		 * @property {Partial<DesigntimeSetting>[]} [writeObject] - An array of DesigntimeSetting objects.
		 * @property {string} [writeObjectFor] - The value for which the writeObject should be applied.
		 * @property {boolean} [skipChange] - Indicates if the change should be skipped.

		===============================================
		 * @typedef {Object} ChangeParameters - Descriptor change parameters.
		 * @property {string} [sScope] - The scope of the manifest setting.
		 * @property {string} [sChangeType] - Desciptor change type.
		===============================================

		 * @typedef {Object} ControlInfo
		 * @property {string} [sParentComponentName] - The name of the parent component.
		 * @extends ChangeParameters

		 * @typedef {ChangeParameters & ControlInfo} ControlChangeParams

		 * @typedef {string | boolean | string[] | null } PropertyValue

		 * @typedef {Object} Enum
		 * @property {string} id - The ID of the enum value.
		 * @property {string} name - The name of the enum value.
		 * @property {Object} [value] - The value of the enum value.
		 */




		/**
		 * Retrieves the designtime metadata for the control.
		 * @param {Object} oControl - Dynamic Page control
		 * @returns {DesigntimeSetting[]} The designtime metadata
		 */
		function getAllDesigntimeSettings(oControl) {

			/**
			 * @type {DesigntimeSetting}
			*/
			const smartVariantManagement = {
				id: "smartVariantManagement",
				name: "Variant Management",
				description: "Enable Smart Variant Management",
				type: "booleanOrString",
				value: "true",
				enums: [
					{
						id: "true",
						name: "Entire Page"
					},
					{
						id: "false",
						name: "Per Control"
					}
				],
				getPath: () => getSettingsPath("smartVariantManagement")

			};

			/**
			 * @type {DesigntimeSetting}
			 */
			const hideVariantManagement = {
				id: "variantManagementHidden",
				name: "Hide Variant Management",
				description: "Hide Variant Management",
				type: "boolean",
				value: false,
				getPath: () => getSettingsPath("variantManagementHidden")
			};

			/**
			 * @type {DesigntimeSetting}
			 */
			const enableTableFilterInPageVariant = {
				id: "enableTableFilterInPageVariant",
				name: "Enable Table Filter in Page Variant",
				description: "Enable Table Filter in Page Variant",
				type: "boolean",
				value: false,
				getPath: () => getSettingsPath("enableTableFilterInPageVariant")
			};


			/**
			 * @type {DesigntimeSetting}
			 * enum for dataLoadSettings - ifFilterExists, always, never
			 */
			const initialLoad = {
				id: "loadDataOnAppLaunch",
				name: "Initial Load",
				description: "Initial Load",
				type: "string",
				value: "ifFilterExists",
				enums: [
					{
						id: "ifFilterExists",
						name: "Auto"
					},
					{
						id: "always",
						name: "Enabled"
					},
					{
						id: "never",
						name: "Disabled"
					}
				],
				getPath: () => "component/settings/dataLoadSettings/loadDataOnAppLaunch"
			};

			/**
			 * @type {DesigntimeSetting}
			 */
			const openInEditMode = {
				id: "editFlow",
				name: "Open in Edit Mode",
				description: "Define the selection limit",
				value: "display",
				type: "booleanOrStringCheckbox",
				getPath: () => getSettingsPath("editFlow"),
				enums: [
					{ id: "direct", name: "true" },
					{ id: "display", name: "false" }

				]
			};



			return [
				smartVariantManagement,
				hideVariantManagement,
				enableTableFilterInPageVariant,
				initialLoad,
				openInEditMode
			];

		}


		function getSettingsPath(name, mControlDetails) {
			return `component/settings/${name}`;
		}



		/**
		 * Retrieves the runtime adaptation properties based on the allowed design-time settings and global settings.
		 *
		 * @param {Array} aAllowedDesigntimeSettings - The array of allowed design-time settings.
		 * @param {Object} mLrOrALPSettings - The global manifest settings object.
		 * @returns {Object} - The object containing the runtime adaptation properties.
		 */
		function getRuntimeAdapationProperties(aAllowedDesigntimeSettings, mLrOrALPSettings) {
			const mPropertyValues = {};

			aAllowedDesigntimeSettings.forEach(oSetting => {
				const sProperty = oSetting.id;
				switch (sProperty) {
					case "smartVariantManagement":
						mPropertyValues[sProperty] = mLrOrALPSettings.smartVariantManagement || oSetting.value;
						break;
					case "variantManagementHidden":
						mPropertyValues[sProperty] = mLrOrALPSettings.variantManagementHidden || oSetting.value;
						break;
					case "enableTableFilterInPageVariant":
						mPropertyValues[sProperty] = mLrOrALPSettings.enableTableFilterInPageVariant || oSetting.value;
						break;
					case "loadDataOnAppLaunch":
						mPropertyValues[sProperty] = ObjectPath.get("dataLoadSettings.loadDataOnAppLaunch", mLrOrALPSettings) || oSetting.value;
						break;
					case "editFlow":
						mPropertyValues[sProperty] = mLrOrALPSettings.editFlow || oSetting.value;
						break;
					default:
						break;
				}
			});
			return mPropertyValues;
		}




		/**
		 * Opens the dialog for the table configuration.
		 * @param {sap.ui.core.Control} oControl - The control for which the dialog should be opened.
		 * @param {object} mPropertyBag - The property bag.
		 * @returns {Promise<ControlChangeParams[]>} - The changes.
		 */
		async function fnOpenTableConfigurationDialog(oControl, mPropertyBag) {
			const oResourceModel = oControl.getModel("i18n");
			const oComponent = designtimeUtils.getOwnerComponentFor(oControl);
			const mLrOrALPSettings = oComponent.mProperties;
			const aAllowedDesigntimeSettings = getAllDesigntimeSettings(oControl);

			// Get the current values of the properties
			const mRuntimeAdaptationPropertyValues = getRuntimeAdapationProperties(aAllowedDesigntimeSettings, mLrOrALPSettings);
			// Save the unchanged data to compare later
			const mUnchangedData = deepClone(mRuntimeAdaptationPropertyValues);
			// Get the settings of the dialog from the designtime settings using which the dialog will be created
			const aItems = designtimeUtils.getSettings(mRuntimeAdaptationPropertyValues, aAllowedDesigntimeSettings);

			// disable the scope control if there is only one option

			const mPropertyValuesEntered = await designtimeUtils.openAdaptionDialog([...aItems], mRuntimeAdaptationPropertyValues, mUnchangedData, "{i18n>RTA_CONFIGURATION_TITLE_LIST_REPORT}", { width: "650px", height: "800px" }, oResourceModel);


			/**
			 * @type {ControlChangeParams}
			 */
			const mPathParameters = {
				sChangeType: designtimeUtils.ChangeType.ChangePageConfiguration
			};
			return designtimeUtils.extractChanges(mPropertyValuesEntered, mUnchangedData, aAllowedDesigntimeSettings, oComponent, mPathParameters);

		}

		// Expose the functions for QUnit tests
		testableHelper.testableStatic(fnOpenTableConfigurationDialog, "fnOpenTableConfigurationDialog");


		const oHelper = {
			getDesigntime: function (oControl) {
				return {
					actions: {
						settings: {
							fe: {
								name: "Configuration",
								icon: "sap-icon://developer-settings",
								handler: fnOpenTableConfigurationDialog
							}
						}
					}
				};
			}
		};
		return oHelper;
	}
);
