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
	"sap/m/DatePicker",
	"sap/m/DateTimePicker",
	"sap/m/TimePicker",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/base/i18n/Formatting",
    "sap/ui/core/format/DateFormat",
    "sap/ui/core/InvisibleText",
    "sap/m/Input",
    "sap/m/Panel",
    "sap/m/ToolbarSpacer",
    "sap/ui/comp/smartfilterbar/SmartFilterBar",
    "sap/ui/comp/valuehelpdialog/ValueHelpDialog",
    "sap/ui/core/library",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/comp/smartfilterbar/ControlConfiguration",
    "sap/ui/table/Column",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/Label",
    "sap/m/Text",
    "sap/m/Link",
    "sap/ui/core/Lib",
    "sap/ui/core/BusyIndicator",
    "sap/ui/core/Element",
	"./AutoSuggestionFixedValuePanelRenderer"
], function (jQuery, library, Control, List, JSONModel, mobileLibrary, CustomData, Sorter, infraUtils,
	LocaleData, Constants, DatePicker , DateTimePicker , TimePicker, Dialog, Button, Formatting, DateFormat, InvisibleText, Input, Panel, ToolbarSpacer, SmartFilterBar,
	ValueHelpDialog, coreLibrary, ODataModel, ControlConfiguration, TableColumn, Filter, FilterOperator, Label, Text, Link, coreLib, BusyIndicator, Element, AutoSuggestionFixedValuePanelRenderer) {
	"use strict";

	var ListMode = mobileLibrary.ListMode;
	var autoSuggestionFixedValuePanel = Control.extend("sap.rules.ui.ast.autoCompleteContent.AutoSuggestionFixedValuePanel", {
		metadata: {
			library: "sap.rules.ui",
			properties: {
				reference: {
					type: "object",
					defaultValue: null,
				},
				vocabularyInfo: {
					type: "object",
					defaultValue: null
				},
				data: {
					type: "object",
					defaultValue: null
				},
				dialogOpenedCallbackReference: {
					type: "object",
					defaultValue: null,
				},
                inputValue: {
                    type: "string",
                    defaultValue: ""
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
			this.infraUtils = new infraUtils.utilsBaseLib();
			this.needCreateLayout = true;
			this.businessDataType = "S";
			this._propertyValue = "Value";
			this._propertyDescription = "Description";
			this.oBundle = coreLib.getResourceBundleFor("sap.rules.ui.i18n");
			this.vocabularyInfo = this.getVocabularyInfo();
			this.autoSuggestionData = this.getData();
			
			// Date instance which is used to convert the selected date from calendar control to short format
			var oLocale = Formatting.getLanguageTag();
			var oLocaleData = LocaleData.getInstance(oLocale);

			this.oFormatDate = DateFormat.getInstance({
					pattern: oLocaleData.getDatePattern('short'),
					calendarType: coreLibrary.CalendarType.Gregorian
				},
				oLocale
			);
		},
		onBeforeRendering: function () {
			this._reference = this.getReference();
			this._dialogOpenedCallbackReference = this.getDialogOpenedCallbackReference();
			this.vocabularyInfo = this.getVocabularyInfo();
			this.valueHelpData = this.getData();
			if (this.needCreateLayout) {
				var layout = this._createLayout(this.vocabularyInfo);
				this.setAggregation("PanelLayout", layout, true);
				this.needCreateLayout = false;
			}
		},

		onAfterRendering: function () {
			var sId = "#" + this.fixedValueTextArea.getId();
			$(sId).on('keydown', function (event) {
				if (event.key == 'Enter') {
					event.preventDefault();
				}
			});
		},

		initializeVariables: function () {

		},

		_createLayout: function (vocabularyInfo) {
			var that = this;
			var hasValueSource = false;
			if (this.getData().valuehelp) {
				hasValueSource = true;
			} else {
				hasValueSource = false;
			}
			//The invisible text is introduced to identify the input field by screen reader.
			this._invisibleTextLabel = new InvisibleText({
				text:this.oBundle.getText("fixedValuePanelTitle")
			})
			this._invisibleTextDescription = new InvisibleText({
				text:this.oBundle.getText("fixedValueInvisibleText")
			});
			this.fixedValueTextArea = new Input({
				showValueHelp: hasValueSource,
				showSuggestion: true,
				autocomplete: false,
				ariaLabelledBy: this._invisibleTextLabel.getId(),
				ariaDescribedBy: this._invisibleTextDescription.getId(),
				valueHelpRequest: function () {
					that._dialogOpenedCallbackReference(true);
					that._setModal(true);
					that._generateValueHelpInfoAndCreateDialog(vocabularyInfo)
				},
                value: this.getInputValue(),
				change: function (event) {
					that._setModal(false);
					var oEvent = that._formatText(event);
					oEvent.oSource.mProperties.forceFireChange = true;
					that._reference(oEvent);
				}.bind(this),
				width: "auto"
			});

			var fixedValuePanel = new Panel({
				headerText: this.oBundle.getText("fixedValuePanelTitle"),
				expandable: true,
				expanded: false,
				content: [this._invisibleTextLabel, this._invisibleTextDescription, this.fixedValueTextArea],
				width: "auto"
			})
			
			this.toolBarSpacerAfterInput =	new ToolbarSpacer({width: "1em"});
			this.toolBarSpacerAfterDateLink =	new ToolbarSpacer({width: "1em"});
			this.dateContent = this._createDateLink();
			this.timeContent = this._createTimeStampLink();
			fixedValuePanel.addContent(this.toolBarSpacerAfterInput);
			fixedValuePanel.addContent(this.dateContent);
			fixedValuePanel.addContent(this.toolBarSpacerAfterDateLink);
			fixedValuePanel.addContent(this.timeContent);

			return fixedValuePanel;
		},

		_setModal: function (value) {
			var pop = Element.getElementById("popover");
			if (pop) {
				pop.setModal(value);
			}
		},

        /* ------------------ Value Help related functions ---------------------------*/
		_generateValueHelpInfoAndCreateDialog: function (vocabularyInfo) {
			var that = this;
			var valueHelpInfo = this.getData().valuehelp;
			if (valueHelpInfo) {
				valueHelpInfo.expressionLanguage = vocabularyInfo;
				valueHelpInfo.HasValueSource = true;
				if (valueHelpInfo.sourceType === "U") {
					valueHelpInfo.entitySet = "Enumerations";
					valueHelpInfo.serviceURL = "/Enumerations";
				} else {
					valueHelpInfo.entitySet = "ExternalValues";
					valueHelpInfo.serviceURL = "/ExternalValues";
				}

				var basePath = vocabularyInfo.getModel().sServiceUrl;
				that._createDialog(basePath, valueHelpInfo);
			}
		},

		_createDialog: function (basePath, valueHelpInfo, businessDataType) {
			this._createValueHelpDialog(basePath, valueHelpInfo);
			this.oValueHelpDialog.getTableAsync().then(function (oTable) {
				this.oValueHelpDialogTable = oTable;
				this._createSmartFilterBar(basePath, valueHelpInfo);
                this.oValueHelpDialog.setFilterBar(this.oFilterBar);
                this._openValueHelpDialog();
            }.bind(this));

		},

		_openValueHelpDialog: function () {
			this.oValueHelpDialog.open();
			this.oValueHelpDialogTable.setBusy(true);
		},

		/*
		 * Creates the Value Help Dialog.
		 */

		_createValueHelpDialog: function (basePath, valueHelpInfo) {
			var that = this;
			var expressionData = valueHelpInfo.expressionLanguage.getModel();
			var attributePath = "Attributes(Id='" + valueHelpInfo.attributeId + "',VocabularyId='" + valueHelpInfo.vocabularyId +
				"',DataObjectId='" + valueHelpInfo.dataObjectId + "')";
			if(attributePath.includes(":")) {
				attributePath = attributePath = attributePath.replace(":","%3A");
			}
			this.attributeName = valueHelpInfo.attributeName;
			if(!expressionData.oData[attributePath]){
				valueHelpInfo.dataObjectId = this._getStructureObjectForTableType(valueHelpInfo.attributeId, valueHelpInfo);
			}
			BusyIndicator.show(0);
			this.oValueHelpDialog = new ValueHelpDialog({
				supportMultiselect: false,
				supportRanges: false,
				horizontalScrolling: false,
				title: that.attributeName,
				resizable: false,
				beforeOpen: function () {
					that._bindTable(basePath, valueHelpInfo);
				},
				ok: function (oEvt) {
					var oSelRow = oEvt.getParameter("tokens")[0].data("row");
					var value = oSelRow.Value;
					if (that.businessDataType === "D" || that.businessDataType === "U") {
						value = that._getValidValue(value);
					}
					var updatedToken = this._syncToken(value, that.businessDataType);
					oEvt.getParameter("tokens")[0].data("row").Value = updatedToken;
					oEvt.oSource.mProperties.forceFireChange = true;
					that._dialogOpenedCallbackReference(false);
					that.oValueHelpDialog.close();
					that._setModal(false);
					that.oValueHelpDialog.destroy();
					BusyIndicator.hide();
					that._reference(oEvt);
				}.bind(this),
				cancel: function () {
					that.oFilterBar.destroy();
					that._setModal(false);
					that.oValueHelpDialog.close();
					that.oValueHelpDialog.destroy();
					BusyIndicator.hide();
				},
				afterClose: function () {
					that._dialogOpenedCallbackReference(false);
					that.oFilterBar.destroy();
					BusyIndicator.hide();
				}
			});
		},
		
		_getStructureObjectForTableType: function(attributeId, valueHelpInfo){
			var valueSources = valueHelpInfo.expressionLanguage.getData().ValueSources;
			for(var entry in valueSources){
				if(attributeId === valueSources[entry].AttributeId){
					return valueSources[entry].DataObjectId;
				}
			}
			return valueHelpInfo.dataObjectId;
		},

		_syncToken: function (textEntered, businessDataType) {
			var addStartQuote = false;
			var addEndQuote = false;
			businessDataType = this.getData().valuehelp.attributeDataType;
			//truncate single and double quotes if the user has entered it
			if (businessDataType != "G") {
				var newValue = textEntered.replace(/'/g, "").replace(/"/g, "");
			} else {
				newValue = "'" + textEntered + "'";
			}
			
			//Handling for passing number when no context is available
			if (businessDataType === "N") {
				var newIntValue = parseFloat(newValue);
				var stringFormOfIntValue = newIntValue.toString();
				// Some text is truncated by parse int
				if (stringFormOfIntValue != newValue) {
					businessDataType = "Operations"
				} else if (stringFormOfIntValue === "NaN") {
					businessDataType = "S"
				} else {
					newValue = newIntValue;
				}

			}

			if (businessDataType === "S" || businessDataType === "D" || businessDataType === "U") {
				if (!(businessDataType === "S")) {
					if (businessDataType === "D") {
						this._dateBusinessDataType = "D";
					} else if (businessDataType === "U") {
						this._dateBusinessDataType = "U";
					}
					newValue = this._getValidDateValue(newValue);
				}

				newValue = newValue.toString();
				if (newValue === "'") {
					addStartQuote = true;
				} // add only quote for this special case
				if (newValue.substr(0, "'") !== "'") {
					addStartQuote = true;
				}
				if (newValue.substr(newValue.length - 1, "'") !== "'") {
					addEndQuote = true;
				}

				if (addStartQuote) {
					newValue = "'" + newValue;
				}
				if (addEndQuote) {
					newValue = newValue + "'";
				}

			}

			if (businessDataType === "B") {
				newValue = (newValue === "true");
			}
			return newValue;
		},

		_getValidDateValue: function (sValue) {
			var date, formatter;
            var sDateFormatted = "";
            var formatterParsing = this._getDateTimeFormatterForParsing();
            if (formatterParsing) {
                date = formatterParsing.parse(sValue);
            }
            if (this._dateBusinessDataType === "D") {
                formatter = DateFormat.getDateInstance({
                    pattern: "yyyy-MM-dd"
                });
                sDateFormatted = formatter.format(date);
            } else if (this._dateBusinessDataType === "U") {
                formatter = DateFormat.getDateTimeInstance({
                    pattern: "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
                    UTC:true
                });
                sDateFormatted = formatter.format(date);
            }
            if (sDateFormatted !== "") {
                sDateFormatted;
            }
            return sValue;
		},

		/*
		 * Creates the necessary control os SmartFilterBar for the ValueHelp Dialog.
		 */
		_createSmartFilterBar: function (basePath, valueHelpInfo) {
			var that = this;
			this.oFilterBar = new SmartFilterBar({
				entitySet: valueHelpInfo.entitySet,
				enableBasicSearch: true,
				advancedMode: true,
				filterBarExpanded: true,
				search: function () {
					that.onSearch(basePath, valueHelpInfo);

				},
				filterChange: function (oEvent) {
					that.setValueStateFilter(oEvent, valueHelpInfo);
				},
				controlConfiguration: [that._createControlConfiguration()]
			});
			var oModel = new ODataModel(basePath);
			this.oFilterBar.setModel(oModel);
		},

		/*
		 * Creating the Control Configuration for the smartFilter of the valueHelp Dialog.
		 */
		_createControlConfiguration: function () {
			var aControlConfiguration = [new ControlConfiguration({
					hasValueHelpDialog: true,
					key: "Value",
					label: this.oBundle.getText("value"),
					visibleInAdvancedArea: true,
					width: "100px",
					index: 1

				}), new ControlConfiguration({
					hasValueHelpDialog: true,
					key: "Description",
					label: this.oBundle.getText("description"),
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

				})
			];
			return aControlConfiguration;
		},

		/*
		 * Called when the search is triggered in SmartFilter.
		 */
		onSearch: function (basePath, valueHelpInfo) {
			this.oValueHelpDialogTable.setBusy(true);
			this._unBindTable();
			this._bindTable(basePath, valueHelpInfo);
		},

		/*
		 * Binds the table taking current filters parameters into account.
		 */
		_bindTable: function (basePath, valueHelpInfo) {
			var serviceUrl = valueHelpInfo.serviceURL;
			var aFilterParams = this._fetchFilterParams(valueHelpInfo);
			var mEntities = {
				valueHelp: {
					collection: serviceUrl,
					properties: [this._propertyValue, this._propertyDescription]
				}
			};

			var oTable = this.oValueHelpDialogTable;
			oTable.setThreshold(10);

			for (var i = 0; i < mEntities.valueHelp.properties.length; i++) {
				var sColumnName = "";
				if (mEntities.valueHelp.properties[i] === "Value") {
					sColumnName = this.oBundle.getText("value");
				} else if(mEntities.valueHelp.properties[i] === "Description") {
					sColumnName = this.oBundle.getText("description");
				}
				this._addValueHelpColumn(mEntities.valueHelp.properties[i], oTable, sColumnName);
			}

			var oModel = new ODataModel(basePath);
			oTable.setModel(oModel);
			oTable.bindRows(mEntities.valueHelp.collection, null, aFilterParams);
			oTable.getBinding("rows").attachDataReceived(this._handleRowsDataReceived, this);
		},

		//handles the Busy State of the busy state for the data recieved. 
		_handleRowsDataReceived: function (oEvent) {
			var that = this;
			var data = oEvent.getParameter("data");
			if (jQuery.isEmptyObject(data) || (data && data.results && data.results.length === 0)) {
				this.oValueHelpDialogTable.setNoData(that.oBundle.getText("no_data"));
			} else {
				this.oValueHelpDialogTable.setNoData(that.oBundle.getText("searching"));
			}
			this.oValueHelpDialogTable.setBusy(false);
		},

		// Utility function to create columns for the table.
		_addValueHelpColumn: function (oColumName, oTable, sColumnName) {
			var oColumn = new TableColumn().setLabel(new Label({
				text: sColumnName
			}));
			if (oColumName === this._propertyValue) {
				oColumn.setSortProperty(sColumnName);
			}
			oTable.addColumn(oColumn.setTemplate(new Text().bindProperty("text", oColumName)));
		},

		/*
		 * unBind the table Rows.
		 */
		_unBindTable: function () {
			var oTable = this.oValueHelpDialogTable;
			oTable.destroyColumns();
			oTable.unbindRows();

		},

		/*
		 * fetch the latest filter parmas depending on the filter or the search param set.
		 */
		_fetchFilterParams: function (valueHelpInfo) {
			var that = this;
			var aSearchParams = [];
			var aFilterParams = [new Filter("AttributeId",FilterOperator.EQ, valueHelpInfo.attributeId),
				new Filter("DataObjectId", FilterOperator.EQ, valueHelpInfo.dataObjectId),
				new Filter("VocabularyId", FilterOperator.EQ, valueHelpInfo.vocabularyId)
			];

			var aFilters = this.oFilterBar.getFilters();
			var searchParam = this.oFilterBar.getParameters();
			//When both search and filter is selected
			if (!jQuery.isEmptyObject(searchParam) && aFilters && aFilters.length > 0) {
				searchParam = this.oFilterBar.getParameters().custom.search;
				aSearchParams = this._getSearchFilters(searchParam);
				aFilters = that._formatFilterParams(aFilters, valueHelpInfo.sourceType);
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
				aFilters = that._formatFilterParams(aFilters, valueHelpInfo.sourceType);
				aFilterParams.push(aFilters[0]);
			}
			return aFilterParams;
		},

		/*
		 * format the filterParams to support Contains and Between.
		 */
		_formatFilterParams: function (aFilters, valuehelpSourceType) {
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
		},

		_formatSingleFilter: function (aFilters) {
			var that = this;
			var _valueField = null;

			for (var iterator = 0; iterator < aFilters[0].aFilters.length; iterator++) {
				if (aFilters[0].aFilters[iterator].sOperator === "Contains") {
					_valueField = (aFilters[0].aFilters[iterator].sPath === this._propertyValue) ? this._valueFieldValue : this._valueFieldDescription;
				} else if (aFilters[0].aFilters[iterator].sOperator === "BT") {

					var convertedFilterParam = that._manageParam(aFilters[0].aFilters[iterator].sPath, aFilters[0].aFilters[iterator].sOperator,
						aFilters[0].aFilters[iterator].oValue1, aFilters[0].aFilters[iterator].oValue2);
					delete aFilters[0].aFilters[iterator];
					aFilters[0].aFilters[iterator] = convertedFilterParam;
				} else if (aFilters[0].aFilters[iterator].sOperator === "StartsWith") {
					_valueField = (aFilters[0].aFilters[iterator].sPath === this._propertyValue) ? this._valueFieldValue : this._valueFieldDescription;
					_valueField.setValueState("Error");
					_valueField.setValueStateText(aFilters[0].aFilters[iterator].sOperator + " operator not supported");
				} else if (aFilters[0].aFilters[iterator].sOperator === "EndsWith") {
					_valueField = (aFilters[0].aFilters[iterator].sPath === this._propertyValue) ? this._valueFieldValue : this._valueFieldDescription;
					_valueField.setValueState("Error");
					_valueField.setValueStateText(aFilters[0].aFilters[iterator].sOperator + " operator not supported");
				}

			}
			return aFilters;

		},

		_formatMultiFilter: function (aFilters, index, bMultifilter) {
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
					_valueField = (aComputeFilterParma[iterator].sPath === this._propertyValue) ? this._valueFieldValue : this._valueFieldDescription;
				} else if (aComputeFilterParma[iterator].sOperator === "BT") {

					var convertedFilterParam = that._manageParam(aComputeFilterParma[iterator].sPath, aComputeFilterParma[iterator].sOperator,
						aComputeFilterParma[iterator].oValue1, aComputeFilterParma[iterator].oValue2);
					delete aComputeFilterParma[iterator];
					aComputeFilterParma[iterator] = convertedFilterParam;

				} else if (aComputeFilterParma[iterator].sOperator === "StartsWith") {
					_valueField = (aComputeFilterParma[iterator].sPath === this._propertyValue) ? this._valueFieldValue : this._valueFieldDescription;
					_valueField.setValueState("Error");
					_valueField.setValueStateText(aComputeFilterParma[iterator].sOperator + " operator not supported");
				} else if (aComputeFilterParma[iterator].sOperator === "EndsWith") {
					_valueField = (aComputeFilterParma[iterator].sPath === this._propertyValue) ? this._valueFieldValue : this._valueFieldDescription;
					_valueField.setValueState("Error");
					_valueField.setValueStateText(aComputeFilterParma[iterator].sOperator + " operator not supported");
				}
			}
			return aFilters;
		},

		/*
		 * Converts the Between Operator to Less than and Equal to Operator.
		 */
		_manageParam: function (sPath, operator, value1, value2) {
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
		},

		// Utility function to form the search filter params.
		_getSearchFilters: function (searchParam) {
			return new Filter({
				filters: [new Filter(this._propertyValue, FilterOperator.EQ, searchParam),
					new Filter(this._propertyDescription, FilterOperator.EQ, searchParam)
				],
				and: false
			});
		},

		setValueStateFilter: function (oEvent, valueHelpInfo) {
			var aFilterFields = oEvent.getSource().getAllFilterItems();
			var aFilterValues = oEvent.getSource().getFilterData();
			
			for (var i=0;i<aFilterFields.length; i++){
				if(aFilterFields[i].getName() === "Value" && aFilterValues && aFilterValues.Value && aFilterValues.Value.ranges) {
					var unsupportedOperatorsValueError = this.filterUnSupportedOperator(aFilterValues.Value.ranges, valueHelpInfo);
					if (unsupportedOperatorsValueError) {
						aFilterFields[i].getControl().setValueState("Error");
						aFilterFields[i].getControl().setValueStateText(unsupportedOperatorsValueError);
					} else {
						aFilterFields[i].getControl().setValueState("None");
						aFilterFields[i].getControl().setValueStateText("");
					}
				} else if(aFilterFields[i].getName() === "Description" && aFilterValues && aFilterValues.Description && aFilterValues.Description.ranges) {
					var unsupportedOperatorsDescriptionError = this.filterUnSupportedOperator(aFilterValues.Description.ranges, valueHelpInfo);
					if (unsupportedOperatorsDescriptionError) {
						aFilterFields[i].getControl().setValueState("Error");
						aFilterFields[i].getControl().setValueStateText(unsupportedOperatorsDescriptionError);
					} else {
						aFilterFields[i].getControl().setValueState("None");
						aFilterFields[i].getControl().setValueStateText("");
					}
				} else if(aFilterFields[i].getName() === "Value") {
						aFilterFields[i].getControl().setValueState("None");
						aFilterFields[i].getControl().setValueStateText("");
				} else if(aFilterFields[i].getName() === "Description") {
						aFilterFields[i].getControl().setValueState("None");
						aFilterFields[i].getControl().setValueStateText("");
				}
			}
		},
		
		filterUnSupportedOperator: function(aRanges, valueHelpInfo) {
			var aUnSupportedOperator = [];
			var sUnSupportedOperatorError = "";
			for(var i=0;i<aRanges.length;i++) {
				var currentMapping = Constants.OPERATOR_MAPPING.find(function(oItem){
					return aRanges[i].operation === oItem.operator && aRanges[i].exclude === oItem.exclude && valueHelpInfo.sourceType === oItem.valueHelpType
				})
				if (!currentMapping.supported && aUnSupportedOperator.indexOf("'" + currentMapping.message + "'") === -1) {
					aUnSupportedOperator.push("'" + currentMapping.message + "'");
				}
			}
			if (aUnSupportedOperator.length > 1) {
				sUnSupportedOperatorError = aUnSupportedOperator.join(",") + " are not supported";
			} else if (aUnSupportedOperator.length === 1) {
				sUnSupportedOperatorError = aUnSupportedOperator.join(",") + " is not supported";
			}
			return sUnSupportedOperatorError;
		},

		_formatText: function (oEvent) {
			var that = this;
			var businessDataTypeList = this.getData().businessDataTypeList;
			if (businessDataTypeList && businessDataTypeList.length > 0) {
				this.businessDataType = this.getData().businessDataTypeList[0];
			} else {
				this.businessDataType = "N"
			}
			var token = oEvent.getSource().getValue();
			oEvent.getSource().setValue(token);
			return oEvent;
		},
		
		/* ------------------------------- Date and Time related functions -------------------------- */
		_createDateLink : function(){
			var that = this;
			this.dateContent = new Link({
				wrapping: true,
				text: this.oBundle.getText("select_date"),
				press: function (oEvent) {
					that.dateContext = "D";
					that._createDateTimeDialog();
				}
			});
			return this.dateContent;
		},
		
		_createTimeStampLink : function() {
			var that = this;
			this.timeContent = new Link({
				wrapping: true,
				text: this.oBundle.getText("select_date_time"),
				press: function (oEvent) {
					that.dateContext = "U";
					that._createDateTimeDialog();
				}
			});
			return this.timeContent;
		},
		
		//creates calender control
		_createDateTimeDialog: function () {
			var that = this;
			var oLocale = Formatting.getLanguageTag();
			var oLocaleData = LocaleData.getInstance(oLocale);
			var dateFormatted = oLocaleData.getDatePattern('medium');
			var timeFormat = oLocaleData.getTimePattern('medium');
			var sValueFormat = dateFormatted + " " + timeFormat;
			
			if(this.dateContext){
				this._dateBusinessDataType = this.dateContext;
			}
			if (this._dateBusinessDataType === "D") {
				this.control = new DatePicker({
					width: "auto",
					valueFormat: dateFormatted
				});
			}

			if (this._dateBusinessDataType === "U") {
				var that = this;
				this.control = new DateTimePicker({
					width: "auto",
					valueFormat: sValueFormat
				});

			}

			this._oSelectNewDateDialog = new Dialog({
				title: this.oBundle.getText("calendarTitle"),
				afterClose: function () {
								that._dialogOpenedCallbackReference(false);
							},
				content: [
					this.control
				],
				beginButton: new Button({
					text: this.oBundle.getText("okBtn"),
					enabled: true,
					press: function (oEvt) {
						var date = this._updateText(this.control);
						oEvt.oSource.mProperties.value = "'" + date + "'";
						oEvt.oSource.mProperties.dateSelected = this._dateBusinessDataType;
						oEvt.oSource.mProperties.forceFireChange = true;
						that._reference(oEvt);
						that._setModal(false);
						that._oSelectNewDateDialog.close();
					}.bind(this)
				}),
				endButton: new Button({
					text: this.oBundle.getText("clsBtn"),
					press: function () {
						that._setModal(false);
						that._oSelectNewDateDialog.close();
					}.bind(this)
				})
			});
			this._dialogOpenedCallbackReference(true);
			this._setModal(true);
			this._oSelectNewDateDialog.open();

		},
		
			// Utility function to format date and timestamp
		_updateText: function (oCalendar) {
			var aSelectedDates = oCalendar._getInputValue();
			var formattedDate = this._getValidValue(aSelectedDates);
			return formattedDate; //aSelectedDates;//formattedDate;
		},

		_getValidValue: function (sValue) {
			var date, formatter;
            var sDateFormatted = "";
            if (this.dateContext) {
                this._dateBusinessDataType = this.dateContext;
            }
            var formatterParsing = this._getDateTimeFormatterForParsing();
            if (formatterParsing) {
                date = formatterParsing.parse(sValue);
            }
            if (this._dateBusinessDataType === "D") {
                formatter = DateFormat.getDateInstance({
                    pattern: "yyyy-MM-dd"
                });
                sDateFormatted = formatter.format(date);
            } else if (this._dateBusinessDataType === "U") {
                formatter = DateFormat.getDateTimeInstance({
                    pattern: "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
                    UTC:true
                });
                sDateFormatted = formatter.format(date);
            }
            if (sDateFormatted !== "") {
                return sDateFormatted;
            }
            return sValue;
		},
		
		_getDateTimeFormatterForParsing: function () {
            var formatter;
            var oLocale = Formatting.getLanguageTag();
            var oLocaleData = LocaleData.getInstance(oLocale);
            var datePattern = oLocaleData.getDatePattern('medium');
            var timePattern = oLocaleData.getTimePattern('medium');
            if (this.dateContext === "D") {
                formatter = DateFormat.getDateInstance({
                    pattern: datePattern
                });
            } else if (this.dateContext === "U") {
                formatter = DateFormat.getDateTimeInstance({
                    pattern: datePattern + " " + timePattern
                });
            }
            return formatter;
        },
        renderer: AutoSuggestionFixedValuePanelRenderer
		

	});

	return autoSuggestionFixedValuePanel;
}, /* bExport= */ true);
