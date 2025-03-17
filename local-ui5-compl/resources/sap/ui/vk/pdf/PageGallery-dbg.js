/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

sap.ui.define([
	"sap/base/Log",
	"sap/m/library",
	"sap/m/Slider",
	"sap/m/VBox",
	"sap/ui/core/Control",
	"sap/ui/core/delegate/ItemNavigation",
	"sap/ui/core/EnabledPropagator",
	"../Core",
	"./Utils",
	"../getResourceBundle"
], (
	Log,
	sapMLibrary,
	Slider,
	VBox,
	Control,
	ItemNavigation,
	EnabledPropagator,
	vkCore,
	Utils,
	getResourceBundle
) => {
	"use strict";

	const {
		FlexRendertype
	} = sapMLibrary;

	// This image is used as a placeholder for the thumbnail when the page is not rendered yet.
	const EMPTY_THUMBNAIL = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'></svg>";

	// This image is used as a placeholder for the thumbnail when the page rendering fails.
	const BAD_PAGE_THUMBNAIL = sap.ui.require.toUrl("sap/ui/vk/themes/base/images/vk-pdf-page-error.svg");

	const THUMBNAIL_ID_SUFFIX = "thumbnail";
	const PAGE_INDEX_ID_SUFFIX = "pageIndex";

	// Default scale (in percent) of the maximum thumbnail size.
	const DEFAULT_THUMBNAIL_SCALE = 25;

	// Width and height of the thumbnail at the default scale.
	const DEFAULT_THUMBNAIL_WIDTH = 140;
	const DEFAULT_THUMBNAIL_HEIGHT = 206;

	// The maximum number of simultaneous render tasks.
	const MAX_RENDER_TASKS = 5;

	// The maximum time in milliseconds to wait for the rendering to complete. If the rendering
	// takes longer than this time, the task is cancelled, and the page shows `BAD_PAGE_THUMBNAIL`.
	const RENDER_TIMEOUT = 5_000;

	const PageGalleryItem = Control.extend("sap.ui.vk.pdf.PageGalleryItem", {
		metadata: {
			library: "sap.ui.vk"
		},

		renderer: {
			apiVersion: 2,

			render(rm, control) {
				/* eslint-disable no-lone-blocks */

				const id = control.getId();

				rm.openStart("div", id);
				rm.class("sapVizKitPageGalleryItem");
				rm.attr("tabindex", 0);
				rm.attr("data-sap-ui-vk-page-index", control._pageIndex);
				if (control._selected) {
					rm.class("sapVizKitPageGalleryItemSelected");
				}
				rm.openEnd();

				{
					rm.openStart("img", `${id}-${THUMBNAIL_ID_SUFFIX}`);
					rm.attr("src", control._thumbnail);
					rm.attr("alt", getResourceBundle().getText("PAGE_ALT_TEXT", [control._pageIndex + 1]));
					rm.style("width", `${control._width}px`);
					rm.style("height", `${control._height}px`);
					rm.openEnd();
					rm.close("img");
				}

				{
					rm.openStart("div", `${id}-${PAGE_INDEX_ID_SUFFIX}`);
					rm.class("sapMLabel");
					rm.openEnd();
					const pageIndex = control._pageIndex;
					rm.text(pageIndex != null ? pageIndex + 1 : "0");
					rm.close("div");
				}

				rm.close("div");

				/* eslint-enable no-lone-blocks */
			}
		},

		init() {
			Control.prototype.init?.call(this);

			this._pageIndex = null;
			this._selected = false;
			this._thumbnail = EMPTY_THUMBNAIL;
			this._width = DEFAULT_THUMBNAIL_WIDTH;
			this._height = DEFAULT_THUMBNAIL_HEIGHT;

			// This flag is set to `true` when the thumbnail needs to be updated.
			this._isDirty = true;
		},

		setPageIndex(value) {
			this._pageIndex = value;

			const pageIndexDomRef = this.getDomRef(PAGE_INDEX_ID_SUFFIX);

			if (pageIndexDomRef != null) {
				pageIndexDomRef.textContent = value;
			}

			return this;
		},

		setSelected(value) {
			this._selected = value;

			const domRef = this.getDomRef();

			if (domRef != null) {
				if (value) {
					domRef.classList.add("sapVizKitPageGalleryItemSelected");
				} else {
					domRef.classList.remove("sapVizKitPageGalleryItemSelected");
				}
			}

			return this;
		},

		setThumbnail(thumbnail, width, height) {
			this._thumbnail = thumbnail;
			this._width = width;
			this._height = height;

			const thumbnailDomRef = this.getDomRef(THUMBNAIL_ID_SUFFIX);

			if (thumbnailDomRef != null) {
				thumbnailDomRef.src = thumbnail;
				const { style } = thumbnailDomRef;
				style.width = `${width}px`;
				style.height = `${height}px`;
			}

			return this;
		},

		setThumbnailSideLength(value) {
			const { _width: width, _height: height, _thumbnail: thumbnail } = this;

			if (value === Math.max(width, height)) {
				return this;
			}

			if (width > height) {
				this.setThumbnail(thumbnail, value, value * height / width);
			} else {
				this.setThumbnail(thumbnail, value * width / height, value);
			}

			// As we are changing the size of the thumbnail, we need to update the thumbnail.
			this.setDirty(true);

			return this;
		},

		getDirty() {
			return this._isDirty;
		},

		setDirty(value) {
			this._isDirty = value;
			return this;
		}
	});

	const PageGallery = Control.extend("sap.ui.vk.pdf.PageGallery", /** @lends sap.ui.vk.pdf.PageGallery.prototype */ {
		metadata: {
			library: "sap.ui.vk",

			properties: {
				width: {
					type: "sap.ui.core.CSSSize",
					defaultValue: "100%"
				},

				height: {
					type: "sap.ui.core.CSSSize",
					defaultValue: "100%"
				},

				currentPageIndex: {
					type: "int",
					defaultValue: 0
				},

				thumbnailScale: {
					type: "float",
					defaultValue: DEFAULT_THUMBNAIL_SCALE
				}
			},

			aggregations: {
				_slider: {
					type: "sap.m.Slider",
					multiple: false,
					visibility: "hidden"
				},

				_pages: {
					type: "sap.m.VBox",
					multiple: false,
					visibility: "hidden"
				}
			},

			associations: {
				contentConnector: {
					type: "sap.ui.vk.ContentConnector",
					multiple: false
				}
			},

			events: {
				pageChanged: {
					parameters: {
						newPageIndex: "int",
						oldPageIndex: "int"
					}
				},

				thumbnailScaleChanged: {
					parameters: {
						value: "float"
					}
				}
			}
		},

		renderer: {
			apiVersion: 2,

			render(rm, control) {
				rm.openStart("div", control);
				rm.class("sapVizKitPageGallery");
				if (!control.getEnabled()) {
					rm.class("sapVizKitPageGalleryDisabled");
				}
				rm.style("width", control.getWidth());
				rm.style("height", control.getHeight());
				rm.openEnd();
				rm.renderControl(control._getSliderControl());
				rm.renderControl(control._getPagesControl());
				rm.close("div");
			}
		},

		constructor: function(sId, mSettings) {
			Control.apply(this, arguments);
			vkCore.observeAssociations(this);
		}
	});

	const THIS_MODULE_NAME = PageGallery.getMetadata().getName();

	// This class adds the 'enabled' property to the control and implements propagation of the
	// property to the child controls.
	//
	// NOTE: This class does not set the descendants' property `tabIndex` to -1, so the last
	// selected page thumbnail can still be focused with the keyboard.
	EnabledPropagator.call(PageGallery.prototype);

	PageGallery.prototype.init = function() {
		Control.prototype.init?.call(this);

		const id = this.getId();

		this._document = null;

		// A list of pageIndexes of the currently visible pages.
		this._visiblePages = new Set();

		// A list of pageIndexes of the pages that need to be rendered.
		this._queue = new Set();

		// This flag is used to avoid scheduling the processing multiple times. The flag is set in
		// method `_scheduleProcessingQueue` and cleared in method
		// `_processQueue`.
		this._processingQueueScheduled = false;

		// The pages that are currently being rendered. The key is the pageIndex. The value is an
		// object with the following properties:
		// - sideLength: The side length of the thumbnail.
		// - renderTask: The render task.
		this._tasks = new Map();

		this._thumbnailSideLength = DEFAULT_THUMBNAIL_HEIGHT;

		// This flag is set to true when the content is replaced. So that on the first rendering we
		// can scroll to the current page index.
		this._scrollToCurrentPageIndexAfterRendering = false;

		this.setAggregation("_slider", new Slider(`${id}-slider`, {
			tooltip: getResourceBundle().getText("SLIDER_TOOLTIP"),
			width: "auto",
			min: 5,
			max: 100,
			value: DEFAULT_THUMBNAIL_SCALE,
			enabled: false,
			liveChange: [/* generateNewThumbnail = */false, this._onSliderValueChanged, this],
			change: [/* generateNewThumbnail = */true, this._onSliderValueChanged, this]
		}).addStyleClass("sapVizKitPageGallerySlider"));

		this.setAggregation("_pages", new VBox(`${id}-pages`, {
			renderType: FlexRendertype.Bare
		}).addStyleClass("sapVizKitPageGalleryPages"));

		const itemNavigation = this._itemNavigation = new ItemNavigation();
		this.addEventDelegate(itemNavigation);

		this._intersectionObserver = null;
		this._intersectionObserverCallback = this._intersectionObserverCallback.bind(this);

		this._onkeydown = this._onkeydown.bind(this);
	};

	PageGallery.prototype.exit = function() {
		this._unsubscribeFromEvents();

		this._intersectionObserver?.disconnect();
		this._intersectionObserver = null;

		this.removeEventDelegate(this._itemNavigation);
		this._itemNavigation.destroy();
		this._itemNavigation = null;

		this._clearQueue();

		this._visiblePages.clear();

		this._document = null;

		Control.prototype.exit?.call(this);
	};

	PageGallery.prototype.onSetContentConnector = function(contentConnector) {
		contentConnector.attachContentReplaced(this._onContentReplaced, this);
		this._setContent(contentConnector.getContent());
	};

	PageGallery.prototype.onUnsetContentConnector = function(contentConnector) {
		contentConnector.detachContentReplaced(this._onContentReplaced, this);
		this._setContent(null);
	};

	PageGallery.prototype._onContentReplaced = function(event) {
		this._setContent(event.getParameter("newContent"));
	};

	PageGallery.prototype._setContent = function(pdfDocument) {
		if (pdfDocument === this._document) {
			return;
		}

		this._intersectionObserver?.disconnect();

		this._document = pdfDocument;

		const sliderControl = this._getSliderControl();
		sliderControl.setEnabled(false);

		const pagesControl = this._getPagesControl();
		pagesControl.destroyItems();

		this._clearQueue();

		if (pdfDocument != null) {
			this._scrollToCurrentPageIndexAfterRendering = true;

			sliderControl.setEnabled(true);

			const sideLength = this._thumbnailSideLength;
			const id = this.getId();
			const pageCount = pdfDocument.pageCount;

			// Clamp the current page index to the valid range.
			const currentPageIndex = Math.max(0, Math.min(this.getCurrentPageIndex(), pageCount - 1));

			for (let i = 0; i < pageCount; ++i) {
				const page = new PageGalleryItem(`${id}-page-${i}`);
				page.setPageIndex(i);
				page.setSelected(i === currentPageIndex);
				page.setThumbnailSideLength(sideLength);
				pagesControl.addItem(page);
			}

			this.setCurrentPageIndex(currentPageIndex);
		}

		this.invalidate();
	};

	PageGallery.prototype._subscribeToEvents = function() {
		this.$().on("keydown", this._onkeydown);
	};

	PageGallery.prototype._unsubscribeFromEvents = function() {
		this.$().off("keydown", this._onkeydown);
	};

	PageGallery.prototype.onBeforeRendering = function() {
		this._unsubscribeFromEvents();
	};

	PageGallery.prototype.onAfterRendering = function() {
		const pagesControl = this._getPagesControl();
		const pagesDomRef = pagesControl.getDomRef();
		const pages = pagesControl.getItems();
		const pageIndex = Math.max(this.getCurrentPageIndex(), 0);
		this._itemNavigation
			.setRootDomRef(pagesDomRef)
			.setItemDomRefs(pages.map(item => item.getDomRef()))
			.setColumns(1, true)
			.setCycling(false)
			.setPageSize(1)
			.setSelectedIndex(pageIndex)
			.setFocusedIndex(pageIndex);

		const intersectionObserver = this._intersectionObserver = new IntersectionObserver(
			this._intersectionObserverCallback,
			{ root: pagesDomRef, threshold: 0 }
		);

		for (const page of pages) {
			intersectionObserver.observe(page.getDomRef());
		}

		if (this._scrollToCurrentPageIndexAfterRendering) {
			this._scrollToCurrentPageIndexAfterRendering = false;
			const currentPageIndex = this.getCurrentPageIndex();
			if (currentPageIndex >= 0 && currentPageIndex < pages.length) {
				pages[currentPageIndex].getDomRef()?.scrollIntoView({ block: "nearest" });
			}
		}

		this._subscribeToEvents();
	};

	PageGallery.prototype.onBeforeRendering = function() {
		this._intersectionObserver?.disconnect();
		this._intersectionObserver = null;
	};

	PageGallery.prototype._intersectionObserverCallback = function(entries) {
		const pages = this._getPagesControl().getItems();
		const visiblePages = this._visiblePages;

		for (const { target, isIntersecting } of entries) {
			const pageIndexString = target.dataset.sapUiVkPageIndex;
			if (pageIndexString == null) {
				continue;
			}

			const pageIndex = parseInt(pageIndexString, 10);
			const page = pages[pageIndex];

			if (isIntersecting) {
				Log.debug(`IntersectionObserver: page ${pageIndex} became visible`, null, THIS_MODULE_NAME);
				visiblePages.add(pageIndex);
				if (page.getDirty()) {
					this._enqueueThumbnailGeneration(pageIndex);
				}
			} else {
				Log.debug(`IntersectionObserver: page ${pageIndex} became invisible`, null, THIS_MODULE_NAME);
				visiblePages.delete(pageIndex);
			}
		}

		this._itemNavigation.setPageSize(Math.max(1, visiblePages.size - 1));
	};

	PageGallery.prototype._onSliderValueChanged = function(event, generateNewThumbnail) {
		this._changeThumbnailScale(event.getParameter("value"), generateNewThumbnail);
	};

	PageGallery.prototype._changeThumbnailScale = function(value, generateNewThumbnail) {
		// NOTE: We call `Control.prototype.setProperty` instead of `this.setProperty` to avoid
		// infinite recursion.
		Control.prototype.setProperty.call(this, "thumbnailScale", value, true);
		this.getAggregation("_slider").setValue(value);
		const sideLength = this._thumbnailSideLength = value * DEFAULT_THUMBNAIL_HEIGHT / DEFAULT_THUMBNAIL_SCALE;
		this.fireThumbnailScaleChanged({ value });

		if (this._document == null) {
			return;
		}

		const pagesControl = this._getPagesControl();
		const pagesDomRef = pagesControl.getDomRef();
		const { scrollTop, scrollHeight } = pagesDomRef;
		const relativeScrollTop = scrollTop / scrollHeight;

		const pages = pagesControl.getItems();
		const pageCount = pages.length;
		const visiblePages = this._visiblePages;
		for (let i = 0; i < pageCount; ++i) {
			pages[i].setThumbnailSideLength(sideLength);

			if (generateNewThumbnail && visiblePages.has(i)) {
				this._enqueueThumbnailGeneration(i);
			}
		}

		const { scrollHeight: newScrollHeight } = pagesDomRef;
		const newScrollTop = relativeScrollTop * newScrollHeight;
		pagesDomRef.scrollTo({ top: newScrollTop, behavior: "instant" });
	};

	PageGallery.prototype._activatePage = function(event) {
		if (this._document == null) {
			return;
		}

		const target = event.target.closest("[data-sap-ui-vk-page-index]");
		if (target != null) {
			const pageIndexString = target.dataset.sapUiVkPageIndex;
			if (pageIndexString != null) {
				const pageIndex = parseInt(pageIndexString, 10);
				this.setCurrentPageIndex(pageIndex);
			}
		}
	};

	PageGallery.prototype.ontap = function(event) {
		this._activatePage(event);
	};

	PageGallery.prototype.onsapenter = function(event) {
		this._activatePage(event);
	};

	PageGallery.prototype._onkeydown = function(event) {
		// When the page gallery is disabled it can still receive focus. We need to be able to
		// navigate to the next/previous control. Ideally, when we disable the page gallery we need
		// to set the `tabindex` property of all descendants to `-1` but `EnabledPropagator` does
		// not do that.
		if (!this.getEnabled() && event.key !== "Tab") {
			event.preventDefault();
			event.stopPropagation();
		}
	};

	PageGallery.prototype.setCurrentPageIndex = function(newPageIndex) {
		const oldPageIndex = this.getCurrentPageIndex();

		if (oldPageIndex === newPageIndex) {
			return this;
		}

		const pages = this._getPagesControl().getItems();
		const pageCount = pages.length;

		if (pageCount === 0) {
			// If there is no PDF document, we still need to update the current page index.
			this.setProperty("currentPageIndex", newPageIndex, true);
		} else {
			if (oldPageIndex >= 0 && oldPageIndex < pageCount) {
				pages[oldPageIndex].setSelected(false);
			}

			// Clamp the new page index to the valid range.
			newPageIndex = Math.max(0, Math.min(newPageIndex, pageCount - 1));
			this._itemNavigation
				.setSelectedIndex(newPageIndex)
				.setFocusedIndex(newPageIndex);
			this.setProperty("currentPageIndex", newPageIndex, true);
			const page = pages[newPageIndex];
			page.setSelected(true);
			page.getDomRef()?.scrollIntoView({ block: "nearest" });
		}

		this.firePageChanged({ newPageIndex, oldPageIndex });

		return this;
	};

	PageGallery.prototype._enqueueThumbnailGeneration = function(pageIndex) {
		const queue = this._queue;

		if (queue.has(pageIndex)) {
			// The page is already in the queue but its processing is not started yet.
			return;
		}

		const sideLength = this._thumbnailSideLength;
		const tasks = this._tasks;
		const pageTask = tasks.get(pageIndex);

		if (pageTask != null) {
			// There is already a running task for this page.

			const { renderTask } = pageTask;

			if (renderTask == null || pageTask.sideLength === sideLength) {
				// The task has not started yet or it has started and is for the same size. No need
				// to enqueue a new one.
				return;
			}

			// The render task is for the same page but with a different size, we need to cancel it
			// and enqueue a new one.
			tasks.delete(pageIndex);
			renderTask.cancel();
		}

		queue.add(pageIndex);

		this._getPagesControl().getItems()[pageIndex].setBusy(true);

		this._scheduleProcessingThumbnailQueue();
	};

	PageGallery.prototype._scheduleProcessingThumbnailQueue = function() {
		if (!this._processingQueueScheduled) {
			this._processingQueueScheduled = true;

			queueMicrotask(() => {
				this._processThumbnailQueue();
			});
		}
	};

	PageGallery.prototype._processThumbnailQueue = async function() {
		this._processingQueueScheduled = false;

		const tasks = this._tasks;

		if (tasks.size >= MAX_RENDER_TASKS) {
			// Too many simultaneous tasks.
			Log.debug("Too many simultaneous thumbnail tasks", null, THIS_MODULE_NAME);
			return;
		}

		const queue = this._queue;

		if (queue.size === 0) {
			// No more pages to process.
			Log.debug("No more pages to process", null, THIS_MODULE_NAME);
			return;
		}

		// NOTE: `Set` is iterated in insertion order.
		for (const pageIndex of queue) {
			queue.delete(pageIndex);

			if (this._visiblePages.has(pageIndex)) {
				// This page is still visible. Process it.

				Log.debug(`Processing page ${pageIndex}`, null, THIS_MODULE_NAME);

				const task = {};

				tasks.set(pageIndex, task);

				const page = await this._document.getPage(pageIndex);
				const sideLength = this._thumbnailSideLength;
				const { devicePixelRatio } = window;
				const { renderTask, canvas } = page.renderToImage(sideLength * devicePixelRatio);

				task.sideLength = sideLength;
				task.renderTask = renderTask;
				task.canvas = canvas;
				task.timedOut = false;
				task.timeoutId = setTimeout(() => {
					task.renderTask.cancel();
					task.timedOut = true;
				}, RENDER_TIMEOUT);

				try {
					await renderTask.promise;

					clearTimeout(task.timeoutId);

					Log.debug(`Page ${pageIndex} rendered successfully`, null, THIS_MODULE_NAME);

					const thumbnail = canvas.toDataURL("image/png");
					const pageControl = this._getPagesControl().getItems()[pageIndex];

					if (task.sideLength === this._thumbnailSideLength) {
						pageControl.setThumbnail(thumbnail, canvas.width / devicePixelRatio, canvas.height / devicePixelRatio);
						pageControl.setDirty(false);
					} else {
						Log.debug(`Page ${pageIndex} thumbnail was generated for a different size, enqueuing a new task`, null, THIS_MODULE_NAME);
						this._enqueueThumbnailGeneration(pageIndex);
					}
				} catch (e) {
					if (e instanceof Utils.getPdfjsLib().RenderingCancelledException) {
						Log.debug(`Page ${pageIndex} rendering cancelled`, e, THIS_MODULE_NAME);
						if (task.timedOut) {
							Log.error(`Page ${pageIndex} rendering timed out`, e, THIS_MODULE_NAME);
							this._getPagesControl().getItems()[pageIndex]
								.setThumbnail(BAD_PAGE_THUMBNAIL, canvas.width / devicePixelRatio, canvas.height / devicePixelRatio)
								.setDirty(false);
						}
					} else {
						Log.error("Page ${pageIndex} rendering failed", e, THIS_MODULE_NAME);
					}
				}

				tasks.delete(pageIndex);

				// The page may have been removed. E.g. if the PageGallery control is destroyed the
				// `exit` calls `_clearQueue` and at that time the `items` aggregation is already
				// empty.
				if (!this.isDestroyStarted()) {
					this._getPagesControl().getItems()[pageIndex]?.setBusy(false);

					// This task has finished. Schedule the next task.
					this._scheduleProcessingThumbnailQueue();
				}

				// We break the loop here to process only one page at a time.
				break;
			} else {
				// This page is not visible anymore. Skip it.
				this._getPagesControl().getItems()[pageIndex].setBusy(false);
				Log.debug(`Page ${pageIndex} is not visible anymore, trying to process another page`, null, THIS_MODULE_NAME);
			}
		}
	};

	PageGallery.prototype._clearQueue = function() {
		this._queue.clear();

		const tasks = this._tasks;

		for (const { renderTask } of tasks.values()) {
			renderTask?.cancel();
		}

		tasks.clear();
	};

	PageGallery.prototype._getSliderControl = function() {
		return this.getAggregation("_slider");
	};

	PageGallery.prototype._getPagesControl = function() {
		return this.getAggregation("_pages");
	};

	PageGallery.prototype.setProperty = function(name, value, suppressInvalidate) {
		if (name === "thumbnailScale") {
			// NOTE: The `Control.prototype.setProperty()` method is called in `_changeThumbnailScale`.
			this._changeThumbnailScale(value, true);
		} else {
			Control.prototype.setProperty.apply(this, arguments);
		}

		return this;
	};

	return PageGallery;
});
