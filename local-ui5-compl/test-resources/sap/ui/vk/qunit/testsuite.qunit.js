sap.ui.define(function() {

	"use strict";
	return {
		name: "Library sap.ui.vk",
		defaults: {
			group: "Default",
			qunit: {
				version: 2
			},
			sinon: {
				version: 4
			},
			ui5: {
				language: "en",
				theme: "sap_horizon",
				rtl: false,					// Whether to run the tests in RTL mode
				libs: [						// Libraries to load upfront in addition to the library which is tested (sap.ui.vk), if null no libs are loaded
					"sap.ui.vk",
					"sap.ui.richtexteditor",
					"sap.m"
				],
				"xx-waitForTheme": true		// Whether the start of the test should be delayed until the theme is applied
			},
			coverage: {
				only: ["sap/ui/vk"],	// Which files to show in the coverage report, if null, no files are excluded from coverage
				branchCoverage: true		// Whether to enable standard branch coverage
			},
			loader: {
				paths: {
					"sap/ui/vk/qunit": "test-resources/sap/ui/vk/qunit/",
					"sap/ui/core/qunit": "test-resources/sap/ui/core/qunit/",
					"sap/ui/demo/mock": "test-resources/sap/ui/documentation/sdk/"
				}
			},
			page: "test-resources/sap/ui/vk/qunit/teststarter.qunit.html?test={name}",
			autostart: true					// Whether to call QUnit.start() when the test setup is done
		},
		tests: {
			"AnimationMath": {
				coverage: {
					only: ["sap/ui/vk/AnimationMath.js"]
				}
			},
			"Animation": {
				coverage: {
					only: ["sap/ui/vk/AnimationSequence.js", "sap/ui/vk/AnimationPlayback.js", "sap/ui/vk/AnimationTrack.js", "sap/ui/vk/AnimationPlayer.js", "sap/ui/vk/AnimationMath.js", "sap/ui/vk/threejs/ViewStateManager.js"]
				}
			},
			"AnimationPlayer": {
				coverage: {
					only: ["sap/ui/vk/AnimationPlayer.js"]
				}
			},
			"Annotation": {
				coverage: {
					only: ["sap/ui/vk/Annotation.js"]
				}
			},
			/**
			 * @deprecated since 1.120.0
			 */
			"BaseNodeProxy": {
				coverage: {
					only: ["sap/ui/vk/BaseNodeProxy.js"]
				}
			},
			/**
			 * @deprecated since 1.120.0
			 */
			"Camera": {
			},
			"Core": {
				coverage: {
					only: ["sap/ui/vk/Core.js"]
				}
			},
			"DownloadManager": {
				coverage: {
					only: ["sap/ui/vk/DownloadManager.js"]
				}
			},
			"ToggleMenuButton": {
				coverage: {
					only: ["sap/ui/vk/ToggleMenuButton.js", "sap/ui/vk/ToggleMenuItem.js"]
				}
			},
			"DrawerToolbar": {
				coverage: {
					only: ["sap/ui/vk/DrawerToolbar.js"]
				}
			},
			/**
			 * @deprecated since 1.120.0
			 */
			"GenericTests": {
			},
			"GetImage": {
				coverage: {
					only: ["sap/ui/vk/threejs/Viewport.js"]
				}
			},
			"Panoramic": {
				coverage: {
					only: ["sap/ui/vk/threejs/Viewport.js", "sap/ui/vk/threejs/ViewportGestureHandler.js", "sap/ui/vk/threejs/ParametricGenerators"]
				}
			},
			/**
			 * @deprecated since 1.120.0
			 */
			"GraphicsCore": {
				coverage: {
					only: ["sap/ui/vk/dvl/GraphicsCore.js"]
				}
			},
			"HitTestTool": {
				coverage: {
					only: ["sap/ui/vk/tools/HitTestTool.js"]
				}
			},
			"RectSelectTool": {
				coverage: {
					only: ["sap/ui/vk/tools/RectSelectTool.js"]
				}
			},
			"JointUtils": {
				coverage: {
					only: [
						"sap/ui/vk/JointUtils.js"
					]
				}
			},
			"NodeUtils": {
				coverage: {
					only: [
						"sap/ui/vk/NodeUtils.js"
					]
				}
			},
			"MoveTool": {
				coverage: {
					only: [
						"sap/ui/vk/tools/MoveTool.js"
					]
				}
			},
			"RotateTool": {
				coverage: {
					only: [
						"sap/ui/vk/tools/RotateTool.js"
					]
				}
			},
			"ScaleTool": {
				coverage: {
					only: [
						"sap/ui/vk/tools/ScaleTool.js"
					]
				}
			},
			"AxisAngleRotationTool": {
				coverage: {
					only: [
						"sap/ui/vk/tools/AxisAngleRotationTool.js"
					]
				}
			},
			"AnchorPointTool": {
				coverage: {
					only: [
						"sap/ui/vk/tools/AnchorPointTool.js",
						"sap/ui/vk/tools/AnchorPointToolGizmo.js"
					]
				}
			},
			"ExplodeTool": {
				coverage: {
					only: [
						"sap/ui/vk/tools/ExplodeTool.js",
						"sap/ui/vk/tools/ExplodeToolGizmo.js",
						"sap/ui/vk/tools/ExplodeToolHandler.js"
					]
				}
			},
			"PointCloudSelectionTool": {
				coverage: {
					only: [
						"sap/ui/vk/threejs/PointCloudGroup.js",
						"sap/ui/vk/tools/PointCloudSelectionTool.js",
						"sap/ui/vk/tools/PointCloudSelectionToolGizmo.js",
						"sap/ui/vk/tools/PointCloudSelectionToolHandler.js"
					]
				}
			},
			"PoiTool": {
				coverage: {
					only: [
						"sap/ui/vk/tools/PoiManipulationTool.js"
					]
				}
			},
			/**
			 * @deprecated since 1.120.0
			 */
			"LayerProxy": {
				coverage: {
					only: ["sap/ui/vk/LayerProxy.js"]
				}
			},
			"Localisation": {
			},
			/**
			 * @deprecated since 1.120.0
			 */
			"Material": {
			},
			"Measurements": {
				coverage: {
					only: [
						"sap/ui/vk/measurements/Angle.js",
						"sap/ui/vk/measurements/Area.js",
						"sap/ui/vk/measurements/Distance.js",
						"sap/ui/vk/measurements/Vertex.js",
						"sap/ui/vk/measurements/Edge.js",
						"sap/ui/vk/measurements/Face.js",
						"sap/ui/vk/measurements/Surface.js"
					]
				}
			},
			"NativeViewport": {
				coverage: {
					only: ["sap/ui/vk/NativeViewport.js"]
				}
			},
			"NodeHierarchy": {
				coverage: {
					only: [
						"sap/ui/vk/NodeHierarchy.js",
						"sap/ui/vk/dvl/NodeHierarchy.js",
						"sap/ui/vk/threejs/NodeHierarchy.js"
					]
				}
			},
			"NodeProxy": {
				coverage: {
					only: [
						"sap/ui/vk/NodeProxy.js",
						"sap/ui/vk/dvl/NodeProxy.js",
						"sap/ui/vk/threejs/NodeProxy.js"
					]
				}
			},
			"Notifications": {
				coverage: {
					only: ["sap/ui/vk/Notifications.js"]
				}
			},
			"RedlineDesign": {
				coverage: {
					only: ["sap/ui/vk/RedlineDesign.js"]
				}
			},
			"PageGallery": {
				coverage: {
					only: ["sap/ui/vk/pdf/PageGallery.js"]
				}
			},
			"RedlineElement": {
				coverage: {
					only: ["sap/ui/vk/RedlineElement.js"]
				}
			},
			"RedlineElementEllipse": {
				coverage: {
					only: ["sap/ui/vk/RedlineElementEllipse.js"]
				}
			},
			"RedlineElementFreehand": {
				coverage: {
					only: ["sap/ui/vk/RedlineElementFreehand.js"]
				}
			},
			"RedlineElementLine": {
				coverage: {
					only: ["sap/ui/vk/RedlineElementLine.js"]
				}
			},
			"RedlineElementRectangle": {
				coverage: {
					only: ["sap/ui/vk/RedlineElementRectangle.js"]
				}
			},
			"RedlineElementText": {
				coverage: {
					only: ["sap/ui/vk/RedlineElementText.js"]
				}
			},
			"RedlineSurface": {
				coverage: {
					only: ["sap/ui/vk/RedlineSurface.js"]
				}
			},
			"RedlineTool": {
				coverage: {
					only: [
						"sap/ui/vk/RedlineTool.js",
						"sap/ui/vk/RedlineToolGizmo.js",
						"sap/ui/vk/RedlineToolGizmoRenderer.js",
						"sap/ui/vk/RedlineToolHandler.js"
					]
				}
			},
			"RedlineCollaboration": {
				coverage: {
					only: [
						"sap/ui/vk/RedlineCollaboration.js",
						"sap/ui/vk/RedlineConversation.js",
						"sap/ui/vk/RedlineElementComment.js"
					]
				}
			},
			"RedlineUpgradeManager": {
				coverage: {
					only: [
						"sap/ui/vk/RedlineUpgradeManager.js"
					]
				}
			},
			"Scene": {
				coverage: {
					only: ["sap/ui/vk/Scene.js"]
				}
			},
			"SceneTree": {
				coverage: {
					only: ["sap/ui/vk/SceneTree.js"]
				}
			},
			"Selection": {
				coverage: {
					only: ["sap/ui/vk/ViewportBase.js"]
				}
			},
			/**
			 * @deprecated since 1.120.0
			 */
			"StepNavigation": {
				coverage: {
					only: ["sap/ui/vk/StepNavigation.js"]
				}
			},
			"threejs.Camera": {
				coverage: {
					only: ["sap/ui/vk/Viewer.js", "sap/ui/vk/threejs/PerspectiveCamera.js", "sap/ui/vk/threejs/OrthographicCamera.js"]
				}
			},
			"threejs.HitTester": {
				coverage: {
					only: ["sap/ui/vk/threejs/HitTester.js"]
				}
			},
			"threejs.Lighting": {
				coverage: {
					only: ["sap/ui/vk/Viewer.js"]
				}
			},
			"threejs.Matai": {
				coverage: {
					only: [
						"sap/ui/vk/ve/matai.js",
						"sap/ui/vk/ve/matai.wasm",
						"sap/ui/vk/matai/MataiLoader.js",
						"sap/ui/vk/matai/MataiLoaderWorker.js",
						"sap/ui/vk/threejs/SceneBuilder.js",
						"sap/ui/vk/threejs/Billboard.js",
						"sap/ui/vk/threejs/Callout.js",
						"sap/ui/vk/threejs/PolylineGeometry.js",
						"sap/ui/vk/threejs/PolylineMaterial.js",
						"sap/ui/vk/threejs/PolylineMesh.js"
					]
				}
			},
			"threejs.Material": {
				coverage: {
					only: ["sap/ui/vk/threejs/Viewport.js"]
				}
			},
			"threejs.MaterialInterface": {
				coverage: {
					only: ["sap/ui/vk/threejs/Material.js", "sap/ui/vk/threejs/Texture.js"]
				}
			},
			"threejs.SceneBuilder": {
				coverage: {
					only: ["sap/ui/vk/threejs/SceneBuilder.js"]
				}
			},
			"svg.Viewport": {
				coverage: {
					only: ["sap/ui/vk/svg/Viewport.js"]
				}
			},
			"svg.Camera": {
				coverage: {
					only: ["sap/ui/vk/svg/OrthographicCamera.js"]
				}
			},
			"threejs.Viewport": {
				coverage: {
					only: ["sap/ui/vk/threejs/Viewport.js", "sap/ui/vk/threejs/ViewportGestureHandler.js"]
				}
			},
			"svg.ViewStateManager": {
				coverage: {
					only: ["sap/ui/vk/svg/ViewStateManager.js"]
				}
			},
			"threejs.ViewStateManager": {
				coverage: {
					only: ["sap/ui/vk/threejs/ViewStateManager.js"]
				}
			},
			"threejs.v2.ViewStateManager": {
				coverage: {
					only: ["sap/ui/vk/threejs/v2/ViewStateManager.js"]
				}
			},
			"svg.Element": {
				coverage: {
					only: [
						"sap/ui/vk/svg/Element.js",
						"sap/ui/vk/svg/Rectangle.js",
						"sap/ui/vk/svg/Line.js",
						"sap/ui/vk/svg/Ellipse.js",
						"sap/ui/vk/svg/Polyline.js",
						"sap/ui/vk/svg/Path.js",
						"sap/ui/vk/svg/Text.js"
					]
				}
			},
			"svg.Hotspots": {
				coverage: {
					only: [
						"sap/ui/vk/svg/Element.js",
						"sap/ui/vk/svg/HotspotHelper",
						"sap/ui/vk/tools/DuplicateSvgElementTool.js",
						"sap/ui/vk/tools/DuplicateSvgElementToolGizmo.js",
						"sap/ui/vk/tools/DuplicateSvgElementToolHandler.js"
					]
				}
			},
			"svg.Matai": {
				coverage: {
					only: [
						"sap/ui/vk/ve/matai.js",
						"sap/ui/vk/ve/matai.wasm",
						"sap/ui/vk/matai/MataiLoader.js",
						"sap/ui/vk/matai/MataiLoaderWorker.js",
						"sap/ui/vk/svg/ContentManager.js",
						"sap/ui/vk/svg/SceneBuilder.js"
					]
				}
			},
			"svg.SceneBuilder": {
				coverage: {
					only: [
						"sap/ui/vk/svg/SceneBuilder.js"
					]
				}
			},
			"svg.Tools": {
				coverage: {
					only: [
						"sap/ui/vk/tools/CreateRectangleTool.js",
						"sap/ui/vk/tools/CreateRectangleToolGizmo.js",
						"sap/ui/vk/tools/CreateRectangleToolHandler.js",
						"sap/ui/vk/tools/CreateEllipseTool.js",
						"sap/ui/vk/tools/CreateEllipseToolGizmo.js",
						"sap/ui/vk/tools/CreateEllipseToolHandler.js",
						"sap/ui/vk/tools/CreatePathTool.js",
						"sap/ui/vk/tools/CreatePathToolGizmo.js",
						"sap/ui/vk/tools/CreatePathToolHandler.js",
						"sap/ui/vk/tools/CreateTextTool.js",
						"sap/ui/vk/tools/CreateTextToolGizmo.js",
						"sap/ui/vk/tools/CreateTextToolHandler.js",
						"sap/ui/vk/tools/TransformSvgElementTool.js",
						"sap/ui/vk/tools/TransformSvgElementToolGizmo.js",
						"sap/ui/vk/tools/TransformSvgElementToolHandler.js"
					]
				}
			},
			"Tools": {
				coverage: {
					only: [
						"sap/ui/vk/tools/Tool.js",
						"sap/ui/vk/tools/Gizmo.js",
						"sap/ui/vk/tools/SceneOrientationTool",
						"sap/ui/vk/tools/TooltipTool"
					]
				}
			},
			"TransformationMatrix": {
				coverage: {
					only: [
						"sap/ui/vk/TransformationMatrix.js"
					]
				}
			},
			/**
			 * @deprecated since 1.120.0
			 */
			"VDSL": {},
			"ViewAndViewGroup": {
				coverage: {
					only: ["sap/ui/vk/View.js",
						"sap/ui/vk/ViewGroup.js"]
				}
			},
			"Viewer": {
				coverage: {
					only: ["sap/ui/vk/Viewer.js"]
				}
			},
			"ViewGallery": {
				coverage: {
					only: ["sap/ui/vk/ViewGallery.js"]
				}
			},
			/**
			 * @deprecated since 1.120.0
			 */
			"Viewport": {
				coverage: {
					only: ["sap/ui/vk/Viewport.js"]
				}
			},
			/**
			 * @deprecated since 1.120.0
			 */
			"ViewStateManager": {
				coverage: {
					only: ["sap/ui/vk/ViewStateManager.js"]
				}
			},
			"Highlight": {
				coverage: {
					only: ["sap/ui/vk/Highlight.js",
						"sap/ui/vk/threejs/HighlightPlayer.js"]
				}
			},
			"threejs.OutlineRenderer": {
				coverage: {
					only: ["sap/ui/vk/threejs/OutlineRenderer"]
				}
			},
			"threejs.Scene": {
				coverage: {
					only: ["sap/ui/vk/threejs/Scene"]
				}
			},
			"ContentConnector": {
				coverage: {
					only: ["sap/ui/vk/ContentConnector.js"]
				}
			},
			"threejs.ContentManager": {
				coverage: {
					only: ["sap/ui/vk/threejs/ContentManager"]
				}
			},
			"totara.SceneContext": {
				coverage: {
					only: ["sap/ui/vk/totara/SceneContext"]
				}
			},
			"PoiHelper": {
				coverage: {
					only: ["sap/ve/vk/threejs/PoiHelper"]
				}
			}
		}
	};
});
