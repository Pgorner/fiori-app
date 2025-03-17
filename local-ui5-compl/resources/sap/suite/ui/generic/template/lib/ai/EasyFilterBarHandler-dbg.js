sap.ui.define([
    "sap/ui/base/Object",
    "sap/base/util/extend",
    "sap/suite/ui/generic/template/lib/filterHelper",
    "sap/suite/ui/generic/template/genericUtilities/FeLogger",
    "sap/ui/model/FilterOperator"
], function(BaseObject, extend, filterHelper, FeLogger, FilterOperator) {
    'use strict';

    /*
     * This is a handler class for EasyFilterBar.
     * It gets initialized when the Fiori AI filtering intent is enabled
     * Preparation of the easy filter metadata is done from the smart filter bar metadata
     * Event handlers for the easy filter bar are also defined here
     * 
     */
    var oLogger = new FeLogger("lib.ai.EasyFilterBarHandler").getLogger();

    function getMethods(oState, oController, oTemplateUtils) {
        var mCodeList = {};
        var oEasyFilterMetadata;
        // used for busyHandling between query triggered and query resolved.
        var oQueryPromise, oQueryPromiseResolve;
        var fnValueHelpPromiseResolve;
        // fnValueHelpPromiseReject;

        /**
         * This method prepares the metadata calculation after the smart filter bar is initialized
         * @returns A promise which returns the prepared metadata
         */
        function fnGetEasyFilterSearchMetadata() {
            return new Promise(function(fnResolve) {
                oState.oIappStateHandler.onFEStartupInitialized().then(function() {
                    fnPrepareSearchMetadata().then(function(oMetadata){
                        fnResolve(oMetadata);
                    });
                });
            });
        }
        /**
         * This method prepares the metadata for each filterable field from the smart filter bar
         *
         * @returns Filterbar metadata which is required for the EasyFilter search
         */
        function fnPrepareSearchMetadata()  {

            var aPromise = [];
            var oEditStateFilterItem;
            var oDefaultValuesForEasyFilter = {};
            var oOwnerFilterControl = oState.oSmartFilterbar;
            var oSFBModel = oOwnerFilterControl.getModel();
            var oSFBMetaModel = oSFBModel.getMetaModel();

            var sEntitySet = oController.getOwnerComponent().getEntitySet();

            var mFilterProperties = {}; // todo : Add the properties from navigation entites
            var oEntityType = oTemplateUtils.oCommonUtils.getMetaModelEntityType(sEntitySet);
            oEntityType.property.map(function (oProperty) {
                var sTokenType = "ValueHelp"; // Other values are "Calendar" | "Time" | "MenuWithCheckBox" | "MenuWithSingleSelect"
                if (filterHelper.isPropertyFilterable(oProperty)) {

                    var bIsCodeListRequired;
                    oProperty.extensions && oProperty.extensions.forEach(function(oExtension) {
                        if (oExtension.name === "value-list" && oExtension.value === "fixed-values") {
                            sTokenType = "MenuWithCheckBox";
                            bIsCodeListRequired = true;
                        }
                    });

                    // Calculate the token type based on the property type and display format
                    // It will be better if this is done at the control level
                    if ((oProperty.type === "Edm.DateTime" && oProperty["sap:display-format"] === "Date") ||
                    (oProperty.type === "Edm.String" && oProperty["com.sap.vocabularies.Common.v1.IsCalendarDate"] && oProperty["com.sap.vocabularies.Common.v1.IsCalendarDate"].Bool === "true")) {
                        sTokenType = "Calendar";
                    } else if (oProperty.type === "Edm.DateTimeOffset") {
                        sTokenType = "Time";
                    }

                    mFilterProperties[oProperty.name] = {
                        name: oProperty.name,
                        //label: oProperty.label,  Name is added from the filter item control
                        dataType: oProperty.type,
                        defaultValue : [], // Fill values from FLP user defaults , SV or other sources
                        filterable: true,
                        sortable: false,
                        codeList : bIsCodeListRequired,
                        type: sTokenType,
                        unit: oProperty["sap:unit"] || "",
                        required: oProperty["sap:required-in-filter"] === "true" ? true : false
                    };
                }
            });

            oEasyFilterMetadata = {
                version: 1,
                entitySet: sEntitySet,
                fields : []
            };
            oDefaultValuesForEasyFilter = oOwnerFilterControl.getFilterData() || {};
            oOwnerFilterControl.getAllFilterItems().forEach(function (oFilterItem) {
                //check if the filter item from the filter control is a property of the entity type , if then push it to the easy filter metadata
                // todo : Add the properties from navigation entites
                var oFilterItemForQuery = mFilterProperties[oFilterItem.getName()];
                if (oFilterItemForQuery) {
                    var oDefaultFilterValue = oDefaultValuesForEasyFilter[oFilterItem.getName()];
                    if (oDefaultFilterValue) {
                        var aValues = [];
                        // oDefaultFilterValue can have ranges or items or low or single value directly
                        if (oDefaultFilterValue.ranges && oDefaultFilterValue.ranges.length > 0) {
                            aValues = oDefaultFilterValue.ranges.map(function(oRange) {
                                if (oRange.exclude === false) {
                                    if (oRange.operation === "BT") {
                                        return {
                                            operator: FilterOperator.BT,
                                            selectedValues: [{ value1: oRange.value1, value2: oRange.value2 }]
                                        };
                                    } else {
                                        return {
                                            operator: oRange.operation,
                                            selectedValues: [oRange.value1]
                                        };
                                    }
                               } else {
                                    return {
                                        operator: FilterOperator.NE,
                                        selectedValues: [oRange.value1]
                                    };
                                }
                            });
                        } else if (oDefaultFilterValue.items && oDefaultFilterValue.items.length > 0) { // unrestricted/multi-value
                            oDefaultFilterValue.items.forEach(function(oItem) {
                                aValues.push({
                                    operator: FilterOperator.EQ,
                                    selectedValues: [oItem.key]
                                });
                            });
                        } else if (oDefaultFilterValue) { // In cases where the default value is coming from the FLP user defaults and does not have ranges and the value is a single value
                            aValues = [
                                {
                                    operator: FilterOperator.EQ,
                                    selectedValues: [oDefaultFilterValue]
                                }
                            ];
                        }
                        oFilterItemForQuery.defaultValue = aValues;
                    }
                    oFilterItemForQuery.label = oFilterItem.getLabel();
                    // codeList is set to true for fixed value list and codelist is fetched
                    if (oFilterItemForQuery.codeList) {
                        var oProperty = oSFBMetaModel.getODataProperty(oEntityType, oFilterItemForQuery.name , true);
                        var oPropertyContext = oSFBMetaModel.createBindingContext(oProperty);
                        var oVHPromise = oSFBMetaModel.getODataValueLists(oPropertyContext);
                        aPromise.push(oVHPromise);
                        oVHPromise.then(function(oValueList) {
                            if (mCodeList[oFilterItemForQuery.name]) {
                                oFilterItemForQuery.codeList = mCodeList[oFilterItemForQuery.name];
                            } else {
                                oFilterItemForQuery.codeList = function() {
                                    return fnGetValueListValues(oFilterItemForQuery, oValueList, oSFBModel);
                                };
                            }
                            oEasyFilterMetadata.fields.push(oFilterItemForQuery);
                        });
                    } else {
                        oEasyFilterMetadata.fields.push(oFilterItemForQuery);
                    }
                } else if (oFilterItem.getName() === "EditState") {// For draft scenarios
                    oEditStateFilterItem = oFilterItem;
                }
            });

             // Adding Editing status filter
             if (oTemplateUtils.oComponentUtils.isDraftEnabled()) {
                var oEditStateControl = oController.byId("editStateFilter");
                if (oEditStateControl) {
                    var oEditingStatusCodeList = oEditStateControl.getItems().map(function(oItem) {
                        return {
                            value : oItem.getKey(),
                            description : oItem.getText()
                        };
                    });
                   var oEditStateFilterMetadata = {
                        name: oEditStateFilterItem.getName(),
                        label: oEditStateFilterItem.getLabel(),
                        dataType: "Edm.String",
                        filterable: true,
                        required: false,
                        sortable: false,
                        type: "MenuWithSingleSelect",
                        codeList : oEditingStatusCodeList
                    };
                    oEasyFilterMetadata.fields.push(oEditStateFilterMetadata);
                }
            }

            return Promise.allSettled(aPromise).then(function() {
                return oEasyFilterMetadata;
            });
        }

        /**
         * This method reads the values of the valuehelp entity from the backend and fills the code list of each property.
         * Once the values are filled then the fioriAI uses it for getting the ID of the user entered description in the search field
         * Later the key field is set in the SFB and table is filtered with the same. Description cannot be used for filtering.
         * @param {*} oFilterItemForQuery A Property from the easy filter metadata
         * @param {*} oValueList Value list object of the filter item
         * @returns
         */
        function fnGetValueListValues(oFilterItemForQuery, oValueList, oSFBModel) {

            if (mCodeList[oFilterItemForQuery.name]) {
                return mCodeList[oFilterItemForQuery.name];
            }

            return new Promise(function(fnResolve, fnReject) {

                var oValueListDefaultBinding = oValueList[""];
                // Cases where the default binding is not available ignore for now
                if (oValueListDefaultBinding) {
                    var sSelect = oValueListDefaultBinding.Parameters && oValueListDefaultBinding.Parameters.map(function(oParam) {
                        return oParam.ValueListProperty.String;
                    }).join(",");

                    var fnSuccess = function(oResponse) {
                        var mValueListData = [];
                        oResponse.results && oResponse.results.forEach(function(oItem) {
                            mValueListData.push({
                                value : oItem[sValueProperty],
                                description : sDescriptionProperty ? oItem[sDescriptionProperty] : undefined
                            });
                        });
                        mCodeList[oFilterItemForQuery.name] = mValueListData;
                        oEasyFilterMetadata.fields.forEach(function (oField) {
                            if (oField.name === oFilterItemForQuery.name) {
                                oField.codeList = mValueListData;
                            }
                         });
                        fnResolve(mValueListData);
                    };

                    oSFBModel.read("/" + oValueListDefaultBinding.CollectionPath.String, {
                        $select : sSelect,
                        success : fnSuccess,
                        error : fnReject
                    });

                    var sValueProperty;
                    var sDescriptionProperty;

                    oValueListDefaultBinding.Parameters && oValueListDefaultBinding.Parameters.forEach(function(oParam) {
                        if (oParam.LocalDataProperty && (oParam.LocalDataProperty.PropertyPath === oFilterItemForQuery.name)) {
                            sValueProperty = oParam.ValueListProperty.String;
                        } else {
                            sDescriptionProperty = oParam.ValueListProperty.String;
                        }
                    });
                }
            });
        }

        /**
         * This method is used to convert the AI filters to the selectOptions for the SmartFilterBar
         * It also identifies the values of edit state filter in case of draft
         * @param {*} oAIFilters
         * @returns map which contains selectOptions and editStateFilter
         */
        function fnGetSFBVariantData(oAIFilters) {

            // Each filter from AI will be converted to a selectOption and added to the SmartVariantManagement state
            // Case 1 : AI Query "Show P1 = a"
            // ------- AI response "P1 = Ranges [a]" .
            // ------- Converted to selectOptions [ {Property = P1, Ranges = [ a ] } ].
            // ------- Filtered as P1 = a.
            // Case 1.a : AI Query "Show P1 = a , b"
            // ------- AI response "P1 = Ranges [a, b]" .
            // ------- Converted to selectOptions [ {Property = P1, Ranges = [ a, b ] } ] .
            // ------- FE filters as "a or b".
            // Case 1.b : AI Query "Show P1 between a and b"
            // ------- AI response
            // ------------ a.   " [P1 = Ranges [a] GE, P1 = Ranges [b]] LT ".
            // ------------        Converted to selectOptions [ {Property = P1, Ranges = [ a ] } , {Property = P2, Ranges = [ b ] } ] .
            // ------------        FE filters as "a or b" and this is wrong AI should respond with operator BT/NB like below.

            // ------------ b.   " P1 = Ranges[a,b] OP = BT/ NB ".
            // ------------        Converted to selectOptions [ {Property = P1, Ranges = [ a,b ], OP = BT/NB }  ] .
            // ------------        FE filters as "Greater than a and less than b" or "Not between a and b".
            // Case 2 : AI Query "Show P1 = a and P2 = b"
            // ------- AI response "[P1 = Ranges [a] , P2 = Ranges [b]]"
            // ------- Convert to selectOptions [ {Property = P1, Ranges = [ a ] } , {Property = P2, Ranges = [ b ] } ].
            // ------- FE filters as "a and b".

            var aSelectOptions = [];
            var oEditStateFilter = 0;
            oAIFilters.forEach(function(oFilterItem) {

                if ( oFilterItem.key === "EditState") {
                    oEditStateFilter  = oFilterItem.keySpecificSelectedValues[0].selectedValues[0]; // Edit state generally should not have more than one filter value
                } else {
                    var oFilter = {
                        PropertyName : oFilterItem.key,
                        Ranges : []
                    };
                    // keySpecificSelectedValues will have one selectedValues object for each operator
                    // ex : [{operator: "EQ", selectedValues: ["HT-1010","HT-10001","1097"]}, {operator: "Contains", selectedValues: ["HT-100"]}]
                    oFilterItem.keySpecificSelectedValues.forEach(function(oSelectedValues) {
                        oSelectedValues.selectedValues.forEach(function (oValue) {
                            var oRange = {
                                Sign : "I", // currently not considering "E"
                                High : ""
                            };
                            if (oSelectedValues.operator === "Contains") { // need to check for other operators if special handling is required
                                oRange.Option = "CP";
                                oRange.Low = oValue;
                            } else if (oSelectedValues.operator === "BT" || oSelectedValues.operator === "NB") {
                                // For "BT" and "NB" High is required
                                // AI reuse responds with array of values for BT and BN (between and not between)
                                // But in few cases it can also respond with two separate filters (LT and GT)
                                // FE DOES NOT do the auto merging and results in two separate selectOptions (results in OR condition)
                                oRange.Low = oValue[0];
                                oRange.High = oValue[1];
                            } else {
                                oRange.Option = oSelectedValues.operator;
                                oRange.Low = oValue;
                            }
                            oFilter.Ranges.push(oRange);
                        });
                    });
                    // one oFilter will have multiple ranges if multiple filters are selected for the same property
                    aSelectOptions.push(oFilter);
                }
            });
            return {
                aSelectOptions: aSelectOptions,
                oEditStateFilter : oEditStateFilter
            };
        }

        /**
         * This method is used to get the EasyFilter control from the floorplan
         * @returns EasyFilter control
         */
        function fnGetEasyFilterBar() {
            return oController.byId("template::easyFilterContainer");
        }

        /**
         * This method is used to initialise the EasyFilter control with the metadata from the smart filter bar
         */
        function fnInitialiseEasyFilterBar() {
            var oEasyFilter = fnGetEasyFilterBar();
            var oEasyFilterMetadataPromise = fnGetEasyFilterSearchMetadata();
            var sEntitySet = oController.getOwnerComponent().getEntitySet();
            oEasyFilterMetadataPromise.then((oEasyFilterMetadata) => {
                oEasyFilter.setContextPath(sEntitySet);
                oEasyFilter.setAppId(oController.getOwnerComponent().getAppComponent().getManifestEntry("sap.app").id);
                oEasyFilter.setFilterBarMetadata(oEasyFilterMetadata.fields);
                oEasyFilter.easyfilter = oTemplateUtils.oServices.oFioriAIHandler.fioriaiLib.EasyFilter;
            });
        }

		function fnClearFilters(oEvent) {
			var oSmartFilterbar = oState.oSmartFilterbar;
            oSmartFilterbar.search();
			// Do not clear the SFB as this is applicable only for the EasyFilter
            //oSmartFilterbar.clear();
		}

		function fnAfterQueryProcessing(oEvent) {
			oQueryPromiseResolve();
		}

		function fnBeforeQueryProcessing(oEvent) {
			oQueryPromise = new Promise(function(resolve) {
				oQueryPromiseResolve = resolve;
			});
			oTemplateUtils.oComponentUtils.getBusyHelper().setBusy(oQueryPromise);
		}

		function fnTokensChanged(oEvent) {
			var oSmartFilterbar = oState.oSmartFilterbar;
			var oFiltersFromAI = oEvent.getParameter("tokens");
			var sSmartFilterBarId = oSmartFilterbar.getId();
			var oSmartFilterBarWrapper = oTemplateUtils.oCommonUtils.getControlStateWrapperById(sSmartFilterBarId, "SmartFilterBar");
			var oSmartFilterBarVariant = oSmartFilterBarWrapper.getState();
			var oVariantDataFromAI = fnGetSFBVariantData(oFiltersFromAI);

			// restore the custom filters to the initial state for now
			// To check if other objects in oSmartFilterBarVariant needs to be modified
			var aAppExtension = Object.keys(oSmartFilterBarVariant.customFilters.appExtension);
			if ( aAppExtension.length > 0 ) {
				aAppExtension.forEach(function(sKey) {
					oSmartFilterBarVariant.customFilters.appExtension[sKey] = "";
				});
			}
			oSmartFilterBarVariant.selectOptions = oVariantDataFromAI.aSelectOptions;
			if (oTemplateUtils.oComponentUtils.isDraftEnabled()) {
				oSmartFilterBarVariant.customFilters.editState = oVariantDataFromAI.oEditStateFilter;
			}

			oSmartFilterBarWrapper.setState(oSmartFilterBarVariant);
			oSmartFilterbar.getSmartVariant() && oSmartFilterbar.getSmartVariant().currentVariantSetModified(true);
			oSmartFilterbar.search();
		}

		/**
		 * Event handler for the EasyFilter control's showValueHelp event.
		 * Identifies the input field for which the value help is requested and triggers the value help opening from SFB.
		 * @param {*} oEvent 
		 * @param {*} oState 
		 */
		function fnShowValueHelp(oEvent) {
			var oSmartFilterbar = oState.oSmartFilterbar;
            fnValueHelpPromiseResolve = oEvent.getParameter("resolve");
			oSmartFilterbar.associateValueLists();
            try {
                oSmartFilterbar.openValueHelpRequestForFilterItem(oEvent.getParameter("key"));
            } catch (error) {
                oLogger.error("Value help cannot be triggered for the field " + oEvent.getParameter("key"));
            }
		}

        function fnQueryChanged() {
            // todo : check if any action is required
        }
        // function fnUpdateEasyFilterBarTokens() {
        //     // todo : update the easy filter bar tokens with new values from the SFB VHD
        // }
        function fnOnFilterChange(oEvent) {
            // afterFilterDataUpdate
            var mChangeParameters = oEvent.getParameters("mParameters");
            var aEasyFilterTokens = [];
            var sFilterChangeProperty;
            // filter change will be triggered for each filter change even if the value help is opened from SFB
            // fnValueHelpPromiseResolve will be set only if the valeu help is opened from EasyFilter
            if (mChangeParameters.sId === "change" && fnValueHelpPromiseResolve) {
                sFilterChangeProperty = mChangeParameters.getParameter("filterChangeReason");
                // find an efficient way to get the filters from SFB to update the EasyFilter token
                oEvent.getSource().getFilters().forEach(function(aFilters) {
                    aFilters.aFilters && aFilters.aFilters.forEach(function(oPropertyFilterItem) {
                        // aFilters is available if there are more than 1 filter for the property in the EasyFilter
                        // In case of one filter aFilters is not available and the values are directly available in the oPropertyFilterItem
                        oPropertyFilterItem = oPropertyFilterItem.aFilters ? oPropertyFilterItem.aFilters : [oPropertyFilterItem];
                        oPropertyFilterItem.forEach(function(oFilterItem) {
                            if (oFilterItem.sPath === sFilterChangeProperty) {
                                var oPropertyToken = {
                                    operator : "",
                                    selectedValues : []
                                };
                                var bOperatorAvailable = aEasyFilterTokens.find(function(oToken) {
                                    return oToken.operator === oFilterItem.sOperator;
                                });
                                if (bOperatorAvailable) {
                                    aEasyFilterTokens.forEach(function(oToken) {
                                        if (oToken.operator === oFilterItem.sOperator) {
                                            oToken.selectedValues.push(oFilterItem.oValue1);
                                        }
                                    });
                                } else {
                                    oPropertyToken.operator = oFilterItem.sOperator;
                                    oPropertyToken.selectedValues.push(oFilterItem.oValue1);
                                    aEasyFilterTokens.push(oPropertyToken);
                                }
                            }
                        });
                    });
                });
                // ex : [{ operator:eq, selectedValues:["HT-1010","HT-10001","1097"]}, { operator:Contains, selectedValues:["HT-100"]}]
                fnValueHelpPromiseResolve(aEasyFilterTokens); // Assuming that the tokens for only the value help field has to be sent back
            }
        }

        /**
         *
         * This method is called when the variant is loaded in SFB
         * Always set the filterMode to classic when the variant is loaded as the variant filters are not supported in the EasyFilter
         * */
        function fnHandleVariantLoad(oEvent) {
            var oTempModel = oTemplateUtils.oComponentUtils.getTemplatePrivateModel();
            // 'context' is undefined or null when the user switches variant , in this case switch to classic mode
            // other values are "CANCEL" , "RESET" , "SET_VM_ID" , "DATA_SUITE" , "INIT" , "KEY_USER" etc : Do not switch filter mode in these cases
            if (!oEvent.getParameter("context") && oTempModel.getProperty("/listReport/filterMode") !== "classic") {
                var oSmartFilterbar = oState.oSmartFilterbar;
                oTempModel.setProperty("/listReport/filterMode", "classic");
                oSmartFilterbar.setVisible(true);
            }
        }

        return {
            getEasyFilterBar : fnGetEasyFilterBar,
            initialiseEasyFilterBar : fnInitialiseEasyFilterBar,
            getSFBVariantData : fnGetSFBVariantData,
            getEasyFilterSearchMetadata : fnGetEasyFilterSearchMetadata,
			onClearFilters: fnClearFilters,
			onAfterQueryProcessing: fnAfterQueryProcessing,
			onBeforeQueryProcessing: fnBeforeQueryProcessing,
            onQueryChanged : fnQueryChanged,
			onTokensChanged: fnTokensChanged,
			onShowValueHelp: fnShowValueHelp,
            onFilterChange : fnOnFilterChange,
            handleVariantLoad : fnHandleVariantLoad
        };
    }

    return BaseObject.extend("sap.suite.ui.generic.template.lib.ai.EasyFilterBarHandler", {
        constructor: function (oState, oController, oTemplateUtils) {
            extend(this, getMethods(oState, oController, oTemplateUtils));
        }
    });
    
});