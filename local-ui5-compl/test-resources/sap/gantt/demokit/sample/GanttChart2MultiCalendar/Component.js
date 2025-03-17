sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/model/odata/v2/ODataModel",
	"./localService/mockserver"
], function (UIComponent, ODataModel, mockserver) {
	"use strict";

	return UIComponent.extend("sap.gantt.sample.GanttChart2MultiCalendar.Component", {
		metadata: {
			rootView: {
				"id": "GanttChart2MultiCalendar",
				"viewName": "sap.gantt.sample.GanttChart2MultiCalendar.GanttChart2MultiCalendar",
				"type": "XML",
				"async": true
			},

			dependencies: {
				libs: [
					"sap.gantt",
					"sap.ui.table",
					"sap.m"
				]
			},
			config: {
				sample: {
					stretch: true,
					files: [
						"localService/metadata.xml",
						"localService/mockdata/ProjectElems.json",
						"localService/mockdata/DownTime.json",
						"localService/mockdata/NonWorkingTime.json",
						"GanttChart2MultiCalendar.view.xml",
						"localService/mockserver.js",
						"Component.js",
						"GanttChart2MultiCalendar.controller.js"
					]
				}
			}
		},
		init: function () {
			// call the init function of the parent
			UIComponent.prototype.init.apply(this, arguments);

			var sODataServiceUrl = "sap.gantt.GanttChart2MultiCalendar/";

			// init our mock server
			this._oMockServer = mockserver.init(sODataServiceUrl);

			// set model on component
			this.setModel(
				new ODataModel(sODataServiceUrl, {
					json: true,
					useBatch: true
				}), "data"
			);
		},
		exit: function () {
			this._oMockServer.stop();
			this._oMockServer.destroy();
		}
	});
});
