// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/thirdparty/URI"
], function (URI) {
    "use strict";

    // The new testsuite sets a different <base> and the relative URL does not work.
    // Return the absolute URL instead

    function normalizeConfigPath(sRelativeConfigPath) {
        if (document.getElementsByTagName("base")[0]) {
            return (new URI(sRelativeConfigPath).absoluteTo(location.href)).toString();
        }
        return sRelativeConfigPath;
    }

    return {
        normalizeConfigPath : normalizeConfigPath
    };

});
