/* global QUnit*/

sap.ui.define([
	"sap/ui/qunit/utils/nextUIUpdate",
	"sap/ui/thirdparty/jquery",
	"sap/ui/vk/library",
	"sap/ui/vk/Viewer",
	"sap/ui/vk/NativeViewport",
	"sap/ui/vk/ContentResource"
], function(
	nextUIUpdate,
	jQuery,
	library,
	Viewer,
	NativeViewport,
	ContentResource
) {
	"use strict";

	/**
	 * @deprecated
	 */
	var testSceneTreeAndStepNavigationStates = function(viewer, enableSceneTree, showSceneTree, enableStepNavigation, showStepNavigation, title) {
		QUnit.test("Test states for: enableSceneTree, showSceneTree, enableStepNavigation, showStepNavigation. ===> " + title, function(assert) {
			assert.strictEqual(viewer.getEnableSceneTree(), enableSceneTree, "enableSceneTree matches the expected state.");
			assert.strictEqual(viewer.getShowSceneTree(), showSceneTree, "showSceneTree matches the expected state.");
			assert.strictEqual(viewer.getEnableStepNavigation(), enableStepNavigation, "enableStepNavigation matches the expected state.");
			assert.strictEqual(viewer.getShowStepNavigation(), showStepNavigation, "showStepNavigation matches the expected state.");
		});
	};

	/**
	 * @deprecated As of version 1.120
	 */
	var testGetGraphicsCore = function(graphicsCore) {
		QUnit.test("getGraphicsCore", function(assert) {
			assert.ok(graphicsCore instanceof library.dvl.GraphicsCore, "The Graphics Core object has been created.");
			assert.ok(graphicsCore._canvas instanceof HTMLCanvasElement, "The Graphics Core object has content in the _canvas property.");
			assert.ok(graphicsCore._dvl, "The Graphics Core object has content in the _dvl property.");
			assert.ok(graphicsCore._dvlClientId, "The Graphics Core object has content in the _dvlClientId property.");
			assert.ok(graphicsCore._webGLContext instanceof WebGL2RenderingContext, "The Graphics Core object has content in the _webGLContext property.");
		});
	};

	var testGetNativeViewport = function(nativeViewport) {
		QUnit.test("getNativeViewport", function(assert) {
			assert.ok(nativeViewport instanceof NativeViewport, "getNativeViewport returns an instance of sap.ui.vk.NativeViewport");
		});
	};

	/**
	 * @deprecated
	 */
	var testGetViewport = function(viewport) {
		QUnit.test("getViewport", function(assert) {
			assert.ok(viewport.getImplementation() instanceof library.dvl.Viewport || viewport.getImplementation() instanceof library.threejs.Viewport
				, "getViewport returns an instance of sap.ui.vk.dvl.Viewport or sap.ui.vk.threejs.Viewport");
		});
	};

	/**
	 * @deprecated
	 */
	var testGetScene = function(scene) {
		QUnit.test("getScene", function(assert) {
			assert.ok(scene instanceof library.Scene, "getScene returns an instance of sap.ui.vk.dvl.Scene");
		});
	};

	/**
	 * @deprecated
	 */
	var testGetViewStateManager = function(viewStateManager) {
		QUnit.test("getViewStateManager", function(assert) {
			assert.ok(viewStateManager instanceof library.ViewStateManager, "getViewStateManager returns an instance of sap.ui.vk.ViewStateManager.");
		});
	};

	/**
	 * @deprecated As of version 1.120
	 */
	QUnit.test("VDS loading in DVL", async function(assert) {
		assert.ok(true, "Main test started.");
		var done = assert.async();

		assert.notOk(sap.ve && sap.ve.dvl, "dvl.js is not loaded until the first Viewport instance is created");

		var contentResource = new ContentResource({
			source: "test-resources/sap/ui/vk/qunit/media/nodes_boxes_with_steps.vds",
			sourceType: "vds",
			sourceId: "abc"
		});

		var viewer1 = new Viewer({
			runtimeSettings: { totalMemory: 16777216 }
		}).placeAt("content");
		await nextUIUpdate();

		viewer1.addContentResource(contentResource);
		viewer1.attachSceneLoadingFailed(function(event) {
			assert.ok(false, "Viewer could not load the VDS file.");
			done();
		});

		viewer1.attachSceneLoadingSucceeded(function(event) {
			assert.ok(true, "Viewer loaded the VDS file successfully.");

			testSceneTreeAndStepNavigationStates(viewer1, true, true, true, false, "Default states");
			testGetGraphicsCore(viewer1.getGraphicsCore());
			testGetViewport(viewer1.getViewport());
			testGetScene(viewer1.getScene());
			testGetViewStateManager(viewer1.getViewStateManager());

			done();
		});
	});

	QUnit.test("Image loading", async function(assert) {
		var done = assert.async();

		var viewer2 = new Viewer().placeAt("content");
		await nextUIUpdate();
		viewer2.addContentResource(new ContentResource({
			source: "test-resources/sap/ui/vk/qunit/media/cat.jpg",
			sourceType: "jpg",
			sourceId: "abc"
		}));
		viewer2.attachSceneLoadingFailed(function(event) {
			assert.ok(false, "Viewer could not load the JPG file.");
			done();
		});
		viewer2.attachSceneLoadingSucceeded(function(event) {
			assert.ok(true, "Viewer loaded the JPG file successfully.");
			testGetNativeViewport(viewer2.getViewport().getImplementation());
			done();
		});
	});

	QUnit.test("VDS loading in ThreeJs", async function(assert) {
		var done = assert.async();

		var oViewer = new Viewer().placeAt("content");
		await nextUIUpdate();
		oViewer.destroyContentResources();
		oViewer.attachSceneLoadingFailed(function() {
			assert.ok(false, "Model loading failed");
			done();
		});

		oViewer.attachSceneLoadingSucceeded(function() {
			assert.ok(true, "Model loading succeeded");

			var roots = this.getScene().getDefaultNodeHierarchy().getChildren();
			assert.equal(roots.length, 1, "Single root node");
			assert.equal(roots[0].isGroup, true, "Grouping node");
			assert.equal(roots[0].name, undefined, "VDS content correct");
			assert.strictEqual(roots[0].userData.skipIt, true, "Root node is hidden in UI");
			assert.equal(roots[0].children.length, 19, "VDS content loaded here");

			done();
		});

		var res = new ContentResource({
			source: "test-resources/sap/ui/vk/qunit/media/multiple_shapes.vds",
			sourceType: "vds4"
		});

		oViewer.addContentResource(res);
	});

	QUnit.test("Named VDS loading in ThreeJs", async function(assert) {
		var done = assert.async();

		var oViewer = new Viewer().placeAt("content");
		await nextUIUpdate();
		oViewer.destroyContentResources();
		oViewer.attachSceneLoadingFailed(function() {
			assert.ok(false, "Model loading failed");
			done();
		});

		oViewer.attachSceneLoadingSucceeded(function() {
			assert.ok(true, "Model loading succeeded");

			var roots = this.getScene().getDefaultNodeHierarchy().getChildren();
			assert.equal(roots.length, 1, "Single root node");
			assert.equal(roots[0].isGroup, true, "Grouping node");
			assert.equal(roots[0].name, "MyTestFile", "VDS content correct");
			assert.ok(roots[0].userData.skipIt == false, "Root node is NOT hidden in UI");
			assert.equal(roots[0].children.length, 19, "VDS content loaded here");

			done();
		});

		var res = new ContentResource({
			source: "test-resources/sap/ui/vk/qunit/media/multiple_shapes.vds",
			sourceType: "vds4",
			name: "MyTestFile"
		});

		oViewer.addContentResource(res);
	});

	QUnit.test("Content resource hierarchy", async function(assert) {
		var done = assert.async();

		var oViewer = new Viewer().placeAt("content");
		await nextUIUpdate();
		oViewer.destroyContentResources();
		oViewer.attachSceneLoadingFailed(function() {
			assert.ok(false, "Model loading failed");
			done();
		});

		oViewer.attachSceneLoadingSucceeded(function() {
			assert.ok(true, "Model loading succeeded");

			var roots = this.getScene().getDefaultNodeHierarchy().getChildren();
			assert.equal(roots.length, 1, "Single root node");
			assert.equal(roots[0].name, "Root node", "Correct root node");
			assert.equal(roots[0].userData.skipIt, false, "Root node is NOT hidden in UI");
			assert.equal(roots[0].children.length, 1, "VDS content loaded here");
			assert.equal(roots[0].children[0].name, "test", "VDS content correct");

			done();
		});

		var res0 = new ContentResource({
			name: "Root node"
		});

		var res1 = new ContentResource({
			source: "test-resources/sap/ui/vk/qunit/media/multiple_shapes.vds",
			sourceType: "vds4",
			name: "test"
		});
		res0.addContentResource(res1);

		oViewer.addContentResource(res0);
	});

	QUnit.test("FlexibleControl attributes", async function(assert) {
		var done = assert.async();

		var viewer = new Viewer().placeAt("content");
		await nextUIUpdate();
		var contentResource = new ContentResource({
			source: "test-resources/sap/ui/vk/qunit/media/nodes_boxes_with_steps.vds",
			sourceType: "vds4"
		});

		viewer.addContentResource(contentResource);
		viewer.attachSceneLoadingSucceeded(function(event) {
			var s = viewer._stackedViewport.getDomRef().style;

			// Test main styles are present
			assert.equal(s.width, "100%", "Check width");
			assert.equal(s.height, "100%", "Check height");

			// Test all inner styles are present, force sync rendering so that we don't wait for it
			viewer.invalidate();
			nextUIUpdate.runSync();
			s = viewer._stackedViewport.getDomRef().children[0].style;
			assert.equal(s.height, "", "No height");
			assert.equal(s.minHeight, "", "No min-height");
			assert.equal(s.marginTop, "", "No margin-top");
			assert.equal(s.marginBottom, "", "No margin-bottom");

			// Test modified inner styles are present
			var vp = viewer.getViewport();
			vp.setLayoutData(new sap.ui.vk.FlexibleControlLayoutData());
			viewer._stackedViewport.setLayout("Vertical");
			viewer.invalidate();
			nextUIUpdate.runSync();

			s = viewer._stackedViewport.getDomRef().children[0].style;
			assert.equal(s.height, "auto", "Set height");
			assert.equal(s.minHeight, "0px", "Set min-height");
			assert.equal(s.marginTop, "0px", "Set margin-top");
			assert.equal(s.marginBottom, "0px", "Set margin-bottom");

			done();
		});
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
