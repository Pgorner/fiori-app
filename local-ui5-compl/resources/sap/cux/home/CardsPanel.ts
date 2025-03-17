/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */

import Log from "sap/base/Log";
import GridContainer from "sap/f/GridContainer";
import GridContainerSettings from "sap/f/GridContainerSettings";
import SelectionVariant from "sap/fe/navigation/SelectionVariant";
import CardHelper from "sap/insights/CardHelper";
import InsightsInMemoryCachingHost from "sap/insights/base/InMemoryCachingHost";
import Button from "sap/m/Button";
import HBox from "sap/m/HBox";
import HeaderContainer from "sap/m/HeaderContainer";
import VBox from "sap/m/VBox";
import Event from "sap/ui/base/Event";
import ManagedObject, { MetadataOptions } from "sap/ui/base/ManagedObject";
import Component from "sap/ui/core/Component";
import Control from "sap/ui/core/Control";
import EventBus from "sap/ui/core/EventBus";
import DragDropInfo from "sap/ui/core/dnd/DragDropInfo";
import { DropInfo$DropEventParameters } from "sap/ui/core/dnd/DropInfo";
import { dnd } from "sap/ui/core/library";
import Card from "sap/ui/integration/widgets/Card";
import JSONModel from "sap/ui/model/json/JSONModel";
import Container from "sap/ushell/Container";
import S4MyHome from "sap/ushell/api/S4MyHome";
import Navigation from "sap/ushell/services/Navigation";
import BasePanel from "./BasePanel";
import { $CardsPanelSettings } from "./CardsPanel";
import InsightsContainer from "./InsightsContainer";
import MenuItem from "./MenuItem";
import {
	ICard,
	ICardActionParameters,
	ICardHelper,
	ICardHelperInstance,
	ICardManifest,
	InsightsCacheData,
	IsapApp,
	IsapCard
} from "./interface/CardsInterface";
import AppManager from "./utils/AppManager";
import { FEATURE_TOGGLES, SETTINGS_PANELS_KEYS } from "./utils/Constants";
import { DeviceType, fetchElementProperties } from "./utils/Device";
import { attachKeyboardHandler } from "./utils/DragDropUtils";
import { addFESRId } from "./utils/FESRUtil";
import PersonalisationUtils from "./utils/PersonalisationUtils";
import UShellPersonalizer from "./utils/UshellPersonalizer";

export enum cardsMenuItems {
	REFRESH = "cards-refresh",
	EDIT_CARDS = "cards-editCards"
}

interface IcardActionEvent {
	getParameter(sParam: string): unknown;
	preventDefault(): void;
}

export interface Intent {
	target: {
		semanticObject: string;
		action: string;
	};
	params?: {
		[key: string]: string;
	};
}
const RECOMMENDATION_PATH = "showRecommendation";
let runtimeHostCreated = false;

/**
 *
 * Panel class for managing and storing Insights Cards.
 *
 * @extends sap.cux.home.BasePanel
 *
 * @author SAP SE
 * @version 0.0.1
 * @since 1.122.0
 *
 * @internal
 * @experimental Since 1.122
 * @public
 *
 * @alias sap.cux.home.CardsPanel
 */

export default class CardsPanel extends BasePanel {
	static readonly metadata: MetadataOptions = {
		library: "sap.cux.home",
		properties: {
			title: { type: "string", group: "Misc", defaultValue: "", visibility: "hidden" },
			key: { type: "string", group: "Misc", defaultValue: "", visibility: "hidden" },
			fullScreenName: { type: "string", group: "Misc", defaultValue: "SI2", visibility: "hidden" }
		},
		defaultAggregation: "cards",
		aggregations: {
			/**
			 * Aggregation of cards available within the cards panel
			 */
			cards: { type: "sap.ui.integration.widgets.Card", multiple: true, singularName: "card", visibility: "hidden" }
		},
		events: {
			handleHidePanel: {
				parameters: {}
			},
			handleUnhidePanel: {
				parameters: {}
			}
		}
	};
	private cardHelperInstance!: ICardHelperInstance;
	private cardsContainer!: GridContainer | HeaderContainer;
	private aVisibleCardInstances: Card[] = [];
	public menuItems!: MenuItem[];
	public actionButtons!: Button[];
	private _oData!: Record<string, unknown>;
	private _controlModel!: JSONModel;
	private oPersonalizer!: UShellPersonalizer;
	private appManagerInstance;
	private runtimeHost!: InsightsInMemoryCachingHost;
	private cardsContainerSettings!: GridContainerSettings;
	private cardWidth!: string;
	private cardHeight!: string;
	private cardsInViewport: Card[] = [];
	private oEventBus!: EventBus;
	private _appSwitched: boolean = false;

