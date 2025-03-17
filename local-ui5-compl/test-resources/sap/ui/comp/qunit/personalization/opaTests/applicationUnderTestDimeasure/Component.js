sap.ui.define([
	'sap/ui/core/UIComponent',
	'sap/ui/core/util/MockServer',
	'sap/chart/library' // In here as chart lib cannot be loaded in manifest due to interference with sinon - workarround
],
	function(
	UIComponent,
	MockServer,
	chartLib // In here as chart lib cannot be loaded in manifest due to interference with sinon - workarround
) {
	"use strict";

	return UIComponent.extend("applicationUnderTestDimeasure.Component", {
		metadata: {
			manifest: "json"
		},

		init: function() {
			var oMockServer = new MockServer({
				rootUri: "applicationUnderTestDimeasure/"
			});
			oMockServer.simulate("mockserver/metadata.xml", "mockserver/");
			oMockServer.start();

			// Save Variant
			window.sessionStorage.setItem("sap.ui.fl.id_applicationUnderTestDimeasure00_table", JSON.stringify({
				changeType: "table",
				conditions: {},
				favorite: true,
				content: {
					dimeasure: {
						chartTypeKey: "pie",
						dimeasureItems: [
							{
								columnKey: "ProductPicUrl",
								visible: true
							}
						]
					}
				},
				context: "",
				creation: "2017-09-15T07:22:03.112Z",
				dependentSelector: {},
				fileName: "id_applicationUnderTestDimeasure00_table",
				fileType: "variant",
				layer: "USER",
				namespace: "apps/applicationUnderTestDimeasure/changes/",
				originalLanguage: "EN",
				packageName: "",
				reference: "applicationUnderTestDimeasure.Component",
				selector: {
					persistencyKey: "PKeyApplicationUnderTestDimeasure"
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
						value: "Contains ignoreFromPersonalisation property"
					}
				},
				validAppVersions: {
					creation: "",
					from: ""
				}
			}));

			// call the base component's init function and create the App view
			UIComponent.prototype.init.apply(this, arguments);
		},

		destroy: function() {
			// call the base component's destroy function
			UIComponent.prototype.destroy.apply(this, arguments);
		}
	});
});
