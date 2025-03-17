sap.ui.define([
	'sap/ui/core/UIComponent',
	'sap/ui/core/util/MockServer',
	"sap/m/CustomListItem",
	"sap/m/Panel",
	"sap/m/Text"
], function(
	UIComponent,
	MockServer,
	CustomListItem,
	Panel,
	Text
) {
	"use strict";

	return UIComponent.extend("applicationUnderTest.Component", {
		metadata: {
			manifest: "json"
		},

		init: function() {
			var aRequests,
				oBatchRequest,
				fnOrginalResponse,
				oEventsLog,
				_that = this;

			this.oMockServer = new MockServer({
				rootUri: "applicationUnderTest/"
			});

			this.oMockServer.simulate("mockserver/metadata.xml", "mockserver/");

			var aRequests = this.oMockServer.getRequests();
			var oBatchRequest = aRequests.find(function(oRequest){return oRequest.method === 'POST' && oRequest.path.source === '\\$batch([?#].*)?';});
			var fnOrginalResponse = oBatchRequest.response;

			oBatchRequest.response = function (oXhr) {
				var fnOrignalXHRRespond = oXhr.respond;
				oXhr.respond = function (status, headers, content) {
					var sURL = this.url;
					oEventsLog = oEventsLog || _that.byId("IDView--events");

					oEventsLog.addItem(
						new CustomListItem({
							content: new Panel({
								headerText: sURL,
								content: new Text({renderWhitespace: true}).setText("URL:\n" + sURL + "\n\nBody:\n" + JSON.stringify(this.requestBody) + "\n\nResponse:\n" + JSON.stringify(content, null, 4)),
								expandable: true
							})
						}).data("request", sURL)
					);

					fnOrignalXHRRespond.apply(this, arguments);
				};
				fnOrginalResponse.apply(this, arguments);
			};

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
