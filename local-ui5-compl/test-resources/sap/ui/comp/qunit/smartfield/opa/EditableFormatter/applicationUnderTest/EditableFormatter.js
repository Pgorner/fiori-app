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
				var MyController = Controller.extend("mainView.controller", {
					onInit: function () {
						var oModel, oView;
						var sServiceName = "testService";

						this.setupMockserver(sServiceName);

						oModel = new ODataModel(sServiceName + "/", {
							useBatch: false,
							defaultBindingMode: "TwoWay"
						});

						oView = this.getView();
						oView.setModel(oModel);

						this._oModel = oModel;
						window.m = this._oModel;

						var aGroups = oModel.getDeferredGroups();
						aGroups.push("myDeferred");
						oModel.setDeferredGroups(aGroups);
					},
					handleBindToNewRecord: function () {
						var oEntry = this._oModel.createEntry("/Employees", {
								properties: {
									"Id": "1" + Math.floor(Math.random() * 100000),
									"Name": ""
								},
								groupId: "myDeferred"
							}),
							sPath = oEntry && oEntry.getPath();

						// this.byId("smartForm").setBindingContext(null);

						this.byId("smartForm").bindElement({
							path: sPath
						});
						this.byId("bindingPath").setText(sPath);
					},
					handleBindToNewUpdatableRecord: function () {
						var oEntry = this._oModel.createEntry("/UpdatableEmployees", {
								properties: {
									"Id": "1" + Math.floor(Math.random() * 100000),
									"Name": ""
								},
								groupId: "myDeferred"
							}),
							sPath = oEntry && oEntry.getPath();

						// this.byId("smartForm").setBindingContext(null);

						this.byId("smartForm").bindElement({
							path: sPath
						});
						this.byId("bindingPath").setText(sPath);

					},
					removeBinding: function () {
						// this._oModel
						// debugger;
						this.byId("smartForm").unbindObject();
					},
					handleBindToExistingRecord: function () {
						var sPath = "/Employees('0001')";
						// this.byId("smartForm").setBindingContext(null);

						this.byId("smartForm").bindElement({
							path: sPath
						});
						this.byId("bindingPath").setText(sPath);
					},
					setupMockserver: function (service) {
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
								var sRequest = decodeURIComponent(req.url),
									aMatch = /Employees\('([0-9]+)'\)/.exec(sRequest),
									oData,
									aResult;

								if (aMatch && aMatch[1]) {
									oData = JSON.parse(document.getElementById("dataSection").textContent);
									aResult = oData.d.results.filter(function (oResult) {
										return oResult.Id === aMatch[1];
									});
									req.respondJSON(200, {}, JSON.stringify({
										d: {
											results: aResult,
											"__count": aResult.length
										}
									}));
								} else {
									req.respondJSON(200, {}, document.getElementById("dataSection").textContent);
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
