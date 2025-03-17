sap.ui.define([
    "sap/ushell/Container",
    "sap/ushell/iconfonts"
], async function (
    Container, iconfonts
) {
    "use strict";
    iconfonts.registerFiori2IconFont();

    Container.createRendererInternal("fiori2").then(function(oRenderer){
        oRenderer.placeAt("content"); 
    });
});