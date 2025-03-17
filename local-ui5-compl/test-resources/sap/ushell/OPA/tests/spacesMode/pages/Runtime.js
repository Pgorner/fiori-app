// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ui/test/actions/Press",
    "sap/ui/test/matchers/Properties",
    "sap/ui/test/matchers/Ancestor",
    "sap/ui/test/matchers/I18NText",
    "sap/ushell/opa/matchers/Hash",
    "sap/ushell/resources",
    "sap/ui/thirdparty/hasher",
    "sap/ushell/library",
    "sap/ushell/opa/matchers/DOMAncestor"
], function (Opa5, Press, PropertiesMatcher, AncestorMatcher, I18NTextMatcher, HashMatcher, resources, hasher, ushellLibrary, DOMAncestorMatcher) {
    "use strict";

    var DisplayFormat = ushellLibrary.DisplayFormat;

    Opa5.createPageObjects({
        onTheRuntimeComponent: {
            actions: {
                iChangeTheHash: function (sHash) {
                    hasher.setHash(sHash);
                },
                iOpenUserActionsMenu: function () {
                    return this.waitFor({
                        id: "userActionsMenuHeaderButton",
                        actions: new Press()
                    });
                },
                iEnterEditMode: function () {
                    return this.waitFor({
                        controlType: "sap.m.StandardListItem",
                        matchers: new PropertiesMatcher({
                            title: resources.i18n.getText("PageRuntime.EditMode.Activate")
                        }),
                        actions: new Press()
                    });
                },
                iEnterAppFinder: function () {
                    this.waitFor({
                        controlType: "sap.m.StandardListItem",
                        matchers: new PropertiesMatcher({
                            title: resources.i18n.getText("appFinderTitle")
                        }),
                        actions: new Press()
                    });
                },
                iPressTheUserAction: function (sText) {
                    this.waitFor({
                        controlType: "sap.m.StandardListItem",
                        matchers: new PropertiesMatcher({
                            title: sText
                        }),
                        actions: new Press()
                    });
                },
                iNavigateBack: function () {
                    this.waitFor({
                        controlType: "sap.ushell.ui.shell.ShellHeadItem",
                        id: "backBtn",
                        actions: new Press()
                    });
                },
                iClickTheVisualization: function (sTitle) {
                    this.waitFor({
                        controlType: "sap.m.GenericTile",
                        matchers: new PropertiesMatcher({
                            header: sTitle
                        }),
                        actions: new Press()
                    });
                },
                iClickTheViewDetailsButton: function () {
                    this.waitFor({
                        controlType: "sap.m.Button",
                        matchers: new PropertiesMatcher({
                            text: resources.i18n.getText("PageRuntime.CannotLoadPage.DetailsButton")
                        }),
                        actions: new Press()
                    });
                },
                iClickCloseBtn: function () {
                    this.waitFor({
                        controlType: "sap.m.Button",
                        matchers: new PropertiesMatcher({
                            text: "Close"
                        }),
                        actions: new Press()
                    });
                },
                iFocusAGridContainerItemWrapper: function (sTitle, iIndex) {
                    if (typeof iIndex === "undefined") {
                        iIndex = 0;
                    }

                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.VizInstanceCdm",
                        matchers: new PropertiesMatcher({
                            title: sTitle
                        }),
                        success: function (aVizInstances) {
                            var oVizInstance = aVizInstances[iIndex];
                            Opa5.assert.ok(oVizInstance, "The VizInstanceCdm at index " + iIndex + " has been found.");

                            if (oVizInstance) {
                                oVizInstance.getDomRef().parentElement.focus();
                            }
                        }
                    });
                },
                iFocusACompactVisualization: function (sTitle, iIndex) {
                    if (typeof iIndex === "undefined") {
                        iIndex = 0;
                    }

                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.VizInstanceLink",
                        matchers: new PropertiesMatcher({
                            title: sTitle
                        }),
                        success: function (aVizInstances) {
                            var oVizInstance = aVizInstances[iIndex];
                            Opa5.assert.ok(oVizInstance, "The VizInstanceLink at index " + iIndex + " has been found.");

                            if (oVizInstance) {
                                oVizInstance.focus();
                            }
                        }
                    });
                },
                iFocusASection: function (sTitle) {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.Section",
                        matchers: new PropertiesMatcher({
                            title: sTitle
                        }),
                        actions: function (oSection) {
                            return oSection.focus();
                        }
                    });
                },
                iCloseAboutDialog: function () {
                    return this.waitFor({
                        searchOpenDialogs: true,
                        controlType: "sap.m.Dialog",
                        actions: function (oDialog) {
                            oDialog.getBeginButton().firePress(); // press the OK button
                        },
                        errorMessage: "Sign out dialog was not found"
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
                }
            },
            assertions: {
                iSeeTheHash: function (sHash) {
                    return this.waitFor({
                        matchers: new HashMatcher({
                            hash: sHash
                        }),
                        success: function () {
                            Opa5.assert.ok(true, "The hash is correct");
                        }
                    });
                },
                iDontSeeThePageTitle: function () {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.Page",
                        success: function (aPages) {
                            Opa5.assert.strictEqual(aPages[0].getShowTitle(), false, "The page title is not visible.");
                        }
                    });
                },
                iSeeTheRightPageTitle: function (sPageTitle) {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.Page",
                        success: function (aPages) {
                            Opa5.assert.strictEqual(aPages[0].getTitle(), sPageTitle, "The correct page title is displayed.");
                            Opa5.assert.strictEqual(aPages[0].getShowTitle(), true, "The title is visible.");
                        }
                    });
                },
                iSeeTheRightIconTabFilterSelected: function (sText) {
                    return this.waitFor({
                        controlType: "sap.m.IconTabFilter",
                        matchers: new PropertiesMatcher({
                            text: sText
                        }),
                        success: function (oIconTabFilter) {
                            Opa5.assert.ok(oIconTabFilter, "Filter with text '" + sText + "' is selected");
                        }
                    });
                },
                iSeeNoItemSelected: function () {
                    return this.waitFor({
                        controlType: "sap.m.IconTabHeader",
                        matchers: new PropertiesMatcher({
                            selectedKey: "None Existing Key"
                        }),
                        success: function () {
                            Opa5.assert.ok("No key is selected");
                        }
                    });
                },
                iSeeTheEditModeButton: function () {
                    return this.waitFor({
                        controlType: "sap.m.StandardListItem",
                        matchers: new PropertiesMatcher({
                            title: resources.i18n.getText("PageRuntime.EditMode.Activate")
                        }),
                        success: function () {
                            Opa5.assert.ok(true, "The edit mode button is there.");
                        }
                    });
                },
                iSeeTheUserAction: function (sText) {
                    return this.waitFor({
                        controlType: "sap.m.StandardListItem",
                        matchers: new PropertiesMatcher({
                            title: sText
                        }),
                        success: function () {
                            Opa5.assert.ok(true, "The user action is there.");
                        }
                    });
                },
                iDontSeeTheEditModeButton: function () {
                    return this.waitFor({
                        controlType: "sap.m.StandardListItem",
                        check: function (aStandardListItems) {
                            for (var i = 0; i < aStandardListItems.length; i++) {
                                if (aStandardListItems[i].getProperty("title") === resources.i18n.getText("PageRuntime.EditMode.Activate")) {
                                    return false;
                                }
                            }
                            return true;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The edit mode button is not there.");
                        }
                    });
                },
                iSeeThePageHasTheCorrectSectionCount: function (iSectionCount) {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.Section",
                        check: function (aSections) {
                            return aSections.length === iSectionCount;
                        },
                        success: function () {
                            Opa5.assert.ok("Section count is correct");
                        }
                    });
                },
                iSeeTheSectionWithNameAtIndex: function (sSectionTitle, iSectionIndex) {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.Section",
                        matchers: function (oSection) {
                            var sPath = oSection.getBindingContext().getPath();
                            var aStringPaths = sPath.split("/");
                            var iIndex = aStringPaths[aStringPaths.length - 1];

                            return iSectionIndex === parseInt(iIndex, 10) &&
                                oSection.getTitle() === sSectionTitle;
                        },
                        check: function (aSections) {
                            return aSections.length === 1;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The section was found at the correct position");
                        }
                    });
                },
                iDontSeeTheSection: function (sSectionTitle) {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.Section",
                        check: function (aSections) {
                            for (var i = 0; i < aSections.length; i++) {
                                if (aSections[i].getProperty("title") === sSectionTitle) {
                                    return false;
                                }
                            }
                            return true;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The section '" + sSectionTitle + "' is not there.");
                        }
                    });
                },
                iDontSeeTheTile: function (sTileTitle) {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.VizInstanceCdm",
                        check: function (aTiles) {
                            for (var i = 0; i < aTiles.length; i++) {
                                if (aTiles[i].getProperty("title") === sTileTitle) {
                                    return false;
                                }
                            }
                            return true;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The tile '" + sTileTitle + "' is not there.");
                        }
                    });
                },
                iSeeTheSectionHasTheCorrectVizCount: function (sSectionTitle, iVizCount) {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.Section",
                        matchers: new PropertiesMatcher({
                            title: sSectionTitle
                        }),
                        success: function (aSections) {
                            return this.waitFor({
                                controlType: "sap.ushell.ui.launchpad.VizInstanceCdm",
                                matchers: new AncestorMatcher(aSections[0]),
                                check: function (aVisualizations) {
                                    return aVisualizations.length === iVizCount;
                                },
                                success: function () {
                                    Opa5.assert.ok(true, "VizCount is correct");
                                }
                            });
                        }
                    });
                },
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
                },
                iSeeTheVisualizationAtTheCorrectIndex: function (sSectionTitle, sVizTitle, iVizIndex) {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.Section",
                        matchers: new PropertiesMatcher({
                            title: sSectionTitle
                        }),
                        success: function (aSections) {
                            return this.waitFor({
                                controlType: "sap.ushell.ui.launchpad.VizInstanceCdm",
                                matchers: [
                                    new AncestorMatcher(aSections[0]),
                                    new PropertiesMatcher({
                                        title: sVizTitle
                                    })
                                ],
                                check: function (aVisualizations) {
                                    if (aVisualizations.length !== 1) {
                                        return false;
                                    }
                                    var sPath = aVisualizations[0].getBindingContext().getPath();
                                    var aStringPaths = sPath.split("/");
                                    var iIndex = aStringPaths[aStringPaths.length - 1];
                                    return iVizIndex === parseInt(iIndex, 10);
                                },
                                success: function () {
                                    Opa5.assert.ok(true, "Vizsualization was found at the correct position");
                                }
                            });
                        }
                    });
                },
                iShouldSeeTheCannotLoadPageError: function (sPageId, sSpaceId) {
                    return this.waitFor({
                        controlType: "sap.m.Text",
                        matchers: [
                            new PropertiesMatcher({
                                text: resources.i18n.getText("PageRuntime.CannotLoadPage.PageAndSpaceId", [sPageId, sSpaceId])
                            })
                        ],
                        success: function () {
                            Opa5.assert.ok("The text was found.");
                        }
                    });
                },
                iCannotSeeTheViz: function (sHeader) {
                    return this.waitFor({
                        controlType: "sap.m.GenericTile",
                        check: function (aGenericTiles) {
                            var sResult = aGenericTiles.find(function (oGenericTile) {
                                return oGenericTile.getProperty("header") === sHeader;
                            });
                            return typeof sResult === "undefined";
                        },
                        success: function () {
                            Opa5.assert.ok("The viz was not found");
                        }
                    });
                },
                iDontSeeAddSectionButtons: function () {
                    return this.waitFor({
                        controlType: "sap.m.Button",
                        check: function (aButtons) {
                            for (var i = 0; i < aButtons.length; i++) {
                                if (aButtons[i].getText() === resources.i18n.getText("Page.Button.AddSection")) {
                                    return false;
                                }
                            }
                            return true;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "There are no 'Add Section' buttons.");
                        }
                    });
                },
                iSeeEveryVisualizationIsNotEditable: function () {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.VizInstanceCdm",
                        check: function (aVizInstances) {
                            for (var i = 0; i < aVizInstances.length; i++) {
                                if (aVizInstances[i].getEditable() === true) {
                                    return false;
                                }
                            }
                            return true;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "Every Visualization is not editable");
                        }
                    });
                },
                iSeeTheVisualizationInTheSection: function (sVisualizationTitle, sSectionTitle) {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.Section",
                        matchers: [
                            new PropertiesMatcher({
                                title: sSectionTitle
                            })
                        ],
                        success: function (aSections) {
                            return this.waitFor({
                                controlType: "sap.ushell.ui.launchpad.VizInstanceCdm",
                                matchers: [
                                    new PropertiesMatcher({
                                        title: sVisualizationTitle
                                    }),
                                    new AncestorMatcher(
                                        aSections[0]
                                    )
                                ],
                                check: function (aVisualizations) {
                                    return aVisualizations.length === 1;
                                },
                                success: function () {
                                    Opa5.assert.ok("The visualization is in the right section");
                                }
                            });
                        }
                    });
                },
                iSeeTwoTilesWithTitleInSection: function (sVisualizationTitle, sSectionTitle) {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.Section",
                        matchers: [
                            new PropertiesMatcher({
                                title: sSectionTitle
                            })
                        ],
                        success: function (aSections) {
                            return this.waitFor({
                                controlType: "sap.ushell.ui.launchpad.VizInstanceCdm",
                                matchers: [
                                    new PropertiesMatcher({
                                        title: sVisualizationTitle
                                    }),
                                    new AncestorMatcher(aSections[0])
                                ],
                                check: function (aVisualizations) {
                                    return aVisualizations.length === 2;
                                },
                                success: function () {
                                    Opa5.assert.ok("The visualization is in the right section");
                                }
                            });
                        }
                    });
                },
                iSeeTilesInSection: function (iNoOfTiles, sSectionTitle) {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.Section",
                        matchers: [
                            new PropertiesMatcher({
                                title: sSectionTitle
                            })
                        ],
                        success: function (aSections) {
                            return this.waitFor({
                                controlType: "sap.ushell.ui.launchpad.VizInstance",
                                matchers: new AncestorMatcher(aSections[0]),
                                check: function (aVisualizations) {
                                    return aVisualizations.length === iNoOfTiles;
                                },
                                success: function () {
                                    Opa5.assert.ok("There's the expected number of visualizations (" + iNoOfTiles + ") in the given section.");
                                }
                            });
                        }
                    });
                },
                iDontSeeTheVisualizationInTheSection: function (sVisualizationTitle, sSectionTitle) {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.Section",
                        matchers: [
                            new PropertiesMatcher({
                                title: sSectionTitle
                            })
                        ],
                        success: function (aSections) {
                            return this.waitFor({
                                controlType: "sap.ushell.ui.launchpad.VizInstanceCdm",
                                matchers: [
                                    new AncestorMatcher(aSections[0])
                                ],
                                check: function (aVisualizations) {
                                    for (var i = 0; i < aVisualizations.length; i++) {
                                        if (aVisualizations[i].getProperty("title") === sVisualizationTitle) {
                                            return false;
                                        }
                                    }
                                    return true;
                                },
                                success: function () {
                                    Opa5.assert.ok("The visualization is not in the section");
                                }
                            });
                        }
                    });
                },
                iSeeTheVisualizationHasTheCorrectProperties: function (sSectionTitle, sVizTitle, sVizSubTitle, sVizInfo) {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.Section",
                        matchers: new PropertiesMatcher({
                            title: sSectionTitle
                        }),
                        success: function (aSections) {
                            return this.waitFor({
                                controlType: "sap.ushell.ui.launchpad.VizInstanceCdm",
                                matchers: [
                                    new AncestorMatcher(aSections[0]),
                                    new PropertiesMatcher({
                                        title: sVizTitle,
                                        subtitle: sVizSubTitle,
                                        info: sVizInfo
                                    })],
                                check: function (aVisualizations) {
                                    return aVisualizations.length;
                                },
                                success: function () {
                                    Opa5.assert.ok(true, "VizCount is correct");
                                }
                            });
                        }
                    });
                },
                iSeeAGenericTileWithPropertiesInSection: function (sSectionTitle, sVizTitle, sVizSubTitle, sDisplayFormat) {
                    var sFrameType, sMode;
                    switch (sDisplayFormat) {
                        case DisplayFormat.Flat:
                            sFrameType = "OneByHalf";
                            break;
                        case DisplayFormat.FlatWide:
                            sFrameType = "TwoByHalf";
                            break;
                        case DisplayFormat.StandardWide:
                            sFrameType = "TwoByOne";
                            break;
                        case DisplayFormat.Compact:
                            sMode = "LineMode";
                            break;
                        default: {
                            sFrameType = "OneByOne";
                        }
                    }
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.Section",
                        matchers: new PropertiesMatcher({
                            title: sSectionTitle
                        }),
                        success: function (aSections) {
                            var oProperties = {
                                header: sVizTitle,
                                subheader: sVizSubTitle
                            };
                            if (sFrameType) {
                                oProperties.frameType = sFrameType;
                            }
                            if (sMode) {
                                oProperties.mode = sMode;
                            }
                            return this.waitFor({
                                controlType: "sap.m.GenericTile",
                                matchers: [
                                    new DOMAncestorMatcher({
                                        ancestor: aSections[0]
                                    }),
                                    new PropertiesMatcher(oProperties)
                                ],
                                check: function (aVisualizations) {
                                    return aVisualizations.length;
                                },
                                success: function () {
                                    Opa5.assert.ok(true, "Found GenericTile with expected properties");
                                }
                            });
                        }
                    });
                },
                iSeeACdmTileWithPropertiesInSection: function (sSectionTitle, sVizTitle, sVizSubTitle, sDisplayFormat) {
                    var iHeight, iWidth, sMode;
                    switch (sDisplayFormat) {
                        case DisplayFormat.Flat:
                            iHeight = 1;
                            iWidth = 2;
                            break;
                        case DisplayFormat.FlatWide:
                            iHeight = 1;
                            iWidth = 4;
                            break;
                        case DisplayFormat.StandardWide:
                            iHeight = 2;
                            iWidth = 4;
                            break;
                        case DisplayFormat.Compact:
                            sMode = "LineMode";
                            break;
                        default: {
                            iHeight = 2;
                            iWidth = 2;
                        }
                    }
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.Section",
                        matchers: new PropertiesMatcher({
                            title: sSectionTitle
                        }),
                        success: function (aSections) {
                            var oProperties = {
                                title: sVizTitle,
                                subtitle: sVizSubTitle
                            };
                            if (iHeight && iWidth) {
                                oProperties.height = iHeight;
                                oProperties.width = iWidth;
                            }
                            if (sMode) {
                                oProperties.mode = sMode;
                            }
                            return this.waitFor({
                                controlType: "sap.ushell.ui.launchpad.VizInstanceCdm",
                                matchers: [
                                    new DOMAncestorMatcher({
                                        ancestor: aSections[0]
                                    }),
                                    new PropertiesMatcher(oProperties)
                                ],
                                check: function (aVisualizations) {
                                    return aVisualizations.length;
                                },
                                success: function () {
                                    Opa5.assert.ok(true, "Found CDM tile with expected properties");
                                }
                            });
                        }
                    });
                },
                iSeeACdmLinkWithPropertiesInSection: function (sSectionTitle, sVizTitle, sVizSubTitle, sDisplayFormat) {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.Section",
                        matchers: new PropertiesMatcher({
                            title: sSectionTitle
                        }),
                        success: function (aSections) {
                            var oProperties = {
                                title: sVizTitle,
                                subtitle: sVizSubTitle,
                                mode: "LineMode"
                            };


                            return this.waitFor({
                                controlType: "sap.ushell.ui.launchpad.VizInstanceLink",
                                matchers: [
                                    new DOMAncestorMatcher({
                                        ancestor: aSections[0]
                                    }),
                                    new PropertiesMatcher(oProperties)
                                ],
                                check: function (aVisualizations) {
                                    return aVisualizations.length;
                                },
                                success: function () {
                                    Opa5.assert.ok(true, "Found CDM link with expected properties");
                                }
                            });
                        }
                    });
                },
                iSeeFocusOnGridContainerItemWrapper: function (sTitle, iIndex) {
                    if (typeof iIndex === "undefined") {
                        iIndex = 0;
                    }

                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.VizInstanceCdm",
                        matchers: new PropertiesMatcher({
                            title: sTitle
                        }),
                        check: function (aVizInstances) {
                            return aVizInstances[iIndex] && aVizInstances[iIndex].getDomRef().parentElement === document.activeElement;
                        },
                        success: function (bFocused) {
                            Opa5.assert.ok(bFocused, "Tile was focused.");
                        }
                    });
                },
                iSeeFocusOnACompactVisualization: function (sTitle, iIndex) {
                    if (typeof iIndex === "undefined") {
                        iIndex = 0;
                    }

                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.VizInstanceLink",
                        matchers: new PropertiesMatcher({
                            title: sTitle
                        }),
                        check: function (aVizInstances) {
                            return aVizInstances[iIndex] && aVizInstances[iIndex].getDomRef() === document.activeElement;
                        },
                        success: function (bFocused) {
                            Opa5.assert.ok(bFocused, "Tile was focused.");
                        }
                    });
                },
                iSeeShellAppTitle: function (sEntryTitle) {
                    return this.waitFor({
                        id: "shellAppTitle",
                        controlType: "sap.ushell.ui.shell.ShellAppTitle",
                        matchers: new PropertiesMatcher({
                            text: sEntryTitle
                        }),
                        success: function () {
                            Opa5.assert.ok("Title found");
                        }
                    });
                },
                iSeeTheAboutDialog: function () {
                    return this.waitFor({
                        id: "aboutDialogFragment--aboutDialog",
                        controlType: "sap.m.Dialog",
                        success: function (oDialog) {
                            Opa5.assert.ok(oDialog.isOpen(), "About dialog was opened");
                        },
                        errorMessage: "About dialog was not found"
                    });
                },
                iDoNotSeeTheAboutDialog: function () {
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
                iSeeTheLogoutDialog: function () {
                    return this.waitFor({
                        searchOpenDialogs: true,
                        controlType: "sap.m.Dialog",
                        success: function (oDialog) {
                            Opa5.assert.ok(true, "Sign out dialog is shown.");
                        },
                        errorMessage: "Sign out dialog was not found"
                    });
                },
                iDoNotSeeTheLogoutDialog: function () {
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
                iShouldSeetheNoSectionText: function () {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.Page",
                        success: function (aPages) {
                            const oNoSectionText = aPages[0].getAggregation("_noSectionText");
                            Opa5.assert.ok(!!oNoSectionText.getDomRef(), "The noSectionText is visible.");
                        }
                    });
                },
                iShouldNotSeetheNoSectionText: function () {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.Page",
                        success: function (aPages) {
                            const oNoSectionText = aPages[0].getAggregation("_noSectionText");
                            Opa5.assert.ok(!oNoSectionText.getDomRef(), "The noSectionText is not visible.");
                        }
                    });
                }
            }
        }
    });
});
