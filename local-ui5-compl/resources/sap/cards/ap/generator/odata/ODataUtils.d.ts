/// <reference path="ODataTypes.d.ts" />
/// <reference path="../helpers/CardGeneratorModel.d.ts" />
/// <reference path="../helpers/Batch.d.ts" />
/// <reference types="openui5" />
declare module "sap/cards/ap/generator/odata/ODataUtils" {
    /*!
     * SAP UI development toolkit for HTML5 (SAPUI5)
     *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
     */
    import type ResourceBundle from "sap/base/i18n/ResourceBundle";
    import type ODataMetaModel from "sap/ui/model/odata/ODataMetaModel";
    import V2ODataModel from "sap/ui/model/odata/v2/ODataModel";
    import type { default as V4ODataMetaModel } from "sap/ui/model/odata/v4/ODataMetaModel";
    import type { default as V4ODataModel } from "sap/ui/model/odata/v4/ODataModel";
    import { PropertyInfo, PropertyInfoType } from "sap/cards/ap/generator/odata/ODataTypes";
    import * as V2MetadataAnalyzer from "sap/cards/ap/generator/odata/v2/MetadataAnalyzer";
    import * as V4MetadataAnalyzer from "sap/cards/ap/generator/odata/v4/MetadataAnalyzer";
    const getLabelForEntitySetV2: typeof V2MetadataAnalyzer.getLabelForEntitySet, getPropertyInfoFromEntityV2: typeof V2MetadataAnalyzer.getPropertyInfoFromEntity, getNavigationPropertyInfoFromEntityV2: typeof V2MetadataAnalyzer.getNavigationPropertyInfoFromEntity, getMetaModelObjectForEntitySetForODataV2: typeof V2MetadataAnalyzer.getMetaModelObjectForEntitySet;
    const getLabelForEntitySetV4: typeof V4MetadataAnalyzer.getLabelForEntitySet, getPropertyInfoFromEntityV4: typeof V4MetadataAnalyzer.getPropertyInfoFromEntity, getNavigationPropertyInfoFromEntityV4: typeof V4MetadataAnalyzer.getNavigationPropertyInfoFromEntity, getMetaModelObjectForEntitySetForODataV4: typeof V4MetadataAnalyzer.getMetaModelObjectForEntitySet;
    const isODataV4Model: (oModel: V2ODataModel | V4ODataModel | undefined) => boolean;
    const fetchDataAsyncV4: (sUrl: string, sPath: string, queryParams: Record<string, string>) => Promise<any>;
    const fetchDataAsyncV2: (sUrl: string, sPath: string, queryParams: Record<string, string>) => Promise<unknown>;
    const fetchDataAsync: (sUrl: string, sPath: string, bODataV4?: boolean, urlParameters?: Record<string, string>) => Promise<any>;
    const getLabelForEntitySet: (oAppModel: V2ODataModel | V4ODataModel | undefined, sEntitySet: string) => any;
    const getPropertyInfoFromEntity: (oAppModel: V2ODataModel | V4ODataModel | undefined, sEntitySet: string, withNavigation: boolean, resourceBundle?: ResourceBundle) => import("sap/cards/ap/generator/odata/ODataTypes").PropertyInfoMap;
    const getNavigationPropertyInfoFromEntity: (oAppModel: V2ODataModel | V4ODataModel | undefined, sEntitySet: string) => import("sap/cards/ap/generator/helpers/CardGeneratorModel").NavigationParameter[];
    const getMetaModelObjectForEntitySet: (metaModel: ODataMetaModel | V4ODataMetaModel, sEntitySet: string, isODataV4Model: boolean) => import("sap/cards/ap/generator/helpers/Batch").RequestQueryParameters;
    function getPropertyLabel(oModel: V2ODataModel | V4ODataModel | undefined, sEntitySet: string, sProperty: string, propertyType?: PropertyInfoType): string | PropertyInfo | import("sap/cards/ap/generator/helpers/CardGeneratorModel").NavigationParameter;
    /**
     * Get the data type of the property mapped with supported data types by integration cards configuration parameters
     * @param propertyType
     */
    function getDataType(propertyType: string): string;
    const createPathWithEntityContext: (path: string, oAppModel: V2ODataModel | V4ODataModel, oDataV4: boolean) => Promise<string>;
    /**
     * Checks if the given data type is of a date type.
     *
     * @param {string} dataType - The data type to check.
     * @returns {boolean} - Returns `true` if the data type is one of "Edm.Date", "Edm.DateTimeOffset", or "Edm.TimeOfDay"; otherwise, returns `false`.
     */
    function isPropertyTypeDate(dataType: string): boolean;
}
//# sourceMappingURL=ODataUtils.d.ts.map