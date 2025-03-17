// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/Log",
    "sap/m/ActionSheet",
    "sap/m/Text",
    "sap/m/Bar",
    "sap/m/Button",
    "sap/m/Input",
    "sap/m/Dialog",
    "sap/m/library",
    "sap/m/Link",
    "sap/m/MessageToast",
    "sap/m/Popover",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/ui/footerbar/AddBookmarkButton",
    "sap/ushell/ui/footerbar/JamDiscussButton",
    "sap/ushell/ui/footerbar/JamShareButton",
    "sap/ushell/Container"
], function (
    Log,
    ActionSheet,
    Text,
    Bar,
    Button,
    Input,
    Dialog,
    mobileLibrary,
    Link,
    MessageToast,
    Popover,
    Controller,
    JSONModel,
    AddBookmarkButton,
    JamDiscussButton,
    JamShareButton,
    Container
) {
    "use strict";

    // shortcut for sap.m.URLHelper
    var URLHelper = mobileLibrary.URLHelper;

    // shortcut for sap.m.PlacementType
    var PlacementType = mobileLibrary.PlacementType;

    // shortcut for sap.m.DialogType
    var DialogType = mobileLibrary.DialogType;

    var dirtyStateProvider = function (oNavigationContext) {
        if (!oNavigationContext) {
            throw new Error("Navigation context is missing");
        }

        return true;
    };

    function fnAsync2Sec () {
        return new Promise(function (fnResolve) {
            console.log("<------------------ ASYNC Function attached to logout    2 SEC --------------->");
            setTimeout(fnResolve, 2000);
        });
    }

    function fnAsync10Sec () {
        return new Promise(function (fnResolve) {
            console.log("<------------------ ASYNC Function attached to logout    10 SEC--------------->");
            setTimeout(fnResolve, 10000);
        });
    }

    var fnConsoleSync = function () {
        console.log("<------------------ SYNC Function attached to logout --------------->");
    };

    return Controller.extend("sap.ushell.demo.AppNavSample.view.List", {
        oApplication: null,
        oDialog: null,
        oPopover: null,

        /**
         * Called when a controller is instantiated and its View controls (if available) are already created.
         * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
         * @memberof view.List
         */
        onInit: function () {
            var bFallback = this._detectFallback();

            if (bFallback) {
                this.getView().byId("FallbackSwitch").setState(true);
            }

            var myComponent = this.getMyComponent();
            if (myComponent.getComponentData().startupParameters) {
                Log.debug("startup parameters of appnavsample are " + JSON.stringify(myComponent.getComponentData().startupParameters));
            }
            var oPage = this.oView.getContent()[0];
            oPage.setShowFooter(true);
            Container.getServiceAsync("Extension").then(async (Extension) => {
                const oItem = await Extension.createUserAction({
                    text: "App Settings",
                    press: function () {
                        Container.getServiceAsync("MessageInternal").then(function (oMsgService) {
                            oMsgService.info("app settings button clicked");
                        });
                    }
                }, {
                    controlType: "sap.m.Button"
                });
                oItem.showForCurrentApp();
            });
            this.oActionSheet = new ActionSheet({
                id: this.getView().getId() + "actionSheet",
                placement: PlacementType.Top,
                buttons: [
                    new JamDiscussButton(),
                    new JamShareButton(),
                    new AddBookmarkButton({
                        id: this.getView().getId() + "saveAsTile"
                    })
                ]
            });
            this.oActionsButton = new Button({
                id: this.getView().getId() + "actionSheetButton",
                press: function () {
                    this.oActionSheet.openBy(this.oActionsButton);
                }.bind(this),
                icon: "sap-icon://action"
            });
            oPage.setFooter(new Bar({
                contentRight: this.oActionsButton
            }));

            this.getView().byId("idJamShareButton").setJamData({
                object: {
                    id: window.location.href,
                    share: "static text to share in JAM together with the URL"
                }
            });

            // Store initial navigation in the model
            Container.getServiceAsync("CrossApplicationNavigation").then(function (oCANService) {
                var bIsInitialNavigation = oCANService.isInitialNavigation();

                this.oModel = new JSONModel({
                    isInitialNavigation: bIsInitialNavigation ? "yes" : "no",
                    isInitialNavigationColor: bIsInitialNavigation ? "green" : "red"
                });
                this.getView().setModel(this.oModel, "listModel");
            }.bind(this));
        },

        getMyComponent: function () {
            return this.getOwnerComponent();
        },

        handleHomePress: function () {
            this.oApplication.navigate("toView", "Detail");
        },

        handleHomeWithParams: function () {
            Container.getServiceAsync("CrossApplicationNavigation").then(function (oCANService) {
                oCANService.toExternal({
                    target: { semanticObject: "Action", action: "toappnavsample" },
                    params: { zval: "some data", date: new Date().toString() }
                });
            });
        },

        handleHomeWithLongUrl: function () {
            var s = new Date().toString();
            var params = {
                zval: "some data",
                date: Number(new Date()),
                zzzdate: Number(new Date())
            };

            for (var i = 0; i < 20; ++i) {
                s = s + "123456789" + "ABCDEFGHIJKLMNOPQRSTUVWXY"[i];
            }
            for (var j = 0; j < 20; ++j) {
                params["zz" + j] = "zz" + j + s;
            }

            Container.getServiceAsync("CrossApplicationNavigation").then(function (oCANService) {
                oCANService.toExternal({
                    target: { semanticObject: "Action", action: "toappnavsample" },
                    params: params
                },
                    this.getOwnerComponent());
            }.bind(this));
        },

        handleBtnBackPress: function () {
            Container.getServiceAsync("CrossApplicationNavigation").then(function (oCANService) {
                oCANService.backToPreviousApp();
            });
        },

        handleBtnHomePress: function () {
            Container.getServiceAsync("CrossApplicationNavigation").then(function (oCANService) {
                oCANService.toExternal({
                    target: { shellHash: "#" }
                });
            });
        },

        handleBtnExternalNavPress: function () {
            Container.getServiceAsync("CrossApplicationNavigation").then(function (oCANService) {
                oCANService.toExternal({
                    target: { semanticObject: "Action", action: "toLetterBoxing" }
                });
            });
        },

        /*
         * Inner app navigation handlers
         */
        handleView4Nav: function () {
            this.oApplication.navigate("toView", "View4");
        },

        handleView1Nav: function () {
            this.oApplication.navigate("toView", "View1");
        },

        handleSmartNavSampleBtnPress: function () {
            this.oApplication.navigate("toView", "SmartNavSample");
        },

        handleSapTagPageNav: function () {
            this.oApplication.navigate("toView", "SapTagSample");
        },

        /*
         * Testing Features Links
         */

        onDirtyStateChange: function (oEvt) {
            var bState = oEvt.getParameter("state");
            Container.setDirtyFlag(bState);
        },

        _detectFallback: function () {
            var sURL = window.location.href;
            return sURL.indexOf("?bFallbackToShellHome=true") > -1;
        },

        onFallbackChanged: function (oEvt) {
            var bState = oEvt.getParameter("state");
            var sURL = window.location.href;
            var sSplitter = this._detectFallback() ? "FioriLaunchpad.html?bFallbackToShellHome=true&" : "FioriLaunchpad.html";
            var aURLParts = sURL.split(sSplitter);
            sURL = aURLParts[0] + (bState ? "FioriLaunchpad.html?bFallbackToShellHome=true&" : "FioriLaunchpad.html") + aURLParts[1];
            window.location.href = sURL;
        },

        handleBtn2Press: function () {
            this.oApplication.navigate("toView", "View2");
        },

        handleBtn3Press: function () {
            this.oApplication.navigate("toView", "View3");
        },

        handleBtnBackDetailPress: function () {
            this.oApplication.navigate("backDetail", "");
        },

        handleBtnFwdPress: function () {
            this.oApplication.navigate("Fwd", "");
        },

        handleSetDirtyFlagOn: function () {
            Container.setDirtyFlag(true);
        },

        handleSetDirtyFlagOff: function () {
            Container.setDirtyFlag(false);
        },

        handleRegisterDirtyStateProvider: function () {
            console.log("Register dirty state provider button was clicked!");
            Container.registerDirtyStateProvider(dirtyStateProvider);
        },

        handleDeregisterDirtyStateProvider: function () {
            Container.deregisterDirtyStateProvider(dirtyStateProvider);
        },

        handleSetFallBackToShellHomeOn: function () {
            window.location.href = "http://localhost:8080/ushell/test-resources/sap/ushell/shells/demo/FioriLaunchpad.html?bFallbackToShellHome=true#Action-toappnavsample";
        },

        handleSetFallBackToShellHomeOff: function () {
            window.location.href = "http://localhost:8080/ushell/test-resources/sap/ushell/shells/demo/FioriLaunchpad.html#Action-toappnavsample";
        },

        handleSetAttachLogoutEventOn2Sec: function () {
            Container.attachLogoutEvent(fnConsoleSync);
            Container.attachLogoutEvent(fnAsync2Sec, true);
        },

        handleSetAttachLogoutEventOn10Sec: function () {
            Container.attachLogoutEvent(fnConsoleSync);
            Container.attachLogoutEvent(fnAsync10Sec, true);
        },

        handleSetAttachLogoutEventOff: function () {
            Container.detachLogoutEvent(fnConsoleSync);
            Container.detachLogoutEvent(fnAsync2Sec);
            Container.detachLogoutEvent(fnAsync10Sec);
        },

        handleOpenDialogPress: function () {
            if (!this.oDialog) {
                this.oDialog = new Dialog({
                    id: this.getView().createId("dialog"),
                    title: "Sample Dialog",
                    type: DialogType.Message,
                    beginButton: new Button({
                        text: "Cancel",
                        press: function () {
                            this.oDialog.close();
                        }.bind(this)
                    }),
                    content: [
                        new Link({
                            id: "DialogCrossAppLinkID",
                            href: "{/DefaultApp_display_href}",
                            text: "Cross app link (Default App)",
                            tooltip: "Dialog should be closed automatically when navigating to another app"
                        })
                    ]
                });
                this.oDialog.setModel(this.oApplication.oView.getModel());
            }
            this.oDialog.open();
        },
        /**
         * The getAnswer function is used to retrieve an answer based on specific criteria or inputs.
         * @param {string} question - The question to be answered.
         * @returns {string} - Returns the calculated or retrieved answer as a string based on ABAP SDK GenAI.
         */
        getAnswer (question) {
            // Get Configuration from U1Y
            // tbd: handle bUseR3 = false

            return new Promise(function (resolve, reject) {
            // app is on home layer so no security issues with internal names
               var sR3CInst = "httpscolonbackslashbackslashldciu1ydotwdfdotsapdotcorpcolon44355"
               .replaceAll("dot", ".")
               .replaceAll("colon", ":")
               .replaceAll("backslash", "/");

                // eslint-disable-next-line ushell/no-internals
                const sR3Service = "/sap/zui_innoweek";
                const sGetRequest = sR3CInst + sR3Service + "?sap-client=000&mode=genai&question=" + question;
                const oXhttpServerAPI = new XMLHttpRequest();

                oXhttpServerAPI.onreadystatechange = function () {
                    if (this.readyState === 4) {
                        if (this.status === 200) {
                            if (oXhttpServerAPI.responseText.length > 0) {
                                resolve(oXhttpServerAPI.responseText);
                            } else {
                                reject("Error: Response is empty<br>");
                            }
                        } else {
                            reject("Error when getting  from U1Y<br>Status: " + this.status + "<br>" + oXhttpServerAPI.responseText);
                        }
                    }
                };

                oXhttpServerAPI.open("GET", sGetRequest);
                oXhttpServerAPI.send();
            });
        },
        handleAskMeAnythingDialogPress: function () {
            if (!this.oAnythingDialog) {
                var sAnswer = "Ask me anything!";
                this.oAnythingDialog = new Dialog({
                    id: this.getView().createId("dialog"),
                    title: "What is your question?",
                    type: DialogType.Message,
                    beginButton: new Button({
                        text: "Ask",
                        press: function () {
                            this.getAnswer(this.oAnythingDialog.getContent()[0].getValue()).
                                then(function (sAnswer1) {
                                    this.oAnythingDialog.getContent()[1].setText(sAnswer1);
                                }.bind(this));
                        }.bind(this)
                    }),
                    endButton: new Button({
                        text: "Close",
                        press: function () {
                            this.oAnythingDialog.close();
                        }.bind(this)
                    }),
                    content: [
                        new Input({
                            value: sAnswer
                        }),
                        new Text({
                        })
                    ]
                });
                this.oAnythingDialog.setModel(this.oApplication.oView.getModel());
            }
            this.oAnythingDialog.open();

        },

        handleOpenPopoverPress: function () {
            var oModel, sHref;
            if (!this.oPopover) {
                oModel = this.oApplication.oView.getModel();
                sHref = oModel.getProperty("/DefaultApp_display_href");
                this.oPopover = new Popover({
                    id: this.getView().createId("popover"),
                    title: "Sample Popover",
                    content: [
                        new Link({
                            href: sHref,
                            text: "Cross app link (Default App)",
                            tooltip: "Popover should be closed automatically when navigating to another app"
                        })
                    ]
                });
            }
            if (!this.oPopover.isOpen()) {
                this.oPopover.openBy(this.getView().byId("openPopover"));
            } else {
                this.oPopover.close();
            }
        },

        handleSetHierarchy: function () {
            var aHierarchyLevels = [{
                icon: "sap-icon://undefined/lead",
                title: "View X",
                link: "#Action-toappnavsample2" //app calls hrefForExternal, external format, direct link
            }, {
                icon: "sap-icon://FioriInAppIcons/Gift",
                title: "View Y",
                link: "#Action-toappstateformsample&/editForm/"
            }];

            this.getOwnerComponent().getService("ShellUIService").then(
                function (oShellUIService) {
                    oShellUIService.setHierarchy(aHierarchyLevels);
                },
                function (sError) {
                    Log.error(sError, "perhaps manifest.json does not declare the service correctly",
                        "sap.ushell.demo.AppNavSample.view.List");
                }
            );
        },

        handleSetRelatedApps: function () {
            var aRelatedApps = [{
                title: "Related App X",
                icon: "sap-icon://documents",
                intent: "#Action-todefaultapp"
            }, {
                title: "no icon or sub",
                intent: "#Action-todefaultapp"
            }, {
                title: "Related App Z",
                subtitle: "Application view number 3",
                intent: "#Action-todefaultapp"
            }];

            this.getOwnerComponent().getService("ShellUIService").then(
                function (oShellUIService) {
                    oShellUIService.setRelatedApps(aRelatedApps);
                },
                function (sError) {
                    Log.error(sError, "perhaps manifest.json does not declare the service correctly",
                        "sap.ushell.demo.AppNavSample.view.List");
                }
            );
        },
        getThemeList: function () {
            sap.ui.require([
                "sap/ushell/appRuntime/ui5/AppRuntimeService"
            ], function (
                AppRuntimeService
            ) {
                AppRuntimeService.sendMessageToOuterShell("sap.ushell.services.UserInfo.getThemeList", {})
                    .then(function (aList) {
                        Log.debug(aList);
                    }, function (sError) {
                        Log.debug(sError);
                    });
            });
        },

        handleSetTitle: function () {
            this.getOwnerComponent().getService("ShellUIService").then(
                function (oShellUIService) {
                    oShellUIService.setTitle("Custom title is set!");
                },
                function (sError) {
                    Log.error(sError, "perhaps manifest.json does not declare the service correctly",
                        "sap.ushell.demo.AppNavSample.view.List");
                }
            );
        },

        handleSetTitleFromTargetMapping: function () {
            Container.getServiceAsync("AppLifeCycle")
                .then(function (aServices) {
                    var oAppLifeCycle = aServices[0];

                    return Promise.all([
                        oAppLifeCycle.getCurrentApplication().getIntent(),
                        Container.getServiceAsync("CrossApplicationNavigation")
                    ]);
                })
                .then(function (aResults) {
                    var oIntent = aResults[0];
                    var oCANService = aResults[1];

                    return Promise.all([
                        oCANService.getLinks(oIntent),
                        this.getOwnerComponent().getService("ShellUIService")
                    ]);
                }.bind(this))
                .then(function (aResults) {
                    var sText = aResults[0][0].text;
                    var oShellUIService = aResults[1];
                    oShellUIService.setTitle(sText);
                });
        },

        handleOpenMessageToastPress: function () {
            MessageToast.show("Sample message toast", { duration: 5000 });
        },

        sendAsEmailS4: function () {
            URLHelper.triggerEmail(null, "This is the email of FLP", document.URL);
        },

        doRedirect: function () {
            URLHelper.redirect(document.URL.split("#")[0] + "#BookmarkState-Sample", true);
        },

        doChangeHeader: function () {
            var myBtm = this.getView().byId("changeHeader");
            if (myBtm.getText() === "Change Header") {
                Container.getRendererInternal("fiori2").setHeaderVisibility(false, true);
                Container.getRendererInternal("fiori2").addTopHeaderPlaceHolder();
                myBtm.setText("Reset Header");
            } else {
                Container.getRendererInternal("fiori2").setHeaderVisibility(true, true);
                Container.getRendererInternal("fiori2").removeTopHeaderPlaceHolder();
                myBtm.setText("Change Header");
            }
        },

        /**
         * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
         * @memberof view.List
         */
        onExit: function () {
            // dialogs and popovers are not part of the UI composition tree and must
            // therefore be
            // destroyed explicitly in the exit handler
            if (this.oDialog) {
                this.oDialog.destroy();
            }
            if (this.oPopover) {
                this.oPopover.destroy();
            }
            if (this.oActionSheet) {
                this.oActionSheet.destroy();
            }
            if (this.oActionsButton) {
                this.oActionsButton.destroy();
            }
            this.handleDeregisterDirtyStateProvider();

            Container.detachLogoutEvent(fnConsoleSync);
            Container.detachLogoutEvent(fnAsync2Sec);
            Container.detachLogoutEvent(fnAsync10Sec);
        }
    });
});
