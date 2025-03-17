sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/actions/Press"
], function (Opa5, Press) {
	"use strict";

	Opa5.createPageObjects({
		onTheShowLinkDialog: {
			actions: {
				iPressTheCloseButton: function() {
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: function(oControl) {
							return oControl.getText() === "Close" && oControl.getParent().getTitle() === "Configuration Link";
						},
						actions: new Press(),
						errorMessage: "did not find the close button"
					});
				}
			},
			assertions: {
				iShouldSeeTheBookmarkLink: function() {
					return this.waitFor({
						controlType: "sap.m.TextArea",
						matchers: function(oControl) {
							return oControl.getParent().getTitle() === "Configuration Link";
						},
						success: function(aLinks) {
							//var oLink = aLinks[0];
							//Opa5.assert.ok(oLink.getValue().startsWith("https://") || oLink.getValue().startsWith("http://"), "a link is displayed");
							//Opa5.assert.ok(oLink.getValue().includes("bookmark=true"), "displayed link is a bookmark link");
						},
						errorMessage: "did not find the bookmark link textarea"
					})
				}
			}
		}
	});

});
