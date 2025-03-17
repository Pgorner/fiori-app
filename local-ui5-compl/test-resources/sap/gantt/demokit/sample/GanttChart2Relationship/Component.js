sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/model/odata/v2/ODataModel",
	"./localService/mockserver"
], function (UIComponent, ODataModel, mockserver) {
	"use strict";

	return UIComponent.extend("sap.gantt.sample.GanttChart2Relationship.Component", {
		metadata: {
			rootView: {
				"id": "GanttChart2Relationship",
				"viewName": "sap.gantt.sample.GanttChart2Relationship.GanttChart2Relationship",
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
						"localService/mockdata/Relationships.json",
						"GanttChart2Relationship.view.xml",
						"localService/mockserver.js",
						"Component.js",
						"GanttChart2Relationship.controller.js"
					]
				}
			}
		},
		init: function () {
			// call the init function of the parent
			UIComponent.prototype.init.apply(this, arguments);

			var sODataServiceUrl = "sap.gantt.GanttChart2Relationship/";

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
