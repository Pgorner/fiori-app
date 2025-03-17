/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */

import Log from "sap/base/Log";
import Formatting from "sap/base/i18n/Formatting";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import VersionInfo from "sap/ui/VersionInfo";
import BaseObject from "sap/ui/base/Object";
import Model from "sap/ui/model/Model";
import ODataMetaModel, { EntitySet, EntityType, Property } from "sap/ui/model/odata/ODataMetaModel";
import ODataModelV2 from "sap/ui/model/odata/v2/ODataModel";
import Config from "sap/ushell/Config";
import Container from "sap/ushell/Container";
import Bookmark from "sap/ushell/services/BookmarkV2";
import ClientSideTargetResolution from "sap/ushell/services/ClientSideTargetResolution";
import SearchableContent, { AppData } from "sap/ushell/services/SearchableContent";
import SpaceContent from "sap/ushell/services/SpaceContent";
import { ICustomVisualization, IParseSBParameters, ISection, ISectionAndVisualization, IVisualization } from "../interface/AppsInterface";
import { ICard, ICardManifest } from "../interface/CardsInterface";
import { IPage } from "../interface/PageSpaceInterface";
import { CardSkeleton } from "./CardSkeleton";
import {
	DEFAULT_BG_COLOR,
	FALLBACK_ICON,
	FEATURE_TOGGLES,
	FEATURE_TOGGLE_SRVC_URL,
	MYHOME_PAGE_ID,
	MYHOME_SPACE_ID,
	MYINSIGHT_SECTION_ID,
	RECOMMENDATION_SRVC_URL,
	RECOMMENDED_CARD_LIMIT
} from "./Constants";
import DataFormatUtils from "./DataFormatUtils";
import HttpHelper from "./HttpHelper";

const CONSTANTS = {
	MUST_INCLUDE_RECOMMEDED_APPS: ["F0862", "F1823"] //My Inbox and Manage Timesheet apps
};

interface IFeatureToggles {
	RECOMMENDATION: string;
	TASK_ACTIONS: string;
}

interface IGenericApp {
	component?: {
		name?: string;
		settings?: {
			tableSettings?: {
				addCardtoInsightsHidden?: boolean;
			};
		};
	};
	entitySet?: IEntitySet;
}

export interface IEntitySet extends EntitySet {
	"Org.OData.Capabilities.V1.FilterRestrictions"?: {
		RequiredProperties?: Array<unknown>;
	};
}

interface IEntityType extends EntityType {
	"com.sap.vocabularies.UI.v1.LineItem": Array<ILineItemContext>;
	"sap:semantics": string;
	"com.sap.vocabularies.Common.v1.SemanticKey": Array<{
		PropertyPath: string;
	}>;
	"com.sap.vocabularies.UI.v1.TextArrangement": {
		EnumMember: string;
	};
	"com.sap.vocabularies.Common.v1.Label": {
		String: string;
	};
	property: Property[];
}

interface ILineItemContext {
	Value: {
		Path: string;
	};
	"com.sap.vocabularies.UI.v1.Importance": string;
	"com.sap.vocabularies.UI.v1.Hidden": {
		Bool: boolean;
	};
}

interface IManifestCardData {
	cardTitle?: string;
	subTitle: string;
	url: string;
	semanticObject: string;
	action: string;
	id?: string;
	columns: Array<unknown>;
}

const _parseSBParameters = (oParam: object | string | undefined): IParseSBParameters | undefined => {
	let oParsedParams: IParseSBParameters | undefined = {};
	if (oParam) {
		if (typeof oParam === "object") {
			oParsedParams = oParam;
		} else {
			try {
				oParsedParams = JSON.parse(oParam) as object;
			} catch (oError) {
				Log.error(oError instanceof Error ? oError.message : String(oError));
				oParsedParams = undefined;
			}
		}
	}
	return oParsedParams;
};

const _getTileProperties = (vizConfigFLP?: IVisualization): IParseSBParameters | undefined => {
	let oTileProperties: IParseSBParameters | undefined = {};
	if (vizConfigFLP?._instantiationData?.chip?.configuration) {
		const oConfig: IParseSBParameters | undefined = _parseSBParameters(vizConfigFLP._instantiationData.chip.configuration);
		if (oConfig?.tileConfiguration) {
			const oTileConfig: IParseSBParameters | undefined = _parseSBParameters(oConfig.tileConfiguration);
			if (oTileConfig) {
				oTileProperties = _parseSBParameters(oTileConfig.TILE_PROPERTIES);
			}
		}
	}
	return oTileProperties;
};

const _getAppId = (vizConfigFLP: IVisualization | undefined): string => {
	let sAppId = "";
	let oTileProperties: IParseSBParameters | undefined = {};
	if (vizConfigFLP?.target?.semanticObject && vizConfigFLP?.target?.action) {
		sAppId = `#${vizConfigFLP.target.semanticObject}-${vizConfigFLP.target.action}`;
	} else if (vizConfigFLP?._instantiationData?.chip?.configuration) {
		oTileProperties = _getTileProperties(vizConfigFLP);
		if (oTileProperties?.semanticObject && oTileProperties?.semanticAction) {
			sAppId = `#${oTileProperties?.semanticObject}-${oTileProperties?.semanticAction}`;
		}
	}
	return sAppId;
};

const _getTargetUrl = (vizConfigFLP: IVisualization | undefined) => {
	let sTargetURL = _getAppId(vizConfigFLP) || "";
	const oTileProperties = _getTileProperties(vizConfigFLP);
	if (oTileProperties?.evaluationId) {
		sTargetURL += "?EvaluationId=" + oTileProperties.evaluationId;
	}
	return sTargetURL;
};

const _isSmartBusinessTile = (oVisualization: IVisualization): boolean => {
	return oVisualization.vizType?.startsWith("X-SAP-UI2-CHIP:SSB");
};

// get App Title in case of value not present at root level
const _getAppTitleSubTitle = (oApp: IVisualization, vizConfigFLP: IVisualization): { title: string; subtitle: string } => {
	const oAppTileInfo = vizConfigFLP?._instantiationData?.chip?.bags?.sb_tileProperties?.texts;
	return {
		title: oApp.title ? oApp.title : oAppTileInfo?.title || "",
		subtitle: oApp.subtitle ? oApp.subtitle : oAppTileInfo?.description || ""
	};
};

/**
 * Link Duplicate Visualizations to a single visualization
 *
 * @param {object[]} aVizs - array of visualizations
 * @returns {object[]} arry of visualizations after linking duplicate visualizations
 * @private
 */
const _linkDuplicateVizs = (aVizs: ICustomVisualization[]) => {
	aVizs.forEach((oDuplicateViz) => {
		aVizs
			.filter(
				(oViz) =>
					oViz.appId === oDuplicateViz.appId &&
					oViz?.visualization?.id !== oDuplicateViz?.visualization?.id &&
					oViz.persConfig?.sectionIndex === oDuplicateViz.persConfig?.sectionIndex
			)
			.forEach((oViz) => {
				oViz?.persConfig?.duplicateApps?.push(oDuplicateViz);
			});
	});

	return aVizs;
};

const _isGUIVisualization = (visualization: AppData) => {
	return visualization?.target?.parameters?.["sap-ui-tech-hint"]?.value?.value === "GUI";
};

const _isMustIncludeRecommendation = (recViz: ICustomVisualization) => {
	return recViz.fioriId && CONSTANTS.MUST_INCLUDE_RECOMMEDED_APPS.includes(recViz.fioriId);
};

const _isVisualizationAlreadyAdded = (visualization: ICustomVisualization, favoriteVisualizations: ICustomVisualization[]) => {
	return !favoriteVisualizations.some(
		(favViz) =>
			favViz.visualization?.target?.semanticObject === visualization.visualization?.target?.semanticObject &&
			favViz.visualization?.target?.action === visualization.visualization?.target?.action
	);
};

