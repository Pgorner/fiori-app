sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"./library",
	"sap/ui/core/Control",
	"sap/m/List",
	"sap/m/CustomListItem",
	"sap/ui/model/json/JSONModel",
	"sap/rules/ui/ast/autoCompleteContent/AutoSuggestionVocabularyPanel",
	"sap/rules/ui/ast/autoCompleteContent/AutoSuggestionFixedValuePanel",
	"sap/rules/ui/ast/autoCompleteContent/AutoSuggestionMathematicalOperatorPanel",
	"sap/rules/ui/ast/autoCompleteContent/AutoSuggestionComparisionOperatorPanel",
	"sap/rules/ui/ast/autoCompleteContent/AutoSuggestionLogicalOperatorPanel",
	"sap/rules/ui/ast/autoCompleteContent/AutoSuggestionAggregateFunctionPanel",
	"sap/rules/ui/ast/autoCompleteContent/AutoSuggestionArrayOperatorPanel",
	"sap/rules/ui/ast/autoCompleteContent/AutoSuggestionRangeOperatorPanel",
	"sap/rules/ui/ast/autoCompleteContent/AutoSuggestionMiscellaneousOperatorPanel",
	"sap/rules/ui/ast/autoCompleteContent/AutoSuggestionFunctionalOperatorPanel",
	"sap/rules/ui/ast/autoCompleteContent/AutoSuggestionAdvancedFunctionPanel",
	"sap/rules/ui/ast/autoCompleteContent/AutoSuggestionTimeAndDurationFunctionPanel",
	"sap/rules/ui/ast/autoCompleteContent/AutoSuggestionSelectFunctionPanel",
	"sap/rules/ui/ast/autoCompleteContent/AutoSuggestionOperationsPanel",
	"sap/rules/ui/ast/autoCompleteContent/AutoSuggestionLoopFunctionPanel",
	"sap/rules/ui/ast/util/utilsBase",
	"sap/ui/core/Lib",
	"./AutoCompleteSuggestionContentRenderer"

], function (jQuery, library, Control, List, CustomListItem, JSONModel, AutoSuggestionVocabularyPanel, AutoSuggestionFixedValuePanel,
	AutoSuggestionMathematicalOperatorPanel,
	AutoSuggestionComparisionOperatorPanel, AutoSuggestionLogicalOperatorPanel, AutoSuggestionAggregateFunctionPanel,
	AutoSuggestionArrayOperatorPanel, AutoSuggestionRangeOperatorPanel, AutoSuggestionMiscellaneousOperatorPanel,
	AutoSuggestionFunctionalOperatorPanel, AutoSuggestionAdvancedFunctionPanel, AutoSuggestionTimeAndDurationFunctionPanel,
	AutoSuggestionSelectFunctionPanel, AutoSuggestionOperationsPanel, AutoSuggestionLoopFunctionPanel,UtilsBase, coreLib, AutoCompleteSuggestionContentRenderer) {
	"use strict";

	var AutoCompleteSuggestionContent = Control.extend("sap.rules.ui.AutoCompleteSuggestionContent", {
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
				content: {
					type: "object",
					defaultValue: null
				},
				vocabularyInfo: {
					type: "object",
					defaultValue: null
				},
				enableAggregateFunctionVocabulary: {
					type: "boolean",
					defaultValue: false
				},
				enableAggregateFunctionWhereClause: {
					type: "boolean",
					defaultValue: false
				},
                expand: {
                    type: "boolean",
                    defaultValue: false
                }
			},
			aggregations: {
				mainLayout: {
					type: "sap.m.List",
					multiple: false
				}
			},
			events: {}
		},

		init: function () {
			this.infraUtils = new UtilsBase.utilsBaseLib();
			this.initializeVariables();
			this.needCreateLayout = true;
			this.oBundle = coreLib.getResourceBundleFor("sap.rules.ui.i18n");
		},
		onBeforeRendering: function () {
			this._reference = this.getReference();
			this._enableAggregateFunctionVocabulary = this.getEnableAggregateFunctionVocabulary();
			this._enableAggregateFunctionWhereClause = this.getEnableAggregateFunctionWhereClause();
			this._dialogOpenedCallbackReference = this.getDialogOpenedCallbackReference();
			if (this.needCreateLayout) {
				var layout = this._createLayout();
				this.setAggregation("mainLayout", layout, true);
				this.needCreateLayout = false;
				this._getAutoSuggestionList();
			}
		},

		initializeVariables: function () {},

		_createLayout: function () {
			return new List();
		},

		_getAutoSuggestionList: function () {
			var that = this;
			this.autoSuggestions = this.getContent();
			this.businessDataTypeList = this.autoSuggestions.businessDataTypeList;
			if (this.autoSuggestions && this.autoSuggestions.categories) {
				if (this.autoSuggestions.categories.terms) {
					this.VocabularyTerms = this.autoSuggestions.categories.terms;
				}
				if (this.autoSuggestions.categories.functions && this.autoSuggestions.categories.functions.operations) {
					this.Operations = this.autoSuggestions.categories.functions.operations;
				}
			}

			this.suggestionContext = this.autoSuggestions.suggestionContext; //this._getResponseVocabularyData().autoComplete.suggestionContext;

			//Operations section - applicable only for text rule
			if (this.Operations && this.Operations.length > 0 ) {
				var operationsPanel = new AutoSuggestionOperationsPanel({
					reference: that._reference,
					data: that.Operations
				});
				this.getAggregation("mainLayout").addItem(new CustomListItem({
					content: operationsPanel,
					accDescription: this.oBundle.getText("OperationsPanelTitle")
				}));
			}

			// Vocabulary Section
			if (this.VocabularyTerms && this.VocabularyTerms.length > 0) {
				this.VocabularyTerms = this._handleMissingLabels(this.VocabularyTerms);
				var vocabularyPanel = new AutoSuggestionVocabularyPanel({
					reference: that._reference,
					dialogOpenedCallbackReference: that._dialogOpenedCallbackReference,
					data: that.VocabularyTerms,
					context: that.suggestionContext
				});
				this.getAggregation("mainLayout").addItem(new CustomListItem({
					content: vocabularyPanel,
					accDescription: this.oBundle.getText("vocabularyPanelTitle")
				}));
			}

			// Rules Section
			if (this.autoSuggestions && this.autoSuggestions.categories && this.autoSuggestions.categories.vocabularyRules) {
				this.rules = this.autoSuggestions.categories.vocabularyRules;
			}

			// Fixed Value Section
			if (this.autoSuggestions.showLiteral && !this._enableAggregateFunctionVocabulary) {
				var fixedValuePanel = new AutoSuggestionFixedValuePanel({
					reference: that._reference,
					vocabularyInfo: that.getVocabularyInfo(),
					dialogOpenedCallbackReference: that._dialogOpenedCallbackReference,
					data: this.autoSuggestions,
                    inputValue: this.autoSuggestions.literalInput
				});
				this.getAggregation("mainLayout").addItem(new CustomListItem({
					content: fixedValuePanel,
					accDescription: this.oBundle.getText("fixedValuePanelTitle")
				}));

			}

			// Operators Section
			if (this.autoSuggestions && this.autoSuggestions.categories && this.autoSuggestions.categories.operators && !this._enableAggregateFunctionVocabulary) {
				this.VocabularyOperators = this.autoSuggestions.categories.operators;
				//Arithmetic Operators
				if (this.VocabularyOperators.arithmetic && this.VocabularyOperators.arithmetic.length > 0) {
					var mathematicalOperatorsPanel = new AutoSuggestionMathematicalOperatorPanel({
						reference: that._reference,
						data: this.VocabularyOperators,
                        expand: this.getExpand()
					});
					this.getAggregation("mainLayout").addItem(new CustomListItem({
						content: mathematicalOperatorsPanel,
						accDescription: this.oBundle.getText("mathOperatorsPanelTitle")
					}));
				}
				// comparision operators
				if (this.VocabularyOperators.comparision && this.VocabularyOperators.comparision.length > 0 && !this._enableAggregateFunctionVocabulary) {
					var comparisonOperatorsPanel = new AutoSuggestionComparisionOperatorPanel({
						reference: that._reference,
						data: that.VocabularyOperators,
                        expand: this.getExpand()
					});
					this.getAggregation("mainLayout").addItem(new CustomListItem({
						content: comparisonOperatorsPanel,
						accDescription: this.oBundle.getText("comparisonOperatorsPanelTitle")
					}));
				}
				// logical operators
				if (this.VocabularyOperators.logical && this.VocabularyOperators.logical.length > 0 && !this._enableAggregateFunctionVocabulary) {
					var logicalOperatorsPanel = new AutoSuggestionLogicalOperatorPanel({
						reference: that._reference,
						data: that.VocabularyOperators,
                        expand: this.getExpand()
					});
					this.getAggregation("mainLayout").addItem(new CustomListItem({
						content: logicalOperatorsPanel,
						accDescription: this.oBundle.getText("logicalOperatorsPanelTitle")
					}));
				}
				// array operators
				if (this.VocabularyOperators.array && this.VocabularyOperators.array.length > 0 && !this._enableAggregateFunctionVocabulary) {
					var arrayOperatorsPanel = new AutoSuggestionArrayOperatorPanel({
						reference: that._reference,
						data: that.VocabularyOperators,
                        expand: this.getExpand()
					});
					this.getAggregation("mainLayout").addItem(new CustomListItem({
						content: arrayOperatorsPanel,
						accDescription: this.oBundle.getText("arrayOperatorsPanelTitle")
					}));
				}
				// range operators
				if (this.VocabularyOperators.range && this.VocabularyOperators.range.length > 0 && !this._enableAggregateFunctionVocabulary) {
					var rangeOperatorsPanel = new AutoSuggestionRangeOperatorPanel({
						reference: that._reference,
						data: that.VocabularyOperators,
                        expand: this.getExpand()
					});
					this.getAggregation("mainLayout").addItem(new CustomListItem({
						content: rangeOperatorsPanel,
						accDescription: this.oBundle.getText("rangeOperatorsPanelTitle")
					}));
				}

				// functional operators
				if (this.VocabularyOperators.functional && this.VocabularyOperators.functional.length > 0 && !this._enableAggregateFunctionVocabulary) {
					var functionalOperatorsPanel = new AutoSuggestionFunctionalOperatorPanel({
						reference: that._reference,
						data: that.VocabularyOperators,
                        expand: this.getExpand()
					});
					this.getAggregation("mainLayout").addItem(new CustomListItem({
						content: functionalOperatorsPanel,
						accDescription: this.oBundle.getText("functionalOperatorsPanelTitle")
					}));
				}

			}
			// Advanced Functions
			if (this.autoSuggestions && this.autoSuggestions.categories && this.autoSuggestions.categories.functions && !this._enableAggregateFunctionVocabulary) {
				this.fuctions = this.autoSuggestions.categories.functions;
				if (this.fuctions.advanced) {
					var AdvancedFunctionsPanel = new AutoSuggestionAdvancedFunctionPanel({
						reference: that._reference,
						data: that.fuctions.advanced,
                        expand: this.getExpand()
					});
					this.getAggregation("mainLayout").addItem(new CustomListItem({
						content: AdvancedFunctionsPanel,
						accDescription: this.oBundle.getText("advancedFunctionPanelTitle")
					}));
				}
			}

			// Time And Duration Functions
			if (this.autoSuggestions && this.autoSuggestions.categories && this.autoSuggestions.categories.functions && !this._enableAggregateFunctionVocabulary) {
				this.fuctions = this.autoSuggestions.categories.functions;
				if (this.fuctions.time_duration) {
					var TimeAndDurationFunctionsPanel = new AutoSuggestionTimeAndDurationFunctionPanel({
						reference: that._reference,
						data: that.fuctions.time_duration,
						dialogOpenedCallbackReference: that._dialogOpenedCallbackReference,
                        expand: this.getExpand()
					});
					this.getAggregation("mainLayout").addItem(new CustomListItem({
						content: TimeAndDurationFunctionsPanel,
						accDescription: this.oBundle.getText("timeAndDurationFunctionsPanelTitle")
					}));
				}
			}

			// Miscellaneous Operators
			if (this.autoSuggestions && this.autoSuggestions.categories && this.autoSuggestions.categories.operators && !this._enableAggregateFunctionVocabulary) {
				this.VocabularyOperators = this.autoSuggestions.categories.operators;
				if (this.VocabularyOperators.miscellaneous && this.VocabularyOperators.miscellaneous.length > 0 && !this._enableAggregateFunctionVocabulary) {
					var miscellaneousOperatorsPanel = new AutoSuggestionMiscellaneousOperatorPanel({
						reference: that._reference,
						data: that.VocabularyOperators,
                        expand: this.getExpand()
					});
					this.getAggregation("mainLayout").addItem(new CustomListItem({
						content: miscellaneousOperatorsPanel,
						accDescription: this.oBundle.getText("miscOperatorsPanelTitle")
					}));
				}
			}
			// Select functions
			if (this.autoSuggestions && this.autoSuggestions.categories && this.autoSuggestions.categories.functions) {
				this.fuctions = this.autoSuggestions.categories.functions;
				if (this.fuctions.selection) {
					var SelectFunctionsPanel = new AutoSuggestionSelectFunctionPanel({
						reference: that._reference,
						dialogOpenedCallbackReference: that._dialogOpenedCallbackReference,
						data: that.fuctions,
						astExpressionLanguage: that.getVocabularyInfo()
					});
					this.getAggregation("mainLayout").addItem(new CustomListItem({
						content: SelectFunctionsPanel,
						accDescription: this.oBundle.getText("selectFunctionPanelTitle")
					}));
				}
			}
			// Aggregate Functions
			if (this.autoSuggestions && this.autoSuggestions.categories && this.autoSuggestions.categories.functions && !this._enableAggregateFunctionVocabulary &&
				!this._enableAggregateFunctionWhereClause) {
				this.fuctions = this.autoSuggestions.categories.functions;
				if (this.fuctions.aggregate) {
					var AggregateFunctionsPanel = new AutoSuggestionAggregateFunctionPanel({
						reference: that._reference,
						dialogOpenedCallbackReference: that._dialogOpenedCallbackReference,
						data: that.fuctions,
						astExpressionLanguage: that.getVocabularyInfo()
					});
					this.getAggregation("mainLayout").addItem(new CustomListItem({
						content: AggregateFunctionsPanel,
						accDescription: this.oBundle.getText("aggregateFunctionPanelTitle")
					}));
				}
			}

			//Loop Functions
			if (this.autoSuggestions && this.autoSuggestions.categories && this.autoSuggestions.categories.functions && this.autoSuggestions.categories.functions.loop) {
				var LoopFunctionsPanel = new AutoSuggestionLoopFunctionPanel({
					reference: that._reference,
					dialogOpenedCallbackReference: that._dialogOpenedCallbackReference,
					data: that.fuctions,
					astExpressionLanguage: that.getVocabularyInfo()
				});
				this.getAggregation("mainLayout").addItem(new CustomListItem({
					content: LoopFunctionsPanel,
					accDescription: this.oBundle.getText("loopFunctionPanelTitle")
				}));
			}

		},

		_handleMissingLabels: function (data) {
			for (var entry in data) {
				if (!data[entry].label) {
					data[entry].label = data[entry].name;
				}
			}
			return data;
		},

		_containsRequestedBusinessDataTypeInTheList: function (searchType) {
			for (var entry in this.businessDataTypeList) {
				if (this.businessDataTypeList[entry] === searchType) {
					return true;
				}
			}
			return false;
		},
		renderer: AutoCompleteSuggestionContentRenderer

	});

	return AutoCompleteSuggestionContent;

}, /* bExport= */ true);