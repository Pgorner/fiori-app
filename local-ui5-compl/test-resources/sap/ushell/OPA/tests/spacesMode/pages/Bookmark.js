// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/Lib",
    "sap/ui/test/Opa5",
    "sap/ui/test/actions/Press",
    "sap/ui/test/actions/EnterText",
    "sap/ui/test/matchers/Properties",
    "sap/ui/test/matchers/LabelFor",
    "sap/ui/test/matchers/Ancestor",
    "sap/ui/test/matchers/I18NText",
    "sap/ushell/resources"
], function (
    Library,
    Opa5,
    Press,
    EnterText,
    PropertiesMatcher,
    LabelForMatcher,
    AncestorMatcher,
    I18NTextMatcher,
    resources
) {
    "use strict";

    Opa5.createPageObjects({
        onTheBookmarkComponent: {
            actions: {
                iPressApplyInPageSelection: function () {
                    this.waitFor({
                        controlType: "sap.m.Button",
                        matchers: new I18NTextMatcher({
                            propertyName: "text",
                            key: "valueHelpDialogButtonApply"
                        }),
                        actions: new Press()
                    });
                },
                iClickTheAddBookmarkButton: function () {
                    this.waitFor({
                        controlType: "sap.ushell.ui.footerbar.AddBookmarkButton",
                        actions: new Press()
                    });
                },
                iEnterTheTitleInTheDialog: function (sTitle) {
                    this.waitFor({
                        controlType: "sap.m.Input",
                        matchers: new LabelForMatcher({
                            text: resources.i18n.getText("titleFld")
                        }),
                        actions: new EnterText({
                            text: sTitle
                        })
                    });
                },
                iEnterTheSubtitleInTheDialog: function (sSubtitle) {
                    this.waitFor({
                        controlType: "sap.m.Input",
                        matchers: new LabelForMatcher({
                            text: resources.i18n.getText("subtitleFld")
                        }),
                        actions: new EnterText({
                            text: sSubtitle
                        })
                    });
                },
                iEnterTheDescriptionInTheDialog: function (sDescription) {
                    this.waitFor({
                        controlType: "sap.m.Input",
                        matchers: new LabelForMatcher({
                            text: resources.i18n.getText("tileSettingsDialog_informationField")
                        }),
                        actions: new EnterText({
                            text: sDescription
                        })
                    });
                },
                iSelectAPage: function (sTitle) {
                    this.waitFor({
                        controlType: "sap.ui.core.Icon",
                        matchers: new PropertiesMatcher({
                            src: "sap-icon://value-help"
                        }),
                        actions: new Press(),
                        success: function () {
                            this.waitFor({
                                controlType: "sap.ushell.ui.bookmark.ContentNodeTreeItem",
                                matchers: [
                                    new PropertiesMatcher({
                                        title: sTitle
                                    })
                                ],
                                actions: new Press()
                            });
                        }
                    });
                },
                iPressOkInTheDialog: function () {
                    this.waitFor({
                        id: "bookmarkOkBtn",
                        actions: new Press()
                    });
                },
                iPressCancelInTheDialog: function () {
                    this.waitFor({
                        id: "bookmarkCancelBtn",
                        actions: new Press()
                    });
                },
                iPressCancelInTheDiscardDialog: function () {
                    this.waitFor({
                        controlType: "sap.m.Button",
                        matchers: [
                            new PropertiesMatcher({
                                text: Library.getResourceBundleFor("sap.m").getText("MSGBOX_CANCEL")
                            })
                        ],
                        actions: function (oButton) {
                            // Make sure its the button in the Discard Dialog and not in the Save as Tile Dialog.
                            var sExpectedTitle = resources.i18n.getText("SaveAsTileDialog.MessageBox.Title.Discard");
                            if (oButton.getParent().getTitle() === sExpectedTitle) {
                                oButton.firePress();
                            }
                        }
                    });
                }
            },
            assertions: {
                iSeeTheAddBookmarkButton: function () {
                    this.waitFor({
                        controlType: "sap.ushell.ui.footerbar.AddBookmarkButton",
                        success: function () {
                            Opa5.assert.ok(true, "Found an AddBookmarkButton.");
                        }
                    });
                },
                iSeeTheAppTitle: function (sTitle) {
                    this.waitFor({
                        controlType: "sap.m.Title",
                        matchers: new PropertiesMatcher({
                            text: sTitle
                        }),
                        success: function () {
                            Opa5.assert.ok(true, "App title was found.");
                        }
                    });
                },
                iSeeATileWithPropertiesInTheDialog: function (sTitle, sSubtitle, sDescription) {
                    this.waitFor({
                        controlType: "sap.m.GenericTile",
                        matchers: new PropertiesMatcher({
                            header: sTitle,
                            subheader: sSubtitle
                        }),
                        success: function (aTiles) {
                            this.waitFor({
                                controlType: "sap.m.TileContent",
                                matchers: [
                                    new AncestorMatcher(aTiles[0]),
                                    new PropertiesMatcher({
                                        footer: sDescription
                                    })
                                ],
                                success: function () {
                                    Opa5.assert.ok(true, "Tile with content was found.");
                                }
                            });
                        }
                    });
                },
                iSeeTheSaveAsTileDialog: function () {
                    this.waitFor({
                        id: "bookmarkDialog",
                        success: function () {
                            Opa5.assert.ok(true, "Save as tile dialog was found.");
                        }
                    });
                },
                iSeeTheDiscardDialog: function () {
                    this.waitFor({
                        controlType: "sap.m.Dialog",
                        matchers: [
                            new PropertiesMatcher({
                                title: resources.i18n.getText("SaveAsTileDialog.MessageBox.Title.Discard")
                            })
                        ],
                        success: function () {
                            Opa5.assert.ok(true, "The \"Discard\" dialog is shown.");
                        }
                    });
                },
                iDoNotSeeTheDiscardDialog: function () {
                    this.waitFor({
                        check: function () {
                            var aDialogTitles = document.querySelectorAll(".sapMDialog .sapMDialogTitle"),
                                sExpectedTitle = resources.i18n.getText("SaveAsTileDialog.MessageBox.Title.Discard");

                            for (var i = 0; i < aDialogTitles.length; i++) {
                                if (aDialogTitles[i].innerText === sExpectedTitle) {
                                    return false;
                                }
                            }
                            return true;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The \"Discard\" dialog is not shown anymore.");
                        }
                    });
                },
                iShouldSeeTheMessageToast: function (sMessage) {
                    this.waitFor({
                        // Turn off autoWait
                        autoWait: false,
                        check: function () {
                            // Locate the message toast using its class name in a jQuery function
                            return Opa5.getJQuery()(".sapMMessageToast").text() === sMessage;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The message toast was shown.");
                        }
                    });
                },
                iSeeAnErrorInput: function () {
                    this.waitFor({
                        controlType: "sap.m.Input",
                        matchers: new PropertiesMatcher({
                            valueState: "Error"
                        }),
                        success: function () {
                            Opa5.assert.ok(true, "An error input was found");
                        }
                    });
                },
                iSeeAnErrorMultiComboBox: function () {
                    this.waitFor({
                        controlType: "sap.m.MultiInput",
                        matchers: new PropertiesMatcher({
                            valueState: "Error"
                        }),
                        success: function () {
                            Opa5.assert.ok(true, "An error select was found.");
                        }
                    });
                },
                iSeeTheKpiPlaceholder: function (sValue) {
                    this.waitFor({
                        controlType: "sap.m.NumericContent",
                        matchers: new PropertiesMatcher({
                            value: sValue
                        }),
                        success: function () {
                            Opa5.assert.ok(true, "The KPI Placeholder was found.");
                        }
                    });
                }
            }
        }
    });
});