/**
 *
 * @class Provides the AppManager Class used for fetch and process user apps.
 *
 * @extends sap.ui.BaseObject
 *
 * @author SAP SE
 * @version 0.0.1
 * @since 1.121.0
 *
 * @private
 * @experimental Since 1.121
 * @hidden
 *
 * @alias sap.cux.home.util.AppManager
 */
export default class AppManager extends BaseObject {
	private aRequestQueue: { pageId: string; pageLoadPromise: Promise<IPage> }[] = [];
	private _oMoveAppsPromise!: Promise<void>;
	private bInsightsSectionPresent: boolean = false;
	public insightsSectionIndex!: number;
	static Instance: AppManager;
	private recommendedFioriIds!: string[];
	private versionInfo!: {
		version: string;
		buildTimestamp: string;
	};
	private _RBManifestMap!: Record<string, ResourceBundle>;
	private _recommendedVisualizations!: ICustomVisualization[];
	private vizDataModified: boolean = false;

	private constructor() {
		super();
	}

	static getInstance() {
		if (!AppManager.Instance) {
			AppManager.Instance = new AppManager();
		}
		return AppManager.Instance;
	}
	/**
	 * Returns page load promise from the request queue if it exists, adds it to the queue if it doesn't
	 *
	 * @param {string} sPageId - page id
	 * @param {boolean} bForceRefresh - force reload of data if true
	 * @returns {Promise} - returns a promise which resolves with the requested page data
	 * @private
	 */
	private async _fetchRequestFromQueue(bForceRefresh: boolean): Promise<IPage> {
		const oSpaceContentService = await Container.getServiceAsync<SpaceContent>("SpaceContent");
		let oPageLoadPromise: Promise<IPage>;
		this.aRequestQueue = this.aRequestQueue || [];

		//Check if request already exists in the queue, if not add it
		const oRequestedPage = this.aRequestQueue.find((oRequest) => oRequest.pageId === MYHOME_PAGE_ID);
		if (!oRequestedPage || bForceRefresh === true || this.vizDataModified === true) {
			this.vizDataModified = false;
			oPageLoadPromise = oSpaceContentService.getPage(MYHOME_PAGE_ID);
			if (oRequestedPage) {
				oRequestedPage.pageLoadPromise = oPageLoadPromise;
			} else {
				this.aRequestQueue.push({
					pageId: MYHOME_PAGE_ID,
					pageLoadPromise: oPageLoadPromise
				});
			}
		} else {
			oPageLoadPromise = oRequestedPage.pageLoadPromise;
		}

		return oPageLoadPromise;
	}
	/**
	 * Returns all dynamic visualizations present in MyHome page
	 *
	 * @param {boolean} bForceRefresh - force reload of visualizations data
	 * @returns {Promise} - resolves to array of all dynamic visualizations in MyHome page
	 * @private
	 */
	private _fetchDynamicVizs(bForceRefresh: boolean) {
		return this.fetchFavVizs(bForceRefresh, true).then((aFavApps: ICustomVisualization[]) =>
			aFavApps.filter((oDynApp) => oDynApp.isCount || oDynApp.isSmartBusinessTile)
		);
	}
	/**
	 * Returns all the sections that are available in the MyHome page
	 *
	 * @param {boolean} bForceRefresh - force reload of visualizations data
	 * @returns {Promise} - resolves to array of all sections available in MyHome page
	 * @private
	 */
	public async _getSections(bForceRefresh: boolean = false): Promise<ISection[]> {
		const oPage: IPage = await this._fetchRequestFromQueue(bForceRefresh);
		const aSections = (oPage && oPage.sections) || [],
			iRecentAppSectionIndex: number = aSections.findIndex((oSection) => oSection.default);
		if (iRecentAppSectionIndex > 0) {
			if (this._oMoveAppsPromise !== undefined) {
				this._oMoveAppsPromise = this.moveSection(iRecentAppSectionIndex, 0);
				await this._oMoveAppsPromise;
			}
			return this._getSections(true);
		} else {
			return aSections;
		}
	}
	/**
	 * Models and returns all visualizations available in MyHome page
	 *
	 * @param {bool} bForceRefresh - force reload of visualizations data
	 * @returns {Promise} - resolves to array of all apps available in MyHome page
	 * @private
	 */
	private async _fetchMyHomeVizs(bForceRefresh: boolean): Promise<ICustomVisualization[]> {
		const aVizs: ICustomVisualization[] = [];
		const aSections = await this._getSections(bForceRefresh);
		aSections.forEach((oSection: ISection, iSectionIndex: number) => {
			oSection?.visualizations?.forEach((oVisualization: IVisualization, iVisualizationIndex: number) => {
				const vizConfig = oVisualization.vizConfig,
					oVizInfo = vizConfig?.["sap.app"] || ({ title: "?" } as IVisualization),
					oViz = {} as ICustomVisualization;

				oViz.oldAppId = _getAppId(vizConfig?.["sap.flp"]);
				oViz.appId = oVisualization?.targetURL; // Using targetURL as unique identifier as in certian scenario vizConfig can be empty.
				oViz.url = oVisualization?.targetURL;
				if (!oViz.url && _isSmartBusinessTile(oVisualization)) {
					oViz.url = _getTargetUrl(vizConfig?.["sap.flp"]);
				}
				oViz.leanURL = DataFormatUtils.getLeanURL(oViz.url);
				oViz.title = oVisualization?.title || _getAppTitleSubTitle(oVizInfo, oVisualization)?.title;
				oViz.subtitle = oVisualization.subtitle || _getAppTitleSubTitle(oVizInfo, oVisualization).subtitle;
				oViz.BGColor = DEFAULT_BG_COLOR().key;
				oViz.isFav = true;
				oViz.isSection = false;
				oViz.icon = vizConfig?.["sap.ui"]?.icons?.icon || FALLBACK_ICON;
				if (oVisualization?.indicatorDataSource) {
					oViz.isCount = true;
					oViz.indicatorDataSource = oVisualization.indicatorDataSource.path;
					oViz.contentProviderId = oVisualization.contentProviderId;
				}
				oViz.isSmartBusinessTile = _isSmartBusinessTile(oVisualization);
				// Add FLP Personalization Config
				oViz.persConfig = {
					pageId: MYHOME_PAGE_ID,
					sectionTitle: oSection.title,
					sectionId: oSection.id,
					sectionIndex: iSectionIndex,
					visualizationIndex: iVisualizationIndex,
					isDefaultSection: oSection.default,
					isPresetSection: oSection.preset,
					duplicateApps: []
				};
				oViz.visualization = oVisualization;
				// Title and Subtitle in visualization are required in Insights Dialog.
				oViz.visualization.title = oViz.title;
				oViz.visualization.subtitle = oViz.subtitle;
				aVizs.push(oViz);
			});
		});
		return aVizs;
	}
	/**
	 * Copies all Dynamic visualizations to Insights section
	 *
	 * @returns {Promise} - resolves to void and copy all the visualizations
	 * @private
	 */
	private async _copyDynamicVizs() {
		const aDynamicVizs: ICustomVisualization[] = await this._fetchDynamicVizs(true);
		return Promise.all(
			aDynamicVizs.map((oDynViz: ICustomVisualization) => {
				return this.addVisualization(oDynViz.visualization!.vizId, MYINSIGHT_SECTION_ID);
			})
		);
	}
	/**
	 * Returns a list of all favorite vizualizations in MyHome page
	 *
	 * @param {boolean} bForceRefresh - force reload of vizualizations data
	 * @param {boolean} bPreventGrouping - prevent vizualizations grouping
	 * @returns {Promise} - resolves to array of favourite vizualizations in MyHome page
	 * @private
	 */
	public async fetchFavVizs(bForceRefresh: boolean, bPreventGrouping?: boolean): Promise<ISectionAndVisualization[]> {
		const aMyHomeVizs = await this._fetchMyHomeVizs(bForceRefresh);
		const aVisibleFavVizs = aMyHomeVizs.filter(
			(oViz) => oViz.persConfig && oViz.persConfig.sectionId !== MYINSIGHT_SECTION_ID && oViz.url && oViz.title
		);

		if (bPreventGrouping) {
			return this._filterDuplicateVizs(_linkDuplicateVizs(aVisibleFavVizs), false);
		} else {
			return this._addGroupInformation(aVisibleFavVizs);
		}
	}
	/**
	 * Returns all vizualizations present in the Insights Section
	 *
	 * @param {boolean} bForceRefresh - force reload insights vizualizations data
	 * @param {string} sSectionTitle - optional, title of insights section to be used while creating insights section
	 * @returns {Promise} - resolves to an array with all vizualizations in Insights section
	 */
	public async fetchInsightApps(bForceRefresh: boolean, sSectionTitle: string) {
		const fnFetchInsightsApps = async () => {
			const aVizs = await this._fetchMyHomeVizs(bForceRefresh);
			return aVizs.filter((oViz) => oViz.persConfig?.sectionId === MYINSIGHT_SECTION_ID && oViz.url && oViz.title);
		};

		if (!this.bInsightsSectionPresent) {
			const aSections: ISection[] = await this._getSections(bForceRefresh);
			this.insightsSectionIndex = aSections.findIndex(function (oSection) {
				return oSection.id === MYINSIGHT_SECTION_ID;
			});

			if (
				this.insightsSectionIndex === -1 &&
				(Config.last("/core/shell/enablePersonalization") || Config.last("/core/catalog/enabled")) && 
				this.bInsightsSectionPresent === false
			) {
				this.bInsightsSectionPresent = true;
				await this.addSection({
					sectionIndex: aSections?.length,
					sectionProperties: {
						id: MYINSIGHT_SECTION_ID,
						title: sSectionTitle
					}
				});
				await this._copyDynamicVizs();
			} else {
				this.bInsightsSectionPresent = true;
			}
		}

		return await fnFetchInsightsApps();
	}

