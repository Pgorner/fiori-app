// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ui/test/actions/Press",
    "sap/ui/test/actions/EnterText",
    "sap/ui/test/matchers/Properties",
    "sap/ui/test/matchers/I18NText",
    "sap/ui/test/matchers/Ancestor",
    "sap/ui/core/library",
    "sap/f/library"
], function (
    Opa5,
    Press,
    EnterText,
    Properties,
    I18NText,
    Ancestor,
    coreLibrary,
    fLibrary
) {
    "use strict";

    const LayoutType = fLibrary.LayoutType;
    const MessageType = coreLibrary.MessageType;

    Opa5.createPageObjects({
        onTheContentFinderStandaloneView: {
            actions: {
                iSetContextData: function (oContextData) {
                    return this.waitFor({
                        id: /contentFinderStandaloneComponentContainer/,
                        controlType: "sap.ui.core.ComponentContainer",
                        check: function (aComponentContainers) {
                            return aComponentContainers.length === 1 && aComponentContainers[0].getComponentInstance();
                        },
                        success: async function (aComponentContainers) {
                            const [oComponentContainer] = aComponentContainers;
                            oComponentContainer.getComponentInstance().setContextData(oContextData);
                        }
                    });
                },
                iSearchForAnApplication: function (sSearchTerm) {
                    return this.waitFor({
                        controlType: "sap.m.SearchField",
                        actions: new EnterText({
                            text: sSearchTerm
                        })
                    });
                },
                iSearchForACatalog: function (sSearchTerm) {
                    return this.waitFor({
                        id: /CategorySearch/,
                        actions: new EnterText({
                            text: sSearchTerm
                        })
                    });
                },
                iToggleSelectionView: function () {
                    return this.waitFor({
                        id: /showAllSelectedBtn/,
                        controlType: "sap.m.ToggleButton",
                        actions: new Press()
                    });
                },
                iOpenTheCategoriesList: function () {
                    return this.waitFor({
                        id: /categoryTreeToggleButton/,
                        controlType: "sap.m.Button",
                        actions: new Press()
                    });
                },
                iPressOnACatalog: function (sTitle) {
                    return this.waitFor({
                        controlType: "sap.m.CustomTreeItem",
                        matchers: function (oCustomTreeItem) {
                            return oCustomTreeItem.getBindingContext().getProperty("title") === sTitle;
                        },
                        actions: new Press()
                    });
                },
                iToggleListView: function () {
                    return this.waitFor({
                        id: /listBtn/,
                        controlType: "sap.m.SegmentedButtonItem",
                        actions: new Press()
                    });
                },
                iToggleGridView: function () {
                    return this.waitFor({
                        id: /gridBtn/,
                        controlType: "sap.m.SegmentedButtonItem",
                        actions: new Press()
                    });
                },
                iClickTheOverflowToolbarButton: function () {
                    return this.waitFor({
                        id: /appSearchOverflowToolbar/,
                        controlType: "sap.m.OverflowToolbar",
                        success: function (aToolbars) {
                            var oToolbar = aToolbars[0];
                            this.waitFor({
                                controlType: "sap.m.Button",
                                matchers: new Ancestor(oToolbar),
                                success: function (aOverFlowToolbarButton) {
                                    // Press the overflow toolbar button to show all contained buttons
                                    if (aOverFlowToolbarButton[0].getId().match("overflowButton")) {
                                        new Press().executeOn(aOverFlowToolbarButton[0]);
                                    }
                                }
                            });
                        }.bind(this)
                    });
                }
            },
            assertions: {
                iSeeTheSearchField: function () {
                    return this.waitFor({
                        id: /appSearchField/,
                        controlType: "sap.m.SearchField",
                        success: function (aSearchFields) {
                            Opa5.assert.ok(aSearchFields.length === 1, "The search field was found.");
                        }
                    });
                },
                iSeeTheAppSearchTitle: function (sTitle) {
                    return this.waitFor({
                        id: /appSearchVisualizationsTitle/,
                        matchers: new Properties({
                            text: sTitle
                        }),
                        check: function (aTitles) {
                            return aTitles.length === 1;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The AppSearch title was correct: '" + sTitle + "'");
                        }
                    });
                },
                iSeeTheGridList: function () {
                    return this.waitFor({
                        controlType: "sap.f.GridList",
                        success: function () {
                            Opa5.assert.ok(true, "The GridList was found.");
                        }
                    });
                },
                iSeeTheTable: function () {
                    return this.waitFor({
                        controlType: "sap.m.Table",
                        success: function () {
                            Opa5.assert.ok(true, "The Table was found.");
                        }
                    });
                },
                iSeeANumberOfAppListItems: function (iCount) {
                    return this.waitFor({
                        controlType: "sap.m.ColumnListItem",
                        success: function (aAppBoxes) {
                            Opa5.assert.strictEqual(aAppBoxes.length, iCount, "The number of List Items was correct.");
                        }
                    });
                },
                iSeeANumberOfAppBoxes: function (iCount) {
                    return this.waitFor({
                        controlType: "sap.m.CustomListItem",
                        success: function (aAppBoxes) {
                            Opa5.assert.strictEqual(aAppBoxes.length, iCount, "The number of AppBoxes was correct.");
                        }
                    });
                },
                iSeeAnEmptyTilesGridList: function () {
                    return this.waitFor({
                        id: /tiles/,
                        controlType: "sap.f.GridList",
                        check: function (aGridLists) {
                            return aGridLists.length === 1 && aGridLists[0].getItems().length === 0;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The number of items in the GridList was 0.");
                        }
                    });
                },
                iSeeTheEmptyIllustrationNoData: function () {
                    return this.waitFor({
                        controlType: "sap.m.IllustratedMessage",
                        matchers: new Properties({
                            illustrationType: "sapIllus-Tent",
                            description: "",
                            title: ""
                        }),
                        success: function () {
                            Opa5.assert.ok(true, "The empty illustration was found.");
                        },
                        errorMessage: "The empty illustration isn't visible."
                    });
                },
                iSeeTheCategoryTreeToggleButton: function (oProperties) {
                    return this.waitFor({
                        id: /categoryTreeToggleButton/,
                        controlType: "sap.m.Button",
                        visible: false,
                        matchers: oProperties ? new Properties(oProperties) : undefined,
                        success: function (aButtons) {
                            Opa5.assert.ok(aButtons.length === 1, "The category tree toggle button was found.");
                        }
                    });
                },
                // This message is used in runtime when no catalog/category is available.
                iSeeNoDataMessageWithoutCategoryTree: function () {
                    return this.waitFor({
                        controlType: "sap.m.IllustratedMessage",
                        matchers: new Properties({
                            illustrationType: "sapIllus-Tent",
                            description: "",
                            title: ""
                        }),
                        success: function () {
                            Opa5.assert.ok(true, "The empty illustration was found.");
                        },
                        errorMessage: "The empty illustration isn't visible."
                    });
                },
                iSeeNoDataMessageWithCategoryTree: function (sDescription) {
                    return this.waitFor({
                        controlType: "sap.m.IllustratedMessage",
                        matchers: [
                            new Properties({
                                illustrationType: "sapIllus-Tent"
                            }),
                            new I18NText({
                                propertyName: "title",
                                key: "ContentFinder.AppSearch.IllustratedMessage.NoItems.InCatalog.Title"
                            })],
                        success: function (aIllustratedMessage) {
                            Opa5.assert.strictEqual(aIllustratedMessage[0].getDescription(), sDescription, "The empty catalog illustration was found");
                        },
                        errorMessage: "The empty catalog illustration isn't visible"
                    });
                },
                iSeeTheSearchedCatalogsByTitle: function (sSearchTitle) {
                    return this.waitFor({
                        controlType: "sap.m.CustomTreeItem",
                        matchers: [
                            function (oSearchedItem) {
                                return oSearchedItem.getBindingContext().getProperty("title").includes(sSearchTitle);
                            }
                        ],
                        check: function (aFoundItems) {
                            return aFoundItems.length > 0;
                        },
                        success: function (oCatalogs) {
                            Opa5.assert.ok(oCatalogs.length > 0, "The searched catalogs were found.");
                        }
                    });
                },
                iSeeTheHighlightedAppBoxWithHelpId: function (sHelpId) {
                    return this.waitFor({
                        controlType: "sap.m.CustomListItem",
                        matchers: new Properties({
                            highlight: MessageType.Information
                        }),
                        success: function (aAppBoxes) {
                            var oResult = aAppBoxes.find(function (oAppBox) {
                                return oAppBox.getCustomData().find(function (oCustomData) {
                                    if (oCustomData.getKey() === "help-id" && sHelpId === oCustomData.getValue()) {
                                        return true;
                                    }
                                });
                            });

                            Opa5.assert.ok(oResult, "The AppBox with id '" + oResult + "' was highlighted.");
                        }
                    });
                },
                iSeeTheHighlightedListItemWithHelpId: function (sHelpId) {
                    return this.waitFor({
                        controlType: "sap.m.ColumnListItem",
                        matchers: new Properties({
                            highlight: MessageType.Information
                        }),
                        success: function (aListItem) {
                            var oResult = aListItem.find(function (oListItem) {
                                return oListItem.getCustomData().find(function (oCustomData) {
                                    if (oCustomData.getKey() === "help-id" && sHelpId === oCustomData.getValue()) {
                                        return true;
                                    }
                                });
                            });

                            Opa5.assert.ok(oResult, "The ListItem with id '" + oResult + "' was highlighted.");
                        }
                    });
                },
                iSeeTheAppBoxWithHelpIdAndIcon: function (sHelpId, sIcon) {
                    return this.waitFor({
                        controlType: "sap.m.CustomListItem",
                        matchers: [
                            function (oAppBox) {
                                return !!oAppBox.getCustomData().find(function (oCustomData) {
                                    if (oCustomData.getKey() === "help-id" && sHelpId === oCustomData.getValue()) {
                                        return true;
                                    }
                                });
                            },
                            function (oAppBox) {
                                return !!oAppBox.findElements(true).find(function (oElement) {
                                    return oElement.isA("sap.m.Avatar") && oElement.getSrc() === sIcon;
                                });
                            }
                        ],
                        check: function (aAppBoxes) {
                            return aAppBoxes.length === 1;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The AppBox with helpId '" + sHelpId + "' had icon '" + sIcon + "'.");
                        }
                    });
                },
                iSeeTheAppBoxWithTitleSelected: function (sTitle) {
                    return this.waitFor({
                        controlType: "sap.m.CustomListItem",
                        matchers: [
                            function (oCustomListItem) {
                                return oCustomListItem.getBindingContext().getProperty("title") === sTitle;
                            }
                        ],
                        check: function (aCustomListItems) {
                            return aCustomListItems.length === 1;
                        },
                        success: function (aCustomListItems) {
                            Opa5.assert.strictEqual(true, aCustomListItems[0].getSelected(), "The listItem with title '" + sTitle + "' was selected.");
                        }
                    });
                },
                iSeeTheOpenAppButton: function () {
                    return this.waitFor({
                        controlType: "sap.m.Button",
                        matchers: new Properties({
                            icon: "sap-icon://popup-window"
                        }),
                        ancestor: {
                            controlType: "sap.m.CustomListItem",
                            viewName: "sap.ushell.components.contentFinder.view.AppSearch"
                        },
                        success: function (vControls) {
                            var oControl = vControls[0] || vControls;
                            Opa5.assert.strictEqual(oControl.getIcon(), "sap-icon://popup-window");
                        }
                    });
                },
                iSeeTheAddButton: function (oProperties) {
                    return this.waitFor({
                        id: /addVisualizationsButton/,
                        controlType: "sap.m.Button",
                        enabled: false,
                        matchers: new Properties(oProperties),
                        check: function (aButtons) {
                            return aButtons.length === 1;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The 'Add' button had the correct properties: '" + JSON.stringify(oProperties) + "'");
                        }
                    });
                },
                iSeeTheSelectionToggleButton: function (oProperties) {
                    return this.waitFor({
                        id: /showAllSelectedBtn/,
                        controlType: "sap.m.ToggleButton",
                        enabled: false,
                        visible: false,
                        matchers: new Properties(oProperties),
                        check: function (aButtons) {
                            return aButtons.length === 1;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The 'Toggle Selection View' button had the correct properties: '" + JSON.stringify(oProperties) + "'");
                        }
                    });
                },
                iSeeTheCategoryTree: function (bVisible) {
                    return this.waitFor({
                        id: /contentFinderAppSearchFlexibleColumnLayout/,
                        controlType: "sap.f.FlexibleColumnLayout",
                        success: function (aFlexibleColumnLayouts) {
                            const sLayout = aFlexibleColumnLayouts[0]?.getLayout();
                            const sMaxColumnsCount = aFlexibleColumnLayouts[0]?.getMaxColumnsCount();
                            if (bVisible) {
                                Opa5.assert.ok(
                                    (sLayout === LayoutType.TwoColumnsMidExpanded && sMaxColumnsCount > 1)
                                    || (sLayout === LayoutType.OneColumn && sMaxColumnsCount === 1),
                                    "The category tree is expanded."
                                );
                            } else {
                                Opa5.assert.ok(
                                    sLayout === LayoutType.MidColumnFullScreen
                                    || sLayout === LayoutType.TwoColumnsMidExpanded && sMaxColumnsCount === 1,
                                    "The category tree is collapsed."
                                );
                            }
                        }
                    });
                }
            }
        }
    });
});
