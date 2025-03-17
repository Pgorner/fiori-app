sap.ui.define([
	"sap/ui/qunit/utils/nextUIUpdate",
	"sap/suite/ui/commons/TileContent",
	"sap/suite/ui/commons/NewsContent",
	"sap/ui/util/Mobile"
], function(nextUIUpdate, TileContent, NewsContent, Mobile) {
	"use strict";


	Mobile.init();

	QUnit.module("Rendering", {
		beforeEach : async function() {
			this.oTileContent = new TileContent("tile-content", {
				footer: "Current Quarter",
				unit : "EUR",
				size : "Auto",
				content: new NewsContent("news", {
					size : "Auto",
					contentText: "SAP Unveils Powerful New Player Comparison Tool Exclusively on NFL.com",
					subheader: "SAP News"
				})
			}).placeAt("qunit-fixture");
			await nextUIUpdate();
		},
		afterEach : function() {
			this.oTileContent.destroy();
		}
	});

	QUnit.test("TileContent wrapper is working", function(assert) {
		assert.ok(window.document.getElementById("tile-content"), "TileContent was rendered successfully");
	});
});