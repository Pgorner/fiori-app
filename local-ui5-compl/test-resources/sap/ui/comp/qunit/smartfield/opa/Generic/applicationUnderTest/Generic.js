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
				"sap/ui/core/Core",
				"sap/m/CustomListItem"
			], function (
				Panel,
				Text,
				XMLView,
				Controller,
				ODataModel,
				MockServer,
				Fragment,
				Core,
				CustomListItem
			) {
				var MyController = Controller.extend("mainView.controller", {
					onInit: function () {
						var oMM = Core.getMessageManager(),
							oModel,
							sServiceName = "testService",
							aGroups;

						this.setupMockServer(sServiceName);

						oModel = new ODataModel(sServiceName + "/", {
							useBatch: false,
							defaultCountMode: "Inline",
							defaultBindingMode: "TwoWay"
						});

						this.getView().setModel(oModel);

						this._oModel = oModel;

						oMM.registerObject(this.getView(), true);
						this.getView().setModel(oMM.getMessageModel(), "message");

						oModel.attachPropertyChange(this._dumpPendingChanges.bind(this));

						this._dumpPendingChanges();

						aGroups = oModel.getDeferredGroups();
						aGroups.push("myDeferred");
						oModel.setDeferredGroups(aGroups);

						oModel.getMetaModel().loaded().then(function () {
							var oEntry = oModel.createEntry("/Immutable", {
									properties : {
										"Name": "MyCreatedName"
									}
								}),
								sPath = oEntry.getPath();

							this.byId("ImmutableGroup").bindElement({
								path: sPath
							});
						}.bind(this));

						this.bindFunctionImportHidden();
					},
					fnVisualizeNBSP: function (sString) {
						return sString.replace(/\u00A0/g, "[NBSP]");
					},
					clearLog: function () {
						this.byId("events").removeAllItems();
					},
					submitChanges: function () {
						this._oModel.submitChanges();
					},
					switchToEdit: function () {
						var oField1 = this.byId("Field1"),
							oFieldEditable = this.byId("Field2"),
							oFieldCorrupt = this.byId("FieldCorrupt"),
							oST = this.byId("smartTable1"),
							oSection = this.byId("gnrp"),
							aFields = [
								oField1,
								oFieldCorrupt,
								oFieldEditable
							],
							i = 0;

						oSection.setBusyIndicatorDelay(0);
						oSection.setBusy(true);

						oST.findAggregatedObjects(true, function (oControl) {
							var bSF = oControl.isA("sap.ui.comp.smartfield.SmartField");

							// We return only the first two fields as others are reserved
							// by the SmartTable and will not be evaluated.
							if (i < 2 && bSF && oControl.getDomRef()) {
								aFields.push(oControl);
								i++;
							}
						});

						Promise.allSettled(aFields.map(function (oField) {
							return oField._getNextModeRenderedPromise();
						})).then(function (aResults) {
							// Find the first editable control
							var oResult = aResults.find(function (o) {
								if (
									o.status === "fulfilled" &&
									o.value &&
									o.value.getMode() === "edit"
								) {
									return true;
								}
								return false;
							});

							// Focus it
							if (oResult) {
								oResult.value.focus();
							}

							oSection.setBusy(false);
						});

						this.byId("smartForm1").setEditable(true);
						oST.setEditable(true);
					},
					switchToEdit2: function () {
						var oField3 = this.byId("Field3"),
							oField4 = this.byId("Field4"),
							oSF = this.byId("smartForm2");

						oSF.setBindingContext(null);

						setTimeout(function () {
							oSF.setEditable(true);
							oSF.bindObject("/Employees('0002')");

							setTimeout(function () {
								oField3._getICRenderedPromise().then(function () {
									if (oField3.getMode() === "edit") {
										oField3.getFirstInnerControl().focus();
									}
								});

								oField4._getICRenderedPromise().then(function () {
									if (oField4.getMode() === "edit") {
										oField4.getFirstInnerControl().focus();
									}
								});
							}, 100);
						}, 100);
					},
					_dumpPendingChanges: function () {
						this.byId("modelDump").setText(
							this.fnVisualizeNBSP(JSON.stringify(this._oModel.getPendingChanges(), null, "\t"))
						);
					},
					onMessagePopoverPress: function (oEvent) {
						var oButton = oEvent.getSource();
						this._getMessagePopover().then(function (oMessagePopover) {
							oMessagePopover.openBy(oButton);
						});
					},
					setShowValueHelp: function () {
						var oField7 = this.byId("field7");
						oField7.setShowValueHelp(true);
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
					bindFunctionImport: function () {
						var oHandle = this._oModel.callFunction("/MyFunctionImport", {
							urlParameters: {
								Field5: "Field5: Some initial value",
								FieldFC: "FieldFC: Some initial value",
								FC: 1,
								MyCustomParameter: "MyCustomParameter: Some initial value",
								FieldControlTypeReadOnlyFunctionImport: "FieldControlTypeReadOnlyFunctionImport: Some value",
								ReadOnlyFunctionImport: "ReadOnlyFunctionImport: Some value"
							},
							groupId: "myDeferred",
							method: "POST"
						});

						oHandle.contextCreated().then(function (oContext) {
							this.byId("functionImportForm").bindElement({path: oContext.getPath()});
						}.bind(this));
					},
					bindFunctionImportHidden: function () {
						var oHandle = this._oModel.callFunction("/MyFunctionImport", {
							urlParameters: {
								HiddenEntityType: "HiddenEntityType: Some initial value",
								HiddenFunctionImport: "HiddenFunctionImport: Some initial value",
								HiddenFunctionImportCustom: "HiddenFunctionImportCustom: Some initial value"
							},
							groupId: "myDeferred",
							method: "POST"
						});

						oHandle.contextCreated().then(function (oContext) {
							this.byId("functionImportVisibilityForm").bindElement({path: oContext.getPath()});
						}.bind(this));
					},
					bindFunctionImportValueList: function () {
						var oHandle = this._oModel.callFunction("/MyFunctionImport", {
							urlParameters: {
								FIVL_FC:7,
								FunctionImportValueList: "Name Function Import Value"
							},
							groupId: "myDeferred",
							method: "POST"
						});

						oHandle.contextCreated().then(function (oContext) {
							this.byId("functionImportValueHelpForm").bindElement({path: oContext.getPath()});
						}.bind(this));
					},
					bindFunctionImportValueListLazy: function () {
						var oHandle = this._oModel.callFunction("/MyFunctionImportLazy", {
							urlParameters: {
								FIVL_Lazy_FC:7,
								FunctionImportValueListLazy: "Name Function Import Value Lazy"
							},
							groupId: "myDeferred",
							method: "POST"
						});

						oHandle.contextCreated().then(function (oContext) {
							this.byId("functionImportValueHelpForm").bindElement({path: oContext.getPath()});
						}.bind(this));
					},
					resetModel: function () {
						this._oModel.resetChanges();
						this._dumpPendingChanges();
						this.byId("op").bindObject("/Employees('0001')");
						this.byId("functionImportForm").unbindObject();
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
								if (req.url.includes("MyFunctionImportLazy") && req.url.includes("sap-value-list")){
									Core.byId("idView--requestedFILazy").setHtmlText(decodeURIComponent(req.url));
									req.respondXML(200, {}, document.getElementById("annotations").textContent);
								} else {
									req.respondXML(200, {}, document.getElementById("metadata").textContent);
								}
							}
						});

						// Data
						reqList.push({
							method: 'GET',
							path: '/\\Employees(.*)',
							response: function (req, resp) {
								if (req.url.indexOf("0001") !== -1) {
									req.respondJSON(200, {}, document.getElementById("employees0001").textContent);
								} else if (req.url.indexOf("0002") !== -1) {
									req.respondJSON(200, {}, document.getElementById("employees0002").textContent);
								} else {
									req.respondJSON(200, {}, document.getElementById("employees").textContent);
								}
							}
						});

						// Data
						reqList.push({
							method: 'GET',
							path: '/\\Immutable(.*)',
							response: function (req, resp) {
								req.respondJSON(200, {}, document.getElementById("immutable").textContent);
							}
						});

						// Data
						reqList.push({
							method: 'GET',
							path: '/\\FunctionImportType(.*)',
							response: function (req, resp) {
								req.respondJSON(200, {}, document.getElementById("FunctionImportType").textContent);
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

						reqList.push({
							method: 'GET',
							path: '/\\StringFI[\/?](.*)',
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
									oData = JSON.parse(document.getElementById("stringFI").textContent);

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

						reqList.push({
							method: 'GET',
							path: '/\\StringFILazy[\/?](.*)',
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
									oData = JSON.parse(document.getElementById("stringFILazy").textContent);

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


						reqList.push({
							method: 'GET',
							path: '/\\help_global_brandname[\/?](.*)',
							response: function (req, resp) {
								req.respondJSON(200, {}, document.getElementById("globalbrandnameVH").textContent);
							}
						});

						// Data
						reqList.push({
							method: 'POST',
							path: '/\\Employees(.*)',
							response: function (req, resp) {
								var sBody = req.requestBody,
									sRequest = req.url,
									oCLI;

								sBody = this.fnVisualizeNBSP(JSON.stringify(JSON.parse(sBody), null, 4));

								oCLI = new CustomListItem({
									content: new Panel({
										headerText: "[POST] " + sRequest,
										content: new Text({renderWhitespace: true})
											.setText("Request:\n" + sRequest + "\n\nResponse:\n" + sBody),
										expandable: true
									})
								});

								oCLI.data("requestType", "POST");
								oCLI.data("request", sRequest);
								oCLI.data("body", JSON.parse(sBody));

								this.byId("events").addItem(oCLI);
								req.respond(200);
							}.bind(this)
						});

						// Data
						reqList.push({
							method: 'GET',
							path: '/\\Field6StringVH[\/?](.*)',
							response: function(req, resp) {
								var sURL = decodeURIComponent(req.url);

								if (sURL.indexOf("$select=TXT") !== -1) {
									req.respondJSON(200, {}, document.getElementById("Field6stringVHTXT").textContent);
								} else {
									req.respondJSON(200, {}, document.getElementById("Field6stringVHKEYTXT").textContent);
								}
							}
						});

						// Data
						reqList.push({
							method: 'GET',
							path: '/\\Field7StringVH[\/?](.*)',
							response: function(req, resp) {
								var sURL = decodeURIComponent(req.url);

								if (sURL.indexOf("$select=TXT") !== -1) {
									req.respondJSON(200, {}, document.getElementById("Field7stringVHTXT").textContent);
								} else {
									req.respondJSON(200, {}, document.getElementById("Field7stringVHKEYTXT").textContent);
								}
							}
						});

						// Data
						reqList.push({
							method: 'GET',
							path: '/\\FieldExpandStringVH[\/?](.*)',
							response: function(req, resp) {
								var sURL = decodeURIComponent(req.url);

								if (sURL.includes("$expand=to_nonExistingNavigation")) {
									req.respondJSON(202, {});
								} else {
									req.respondJSON(200, {}, document.getElementById("stringVH").textContent);
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
