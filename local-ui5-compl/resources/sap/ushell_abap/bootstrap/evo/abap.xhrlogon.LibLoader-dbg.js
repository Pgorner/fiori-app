// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell/bootstrap/common/common.debug.mode",
], function (
    DebugMode
) {
    "use strict";

    var pLoadXhrLib = new Promise(function (resolve) {
        var sFileName = "sap/ushell_abap/thirdparty/sap-xhrlib-esm" + (DebugMode.isDebug() ? "-dbg" : "") + ".js";
        var sPath = sap.ui.require.toUrl(sFileName);
        import(sPath).then(function (oModule) {
            resolve(oModule.xhrlib);
        });
    });

    return {
        getLib: function () {return pLoadXhrLib;}
    }
});
