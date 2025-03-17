/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */

import { Value } from "sap/ui/core/theming/Parameters";
import { ISection } from "./AppsInterface";

export interface IColor {
	key: string;
	value: Value;
	assigned: boolean;
}
export interface ISpace {
	id: string;
	label?: string;
	BGColor?: IColor;
	applyColorToAllPages?: boolean;
	children: IPage[];
	isSpacePersonalization?: boolean;
	icon?: string;
	persistedApplyColorToAllPages?: boolean;
	type?: string;
	isSpaceIconPersonalization?: boolean;
}

export interface IPage {
	id?: string;
	label?: string;
	title?: string;
	icon?: string;
	oldIcon?: string;
	isIconLoaded?: boolean;
	pageId?: string;
	spaceId?: string;
	spaceTitle?: string;
	url?: string;
	selected?: boolean;
	BGColor?: IColor | string;
	sections?: ISection[];
	getProperty?: (sProperty: string) => string;
	personalizationState?: boolean;
	isPagePersonalization?: boolean;
	iconPersonalizationState?: boolean;
	isPageIconPersonalization?: boolean;
	type?: string;
	oldColor?: IColor | string;
}
