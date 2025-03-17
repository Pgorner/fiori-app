import type { EntitySet, Singleton } from "@sap-ux/vocabularies-types";
import { isEntitySet } from "sap/fe/core/helpers/TypeGuards";

export type RestrictionsOnProperties = {
	nonSortableProperties: string[];
	nonFilterableProperties: string[];
};

type currentEntitySet = EntitySet | Singleton | undefined;

/**
 * Gets NonFilterableProperties on FilterRestrictions of the main entity.
 * @param entitySet Entity set to be analyzed
 * @returns Array containing the property names of all non-filterable properties
 */
export const getNonFilterablePropertiesRestrictions = function (entitySet: EntitySet): string[] {
	let nonFilterableProperties = [];
	if (entitySet.annotations.Capabilities?.FilterRestrictions?.Filterable === false) {
		// add all properties of the entity to the nonFilterableProperties
		nonFilterableProperties.push(...entitySet.entityType.entityProperties.map((property) => property.name));
	} else {
		nonFilterableProperties =
			entitySet.annotations.Capabilities?.FilterRestrictions?.NonFilterableProperties?.map((property) => property.value) || [];
	}

	// Check for every navigationRestriction if it has FilterRestrictions
	entitySet.annotations.Capabilities?.NavigationRestrictions?.RestrictedProperties?.forEach((navigationRestriction) => {
		// leave the property path unchanged (it is relative to the annotation target!)
		const nonFilterableNavigationProperties = navigationRestriction?.FilterRestrictions?.NonFilterableProperties?.map(
			(property) => property.value
		);
		if (nonFilterableNavigationProperties) {
			nonFilterableProperties.push(...nonFilterableNavigationProperties);
		}
	});
	return nonFilterableProperties;
};

/**
 * Reads all SortRestrictions of the main entity and the (first level) navigation restrictions.
 * This does not work for more than one level of navigation.
 * @param entitySet Entity set to be analyzed
 * @returns Array containing the property names of all non-sortable properties
 */
export const getNonSortablePropertiesRestrictions = function (entitySet: EntitySet): string[] {
	let nonSortableProperties = [];
	// Check annotations for main entity
	if (entitySet.annotations.Capabilities?.SortRestrictions?.Sortable === false) {
		// add all properties of the entity to the nonSortableProperties
		nonSortableProperties.push(...entitySet.entityType.entityProperties.map((property) => property.name));
	} else {
		nonSortableProperties =
			entitySet.annotations.Capabilities?.SortRestrictions?.NonSortableProperties?.map((property) => property.value) || [];
	}
	// Check for every navigationRestriction if it has sortRestrictions
	entitySet.annotations.Capabilities?.NavigationRestrictions?.RestrictedProperties?.forEach((navigationRestriction) => {
		if (navigationRestriction?.SortRestrictions?.Sortable === false) {
			// find correct navigation property
			const navigationProperty = entitySet.entityType.navigationProperties.by_name(navigationRestriction?.NavigationProperty?.value);
			if (navigationProperty) {
				// add all properties of the navigation property to the nonSortableProperties
				nonSortableProperties.push(
					...navigationProperty.targetType.entityProperties.map((property) => `${navigationProperty.name}/${property.name}`)
				);
			}
		} else {
			// leave the property path unchanged (it is relative to the annotation target!)
			const nonSortableNavigationProperties = navigationRestriction?.SortRestrictions?.NonSortableProperties?.map(
				(property) => property.value
			);
			if (nonSortableNavigationProperties) {
				nonSortableProperties.push(...nonSortableNavigationProperties);
			}
		}
	});
	return nonSortableProperties;
};

/**
 * Gets all SortRestrictions and FilterRestriction of the main entity and the (first level) navigation restrictions.
 * This does not work for more than one level of navigation.
 * @param entitySet Entity set to be analyzed
 * @returns Object containing all property names with restrictions separated by sortable and filterable capabilities
 */

export const getRestrictionsOnProperties = function (entitySet: currentEntitySet): RestrictionsOnProperties {
	let propertiesRestrictions: RestrictionsOnProperties = { nonSortableProperties: [], nonFilterableProperties: [] };
	// Check annotations for main entity
	if (!isEntitySet(entitySet)) {
		return propertiesRestrictions;
	} else {
		propertiesRestrictions = {
			nonSortableProperties: getNonSortablePropertiesRestrictions(entitySet),
			nonFilterableProperties: getNonFilterablePropertiesRestrictions(entitySet)
		};
		return propertiesRestrictions;
	}
};
