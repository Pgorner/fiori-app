/* global QUnit, sinon*/

sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/ui/vk/thirdparty/three",
	"sap/ui/vk/threejs/OutlineRenderer",
	"test-resources/sap/ui/vk/qunit/utils/ThreeJSUtils"
], function(
	jQuery,
	THREE,
	OutlineRenderer,
	ThreeJSUtils
) {
	"use strict";

	QUnit.module("threejs.OutlineRenderer");

	QUnit.test("OutlineRenderer destroy all created ThreeJS Objects", function(assert) {
		var materialCreate = sinon.spy(THREE.Material, "call");
		var geometryCreate = sinon.spy(THREE.BufferGeometry, "call");
		var materialDispose = sinon.spy(THREE.Material.prototype, "dispose");
		var geometryDispose = sinon.spy(THREE.BufferGeometry.prototype, "dispose");

		var outlineRenderer = new OutlineRenderer(1.0);
		assert.ok(outlineRenderer, "OutlineRenderer is created");

		outlineRenderer.dispose();

		var geometryCallInfo = ThreeJSUtils.createCallInfo(geometryCreate, geometryDispose);
		ThreeJSUtils.analyzeCallInfo("Geometries", geometryCallInfo, assert);

		var materialCallInfo = ThreeJSUtils.createCallInfo(materialCreate, materialDispose);
		ThreeJSUtils.analyzeCallInfo("Materials", materialCallInfo, assert);
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
