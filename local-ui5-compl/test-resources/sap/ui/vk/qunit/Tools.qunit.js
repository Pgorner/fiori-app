/* global QUnit*/

sap.ui.define([
	"sap/ui/qunit/utils/nextUIUpdate",
	"sap/ui/thirdparty/jquery",
	"sap/ui/vk/Viewport",
	"sap/ui/vk/ViewStateManager",
	"sap/ui/vk/tools/SceneOrientationTool",
	"sap/ui/vk/tools/TooltipTool",
	"sap/ui/vk/tools/MoveTool",
	"sap/ui/vk/tools/PredefinedView",
	"sap/ui/vk/tools/CoordinateSystem",
	"sap/ui/vk/tools/GizmoPlacementMode",
	"sap/ui/vk/thirdparty/three",
	"test-resources/sap/ui/vk/qunit/utils/ModuleWithContentConnector"
], function(
	nextUIUpdate,
	jQuery,
	Viewport,
	ViewStateManager,
	SceneOrientationTool,
	TooltipTool,
	MoveTool,
	PredefinedView,
	CoordinateSystem,
	GizmoPlacementMode,
	THREE,
	loader
) {
	"use strict";

	var sceneOrientationTool = new SceneOrientationTool();
	var tooltipTool = new TooltipTool();
	var moveTool = new MoveTool();
	var viewStateManager = new ViewStateManager();
	var viewport = new Viewport({
		viewStateManager: viewStateManager,
		tools: [sceneOrientationTool, tooltipTool, moveTool]
	});
	viewport.placeAt("content");
	nextUIUpdate.runSync();

	QUnit.moduleWithContentConnector("Tools", "test-resources/sap/ui/vk/qunit/media/boxes.three.json", "threejs.test.json", function(assert) {
		viewport.setContentConnector(this.contentConnector);
		viewStateManager.setContentConnector(this.contentConnector);
	});

	QUnit.test("Initialization", function(assert) {
		assert.equal(viewport.getTools().length, 3, "Tools loaded in Viewport");
		assert.equal(viewport.getImplementation().getTools().length, 3, "Tools loaded in implementation Viewport");
	});

	QUnit.test("SceneOrientationTool", function(assert) {
		var newInstance = new SceneOrientationTool();
		assert.equal(newInstance, sceneOrientationTool, "Tool is singleton");

		var enabledDone = assert.async();
		sceneOrientationTool.attachEventOnce("enabled", function(evt) {
			assert.ok(evt.getParameter("enabled"), "Tool enabled event param");
			assert.ok(sceneOrientationTool.getActive(), "Tool enabled property");
			enabledDone();
		});
		sceneOrientationTool.setActive(true, viewport);

		var compareNumbers = function(f1, f2) {
			return f1 - f2 < 0.00001;
		};

		var done = assert.async();
		var phase = 0;
		var time;
		viewport.attachEvent("viewFinished", function(evt) {
			switch (phase) {
				case 0:
					var dir1 = viewport.getCamera().getTargetDirection();
					assert.ok(compareNumbers(dir1[0], 0) && compareNumbers(dir1[1], 0) && compareNumbers(dir1[2], -1), "Front view immediate set");
					sceneOrientationTool.setView(PredefinedView.Left);
					break;
				case 1:
					var dir2 = viewport.getCamera().getTargetDirection();
					assert.ok(compareNumbers(dir2[0], 1) && compareNumbers(dir2[1], 0) && compareNumbers(dir2[2], 0), "Left view immediate set");
					time = Date.now();
					sceneOrientationTool.setView(PredefinedView.Front, 100);
					break;
				case 2:
					var dir3 = viewport.getCamera().getTargetDirection();
					assert.ok(Date.now() - time >= 100, "Minimum fly-to time");
					assert.ok(compareNumbers(dir3[0], 0) && compareNumbers(dir3[1], 0) && compareNumbers(dir3[2], -1), "Front view delayed set");
					time = Date.now();
					sceneOrientationTool.setView(PredefinedView.Left, 100);
					break;
				default:
					var dir4 = viewport.getCamera().getTargetDirection();
					assert.ok(Date.now() - time >= 100, "Minimum fly-to time");
					assert.ok(compareNumbers(dir4[0], 1) && compareNumbers(dir4[1], 0) && compareNumbers(dir4[2], 0), "Left view delayed set");
					done();
					break;
			}
			phase++;
		});
		sceneOrientationTool.setView(PredefinedView.Front);
	});

	QUnit.test("TooltipTool", async function(assert) {
		assert.test.module.hooks.afterEach = null;

		var clientRect = viewport.getDomRef().getBoundingClientRect();
		var x = clientRect.left + clientRect.width / 2;
		var y = clientRect.top + clientRect.height / 2;

		var enabledDone = assert.async();
		tooltipTool.attachEventOnce("enabled", function(evt) {
			assert.ok(evt.getParameter("enabled"), "Tool enabled event param");
			assert.ok(tooltipTool.getActive(), "Tool enabled property");
			enabledDone();
		});

		tooltipTool.setActive(true, viewport);
		viewport.invalidate(); // required to immediately generate tooltipTool.domRef
		await nextUIUpdate();

		tooltipTool.setFollowCursor(false);
		assert.notOk(tooltipTool.getFollowCursor(), "followCursor property");
		tooltipTool.setAnimate(true);
		viewport.invalidate();
		await nextUIUpdate(); // required to immediately generate tooltipTool.domRef
		assert.ok(tooltipTool.getAnimate(), "animate property");
		assert.equal(tooltipTool.getGizmo().getDomRef().className, "sapUiVizKitTooltip sapUiVizKitTooltipAnimation", "animate class");
		tooltipTool.setOffsetX(20);
		assert.equal(tooltipTool.getOffsetX(), "20", "offsetx property");
		tooltipTool.setOffsetY(20);
		assert.equal(tooltipTool.getOffsetY(), "20", "offsety property");

		var done = assert.async();
		tooltipTool.attachEventOnce("hover", function(evt) {
			var name = evt.getParameter("nodeRef").name;
			assert.equal(name, "Box 2", "Object detection");
			tooltipTool.setTitle(name);
			assert.equal(tooltipTool.getGizmo().getDomRef().innerText, name, "Gizmo name correct");

			tooltipTool.setActive(false);
			evt.preventDefault();
			done();
		});

		viewport._implementation.attachEventOnce("frameRenderingFinished", function() {
			viewport.getImplementation()._loco._move({
				points: [],
				buttons: 0,
				timeStamp: 1100,
				n: 0,
				d: 0,
				x: x,
				y: y
			});
		});
	});

	QUnit.test("MoveTool", function(assert) {
		var enabledDone = assert.async();
		moveTool.attachEventOnce("enabled", function(evt) {
			assert.ok(evt.getParameter("enabled"), "Tool enabled event param");
			assert.ok(moveTool.getActive(), "Tool enabled property");

			enabledDone();
		});
		moveTool.setActive(true, viewport);

		assert.equal(moveTool.getCoordinateSystem(), CoordinateSystem.World, "Default coordinate system");
		assert.equal(moveTool.getPlacementMode(), GizmoPlacementMode.ObjectCenter, "Default placement mode");

		var node = viewStateManager.getNodeHierarchy().findNodesByName()[3];
		node.position.set(0, 0, 0);
		node.rotateY(Math.PI / 2);
		node.updateMatrix();
		node.updateMatrixWorld(true);
		node.parent.rotateZ(Math.PI / 2);
		node.parent.updateMatrix();
		node.parent.updateMatrixWorld(true);

		viewStateManager.setSelectionStates(node, [], false);
		moveTool.move(10, 0, 0);	// Move in world space
		var worldTx = node.getWorldPosition(new THREE.Vector3());
		assert.equal(Math.round(worldTx.x), 10, "Object translated X in world system");
		assert.equal(Math.round(worldTx.y), 0, "Object not translated Y in world system");
		assert.equal(Math.round(worldTx.z), 0, "Object not translated Z in world system");

		moveTool.setCoordinateSystem(CoordinateSystem.Local);
		moveTool.move(10, 0, 0);	// Move in local space
		var localTx = node.getWorldPosition(new THREE.Vector3());
		assert.equal(Math.round(localTx.x), 10, "Object not translated X in world system");
		assert.equal(Math.round(localTx.y), 0, "Object not translated Y in world system");
		assert.equal(Math.round(localTx.z), -10, "Object translated Z in local space");

		moveTool.setCoordinateSystem(CoordinateSystem.Parent);
		moveTool.move(10, 0, 0);	// Move in parent space
		var parentTx = node.getWorldPosition(new THREE.Vector3());
		assert.equal(Math.round(parentTx.x), 10, "Object not translated X in parent space");
		assert.equal(Math.round(parentTx.y), 10, "Object translated in parent space");
		assert.equal(Math.round(parentTx.z), -10, "Object not translated Z in parent space");

		moveTool.setCoordinateSystem(CoordinateSystem.Screen);
		moveTool.move(10, 0, 0);	// Move in screen space (right in pixels)
		var screenTx = node.getWorldPosition(new THREE.Vector3());
		// This is now move for 10 pixels, which is unpredictable number of units (depends on screen resolution)
		// Therefore we'll just check that it's not the same as before
		assert.notEqual(screenTx.x, 10.0, "Object translated in screen space");
		assert.equal(Math.round(screenTx.y), 10, "Object not translated Y in screen space");
		assert.equal(Math.round(screenTx.z), -10, "Object not translated Z in screen space");
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