	constructor(idOrSettings?: string | $CardsPanelSettings);
	constructor(id?: string, settings?: $CardsPanelSettings);
	/**
	 * Constructor for a new card panel.
	 *
	 * @param {string} [id] ID for the new control, generated automatically if an ID is not provided
	 * @param {object} [settings] Initial settings for the new control
	 */
	public constructor(id?: string, settings?: $CardsPanelSettings) {
		super(id, settings);
		this.appManagerInstance = AppManager.getInstance();
	}

	public async init() {
		super.init();
		this.setProperty("title", `${this._i18nBundle?.getText("insights")} ${this._i18nBundle.getText("insightsCardsTitle")}`);
		this.cardWidth = this.getDeviceType() === DeviceType.Mobile ? "17rem" : "22rem";
		this.cardHeight = this.getDeviceType() === DeviceType.Mobile ? "25.5rem" : "33rem";

		//Initialize Tiles Model
		this._oData = {
			userVisibleCards: [] as ICard[],
			userAllCards: [] as ICard[]
		};
		this._controlModel = new JSONModel(this._oData);

		// Setup Menu Items
		const refreshMenuItem = new MenuItem(`${this.getId()}-${cardsMenuItems.REFRESH}`, {
			title: this._i18nBundle.getText("refresh"),
			icon: "sap-icon://refresh",
			press: () => this.refreshCards()
		});
		addFESRId(refreshMenuItem, "cardsRefresh");
		const editCardsMenuItem = new MenuItem(`${this.getId()}-${cardsMenuItems.EDIT_CARDS}`, {
			title: this._i18nBundle.getText("manageCards"),
			icon: "sap-icon://edit",
			press: (event: Event) => this._handleEditCards(event)
		});
		addFESRId(editCardsMenuItem, "manageCards");

		this.menuItems = [refreshMenuItem, editCardsMenuItem];

		this.oEventBus = EventBus.getInstance();
		// Subscribe to the event
		this.oEventBus.subscribe(
			"importChannel",
			"cardsImport",
			async (sChannelId?: string, sEventId?: string, oData?) => {
				await this._createCards(oData as ICardManifest[]);
				await this.rerenderCards();
				this._importdone();
			},
			this
		);

		// Setup Header Content
		this._setupHeader();
		this.cardHelperInstance = await (CardHelper as ICardHelper).getServiceAsync();

		// Setup Host For Cards
		if (!runtimeHostCreated) {
			this._addRuntimeHost();
		}
		// Toggles the activity of cards
		this._toggleCardActivity();
	}

	/**
	 * Toggles the activity of cards on route change.
	 *
	 * @private
	 * @returns {void}
	 */
	private _toggleCardActivity(): void {
		const toggleUserActions = async (event: Event<{ isMyHomeRoute: boolean }>) => {
			const show = event.getParameter("isMyHomeRoute");
			if (show) {
				if (this._appSwitched) {
					await this.rerenderCards();
					this._appSwitched = false;
				}
			} else {
				this._appSwitched = true;
			}
		};

		S4MyHome.attachRouteMatched({}, toggleUserActions, this);
	}

	/**
	 * Create imported cards
	 * @param {ICardManifest[]} aCards - array of card manifests
	 * @returns {any}
	 */
	private async _createCards(aCards: ICardManifest[]) {
		await this.cardHelperInstance?._createCards(aCards);
		return this.rerenderCards();
	}

