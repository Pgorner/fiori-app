/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import ODataMetaModel from "sap/ui/model/odata/v4/ODataMetaModel";
import type ODataModel from "sap/ui/model/odata/v4/ODataModel";
import type { RequestQueryComplexProperties, RequestQueryNavigationProperties, RequestQueryParameters } from "../../helpers/Batch";
import { EntityType, NavigationParameter, NavigationParameters } from "../../helpers/CardGeneratorModel";
import { PropertyInfo } from "../ODataTypes";
import { checkForDateType } from "../v2/MetadataAnalyzer";

const Annotations = {
	label: "@com.sap.vocabularies.Common.v1.Label",
	isPotentiallySensitive: "@com.sap.vocabularies.PersonalData.v1.IsPotentiallySensitive",
	isoCurrency: "@Org.OData.Measures.V1.ISOCurrency",
	unit: "@Org.OData.Measures.V1.Unit"
};

export function getNavigationPropertyInfoFromEntity(model: ODataModel, entitySetName: string): NavigationParameter[] {
	const metaModel: ODataMetaModel = model.getMetaModel();
	const entitySet = metaModel.getObject("/" + entitySetName);
	const entityTypeName = entitySet.$Type;
	const entityType = metaModel.getObject("/" + entityTypeName);
	const navigationalData: NavigationParameters = { parameters: [] };
	Object.keys(entityType)
		.filter((property) => {
			const propertyDef = entityType[property];
			return typeof propertyDef === "object" && propertyDef.$kind === "NavigationProperty" && !propertyDef.$isCollection;
		})
		.forEach((navigationProp) => {
			const navigationBinding = entitySet.$NavigationPropertyBinding;
			if (navigationBinding && navigationProp in navigationBinding) {
				const navEntitySetName = navigationBinding[navigationProp];
				if (navEntitySetName !== entitySetName) {
					const navEntitySet = metaModel.getObject("/" + navEntitySetName);
					const navEntityTypeName = navEntitySet?.$Type;
					const navEntityType = metaModel.getObject("/" + navEntityTypeName);
					const data = createNavigationObject(navEntityType, navEntityTypeName, metaModel);
					const navigationVal: NavigationParameter = {
						name: navigationProp,
						properties: data
					};
					navigationalData.parameters.push(navigationVal);
				}
			}
		});

	return navigationalData.parameters;
}

function createNavigationObject(entityType: EntityType, entityTypeName: string, metaModel: ODataMetaModel): PropertyInfo[] {
	return Object.keys(entityType)
		.filter((property) => {
			const propertyDef = entityType[property];
			const annotations = metaModel.getObject(`/${entityTypeName}/${property}@`);
			return (
				property !== "SAP__Messages" &&
				typeof propertyDef === "object" &&
				(propertyDef.$kind === "Property" || propertyDef.$kind === "NavigationProperty") &&
				!annotations?.[Annotations.isPotentiallySensitive]
			);
		})
		.map((property) => {
			const propertyDef = entityType[property];
			const annotations = metaModel.getObject(`/${entityTypeName}/${property}@`);
			return {
				label: annotations?.[Annotations.label] || property,
				type: propertyDef.$Type,
				name: property
			};
		});
}

export function getPropertyInfoFromEntity(
	oModel: ODataModel,
	sEntitySet: string,
	withNavigation = false,
	resourceModel?: ResourceBundle
): PropertyInfo[] {
	const oMetaModel = oModel.getMetaModel();
	const oEntitySet = oMetaModel.getObject("/" + sEntitySet);
	const sEntityType = oEntitySet.$Type;
	const oEntityType = oMetaModel.getObject("/" + sEntityType);
	const metaModelPropertiesAsObject = getMetaModelObjectForEntitySet(oMetaModel, sEntitySet);
	let info: PropertyInfo[] = [];

	const properties = metaModelPropertiesAsObject.properties.map((propertyDef) => {
		const propertyCategory = resourceModel?.getText("CRITICALITY_CONTROL_SELECT_PROP");
		const annotations = oMetaModel.getObject(`/${sEntityType}/${propertyDef.name}@`);
		const isDate = checkForDateType(propertyDef);
		const ISOCurrency = annotations?.[Annotations.isoCurrency];
		const unitOfMeasure = annotations?.[Annotations.unit];
		let UOM = "";

		if (ISOCurrency) {
			UOM = ISOCurrency?.$Path || ISOCurrency;
		} else if (unitOfMeasure) {
			UOM = unitOfMeasure?.$Path || unitOfMeasure;
		}

		return {
			label: annotations?.[Annotations.label] || propertyDef.name,
			type: propertyDef.$Type,
			name: propertyDef.name,
			...(withNavigation && { category: propertyCategory }),
			kind: propertyDef.$kind,
			UOM,
			isDate
		};
	});

	if (withNavigation) {
		const navigationProperties = metaModelPropertiesAsObject.navigationProperties.map((navigationProperty) => {
			const propertyDef = oEntityType[navigationProperty.name];
			const propertyCategory = resourceModel?.getText("GENERATOR_CARD_SELECT_NAV_PROP");
			return {
				label: navigationProperty.name,
				type: propertyDef.$Type,
				name: navigationProperty.name,
				category: propertyCategory,
				kind: propertyDef.$kind,
				UOM: "",
				isDate: false
			};
		});
		info = info.concat(navigationProperties);
	}
	return info.concat(properties);
}

