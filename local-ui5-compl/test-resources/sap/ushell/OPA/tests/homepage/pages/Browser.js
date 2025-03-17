// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define(["sap/ui/test/Opa5"], function (Opa5) {
    "use strict";
    Opa5.createPageObjects({
        onTheBrowser: {
            actions: {
                iPressTheBackButton: function () {
                    return this.waitFor({
                        success: function () {
                            Opa5.getWindow().history.go(-1);
                        }
                    });
                },
                iChangeTheHash: function (hash) {
                    return this.waitFor({
                        success: function () {
                            Opa5.getWindow().location.hash = hash;
                        }
                    });
                }
            }
        }
    });
});
