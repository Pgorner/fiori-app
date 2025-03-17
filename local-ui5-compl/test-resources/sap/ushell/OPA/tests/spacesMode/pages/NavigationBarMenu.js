// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ui/test/actions/Press",
    "sap/ui/test/actions/Drag",
    "sap/ui/test/actions/Drop",
    "sap/ushell/opa/actions/Focus",
    "sap/base/util/deepEqual"
], function (
    Opa5,
    Press,
    Drag,
    Drop,
    Focus,
    deepEqual
) {
    "use strict";

    Opa5.createPageObjects({
        onTheNavigationBarMenu: {
            actions: {
                iClickThePinButtonOnTheAllSpacesMenuEntry: function (sText) {
                    return this.waitFor({
                        controlType: "sap.m.Button",
                        matchers: {
                            ancestor: {
                                controlType: "sap.m.CustomTreeItem",
                                properties: {
                                    tooltip: sText
                                },
                                ancestor: {
                                    controlType: "sap.m.Tree",
                                    i18NText: {
                                        propertyName: "noDataText",
                                        key: "NavigationBarMenu.AllSpaces.NoDataText"
                                    }
                                }
                            }
                        },
                        actions: new Press()
                    });
                },
                iClickThePinButtonOnThePinnedSpacesMenuEntry: function (sText) {
                    return this.waitFor({
                        controlType: "sap.m.Button",
                        matchers: {
                            ancestor: {
                                controlType: "sap.m.CustomTreeItem",
                                properties: {
                                    tooltip: sText
                                },
                                ancestor: {
                                    controlType: "sap.m.Tree",
                                    i18NText: {
                                        propertyName: "noDataText",
                                        key: "NavigationBarMenu.PinnedSpaces.NoDataText"
                                    }
                                }
                            }
                        },
                        actions: new Press()
                    });
                },
                iExpandTheSpace: function (sText) {
                    return this.waitFor({
                        controlType: "sap.ui.core.Icon",
                        matchers: {
                            ancestor: {
                                controlType: "sap.m.CustomTreeItem",
                                properties: {
                                    tooltip: sText
                                },
                                ancestor: {
                                    controlType: "sap.m.Tree",
                                    i18NText: {
                                        propertyName: "noDataText",
                                        key: "NavigationBarMenu.AllSpaces.NoDataText"
                                    }
                                }
                            }
                        },
                        actions: function (oIcon) {
                            oIcon.firePress();
                        }
                    });
                },
                iClickTheAllSpacesItem: function (sText) {
                    return this.waitFor({
                        controlType: "sap.m.CustomTreeItem",
                        matchers: {
                            properties: {
                                tooltip: sText
                            }
                        },
                        actions: new Press()
                    });
                },
                iClickTheUnpinAllSpacesButton: function (sText) {
                    return this.waitFor({
                        controlType: "sap.m.Button",
                        matchers: {
                            i18NText: {
                                propertyName: "text",
                                key: "NavigationBarMenu.Button.UnpinAll"
                            }
                        },
                        actions: new Press()
                    });
                },
                iDragThePinnedSpacesEntry: function (sText) {
                    return this.waitFor({
                        controlType: "sap.m.CustomTreeItem",
                        matchers: {
                            properties: {
                                tooltip: sText
                            },
                            ancestor: {
                                controlType: "sap.m.Tree",
                                i18NText: {
                                    propertyName: "noDataText",
                                    key: "NavigationBarMenu.PinnedSpaces.NoDataText"
                                }
                            }
                        },
                        actions: new Drag()
                    });
                },
                iDropThePinnedSpacesEntry: function (sDropPosition, sText) {
                    return this.waitFor({
                        controlType: "sap.m.CustomTreeItem",
                        matchers: {
                            properties: {
                                tooltip: sText
                            },
                            ancestor: {
                                controlType: "sap.m.Tree",
                                i18NText: {
                                    propertyName: "noDataText",
                                    key: "NavigationBarMenu.PinnedSpaces.NoDataText"
                                }
                            }
                        },
                        actions: new Drop({
                            before: sDropPosition === "before"
                        })
                    });
                },
                iPlaceTheFocusOnPinnedSpacePinButton: function (sText) {
                    return this.waitFor({
                        controlType: "sap.m.Button",
                        matchers: {
                            ancestor: {
                                controlType: "sap.m.CustomTreeItem",
                                properties: {
                                    tooltip: sText
                                },
                                ancestor: {
                                    controlType: "sap.m.Tree",
                                    i18NText: {
                                        propertyName: "noDataText",
                                        key: "NavigationBarMenu.PinnedSpaces.NoDataText"
                                    }
                                }
                            }
                        },
                        actions: new Focus()
                    });
                },
                iPlaceTheFocusOnAllSpacePinButton: function (sText) {
                    return this.waitFor({
                        controlType: "sap.m.Button",
                        matchers: {
                            ancestor: {
                                controlType: "sap.m.CustomTreeItem",
                                properties: {
                                    tooltip: sText
                                },
                                ancestor: {
                                    controlType: "sap.m.Tree",
                                    i18NText: {
                                        propertyName: "noDataText",
                                        key: "NavigationBarMenu.AllSpaces.NoDataText"
                                    }
                                }
                            }
                        },
                        actions: new Focus()
                    });
                },
                iPlaceTheFocusOnAllSpace: function (sText) {
                    return this.waitFor({
                        controlType: "sap.m.CustomTreeItem",
                            matchers: {
                                properties: {
                                    tooltip: sText
                                },
                                ancestor: {
                                    controlType: "sap.m.Tree",
                                    i18NText: {
                                        propertyName: "noDataText",
                                        key: "NavigationBarMenu.AllSpaces.NoDataText"
                                    }
                                }
                            },
                        actions: new Focus()
                    });
                }
            },
            assertions: {
                iSeeTheAllSpacesEntriesInTheOrder: function (aTexts) {
                    return this.waitFor({
                        controlType: "sap.m.CustomTreeItem",
                        matchers: {
                            ancestor: {
                                controlType: "sap.m.Tree",
                                i18NText: {
                                    propertyName: "noDataText",
                                    key: "NavigationBarMenu.AllSpaces.NoDataText"
                                }
                            }
                        },
                        check: function (aItems) {
                            var aItemTexts = aItems.map(function (oItem) {
                                return oItem.getTooltip();
                            });

                            return deepEqual(aItemTexts, aTexts);
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The pinned spaces entries are displayed in the correct order");
                        }
                    });
                },
                iSeeThePinnedSpacesEntriesInTheOrder: function (aTexts) {
                    return this.waitFor({
                        controlType: "sap.m.CustomTreeItem",
                        matchers: {
                            ancestor: {
                                controlType: "sap.m.Tree",
                                i18NText: {
                                    propertyName: "noDataText",
                                    key: "NavigationBarMenu.PinnedSpaces.NoDataText"
                                }
                            }
                        },
                        check: function (aItems) {
                            var aItemTexts = aItems.map(function (oItem) {
                                return oItem.getTooltip();
                            });

                            return deepEqual(aItemTexts, aTexts);
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The pinned spaces entries are displayed in the correct order");
                        }
                    });
                },
                iSeeNoPinnedSpacesEntries: function () {
                    return this.waitFor({
                        controlType: "sap.m.Tree",
                        matchers: {
                            i18NText: {
                                propertyName: "noDataText",
                                key: "NavigationBarMenu.PinnedSpaces.NoDataText"
                            }
                        },
                        check: function (aTrees) {
                            return aTrees[0].getItems().length === 0;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "There are no pinned spaces entries");
                        }
                    });
                },
                iSeeTheFocusOnPinnedSpace: function (sText) {
                    return this.waitFor({
                        controlType: "sap.m.CustomTreeItem",
                        matchers: {
                            properties: {
                                tooltip: sText
                            },
                            ancestor: {
                                controlType: "sap.m.Tree",
                                i18NText: {
                                    propertyName: "noDataText",
                                    key: "NavigationBarMenu.PinnedSpaces.NoDataText"
                                }
                            }
                        },
                        check: function (aItems) {
                            if (aItems.length !== 1) {
                                return false;
                            }

                            var oPinnedSpaceItem = aItems[0];

                            return document.activeElement === oPinnedSpaceItem.getFocusDomRef();
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The focus is on the correct pinned space.");
                        }
                    });
                },
                iSeeTheFocusOnAllSpace: function (sText) {
                    return this.waitFor({
                        controlType: "sap.m.CustomTreeItem",
                        matchers: {
                            properties: {
                                tooltip: sText
                            },
                            ancestor: {
                                controlType: "sap.m.Tree",
                                i18NText: {
                                    propertyName: "noDataText",
                                    key: "NavigationBarMenu.AllSpaces.NoDataText"
                                }
                            }
                        },
                        check: function (aItems) {
                            if (aItems.length !== 1) {
                                return false;
                            }

                            var oSpaceItem = aItems[0];

                            return document.activeElement === oSpaceItem.getFocusDomRef();
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The focus is on the correct space.");
                        }
                    });
                },
                iSeeTheFocusOnPinnedSpacePinButton: function (sText) {
                    return this.waitFor({
                        controlType: "sap.m.Button",
                        matchers: {
                            ancestor: {
                                controlType: "sap.m.CustomTreeItem",
                                properties: {
                                    tooltip: sText
                                },
                                ancestor: {
                                    controlType: "sap.m.Tree",
                                    i18NText: {
                                        propertyName: "noDataText",
                                        key: "NavigationBarMenu.PinnedSpaces.NoDataText"
                                    }
                                }
                            }
                        },
                        check: function (aButtons) {
                            if (aButtons.length !== 1) {
                                return false;
                            }

                            var oPinButton = aButtons[0];

                            return document.activeElement === oPinButton.getFocusDomRef();
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The focus is on the correct pin button.");
                        }
                    });
                },
                iSeeTheFocusOnAllSpacePinButton: function (sText) {
                    return this.waitFor({
                        controlType: "sap.m.Button",
                        matchers: {
                            ancestor: {
                                controlType: "sap.m.CustomTreeItem",
                                properties: {
                                    tooltip: sText
                                },
                                ancestor: {
                                    controlType: "sap.m.Tree",
                                    i18NText: {
                                        propertyName: "noDataText",
                                        key: "NavigationBarMenu.AllSpaces.NoDataText"
                                    }
                                }
                            }
                        },
                        check: function (aButtons) {
                            if (aButtons.length !== 1) {
                                return false;
                            }

                            var oPinButton = aButtons[0];

                            return document.activeElement === oPinButton.getFocusDomRef();
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The focus is on the correct pin button.");
                        }
                    });
                }
            }
        }
    });
});
