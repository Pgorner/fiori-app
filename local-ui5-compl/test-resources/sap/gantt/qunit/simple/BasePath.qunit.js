/*global QUnit, sinon */

sap.ui.define([
	"sap/gantt/simple/BasePath",
	"sap/ui/core/RenderManager"
], function(BasePath,
	RenderManager) {
	"use strict";

	QUnit.module("Rendering");

	QUnit.test("BasePath with d properties", function(assert) {
		var oPath = new BasePath({
			d: "M 0 22 m 0 15 l -10 0 l 10 -30 l 20 30 l -20 0 z"
		});

		var oRm = new RenderManager();

		var fnWriteClasses = sinon.spy(oRm, "class");

		oPath.renderElement(oRm, oPath);
		oRm.flush(window.document.getElementById("qunit-fixture"));

		assert.strictEqual(jQuery('#qunit-fixture').find("path").attr("d"), "M 0 22 m 0 15 l -10 0 l 10 -30 l 20 30 l -20 0 z", "Render BasePath with valid 'd' property");
		sinon.assert.calledOnce(fnWriteClasses);
		fnWriteClasses.restore();

		oPath.setD("M 0 null m 0 15 l -10 0 l 10 -30 l 20 30 l -20 0 z");
		oPath.renderElement(oRm, oPath);
		oRm.flush(window.document.getElementById("qunit-fixture"));
		oRm.destroy();

		assert.strictEqual(jQuery('#qunit-fixture').find("path").attr("d"), "M 0 null m 0 15 l -10 0 l 10 -30 l 20 30 l -20 0 z", "Render BasePath with invalid 'd' property");
	});

	QUnit.test("Verify RenderUtils is called to create base text title", function (assert) {
		var renderElementTitleSpy = sinon.spy(sap.gantt.simple.RenderUtils, "renderElementTitle");
		var oRm = new RenderManager();
		var oPath = new BasePath({
			d: "M 0 22 m 0 15 l -10 0 l 10 -30 l 20 30 l -20 0 z"
		});
		var sText = "Test Title";

		oPath.renderElement(oRm, oPath);

		assert.ok(renderElementTitleSpy.calledWithMatch(oRm, oPath, sinon.match.func), "Called with render manager and element");

		var spyCall = renderElementTitleSpy.getCall(0);
		var fnTitleCreator = spyCall.args[2];

		assert.ok(fnTitleCreator({text: sText}).getText() === sText, "Called with title creator function");

		oRm.destroy();
		renderElementTitleSpy.restore();
	});

});
