// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell/iconfonts",
    "sap/ushell/Container"
], async function (
    iconfonts,
    Container
) {
    "use strict";
    iconfonts.registerFiori2IconFont();

    const oContent = await Container.createRendererInternal(null);
    oContent.placeAt("canvas");
});
