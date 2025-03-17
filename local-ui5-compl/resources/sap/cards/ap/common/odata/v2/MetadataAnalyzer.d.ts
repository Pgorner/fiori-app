declare module "sap/cards/ap/common/odata/v2/MetadataAnalyzer" {
    import ODataModel from "sap/ui/model/odata/v2/ODataModel";
    type Property = {
        type: string;
        name: string;
    };
    /**
     * Retrieves property information from an entity set.
     *
     * @param {ODataModel} model - The OData model.
     * @param {string} entitySetName - The name of the entity set.
     * @return {Property[]} - An array of property information.
     */
    const getPropertyInfoFromEntity: (model: ODataModel, entitySetName: string) => Property[];
    /**
     * Retrieves property references from an entity set.
     *
     * @param {ODataModel} model - The OData model.
     * @param {string} entitySetName - The name of the entity set.
     * @return {Property[]} - An array of property references.
     */
    const getPropertyReference: (model: ODataModel, entitySetName: string) => Property[];
}
//# sourceMappingURL=MetadataAnalyzer.d.ts.map