	/**
	 * Add visualization to a particular section
	 *
	 * @param {string} visualizationId - The id of the visualization to add.
	 * @param {string} sectionId - The id of the section the visualization should be added to (optional parameter)
	 * @returns {Promise} resolves to void after adding app to a section
	 * @private
	 */
	public async addVisualization(visualizationId: string, sectionId: string | undefined = undefined): Promise<void> {
		const spaceContentService = await Container.getServiceAsync<SpaceContent>("SpaceContent");
		await spaceContentService.addVisualization(MYHOME_PAGE_ID, sectionId, visualizationId);
	}

	/**
	 * @param {object} mProperties - map of properties
	 * @param {string} mProperties.sectionId - section id from which visualizations should be removed
	 * @param {object[]} mProperties.appIds - array of url of visualizations that has to be deleted
	 * @param {boolean} mProperties.ignoreDuplicateApps - if true doesn't remove the duplicate apps, else removes the duplicate apps as well
	 * @private
	 * @returns {Promise} resolves after all visualizations are deleted
	 */
	public async removeVisualizations({ sectionId, vizIds }: { sectionId: string; vizIds: string[] }) {
		const spaceContentService = await Container.getServiceAsync<SpaceContent>("SpaceContent");
		for (const vizId of vizIds) {
			try {
				const sections = await this._getSections(true);
				const sectionIndex = sections.findIndex((oSection) => oSection.id === sectionId);
				const targetSection = sectionIndex > -1 ? sections[sectionIndex] : null;
				const visualizationIndex = targetSection?.visualizations?.findIndex((oVisualization) => oVisualization.id === vizId) ?? -1;
				if (visualizationIndex > -1) {
					await spaceContentService.deleteVisualization(MYHOME_PAGE_ID, sectionIndex, visualizationIndex);
				}
			} catch (error) {
				Log.error(error as string);
			}
		}
	}

	/**
	 * @param {object} mProperties - map of properties
	 * @param {string} mProperties.pageId - page id from which visualizations should be updated
	 * @param {object[]} mProperties.sourceSectionIndex - section index in which visualization that has to be updated
	 * @param {boolean} mProperties.sourceVisualizationIndex - visualization index in the which should be updated
	 * @param {boolean} mProperties.oVisualizationData - visualization data which will be updated for the vizualisation
	 * @private
	 * @returns {Promise} resolves to void
	 */
	public async updateVisualizations({
		pageId,
		sourceSectionIndex,
		sourceVisualizationIndex,
		oVisualizationData
	}: {
		pageId: string;
		sourceSectionIndex: number;
		sourceVisualizationIndex: number;
		oVisualizationData: { displayFormatHint: string };
	}) {
		const spaceContentService = await Container.getServiceAsync<SpaceContent>("SpaceContent");
		return spaceContentService.updateVisualization(pageId, sourceSectionIndex, sourceVisualizationIndex, oVisualizationData);
	}

	/**
	 * Create Insight Section if not already present
	 *
	 * @param {string} sSectionTitle - optional, section title
	 * @returns {Promise} - resolves to insight section created
	 */
	public async createInsightSection(sSectionTitle: string) {
		if (!this.bInsightsSectionPresent) {
			const aSections = await this._getSections();
			const iMyInsightSectionIndex = aSections.findIndex(function (oSection) {
				return oSection.id === MYINSIGHT_SECTION_ID;
			});

			//check if myinsight section exists, if not create one
			if (
				iMyInsightSectionIndex === -1 &&
				(Config.last("/core/shell/enablePersonalization") || Config.last("/core/catalog/enabled"))
			) {
				return this.addSection({
					sectionIndex: aSections.length,
					sectionProperties: {
						id: MYINSIGHT_SECTION_ID,
						title: sSectionTitle,
						visible: true
					}
				});
			}
		}

		return Promise.resolve();
	}

	/**
	 * Adds a section
	 *
	 * @param {object} mProperties - map of properties
	 * @param {string} mProperties.sectionIndex - section index
	 * @param {object} mProperties.sectionProperties - section properties
	 * @returns {Promise} resolves to void and creates the section
	 * @private
	 */
	public async addSection(mProperties: ISection) {
		const { sectionIndex, sectionProperties } = mProperties;
		const oSpaceContentService = await Container.getServiceAsync<SpaceContent>("SpaceContent");
		await oSpaceContentService.addSection(MYHOME_PAGE_ID, sectionIndex, {
			...sectionProperties,
			visible: true
		});
	}

	/**
	 * Returns visualizations for a given section
	 * @param {string} sectionId - section id
	 * @param {boolean} [forceRefresh=false] - force reload of data if true
	 * @returns {Promise} resolves to array of visualizations
	 * @private
	 */
	public async getSectionVisualizations(sectionId?: string, forceRefresh = false): Promise<ICustomVisualization[]> {
		const aApps: ISectionAndVisualization[] = await this.fetchFavVizs(forceRefresh);
		if (sectionId) {
			return aApps.find((oViz) => oViz.isSection && oViz.id === sectionId)?.apps || [];
		} else {
			return aApps.filter((oViz) => !oViz.isSection); //return recently added apps
		}
	}

	/**
	 * Adds a bookmark.
	 * @private
	 * @param {Object} bookmark - The bookmark data object.
	 * @returns {Promise<void>} - A Promise that resolves once the bookmark is added.
	 */
	public async addBookMark(
		bookmark: IVisualization,
		moveConfig?: {
			sourceSectionIndex: number;
			sourceVisualizationIndex: number;
			targetSectionIndex: number;
			targetVisualizationIndex: number;
		}
	) {
		const oBookmarkService: Bookmark = await Container.getServiceAsync("BookmarkV2");
		const aContentNodes = await oBookmarkService.getContentNodes();
		const oMyHomeSpace = aContentNodes.find((contentNode) => contentNode.id === MYHOME_SPACE_ID);
		const contentNode = oMyHomeSpace?.children?.find((contentNode) => contentNode.id === MYHOME_PAGE_ID);
		await oBookmarkService.addBookmark(DataFormatUtils.createBookMarkData(bookmark), contentNode);
		if (moveConfig) {
			return this.moveVisualization(moveConfig);
		}
		return Promise.resolve();
	}

