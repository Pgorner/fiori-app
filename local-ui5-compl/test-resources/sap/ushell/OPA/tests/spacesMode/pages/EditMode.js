// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/Lib",
    "sap/ui/test/Opa5",
    "sap/ui/test/actions/Press",
    "sap/ui/test/matchers/Properties",
    "sap/ui/test/matchers/Ancestor",
    "sap/ui/test/matchers/I18NText",
    "sap/ushell/resources",
    "sap/ui/test/actions/EnterText",
    "sap/ushell/opa/actions/Drag",
    "sap/ushell/opa/actions/Drop"
], function (
    Library,
    Opa5,
    Press,
    PropertiesMatcher,
    AncestorMatcher,
    I18NTextMatcher,
    resources,
    EnterText,
    Drag,
    Drop
) {
    "use strict";

    Opa5.createPageObjects({
        onTheEditModeComponent: {
            actions: {
                iCloseEditMode: function () {
                    this.waitFor({
                        controlType: "sap.m.Button",
                        matchers: new I18NTextMatcher({
                            propertyName: "text",
                            key: "closeEditMode"
                        }),
                        actions: new Press()
                    });
                },
                iClickTheCDMVisualization: function (sVisualizationTitle) {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.VizInstanceCdm",
                        matchers: [
                            new PropertiesMatcher({
                                title: sVisualizationTitle
                            })
                        ],
                        check: function (aVisualizations) {
                            return aVisualizations.length === 1;
                        },
                        actions: [
                            // test is more stable when interacting with visible elements
                            function (oVisualization) { oVisualization.getDomRef().scrollIntoView(); },
                            new Press()
                        ]
                    });
                },
                iClickTheVisualization: function (sVisualizationTitle) {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.VizInstance",
                        matchers: [
                            new PropertiesMatcher({
                                title: sVisualizationTitle
                            })
                        ],
                        check: function (aVisualizations) {
                            return aVisualizations.length === 1;
                        },
                        actions: [
                            // test is more stable when interacting with visible elements
                            function (oVisualization) { oVisualization.getDomRef().scrollIntoView(); },
                            new Press()
                        ]
                    });
                },
                iClickTheCompactVisualization: function (sVisualizationTitle) {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.VizInstanceLink",
                        matchers: [
                            new PropertiesMatcher({
                                title: sVisualizationTitle
                            })
                        ],
                        check: function (aVisualizations) {
                            return aVisualizations.length === 1;
                        },
                        actions: [
                            // test is more stable when interacting with visible elements
                            function (oVisualization) { oVisualization.getDomRef().scrollIntoView(); },
                            new Press()
                        ]
                    });
                },
                iPressTheAddSectionButtonWithIndex: function (iIndex) {
                    return this.waitFor({
                        controlType: "sap.m.Button",
                        matchers: [
                            new PropertiesMatcher({
                                text: resources.i18n.getText("Page.Button.AddSection")
                            })
                        ],
                        success: function (aControls) {
                            new Press().executeOn(aControls[iIndex]);
                        }
                    });
                },
                iEnterANewTitleForASection: function (sOldSectionTitle, sNewSectionTitle, iSectionIndex) {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.Section",
                        matchers: [
                            new PropertiesMatcher({
                                title: sOldSectionTitle
                            }),
                            function (oSection) {
                                if (iSectionIndex === undefined) { return oSection; }
                                var sPath = oSection.getBindingContext().getPath();
                                var aStringPaths = sPath.split("/");
                                var iIndex = aStringPaths[aStringPaths.length - 1];

                                return iSectionIndex === parseInt(iIndex, 10);
                            }
                        ],
                        check: function (aSections) {
                            return aSections.length === 1;
                        },
                        success: function (aSections) {
                            return this.waitFor({
                                controlType: "sap.m.Input",
                                matchers: [
                                    new AncestorMatcher(aSections[0])
                                ],
                                actions: new EnterText({
                                    text: sNewSectionTitle
                                })
                            });
                        }
                    });
                },
                iHideASectionWithTitle: function (sSectionTitle) {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.Section",
                        matchers: [
                            new PropertiesMatcher({
                                title: sSectionTitle
                            })
                        ],
                        check: function (aSections) {
                            return aSections.length === 1;
                        },
                        success: function (aSections) {
                            return this.waitFor({
                                controlType: "sap.m.Button",
                                matchers: [
                                    new AncestorMatcher(aSections[0]),
                                    new PropertiesMatcher({
                                        text: resources.i18n.getText("Section.Button.Hide")
                                    })
                                ],
                                actions: new Press()
                            });
                        }
                    });
                },
                iShowASectionWithTitle: function (sSectionTitle) {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.Section",
                        matchers: [
                            new PropertiesMatcher({
                                title: sSectionTitle
                            })
                        ],
                        check: function (aSections) {
                            return aSections.length === 1;
                        },
                        success: function (aSections) {
                            return this.waitFor({
                                controlType: "sap.m.Button",
                                matchers: [
                                    new AncestorMatcher(aSections[0]),
                                    new PropertiesMatcher({
                                        text: resources.i18n.getText("Section.Button.Show")
                                    })
                                ],
                                actions: new Press()
                            });
                        }
                    });
                },
                iDeleteTheSectionWithTitle: function (sSectionTitle) {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.Section",
                        matchers: [
                            new PropertiesMatcher({
                                title: sSectionTitle
                            })
                        ],
                        check: function (aSections) {
                            return aSections.length === 1;
                        },
                        success: function (aSections) {
                            return this.waitFor({
                                controlType: "sap.m.Button",
                                matchers: [
                                    new AncestorMatcher(aSections[0]),
                                    new PropertiesMatcher({
                                        text: resources.i18n.getText("Section.Button.Delete")
                                    })
                                ],
                                actions: new Press()
                            });
                        }
                    });
                },
                iPressCancel: function () {
                    return this.waitFor({
                        controlType: "sap.m.Button",
                        matchers: [
                            new PropertiesMatcher({
                                text: Library.getResourceBundleFor("sap.m").getText("MSGBOX_CANCEL")
                            })
                        ],
                        actions: new Press()
                    });
                },
                iPressDelete: function () {
                    return this.waitFor({
                        controlType: "sap.m.Button",
                        matchers: [
                            new PropertiesMatcher({
                                text: Library.getResourceBundleFor("sap.m").getText("MSGBOX_DELETE")
                            })
                        ],
                        actions: new Press()
                    });
                },
                iDragAVisualizationToASection: function (sVisualizationTitle, sSectionTitle) {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.VizInstanceCdm",
                        matchers: [new PropertiesMatcher({
                            title: sVisualizationTitle
                        })],
                        actions: new Drag(),
                        success: function () {
                            return this.waitFor({
                                controlType: "sap.ushell.ui.launchpad.Section",
                                matchers: [
                                    new PropertiesMatcher({
                                        title: sSectionTitle
                                    })
                                ],
                                actions: new Drop()
                            });
                        }
                    });
                },
                iDeleteAVisualization: function (sVisualizationTitle) {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.VizInstanceCdm",
                        matchers: [
                            new PropertiesMatcher({
                                title: sVisualizationTitle
                            })
                        ],
                        check: function (aVisualizations) {
                            return aVisualizations.length === 1;
                        },
                        success: function (aVisualizations) {
                            return this.waitFor({
                                controlType: "sap.ui.core.Icon",
                                matchers: [
                                    new PropertiesMatcher({
                                        src: "sap-icon://decline"
                                    }),
                                    new AncestorMatcher(aVisualizations[0])
                                ],
                                actions: new Press()
                            });
                        }
                    });
                },
                iResetTheSectionWithTitle: function (sSectionTitle) {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.Section",
                        matchers: [
                            new PropertiesMatcher({
                                title: sSectionTitle
                            })
                        ],
                        check: function (aSections) {
                            return aSections.length === 1;
                        },
                        success: function (aSections) {
                            return this.waitFor({
                                controlType: "sap.m.Button",
                                matchers: [
                                    new AncestorMatcher(aSections[0]),
                                    new I18NTextMatcher({
                                        propertyName: "text",
                                        key: "Section.Button.Reset"
                                    })
                                ],
                                actions: new Press()
                            });
                        }
                    });
                },
                iDragAVisualizationFromSectionToSection: function (sSourceSectionTitle, sVisualizationTitle, sTargetSectionTitle) {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.Section",
                        matchers: [
                            new PropertiesMatcher({
                                title: sSourceSectionTitle
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
                                actions: new Drag(),
                                success: function () {
                                    return this.waitFor({
                                        controlType: "sap.ushell.ui.launchpad.Section",
                                        matchers: [
                                            new PropertiesMatcher({
                                                title: sTargetSectionTitle
                                            })
                                        ],
                                        actions: new Drop()
                                    });
                                }
                            });
                        }
                    });
                },
                iDragASectionToAnotherSection: function (sDraggedSection, sTargetSection) {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.Section",
                        matchers: [new PropertiesMatcher({
                            title: sDraggedSection
                        })],
                        actions: new Drag(),
                        success: function () {
                            this.waitFor({
                                controlType: "sap.ushell.ui.launchpad.Section",
                                matchers: [
                                    new PropertiesMatcher({
                                        title: sTargetSection
                                    })
                                ],
                                actions: new Drop()
                            });
                        }
                    });
                },
                iDragAVisualizationFromDefaultSectionToSection: function (sVisualizationTitle, sTargetSectionTitle) {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.Section",
                        matchers: [
                            new PropertiesMatcher({
                                default: true
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
                                actions: new Drag(),
                                success: function () {
                                    return this.waitFor({
                                        controlType: "sap.ushell.ui.launchpad.Section",
                                        matchers: [
                                            new PropertiesMatcher({
                                                title: sTargetSectionTitle
                                            })
                                        ],
                                        actions: new Drop()
                                    });
                                }
                            });
                        }
                    });
                },
                iClickTheConvertToLinkButton: function () {
                    return this.waitFor({
                        controlType: "sap.m.Button",
                        matchers: [
                            new I18NTextMatcher({
                                propertyName: "text",
                                key: "VisualizationInstance.ConvertToCompactAction"
                            })
                        ],
                        check: function (aButtons) {
                            return aButtons.length === 1;
                        },
                        actions: new Press()
                    });
                },
                iClickTheConvertToTileButton: function () {
                    return this.waitFor({
                        controlType: "sap.m.Button",
                        matchers: [
                            new I18NTextMatcher({
                                propertyName: "text",
                                key: "VisualizationInstance.ConvertToStandardAction",
                                useLibraryBundle: false
                            })
                        ],
                        check: function (aButtons) {
                            return aButtons.length === 1;
                        },
                        actions: new Press()
                    });
                },
                iClickTheConvertToStandardWideButton: function () {
                    return this.waitFor({
                        controlType: "sap.m.Button",
                        matchers: [
                            new I18NTextMatcher({
                                propertyName: "text",
                                key: "VisualizationInstance.ConvertToStandardWideAction"
                            })
                        ],
                        check: function (aButtons) {
                            return aButtons.length === 1;
                        },
                        actions: new Press()
                    });
                },
                iClickTheConvertToFlatButton: function () {
                    return this.waitFor({
                        controlType: "sap.m.Button",
                        matchers: [
                            new I18NTextMatcher({
                                propertyName: "text",
                                key: "VisualizationInstance.ConvertToFlatAction"
                            })
                        ],
                        check: function (aButtons) {
                            return aButtons.length === 1;
                        },
                        actions: new Press()
                    });
                },
                iClickTheConvertToFlatWideButton: function () {
                    return this.waitFor({
                        controlType: "sap.m.Button",
                        matchers: [
                            new I18NTextMatcher({
                                propertyName: "text",
                                key: "VisualizationInstance.ConvertToFlatWideAction"
                            })
                        ],
                        check: function (aButtons) {
                            return aButtons.length === 1;
                        },
                        actions: new Press()
                    });
                },
                iClickTheMoveButton: function () {
                    return this.waitFor({
                        controlType: "sap.m.Button",
                        matchers: [
                            new I18NTextMatcher({
                                propertyName: "text",
                                key: "moveTile_action"
                            })
                        ],
                        check: function (aButtons) {
                            return aButtons.length === 1;
                        },
                        actions: new Press()
                    });
                },
                iClickOnTheListEntryWithTitle: function (sTitle) {
                    return this.waitFor({
                        controlType: "sap.m.StandardListItem",
                        matchers: [
                            new PropertiesMatcher({
                                title: sTitle
                            })
                        ],
                        check: function (aListItems) {
                            return aListItems.length === 1;
                        },
                        actions: new Press()
                    });
                }
            },
            assertions: {
                iSeeTheMenuBarIsDisabled: function () {
                    return this.waitFor({
                        controlType: "sap.ui.core.ComponentContainer",
                        id: "menuBarComponentContainer",
                        success: function (aMenubarComponent) {
                            return this.waitFor({
                                autoWait: false,
                                controlType: "sap.m.IconTabFilter",
                                matchers: [
                                    new AncestorMatcher(aMenubarComponent[0])
                                ],
                                success: function (aIconTabFilters) {
                                    aIconTabFilters.forEach(function (oIconTabFilter) {
                                        Opa5.assert.ok(!oIconTabFilter.getEnabled(), "The IconTabFilter with text '" + oIconTabFilter.getText() + "' is disabled");
                                    });
                                }
                            });
                        }
                    });
                },
                iSeeAddSectionButtons: function (iCount) {
                    return this.waitFor({
                        controlType: "sap.m.Button",
                        matchers: [
                            new PropertiesMatcher({
                                text: resources.i18n.getText("Page.Button.AddSection")
                            })
                        ],
                        check: function (aButtons) {
                            return aButtons.length === iCount;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "There are " + iCount + "'Add Section' buttons.");
                        }
                    });
                },
                iSeeEveryVisualizationIsEditable: function () {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.VizInstanceCdm",
                        check: function (aVizInstances) {
                            return aVizInstances.every(function (oViz) {
                                return oViz.getEditable();
                            });
                        },
                        success: function () {
                            Opa5.assert.ok(true, "Every Visualization is editable");
                        }
                    });
                },
                iSeeTheSectionHasAnInputField: function (sSectionTitle, iSectionIndex) {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.Section",
                        matchers: [
                            new PropertiesMatcher({
                                default: false,
                                title: sSectionTitle
                            }),
                            function (oSection) {
                                if (iSectionIndex === undefined) { return oSection; }
                                var sPath = oSection.getBindingContext().getPath();
                                var aStringPaths = sPath.split("/");
                                var iIndex = aStringPaths[aStringPaths.length - 1];

                                return iSectionIndex === parseInt(iIndex, 10);
                            }
                        ],
                        check: function (aSections) {
                            return aSections.length === 1;
                        },
                        success: function (aSections) {
                            return this.waitFor({
                                controlType: "sap.m.Input",
                                matchers: [
                                    new AncestorMatcher(aSections[0])
                                ],
                                success: function () {
                                    Opa5.assert.ok(true, "The Section '" + sSectionTitle + "' has an input field");
                                }
                            });
                        }
                    });
                },
                iSeeTheSectionHasTheCorrectAriaLabel: function (iIndex, sTitle) {
                    var sExpectedAriaLabel = sTitle
                        ? resources.i18n.getText("Section.Description", [sTitle])
                        : resources.i18n.getText("Section.Description.EmptySectionAriaLabel", [iIndex + 1]);

                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.Section",
                        matchers: [
                            new PropertiesMatcher({
                                ariaLabel: sExpectedAriaLabel
                            })
                        ],
                        check: function (aSections) {
                            return aSections.length === 1;
                        },
                        success: function (aSections) {
                            var oSection = aSections[0];
                            Opa5.assert.strictEqual(
                                oSection.getDomRef().getAttribute("aria-label"),
                                sExpectedAriaLabel,
                                `The aria-label property was correct: "${sExpectedAriaLabel}"`
                            );
                        }
                    });
                },
                iSeeTheSectionHasTheCorrectNoVisualizationText: function (sSectionTitle) {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.Section",
                        matchers: [
                            new PropertiesMatcher({
                                default: false,
                                title: sSectionTitle
                            })
                        ],
                        check: function (aSections) {
                            return aSections.length === 1;
                        },
                        success: function (aSections) {
                            var oSection = aSections[0];
                            var sEmptySectionText = resources.i18n.getText("PageRuntime.EditMode.EmptySection");
                            Opa5.assert.ok(oSection.getNoVisualizationsText(), sEmptySectionText, "The Section '" + sSectionTitle + "' has the correct no visualization text");
                        }
                    });
                },
                iSeeTheDefaultSectionHasAText: function () {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.Section",
                        matchers: [
                            new PropertiesMatcher({
                                default: true
                            })
                        ],
                        check: function (aSections) {
                            return aSections.length === 1;
                        },
                        success: function (aSections) {
                            return this.waitFor({
                                controlType: "sap.m.Text",
                                matchers: [
                                    new AncestorMatcher(aSections[0]),
                                    new PropertiesMatcher({
                                        text: resources.i18n.getText("DefaultSection.Title")
                                    })
                                ],
                                success: function () {
                                    Opa5.assert.ok(true, "The Section is not editable");
                                }
                            });
                        }
                    });
                },
                iCantSeeADeleteButtonAtSection: function (sSectionTitle) {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.Section",
                        matchers: [
                            new PropertiesMatcher({
                                title: sSectionTitle
                            })
                        ],
                        success: function (aSections) {
                            return this.waitFor({
                                controlType: "sap.m.Button",
                                matchers: [
                                    new AncestorMatcher(aSections[0])
                                ],
                                check: function (aButtons) {
                                    for (var i = 0; i < aButtons.length; i++) {
                                        if (aButtons[i].getProperty("text") === resources.i18n.getText("Section.Button.Delete")) {
                                            return false;
                                        }
                                    }
                                    return true;
                                },
                                success: function () {
                                    Opa5.assert.ok("There is no delete button");
                                }
                            });
                        }
                    });
                },
                iSeeTheSectionWithTitleHidden: function (sSectionTitle) {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.Section",
                        matchers: [
                            new PropertiesMatcher({
                                title: sSectionTitle,
                                showSection: false
                            })
                        ],
                        check: function (aSections) {
                            return aSections.length === 1;
                        },
                        success: function (aSections) {
                            Opa5.assert.ok(true, "The section '" + aSections[0] + "' is hidden.");
                        }
                    });
                },
                iSeeTheSectionWithTitleShown: function (sSectionTitle) {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.Section",
                        matchers: [
                            new PropertiesMatcher({
                                title: sSectionTitle,
                                showSection: true
                            })
                        ],
                        check: function (aSections) {
                            return aSections.length === 1;
                        },
                        success: function (aSections) {
                            Opa5.assert.ok(true, "The section '" + aSections[0] + "' is shown.");
                        }
                    });
                },
                iCantSeeAShowHideSectionSwitch: function (sSectionTitle) {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.Section",
                        matchers: [
                            new PropertiesMatcher({
                                title: sSectionTitle
                            })
                        ],
                        success: function (aSections) {
                            return this.waitFor({
                                controlType: "sap.ui.core.Control",
                                matchers: [
                                    new AncestorMatcher(aSections[0])
                                ],
                                check: function (aSwitches) {
                                    for (var i = 0, len = aSwitches.length; i < len; ++i) {
                                        if (aSwitches[i].isA("sap.m.Switch")) {
                                            return false;
                                        }
                                    }
                                    return true;
                                },
                                success: function () {
                                    Opa5.assert.ok("There is no show section switch");
                                }
                            });
                        }
                    });
                },
                iCantSeeAResetButtonAtSection: function (sSectionTitle, iSectionIndex) {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.Section",
                        matchers: [
                            new PropertiesMatcher({
                                title: sSectionTitle
                            }),
                            function (oSection) {
                                if (iSectionIndex === undefined) { return oSection; }
                                var sPath = oSection.getBindingContext().getPath();
                                var aStringPaths = sPath.split("/");
                                var iIndex = aStringPaths[aStringPaths.length - 1];

                                return iSectionIndex === parseInt(iIndex, 10);
                            }
                        ],
                        success: function (aSections) {
                            return this.waitFor({
                                controlType: "sap.m.Button",
                                matchers: [
                                    new AncestorMatcher(aSections[0])
                                ],
                                check: function (aButtons) {
                                    for (var i = 0; i < aButtons.length; i++) {
                                        if (aButtons[i].getProperty("text") === resources.i18n.getText("Section.Button.Reset")) {
                                            return false;
                                        }
                                    }
                                    return true;
                                },
                                success: function () {
                                    Opa5.assert.ok("There is no reset button");
                                }
                            });
                        }
                    });
                },
                iSeeTheDeleteDialog: function () {
                    return this.waitFor({
                        controlType: "sap.m.Dialog",
                        matchers: [
                            new PropertiesMatcher({
                                title: resources.i18n.getText("PageRuntime.Dialog.Title.Delete")
                            })
                        ],
                        success: function () {
                            Opa5.assert.ok("The delete dialog is there.");
                        }
                    });
                },
                iSeeTheRightDeleteQuestion: function (sSectionTitle) {
                    return this.waitFor({
                        controlType: "sap.m.Text",
                        matchers: [
                            new PropertiesMatcher({
                                text: resources.i18n.getText("PageRuntime.Message.Section.Delete", [sSectionTitle])
                            })
                        ],
                        success: function () {
                            Opa5.assert.ok("The right delete question is shown.");
                        }
                    });
                },
                iSeeTheDeleteButtonOfSectionWithTitleFocused: function (sSectionTitle) {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.Section",
                        matchers: [
                            new PropertiesMatcher({
                                title: sSectionTitle
                            })
                        ],
                        check: function (aSections) {
                            return aSections.length === 1;
                        },
                        success: function (aSections) {
                            return this.waitFor({
                                controlType: "sap.m.Button",
                                matchers: [
                                    new AncestorMatcher(aSections[0]),
                                    new PropertiesMatcher({
                                        text: resources.i18n.getText("Section.Button.Delete")
                                    })
                                ],
                                success: function () {
                                    Opa5.assert.ok(true, "The right button is focused");
                                }
                            });
                        }
                    });
                },
                iSeeTheSectionDeletedMessageToast: function () {
                    return this.waitFor({
                        // Turn off autoWait
                        autoWait: false,
                        check: function () {
                            var sExpectedMessage = resources.i18n.getText("PageRuntime.Message.SectionDeleted");
                            // Locate the message toast using its class name in a jQuery function
                            return Opa5.getJQuery()(".sapMMessageToast").text() === sExpectedMessage;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The message toast was shown.");
                        }
                    });
                },
                iSeeTheDefaultSection: function () {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.Section",
                        matchers: [
                            new PropertiesMatcher({
                                default: true
                            })
                        ],
                        check: function (aSections) {
                            return aSections.length === 1;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The default section is there");
                        }
                    });
                },
                iAmInTheActionMode: function () {
                    return this.waitFor({
                        controlType: "sap.m.Button",
                        matchers: [
                            new I18NTextMatcher({
                                propertyName: "text",
                                key: "closeEditMode"
                            })
                        ],
                        success: function () {
                            Opa5.assert.ok(true, "I am in the edit mode.");
                        }
                    });
                },
                iSeeFocusOnSection: function (sSectionTitle) {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.Section",
                        matchers: new PropertiesMatcher({
                            title: sSectionTitle
                        }),
                        check: function (aSections) {
                            return aSections[0].getFocusDomRef() === document.activeElement;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The section was focused");
                        }
                    });
                },
                iSeeFocusOnCloseButton: function () {
                    this.waitFor({
                        controlType: "sap.m.Button",
                        matchers: new I18NTextMatcher({
                            propertyName: "text",
                            key: "closeEditMode"
                        }),
                        check: function (aButtons) {
                            return aButtons[0].getFocusDomRef() === document.activeElement;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The button was focused");
                        }
                    });
                }
            }
        }
    });
});
