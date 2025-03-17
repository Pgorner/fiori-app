sap.ui.define([
	"sap/gantt/simple/GanttRowSettings",
	"sap/gantt/simple/BaseRectangle",
	"sap/gantt/simple/BaseCalendar",
	"sap/gantt/simple/GanttChartWithTable",
	"sap/gantt/simple/MarkerType",
	"sap/ui/table/TreeTable",
	"sap/ui/table/Column",
	"sap/m/Label",
	"sap/m/Text",
	"sap/ui/core/CustomData",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/model/type/Date",
	"sap/ui/table/Table",
	"sap/gantt/axistime/ProportionZoomStrategy",
	"sap/gantt/config/TimeHorizon",
	"sap/gantt/misc/Format",
	"sap/ui/core/util/MockServer",
	"sap/gantt/simple/AdhocLine",
	"sap/gantt/simple/DeltaLine",
	"sap/gantt/def/cal/CalendarDefs",
	"sap/gantt/def/cal/Calendar",
	"sap/gantt/def/cal/TimeInterval",
	"sap/gantt/library",
	"sap/ui/table/rowmodes/Auto",
	"./nextUIUpdate"
], function(GanttRowSettings, BaseRectangle, BaseCalendar, GanttChartWithTable, MarkerType, TreeTable, Column, Label, Text, CustomData, JSONModel, ODataModel, TypeDate, Table,
            ProportionZoomStrategy, TimeHorizon, Format, MockServer, AdhocLine, DeltaLine, CalendarDefs, Calendar, TimeInterval, library, AutoRowMode,
			nextUIUpdate){

	"use strict";
	var iNumberOfRows = 8;

	window.iNumberOfRows = iNumberOfRows;
	window.iNumberOfSubRows = 2;

/*
	+-------------------------------------------------------------+
	|  +--------------------+                                     |
	|  +--------------------+                                     |
	|  +---------+                                                |
	|  +---------+                                                |
	|             +---------+                                     |
	|             +---------+                                     |
	|                            +------------------------+       |
	|                            +------------------------+       |
	|                                                             |
	|                            +------------+                   |
	|                            +------------+                   |
	|                                          +----------+       |
	|                                          +----------+       |
	+-------------------------------------------------------------+
*/
	var fnCreateTestData = function(oVisibleHorizon, iNumberOfRows, iNumberOfSubRows, bCreateExpandData) {
		var oData = {rows: [], tree: {rows: []}};

		var iVisibleStartInMs = Format.abapTimestampToDate(oVisibleHorizon.getStartTime()).getTime(),
			iVisibleEndInMs = Format.abapTimestampToDate(oVisibleHorizon.getEndTime()).getTime();


		// 2 days interval
		var iIntervalInMs = 2 * 24 * 60 * 60 * 1000;
		var iTotalIntervalInMs = (iNumberOfRows - 1) * iIntervalInMs;
		var iDurationInMs = (iVisibleEndInMs - iVisibleStartInMs - iTotalIntervalInMs) / iNumberOfRows;

		var oRow, oSubRow;
		var iStartInMs = iVisibleStartInMs,
			iEndInMs = iStartInMs + iDurationInMs;
		for (var i = 0; i < iNumberOfRows; i++) {
			oRow = {
				"Id" : i,
				"Name": "Row_" + i,
				"StartDate": new Date(iStartInMs),
				"EndDate": new Date(iEndInMs)
			};

			if (bCreateExpandData) {
				// split the row duration into 3 parts, means the row represent 3 sub breaks
				var iNumOfPart = 3;
				var iPartInMs = Math.floor((iEndInMs - iStartInMs) / iNumOfPart);
				oRow.breaks = [];

				var iStartPartInMs = iStartInMs;
				for (var iPart = 0; iPart < iNumOfPart; iPart++) {
					oRow.breaks.push({
						"Id": oRow.Id + "_PART_" + iPart,
						"StartDate": new Date(iStartPartInMs),
						"EndDate": new Date(iStartPartInMs + iPartInMs)
					});
					iStartPartInMs += iPartInMs;
				}
			}

			oData.rows.push(jQuery.extend({}, oRow));

			var aSubRows = [];
			var oSubStart = new Date(iStartInMs);
			for (var j = 0; j < iNumberOfSubRows; j++) {
				oSubRow = {
					"Id": oRow["Id"] + "_SUB_" + j,
					"Name" : oRow["Name"] + "_SUB_" + j,
					"StartDate": oSubStart,
					"EndDate": new Date(oSubStart.getTime() + (iDurationInMs / iNumberOfSubRows))
				};
				oSubStart = new Date(oSubRow["EndDate"].getTime());
				aSubRows.push(oSubRow);
			}
			oRow.rows = aSubRows;
			oData.tree.rows.push(oRow);

			// the next row start time in millison seconds
			iStartInMs = iEndInMs + iIntervalInMs;
			iEndInMs = iStartInMs + iDurationInMs;
		}
		return oData;
	};

	var fnCreateDefaultShapeBindingSettings = function(){
		return new GanttRowSettings({
			rowId: "{Id}",
			shapes1: [
				new BaseRectangle({
					shapeId: "{Id}",
					time: "{StartDate}",
					endTime: "{EndDate}",
					title: "{Name}",
					fill: "#008FD3",
					selectable: true
				})
			]
		});
	};

	var oGanttChart;
	var createGanttChart = function(bSkipPlaceAt, oRowSettingTemplate, bCreateExpandData) {
		oRowSettingTemplate = oRowSettingTemplate || fnCreateDefaultShapeBindingSettings();
		oGanttChart = new GanttChartWithTable("Fiori.Elements:ID.with.dots.to.test.jQuery.escaping", {
			table: new TreeTable({
				id: "table",
				selectionMode: "Single",
				selectionBehavior: "Row",
				rows: {
					path: "/tree",
					parameters: {arrayNames: ["rows"]}
				},
				rowMode: new AutoRowMode(),
				columns: [
					new Column({
						width: "250px",
						label: new Label({ text: "Name" }),
						template: new Text({ text: "{Name}", wrapping: false })
					}),
					new Column({
						width: "250px",
						label: new Label({ text: "Start Date" }),
						template: new Text({ text: "{StartDate}", wrapping: false })
					})
				],
				rowSettingsTemplate: oRowSettingTemplate
			}),
			enableSelectAndDrag : false
		});

		window.oGanttChart = oGanttChart;

		var oModel = new JSONModel();

		oModel.setData(fnCreateTestData(library.config.DEFAULT_VISIBLE_HORIZON, window.iNumberOfRows, window.iNumberOfSubRows, !!bCreateExpandData));

		oGanttChart.setModel(oModel);

		if (!bSkipPlaceAt) {
			oGanttChart.placeAt("qunit-fixture");
			nextUIUpdate();
		}
		return oGanttChart;
	};

	var destroyGanttChart = function() {
		oGanttChart.destroy(true/**bSuppressInvalidate*/);
		oGanttChart = null;
	};

	function waitForGanttRendered(oGantt, bWithoutShapes) {
		return oGantt.getInnerGantt().resolveWhenReady(!bWithoutShapes);
	}

	/**
	 * Creates a simple Gantt chart with one row and one provided shape.
	 * @param oShape Shape to render
	 * @param sStartTime Start time of view horizon
	 * @param sEndTime Ent time of view horizon
	 * @returns {*}
	 * @private
	 */
	function createSimpleGantt(oShape, sStartTime, sEndTime) {
		var oGantt = new GanttChartWithTable({
			id: "gantt",
			table: new Table({
				id: "table",
				columns: new Column({
					width: "250px",
					label: new Label({ text: "Text" }),
					template: new Label({ text: "Text" })
				}),
				rowMode: new AutoRowMode(),
				rows: {
					path: "/root"
				},
				rowSettingsTemplate: new GanttRowSettings({
					rowId: "{id}",
					shapes1: oShape
				})
			}),
			axisTimeStrategy: new ProportionZoomStrategy({
				totalHorizon: new TimeHorizon({
					startTime: sStartTime,
					endTime: sEndTime
				}),
				visibleHorizon: new TimeHorizon({
					startTime: sStartTime,
					endTime: sEndTime
				})
			})
		});
		oGantt.setModel(new JSONModel({
			root: [
				{
					id: "row1",
					text: "Row 1"
				}
			]
		}));
		return oGantt;
	}

	/**
	 * Creates a simple Gantt chart with one row, one provided shape and Adhoc & Delta Lines.
	 * @param oShape Shape to render
	 * @param sStartTime Start time of view horizon
	 * @param sEndTime Ent time of view horizon
	 * @returns {*}
	 * @private
	 */
	function createGanttWithLines(oShape, sStartTime, sEndTime) {
		var oGantt = new GanttChartWithTable({
			id: "gantt",
			table: new Table({
				id: "table1",
				columns: new Column({
					width: "250px",
					label: new Label({ text: "Text" }),
					template: new Label({ text: "Text" })
				}),
				rows: {
					path: "/root"
				},
				rowSettingsTemplate: new GanttRowSettings({
					rowId: "{id}",
					shapes1: oShape
				})
			}),
			simpleAdhocLines: [new AdhocLine({
				stroke: "#DC143C",
				strokeDasharray: "5,5",
				strokeOpacity: 0.5,
				timeStamp: "20180103000000",
				description: "Product Release.",
				markerType: MarkerType.Diamond
			})],
			deltaLines: [new DeltaLine({
				stroke: "#DC143C",
				strokeDasharray: "5, 2",
				timeStamp: "20180104000000",
				endTimeStamp: "20180104010000"
			})],
			axisTimeStrategy: new ProportionZoomStrategy({
				totalHorizon: new TimeHorizon({
					startTime: sStartTime,
					endTime: sEndTime
				}),
				visibleHorizon: new TimeHorizon({
					startTime: sStartTime,
					endTime: sEndTime
				})
			})
		});
		window.oGanttChart = oGantt;
		oGantt.setModel(new JSONModel({
			root: [
				{
					id: "row1",
					text: "Row 1"
				}
			]
		}));
		return oGantt;
	}

	/**
	 * Creates a simple Gantt chart with one row and one provided shape with axisTimeStrategy defined by user.
	 * @param oShape Shape to render
	 * @param sStartTime Start time of view horizon
	 * @param sEndTime Ent time of view horizon
	 * @returns {*}
	 * @private
	 */
	function createSimpleGanttwithAxisTimeStratergy(oShape, oAxisTimeStrategy) {
		var oGantt = new GanttChartWithTable({
			id: "gantt",
			table: new Table({
				columns: new Column({
					width: "250px",
					label: new Label({ text: "Text" }),
					template: new Label({ text: "Text" })
				}),
				rowMode: new AutoRowMode(),
				rows: {
					path: "/root"
				},
				rowSettingsTemplate: new GanttRowSettings({
					rowId: "{id}",
					shapes1: oShape
				})
			}),
			axisTimeStrategy: oAxisTimeStrategy
		});
		oGantt.setModel(new JSONModel({
			root: [
				{
					id: "row1",
					text: "Row 1"
				}
			]
		}));
		return oGantt;
	}


	var createGanttWithODataModel =  function(additionalTableId, oRowSettingTemplate) {
		var sServiceUrl = "http://my.test.service.com/";
		var sURLPrefix = sap.ui.require.toUrl("sap/gantt/test/simple");

		var oMockServer = new MockServer({
			rootUri : sServiceUrl
		});
		oMockServer.simulate( sURLPrefix + "/../qunit/data/odata/metadata.xml", {
			sMockdataBaseUrl : sURLPrefix +  "/../qunit/data/odata/",
			bGenerateMissingMockData : true
		});


		oMockServer.start();
		// create data model
		var oDataModel = new ODataModel(sServiceUrl);

		// create configuration model
		var oDateType = new TypeDate({pattern: "dd.MM.yyyy"});

		var oRowSettingTemplate = oRowSettingTemplate || fnCreateDefaultShapeBindingSettingsODataModel();

		// instantiate GanttChartWithTable
		var oGantt = new GanttChartWithTable({
			table: new TreeTable({
				id: additionalTableId ? additionalTableId : "table",
				columns: [
					new Column({
						label: new Label({
							text: "Explanation"
						}),
						sortProperty: "Explanation",
						filterProperty: "Explanation",
						name: "Explanation",
						customData: new CustomData({
							key: "exportTableColumnConfig",
							value: {"columnKey": "Explanation", "leadingProperty":"Explanation", "dataType": "string", "hierarchyNodeLevel": "Level","wrap": true}
						}),
						template: new Label({
							text: {
								path: "Explanation",
								model: "data"
							}
						})
					}),
					new Column({
						label: new Label({
							text: "Obj"
						}),
						sortProperty: "Obj",
						filterProperty: "Obj",
						name: "Obj",
						customData: new CustomData({
							key: "exportTableColumnConfig",
							value: {"columnKey": "Obj", "leadingProperty":"Obj", "dataType": "string", "hierarchyNodeLevel": "Level"}
						}),
						template: new Label({
							text: {
								path: "Obj",
								model: "data"
							}
						})
					}),
					new Column({
						label: new Label({
							text: "Start Date"
						}),
						sortProperty: "StartDate",
						filterProperty: "StartDate",
						name: "StartDate",
						filterType: oDateType,
						customData: new CustomData({
							key: "exportTableColumnConfig",
							value: {"columnKey": "StartDate", "leadingProperty":"StartDate", "dataType": "dateTime", "displayFormat": "mmm-dd, yyyy", "hierarchyNodeLevel": "Level"}
						}),
						template: new Label({
							text: {
								path: "StartDate",
								model: "data",
								type: oDateType
							}
						})
					}),
					new Column({
						label: new Label({
							text: "End Date"
						}),
						sortProperty: "EndDate",
						filterProperty: "EndDate",
						name: "EndDate",
						filterType: oDateType,
						customData: new CustomData({
							key: "exportTableColumnConfig",
							value: {"columnKey": "EndDate", "leadingProperty":"EndDate", "dataType": "dateTime", "displayFormat": "mmm-dd, yyyy", "hierarchyNodeLevel": "Level"}
						}),
						template: new Label({
							text: {
								path: "EndDate",
								model: "data",
								type: oDateType
							}
						})
					}),
					new Column({
						label: new Label({
							text: "ID"
						}),
						sortProperty: "id",
						filterProperty: "id",
						name: "id",
						filterType: oDateType,
						customData: new CustomData({
							key: "exportTableColumnConfig",
							value: {"columnKey": "id", "leadingProperty":"id", "dataType": "numeric", "hierarchyNodeLevel": "Level"}
						}),
						template: new Label({
							text: {
								path: "id",
								model: "data"
							}
						})
					}),
					new Column({
						label: new Label({
							text: "StartConstraint"
						}),
						sortProperty: "StartConstraint",
						filterProperty: "StartConstraint",
						name: "StartConstraint",
						filterType: oDateType,
						customData: new CustomData({
							key: "exportTableColumnConfig",
							value: {"columnKey": "StartConstraint", "leadingProperty":"StartConstraint", "dataType": "numeric", "unit": "kg", "hierarchyNodeLevel": "Level"}
						}),
						template: new Label({
							text: {
								path: "StartConstraint",
								model: "data"
							}
						})
					}),
					new Column({
						label: new Label({
							text: "StartConstraint"
						}),
						sortProperty: "StartConstraint",
						filterProperty: "StartConstraint",
						name: "StartConstraint",
						filterType: oDateType,
						customData: new CustomData({
							key: "exportTableColumnConfig",
							value: {"columnKey": "StartConstraint", "leadingProperty":"StartConstraint", "dataType": "boolean", "hierarchyNodeLevel": "Level"}
						}),
						template: new Label({
							text: {
								path: "StartConstraint",
								model: "data"
							}
						})
					}),
					new Column({
						label: new Label({
							text: "SuperiorGuid"
						}),
						sortProperty: "SuperiorGuid",
						filterProperty: "SuperiorGuid",
						name: "SuperiorGuid",
						filterType: oDateType,
						customData: new CustomData({
							key: "exportTableColumnConfig",
							value: {"columnKey": "SuperiorGuid", "leadingProperty":"SuperiorGuid", "dataType": "numeric", "isCurrency": true, "unitProperty": "Currency", "hierarchyNodeLevel": "Level"}
						}),
						template: new Label({
							text: {
								path: "SuperiorGuid",
								model: "data"
							}
						})
					})],
				rows: {
					path: "data>/ProjectElmSet",
					parameters: {
						numberOfExpandedLevels: 1,
						treeAnnotationProperties: {
							hierarchyLevelFor: "Level",
							hierarchyParentNodeFor: "SuperiorGuid",
							hierarchyNodeFor: "Guid",
							hierarchyDrillStateFor: "DrillDownState"//this option doesn't work
						},
						expand: "Task, WorkingTime, ResourceGreedy"						}
				},
				rowSettingsTemplate : oRowSettingTemplate
			}),
			showExportTableToExcel : false,
			axisTimeStrategy: new ProportionZoomStrategy({
				totalHorizon: new TimeHorizon({
					startTime: "20140628000000",
					endTime: "20170101000000"
				}),
				visibleHorizon: new TimeHorizon({
					startTime: "20150101000000",
					endTime: "20150615000000"
				})
			})

		});

		oGantt.setModel(oDataModel, "data");
		oGantt.placeAt("qunit-fixture");
		nextUIUpdate();
		return oGantt;
	};

	var createGanttWithODataModelMultiactivity =  function(additionalTableId, oRowSettingTemplate) {
		var sServiceUrl = "http://my.test.service.com/";
		var sURLPrefix = sap.ui.require.toUrl("sap/gantt/test/simple");

		var oMockServer = new MockServer({
			rootUri : sServiceUrl
		});
		oMockServer.simulate( sURLPrefix + "/../multiactivity/odata/metadata.xml", {
			sMockdataBaseUrl : sURLPrefix +  "/../multiactivity/odata/",
			bGenerateMissingMockData : true
		});


		oMockServer.start();
		// create data model
		var oDataModel = new ODataModel(sServiceUrl);

		// create configuration model
		var oDateType = new TypeDate({pattern: "dd.MM.yyyy"});

		var oRowSettingTemplate = oRowSettingTemplate || fnCreateDefaultShapeBindingSettingsODataModel();

		// instantiate GanttChartWithTable
		var oGantt = new GanttChartWithTable({
			table: new TreeTable({
				id: additionalTableId ? additionalTableId : "table",
				columns: [
					new Column({
						label: new Label({
							text: "Explanation"
						}),
						sortProperty: "Explanation",
						filterProperty: "Explanation",
						name: "Explanation",
						customData: new CustomData({
							key: "exportTableColumnConfig",
							value: {"columnKey": "Explanation", "leadingProperty":"Explanation", "dataType": "string", "hierarchyNodeLevel": "Level","wrap": true}
						}),
						template: new Label({
							text: {
								path: "Explanation",
								model: "data"
							}
						})
					}),
					new Column({
						label: new Label({
							text: "Obj"
						}),
						sortProperty: "Obj",
						filterProperty: "Obj",
						name: "Obj",
						customData: new CustomData({
							key: "exportTableColumnConfig",
							value: {"columnKey": "Obj", "leadingProperty":"Obj", "dataType": "string", "hierarchyNodeLevel": "Level"}
						}),
						template: new Label({
							text: {
								path: "Obj",
								model: "data"
							}
						})
					}),
					new Column({
						label: new Label({
							text: "Start Date"
						}),
						sortProperty: "StartDate",
						filterProperty: "StartDate",
						name: "StartDate",
						filterType: oDateType,
						customData: new CustomData({
							key: "exportTableColumnConfig",
							value: {"columnKey": "StartDate", "leadingProperty":"StartDate", "dataType": "dateTime", "displayFormat": "mmm-dd, yyyy", "hierarchyNodeLevel": "Level"}
						}),
						template: new Label({
							text: {
								path: "StartDate",
								model: "data",
								type: oDateType
							}
						})
					}),
					new Column({
						label: new Label({
							text: "End Date"
						}),
						sortProperty: "EndDate",
						filterProperty: "EndDate",
						name: "EndDate",
						filterType: oDateType,
						customData: new CustomData({
							key: "exportTableColumnConfig",
							value: {"columnKey": "EndDate", "leadingProperty":"EndDate", "dataType": "dateTime", "displayFormat": "mmm-dd, yyyy", "hierarchyNodeLevel": "Level"}
						}),
						template: new Label({
							text: {
								path: "EndDate",
								model: "data",
								type: oDateType
							}
						})
					}),
					new Column({
						label: new Label({
							text: "ID"
						}),
						sortProperty: "id",
						filterProperty: "id",
						name: "id",
						filterType: oDateType,
						customData: new CustomData({
							key: "exportTableColumnConfig",
							value: {"columnKey": "id", "leadingProperty":"id", "dataType": "numeric", "hierarchyNodeLevel": "Level"}
						}),
						template: new Label({
							text: {
								path: "id",
								model: "data"
							}
						})
					}),
					new Column({
						label: new Label({
							text: "StartConstraint"
						}),
						sortProperty: "StartConstraint",
						filterProperty: "StartConstraint",
						name: "StartConstraint",
						filterType: oDateType,
						customData: new CustomData({
							key: "exportTableColumnConfig",
							value: {"columnKey": "StartConstraint", "leadingProperty":"StartConstraint", "dataType": "numeric", "unit": "kg", "hierarchyNodeLevel": "Level"}
						}),
						template: new Label({
							text: {
								path: "StartConstraint",
								model: "data"
							}
						})
					}),
					new Column({
						label: new Label({
							text: "StartConstraint"
						}),
						sortProperty: "StartConstraint",
						filterProperty: "StartConstraint",
						name: "StartConstraint",
						filterType: oDateType,
						customData: new CustomData({
							key: "exportTableColumnConfig",
							value: {"columnKey": "StartConstraint", "leadingProperty":"StartConstraint", "dataType": "boolean", "hierarchyNodeLevel": "Level"}
						}),
						template: new Label({
							text: {
								path: "StartConstraint",
								model: "data"
							}
						})
					}),
					new Column({
						label: new Label({
							text: "SuperiorGuid"
						}),
						sortProperty: "SuperiorGuid",
						filterProperty: "SuperiorGuid",
						name: "SuperiorGuid",
						filterType: oDateType,
						customData: new CustomData({
							key: "exportTableColumnConfig",
							value: {"columnKey": "SuperiorGuid", "leadingProperty":"SuperiorGuid", "dataType": "numeric", "isCurrency": true, "unitProperty": "Currency", "hierarchyNodeLevel": "Level"}
						}),
						template: new Label({
							text: {
								path: "SuperiorGuid",
								model: "data"
							}
						})
					})],
				rows: {
					path: 'data>/ProjectElems',
					parameters: {
						operationMode: 'Server',
						numberOfExpandedLevels: 1,
						treeAnnotationProperties: {
							hierarchyNodeFor: 'ProjectElemID',
							hierarchyParentNodeFor: 'ParentProjectElemID',
							hierarchyLevelFor: 'Level',
							hierarchyDrillStateFor: 'DrillDownState',
							hierarchyNodeDescendantCountFor: 'Magnitude'
						},
						expand: 'ProjectWorkingTime,ProjectShapes,ProjectTasks/TaskToSteps, ProjectCustomPathShapes, ProjectLazyShapes, ProjectOverlays1Shapes/Overlays1ToOverlay, ProjectOverlays2Shapes/Overlays2ToOverlay, ProjectOverlays3Shapes/Overlays3ToOverlay, ProjectOverlays4Shapes/Overlays4ToOverlay'
					}
				},
				rowSettingsTemplate : oRowSettingTemplate
			}),
			showExportTableToExcel : false,
			axisTimeStrategy: new ProportionZoomStrategy({
				totalHorizon: new TimeHorizon({
					startTime: "20140628000000",
					endTime: "20170101000000"
				}),
				visibleHorizon: new TimeHorizon({
					startTime: "20150101000000",
					endTime: "20150615000000"
				})
			})

		});

		oGantt.setModel(oDataModel, "data");
		const oOverlayModel = new JSONModel({
			overlays: {
				staticOverlays: [
				],
				expandedOverlays: [
				]
			}
		});
		oGantt.setModel(oOverlayModel, "overlayData");
		oGantt.placeAt("qunit-fixture");
		nextUIUpdate();
		return oGantt;
	};

	var createGanttWithODataModelForCalendar =  function(oRowSettingTemplate) {
		var sServiceUrl = "http://my.test.service.com/";
		var sURLPrefix = sap.ui.require.toUrl("sap/gantt/test/simple");

		var oMockServer = new MockServer({
			rootUri : sServiceUrl
		});
		oMockServer.simulate( sURLPrefix + "/../qunit/data/odata/metadata.xml", {
			sMockdataBaseUrl : sURLPrefix +  "/../qunit/data/odata/",
			bGenerateMissingMockData : true
		});

		oMockServer.start();
		// create data model
		var oDataModel = new ODataModel(sServiceUrl);

		// create configuration model
		var oDateType = new TypeDate({pattern: "dd.MM.yyyy"});

		oRowSettingTemplate = oRowSettingTemplate || fnCreateCalendarAndShapeBindingSettingsODataModel();

		// instantiate GanttChartWithTable
		var oGantt = new GanttChartWithTable({
			table: new TreeTable({
				id: "table",
				columns: [
					new Column({
						label: new Label({
							text: {
								path: "Explanation",
								model: "data"
							}
						}),
						sortProperty: "Explanation",
						filterProperty: "Explanation",
						name: "Explanation",
						customData: new CustomData({
							key: "exportTableColumnConfig",
							value: {"columnKey": "Explanation", "leadingProperty":"Explanation", "dataType": "string", "hierarchyNodeLevel": "Level","wrap": true}
						}),
						template: new Label({
							text: {
								path: "Explanation",
								model: "data"
							}
						})
					}),
					new Column({
						label: new Label({
							text: {
								path: "Obj",
								model: "data"
							}
						}),
						sortProperty: "Obj",
						filterProperty: "Obj",
						name: "Obj",
						customData: new CustomData({
							key: "exportTableColumnConfig",
							value: {"columnKey": "Obj", "leadingProperty":"Obj", "dataType": "string", "hierarchyNodeLevel": "Level"}
						}),
						template: new Label({
							text: {
								path: "Obj",
								model: "data"
							}
						})
					}),
					new Column({
						label: new Label({
							text: {
								path: "StartDate",
								model: "data",
								type: oDateType
							}
						}),
						sortProperty: "StartDate",
						filterProperty: "StartDate",
						name: "StartDate",
						filterType: oDateType,
						customData: new CustomData({
							key: "exportTableColumnConfig",
							value: {"columnKey": "StartDate", "leadingProperty":"StartDate", "dataType": "dateTime", "displayFormat": "mmm-dd, yyyy", "hierarchyNodeLevel": "Level"}
						}),
						template: new Label({
							text: {
								path: "StartDate",
								model: "data",
								type: oDateType
							}
						})
					}),
					new Column({
						label: new Label({
							text: {
								path: "EndDate",
								model: "data",
								type: oDateType
							}
						}),
						sortProperty: "EndDate",
						filterProperty: "EndDate",
						name: "EndDate",
						filterType: oDateType,
						customData: new CustomData({
							key: "exportTableColumnConfig",
							value: {"columnKey": "EndDate", "leadingProperty":"EndDate", "dataType": "dateTime", "displayFormat": "mmm-dd, yyyy", "hierarchyNodeLevel": "Level"}
						}),
						template: new Label({
							text: {
								path: "EndDate",
								model: "data",
								type: oDateType
							}
						})
					}),
					new Column({
						label: new Label({
							text: {
								path: "id",
								model: "data"
							}
						}),
						sortProperty: "id",
						filterProperty: "id",
						name: "id",
						filterType: oDateType,
						customData: new CustomData({
							key: "exportTableColumnConfig",
							value: {"columnKey": "id", "leadingProperty":"id", "dataType": "numeric", "hierarchyNodeLevel": "Level"}
						}),
						template: new Label({
							text: {
								path: "id",
								model: "data"
							}
						})
					}),
					new Column({
						label:  new Label({
							text: {
								path: "StartConstraint",
								model: "data"
							}
						}),
						sortProperty: "StartConstraint",
						filterProperty: "StartConstraint",
						name: "StartConstraint",
						filterType: oDateType,
						customData: new CustomData({
							key: "exportTableColumnConfig",
							value: {"columnKey": "StartConstraint", "leadingProperty":"StartConstraint", "dataType": "numeric", "unit": "kg", "hierarchyNodeLevel": "Level"}
						}),
						template: new Label({
							text: {
								path: "StartConstraint",
								model: "data"
							}
						})
					}),
					new Column({
						label:  new Label({
							text: {
								path: "StartConstraint",
								model: "data"
							}
						}),
						sortProperty: "StartConstraint",
						filterProperty: "StartConstraint",
						name: "StartConstraint",
						filterType: oDateType,
						customData: new CustomData({
							key: "exportTableColumnConfig",
							value: {"columnKey": "StartConstraint", "leadingProperty":"StartConstraint", "dataType": "boolean", "hierarchyNodeLevel": "Level"}
						}),
						template: new Label({
							text: {
								path: "StartConstraint",
								model: "data"
							}
						})
					}),
					new Column({
						label: new Label({
							text: {
								path: "SuperiorGuid",
								model: "data"
							}
						}),
						sortProperty: "SuperiorGuid",
						filterProperty: "SuperiorGuid",
						name: "SuperiorGuid",
						filterType: oDateType,
						customData: new CustomData({
							key: "exportTableColumnConfig",
							value: {"columnKey": "SuperiorGuid", "leadingProperty":"SuperiorGuid", "dataType": "numeric", "isCurrency": true, "unitProperty": "Currency", "hierarchyNodeLevel": "Level"}
						}),
						template: new Label({
							text: {
								path: "SuperiorGuid",
								model: "data"
							}
						})
					})],
				rows: {
					path: "data>/ProjectElmSet",
					parameters: {
						numberOfExpandedLevels: 1,
						treeAnnotationProperties: {
							hierarchyLevelFor: "Level",
							hierarchyParentNodeFor: "SuperiorGuid",
							hierarchyNodeFor: "Guid",
							hierarchyDrillStateFor: "DrillDownState"//this option doesn't work
						},
						expand: "Task, WorkingTime, ResourceGreedy"						}
				},
				rowSettingsTemplate : oRowSettingTemplate
			}),
			showExportTableToExcel : false,
			axisTimeStrategy: new ProportionZoomStrategy({
				totalHorizon: new TimeHorizon({
					startTime: "20150101000000",
					endTime: "20150615000000"
				}),
				visibleHorizon: new TimeHorizon({
					startTime: "20150101000000",
					endTime: "20150615000000"
				})
			}),
			calendarDef: new CalendarDefs({
				defs: {
					templateShareable: true,
					path: "data>/ProjectElmSet",
					parameters: {
						expand: "to_NonWorkingTime"
					},
					template: new Calendar({
						key: "NonWorkingTime",
						backgroundColor: "sapUiChartPaletteQualitativeHue9",
						timeIntervals: {
							templateShareable: true,
							path: "data>to_NonWorkingTime",
							template: new TimeInterval({
								startTime: "{data>NonWorkingStartDate}",
								endTime: "{data>NonWorkingEndDate}"
							})
						}
					})
				},
				defs1: {
					templateShareable: true,
					path: "data>/ProjectElmSet",
					parameters: {
						expand: "to_DownTime"
					},
					template: new Calendar({
						key: "DownTime",
						backgroundColor: "sapUiChartPaletteSemanticNeutralLight3",
						timeIntervals: {
							templateShareable: true,
							path: "data>to_DownTime",
							template: new TimeInterval({
								startTime: "{data>DownTimeStartDate}",
								endTime: "{data>DownTimeEndDate}"
							})
						}
					})
				}
			})

		});

		oGantt.setModel(oDataModel, "data");
		oGantt.placeAt("qunit-fixture");
		nextUIUpdate();
		return oGantt;
	};

	var createGanttWithODataModelForMultipleBaseCalendar =  function(oRowSettingTemplate) {
		var sServiceUrl = "http://my.test.service.com/";
		var sURLPrefix = sap.ui.require.toUrl("sap/gantt/test/simple");

		var oMockServer = new MockServer({
			rootUri : sServiceUrl
		});
		oMockServer.simulate( sURLPrefix + "/../qunit/data/odata/metadata.xml", {
			sMockdataBaseUrl : sURLPrefix +  "/../qunit/data/odata/",
			bGenerateMissingMockData : true
		});

		oMockServer.start();
		// create data model
		var oDataModel = new ODataModel(sServiceUrl);

		// create configuration model
		var oDateType = new TypeDate({pattern: "dd.MM.yyyy"});

		var oRowSettingTemplate = oRowSettingTemplate || fnCreateMultipleBaseCalendarsRowSettingsODataModel();

		// instantiate GanttChartWithTable
		var oGantt = new GanttChartWithTable({
			table: new TreeTable({
				id: "table",
				columns: [
					new Column({
						label: new Label({
							text: "Explanation"
						}),
						sortProperty: "Explanation",
						filterProperty: "Explanation",
						name: "Explanation",
						customData: new CustomData({
							key: "exportTableColumnConfig",
							value: {"columnKey": "Explanation", "leadingProperty":"Explanation", "dataType": "string", "hierarchyNodeLevel": "Level","wrap": true}
						}),
						template: new Label({
							text: {
								path: "Explanation",
								model: "data"
							}
						})
					}),
					new Column({
						label: new Label({
							text: "Obj"
						}),
						sortProperty: "Obj",
						filterProperty: "Obj",
						name: "Obj",
						customData: new CustomData({
							key: "exportTableColumnConfig",
							value: {"columnKey": "Obj", "leadingProperty":"Obj", "dataType": "string", "hierarchyNodeLevel": "Level"}
						}),
						template: new Label({
							text: {
								path: "Obj",
								model: "data"
							}
						})
					}),
					new Column({
						label: new Label({
							text: "Start Date"
						}),
						sortProperty: "StartDate",
						filterProperty: "StartDate",
						name: "StartDate",
						filterType: oDateType,
						customData: new CustomData({
							key: "exportTableColumnConfig",
							value: {"columnKey": "StartDate", "leadingProperty":"StartDate", "dataType": "dateTime", "displayFormat": "mmm-dd, yyyy", "hierarchyNodeLevel": "Level"}
						}),
						template: new Label({
							text: {
								path: "StartDate",
								model: "data",
								type: oDateType
							}
						})
					}),
					new Column({
						label: new Label({
							text: "End Date"
						}),
						sortProperty: "EndDate",
						filterProperty: "EndDate",
						name: "EndDate",
						filterType: oDateType,
						customData: new CustomData({
							key: "exportTableColumnConfig",
							value: {"columnKey": "EndDate", "leadingProperty":"EndDate", "dataType": "dateTime", "displayFormat": "mmm-dd, yyyy", "hierarchyNodeLevel": "Level"}
						}),
						template: new Label({
							text: {
								path: "EndDate",
								model: "data",
								type: oDateType
							}
						})
					}),
					new Column({
						label: new Label({
							text: "ID"
						}),
						sortProperty: "id",
						filterProperty: "id",
						name: "id",
						filterType: oDateType,
						customData: new CustomData({
							key: "exportTableColumnConfig",
							value: {"columnKey": "id", "leadingProperty":"id", "dataType": "numeric", "hierarchyNodeLevel": "Level"}
						}),
						template: new Label({
							text: {
								path: "id",
								model: "data"
							}
						})
					}),
					new Column({
						label: new Label({
							text: "StartConstraint"
						}),
						sortProperty: "StartConstraint",
						filterProperty: "StartConstraint",
						name: "StartConstraint",
						filterType: oDateType,
						customData: new CustomData({
							key: "exportTableColumnConfig",
							value: {"columnKey": "StartConstraint", "leadingProperty":"StartConstraint", "dataType": "numeric", "unit": "kg", "hierarchyNodeLevel": "Level"}
						}),
						template: new Label({
							text: {
								path: "StartConstraint",
								model: "data"
							}
						})
					}),
					new Column({
						label: new Label({
							text: "StartConstraint"
						}),
						sortProperty: "StartConstraint",
						filterProperty: "StartConstraint",
						name: "StartConstraint",
						filterType: oDateType,
						customData: new CustomData({
							key: "exportTableColumnConfig",
							value: {"columnKey": "StartConstraint", "leadingProperty":"StartConstraint", "dataType": "boolean", "hierarchyNodeLevel": "Level"}
						}),
						template: new Label({
							text: {
								path: "StartConstraint",
								model: "data"
							}
						})
					}),
					new Column({
						label: new Label({
							text: "SuperiorGuid"
						}),
						sortProperty: "SuperiorGuid",
						filterProperty: "SuperiorGuid",
						name: "SuperiorGuid",
						filterType: oDateType,
						customData: new CustomData({
							key: "exportTableColumnConfig",
							value: {"columnKey": "SuperiorGuid", "leadingProperty":"SuperiorGuid", "dataType": "numeric", "isCurrency": true, "unitProperty": "Currency", "hierarchyNodeLevel": "Level"}
						}),
						template: new Label({
							text: {
								path: "SuperiorGuid",
								model: "data"
							}
						})
					})],
				rows: {
					path: "data>/ProjectElmSet",
					parameters: {
						numberOfExpandedLevels: 1,
						treeAnnotationProperties: {
							hierarchyLevelFor: "Level",
							hierarchyParentNodeFor: "SuperiorGuid",
							hierarchyNodeFor: "Guid",
							hierarchyDrillStateFor: "DrillDownState"//this option doesn't work
						},
						expand: "Task,WorkingTime,ResourceGreedy,to_NonWorkingTime,to_DownTime"						}
				},
				rowSettingsTemplate : oRowSettingTemplate
			}),
			showExportTableToExcel : false,
			axisTimeStrategy: new ProportionZoomStrategy({
				totalHorizon: new TimeHorizon({
					startTime: "20150101000000",
					endTime: "20150615000000"
				}),
				visibleHorizon: new TimeHorizon({
					startTime: "20150101000000",
					endTime: "20150615000000"
				})
			}),
			calendarDef: new CalendarDefs({
				defs: {
					templateShareable: true,
					path: "data>/NonWorkingTime",
					template: new Calendar({
						key: "{data>CalendarName}",
						backgroundColor: "sapUiChartPaletteQualitativeHue9",
						timeIntervals:  new TimeInterval({
							startTime: "{data>NonWorkingStartDate}",
							endTime: "{data>NonWorkingEndDate}"
						})
					})
				},
				defs1: {
					templateShareable: true,
					path: "data>/DownTime",
					template: new Calendar({
						key: "{data>CalendarName}",
						backgroundColor: "sapUiChartPaletteSemanticNeutralLight3",
						timeIntervals:  new TimeInterval({
								startTime: "{data>DownTimeStartDate}",
								endTime: "{data>DownTimeEndDate}"
						})
					})
				}
			})

		});

		oGantt.setModel(oDataModel, "data");
		oGantt.placeAt("qunit-fixture");
		nextUIUpdate();
		return oGantt;
	};

	var fnCreateDefaultShapeBindingSettingsODataModel = function(){
		return new GanttRowSettings({
			rowId: "{data>id}",
			shapes1: [
				new BaseRectangle({
					shapeId: "{data>id}",
					time: "{data>StartDate}",
					endTime: "{data>EndDate}",
					title: "{data>ObjectName}",
					fill: "#008FD3",
					selectable: true
				})
			]
		});
	};

	var fnCreateCalendarAndShapeBindingSettingsODataModel = function(){
		return new GanttRowSettings({
			rowId: "{data>ObjectID}",
			calendars: [
				new BaseCalendar({
					calendarName: "NonWorkingTime"
				}),
				new BaseCalendar({
					calendarName: "DownTime"
				})
			],
			shapes1: [
				new BaseRectangle({
					shapeId: "{data>ObjectID}",
					time: "{data>StartDate}",
					endTime: "{data>EndDate}",
					title: "{data>ObjectName}",
					fill: "#008FD3",
					selectable: true
				})
			]
		});
	};

	var fnCreateMultipleBaseCalendarsRowSettingsODataModel = function(){
		return new GanttRowSettings({
			rowId: "{data>ObjectID}",
			calendars: {
				templateShareable: false,
				path: "data>/NonWorkingTime",
				template: new BaseCalendar({
					calendarName: "{data>CalendarName}"
				})
			},
			calendars1: {
				templateShareable: false,
				path: "data>/DownTime",
				template: new BaseCalendar({
					calendarName: "{data>CalendarName}"
				})
			},
			shapes1: [
				new BaseRectangle({
					shapeId: "{data>ObjectID}",
					time: "{data>StartDate}",
					endTime: "{data>EndDate}",
					title: "{data>ObjectName}",
					fill: "#008FD3",
					selectable: true
				})
			]
		});
	};

	var asyncSeries = function (aFunctions, callback) {
		var aResults = [];

		var invokeNext = function () {
			var fnTeardown;
			var oFunction = aFunctions.shift();

			function fnCallback(oResult) {
				aResults.push(oResult);

				if (fnTeardown) {
					fnTeardown();
				}

				invokeNext();
			}

			if (typeof oFunction === "function") {
				fnTeardown = oFunction(aResults, fnCallback);
			} else if (typeof callback === "function") {
				callback(aResults);
			}
		};

		invokeNext();
	};

	var timeoutSeries = function () {
		var aFunctions = [];

		return {
			next: function (fnHandler, iTimeout) {
				aFunctions.push([fnHandler, iTimeout]);

				return this;
			},
			run: function(fnCallback) {
				asyncSeries(aFunctions.map(function(oInput) {
					return function(oResults, fnCallback) {
						setTimeout(function() {
							oInput[0](oResults);
							fnCallback();
						}, oInput[1]);
					};
				}), fnCallback);
			}
		};
	};

	var fnCreateGanttHandler = function (context, oGanttInstance) {
		var onReady = function (callback, timeout) {
			waitForGanttRendered(oGanttInstance).then(function () {
				if (timeout) {
					if (onReady._oTimeoutInstance) {
						clearTimeout(onReady._oTimeoutInstance);
					}
					onReady._oTimeoutInstance = setTimeout(callback.bind(context), timeout);
				} else {
					callback.apply(context, []);
				}
			});
		};

		onReady._oTimeoutInstance = null;

		var getRow = function (sRow, selector) {
			return selector.apply(context, [oGanttInstance.getDomRef().querySelectorAll("[data-sap-gantt-row-id='" + sRow + "']")[0]]);
		};

		var runSeries = function (aFunctions, callback, timeout) {
			asyncSeries(aFunctions.map(function (oFunction) {
				return function (aResults, fnCallback) {
					var fnTeardown;

					onReady(function () {
						fnTeardown = oFunction.apply(context, [aResults, fnCallback]);
					}, timeout);

					return function () {
						if (fnTeardown) {
							fnTeardown.apply(context);
						}
					};
				};
			}), callback.bind(context));
		};

		var getRowContent = function (sRow, selector) {
            var contents = getRow(sRow, function (content) { return content.children || []; });

            return selector ? selector(contents) : contents;
        };

        var getRowShapes = function (sRow) {
            return getRowContent(sRow, function (contents) {
                return contents[0] && contents[0].children ? contents[0].children : [];
            });
        };

		return {
			getRow: getRow,
			onReady: onReady,
			runSeries: runSeries,
			destroy: function () {
				if (onReady._oTimeoutInstance) {
					clearTimeout(onReady._oTimeoutInstance);
				}
				oGanttInstance.destroy();
			},
			getRowContent: getRowContent,
			getRowShapes: getRowShapes
		};
	};

	function debounce(oFunc, iWait) {
		var oTimeoutHandler;
		return function () {
			var oArgs = arguments;
			var oHandler = function () {
				oTimeoutHandler = null;
				oFunc.apply(this, oArgs);
			}.bind(this);
			clearTimeout(oTimeoutHandler);
			oTimeoutHandler = setTimeout(oHandler.bind(this), iWait);
		};
	}

	return {
		createGantt: createGanttChart,
		destroyGantt: destroyGanttChart,
		waitForGanttRendered: waitForGanttRendered,
		createSimpleGantt: createSimpleGantt,
		createGanttWithOData: createGanttWithODataModel,
		createGanttWithODataModelForCalendar: createGanttWithODataModelForCalendar,
		createGanttWithODataModelForMultipleBaseCalendar: createGanttWithODataModelForMultipleBaseCalendar,
		createGanttWithLines: createGanttWithLines,
		createGanttHandler: fnCreateGanttHandler,
		createGanttWithODataModelMultiactivity: createGanttWithODataModelMultiactivity,
		createSimpleGanttwithAxisTimeStratergy: createSimpleGanttwithAxisTimeStratergy,
		asyncSeries: asyncSeries,
		timeoutSeries: timeoutSeries,
		debounce: debounce
	};
});