	/**
	 * Retrieves a manifest entry from a card.
	 * If the manifest entry is not immediately available, it waits for the manifest to be ready.
	 *
	 * @param {object} oCard - The card object from which to retrieve the manifest entry.
	 * @param {string} sEntry - The manifest entry key to retrieve.
	 * @returns {Promise<ICardManifest | undefined>} A promise that resolves with the manifest entry value.
	 */
	private _getManifestEntryFromCard(oCard: Card, sEntry: string): Promise<ICardManifest | undefined> {
		const cardWithManifestPromise = oCard as Card & { _pManifestReady?: Promise<ICardManifest | undefined> };
		const manifestEntry = oCard.getManifestEntry(sEntry) as ICardManifest | undefined;
		if (manifestEntry) {
			return Promise.resolve(manifestEntry);
		} else {
			if (!cardWithManifestPromise._pManifestReady) {
				cardWithManifestPromise._pManifestReady = new Promise<ICardManifest | undefined>((resolve) => {
					oCard.attachManifestReady(() => {
						resolve(oCard.getManifestEntry(sEntry) as ICardManifest | undefined);
					});
				});
			}
			return cardWithManifestPromise._pManifestReady;
		}
	}

	private _addRuntimeHost() {
		this.runtimeHost = new InsightsInMemoryCachingHost("runtimeHost", {
			action: async (oEvent: IcardActionEvent) => {
				const sType = oEvent.getParameter("type") as string;
				let oParameters = (oEvent.getParameter("parameters") as ICardActionParameters) || {};

				if (sType === "Navigation" && oParameters.ibnTarget) {
					oEvent.preventDefault();
					const oCard = (oEvent.getParameter("card") as Card) || {},
						oIntegrationCardManifest = (oCard?.getManifestEntry("sap.card") || {}) as IsapCard,
						aHeaderActions = oIntegrationCardManifest?.header?.actions || [];

					//processing semantic date as param for navigation
					//check to verify if _semanticDateRangeSetting property is present in manifest
					let oCheckSemanticProperty;
					if (oIntegrationCardManifest?.configuration?.parameters?._semanticDateRangeSetting?.value) {
						oCheckSemanticProperty = JSON.parse(
							oIntegrationCardManifest.configuration.parameters._semanticDateRangeSetting.value
						) as object;
					}
					if (oCheckSemanticProperty && Object.keys(oCheckSemanticProperty).length) {
						oParameters = this.cardHelperInstance.processSemanticDate(
							oParameters,
							oIntegrationCardManifest
						) as ICardActionParameters;
					}

					let aContentActions = this.getContentActions(oIntegrationCardManifest) || [];

					const oHeaderAction = aHeaderActions[0] || {},
						oContentAction = aContentActions[0] || {};

					const bOldCardExtension = !!(
						(oHeaderAction?.parameters &&
							typeof oHeaderAction.parameters === "string" &&
							oHeaderAction.parameters.indexOf("{= extension.formatters.addPropertyValueToAppState") > -1) ||
						(oContentAction?.parameters &&
							typeof oContentAction.parameters === "string" &&
							oContentAction.parameters.indexOf("{= extension.formatters.addPropertyValueToAppState") > -1)
					);

					this._manageOldCardExtension(bOldCardExtension, oEvent, oParameters);

					const navigationService = await Container.getServiceAsync<Navigation>("Navigation");
					await navigationService.navigate({
						target: oParameters.ibnTarget,
						params: oParameters.ibnParams
					});
				}
			},
			actions: [
				{
					type: "Custom",
					text: this._i18nBundle?.getText("refresh"),
					icon: "sap-icon://refresh",
					action: (oCard: Card) => {
						this._refreshCardData(oCard);
					},
					visible: async (oCard: Card) => {
						const oEntry = await this._getManifestEntryFromCard(oCard, "sap.insights");
						return oEntry && !oEntry.cacheType;
					}
				},
				{
					type: "Custom",
					text: this._i18nBundle?.getText("viewFilteredBy"),
					icon: "sap-icon://filter",
					action: (oCard: Card) => {
						const cardId = (oCard.getManifestEntry("sap.app") as IsapApp).id;
						(this.getParent() as InsightsContainer)
							?._getLayout()
							.openSettingsDialog(SETTINGS_PANELS_KEYS.INSIGHTS_CARDS, { cardId });
					},
					visible: async (oCard: Card) => {
						const oEntry = await this._getManifestEntryFromCard(oCard, "sap.insights");
						if (oEntry) {
							const oCardParams = (oCard.getManifestEntry("sap.card") as IsapCard)?.configuration?.parameters;
							const aRelevantFilters = oCardParams?._relevantODataFilters?.value || [];
							const bRelevantFilters = aRelevantFilters?.length;
							const aRelevantParams = oCardParams?._relevantODataParameters?.value || [];
							const bRelevantParams = aRelevantParams?.length;
							const oCardDataSource = (oCard.getManifestEntry("sap.app") as IsapApp).dataSources;
							const oFilterService = oCardDataSource?.filterService;
							const oDataSourceSettings = oFilterService?.settings;
							// show ViewFilteredBy Option only if relevantFilters or relevantParameters are there and is OdataV2 version
							return !!(
								(bRelevantFilters || bRelevantParams) &&
								oDataSourceSettings &&
								oDataSourceSettings.odataVersion === "2.0"
							);
						} else {
							return false;
						}
					}
				},
				{
					type: "Custom",
					text: this._i18nBundle?.getText("navigateToParent"),
					icon: "sap-icon://display-more",
					visible: async (oCard: Card) => {
						return this._getManifestEntryFromCard(oCard, "sap.insights").then(async (oEntry: ICardManifest | undefined) => {
							if (oEntry) {
								const parentApp = await this.cardHelperInstance.getParentAppDetails({
									descriptorContent: oCard.getManifestEntry("/") as ICardManifest
								});
								if (parentApp.semanticObject && parentApp.action) {
									const navigationService = await Container.getServiceAsync<Navigation>("Navigation");
									const intents: Intent[] = [
										{
											target: {
												semanticObject: parentApp.semanticObject,
												action: parentApp.action
											}
										}
									];
									const aResponses = (await navigationService.isNavigationSupported(intents)) as { supported: boolean }[];
									return aResponses[0].supported || false;
								} else {
									return true;
								}
							} else {
								return false;
							}
						});
					},
					action: async (oCard: Card) => {
						const parentApp = await this.cardHelperInstance.getParentAppDetails({
							descriptorContent: oCard.getManifestEntry("/") as ICardManifest
						});
						const sShellHash = parentApp.semanticURL || parentApp.semanticObject;
						const navigationService = await Container.getServiceAsync<Navigation>("Navigation");
						await navigationService.navigate({
							target: {
								shellHash: sShellHash
							}
						});
					}
				}
			]
		});
		runtimeHostCreated = true;
	}

