// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/test/Opa5"
], function (Opa5) {
    "use strict";

    Opa5.createPageObjects({
        onTheMainPage: {
            actions: {
            },
            assertions: {
                CheckCozyCompactValues: function (nCozy, nCompact) {
                    return this.waitFor({
                        controlType: "sap.m.Button",
                        success: function (ctrl) {
                            var oIframe = document.getElementsByTagName("iframe")[0];
                            Opa5.assert.ok(oIframe.contentDocument.getElementsByClassName("sapUiSizeCompact").length === nCompact, "");
                            Opa5.assert.ok(oIframe.contentDocument.getElementsByClassName("sapUiSizeCozy").length === nCozy, "");
                        },
                        errorMessage: "CheckHeaderItems test failed"
                    });
                }
            }
        }
    });
});
