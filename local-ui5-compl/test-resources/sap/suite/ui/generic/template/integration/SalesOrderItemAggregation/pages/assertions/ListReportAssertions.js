/*** List Report Assertions ***/
sap.ui.define(["sap/ui/test/Opa5"],

    function (Opa5) {
        'use strict';
        return function () {
            return {
                iCheckTheEditIconVisibilityOnNthRowOfTable: function (iNthRow, bVisible, sId) {
                    var sTableId = new RegExp(sId + "$");
                    return this.waitFor({
                        controlType: "sap.ui.table.RowAction",
                        success: function (aRowActions) {
                            for (var i = 0; i < aRowActions.length; i++) {
                                var oParentRow = aRowActions[i].getParent();
                                var oParentTable = oParentRow.getParent();
                                if (oParentTable && sTableId.test(oParentTable.getId()) && oParentRow === oParentTable.getRows()[iNthRow - 1]) {
                                    if (aRowActions[i].getItems()[0].getIcon() === "sap-icon://edit" && aRowActions[i].getItems()[0].getVisible() === bVisible) {
                                        Opa5.assert.ok(true, "Edit icon visibility '" + bVisible + "' is correct for the table row '" + iNthRow + "'");
                                        return null;
                                    }
                                }
                            }
                            Opa5.assert.notOk(true, "Edit icon visibility '" + bVisible + "' is incorrect for the table row '" + iNthRow + "'");
                        },
                        errorMessage: "Cannot find the RowAction control on the UI"
                    });
                }
            };
        };
    });
