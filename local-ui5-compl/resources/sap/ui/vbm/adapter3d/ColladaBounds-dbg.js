/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2012 SAP AG. All rights reserved
 */

// Provides class sap.ui.vbm.adapter3d.DragDropHandler
sap.ui.define([
	"sap/ui/base/Object",
	"./Utilities",
	"./thirdparty/three",
	"sap/base/Log"
], function (BaseObject, Utilities, THREE, Log) {
	"use strict";

	var instances = {}, objects = {};
	var count = 0;

	/**
		 * Constructor for a new ColladaBounds.
		 *
		 * @class
		 * Provides a class for creating Bounding Box for Collada Objects.
		 *
		 * @private
		 * @author SAP SE
		 * @version 1.132.0
		 * @alias sap.ui.vbm.adapter3d.ColladaBounds
		 */
	var ColladaBounds = BaseObject.extend("sap.ui.vbm.adapter3d.ColladaBounds", /** @lends sap.ui.vbm.adapter3d.ColladaBounds.prototype */ {

		constructor: function (adapter) {
			BaseObject.call(this);

			this._adapter = adapter;                             // fire submit event
			this._context = adapter._context;                    // access evaluated data
			this._viewport = adapter._viewport;                  // events
			this._root = this._viewport._root;
			this._scene = this._viewport._scene;
			this._camera = this._viewport._camera;
			this._cameraControls = this._viewport._cameraController; 
			this._bbox = new THREE.Box3();
			this._colladaBoundingBoxes = [];
			this._adapter._colladaBoundingBoxMesh = [];

		}

	});


	ColladaBounds.prototype.initialize = function () {
		var that = this;
		this._scene._cm.forEach(function (array, key) {
			for (var i = 0; i < array.length; i++) {
				var a = array[i];
				instances = Array.from(a.instances);
				objects = Array.from(a.objects3D);
				count = a.hitInfo[0].matrices.length;
				that.transform(instances, objects, count);
			}
		});
	};

	ColladaBounds.prototype.transform = function (instances, objects, count) {
		var i, j, id;
		var _matrix = new THREE.Matrix4();

		for (j = 0; j < instances.length; j++) {
			for (i = 0; i < objects.length; i++) {
				var object = objects[i];
				var geometry = object.geometry;
				object.updateMatrixWorld(false, false);
				if (object.visible && geometry) {
					if (!geometry.boundingBox) {
						geometry.computeBoundingBox();
					}
					// if instanced mesh -> take all instances into account
					if (object.isInstancedMesh) {
						geometry = object.geometry.clone();
						object.getMatrixAt(j, _matrix);
						id = instances[j].instance;
						geometry.applyMatrix4(_matrix);
						this.createBBoxMeshes(geometry, object, count, id);
					}
				}
			}
		}
	};

	ColladaBounds.prototype.createBBoxMeshes = function (geometry, object, count, id) {
		if (id["VB:c"] == "true" && object.userData._sapInstance != undefined) {
			var _sapInstance = id;
			var material = new THREE.MeshBasicMaterial({ color: 0x808080, transparent: true, wireframe: true, opacity: 1, visible: false });

			// Create the mesh using the geometry and material
			var boundingBoxMesh = new THREE.Mesh(geometry, material);
			var world = this._root.matrixWorld.clone();
			boundingBoxMesh.applyMatrix4(world);
			boundingBoxMesh.scale.set(1, 1, 1);
			boundingBoxMesh.rotation.set(0, 0, 0);
			boundingBoxMesh.updateMatrixWorld();
			boundingBoxMesh.userData = { name: "ColladaBounds", _sapInstance: _sapInstance, id: _sapInstance.id, count: count };
			this._adapter._colladaBoundingBoxMesh.push(boundingBoxMesh);
			// Add the bounding box mesh to the scene
			this._scene.add(boundingBoxMesh);

		}
	};

	ColladaBounds.prototype._destroy = function () {
		this._adapter = null;                             // fire submit event
		this._context = null;                    // access evaluated data
		this._viewport = null;                  // events
		this._root = null;
		this._scene = null;
		this._camera = null;
		this._cameraControls =null;
		this._bbox = null;
		this._colladaBoundingBoxes = null;
		this._adapter._colladaBoundingBoxMesh = null;
	};

	return ColladaBounds;
})

