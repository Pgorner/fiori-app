sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/model/odata/v4/ODataModel",
	"./localService/mockserver",
	"sap/base/Log"
], function (UIComponent,ODataModel,mockserver,Log) {
	"use strict";

	return UIComponent.extend("sap.gantt.sample.GanttChartODataV4.Component", {
		metadata: {
			rootView: {
				"viewName": "sap.gantt.sample.GanttChartODataV4.Gantt",
				"type": "XML",
				"async": true
			},

			dependencies: {
				libs: [
					"sap.gantt",
					"sap.ui.table",
					"sap.m" ,
					"sap.ui.core",
					"sap.ui.layout"
				]
			},
			config: {
				sample: {
					stretch: true,
					files: [
						"Component.js",
						"Gantt.controller.js",
						"Gantt.view.xml",
						"localService/mockdata/people.json"
					]
				}
			}
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls
		 * the init method once.
		 * @public
		 * @override
		 */
		init : function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			var sODataServiceUrl = "https://services.odata.org/TripPinRESTierService/(S(mv4yd15mvahuekwqfqtmqzwt))/";


			// initialize the mock server
			mockserver.init().catch(function (oError) {
				Log.error(oError.message,this);
			}).finally(function () {
				// initialize the embedded component on the HTML page
				// sap.ui.require(["sap/ui/core/ComponentSupport"]);
			}).then(function(){
			// set model on component
				this.setModel(
					new ODataModel({
						serviceUrl: sODataServiceUrl,
						autoExpandSelect: true,
						earlyRequests: true,
						operationMode: "Server"
					})
				);
			}.bind(this));

		}
	});
});
