/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import Control from "sap/ui/core/Control";
import { CHANGE_TYPES } from "../flexibility/Layout.flexibility";

export interface IKeyUserChange {
	selectorControl: Control;
	changeSpecificData: IChangeSpecificData;
}

export interface IChangeSpecificData {
	changeType: CHANGE_TYPES;
	content?: object;
}

export interface INewsFeedVisibiliyChange {
	isNewsFeedVisible?: boolean;
}

export interface INewsPersData {
	validUrl?: boolean;
	oldValidUrl?: boolean;
	newsFeedURL?: string;
	oldNewsFeedUrl?: string;
	showCustomNewsFeed?: boolean;
	oldShowCustomNewsFeed?: boolean;
	customNewsFeedKey?: string;
	oldCustomNewsFeedKey?: string;
	customNewsFeedFileName?: string;
}
interface IMovedElement {
	id: string;
	sourceIndex?: number;
	targetIndex?: number;
	element?: unknown;
}

interface ISourceTarget {
	id: string;
	parent: IParent;
	publicAggregation: unknown;
	aggregation: unknown;
}

export interface ISpecificChangeInfo {
	content: {
		movedElements: Array<IMovedElement>;
		source: ISourceTarget;
		target: ISourceTarget;
	};
	movedElements: Array<IMovedElement>;
	source: ISourceTarget;
	target: ISourceTarget;
}

export interface IModifier {
	bySelector: (id: string, oAppComponent: unknown) => unknown;
	getControlType: (oParent: IParent) => string;
	getSelector: (id: unknown, oAppComponent: unknown, mAdditionalInfo?: unknown) => unknown;
}

export interface IParent {
	getId: () => string;
}

export interface IChange {
	addDependentControl: (id: string | string[], alias: string, mPropertyBag: unknown) => void;
	setContent: (content: unknown) => void;
}

export interface IpropertyBag {
	modifier: IModifier;
	appComponent: unknown;
}

export interface IContent {
	movedElements: Array<unknown>;
	source: {
		selector: unknown;
	};
	target: {
		selector: unknown;
	};
}

export interface ISpacePagePersonalization {
	spaceId?: string;
	BGColor?: string;
	oldColor?: string;
	applyColorToAllPages?: boolean;
	oldApplyColorToAllPages?: boolean;
	pageId?: string;
	icon?: string;
	oldIcon?: string;
}

export interface IKeyUserChangeObject {
	getSelector: () => object;
	getContent: () => object;
}
