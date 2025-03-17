// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/i18n/Localization",
    "sap/ui/test/Opa5",
    "sap/ui/test/actions/Press",
    "sap/ui/test/actions/EnterText",
    "sap/ui/test/matchers/Properties",
    "sap/ui/test/matchers/I18NText",
    "sap/ushell/opa/actions/Drag",
    "sap/ui/test/actions/Drop",
    "sap/ui/test/matchers/Ancestor",
    "sap/ui/model/resource/ResourceModel"
], function (
    Localization,
    Opa5,
    Press,
    EnterText,
    Properties,
    I18NTextMatcher,
    Drag,
    Drop,
    Ancestor,
    ResourceModel
) {
    "use strict";

    var sViewName = "sap.ushell.components.workPageBuilder.view.WorkPageBuilder";

    var oResourceBundle = new ResourceModel({
        bundleUrl: sap.ui.require.toUrl("sap/ushell/components/workPageBuilder/resources/resources.properties"),
        bundleLocale: Localization.getLanguage()
    }).getResourceBundle();


    Opa5.createPageObjects({
        onTheDeleteConfirmModal: {
            actions: {
                iPressTheConfirmButton: function () {
                    return this.waitFor({
                        controlType: "sap.m.Dialog",
                        searchOpenDialogs: true,
                        success: function (aDialogs) {
                            new Press().executeOn(aDialogs[0].getBeginButton());
                        }

                    });
                }
            }
        },
        inEditMode: {
            actions: {
                iToggleTheFooterBar: function (bShowFooter) {
                    return this.waitFor({
                        controlType: "sap.ui.core.mvc.View",
                        success: function (aControls) {
                            aControls[0].getController().setShowFooter(bShowFooter);
                        }
                    });
                },
                iPressTheAddFirstRowButton: function () {
                    return this.waitFor({
                        viewName: sViewName,
                        id: /emptyWorkpageMessage/,
                        controlType: "sap.m.IllustratedMessage",
                        success: function (oIllustratedMessage) {
                            return this.waitFor({
                                viewName: sViewName,
                                controlType: "sap.m.Button",
                                ancestor: oIllustratedMessage,
                                actions: new Press()
                            });
                        }
                    });
                },
                iPressTheAddRowButton: function (iRowIndex, bTop) {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.ushell.components.workPageBuilder.controls.WorkPage",
                        success: function (oWorkPage) {
                            var oRow = oWorkPage[0].getAggregation("rows")[iRowIndex];
                            var oButton = bTop
                                ? oRow.getAggregation("_addButtonTop")
                                : oRow.getAggregation("_addButtonBottom");
                            new Press().executeOn(oButton);
                        }
                    });
                },
                iAddAColumnToRow: function (iRowIndex, iColumnIndex, bLeft) {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.ushell.components.workPageBuilder.controls.WorkPage",
                        success: function (oWorkPage) {
                            var oRow = oWorkPage[0].getAggregation("rows")[iRowIndex];
                            var oColumn = oRow.getAggregation("columns")[iColumnIndex];
                            var oAddButton = bLeft
                                ? oColumn.getAggregation("_addButtonLeft")
                                : oColumn.getAggregation("_addButtonRight");
                            new Press().executeOn(oAddButton);
                        }
                    });
                },
                iDeleteAColumnFromRow: function (iRowIndex, iColumnIndex) {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.ushell.components.workPageBuilder.controls.WorkPage",
                        success: function (oWorkPage) {
                            var oRow = oWorkPage[0].getAggregation("rows")[iRowIndex];
                            var oColumn = oRow.getAggregation("columns")[iColumnIndex];
                            var oDeleteButton = oColumn.getAggregation("_deleteButton");
                            new Press().executeOn(oDeleteButton);
                        }
                    });
                },
                iPressTheRowToolbarButton: function (iRowIndex, sButtonId) {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.ushell.components.workPageBuilder.controls.WorkPage",
                        success: function (oWorkPage) {
                            var oRow = oWorkPage[0].getAggregation("rows")[iRowIndex];
                            return this.waitFor({
                                id: sButtonId,
                                ancestor: oRow,
                                actions: new Press()
                            });
                        }
                    });
                },
                iResizeAColumnFromRow: function (iRowIndex, iColumnIndex, sDirection) {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.ushell.components.workPageBuilder.controls.WorkPage",
                        success: function (oWorkPage) {
                            var oRow = oWorkPage[0].getAggregation("rows")[iRowIndex];
                            var oColumn = oRow.getAggregation("columns")[iColumnIndex];
                            var iWidth = oColumn.getDomRef().getBoundingClientRect().width;

                            if (sDirection === "left") {
                                iWidth *= -1;
                            }

                            oColumn.fireEvent("columnResized", { posXDiff: iWidth / 2 });
                        }
                    });
                },

                iPressAddWidgetButton: function (iRowIndex, iColumnIndex) {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.ushell.components.workPageBuilder.controls.WorkPage",
                        success: function (oWorkPage) {
                            var oRow = oWorkPage[0].getAggregation("rows")[iRowIndex];
                            var oColumn = oRow.getAggregation("columns")[iColumnIndex];

                            var oAddContentButton = oColumn.getAddWidgetButton();
                            new Press().executeOn(oAddContentButton);
                        }
                    });
                },
                iSelectWidgetFromWidgetGallery: function (iWidgetIndex) {
                    return this.waitFor({
                        searchOpenDialogs: true,
                        controlType: "sap.f.GridList",
                        success: function (oGridList) {
                            new Press().executeOn(oGridList[0].getItems()[iWidgetIndex]);
                        }
                    });
                },
                iSetModeltoAppSearchComponent: function (oData) {
                    return this.waitFor({
                        controlType: "sap.ui.core.ComponentContainer",
                        fragmentId: "sap.ushell.components.contentFinder.view.ContentFinderDialog",
                        properties: {
                            name: "sap.ushell.components.contentFinderAppSearch"
                        },
                        searchOpenDialogs: true,
                        success: function (oComponent) {
                            var oEditModel = oComponent[0].getComponentInstance().getRootControl().getModel();
                            oEditModel.setProperty("/data/visualizations", oData);
                            oEditModel.firePropertyChange({ type: "visualizations" });
                        }
                    });
                },
                iEnterTextinAppBoxSearch: function (sText) {
                    return this.waitFor({
                        id: "appSearchField",
                        viewName: "sap.ushell.components.contentFinder.view.AppSearch",
                        actions: [new EnterText({ text: sText })],
                        searchOpenDialogs: true
                    });
                },
                iSelectTileInContentFinder: function (iWidgetIndex) {
                    return this.waitFor({
                        controlType: "sap.f.GridList",
                        id: "visualizationsGridList",
                        viewName: "sap.ushell.components.contentFinder.view.AppSearch",
                        searchOpenDialogs: true,
                        success: function (oGridContainer) {
                            new Press().executeOn(oGridContainer.getItems()[iWidgetIndex]);
                        }
                    });
                },

                iSelectVisualizationsFilterInContentFinder: function (sKey) {
                    return this.waitFor({
                        controlType: "sap.m.SegmentedButton",
                        id: "selectVisualizationsFilter",
                        viewName: "sap.ushell.components.contentFinder.view.AppSearch",
                        searchOpenDialogs: true,
                        success: function (oElement) {
                            oElement.getItems().forEach((oButton) => {
                                if (oButton.getKey() === sKey) {
                                    new Press().executeOn(oButton);
                                }
                            });
                        }
                    });
                },

                iSelectCardInContentFinder: function (iWidgetIndex) {
                    return this.waitFor({
                        controlType: "sap.f.GridList",
                        id: "visualizationsGridList",
                        viewName: "sap.ushell.components.contentFinder.view.AppSearch",
                        searchOpenDialogs: true,
                        success: function (oGridContainer) {
                            new Press().executeOn(oGridContainer.getItems()[iWidgetIndex]);
                        }
                    });
                },

                iToggleSelectAllButton: function (bValue) {
                    return this.waitFor({
                        id: "showAllSelectedBtn",
                        viewName: "sap.ushell.components.contentFinder.view.AppSearch",
                        searchOpenDialogs: true,
                        success: function (oToggleButton) {
                            new Press().executeOn(oToggleButton);
                        }
                    });
                },

                iToggleShowSelectedButton: function (bValue) {
                    return this.waitFor({
                        id: "showAllSelectedBtn",
                        viewName: "sap.ushell.components.contentFinder.view.AppSearch",
                        searchOpenDialogs: true,
                        actions: new Press()
                    });
                },
                iPressOnConfirmInAddContentDialog: function (params) {
                    return this.waitFor({
                        id: "addVisualizationsButton",
                        viewName: "sap.ushell.components.contentFinder.view.ContentFinderDialog",
                        success: function (oButton) {
                            new Press().executeOn(oButton);
                        }
                    });
                },
                iPressOnCloseInAddContentDialog: function (params) {
                    return this.waitFor({
                        controlType: "sap.m.Button",
                        viewName: sViewName,
                        i18NText: {
                            propertyName: "text",
                            key: "ContentFinder.Button.Cancel"
                        },
                        searchOpenDialogs: true,
                        actions: new Press()
                    });
                },
                iDragAndDropAVisualizationOnToACell: function (
                    iFromRowIndex,
                    iFromColumnIndex,
                    iFromCellIndex,
                    iFromWidgetIndex,
                    iToRowIndex,
                    iToColumnIndex,
                    iToCellIndex
                ) {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.ushell.components.workPageBuilder.controls.WorkPage",
                        success: function (aWorkPages) {
                            var oFromRow = aWorkPages[0].getAggregation("rows")[iFromRowIndex];
                            var oFromColumn = oFromRow.getAggregation("columns")[iFromColumnIndex];
                            var oFromCell = oFromColumn.getAggregation("cells")[iFromCellIndex];
                            var oWidget = oFromCell.getAggregation("widgets")[iFromWidgetIndex];

                            var oToRow = aWorkPages[0].getAggregation("rows")[iToRowIndex];
                            var oToColumn = oToRow.getAggregation("columns")[iToColumnIndex];
                            var oToCell = oToColumn.getAggregation("cells")[iToCellIndex];

                            new Drag().executeOn(oWidget);
                            new Drop({
                                aggregationName: "widgets"
                            }).executeOn(oToCell);
                        }
                    });
                },
                iDragAndDropAVisualizationOnToAColumn: function (
                    iFromRowIndex,
                    iFromColumnIndex,
                    iFromCellIndex,
                    iFromWidgetIndex,
                    iToRowIndex,
                    iToColumnIndex
                ) {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.ushell.components.workPageBuilder.controls.WorkPage",
                        success: function (aWorkPages) {
                            var oFromRow = aWorkPages[0].getAggregation("rows")[iFromRowIndex];
                            var oFromColumn = oFromRow.getAggregation("columns")[iFromColumnIndex];
                            var oFromCell = oFromColumn.getAggregation("cells")[iFromCellIndex];
                            var oWidget = oFromCell.getAggregation("widgets")[iFromWidgetIndex];

                            var oToRow = aWorkPages[0].getAggregation("rows")[iToRowIndex];
                            var oToColumn = oToRow.getAggregation("columns")[iToColumnIndex];

                            new Drag().executeOn(oWidget);
                            new Drop({
                                aggregationName: "cells"
                            }).executeOn(oToColumn);
                        }
                    });
                },
                iDragAndDropAVisualizationNextToACard: function (
                    iFromRowIndex,
                    iFromColumnIndex,
                    iFromCellIndex,
                    iFromWidgetIndex,
                    iToRowIndex,
                    iToColumnIndex,
                    iToCellIndex,
                    sPosition
                ) {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.ushell.components.workPageBuilder.controls.WorkPage",
                        success: function (aWorkPages) {
                            var oFromRow = aWorkPages[0].getAggregation("rows")[iFromRowIndex];
                            var oFromColumn = oFromRow.getAggregation("columns")[iFromColumnIndex];
                            var oFromCell = oFromColumn.getAggregation("cells")[iFromCellIndex];
                            var oWidget = oFromCell.getAggregation("widgets")[iFromWidgetIndex];

                            var oToRow = aWorkPages[0].getAggregation("rows")[iToRowIndex];
                            var oToColumn = oToRow.getAggregation("columns")[iToColumnIndex];
                            var oToCell = oToColumn.getAggregation("cells")[iToCellIndex];

                            new Drag().executeOn(oWidget);
                            new Drop({
                                aggregationName: "widgets",
                                before: sPosition === "Before",
                                after: sPosition === "After"
                            }).executeOn(oToCell);
                        }
                    });
                },
                iDragAndDropACellOnToAColumn: function (
                    iFromRowIndex,
                    iFromColumnIndex,
                    iFromCellIndex,
                    iToRowIndex,
                    iToColumnIndex,
                    iToCellIndex,
                    sPosition
                ) {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.ushell.components.workPageBuilder.controls.WorkPage",
                        success: function (aWorkPages) {
                            var oFromRow = aWorkPages[0].getAggregation("rows")[iFromRowIndex];
                            var oFromColumn = oFromRow.getAggregation("columns")[iFromColumnIndex];
                            var oFromCell = oFromColumn.getAggregation("cells")[iFromCellIndex];

                            var oToRow = aWorkPages[0].getAggregation("rows")[iToRowIndex];
                            var oToColumn = oToRow.getAggregation("columns")[iToColumnIndex];
                            var aToColumnCells = oToColumn.getAggregation("cells");
                            var oTargetElement;

                            if (aToColumnCells.length === 0) {
                                oTargetElement = oToColumn;
                            } else {
                                oTargetElement = aToColumnCells[iToCellIndex];
                            }

                            new Drag().executeOn(oFromCell);
                            new Drop({
                                aggregationName: "cells",
                                before: sPosition === "Before",
                                after: sPosition === "After"
                            }).executeOn(oTargetElement);
                        }
                    });
                },
                iPressCardActionDefinition: function (iRowIndex, iColumnIndex, iCellIndex, iWidgetIndex, iActionDefinition) {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.ushell.components.workPageBuilder.controls.WorkPage",
                        success: function (oWorkPage) {
                            var oRow = oWorkPage[0].getAggregation("rows")[iRowIndex];
                            var oColumn = oRow.getAggregation("columns")[iColumnIndex];
                            var oCell = oColumn.getAggregation("cells")[iCellIndex];
                            var oWidget = oCell.getAggregation("widgets")[iWidgetIndex];
                            var oActionDefinition = oWidget.getActionDefinitions()[iActionDefinition];

                            oActionDefinition.firePress();
                        }
                    });
                },

                iPressTheDeleteCardButton: function (iRowIndex, iColumnIndex, iCellIndex) {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.ushell.components.workPageBuilder.controls.WorkPage",
                        success: function (oWorkPage) {
                            var oRow = oWorkPage[0].getAggregation("rows")[iRowIndex];
                            var oColumn = oRow.getAggregation("columns")[iColumnIndex];
                            var oCell = oColumn.getAggregation("cells")[iCellIndex];
                            var oHeaderBar = oCell.getAggregation("headerBar");
                            var oDeleteButton = oHeaderBar.getAggregation("content")[2];

                            new Press().executeOn(oDeleteButton);
                        }
                    });
                },

                iPressCancelInCardEditorDialog: function () {
                    return this.waitFor({
                        controlType: "sap.m.Dialog",
                        searchOpenDialogs: true,
                        success: function (aDialogs) {
                            var oButton = aDialogs[0].getEndButton();
                            new Press().executeOn(oButton);
                        }
                    });
                },

                iPressSaveInCardEditorDialog: function () {
                    return this.waitFor({
                        controlType: "sap.m.Dialog",
                        searchOpenDialogs: true,
                        success: function (aDialogs) {
                            var oButton = aDialogs[0].getBeginButton();
                            new Press().executeOn(oButton);
                        }
                    });
                },
                iPressDeleteInCardResetDialog: function () {
                    return this.waitFor({
                        controlType: "sap.m.Dialog",
                        searchOpenDialogs: true,
                        success: function (aDialogs) {
                            var oButton = aDialogs[0].getBeginButton();
                            new Press().executeOn(oButton);
                        }
                    });
                },
                iChangeCardSettingsTitle: function (sText) {
                    return this.waitFor({
                        controlType: "sap.m.Input",
                        searchOpenDialogs: true,
                        success: function (aInputs) {
                            var oTitleInput = aInputs[0];
                            oTitleInput.setValue(sText);
                        }
                    });
                },

                iChangeCardSettingsSubtitle: function (sText) {
                    return this.waitFor({
                        controlType: "sap.m.Input",
                        searchOpenDialogs: true,
                        success: function (aInputs) {
                            var oSubtitleInput = aInputs[1];
                            oSubtitleInput.setValue(sText);
                        }
                    });
                },
                iPressTheAddBusinessApplicationWidgetButton: function (iRowIndex, iColumnIndex, iCellIndex) {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.ushell.components.workPageBuilder.controls.WorkPage",
                        success: function (oWorkPage) {
                            var oRow = oWorkPage[0].getAggregation("rows")[iRowIndex];
                            var oColumn = oRow.getAggregation("columns")[iColumnIndex];
                            var oCell = oColumn.getAggregation("cells")[iCellIndex];
                            var oHeaderBar = oCell.getAggregation("headerBar");
                            var oAddButton = oHeaderBar.getAggregation("content")[1];

                            new Press().executeOn(oAddButton);
                        }
                    });
                },
                iPressTheDeleteBusinessApplicationWidgetButton: function (iRowIndex, iColumnIndex, iCellIndex) {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.ushell.components.workPageBuilder.controls.WorkPage",
                        success: function (oWorkPage) {
                            var oRow = oWorkPage[0].getAggregation("rows")[iRowIndex];
                            var oColumn = oRow.getAggregation("columns")[iColumnIndex];
                            var oCell = oColumn.getAggregation("cells")[iCellIndex];
                            var oHeaderBar = oCell.getAggregation("headerBar");
                            var oDeleteButton = oHeaderBar.getAggregation("content")[2];
                            return this.waitFor({
                                id: oDeleteButton.getId(),
                                ancestor: oCell,
                                actions: new Press()
                            });
                        }
                    });
                },
                iRemoveTileFromCell: function () {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.ui.core.Icon",
                        matchers: new Properties({
                            src: "sap-icon://decline"
                        }),
                        actions: new Press()
                    });
                }

            },
            assertions: {
                iSeeThePageTitle: function (sTitle) {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.m.Title",
                        matchers: new Properties({
                            text: sTitle
                        }),
                        success: function () {
                            Opa5.assert.ok(true, "The title was visible");
                        }
                    });
                },
                iSeeTheEmptyIllustrationNoData: function () {
                    return this.waitFor({
                        controlType: "sap.m.IllustratedMessage",
                        matchers: new Properties({
                            illustrationType: "sapIllus-SearchFolder",
                            description: "",
                            title: ""
                        }),
                        success: function () {
                            Opa5.assert.ok(true, "The empty illustration was found.");
                        },
                        errorMessage: "The empty illustration isn't visible."
                    });
                },
                iSeeTheEmptyIllustrationTitle: function () {
                    return this.waitFor({
                        controlType: "sap.m.Title",
                        matchers:
                            new Properties({
                                text: "No results found",
                                visible: true
                            }),
                        success: function () {
                            Opa5.assert.ok(true, "The empty illustration description is visible.");
                        }
                    });
                },
                iSeeTheEmptyIllustrationDescription: function () {
                    return this.waitFor({
                        controlType: "sap.m.Text",
                        matchers:
                            new Properties({
                                text: "Try changing your search criteria.",
                                visible: true
                            }),
                        success: function () {
                            Opa5.assert.ok(true, "The empty illustration description is visible.");
                        }
                    });
                },
                iSeeTheEmptyIllustration: function (sTitle, sDescription) {
                    return this.waitFor({
                        controlType: "sap.m.IllustratedMessage",
                        matchers: new Properties({
                            title: sTitle,
                            description: sDescription
                        }),
                        success: function () {
                            Opa5.assert.ok(true, "The empty business application widget illustration is visible");
                        },
                        errorMessage: "The empty business application widget illustration is not found."
                    });
                },
                iSeeTheFooterBarAndSaveButton: function () {
                    return this.waitFor({
                        viewName: sViewName,
                        id: "workPageFooterBar",
                        controlType: "sap.m.Bar",
                        success: function (oFooterBar) {
                            Opa5.assert.ok(true, "The FooterBar was visible");

                            return this.waitFor({
                                ancestor: oFooterBar,
                                controlType: "sap.m.Button",
                                matchers: new I18NTextMatcher({
                                    propertyName: "text",
                                    key: "WorkPage.EditMode.Save"
                                }),
                                success: function () {
                                    Opa5.assert.ok(true, "The FooterBar 'Close' button was visible");
                                }
                            });
                        }
                    });
                },
                iSeeTheFooterBar: function (bVisible) {
                    return this.waitFor({
                        viewName: sViewName,
                        id: "workpageBuilderPage",
                        controlType: "sap.m.Page",
                        success: function (oPage) {
                            Opa5.assert.strictEqual(oPage.getShowFooter(), bVisible, "The Footer bar has the expected visibility");
                        }
                    });
                },
                iSeeTheRowToolbarButton: function (sId) {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.m.Button",
                        id: sId,
                        success: function () {
                            Opa5.assert.ok(true, "The WorkPageRow button is visible.");
                        }
                    });
                },
                iSeeTheRowAddButtons: function (iCount) {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.ushell.components.workPageBuilder.controls.WorkPageButton",
                        check: function (aButtons) {
                            return aButtons.length === iCount;
                        },
                        success: function () {
                            Opa5.assert.ok(true, iCount + " 'Add' buttons are visible.");
                        }
                    });
                },
                iSeeTheRowWithProperties: function (oRowProperties, oInputProperties) {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.ushell.components.workPageBuilder.controls.WorkPageRow",
                        matchers: new Properties(oRowProperties),
                        success: function (oWorkPageRow) {
                            Opa5.assert.ok(true, "The WorkPageRow was visible and had the expected properties");

                            return this.waitFor({
                                ancestor: oWorkPageRow,
                                controlType: "sap.m.Input",
                                matchers: new Properties(oInputProperties),
                                success: function () {
                                    Opa5.assert.ok(true, "The WorkPageRow title input is visible and had the expected properties");
                                }
                            });
                        }
                    });
                },
                iSeeANumberOfRows: function (iCount) {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.ushell.components.workPageBuilder.controls.WorkPageRow",
                        check: function (aRows) {
                            return aRows.length === iCount;
                        },
                        success: function () {
                            Opa5.assert.ok(true, iCount + " WorkPageRows were found.");
                        }
                    });
                },
                iSeeAnAriaLabelForRow: function (iRowIndex, sRowTitle) {
                    return this.waitFor({
                        viewName: sViewName,
                        success: function () {
                            const aRows = document.getElementsByClassName("workPageRow");
                            const sAriaLabel = aRows[iRowIndex].getAttribute("aria-label");
                            let sExpectedAriaLabel = sRowTitle
                                ? oResourceBundle.getText("WorkPage.Row.Named.AriaLabel", [sRowTitle])
                                : oResourceBundle.getText("WorkPage.Row.Unnamed.AriaLabel", [iRowIndex + 1]);

                            Opa5.assert.strictEqual(sAriaLabel, sExpectedAriaLabel, `The aria-label property for row with index ${iRowIndex} was correct: ${sAriaLabel}.`);
                        }
                    });
                },
                iSeeColumnWidthInRow: function (iRowIndex, aColumnWidths) {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.ushell.components.workPageBuilder.controls.WorkPage",
                        success: function (aWorkPages) {
                            var oRow = aWorkPages[0].getAggregation("rows")[iRowIndex];
                            var aColumns = oRow.getColumns();

                            var aCurrentColumnWidths = aColumns.map(function (oColumn) {
                                return oColumn.getColumnWidth();
                            });

                            Opa5.assert.deepEqual(aCurrentColumnWidths, aColumnWidths, "The ColumnWidths were equal");
                        }
                    });
                },
                iSeeTileWithProperties: function (oTileProperties) {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.m.GenericTile",
                        matchers: new Properties(oTileProperties),
                        success: function () {
                            Opa5.assert.ok(true, "The tile was visible and had the expected properties");
                        }
                    });
                },
                iSeeCardWithProperties: function (oCardProperties) {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.ui.integration.widgets.Card",
                        matchers: new Properties(oCardProperties),
                        success: function () {
                            Opa5.assert.ok(true, "The card was visible and had the expected properties");
                        }
                    });
                },
                iSeeCardsInPreviewMode: function () {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.ui.integration.widgets.Card",
                        success: function (aCards) {
                            aCards.forEach(function (oCard) {
                                Opa5.assert.notOk(oCard.getPreviewMode() === "Off", "The card had the expected previewMode");
                            });
                        }
                    });
                },
                iSeeANumberOfColumns: function (iRowIndex, iCount) {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.ushell.components.workPageBuilder.controls.WorkPage",
                        success: function (aWorkPages) {
                            var oRow = aWorkPages[0].getAggregation("rows")[iRowIndex];
                            return this.waitFor({
                                viewName: sViewName,
                                controlType: "sap.ushell.components.workPageBuilder.controls.WorkPageColumn",
                                ancestor: oRow,
                                check: function (aColumns) {
                                    return aColumns.length === iCount;
                                },
                                success: function () {
                                    Opa5.assert.ok(true, iCount + " WorkPageColumns were found.");
                                }
                            });
                        }
                    });
                },
                iSeeTheContentFinderDialog: function () {
                    return this.waitFor({
                        controlType: "sap.m.Dialog",
                        fragmentId: "sap.ushell.components.contentFinder.view.ContentFinderDialog",
                        success: function (oDialog) {
                            Opa5.assert.ok(true, "The dialog is open");
                        }
                    });
                },
                iSeeTheAppBoxTitle: function (sText) {
                    return this.waitFor({
                        id: "appSearchVisualizationsTitle",
                        viewName: "sap.ushell.components.contentFinder.view.AppSearch",
                        searchOpenDialogs: true,
                        success: function (aControls) {
                            var oControl = aControls[0] || aControls;
                            Opa5.assert.strictEqual(oControl.getText(), sText);
                        }
                    });
                },
                iSeeTheSelectAllButtonTextChange: function (sText) {
                    return this.waitFor({
                        id: "SelectAllToggleBtn",
                        viewName: "sap.ushell.components.contentFinderAppSearch.view.ContentFinderAppSearch",
                        searchOpenDialogs: true,
                        success: function (vControls) {
                            var oControl = vControls[0] || vControls;
                            Opa5.assert.strictEqual(oControl.getText(), sText);
                        }
                    });
                },
                iSeeContentFinderTitle: function (sText) {
                    return this.waitFor({
                        controlType: "sap.m.Title",
                        matchers: new Properties({
                            text: sText
                        }),
                        searchOpenDialogs: true,
                        success: function () {
                            Opa5.assert.ok(true, sText + " is displayed");
                        }
                    });
                },
                iSeeTheAddButtonAppCount: function (iAppSelectedCouunt) {
                    return this.waitFor({
                        id: /addVisualizationsButton/,
                        viewName: "sap.ushell.components.contentFinder.view.ContentFinderDialog",
                        matchers: new Properties({
                            text: "Add (" + iAppSelectedCouunt + ")"
                        }),
                        success: function () {
                            Opa5.assert.ok(true, "The Add Button is updated with count");
                        }
                    });
                },
                iSeeTheAddButtonDisabled: function () {
                    return this.waitFor({
                        controlType: "sap.m.Button",
                        viewName: "sap.ushell.components.workPageBuilder.view.WorkPageBuilder",
                        bindingPath: {
                            path: "",
                            propertyPath: "/selectedWidget"
                        },
                        searchOpenDialogs: true,
                        success: function (vControls) {
                            var oControl = vControls[0] || vControls;
                            Opa5.assert.ok(!oControl.getEnabled());
                        }
                    });
                },
                iSeeTheAddedWidget: function (iRowIndex, iColumnIndex) {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.ushell.components.workPageBuilder.controls.WorkPage",
                        success: function (oWorkPage) {
                            var oRow = oWorkPage[0].getAggregation("rows")[iRowIndex];
                            var oColumn = oRow.getAggregation("columns")[iColumnIndex];
                            Opa5.assert.ok(oColumn.getCells().length > 0, "The widget was added");
                        }
                    });
                },
                iSeeTheMovedWidgetAtPosition: function (iRowIndex, iColumnIndex, iCellIndex, iWidgetIndex, sWidgetTitle) {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.ushell.components.workPageBuilder.controls.WorkPage",
                        success: function (oWorkPage) {
                            var oRow = oWorkPage[0].getAggregation("rows")[iRowIndex];
                            var oColumn = oRow.getAggregation("columns")[iColumnIndex];
                            var oCell = oColumn.getAggregation("cells")[iCellIndex];
                            var oWidget = oCell.getAggregation("widgets")[iWidgetIndex];
                            Opa5.assert.ok(oWidget.isA("sap.ushell.ui.launchpad.VizInstanceCdm"));
                            Opa5.assert.strictEqual(oWidget.getTitle(), sWidgetTitle);
                        }
                    });
                },
                iSeeAMessageStripInRow: function (iRowIndex, oProperties) {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.ushell.components.workPageBuilder.controls.WorkPage",
                        success: function (oWorkPage) {
                            var oRow = oWorkPage[0].getAggregation("rows")[iRowIndex];

                            return this.waitFor({
                                controlType: "sap.m.MessageStrip",
                                matchers: new Properties(oProperties),
                                ancestor: oRow,
                                success: function () {
                                    Opa5.assert.ok(true, "The MessageStrip was shown in row with index " + iRowIndex + ".");
                                }
                            });
                        }
                    });
                },
                iDoNotSeeAMessageStripInRow: function (iRowIndex) {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.ushell.components.workPageBuilder.controls.WorkPage",
                        success: function (oWorkPage) {
                            var oRow = oWorkPage[0].getAggregation("rows")[iRowIndex];
                            var aMessageStrips = oRow.getDomRef().querySelectorAll(".workPageRowMessageStrip");

                            Opa5.assert.strictEqual(aMessageStrips.length, 0, "The MessageStrip was not shown in row with index " + iRowIndex + ".");
                        }
                    });
                },
                iSeeTheAmountOfAddColumnButtons: function (iRowIndex, iAmount) {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.ushell.components.workPageBuilder.controls.WorkPage",
                        success: function (oWorkPage) {
                            var oRow = oWorkPage[0].getAggregation("rows")[iRowIndex];
                            var aAddColumnButtons = oRow.getDomRef().querySelectorAll(".workPageDividerButton");

                            Opa5.assert.strictEqual(aAddColumnButtons.length, iAmount, iAmount + " 'Add Column' buttons were shown in row with index " + iRowIndex + ".");
                        }
                    });
                },

                iSeeTheCardEditorDialog: function () {
                    return this.waitFor({
                        controlType: "sap.m.Dialog",
                        success: function () {
                            Opa5.assert.ok(true, "The dialog is open");
                        }
                    });
                },

                iSeeTheCardResetDialog: function () {
                    return this.waitFor({
                        controlType: "sap.m.Dialog",
                        success: function () {
                            Opa5.assert.ok(true, "The dialog is open");
                        }
                    });
                },

                iSeeTheCardEditorTitle: function (sTitle) {
                    return this.waitFor({
                        controlType: "sap.m.Dialog",
                        matchers: new Properties({
                            title: sTitle
                        }),
                        success: function () {
                            Opa5.assert.ok(true, "The dialog has the correct title of the card.");
                        }
                    });
                },

                iSeeCardWithHeaderProperty: function (iRowIndex, iColumnIndex, iCellIndex, iWidgetIndex, sCardProperty, sCardPropertyValue) {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.ushell.components.workPageBuilder.controls.WorkPage",
                        success: function (oWorkPage) {
                            var oRow = oWorkPage[0].getAggregation("rows")[iRowIndex];
                            var oColumn = oRow.getAggregation("columns")[iColumnIndex];
                            var oCell = oColumn.getAggregation("cells")[iCellIndex];
                            var oWidget = oCell.getAggregation("widgets")[iWidgetIndex];

                            Opa5.assert.strictEqual(
                                oWidget.getCardHeader().getProperty(sCardProperty),
                                sCardPropertyValue,
                                "The value for property " + sCardProperty + " was " + sCardPropertyValue + "."
                            );
                        }
                    });
                },

                iCanSeeTheBusinessApplicationWidgetToolbar: function () {
                    return this.waitFor({
                        controlType: "sap.m.OverflowToolbar",
                        matchers: new Properties({
                            id: new RegExp(".*--workPageCellOverflowToolbar-.*")
                        }),
                        success: function () {
                            Opa5.assert.ok(true, "The toolbar is shown.");
                        },
                        errorMessage: "Could not find the overflow toolbar from the business application widget."
                    });
                },

                iCanSeeTheAddAndDeleteBusinessApplicationWidgetButtons: function (iRowIndex, iColumnIndex, iCellIndex) {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.ushell.components.workPageBuilder.controls.WorkPage",
                        check: function (oWorkPage) {
                            var oRow = oWorkPage[0].getAggregation("rows")[iRowIndex];
                            var oColumn = oRow.getAggregation("columns")[iColumnIndex];
                            var oCell = oColumn.getAggregation("cells")[iCellIndex];
                            var oHeaderBar = oCell.getAggregation("headerBar");
                            var oAddButton = oHeaderBar.getAggregation("content")[1];
                            var oDeleteButton = oHeaderBar.getAggregation("content")[2];

                            if (oAddButton && oDeleteButton) {
                                return true;
                            }
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The delete and add button are shown.");
                        }
                    });
                },

                iCanSeeTheAddWidgetButton: function () {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.m.Button",
                        matchers: new Properties({
                            text: "Add Widget"
                        }),
                        check: function (aButtons) {
                            if (aButtons.length === 1) {
                                return true;
                            }
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The delete and add button are shown.");
                        }
                    });
                },
                iCanSeeEmptyCellWithAddWidgetButton: function () {
                    return this.waitFor({
                        controlType: "sap.ushell.components.workPageBuilder.controls.WorkPageColumn",
                        success: function (aColumns) {
                            return this.waitFor({
                                controlType: "sap.m.Button",
                                matchers: [
                                    new Ancestor(aColumns[0]),
                                    new Properties({
                                        text: "Add Widget"
                                    })],
                                success: function () {
                                    Opa5.assert.ok(true, "The empty cell with the button is shown.");
                                }
                            });
                        }
                    });
                }
            }
        }
    });
});
