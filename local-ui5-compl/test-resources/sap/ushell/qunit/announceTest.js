// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * Logs the executed Test URL to the console for better error reporting
 */
(function () {
    "use strict";

    console.log([
        "\r\n",
        "*************************",
        "[Starting Test Execution]",
        window.location.href,
        "*************************"
    ].join("\r\n"));
})();