	/**
	 * Retrieves the visualization with the specified appId within the specified section.
	 * @param {string} appId - appId of the visualization for.
	 * @param {string} sectionId - The ID of the section containing the visualization.
	 * @param {boolean} [forceRefresh=false] - Whether to force a refresh of the section's cache.
	 * @returns {Promise<object|null>} A promise that resolves with the visualization object if found, or null if not found.
	 * @private
	 */
	public async getVisualization(appId: string, sectionId?: string, forceRefresh = false) {
		const sectionVisualizations = await this.getSectionVisualizations(sectionId, forceRefresh);
		return sectionVisualizations.find((sectionVisualization) => sectionVisualization.appId === appId);
	}

	/**
	 * Moves a visualization from source section to target section.
	 * @param {object} moveConfig - Configuration object containing details for moving the visualization.
	 * @param {number} moveConfig.sourceSectionIndex - Index of the source section.
	 * @param {number} moveConfig.sourceVisualizationIndex - Index of the visualization within the source section.
	 * @param {number} moveConfig.targetSectionIndex - Index of the target section.
	 * @param {number} moveConfig.targetVisualizationIndex - Index at which the visualization will be placed within the target section.
	 * @returns {Promise<void>} A promise that resolves to void after the move operation.
	 * @private
	 */
	public async moveVisualization(moveConfig: {
		sourceSectionIndex: number;
		sourceVisualizationIndex: number;
		targetSectionIndex: number;
		targetVisualizationIndex: number;
	}) {
		const spaceContentService = await Container.getServiceAsync<SpaceContent>("SpaceContent");
		this.vizDataModified = true;
		return spaceContentService.moveVisualization(
			MYHOME_PAGE_ID,
			moveConfig.sourceSectionIndex,
			moveConfig.sourceVisualizationIndex,
			moveConfig.targetSectionIndex,
			moveConfig.targetVisualizationIndex
		);
	}

	/**
	 * Filters out duplicate visualizations from a list of all visualizations
	 *
	 * @param {object[]} aVisibleFavoriteVizs - array containing list of all visualizations
	 * @param {boolean} bReturnDuplicateVizs - flag when set to true, returns only the duplicate apps
	 * @returns {object[]} filtered array of vizualisations
	 * @private
	 */
	public _filterDuplicateVizs(aVisibleFavoriteVizs: ICustomVisualization[], bReturnDuplicateVizs: boolean) {
		return aVisibleFavoriteVizs.filter((oViz, iVizIndex, aVizs) => {
			const iFirstIndex = aVizs.findIndex((oTempApp) => oTempApp.appId === oViz.appId);
			return bReturnDuplicateVizs ? iFirstIndex !== iVizIndex : iFirstIndex === iVizIndex;
		});
	}

	/**
	 * Add Grouping Information to visualizations list, and return concatenated list.
	 *
	 * @param {object[]} aFavoriteVizs - list of all favorite visualizations
	 * @returns {object[]} - concatenated list contaning grouping information as well
	 * @private
	 */
	private _addGroupInformation(aFavoriteVizs: ICustomVisualization[]) {
		const aRecentVizs: ICustomVisualization[] = [],
			aSections: ISection[] = [];
		let oExistingSection: ISection | undefined;

		_linkDuplicateVizs(aFavoriteVizs).forEach((oViz) => {
			if (oViz.persConfig?.isDefaultSection) {
				aRecentVizs.push(oViz);
			} else {
				oExistingSection = aSections.find((oSection) => oSection.isSection && oSection.id === oViz.persConfig?.sectionId);

				if (!oExistingSection) {
					aSections.push({
						id: oViz.persConfig?.sectionId,
						index: oViz.persConfig?.sectionIndex,
						title: oViz.persConfig?.sectionTitle || "",
						badge: "1",
						BGColor: DEFAULT_BG_COLOR().key,
						icon: "sap-icon://folder-full",
						isSection: true,
						isPresetSection: oViz.persConfig?.isPresetSection,
						apps: [oViz]
					});
				} else {
					oExistingSection.apps?.push(oViz);
					oExistingSection.badge = oExistingSection.apps?.length.toString();
				}
			}
		});

		//filter out duplicate apps only from recent apps list
		return [...aSections, ...this._filterDuplicateVizs(aRecentVizs, false)];
	}

	/**
	 * Move a section within a page
	 *
	 * @param {number} sourceSectionIndex - source index (previous index of the section in the page before move)
	 * @param {number} targetSectionIndex - target index (desired index of the section in the page after move)
	 * @returns {Promise} resolves to void  and moves the section to desired index within the page
	 * @private
	 */
	public async moveSection(sourceSectionIndex: number, targetSectionIndex: number): Promise<void> {
		return Container.getServiceAsync("Pages").then(function (oPagesService: {
			getPageIndex: (id: string) => number;
			moveSection: (index: number, sourceIndex: number, targetIndex: number) => void;
		}) {
			const iPageIndex: number = oPagesService.getPageIndex(MYHOME_PAGE_ID);
			return oPagesService.moveSection(iPageIndex, sourceSectionIndex, targetSectionIndex);
		} as () => void);
	}

	/**
	 * Returns array of all feature toggles
	 *
	 * @returns {object[]} - returns array of all feature toggles.
	 */
	private async _getFeatureToggles() {
		let sFeatureToggleUrl = FEATURE_TOGGLE_SRVC_URL + "?$filter=";
		const FEATURE_TOGGLE_KEYS = Object.keys(FEATURE_TOGGLES);
		const toggleFilter = FEATURE_TOGGLE_KEYS.map((sToggleKey) => {
			return "ToggleId eq '" + FEATURE_TOGGLES[sToggleKey as keyof IFeatureToggles] + "'";
		}).join(" or ");
		sFeatureToggleUrl = sFeatureToggleUrl + "(" + toggleFilter + ")";
		const oResponse = (await HttpHelper.GetJSON(sFeatureToggleUrl)) as {
			error: { message: string };
			value: Array<{ ToggleId: string; State: string }>;
		};
		if (oResponse?.error) {
			throw new Error(oResponse.error.message);
		}
		return oResponse?.value || [];
	}

	/**
	 * Checks if feature is enabled or not.
	 *
	 * @param {string} sToggleId - feature toggle id
	 * @returns {boolean} - returns true if feature is enabled.
	 */
	public async isFeatureEnabled(sToggleId: string) {
		try {
			const aFeatureToggles = await this._getFeatureToggles();
			const oToggle = aFeatureToggles.find((oFeatureToggle) => {
				return oFeatureToggle.ToggleId === sToggleId;
			});
			return oToggle && oToggle.State === "" ? false : true;
		} catch (error) {
			Log.error("Unable to load feature toggles: " + (error as Error).message);
			return false;
		}
	}

	/**
	 * Fetch Recommended Fiori IDs
	 *
	 * @returns {Promise} resolves to array of recommended fiori ids
	 * @private
	 */
	private async _getRecommenedFioriIds(bForceRefresh: boolean = false): Promise<string[]> {
		const recommendationEnabled = await this.isFeatureEnabled(FEATURE_TOGGLES.RECOMMENDATION);
		if (!recommendationEnabled) {
			return Promise.resolve([]);
		}
		if (!this.recommendedFioriIds || bForceRefresh) {
			try {
				const response = (await HttpHelper.GetJSON(RECOMMENDATION_SRVC_URL)) as {
					error: { message: string };
					value: Array<{ app_id: string }>;
				};
				this.recommendedFioriIds =
					response?.value?.map((oApp) => {
						return oApp.app_id;
					}) || [];
			} catch (error) {
				Log.error("Unable to load feature toggles: " + (error as Error).message);
				return Promise.resolve([]);
			}
		}
		return this.recommendedFioriIds;
	}

