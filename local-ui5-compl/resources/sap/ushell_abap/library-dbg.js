// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/Lib",
    "sap/ui/core/library",
    "sap/m/library"
], function (
    Library,
    coreLib,
    mLib
) {
    "use strict";

    /**
     * SAP library: sap.ushell_abap
     * provides base functions for Fiori launchpad running on SAP NetWeaver ABAP
     *
     * @namespace
     * @name sap.ushell_abap
     * @private
     * @ui5-restricted
     */
    var ushellAbapLib = Library.init({
        name: "sap.ushell_abap",
        version: "1.132.1",
        dependencies: ["sap.ui.core", "sap.m"],
        noLibraryCSS: true,
        extensions: {
            "sap.ui.support": {
                diagnosticPlugins: [
                    "sap/ushell_abap/support/plugins/app-infra/AppInfraOnSapNetWeaverSupportPlugin"
                ]
            }
        }
    });

    return ushellAbapLib;
});
