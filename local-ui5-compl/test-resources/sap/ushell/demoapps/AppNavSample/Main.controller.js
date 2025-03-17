// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/Log",
    "sap/m/MessageBox",
    "sap/ui/core/Element",
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/mvc/XMLView",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/Container"
], function (Log, MessageBox, Element, Controller, XMLView, JSONModel, Container) {
    "use strict";

    return Controller.extend("sap.ushell.demo.AppNavSample.Main", {
        mViewNamesToViews: {},
        oInnerAppRouter: null,
        oApp: null, // the SplitApp Control instance of this view

        /* *Nav* (7) callback for route changes */

        /**
         * Callback for hash changes, this is registered with the navigation framework.
         * Our route has one argument, which is passed as the first argument.
         *
         * (for the _home route, sViewName is undefined)
         *
         * @param {object} oEvent The nav event
         */
        _handleNavEvent: function (oEvent) {
            var sRouteName = oEvent.getParameter("name");

            Log.debug("AppNavSample: Navigate to route " + sRouteName);
            if (sRouteName === "toaView") {
                var sViewName = oEvent.getParameter("arguments").viewName;

                if (/ShowView.*/.test(sViewName)) {
                    // we use this for a specific test that the router of the previous app is correctly stopped during cross-app navigation
                    // see internal BCP incident 1670239548
                    MessageBox.error("Received router event for pattern ShowView* which is used by AppNavSample2." +
                        "This means that it is likely that the router of this component was not stopped before the new component has been initialized.");
                }

                Log.debug("AppNavSample: Navigate to view " + sViewName);
                this.doNavigate("toView", sViewName);
            } else if (sRouteName === "_home") {
                // we have an unrecognizable route, use the startup parameter if we have a view name parameter
                var oStartUpParameters = this.getMyComponent().getComponentData().startupParameters;
                var sStartupParameterView = oStartUpParameters && oStartUpParameters.View && oStartUpParameters.View[0];

                var aKnownViews = [
                    "Detail",
                    "View1",
                    "View2",
                    "View3",
                    "View4",
                    "UserDefaultView"
                ];

                if (aKnownViews.indexOf(sStartupParameterView) >= 0) {
                    this.doNavigate("toView", sStartupParameterView || "Detail");
                } else {
                    Log.error("Unknown startup parameter value for View, legal values are Detail, View1, View2, View3, View4, UserDefaultView");
                }
            }
        },

        /**
         * Called when a controller is instantiated and its View controls (if available) are already created.
         * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
         * @memberof Main
         */
        onInit: function () {
            Log.info("On Init of Main.XML.controller called : this.getView().getId()" + this.getView().getId());
            this.mViewNamesToViews = {};
            this.oApp = this.byId("app");
            this.oComponent = this.getMyComponent();
            Log.debug("located Component" + typeof this.oComponent);

            this._getListView()
                .then(function (oView) {
                    oView.getController().oApplication = this;
                    this.oApp.addMasterPage(oView);
                    Element.getElementById("shellAppTitle").focus(); // Some Selenium tests expect the focus to be on the shell app title after the app is started
                }.bind(this));

            this._getDetailView()
                .then(function (oView) {
                    this.mViewNamesToViews.Detail = oView;
                    oView.getController().oApplication = this;
                    this.oApp.addDetailPage(oView);
                    this.oApp.setInitialDetail(oView); // use the object, not the (generated) id!
                    Element.getElementById("shellAppTitle").focus(); // Some Selenium tests expect the focus to be on the shell app title after the app is started
                }.bind(this));

            /* obtain the (Controller) Navigator instance */
            this.oInnerAppRouter = this.getMyComponent().getRouter();

            /* *Nav* (4) register callback handler for routes */
            this.oInnerAppRouter.attachRouteMatched(this._handleNavEvent, this);
            /* *Nav* (5) */
            /* *Nav* (6) generate links, this may also be done later  */

            // *XNav* (1) obtain cross app navigation interface

            Container.getServiceAsync("CrossApplicationNavigation").then(function (oCANService) {
                // we also have to call the shell's CrossAppNavigation service for creating correct links for inner-app navigation
                // because the shell part of the hash has to be set
                this.getView().setModel(new JSONModel({
                    toView1_href: oCANService.hrefForAppSpecificHash("View1/"),
                    toView2_href: oCANService.hrefForAppSpecificHash("View2/"),
                    toView3_href: oCANService.hrefForAppSpecificHash("View3/")
                }));
            }.bind(this));

            sap.ui.require([
                "sap/ushell/Config"
            ], function (Config) {
                this.getView().setModel(Config.createModel({
                    prop1: "/core/navigation/enableInPlaceForClassicUIs/GUI",
                    prop2: "/core/navigation/enableWebguiLocalResolution"
                }, JSONModel), "configModel");
            }.bind(this));

            this.getOwnerComponent().getService("ShellUIService").then(function (oShellUIService) {
                oShellUIService.setTitle("Sample Application For Navigation");
            });
        },

        _getListView: function () {
            if (this._oListView) {
                return Promise.resolve(this._oListView);
            }

            return XMLView.create({
                viewName: "sap.ushell.demo.AppNavSample.view.List",
                id: this.createId("List")
            })
                .then(function (oView) {
                    this._oListView = oView;
                    return oView;
                }.bind(this));
        },

        _getDetailView: function () {
            if (this._oDetailView) {
                return Promise.resolve(this._oDetailView);
            }

            return XMLView.create({
                viewName: "sap.ushell.demo.AppNavSample.view.Detail"
            })
                .then(function (oView) {
                    this._oDetailView = oView;
                    return oView;
                }.bind(this));
        },

        generateLinks: function () {
            Promise.all([
                Container.getServiceAsync("CrossApplicationNavigation"),
                Container.getServiceAsync("URLParsing")
            ]).then(function (aResults) {
                var oCANService = aResults[0];
                var oURLPService = aResults[1];

                var oRenameParams = {
                    P1: ["P1Value"],
                    P2: ["P2Value"]
                };

                // TODO sap-xapp-state
                var ActionParameterRename1 = oCANService.hrefForExternal({
                    target: {
                        semanticObject: "Action",
                        action: "parameterRename"
                    },
                    params: oRenameParams
                });
                oRenameParams.Case = ["2"];
                var ActionParameterRename2 = oCANService.hrefForExternal({
                    target: {
                        semanticObject: "Action",
                        action: "parameterRename"
                    },
                    params: oRenameParams
                });
                oRenameParams.Case = ["3"];
                var ActionParameterRename3 = oCANService.hrefForExternal({
                    target: {
                        semanticObject: "Action",
                        action: "parameterRename"
                    },
                    params: oRenameParams
                });
                oRenameParams.Case = ["4"];
                var ActionParameterRename4 = oCANService.hrefForExternal({
                    target: {
                        semanticObject: "Action",
                        action: "parameterRename"
                    },
                    params: oRenameParams
                });
                oRenameParams.Case = ["5"];
                var ActionParameterRename5 = oCANService.hrefForExternal({
                    target: {
                        semanticObject: "Action",
                        action: "parameterRename"
                    },
                    params: oRenameParams
                });
                var thelongstring = "";

                for (var i = 0; i < 4; i++) { // 4000
                    thelongstring = thelongstring + "xx" + i;
                }

                // *XNav (2) generate cross application link
                var toDefaultApp = oCANService.hrefForExternal({
                    target: {
                        semanticObject: "Action",
                        action: "todefaultapp"
                    }
                });
                // an "external navigation" to the same app, as it has a different startup parameter
                // (date), it will be reloaded!
                var toOurApp = oCANService.hrefForExternal({
                    target: {
                        semanticObject: "Action",
                        action: "toappnavsample"
                    },
                    params: {
                        zval: thelongstring,
                        date: new Date().toString()
                    }
                }, this.oComponent);

                var sShellHash = "#Action~toappnavsample&date=" + encodeURIComponent(new Date().toString());

                var toOurApp2 = oCANService.hrefForExternal({
                    target: {
                        shellHash: sShellHash
                    }
                }, this.oComponent);
                var toOurApp3 = oCANService.hrefForExternal({
                    target: {
                        semanticObject: "Action",
                        action: "toappnavsample"
                    },
                    params: {
                        "/ui2/par": "/VAL=VAL3/",
                        "/ui=aaa/": "yyy",
                        date: new Date().toString()
                    }
                });
                var toOurApp3b = oCANService.hrefForExternal({
                    target: {
                        semanticObject: "Action",
                        action: "toappnavsampleParam"
                    },
                    params: {
                        "/ui2/par": "/VAL=VAL3/",
                        "/ui2/zpar": "XXX",
                        date: new Date().toString()
                    }
                }, this.oComponent);

                var toOurApp4 = oCANService.hrefForExternal({
                    target: {
                        semanticObject: "Action",
                        action: "toappnavsample"
                    },
                    params: {
                        View: "View1",
                        date: new Date().toString()
                    }
                }, this.oComponent);

                var toHome = oCANService.hrefForExternal({
                    target: {
                        shellHash: "#"
                    }
                }, this.oComponent);
                var toShellHome = oCANService.hrefForExternal({
                    target: {
                        shellHash: "#Shell-home"
                    }
                }, this.oComponent);
                var lParams = {
                    a: "aval",
                    esc: "A B&C=D",
                    zz: "XXX",
                    date: Number(new Date())
                };
                var s = "A123456789B123456789C123456789D123456789E12345689" +
                    "F123456789G123456789H123456789I123456789J12345689";
                for (var j = 0; j < 50; j++) {
                    var su = "value" + j + ":" + s;
                    lParams["zp" + (j < 10 ? "0" : "") + j] = su;
                }
                var toOurApp_longurl = oCANService.hrefForExternal({
                    target: {
                        semanticObject: "Action",
                        action: "toappnavsample"
                    },
                    params: lParams
                }, this.oComponent);

                var toNonExistentApp = oCANService.hrefForExternal({
                    target: {
                        semanticObject: "Action",
                        action: "notconfigured"
                    },
                    params: {
                        a: "/VAL=VAL3/",
                        b: "XXX",
                        date: new Date().toString()
                    }
                }, this.oComponent);

                var toOurAppCrashing = oCANService.hrefForExternal({
                    target: {
                        semanticObject: "Action",
                        action: "toappnavsample"
                    },
                    params: {
                        CRASHME: "/VAL=VAL3/",
                        "/ui2/zpar": "XXX",
                        date: new Date().toString()
                    }
                }, this.oComponent);

                var mdl = this.getView().getModel();
                mdl.setData({
                    WDANavTarget_display_X: oCANService.hrefForExternal({
                        target: {
                            semanticObject: "WDANavTarget",
                            action: "display"
                        },
                        params: oRenameParams
                    }),
                    WDANavTarget_display: oCANService.hrefForExternal({
                        target: {
                            semanticObject: "WDANavTarget",
                            action: "display"
                        },
                        params: oRenameParams
                    }, this.oComponent),
                    WDANavSource_display: oCANService.hrefForExternal({
                        target: {
                            semanticObject: "WDANavSource",
                            action: "display"
                        },
                        params: oRenameParams
                    }),
                    Action_parameterRename1: ActionParameterRename1,
                    Action_parameterRename2: ActionParameterRename2,
                    Action_parameterRename3: ActionParameterRename3,
                    Action_parameterRename4: ActionParameterRename4,
                    Action_parameterRename5: ActionParameterRename5,
                    DefaultApp_display_href: toDefaultApp, // "#DefaultApp-display"
                    AppNavSample_display_args_href: toOurApp,
                    AppNavSample_display_args_href2: toOurApp2,
                    AppNavSample_urlparamescaping_href: toOurApp3,
                    AppNavSample_urlparamescaping2_href: toOurApp3b,
                    AppNavSample_urlWrongEscaping: "tobeoverwritten",
                    AppNavSample_urlCorrectEscaping: "tobeoverwritten",
                    AppNavSample_toourupWithView1AsStartup: toOurApp4,
                    AppNavSample_longurl: toOurApp_longurl,
                    toWdaIntentNavigationTest: "aaa",
                    toWDANavTarget_display: "ccc",
                    toWDANavTarget_displayCompressed: "ddd",
                    toWDANavTarget_display_xapp_state_data: "eee",
                    toHome: toHome,
                    toShellHome: toShellHome,
                    toNonExistentApp: toNonExistentApp,
                    AppNavSample_crashing: toOurAppCrashing,
                    toSU01html_href: oCANService.hrefForExternal({
                        target: {
                            semanticObject: "Action",
                            action: "tosu01html"
                        }
                    }),
                    toSU01_href: oCANService.hrefForExternal({
                        target: {
                            semanticObject: "Action",
                            action: "tosu01"
                        }
                    }),
                    towdapp_href: oCANService.hrefForExternal({
                        target: {
                            semanticObject: "Action",
                            action: "towdapp"
                        }
                    }),
                    anIsUrlSupportedUrl1: oCANService.hrefForExternal({
                        target: {
                            semanticObject: "Action",
                            action: "toappnavsample"
                        },
                        params: {
                            date: new Date().toString()
                        }
                    }, this.oComponent),
                    anIsUrlSupportedUrl1Enabled: true,
                    anIsUrlSupportedUrl2: oCANService.hrefForExternal({
                        target: {
                            semanticObject: "Action",
                            action: "notexisting"
                        },
                        params: {
                            date: new Date().toString()
                        }
                    }, this.oComponent),
                    anIsUrlSupportedUrl2Enabled: true,
                    anIsUrlSupportedUrl3: "http://www.sap.com",
                    anIsUrlSupportedUrl3Enabled: true,
                    anIsUrlSupportedUrl4: "#justanhash",
                    anIsUrlSupportedUrl4Enabled: true,
                    appNavSample2WithInnerRoute: oCANService.hrefForExternal({
                        target: {
                            semanticObject: "Action",
                            action: "toappnavsample2"
                        },
                        params: {
                            navTo: "toView1"
                        }
                    }, this.oComponent),
                    toRedirectURL: oCANService.hrefForExternal({
                        target: {
                            semanticObject: "Action",
                            action: "toappnavsample"
                        },
                        params: {
                            redirectIntent: ["#NavTarget-display"]
                        }
                    }),
                    toRedirectURL2: oCANService.hrefForExternal({
                        target: {
                            semanticObject: "Action",
                            action: "toappnavsample"
                        },
                        params: {
                            redirectIntent: ["#Action-toshowparameters?Added=true"]
                        }
                    }),
                    toRedirectURL3: oCANService.hrefForExternal({
                        target: {
                            semanticObject: "Action",
                            action: "toappnavsample"
                        },
                        params: {
                            redirectIntent: ["#WDANavTarget-display?Added=true"]
                        }
                    }),
                    toRedirectURL4: oCANService.hrefForExternal({
                        target: {
                            semanticObject: "Action",
                            action: "toappnavsample"
                        },
                        params: {
                            redirectIntent: ["#Action-toappnavsample?CRASHME=true"]
                        }
                    }),
                    toRedirectURL5: oCANService.hrefForExternal({
                        target: {
                            semanticObject: "Action",
                            action: "toappnavsample"
                        },
                        params: {
                            redirectIntent: ["#Action-notpresent"]
                        }
                    })
                }, true);

                [
                    "anIsUrlSupportedUrl1",
                    "anIsUrlSupportedUrl2",
                    "anIsUrlSupportedUrl3",
                    "anIsUrlSupportedUrl4"
                ].forEach(function (sName) {
                    var sUrl = mdl.getProperty("/" + sName);
                    oCANService.isUrlSupported(sUrl).fail(function () {
                        mdl.setProperty("/" + sName + "Enabled", false);
                    });
                });

                oCANService.getSemanticObjectLinks("Action", {
                    A: 1,
                    B: "x",
                    C: "ccc"
                }).done(function (oResult) {
                    if (oResult.length > 0) {
                        mdl.setProperty("/AppNavSample_urlWrongEscaping", oResult[0].intent);
                        mdl.setProperty("/AppNavSample_urlCorrectEscaping", oCANService.hrefForExternal({ target: { shellHash: oResult[0].intent } }, this.oComponent));
                    }
                }.bind(this));

                var as = oCANService.createEmptyAppState(this.oComponent);
                var oAsData = {
                    selectionVariant: {
                        Parameters: [{ PropertyName: "PARAM1", PropertyValue: "XZY" }],
                        SelectOptions: [{
                            PropertyName: "UshellTest1",
                            Ranges: [{ Sign: "I", Option: "E", value: "x" }]
                        }]
                    }
                };
                as.setData(oAsData);
                function genStr (sStr, iCnt) {
                    var sLongString = sStr;
                    while (sLongString.length < iCnt) {
                        sLongString += sStr;
                    }
                    return sLongString;
                }
                as.save().done(function () {
                    var asKey = as.getKey();
                    mdl.setProperty("/toWdaIntentNavigationTest", oCANService.hrefForExternal({
                        target: {
                            semanticObject: "Action",
                            action: "toWdaIntentNavigationTest"
                        },
                        params: {
                            "sap-xapp-state": [asKey],
                            P1: ["PV1"]
                        }
                    }, this.oComponent));
                    mdl.setProperty("/toWDANavTarget_display", oCANService.hrefForExternal({
                        target: {
                            semanticObject: "WDANavTarget",
                            action: "display"
                        },
                        params: {
                            "sap-xapp-state": [asKey],
                            P1: ["PV1"]
                        }
                    }, this.oComponent));
                    mdl.setProperty("/toWDANavTarget_display_xapp_state_data", oCANService.hrefForExternal({
                        target: {
                            semanticObject: "WDANavTarget",
                            action: "display"
                        },
                        params: {
                            P1: ["PV1"]
                        }
                    }, this.oComponent) + "&sap-xapp-state-data=" + encodeURIComponent(JSON.stringify(oAsData))); // add sap-xapp-state-data manually
                    mdl.setProperty("/toWDANavTarget_displayCompressed", oCANService.hrefForExternal({
                        target: {
                            semanticObject: "WDANavTarget",
                            action: "display"
                        },
                        params: {
                            "sap-xapp-state": [asKey],
                            P2: [genStr("ABAB", 2024)],
                            P1: ["PV1"]
                        }
                    }, this.oCOmponent));
                }.bind(this));
                oCANService.getSemanticObjectLinks("Action", lParams, undefined, this.oComponent)
                    .done(function (aLinks) {
                        aLinks.oCANService(function (aLink) {
                            Log.warning("Result ShellHash (=internal) link     :" + aLink.intent);
                            Log.warning("What to put in the link tag (external):" + oCANService.hrefForExternal({ target: { shellHash: aLink.intent } }, this.oComponent));
                            oCANService.expandCompactHash(aLink.intent).done(function (sExpandedHash) {
                                var oShellHash;
                                Log.warning("Resolved expanded intent :" + sExpandedHash);
                                oShellHash = oURLPService.parseShellHash(sExpandedHash);
                                oShellHash.params = oShellHash.params || {};
                                oShellHash.params.addedPar = ["1234"];
                                Log.warning("recoded:" + oCANService.hrefForExternal({
                                    target: {
                                        semanticObject: oShellHash.semanticObject,
                                        action: oShellHash.action,
                                        contextRaw: oShellHash.contextRaw
                                    },
                                    params: oShellHash.params,
                                    appSpecificHash: oShellHash.appSpecificHash
                                }, this.oComponent));
                            }.bind(this));
                        }.bind(this));
                    }.bind(this));

                if (toOurApp2 === sShellHash) {
                    Log.error("Beware of the encoding changes");
                }

                /*
                 * elements of this model are bound to href tags in views, e.g. (Detail.view.xml):
                 * <Link href="{/DefaultApp_display_href}" text="cross app link (Default App)" tooltip="Back to Fiori Sandbox Default Application (note href is generated!)"></Link>
                 */

                this.getView().setModel(mdl);
            }.bind(this));
        },

        // construct and register a view if not yet present
        makeViewUiLib: function (sViewName) {
            if (this.mViewNamesToViews[sViewName]) {
                return Promise.resolve(this.mViewNamesToViews[sViewName]);
            }
            // construct
            Log.info("sap.ushell.demo.AppNavSample: Creating view + " + sViewName + "... ");

            return this.getMyComponent().runAsOwner(function () {
                return XMLView.create({
                    viewName: "sap.ushell.demo.AppNavSample.view." + sViewName,
                    async: true
                }).then(function (view) {
                    Log.info("sap.ushell.demo.AppNavSample:  Creating view + " + sViewName + " assigned id : " + view.getId());
                    this.mViewNamesToViews[sViewName] = view;
                    return view;
                }.bind(this));
            }.bind(this), this.oComponent);
        },

        navigate: function (sEvent, sNavTarget) {
            Container.getServiceAsync("CrossApplicationNavigation")
                .then(function (oCANService) {
                    if (sEvent === "toHome") {
                        // use external navigation to navigate to homepage
                        oCANService.toExternal({ target: { shellHash: "#" } });
                    } else if (sEvent === "toView") {
                        if (sNavTarget === "" || !this.isLegalViewName(sNavTarget)) {
                            this.oApp.toDetail(this.mViewNamesToViews.Detail);
                        } else {
                            /* *Nav* (7) Trigger inner app navigation */
                            this.oInnerAppRouter.navTo("toaView", { viewName: sNavTarget }, true);
                        }
                    } else if (sEvent === "back") {
                        this.oApp.back();
                    } else if (sEvent === "backDetail") {
                        this.oApp.backDetail();
                    } else {
                        Log.info("sap.ushell.demo.AppNavSample: Unknown navigation");
                    }
                }.bind(this));
        },

        isLegalViewName: function (sViewNameUnderTest) {
            return (typeof sViewNameUnderTest === "string") && (["Detail", "View1", "View2", "View3", "View4", "UserDefaultView", "SmartNavSample", "SapTagSample"].indexOf(sViewNameUnderTest) >= 0);
        },

        doNavigate: function (sEvent, sNavTarget) {
            if (sEvent === "toView") {
                if (sNavTarget === "" || !this.isLegalViewName(sNavTarget)) {
                    this.oApp.toDetail(this.mViewNamesToViews.Detail);
                } else {
                    this.makeViewUiLib(sNavTarget).then(function (view) {
                        if (this.mViewNamesToViews[sNavTarget]) {
                            this.oApp.addPage(view);
                        }
                        this.oApp.toDetail(view);
                        view.getController().oApplication = this;
                    }.bind(this));
                }
            } else if (sEvent === "back") {
                this.oApp.back();
            } else if (sEvent === "backDetail") {
                this.oApp.backDetail();
            } else {
                Log.info("sap.ushell.demo.AppNavSample: Unknown navigation");
            }
        },

        /**
         * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
         * This hook is the same one that SAPUI5 controls get after being rendered.
         * @memberof Main
         */
        onAfterRendering: function () {
            this.getOwnerComponent().getService("ShellUIService").then(
                function (oShellUIService) {
                    if (oShellUIService) {
                        var aRelatedApps = [
                            {
                                title: "Related App 1",
                                icon: "sap-icon://documents",
                                intent: "#Action-todefaultapp"
                            }, {
                                title: "Related App 2",
                                subtitle: "Application view number 2",
                                intent: "#Action-todefaultapp"
                            }, {
                                title: "Related App 3",
                                subtitle: "Application view number 3",
                                intent: "#Action-todefaultapp"
                            }, {
                                title: "Related App 4",
                                icon: "sap-icon://documents",
                                intent: "#Action-todefaultapp"
                            }, {
                                title: "Related App 5",
                                subtitle: "Application view number 2",
                                intent: "#Action-todefaultapp"
                            }, {
                                title: "Related App 6",
                                subtitle: "Application view number 3",
                                intent: "#Action-todefaultapp"
                            }, {
                                title: "Related App 7",
                                icon: "sap-icon://documents",
                                intent: "#Action-todefaultapp"
                            }, {
                                title: "Related App 8",
                                subtitle: "Application view number 2",
                                intent: "#Action-todefaultapp"
                            }, {
                                title: "Related App 9",
                                subtitle: "Application view number 3",
                                intent: "#Action-todefaultapp"
                            }, {
                                title: "Related App 10",
                                icon: "sap-icon://documents",
                                intent: "#Action-todefaultapp"
                            }
                        ];
                        var aHierarchy = [
                            {
                                title: "App View 3",
                                icon: "sap-icon://folder",
                                intent: "#Action-toappnavsample&/View3/"
                            }, {
                                title: "App View 2",
                                subtitle: "Application view number 2",
                                intent: "#Action-toappnavsample&/View2/"
                            }, {
                                title: "App View 1",
                                intent: "#Action-toappnavsample&/View1/"
                            }
                        ];
                        oShellUIService.setRelatedApps(aRelatedApps);
                        oShellUIService.setHierarchy(aHierarchy);
                    }
                },
                function (sError) {
                    Log.error(
                        sError,
                        "perhaps the manifest.json of this application was misconfigured",
                        "sap.ushell.demo.AppNavSample.Main"
                    );
                });
        },

        getMyComponent: function () {
            return this.getOwnerComponent();
        },

        /**
         * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
         * @memberof Main
         */
        onExit: function () {
            Log.info("sap.ushell.demo.AppNavSample: On Exit of Main.XML.controller called : this.getView().getId():" + this.getView().getId());
            this.mViewNamesToViews = {};
            if (this.oInnerAppRouter) {
                this.oInnerAppRouter.destroy();
            }
            if (this._oDetailView) {
                this._oDetailView.destroy();
            }
            if (this._oListView) {
                this._oListView.destroy();
            }
        }
    });
});

