// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

if (!window["sap-ushell-config"]) {
    window["sap-ushell-config"] = {};
}
const config = window["sap-ushell-config"];

if (!config.applications) {
    config.applications = {};
}

config.applications["Action-toVerticalization"] = {
    additionalInformation: "SAPUI5.Component=sap.ushell.demo.textverticalization",
    applicationType: "URL",
    url: "../../../../../test-resources/sap/ushell/demoapps/TextVerticalizationSample",
    title: "Verticalization",
    description: "Sample App"
};
