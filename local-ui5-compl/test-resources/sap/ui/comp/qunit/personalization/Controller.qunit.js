/* global QUnit, sinon */
sap.ui.define([
	'sap/ui/comp/library',
	'sap/ui/comp/personalization/Controller',
	"sap/ui/qunit/utils/nextUIUpdate",
	'sap/ui/table/Table',
	'sap/ui/table/Column',
	'sap/ui/table/AnalyticalTable',
	'sap/m/Table',
	'sap/m/Column',
	'sap/m/Label',
	'sap/ui/core/library',
	'sap/ui/core/CustomData',
	"sap/ui/qunit/QUnitUtils",
	'sap/ui/table/Table',
	'sap/m/MessageStrip',
	'sap/ui/comp/smartfilterbar/FilterProvider',
	'sap/m/p13n/FilterPanel',
	'sap/m/p13n/BasePanel',
	'sap/ui/comp/personalization/Util'
], function(
	compLibrary,
	Controller,
	nextUIUpdate,
	UiTable,
	UiColumn,
	AnalyticalTable,
	MTable,
	MColumn,
	Label,
	coreLibrary,
	CustomData,
	QUnitUtils,
	Table,
	MessageStrip,
	FilterProvider,
	MDCFilterPanel,
	BasePanel,
	Util
) {
	'use strict';

	var fnConstructor01 = function(assert, oController) {
		// ColumnKeys: []
		// Table:      []
		// Ignore:     [] + []

		// assert
		assert.ok(oController.getTable());
		assert.ok(oController.getColumnMap(), "ColumnMap is exposed via getter");
		assert.ok(oController.getSetting());

		assert.strictEqual(Object.keys(oController._getControllers()).length, 2);
		assert.ok(oController._getControllers()["columns"]);
		assert.ok(oController._getControllers()["sort"]);

		var aDataNames = Object.keys(oController._getInternalModel().getData());
		assert.strictEqual(Object.keys(aDataNames).length, 12);

		[
			"controlDataInitial", "controlDataBase", "ignoreData", "controlData", "alreadyKnownRuntimeData", "alreadyKnownPersistentData"
		].forEach(function(sDataName) {
			assert.ok(oController._getInternalModelData(sDataName));
			assert.strictEqual(oController._getInternalModelData(sDataName)["columns"]["columnsItems"].length, 0);
			assert.strictEqual(oController._getInternalModelData(sDataName)["sort"]["sortItems"].length, 0);
		});

		[
			"controlDataReduce", "transientData", "beforeOpenData", "variantDataInitial"
		].forEach(function(sDataName) {
			assert.equal(oController._getInternalModelData(sDataName), undefined);
		});

		[
			"persistentDataChangeType", "persistentDeltaDataChangeType"
		].forEach(function(sDataName) {
			assert.equal(oController._getInternalModelData(sDataName)["columns"], compLibrary.personalization.ChangeType.Unchanged);
			assert.equal(oController._getInternalModelData(sDataName)["sort"], compLibrary.personalization.ChangeType.Unchanged);
		});

		assert.equal(oController._getVariantData(), undefined);
	};

	// --------------------------- TESTS -------------------------------------------------
	QUnit.module("sap.ui.comp.personalization.Controller: constructor", {
		afterEach: function() {
			this.oTable.destroy();
			this.oController.destroy();
		}
	});
	QUnit.test("with empty UITable; Show table", async function(assert) {
		this.oController = new Controller({
			table: this.oTable = new UiTable(),
			setting: {
				columns: {
					visible: true
				},
				sort: {
					visible: true
				},
				filter: {
					visible: false
				},
				group: {
					visible: false
				}
			}
		});

		this.oTable.placeAt("qunit-fixture");
		await nextUIUpdate();

		fnConstructor01(assert, this.oController);
	});
	QUnit.test("with empty MTable", function(assert) {
		this.oController = new Controller({
			table: this.oTable = new MTable(),
			setting: {
				columns: {
					visible: true
				},
				sort: {
					visible: true
				},
				filter: {
					visible: false
				},
				group: {
					visible: false
				}
			}
		});

		fnConstructor01(assert, this.oController);
	});

	var fnConstructor02 = function(assert, oController) {
		// ColumnKeys: []
		// Table:      [a, b]
		// Ignore:     [] + []

		// assert
		assert.ok(oController.getTable());
		assert.ok(oController.getSetting());

		assert.strictEqual(Object.keys(oController._getControllers()).length, 2);
		assert.ok(oController._getControllers()["columns"]);
		assert.ok(oController._getControllers()["sort"]);

		var aDataNames = Object.keys(oController._getInternalModel().getData());
		assert.strictEqual(Object.keys(aDataNames).length, 12);

		[
			"controlDataInitial", "controlDataBase", "alreadyKnownRuntimeData", "alreadyKnownPersistentData", "controlData"
		].forEach(function(sDataName) {
			assert.ok(oController._getInternalModelData(sDataName));
			assert.strictEqual(Object.keys(oController._getInternalModelData(sDataName)).length, 2, "columns and sort");
			assert.strictEqual(oController._getInternalModelData(sDataName)["columns"]["columnsItems"].length, 2);
			assert.strictEqual(oController._getInternalModelData(sDataName)["sort"]["sortItems"].length, 0);
		});

		[
			"ignoreData"
		].forEach(function(sDataName) {
			assert.ok(oController._getInternalModelData(sDataName));
			assert.strictEqual(Object.keys(oController._getInternalModelData(sDataName)).length, 2, "columns and sort");
			assert.strictEqual(oController._getInternalModelData(sDataName)["columns"]["columnsItems"].length, 0);
			assert.strictEqual(oController._getInternalModelData(sDataName)["sort"]["sortItems"].length, 0);
		});

		[
			"controlDataReduce", "transientData", "beforeOpenData", "variantDataInitial"
		].forEach(function(sDataName) {
			assert.equal(oController._getInternalModelData(sDataName), undefined);
		});
		assert.equal(oController._getVariantData(), undefined);
	};

	QUnit.test("with UITable and setting", function(assert) {
		this.oController = new Controller({
			table: this.oTable = new UiTable({
				columns: [
					new UiColumn({
						sortProperty: 'a',
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
					}), new UiColumn({
						sortProperty: 'b',
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
					})
				]
			}),
			setting: {
				columns: {
					visible: true
				},
				sort: {
					visible: true
				},
				filter: {
					visible: false
				},
				group: {
					visible: false
				}
			}
		});

		fnConstructor02(assert, this.oController);
	});
	QUnit.test("with MTable and setting; Show table", async function(assert) {
		this.oController = new Controller({
			table: this.oTable = new MTable({
				columns: [
					new MColumn({
						header: new Label({
							text: "A"
						}),
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'a',
								sortProperty: 'a'
							}
						})
					}), new MColumn({
						header: new Label({
							text: "B"
						}),
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'b',
								sortProperty: 'b'
							}
						})
					})
				]
			}),
			setting: {
				columns: {
					visible: true
				},
				sort: {
					visible: true
				},
				filter: {
					visible: false
				},
				group: {
					visible: false
				}
			}
		});

		this.oTable.placeAt("qunit-fixture");
		await nextUIUpdate();

		fnConstructor02(assert, this.oController);
	});
	QUnit.test("with setting and UITable; Show table", async function(assert) {
		this.oController = new Controller({
			setting: {
				columns: {
					visible: true
				},
				sort: {
					visible: true
				},
				filter: {
					visible: false
				},
				group: {
					visible: false
				}
			},
			table: this.oTable = new UiTable({
				columns: [
					new UiColumn({
						sortProperty: 'a',
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
					}), new UiColumn({
						sortProperty: 'b',
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
					})
				]
			})
		});

		this.oTable.placeAt("qunit-fixture");
		await nextUIUpdate();

		fnConstructor02(assert, this.oController);
	});
	QUnit.test("with setting and MTable", function(assert) {
		this.oController = new Controller({
			setting: {
				columns: {
					visible: true
				},
				sort: {
					visible: true
				},
				filter: {
					visible: false
				},
				group: {
					visible: false
				}
			},
			table: this.oTable = new MTable({
				columns: [
					new MColumn({
						header: new Label({
							text: "A"
						}),
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'a',
								sortProperty: 'a'
							}
						})
					}), new MColumn({
						header: new Label({
							text: "B"
						}),
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'b',
								sortProperty: 'b'
							}
						})
					})
				]
			})
		});

		fnConstructor02(assert, this.oController);
	});

	QUnit.test("with 'setting' of ignore invisible column and UITable", function(assert) {
		this.oController = new Controller({
			setting: {
				columns: {
					visible: true,
					ignoreColumnKeys: [
						"b"
					]
				},
				sort: {
					visible: true
				},
				filter: {
					visible: false
				},
				group: {
					visible: false
				}
			},
			table: this.oTable = new UiTable({
				columns: [
					new UiColumn({
						visible: true,
						sortProperty: 'a',
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
					}), new UiColumn({
						visible: false,
						sortProperty: 'b',
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
					})
				]
			})
		});

		fnConstructor03(assert, this.oController);
	});
	QUnit.test("with 'setting' of ignore invisible column and MTable; Show table", async function(assert) {
		this.oController = new Controller({
			setting: {
				columns: {
					visible: true,
					ignoreColumnKeys: [
						"b"
					]
				},
				sort: {
					visible: true
				},
				filter: {
					visible: false
				},
				group: {
					visible: false
				}
			},
			table: this.oTable = new MTable({
				columns: [
					new MColumn({
						visible: true,
						header: new Label({
							text: "A"
						}),
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'a',
								sortProperty: 'a'
							}
						})
					}), new MColumn({
						visible: false,
						header: new Label({
							text: "B"
						}),
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'b',
								sortProperty: 'b'
							}
						})
					})
				]
			})
		});

		this.oTable.placeAt("qunit-fixture");
		await nextUIUpdate();

		fnConstructor03(assert, this.oController);
	});
	var fnConstructor03 = function(assert, oController) {
		// ColumnKeys:      []
		// Table:           [a, b]
		//
		// Ignore Columns:  [b] + []
		// Ignore Sort:     [] + []

		// assert
		//				assert.strictEqual(oController.getTable().$().find(".sapUiTableCol").length, 1, "1 visible column");
		assert.ok(oController.getTable());
		assert.ok(oController.getSetting());

		assert.strictEqual(Object.keys(oController._getControllers()).length, 2);
		assert.ok(oController._getControllers()["columns"]);
		assert.ok(oController._getControllers()["sort"]);

		var aDataNames = Object.keys(oController._getInternalModel().getData());
		assert.strictEqual(Object.keys(aDataNames).length, 12);

		[
			"controlDataInitial", "controlDataBase", "alreadyKnownRuntimeData", "alreadyKnownPersistentData", "controlData"
		].forEach(function(sDataName) {
			assert.ok(oController._getInternalModelData(sDataName));
			assert.strictEqual(Object.keys(oController._getInternalModelData(sDataName)).length, 2, "columns and sort");
			assert.strictEqual(oController._getInternalModelData(sDataName)["columns"]["columnsItems"].length, 2);
			assert.strictEqual(oController._getInternalModelData(sDataName)["sort"]["sortItems"].length, 0);
		});

		assert.ok(oController._getIgnoreData());
		assert.strictEqual(Object.keys(oController._getIgnoreData()).length, 2, "columns and sort");
		assert.strictEqual(oController._getIgnoreData()["columns"]["columnsItems"].length, 1);
		assert.strictEqual(oController._getIgnoreData()["columns"]["columnsItems"][0].columnKey, "b");
		assert.strictEqual(oController._getIgnoreData()["sort"]["sortItems"].length, 0);

		[
			"controlDataReduce", "transientData", "beforeOpenData", "variantDataInitial"
		].forEach(function(sDataName) {
			assert.equal(oController._getInternalModelData(sDataName), undefined);
		});

		assert.equal(oController._getVariantData(), undefined);
	};
	QUnit.test("with 'setting', 'columnKeys' and UITable; Show table", async function(assert) {
		this.oController = new Controller({
			setting: {
				columns: {
					visible: true
				},
				sort: {
					visible: true
				},
				filter: {
					visible: false
				},
				group: {
					visible: false
				}
			},
			columnKeys: [
				"a", "b"
			],
			table: this.oTable = new UiTable({
				columns: [
					new UiColumn({
						sortProperty: 'b',
						/** @deprecated As of version 1.120 */
						sorted: true,
						sortOrder: coreLibrary.SortOrder.Ascending,
						label: new Label({
							text: "B"
						}),
						template: new Label({
							text: "column B"
						}),
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'b'
							}
						})
					}), new UiColumn({
						sortProperty: 'a',
						label: new Label({
							text: "A"
						}),
						template: new Label({
							text: "column A"
						}),
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'a'
							}
						})
					})
				]
			})
		});

		this.oTable.placeAt("qunit-fixture");
		await nextUIUpdate();

		fnConstructor04(assert, this.oController);
	});
	var fnConstructor04 = function(assert, oController) {
		// ColumnKeys: [a, b]
		// Table:      [b, a]
		// Ignore:     [] + []
		// Result of Table: [a, b]

		// assert
		var aDataNames = Object.keys(oController._getInternalModel().getData());
		assert.strictEqual(Object.keys(aDataNames).length, 12);

		[
			"controlDataInitial", "controlDataBase", "alreadyKnownRuntimeData", "alreadyKnownPersistentData", "controlData"
		].forEach(function(sDataName) {
			assert.ok(oController._getInternalModelData(sDataName));
			assert.strictEqual(Object.keys(oController._getInternalModelData(sDataName)).length, 2, "columns and sort");
			assert.strictEqual(oController._getInternalModelData(sDataName)["columns"]["columnsItems"].length, 2);
			assert.strictEqual(oController._getInternalModelData(sDataName)["columns"]["columnsItems"][0].columnKey, "a");
			assert.strictEqual(oController._getInternalModelData(sDataName)["columns"]["columnsItems"][0].index, 0);
			assert.strictEqual(oController._getInternalModelData(sDataName)["columns"]["columnsItems"][1].columnKey, "b");
			assert.strictEqual(oController._getInternalModelData(sDataName)["columns"]["columnsItems"][1].index, 1);
			assert.strictEqual(oController._getInternalModelData(sDataName)["sort"]["sortItems"].length, 1);
			assert.strictEqual(oController._getInternalModelData(sDataName)["sort"]["sortItems"][0].columnKey, "b");
			assert.strictEqual(oController._getInternalModelData(sDataName)["sort"]["sortItems"][0].operation, coreLibrary.SortOrder.Ascending);
		});

		[
			"ignoreData"
		].forEach(function(sDataName) {
			assert.ok(oController._getInternalModelData(sDataName));
			assert.strictEqual(Object.keys(oController._getInternalModelData(sDataName)).length, 2, "columns and sort");
			assert.strictEqual(oController._getInternalModelData(sDataName)["columns"]["columnsItems"].length, 0);
			assert.strictEqual(oController._getInternalModelData(sDataName)["sort"]["sortItems"].length, 0);
		});

		[
			"controlDataReduce", "transientData", "beforeOpenData", "variantDataInitial"
		].forEach(function(sDataName) {
			assert.equal(oController._getInternalModelData(sDataName), undefined);
		});

		assert.equal(oController._getVariantData(), undefined);
	};

	QUnit.test("with 'setting', 'columnKeys' and UITable: 'columnKeys' - 2 lazy columns", function(assert) {
		this.oController = new Controller({
			setting: {
				columns: {
					visible: true
				},
				sort: {
					visible: true
				},
				filter: {
					visible: false
				},
				group: {
					visible: false
				}
			},
			columnKeys: [
				"pre", "a", "b", "post"
			],
			table: this.oTable = new UiTable({
				columns: [
					new UiColumn({
						sortProperty: 'a',
						/** @deprecated As of version 1.120 */
						sorted: true,
						sortOrder: coreLibrary.SortOrder.Ascending,
						label: new Label({
							text: "A"
						}),
						template: new Label({
							text: "column A"
						}),
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'a'
							}
						})
					}), new UiColumn({
						sortProperty: 'b',
						/** @deprecated As of version 1.120 */
						sorted: true,
						sortOrder: coreLibrary.SortOrder.Ascending,
						label: new Label({
							text: "B"
						}),
						template: new Label({
							text: "column B"
						}),
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'b'
							}
						})
					})
				]
			})
		});

		fnConstructor05(assert, this.oController);
	});
	var fnConstructor05 = function(assert, oController) {
		// ColumnKeys: [pre, a, b, post]
		// ColumnMap:  [a, b]

		// assert
		var aDataNames = Object.keys(oController._getInternalModel().getData());
		assert.strictEqual(Object.keys(aDataNames).length, 12);

		[
			"controlDataInitial", "controlDataBase", "alreadyKnownRuntimeData", "alreadyKnownPersistentData", "controlData"
		].forEach(function(sDataName) {
			assert.ok(oController._getInternalModelData(sDataName));
			assert.strictEqual(Object.keys(oController._getInternalModelData(sDataName)).length, 2, "columns and sort");
			assert.strictEqual(oController._getInternalModelData(sDataName)["columns"]["columnsItems"].length, 2, "Fill only existing columns first");
			assert.strictEqual(oController._getInternalModelData(sDataName)["sort"]["sortItems"].length, 2, "Fill only existing sort first");

			assert.strictEqual(oController._getInternalModelData(sDataName)["columns"]["columnsItems"][0].columnKey, "a");
			assert.strictEqual(oController._getInternalModelData(sDataName)["columns"]["columnsItems"][1].columnKey, "b");
			assert.strictEqual(oController._getInternalModelData(sDataName)["columns"]["columnsItems"][0].index, 1);
			assert.strictEqual(oController._getInternalModelData(sDataName)["columns"]["columnsItems"][1].index, 2);
			assert.strictEqual(oController._getInternalModelData(sDataName)["sort"]["sortItems"][0].columnKey, "a");
			assert.strictEqual(oController._getInternalModelData(sDataName)["sort"]["sortItems"][1].columnKey, "b");
		});

		[
			"ignoreData"
		].forEach(function(sDataName) {
			assert.ok(oController._getInternalModelData(sDataName));
			assert.strictEqual(Object.keys(oController._getInternalModelData(sDataName)).length, 2, "columns and sort");
			assert.strictEqual(oController._getInternalModelData(sDataName)["columns"]["columnsItems"].length, 0);
			assert.strictEqual(oController._getInternalModelData(sDataName)["sort"]["sortItems"].length, 0);
		});

		[
			"controlDataReduce", "transientData", "beforeOpenData", "variantDataInitial"
		].forEach(function(sDataName) {
			assert.equal(oController._getInternalModelData(sDataName), undefined);
		});

		assert.equal(oController._getVariantData(), undefined);
	};
	QUnit.test("UITable: 'columnKeys' - 2 lazy and 1 ignore columns", async function(assert) {
		this.oController = new Controller({
			setting: {
				columns: {
					visible: true,
					ignoreColumnKeys: [
						"post"
					]
				},
				sort: {
					visible: false
				},
				filter: {
					visible: false
				},
				group: {
					visible: false
				}
			},
			columnKeys: [
				"pre", "a", "b", "post"
			],
			table: this.oTable = new UiTable({
				columns: [
					new UiColumn({
						label: new Label({
							text: "A"
						}),
						template: new Label({
							text: "column A"
						}),
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'a'
							}
						})
					}), new UiColumn({
						label: new Label({
							text: "B"
						}),
						template: new Label({
							text: "column B"
						}),
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'b'
							}
						})
					})
				]
			})
		});

		this.oTable.placeAt("qunit-fixture");
		await nextUIUpdate();

		fnConstructor06(assert, this.oController);
	});
	QUnit.test("MTable: 'columnKeys' - 2 lazy and 1 ignore columns", function(assert) {
		this.oController = new Controller({
			setting: {
				columns: {
					visible: true,
					ignoreColumnKeys: [
						"post"
					]
				},
				sort: {
					visible: false
				},
				filter: {
					visible: false
				},
				group: {
					visible: false
				}
			},
			columnKeys: [
				"pre", "a", "b", "post"
			],
			table: this.oTable = new MTable({
				columns: [
					new MColumn({
						visible: true,
						header: new Label({
							text: "A"
						}),
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'a'
							}
						})
					}), new MColumn({
						visible: true,
						header: new Label({
							text: "B"
						}),
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'b'
							}
						})
					})
				]
			})
		});

		fnConstructor06(assert, this.oController);
	});
	var fnConstructor06 = function(assert, oController) {
		// ColumnKeys:     [pre, a, b, post]
		// Table:          [a, b]
		//
		// Ignore Columns: [post]
		// Ignore Sort:    []

		// assert
		var aDataNames = Object.keys(oController._getInternalModel().getData());
		assert.strictEqual(Object.keys(aDataNames).length, 12);

		[
			"controlDataInitial", "controlDataBase", "alreadyKnownRuntimeData", "alreadyKnownPersistentData", "controlData"
		].forEach(function(sDataName) {
			assert.ok(oController._getInternalModelData(sDataName));
			assert.strictEqual(Object.keys(oController._getInternalModelData(sDataName)).length, 1, "columns");
			assert.strictEqual(oController._getInternalModelData(sDataName)["columns"]["columnsItems"].length, 2);
			assert.strictEqual(oController._getControlDataInitial()["columns"]["columnsItems"][0].columnKey, "a");
			assert.strictEqual(oController._getControlDataInitial()["columns"]["columnsItems"][1].columnKey, "b");
			assert.strictEqual(oController._getControlDataInitial()["columns"]["columnsItems"][0].index, 1);
			assert.strictEqual(oController._getControlDataInitial()["columns"]["columnsItems"][1].index, 2);
		});

		assert.ok(oController._getIgnoreData());
		assert.strictEqual(Object.keys(oController._getIgnoreData()).length, 1);
		assert.strictEqual(oController._getIgnoreData()["columns"]["columnsItems"].length, 1);
		assert.strictEqual(oController._getIgnoreData()["columns"]["columnsItems"][0].columnKey, "post");

		[
			"controlDataReduce", "transientData", "beforeOpenData", "variantDataInitial"
		].forEach(function(sDataName) {
			assert.equal(oController._getInternalModelData(sDataName), undefined);
		});

		assert.equal(oController._getVariantData(), undefined);
	};

	QUnit.module("sap.ui.comp.personalization.Controller: constructor",      {
		afterEach: function() {
			this.oTable.destroy();
		}
	});
	QUnit.test("UITable: setting with ignore visible", function(assert) {
		var bExceptionRaised = false;
		try {
			var oController = new Controller({
				setting: {
					columns: {
						visible: true,
						ignoreColumnKeys: [
							"b"
						]
					},
					sort: {
						visible: false
					},
					filter: {
						visible: false
					},
					group: {
						visible: false
					}
				},
				table: this.oTable = new UiTable({
					columns: [
						new UiColumn({
							visible: true,
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
						}), new UiColumn({
							visible: true,
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
						})
					]
				})
			});
			oController.destroy();
		} catch (oError) {
			bExceptionRaised = true;
		}
		assert.ok(bExceptionRaised);
	});
	QUnit.test("MTable: setting with ignore visible)", function(assert) {
		var bExceptionRaised = false;
		try {
			var oController = new Controller({
				setting: {
					columns: {
						visible: true,
						ignoreColumnKeys: [
							"b"
						]
					},
					sort: {
						visible: false
					},
					filter: {
						visible: false
					},
					group: {
						visible: false
					}
				},
				table: this.oTable = new MTable({
					columns: [
						new MColumn({
							visible: true,
							header: new Label({
								text: "A"
							}),
							customData: new CustomData({
								key: "p13nData",
								value: {
									columnKey: 'a'
								}
							})
						}), new MColumn({
							visible: true,
							header: new Label({
								text: "B"
							}),
							customData: new CustomData({
								key: "p13nData",
								value: {
									columnKey: 'b'
								}
							})
						})
					]
				})
			});
			oController.destroy();
		} catch (oError) {
			bExceptionRaised = true;
		}
		assert.ok(bExceptionRaised);
	});

	QUnit.module("sap.ui.comp.personalization.Controller: addToSettingIgnoreColumnKeys", {
		beforeEach: function() {
			this.oTable = null;
			this.oController = null;
		},
		afterEach: function() {
			this.oTable.destroy();
			this.oController.destroy();
		}
	});
	QUnit.test("UITable: de-activate a visible column", async function(assert) {
		this.oController = new Controller({
			table: this.oTable = new UiTable({
				columns: [
					new UiColumn({
						label: new Label({
							text: "A"
						}),
						template: new Label({
							text: "column A"
						}),
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'a'
							}
						})
					}), new UiColumn({
						label: new Label({
							text: "B"
						}),
						template: new Label({
							text: "column B"
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
			setting: {
				columns: {
					visible: true
				},
				sort: {
					visible: false
				},
				filter: {
					visible: false
				},
				group: {
					visible: false
				}
			}
		});

		this.oTable.placeAt("qunit-fixture");
		await nextUIUpdate();

		//				assert.strictEqual(this.oTable.$().find("thead").find("th").find("span").length, 2, "2 visible columns");

		fnTest04(assert, this.oController);
	});
	QUnit.test("MTable: de-activate a visible column", function(assert) {
		this.oController = new Controller({
			table: this.oTable = new MTable({
				columns: [
					new MColumn({
						header: new Label({
							text: "A"
						}),
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'a'
							}
						})
					}), new MColumn({
						header: new Label({
							text: "B"
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
			setting: {
				columns: {
					visible: true
				},
				sort: {
					visible: false
				},
				filter: {
					visible: false
				},
				group: {
					visible: false
				}
			}
		});

		//				assert.strictEqual(this.oTable.$().find("thead").find("th").find("span").length, 2, "2 visible columns");

		fnTest04(assert, this.oController);

		//				assert.strictEqual(this.oTable.$().find("thead").find("th").find("span").length, 1, "1 visible column");
	});
	var fnTest04 = function(assert, oController) {

		var fnfireAfterP13nModelDataChangeSpy = sinon.spy(oController, "fireAfterP13nModelDataChange");

		// act
		oController.addToSettingIgnoreColumnKeys([
			"a"
		]);

		// ColumnKeys: []
		// Table:      [^a, ^b]
		// Ignore:     [] + [a]

		// assert
		assert.ok(fnfireAfterP13nModelDataChangeSpy.calledOnce);

		assert.strictEqual(Object.keys(oController._getControllers()).length, 1);
		assert.ok(oController._getControllers()["columns"]);

		[
			"controlDataInitial", "controlDataBase"
		].forEach(function(sDataName) {
			assert.ok(oController._getInternalModelData(sDataName));
			assert.strictEqual(Object.keys(oController._getInternalModelData(sDataName)).length, 1, "columns");
			assert.strictEqual(oController._getInternalModelData(sDataName)["columns"]["columnsItems"].length, 2);
			assert.strictEqual(oController._getInternalModelData(sDataName)["columns"]["columnsItems"][0].columnKey, "a");
			assert.strictEqual(oController._getInternalModelData(sDataName)["columns"]["columnsItems"][1].columnKey, "b");
			assert.strictEqual(oController._getInternalModelData(sDataName)["columns"]["columnsItems"][0].index, 0);
			assert.strictEqual(oController._getInternalModelData(sDataName)["columns"]["columnsItems"][1].index, 1);
			assert.strictEqual(oController._getInternalModelData(sDataName)["columns"]["columnsItems"][0].visible, true);
			assert.strictEqual(oController._getInternalModelData(sDataName)["columns"]["columnsItems"][1].visible, true);
		});

		assert.ok(oController._getAlreadyKnownRuntimeData());
		assert.strictEqual(Object.keys(oController._getAlreadyKnownRuntimeData()).length, 1, "columns");
		assert.strictEqual(oController._getAlreadyKnownRuntimeData()["columns"]["columnsItems"].length, 2);
		assert.strictEqual(oController._getAlreadyKnownRuntimeData()["columns"]["columnsItems"][0].columnKey, "a");
		assert.strictEqual(oController._getAlreadyKnownRuntimeData()["columns"]["columnsItems"][1].columnKey, "b");
		assert.strictEqual(oController._getAlreadyKnownRuntimeData()["columns"]["columnsItems"][0].index, 0);
		assert.strictEqual(oController._getAlreadyKnownRuntimeData()["columns"]["columnsItems"][1].index, 1);
		assert.strictEqual(oController._getAlreadyKnownRuntimeData()["columns"]["columnsItems"][0].visible, false);
		assert.strictEqual(oController._getAlreadyKnownRuntimeData()["columns"]["columnsItems"][1].visible, true);

		assert.strictEqual(Object.keys(oController._getIgnoreData()).length, 1);
		assert.strictEqual(oController._getIgnoreData()["columns"]["columnsItems"].length, 1);
		assert.strictEqual(oController._getIgnoreData()["columns"]["columnsItems"][0].columnKey, "a");

		assert.strictEqual(Object.keys(oController._getControlData()).length, 1);
		assert.strictEqual(oController._getControlData()["columns"]["columnsItems"].length, 2);
		assert.strictEqual(oController._getControlData()["columns"]["columnsItems"][0].columnKey, "a");
		assert.strictEqual(oController._getControlData()["columns"]["columnsItems"][1].columnKey, "b");
		assert.strictEqual(oController._getControlData()["columns"]["columnsItems"][0].index, 0);
		assert.strictEqual(oController._getControlData()["columns"]["columnsItems"][1].index, 1);
		assert.strictEqual(oController._getControlData()["columns"]["columnsItems"][0].visible, false);
		assert.strictEqual(oController._getControlData()["columns"]["columnsItems"][1].visible, true);

		[
			"controlDataReduce", "transientData", "beforeOpenData", "variantDataInitial"
		].forEach(function(sDataName) {
			assert.equal(oController._getInternalModelData(sDataName), undefined);
		});

		assert.equal(oController._getVariantData(), undefined);
	};

	QUnit.test("UITable: de-activate a column; ignore column", async function(assert) {
		this.oController = new Controller({
			setting: {
				columns: {
					visible: true,
					ignoreColumnKeys: [
						"post"
					]
				},
				sort: {
					visible: false
				},
				filter: {
					visible: false
				},
				group: {
					visible: false
				}
			},
			columnKeys: [
				"pre", "a", "b", "post"
			],
			table: this.oTable = new UiTable({
				columns: [
					new UiColumn({
						label: new Label({
							text: "A"
						}),
						template: new Label({
							text: "column A"
						}),
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'a'
							}
						})
					}), new UiColumn({
						label: new Label({
							text: "B"
						}),
						template: new Label({
							text: "column B"
						}),
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'b'
							}
						})
					})
				]
			})
		});

		this.oTable.placeAt("qunit-fixture");
		await nextUIUpdate();

		fnTest06(assert, this.oController);
	});
	var fnTest06 = function(assert, oController) {
		// ColumnKeys: [pre, a, b, post]
		// Table:      [a, b]
		//
		// Ignore:     [post] + [a]

		var fnfireAfterP13nModelDataChangeSpy = sinon.spy(oController, "fireAfterP13nModelDataChange");

		// act
		oController.addToSettingIgnoreColumnKeys([
			"a"
		]);

		// assert
		assert.ok(fnfireAfterP13nModelDataChangeSpy.calledOnce);

		[
			"controlDataInitial", "controlDataBase", "alreadyKnownRuntimeData"
		].forEach(function(sDataName) {
			assert.ok(oController._getInternalModelData(sDataName));
			assert.strictEqual(Object.keys(oController._getInternalModelData(sDataName)).length, 1, "columns");
			assert.strictEqual(oController._getInternalModelData(sDataName)["columns"]["columnsItems"].length, 2);
			assert.strictEqual(oController._getInternalModelData(sDataName)["columns"]["columnsItems"][0].columnKey, "a");
			assert.strictEqual(oController._getInternalModelData(sDataName)["columns"]["columnsItems"][1].columnKey, "b");
			assert.strictEqual(oController._getInternalModelData(sDataName)["columns"]["columnsItems"][0].index, 1);
			assert.strictEqual(oController._getInternalModelData(sDataName)["columns"]["columnsItems"][1].index, 2);
		});

		assert.strictEqual(Object.keys(oController._getIgnoreData()).length, 1);
		assert.strictEqual(oController._getIgnoreData()["columns"]["columnsItems"].length, 2);
		assert.strictEqual(oController._getIgnoreData()["columns"]["columnsItems"][0].columnKey, "post");
		assert.strictEqual(oController._getIgnoreData()["columns"]["columnsItems"][1].columnKey, "a");

		assert.strictEqual(Object.keys(oController._getControlData()).length, 1);
		assert.strictEqual(oController._getControlData()["columns"]["columnsItems"].length, 2);
		assert.strictEqual(oController._getControlData()["columns"]["columnsItems"][0].columnKey, "a");
		assert.strictEqual(oController._getControlData()["columns"]["columnsItems"][1].columnKey, "b");
		assert.strictEqual(oController._getControlData()["columns"]["columnsItems"][0].index, 1);
		assert.strictEqual(oController._getControlData()["columns"]["columnsItems"][1].index, 2);
		assert.strictEqual(oController._getControlData()["columns"]["columnsItems"][0].visible, false);
		assert.strictEqual(oController._getControlData()["columns"]["columnsItems"][1].visible, true);

		[
			"controlDataReduce", "transientData", "beforeOpenData", "variantDataInitial"
		].forEach(function(sDataName) {
			assert.equal(oController._getInternalModelData(sDataName), undefined);
		});

		assert.equal(oController._getVariantData(), undefined);
	};

	QUnit.module("sap.ui.comp.personalization.Controller: _controllerFactory", {
		beforeEach: function() {
			this.oTable = null;
			this.oController = null;
		},
		afterEach: function() {
			this.oTable.destroy();
			this.oController.destroy();
		}
	});

	//BCP: 2280121667
	QUnit.test("Firing ColumnsController afterColumnsModelDataChange without the 1st(main) handler", function(assert) {
		var oColumnsController, fnAfterColumnsModelDataChangeHandler, fnFireAfterColumnsModelDataChange, fnSyncTableUi;

		// act
		this.oController = new Controller({
			table: this.oTable = new AnalyticalTable()
		});

		oColumnsController = this.oController._getControllers().columns.controller;
		sinon.stub(oColumnsController, "_applyChangesToUiTableType").callsFake(function() {
			this.fireAfterColumnsModelDataChange();
		}.bind(oColumnsController));

		fnSyncTableUi = sinon.spy(this.oController, "_syncTableUi");
		fnFireAfterColumnsModelDataChange = sinon.spy(oColumnsController, "fireAfterColumnsModelDataChange");

		fnAfterColumnsModelDataChangeHandler = sinon.spy(oColumnsController.mEventRegistry.afterColumnsModelDataChange[0], "fFunction");
		oColumnsController.fireAfterColumnsModelDataChange();

		// assert
		assert.equal(fnSyncTableUi.calledOnce, true, "SyncTableUi should be invoked");
		assert.equal(fnFireAfterColumnsModelDataChange.calledTwice, true, "fnAfterColumnsModelDataChange should be invoked twice");
		assert.equal(fnAfterColumnsModelDataChangeHandler.calledOnce, true, "fnAfterColumnsModelDataChangeHandler should be fired once");
	});

	QUnit.module("sap.ui.comp.personalization.Controller: _createSettingCurrent", {
		beforeEach: function() {
			this.oTable = null;
			this.oController = null;
		},
		afterEach: function() {
			this.oTable.destroy();
			this.oController.destroy();
		}
	});
	QUnit.test("MTable", function(assert) {
		// act
		this.oController = new Controller({
			table: this.oTable = new MTable(),
			setting: {
				sort: {
					visible: false
				}
			}
		});
		// assert
		assert.deepEqual(Object.keys(this.oController._getControllers()), [
			"columns", "filter", "group"
		]);
	});
	QUnit.test("MTable", function(assert) {
		// act
		this.oController = new Controller({
			table: this.oTable = new MTable(),
			setting: {
				group: {
					visible: true
				},
				sort: {
					visible: false
				}
			}
		});
		// assert
		assert.deepEqual(Object.keys(this.oController._getControllers()), [
			"columns", "filter", "group"
		]);
	});
	QUnit.test("MTable", function(assert) {
		// act
		this.oController = new Controller({
			table: this.oTable = new MTable(),
			setting: {
				custom: {
					visible: true,
					controller: {}
				},
				columns: {
					visible: false
				},
				group: {
					visible: true
				},
				filter: {
					visible: false
				}
			}
		});
		// assert
		assert.deepEqual(Object.keys(this.oController._getControllers()), [
			"sort", "group", "custom"
		]);
	});
	QUnit.test("UITable", function(assert) {
		// act
		this.oController = new Controller({
			table: this.oTable = new UiTable(),
			setting: {
				sort: {
					visible: false
				}
			}
		});
		// assert
		assert.deepEqual(Object.keys(this.oController._getControllers()), [
			"columns", "filter", "group"
		]);
	});
	QUnit.test("UITable", function(assert) {
		// act
		this.oController = new Controller({
			table: this.oTable = new UiTable(),
			setting: {
				group: {
					visible: true
				},
				sort: {
					visible: false
				}
			}
		});
		// assert
		assert.deepEqual(Object.keys(this.oController._getControllers()), [
			"columns", "filter", "group"
		]);
	});
	QUnit.test("UITable", function(assert) {
		// act
		this.oController = new Controller({
			table: this.oTable = new UiTable(),
			setting: {
				custom: {
					visible: true,
					controller: {}
				},
				columns: {
					visible: false
				},
				group: {
					visible: true
				},
				filter: {
					visible: false
				}
			}
		});
		// assert
		assert.deepEqual(Object.keys(this.oController._getControllers()), [
			"sort", "group", "custom"
		]);
	});

	QUnit.module("sap.ui.comp.personalization.Controller: text and tooltip", {
		beforeEach: function() {
			this.oTable = null;
			this.oController = null;
		},
		afterEach: function() {
			this.oTable.destroy();
			this.oController.destroy();
		}
	});
	QUnit.test("UITable", function(assert) {
		this.oController = new Controller({
			table: this.oTable = new UiTable({
				columns: [
					new UiColumn({
						sortProperty: 'a',
						label: new Label({
							text: "A"
						}),
						tooltip: 'tA',
						template: new Label({
							text: "row1"
						}),
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'a'
							}
						})
					}), new UiColumn({
						sortProperty: 'b',
						label: new Label({
							text: "B"
						}),
						tooltip: 'tB',
						template: new Label({
							text: "row2"
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
			setting: {
				sort: {
					visible: true
				},
				columns: {
					visible: true
				},
				group: {
					visible: false
				},
				filter: {
					visible: false
				}
			}
		});
		fnTest05(assert, this.oController);
	});
	QUnit.test("MTable", function(assert) {
		// act
		this.oController = new Controller({
			table: this.oTable = new MTable({
				columns: [
					new MColumn({
						header: new Label({
							text: "A",
							tooltip: "tA"
						}),
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'a',
								sortProperty: 'a'
							}
						})
					}), new MColumn({
						header: new Label({
							text: "B",
							tooltip: "tB"
						}),
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'b',
								sortProperty: 'b'
							}
						})
					})
				]
			}),
			setting: {
				sort: {
					visible: true
				},
				columns: {
					visible: true
				},
				group: {
					visible: false
				},
				filter: {
					visible: false
				}
			}
		});
		fnTest05(assert, this.oController);
	});
	var fnTest05 = function(assert, oController) {
		// Columns + Sort
		// ColumnKeys: []
		// Table:      [a, b]
		// Ignore:     [] + []
		var done = assert.async();
		oController.attachDialogAfterOpen(function() {
			// assert
			assert.strictEqual(Object.keys(oController._getControllers()).length, 2);
			assert.strictEqual(oController._getTransientData()["columns"]["columnsItems"].length, 2);
			assert.strictEqual(oController._getTransientData()["columns"]["columnsItems"][0].tooltip, 'tA');
			assert.strictEqual(oController._getTransientData()["columns"]["columnsItems"][1].tooltip, 'tB');

			assert.strictEqual(oController._getTransientData()["sort"]["sortItems"].length, 2);
			assert.strictEqual(oController._getTransientData()["sort"]["sortItems"][0].tooltip, 'tA');
			assert.strictEqual(oController._getTransientData()["sort"]["sortItems"][1].tooltip, 'tB');

			done();
		});
		// act
		oController.openDialog();
	};

	QUnit.module("sap.ui.comp.personalization.Controller: initial sorting", {
		beforeEach: function() {
			this.oTable = null;
			this.oController = null;
		},
		afterEach: function() {
			this.oTable.destroy();
			this.oController.destroy();
		}
	});
	QUnit.test("UITable", function(assert) {
		this.oController = new Controller({
			table: this.oTable = new UiTable({
				columns: [
					new UiColumn({
						sortProperty: 'a',
						/** @deprecated As of version 1.120 */
						sorted: true,
						sortOrder: coreLibrary.SortOrder.Ascending,
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
					}), new UiColumn({
						sortProperty: 'b',
						/** @deprecated As of version 1.120 */
						sorted: true,
						sortOrder: coreLibrary.SortOrder.Ascending,
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
					})
				]
			}),
			setting: {
				sort: {
					visible: true
				},
				columns: {
					visible: true
				},
				group: {
					visible: false
				},
				filter: {
					visible: false
				}
			}
		});

		// assert
		assert.strictEqual(Object.keys(this.oController._getControlDataInitial()).length, 2);
		assert.strictEqual(this.oController._getControlDataInitial()["columns"]["columnsItems"].length, 2);
		assert.strictEqual(this.oController._getControlDataInitial()["columns"]["columnsItems"][0].columnKey, "a");
		assert.strictEqual(this.oController._getControlDataInitial()["columns"]["columnsItems"][1].columnKey, "b");
		assert.strictEqual(this.oController._getControlDataInitial()["sort"]["sortItems"].length, 2);
		assert.strictEqual(this.oController._getControlDataInitial()["sort"]["sortItems"][0].columnKey, "a");
		assert.strictEqual(this.oController._getControlDataInitial()["sort"]["sortItems"][1].columnKey, "b");
	});
	QUnit.test("MTable", function(assert) {
		// act
		this.oController = new Controller({
			table: this.oTable = new MTable({
				columns: [
					new MColumn({
						header: new Label({
							text: "A",
							tooltip: "tA"
						}),
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'a',
								sortProperty: 'a'
							}
						})
					}), new MColumn({
						header: new Label({
							text: "B",
							tooltip: "tB"
						}),
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'b',
								sortProperty: 'b'
							}
						})
					})
				]
			}),
			setting: {
				sort: {
					visible: true
				},
				columns: {
					visible: true
				},
				group: {
					visible: false
				},
				filter: {
					visible: false
				}
			}
		});

		// assert
		assert.strictEqual(Object.keys(this.oController._getControlDataInitial()).length, 2);
		assert.strictEqual(this.oController._getControlDataInitial()["columns"]["columnsItems"].length, 2);
		assert.strictEqual(this.oController._getControlDataInitial()["columns"]["columnsItems"][0].columnKey, "a");
		assert.strictEqual(this.oController._getControlDataInitial()["columns"]["columnsItems"][1].columnKey, "b");
		assert.strictEqual(this.oController._getControlDataInitial()["sort"]["sortItems"].length, 0);
	});

	QUnit.module("sap.ui.comp.personalization.Controller: _fireChangeEvent", {
		beforeEach: function() {
			this.oController = new Controller({
				table: this.oTable = new UiTable({
					columns: [
						new UiColumn({
							sortProperty: 'a',
							/** @deprecated As of version 1.120 */
							sorted: true,
							sortOrder: coreLibrary.SortOrder.Ascending,
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
						}), new UiColumn({
							sortProperty: 'b',
							/** @deprecated As of version 1.120 */
							sorted: true,
							sortOrder: coreLibrary.SortOrder.Ascending,
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
						})
					]
				}),
				setting: {
					sort: {
						visible: true
					},
					columns: {
						visible: true
					},
					group: {
						visible: false
					},
					filter: {
						visible: false
					}
				}
			});
		},
		afterEach: function() {
			this.oTable.destroy();
			this.oController.destroy();
		}
	});
	QUnit.test("with UITable: open dialog and press 'OK'", function(assert) {
		var that = this;
		var done = assert.async();
		var fnFireAfterP13nModelDataChangeSpy = sinon.spy(this.oController, "fireAfterP13nModelDataChange");
		this.oController.attachDialogAfterOpen(function() {
			that.oController._oDialog.attachAfterClose(function() {
				// assert
				assert.equal(fnFireAfterP13nModelDataChangeSpy.callCount, 0);
				done();
			});
			// act: press 'OK'
			QUnitUtils.triggerTouchEvent("tap", that.oController._oDialog.getButtons()[0].getFocusDomRef(), {
				srcControl: that.oController._oDialog
			});
		});
		// act: open dialog
		this.oController.openDialog();
	});
	QUnit.test("with UITable: make change then open dialog and press 'OK'", function(assert) {
		// act: make change
		this.oController.setDataSuiteFormatSnapshot({
			"Visualizations": [
				{
					"Type": "LineItem",
					"Content": [
						{
							"Value": "a"
						}
					]
				}
			]
		});

		var that = this;
		var done = assert.async();
		var fnFireAfterP13nModelDataChangeSpy = sinon.spy(this.oController, "fireAfterP13nModelDataChange");
		this.oController.attachDialogAfterOpen(function() {
			that.oController._oDialog.attachAfterClose(function() {
				// assert
				assert.equal(fnFireAfterP13nModelDataChangeSpy.callCount, 0);
				done();
			});
			// act: press 'OK'
			QUnitUtils.triggerTouchEvent("tap", that.oController._oDialog.getButtons()[0].getFocusDomRef(), {
				srcControl: that.oController._oDialog
			});
		});

		// act: open dialog
		this.oController.openDialog();
	});

	QUnit.test("check 'ColumnWidth' via UIState", function(assert) {
		// act: make change
		this.oController.setDataSuiteFormatSnapshot({
			"Visualizations": [
				{
					"Type": "ColumnWidth",
					"Content": [
						{
							"Value": "a",
							"Width": "10px"
						}
					]
				}
			]
		});

		var aColumns = this.oTable.getColumns();

		assert.equal(aColumns[0].getWidth(), "10px", "The column width has been set to '10px'");

		var oDataSuiteFormat = this.oController.getDataSuiteFormatSnapshot();
		var oColumnWidthSettings = oDataSuiteFormat.Visualizations.find(function(oVisualization){
			return oVisualization["Type"] === "ColumnWidth";
		});
		assert.equal(oColumnWidthSettings["Content"][0].Width, "10px", "Correct width returned");
		assert.equal(oColumnWidthSettings["Content"][0].Value, "a", "Correct value returned");
	});

	QUnit.module("sap.ui.comp.personalization.Controller: _determineResetType in 'VariantManagement' mode", {
		beforeEach: function() {
			this.oController = new Controller({
				resetToInitialTableState: false,
				columnKeys: [
					"a", "b"
				],
				table: this.oTable = new UiTable({
					columns: [
						new UiColumn({
							label: new Label({
								text: "A"
							}),
							template: new Label({
								text: "column A"
							}),
							customData: new CustomData({
								key: "p13nData",
								value: {
									columnKey: 'a'
								}
							})
						}), new UiColumn({
							label: new Label({
								text: "B"
							}),
							template: new Label({
								text: "column B"
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
				setting: {
					columns: {
						visible: true
					},
					sort: {
						visible: false
					},
					filter: {
						visible: false
					},
					group: {
						visible: false
					}
				}
			});
		},
		afterEach: function() {
			this.oTable.destroy();
			this.oController.destroy();
		}
	});
	QUnit.test("UITable: setDataSuiteFormatSnapshot", function(assert) {
		// prepare
		var fnFireAfterP13nModelDataChangeSpy = sinon.spy(this.oController, "fireAfterP13nModelDataChange");

		// act: make change
		this.oController.setDataSuiteFormatSnapshot({
			"Visualizations": [
				{
					"Type": "LineItem",
					"Content": [
						{
							"Value": "a"
						}
					]
				}
			]
		});
		// assert
		assert.ok(fnFireAfterP13nModelDataChangeSpy.calledOnce);
		assert.equal(this.oController._determineResetType(), compLibrary.personalization.ResetType.ResetFull);
	});
	QUnit.test("UITable: set standard variant", function(assert) {
		// prepare
		var fnFireAfterP13nModelDataChangeSpy = sinon.spy(this.oController, "fireAfterP13nModelDataChange");

		// act: set variant and make change
		this.oController.resetPersonalization();

		// assert
		assert.ok(fnFireAfterP13nModelDataChangeSpy.notCalled);
		assert.equal(this.oController._determineResetType(), compLibrary.personalization.ResetType.ResetFull);
	});
	QUnit.test("UITable: set standard variant", function(assert) {
		// prepare
		var fnFireAfterP13nModelDataChangeSpy = sinon.spy(this.oController, "fireAfterP13nModelDataChange");

		// act: set variant and make change
		this.oController.resetPersonalization(compLibrary.personalization.ResetType.ResetFull);

		// assert
		assert.ok(fnFireAfterP13nModelDataChangeSpy.notCalled);
		assert.equal(this.oController._determineResetType(), compLibrary.personalization.ResetType.ResetFull);
	});
	QUnit.test("UITable: set standard variant", function(assert) {
		// prepare
		var fnFireAfterP13nModelDataChangeSpy = sinon.spy(this.oController, "fireAfterP13nModelDataChange");

		// act: set variant and make change
		this.oController.resetPersonalization(compLibrary.personalization.ResetType.ResetPartial);

		// assert
		assert.ok(fnFireAfterP13nModelDataChangeSpy.notCalled);
		assert.equal(this.oController._determineResetType(), compLibrary.personalization.ResetType.ResetFull);
	});

	QUnit.test("UITable: setPersonalizationData", function(assert) {
		// prepare
		var fnFireAfterP13nModelDataChangeSpy = sinon.spy(this.oController, "fireAfterP13nModelDataChange");

		// act: set variant and make change
		this.oController.setPersonalizationData({
			columns: {
				columnsItems: [
					{
						columnKey: "b",
						index: 0
					}
				]
			}
		});

		// assert
		assert.ok(fnFireAfterP13nModelDataChangeSpy.calledOnce);
		assert.equal(this.oController._determineResetType(), compLibrary.personalization.ResetType.ResetPartial);
	});

	QUnit.test("UITable: setPersonalizationData should request missing columns before converting filters", function(assert) {
		// Arrange
		var fnExtendModelStructureSpy = sinon.spy(this.oController, "_extendModelStructure"),
			fnRequestMissingColumnsWithoutIgnoreSpy = sinon.spy(this.oController, "_requestMissingColumnsWithoutIgnore"),
			fnUtilConvertFiltersSpy = sinon.spy(Util, "convertFilters");

		// Act
		this.oController.setPersonalizationData({}, true);

		// Assert
		assert.ok(fnExtendModelStructureSpy.calledBefore(fnUtilConvertFiltersSpy), "_extendModelStructure is correctly called before converting filters");
		assert.ok(fnRequestMissingColumnsWithoutIgnoreSpy.calledBefore(fnUtilConvertFiltersSpy), "_requestMissingColumnsWithoutIgnore is correctly called before converting filters");

		// Cleanup
		fnExtendModelStructureSpy.restore();
		fnRequestMissingColumnsWithoutIgnoreSpy.restore();
		fnUtilConvertFiltersSpy.restore();
	});

	QUnit.test("UITable: setPersonalizationData/_fireChangeEvent should not trigger 'stableColumnKey' logic", function(assert) {
		// prepare
		var fnColumnsEnhanceSpy = sinon.spy(this.oController._getControllers().columns.controller, "_enhanceForStableKeys");

		// act: set variant and make change
		this.oController.setPersonalizationData({
			columns: {
				columnsItems: [
					{
						columnKey: "b",
						index: 0
					}
				]
			}
		});

		// assert
		assert.notOk(fnColumnsEnhanceSpy.called);
	});

	QUnit.test("UITable: setPersonalizationDataAsDataSuiteFormat", function(assert) {
		// prepare
		var fnFireAfterP13nModelDataChangeSpy = sinon.spy(this.oController, "fireAfterP13nModelDataChange");

		// act: make change
		this.oController.setPersonalizationDataAsDataSuiteFormat({
			"Visualizations": [
				{
					"Type": "LineItem",
					"Content": [
						{
							"Value": "a"
						}
					]
				}
			]
		});
		// assert
		assert.ok(fnFireAfterP13nModelDataChangeSpy.calledOnce);
		assert.equal(this.oController._determineResetType(), compLibrary.personalization.ResetType.ResetPartial);
	});

	QUnit.test("resetPersonalization should call resetFilters with 'true' when reset type is full", function(assert) {
		// Arrange
		var fnResetFiltersSpy = sinon.spy(this.oController, "_resetFilters");

		// Act
		this.oController.resetPersonalization(compLibrary.personalization.ResetType.ResetFull);

		// Assert
		assert.ok(fnResetFiltersSpy.calledOnce, "resetFilters is called");
		assert.ok(fnResetFiltersSpy.calledWith(true), "resetFilters is called with 'true' for full reset");

		// Cleanuo
		fnResetFiltersSpy.restore();
	});

	QUnit.test("resetPersonalization should call resetFilters with 'false' when reset type is partial", function(assert) {
		// Arrange
		var fnResetFiltersSpy = sinon.spy(this.oController, "_resetFilters"),
			fnVariantDataStub = sinon.stub(this.oController, "_getVariantData").returns({});

		// Act
		this.oController.resetPersonalization();

		// Assert
		assert.ok(fnResetFiltersSpy.calledOnce, "resetFilters is called");
		assert.ok(fnResetFiltersSpy.calledWith(false), "resetFilters is called with 'false' when reset is not full");

		// Cleanuo
		fnResetFiltersSpy.restore();
		fnVariantDataStub.restore();
	});

	QUnit.test("_resetFilters should clear the filterProvider model when called with 'true'", function(assert) {
		var done = assert.async();
		var oController = new Controller({
			table: new Table(),
			setting: {
				columns: {
					visible: false
				},
				sort: {
					visible: false
				},
				filter: {
					visible: true
				},
				group: {
					visible: false
				}
			}
		}),
		oFilterController = oController._getControllers().filter.controller;

		oFilterController.oFilterProvider = sinon.createStubInstance(FilterProvider);

		oFilterController.oFilterPanel = sinon.createStubInstance(MDCFilterPanel);

		oFilterController.oFilterPanel.getP13nData = function() {
			return [{active: true}, {active: false}];
		};


		oController.attachDialogAfterOpen(function(){

			// Act
			oController._resetFilters(true);

			// Assert
			assert.ok(oFilterController.oFilterProvider.clear.calledOnce);
			assert.ok(oFilterController.oFilterPanel.setP13nData.calledWith([{active: false}, {active: false}]));

			// Cleanup
			oController.destroy();
			done();
		});

		oController.openDialog();

	});

	QUnit.test("_resetFilters called without variantItems should call _resetToState with empty array", function(assert) {
		var done = assert.async(),
			aVariantItems,
			oFilterProvider, oFilterPanel,
			oController = new Controller({
				table: new Table()
			}),
			oFilterController = oController._getControllers().filter.controller,
			fnResetToStateSpy = sinon.spy(oController, "_resetToState");

		oController._getVariantData = function() {
			return {
				filter: {
					filterItems: aVariantItems
				}
			};
		};
		oFilterProvider = sinon.createStubInstance(FilterProvider);
		oFilterProvider._getFieldMetadata = function(sFieldName) {
			return sFieldName;
		};
		oFilterPanel = sinon.createStubInstance(MDCFilterPanel);

		oFilterController.oFilterProvider = oFilterProvider;
		oFilterController.oFilterPanel = oFilterPanel;

		oController.attachDialogAfterOpen(function(){

			// Act
			oController._resetFilters(false);

			// Assert
			assert.ok(fnResetToStateSpy.calledWith([], oFilterProvider, oFilterController, oFilterPanel), "_resetToState is called with correct variant items");

			// Cleanup
			oController.destroy();
			done();
		});

		oController.openDialog();
	});

	QUnit.test("_resetFilters should call '_resetToState' when called with false", function(assert) {
		var done = assert.async(),
			aVariantItems = [{columnKey: "item1"}],
			oFilterProvider, oFilterPanel,
			oController = new Controller({
				table: new Table(),
				setting: {
					columns: {
						visible: false
					},
					sort: {
						visible: false
					},
					filter: {
						visible: true
					},
					group: {
						visible: false
					}
				}
			}),
			oFilterController = oController._getControllers().filter.controller,
			fnResetToStateSpy = sinon.spy(oController, "_resetToState");

		oController._getVariantData = function() {
			return {
				filter: {
					filterItems: aVariantItems
				}
			};
		};
		oFilterProvider = sinon.createStubInstance(FilterProvider);
		oFilterProvider._getFieldMetadata = function(sFieldName) {
			return sFieldName;
		};
		oFilterProvider.getFilledFilterData = function() {
			return {
				item1: "item1",
				item2: "item2"
			};
		};
		oFilterPanel = sinon.createStubInstance(MDCFilterPanel);
		oFilterPanel.getP13nData = function() {
			return [
				{
					active: true,
					name: "item1"
				},
				{
					active: true,
					name: "item2"
				}
			];
		};

		oFilterController.oFilterProvider = oFilterProvider;
		oFilterController.oFilterPanel = oFilterPanel;

		oController.attachDialogAfterOpen(function(){

			// Act
			oController._resetFilters(false);

			// Assert
			assert.ok(fnResetToStateSpy.calledWith(aVariantItems, oFilterProvider, oFilterController, oFilterPanel), "_resetToState is called with correct variant items");

			// Cleanup
			oController.destroy();
			done();
		});

		oController.openDialog();
	});

	QUnit.test("_resetFilters should update the filterProvider model when called with 'false'", function(assert) {
		var done = assert.async(),
			oFilterProvider, oFilterPanel,
			aInitialItems = [{columnKey: "item1"}],
			oController = new Controller({
			table: new Table(),
			setting: {
				columns: {
					visible: false
				},
				sort: {
					visible: false
				},
				filter: {
					visible: true
				},
				group: {
					visible: false
				}
			}
		}),
		oFilterController = oController._getControllers().filter.controller,
		fnResetToStateSpy = sinon.spy(oController, "_resetToState");

		oController._getControlDataInitial = function() {
			return {
				filter: {
					filterItems: aInitialItems
				}
			};
		};
		oFilterProvider = sinon.createStubInstance(FilterProvider);
		oFilterProvider._getFieldMetadata = function(sFieldName) {
			return sFieldName;
		};
		oFilterProvider.getFilledFilterData = function() {
			return {
				item1: "item1",
				item2: "item2"
			};
		};
		oFilterPanel = sinon.createStubInstance(MDCFilterPanel);
		oFilterPanel.getP13nData = function() {
			return [
				{
					active: true,
					name: "item1"
				},
				{
					active: true,
					name: "item2"
				}
			];
		};

		oFilterController.oFilterProvider = oFilterProvider;
		oFilterController.oFilterPanel = oFilterPanel;

		oController.attachDialogAfterOpen(function(){

			// Act
			oController._resetFilters(true);

			// Assert
			assert.ok(fnResetToStateSpy.calledOnce, "_resetToState is called");
			assert.ok(fnResetToStateSpy.calledWith(aInitialItems, oFilterController.oFilterProvider, oFilterController, oFilterController.oFilterPanel), "_resetToState is called with correct initial items");

			// Cleanup
			oController.destroy();
			done();
		});

		oController.openDialog();
	});

	QUnit.test("test _resetToState when columnKey has '/'", function(assert) {
		var oFilterProvider, oFilterPanel,
			aItems = [{columnKey: "item1"}],
			oColumn1 = new UiColumn({}),
			oController = new Controller({
				table: new Table({
					columns: [oColumn1]
				}),
				setting: {
					columns: {
						visible: false
					},
					sort: {
						visible: false
					},
					filter: {
						visible: true
					},
					group: {
						visible: false
					}
				}
			}),
			oFilterController = oController._getControllers().filter.controller;
			sinon.spy(oFilterController, "_updateFilterData");


		oColumn1.data("p13nData", {
			columnKey: "test:item1.test/test",
			filterProperty: "item1"
		});
		oFilterProvider = sinon.createStubInstance(FilterProvider);
		oFilterProvider._getFieldMetadata = function(sFieldName) {
			return sFieldName;
		};

		oFilterPanel = sinon.createStubInstance(MDCFilterPanel);
		oFilterPanel.getP13nData = function() {
			return [
				{
					active: true,
					name: "test:item1.test/test"
				}
			];
		};

		oFilterController.oFilterProvider = oFilterProvider;
		oFilterController.oFilterPanel = oFilterPanel;


		// Act
		oController._resetToState(aItems, oFilterProvider, oFilterController, oFilterPanel);

		// Assert
		assert.ok(true, "No error thrown");

		// Cleanup
		oController.destroy();

	});
	QUnit.test("test _resetToState", function(assert) {
		var oFilterProvider, oFilterPanel,
			aItems = [{columnKey: "item1"}],
			oColumn1 = new UiColumn({}),
			oColumn2 = new UiColumn({}),
			oController = new Controller({
				table: new Table({
					columns: [oColumn1, oColumn2]
				}),
				setting: {
					columns: {
						visible: false
					},
					sort: {
						visible: false
					},
					filter: {
						visible: true
					},
					group: {
						visible: false
					}
				}
			}),
			oFilterController = oController._getControllers().filter.controller;
			sinon.spy(oFilterController, "_updateFilterData");


		oColumn1.data("p13nData", {
			columnKey: "item1",
			filterProperty: "item1"
		});
		oColumn2.data("p13nData", {
			columnKey: "item2",
			filterProperty: "item2"
		});
		oFilterProvider = sinon.createStubInstance(FilterProvider);
		oFilterProvider._getFieldMetadata = function(sFieldName) {
			return sFieldName;
		};

		oFilterPanel = sinon.createStubInstance(MDCFilterPanel);
		oFilterPanel.getP13nData = function() {
			return [
				{
					active: true,
					name: "item1"
				},
				{
					active: true,
					name: "item2"
				}
			];
		};

		oFilterController.oFilterProvider = oFilterProvider;
		oFilterController.oFilterPanel = oFilterPanel;


		// Act
		oController._resetToState(aItems, oFilterProvider, oFilterController, oFilterPanel);

		// Assert
		assert.ok(oFilterController.oFilterProvider._createInitialModelForField.calledTwice, "Field value is correctly reset");
		assert.ok(oFilterController.oFilterProvider._createInitialModelForField.calledWith(oFilterController.oFilterProvider.getFilterData(), "item2"), "Field value is correctly reset");
		assert.ok(oFilterController.oFilterProvider._createInitialModelForField.calledWith(oFilterController.oFilterProvider.getFilterData(), "item1"), "Field value is correctly reset");
		assert.ok(oFilterController._updateFilterData.calledWith(aItems), "_updateFilterData is called with correct items");
		assert.ok(oFilterController.oFilterPanel.setP13nData.calledWith([{active: true, name: "item1"}, {active: false, name: "item2"}]), "setP13nData is correctly called");

		// Cleanup
		oController.destroy();

	});


	QUnit.module("sap.ui.comp.personalization.Controller: _determineResetType in implicit 'VariantManagement' mode", {
		beforeEach: function() {
			this.oController = new Controller({
				resetToInitialTableState: true,
				columnKeys: [
					"a", "b"
				],
				table: this.oTable = new UiTable({
					columns: [
						new UiColumn({
							label: new Label({
								text: "A"
							}),
							template: new Label({
								text: "column A"
							}),
							customData: new CustomData({
								key: "p13nData",
								value: {
									columnKey: 'a'
								}
							})
						}), new UiColumn({
							label: new Label({
								text: "B"
							}),
							template: new Label({
								text: "column B"
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
				setting: {
					columns: {
						visible: true
					},
					sort: {
						visible: false
					},
					filter: {
						visible: false
					},
					group: {
						visible: false
					}
				}
			});
		},
		afterEach: function() {
			this.oTable.destroy();
			this.oController.destroy();
		}
	});
	QUnit.test("UITable: setDataSuiteFormatSnapshot", function(assert) {
		// prepare
		var fnFireAfterP13nModelDataChangeSpy = sinon.spy(this.oController, "fireAfterP13nModelDataChange");

		// act: make change
		this.oController.setDataSuiteFormatSnapshot({
			"Visualizations": [
				{
					"Type": "LineItem",
					"Content": [
						{
							"Value": "a"
						}
					]
				}
			]
		});
		// assert
		assert.ok(fnFireAfterP13nModelDataChangeSpy.calledOnce);
		assert.equal(this.oController._determineResetType(), compLibrary.personalization.ResetType.ResetFull);
	});
	QUnit.test("UITable: set standard variant", function(assert) {
		// prepare
		var fnFireAfterP13nModelDataChangeSpy = sinon.spy(this.oController, "fireAfterP13nModelDataChange");

		// act: set variant and make change
		this.oController.resetPersonalization();

		// assert
		assert.ok(fnFireAfterP13nModelDataChangeSpy.notCalled);
		assert.equal(this.oController._determineResetType(), compLibrary.personalization.ResetType.ResetFull);
	});
	QUnit.test("UITable: set standard variant", function(assert) {
		// prepare
		var fnFireAfterP13nModelDataChangeSpy = sinon.spy(this.oController, "fireAfterP13nModelDataChange");

		// act: set variant and make change
		this.oController.resetPersonalization(compLibrary.personalization.ResetType.ResetFull);

		// assert
		assert.ok(fnFireAfterP13nModelDataChangeSpy.notCalled);
		assert.equal(this.oController._determineResetType(), compLibrary.personalization.ResetType.ResetFull);
	});
	QUnit.test("UITable: set standard variant", function(assert) {
		// prepare
		var fnFireAfterP13nModelDataChangeSpy = sinon.spy(this.oController, "fireAfterP13nModelDataChange");

		// act: set variant and make change
		this.oController.resetPersonalization(compLibrary.personalization.ResetType.ResetPartial);

		// assert
		assert.ok(fnFireAfterP13nModelDataChangeSpy.notCalled);
		assert.equal(this.oController._determineResetType(), compLibrary.personalization.ResetType.ResetFull);
	});

	QUnit.test("UITable: set variant", function(assert) {
		// prepare
		var fnFireAfterP13nModelDataChangeSpy = sinon.spy(this.oController, "fireAfterP13nModelDataChange");

		// act: set variant and make change
		this.oController.setPersonalizationData({
			columns: {
				columnsItems: [
					{
						columnKey: "b",
						index: 0
					}
				]
			}
		});

		// assert
		assert.ok(fnFireAfterP13nModelDataChangeSpy.calledOnce);
		assert.equal(this.oController._determineResetType(), compLibrary.personalization.ResetType.ResetFull);
	});
	QUnit.test("UITable: set setPersonalizationDataAsDataSuiteFormat", function(assert) {
		// prepare
		var fnFireAfterP13nModelDataChangeSpy = sinon.spy(this.oController, "fireAfterP13nModelDataChange");

		// act: make change
		this.oController.setPersonalizationDataAsDataSuiteFormat({
			"Visualizations": [
				{
					"Type": "LineItem",
					"Content": [
						{
							"Value": "a"
						}
					]
				}
			]
		});
		// assert
		assert.ok(fnFireAfterP13nModelDataChangeSpy.calledOnce);
		assert.equal(this.oController._determineResetType(), compLibrary.personalization.ResetType.ResetFull);
	});

	QUnit.module("sap.ui.comp.personalization.Controller: _getOrderedColumnKeys", {
		beforeEach: function() {
		},
		afterEach: function() {
		}
	});
	QUnit.test("test 01", function(assert) {
		assert.ok(Controller._getOrderedColumnKeys({
			a: new UiColumn({
				label: new Label({
					text: "A"
				})
			}),
			b: new UiColumn({
				label: new Label({
					text: "B"
				})
			}),
			c: new UiColumn({
				label: new Label({
					text: "C"
				})
			})
		}, [
			"d"
		]), []);
		assert.ok(Controller._getOrderedColumnKeys({
			a: new UiColumn({
				label: new Label({
					text: "A"
				})
			}),
			b: new UiColumn({
				label: new Label({
					text: "B"
				})
			}),
			c: new UiColumn({
				label: new Label({
					text: "C"
				})
			})
		}, [
			"c", "a", "b"
		]), [
			"c", "a", "b"
		]);
		assert.ok(Controller._getOrderedColumnKeys({
			a: new UiColumn({
				label: new Label({
					text: "A"
				})
			}),
			b: new UiColumn({
				label: new Label({
					text: "B"
				})
			}),
			c: new UiColumn({
				label: new Label({
					text: "C"
				})
			})
		}, [
			"c", "a", "d", "b"
		]), [
			"c", "a", "b"
		]);
		assert.ok(Controller._getOrderedColumnKeys({
			a: new UiColumn({
				label: new Label({
					text: "A"
				})
			}),
			b: new UiColumn({
				label: new Label({
					text: "B"
				})
			}),
			c: new UiColumn({
				label: new Label({
					text: "C"
				})
			})
		}, [
			"c", "d"
		]), [
			"c"
		]);
	});

	QUnit.module("sap.ui.comp.personalization.Controller: checkConsistency", {
		beforeEach: function() {
		},
		afterEach: function() {
		}
	});
	QUnit.test("BCP 0020751295 0000634662 2018 - Test01", function(assert) {
		var oController = new Controller({
			columnKeys: [
				"b", "a", "c"
			],
			table: new UiTable()
		});
		assert.deepEqual(oController.getColumnKeys(), ["b", "a", "c"]);
		oController.destroy();
	});
	QUnit.test("BCP 0020751295 0000634662 2018 - Test02", function(assert) {
		var oController = new Controller({
			columnKeys: [
				"b", "a", "a"
			],
			table: new UiTable()
		});
		assert.deepEqual(oController.getColumnKeys(), ["b", "a"]);
		oController.destroy();
	});
	QUnit.test("Check the internal model size limit and amount of created columns", function(assert) {
		var done = assert.async();
		var iDummyAmount = 284;
		var aDummyColumnKeys = [];
		var aDummyColumns = [];
		for (var i = 0; i < iDummyAmount; i++) {
			aDummyColumnKeys.push("column" + i);
			aDummyColumns.push(
				new UiColumn({
					label: new Label({
						text: "Column Nr." + i
					}),
					customData: new CustomData({
						key: "p13nData",
						value: {
							columnKey: "Col" + i,
							text:"Column Nr." + i
						}
					})
				})
			);
		}
		var oController = new Controller({
			table: this.oTable = new UiTable({
				columns: aDummyColumns
			}),
			setting: {
				columns: {
					visible: true
				},
				sort: {
					visible: false
				},
				filter: {
					visible: false
				},
				group: {
					visible: false
				}
			}
		});
		var oInnerModel = oController._getInternalModel();

		assert.equal(oInnerModel.iSizeLimit, 10000, "The size limit of the inner model is set to 10000");

		oController.openDialog();

		oController.attachDialogAfterOpen(function(){
			var oAdaptationModel = this._oDialog.getContent()[0].getModel("$p13n");
			assert.equal(oAdaptationModel.getProperty("/items").length, iDummyAmount, "The UI model holds the correct amount of items");
			assert.ok(oAdaptationModel.iSizeLimit, 10000, "The sizelimit has been adjusted");
			oController._handleDialogAfterClose();
			oController.destroy();
			done();
		});

	});

	QUnit.test("Check controller housekeeping after cancel of Dialog", function(assert) {
		var done = assert.async();
		var iDummyAmount = 5;
		var aColumnKeys = [];
		var aColumns = [];

		for (var i = 0; i < iDummyAmount; i++) {
			aColumnKeys.push("Col" + i);
			aColumns.push(
				new UiColumn({
					label: new Label({
						text: "Column Nr." + i
					}),
					customData: new CustomData({
						key: "p13nData",
						value: {
							columnKey: aColumnKeys[i],
							text:"Column Nr." + i
						}
					})
				})
			);
		}

		aColumnKeys.push("additional");
		var oController = new Controller({
			columnKeys: aColumnKeys,
			table: this.oTable = new UiTable({
				columns: aColumns
			}),
			requestColumns: function() {
				var oMap = {
					additional: new UiColumn({
						label: new Label({
							text: "Additional Column"
						}),
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: "additional"
							}
						})
					})
				};

				this.oTable.addColumn(oMap["additional"]);

				oController.addColumns(oMap);
			}.bind(this),
			setting: {
				columns: {
					visible: true
				},
				sort: {
					visible: false
				},
				filter: {
					visible: false
				},
				group: {
					visible: false
				}
			}
		});

		oController.attachDialogAfterClose(function(){
			var oControlDataBase = oController._getInternalModel().oData.controlDataBase;
			assert.equal(oControlDataBase.columns.columnsItems.length, 6, "The controller housekeeping has been updated with the requested columns, even after cancel");
			done();
		});

		oController.openDialog()
		.then(function(oDialog){
			oDialog.getButtons()[1].firePress(); // --> trigger cancel
		});

	});

	QUnit.test("Set message strip for filter panel", function(assert) {

		var done = assert.async();

		var oMS = new MessageStrip({
			text: "Some Text"
		});

		var oController = new Controller("C2",{
			columnKeys: [
				"b", "a", "c"
			],
			table: new Table(),
			setting: {
				filter: {
					visible: true,
					createMessageStrip: function() {
						return oMS;
					}
				}
			}
		});

		oController.attachDialogAfterOpen(function(){
			//Check if Controller forwarded the message strip to the corresponding controller
			var oFilterController = oController._getControllers().filter.controller;
			var oMessageStrip = oFilterController.getMessageStrip();
			assert.ok(oMessageStrip.isA("sap.m.MessageStrip"));
			oController.destroy();
			done();
		});

		oController.openDialog();

	});

	QUnit.module("MDC UIManager integration (AdaptationProvider interface)", {
		createController: function() {
			var oController = new Controller({
				table: this.oTable = new UiTable({
					columns: [
						new UiColumn({
							sortProperty: 'country',
							label: new Label({
								text: "Country"
							}),
							template: new Label({
								text: "row1"
							}),
							customData: new CustomData({
								key: "p13nData",
								value: {
									columnKey: 'country'
								}
							})
						}), new UiColumn({
							sortProperty: 'region',
							label: new Label({
								text: "B"
							}),
							template: new Label({
								text: "Region"
							}),
							customData: new CustomData({
								key: "p13nData",
								value: {
									columnKey: 'region'
								}
							})
						})
					]
				}),
				setting: {
					columns: {
						visible: true
					},
					sort: {
						visible: true
					},
					filter: {
						visible: true
					},
					group: {
						visible: true
					}
				}
			});

			return oController;
		},
		beforeEach: function() {
			this.oController = this.createController();
		},
		afterEach: function() {
			this.oTable.destroy();
			this.oController.destroy();
		}
	});

	QUnit.test("Check usage of the comp UIManager --> instancing is allowed", function(assert) {

		var done = assert.async();

		var oController1 = this.createController();
		var oController2 = this.createController();

		var pOpen1 = oController1.openDialog();
		var pOpen2 = oController2.openDialog();

		Promise.all([
			pOpen1, pOpen2
		]).then(function(aDialogs){
			assert.ok(aDialogs[0].isA("sap.m.Dialog"), "Dialog instance created");
			assert.ok(aDialogs[1].isA("sap.m.Dialog"), "Dialog instance created");

			assert.ok(oController1._oUIManager.isA("sap.ui.comp.personalization.UIManager"), "Comp UIManager instance created");
			assert.ok(oController2._oUIManager.isA("sap.ui.comp.personalization.UIManager"), "Comp UIManager instance created");

			sap.ui.require(["sap/m/p13n/modules/UIManager"], function(BaseUIManager){
				var oParentManager = BaseUIManager.getInstance(oController1);

				assert.ok(oParentManager, "The UIManager#getInstance method is independent of inherited classes");

				aDialogs[0].destroy();
				aDialogs[1].destroy();
				done();
			});
		});
	});

	QUnit.test("Check 'openDialog' returns a promise resolving in a Dialog instance", function(assert){
		var done = assert.async();
		var pDialog = this.oController.openDialog();

		assert.ok(pDialog instanceof Promise, "Dialog creation returns a promise");

		pDialog.then(function(oDialog){

			assert.ok(oDialog.isA("sap.m.Dialog"), "Dialog instance created");
			done();
		});
	});

	QUnit.test("Check 'reset' return a promise resolving in a reset execution", function(assert) {
		// prepare
		var done = assert.async();
		var oSyncSpy = sinon.spy(this.oController, "_syncDialogUi");
		var oResetP13nSpy = sinon.spy(this.oController, "resetPersonalization");
		var fnFireAfterP13nModelDataChangeSpy = sinon.spy(this.oController, "fireAfterP13nModelDataChange");

		// act: set variant and make change
		var pReset = this.oController.reset();

		// assert
		assert.ok(fnFireAfterP13nModelDataChangeSpy.notCalled);
		assert.equal(this.oController._determineResetType(), compLibrary.personalization.ResetType.ResetFull);
		assert.ok(pReset instanceof Promise, "Reset execution returns a promise");

		pReset.then(function(){
			assert.ok(oResetP13nSpy.calledOnce, "Reset executed");
			assert.ok(oSyncSpy.calledTwice, "Sync executed");

			this.oController._syncDialogUi.restore();
			this.oController.resetPersonalization.restore();
			done();
		}.bind(this));
	});

	QUnit.module("sap.ui.comp.personalization.Controller: _resetMessageStrip", {
		createController: function () {
			var oController = new Controller({
				table: this.oTable = new UiTable({
					columns: [
						new UiColumn({
							sortProperty: 'country',
							label: new Label({
								text: "Country"
							}),
							template: new Label({
								text: "row1"
							}),
							customData: new CustomData({
								key: "p13nData",
								value: {
									columnKey: 'country'
								}
							})
						})
					]
				}),
				setting: {
					columns: {
						visible: true
					},
					sort: {
						visible: true
					},
					filter: {
						visible: true
					},
					group: {
						visible: true
					}
				}
			});

			return oController;
		},
		beforeEach: function () {
			this.oController = this.createController();
		},
		afterEach: function () {
			this.oTable.destroy();
			this.oController.destroy();
		}
	});

	QUnit.test("Check 'reset' calls the '_resetMessageStrip' ", function(assert) {
		// prepare
		var oResetMessageStripSpy = sinon.spy(this.oController, "_resetMessageStrip");

		// act
		this.oController.reset();

		// assert
		assert.ok(oResetMessageStripSpy.calledOnce);

	});

	/**
	 * @deprecated
	 */
	QUnit.test("Check the '_resetMessageStrip' sets the message to undefined", function(assert) {
		// prepare
		var oResetMessageStripSpy = sinon.spy(this.oController, "_resetMessageStrip"),
		oMS = new MessageStrip({
			text: "Some Text"
		}),
		oGroupController = this.oController._oSettingCurrent.group.controller;
		sinon.stub(oGroupController, "getAdaptationUI").returns(new BasePanel());

		oGroupController.getAdaptationUI().setMessageStrip(oMS);

		// assert
		assert.equal(oGroupController.getAdaptationUI().getMessageStrip().getText(), "Some Text", "Message strip is having text 'Some text'");

		// act
		this.oController.reset();


		// assert
		assert.ok(oResetMessageStripSpy.calledOnce, "_resetMessageStrip function is called");
		assert.equal(oGroupController.getAdaptationUI().getMessageStrip(), undefined , "Message strip is well resetted and is undefined");

	});

	QUnit.module("sap.ui.comp.personalization.Controller: _setShowDetails", {
		createController: function () {
			var oController = new Controller({
				table: this.oTable = new UiTable({
					columns: [
						new UiColumn({
							sortProperty: 'country',
							label: new Label({
								text: "Country"
							}),
							template: new Label({
								text: "row1"
							}),
							customData: new CustomData({
								key: "p13nData",
								value: {
									columnKey: 'country'
								}
							})
						})
					]
				}),
				setting: {
					columns: {
						visible: true
					},
					sort: {
						visible: true
					},
					filter: {
						visible: true
					},
					group: {
						visible: true
					}
				}
			});

			return oController;
		},
		beforeEach: function () {
			this.oController = this.createController();
		},
		afterEach: function () {
			this.oTable.destroy();
			this.oController.destroy();
		}
	});

	QUnit.test("Check _setShowDetails to call _callControllers", function(assert) {
		// prepare
		var oCallControllersSpy = sinon.spy(this.oController, "_callControllers"),
			oUpdateInternalModelShowHideSpy = sinon.spy(this.oController._oSettingCurrent.columns.controller, "_updateInternalModelShowHide"),
			bShowDetails = true;

		// act
		this.oController._setShowDetails(bShowDetails);

		// assert
		assert.ok(oCallControllersSpy.called, "callControllers function is called");
		assert.ok(oUpdateInternalModelShowHideSpy.calledOnce, "_updateInternalModelShowHide function is called");
		assert.ok(oUpdateInternalModelShowHideSpy.calledWith(bShowDetails), "_updateInternalModelShowHide function is called with the correct param");
	});

	QUnit.module("Internal methods", {
		beforeEach: function () {
			this.oController = new Controller({
				table: this.oTable = new UiTable(),
				setting: {
					columns: {
						visible: true
					},
					sort: {
						visible: true
					},
					filter: {
						visible: true
					},
					group: {
						visible: true
					}
				}
			});
		},
		afterEach: function () {
			this.oTable.destroy();
			this.oController.destroy();
		}
	});

	QUnit.test("SNOW: CS20240007671278 _setRuntimeAndPersonalizationData", function (assert) {
		// Arrange
		const oRTData = {
				columns: {}
			},
			oPData = {
				columns: {
					fixedColumnCount: 3
				}
			};

		// Act
		this.oController._setRuntimeAndPersonalizationData(oRTData, oPData);

		// Assert
		assert.strictEqual(oRTData.columns.fixedColumnCount, 3, "fixedColumnCount cloned from oPersonalizationData property");
	});
});
