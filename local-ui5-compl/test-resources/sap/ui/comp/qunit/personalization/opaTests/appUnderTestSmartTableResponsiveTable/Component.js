sap.ui.define([
	'sap/ui/core/UIComponent',
	'sap/ui/core/util/MockServer',
	"sap/ui/model/odata/v2/ODataModel"
], function(
	UIComponent,
	MockServer,
	ODataModel
) {
	"use strict";

	return UIComponent.extend("appUnderTestSmartTableResponsiveTable.Component", {
		metadata: {
			manifest: "json"
		},

		init: function() {

			var oMockServer = new MockServer({
				rootUri: "mockserver/"
			});
			oMockServer.simulate("mockserver/metadata.xml", "mockserver/");
			oMockServer.start();
			UIComponent.prototype.init.apply(this, arguments);

			// call the base component's init function and create the App view
			this.oModel = new ODataModel("mockserver", true);
			this.setModel(this.oModel);
		},

		destroy: function() {
			this.oMockServer.stop();
			UIComponent.prototype.destroy.apply(this, arguments);
		}
	});
});