	/**
	 * Updates parameters for an old card extension
	 * @private
	 * @param {boolean} bOldCardExtension - Determines whether the card is using an old card extension.
	 * @param {IcardActionEvent} oEvent - An event object
	 * @param {ICardActionParameters} oParameters - Parameter object
	 */

	private _manageOldCardExtension(bOldCardExtension: boolean, oEvent: IcardActionEvent, oParameters: ICardActionParameters) {
		if (bOldCardExtension) {
			const oCardSV = new SelectionVariant();
			const oCardParams = (oEvent.getParameter("card") as Card).getCombinedParameters();
			(oCardParams?._relevantODataParameters as string[]).forEach((sParamName: string) => {
				if (oParameters.ibnParams) {
					oParameters.ibnParams[sParamName] = oCardParams[sParamName];
				}
			});
			(oCardParams?._relevantODataFilters as string[]).forEach((sFilterName: string) => {
				const oCardParamsFilterName = JSON.parse(oCardParams[sFilterName] as string) as {
					Parameters: unknown;
					SelectOptions: { PropertyName: string; Ranges: { Sign: string; Option: string; Low: string }[] }[];
				};
				const aSelectOptions = oCardParamsFilterName.SelectOptions[0];
				const aRanges = aSelectOptions.Ranges;
				if (aRanges?.length === 1 && aRanges[0].Sign === "I" && aRanges[0].Option === "EQ") {
					if (oParameters.ibnParams) {
						oParameters.ibnParams[sFilterName] = aRanges[0].Low;
					}
				} else if (aRanges?.length > 0) {
					oCardSV.massAddSelectOption(sFilterName, aRanges);
				}
			});
			const oTempParam = JSON.parse(oParameters?.ibnParams?.["sap-xapp-state-data"] as string) as Record<string, unknown>;
			oTempParam.selectionVariant = oCardSV.toJSONObject();
			if (oParameters.ibnParams) {
				oParameters.ibnParams["sap-xapp-state-data"] = JSON.stringify(oTempParam);
			}
		}
	}

