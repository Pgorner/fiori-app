sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/actions/Press",
	"sap/ui/test/actions/EnterText"
], function (Opa5, Press, EnterText) {
	"use strict";

	var sViewName = "sap.apf.cloudFoundry.ui.sharedialog.view.ShareDialog";

	Opa5.createPageObjects({
		onTheShareDialog: {
			actions: {
				iPressTheCloseButton: function() {
					return this.waitFor({
						id: "buttonClose",
						viewName: sViewName,
						actions: new Press(),
						errorMessage: "did not find the close button"
					});
				},
				iChangeTheHeader: function() {
					return this.waitFor({
						id: "inputHeader",
						viewName: sViewName,
						actions: new EnterText({
							text: "my-header"
						}),
						errorMessage: "did not find the header input"
					});
				},
				iClearTheHeader: function() {
					return this.waitFor({
						id: "inputHeader",
						viewName: sViewName,
						actions: new EnterText({
							text: ""
						}),
						errorMessage: "did not find the header input"
					});
				},
				iChangeTheSubheader: function() {
					return this.waitFor({
						id: "inputSubheader",
						viewName: sViewName,
						actions: new EnterText({
							text: "my-subheader"
						}),
						errorMessage: "did not find the subheader input"
					});
				},
				iClearTheSubheader: function() {
					return this.waitFor({
						id: "inputSubheader",
						viewName: sViewName,
						actions: new EnterText({
							text: ""
						}),
						errorMessage: "did not find the subheader input"
					});
				},
				iChangeTheIcon: function() {
					return this.waitFor({
						id: "inputIcon",
						viewName: sViewName,
						actions: new EnterText({
							text: "sap-icon://add"
						}),
						errorMessage: "did not find the icon input"
					});
				},
				iClearTheIcon: function() {
					return this.waitFor({
						id: "inputIcon",
						viewName: sViewName,
						actions: new EnterText({
							text: ""
						}),
						errorMessage: "did not find the icon input"
					});
				},
				iChangeTheGroup: function() {
					return this.waitFor({
						id: "inputGroup",
						viewName: sViewName,
						actions: new EnterText({
							text: "my-group"
						}),
						errorMessage: "did not find the group input"
					});
				},
				iPressTheLinkButton: function() {
					return this.waitFor({
						id: "buttonLink",
						viewName: sViewName,
						actions: new Press(),
						errorMessage: "did not find the 'show link' button"
					});
				},
				iPressTheEmailButton: function() {
					return this.waitFor({
						id: "buttonEmail",
						viewName: sViewName,
						actions: new Press(),
						errorMessage: "did not find the email button"
					});
				},
				iPressTheTileButton: function() {
					return this.waitFor({
						id: "buttonFavorite",
						viewName: sViewName,
						actions: new Press(),
						errorMessage: "did not find the tile button"
					});
				}
			},
			assertions: {
				iShouldSeeTheTitlePlaceholder: function() {
					return this.waitFor({
						id: "inputHeader",
						viewName: sViewName,
						success: function(oHeader) {
							Opa5.assert.strictEqual(oHeader.getPlaceholder(), "SCP End to End", "title placeholder is configuration name");
						},
						errorMessage: "did not find the header input"
					});
				},
				iShouldSeeTheSubtitlePlaceholder: function() {
					return this.waitFor({
						id: "inputSubheader",
						viewName: sViewName,
						success: function(oSubheader) {
							Opa5.assert.strictEqual(oSubheader.getPlaceholder(), "APF Runtime", "subtitle placeholder is 'APF Runtime'");
						},
						errorMessage: "did not find the subheader input"
					});
				},
				iShouldSeeTheDefaultTileHeader: function() {
					return this.waitFor({
						id: "tilePreview",
						viewName: sViewName,
						success: function(oTile) {
							Opa5.assert.strictEqual(oTile.getHeader(), "SCP End to End", "default tile header is configuration name");
						},
						errorMessage: "did not find the tile preview"
					});
				},
				iShouldSeeTheDefaultTileSubheader: function() {
					return this.waitFor({
						id: "tilePreview",
						viewName: sViewName,
						success: function(oTile) {
							Opa5.assert.strictEqual(oTile.getSubheader(), "APF Runtime", "default tile subheader is 'APF Runtime'");
						},
						errorMessage: "did not find the tile preview"
					});
				},
				iShouldSeeTheEmptyTileIcon: function() {
					return this.waitFor({
						id: "tilePreview",
						viewName: sViewName,
						success: function(oTile) {
							var icon;
							var aContent = oTile.getTileContent();
							aContent.forEach(function(content) {
								var actualContent = content.getContent();
								if (actualContent && actualContent.getSrc && typeof actualContent.getSrc === 'function') {
									icon = actualContent.getSrc();
								}
							});
							Opa5.assert.strictEqual(icon, "", "tile icon is empty");
						},
						errorMessage: "did not find the tile preview"
					});
				},
				iShouldSeeTheChangedTileHeader: function() {
					return this.waitFor({
						id: "tilePreview",
						viewName: sViewName,
						success: function(oTile) {
							Opa5.assert.strictEqual(oTile.getHeader(), "my-header", "tile header changed");
						},
						errorMessage: "did not find the tile preview"
					});
				},
				iShouldSeeTheChangedTileSubheader: function() {
					return this.waitFor({
						id: "tilePreview",
						viewName: sViewName,
						success: function(oTile) {
							Opa5.assert.strictEqual(oTile.getSubheader(), "my-subheader", "tile subheader changed");
						},
						errorMessage: "did not find the tile preview"
					});
				},
				iShouldSeeTheChangedTileIcon: function() {
					return this.waitFor({
						id: "tilePreview",
						viewName: sViewName,
						success: function(oTile) {
							var icon;
							var aContent = oTile.getTileContent();
							aContent.forEach(function(content) {
								var actualContent = content.getContent();
								if (actualContent && actualContent.getSrc && typeof actualContent.getSrc === 'function') {
									icon = actualContent.getSrc();
								}
							});
							Opa5.assert.strictEqual(icon, "sap-icon://add", "tile icon changed");
						},
						errorMessage: "did not find the tile preview"
					});
				}
			}
		}
	});

});
