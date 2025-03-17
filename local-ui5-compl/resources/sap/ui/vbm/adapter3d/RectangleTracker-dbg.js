sap.ui.define([
	"sap/ui/base/Object",
	"./thirdparty/three"
], function (BaseObject, THREE) {
	"use strict";

	var Vector2 = THREE.Vector2;
	var _frustum = new THREE.Frustum;
	var _center = new THREE.Vector3;
	var _tmpPoint = new THREE.Vector3;
	var _vecNear = new THREE.Vector3;
	var _vecTopLeft = new THREE.Vector3;
	var _vecTopRight = new THREE.Vector3;
	var _vecDownRight = new THREE.Vector3;
	var _vecDownLeft = new THREE.Vector3;
	var _vectemp1 = new THREE.Vector3;
	var _vectemp2 = new THREE.Vector3;
	var _vectemp3 = new THREE.Vector3;
	var _vectemp4 = new THREE.Vector3;
	var startPoint = new THREE.Vector3;
	var endPoint = new THREE.Vector3;
	var _raycaster = new THREE.Raycaster();
	var _pointer = new Vector2();

	var viewportEventDelegate = {
		onBeforeRendering: function (event) {
			this._unsubscribe();
		},
		onAfterRendering: function (event) {
			this._subscribe();
		}
	};


	/**
	 *
	 * @class
	
	 *
	 * @private
	 * @author SAP SE
	 * @version 1.132.0
	 * @alias sap.ui.vbm.adapter3d.RectangleTracker
	 */
	var RectangleTracker = BaseObject.extend("sap.ui.vbm.adapter3d.RectangleTracker", /** @lends sap.ui.vbm.adapter3d.RectangleTracker.prototype */ {
		constructor: function (adapter) {
			BaseObject.call(this);
			this._adapter = adapter;
			this._context = adapter._context;
			this._viewport = adapter._viewport;
			this._root = this._viewport._root;
			this._scene = this._viewport._scene;
			this._camera = this._viewport._camera;
			this._cameraControls = this._viewport._cameraController;
			this._selected = new Set();
			this._renderer = this._renderer;
			this.init();
			var helper = new THREE.CameraHelper(this._camera);
			helper.geometry.setDrawRange(0, 0);
			this._addToScene(helper, this._scene, true, 1);
			this._snapBox = new THREE.BoxHelper(undefined, 0x00ffff);
			// invisible, layer #1 (disable hit test)
			this._addToScene(this._snapBox, this._scene, false, 1);

		}


	});

	RectangleTracker.prototype.init = function () {
		this._mouseDown = false;
		var element1 = document.createElement("div");
		element1.classList.add("selectBox");
		this._element = element1;
		this._element.style.pointerEvents = 'none';
		this._renderer = this._viewport._renderer;
		this._startPoint = new Vector2();
		this.pointTopLeft = new Vector2();
		this.pointBottomRight = new Vector2();
		this.deep = 50;
		this.instances = [];

	};

	RectangleTracker.prototype._getXY = function (event) {
		var rect = this._viewport.getDomRef().getBoundingClientRect();
		return {
			x: (event.pageX || event.originalEvent.pageX) - window.pageXOffset - rect.left,
			y: (event.pageY || event.originalEvent.pageY) - window.pageYOffset - rect.top
		};
	};

	RectangleTracker.prototype._updatePointer = function (event, out) {
		var rect = this._viewport.getDomRef().getBoundingClientRect();
		out.x = (event.cursor ? event.cursor.x : event.pageX - window.pageXOffset - rect.left) / rect.width * 2 - 1;
		out.y = -(event.cursor ? event.cursor.y : event.pageY - window.pageYOffset - rect.top) / rect.height * 2 + 1;
		return out;
	};



	RectangleTracker.prototype._addListener = function (source, event, handler) {
		var proxy1 = handler.bind(this);
		this[event + "Proxy"] = proxy1;
		source.addEventListener(event, proxy1);
	};

	RectangleTracker.prototype._removeListener = function (source, event) {
		source.removeEventListener(event, this[event + "Proxy"]);
		delete this[event + "Proxy"];
	};

	RectangleTracker.prototype._subscribe = function () {
		var ref = this._viewport.getDomRef();
		if (ref) {
			this._dom = ref;
			this._addListener(ref, "pointerup", this._onPointerCancel);
			this._addListener(ref, "pointerdown", this._onPointerDown);
			this._addListener(ref, "pointermove", this._onPointerMove);
			this._addListener(ref, "pointerleave", this._onPointerCancel);
		}
	};

	RectangleTracker.prototype._unsubscribe = function () {
		var ref = this._viewport.getDomRef();
		if (ref) {
			this._dom = null;
			this._removeListener(ref, "pointerup");
			this._removeListener(ref, "pointerdown");
			this._removeListener(ref, "pointermove");
			this._removeListener(ref, "pointerleave");
		}
		this._removeListener(this._cameraControls, "change");
	};

	RectangleTracker.prototype._addToScene = function (obj, parent, visible, layer, order) {
		if (visible !== undefined) {
			obj.visible = visible;
		}
		if (layer !== undefined) {
			obj.layers.set(layer);
		}
		if (order !== undefined) {
			obj.renderOrder = order;
		}
		parent.add(obj);
		obj.matrixAutoUpdate = false;
	};

	RectangleTracker.prototype._onPointerDown = function (event) {
		this._updateController(true);
		this.onSelectStart(event);
		var that = this;
		event.cursor = event.cursor || this._getXY(event);
		this._mouseDown = true;
		var rect = this._viewport.getDomRef().getBoundingClientRect();
		startPoint.x = (event.cursor.x / rect.width) * 2 - 1;
		startPoint.y = -(event.cursor.y / rect.height) * 2 + 1;
		var dataMap = new Map();
		var dataType;
		var keyAlias;
		if (!event.ctrlKey) {
			this._selected.forEach(function (item) {
				if (item.type != 'InstancedMesh' || item.type != 'PlaneGeometry') {
					var obj = {};
					if (item._sapInstance != undefined) {
						var val = item._sapInstance;
						item._sapInstance["VB:s"] = "false";
						that._adapter._sceneBuilder.updateHotInstance(val);
					    dataType = item._sapInstance.voGroup.datasource; // VO group data source linked to a DataType by name
						keyAlias = that._adapter._parser.getAttributeAlias(dataType, item._sapInstance.voGroup.keyAttributeName);
						obj[keyAlias] = item._sapInstance.id;
						obj["VB:s"] = "false";
					} else if (item.userData.name == "ColladaBounds") {
						if (item.userData._sapInstance["VB:s"] == "true") {
							var instance = item.userData._sapInstance;
							var selectionChanges = that._adapter._changeSelection(instance, "toggle", false);
							that._adapter._sceneBuilder.updateSelection(selectionChanges.selected, selectionChanges.deselected);
							dataType = item.userData._sapInstance.voGroup.datasource; // VO group data source linked to a DataType by name
							keyAlias = that._adapter._parser.getAttributeAlias(dataType, item.userData._sapInstance.voGroup.keyAttributeName);
							obj[keyAlias] = item.userData.id;
							obj["VB:s"] = "false";
						}
					}
					
					var existingData = dataMap.get(dataType);
					if (existingData != undefined ) {
						// Check if there's already an entry for this dataType
						var existingEntry = existingData.find(function (entry) {
							return entry.name === dataType;
						});

						if (existingEntry) {
							// If an entry exists for this dataType, push the new object to its E array if it's not already present
							var existingObject = existingEntry.E.find(function (e) {
								if (item._sapInstance != undefined)
								  return e[keyAlias] ===  item._sapInstance.id
								else
								  return e[keyAlias] ===   item.userData.id;
							});
							if (!existingObject  && JSON.stringify(obj) !== '{}' ) {
								// If the object doesn't exist, push it to the E array
								existingEntry.E.push(obj);
							}
						}
					} else {
						// If no data exists for this dataType, create a new array and add the object
						dataMap.set(dataType, [{
							name: dataType,
							E: [obj]
						}]);
					}
				}
			});
			
			if (dataMap != undefined) {
				var payload = that._constructPayload(dataMap);
				if (payload.Data.Merge.N.length > 0) {
					this._adapter.fireSubmit({
						data: JSON.stringify(payload)
					});
				}
			}
		}

		this._selected.clear();
	};

	RectangleTracker.prototype._onPointerMove = function (event) {
		event.preventDefault();

		if (!this._mouseDown) {
			this._updatePointer(event, _pointer);
			this._handleHover(_pointer);
		}

		if (this._mouseDown) {
			this._updateController(false);
			this.onSelectMove(event);
			var that = this;
			event.cursor = event.cursor || this._getXY(event);
			var rect = this._viewport.getDomRef().getBoundingClientRect();
			endPoint.x = (event.cursor.x / rect.width) * 2 - 1;
			endPoint.y = -(event.cursor.y / rect.height) * 2 + 1;
			endPoint.z = 0.5
			var isSelected = this.selecting(_frustum);
			var dataMap = new Map();
			var dataType;
			var keyAlias;
			var obj = {};
			if (isSelected.length > 0) {
				for (var i = 0; i < isSelected.length; i++) {
					this._selected.add(isSelected[i]);
				}
			}
			this._selected.forEach(function (item) {
			    obj = {};
				if (item.type != 'InstancedMesh' || item.type != 'PlaneGeometry') {
					if (item._sapInstance != undefined) {
						var val = item._sapInstance;
						item._sapInstance["VB:s"] = "true";
						that._adapter._sceneBuilder.updateHotInstance(val);
						dataType = item._sapInstance.voGroup.datasource; // VO group data source linked to a DataType by name
						keyAlias = that._adapter._parser.getAttributeAlias(dataType, item._sapInstance.voGroup.keyAttributeName);
						obj[keyAlias] = item._sapInstance.id;
						obj["VB:s"] = "true";
						// that._adapter._handleHover(val);	
					} else if (item.userData.name == "ColladaBounds") {
						var id = item.userData.id;
						var meshCount = item.userData.count;
						var count = 0;
						that._selected.forEach(function (itemA) {
							if (itemA.userData.id == id)
								count++;
						});
						if (count == meshCount) {
							var instance = item.userData._sapInstance;
							var selectionChanges = that._adapter._changeSelection(instance, "select", false);
							that._adapter._sceneBuilder.updateSelection(selectionChanges.selected, selectionChanges.deselected);
							dataType = item.userData._sapInstance.voGroup.datasource; // VO group data source linked to a DataType by name
							keyAlias = that._adapter._parser.getAttributeAlias(dataType, item.userData._sapInstance.voGroup.keyAttributeName);
							obj[keyAlias] = item.userData.id;
							obj["VB:s"] = "true";
						}
					}


					var existingData = dataMap.get(dataType);
					if (existingData != undefined) {
						// Check if there's already an entry for this dataType
						var existingEntry = existingData.find(function (entry) {
							return entry.name === dataType;
						});
						if (existingEntry) {
							// If an entry exists for this dataType, push the new object to its E array if it's not already present
							var existingObject = existingEntry.E.find(function (e) {
								if (item._sapInstance != undefined)
									return e[keyAlias] === item._sapInstance.id
								else
									return e[keyAlias] === item.userData.id;
							});
							if (!existingObject && JSON.stringify(obj) !== '{}') {
								// If the object doesn't exist, push it to the E array
								existingEntry.E.push(obj);
							}
						}
					} else {
						// If no data exists for this dataType, create a new array and add the object
						dataMap.set(dataType, [{
							name: dataType,
							E: [obj]
						}]);
					}
				
				}
			});

		}
		if (dataMap != undefined) {
			var payload = that._constructPayload(dataMap);
			if (payload.Data.Merge.N.length > 0) {
				this._adapter.fireSubmit({
					data: JSON.stringify(payload)
				});
			}
		}

	};

	RectangleTracker.prototype._constructPayload = function (dataMap) {
		var payload = {
			version: "2.0",
			"xmlns:VB": "VB",
			Data: {
				Merge: {
					N: []
				}
			}
		};

		payload.Data.Merge.N = [];

		// Populate payload with data from dataMap
		dataMap.forEach(function (data) {
			data.forEach(function (entry) {
				payload.Data.Merge.N.push(entry);
			});
		});

		return payload;
	};

	RectangleTracker.prototype._onPointerCancel = function (event) {
		event.preventDefault();
		this._mouseDown = false;
		this._dom.style.cursor = this._hovered ? "pointer" : "auto";
		this._updateController(true);
		this.onSelectOver();
	};

	RectangleTracker.prototype.onSelectStart = function (event) {

		this._element.style.display = 'none';
		this._renderer.domElement.parentElement.appendChild(this._element);
		this._element.style.left = event.clientX + 'px';
		this._element.style.top = event.clientY + 'px';
		this._element.style.width = '0px';
		this._element.style.height = '0px';
		this._startPoint.x = event.clientX;
		this._startPoint.y = event.clientY;

	}

	RectangleTracker.prototype.onSelectMove = function (event) {

		this._element.style.display = 'block';
		this.pointBottomRight.x = Math.max(this._startPoint.x, event.clientX);
		this.pointBottomRight.y = Math.max(this._startPoint.y, event.clientY);
		this.pointTopLeft.x = Math.min(this._startPoint.x, event.clientX);
		this.pointTopLeft.y = Math.min(this._startPoint.y, event.clientY);
		this._element.style.left = this.pointTopLeft.x + 'px';
		this._element.style.top = this.pointTopLeft.y + 'px';
		this._element.style.width = (this.pointBottomRight.x - this.pointTopLeft.x) + 'px';
		this._element.style.height = (this.pointBottomRight.y - this.pointTopLeft.y) + 'px';


	}

	RectangleTracker.prototype.onSelectOver = function (event) {
		var center = new THREE.Vector3(((this.pointBottomRight.x + this.pointTopLeft.x) / 2), ((this.pointBottomRight.y + this.pointTopLeft.y) / 2), 0);
		this._centerOfBox = center;
		var size = new THREE.Vector3(this.pointBottomRight.x - this.pointTopLeft.x) * (this.pointBottomRight.y - this.pointTopLeft.y);
		this._size = size;
		var distance = Math.max(size.x, size.y, size.z) * 2;
		this._distance = distance;
		if (this._element && this._element.parentElement)
			this._element.parentElement.removeChild(this._element);
	}


	RectangleTracker.prototype._updateController = function (value) {
		if (value) {
			this._cameraControls.enableRotate = true;
			this._mouseDown = false;
		} else {
			this._cameraControls.enableRotate = false;
			this._mouseDown = true;
		}
	}

	RectangleTracker.prototype.selecting = function (_frustum) {
		this.startPoint = startPoint || this.startPoint;
		this.endPoint = endPoint || this.endPoint;
		this.collection = [];
		this.updateFrustum(this.startPoint, this.endPoint);
		this.searchChildInFrustum(_frustum, this._scene);
		this._scene.remove(this._planeMesh);
		return this.collection;
	}

	RectangleTracker.prototype.updateFrustum = function (startPoint, endPoint) {
		startPoint = startPoint || this.startPoint;
		endPoint = endPoint || this.endPoint;


		// Avoid invalid frustum

		if (startPoint.x === endPoint.x) {

			endPoint.x += Number.EPSILON;

		}

		if (startPoint.y === endPoint.y) {

			endPoint.y += Number.EPSILON;

		}

		if (this._camera.isPerspectiveCamera) {

			_tmpPoint = startPoint;
			_tmpPoint.x = Math.min(startPoint.x, endPoint.x);
			_tmpPoint.y = Math.max(startPoint.y, endPoint.y);
			endPoint.x = Math.max(startPoint.x, endPoint.x);
			endPoint.y = Math.min(startPoint.y, endPoint.y);

			_vecNear.setFromMatrixPosition(this._camera.matrixWorld);
			_vecTopLeft.copy(_tmpPoint);
			_vecTopRight.set(endPoint.x, _tmpPoint.y, 0);
			_vecDownRight.copy(endPoint);
			_vecDownLeft.set(_tmpPoint.x, endPoint.y, 0);

			_vecTopLeft.unproject(this._camera);
			_vecTopRight.unproject(this._camera);
			_vecDownRight.unproject(this._camera);
			_vecDownLeft.unproject(this._camera);

			_vectemp1.copy(_vecTopLeft).sub(_vecNear);
			_vectemp2.copy(_vecTopRight).sub(_vecNear);
			_vectemp3.copy(_vecDownRight).sub(_vecNear);
			_vectemp1.normalize();
			_vectemp2.normalize();
			_vectemp3.normalize();


			_vectemp1.multiplyScalar(this.deep);
			_vectemp2.multiplyScalar(this.deep);
			_vectemp3.multiplyScalar(this.deep);
			_vectemp4.multiplyScalar(this.deep);
			_vectemp1.sub(_vecNear);
			_vectemp2.sub(_vecNear);
			_vectemp3.sub(_vecNear);

			var planes = _frustum.planes;

			planes[0].setFromCoplanarPoints(_vecNear, _vecTopLeft, _vecTopRight);
			planes[1].setFromCoplanarPoints(_vecNear, _vecTopRight, _vecDownRight);
			planes[2].setFromCoplanarPoints(_vecDownRight, _vecDownLeft, _vecNear);
			planes[3].setFromCoplanarPoints(_vecDownLeft, _vecTopLeft, _vecNear);
			planes[4].setFromCoplanarPoints(_vecTopRight, _vecDownRight, _vecDownLeft);
			planes[5].setFromCoplanarPoints(_vectemp3, _vectemp2, _vectemp1);
			planes[5].normal.multiplyScalar(-1);
		}


	}

	RectangleTracker.prototype.searchChildInFrustum = function (frustum, object) {
		var count = 0;
		if (object._sapInstance != undefined && !object.geomtry) {
			var box1 = new THREE.BoxHelper(object, 0x000000);
			var vertices = box1.geometry.attributes.position.array;
			for (var i = 0, l = vertices.length; i < l; i += 3) {
				_center.set(vertices[i], vertices[i + 1], vertices[i + 2]);
				if (frustum.containsPoint(_center)) {
					count++;
				}
			}
			if (count === vertices.length / 3) {
				this.collection.push(object);
			}
		} else if (object.userData.name == "ColladaBounds") {
			var box1 = new THREE.BoxHelper(object, 0x000000);
			var vertices = box1.geometry.attributes.position.array;
			for (var i = 0, l = vertices.length; i < l; i += 3) {
				_center.set(vertices[i], vertices[i + 1], vertices[i + 2]);
				if (frustum.containsPoint(_center)) {
					count++;
				}
			}
			if (count === vertices.length / 3) {
				this.collection.push(object);
			}
		}

		if (object.children.length > 0) {
			for (var x = 0; x < object.children.length; x++) {
				this.searchChildInFrustum(frustum, object.children[x]);
			}
		}
	};

	RectangleTracker.prototype._handleHover = function (pointer) {
		var intersections = [];
		var totalMesh = this._adapter._colladaBoundingBoxMesh;
		var that = this;
		_raycaster.layers.set(0);
		_raycaster.setFromCamera(pointer, this._camera);
		_raycaster.intersectObjects(this._adapter._colladaBoundingBoxMesh, false, intersections);
		if (intersections.length > 0) {
			for (var i = 0; i < intersections.length; i++) {
				this._hoverOff();
				var objA = intersections[i].object;
				if (objA.isMesh && objA.userData.name == "ColladaBounds") {
					var id = objA.userData.id;
					var count = objA.userData.count;
					if (count > 1) {
						totalMesh.forEach(function (value) {
							if (value.userData.id == id)
								that._hoverOn(value);
						});
					} else
						this._hoverOn(objA);
				}
			}
		} else {
			this._hoverOff();
		}

	};
	
	RectangleTracker.prototype._hoverOn = function (obj) {

		var snapBox = new THREE.BoxHelper(undefined, 0x00ffff);
		snapBox.setFromObject(obj);
		this._adapter._snapBox.push(snapBox);

		// invisible, layer #1 (disable hit test)
		this._addToScene(snapBox, this._scene, true, 1);
	};

	RectangleTracker.prototype._hoverOff = function () {
		var that = this;
		var snapBox = this._adapter._snapBox;
		if (snapBox != undefined)
			snapBox.forEach(function (value) {
				that._scene.remove(value);
			});
		this._adapter._snapBox = [];
	};


	RectangleTracker.prototype._createEvent = function () {
		this._viewport.addEventDelegate(viewportEventDelegate, this);
		this._subscribe();
	};

	RectangleTracker.prototype._destroy = function () {
		if (this._viewport) {
			this._viewport.removeEventDelegate(viewportEventDelegate);
			this._unsubscribe();
	
			// reset all
			this._adapter = null;
			this._context = null;
			this._viewport = null;
			this._root = null;
			this._scene = null;
			this._camera = null;
			this._cameraControls = null;
			this._raycaster = null;
			this._selected = null;
			this._renderer = null;
			this._element = null;
			this._snapBox = null;
			BaseObject.prototype.destroy.call(this);
		}


	};


	return RectangleTracker;
}
);
