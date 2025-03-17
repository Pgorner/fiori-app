// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
sap.ui.define([
    "./boottask",
    "sap/ushell_abap/pbServices/ui2/contracts/bag",
    "sap/ushell_abap/pbServices/ui2/contracts/configuration",
    "sap/ushell_abap/pbServices/ui2/contracts/configurationUi",
    "sap/ushell_abap/pbServices/ui2/contracts/fullscreen",
    "sap/ushell_abap/pbServices/ui2/contracts/preview",
    "sap/ushell_abap/pbServices/ui2/contracts/visible",
    "sap/ushell_abap/pbServices/ui2/contracts/refresh",
    "sap/ushell_abap/pbServices/ui2/contracts/search",
    "sap/ushell_abap/pbServices/ui2/contracts/url",
    "sap/ushell_abap/pbServices/ui2/contracts/actions",
    "sap/ushell_abap/pbServices/ui2/contracts/types"
], function (
    Boottask
    // ui2ContractsBag,
    // ui2Configuration,
    // ui2ConfigurationUi,
    // ui2Fullscreen,
    // ui2Preview,
    // ui2Visible,
    // ui2Refresh,
    // ui2Search,
    // ui2Url,
    // ui2Actions,
    // ui2Types
) {
    "use strict";
    return function () {
        sap.ui.require([
            "sap/ushell/Container",
            "sap/ushell/iconfonts",
            "sap/ushell/state/StateManager"
        ], function (
            Container,
            IconFonts,
            StateManager
        ) {

            // shortcut for sap.ushell.state.StateManager.ShellMode
            const ShellMode = StateManager.ShellMode;

            Container.createRendererInternal("fiori2").then(function (oContent) {
                oContent.placeAt("canvas", "only");
                var oSystem = Container.getLogonSystem();
                const sCurrentShellMode = StateManager.getShellMode();

                if (!oSystem.getSysInfoBar() || sCurrentShellMode === ShellMode.Headerless) {
                    return;
                }

                sap.ui.require([
                    "sap/ushell/renderer/ShellLayout",
                    "sap/ushell/ui/shell/SysInfoBar"
                ], function (ShellLayout, SysInfoBar) {
                    var sSystemInfoHtml = "<div id='systemInfo-shellArea'></div>";
                    var oShellHeaderShellArea = document.getElementById(ShellLayout.ShellArea.ShellHeader);
                    oShellHeaderShellArea.insertAdjacentHTML("beforebegin", sSystemInfoHtml);

                    new SysInfoBar({
                        icon: oSystem.getSysInfoBarIcon(),
                        text: oSystem.getSysInfoBarMainText(),
                        subText: oSystem.getSysInfoBarSecondaryText(),
                        color: oSystem.getSysInfoBarColor()
                    }).placeAt("systemInfo-shellArea");
                });
            });
            IconFonts.registerFiori2IconFont();
        });
        Boottask.afterBootstrap();
    };
});
