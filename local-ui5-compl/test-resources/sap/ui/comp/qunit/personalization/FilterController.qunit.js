/* global QUnit, sinon */
sap.ui.define([
	'sap/m/MessageStrip',
	'sap/ui/comp/personalization/FilterController',
	'sap/ui/comp/personalization/Controller',
	'sap/chart/library',
	'sap/chart/Chart',
	'sap/ui/model/Filter',
	'sap/ui/table/Table',
	'sap/ui/table/Column',
	'sap/m/Table',
	'sap/m/Column',
	'sap/m/Label',
	'sap/ui/model/json/JSONModel',
	'sap/m/ColumnListItem',
	'sap/ui/core/CustomData',
	'sap/chart/data/Dimension',
	'sap/chart/data/Measure',
	'sap/ui/comp/personalization/ChartWrapper',
	'sap/base/util/merge',
	'sap/m/Input',
	'sap/m/MultiInput',
	'sap/m/ComboBox',
	'sap/m/P13nFilterPanel',
	'sap/ui/comp/smartfilterbar/SmartFilterBar',
	'sap/ui/comp/smartfilterbar/FilterProvider',
	'sap/ui/comp/smarttable/SmartTable',
	'sap/ui/comp/providers/TableProvider',
	'sap/ui/model/odata/type/DateTimeOffset',
	'sap/ui/layout/Grid',
	'sap/m/p13n/FilterPanel',
	'sap/m/MultiComboBox'

], function(
	MessageStrip,
	FilterController,
	Controller,
	chartLibrary,
	Chart,
	Filter,
	UiTable,
	UiColumn,
	MTable,
	MColumn,
	Label,
	JSONModel,
	ColumnListItem,
	CustomData,
	Dimension,
	Measure,
	ChartWrapper,
	merge,
	Input,
	MultiInput,
	ComboBox,
	P13nFilterPanel,
	SmartFilterBar,
	FilterProvider,
	SmartTable,
	TableProvider,
	DateTimeOffset,
	GridLayout,
	MDCFilterPanel,
	MultiComboBox
) {
	'use strict';

	var oEmpty = {
		filter: {
			filterItems: []
		}
	};
	var oA = {
		filter: {
			filterItems: [
				{
					columnKey: "name",
					operation: "Contains",
					value1: "A"
				}
			]
		}
	};
	var oAx = {
		filter: {
			filterItems: [
				{
					columnKey: "name",
					operation: "Contains",
					value1: "B"
				}
			]
		}
	};
	var oB = {
		filter: {
			filterItems: [
				{
					columnKey: "country",
					operation: "Contains",
					value1: "A"
				}
			]
		}
	};
	var oAB = {
		filter: {
			filterItems: [
				{
					columnKey: "name",
					operation: "Contains",
					value1: "A"
				}, {
					columnKey: "country",
					operation: "Contains",
					value1: "A"
				}
			]
		}
	};
	var oBA = {
		filter: {
			filterItems: [
				{
					columnKey: "country",
					operation: "Contains",
					value1: "A"
				}, {
					columnKey: "name",
					operation: "Contains",
					value1: "A"
				}
			]
		}
	};
	var addFilterProperty = function(oTable, aColumns) {
		if (oTable instanceof UiTable) {
			var oBinding = oTable.getBinding("rows");
			var aFilters = [];
			aColumns.forEach(function(oColumn) {
				oColumn.setFilterProperty(oColumn.getId());
				aFilters.push(new Filter(oColumn.getFilterProperty(), "BT", "A", "B"));
				oColumn.setFiltered(true);
			});
			oBinding.filter(aFilters);
		} else if (oTable instanceof MTable) {
			aColumns.forEach(function(oColumn) {
				var oP13nData = oColumn.data("p13nData");
				oP13nData.filterProperty = oP13nData.columnKey;
			});
		}
	};

	var createTable = function(sTableType, oData) {
		oData = oData || {
			items: [
				{
					"date": "2/5/1982",
					"number": 103,
					"city": "McDermotttown",
					"country": "Svalbard and Jan Mayen",
					"name": "Mary"
				}
			],
			columns: [
				{
					id: "name",
					text: "Name",
					path: "name"
				},
				{
					id: "country",
					text: "Country",
					path: "country"
				},
				{
					id: "city",
					text: "City",
					path: "city"
				}
			]
		};
		var oTable = null;
		if (sTableType === "UITable") {
			oTable = new UiTable('testUITable', {
				columns: oData.columns.map(function(oModelColumn) {
					return new UiColumn(oModelColumn.id, {
						label: new Label({
							text: oModelColumn.text
						}),
						template: new Label({
							text: {
								path: oModelColumn.path
							}
						})
					});
				})
			});
			oTable.setModel(new JSONModel());
			oTable.bindRows("/items");
		} else if (sTableType === "MTable") {
			oTable = new MTable("testMTable", {
				columns: oData.columns.map(function(oModelColumn) {
					return new MColumn(oModelColumn.id, {
						header: new Label({
							text: oModelColumn.text
						}),
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: oModelColumn.path,
								fullName: oModelColumn.path
							}
						})
					});
				})
			});
			oTable.setModel(new JSONModel());
			oTable.bindAggregation("items", "/items", new ColumnListItem({
				cells: oData.columns.map(function(oModelColumn) {
					return new Label({
						text: oModelColumn.text
					});
				})
			}));
		} else if (sTableType === "Chart") {
			var oChart = new Chart("testChart", {
				width: '100%',
				isAnalytical: true,
				uiConfig: {
					applicationSet: 'fiori'
				},
				chartType: chartLibrary.ChartType.Column,
				selectionMode: chartLibrary.SelectionMode.Single,
				visibleDimensions: [
					"name", "city"
				],
				visibleMeasures: [
					"number", "date"
				],
				dimensions: oData.columns.filter(function(oModelColumn) {
					return oModelColumn.aggregationRole === "dimension";
				}).map(function(oModelColumn) {
					var oColumn = new Dimension({
						label: oModelColumn.text,
						name: oModelColumn.path
					});
					oColumn.data("p13nData", {
						columnKey: oModelColumn.path
					});
					return oColumn;
				}),
				measures: oData.columns.filter(function(oModelColumn) {
					return oModelColumn.aggregationRole === "measure";
				}).map(function(oModelColumn) {
					var oColumn = new Measure({
						label: oModelColumn.text,
						name: oModelColumn.path
					});
					oColumn.data("p13nData", {
						columnKey: oModelColumn.path
					});
					return oColumn;
				})
			});
			var aNotDimeasure = oData.columns.filter(function(oModelColumn) {
				return oModelColumn.aggregationRole !== "dimension" && oModelColumn.aggregationRole !== "measure";
			}).map(function(oModelColumn) {
				return {
					columnKey: oModelColumn.path,
					leadingProperty: oModelColumn.path,
					sortProperty: true,
					filterProperty: true,
					label: oModelColumn.text,
					tooltip: oModelColumn.text
				};
			});

			oChart.setModel(new JSONModel());
			oTable = ChartWrapper.createChartWrapper(oChart, aNotDimeasure, [
				"name", "country", "city"
			]);
		}
		return oTable;
	};

	var getSettingFor = function(aTypes) {
		var oSetting = merge({}, {
			columns: {
				visible: false
			},
			group: {
				visible: false
			},
			filter: {
				visible: false
			},
			sort: {
				visible: false
			},
			dimeasure: {
				visible: false
			}
		});
		aTypes.forEach(function(sType) {
			oSetting[sType].visible = true;
		});
		return oSetting;
	};
	QUnit.module("API tests for FilterController", {
		beforeEach: function() {
			this.oFilterController = new FilterController();
		},
		afterEach: function() {
			this.oFilterController.destroy();
		}
	});

	QUnit.test("getChangeData", function(assert) {

		assert.deepEqual(this.oFilterController.getChangeData(oEmpty, oA), oEmpty, "delete: [] XOR A = []");
		assert.deepEqual(this.oFilterController.getChangeData({}, oA), oEmpty, "");
		assert.deepEqual(this.oFilterController.getChangeData(oA, oA), null, "no change: A XOR A = null");
		assert.deepEqual(this.oFilterController.getChangeData(oA, {
			filter: {}
		}), oA, "change: A XOR {filter} = A");
		assert.deepEqual(this.oFilterController.getChangeData(oA, {}), oA, "change: A XOR {} = A");
		assert.deepEqual(this.oFilterController.getChangeData(oA, null), oA, "change: A XOR null = A");
		assert.deepEqual(this.oFilterController.getChangeData(oA, oB), oA, "change: A XOR B = A");
		assert.deepEqual(this.oFilterController.getChangeData(oA, oAx), oA, "change: A XOR A' = A");
		assert.deepEqual(this.oFilterController.getChangeData(oA, oAB), oA, "change: A XOR (A, B) = A");
		assert.deepEqual(this.oFilterController.getChangeData(oA, {
			filter: {
				filterItems: []
			}
		}), oA, "change: A XOR [] = A");
		assert.deepEqual(this.oFilterController.getChangeData(oAx, oA), oAx, "change: A' XOR A = A'");
		assert.deepEqual(this.oFilterController.getChangeData(oAB, oAB), null, "no change: (A, B) XOR (A, B) = null");
		assert.deepEqual(this.oFilterController.getChangeData(oAB, oBA), oAB, "change: (A, B) XOR (B, A) = (A, B)");

	});

	QUnit.test("getChangeType", function(assert) {
		assert.ok(this.oFilterController.getChangeType(oEmpty, oA));
	});

	QUnit.test("getChangeType", function(assert) {
		assert.ok(this.oFilterController.getChangeType(oEmpty, null));
	});


	var fTestTableTypes = function(sTableType, assert) {
		// system under test
		var oTable = createTable(sTableType);
		var oChart = sTableType === "Chart" ? oTable.getChartObject() : null;
		addFilterProperty(oTable, [
			oTable.getColumns()[0]
		]);
		var oController = new Controller({
			table: oTable,
			setting: getSettingFor([
				"filter"
			])
		});

		// act
		var oJson = oController._oSettingCurrent.filter.controller.getTable2Json(oController._oSettingCurrent.filter.controller.createColumnKeysStructure(oController.getColumnKeys()));

		// assertions
		assert.ok(oJson);

		// cleanup
		oController.destroy();
		oTable.destroy();
		if (oChart) {
			oChart.destroy();
		}

	};

	QUnit.test("setTable (UITable)", function(assert) {
		fTestTableTypes("UITable", assert);
	});
	QUnit.test("setTable (MTable)", function(assert) {
		fTestTableTypes("MTable", assert);
	});
	/**
	 * @deprecated
	 */
	QUnit.test("setTable (Chart)", function(assert) {
		fTestTableTypes("Chart", assert);
	});

	QUnit.module("API tests for FilterController with mocked data", {
		beforeEach: function() {
			//create the test environment: Table + Controller + FilterController
			this.oTable = createTable("UITable");
			this.oController = new Controller({
				table: this.oTable,
				setting: getSettingFor([
					"filter"
				])
			});
			this.oFilterController = this.oController._oSettingCurrent.filter.controller;
		},
		afterEach: function() {
			this.oFilterController.destroy();
			this.oTable.destroy();
			this.oController.destroy();
		}
	});

	QUnit.test("syncJson2Table - filter is set to first column", function(assert) {

		this.oFilterController.syncJson2Table({
			filter: {
				filterItems: [
					{
						columnKey: "name"
					}
				]
			}
		});

		assert.ok(this.oTable.getColumns()[0].getFiltered());
	});

	QUnit.test("syncJson2Table - table with 1. column as filterable -> filter is set to 3. column", function(assert) {
		this.oFilterController.syncJson2Table({
			filter: {
				filterItems: [
					{
						columnKey: "city"
					}
				]
			}
		});

		assert.ok(!this.oTable.getColumns()[0].getFiltered());
		assert.ok(this.oTable.getColumns()[2].getFiltered());
	});

	QUnit.test("getPanel - with filterable columns", function(assert) {
		addFilterProperty(this.oTable, [
			this.oTable.getColumns()[0]
		]);
		sinon.stub(this.oFilterController, "_prepareP13nData");
		sinon.stub(this.oFilterController, "_updateFilterData");
		this.oFilterController = this.oController._oSettingCurrent.filter.controller;
		assert.ok(this.oFilterController.getPanel());
	});

	QUnit.test("getPanel - without filterable columns", function(assert) {
		this.oFilterController = this.oController._oSettingCurrent.filter.controller;
		assert.ok(!this.oFilterController.getPanel());
	});

	QUnit.test("getPanel - with payload (columnkey)", function(assert) {
		addFilterProperty(this.oTable, [
			this.oTable.getColumns()[0]
		]);
		this.oFilterController.setTransientData2Model({
			filter: {
				filterItems: []
			}
		});
		this.oFilterController = this.oController._oSettingCurrent.filter.controller;
		assert.ok(this.oFilterController.getPanel({
			column: this.oTable.getColumns()[0]
		}));
	});

	QUnit.skip("getPanel - filterItemChange event handler: add a filter", function(assert) {

		addFilterProperty(this.oTable, [
			this.oTable.getColumns()[0]
		]);

		var done = assert.async();


		this.oFilterController.getPanel().then(function(oFilterPanel){
			// prepare the internal structure (mocking empty object data for the internal model)
			this.oFilterController.setControlDataReduce2Model({
				filter: {
					filterItems: []
				}
			});
			oFilterPanel.fireFilterItemChanged({
				reason: "added",
				key: "condition_0",
				index: 0,
				itemData: {
					columnKey: "country",
					exclude: false,
					operation: "Contains",
					value1: "Test",
					value2: ""
				}
			});
			//check for the correct amount of created filterItems
			assert.equal(this.oFilterController.getControlDataReduce().filter.filterItems.length, 1, "A filter has been added");

			done();
		}.bind(this));
	});

	QUnit.skip("getPanel - filterItemChange event handler: remove a filter", function(assert) {

		addFilterProperty(this.oTable, [
			this.oTable.getColumns()[0]
		]);

		var done = assert.async();

		this.oFilterController.getPanel().then(function(oFilterPanel){
			// prepare the internal structure (mocking empty object data for the internal model)
			this.oFilterController.setControlDataReduce2Model({
				filter: {
					filterItems:[
						{columnKey: "country", exclude: false, operation: "Contains", value1: "Test", value2: ""}
					]
				}
			});
			oFilterPanel.fireFilterItemChanged({
				reason: "removed",
				key: "condition_0",
				index: 0
			});
			//check for the correct amount of created filterItems
			assert.equal(this.oFilterController.getControlDataReduce().filter.filterItems.length, 0, "A filter has been removed");

			done();
		}.bind(this));
	});

	QUnit.skip("getPanel - Filter Panel enhanced exclude operations enabled", function(assert) {
		// Arrange
		var oFilterController,
			fnDone = assert.async(),
			oPanelFunctionSpy = sinon.spy(P13nFilterPanel.prototype, "_enableEnhancedExcludeOperations");

		assert.expect(1);

		addFilterProperty(this.oTable, [
			this.oTable.getColumns()[0]
		]);
		oFilterController = this.oController._oSettingCurrent.filter.controller;

		// Act
		oFilterController.getPanel().then(function (/* oPanel */) {
			// Assert
			assert.strictEqual(oPanelFunctionSpy.callCount, 1, "Method called once during panel creation");

			// Cleanup
			oPanelFunctionSpy.restore();

			// Done
			fnDone();
		});
	});

	QUnit.test("getDataSuiteFormat2Json - without filterable columns", function(assert) {
		this.oFilterController = this.oController._oSettingCurrent.filter.controller;
		var oJSON = this.oFilterController.getDataSuiteFormat2Json({
			filter: {
				filterItems:[
					{columnKey: "country", exclude: false, operation: "Contains", value1: "Test", value2: ""}
				]
			}
		});
		assert.ok(oJSON);
	});


	QUnit.test("getDataSuiteFormat2Json - should handle empty string filters", function(assert) {
		// Arrange
		var oTable = this.oFilterController.getTable(),
		fnStub = sinon.stub(oTable, "getParent").returns({
			isA: function() {
				return "sap.ui.comp.smarttable.SmartTable";
			},
			_oTableProvider: {
				getTableViewMetadata: function() {
					return [
						{name: "TestFilter1", type: "Edm.String"},
						{name: "TestFilter2", type: "Edm.String"},
						{name: "TestFilter", type: "Edm.String"},
						{name: "TestFilter3", type: "Edm.String"}
					];
				}
			}
		});

		this.oFilterController = this.oController._oSettingCurrent.filter.controller;
		var oJSON = this.oFilterController.getDataSuiteFormat2Json({
			SelectOptions: [{
				PropertyName: "TestFilter",
				Ranges:[
					{High: null, Low: "", Option: "EQ", Sign: "I"}
				]
			}]
		});
		assert.ok(oJSON);
		assert.equal(oJSON.filter.filterItems[0].columnKey, "TestFilter", "column key is correct" );
		assert.equal(oJSON.filter.filterItems[0].value1, "", "filter item value is correct");

		// Cleanup
		fnStub.restore();
	});

	QUnit.test("getDataSuiteFormat2Json - should handle empty string filters", function(assert) {
		// Arrange
		this.oFilterController.oFilterProvider = sinon.createStubInstance(FilterProvider);
		this.oFilterController.oFilterProvider._getFieldMetadata.returns({name: "TestFilter", type: "Edm.String"});
		this.oFilterController = this.oController._oSettingCurrent.filter.controller;

		// Act
		var oJSON = this.oFilterController.getDataSuiteFormat2Json({
			SelectOptions: [{
				PropertyName: "TestFilter",
				Ranges:[
					{High: null, Low: "", Option: "EQ", Sign: "I"}
				]
			}]
		});

		assert.ok(oJSON);
		assert.equal(oJSON.filter.filterItems[0].columnKey, "TestFilter", "column key is correct" );
		assert.equal(oJSON.filter.filterItems[0].value1, "", "filter item value is correct");
	});

	QUnit.module("API tests for FilterController with mocked data (MTable)", {
		beforeEach: function() {
			//create the test environment: Table + Controller + FilterController
			this.oTable = createTable("MTable");
			this.oController = new Controller({
				table: this.oTable,
				setting: getSettingFor([
					"filter"
				])
			});
			this.oFilterController = this.oController._oSettingCurrent.filter.controller;
		},
		afterEach: function() {
			this.oFilterController.destroy();
			this.oTable.destroy();
			this.oController.destroy();
		}
	});

	QUnit.skip("getPanel - check fnSuggestCallback with necessary data", function(assert) {

		var done = assert.async();

		addFilterProperty(this.oTable, [
			this.oTable.getColumns()[1]
		]);

		this.oFilterController.getPanel().then(function(oFilterPanel){

			var oControl = new Input();
			var oProvider = oFilterPanel._oConditionPanel._fSuggestCallback(oControl,"country");
			assert.ok(oProvider);
			done();
		});
	});

	QUnit.skip("getPanel - check fnSuggestCallback with necessary textArrangement data", function(assert) {

		var done = assert.async();

		addFilterProperty(this.oTable, [
			this.oTable.getColumns()[1]
		]);

		this.oFilterController.getPanel().then(function(oFilterPanel){
			// Arrange
			var oControl = new ComboBox(),
				oSmartFilter = sinon.createStubInstance(SmartFilterBar);
				oSmartFilter._oFilterProvider = new FilterProvider();
				oSmartFilter._oFilterProvider._oMetadataAnalyser._oMetaModel = {};
			sinon.stub(this.oFilterController, "_aDropdownFields").value([
				{
					name: "country",
					"com.sap.vocabularies.UI.v1.TextArrangement": {
						EnumMember: "com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly"
					}
				}
			]);
			sinon.stub(this.oFilterController, "_getSmartFilterBar").returns(oSmartFilter);
			var oProvider = oFilterPanel._oConditionPanel._fSuggestCallback(oControl,"country");
			assert.strictEqual(oProvider.sDisplayBehaviour, "descriptionOnly");

			sinon.stub(this.oFilterController, "_aDropdownFields").value([
				{
					name: "country",
					"com.sap.vocabularies.Common.v1.Text": {
						"com.sap.vocabularies.UI.v1.TextArrangement": {
							EnumMember: "com.sap.vocabularies.UI.v1.TextArrangementType/TextLast"
						}
					}
				}
			]);

			oProvider = oFilterPanel._oConditionPanel._fSuggestCallback(oControl,"country");
			assert.strictEqual(oProvider.sDisplayBehaviour, "idAndDescription");
			done();
		}.bind(this));
	});

	QUnit.skip("getPanel - check if fnSuggestCallback set displayFormat if presented in the metadata", function(assert) {
		var done = assert.async();

		addFilterProperty(this.oTable, [
			this.oTable.getColumns()[1]
		]);

		this.oFilterController.getPanel().then(function(oFilterPanel){
			// Arrange
			var oDisplayFormat = this.spy(oFilterPanel._oConditionPanel, "setDisplayFormat"),
				oControl = new ComboBox(),
				oSmartFilter = sinon.createStubInstance(SmartFilterBar);
				oSmartFilter._oFilterProvider = new FilterProvider();
				oSmartFilter._oFilterProvider._aFilterBarMultiValueFieldMetadata = [{name: "TestField", displayFormat: "UpperCase"}];

			sinon.stub(this.oFilterController, "_getSmartFilterBar").returns(oSmartFilter);
			//Act
			oFilterPanel._oConditionPanel._fSuggestCallback(oControl, "TestField");

			//Assert
			assert.ok(oDisplayFormat.calledOnce, "displayFormat has been invoked.");

			done();
		}.bind(this));
	});

	QUnit.skip("getPanel - check fnSuggestCallback with necessary textArrangement data without SFB", function(assert) {

		var done = assert.async();

		addFilterProperty(this.oTable, [
			this.oTable.getColumns()[1]
		]);

		this.oFilterController.getPanel().then(function(oFilterPanel){
			// Arrange
			var oControl = new ComboBox(),
				oSmartTable = sinon.createStubInstance(SmartTable);
				oSmartTable._oTableProvider = new TableProvider({semanticObjectController: "asd"});
				oSmartTable._oTableProvider._oMetadataAnalyser._oMetaModel = {};
			sinon.stub(this.oFilterController, "_aDropdownFields").value([
				{
					name: "country",
					"com.sap.vocabularies.UI.v1.TextArrangement": {
						EnumMember: "com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly"
					}
				}
			]);
			this.oFilterController._getSmartTable = function() {
				return oSmartTable;
			};
			var oProvider = oFilterPanel._oConditionPanel._fSuggestCallback(oControl,"country");
			assert.strictEqual(oProvider.sDisplayBehaviour, "descriptionOnly");

			sinon.stub(this.oFilterController, "_aDropdownFields").value([
				{
					name: "country",
					"com.sap.vocabularies.Common.v1.Text": {
						"com.sap.vocabularies.UI.v1.TextArrangement": {
							EnumMember: "com.sap.vocabularies.UI.v1.TextArrangementType/TextLast"
						}
					}
				}
			]);

			oProvider = oFilterPanel._oConditionPanel._fSuggestCallback(oControl,"country");
			assert.strictEqual(oProvider.sDisplayBehaviour, "idAndDescription");
			done();
		}.bind(this));
	});

	QUnit.test("getPanel should return mdc FilterPanel", function(assert) {
		// Arrange
		var fnDone = assert.async(),
			 oFC = this.oFilterController,
			 fnGetFilterQueryPanelParameterStub = sinon.stub(this.oFilterController, "_getFilterQueryPanelParameter").returns(true),
			 fnDetachFieldsFromMDCFilterPanelSpy = sinon.stub(this.oFilterController, "_detachFieldsFromMDCFilterPanel");

		sinon.stub(oFC, "_prepareP13nData");
		addFilterProperty(this.oTable, [
			this.oTable.getColumns()[1]
		]);

		// Act
		this.oFilterController.getPanel().then(function() {
			// Assert
			assert.ok(oFC.oFilterPanel);
			assert.equal(oFC.oFilterPanel.isA("sap.m.p13n.FilterPanel"), true, "mdc FilterPanel is created");
			assert.ok(fnDetachFieldsFromMDCFilterPanelSpy.calledOnce, "Fields are detached from the panel");
			fnDone();

			// Cleanup
			fnGetFilterQueryPanelParameterStub.restore();
		});
	});

	QUnit.skip("getPanel - check fnSuggestCallback with displayBehavior from ControlConfiguration", function(assert) {

		var done = assert.async();

		addFilterProperty(this.oTable, [
			this.oTable.getColumns()[1]
		]);

		this.oFilterController.getPanel().then(function(oFilterPanel){
			// Arrange
			var oValueListProvider,
				sDropdownFieldName = "country",
				sDisplayBehaviour = "idOnly",
				oControl = new ComboBox(),
				oSmartFilter = sinon.createStubInstance(SmartFilterBar);
				oSmartFilter._oFilterProvider = new FilterProvider();
				oSmartFilter._oFilterProvider._oMetadataAnalyser._oMetaModel = {};
				oSmartFilter.getControlConfiguration = function() {
					return ([
						{
							getKey: function() {return sDropdownFieldName;},
							getDisplayBehaviour: function() {return sDisplayBehaviour;}
						}
					]);
				};

			sinon.stub(this.oFilterController, "_aDropdownFields").value([
				{
					name: sDropdownFieldName,
					"com.sap.vocabularies.UI.v1.TextArrangement": {
						EnumMember: "com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly"
					}
				}
			]);
			sinon.stub(this.oFilterController, "_getSmartFilterBar").returns(oSmartFilter);

			// Act
			oValueListProvider = oFilterPanel._oConditionPanel._fSuggestCallback(oControl, sDropdownFieldName);

			// Assert
			assert.strictEqual(oValueListProvider.sDisplayBehaviour, sDisplayBehaviour);

			done();
		}.bind(this));
	});

	QUnit.test("_getSmartFilterBar should return the Smart Filter of the table", function(assert) {

		// Arrange
		var oTable = new UiTable();

		sinon.stub(oTable, "oParent").value({
			_oSmartFilter: {
				attachEventOnce: function(){}
			},
			invalidate: function() {}
		});

		sinon.stub(this.oFilterController, "getTable").returns(oTable);
		// Act
		var oSmartFilter = this.oFilterController._getSmartFilterBar();

		// Assert
		assert.ok(oSmartFilter, "SmartFilter is correctly returned");
	});

	QUnit.test("_getSmartTable should return the SmartTable", function(assert) {
		// Arrange
		var oTable = this.oFilterController.getTable(),
			fnStub = sinon.stub(oTable, "getParent").returns({
				isA: function() {
					return "sap.ui.comp.smarttable.SmartTable";
				}
			});

		// Act
		var oSmartTable = this.oFilterController._getSmartTable();

		// Assert
		assert.ok(oSmartTable, "SmartTable is returned");

		// Cleanup
		fnStub.restore();
	});

	QUnit.test("_getFilterPropertyFromColumn shall return correct filterProperty is set as property of the column", function(assert) {
		// Arrange
		var sResult,
			oFC = this.oFilterController,
			sFilterProperty = "filterProperty1",
			sName = "my column",
			oColumn = new UiColumn({
				filterProperty: sFilterProperty,
				name: sName
			}),
			fnStub = sinon.stub(oFC, "_getColumnByKey");

		fnStub.withArgs(sName).returns(oColumn);

		// Act
		sResult = oFC._getFilterPropertyFromColumn(sName);

		// Assert
		assert.equal(sResult, sFilterProperty, "filterProperty is correctly returned");

		// Cleanup
		fnStub.restore();
		oColumn.destroy();

	});

	QUnit.test("_getFilterPropertyFromColumn shall return correct filterProperty from column map", function(assert) {
		// Arrange
		var sResult,
			oFC = this.oFilterController,
			sFilterProperty = "filterProperty1",
			sName = "myColumn",
			oColumn = new UiColumn({
				filterProperty: sFilterProperty,
				name: sName
			}),
			fnStub = sinon.stub(oFC, "getColumnMap").returns({myColumn: oColumn});

		// Act
		sResult = oFC._getFilterPropertyFromColumn(sName);

		// Assert
		assert.equal(sResult, sFilterProperty, "filterProperty is correctly returned");

		// Cleanup
		fnStub.restore();
		oColumn.destroy();

	});

	QUnit.test("_getFilterPropertyFromColumn shall return correct filterProperty is set as p13nData custom data", function(assert) {
		// Arrange
		var sResult,
			oFC = this.oFilterController,
			sFilterProperty = "filterProperty1",
			sName = "my column",
			oColumn = new UiColumn({
				name: sName
			}),
			fnStub = sinon.stub(oFC, "_getColumnByKey").returns(oColumn);

		fnStub.withArgs(sName).returns(oColumn);

		oColumn.data({
			p13nData: {
				filterProperty: sFilterProperty
			}
		});

		// Act
		sResult = oFC._getFilterPropertyFromColumn(sName);

		// Assert
		assert.equal(sResult, sFilterProperty, "filterProperty is correctly returned");

		// Cleanup
		fnStub.restore();
		oColumn.destroy();

	});

	QUnit.test("_createFilterFieldControl shall call the field`s fCreateControl method", function(assert) {
		// Arrange
		var oField = {
			fCreateControl: function() {}
		},
		fnSpy = sinon.spy(oField, "fCreateControl");

		// Act
		this.oFilterController._createFilterFieldControl(oField);

		// Assert
		assert.ok(fnSpy.called, "createControl is called");
		assert.ok(fnSpy.calledWith(oField), "createControl is called with correct argument");

		// Cleanup
		fnSpy.restore();
	});

	QUnit.test("_createFilterFieldControl shall call the initializeFilterItem for conditionType fields", function(assert) {
		// Arrange
		var oField = {
			conditionType: {
				initializeFilterItem: function() {}
			}
		},
		fnSpy = sinon.spy(oField.conditionType, "initializeFilterItem");

		// Act
		this.oFilterController._createFilterFieldControl(oField);

		// Assert
		assert.ok(fnSpy.called, "createControl is called");

		// Cleanup
		fnSpy.restore();
	});

	QUnit.test("_getControlDataReduceFilterItems should return correct filter items", function(assert) {
		// Arrange
		var aResult,
			aFilterItems = ["item1", "item2"],
			oData = {
				filter: {
					filterItems: aFilterItems
				}
			},
			fnStub = sinon.stub(this.oFilterController, "getControlDataReduce").returns(oData);

		// Act
		aResult = this.oFilterController._getControlDataReduceFilterItems();

		// Assert
		assert.equal(aResult, aFilterItems, "filterItems are correctly returned");

		// Cleanuo
		fnStub.restore();
	});

	QUnit.test("_updateControlDataReduce should set data to the DataReduceModel", function(assert) {
		// Arrange
		var oFC = this.oFilterController,
			oFilterItem = {
				columnKey: "country",
				exclude: false,
				operation: "Contains",
				value1: "Test",
				value2: ""
			},
			oNewItem = {
				columnKey: "city",
				exclude: false,
				operation: "EQ",
				value1: "Test2",
				value2: ""
			},
			fnStub = sinon.stub(oFC, "getControlDataReduce").returns({filter:{filterItems: [oFilterItem]}}),
			fnSpySetControlDataReduce2Model = sinon.spy(oFC, "setControlDataReduce2Model"),
			fnSpyFireAfterPotentialModelChange = sinon.spy(oFC, "fireAfterPotentialModelChange");

		// Act
		oFC._updateControlDataReduce([oNewItem]);

		// Assert
		assert.ok(fnSpySetControlDataReduce2Model.called);
		assert.ok(fnSpySetControlDataReduce2Model.calledWith({filter:{filterItems: [oNewItem]}}));
		assert.ok(fnSpyFireAfterPotentialModelChange.called);
		assert.ok(fnSpyFireAfterPotentialModelChange.calledWith({json:{filter:{filterItems: [oNewItem]}}}));

		// Cleanup
		fnStub.restore();
		fnSpySetControlDataReduce2Model.restore();
		fnSpyFireAfterPotentialModelChange.restore();
	});

	QUnit.test("_getColumnByKey should return the correct column", function(assert) {
		// Arrange
		var oResult, sName = "name";

		// Act
		oResult = this.oFilterController._getColumnByKey(sName);

		// Assert
		assert.ok(oResult, "a column is returned");
		assert.equal(oResult.data("p13nData").columnKey, sName, "the correct column is returned");
	});

	QUnit.test("_getIsCustomColumn should return correct result when there is no p13nData", function(assert) {
		var bResult,
			sName = "name",
			oColumn = {
				data: function() {}
			},
			fnStub = sinon.stub(this.oFilterController, "_getColumnByKey").returns(oColumn);

		bResult = this.oFilterController._getIsCustomColumn(sName);

		// Assert
		assert.equal(bResult, false, "the column is not custom because it does not have p13nData");

		// Cleanup
		fnStub.restore();
	});

	QUnit.test("_getIsCustomColumn should return correct result when there is typeInstance in the p13nData", function(assert) {
		var bResult,
			sName = "name",
			oColumn = {
				data: function() {
					return {
						typeInstance: true
					};
				}
			},
			fnStub = sinon.stub(this.oFilterController, "_getColumnByKey").returns(oColumn);

		bResult = this.oFilterController._getIsCustomColumn(sName);

		// Assert
		assert.equal(bResult, false, "the column is not custom because it has typeInstance");

		// Cleanup
		fnStub.restore();
	});



	QUnit.test("_getIsCustomColumn should return correct result when there is no typeInstance in the p13nData", function(assert) {
		var bResult,
			sName = "name",
			oColumn = {
				data: function() {
					return {};
				}
			},
			fnStub = sinon.stub(this.oFilterController, "_getColumnByKey").returns(oColumn);

		bResult = this.oFilterController._getIsCustomColumn(sName);

		// Assert
		assert.equal(bResult, true, "the column is custom because it's p13nData does not have typeInstance");

		// Cleanup
		fnStub.restore();
	});

	QUnit.test("_createConditionForRanges should return correct conditions", function(assert) {
		// Arrange
		var aResult,
			aRanges = [
				{
					exclude: false,
					keyField: "Bukrs",
					operation: "EQ",
					tokenText: "=0001",
					value1: "0001",
					value2: ""
				},
				{
					exclude: false,
					keyField: "Bukrs",
					operation: "EQ",
					tokenText: "=0001",
					value1: "0001",
					value2: ""
				}
			];

		this.oFilterController.oFilterProvider = sinon.createStubInstance(FilterProvider);
		// Act
		aResult = this.oFilterController._createConditionForRanges(aRanges);

		// Assert
		assert.ok(aResult);
		assert.equal(aResult[0].columnKey, aRanges[0].keyField, "columnKey is correctly set on conditions");
		assert.equal(aResult[1].columnKey, aRanges[1].keyField, "columnKey is correctly set on each condition");
	});

	QUnit.test("_createConditionForRanges should return correct conditions for navigation properties", function(assert) {
		// Arrange
		var aResult,
			aRanges = [
				{
					exclude: false,
					keyField: "Navigation.Bukrs",
					operation: "EQ",
					tokenText: "=0001",
					value1: "0001",
					value2: ""
				}
			],
			oFilterProvider = sinon.createStubInstance(FilterProvider);

		oFilterProvider._getFieldMetadata.returns({fieldNameOData: "Navigation/Bukrs"});
		this.oFilterController.oFilterProvider = oFilterProvider;

		// Act
		aResult = this.oFilterController._createConditionForRanges(aRanges);

		// Assert
		assert.equal(aResult[0].columnKey, "Navigation/Bukrs", "columnKey is correctly set on conditions");
	});

	QUnit.test("_createConditionForItems should return correct conditions", function(assert) {
		// Arrange
		var aResult, oResult,
			aItems = [
				{
					key: "0001",
					text: "SAP A.G.test (0001)"
				}
			],
			oCondition = {
				exclude: false,
				columnKey: "Bukrs",
				operation: "EQ",
				value1: null,
				value2: null
			};

		// Act
		aResult = this.oFilterController._createConditionForItems(aItems, oCondition);

		// Assert
		assert.ok(aResult);

		oResult = aResult[0];
		assert.equal(oResult.value1, "0001", "value1 is set in condition");
		assert.equal(oResult.token, "SAP A.G.test (0001)", "description is set in condition");
		assert.equal(oResult.operation, "EQ", "operation is correctly set in condition");
	});

	QUnit.test("_createConditionForIntervals should create condition for regular interval", function(assert) {
		// Arrange
		var oResult,
			oCondition = {},
			oValue = {
				low: "low",
				high: "high"
			};

		// Act
		oResult = this.oFilterController._createConditionForIntervals(oValue, "key", oCondition);

		// Assert
		assert.ok(oResult);
		assert.equal(oResult.value1, "low", "value1 of condition is correctly set");
		assert.equal(oResult.value2, "high", "value2 of condition is correctly set");
		assert.equal(oResult.operation, "BT",  "operation of condition is correctly set");
	});

	QUnit.test("_createConditionForIntervals should create condition with operation 'EQ' interval with only low value", function(assert) {
		// Arrange
		var oFC = this.oFilterController,
			oResult,
			oCondition = {},
			oDateTimeOffset = new DateTimeOffset(),
			oValue = {
				low: "9/21/21, 3:59 PM",
				high: null
			},
			oFilterProvider = sinon.createStubInstance(FilterProvider);

		oFilterProvider._getFieldMetadata.returns({ui5Type: oDateTimeOffset});
		oFilterProvider._aFilterBarDateTimeFieldNames = ["key"];
		oFC.oFilterProvider = oFilterProvider;

		// Act
		oResult = this.oFilterController._createConditionForIntervals(oValue, "key", oCondition);

		// Assert
		assert.equal(oResult.operation, "EQ", "The EQ operation is correctly set");
	});

	QUnit.test("_createConditionForIntervals should not throw exception when low value is date object", function(assert) {
		// Arrange
		var oFC = this.oFilterController,
			oCondition = {},
			oDateTimeOffset = new DateTimeOffset(),
			oValue = {
				low: new Date(2021, 8, 21, 15, 59),
				high: null
			},
			oFilterProvider = sinon.createStubInstance(FilterProvider);

		oFilterProvider._getFieldMetadata.returns({ui5Type: oDateTimeOffset});
		oFilterProvider._aFilterBarDateTimeFieldNames = ["key"];
		oFC.oFilterProvider = oFilterProvider;

		// Act
		this.oFilterController._createConditionForIntervals(oValue, "key", oCondition);

		// Assert
		assert.ok(true, "No exception thrown");
	});

	QUnit.test("_createConditionForIntervals should create condition for DateTimeOffset interval", function(assert) {
		// Arrange
		var oFC = this.oFilterController,
			sKey = "CreationDate",
			oResult,
			oCondition = {},
			oDateTimeOffset = new DateTimeOffset(),
			oValue = {
				low: "9/21/21, 3:59 PM-9/21/22, 3:59 PM",
				high: null
			},
			oExpectedValue1 = oDateTimeOffset.parseValue("9/21/21, 3:59 PM", "string"),
			oExpectedValue2 = oDateTimeOffset.parseValue("9/21/22, 3:59 PM", "string"),
			oFilterProvider = sinon.createStubInstance(FilterProvider);

		oFilterProvider._getFieldMetadata.returns({ui5Type: oDateTimeOffset});
		oFilterProvider._aFilterBarDateTimeFieldNames = [sKey];

		oFC.oFilterProvider = oFilterProvider;

		// Act
		oResult = this.oFilterController._createConditionForIntervals(oValue, sKey, oCondition);

		// Assert
		assert.ok(oResult);
		assert.equal(oResult.value1.getTime(), oExpectedValue1.getTime(), "value1 of condition is correctly set");
		assert.equal(oResult.value2.getTime(), oExpectedValue2.getTime(), "value2 of condition is correctly set");

		// Cleanup
		oDateTimeOffset.destroy();
	});

	QUnit.test("_createConditionForIntervals should create condition for numeric interval", function(assert) {
		// Arrange
		var oFC = this.oFilterController,
			sKey = "Count",
			oResult,
			oCondition = {},
			oValue = {
				low: "1-3",
				high: null
			},
			oFilterProvider = {
				_aFilterBarDateTimeFieldNames: ["CreatedOn"]
			};

		oFC.oFilterProvider = oFilterProvider;

		// Act
		oResult = this.oFilterController._createConditionForIntervals(oValue, sKey, oCondition);

		// Assert
		assert.ok(oResult);
		assert.equal(oResult.value1, 1, "value1 of condition is correctly set");
		assert.equal(oResult.value2, 3, "value2 of condition is correctly set");
	});

	QUnit.test("_getControlByName should return correct control", function(assert) {
		// ArrangeBunovo, 2074буново
		var oResult,
			sName = "name",
			oField = {
				_sControlName: sName
			},
			fnStub = sinon.stub(this.oFilterController, "_aFilterPanelFields").value([oField]);

		// Act
		oResult = this.oFilterController._getControlByName(sName);

		// Assert
		assert.ok(oResult, "a control is returned");
		assert.equal(oResult["_sControlName"], sName, "the correct control is returned");

		// Cleanup
		fnStub.restore();
	});

	QUnit.test("_updateFilterData should correctly update filterProvider model with controlDataReduce", function(assert) {
		// Arrange
		var oFC = this.oFilterController,
			aFilterItems = [
				{
					columnKey: "Bukrs",
					value1: "value1",
					token: "value1 description"
				}
			],
			oFilterData = {
				Bukrs: {
					items: [],
					ranges: [],
					value: null
				}
			},
			oExpectedFilterData = {
				Bukrs: {
					items: [{
						key: "value1",
						text: "value1 description"
					}],
					ranges: [],
					value: null
				}
			},
			oFilterProvider = sinon.createStubInstance(FilterProvider),
			fnGetControlDataReduceFilterItemsStub = sinon.stub(oFC, "_getControlDataReduceFilterItems").returns(aFilterItems);

		oFilterProvider.getFilterData = function() {
			return oFilterData;
		};
		oFC.oFilterProvider = oFilterProvider;

		// Act
		oFC._updateFilterData();

		// Assert
		assert.ok(oFilterProvider.clear.called, "old filter data is cleared");
		assert.ok(oFilterProvider.setFilterData.called, "setFilterData is called");
		assert.ok(oFilterProvider.setFilterData.calledWith(oExpectedFilterData), "setFilterData is called");

		// Clean up
		fnGetControlDataReduceFilterItemsStub.restore();
	});

	QUnit.test("_updateFilterData should correctly set items when control is MultiComboBox", function(assert) {
		// Arrange
		var oMultiComboBox = new MultiComboBox(),
			oFC = this.oFilterController,
			aFilterItems = [
				{
					columnKey: "Bukrs",
					value1: "value1"
				}
			],
			oFilterData = {
				Bukrs: {
					items: [],
					value: null
				}
			},
			oExpectedFilterData = {
				Bukrs: {
					items: [{
						key: "value1"
					}],
					value: null
				}
			},
			oFilterProvider = sinon.createStubInstance(FilterProvider),
			fnGetControlDataReduceFilterItemsStub = sinon.stub(oFC, "_getControlDataReduceFilterItems").returns(aFilterItems),
			fnGetControlByNameStub = sinon.stub(oFC, "_getControlByName").returns(oMultiComboBox);

		oFilterProvider.getFilterData = function() {
			return oFilterData;
		};
		oFC.oFilterProvider = oFilterProvider;

		// Act
		oFC._updateFilterData();

		// Assert
		assert.ok(oFilterProvider.setFilterData.calledWith(oExpectedFilterData), "setFilterData is called with correct data for MultiComboBox");

		// Clean up
		fnGetControlDataReduceFilterItemsStub.restore();
		fnGetControlByNameStub.restore();
		oMultiComboBox.destroy();
	});

	QUnit.test("test _updateFilterData for intervals with high and low values", function(assert) {
		// Arrange
		var oFC = this.oFilterController,
			aFilterItems = [
				{
					columnKey: "Bukrs",
					value1: 1,
					value2: 3
				}
			],
			oFilterData = {
				Bukrs: {
					high: null,
					low: null
				}
			},
			oExpectedFilterData = {
				Bukrs: {
					low: 1,
					high: 3
				}
			},
			oFilterProvider = sinon.createStubInstance(FilterProvider),
			fnGetControlDataReduceFilterItemsStub = sinon.stub(oFC, "_getControlDataReduceFilterItems").returns(aFilterItems);

		oFilterProvider.getFilterData = function() {
			return oFilterData;
		};
		oFC.oFilterProvider = oFilterProvider;

		// Act
		oFC._updateFilterData();

		// Assert
		assert.ok(oFilterProvider.setFilterData.calledWith(oExpectedFilterData), "setFilterData is called with correct data");

		// Clean up
		fnGetControlDataReduceFilterItemsStub.restore();
	});

	QUnit.test("test _updateFilterData for numeric intervals with only low value", function(assert) {
		// Arrange
		var oFC = this.oFilterController,
			aFilterItems = [
				{
					columnKey: "Bukrs",
					value1: 1,
					value2: 3
				}
			],
			oFilterData = {
				Bukrs: {
					high: null,
					low: null
				}
			},
			oExpectedFilterData = {
				Bukrs: {
					low: '1-3',
					high: null
				}
			},
			oFilterProvider = sinon.createStubInstance(FilterProvider),
			fnGetControlDataReduceFilterItemsStub = sinon.stub(oFC, "_getControlDataReduceFilterItems").returns(aFilterItems);

		oFilterProvider.getFilterData = function() {
			return oFilterData;
		};
		oFC.oFilterProvider = oFilterProvider;
		oFC._aSplitIntervalFields = ["Bukrs"];

		// Act
		oFC._updateFilterData();

		// Assert
		assert.ok(oFilterProvider.setFilterData.calledWith(oExpectedFilterData), "setFilterData is called with correct data");

		// Clean up
		fnGetControlDataReduceFilterItemsStub.restore();
	});

	QUnit.test("test _updateFilterData for dateTimeOffset intervals", function(assert) {
		// Arrange
		var oFC = this.oFilterController,
			oDateTimeOffset = new DateTimeOffset(),
			oDate1 = oDateTimeOffset.parseValue("9/21/21, 3:59 PM", "string"),
			oDate2 = oDateTimeOffset.parseValue("9/21/22, 3:59 PM", "string"),
			aFilterItems = [
				{
					columnKey: "CreatedOn",
					value1: oDate1,
					value2: oDate2
				}
			],
			oFilterData = {
				CreatedOn: {
					high: null,
					low: null
				}
			},
			oExpectedFilterData = {
				CreatedOn: {
					low: oDate1.toISOString() + "-" + oDate2.toISOString(),
					high: null
				}
			},
			oFilterProvider = sinon.createStubInstance(FilterProvider),
			fnGetControlDataReduceFilterItemsStub = sinon.stub(oFC, "_getControlDataReduceFilterItems").returns(aFilterItems);

		oFilterProvider.getFilterData = function() {
			return oFilterData;
		};
		oFilterProvider._aFilterBarDateTimeFieldNames = ["CreatedOn"];
		oFilterProvider._getFieldMetadata = function() {
			return {
				ui5Type: oDateTimeOffset
			};
		};
		oFC.oFilterProvider = oFilterProvider;
		oFC._aSplitIntervalFields = ["CreatedOn"];

		// Act
		oFC._updateFilterData();

		// Assert
		assert.ok(oFilterProvider.setFilterData.calledWith(oExpectedFilterData), "setFilterData is called with correct data");

		// Clean up
		fnGetControlDataReduceFilterItemsStub.restore();
	});

	QUnit.test("test _detachFieldsFromMDCFilterPanel", function(assert) {
		// Arrange
		var oInput = new Input(),
			oFC = this.oFilterController,
			oFilterPanel = sinon.createStubInstance(MDCFilterPanel),
			oGridLayout = new GridLayout({
				content: [oInput]
			}),
			fnMDCFilterPanelExit = oFilterPanel.exit;
		oFC._aFilterPanelFields = [oInput];
		oFC.oFilterPanel = oFilterPanel;
		oFC._aActiveFilterPanelFieldNames = ["name"];

		// Act
		oFC._detachFieldsFromMDCFilterPanel();

		// Assert
		assert.notEqual(fnMDCFilterPanelExit, oFilterPanel.exit, "exit method of the mdc Filter Panel is overwritten");

		// Act
		oFilterPanel.exit();

		// Assert
		assert.ok(fnMDCFilterPanelExit.calledOnce, "Original exit method was called");
		assert.notOk(oInput.getParent(), "Input has no parent");
		assert.equal(oFC._aActiveFilterPanelFieldNames, null, "Active filter panel field names are reset");

		// Cleanup
		oInput.destroy();
		oGridLayout.destroy();
	});

	QUnit.test("_prepareP13nData ", function(assert) {
		// Arrange
		var aResult,
			oFC = this.oFilterController,
			oTransientData = {
				filter: {
					filterItems: [
						{
							columnKey: "Bukrs"
						}, {
							columnKey: "CreatedOn",
							isDefault: true
						}, {
							columnKey: "Budat"
						}
					]
				}
			},
			fnGetTransientDataStub = sinon.stub(oFC, "getTransientData").returns(oTransientData),
			fnGetControlDataReduceFilterItemsStub = sinon.stub(oFC, "_getControlDataReduceFilterItems").returns([{columnKey: "Bukrs"}]);

		// Act
		aResult = oFC._prepareP13nData();

		// Assert
		assert.ok(aResult);
		assert.equal(aResult.length, 3, "P13nData has 3 results");

		assert.equal(aResult[0].name, "Bukrs", "First element of p13nData has correct name");
		assert.equal(aResult[0].active, true, "First element of p13nData is active because it is set in the controlDataReduce model");

		assert.equal(aResult[1].name, "CreatedOn", "Second element of p13nData has correct name");
		assert.equal(aResult[1].active, true, "Second element of p13nData is active because it is marked as default");

		assert.equal(aResult[2].name, "Budat", "Third element of p13nData has correct name");
		assert.equal(aResult[2].active, false, "Second element of p13nData is not active because it is not marked as default or set in the controlDataReduce model");

		// Cleanup
		fnGetControlDataReduceFilterItemsStub.restore();
		fnGetTransientDataStub.restore();
	});
	QUnit.test("_prepareP13nData for field with TextArrangement annotation", function(assert) {
		// Arrange
		var aResult,
			oFC = this.oFilterController,
			oTransientData = {
				filter: {
					filterItems: [
						{
							columnKey: "Bukrs"
						}, {
							columnKey: "CreatedOn",
							isDefault: true
						}, {
							columnKey: "Budat"
						}
					]
				}
			},
			fnGetTransientDataStub = sinon.stub(oFC, "getTransientData").returns(oTransientData),
			fnGetControlDataReduceFilterItemsStub = sinon.stub(oFC, "_getControlDataReduceFilterItems").returns([{columnKey: "Bukrs"}]);


			oFC.oFilterProvider = sinon.createStubInstance(FilterProvider);
			oFC.oFilterProvider._oMetadataAnalyser = {
				getDescriptionFieldName: function() {
					return "Budat";
				}
			};

		// Act
		aResult = oFC._prepareP13nData();

		// Assert
		assert.equal(aResult[2].active, true, "Description Field is active.");

		// Cleanup
		fnGetControlDataReduceFilterItemsStub.restore();
		fnGetTransientDataStub.restore();
	});

	QUnit.test("_mdcFilterPanelChangeHandler should call _handleFieldRemove for remove scenario", function(assert) {
		// Arrange
		var oFC = this.oFilterController,
			oEvent = {
				getParameter: function() {
					return "Remove";
				}
			},
			fnHandleFieldRemoveStub = sinon.stub(oFC, "_handleFieldRemove");

		oFC.oFilterPanel = sinon.createStubInstance(MDCFilterPanel);

		// Act
		oFC._mdcFilterPanelChangeHandler(oEvent);

		// Assert
		assert.ok(fnHandleFieldRemoveStub.calledWith(oEvent), "_handleFieldRemove is called when a field is removed from panel");
	});

	QUnit.test("_handleFieldRemove should update controlDataReduce and the FilterProvider's model", function(assert) {
		// Arrange
		var oFC = this.oFilterController,
			oFilterData = {Bukrs: 1},
			oEvent = {
				getParameter: function(param) {
					return param === "item" ? {name: "Bukrs"} : null;
				}
			},
			oFilterProvider = sinon.createStubInstance(FilterProvider),
			aFilterItems = [
				{
					columnKey: "Bukrs"
				}, {
					columnKey: "Budat"
				}
			],
			oData = {
				filter: {
					filterItems: aFilterItems
				}
			},
			fnGetControlDataReduceStub = sinon.stub(oFC, "getControlDataReduce").returns(oData),
			fnUpdateControlDataReduceStub = sinon.stub(oFC, "_updateControlDataReduce");

		oFilterProvider._getFieldMetadata = function() { return {};};
		oFilterProvider.getFilterData = function() { return oFilterData;};
		oFC.oFilterProvider = oFilterProvider;

		// Act
		oFC._handleFieldRemove(oEvent);

		// Assert
		assert.ok(fnUpdateControlDataReduceStub.calledWith([{columnKey: "Budat"}]), "The removed field is no longer in controlDataReduce model");
		assert.ok(oFilterProvider._createInitialModelForField.calledWith(oFilterData, {}), "FilterProvider's model is cleared");

		// Cleanup
		fnGetControlDataReduceStub.restore();
		fnUpdateControlDataReduceStub.restore();

	});

	QUnit.test("_handleFieldRemove for custom column", function(assert) {
		// Arrange
		var oFC = this.oFilterController,
			oEvent = {
				getParameter: function(param) {
					return param === "item" ? {name: "My Custom Bukrs"} : null;
				}
			},
			oInput = new Input({
				value: "value1"
			}),
			oFilterData = {Bukrs: 1},
			oFieldMetadata = {
				name: "Bukrs",
				fieldName: "Bukrs"
			},
			oExpectedFieldMetadata = {
				name: "My Custom Bukrs",
				fieldName: "My Custom Bukrs",
				control: oInput
			},
			oFilterProvider = sinon.createStubInstance(FilterProvider),
			aFilterItems = [
				{
					columnKey: "Bukrs"
				}, {
					columnKey: "Budat"
				}
			],
			oData = {
				filter: {
					filterItems: aFilterItems
				}
			},
			fnGetControlDataReduceStub = sinon.stub(oFC, "getControlDataReduce").returns(oData),
			fnGetControlByNameStub = sinon.stub(oFC, "_getControlByName").returns(oInput),
			fnGetFilterPropertyFromColumn = sinon.stub(oFC, "_getFilterPropertyFromColumn").returns("Bukrs");

		oFilterProvider.aAllFields = [oFieldMetadata];
		oFilterProvider._createFieldMetadata = function(oFieldMetadata) {
			return oFieldMetadata;
		};
		oFilterProvider.getFilterData = function() { return oFilterData;};
		oFC.oFilterProvider = oFilterProvider;

		// Act
		oFC._handleFieldRemove(oEvent);

		// Assert
		assert.ok(oFilterProvider._createInitialModelForField.calledWith(oFilterData, oExpectedFieldMetadata), "FilterProvider's model is cleared");
		assert.equal(oInput.getValue(), '', "Input's value is cleared");

		 // Cleanup
		 oInput.destroy();
		 fnGetControlDataReduceStub.restore();
		 fnGetControlByNameStub.restore();
		 fnGetFilterPropertyFromColumn.restore();

	});

	QUnit.test("_updateFieldMetadata when there is no metadata (field is not filterable in service metadata, but filterable in xml view)", function(assert) {
		// Arrange
		var oFC = this.oFilterController, oMetadata,
			oItem = {name: "Bukrs"},
			fnGetFilterPropertyFromColumnStub = sinon.stub(oFC, "_getFilterPropertyFromColumn").returns("Bukrs"),

			oFilterProvider = sinon.createStubInstance(FilterProvider);

		oFilterProvider.aAllFields = [{name: "Bukrs"}];
		oFilterProvider._createFieldMetadata.returns(oItem);
		oFC.oFilterProvider = oFilterProvider;
		// Act
		oMetadata = oFC._updateFieldMetadata(oMetadata, oItem);

		// Assert
		assert.ok(oMetadata);
		assert.equal(oMetadata.name, "Bukrs", "Correct metadata is returned");
		assert.ok(fnGetFilterPropertyFromColumnStub.calledWith("Bukrs"), "_getFilterPropertyFromColumn is called");
		assert.ok(oFilterProvider._createFieldMetadata.calledWith(oItem), "FilterProvider's _createFieldMetadata is called");

		// Cleanup
		fnGetFilterPropertyFromColumnStub.restore();
	});

	QUnit.test("_updateFieldMetadata should correctly get the fieldMetadata for navigation properties", function(assert) {
		// Arrange
		var oFC = this.oFilterController,
			oFieldMetadata = {name: "Bukrs"},
			oItem = {name: "to_Products/Bukrs"},
			fnExtractNavigationPropertyStub,
			oFilterProvider = sinon.createStubInstance(FilterProvider);

		oFilterProvider._oMetadataAnalyser = {
			extractNavigationPropertyField: function() {
				return {};
			}
		};
		oFilterProvider.sEntitySet = "LineItems";
		fnExtractNavigationPropertyStub = sinon.stub(oFilterProvider._oMetadataAnalyser, "extractNavigationPropertyField");
		oFilterProvider._createFieldMetadata.returns(oItem);
		oFC.oFilterProvider = oFilterProvider;

		// Act
		oFC._updateFieldMetadata(oFieldMetadata, oItem, oItem.name);

		// Assert
		assert.ok(fnExtractNavigationPropertyStub.calledWith("to_Products/Bukrs", "LineItems"), "MetadataAnalyser's extractNavigationPropertyField is called");

		// Cleanup
		fnExtractNavigationPropertyStub.restore();
	});

	QUnit.test("_handleFieldRemove should correctly get the fieldMetadata for navigation properties", function(assert) {
		// Arrange
		var oFC = this.oFilterController,
			oEvent = {
				getParameter: function() {
					return {name: "to_Products/Bukrs"};
				}
			},

			oFilterProvider = sinon.createStubInstance(FilterProvider),
			fnExtractNavigationPropertyStub;

		oFilterProvider._oMetadataAnalyser = {
			extractNavigationPropertyField: function() {
				return {};
			}
		};
		oFilterProvider._createFieldMetadata = function() { return {};};
		oFilterProvider.sEntitySet = "LineItems";
		oFC.oFilterProvider = oFilterProvider;
		fnExtractNavigationPropertyStub = sinon.stub(oFilterProvider._oMetadataAnalyser, "extractNavigationPropertyField");
		// Act
		oFC._handleFieldRemove(oEvent);

		// Assert
		assert.ok(fnExtractNavigationPropertyStub.calledWith("to_Products/Bukrs", "LineItems"), "MetadataAnalyser's extractNavigationPropertyField is called");


	});

	QUnit.test("_handleFieldRemove should correctly add the control for navigation properties", function(assert) {
		// Arrange
		var oFC = this.oFilterController,
			oEvent = {
				getParameter: function() {
					return {name: "to_Products/Bukrs"};
				}
			},
			fnExtractNavigationPropertyStub,
			oFilterProvider = sinon.createStubInstance(FilterProvider),
			fnUpdateControlDataReduceStub = sinon.stub(oFC, "_updateControlDataReduce"),
			oControl = new Input();
		oFilterProvider._createFieldMetadata = function() { return {};};
		oFilterProvider._oMetadataAnalyser = {
			extractNavigationPropertyField: function() {
				return {};
			}
		};
		oFilterProvider.sEntitySet = "LineItems";
		fnExtractNavigationPropertyStub = sinon.stub(oFilterProvider._oMetadataAnalyser, "extractNavigationPropertyField");
		oFC._getControlByName = function() {
			return oControl;
		};
		oFC.oFilterProvider = oFilterProvider;

		// Act
		oFC._handleFieldRemove(oEvent);

		// Assert
		assert.ok(oFilterProvider._createInitialModelForField.calledWith(oFilterProvider.getFilterData(), {control: oControl}), "the control is correctly added");

		// Cleanup
		fnExtractNavigationPropertyStub.restore();
		fnUpdateControlDataReduceStub.restore();
		oControl.destroy();
	});

	QUnit.test("_updateFieldMetadata should call _prepareFieldMetadataForCustomColumn for fields with '/' in their fieldName", function(assert) {
		// Arrange
		var oFC = this.oFilterController,
			oFieldMetadata = {name: "to_Product/Bukrs", fieldName: "to_Product/items/Bukrs"},
			oItem = {name: "to_Products/Bukrs"},
			fnExtractNavigationPropertyStub,
			oFilterProvider = sinon.createStubInstance(FilterProvider),
			fnSpy = sinon.stub(oFC, "_prepareFieldMetadataForCustomColumn");

		oFilterProvider._oMetadataAnalyser = {
			extractNavigationPropertyField: function() {
				return {};
			}
		};
		oFilterProvider.sEntitySet = "LineItems";
		fnExtractNavigationPropertyStub = sinon.stub(oFilterProvider._oMetadataAnalyser, "extractNavigationPropertyField");
		oFilterProvider._createFieldMetadata.returns(oFieldMetadata);
		oFC.oFilterProvider = oFilterProvider;

		// Act
		oFC._updateFieldMetadata(oFieldMetadata, oItem, oItem.name);

		// Assert
		assert.ok(fnSpy.calledWith(oFieldMetadata, oItem), "_prepareFieldMetadataForCustomColumn is called with correct parameter");

		// Cleanup
		fnExtractNavigationPropertyStub.restore();
	});



	QUnit.test("_prepareFieldMetadataForCustomColumn should be called for custom columns", function(assert) {
		// Arrange
		var oFC = this.oFilterController,
			oFieldMetadata = {name: "Bukrs"},
			oItem = {name: "Bukrs"},
			fnIsCustomColumnStub = sinon.stub(oFC, "_getIsCustomColumn").returns(true),
			fnPrepareFieldMetadataForCustomColumnSpy = sinon.stub(oFC, "_prepareFieldMetadataForCustomColumn"),
			oFilterProvider = sinon.createStubInstance(FilterProvider);

		oFilterProvider._createFieldMetadata.returns(oItem);
		oFC.oFilterProvider = oFilterProvider;

		// Act
		oFC._updateFieldMetadata(oFieldMetadata, oItem);

		// Assert
		assert.ok(fnPrepareFieldMetadataForCustomColumnSpy.calledWith(oFieldMetadata, oItem), "FilterProvider's _createFieldMetadata is called");

		// Cleanup
		fnIsCustomColumnStub.restore();
	});

	QUnit.test("_prepareFieldMetadataForCustomColumn should copy and update the constraints", function(assert) {
		// Arrange
		var oResult,
			oFC = this.oFilterController,
			oItem = {name: "Bukrs"},
			oDataTypeConstructor = {
				formatValue: function(){},
				isA: function(){},
				parseValue: function(){}
			},
			oUI5Type = Object.create(oDataTypeConstructor),
			oMetadata = {
				name: "Bukrs",
				ui5Type: oUI5Type
			},
			oColumn = new UiColumn({
				label: new Label({text: "Bukrs"})
			}),
			fnGetColumnByKeyStub = sinon.stub(oFC, "_getColumnByKey").returns(oColumn),
			fnUpdateFilterData = sinon.stub(oFC, "_updateFilterData");

			oColumn.data("p13nData", {
				maxLength: 4,
				scale: 5,
				precision: 6
			});
		oUI5Type.oConstraints = {
			maxLength: 1,
			scale: 2,
			precision: 3
		};
		oFC.oFilterProvider = {
			_aCustomFieldMetadata: []
		};

		// Act
		oResult = oFC._prepareFieldMetadataForCustomColumn(oMetadata, oItem);

		// Assert
		// maxLength
		assert.ok(oResult, "Metadata is returned");
		assert.equal(oResult.maxLength, 4, "maxLength is correctly taken from custom data");
		assert.equal(oResult.ui5Type.oConstraints.maxLength, 4, "maxLength is correctly taken from custom data to the ui5Type");
		assert.equal(oMetadata.ui5Type.oConstraints.maxLength, 1, "maxLength of the original metadata is not changed");

		// scale
		assert.equal(oResult.scale, 5, "scale is correctly taken from custom data");
		assert.equal(oResult.ui5Type.oConstraints.scale, 5, "scale is correctly taken from the custom data to the ui5Type");
		assert.equal(oMetadata.ui5Type.oConstraints.scale, 2, "scale of the original metadata is not changed");

		// precision
		assert.equal(oResult.precision, 6, "precision is correctly taken from custom data");
		assert.equal(oResult.ui5Type.oConstraints.precision, 6, "precision is correctly taken from the custom data to the ui5Type");
		assert.equal(oMetadata.ui5Type.oConstraints.precision, 3, "precision of the original metadata is not changed");

		// inherited props
		assert.ok(oResult.ui5Type.formatValue, "method formatValue is successfully passed after copy");
		assert.ok(oResult.ui5Type.parseValue, "method parseValue is successfully passed after copy");
		assert.ok(oResult.ui5Type.isA, "method isA is successfully passed after copy");

		assert.equal(fnUpdateFilterData.calledOnce, true, "FilterData is update");
		assert.ok(oFC.oFilterProvider._aCustomFieldMetadata.length, 1, "custom field metadata is pushed into array ");

		// Cleanup
		oColumn.destroy();
		fnGetColumnByKeyStub.restore();
	});

	// QUnit.test("test _fieldChangeHandler for multiinputs", function(assert) {
	// 	// Arrange
	// 	var oFC = this.oFilterController,
	// 		oControl = new Input(),
	// 		oFilterProvider = sinon.createStubInstance(FilterProvider),
	// 		fnUpdateControlDataReduceStub = sinon.stub(oFC, "_updateControlDataReduce"),
	// 		fnCreateConditionForRangesStub = sinon.stub(oFC, "_createConditionForRanges"),
	// 		fnCreateConditionForItemsStub = sinon.stub(oFC, "_createConditionForItems"),
	// 		// fnUpdateControlDataReduceStub = sinon.stub(oFC, "_updateControlDataReduce"),
	// 		oValidationPromise = new Promise(function (fnResolve) {
	// 			setTimeout(function (){
	// 				fnResolve();
	// 			}, 1);
	// 		}),
	// 		oFilterData = {
	// 			Bukrs: {
	// 				ranges: [1],
	// 				items: [2],
	// 				value: 3
	// 			}
	// 		},
	// 		oExpectedFilterData = {

	// 		}

	// 	oFC.oFilterProvider = oFilterProvider;
	// 	oControl._sControlName = "Bukrs";
	// 	oFilterProvider._getCurrentValidationPromises.returns([oValidationPromise]);
	// 	oFilterProvider.getFilledFilterData.returns(oFilterData);

	// 	// Act
	// 	oFC._fieldChangeHandler({getSource: function() {return oControl}});

	// 	// Assert

	// 	assert.ok(true);
	// 	assert.ok(fnUpdateControlDataReduceStub.calledWith(oExpectedFilterData));
	// });

	QUnit.test("test _itemFactoryHandler", function(assert) {
		// Arrange
		var oFC = this.oFilterController,
			oResult,
			oControl = new Input(),
			oItem = {name: "Bukrs"},
			oFilterProvider = sinon.createStubInstance(FilterProvider),
			oFieldMetadata = {
				fCreateControl: function(oFieldMetadata) {
					oFieldMetadata.control = oControl;
				}
			},
			fnFieldChangeHandler = sinon.stub(oFC, "_fieldChangeHandler"),
			fnUpdateFieldData = sinon.stub(oFC, "_updateFieldMetadata").returns(oFieldMetadata),
			fnInputAttachChangeStub = sinon.stub(oControl, "attachChange");

		oFilterProvider._getFieldMetadata.returns(oFieldMetadata);
		oFC._aFilterPanelFields = [];
		oFC._aActiveFilterPanelFieldNames = [];
		oFC.oFilterProvider = oFilterProvider;

		// Act
		oResult = oFC._itemFactoryHandler(oItem);

		// Assert
		assert.ok(oResult, "A control is returned");
		assert.equal(oResult._sControlName, "Bukrs", "Control name is correctly attached");
		assert.ok(fnInputAttachChangeStub.calledOnce, "change is correctly attached");
		assert.ok(fnUpdateFieldData.called, "update is correctly called");
		assert.equal(oFC._aFilterPanelFields.length, 1, "The array with filter panel fields has one field");
		assert.equal(oFC._aFilterPanelFields[0], oControl, "The control is correctly pushed into array");
		assert.equal(oFC._aActiveFilterPanelFieldNames.length, 1, "The array with filter panel field names has one name");
		assert.equal(oFC._aActiveFilterPanelFieldNames[0], "Bukrs", "The control's name is correctly pushed into array");

		// Act
		oFC._itemFactoryHandler(oItem);

		// Assert
		assert.ok(fnInputAttachChangeStub.calledOnce, "change is not attached second time");

		// Clean up
		oControl.destroy();
		fnFieldChangeHandler.restore();
		fnUpdateFieldData.restore();
		fnInputAttachChangeStub.restore();
	});

	QUnit.test("_itemFactoryHandler should attach multi inputs to tokenUpdate event instead of change", function(assert) {
		// Arrange
		var oFC = this.oFilterController,
			oControl = new MultiInput(),
			oItem = {name: "Bukrs"},
			oFilterProvider = sinon.createStubInstance(FilterProvider),
			oFieldMetadata = {
				fCreateControl: function(oFieldMetadata) {
					oFieldMetadata.control = oControl;
				}
			},
			fnUpdateFieldData = sinon.stub(oFC, "_updateFieldMetadata").returns(oFieldMetadata),
			fnInputAttachTokenUpdateStub = sinon.stub(oControl, "attachTokenUpdate");

		oFilterProvider._getFieldMetadata.returns(oFieldMetadata);
		oFC._aFilterPanelFields = [];
		oFC._aActiveFilterPanelFieldNames = [];
		oFC.oFilterProvider = oFilterProvider;

		// Act
		oFC._itemFactoryHandler(oItem);

		// Assert
		assert.ok(fnInputAttachTokenUpdateStub.calledOnce, "tokenUpdate is correctly attached");

		// Act
		oFC._itemFactoryHandler(oItem);

		// Assert
		assert.ok(fnInputAttachTokenUpdateStub.calledOnce, "tokenUpdate is not attached second time");

		// Clean up
		oControl.destroy();
		fnUpdateFieldData.restore();
		fnInputAttachTokenUpdateStub.restore();
	});

	QUnit.skip("",function(assert){

		var done = assert.async();

		var oMS = new MessageStrip({
			text:"Some Text"
		});

		this.oFilterController.setMessageStrip(oMS);

		addFilterProperty(this.oTable, [
			this.oTable.getColumns()[1]
		]);

		this.oFilterController.getPanel().then(function(oFilterPanel){
			oFilterPanel.onBeforeRendering();
			assert.equal(oFilterPanel.getAggregation("content")[0].getText(), oMS.getText(), "Correct MessageStrip has been set on FilterPanel");
			done();
		});

	});
});
