/// <reference types="openui5" />
declare module "sap/cards/ap/generator/helpers/Transpiler" {
    import JSONModel from "sap/ui/model/json/JSONModel";
    type AdaptiveCardData = {
        [key: string]: string | DateObject;
    };
    type DateObject = {
        __edmType: string;
        [key: string]: unknown;
    };
    /**
     * Transpiles an Integration Card into an Adaptive Card.
     *
     * @param {JSONModel} oDialogModel - The Integration Card to transpile.
     * @returns {AdaptiveCard} The resulting Adaptive Card.
     * @throws {TranspilationError} If the Integration Card cannot be transpiled.
     */
    function transpileIntegrationCardToAdaptive(oDialogModel: JSONModel): void;
    /**
     * Function to update &minus; strings in the rendered card textblock to '-'
     * as JS Engine will not understand &minus; and will not render it to '-'.
     *
     * @param renderedCard
     */
    function updateEmptyStrings(renderedCard: HTMLElement): void;
    /**
     * Iterates over the properties of the given adaptive card data object and processes each key.
     *
     * @param {AdaptiveCardData} adaptiveCardData - The adaptive card data object to iterate over.
     * @returns {void}
     */
    function iterateObject(adaptiveCardData: AdaptiveCardData): void;
    /**
     * Processes a key in the adaptive card data object. If the value associated with the key is an object
     * and has a valid EDM type, it converts the value to an ISO string if possible. It also recursively
     * iterates over the object if the value is an object.
     *
     * @param {AdaptiveCardData} adaptiveCardData - The adaptive card data object containing the key to process.
     * @param {string} key - The key in the adaptive card data object to process.
     */
    function processKey(adaptiveCardData: AdaptiveCardData, key: string): void;
}
//# sourceMappingURL=Transpiler.d.ts.map