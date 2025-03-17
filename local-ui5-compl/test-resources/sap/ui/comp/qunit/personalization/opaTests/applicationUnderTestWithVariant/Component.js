sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/core/util/MockServer",
	'sap/chart/library' // In here as chart lib cannot be loaded in manifest due to interference with sinon - workarround
], function(
	UIComponent,
	MockServer,
	chartLib // In here as chart lib cannot be loaded in manifest due to interference with sinon - workarround
) {
	"use strict";

	return UIComponent.extend("applicationUnderTestWithVariant.Component", {
		metadata: {
			manifest: "json"
		},

		init: function() {
			this.oMockServer = new MockServer({
				rootUri: "/applicationUnderTestWithVariant/"
			});
			this.oMockServer.simulate("mockserver/metadata.xml", "mockserver/");
			this.oMockServer.start();

			// Arrange for VariantManagement (we have to fake the connection to LRep in order to be independent from backend)

			// Save Variant
			window.localStorage.setItem("sap.ui.fl.id_applicationUnderTestWithVariant00_table", JSON.stringify({
				changeType: "table",
				conditions: {},
				content: {
					sort: {
						sortItems: [
							{
								columnKey: "Name",
								operation: "Ascending"
							}
						]
					}
				},
				context: "",
				creation: "2017-09-15T07:22:03.112Z",
				dependentSelector: {},
				fileName: "id_applicationUnderTestWithVariant00_table",
				fileType: "variant",
				layer: "USER",
				namespace: "apps/applicationUnderTestWithVariant/changes/",
				originalLanguage: "EN",
				packageName: "",
				reference: "applicationUnderTestWithVariant.Component",
				selector: {
					persistencyKey: "PKeyApplicationUnderTestWithVariant"
				},
				support: {
					generator: "Change.createInitialFileContent",
					sapui5Version: "1.51.0-SNAPSHOT",
					service: "",
					user: ""
				},
				texts: {
					variantName: {
						type: "XFLD",
						value: "SortByName"
					}
				},
				validAppVersions: {
					creation: "",
					from: ""
				}
			}));
			window.localStorage.setItem("sap.ui.fl.id_1611319017630_27_addFavorite", JSON.stringify({"fileName":"id_1611319017630_27_addFavorite","fileType":"change","changeType":"addFavorite","moduleName":"","reference":"applicationUnderTestWithVariant.Component","packageName":"","content":{"key":"id_applicationUnderTestWithVariant00_table","visible":true},"selector":{"persistencyKey":"PKeyApplicationUnderTestWithVariant"},"layer":"USER","texts":{},"namespace":"apps/applicationUnderTestWithVariant/changes/","projectId":"applicationUnderTestWithVariant","creation":"2021-01-22T12:36:57.640Z","originalLanguage":"EN","support":{"generator":"Change.createInitialFileContent","service":"","user":"","sapui5Version":"1.87.0-SNAPSHOT","sourceChangeFileName":"","compositeCommand":"","command":""},"oDataInformation":{},"dependentSelector":{},"jsOnly":false,"variantReference":"","appDescriptorChange":false}));

			window.localStorage.setItem("sap.ui.fl.id_applicationUnderTestWithVariant01_table", JSON.stringify({
				changeType: "table",
				conditions: {},
				content: {
					columns: {
						columnsItems: [
							{
								columnKey: "Price",
								visible: true,
								index: 0
							},
							{
								columnKey: "Date",
								visible: true
							}
						]
					},
					sort: {sortItems: []}
				},
				context: "",
				creation: "2017-09-15T07:22:03.112Z",
				dependentSelector: {},
				fileName: "id_applicationUnderTestWithVariant01_table",
				fileType: "variant",
				layer: "USER",
				namespace: "apps/applicationUnderTestWithVariant/changes/",
				originalLanguage: "EN",
				packageName: "",
				reference: "applicationUnderTestWithVariant.Component",
				selector: {
					persistencyKey: "PKeyApplicationUnderTestWithVariant"
				},
				support: {
					generator: "Change.createInitialFileContent",
					sapui5Version: "1.51.0-SNAPSHOT",
					service: "",
					user: ""
				},
				texts: {
					variantName: {
						type: "XFLD",
						value: "PriceAtFirstAndDateAtLast"
					}
				},
				validAppVersions: {
					creation: "",
					from: ""
				}
			}));
			window.localStorage.setItem("sap.ui.fl.id_1611313842720_25_addFavorite", JSON.stringify({"fileName":"id_1611313842720_25_addFavorite","fileType":"change","changeType":"addFavorite","moduleName":"","reference":"applicationUnderTestWithVariant.Component","packageName":"","content":{"key":"id_applicationUnderTestWithVariant01_table","visible":true},"selector":{"persistencyKey":"PKeyApplicationUnderTestWithVariant"},"layer":"USER","texts":{},"namespace":"apps/applicationUnderTestWithVariant/changes/","projectId":"applicationUnderTestWithVariant","creation":"2021-01-22T11:10:42.722Z","originalLanguage":"EN","support":{"generator":"Change.createInitialFileContent","service":"","user":"","sapui5Version":"1.87.0-SNAPSHOT","sourceChangeFileName":"","compositeCommand":"","command":""},"oDataInformation":{},"dependentSelector":{},"jsOnly":false,"variantReference":"","appDescriptorChange":false}));


			window.localStorage.setItem("sap.ui.fl.id_applicationUnderTestWithVariant02_table", JSON.stringify({
				changeType: "table",
				conditions: {},
				content: {
					columns: {
						fixedColumnCount: 1,
						columnsItems: [
							{
								columnKey: "Name",
								width: "161px"
							}
						]
					},
					sort: {sortItems: []}
				},
				context: "",
				creation: "2017-09-15T07:22:03.112Z",
				dependentSelector: {},
				fileName: "id_applicationUnderTestWithVariant02_table",
				fileType: "variant",
				layer: "USER",
				namespace: "apps/applicationUnderTestWithVariant/changes/",
				originalLanguage: "EN",
				packageName: "",
				reference: "applicationUnderTestWithVariant.Component",
				selector: {
					persistencyKey: "PKeyApplicationUnderTestWithVariant"
				},
				support: {
					generator: "Change.createInitialFileContent",
					sapui5Version: "1.51.0-SNAPSHOT",
					service: "",
					user: ""
				},
				texts: {
					variantName: {
						type: "XFLD",
						value: "Compatibility01"
					}
				},
				validAppVersions: {
					creation: "",
					from: ""
				}
			}));
			window.localStorage.setItem("sap.ui.fl.id_1611319135612_35_addFavorite", JSON.stringify({"fileName":"id_1611319135612_35_addFavorite","fileType":"change","changeType":"addFavorite","moduleName":"","reference":"applicationUnderTestWithVariant.Component","packageName":"","content":{"key":"id_applicationUnderTestWithVariant02_table","visible":true},"selector":{"persistencyKey":"PKeyApplicationUnderTestWithVariant"},"layer":"USER","texts":{},"namespace":"apps/applicationUnderTestWithVariant/changes/","projectId":"applicationUnderTestWithVariant","creation":"2021-01-22T12:38:55.623Z","originalLanguage":"EN","support":{"generator":"Change.createInitialFileContent","service":"","user":"","sapui5Version":"1.87.0-SNAPSHOT","sourceChangeFileName":"","compositeCommand":"","command":""},"oDataInformation":{},"dependentSelector":{},"jsOnly":false,"variantReference":"","appDescriptorChange":false}));

			window.localStorage.setItem("sap.ui.fl.id_applicationUnderTestWithVariant03_table", JSON.stringify({
				changeType: "table",
				conditions: {},
				content: {
					columns: {
						columnsItems: [
							{
								columnKey: "Category",
								index: 0
							},
							{
								columnKey: "Name",
								index: 1
							}
						]
					},
					sort: {sortItems: []}
				},
				context: "",
				creation: "2017-09-15T07:22:03.112Z",
				dependentSelector: {},
				fileName: "id_applicationUnderTestWithVariant03_table",
				fileType: "variant",
				layer: "USER",
				namespace: "apps/applicationUnderTestWithVariant/changes/",
				originalLanguage: "EN",
				packageName: "",
				reference: "applicationUnderTestWithVariant.Component",
				selector: {
					persistencyKey: "PKeyApplicationUnderTestWithVariant"
				},
				support: {
					generator: "Change.createInitialFileContent",
					sapui5Version: "1.51.0-SNAPSHOT",
					service: "",
					user: ""
				},
				texts: {
					variantName: {
						type: "XFLD",
						value: "Compatibility02"
					}
				},
				validAppVersions: {
					creation: "",
					from: ""
				}
			}));
			window.localStorage.setItem("sap.ui.fl.d_1611319200712_39_addFavorite", JSON.stringify({"fileName":"id_1611319200712_39_addFavorite","fileType":"change","changeType":"addFavorite","moduleName":"","reference":"applicationUnderTestWithVariant.Component","packageName":"","content":{"key":"id_applicationUnderTestWithVariant03_table","visible":true},"selector":{"persistencyKey":"PKeyApplicationUnderTestWithVariant"},"layer":"USER","texts":{},"namespace":"apps/applicationUnderTestWithVariant/changes/","projectId":"applicationUnderTestWithVariant","creation":"2021-01-22T12:40:00.721Z","originalLanguage":"EN","support":{"generator":"Change.createInitialFileContent","service":"","user":"","sapui5Version":"1.87.0-SNAPSHOT","sourceChangeFileName":"","compositeCommand":"","command":""},"oDataInformation":{},"dependentSelector":{},"jsOnly":false,"variantReference":"","appDescriptorChange":false}));

			window.localStorage.setItem("sap.ui.fl.id_applicationUnderTestWithVariant04_table", JSON.stringify({
				changeType: "table",
				conditions: {},
				content: {
					columns: {
						columnsItems: [
							{
								columnKey: "Category",
								index: 0
							},
							{
								columnKey: "Name",
								index: 1,
								visible: false
							}
						]
					},
					sort: {sortItems: []}
				},
				context: "",
				creation: "2017-09-15T07:22:03.112Z",
				dependentSelector: {},
				fileName: "id_applicationUnderTestWithVariant04_table",
				fileType: "variant",
				layer: "USER",
				namespace: "apps/applicationUnderTestWithVariant/changes/",
				originalLanguage: "EN",
				packageName: "",
				reference: "applicationUnderTestWithVariant.Component",
				selector: {
					persistencyKey: "PKeyApplicationUnderTestWithVariant"
				},
				support: {
					generator: "Change.createInitialFileContent",
					sapui5Version: "1.51.0-SNAPSHOT",
					service: "",
					user: ""
				},
				texts: {
					variantName: {
						type: "XFLD",
						value: "Compatibility03"
					}
				},
				validAppVersions: {
					creation: "",
					from: ""
				}
			}));
			window.localStorage.setItem("sap.ui.fl.id_1611319264647_43_addFavorite", JSON.stringify({"fileName":"id_1611319264647_43_addFavorite","fileType":"change","changeType":"addFavorite","moduleName":"","reference":"applicationUnderTestWithVariant.Component","packageName":"","content":{"key":"id_applicationUnderTestWithVariant04_table","visible":true},"selector":{"persistencyKey":"PKeyApplicationUnderTestWithVariant"},"layer":"USER","texts":{},"namespace":"apps/applicationUnderTestWithVariant/changes/","projectId":"applicationUnderTestWithVariant","creation":"2021-01-22T12:41:04.659Z","originalLanguage":"EN","support":{"generator":"Change.createInitialFileContent","service":"","user":"","sapui5Version":"1.87.0-SNAPSHOT","sourceChangeFileName":"","compositeCommand":"","command":""},"oDataInformation":{},"dependentSelector":{},"jsOnly":false,"variantReference":"","appDescriptorChange":false}));

			window.localStorage.setItem("sap.ui.fl.id_applicationUnderTestWithVariant05_table", JSON.stringify({
				changeType: "table",
				conditions: {},
				content: {
					columns: {
						columnsItems: [
							{
								columnKey: "Bool",
								index: 2,
								visible: true
							},
							{
								columnKey: "ProductId",
								index: 3
							},
							{
								columnKey: "Description",
								index: 4
							},
							{
								columnKey: "SupplierName",
								index: 5
							},
							{
								columnKey: "Quantity",
								index: 6
							},
							{
								columnKey: "UoM",
								index: 7
							},
							{
								columnKey: "WeightMeasure",
								index: 8
							},
							{
								columnKey: "WeightUnit",
								index: 9
							},
							{
								columnKey: "Price",
								index: 10
							},
							{
								columnKey: "Status",
								index: 11
							},
							{
								columnKey: "CurrencyCode",
								index: 12
							},
							{
								columnKey: "Width",
								index: 13
							},
							{
								columnKey: "Depth",
								index: 14
							},
							{
								columnKey: "Height",
								index: 15
							},
							{
								columnKey: "DimUnit",
								index: 16
							},
							{
								columnKey: "Date",
								index: 17
							},
							{
								columnKey: "Time",
								index: 18
							}
						]
					},
					sort: {sortItems: []}
				},
				context: "",
				creation: "2017-09-15T07:22:03.112Z",
				dependentSelector: {},
				fileName: "id_applicationUnderTestWithVariant05_table",
				fileType: "variant",
				layer: "USER",
				namespace: "apps/applicationUnderTestWithVariant/changes/",
				originalLanguage: "EN",
				packageName: "",
				reference: "applicationUnderTestWithVariant.Component",
				selector: {
					persistencyKey: "PKeyApplicationUnderTestWithVariant"
				},
				support: {
					generator: "Change.createInitialFileContent",
					sapui5Version: "1.51.0-SNAPSHOT",
					service: "",
					user: ""
				},
				texts: {
					variantName: {
						type: "XFLD",
						value: "Compatibility04"
					}
				},
				validAppVersions: {
					creation: "",
					from: ""
				}
			}));
			window.localStorage.setItem("sap.ui.fl.id_1611319322081_47_addFavorite", JSON.stringify({"fileName":"id_1611319322081_47_addFavorite","fileType":"change","changeType":"addFavorite","moduleName":"","reference":"applicationUnderTestWithVariant.Component","packageName":"","content":{"key":"id_applicationUnderTestWithVariant05_table","visible":true},"selector":{"persistencyKey":"PKeyApplicationUnderTestWithVariant"},"layer":"USER","texts":{},"namespace":"apps/applicationUnderTestWithVariant/changes/","projectId":"applicationUnderTestWithVariant","creation":"2021-01-22T12:42:02.091Z","originalLanguage":"EN","support":{"generator":"Change.createInitialFileContent","service":"","user":"","sapui5Version":"1.87.0-SNAPSHOT","sourceChangeFileName":"","compositeCommand":"","command":""},"oDataInformation":{},"dependentSelector":{},"jsOnly":false,"variantReference":"","appDescriptorChange":false}));

			window.localStorage.setItem("sap.ui.fl.id_applicationUnderTestWithVariant06_table", JSON.stringify({
				changeType: "table",
				conditions: {},
				content: {
					columns: {
						columnsItems: [
							{
								columnKey: "Bool",
								index: 0,
								visible: true
							},
							{
								columnKey: "Name",
								index: 1
							},
							{
								columnKey: "Category",
								index: 2
							},
							{
								columnKey: "ProductId",
								index: 3
							},
							{
								columnKey: "Description",
								index: 4
							},
							{
								columnKey: "SupplierName",
								index: 5
							},
							{
								columnKey: "Quantity",
								index: 6
							},
							{
								columnKey: "UoM",
								index: 7
							},
							{
								columnKey: "WeightMeasure",
								index: 8
							},
							{
								columnKey: "WeightUnit",
								index: 9
							},
							{
								columnKey: "Price",
								index: 10
							},
							{
								columnKey: "Status",
								index: 11
							},
							{
								columnKey: "CurrencyCode",
								index: 12
							},
							{
								columnKey: "Width",
								index: 13
							},
							{
								columnKey: "Depth",
								index: 14
							},
							{
								columnKey: "Height",
								index: 15
							},
							{
								columnKey: "DimUnit",
								index: 16
							},
							{
								columnKey: "Date",
								index: 17
							},
							{
								columnKey: "Time",
								index: 18
							}
						]
					},
					sort: {sortItems: []}
				},
				context: "",
				creation: "2017-09-15T07:22:03.112Z",
				dependentSelector: {},
				fileName: "id_applicationUnderTestWithVariant06_table",
				fileType: "variant",
				layer: "USER",
				namespace: "apps/applicationUnderTestWithVariant/changes/",
				originalLanguage: "EN",
				packageName: "",
				reference: "applicationUnderTestWithVariant.Component",
				selector: {
					persistencyKey: "PKeyApplicationUnderTestWithVariant"
				},
				support: {
					generator: "Change.createInitialFileContent",
					sapui5Version: "1.51.0-SNAPSHOT",
					service: "",
					user: ""
				},
				texts: {
					variantName: {
						type: "XFLD",
						value: "Compatibility05"
					}
				},
				validAppVersions: {
					creation: "",
					from: ""
				}
			}));
			window.localStorage.setItem("sap.ui.fl.id_1611319376389_51_addFavorite", JSON.stringify({"fileName":"id_1611319376389_51_addFavorite","fileType":"change","changeType":"addFavorite","moduleName":"","reference":"applicationUnderTestWithVariant.Component","packageName":"","content":{"key":"id_applicationUnderTestWithVariant06_table","visible":true},"selector":{"persistencyKey":"PKeyApplicationUnderTestWithVariant"},"layer":"USER","texts":{},"namespace":"apps/applicationUnderTestWithVariant/changes/","projectId":"applicationUnderTestWithVariant","creation":"2021-01-22T12:42:56.399Z","originalLanguage":"EN","support":{"generator":"Change.createInitialFileContent","service":"","user":"","sapui5Version":"1.87.0-SNAPSHOT","sourceChangeFileName":"","compositeCommand":"","command":""},"oDataInformation":{},"dependentSelector":{},"jsOnly":false,"variantReference":"","appDescriptorChange":false}));

			window.localStorage.setItem("sap.ui.fl.id_applicationUnderTestWithVariant07_table", JSON.stringify({
				changeType: "table",
				conditions: {},
				content: {
					columns: {
						columnsItems: [
							{
								columnKey: "Price",
								index: 2,
								visible: true
							},
							{
								columnKey: "ProductId",
								index: 3
							},
							{
								columnKey: "Description",
								index: 4
							},
							{
								columnKey: "SupplierName",
								index: 5
							},
							{
								columnKey: "Quantity",
								index: 6
							},
							{
								columnKey: "UoM",
								index: 7
							},
							{
								columnKey: "WeightMeasure",
								index: 8
							},
							{
								columnKey: "WeightUnit",
								index: 9
							}
						]
					},
					sort: {sortItems: []}
				},
				context: "",
				creation: "2017-09-15T07:22:03.112Z",
				dependentSelector: {},
				fileName: "id_applicationUnderTestWithVariant07_table",
				fileType: "variant",
				layer: "USER",
				namespace: "apps/applicationUnderTestWithVariant/changes/",
				originalLanguage: "EN",
				packageName: "",
				reference: "applicationUnderTestWithVariant.Component",
				selector: {
					persistencyKey: "PKeyApplicationUnderTestWithVariant"
				},
				support: {
					generator: "Change.createInitialFileContent",
					sapui5Version: "1.51.0-SNAPSHOT",
					service: "",
					user: ""
				},
				texts: {
					variantName: {
						type: "XFLD",
						value: "Compatibility06"
					}
				},
				validAppVersions: {
					creation: "",
					from: ""
				}
			}));
			window.localStorage.setItem("sap.ui.fl.id_1611319426218_55_addFavorite", JSON.stringify({"fileName":"id_1611319426218_55_addFavorite","fileType":"change","changeType":"addFavorite","moduleName":"","reference":"applicationUnderTestWithVariant.Component","packageName":"","content":{"key":"id_applicationUnderTestWithVariant07_table","visible":true},"selector":{"persistencyKey":"PKeyApplicationUnderTestWithVariant"},"layer":"USER","texts":{},"namespace":"apps/applicationUnderTestWithVariant/changes/","projectId":"applicationUnderTestWithVariant","creation":"2021-01-22T12:43:46.228Z","originalLanguage":"EN","support":{"generator":"Change.createInitialFileContent","service":"","user":"","sapui5Version":"1.87.0-SNAPSHOT","sourceChangeFileName":"","compositeCommand":"","command":""},"oDataInformation":{},"dependentSelector":{},"jsOnly":false,"variantReference":"","appDescriptorChange":false}));

			window.localStorage.setItem("sap.ui.fl.id_applicationUnderTestWithVariant08_table", JSON.stringify({
				changeType: "table",
				conditions: {},
				content: {
					columns: {
						columnsItems: [
							{
								columnKey: "Price",
								index: 2,
								visible: true
							},
							{
								columnKey: "ProductId",
								index: 3
							},
							{
								columnKey: "Description",
								index: 4
							},
							{
								columnKey: "SupplierName",
								index: 5
							},
							{
								columnKey: "Quantity",
								index: 6
							},
							{
								columnKey: "UoM",
								index: 7
							},
							{
								columnKey: "WeightMeasure",
								index: 8
							},
							{
								columnKey: "WeightUnit",
								index: 9
							}
						]
					},
					sort: {sortItems: []}
				},
				context: "",
				creation: "2017-09-15T07:22:03.112Z",
				dependentSelector: {},
				fileName: "id_applicationUnderTestWithVariant08_table",
				fileType: "variant",
				layer: "USER",
				namespace: "apps/applicationUnderTestWithVariant/changes/",
				originalLanguage: "EN",
				packageName: "",
				reference: "applicationUnderTestWithVariant.Component",
				selector: {
					persistencyKey: "PKeyApplicationUnderTestWithVariant"
				},
				support: {
					generator: "Change.createInitialFileContent",
					sapui5Version: "1.51.0-SNAPSHOT",
					service: "",
					user: ""
				},
				texts: {
					variantName: {
						type: "XFLD",
						value: "Compatibility07"
					}
				},
				validAppVersions: {
					creation: "",
					from: ""
				}
			}));
			window.localStorage.setItem("sap.ui.fl.id_1611319482011_59_addFavorite", JSON.stringify({"fileName":"id_1611319482011_59_addFavorite","fileType":"change","changeType":"addFavorite","moduleName":"","reference":"applicationUnderTestWithVariant.Component","packageName":"","content":{"key":"id_applicationUnderTestWithVariant08_table","visible":true},"selector":{"persistencyKey":"PKeyApplicationUnderTestWithVariant"},"layer":"USER","texts":{},"namespace":"apps/applicationUnderTestWithVariant/changes/","projectId":"applicationUnderTestWithVariant","creation":"2021-01-22T12:44:42.022Z","originalLanguage":"EN","support":{"generator":"Change.createInitialFileContent","service":"","user":"","sapui5Version":"1.87.0-SNAPSHOT","sourceChangeFileName":"","compositeCommand":"","command":""},"oDataInformation":{},"dependentSelector":{},"jsOnly":false,"variantReference":"","appDescriptorChange":false}));

			window.localStorage.setItem("sap.ui.fl.id_applicationUnderTestWithVariant09_table", JSON.stringify({
				changeType: "table",
				conditions: {},
				content: {
					columns: {
						columnsItems: [
							{
								columnKey: "Price",
								index: 0,
								visible: true
							},
							{
								columnKey: "Name",
								index: 1
							},
							{
								columnKey: "Category",
								index: 2
							},
							{
								columnKey: "ProductId",
								index: 3
							},
							{
								columnKey: "Description",
								index: 4
							},
							{
								columnKey: "SupplierName",
								index: 5
							},
							{
								columnKey: "Quantity",
								index: 6
							},
							{
								columnKey: "UoM",
								index: 7
							},
							{
								columnKey: "WeightMeasure",
								index: 8
							},
							{
								columnKey: "WeightUnit",
								index: 9
							}
						]
					},
					sort: {sortItems: []}
				},
				context: "",
				creation: "2017-09-15T07:22:03.112Z",
				dependentSelector: {},
				fileName: "id_applicationUnderTestWithVariant09_table",
				fileType: "variant",
				layer: "USER",
				namespace: "apps/applicationUnderTestWithVariant/changes/",
				originalLanguage: "EN",
				packageName: "",
				reference: "applicationUnderTestWithVariant.Component",
				selector: {
					persistencyKey: "PKeyApplicationUnderTestWithVariant"
				},
				support: {
					generator: "Change.createInitialFileContent",
					sapui5Version: "1.51.0-SNAPSHOT",
					service: "",
					user: ""
				},
				texts: {
					variantName: {
						type: "XFLD",
						value: "Compatibility08"
					}
				},
				validAppVersions: {
					creation: "",
					from: ""
				}
			}));
			window.localStorage.setItem("sap.ui.fl.id_1611319540695_63_addFavorite", JSON.stringify({"fileName":"id_1611319540695_63_addFavorite","fileType":"change","changeType":"addFavorite","moduleName":"","reference":"applicationUnderTestWithVariant.Component","packageName":"","content":{"key":"id_applicationUnderTestWithVariant09_table","visible":true},"selector":{"persistencyKey":"PKeyApplicationUnderTestWithVariant"},"layer":"USER","texts":{},"namespace":"apps/applicationUnderTestWithVariant/changes/","projectId":"applicationUnderTestWithVariant","creation":"2021-01-22T12:45:40.705Z","originalLanguage":"EN","support":{"generator":"Change.createInitialFileContent","service":"","user":"","sapui5Version":"1.87.0-SNAPSHOT","sourceChangeFileName":"","compositeCommand":"","command":""},"oDataInformation":{},"dependentSelector":{},"jsOnly":false,"variantReference":"","appDescriptorChange":false}));

			window.localStorage.setItem("sap.ui.fl.id_applicationUnderTestWithVariant10_table", JSON.stringify({
				changeType: "table",
				conditions: {},
				content: {
					columns: {
						columnsItems: [
							{
								columnKey: "Price",
								index: 2,
								visible: true
							},
							{
								columnKey: "ProductId",
								index: 3
							},
							{
								columnKey: "Description",
								index: 4
							},
							{
								columnKey: "SupplierName",
								index: 5
							},
							{
								columnKey: "Quantity",
								index: 6
							},
							{
								columnKey: "UoM",
								index: 7
							},
							{
								columnKey: "WeightMeasure",
								index: 8
							},
							{
								columnKey: "WeightUnit",
								index: 9
							}
						]
					},
					sort: {sortItems: []}
				},
				context: "",
				creation: "2017-09-15T07:22:03.112Z",
				dependentSelector: {},
				fileName: "id_applicationUnderTestWithVariant10_table",
				fileType: "variant",
				layer: "USER",
				namespace: "apps/applicationUnderTestWithVariant/changes/",
				originalLanguage: "EN",
				packageName: "",
				reference: "applicationUnderTestWithVariant.Component",
				selector: {
					persistencyKey: "PKeyApplicationUnderTestWithVariant"
				},
				support: {
					generator: "Change.createInitialFileContent",
					sapui5Version: "1.51.0-SNAPSHOT",
					service: "",
					user: ""
				},
				texts: {
					variantName: {
						type: "XFLD",
						value: "Compatibility09"
					}
				},
				validAppVersions: {
					creation: "",
					from: ""
				}
			}));
			window.localStorage.setItem("sap.ui.fl.id_1611319593465_67_addFavorite", JSON.stringify({"fileName":"id_1611319593465_67_addFavorite","fileType":"change","changeType":"addFavorite","moduleName":"","reference":"applicationUnderTestWithVariant.Component","packageName":"","content":{"key":"id_applicationUnderTestWithVariant10_table","visible":true},"selector":{"persistencyKey":"PKeyApplicationUnderTestWithVariant"},"layer":"USER","texts":{},"namespace":"apps/applicationUnderTestWithVariant/changes/","projectId":"applicationUnderTestWithVariant","creation":"2021-01-22T12:46:33.475Z","originalLanguage":"EN","support":{"generator":"Change.createInitialFileContent","service":"","user":"","sapui5Version":"1.87.0-SNAPSHOT","sourceChangeFileName":"","compositeCommand":"","command":""},"oDataInformation":{},"dependentSelector":{},"jsOnly":false,"variantReference":"","appDescriptorChange":false}));

			window.localStorage.setItem("sap.ui.fl.id_applicationUnderTestWithVariant11_table", JSON.stringify({
				changeType: "table",
				conditions: {},
				content: {
					columns: {
						columnsItems: [
							{
								columnKey: "Price",
								index: 0,
								visible: true
							},
							{
								columnKey: "Bool",
								index: 2,
								visible: true
							},
							{
								columnKey: "Name",
								index: 3,
								visible: false
							},
							{
								columnKey: "ProductId",
								index: 4
							},
							{
								columnKey: "Description",
								index: 5
							},
							{
								columnKey: "SupplierName",
								index: 6
							},
							{
								columnKey: "Quantity",
								index: 7
							},
							{
								columnKey: "UoM",
								index: 8
							},
							{
								columnKey: "WeightMeasure",
								index: 9
							},
							{
								columnKey: "WeightUnit",
								index: 10
							},
							{
								columnKey: "Status",
								index: 11
							},
							{
								columnKey: "CurrencyCode",
								index: 12
							},
							{
								columnKey: "Width",
								index: 13
							},
							{
								columnKey: "Depth",
								index: 14
							},
							{
								columnKey: "Height",
								index: 15
							},
							{
								columnKey: "DimUnit",
								index: 16
							},
							{
								columnKey: "Date",
								index: 17
							},
							{
								columnKey: "Time",
								index: 18
							}
						]
					},
					filter: {
						filterItems: [
							{
								columnKey: "Price",
								operation: "LT",
								exclude: false,
								value1: "100",
								value2: ""
							}
						]
					},
					sort: {
						sortItems: [
							{
								columnKey: "Name",
								operation: "Ascending"
							}
						]
					},
					group: {
						groupItems: [{
							columnKey: "Category",
							operation: "GroupAscending",
							showIfGrouped: true
						}]
					}
				},
				context: "",
				creation: "2017-09-15T07:22:03.112Z",
				dependentSelector: {},
				fileName: "id_applicationUnderTestWithVariant11_table",
				fileType: "variant",
				layer: "USER",
				namespace: "apps/applicationUnderTestWithVariant/changes/",
				originalLanguage: "EN",
				packageName: "",
				reference: "applicationUnderTestWithVariant.Component",
				selector: {
					persistencyKey: "PKeyApplicationUnderTestWithVariant"
				},
				support: {
					generator: "Change.createInitialFileContent",
					sapui5Version: "1.51.0-SNAPSHOT",
					service: "",
					user: ""
				},
				texts: {
					variantName: {
						type: "XFLD",
						value: "Compatibility10"
					}
				},
				validAppVersions: {
					creation: "",
					from: ""
				}
			}));
			window.localStorage.setItem("sap.ui.fl.id_1611319643769_71_addFavorite", JSON.stringify({"fileName":"id_1611319643769_71_addFavorite","fileType":"change","changeType":"addFavorite","moduleName":"","reference":"applicationUnderTestWithVariant.Component","packageName":"","content":{"key":"id_applicationUnderTestWithVariant11_table","visible":true},"selector":{"persistencyKey":"PKeyApplicationUnderTestWithVariant"},"layer":"USER","texts":{},"namespace":"apps/applicationUnderTestWithVariant/changes/","projectId":"applicationUnderTestWithVariant","creation":"2021-01-22T12:47:23.781Z","originalLanguage":"EN","support":{"generator":"Change.createInitialFileContent","service":"","user":"","sapui5Version":"1.87.0-SNAPSHOT","sourceChangeFileName":"","compositeCommand":"","command":""},"oDataInformation":{},"dependentSelector":{},"jsOnly":false,"variantReference":"","appDescriptorChange":false}));

			window.localStorage.setItem("sap.ui.fl.id_applicationUnderTestWithVariant12_table", JSON.stringify({
				changeType: "table",
				conditions: {},
				content: {
					group: {
						groupItems: [{
							columnKey: "Category",
							operation: "GroupAscending",
							showIfGrouped: true
						}, {
							columnKey: "Name",
							operation: "GroupAscending",
							showIfGrouped: true
						}]
					}
				},
				context: "",
				creation: "2017-09-15T07:22:03.112Z",
				dependentSelector: {},
				fileName: "id_applicationUnderTestWithVariant12_table",
				fileType: "variant",
				layer: "USER",
				namespace: "apps/applicationUnderTestWithVariant/changes/",
				originalLanguage: "EN",
				packageName: "",
				reference: "applicationUnderTestWithVariant.Component",
				selector: {
					persistencyKey: "PKeyApplicationUnderTestWithVariant"
				},
				support: {
					generator: "Change.createInitialFileContent",
					sapui5Version: "1.51.0-SNAPSHOT",
					service: "",
					user: ""
				},
				texts: {
					variantName: {
						type: "XFLD",
						value: "Grouped Category and Name"
					}
				},
				validAppVersions: {
					creation: "",
					from: ""
				}
			}));
			window.localStorage.setItem("sap.ui.fl.id_1611319708537_75_addFavorite", JSON.stringify({"fileName":"id_1611319708537_75_addFavorite","fileType":"change","changeType":"addFavorite","moduleName":"","reference":"applicationUnderTestWithVariant.Component","packageName":"","content":{"key":"id_applicationUnderTestWithVariant12_table","visible":true},"selector":{"persistencyKey":"PKeyApplicationUnderTestWithVariant"},"layer":"USER","texts":{},"namespace":"apps/applicationUnderTestWithVariant/changes/","projectId":"applicationUnderTestWithVariant","creation":"2021-01-22T12:48:28.548Z","originalLanguage":"EN","support":{"generator":"Change.createInitialFileContent","service":"","user":"","sapui5Version":"1.87.0-SNAPSHOT","sourceChangeFileName":"","compositeCommand":"","command":""},"oDataInformation":{},"dependentSelector":{},"jsOnly":false,"variantReference":"","appDescriptorChange":false}));

			window.localStorage.setItem("sap.ui.fl.id_applicationUnderTestWithVariant13_table", JSON.stringify({
				changeType: "table",
				conditions: {},
				content: {
					group: {
						groupItems: [{
							columnKey: "Name",
							operation: "GroupAscending",
							showIfGrouped: true
						}, {
							columnKey: "Category",
							operation: "GroupAscending",
							showIfGrouped: true
						}]
					}
				},
				context: "",
				creation: "2017-09-15T07:22:03.112Z",
				dependentSelector: {},
				fileName: "id_applicationUnderTestWithVariant13_table",
				fileType: "variant",
				layer: "USER",
				namespace: "apps/applicationUnderTestWithVariant/changes/",
				originalLanguage: "EN",
				packageName: "",
				reference: "applicationUnderTestWithVariant.Component",
				selector: {
					persistencyKey: "PKeyApplicationUnderTestWithVariant"
				},
				support: {
					generator: "Change.createInitialFileContent",
					sapui5Version: "1.51.0-SNAPSHOT",
					service: "",
					user: ""
				},
				texts: {
					variantName: {
						type: "XFLD",
						value: "Grouped Name and Category"
					}
				},
				validAppVersions: {
					creation: "",
					from: ""
				}
			}));
			window.localStorage.setItem("sap.ui.fl.id_1611319770185_80_addFavorite", JSON.stringify({"fileName":"id_1611319770185_80_addFavorite","fileType":"change","changeType":"addFavorite","moduleName":"","reference":"applicationUnderTestWithVariant.Component","packageName":"","content":{"key":"id_applicationUnderTestWithVariant13_table","visible":true},"selector":{"persistencyKey":"PKeyApplicationUnderTestWithVariant"},"layer":"USER","texts":{},"namespace":"apps/applicationUnderTestWithVariant/changes/","projectId":"applicationUnderTestWithVariant","creation":"2021-01-22T12:49:30.195Z","originalLanguage":"EN","support":{"generator":"Change.createInitialFileContent","service":"","user":"","sapui5Version":"1.87.0-SNAPSHOT","sourceChangeFileName":"","compositeCommand":"","command":""},"oDataInformation":{},"dependentSelector":{},"jsOnly":false,"variantReference":"","appDescriptorChange":false}));

			// call the base component's init function and create the App view
			UIComponent.prototype.init.apply(this, arguments);
		},

		destroy: function() {
			this.oMockServer.stop();
			// call the base component's destroy function
			UIComponent.prototype.destroy.apply(this, arguments);
		}
	});
});
