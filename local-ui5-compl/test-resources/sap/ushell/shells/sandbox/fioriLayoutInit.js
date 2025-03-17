// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell/renderer/ShellLayout"
], function (
    ShellLayout
) {
    "use strict";

    ShellLayout.applyLayout("canvas");

    // ABAP SystemInfo
    var sSystemInfoHtml = "<div id='systemInfo-shellArea'></div>";
    var oShellHeaderShellArea = document.getElementById(ShellLayout.ShellArea.ShellHeader);
    oShellHeaderShellArea.insertAdjacentHTML("beforebegin", sSystemInfoHtml);

    // HelpContent WebAssistant/ SAP Companion
    var sHelpContentHtml = "<div id='helpContent'></div>";
    var oHelpContentShellArea = document.getElementById(ShellLayout.ShellArea.HelpContent);
    oHelpContentShellArea.insertAdjacentHTML("afterbegin", sHelpContentHtml);
});
