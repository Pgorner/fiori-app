// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

// In production the links are already updated on the server.
// However this cannot be done for static test sites.
// But we still want to have the early loading of styles for proper performance tests.

// For this to work with sap-ui-rtl parameter or with a rtl local we have to update the
// _static_ styles (*/sap_horizon/library.css) to the rtl styles (*/sap_horizon/library-RTL.css)
// Any other styles loaded and added by UI5 are correctly managed by UI5
(() => {
    "use strict";

    // First we check for the existence of the url parameter "sap-ui-rtl" and apply it directly.
    // This url parameter should overwrite any other implicit rtl setting

    // Second if no url parameter was set we wait for UI5 to be ready and fetch the current
    // rtl setting from the core configuration and apply it.
    // This covers also implicit rtl settings (e.g. derived from language)

    // replaceWithRtlCss is only called when rtl is active
    function replaceWithRtlCss () {
        const aCssLinkTags = [ // Ids of the static styles referenced in our test sites
            "#sap-ui-theme-sap\\.ui\\.core",
            "#sap-ui-theme-sap\\.m"
        ];

        aCssLinkTags.forEach((sIdentifier) => {
            const oLinkTag = document.querySelector(sIdentifier);
            if (oLinkTag && oLinkTag.href) {
                oLinkTag.href = oLinkTag.href.replace(".css", "-RTL.css");
            }
        });
    }

    const oSearchParams = new URLSearchParams(location.search);
    const bRtlActive = oSearchParams.getAll("sap-ui-rtl").reduce((bRtlActive, sValue) => {
        if (sValue === "true") {
            bRtlActive = true;
        } else if (sValue === "false") {
            bRtlActive = false;
        }
        return bRtlActive;
    }, null);

    if (bRtlActive) {
        replaceWithRtlCss();
    } else if (bRtlActive === null) {
        window.addEventListener("load", () => {
            sap.ui.require(["sap/base/i18n/Localization"], (Localization) => {
                if (Localization.getRTL()) {
                    replaceWithRtlCss();
                }
            });
        }, { once: true });
    }
})();
