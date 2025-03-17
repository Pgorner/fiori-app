/*** List Report Actions ***/
sap.ui.define(["sap/ui/test/Opa5"],

    function (Opa5) {
        'use strict';
        return function (prefix, viewName, viewNamespace) {
            return {
                iNavigateFromSmartListItemByLineNo: function (iItemIndex) {
                    return this.waitFor({
                        id: prefix + "template:::ListReportTable:::SmartList",
                        success: function (oSmartList) {
                            var oSmartListItem = oSmartList.getList().getItems()[iItemIndex];
                            oSmartListItem.firePress();
                            Opa5.assert.ok(true, "The list item with index '" + iItemIndex + "' is pressed successfully");
                        },
                        errorMessage: "Cannot find the SmartList on the UI"
                    });
                },
            };
        };
    });
