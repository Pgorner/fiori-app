/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */

// Provides control sap.rules.ui.AstExpressionBasic.
sap.ui.define([
    "sap/ui/thirdparty/jquery",
    "./library",
    "sap/rules/ui/Utils",
    "sap/rules/ui/AstExpressionBasic",
    "sap/rules/ui/Constants",
    "sap/ui/core/library",
    "sap/ui/core/EventBus",
    "sap/ui/core/Lib",
    "sap/ui/core/Element",
    "./DecisionTableCellAstExpressionBasicRenderer"
], function (jQuery, library, Utils, AstExpressionBasic, Constants, coreLibrary, EventBus, coreLib, Element, DecisionTableCellAstExpressionBasicRenderer) {
    "use strict";

    /**
     * Constructor for a new DecisionTableCellAstExpressionBasic sap.rules.ui.AstExpressionBasic.
     *
     * @param {string} [sId] id for the new control, generated automatically if no id is given
     * @param {object} [mSettings] initial settings for the new control
     *
     * @class
     * The <code>sap.rules.ui.DecisionTableCellAstExpressionBasic</code> control provides the ability to define expressions for complex rules in a decision table.
     * @extends  sap.rules.ui.AstExpressionBasic
     *
     * @author SAP SE
     * @version 1.132.0
     *
     * @constructor
     * @private
     * @alias sap.rules.ui.DecisionTableCellAstExpressionBasic
     * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
     */
    var DecisionTableCellAstExpressionBasic = AstExpressionBasic.extend("sap.rules.ui.DecisionTableCellAstExpressionBasic", {
        metadata: {

            library: "sap.rules.ui",
            properties: {
                /**
                 * Defines the header value of the control.
                 */
                headerValue: {
                    type: "string",
                    defaultValue: "",
                    bindable: "bindable"
                },
                /**
                 * Defines the fixed operator value of the control.
                 */
                fixedOperator: {
                    type: "string",
                    defaultValue: "",
                    bindable: "bindable"
                },
                type: {
                    type: "sap.rules.ui.ExpressionType",
                    defaultValue: library.ExpressionType.BooleanEnhanced,
                    bindable: "bindable"
                }
            }
        },
        
        renderer: DecisionTableCellAstExpressionBasicRenderer
    });

    DecisionTableCellAstExpressionBasic.prototype.validateExpression = function () {
        var expressionValue = this.getValue();
        if (expressionValue) {
            var sValue = this.getHeaderValue() + " " + this.getFixedOperator() + " " + expressionValue;
            //sap.rules.ui.AstExpressionBasic.prototype.validateExpression.apply(this, [sValue]);
        } else {
            this.setValueStateText("");
        }
    };

    DecisionTableCellAstExpressionBasic.prototype.init = function () {
        AstExpressionBasic.prototype.init.apply(this, arguments);
        this.bFlagForChangeBeforeBlur = false;
		this.oBundle = coreLib.getResourceBundleFor("sap.rules.ui.i18n");
    };

    DecisionTableCellAstExpressionBasic.prototype.onAfterRendering = function () {
        var that = this;
        this._oAstExpressionLanguage = Element.getElementById(this.getAstExpressionLanguage());
        AstExpressionBasic.prototype.onAfterRendering.apply(this, arguments);
        this.oDecisionTableCell = (this.getParent() && this.getParent().getParent()) ? this.getParent().getParent() : null;
        this._handleValidation();
        if (jQuery(document.getElementById(this.getId())).closest('td').next().width()) {
            this._showPopUp();
        }
        if (this.oDecisionTableCell) {
            this.markerString = this.oDecisionTableCell._getMarkerString().trim();
            var valueStatePath = this.oDecisionTableCell.getValueStatePath();
            var dtModel = this.oDecisionTableCell.getModel("dtModel");
            var oDisplayedControl = this.oDecisionTableCell.getAggregation("_displayedControl");
            if (oDisplayedControl) {
                dtModel.setProperty(valueStatePath.slice(8), coreLibrary.ValueState.None);
            }
        }
    };

    DecisionTableCellAstExpressionBasic.prototype._handleValidation = function () {
        this.validateExpression();
        //TODO: add error popup
        /*this._showErrorMessage();
        if (this.getProperty("valueStateText") && this.codeMirror) {
            this.codeMirror.options.expressionEditor._showPopUp();
        }*/
    };

    DecisionTableCellAstExpressionBasic.prototype.exit = function () {
        //sap.rules.ui.AstExpressionBasic.prototype.exit.apply(this, arguments);
        this._handleValidation();
        if (this.bFocusCellAfterEscape && this.oDecisionTableCell) {
            var oHTMLParent = this.oDecisionTableCell.getDomRef().parentElement.parentElement;
            if (oHTMLParent) {
                jQuery(oHTMLParent).focus();
            }
        }

    };

    // Event Listeners for integration between [Code Mirror - AstExpressionBasic - popover - DTCell] to work together in all browsers and OS
    DecisionTableCellAstExpressionBasic.prototype.createEventListeners = function () {

    };

    DecisionTableCellAstExpressionBasic.prototype._updateModelAstNodes = function (oModel, oColumnData, sGroupId) {
        if (this.oDecisionTableCell) {
            var astNodes = oColumnData.ASTNodes;
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
                updatedAstNode.RuleId = oColumnData.RuleId;
                updatedAstNode.Version = oColumnData.Version;
                updatedAstNode.ColId = oColumnData.ColId;
                updatedAstNode.RowId = oColumnData.RowId;

                var mParameters = {};
                mParameters.properties = updatedAstNode;
                mParameters.groupId = sGroupId;
                oModel.createEntry("/DecisionTableRowCellASTs", mParameters);
            }
        }
    };

    DecisionTableCellAstExpressionBasic.prototype._removeExistingAstNodes = function (oModel, oColumnData, sPath, astNodes, sGroupId) {
		if (this.oDecisionTableCell) {
			var mParameters = {};
			mParameters.ColId = oColumnData.ColId;
			mParameters.RowId = oColumnData.RowId;
			mParameters.RuleId = oColumnData.RuleId;
			mParameters.Version = oColumnData.Version;

			var keyParatamters;
			var astNodesListPath = [];
			var sAstNodePath;
			if (astNodes && astNodes.length > 0) {
				for (var iterator = 0; iterator < astNodes.length; iterator++) {
					keyParatamters = {};
					keyParatamters.ColId = oColumnData.ColId;
					keyParatamters.RowId = oColumnData.RowId;
					keyParatamters.RuleId = oColumnData.RuleId;
					keyParatamters.Version = oColumnData.Version;
					keyParatamters.NodeId = astNodes[iterator].Id;
					sAstNodePath = oModel.createKey("DecisionTableRowCellASTs", keyParatamters);
					astNodesListPath.push(sAstNodePath);
				}
			}
			if (sPath && oModel.getProperty(sPath) && "DecisionTableRowCellASTs" in oModel.getProperty(sPath) && oModel.getProperty(sPath).DecisionTableRowCellASTs &&
				"__list" in oModel.getProperty(sPath).DecisionTableRowCellASTs) {
				oModel.getProperty(sPath).DecisionTableRowCellASTs.__list = astNodesListPath;
			}

			oModel.callFunction("/DeleteDTRowCellASTDraft", {
				method: "POST",
				groupId: sGroupId,
				urlParameters: mParameters
			});

		}
	};

    /*
    Ast nodes must not be created if cell value is empty
    1.Nodes contains one Incomplete node and has value === "" or marker string
    2. Only one node exists and it is a marker node
    Value will be empty in error node in case there is no condition in header and cell value is empty
    This method checks if either of above conditions is true, then nodes are not created on firechange
     */
    DecisionTableCellAstExpressionBasic.prototype._checkEmptyMarkerNode = function (astNodes) {
        if (astNodes && astNodes.length === 1 && ((astNodes[0].Type === "I" && (astNodes[0].Value === "" || astNodes[0].Value === this.markerString)) ||
            astNodes[0].Type === "M")) {
            return false;
        }
        return true;
    };

    DecisionTableCellAstExpressionBasic.prototype._removeAndUpdateExisitingNodes = function (oModel, oData, sPath, astNodes,sCellContentPath) {
	    	var sGroupId = oData.RowId + "," + oData.ColId;
		oModel.setDeferredGroups([sGroupId]);
		var oEventBus = EventBus.getInstance();
		oModel.update(sPath, {
			"Content": oModel.getProperty(sCellContentPath)
		}, {
			groupId: sGroupId,
			success: function (oData) {
                oEventBus.publish("sap.ui.rules", "astCreated");
            }
		});
		this._removeExistingAstNodes(oModel, oData, sPath, astNodes, sGroupId);
		if (this._checkEmptyMarkerNode(astNodes)) {
			this._updateModelAstNodes(oModel, oData, sGroupId);
		}
		oModel.submitChanges({
			groupId: sGroupId
		});
	};

    DecisionTableCellAstExpressionBasic.prototype._changeValue = function (oEvent) {
		var oData = {};
		if (this.oDecisionTableCell) {
			var oSource = oEvent.getSource();
			var oEventBus = EventBus.getInstance();
			var sValue = oEvent.getParameter("newValue");
			oSource.setValue(sValue);
			var dtInput = this.oDecisionTableCell.getAggregation("_displayedControl");
			dtInput.setValue(oEvent.getParameter("displayText"));
			dtInput.JSON = this.getJsonData();
			dtInput.relString = this.relString;
			var oAstExpressionLanguage = Element.getElementById(this.getAstExpressionLanguage());
			var oModel = this.getBindingContext().getModel();
			oData = this.oDecisionTableCell.getKeyProperties();
			var astNodes = oEvent.getParameter("astNodes");
			if (astNodes && astNodes.length === 1 && astNodes[0].Type === "I" && astNodes[0].Value !== "" && astNodes[0].Value !== this.markerString) {
				dtInput.setValueState("Error");
				dtInput.setTooltip(this.oBundle.getText("invalidExpression"));
			} else {
				dtInput.setValueState("None");
			}
			oData.ASTNodes = astNodes;
			var sCellContentPath = this.oDecisionTableCell.getValuePath();
			var sPath = "/" + sCellContentPath.split("/")[1];
			oEventBus.publish("sap.ui.rules", "astCreating");
			this._removeAndUpdateExisitingNodes(oModel, oData, sPath, astNodes,sCellContentPath);
			
		}
	};

    return DecisionTableCellAstExpressionBasic;

}, /* bExport= */ true);
