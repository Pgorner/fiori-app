/// <reference path="CardGeneratorModel.d.ts" />
/// <reference types="openui5" />
declare module "sap/cards/ap/generator/helpers/NavigationProperty" {
    /*!
     * SAP UI development toolkit for HTML5 (SAPUI5)
     *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
     */
    import Component from "sap/ui/core/Component";
    import V2ODataModel from "sap/ui/model/odata/v2/ODataModel";
    import V4ODataModel from "sap/ui/model/odata/v4/ODataModel";
    type Model = V2ODataModel | V4ODataModel;
    /**
     * Fetches the navigation properties with label for a single Navigation property
     * @param rootComponent
     * @param navigationProperty - Name of the navigation property
     * @param path
     */
    function getNavigationPropertiesWithLabel(rootComponent: Component, navigationProperty: string, path: string): Promise<{
        propertiesWithLabel: import("sap/cards/ap/generator/helpers/CardGeneratorModel").Property[];
        navigationPropertyData: any;
    }>;
}
//# sourceMappingURL=NavigationProperty.d.ts.map