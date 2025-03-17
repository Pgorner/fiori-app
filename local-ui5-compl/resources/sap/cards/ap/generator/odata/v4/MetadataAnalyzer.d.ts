/// <reference types="openui5" />
declare module "sap/cards/ap/generator/odata/v4/MetadataAnalyzer" {
    /*!
     * SAP UI development toolkit for HTML5 (SAPUI5)
     *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
     */
    import ResourceBundle from "sap/base/i18n/ResourceBundle";
    import ODataMetaModel from "sap/ui/model/odata/v4/ODataMetaModel";
    import type ODataModel from "sap/ui/model/odata/v4/ODataModel";
    import type { RequestQueryParameters } from "sap/cards/ap/generator/helpers/Batch";
    import { EntityType, NavigationParameter } from "sap/cards/ap/generator/helpers/CardGeneratorModel";
    import { PropertyInfo } from "sap/cards/ap/generator/odata/ODataTypes";
    const Annotations: {
        label: string;
        isPotentiallySensitive: string;
        isoCurrency: string;
        unit: string;
    };
    function getNavigationPropertyInfoFromEntity(model: ODataModel, entitySetName: string): NavigationParameter[];
    function createNavigationObject(entityType: EntityType, entityTypeName: string, metaModel: ODataMetaModel): PropertyInfo[];
    function getPropertyInfoFromEntity(oModel: ODataModel, sEntitySet: string, withNavigation?: boolean, resourceModel?: ResourceBundle): PropertyInfo[];
    function getLabelForEntitySet(oModel: ODataModel, sEntitySet: string): any;
    function getPropertyReferenceKey(oAppModel: ODataModel, entitySetName: string): PropertyInfo[];
    function getPropertiesFromEntityType(metaModel: ODataMetaModel, entityType: EntityType, entityTypeName: string): PropertyInfo[];
    function getMetaModelObjectForEntitySet(metaModel: ODataMetaModel, entitySetName: string): RequestQueryParameters;
}
//# sourceMappingURL=MetadataAnalyzer.d.ts.map