	/**
	 * Fetch Catalog Apps
	 *
	 * @returns {Promise} resolves to array of Catalog Apps
	 * @private
	 */
	public async _getCatalogApps() {
		try {
			const SearchableContent = await Container.getServiceAsync<SearchableContent>("SearchableContent");
			return SearchableContent.getApps({ includeAppsWithoutVisualizations: false });
		} catch (error) {
			Log.error("Error while fetching catalog apps: " + (error as Error).message);
			return [];
		}
	}

	/**
	 * Check If Page is List Report
	 *
	 * @param {object} page - page object
	 * @returns {boolean} returns boolean
	 * @private
	 */
	private _isListReport(page?: IGenericApp) {
		return page?.component?.name === "sap.suite.ui.generic.template.ListReport";
	}

	/**
	 * Checks whether page settings contains addCardtoInsightsHidden
	 * @param {object} page - page object
	 * @returns {boolean} returns boolean
	 * @private
	 */
	// checks whether page settings contains addCardtoInsightsHidden
	private isAddCardToInsightsHidden(page?: IGenericApp) {
		return page?.component?.settings?.tableSettings?.addCardtoInsightsHidden;
	}

	/**
	 * check Valid Manifests
	 *
	 * @returns {boolean} returns boolean
	 * @private
	 */

	private _checkValidManifests(manifest: ICardManifest) {
		const hasRequiredDataSource = manifest["sap.ui.generic.app"] && manifest["sap.app"]?.dataSources?.mainService;
		if (!hasRequiredDataSource) {
			return false;
		}

		const pages = manifest["sap.ui.generic.app"]?.pages as Array<IGenericApp> | Record<string, IGenericApp>;
		// if its not list report component or if listreport page settings has
		// isAddCardToInsightsHidden as true, then do not recommend the card
		if (Array.isArray(pages)) {
			return this._isListReport(pages[0]) && !this.isAddCardToInsightsHidden(pages[0]);
		} else if (Object.keys(pages).length) {
			return Object.keys(pages).some((key: string) => {
				if ((pages as Record<string, unknown>)[key]) {
					return this._isListReport(pages[key]) && !this.isAddCardToInsightsHidden(pages[key]);
				}
			});
		}
		return false;
	}

	/**
	 * Get OData Model
	 *
	 * @param {object} manifest - manifest object
	 * @returns {object} returns OData Model
	 * @private
	 */
	private _getOdataModel(oManifest: ICardManifest) {
		return new Promise(function (resolve) {
			const datasource = oManifest?.["sap.app"]?.dataSources;
			const mainService = datasource?.mainService;
			const annotationUrls = mainService?.settings?.annotations
				.map((sname) => {
					if (datasource && datasource[sname]) {
						return datasource[sname]?.uri;
					}
				})
				.filter((urls) => urls !== undefined);
			const oDataModel = new ODataModelV2(mainService?.uri as string, {
				annotationURI: annotationUrls as string[],
				loadAnnotationsJoined: true
			});
			oDataModel.attachMetadataLoaded(() => {
				resolve(oDataModel);
			});
			oDataModel.attachMetadataFailed(() => {
				resolve(oDataModel);
			});
		});
	}

	/**
	 * Get Entity Set
	 *
	 * @param {object} manifest - manifest object
	 * @returns {string} returns entity set
	 * @private
	 */
	private _getEntitySet(manifest: ICardManifest) {
		const pages = manifest["sap.ui.generic.app"]?.pages;
		if (Array.isArray(pages)) {
			return pages[0].entitySet;
		} else if (pages) {
			for (const key in pages as Record<string, IGenericApp>) {
				const oApp = pages[key] as IGenericApp;
				if (oApp.component && oApp.component?.name === "sap.suite.ui.generic.template.ListReport") {
					return oApp.entitySet;
				}
			}
		}
		return undefined;
	}

	/**
	 * function returns true if the passed entityset / properties have mandatory properties
	 *
	 * @param {EntitySet} oEntitySet - Entity set
	 * @param {Array} aProperties - Additional Properties
	 * @returns {boolean} returns boolean
	 * @private
	 */
	private _hasMandatoryProperties(oEntitySet: IEntitySet, aProperties?: Property[]) {
		// if entityset has required properties in filter restrictions return true
		if (oEntitySet?.["Org.OData.Capabilities.V1.FilterRestrictions"]?.["RequiredProperties"]?.length) {
			return true;
		} else if (aProperties?.length) {
			// iterate through all properties and return true if any property is mandatory or sap:rquired-in-filter is true
			return aProperties.some((oProperty: Record<string, string> | Property) => {
				return (
					Object.keys(oProperty).length &&
					((oProperty as Record<string, string>)["sap:parameter"] === "mandatory" ||
						(oProperty as Record<string, string>)["sap:required-in-filter"] === "true")
				);
			});
		}
	}

	/**
	 * Get Parametersised Entity Set Params
	 *
	 * @param {ODataMetaModel} oMetaModel - Meta Model
	 * @param {string} sEntitySet - Entity Set
	 * @param {boolean} bIsParamEntitySet - Is Param Entity Set
	 * @returns {object} returns entity set params
	 * @private
	 */
	private _getParametersisedEntitySetParams(oMetaModel: ODataMetaModel, sEntitySet: string, bInfoParams: boolean) {
		if (!oMetaModel) {
			throw new Error("OData Model needs to be passed as an argument");
		}

		const oResult: { entitySetName: string | undefined | null; parameters: Array<object | string>; navPropertyName: string | null } = {
			entitySetName: null,
			parameters: [],
			navPropertyName: null
		};

		const oEntitySet = oMetaModel.getODataEntitySet(sEntitySet) as IEntitySet;
		const oEntityType = oMetaModel.getODataEntityType(oEntitySet.entityType) as IEntityType;
		const aNavigationProperties = oEntityType.navigationProperty;

		if (!aNavigationProperties) {
			return oResult;
		}
		// filter the parameter entityset for extracting it's key and it's entityset name
		aNavigationProperties.forEach(function (oNavProperty) {
			const oNavigationEntitySet = oMetaModel.getODataAssociationEnd(oEntityType, oNavProperty.name);
			const oNavigationEntityType = oNavigationEntitySet && (oMetaModel.getODataEntityType(oNavigationEntitySet.type) as IEntityType);
			if (oNavigationEntityType?.["sap:semantics"] !== "parameters" || !oNavigationEntityType.key) {
				return;
			}
			oResult.entitySetName = oMetaModel.getODataAssociationSetEnd(oEntityType, oNavProperty.name)?.entitySet as string;
			for (let value of oNavigationEntityType.key.propertyRef) {
				if (bInfoParams) {
					const navProp = oNavigationEntityType.property;
					for (let navProperty of navProp) {
						if (navProperty.name === value.name) {
							oResult.parameters.push(navProperty);
							oResult.entitySetName = oMetaModel.getODataAssociationSetEnd(oEntityType, oNavProperty.name)?.entitySet;
						}
					}
				} else {
					oResult.parameters.push(value.name);
				}
			}
			const aSubNavigationProperties = oNavigationEntityType.navigationProperty;
			// Parameter entityset must have association back to main entityset.
			const bBackAssociationPresent = aSubNavigationProperties?.some(function (oSubNavigationProperty) {
				const sSubNavigationEntityType = oMetaModel.getODataAssociationEnd(
					oNavigationEntityType as EntityType,
					oSubNavigationProperty.name
				)?.type;
				//if entityset.entitytype is same as subnavigation entitytype then it's a back association
				oResult.navPropertyName = sSubNavigationEntityType === oEntitySet.entityType ? oSubNavigationProperty.name : null;
				return oResult.navPropertyName;
			});
			return bBackAssociationPresent && oResult.navPropertyName && oResult.entitySetName;
		});
		return oResult;
	}

