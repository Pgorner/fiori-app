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
    "sap/m/Link",
    "sap/m/Dialog",
    "sap/ui/layout/VerticalLayout",
    "sap/m/Button",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/SearchField",
    "sap/ui/core/Lib",
    "sap/ui/core/Element",
    "./AutoSuggestionTimeAndDurationFunctionPanelRenderer"
], function (jQuery, library, Control, List, JSONModel, mobileLibrary, CustomData, Sorter, infraUtils, DisplayListItem, Panel, Link, Dialog, VerticalLayout, Button, Filter, FilterOperator, SearchField, coreLib, Element, AutoSuggestionTimeAndDurationFunctionPanelRenderer) {
    "use strict";

    var ListMode = mobileLibrary.ListMode;
    var autoSuggestionTimeAndDurationFunctionPanel = Control.extend(
        "sap.rules.ui.ast.autoCompleteContent.AutoSuggestionTimeAndDurationFunctionPanel", {
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
                this._dialogOpenedCallbackReference = this.getDialogOpenedCallbackReference();
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
                this.vocabularyData = this.getData();
                // create a Model with this data
                var model = new JSONModel();

                // create a list 
                this.timeAndDurationFunctionlist = new List({
                    growingScrollToLoad: true,
                    enableBusyIndicator: true,
                });

                /*Setting growing shows the growing trigger button with text as 2/14 which we do not need
            Hence, setting to top 5 and the rest will be shown in More link */
                var topFiveVocabularyData = [];
                for (var termCount = 0; termCount < 5 && termCount < this.vocabularyData.length; termCount++) {
                    topFiveVocabularyData.push(this.vocabularyData[termCount]);
                }
                model.setData(topFiveVocabularyData);

                // bind the List items to the data collection
                this.timeAndDurationFunctionlist.bindItems({
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
                this.timeAndDurationFunctionlist.setModel(model);
                var moreTimeAndDurationLink = this.getMoreTimeAndDurationLink();
                var that = this;

                // add list to the panel
                var timeAndDurationFunctionslistPanel = new Panel({
                    headerText: this.oBundle.getText("timeAndDurationFunctionsPanelTitle"),
                    expandable: true,
                    expanded: this.getExpand(),
                    content: this.timeAndDurationFunctionlist,
                    width: "auto"
                });

                if (this.vocabularyData.length >= 5) {
                    timeAndDurationFunctionslistPanel.addContent(moreTimeAndDurationLink);
                }

                return timeAndDurationFunctionslistPanel;
            },

            getMoreTimeAndDurationLink: function () {
                var that = this;
                var suggestionsData = this.getData();
                var moreTimeAndDurationLink = new Link({
                    text: this.oBundle.getText("more_link"),
                    tooltip: this.oBundle.getText("more_link_tooltip"),
                    enabled: true,
                    press: function (oEvent) {
                        that._setModal(true);
                        that._dialogOpenedCallbackReference(true);
                        if (that.vocabularyData) {
                            that.getTimeAndDurationDialog();
                        }
                    }
                });
                return moreTimeAndDurationLink;

            },

            _setModal: function (value) {
                var pop = Element.getElementById("popover");
                if (pop) {
                    pop.setModal(value);
                }
            },

            getTimeAndDurationDialog: function () {
                var that = this;
                var searchFieldText = this.oBundle.getText("searchTextTimeAndDuration");
                var searchField = this.getSearchField(searchFieldText);
                this.detailedTimeAndDurationList = this.initializeTimeAndDurationList(this.vocabularyData);
                this.bindFilteredTermsToList(this.detailedTimeAndDurationList, "", false);
                var verticalLayoutForTimeAndDurationFunction = new VerticalLayout({
                    content: [searchField, that.detailedTimeAndDurationList]
                }).addStyleClass("sapAstVocabularyPanel");

                this.timeAndDurationDialog = new Dialog({
                    title: this.oBundle.getText("selectTimeAndDurationTitle"),
                    contentWidth: "500px",
                    contentHeight: "500px",
                    showHeader: true,
                    content: [verticalLayoutForTimeAndDurationFunction],
                    afterClose: function () {
                        that._dialogOpenedCallbackReference(false);
                    },
                    buttons: [
                        new Button({
                            text: this.oBundle.getText("cancelBtn"),
                            tooltip: this.oBundle.getText("cancelBtn"),
                            press: function (event) {
                                that._setModal(false);
                                that.timeAndDurationDialog.close();
                            }
                        })
                    ]
                });
                that.timeAndDurationDialog.open();

            },

            bindFilteredTermsToList: function (oList, searchText, requireSearch) {
                var model = new JSONModel(this.vocabularyData);

                var that = this;
                var datapath = "/";
                if (!oList) {
                    oList = new List({});
                }
                oList.setModel(model);
                oList.bindItems({
                    path: datapath,
                    template: new DisplayListItem({
                        label: "{name}",
                        value: "{label}",
                        type: "Active",
                        press: function (oEvent) {
                            that._setModal(false);
                            if (that.timeAndDurationDialog.isOpen()) {
                                that.timeAndDurationDialog.close();
                            }
                            that._reference(oEvent);
                        }
                    }),
                    rememberSelections: false,
                    mode: ListMode.SingleSelectMaster
                });
                if (requireSearch) {
                    var filterArray = [];
                    var filterProperty = "name";
                    filterArray.push(new Filter(filterProperty, FilterOperator.Contains, searchText));
                    oList.getBinding("items").filter(filterArray);
                    oList.getModel().refresh(true);
                }
            },

            initializeTimeAndDurationList: function (vocabularyData) {
                var model = new JSONModel(vocabularyData);
                var datapath = "/";
                var timeAndDurationlist = new List({
                    headerText: this.oBundle.getText("timeAndDuration")
                });
                timeAndDurationlist.setModel(model);
                timeAndDurationlist.bindItems({
                    path: datapath,
                    template: new DisplayListItem({
                        label: "{name}",
                        value: "{label}",
                        type: "Active",
                    })

                });
                return timeAndDurationlist;
            },

            getSearchField: function (placeHolderText) {
                var that = this;
                this.searchField = new SearchField({
                    showSearchButton: false,
                    width: "462px",
                    placeholder: placeHolderText, //searchType,
                    liveChange: function (oEvent) {
                        that.bindFilteredTermsToList(that.detailedTimeAndDurationList, oEvent.getParameter("newValue"), true);
                    }
                })
                return this.searchField;
            },
            renderer: AutoSuggestionTimeAndDurationFunctionPanelRenderer

        });

    return autoSuggestionTimeAndDurationFunctionPanel;
}, /* bExport= */ true);