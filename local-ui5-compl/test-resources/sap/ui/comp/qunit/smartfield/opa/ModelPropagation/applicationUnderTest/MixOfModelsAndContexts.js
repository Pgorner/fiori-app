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
						var oModel,
							oModel2,
							oView,
							sServiceName = "testService",
							sServiceName2 = "testService2";

						this.setupMockServer(sServiceName);
						this.setupMockServer2(sServiceName2);

						oModel = new ODataModel(sServiceName + "/", {
							useBatch: false,
							defaultBindingMode: "TwoWay"
						});

						oModel2 = new ODataModel(sServiceName2 + "/", {
							useBatch: false,
							defaultBindingMode: "TwoWay"
						});

						oView = this.getView();

						// To reproduce the issue:
						// The control should have it's property "url" bound and the following things should happen
						// in the order below 1,2,3...

						// 1: A binding context with a reference to a named model should be created.
						this.byId("smartForm").bindElement({
							path: "/Employees('0001')",
							model: "MyNamedModel"
						});

						// 2: A name model containing the entity set "Employees" but lacking the property "Name" should be propagated
						oView.setModel(oModel2, "MyNamedModel");

						// 3: A undefined model with entity set "Employees" and property "Name" should be propagated
						oView.setModel(oModel);

						// 4: Correct binding context to undefined model should be propagated with a little delay
						// (for test 100ms) so the SmartField will internally create a "Factory" with the named model and will
						// ignore in this scenario the binding context pointing to the undefined model.
						setTimeout(function () {
							this.byId("smartForm").bindElement({
								path: "/Employees('0001')"
							});
						}.bind(this), 100);

						this._oModel = oModel;
					},
					handleContextReloadButton: function () {
						this.byId("Name").setBindingContext(null).setBindingContext();
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
								var data = document.getElementById("dataSection").textContent;
								req.respondJSON(200, {}, data);
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
					setupMockServer2: function (service) {
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
								var data = document.getElementById("metadata2").textContent;
								req.respondXML(200, {}, data);
							}
						});

						// Data
						reqList.push({
							method: 'GET',
							path: '/\\Employees(.*)',
							response: function (req, resp) {
								var data = document.getElementById("dataSection2").textContent;
								req.respondJSON(200, {}, data);
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
