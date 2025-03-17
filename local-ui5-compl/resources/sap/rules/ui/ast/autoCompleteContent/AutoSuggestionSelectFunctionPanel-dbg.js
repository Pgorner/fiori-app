sap.ui.define([
    "sap/ui/thirdparty/jquery",
    "../../library",
    "sap/ui/core/Control",
    "sap/m/List",
    "sap/ui/model/json/JSONModel",
    "sap/m/library",
    "sap/ui/core/CustomData",
    "sap/ui/model/Sorter",
    "sap/rules/ui/ast/util/utilsBase",
    "sap/ui/core/LocaleData",
    "sap/rules/ui/Constants",
    "sap/rules/ui/services/AstExpressionLanguage",
    "sap/rules/ui/ast/util/SelectFunctionDialog",
    "sap/m/Panel",
    "sap/m/Link",
    "sap/ui/core/Lib",
    "sap/ui/core/Element",
    "./AutoSuggestionSelectFunctionPanelRenderer"

], function (jQuery, library, Control, List, JSONModel, mobileLibrary, CustomData, Sorter, infraUtils,
    LocaleData, Constants, AstExpressionLanguage, SelectFunctionDialog, Panel, Link, coreLib, Element, AutoSuggestionSelectFunctionPanelRenderer) {
    "use strict";

    var ListMode = mobileLibrary.ListMode;
    var autoSuggestionSelectFunctionPanel = Control.extend("sap.rules.ui.ast.autoCompleteContent.AutoSuggestionSelectFunctionPanel", {
        metadata: {
            library: "sap.rules.ui",
            properties: {
                reference: {
                    type: "object",
                    defaultValue: null,
                },
                dialogOpenedCallbackReference: {
                    type: "object",
                    defaultValue: null,
                },
                data: {
                    type: "object",
                    defaultValue: null
                }
            },
            aggregations: {
                PanelLayout: {
                    type: "sap.m.Panel",
                    multiple: false
                }
            },
            associations: {

                astExpressionLanguage: {
                    type: "sap.rules.ui.services.AstExpressionLanguage",
                    multiple: false,
                    singularName: "astExpressionLanguage"
                }

            },
            events: {}
        },

        init: function () {
			this.oBundle = coreLib.getResourceBundleFor("sap.rules.ui.i18n");
            this.selectFunctionDialog = SelectFunctionDialog.getInstance();
            this._oAstExpressionLanguage = new AstExpressionLanguage();
            this.needCreateLayout = true;
            // this._oAstExpressionLanguage = sap.ui.getCore().byId(this.getAstExpressionLanguage());

        },
        onBeforeRendering: function () {
            this._reference = this.getReference();
            this._dialogOpenedCallbackReference = this.getDialogOpenedCallbackReference();
            if (this.needCreateLayout) {
                var layout = this._createLayout();
                this.setAggregation("PanelLayout", layout, true);
                this.needCreateLayout = false;
            }
        },

        onAfterRendering: function () {
            this._oAstExpressionLanguage = Element.getElementById(this.getAstExpressionLanguage());
        },
        initializeVariables: function () {

        },
        _createLayout: function () {
            var that = this;
            var selectFunctionsPanel = new Panel({
                expandable: false,
                expanded: true,
				width: "auto",
                content: [new Link({
                    wrapping: true,
                    text: this.oBundle.getText("selectFunctionPanelTitle"),
                    press: function (oEvent) {
                        that._dialogOpenedCallbackReference(true);
						that._setModal(true);
                        that.selectFunctionDialog._createSelectFunctionDialog(that.getData(), that._reference, that._oAstExpressionLanguage, that._dialogOpenedCallbackReference);
                    }
                })]
            })
            return selectFunctionsPanel;
        },
		
		_setModal: function (value) {
            var pop = Element.getElementById("popover");
            if (pop) {
                pop.setModal(value);
            }
        },
        renderer: AutoSuggestionSelectFunctionPanelRenderer
    });

    return autoSuggestionSelectFunctionPanel;
}, /* bExport= */ true);