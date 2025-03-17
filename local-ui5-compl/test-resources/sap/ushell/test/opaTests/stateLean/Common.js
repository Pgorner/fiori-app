// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ushell/opa/utils/OpaUtils"
], function (Opa5, OpaUtils) {
    "use strict";

    // All the arrangements for all Opa tests are defined here
    var Common = Opa5.extend("sap.ushell.test.opaTests.stateLean.Common", {
        StartFLPAppInLeanState: function () {
            var sFrameUrl = "../../shells/demo/FioriLaunchpad.html?sap-ushell-config=lean#Action-toappnavsample";
            if (document.getElementsByTagName("base")[0]) { // new test suite with <base>
                sFrameUrl = OpaUtils.normalizeConfigPath("../shells/demo/FioriLaunchpad.html?sap-ushell-config=lean#Action-toappnavsample");
            }
            this.iStartMyAppInAFrame(sFrameUrl);
            return this.waitFor({
                timeout: 100,
                errorMessage: "Could not load application"
            });
        }
    });

    return Common;
});
