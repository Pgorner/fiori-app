// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/m/library",
    "sap/ui/test/actions/EnterText",
    "sap/ui/test/actions/Press",
    "sap/ui/test/matchers/I18NText",
    "sap/ui/test/matchers/Properties",
    "sap/ui/test/Opa5"
], function (
    mobileLibrary,
    EnterText,
    Press,
    I18NTextMatcher,
    Properties,
    Opa5
) {
    "use strict";

    // shortcut for sap.m.ButtonType
    var ButtonType = mobileLibrary.ButtonType;

    Opa5.createPageObjects({
        onTheUserDefaultsPage: {
            actions: {
                iTypeIntoInputFieldWithName: function (name, value) {
                    return this.waitFor({
                        controlType: "sap.m.Input",
                        matchers: new Properties({
                            name: name
                        }),
                        actions: new EnterText({
                            clearTextFirst: true,
                            text: value,
                            pressEnterKey: true
                        })
                    });
                },
                iSelectView: function (name) {
                    return this.waitFor({
                        controlType: "sap.m.Button",
                        id: new RegExp("defaultSettingsVariantManagement"),
                        actions: new Press(),
                        success: function () {
                            return this.waitFor({
                                controlType: "sap.ui.core.Item",
                                searchOpenDialogs: true,
                                matchers: new Properties({
                                    text: name
                                }),
                                actions: new Press()
                            });
                        }
                    });
                },
                iSelectStandardView: function () {
                    return this.waitFor({
                        controlType: "sap.m.Button",
                        id: new RegExp("defaultSettingsVariantManagement"),
                        actions: new Press(),
                        success: function () {
                            return this.waitFor({
                                controlType: "sap.ui.core.Item",
                                searchOpenDialogs: true,
                                matchers: new Properties({
                                    key: "*standard*"
                                }),
                                actions: new Press()
                            });
                        }
                    });
                }
            },
            assertions: {
                iSeeTheDirtyStateAsterisk: function () {
                    return this.waitFor({
                        controlType: "sap.ui.comp.smartvariants.SmartVariantManagement",
                        check: function (aControls) {
                            return aControls[0].getDomRef().innerText.endsWith("*");
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The dirty state asterisk was visible.");
                        }
                    });
                },
                iSeeTheDiffStateText: function (text) {
                    return this.waitFor({
                        controlType: "sap.m.Text",
                        matchers: new Properties({
                            text: text
                        }),
                        success: function () {
                            Opa5.assert.ok(true, "The dirty state text was visible.");
                        }
                    });
                },
                iDoNotSeeTheDiffStateText: function (text) {
                    return this.waitFor({
                        controlType: "sap.m.Text",
                        visible: false,
                        matchers: new Properties({
                            text: text,
                            visible: false
                        }),
                        success: function () {
                            Opa5.assert.ok(true, "The dirty state text was not visible.");
                        }
                    });
                },
                iSeeTheInputFieldWithNameAndValue: function (name, value) {
                    return this.waitFor({
                        controlType: "sap.m.Input",
                        matchers: new Properties({
                            name: name,
                            value: value
                        }),
                        success: function () {
                            Opa5.assert.ok(true, "The input field with name '" + name + "' was visible and had the value '" + value + "'.");
                        }
                    });
                },
                iSeeTheAdditionalValuesButton: function (emphasized) {
                    return this.waitFor({
                        controlType: "sap.m.Button",
                        matchers: [
                            new Properties({
                                type: emphasized ? ButtonType.Emphasized : ButtonType.Transparent
                            }),
                            new I18NTextMatcher({
                                propertyName: "text",
                                key: "userDefaultsExtendedParametersTitle"
                            })
                        ],
                        success: function () {
                            Opa5.assert.ok(true, "The \"Additional Values\" button was visible and in the correct state.");
                        }
                    });
                }
            }
        }
    });
});
