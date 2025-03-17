// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell/iconfonts",
    "sap/ushell/services/AppConfiguration",
    "sap/ushell/Container"
], function (
    iconfonts,
    AppConfiguration,
    Container
) {
    "use strict";
    iconfonts.registerFiori2IconFont();

    Container.createRendererInternal(null).then(function (oContent) {
        oContent.placeAt("canvas");
    });
});
