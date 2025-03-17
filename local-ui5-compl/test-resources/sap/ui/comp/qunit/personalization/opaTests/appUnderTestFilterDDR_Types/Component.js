sap.ui.define([
	'sap/ui/core/UIComponent',
	'sap/ui/core/util/MockServer'

], function(
	UIComponent,
	MockServer
) {
	"use strict";

	return UIComponent.extend("appUnderTestFilterDDR_Types.Component", {
		metadata: {
			manifest: "json"
		},

		init: function() {
			this.oMockServer = new MockServer({
				rootUri: "appUnderTestFilterDDR_Types/"
			});
			this.oMockServer.simulate("mockserver/metadata.xml", "mockserver/");
			this.oMockServer.start();

			// call the base component's init function and create the App view
			UIComponent.prototype.init.apply(this, arguments);
		},

		destroy: function() {
			this.oMockServer.stop();
			this.oMockServer.destroy();
			// call the base component's destroy function
			UIComponent.prototype.destroy.apply(this, arguments);
		}
	});
});
