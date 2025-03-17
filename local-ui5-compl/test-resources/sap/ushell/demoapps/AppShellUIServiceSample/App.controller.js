// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/Log",
    "sap/base/util/deepExtend",
    "sap/m/MessageToast",
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/service/ServiceFactoryRegistry",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/Container"
], function (
    Log,
    deepExtend,
    MessageToast,
    Controller,
    ServiceFactoryRegistry,
    JSONModel,
    Container
) {
    "use strict";

    var S_INTRO = [
        ["The ShellUIService allows apps to interact with the surrounding UI.",
            "The service is injected in the app components by the FLP renderer",
            "before the corresponding apps start. To consume the service,",
            "app components should declare it in their manifest.json as follows:"
        ].join(" "),
        "{",
        " ...",
        '  "sap.ui5": {',
        '    "services": {',
        '      "ShellUIService": {',
        '        "factoryName": "sap.ushell.ui5service.ShellUIService"',
        "      }",
        "    }",
        "  }",
        " ...",
        "}",
        "",
        [
            "The service can be then consumed within the root component as shown in the",
            "following example:"
        ].join(" "),
        "",
        "// Component.js",
        "...",
        'this.getService("ShellUIService").then( // promise is returned',
        "   function (oService) {",
        '      oService.setTitle("Application Title");',
        "   },",
        "   function (oError) {",
        '      Log.error("Cannot get ShellUIService", oError, "my.app.Component");',
        "   }",
        ");",
        "..."
    ].join("\n");

    return Controller.extend("sap.ushell.demo.AppShellUIServiceSample.App", {
        onInit: function () {
            Log.setLevel(2); // set Warning level
            this.oShellUIServiceFromStaticMethod = null;
            this.oShellUIServiceFromComponent = null;
            this.oCrossAppNavigationPromise = Container.getServiceAsync("CrossApplicationNavigation");
            this.iUpdateTimeout = 3000;
            this.sSwitchOnText = "using sap.ui.Component.getService('ShellUIService')";
            this.sSwitchOffText = "using ServiceFactoryRegistry#get('sap.ushell.ui5service.ShellUIService').getInstance()";
            this.setTitleTextStart = "Start calling setTitle()";
            this.setTitleTextStop = "Stop calling setTitle()";
            this.setTitleIconStart = "restart";
            this.setTitleIconStop = "stop";
            this.bSwitchOn = false;
            this.bCallSetTitle = false;
            this.oModel = {
                introText: S_INTRO,
                currentTimeout: "" + this.iUpdateTimeout,
                currentStateText: this.sSwitchOffText,
                setTitleIcon: "restart",
                setTitleText: this.setTitleTextStart,
                componentId: this.getOwnerComponent().getId(),
                setHierarchyRelatedAppsFormSaveEnabled: false,
                setHierarchyRelatedAppsFormDeleteEnabled: false,
                setHierarchyRelatedAppsFormItem: {
                },
                setHierarchyRelatedAppsArg: [{
                    title: "Sample App",
                    subtitle: "Demonstrates navigation",
                    icon: "sap-icon://media-play",
                    intent: "#Action-toappnavsample"
                }]
            };
            this._setModel(this.oModel);
        },
        onSetHierarchyRowSelectionChange: function (oControl) {
            var iSelectedIndex = oControl.getParameters().rowIndex;
            if (iSelectedIndex >= 0) {
                this.iSetHierarchySelectionIndex = iSelectedIndex;
                this.oModel.setHierarchyRelatedAppsFormSaveEnabled = true;
                this.oModel.setHierarchyRelatedAppsFormDeleteEnabled = true;
                this.oModel.setHierarchyRelatedAppsFormItem = deepExtend({}, this.oModel.setHierarchyRelatedAppsArg[iSelectedIndex]);
                this._setModel(this.oModel);
            }
        },
        btnAddHierarchyEntryPressed: function () {
            this.iSetHierarchySelectionIndex = -1;
            this.oModel.setHierarchyRelatedAppsFormSaveEnabled = false;
            this.oModel.setHierarchyRelatedAppsFormDeleteEnabled = false;
            this.oModel.setHierarchyRelatedAppsFormItem = {};

            // Get data from form and add to the arg
            var oEntry = {
                title: this.byId("setHierarchyRelatedAppsTitle").getValue(),
                subtitle: this.byId("setHierarchyRelatedAppsSubtitle").getValue(),
                icon: this.byId("setHierarchyRelatedAppsIcon").getValue(),
                intent: this.byId("setHierarchyRelatedAppsIntent").getValue()
            };

            if (!Array.isArray(this.oModel.setHierarchyRelatedAppsArg)) {
                this.oModel.setHierarchyRelatedAppsArg = [];
            }

            this.oModel.setHierarchyRelatedAppsArg.push(oEntry);

            this._setModel(this.oModel);

            this.byId("setHierarchyRelatedAppsTable").clearSelection();
        },
        btnSaveHierarchyEntryPressed: function () {
            var idx = this.iSetHierarchySelectionIndex;
            if (idx >= 0) {
                this.oModel.setHierarchyRelatedAppsFormSaveEnabled = false;
                this.oModel.setHierarchyRelatedAppsFormDeleteEnabled = false;

                this.oModel.setHierarchyRelatedAppsArg = this.oModel.setHierarchyRelatedAppsArg.map(function (oArg, i) {
                    if (i === idx) {
                        return {
                            title: this.byId("setHierarchyRelatedAppsTitle").getValue(),
                            subtitle: this.byId("setHierarchyRelatedAppsSubtitle").getValue(),
                            icon: this.byId("setHierarchyRelatedAppsIcon").getValue(),
                            intent: this.byId("setHierarchyRelatedAppsIntent").getValue()
                        };
                    }
                    return oArg;
                }.bind(this));

                this.iSetHierarchySelectionIndex = -1;
                this.oModel.setHierarchyRelatedAppsFormItem = {};
                this._setModel(this.oModel);
                this.byId("setHierarchyRelatedAppsTable").clearSelection();
            } else {
                MessageToast.show("No item selected");
            }
        },
        btnDeleteHierarchyEntryPressed: function () {
            var idx = this.iSetHierarchySelectionIndex;
            if (idx >= 0) {
                this.byId("setHierarchyRelatedAppsTable").clearSelection();
                this.oModel.setHierarchyRelatedAppsFormSaveEnabled = false;
                this.oModel.setHierarchyRelatedAppsFormDeleteEnabled = false;
                this.oModel.setHierarchyRelatedAppsFormItem = {};

                this.oModel.setHierarchyRelatedAppsArg = this.oModel.setHierarchyRelatedAppsArg.filter(function (e, i) {
                    return i !== idx;
                });

                this.iSetHierarchySelectionIndex = -1;

                this._setModel(this.oModel);
            } else {
                MessageToast.show("No item selected");
            }
        },
        onAfterRendering: function () {
            // Fix some styles
            var aTextAreas = document.querySelectorAll("textarea");
            for (var i = 0; i < aTextAreas.length; i++) {
                aTextAreas[i].style.fontFamily = "courier";
                aTextAreas[i].style.fontSize = "10pt";
                aTextAreas[i].style.border = "none";
            }

            this.iTitleCount = 0;

            // Read service from component
            this.getOwnerComponent().getService("ShellUIService").then(
                function (oService) {
                    this.oShellUIServiceFromComponent = oService;
                }.bind(this),
                function (oError) {
                    Log.error(
                        "Error while getting ShellUIService",
                        oError,
                        "sap.ushell.demo.AppShellUIServiceSample"
                    );
                }
            );

            // Use static method
            ServiceFactoryRegistry
                .get("sap.ushell.ui5service.ShellUIService")
                .createInstance()
                .then(
                    function (oService) {
                        this.oShellUIServiceFromStaticMethod = oService;
                    }.bind(this),
                    function (oError) {
                        Log.error(
                            "Error while getting ShellUIService",
                            oError,
                            "sap.ushell.demo.AppShellUIServiceSample"
                        );
                    }
                );
        },
        btnGoHomePressed: function () {
            this.oCrossAppNavigationPromise.then(function (oService) {
                oService.toExternal({
                    target: {
                        shellHash: "#Shell-home"
                    }
                });
            });
        },
        btnGoToAppNavSample: function () {
            this.oCrossAppNavigationPromise.then(function (oService) {
                oService.toExternal({
                    target: {
                        shellHash: "#Action-toappnavsample"
                    }
                });
            });
        },
        btnStartStopPressed: function (oControl) {
            if (oControl.getParameters().pressed) {
                this.oModel.setTitleIcon = this.setTitleIconStop;
                this.oModel.setTitleText = this.setTitleTextStop;
                this.bCallSetTitle = true;
                this._setRandomTitle();
            } else {
                this.oModel.setTitleIcon = this.setTitleIconStart;
                this.oModel.setTitleText = this.setTitleTextStart;
                this.bCallSetTitle = false;
                clearTimeout(this._currentTimeout);
            }

            this._setModel(this.oModel);
        },
        btnSetHierarchyRelatedAppsPressed: function () {
            this._setHierarchyRelatedApps(this.oModel.setHierarchyRelatedAppsArg);
        },
        btnClearHierarchyRelatedAppsPressed: function () {
            this._setHierarchyRelatedApps();
        },
        onTimeoutChanged: function (oControl) {
            this.iUpdateTimeout = oControl.getParameters().value;
            this.oModel.currentTimeout = this.iUpdateTimeout;
            this._setModel(this.oModel);
        },
        onUseInjectedServiceChange: function (oControl) {
            var bOn = oControl.getParameters().state;
            this.bSwitchOn = bOn;
            this.oModel.currentStateText = bOn
                ? this.sSwitchOnText
                : this.sSwitchOffText;
            this._setModel(this.oModel);
        },
        _setHierarchyRelatedApps: function (aMethodArg) {
            var oService = this.bSwitchOn
                ? this.oShellUIServiceFromComponent
                : this.oShellUIServiceFromStaticMethod;

            try {
                var sMethod = this.byId("radioRelatedApps").getSelected()
                    ? "setRelatedApps"
                    : "setHierarchy";

                oService[sMethod](aMethodArg);
                MessageToast.show(sMethod + " called successfully");
            } catch (oError) {
                MessageToast.show(oError);
            }
        },
        _setModel: function (oJson) {
            if (!this._oModel) {
                this._oModel = new JSONModel(oJson);
            } else {
                this._oModel.setData(oJson);
            }
            this.getView().setModel(this._oModel);
        },
        _setRandomTitle: function () {
            var oService = this.bSwitchOn
                ? this.oShellUIServiceFromComponent
                : this.oShellUIServiceFromStaticMethod;

            this.iTitleCount++;

            oService.setTitle("Automatic Title " + this.iTitleCount);

            // Schedule next one
            if (this.bCallSetTitle) {
                this._currentTimeout = setTimeout(this._setRandomTitle.bind(this), this.iUpdateTimeout);
            }
        }
    });
});
