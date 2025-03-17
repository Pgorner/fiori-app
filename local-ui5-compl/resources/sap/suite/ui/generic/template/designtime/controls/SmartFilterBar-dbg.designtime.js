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

		const LIST_REPORT_COMPONENT_NAME = "sap.suite.ui.generic.template.ListReport";
		// ALP
		const ANALYTICAL_LIST_PAGE_COMPONENT_NAME = "sap.suite.ui.generic.template.AnalyticalListPage";

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
	 * Retrieves the runtime adaptation properties based on the allowed design-time settings and global settings.
	 *
	 * @param {Array} aAllowedDesigntimeSettings - The array of allowed design-time settings.
	 * @param {Object} mFilterSettings - The global manifest settings object.
	 * @returns {Object} - The object containing the runtime adaptation properties.
	 */
		function getRuntimeAdapationProperties(aAllowedDesigntimeSettings, mFilterSettings) {
			const mPropertyValues = {};

			aAllowedDesigntimeSettings.forEach(oSetting => {
				const sProperty = oSetting.id;
				switch (sProperty) {
					case "useDateRange":
						mPropertyValues[sProperty] = mFilterSettings[sProperty] || oSetting.value;
						break;
					case "navigationProperties":
						mPropertyValues[sProperty] = mFilterSettings[sProperty] || oSetting.value;
						break;


					default:
						break;
				}
			});
			return mPropertyValues;
		}

		/**
		 * Retrieves the designtime settings for the Control.
		 * @param {object} oControl - The Control object.
		 * @returns {DesigntimeSetting[]}
		 */
		let getAllDesigntimeSettings = function getAllDesigntimeSettings(oControl) {
			/**
			 * Retrieves the enums for the SmartFilterBar control.
			 * @param {Array<string>} aPropertyNames - The array of enums.
			 * @returns {Array<Enum>} - The array of enums.
			 */
			function getEnums(aPropertyNames) {
				return aPropertyNames.map(sPropertyName => {
					return {
						id: sPropertyName,
						name: sPropertyName
					};
				});
			}

			/**
			 * Retrieves the navigation properties for the SmartFilterBar control.
			 * @returns {Array<string>} - The array of navigation properties.
			 */

			function getNavigationProperties() {
				const oMetaModel = oControl.getModel().getMetaModel();
				// Get the entity set of the SmartFilterBar control
				const sEntitySet = oControl.getEntitySet?.();
				if (!sEntitySet){
					throw new Error("Error while retrieving the entity set of the SmartFilterBar control");
				}

				const oEntityType = oMetaModel.getODataEntityType(oMetaModel.getODataEntitySet(sEntitySet).entityType);
				// Sibling entity types are the navigation properties
				return (oEntityType.navigationProperty || [])
					.map(oNavigationProperty => oNavigationProperty.name)
					.filter(sNavigationProperty => sNavigationProperty !== "SiblingEntity");
			}

			/**
			 * @type {DesigntimeSetting}
			*/

			const enableDateRange = {
				id: "useDateRange",
				name: "Enable Date Range",
				description: "Enable Date Range",
				value: true,
				type: "boolean",
				getPath: function (mControlDetails) {
					return `component/settings/filterSettings/dateSettings/useDateRange`;
				},
				restrictedTo: [LIST_REPORT_COMPONENT_NAME, ANALYTICAL_LIST_PAGE_COMPONENT_NAME]
			};


			/**
			 * @type {DesigntimeSetting}
			 */

			const navigationProperties = {
				id: "navigationProperties",
				name: "Navigation Properties",
				description: "Navigation Properties",
				type: "string[]",
				getPath: function (mControlDetails) {
					return `component/settings/filterSettings/navigationProperties`;
				},
				value: [],
				restrictedTo: [LIST_REPORT_COMPONENT_NAME, ANALYTICAL_LIST_PAGE_COMPONENT_NAME],
				enums: getEnums(getNavigationProperties())
			};


			return [enableDateRange, navigationProperties];
		};



		function getFilterSettings(oComponent) {
			const mFilterSettings = oComponent.getFilterSettings();
			return {
				useDateRange: ObjectPath.get("dateSettings.useDateRange", mFilterSettings),

				navigationProperties: ObjectPath.get("navigationProperties", mFilterSettings)
			};
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
			// Get the filter settings from the component
			const mFilterSettings = getFilterSettings(oComponent);

			// Get all the designtime settings
			const aAllDesigntimeSettings = getAllDesigntimeSettings(oControl);
			// Get the allowed designtime settings based on the floorplan
			const aAllowedDesigntimeSettings = designtimeUtils.getAllowedDesigntimeSettings(oControl, aAllDesigntimeSettings);

			// Get the current values of the properties
			const mRuntimeAdaptationPropertyValues = getRuntimeAdapationProperties(aAllowedDesigntimeSettings, mFilterSettings);
			// Save the unchanged data to compare later
			const mUnchangedData = deepClone(mRuntimeAdaptationPropertyValues);
			// Get the settings of the dialog from the designtime settings using which the dialog will be created
			const aItems = designtimeUtils.getSettings(mRuntimeAdaptationPropertyValues, aAllowedDesigntimeSettings);

			// disable the scope control if there is only one option

			const mPropertyValuesEntered = await designtimeUtils.openAdaptionDialog([...aItems], mRuntimeAdaptationPropertyValues, mUnchangedData, "{i18n>RTA_CONFIGURATION_TITLE_FILTER_BAR}", { width: "650px", height: "800px" }, oResourceModel);


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
