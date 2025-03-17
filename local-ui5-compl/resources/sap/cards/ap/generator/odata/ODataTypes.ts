/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
export type PropertyInfo = {
	textArrangement?: string;
	label: string;
	type: string;
	name: string;
	UOM?: string;
	isDate?: boolean;
	value?: string;
	labelWithValue?: string;
	properties?: [];
	category?: string;
	kind: string;
};

export enum PropertyInfoType {
	Property = "Property",
	NavigationProperty = "NavigationProperty"
}

export type PropertyInfoMap = Array<PropertyInfo>;
