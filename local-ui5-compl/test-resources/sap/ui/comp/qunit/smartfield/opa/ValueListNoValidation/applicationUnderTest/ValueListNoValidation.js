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
					submitPending: function () {
						this._oModel.submitChanges();
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
								var aParameterMatch = decodeURIComponent(window.location.search).match(/TextArrangement=(\S+?)[&$#]/),
									data = document.getElementById("metadata").textContent;

								// Replace the text arrangement with one coming as a GET parameter
								if (aParameterMatch && aParameterMatch[1]) {
									data = data.replace(
										'<Annotation Term="com.sap.vocabularies.UI.v1.TextArrangement" EnumMember="com.sap.vocabularies.UI.v1.TextArrangementType/TextLast" />',
										'<Annotation Term="com.sap.vocabularies.UI.v1.TextArrangement" EnumMember="com.sap.vocabularies.UI.v1.TextArrangementType/' + aParameterMatch[1] + '" />'
									);
								}

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

						// Data
						reqList.push({
							method: 'GET',
							path: '/\\StringVH[\/?](.*)',
							response: function (req, resp) {
								var sURL = decodeURIComponent(req.url),
									sData;

								if (sURL.indexOf("filter=KEY eq '2'") !== -1) {
									sData = document.getElementById("dataSectionVH2").textContent;
									oResponseURL.setText(sURL);
									oResponseControl.setText(sData);
									req.respondJSON(200, {}, sData);
								} else if (sURL.indexOf("filter=KEY eq '1'") !== -1) {
									sData = document.getElementById("dataSectionVH1").textContent;
									oResponseURL.setText(sURL);
									oResponseControl.setText(sData);
									req.respondJSON(200, {}, sData);
								} else if (sURL.indexOf("filter=KEY eq '3'") !== -1) {
									sData = document.getElementById("dataSectionVH3").textContent;
									oResponseURL.setText(sURL);
									oResponseControl.setText(sData);
									req.respondJSON(200, {}, sData);
								} else if (sURL.indexOf("filter=KEY eq '5'") !== -1) {
									sData = document.getElementById("dataSectionVH4").textContent;
									oResponseURL.setText(sURL);
									oResponseControl.setText(sData);
									req.respondJSON(200, {}, sData);
								} else if (sURL.indexOf("filter=KEY eq '6'") !== -1) {
									sData = document.getElementById("dataSectionVH5").textContent;
									oResponseURL.setText(sURL);
									oResponseControl.setText(sData);
									req.respondJSON(200, {}, sData);
								} else {
									sData = document.getElementById("dataSectionVH").textContent;
									oResponseURL.setText(sURL);
									oResponseControl.setText(sData);
									req.respondJSON(200, {}, sData);
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
