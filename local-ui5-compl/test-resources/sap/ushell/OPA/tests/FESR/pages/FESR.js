// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ui/test/actions/Press",
    "sap/ui/test/actions/EnterText",
    "sap/ui/test/matchers/Properties",
    "sap/ui/test/matchers/LabelFor",
    "sap/ui/test/matchers/Ancestor",
    "sap/ui/test/matchers/BindingPath",
    "sap/ui/test/matchers/I18NText",
    "sap/ushell/resources",
    "sap/ushell/performance/FesrEnhancer"
], function (Opa5, Press, EnterText, PropertiesMatcher, LabelForMatcher, AncestorMatcher, BindingPathMatcher, I18NTextMatcher, resources, FESREnhancer) {
    "use strict";

    this.iCheckThatTheCorrectFESRHandleHasBeenSent = function (oFesrHandleExpected) {
        this.waitFor({
            success: function () {
                var oFesrHandleActual = FESREnhancer._getLastFesrHandle();
                if (oFesrHandleActual !== null) {
                    delete oFesrHandleActual.timeToInteractive;
                }
                // sometimes we want to ignore stepname
                if (oFesrHandleExpected) {
                    if (oFesrHandleExpected.stepName === undefined) {
                        delete oFesrHandleActual.stepName;
                    }
                }

                Opa5.assert.deepEqual(oFesrHandleActual, oFesrHandleExpected, "The FLP sent the expected FESR handle: " && JSON.stringify(oFesrHandleActual));
            }
        });
    };
    Opa5.createPageObjects({
        onTheHomeApp: {
            actions: {
                iNavigateToAnApp: function () {
                    this.waitFor({
                        controlType: "sap.m.Button",
                        matchers: new I18NTextMatcher({
                            propertyName: "text",
                            key: "navigation.navigate"
                        }),
                        actions: new Press()
                    });
                },
                iChangeTheHash: function (hash) {
                    return this.waitFor({
                        success: function () {
                            Opa5.getWindow().location.hash = hash;
                        }
                    });
                }
            },
            assertions: {
                iSeeTheNavigateButton: function () {
                    this.waitFor({
                        controlType: "sap.m.Button",
                        matchers: new I18NTextMatcher({
                            propertyName: "text",
                            key: "navigation.navigate"
                        }),
                        success: function () {
                            Opa5.assert.ok(true, "Found the navigation button.");
                        }
                    });
                }
            }
        },
        onThePage: {
            actions: {
                iClickTheVisualization: function (sTitle) {
                    this.waitFor({
                        controlType: "sap.m.GenericTile",
                        matchers: new PropertiesMatcher({
                            header: sTitle
                        }),
                        actions: new Press()
                    });
                },
                iExitEditMode: function () {
                    return this.waitFor({
                        controlType: "sap.m.StandardListItem",
                        matchers: new PropertiesMatcher({
                            title: resources.i18n.getText("PageRuntime.EditMode.Activate")
                        }),
                        actions: new Press()
                    });
                },
                iStopTheInteraction: function () {
                    this.waitFor({
                        success: function () {
                            if (Opa5.getContext()._fnResolveInteraction) {
                                Opa5.getContext()._fnResolveInteraction();
                                delete Opa5.getContext()._fnResolveInteraction;
                            }
                        }
                    });
                }
            },
            assertions: {
                iCheckThatTheCorrectFESRHandleHasBeenSent: this.iCheckThatTheCorrectFESRHandleHasBeenSent,
                iSeeTheVisualization: function (sTileTitle) {
                    this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.VizInstanceCdm",
                        matchers: new PropertiesMatcher({
                            title: sTileTitle
                        }),
                        success: function () {
                            Opa5.assert.ok(true, "Tile was found.");
                        }
                    });
                }
            }
        },
        onTheBookMarkApp: {
            actions: {
                iNavigateBack: function () {
                    this.waitFor({
                        controlType: "sap.ushell.ui.shell.ShellHeadItem",
                        id: "backBtn",
                        actions: new Press()
                    });
                },
                iChangeTheHash: function (hash) {
                    return this.waitFor({
                        success: function () {
                            Opa5.getWindow().location.hash = hash;
                        }
                    });
                },
                iStopTheInteraction: function () {
                    this.waitFor({
                        success: function () {
                            if (Opa5.getContext()._fnResolveInteraction) {
                                Opa5.getContext()._fnResolveInteraction();
                                delete Opa5.getContext()._fnResolveInteraction;
                            }
                        }
                    });
                }
            },
            assertions: {
                iSeeTheAddBookmarkButton: function () {
                    this.waitFor({
                        controlType: "sap.m.Button",
                        matchers: new I18NTextMatcher({
                            propertyName: "text",
                            key: "standard.addBookmark"
                        }),
                        success: function () {
                            Opa5.assert.ok(true, "AddBookmark button was found.");
                        }
                    });
                },
                iCheckThatTheCorrectFESRHandleHasBeenSent: this.iCheckThatTheCorrectFESRHandleHasBeenSent
            }
        },
        onAppNavSample: {
            actions: {
                iNavigateBack: function () {
                    this.waitFor({
                        controlType: "sap.ushell.ui.shell.ShellHeadItem",
                        id: "backBtn",
                        actions: new Press()
                    });
                },
                iStopTheInteraction: function () {
                    this.waitFor({
                        success: function () {
                            if (Opa5.getContext()._fnResolveInteraction) {
                                Opa5.getContext()._fnResolveInteraction();
                                delete Opa5.getContext()._fnResolveInteraction;
                            }
                        }
                    });
                },
                iClickOnStartAnyIntent: function () {
                    return this.waitFor({
                        controlType: "sap.m.Link",
                        matchers: new PropertiesMatcher({
                            text: "Start any Intent Page"
                        }),
                        actions: new Press(),
                        success: function () {
                            Opa5.assert.ok(true, "The 'Start any Intent Page' link was clicked.");
                        }
                    });
                },
                iChangeTheAction: function (sAction) {
                    return this.waitFor({
                        controlType: "sap.m.Input",
                        matchers: new PropertiesMatcher({
                            id: "__xmlview2--f3"
                        }),
                        actions: new EnterText({
                            text: sAction
                        }),
                        success: function () {
                            Opa5.assert.ok(true, "The 'Start any Intent Page' link was clicked.");
                        }
                    });
                },
                iClickOnToGeneratedLinkButton: function () {
                    return this.waitFor({
                        controlType: "sap.m.Button",
                        matchers: new PropertiesMatcher({
                            text: "toGenerated Link"
                        }),
                        actions: new Press(),
                        success: function () {
                            Opa5.assert.ok(true, "The 'toGenerated Link' button was clicked.");
                        }
                    });
                }
            },
            assertions: {
                iSeeTheChangeButton: function () {
                    return this.waitFor({
                        controlType: "sap.m.Button",
                        matchers: new PropertiesMatcher({
                            text: "Change"
                        }),
                        success: function () {
                            Opa5.assert.ok(true, "The change mode button is there.");
                        }
                    });
                },
                iCheckThatTheCorrectFESRHandleHasBeenSent: this.iCheckThatTheCorrectFESRHandleHasBeenSent
            }
        }
    });
});
