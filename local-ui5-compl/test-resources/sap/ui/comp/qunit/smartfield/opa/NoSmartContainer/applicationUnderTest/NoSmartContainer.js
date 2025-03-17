(function () {
	"use strict";
	sap.ui.require(["sap/ui/core/Core"], function(Core) {
		Core.ready(function () {
            sap.ui.require([
				"sap/ui/core/mvc/XMLView",
				"sap/ui/core/mvc/Controller",
				"sap/ui/model/odata/v2/ODataModel",
				"sap/ui/core/util/MockServer",
				"sap/ui/comp/smartfield/SmartField",
				"sap/ui/comp/smartfield/SmartLabel"
			], function(
				XMLView,
				Controller,
				ODataModel,
				MockServer,
				SmartField,
				SmartLabel
			) {
				var MyController = Controller.extend("mainView.controller", {
					onInit: function() {
						var oModel, oView,
						sServiceName = "testService";

						this.setupMockServer(sServiceName);
						oModel = new ODataModel(sServiceName + "/", {
							useBatch: false,
							defaultBindingMode: "TwoWay"
						});

						oView = this.getView();
						oView.setModel(oModel);

						this._oModel = oModel;

						const oVBox = this.byId("myVbox");
						const oVBoxLabel = this.byId("myVboxLabel");

						const oSmartLabel = new SmartLabel("invisibleLabel", {visible: false});
						oSmartLabel.setLabelFor("myField");
						oVBoxLabel.addItem(oSmartLabel);

						this.oSmartLabel = oSmartLabel;

						setTimeout(function () {
							const oSmartField = new SmartField("myField", {visible: false, value: "{Id}"});
							oVBox.addItem(oSmartField);
							this._oSmartField = oSmartField;
						}.bind(this), 0);

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


						mockServer.setRequests(reqList);
						mockServer.simulate(basePath + '/$metadata',
							{
								sMockdataBaseUrl: basePath + '/Employees',
								bGenerateMissingMockData: true
							});
						mockServer.start();
					},
					doClone: function () {
						var oClone = this.byId("ListItem").clone();
						this.byId("List").addItem(oClone);
						window.clone2 = oClone.getContent()[0];
					},
					setVisible: function () {
						this._oSmartField.setVisible(true);
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