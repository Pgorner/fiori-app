/// <reference types="openui5" />
declare module "sap/cards/ap/common/helpers/ApplicationInfo" {
    /*!
     * SAP UI development toolkit for HTML5 (SAPUI5)
     *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
     */
    import ResourceBundle from "sap/base/i18n/ResourceBundle";
    import Component from "sap/ui/core/Component";
    import { default as V2ODataModel } from "sap/ui/model/odata/v2/ODataModel";
    import { default as V4ODataModel } from "sap/ui/model/odata/v4/ODataModel";
    enum ODataModelVersion {
        V2 = "V2",
        V4 = "V4"
    }
    type ODataModel = V2ODataModel | V4ODataModel;
    type ApplicationInfo = {
        appModel: ODataModel;
        odataModel: ODataModelVersion;
        entitySet: string;
        context: string;
        entitySetWithObjectContext: string;
        componentName: string;
        resourceBundle: ResourceBundle;
        semanticObject: string;
        action: string;
    };
    type ResourceBundleWithURL = ResourceBundle & {
        oUrlInfo: {
            url: string;
        };
    };
    type FetchApplicationInfoOptions = {
        isDesignMode?: boolean;
    };
    type ManifestContentSapCardsAP = {
        embeds: {
            ObjectPage?: {
                default: string;
                manifests: {
                    [key: string]: Array<{
                        localUri: string;
                        hideActions: boolean;
                    }>;
                };
            };
        };
    };
    type AppManifest = {
        "sap.app": {
            id: string;
        };
        "sap.ui5": {};
        "sap.ui": {};
        "sap.fe"?: {};
        "sap.platform.abap"?: {
            uri: string;
        };
        "sap.cards.ap"?: ManifestContentSapCardsAP;
    };
    /**
     * Fetches the details of the application
     *
     * @param {Component} rootComponent - The root component of the application
     * @param {FetchApplicationInfoOptions} fetchOptions
     * @returns {Promise<ApplicationInfo>} The application info
     */
    const fetchApplicationInfo: (rootComponent: Component, fetchOptions?: FetchApplicationInfoOptions) => Promise<ApplicationInfo>;
}
//# sourceMappingURL=ApplicationInfo.d.ts.map