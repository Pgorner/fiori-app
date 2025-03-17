sap.ui.define([
	'sap/ui/core/UIComponent',
	'sap/ui/core/util/MockServer'
], function(
	UIComponent,
	MockServer
) {
	"use strict";

	return UIComponent.extend("appUnderTestResponsiveTableWithVariant.Component", {
		metadata: {
			manifest: "json"
		},

		init: function() {
			var oMockServer = new MockServer({
				rootUri: "appUnderTestResponsiveTableWithVariant/"
			});
			oMockServer.simulate("mockserver/metadata.xml", "mockserver/");
			oMockServer.start();

			// Save Sort Variant
			window.localStorage.setItem("sap.ui.fl.id_appUnderTestResponsiveTableWithVariant03_table", JSON.stringify({
				changeType: "table",
				conditions: {},
				content: {
					columns: {
						columnsItems: [
							{
								columnKey: "Category",
								index: 0
							}, {
								columnKey: "Name",
								index: 1
							}
						]
					}
				},
				context: "",
				creation: "2017-09-15T07:22:03.112Z",
				dependentSelector: {},
				fileName: "id_appUnderTestResponsiveTableWithVariant03_table",
				fileType: "variant",
				layer: "USER",
				namespace: "apps/appUnderTestResponsiveTableWithVariant/changes/",
				originalLanguage: "EN",
				packageName: "",
				reference: "appUnderTestResponsiveTableWithVariant.Component",
				selector: {
					persistencyKey: "PKeyAppUnderTestResponsiveTableWithVariant"
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
			window.localStorage.setItem("sap.ui.fl.id_1611314326390_25_addFavorite", JSON.stringify({"fileName":"id_1611314326390_25_addFavorite","fileType":"change","changeType":"addFavorite","moduleName":"","reference":"appUnderTestResponsiveTableWithVariant.Component","packageName":"","content":{"key":"id_appUnderTestResponsiveTableWithVariant03_table","visible":true},"selector":{"persistencyKey":"PKeyAppUnderTestResponsiveTableWithVariant"},"layer":"USER","texts":{},"namespace":"apps/appUnderTestResponsiveTableWithVariant/changes/","projectId":"appUnderTestResponsiveTableWithVariant","creation":"2021-01-22T11:18:46.401Z","originalLanguage":"EN","support":{"generator":"Change.createInitialFileContent","service":"","user":"","sapui5Version":"1.87.0-SNAPSHOT","sourceChangeFileName":"","compositeCommand":"","command":""},"oDataInformation":{},"dependentSelector":{},"jsOnly":false,"variantReference":"","appDescriptorChange":false}));


			window.localStorage.setItem("sap.ui.fl.id_appUnderTestResponsiveTableWithVariant04_table", JSON.stringify({
				changeType: "table",
				conditions: {},
				content: {
					columns: {
						columnsItems: [
							{
								columnKey: "Category",
								index: 0
							}, {
								columnKey: "Name",
								index: 1,
								visible: false
							}
						]
					}
				},
				context: "",
				creation: "2017-09-15T07:22:03.112Z",
				dependentSelector: {},
				fileName: "id_appUnderTestResponsiveTableWithVariant04_table",
				fileType: "variant",
				layer: "USER",
				namespace: "apps/appUnderTestResponsiveTableWithVariant/changes/",
				originalLanguage: "EN",
				packageName: "",
				reference: "appUnderTestResponsiveTableWithVariant.Component",
				selector: {
					persistencyKey: "PKeyAppUnderTestResponsiveTableWithVariant"
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
			window.localStorage.setItem("sap.ui.fl.id_1611314469350_27_addFavorite", JSON.stringify({"fileName":"id_1611314469350_27_addFavorite","fileType":"change","changeType":"addFavorite","moduleName":"","reference":"appUnderTestResponsiveTableWithVariant.Component","packageName":"","content":{"key":"id_appUnderTestResponsiveTableWithVariant04_table","visible":true},"selector":{"persistencyKey":"PKeyAppUnderTestResponsiveTableWithVariant"},"layer":"USER","texts":{},"namespace":"apps/appUnderTestResponsiveTableWithVariant/changes/","projectId":"appUnderTestResponsiveTableWithVariant","creation":"2021-01-22T11:21:09.363Z","originalLanguage":"EN","support":{"generator":"Change.createInitialFileContent","service":"","user":"","sapui5Version":"1.87.0-SNAPSHOT","sourceChangeFileName":"","compositeCommand":"","command":""},"oDataInformation":{},"dependentSelector":{},"jsOnly":false,"variantReference":"","appDescriptorChange":false}));

			window.localStorage.setItem("sap.ui.fl.id_appUnderTestResponsiveTableWithVariant05_table", JSON.stringify({
				changeType: "table",
				conditions: {},
				content: {
					columns: {
						columnsItems: [
							{
								columnKey: "Bool",
								index: 2,
								visible: true
							}, {
								columnKey: "ProductId",
								index: 3
							}, {
								columnKey: "Description",
								index: 4
							}, {
								columnKey: "SupplierName",
								index: 5
							}, {
								columnKey: "Quantity",
								index: 6
							}, {
								columnKey: "UoM",
								index: 7
							}, {
								columnKey: "WeightMeasure",
								index: 8
							}, {
								columnKey: "WeightUnit",
								index: 9
							}, {
								columnKey: "Price",
								index: 10
							}, {
								columnKey: "Status",
								index: 11
							}, {
								columnKey: "CurrencyCode",
								index: 12
							}, {
								columnKey: "Width",
								index: 13
							}, {
								columnKey: "Depth",
								index: 14
							}, {
								columnKey: "Height",
								index: 15
							}, {
								columnKey: "DimUnit",
								index: 16
							}, {
								columnKey: "Date",
								index: 17
							}, {
								columnKey: "Time",
								index: 18
							}
						]
					}
				},
				context: "",
				creation: "2017-09-15T07:22:03.112Z",
				dependentSelector: {},
				fileName: "id_appUnderTestResponsiveTableWithVariant05_table",
				fileType: "variant",
				layer: "USER",
				namespace: "apps/appUnderTestResponsiveTableWithVariant/changes/",
				originalLanguage: "EN",
				packageName: "",
				reference: "appUnderTestResponsiveTableWithVariant.Component",
				selector: {
					persistencyKey: "PKeyAppUnderTestResponsiveTableWithVariant"
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
			window.localStorage.setItem("sap.ui.fl.id_1611314782741_26_addFavorite", JSON.stringify({"fileName":"id_1611314782741_26_addFavorite","fileType":"change","changeType":"addFavorite","moduleName":"","reference":"appUnderTestResponsiveTableWithVariant.Component","packageName":"","content":{"key":"id_appUnderTestResponsiveTableWithVariant05_table","visible":true},"selector":{"persistencyKey":"PKeyAppUnderTestResponsiveTableWithVariant"},"layer":"USER","texts":{},"namespace":"apps/appUnderTestResponsiveTableWithVariant/changes/","projectId":"appUnderTestResponsiveTableWithVariant","creation":"2021-01-22T11:26:22.751Z","originalLanguage":"EN","support":{"generator":"Change.createInitialFileContent","service":"","user":"","sapui5Version":"1.87.0-SNAPSHOT","sourceChangeFileName":"","compositeCommand":"","command":""},"oDataInformation":{},"dependentSelector":{},"jsOnly":false,"variantReference":"","appDescriptorChange":false}));

			window.localStorage.setItem("sap.ui.fl.id_appUnderTestResponsiveTableWithVariant06_table", JSON.stringify({
				changeType: "table",
				conditions: {},
				content: {
					columns: {
						columnsItems: [
							{
								columnKey: "Bool",
								index: 0,
								visible: true
							}, {
								columnKey: "Name",
								index: 1
							}, {
								columnKey: "Category",
								index: 2
							}, {
								columnKey: "ProductId",
								index: 3
							}, {
								columnKey: "Description",
								index: 4
							}, {
								columnKey: "SupplierName",
								index: 5
							}, {
								columnKey: "Quantity",
								index: 6
							}, {
								columnKey: "UoM",
								index: 7
							}, {
								columnKey: "WeightMeasure",
								index: 8
							}, {
								columnKey: "WeightUnit",
								index: 9
							}, {
								columnKey: "Price",
								index: 10
							}, {
								columnKey: "Status",
								index: 11
							}, {
								columnKey: "CurrencyCode",
								index: 12
							}, {
								columnKey: "Width",
								index: 13
							}, {
								columnKey: "Depth",
								index: 14
							}, {
								columnKey: "Height",
								index: 15
							}, {
								columnKey: "DimUnit",
								index: 16
							}, {
								columnKey: "Date",
								index: 17
							}, {
								columnKey: "Time",
								index: 18
							}
						]
					}
				},
				context: "",
				creation: "2017-09-15T07:22:03.112Z",
				dependentSelector: {},
				fileName: "id_appUnderTestResponsiveTableWithVariant06_table",
				fileType: "variant",
				layer: "USER",
				namespace: "apps/appUnderTestResponsiveTableWithVariant/changes/",
				originalLanguage: "EN",
				packageName: "",
				reference: "appUnderTestResponsiveTableWithVariant.Component",
				selector: {
					persistencyKey: "PKeyAppUnderTestResponsiveTableWithVariant"
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
			window.localStorage.setItem("sap.ui.fl.id_1611315099140_25_addFavorite", JSON.stringify({"fileName":"id_1611315099140_25_addFavorite","fileType":"change","changeType":"addFavorite","moduleName":"","reference":"appUnderTestResponsiveTableWithVariant.Component","packageName":"","content":{"key":"id_appUnderTestResponsiveTableWithVariant06_table","visible":true},"selector":{"persistencyKey":"PKeyAppUnderTestResponsiveTableWithVariant"},"layer":"USER","texts":{},"namespace":"apps/appUnderTestResponsiveTableWithVariant/changes/","projectId":"appUnderTestResponsiveTableWithVariant","creation":"2021-01-22T11:31:39.150Z","originalLanguage":"EN","support":{"generator":"Change.createInitialFileContent","service":"","user":"","sapui5Version":"1.87.0-SNAPSHOT","sourceChangeFileName":"","compositeCommand":"","command":""},"oDataInformation":{},"dependentSelector":{},"jsOnly":false,"variantReference":"","appDescriptorChange":false}));

			window.localStorage.setItem("sap.ui.fl.id_appUnderTestResponsiveTableWithVariant07_table", JSON.stringify({
				changeType: "table",
				conditions: {},
				content: {
					columns: {
						columnsItems: [
							{
								columnKey: "Price",
								index: 2,
								visible: true
							}, {
								columnKey: "ProductId",
								index: 3
							}, {
								columnKey: "Description",
								index: 4
							}, {
								columnKey: "SupplierName",
								index: 5
							}, {
								columnKey: "Quantity",
								index: 6
							}, {
								columnKey: "UoM",
								index: 7
							}, {
								columnKey: "WeightMeasure",
								index: 8
							}, {
								columnKey: "WeightUnit",
								index: 9
							}
						]
					}
				},
				context: "",
				creation: "2017-09-15T07:22:03.112Z",
				dependentSelector: {},
				fileName: "id_appUnderTestResponsiveTableWithVariant07_table",
				fileType: "variant",
				layer: "USER",
				namespace: "apps/appUnderTestResponsiveTableWithVariant/changes/",
				originalLanguage: "EN",
				packageName: "",
				reference: "appUnderTestResponsiveTableWithVariant.Component",
				selector: {
					persistencyKey: "PKeyAppUnderTestResponsiveTableWithVariant"
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
			window.localStorage.setItem("sap.ui.fl.id_1611315201283_29_addFavorite", JSON.stringify({"fileName":"id_1611315201283_29_addFavorite","fileType":"change","changeType":"addFavorite","moduleName":"","reference":"appUnderTestResponsiveTableWithVariant.Component","packageName":"","content":{"key":"id_appUnderTestResponsiveTableWithVariant07_table","visible":true},"selector":{"persistencyKey":"PKeyAppUnderTestResponsiveTableWithVariant"},"layer":"USER","texts":{},"namespace":"apps/appUnderTestResponsiveTableWithVariant/changes/","projectId":"appUnderTestResponsiveTableWithVariant","creation":"2021-01-22T11:33:21.292Z","originalLanguage":"EN","support":{"generator":"Change.createInitialFileContent","service":"","user":"","sapui5Version":"1.87.0-SNAPSHOT","sourceChangeFileName":"","compositeCommand":"","command":""},"oDataInformation":{},"dependentSelector":{},"jsOnly":false,"variantReference":"","appDescriptorChange":false}));


			window.localStorage.setItem("sap.ui.fl.id_appUnderTestResponsiveTableWithVariant08_table", JSON.stringify({
				changeType: "table",
				conditions: {},
				content: {
					columns: {
						columnsItems: [
							{
								columnKey: "Price",
								index: 2,
								visible: true
							}, {
								columnKey: "ProductId",
								index: 3
							}, {
								columnKey: "Description",
								index: 4
							}, {
								columnKey: "SupplierName",
								index: 5
							}, {
								columnKey: "Quantity",
								index: 6
							}, {
								columnKey: "UoM",
								index: 7
							}, {
								columnKey: "WeightMeasure",
								index: 8
							}, {
								columnKey: "WeightUnit",
								index: 9
							}
						]
					}
				},
				context: "",
				creation: "2017-09-15T07:22:03.112Z",
				dependentSelector: {},
				fileName: "id_appUnderTestResponsiveTableWithVariant08_table",
				fileType: "variant",
				layer: "USER",
				namespace: "apps/appUnderTestResponsiveTableWithVariant/changes/",
				originalLanguage: "EN",
				packageName: "",
				reference: "appUnderTestResponsiveTableWithVariant.Component",
				selector: {
					persistencyKey: "PKeyAppUnderTestResponsiveTableWithVariant"
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
			window.localStorage.setItem("sap.ui.fl.id_1611318596336_33_addFavorite", JSON.stringify({"fileName":"id_1611318596336_33_addFavorite","fileType":"change","changeType":"addFavorite","moduleName":"","reference":"appUnderTestResponsiveTableWithVariant.Component","packageName":"","content":{"key":"id_appUnderTestResponsiveTableWithVariant08_table","visible":true},"selector":{"persistencyKey":"PKeyAppUnderTestResponsiveTableWithVariant"},"layer":"USER","texts":{},"namespace":"apps/appUnderTestResponsiveTableWithVariant/changes/","projectId":"appUnderTestResponsiveTableWithVariant","creation":"2021-01-22T12:29:56.348Z","originalLanguage":"EN","support":{"generator":"Change.createInitialFileContent","service":"","user":"","sapui5Version":"1.87.0-SNAPSHOT","sourceChangeFileName":"","compositeCommand":"","command":""},"oDataInformation":{},"dependentSelector":{},"jsOnly":false,"variantReference":"","appDescriptorChange":false}));

			window.localStorage.setItem("sap.ui.fl.id_appUnderTestResponsiveTableWithVariant09_table", JSON.stringify({
				changeType: "table",
				conditions: {},
				content: {
					columns: {
						columnsItems: [
							{
								columnKey: "Price",
								index: 0,
								visible: true
							}, {
								columnKey: "Name",
								index: 1
							}, {
								columnKey: "Category",
								index: 2
							}, {
								columnKey: "ProductId",
								index: 3
							}, {
								columnKey: "Description",
								index: 4
							}, {
								columnKey: "SupplierName",
								index: 5
							}, {
								columnKey: "Quantity",
								index: 6
							}, {
								columnKey: "UoM",
								index: 7
							}, {
								columnKey: "WeightMeasure",
								index: 8
							}, {
								columnKey: "WeightUnit",
								index: 9
							}
						]
					}
				},
				context: "",
				creation: "2017-09-15T07:22:03.112Z",
				dependentSelector: {},
				fileName: "id_appUnderTestResponsiveTableWithVariant09_table",
				fileType: "variant",
				layer: "USER",
				namespace: "apps/appUnderTestResponsiveTableWithVariant/changes/",
				originalLanguage: "EN",
				packageName: "",
				reference: "appUnderTestResponsiveTableWithVariant.Component",
				selector: {
					persistencyKey: "PKeyAppUnderTestResponsiveTableWithVariant"
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
			window.localStorage.setItem("sap.ui.fl.id_1611318651823_37_addFavorite", JSON.stringify({"fileName":"id_1611318651823_37_addFavorite","fileType":"change","changeType":"addFavorite","moduleName":"","reference":"appUnderTestResponsiveTableWithVariant.Component","packageName":"","content":{"key":"id_appUnderTestResponsiveTableWithVariant09_table","visible":true},"selector":{"persistencyKey":"PKeyAppUnderTestResponsiveTableWithVariant"},"layer":"USER","texts":{},"namespace":"apps/appUnderTestResponsiveTableWithVariant/changes/","projectId":"appUnderTestResponsiveTableWithVariant","creation":"2021-01-22T12:30:51.834Z","originalLanguage":"EN","support":{"generator":"Change.createInitialFileContent","service":"","user":"","sapui5Version":"1.87.0-SNAPSHOT","sourceChangeFileName":"","compositeCommand":"","command":""},"oDataInformation":{},"dependentSelector":{},"jsOnly":false,"variantReference":"","appDescriptorChange":false}));

			window.localStorage.setItem("sap.ui.fl.id_appUnderTestResponsiveTableWithVariant10_table", JSON.stringify({
				changeType: "table",
				conditions: {},
				content: {
					columns: {
						columnsItems: [
							{
								columnKey: "Price",
								index: 2,
								visible: true
							}, {
								columnKey: "ProductId",
								index: 3
							}, {
								columnKey: "Description",
								index: 4
							}, {
								columnKey: "SupplierName",
								index: 5
							}, {
								columnKey: "Quantity",
								index: 6
							}, {
								columnKey: "UoM",
								index: 7
							}, {
								columnKey: "WeightMeasure",
								index: 8
							}, {
								columnKey: "WeightUnit",
								index: 9
							}
						]
					}
				},
				context: "",
				creation: "2017-09-15T07:22:03.112Z",
				dependentSelector: {},
				fileName: "id_appUnderTestResponsiveTableWithVariant10_table",
				fileType: "variant",
				layer: "USER",
				namespace: "apps/appUnderTestResponsiveTableWithVariant/changes/",
				originalLanguage: "EN",
				packageName: "",
				reference: "appUnderTestResponsiveTableWithVariant.Component",
				selector: {
					persistencyKey: "PKeyAppUnderTestResponsiveTableWithVariant"
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
			window.localStorage.setItem("sap.ui.fl.id_1611315277519_33_addFavorite", JSON.stringify({"fileName":"id_1611315798814_42_addFavorite","fileType":"change","changeType":"addFavorite","moduleName":"","reference":"appUnderTestResponsiveTableWithVariant.Component","packageName":"","content":{"key":"id_appUnderTestResponsiveTableWithVariant10_table","visible":true},"selector":{"persistencyKey":"PKeyAppUnderTestResponsiveTableWithVariant"},"layer":"USER","texts":{},"namespace":"apps/appUnderTestResponsiveTableWithVariant/changes/","projectId":"appUnderTestResponsiveTableWithVariant","creation":"2021-01-22T11:43:18.823Z","originalLanguage":"EN","support":{"generator":"Change.createInitialFileContent","service":"","user":"","sapui5Version":"1.87.0-SNAPSHOT","sourceChangeFileName":"","compositeCommand":"","command":""},"oDataInformation":{},"dependentSelector":{},"jsOnly":false,"variantReference":"","appDescriptorChange":false}));

			window.localStorage.setItem("sap.ui.fl.id_appUnderTestResponsiveTableWithVariant11_table", JSON.stringify({
				changeType: "table",
				conditions: {},
				content: {
					columns: {
						columnsItems: [
							{
								columnKey: "Price",
								index: 0,
								visible: true
							}, {
								columnKey: "Bool",
								index: 2,
								visible: true
							}, {
								columnKey: "Name",
								index: 3,
								visible: false
							}, {
								columnKey: "ProductId",
								index: 4
							}, {
								columnKey: "Description",
								index: 5
							}, {
								columnKey: "SupplierName",
								index: 6
							}, {
								columnKey: "Quantity",
								index: 7
							}, {
								columnKey: "UoM",
								index: 8
							}, {
								columnKey: "WeightMeasure",
								index: 9
							}, {
								columnKey: "WeightUnit",
								index: 10
							}, {
								columnKey: "Status",
								index: 11
							}, {
								columnKey: "CurrencyCode",
								index: 12
							}, {
								columnKey: "Width",
								index: 13
							}, {
								columnKey: "Depth",
								index: 14
							}, {
								columnKey: "Height",
								index: 15
							}, {
								columnKey: "DimUnit",
								index: 16
							}, {
								columnKey: "Date",
								index: 17
							}, {
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
						groupItems: [
							{
								columnKey: "Category",
								operation: "GroupAscending",
								showIfGrouped: true
							}
						]
					}
				},
				context: "",
				creation: "2017-09-15T07:22:03.112Z",
				dependentSelector: {},
				fileName: "id_appUnderTestResponsiveTableWithVariant11_table",
				fileType: "variant",
				layer: "USER",
				namespace: "apps/appUnderTestResponsiveTableWithVariant/changes/",
				originalLanguage: "EN",
				packageName: "",
				reference: "appUnderTestResponsiveTableWithVariant.Component",
				selector: {
					persistencyKey: "PKeyAppUnderTestResponsiveTableWithVariant"
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
			window.localStorage.setItem("sap.ui.fl.id_1611315856904_46_addFavorite", JSON.stringify({"fileName":"id_1611315856904_46_addFavorite","fileType":"change","changeType":"addFavorite","moduleName":"","reference":"appUnderTestResponsiveTableWithVariant.Component","packageName":"","content":{"key":"id_appUnderTestResponsiveTableWithVariant11_table","visible":true},"selector":{"persistencyKey":"PKeyAppUnderTestResponsiveTableWithVariant"},"layer":"USER","texts":{},"namespace":"apps/appUnderTestResponsiveTableWithVariant/changes/","projectId":"appUnderTestResponsiveTableWithVariant","creation":"2021-01-22T11:44:16.913Z","originalLanguage":"EN","support":{"generator":"Change.createInitialFileContent","service":"","user":"","sapui5Version":"1.87.0-SNAPSHOT","sourceChangeFileName":"","compositeCommand":"","command":""},"oDataInformation":{},"dependentSelector":{},"jsOnly":false,"variantReference":"","appDescriptorChange":false}));

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
