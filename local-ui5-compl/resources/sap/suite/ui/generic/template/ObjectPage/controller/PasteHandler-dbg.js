sap.ui.define([
    "sap/ui/base/Object",
    "sap/base/util/extend",
    "sap/m/MessageBox"
], function (BaseObject, extend, MessageBox) {
    "use strict";

    function getMethods(oController, oTemplateUtils) {

        var SELECTION_TYPE = {
            SINGLE_CELL: "singleCell",
            MULTI_CELL: "multiCell",
            NO_CELL: "noCell"
        };
        var selectionType, aColumnData, aReadOnlyFields, aFieldControl;

        /**  
            This class handles paste on OP table

            Here we have two methods "fnHandleBeforePaste" and "fnHandlePaste" which are attached with SmartTable events "beforePaste" and "paste".
            
            - Opertion based on Cell Selection mentioned below
                1) No Cell Selection paste - Here we add new columns if inline creation are active.
                2) Single Cell Selection paste - Here if clipboard have X*Y grid it will paste to X columns and Y rows to the target selected cells and 
                add extra rows if enough rows not present at bottom of selected cell.
                3) Multi Cell Selection paste - Here we paste to the selected X*Y grid.
                 - If clipboard data row are more then selected row then we add new rows only if selection contains empty rows as well.
                 - If clipboard data have more columns then selected columns then only selected columns would get pasted extra clipboard columns data will get ignored.

            fnHandleBeforePaste Handles below situation :-
             - Trims out required column based on Ignored fields which means only visible columns would be shown.
            
            fnHandlePaste - Handles Pre-condition check like (type missing or potential readonly columns with field control, NonInsertableProperties) and then do paste operations.
        */

        /** 
		 * Returns the Create button for the given SmartTable if it exists (otherwise a faulty value is returned)
		 * @param {Object} oSmartTable The smart table object.
		*/
		function getCreateButtonForTable(oSmartTable) {
			var sSmartTableId = oSmartTable.getId();
			var sAddEntryId = sSmartTableId.split("::Table")[0] + "::addEntry";
			var oAddEntry = oController.byId(sAddEntryId); //Instance of the Create button
			return oAddEntry;
		}

        // fnSetSelectionType sets the selection types to member variable selectionType
        function fnSetSelectionType(oSelection) {
            if (!oSelection || oSelection.rows.length === 0) {
                selectionType = SELECTION_TYPE.NO_CELL;
            } else if (oSelection.columns.length === 1 && oSelection.rows.length === 1) {
                selectionType = SELECTION_TYPE.SINGLE_CELL;
            } else {
                selectionType = SELECTION_TYPE.MULTI_CELL;
            }
        }

        // Returns object contains selected rows and columns
        function getSelectedRowsAndColumns(sSmartTableId) {
            var oSmartTable = oController.byId(sSmartTableId);
            var oSmartTableHandler = oTemplateUtils.oServices.oPresentationControlHandlerFactory.getPresentationControlHandler(oSmartTable);
            var oSelection = oSmartTableHandler.getSelection();
            return oSelection;
        }

        // Return row binding context list for the given SmartTableId
        function getRowBindingContext(sSmartTableId) {
            var oSmartTable = oController.byId(sSmartTableId);
            var oSmartTableHandler = oTemplateUtils.oServices.oPresentationControlHandlerFactory.getPresentationControlHandler(oSmartTable);
            var aRowsContext = oSmartTableHandler.getBinding().getContexts();
            return aRowsContext;
        }

        function fnIsEditMode() {
            return oController.getView().getModel("ui").getProperty("/editable");
        }

        //Function remove the ignored fields(not visible in the table and actions)
        function fnRemoveIgnored(aColumnData) {
            var index = aColumnData.length - 1;
            while (index >= 0) {
                if (aColumnData[index].ignore) {
                    aColumnData.splice(index, 1);
                }
                index -= 1;
            }
        }

        // function trims column based on cell selection and for back trim pass bRequiredBackTrim=true
        function fnRemoveUnwantedColumn(aColumnData, oSelection, bRequiredBackTrim) {
            if (bRequiredBackTrim) {
                var indexColumnLast = aColumnData.findLastIndex(function(oColumn) {
                    return oColumn.columnId === oSelection.columns[oSelection.columns.length - 1].getId();
                });
                aColumnData.splice(indexColumnLast + 1);
            }
            var index = aColumnData.findIndex(function(oColumn) {
                return oColumn.columnId === oSelection.columns[0].getId();
            });
            aColumnData.splice(0, index);
        }

        // Function modifies aColumnData and filter relevant columns required for paste.
        function filterColumnsForPaste(oSelection, aColumnData) {
            switch (selectionType) {
                case SELECTION_TYPE.SINGLE_CELL:
                    fnRemoveUnwantedColumn(aColumnData, oSelection, false);
                break;
                case SELECTION_TYPE.MULTI_CELL:
                    fnRemoveUnwantedColumn(aColumnData, oSelection, true);
                break;
                default:
                    break;
            }
        }

        /**
         * It trims out ignore field and selected area based on selection type
         * Set the Selection type to global variable.
         * 
		 * @param {string}  sSmartTableId  Smart table Id
		 * @param {sap.ui.base.Event}  oEvent beforePaste event
		 */
        function fnHandleBeforePaste(sSmartTableId, oEvent) {
            if (!fnIsEditMode()) {
                // Paste will only work when OP is in edit mode
                oEvent.preventDefault();
                return;
            }
            aColumnData = oEvent.getParameter("columnInfos");
            var oSelection = getSelectedRowsAndColumns(sSmartTableId);
            fnSetSelectionType(oSelection);
            fnRemoveIgnored(aColumnData);
            filterColumnsForPaste(oSelection, aColumnData);
        }

        // Show message dialog when data parsing error would be there.
        function fnHandleDataParseError(aError) {
            var aErrorMessages = aError.map(function (oElement) {
                return oElement.message;
            });
            var sPasteError = oTemplateUtils.oCommonUtils.getText("DATA_PASTE_ERROR_MESSAGE", [aErrorMessages.length]);
            var sErrorCorrection = oTemplateUtils.oCommonUtils.getText("DATA_PASTE_ERROR_CORRECTION_MESSAGE");
            var sNote = oTemplateUtils.oCommonUtils.getText("DATA_PASTE_ERROR_CORRECTION_NOTE");
            //Push correction  message and note message to the aErrorMessages
            aErrorMessages.unshift(""); //To show space b/w the short text and detail text
            aErrorMessages.unshift(sNote);
            aErrorMessages.unshift(sErrorCorrection);
            MessageBox.show(sPasteError, {
                icon: MessageBox.Icon.ERROR,
                title: oTemplateUtils.oCommonUtils.getText("ST_ERROR"),
                actions: [sap.m.MessageBox.Action.CLOSE],
                details: aErrorMessages.join("<br>")
            });
        }

        /**
         * function will remove NonInsertableProperties propeties from record need to be added.
         * 
         * @param {*} oSmartTable  smart table object instance
         * @param {*} aNewRecords List of new records to be added.
         */
        function removeNonInsertableProperties(oSmartTable, aNewRecords) {
            var set = new Set();
            var sEntitySet = oSmartTable.getEntitySet();
            var oModel = oSmartTable.getModel();
            var oMetaModel = oModel.getMetaModel();
            var oEntitySet = oMetaModel.getODataEntitySet(sEntitySet);
            var aNonInsertableProp = oEntitySet['Org.OData.Capabilities.V1.InsertRestrictions'] && oEntitySet['Org.OData.Capabilities.V1.InsertRestrictions'].NonInsertableProperties;
            if (!aNonInsertableProp || !aNonInsertableProp.length) {
                return;
            }
            for (var i = 0; i < aNonInsertableProp.length; i++) {
                set.add(aNonInsertableProp[i].PropertyPath);
            }
            for (var i = 0; i < aNewRecords.length; i++) {
                for (var property in aNewRecords[i].value) {
                    if (set.has(property)) {
                        delete aNewRecords[i].value[property];
                    }
                }
            }
        }

        // Add new draft rows to the table.
        function addNewEntry(oEvent, aNewRecords, sSmartTableId) {
            if (!fnCheckCreationRowEnabled(sSmartTableId)) {
                return;
            }
            var oSmartTable = oEvent.getSource();
            var oAddEntry = getCreateButtonForTable(oSmartTable);
            var oEventSource = oAddEntry || oSmartTable;
            removeNonInsertableProperties(oSmartTable, aNewRecords);
            if (aNewRecords.length) {
                var DraftSavedState = sap.m.DraftIndicatorState.Saved, iParsedDataLength = aNewRecords.length; //Indicator for the footer

                var aAddEntryPromises = aNewRecords.map(function(oRecord, index) {
                    var bIgnoreTableRefresh = index < iParsedDataLength - 1; //Flag to overcome multiple table refreshes when records are pasted.
                    return oTemplateUtils.oCommonEventHandlers.addEntry(oEventSource, true, undefined, oRecord.value, bIgnoreTableRefresh);
                });

                Promise.all(aAddEntryPromises).then(function () {
                    //After the records are added, show a draft saved indicator on the footer
                    var oTemplatePrivateGlobal = oTemplateUtils.oComponentUtils.getTemplatePrivateGlobalModel();
                    oTemplatePrivateGlobal.setProperty("/generic/draftIndicatorState", DraftSavedState);
                });
            }
        }

        /**
         * fn checks whether a cell is editable or not based field control
         * field control value (Hide - 0, Read Only - 1, Optional - 3, Mandatory - 7)
         * @param {*} oRowData - RowData contains binding context of row.
         * @param {string} sPath - Property path of the columns.
         * @returns {boolean}
         */
        function isCellEditable(oRowData, sPath) {
            var oData = oRowData.context.getObject();
            var oFieldControl  = aFieldControl.find(function(oFieldControl) {
                return oFieldControl.name === sPath;
            });
            if (!oFieldControl || oData[oFieldControl.fieldControl] === undefined) {
                return true;
            }
            if (oData[oFieldControl.fieldControl] > 1) {
                return true;
            }
            return false;
        }

        // Function updates the rows based on clipboard-copied values.
        function updateSelectionRows(aRowsToBeUpdated) {
            aRowsToBeUpdated.forEach(function (oRowData) {
                var oModel = oRowData.context.getModel();
                Object.entries(oRowData.value).forEach(function (data) {
                    var sPath = data[0];
                    var vValue = data[1];
                    if (isCellEditable(oRowData, sPath)) {
                        oModel.setProperty(sPath, vValue, oRowData.context);
                    }
                });
            });
        }

        /**
		 * Analyse selected record and segregate record to be added and update
         * 
		 * @param {Object}  oSelection  Object having selected rows and columns.
		 * @param {Object}  oResult Contains parse and error list.
         * @param {string}  sSmartTableId smarttable stable id
         * @returns {object} Contains additionalRows, rowsToBeUpdated, selection, hasError
		 */
        function fnAnalysePaste(oSelection, oResult, sSmartTableId) {
            var aAddtionalRows = [],
                aRowsToBeUpdated = [],
                aParseData = oResult.parsedData,
                bHasError = oResult.errors != null && oResult.errors.length != 0;
            if (bHasError) {
                fnHandleDataParseError(oResult.errors);
            } else {
                switch (selectionType) {
                    case SELECTION_TYPE.NO_CELL:
                        aParseData.forEach(function(oParsedData) {
                            aAddtionalRows.push({
                                value: oParsedData
                            });
                        });
                    break;
                    case SELECTION_TYPE.SINGLE_CELL:
                        var aRowsContext = getRowBindingContext(sSmartTableId);
                        var index = aRowsContext.findIndex(function(oRowContext) {
                            return oRowContext.getPath() === oSelection.rows[0].getPath();
                        });
                        for (var i = 0; i < aParseData.length; i++) {
                            if (index < aRowsContext.length) {
                                aRowsToBeUpdated.push({
                                    context: aRowsContext[index],
                                    value: aParseData[i]
                                });
                            } else {
                                aAddtionalRows.push({
                                    value: aParseData[i]
                                });
                            }
                            index++;
                        }
                    break;
                    case SELECTION_TYPE.MULTI_CELL:
                        var bNewRowsPossible = false;
                        for (var i = 0; i < aParseData.length; i++) {
                            if (i < oSelection.rows.length && oSelection.rows[i]) {
                                aRowsToBeUpdated.push({
                                    context: oSelection.rows[i],
                                    value: aParseData[i]
                                });
                                if (oSelection.rows[i].isInactive()) {
                                    bNewRowsPossible = true;
                                }
                                continue;
                            }
                            if (bNewRowsPossible) {
                                aAddtionalRows.push({
                                    value: aParseData[i]
                                });
                            }
                        }
                    break;
                    default:
                        break;
                }
            }
            return {
                additionalRows: aAddtionalRows,
                rowsToBeUpdated: aRowsToBeUpdated,
                hasError: bHasError
            };
        }

        // Fn decides addtion and updating of record based on selection type.
        function fnExecutePaste(oEvent, oPasteActions, sSmartTableId) {
            if (selectionType === SELECTION_TYPE.NO_CELL) {
                addNewEntry(oEvent, oPasteActions.additionalRows, sSmartTableId);
            } else {
                updateSelectionRows(oPasteActions.rowsToBeUpdated);
                addNewEntry(oEvent, oPasteActions.additionalRows, sSmartTableId);
            }
        }

        // Function check whether creation rows is enabled
        function fnCheckCreationRowEnabled(sSmartTableId) {
            var sSmartTableCreationMode = oController.byId(sSmartTableId).data("creationMode");
            var bIsInlineCreationRowsEnabled = ["inline", "creationRows", "creationRowsHiddenInEditMode"].includes(sSmartTableCreationMode);
            return bIsInlineCreationRowsEnabled;
        }

        /**
         * Function removes potential read only data from oResult "parseData".
         * @param {string} sSmartTableId - Smart table ID.
         * @param {Object} oResult - result data of column and data mapping
         */
        function fnFilterPotentialaReadOnlyFieldsFromSource(sSmartTableId, oResult) {
            var oSmartTable = oController.byId(sSmartTableId);
            var oSmartTableHandler = oTemplateUtils.oServices.oPresentationControlHandlerFactory.getPresentationControlHandler(oSmartTable);
            var oPotentialaReadOnlyFields = oSmartTableHandler.getPotentiallyReadOnlyField(sSmartTableId);
            aReadOnlyFields = oPotentialaReadOnlyFields.readOnlyFields;
            aFieldControl = oPotentialaReadOnlyFields.fieldControls;
            for (var i = 0; i < aReadOnlyFields.length; i++) {
                var sPropName = aReadOnlyFields[i].name;
                for (var j = 0; j < oResult.parsedData.length; j++) {
                    if (oResult.parsedData[j][sPropName] !== undefined) {
                        aReadOnlyFields[i].ignoredFromPaste = true;
                        delete oResult.parsedData[j][sPropName];
                    }
                }
            }
            return oResult;
        }

        function getAdditionalProperty() {
            var aAdditionalProperty = [];
            aColumnData.forEach(function(oColumn) {
                if (oColumn.additionalProperty) {
                    aAdditionalProperty.push(oColumn.property);
                }
            });
            return aAdditionalProperty;
        }

        function fnShowToastAfterPaste() {
            var sNonPastedColumns = "", bMultipleColumns = false;
            var aAdditionalProperty = getAdditionalProperty();
            aReadOnlyFields.forEach(function(oColumn) {
                if (oColumn.ignoredFromPaste && !aAdditionalProperty.includes(oColumn.name)) {
                    if (sNonPastedColumns) {
                        sNonPastedColumns += ", ";
                        bMultipleColumns = true;
                    }
                    sNonPastedColumns += "\"" + oColumn.label + "\"";
                }
            });
            var sMessage = sNonPastedColumns ? oTemplateUtils.oCommonUtils.getText(bMultipleColumns ? "PARTIAL_PASTE_PLURAL" : "PARTIAL_PASTE", [sNonPastedColumns]) : oTemplateUtils.oCommonUtils.getText("PASTE_COMPLETE");
            oTemplateUtils.oServices.oApplication.showMessageToast(sMessage, {duration: 5000});
        }

        /**
		 * fnHandlePaste method will get called after fnHandleBeforePaste do all kind of column triming
         * 
         * It will do pre-validation check whether pasting is feasible or not.
         * fnHandlePaste method analyse the parsed data and execute paste if table data parsing is successful.
         * 
		 * @param {string}  sSmartTableId  Smart table Id
		 * @param {sap.ui.base.Event}  oEvent paste event
		 */
        function fnHandlePaste(sSmartTableId, oEvent) {
            var oResult = oEvent.getParameter("result");
            var oSelection = getSelectedRowsAndColumns(sSmartTableId);
            if (selectionType !== SELECTION_TYPE.NO_CELL && (oResult.errors === null || !oResult.errors.length)) {
                oResult = fnFilterPotentialaReadOnlyFieldsFromSource(sSmartTableId, oResult);
            }
            var oPasteActions = fnAnalysePaste(oSelection, oResult, sSmartTableId);
            if (!oPasteActions.hasError) {
                fnExecutePaste(oEvent, oPasteActions, sSmartTableId);
                fnShowToastAfterPaste();
            }
        }

        return {
            handlePaste: fnHandlePaste,
            handleBeforePaste: fnHandleBeforePaste
        };
    }

    return BaseObject.extend("sap.suite.ui.generic.template.ObjectPage.controller.PasteHandler", {
        constructor: function (oController, oTemplateUtils) {
            extend(this, getMethods(oController, oTemplateUtils));
        }
    });
});