// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/actions/Press",
    "sap/ui/test/matchers/Ancestor",
    "sap/ui/test/matchers/I18NText",
    "sap/ui/test/matchers/Properties",
    "sap/ui/test/Opa5",
    "sap/ushell/resources"
], function (
    Press,
    AncestorMatcher,
    I18NTextMatcher,
    PropertiesMatcher,
    Opa5,
    resources
) {
    "use strict";

    Opa5.createPageObjects({
        onTheAboutDialog: {
            actions: {
                iPressTheCloseButton: function () {
                    return this.waitFor({
                        searchOpenDialogs: true,
                        controlType: "sap.m.Button",
                        matchers: new PropertiesMatcher({
                            text: resources.i18n.getText("closeBtn")
                        }),
                        actions: new Press()
                    });
                },
                iPressTheSystemDetailsListItem: function () {
                    return this.waitFor({
                        searchOpenDialogs: true,
                        controlType: "sap.m.StandardListItem",
                        matchers: new I18NTextMatcher({
                            propertyName: "title",
                            key: "aboutCategorySystem"
                        }),
                        actions: new Press()
                    });
                },
                iPressTheEnvironmentDetailsListItem: function () {
                    return this.waitFor({
                        searchOpenDialogs: true,
                        controlType: "sap.m.StandardListItem",
                        matchers: new I18NTextMatcher({
                            propertyName: "title",
                            key: "aboutCategoryEnvironment"
                        }),
                        actions: new Press()
                    });
                }
            },
            assertions: {
                iSeeTheAboutDialog: function () {
                    return this.waitFor({
                        fragmentId: "aboutDialogFragment",
                        controlType: "sap.m.Dialog",
                        matchers: new I18NTextMatcher({
                            propertyName: "title",
                            key: "about"
                        }),
                        success: function () {
                            Opa5.assert.ok(true, "About dialog should be opened.");
                        },
                        errorMessage: "About dialog was not found"
                    });
                },
                iSeeTheFieldWithText: function (sText) {
                    return this.waitFor({
                        searchOpenDialogs: true,
                        controlType: "sap.m.Text",
                        matchers: new PropertiesMatcher({
                            text: sText
                        }),
                        success: function () {
                            Opa5.assert.ok(true, "The field with text '" + sText + "' was visible.");
                        }
                    });
                },
                iSeeTheFieldWithTextAndI18nKey: function (sText, sI18nKey) {
                    return this.waitFor({
                        searchOpenDialogs: true,
                        controlType: "sap.m.Label",
                        matchers: new I18NTextMatcher({
                            propertyName: "text",
                            key: sI18nKey
                        }),
                        success: function (aLabels) {
                            const oLabel = aLabels[0];
                            return this.waitFor({
                                searchOpenDialogs: true,
                                controlType: "sap.m.Text",
                                matchers: [
                                    // sap.ui.layout.form.FormElement
                                    new AncestorMatcher(oLabel.getParent()),
                                    new PropertiesMatcher({
                                        text: sText
                                    })
                                ],
                                success: function () {
                                    Opa5.assert.ok(true, `The field with text '${sText}' and label '${sI18nKey}' was visible.`);
                                }
                            });
                        }
                    });
                },
                iSeeTheFieldWithTextAndLabel: function (sText, sLabel) {
                    return this.waitFor({
                        searchOpenDialogs: true,
                        controlType: "sap.m.Label",
                        matchers: new PropertiesMatcher({
                            text: sLabel
                        }),
                        success: function (aLabels) {
                            const oLabel = aLabels[0];
                            return this.waitFor({
                                searchOpenDialogs: true,
                                controlType: "sap.m.Text",
                                matchers: [
                                    // sap.ui.layout.form.FormElement
                                    new AncestorMatcher(oLabel.getParent()),
                                    new PropertiesMatcher({
                                        text: sText
                                    })
                                ],
                                success: function () {
                                    Opa5.assert.ok(true, `The field with text '${sText}' and label '${sLabel}' was visible.`);
                                }
                            });
                        }
                    });
                },
                iDoNotSeeTheLabel: function (sLabel) {
                    return this.waitFor({
                        searchOpenDialogs: true,
                        controlType: "sap.m.Label",
                        check: function (aLabels) {
                            return aLabels.every(function (oLabel) {
                                return oLabel.getText() !== sLabel;
                            });
                        },
                        success: function () {
                            Opa5.assert.ok(true, `The label '${sLabel}' was not found.`);
                        }
                    });
                },
                iSeeNumberOfListItem: function (iNumberOfListItem) {
                    return this.waitFor({
                        searchOpenDialogs: true,
                        controlType: "sap.m.SplitContainer",
                        success: function (aSplitContainer) {
                            const oFirstMasterPage = aSplitContainer[0].getMasterPages()[0];
                            this.waitFor({
                                controlType: "sap.m.StandardListItem",
                                matchers: new AncestorMatcher(oFirstMasterPage),
                                check: function (aListItems) {
                                    return aListItems.length === iNumberOfListItem;
                                },
                                success: function () {
                                    Opa5.assert.ok(true, "The About Dialog containing " + iNumberOfListItem + " ListItems was created.");
                                }
                            });
                        }
                    });
                }
            }
        }
    });
});
