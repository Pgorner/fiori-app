/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */

// Provides control sap.rules.ui.
sap.ui.define([
        "sap/ui/thirdparty/jquery",
        "sap/rules/ui/library",
        "sap/ui/core/Control",
        "sap/ui/layout/form/SimpleForm",
        "sap/m/Label",
        "sap/m/Switch",
        "sap/m/Select",
        "sap/m/MessageBox",
        "sap/m/Table",
        "sap/m/Column",
        "sap/m/Text",
        "sap/m/Input",
        "sap/m/Button",
        "sap/m/ComboBox",
        "sap/rules/ui/ExpressionAdvanced",
        "sap/ui/layout/VerticalLayout",
        "sap/rules/ui/type/Expression",
        "sap/rules/ui/oldast/lib/AstYamlConverter",
        "sap/rules/ui/Constants",
        "sap/rules/ui/AstExpressionBasic",
        "sap/rules/ui/services/AstExpressionLanguage",
        "sap/ui/core/library",
        "sap/ui/model/odata/v2/ODataModel",
        "sap/ui/model/Context",
        "sap/m/library",
        "sap/m/MessageStrip",
        "sap/ui/layout/HorizontalLayout",
        "sap/ui/core/Item",
        /*"sap/ui/layout/form/GridContainerData",*/
        "sap/ui/layout/ResponsiveFlowLayoutData",
        "sap/ui/core/IconPool",
        "sap/ui/model/json/JSONModel",
        "sap/m/ColumnListItem",
        "sap/ui/core/EventBus",
        "sap/ui/core/Lib",
        "sap/ui/core/Element",
		"sap/m/MessageToast",
        "./TextRuleSettingsRenderer"
    ],
    function (jQuery, library, Control, SimpleForm, Label, Switch, Select, MessageBox, Table, Column, Text, Input, Button, ComboBox,
        ExpressionAdvanced, VerticalLayout, ExpressionType, AstYamlConverter, Constants, ASTExpressionBasic, AstExpressionLanguage, coreLibrary, ODataModel,
        Context, mobileLibrary, MessageStrip, HorizontalLayout, Item, /*GridContainerData,*/ ResponsiveFlowLayoutData, IconPool, JSONModel, ColumnListItem, EventBus, coreLib, Element, MessageToast, TextRuleSettingsRenderer) {
        "use strict";

        /**
         * Constructor for a new TextRuleSettings Control.
         *
         * @param {string} [sId] id for the new control, generated automatically if no id is given
         * @param {object} [mSettings] initial settings for the new control
         *
         * @class
         * Some class description goes here.
         * @extends  Control
         *
         * @author SAP SE
         * @version 1.132.0
         *
         * @constructor
         * @private
         * @alias sap.rules.ui.TextRuleSettings
         * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
         */
         
         
        var oTextRuleSettings = Control.extend("sap.rules.ui.TextRuleSettings", {
            metadata: {
                library: "sap.rules.ui",
                properties: {
                    modelName: {
                        type: "string",
                        defaultValue: ""
                    },
                    newTextRule: {
                        type: "boolean",
                        defaultValue: false
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
                }
            },
            renderer: TextRuleSettingsRenderer
        });

        oTextRuleSettings.prototype._addNodeObject = function (astNode) {
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

        oTextRuleSettings.prototype._bindPredefinedTable = function (sPath, sKey) {
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
            var sBindingPath;
            var oHeaderKey;
            var oContext;

            var callPredefindFactory = function (oAttributes) {
                if (oAttributes && oAttributes.length > 0) {
                    that.oPredefinedTable.setBusy(true);
                    for (var i = 0; i < oAttributes.length; i++) {

                        if (sKey === "/TextRuleResults") {
                            oHeaderKey = {
                                RuleId: oAttributes[i].RuleId,
                                Id: oAttributes[i].Id,
                                RuleVersion: oAttributes[i].RuleVersion
                            };
                            sBindingPath = oModel.createKey(sKey, oHeaderKey);
                            oContext = new Context(oModel, sBindingPath);
                        } else {
                            oHeaderKey = {
                                DataObjectId: oAttributes[i].DataObjectId,
                                Id: oAttributes[i].Id,
                                VocabularyId: oAttributes[i].VocabularyId,
                                RootDataObjectId: oAttributes[i].RootDataObjectId,
                                AttributeId: oAttributes[i].AttributeId
                            };
                            sBindingPath = vocabularyModel.createKey(sKey, oHeaderKey);
                            oContext = new Context(vocabularyModel, sBindingPath);
                        }

                        that.oPredefinedTable.addItem(that._predefinedFactory("col-" + i, oContext));
                    }
                    that.oPredefinedTable.setBusy(false);
                    that._internalModel.setProperty("/needToRefresh", false);
                }
            };

            if (sKey === "/TextRuleResults") {
                var oTextRuleResults = this.getModel("TextRuleModel").getProperty("/textRuleResults");
                callPredefindFactory(oTextRuleResults);
            } else {
            	if (this.getModel().getProperty("/ResultDataObjectId")) {
            		vocabularyModel.read(sPath, {
                    urlParameters: {
                        "$expand": "ExpandedAttributes"
                    },
                    success: function (data) {
                        callPredefindFactory(data.ExpandedAttributes.results);
                    },
                    error: function (oError) {
                        MessageBox.error(
                            oError.responseText, {
                                title: that.oBundle.getText("ERROR_DIALOG"),
                                actions: [MessageBox.Action.OK]

                            }
                        );
                      }
                  });
            	}
                
            }
        };

        //Function Import for refresh before Apply
        oTextRuleSettings.prototype._callRefreshResultsFunctionImport = function () {
            var that = this;
            var odataModel = this.getModel("oDataModel");
            var modelData = this.getModel("TextRuleModel").getData();
            var changesGroupID = {
                groupId: "changes"
            };
            odataModel.setDeferredGroups([changesGroupID.groupId]);
            var submitSuccess = function (response) {
            	if (response && response.__batchResponses && response.__batchResponses[0].message === "HTTP request failed"){
            		//sap.m.MessageToast.show(that.oBundle.getText("refreshFailed"));
            		MessageBox.error(
                            response.__batchResponses[0].response.body, {
                                title: that.oBundle.getText("refreshFailed"),
                                actions: [MessageBox.Action.OK]

                            }
                        );
            	} else {
            		//create predefinedResults table with the refreshed attributes
                	that._createPredefinedTable();
                	//reset the status so that the call will not go once again when clicked on apply
                	that._internalModel.setProperty("/needToRefresh", false);
            	}
                
            };

            /*var submitError = function (e) {
                sap.m.MessageToast.show(e);
            };*/

            var callRefreshFunctionImport = function () {
                var sRuleId = modelData.ruleId;
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
                    //error: submitError
                });
            };

            if (this._internalModel.getProperty("/needToRefresh")) {
                callRefreshFunctionImport();
            }
        };

        //creates a message strip
        oTextRuleSettings.prototype._createInfoMessageStrip = function (textstr, elementID) {
            var oMsgStrip = new MessageStrip({
                visible: true, // boolean
                id: elementID,
                text: textstr, // string
                type: coreLibrary.MessageType.Information, // sap.ui.core.MessageType
                showIcon: true, // boolean
                showCloseButton: true
            }).addStyleClass("sapTextRuleSettingsMessageStrip");
            return oMsgStrip;
        };

        //Creates the formlayout inside the Settings dialog
        oTextRuleSettings.prototype._createLayout = function () {
            if (!this.oForm) {
                this._destroyElements();
                this.oForm = new SimpleForm("_formLayout", {
                    editable: true,
                    layout: "ResponsiveGridLayout",
                    maxContainerCols: 1,
                    columnsL: 1,
                    columnsM: 1,
                    labelSpanM: 1,
                    content: [
                        new Label({
                            text: this.oBundle.getText("output")
                        }).setTooltip(this.oBundle.getText("output")),

                        new HorizontalLayout({
                            content: [
                                new Select("__resultSelect", {

                                    width: "220px",
                                    items: {
                                        path: "settingModel>/results/resultsEnumeration",
                                        template: new Item({
                                            key: "{settingModel>id}",
                                            text: "{settingModel>label}"
                                        })
                                    },
                                    enabled: this.getProperty("enableSettingResult"),
                                    selectedKey: "{/ResultDataObjectId}",
									tooltip: this.oBundle.getText("chooseResultTooltip"),
                                    change: function (oEvent) {
                                        //Enabling Apply button if disabled
                                        var oDialog = this.getParent();
                                        var oApplyButton = oDialog.getButtons()[0];
                                        oApplyButton.setEnabled(true);

                                        var oSelect = oEvent.getSource();
                                        //Update flag of result DO change
                                        var modelData = this.getModel().getData();
                                        //Update flag of result DO change
                                        if (modelData.ResultDataObjectStatus !== "C") {
                                            modelData.ResultDataObjectId = oSelect.getSelectedKey();
                                            modelData.ResultDataObjectName = oSelect._getSelectedItemText();
                                            modelData.ResultDataObjectStatus = "U";
                                            //If same ResultDataObject selected, no updates to refresh button
                                            if (modelData.ResultDataObjectId !== oSelect.getSelectedKey()) {
                                                this._updateRefreshFlags(false, false, false);
                                            }
                                        }
                                        this._internalModel.setProperty("/resultDataObjectChanged", true);
                                        if (this.getExpressionLanguage() && this._internalModel.getProperty("/results/resultsEnumeration/0").id === "0") {
                                            this._internalModel.getProperty("/results/resultsEnumeration").splice(0, 1);
                                        }
                                        this._createPredefinedTable();
                                    }.bind(this)
                                }),

                                this._createRefreshButton()
                            ]
                        }),

                        new Label(),

                        this._createVerticalLayout()
                    ]
                }).addStyleClass("sapTextRuleSettingsForm");
            }

            this.oForm.setBusyIndicatorDelay(0);

            return this.oForm;
        };

        //Creates predefined table in the settings dialog
        oTextRuleSettings.prototype._createPredefinedTable = function () {
            if (!this.oPredefinedTable) {
                this.oPredefinedTable = new Table("idPredefinedTable", {
                    backgroundDesign: mobileLibrary.BackgroundDesign.Solid,
                    showSeparators: mobileLibrary.ListSeparators.All,
                    swipeDirection: mobileLibrary.SwipeDirection.Both,
                    /*layoutData: new GridContainerData({
                        halfGrid: false
                    }),*/
                    columns: [new Column({
                        width: "45%",
                        header: new Label({
                            text: this.oBundle.getText("PredefinedResultColumnHeaderText"),
                            design: mobileLibrary.LabelDesign.Bold
                        })
                    }), new Column({
                        width: "25%",
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
                    })]
                });
            }
            var bResultDataObjectChanged = this._internalModel.getProperty("/resultDataObjectChanged");
            var bResultDataObjectAttributesChanged = this._internalModel.getProperty("/refreshButtonClicked");
            var oModel = this.getModel("oDataModel");
            this._handleVisibilityForPredefinedResults();
            //For creating table when Result is not changed
            if (!bResultDataObjectChanged && !bResultDataObjectAttributesChanged) {
                this.oPredefinedTable.setModel(oModel);
                var bindingPath = [this.getModel("TextRuleModel").getProperty("/ruleBindingPath"), "/TextRule/TextRuleResults"].join("");
                this._bindPredefinedTable(bindingPath, "/TextRuleResults");
                this.oPredefinedTable.setBusyIndicatorDelay(0);
                return this.oPredefinedTable;
            } else {
                this._updatePredefinedTable(this.getModel().getData());
            }
            return null;
        };
        
        //handle visibility for predefined results section
        oTextRuleSettings.prototype._handleVisibilityForPredefinedResults = function () {
        	if (this.getModel() && !this.getModel().getProperty("/ResultDataObjectId")){
            	this.oPredefinedTable.setVisible(false);
            	if (Element.getElementById("id_HiddenAccessMessageStrip")) {
                    Element.getElementById("id_HiddenAccessMessageStrip").setVisible(false);
            	}
            	if (Element.getElementById("id_EditableAccessMessageStrip")) {
                    Element.getElementById("id_EditableAccessMessageStrip").setVisible(false);
                }
            } else{
            	this.oPredefinedTable.setVisible(true);
            	if (Element.getElementById("id_HiddenAccessMessageStrip")) {
                    Element.getElementById("id_HiddenAccessMessageStrip").setVisible(true);
            	}
            	if (Element.getElementById("id_EditableAccessMessageStrip")) {
                    Element.getElementById("id_EditableAccessMessageStrip").setVisible(true);
                }
            }
        };

        //Created Refresh button and handles press event
        oTextRuleSettings.prototype._createRefreshButton = function () {
            var _calcStatisticsMessage = function () { //returns null if no changes => we'll disable refresh button
                this._internalModel.setProperty("/refreshButtonEnabled", true, null, true);
                return this.oBundle.getText("textRuleRefreshWarning");
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
                enabled: "{settingModel>/refreshButtonEnabled}"
            }).setTooltip(this.oBundle.getText("refreshBtnTooltip"));
            this.refreshButton = oRefreshButton;
            return oRefreshButton;
        };

        oTextRuleSettings.prototype._createVerticalLayout = function () {
            var verticalLayout = new VerticalLayout("verticalLayout", {
                content: [
                    this._createInfoMessageStrip(this.oBundle.getText("TRPredefinedMessageStripHiddenAccessInfoText"), "id_HiddenAccessMessageStrip"),
                    this._createInfoMessageStrip(this.oBundle.getText("TRPredefinedMessageStripEditableAccessInfoText"),
                        "id_EditableAccessMessageStrip"),
                    this._createPredefinedTable()
                ]
            });
            return verticalLayout;
        };

        oTextRuleSettings.prototype._destroyElements = function () {
            if (Element.getElementById("_formLayout")) {
                Element.getElementById("_formLayout").destroy();
            }
            if (Element.getElementById("__elseCheckBox")) {
                Element.getElementById("__elseCheckBox").destroy();
            }
            if (Element.getElementById("__resultSelect")) {
                Element.getElementById("__resultSelect").destroy();
            }
            if (Element.getElementById("id_HiddenAccessMessageStrip")) {
                Element.getElementById("id_HiddenAccessMessageStrip").destroy();
            }
            if (Element.getElementById("id_EditableAccessMessageStrip")) {
                Element.getElementById("id_EditableAccessMessageStrip").destroy();
            }
            if (Element.getElementById("idPredefinedTable")) {
                Element.getElementById("idPredefinedTable").destroy();
            }
        };

        // Add Decision table specific data for converting the data to code to display and viceVersa.
        oTextRuleSettings.prototype._formRuleData = function (oContext, expression) {
            var oRuleId = oContext.getProperty("RuleId");
            var oVersion = oContext.getProperty("Version");

            var oRuleData = jQuery.extend({}, this.getModel().oData);
            if (!oRuleData) {
                oRuleData = {};
            }
            // Add dummy tags
            if (!oRuleData.DecisionTable) {
                oRuleData.DecisionTable = {};
            }
            oRuleData.Type = "DT";

            oRuleData.DecisionTable.metadata = {};
            // HardCoding values to DT because rule body validator and tags expects these tags
            oRuleData.DecisionTable.RuleID = oRuleId;
            oRuleData.DecisionTable.version = oVersion;
            oRuleData.DecisionTable.HitPolicy = "FM";

            // Add dummy tags
            oRuleData.DecisionTable.DecisionTableColumns = {};
            oRuleData.DecisionTable.DecisionTableColumns.results = [];
            oRuleData.DecisionTable.DecisionTableColumns.results.push({
                "metadata": {},
                "RuleId": oRuleId,
                "Id": 1,
                "Version": oVersion,
                "Sequence": 1,
                "Type": "CONDITION",
                "Condition": {
                    "metadata": {},
                    "RuleId": oRuleId,
                    "Id": 1,
                    "Version": oVersion,
                    "Expression": expression,
                    "Description": null,
                    "ValueOnly": false,
                    "FixedOperator": null
                },
                "Result": null
            });

            oRuleData.DecisionTable.DecisionTableRows = {};
            oRuleData.DecisionTable.DecisionTableRows.results = [];

            oRuleData.DecisionTable.DecisionTableColumnsCondition = {};
            oRuleData.DecisionTable.DecisionTableColumnsCondition.results = [];

            oRuleData.DecisionTable.DecisionTableColumnsResult = {};
            oRuleData.DecisionTable.DecisionTableColumnsResult.results = [];

            return oRuleData;
        };

        //Returns the Access Modes
        oTextRuleSettings.prototype._getAccessOptions = function () {
            var oAccessOptions = {
                accessEnumration: [{
                    key: Constants.KEY_EDITABLE,
                    value: Constants.EDITABLE
                }, {
                    key: Constants.KEY_HIDDEN,
                    value: Constants.HIDDEN
                }]
            };
            return oAccessOptions;
        };

        oTextRuleSettings.prototype._getASTExpressionBasic = function (oContext, expressionID, expression, businessDataType,
            attributeId, astNodes) {
            var that = this;
            var oAstExpressionLanguage = Element.getElementById(this.getAstExpressionLanguage());
            var sbusinessDataType = businessDataType ? businessDataType : library.ExpressionType.NonComparison;
            var sAstExpression = this._getExpressionFromAstNodes(oContext, astNodes);
            var attributeData = oContext.getObject(oContext.getPath());
	        var sAttributeId = attributeData.DataObjectAttributeId ? attributeData.DataObjectAttributeId : attributeData.Id;
            var sResultDataObjectId = this.getModel().getProperty("/ResultDataObjectId");
            var attributeInfo = "/" + sResultDataObjectId + "/" + this._formatAttributeId(sAttributeId);
            if(sAstExpression && sAstExpression.relString){
                sAstExpression.relString = sAstExpression.relString.replace(/\\/g,"\\\\").replace(/{/g, "\\{").replace(/}/g, "\\}");
            }
            var oASTExpressionBasic = new ASTExpressionBasic({
                id: expressionID,
                value: sAstExpression.relString ? sAstExpression.relString: "",
                placeholder: this.oBundle.getText("expressionPlaceHolder"),
                astExpressionLanguage: oAstExpressionLanguage,
                attributeInfo: attributeInfo,
                valueState: sAstExpression.valueState,
                change: function (oEvent) {
                    this.expressionControl = oEvent.getSource();
                    var model = oContext.getModel();
                    var astNodes = oEvent.getParameter("astNodes");
                    if (astNodes && astNodes.length === 1 && astNodes[0].Type === "I" && astNodes[0].Value !== "") {
                        this.expressionControl.setValueState("Error");
                    } else {
                        this.expressionControl.setValueState("None");
                    }
                    that._internalModel.setProperty("/resultAttributeChanged", true);
                    that._updateResultAttributeJSON(oContext, null, null, null, astNodes, false, false);
                    this.expressionControl._validateControl();
                }.bind(this)
            }).setBindingContext(oContext);

            return oASTExpressionBasic;
        };

        //Reads the selected ResultDataObject from Rule
        oTextRuleSettings.prototype._getCurrentResult = function () {
            var modelData = this.getModel().getData();
            var textRuleModel = this.getModel("TextRuleModel").getData();
            var oHeaderKey = {
                Id: textRuleModel.ruleId,
                Version: textRuleModel.ruleVersion
            };
            var oDataModel = this.getModel("oDataModel");
            var sPath = oDataModel.createKey("/Rules", oHeaderKey);
            modelData.ResultDataObjectId = oDataModel.getProperty(sPath + "/ResultDataObjectId");
            modelData.ResultDataObjectName = oDataModel.getProperty(sPath + "/ResultDataObjectName");
            modelData.ResultDataObjectStatus = "A";

            //Removing the blank entry from result Select as it is not a new rule
            if (this.getExpressionLanguage() && this._internalModel.getProperty("/results/resultsEnumeration/0").id === "0") {
                this._internalModel.getProperty("/results/resultsEnumeration").splice(0, 1);
            }
        };

        oTextRuleSettings.prototype._getExpressionFieldForPredefined = function (oContext, expressionID, expression,
            businessDataType, attributeId, astNodes) {
            var oExpressionControl;
            if (this.getAstExpressionLanguage()) {
                oExpressionControl = this._getASTExpressionBasic(oContext, expressionID, expression, businessDataType, attributeId, astNodes);
            } else {
                oExpressionControl = this._getPredefinedExpressionAdvanced(oContext, expressionID, expression, businessDataType, attributeId);
            }
            return oExpressionControl;
        };

        oTextRuleSettings.prototype._getExpressionFromAstNodes = function (oContext, astNodes) {
            var that = this;
            var oAstExpressionLanguage = Element.getElementById(this.getAstExpressionLanguage());
            var termsProvider = oAstExpressionLanguage._astBunldeInstance.TermsProvider.TermsProvider;
            var displayExpression = "";
            var sPath = oContext.getPath();
            var oData = oContext.getObject(sPath);
            var oAstUtil = oAstExpressionLanguage._astBunldeInstance.ASTUtil;
            oAstUtil.clearNodes();
            var astList = astNodes ? astNodes : oData.TextRuleResultASTs.__list;
            if (astList && astList.length > 0) {
                for (var entry in astList) {
                    var object = oContext.getObject("/" + astList[entry]) ? oContext.getObject("/" + astList[entry]) : astList[entry];
                    this._addNodeObject(object);
                }
                var astNodes = oAstUtil.getNodes();
                displayExpression = oAstUtil.toAstExpressionString(astNodes);

                if (astNodes && astNodes.length === 1 && astNodes[0].Type === "I") {
                    displayExpression.valueState = "Error";
                } else {
                    displayExpression.valueState = "None";
                }

            }
            return displayExpression;
        };

        //Returns the expression advanced field
        // eslint-disable-next-line
        oTextRuleSettings.prototype._getPredefinedExpressionAdvanced = function (oContext, expressionID, expression,
            businessDataType, attributeId) {
            var oExpressionLanguage = Element.getElementById(this.getExpressionLanguage());
            var sbusinessDataType = businessDataType ? businessDataType : library.ExpressionType.NonComparison;
            var that = this;
            return new ExpressionAdvanced({
                expressionLanguage: oExpressionLanguage,
                placeholder: this.oBundle.getText("expressionPlaceHolder"),
                validateOnLoad: true,
                id: expressionID,
                type: sbusinessDataType,
                value: expression,
                editable: true,
                attributeInfo: attributeId,
                change: function (oEvent) {
                    that.expressionControl = oEvent.getSource();
                    var oResult = that._getConvertedExpression(that.expressionControl.getValue(), true, oContext);
                    var astString = "";

                    if (oResult && oResult !== "") {
                        var parserResults = oResult.output.decisionTableData.DecisionTable.DecisionTableColumns.results["0"].Condition.parserResults;

                        if (parserResults && parserResults.status !== "Error") {
                            that._astUtils.Id = 0;
                            var sPath = oContext.getPath();
                            var astOutput = parserResults.converted.ASTOutput;
                            try {
                                astString = JSON.stringify(that._astUtils.parseConditionStatement(astOutput));
                                var aTextRuleConditionModelPropertyList = oContext.oModel.oMetadata.mEntityTypes["/TextRuleConditions"].property;
                                var nASTMaxLength = 0;
                                if (aTextRuleConditionModelPropertyList) {
                                    for (var nPropertyPos = 0; nPropertyPos < aTextRuleConditionModelPropertyList.length; nPropertyPos++) {
                                        if (aTextRuleConditionModelPropertyList[nPropertyPos].name === "AST") {
                                            nASTMaxLength = aTextRuleConditionModelPropertyList[nPropertyPos].maxLength;
                                        }
                                    }
                                    if (astString && astString.length > nASTMaxLength) {
                                        that._updateModelExpressionModelAst(sPath, oContext, astString);
                                    }
                                }

                            } catch (e) {
                                console.log("Exception while converting ast for expression" + that.expressionControl.getValue() + " :" + e.message);
                            }

                        }
                    }

                    this._internalModel.setProperty("/resultAttributeChanged", true);
                    this._updateResultAttributeJSON(oContext, null, that.expressionControl.getValue(), astString, [], false, false);
                }.bind(this)
            }).setBindingContext(oContext);
        };

        oTextRuleSettings.prototype._getConvertedExpression = function (expression, isCodeText, oContext) {
            var oExpressionLanguage = Element.getElementById(this.getExpressionLanguage());
            var oRuleData = this._formRuleData(oContext, expression);
            var oResult;
            if (isCodeText) {
                // Convert to code Text
                oResult = oExpressionLanguage.convertRuleToCodeValues(oRuleData);
            } else {
                // Convert to display Text
                oResult = oExpressionLanguage.convertRuleToDisplayValues(oRuleData);
            }
            return oResult;
        };

        //Returns the attribute's access mode
        oTextRuleSettings.prototype._getSelectedVisibilityStatus = function (sAccess) {
            if (sAccess === Constants.HIDDEN) {
                return Constants.KEY_HIDDEN;
            } else {
                return Constants.KEY_EDITABLE;
            }
        };

        //Initialises the settings model for TextRuleSettings
        oTextRuleSettings.prototype._initSettingsModel = function (oResultData) {
            var initialData = {};
            initialData.predefinedResults = [];
            initialData.results = oResultData;
            initialData.accessOptions = this._getAccessOptions();
            this._internalModel = new JSONModel(initialData);
            this.setModel(this._internalModel, "settingModel");
        };

        //Reads the DataObjects from vocabulary model for the result dropdown
        oTextRuleSettings.prototype._getResultsData = function (bnewRule) {
            var oExpressionLanguage;
			var oResultsData = {
                resultsEnumeration: []
            };
            if (this.getExpressionLanguage()) {
                oExpressionLanguage = Element.getElementById(this.getExpressionLanguage());
				oResultsData = {
                    resultsEnumeration: oExpressionLanguage.getResults()
                };
                oResultsData.resultsEnumeration.unshift({
                    id: "0",
                    name: "",
                    label: ""
                });
            } else {
                oExpressionLanguage = Element.getElementById(this.getAstExpressionLanguage());
				oResultsData = {
					resultsEnumeration: oExpressionLanguage.getResults()
				};
				oResultsData.resultsEnumeration.unshift({
					id: undefined,
					name: this.oBundle.getText("textRuleNoDefaultResult"),
					label: this.oBundle.getText("textRuleNoDefaultResult")
				});
            }
            
            this._initSettingsModel(oResultsData);
            if (bnewRule) {
                this._setDefaultResult();
            } else {
                this._getCurrentResult();
            }
            if (this.needCreateLayout) {
                var layout = this.getAggregation("mainLayout");
                if (layout) {
                    layout.destroy();
                }
                layout = this._createLayout();
                this.setAggregation("mainLayout", layout);
                this.needCreateLayout = false;
            }
        };

        //Factory function for creating predefined table on first load
        oTextRuleSettings.prototype._predefinedFactory = function (sId, oContext) {
            var colId = sId.split("-")[1];
            var expressionID = "exp" + colId;
            var label = oContext.getProperty("DataObjectAttributeLabel") ? oContext.getProperty("DataObjectAttributeLabel") : oContext.getProperty(
				"Label");
			var name = oContext.getProperty("DataObjectAttributeName") ? oContext.getProperty("DataObjectAttributeName") : oContext.getProperty(
				"Name");
			var displayText = label ? label : name;
            var attributeId = oContext.getProperty("DataObjectAttributeId") ? oContext.getProperty("DataObjectAttributeId") : oContext.getProperty(
                "Id");
            var expression;
            var ast;
            var businessDataType = oContext.getProperty("BusinessDataType");
            var sSelectedKey;
            var astNodes = [];
            var aAttributeList = this._internalModel.getProperty("/predefinedResults");
            var _convertASTNodeListToArray = function (astList) {
                var nodes = [];
                for (var node in astList) {
                    nodes.push(oContext.getObject("/" + astList[node]));
                }
                return nodes;
            };
            if (this._internalModel.getProperty("/resultDataObjectChanged")) {
                this._updateResultAttributeJSON(oContext, Constants.EDITABLE, "", "", [], true, false);
                sSelectedKey = Constants.EDITABLE;
                expression = "";
                ast = "";
            } else if (this._internalModel.getProperty("/refreshButtonClicked")) {
                var predefinedAttributes = aAttributeList[attributeId];
                sSelectedKey = predefinedAttributes ? predefinedAttributes.AccessMode : Constants.EDITABLE;
                expression = predefinedAttributes ? predefinedAttributes.Expression : "";
                ast = predefinedAttributes ? predefinedAttributes.AST : "";
                astNodes = predefinedAttributes ? predefinedAttributes.ASTNodes : [];
                this._updateResultAttributeJSON(oContext, sSelectedKey, expression, ast, astNodes, false, true);
            } else {
                expression = oContext.getProperty("Expression");
                ast = oContext.getProperty("AST");
                sSelectedKey = oContext.getProperty("AccessMode");
                astNodes = oContext.getProperty("TextRuleResultASTs");
                astNodes = _convertASTNodeListToArray(astNodes);
                this._updateResultAttributeJSON(oContext, sSelectedKey, expression, ast, astNodes, false, false);
            }

            var sAccessKey = this._getSelectedVisibilityStatus(sSelectedKey);
			var returnColListItem = false;
            if (this.getExpressionLanguage()) {
                if (businessDataType === Constants.DATE_BUSINESS_TYPE || businessDataType === Constants.TIMESTAMP_BUSINESS_TYPE || businessDataType === Constants.NUMBER || businessDataType ===
                    Constants.STRING || businessDataType === Constants.BOOLEAN_BUSINESS_TYPE || businessDataType === Constants.BOOLEAN_ENHANCED_BUSINESS_TYPE) {
                        returnColListItem = true;
                }
            } else {
                returnColListItem = true;
            }
            if (returnColListItem) {
				return new ColumnListItem({
                visible: true,
                cells: [
                    new Label({
                        visible: true, // boolean
                        design: mobileLibrary.LabelDesign.Standard, // sap.m.LabelDesign
                        text: displayText,
                        labelFor: expressionID,
                        textAlign: coreLibrary.TextAlign.Begin, // sap.ui.core.TextAlign
                        textDirection: coreLibrary.TextDirection.Inherit // sap.ui.core.TextDirection
                    }).setBindingContext(oContext),

                    new Select({
                        width: "65%",
                        id: "select" + colId,
                        items: {
                            path: "settingModel>/accessOptions/accessEnumration",
                            template: new Item({
                                key: "{settingModel>key}",
                                text: "{settingModel>value}"
                            })
                        },
                        selectedKey: sAccessKey,
                        change: function (oEvent) {
                            this._setColumnAccessMode(oContext, oEvent);
                        }.bind(this)

                    }).setBindingContext(oContext),

                    this._getExpressionFieldForPredefined(oContext, expressionID, expression, businessDataType, attributeId, astNodes)
                ]
            });
			}
            
        };

        //Sets default Result if it is a new rule
        oTextRuleSettings.prototype._setDefaultResult = function () {
            var modelData = this.getModel().getData();
            var resultsEnumeration = this._internalModel.getProperty("/results/resultsEnumeration");
            if (resultsEnumeration.length > 0) {
                modelData.ResultDataObjectId = resultsEnumeration[0].Id;
                modelData.ResultDataObjectName = resultsEnumeration[0].Name;
                modelData.ResultDataObjectStatus = "A";
            }

            //Enabling Apply button if disabled
            var oDialog = this.getParent();
            var oApplyButton = oDialog.getButtons()[0];
            oApplyButton.setEnabled(false);
            if (this.getExpressionLanguage()) {
                 oApplyButton.setEnabled(false);
            } else {
                 oApplyButton.setEnabled(true);
            }
        };

        //Changes the AccessMode for attribute and value state of corresponding expression advanced
        oTextRuleSettings.prototype._setColumnAccessMode = function (oContext, oEvent) {
            var oSelect = oEvent.getSource();
            var expId = "exp" + oEvent.getSource().sId.split("select")[1];
            this.expressionControl = Element.getElementById(expId);
            var sSelectedMode = oSelect.getSelectedKey();
            if (this.expressionControl instanceof ExpressionAdvanced) {
                if (sSelectedMode === Constants.KEY_HIDDEN) {
                    this.expressionControl.setValue("");
                    this.expressionControl.setValueStateText("");
                    this._updateResultAttributeJSON(oContext, Constants.HIDDEN, null, null, null, false, false);
                } else {
                    this.expressionControl.setValueStateText("");
                    this._updateResultAttributeJSON(oContext, Constants.EDITABLE, null, null, null, false, false);
                }
            } else {
                if (sSelectedMode === Constants.KEY_HIDDEN) {
                    this.expressionControl.setValue("");
                    this.expressionControl._input[0].textContent = "";
                    // publish event for choosing hidden
                    var expId = this.expressionControl.sId + "-input";
                    var obj = {
                        "expId": expId
                    };
                    
                    var oEventBus = EventBus.getInstance();
                    oEventBus.publish("sap.ui.rules", "_onHiddenSelected", obj);
                    this._updateResultAttributeJSON(oContext, Constants.HIDDEN, null, null, null, false, false);
                } else {
                    this.expressionControl._input[0].classList.remove("sapAstExpressionInputError");
                    this._updateResultAttributeJSON(oContext, Constants.EDITABLE, null, null, null, false, false);
                }
            }
            this._internalModel.setProperty("/resultAttributeChanged", true);
        };
        
        // Function to enable /disable Apply based on hidden attributes 
        oTextRuleSettings.prototype._updateApplyBtnActions = function() {
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

        //Reads DataObjectAttributes from the model for the new result DO
        oTextRuleSettings.prototype._updatePredefinedTable = function (oResultData) {
            if (this._internalModel.getProperty("/resultDataObjectChanged")) {
                this._internalModel.setProperty("/predefinedResults", []);
            }
            var oDataModel = this.getModel("oDataModel");
            var ruleData = this.getModel("TextRuleModel").getData();
            var sdataAttributesPath = "/DataObjects(VocabularyId='" + ruleData.projectId + "',Id='" + oResultData.ResultDataObjectId + "')";

            this.oPredefinedTable.setModel(oDataModel);
            this._bindPredefinedTable(sdataAttributesPath, "/ExpandedAttributes");
            this.oPredefinedTable.setBusyIndicatorDelay(0);
            return this.oPredefinedTable;
        };

        oTextRuleSettings.prototype._updateRefreshFlags = function (needRefresh, isEnabled, bButtonClicked) {
            this._internalModel.setProperty("/needToRefresh", needRefresh);
            this._internalModel.setProperty("/refreshButtonEnabled", isEnabled, null, true);
            /////////////////// Non ABAP Requires Predefined results table. Hence, calling function import before Apply/////////
            this._internalModel.setProperty("/refreshButtonClicked", bButtonClicked);
            this._callRefreshResultsFunctionImport();

        };

        //Updates the array of DataObjectAttributes with properties when result/AccessMode/Expression is changed
        oTextRuleSettings.prototype._updateResultAttributeJSON = function (oContext, sAccessMode, sExpression, sAst, astNodes,
                                                                                       bResultChanged, isRefreshed) {
           var sAttributeId = oContext.getProperty("DataObjectAttributeId") ? oContext.getProperty("DataObjectAttributeId") : oContext.getProperty(
                "Id");
            var sDataPath = "/predefinedResults/" + sAttributeId;
            if (this._internalModel.getProperty("/predefinedResults")) {
                if (this._internalModel.getProperty(sDataPath)) {
                    if (bResultChanged) {
                        this._internalModel.setProperty(sDataPath + "/AccessMode", Constants.EDITABLE);
                        this._internalModel.setProperty(sDataPath + "/Expression", "");
                        this._internalModel.setProperty(sDataPath + "/AST", "");
                        this._internalModel.setProperty(sDataPath + "/ASTNodes", []);
                        this._internalModel.setProperty(sDataPath + "/updatePredefinedResults", true);
                    }
                    if (isRefreshed) {
                        this._internalModel.setProperty(sDataPath + "/isAttributeinBackend", true);
                        this._internalModel.setProperty(sDataPath + "/AccessMode", sAccessMode);
                        this._internalModel.setProperty(sDataPath + "/Expression", sExpression);
                        this._internalModel.setProperty(sDataPath + "/AST", sAst);
                        this._internalModel.setProperty(sDataPath + "/ASTNodes", astNodes);
                        this._internalModel.setProperty(sDataPath + "/updatePredefinedResults", true);
                    }
                    if (!bResultChanged && !isRefreshed && sAccessMode) {
                        this._internalModel.setProperty(sDataPath + "/AccessMode", sAccessMode);
                        this._internalModel.setProperty(sDataPath + "/updatePredefinedResults", true);
                        if(sAccessMode === Constants.HIDDEN){
                            this._internalModel.setProperty(sDataPath + "/ASTExpressionCleared", true);
                        }
                    }
                    if (!bResultChanged && !isRefreshed && (sExpression || sExpression === "")) {
                        this._internalModel.setProperty(sDataPath + "/Expression", sExpression);
                        this._internalModel.setProperty(sDataPath + "/updatePredefinedResults", true);
                    }
                    if (!bResultChanged && !isRefreshed && (sAst || sAst === "")) {
                        this._internalModel.setProperty(sDataPath + "/AST", sAst);
                        this._internalModel.setProperty(sDataPath + "/updatePredefinedResults", true);
                    }
                    if (!bResultChanged && !isRefreshed && astNodes) {
                        this._internalModel.setProperty(sDataPath + "/ASTNodes", astNodes);
                        this._internalModel.setProperty(sDataPath + "/updatePredefinedResults", true);
                        // if hidden value is changed, mark that it has changed 
                        var oAccessMode = this._internalModel.getProperty(sDataPath + "/AccessMode");
                        var bASTExpressionCleared = this._internalModel.getProperty(sDataPath + "/ASTExpressionCleared");
                        var nAstNodesLength = astNodes.length;
                        if (oAccessMode === Constants.HIDDEN && bASTExpressionCleared) {
                        	if ((this.getAstExpressionLanguage() && nAstNodesLength > 0) || (this.getExpressionLanguage() && sExpression)) { 
                        		this._internalModel.setProperty(sDataPath + "/ASTExpressionCleared", false);
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
                    }
                } else {
                    this._internalModel.setProperty(sDataPath, oContext.getObject(oContext.sPath));
                    this._internalModel.setProperty(sDataPath + "/ASTNodes", astNodes);
                    if (bResultChanged) {
                        this._internalModel.setProperty(sDataPath + "/AccessMode", Constants.EDITABLE);
                        this._internalModel.setProperty(sDataPath + "/Expression", "");
                        this._internalModel.setProperty(sDataPath + "/AST", "");
                        this._internalModel.setProperty(sDataPath + "/ASTNodes", []);
                    }
                    if (isRefreshed) {
                        this._internalModel.setProperty(sDataPath + "/AccessMode", sAccessMode);
                        this._internalModel.setProperty(sDataPath + "/Expression", sExpression);
                        this._internalModel.setProperty(sDataPath + "/AST", sAst);
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

        //Returns the Buttons for the Settings Dialog
        oTextRuleSettings.prototype.getButtons = function (oDialog) {
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
					this._applySettingsModelChangesToOData(oDialog);
					this._applyButtonPressed = true;
				}
                //In case of successfull apply, the oDialog is closed from the success callback
            }, this);

            aButtons.push(oApplyBtn);
            aButtons.push(oCancelButton);

            return aButtons;
        };

        oTextRuleSettings.prototype.init = function () {
            this.oBundle = coreLib.getResourceBundleFor("sap.rules.ui.i18n");
            this.needCreateLayout = true; //Checks if layout already exists
            this.firstLoad = true; //Checks if dialog has been opened before for the rule
            this.setBusyIndicatorDelay(0);
            this._astUtils = AstYamlConverter;
            this._applyButtonPressed = false;
        };

        //Execution starts here (after init method)
        oTextRuleSettings.prototype.onBeforeRendering = function () {
            if (this.firstLoad) {
                var bnewRule = this.getProperty("newTextRule");
                this._getResultsData(bnewRule);
                this.firstLoad = false;
            }
        };
        
        //In case of reference object we will have attribues with ":" which should be replace by /
        oTextRuleSettings.prototype._formatAttributeId = function (attributeId) {
			var formattedAttributeId = attributeId;
			if(formattedAttributeId && formattedAttributeId.indexOf(":") > -1) {
				formattedAttributeId = formattedAttributeId.replace(/:/g, "/");
			}
			return formattedAttributeId
		};

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////           Closure - this code is relevant only when pressing "apply"             ////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        oTextRuleSettings.prototype._applySettingsModelChangesToOData = function (oDialog) {
            var that = this;
            var _displayModel = this.getModel();
            var oDataModel = this.getModel("oDataModel");
            var oTextRuleModel = this.getModel("TextRuleModel");
            var oSettingModel = this._internalModel;
            var sRuleId = oTextRuleModel.getProperty("/ruleId");
            var sRuleVersion = oTextRuleModel.getProperty("/ruleVersion");
            var sResultObjectId = _displayModel.getProperty("/ResultDataObjectId");
            var bResultChanged = oSettingModel.getProperty("/resultDataObjectChanged");
            var bAttributeChanged = oSettingModel.getProperty("/resultAttributeChanged");
            var bRefreshed = oSettingModel.getProperty("/refreshButtonClicked");
            var changesGroupID = {
                groupId: "changes"
            };
            var isNeedToSubmitChanges = false;
            var isNewTextRule = this.getProperty("newTextRule");
            var newTextRuleResults = [];

            var getTextRuleResults = function () {
                var bindingPath = [oTextRuleModel.getProperty("/ruleBindingPath"), "/TextRule/TextRuleResults"].join("");
                var mParameters = {
                    success: function (oData) {
                        oDataModel.setDeferredGroups([changesGroupID.groupId]);
                        newTextRuleResults = oData.results;
                        resultFunctionImportCallBack();
                        if (isNeedToSubmitChanges) {
                            oDataModel.submitChanges({
                                groupId: changesGroupID.groupId,
                                success: function () {
                                    oDialog.setBusy(false);
                                    oTextRuleModel.setProperty("/resultChanged", bResultChanged);
                                    oDialog.setState(coreLibrary.ValueState.Success);
                                    oDialog.close();
                                    return;
                                }
                            });
                        } else {
                            oDialog.setBusy(false);
                            oTextRuleModel.setProperty("/resultChanged", bResultChanged);
                            oDialog.setState(coreLibrary.ValueState.Success);
                            oDialog.close();
                        }
                    }
                };
                if (that.getAstExpressionLanguage()) {
                    mParameters.urlParameters = {
                        "$expand": "TextRuleResultASTs"
                    };
                }
                oDataModel.read(bindingPath, mParameters);
            };

            //Success CallBack for model submit changes
            var submitSuccess = function () {
                isNeedToSubmitChanges = false;
                if (bResultChanged) {
                    getTextRuleResults();
                } else {
                    oDialog.setBusy(false);
                    oTextRuleModel.setProperty("/resultChanged", bResultChanged);
                    oDialog.setState(coreLibrary.ValueState.Success);
                    oDialog.close();
                    MessageToast.show(that.oBundle.getText("settingsApplySuccess"));
                }

            };

            oDataModel.setDeferredGroups([changesGroupID.groupId]);

            //Parses the nodes generated from astEL to form understandable by backend
			var _updateModelAstNodes = function (astNodes, resultId) {
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

					if(astNodes[node].Type === "I") {
                        updatedAstNode.IncompleteExpression = astNodes[node].Value;
                    }

					if (astNodes[node].Type !== "P" && astNodes[node].Type !== "O" && !astNodes[node].Function) {
						updatedAstNode.BusinessDataType = astNodes[node].Output ? astNodes[node].Output.BusinessDataType : astNodes[node].BusinessDataType;
						updatedAstNode.DataObjectType = astNodes[node].Output ? astNodes[node].Output.DataObjectType : astNodes[node].DataObjectType;
						updatedAstNode.Value = astNodes[node].Value ? astNodes[node].Value : "";
					} else if (astNodes[node].Type === "O") {
						updatedAstNode.Reference = astNodes[node].Reference;
					}

					updatedAstNode.NodeId = astNodes[node].Id;
					updatedAstNode.Type = astNodes[node].Type;
					updatedAstNode.RuleId = sRuleId;
					updatedAstNode.RuleVersion = sRuleVersion;
					updatedAstNode.Id = resultId;

					var mParameters = {};
					mParameters.properties = updatedAstNode;
					mParameters.groupId = "changes";
					oDataModel.createEntry("/TextRuleResultASTs", mParameters);
				}
			};

			var _removeExistingAstNodes = function (id) {
				var mParameters = {};
				mParameters.Id = id;
				mParameters.RuleId = sRuleId;
				mParameters.RuleVersion = sRuleVersion;

				oDataModel.callFunction("/DeleteTextRuleResultASTDraft", {
					method: "POST",
					groupId: "changes",
					urlParameters: mParameters
				});
			};

            //Deletes the Extra TextRuleResult and TextRuleResultExpressions entries after refresh for deleted attributes
            var _deleteExtraEntries = function () {
                var aAttributeList = oSettingModel.getProperty("/predefinedResults");
                for (var attribute in aAttributeList) {
                    if (!aAttributeList[attribute].isAttributeinBackend) {
                        var oTextRuleResultData = {
                            RuleId: aAttributeList[attribute].RuleId,
                            RuleVersion: aAttributeList[attribute].RuleVersion,
                            Id: aAttributeList[attribute].Id
                        };

                        var sPath = oDataModel.createKey("/TextRuleResults", oTextRuleResultData);
                        var oContext = new Context(oDataModel, sPath);
                        oDataModel.deleteCreatedEntry(oContext);

                        var aResultExpressions = oTextRuleModel.getProperty("/textRuleResultExpressions");
                        for (var i = 0; i < aResultExpressions.length; i++) {
                            if (aResultExpressions[i].ResultId === aAttributeList[attribute].Id) {
                                var oTextRuleResultExpression = {
                                    RuleId: aAttributeList[attribute].RuleId,
                                    RuleVersion: aAttributeList[attribute].RuleVersion,
                                    ResultId: aAttributeList[attribute].Id,
                                    ConditionId: aResultExpressions[i].ConditionId
                                };
                                sPath = oDataModel.createKey("/TextRuleResultExpressions", oTextRuleResultExpression);
                                oContext = new Context(oDataModel, sPath);
                                oDataModel.deleteCreatedEntry(oContext);
                            }
                        }
                    }
                }
            };

            //Handles new TextRule creation
            var _createNewRuleODataEntries = function () {
                var mParameters = {};
                var oTextRule = {
                    RuleId: sRuleId,
                    RuleVersion: sRuleVersion
                };
                var sTextRulePath = oDataModel.createKey("/TextRules", oTextRule);

                if (!oDataModel.getProperty(sTextRulePath)) {
                    //CreateEntry TextRule
                    mParameters.properties = oTextRule;
                    oDataModel.createEntry("/TextRules", mParameters);
                }

                //Create TextRuleCondition If
                var oTextRuleConditon = {
                    RuleId: sRuleId,
                    RuleVersion: sRuleVersion,
                    Sequence: 1
                };
                mParameters.properties = oTextRuleConditon;
                oDataModel.createEntry("/TextRuleBranches", mParameters);

            };

            //Called when Result Attributes properties are modified
            var _updateModelPredefinedResultAttributes = function () {
                var newResultJsonObjects = oSettingModel.getProperty("/predefinedResults");
                if (newResultJsonObjects) {
                    var attribute;
                    for (attribute in newResultJsonObjects) {
                        if (newResultJsonObjects[attribute].updatePredefinedResults) {
                            isNeedToSubmitChanges = true;
                            var sAccessMode = newResultJsonObjects[attribute].AccessMode;
                            var sExpression = newResultJsonObjects[attribute].Expression ? newResultJsonObjects[attribute].Expression : "";
                            var sAst = newResultJsonObjects[attribute].AST ? newResultJsonObjects[attribute].AST : "";
                            var attrId = attribute.replace(/:/g, "%3A");
                            var updateURLPath = "/PredefinedResults(RuleId='" + sRuleId + "',DataObjectAttributeId='" + attrId + "')";
                            var predefinedResultsBody = {
                                AccessMode: sAccessMode,
                                AST: sAst,
                                Type: "TextRule"
                            };
				
							var mParameters = {
								groupId: changesGroupID.groupId
							};

                            if (that.getAstExpressionLanguage() && newResultJsonObjects[attribute].ASTNodes) {
                                var resultId = newResultJsonObjects[attribute].Id;
                                //If result has been changed, json will hold attribute id.
                                if (bResultChanged || bRefreshed) {
                                    for (var result in newTextRuleResults) {
                                        if (newTextRuleResults[result].DataObjectAttributeId === attribute) {
                                            resultId = newTextRuleResults[result].Id;
                                            break;
                                        }
                                    }
                                }
                                var updateResultPath = "/TextRuleResults(RuleId='" + sRuleId + "',RuleVersion='" + sRuleVersion + "',Id='" + resultId + "')";
                                var resultBody = {
                                    BusinessDataType: newResultJsonObjects[attribute].BusinessDataType
                                };
                                //Update call to textrule result in case ast id doesnt exist
                                oDataModel.update(updateResultPath, resultBody, mParameters);
                                _removeExistingAstNodes(resultId);
                                _updateModelAstNodes(newResultJsonObjects[attribute].ASTNodes, resultId);
                            } else {
                                predefinedResultsBody.Expression = sExpression;
                            }

							//Update predefined will work on ast nodes created before this call
							oDataModel.update(updateURLPath, predefinedResultsBody, mParameters);
			   				
                        }
                    }
                }
            };

            //Called when Result DO is changed
            var _updateModelResultObject = function () {
                oDataModel.callFunction("/SetRuleResultDataObject", {
                    method: "POST",
                    groupId: changesGroupID.groupId,
                    urlParameters: {
                        RuleId: sRuleId,
                        ResultDataObjectId: sResultObjectId
                    }
                });
            };

            //If attributes of DO differ from existing column results, create or delete columns accordingly
            var _refreshRuleResultDataObject = function () {
                oDataModel.callFunction("/RefreshRuleResultDataObject", {
                    method: "POST",
                    groupId: changesGroupID.groupId,
                    urlParameters: {
                        RuleId: sRuleId
                    }
                });
            };

            /////////////////////////////////////////////////////// Main Flow ////////////////////////////////////////////////////
            oDialog.setBusy(true);

            var resultFunctionImportCallBack = function () {
                //When only Attributes are modified and Result DO is unchanged
                if (bAttributeChanged) {
                    _updateModelPredefinedResultAttributes();
                }

                var needToRefresh = oSettingModel.getProperty("/needToRefresh");
                if (needToRefresh) {
                    isNeedToSubmitChanges = true;
                    _refreshRuleResultDataObject();
                }

                if (isNewTextRule) {
                    isNeedToSubmitChanges = true;
                    _createNewRuleODataEntries();
                }
            };

            if (bRefreshed) {
                _deleteExtraEntries();
            }

            if (bResultChanged) { //Result DO is changed
                isNeedToSubmitChanges = true;
                _updateModelResultObject();
            } else if (bRefreshed) {
                getTextRuleResults();
            } else {
                resultFunctionImportCallBack();
            }

            var mParameters = {};
            mParameters.success = submitSuccess;
            mParameters.groupId = changesGroupID.groupId;
            if (isNeedToSubmitChanges) {
                //Save changes to backend
                oDataModel.submitChanges(mParameters);
                if (!bResultChanged) {
                    return;
                }
            } else if (!bRefreshed && !bResultChanged && !bAttributeChanged) {
                oDialog.setState(coreLibrary.ValueState.Success);
                oDialog.setBusy(false);
                oDialog.close();
                MessageToast.show(this.oBundle.getText("settingsApplySuccess"));
            }
        };

        return oTextRuleSettings;

    }, /* bExport= */ true);

