// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
sap.ui.require([
    "sap/ui/Device",
    "sap/ui/util/Mobile",
    "sap/ushell/iconfonts",
    "sap/ushell/Container"
], function (
    Device,
    Mobile,
    iconfonts,
    Container
) {
    "use strict";

    // The viewport meta tag must be inserted to the DOM before the "DOMContentLoaded" event is published.
    // The initMobile function is responsible to insert the correct viewport according to the current device.
    // For iPhone running iOS 7.1 and above, a "minimal-ui" property is added to the viewport meta tag which allows minimizing the top and bottom bars of the browser.
    Mobile.init({ preventScroll: false });

    // load and register Fiori2 icon font
    if (Device.os.ios) {
        Mobile.setIcons({
            phone: "../../../../../resources/sap/ushell/themes/base/img/launchicons/phone-icon_120x120.png",
            "phone@2": "../../../../../resources/sap/ushell/themes/base/img/launchicons/phone-retina_180x180.png",
            tablet: "../../../../../resources/sap/ushell/themes/base/img/launchicons/tablet-icon_152x152.png",
            "tablet@2": "../../../../../resources/sap/ushell/themes/base/img/launchicons/tablet-retina_167x167.png",
            favicon: "../../../../../resources/sap/ushell/themes/base/img/launchpad_favicon.ico",
            precomposed: true
        });
    } else {
        Mobile.setIcons({
            phone: "",
            "phone@2": "",
            tablet: "",
            "tablet@2": "",
            favicon: "../../../../../resources/sap/ushell/themes/base/img/launchpad_favicon.ico",
            precomposed: true
        });
    }
    iconfonts.registerFiori2IconFont();

    Container.createRendererInternal("fiori2")
        .then(function (oContent) {
            oContent.placeAt("canvas");
        });
});

