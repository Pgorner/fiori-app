sap.ui.define([
	"sap/ui/core/util/MockServer",
	"test/sap/apf/testhelper/mockServerCloudFoundry/APFServiceMockServer",
	"sap/ui/thirdparty/sinon",
	"sap/apf/cloudFoundry/ui/utils/LaunchPageUtils",
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"test/sap/apf/integration/cloudFoundry/pages/Config.page",
	"test/sap/apf/integration/cloudFoundry/pages/ShareDialog.page",
	"test/sap/apf/integration/cloudFoundry/pages/ShowLinkDialog.page"
], function (Mockserver, APFServiceMockServer, sinon, LaunchPageUtils, Opa5, opaTest) {
	"use strict";

	QUnit.module("Share Dialog", {
		beforeEach: function () {
			APFServiceMockServer.init();

			this.iFrame = Opa5.getWindow();
		},
		afterEach: function () {
			Mockserver.destroyAll();
		}
	});

	opaTest("Start Modeler", function(Given, When, Then) {
		var sPageUrl = sap.ui.require.toUrl('test/sap/apf/testhelper/modelerComponentCloudFoundry/index.html');
		Given.iStartMyAppInAFrame(sPageUrl + '?sap-ui-language=EN#/app/57FCA36EC3D350DEE10000000A442AF5/config/15184393783558433132010203955379');
		Then.waitFor({
			success: function () {
				QUnit.assert.ok(true, "startup successful");
			}
		});
	});

	opaTest("Open Share Dialog", function(Given, When, Then) {
		When.onTheConfigPage.iPressTheShareButton();
		Then.onTheConfigPage.iShouldSeeTheShareDialog();
	});

	opaTest("Display Placeholders and Tile Configuration", function(Given, When, Then) {
		Then.onTheShareDialog.iShouldSeeTheTitlePlaceholder();
		Then.onTheShareDialog.iShouldSeeTheSubtitlePlaceholder();
		Then.onTheShareDialog.iShouldSeeTheDefaultTileHeader();
		Then.onTheShareDialog.iShouldSeeTheDefaultTileSubheader();
		Then.onTheShareDialog.iShouldSeeTheEmptyTileIcon();
	});

	opaTest("Change Header", function(Given, When, Then) {
		Given.onTheShareDialog.iChangeTheHeader();
		Then.onTheShareDialog.iShouldSeeTheChangedTileHeader();
	});
	opaTest("Clear Header", function(Given, When, Then) {
		Given.onTheShareDialog.iClearTheHeader();
		Then.onTheShareDialog.iShouldSeeTheDefaultTileHeader();
	});
	opaTest("Change Subheader", function(Given, When, Then) {
		Given.onTheShareDialog.iChangeTheSubheader();
		Then.onTheShareDialog.iShouldSeeTheChangedTileSubheader();
	});
	opaTest("Clear Subheader", function(Given, When, Then) {
		Given.onTheShareDialog.iClearTheSubheader();
		Then.onTheShareDialog.iShouldSeeTheDefaultTileSubheader();
	});
	opaTest("Change Icon", function(Given, When, Then) {
		Given.onTheShareDialog.iChangeTheIcon();
		Then.onTheShareDialog.iShouldSeeTheChangedTileIcon();
	});
	opaTest("Clear Icon", function(Given, When, Then) {
		Given.onTheShareDialog.iClearTheIcon();
		Then.onTheShareDialog.iShouldSeeTheEmptyTileIcon();
	});
	opaTest("Change Group", function(Given, When, Then) {
		Given.waitFor({
			id: "shareDialog",
			viewName: "sap.apf.cloudFoundry.ui.sharedialog.view.ShareDialog",
			success: function(oShareDialog) {
				this.oShareDialog = oShareDialog;
			}.bind(this)
		});
		When.onTheShareDialog.iChangeTheGroup();
		Then.waitFor({
			success: function() {
				QUnit.assert.strictEqual(this.oShareDialog.getModel("ui").getProperty("/TileGroup"), "my-group", "group property has changed");
			}.bind(this)
		});
	});

	opaTest("Show Link", function(Given, When, Then) {
		When.onTheShareDialog.iPressTheLinkButton();
		Given.waitFor({
			controlType: "sap.m.Dialog",
			matchers: function(oDialog) {
				return oDialog.getTitle() === "Configuration Link";
			},
			success: function(oDialogs) {
				this.spyClose = sinon.spy(oDialogs[0], "close");
			}.bind(this)
		});
		Then.onTheShowLinkDialog.iShouldSeeTheBookmarkLink();
		//close dialog
		When.onTheShowLinkDialog.iPressTheCloseButton();
		Then.waitFor({
			success: function() {
				QUnit.assert.ok(this.spyClose.calledOnce, "ShowLinkDialog is closed");
				this.spyClose.restore();
			}.bind(this)
		});
	});
	opaTest("Send Email", function(Given, When, Then) {
		// TODO should not use sap.ui.define
		// Currently causes an error log entry in the frame. But changing it to sap.ui.require
		// changes the timing in a way that the test can't handle yet.
		this.iFrame.sap.ui.define(["sap/m/library"], function(Library) {
			this.stubTriggerEmail = sinon.stub(Library.URLHelper, "triggerEmail");
			When.onTheShareDialog.iPressTheEmailButton();
			Then.waitFor({
				success: function() {
					QUnit.assert.ok(this.stubTriggerEmail.calledOnce, "email is triggered");
					this.stubTriggerEmail.restore();
				}.bind(this)
			});
		}.bind(this));
	});
	opaTest("Save Tile", function(Given, When, Then) {
		// TODO should not use sap.ui.define
		// Currently causes an error log entry in the frame. But changing it to sap.ui.require
		// changes the timing in a way that the test can't handle yet.
		this.iFrame.sap.ui.define(["sap/apf/cloudFoundry/ui/utils/LaunchPageUtils"], function(LaunchPageUtils) {
			this.stubSetBookmarkTile = sinon.stub(LaunchPageUtils, "setBookmarkTile");
			When.onTheShareDialog.iPressTheTileButton();
			Then.waitFor({
				success: function() {
					QUnit.assert.ok(this.stubSetBookmarkTile.calledOnce, "tile is saved");
					this.stubSetBookmarkTile.restore();
				}.bind(this)
			});
		}.bind(this));
	});

	opaTest("Close Share Dialog", function(Given, When, Then) {
		Given.waitFor({
			id: "shareDialog",
			viewName: "sap.apf.cloudFoundry.ui.sharedialog.view.ShareDialog",
			success: function(oShareDialog) {
				this.spyClose = sinon.spy(oShareDialog, "close");
			}.bind(this)
		});
		When.onTheShareDialog.iPressTheCloseButton();
		Then.waitFor({
			success: function() {
				QUnit.assert.ok(this.spyClose.calledOnce, "Share Dialog is closed");
				this.spyClose.restore();
			}.bind(this)
		});
	});

	opaTest("Teardown Modeler", function(Given, When, Then) {
		Given.iTeardownMyAppFrame();
		Then.waitFor({
			success: function() {
				QUnit.assert.ok(true, "teardown successful");
			}
		});
	});

});
