/*global QUnit*/
sap.ui.define(["sap/gantt/simple/BaseImage", "sap/gantt/simple/test/GanttQUnitUtils",
"sap/ui/core/Element",
"sap/ui/core/RenderManager",
"sap/gantt/simple/test/nextUIUpdate"], function (BaseImage, utils, Element,
	RenderManager,
	nextUIUpdate) {
	"use strict";

	QUnit.module("Property", {
		beforeEach: function () {
			this.oShape = new BaseImage();
		},
		afterEach: function () {
			this.oShape = null;
		}
	});

	QUnit.test("default values", function (assert) {
		assert.strictEqual(this.oShape.getWidth(), 20, "Default Width is 20");
		assert.strictEqual(this.oShape.getHeight(), 20, "Default Height is 20");
		assert.strictEqual(this.oShape.getOpacity(), 1, "Default opacity is 1");
	});

	QUnit.module("Function", {
		beforeEach: function () {
			this.oShape = new BaseImage({
				x: 0,
				y:0,
				src: "sap-icon://account",
				width: 15,
				height: 15
			});
			this.oShape2 = new BaseImage({
				x: 0,
				y:0,
				src: "../../image/truck.png",
				width: 15,
				height: 15
			});
		},
		afterEach: function () {
			this.oShape = null;
			this.oShape2 = null;
		}
	});

	QUnit.test("Function", function (assert) {
		assert.ok(this.oShape != null, "Shape instance is found");
		assert.strictEqual(this.oShape.getX(), 0,  "Configured X propery");
		assert.strictEqual(this.oShape.getY(), 0, "Configured Y propery");
	});

	QUnit.test("Rendering", function (assert) {
		var oRm = new RenderManager();
		this.oShape.setProperty("opacity", 0.5);
		this.oShape2.setProperty("opacity", 0.2);
		this.oShape.renderElement(oRm, this.oShape);
		this.oShape2.renderElement(oRm, this.oShape2);
		oRm.flush(window.document.getElementById("qunit-fixture"));
		oRm.destroy();
		var oIconfont = jQuery('#qunit-fixture').find("text");
		var oBitImage = jQuery('#qunit-fixture').find("image,img");
		assert.ok(oIconfont.length === 1, "Rendering base icon is OK");
		assert.ok(oBitImage.length === 1, "Rendering bitmap image icon is OK");
		assert.strictEqual(jQuery(oIconfont).attr("x"), "0",  "X propery is rendered");
		assert.strictEqual(jQuery(oIconfont).attr("y"), "0",  "Y propery is rendered");
		assert.strictEqual(jQuery(oIconfont).css("font-family"), "SAP-icons",  "Icon font family is correct");
		assert.strictEqual(jQuery(oIconfont).css("font-size"), "15px",  "Icon size is correct");
		assert.strictEqual(document.getElementById("qunit-fixture").children[0].getAttribute("opacity"), "0.5", "Icon opcacity is correct");
		assert.strictEqual(jQuery(oBitImage).attr("x"), "0",  "X propery is rendered");
		assert.strictEqual(jQuery(oBitImage).attr("y"), "0",  "Y propery is rendered");
		assert.strictEqual(jQuery(oBitImage).attr("width"), "15",  "Image width is correct");
		assert.strictEqual(jQuery(oBitImage).attr("height"), "15",  "Image height is correct");
		assert.strictEqual(jQuery(oBitImage).attr("href"), "../../image/truck.png",  "Image src is correct");
		assert.strictEqual(document.getElementById("qunit-fixture").children[1].getAttribute("opacity"), "0.2", "Image opcacity is correct");
	});

	QUnit.module("Test Align Shape", {
		beforeEach: function () {
			this.oShape = new BaseImage({
				src: "sap-icon://account",
				width: 15,
				height: 15,
				rowYCenter: 20,
				time: new Date(Date.UTC(2018, 2, 22)),
				endTime: new Date(Date.UTC(2018, 2, 22, 0, 0, 51))
			});
			this.oShape._iBaseRowHeight = 48.79999923706055;
		},
		afterEach: function () {
			this.oShape = null;
		}
	});

	QUnit.test("getY for alignshape", function (assert) {
		var y;
		this.oShape.setAlignShape("Top");
		y = 10;
		assert.strictEqual(this.oShape.getY(), y, "In non RTL mode, for alignShape = top the return value is '" + y + "'");

		this.oShape.setAlignShape("Middle");
		y = 27;
		assert.strictEqual(this.oShape.getY(), y, "In non RTL mode, for alignShape = middle the return value is '" + y + "'");

		this.oShape.setAlignShape("Bottom");
		y = 43;
		assert.strictEqual(this.oShape.getY(), y, "In non RTL mode, for alignShape = bottom the return value is '" + y + "'");
	});
	QUnit.module("BaseImage rendering", {
		beforeEach: function () {
			this.oShape = new BaseImage({
				id:"image1",
				src: "sap-icon://lock",
				width: 15,
				time: sap.gantt.misc.Format.abapTimestampToDate("20180103000000"),
				height: 15
			});
			this.oGantt = utils.createSimpleGantt(this.oShape, "20180101000000", "20180105000000");
			document.getElementById("qunit-fixture").style.width = "1920px";
			this.oGantt.placeAt("qunit-fixture");
		},
		afterEach: function () {
			this.oShape.destroy();
			this.oShape = undefined;
			this.oGantt.destroy();
			this.oGantt = undefined;
		}
	});
	QUnit.test("Baseimage as icon font rendering", async function (assert) {
		var fnDone = assert.async();
		await nextUIUpdate();
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			var oFontIconId = Element.getElementById("gantt").getTable().getRows()[0].getAggregation("_settings").getShapes1()[0].getId();
			assert.ok(document.getElementById(oFontIconId) !== null, "Rendering base icon is OK");
			fnDone();
		});
	});
});
