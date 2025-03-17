/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides control sap.ui.vk.svg.MiniMap
sap.ui.define([
	"sap/ui/core/Control",
	"sap/ui/core/Element"
], function(
	Control,
	Element
) {
	"use strict";

	const MiniMap = Control.extend("sap.ui.vk.svg.MiniMap", /** @lends sap.ui.vk.svg.MiniMap.prototype */ {
		metadata: {
			library: "sap.ui.vk",
			properties: {
				/**
				 * The maximum width of the viewport map.
				 */
				maxWidth: {
					type: "int",
					defaultValue: "320" // 320px is the minimum width of the map due to the "min-width" CSS rule in .sapMDialog
				},
				/**
				 * The maximum height of the viewport map.
				 */
				maxHeight: {
					type: "int",
					defaultValue: "320"
				}
			},

			associations: {
				viewport: {
					type: "sap.ui.vk.svg.Viewport",
					multiple: false
				},
				viewStateManager: {
					type: "sap.ui.vk.ViewStateManagerBase",
					multiple: false
				}
			},

			events: {
				sizeChanged: {
					parameters: {
						width: { type: "int" },
						height: { type: "int" }
					}
				}
			}
		},

		renderer: {
			apiVersion: 2,
			render: function(rm, miniMap) {
				rm.openStart("div", miniMap);
				rm.class("sapUiVkMiniMapView");
				rm.openEnd();
				rm.close("div");
			}
		}
	});

	MiniMap.prototype.init = function() {
		Control.prototype.init.call(this);

		this._sceneBBox = null; // [x, y, width, height]
		this._width = this._height = 0;

		this._canvas = document.createElement("canvas");
		this._canvas.classList.add("sapUiVkMiniMapViewCanvas");

		this._rect = document.createElement("div");
		this._rect.classList.add("sapUiVkMiniMapViewAreaRect");

		this.attachBrowserEvent(sap.ui.Device.browser.firefox ? "DOMMouseScroll" : "mousewheel", this._onMouseWheel, this);
	};

	MiniMap.prototype.exit = function() {
		this.setViewport(null);
		this.setViewStateManager(null);
	};

	MiniMap.prototype.setViewport = function(viewport) {
		const prevViewport = Element.getElementById(this.getViewport());
		prevViewport?.detachResize(this._updateRectPosition, this);
		prevViewport?.detachCameraChanged(this._updateRectPosition, this);
		this.setAssociation("viewport", viewport);
		viewport?.attachCameraChanged(this._updateRectPosition, this);
		viewport?.attachResize(this._updateRectPosition, this);
	};

	MiniMap.prototype.setViewStateManager = function(viewStateManager) {
		const prevViewStateManager = Element.getElementById(this.getViewStateManager());
		prevViewStateManager?.detachVisibilityChanged(this._onContentUpdate, this);
		prevViewStateManager?.detachTintColorChanged(this._onContentUpdate, this);
		this.setAssociation("viewStateManager", viewStateManager);
		viewStateManager?.attachVisibilityChanged(this._onContentUpdate, this);
		viewStateManager?.attachTintColorChanged(this._onContentUpdate, this);
	};

	MiniMap.prototype._updateRectPosition = function() {
		const viewport = Element.getElementById(this.getViewport());
		const sceneBBox = this._sceneBBox;
		if (!viewport || !sceneBBox) {
			return;
		}

		const viewBox = viewport._getViewBox();
		const sx = this._width / sceneBBox[2];
		const sy = this._height / sceneBBox[3];
		const x = (viewBox[0] - sceneBBox[0]) * sx;
		const y = (viewBox[1] - sceneBBox[1]) * sy;
		this._rect.style.left = x + "px";
		this._rect.style.top = y + "px";
		this._rect.style.width = viewBox[2] * sx + "px";
		this._rect.style.height = viewBox[3] * sy + "px";
	};

	MiniMap.prototype._onMouseWheel = function(event) {
		const viewport = Element.getElementById(this.getViewport());
		if (!viewport) {
			return;
		}

		const rect = this.getDomRef().getBoundingClientRect();
		const x = event.pageX - rect.x;
		const y = event.pageY - rect.y;
		if (x < 0 || x >= this._width || y < 0 || y >= this._height) {
			return;
		}

		let scroll = event.originalEvent.detail ? event.originalEvent.detail * -40 : event.originalEvent.wheelDelta;
		if (!event.originalEvent.touches) { // pinch to zoom (no touches) have a scroll value of +120 or -120 and should be significantly reduced
			scroll = Math.min(Math.max(scroll, -20), 20);
		}
		viewport.beginGesture(viewport._width * 0.5, viewport._height * 0.5);
		viewport.zoom(Math.pow(2, scroll / 960)); // 960px scales twice
		event.setMarked();
		event.preventDefault();
	};

	MiniMap.prototype.ontouchstart = function(event) {
		const viewport = Element.getElementById(this.getViewport());
		const sceneBBox = this._sceneBBox;
		if (!viewport || !sceneBBox) {
			return;
		}

		const onMouseMove = (event) => {
			const rect = this.getDomRef().getBoundingClientRect();
			const viewBox = viewport._getViewBox();
			const x = event.pageX - rect.x;
			const y = event.pageY - rect.y;
			const dx = (viewBox[0] + viewBox[2] * 0.5 - sceneBBox[0]) - (x * sceneBBox[2] / this._width);
			const dy = (viewBox[1] + viewBox[3] * 0.5 - sceneBBox[1]) - (y * sceneBBox[3] / this._height);
			if (dx !== 0 || dy !== 0) {
				const camera = viewport.getCamera();
				viewport.pan(dx * camera.zoom, dy * camera.zoom);
			}

			event.setMarked();
			event.preventDefault();
		};

		onMouseMove(event);

		// ontouchmove and ontouchend are not fired when the touch is outside the MiniMap, so we have to use document events for dragging
		const $document = jQuery(document);
		const onMouseUp = (event) => {
			$document.off("mousemove", onMouseMove);
			$document.off("mouseup", onMouseUp);
		};
		$document.on("mousemove", onMouseMove);
		$document.on("mouseup", onMouseUp);
	};

	MiniMap.prototype._onContentUpdate = function() {
		const viewport = Element.getElementById(this.getViewport());
		const svgElement = viewport?._svgElement;
		const domRef = this.getDomRef();
		if (!svgElement || !domRef) {
			return;
		}

		const bbox = svgElement.getBBox();
		let sceneBBox = this._sceneBBox;
		if (!sceneBBox || !sceneBBox[2] || !sceneBBox[3]) { // initialize the scene bounding box
			sceneBBox = this._sceneBBox = [bbox.x, bbox.y, bbox.width, bbox.height];
		} else { // expand the scene bounding box
			sceneBBox[2] = Math.max(sceneBBox[0] + sceneBBox[2], bbox.x + bbox.width);
			sceneBBox[3] = Math.max(sceneBBox[1] + sceneBBox[3], bbox.y + bbox.height);
			sceneBBox[0] = Math.min(sceneBBox[0], bbox.x);
			sceneBBox[1] = Math.min(sceneBBox[1], bbox.y);
			sceneBBox[2] -= sceneBBox[0];
			sceneBBox[3] -= sceneBBox[1];
		}
		const aspect = sceneBBox[2] > 0 && sceneBBox[3] > 0 ? sceneBBox[2] / sceneBBox[3] : 1;
		const maxWidth = this.getMaxWidth();
		const maxHeight = this.getMaxHeight();
		const width = this._width = Math.min(maxWidth, Math.round(maxWidth * aspect));
		const height = this._height = Math.min(maxHeight, Math.round(maxHeight / aspect));
		domRef.style.width = width + "px";
		domRef.style.height = height + "px";
		this.fireSizeChanged({ width, height });

		this._updateRectPosition();

		// update the canvas content
		const svgElementWidth = svgElement.getAttribute("width");
		const svgElementHeight = svgElement.getAttribute("height");
		const svgElementViewBox = svgElement.getAttribute("viewBox");
		svgElement.setAttribute("width", width + "px");
		svgElement.setAttribute("height", height + "px");
		svgElement.setAttribute("viewBox", sceneBBox.join(" "));

		// get SVG data from DOM and format it as data source
		const svgContent = new XMLSerializer().serializeToString(svgElement);
		const data = "data:image/svg+xml; charset=utf8, " + encodeURIComponent(svgContent);

		// restore the original values
		svgElement.setAttribute("width", svgElementWidth);
		svgElement.setAttribute("height", svgElementHeight);
		svgElement.setAttribute("viewBox", svgElementViewBox);

		const canvas = this._canvas;
		const devicePixelRatio = window.devicePixelRatio || 1;
		canvas.width = width * devicePixelRatio;
		canvas.height = height * devicePixelRatio;

		const vectorImage = new Image();
		vectorImage.viewBox = sceneBBox;
		vectorImage.src = data;
		vectorImage.onload = function() {
			const ctx = canvas.getContext("2d");

			// ctx.clearRect(0, 0, canvas.width, canvas.height);
			const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
			gradient.addColorStop(0, viewport.getBackgroundColorTop());
			gradient.addColorStop(1, viewport.getBackgroundColorBottom());
			ctx.fillStyle = gradient;
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			ctx.drawImage(vectorImage, 0, 0, canvas.width, canvas.height);
		};
	};

	MiniMap.prototype.onAfterRendering = function() {
		const domRef = this.getDomRef();
		domRef.appendChild(this._canvas);
		domRef.appendChild(this._rect);
		this._onContentUpdate();
	};

	return MiniMap;
});