	/**
	 * Retrieves actions for a card based on its content type.
	 *
	 * @private
	 * @param {IsapCard} manifest - manifest object
	 */
	private getContentActions(manifest: IsapCard) {
		if (manifest.type === "List") {
			return manifest?.content?.item?.actions;
		} else if (manifest.type === "Table") {
			return manifest?.content?.row?.actions;
		} else {
			return manifest?.content?.actions;
		}
	}

	private _importdone() {
		const stateData = { status: true };
		this.oEventBus.publish("importChannel", "cardsImported", stateData);
	}

	private _refreshCardData(oCard: Card) {
		sap.ui.require(["sap/insights/base/CacheData"], (InsightsCacheData: InsightsCacheData) => {
			const sCardId = (oCard.getManifestEntry("sap.app") as IsapApp).id;
			const cacheDataInstance = InsightsCacheData.getInstance();
			cacheDataInstance.clearCache(sCardId);
			oCard.refreshData();
		});
	}

	private _setupHeader() {
		this.menuItems?.forEach((menuItem) => this.addAggregation("menuItems", menuItem));
		this.actionButtons?.forEach((actionButton) => this.addAggregation("actionButtons", actionButton));
		this.setProperty("enableFullScreen", true);
	}

	public async renderPanel(): Promise<void> {
		await this.rerenderCards();
	}

	private async rerenderCards() {
		try {
			// Enable Loader if container is present
			this.cardsContainer?.setBusy(true);
			// Fetch Cards from insights service
			const oUserVisibleCardModel = await this.cardHelperInstance?._getUserVisibleCardModel();
			const aCards = oUserVisibleCardModel.getProperty("/cards") as ICard[];
			this._controlModel.setProperty("/userVisibleCards", aCards);
			if (aCards?.length) {
				this._showCards(aCards);
			} else {
				await this._checkForRecommendationCards();
			}
		} catch (error) {
			if (error instanceof Error) {
				Log.error(error.message);
			}
			this.fireHandleHidePanel();
		} finally {
			this.cardsContainer?.setBusy(false);
			this._adjustLayout();
		}
	}

	private async _checkForRecommendationCards() {
		this.oPersonalizer = await this._getPersonalization();
		const oPersData = await this.oPersonalizer.read();
		const showRecommendationCards = oPersData?.[RECOMMENDATION_PATH] as boolean;
		if (showRecommendationCards === undefined) {
			const aRecommendedCards = await this.appManagerInstance.getRecommenedCards();
			if (aRecommendedCards) {
				return this._handleRecommendationCards(aRecommendedCards);
			}
		}
		this.fireHandleHidePanel();
	}

	/**
	 * Handle Recommendation Cards
	 * @param aRecommendedCards
	 * @private
	 */
	private async _handleRecommendationCards(aRecommendedCards: ICard[]) {
		const cardManifests = aRecommendedCards.map((oCard) => oCard.descriptorContent);
		await this.cardHelperInstance?._createCards(cardManifests);
		await this._updateRecommendationStatus();
		return this.rerenderCards();
	}

