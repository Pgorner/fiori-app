declare module "sap/cards/ap/common/services/RetrieveCard" {
    import Component from "sap/ui/core/Component";
    import type { CardManifest } from "sap/ui/integration/widgets/Card";
    import { AppManifest, ApplicationInfo } from "sap/cards/ap/common/helpers/ApplicationInfo";
    /**
     * The card types
     *
     * @alias sap.cards.ap.common.services.RetrieveCard.CardTypes
     * @private
     * @restricted sap.fe, sap.ui.generic.app
     */
    enum CardTypes {
        /**
         * Integration card
         * @restricted sap.fe, sap.ui.generic.app
         */
        INTEGRATION = "integration",
        /**
         * Adaptive card
         * @restricted sap.fe, sap.ui.generic.app
         */
        ADAPTIVE = "adaptive"
    }
    type CardHostParam = {
        componentName: string;
        entitySet: string;
        cardType?: CardTypes;
    };
    type SelectionVariantJSON = {
        SelectionVariantID?: string;
        PresentationVariantID?: string;
        Text?: string;
        ODataFilterExpression?: string;
        Version?: string;
        FilterContextUrl?: string;
        ParameterContextUrl?: string;
    };
    /**
     * The options for fetching the card manifest
     *
     * @alias sap.cards.ap.common.services.RetrieveCard.CardManifestFetchOptions
     * @private
     * @restricted sap.fe, sap.ui.generic.app
     */
    type CardManifestFetchOptions = {
        /**
         * Defines the card type
         * @restricted sap.fe, sap.ui.generic.app
         */
        cardType?: CardTypes;
        /**
         * Defines include actions
         * @restricted sap.fe, sap.ui.generic.app
         */
        includeActions?: boolean;
        /**
         * Defines the hide Actions
         */
        hideActions?: boolean;
        /**
         * Checks whether the app is running in design mode or not will be used to invalidate resource bundle cache and for other design time specific operations
         */
        isDesignMode?: boolean;
    };
    type KeyParameter = {
        key: string;
        formattedValue: string;
    };
    /**
     * Fetches the card path from the application manifest
     *
     * @param {CardType} type - The type of card
     * @param {string} entitySet - The entity set
     * @param {AppManifest} applicationManifest - The application manifest
     * @returns The card path
     */
    const getCardPath: (type: CardTypes, entitySet: string, applicationManifest: AppManifest) => string;
    /**
     * clean up the unnecessary variant information
     *
     * @param selectionVariant
     * @returns
     */
    const cleanupVariantInformation: (selectionVariant: SelectionVariantJSON) => SelectionVariantJSON;
    /**
     * Fetches the manifest from the given url
     *
     * @param {string} url - The url of the manifest
     * @returns The manifest
     */
    const fetchManifest: (url: string) => Promise<any>;
    /**
     * Fetches the card manifest for the object page
     *
     * @param {Component} appComponent
     * @param {CardHostParam} hostOptions
     * @param {Boolean} isDesignMode
     * @returns The card manifest
     * @private
     */
    const _getObjectPageCardManifest: (appComponent: Component, hostOptions: CardHostParam, isDesignMode?: boolean) => Promise<any>;
    /**
     * Add actions to the card header
     *  - ibnTarget contains the semantic object and action
     *  - ibnParams contains the context parameters and sap-xapp-state-data - which is the stringified selection variant of the context parameters
     *
     * @param cardManifest
     * @param applicationInfo
     */
    const addActionsToCardHeader: (cardManifest: CardManifest, applicationInfo: ApplicationInfo) => Promise<void>;
    /**
     * Checks if the leanDT card exists in the application at runtime or not
     *
     * @param appComponent
     * @param isDesignMode
     * @returns boolean
     */
    const checkIfCardExists: (appComponent: Component, isDesignMode?: boolean) => boolean;
    /**
     * Function to handle the hide actions for the card
     *
     * @param appComponent
     * @param mManifest
     */
    const handleHideActions: (appComponent: Component, mManifest: CardManifest) => void;
    /**
     * Fetches key parameters for the given application component.
     *
     * @param {Component} appComponent - The application component.
     * @returns {Promise<KeyParameter[]>} - A promise that resolves to an array of key parameters.
     */
    const getKeyParameters: (appComponent: Component) => Promise<KeyParameter[]>;
    /**
     * Updates the data path of the card header in the provided card manifest by reference.
     *
     * @param {CardManifest} cardManifest - The card manifest object that contains the header data.
     */
    function updateHeaderDataPath(cardManifest: CardManifest): void;
    /**
     * Fetches the card manifest for the object page
     *
     * @param {Component} appComponent The root component of the application
     * @param {CardManifestFetchOptions} fetchOptions The options
     * @returns {Promise<any>} The card manifest
     * @private
     * @since 1.124.0
     * @restricted sap.fe, sap.ui.generic.app
     */
    const getObjectPageCardManifestForPreview: (appComponent: Component, fetchOptions?: CardManifestFetchOptions) => Promise<any>;
}
//# sourceMappingURL=RetrieveCard.d.ts.map