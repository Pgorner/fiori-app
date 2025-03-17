/// <reference types="openui5" />
declare module "sap/cards/ap/generator/odata/v2/MetadataAnalyzer" {
    /*!
     * SAP UI development toolkit for HTML5 (SAPUI5)
     *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
     */
    import ResourceBundle from "sap/base/i18n/ResourceBundle";
    import ODataMetaModel, { EntityType } from "sap/ui/model/odata/ODataMetaModel";
    import ODataModel from "sap/ui/model/odata/v2/ODataModel";
    import type { RequestQueryParameters } from "sap/cards/ap/generator/helpers/Batch";
    import type { NavigationParameter, Property } from "sap/cards/ap/generator/helpers/CardGeneratorModel";
    import { PropertyInfo, PropertyInfoMap } from "sap/cards/ap/generator/odata/ODataTypes";
    const Annotatations: {
        label: string;
        isPotentiallySensitive: string;
        isoCurrency: string;
        unit: string;
    };
    function getNavigationPropertyInfoFromEntity(oModel: ODataModel, sEntitySet: string): NavigationParameter[];
    function getPropertyInfoFromEntity(model: ODataModel, entitySet: string, withNavigation: boolean, resourceModel?: ResourceBundle): PropertyInfoMap;
    function getEntityTypeFromEntitySet(oMetaModel: ODataMetaModel, sEntitySet: string): EntityType | undefined;
    function mapProperties(properties: any[]): Property[];
    function isPropertySensitive(oMetaModel: ODataMetaModel, oEntityType: EntityType, oProperty: any): boolean;
    function mapPropertyInfo(oProperty: any, withNavigation: boolean): PropertyInfo;
    function checkForDateType(property: PropertyInfo | Property): boolean;
    function getLabelForEntitySet(oModel: ODataModel, sEntitySet: string): any;
    function getPropertyReference(oModel: ODataModel, entitySetName: string): PropertyInfo[];
    function getMetaModelObjectForEntitySet(metaModel: ODataMetaModel, entitySetName: string): RequestQueryParameters;
}
//# sourceMappingURL=MetadataAnalyzer.d.ts.map