	/**
	 *
	 * @private
	 */
	private _showCards(aCards: ICard[]) {
		this.fireHandleUnhidePanel();
		(this.getParent() as InsightsContainer)?.updatePanelsItemCount(aCards.length, this.getMetadata().getName());
		if (this.getProperty("title")) {
			this.setProperty(
				"title",
				`${this._i18nBundle?.getText("insights")} ${this._i18nBundle.getText("insightsCardsTitle")} (${aCards.length})`
			);
		}
		// Create GridList Wrapper for all cards if not created
		if (!this.cardsContainer) {
			if (this.getDeviceType() === DeviceType.Mobile) {
				this.cardsContainer = new HeaderContainer(`${this.getId()}-insightsCardsMobileFlexBox`, {
					scrollStep: 0,
					scrollStepByItem: 1,
					gridLayout: true,
					scrollTime: 1000,
					showDividers: false,
					visible: this.getDeviceType() === DeviceType.Mobile
				});
			} else {
				this.cardsContainerSettings = new GridContainerSettings({
					columnSize: this.cardWidth,
					rowSize: this.cardHeight,
					gap: "1rem"
				});
				this.cardsContainer = new GridContainer(`${this.getId()}-insightsCardsFlexBox`, {})
					.addStyleClass("sapUiSmallMarginTop")
					.setLayout(this.cardsContainerSettings);
			}
			this.cardsContainer
				.addDragDropConfig(
					new DragDropInfo({
						sourceAggregation: "items",
						targetAggregation: "items",
						dropPosition: dnd.DropPosition.Between,
						dropLayout: dnd.DropLayout.Horizontal,
						drop: (oEvent) => void this._handleCardsDnd(oEvent)
					})
				)
				.attachBrowserEvent("keydown", (event: KeyboardEvent) => {
					const disablenavigation = event.metaKey || event.ctrlKey;
					void attachKeyboardHandler(event, disablenavigation, (dragDropEvent: Event) => this._handleCardsDnd(dragDropEvent));
				});

			this._addContent(this.cardsContainer);
		} else {
			const sDefaultAggreName = this.cardsContainer.getMetadata().getDefaultAggregationName();
			this.cardsContainer.removeAllAggregation(sDefaultAggreName);
			this.aVisibleCardInstances = [];
			this.cardsInViewport = [];
		}

		aCards.forEach((oCard) => {
			const manifest = oCard.descriptorContent;
			// Create Card Instance
			const oUserCard = new Card({
				width: this.cardWidth,
				height: this.cardHeight,
				manifest,
				host: this.runtimeHost as Control
			});

			this.aVisibleCardInstances.push(oUserCard);

			this.addAggregation("cards", oUserCard, true);

			const items: Control[] = [oUserCard];

			// Add overlay in case of List and Table Card
			const sType = manifest["sap.card"].type;
			if (sType === "Table" || sType === "List") {
				const overlay = new HBox({
					width: this.cardWidth,
					height: "2rem"
				}).addStyleClass("insightsCardOverflowTop");
				const overlayHBoxWrapper = new HBox({
					height: "0"
				}).addStyleClass("sapMFlexBoxJustifyCenter");
				overlayHBoxWrapper.addItem(overlay);
				items.push(overlayHBoxWrapper);
			}

			// Create Wrapper VBox for Card
			const oPreviewVBox = new VBox({
				direction: "Column",
				justifyContent: "Center",
				items: items
			});

			// add VBox as item to GridList
			const sDefaultAggreName = this.cardsContainer.getMetadata().getDefaultAggregationName();
			this.cardsContainer.addAggregation(sDefaultAggreName, oPreviewVBox);
		});
		this.cardsContainer.setBusy(false);
	}

	private _handleEditCards(event: Event) {
		/* If called from Panel Header event.source() will return TilesPanel, if called from Insights Container event.source() will return InsightsContainer.
		_getLayout is available at Container Level*/
		let parent: ManagedObject = event.getSource<CardsPanel>().getParent() || this;
		if (parent?.isA("sap.cux.home.CardsPanel")) {
			parent = parent.getParent() as ManagedObject;
		}
		(parent as InsightsContainer)?._getLayout().openSettingsDialog(SETTINGS_PANELS_KEYS.INSIGHTS_CARDS);
	}

	public handleRemoveActions() {
		this.setProperty("title", "");
		this.setProperty("enableSettings", false);
		this.setProperty("enableFullScreen", false);
		this.removeAllAggregation("actionButtons");
		this.removeAllAggregation("menuItems");
	}

	public handleAddActions() {
		this.setProperty(
			"title",
			`${this._i18nBundle?.getText("insights")} ${this._i18nBundle.getText("insightsCardsTitle")} (${(this._controlModel.getProperty("/userVisibleCards") as ICard[])?.length})`
		);
		this.setProperty("enableSettings", true);
		this.setProperty("enableFullScreen", true);
		this._setupHeader();
	}

	private refreshCards() {
		// This should be done via Host once implemented
		this.aVisibleCardInstances.forEach((card) => card.refreshData());
	}

	private async _handleCardsDnd(oEvent: Event<DropInfo$DropEventParameters>) {
		const sInsertPosition = oEvent.getParameter("dropPosition") as string,
			oDragItem = oEvent.getParameter("draggedControl") as Control,
			iDragItemIndex = (oDragItem.getParent() as GridContainer)?.indexOfItem(oDragItem),
			oDropItem = oEvent.getParameter("droppedControl") as Control,
			iDropItemIndex = (oDragItem.getParent() as GridContainer).indexOfItem(oDropItem);

		this.cardsContainer?.setBusy(true);
		// take the moved item from dragIndex and add to dropindex
		try {
			if (!(this._controlModel.getProperty("/userAllCards") as ICard[]).length) {
				const userAllCardsModel = await this.cardHelperInstance._getUserAllCardModel();
				this._controlModel.setProperty("/userAllCards", userAllCardsModel.getProperty("/cards"));
				await this.updateCardList(sInsertPosition, iDropItemIndex, iDragItemIndex);
			} else {
				await this.updateCardList(sInsertPosition, iDropItemIndex, iDragItemIndex);
			}
		} catch (error) {
			if (error instanceof Error) {
				Log.error(error.message);
			}
			this.cardsContainer?.setBusy(false);
		}
	}

