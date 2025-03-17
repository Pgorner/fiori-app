/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import { getKeyParameters } from "sap/cards/ap/common/services/RetrieveCard";
import Component from "sap/ui/core/Component";
import CoreLib from "sap/ui/core/Lib";
import { CardManifest } from "sap/ui/integration/widgets/Card";
import JSONModel from "sap/ui/model/json/JSONModel";
import V2ODataModel from "sap/ui/model/odata/v2/ODataModel";
import V4ODataModel from "sap/ui/model/odata/v4/ODataModel";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import { ArrangementOptions } from "../app/controls/ArrangementsEditor";
import { PropertyInfoMap } from "../odata/ODataTypes";
import {
	createPathWithEntityContext,
	fetchDataAsync,
	getLabelForEntitySet,
	getNavigationPropertyInfoFromEntity,
	getPropertyInfoFromEntity
} from "../odata/ODataUtils";
import { ActionStyles, AnnotationAction, ControlProperties } from "../types/ActionTypes";
import { ApplicationInfo, ODataModelVersion } from "./ApplicationInfo";
import { getActionStyles, getCardActions, getDefaultAction } from "./FooterActions";
import {
	FormatterConfiguration,
	FormatterConfigurationMap,
	formatPropertyDropdownValues,
	getDefaultPropertyFormatterConfig,
	getDefaultPropertyFormatterConfigForNavProperties
} from "./Formatter";
import { parseCard } from "./IntegrationCardHelper";
import { getNavigationPropertiesWithLabel } from "./NavigationProperty";
import { resolvePropertyPathFromExpression } from "./PropertyExpression";

export type GroupItem = {
	label: string;
	value: string;
	isEnabled: boolean;
	name: string;
	navigationProperty?: string;
	isNavigationEnabled?: boolean;
	navigationalProperties?: Array<string>;
};

export type EntityType = {
	[key: string]: any;
};
export type Property = {
	label?: string;
	type: string;
	name: string;
};
export type NavigationParameter = {
	name: string;
	value: Array<string>;
	properties?: Property[];
};
export type NavigationalData = {
	name: string;
	value: Property[];
};
export type NavigationParameters = {
	parameters: NavigationParameter[];
};

export type ObjectCardGroups = {
	title: string;
	items: Array<GroupItem>;
};

export type CriticalityOptions = {
	activeCalculation: boolean;
	name: string;
	criticality: string;
};

export type MainIndicatorOptions = {
	criticality: Array<CriticalityOptions>;
};

type UnitOfMeasures = {
	propertyKeyForDescription: string;
	name: string;
	propertyKeyForId: string;
	value: string;
};

type AdvancedFormattingOptions = {
	unitOfMeasures: Array<UnitOfMeasures>;
	textArrangements: Array<ArrangementOptions>;
	propertyValueFormatters: Array<object>;
	sourceCriticalityProperty: Array<object>;
	targetFormatterProperty: string;
	sourceUoMProperty: string;
	selectedKeyCriticality: string;
	textArrangementSourceProperty: string;
	isPropertyFormattingEnabled?: boolean;
};

export type TrendOptions = {
	referenceValue: string;
	downDifference: string;
	upDifference: string;
	targetValue?: string;
	sourceProperty?: string;
};
export type SideIndicatorOptions = {
	targetValue: string;
	targetUnit: string;
	deviationValue: string;
	deviationUnit: string;
	sourceProperty?: string;
};

type CardActions = {
	annotationActions: Array<AnnotationAction>;
	addedActions: ControlProperties[];
	bODataV4: boolean;
	styles: ActionStyles[];
	isAddActionEnabled: boolean;
	actionExists: boolean;
};

type PropertyValue = string | null | undefined;

export type TrendOrIndicatorOptions = {
	sourceProperty: string;
};

type KeyParameter = {
	key: string;
	formattedValue: string;
};

