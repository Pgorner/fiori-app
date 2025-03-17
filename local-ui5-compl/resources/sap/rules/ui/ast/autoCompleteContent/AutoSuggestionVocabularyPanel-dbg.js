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
	"sap/m/Panel",
	"sap/ui/layout/HorizontalLayout",
	"sap/m/Label",
	"sap/m/Link",
	"sap/m/Select",
	"sap/m/TextArea",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/CustomListItem",
	"sap/m/DisplayListItem",
	"sap/ui/layout/VerticalLayout",
	"sap/m/SegmentedButton",
	"sap/m/SegmentedButtonItem",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/SearchField",
	"sap/ui/core/Lib",
	"sap/ui/core/Element",
	"./AutoSuggestionVocabularyPanelRenderer"
], function (jQuery, library, Control, List, JSONModel, mobileLibrary, CustomData, Sorter, infraUtils, Panel, HorizontalLayout, Label, Link, Select, TextArea, Dialog, Button, CustomListItem, DisplayListItem, VerticalLayout, SegButton,
SegButtonItem, Filter, FilterOperator, SearchField, coreLib, Element, AutoSuggestionVocabularyPanelRenderer) {
	"use strict";

    var ListMode = mobileLibrary.ListMode;
	var autoSuggestionVocabularyPanel = Control.extend("sap.rules.ui.ast.autoCompleteContent.AutoSuggestionVocabularyPanel", {
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
				context: {
					type: "string",
					defaultValue: ""
				},
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

		_createAggregateFunctionSection: function () {
			var AggregateFunctionsPanel = new Panel({
				expandable: false,
				expanded: true,
				width: "auto",
				content: [new Link({
					wrapping: true,
					text: this.oBundle.getText("aggregateFunctionPanelTitle"),
					press: function (oEvent) {
						var functionAndOfLayout = new  HorizontalLayout({
							content: [
								new Label({
									text: this.oBundle.getText("function") + ": "
								}),
								new Select({
									width: "200px",
									height: "60px"
								}),
								new Label({
									text: " " + this.oBundle.getText("oflabel") + " "
								}),
								new TextArea({
									value: "",
									showExceededText: true,
									width: "150%",
									height: "65px"
								})
							]
						});

						var whereLayout = new HorizontalLayout({
							content: [
								new Label({
									text: this.oBundle.getText("where_label") + ":"
								}),
								new TextArea({
									value: "",
									showExceededText: true,
									width: "300px"
								})
							]
						});

						var GroupByLayout = new HorizontalLayout({
							content: [
								new Label({
									text: this.oBundle.getText("group_by") + ": "
								}),
								new TextArea({
									value: "",
									showExceededText: true,
									width: "300px"
								})
							]
						});

						var FunctionLabelLayout = new HorizontalLayout({
							content: [
								new Label({
									text: this.oBundle.getText("function_label") + ":",
								}),
								new TextArea({
									value: "",
									enabled: false,
									width: "300px"
								})
							]
						});

						var verticalLayoutForAggregateFunction = new VerticalLayout({
							content: [functionAndOfLayout, whereLayout, GroupByLayout, FunctionLabelLayout]
						});
						var that = this;
						var aggregateFunctionsDialog = new Dialog({
							title: this.oBundle.getText("configure_aggr_title"),
							contentWidth: "800px",
							contentHeight: "500px",
							showHeader: true,
							content: [verticalLayoutForAggregateFunction],
							afterClose: function () {
								that._dialogOpenedCallbackReference(false);
							},
							buttons: [
								new Button({
									text: this.oBundle.getText("applyChangesBtn"),
									tooltip: this.oBundle.getText("applyChangesBtn"),
									press: function (event) {
										aggregateFunctionsDialog.close();
									}
								}),
								new Button({
									text: this.oBundle.getText("cancelBtn"),
									tooltip: this.oBundle.getText("cancelBtn"),
									press: function (event) {
										aggregateFunctionsDialog.close();
									}
								})
							]
						});

						aggregateFunctionsDialog.open();
					}
				})]
			})

			var AggregateFunctionsItem = new CustomListItem({
				content: AggregateFunctionsPanel
			})
			return AggregateFunctionsItem;
		},

		_createLayout: function () {
			var that = this;
			this.VocabularyTerms = this.getData();
			// create a Model with this data
			var model = new JSONModel();

			/*Setting growing shows the growing trigger button with text as 2/14 which we do not need
			Hence, setting to top 5 and the rest will be shown in More link */
			var topFiveVocabularyData = [];
			for (var termCount = 0; termCount < 5 && termCount < this.VocabularyTerms.length; termCount++) {
				topFiveVocabularyData.push(this.VocabularyTerms[termCount]);
			}
			model.setData(topFiveVocabularyData);

			// create a list 
			this.vocabularylist = new List({
				growingScrollToLoad: true,
				enableBusyIndicator: true
			});

			//for every item, add relevant icon and description and add item to the list
			// bind the List items to the data collection
			this.vocabularylist.bindItems({
				path: "/",
				sorter: new Sorter("label"),
				rememberSelections: false,
				mode: ListMode.SingleSelectMaster,
				template: new DisplayListItem({
					label: "{label}",
					type: "Active",
					press: function (oEvent) {
						that._setModal(false);
						that._reference(oEvent);
					}
				})
			});

			// set the model to the List, so it knows which data to use
			this.vocabularylist.setModel(model);
			var moreVocabularyLink = this.getMoreVocabulariesLink();

			// add list to the panel
			var vocabularyListPanel = new Panel({
				headerText: this.oBundle.getText("vocabularyPanelTitle"),
				expandable: true,
				expanded: true,
				// expand: this.onExpand,
				content: this.vocabularylist,
				width: "auto"
			});
		        if (this.VocabularyTerms.length >= 5){
			    vocabularyListPanel.addContent(moreVocabularyLink);
		        }

			return vocabularyListPanel;
		},

		_setModal: function (value) {
			var pop = Element.getElementById("popover");
			if (pop) {
				pop.setModal(value);
			}
		},

		getMoreVocabulariesLink: function () {
			var that = this;
			var moreVocabularyLink = new Link({
				text: this.oBundle.getText("more_link"),
				tooltip: this.oBundle.getText("more_link_tooltip"),
				enabled: true,
				press: function (oEvent) {
					that._setModal(true);
					that._dialogOpenedCallbackReference(true);
					var bDoAndAttrsPresent = that.isDoAndAttrsPresent(that.VocabularyTerms);
                    if (bDoAndAttrsPresent || that.VocabularyTerms[0].isParentEntity) {
                        that.getDataObjectsDialog();
                    } else {
                        that.getAttributesDialog(that.dataObjectName);
                    }
				}
			});
			return moreVocabularyLink;

		},
		
		isDoAndAttrsPresent : function(aTerms){
			if(aTerms){
				var doPresent = false;
				var attrPresent = false;
				for(var index = 0 ; index < aTerms.length ; index++){
					if(aTerms[index].isParentEntity && aTerms[index].type !== "AO" && aTerms[index].type !== "R"){
						doPresent = true;
					}else{
						attrPresent = true;
					}
				}
				return doPresent && attrPresent;
			}
            return false;
		},

		getDataObjectsDialog: function () {
			var that = this;
			var searchFieldText = this.oBundle.getText("searchTextVocabulary");
			var searchField = this.getSearchField(searchFieldText);
			this.detailedVocabularyList = this.initializeVocabularyList(this.VocabularyTerms);
			this.bindFilteredTermsToList(this.detailedVocabularyList, "DataObjects", "", false);
			var verticalLayoutForVocabularyFunction = new VerticalLayout({
				content: [searchField, that.detailedVocabularyList]
			}).addStyleClass("sapAstVocabularyPanel");

			this.dataObjectsDialog = new Dialog({
				title: this.oBundle.getText("selectVocabularyTitle"),
				contentWidth: "500px",
				contentHeight: "500px",
				showHeader: true,
				content: [verticalLayoutForVocabularyFunction],
				afterClose: function () {
					that._dialogOpenedCallbackReference(false);
				},
				buttons: [
					new Button({
						text: this.oBundle.getText("cancelBtn"),
						tooltip: this.oBundle.getText("cancelBtn"),
						press: function (event) {
							that._setModal(false);
							that.dataObjectsDialog.close();
						}
					})
				]
			});
			that.dataObjectsDialog.open();

		},

		getAttributesDialog: function (dataObjectName) {
			var that = this;
			var segmentedButton = this.getAttributesSegmentedButtons();
			//deafault
			var searchFieldText = this.oBundle.getText("searchTextAttr");
			if (this.AttributeSegmentSelected) {
				searchFieldText = this.oBundle.getText("searchTextAttr");
			}
			if (this.AssociationSegmentSelected) {
				searchFieldText = this.oBundle.getText("searchTextAssoc");
			}
			var searchField = this.getSearchField(searchFieldText);
			this.detailedVocabularyList = this.initializeVocabularyList(this.VocabularyTerms);
			this.bindFilteredAttributesAndAssociationsToList(this.detailedVocabularyList, "Attributes", "E", false);

			var verticalLayoutForAttributesFunction = new VerticalLayout({
				content: [segmentedButton, searchField, that.detailedVocabularyList]
			}).addStyleClass("sapAstVocabularyPanel");
			that.attributesDialog = new Dialog({
				title: this.oBundle.getText("selectAttrAssocTitle"),
				contentWidth: "500px",
				contentHeight: "500px",
				showHeader: true,
				content: [verticalLayoutForAttributesFunction],
				afterClose: function () {
					that._dialogOpenedCallbackReference(false);
				},
				buttons: [
					new Button({
						text: this.oBundle.getText("cancelBtn"),
						tooltip: this.oBundle.getText("cancelBtn"),
						press: function (event) {
							that._setModal(false);
							that.attributesDialog.close();
						}
					})
				]
			});

			that.attributesDialog.open();

		},

		getAttributesSegmentedButtons: function () {
			var that = this;
			var SegmentedButton = new SegButton({
				items: [new SegButtonItem({
						text: this.oBundle.getText("attributes"),
						width: "230px",
						press: function () {
							that._setModal(false);
							that.AttributeSegmentSelected = true;
							that.AssociationSegmentSelected = false;
							that.searchField.setValue("")
							that.searchField.setPlaceholder(that.oBundle.getText("searchTextAttr"));
							that.bindFilteredAttributesAndAssociationsToList(that.detailedVocabularyList, "Attributes", "E", false);
						}
					}),
					new SegButtonItem({
						text: this.oBundle.getText("associations"),
						width: "230px",
						press: function () {
							that._setModal(false);
							that.AttributeSegmentSelected = false;
							that.AssociationSegmentSelected = true;
							that.searchField.setValue("")
							that.searchField.setPlaceholder(that.oBundle.getText("searchTextAssoc"));
							that.bindFilteredAttributesAndAssociationsToList(that.detailedVocabularyList, "Association", "AO", false);
						}
					})
				]
			});
			return SegmentedButton;
		},

		bindFilteredTermsToList: function (oList, objectPath, searchText, requireSearch) {
			var model = new JSONModel(this.VocabularyTerms);
			for (var entry in model.oData) {
				if (model.oData[entry].type === "T") {
					model.oData[entry].displayType = "Table";
				} else if (model.oData[entry].type === "S") {
					model.oData[entry].displayType = "Structure";
				} else if (model.oData[entry].type === "E") {
					if(model.oData[entry].isParentEntity){
						model.oData[entry].displayType = "Element";
					}else{
						var displayType = "Attribute";
						model.oData[entry].displayType = model.oData[entry].bussinessDataType ? displayType + 
						" (" + model.oData[entry].bussinessDataType +")" : displayType;
					}
				} else if (model.oData[entry].type === "AO") {
					model.oData[entry].displayType = "Association";
				} else if (model.oData[entry].ResultDataObjectId && !model.oData[entry].type) {
					model.oData[entry].displayType = "Rule";
				} else {
					model.oData[entry].displayType = model.oData[entry].type;
				}
			}
			var that = this;
			var datapath = "/";
			if (!oList) {
				oList = new List({});
			}
			oList.setModel(model);
			oList.bindItems({
				path: datapath,
				sorter: new Sorter("type"),
				template: new DisplayListItem({
					label: "{label}",
					value: "{displayType}",
					type: "Active",
					customData: [new CustomData({
						Type: "sap.ui.core.CustomData",
						key: "id",
						value: "{id}"
					})],
					press: function (oEvent) {
					    that._setModal(false);
						if (that.dataObjectsDialog.isOpen()) {
							that.dataObjectsDialog.close();
						} else {
							that.attributesDialog.close()
						}
						that._reference(oEvent);
					}
				}),
				rememberSelections: false,
				mode: ListMode.SingleSelectMaster
			});
			if (requireSearch) {
				var filterArray = [];
				var filterProperty = "label";
				filterArray.push(new Filter(filterProperty, FilterOperator.Contains, searchText));
				oList.getBinding("items").filter(filterArray);
				oList.getModel().refresh(true);
			}
		},

		bindFilteredAttributesAndAssociationsToList: function (oList, objectPath, searchText, requireSearch) {
			var model = new JSONModel(this.VocabularyTerms);
			var that = this;
			var datapath = "/";
			if (!oList) {
				oList = new List({});
			}
			if(model && model.oData){
				for (var entry in model.oData) {
					if (model.oData[entry].type === "E") {
						var displayType = "Attribute";
						model.oData[entry].displayType = model.oData[entry].bussinessDataType ? displayType + 
						" (" + model.oData[entry].bussinessDataType +")" : displayType;
					} else if (model.oData[entry].type === "R") {
						var displayType = "Reference";
						model.oData[entry].displayType = displayType;
					} 
				}
			}
			oList.setModel(model);
			oList.bindItems({
				path: datapath,
				sorter: new Sorter("label"),
				template: new DisplayListItem({
					label: "{label}",
					value: "{displayType}",
					type: "Active",
					press: function (oEvent) {
						that._setModal(false);
						that.attributesDialog.close();
						that._reference(oEvent);
					}
				}),
				rememberSelections: false,
				mode: ListMode.SingleSelectMaster
			});

			if (requireSearch) {
				if(objectPath === "AO") {
					oList.getBinding("items").filter(new Filter({
						filters: [
							this.getSearchFiltersAttributesAssociation(searchText,objectPath)
						],
						and: true
					}));
				} else {
					oList.getBinding("items").filter(new Filter({
						filters: [
							this.getSearchFiltersReference(searchText),
							this.getSearchFiltersAttributesAssociation(searchText,objectPath)
						],
						and: false
					}));
				}
			} else {
				var filterArray = [];
				var filterProperty = "type";
				if (searchText === "E") {
					filterArray.push(new Filter(filterProperty, FilterOperator.Contains, searchText));
					filterArray.push(new Filter(filterProperty, FilterOperator.Contains, "R"));
				} else {
					filterArray.push(new Filter(filterProperty, FilterOperator.Contains, searchText));
				}
				oList.getBinding("items").filter(new Filter({
					filters: filterArray,
					and: false
				}));
				oList.getModel().refresh(true);
			}
		},

		getSearchFiltersReference: function(searchText) {
            return new Filter({
            	filters: [
            		new Filter("type",  FilterOperator.Contains, "R"),
            		new Filter("label", FilterOperator.Contains, searchText)
            		],
            	and: true,
            });
		},

		getSearchFiltersAttributesAssociation: function(searchText,type) {
            return new Filter({
            	filters: [
            		new Filter("type", FilterOperator.Contains, type),
            		new Filter("label", FilterOperator.Contains, searchText)
            		],
            	and: true,
            });
		},
		
		getDataObjectFilter: function () {
			if (this.AttributeSegmentSelected) {
				return new Filter("DataObjectId", FilterOperator.Contains, this.dataObjectId)
			}
			if (this.AssociationSegmentSelected) {
				return new Filter("SourceDataObjectId", FilterOperator.Contains, this.dataObjectId)
			}
		},

		getSearchFilters: function (searchText) {
			return new Filter({
				filters: [
					new Filter("name", FilterOperator.Contains, searchText),
					new Filter("label", FilterOperator.Contains, searchText)
				],
				and: false
			});
		},

		getSearchField: function (placeHolderText) {
			var that = this;
			this.searchField = new SearchField({
				showSearchButton: false,
				width: "462px",
				placeholder: placeHolderText, //searchType,
				liveChange: function (oEvent) {
					if (that.dataObjectsDialog) {
						that.searchTheValueInDataObjects(oEvent.getParameter("newValue"), searchType);
					} else {
						// Deafult case when no tab is selected by the user, we search on the first tab which is "Attribute"
						var searchType = "Attributes";
						if (that.AttributeSegmentSelected) {
							searchType = "Attributes";
						}
						if (that.AssociationSegmentSelected) {
							searchType = "Association";
						}

						//if Attributes or Association is selected, we will have to search in them
						that.searchValueInAttributesAndAssociation(oEvent.getParameter("newValue"), searchType);
					}

				}
			})
			return this.searchField;
		},

		searchTheValueInDataObjects: function (searchText, searchType) {
			this.bindFilteredTermsToList(this.detailedVocabularyList, searchType, searchText, true);
		},

		searchValueInAttributesAndAssociation: function (searchText, searchType) {
			if (this.AttributeSegmentSelected) {
				searchType = "E";
			}
			if (this.AssociationSegmentSelected) {
				searchType = "AO";
			}
			this.bindFilteredAttributesAndAssociationsToList(this.detailedVocabularyList, searchType, searchText, true);
		},

		initializeVocabularyList: function (vocabularyData) {
			var model = new JSONModel(vocabularyData);
			var datapath = "/";
			var vocabularylist = new List({
				headerText: this.oBundle.getText("vocabulary")
			});
			vocabularylist.setModel(model);
			vocabularylist.bindItems({
				path: datapath,
				sorter: new Sorter("label"),
				template: new DisplayListItem({
					label: "{label}",
					value: "{type}",
					type: "Active",
					customData: [new CustomData({
						Type: "sap.ui.core.CustomData",
						key: "id",
						value: "{id}"
					})]
				})

			});
			return vocabularylist;
		},
		renderer: AutoSuggestionVocabularyPanelRenderer

	});

	return autoSuggestionVocabularyPanel;
}, /* bExport= */ true);
