// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/actions/Press",
    "sap/ui/test/matchers/Properties",
    "sap/ui/test/Opa5",
    "sap/ui/test/OpaBuilder",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/opa/matchers/DOMDescendant"
], function (
    Press,
    PropertiesMatcher,
    Opa5,
    OpaBuilder,
    jQuery,
    DOMDescendantMatcher
) {
    "use strict";

    Opa5.createPageObjects({
        onTheHomepage: {
            actions: {
                iPressOnTheUserActionsMenuButton: function () {
                    return this.waitFor({
                        id: "userActionsMenuHeaderButton",
                        controlType: "sap.m.Avatar",
                        visible: false,
                        actions: new Press(),
                        errorMessage: "No me area button"
                    });
                },
                iPressOnTheOpenedSearchButton: function () {
                    return this.waitFor({
                        id: "searchFieldInShell-button",
                        actions: new Press(),
                        errorMessage: "Opened search button (searchFieldInShell-button) is not rendered"
                    });
                },
                iPressOnTheCopilotButton: function () {
                    return this.waitFor({
                        id: "copilotBtn",
                        actions: new Press(),
                        errorMessage: "No copilot button"
                    });
                },
                iCloseLogoutDialog: function () {
                    return this.waitFor({
                        searchOpenDialogs: true,
                        controlType: "sap.m.Dialog",
                        actions: function (oDialog) {
                            oDialog.getButtons()[1].firePress(); // press the cancel button
                        },
                        errorMessage: "Sign out dialog was not found"
                    });
                },
                iCloseAboutDialog: function () {
                    return this.waitFor({
                        searchOpenDialogs: true,
                        controlType: "sap.m.Dialog",
                        actions: function (oDialog) {
                            oDialog.getBeginButton().firePress(); // press the OK button
                        },
                        errorMessage: "About dialog was not found"
                    });
                },
                iPressOnThePlusTile: function () {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.PlusTile",
                        actions: new Press(),
                        errorMessage: "Plus Tile was not found"
                    });
                },
                iPressOnTheAddGroupButton: function () {
                    return this.waitFor({
                        id: "sapUshellAddGroupBtn",
                        actions: new Press(),
                        errorMessage: "Add Group button was not found"
                    });
                },
                iPressOnTheGenericTileWithTitle: function (sTitle) {
                    return this.waitFor({
                        controlType: "sap.m.GenericTile",
                        matchers: new PropertiesMatcher({
                            header: sTitle
                        }),
                        actions: new Press(),
                        errorMessage: "No generic tile with this title: " + sTitle + " was found"
                    });
                },
                iNavigateBack: function () {
                    this.waitFor({
                        controlType: "sap.ushell.ui.shell.ShellHeadItem",
                        id: "backBtn",
                        actions: new Press()
                    });
                }
            },
            assertions: {
                iShouldSeeSmallTiles: function () {
                    return this.waitFor({
                        matchers: function () {
                            return document.querySelector(".sapMGT.OneByOne");
                        },
                        success: function (oElement) {
                            Opa5.assert.strictEqual(oElement.offsetWidth, 148, "tiles have a small size");
                            Opa5.assert.strictEqual(oElement.offsetHeight, 148, "tiles have a small size");
                        },
                        errorMessage: "Tiles have the wrong size"
                    });
                },
                iShouldSeeResponsiveTiles: function () {
                    return this.waitFor({
                        matchers: function () {
                            return document.querySelector(".sapMGT.OneByOne");
                        },
                        success: function (oElement) {
                            Opa5.assert.strictEqual(oElement.offsetWidth, 176, "tiles have a regular size");
                            Opa5.assert.strictEqual(oElement.offsetHeight, 176, "tiles have a regular size");
                        },
                        errorMessage: "Tiles have the wrong size"
                    });
                },
                iShouldSeeHomepageInEditMode: function () {
                    return this.waitFor({
                        id: "dashboardGroups",
                        success: function (oDashboard) {
                            Opa5.assert.ok(
                                oDashboard.getModel().getProperty("/tileActionModeActive"),
                                "tileActionModeActive in homepage model should be true"
                            );
                        },
                        errorMessage: "Dashboard was not found"
                    });
                },
                iShouldSeeTheCopilotButton: function () {
                    return this.waitFor({
                        id: "copilotBtn",
                        success: function (oCopilotBtn) {
                            Opa5.assert.ok(!!oCopilotBtn, "Copilot button should exist.");
                        },
                        errorMessage: "Copilot button was not found"
                    });
                },
                iShouldSeeFloatingContainer: function () {
                    return this.waitFor({
                        id: "shell-floatingContainer",
                        success: function (oFloatingContainer) {
                            var bIsVisible = oFloatingContainer.$().is(":visible");
                            var bIsFloating = oFloatingContainer.$().offset().top > 0;
                            Opa5.assert.ok(bIsVisible && bIsFloating, "FloatingContainer should be opened and floating.");
                        },
                        errorMessage: "FloatingContainer was not found"
                    });
                },
                iShouldNotSeeFloatingContainer: function () {
                    return this.waitFor({
                        controlType: "sap.ushell.components.shell.FloatingContainer.controls.FloatingContainer",
                        visible: false,
                        success: function (aFloatingContainer) {
                            Opa5.assert.ok(aFloatingContainer.length, "FloatingContainer is closed.");
                        },
                        errorMessage: "FloatingContainer was not found"
                    });
                },
                iShouldSeeFooterInEditMode: function () {
                    return this.waitFor({
                        id: "sapUshellDashboardFooter",
                        success: function (oFooter) {
                            Opa5.assert.ok(true, "Footer should be shown in edit mode");
                        },
                        errorMessage: "Footer was not found"
                    });
                },
                iShouldNotSeeFooterInEditMode: function () {
                    return this.waitFor({
                        id: "sapUshellDashboardFooter",
                        visible: false,
                        success: function (oFooter) {
                            Opa5.assert.ok(true, "Footer is invisible");
                        },
                        errorMessage: "Footer was not found"
                    });
                },
                iShouldSeeLogoutDialog: function () {
                    return this.waitFor({
                        searchOpenDialogs: true,
                        controlType: "sap.m.Dialog",
                        success: function (oDialog) {
                            Opa5.assert.ok(true, "Sign out dialog is shown.");
                        },
                        errorMessage: "Sign out dialog was not found"
                    });
                },
                iShouldNotSeeLogoutDialog: function () {
                    return this.waitFor({
                        controlType: "sap.m.Dialog",
                        visible: false,
                        check: function (aDialogs) {
                            for (var i = 0; i < aDialogs.length; i++) {
                                if (aDialogs[i].isOpen()) {
                                    return false;
                                }
                            }
                            return true;
                        },
                        success: function (oDialog) {
                            Opa5.assert.ok(true, "Sign out dialog should be invisible.");
                        },
                        errorMessage: "Sign out dialog was not found"
                    });
                },
                iShouldSeeQuickAccessDialog: function () {
                    return this.waitFor({
                        id: "quickAccess",
                        success: function (oDialog) {
                            Opa5.assert.ok(oDialog.isOpen(), "Quick Access dialog should be opened.");
                        },
                        errorMessage: "Quick Access dialog was not found"
                    });
                },
                iShouldSeeAboutDialog: function () {
                    return this.waitFor({
                        id: "aboutDialogFragment--aboutDialog",
                        controlType: "sap.m.Dialog",
                        success: function (oDialog) {
                            Opa5.assert.ok(oDialog.isOpen(), "About dialog was opened");
                        },
                        errorMessage: "About dialog was not found"
                    });
                },
                iShouldNotSeeAboutDialog: function () {
                    return this.waitFor({
                        controlType: "sap.m.Dialog",
                        visible: false,
                        check: function (aDialogs) {
                            for (var i = 0; i < aDialogs.length; i++) {
                                if (aDialogs[i].getId() === "aboutDialogFragment--aboutDialog") {
                                    return false;
                                }
                            }
                            return true;
                        },
                        success: function (oDialog) {
                            Opa5.assert.ok(true, "About dialog is closed");
                        },
                        errorMessage: "About dialog was not found"
                    });
                },
                iShouldSeeTheGenericTileWithTitle: function (sTitle) {
                    return OpaBuilder.create(this)
                        .hasType("sap.m.GenericTile")
                        .hasProperties({
                            header: sTitle
                        })
                        .description("GenericTile with title " + sTitle)
                        .error("No generic tile with this title: " + sTitle + " was found")
                        .execute();
                },
                iShouldSeeTheGenericTileWithTitleNTimes: function (sTitle, iCount) {
                    return OpaBuilder.create(this)
                        .hasType("sap.m.GenericTile")
                        .hasProperties({
                            header: sTitle
                        })
                        .description("GenericTile with title " + sTitle + ", " + iCount + " time(s)")
                        .checkNumberOfMatches(iCount)
                        .error("The generic tile with the title \"" + sTitle + "\" was not found " + iCount + " times.")
                        .execute();
                },
                iShouldNotSeeTheGenericTileWithTitle: function (sHeader) {
                    return this.waitFor({
                        controlType: "sap.m.GenericTile",
                        check: function (aGenericTiles) {
                            var oResult = aGenericTiles.find(function (oGenericTile) {
                                return oGenericTile.getProperty("header") === sHeader;
                            });

                            return typeof oResult === "undefined";
                        },
                        success: function () {
                            Opa5.assert.ok("The viz was not found");
                        }
                    });
                },
                iShouldSeeTheAddGroupButton: function () {
                    return this.waitFor({
                        id: "sapUshellAddGroupBtn",
                        errorMessage: "Add Group button was not found or disabled",
                        success: function (oButton) {
                            Opa5.assert.ok(oButton.getEnabled(), "Add Group button was found and enabled.");
                        }
                    });
                },
                iShouldSeeTheGroupWithTitle: function (sTitle) {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.TileContainer",
                        matchers: function (oTileContainer) {
                            return oTileContainer.getHeaderText() === sTitle;
                        },
                        success: function (oTileContainer) {
                            Opa5.assert.ok(oTileContainer, "TileContainer is shown.");
                        },
                        errorMessage: "No tile container found with this title: " + sTitle
                    });
                },
                iShouldSeeGroupActionButtonWithText: function (sText) {
                    return this.waitFor({
                        controlType: "sap.m.Button",
                        enabled: false,
                        matchers: function (oButton) {
                            return oButton.getText() === sText;
                        },
                        success: function (oButton) {
                            Opa5.assert.ok(oButton, "The '" + sText + "' button exists");
                        },
                        errorMessage: "The '" + sText + "' button was not found"
                    });
                },
                iShouldSeeFocusOnTile: function (sTitle) {
                    return this.waitFor({
                        controlType: "sap.m.GenericTile",
                        matchers: new PropertiesMatcher({
                            header: sTitle
                        }),
                        success: function (aGenericTiles) {
                            return this.waitFor({
                                controlType: "sap.ushell.ui.launchpad.Tile",
                                matchers: new DOMDescendantMatcher({
                                    descendant: aGenericTiles[0]
                                }),
                                check: function (aTiles) {
                                    return aTiles[0].getFocusDomRef() === document.activeElement;
                                },
                                success: function (oTile) {
                                    Opa5.assert.ok(oTile, "Tile was focused.");
                                }
                            });
                        }
                    });
                },
                iShouldSeeFocusOnLink: function (sTitle) {
                    return this.waitFor({
                        controlType: "sap.m.GenericTile",
                        matchers: new PropertiesMatcher({
                            header: sTitle,
                            mode: "LineMode"
                        }),
                        check: function (aTiles) {
                            return aTiles[0].getFocusDomRef() === document.activeElement;
                        },
                        success: function (oTile) {
                            Opa5.assert.ok(oTile, "Tile was focused.");
                        }
                    });
                },
                iShouldSeeFocusOnPlusTileOfGroup: function (sGroupName) {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.PlusTile",
                        matchers: function (oPlusTile) {
                            return oPlusTile.getParent().getHeaderText() === sGroupName;
                        },
                        check: function (aPlusTiles) {
                            return aPlusTiles[0].getFocusDomRef() === document.activeElement;
                        },
                        success: function (oPlusTile) {
                            Opa5.assert.ok(oPlusTile, "PlusTile was focused.");
                        }
                    });
                },
                iShouldSeeTheMenuBar: function () {
                    return this.waitFor({
                        controlType: "sap.m.IconTabHeader",
                        matchers: new PropertiesMatcher({
                            mode: "Inline"
                        }),
                        check: function (aIconTabHeaders) {
                            return aIconTabHeaders.length === 1;
                        },
                        success: function (oIconTabHeader) {
                            Opa5.assert.ok(oIconTabHeader, "MenuBar is visible.");
                        }
                    });
                },
                iShouldSeeMenuEntries: function (numberOfMenuEntries) {
                    return this.waitFor({
                        controlType: "sap.m.IconTabFilter",
                        check: function (aIconTabFilters) {
                            return aIconTabFilters.length === numberOfMenuEntries;
                        },
                        success: function () {
                            Opa5.assert.ok(true, numberOfMenuEntries + " MenuEntries are visible.");
                        }
                    });
                }
            }
        },

        onTheHomepageInActionMode: {
            actions: {
                iPressOnPlusTileInMyHomeGroup: function () {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.PlusTile",
                        matchers: function (oPlusTile) {
                            return oPlusTile.getParent().getHeaderText() === "My Home";
                        },
                        actions: new Press()
                    });
                },
                iPressCloseToLeave: function () {
                    return this.waitFor({
                        id: "sapUshellDashboardFooterDoneBtn",
                        actions: new Press()
                    });
                }
            },
            assertions: {
                iShouldSeeFocusOnCloseButton: function () {
                    return this.waitFor({
                        id: "sapUshellDashboardFooterDoneBtn",
                        check: function (oButton) {
                            return oButton.getFocusDomRef() === document.activeElement;
                        },
                        success: function (oButton) {
                            Opa5.assert.ok(oButton, "Close button was focused.");
                        }
                    });
                },
                iShouldSeeFocusOnGroup: function (sTitle) {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.TileContainer",
                        matchers: new PropertiesMatcher({
                            headerText: sTitle
                        }),
                        check: function (aTileContainer) {
                            return aTileContainer[0].getFocusDomRef() === document.activeElement;
                        },
                        success: function (oTileContainer) {
                            Opa5.assert.ok(oTileContainer, "TileContainer was focused.");
                        }
                    });
                }
            }
        }
    });
});
