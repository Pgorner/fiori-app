
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */

// Provides control sap.rules.ui.
sap.ui.define([
        "sap/rules/ui/library",
        "sap/ui/core/Control",
        "sap/ui/layout/form/SimpleForm",
        "sap/m/Label",
        "sap/m/Switch",
        "sap/m/Select",
        "sap/m/MessageBox",
        "sap/m/Table",
        "sap/m/Text",
        "sap/m/CheckBox",
        "sap/m/Input",
        "sap/m/Button",
        "sap/rules/ui/ExpressionAdvanced",
        "sap/ui/layout/VerticalLayout",
        "sap/rules/ui/type/Expression",
        "sap/rules/ui/Constants",
        "sap/rules/ui/AstExpressionBasic",
        "sap/rules/ui/services/AstExpressionLanguage",
        "sap/rules/ui/ast/util/AstUtil",
        "sap/ui/core/library",
        "sap/ui/model/odata/v2/ODataModel",
        "sap/ui/model/Context",
        "sap/m/library",
        /*"sap/ui/layout/form/GridContainerData",*/
        "sap/m/Column",
        "sap/ui/layout/ResponsiveFlowLayoutData",
        "sap/ui/core/IconPool",
        "sap/m/MessageStrip",
        "sap/ui/layout/HorizontalLayout",
        "sap/ui/core/Item",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/m/SelectDialog",
        "sap/m/StandardListItem",
        "sap/ui/model/BindingMode",
        "sap/ui/model/json/JSONModel",
        "sap/m/Dialog",
        "sap/m/ColumnListItem",
        "sap/ui/core/EventBus",
        "sap/ui/core/ListItem",
        "sap/ui/core/Lib",
        "sap/ui/core/BusyIndicator",
        "sap/ui/core/Element",
		"sap/m/MessageToast",
        "./DecisionTableSettingsRenderer"
    ],
    function (library, Control, SimpleForm, Label, Switch, Select, MessageBox, Table, Text, CheckBox, Input, Button,
        ExpressionAdvanced, VerticalLayout, ExpressionType, Constants,
        AstExpressionBasic, AstExpressionLanguage, AstUtil, coreLibrary, ODataModel,
        Context, mobileLibrary, /*GridContainerData,*/ Column,
        ResponsiveFlowLayoutData, IconPool, MessageStrip, HorizontalLayout, Item, Filter, FilterOperator, SelectDialog,
        StandardListItem, BindingMode, JSONModel, Dialog,
        ColumnListItem, EventBus, ListItem, coreLib, BusyIndicator, Element, MessageToast, DecisionTableSettingsRenderer) {
        "use strict";

        /**
         * Constructor for a new DecisionTableSettings Control.
         *
         * @param {string} [sId] id for the new control, generated automatically if no id is given
         * @param {object} [mSettings] initial settings for the new control
         *
         * Some class description goes here.
         * @extends  Control
         *
         * @author SAP SE
         * @version 1.132.0
         *
         * @constructor
         * @private
         * @alias sap.rules.ui.DecisionTableSettings
         * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
         */
        var oDecisionTableSettings = Control.extend("sap.rules.ui.DecisionTableSettings", {
            metadata: {
                library: "sap.rules.ui",
                properties: {
                    /**
                        * @deprecated Since 1.52.8, use the attribute RuleFormat instead.
                    */
                    cellFormat: {
                        type: "sap.rules.ui.DecisionTableCellFormat",
                        defaultValue: library.DecisionTableCellFormat.Both
                    },
                    hitPolicies: {
                        type: "sap.rules.ui.RuleHitPolicy[]",
                        defaultValue: [library.RuleHitPolicy.FirstMatch, library.RuleHitPolicy.AllMatch]
                    },
                    modelName: {
                        type: "string",
                        defaultValue: ""
                    },
                    newDecisionTable: {
                        type: "boolean",
                        defaultValue: false
                    },
                    decisionTableFormat: {
                        type: "sap.rules.ui.DecisionTableFormat",
                        defaultValue: library.DecisionTableFormat.RuleFormat
                    },
                    enableSettingResult: {
						type: "boolean",
						defaultValue: true
					}
                },
                aggregations: {
                    mainLayout: {
                        type: "sap.ui.layout.form.SimpleForm",
                        multiple: false
                    }
                },
                defaultAggregation: "mainLayout",
                associations: {
                    expressionLanguage: {
                        type: "sap.rules.ui.services.ExpressionLanguage",
                        multiple: false,
                        singularName: "expressionLanguage"
                    },
                    astExpressionLanguage: {
                        type: "sap.rules.ui.services.AstExpressionLanguage",
                        multiple: false,
                        singularName: "astExpressionLanguage"
                    }
                },
                events: {},
                publicMethods: []
            },
            renderer: DecisionTableSettingsRenderer
        });

        oDecisionTableSettings.prototype._addColumnToJsonModel = function (sequence) {
            var displayModel = this.getModel();
            var modelData = displayModel.getData();
            var aColumns = displayModel.oData.DecisionTable.DecisionTableColumns.results;

            //Create new column instance
            var oColumnData = {
                Condition: {
                    Expression: "",
                    FixedOperator: "",
                    Id: this.mNextColumnId,
                    RuleId: modelData.Id,
                    ValueOnly: this._getCellFormat(),
                    Version: modelData.Version
                },
                Id: this.mNextColumnId,
                RuleId: modelData.Id,
                Sequence: sequence + 1,
                Type: library.DecisionTableColumn.Condition,
                Version: modelData.Version,
                Status: "C"
            };
            this.mNextColumnId++;
            //Add new instance to column's array
            aColumns.splice(sequence, 0, oColumnData);
            //Increase by 1 the 'sequence' of all next lines
            for (var i = sequence + 1; i < aColumns.length; i++) {
                aColumns[i].Sequence = i + 1;
                //Mark column as updated only in case this isn't a new column (status "C")
                if (aColumns[i].Status && aColumns[i].Status === "C") {
                    continue;
                }
                aColumns[i].Status = "U";
            }
            //displayModel.setData(modelData);
            this._setDisplayModelData(modelData);
        };

        oDecisionTableSettings.prototype._addNodeObject = function (astNode) {
            var oNodeArray = [];
            var oAstExpressionLanguage = Element.getElementById(this.getAstExpressionLanguage());
            var oAstUtil = oAstExpressionLanguage._astBunldeInstance.ASTUtil;

            var updatedAstNode = [];
            updatedAstNode.Root = astNode.Root;
            updatedAstNode.SequenceNumber = astNode.Sequence;
            updatedAstNode.ParentId = astNode.ParentId;
            updatedAstNode.Reference = astNode.Reference;
            updatedAstNode.Id = astNode.NodeId;
            updatedAstNode.Type = astNode.Type;
            updatedAstNode.Value = astNode.Value ? astNode.Value : "";
			if (astNode.Type === "I") {
                    updatedAstNode.Value = astNode.IncompleteExpression;
            }
            if (astNode.Function) {
                updatedAstNode.Function = astNode.Function;
            }
            if (astNode.Type !== "P" && !astNode.Function) {
                var Output = [];
                Output.BusinessDataType = astNode.Output ? astNode.Output.BusinessDataType : astNode.BusinessDataType;
                Output.DataObjectType = astNode.Output ? astNode.Output.DataObjectType : astNode.DataObjectType;
                updatedAstNode.Output = Output;
            }
            oAstUtil.createNode(updatedAstNode);
        };


        oDecisionTableSettings.prototype._bindPredefinedTable = function (sPath, sKey) {
            var that = this;
            this.oPredefinedTable.destroyItems();
            var oModel = this.getModel("oDataModel");
            var oExpressionLanguage;
            if (this.getExpressionLanguage()) {
                oExpressionLanguage = Element.getElementById(this.getExpressionLanguage());
            } else {
                oExpressionLanguage = Element.getElementById(this.getAstExpressionLanguage());
            }
            var vocabularyModel = new ODataModel(oExpressionLanguage.getModel().sServiceUrl);
            var bAddAttributeToPredefTable = true;
            var sBindingPath;
            var oHeaderKey;
            var oContext;

            var callPredefindFactory = function (oAttributes) {
                if (oAttributes && oAttributes.length > 0) {
                    that.oPredefinedTable.setBusy(true);
                    for (var i = 0; i < oAttributes.length; i++) {
                        sBindingPath = "";
                        if (sKey === "/DecisionTableColumnResults" && oAttributes[i].Type === "RESULT") {
                            oHeaderKey = {
                                RuleId: oAttributes[i].RuleId,
                                Id: oAttributes[i].Id,
                                Version: oAttributes[i].Version
                            };
                            sBindingPath = oModel.createKey(sKey, oHeaderKey);
                            oContext = new Context(oModel, sBindingPath);
                        } else if (sKey === "/ExpandedAttributes") {
                            oHeaderKey = {
                                DataObjectId: oAttributes[i].DataObjectId,
                                Id: oAttributes[i].Id,
                                VocabularyId: oAttributes[i].VocabularyId,
                                RootDataObjectId: oAttributes[i].RootDataObjectId,
                                AttributeId: oAttributes[i].AttributeId
                            };
                            sBindingPath = vocabularyModel.createKey(sKey, oHeaderKey);
                            oContext = new Context(vocabularyModel, sBindingPath);
                            oContext.DataObjectAttributeinfo = oAttributes[i];
                        }
                        if (that.getExpressionLanguage()) {
                        	var type = oContext ? oContext.getObject(sBindingPath).BusinessDataType: "";
							if (type === Constants.DATE_BUSINESS_TYPE || type === Constants.TIMESTAMP_BUSINESS_TYPE || type === Constants.NUMBER || type ===
								Constants.STRING || type === Constants.BOOLEAN_BUSINESS_TYPE || type === Constants.BOOLEAN_ENHANCED_BUSINESS_TYPE) {
								bAddAttributeToPredefTable = true;
						    } else {
						    	bAddAttributeToPredefTable = false
						    }
                        }
                        if (sBindingPath && bAddAttributeToPredefTable) {
                            that.oPredefinedTable.addItem(that._predefinedFactory("col-" + i, oContext));
                        }
                    }
                    that.oPredefinedTable.setBusy(false);
                    that._internalModel.setProperty("/needToRefresh", false);
                }
            };

            if (sKey === "/DecisionTableColumnResults") {
                var oDtColumns = this.getModel().getProperty("/DecisionTable/DecisionTableColumns/results");
                var attributeSequenceArray = that.getModel("settingsModel").attributeSequenceArray;
                var orderedColumnArray = [];
                if (attributeSequenceArray && attributeSequenceArray.length > 0) {
                    var conditionsColumnCount = 0;
                    for (var col in oDtColumns) {
                        if (oDtColumns[col].Type === Constants.CONDITION) {
                            orderedColumnArray.push(oDtColumns[col]);
                            conditionsColumnCount = conditionsColumnCount + 1;
                        }
                    }
                    for (var attrId in attributeSequenceArray) {
                         for (var colSeq = conditionsColumnCount ; colSeq < oDtColumns.length ; colSeq++) {
                            if (oDtColumns[colSeq].Result && (oDtColumns[colSeq].Result.DataObjectAttributeId === attributeSequenceArray[attrId])) {
                                orderedColumnArray.push(oDtColumns[colSeq]);
                            }
                         }
                    }
                    callPredefindFactory(orderedColumnArray);
                } else {
                    callPredefindFactory(oDtColumns);
                }
            } else if (sKey === "/ExpandedAttributes") {
                var dataObjectAttributeList = this.getModel("settingsModel").oData.newDOAttributeList;
                var bResultDataObjectChanged = this.getModel("settingsModel").oData.resultDataObjectChanged;
                var bRefreshButtonClicked = this.getModel("settingsModel").oData.refreshButtonClicked;
                var bResultAttributeSequenceChanged = this.getModel("settingsModel").oData.resultAttributeSequenceChanged;
                var attributeSequenceArray = this.getModel("settingsModel").attributeSequenceArray;
                /* Do not make any additional call if only sequence has changed after changing result DO
                   However, if the refresh button is clicked after changing sequence, we need to fetch latest attributes as usual
                */
                if (bResultDataObjectChanged && !bRefreshButtonClicked && bResultAttributeSequenceChanged) {
                    var orderedAttributesArray = this._getOrderedAttributesArray(dataObjectAttributeList);
                    callPredefindFactory(orderedAttributesArray);
                } else {
                    vocabularyModel.read(sPath, {
                        urlParameters: {
                            "$expand": "ExpandedAttributes"
                        },
                        success: function (data) {
                            if (data.ExpandedAttributes.results <= 0) {
                                that.attributeListEmpty = true;
                            }
                            var dataAttrList = data.ExpandedAttributes.results;
                            var orderedAttributesArray = that._getOrderedAttributesArray(dataAttrList);
                            if (orderedAttributesArray.length > 0) {
                                that.getModel("settingsModel").oData.newDOAttributeList = orderedAttributesArray;
                                callPredefindFactory(orderedAttributesArray);
                            } else {
                                that.getModel("settingsModel").oData.newDOAttributeList = dataAttrList;
                                callPredefindFactory(dataAttrList);
                            }
                        },
                        error: function (oError) {
                            MessageBox.error(
                                oError.responseText, {
                                title: that.oBundle.getText("ERROR_DIALOG"),
                                actions: [MessageBox.Action.OK]
    
                            });
                        }
                    });
                }
                
            }
        };

        oDecisionTableSettings.prototype._getAttributeSequenceArray = function () {
            var attributeSequenceArray = this.getModel("settingsModel").attributeSequenceArray;
            if (!this.getModel("settingsModel").attributeSequenceArray) {
                var settingsModel = this.getModel("settingsModel");
                var settingsData = settingsModel.getData();
                var predefinedResultsArray = settingsData.predefinedResults;
                var tempSequenceArray = [];
                var i = 0;
                for (var entry in predefinedResultsArray) {
                    tempSequenceArray[i] = predefinedResultsArray[entry].DataObjectAttributeId ? predefinedResultsArray[entry].DataObjectAttributeId : predefinedResultsArray[entry].Id;
                    i++;
                }
                this.getModel("settingsModel").attributeSequenceArray = tempSequenceArray;
            }
            return this.getModel("settingsModel").attributeSequenceArray;
        };
    
        oDecisionTableSettings.prototype._getOrderedAttributesArray = function (dataAttrList) {
            var attributeSequenceArray = this.getModel("settingsModel").attributeSequenceArray;
            if (!attributeSequenceArray) {
                attributeSequenceArray = this._getAttributeSequenceArray();
            }
            var orderedAttributesArray = [];
            if (attributeSequenceArray && attributeSequenceArray.length > 0 && (this.getModel("settingsModel").getData().resultAttributeSequenceChanged || this.getModel("settingsModel").getData().refreshButtonClicked)) {
                for (var attrId in attributeSequenceArray) {
                    for (var obj in dataAttrList) {
                        if (dataAttrList[obj].Id === attributeSequenceArray[attrId]) {
                            orderedAttributesArray.push(dataAttrList[obj]);
                        }
                    }
                }
            }
            return orderedAttributesArray;
        };

        oDecisionTableSettings.prototype._calcNextColumnId = function () {
            var displayModel = this.getModel();
            var modelData = displayModel.getData();
            var aColumns = modelData.DecisionTable ? modelData.DecisionTable.DecisionTableColumns.results : [];
            var maxColId = 0;

            //Calc max "Id"
            for (var i = 0; i < aColumns.length; i++) {
                if (aColumns[i].Id > maxColId) {
                    maxColId = aColumns[i].Id;
                }
            }
            var nextId = maxColId + 1;

            return nextId;
        };

        oDecisionTableSettings.prototype._callRefreshResultsFunctionImport = function () {
            var that = this;
            var odataModel = this.getModel("oDataModel");
            var modelData = this.getModel().getData();
            var changesGroupID = {
                groupId: "changes"
            };
            odataModel.setDeferredGroups([changesGroupID.groupId]);
            var submitSuccess = function (response) {
                if (that.needToRenderPredefinedResultsTable) {
                    //create predefinedResults table with the refreshed attributes
                    that._createPredefinedResultsTable();
                }
                //reset the status so that the call will not go once again when clicked on apply
                that.getModel().getData().needToRefresh = false;
            };

            var submitError = function (e) {
                MessageToast.show(e);
            };

            var callRefreshFunctionImport = function (response) {
                var sRuleId = modelData.Id;
                odataModel.callFunction("/RefreshRuleResultDataObject", {
                    method: "POST",
                    groupId: changesGroupID.groupId,
                    urlParameters: {
                        RuleId: sRuleId
                    }
                });
                odataModel.submitChanges({
                    groupId: changesGroupID.groupId,
                    success: submitSuccess,
                    error: submitError
                });
            };

            if (modelData.needToRefresh) {
                callRefreshFunctionImport();
            }
        };

        oDecisionTableSettings.prototype._changeColumnInputMode = function (oContext, oEvent) {
            var oSelect = oEvent.getSource();
            this._openWarningDialog(oSelect, oContext);
        };

        oDecisionTableSettings.prototype._changeColumnStatusToUpdate = function (oContext) {
            var model = oContext.getModel();
            //Update column status to "update". But only in case it's not a new column
            var status = oContext.getProperty("Status");
            if (!status || status !== "C") {
                model.setProperty(oContext.getPath() + "/Status", "U");
            }
        };

        oDecisionTableSettings.prototype._changeInputMode = function (bShouldChangeMode, oSelect, oContext) {
            if (!bShouldChangeMode) {
                oSelect.setSelectedKey(this.oBundle.getText("valueOnly"));
                return;
            }
            oSelect.setEnabled(false);
            this.getModel().setProperty(oContext.sPath + "/Condition/ValueOnly", false);
            this._changeColumnStatusToUpdate(oContext);
        };

        oDecisionTableSettings.prototype._createDefaultColumn = function () {
            var _displayModel = this.getModel();
            var modelData = _displayModel.getData();
	    
	    if (!modelData.DecisionTable) {
		 modelData.DecisionTable = {
			DecisionTableColumns: []
		};
	    }

            //Create DecisionTable with default condition column
		if (modelData.DecisionTable.DecisionTableColumns && modelData.DecisionTable.DecisionTableColumns.results) {
            modelData.DecisionTable.DecisionTableColumns.results.push({
                Condition: {
                    Expression: "",
                    FixedOperator: "",
                    Id: this.mNextColumnId++,
                    RuleId: modelData.Id,
                    Version: modelData.Version,
                    ValueOnly: this._getCellFormat()
                },
                Id: 1,
                Sequence: 1,
                Type: library.DecisionTableColumn.Condition,
                Status: "C"
            });
		}
        };

        //Condition table
        oDecisionTableSettings.prototype._createTable = function () {
            this.conditionsTable = new Table({
                backgroundDesign: mobileLibrary.BackgroundDesign.Solid,
                showSeparators: mobileLibrary.ListSeparators.None,
                /*layoutData: new GridContainerData({
                    halfGrid: false
                }),TODO:Change by Harsh*/
                columns: [
					new Column({
						width: "50%",
						header: new Label({
							text: this.oBundle.getText("colOfDecisionTable"),
							design: mobileLibrary.LabelDesign.Bold
						}).setTooltip(this.oBundle.getText("colOfDecisionTable"))
					}),

					new Column({
						width: "25%",
						header: new Label({
							text: this.oBundle.getText("label"),
							design: mobileLibrary.LabelDesign.Bold
						}).setTooltip(this.oBundle.getText("label"))
					}),

					new Column({
						width: "25%",
						header: new Label({
							text: this.oBundle.getText("fixedOperator"),
							design: mobileLibrary.LabelDesign.Bold
						}).setTooltip(this.oBundle.getText("fixedOperator"))
					}),

                    /*new sap.m.Column({
                        width: "30%",
                        //visible: this.getCellFormat() == sap.rules.ui.DecisionTableCellFormat.Both || this.getCellFormat() == sap.rules.ui.DecisionTableCellFormat.Guided,
                        header: new sap.m.Label({
                            text: this.oBundle.getText("inputMode"),
                            design: sap.m.LabelDesign.Bold
                        }).setTooltip(this.oBundle.getText("inputMode"))
                    }),*/ // input mode choice will be removed from decision table settings

                    new Column({
                        width: "20%"
                    })
                ]
            }).data("hrf-id", "columnsTable", true);

            var _displayModel = this.getModel();
            this.conditionsTable.setModel(_displayModel);
            this.conditionsTable.bindItems({
                path: "/DecisionTable/DecisionTableColumns/results",
                factory: this._tableColumnsFactory.bind(this)
            });
            this.conditionsTable.setBusyIndicatorDelay(0);

            return this.conditionsTable;
        };

        oDecisionTableSettings.prototype._createRefreshButton = function () {
            var _calcStatisticsMessage = function () { //returns null if no changes => we'll disable refresh button
                var results = this.getModel("settingsModel").oData.results.resultsEnumration;
                var currentResultID = this.getModel().oData.ResultDataObjectId;
                var resultColumnsNew = [];
                var currentResultIDFound = false;
                // TODO: Currently results[i].columns is empty - need to fix this
                if (currentResultID) {
                    for (var i = 0; i < results.length; i++) {
                        if (results[i].id === currentResultID) {
                            if (results[i].columns) {
                                resultColumnsNew = results[i].columns;
                                currentResultIDFound = true;
                                break;
                            } else { // this section is applicable for Cloud Service
                                this.getModel("settingsModel").setProperty("/refreshButtonEnabled", true, null, true);
                                this.getModel("settingsModel").setProperty("/resultDataObjectId", currentResultID);
                                currentResultIDFound = true;
                                var messageRefreshWillDelete = this.oBundle.getText("refreshingWillDeleteMsg");
                                var messageAreyouSure = this.oBundle.getText("refreshAreyouSureMsg");
                                return messageRefreshWillDelete + messageAreyouSure;
                            }
                        }
                    }
                    if (!currentResultIDFound) {
                        resultColumnsNew = null;
                    }
                    if (resultColumnsNew && resultColumnsNew.length > 0) {
                        var resultColumnsOld = this._ruleResultColumns();
                        var resultUpdates = this._getResultsUpdates(resultColumnsOld, resultColumnsNew);
                        return this._getMessageByResultUpdates(resultUpdates);
                    }
                }
                this.getModel("settingsModel").setProperty("/refreshButtonEnabled", false, null, true);
                return null;
            }.bind(this);

            var _handleRefreshConfirmed = function () {
                this._updateRefreshFlags(true, false, true);
            }.bind(this);

            var calculatedStatisticsMessage = _calcStatisticsMessage();
            var _handleRefreshPress = function () {
                var dialogStatisticsMessage = calculatedStatisticsMessage;
                MessageBox.warning(
                    dialogStatisticsMessage, {
                        title: this.oBundle.getText("refeshResultWarningTitle"),
                        actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                        onClose: function (oAction) {
                            if (oAction === MessageBox.Action.OK) {
                                _handleRefreshConfirmed();
                            }
                        }
                    });
            }.bind(this);

            var oRefreshButton = new Button({
                layoutData: new ResponsiveFlowLayoutData({
                    weight: 1
                }),
                icon: IconPool.getIconURI("synchronize"),
                width: "3rem",
                type: mobileLibrary.ButtonType.Transparent,
                text: "",
                press: _handleRefreshPress,
                visible: true,
                enabled: "{settingsModel>/refreshButtonEnabled}"
            }).setTooltip(this.oBundle.getText("refreshBtn"));

            this.refreshButton = oRefreshButton;
            return oRefreshButton;
        };

        //creates a message strip
        oDecisionTableSettings.prototype._createInfoMessageStrip = function (textstr, elementID) {
            var omsgStrip = Element.getElementById(elementID);
            if (!omsgStrip) {
                omsgStrip = new MessageStrip({
                    visible: true, // boolean
                    id: elementID,
                    text: textstr, // string
                    type: coreLibrary.MessageType.Information, // sap.ui.core.MessageType
                    showIcon: true, // boolean
                    showCloseButton: true
                }).addStyleClass("sapRULTDecisionTableSettingsMessageStrip");
            }
            return omsgStrip;
        };

        oDecisionTableSettings.prototype._createLayout = function () {
            var oForm = new SimpleForm({
                editable: true,
                layout: "ResponsiveGridLayout",
                maxContainerCols: 1,
                columnsL: 1,
                columnsM: 1,
                labelSpanM: 1,
                content: [

                    new Label({
                        text: this.oBundle.getText("hitPolicy")
                    }).setTooltip(this.oBundle.getText("hitPolicy")),
                    new Select({
                        width: "220px",
                        enabled: "{settingsModel>/hitPolicy/enabled}",
                        items: {
                            path: "settingsModel>/hitPolicy/hitPolicyEnumration",
                            template: new Item({
                                key: "{settingsModel>key}",
                                text: "{settingsModel>text}"
                            })
                        },
                        selectedKey: "{/DecisionTable/HitPolicy}",
                        change: function (oEvent) {

                            //Update flag of hitPolicy change
                            var _displayModel = this.getModel();
                            var modelData = _displayModel.getData();
                            if (modelData.DecisionTable.HitPolicyStatus != "C") {
                                modelData.DecisionTable.HitPolicyStatus = "U";
                            }

                        }.bind(this)
                    }),

                    new Label(),
                    new HorizontalLayout({}),

                    new Label({
                        text: this.oBundle.getText("conditionsTableLabelText")
                    }).setTooltip(this.oBundle.getText("conditionsTableLabelTooltip")),
                    this._createTable(),

                    new Label(),
                    new HorizontalLayout({}),

                    new Label({
                        text: this.oBundle.getText("output")
                    }).setTooltip(this.oBundle.getText("output")),
                    new HorizontalLayout({
                        content: [
                            this._createResultInput(),
                            this._createRefreshButton()
                        ]
                    }),
                    new Label(),
                    this._createPredefinedResultsLayout()

                ]
            }).addStyleClass("sapRULTDecisionTableSettingsForm");

            return oForm;
        };

        //creates layout for predefined values
        oDecisionTableSettings.prototype._createPredefinedResultsLayout = function () {
            //if ABAP backend is used, we do not show the predefined results table
            if (this.needToRenderPredefinedResultsTable) {
                var verticalLayout = new VerticalLayout({
                    content: [
                        this._createInfoMessageStrip(this.oBundle.getText("PredefinedMessageStripHiddenAccessInfoText"), "id_HiddenAccessMessageStrip"),
                        this._createInfoMessageStrip(this.oBundle.getText("PredefinedMessageStripEditableAccessInfoText"),
                            "id_EditableAccessMessageStrip"),
                        this._createPredefinedResultsTable()
                    ]
                });
                return verticalLayout;
            } else {
                return new Label();
            }
        };

        //creates table for predefined values with access options
        oDecisionTableSettings.prototype._createPredefinedResultsTable = function () {
            //if the table does not exist, create the table
            if (!this.oPredefinedTable) {
                this.oPredefinedTable = new Table("idPredefinedTable", {
                    backgroundDesign: mobileLibrary.BackgroundDesign.Solid,
                    showSeparators: mobileLibrary.ListSeparators.All,
                    swipeDirection: mobileLibrary.SwipeDirection.Both,
                    /*layoutData: new GridContainerData({
                        halfGrid: false
                    }),TODO:Change by Harsh*/
                    columns: [new Column({
                        width: "45%",
                        header: new Label({
                            text: this.oBundle.getText("PredefinedResultColumnHeaderText"),
                            design: mobileLibrary.LabelDesign.Bold
                        })
                    }), new Column({
                        width: "30%",
                        header: new Label({
                            text: this.oBundle.getText("PredefinedAccessColumnHeaderText"),
                            design: mobileLibrary.LabelDesign.Bold
                        })
                    }), new Column({
                        width: "45%",
                        header: new Label({
                            text: this.oBundle.getText("PredefinedValuesColumnHeaderText"),
                            design: mobileLibrary.LabelDesign.Bold
                        })
                    }), new Column({
                        width: "20%",
                        header: new Label({
                            text: this.oBundle.getText("ReorderResultDOAttributes"),
                            design: mobileLibrary.LabelDesign.Bold
                        })
                    })]
                });
            }
            //bind model and factory function to the created table
            var bResultDataObjectChanged = this.getModel("settingsModel").getProperty("/resultDataObjectChanged");
            var bResultDataObjectAttributesChanged = this.getModel("settingsModel").getProperty("/refreshButtonClicked");
            var _displayModel = this.getModel();
            var resultObjId = "";

            if (!bResultDataObjectChanged && !bResultDataObjectAttributesChanged) {
                this.oPredefinedTable.setModel(_displayModel);
                this._bindPredefinedTable("/DecisionTable/DecisionTableColumns/results", "/DecisionTableColumnResults");
                this.oPredefinedTable.setBusyIndicatorDelay(0);
                return this.oPredefinedTable;

            } else {
                var resultObjId = this.getModel().getProperty("/ResultDataObjectId");
                this._getLatestResultDataObjects(resultObjId);
            }
            return null;
        };

        oDecisionTableSettings.prototype._createResultInput = function () {
            var model = this.getModel();
            var resultDataObjectId = model.oData.ResultDataObjectId;
            var settingsModel = this.getModel("settingsModel");
            var enableSettingResult = this.getProperty("enableSettingResult");
            var resultEnum = settingsModel.oData.results.resultsEnumration;
            if (resultDataObjectId !== Constants.NO_RESULT || resultDataObjectId !== "") {
                resultEnum.splice(0, 1);
                settingsModel.oData.results.resultsEnumration = resultEnum;
            }
			var resultText = model.oData && model.oData.ResultDataObjectLabel ? model.oData.ResultDataObjectLabel : model.oData.ResultDataObjectName;

            this.oResultInput = new Input({
                width: "220px",
                //enabled: "{settingsModel>/results/enabled}",
                //valueHelpOnly: true,
                showValueHelp: true,
                value: resultText,
				tooltip: this.oBundle.getText("chooseResultTooltip"),
                valueHelpRequest: function (oEvent) {

                    var oInputSource = oEvent.getSource();
                    var _displayModel = this.getModel();
                    var modelData = _displayModel.getData();

                    var _handleValueHelpOpen = function () {

                        var _handleSearch = function _handleSearch(evt) {
                            var sValue = evt.getParameter("value");
                            var oFilter = new Filter(
                                "name",
                                FilterOperator.Contains, sValue
                            );
                            evt.getSource().getBinding("items").filter([oFilter]);
                        };

                        this.oSelectDialog = new SelectDialog({
                            title: this.oBundle.getText("chooseResultDialogTitle"),
                            styleClass: "sapUiPopupWithPadding",
                            rememberSelections: true,
                            items: {
                                path: "settingsModel>/results/resultsEnumration",
                                //sorter: { path: 'name' },
                                template: new StandardListItem({
                                    title: "{settingsModel>label}",
                                    description: "{settingsModel>description}"
                                })
                            },
                            search: _handleSearch,
                            liveChange: _handleSearch,
                            confirm: function (evt) {
                                var oSelectedItem = evt.getParameter("selectedItem");
                                var oSelectedContexts = evt.getParameter("selectedContexts");

                                if (oSelectedItem) {
                                    var newResultObjID = oSelectedContexts[0].getProperty().id;
                                    oInputSource.setSelectedKey(newResultObjID);
                                    model = this.getModel();
                                    model.oData.ResultDataObjectId = newResultObjID;
                                    model.oData.ResultDataObjectName = oSelectedContexts[0].getProperty().name;
									model.oData.ResultDataObjectLabel = oSelectedContexts[0].getProperty().label;

                                    var settingsModelWithDataObjectInfo = this.getModel("settingsModel");
                                    settingsModelWithDataObjectInfo.setProperty("/resultDataObjectChanged", true);
                                    //reset attribute sequence array and sequence boolean value when data object changes 
                                    settingsModelWithDataObjectInfo.setProperty("/resultAttributeSequenceChanged", false);
                                    settingsModelWithDataObjectInfo.attributeSequenceArray = [];
                                    //reset the predefined results json if the data object changes
                                    settingsModelWithDataObjectInfo.oData.predefinedResults = [];

                                    if (this.needToRenderPredefinedResultsTable) {
                                        this._createPredefinedResultsTable();
                                    }

                                    //Update flag of result change
                                    if (!modelData.ResultDataObjectStatus) {
                                        modelData.ResultDataObjectStatus = "U";
                                        //If same ResultDataObject selected, no updates to refresh button
                                        if (modelData.ResultDataObjectId != oSelectedItem.getInfo()) {
                                            this._updateRefreshFlags(false, false, false);
                                        }
                                    }
                                }
                                evt.getSource().getBinding("items").filter([]);
                                if (this.oSelectDialog && this.oSelectDialog._oDialog) {
                                    this.oSelectDialog._oDialog.destroy();
                                    this.oSelectDialog = null;
                                }

                            }.bind(this),
                            cancel: function (evt) {
                                if (this.oSelectDialog && this.oSelectDialog._oDialog) {
                                    this.oSelectDialog._oDialog.destroy();
                                    this.oSelectDialog = null;
                                }
                                this.oSelectDialog = null;
                            }.bind(this)
                        });
                        this.oSelectDialog.setModel(this.oResultInput.getModel("settingsModel"), "settingsModel");
                        this.oSelectDialog.open();

                    }.bind(this);

                    function _openChangeResultWarningMessage() {
                        MessageBox.warning(
                            this.oBundle.getText("changeResultWarningMsg"), {
                                title: this.oBundle.getText("changeResultWarningTitle"),
                                actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                                onClose: function (oAction) {
                                    if (oAction === MessageBox.Action.OK) {
                                        _handleValueHelpOpen();
                                    }
                                }
                            }
                        );
                    }

                    // check when to raise warning message popup before opening VH popup
                    if (modelData.ResultDataObjectStatus) {
                        _handleValueHelpOpen();
                    } else if (this.getProperty("newDecisionTable")) {
                        modelData.ResultDataObjectStatus = "C";
                        _handleValueHelpOpen();
                    } else {
                        _openChangeResultWarningMessage.call(this);
                    }

                }.bind(this)
            });
            
            if(enableSettingResult) {
            	this.oResultInput.bindAggregation("suggestionItems",{
            		path: "settingsModel>/results/resultsEnumration",
            		template: new Item({
                        key: "{settingsModel>id}",
                        text: "{settingsModel>label}"
                    	})
		});
		this.oResultInput.setSelectedKey(this.getModel().getData().ResultDataObjectId);
            	this.oResultInput.setEnabled(enableSettingResult);
            } else {
            	this.oResultInput.setEnabled(enableSettingResult);
            }

            return this.oResultInput;
        };

        oDecisionTableSettings.prototype._destroyElement = function (element) {
            var elementToDestroy = Element.getElementById(element);
            if (elementToDestroy) {
                if (element === "idPredefinedTable") {
                    elementToDestroy.destroyColumns();
                }
                elementToDestroy.destroy();
            }
        };

        /*function to find if an attribute is deleted and then remove the attribute from JSON and OdatModel
        we will also have to ensure that the sequence is maintained after deletion*/
        oDecisionTableSettings.prototype._findAndRemoveDeletedAttributeFromOModel = function () {
            var _oSettingsModel = this.getModel("settingsModel");
            var jsonArrayWithExistingValues = _oSettingsModel.oData.predefinedResults;

            for (var entry in jsonArrayWithExistingValues) {
                var predefinedResultsArray = _oSettingsModel.oData.predefinedResults;
                var tempPredefinedResultsArray = [];
                var deletedAttributeID = "";
                if (!jsonArrayWithExistingValues[entry].AttributeInBackend) {
                    //remove the entry from the json
                    deletedAttributeID = entry;
                    for (var attr in predefinedResultsArray) {
                        if (attr === deletedAttributeID) {
                            continue;
                        } else {
                            tempPredefinedResultsArray[attr] = {};
                            tempPredefinedResultsArray[attr].AccessMode = predefinedResultsArray[attr].AccessMode;
                            tempPredefinedResultsArray[attr].Expression = predefinedResultsArray[attr].Expression;
                        }
                    }
                }

                //get the sequence of the column and remove it from the omodel
                var odataModel = this.getModel();
                var columns = odataModel.oData.DecisionTable.DecisionTableColumns.results;
                for (var col = 0; col < columns.length; col++) {
                    //check only in case of the result columns
                    if (columns[col].Result && columns[col].Result.DataObjectAttributeId === deletedAttributeID) {
                        this.sequenceOfAttributeDeleted = columns[col].Sequence;
                        this._removeColumnFromJsonModel(this.sequenceOfAttributeDeleted, "C");
                    }
                }
            }
        };

        oDecisionTableSettings.prototype._findPropertyAccessMode = function () {
            var dtPropertyList = this.oModels.oDataModel.oServiceData.oMetadata.mEntityTypes["/DecisionTableColumnResults"].property;
            if (dtPropertyList) {
                for (var nPropertyPos = 0; nPropertyPos < dtPropertyList.length; nPropertyPos++) {
                    if (dtPropertyList[nPropertyPos].name === Constants.KEY_ACCESSMODE) {
                        return true;
                    }
                }
                return false;
            }
        };

        //AST expression basic control for condition table
        oDecisionTableSettings.prototype._getASTExpressionBasicForCondition = function (oContext) {
            var that = this;
            var oAstExpressionLanguage = Element.getElementById(this.getAstExpressionLanguage());
            var sExpression = oContext.getProperty("Condition/Expression");
            var displayExpression = this._getExpressionFromAstNodes(oContext);

            if(displayExpression && displayExpression.relString) {
                displayExpression.relString = displayExpression.relString.replace(/\\/g,"\\\\").replace(/{/g, "\\{").replace(/}/g, "\\}");
            }
            

            var astExpressionBasic = new AstExpressionBasic({
                astExpressionLanguage: oAstExpressionLanguage,
                value: displayExpression.relString ? displayExpression.relString : "",
                placeholder: this.oBundle.getText("expressionPlaceHolder"),
                valueState: displayExpression.valueState,
                jsonData: displayExpression.JSON,
                change: function (oEvent) {
                    var oSource = oEvent.getSource();
                    oContext = oSource.getBindingContext();
                    var sPath = oContext.getPath();
                    var astNodes = oEvent.getParameter("astNodes");   
                    var stringValue = oEvent.getParameter("newValue");
                    if (astNodes && astNodes.length === 1 && astNodes[0].Type === "I" && astNodes[0].Value && astNodes[0].Value !== "") {
                        oSource.setValueState("Error");
                    } else {
                        oSource.setValueState("None");
                    }
                    var model = oContext.getModel();
                    var bValueOnly = oContext.getProperty("Condition/ValueOnly");
                    var modifiedNodes = that._getASTNodes(astNodes, oContext);
                    model.setProperty(sPath + "/Condition/ASTNodes", modifiedNodes);
                    //model.setProperty(sPath + "/Condition/Expression", astExpressionBasic._input.text());
                    that._setExpressionRelevantOperators(stringValue, oContext.getProperty("Condition/Id"), bValueOnly, astExpressionBasic);
                    if (modifiedNodes.length === 1 && modifiedNodes[0].Value === "") {
                        model.setProperty(sPath + "/Condition/FixedOperator", "");
                        model.setProperty(sPath + "/Condition/ASTNodes", []);
                    }
                    //Mark column as "Updated"
                    that._changeColumnStatusToUpdate(oContext);
                    oSource._validateControl();
                }.bind(this)
            }).setBindingContext(oContext);
            this._setExpressionRelevantOperators(displayExpression.relString, oContext.getProperty("Condition/Id"), oContext.getProperty(
                "Condition/ValueOnly"), astExpressionBasic);
            if(document.getElementById("content")&& document.getElementById("content").classList &&
            		document.getElementById("content").classList.length>0 && 
            		isCompactClassPresent(document.getElementById("content").classList)){
            	astExpressionBasic.addStyleClass("sapRULDecisionTableSettingsAstExpressionCompactSize");
            } else {
            	astExpressionBasic.addStyleClass("sapRULDecisionTableSettingsAstExpressionCozySize");
            }
            function isCompactClassPresent(List){
            	for(var i=0;i< List.length;i++) {
            		if (List[i] === "sapUiSizeCompact") {
            			return true;
            		}
            	}
            	return false;
            };
            //astExpressionBasic.addStyleClass("sapRULDecisionTableSettingsAstExpression");
            return astExpressionBasic;
        };

        //AST expression basic control for predefined table
        oDecisionTableSettings.prototype._getASTExpressionBasicForPredefined = function (oContext, expressionID, expression,
            businessDataType, astNodes) {
            var that = this;
            var sAttributeId = "";

            var oResultData = oContext.getObject(oContext.getPath());
            if (oResultData && !sAttributeId) {
                sAttributeId = oResultData.DataObjectAttributeId ? oResultData.DataObjectAttributeId : oResultData.Id;
            } else if (oContext.DataObjectAttributeinfo) {
                sAttributeId = oContext.DataObjectAttributeinfo.Id;
            }
            if (sAttributeId) {
                expression = this._getExpressionFromAstNodes(oContext, astNodes);
                var resultDataObjectId = this.getModel().oData.ResultDataObjectId
                this.attributeInfo = "/" + resultDataObjectId + "/" + this._formatAttributeId(sAttributeId);
            }

            if(expression && expression.relString) {
                expression.relString = expression.relString.replace(/\\/g,"\\\\").replace(/{/g, "\\{").replace(/}/g, "\\}");
            }
            var oAstExpressionLanguage = Element.getElementById(this.getAstExpressionLanguage());
            var sbusinessDataType = businessDataType ? businessDataType : library.ExpressionType.NonComparison;
            var astExpressionBasic = new AstExpressionBasic({
                id: expressionID,
                astExpressionLanguage: oAstExpressionLanguage,
                value: expression.relString ? expression.relString : "",
                jsonData: expression.JSON,
                attributeInfo: this.attributeInfo,
                placeholder: this.oBundle.getText("expressionPlaceHolder"),
                valueState: expression.valueState,
                change: function (oEvent) {
                    that.expressionControl = oEvent.getSource();
                    var astNodes = oEvent.getParameter("astNodes");
                    var model = oContext.getModel();
                    var sPath = oContext.getPath();
                    var sValue = oEvent.getParameter("newValue");
                    var modifiedNodes = that._getASTNodes(astNodes, oContext);
                    if (modifiedNodes && modifiedNodes.length === 1 && modifiedNodes[0].Type === "I" && modifiedNodes[0].Value !== "") {
                        that.expressionControl.setValueState("Error");
                    } else {
                        that.expressionControl.setValueState("None");
                    }
                    that.getModel("settingsModel").setProperty("/resultAttributeChanged", true);
                    that._updateResultAttributeJSON(oContext, null, null, modifiedNodes, false, false, false);
                    that.expressionControl._validateControl();
                }.bind(this)
            }).setBindingContext(oContext);

            return astExpressionBasic;
        };
        
        //Parses the nodes generated from astEL to form understandable by backend
        oDecisionTableSettings.prototype._getASTNodes = function (astNodes, oContext) {
            var modifiedNodes = []
            for (var node in astNodes) {
                var updatedAstNode = {};
                if (astNodes[node].Root) {
                    updatedAstNode.Sequence = 1;
                    updatedAstNode.Root = true;
                } else {
                    updatedAstNode.Sequence = astNodes[node].SequenceNumber;
                    updatedAstNode.ParentId = astNodes[node].ParentId;
                }
                if (astNodes[node].Function) {
                    updatedAstNode.Function = astNodes[node].Function ? astNodes[node].Function : "";
                }
                if (astNodes[node].Type !== "P" && astNodes[node].Type !== "O" && !astNodes[node].Function) {
                    updatedAstNode.BusinessDataType = astNodes[node].Output ? astNodes[node].Output.BusinessDataType : astNodes[node].BusinessDataType;
                    updatedAstNode.DataObjectType = astNodes[node].Output ? astNodes[node].Output.DataObjectType : astNodes[node].DataObjectType;
                    updatedAstNode.Value = astNodes[node].Value ? astNodes[node].Value : "";
                } else if (astNodes[node].Type === "O") {
                    updatedAstNode.Reference = astNodes[node].Reference;
                } if (astNodes[node].Type === "I") {
                    updatedAstNode.IncompleteExpression = astNodes[node].Value;
                }

                updatedAstNode.NodeId = astNodes[node].Id;
                updatedAstNode.Type = astNodes[node].Type;
                updatedAstNode.RuleId = oContext.getProperty("RuleId") ? oContext.getProperty("RuleId") : this.getModel().getData().DecisionTable
                        .RuleId;
                updatedAstNode.Version = oContext.getProperty("Version") ? oContext.getProperty("Version") : this.getModel().getData().DecisionTable
                        .Version;
                updatedAstNode.Id = oContext.getProperty("Id");
                modifiedNodes.push(updatedAstNode);
            }
            return modifiedNodes;
        };

        oDecisionTableSettings.prototype._getBindModelName = function () {
            var path = "";
            var modelName = this.getModelName();
            if (modelName) {
                path = modelName + ">";
            }
            return path;
        };

        oDecisionTableSettings.prototype._getCellFormat = function () {
            //Handling the valueOnly when the DecisionTableFormat is set to RuleFormat
            //var sCellFormat = this.getProperty("cellFormat");
            var sdecisionTableFormat = this.getProperty("decisionTableFormat");
            if (sdecisionTableFormat === library.DecisionTableFormat.RuleFormat) {
                return (this.getModel().getData().RuleFormat === library.RuleFormat.Basic) ? true : false;
            }
            //return (sCellFormat !== library.DecisionTableCellFormat.Text) ? true : false;
        };

        //structure definition for the visibility of columns. This will be a part of the settings model
        oDecisionTableSettings.prototype._getCellFormatAcccessOptions = function () {
            //var sCellFormat = this.getProperty("cellFormat");
            var oCellFormatData = {
                //CellFormat: sCellFormat,
                cellFormatEnumration: [{
                    key: Constants.KEY_EDITABLE,
                    value: this.editableModeText
                }, {
                    key: Constants.KEY_HIDDEN,
                    value: this.hiddenModeText
                }]
            };
            return oCellFormatData;
        };

        /*oDecisionTableSettings.prototype._getCellFormatData = function () {
            var sCellFormat = this.getProperty("cellFormat");
            var oCellFormatData = {
                CellFormat: sCellFormat,
                cellFormatEnumration: [{
                    key: this.oBundle.getText("advancedMode"),
                    value: this.oBundle.getText("advancedMode")
                }, {
                    key: this.oBundle.getText("valueOnly"),
                    value: this.oBundle.getText("valueOnly")
                }]
            };
            return oCellFormatData;
        };*/

        oDecisionTableSettings.prototype._getColumnInputMode = function (bValueOnly) {
            if (!bValueOnly) {
                return this.oBundle.getText("advancedMode");
            }
            return (this.oBundle.getText("valueOnly"));
        };

        //REL control for condition table
        oDecisionTableSettings.prototype._getExpressionAdvanceColumn = function (oBindingContext) {
            var oExpressionLanguage = Element.getElementById(this.getExpressionLanguage());

            return new ExpressionAdvanced({
                expressionLanguage: oExpressionLanguage,
                placeholder: this.oBundle.getText("expressionPlaceHolder"),
                validateOnLoad: true,
                type: library.ExpressionType.NonComparison,
                value: {
                    path: "Condition/Expression",
                    events: {
                        change: function (oEvent) {
                            var oSource = oEvent.getSource();
                            var oContext = oSource.getContext();
                            var colId = oContext.getProperty("Id");
                            var bValueOnly = oContext.getProperty("Condition/ValueOnly");

                            //Set only relevant operators in the drop-down (relevant to the expression)
                            this._setExpressionRelevantOperators(oSource.getValue(), colId, bValueOnly);
                        }.bind(this)
                    }
                },
                enabled: true,
                change: function (oEvent) {
                    var oSource = oEvent.getSource();
                    var oContext = oSource.getBindingContext();
                    var colId = oContext.getProperty("Id");
                    var model = oContext.getModel();
                    var bValueOnly = oContext.getProperty("Condition/ValueOnly");
                    // removes an extra space at the end of the condition (if any)
                    var sConditionExpression = oSource.getValue().replace(/\s*$/, "");
                    // values are not sent immediately to BE.Hence, we need to set the value for later use
                    oSource.setValue(sConditionExpression);
                    //Set only relevant operators in the drop-down (relevant to the expression)
                    this._setExpressionRelevantOperators(sConditionExpression, colId, bValueOnly);
                    //Mark column as "Updated"
                    this._changeColumnStatusToUpdate(oContext);
                    // clear previous fixed operator if expression is empty
                    var expression = oContext.getProperty("Condition/Expression");
                    if (!expression) {
                        model.setProperty(oContext.getPath() + "/Condition/FixedOperator", "");
                    }
                }.bind(this)
            });
        };

        oDecisionTableSettings.prototype._getExpressionFieldForCondition = function (oContext) {
            var oControl;
            //Check expressionlanguage type
            if (this.getExpressionLanguage()) {
                oControl = this._getExpressionAdvanceColumn(oContext);
            } else {
                oControl = this._getASTExpressionBasicForCondition(oContext);
            }
            return oControl;
        };

        oDecisionTableSettings.prototype._getExpressionFieldForPredefined = function (oContext, expressionID, expression,
            businessDataType, astNodes) {
            var oControl;
            //Check expressionlanguage type
            if (this.getExpressionLanguage()) {
                oControl = this._getPredefinedExpressionAdvanced(oContext, expressionID, expression, businessDataType);
            } else {
                oControl = this._getASTExpressionBasicForPredefined(oContext, expressionID, expression, businessDataType, astNodes);
            }
            return oControl;
        };

        oDecisionTableSettings.prototype._getExpressionFromAstNodes = function (oContext, astNodes) {
            var that = this;
            var oAstExpressionLanguage = Element.getElementById(this.getAstExpressionLanguage());
            var termsProvider = oAstExpressionLanguage._astBunldeInstance.TermsProvider.TermsProvider;
            var displayExpression = "";
            var displayTermExpression = "";
            var astList = [];
            var sPath = oContext.getPath();
            var oData = oContext.getObject(sPath);
            if (oData && oData.Type === "CONDITION") {
               astList = oData.Condition.ASTNodes ? oData.Condition.ASTNodes : oData.Condition.DecisionTableColumnConditionASTs;
            } else if (oData && oData.Type === "RESULT") {
                astList = oData.Result.DecisionTableColumnResultASTs;
            } else {
                //When Refresh or Result is changed -  for predefined
                astList = astNodes;
            }
            var oAstUtil = oAstExpressionLanguage._astBunldeInstance.ASTUtil;
            oAstUtil.clearNodes();
            astList = astList && astList.results ? astList.results : astList;
            if (astList && astList.length > 0) {
                for (var entry in astList) {
                    this._addNodeObject(astList[entry]);
                }
                var astNodes = oAstUtil.getNodes();
                displayExpression = oAstUtil.toAstExpressionString(astNodes);
                if (astNodes && astNodes.length === 1 && astNodes[0].Type === "I" && astNodes[0].Value && astNodes[0].Value !== "") {
                    displayExpression.valueState = "Error";
                } else {
                    displayExpression.valueState = "None";
                }
            }
            return displayExpression;
        };

        oDecisionTableSettings.prototype._getFixedOperatorDataForExpression = function (sExpression, bValueOnly, astControl) {
            var fixOperatorEnabled = sExpression ? true : false;
            var fixedOperatorData = {
                fixOperatorEnumration: [{
                    key: "",
                    value: "None"
                }],
                fixOperatorEnabled: fixOperatorEnabled
            };
            var oSuggestions = [];
            if (this.getExpressionLanguage() && fixOperatorEnabled) {
                var oExpressionLanguage = Element.getElementById(this.getExpressionLanguage());
                var oFilter;
                if (!bValueOnly) {
                    oFilter = [{
                        tokenType: library.ExpressionTokenType.reservedWord,
                        tokenCategory: library.ExpressionCategory.comparisonOp
                    }, {
                        tokenType: library.ExpressionTokenType.reservedWord,
                        tokenCategory: library.ExpressionCategory.comparisonBetweenOp
                    }, {
                        tokenType: library.ExpressionTokenType.reservedWord,
                        tokenCategory: library.ExpressionCategory.comparisonExistOp
                    }];
                } else {
                    oFilter = [{
                        tokenType: library.ExpressionTokenType.reservedWord,
                        tokenCategory: library.ExpressionCategory.comparisonOp
                    }, {
                        tokenType: library.ExpressionTokenType.reservedWord,
                        tokenCategory: library.ExpressionCategory.comparisonBetweenOp
                    }];
                }

                oSuggestions = oExpressionLanguage.getSuggestionsByCategories(sExpression, oFilter);
                for (var i = 0; i < oSuggestions.length; i++) {
                    fixedOperatorData.fixOperatorEnumration.push({
                        key: oSuggestions[i].text,
                        value: oSuggestions[i].text
                    });
                }
            } else if (this.getAstExpressionLanguage() && sExpression && sExpression !== "") {
                oSuggestions = astControl._getSuggestionsForTheGivenInput(sExpression).autoComplete.categories.operators;
                if (oSuggestions) {                    
                    if (oSuggestions.comparision && oSuggestions.comparision.length > 0) {
                        var comparisionOperators = oSuggestions.comparision;
                        for (var i = 0; i < comparisionOperators.length; i++) {
                            fixedOperatorData.fixOperatorEnumration.push({
                                key: comparisionOperators[i].name,
                                value: comparisionOperators[i].label
                            });
                        }
                    }
                    if (oSuggestions.logical && oSuggestions.logical.length > 0) {
                        var logicalOperators = oSuggestions.logical;
                        for (var i = 0; i < logicalOperators.length; i++) {
                            fixedOperatorData.fixOperatorEnumration.push({
                                key: logicalOperators[i].name,
                                value: logicalOperators[i].label
                            });
                        }
                    }
                    if (oSuggestions.array && oSuggestions.array.length > 0) {
                        var arrayOperators = oSuggestions.array;
                        for (var i = 0; i < arrayOperators.length; i++) {
                            fixedOperatorData.fixOperatorEnumration.push({
                                key: arrayOperators[i].name,
                                value: arrayOperators[i].label
                            });
                        }
                    }
                    if (oSuggestions.range && oSuggestions.range.length > 0) {
                        var rangeOperators = oSuggestions.range;
                        for (var i = 0; i < rangeOperators.length; i++) {
                            fixedOperatorData.fixOperatorEnumration.push({
                                key: rangeOperators[i].name,
                                value: rangeOperators[i].label
                            });
                        }
                    }
                    if (oSuggestions.miscellaneous && oSuggestions.miscellaneous.length > 0) {
                        var miscellaneousOperators = oSuggestions.miscellaneous;
                        for (var i = 0; i < miscellaneousOperators.length; i++) {
                            fixedOperatorData.fixOperatorEnumration.push({
                                key: miscellaneousOperators[i].name,
                                value: miscellaneousOperators[i].label
                            });
                        }
                    }
                    if (oSuggestions.functional && oSuggestions.functional.length > 0) {
                        var functionalOperators = oSuggestions.functional;
                        for (var i = 0; i < functionalOperators.length; i++) {
                            fixedOperatorData.fixOperatorEnumration.push({
                                key: functionalOperators[i].name,
                                value: functionalOperators[i].label
                            });
                        }
                    }
                }
            }
            return fixedOperatorData;
        };

        oDecisionTableSettings.prototype._getHitPoliciesData = function () {
            var hitPolicy = this.getProperty("hitPolicies");
            var length = hitPolicy.length;
            var oHitPolicyData = {
                hitPolicyEnumration: []
            };
            for (var i = 0; i < length; i++) {
                oHitPolicyData.hitPolicyEnumration.push({
                    key: hitPolicy[i],
                    text: this.oBundle.getText(hitPolicy[i])
                });
            }
            oHitPolicyData.enabled = length > 1 ? true : false;
            return oHitPolicyData;
        };

        /*oDecisionTableSettings.prototype._getInputModeEnabled = function (sCellFormat, bValueOnly) {
            if (sCellFormat !== library.DecisionTableCellFormat.Both || bValueOnly === false) {
                return false;
            }
            return true;
        };*/

        //Rebinding predefined table when result is change or refresh event
        oDecisionTableSettings.prototype._getLatestResultDataObjects = function (newResultDataObjectId) {
            var that = this;
            var oModel = that.getModel().getData();
            var sProjectId = oModel.ProjectId;
            var settingsModel = that.getModel("settingsModel");
            var oExpressionLanguage;
            if (this.getExpressionLanguage()) {
                oExpressionLanguage = Element.getElementById(this.getExpressionLanguage());
            } else {
                oExpressionLanguage = Element.getElementById(this.getAstExpressionLanguage());
            }
            var vocabularyModel = new ODataModel(oExpressionLanguage.getModel().sServiceUrl);
            var sPath = "/DataObjects(VocabularyId='" + sProjectId + "',Id='" + newResultDataObjectId + "')";
            //Resetting the path before reusing the factory function to load predefined results table
            // Error mentioned in the CSN : 1880262342
            /*that.oColAccessTable.mBindingInfos.items.path = sdataAttributesPath;
            that.oColAccessTable.setNoDataText(that.oBundle.getText("noData"));*/
            that._bindPredefinedTable(sPath, "/ExpandedAttributes");
            that.oPredefinedTable.setBusyIndicatorDelay(0);
            return that.oPredefinedTable;
        };

        oDecisionTableSettings.prototype._getMessageByResultUpdates = function (resultUpdates) {
            var messageRefreshWillDelete = this.oBundle.getText("refreshingWillDeleteMsg");
            var messageAreyouSure = this.oBundle.getText("refreshAreyouSureMsg");
            var countChanges = resultUpdates.addedColumns.length + resultUpdates.changedColumns.length + resultUpdates.removedColumns.length;
            if (countChanges != 0) {
                var quoted = function (str) {
                    return "'" + str + "'";
                };
                var addedColumnsString = (resultUpdates.addedColumns.length == 0) ? "" : this.oBundle.getText("columnsWereAdded", resultUpdates.addedColumns
                    .map(quoted).toString());
                var changedColumnsString = (resultUpdates.changedColumns.length == 0) ? "" : this.oBundle.getText("columnsWereChanged", resultUpdates
                    .changedColumns.map(quoted).toString());
                var removedColumnsString = (resultUpdates.removedColumns.length == 0) ? "" : this.oBundle.getText("columnsWereRemoved", resultUpdates
                    .removedColumns.map(quoted).toString());
                var dialogStatisticsMessage = addedColumnsString + changedColumnsString + removedColumnsString + ((resultUpdates.removedColumns.length ==
                    0) ? "" : messageRefreshWillDelete) + messageAreyouSure;
                this.getModel("settingsModel").setProperty("/refreshButtonEnabled", true, null, true);
                return dialogStatisticsMessage;
            } else {
                this.getModel("settingsModel").setProperty("/refreshButtonEnabled", false, null, true);
            }
            return null;
        };

        //REL control for predefined
        oDecisionTableSettings.prototype._getPredefinedExpressionAdvanced = function (oContext, expressionID, expression,
            businessDataType) {
            var that = this;
            var sAttributeId = "";
            var oResultData = oContext.getObject(oContext.getPath());
            if (oResultData && !sAttributeId) {
                sAttributeId = oResultData.DataObjectAttributeId ? oResultData.DataObjectAttributeId : oResultData.Id;
            }
            var oExpressionLanguage = Element.getElementById(this.getExpressionLanguage());
            var sbusinessDataType = businessDataType ? businessDataType : library.ExpressionType.NonComparison;

            return new ExpressionAdvanced({
                expressionLanguage: oExpressionLanguage,
                placeholder: this.oBundle.getText("expressionPlaceHolder"),
                validateOnLoad: true,
                id: expressionID,
                type: sbusinessDataType,
                value: expression,
                editable: true,
                attributeInfo: sAttributeId,
                change: function (oEvent) {
                    that.expressionControl = oEvent.getSource();
                    this.getModel("settingsModel").setProperty("/resultAttributeChanged", true);
                    this._updateResultAttributeJSON(oContext, null, that.expressionControl.getValue(), null, false, false, false);
                }.bind(this)
            });
        };

        oDecisionTableSettings.prototype._getResultsData = function () {
            var oExpressionLanguage;
            if (this.getAstExpressionLanguage()) {
                oExpressionLanguage = Element.getElementById(this.getAstExpressionLanguage());
            } else {
                oExpressionLanguage = Element.getElementById(this.getExpressionLanguage());
            }
            var oResultsEnumration = [{
                id: Constants.NO_RESULT,
                name: "",
				label: ""
            }];
            oResultsEnumration = oResultsEnumration.concat(oExpressionLanguage.getResults());
            var oResultsData = {
                resultsEnumration: oResultsEnumration
            };
            return oResultsData;
        };

        oDecisionTableSettings.prototype._getResultsUpdates = function (resultColumnsOld, resultColumnsNew) {
            var addedColumns = [],
                removedColumns = [],
                changedColumns = [];
            var i = 0,
                j = 0;
            for (i = 0; i < resultColumnsOld.length; i++) {
                var columnExist = false;
                for (j = 0; j < resultColumnsNew.length; j++) {
                    //Uriel: I compare to name instead of ID until team2 bug fix, then I'll use the commented condition.
                    //if (resultColumnsNew[j].id === resultColumnsOld[i].Result.DataObjectAttributeId){
                    if (resultColumnsNew[j].name === resultColumnsOld[i].Result.DataObjectAttributeName) {
                        columnExist = true;
                        if ((resultColumnsNew[j].businessDataType !== resultColumnsOld[i].Result.BusinessDataType) ||
                            (resultColumnsNew[j].name !== resultColumnsOld[i].Result.DataObjectAttributeName)) {
                            changedColumns.push(resultColumnsOld[i].Result.DataObjectAttributeName);
                        }
                    }
                }
                if (!columnExist) {
                    removedColumns.push(resultColumnsOld[i].Result.DataObjectAttributeName);
                }
                columnExist = false;
            }

            for (j = 0; j < resultColumnsNew.length; j++) {
                var currentVocabularyColumnFoundInRule = false;
                for (i = 0; i < resultColumnsOld.length; i++) {
                    //Uriel: I compare to name instead of ID until team2 bug fix, then I'll use the commented condition.
                    //if (resultColumnsNew[j].id === resultColumnsOld[i].Result.DataObjectAttributeId){
                    if (resultColumnsNew[j].name === resultColumnsOld[i].Result.DataObjectAttributeName) {
                        currentVocabularyColumnFoundInRule = true;
                    }
                }
                if (!currentVocabularyColumnFoundInRule) {
                    addedColumns.push(resultColumnsNew[j].name);
                }
                currentVocabularyColumnFoundInRule = false;
            }
            return {
                addedColumns: addedColumns,
                changedColumns: changedColumns,
                removedColumns: removedColumns
            };
        };

        //Read the existing visibility status from Odata
        oDecisionTableSettings.prototype._getSelectedVisibilityStatus = function (sAccess) {
            if (sAccess === this.hiddenModeText) {
                return Constants.KEY_HIDDEN;
            } else {
                return Constants.KEY_EDITABLE;
            }
        };

        oDecisionTableSettings.prototype._initServiceModel = function () {
            var odataModel = this.getModel("oDataModel");
            var sServiceURL = odataModel.sServiceUrl;
            var oModel = new ODataModel({
                serviceUrl: sServiceURL,
                defaultBindingMode: BindingMode.TwoWay
            });
            var model = oModel.getMetaModel();
            if (model && model.oMetadata && model.oMetadata.bLoaded) {
                var serviceNameSpace = model.oMetadata.oMetadata.dataServices.schema[0].namespace;
                var predefinedEntitySetMap = serviceNameSpace + "." + Constants.PREDEFINED_RESULT;
                if (model.oMetadata && model.oMetadata._entitySetMap && model.oMetadata._entitySetMap[predefinedEntitySetMap]) {
                    this.needToRenderPredefinedResultsTable = true;
                }
            }
        };

        oDecisionTableSettings.prototype._initSettingsModel = function () {
            var initialData = {};
            initialData.hitPolicy = this._getHitPoliciesData();
            initialData.tableData = {};
            initialData.removeRowEnabled = false;
            //initialData.cellFormat = this._getCellFormatData();
            initialData.accessOptions = this._getCellFormatAcccessOptions();
            initialData.updateAllRows = false;
            initialData.predefinedResults = [];
            initialData.resultDataObjectChanged = false;
            initialData.resultAttributeChanged = false;
            initialData.refreshButtonClicked = false;
            initialData.results = this._getResultsData();
            this._internalModel = new JSONModel(initialData);
            this.setModel(this._internalModel, "settingsModel");
            this._initServiceModel();
        };

        oDecisionTableSettings.prototype._openWarningDialog = function (oSelect, oContext) {
            var dialog = new Dialog({
                title: this.oBundle.getText("changeInputModeDialogTitle"),
                width: "70%",
                type: 'Message',
                state: 'Warning',
                content: new Text({
                    text: this.oBundle.getText("changeInputModeDialogDescription")
                }),
                beginButton: new Button({
                    text: this.oBundle.getText("okBtn"),
                    press: function () {
                        dialog.close();
                        dialog.destroy();
                        this._changeInputMode(true, oSelect, oContext);
                    }.bind(this)
                }),
                endButton: new Button({
                    text: this.oBundle.getText("cancelBtn"),
                    press: function () {
                        dialog.close();
                        dialog.destroy();
                        this._changeInputMode(false, oSelect, oContext);
                    }.bind(this)
                }),
                afterClose: function () {
                    dialog.close();
                    dialog.destroy();
                }
            });

            dialog.open();
        };

        // Factory function to display and control access options column
        oDecisionTableSettings.prototype._predefinedFactory = function (sId, oContext) {
            //basic display of predefinedResults reads from oContext
            //colid is used only element. On refresh we wont get the Sequence, hence we use the name here
            var expressionID = "exp" + sId;
            var type = oContext.getProperty("Type");
            var astNodes = [];
            var label = oContext.getProperty("DataObjectAttributeLabel") || oContext.getProperty("Label") || (oContext.DataObjectAttributeinfo ? oContext.DataObjectAttributeinfo.Label : undefined);
            var name = oContext.getProperty("DataObjectAttributeName") || oContext.getProperty("Name") || (oContext.DataObjectAttributeinfo ? oContext.DataObjectAttributeinfo.Name : undefined);
            var displayText = label ? label : name;
            var attributeId = oContext.getProperty("DataObjectAttributeId") || oContext.getProperty("Id") || (oContext.DataObjectAttributeinfo ? oContext.DataObjectAttributeinfo.Id : undefined);
            var expression;
            var businessDataType = oContext.getProperty("BusinessDataType");
            var sSelectedKey;
            var aAttributeList = this._internalModel.getProperty("/predefinedResults");
			var bAttributeSequencechanged = this.getModel("settingsModel").getProperty("/resultAttributeSequenceChanged");
            var bResultDOChanged = this._internalModel.getProperty("/resultDataObjectChanged");
            var bRefreshClicked = this._internalModel.getProperty("/refreshButtonClicked");
            if (bResultDOChanged && !bAttributeSequencechanged) {
                this._updateResultAttributeJSON(oContext, Constants.EDITABLE, "", [], bResultDOChanged, bRefreshClicked, bAttributeSequencechanged);
                sSelectedKey = Constants.EDITABLE;
                expression = "";
            } else if (bRefreshClicked || bAttributeSequencechanged) {
                var predefinedAttributes = aAttributeList[attributeId];
                sSelectedKey = predefinedAttributes ? predefinedAttributes.AccessMode : Constants.EDITABLE;
                expression = predefinedAttributes ? predefinedAttributes.Expression : "";
                astNodes = predefinedAttributes ? predefinedAttributes.ASTNodes : [];
                this._updateResultAttributeJSON(oContext, sSelectedKey, expression, astNodes, bResultDOChanged, bRefreshClicked, bAttributeSequencechanged);
            } else {
                expression = oContext.getProperty("Expression");
                var astArray = oContext.getProperty("DecisionTableColumnResultASTs");
                for (var entry in astArray) {
                    astNodes.push(oContext.getProperty("/" + astArray[entry]));
                }
                sSelectedKey = oContext.getProperty("AccessMode");
                this._updateResultAttributeJSON(oContext, sSelectedKey, expression, astNodes, false, false, false);
            }

            var sAccessKey = this._getSelectedVisibilityStatus(sSelectedKey);

            return new ColumnListItem({
                visible: true,
                vAlign: coreLibrary.VerticalAlign.Middle,
                cells: [
                    new Label({
                        visible: true,
                        design: mobileLibrary.LabelDesign.Standard,
                        text: displayText,
                        labelFor: expressionID,
                        textAlign: coreLibrary.TextAlign.Begin,
                        textDirection: coreLibrary.TextDirection.Inherit
                    }),

                    new Select({
                        width: "65%",
                        id: "select" + sId,
                        items: {
                            path: "settingsModel>/accessOptions/cellFormatEnumration",
                            template: new Item({
                                key: "{settingsModel>key}",
                                text: "{settingsModel>value}"
                            })
                        },
                        selectedKey: sAccessKey,
                        enabled: true,
                        change: function (oEvent) {
                            this._setColumnAccessMode(oContext, oEvent);
                        }.bind(this)
                    }),

                    this._getExpressionFieldForPredefined(oContext, expressionID, expression, businessDataType, astNodes),

                    new HorizontalLayout({
                        content: [
                            new Button({
                                type: mobileLibrary.ButtonType.Transparent,
                                icon: "sap-icon://arrow-top",
                                visible: true,
                                press: function (oEvent) {
                                    this._moveAttributePosition(oContext, Constants.UP);
                                }.bind(this)
                            }).setTooltip(this.oBundle.getText("MoveResultAttributeUP")),
                            new Button({
                                type: mobileLibrary.ButtonType.Transparent,
                                icon: "sap-icon://arrow-bottom",
                                press: function (oEvent) {
                                    this._moveAttributePosition(oContext, Constants.DOWN);
                                }.bind(this)
                            }).setTooltip(this.oBundle.getText("MoveResultAttributeDown"))
                        ]
                    })
                ]
            });
        };

        oDecisionTableSettings.prototype._moveAttributePosition = function (oContext, sDirection) {
            var settingsModel = this.getModel("settingsModel");
            var settingsData = settingsModel.getData();
            var oModel = this.getModel().getData();
            var sProjectId = oModel.ProjectId;
            var attrIdTobeMoved = oContext.getProperty("DataObjectAttributeId") || oContext.getProperty("Id") || (oContext.DataObjectAttributeinfo ? oContext.DataObjectAttributeinfo.Id : undefined);
            var resultDataObjectId = this.getModel().getData().ResultDataObjectId;
            var attributeSequenceArray = [];
            /* if the result data object has changed, we reset the attribute sequence array.
               if the attribute sequence has changed after changing DataObject , we do not reset the attribute list
            */ 
            if (this.getModel("settingsModel").getData().resultDataObjectChanged && !this.getModel("settingsModel").getData().resultAttributeSequenceChanged){
                this.getModel("settingsModel").attributeSequenceArray = undefined;
            }
            var attributeSequenceArray = this.getModel("settingsModel").attributeSequenceArray;
            if (!attributeSequenceArray) {
                attributeSequenceArray = this._getAttributeSequenceArray();
            }
            if (attributeSequenceArray && attributeSequenceArray.length > 0) {
                var attributeCurrentPosition = attributeSequenceArray.indexOf(attrIdTobeMoved);
                var switchAttributePos = -1;
                if (sDirection === Constants.UP) {
                    switchAttributePos = attributeCurrentPosition === 0 ? 0 : attributeCurrentPosition - 1;
                } else {
                    switchAttributePos = attributeCurrentPosition === attributeSequenceArray.length ? attributeCurrentPosition : attributeCurrentPosition + 1;
                }
                this._internalModel.getProperty("/predefinedResults")[attributeSequenceArray[attributeCurrentPosition]].SequenceChanged = true;
                this._internalModel.getProperty("/predefinedResults")[attributeSequenceArray[attributeCurrentPosition]].NewSequence = switchAttributePos + 1;
                // TODO: Comment next two lines if you would like to handle sequence for specific attributes
                this._internalModel.getProperty("/predefinedResults")[attributeSequenceArray[switchAttributePos]].SequenceChanged = true;
                this._internalModel.getProperty("/predefinedResults")[attributeSequenceArray[switchAttributePos]].NewSequence = attributeCurrentPosition + 1;
                var temp = attributeSequenceArray[switchAttributePos];
                attributeSequenceArray[switchAttributePos] = attributeSequenceArray[attributeCurrentPosition];
                attributeSequenceArray[attributeCurrentPosition] = temp;
                this.getModel("settingsModel").attributeSequenceArray = attributeSequenceArray;
            }
            this.getModel("settingsModel").setProperty("/resultAttributeSequenceChanged", true);
            
            var sPath = "";
            if (this.getModel("settingsModel").getData().resultDataObjectChanged){
                var sPath = "/DataObjects(VocabularyId='" + sProjectId + "',Id='" + resultDataObjectId + "')";
                this._bindPredefinedTable(sPath, "/ExpandedAttributes");
            } else {
                var sPath = "/DecisionTable/DecisionTableColumns/results";
                this._bindPredefinedTable(sPath, "/DecisionTableColumnResults");
            }
            this.oPredefinedTable.setBusyIndicatorDelay(0);
        };

        oDecisionTableSettings.prototype._prepareNewRule = function () {
            this._updateDecisionTableHeader();
            this._createDefaultColumn();
			//Set default result only in case of ABAP
            if (!this.needToRenderPredefinedResultsTable) {
            	this._setDefaultResult();
            }
        };

        oDecisionTableSettings.prototype._removeColumnFromJsonModel = function (sequence, status) {
            var displayModel = this.getModel();
            var modelData = displayModel.getData();
            var aColumns = modelData.DecisionTable.DecisionTableColumns.results;
            //Add coulmn to deleted coulmn's array. But only in case it's not new
            if (!status || status !== "C") {
                //If deleted array doesn't exists, create it
                if (!modelData.DecisionTable.DecisionTableColumns.deleted) {
                    modelData.DecisionTable.DecisionTableColumns.deleted = [];
                }
                modelData.DecisionTable.DecisionTableColumns.deleted.push(aColumns[sequence - 1]);
            }
            //remove the column from column array
            aColumns.splice(sequence - 1, 1);
            //Decrease by 1 the 'sequence' of all the next lines
            for (var i = sequence - 1; i < aColumns.length; i++) {
                aColumns[i].Sequence--;
                //Mark column as updated only in case this isn't a new column (status "C")
                if (aColumns[i].Status && aColumns[i].Status === "C") {
                    continue;
                }
                aColumns[i].Status = "U";
            }
            //displayModel.setData(modelData);
            this._setDisplayModelData(modelData);
        };

        oDecisionTableSettings.prototype._ruleResultColumns = function () {
            var currentColumns = this.getModel().oData.DecisionTable.DecisionTableColumns.results;

            function isResult(currentColumn) {
                return currentColumn.Result != null;
            }
            return currentColumns.filter(isResult);
        };

        // if the user chooses the result col to be hidden, enable expression advanced or read from the existing Odata entry
        // if the user chooses the result col to be editable, diable expression advanced and make it available in decision table
        oDecisionTableSettings.prototype._setColumnAccessMode = function (oContext, oEvent) {
            this.enableAccessValue = !this.enableAccessValue;
            var cell = oEvent.oSource.sId.split("select")[1];
            var updateCellID = "exp" + cell;
            this.expressionControl = Element.getElementById(updateCellID);
            //var resultEntryNumber = oContext.getProperty("Sequence");
            //resultEntryNumber = resultEntryNumber - 1;
            this.getModel("settingsModel").setProperty("/resultAttributeChanged", true);
            var oSelect = oEvent.getSource();
            var SelectedMode = oSelect.getSelectedKey();
            if (this.expressionControl instanceof ExpressionAdvanced) {
                if (SelectedMode === Constants.KEY_HIDDEN) {
                	this.expressionControl.setValue("");
                    this._updateResultAttributeJSON(oContext, this.hiddenModeText, null, null, false, false, false);

                } else {
                    this.expressionControl.setValueStateText("");
                    this.expressionControl.addStyleClass("sapRULExpressionAdvancedResultTable");
                    this._updateResultAttributeJSON(oContext, this.editableModeText, null, null, false, false, false);
                }
            } else {
                if (SelectedMode === Constants.KEY_HIDDEN) {
		            this.expressionControl.setValue("");
                    this.expressionControl._input[0].textContent = "";
                    // publish event for choosing hidden
                    var expId = this.expressionControl.sId + "-input";
                    var obj = {
                        "expId": expId
                    };
                    
                    var oEventBus = EventBus.getInstance();
                    oEventBus.publish("sap.ui.rules", "_onHiddenSelected", obj);
                    this._updateResultAttributeJSON(oContext, Constants.HIDDEN, null, null, null, false, false, false);
                } else {
		            this.expressionControl._input[0].classList.remove("sapAstExpressionInputError");
                    this._updateResultAttributeJSON(oContext, this.editableModeText, null, null, false, false, false);
                }
            }
            this._internalModel.setProperty("/resultAttributeChanged", true); //TODO: check if this is needed sharvari
        };
        
        // Function to enable /disable Apply based on hidden attributes 
        oDecisionTableSettings.prototype._updateApplyBtnActions = function() {
            if (this._internalModel) {
                var predefinedResults = this._internalModel.oData.predefinedResults;
                var hiddenAttributeWithNoExpression = false;
                for (var attr in predefinedResults) {
                    if (predefinedResults[attr].AccessMode === Constants.HIDDEN) {
                    	if (this.getAstExpressionLanguage() && predefinedResults[attr].ASTExpressionCleared) {
                    		hiddenAttributeWithNoExpression = true;
                            break;
                    	} 
                    	if (this.getExpressionLanguage() && (predefinedResults[attr].ASTExpressionCleared || !predefinedResults[attr].Expression)) {
                    		hiddenAttributeWithNoExpression = true;
                    		break;
                    	}
                        
                    }
                }
                if (hiddenAttributeWithNoExpression) {
                    Element.getElementById("ApplyBtn").setEnabled(false);
                } else {
                    Element.getElementById("ApplyBtn").setEnabled(true);
                }
            }
        };

        oDecisionTableSettings.prototype._setDefaultResult = function () {
            var _displayModel = this.getModel();
            var modelData = _displayModel.getData();
            var resultsEnumration = this._internalModel.getData().results.resultsEnumration;
            // if results enum contains only 2 options (1. empty 2. result), set the result as the default rule result
            if (resultsEnumration.length === 2) {
                modelData.ResultDataObjectId = resultsEnumration[1].id;
                modelData.ResultDataObjectName = resultsEnumration[1].name;
				modelData.ResultDataObjectLabel = resultsEnumration[1].label ? resultsEnumration[1].label : resultsEnumration[1].name;
                modelData.ResultDataObjectStatus = "C";
            }
        };

        oDecisionTableSettings.prototype._setDisplayModelData = function (modelData) {
            this.resultCounter = 0;
            var displayModel = this.getModel();
            displayModel.setData(modelData);
        };

        oDecisionTableSettings.prototype.setExpressionLanguage = function (oExpressionLanguage) {
            this.setAssociation("expressionLanguage", oExpressionLanguage, true);
            this._decisionTableHeaderSettingFormatter.setExpressionLanguage(oExpressionLanguage);
        };

        oDecisionTableSettings.prototype._setExpressionRelevantOperators = function (displayExpression, colId, bValueOnly,
            astControl) {
            var oFixedOperatorData = this._getFixedOperatorDataForExpression(displayExpression, bValueOnly, astControl);
            this._internalModel.setProperty("/tableData/" + colId, oFixedOperatorData, false);
            this._updateRemoveRowEnabled();
        };

        oDecisionTableSettings.prototype._tableColumnsFactory = function (sId, oContext) {
            var that = this;
            var colId = oContext.getProperty("Id");
            var sequence = oContext.getProperty("Sequence");
			var label = oContext.getProperty("Label");
            var status = oContext.getProperty("Status");
            var type = oContext.getProperty("Type");
            var fixedOperator = oContext.getProperty("Condition/FixedOperator");
            var sOperator = this.getAstExpressionLanguage() ? this.astUtil._getCapitalOperatorName(fixedOperator) : fixedOperator;
            
            return new ColumnListItem({
				visible: type === library.DecisionTableColumn.Condition,
				cells: [
					// gets the expression col
					this._getExpressionFieldForCondition(oContext),

					new Input({
						value: label,
						maxLength: Constants.MAX_LABEL_LENGTH,
						change: function (oEvent) {
							var labelValue = oEvent.getSource().getValue().trim();
							var oLabelControl = oEvent.getSource();
							var model = oContext.getModel();
							model.setProperty(oContext.getPath() + "/Label", labelValue);
							this._changeColumnStatusToUpdate(oContext);
						}.bind(this)
					}),
					
                    // gets the vocab col
                    new Select({
                        width: "100%",
                        showSecondaryValues: true,
                        items: {
                            path: "settingsModel>/tableData/" + colId + "/fixOperatorEnumration",
                            template: new ListItem({
                                key: "{settingsModel>key}",
                                text: "{settingsModel>key}",
                                additionalText: "{settingsModel>value}"
                            })
                        },
                        selectedKey: sOperator,
                        enabled: "{settingsModel>/tableData/" + colId + "/fixOperatorEnabled}",
                        change: function (oEvent) {
                            var oSelect = oEvent.getSource();
                            var model = oContext.getModel();
                            var sSelectedKey = oSelect.getSelectedKey()
                            var sOperator = this.getAstExpressionLanguage() ? that.astUtil._getCamelCaseOperatorName(sSelectedKey) : sSelectedKey;
                            model.setProperty(oContext.getPath() + "/Condition/FixedOperator", sOperator);
                            //Mark column as "Updated"
                            this._changeColumnStatusToUpdate(oContext);
                        }.bind(this)
                    }),

                    // text or guided selection- this will not be supported
                    /*new sap.m.Select({
                        width: "100%",
                        items: {
                            path: "settingsModel>/cellFormat/cellFormatEnumration",
                            template: new sap.ui.core.Item({
                                key: "{settingsModel>key}",
                                text: "{settingsModel>value}"
                            })
                        },
                        selectedKey: {
                            parts: [{
                                path: "Condition/ValueOnly"
                            }],
                            formatter: this._getColumnInputMode.bind(this)
                        },
                        enabled: {
                            parts: [{
                                path: "settingsModel>/cellFormat/CellFormat"
                            }, {
                                path: "Condition/ValueOnly"
                            }],
                            formatter: this._getInputModeEnabled
                        },
                        change: function(oEvent) {
                            this._changeColumnInputMode(oContext, oEvent);
                        }.bind(this)

                    }),*/
                    new HorizontalLayout({
                        content: [
                            new Button({
                                type: mobileLibrary.ButtonType.Transparent,
                                icon: IconPool.getIconURI("sys-cancel"),
                                visible: "{settingsModel>/removeRowEnabled}",
                                press: function (oEvent) {
                                    //Clear tableData since the columns will be build again
                                    this._internalModel.setProperty("/tableData", {}, true);
                                    //Remove coulmn from JSON model
                                    this._removeColumnFromJsonModel(sequence, status);
                                }.bind(this)
                            }).setTooltip(this.oBundle.getText("removeColumn")),
                            new Button({
                                type: mobileLibrary.ButtonType.Transparent,
                                icon: IconPool.getIconURI("add"),
                                press: function (oEvent) {
                                    //Add coulmn from JSON model
                                    this._addColumnToJsonModel(sequence);
                                }.bind(this)
                            }).setTooltip(this.oBundle.getText("addColumn"))
                        ]
                    })
                ]
            }).addStyleClass("sapRULDecisionTableSettingsConditionRow");
        };
		
        oDecisionTableSettings.prototype._updateDecisionTableHeader = function () {
            var _displayModel = this.getModel();
            var oExpressionLanguage;
            if (this.getAstExpressionLanguage()) {
                oExpressionLanguage = Element.getElementById(this.getAstExpressionLanguage());
            } else {
                oExpressionLanguage = Element.getElementById(this.getExpressionLanguage());
            }
            var sExpressionLanguageVersion = oExpressionLanguage.getExpressionLanguageVersion();
            var modelData = _displayModel.getData();
            //Fullfill decisiontable header data
            modelData.Type = library.RuleType.DecisionTable;
            //modelData.RuleFormat = sap.rules.ui.RuleFormat.Advanced;
            modelData.ExpressionLanguageVersion = sExpressionLanguageVersion;
        };

        oDecisionTableSettings.prototype._updateRefreshFlags = function (needRefresh, isEnabled, bRefreshed) {
            this.getModel().getData().needToRefresh = needRefresh;
            this.getModel("settingsModel").setProperty("/refreshButtonEnabled", isEnabled, null, true);
            /////////////////// Non ABAP Requires Predefined results table. Hence, calling function import before Apply/////////
            this.getModel("settingsModel").setProperty("/refreshButtonClicked", bRefreshed);
            this._callRefreshResultsFunctionImport();
        };

        oDecisionTableSettings.prototype._updateRemoveRowEnabled = function () {
            //var columns = this.conditionsTable.getAggregation("items");
	    var columns = this.getModel().getProperty("/DecisionTable/DecisionTableColumns/results");
            var visibleCounter = 0;
            for (var i = 0; i < columns.length; i++) {
                //if (columns[i].getVisible() === true) {
		if (columns[i].Type === "CONDITION") {
                    visibleCounter++;
                }
            }
            var enabled = visibleCounter > 1;
            this._internalModel.setProperty("/removeRowEnabled", enabled, null, true);
        };

        //Updates the array of DataObjectAttributes with properties when result/AccessMode/Expression is changed
        oDecisionTableSettings.prototype._updateResultAttributeJSON = function (
            oContext, sAccessMode, sExpression, astNodes, bResultChanged, isRefreshed, isSequenceChanged) {
            var sAttributeId = oContext.getProperty("DataObjectAttributeId") || oContext.getProperty("Id") || (oContext.DataObjectAttributeinfo ? oContext.DataObjectAttributeinfo.Id : undefined);
            var sDataPath = "/predefinedResults/" + sAttributeId;
            if (this.getModel("settingsModel").attributeSequenceArray) {
                this._internalModel.setProperty(sDataPath + "/AttributeSequence", parseInt(this.getModel("settingsModel").attributeSequenceArray.indexOf(sAttributeId)) + 1);
            }
            if (this._internalModel.getProperty("/predefinedResults")) {
                var astNodesOfNewDOattr = [];
                if (this._internalModel.getProperty(sDataPath)) {
                    if (isSequenceChanged) {
                        this._internalModel.setProperty(sDataPath + "/updateAttributeSequence", true);
                        astNodesOfNewDOattr = this._internalModel.getProperty(sDataPath).ASTNodes;
                    }
                    if (bResultChanged) {
                        this._internalModel.setProperty(sDataPath + "/AccessMode", Constants.EDITABLE);
                        this._internalModel.setProperty(sDataPath + "/Expression", "");
                        this._internalModel.setProperty(sDataPath + "/ASTNodes", astNodesOfNewDOattr);
                        this._internalModel.setProperty(sDataPath + "/updatePredefinedResults", true);
                    }
                    if (isRefreshed) {
                        var oExistingData = this._internalModel.getProperty(sDataPath);
                        this._internalModel.setProperty(sDataPath + "/isAttributeinBackend", true);
                        this._internalModel.setProperty(sDataPath + "/AccessMode", sAccessMode);
                        this._internalModel.setProperty(sDataPath + "/Expression", sExpression);
                        this._internalModel.setProperty(sDataPath + "/ASTNodes", astNodes);
                        this._internalModel.setProperty(sDataPath + "/updatePredefinedResults", true);
                    }
                    if (!bResultChanged && !isRefreshed && sAccessMode) {
						if (this._internalModel.getProperty(sDataPath + "/AccessMode") !== sAccessMode) {
							this._internalModel.setProperty(sDataPath + "/AccessMode", sAccessMode);
							this._internalModel.setProperty(sDataPath + "/updatePredefinedResults", true);
							if(sAccessMode === Constants.HIDDEN){
								this._internalModel.setProperty(sDataPath + "/ASTExpressionCleared", true);
							}
						}
                    }
                    if (!bResultChanged && !isRefreshed && (sExpression || sExpression === "")) {
                        this._internalModel.setProperty(sDataPath + "/Expression", sExpression);
                        this._internalModel.setProperty(sDataPath + "/updatePredefinedResults", true);
                    }
                    if (!bResultChanged && !isRefreshed && astNodes && !isSequenceChanged) {
                        this._internalModel.setProperty(sDataPath + "/ASTNodes", astNodes);
                        this._internalModel.setProperty(sDataPath + "/updatePredefinedResults", true);
                        // if hidden value is changed, mark that it has changed 
                        var oAccessMode = this._internalModel.getProperty(sDataPath + "/AccessMode");
                        var bASTExpressionCleared = this._internalModel.getProperty(sDataPath + "/ASTExpressionCleared");
                        var nAstNodesLength = astNodes.length;
                        if (oAccessMode === Constants.HIDDEN && bASTExpressionCleared) {
                        	if ((this.getAstExpressionLanguage() && nAstNodesLength > 0)) { 
                        		this._internalModel.setProperty(sDataPath + "/ASTExpressionCleared", false);
                        	}
                        }
                    }
                    if (this.getExpressionLanguage() && !bResultChanged && !isRefreshed) {
                    	this._internalModel.setProperty(sDataPath + "/updatePredefinedResults", true);
                    	// if hidden value is changed, mark that it has changed 
                    	var oAccessMode = this._internalModel.getProperty(sDataPath + "/AccessMode");
                    	var bASTExpressionCleared = this._internalModel.getProperty(sDataPath + "/ASTExpressionCleared");
                    	if (oAccessMode === Constants.HIDDEN && bASTExpressionCleared && sExpression) {
                        		this._internalModel.setProperty(sDataPath + "/ASTExpressionCleared", false);
                        }
                    }
                } else {
                    this._internalModel.setProperty(sDataPath, oContext.getObject(oContext.sPath));
                    if (oContext.getObject(oContext.sPath).Result) {
                        this._internalModel.setProperty(sDataPath, oContext.getObject(oContext.sPath).Result);
                    }
                    this._internalModel.setProperty(sDataPath + "/ASTNodes", astNodes);
                    if (bResultChanged) {
                        this._internalModel.setProperty(sDataPath + "/AccessMode", Constants.EDITABLE);
                        this._internalModel.setProperty(sDataPath + "/Expression", "");
                        this._internalModel.setProperty(sDataPath + "/ASTNodes", []);
                    }
                    if (isRefreshed) {
                        this._internalModel.setProperty(sDataPath + "/AccessMode", sAccessMode);
                        this._internalModel.setProperty(sDataPath + "/Expression", sExpression);
                        this._internalModel.setProperty(sDataPath + "/ASTNodes", astNodes);
                        this._internalModel.setProperty(sDataPath + "/isAttributeinBackend", true);
                    }
                }
            }
            // if hidden is chosen and there is no expression entered, value state will be set to error
            if (this.expressionControl && sDataPath && this._internalModel.getProperty(sDataPath + "/AccessMode") === Constants.HIDDEN) {
                var astNodes = this._internalModel.getProperty(sDataPath + "/ASTNodes");
                //var expression = this._internalModel.getProperty(sDataPath + "/Expression");
                if (this.getAstExpressionLanguage() && astNodes && astNodes.length > 0) {
                    if (astNodes[0].Type === "I" && astNodes[0].Value !== "") {
                        this.expressionControl.setValueStateText(this.oBundle.getText("PredefinedResultsValueStateText"));
                    } else {
                        this.expressionControl.setValueStateText("");
                    }
                } else if (this.getExpressionLanguage()){
                	if (!sExpression) {
                		this.expressionControl.setValueStateText("");
                	} else if (sExpression && this.expressionControl.getValueStateText()) {
                		this.expressionControl.setValueStateText(this.oBundle.getText("PredefinedResultsValueStateText"));
                	} else {
                		this.expressionControl.setValueStateText("");
                	}
                }
            } else if (this.expressionControl && sDataPath && this._internalModel.getProperty(sDataPath + "/AccessMode") === Constants.EDITABLE) {
                    this.expressionControl.setValueStateText("");
            }

        };

        oDecisionTableSettings.prototype.getButtons = function (oDialog) {
            var aButtons = [];
            //Create cancel button
            var oCancelButton = new Button({
                text: this.oBundle.getText("cancelBtn")
            }).setTooltip(this.oBundle.getText("cancelBtnTooltip"));
            oCancelButton.attachPress(function () {
                oDialog.close();
            }, this);

            //Create apply button
            var oApplyBtn = Element.getElementById("ApplyBtn");
            if (!oApplyBtn) { 
	            	oApplyBtn = new Button({
	                text: this.oBundle.getText("applyChangesBtn"),
	                id: "ApplyBtn"
                }).setTooltip(this.oBundle.getText("applyChangesBtnTooltip"));
            }

            oApplyBtn.attachPress(function () {
                if (!this._applyButtonPressed) {
					BusyIndicator.show();
					this.multiHeaderFlag = false; //flag for calculate only once header span for multi header in columnFactory function
					//In case of successfull apply, the oDialog is closed from the success callback
					this._applySettingsModelChangesToOData(oDialog);
					this._applyButtonPressed = true;
				}

            }, this);
            aButtons.push(oApplyBtn);
            aButtons.push(oCancelButton);
            return aButtons;
        };

        oDecisionTableSettings.prototype.init = function () {
            this.oBundle = coreLib.getResourceBundleFor("sap.rules.ui.i18n");
            this.editableModeText = Constants.EDITABLE;
            this.hiddenModeText = Constants.HIDDEN;
            this.needCreateLayout = true;
            this.firstLoad = true;
            this.resultCounter = 0;
            this.enableAccessValue = false;
            this.needToRenderPredefinedResultsTable = false;
            /*work around for CSN : 1880262342 - After Refresh of table type DO -sumbitChanges call is never made if there are no attributes
            and no other changes are made in DT Settings*/
            this.attributeListEmpty = false;
            this.astUtil = new AstUtil();
            this._applyButtonPressed = false;

            this.onsapescape = function (oEvent) {
                //  oEvent.preventDefault();
                oEvent.stopPropagation();
            };
            this._decisionTableHeaderSettingFormatter = new ExpressionType();
            this.setBusyIndicatorDelay(0);

            //destroy UI elements if already existed
            this._destroyElement("idPredefinedTable");
            this._destroyElement("id_HiddenAccessMessageStrip");
            this._destroyElement("id_EditableAccessMessageStrip");

        };

        oDecisionTableSettings.prototype.onBeforeRendering = function () {
            this.mNextColumnId = this._calcNextColumnId();
            if (this.firstLoad) {
                this._initSettingsModel();
                if (this.getProperty("newDecisionTable") === true) {
                    this.mNextColumnId = 1;
                    this._prepareNewRule();
                }
                this.firstLoad = false;
            }
            if (this.needCreateLayout) {
                var layout = this.getAggregation("mainLayout");
                if (layout) {
                    layout.destroy();
                }
                layout = this._createLayout();
                this.setAggregation("mainLayout", layout, true);
                this.needCreateLayout = false;

                this.conditionsTable.getBinding("items").attachDataRequested(function () {
                    this.setBusy(true);
                }.bind(this));

                this.conditionsTable.getBinding("items").attachDataReceived(function () {
                    this.setBusy(false);
                }.bind(this));
            }
        };

        //In case of reference object we will have attribues with ":" which should be replace by /
        oDecisionTableSettings.prototype._formatAttributeId = function (attributeId) {
			var formattedAttributeId = attributeId;
			if(formattedAttributeId && formattedAttributeId.indexOf(":") > -1) {
				formattedAttributeId = formattedAttributeId.replace(/:/g, "/");
			}
			return formattedAttributeId
		};
		
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////           Closure - this code is relevant only when pressing "apply"             ////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        oDecisionTableSettings.prototype._applySettingsModelChangesToOData = function (oDialog) {
            var that = this;
            var _oExpressionLanguage;
            if (this.getExpressionLanguage()) {
                _oExpressionLanguage = Element.getElementById(this.getExpressionLanguage());
            } else {
                _oExpressionLanguage = Element.getElementById(this.getAstExpressionLanguage());
            }
            var nextColumnId = this.mNextColumnId;
            var oModel = this.getModel();
            var oDataModel = this.getModel("oDataModel");
            var dtModel = this.getModel("dtModel");
            var oSettingsModel = this.getModel("settingsModel");
            var oBindingContext = this.getBindingContext("dummy");
            var sRuleId = oBindingContext.getProperty("Id");
            var sVersion = oBindingContext.getProperty("Version");
            var sHitPolicy = oModel.oData.DecisionTable.HitPolicy;
            var bResultChanged = oSettingsModel.getProperty("/resultDataObjectChanged");
            var bAttributeChanged = oSettingsModel.getProperty("/resultAttributeChanged");
            var bAttributeSequenceChanged = oSettingsModel.getProperty("/resultAttributeSequenceChanged");
            var bRefreshed = oSettingsModel.getProperty("/refreshButtonClicked");
            var isNewTable = this.getProperty("newDecisionTable");
            var newDTColResults = [];
            var changesGroupID = {
                groupId: "changes"
            };
            var isNeedToSubmitChanges = false;
            var invalidCondition = false;

            //////////////////////////////// _updateODataHitPolicy /////////////////////////////////////////////
            var _updateODataHitPolicy = function () {
                var mParameters = {};
                mParameters.groupId = changesGroupID.groupId;

                var oDecisionTableData = {
                    RuleId: sRuleId,
                    Version: sVersion,
                    HitPolicy: sHitPolicy
                };

                var path = "/DecisionTables(Version='" + sVersion + "',RuleId='" + sRuleId + "')";
                oDataModel.update(path, oDecisionTableData, mParameters);
            };

            ////////////////////////////////////// _createFirstRow /////////////////////////////////////////////////
            var _createFirstRow = function (sColumnsNumber) {
                var mParameters = {};
                var oRowData = {
                    RuleId: sRuleId,
                    Version: sVersion,
                    Sequence: 1,
                    Id: 1
                };

                mParameters.properties = oRowData;
                oDataModel.createEntry("/DecisionTableRows", mParameters);
            };

            ////////////////////////////////////////// _updateModelResultObject ////////////////////////////////////////////////
            var _updateModelResultObject = function (sResultObjectID) {
                oDataModel.callFunction("/SetRuleResultDataObject", {
                    method: "POST",
                    //groupId:"DecisionTableColumnConditions",//When we'll use groupID, we'll use this line
                    groupId: changesGroupID.groupId,
                    urlParameters: {
                        RuleId: sRuleId,
                        ResultDataObjectId: (sResultObjectID !== Constants.NO_RESULT) ? sResultObjectID : ""
                    }
                });
            };
            //////////////////////////////////_updateModelPredefinedResultAttributes////////////////////////////////////////////
            var _updateModelPredefinedResultAttributes = function (sResultObjectID) {
                var newResultJsonObjects = oSettingsModel.oData.predefinedResults;
                if (newResultJsonObjects) {
                    var attribute;
                    for (attribute in newResultJsonObjects) {
                        if (newResultJsonObjects[attribute].updatePredefinedResults || newResultJsonObjects[attribute].updateAttributeSequence) {
                            isNeedToSubmitChanges = true;
                            var attrId = attribute.replace(/:/g, "%3A");
                            var updateURLPath = "/PredefinedResults(RuleId='" + sRuleId + "',DataObjectAttributeId='" + attrId + "')";
                            var predefinedResultsBody = {
                                AccessMode: newResultJsonObjects[attribute].AccessMode,
                                Type: "DT"
                            };
				
                            var mParameters = {
                              groupId: changesGroupID.groupId
                            };
			                if (that.getAstExpressionLanguage() && newResultJsonObjects[attribute].ASTNodes) {
                                var resultId = newResultJsonObjects[attribute].Id;
                                if (bResultChanged || bRefreshed) {
                                    for (var result in newDTColResults) {
                                        if (newDTColResults[result].Type === "RESULT" && newDTColResults[result].Result.DataObjectAttributeId === attribute) {
                                            resultId = newDTColResults[result].Result.Id;
                                            break;
                                        }
                                    }
                                }
								var updateResultPath = "/DecisionTableColumnResults(RuleId='" + sRuleId + "',Version='" + sVersion + "',Id=" + resultId + ")";
								var resultBody = {
									BusinessDataType: newResultJsonObjects[attribute].BusinessDataType
								};
								if (newResultJsonObjects[attribute].updatePredefinedResults) {
									//Update call to dtcol result in case ast id doesnt exist
									oDataModel.update(updateResultPath, resultBody, mParameters);
									_removeExistingAstNodes(resultId, "/DeleteDTColResultASTDraft");
									_updateModelAstNodes(newResultJsonObjects[attribute].ASTNodes, "/DecisionTableColumnResultASTs", resultId);
                                } 
                            } else {
                                predefinedResultsBody.Expression = newResultJsonObjects[attribute].Expression;
                            }
                            // Sequence handling for attributes
                            if (newResultJsonObjects[attribute].SequenceChanged) {
                                predefinedResultsBody.Sequence = newResultJsonObjects[attribute].AttributeSequence;
                            }
                            // Do not make additional calls if no changes on other attributes 
                            if (bAttributeChanged || newResultJsonObjects[attribute].SequenceChanged) {
                                //Update predefined will work on ast nodes created before this call
                                oDataModel.update(updateURLPath, predefinedResultsBody, mParameters);
                            }
                        }
                    }
                    if (!newResultJsonObjects) {
                        //There is nothing to submit if the JSON has no change
                        isNeedToSubmitChanges = false;
                    }
                }
            };

            //If attributes of DO differ from existing column results, create or delete columns accordingly
            var _refreshRuleResultDataObject = function () {
                oDataModel.callFunction("/RefreshRuleResultDataObject", {
                    method: "POST",
                    //groupId:"DecisionTableColumnConditions",//When we'll use groupID, we'll use this line
                    groupId: changesGroupID.groupId,
                    urlParameters: {
                        RuleId: sRuleId
                    }
                });
            };

            //////////////////////////////// _createNewTableODataEntries /////////////////////////////////////////////
            var _createNewTableODataEntries = function (sColumnsNumber, oDTContext) {
                var mParameters = {};
                //var modelDecisionTable = odataModel.oData["DecisionTables(Version='" + sVersion + "',RuleId='" + sRuleId + "')"];
                if (!oDTContext.getProperty("DecisionTable")) {
                    //CreateEntry DecisionTable
                    var oDecisionTableData = {
                        RuleId: sRuleId,
                        Version: sVersion,
                        HitPolicy: sHitPolicy
                    };

                    mParameters.properties = oDecisionTableData;
                    oDataModel.createEntry("/DecisionTables", mParameters);
                } else {
                    _updateODataHitPolicy();
                }
                //Create a default row
                _createFirstRow();
            };

            ////////////////////////////////////////// _createModelConditionEntry /////////////////////////////////////////////
            var _createModelConditionEntry = function (mConditionColumnData, mSequence, mLabel) {
                var mParameters = {};
                var oColumnData = {
                    RuleId: mConditionColumnData.RuleId,
                    Version: mConditionColumnData.Version,
                    Id: mConditionColumnData.Id,
                    Type: library.DecisionTableColumn.Condition,
                    Sequence: mSequence,	
                    Label: mLabel
                };

                mParameters.properties = oColumnData;
                oDataModel.createEntry("/DecisionTableColumns", mParameters);
                mParameters.properties = mConditionColumnData;
                oDataModel.createEntry("/DecisionTableColumnConditions", mParameters);
            };

            ////////////////////////////////////////// _removeModelConditionEntry /////////////////////////////////////////////
            var _removeModelConditionEntry = function (sConditionID) {
                var columnPath = "/DecisionTableColumns(RuleId='" + sRuleId + "',Version='" + sVersion + "',Id=" + sConditionID + ")";
                _removeExistingAstNodes(sConditionID, "/DeleteDTColConditionASTDraft");
                oDataModel.remove(columnPath, changesGroupID);
            };

            /////////////////////////////////////////////_validateConditionColumns ////////////////////////////////////////////
            var _validateConditionColumns = function (aSettingsModelColumns) {
                var settingsModelColumn;
                var messageBundle = coreLib.getResourceBundleFor("sap.rules.ui.i18n");

                for (var i = 0; i < aSettingsModelColumns.length; i++) {
                    settingsModelColumn = aSettingsModelColumns[i];
                    if (settingsModelColumn.Condition.Expression === "") {
                        MessageBox.error(messageBundle.getText("emptyConditionError"));
                        invalidCondition = true;
                        return false;
                    } else {
                        return true;
                    }
                }

            };

            /////////////////////////////////////////////astnode methods////////////////////////////////////////////////////////////
            var _updateModelAstNodes = function (astNodes, sPath, colId) {
                for (var node in astNodes) {
                    astNodes[node].Id = colId;
                    var mParameters = {};
					if(astNodes[node].Type === "I") {
						astNodes[node].IncompleteExpression = astNodes[node].Value;
					}
                    mParameters.properties = astNodes[node];
                    mParameters.groupId = "changes";
                    oDataModel.createEntry(sPath, mParameters);
                }
            };

            var _removeExistingAstNodes = function (id, sPath) {
                var mParameters = {};
                mParameters.Id = id;
                mParameters.RuleId = sRuleId;
                mParameters.Version = sVersion;

                oDataModel.callFunction(sPath, {
                    method: "POST",
                    groupId: "changes",
                    urlParameters: mParameters
                });

            };

            ///////////////////////////////////////////// _updateODataModelColumns /////////////////////////////////////////////////
            var _updateODataModelColumns = function (aSettingsModelColumns, isResultChanged, modelData) {
                var propertyPathColumn = "/DecisionTableColumns(RuleId='" + sRuleId + "',Version='" + sVersion + "',Id=ID_PROPERTY)";
                var propertyPathConditions = "/DecisionTableColumnConditions(Version='" + sVersion + "',RuleId='" + sRuleId + "',Id=ID_PROPERTY)";
                var propertyPathResults = "/DecisionTableColumnResults(Version='" + sVersion + "',RuleId='" + sRuleId + "',Id=ID_PROPERTY)";
                var settingsModelColumn;
                var Id = "";
                var currentPropertyPath = "";
                var updatedConditionOdata = {};

                //Update each new/updated columns from settingsModel into oDataModel
                for (var i = 0; i < aSettingsModelColumns.length; i++) {
                    var astNodes = [];
                    settingsModelColumn = aSettingsModelColumns[i];
                    if (settingsModelColumn.Status) {

                        var newExpression;
                        var newFixOperator;

                        //For rel expressions only
                        if (settingsModelColumn.Condition && settingsModelColumn.Condition.parserResults) {
                            //if expression was convertend (in case of a wrong expression it wouldn't be converted)
                            newExpression = (settingsModelColumn.Condition.parserResults.converted && settingsModelColumn.Condition.parserResults.converted
                                    .Expression) ?
                                settingsModelColumn.Condition.parserResults.converted.Expression :
                                settingsModelColumn.Condition.Expression;
                            newFixOperator = (settingsModelColumn.Condition.parserResults.converted && settingsModelColumn.Condition.parserResults.converted
                                    .FixedOperator) ?
                                settingsModelColumn.Condition.parserResults.converted.FixedOperator :
                                settingsModelColumn.Condition.FixedOperator;
                        }

                        isNeedToSubmitChanges = true;

                        if (settingsModelColumn.Status === "U") {
                            // Update Sequence, for either condition or result which was not changed
                            if (!(settingsModelColumn.Result && isResultChanged)) {
                                Id = settingsModelColumn.Id;
                                var resultSequence = {
                                    Sequence: settingsModelColumn.Sequence,	
                                    Label: settingsModelColumn.Label
                                };
                                var currentSequencePath = propertyPathColumn.replace("ID_PROPERTY", Id);
                                if (settingsModelColumn.Label) {
                                    oDataModel.update(currentSequencePath, resultSequence, changesGroupID);
                                }
                            }

                            //Expression and ASTNode update for condition
                            if (settingsModelColumn.Condition) {
                                currentPropertyPath = propertyPathConditions.replace("ID_PROPERTY", Id);
                                var newValueOnly = settingsModelColumn.Condition.ValueOnly;
                                updatedConditionOdata = {
                                    Id: Id,
                                    Expression: newExpression ? newExpression : settingsModelColumn.Condition.Expression,
                                    FixedOperator: newFixOperator ? newFixOperator : settingsModelColumn.Condition.FixedOperator,
                                    ValueOnly: newValueOnly
                                };

                                oDataModel.update(currentPropertyPath, updatedConditionOdata, changesGroupID);
                                if (that.getAstExpressionLanguage() && modelData[i].Condition.ASTNodes) {
                                    _removeExistingAstNodes(Id, "/DeleteDTColConditionASTDraft");
                                    _updateModelAstNodes(modelData[i].Condition.ASTNodes, "/DecisionTableColumnConditionASTs", Id);
                                }
                            }

                        } else if (settingsModelColumn.Status === "C") {
                            var newCondition = {};
                            var conditionData = settingsModelColumn.Condition;
                            newCondition.Expression = newExpression ? newExpression : settingsModelColumn.Condition.Expression;
                            newCondition.FixedOperator = newFixOperator ? newFixOperator : conditionData.FixedOperator;
                            newCondition.RuleId = conditionData.RuleId;
                            newCondition.Id = conditionData.Id;
                            newCondition.Version = conditionData.Version;
                            delete newCondition.parserResults;
                            _createModelConditionEntry(newCondition, settingsModelColumn.Sequence, settingsModelColumn.Label);
                            if (that.getAstExpressionLanguage()) {
                                _updateModelAstNodes(modelData[i].Condition.ASTNodes, "/DecisionTableColumnConditionASTs", newCondition.Id);
                            }
                        }
                    }
                }
            };

            ///////////////////////////////////////////// _deleteODataModelColumns /////////////////////////////////////////////////
            var _deleteODataModelColumns = function (aSettingsModelDeletedColumns) {
                //if there no deleted columns retrun
                if (!aSettingsModelDeletedColumns) {
                    return;
                }
                isNeedToSubmitChanges = true;

                for (var i = 0; i < aSettingsModelDeletedColumns.length; i++) {
                    var currentCondition = aSettingsModelDeletedColumns[i];
                    _removeModelConditionEntry(currentCondition.Id);
                }
            };

            //////////////////////////////////////////////////// submitSuccess /////////////////////////////////////////////////
            var getDTColResults = function () {
                var bindingPath = [dtModel.getProperty("/ruleBindingPath"), "/DecisionTable/DecisionTableColumns"].join("");
                var expandPath = "Condition,Result";
                if (that.getAstExpressionLanguage()) {
                    expandPath = "Condition/DecisionTableColumnConditionASTs,Result/DecisionTableColumnResultASTs";
                }
                var mParameters = {
                    urlParameters: {
                        "$expand": expandPath
                    },
                    success: function (oData) {
                        oDataModel.setDeferredGroups([changesGroupID.groupId]);
                        newDTColResults = oData.results;
                        resultFunctionImportCallBack(true);
                        if (isNeedToSubmitChanges) {
                            oDataModel.submitChanges({
                                groupId: changesGroupID.groupId,
                                success: function () {
                                    BusyIndicator.hide();
                                    oDialog.setState(coreLibrary.ValueState.Success);
                                    oDialog.close();
                                    return;
                                }
                            });
                        } else {
                            BusyIndicator.hide();
                            oDialog.setState(coreLibrary.ValueState.Success);
                            oDialog.close();
                        }
                    }
                };
                oDataModel.read(bindingPath, mParameters);
            };

            var submitSuccess = function (batchRequestResponse) {
                var messageBundle = coreLib.getResourceBundleFor("sap.rules.ui.i18n");
                var foundErrorInBatch = false;
                BusyIndicator.hide();
                var batchResponseArray = batchRequestResponse.__batchResponses["0"].__changeResponses;
                for (var responseEntry in batchResponseArray) {
                    if (batchResponseArray[responseEntry].message) {
                        var errorMessage = batchResponseArray[responseEntry].response.body;
                        MessageBox.error(
                            errorMessage, {
                                title: messageBundle.getText("RequestFailedText"),
                                actions: [MessageBox.Action.OK]

                            }
                        );
                        oDialog.setState(coreLibrary.ValueState.Error);
                        foundErrorInBatch = true;

                    }
                }
                if ((!foundErrorInBatch || !isNeedToSubmitChanges) && oDialog.isOpen()) {
                    isNeedToSubmitChanges = false;
                    if (bResultChanged) {
                        getDTColResults();
                    } else {
                        BusyIndicator.hide();
                        oDialog.setState(coreLibrary.ValueState.Success);
                        oDialog.close();
                    }
                }
                if (!foundErrorInBatch) {
                   MessageToast.show(that.oBundle.getText("settingsApplySuccess"));
                }

            };

            //////////////////////////////////// _createResultDataObjectColumns /////////////////////////////////////////////////
            var _createResultDataObjectColumns = function (nextSequence) {
                var mParameters = {};
                mParameters.groupId = changesGroupID.groupId;
                var modelData = oModel.getData();
                var resultName = modelData.ResultDataObjectName;
                var resultInfo = _oExpressionLanguage.getResultInfo(resultName);
                var resultParams = resultInfo ? resultInfo.requiredParams : [];
                var resultLength = resultParams.length;

                for (var i = 0; i < resultLength; i++) {
                    var oColumnData = {
                        RuleId: sRuleId,
                        Version: sVersion,
                        Id: nextColumnId,
                        Type: library.DecisionTableColumn.Result,
                        Sequence: nextSequence
                    };

                    mParameters.properties = oColumnData;
                    oDataModel.createEntry("/DecisionTableColumns", mParameters);

                    var oResultColumnData = {
                        RuleId: sRuleId,
                        Version: sVersion,
                        Id: nextColumnId,
                        DataObjectAttributeName: resultParams[i].name,
                        DataObjectAttributeId: resultParams[i].paramId,
                        BusinessDataType: resultParams[i].businessDataType
                    };

                    nextColumnId++;
                    nextSequence++;

                    mParameters.properties = oResultColumnData;
                    oDataModel.createEntry("/DecisionTableColumnResults", mParameters);
                }
            };

            /////////////////////////////////////////////////////// Main Flow ////////////////////////////////////////////////////
            var _settingsCodeModel;
            var aSettingsModelColumns;
            //Convert oModel (in display values) to oModel (in code values) for REL
            if (this.getExpressionLanguage()) {
                _settingsCodeModel = _oExpressionLanguage.convertRuleToCodeValues(oModel.oData);
                aSettingsModelColumns = _settingsCodeModel.output.decisionTableData.DecisionTable.DecisionTableColumns.results;
            } else {
                aSettingsModelColumns = oModel.oData.DecisionTable.DecisionTableColumns.results;
            }
            //All requests belonging to the group are then stored in a request queue. The deferred batch group must then be submitted manually by means of the submitChanges() method.
            oDataModel.setDeferredGroups([changesGroupID.groupId]);

            //Update oDataModel with all delete columns
            _deleteODataModelColumns(oModel.oData.DecisionTable.DecisionTableColumns.deleted);

            //Update oDataModel with all new/updated columns
            var modelData = oModel.oData.DecisionTable.DecisionTableColumns.results;
            _updateODataModelColumns(aSettingsModelColumns, bResultChanged, modelData);

            if (bRefreshed) {
                this._findAndRemoveDeletedAttributeFromOModel();
            }

            var resultFunctionImportCallBack = function (bSuccessCallback) {
                if (bAttributeChanged || bAttributeSequenceChanged) {
                    _updateModelPredefinedResultAttributes();
                }

                var needToRefresh = oModel.oData.needToRefresh;
                if (needToRefresh) {
                    isNeedToSubmitChanges = true;
                    _refreshRuleResultDataObject();
                }

                if (isNewTable) {
                    isNeedToSubmitChanges = true;
                    _createNewTableODataEntries(aSettingsModelColumns.length, oBindingContext);

                } else if (oModel.oData.DecisionTable.HitPolicyStatus === "U") {
                    isNeedToSubmitChanges = true;
                    _updateODataHitPolicy(sRuleId, sVersion, sHitPolicy, changesGroupID);
                }

                if (isNewTable && !bSuccessCallback) {
                 _createResultDataObjectColumns(aSettingsModelColumns.length + 1);
                 }
            }

            if (bResultChanged) {
                isNeedToSubmitChanges = true;
                _updateModelResultObject(oModel.oData.ResultDataObjectId);
            } else if (bRefreshed) {
                getDTColResults();
            } else {
                resultFunctionImportCallBack(false);
            }

            var mParameters = {};
            mParameters.success = submitSuccess;
            mParameters.groupId = changesGroupID.groupId;

            if (isNeedToSubmitChanges) {
                //Save changes to backend
                oDataModel.submitChanges(mParameters);
                //We'll close the dialog on the submitSuccess callback
                /*work around for CSN : 1880262342 - After Refresh of table type DO -sumbitChanges call is never made if there are no attributes
                 and no other changes are made in DT Settings*/
                //return;
            }

            /*work around for CSN : 1880262342 - After Refresh of table type DO -sumbitChanges call is never made if there are no attributes
             and no other changes are made in DT Settings*/
            if (bRefreshed && this.attributeListEmpty) {
                oDialog.setState(coreLibrary.ValueState.Success);
                BusyIndicator.hide();
                oDialog.close();
                MessageToast.show(this.oBundle.getText("settingsApplySuccess"));
                return;
            }

            if (!isNeedToSubmitChanges && !bResultChanged && !bRefreshed && !bAttributeChanged) {
                oDialog.setState(coreLibrary.ValueState.Success);
                BusyIndicator.hide();
                oDialog.close();
                MessageToast.show(this.oBundle.getText("settingsApplySuccess"));
            }  
        
        };

        return oDecisionTableSettings;

    }, /* bExport= */ true);
