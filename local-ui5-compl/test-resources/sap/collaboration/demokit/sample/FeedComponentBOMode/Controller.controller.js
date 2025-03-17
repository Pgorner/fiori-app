sap.ui.define([
	"sap/ui/core/Component",
	"sap/ui/core/mvc/Controller",
	"./mockserver/MockServerInitializer",
	"sap/collaboration/library",
	"require"
], function(Component, Controller, MockServerInitializer, collaborationLibrary, require) {
	"use strict";

	// shortcut for sap.collaboration.FeedType
	var FeedType = collaborationLibrary.FeedType;

	return Controller.extend("sap.collaboration.sample.FeedComponentBOMode.Controller", {

		_oFeedComponent: null,

		/**
		 * This method is call as many times as subclasses are initialized. It's
		 * important to initialize static methods only once.
		 */
		onInit: function() {
			var oMockServerInitializer = new MockServerInitializer(require.toUrl("./mockserver/"));
			oMockServerInitializer.initializeMockServers(["jam", "smi"]);

			// Set group feed settings for Business Object mode
			var oSettings = {
				feedSources : {
					mode: FeedType.BusinessObjectGroups,
					data: {
						appContext: "UDBO",
						odataServicePath: "/sap/opu/odata/sap/ZMCN_TEST_SERVICE_1_SRV/",
						collection: "TestSet",
						key: "'BO-FOR-SMI-TESTING'",
						name: "BO-FOR-SMI-TESTING"
					}
				}
			};

			// Create group feed component
			this.getOwnerComponent().createComponent({
				usage: "feedComponent",
				id:"feed_component_bo",
				settings: oSettings
			}).then(function(oFeedComponent) {

				this._oFeedComponent = oFeedComponent;
				oMockServerInitializer.initializeMockData(this._oFeedComponent);

				// Add group feed component to container
				this.getView()._FeedComponentContainer.setComponent(this._oFeedComponent);
				this.getView()._FeedComponentContainer.setHeight("800px");
			}.bind(this));
		}
	});
});
