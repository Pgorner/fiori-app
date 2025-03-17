declare module "sap/cards/ap/generator/helpers/Batch" {
    /*!
     * SAP UI development toolkit for HTML5 (SAPUI5)
     *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
     */
    import type { CardManifest } from "sap/ui/integration/widgets/Card";
    import { PropertyInfo } from "sap/cards/ap/generator/odata/ODataTypes";
    import type { Property } from "sap/cards/ap/generator/helpers/CardGeneratorModel";
    type QueryParameters = {
        properties: string[];
        navigationProperties: {
            name: string;
            properties: string[];
        }[];
    };
    type RequestQueryNavigationProperties = {
        name: string;
        properties: Property[];
    };
    type RequestQueryComplexProperties = {
        name: string;
        properties: Property[];
    };
    type RequestQueryParameters = {
        properties: PropertyInfo[];
        navigationProperties: RequestQueryNavigationProperties[];
        complexProperties: RequestQueryComplexProperties[];
    };
    function updateManifestWithSelectQueryParams(cardManifest: CardManifest): void;
    function updateManifestWithExpandQueryParams(cardManifest: CardManifest): void;
    function createUrlParameters(queryParameters: QueryParameters): {
        $select: string;
        $expand: string;
    };
}
//# sourceMappingURL=Batch.d.ts.map