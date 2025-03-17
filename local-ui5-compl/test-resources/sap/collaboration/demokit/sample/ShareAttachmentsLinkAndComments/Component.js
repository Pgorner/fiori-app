sap.ui.define([
	"sap/ui/core/UIComponent",
], function(UIComponent) {
	"use strict";

	return UIComponent.extend("sap.collaboration.sample.ShareAttachmentsLinkAndComments.Component", {
		metadata: {
			manifest: "json",
			interfaces: ["sap.ui.core.IAsyncContentCreation"]
		}
	});
});
