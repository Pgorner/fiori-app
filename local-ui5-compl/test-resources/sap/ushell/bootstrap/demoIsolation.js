// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

(function () {
    "use strict";

    window["sap-ui-config"] = {
        "xx-bootTask": function (fnCallback) {
            sap.ui.require([
                "sap/ushell/Container",
                "sap/ushell/shells/demo/fioriDemoConfig"],
                function (Container, fioriDemoConfig) {
                    Container.init("local").then(fnCallback);
                    sap.ui.loader.config({
                        paths: {
                            "sap.ushell.shells.demo": "."
                        }
                    });
            });
        }
    };
}());