/**
 * Description for the interface CardGeneratorDialogConfiguration
 * @interface CardGeneratorDialogConfiguration
 * @property {string} title The title of the card
 * @property {string} subtitle The subtitle of the card
 * @property {string} headerUOM The header unit of measure
 * @property {MainIndicatorOptions} mainIndicatorOptions The main indicator options
 * @property {string} mainIndicatorStatusKey The main indicator status key
 * @property {string} mainIndicatorStatusUnit The main indicator status unit
 * @property {string} entitySet The entity set
 * @property {Array<ObjectCardGroups>} groups The groups of the card displayed on content
 * @property {Array<object>} properties The properties
 * @property {AdvancedFormattingOptions} advancedFormattingOptions The advanced formatting options
 * @property {Array<object>} selectedTrendOptions The selected trend options
 * @property {Array<object>} selectedIndicatorOptions The selected indicator options
 * @property {TrendOptions} trendOptions The trend options
 * @property {object} $data Data used for adaptive card preview
 * @property {object} targetUnit The target unit
 * @property {object} deviationUnit The deviation unit
 * @property {boolean} groupLimitReached Flag maintained to check if the group limit is reached
 * @property {Array<KeyParameter>} keyParameters The key parameters
 */
interface CardGeneratorDialogConfiguration {
	title: string;
	subtitle?: string;
	headerUOM?: string;
	mainIndicatorOptions?: MainIndicatorOptions;
	mainIndicatorStatusKey?: string;
	mainIndicatorStatusUnit?: string;
	mainIndicatorNavigationSelectedValue?: string;
	mainIndicatorNavigationSelectedKey?: string;
	entitySet: string;
	groups: Array<ObjectCardGroups>;
	properties: Array<object>;
	advancedFormattingOptions: AdvancedFormattingOptions;
	selectedTrendOptions: Array<TrendOptions>;
	selectedIndicatorOptions: Array<SideIndicatorOptions>;
	navigationProperty: Array<object>;
	selectedContentNavigation: Array<NavigationParameter>;
	selectedHeaderNavigation: Array<NavigationParameter>;
	selectedNavigationPropertyHeader: NavigationParameter;
	trendOptions: TrendOptions;
	oDataV4: boolean;
	serviceUrl: string;
	$data?: object;
	targetUnit?: object;
	deviationUnit?: object;
	actions: CardActions;
	groupLimitReached: boolean;
	keyParameters: Array<KeyParameter>;
}

interface CardGeneratorDialog {
	title: string;
	configuration: CardGeneratorDialogConfiguration;
}

const UnitCollection = [
	{
		Name: "K",
		Value: "K"
	},
	{
		Name: "%",
		Value: "%"
	}
];

/**
 * Merges the default property formatters with the user provided property formatters
 *
 * @param {FormatterConfigurationMap} defaultPropertyFormatters The default property formatters
 * @param {FormatterConfigurationMap} userProvidedPropertyFormatters The user provided property formatters
 * @returns {FormatterConfigurationMap} The merged property formatters
 * @private
 *
 */
export function _mergePropertyFormatters(
	defaultPropertyFormatters: FormatterConfigurationMap = [],
	userProvidedPropertyFormatters: FormatterConfigurationMap = []
): FormatterConfigurationMap {
	const mergedFormatters = [...userProvidedPropertyFormatters] as FormatterConfigurationMap;

	for (const propertyFormatter of defaultPropertyFormatters) {
		if (!mergedFormatters.find((formatter) => formatter.property === propertyFormatter.property)) {
			mergedFormatters.push({ ...propertyFormatter });
		}
	}

	return mergedFormatters;
}

export async function getCardActionInfo(
	oAppComponent: Component,
	data: Record<string, PropertyValue>,
	resourceModel?: ResourceModel,
	mCardManifest?: CardManifest
) {
	const { odataModel, entitySet } = ApplicationInfo.getInstance().fetchDetails();
	const bODataV4 = odataModel === ODataModelVersion.V4;
	const cardActions = getCardActions(oAppComponent, entitySet, bODataV4);
	return {
		annotationActions: cardActions,
		addedActions: cardActions.length > 0 ? await getDefaultAction(resourceModel, data, mCardManifest) : [],
		bODataV4: bODataV4,
		styles: getActionStyles(),
		isAddActionEnabled: true,
		actionExists: cardActions.length > 0
	};
}

