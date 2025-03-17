/*** List Report Assertions ***/
sap.ui.define(["sap/ui/test/Opa5"],

    function (Opa5) {
        'use strict';
        return function (prefix, viewName, viewNamespace) {
            return {

                iShouldSeeTheSmartListWithListItemType: function (sListItemName) {
                    return this.waitFor({
                        id: prefix + "template:::ListReportTable:::SmartList",
                        success: function (oSmartList) {
                            var oSmartListItem = oSmartList.getList().getItems()[0];
                            var bFlag = false;
                            if (oSmartListItem.isA(sListItemName)) {
                                bFlag = true;
                            }
                            Opa5.assert.ok(bFlag, "The SmartList contains the List Items of type '" + sListItemName + "'");
                        },
                        errorMessage: "Cannot find the SmartList on the UI"
                    });
                },

                iCheckTheStandardListItemPropertiesOnSmartList: function (iItemIndex, oProperties) {
                    return this.waitFor({
                        id: prefix + "template:::ListReportTable:::SmartList",
                        success: function (oSmartList) {
                            var oSmartListItem = oSmartList.getList().getItems()[iItemIndex];
                            if (!oSmartListItem.isA("sap.m.StandardListItem")) {
                                Opa5.assert.notOk(true, "The list item is not a Standard List");
                                return null;
                            }
                            var bFlag = false;
                            if (oSmartListItem.getTitle() === oProperties.title &&
                                oSmartListItem.getDescription() === oProperties.description &&
                                oSmartListItem.getInfo() === oProperties.info &&
                                oSmartListItem.getInfoState() === oProperties.infoState &&
                                oSmartListItem.getIcon() === oProperties.icon) {
                                bFlag = true;
                            }
                            Opa5.assert.ok(bFlag, "The StandardListItem is found with given properties");
                        },
                        errorMessage: "Cannot find the SmartList on the UI"
                    });
                },

                iCheckTheObjectListItemPropertiesOnSmartList: function (iItemIndex, oProperties) {
                    return this.waitFor({
                        id: prefix + "template:::ListReportTable:::SmartList",
                        success: function (oSmartList) {
                            var oSmartListItem = oSmartList.getList().getItems()[iItemIndex];
                            if (!oSmartListItem.isA("sap.m.ObjectListItem")) {
                                Opa5.assert.notOk(true, "The list item is not an Object List");
                                return null;
                            }
                            var bFlag = false;
                            if (oSmartListItem.getTitle() === oProperties.title &&
                                oSmartListItem.getNumber() === oProperties.number &&
                                oSmartListItem.getNumberState() === oProperties.numberState &&
                                oSmartListItem.getFirstStatus().getText() === oProperties.firstStatusText &&
                                oSmartListItem.getFirstStatus().getState() === oProperties.firstStatusState &&
                                oSmartListItem.getSecondStatus().getText() === oProperties.secondStatusText &&
                                oSmartListItem.getSecondStatus().getState() === oProperties.secondStatusState &&
                                oSmartListItem.getAttributes()[0].getText() === oProperties.firstObjAttributeText &&
                                oSmartListItem.getAttributes()[1].getText() === oProperties.secondObjAttributeText) {
                                bFlag = true;
                            }
                            Opa5.assert.ok(bFlag, "The ObjectListItem is found with given properties");
                        },
                        errorMessage: "Cannot find the SmartList on the UI"
                    });
                },

                iShouldSeeTheChevronIconOnTheSmartListItem: function () {
                    return this.waitFor({
                        id: prefix + "template:::ListReportTable:::SmartList-ui5list",
                        success: function (oList) {
                            if (oList.getItems()[0].getType() === "Navigation") {
                                Opa5.assert.ok(true, "SmartList Item contains the chevron Icon");
                                return null;
                            }
                            Opa5.assert.notOk(true, "SmartList Item does not contain the chevron Icon");
                            return null;
                        },
                        errorMessage: "Cannot find the SmartList on the UI"
                    });
                }
            };
        };
    });
