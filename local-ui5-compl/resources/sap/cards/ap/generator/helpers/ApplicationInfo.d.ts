/// <reference types="openui5" />
declare module "sap/cards/ap/generator/helpers/ApplicationInfo" {
    /*!
     * SAP UI development toolkit for HTML5 (SAPUI5)
     *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
     */
    import Component from "sap/ui/core/Component";
    import V2ODataModel from "sap/ui/model/odata/v2/ODataModel";
    import V4ODataModel from "sap/ui/model/odata/v4/ODataModel";
    type Model = V2ODataModel | V4ODataModel;
    type ObjectPageApplicationInfo = {
        rootComponent: Component;
        floorPlan: string;
        odataModel: string;
        entitySet: string;
        serviceUrl: string;
        entitySetWithObjectContext: string;
        componentName: string;
        semanticObject: string;
        action: string;
    };
    enum ODataModelVersion {
        V2 = "V2",
        V4 = "V4"
    }
    type LibVersionInfo = {
        buildTimestamp: string;
        name: string;
        scmRevision: string;
        version: string;
    };
    class ApplicationInfo {
        static instance: ApplicationInfo | null;
        _oDataModelVersion: ODataModelVersion;
        _rootComponent: Component;
        private constructor();
        static createInstance(rootComponent: Component): ApplicationInfo;
        static getInstance(): ApplicationInfo;
        getRootComponent(): Component;
        fetchDetails(): ObjectPageApplicationInfo;
        validateCardGeneration(): Promise<boolean>;
        /**
         * For testing purposes only
         */
        _resetInstance(): void;
    }
}
//# sourceMappingURL=ApplicationInfo.d.ts.map