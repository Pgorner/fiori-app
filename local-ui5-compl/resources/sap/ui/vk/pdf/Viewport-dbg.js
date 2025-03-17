/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

sap.ui.define([
	"sap/base/Log",
	"sap/ui/core/Element",
	"sap/ui/core/delegate/ScrollEnablement",
	"sap/ui/core/ResizeHandler",
	"../abgrToColor",
	"../cssColorToColor",
	"../Loco",
	"../SelectionMode",
	"../ViewportBase",
	"../svg/Element",
	"./ViewportRenderer",
	"./Utils"
], (
	Log,
	CoreElement,
	ScrollEnablement,
	ResizeHandler,
	abgrToColor,
	cssColorToColor,
	Loco,
	SelectionMode,
	ViewportBase,
	Element,
	ViewportRenderer,
	Utils
) => {
	"use strict";

	const NAMESPACE_SVG = "http://www.w3.org/2000/svg";

	const SCALE_DELTA = 1.1; // 10%
	const MIN_SCALE = 0.01;  // 1%
	const MAX_SCALE = 100;   // 10,000%

	const PIXELS_PER_ARROW_PAN = 10;

	const SCROLL_CONTAINER_ID_SUFFIX = "scrollContainer";
	const DOCUMENT_ID_SUFFIX = "document";
	const PAGE_ID_SUFFIX = "page";
	const PDF_CANVAS_ID_SUFFIX = "pdfCanvas";
	const PDF_STRETCHED_CANVAS_ID_SUFFIX = "pdfStretchedCanvas";
	const PDF_HIGH_RES_CANVAS_ID_SUFFIX = "pdfHighResCanvas";
	const HOTSPOT_SURFACE_ID_SUFFIX = "hotspotSurface";

	const STATE_EMPTY = 0;
	const STATE_NORMAL = 1;
	const STATE_STRETCHED = 2;

	/**
	 * Constructor for a new Viewport.
	 *
	 * @param {string} [sId] ID for the new Native Viewport control, generated automatically if no ID is given.
	 * @param {object} [mSettings] Initial settings for the new Native Viewport control.
	 *
	 * @class Enables displaying PDF content..
	 *
	 * @extends sap.ui.vk.ViewportBase
	 * @author SAP SE
	 * @version 1.132.0
	 * @constructor
	 * @public
	 * @alias sap.ui.vk.pdf.Viewport
	 * @since 1.123.0
	 */
	const Viewport = ViewportBase.extend("sap.ui.vk.pdf.Viewport", /** @lends sap.ui.vk.pdf.Viewport.prototype */ {
		metadata: {
			library: "sap.ui.vk",

			properties: {
				currentPageIndex: {
					type: "int",
					defaultValue: 0
				}
			},

			events: {
				pageChanged: {
					parameters: {
						newPageIndex: "int",
						oldPageIndex: "int"
					}
				},

				documentReplaced: {
					parameters: {
						oldDocument: "sap.ui.vk.pdf.Document",
						newDocument: "sap.ui.vk.pdf.Document"
					}
				}
			}
		},

		renderer: ViewportRenderer
	});

	const THIS_MODULE_NAME = Viewport.getMetadata().getName();

	Viewport.prototype.init = function() {
		ViewportBase.prototype.init?.call(this);

		this._document = null;
		this._page = null;
		this._scene = null;

		// A surface for rendering hotspots.
		const hotspotSurface = document.createElementNS(NAMESPACE_SVG, "svg");
		hotspotSurface.id = `${this.getId()}-${HOTSPOT_SURFACE_ID_SUFFIX}`;
		hotspotSurface.classList.add("sapVizKitPDFHotspotSurface");
		hotspotSurface.setAttribute("viewBox", "0 0 1 1");
		this._hotspotSurface = hotspotSurface;

		// The hotspot element that is currently hovered by the mouse pointer.
		this._currentHotspotElement = null;

		// A normal canvas for rendering when the longest page side is less than or equal to the longest screen side.
		this._normalCanvas = null;

		// A canvas for rendering when the longest page side is greater than the longest screen side. This canvas is
		// stretched using CSS when zooming makes the page larger than the screen.
		this._stretchedCanvas = null;

		// A canvas for rendering only the visible part of the page when the longest page side is greater than the
		// longest screen side. This canvas is used to avoid rendering the whole page when only a part of the page is
		// visible. The size of this canvas is the same as the size of the viewport.
		this._highResCanvas = null;

		this._renderTasks = [];

		// This flag is set to true when the content is replaced. Usually, the viewport is rendered when we switch
		// between pages. But when the content is replaced, we need to render the new content immediately.
		this._contentReplaced = false;

		this.attachBrowserEvent("wheel", this._onWheel, this);

		this._onScroll = this._onScroll.bind(this);
		this._onResize = this._onResize.bind(this);

		this._resizeListenerId = null;

		// The current scale of the PDF content.
		//
		// 1 means 100%. And 100% means that the size of the page on the screen equals the size of
		// the physical page. Of course, in most cases the size of the physical page is not the same
		// as the size of page on the screen, but it's the only approximation we can use. Many other
		// PDF viewers use the same approach.
		//
		// PDF units are in points, 1 point = 1/72 inch.
		//
		// We take into account that 1 inch = 96 CSS pixels. Also, we take into account the PDF user
		// unit, which are 1/72 inch.
		//
		// All page coordinates are in PDF user units. So, the formula for the effective scale is:
		//
		// `this._scale * pageUserUnit * 96 / 72`.
		this._scale = 1;

		this._scrolling = false;
		this._resizing = false;

		this._scrollContainer = new ScrollEnablement(
			this,
			`${this.getId()}-${DOCUMENT_ID_SUFFIX}`, // This is scrollable content.
			{
				horizontal: true,
				vertical: true,
				scrollContainerId: `${this.getId()}-${SCROLL_CONTAINER_ID_SUFFIX}` // This is the scroll container.
			}
		);

		this._pageNavigationEnabled = true;

		const loco = this._loco = new Loco(this);

		// WORKAROUND: The CreateXXXTool classes expect that the viewport has a camera object. We
		// don't need the camera object for PDF rendering, but we need to provide a dummy object to
		// avoid errors.
		this._camera = {
			zoom: this._scale,

			/**
			 * Converts the offset in pixels relative to the top left corner of the page DOM element
			 * to the SVG coordinates.
			 *
			 * NOTE: The method name is misleading.
			 *
			 * @param {number} screenX The offset in pixels from the top edge of the page DOM
			 *     element.
			 * @param {number} screenY The offset in pixels from the left edge of the page DOM
			 *     element.
			 * @returns {object} The SVG coordinates of the point.
			 */
			_screenToWorld: (screenX, screenY) => {
				const page = this._page;

				if (page == null) {
					return {
						x: 0,
						y: 0
					};
				}

				const { pageX, pageY, pageWidth, pageHeight } = page.rawDimensions;
				const { width, height } = this.getDomRef(PAGE_ID_SUFFIX).getBoundingClientRect();

				return {
					x: screenX / width * pageWidth + pageX,
					y: screenY / height * pageHeight + pageY
				};
			},

			/**
			 * Converts the SVG coordinates to the offset in pixels relative to the top left corner
			 * of the page DOM element.
			 *
			 * NOTE: The method name is misleading.
			 *
			 * @param {number} worldX The SVG x coordinate.
			 * @param {number} worldY The SVG y coordinate.
			 * @returns {object} The offset in pixels from the top left corner of the page DOM
			 *     element.
			 */
			_worldToScreen: (worldX, worldY) => {
				const page = this._page;

				if (page == null) {
					return {
						x: 0,
						y: 0
					};
				}

				const { pageX, pageY, pageWidth, pageHeight } = page.rawDimensions;
				const { width, height } = this.getDomRef(PAGE_ID_SUFFIX).getBoundingClientRect();

				return {
					x: (worldX - pageX) / pageWidth * width,
					y: (worldY - pageY) / pageHeight * height
				};
			},

			/**
			 * Converts the rectangle in pixel coordinates relative to the top left corner of the
			 * page DOM element to the SVG coordinates.
			 *
			 * @param {object} rect The rectangle in pixel coordinates relative to the top left
			 *     corner of the page DOM element.
			 * @param {number} rect.x1 The x coordinate of the top left corner of the rectangle.
			 * @param {number} rect.y1 The y coordinate of the top left corner of the rectangle.
			 * @param {number} rect.x2 The x coordinate of the bottom right corner of the rectangle.
			 * @param {number} rect.y2 The y coordinate of the bottom right corner of the rectangle.
			 * @returns {object} The rectangle in SVG coordinates.
			 */
			_transformRect: (rect) => {
				const page = this._page;

				if (page == null) {
					return {
						x1: 0,
						y1: 0,
						x2: 0,
						y2: 0
					};
				}

				const { x: x1, y: y1 } = this._camera._screenToWorld(rect.x1, rect.y1);
				const { x: x2, y: y2 } = this._camera._screenToWorld(rect.x2, rect.y2);

				return {
					x1: Math.min(x1, x2),
					y1: Math.min(y1, y2),
					x2: Math.max(x1, x2),
					y2: Math.max(y1, y2)
				};
			}
		};

		const gestureHandler = this._gestureHandler = {
			click: (locoEvent) => {
				if (this._document != null) {
					const { event } = locoEvent;
					const nodeRef = this.hitTest(event.clientX, event.clientY);
					const parameters = {
						picked: nodeRef ? [nodeRef] : []
					};

					// If there is an application subscribed to the event, it can change the
					// `parameters.picked` array, e.g. it can filter not some nodes and leave only hotspots.
					this.fireNodesPicked(parameters);

					if (this.getSelectionMode() === SelectionMode.Exclusive) {
						this.exclusiveSelectionHandler(parameters.picked);
					} else if (this.getSelectionMode() === SelectionMode.Sticky) {
						this.stickySelectionHandler(parameters.picked);
					}
				}
			},

			hover: (locoEvent) => {
				if (this._document != null && !this.getDisableHotspotHovering()) {
					const { event } = locoEvent;
					const currentHotspotElement = this._currentHotspotElement;
					const newHotspotElement = this.hitTest(event.clientX, event.clientY);

					if (newHotspotElement != currentHotspotElement) {
						// NOTE: If we highlight all hotspots, we don't need to change the color of the
						// hotspot under the mouse pointer.
						if (!this.getShowAllHotspots()) {
							currentHotspotElement?.setHotspotColor(1, null);
							newHotspotElement?.setHotspotColor(1, "#bb000059");
						}

						this._currentHotspotElement = newHotspotElement;
					}
				}
			}
		};

		loco.addHandler(gestureHandler);
	};

	Viewport.prototype.exit = function() {
		this._loco
			.removeHandler(this._gestureHandler)
			.destroy();
		this._loco = null;

		this._gestureHandler = null;

		this.detachBrowserEvent("wheel", this._onWheel, this);

		this._scrollContainer.destroy();
		this._scrollContainer = null;

		this._unsubscribeFromEvents();

		this._highResCanvas = null;
		this._stretchedCanvas = null;
		this._normalCanvas = null;

		this._hotspotSurface = null;
		this._currentHotspotElement = null;

		this._scene = null;
		this._page = null;
		this._document = null;

		ViewportBase.prototype.exit?.call(this);
	};

	Viewport.prototype.getIdForLabel = function() {
		return `${this.getId()}-${PAGE_ID_SUFFIX}`;
	};

	Viewport.prototype.getScrollDelegate = function() {
		return this._scrollContainer;
	};

	Viewport.prototype._subscribeToEvents = function() {
		this.$(SCROLL_CONTAINER_ID_SUFFIX).on("scroll", this._onScroll);
		this._resizeListenerId = ResizeHandler.register(this, this._onResize);
	};

	Viewport.prototype._unsubscribeFromEvents = function() {
		ResizeHandler.deregister(this._resizeListenerId);
		this._resizeListenerId = null;
		this.$(SCROLL_CONTAINER_ID_SUFFIX).off("scroll", this._onScroll);
	};

	Viewport.prototype.onSetContentConnector = function(contentConnector) {
		ViewportBase.prototype.onSetContentConnector.call(this, contentConnector);

		contentConnector.attachEvent("_contentUpdated", this._onContentUpdated, this);
	};

	Viewport.prototype.onUnsetContentConnector = function(contentConnector) {
		contentConnector.detachEvent("_contentUpdated", this._onContentUpdated, this);

		ViewportBase.prototype.onUnsetContentConnector.call(this, contentConnector);
	};

	/**
	 * Sets a PDF document obtained as content from the associated content connector.
	 *
	 * @param {sap.ui.vk.pdf.Document} newDocument New PDF document or <code>null</code>.
	 * @protected
	 * @override
	 * @since 1.123.0
	 */
	Viewport.prototype._setContent = function(newDocument) {
		ViewportBase.prototype._setContent.call(this, newDocument);

		const oldDocument = this._document;

		if (newDocument === oldDocument) {
			return;
		}

		this._document = newDocument;
		this._scene = newDocument?.scene;

		this._page = null;

		this._deleteHighResCanvas();
		this._deleteStretchedCanvas();
		this._deleteNormalCanvas();

		this._scale = this._camera.zoom = 1;

		this._currentHotspotElement = null;

		// TODO(PDF): Should we cancel the rendering tasks here?

		this.fireEvent("documentReplaced", { oldDocument, newDocument }, false, true);

		if (newDocument != null) {
			this._applyHotspotHoveringClass(this.getDisableHotspotHovering());
			this._applyShowAllHotspots(this.getShowAllHotspots());

			// NOTE: The following line will force the page rendering even if the new page index is
			// the same as the old page index.
			this._contentReplaced = true;
			this.setCurrentPageIndex(this.getCurrentPageIndex());
		}

		this.invalidate();
	};

	Viewport.prototype._onContentUpdated = function(event) {
		this._applyHotspotHoveringClass(this.getDisableHotspotHovering());
		this._applyShowAllHotspots(this.getShowAllHotspots());
	};

	Viewport.prototype._createNormalCanvas = function() {
		const canvas = document.createElement("canvas");
		canvas.id = `${this.getId()}-${PDF_CANVAS_ID_SUFFIX}`;
		canvas.classList.add("sapVizKitPDFNormalCanvas");

		return canvas;
	};

	Viewport.prototype._createStretchedCanvas = function() {
		const canvas = document.createElement("canvas");
		canvas.id = `${this.getId()}-${PDF_STRETCHED_CANVAS_ID_SUFFIX}`;
		canvas.classList.add("sapVizKitPDFStretchedCanvas");

		return canvas;
	};

	Viewport.prototype._createHighResCanvas = function() {
		const canvas = document.createElement("canvas");
		canvas.id = `${this.getId()}-${PDF_HIGH_RES_CANVAS_ID_SUFFIX}`;
		canvas.classList.add("sapVizKitPDFHighResCanvas");

		return canvas;
	};

	Viewport.prototype._deleteNormalCanvas = function() {
		this._normalCanvas?.remove();
		this._normalCanvas = null;
	};

	Viewport.prototype._deleteStretchedCanvas = function() {
		this._stretchedCanvas?.remove();
		this._stretchedCanvas = null;
	};

	Viewport.prototype._deleteHighResCanvas = function() {
		this._highResCanvas?.remove();
		this._highResCanvas = null;
	};

	Viewport.prototype._layoutPage = function({
		page,
		scale = this._scale,
		firstTimePageRendering = false,
		zoomCenter = null
	}) {
		const pageDomRef = this.getDomRef(PAGE_ID_SUFFIX);
		if (pageDomRef == null) {
			return null;
		}

		const canvases = {};

		// The size of the page in CSS and device pixels with the provided scale factor.
		// const { cssWidth, cssHeight, width, height } = this._calculatePDFCanvasSize(page, scale);
		const {
			cssWidth: newCSSWidth,
			cssHeight: newCSSHeight,
			width: newWidth,
			height: newHeight
		} = this._calculatePDFCanvasSize(page, scale);

		// NOTE: Modern browsers support quite large canvas sizes, always exceeding the screen
		// size. See https://jhildenbiddle.github.io/canvas-size/#/?id=test-results. So we can
		// safely assume that the canvas size can be at least the size of the screen.
		const longestScreenSide = Math.max(screen.width, screen.height);
		const highResCanvasNeeded = newCSSWidth > longestScreenSide || newCSSHeight > longestScreenSide;

		// eslint-disable-next-line no-nested-ternary
		const oldState = this._normalCanvas != null
			? STATE_NORMAL
			: this._stretchedCanvas != null
				? STATE_STRETCHED
				: STATE_EMPTY;
		const newState = highResCanvasNeeded ? STATE_STRETCHED : STATE_NORMAL;

		const scrollContainerDomRef = this.getDomRef(SCROLL_CONTAINER_ID_SUFFIX);

		// For different calculations we need to know the page DOM element size. If there is no page
		// DOM element yet, we need to create a fake one.
		if (oldState === STATE_EMPTY) {
			const fakeCanvas = this._createNormalCanvas();

			const { style } = fakeCanvas;
			style.width = `${newCSSWidth}px`;
			style.height = `${newCSSHeight}px`;

			this._normalCanvas = fakeCanvas;
			pageDomRef.appendChild(fakeCanvas);

			// Now `pageDomRef.getBoundingClientRect()` should return the correct size of the page.
		}

		if (newState === STATE_NORMAL) {
			const canvas = this._createNormalCanvas();
			canvas.width = newWidth;
			canvas.height = newHeight;

			const { style } = canvas;
			style.width = `${newCSSWidth}px`;
			style.height = `${newCSSHeight}px`;

			canvases.normal = {
				canvas,
				scale
			};
		} else if (oldState !== STATE_STRETCHED || firstTimePageRendering) {
			// We need to create a new stretched canvas only when the current page is not
			// rendered with the stretched canvas. This can happen when we switch pages or when
			// this is the very first rendering of the PDF document.

			const canvas = this._createStretchedCanvas();

			// The stretched canvas shall have the same aspect ratio as the page. The longest
			// side of the stretched canvas shall be equal to the longest side of the screen.
			//
			// The scale factor for the stretched canvas differs from the scale factor for the
			// page.

			// The full page size in device pixels for scale factor 100%.
			const { width, height } = this._calculatePDFCanvasSize(page, 1);

			let scale;

			if (width > height) {
				canvas.width = longestScreenSide;
				canvas.height = longestScreenSide * height / width;
				scale = longestScreenSide / width;
			} else {
				canvas.width = longestScreenSide * width / height;
				canvas.height = longestScreenSide;
				scale = longestScreenSide / height;
			}

			const { style } = canvas;
			style.width = `${newCSSWidth}px`;
			style.height = `${newCSSHeight}px`;

			canvases.stretched = {
				canvas,
				scale
			};
		}

		if (zoomCenter != null) {
			// If the size of the canvas changes, the zoom point moves. We need to scroll the page
			// so that the zoom point remains in the same position on the screen. It's not always
			// possible as the page is not always scrollable.

			const zoomCenterInPDFCoordinates = this._screenToPage(page, zoomCenter[0], zoomCenter[1]);
			this._scale = this._camera.zoom = scale;
			this.getTools()
				.map(toolId => CoreElement.getElementById(toolId))
				.filter(tool => tool.isA("sap.ui.vk.tools.TransformSvgElementTool"))
				.map(tool => tool.getGizmoForContainer(this))
				.filter(gizmo => gizmo?.hasDomElement())
				.forEach(gizmo => gizmo.rerender());

			pageDomRef.style.setProperty("--sapUiVizKitRedlineScale", scale);

			const { style } = this._normalCanvas ?? this._stretchedCanvas;
			style.width = `${newCSSWidth}px`;
			style.height = `${newCSSHeight}px`;
			const zoomCenterAfterScale = this._pageToScreen(page, zoomCenterInPDFCoordinates[0], zoomCenterInPDFCoordinates[1]);

			scrollContainerDomRef.scrollBy({
				left: zoomCenterAfterScale[0] - zoomCenter[0],
				top: zoomCenterAfterScale[1] - zoomCenter[1],
				behavior: "instant"
			});
		} else {
			const { style } = this._normalCanvas ?? this._stretchedCanvas;
			style.width = `${newCSSWidth}px`;
			style.height = `${newCSSHeight}px`;
		}

		if (newState === STATE_STRETCHED) {
			const scrollContainerRect = scrollContainerDomRef.getBoundingClientRect();
			const pageRect = pageDomRef.getBoundingClientRect();

			// This is the rectangle of the page that is visible in the viewport, in CSS pixels.
			const fragmentRect = intersectDOMRects(scrollContainerRect, pageRect);

			const { devicePixelRatio } = window;

			const canvas = this._createHighResCanvas();
			canvas.width = Math.round(fragmentRect.width * devicePixelRatio);
			canvas.height = Math.round(fragmentRect.height * devicePixelRatio);

			const { style } = canvas;
			style.width = `${fragmentRect.width / pageRect.width * 100}%`;
			style.height = `${fragmentRect.height / pageRect.height * 100}%`;
			style.left = `${(fragmentRect.left - pageRect.left) / pageRect.width * 100}%`;
			style.top = `${(fragmentRect.top - pageRect.top) / pageRect.height * 100}%`;

			canvases.highRes = {
				canvas,
				scale,
				offsetX: Math.min(pageRect.left - scrollContainerRect.left, 0),
				offsetY: Math.min(pageRect.top - scrollContainerRect.top, 0)
			};
		}

		this._redlineHandler?._tool.getGizmo().rerender();

		return canvases;
	};

	Viewport.prototype._cancelRenderTasks = async function() {
		const renderTasks = this._renderTasks;

		for (const renderTask of renderTasks) {
			renderTask.cancel();
		}
		try {
			await Promise.all(renderTasks.map(({ promise }) => promise));
		} catch (e) {
			// Ignore the error.
		}
		renderTasks.splice(0);
	};

	Viewport.prototype._renderPage = async function({ page, canvases }) {
		if (this.getDomRef(PAGE_ID_SUFFIX) == null) {
			return;
		}

		await this._cancelRenderTasks();

		const renderTasks = this._renderTasks;

		try {
			const { normal, stretched, highRes } = canvases;

			if (normal != null) {
				const { canvas, scale } = normal;
				renderTasks.push(page.renderToCanvas(canvas, scale));
			} else {
				if (stretched != null) {
					const { canvas, scale } = stretched;
					renderTasks.push(page.renderToCanvas(canvas, scale));
				}

				const { canvas, scale, offsetX, offsetY } = highRes;
				renderTasks.push(page.renderToCanvas(canvas, scale, offsetX, offsetY));
			}

			await Promise.all(renderTasks.map(({ promise }) => promise));

			// NOTE: The `pageDomRef` element could be re-created since the time when we entered
			// this **async** method, or if rendering finishes after the viewport is destroyed it
			// can be `null`, so we must get a new reference to `pageDomRef` here.
			const pageDomRef = this.getDomRef(PAGE_ID_SUFFIX);
			if (pageDomRef == null) {
				return;
			}

			if (normal != null) {
				this._deleteHighResCanvas();
				this._deleteStretchedCanvas();
				this._deleteNormalCanvas();

				const { canvas } = normal;
				this._normalCanvas = canvas;
				pageDomRef.appendChild(canvas);
			} else {
				this._deleteNormalCanvas();

				if (stretched != null) {
					this._deleteStretchedCanvas();

					const { canvas } = stretched;
					this._stretchedCanvas = canvas;
					pageDomRef.appendChild(canvas);
				}

				this._deleteHighResCanvas();

				const { canvas } = highRes;
				this._highResCanvas = canvas;
				pageDomRef.appendChild(canvas);
			}
		} catch (e) {
			if (e instanceof Utils.getPdfjsLib().RenderingCancelledException) {
				Log.debug("Rendering cancelled", e, THIS_MODULE_NAME);
			} else {
				Log.error("Failed to render PDF page", e, THIS_MODULE_NAME);
			}
		} finally {
			renderTasks.splice(0);
		}
	};

	Viewport.prototype._render = async function({
		page,
		scale = this._scale,
		firstTimePageRendering = false,
		zoomCenter = null
	} = {}) {
		const canvases = this._layoutPage({ page, scale, firstTimePageRendering, zoomCenter });
		await this._renderPage({ page, canvases });
	};

	Viewport.prototype.onAfterRendering = function(event) {
		this._subscribeToEvents();

		const pageDomRef = this.getDomRef(PAGE_ID_SUFFIX);

		pageDomRef.appendChild(this._hotspotSurface);

		if (this._normalCanvas != null) {
			pageDomRef.appendChild(this._normalCanvas);
		}

		if (this._stretchedCanvas != null) {
			pageDomRef.appendChild(this._stretchedCanvas);
		}

		if (this._highResCanvas != null) {
			pageDomRef.appendChild(this._highResCanvas);
		}
	};

	Viewport.prototype.onBeforeRendering = function(event) {
		this._unsubscribeFromEvents();
	};

	Viewport.prototype.setCurrentPageIndex = function(pageIndex) {
		const pdfDocument = this._document;

		if (pdfDocument == null) {
			// If there is no PDF document, we still need to update the current page index.
			this.setProperty("currentPageIndex", pageIndex, true);
			return this;
		}

		const newPageIndex = Math.max(0, Math.min(pageIndex, pdfDocument.pageCount - 1));
		const oldPageIndex = this.getCurrentPageIndex();

		if (newPageIndex === oldPageIndex && !this._contentReplaced) {
			return this;
		}

		this._contentReplaced = false;

		this.setProperty("currentPageIndex", newPageIndex, true);

		(async () => {
			const page = await pdfDocument.getPage(newPageIndex);
			this._page = page;

			// TODO(PDF): The following code is probably not the best thing to do when switching pages.
			// Ideally, we should  set the canvas size to the size of the new page and if the rendering
			// takes longer than let's say 100ms, we should clear the page and show a spinner.
			//
			// NOTE: The both canvases can be null if the viewport is not rendered yet.
			const canvas = this._normalCanvas ?? this._stretchedCanvas;
			if (canvas != null) {
				Utils.clearCanvas(canvas);
			}

			// TODO(PDF): scroll to the top of the page if the page is taller than the viewport.

			this._updateHotspotSurface();

			await this._render({ page, firstTimePageRendering: true });
		})();

		this.fireEvent("pageChanged", { newPageIndex, oldPageIndex }, false, true);

		return this;
	};

	Viewport.prototype.setPageNavigationEnabled = function(enabled) {
		this._pageNavigationEnabled = enabled;
		this.getContent().find(item => item.isA("sap.ui.vk.DrawerToolbar"))?.setPageNavigationEnabled(enabled);
		return this;
	};

	Viewport.prototype._calculatePDFCanvasSize = function(page, scale) {
		const scaledPageUnit = page.userUnit * scale * 96 / 72;

		const { pageWidth, pageHeight } = page.rawDimensions;

		const scaledPageWidthInPixels = pageWidth * scaledPageUnit;
		const scaledPageHeightInPixels = pageHeight * scaledPageUnit;

		const { devicePixelRatio } = window;

		return {
			cssWidth: Math.round(scaledPageWidthInPixels),
			cssHeight: Math.round(scaledPageHeightInPixels),
			width: Math.round(scaledPageWidthInPixels * devicePixelRatio),
			height: Math.round(scaledPageHeightInPixels * devicePixelRatio)
		};
	};

	/**
	 * Convert client coordinates to PDF page coordinates.
	 *
	 * @param {sap.ui.vk.pdf.Page} page The page to convert the coordinates to.
	 * @param {number} clientX The clientX coordinate from MouseEvent.
	 * @param {number} clientY The clientY coordinate from MouseEvent.
	 * @returns {number[]} The PDF page coordinates <code>[x, y]</code>.
	 * @private
	 */
	Viewport.prototype._screenToPage = function(page, clientX, clientY) {
		const { left, top } = this.getDomRef(PAGE_ID_SUFFIX).getBoundingClientRect();
		return page.cssPixelToPDFPoint(clientX - left, clientY - top, this._scale);
	};

	/**
	 *
	 * @param {sap.ui.vk.pdf.Page} page The page to convert the coordinates from.
	 * @param {number} x The x coordinate in PDF page coordinates.
	 * @param {number} y The y coordinate in PDF page coordinates.
	 * @returns {number[]} The screen coordinates <code>[x, y]</code>.
	 * @private
	 */
	Viewport.prototype._pageToScreen = function(page, x, y) {
		const { left, top } = this.getDomRef(PAGE_ID_SUFFIX).getBoundingClientRect();
		const [pageX, pageY] = page.pdfPointToCSSPixel(x, y, this._scale);
		return [left + pageX, top + pageY];
	};

	Viewport.prototype._isKeyboardPageNavigationPossible = function(event) {
		return event.srcControl === this && this._page != null && this._pageNavigationEnabled;
	};

	Viewport.prototype.onsappageup = function(event) {
		if (!this._isKeyboardPageNavigationPossible(event)) {
			return;
		}

		// Prevent scroll delegate from scrolling the page. We want to go to the previous page instead.
		event.preventDefault();
		this.setCurrentPageIndex(this.getCurrentPageIndex() - 1);
	};

	Viewport.prototype.onsappagedown = function(event) {
		if (!this._isKeyboardPageNavigationPossible(event)) {
			return;
		}

		// Prevent scroll delegate from scrolling the page. We want to go to the next page instead.
		event.preventDefault();
		this.setCurrentPageIndex(this.getCurrentPageIndex() + 1);
	};

	Viewport.prototype.onsaphome = function(event) {
		if (!this._isKeyboardPageNavigationPossible(event)) {
			return;
		}

		event.preventDefault();
		this.setCurrentPageIndex(0);
	};

	Viewport.prototype.onsapend = function(event) {
		if (!this._isKeyboardPageNavigationPossible(event)) {
			return;
		}

		event.preventDefault();
		this.setCurrentPageIndex(this._document.pageCount - 1);
	};

	Viewport.prototype._onWheel = function(event) {
		if (this._page == null) {
			return;
		}

		if (!event.ctrlKey) {
			return;
		}

		event.preventDefault();

		const delta = -event.originalEvent.deltaY;

		if (delta > 0) {
			this.zoom(SCALE_DELTA, event.clientX, event.clientY);
		} else if (delta < 0) {
			this.zoom(1 / SCALE_DELTA, event.clientX, event.clientY);
		}
	};

	Viewport.prototype._onScroll = function(event) {
		if (this._page == null) {
			return;
		}

		// Throttle the scroll event.
		if (this._highResCanvas != null && !this._scrolling) {
			this._scrolling = true;

			setTimeout(() => {
				this._scrolling = false;
				this._render({ page: this._page });
			}, 500);
		}
	};

	Viewport.prototype._onResize = function(event) {
		if (this._page != null) {
			// Throttle re-rendering.
			if (this._highResCanvas != null && !this._resizing) {
				this._resizing = true;

				setTimeout(() => {
					this._resizing = false;
					this._render({ page: this._page });
				}, 500);
			}
		}

		const { width, height } = event.size;
		this.fireResize({ size: { width, height } });
	};

	Viewport.prototype.onkeydown = function(event) {
		if (event.srcControl !== this || this._page == null) {
			return;
		}

		if (event.ctrlKey) {
			let handled = true;
			let scaleDelta = 1;

			switch (event.key) {
				case "+":
				case "=":
					scaleDelta = SCALE_DELTA;
					break;
				case "-":
				case "_":
					scaleDelta = 1 / SCALE_DELTA;
					break;
				case "0":
					scaleDelta = 1 / this._scale;
					break;
				default:
					handled = false;
					break;
			}

			if (handled) {
				event.preventDefault();
				const { left, top, right, bottom } = this.getDomRef(PAGE_ID_SUFFIX).getBoundingClientRect();
				this.zoom(scaleDelta, (left + right) / 2, (top + bottom) / 2);
			}
		} else if (!event.altKey) {
			let panX = 0;
			let panY = 0;
			let handled = true;

			switch (event.key) {
				case "ArrowLeft":
					panX = -PIXELS_PER_ARROW_PAN;
					break;
				case "ArrowRight":
					panX = PIXELS_PER_ARROW_PAN;
					break;
				case "ArrowUp":
					panY = -PIXELS_PER_ARROW_PAN;
					break;
				case "ArrowDown":
					panY = PIXELS_PER_ARROW_PAN;
					break;
				default:
					handled = false;
					break;
			}

			if (handled) {
				event.preventDefault();
				this.pan(panX, panY);
			}
		}
	};

	Viewport.prototype.pan = function(deltaX, deltaY) {
		if (this._page == null) {
			return;
		}

		const scrollContainerDomRef = this.getDomRef(SCROLL_CONTAINER_ID_SUFFIX);

		if (scrollContainerDomRef == null) {
			return;
		}

		const { scrollLeft, scrollTop } = scrollContainerDomRef;
		this._scrollContainer.scrollTo(scrollLeft + deltaX, scrollTop + deltaY);

		if (this._highResCanvas != null) {
			this._render({ page: this._page });
		}
	};

	Viewport.prototype.zoom = function(scaleDelta, x, y) {
		if (this._page == null) {
			return;
		}

		const page = this._page;

		if (page == null || scaleDelta === 1) {
			return;
		}

		const oldScale = this._scale;
		const newScale = Math.min(Math.max(oldScale * scaleDelta, MIN_SCALE), MAX_SCALE);

		if (newScale != oldScale) {
			this._render({ page, scale: newScale, zoomCenter: [x, y] });
		}
	};

	Viewport.prototype.zoomToFitPage = function() {
		const page = this._page;
		const viewportDomRef = this.getDomRef();

		if (page == null || viewportDomRef == null) {
			return;
		}

		// Page size in pixels scaled to 100%.
		const { cssWidth: pageWidth, cssHeight: pageHeight } = this._calculatePDFCanvasSize(page, 1);

		const pageAspectRatio = pageWidth / pageHeight;

		// NOTE: We must use `viewportDomRef` instead of
		// `this.getDomRef(SCROLL_CONTAINER_ID_SUFFIX)` because the scroll container may have
		// scrollbars which affect `clientWidth` and `clientHeight`.
		const { clientWidth, clientHeight } = viewportDomRef;

		const { paddingLeft, paddingRight, paddingTop, paddingBottom } = getComputedStyle(this.getDomRef(SCROLL_CONTAINER_ID_SUFFIX));

		const contentWidth = clientWidth - parseFloat(paddingLeft) - parseFloat(paddingRight);
		const contentHeight = clientHeight - parseFloat(paddingTop) - parseFloat(paddingBottom);

		const viewportAspectRatio = contentWidth / contentHeight;

		const wantedCanvasWidth = viewportAspectRatio < pageAspectRatio
			? contentWidth
			: contentHeight * pageAspectRatio;

		this._render({ page, scale: wantedCanvasWidth / pageWidth, zoomCenter: [clientWidth / 2, clientHeight / 2] });
	};

	Viewport.prototype.zoomToFitPageWidth = function() {
		const page = this._page;
		const viewportDomRef = this.getDomRef();

		if (page == null || viewportDomRef == null) {
			return;
		}

		// Page size in pixels scaled to 100%.
		const { cssWidth: pageWidth, cssHeight: pageHeight } = this._calculatePDFCanvasSize(page, 1);

		// NOTE: We must use `viewportDomRef` instead of
		// `this.getDomRef(SCROLL_CONTAINER_ID_SUFFIX)` because the scroll container may have
		// scrollbars which affect `clientWidth` and `clientHeight`.
		const { clientWidth, clientHeight } = viewportDomRef;

		const { paddingLeft, paddingRight, paddingTop, paddingBottom } = getComputedStyle(this.getDomRef(SCROLL_CONTAINER_ID_SUFFIX));

		const contentWidth = clientWidth - parseFloat(paddingLeft) - parseFloat(paddingRight);
		const contentHeight = clientHeight - parseFloat(paddingTop) - parseFloat(paddingBottom);

		let wantedWidth = contentWidth;
		const wantedHeight = pageHeight * wantedWidth / pageWidth;

		if (wantedHeight > contentHeight) {
			// NOTE: If the new height is greater than the content height, there will be a
			// scrollbar, we need to take it into account.
			wantedWidth -= getScrollbarWidth();
		}

		this._render({ page, scale: wantedWidth / pageWidth, zoomCenter: [clientWidth / 2, clientHeight / 2] });
	};

	////////////////////////////////////////////////////////////////////////////
	// BEGIN: Methods for redlining.

	Viewport.prototype.setShouldRenderFrame = function() {
		// Do nothing.
	};

	Viewport.prototype.getOutputSize = function() {
		const { width, height } = this.getDomRef(PAGE_ID_SUFFIX).getBoundingClientRect();
		const shortestSide = Math.min(width, height);

		return {
			left: (width - shortestSide) * 0.5,
			top: (height - shortestSide) * 0.5,
			sideLength: shortestSide
		};
	};

	// This `onmousedown` handler is called before any Loco handler. If the user clicks on a text
	// redline element, we want to prevent starting editing it as the editing must be started by
	// double-clicking on the text element.
	Viewport.prototype.onmousedown = function(event) {
		const redlineHandler = this._redlineHandler;

		if (redlineHandler != null
			&& event.srcControl.isA("sap.ui.vk.RedlineElementText")
			&& redlineHandler._tool.getGizmo()?._textEditingElement == null) {

			event.preventDefault();
			this.focus();
			return;
		}
	};

	// END: Methods for redlining.
	////////////////////////////////////////////////////////////////////////////

	function intersectDOMRects(a, b) {
		if (a.right < b.left || b.right < a.left || a.bottom < b.top || b.bottom < a.top) {
			return new DOMRect(0, 0, 0, 0);
		}

		const left = Math.max(a.left, b.left);
		const top = Math.max(a.top, b.top);
		const right = Math.min(a.right, b.right);
		const bottom = Math.min(a.bottom, b.bottom);

		return new DOMRect(left, top, right - left, bottom - top);
	}

	function getScrollbarWidth() {
		// Create an invisible container.
		const outer = document.createElement("div");
		outer.style.visibility = "hidden";
		outer.style.overflow = "scroll"; // Force a scrollbar to appear.
		document.body.appendChild(outer);

		// Create an inner element and place it in the container.
		const inner = document.createElement("div");
		outer.appendChild(inner);

		// Calculate the difference between the container's full width and the child width.
		const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;

		// Remove the temporary elements from the DOM.
		outer.remove();

		return scrollbarWidth;
	}

	////////////////////////////////////////////////////////////////////////////
	// BEGIN: Methods for hotspots.

	Viewport.prototype.getScene = function() {
		return this._document?.scene;
	};

	Viewport.prototype._getViewBox = function() {
		const page = this._page;
		if (page == null) {
			return [0, 0, 1, 1];
		}

		const { pageX, pageY, pageWidth, pageHeight } = page.rawDimensions;

		return [pageX, pageY, pageWidth, pageHeight];
	};

	// This method converts the hotspot elements in the scene to DOM SVG elements.
	Viewport.prototype._updateHotspotSurface = function() {
		this._cleanupHotspotSurface();
		this._populateHotspotSurface();
	};

	Viewport.prototype._cleanupHotspotSurface = function() {
		const hotspotSurface = this._hotspotSurface;

		for (let childElement = hotspotSurface.lastElementChild; childElement != null; childElement = hotspotSurface.lastElementChild) {
			childElement.remove();
		}
	};

	// This method converts the hotspot elements in the scene to DOM SVG elements.
	//
	// The implementation is based on `sap.ui.vk.svg.ViewportRenderer.render()` which builds the DOM
	// SVG elements via RenderManager, while this methods builds the DOM SVG elements directly.
	//
	// TODO: sap.ui.vk.svg.Viewport should be refactored to allow to build DOM SVG elements directly
	// and reuse the `<svg>` element like the `<canvas>` elements in other types of viewports.
	Viewport.prototype._populateHotspotSurface = function() {
		const hotspotSurface = this._hotspotSurface;

		// Collect hotspot colors and add the `<filter>` elements to the SVG surface.

		const hotspotFilters = new Map();
		const addHotspotFilter = (color) => hotspotFilters.set(Element._hotspotEffectName(color), color);

		addHotspotFilter(abgrToColor(this._viewStateManager.getHighlightColor(true)));
		addHotspotFilter(abgrToColor(this.getHotspotColorABGR()));
		addHotspotFilter(cssColorToColor(this.getShowAllHotspotsTintColor()));

		// Collect individual hotspot colors.

		for (const hotspotNode of this._document.scene.getDefaultNodeHierarchy().getHotspotNodeRefs()) {
			const { name, color } = hotspotNode.getHotspotEffectDef();
			hotspotFilters.set(name, color);
		}

		for (const [name, color] of hotspotFilters) {
			const filter = document.createElementNS(NAMESPACE_SVG, "filter");
			filter.id = name;

			const feColorMatrix = document.createElementNS(NAMESPACE_SVG, "feColorMatrix");
			feColorMatrix.setAttribute("in", "SourceGraphic");
			feColorMatrix.setAttribute("type", "matrix");
			feColorMatrix.setAttribute("values", `0 0 0 0 ${color.red / 255}, 0 0 0 0 ${color.green / 255}, 0 0 0 0 ${color.blue / 255}, 0 0 0 ${color.alpha} 0`);

			filter.appendChild(feColorMatrix);
			hotspotSurface.appendChild(filter);
		}

		// The SVG surface shall use the same coordinates as the page (using the page's CropBox
		// dimensions).

		hotspotSurface.setAttribute("viewBox", `${this._getViewBox().join(" ")}`);

		// The expected scene structure (see sap.ui.vk.pdf.ContentManager):
		//
		// scene
		//   rootNode
		//     contentResourceNode
		//       hotspotNode
		//         shapeNode - this corresponds to the hotspotNode's parametric
		//         ...
		//       hotspotNode
		//         shapeNode
		//         ...
		//       ...
		//	     hotspotNode
		//         shapeNode
		//         ...

		const { scene } = this._document;
		const rootElement = scene.getRootElement();
		const groupElement = rootElement.children[0];

		// Each page may have a different coordinate system, so we need to adjust the group element.
		const { pageY, pageHeight } = this._page.rawDimensions;
		groupElement.setMatrix([1, 0, 0, -1, 0, pageHeight + 2 * pageY]);

		const rootDomRef = this._createDomSvgElement(rootElement);

		hotspotSurface.appendChild(rootDomRef);
	};

	Viewport.prototype._createDomSvgElement = function(element) {
		// The resulting DOM contains elements corresponding to nodes with the pageIndex property
		// equal to the current page index and nodes whose pageIndex property is not set.
		//
		// What nodes do not have pageIndex set? RootNode and contentResourceNode. The parametric
		// nodes, being children of hotspot nodes, also do not have the pageIndex property set but
		// we do not reach them if they belong to a hotspot node with a different pageIndex.

		const pageIndex = element.getPageIndex();
		if (pageIndex != null && pageIndex !== this.getCurrentPageIndex()) {
			return null;
		}

		const domRef = element.domRef = element._createDomElement();

		// NOTE: `Element#_createDomElement()` does not create child elements recursively, so we
		// need to create them here.
		for (const childElement of element.children) {
			const childDomRef = this._createDomSvgElement(childElement);
			if (childDomRef != null) {
				domRef.appendChild(childDomRef);
			}
		}

		return domRef;
	};

	Viewport.prototype.setDisableHotspotHovering = function(value) {
		this.setProperty("disableHotspotHovering", value, true);

		this._applyHotspotHoveringClass(value);

		return this;
	};

	Viewport.prototype._applyHotspotHoveringClass = function(value) {
		const pdfDocument = this._document;
		if (pdfDocument != null) {
			const methodName = value ? "addClass" : "removeClass";
			const hotspotNodes = pdfDocument.scene.getDefaultNodeHierarchy().getHotspotNodeRefs();
			for (const hotspotNode of hotspotNodes) {
				hotspotNode[methodName]("sapUiVizKitNonInteractiveHotspot");
			}
		}

		return this;
	};

	Viewport.prototype.setShowAllHotspots = function(value) {
		this.setProperty("showAllHotspots", value, true);

		this._applyShowAllHotspots(value);

		return this;
	};

	Viewport.prototype._applyShowAllHotspots = function(value) {
		const pdfDocument = this._document;

		if (pdfDocument == null) {
			return;
		}

		const nodes = pdfDocument.scene.getDefaultNodeHierarchy().getHotspotNodeRefs();
		const currentHotspotElement = this._currentHotspotElement;
		const color = this.getShowAllHotspotsTintColor();
		for (const node of nodes) {
			if (value) {
				node.setHotspotColor(1, color);
			} else if (node === currentHotspotElement) {
				node.setHotspotColor(1, this.getHotspotColorABGR());
			} else {
				node.setHotspotColor(1, null);
			}
		}
	};

	Viewport.prototype.hitTest = function(clientX, clientY) {
		const domElement = document.elementFromPoint(clientX, clientY);

		if (domElement != null) {
			const element = this._document.scene.getRootElement().getElementById(domElement.id);
			if (element != null) {
				return element._getSceneTreeElement();
			}
		}

		return null;
	};

	Viewport.prototype.onSetViewStateManager = function(viewStateManager) {
		this._viewStateManager = viewStateManager;

		viewStateManager.attachOutliningChanged(this._onOutliningOrSelectionChanged, this);
		viewStateManager.attachSelectionChanged(this._onOutliningOrSelectionChanged, this);
	};

	Viewport.prototype.onUnsetViewStateManager = function(viewStateManager) {
		viewStateManager.detachOutliningChanged(this._onOutliningOrSelectionChanged, this);
		viewStateManager.detachSelectionChanged(this._onOutliningOrSelectionChanged, this);

		this._viewStateManager = null;
	};

	Viewport.prototype._onOutliningOrSelectionChanged = function(event) {
		for (const toolId of this.getTools()) { // loop over all oTools
			const tool = CoreElement.getElementById(toolId); // get control for associated control
			const gizmo = tool.getGizmoForContainer(this);
			if (gizmo && gizmo.handleSelectionChanged) {
				gizmo.handleSelectionChanged(event);
			}
		}
	};

	/**
	 * @param {any|any[]}                nodeRefs The node reference or the array of node references that we want to tint.
	 * @param {boolean}                  show     Whether to highlight the nodes or remove the highlight.
	 * @param {int|sap.ui.core.CSSColor} color    The color to use for highlighting the nodes passed as argument.
	 * @returns {this} Reference to <code>this</code> in order to allow method chaining.
	 */
	Viewport.prototype.showHotspots = function(nodeRefs, show, color) {
		if (nodeRefs == null) {
			return this;
		}

		if (!Array.isArray(nodeRefs)) {
			nodeRefs = [nodeRefs];
		}

		// If the color is not passed as argument, we use the default hotspot color
		const hotspotColor = show ? (color ?? this.getHotspotColorABGR()) : null;
		for (const node of nodeRefs) {
			node.setCustomHotspotColor(1, hotspotColor);
		}

		this._updateHotspotSurface();

		return this;
	};

	Viewport.prototype.attachCameraChanged = function() { };
	Viewport.prototype.detachCameraChanged = function() { };

	// END: Methods for hotspots.
	////////////////////////////////////////////////////////////////////////////

	return Viewport;
});
