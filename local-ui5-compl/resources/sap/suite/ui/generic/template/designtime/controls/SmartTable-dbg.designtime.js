/*!
* SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
*/
sap.ui.define([
	"sap/base/util/deepClone",
	"sap/base/util/merge",
	"sap/suite/ui/generic/template/designtime/utils/designtimeUtils",
	"sap/suite/ui/generic/template/genericUtilities/testableHelper"
],
	function (deepClone, merge, designtimeUtils, testableHelper) {
		"use strict";

		const sObjectPageComponentName = "sap.suite.ui.generic.template.ObjectPage";
		const sListReportComponentName = "sap.suite.ui.generic.template.ListReport";
		const { SettingScope } = designtimeUtils;

		/**
		 * @typedef {Object} DesigntimeSetting
		 * @property {string} id - The ID of the designtime setting.
		 * @property {string} name - The name of the designtime setting.
		 * @property {string} description - The description of the designtime setting.
		 * @property {PropertyValue} value - The default value of the designtime setting.
		 * @property {string} type - The type of the designtime setting.
		 * @property {Array.<Enum>=} enums - The array of possible enum values for the designtime setting.
		 * @property {(mSmartTableDetails: SmartTableInfo) => string=} getPath - The path to the designtime setting in the manifest.
		 * @property {boolean=} bSupportsGlobalScope - Indicates if the setting supports global scope. (Default: false)
		 * @property {string[]=} restrictedTo - The array of components for which the setting is restricted.
		 * @property {boolean=} bGlobalSettingsOnly - Indicates if the setting is only available in global settings. (Default: false)
		 */

		/**
		 * @typedef {Object} ChangeParameters - Descriptor change parameters.
		 * @property {string=} sScope - The scope of the manifest setting.
		 * @property {string=} sChangeType - Desciptor change type.
		 */

		/**
		 * @typedef {Object} SmartTableInfo
		 * @property {string} sParentComponentName - The name of the parent component.
		 * @property {string} sSectionKey - The ID of the facet.
		 * @property {string|null} sSelectedVariantKey - The selected tab key.
		 * @extends ChangeParameters
		 */

		/**
		 * @typedef {ChangeParameters & SmartTableInfo} SmartTableChangeParams
		 */

		/**
		 * @typedef {number | string | boolean | string[] } PropertyValue
		 */

		/**
		 * @typedef {Object} Enum
		 * @property {string} id - The ID of the enum value.
		 * @property {string} name - The name of the enum value.
		 */

		function getSelectedTabKey(oSmartTable) {
			// traverse the parent until the control is IconTabBar
			const sSmartTableLocalId = designtimeUtils.getLocalId(oSmartTable);
			return sSmartTableLocalId.split("-")[1];
		}

		/**
		 * Retrieves the variant info for the selected tab.
		 *
		 * @param {*} oComponent - The component.
		 * @param {string} sSelectedTabKey - The selected tab key.
		 * @returns {[string, *]} - The variant info for the selected tab.
		 */
		function getVariantInfo(oComponent, sSelectedTabKey) {
			const oQuickVariantSelectionX = oComponent.getQuickVariantSelectionX();
			const oVariants = oQuickVariantSelectionX?.variants || {};
			const aVariantInfo = Object.entries(oVariants).find(([_, oVariant]) => oVariant.key === sSelectedTabKey);
			if (!aVariantInfo?.length) {
				throw new Error("Error while retrieving the variant info for the selected tab");
			}
			return aVariantInfo;
		}

		function getManifestTableSettings(oSmartTable) {
			const oComponent = designtimeUtils.getOwnerComponentFor(oSmartTable);
			const oAppComponent = oComponent.getAppComponent();
			const oSupportedGlobalTableSettings = designtimeUtils.getSupportedGlobalManifestSettings(oAppComponent)?.["tableSettings"] || {};

			let oEffectiveTableSettings;
			if (oComponent.getMetadata().getComponentName() === sObjectPageComponentName) {
				const oSections = oComponent.getSections();
				const sSectionKey = getSectionKey(oSmartTable);
				const oSectionTableSettings = oSections?.[sSectionKey]?.tableSettings || {};
				oEffectiveTableSettings = merge(oSupportedGlobalTableSettings, oSectionTableSettings);
			} else {
				const oComponentTableSettings = oComponent.getTableSettings() || {};
				let oSelectedVariantTableSettings = {};
				if (oComponent.getQuickVariantSelectionX?.()) {
					const sSelectedTabKey = getSelectedTabKey(oSmartTable);
					const aVariantInfo = getVariantInfo(oComponent, sSelectedTabKey);
					const [, oVariant] = aVariantInfo;
					oSelectedVariantTableSettings = oVariant.tableSettings || {};
				}
				oEffectiveTableSettings = merge(oSupportedGlobalTableSettings, oComponentTableSettings, oSelectedVariantTableSettings);
			}
			return oEffectiveTableSettings;
		}

		function getSectionKey(oSmartTable) {
			const sSmartTableId = designtimeUtils.getLocalId(oSmartTable);
			// ID must not be of the inner table
			return sSmartTableId.split("::Table")[0];
		}

		/**
		 * Retrieves the adaptation properties for the SmartTable.
		 *
		 * Property values are retrieved from the manifest.
		 *
		 * @param {DesigntimeSetting[]} aDesigntimeSettings - The array of designtime settings.
		 * @param {object} oTableSettings - The table settings from the manifest.
		 * @returns {Object} - The adaptation properties for the SmartTable.
		 */
		function getRuntimeAdapationProperties(aDesigntimeSettings, oTableSettings) {
			const mPropertyValues = {};
			// Handle the multiple ways of defining the table type?
			aDesigntimeSettings.forEach(oSetting => {
				const sProperty = oSetting.id;
				switch (sProperty) {
					case "type":
						mPropertyValues[sProperty] = oTableSettings.type || oSetting.value;
						break;
					case "multiSelect":
						mPropertyValues[sProperty] = oTableSettings.multiSelect || oSetting.value;
						break;
					case "createMode":
						mPropertyValues[sProperty] = oTableSettings.createMode || oSetting.value;
						break;
					case "selectAll":
						mPropertyValues[sProperty] = oTableSettings.selectAll || oSetting.value;
						break;
					case "condensedTableLayout":
						mPropertyValues[sProperty] = oTableSettings.condensedTableLayout || oSetting.value;
						break;
					case "widthIncludingColumnHeader":
						mPropertyValues[sProperty] = oTableSettings.widthIncludingColumnHeader || oSetting.value;
						break;
					case "addCardtoInsightsHidden":
						mPropertyValues[sProperty] = oTableSettings.addCardtoInsightsHidden || oSetting.value;
						break;
					case "selectionLimit":
						mPropertyValues[sProperty] = oTableSettings.selectionLimit || oSetting.value;
						break;
					default:
						break;
				}
			});
			return mPropertyValues;
		}

		async function fnOpenTableConfigurationDialog(oSmartTable, mPropertyBag) {
			const oResourceModel = oSmartTable.getModel("i18n");
			const oComponent = designtimeUtils.getOwnerComponentFor(oSmartTable);
			const sComponentName = oComponent.getMetadata().getComponentName();
			// Get the allowed designtime settings for the SmartTable
			const aAllowedDesigntimeSettings = getAllowedDesigntimeSettings(oSmartTable);

			// Get the other table properties outside of the tableSettings Eg: settings/condensedTableLayout
			const aOtherTableProperties = ["condensedTableLayout"];

			const mOtherTableSettings = aOtherTableProperties.reduce((mSettings, sProperty) => {
				mSettings[sProperty] = oComponent.getProperty(sProperty);
				return mSettings;
			}, {});

			// Get the table settings from the manifest
			const mTableSettings = getManifestTableSettings(oSmartTable);

			// Get the current values of the properties
			const mRuntimeAdaptationPropertyValues = getRuntimeAdapationProperties(aAllowedDesigntimeSettings, Object.assign(mOtherTableSettings, mTableSettings));

			// Save the unchanged data to compare later
			const mUnchangedData = deepClone(mRuntimeAdaptationPropertyValues);
			// Get the settings of the dialog from the designtime settings using which the dialog will be created
			const aItems = designtimeUtils.getSettings(mRuntimeAdaptationPropertyValues, aAllowedDesigntimeSettings);
			// Add the scope of the changes
			const oScopeControlData = {
				type: "string",
				"enum": [
					{ id: SettingScope.Page, name: SettingScope.Page }
				],
				value: SettingScope.Page,
				id: "scope",
				disabled: false
			};
			const aChangeScopeOption = [
				{
					label: "Scope of the changes",
					tooltip: "Scope of the changes",
					control: [
						oScopeControlData
					]
				}
			];

			// if the component has quickVariantSelectionX then add the control scope
			const bHasQuickVariantSelectionX = oComponent.getQuickVariantSelectionX?.();
			if (bHasQuickVariantSelectionX) {
				oScopeControlData.enum.push({ id: SettingScope.Control, name: SettingScope.Control });
			}

			// if the allowed designtime settings contain a setting that supports global scope which is not a global settings only
			// then add the global scope option
			const bShowGlobalScopeOption = aAllowedDesigntimeSettings.some(oSetting => oSetting.bSupportsGlobalScope && !oSetting.bGlobalSettingsOnly);

			if (bShowGlobalScopeOption) {
				oScopeControlData.enum.push({ id: SettingScope.Application, name: SettingScope.Application });
			}
			// disable the scope control if there is only one option
			oScopeControlData.disabled = oScopeControlData.enum.length <= 1;

			const mPropertyValuesEntered = await designtimeUtils.openAdaptionDialog([...aChangeScopeOption, ...aItems], mRuntimeAdaptationPropertyValues, mUnchangedData, "{i18n>RTA_CONFIGURATION_TITLE_TABLE}", { width: "650px", height: "800px" }, oResourceModel);

			const sSelectedTabKey = getSelectedTabKey(oSmartTable);
			const sSelectedVariantKey = sSelectedTabKey ? getVariantInfo(oComponent, sSelectedTabKey)[0] : null;

			// if the scope is not set, set it to the default is "Page Scope"
			mPropertyValuesEntered["scope"] = mPropertyValuesEntered["scope"] || SettingScope.Page;
			mUnchangedData["scope"] = mUnchangedData["scope"] || SettingScope.Page;

			/**
			 * @type {SmartTableChangeParams}
			 */
			const mPathParameters = {
				sChangeType: designtimeUtils.ChangeType.ChangePageConfiguration,
				sParentComponentName: sComponentName,
				// used in case of ObjectPage only
				sSectionKey: sComponentName === sObjectPageComponentName ? getSectionKey(oSmartTable) : null,
				// used in case of multiple views only
				sSelectedVariantKey,
				sScope: mPropertyValuesEntered["scope"]
			};
			return designtimeUtils.extractChanges(mPropertyValuesEntered, mUnchangedData, aAllowedDesigntimeSettings, oComponent, mPathParameters);

		}

		/**
		 * Retrieves the path to the setting in the `tableSettings` section of the manifest.
		 *
		 * @param {string} sSettingId - The ID of the setting.
		 * @param {boolean} bSupportsGlobalScope - Indicates if the setting supports global scope.
		 * @returns {(mSmartTableInfo: SmartTableInfo) => string} - The path to the setting in the manifest.
		 *
		 * @example
		 * // Example manifest structure
		 * {
		 *   "component": {
		 *     "settings": {
		 *       "sections": {
		 *         "section1": {
		 *           "tableSettings": {
		 *             "type": "ResponsiveTable"
		 *           }
		 *         }
		 *       }
		 *     }
		 *   }
		 * }
		 */

		let getPathForTableSettings = function getPathForTableSettings(sSettingId, bSupportsGlobalScope = false) {
			/**
			 * @param {SmartTableChangeParams} mSmartTableInfo - The SmartTable details.
			 * @returns {string} - The path to the setting in the manifest.
			 */
			return function (mSmartTableInfo) {
				if (mSmartTableInfo.sParentComponentName === sObjectPageComponentName) {
					return `component/settings/sections/${mSmartTableInfo.sSectionKey}/tableSettings/${sSettingId}`;
				} else {
					// Path defaults to page scope
					let path = `component/settings/tableSettings/${sSettingId}`;
					if (mSmartTableInfo.sScope === SettingScope.Application && bSupportsGlobalScope) {
						path = `settings/tableSettings/${sSettingId}`;
					}
					if (mSmartTableInfo.sScope === SettingScope.Control && mSmartTableInfo.sSelectedVariantKey) {
						path = `component/settings/quickVariantSelectionX/variants/${mSmartTableInfo.sSelectedVariantKey}/tableSettings/${sSettingId}`;
					}
					return path;
				}
			};
		};

		/**
		 * Retrieves the designtime settings for the SmartTable.
		 * @param {object} oSmartTable - The SmartTable object.
		 * @returns {DesigntimeSetting[]} - The designtime settings for the SmartTable.
		 */
		let getAllowedDesigntimeSettings = function getAllowedDesigntimeSettings(oSmartTable) {
			/**
			 * @type {DesigntimeSetting}
			 */
			const tableType = {
				id: "type",
				name: "Table Type",
				description: "Define which table type should be used",
				value: "ResponsiveTable",
				type: "string",
				getPath: getPathForTableSettings("type"),
				enums: [
					{ id: "ResponsiveTable", name: "Responsive Table" },
					{ id: "GridTable", name: "Grid Table" },
					{ id: "TreeTable", name: "Tree Table" },
					{ id: "AnalyticalTable", name: "Analytical Table" }
				],
				bSupportsGlobalScope: false
			};

			/**
			 * @type {DesigntimeSetting}
			 */

			const selectionMode = {
				id: "multiSelect",
				name: "Selection Mode",
				description: "Define the selection mode",
				value: false,
				type: "booleanOrString",
				getPath: getPathForTableSettings("multiSelect"),
				bSupportsGlobalScope: false,
				enums: [
					{ id: "false", name: "Single" },
					{ id: "true", name: "Multi" }
				]
			};

			/**
			 * @type {DesigntimeSetting}
			 */
			const selectAll = {
				id: "selectAll",
				name: "Enable Select All",
				description: "Define if the table should support select all",
				value: false,
				type: "boolean",
				getPath: getPathForTableSettings("selectAll"),
				bSupportsGlobalScope: false
			};

			// /**
			//  * @type {DesigntimeSetting}
			//  */
			// const createMode = {
			// 	id: "createMode",
			// 	name: "Create Mode",
			// 	description: "Define the create mode",
			// 	value: "creationRows",
			// 	type: "string",
			// 	getPath: getPathForTableSettings("createMode", true),
			// 	enums: [
			// 		{ id: "creationRows", name: "creationRows" },
			// 		{ id: "NewPage", name: "NewPage" },
			// 		{ id: "Inline", name: "Inline" }
			// 	],
			// 	bSupportsGlobalScope: true,
			// 	restrictedTo: [sObjectPageComponentName]
			// };

			/**
			 * @type {DesigntimeSetting}
			 */
			const condensedTableLayout = {
				id: "condensedTableLayout",
				name: "Condensed Table Layout",
				description: "Define if the table should have a condensed layout",
				value: false,
				type: "boolean",
				getPath: () => "component/settings/condensedTableLayout",
				bSupportsGlobalScope: false
			};

			/**
			 * @type {DesigntimeSetting}
			 */
			const widthIncludingColumnHeader = {
				id: "widthIncludingColumnHeader",
				name: "Width Including Column Header",
				description: "Define if the table should have a width including column header",
				value: false,
				type: "boolean",
				getPath: getPathForTableSettings("widthIncludingColumnHeader"),
				bSupportsGlobalScope: true,
				restrictedTo: [sListReportComponentName],
				bGlobalSettingsOnly: true
			};

			/**
			 * @type {DesigntimeSetting}
			 */
			const addCardtoInsightsHidden = {
				id: "addCardtoInsightsHidden",
				name: "Disable Insights",
				description: "Define if the table should have a insights button",
				value: false,
				type: "boolean",
				getPath: getPathForTableSettings("addCardtoInsightsHidden"),
				restrictedTo: [sListReportComponentName]
			};

			/**
			 * @type {DesigntimeSetting}
			 */
			const selectionLimit = {
				id: "selectionLimit",
				name: "Selection Limit",
				description: "Define the selection limit",
				value: 300,
				type: "number",
				getPath: getPathForTableSettings("selectionLimit")
			};



			const designtimeSettings = [
				tableType,
				condensedTableLayout,
				widthIncludingColumnHeader,
				selectionMode,
				selectAll,
				// createMode,
				selectionLimit,
				addCardtoInsightsHidden
			];

			return designtimeSettings.filter(oSetting => {
				const sComponentName = designtimeUtils.getOwnerComponentFor(oSmartTable).getMetadata().getComponentName();
				return !oSetting.restrictedTo || oSetting.restrictedTo.includes(sComponentName);
			});
		};

		// Expose the functions for QUnit tests
		getAllowedDesigntimeSettings = testableHelper.testableStatic(getAllowedDesigntimeSettings, "getAllowedDesigntimeSettings");
		getPathForTableSettings = testableHelper.testableStatic(getPathForTableSettings, "getPathForTableSettings");
		testableHelper.testableStatic(getRuntimeAdapationProperties, "getRuntimeAdapationProperties");
		testableHelper.testableStatic(getManifestTableSettings, "getManifestTableSettings");
		testableHelper.testableStatic(getSelectedTabKey, "getSelectedTabKey");
		testableHelper.testableStatic(getVariantInfo, "getVariantInfo");
		testableHelper.testableStatic(fnOpenTableConfigurationDialog, "fnOpenTableConfigurationDialog");


		const oHelper = {
			getDesigntime: function (oSmartTable) {
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
