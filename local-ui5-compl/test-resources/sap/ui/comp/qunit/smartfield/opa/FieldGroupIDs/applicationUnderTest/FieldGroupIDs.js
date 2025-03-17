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

						oView.setModel(oModel);

						this._oModel = oModel;

						// Set state
						this.byId("FGP")._setInternalFieldGroupIds("TestFG1,TestFG2");
					},
					recalculateFieldGroupIDs: function () {
						var oSFNoFieldGroups = this.byId("NOFG"),
							oSFFieldGroups = this.byId("FGSM");

						oSFFieldGroups._getComputedMetadata().then(function (oComputedMetadata) {
							oSFNoFieldGroups._setInternalFieldGroupIds(
								oSFNoFieldGroups._calculateFieldGroupIDs(oComputedMetadata)
							);
						});
					},
					handleValidate: function () {
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
