/* global QUnit, sinon */
sap.ui.define([
	'sap/ui/comp/personalization/Controller',
	'sap/ui/comp/personalization/BaseController',
	'sap/ui/comp/personalization/ColumnsController',
	'sap/m/library',
	'sap/m/Column',
	'sap/ui/model/json/JSONModel',
	"sap/ui/qunit/utils/nextUIUpdate",
	'sap/ui/table/Table',
	'sap/ui/table/Column',
	'sap/ui/core/CustomData',
	'sap/m/Label',
	'sap/ui/table/TreeTable',
	'sap/ui/table/AnalyticalTable',
	'sap/ui/table/AnalyticalColumn',
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/base/Event"

], function(
	Controller,
	BaseController,
	ColumnsController,
	mLibrary,
	MColumn,
	JSONModel,
	nextUIUpdate,
	Table,
	UiColumn,
	CustomData,
	Label,
	TreeTable,
	AnalyticalTable,
	AnalyticalColumn,
	QUnitUtils,
	Event
) {
	'use strict';
	function fnColumnMapper(oItem){
		return {"columnKey": oItem.columnKey, "index": oItem.index};
	}

	QUnit.module("sap.ui.comp.personalization.ColumnsController: default", {
		beforeEach: function() {
		},
		afterEach: function() {
		}
	});
	QUnit.test("constructor", function(assert) {
		var oColumnsController = new ColumnsController();
		assert.strictEqual(oColumnsController.getType(), mLibrary.P13nPanelType.columns);
		assert.strictEqual(oColumnsController.getModel(), undefined);
		assert.deepEqual(oColumnsController.getIgnoreColumnKeys(), []);
		assert.deepEqual(oColumnsController.getAdditionalIgnoreColumnKeys(), []);
		assert.strictEqual(oColumnsController.getColumnHelper(), null);
		assert.deepEqual(oColumnsController.getColumnKeys(), []);
		oColumnsController.destroy();
	});

	QUnit.module("sap.ui.comp.personalization.ColumnsController: determineMissingColumnKeys", {
		beforeEach: function() {
			this.oJson = {
				columns: {
					columnsItems: [
						{
							columnKey: "A",
							visible: false
						}, {
							columnKey: "B",
							width: "200px"
						}, {
							columnKey: "D",
							total: true
						}
					]
				},
				sort: {
					sortItems: [
						{
							columnKey: "B",
							operation: "acsending"
						}, {
							columnKey: "C"
						}
					]
				}
			};
			this.oStub = sinon.stub(BaseController.prototype, "getColumnMap");
		},
		afterEach: function() {
			this.oColumnsController.destroy();
			this.oStub.restore();
		}
	});
	QUnit.test("default", function(assert) {
		// Soll:    [A, B, D] - [] (oJson - oIgnoreData)
		// Ist:     [B, C]         (ColumnKey2ColumnMap)
		// Missing: [A, D]
		this.oStub.returns({
			B: new MColumn(),
			C: new MColumn()
		});
		this.oColumnsController = new ColumnsController();
		this.oColumnsController.initializeInternalModel(new JSONModel());

		// act and assert
		assert.deepEqual(this.oColumnsController.determineMissingColumnKeys({}), {
			columns: {
				columnsItems: []
			}
		});
		assert.deepEqual(this.oColumnsController.determineMissingColumnKeys(null), {
			columns: {
				columnsItems: []
			}
		});
		assert.deepEqual(this.oColumnsController.determineMissingColumnKeys(), {
			columns: {
				columnsItems: []
			}
		});
		assert.deepEqual(this.oColumnsController.determineMissingColumnKeys(this.oJson), {
			columns: {
				columnsItems: [
					{
						columnKey: "A"
					}, {
						columnKey: "D"
					}
				]
			}
		});
	});
	QUnit.test("with 'ignoreColumnKeys'", function(assert) {
		// Soll:    [A, B, D] - [B] (oJson - oIgnoreData)
		// Ist:     [B, C]          (ColumnKey2ColumnMap)
		// Missing: [A, D]
		this.oStub.returns({
			B: new MColumn(),
			C: new MColumn()
		});
		this.oColumnsController = new ColumnsController({
			ignoreColumnKeys: [
				"B"
			]
		});
		this.oColumnsController.initializeInternalModel(new JSONModel());
		this.oColumnsController.calculateIgnoreData();

		// act and assert
		assert.deepEqual(this.oColumnsController.determineMissingColumnKeys(this.oJson), {
			columns: {
				columnsItems: [
					{
						columnKey: "A"
					}, {
						columnKey: "D"
					}
				]
			}
		});
	});
	QUnit.test("with 'ignoreColumnKeys'", function(assert) {
		// Soll:    [A, B, D] - [A] (oJson - oIgnoreData)
		// Ist:     [B, C]          (ColumnKey2ColumnMap)
		// Missing: [D]
		this.oStub.returns({
			B: new MColumn(),
			C: new MColumn()
		});
		this.oColumnsController = new ColumnsController({
			ignoreColumnKeys: [
				"A"
			]
		});
		this.oColumnsController.initializeInternalModel(new JSONModel());
		this.oColumnsController.calculateIgnoreData();

		// act and assert
		assert.deepEqual(this.oColumnsController.determineMissingColumnKeys(this.oJson), {
			columns: {
				columnsItems: [
					{
						columnKey: "D"
					}
				]
			}
		});
	});
	QUnit.test("with 'ignoreColumnKeys' and 'additionalIgnoreColumnKeys'", function(assert) {
		// Soll:    [A, B, D] - [A, B] (oJson - oIgnoreData)
		// Ist:     [B, C]             (ColumnKey2ColumnMap)
		// Missing: [D]
		this.oStub.returns({
			B: new MColumn(),
			C: new MColumn()
		});
		this.oColumnsController = new ColumnsController({
			ignoreColumnKeys: [
				"A"
			],
			additionalIgnoreColumnKeys: [
				"B"
			]
		});
		this.oColumnsController.initializeInternalModel(new JSONModel());
		this.oColumnsController.calculateIgnoreData();

		// act and assert
		assert.deepEqual(this.oColumnsController.determineMissingColumnKeys(this.oJson), {
			columns: {
				columnsItems: [
					{
						columnKey: "D"
					}
				]
			}
		});
	});
	QUnit.test("with 'ignoreColumnKeys' and 'additionalIgnoreColumnKeys'", function(assert) {
		// Soll:    [A, B, D] - [A, B] (oJson - oIgnoreData)
		// Ist:     [B, C, D]             (ColumnKey2ColumnMap)
		// Missing: []
		this.oStub.returns({
			B: new MColumn(),
			C: new MColumn(),
			D: new MColumn()
		});
		this.oColumnsController = new ColumnsController({
			ignoreColumnKeys: [
				"A"
			],
			additionalIgnoreColumnKeys: [
				"B"
			]
		});
		this.oColumnsController.initializeInternalModel(new JSONModel());
		this.oColumnsController.calculateIgnoreData();

		// act and assert
		assert.deepEqual(this.oColumnsController.determineMissingColumnKeys(this.oJson), {
			columns: {
				columnsItems: []
			}
		});
	});

	QUnit.module("sap.ui.comp.personalization.ColumnsController: _requestMissingColumnsWithoutIgnore", {

		afterEach: function() {
			this.oTable.destroy();
			this.oController.destroy();
		}
	});

	QUnit.test("with UITable and ignoreColumnKey", function(assert) {
		var fTest01 = function(assert, oColumnsController, oController) {
			var fnFireRequestColumnsSpy = sinon.spy(oController, "fireRequestColumns");

			// assert before act
			assert.equal(oColumnsController.getControlDataBase()["columns"]["columnsItems"].length, 1);
			assert.equal(oColumnsController.getControlDataBase()["columns"]["columnsItems"][0].columnKey, "a");
			assert.equal(oColumnsController.getControlDataBase()["columns"]["columnsItems"][0].index, 0);

			assert.equal(oColumnsController.getControlData()["columns"]["columnsItems"].length, 1);
			assert.equal(oColumnsController.getControlData()["columns"]["columnsItems"][0].columnKey, "a");
			assert.equal(oColumnsController.getControlData()["columns"]["columnsItems"][0].index, 0);

			// act
			oController._extendModelStructure(oController._requestMissingColumnsWithoutIgnore({
				columns: {
					columnsItems: [
						{
							columnKey: "c"
						}, {
							columnKey: "i"
						}
					]
				}
			}));

			// assert
			assert.ok(fnFireRequestColumnsSpy.calledOnce);
			assert.equal(oColumnsController.getControlDataBase()["columns"]["columnsItems"].length, 2);
			assert.equal(oColumnsController.getControlDataBase()["columns"]["columnsItems"][0].columnKey, "a");
			assert.equal(oColumnsController.getControlDataBase()["columns"]["columnsItems"][0].index, 0);
			assert.equal(oColumnsController.getControlDataBase()["columns"]["columnsItems"][1].columnKey, "c");
			assert.equal(oColumnsController.getControlDataBase()["columns"]["columnsItems"][1].index, 2);

			assert.equal(oColumnsController.getControlData()["columns"]["columnsItems"].length, 1);
			assert.equal(oColumnsController.getControlData()["columns"]["columnsItems"][0].columnKey, "a");
			assert.equal(oColumnsController.getControlData()["columns"]["columnsItems"][0].index, 0);
		};
		this.oController = new Controller({
			table: this.oTable = new Table({
				columns: [
					new UiColumn({
						label: new Label({
							text: "A"
						}),
						template: new Label({
							text: "row1"
						}),
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'a'
							}
						})
					})
				]
			}),
			columnKeys: [
				"a", "i", "c"
			],
			setting: {
				sort: {
					visible: false
				},
				columns: {
					visible: true,
					ignoreColumnKeys: [
						"i"
					]
				},
				group: {
					visible: false
				},
				filter: {
					visible: false
				}
			},
			requestColumns: function(oEvent) {
				// assert
				assert.deepEqual(oEvent.getParameter("columnKeys"), [
					"c"
				]);
				this.oController.addColumns({
					c: new UiColumn({
						label: new Label({
							text: "C"
						}),
						template: new Label({
							text: "row3"
						}),
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'c'
							}
						})
					})
				});
			}.bind(this)
		});
		fTest01(assert, this.oController._oSettingCurrent.columns.controller, this.oController);
	});

	QUnit.module("sap.ui.comp.personalization.ColumnsController: getUnionData", {
		beforeEach: function() {
			this.oController = new ColumnsController();
		},
		afterEach: function() {
			this.oController.destroy();
		}
	});

	QUnit.test("tests", function(assert) {
		assert.deepEqual(this.oController.getUnionData({
			columns: {
				columnsItems: []
			}
		}, {
			columns: {
				columnsItems: []
			}
		}), {
			columns: {
				columnsItems: []
			}
		});
		//				assert.deepEqual(this.oController.getUnionData(
		//						{columns: {columnsItems: [{columnKey: "name", index: 0}]}},
		//						{columns: {columnsItems: []}}),
		//						{columns: {columnsItems: []}});
		assert.deepEqual(this.oController.getUnionData({
			columns: {
				columnsItems: [
					{
						columnKey: "name",
						index: 0
					}
				]
			}
		}, {
			columns: {
				columnsItems: [
					{
						columnKey: "name",
						index: 0
					}
				]
			}
		}), {
			columns: {
				columnsItems: [
					{
						columnKey: "name",
						index: 0
					}
				]
			}
		});
		assert.deepEqual(this.oController.getUnionData({
			columns: {
				columnsItems: [
					{
						columnKey: "name",
						index: 0
					}
				]
			}
		}, {
			sort: {
				sortItems: [
					{
						columnKey: "name",
						operation: "Ascending"
					}
				]
			}
		}), {
			columns: {
				columnsItems: [
					{
						columnKey: "name",
						index: 0
					}
				]
			}
		});
		assert.deepEqual(this.oController.getUnionData({
			columns: {
				columnsItems: [
					{
						columnKey: "name",
						index: 0
					}
				]
			}
		}, {
			columns: {
				columnsItems: [
					{
						columnKey: "name",
						index: 1
					}
				]
			}
		}), {
			columns: {
				columnsItems: [
					{
						columnKey: "name",
						index: 1
					}
				]
			}
		});
		assert.deepEqual(this.oController.getUnionData({
			columns: {
				columnsItems: [
					{
						columnKey: "name",
						index: 0
					}
				]
			}
		}, {
			columns: {
				columnsItems: [
					{
						columnKey: "country",
						index: 1
					}
				]
			}
		}), {
			columns: {
				columnsItems: [
					{
						columnKey: "name",
						index: 0
					},
					{
						columnKey: "country",
						index: 1
					}
				]
			}
		});
		assert.deepEqual(this.oController.getUnionData({
			columns: {
				columnsItems: [
					{
						columnKey: "name",
						index: 0
					}
				]
			}
		}, {
			columns: {
				columnsItems: [
					{
						columnKey: "name",
						index: 1
					}, {
						columnKey: "country",
						index: 1
					}
				]
			}
		}), {
			columns: {
				columnsItems: [
					{
						columnKey: "name",
						index: 1
					}, {
						columnKey: "country",
						index: 2
					}
				]
			}
		});
		assert.deepEqual(this.oController.getUnionData({
			columns: {
				columnsItems: [
					{
						columnKey: "name",
						index: 0
					}, {
						columnKey: "country",
						index: 1
					}
				]
			}
		}, {
			columns: {
				columnsItems: [
					{
						columnKey: "name",
						index: 1
					}
				]
			}
		}), {
			columns: {
				columnsItems: [
					{
						columnKey: "name",
						index: 1
					}, {
						columnKey: "country",
						index: 2
					}
				]
			}
		});
		assert.deepEqual(this.oController.getUnionData({
			columns: {
				columnsItems: [
					{
						columnKey: "name",
						index: 0
					}
				]
			}
		}, {
			columns: {
				columnsItems: [
					{
						columnKey: "name",
						width: ""
					}
				]
			}
		}), {
			columns: {
				columnsItems: [
					{
						columnKey: "name",
						index: 0,
						width: ""
					}
				]
			}
		});
		assert.deepEqual(this.oController.getUnionData({
			columns: {
				columnsItems: [
					{
						columnKey: "name",
						index: 0,
						width: ""
					}
				]
			}
		}, {
			columns: {
				columnsItems: [
					{
						columnKey: "name",
						width: "100px"
					}
				]
			}
		}), {
			columns: {
				columnsItems: [
					{
						columnKey: "name",
						index: 0,
						width: "100px"
					}
				]
			}
		});
		// update controlDataBase from controlData: controlDataBase and controlData
		assert.deepEqual(this.oController.getUnionData({
			columns: {
				columnsItems: [
					{
						columnKey: "name",
						index: 0
					}
				]
			}
		}, {
			columns: {
				fixedColumnCount: 1,
				columnsItems: [
					{
						columnKey: "name",
						index: 0
					}
				]
			}
		}), {
			columns: {
				fixedColumnCount: 1,
				columnsItems: [
					{
						columnKey: "name",
						index: 0
					}
				]
			}
		}, "'fixedColumnCount' is set via direct manipulation on the table");
		// controlDataInitial and variantData
		assert.deepEqual(this.oController.getUnionData({
			columns: {
				fixedColumnCount: 1,
				columnsItems: [
					{
						columnKey: "name",
						index: 0
					}, {
						columnKey: "price",
						visible: true
					}
				]
			}
		}, {
			columns: {
				columnsItems: [
					{
						columnKey: "price",
						visible: true
					}
				]
			}
		}), {
			columns: {
				fixedColumnCount: 1,
				columnsItems: [
					{
						columnKey: "price",
						visible: true
					}, {
						columnKey: "name",
						index: 0
					}
				]
			}
		}, "'old' variant without 'fixedColumnCount'");
		//				 controlDataInitial and variantData
		assert.deepEqual(this.oController.getUnionData({
			columns: {
				columnsItems: []
			}
		}, {
			columns: {
				fixedColumnCount: 1,
				columnsItems: []
			}
		}), {
			columns: {
				fixedColumnCount: 1,
				columnsItems: []
			}
		}, "'new' variant with 'fixedColumnCount'");
		// controlDataInitial and variantData
		assert.deepEqual(this.oController.getUnionData({
			columns: {
				fixedColumnCount: 1,
				columnsItems: []
			}
		}, {
			columns: {
				fixedColumnCount: 2,
				columnsItems: []
			}
		}), {
			columns: {
				fixedColumnCount: 2,
				columnsItems: []
			}
		}, "'new' variant with 'fixedColumnCount'");
		// controlDataInitial and variantData
		assert.deepEqual(this.oController.getUnionData({
			columns: {
				fixedColumnCount: undefined,
				columnsItems: []
			}
		}, {
			columns: {
				columnsItems: []
			}
		}), {
			columns: {
				columnsItems: []
			}
		});
		// controlDataInitial and variantData
		assert.deepEqual(this.oController.getUnionData({
			columns: {
				columnsItems: []
			}
		}, {
			columns: {
				fixedColumnCount: undefined,
				columnsItems: []
			}
		}), {
			columns: {
				columnsItems: []
			}
		});
	});

	QUnit.module("sap.ui.comp.personalization.ColumnsController: fixConflictWithIgnore", {
		beforeEach: function() {
			this.oController = new ColumnsController();
		},
		afterEach: function() {
			this.oController.destroy();
		}
	});
	QUnit.test("tests without move", function(assert) {
		var oJsonIgnore = {
			columns: {
				columnsItems: [
					{
						columnKey: "i"
					}
				]
			}
		};
		var oJson = {
			columns: {
				columnsItems: [
					{
						columnKey: "a",
						index: 0
					}, {
						columnKey: "b",
						index: 1
					}
				]
			}
		};
		this.oController.fixConflictWithIgnore(oJson, oJsonIgnore);
		assert.deepEqual(oJson, {
			columns: {
				columnsItems: [
					{
						columnKey: "a",
						index: 0
					}, {
						columnKey: "b",
						index: 1
					}
				]
			}
		});

		oJson = {
			columns: {
				columnsItems: [
					{
						columnKey: "a",
						index: 0
					}, {
						columnKey: "i"
					}
				]
			}
		};
		this.oController.fixConflictWithIgnore(oJson, oJsonIgnore);
		assert.deepEqual(oJson, {
			columns: {
				columnsItems: [
					{
						columnKey: "a",
						index: 0
					}, {
						columnKey: "i"
					}
				]
			}
		});

		oJson = {
			columns: {
				columnsItems: [
					{
						columnKey: "a",
						index: undefined
					}, {
						columnKey: "i",
						index: 0
					}
				]
			}
		};
		this.oController.fixConflictWithIgnore(oJson, oJsonIgnore);
		assert.deepEqual(oJson, {
			columns: {
				columnsItems: [
					{
						columnKey: "i",
						index: 0
					}, {
						columnKey: "a",
						index: undefined
					}
				]
			}
		});

		oJson = {
			columns: {
				columnsItems: [
					{
						columnKey: "a",
						index: 0
					}, {
						columnKey: "i",
						index: 1
					}
				]
			}
		};
		this.oController.fixConflictWithIgnore(oJson, oJsonIgnore);
		assert.deepEqual(oJson, {
			columns: {
				columnsItems: [
					{
						columnKey: "a",
						index: 0
					}, {
						columnKey: "i",
						index: 1
					}
				]
			}
		});

		oJson = {
			columns: {
				columnsItems: [
					{
						columnKey: "a",
						index: 0
					}, {
						columnKey: "i",
						index: 0
					}
				]
			}
		};
		this.oController.fixConflictWithIgnore(oJson, oJsonIgnore);
		assert.deepEqual(oJson, {
			columns: {
				columnsItems: [
					{
						columnKey: "a",
						index: 0
					}, {
						columnKey: "i",
						index: 1
					}
				]
			}
		});
	});

	QUnit.test("tests with move", function(assert) {
		var oJsonIgnore = {
			columns: {
				columnsItems: [
					{
						columnKey: "i"
					}, {
						columnKey: "j"
					}
				]
			}
		};
		var oJson = {
			columns: {
				columnsItems: [
					{
						columnKey: "i",
						index: 0
					}, {
						columnKey: "a",
						index: 0
					}
				]
			}
		};
		this.oController.fixConflictWithIgnore(oJson, oJsonIgnore);
		assert.deepEqual(oJson, {
			columns: {
				columnsItems: [
					{
						columnKey: "a",
						index: 0
					}, {
						columnKey: "i",
						index: 1
					}
				]
			}
		});

		oJson = {
			columns: {
				columnsItems: [
					{
						columnKey: "j",
						index: 1
					}, {
						columnKey: "a",
						index: 0
					}, {
						columnKey: "b",
						index: 1
					}, {
						columnKey: "i",
						index: 0
					}
				]
			}
		};
		this.oController.fixConflictWithIgnore(oJson, oJsonIgnore);
		assert.deepEqual(oJson, {
			columns: {
				columnsItems: [
					{
						columnKey: "a",
						index: 0
					}, {
						columnKey: "i",
						index: 1
					}, {
						columnKey: "b",
						index: 2
					}, {
						columnKey: "j",
						index: 3
					}
				]
			}
		});

		oJson = {
			columns: {
				columnsItems: [
					{
						columnKey: "j",
						index: 1
					}, {
						columnKey: "a",
						index: 0
					}, {
						columnKey: "b",
						index: undefined
					}, {
						columnKey: "i",
						index: 0
					}
				]
			}
		};
		this.oController.fixConflictWithIgnore(oJson, oJsonIgnore);
		assert.deepEqual(oJson, {
			columns: {
				columnsItems: [
					{
						columnKey: "a",
						index: 0
					}, {
						columnKey: "i",
						index: 1
					}, {
						columnKey: "j",
						index: 2
					}, {
						columnKey: "b",
						index: undefined
					}
				]
			}
		});
	});

	QUnit.module("sap.ui.comp.personalization.ColumnsController: resize column width of AnalyticalTable", {
		beforeEach: async function() {
			this.oColumnsController = new ColumnsController();
			this.oController = new Controller({
				table: this.oTable = new AnalyticalTable({
					columns: [
						new AnalyticalColumn({
							label: new Label({
								text: "A"
							}),
							template: new Label({
								text: "row1"
							}),
							customData: new CustomData({
								key: "p13nData",
								value: {
									columnKey: 'a'
								}
							})
						}),
						new AnalyticalColumn({
							label: new Label({
								text: "B"
							}),
							template: new Label({
								text: "row2"
							}),
							customData: new CustomData({
								key: "p13nData",
								value: {
									columnKey: 'b'
								}
							})
						}),
						new AnalyticalColumn({
							visible: false,
							label: new Label({
								text: "I"
							}),
							template: new Label({
								text: "row3"
							}),
							customData: new CustomData({
								key: "p13nData",
								value: {
									columnKey: 'i'
								}
							})
						}),
						new AnalyticalColumn({
							visible: false,
							label: new Label({
								text: "II"
							}),
							template: new Label({
								text: "row4"
							}),
							customData: new CustomData({
								key: "p13nData",
								value: {
									columnKey: 'ii'
								}
							})
						})
					]
				}),
				columnKeys: [
					"a", "b", "i", "ii"
				],
				setting: {
					columns: {
						visible: true,
						ignoreColumnKeys: [
							"i", "ii"
						]
					},
					sort: {
						visible: false
					},
					group: {
						visible: false
					},
					filter: {
						visible: false
					}
				}
			});
			this.oColumnsController = this.oController._getControllers().columns.controller;

			this.oTable.placeAt("qunit-fixture");
			await nextUIUpdate();
		},
		afterEach: function() {
			this.oTable.destroy();
			this.oController.destroy();
			this.oColumnsController.destroy();
		}
	});
	QUnit.test("before dialog is opened", function(assert) {

		var iWidthNew = "50";
		var sWidthNew = "" + iWidthNew + "px";

		this.oController.attachAfterP13nModelDataChange(function(oEvent) {
			// assert
			assert.strictEqual(oEvent.getParameter("runtimeDeltaDataChangeType").columns, "TableChanged");

			assert.strictEqual(oEvent.getParameter("runtimeDeltaData").columns.columnsItems.length, 1);
			assert.strictEqual(oEvent.getParameter("runtimeDeltaData").columns.columnsItems[0].columnKey, "a");
			assert.strictEqual(oEvent.getParameter("runtimeDeltaData").columns.columnsItems[0].width, sWidthNew);
		});

		this.oTable.fireColumnResize({
			column: this.oTable.getColumns()[0],
			width: sWidthNew
		});
	});

	QUnit.test("after dialog is opened", function(assert) {
		var done = assert.async();
		// 1. open and close dialog
		this.oController.openDialog();
		this.oController.attachDialogAfterOpen(function() {
			QUnitUtils.triggerTouchEvent("tap", this.oController._oDialog.getButtons()[0].getFocusDomRef(), {
				srcControl: this.oController._oDialog
			});
		}.bind(this));

		// 2. resize column width twice
		this.oController.attachDialogAfterClose(function() {
			// act
			var oControlDataReduce = {
				columns: {
					columnsItems: [
						{columnKey: "a", index: 0, visible: true, width: "50px", total: false},
						{columnKey: "b", index: 1, visible: true, width: "", total: false}
					],
					fixedColumnCount: 0,
					showDetails: false
				}
			};

			var oControlDataCompare = {
				columns: {
						columnsItems:[
							{columnKey: "a", index: 0, visible: true, width: "", total: false},
							{columnKey: "b", index: 1, visible: true, width: "", total: false}
						]
					},
					fixedColumnCount: 1,
					showDetails: false
			};

			var oData = this.oColumnsController.getChangeData(oControlDataReduce, oControlDataCompare);
			assert.ok(oData);

			done();
		}.bind(this));
	});

	QUnit.module("sap.ui.comp.personalization.ColumnsController: move column of TreeTable", {
		beforeEach: async function() {
			this.oColumnsController = new ColumnsController();
			this.oMovedColumn =  new UiColumn({
				label: new Label({
					text: "B"
				}),
				template: new Label({
					text: "row2"
				}),
				customData: new CustomData({
					key: "p13nData",
					value: {
						columnKey: 'b'
					}
				})
			});
			this.oController = new Controller({
				table: this.oTable = new TreeTable({
					columns: [
						new UiColumn({
							label: new Label({
								text: "A"
							}),
							template: new Label({
								text: "row1"
							}),
							customData: new CustomData({
								key: "p13nData",
								value: {
									columnKey: 'a'
								}
							})
						}),
						this.oMovedColumn,
						new UiColumn({
							visible: false,
							label: new Label({
								text: "I"
							}),
							template: new Label({
								text: "row3"
							}),
							customData: new CustomData({
								key: "p13nData",
								value: {
									columnKey: 'i'
								}
							})
						}),
						new UiColumn({
							visible: false,
							label: new Label({
								text: "II"
							}),
							template: new Label({
								text: "row4"
							}),
							customData: new CustomData({
								key: "p13nData",
								value: {
									columnKey: 'ii'
								}
							})
						})
					]
				}),
				columnKeys: [
					"a", "b", "i", "ii"
				],
				setting: {
					columns: {
						visible: true,
						ignoreColumnKeys: [
							"i", "ii"
						]
					},
					sort: {
						visible: false
					},
					group: {
						visible: false
					},
					filter: {
						visible: false
					}
				}
			});
			this.oColumnsController = this.oController._getControllers().columns.controller;

			this.oTable.placeAt("qunit-fixture");
			await nextUIUpdate();
		},
		afterEach: function() {
			this.oMovedColumn.destroy();
			this.oTable.destroy();
			this.oController.destroy();
			this.oColumnsController.destroy();
		}
	});

	QUnit.test("onColumnMove should not add new column indexes", function(assert) {
		var oUpdateControlDataBaseFromJsonSpy = sinon.spy(this.oColumnsController, "updateControlDataBaseFromJson"),
			oEventParameters = {
				newPos: 0,
				column: this.oMovedColumn
			},
			oNewContolData = {
				columns: {
						columnsItems:[
							{columnKey: "b", index: 0, visible: true, width: ""},
							{columnKey: "a", index: 1, visible: true, width: ""},
							{columnKey: "i", index: 2, visible: false, width: ""},
							{columnKey: "ii", index: 3, visible: false, width: ""}
						],
						fixedColumnCount: 0,
						showDetails: false
				}
			},
			oEvent = sinon.createStubInstance(Event);

			oEvent.getParameter.withArgs("newPos").returns(oEventParameters.newPos);
			oEvent.getParameter.withArgs("column").returns(oEventParameters.column);

			this.oColumnsController._onColumnMove(oEvent);
			assert.ok(oUpdateControlDataBaseFromJsonSpy.calledWith(oNewContolData), "ok");
	});

	QUnit.module("test API for property 'stableColumnKeys'", {
		beforeEach:function(){
			this.oColumnsController = new ColumnsController();
			this.oP13nData = {
				columns: {
					columnsItems: [
						{
							columnKey: "A",
							visible: true,
							index: 10,
							width: "30em"
						},
						{
							columnKey: "B",
							visible: true,
							index: 0,
							width: "30em"
						},
						{
							columnKey: "D",
							visible: false,
							index: 4,
							width: "30em"
						},
						{
							columnKey: "E",
							visible: false,
							index: 3,
							width: "30em"
						},
						{
							columnKey: "C",
							visible: true,
							index: 7,
							width: "30em"
						}
					]
				}
			};
			this.oTransientData = {
				columns: {
					columnsItems: [
						{
							columnKey: "B",
							visible: true,
							index: 0,
							width: "30em"
						},
						{
							columnKey: "D",
							visible: false,
							index: 4,
							width: "30em"
						},
						{
							columnKey: "E",
							visible: false,
							index: 3,
							width: "30em"
						},
						{
							columnKey: "C",
							visible: true,
							index: 7,
							width: "30em"
						}
					]
				}
			};
		},
		afterEach:function(){
			this.oColumnsController.destroy();
		}
	});

	QUnit.test("getUnionData - column [0] is disabled from ColumnsPanel via stableColumnKeys", function(assert){

		var oJsonModel = new JSONModel({
				controlData: this.oP13nData,
				controlDataInitial: this.oP13nData,
				transientData: this.oTransientData
			}),
			oTransientData,
			oUnionData;

		this.oColumnsController.setStableColumnKeys(["A"]);
		this.oColumnsController.setModel(oJsonModel,"$sapuicomppersonalizationBaseController");
		oTransientData = this.oColumnsController.getTransientData();
		assert.equal(oTransientData.columns.columnsItems.length, 4, "stable column keys have not been included in transient data");
		oUnionData = this.oColumnsController.getUnionData(this.oP13nData, oTransientData);
		assert.equal(oUnionData.columns.columnsItems.length, 5, "Missing column has been added in union");
		assert.deepEqual(oUnionData.columns.columnsItems[0],{columnKey: "B", visible: true, index: 0, width: "30em"}, "union of column item is correct");
		assert.deepEqual(oUnionData.columns.columnsItems[2],{columnKey: "D", visible: false, index: 4, width: "30em"}, "union of column item is correct");
		assert.deepEqual(oUnionData.columns.columnsItems[1],{columnKey: "E", visible: false, index: 3, width: "30em"}, "union of column item is correct");
		assert.deepEqual(oUnionData.columns.columnsItems[3],{columnKey: "C", visible: true, index: 7, width: "30em"}, "union of column item is correct");
		assert.deepEqual(oUnionData.columns.columnsItems[4],{columnKey: "A", visible: true, index: 10, width: "30em"}, "union of column item is correct");

	});

	QUnit.test("getUnionData - column [0] and [1] are disabled from ColumnsPanel via stableColumnKeys", function(assert){

		var oJsonModel = new JSONModel({
				controlData: this.oP13nData,
				controlDataInitial: this.oP13nData,
				transientData: {
					columns: {
						columnsItems: [
							{
								columnKey: "C",
								visible: false, //toggle C to invisible
								index: 4, //swapped  C and D
								width: "30em"
							},
							{
								columnKey: "D",
								visible: true, //toggle D to visible
								index: 7, //swapped  C and D
								width: "30em"
							},
							{
								columnKey: "E",
								visible: false,
								index: 3,
								width: "30em"
							}
						]
					}
				}
			}),
			oTransientData,
			oUnionData;

		this.oColumnsController.setStableColumnKeys(["A", "B"]);
		this.oColumnsController.setModel(oJsonModel,"$sapuicomppersonalizationBaseController");
		oTransientData = this.oColumnsController.getTransientData();
		assert.equal(oTransientData.columns.columnsItems.length, 3, "stable column keys have not been included in transient data");
		oUnionData = this.oColumnsController.getUnionData(this.oP13nData, oTransientData);
		assert.equal(oUnionData.columns.columnsItems.length, 5, "Missing column has been added in union");
		assert.deepEqual(oUnionData.columns.columnsItems[2],{columnKey: "C", visible: false, index: 4, width: "30em"}, "union of column item is correct");
		assert.deepEqual(oUnionData.columns.columnsItems[3],{columnKey: "D", visible: true, index: 7, width: "30em"}, "union of column item is correct");
		assert.deepEqual(oUnionData.columns.columnsItems[1],{columnKey: "E", visible: false, index: 3, width: "30em"}, "union of column item is correct");
		assert.deepEqual(oUnionData.columns.columnsItems[4],{columnKey: "A", visible: true, index: 10, width: "30em"}, "union of column item is correct");
		assert.deepEqual(oUnionData.columns.columnsItems[0],{columnKey: "B", visible: true, index: 0, width: "30em"}, "union of column item is correct");
	});

	QUnit.test("retrieveAdaptationUI - check 'width' attribute propagation", function(assert){

		var done = assert.async();

		var oJsonModel = new JSONModel({
			controlData: this.oP13nData,
			controlDataReduce: this.oP13nData,
			controlDataInitial: this.oP13nData,
			transientData: {
				columns: {
					columnsItems: [
						{
							columnKey: "A",
							visible: true,
							index: 0
						},
						{
							columnKey: "B",
							visible: true,
							index: 1
						},
						{
							columnKey: "C",
							visible: false,
							index: 2
						}
					]
				}
			}
		});

		this.oColumnsController.setModel(oJsonModel,"$sapuicomppersonalizationBaseController");

		this.oColumnsController.retrieveAdaptationUI().then(function(oSelectionPanel){

			this.oColumnsController.attachAfterPotentialModelChange(function(oEvt){
				var oControlDataReduce = oEvt.getParameter("json");

				assert.ok(oControlDataReduce.columns.columnsItems[0].hasOwnProperty("width"), "'Width' is propagated");
				assert.ok(oControlDataReduce.columns.columnsItems[1].hasOwnProperty("width"), "'Width' is propagated");
				assert.ok(oControlDataReduce.columns.columnsItems[2].hasOwnProperty("width"), "'Width' is propagated");
				done();
			});

			oSelectionPanel.fireChange();//to trigger 'afterPotentialModelChange'


		}.bind(this));

	});

	QUnit.test("retrieveAdaptationUI - check order of column indexes", function(assert){

		var done = assert.async(),
			oTable = new Table({
				columns: [
					new UiColumn({
						label: new Label({
							text: "a"
						}),
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'a'
							}
						})
					}),
					new UiColumn({
						visible: false,
						label: new Label({
							text: "d"
						}),
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'd'
							}
						})
					}),
					new UiColumn({
						label: new Label({
							text: "b"
						}),
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'b'
							}
						})
					})
				]
			}),
			oController = new Controller({
				table: oTable,
				columnKeys: [
					"a", "d", "b", "c"
				],
				setting: {
					sort: {
						visible: false
					},
					columns: {
						visible: true,
						ignoreColumnKeys: []
					},
					group: {
						visible: true
					},
					filter: {
						visible: true
					}
				},
				requestColumns: function(oEvent) {
					oController.addColumns({
						c: new UiColumn({
							label: new Label({
								text: "c"
							}),
							customData: new CustomData({
								key: "p13nData",
								value: {
									columnKey: 'c'
								}
							})
						})
					});
				}
			}),
			oColumnsController = oController._getControllers().columns.controller,
			oSortIndexesByOrderSpy = sinon.spy(oColumnsController, "_sortIndexesByOrder");

			sinon.stub(oController, "validateP13n").callsFake(function(){
				return oController.validateP13n.wrappedMethod.apply(oController, arguments)
					.then(function(oResult){
						var oColumnsControlDataReduce,
							oColumnsControlDataReduceColumnItems;

						oColumnsControlDataReduce = oColumnsController.getControlDataReduce();
						oColumnsControlDataReduceColumnItems = oColumnsControlDataReduce["columns"]["columnsItems"];

						assert.ok(oSortIndexesByOrderSpy.called, "_sortIndexesByOrder function is called");
						if (oColumnsControlDataReduceColumnItems.length === 4) {
							var oColumnItemA = oColumnsControlDataReduceColumnItems[0],
								oColumnItemB = oColumnsControlDataReduceColumnItems[1],
								oColumnItemC = oColumnsControlDataReduceColumnItems[2],
								oColumnItemD = oColumnsControlDataReduceColumnItems[3];

							assert.equal(oColumnItemA.columnKey, "a");
							assert.equal(oColumnItemA.index, 0);
							assert.equal(oColumnItemB.columnKey, "b");
							assert.equal(oColumnItemB.index, 1);
							assert.equal(oColumnItemC.columnKey, "c");
							assert.equal(oColumnItemC.index, 2);
							assert.equal(oColumnItemD.columnKey, "d");
							assert.equal(oColumnItemD.index, 3);
						}

						oController.destroy();
						oTable.destroy();
						done();

						return oResult;
					});
			});

		//requests UI settings --> triggers 'retrieveAdaptationUI' on ColumnsController instance
		oController.openDialog()
		.then(function(oDialog){
			var oSelectionPanel = oDialog.getContent()[0],
				aP13nData = oSelectionPanel.getP13nData();

			//mark earlier invisible item as visible and fire the according UI event
			var oItemD = aP13nData[3];
			oItemD.visible = true;
			oSelectionPanel.setP13nData(aP13nData);
			oSelectionPanel.fireChange({
				reason: oSelectionPanel.CHANGE_REASON_ADD,
				item: oItemD
			});

			oDialog.close();
		});

	});

	QUnit.test("retrieveAdaptationUI - trigger sorting", function(assert){

		var done = assert.async();

		var oJsonModel = new JSONModel({
			controlDataReduce: this.oP13nData,
			transientData: this.oP13nData
		});

		this.oColumnsController.setModel(oJsonModel,"$sapuicomppersonalizationBaseController");
		var aSortedData = this.oColumnsController.getAdaptationData();
		if (aSortedData.length === 5) {
			var oAdaptationItem0 = aSortedData[0],
				oAdaptationItem1 = aSortedData[1],
				oAdaptationItem2 = aSortedData[2],
				oAdaptationItem3 = aSortedData[3],
				oAdaptationItem4 = aSortedData[4];

			assert.equal(oAdaptationItem0.name, "B");
			assert.equal(oAdaptationItem0.position, 0);
			assert.equal(oAdaptationItem0.visible, true);
			assert.equal(oAdaptationItem1.name, "C");
			assert.equal(oAdaptationItem1.position, 7);
			assert.equal(oAdaptationItem1.visible, true);
			assert.equal(oAdaptationItem2.name, "A");
			assert.equal(oAdaptationItem2.position, 10);
			assert.equal(oAdaptationItem2.visible, true);
			assert.equal(oAdaptationItem3.name, "D");
			assert.equal(oAdaptationItem3.position, 4);
			assert.equal(oAdaptationItem3.visible, false);
			assert.equal(oAdaptationItem4.name, "E");
			assert.equal(oAdaptationItem4.position, 3);
			assert.equal(oAdaptationItem4.visible, false);
		}

		this.oColumnsController.retrieveAdaptationUI().then(function(oSelectionPanel) {
			var sortSpy = sinon.spy(this.oColumnsController,"_sortAdaptationData"),
				sortIndexesSpy = sinon.spy(this.oColumnsController,"_sortIndexesByOrder");

			this.oColumnsController.attachAfterPotentialModelChange(function(oEvt) {
				var oControlDataReduce = oEvt.getParameter("json"),
					aColumnsItems = oControlDataReduce.columns.columnsItems;

					if (aColumnsItems.length === 5) {
						var oColumnsItem0 = aColumnsItems[0],
							oColumnsItem1 = aColumnsItems[1],
							oColumnsItem2 = aColumnsItems[2],
							oColumnsItem3 = aColumnsItems[3],
							oColumnsItem4 = aColumnsItems[4];
						assert.equal(oColumnsItem0.columnKey, "B");
						assert.equal(oColumnsItem0.index, 0);
						assert.equal(oColumnsItem0.visible, true);
						assert.equal(oColumnsItem1.columnKey, "C");
						assert.equal(oColumnsItem1.index, 3);
						assert.equal(oColumnsItem1.visible, true);
						assert.equal(oColumnsItem2.columnKey, "A");
						assert.equal(oColumnsItem2.index, 4);
						assert.equal(oColumnsItem2.visible, true);
						assert.equal(oColumnsItem3.columnKey, "D");
						assert.equal(oColumnsItem3.index, 7);
						assert.equal(oColumnsItem3.visible, false);
						assert.equal(oColumnsItem4.columnKey, "E");
						assert.equal(oColumnsItem4.index, 10);
						assert.equal(oColumnsItem4.visible, false);
					}

				assert.ok(sortSpy.calledOnce, "_sortAdaptationData has been executed");
				assert.ok(sortIndexesSpy.calledOnce, "_sortIndexesByOrder has been executed");

				done();
			});

			oSelectionPanel.fireChange();//to trigger 'afterPotentialModelChange'

		}.bind(this));

	});

	QUnit.module("sap.ui.comp.personalization.ColumnsController", {
		beforeEach: function() {
			this.oColumnsController = new ColumnsController({});
			this.oColumnsController.initializeInternalModel(new JSONModel());
		},
		afterEach: function() {
			this.oColumnsController.destroy();
		}
	});
	QUnit.test("_updateInternalModelShowHide should update the internal model ", function(assert) {
		//prepare
		var bShowDetails = true,
			sPropertyPath = "/controlData/columns/showDetails/",
			oInternalModel = this.oColumnsController.getInternalModel(),
			oGetControlDataSpy = sinon.spy(this.oColumnsController, "getControlData"),
			oInternalModelSpy = sinon.spy(this.oColumnsController, "getInternalModel"),
			oSetPropertySpy = sinon.spy(oInternalModel, "setProperty"),
			oFireAfterColumnsModelDataChangeSpy = sinon.spy(this.oColumnsController, "fireAfterColumnsModelDataChange"),
			oUpdateControlDataBaseFromJsonSpy = sinon.spy(this.oColumnsController, "updateControlDataBaseFromJson");

		//act
		this.oColumnsController._updateInternalModelShowHide(bShowDetails);

		//assert
		assert.ok(oGetControlDataSpy.called, "getControlData function is called");
		assert.ok(oInternalModelSpy.called, "getInternalModel function is called");
		assert.ok(oSetPropertySpy.called, "oSetPropertySpy function of the JSON model is called");
		assert.ok(oSetPropertySpy.calledWith(sPropertyPath, bShowDetails), "oSetPropertySpy function of the JSON model is called with the correct params");
		assert.ok(oUpdateControlDataBaseFromJsonSpy.called, "updateControlDataBaseFromJson is called");
		assert.ok(oFireAfterColumnsModelDataChangeSpy.called, "fireAfterColumnsModelDataChange is called");
		assert.equal(oInternalModel.getProperty(sPropertyPath), true, "property showDetails have correct value");
	});

	QUnit.test("getUnionData should not return columns with duplicated IDs, this test is also testing the columns order after refresh of the application.", function(assert) {
		// Arrange
		var oUnion,
			oControlDataInitial = {
				"columns": {
					"columnsItems": [
						{
							"columnKey": "MessageButton",
							"index": 0,
							"visible": true,
							"width": "2em"
						},
						{
							"columnKey": "OutputRequestItemStatus",
							"index": 1,
							"visible": true,
							"width": "20rem"
						},
						{
							"columnKey": "OutputControlApplObjectType",
							"index": 2,
							"visible": true,
							"width": "20rem"
						},
						{
							"columnKey": "OutputControlApplicationObject",
							"index": 3,
							"visible": true,
							"width": "20rem"
						},
						{
							"columnKey": "OutputRequestItem",
							"index": 4,
							"visible": true,
							"width": "4.34rem"
						},
						{
							"columnKey": "OutputDocumentType",
							"index": 5,
							"visible": true,
							"width": "20rem"
						},
						{
							"columnKey": "OutputChannel",
							"index": 6,
							"visible": true,
							"width": "20rem"
						},
						{
							"columnKey": "FormTemplateDescription",
							"index": 7,
							"visible": true,
							"width": "20rem"
						},
						{
							"columnKey": "OutputItemReceiverName",
							"index": 8,
							"visible": true,
							"width": "20rem"
						},
						{
							"columnKey": "DispatchTime",
							"index": 9,
							"visible": true,
							"width": "19.07rem"
						},
						{
							"columnKey": "LastChangeDateTime",
							"index": 10,
							"visible": true,
							"width": "9.32rem"
						},
						{
							"columnKey": "CreationDate",
							"index": 19,
							"visible": false,
							"width": "5.48rem"
						},
						{
							"columnKey": "IsChangeDocument",
							"index": 18,
							"visible": false,
							"width": "6.36rem"
						},
						{
							"columnKey": "SenderOrganizationalUnitType",
							"index": 17,
							"visible": false,
							"width": "20rem"
						},
						{
							"columnKey": "SenderOrganizationalCenterType",
							"index": 15,
							"visible": false,
							"width": "20rem"
						},
						{
							"columnKey": "SenderOrganizationalCenterDesc",
							"index": 14,
							"visible": false,
							"width": "20rem"
						},
						{
							"columnKey": "PrintQueue",
							"index": 13,
							"visible": false,
							"width": "14.79rem"
						},
						{
							"columnKey": "OutputItemRecipientRoleDesc",
							"index": 12,
							"visible": false,
							"width": "20rem"
						},
						{
							"columnKey": "OutputRequestItemUUID",
							"index": 11,
							"visible": false,
							"width": "9rem"
						},
						{
							"columnKey": "SenderOrganizationalUnitDesc",
							"index": 16,
							"visible": false,
							"width": "20rem"
						}
					]
				}
			},
			oRuntimeData = {
				"columns": {
					"columnsItems": [
						{
							"columnKey": "MessageButton",
							"visible": true,
							"index": 0,
							"width": "2em"
						},
						{
							"columnKey": "OutputRequestItemStatus",
							"visible": true,
							"index": 1,
							"width": "20rem"
						},
						{
							"columnKey": "OutputControlApplObjectType",
							"visible": true,
							"index": 2,
							"width": "20rem"
						},
						{
							"columnKey": "OutputControlApplicationObject",
							"visible": true,
							"index": 3,
							"width": "20rem"
						},
						{
							"columnKey": "OutputRequestItem",
							"visible": true,
							"index": 4,
							"width": "4.34rem"
						},
						{
							"columnKey": "OutputDocumentType",
							"visible": true,
							"index": 5,
							"width": "221px"
						},
						{
							"columnKey": "OutputChannel",
							"visible": true,
							"index": 6,
							"width": "20rem"
						},
						{
							"columnKey": "FormTemplateDescription",
							"visible": true,
							"index": 7,
							"width": "20rem"
						},
						{
							"columnKey": "OutputItemReceiverName",
							"visible": true,
							"index": 8,
							"width": "20rem"
						},
						{
							"columnKey": "DispatchTime",
							"visible": true,
							"index": 9,
							"width": "19.07rem"
						},
						{
							"columnKey": "LastChangeDateTime",
							"visible": true,
							"index": 10,
							"width": "9.32rem"
						},
						{
							"columnKey": "CreationDate",
							"visible": true,
							"index": 11,
							"width": "5.48rem"
						},
						{
							"columnKey": "IsChangeDocument",
							"width": "6.36rem"
						},
						{
							"columnKey": "SenderOrganizationalUnitType",
							"width": "20rem"
						},
						{
							"columnKey": "SenderOrganizationalCenterType",
							"width": "20rem"
						},
						{
							"columnKey": "SenderOrganizationalCenterDesc",
							"width": "20rem"
						},
						{
							"columnKey": "PrintQueue",
							"width": "14.79rem"
						},
						{
							"columnKey": "OutputItemRecipientRoleDesc",
							"width": "20rem"
						},
						{
							"columnKey": "OutputRequestItemUUID",
							"width": "9rem"
						},
						{
							"columnKey": "SenderOrganizationalUnitDesc",
							"width": "20rem"
						}
					]
				}
			},
			oUnionReference = {
				"columns": {
					"columnsItems": [
						{
							"columnKey": "MessageButton",
							"visible": true,
							"index": 0,
							"width": "2em"
						},
						{
							"columnKey": "OutputRequestItemStatus",
							"visible": true,
							"index": 1,
							"width": "20rem"
						},
						{
							"columnKey": "OutputControlApplObjectType",
							"visible": true,
							"index": 2,
							"width": "20rem"
						},
						{
							"columnKey": "OutputControlApplicationObject",
							"visible": true,
							"index": 3,
							"width": "247px"
						},
						{
							"columnKey": "OutputRequestItem",
							"visible": true,
							"index": 4,
							"width": "4.34rem"
						},
						{
							"columnKey": "OutputDocumentType",
							"visible": true,
							"index": 5,
							"width": "20rem"
						},
						{
							"columnKey": "OutputChannel",
							"visible": true,
							"index": 6,
							"width": "20rem"
						},
						{
							"columnKey": "FormTemplateDescription",
							"visible": true,
							"index": 7,
							"width": "20rem"
						},
						{
							"columnKey": "OutputItemReceiverName",
							"visible": true,
							"index": 8,
							"width": "20rem"
						},
						{
							"columnKey": "DispatchTime",
							"visible": true,
							"index": 9,
							"width": "19.07rem"
						},
						{
							"columnKey": "LastChangeDateTime",
							"visible": true,
							"index": 10,
							"width": "9.32rem"
						},
						{
							"columnKey": "CreationDate",
							"visible": true,
							"index": 11,
							"width": "5.48rem"
						},
						{
							"columnKey": "OutputRequestItemUUID",
							"width": "9rem",
							"visible": false,
							"index": 12
						},
						{
							"columnKey": "OutputItemRecipientRoleDesc",
							"width": "20rem",
							"visible": false,
							"index": 13
						},
						{
							"columnKey": "PrintQueue",
							"width": "14.79rem",
							"visible": false,
							"index": 14
						},
						{
							"columnKey": "SenderOrganizationalCenterDesc",
							"width": "20rem",
							"visible": false,
							"index": 15
						},
						{
							"columnKey": "SenderOrganizationalCenterType",
							"width": "20rem",
							"visible": false,
							"index": 16
						},
						{
							"columnKey": "SenderOrganizationalUnitDesc",
							"width": "20rem",
							"visible": false,
							"index": 17
						},
						{
							"columnKey": "SenderOrganizationalUnitType",
							"width": "20rem",
							"visible": false,
							"index": 18
						},
						{
							"columnKey": "IsChangeDocument",
							"width": "6.36rem",
							"visible": false,
							"index": 19
						}
					]
				}
			};

		// Act
		oUnion = this.oColumnsController.getUnionData(oControlDataInitial, oRuntimeData);

		// Assert
		assert.deepEqual(
				oUnion.columns.columnsItems.map(fnColumnMapper),
				oUnionReference.columns.columnsItems.map(fnColumnMapper
		), "The result does not contain any duplicated indexes.");

		// Clear
		oUnion = null;
		oControlDataInitial = null;
		oRuntimeData = null;
	});

	QUnit.test("getUnionData should not return columns with duplicated IDs", function(assert) {
		// Arrange
		var oUnion,
			oControlDataInitial = {
				"columns": {
					"columnsItems": [
						{
							"columnKey": "SupplierInvoiceItem",
							"index": 0,
							"visible": true,
							"width": "6.08rem"
						},
						{
							"columnKey": "PurchaseOrderItemText",
							"index": 1,
							"visible": true,
							"width": "16.14rem"
						},
						{
							"columnKey": "PurchaseOrder",
							"index": 2,
							"visible": true,
							"width": "20rem"
						},
						{
							"columnKey": "PurchaseOrderNumber",
							"index": 3,
							"visible": false,
							"width": "9.19rem"
						},
						{
							"columnKey": "PurchaseOrderItem",
							"index": 4,
							"visible": false,
							"width": "7.84rem"
						},
						{
							"columnKey": "Amount",
							"index": 5,
							"visible": true,
							"width": "13.51rem"
						},
						{
							"columnKey": "Quantity",
							"index": 6,
							"visible": true,
							"width": "13.75rem"
						},
						{
							"columnKey": "TaxCode",
							"index": 7,
							"visible": true,
							"width": "4.9rem"
						}
					],
					"showDetails": false
				}
			},
			oRuntimeData = {
				"columns": {
					"columnsItems": [
						{
							"columnKey": "SupplierInvoiceItem",
							"visible": true,
							"index": 0,
							"width": "6.08rem"
						},
						{
							"columnKey": "PurchaseOrderItemText",
							"visible": true,
							"index": 1,
							"width": "16.14rem"
						},
						{
							"columnKey": "PurchaseOrder",
							"visible": true,
							"index": 2,
							"width": "20rem"
						},
						{
							"columnKey": "Amount",
							"visible": true,
							"index": 3,
							"width": "13.51rem"
						},
						{
							"columnKey": "Quantity",
							"visible": true,
							"index": 4,
							"width": "13.75rem"
						},
						{
							"columnKey": "TaxCode",
							"visible": true,
							"index": 5,
							"width": "4.9rem"
						}
					]
				}
			},
			oUnionReference = {
				"columns": {
					"columnsItems": [
						{
							"columnKey": "SupplierInvoiceItem",
							"visible": true,
							"index": 0,
							"width": "6.08rem"
						},
						{
							"columnKey": "PurchaseOrderItemText",
							"visible": true,
							"index": 1,
							"width": "16.14rem"
						},
						{
							"columnKey": "PurchaseOrder",
							"visible": true,
							"index": 2,
							"width": "20rem"
						},
						{
							"columnKey": "Amount",
							"visible": true,
							"index": 3,
							"width": "13.51rem"
						},
						{
							"columnKey": "PurchaseOrderNumber",
							"index": 4,
							"visible": false,
							"width": "9.19rem"
						},
						{
							"columnKey": "Quantity",
							"visible": true,
							"index": 5,
							"width": "13.75rem"
						},
						{
							"columnKey": "PurchaseOrderItem",
							"index": 6,
							"visible": false,
							"width": "7.84rem"
						},
						{
							"columnKey": "TaxCode",
							"visible": true,
							"index": 7,
							"width": "4.9rem"
						}
					],
					"showDetails": false
				}
			},
			oUnionReferenceWithDuplicates = {
				"columns": {
					"columnsItems": [
						{
							"columnKey": "SupplierInvoiceItem",
							"visible": true,
							"index": 0,
							"width": "6.08rem"
						},
						{
							"columnKey": "PurchaseOrderItemText",
							"visible": true,
							"index": 1,
							"width": "16.14rem"
						},
						{
							"columnKey": "PurchaseOrder",
							"visible": true,
							"index": 2,
							"width": "20rem"
						},
						{
							"columnKey": "Amount",
							"visible": true,
							"index": 3,
							"width": "13.51rem"
						},
						{
							"columnKey": "PurchaseOrderNumber",
							"index": 4,
							"visible": false,
							"width": "9.19rem"
						},
						{
							"columnKey": "Quantity",
							"visible": true,
							"index": 5,
							"width": "13.75rem"
						},
						{
							"columnKey": "PurchaseOrderItem",
							"index": 4,
							"visible": false,
							"width": "7.84rem"
						},
						{
							"columnKey": "TaxCode",
							"visible": true,
							"index": 5,
							"width": "4.9rem"
						}
					],
					"showDetails": false
				}
			};

		// Act
		oUnion = this.oColumnsController.getUnionData(oControlDataInitial, oRuntimeData);

		// Assert
		assert.deepEqual(
				oUnion.columns.columnsItems.map(fnColumnMapper),
				oUnionReference.columns.columnsItems.map(fnColumnMapper
		), "The result does not contain any duplicated indexes.");

		assert.notDeepEqual(
				oUnion.columns.columnsItems.map(fnColumnMapper),
				oUnionReferenceWithDuplicates.columns.columnsItems.map(fnColumnMapper
		), "The result does not contain any duplicated indexes.");

		// Clear
		oUnion = null;
		oControlDataInitial = null;
		oRuntimeData = null;
	});

	QUnit.test("_transformAdaptationData should not throw exception if reduce data is missing", function(assert) {
		// Arrange
		var oJsonModel = new JSONModel({
				controlData: this.oP13nData,
				controlDataInitial: this.oP13nData,
				transientData: {
					columns: {
						columnsItems: [
							{
								columnKey: "C",
								visible: false, //toggle C to invisible
								index: 4, //swapped  C and D
								width: "30em"
							},
							{
								columnKey: "D",
								visible: true, //toggle D to visible
								index: 7, //swapped  C and D
								width: "30em"
							},
							{
								columnKey: "E",
								visible: false,
								index: 3,
								width: "30em"
							}
						]
					}
				}
			}),
			oTransientData,
			oAdaptationItem;

		this.oColumnsController.setStableColumnKeys(["A", "B"]);
		this.oColumnsController.setModel(oJsonModel,"$sapuicomppersonalizationBaseController");
		oTransientData = this.oColumnsController.getTransientData();

		// Act
		oAdaptationItem = this.oColumnsController._transformAdaptationData(undefined, oTransientData);

		// Assert
		assert.ok("No exception is thrown");
		assert.notEqual(oAdaptationItem, undefined, "Adaptation item is ok.");

		// Clear
		oAdaptationItem = null;
	});
});