	/**
	 * Get Column Detail
	 *
	 * @param {object} oEntityType - entity type object
	 * @param {object} oMetaModel - meta model object
	 * @param {object} oColumn - column object
	 * @returns {object} returns column detail
	 * @private
	 */
	private _getColumnDetail(oEntityType: IEntityType, oMetaModel: ODataMetaModel, oLineItemContext: ILineItemContext) {
		let oProperty,
			oColumnObject: Record<string, unknown> = {};
		type oDataProprty = Record<
			string,
			{ Bool?: boolean; Path?: string; "com.sap.vocabularies.UI.v1.TextArrangement"?: { EnumMember: string } }
		>;
		if (oLineItemContext.Value?.Path) {
			oProperty = oMetaModel.getODataProperty(oEntityType, oLineItemContext.Value.Path) as oDataProprty | Property;
		}
		if (
			!oProperty ||
			(oProperty as oDataProprty)["com.sap.vocabularies.UI.v1.Hidden"]?.Bool ||
			oLineItemContext["com.sap.vocabularies.UI.v1.Hidden"]?.Bool
		) {
			return oColumnObject;
		}
		// if there is field control path binding then ignore the column
		if ((oProperty as oDataProprty)["com.sap.vocabularies.Common.v1.FieldControl"]?.Path) {
			return undefined;
		}
		let sColumnKeyDescription = (oProperty as oDataProprty)["com.sap.vocabularies.Common.v1.Text"]?.Path || "";
		sColumnKeyDescription = "{" + sColumnKeyDescription + "}";
		let sColumnValue = "{" + (oProperty.name as string) + "}";
		let sNavigation = ""; //need to improve
		const aSemKeyAnnotation = oEntityType["com.sap.vocabularies.Common.v1.SemanticKey"];
		const bIsPropertySemanticKey =
			!!aSemKeyAnnotation &&
			aSemKeyAnnotation.some(function (oAnnotation) {
				return oAnnotation.PropertyPath === (oProperty as oDataProprty).name;
			});

		if ((oProperty as oDataProprty)["Org.OData.Measures.V1.ISOCurrency"]?.Path) {
			sColumnValue = sColumnValue.concat(
				" " + "{" + sNavigation + (oProperty as oDataProprty)["Org.OData.Measures.V1.ISOCurrency"].Path + "}"
			);
		}
		if ((oProperty as oDataProprty)["Org.OData.Measures.V1.Unit"]?.Path) {
			sColumnValue = sColumnValue.concat(
				" " + "{" + sNavigation + (oProperty as oDataProprty)["Org.OData.Measures.V1.Unit"].Path + "}"
			);
		}

		if ((oProperty as oDataProprty)["com.sap.vocabularies.Common.v1.Text"]?.Path) {
			let sTextArragement = (oProperty as oDataProprty)["com.sap.vocabularies.Common.v1.Text"][
				"com.sap.vocabularies.UI.v1.TextArrangement"
			];
			if (!sTextArragement) {
				sTextArragement = oEntityType["com.sap.vocabularies.UI.v1.TextArrangement"];
			}

			this._setColumnTextValue(sTextArragement, oColumnObject, sColumnKeyDescription, sColumnValue);
		} else {
			oColumnObject["value"] = sColumnValue;
			if (bIsPropertySemanticKey) {
				oColumnObject.identifier = bIsPropertySemanticKey;
			}
		}
		oColumnObject.path = (oProperty as oDataProprty)["com.sap.vocabularies.Common.v1.Text"]
			? (oProperty as oDataProprty)["com.sap.vocabularies.Common.v1.Text"].Path
			: oProperty.name;
		oColumnObject.importance = oLineItemContext["com.sap.vocabularies.UI.v1.Importance"];
		oColumnObject.type = oProperty.type;
		return oColumnObject;
	}

	/**
	 * Sets display text format of column
	 *
	 * @private
	 * @param {{EnumMember: string} | undefined} sTextArragement - sTextArragement object
	 * @param {Record<string, unknown>} oColumnObject - Object containing column details
	 * @param {string} sColumnKeyDescription - Description field to include in text value
	 * @param {string} sColumnValue - The value to include in Text value
	 */
	private _setColumnTextValue(
		sTextArragement: { EnumMember: string } | undefined,
		oColumnObject: Record<string, unknown>,
		sColumnKeyDescription: string,
		sColumnValue: string
	) {
		const sTextArrangementType = sTextArragement?.EnumMember.split("/")[1];

		if (sTextArrangementType === "TextOnly") {
			oColumnObject["value"] = "{= $" + sColumnKeyDescription + " === '' ? '' : $" + sColumnKeyDescription + "}";
		} else if (sTextArrangementType === "TextLast") {
			oColumnObject["value"] =
				"{= $" +
				sColumnValue +
				" === '' ? '' : $" +
				sColumnValue +
				"}" +
				"{= $" +
				sColumnKeyDescription +
				" === '' ? '' : ' (' + ($" +
				sColumnKeyDescription +
				") + ')'}";
		} else if (sTextArrangementType === "TextSeparate") {
			oColumnObject["value"] = "{= $" + sColumnValue + " === '' ? '' : $" + sColumnValue + "}";
		} else {
			// Default case
			oColumnObject["value"] =
				"{= $" +
				sColumnKeyDescription +
				" === '' ? '' : $" +
				sColumnKeyDescription +
				"}" +
				"{= $" +
				sColumnValue +
				" === '' ? '' : ' (' + ($" +
				sColumnValue +
				") + ')'}";
		}
	}

	/**
	 * Get Manifest Card Data
	 *
	 * @param {object} manifest - manifest object
	 * @param {object} entityType - entity type object
	 * @param {object} lineItem - line item object
	 * @param {string} entitySet - entity set
	 * @param {object} parentApp - parent app object
	 * @param {object} metaModel - meta model object
	 * @returns {object} returns card data
	 * @private
	 */
	private _getManifestCardData(
		manifest: ICardManifest,
		oEntityType: IEntityType,
		lineItem: Array<ILineItemContext>,
		entitySet: IEntitySet | string,
		oParentApp: unknown,
		oMetaModel: ODataMetaModel
	): IManifestCardData {
		const mainServiceUri = manifest?.["sap.app"]?.dataSources.mainService.uri;
		const serviceUrl =
			mainServiceUri?.[mainServiceUri.length - 1] === "/"
				? mainServiceUri + (entitySet as string)
				: mainServiceUri + "/" + (entitySet as string);

		//get the column details for each of the lineitem columns
		const aColumns = lineItem
			?.map((oColumn) => {
				return this._getColumnDetail(oEntityType, oMetaModel, oColumn);
			})
			.filter(function (oItem) {
				// if no column or if path of column is complex path then filter it out
				return oItem !== undefined && (oItem as { path: string }).path.split("/").length <= 1;
			});
		//sort  the column based on their importance and then splice the first 4 columns
		const aColumnSorted = DataFormatUtils.sortCollectionByImportance(aColumns)
			.map((column) => {
				type prop = { path: string; type: string; value: string };
				return { path: (column as prop).path, type: (column as prop).type, value: (column as prop).value };
			})
			.splice(0, 4);
		return {
			cardTitle: manifest?.["sap.app"]?.title,
			subTitle: oEntityType["com.sap.vocabularies.Common.v1.Label"]
				? "Top 5 " + oEntityType["com.sap.vocabularies.Common.v1.Label"].String
				: "",
			url: serviceUrl + "?$top=5&skip=0",
			semanticObject: (oParentApp as { semanticObject: string }).semanticObject,
			action: (oParentApp as { action: string }).action,
			id: manifest?.["sap.app"]?.id,
			columns: aColumnSorted
		};
	}

