/// <reference types="openui5" />
declare module "sap/cards/ap/generator/helpers/IntegrationCardHelper" {
    import Component from "sap/ui/core/Component";
    import { CardManifest } from "sap/ui/integration/widgets/Card";
    import JSONModel from "sap/ui/model/json/JSONModel";
    import ResourceModel from "sap/ui/model/resource/ResourceModel";
    import { ArrangementOptions } from "sap/cards/ap/generator/app/controls/ArrangementsEditor";
    import { PropertyInfoMap } from "sap/cards/ap/generator/odata/ODataTypes";
    import type { CriticalityOptions, SideIndicatorOptions, TrendOptions } from "sap/cards/ap/generator/helpers/CardGeneratorModel";
    import type { FormatterConfiguration, FormatterConfigurationMap } from "sap/cards/ap/generator/helpers/Formatter";
    type ParsedManifest = {
        title: string;
        subtitle: string;
        headerUOM: string;
        mainIndicatorOptions: {
            mainIndicatorStatusKey: string;
            criticalityOptions: Array<object>;
            mainIndicatorNavigationSelectedKey: string;
            navigationValue: string;
            trendOptions: TrendOptions;
        };
        sideIndicatorOptions: SideIndicatorOptions;
        groups: Array<object>;
        formatterConfigurationFromCardManifest: FormatterConfigurationMap;
        textArrangementsFromCardManifest: Array<ArrangementOptions>;
    };
    let manifest: CardManifest;
    const formatterConfigurationFromCardManifest: FormatterConfigurationMap;
    function createInitialManifest(props: any): CardManifest;
    function getObjectPageContext(): string;
    function getHeaderBatchUrl(): string;
    function getContentBatchUrl(): string;
    function getCurrentCardManifest(): CardManifest;
    /**
     * Render integration card preview
     *
     * @param {CardManifest} newManifest
     */
    function renderCardPreview(newManifest: CardManifest, oModel?: JSONModel): void;
    function updateCardGroups(oModel: JSONModel): void;
    /**
     *  Resolves the card header properties from stored manifest
     *  - If path is a string, return the resolved i18n text
     * 	- If path is an expression, resolve the expression then return the labelWithValue of the property
     *  - If path is an expression with formatter, update the formatter configuration and return the labelWithValue of the property
     * @param path
     * @param resourceModel
     * @param properties
     * @returns
     */
    function resolvePropertyLabelFromExpression(path: string, resourceModel: ResourceModel, properties: PropertyInfoMap): any;
    function getMainIndicator(mManifest: CardManifest): {
        mainIndicatorStatusKey: string;
        mainIndicatorNavigationSelectedKey: string;
        criticalityOptions: CriticalityOptions[];
        navigationValue: string;
        trendOptions: TrendOptions;
    };
    /**
     * Updates the criticality options based on the groups in the provided CardManifest.
     * @param {CardManifest} mManifest - The card manifest containing the groups and their items.
     * @param {CriticalityOptions[]} criticalityOptions - An array of criticality options to be updated.
     */
    function updateCriticalityBasedOnGroups(mManifest: CardManifest, criticalityOptions: CriticalityOptions[]): void;
    /**
     * Update the criticality options
     * @param criticalityOptions
     * @param criticalityConfig
     */
    function updateCriticalityOptions(criticalityOptions: CriticalityOptions[], criticalityConfig: CriticalityOptions): void;
    /**
     * Gets the criticality state for a group based on the provided state string.
     *
     * This function checks if the state has a formatter associated with it.
     * If so, it processes the formatter and returns its property in a specific format.
     * If the state corresponds to a known criticality state, it returns the corresponding
     * color indicator. If the state is not recognized, it defaults to the 'None' indicator.
     *
     * @param {string} state - The state string to evaluate for criticality.
     * @returns {string} - The criticality state as a string based on the ColorIndicator enum.
     *                    Possible return values include:
     *                    - ColorIndicator.Error
     *                    - ColorIndicator.Success
     *                    - ColorIndicator.None
     *                    - ColorIndicator.Warning
     */
    function getCriticallityStateForGroup(state: string): string;
    function getSideIndicators(mManifest: CardManifest): SideIndicatorOptions;
    function handleFormatter(formatter: FormatterConfiguration): void;
    function getGroupItemValue(value: string, mManifest: CardManifest): string;
    function getCardGroups(mManifest: CardManifest, resourceModel: ResourceModel): any;
    /**
     * This is a fix for cards which are generated without "sap.insights" manifest property or with cardType as "DT".
     *  - When the card is regenerated "sap.insight" property will be set/updated existing in the manifest.
     *
     * @param mCardManifest
     * @param rootComponent
     * @returns
     */
    function enhanceManifestWithInsights(mCardManifest: CardManifest | undefined, rootComponent: Component): Promise<void>;
    /**
     * Enhance the card manifest configuration parameters with property formatting configuration
     * 	- add text arrangements properties
     *
     * @param mCardManifest
     * @param oDialogModel
     */
    function enhanceManifestWithConfigurationParameters(mCardManifest: CardManifest, oDialogModel: JSONModel): void;
    /**
     * Adds query parameters to the URLs in the manifest's batch request.
     *
     * @param {CardManifest} cardManifest - The card manifest.
     * @returns {CardManifest} A copy of the original card manifest with query parameters added to the URLs.
     */
    const addQueryParametersToManifest: (cardManifest?: CardManifest) => CardManifest;
    const updateConfigurationParametersWithKeyProperties: (cardManifest: CardManifest, data: Record<string, any>) => void;
    /**
     * Updates the data path of the card header in the provided card manifest by reference.
     *
     * @param {CardManifest} cardManifest - The card manifest object that contains the header data.
     */
    function updateHeaderDataPath(cardManifest: CardManifest): void;
    /**
     * This method is used to perform updates on existing integration card manifest.
     * Updates will include adding,
     * 	- Query parameters to the URLs in the target manifest's batch request.
     * 	- sap.app.id to the manifest.
     * @param cardManifest
     */
    const updateExistingCardManifest: (cardManifest?: CardManifest, data: Record<string, any>) => CardManifest | undefined;
    function parseCard(integrationCardManifest: CardManifest, resourceModel: ResourceModel, properties: PropertyInfoMap): ParsedManifest;
}
//# sourceMappingURL=IntegrationCardHelper.d.ts.map