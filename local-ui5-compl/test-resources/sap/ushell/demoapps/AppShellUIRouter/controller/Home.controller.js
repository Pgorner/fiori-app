// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/m/MessageToast",
    "sap/ushell/demo/AppShellUIRouter/controller/BaseController",
    "sap/ui/model/json/JSONModel"
], function (MessageToast, BaseController, JSONModel) {
    "use strict";

    var S_INTRO = [
        [
            "The ShellUIService allows apps to interact with the surrounding",
            "UI.  Among the possible operations, applications can use the",
            "setTitle and setHierarchy methods to display a title and/or an",
            "hierarchy of navigations in the FLP shell header."
        ].join(" "),
        "",
        [
            "Hierarchy and title, however, can also be set automatically based",
            "on the inner app routes specified in the application manifest.  To",
            "implement this behavior, the application must set up routes in its",
            "manifest.json and enable the automatic title and hierarchy setting",
            "via the configuration:"
        ].join(" "),
        [
            "\n",
            "{",
            " ...",
            '  "sap.ui5": {',
            '    "services": {',
            '      "ShellUIService": {',
            '        "factoryName": "sap.ushell.ui5service.ShellUIService",',
            '        "lazy": false,',
            '        "settings" : {',
            '          "setHierarchy": "auto"',
            '          "setTitle": "auto"',
            "        }",
            "      }",
            "    }",
            "  }",
            " ...",
            "}",
            "..."
        ].join("\n"),
        "",
        [
            "In this demo the user navigates between different views of the",
            "app, triggering inner app route changes that are automatically",
            "reflected in the FLP hierarchy and header title."
        ].join(" ")
    ].join("\n");

    var S_PROTECTION = [
        [
            "The app is not allowed to override the hierarchy and title when",
            "this is configured to be set automatically. The button below",
            "attempts to override hierarchy by calling:"
        ].join(""),
        "",
        [
            "shellUIServiceInstance.setHierarchy([{",
            '    "title": "App 1",',
            '    "intent": "#Shell-home"',
            "}, {",
            '    "title": "App 2",',
            '    "intent": "#Action-toappnavsample"',
            "}, {",
            '    "title": "App 3",',
            '    "intent": "#Action-toapperssample"',
            "}]);",
            "",
            'shellUIServiceInstance.setTitle("Test");'
        ].join("\n")
    ].join("\n");

    return BaseController.extend("sap.ushell.demo.AppShellUIRouter.controller.Home", {
        onInit: function () {
            this.oModel = {
                introText: S_INTRO,
                protectionText: S_PROTECTION
            };
            this._setModel(this.oModel);
        },
        onAfterRendering: function () {
            // Fix some styles
            var aTextAreaElements = document.querySelectorAll("textarea");
            for (var i = 0; i < aTextAreaElements.length; i++) {
                aTextAreaElements[i].style.fontFamily = "courier";
                aTextAreaElements[i].style.fontSize = "10pt";
                aTextAreaElements[i].style.border = "none";
            }

        },
        onOverrideHierarchyTitle: function () {
            this.getOwnerComponent().getService("ShellUIService").then(
                function (oService) {
                    oService.setHierarchy([{
                        title: "App 1",
                        intent: "#Shell-home"
                    }, {
                        title: "App 2",
                        intent: "#Action-toappnavsample"
                    }, {
                        title: "App 3",
                        intent: "#Action-toapperssample"
                    }]);
                    oService.setTitle("Test");

                    MessageToast.show("setHierarchy / and setTitle methods were called");
                },
                function (sErr) {
                    MessageToast.show("Error while getting ShellUIService: " + sErr);
                }
            );
        },
        onDisplayNotFound: function (oEvent) {
            // display the "notFound" target without changing the hash
            this.getRouter().getTargets().display("notFound", {
                fromTarget: "home"
            });
        },
        onNavToEmployees: function (oEvent) {
            this.getRouter().navTo("employeeList");
        },
        onNavToEmployeeOverview: function (oEvent) {
            this.getRouter().navTo("employeeOverview");
        },
        _setModel: function (oJson) {
            if (!this._oModel) {
                this._oModel = new JSONModel(oJson);
            } else {
                this._oModel.setData(oJson);
            }
            this.getView().setModel(this._oModel);
        }
    });
});