export function getLabelForEntitySet(oModel: ODataModel, sEntitySet: string) {
	const oMetaModel = oModel.getMetaModel();
	const entitySet = oMetaModel.getObject("/" + sEntitySet);
	const sEntityType = entitySet.$Type;
	const annotations = oMetaModel.getObject("/" + sEntityType + "@");
	return annotations[Annotations.label] || sEntitySet;
}

export function getPropertyReferenceKey(oAppModel: ODataModel, entitySetName: string) {
	const entityContainer = oAppModel.getMetaModel().getObject("/");
	const entitySet = entityContainer[entitySetName];
	const entitySetType = entitySet?.$Type;
	const propertyRefKey = oAppModel.getMetaModel().getObject("/" + entitySetType)?.$Key;
	const properties = getPropertyInfoFromEntity(oAppModel, entitySetName, false);
	return properties.filter((property) => propertyRefKey.includes(property.name));
}

function getPropertiesFromEntityType(metaModel: ODataMetaModel, entityType: EntityType, entityTypeName: string): PropertyInfo[] {
	const properties: PropertyInfo[] = [];

	Object.keys(entityType).forEach((property) => {
		const propertyDef = entityType[property];
		const isPotentiallySensitive = metaModel.getObject(`/${entityTypeName}/${property}@`)?.[Annotations.isPotentiallySensitive];
		if (
			property !== "SAP__Messages" &&
			typeof propertyDef === "object" &&
			propertyDef.$kind === "Property" &&
			!isPotentiallySensitive
		) {
			properties.push({
				...propertyDef,
				...{ name: property }
			});
		}
	});

	return properties;
}

export function getMetaModelObjectForEntitySet(metaModel: ODataMetaModel, entitySetName: string): RequestQueryParameters {
	const entitySet = metaModel.getObject(`/${entitySetName}`);
	const entityTypeName = entitySet.$Type;
	const entityType = metaModel.getObject(`/${entityTypeName}`);
	const properties = getPropertiesFromEntityType(metaModel, entityType, entityTypeName);

	const navigationPropertyNames = Object.keys(entityType).filter((property) => {
		const propertyDef = entityType[property];
		return typeof propertyDef === "object" && propertyDef.$kind === "NavigationProperty" && !propertyDef.$isCollection;
	});

	const navigationProperties: RequestQueryNavigationProperties[] = [];
	navigationPropertyNames.forEach((propertyName) => {
		const navigationEntitySet = metaModel.getObject(`/${entitySetName}/${propertyName}`);
		const navigationEntityTypeName = navigationEntitySet.$Type;
		const entityType = metaModel.getObject(`/${entitySetName}/${navigationEntityTypeName}`);
		const properties = getPropertiesFromEntityType(metaModel, entityType, navigationEntityTypeName);
		navigationProperties.push({
			name: propertyName,
			properties: properties
		});
	});

	const complexProperties: RequestQueryComplexProperties[] = [];
	const complexPropertyNames = Object.keys(entityType).filter((property) => {
		const propertyDef = entityType[property];
		return typeof propertyDef === "object" && propertyDef.$kind === "Property" && !propertyDef.$Type?.startsWith("Edm.");
	});

	complexPropertyNames.forEach((propertyName) => {
		const property = metaModel.getObject(`/${entitySetName}/${propertyName}`);
		const complexPropertyType = property.$Type;
		const complexType = metaModel.getObject(`/${entitySetName}/${complexPropertyType}`);
		const properties = getPropertiesFromEntityType(metaModel, complexType, complexPropertyType);
		complexProperties.push({
			name: propertyName,
			properties: properties
		});
	});

	return {
		properties,
		navigationProperties,
		complexProperties
	};
}
