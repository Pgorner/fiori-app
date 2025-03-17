declare module "sap/cards/ap/common/odata/ODataUtils" {
    import { default as V2ODataModel } from "sap/ui/model/odata/v2/ODataModel";
    import { default as V4ODataModel } from "sap/ui/model/odata/v4/ODataModel";
    import { Property, SemanticKey } from "sap/cards/ap/common/odata/v4/MetadataAnalyzer";
    /**
     * Retrieves context properties for OData V2.
     *
     * @param path - The path to retrieve context properties for.
     * @param model - The application model.
     * @param entitySetName - The entity set name.
     * @returns An array of context properties.
     */
    const getContextPropertiesForODataV2: (path: string, model: V2ODataModel, entitySetName: string) => string[];
    /**
     * Matches semantic keys with reference keys.
     *
     * @param semanticProperties - The semantic properties.
     * @param referenceKeys - The reference keys.
     * @returns A boolean indicating if the keys match.
     */
    const matchSemanticKeysWithReferenceKeys: (semanticProperties: string[], referenceKeys: string[]) => boolean;
    /**
     * Retrieves properties using semantic keys from an OData model.
     *
     * @param {V4ODataModel} model - The OData model instance.
     * @param {string} entitySetName - The name of the entity set.
     * @param {string[]} contextProperties - The context properties.
     * @param {SemanticKey[]} semanticKeys - The semantic keys.
     * @param {string[]} referenceKeys - The reference keys to be selected.
     * @param {{ name: string, type: string }[]} propertyReferenceKey - The property reference keys with their types.
     * @returns {Promise<string[]>} A promise that resolves to an array of formatted property reference keys or the original context properties.
     */
    const getPropertiesUsingSemanticKeys: (model: V4ODataModel, entitySetName: string, contextProperties: string[], semanticKeys: SemanticKey[], referenceKeys: string[], propertyReferenceKey: {
        name: string;
        type: string;
    }[]) => Promise<string[]>;
    /**
     * Handles a single property in the context of OData.
     *
     * If there is only one property in the object context and it is not a semantic key,
     * then it is assumed to be a GUID. The function updates the context properties accordingly.
     *
     * @param propertyReferenceKey - An array of properties to reference.
     * @param contextProperties - An array of context properties to be updated.
     */
    const handleSingleProperty: (propertyReferenceKey: Property[], contextProperties: string[]) => string[];
    /**
     * Adds the "IsActiveEntity=true" property to the context properties if it is not already present.
     *
     * @param contextProperties - An array of context property strings.
     * @param propertyReferenceKey - An array of objects containing property name and type.
     * @returns The updated array of context property strings.
     */
    const addIsActiveEntityProperty: (contextProperties: string[], propertyReferenceKey: {
        name: string;
        type: string;
    }[]) => string[];
    /**
     * Retrieves context properties for OData V4.
     *
     * @param model - The application model.
     * @param entitySetName - The entity set name.
     * @param propertyPath - The property path.
     * @returns A promise that resolves to an array of context properties.
     */
    const getContextPropertiesForODataV4: (model: V4ODataModel, entitySetName: string, propertyPath: string) => Promise<string[]>;
    /**
     * Creates context parameters based on the given path, app model, and OData version.
     *
     * @param path - The path to create context parameters for.
     * @param model - The application model.
     * @param oDataV4 - A boolean indicating if OData V4 is used.
     * @returns A promise that resolves to a string of context parameters.
     */
    const createContextParameter: (path: string, model: V2ODataModel | V4ODataModel, oDataV4: boolean) => Promise<string>;
    /**
     * Helper function to fetch data from the given URL. This function is used to fetch data from the OData V4 service.
     *
     * @param url - The URL to fetch data from.
     * @param path - The path to fetch data for.
     * @param urlParameters - The URL parameters.
     * @returns A promise that resolves to the fetched data.
     */
    const fetchDataAsync: (url: string, path: string, urlParameters?: Record<string, string>) => Promise<any>;
}
//# sourceMappingURL=ODataUtils.d.ts.map