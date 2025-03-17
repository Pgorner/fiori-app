(function () {
	"use strict";

	sap.ui.require(["sap/ui/core/Core"], function(Core) {
		Core.ready(function () {

			sap.ui.require([
				"sap/ui/core/mvc/XMLView",
				"sap/ui/core/mvc/Controller",
				"sap/ui/model/odata/v2/ODataModel",
				"sap/ui/core/util/MockServer",
				"sap/ui/comp/providers/BaseValueListProvider",
				"sap/ui/model/odata/ODataMetaModel",
				"sap/m/CustomListItem",
				"sap/m/Panel",
				"sap/m/Text"
			], function (
				XMLView,
				Controller,
				ODataModel,
				MockServer,
				BaseValueListProvider,
				ODataMetaModel,
				CustomListItem,
				Panel,
				Text
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

						oView.bindElement({
							path: "/Employees('0001')"
						});

						this.registerRequestsLogging();
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
								var oData,
									sVLRequestParts,
									sRequest = decodeURIComponent(req.url);

								if (sRequest === "testService/$metadata") {
									oData = document.getElementById("metadata").textContent;
								}

								if (sRequest.indexOf("testService/$metadata?sap-value-list=") === 0) {
									sVLRequestParts = sRequest.split(/[=\.\/]/);
									oData = document.getElementById("vlMetadata" + sVLRequestParts[3] + sVLRequestParts[4]).textContent;
								}

								req.respondXML(200, {}, oData);
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
									var aMatch = sMatch.match(/([a-zA-Z0-9]+) eq '([\w\s]+)'/);
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
					registerRequestsLogging: function () {
						var that;

						this.fnLoadAnnotationBase = BaseValueListProvider.prototype._loadAnnotation;
						BaseValueListProvider.prototype._loadAnnotation = function () {
							return Promise.resolve();
						};

						this.fnGetODataValueListsBase = ODataMetaModel.prototype.getODataValueLists;
						that = this;
						ODataMetaModel.prototype.getODataValueLists = function (oPropertyContext) {
							var oContext = this,
								oText = new Text({renderWhitespace: true}).setText(oPropertyContext.sPath),
								oCustomListItem = new CustomListItem({
									content: new Panel({
										headerText: "getODataValueLists",
										content: oText,
										expandable: true
									})
								});

							oCustomListItem.data("sentRequest", {
								sentRequest: {
									path: oPropertyContext.sPath
								}
							});
							that.byId("requests").addItem(oCustomListItem);

							return that.fnGetODataValueListsBase.call(oContext, oPropertyContext);
						};
					},
					clearRequestsLog: function () {
						this.byId("requests").removeAllItems();
					},
					onExit: function () {
						BaseValueListProvider.prototype._loadAnnotation = this.fnLoadAnnotationBase;
						ODataMetaModel.prototype.getODataValueLists = this.fnGetODataValueListsBase;
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
