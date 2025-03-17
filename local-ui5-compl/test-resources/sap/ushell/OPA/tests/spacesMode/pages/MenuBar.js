// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ui/test/actions/Press",
    "sap/ui/test/matchers/Properties",
    "sap/ui/test/matchers/Descendant",
    "sap/ui/test/matchers/Ancestor",
    "sap/base/util/deepEqual"
], function (
    Opa5,
    Press,
    PropertiesMatcher,
    DescendantMatcher,
    AncestorMatcher,
    deepEqual
) {
    "use strict";

    Opa5.createPageObjects({
        onTheMenuBar: {
            actions: {
                iClickOnMenuEntry: function (title) {
                    this.waitFor({
                        controlType: "sap.m.IconTabFilter",
                        matchers: new PropertiesMatcher({
                            text: title
                        }),
                        actions: new Press()
                    });
                },
                iClickOnMoreNextToAMenuEntry: function (sText) {
                    return this.waitFor({
                        controlType: "sap.m.IconTabFilter",
                        matchers: new PropertiesMatcher({
                            text: sText
                        }),
                        success: function (aIconTabFilter) {
                            return this.waitFor({
                                controlType: "sap.ui.core.Icon",
                                matchers: new AncestorMatcher(aIconTabFilter[0]),
                                actions: new Press()
                            });
                        }
                    });
                },
                iClickOnThePersonalizationButton: function () {
                    return this.waitFor({
                        controlType: "sap.m.Button",
                        matchers: {
                            i18NText: {
                                propertyName: "tooltip",
                                key: "NavigationBarMenu.Button.OpenPopover"
                            }
                        },
                        actions: new Press()
                    });
                }
            },
            assertions: {
                iSeeTheMenuBarIsEnabled: function () {
                    return this.waitFor({
                        controlType: "sap.ui.core.ComponentContainer",
                        id: "menuBarComponentContainer",
                        success: function (aMenubarComponent) {
                            return this.waitFor({
                                controlType: "sap.m.IconTabFilter",
                                matchers: [
                                    new AncestorMatcher(aMenubarComponent[0])
                                ],
                                success: function (aIconTabFilters) {
                                    aIconTabFilters.forEach(function (oIconTabFilter) {
                                        Opa5.assert.ok(oIconTabFilter.getEnabled(), "The IconTabFilter with text '" + oIconTabFilter.getText() + "' is enabled");
                                    });
                                }
                            });
                        }
                    });
                },
                iSeeTheMenuEntriesInTheOrder: function (aTexts) {
                    return this.waitFor({
                        controlType: "sap.m.IconTabFilter",
                        check: function (aIconTabFilters) {
                            var aIconTabFilterTexts = aIconTabFilters.map(function (oItem) {
                                return oItem.getText();
                            });

                            return deepEqual(aIconTabFilterTexts, aTexts);
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The menu entries are displayed in the correct order");
                        }
                    });
                },
                iSeeTheEntryHighlighted: function (title) {
                    this.waitFor({
                        controlType: "sap.m.IconTabFilter",
                        matchers: new PropertiesMatcher({
                            text: title
                        }),
                        success: function (aIconTabFilter) {
                            this.waitFor({
                                controlType: "sap.m.IconTabHeader",
                                matchers: [
                                    new DescendantMatcher(aIconTabFilter[0]),
                                    new PropertiesMatcher({
                                        selectedKey: aIconTabFilter[0].getKey()
                                    })
                                ],
                                success: function () {
                                    Opa5.assert.ok(true, "MenuEntry with text is selected.");
                                }
                            });
                        }
                    });
                },
                iSeeFocusOnMenuEntry: function (sTitle) {
                    return this.waitFor({
                        controlType: "sap.m.IconTabFilter",
                        matchers: new PropertiesMatcher({
                            text: sTitle
                        }),
                        enabled: false,
                        check: function (aIconTabFilter) {
                            return aIconTabFilter[0].getFocusDomRef() === document.activeElement;
                        },
                        success: function (oIconTabFilter) {
                            Opa5.assert.ok(oIconTabFilter, "Menu entry was focused.");
                        }
                    });
                },
                iSeeTheSeparatorAtIndex: function (sIndex) {
                    return this.waitFor({
                        controlType: "sap.m.IconTabHeader",
                        check: function (aIconTabHeaders) {
                            var aItems = aIconTabHeaders[0].getItems();
                            return aItems[sIndex].getMetadata().getName() === "sap.m.IconTabSeparator";
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The separator is in the correct position");
                        }
                    });
                },
                iSeeThatTheNavigationBarMenuButtonIsDisabled: function () {
                    return this.waitFor({
                        controlType: "sap.m.Button",
                        // this property is needed so that the button is also found if it is disabled
                        // however, the button is also found if it is enabled, so it is checked explicitly in the check function
                        enabled: false,
                        matchers: {
                            i18NText: {
                                propertyName: "tooltip",
                                key: "NavigationBarMenu.Button.OpenPopover"
                            }
                        },
                        check: function (aButtons) {
                            return aButtons.length === 1 && aButtons[0].getEnabled() === false;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The navigation bar menu button is disabled");
                        }
                    });
                }
            }
        }
    });
});
