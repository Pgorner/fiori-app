/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */

import { TerminologyConfiguration } from "sap/base/i18n/ResourceBundle";
import JSONModel from "sap/ui/model/json/JSONModel";
import { IEntitySet } from "../utils/AppManager";

export interface ICardHelper {
	getServiceAsync: () => Promise<ICardHelperInstance>;
}

export interface ICardHelperInstance {
	_getUserVisibleCardModel: () => Promise<JSONModel>;
	_getUserAllCardModel: () => Promise<JSONModel>;
	handleDndCardsRanking: (iDragItemIndex: number, iDropItemIndex: number, aCards: ICard[]) => ICard[];
	_updateMultipleCards: (aCards: ICard[], sRequestMethod: string) => Promise<void>;
	_createCards: (aManifests: ICardManifest[]) => Promise<void>;
	getParentAppDetails: (oCard: ICard) => Promise<ICardParentAppDetails>;
	processSemanticDate: (oParameter: object, oIntegrationCardManifest: object) => unknown;
}

export interface ICardParentAppDetails {
	semanticObject: string;
	action: string;
	semanticURL: string;
	title: string;
}

export interface ICard {
	id?: string;
	descriptorContent: ICardManifest;
	visibility?: boolean;
	rank?: string;
}

export interface ICardAction {
	type?: string;
	parameters: ICardActionParameters | string;
}

export interface ICardActionParameters {
	ibnTarget?: {
		semanticObject: string;
		action: string;
	};
	ibnParams?: Record<string, unknown>;
}

export interface IsapCard {
	type: string;
	header: {
		title?: string;
		actions?: ICardAction[];
	};
	content: {
		item: {
			title: string;
			description: string;
			attributes: Array<{
				value: string;
				visible: string;
			}>;
			actions: ICardAction[];
		};
		data: {
			request: {
				url: string;
			};
		};
		row?: {
			actions: ICardAction[];
		};
		actions: ICardAction[];
	};
	rec?: boolean;
	configuration?: {
		parameters?: {
			_semanticDateRangeSetting: {
				value: string;
			};
			_relevantODataFilters: {
				value: unknown[];
			};
			_relevantODataParameters: {
				value: unknown[];
			};
		};
	};
}

export interface IsapApp {
	id: string;
	title: string;
	subTitle: string;
	type: string;
	dataSources: {
		[key: string]: {
			settings: {
				annotations: Array<string>;
				odataVersion: string;
			};
			uri: string;
		};
	};
	i18n: {
		bundleUrl: string;
		terminologies?: Record<string, TerminologyConfiguration>;
	};
}

export interface ICardManifest {
	"sap.card": IsapCard;
	"sap.app"?: IsapApp;
	"sap.insights"?: {
		parentAppId: string;
		cardType: string;
		versions: Record<string, string>;
		visible: boolean;
	};
	"sap.ui.generic.app"?: {
		pages: Array<{
			entitySet: IEntitySet | string;
		}>;
	};
	cacheType: string;
}

export interface InsightsCacheData {
	getInstance: () => {
		clearCache: (id: string) => void;
	};
}
