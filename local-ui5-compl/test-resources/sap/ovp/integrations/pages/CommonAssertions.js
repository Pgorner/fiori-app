sap.ui.define(["sap/ui/test/Opa5", "sap/ui/test/OpaBuilder", "sap/ui/test/matchers/PropertyStrictEquals", "test-resources/sap/ovp/integrations/Insights/Helper/CardManifest"],
    function (Opa5, OpaBuilder, PropertyStrictEquals, InsightCardManifests) {
        "use strict";

        // All the assertions for Opa tests are defined here
        var CommonAssertions = Opa5.extend("sap.ovp.test.integrations.pages.CommonAssertions", {
            dialogOpen: function () {
                return this.waitFor({
                    controlType: "sap.m.Title",
                    matchers: new PropertyStrictEquals({
                        name: "text",
                        value: "Adapt Filters",
                    }),
                    success: function (oTitle) {
                        Opa5.assert.ok(true, "Setting Dialog opened with a title");
                    },
                    errorMessage: "Setting Dialog not opened with a title.",
                });
            },
            checkNavParams: function (sKey, sValue) {
                return this.waitFor({
                    // Turn off autoWait
                    autoWait: true,
                    check: function () {
                        // Locate the message toast using its class name in a jQuery function
                        var hash = Opa5.getWindow().location.hash;
                        var propertySplit = hash.split(sKey)[1];
                        var propertyValue = propertySplit && propertySplit.split("&")[0];
                        if (propertyValue.indexOf(sValue) > -1) {
                            return true;
                        }
                    },
                    success: function () {
                        Opa5.assert.ok(true, "Parameter passed to target app");
                    },
                    errorMessage: "Parameter did not gets paased to target app",
                });
            },

            checkAppTitle: function (appName) {
                var bSuccess = false;
                return this.waitFor({
                    controlType: "sap.m.Button",
                    timeout: 30,
                    check: function (aButtons) {
                        for (var i in aButtons) {
                            if (aButtons[i].getId().indexOf("shellAppTitle") !== -1) {
                                if (aButtons[i].getText() === appName) {
                                    bSuccess = true;
                                }
                            }
                        }
                        return bSuccess;
                    },
                    success: function () {
                        Opa5.assert.ok(true, "Application with Title " + appName + " found successfully");
                    },
                    errorMessage: "Cannot navigate to new app",
                });
            },

            iCheckVariantText: function (sId, sText) {
                return this.waitFor({
                    id: sId,
                    controlType: "sap.m.Title",
                    timeout: 30,
                    check: function (oVariant) {
                        return (oVariant.getText() === sText);
                    },
                    success: function () {
                        Opa5.assert.ok(true, sText + " Variant applied");
                    },
                    errorMessage: sText + " Variant not applied",
                });
            },

            iCheckTheAdaptFiltersButton: function () {
                return this.waitFor({
                    controlType: "sap.m.Button",
                    check: function (aButtons) {
                        for (var i in aButtons) {
                            if (aButtons[i].getId().indexOf("ovpGlobalFilter-btnFilters") > -1) {
                                return true;
                            }
                        }
                        return false;
                    },
                    success: function () {
                        Opa5.assert.ok(true, "Adapt Filter is present on UI.");
                    },
                    errorMessage: " Adapt Filters button cant be clicked",
                });
            },

            iCheckControlWithIdExists: function (sId) {
                return this.waitFor({
                    id: sId,
                    timeout: 45,
                    success: function () {
                        Opa5.assert.ok(true, "Control with " + sId + " is loaded successfully.");
                    },
                    errorMessage: "Failed to load Control with " + sId
                });
            },

            iCheckControlExists: function (sId,sControlType) {
                return this.waitFor({
                    controlType: sControlType,
                    timeout: 45,
                    check: function (oControl) {
                        for (var i in oControl) {
                            if (oControl[i].getId().indexOf(sId) > -1) {
                                return true;
                            }
                        }
                    },
                    success: function () {
                        Opa5.assert.ok(true, "Control with " + sId + " is loaded successfully.");
                    },
                    errorMessage: "Failed to load Control with " + sId
                });
            },

            iCheckIdNotExists: function (sControlId, sName, sControlType) {
                return this.waitFor({
                    controlType: sControlType,
                    check: function (aControl) {
                        for (var i in aControl) {
                            if (aControl[i].getId().indexOf(sControlId) > -1) {
                                return false;
                            }
                        }
                        return true;
                    },
                    success: function () {
                        Opa5.assert.ok(true, sName + " not present.");
                    },
                    errorMessage: sName + " is present."
                });
            },

            iCheckIdExists: function (sControlId, sName, sControlType) {
                return this.waitFor({
                    controlType: sControlType,
                    check: function (aControl) {
                        for (var i in aControl) {
                            if (aControl[i].getId().indexOf(sControlId) > -1) {
                                return true;
                            }
                        }
                        return false;
                    },
                    success: function () {
                        Opa5.assert.ok(true, sName + " is present.");
                    },
                    errorMessage: sName + " is not present."
                });
            },

            // Common Functions - Cards Header Region

            iCheckTextNotPresent: function (sResultValue, sID) {
                return this.waitFor({
                    controlType: "sap.m.Text",
                    timeout: 30,
                    check: function (aTitles) {
                        for (var i in aTitles) {
                            if (aTitles[i].getId().indexOf(sID) !== -1 &&
                                aTitles[i].getText() === sResultValue) {
                                return false;
                            }
                        }
                        return true;
                    },
                    success: function () {
                        Opa5.assert.ok(true, "Text : '" + sResultValue + "' is not present");
                    },
                    errorMessage: "Text : '" + sResultValue + "' is present",
                });
            },

            iCheckCardText: function (sResultValue, sID, sCardText) {
                var bSuccess = false;
                return this.waitFor({
                    controlType: "sap.m.Text",
                    timeout: 30,
                    check: function (aTitles) {
                        for (var i in aTitles) {
                            if (aTitles[i].getId().indexOf(sID) !== -1) {
                                if (aTitles[i].getText() === sResultValue) {
                                    bSuccess = true;
                                }
                            }
                        }
                        return bSuccess;
                    },
                    success: function () {
                        Opa5.assert.ok(true, "Card with " + sCardText + " : '" + sResultValue + "' found successfully");
                    },
                    errorMessage: "Card Not Found",
                });
            },

            iCheckLinkText: function (sResultValue, sID, sLinkText) {
                var bSuccess = false;
                return this.waitFor({
                    controlType: "sap.m.Link",
                    timeout: 30,
                    check: function (aLinks) {
                        for (var i in aLinks) {
                            if (aLinks[i].getId().indexOf(sID) !== -1) {
                                if (aLinks[i].getText() === sResultValue) {
                                    bSuccess = true;
                                }
                            }
                        }
                        return bSuccess;
                    },
                    success: function () {
                        Opa5.assert.ok(true, "Link with " + sLinkText + " : '" + sResultValue + "' found successfully");
                    },
                    errorMessage: "Link Not Found",
                });
            },

            iCheckLabelText: function (sResultValue, sID, sLabelText) {
                var bSuccess = false;
                return this.waitFor({
                    controlType: "sap.m.Label",
                    timeout: 30,
                    check: function (aLabels) {
                        for (var i in aLabels) {
                            if (aLabels[i].getId().indexOf(sID) !== -1) {
                                if (aLabels[i].getText() === sResultValue) {
                                    bSuccess = true;
                                }
                            }
                        }
                        return bSuccess;
                    },
                    success: function () {
                        Opa5.assert.ok(true, "Label with " + sLabelText + " : '" + sResultValue + "' found successfully");
                    },
                    errorMessage: "Label Not Found",
                });
            },

            iCheckCardKpiInfo: function (sID, sResultValue, sKPIInfo) {
                var sKPIType = "";
                return this.waitFor({
                    controlType: "sap.m.NumericContent",
                    timeout: 30,
                    check: function (aRow) {
                        for (var i in aRow) {
                            var rowID = aRow[i] && aRow[i].getId();
                            if (rowID && rowID.indexOf(sID) > -1) {
                                if (sKPIInfo === 'KPIValue') {
                                    sKPIType = "KPI Value";
                                    return aRow[i].getValue() === sResultValue;
                                } else if (sKPIInfo === 'KPIColour') {
                                    sKPIType = "KPI Colour";
                                    return aRow[i].getValueColor() === sResultValue;
                                } else if (sKPIInfo === 'KPIDirection') {
                                    sKPIType = "KPI Arrow Direction";
                                    return aRow[i].getIndicator() === sResultValue;
                                }
                            }
                        }
                        return false;
                    },
                    success: function () {
                        Opa5.assert.ok(true, "Card with " + sKPIType + " : '" + sResultValue + "' found successfully");
                    },
                    errorMessage: "Card with KPI Info not present or incorrect"
                });
            },

            iCheckCardTargetValue: function (sID, sTargetValue) {
                return this.waitFor({
                    controlType: "sap.m.Text",
                    timeout: 45,
                    check: function (aRow) {
                        var count = 0;
                        for (var i in aRow) {
                            var rowID = aRow[i].getId();
                            if (rowID.indexOf(sID) > -1 && rowID.indexOf("ovpTargetValue") > -1) {
                                var targetValue = aRow[i].getText();
                                if (targetValue === sTargetValue) {
                                    return true;
                                }
                            }
                        }
                        return false;
                    },
                    success: function () {
                        Opa5.assert.ok(true, "Target Value for Card" + ": " + sTargetValue);
                    },
                    errorMessage: "Target Value is not present or incorrect",
                });
            },

            iCheckCardDeviation: function (sID, sDeviationValue) {
                return this.waitFor({
                    controlType: "sap.m.Text",
                    timeout: 45,
                    check: function (aRow) {
                        var count = 0;
                        for (var i in aRow) {
                            var rowID = aRow[i].getId();
                            if (rowID.indexOf(sID) > -1 && rowID.indexOf("kpiNumberPercentage") > -1) {
                                var devValue = aRow[i].getText();
                                if (devValue === sDeviationValue) {
                                    return true;
                                }
                            }
                        }
                        return false;
                    },
                    success: function () {
                        Opa5.assert.ok(true, "Deviation value for Card" + ": " + sDeviationValue);
                    },
                    errorMessage: "Deviation not present or incorrect",
                });
            },

            iCheckForNumberOFCards: function (sCardType, sCardCount, sControlType) {
                var count = 0;
                return this.waitFor({

                    controlType: sControlType,
                    timeout: 45,
                    visible: false,

                    check: function (aCard) {
                        for (var i in aCard) {
                            switch (sControlType) {
                                case 'sap.m.List':
                                    var listId = aCard[i].getId();
                                    if ((listId.indexOf("ovpLinkList") > -1 && sCardType === "LinkList") ||
                                        (listId.indexOf("ovpList") > -1 && sCardType === "List")) {
                                        count++;
                                    }
                                    break;
                                case 'sap.m.Carousel':
                                    if (aCard[i].getId().indexOf("pictureCarousel") > -1) {
                                        count++;
                                    }
                                    break;
                                case 'sap.m.Table':
                                    if (aCard[i].getId().indexOf("ovpTable") > -1) {
                                        count++;
                                    }
                                    break;
                                case 'sap.viz.ui5.controls.VizFrame':
                                    if (aCard[i].getId().indexOf("analyticalChart") > -1) {
                                        count++;
                                    }
                                    break;
                            }
                        }
                        return sCardCount === count;
                    },
                    success: function () {
                        Opa5.assert.ok(true, "All " + sCardCount + " " + sCardType + " Cards are present");
                    },
                    errorMessage: "Mismatch in number of Cards. Expected = '" + sCardCount + "' but Found = '" + count + "'",
                });
            },

            iCheckForNumberOfLazilyLoadedCards: function (oRange, sControlType) {
                return this.waitFor({
                    controlType: sControlType,
                    timeout: 45,
                    visible: false,

                    check: function (aCard) {
                        var iNumberOfLoadedCards = aCard.length;
                        return iNumberOfLoadedCards >= oRange.minCount && iNumberOfLoadedCards <= oRange.maxCount;
                    },
                    success: function () {
                        Opa5.assert.ok(true, "Number of cards is in between" + oRange.minCount + "and" + oRange.maxCount);
                    },
                    errorMessage: "Mismatch in number of Cards",
                });
            },

            iCheckPopupMessage: function (sResultValue, sID, sMessageText) {
                var bSuccess = false;
                return this.waitFor({
                    controlType: "sap.m.Text",
                    timeout: 30,
                    check: function (aMessage) {
                        for (var i in aMessage) {
                            if (aMessage[i].getParent().getId().indexOf(sID) !== -1) {
                                if (aMessage[i].getText() === sResultValue) {
                                    bSuccess = true;
                                }
                            }
                        }
                        return bSuccess;
                    },
                    success: function () {
                        Opa5.assert.ok(true, sMessageText + " : " + sResultValue);
                    },
                    errorMessage: "Card Not Found",
                });
            },

            iCheckCardCriticality: function (sID, sIndex, sCriticalityValue, sState, sControlType) {
                return this.waitFor({
                    controlType: sControlType,
                    timeout: 45,
                    check: function (aRow) {
                        for (var i in aRow) {
                            var rowID = aRow[i].getId();
                            if (rowID.indexOf(sID) > -1) {
                                if (sControlType === "sap.m.ObjectStatus")
                                    return (aRow[i].getText() === sCriticalityValue && aRow[i].getState() === sState);
                                else if (sControlType === "sap.m.ObjectNumber")
                                    return (aRow[i].getNumber() === sCriticalityValue && aRow[i].getState() === sState);
                            }
                        }
                        return false;
                    },
                    success: function () {
                        Opa5.assert.ok(true, "Criticality of Record Item " + sIndex + " : '" + sCriticalityValue + "' & State is : " + sState);
                    },
                    errorMessage: "Record Criticality missing / incorrect"
                });
            },

            iCheckForCardHeaderCount: function (sID, sCardId, sCount) {
                return this.waitFor({
                    controlType: "sap.m.Text",
                    timeout: 45,
                    check: function (aCount) {
                        for (var i in aCount) {
                            var sHeaderCountID = aCount[i].getId();
                            if (sHeaderCountID.indexOf(sID) > -1) {
                                if (sCount)
                                    return (aCount[i].getText() === sCount);

                                else {
                                    sCount = "empty";
                                    return sCount;
                                }
                            }
                        }
                        return false;
                    },
                    success: function () {
                        Opa5.assert.ok(true, "Header Count of card " + sCardId + " is : " + sCount);
                    },
                    errorMessage: "Header Count Mismatch"
                });
            },

            iCheckForNumberOfRecordsInCard: function (sControlType, sCardId, sCount) {
                var sRecords = 0;
                return this.waitFor({
                    controlType: sControlType,
                    timeout: 45,
                    check: function (aCount) {
                        for (var i in aCount) {
                            var sRecordCountID = aCount[i].getId();
                            if (sRecordCountID.indexOf(sCardId) > -1) {
                                sRecords ++ ;
                            }
                        }
                        return sRecords === sCount ? true : false;
                    },
                    success: function () {
                        Opa5.assert.ok(true, "Records in Card " + sCardId + " matched : " + sCount);
                    },
                    errorMessage: "Records in Card " + sCardId + " mismatched : " + sRecords
                });
            },

            iCheckMicroChartData: function(sChartID, sExpectedValue, sExpectedCriticality) {
                return this.waitFor({
                    id : sChartID,
                    controlType: "sap.suite.ui.microchart.ComparisonMicroChart",
                    timeout: 45,
                    success: function (oChart) {
                        var oChartData = oChart.getAggregation("data")[0];
                        var sChartvalue = oChartData.getValue();
                        var sCriticalityValue = oChartData.getColor();
                        Opa5.assert.ok(sChartvalue === sExpectedValue, "Percentage value matched for card " + sChartID);
                        Opa5.assert.ok(sCriticalityValue === sExpectedCriticality, "Criticality value matched for card " + sChartID );
                    },
                    errorMessage: "The percentage value or criticality value of card " + sChartID + " mismatched"
                });
            },

            iCheckTheSelectionVariantPassedForFilter: function (sId, sNavigationParamValue) {
                return this.waitFor({
                    controlType: "sap.m.DisplayListItem",
                    timeout: 45,
                    check: function (aControls) {
                        return aControls.some(function (oControl) {
                            return oControl.getProperty('label') === sId &&
                                oControl.getProperty('value') === sNavigationParamValue;
                        })
                    },
                    success: function () {
                        Opa5.assert.ok(true, "The Selection Variant Filters generated correctly for filter ", sId);
                    },
                    errorMessage: "Error in generated Selection Variant Filters"
                });
            },

            iCheckIfFilterFieldIsPopulated: function (sId, sValue) {
                return this.waitFor({
                    controlType: "sap.ui.comp.smartfilterbar.SFBMultiInput",
                    timeout: 45,
                    check: function (aControls) {
                        return aControls.filter(function (oControl) {
                            return oControl.sId == "application-procurement-overview-component---mainView--ovpGlobalFilter-filterItemControlA_-ID";
                        })[0].mProperties._semanticFormValue === sValue;
                    },
                    success: function () {
                        Opa5.assert.ok(true, "Filter parameter sent from the source application is populated for field", sId);
                    },
                    errorMessage: "Filter parameter sent from the source application is populated"
                });
            },

            // Functions for Table Cards

            checkForNumberOFColumnsInTableCard: function (tableID) {
                return this.waitFor({
                    controlType: "sap.m.Table",
                    timeout: 30,
                    success: function (aTables) {
                        var count = 0;
                        var tbl;
                        for (var i in aTables) {
                            var tID = aTables[i].getId();
                            if (tID.indexOf(tableID) > -1) {
                                tbl = aTables[i];
                                break;
                            }
                        }

                        var cols = tbl && tbl.getColumns();
                        for (var i in cols) {
                            count += cols[i].getVisible() ? 1 : 0;
                        }
                        if (count == 3) {
                            Opa5.assert.ok(true, "max " + count + " columns");
                        }
                    },
                    errorMessage: "Columns not ok",
                });
            },

            iCheckRowAfterNav: function (sID) {
                return this.waitFor({
                    controlType: "sap.m.Table",
                    timeout: 45,
                    success: function (aRow) {
                        var count = 0;
                        for (var i in aRow) {
                            var rowID = aRow[i].getId();
                            if (rowID.indexOf(sID) > -1) {
                                var aItems = aRow[i].mAggregations.items;
                                if (aItems.length == 1) {
                                    Opa5.assert.ok(true, "Row Navigation Successful");
                                    break;
                                }
                            }
                        }
                    },
                    errorMessage: "The Row navigation not successful",
                });
            },

            // Functions for Stack Cards

            iCheckTheStackCardVisibility: function () {
                return this.waitFor({
                    controlType: "sap.m.VBox",
                    success: function (aControl) {
                        var bStackCardExists = aControl.some(function (oControl) {
                            return oControl.getId().indexOf("stackContent") > -1;
                        });
                        Opa5.assert.ok(bStackCardExists, "Found stack card", aControl);
                    },
                    errorMessage: " The Stack card is not visible on UI",
                });
            },
            iCheckTheObjectStreamVisibility: function () {
                return this.waitFor({
                    controlType: "sap.ui.core.Icon",
                    success: function (aControl) {
                        var bStackCardLoaded = aControl.some(function (oControl) {
                            return oControl.getProperty("src") === "sap-icon://slim-arrow-right";
                        });
                        Opa5.assert.ok(bStackCardLoaded, "Loaded stack card");
                    },
                    errorMessage: " The Stack card is not loaded ",
                });
            },
            iCheckCloseButtonVisibility: function (bClose) {
                return OpaBuilder.create(this)
                    .hasType("sap.ui.core.Icon")
                    .check(function (aControl) {
                        var bFound = aControl.some(function (oControl) {
                            if (bClose) {
                                oControl.getDomRef().click();
                                Opa5.assert.ok(true, "The object stream has been closed successfully");
                                return true;
                            }
                            return (
                                oControl.getTooltip() === "Close" && oControl.getProperty("src") === "sap-icon://decline"
                            );
                        });
                        return bFound;
                    }, true)
                    .description("The close icon is visible on stack card")
                    .execute();
            },

            //Functions for List Cards


            // Functions for Options under 3 Dots Button

            iCheckForAdditionalActionsButtonForAllCards: function () {
                return this.waitFor({
                    controlType: "sap.m.Button",
                    check: function (aControl) {
                        var aCards = aControl.filter(function (oControl) {
                            return oControl.getId().indexOf("card") > -1;
                        });
                        var aMoreCardActions = aControl.filter(function (oControl) {
                            return oControl.getId().indexOf("sapOvpCardAdditionalActions") > -1;
                        });
                        return aCards.length === aMoreCardActions.length;
                    },
                    success: function () {
                        Opa5.assert.ok(true, "Additional Actions visible for all cards only in UI");
                    },
                    errorMessage: "Additional Actions is not visible on UI for all cards"
                });
            },
            iVerifyAdditionalActionsCountOnCard: function (iCount) {
                return this.waitFor({
                    controlType: "sap.ui.unified.MenuItem",
                    check: function (aControl) {
                        return aControl.length === iCount;
                    },
                    success: function () {
                        Opa5.assert.ok(true, "Additional Menu consists of All options");
                    },
                    errorMessage: "All the options not loaded"
                });
            },
            iVerifyAdditionalActionsName: function (sName) {
                return this.waitFor({
                    controlType: "sap.ui.unified.MenuItem",
                    check: function (aControl) {
                        for (var i in aControl) {
                            if (aControl[i].getText() === sName) {
                                return true;
                            }
                        }
                        return false;
                    },
                    success: function () {
                        Opa5.assert.ok(true, sName + " Additonal option is present");
                    },
                    errorMessage: sName + " Additional option is not present"
                });
            },
            iVerifyTheDialogTitleText: function (sDialogText) {
                return this.waitFor({
                    controlType: "sap.m.Dialog",
                    timeout: 30,
                    check: function (aControl) {
                        return aControl[0] && aControl[0].getTitle() === sDialogText;
                    },
                    success: function () {
                        Opa5.assert.ok(true, sDialogText + " dialog is opened and title text is matched");
                    },
                    errorMessage: "Title text is not matched"
                });
            },

            iVerifyNavigationError: function (sErrorText) {
                return this.waitFor({
                    controlType: "sap.m.Dialog",
                    timeout: 30,
                    check: function (aControl) {
                        var oDialog = aControl[0];
                        if (oDialog) {
                            var oDialogContent = oDialog.getContent() && oDialog.getContent()[0];
                            return oDialog.getTitle() === 'Error' &&
                                oDialogContent &&
                                oDialogContent.getText() === sErrorText;
                        }
                    },
                    success: function () {
                        Opa5.assert.ok(true + "Dialog is opened and navigation Error text matched.");
                    },
                    errorMessage: "The navigation error dialog did not open.",
                });
            },
            iValidateTheIntegrationCardManifest: function (sCardId, sMode) {
                if (sCardId && sMode) {
                    var oExpectedConfigParams = InsightCardManifests.getManifestConfigParams(sCardId, sMode);

                    if (sMode === "DT") {
                        return this.waitFor({
                            controlType: "sap.ui.integration.widgets.Card",
                            timeout: 30,
                            success: function (aControls) {
                                var oCardManifest = aControls && aControls[0].getManifest();
                                var oConfigParams = oCardManifest && oCardManifest["sap.card"] && oCardManifest["sap.card"].configuration && oCardManifest["sap.card"].configuration.parameters;
                                Opa5.assert.ok(InsightCardManifests.compareConfigParams(oExpectedConfigParams, oConfigParams, sMode), "The generated Integration card manifest is valid.");
                            },
                            errorMessage: "The generated Integration card manifest is Invalid.",
                        });
                    }


                }
            },

            iValidateMessagesInErrorDialog: function (sExpectedErrorMessage, sExpectedErrorMessageDetails) {
                return this.waitFor({
                    controlType: "sap.m.Dialog",
                    timeout: 30,
                    check: function (aControl) {
                        var oDialog = aControl.find(function (oControl) {
                            return oControl.getTitle() === "Error" && oControl.getVisible();
                        });
                        if (oDialog) {
                            var oContent = oDialog.getContent()[0];
                            var aTextItems = oContent.getAggregation("items").filter(function (oItem) {
                                return oItem.sId.includes('text');
                            });
                            var sErrorMessage = aTextItems[0].getText();
                            var sErrorMessageDetails = aTextItems[1].getHtmlText();
                            var bErrorMessageDetailsVisible = aTextItems[1].getVisible();
                            return (sErrorMessage === sExpectedErrorMessage) && (sErrorMessageDetails === sExpectedErrorMessageDetails) && bErrorMessageDetailsVisible;
                        }
                    },
                    success: function () {
                        Opa5.assert.ok("Error dialog is displayed with the correct error messages.");
                    },
                    errorMessage: "Error dialog is not displayed with the correct error messages."
                }); 
            },
            
            //Functions for manage cards popup

            iCheckForOkAndCancelButtonOnReset: function (sOkBtn, sCancelBtn) {
                return this.waitFor({
                    controlType: "sap.m.Button",
                    check: function (aControl) {
                        var oOkButton = aControl.filter(function (oControl) {
                            return oControl.sId === sOkBtn;
                        })[0];
                        var oCancelButton = aControl.filter(function (oControl) {
                            return oControl.sId === sCancelBtn;
                        })[0];
                        return (oOkButton && oCancelButton);
                    },
                    success: function () {
                        Opa5.assert.ok(true, "Ok and Cancel buttons are visible on click of reset button");
                    },
                    errorMessage: "Ok, Cancel buttons are not visible on click of reset button, or atleast one is not visible"
                });
            },

            iCheckDialogState: function (sControlType, sDialogText, sDialogState) {
                return this.waitFor({
                    controlType: sControlType,
                    timeout: 45,
                    visible: false,
                    check: function (oControl) {
                        var bDialogOpen = oControl[0].isOpen();
                        return sDialogState === "Open" ? bDialogOpen : !bDialogOpen;
                    },
                    success: function () {
                        Opa5.assert.ok(true, sDialogText + " Dialog is " + sDialogState);
                    },
                    errorMessage: sDialogText + " Dialog is not " + sDialogState
                });
            },

            iCheckIfAllCheckBoxesAreChecked: function () {
                return this.waitFor({
                    controlType: "sap.m.p13n.Popup",
                    visible: false,
                    check: function (oControl) {
                        return oControl[0].getModel().getData().cards.every(function (oCard) {
                            return oCard.visible === true;
                        });
                    },
                    success: function () {
                        Opa5.assert.ok(true, "All checkboxes are checked");
                    },
                    errorMessage: "All checkboxes are not checked"
                });
            },

            iCheckIfOneCheckBoxIsUnchecked: function () {
                return this.waitFor({
                    controlType: "sap.m.p13n.Popup",
                    visible: false,
                    check: function (oControl) {
                        var aUnchecked = oControl[0].getModel().getData().cards.filter(function (oCard) {
                            return oCard.visible === false;
                        });
                        return aUnchecked.length === 1;
                    },
                    success: function () {
                        Opa5.assert.ok(true, "One checkbox is unchecked");
                    },
                    errorMessage: "Checkbox is not unchecked"
                });
            },

            iCheckForCardRemoved: function (sCardTitle, sID) {
                return this.waitFor({
                    controlType: "sap.m.Text",
                    check: function (aControl) {
                        var sTitle = aControl.filter(function (oControl) {
                            return oControl.sId === sID;
                        })[0];
                        return !sTitle;
                    },
                    success: function () {
                        Opa5.assert.ok(true, "Card with title " + sCardTitle + " is removed");
                    },
                    errorMessage: "Card with title " + sCardTitle + " is not removed"
                });
            },

            iCheckForCardAdded: function (sCardTitle, sID) {
                return this.waitFor({
                    controlType: "sap.m.Text",
                    check: function (aControl) {
                        var sTitle = aControl.filter(function (oControl) {
                            return oControl.sId === sID;
                        })[0];
                        return sTitle;
                    },
                    success: function () {
                        Opa5.assert.ok(true, "Card with title " + sCardTitle + " is added");
                    },
                    errorMessage: "Card with title " + sCardTitle + " is not added"
                });
            },

            //Functions to test managecards popup when maximum card limit is provided from extension hook, used in sales app

            iCheckNumberOfCardsSelected: function (sId, iNoOfCardsSelected) {
                return this.waitFor({
                    id: sId,
                    check: function (aControls) {
                        return aControls.getSelectedFields().length === iNoOfCardsSelected;
                    },
                    success: function () {
                        Opa5.assert.ok(true, "Number of cards selected is " + iNoOfCardsSelected);
                    },
                    errorMessage: "Number of cards selected is not equal to " + iNoOfCardsSelected
                });
            },

            iCheckIfMessageStripTextIsSetAndVisible: function (sId, sWarningMessage) {
                return this.waitFor({
                    id: sId,
                    check: function (aControls) {
                        return aControls.getMessageStrip().getText() === sWarningMessage && aControls.getMessageStrip().getVisible() === true;
                    },
                    success: function () {
                        Opa5.assert.ok(true, "MessageStrip text is set and visible");
                    },
                    errorMessage: "MessageStrip text is either not set or not visble or both"
                });
            },

            iCheckIfMessageStripIsHidden: function (sId) {
                return this.waitFor({
                    id: sId,
                    check: function (aControls) {
                        return aControls.getMessageStrip().getVisible() === false;
                    },
                    success: function () {
                        Opa5.assert.ok(true, "MessageStrip is hidden");
                    },
                    errorMessage: "MessageStrip is not hidden"
                });
            },

            iCheckIfOkButtonIsDisabledOrEnabled: function (sOkBtn, bEnabled) {
                return this.waitFor({
                    controlType: "sap.m.Button",
                    visible: false,
                    timeout: 45,
                    check: function (aControl) {
                        var oOkButton = aControl.filter(function (oControl) {
                            return oControl.sId === sOkBtn;
                        })[0];
                        return oOkButton.getEnabled() === bEnabled;
                    },
                    success: function () {
                        Opa5.assert.ok(true, "Ok button is being disabled and enabled correctly");
                    },
                    errorMessage: "ok button is not being disabled or enabled correctly"
                });
            },
            
            //For cards not present.
            iCheckForNoCards: function (sId) {
                return this.waitFor({
                    controlType: "sap.m.VBox",
                    check: function (aControl) {
                        return aControl.some(function (oControl) {
                            return oControl.getId() === sId;
                        });
                    },
                    success: function () {
                        Opa5.assert.ok(true, "No cards are loaded");
                    },
                    errorMessage: "Error in data load behaviour",
                });
            },

        });

        return CommonAssertions;
    });