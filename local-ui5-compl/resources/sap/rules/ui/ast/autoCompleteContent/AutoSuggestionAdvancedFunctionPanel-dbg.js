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
    "sap/m/DisplayListItem",
    "sap/m/Panel",
    "sap/ui/core/Lib",
    "./AutoSuggestionAdvancedFunctionPanelRenderer"
], function (jQuery, library, Control, List, JSONModel, mobileLibrary, CustomData, Sorter, infraUtils, DisplayListItem, Panel, coreLib, AutoSuggestionAdvancedFunctionPanelRenderer) {
    "use strict";

	var ListMode = mobileLibrary.ListMode;
	
    var autoSuggestionAdvancedFunctionPanel = Control.extend(
        "sap.rules.ui.ast.autoCompleteContent.AutoSuggestionAdvancedFunctionPanel", {
            metadata: {
                library: "sap.rules.ui",
                properties: {
                    reference: {
                        type: "object",
                        defaultValue: null,
                    },
                    data: {
                        type: "object",
                        defaultValue: null
                    },
                    expand: {
                        type: "boolean",
                        defaultValue: false
                    }
                },
                aggregations: {
                    PanelLayout: {
                        type: "sap.m.Panel",
                        multiple: false
                    }
                },
                events: {}
            },

            init: function () {
				this.oBundle = coreLib.getResourceBundleFor("sap.rules.ui.i18n");
                this.infraUtils = new infraUtils.utilsBaseLib();
                this.needCreateLayout = true;
                this.AttributeSegmentSelected = true;
                this.dataObjectName = "";
            },
            onBeforeRendering: function () {
                this._reference = this.getReference();
                if (this.needCreateLayout) {
                    var layout = this._createLayout();
                    this.setAggregation("PanelLayout", layout, true);
                    this.needCreateLayout = false;
                }
            },

            initializeVariables: function () {

            },

            _createLayout: function () {
                var that = this;
                var vocabularyData = this.getData();
                // create a Model with this data
                var model = new JSONModel();
                model.setData(vocabularyData);

                // create a list 
                this.advancedFunctionlist = new List({
                    growing: true,
                    growingScrollToLoad: true,
                    enableBusyIndicator: true,
                });

                // bind the List items to the data collection
                this.advancedFunctionlist.bindItems({
                    path: "/",
                    sorter: new Sorter("name"),
                    rememberSelections: false,
                    mode: ListMode.SingleSelectMaster,
                    template: new DisplayListItem({
                        label: "{name}",
                        value: "{label}",
                        type: "Active",
                        press: function (oEvent) {
                            that._reference(oEvent);
                        }
                    })
                });

                // set the model to the List, so it knows which data to use
                this.advancedFunctionlist.setModel(model);
                var that = this;

                // add list to the panel
                var advancedFunctionslistPanel = new Panel({
                    headerText: this.oBundle.getText("advancedFunctionPanelTitle"),
                    expandable: true,
                    expanded: this.getExpand(),
                    content: this.advancedFunctionlist,
					width: "auto"
                });

                return advancedFunctionslistPanel;
            },
            renderer: AutoSuggestionAdvancedFunctionPanelRenderer
   
        });

    return autoSuggestionAdvancedFunctionPanel;
}, /* bExport= */ true);