	/**
	 * Load I18n
	 *
	 * @param {object} manifest - manifest object
	 * @param {string} manifestUrl - manifest url
	 * @returns {object} returns resource bundle
	 * @private
	 */
	private async loadI18n(manifest: ICardManifest, manifestUrl: string) {
		// construct abslute url for properties file relative to manifest url
		const i18nBundleUrl = manifest?.["sap.app"]?.["i18n"]["bundleUrl"] as string;
		const absoluteUrl = new URL(i18nBundleUrl, manifestUrl).href;
		this._RBManifestMap = this._RBManifestMap || {};
		if (!this._RBManifestMap[absoluteUrl]) {
			const oResourceBundle = await ResourceBundle.create({
				// specify url of the base .properties file
				bundleUrl: absoluteUrl,
				async: true,
				terminologies: manifest["sap.app"]?.["i18n"]["terminologies"]
			});
			this._RBManifestMap[absoluteUrl] = oResourceBundle;
		}
		return this._RBManifestMap[absoluteUrl];
	}

	/**
	 * Get I18n Value Or Default String
	 *
	 * @param {string} sValue - value
	 * @param {object} oResourceBundle - resource bundle object
	 * @returns {string} returns string
	 * @private
	 */
	private getI18nValueOrDefaultString(sValue: string, oRB: ResourceBundle) {
		let sPath = "";
		if (sValue && sValue.startsWith("{{")) {
			sPath = sValue.substring(2, sValue.length - 2);
		} else if (sValue && sValue.startsWith("{")) {
			sPath = sValue.substring(1, sValue.length - 1);
		}
		return sPath ? oRB.getText(sPath) : sValue;
	}

	/**
	 * Get Attribute Value
	 *
	 * @param {object} oColumn - column object
	 * @returns {string} returns attribute value
	 * @private
	 */
	private _getAttributeValue(oAttribute: unknown) {
		type attribute = { value: string; path: string; type: string };
		let oAttributeValue = !(oAttribute as attribute).value.startsWith("{")
			? "{= extension.formatters.stringFormatter(${" + (oAttribute as attribute).path + "}) }"
			: (oAttribute as attribute).value;
		if ((oAttribute as attribute).type === "Edm.Date" || (oAttribute as attribute).type === "Edm.DateTime") {
			const oDateFormatOptions = JSON.stringify({
				pattern: Formatting.getDatePattern("short")
			});
			oAttributeValue =
				"{=${" +
				(oAttribute as attribute).path +
				"}?format.dateTime(${" +
				(oAttribute as attribute).path +
				"}, " +
				oDateFormatOptions +
				") : ''}";
		}
		return oAttributeValue;
	}

	/**
	 * Get Manifest
	 *
	 * @param {object} cardInput - card input object
	 * @returns {object} returns manifest
	 * @private
	 */
	private _getManifest(oInput: IManifestCardData) {
		const cardSkeletonCopy = JSON.parse(JSON.stringify(CardSkeleton)) as ICardManifest;
		const oApp = cardSkeletonCopy["sap.app"];
		const oCard = cardSkeletonCopy["sap.card"];
		if (oApp) {
			oApp.id = "user." + oInput.id + "." + Date.now();
			oApp.title = (oCard.header as { title: string }).title = oInput.cardTitle as string;
			oApp.subTitle = (oCard.header as { subTitle: string }).subTitle = oInput.subTitle;
		}
		const oContent = oCard.content;
		oContent.item.title = this._getAttributeValue(oInput.columns[0]);
		oContent.item.description = this._getAttributeValue(oInput.columns[1]);
		oContent.item.attributes[0] = {
			value: this._getAttributeValue(oInput.columns[2]),
			visible: "{= !!${" + (oInput.columns[2] as { path: string }).path + "} }"
		};
		oContent.data.request.url = oInput.url;

		oContent.item.actions = oCard.header.actions = [
			{
				type: "Navigation",
				parameters: {
					ibnTarget: {
						semanticObject: oInput.semanticObject,
						action: oInput.action
					}
				}
			}
		];

		cardSkeletonCopy["sap.insights"] = {
			parentAppId: oInput.id as string,
			cardType: "RT",
			versions: {
				ui5: this.versionInfo.version + "-" + this.versionInfo.buildTimestamp
			},
			visible: true
		};

		return cardSkeletonCopy;
	}

	/**
	 * Fetch Card Mainfest
	 *
	 * @param {string[]} aAppIds - array of app ids
	 * @returns {Promise} resolves to array of card manifest
	 * @private
	 */
	private async _getCardMainfest(aAppIds: string[]) {
		const [aInbounds, aCatalog] = await Promise.all([this._getInboundApps(), this._getCatalogApps()]);
		this.versionInfo = (await VersionInfo.load()) as { version: string; buildTimestamp: string };

		let aAppUrls = aAppIds
			.map((appId) => {
				const oApp = aInbounds.find((oItem) => {
					return oItem?.signature?.parameters?.["sap-fiori-id"]?.defaultValue?.value === appId;
				});

				if (oApp) {
					const oViz = aCatalog.find((oCatalog) => {
						return oApp.semanticObject === oCatalog.target?.semanticObject && oApp.action === oCatalog.target?.action;
					});
					return (oViz && oApp?.resolutionResult?.applicationDependencies?.manifest) as string;
				}
				return undefined;
			})
			.filter((url) => {
				return url !== undefined;
			});

		const aManifestPromises = aAppUrls.map(async (url) => {
			const response = await fetch(String(url));
			const manifest = (await response.json()) as ICardManifest;
			return {
				url: response.url,
				manifest: manifest
			};
		});

		const aManifest = await Promise.all(aManifestPromises);

		const validManifests = aManifest.filter((manifestObj) => {
			return this._checkValidManifests(manifestObj.manifest);
		});

		const odataPromises = validManifests.map((manifestObj) => {
			return this._getOdataModel(manifestObj.manifest).then((model) => {
				return (model as Model).getMetaModel();
			});
		});

		const aMetaModel = await Promise.all(odataPromises);
		const cardPromises = validManifests.map(async (manifestObj, index) => {
			try {
				const oMetaModel = aMetaModel[index] as ODataMetaModel;
				const entitySet = this._getEntitySet(manifestObj.manifest);
				if (!entitySet) {
					return undefined;
				}
				const oEntitySet = oMetaModel.getODataEntitySet(entitySet as string) as IEntitySet;
				const oEntityType = oMetaModel.getODataEntityType(oEntitySet.entityType) as IEntityType;
				const oLineItem = oEntityType["com.sap.vocabularies.UI.v1.LineItem"];
				if (!oLineItem || this._hasMandatoryProperties(oEntitySet, oEntityType.property)) {
					return undefined;
				}
				const parameterDetails = this._getParametersisedEntitySetParams(oMetaModel, entitySet as string, true);
				if (parameterDetails && parameterDetails.entitySetName && parameterDetails.parameters.length) {
					const paramEntitySet = oMetaModel.getODataEntitySet(parameterDetails.entitySetName) as EntitySet;
					if (this._hasMandatoryProperties(paramEntitySet, parameterDetails.parameters as Property[])) {
						return undefined;
					}
				}
				const oParentApp = aInbounds.find(function (oApp) {
					return oApp.resolutionResult && oApp.resolutionResult.ui5ComponentName === manifestObj?.manifest?.["sap.app"]?.id;
				});
				const cardInput = this._getManifestCardData(
					manifestObj.manifest,
					oEntityType,
					oLineItem,
					entitySet as IEntitySet,
					oParentApp as unknown,
					oMetaModel
				);
				// if less than 3 columns are present in the card, then do not recommend the card
				if (cardInput.columns.length < 3) {
					return undefined;
				}
				if (typeof manifestObj?.manifest?.["sap.app"]?.i18n === "object") {
					const i18nBundleUrl = manifestObj.manifest["sap.app"].i18n.bundleUrl;
					//if manifest title is not resolved load the resource bundle of the parent app and get the text
					if (
						i18nBundleUrl &&
						(manifestObj.manifest["sap.app"].title.startsWith("i18n>") || manifestObj.manifest["sap.app"].title.startsWith("{"))
					) {
						const i18nResourceBundle = await this.loadI18n(manifestObj.manifest, manifestObj.url);
						cardInput.cardTitle = this.getI18nValueOrDefaultString(cardInput.cardTitle as string, i18nResourceBundle);
						return this._getManifest(cardInput);
					}
				}
				return this._getManifest(cardInput);
			} catch (error) {
				Log.error(error as string);
				return undefined;
			}
		});

		const cards = await Promise.all(cardPromises);
		return cards.filter((card) => {
			return card !== undefined;
		});
	}

