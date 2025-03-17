/*global QUnit sinon*/

sap.ui.define([
	"sap/gantt/misc/Format",
    "sap/gantt/simple/GanttRowAction",
    "sap/gantt/simple/StockChart",
	"sap/gantt/simple/StockChartDimension",
	"sap/gantt/simple/StockChartPeriod",
	"sap/ui/core/theming/Parameters",
	"sap/gantt/simple/GanttRowSettings",
	"sap/gantt/simple/test/GanttQUnitUtils",
	"sap/gantt/simple/GanttChartWithTable",
	"sap/ui/table/TreeTable",
	"sap/gantt/axistime/ProportionZoomStrategy",
	"sap/gantt/config/TimeHorizon",
	"sap/base/Log",
    "sap/ui/table/Column",
    "sap/gantt/simple/ListLegend",
    "sap/gantt/simple/ListLegendItem",
	"sap/gantt/simple/GanttChartContainer",
	"sap/gantt/simple/ContainerToolbar",
	"sap/m/Label",
	"sap/ui/core/Lib"
],function(
	Format,
    GanttRowAction,
    StockChart,
    StockChartDimension,
    StockChartPeriod,
    Parameters,
    GanttRowSettings,
    GanttQUnitUtils,
    GanttChartWithTable,
    TreeTable,
    ProportionZoomStrategy,
    TimeHorizon,
    Log,
    Column,
    ListLegend,
    ListLegendItem,
    GanttChartContainer,
    ContainerToolbar,
    Label,
    Lib
) {
	"use strict";

	var aTimeRange = [Format.abapTimestampToDate("20180101000000"), Format.abapTimestampToDate("20180331235959")];
    var aPositivePeriods = [
		{
			from: "20180101000000",
			to: "20180101000000",
			value: 0
		},
		{
			from: "20180101000000",
			to: "20180201000000",
			value: 0
		},
		{
			from: "20180201000000",
			to: "20180201000000",
			value: 100
		},
		{
			from: "20180201000000",
			to: "20180301000000",
			value: 100
		},
		{
			from: "20180301000000",
			to: "20180301000000",
			value: 0
		},
		{
			from: "20180301000000",
			to: "20180331000000",
			value: 0
		}
	].map(function(oItem){
		oItem.from = Format.abapTimestampToDate(oItem.from);
		oItem.to = Format.abapTimestampToDate(oItem.to);
		return oItem;
	});

    var aPositiveThresholdPeriods = [
		{
			from: "20180101000000",
			to: "20180101000000",
			value: 0
		},
		{
			from: "20180101000000",
			to: "20180110000000",
			value: 40
		},
		{
			from: "20180110000000",
			to: "20180120000000",
			value: 80
		},
		{
			from: "20180120000000",
			to: "20180301000000",
			value: 80
		},
		{
			from: "20180301000000",
			to: "20180331000000",
			value: 20
		},
		{
			from: "20180331000000",
			to: "20180331000000",
			value: 10
		}
	].map(function(oItem){
		oItem.from = Format.abapTimestampToDate(oItem.from);
		oItem.to = Format.abapTimestampToDate(oItem.to);
		return oItem;
	});



    var oRowData = {
        mainDimension : aPositivePeriods,
        thresholdPeriods : aPositiveThresholdPeriods,
        name: "Truck1",
        description: "Truck1 description"
    };

    var oData = {
        root: {
            name: 'Root',
            description: 'Root Description',
            rows: [oRowData]
        }
    };
    var oJSONModel = new sap.ui.model.json.JSONModel();
    oJSONModel.setData(oData);

    QUnit.module("GanttRowAction basics", {
		beforeEach: function() {
            this.sut = new GanttChartWithTable({
                table: new TreeTable({
                    id: "table",
                    rowActionCount: 2,
                    columns: [
                        new Column({
                            label: new Label({
                                text: "Name"
                            }),
                            template: new Label({
                                text: "{name}"
                            })
                        }),
                        new Column({
                            label: new Label({
                                text: "Description"
                            }),
                            template: new Label({
                                text: "{description}"
                            })
                        })
                    ],
                    rowSettingsTemplate: new GanttRowSettings({
                            shapes1: [
                                new StockChart({
                                    time: aTimeRange[0],
                                    endTime: aTimeRange[1],
                                    stockChartDimensions: [
                                        new StockChartDimension({
                                            name: "Weight",
                                            dimensionPathColor: "yellow",
                                            remainCapacityColor: "pink",
                                            stockChartPeriods: {
                                                path :"mainDimension",
                                                relativePoint: 20,
                                                template: new StockChartPeriod({
                                                    from: "{from}",
                                                    to: "{to}",
                                                    value: "{value}"
                                                }),
                                                templateSharable: true
                                            }
                                        }),
                                        new StockChartDimension({
                                            name: "Weight limit",
                                            dimensionPathColor: "red",
                                            remainCapacityColor: "red",
                                            isThreshold: true,
                                            relativePoint:10,
                                            stockChartPeriods: {
                                                path :"thresholdPeriods",
                                                template: new StockChartPeriod({
                                                    from: "{from}",
                                                    to: "{to}",
                                                    value: "{value}"
                                                }),
                                                templateSharable: true
                                            }
                                        })
                                    ]
                                })
                            ]
                    }),
                    rowActionTemplate: new GanttRowAction({
                        controlTemplate : new ListLegend({
                            title: "Legends",
                            items:[
                                new ListLegendItem({
                                    legendName: "Legend1"
                                })
                            ]

                        })
                    })
                }).bindRows("/root"),
                axisTimeStrategy: new ProportionZoomStrategy({
                    totalHorizon: new TimeHorizon({
                        startTime:"20180101000000",
                        endTime: "20180331235959"
                    }),
                    visibleHorizon: new TimeHorizon({
                        startTime:"20180101000000",
                        endTime: "20180331235959"
                    })
                })
            });
            this.sut.setModel(oJSONModel);
            this.sut.placeAt("qunit-fixture");
		},
		afterEach: function() {
            if (this.sut.getParent().isA("sap.gantt.simple.GanttChartContainer")) {
                this.sut.getParent().destroy();
            }
			this.sut.destroy();
			this.sut = null;
		}
	});

    QUnit.test("Initial Rendering", function(assert) {
        var done = assert.async();
        var oAccessibilityInfo = {focusable: true, enabled: true, description: ""};
		return GanttQUnitUtils.waitForGanttRendered(this.sut).then(function () {
			setTimeout(function(){
		        assert.notEqual(window.document.getElementById(this.sut.getTable().getRows()[0].getAggregation("_rowAction").getId()), null, "GanttRowAction column should be rendered");
                var oGanttoAccessibilityInfo = this.sut.getTable().getRowActionTemplate().getAccessibilityInfo();
                var bIsMatching = oGanttoAccessibilityInfo.focusable == oAccessibilityInfo.focusable
                                    &&  oGanttoAccessibilityInfo.enabled == oAccessibilityInfo.enabled
                                    && oGanttoAccessibilityInfo.description == oAccessibilityInfo.description;
                assert.ok(bIsMatching, "RowActionTemplte.getAccessibilityInfo() is set correctly from Gantt");
                done();
            }.bind(this),500);
        }.bind(this));
	});

	QUnit.test("Property - Default Values", function(assert) {
        var done = assert.async();
        return GanttQUnitUtils.waitForGanttRendered(this.sut).then(function () {
			setTimeout(function(){
                assert.equal(this.sut.getTable().getRowActionTemplate().getColumnWidth(), 192, "Default column width for the ganttRowAction Column");
                assert.equal(this.sut.getTable().getRowActionTemplate().getColumnContent(), "ThresholdwithLabelandUOM", "Default ColumnContent");
                assert.equal(window.document.getElementById(this.sut.getTable().getId() + '-sapUiTableRowActionScr').style.width, "192px", "Row ActionColumn is having the Default Width");
                assert.equal(window.document.getElementById(this.sut.getTable().getId() + '-rowacthdr').style.width, "192px", "Row ActionColumn header is having the Default Width");
                assert.equal(window.document.getElementById(this.sut.getTable().getId() + '-sapUiTableColHdrScr').style.marginRight, "192px", "Table Column Header is having a left margin equal to ganttRowAction column width");
                assert.equal(window.document.getElementById(this.sut.getTable().getId() + '-sapUiTableCtrlScr').style.marginRight, "192px", "Table Column is having a left margin equal to ganttRowAction column width");
                done();
            }.bind(this),500);
        }.bind(this));
	});

    QUnit.test("Test find and select on gantt chart with time continuous shapes - StockChart", function(assert) {
        var done = assert.async();

        var oResourceBundle = Lib.getResourceBundleFor("sap.gantt");
        var oGanttContainer = new GanttChartContainer({
            toolbar: new ContainerToolbar({
                showSearchButton: true,
                content: [
                    new sap.m.Text({
                        text: "This is gantt toolbar--"
                    })
                ]
            }),
            ganttCharts: [this.sut]
        });
        oGanttContainer.placeAt("qunit-fixture");
        return GanttQUnitUtils.waitForGanttRendered(this.sut).then(function () {
            setTimeout(function(){
                var oToolbar = oGanttContainer.getToolbar();
                assert.equal(this.sut._bTimeContinuousShapes, null, "Time continuous shape flag is null by default");
                oToolbar._oSearchButton.firePress();
                oToolbar._searchFlexBox.getItems()[0].setValue("A");
                oToolbar._searchFlexBox.getItems()[0].fireSearch();
                setTimeout(function(){
                    assert.equal(this.sut._bTimeContinuousShapes, true, "Time continuous shape flag is set to true");
                    assert.equal(oToolbar._searchFlexBox.getItems()[2].getText(), oResourceBundle.getText("GNT_EMPTY_RESULT_INFO_TOOLBAR"), "No results found");
                    done();
                }.bind(this),500);
            }.bind(this),500);
        }.bind(this));
    });

    QUnit.module("GanttRowAction ThresholdwithLabel", {
		beforeEach: function() {
            this.sut = new GanttChartWithTable({
                table: new TreeTable({
                    id: "table",
                    rowActionCount: 2,
                    columns: [
                        new Column({
                            label: new Label({
                                text: "Name"
                            }),
                            template: new Label({
                                text: "{name}"
                            })
                        }),
                        new Column({
                            label: new Label({
                                text: "Description"
                            }),
                            template: new Label({
                                text: "{description}"
                            })
                        })
                    ],
                    rowSettingsTemplate: new GanttRowSettings({
                            shapes1: [
                                new StockChart({
                                    time: aTimeRange[0],
                                    endTime: aTimeRange[1],
                                    stockChartDimensions: [
                                        new StockChartDimension({
                                            name: "Weight",
                                            dimensionPathColor: "yellow",
                                            remainCapacityColor: "pink",
                                            stockChartPeriods: {
                                                path :"mainDimension",
                                                relativePoint: 20,
                                                template: new StockChartPeriod({
                                                    from: "{from}",
                                                    to: "{to}",
                                                    value: "{value}"
                                                }),
                                                templateSharable: true
                                            }
                                        }),
                                        new StockChartDimension({
                                            name: "Weight limit",
                                            dimensionPathColor: "red",
                                            remainCapacityColor: "red",
                                            isThreshold: true,
                                            relativePoint:10,
                                            stockChartPeriods: {
                                                path :"thresholdPeriods",
                                                template: new StockChartPeriod({
                                                    from: "{from}",
                                                    to: "{to}",
                                                    value: "{value}"
                                                }),
                                                templateSharable: true
                                            }
                                        })
                                    ]
                                })
                            ]
                    }),
                    rowActionTemplate: new GanttRowAction({
                        columnContent: "ThresholdwithLabel",
                        controlTemplate : new ListLegend({
                            title: "Legends",
                            items:[
                                new ListLegendItem({
                                    legendName: "Legend1"
                                })
                            ]

                        })
                    })
                }).bindRows("/root"),
                axisTimeStrategy: new ProportionZoomStrategy({
                    totalHorizon: new TimeHorizon({
                        startTime:"20180101000000",
                        endTime: "20180331235959"
                    }),
                    visibleHorizon: new TimeHorizon({
                        startTime:"20180101000000",
                        endTime: "20180331235959"
                    })
                })
            });
            this.sut.setModel(oJSONModel);
            this.sut.placeAt("qunit-fixture");

		},
		afterEach: function() {
			this.sut.destroy();
			this.sut = null;
		}
	});

    QUnit.test("Property values after rendering", function(assert) {
        var done = assert.async();
        return GanttQUnitUtils.waitForGanttRendered(this.sut).then(function () {
			setTimeout(function(){
                assert.equal(this.sut.getTable().getRowActionTemplate().getColumnContent(), "ThresholdwithLabel", "ColumnContent value should be ThresholdwithLabel");
                assert.equal(window.document.getElementById(this.sut.getTable().getId() + '-sapUiTableRowActionScr').style.width, "124px", "Row ActionColumn is having the defined Width for ThresholdwithLabel");
                assert.equal(window.document.getElementById(this.sut.getTable().getId() + '-rowacthdr').style.width, "124px", "Row ActionColumn header is having the Default Width");
                assert.equal(window.document.getElementById(this.sut.getTable().getId() + '-sapUiTableColHdrScr').style.marginRight, "124px", "Table Column Header is having a left margin equal to ganttRowAction column width");
                assert.equal(window.document.getElementById(this.sut.getTable().getId() + '-sapUiTableCtrlScr').style.marginRight, "124px", "Table Column is having a left margin equal to ganttRowAction column width");
                done();
            }.bind(this),500);
        }.bind(this));
	});

    QUnit.module("GanttRowAction ThresholdwithUOM", {
		beforeEach: function() {
            this.sut = new GanttChartWithTable({
                table: new TreeTable({
                    id: "table",
                    rowActionCount: 2,
                    columns: [
                        new Column({
                            label: new Label({
                                text: "Name"
                            }),
                            template: new Label({
                                text: "{name}"
                            })
                        }),
                        new Column({
                            label: new Label({
                                text: "Description"
                            }),
                            template: new Label({
                                text: "{description}"
                            })
                        })
                    ],
                    rowSettingsTemplate: new GanttRowSettings({
                            shapes1: [
                                new StockChart({
                                    time: aTimeRange[0],
                                    endTime: aTimeRange[1],
                                    stockChartDimensions: [
                                        new StockChartDimension({
                                            name: "Weight",
                                            dimensionPathColor: "yellow",
                                            remainCapacityColor: "pink",
                                            stockChartPeriods: {
                                                path :"mainDimension",
                                                relativePoint: 20,
                                                template: new StockChartPeriod({
                                                    from: "{from}",
                                                    to: "{to}",
                                                    value: "{value}"
                                                }),
                                                templateSharable: true
                                            }
                                        }),
                                        new StockChartDimension({
                                            name: "Weight limit",
                                            dimensionPathColor: "red",
                                            remainCapacityColor: "red",
                                            isThreshold: true,
                                            relativePoint:10,
                                            stockChartPeriods: {
                                                path :"thresholdPeriods",
                                                template: new StockChartPeriod({
                                                    from: "{from}",
                                                    to: "{to}",
                                                    value: "{value}"
                                                }),
                                                templateSharable: true
                                            }
                                        })
                                    ]
                                })
                            ]
                    }),
                    rowActionTemplate: new GanttRowAction({
                        columnContent: "ThresholdwithUOM",
                        controlTemplate : new ListLegend({
                            title: "Legends",
                            items:[
                                new ListLegendItem({
                                    legendName: "Legend1"
                                })
                            ]

                        })
                    })
                }).bindRows("/root"),
                axisTimeStrategy: new ProportionZoomStrategy({
                    totalHorizon: new TimeHorizon({
                        startTime:"20180101000000",
                        endTime: "20180331235959"
                    }),
                    visibleHorizon: new TimeHorizon({
                        startTime:"20180101000000",
                        endTime: "20180331235959"
                    })
                })
            });
            this.sut.setModel(oJSONModel);
            this.sut.placeAt("qunit-fixture");
		},
		afterEach: function() {
			this.sut.destroy();
			this.sut = null;
		}
	});

    QUnit.test("Property values after rendering", function(assert) {
        var done = assert.async();
        return GanttQUnitUtils.waitForGanttRendered(this.sut).then(function () {
			setTimeout(function(){
                assert.equal(this.sut.getTable().getRowActionTemplate().getColumnContent(), "ThresholdwithUOM", "ColumnContent value should be ThresholdwithUOM");
                assert.equal(window.document.getElementById(this.sut.getTable().getId() + '-sapUiTableRowActionScr').style.width, "128px", "Row ActionColumn is having the defined Width for ThresholdwithUOM");
                assert.equal(window.document.getElementById(this.sut.getTable().getId() + '-rowacthdr').style.width, "128px", "Row ActionColumn header is having the Default defined for ThresholdwithUOM");
                assert.equal(window.document.getElementById(this.sut.getTable().getId() + '-sapUiTableColHdrScr').style.marginRight, "128px", "Table Column Header is having a left margin equal to ganttRowAction column width");
                assert.equal(window.document.getElementById(this.sut.getTable().getId() + '-sapUiTableCtrlScr').style.marginRight, "128px", "Table Column is having a left margin equal to ganttRowAction column width");
                done();
            }.bind(this),500);
        }.bind(this));
	});

    QUnit.module("GanttRowAction OnlyThreshold", {
		beforeEach: function() {
            this.sut = new GanttChartWithTable({
                table: new TreeTable({
                    id: "table",
                    rowActionCount: 2,
                    columns: [
                        new Column({
                            label: new Label({
                                text: "Name"
                            }),
                            template: new Label({
                                text: "{name}"
                            })
                        }),
                        new Column({
                            label: new Label({
                                text: "Description"
                            }),
                            template: new Label({
                                text: "{description}"
                            })
                        })
                    ],
                    rowSettingsTemplate: new GanttRowSettings({
                            shapes1: [
                                new StockChart({
                                    time: aTimeRange[0],
                                    endTime: aTimeRange[1],
                                    stockChartDimensions: [
                                        new StockChartDimension({
                                            name: "Weight",
                                            dimensionPathColor: "yellow",
                                            remainCapacityColor: "pink",
                                            stockChartPeriods: {
                                                path :"mainDimension",
                                                relativePoint: 20,
                                                template: new StockChartPeriod({
                                                    from: "{from}",
                                                    to: "{to}",
                                                    value: "{value}"
                                                }),
                                                templateSharable: true
                                            }
                                        }),
                                        new StockChartDimension({
                                            name: "Weight limit",
                                            dimensionPathColor: "red",
                                            remainCapacityColor: "red",
                                            isThreshold: true,
                                            relativePoint:10,
                                            stockChartPeriods: {
                                                path :"thresholdPeriods",
                                                template: new StockChartPeriod({
                                                    from: "{from}",
                                                    to: "{to}",
                                                    value: "{value}"
                                                }),
                                                templateSharable: true
                                            }
                                        })
                                    ]
                                })
                            ]
                    }),
                    rowActionTemplate: new GanttRowAction({
                        columnContent: "OnlyThreshold",
                        controlTemplate : new ListLegend({
                            title: "Legends",
                            items:[
                                new ListLegendItem({
                                    legendName: "Legend1"
                                })
                            ]

                        })
                    })
                }).bindRows("/root"),
                axisTimeStrategy: new ProportionZoomStrategy({
                    totalHorizon: new TimeHorizon({
                        startTime:"20180101000000",
                        endTime: "20180331235959"
                    }),
                    visibleHorizon: new TimeHorizon({
                        startTime:"20180101000000",
                        endTime: "20180331235959"
                    })
                })
            });
            this.sut.setModel(oJSONModel);
            this.sut.placeAt("qunit-fixture");

		},
		afterEach: function() {
			this.sut.destroy();
			this.sut = null;
		}
	});
    QUnit.test("Side panel display on gantt rows count changes", function(assert) {
        var done = assert.async();
        this.container = new GanttChartContainer({
            toolbar: new ContainerToolbar({
                showBirdEyeButton: true,
                showDisplayTypeButton: true,
                showLegendButton: true,
                showSearchButton: true,
                content: [
                    new sap.m.Text({
                        text: "This is gantt toolbar--"
                    })
                ]
            }),
            ganttCharts: [this.sut]
        });
        this.container.placeAt("qunit-fixture");
        this.container.getToolbar().attachGanttSidePanel(function(oEVent) {
            oEVent.getParameters().updateSidePanelState.enable();
        });
        return GanttQUnitUtils.waitForGanttRendered(this.sut).then(function () {
            this.container.getToolbar()._searchFlexBox.getItems()[4].firePress();
            return GanttQUnitUtils.waitForGanttRendered(this.sut).then(function () {
                assert.equal(this.container.getSearchSidePanel().isA("sap.gantt.simple.GanttSearchSidePanel") ,true, "Sidepanel and ganttchart should be displayed without any error");
                done();
            }.bind(this));
        }.bind(this));
	});

    QUnit.test("Property values after rendering", function(assert) {
        var done = assert.async();
        return GanttQUnitUtils.waitForGanttRendered(this.sut).then(function () {
			setTimeout(function(){
                assert.equal(this.sut.getTable().getRowActionTemplate().getColumnContent(), "OnlyThreshold", "ColumnContent value should be OnlyThreshold");
                assert.equal(window.document.getElementById(this.sut.getTable().getId() + '-sapUiTableRowActionScr').style.width, "52px", "Row ActionColumn is having the defined Width for OnlyThreshold");
                assert.equal(window.document.getElementById(this.sut.getTable().getId() + '-rowacthdr').style.width, "52px", "Row ActionColumn header is having the Default defined for OnlyThreshold");
                assert.equal(window.document.getElementById(this.sut.getTable().getId() + '-sapUiTableColHdrScr').style.marginRight, "52px", "Table Column Header is having a left margin equal to ganttRowAction column width");
                assert.equal(window.document.getElementById(this.sut.getTable().getId() + '-sapUiTableCtrlScr').style.marginRight, "52px", "Table Column is having a left margin equal to ganttRowAction column width");
                done();
            }.bind(this),500);
        }.bind(this));
	});

    QUnit.test("Style values not set in case of rows not available", function(assert) {
        var done = assert.async();
        return GanttQUnitUtils.waitForGanttRendered(this.sut).then(function () {
            this.sut.getTable().getRows()[0].getRowAction().setColumnWidth(75);
            var rowStub =  sinon.stub(this.sut.getTable().getRows()[0].getRowAction(),"getRow").returns(null);
            this.sut.getTable().getRows()[0].getRowAction().setTableColumnStyle();
            assert.equal(window.document.getElementById(this.sut.getTable().getId() + '-sapUiTableRowActionScr').style.width, "52px", "Row Action Column width is not changed to 75 since column style not applied");
            rowStub.restore();
            done();
        }.bind(this));
	});
});
