(function () {
	"use strict";

	sap.ui.require(["sap/ui/core/Core"], function(Core) {

		Core.ready(function () {

			sap.ui.require([
				"sap/m/Panel",
				"sap/m/Text",
				"sap/ui/core/mvc/XMLView",
				"sap/ui/core/mvc/Controller",
				"sap/ui/model/odata/v2/ODataModel",
				"sap/ui/core/util/MockServer",
				"sap/ui/core/Fragment",
				"sap/ui/core/Core"
			], function (
				Panel,
				Text,
				XMLView,
				Controller,
				ODataModel,
				MockServer,
				Fragment,
				Core
			) {
				var MyController = Controller.extend("mainView.controller", {
					onInit: function () {
						var oMM = Core.getMessageManager(),
							oModel,
							sServiceName = "testService";

						this.setupMockServer(sServiceName);

						oModel = new ODataModel(sServiceName + "/", {
							useBatch: false,
							defaultBindingMode: "TwoWay"
						});

						this.getView().setModel(oModel);

						this._oModel = oModel;

						oMM.registerObject(this.getView(), true);
						this.getView().setModel(oMM.getMessageModel(), "message");

						oModel.attachPropertyChange(this._dumpPendingChanges.bind(this));

						this._dumpPendingChanges();
					},
					_dumpPendingChanges: function () {
						this.byId("modelDump").setText(
							JSON.stringify(this._oModel.getPendingChanges(), null, "\t")
						);
					},
					onMessagePopoverPress: function (oEvent) {
						var oButton = oEvent.getSource();
						this._getMessagePopover().then(function (oMessagePopover) {
							oMessagePopover.openBy(oButton);
						});
					},
					_getMessagePopover: function () {
						var oView = this.getView();

						// create popover lazily (singleton)
						if (!this._pMessagePopover) {
							this._pMessagePopover = Fragment.load({
								id: oView.getId(),
								fragmentContent: document.getElementById("messagePopover").innerText
							}).then(function (oMessagePopover) {
								oView.addDependent(oMessagePopover);
								return oMessagePopover;
							});
						}
						return this._pMessagePopover;
					},
					bindInvalid: function () {
						this.byId("op").bindObject("/Employees('0002')");
						this._dumpPendingChanges();
					},
					resetModel: function () {
						this._oModel.resetChanges();
						this._dumpPendingChanges();
						this.byId("op").bindObject("/Employees('0001')");
					},
					switchToNone: function () {
						this.byId("DelayField21").setTextInEditModeSource("None");
					},
					switchToValueList: function () {
						this.byId("DelayField21").setTextInEditModeSource("ValueList");
					},
					switchToValueListWarning: function () {
						this.byId("DelayField21").setTextInEditModeSource("ValueListWarning");
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
								if (req.url.indexOf("0001") !== -1) {
									req.respondJSON(200, {}, document.getElementById("employees").textContent);
								} else {
									req.respondJSON(200, {}, document.getElementById("employees_invalid").textContent);
								}
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
									iResponseCount = 4,
									aMatchOrder,
									sSortKey,
									sSortDir;

								if (aMatch) {
									aMatch.forEach(function (sMatch) {
										var aMatch = sMatch.match(/([a-zA-Z0-9]+) eq '([\w\s]+)'/);
										aMatchers.push(function (oResult) {
											return oResult[aMatch[1]] === aMatch[2];
										});
									});
								} else {
									aMatchers.push(function (oResult) {
										return true;
									});
								}

								// Sort
								aMatchOrder = sRequest.match(/orderby=(\S+)\s(asc|desc)/i);
								if (aMatchOrder) {
									sSortKey = aMatchOrder[1];
									sSortDir = aMatchOrder[2];
								}

								if ((aMatch && aMatch[1]) || aMatchers) {
									oData = JSON.parse(document.getElementById("stringVH").textContent);

									if (aMatchers.length) {
										aResult = oData.d.results.filter(function (oResult) {
											return aMatchers.every(function (fnMatcher) {
												return fnMatcher(oResult);
											});
										});
									}

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
								} else {
									req.respondJSON(200, {}, document.getElementById("dataSectionVHZero").textContent);
								}
							}
						});

						// Data
						reqList.push({
							method: 'GET',
							path: '/\\AirlineVH[\/?](.*)',
							response: function (req, resp) {
								var sRequest = decodeURIComponent(req.url),
									aMatch = sRequest.match(/([a-zA-Z0-9]+) eq '([\w\s]+)'/g),
									aMatchers = [],
									oData,
									aResult,
									oResult,
									iResponseCount = 4,
									aMatchOrder,
									sSortKey,
									sSortDir;

								if (aMatch) {
									aMatch.forEach(function (sMatch) {
										var aMatch = sMatch.match(/([a-zA-Z0-9]+) eq '([\w\s]+)'/);
										aMatchers.push(function (oResult) {
											return oResult[aMatch[1]] === aMatch[2];
										});
									});
								} else {
									aMatchers.push(function (oResult) {
										return true;
									});
								}

								// Sort
								aMatchOrder = sRequest.match(/orderby=(\S+)\s(asc|desc)/i);
								if (aMatchOrder) {
									sSortKey = aMatchOrder[1];
									sSortDir = aMatchOrder[2];
								}

								if ((aMatch && aMatch[1]) || aMatchers) {
									oData = JSON.parse(document.getElementById("AirlineVH").textContent);

									if (aMatchers.length) {
										aResult = oData.d.results.filter(function (oResult) {
											return aMatchers.every(function (fnMatcher) {
												return fnMatcher(oResult);
											});
										});
									}

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
								} else {
									req.respondJSON(200, {}, document.getElementById("dataSectionVHZero").textContent);
								}
							}
						});

						// Data
						reqList.push({
							method: 'GET',
							path: '/\\AirlineValidationVH[\/?](.*)',
							response: function (req, resp) {
								var sRequest = decodeURIComponent(req.url),
									aMatch = sRequest.match(/([a-zA-Z0-9]+) eq '([\w\s]+)'/g),
									aMatchers = [],
									oData,
									aResult,
									oResult,
									iResponseCount = 4,
									aMatchOrder,
									sSortKey,
									sSortDir;

								if (aMatch) {
									aMatch.forEach(function (sMatch) {
										var aMatch = sMatch.match(/([a-zA-Z0-9]+) eq '([\w\s]+)'/);
										aMatchers.push(function (oResult) {
											return oResult[aMatch[1]] === aMatch[2];
										});
									});
								} else {
									aMatchers.push(function (oResult) {
										return true;
									});
								}

								// Sort
								aMatchOrder = sRequest.match(/orderby=(\S+)\s(asc|desc)/i);
								if (aMatchOrder) {
									sSortKey = aMatchOrder[1];
									sSortDir = aMatchOrder[2];
								}

								if ((aMatch && aMatch[1]) || aMatchers) {
									oData = JSON.parse(document.getElementById("AirlineVH").textContent);

									if (aMatchers.length) {
										aResult = oData.d.results.filter(function (oResult) {
											return aMatchers.every(function (fnMatcher) {
												return fnMatcher(oResult);
											});
										});
									}

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
