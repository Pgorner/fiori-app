sap.ui.define([
	'sap/ui/core/UIComponent',
	'sap/ui/core/util/MockServer',
	'sap/chart/library' // In here as chart lib cannot be loaded in manifest due to interference with sinon - workarround
], function(
	UIComponent,
	MockServer,
	chartLib // In here as chart lib cannot be loaded in manifest due to interference with sinon - workarround
) {
	"use strict";

	return UIComponent.extend("applicationUnderTestPerf.Component", {
		metadata: {
			manifest: "json"
		},

		init: function() {
			this.oMockServer = new MockServer({
				rootUri: "applicationUnderTestPerf/"
			});
			this.oMockServer.simulate("mockserver/metadata.xml", "mockserver/");
			this.oMockServer.start();

			// Save Filter Variant
			window.localStorage.setItem("sap.ui.fl.id_applicationUnderTestPerf00_table", JSON.stringify({
				changeType: "table",
				conditions: {},
				content: {
					filter: {
						filterItems: [
							{
								columnKey: "Name",
								exclude: false,
								operation: "Contains",
								value1: "Gladiator MX",
								value2: ""
							}
						]
					}
				},
				context: "",
				creation: "2018-01-27T22:10:29.555Z",
				dependentSelector: {},
				fileName: "id_applicationUnderTestPerf00_table",
				fileType: "variant",
				layer: "USER",
				namespace: "apps/applicationUnderTestPerf/changes/",
				originalLanguage: "EN",
				packageName: "",
				reference: "applicationUnderTestPerf.Component",
				selector: {
					persistencyKey: "PKeyApplicationUnderTestPerf"
				},
				support: {
					generator: "Change.createInitialFileContent",
					sapui5Version: "1.53.0-SNAPSHOT",
					service: "",
					user: ""
				},
				texts: {
					variantName: {
						type: "XFLD",
						value: "Filtered By Name 'Gladiator MX'"
					}
				},
				validAppVersions: {
					creation: "",
					from: ""
				}
			}));
			window.localStorage.setItem("sap.ui.fl.id_1611316605948_27_addFavorite", JSON.stringify({"fileName":"id_1611316605948_27_addFavorite","fileType":"change","changeType":"addFavorite","moduleName":"","reference":"applicationUnderTestPerf.Component","packageName":"","content":{"key":"id_applicationUnderTestPerf00_table","visible":true},"selector":{"persistencyKey":"PKeyApplicationUnderTestPerf"},"layer":"USER","texts":{},"namespace":"apps/applicationUnderTestPerf/changes/","projectId":"applicationUnderTestPerf","creation":"2021-01-22T11:56:45.950Z","originalLanguage":"EN","support":{"generator":"Change.createInitialFileContent","service":"","user":"","sapui5Version":"1.87.0-SNAPSHOT","sourceChangeFileName":"","compositeCommand":"","command":""},"oDataInformation":{},"dependentSelector":{},"jsOnly":false,"variantReference":"","appDescriptorChange":false}));

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
