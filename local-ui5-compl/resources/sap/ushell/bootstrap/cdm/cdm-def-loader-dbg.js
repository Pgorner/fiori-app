// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
(function () {
    "use strict";

    var sAsyncLoader = document.getElementById("sap-ui-bootstrap").getAttribute("data-sap-ui-async");

    if (sAsyncLoader && sAsyncLoader.toLowerCase() === "true") {
        sap.ui.require(["sap/ushell/bootstrap/cdm/cdm-def"]);
        return;
    }

    /**
     * Sync bootstrap is deprecated
     * @deprecated since 1.120
     */
    sap.ui.requireSync("sap/ushell/bootstrap/cdm/cdm-def"); // LEGACY API (deprecated)
})();
