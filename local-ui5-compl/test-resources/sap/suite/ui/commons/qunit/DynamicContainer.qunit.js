sap.ui.define([
	"sap/ui/qunit/utils/nextUIUpdate",
	"sap/suite/ui/commons/TileContent",
	"sap/suite/ui/commons/NumericContent",
	"sap/suite/ui/commons/GenericTile",
	"sap/suite/ui/commons/DynamicContainer",
	"sap/ui/model/json/JSONModel"
], function(
	nextUIUpdate,
	TileContent,
	NumericContent,
	GenericTile,
	DynamicContainer,
	JSONModel
) {
	"use strict";


	QUnit.module("Rendering", {
		beforeEach : async function() {
			this.oDynamicContainerData = {
				tiles: [
					{
						header: "Tile 1",
						frameType : "TwoByOne",
						size: "M",
						tileContent: [
							{
								footer: "Footer 1",
								value: 10
							},
							{
								footer: "Footer 2",
								value: 20
							}
						]
					}, {
						header: "Tile 2",
						frameType: "OneByOne",
						size: "M",
						tileContent: [
							{
								footer: "Footer 3",
								value: 30
							}, {
								footer: "Footer 4",
								value: 40
							}
						]
					}
				]
			};

			this.oTileContent = new TileContent({
				footer: "{footer}",
				content: new NumericContent({
					value: "{value}"
				})
			});

			this.oGenericTile = new GenericTile({
				frameType: "{frameType}",
				header: "{header}",
				size: "{size}",
				tileContent: {
					template: this.oTileContent,
					path: "tileContent",
					templateShareable: true
				}
			});

			this.oDynamicContainer = new DynamicContainer("dynamic-container", {
				displayTime: 500,
				transitionTime: 0,
				tiles: {
					template: this.oGenericTile,
					path: "/tiles",
					templateShareable: true
				}
			});

			this.oDynamicContainerModel = new JSONModel();
			this.oDynamicContainerModel.setData(this.oDynamicContainerData);
			this.oDynamicContainer.setModel(this.oDynamicContainerModel);
			this.oDynamicContainer.placeAt("qunit-fixture");
			await nextUIUpdate();
		},
		afterEach : function() {
			this.oDynamicContainer.destroy();
			this.oTileContent.destroy();
			this.oGenericTile.destroy();
			this.oDynamicContainerModel.destroy();
		}
	});

	QUnit.test("DynamicContainer wrapper is working", function(assert) {
		assert.ok(window.document.getElementById("dynamic-container"), "DynamicContainer was rendered successfully");
	});
});