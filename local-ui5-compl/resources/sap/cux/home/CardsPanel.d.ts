declare module "sap/cux/home/CardsPanel" {
    import Button from "sap/m/Button";
    import { MetadataOptions } from "sap/ui/base/ManagedObject";
    import BasePanel from "sap/cux/home/BasePanel";
    import { $CardsPanelSettings } from "sap/cux/home/CardsPanel";
    import MenuItem from "sap/cux/home/MenuItem";
    enum cardsMenuItems {
        REFRESH = "cards-refresh",
        EDIT_CARDS = "cards-editCards"
    }
    interface IcardActionEvent {
        getParameter(sParam: string): unknown;
        preventDefault(): void;
    }
    interface Intent {
        target: {
            semanticObject: string;
            action: string;
        };
        params?: {
            [key: string]: string;
        };
    }
    const RECOMMENDATION_PATH = "showRecommendation";
    let runtimeHostCreated: boolean;
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
        static readonly metadata: MetadataOptions;
        private cardHelperInstance;
        private cardsContainer;
        private aVisibleCardInstances;
        menuItems: MenuItem[];
        actionButtons: Button[];
        private _oData;
        private _controlModel;
        private oPersonalizer;
        private appManagerInstance;
        private runtimeHost;
        private cardsContainerSettings;
        private cardWidth;
        private cardHeight;
        private cardsInViewport;
        private oEventBus;
        private _appSwitched;
        constructor(idOrSettings?: string | $CardsPanelSettings);
        constructor(id?: string, settings?: $CardsPanelSettings);
        init(): Promise<void>;
        /**
         * Toggles the activity of cards on route change.
         *
         * @private
         * @returns {void}
         */
        private _toggleCardActivity;
        /**
         * Create imported cards
         * @param {ICardManifest[]} aCards - array of card manifests
         * @returns {any}
         */
        private _createCards;
        /**
         * Retrieves a manifest entry from a card.
         * If the manifest entry is not immediately available, it waits for the manifest to be ready.
         *
         * @param {object} oCard - The card object from which to retrieve the manifest entry.
         * @param {string} sEntry - The manifest entry key to retrieve.
         * @returns {Promise<ICardManifest | undefined>} A promise that resolves with the manifest entry value.
         */
        private _getManifestEntryFromCard;
        private _addRuntimeHost;
        /**
         * Updates parameters for an old card extension
         * @private
         * @param {boolean} bOldCardExtension - Determines whether the card is using an old card extension.
         * @param {IcardActionEvent} oEvent - An event object
         * @param {ICardActionParameters} oParameters - Parameter object
         */
        private _manageOldCardExtension;
        /**
         * Retrieves actions for a card based on its content type.
         *
         * @private
         * @param {IsapCard} manifest - manifest object
         */
        private getContentActions;
        private _importdone;
        private _refreshCardData;
        private _setupHeader;
        renderPanel(): Promise<void>;
        private rerenderCards;
        private _checkForRecommendationCards;
        /**
         * Handle Recommendation Cards
         * @param aRecommendedCards
         * @private
         */
        private _handleRecommendationCards;
        /**
         *
         * @private
         */
        private _showCards;
        private _handleEditCards;
        handleRemoveActions(): void;
        handleAddActions(): void;
        private refreshCards;
        private _handleCardsDnd;
        private updateCardList;
        private _sortCardsOnRank;
        private _getPersonalization;
        /**
         * Updates the recommendation status based on the feature toggle.
         * @returns {Promise} A promise that resolves when the recommendation status is updated.
         */
        private _updateRecommendationStatus;
        /**
         * Calculates the number of visible cards that can fit within the available width of the parent container.
         *
         * @private
         * @returns {number} - The number of visible cards.
         */
        private _calculateVisibleCardCount;
        /**
         * Calculates the optimal card width based on the given container width.
         *
         * @param {number} containerWidth - The width of the container in which the cards will be placed.
         * @returns {number} - The calculated card width in rem units.
         */
        private _calculateCardWidth;
        /**
         * Adjusts the layout of the cards panel based on the current layout and device type.
         *
         * @private
         * @override
         */
        _adjustLayout(): void;
    }
}
//# sourceMappingURL=CardsPanel.d.ts.map