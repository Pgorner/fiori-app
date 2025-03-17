(function () {
	"use strict";

	sap.ui.require(["sap/ui/core/Core"], function(Core) {

		Core.ready(function () {

			sap.ui.require([
				"sap/m/CustomListItem",
				"sap/m/Panel",
				"sap/m/StandardListItem",
				"sap/m/Text",
				"sap/ui/core/mvc/XMLView",
				"sap/ui/core/mvc/Controller",
				"sap/ui/model/odata/v2/ODataModel",
				"sap/ui/core/util/MockServer"
			], function (
				CustomListItem,
				Panel,
				StandardListItem,
				Text,
				XMLView,
				Controller,
				ODataModel,
				MockServer
			) {
				var MyController = Controller.extend("mainView.controller", {
					onInit: function () {
						var oModel,
							oView = this.getView(),
							sServiceName = "testService";

						this.setupMockServer(sServiceName);

						oModel = new ODataModel(sServiceName + "/", {
							useBatch: false,
							defaultBindingMode: "TwoWay"
						});

						oModel.getMetaModel().loaded().then(function () {
							var oEntry = oModel.createEntry("/Products", {
									properties: {
										ID: "999",
										Description: "Created",
										"Description_fc": 3,
										"Data_mc": true
									}
								}),
								sPath = oEntry.getPath();

							this.byId("createGroup").bindElement({
								path: sPath
							});
							/**
							 * @deprecated As of version 1.88, replaced by <code>title</code> aggregation.
							 */
							this.byId("createGroup").setLabel && this.byId("createGroup").setLabel(sPath + " : Created and not persisted -> only available in frontend model");
							this._sPath = sPath;
						}.bind(this));

						oView.setModel(oModel);

						this._oModel = oModel;
					},
					simulateExpand: function () {
						this._oModel.setProperty("/Products('002')/to_ProductCategories", {
							"__ref": "Categories('SS')"
						});
					},
					simulateExpandOnCreated: function () {
						this._oModel.setProperty(this._sPath + "/to_ProductCategories", {
							"__ref": "Categories('SP')"
						});
					},
					resetModel: function () {
						this._oModel.resetChanges();
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
							response: function (req /*, resp */) {
								var data = document.getElementById("metadata").textContent;
								req.respondXML(200, {}, data);
							}
						});

						// Data
						reqList.push({
							method: 'GET',
							path: '/\\Products(.*)',
							response: function (req /*, resp */) {
								var oData = JSON.parse(document.getElementById("products").textContent),
									sURI = req.url.split("/").pop();

								oData.d.results = oData.d.results.filter(function (oResult) {
									return oResult["__metadata"].uri === sURI;
								});

								req.respondJSON(200, {}, JSON.stringify(oData));
							}
						});

						// Data
						reqList.push({
							method: 'GET',
							path: '/\\Categories(.*)',
							response: function (req /*, resp */) {
								var oData = JSON.parse(document.getElementById("categories").textContent),
									sURI = req.url.split("/").pop();

								oData.d.results = oData.d.results.filter(function (oResult) {
									return oResult["__metadata"].uri === sURI;
								});

								req.respondJSON(200, {}, JSON.stringify(oData));
							}
						});

						mockServer.setRequests(reqList);
						mockServer.simulate(basePath + '/$metadata',
							{
								sMockdataBaseUrl: basePath + '/Employees',
								bGenerateMissingMockData: true
							});
						mockServer.start();
					},
					onExit: function () {
						this._oMockServer.stop();
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
