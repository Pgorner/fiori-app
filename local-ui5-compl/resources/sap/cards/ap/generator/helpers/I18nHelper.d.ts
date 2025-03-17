/// <reference types="openui5" />
declare module "sap/cards/ap/generator/helpers/I18nHelper" {
    import { AdaptiveCardAction, CardManifest } from "sap/ui/integration/widgets/Card";
    import ResourceModel from "sap/ui/model/resource/ResourceModel";
    type I18nObject = {
        [key: string]: string;
    };
    type I18nClassifications = {
        [key: string]: string;
    };
    type I18nProperty = {
        comment: string;
        key: string;
        value: string;
    };
    type ManifestPartial = {
        [key: string]: ManifestPartial | string | number | boolean | undefined;
    };
    let i18nMap: I18nObject;
    let i18nPayload: Array<I18nProperty>;
    const I18nClassificationsMap: I18nClassifications;
    /**
     * This function checks if the property value has a binding
     *
     * @param {string} propertyValue
     * @returns {boolean}
     */
    function hasBinding(propertyValue: string): boolean;
    /**
     * Function to check if the given data is of type JSON or not
     *
     * @param value
     * @returns
     */
    function isJSONData(value: string): boolean;
    /**
     * This function gets the property value from the card manifest/sub-manifest
     * - In case if the property value is an object then return the object
     * - In case if the property value is not an object then return the object and key
     * - Added handling for keys with multiple dots should be passsed as "parameters.[com/sap/property].name"
     *
     * @param {object} obj The  object
     * @param {string} key
     * @returns {object}
     */
    function getPropertyValue(partialManifest: ManifestPartial, key: string): string | number | boolean | ManifestPartial;
    /**
     * This function sets i18n values to a map
     *  - In case if it is a new key create a key in map.
     *  - In case if it is an existsinig one update it.
     *
     * @param {string} key
     * @param {string} value
     * @param {string} text
     */
    function seti18nValueToMap(key: string, value: string, text?: string): void;
    /**
     * This function updates i18n keys to card manifest
     *
     * @param {object} integrationCardManifest The manifest object
     */
    function inserti18nKeysManifest(integrationCardManifest: CardManifest): void;
    /**
     * Gets the text classification for given i18n key and value
     *
     * @param {string} keyType Type of key
     * @param {string} comment The comments which needs to be added
     * @returns {string} The text classification string
     */
    function textClassification(keyType: string, comment: string): string;
    /**
     * This function sets i18n payload to an array
     *
     * @param {string} text
     * @param {string} key
     * @param {string} type
     * @param {string} description
     * @param {string} groupPath
     */
    function inserti18nPayLoad(text: string, key: string, type: string, description: string, groupPath?: string): void;
    /**
     * This function will create an ajax call to save i18n payload
     */
    function writei18nPayload(): void;
    /**
     * This function resets i18nPayload and i18nMap
     *
     */
    function reseti18nProperties(): void;
    /**
     *
     * Creates i18n keys for the action parameters of an adaptive card action.
     *
     * For each action parameter the label value will be different so i18n key will be created for each action parameter label.
     * The placeholder and error message will be the same for all action parameters so i18n key will be created only once.
     *
     * @param {number} index - The index of the current action in the adaptive card actions array.
     * @param {string} actionPath - The path to the current action in the configuration parameters.
     * @param {AdaptiveCardAction} [adaptiveCardAction] - The adaptive card action object containing action parameters.
     */
    function createi18nKeysForActionParameters(index: number, actionPath: string, adaptiveCardAction?: AdaptiveCardAction): void;
    /**
     *
     * Creates i18n keys for card actions based on the card manifest.
     *
     * Takes care of creating i18n key for the action label and the OK button text which will be used when action type is Submit.
     * The action text for Integration card is also replaced with same i18n key that is created for the adaptive card action.
     *
     * @param {CardManifest} cardManifest - The card manifest.
     */
    function createI18nKeysForCardActions(cardManifest: CardManifest): void;
    /**
     * This function creates i18n keys from modal data
     *  - In case if text does not start with "{" create a key and set key and value to i18n map, also upload the i18n payload to the array.
     *  - In case if it is already a key then no need to create a new key.
     *
     * @param {CardManifest} cardManifest
     */
    function createKeysFromManifestData(cardManifest: CardManifest): void;
    /**
     * This function creates i18n keys from manifest group data
     *  - In case if text does not start with "{" create a key and set key and value to i18n map, also upload the i18n payload to the array.
     *  - In case if it is already a key then no need to create a new key.
     *
     * @param {string} configurationItem
     * @param {number} itemIndex
     * @param {number} groupIndex
     * @param {string} type
     */
    function createKeysFromGroup(configurationItem: string, itemIndex: number, groupIndex: number, type: string): void;
    function updateManifestAppProperties(manifest: CardManifest): void;
    /**
     * This function resolves i18n text from resource model
     * - In case if key exists in resource model then return the object from resource model
     * - In case if key does not exist in resource model then return the key
     * @param key
     */
    function resolveI18nTextFromResourceModel(key: string, resourceModel: ResourceModel): any;
    /**
     * This function creates i18n keys from card manifest data and stores it in i18n map and i18n payload
     * - Further it will update manifest with i18n keys
     * - and create an ajax call to save i18n payload
     * @param cardManifest
     */
    function createAndStoreGeneratedi18nKeys(cardManifest: CardManifest): void;
}
//# sourceMappingURL=I18nHelper.d.ts.map