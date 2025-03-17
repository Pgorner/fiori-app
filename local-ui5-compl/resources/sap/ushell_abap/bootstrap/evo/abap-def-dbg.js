// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
sap.ui.define([
    "./abap.configure.ushell",
    "./abap.configure.theme",
    "./abap.load.launchpad",
    "./boottask",
    "sap/ushell/bootstrap/common/common.configure.ui5",
    "sap/ushell/bootstrap/common/common.configure.ui5.extractLibs",
    "sap/ushell/bootstrap/common/common.load.bootstrapExtension",
    "sap/ushell/bootstrap/common/common.debug.mode",
    "sap/ushell/bootstrap/common/common.load.core-min"
], function (
    fnConfigureUshell,
    fnConfigureTheme,
    fnLoadLaunchpad,
    oBoottask,
    fnConfigureUi5,
    fnExtractUi5LibsFromUshellConfig,
    fnLoadBootstrapExtension,
    oDebugMode,
    oCoreMinLoader
) {
    "use strict";

    window["sap-ui-debug"] = oDebugMode.isDebug(); //use in LaunchPageAdapter
    const oUShellConfig = fnConfigureUshell();
    const {theme, themeRoots} = fnConfigureTheme(oUShellConfig);

    fnConfigureUi5({
        ushellConfig: oUShellConfig,
        libs: fnExtractUi5LibsFromUshellConfig(oUShellConfig),
        theme: theme,
        themeRoots: themeRoots,
        platform: "abap",
        platformAdapters: {
                abap: "sap.ushell_abap.adapters.abap",
                hana: "sap.ushell_abap.adapters.hana"
            },
        bootTask: oBoottask.start,
        onInitCallback: fnLoadLaunchpad
    });

    oCoreMinLoader.load(oUShellConfig.ushell.customPreload);
    fnLoadBootstrapExtension(oUShellConfig);
});
