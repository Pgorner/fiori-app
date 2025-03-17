// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ui/test/actions/Press",
    "sap/ui/test/actions/EnterText",
    "sap/ui/test/matchers/Properties",
    "sap/ui/core/MessageType",
    "sap/ui/test/matchers/I18NText",
    "sap/ui/test/matchers/Ancestor",
    "sap/ui/test/matchers/PropertyStrictEquals",
    "sap/ushell/opa/actions/Drag",
    "sap/ushell/opa/actions/Drop",
    "sap/f/library"
], function (Opa5, Press, EnterText, Properties, MessageType, I18NText, Ancestor, PropertyStrictEquals, Drag, Drop, fLibrary) {
    "use strict";

    const LayoutType = fLibrary.LayoutType;

    Opa5.createPageObjects({

        inTheContentFinderDialog: {
            actions: {
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
                iPressTheDialogCloseButton: function () {
                    return this.waitFor({
                        viewName: "sap.ushell.components.contentFinder.view.AppSearch",
                        controlType: "sap.m.Button",
                        id: /cancelButton/,
                        searchOpenDialogs: true,
                        actions: new Press()
                    });
                },
                iResizeDialogToSmall: function () {
                    return this.waitFor({
                        controlType: "sap.m.Dialog",
                        id: /contentFinderDialog/,
                        actions: function (oDialog) {
                            oDialog.setContentWidth("25rem");
                        }
                    });
                },
                iOpenTheDialog: function () {
                    return this.waitFor({
                        controlType: "sap.ui.core.ComponentContainer",
                        matchers: function (oContainer) {
                            return oContainer?.getComponent() === "contentFinderComponent";
                        },
                        actions: function (oContainer) {
                            return oContainer.getComponentInstance().show();
                        }
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
                iSelectAppBoxWithTitle: function (sTitle) {
                    return this.waitFor({
                        controlType: "sap.m.CustomListItem",
                        searchOpenDialogs: true,
                        matchers: function (oCustomListItem) {
                            return oCustomListItem.getBindingContext("data").getProperty("title") === sTitle;
                        },
                        check: function (aCustomListItems) {
                            return aCustomListItems.length === 1;
                        },
                        actions: new Press()
                    });
                },
                iSearchForAnApplication: function (sSearchTerm) {
                    return this.waitFor({
                        controlType: "sap.m.SearchField",
                        searchOpenDialogs: true,
                        actions: new EnterText({
                            text: sSearchTerm
                        })
                    });
                },
                iToggleSelectionView: function () {
                    return this.waitFor({
                        id: /showAllSelectedBtn/,
                        controlType: "sap.m.ToggleButton",
                        searchOpenDialogs: true,
                        actions: new Press()
                    });
                },
                iPressCategoryTreeToggleButton: function () {
                    return this.waitFor({
                        id: /categoryTreeToggleButton/,
                        controlType: "sap.m.Button",
                        actions: new Press()
                    });
                },
                iPressCategoryTreeCloseButton: function () {
                    return this.waitFor({
                        id: /categoryTreeCloseButton/,
                        controlType: "sap.m.Button",
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
                iSeeTheDialog: function (bIsOpen) {
                    return this.waitFor({
                        id: /contentFinderDialog/,
                        controlType: "sap.m.Dialog",
                        visible: false,
                        success: function (aDialogs) {
                            Opa5.assert.ok(aDialogs[0]?.isOpen() === bIsOpen, "The dialog is visible: " + bIsOpen);
                        }
                    });
                },
                iSeeTheSearchField: function () {
                    return this.waitFor({
                        id: /appSearchField/,
                        controlType: "sap.m.SearchField",
                        searchOpenDialogs: true,
                        success: function (aSearchFields) {
                            Opa5.assert.ok(aSearchFields.length === 1, "The search field was found.");
                        }
                    });
                },
                iSeeTheAppSearchTitle: function (sTitle) {
                    return this.waitFor({
                        id: /appSearchVisualizationsTitle/,
                        controlType: "sap.m.Title",
                        matchers: new Properties({
                            text: sTitle
                        }),
                        check: function (aTiles) {
                            return aTiles.length === 1;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The AppSearch title was correct: '" + sTitle + "'");
                        }
                    });
                },
                iSeeTheDialogTitle: function (sTitle) {
                    return this.waitFor({
                        searchOpenDialogs: true,
                        controlType: "sap.m.Dialog",
                        success: function (aDialogs) {
                            var oToolbar = aDialogs[0].getCustomHeader();

                            return this.waitFor({
                                ancestor: oToolbar,
                                controlType: "sap.m.Title",
                                searchOpenDialogs: true,
                                matchers: new Properties({
                                    text: sTitle
                                }),
                                success: function (aTitles) {
                                    Opa5.assert.ok(aTitles[0], "The dialog title was correct.");
                                }
                            });
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
                iSeeANumberOfAppBoxes: function (iCount) {
                    return this.waitFor({
                        searchOpenDialogs: true,
                        controlType: "sap.m.Dialog",
                        success: function (aDialogs) {
                            return this.waitFor({
                                ancestor: aDialogs[0],
                                searchOpenDialogs: true,
                                controlType: "sap.m.CustomListItem",
                                success: function (aAppBoxes) {
                                    Opa5.assert.strictEqual(aAppBoxes.length, iCount, "The number of AppBoxes was correct.");
                                }
                            });
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
                iSeeAnEmptyTilesGridList: function () {
                    return this.waitFor({
                        id: /tiles/,
                        controlType: "sap.f.GridList",
                        searchOpenDialogs: true,
                        check: function (aGridLists) {
                            return aGridLists.length === 1 && aGridLists[0].getItems().length === 0;
                        },
                        success: function (aGridLists) {
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
                iSeeTheHighlightedAppBoxWithHelpId: function (sHelpId) {
                    return this.waitFor({
                        searchOpenDialogs: true,
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
                iSeeTheAppBoxWithHelpIdAndIcon: function (sHelpId, sIcon) {
                    return this.waitFor({
                        searchOpenDialogs: true,
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
                        searchOpenDialogs: true,
                        matchers: [
                            function (oCustomListItem) {
                                return oCustomListItem.getBindingContext("data").getProperty("title") === sTitle;
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
                iSeeTheAddButton: function (oProperties) {
                    return this.waitFor({
                        id: /addVisualizationsButton/,
                        controlType: "sap.m.Button",
                        enabled: false,
                        searchOpenDialogs: true,
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
                        searchOpenDialogs: false,
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
                },
                iSeeTheCategoryTreeCloseButton: function (bVisible) {
                    return this.waitFor({
                        id: /categoryTreeCloseButton/,
                        controlType: "sap.m.Button",
                        visible: false,
                        matchers: new Properties({
                            visible: bVisible
                        }),
                        success: function (aButtons) {
                            Opa5.assert.strictEqual(aButtons.length, 1, "The category tree close button was found and is: " + bVisible);
                        }
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
                iSeeTheAppSearchNoDataMessage: function () {
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
                iDontSeeTheAvatarIfNoIconIsDefinedOnAppBox: function () {
                    return this.waitFor({
                        id: /tilesBox--appAvatar/,
                        viewName: "sap.ushell.components.contentFinder.view.AppSearch",
                        visible: false,
                        success: function (aAvatar) {
                            let bAvatarWithoutIconIsHidden = false;
                            for (const oAvatar of aAvatar) {
                                if (!oAvatar.getSrc() && !oAvatar.getVisible() || oAvatar.getSrc() && oAvatar.getVisible()) {
                                    bAvatarWithoutIconIsHidden = true;
                                } else {
                                    Opa5.assert.ok(false, "Not all avatars with undefined icons are hidden.");
                                }
                            }
                            Opa5.assert.ok(bAvatarWithoutIconIsHidden, "All avatars with undefined icons are hidden");
                        }
                    });
                },
                iDontSeeTheAvatarIfNoIconIsDefinedInList: function () {
                    return this.waitFor({
                        id: /tilesListItems--appAvatar/,
                        viewName: "sap.ushell.components.contentFinder.view.AppSearch",
                        visible: false,
                        success: function (aAvatar) {
                            let bAvatarWithoutIconIsHidden = false;
                            for (const oAvatar of aAvatar) {
                                if (!oAvatar.getSrc() && !oAvatar.getVisible() || oAvatar.getSrc() && oAvatar.getVisible()) {
                                    bAvatarWithoutIconIsHidden = true;
                                } else {
                                    Opa5.assert.ok(false, "Not all avatars with undefined icons are hidden.");
                                }
                            }
                            Opa5.assert.ok(bAvatarWithoutIconIsHidden, "All avatars with undefined icons are hidden");
                        }
                    });
                }
            }
        }
    });
});
