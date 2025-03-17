sap.ui.define([
    "sap/ui/model/Filter",
    "sap/m/MessageToast"
], function (
    Filter,
    MessageToast
) {
    "use strict";

    return {
         /**
         * This function takes the standard navigation entry details (if present) for a particular card and context
         * and return a new/modified custom navigation entry to the core. The core will then use the custom
         * navigation entry to perform navigation
         * @param sCardId  : Card id as defined in manifest for a card
         * @param oContext : Context of line item that is clicked (empty for header click)
         * @param oNavigationEntry : Custom navigation entry to be used for navigation
         * @returns {object} : Properties are {type, semanticObject, action, url, label}
         * @public
         */
          doCustomNavigation: function (sCardId, oContext, oNavigationEntry) {
            var oCustomNavigationEntry;
            var oEntity = oContext && oContext.sPath && oContext.getProperty && oContext.getProperty(oContext.sPath);
            if (sCardId === "card001" && oEntity && oEntity.PurchaseOrder === "4500003575") {
                oCustomNavigationEntry = {};
                oCustomNavigationEntry.type = "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation";
                oCustomNavigationEntry.semanticObject = "Action";
                oCustomNavigationEntry.action = "toappnavsample";
                oCustomNavigationEntry.url = ""; //Only required when type is DataFieldWithUrl
                oCustomNavigationEntry.label = ""; //Optional
            }
            return oCustomNavigationEntry;
        },

        getCustomMessage: function (oResponse, sCardId) {
            if (sCardId == "card001") {
                if (oResponse && oResponse.getParameters() && oResponse.getParameters().success) {
                    return {
                        sMessage: "My Custom Message for No Data", //message in case of success and no data
                        sIcon: "sap-icon://message-information", //icon in case of success and no data
                    };
                } else {
                    return {
                        sMessage: "My Custom Message for Error", //message in case of error
                    };
                }
            }
        },

        getCustomFilters: function () {
            var oValue1 = this.oView.byId("ProductID").getValue();
            var oValue2 = this.oView.byId("SalesOrderID").getValue();
            
            var aFilters = [],
                oFilter1,
                oFilter2;

            if (oValue1) {
                oFilter1 = new Filter({
                    path: "ProductID",
                    operator: "EQ",
                    value1: oValue1,
                });

                aFilters.push(oFilter1);
            }

            if (oValue2) {
                oFilter2 = new Filter({
                    path: "SalesOrderID",
                    operator: "EQ",
                    value1: oValue2,
                });

                aFilters.push(oFilter2);
            }

            if (aFilters && aFilters.length > 0) {
                return new Filter(aFilters, true);
            }
        },

        getCustomAppStateDataExtension: function (oCustomData) {
            //the content of the custom field shall be stored in the app state, so that it can be restored later again e.g. after a back navigation.
            //The developer has to ensure, that the content of the field is stored in the object that is returned by this method.
            var oCustomField1 = this.oView.byId("ProductID");
            var oCustomField2 = this.oView.byId("SalesOrderID");
            if (oCustomField1) {
                oCustomData.ProductID = oCustomField1.getValue();
            }
            if (oCustomField2) {
                oCustomData.SalesOrderID = oCustomField2.getValue();
            }
            return oCustomData;
        },

        modifyStartupExtension: function (oCustomSelectionVariant) {
            
        },

        restoreCustomAppStateDataExtension: function (oCustomData) {
            //in order to to restore the content of the custom field in the filter bar e.g. after a back navigation,
            //an object with the content is handed over to this method and the developer has to ensure, that the content of the custom field is set accordingly
            //also, empty properties have to be set

            var oCustomField1 = this.oView.byId("ProductID");
            oCustomField1.setValue();

            var oCustomField2 = this.oView.byId("SalesOrderID");
            oCustomField2.setValue();

            if (oCustomData) {
                if (oCustomData.ProductID) {
                    oCustomField1.setValue(oCustomData.ProductID);
                }

                if (oCustomData.SalesOrderID) {
                    oCustomField2.setValue(oCustomData.SalesOrderID);
                }
            }
        },

        /*
                This is for Custom Action
         */
        onCustomActionPress: function (sCustomAction) {
            if (sCustomAction === "press1") {
                return this.press1;
            } else if (sCustomAction === "press2") {
                return this.press2;
            }
        },

        press1: function (oEvent) {
            window.open("https://www.google.co.in");
        },

        press2: function (oEvent) {
            window.open("http://www.sap.com/index.html");
        },

        getParametersForInsightCard: function(oNavigateParams, oSelectionVariantParams) {
            var aCustomSelectionVariant = [];

            var oSupplierName = {
                path: "SupplierName",
                operator: "EQ",
                value1: "Robert Brown Entertainment",
                value2: null,
                sign: "I",
            };
            var oLandFilter = {
                path: "Land1",
                operator: "EQ",
                value1: " ",
                value2: null,
                sign: "I",
            };
            var oCustomSelectionVariant = {
                path: "TaxTarifCode",
                operator: "EQ",
                value1: 5,
                value2: null,
                sign: "I",
            };
            var oMaterialName = {
                path: "MaterialName",
                operator: "EQ",
                value1: "Material 2",
                value2: null,
                sign: "I",
            }
            aCustomSelectionVariant.push(oCustomSelectionVariant);
            aCustomSelectionVariant.push(oLandFilter);
            aCustomSelectionVariant.push(oSupplierName);
            aCustomSelectionVariant.push(oMaterialName);
            return {
                aSelectionVariant: aCustomSelectionVariant,
                bIgnoreEmptyString: true,
            };
        },

        /*
            This is for Custom Parameters
         */
        onCustomParams: function (sCustomParams) {
            if (sCustomParams === "getParameters") {
                return this.getParameters;
            } else if (sCustomParams === "param2") {
                return this.param2;
            } else if (sCustomParams === "getParametersForInsightCard") {
                return this.getParametersForInsightCard;
            }
        },

        getParameters: function (oNavigateParams, oSelectionVariantParams) {
            var aCustomSelectionVariant = [];
            var aSelectOptions = oSelectionVariantParams.getSelectOptionsPropertyNames();
            if (aSelectOptions.indexOf("SupplierName") != -1) {
                var aSupplierFilter = oSelectionVariantParams.getSelectOption("SupplierName");
                var sSupplierFilterValue = aSupplierFilter[0].Low;
                aSupplierFilter[0].Low = "";
            }
            var oSupplierName = {
                path: "SupplierName",
                operator: "EQ",
                value1: "",
                value2: null,
                sign: "I",
            };
            var oLandFilter = {
                path: "Land1",
                operator: "EQ",
                value1: sSupplierFilterValue,
                value2: null,
                sign: "I",
            };
            var oCustomSelectionVariant = {
                path: "TaxTarifCode",
                operator: "EQ",
                value1: 5,
                value2: null,
                sign: "I",
            };
            aCustomSelectionVariant.push(oCustomSelectionVariant);
            aCustomSelectionVariant.push(oLandFilter);
            aCustomSelectionVariant.push(oSupplierName);
            return {
                aSelectionVariant: aCustomSelectionVariant,
                bIgnoreEmptyString: true,
            };
        },

        param2: function (oNavigateParams) {
            oNavigateParams.TaxTarifCode = "3";
            return oNavigateParams;
        },
        /**
         *  /*
         This is for Custom Global Action
         */
        handleCustomAction: function () {
            var msg = "Custom Global Action clicked";
            MessageToast.show(msg);
        },

        //get all filters with values
        _getFilterList: function (oSelectionVariant) {
            var oFilterList = {};
            if (oSelectionVariant && oSelectionVariant.Parameters && oSelectionVariant.Parameters.length > 0) {
                for (var i = 0; i < oSelectionVariant.Parameters.length; i++) {
                    oFilterList[oSelectionVariant.Parameters[i].PropertyName] =
                        oSelectionVariant.Parameters[i].PropertyValue;
                }
            }
            if (oSelectionVariant && oSelectionVariant.SelectOptions && oSelectionVariant.SelectOptions.length > 0) {
                for (var j = 0; j < oSelectionVariant.SelectOptions.length; j++) {
                    var aRanges = oSelectionVariant.SelectOptions[j].Ranges;
                    for (var k = 0; k < aRanges.length; k++) {
                        if (aRanges[k].Option == "EQ" && aRanges[k].Low !== "") {
                            oFilterList[oSelectionVariant.SelectOptions[j].PropertyName] = aRanges[k].Low;
                        }
                    }
                }
            }
            return oFilterList;
        },

        /*
         * Breakout function for dynamic view switch
         * */
        onBeforeRebindPageExtension: function (oCards, oSelectionVariant) {
            var oFilterList = this._getFilterList(oSelectionVariant);
            var oTabIndexList = {};
            if (oCards && oCards.length > 0) {
                for (var i = 0; i < oCards.length; i++) {
                    if (oCards[i].id == "card012") {
                        if (oFilterList && oFilterList.hasOwnProperty("SupplierName")) {
                            if (oFilterList.SupplierName == "SAP") {
                                oTabIndexList["card012"] = 1;
                            } else if (oFilterList.SupplierName == "Talpa") {
                                oTabIndexList["card012"] = 2;
                            }
                        }
                    }
                }
            }
            this.setTabIndex(oTabIndexList);
        }
    };
});
