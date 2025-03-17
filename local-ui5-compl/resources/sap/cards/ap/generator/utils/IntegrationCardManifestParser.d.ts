/// <reference types="openui5" />
declare module "sap/cards/ap/generator/utils/IntegrationCardManifestParser" {
    import V2ODataModel from "sap/ui/model/odata/v2/ODataModel";
    import V4ODataModel from "sap/ui/model/odata/v4/ODataModel";
    import { QueryParameters } from "sap/cards/ap/generator/helpers/Batch";
    type Model = V2ODataModel | V4ODataModel;
    const getAllValues: (subManifest: Record<string, string>) => string[];
    const getQueryParameters: (values: string[]) => QueryParameters;
    const getHeaderProperties: (cardManifest: CardManifest) => QueryParameters;
    const getContentProperties: (cardManifest: CardManifest) => QueryParameters;
    const getFooterProperties: (cardManifest: CardManifest) => QueryParameters;
}
//# sourceMappingURL=IntegrationCardManifestParser.d.ts.map