	private async updateCardList(sInsertPosition: string, iDropItemIndex: number, iDragItemIndex: number) {
		const aUserVisibleCards = this._controlModel.getProperty("/userVisibleCards") as ICard[],
			aUserAllCards = this._controlModel.getProperty("/userAllCards") as ICard[],
			sDragedPositionRank = aUserVisibleCards[iDragItemIndex]?.rank,
			sDropedPositionRank = aUserVisibleCards[iDropItemIndex]?.rank;
		let iUpdatedDragItemIndex = aUserAllCards.findIndex((oCard: ICard) => oCard.rank === sDragedPositionRank),
			iUpdatedDropItemIndex = aUserAllCards.findIndex((oCard: ICard) => oCard.rank === sDropedPositionRank);

		if (
			(sInsertPosition === "Before" && iDragItemIndex === iDropItemIndex - 1) ||
			(sInsertPosition === "After" && iDragItemIndex === iDropItemIndex + 1) ||
			iDragItemIndex === iDropItemIndex
		) {
			this.cardsContainer?.setBusy(false);
			return;
		}
		if (sInsertPosition === "Before" && iUpdatedDragItemIndex < iUpdatedDropItemIndex) {
			iUpdatedDropItemIndex--;
		} else if (sInsertPosition === "After" && iUpdatedDragItemIndex > iUpdatedDropItemIndex) {
			iUpdatedDropItemIndex++;
		}
		if (iUpdatedDragItemIndex !== iUpdatedDropItemIndex) {
			const aUpdatedCards = this.cardHelperInstance.handleDndCardsRanking(
				iUpdatedDragItemIndex,
				iUpdatedDropItemIndex,
				aUserAllCards
			);
			await this.cardHelperInstance._updateMultipleCards(aUpdatedCards, "PUT");
			this._sortCardsOnRank(aUserAllCards);
			this._controlModel.setProperty("/userAllCards", aUserAllCards);
			this._controlModel.setProperty(
				"/userVisibleCards",
				aUserAllCards.filter((oCard: ICard) => oCard.visibility)
			);
			await this.rerenderCards();
		} else {
			this.cardsContainer?.setBusy(false);
		}
	}

	private _sortCardsOnRank(aCards: ICard[]) {
		// Sort Cards based on it rank property where rank is a alphanumeric string
		aCards.sort((a, b) => {
			if (a.rank && b.rank) {
				if (a.rank < b.rank) {
					return -1;
				} else if (a.rank > b.rank) {
					return 1;
				}
			}
			return 0;
		});
	}

	private _getPersonalization() {
		const persContainerId = PersonalisationUtils.getPersContainerId(this);
		const ownerComponent = PersonalisationUtils.getOwnerComponent(this) as Component;
		return UShellPersonalizer.getInstance(persContainerId, ownerComponent);
	}

	/**
	 * Updates the recommendation status based on the feature toggle.
	 * @returns {Promise} A promise that resolves when the recommendation status is updated.
	 */
	private async _updateRecommendationStatus() {
		const bRecommendationEnabled = await this.appManagerInstance.isFeatureEnabled(FEATURE_TOGGLES.RECOMMENDATION);
		if (bRecommendationEnabled) {
			if (!this.oPersonalizer) {
				this.oPersonalizer = await this._getPersonalization();
			}
			let oPersData = await this.oPersonalizer.read();
			if (!oPersData) {
				oPersData = {};
			}
			oPersData.showRecommendation = true;
			return this.oPersonalizer.write(oPersData);
		}
	}

