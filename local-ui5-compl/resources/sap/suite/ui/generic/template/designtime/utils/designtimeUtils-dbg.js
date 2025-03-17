/*!
* SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
*/

sap.ui.define([
	"sap/base/util/ObjectPath",
	"sap/ui/core/Component",
	"sap/suite/ui/generic/template/genericUtilities/testableHelper"
], function (ObjectPath, Component, testableHelper) {
	"use strict";
	/**
	 * Creates the adaptation dialog content based on the provided settings, property values, and unchanged data.
	 * It dynamically generates UI controls based on the type of each setting and binds them to the provided data.
	 *
	 * @param {Settings[]} aDialogContent - An array of Settings objects that define the structure and data for the dialog content.
	 * @param {Object} propertyValues - An object containing the current values of the properties to be edited.
	 * @param {Object} unchangedData - An object containing the original values of the properties before any changes.
	 * @returns {Promise<sap.m.List>} A promise that resolves to a sap.m.List containing the generated dialog content.
	 */


	const SettingScope = {
		Page: "Page",
		Control: "Control",
		Application: "Application"
	};

	const ChangeType = {
		ChangePageConfiguration: "appdescr_ui_generic_app_changePageConfiguration",
		AddNewObjectPage: "appdescr_ui_generic_app_addNewObjectPage"
	};

	function fnCreateAdaptionDialogContent(aDialogContent, propertyValues, unchangedData) {
		return new Promise(function (resolve, reject) {
			sap.ui.require([
				"sap/ui/model/json/JSONModel",
				"sap/m/InputListItem",
				"sap/m/List",
				"sap/m/MultiInput",
				"sap/m/Input",
				"sap/m/CheckBox",
				"sap/ui/core/Item",
				"sap/m/Select",
				"sap/m/Token",
				"sap/m/MultiComboBox"
			], function (JSONModel, InputListItem, List, MultiInput, Input, CheckBox, Item, Select, Token, MultiComboBox) {
				const settingsModel = new JSONModel();
				settingsModel.setData(aDialogContent);

				const list = new List();
				list.setModel(settingsModel);

				const listItem = new InputListItem({ label: "{label}" });

				listItem.bindAggregation("content", {
					path: "control",
					factory: function (sId, oContext) {
						const type = oContext.getProperty("type");
						const id = oContext.getProperty("id");

						switch (type) {
							case "string":
								if (oContext.getProperty("enum")) {
									const item = new Item({ text: "{name}", key: "{id}" });
									const select = new Select({
										selectedItem: "{value}",
										change: function (event) {
											propertyValues[this.data("id")] = event.getParameter("selectedItem").getKey();
										},
										enabled: {
											path: "disabled",
											formatter: function (disabled) {
												return !disabled;
											}
										}
									}).data("id", id);

									select.bindItems({ path: "enum", template: item });
									select.setSelectedKey(unchangedData[id]);
									return select;
								} else {
									return new Input({
										value: "{value}",
										change: function (event) {
											propertyValues[this.data("id")] = event.getParameter("value");
										}
									}).data("id", id);
								}
							case "string[]":
								if (oContext.getProperty("enum")) {
									const multiSelectItem = new Item({ text: "{name}", key: "{id}" });
									const oMultiComboBox = new MultiComboBox({
										width: "60%",
										selectedKeys: propertyValues[id] || [],
										selectionChange: function (event) {
											propertyValues[this.data("id")] = event.getSource().getSelectedKeys();
										},
										enabled: {
											path: "disabled",
											formatter: function (disabled) {
												return !disabled;
											}
										}
									}).data("id", id);

									oMultiComboBox.bindItems({ path: "enum", template: multiSelectItem });
									oMultiComboBox.setSelectedKeys(unchangedData[id] || []);
									return oMultiComboBox;
								} else {
									const oMultiInput = new MultiInput({
										width: "70%",
										showValueHelp: false,
										showClearIcon: true,
										tokens: (propertyValues[id] || []).map(function (navigationProperty) {
											return new Token({ text: navigationProperty, key: navigationProperty });
										}),
										tokenUpdate: function (event) {
											const array = propertyValues[this.data("id")];
											if (event.getParameter("addedTokens").length > 0) {
												array.push(event.getParameter("addedTokens")[0].getKey());
											} else if (event.getParameter("removedTokens").length > 0) {
												const index = array.indexOf(event.getParameter("removedTokens")[0].getKey());
												if (index !== -1) {
													array.splice(index, 1);
												}
											}
										}
									}).data("id", id);

									oMultiInput.addValidator(function (args) {
										return new Token({ key: args.text, text: args.text });
									});
									return oMultiInput;
								}
							case "number":
								return new Input({
									value: "{value}",
									type: "Number",
									change: function (event) {
										propertyValues[this.data("id")] = parseFloat(event.getParameter("value"));
									}
								}).data("id", id);
							case "boolean":
								return new CheckBox({
									selected: "{value}",
									select: function (event) {
										propertyValues[this.data("id")] = event.getParameter("selected");
									}
								}).data("id", id);
							case "booleanOrString":
								const booleanOrStringItem = new Item({ text: "{name}", key: "{id}" });
								const booleanOrStringSelect = new Select({
									selectedItem: "{value}",
									change: function (event) {
										let value = event.getParameter("selectedItem").getKey();
										if (value.toLowerCase() === "false" || value.toLowerCase() === "true") {
											value = JSON.parse(value);
										}
										propertyValues[this.data("id")] = value;
									}
								}).data("id", id);

								booleanOrStringSelect.bindItems({ path: "enum", template: booleanOrStringItem });
								booleanOrStringSelect.setSelectedKey(unchangedData[id]);
								return booleanOrStringSelect;

							case "booleanOrStringCheckbox":
								const enums = oContext.getProperty("enum");
								const booleanOrStringCheckbox = new CheckBox({
									selected: unchangedData[id] === enums.find(e => e.name === "true").id,
									select: function (event) {
										const isSelected = event.getParameter("selected");
										const value = isSelected ? enums.find(e => e.name === "true").id : enums.find(e => e.name === "false").id;
										propertyValues[this.data("id")] = value;
									}
								}).data("id", id);
								return booleanOrStringCheckbox;

							case "json":
								return new Input({
									value: "{value}",
									change: function (event) {
										try {
											propertyValues[this.data("id")] = JSON.parse(event.getParameter("value"));
										} catch (e) {
											// Handle JSON parse error
										}
									}
								}).data("id", id);
							default:
								// unsupported type
								return null;
						}
					}
				});

				list.bindItems({ path: "/", template: listItem });
				resolve(list);
			});
		});
	}

	function getOwnerComponentFor(oElement) {
		return Component.getOwnerComponentFor(oElement);
	}
	/**
	 * @typedef {Object} PathParameters
	 * @property {string} sScope - The scope of the manifest setting.
	 * @property {ChangeType} sChangeType - Desciptor change type.
	 */

	/**
	 * Generates settings for the designtime based on the provided runtime settings and manifest settings data.
	 * It maps each manifest setting to a structured format that includes labels, tooltips, and controls,
	 * which are then used to create the adaptation dialog content.
	 *
	 * @param {Object} mRuntimeSettings - An object containing the current runtime settings.
	 * @param {Array<Object>} aManifestSettingsData - An array of objects representing the manifest settings data.
	 * @returns {Array<Settings>} An array of Settings objects, which can then be used to create the adaptation dialog content.
	 *
	 * @typedef {Object} Settings
	 * @property {string} label - The name of the setting.
	 * @property {string} tooltip - The description of the setting.
	 * @property {Array<Control>} control - An array of Control objects.
	 *
	 * @typedef {Object} Control
	 * @property {string} type - The type of the control (e.g., "string", "number").
	 * @property {Array<string>} [enum] - The enumeration values for the control, if applicable.
	 * @property {*} value - The current value of the control from mRuntimeSettings.
	 * @property {string} id - The unique identifier of the control.
	 * @property {boolean} [disabled] - An optional flag indicating if the control is disabled.
	 */
	function getSettings(mRuntimeSettings, aManifestSettingsData) {
		return aManifestSettingsData.map(function (oManifestSetting) {
			/**
			 * @type {Settings}
			 */
			const oSettingData = {
				label: oManifestSetting.name,
				tooltip: oManifestSetting.description,
				control: []
			};

			/**
			 * @type {Control}
			 */
			const oControlData = {
				type: oManifestSetting.type,
				"enum": oManifestSetting.enums,
				value: mRuntimeSettings[oManifestSetting.id],
				id: oManifestSetting.id
			};

			oSettingData.control.push(oControlData);
			return oSettingData;
		});
	}

	/**
	 * Convert change into a structure required by the flexibility tools.
	 *
	 * @param {Object} oComponent - The control for which the change should be created
	 * @param {string} propertyPath - The property path
	 * @param {string|string[]|boolean|number|object|undefined} propertyChanges - The property changes
	 * @param {string} sChangeType - Descriptor change type
	 * @param {boolean} bIsGlobalChange - The flag to indicate if the change is for global scope
	 * @returns {Object} The change structure used by flexibility tools
	 */
	let getChangeStructure = function (oComponent, propertyPath, propertyChanges, sChangeType = ChangeType.ChangePageConfiguration, bIsGlobalChange = false) {
		const oAppComponent = oComponent.getAppComponent();
		return {
			appComponent: oAppComponent,
			selector: oAppComponent,
			changeSpecificData: {
				appDescriptorChangeType: sChangeType,
				content: {
					parameters: {
						parentPage: {
							component: bIsGlobalChange ? "sap.suite.ui.generic.template" : oComponent.getMetadata().getComponentName(),
							entitySet: !bIsGlobalChange ? oComponent.getEntitySet() : undefined
						},
						entityPropertyChange: {
							propertyPath: propertyPath,
							operation: "UPSERT",
							propertyValue: propertyChanges
						}
					}
				}
			}
		};
	};

	async function fnOpenAdaptionDialog(items, propertyValues, unchangedData, title, size, oResourceModel) {
		const list = await fnCreateAdaptionDialogContent(items, propertyValues, unchangedData);
		return new Promise(function (resolve, reject) {
			sap.ui.require([
				"sap/m/Dialog",
				"sap/m/Button",
				"sap/m/MessageStrip"
			], function (Dialog, Button, MessageStrip) {
				const informationText = new MessageStrip({
					type: "Information",
					showIcon: true,
					text: "{i18n>RTA_CONFIGURATION_INFO_MESSAGE}"
				});
				informationText.addStyleClass("sapUiSmallMarginBottom");
				const dialog = new Dialog({
					title: title,
					contentWidth: size ? size.width : "550px",
					contentHeight: size ? size.height : "300px",
					content: [informationText, list],
					resizable: true,
					buttons: [
						new Button({
							text: "{i18n>RTA_CONFIGURATION_APPLY}",
							type: "Emphasized",
							press: function () {
								dialog.close();
								resolve(propertyValues);
							}
						}),
						new Button({
							text: "{i18n>RTA_CONFIGURATION_CANCEL}",
							press: function () {
								dialog.close();
								reject();
							}
						})
					]
				});
				dialog.setModel(oResourceModel, 'i18n');
				dialog.addStyleClass("sapUiContentPadding");
				dialog.addStyleClass("sapUiRTABorder");
				dialog.open();
			});
		});
	}

	/**
	 * @typedef {Object} DesigntimeSetting
	 * @property {string} id - The ID of the designtime setting.
	 * @property {string} name - The name of the designtime setting.
	 * @property {string} description - The description of the designtime setting.
	 * @property {PropertyValue} value - The default value of the designtime setting.
	 * @property {string} type - The type of the designtime setting.
	 * @property {Array.<Enum>} [enums] - The array of possible enum values for the designtime setting.
	 * @property {(mControlDetails: PathParameters) => string} [getPath] - The path to the designtime setting in the manifest.
	 * @property {boolean} [bSupportsGlobalScope] - Indicates if the setting supports global scope. (Default: false)
	 * @property {string[]} [restrictedTo] - The array of components for which the setting is restricted.
	 * @property {DesigntimeSetting[]} [writeObject] - An array of DesigntimeSetting objects.
	 * @property {string} [writeObjectFor] - The value of the setting for which the Object should be constructed.
	 * @property {boolean} [skipChange] - Indicates if the change should be skipped.

	* @typedef {string | boolean | string[] } PropertyValue

	* @typedef {Object} Enum
	* @property {string} id - The ID of the enum value.
	* @property {string} name - The name of the enum value.
	*/


	/**
	 * Retrieves the changed property values.
	 * @param {DesigntimeSetting[]} designtimeSettings - The array of designtime settings.
	 * @param {Object} unchangedData - The unchanged data.
	 * @param {Object} propertyValues - The property values.
	 * @param {PathParameters} mPathParameters - The path parameters.
	 * @returns {Object} - The changed property values.
	 */
	let getChangedPropertyValues = function (designtimeSettings, unchangedData, propertyValues, mPathParameters) {
		const propertyChanges = {};
		designtimeSettings.forEach(function (setting) {
			if (
				(typeof unchangedData[setting.id] !== "object" && unchangedData[setting.id] !== propertyValues[setting.id]) ||
				(typeof unchangedData[setting.id] === "object" && JSON.stringify(unchangedData[setting.id]) !== JSON.stringify(propertyValues[setting.id]))
			) {
				const propertyChangeKey = setting.getPath ? setting.getPath(mPathParameters) : setting.id;
				const changeObject = {};
				const bIsGlobalChange = !!setting.bSupportsGlobalScope && mPathParameters.sScope === SettingScope.Application;
				if (setting.writeObject?.length && setting.writeObjectFor === propertyValues[setting.id]) {
					setting.writeObject.forEach(function (settingsTogether) {
						changeObject[settingsTogether.getPath ? settingsTogether.getPath(mPathParameters) : settingsTogether.id] =
							propertyValues[settingsTogether.id];

					});
					propertyChanges[propertyChangeKey] = {
						value: changeObject,
						bIsGlobalChange
					};

				} else if (!setting.skipChange) {
					propertyChanges[propertyChangeKey] = {
						value: propertyValues[setting.id],
						bIsGlobalChange
					};
				}
			}
		});
		return propertyChanges;
	};

	let getChanges = function (mChanges, oComponent, sChangeType) {
		const aChanges = [];
		const oSingleChange = {};
		for (const [propertyPath, oPropertyChange] of Object.entries(mChanges)) {
			oSingleChange[propertyPath] = oPropertyChange.value;
			aChanges.push(getChangeStructure(oComponent, propertyPath, oPropertyChange.value, sChangeType, oPropertyChange.bIsGlobalChange));
		}
		return aChanges;
	};

	/**
	 * Extracts the changes.
	 * @param {Object} mPropertyValues - The property values.
	 * @param {Object} mUnchangedData - The unchanged data.
	 * @param {Array} aDesigntimeSettings - The array of designtime settings.
	 * @param {Object} oComponent - The component.
	 * @param {PathParameters} mPathParameters - The path parameters.
	 * @returns {Array} - The changes.
	 */

	function fnExtractChanges(mPropertyValues, mUnchangedData, aDesigntimeSettings, oComponent, mPathParameters) {
		const mChanges = getChangedPropertyValues(aDesigntimeSettings, mUnchangedData, mPropertyValues, mPathParameters);
		return getChanges(mChanges, oComponent, mPathParameters.sChangeType);
	}

	function getLocalId(oElement) {
		const oComponent = getOwnerComponentFor(oElement);
		return oComponent.getRootControl().getLocalId(oElement.getId());
	}

	/**
	 * Retrieves the supported global manifest settings for the given app component.
	 *
	 * @param {object} oAppComponent - The app component.
	 * @returns {object} - The supported global manifest settings.
	 */
	function getSupportedGlobalManifestSettings(oAppComponent) {
		const oManifest = oAppComponent.getManifest();
		const oSettings = oManifest["sap.ui.generic.app"]["settings"];

		const aSupportedGlobalManifestSettingKeys = ["tableSettings.createMode", "statePreservationMode", "flexibleColumnLayout", "inBoundParameters"];

		const oSupportedGlobalManifestSettings = {};

		aSupportedGlobalManifestSettingKeys.forEach(function (sKey) {
			const sValue = ObjectPath.get(sKey, oSettings);
			if (sValue) {
				ObjectPath.set(sKey, sValue, oSupportedGlobalManifestSettings);
			}
		});
		return oSupportedGlobalManifestSettings;
	}

	function getAllowedDesigntimeSettings(oControl, aDesigntimeSettings) {
		const sComponentName = getOwnerComponentFor(oControl).getMetadata().getComponentName();
		return aDesigntimeSettings.filter(oSetting => !oSetting.restrictedTo || oSetting.restrictedTo.includes(sComponentName));
	}


	// Add the functions to the testableHelper for testing which are not exported
	getChangedPropertyValues = testableHelper.testableStatic(getChangedPropertyValues, "getChangedPropertyValues");
	getChanges = testableHelper.testableStatic(getChanges, "getChanges");
	getChangeStructure = testableHelper.testableStatic(getChangeStructure, "getChangeStructure");

	return {
		openAdaptionDialog: fnOpenAdaptionDialog,
		getSettings,
		extractChanges: fnExtractChanges,
		getOwnerComponentFor,
		createAdaptionDialogContent: fnCreateAdaptionDialogContent,
		getLocalId,
		SettingScope,
		ChangeType,
		getSupportedGlobalManifestSettings,
		getAllowedDesigntimeSettings
	};
});
