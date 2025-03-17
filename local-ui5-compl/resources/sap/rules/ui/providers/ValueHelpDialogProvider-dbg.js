/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */

sap.ui.define([
	"sap/rules/ui/Constants",
	"sap/ui/core/LocaleData",
	"sap/ui/model/json/JSONModel",
	"sap/ui/comp/valuehelpdialog/ValueHelpDialog",
	"sap/ui/table/Column",
	"sap/m/Text",
	"sap/ui/core/library",
	"sap/base/i18n/Formatting",
    "sap/ui/core/format/DateFormat",
    "sap/ui/comp/smartfilterbar/SmartFilterBar",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/comp/smartfilterbar/ControlConfiguration",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/Label",
    "sap/ui/core/Lib",
    "sap/ui/core/Element"

], function(Constants,LocaleData, JSONModel, valuehelpdialog, TableColumn, Text, coreLibrary, Formatting, DateFormat, SmartFilterBar, ODataModel, Element, ControlConfiguration,
Filter, FilterOperator, Label, coreLib) {
	"use strict";
	var valueHelpDialogProvider = {};

	valueHelpDialogProvider._createCpValueHelp = function(valueHelpInfo, curPos, bReplaceWord, bValuehelpLinkPress) {
		this.oBundle = coreLib.getResourceBundleFor("sap.rules.ui.i18n");
		var bAddSpace = false;
		var basePath = "";

		if (valueHelpInfo && valueHelpInfo.valueListObject) {
			this.basicMode = true;
			this.valueHelpMetadata = valueHelpInfo.valueListObject.metadata;
			basePath = valueHelpInfo.expressionLanguage.getModel().sServiceUrl;

		} else {
			this.advancedMode = true;
			this.valueHelpMetadata = valueHelpInfo.metadata;
			var tokens = this.getExpressionTokens();
			if (tokens && tokens.length > 0) {
				bAddSpace = (tokens[tokens.length - 1].tokenType !== "whitespace");
			}
			basePath = Element.getElementById(this.getExpressionLanguage()).getModel().sServiceUrl;
		}
		this.businessDataType = this.valueHelpMetadata.businessDataType;
		this.serviceUrl = this.valueHelpMetadata.serviceURL;
		this.attributeId = this.valueHelpMetadata.attributeId;
		this.dataObjectId = this.valueHelpMetadata.dataObjectId;
		this.vocabularyId = this.valueHelpMetadata.vocabularyId;
		this._updateModal(true);

		if (this.oDialog) {
			this.oDialog.destroy();
		}
		coreLibrary.BusyIndicator.show(0);

		this._createDialog(basePath, valueHelpInfo, curPos, this.businessDataType, bAddSpace, bReplaceWord, bValuehelpLinkPress);
	};

	/*
	 * Creates the necessary control for the value Help Dialog.
	 * 
	 */
	valueHelpDialogProvider._createDialog = function(basePath, valueHelpInfo, curPos, businessDataType, bAddSpace, bReplaceWord,
		bValuehelpLinkPress) {
		this._createValueHelpDialog(basePath, valueHelpInfo, curPos, businessDataType, bAddSpace, bReplaceWord, bValuehelpLinkPress);
		this._createSmartFilterBar(basePath, valueHelpInfo);
		this.oValueHelpDialog.setFilterBar(this.oFilterBar);
		this.oValueHelpDialog.open();
		this.oValueHelpDialog.getTable().setBusy(true);
	};

	// createDialog > _createValueHelpDialog
	valueHelpDialogProvider._createValueHelpDialogOLD = function(data, curPos, businessDataType) {
		var that = this;
		var model = new JSONModel(data.results);
		this.oValueHelpDialog = new ValueHelpDialog({
			supportMultiselect: false,
			supportRanges: false,
			horizontalScrolling: false,
			title: that.oBundle.getText("valueHelpTitle"),
			key: "Name",
			descriptionKey: "Description",
			beforeOpen: function() {
				this.oValueHelpDialog.setModel(model, "valueHelpModel");
				this.oValueHelpDialog.getTable()
					.addColumn(new TableColumn({
						label: new Text({
							text: that.oBundle.getText("valueHelpKeyColumnHeader")
						}),
						template: new Text({
							text: "{valueHelpModel>Value}"
						})
					}))
					.addColumn(new TableColumn({
						label: new Text({
							text: that.oBundle.getText("valueHelpDescriptionColumnHeader")
						}),
						template: new Text({
							text: "{valueHelpModel>Description}"
						})
					}))
					.bindRows({
						path: "valueHelpModel>/"
					});
			},
			ok: function(oEvt) {
				var oSelRow = oEvt.getParameter("tokens")[0].data("row");
				var value = oSelRow.Value;
				if (businessDataType === Constants.DATE_BUSINESS_TYPE) {
					value = that._formatDate(value);
				}

				if (value) {
					that.sKey = value;
					that.setIntructionToken(value);
					that.valueHelpCtrl.setValue(value);
					that.valueHelpCtrl.fireChange();
				}

				this.oValueHelpDialog.close();
				that._updateModal(false);
				that.focus(that.codeMirror);
			},
			cancel: function() {
				that._updateModal(false);
				this.oValueHelpDialog.close();
				that.focus(that.codeMirror);

			},
			afterClose: function() {
				that._updateModal(false);
				this.oValueHelpDialog.destroy();
				that.focus(that.codeMirror);
			}
		});
		this.oValueHelpDialog.setModel(model);
		this.oValueHelpDialog.open();
	};

	valueHelpDialogProvider._createValueHelpDialog = function(basePath, valueHelpInfo, curPos, businessDataType, bAddSpace,
		bReplaceWord, bValuehelpLinkPress) {
		var that = this;
		var expressionData = valueHelpInfo.expressionLanguage.getModel();
        var attributePath = "Attributes(Id='"+ this.attributeId + "',VocabularyId='" + this.vocabularyId + "',DataObjectId='" + this.dataObjectId + "')";
		if(attributePath.includes(":")) {
			attributePath = attributePath = attributePath.replace(":","%3A");
		}
        this.attributeName = expressionData.oData[attributePath].Name;
		coreLibrary.BusyIndicator.show(0);
		this.oValueHelpDialog = new ValueHelpDialog({
			supportMultiselect: false,
			supportRanges: false,
			horizontalScrolling: false,
			title: that.attributeName,
			resizable: false,
			beforeOpen: function() {
				that._bindTable(basePath, valueHelpInfo);
			},
			ok: function(oEvt) {
				var oSelRow = oEvt.getParameter("tokens")[0].data("row");
				var value = oSelRow.Value;
				if (businessDataType === Constants.DATE_BUSINESS_TYPE) {
					value = that._formatDate(value);
				}
				if(businessDataType === Constants.NUMBER){
                    value = parseInt(value);
                }
				if (that.basicMode) {
					var oValueHelpCtrl = Element.getElementById("valueHelpCtrl");
					oValueHelpCtrl.setValue(value);
					oValueHelpCtrl.fireChange();
				} else{
					that.setTextOnCursor(value, curPos, bReplaceWord, businessDataType, bAddSpace, bValuehelpLinkPress);
				}

				that._updateModal(false);
				that.oValueHelpDialog.close();
				that.focus(that.codeMirror);

			},
			cancel: function() {
				that._updateModal(false);
				that.oValueHelpDialog.close();
				that.focus(that.codeMirror);

			},
			afterClose: function() {
				that._updateModal(false);
				that.oValueHelpDialog.destroy();
				that.focus(that.codeMirror);
				that.oFilterBar.destroy();
				coreLibrary.BusyIndicator.hide();
			}
		});
	};

	valueHelpDialogProvider.setTextOnCursor = function(sValue, cursorPosition, bReplaceWord, businessDataType, bAddSpace,
		bValuehelpLinkPress) {

		function getNextLine(currentLine, arrLines) {
			// this function skips empty lines
			var nextLine = currentLine + 1;
			for (var j = nextLine; j < arrLines.length; j++) {
				if (arrLines[j].length === 0) {
					nextLine++;
				} else {
					break;
				}
			}
			return nextLine;
		}

		var TYPE_STRING = "String",
			TYPE_DATE = "Date",
			TYPE_TIMESTAMP = "Timestamp",
			TYPE_TIME = "Time";

		// inserting a new selection
		var cursorPos;
		var sFormatedValue = ((businessDataType === TYPE_STRING) ||
			(businessDataType === TYPE_DATE) ||
			(businessDataType === TYPE_TIMESTAMP) ||
			(businessDataType === TYPE_TIME)) ? "'" + sValue + "'" : sValue;

		var tokens = this.getExpressionTokens();
		var lines = this.getValue().split("\n");
		var line = -1;
		var oToken = {
			start: {
				line: cursorPosition.line,
				ch: cursorPosition.ch
			},
			end: {
				line: cursorPosition.line,
				ch: cursorPosition.ch
			}
		};
		for (var i = 0; i < tokens.length; i++) {
			line = (tokens[i].start === 0) ? getNextLine(line, lines) : line;
			if (line === cursorPosition.line && (tokens[i].end > cursorPosition.ch) || (tokens[i].end >= cursorPosition.ch && bValuehelpLinkPress)) {
				oToken.start.ch = tokens[i].start;
				oToken.end.ch = tokens[i].end;
				bReplaceWord = true;
				break;
			}
		}
		if (bReplaceWord) {
			this.codeMirror.replaceRange(sFormatedValue, oToken.start, oToken.end); // replace the selection
			cursorPos = this.codeMirror.findPosH(oToken.start, sFormatedValue.length, "char", true);
			this.codeMirror.setCursor(cursorPos); // set the cursor at the end of the word
		} else {
			sFormatedValue = bAddSpace ? " " + sFormatedValue : sFormatedValue;
			this.codeMirror.replaceRange(sFormatedValue, cursorPosition); // insert the selection
			cursorPos = this.codeMirror.findPosH(cursorPosition, sFormatedValue.length, "char", true);
			this.codeMirror.setCursor(cursorPos); // set the cursor past the new selection
		}
		var oExpressionLanguage = Element.getElementById(this.getExpressionLanguage());
		this.getFormattingTokens(oExpressionLanguage);
		this.ValueHelpRequested = false;
	};

	valueHelpDialogProvider.focus = function() {
		if (this.codeMirror) {
			var lastLine = this.codeMirror.getLine(this.codeMirror.lastLine());
			var cursorPos = lastLine.length;
			this.codeMirror.setCursor({
				line: this.codeMirror.lastLine(),
				ch: cursorPos
			});
			this.codeMirror.focus();
		}
	};

	// Utility function to update Modal Property of modal
	valueHelpDialogProvider._updateModal = function(modalValue) {
		var pop = Element.getElementById("popover");
		if (pop) {
			pop.setModal(modalValue);
		}
	};
	
	/*
     * Utility function to format Date.
     */
    valueHelpDialogProvider._formatDate = function(value) {
        // Date instance which is used to convert the selected date from calendar control to short format
        var oLocale = Formatting.getLanguageTag();
        var oLocaleData = LocaleData.getInstance(oLocale);
 
        this.oFormatDate = DateFormat.getInstance({
                pattern: oLocaleData.getDatePattern('short'),
                calendarType: coreLibrary.CalendarType.Gregorian
            },
            oLocale
        );
        return this.oFormatDate.format(this.oFormatDate.parse(value));
    };

	/************************* filter releated functions ********************************/
	/*
	 * Creates the necessary control os SmartFilterBar for the ValueHelp Dialog.
	 */
	valueHelpDialogProvider._createSmartFilterBar = function(basePath, valueHelpInfo) {
		var that = this;
		if (this.basicMode) {
			this.entitySet = valueHelpInfo.valueListObject.metadata.entitySet;
			valueHelpInfo = valueHelpInfo.valueListObject;
		} else {
			this.entitySet = valueHelpInfo.metadata.entitySet;
		}
		this.oFilterBar = new SmartFilterBar({
			entitySet: that.entitySet,
			enableBasicSearch: true,
			advancedMode: true,
			filterBarExpanded: true,
			search: function() {
				that.onSearch(basePath, valueHelpInfo);
			},
			filterChange: function(oEvent) {
				that.setValueStateFilter(oEvent);
			},
			controlConfiguration: [that._createControlConfiguration()]
		});
		var oModel = new ODataModel(basePath);
		this.oFilterBar.setModel(oModel);
	};

	/*
	 * Creating the Control Configuration for the smartFilter of the valueHelp Dialog.
	 */
	valueHelpDialogProvider._createControlConfiguration = function() {
		var aControlConfiguration = [new ControlConfiguration({
			hasValueHelpDialog: true,
			key: "Value",
			label: "Value",
			visibleInAdvancedArea: true,
			width: "100px",
			index: 1

		}), new ControlConfiguration({
			hasValueHelpDialog: true,
			key: "Description",
			label: "Description",
			visibleInAdvancedArea: true,
			width: "100px",
			index: 2

		}), new ControlConfiguration({
			hasValueHelpDialog: true,
			key: "VocabularyId",
			label: "VocabularyId",
			width: "100px",
			visible: false,
			index: 3

		}), new ControlConfiguration({
			hasValueHelpDialog: true,
			key: "DataObjectId",
			label: "DataObjectId",
			visible: false,
			width: "100px",
			groupId: "abc",
			index: 4

		}), new ControlConfiguration({
			hasValueHelpDialog: true,
			key: "AttributeId",
			label: "AttributeId",
			visible: false,
			width: "100px",
			index: 5

		}),
		 new ControlConfiguration({
	            hasValueHelpDialog: true,
	            key: "Version",
	            label: "Version",
	            visible: false,
	            width: "100px",
	            index: 6

	        })];
		return aControlConfiguration;
	};

	/*
	 * Called when the search is triggered in SmartFilter.
	 */
	valueHelpDialogProvider.onSearch = function(basePath, valueHelpInfo) {
		this.oValueHelpDialog.getTable().setBusy(true);
		this._unBindTable();
		this._bindTable(basePath, valueHelpInfo);
	};

	/*
	 * Binds the table taking current filters parameters into account.
	 */
	valueHelpDialogProvider._bindTable = function(basePath, valueHelpInfo) {
		var serviceUrl = this.serviceUrl;
		var aFilterParams = this._fetchFilterParams(valueHelpInfo);
		var mEntities = {
			valueHelp: {
				collection: serviceUrl,
				properties: [Constants.PROPERTY_VALUE, Constants.PROPERTY_DESCRIPTION]
			}
		};

		var oTable = this.oValueHelpDialog.getTable();
		oTable.setThreshold(10);

		for (var i = 0; i < mEntities.valueHelp.properties.length; i++) {
			this._addValueHelpColumn(mEntities.valueHelp.properties[i], oTable);
		}

		var oModel = new ODataModel(basePath);
		oTable.setModel(oModel);
		oTable.bindRows(mEntities.valueHelp.collection, null, aFilterParams);
		oTable.getBinding("rows").attachDataReceived(this._handleRowsDataReceived, this);
	};

	//handles the Busy State of the busy state for the data recieved. 
	valueHelpDialogProvider._handleRowsDataReceived = function(oEvent) {
		var that = this;
		var data = oEvent.getParameter("data");
		if (jQuery.isEmptyObject(data) || (data && data.results && data.results.length === 0)) {
			this.oValueHelpDialog.getTable().setNoData(that.oBundle.getText("no_data"));
		} else {
			this.oValueHelpDialog.getTable().setNoData(that.oBundle.getText("searching"));
		}
		this.oValueHelpDialog.getTable().setBusy(false);
	};

	// Utility function to create columns for the table.
	valueHelpDialogProvider._addValueHelpColumn = function(oColumName, oTable) {
		var oColumn = new TableColumn().setLabel(new Label({
			text: oColumName
		}));
		if (oColumName === Constants.PROPERTY_VALUE) {
			oColumn.setSortProperty(oColumName);
		}
		oTable.addColumn(oColumn.setTemplate(new Text().bindProperty("text", oColumName)));
	};

	/*
	 * unBind the table Rows.
	 */
	valueHelpDialogProvider._unBindTable = function() {
		var oTable = this.oValueHelpDialog.getTable();
		oTable.destroyColumns();
		oTable.unbindRows();

	};

	/*
	 * fetch the latest filter parmas depending on the filter or the search param set.
	 */
	valueHelpDialogProvider._fetchFilterParams = function(valueHelpInfo) {
		var that = this;
		var aSearchParams = [];
		var aFilterParams = [new Filter("AttributeId", FilterOperator.EQ, this.attributeId),
			new Filter("DataObjectId", FilterOperator.EQ, this.dataObjectId),
			new Filter("VocabularyId", FilterOperator.EQ, this.vocabularyId)
		];

		var aFilters = this.oFilterBar.getFilters();
		var searchParam = this.oFilterBar.getParameters();
		//When both search and filter is selected
		if (!jQuery.isEmptyObject(searchParam) && aFilters && aFilters.length > 0) {
			searchParam = this.oFilterBar.getParameters().custom.search;
			aSearchParams = this._getSearchFilters(searchParam);
			aFilters = that._formatFilterParams(aFilters);
			aFilterParams.push(new Filter({
				filters: [new Filter(aFilters), new Filter(aSearchParams)],
				and: true
			}));
		} else if (!jQuery.isEmptyObject(searchParam)) {
			//when only Search is selected.
			searchParam = this.oFilterBar.getParameters().custom.search;
			aSearchParams = this._getSearchFilters(searchParam);
			aFilterParams.push(aSearchParams);
		} else if (aFilters && aFilters.length > 0) {
			//When only filters is selected.
			aFilters = that._formatFilterParams(aFilters);
			aFilterParams.push(aFilters[0]);
		}
		return aFilterParams;
	};

	/*
	 * format the filterParams to support Contains and Between.
	 */
	valueHelpDialogProvider._formatFilterParams = function(aFilters) {
		var that = this;
		if (aFilters[0] && aFilters.length === 1 && aFilters[0].aFilters[0] && aFilters[0].aFilters[0].sOperator) {
			aFilters = that._formatSingleFilter(aFilters);
		} else if (aFilters[0] && aFilters[0].aFilters[0] && aFilters[0].aFilters[0].aFilters[0] && aFilters[0].aFilters[0].aFilters[0].aFilters &&
			aFilters[0].aFilters[1].aFilters[0].aFilters) {
			aFilters = that._formatMultiFilter(aFilters, 0, true);
			aFilters = that._formatMultiFilter(aFilters, 1, true);

		} else if (aFilters[0] && aFilters[0].aFilters[0] && aFilters[0].aFilters[1] && aFilters[0].aFilters[0].aFilters[0] && aFilters[0].aFilters[
				0].aFilters[0].aFilters && aFilters[0].aFilters[1].aFilters) {
			aFilters = that._formatMultiFilter(aFilters, 0, true);
			aFilters = that._formatMultiFilter(aFilters, 1, false);

		} else if (aFilters[0] && aFilters[0].aFilters[0] && aFilters[0].aFilters[1] && aFilters[0].aFilters[1].aFilters[0] && aFilters[0].aFilters[
				0].aFilters && aFilters[0].aFilters[1].aFilters[0].aFilters) {
			aFilters = that._formatMultiFilter(aFilters, 0, false);
			aFilters = that._formatMultiFilter(aFilters, 1, true);

		} else if (aFilters[0] && aFilters[0].aFilters[0] && aFilters[0].aFilters[1] && aFilters[0].aFilters[0].aFilters && aFilters[0].aFilters[
				1].aFilters) {
			aFilters = that._formatMultiFilter(aFilters, 0, false);
			aFilters = that._formatMultiFilter(aFilters, 1, false);

		}

		return aFilters;
	};

	valueHelpDialogProvider._formatSingleFilter = function(aFilters) {
		var that = this;
		var _valueField = null;

		for (var iterator = 0; iterator < aFilters[0].aFilters.length; iterator++) {
			if (aFilters[0].aFilters[iterator].sOperator === "Contains") {
				aFilters[0].aFilters[iterator].sOperator = "EQ";
			} else if (aFilters[0].aFilters[iterator].sOperator === "BT") {

				var convertedFilterParam = that._manageParam(aFilters[0].aFilters[iterator].sPath, aFilters[0].aFilters[iterator].sOperator,
					aFilters[0].aFilters[iterator].oValue1, aFilters[0].aFilters[iterator].oValue2);
				delete aFilters[0].aFilters[iterator];
				aFilters[0].aFilters[iterator] = convertedFilterParam;
			} else if (aFilters[0].aFilters[iterator].sOperator === "StartsWith") {
				_valueField = (aFilters[0].aFilters[iterator].sPath === Constants.PROPERTY_VALUE) ? this._valueFieldValue : this._valueFieldDescription;
				_valueField.setValueState("Error");
				_valueField.setValueStateText(aFilters[0].aFilters[iterator].sOperator + " operator not supported");
			} else if (aFilters[0].aFilters[iterator].sOperator === "EndsWith") {
				_valueField = (aFilters[0].aFilters[iterator].sPath === Constants.PROPERTY_VALUE) ? this._valueFieldValue : this._valueFieldDescription;
				_valueField.setValueState("Error");
				_valueField.setValueStateText(aFilters[0].aFilters[iterator].sOperator + " operator not supported");
			}

		}
		return aFilters;

	};
	valueHelpDialogProvider._formatMultiFilter = function(aFilters, index, bMultifilter) {
		var that = this;
		var _valueField = null;
		var aComputeFilterParma = [];
		if (bMultifilter) {
			aComputeFilterParma = aFilters[0].aFilters[index].aFilters[0].aFilters;
		} else {
			aComputeFilterParma = aFilters[0].aFilters[index].aFilters;
		}
		for (var iterator = 0; iterator < aComputeFilterParma.length; iterator++) {
			if (aComputeFilterParma[iterator].sOperator === "Contains") {
				aComputeFilterParma[iterator].sOperator = "EQ";
			} else if (aComputeFilterParma[iterator].sOperator === "BT") {

				var convertedFilterParam = that._manageParam(aComputeFilterParma[iterator].sPath, aComputeFilterParma[iterator].sOperator,
					aComputeFilterParma[iterator].oValue1, aComputeFilterParma[iterator].oValue2);
				delete aComputeFilterParma[iterator];
				aComputeFilterParma[iterator] = convertedFilterParam;

			} else if (aComputeFilterParma[iterator].sOperator === "StartsWith") {
				_valueField = (aComputeFilterParma[iterator].sPath === Constants.PROPERTY_VALUE) ? this._valueFieldValue : this._valueFieldDescription;
				_valueField.setValueState("Error");
				_valueField.setValueStateText(aComputeFilterParma[iterator].sOperator + " operator not supported");
			} else if (aComputeFilterParma[iterator].sOperator === "EndsWith") {
				_valueField = (aComputeFilterParma[iterator].sPath === Constants.PROPERTY_VALUE) ? this._valueFieldValue : this._valueFieldDescription;
				_valueField.setValueState("Error");
				_valueField.setValueStateText(aComputeFilterParma[iterator].sOperator + " operator not supported");
			}
		}
		return aFilters;
	};

	/*
	 * Converts the Between Operator to Less than and Equal to Operator.
	 */
	valueHelpDialogProvider._manageParam = function(sPath, operator, value1, value2) {
		var filterParam = [];
		if (value1 && value2) {
			filterParam = new Filter({
				filters: [new Filter(sPath, FilterOperator.GT, value1),
					new Filter(sPath, FilterOperator.LT, value2)
				],
				and: true
			});
		}
		return filterParam;
	};

	// Utility function to form the search filter params.
	valueHelpDialogProvider._getSearchFilters = function(searchParam) {
		return new Filter({
			filters: [new Filter(Constants.PROPERTY_VALUE, FilterOperator.EQ, searchParam),
				new Filter(Constants.PROPERTY_DESCRIPTION, FilterOperator.EQ, searchParam)
			],
			and: false
		});
	};

	valueHelpDialogProvider.setValueStateFilter = function(oEvent) {
		var sId = oEvent.getSource().sId;
		this._valueFieldValue = Element.getElementById(sId + "-filterItemControlA_-Value");
		if (this._valueFieldValue) {
			this._valueFieldValue.setValueState("None");
			this._valueFieldValue.setValueStateText("");
		}
		this._valueFieldDescription = Element.getElementById(sId + "-filterItemControlA_-Description");
		if (this._valueFieldDescription) {
			this._valueFieldDescription.setValueState("None");
			this._valueFieldDescription.setValueStateText("");
		}
	};

	return valueHelpDialogProvider;
}, true);