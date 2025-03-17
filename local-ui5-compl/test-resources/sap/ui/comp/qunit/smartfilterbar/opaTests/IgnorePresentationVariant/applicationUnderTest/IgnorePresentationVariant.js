(function () {
	"use strict";

	sap.ui.require([
		"sap/ui/core/mvc/XMLView",
		"sap/ui/core/mvc/Controller",
		"sap/ui/model/odata/v2/ODataModel",
		"sap/ui/core/util/MockServer",
		"sap/m/StandardListItem"
	], function (
		XMLView,
		Controller,
		ODataModel,
		MockServer,
		StandardListItem
	) {
		var MyController = Controller.extend("mainView.controller", {
			onInit: function () {
				var sServiceName = "testService";

				this.setupMockServer(sServiceName);
				this.getView().setModel(new ODataModel(sServiceName + "/", {
					useBatch: false,
					defaultCountMode: "Inline",
					defaultBindingMode: "TwoWay"
				}));

				this.oSmartFilterBar = this.byId("smartFilterBar");
			},
			setupMockServer: function (service) {
				var sBasePath = service,
					oMockServer,
					aReqList;

				oMockServer = new MockServer({
					rootUri: sBasePath
				});

				aReqList = oMockServer.getRequests();

				// $metadata
				aReqList.push({
					method: 'GET',
					path: '/\\$metadata(.*)',
					response: function(req, resp) {
						req.respondXML(200, {}, document.getElementById("metadata").textContent);
					}
				});

				// Data
				aReqList.push({
					method: 'GET',
					path: '/\\StringVH(.*)',
					response: function(req, resp) {
						this.byId("log").addItem(new StandardListItem({title: decodeURIComponent(req.url)}));
						req.respondJSON(200, {}, document.getElementById("dataSection").textContent);
					}.bind(this)
				});

				// Data
				aReqList.push({
					method: 'GET',
					path: '/\\DescVH(.*)',
					response: function(req, resp) {
						this.byId("log").addItem(new StandardListItem({title: decodeURIComponent(req.url)}));
						req.respondJSON(200, {}, document.getElementById("dataSection2").textContent);
					}.bind(this)
				});

				oMockServer.setRequests(aReqList);
				oMockServer.simulate(sBasePath + '/$metadata',
					{
						sMockdataBaseUrl: sBasePath + '/StringVH',
						bGenerateMissingMockData: true
					});
				oMockServer.start();
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

})();
