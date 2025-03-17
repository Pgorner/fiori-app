(function () {
	"use strict";

	sap.ui.require(["sap/ui/core/Core"], function(Core) {

		Core.ready(function () {

			sap.ui.require([
				"sap/m/StandardListItem",
				"sap/ui/comp/state/UIState",
				"sap/ui/comp/variants/VariantItem",
				"sap/ui/core/mvc/XMLView",
				"sap/ui/core/mvc/Controller",
				"sap/ui/model/odata/v2/ODataModel",
				"sap/ui/core/util/MockServer",
				"sap/ui/model/odata/ODataUtils",
				"sap/ui/core/Element"
			], function (
				StandardListItem,
				UIState,
				VariantItem,
				XMLView,
				Controller,
				ODataModel,
				MockServer,
				ODataUtils,
				Element
			) {
				var MyController = Controller.extend("mainView.controller", {
					onInit: function () {
						var oModel,
							sServiceName = "testService";

						this.setupMockServer(sServiceName);

						oModel = new ODataModel(sServiceName + "/", {
							useBatch: false,
							defaultBindingMode: "TwoWay"
						});

						this.oSmartFilterBar = this.byId("smartFilterBar");
						if (this.oSmartFilterBar && this.oSmartFilterBar.getSmartVariant()) {
							//simulate standard item
							var oSVM = this.oSmartFilterBar.getSmartVariant();
							oSVM._getVariantById = function (sId) {
								return {
									getVariantId: function () {
										return oSVM.STANDARDVARIANTKEY;
									},
									getName: function () {
										return "Standard";
									},
									isUserDependent: function () {
										return false;
									},
									isDeleteEnabled: function () {
										return false;
									},
									isRenameEnabled: function () {
										return false;
									},
									isEditEnabled: function () {
										return false;
									},
									getFavorite: function () {
										return true;
									},
									getExecuteOnSelection: function () {
										return false;
									},
									getOwnerId: function () {
										return "TEST";
									},
									getContexts: function () {
										return [];
									},
									getContent: function () {
										return null;
									}
								};
							};

							oSVM.addVariantItem(new VariantItem({key: oSVM.STANDARDVARIANTKEY, text: "Standard"}));
							oSVM.setSelectionKey(oSVM.STANDARDVARIANTKEY);
						}

						this.oFilterResult = this.byId("filterResult");
						this.getView().setModel(oModel);
					},
					handleInitialized: function () {
						setTimeout(function () {
							// Clear the SmartFilterBar
							this.oSmartFilterBar.clear();
							this.byId("filterChangeEventLog").addItem(new StandardListItem({
								title: "SmartFilterBar.clear();"
							}));

							// We set the UI state
							this.oSmartFilterBar.setUiState(new UIState({
								selectionVariant: {
									"Version": {"Major": "1", "Minor": "0", "Patch": "0"},
									"SelectionVariantID": "",
									"Text": "Selection Variant with ID ",
									"ODataFilterExpression": "",
									"Parameters": [],
									"SelectOptions": [{
										"PropertyName": "STRING_AUTO",
										"Ranges": [{"Sign": "I", "Option": "EQ", "Low": "1", "High": null}]
									},
										{
											"PropertyName": "STRING_MANDATORY",
											"Ranges": [{"Sign": "I", "Option": "EQ", "Low": "1", "High": null}]
										}]
								}
							}), {
								replace: true,
								strictMode: false
							});
							this.byId("filterChangeEventLog").addItem(new StandardListItem({
								title: "setUiState"
							}));

							// We mark the variant as not-dirty
							this.byId("smartvariant").currentVariantSetModified(false);
							this.byId("filterChangeEventLog").addItem(new StandardListItem({
								title: "Synchronous call to currentVariantSetModified(false);"
							}));

						}.bind(this), 100);
					},
					onFilterChange: function () {
						if (!this._count) {
							this._count = 0;
						}
						this.byId("filterChangeEventLog").addItem(new StandardListItem({
							title: "filterChange Event fired ",
							counter: ++this._count
						}));
					},
					onSearch: function () {
						var oFP = this.oSmartFilterBar._oFilterProvider;

						this.oFilterResult.setText(
							decodeURIComponent(
								ODataUtils._createFilterParams(
									this.oSmartFilterBar.getFilters(),
									oFP._oParentODataModel.oMetadata,
									oFP._oMetadataAnalyser._getEntityDefinition(oFP.sEntityType)
								)
							)
						);
					},
					onExit: function () {
						this._oMockServer.stop();
					},
					setupMockServer: function (service) {
						var basePath = service,
							mockServer = new MockServer({
								rootUri: basePath
							}),
							aReqList = mockServer.getRequests();

						// $metadata
						aReqList.push({
							method: 'GET',
							path: '/\\$metadata(.*)',
							response: function (req, resp) {
								req.respondXML(200, {}, document.getElementById("metadata").textContent);
							}
						});

						// Data
						aReqList.push({
							method: 'GET',
							path: '/\\StringVH3(.*)',
							response: function (req, resp) {
								var sRequest = decodeURIComponent(req.url),
									aMatch = /filter=KEY eq '([0-9]+)'/.exec(sRequest),
									oData,
									aResult;

								if (aMatch && aMatch[1]) {
									oData = JSON.parse(document.getElementById("dataSection3").textContent);

									aResult = oData.d.results.filter(function (oResult) {
										return oResult.KEY === aMatch[1];
									});

									req.respondJSON(200, {}, JSON.stringify({
										d: {
											results: aResult,
											"__count": aResult.length
										}
									}));
								} else {
									req.respondJSON(200, {}, document.getElementById("dataSection3").textContent);
								}
							}
						});

						// Data
						aReqList.push({
							method: 'GET',
							path: '/\\StringVH2(.*)',
							response: function (req, resp) {
								req.respondJSON(200, {}, document.getElementById("dataSection2").textContent);
							}
						});

						// Data
						aReqList.push({
							method: 'GET',
							path: '/\\StringVH[\/?](.*)',
							response: function (req, resp) {
								var sRequest = decodeURIComponent(req.url),
									aMatch = /filter=KEY eq '([0-9]+)'/.exec(sRequest),
									oData,
									aResult;

								Element.getElementById("mainView--filterChangeEventLog").addItem(new StandardListItem({title: "Backend request & response for VH data"}));

								if (aMatch && aMatch[1]) {
									oData = JSON.parse(document.getElementById("dataSection").textContent);

									aResult = oData.d.results.filter(function (oResult) {
										return oResult.KEY === aMatch[1];
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

						mockServer.setRequests(aReqList);
						mockServer.simulate(basePath + '/$metadata',
							{
								sMockdataBaseUrl: basePath + '/Employees',
								bGenerateMissingMockData: true
							});
						mockServer.start();
					}
				});

				XMLView.create({
					id: "mainView",
					definition: document.getElementById("mainViewXML").textContent,
					controller: new MyController()
				}).then(function (oView) {
					oView.placeAt("content");
				});

			});

		});
	});
})();