export function updateUnitOfMeasures(
	unitOfMeasures: Array<UnitOfMeasures>,
	formatterConfigsWithUnit: FormatterConfigurationMap
): Array<UnitOfMeasures> {
	formatterConfigsWithUnit.forEach((formatter: FormatterConfiguration) => {
		const matchingProperty = unitOfMeasures.find((unitConfig: UnitOfMeasures) => unitConfig.name === formatter.property);
		let value = formatter.parameters?.[0].value?.replace(/\$\{/g, "");
		value = value?.replace(/\}/g, "");
		const formatterProperty = formatter.property;

		if (matchingProperty && value) {
			matchingProperty.propertyKeyForDescription = value;
			matchingProperty.value = value;
		} else if (value && formatterProperty) {
			unitOfMeasures.push({
				propertyKeyForDescription: value,
				name: formatterProperty,
				propertyKeyForId: formatterProperty,
				value: value
			});
		}
	});
	return unitOfMeasures;
}

export const getCardGeneratorDialogModel = async (oAppComponent: Component, mCardManifest?: CardManifest) => {
	const applicationInfo = ApplicationInfo.getInstance().fetchDetails();
	const oResourceBundle = CoreLib.getResourceBundleFor("sap.cards.ap.generator.i18n");
	const mManifest = oAppComponent.getManifest();
	const oAppModel = oAppComponent.getModel();
	const cardTitle: string = mManifest["sap.app"].title;
	const cardSubtitle: string = mManifest["sap.app"].description;
	const { entitySetWithObjectContext, serviceUrl, semanticObject, action } = applicationInfo;
	const entitySetName = applicationInfo.entitySet;
	const bODataV4 = applicationInfo.odataModel === ODataModelVersion.V4;
	const entitySet = getLabelForEntitySet(bODataV4 ? (oAppModel as V4ODataModel) : (oAppModel as V2ODataModel), entitySetName);
	const properties = getPropertyInfoFromEntity(
		bODataV4 ? (oAppModel as V4ODataModel) : (oAppModel as V2ODataModel),
		entitySetName,
		false
	);
	const propertiesWithNavigation = getPropertyInfoFromEntity(
		bODataV4 ? (oAppModel as V4ODataModel) : (oAppModel as V2ODataModel),
		entitySetName,
		true,
		oResourceBundle
	);
	const navigationProperty = getNavigationPropertyInfoFromEntity(
		bODataV4 ? (oAppModel as V4ODataModel) : (oAppModel as V2ODataModel),
		entitySetName
	);

	const selectProperties = properties.map((property) => property.name);
	let urlParameters = {};
	if (selectProperties.length) {
		urlParameters = {
			$select: selectProperties.join(",")
		};
	}

	const path = await createPathWithEntityContext(entitySetWithObjectContext, oAppModel, bODataV4);
	const data = await fetchDataAsync(serviceUrl, path, bODataV4, urlParameters);
	const unitOfMeasures: Array<UnitOfMeasures> = [];
	const mData: {
		[key: string]: PropertyValue;
	} = {};
	// We are adding labels and values for properties
	addLabelsForProperties(properties, data, mData, unitOfMeasures);

	let propertyValueFormatters = getDefaultPropertyFormatterConfig(oResourceBundle, properties);
	const propertyValueFormattersForNavigationalProperties = getDefaultPropertyFormatterConfigForNavProperties(oResourceBundle, navigationProperty);
	propertyValueFormatters = _mergePropertyFormatters(propertyValueFormatters, propertyValueFormattersForNavigationalProperties);

	let parsedManifest;
	if (mCardManifest) {
		parsedManifest = parseCard(mCardManifest, oAppComponent.getModel("i18n") as ResourceModel, properties);

		for (const textArrangement of parsedManifest.textArrangementsFromCardManifest) {
			if (textArrangement.isNavigationForDescription) {
				const navigationEntitySet = textArrangement.propertyKeyForDescription;
				const { propertiesWithLabel, navigationPropertyData } = await getNavigationPropertiesWithLabel(
					oAppComponent,
					navigationEntitySet,
					path
				);
				textArrangement.navigationalPropertiesForDescription = propertiesWithLabel;
				updateNavigationPropertiesWithLabel(
					navigationProperty,
					navigationEntitySet,
					textArrangement.navigationalPropertiesForDescription
				);

				if (mData[navigationEntitySet] === null || mData[navigationEntitySet] === undefined) {
					mData[navigationEntitySet] = navigationPropertyData[navigationEntitySet];
				}
			}
			if (textArrangement.isNavigationForId) {
				const navigationEntitySet = textArrangement.propertyKeyForId as string;
				const { propertiesWithLabel, navigationPropertyData } = await getNavigationPropertiesWithLabel(
					oAppComponent,
					navigationEntitySet,
					path
				);
				textArrangement.navigationalPropertiesForId = propertiesWithLabel;
				updateNavigationPropertiesWithLabel(navigationProperty, navigationEntitySet, textArrangement.navigationalPropertiesForId);

				if (mData[navigationEntitySet] === null || mData[navigationEntitySet] === undefined) {
					mData[navigationEntitySet] = navigationPropertyData[navigationEntitySet];
				}
			}
		}

		for (const group of parsedManifest.groups) {
			for (const item of group.items) {
				const propertyPath = resolvePropertyPathFromExpression(item.value, mCardManifest);
				if (propertyPath?.includes("/")) {
					const [navigationEntitySet, property] = propertyPath.replace(/[{}]/g, "").split("/");
					const { propertiesWithLabel, navigationPropertyData } = await getNavigationPropertiesWithLabel(
						oAppComponent,
						navigationEntitySet,
						path
					);
					item.navigationalProperties = propertiesWithLabel;
					item.isNavigationEnabled = true;
					item.isEnabled = false;
					item.navigationProperty = property;
					updateNavigationPropertiesWithLabel(navigationProperty, navigationEntitySet, item.navigationalProperties);

					if (mData[navigationEntitySet] === null || mData[navigationEntitySet] === undefined) {
						mData[navigationEntitySet] = navigationPropertyData[navigationEntitySet];
					}
				}
			}
		}
	}

	propertyValueFormatters = _mergePropertyFormatters(propertyValueFormatters, parsedManifest?.formatterConfigurationFromCardManifest);
	addLabelsForProperties(propertiesWithNavigation, data, mData, unitOfMeasures);

	const mainIndicatorOptions = parsedManifest?.mainIndicatorOptions;
	const mainIndicatorCriticalityOptions = mainIndicatorOptions?.criticalityOptions || [];
	const selectedKeyCriticality = mainIndicatorCriticalityOptions.length ? mainIndicatorCriticalityOptions[0].criticality : "";
	const mainIndicatorStatusKey = parsedManifest?.mainIndicatorOptions.mainIndicatorStatusKey || "";
	const trends = parsedManifest?.mainIndicatorOptions.trendOptions;
	const sideIndicators = parsedManifest?.sideIndicatorOptions;

	const mainIndicatorNavigationSelectedKey = parsedManifest?.mainIndicatorOptions.mainIndicatorNavigationSelectedKey || "";
	const navigationValue = parsedManifest?.mainIndicatorOptions.navigationValue || "";
	const selectedNavigationalProperties = [];
	const { propertiesWithLabel, navigationPropertyData } = await getNavigationPropertiesWithLabel(
		oAppComponent,
		mainIndicatorStatusKey,
		path
	);
	const selectedNavigationPropertyHeader = {
		name: mainIndicatorStatusKey,
		value: propertiesWithLabel
	};
	updateNavigationPropertiesWithLabel(navigationProperty, mainIndicatorStatusKey, selectedNavigationPropertyHeader.value);

	if (mainIndicatorStatusKey.length > 0 && (mData[mainIndicatorStatusKey] === null || mData[mainIndicatorStatusKey] === undefined)) {
		mData[mainIndicatorStatusKey] = navigationPropertyData[mainIndicatorStatusKey];
	}

	if (selectedNavigationPropertyHeader.name) {
		selectedNavigationalProperties.push(selectedNavigationPropertyHeader);
	}

	const mainIndicatorNavigationSelectedValue =
		selectedNavigationPropertyHeader.value.find((value) => value.name === mainIndicatorNavigationSelectedKey)?.labelWithValue || "";

	const formatterConfigsWithUnit =
		parsedManifest?.formatterConfigurationFromCardManifest.filter(
			(formatterConfig) => formatterConfig.formatterName === "format.unit"
		) || [];

	const advancedFormattingOptions: AdvancedFormattingOptions = {
		unitOfMeasures:
			formatterConfigsWithUnit.length > 0 ? updateUnitOfMeasures(unitOfMeasures, formatterConfigsWithUnit) : unitOfMeasures,
		textArrangements: parsedManifest?.textArrangementsFromCardManifest || [],
		propertyValueFormatters: propertyValueFormatters,
		sourceCriticalityProperty: [],
		targetFormatterProperty: "",
		sourceUoMProperty: mainIndicatorOptions?.mainIndicatorStatusKey || "",
		selectedKeyCriticality: selectedKeyCriticality,
		textArrangementSourceProperty: mainIndicatorStatusKey,
		isPropertyFormattingEnabled: !!(mainIndicatorStatusKey && mainIndicatorNavigationSelectedKey === "")
	};
	const mainIndicatorStatusUnit =
		(mainIndicatorStatusKey && propertiesWithNavigation.find((property) => property.name === mainIndicatorStatusKey)?.labelWithValue) ||
		"";
	const dialogModelData: CardGeneratorDialog = {
		title: `${entitySet}`,
		configuration: {
			title: parsedManifest?.title || cardTitle,
			subtitle: parsedManifest?.subtitle || cardSubtitle,
			headerUOM: parsedManifest?.headerUOM || "",
			mainIndicatorOptions: {
				criticality: mainIndicatorCriticalityOptions
			},
			advancedFormattingOptions: advancedFormattingOptions,
			trendOptions: trends as TrendOptions,
			indicatorsValue: sideIndicators,
			selectedTrendOptions: trends ? [trends] : [],
			selectedIndicatorOptions: sideIndicators ? [sideIndicators] : [],
			selectedNavigationPropertyHeader,
			selectedContentNavigation: [],
			selectedHeaderNavigation: [],
			navigationProperty,
			mainIndicatorNavigationSelectedValue,
			mainIndicatorStatusKey,
			navigationValue,
			mainIndicatorNavigationSelectedKey,
			mainIndicatorStatusUnit,
			selectedNavigationalProperties,
			entitySet: entitySet,
			oDataV4: bODataV4,
			serviceUrl: serviceUrl,
			properties: properties,
			propertiesWithNavigation: propertiesWithNavigation,
			groups: parsedManifest?.groups || [
				{
					title: oResourceBundle?.getText("GENERATOR_DEFAULT_GROUP_NAME", [1]),
					items: [
						{
							label: "",
							value: "",
							isEnabled: false,
							name: "",
							navigationProperty: "",
							isNavigationEnabled: false
						}
					]
				}
			],
			$data: mData,
			targetUnit: UnitCollection,
			deviationUnit: UnitCollection,
			errorControls: [],
			actions: await getCardActionInfo(oAppComponent, mData, oAppComponent.getModel("i18n") as ResourceModel, mCardManifest),
			groupLimitReached: false,
			keyParameters: await getKeyParameters(oAppComponent),
			appIntent: `${semanticObject}-${action}`
		}
	};

	const dialogModel = new JSONModel(dialogModelData);
	return dialogModel;
};

