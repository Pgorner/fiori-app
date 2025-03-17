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
				var oResponseControl,
					oResponseURL;

				var MyController = Controller.extend("mainView.controller", {
					onInit: function () {
						var oModel, oView;
						var sServiceName = "testService";

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

						oResponseControl = this.byId("response");
						oResponseURL = this.byId("url");
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
								var data = document.getElementById("metadata").textContent;
								req.respondXML(200, {}, data);
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
								var sRequest = decodeURIComponent(req.url),
									aMatch = /filter=\(?KEY eq '([0-9]+)'/.exec(sRequest),
									oData,
									aResult;

								if (aMatch && aMatch[1]) {
									oData = JSON.parse(document.getElementById("dataSectionVH").textContent);
									aResult = oData.d.results.filter(function (oResult) {
										return oResult.KEY === aMatch[1];
									});
									oResponseControl.setText(JSON.stringify({
										d: {
											results: aResult,
											"__count": aResult.length
										}
									}));
									oResponseURL.setText(decodeURIComponent(req.url));
									req.respondJSON(200, {}, JSON.stringify({
										d: {
											results: aResult,
											"__count": aResult.length
										}
									}));
								} else {
									oResponseControl.setText(document.getElementById("dataSectionVH").textContent);
									oResponseURL.setText(decodeURIComponent(req.url));
									req.respondJSON(200, {}, document.getElementById("dataSectionVH").textContent);
								}
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
