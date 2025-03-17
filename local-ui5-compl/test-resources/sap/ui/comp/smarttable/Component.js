sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/core/util/MockServer",
	"sap/ui/model/odata/v2/ODataModel"
], function (
	UIComponent,
	MockServer,
	ODataModel
) {
	"use strict";

	return UIComponent.extend("test.sap.ui.comp.smarttable.Component", {
		metadata: {
			manifest: "json"
		},

		init: function() {
			UIComponent.prototype.init.apply(this, arguments);

			this.oMockServer = new MockServer({
				rootUri: "odata/"
			});

			this.oMockServer.simulate("../smartfield/FieldControl/mockserver/metadata.xml", "../smartfield/FieldControl/mockserver/");
			this.oMockServer.start();
			this.oModel = new ODataModel("odata", true);
			this.setModel(this.oModel);
		},
		exit: function() {
			if (this.oMockServer) {
				this.oMockServer.stop();
			}

			if (this.oModel) {
				this.oModel.destroy();
			}

			this.oMockServer = null;
			this.oModel = null;
		}
	});
});
