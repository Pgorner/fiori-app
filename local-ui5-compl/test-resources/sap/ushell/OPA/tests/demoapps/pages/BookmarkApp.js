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
    "sap/ushell/resources"
], function (Opa5, Press, EnterText, PropertiesMatcher, LabelForMatcher, AncestorMatcher, BindingPathMatcher, I18NTextMatcher, resources) {
    "use strict";

    Opa5.createPageObjects({
        onTheBookmarkApp: {
            actions: {
                iEnterTheBookmarkTitle: function (sTitle) {
                    this.waitFor({
                        controlType: "sap.m.Input",
                        matchers: new BindingPathMatcher({
                            propertyPath: "/standard/title"
                        }),
                        actions: new EnterText({
                            text: sTitle
                        })
                    });
                },
                iEnterTheBookmarkSubtitle: function (sSubtitle) {
                    this.waitFor({
                        controlType: "sap.m.Input",
                        matchers: new BindingPathMatcher({
                            propertyPath: "/standard/subtitle"
                        }),
                        actions: new EnterText({
                            text: sSubtitle
                        })
                    });
                },
                iEnterTheBookmarkIcon: function (sIcon) {
                    this.waitFor({
                        controlType: "sap.m.Input",
                        matchers: new BindingPathMatcher({
                            propertyPath: "/standard/icon"
                        }),
                        actions: new EnterText({
                            text: sIcon
                        })
                    });
                },
                iEnterTheBookmarkServiceUrl: function (sUrl) {
                    this.waitFor({
                        controlType: "sap.m.Input",
                        matchers: new BindingPathMatcher({
                            propertyPath: "/standard/serviceUrl"
                        }),
                        actions: new EnterText({
                            text: sUrl
                        })
                    });
                },
                iClickTheModifyStandardTab: function () {
                    this.waitFor({
                        controlType: "sap.m.IconTabFilter",
                        matchers: new I18NTextMatcher({
                            propertyName: "text",
                            key: "standardModify.tabTitle"
                        }),
                        actions: new Press()
                    });
                },
                iClickTheAddButton: function () {
                    this.waitFor({
                        controlType: "sap.m.Button",
                        matchers: new I18NTextMatcher({
                            propertyName: "text",
                            key: "standard.addBookmark"
                        }),
                        actions: new Press()
                    });
                },
                iClickTheCountButton: function () {
                    this.waitFor({
                        controlType: "sap.m.Button",
                        matchers: new PropertiesMatcher({
                            id: {
                                regex: {
                                    source: ".*countBookmarkButton$",
                                    flags: "g"
                                }
                            }
                        }),
                        actions: new Press()
                    });
                },
                iClickTheUpdateButton: function () {
                    this.waitFor({
                        controlType: "sap.m.Button",
                        matchers: new PropertiesMatcher({
                            id: {
                                regex: {
                                    source: ".*updateBookmarkButton$",
                                    flags: "g"
                                }
                            }
                        }),
                        actions: new Press()
                    });
                },
                iClickTheDeleteButton: function () {
                    this.waitFor({
                        controlType: "sap.m.Button",
                        matchers: new PropertiesMatcher({
                            id: {
                                regex: {
                                    source: ".*deleteBookmarkButton$",
                                    flags: "g"
                                }
                            }
                        }),
                        actions: new Press()
                    });
                },
                iClickTheContentNodeSelector: function () {
                    this.waitFor({
                        controlType: "sap.ui.core.Icon",
                        matchers: new PropertiesMatcher({
                            src: "sap-icon://value-help"
                        }),
                        actions: new Press()
                    });
                },
                iClickTheCloseButton: function () {
                    this.waitFor({
                        controlType: "sap.m.Button",
                        matchers: new PropertiesMatcher({
                            text: "Cancel"
                        }),
                        actions: new Press()
                    });
                },
                iTypeInANameOfContentNode: function (sText) {
                    this.waitFor({
                        controlType: "sap.m.MultiInput",
                        actions: new EnterText({
                            text: sText,
                            keepFocus: true
                        }),
                        success: function () {
                            return this.waitFor({
                                controlType: "sap.m.Label",
                                matchers: new PropertiesMatcher({
                                    text: sText
                                }),
                                actions: new Press()
                            });
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
                iShouldSeeTheAddConfirmation: function () {
                    this.iShouldSeeTheMessageToast("Bookmark added");
                },
                iShouldSeeTheCountConfirmation: function (iCount) {
                    this.iShouldSeeTheMessageToast(iCount + " bookmarks found");
                },
                iShouldSeeTheUpdateConfirmation: function (iCount) {
                    this.iShouldSeeTheMessageToast(iCount + " bookmarks updated.");
                },
                iShouldSeeTheDeleteConfirmation: function (iCount) {
                    this.iShouldSeeTheMessageToast(iCount + " bookmarks deleted");
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
                iShouldSeeTheValueHelpDialog: function (sTitle) {
                    this.waitFor({
                        controlType: "sap.m.Dialog",
                        matchers: new PropertiesMatcher({
                            title: sTitle
                        }),
                        success: function () {
                            Opa5.assert.ok(true, "The dialog was shown.");
                        }
                    });
                },
                iSeeTheTokenInMultiInput: function (sTokenText) {
                    this.waitFor({
                        controlType: "sap.m.Token",
                        matchers: new PropertiesMatcher({
                            text: sTokenText
                        }),
                        success: function () {
                            Opa5.assert.ok(true, "The token is visible.");
                        }
                    });
                },
                iSeeTheBookmarkTitleInput: function (sTitle) {
                    this.waitFor({
                        controlType: "sap.m.Input",
                        matchers: new BindingPathMatcher({
                            propertyPath: "/standard/title"
                        }),
                        success: function () {
                            Opa5.assert.ok(true, "The title input is visible.");
                        }
                    });
                }
            }
        }
    });
});
