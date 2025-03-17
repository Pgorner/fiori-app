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
				"sap/ui/model/Filter",
				"sap/ui/core/util/MockServer",
				"sap/ui/comp/smartfield/SmartField",
				"sap/ui/core/Element"
			], function (
				CustomListItem,
				Panel,
				StandardListItem,
				Text,
				XMLView,
				Controller,
				ODataModel,
				Filter,
				MockServer,
				SmartField,
				Element
			) {
				var MyController = Controller.extend("mainView.controller", {
					onInit: function () {
						var oModel,
							aGroups,
							sServiceName = "testService";

						this.setupMockServer(sServiceName);

						oModel = new ODataModel(sServiceName + "/", {
							useBatch: false,
							defaultBindingMode: "TwoWay"
						});

						this.byId("smartForm").setModel(oModel);
						this.byId("SuppressText").setModel(oModel);
						this.byId("leftoverDescription").setModel(oModel);
						this.byId("FiscalForm").setModel(oModel);
						this.byId("Space").setModel(oModel);
						// this.byId("CorrectPath").setModel(oModel); // deprecated controlProposal

						oModel.getMetaModel().loaded().then(function () {
							// Disable text arrangement cache for test instance
							this.byId("NameInOut1").attachInitialise(function (oEvent) {
								oEvent.getSource().getControlFactory().oTextArrangementDelegate.getDataForNextDescriptionRequest = function () {
									return false;
								};
							});

							this.byId("smartForm").bindElement("/Employees('0001')");
						}.bind(this));

						// Add myDeferred as a deferred group to the model
						aGroups = oModel.getDeferredGroups();
						aGroups.push("myDeferred");
						oModel.setDeferredGroups(aGroups);

						this._oModel = oModel;
					},
					bindTARFields: function () {
						var oModelA,
							oModelB,
							oModelC,
							sServiceName = "testService";

						oModelA = new ODataModel(sServiceName + "/", {
							useBatch: false,
							defaultBindingMode: "TwoWay"
						});

						oModelB = new ODataModel(sServiceName + "/", {
							useBatch: false,
							defaultBindingMode: "TwoWay"
						});

						oModelC = new ODataModel(sServiceName + "/", {
							useBatch: false,
							defaultBindingMode: "TwoWay"
						});

						// Preload VL data for model C and bind fields
						oModelC.read("/StringVH", {
							filters: [
								new Filter("KEY", [{operator: "EQ", value1: "1"}])
							],
							success: function () {
								this.byId("TARGE0").setModel(oModelA);
								this.byId("TARGE0").bindElement("/Employees('0001')");

								this.byId("TARGE1").setModel(oModelA);
								this.byId("TARGE1").bindElement("/Employees('0001')");

								this.byId("TARGE2").setModel(oModelB);
								this.byId("TARGE2").bindElement("/Employees('0001')");

								this.byId("TARGE3").setModel(oModelC);
								this.byId("TARGE3").bindElement("/Employees('0001')");
							}.bind(this)
						});
					},
					handleChange: function (oEvent) {
						var sPath = oEvent.getSource().getBinding("value").getPath(),
							oPendingChanges = this._oModel.getPendingChanges(),
							sFieldPendingChange;

						if (oPendingChanges && oPendingChanges["Employees('0001')"]) {
							sFieldPendingChange = oPendingChanges["Employees('0001')"][sPath];
						}

						this.byId("events").addItem(new StandardListItem({
							title: "Change event fired for '" + sPath + "': " + sFieldPendingChange
						}));
					},
					resetModel: function () {
						this._oModel.resetChanges();
					},
					clearLog: function () {
						this.byId("events").removeAllItems();
					},
					emptyModelValues: function () {
						this._oModel.setProperty("/Employees('0001')/LOCALKEY2", null);
						this._oModel.setProperty("/Employees('0001')/LOCALKEY3", null);
					},
					switchToDisplay: function () {
						this._createFieldWithBinding();
					},
					switchToEdit: function () {
						this._createFieldWithBinding(true);
					},
					_createFieldWithBinding: function (bEdit) {
						// Scenario from BCP: 2270138044 where the field is re-created on every
						// mode change and every time bound to a transient entry.
						var oForm = this.byId("SuppressText"),
							oField,
							oGE = this.byId("ge1"),
							oEntry = this._oModel.createEntry("/Employees", {
								properties: {
									"Id": "1" + Math.floor(Math.random() * 100000),
									"NameNotExpanded": "2"
								},
								groupId: "myDeferred"
							}),
							sPath = oEntry && oEntry.getPath();

						oForm.bindElement({
							path: sPath
						});
						oForm.setEditable(bEdit);

						oField = new SmartField({
							value: "{NameNotExpanded}",
							editable: bEdit,
							textInEditModeSource: "ValueList"
						});

						oField.data("suppressCommonText", "true");

						oGE.removeAllElements();
						oGE.addElement(oField);
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
								req.respondJSON(200, {}, document.getElementById("dataSection").textContent);
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
									oData = JSON.parse(document.getElementById("dataSectionVH").textContent);

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

									if (sRequest.indexOf("$top=2") !== -1) {
										Element.getElementById("idView--events").addItem(
											new CustomListItem({
												content: new Panel({
													headerText: sRequest,
													content: new Text({renderWhitespace: true}).setText("Request:\n" + sRequest + "\n\nResponse:\n" + JSON.stringify(oResult, null, 4)),
													expandable: true
												})
											}).data("request", sRequest)
										);
									}
								} else {
									req.respondJSON(200, {}, document.getElementById("dataSectionVHZero").textContent);
								}
							}
						});

						// Data
						reqList.push({
							method: 'GET',
							path: '/\\ProductVH[\/?](.*)',
							response: function (req, resp) {
								var sRequest = decodeURIComponent(req.url),
									aMatch = sRequest.match(/([a-zA-Z0-9]+) eq '([\S]+)'/g),
									aMatchers = [],
									oData,
									aResult,
									sData = document.getElementById("dataSectionProductVH").textContent,
									oResult;

								// Suggestions requests - return all rows
								if (sRequest.indexOf("$top=2") === -1) {
									req.respondJSON(200, {}, sData);
									return;
								}

								aMatch.forEach(function (sMatch) {
									var aMatch = sMatch.match(/([a-zA-Z0-9]+) eq '([\S]+)'/);
									aMatchers.push(function (oResult) {
										return oResult[aMatch[1]] === aMatch[2];
									});
								});

								if (aMatch && aMatch[1] && sRequest.indexOf('$top=2') !== -1) {
									oData = JSON.parse(sData);

									aResult = oData.d.results.filter(function (oResult) {
										return aMatchers.every(function (fnMatcher) {
											return fnMatcher(oResult);
										});
									});

									oResult = {d: {results: aResult, "__count": aResult.length}};
									req.respondJSON(200, {}, JSON.stringify(oResult));

									Element.getElementById("idView--events").addItem(
										new CustomListItem({
											content: new Panel({
												headerText: sRequest,
												content: new Text({renderWhitespace: true}).setText("Request:\n" + sRequest + "\n\nResponse:\n" + JSON.stringify(oResult, null, 4)),
												expandable: true
											})
										}).data("request", sRequest)
									);
								}
							}
						});

						// Data
						reqList.push({
							method: 'GET',
							path: '/\\CompanyVH[\/?](.*)',
							response: function (req, resp) {
								var sRequest = decodeURIComponent(req.url),
									aMatch = sRequest.match(/([a-zA-Z0-9]+) eq '([\S]+)'/g),
									aMatchers = [],
									oData,
									aResult,
									sData = document.getElementById("dataSectionCompanyVH").textContent,
									oResult;

								// Suggestions requests - return all rows
								if (sRequest.indexOf("$top=2") === -1) {
									req.respondJSON(200, {}, sData);
									return;
								}

								aMatch.forEach(function (sMatch) {
									var aMatch = sMatch.match(/([a-zA-Z0-9]+) eq '([\S]+)'/);
									aMatchers.push(function (oResult) {
										return oResult[aMatch[1]] === aMatch[2];
									});
								});

								if (aMatch && aMatch[1] && sRequest.indexOf('$top=2') !== -1) {
									oData = JSON.parse(sData);

									aResult = oData.d.results.filter(function (oResult) {
										return aMatchers.every(function (fnMatcher) {
											return fnMatcher(oResult);
										});
									});

									oResult = {d: {results: aResult, "__count": aResult.length}};
									req.respondJSON(200, {}, JSON.stringify(oResult));

									Element.getElementById("idView--events").addItem(
										new CustomListItem({
											content: new Panel({
												headerText: sRequest,
												content: new Text({renderWhitespace: true}).setText("Request:\n" + sRequest + "\n\nResponse:\n" + JSON.stringify(oResult, null, 4)),
												expandable: true
											})
										}).data("request", sRequest)
									);
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