export function addLabelsForProperties(
	properties: PropertyInfoMap,
	data: Record<string, unknown>,
	mData: {
		[key: string]: PropertyValue;
	},
	unitOfMeasures: Array<object>
) {
	properties.forEach((property) => {
		if (property.name && data[property.name] !== undefined && data[property.name] !== null) {
			const value = formatPropertyDropdownValues(property, data[property.name] as string);
			property.value = data[property.name] as string;
			property.labelWithValue = value;
			const propertyExists = unitOfMeasures.find((uomProperty) => uomProperty.name === property.name);

			if (property.UOM && property.name && !propertyExists) {
				unitOfMeasures.push({
					propertyKeyForDescription: property.UOM,
					name: property.name,
					propertyKeyForId: property.name,
					value: property.UOM
				});
			}
			mData[property.name] = data[property.name] as string;
		} else {
			property.labelWithValue = property.category ? `${property.label}` : `${property.label} (<empty>)`;
		}
	});
}

function updateNavigationPropertiesWithLabel(
	navigationProperties: NavigationParameter[],
	navigationEntityName: string,
	propertiesWithLabel: Property[]
) {
	const navigationProperty = navigationProperties.find((property) => property.name === navigationEntityName);
	if (!navigationProperty) {
		return;
	}

	navigationProperty.properties = [...propertiesWithLabel];
}
