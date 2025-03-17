/*** List Report Assertions ***/
sap.ui.define(["sap/ui/test/Opa5"],

    function (Opa5) {
        'use strict';
        return function (PREFIX_ID) {
            return {

                iShouldSeeHistoryPopupWithTitle: function (sId, sTitleText, bVisible) {
                    return this.waitFor({
                        id: PREFIX_ID + sId,
                        success: function (oTableObject) {
                            var bFlag = false;
                            if (oTableObject.getItems()[0].getTitle && oTableObject.getItems()[0].getTitle() === sTitleText){
                                bFlag = true
                            }
                            Opa5.assert.equal(bVisible, bFlag, "History popup with title '" + sTitleText + "'" + (bVisible ? " is not visible" : " is visible"));
                            return null;
                        },
                        errorMessage: "Cannot find the Table on the UI"
                    });
                },

                iShouldSeeHistoryPopupWithValueInTable: function (sId, sValue) {
                    return this.waitFor({
                        id: PREFIX_ID + sId,
                        success: function (oTableObject) {
                            var sText = oTableObject.getItems()[1].getCells()[0].getText();
                            Opa5.assert.equal(sText, sValue, sValue + " is visible ");
                            return null;
                        },
                        errorMessage: "Cannot find the table value"
                    });
                },

                iShouldSeeHistoryPopupWithValueInList: function (sId, sValue) {
                    return this.waitFor({
                        id: PREFIX_ID + sId,
                        success: function (oPopupListObject) {
                            var sText = oPopupListObject.getItems()[1].getTitle();
                            Opa5.assert.equal(sText, sValue, sValue + " is visible ");
                            return null;
                        },
                        errorMessage: "Cannot find the list value"
                    });
                },

                iCheckTheHistoryEnabledPropertyForTheFieldInTheSmartFilterBar: function (sField, bHistoryEnabled) {
                    return this.waitFor({
                        id: PREFIX_ID + "listReportFilter",
                        success: function (oSmartFilterBar) {
                            var aControlConfiguration = oSmartFilterBar.getControlConfiguration();
                            var bFlag = false;
                            for (var i = 0; i < aControlConfiguration.length; i++) {
                                if (aControlConfiguration[i].getKey() === sField && aControlConfiguration[i].getHistoryEnabled &&
                                    aControlConfiguration[i].getHistoryEnabled() === bHistoryEnabled) {
                                    bFlag = true;
                                    break;
                                }
                            }
                            Opa5.assert.ok(bFlag, "HistoryEnabled property '" + bHistoryEnabled + "' for the field '" + sField + "' in the SmartFilterBar is set correctly")
                        },
                        errorMessage: "Cannot find the SmartFilterBar on the screen"
                    });
                }
            };
        };
    });
