/// <reference types="openui5" />
declare module "sap/cards/ap/common/odata/v4/MetadataAnalyzer" {
    /*!
     * SAP UI development toolkit for HTML5 (SAPUI5)
     *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
     */
    import type ODataMetaModel from "sap/ui/model/odata/v4/ODataMetaModel";
    import type ODataModel from "sap/ui/model/odata/v4/ODataModel";
    type Property = {
        type: string;
        name: string;
    };
    type SemanticKey = {
        $PropertyPath: string;
    };
    type MetaModelEntityType = {
        $Type: string;
        $Key: string[];
    } & {
        [K: string]: MetaModelProperty | MetaModelNavProperty;
    };
    type MetaModelProperty = {
        $Name: string;
        $kind: string;
        $Type: string;
    };
    type MetaModelNavProperty = {
        $kind: string;
        $Type: string;
        $isCollection: boolean;
    };
    /**
     * Retrieves property information from a given entity set in the OData model.
     *
     * @param model - The OData model instance.
     * @param entitySetName - The name of the entity set.
     * @returns An array of properties with their types and names.
     */
    const getPropertyInfoFromEntity: (model: ODataModel, entitySetName: string) => Property[];
    /**
     * Retrieves the key properties of a given entity set in the OData model.
     *
     * @param model - The OData model instance.
     * @param entitySetName - The name of the entity set.
     * @returns An array of key properties with their types and names.
     */
    const getPropertyReferenceKey: (model: ODataModel, entitySetName: string) => Property[];
    /**
     * Extracts properties from a given entity type.
     *
     * @param entityType - The entity type object.
     * @returns An array of properties with their types and names.
     */
    const extractPropertiesFromEntityType: (entityType: MetaModelEntityType) => Property[];
    /**
     * Retrieves the semantic keys of a given entity set from the OData meta model.
     *
     * @param metaModel - The OData meta model instance.
     * @param entitySetName - The name of the entity set.
     * @returns An array of semantic keys.
     */
    function getSemanticKeys(metaModel: ODataMetaModel, entitySetName: string): SemanticKey[];
}
//# sourceMappingURL=MetadataAnalyzer.d.ts.map