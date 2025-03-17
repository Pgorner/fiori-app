/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */

import GridContainerItemLayoutData from "sap/f/GridContainerItemLayoutData";
import Control from "sap/ui/core/Control";
import { dnd } from "sap/ui/core/library";
import App from "../App";
import Group from "../Group";
import MenuItem from "../MenuItem";
import { ICardManifest } from "./CardsInterface";

export interface IParseSBParameters {
	tileConfiguration?: object;
	TILE_PROPERTIES?: object;
	semanticObject?: string;
	semanticAction?: string;
	evaluationId?: string;
}

export interface ICustomVisualization {
	appId?: string;
	oldAppId?: string;
	url?: string;
	leanURL?: string;
	title?: string;
	subtitle?: string;
	BGColor?: string;
	isFav?: boolean;
	isSection?: boolean;
	icon?: string;
	indicatorDataSource?: string;
	isCount?: boolean;
	contentProviderId?: string;
	isSmartBusinessTile?: boolean;
	visualization?: IVisualization;
	persConfig?: IPersConfig;
	setActive?: (val: boolean) => void;
	vizId?: string;
	status?: string;
	menuItems?: MenuItem[];
	addedInFavorites?: boolean;
	pageId?: string;
	refresh?: () => void;
	getDisplayFormat?: () => string;
	setLayoutData?: (data: GridContainerItemLayoutData) => void;
	bindProperty?: (propertyName: string, path: string) => void;
	fioriId?: string;
}

export interface IPersConfig {
	pageId?: string;
	sectionIndex?: number;
	isDefaultSection?: boolean;
	visualizationIndex?: number;
	sectionId?: string;
	sectionTitle?: string;
	isPresetSection?: boolean;
	duplicateApps?: ICustomVisualization[];
}

export interface IAppInbounds {
	semanticObject: string;
	action: string;
	signature?: {
		parameters?: {
			"sap-fiori-id"?: {
				defaultValue: {
					value?: string;
				};
			};
		};
	};
	resolutionResult?: {
		applicationDependencies?: {
			name?: string;
			manifest?: ICardManifest;
		};
		ui5ComponentName?: string;
	};
}

export interface IVisualization {
	id?: string;
	icon?: string;
	info?: string;
	numberUnit?: string;
	vizConfig?: IVisualizationConfig;
	targetURL: string;
	title?: string;
	subtitle?: string;
	contentProviderId?: string;
	vizId: string;
	vizType: string;
	sectionId?: string;
	appIds?: string[];
	ignoreDuplicateApps?: boolean;
	_instantiationData?: {
		chip?: {
			configuration?: object;
			bags?: {
				sb_tileProperties?: {
					texts?: {
						title?: string;
						description?: string;
					};
				};
			};
		};
	};
	target?: {
		semanticObject?: string;
		action?: string;
	};
	indicatorDataSource?: {
		path: string;
	};
	isBookmark?: boolean;
	orgAppId?: string;
	displayFormatHint?: string;
	supportedDisplayFormats?: string;
	dataSource?: object;
}

export interface ISection {
	id?: string;
	index?: number;
	title?: string;
	isSection?: boolean;
	badge?: string;
	BGColor?: string;
	icon?: string;
	isPresetSection?: boolean;
	apps?: ICustomVisualization[];
	default?: boolean;
	preset?: boolean;
	visualizations?: IVisualization[];
	sectionIndex?: number;
	sectionProperties?: object;
}

export interface IVisualizationConfig {
	"sap.app": IVisualization;
	"sap.flp": IVisualization;
	"sap.ui": {
		icons: {
			icon: string;
		};
	};
}

export interface ISectionAndVisualization extends ISection, ICustomVisualization {}

export interface IAppPersonalization {
	BGColor: string;
	isSection: boolean;
	sectionId?: string;
	isRecentlyAddedApp: boolean;
	appId?: string;
}

export interface IItemPersonalization {
	color?: string;
	icon?: string;
}

export interface IUpdatePersonalizationConfig {
	visualization: ICustomVisualization;
	color?: string;
	isTargetGroupDefault?: boolean;
	targetGroupId?: string;
}

export interface IActivity {
	title: string;
	url: string;
	appId: string;
	icon: string;
	appType: string;
	timestamp: number;
	orgAppId: string;
	targetURL?: string;
	vizId: string;
	addedInFavorites: boolean;
	dateStamp?: number;
	usageArray?: number[];
}

export interface IAppPersonalizationConfig {
	appId?: string;
	oldAppId?: string;
	sectionId?: string;
	isSection?: boolean;
	isRecentlyAddedApp?: boolean;
}

export interface IDragDropInfo {
	dragItem: App | Group;
	dropItem: App | Group;
	dropPosition: dnd.RelativeDropPosition;
	dropControl: Control;
	dragItemIndex: number;
	dropItemIndex: number;
}