	/**
	 * Remove Duplicate Cards
	 *
	 * @param {object[]} aCards - array of cards
	 * @returns {object[]} returns array of cards
	 * @private
	 */
	private _removeDuplicateCards(aCards: ICard[]) {
		const oCardDict: Record<string, unknown> = {};
		const aResult: ICard[] = [];
		aCards.forEach((oCard) => {
			const sCardTitle = oCard?.descriptorContent?.["sap.card"]?.header?.title || "";
			if (!oCardDict[sCardTitle]) {
				aResult.push(oCard);
				oCardDict[sCardTitle] = true;
			}
		});
		return aResult;
	}

	/**
	 * Fetch Recommended Cards
	 *
	 * @returns {Promise} resolves to array of recommended cards
	 * @private
	 */
	public async getRecommenedCards() {
		try {
			const aAppIds = await this._getRecommenedFioriIds();
			const aManifests = await this._getCardMainfest(aAppIds);
			const aRecManifests = aManifests.slice(0, RECOMMENDED_CARD_LIMIT);
			const aRecommendedCards = aRecManifests.map((manifest) => {
				let id;
				if (manifest) {
					manifest["sap.card"].rec = true;
					id = manifest["sap.app"]?.id as string;
				}
				return {
					id,
					descriptorContent: manifest
				};
			});
			return this._removeDuplicateCards(aRecommendedCards as ICard[]);
		} catch (error) {
			Log.error("Error while fetching recommended cards: " + (error as Error).message);
			return [];
		}
	}

	/**
	 * Retrieves a list of recommended visualizations for the user.
	 *
	 * The final list is composed of up to 10 recommendations, with must-include visualizations prioritized.
	 * If no recommended visualizations are available or if an error occurs, it returns an empty array.
	 *
	 * @private
	 * @async
	 * @param {boolean} [forceRefresh=false] - If `true`, forces a refresh of the recommended visualizations
	 *                                         regardless of whether they are cached.
	 * @returns {Promise<ICustomVisualization[]>} A promise that resolves to an array of recommended visualizations.
	 *                                            The array is limited to 10 visualizations, including must-include recommendations.
	 */
	public async getRecommendedVisualizations(forceRefresh: boolean = false) {
		if (!this._recommendedVisualizations || forceRefresh) {
			const recommendedFioriIds = await this._getRecommenedFioriIds(forceRefresh);
			if (recommendedFioriIds.length) {
				let finalRecommendations: ICustomVisualization[] = [];
				let mustIncludeRecommendations: ICustomVisualization[] = [];
				let [recommendedVisualizations, favoriteVisualizations] = await Promise.all([
					this._getVisualizationsByFioriIds(recommendedFioriIds),
					this._fetchMyHomeVizs(forceRefresh)
				]);
				//filter out recommendations that are already added
				recommendedVisualizations = recommendedVisualizations.filter((recViz) =>
					_isVisualizationAlreadyAdded(recViz, favoriteVisualizations)
				);
				recommendedVisualizations.forEach((recViz) => {
					if (_isMustIncludeRecommendation(recViz)) {
						mustIncludeRecommendations.push(recViz);
					} else {
						finalRecommendations.push(recViz);
					}
				});
				//return only 10 recommended apps along with 'MyInbox' and 'Manage My Timesheet' if user has access to these apps.
				this._recommendedVisualizations = finalRecommendations
					.slice(0, 10 - mustIncludeRecommendations.length)
					.concat(mustIncludeRecommendations);
			} else {
				this._recommendedVisualizations = [];
			}
		}
		return this._recommendedVisualizations;
	}

	/**
	 * Asynchronously retrieves the list of inbound applications from the SAP Fiori client-side target resolution service.
	 *
	 * @private
	 * @async
	 * @returns {Promise<Array>} A promise that resolves to an array of inbound applications.
	 *                            If an error occurs or the inbound applications are not available, it resolves to an empty array.
	 */
	private async _getInboundApps() {
		try {
			const service = await Container.getServiceAsync<ClientSideTargetResolution>("ClientSideTargetResolution");
			return service?._oAdapter?._aInbounds || [];
		} catch (error) {
			Log.error("Error while fetching inbound apps: " + (error as Error).message);
			return [];
		}
	}

	/**
	 * Retrieves visualizations based on a list of Fiori IDs.
	 *
	 * This function processes the given Fiori IDs to find associated visualizations. It does so by fetching
	 * inbound applications and catalog apps, then matching the Fiori IDs to filter out and gather relevant visualizations.
	 * The function distinguishes between GUI and non-GUI visualizations, prioritizing non-GUI visualizations if both types are found.
	 * It also ensures that each visualization is unique based on its URL and title, avoiding duplicates.
	 *
	 * @private
	 * @async
	 * @param {string[]} fioriIds - An array of Fiori IDs to search for visualizations.
	 * @returns {Promise<ICustomVisualization[]>} A promise that resolves to an array of unique visualizations associated with the provided Fiori IDs.
	 */
	private async _getVisualizationsByFioriIds(fioriIds: string[]) {
		const visualizations: ICustomVisualization[] = [];
		const visitedVisualizations: Map<string, boolean> = new Map<string, boolean>();
		const [inbounds, catalogApps] = await Promise.all([this._getInboundApps(), this._getCatalogApps()]);
		fioriIds.forEach((fioriId) => {
			// get all inbounds with the fiori id
			const authorizedApps = inbounds.filter(function (inbound) {
				return inbound?.signature.parameters["sap-fiori-id"]?.defaultValue?.value === fioriId;
			});
			authorizedApps.forEach((app) => {
				//filter apps that matched semantic object action
				let matchingVizualizations = catalogApps.filter((catalogApp) => {
					return catalogApp?.target?.semanticObject === app.semanticObject && catalogApp.target.action === app.action;
				});

				const guiVisualizations = matchingVizualizations.filter((matchingVizualization) =>
					_isGUIVisualization(matchingVizualization)
				);
				const nonGuiVisualizations = matchingVizualizations.filter(
					(matchingVizualization) => !_isGUIVisualization(matchingVizualization)
				);
				//if both gui and non-gui visualizations exists, then consider only non-gui visualizations for recommendation.
				if (guiVisualizations.length > 0 && nonGuiVisualizations.length > 0) {
					matchingVizualizations = [...nonGuiVisualizations];
				}

				matchingVizualizations.forEach((matchingVizualization) => {
					let visualization = matchingVizualization.visualizations[0];
					let recommendedVisualization: ICustomVisualization = {
						title: visualization.title,
						subtitle: visualization.subtitle,
						icon: visualization.icon,
						url: visualization.targetURL,
						vizId: visualization.vizId,
						fioriId: fioriId,
						visualization: visualization
					};
					//if app with same url or title already recommended, then don't consider it.
					if (
						!visitedVisualizations.has(recommendedVisualization.url!) ||
						!visitedVisualizations.has(recommendedVisualization.title!)
					) {
						visitedVisualizations.set(recommendedVisualization.url!, true);
						visitedVisualizations.set(recommendedVisualization.title!, true);
						visualizations.push(recommendedVisualization);
					}
				});
			});
		});
		return visualizations;
	}
}
