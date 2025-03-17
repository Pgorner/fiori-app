/* global QUnit, sinon */
sap.ui.define([
	'sap/ui/comp/library', 'sap/ui/comp/personalization/Controller', 'sap/ui/comp/personalization/DimeasureController', 'sap/ui/comp/odata/ChartMetadata', 'sap/chart/data/Dimension', 'sap/chart/data/Measure', 'sap/chart/Chart', 'sap/chart/ChartType', 'sap/chart/library', 'sap/ui/core/CustomData', 'sap/ui/model/json/JSONModel', 'sap/ui/comp/personalization/ChartWrapper'

], function(CompLibrary, Controller, DimeasureController, ChartMetadata, Dimension, Measure, Chart, ChartType, chartLibrary, CustomData, JSONModel, ChartWrapper) {
	'use strict';

	var AggregationRole = CompLibrary.personalization.AggregationRole;
	var SelectionMode = chartLibrary.SelectionMode;

	var oEmpty = {
		dimeasure: {
			dimeasureItems: []
		}
	};
	var oA = {
		dimeasure: {
			chartTypeKey: "columns",
			dimeasureItems: [
				{
					columnKey: "name",
					index: 0,
					visible: true,
					role: "dimension"
				}
			]
		}
	};

	QUnit.module("Properties", {
		beforeEach: function() {
			this.oDimeasureController = new DimeasureController();
		},
		afterEach: function() {
			this.oDimeasureController.destroy();
		}
	});

	QUnit.test("Shall be instantiable to check that DimeasureController exist", function(assert) {
		assert.ok(this.oDimeasureController);
	});

	QUnit.test("_isSemanticEqual", function(assert) {
		// assert
		assert.ok(!this.oDimeasureController._isSemanticEqual({
			dimeasure: {
				dimeasureItems: [
					{
						columnKey: "A"
					}, {
						columnKey: "B"
					}
				]
			}
		}, {
			dimeasure: {
				dimeasureItems: [
					{
						columnKey: "A"
					}
				]
			}
		}));
		assert.ok(this.oDimeasureController._isSemanticEqual({
			dimeasure: {
				dimeasureItems: [
					{
						columnKey: "A",
						index: 1
					}, {
						columnKey: "B",
						index: 0
					}
				]
			}
		}, {
			dimeasure: {
				dimeasureItems: [
					{
						columnKey: "B",
						index: 0
					}, {
						columnKey: "A",
						index: 1
					}
				]
			}
		}));
		assert.ok(!this.oDimeasureController._isSemanticEqual({
			dimeasure: {
				dimeasureItems: [
					{
						columnKey: "A",
						index: 0
					}
				]
			}
		}, {
			dimeasure: {
				dimeasureItems: [
					{
						columnKey: "A"
					}
				]
			}
		}));
		assert.ok(!this.oDimeasureController._isSemanticEqual({
			dimeasure: {
				chartTypeKey: "a",
				dimeasureItems: []
			}
		}, {
			dimeasure: {
				dimeasureItems: []
			}
		}));
		assert.ok(this.oDimeasureController._isSemanticEqual({
			dimeasure: {
				chartTypeKey: "a",
				dimeasureItems: []
			}
		}, {
			dimeasure: {
				dimeasureItems: [],
				chartTypeKey: "a"
			}
		}));
		assert.ok(!this.oDimeasureController._isSemanticEqual({
			dimeasure: {
				chartTypeKey: "a",
				dimeasureItems: [
					{
						columnKey: "name",
						index: 0,
						visible: true,
						role: "dimension"
					}, {
						columnKey: "city",
						index: 0,
						visible: false,
						role: "dimension"
					}
				]
			}
		}, {
			dimeasure: {
				dimeasureItems: [
					{
						columnKey: "name",
						index: 0,
						visible: false,
						role: "dimension"
					}, {
						columnKey: "city",
						index: 0,
						visible: true,
						role: "dimension"
					}
				],
				chartTypeKey: "a"
			}
		}));
		assert.ok(!this.oDimeasureController._isSemanticEqual({
			dimeasure: {
				chartTypeKey: "a",
				dimeasureItems: [
					{
						columnKey: "name",
						index: 0,
						visible: true,
						role: "dimension"
					}, {
						columnKey: "city",
						index: 1,
						visible: true,
						role: "dimension"
					}
				]
			}
		}, {
			dimeasure: {
				dimeasureItems: [
					{
						columnKey: "name",
						index: 1,
						visible: true,
						role: "dimension"
					}, {
						columnKey: "city",
						index: 0,
						visible: true,
						role: "dimension"
					}
				],
				chartTypeKey: "a"
			}
		}));
		assert.ok(!this.oDimeasureController._isSemanticEqual({
			dimeasure: {
				chartTypeKey: "a",
				dimeasureItems: [
					{
						columnKey: "name",
						index: 0,
						visible: true,
						role: "dimension"
					}, {
						columnKey: "city",
						index: 0,
						visible: true,
						role: "dimension"
					}
				]
			}
		}, {
			dimeasure: {
				dimeasureItems: [
					{
						columnKey: "name",
						index: 1,
						visible: true,
						role: "dimension"
					}
				],
				chartTypeKey: "a"
			}
		}));
	});

	QUnit.test("_isDimMeasureItemEqual", function(assert) {
		// assert
		assert.ok(this.oDimeasureController._isDimMeasureItemEqual(null, null));
		assert.ok(!this.oDimeasureController._isDimMeasureItemEqual({
			columnKey: "name",
			index: 0,
			visible: true,
			role: "dimension"
		}, null));
		assert.ok(!this.oDimeasureController._isDimMeasureItemEqual(null, {
			columnKey: "name",
			index: 0,
			visible: true,
			role: "dimension"
		}));
		assert.ok(this.oDimeasureController._isDimMeasureItemEqual({
			columnKey: "name",
			index: 0,
			visible: true,
			role: "dimension"
		}, {
			columnKey: "name",
			index: 0,
			visible: true,
			role: "dimension"
		}));
		assert.ok(this.oDimeasureController._isDimMeasureItemEqual({
			columnKey: "name",
			index: -1,
			visible: false,
			role: "dimension"
		}, null));
		assert.ok(this.oDimeasureController._isDimMeasureItemEqual(null, {
			columnKey: "name",
			index: -1,
			visible: false,
			role: "dimension"
		}));
	});
	QUnit.test("getChangeType", function(assert) {
		assert.ok(this.oDimeasureController.getChangeType(oEmpty, oA));
	});

	QUnit.module("chart type", {
		beforeEach: function() {
			this.oChart = new Chart({
				width: '100%',
				isAnalytical: true,
				uiConfig: {
					applicationSet: 'fiori'
				},
				chartType: ChartType.Column,
				selectionMode: SelectionMode.Single,
				visibleDimensions: [
					"name", "city"
				],
				visibleMeasures: [
					"number", "date"
				],
				dimensions: [
					new Dimension({
						label: "Name",
						name: "name",
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'name'
							}
						})
					}), new Dimension({
						label: "City",
						name: "city",
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'city'
							}
						})
					})
				],
				measures: [
					new Measure({
						label: "Number",
						name: "number",
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'number'
							}
						})
					}), new Measure({
						label: "Date",
						name: "date",
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'date'
							}
						})
					})
				]
			});

			this.oDimeasureController = new DimeasureController({
				table: this.oTable = ChartWrapper.createChartWrapper(this.oChart, [
					{
						columnKey: "country",
						leadingProperty: "country",
						sortProperty: true,
						filterProperty: true,
						label: "Country",
						tooltip: "Country"
					}
				], [
					"name", "country", "number", "city", "date"
				])
			});
			this.oDimeasureController.initializeInternalModel(new JSONModel());
		},
		afterEach: function() {
			this.oDimeasureController.destroy();
			this.oTable.destroy();
			this.oChart.destroy();
		}
	});
	QUnit.test("setChartType", function(assert) {
		this.oChart.setChartType("newChartType");
		assert.equal(this.oDimeasureController.getControlData().dimeasure.chartTypeKey, "newChartType");
	});

	QUnit.module("getPanel", {
		beforeEach: function() {
			this.oChart = new Chart({
				width: '100%',
				isAnalytical: true,
				uiConfig: {
					applicationSet: 'fiori'
				},
				chartType: ChartType.Column,
				selectionMode: SelectionMode.Single,
				visibleDimensions: [
					"name", "city"
				],
				visibleMeasures: [
					"number", "date"
				],
				dimensions: [
					new Dimension({
						label: "Name",
						name: "name",
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'name'
							}
						})
					}), new Dimension({
						label: "City",
						name: "city",
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'city'
							}
						})
					})
				],
				measures: [
					new Measure({
						label: "Number",
						name: "number",
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'number'
							}
						})
					}), new Measure({
						label: "Date",
						name: "date",
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'date'
							}
						})
					})
				]
			});
			this.oController = new Controller({
				table: this.oTable = ChartWrapper.createChartWrapper(this.oChart, [
					{
						columnKey: "country",
						leadingProperty: "country",
						sortProperty: true,
						filterProperty: true,
						label: "Country",
						tooltip: "Country"
					}
				], [
					"name", "country", "number", "city", "date"
				]),
				setting: {
					dimeasure: {
						visible: true
					},
					sort: {
						visible: false
					},
					filter: {
						visible: false
					}
				}
			});
			// Fill 'ControlDataReduce' as the panel is bound again this internal model
			this.oController._prepareDialogUi();
			this.oDimeasureController = this.oController._oSettingCurrent.dimeasure.controller;
		},
		afterEach: function() {
			this.oDimeasureController.destroy();
			this.oController.destroy();
			this.oTable.destroy();
			this.oChart.destroy();
		}
	});

	QUnit.test("getPanel - without filterable columns", function(assert) {
		// act
		var done = assert.async();
		var oPromise = this.oDimeasureController.getPanel();
		oPromise.then(function(oPanel) {
			// assert
			assert.ok(oPanel);
			// act: propagate internal model to the panel
			oPanel.beforeNavigationTo();
			// assert
			assert.equal(oPanel.getItems().length, 4);
			assert.equal(oPanel.getDimMeasureItems().length, 4);

			done();
		});
	});

	QUnit.test("syncJson2Table - filter is set to first column", function(assert) {
		// act
		this.oDimeasureController.syncJson2Table({
			dimeasure: {
				dimeasureItems: [
					{
						columnKey: "name",
						index: 0
					}, {
						columnKey: "city",
						index: 2
					}, {
						columnKey: "number",
						index: 1
					}, {
						columnKey: "date",
						index: 3
					}
				]
			}
		});
		this.oDimeasureController.syncJson2Table({
			dimeasure: {
				dimeasureItems: [
					{
						columnKey: "name",
						index: 2
					}, {
						columnKey: "city",
						index: 0
					}, {
						columnKey: "number",
						index: 3
					}, {
						columnKey: "date",
						index: 1
					}
				]
			}
		});

		// assert
		assert.ok(this.oTable.getColumns()[0]);
	});
	QUnit.module("DrilledDown and DrilledUp", {
		beforeEach: function() {
			this.oChart = new Chart({
				width: '100%',
				isAnalytical: true,
				uiConfig: {
					applicationSet: 'fiori'
				},
				chartType: ChartType.Column,
				selectionMode: SelectionMode.Single,
				visibleDimensions: [
					"name", "city"
				],
				visibleMeasures: [
					"number", "date"
				],
				dimensions: [
					new Dimension({
						label: "Name",
						name: "name",
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'name'
							}
						})
					}), new Dimension({
						label: "City",
						name: "city",
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'city'
							}
						})
					})
				],
				measures: [
					new Measure({
						label: "Number",
						name: "number",
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'number'
							}
						})
					}), new Measure({
						label: "Date",
						name: "date",
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'date'
							}
						})
					})
				]
			});

			this.oController = new Controller({
				table: this.oTable = ChartWrapper.createChartWrapper(this.oChart, [
					{
						columnKey: "country",
						leadingProperty: "country",
						sortProperty: true,
						filterProperty: true,
						label: "Country",
						tooltip: "Country"
					}
				], [
					"name", "country", "number", "city", "date"
				]),
				setting: {
					dimeasure: {
						visible: true
					},
					sort: {
						visible: false
					},
					filter: {
						visible: false
					}
				}
			});
			this.oDimeasureController = this.oController._oSettingCurrent.dimeasure.controller;
		},
		afterEach: function() {
			this.oDimeasureController.destroy();
			this.oController.destroy();
			this.oTable.destroy();
			this.oChart.destroy();
		}
	});
	QUnit.test("_addVisibleDimensions", function(assert) {
		// assert
		assert.equal(this.oDimeasureController.getControlDataBase().dimeasure.dimeasureItems.length, 4);
		assert.deepEqual(this.oDimeasureController.getControlDataBase().dimeasure.dimeasureItems, [
			{
				columnKey: "name",
				index: 0,
				visible: true,
				role: "category",
				aggregationRole: "Dimension"
			}, {
				columnKey: "number",
				index: 2,
				visible: true,
				role: "axis1",
				aggregationRole: "Measure"
			}, {
				columnKey: "city",
				index: 3,
				visible: true,
				role: "category",
				aggregationRole: "Dimension"
			}, {
				columnKey: "date",
				index: 4,
				visible: true,
				role: "axis1",
				aggregationRole: "Measure"
			}
		]);

		// act
		this.oDimeasureController._addVisibleDimensions([
			"city", "name"
		]);

		// assert
		assert.equal(this.oDimeasureController.getControlDataBase().dimeasure.dimeasureItems.length, 4);
		assert.deepEqual(this.oDimeasureController.getControlDataBase().dimeasure.dimeasureItems, [
			{
				columnKey: "city",
				index: 0,
				visible: true,
				role: "category",
				aggregationRole: "Dimension"
			}, {
				columnKey: "name",
				index: 1,
				visible: true,
				role: "category",
				aggregationRole: "Dimension"
			}, {
				columnKey: "number",
				index: 2,
				visible: true,
				role: "axis1",
				aggregationRole: "Measure"
			}, {
				columnKey: "date",
				index: 3,
				visible: true,
				role: "axis1",
				aggregationRole: "Measure"
			}
		]);
	});

	QUnit.test("_addVisibleDimensions - sorting", function(assert) {
		// assert
		assert.equal(this.oDimeasureController.getControlData().dimeasure.dimeasureItems.length, 4);

		// act
		var oTmp = this.oDimeasureController.getControlData().dimeasure.dimeasureItems[3];
		this.oDimeasureController.getControlData().dimeasure.dimeasureItems[3] = this.oDimeasureController.getControlData().dimeasure.dimeasureItems[2];
		this.oDimeasureController.getControlData().dimeasure.dimeasureItems[2] = oTmp;

		assert.deepEqual(this.oDimeasureController.getControlData().dimeasure.dimeasureItems, [
			{
				columnKey: "name",
				index: 0,
				visible: true,
				role: "category",
				aggregationRole: "Dimension"
			}, {
				columnKey: "number",
				index: 2,
				visible: true,
				role: "axis1",
				aggregationRole: "Measure"
			}, {
				columnKey: "date",
				index: 4,
				visible: true,
				role: "axis1",
				aggregationRole: "Measure"
			}, {
				columnKey: "city",
				index: 3,
				visible: true,
				role: "category",
				aggregationRole: "Dimension"
			}
		]);

		// act
		this.oDimeasureController._addVisibleDimensions([
			"city"
		]);

		// assert
		assert.equal(this.oDimeasureController.getControlData().dimeasure.dimeasureItems.length, 4);
		assert.deepEqual(this.oDimeasureController.getControlData().dimeasure.dimeasureItems, [
			{
				columnKey: "name",
				index: 0,
				visible: true,
				role: "category",
				aggregationRole: "Dimension"
			}, {
				columnKey: "city",
				index: 1,
				visible: true,
				role: "category",
				aggregationRole: "Dimension"
			}, {
				columnKey: "number",
				index: 2,
				visible: true,
				role: "axis1",
				aggregationRole: "Measure"
			}, {
				columnKey: "date",
				index: 3,
				visible: true,
				role: "axis1",
				aggregationRole: "Measure"
			}
		]);
	});

	QUnit.test("_onDrilledDown", function(assert) {
		var fnFireBeforePotentialTableChangeSpy = sinon.spy(this.oController, "fireBeforePotentialTableChange");
		var fnFireAfterPotentialTableChangeSpy = sinon.spy(this.oController, "fireAfterPotentialTableChange");
		var oEventStub = sinon.stub();
		oEventStub.getParameter = sinon.stub().withArgs("dimensions").returns([]);

		// act
		this.oDimeasureController._onDrilledDown(oEventStub);

		// assert
		assert.strictEqual(fnFireBeforePotentialTableChangeSpy.callCount, 1);
		assert.strictEqual(fnFireAfterPotentialTableChangeSpy.callCount, 1);
	});
	QUnit.test("_onDrilledUp", function(assert) {
		var fnFireBeforePotentialTableChangeSpy = sinon.spy(this.oController, "fireBeforePotentialTableChange");
		var fnFireAfterPotentialTableChangeSpy = sinon.spy(this.oController, "fireAfterPotentialTableChange");
		var oEventStub = sinon.stub();
		oEventStub.getParameter = sinon.stub().withArgs("dimensions").returns([]);

		// act
		this.oDimeasureController._onDrilledUp(oEventStub);

		// assert
		assert.strictEqual(fnFireBeforePotentialTableChangeSpy.callCount, 1);
		assert.strictEqual(fnFireAfterPotentialTableChangeSpy.callCount, 1);
	});

	QUnit.module("getDataSuiteFormatSnapshot", {
		afterEach: function() {
			this.oChart.destroy();
			this.oController.destroy();
		}
	});
	QUnit.test("not visible", function(assert) {
		// arrange
		this.oChart = new Chart({
			width: '100%',
			isAnalytical: true,
			uiConfig: {
				applicationSet: 'fiori'
			},
			chartType: "line",
			selectionMode: SelectionMode.Single,
			visibleDimensions: [],
			visibleMeasures: [],
			dimensions: [
				new Dimension({
					label: "dimension1",
					name: "a",
					customData: new CustomData({
						key: "p13nData",
						value: {
							columnKey: "a"
						}
					})
				}), new Dimension({
					label: "dimension2",
					name: "b",
					role: "series",
					customData: new CustomData({
						key: "p13nData",
						value: {
							columnKey: "b"
						}
					})
				})
			],
			measures: [
				new Measure({
					label: "measure1",
					name: "c",
					customData: new CustomData({
						key: "p13nData",
						value: {
							columnKey: "c"
						}
					})
				})
			]
		});
		this.oController = new Controller({
			table: ChartWrapper.createChartWrapper(this.oChart, [], [
				"a", "b", "c"
			]),
			setting: {
				dimeasure: {
					visible: true
				},
				sort: {
					visible: false
				},
				filter: {
					visible: false
				}
			}
		});

		// act
		var oDataSuiteFormat = {};
		this.oController._oSettingCurrent.dimeasure.controller.getDataSuiteFormatSnapshot(oDataSuiteFormat);
		assert.deepEqual(oDataSuiteFormat, {});
	});
	QUnit.test("Visualizations: visible measure", function(assert) {
		// arrange
		this.oChart = new Chart({
			width: '100%',
			isAnalytical: true,
			uiConfig: {
				applicationSet: 'fiori'
			},
			chartType: "column",
			selectionMode: SelectionMode.Single,
			visibleDimensions: [],
			visibleMeasures: [
				"c"
			],
			dimensions: [],
			measures: [
				new Measure({
					label: "measure1",
					name: "c",
					customData: new CustomData({
						key: "p13nData",
						value: {
							columnKey: "c"
						}
					})
				})
			]
		});
		this.oController = new Controller({
			table: ChartWrapper.createChartWrapper(this.oChart, [], [
				"a", "b", "c"
			]),
			setting: {
				dimeasure: {
					visible: true
				},
				sort: {
					visible: false
				},
				filter: {
					visible: false
				}
			}
		});

		// act
		var oDataSuiteFormat = {};
		this.oController._oSettingCurrent.dimeasure.controller.getDataSuiteFormatSnapshot(oDataSuiteFormat);
		// assert
		assert.deepEqual(oDataSuiteFormat, {
			Visualizations: [
				{
					Type: "Chart",
					Content: {
						ChartType: "com.sap.vocabularies.UI.v1.ChartType/Column",
						Dimensions: [],
						DimensionAttributes: [],
						Measures: [
							"c"
						],
						MeasureAttributes: [
							{
								Measure: "c",
								Role: "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis1"
							}
						]
					}
				}
			]
		});
	});
	QUnit.test("Visualizations: visible measure and dimension", function(assert) {
		// arrange
		this.oChart = new Chart({
			width: '100%',
			isAnalytical: true,
			uiConfig: {
				applicationSet: 'fiori'
			},
			chartType: "column",
			selectionMode: SelectionMode.Single,
			visibleDimensions: [
				"b"
			],
			visibleMeasures: [
				"c"
			],
			dimensions: [
				new Dimension({
					label: "dimension1",
					name: "b",
					role: "series",
					customData: new CustomData({
						key: "p13nData",
						value: {
							columnKey: "b"
						}
					})
				})
			],
			measures: [
				new Measure({
					label: "measure1",
					name: "c",
					customData: new CustomData({
						key: "p13nData",
						value: {
							columnKey: "c"
						}
					})
				})
			]
		});
		this.oController = new Controller({
			table: ChartWrapper.createChartWrapper(this.oChart, [], [
				"a", "b", "c"
			]),
			setting: {
				dimeasure: {
					visible: true
				},
				sort: {
					visible: false
				},
				filter: {
					visible: false
				}
			}
		});

		// act
		var oDataSuiteFormat = {};
		this.oController._oSettingCurrent.dimeasure.controller.getDataSuiteFormatSnapshot(oDataSuiteFormat);
		// assert
		assert.deepEqual(oDataSuiteFormat, {
			Visualizations: [
				{
					Type: "Chart",
					Content: {
						ChartType: "com.sap.vocabularies.UI.v1.ChartType/Column",
						Dimensions: [
							"b"
						],
						DimensionAttributes: [
							{
								Dimension: "b",
								Role: "com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Series"
							}
						],
						Measures: [
							"c"
						],
						MeasureAttributes: [
							{
								Measure: "c",
								Role: "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis1"
							}
						]
					}
				}
			]
		});
	});
	QUnit.test("Visualizations: visible measure and dimension", function(assert) {
		// arrange
		this.oChart = new Chart({
			width: '100%',
			isAnalytical: true,
			uiConfig: {
				applicationSet: 'fiori'
			},
			chartType: ChartType.Column,
			selectionMode: SelectionMode.Single,
			visibleDimensions: [
				"b", "a"
			],
			visibleMeasures: [
				"c"
			],
			dimensions: [
				new Dimension({
					label: "dimension1",
					name: "b",
					role: "series",
					customData: new CustomData({
						key: "p13nData",
						value: {
							columnKey: "b"
						}
					})
				}), new Dimension({
					label: "dimension1",
					name: "a",
					customData: new CustomData({
						key: "p13nData",
						value: {
							columnKey: "a"
						}
					})
				})
			],
			measures: [
				new Measure({
					label: "measure1",
					name: "c",
					customData: new CustomData({
						key: "p13nData",
						value: {
							columnKey: "c"
						}
					})
				})
			]
		});
		this.oController = new Controller({
			table: ChartWrapper.createChartWrapper(this.oChart, [], [
				"b", "a", "c"
			]),
			setting: {
				dimeasure: {
					visible: true
				},
				sort: {
					visible: false
				},
				filter: {
					visible: false
				}
			}
		});

		// act
		var oDataSuiteFormat = {};
		this.oController._oSettingCurrent.dimeasure.controller.getDataSuiteFormatSnapshot(oDataSuiteFormat);
		// assert
		assert.deepEqual(oDataSuiteFormat, {
			Visualizations: [
				{
					Type: "Chart",
					Content: {
						ChartType: "com.sap.vocabularies.UI.v1.ChartType/Column",
						Dimensions: [
							"b", "a"
						],
						DimensionAttributes: [
							{
								Dimension: "b",
								Role: "com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Series"
							}, {
								Dimension: "a",
								Role: "com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Category"
							}
						],
						Measures: [
							"c"
						],
						MeasureAttributes: [
							{
								Measure: "c",
								Role: "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis1"
							}
						]
					}
				}
			]
		});
	});

	QUnit.test("Visualizations: dimension reordered", function(assert) {
		var oControlDataInitial,
			oContent;

		// arrange
		this.oChart = new Chart({
			width: '100%',
			isAnalytical: true,
			uiConfig: {
				applicationSet: 'fiori'
			},
			chartType: ChartType.Column,
			selectionMode: SelectionMode.Single,
			visibleDimensions: [
				"b", "a"
			],
			visibleMeasures: [
				"c", "d"
			],
			dimensions: [
				new Dimension({
					label: "dimension1",
					name: "b",
					role: "series",
					customData: new CustomData({
						key: "p13nData",
						value: {
							columnKey: "b"
						}
					})
				}), new Dimension({
					label: "dimension1",
					name: "a",
					customData: new CustomData({
						key: "p13nData",
						value: {
							columnKey: "a"
						}
					})
				})
			],
			measures: [
				new Measure({
					label: "measure1",
					name: "c",
					customData: new CustomData({
						key: "p13nData",
						value: {
							columnKey: "c"
						}
					})
				}),
				new Measure({
					label: "measure2",
					name: "d",
					customData: new CustomData({
						key: "p13nData",
						value: {
							columnKey: "d"
						}
					})
				})
			]
		});
		this.oController = new Controller({
			table: ChartWrapper.createChartWrapper(this.oChart, [], [
				"b", "a", "c", "d"
			]),
			setting: {
				dimeasure: {
					visible: true
				},
				sort: {
					visible: false
				},
				filter: {
					visible: false
				}
			}
		});

		// Reordering of ControlData
		oControlDataInitial = this.oController._oSettingCurrent.dimeasure.controller.getControlDataInitial();
		oControlDataInitial.dimeasure.dimeasureItems[0].index = 1;
		oControlDataInitial.dimeasure.dimeasureItems[1].index = 0;
		oControlDataInitial.dimeasure.dimeasureItems[2].index = 3;
		oControlDataInitial.dimeasure.dimeasureItems[3].index = 2;

		sinon.stub(this.oController._oSettingCurrent.dimeasure.controller, "getControlData").returns(oControlDataInitial);

		// act
		var oDataSuiteFormat = {};
		this.oController._oSettingCurrent.dimeasure.controller.getDataSuiteFormatSnapshot(oDataSuiteFormat);

		oContent = oDataSuiteFormat.Visualizations[0].Content;

		// assert
		assert.deepEqual(oContent.Dimensions, ['a', 'b'], "Dimensions are properly reordered");
		assert.deepEqual(oContent.DimensionAttributes, [
			{
				"Dimension": "a",
				"Role": "com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Category"
			},
			{
				"Dimension": "b",
				"Role": "com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Series"
			}
		], "DimensionAttributes are properly reordered");
		assert.deepEqual(oContent.Measures, ['d', 'c'], "Measures are properly reordered");
		assert.deepEqual(oContent.MeasureAttributes, [
			{
				"Measure": "d",
				"Role": "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis1"
			},
			{
				"Measure": "c",
				"Role": "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis1"
			}
		], "MeasureAttributes are properly reordered");
	});

	QUnit.module("getDataSuiteFormat2Json: empty and not existing", {
		beforeEach: function() {
			this.oDimeasureController = new DimeasureController();
			this.oDimeasureController.initializeInternalModel(new JSONModel());
		},
		afterEach: function() {
			this.oDimeasureController.destroy();
		}
	});
	QUnit.test("empty", function(assert) {
		assert.deepEqual(this.oDimeasureController.getDataSuiteFormat2Json({}), {
			dimeasure: {
				dimeasureItems: []
			}
		});
		assert.deepEqual(this.oDimeasureController.getDataSuiteFormat2Json({
			Visualizations: [
				{
					Type: "Chart",
					Content: {
						ChartType: "com.sap.vocabularies.UI.v1.ChartType/Column",
						Dimensions: [],
						DimensionAttributes: [],
						Measures: [],
						MeasureAttributes: []
					}
				}
			]
		}), {
			dimeasure: {
				chartTypeKey: "column",
				dimeasureItems: []
			}
		});
	});
	QUnit.test("not existing column", function(assert) {
		assert.deepEqual(this.oDimeasureController.getDataSuiteFormat2Json({
			Visualizations: [
				{
					Type: "Chart",
					Content: {
						ChartType: "com.sap.vocabularies.UI.v1.ChartType/Column",
						Dimensions: [
							"DummyD"
						],
						DimensionAttributes: [],
						Measures: [
							"DummyM"
						],
						MeasureAttributes: []
					}
				}
			]
		}), {
			dimeasure: {
				chartTypeKey: "column",
				dimeasureItems: [
					{
						columnKey: "DummyD",
						index: 0,
						visible: true,
						aggregationRole: AggregationRole.Dimension
					}, {
						columnKey: "DummyM",
						index: 1,
						visible: true,
						aggregationRole: AggregationRole.Measure
					}
				]
			}
		});
	});
	QUnit.test("existing visible measure(s) and dimension(s)", function(assert) {
		assert.deepEqual(this.oDimeasureController.getDataSuiteFormat2Json({
			Visualizations: [
				{
					Type: "Chart",
					Content: {
						ChartType: "com.sap.vocabularies.UI.v1.ChartType/Column",
						Dimensions: [],
						DimensionAttributes: [],
						Measures: [
							"c"
						],
						MeasureAttributes: [
							{
								Measure: "c",
								Role: "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis1"
							}
						]
					}
				}
			]
		}), {
			dimeasure: {
				chartTypeKey: "column",
				dimeasureItems: [
					{
						columnKey: "c",
						index: 0,
						visible: true,
						role: "axis1",
						aggregationRole: AggregationRole.Measure
					}
				]
			}
		});
		assert.deepEqual(this.oDimeasureController.getDataSuiteFormat2Json({
			Visualizations: [
				{
					Type: "Chart",
					Content: {
						ChartType: "com.sap.vocabularies.UI.v1.ChartType/Column",
						Dimensions: [
							"b"
						],
						DimensionAttributes: [
							{
								Dimension: "b",
								Role: "com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Series"
							}
						],
						Measures: [
							"c"
						],
						MeasureAttributes: [
							{
								Measure: "c",
								Role: "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis1"
							}
						]
					}
				}
			]
		}), {
			dimeasure: {
				chartTypeKey: "column",
				dimeasureItems: [
					{
						columnKey: "b",
						index: 0,
						visible: true,
						role: "series",
						aggregationRole: AggregationRole.Dimension
					}, {
						columnKey: "c",
						index: 1,
						visible: true,
						role: "axis1",
						aggregationRole: AggregationRole.Measure
					}
				]
			}
		});
		assert.deepEqual(this.oDimeasureController.getDataSuiteFormat2Json({
			Visualizations: [
				{
					Type: "Chart",
					Content: {
						ChartType: "com.sap.vocabularies.UI.v1.ChartType/Column",
						Dimensions: [
							"b", "a"
						],
						DimensionAttributes: [
							{
								Dimension: "b",
								Role: "com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Series"
							}, {
								Dimension: "a",
								Role: "com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Category"
							}
						],
						Measures: [
							"c"
						],
						MeasureAttributes: [
							{
								Measure: "c",
								Role: "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis1"
							}
						]
					}
				}
			]
		}), {
			dimeasure: {
				chartTypeKey: "column",
				dimeasureItems: [
					{
						columnKey: "b",
						index: 0,
						visible: true,
						role: "series",
						aggregationRole: AggregationRole.Dimension
					}, {
						columnKey: "a",
						index: 1,
						visible: true,
						role: "category",
						aggregationRole: AggregationRole.Dimension
					}, {
						columnKey: "c",
						index: 2,
						visible: true,
						role: "axis1",
						aggregationRole: AggregationRole.Measure
					}
				]
			}
		});
	});

	QUnit.test("'getChangeType' should return 'Unchanged' in case no update is required'", function(assert){

		var oInitial = {
			dimeasure: {
				chartTypeKey: "column",
				dimeasureItems: [
					{
						aggregationRole: "Dimension",
						columnKey: "Name",
						index: 0,
						role: "category",
						visible: true
					}
				]
			}
		};

		var oChanged = {
			dimeasure: {
				chartTypeKey: "column",
				dimeasureItems: [
					{
						aggregationRole: "Dimension",
						columnKey: "Name",
						index: 0,
						role: "category",
						visible: true
					}
				]
			}
		};

		assert.equal(this.oDimeasureController.getChangeType(oInitial, oChanged), CompLibrary.personalization.ChangeType.Unchanged, "No Update required");
	});

	QUnit.test("'getChangeType' should return a model change to trigger a rebind on the Inner Chart", function(assert){

		var oInitial = {
			dimeasure: {
				chartTypeKey: "column",
				dimeasureItems: [
					{
						aggregationRole: "Dimension",
						columnKey: "Name",
						index: 0,
						role: "category",
						visible: true
					}
				]
			}
		};

		var oChanged = {
			dimeasure: {
				chartTypeKey: "column",
				dimeasureItems: [
					{
						aggregationRole: "Dimension",
						columnKey: "Name",
						index: 0,
						role: "category",
						visible: false
					}
				]
			}
		};

		assert.equal(this.oDimeasureController.getChangeType(oInitial, oChanged), CompLibrary.personalization.ChangeType.ModelChanged, "ModelChanged returned");
	});
});
