(function () {
	"use strict";

	sap.ui.require(["sap/ui/core/Core"], function(Core) {

		Core.ready(function () {

			sap.ui.require([
				"sap/ui/core/mvc/XMLView",
				"sap/ui/core/mvc/Controller",
				"sap/ui/model/odata/v2/ODataModel",
				"sap/ui/core/util/MockServer",
				"sap/m/CustomListItem",
				"sap/m/Panel",
				"sap/m/Text",
				"sap/ui/core/Element"
			], function (
				XMLView,
				Controller,
				ODataModel,
				MockServer,
				CustomListItem,
				Panel,
				Text,
				Element
			) {
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
						this._oModel = oModel;
					},
					handleFieldChange: function () {
						this.byId("text").setText(JSON.stringify(this._oModel.getPendingChanges(), null));
					},
					editToggle: function () {
						var oSF = this.byId("smartform");
						oSF.setEditable(!oSF.getEditable());
					},
					clearLog: function () {
						this.byId("events").removeAllItems();
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
						// Data
						reqList.push({
							method: 'GET',
							path: '/\\StringVH[\/?](.*)',
							response: function (req, resp) {
								var sRequest = decodeURIComponent(req.url),
									aMatch = sRequest.match(/([a-zA-Z0-9]+) eq '([\w\s]+)'/g),
									aMatchers = [],
									oData,
									aResult,
									oResult,
									aMatchOR,
									iResponseCount = 4,
									aMatchOrder,
									sSortKey,
									sSortDir;

								aMatchOR = sRequest.match(/KEY eq '([\w\s]+)' or TXT eq '([\w\s]+)'/);
								if (aMatchOR) {
									aMatchers.push(function (oResult) {
										return oResult["KEY"] === aMatchOR[1] || oResult["TXT"] === aMatchOR[2];
									});
									aMatch = aMatch.slice(2);
								}
								aMatch.forEach(function (sMatch) {
									var aMatch = sMatch.match(/([a-zA-Z0-9]+) eq '([\S]+)'/);
									aMatchers.push(function (oResult) {
										return oResult[aMatch[1]] === aMatch[2];
									});
								});

								// Sort
								aMatchOrder = sRequest.match(/orderby=(\S+)\s(asc|desc)/i);
								if (aMatchOrder) {
									sSortKey = aMatchOrder[1];
									sSortDir = aMatchOrder[2];
								}
								if (aMatch && aMatch[1]) {
									oData = JSON.parse(document.getElementById("dataSectionVH").textContent);
									aResult = oData.d.results.filter(function (oResult) {
										return aMatchers.every(function (fnMatcher) {
											return fnMatcher(oResult);
										});
									});
									if (aMatchOrder) {
										aResult.sort(function (a, b) {
											if (sSortDir === "asc") {
												if (a[sSortKey] < b[sSortKey]) {
													return -1;
												} else if (a[sSortKey] > b[sSortKey]) {
													return 1;
												}
												return 0;
											}
											if (a[sSortKey] < b[sSortKey]) {
												return 1;
											} else if (a[sSortKey] > b[sSortKey]) {
												return -1;
											}
											return 0;
										});
									}
									iResponseCount = aResult.length;
									oResult = {d: {results: aResult, "__count": iResponseCount}};
									req.respondJSON(200, {}, JSON.stringify(oResult));
									if (sRequest.indexOf("$top=2") !== -1) {
										Element.getElementById("idView--events").addItem(new CustomListItem({
											content: new Panel({
												headerText: sRequest + " => (" + iResponseCount + ")",
												content: new Text({renderWhitespace: true}).setText("Request:\n" + sRequest + "\n\nResponse:\n" + JSON.stringify(oResult, null, 4)),
												expandable: true
											})
										}));
									}
								} else {
									req.respondJSON(200, {}, document.getElementById("dataSectionVHZero").textContent);
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
