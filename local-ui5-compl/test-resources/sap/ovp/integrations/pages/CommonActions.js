sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ui/test/OpaBuilder",
    "sap/ui/test/actions/EnterText",
    "sap/ui/test/actions/Scroll",
    "sap/ui/test/actions/Press",
    "sap/ui/test/matchers/PropertyStrictEquals"
], function (
    Opa5,
    OpaBuilder,
    EnterText,
    Scroll,
    Press,
    PropertyStrictEquals
) {
    "use strict";
    // All the actions for Opa tests are defined here
    var CommonActions = Opa5.extend("sap.ovp.test.integrations.pages.CommonActions", {
        iClickTheAdaptFiltersButton: function (btnName) {
            return this.waitFor({
                controlType: "sap.m.Button",
                success: function (aButtons) {
                    for (var i in aButtons) {
                        if (aButtons[i].getId().indexOf("ovpGlobalFilter") > -1) {
                            aButtons[i].$().trigger("tap");
                            break;
                        }
                    }
                },
                errorMessage: " Adapt Filters button cant be clicked"
            });
        },

        iClickDefaultRadioButton: function (sId, sText) {
            return this.waitFor({
                id: sId,
                timeout: 30,
                success: function (oDefaultVar) {
                    oDefaultVar.$().trigger("tap");
                    Opa5.assert.ok(true, "Variant " + sText + " selected as default from Variant Management");
                },
                errorMessage: "Variant " + sText + " not found",
            });
        },

        iDeleteVariantFromManageVariant: function (sId, sText) {
            return this.waitFor({
                id: sId,
                timeout: 30,
                success: function (oDelVar) {
                    oDelVar.$().trigger("tap");
                    Opa5.assert.ok(true, "Variant " + sText + " deleted from Variant Management");
                },
                errorMessage: "Variant " + sText + " not found",
            });
        },

        iClickOnVariantWithText: function (sId, sText) {
            return this.waitFor({
                controlType: "sap.ui.core.Item",
                check: function (aVar) {
                    for (var i in aVar) {
                        if (aVar[i].getId().indexOf(sId) > -1) {
                            aVar[i].$().trigger("tap");
                            return true;
                        }
                    }
                    return false;
                },
                success: function () {
                    Opa5.assert.ok(true, "Switched to Variant" + sText);
                },
                errorMessage: sText + " Variant is not present."
            });
        },

        iClickOnCheckBoxWithId: function(sId, sText) {
            return this.waitFor({
                id: sId,
                timeout: 45,
                visible: false,
                success: function (oCheckBox) {     
                    var menuPress = new Press();
                    menuPress.executeOn(oCheckBox);   
                    Opa5.assert.ok(true, "CheckBox found for " + sText);
                },
                errorMessage: "Checkbox for " + sText + " cannot be found"
            });
        },

        iClickControlOnValueHelp: function(sID, sControlType) {
            return this.waitFor({
                controlType: sControlType,
                timeout: 45,
                check: function (aVH) {
                    for (var i in aVH) {
                        var vhID = aVH[i].getId();
                        if (vhID.indexOf(sID) > -1) {
                            var menuPress = new Press();
                            menuPress.executeOn(aVH[i]);
                            return true;
                        }
                    }
                    return false;
                },
                success: function () {
                    Opa5.assert.ok(true, "Value Help Clicked");
                },
                errorMessage: "Value Help cannot be clicked"
            });
        },

        iClickTheStackCardButton: function () {
            return this.waitFor({
                controlType: "sap.m.VBox",
                check: function (aVBox) {
                    for (var i in aVBox) {
                        if (aVBox[i].getId().indexOf("stackContent") > -1) {
                            aVBox[i].$().trigger("click");
                            return true;
                        }
                    }
                    return false;
                },
                success: function () {
                    Opa5.assert.ok(true, "The Stack Card is clicked successfully");
                },
                errorMessage: "The Stack Card button can not be clicked"
            });
        },

        iScrollInObjectStreamAndCloseTheObjectStream: function () {
            return OpaBuilder.create(this)
                .hasType("sap.m.Link")
                .hasProperties({ text: "Awaiting Purchase Order Approval" })
                .do(function (oControl) {
                    var objectStream = oControl.getParent();
                    if (objectStream.getId().indexOf("ObjectStream") > -1) {
                        Opa5.assert.ok(true, "The Object Stream is found");
                        if (oControl.getDomRef().fireEvent) {
                            oControl.getDomRef().fireEvent("onmouseover");
                            Opa5.assert.ok(true, "The Object Stream Scroll has started");
                        } else {
                            var eventObject = document.createEvent("Events");
                            eventObject.initEvent("mouseover", true, false);
                            oControl.getDomRef().dispatchEvent(eventObject);
                            Opa5.assert.ok(true, "The Object Stream Scroll has started");
                        }
                    }
                })
                .description("The Object stream operations are performed")
                .execute();
        },
        iClickTheCardHeader: function (sID, bObjectStreamCard) {
            return this.waitFor({
                controlType: "sap.m.VBox",
                timeout: 45,
                success: function (aHBox) {
                    for (var i in aHBox) {
                        if (bObjectStreamCard && aHBox[i].getId().indexOf(sID) > -1) {
                            aHBox[i].$().trigger("click");
                            Opa5.assert.ok(true, "Card Header Clicked");
                            break;
                        }
                        else {
                            if (aHBox[i].getId() == sID) {
                                aHBox[i].$().trigger("click");
                                Opa5.assert.ok(true, "Card Header Clicked");
                            }
                        }
                    }
                },
                errorMessage: "The header cannot be clicked"
            });
        },

        iClickOnButtonWithText: function (sId, sButtonText) {
            return this.waitFor({
                controlType: "sap.m.Button",
                timeout: 45,
                check: function (btns) {
                    for (var i = 0; i < btns.length; i++) {
                        if (btns[i].getText() === sButtonText && btns[i].getParent().getId().indexOf(sId) > -1) {
                            btns[i].firePress();
                            return true;
                        }
                    }
                    return false;
                },
                success: function () {
                    Opa5.assert.ok(true, sButtonText + " Button Clicked");
                },
                errorMessage: sButtonText + " Button not found"
            });
        },

        iSetViewinViewSwitch: function (sId, sKey) {
            return this.waitFor({
                id: sId,
                timeout: 30,
                success: function (oView) {
                    oView.$().trigger("tap");
                    Opa5.assert.ok(true, "Tab " + sKey + " set from View Switch Dropdown");
                },
                errorMessage: "Tab " + sKey + " not found in View Switch Dropdown",
            });
        },

        iClickOnViewSwitchinCard: function (sId, sCard) {
            return this.waitFor({
                id: sId,
                timeout: 30,
                success: function (oView) {
                    oView.$().trigger("tap");
                    Opa5.assert.ok(true, "View Switch Dropdown clicked for card : " + sCard);
                },
                errorMessage: "View Switch Dropdown not found for Card : " + sCard,
            });
        },

        iClickButtonOnObjectStreamCardWithIndex: function (sId, sIndex, sButtonText) {
            return this.waitFor({
                controlType: "sap.m.Button",
                timeout: 45,
                check: function (btns) {
                    var count = 0;
                    for (var i = 0; i < btns.length; i++) {
                        if (btns[i].getText() === sButtonText && btns[i].getParent().getId().indexOf(sId) > -1) {
                            count++;
                            if (count === sIndex) {
                                btns[i].firePress();
                                return true;
                            }
                        }
                    }
                    return false;
                },
                success: function () {
                    Opa5.assert.ok(true, sButtonText + " Button Clicked in Object Stream Card");
                },
                errorMessage: sButtonText + " Button not found in Object Stream Card"
            });
        },

        iClickTheCardItem: function (sID, sNum, sCard, sControlType) {
            return this.waitFor({
                controlType: sControlType,
                timeout: 45,
                visible: false,
                check: function (aRow) {
                    for (var i in aRow) {
                        var rowID = aRow[i].getId();
                        if (rowID.indexOf(sID) > -1 && rowID.indexOf(sNum) > -1) {
                            var menuPress = new Press();
                            menuPress.executeOn(aRow[i]);
                            return true;
                        }
                    }
                    return false;
                },
                success: function () {
                    Opa5.assert.ok(true, "Row " + (sNum + 1) + " in Card " + sCard + " clicked");
                },
                errorMessage: "The Row cannot be clicked"
            });
        },

        iClickBackButton: function () {
            return this.waitFor({
                controlType: "sap.m.Button",
                check: function (btns) {
                    for (var i = 0; i < btns.length; i++) {
                        if (btns[i].getId().indexOf("shellAppTitle") !== -1) {
                            var backButton = btns[i].getParent().getHeadItems();
                            for (var j = 0; j < backButton.length; j++) {
                                if (backButton[j].sId.indexOf("backBtn") !== -1) {
                                    backButton[j].firePress();
                                    return true;
                                }
                            }
                        }
                    }
                    return false;
                },
                success: function () {
                    // btns[0].firePress();
                    Opa5.assert.ok(true, "Back Button Pressed");
                },
                errorMessage: "Back Button not working"
            });
        },

        iClickTheButtonWithId: function (sId, sControlType) {
            var sType = sControlType ? sControlType : "sap.m.Button";

            return this.waitFor({
                id: sId,
                controlType: sType,
                timeout: 45,
                visible: false,
                check: function (oButton) {
                    if (oButton) {
                        var menuPress = new Press();
                        menuPress.executeOn(oButton);
                        return true;
                    }
                },
                success: function () {
                    Opa5.assert.ok(true, "Button with id " + sId + " can be clicked");
                },
                errorMessage: "Button cannot be clicked"
            });
        },

        iClickDeselectAllButtonOfP13NDialog: function (sTableId, sIconId) {
            this.waitFor({
                id: sTableId,
                controlType: "sap.m.Table",
                actions: function () {
                    return this.waitFor({
                        controlType: "sap.ui.core.Icon",
                        matchers: { properties: { id: sIconId } },
                        actions: new Press(),
                        errorMessage: "Did not find the control with id : " + sIconId
                    });
                }.bind(this),
                errorMessage: "Did not find the table with id : " + sTableId
            });
        },

        iClickControlOnMacroFilterBar: function (sFilterId, sId) {
            this.waitFor({
                id: sFilterId,
                controlType: "sap.ui.mdc.FilterField",
                actions: function () {
                    return this.waitFor({
                        controlType: "sap.ui.core.Icon",
                        matchers: { properties: { id: sId } },
                        actions: new Press(),
                        errorMessage: "Did not find the control with id : " + sId
                    });
                }.bind(this),
                errorMessage: "Did not find the filter field with id : " + sFilterId
            });
        },

        iClickOnMenuItemWithId: function (sId) {
            return this.waitFor({
                id: sId,
                success: function (oMenu) {
                    var menuPress = new Press();
                    menuPress.executeOn(oMenu);
                    Opa5.assert.ok(true, "Menu Item with id " + sId + " can be clicked");
                },
                errorMessage: "Menu Item cannot be clicked"
            });
        },

        iCloseTheDialogPopover: function () {
            return this.waitFor({
                controlType: "sap.m.Dialog",
                success: function (aControl) {
                    aControl[0].close();
                },
                errorMessage: "Dialog couldn't be closed."
            });
        },

        iClickDropdownPopoverSearchFieldWithFilter: function (sFilter) {
            var oSearchButton;
            return this.waitFor({
                //searchOpenDialogs: true,
                controlType: "sap.m.SearchField",
                check: function (aSearchField) {
                    var bFlag = false;
                    if (aSearchField) {
                        aSearchField[0].setValue(sFilter);
                        oSearchButton = aSearchField[0];
                        bFlag = true;
                    }
                    return bFlag;
                },
                success: function () {
                    oSearchButton.fireSearch();
                    Opa5.assert.ok(true, "Dropdown popover search triggered");
                },
                errorMessage: "Dropdown popover search trigger failed"
            });
        },

        iEnterValueInField: function (sValue, sId, bEnter) {
            bEnter = bEnter ? bEnter : false;
            return this.waitFor({
                id: sId,
                visible: false,
                timeout: 45,
                actions: [new EnterText({ text: sValue, pressEnterKey: bEnter })],
                success: function () {
                    Opa5.assert.ok(true, "Value '" + sValue + "' is set for the field with id '" + sId + "'");
                },
                errorMessage: "Field with id: '" + sId + "' is either not visible/enabled or not found"
            });
        },

        iClickTheGoButton: function (sId) {
            return this.waitFor({
                id: sId,
                controlType: "sap.m.Button",
                visible: false,
                timeout: 45,
                success: function (oButton1) {
                    oButton1.$().trigger("tap");
                    Opa5.assert.ok(true, "Go button clicked");
                },
                errorMessage: " Go button cannot be clicked"
            });
        },

        iClickTheEnterKey: function(sId, sValue) {
            this.waitFor({
                id: sId,
                timeout: 45,
                actions: new EnterText({
                    text: sValue || "",
                    pressEnterKey: true
                })
            }); 
        },

        iClickCheckboxInVH: function (sTableID) {
            return this.waitFor({
                id: sTableID,
                timeout: 30,
                check: function (oControl) {
                    var menuPress = new Press();
                    var oIconControl = oControl.getDependents()[0].getAggregation("icon");

                    if (oIconControl) {
                        menuPress.executeOn(oIconControl);
                        return true; 
                    }
                    return false;
                },
                success: function () {
                    Opa5.assert.ok(true, "ValueHelp checkbox checked");
                },
                errorMessage: "ValueHelp checkbox not found",
            });
        },

        iClickCheckboxInManageCard: function (sCardTitle) {
            var checkboxStatus;
            return this.waitFor({
                controlType: "sap.m.CheckBox",
                timeout: 30,
                check: function (oControl) {
                    for (var i in oControl) {
                        var checkboxId = oControl[i].getId();
                        if (oControl[i].getParent().findElements(checkboxId)[1].getText() === sCardTitle) {
                            var menuPress = new Press();
                            menuPress.executeOn(oControl[i]);
                            checkboxStatus = oControl[i].getSelected() ? "checked" : "unchecked";
                            return true;          
                        }
                    }
                    return false;
                },
                success: function () {
                    Opa5.assert.ok(true, "Manage Cards checkbox for card : '" + sCardTitle + "' is " + checkboxStatus);
                },
                errorMessage: "Manage Cards checkbox not found for card : " + sCardTitle,
            });
        },
        
        iSimulateUserScroll: function (scrollHeight, maxScrollHeight) {
            var testExecutionEl = window.parent.document.getElementsByClassName("test-execution")[0];
            if (testExecutionEl && testExecutionEl.children && testExecutionEl.children[0].style.height !== '100%') {
                testExecutionEl.children[0].style.height = '100%';
            }
            var height = scrollHeight || 200;
            var self = this;

            return this.waitFor({
                controlType: "sap.f.DynamicPage",
                actions: new Scroll({
                    y: height
                }),
                success: function (aControl) {
                    Opa5.assert.ok(true, "Page scrolled");
                    if (!maxScrollHeight) {
                        maxScrollHeight = aControl[0].getScrollDelegate().getMaxScrollTop()
                    }
                    if (aControl[0].getScrollDelegate().getScrollTop() < maxScrollHeight) {
                        self.iSimulateUserScroll(height + 100, maxScrollHeight);
                    } else {
                        window.scrollBy({
                            top: 300,
                            left: 0,
                            behavior: "smooth",
                        });
                    }
                },
                errorMessage: "Page cannot be scrolled"
            });
        },

        iClickOnDefaultUserListItems: function (sTitle) {
            return this.waitFor({
                controlType: "sap.m.StandardListItem",
                timeout: 30,
                check: function (oControl) {
                    return oControl.filter(function (oElement) { return oElement.getTitle() === sTitle })[0];
                },
                success: function (oControl) {
                    var oControl = oControl.filter(function (oElement) { return oElement.getTitle() === sTitle })[0];
                    var menuPress = new Press();
                    menuPress.executeOn(oControl);
                    Opa5.assert.ok(true, sTitle + " can be clicked");
                },
                errorMessage: sTitle + " cannot be clicked"
            });
        },

        iClickOnCheckBox: function (iIndex) {
            return this.waitFor({
                controlType: "sap.m.CheckBox",
                timeout: 30,
                check: function (oControl) {
                    return oControl[iIndex];
                },
                success: function (oControl) {
                    var oControl = oControl[iIndex];
                    var menuPress = new Press();
                    menuPress.executeOn(oControl);
                    Opa5.assert.ok(true, "Checkbox with index " + iIndex + " can be clicked");
                },
                errorMessage: "Checkbox with index " + iIndex + " cannot be clicked"
            });
        }

    });

    return CommonActions;
});
