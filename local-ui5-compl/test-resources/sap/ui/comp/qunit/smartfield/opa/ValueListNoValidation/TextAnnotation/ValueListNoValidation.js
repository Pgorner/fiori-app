(function () {
	"use strict";

	sap.ui.require(["sap/ui/core/Core"], function(Core) {

		Core.ready(function () {

			sap.ui.require([
				"sap/ui/core/mvc/XMLView",
				"sap/ui/core/mvc/Controller",
				"sap/ui/model/odata/v2/ODataModel",
				"sap/ui/core/util/MockServer"
			], function (
				XMLView,
				Controller,
				ODataModel,
				MockServer
			) {
				var oResponse, oResponseURL;
				var MyController = Controller.extend("mainView.controller", {
					onInit: function () {
						var oModel, oView;
						var sServiceName = "testService";
						oResponseURL = this.byId("url");
						this.setupMockServer(sServiceName);

						oModel = new ODataModel(sServiceName + "/", {
							useBatch: false,
							defaultBindingMode: "TwoWay"
						});

						oView = this.getView();
						oView.setModel(oModel);

						oModel.getMetaModel().loaded().then(function () {
							this.byId("smartForm").bindElement("/Employees('0001')");
						}.bind(this));

						this._oModel = oModel;
					},
					onExit: function () {
						this._oMockServer.stop();
					},
					setupMockServer: function (service) {
						var basePath = service;

						var mockServer = new MockServer({
							rootUri: basePath
						});

						var reqList = mockServer.getRequests();

						// $metadata
						reqList.push({
							method: 'GET',
							path: '/\\$metadata(.*)',
							response: function (req, resp) {
								req.respondXML(200, {}, document.getElementById("metadata").textContent);
							}
						});

						// Data
						reqList.push({
							method: 'GET',
							path: '/\\Employees(.*)',
							response: function (req, resp) {
								req.respondJSON(200, {}, document.getElementById("dataSection").textContent);
							}
						});

						// Data
						reqList.push({
							method: 'GET',
							path: '/\\StringVH[\/?](.*)',
							response: function (req, resp) {
								var sUrl = decodeURIComponent(req.url);
								if (sUrl.indexOf("filter=KEY eq '1'") !== -1) {
									oResponse = document.getElementById("dataSectionVHValue1").textContent;
								} else if (sUrl.indexOf("filter=KEY eq '2'") !== -1) {
									oResponse = document.getElementById("dataSectionVHValue2").textContent;
								} else {
									oResponse = document.getElementById("dataSectionVH").textContent;
								}
								oResponseURL.setText(oResponse);
								req.respondJSON(200, {}, oResponse);
							}
						});

						mockServer.setRequests(reqList);
						mockServer.simulate(basePath + '/$metadata',
							{
								sMockdataBaseUrl: basePath + '/Employees',
								bGenerateMissingMockData: true
							});
						mockServer.start();
					}
				});

				XMLView.create({
					id: "idView",
					definition: document.getElementById("mainView").textContent,
					controller: new MyController()
				}).then(function (oView) {
					oView.placeAt("content");
				});

			});

		});
	});
})();