	/**
	 * Calculates the number of visible cards that can fit within the available width of the parent container.
	 *
	 * @private
	 * @returns {number} - The number of visible cards.
	 */
	private _calculateVisibleCardCount() {
		const pageDomRef = (this.getParent() as InsightsContainer)._getLayout().getDomRef();
		const deviceType = this.getDeviceType();
		let count = 1;

		if (pageDomRef) {
			const sectionDomRef = pageDomRef.childNodes[0] as Element;
			const domProperties = fetchElementProperties(sectionDomRef, ["width", "padding-left", "padding-right"]);
			const iAvailableWidth = domProperties.width - domProperties["padding-left"] - domProperties["padding-right"];
			let cardWidth = deviceType === DeviceType.Mobile ? 17 : this._calculateCardWidth(iAvailableWidth);

			// Calculate and log the number of cards that can fit
			count =
				deviceType === DeviceType.Mobile ? this.aVisibleCardInstances.length : Math.floor(iAvailableWidth / (cardWidth * 16 + 14));
			this.cardWidth = `${cardWidth}rem`;
		}

		return count;
	}

	/**
	 * Calculates the optimal card width based on the given container width.
	 *
	 * @param {number} containerWidth - The width of the container in which the cards will be placed.
	 * @returns {number} - The calculated card width in rem units.
	 */
	private _calculateCardWidth(containerWidth: number): number {
		const minWidth = 304;
		const maxWidth = 352;
		const margin = 14;
		let count = 1;
		let cardWidth = minWidth;

		//calculate the maximum number of cards that can fit in the container within the range of min and max width
		while (containerWidth / count >= minWidth + margin) {
			cardWidth = containerWidth / count;
			count += 1;
		}
		cardWidth -= margin;
		cardWidth = cardWidth > maxWidth ? maxWidth : cardWidth;
		return cardWidth / 16;
	}

	/**
	 * Adjusts the layout of the cards panel based on the current layout and device type.
	 *
	 * @private
	 * @override
	 */
	public _adjustLayout() {
		const layout = (this.getParent() as InsightsContainer)?._getLayout();
		const isFullScreenEnabled = this.getProperty("enableFullScreen") as boolean;
		let cardWidth = this.cardWidth;

		if (layout && isFullScreenEnabled) {
			const isElementExpanded = layout._getCurrentExpandedElementName() === this.getProperty("fullScreenName");
			const cardCount = isElementExpanded ? this.aVisibleCardInstances.length : this._calculateVisibleCardCount();

			// update cards in viewport
			if (cardCount !== this.cardsInViewport.length) {
				this.cardsInViewport = this.aVisibleCardInstances.slice(0, cardCount);

				const sDefaultAggreName = this.cardsContainer.getMetadata().getDefaultAggregationName();
				this.cardsContainer.removeAllAggregation(sDefaultAggreName);
				this.cardsInViewport.forEach((card) => {
					const manifest = card.getManifest() as ICardManifest;
					const sType = manifest["sap.card"]?.type;
					let overlayHBoxWrapper!: HBox;
					if (sType === "Table" || sType === "List") {
						const overlay = new HBox({
							width: this.cardWidth,
							height: "2rem"
						}).addStyleClass("insightsCardOverflowLayer insightsCardOverflowTop");
						overlayHBoxWrapper = new HBox({
							height: "0"
						}).addStyleClass("sapMFlexBoxJustifyCenter");
						overlayHBoxWrapper.addItem(overlay);
					}
					const cardWrapper = new VBox({
						direction: "Column",
						justifyContent: "Center",
						items: [card]
					});
					if (overlayHBoxWrapper) {
						cardWrapper.addItem(overlayHBoxWrapper);
					}
					const sDefaultAggreName = this.cardsContainer.getMetadata().getDefaultAggregationName();
					this.cardsContainer.addAggregation(sDefaultAggreName, cardWrapper);
				});
			}

			// show/hide Full Screen Button if available
			(this.getParent() as InsightsContainer)?.toggleFullScreenElements(
				this,
				this.aVisibleCardInstances.length > cardCount,
				isElementExpanded
			);
		} else {
			this.cardWidth = this.getDeviceType() === DeviceType.Mobile ? "17rem" : "22rem";
		}

		// update width of cards on resize
		if (cardWidth !== this.cardWidth) {
			this.aVisibleCardInstances.forEach((card) => card.setWidth(this.cardWidth));
			this.cardsContainerSettings?.setColumnSize(this.cardWidth);
		}
	}
}
