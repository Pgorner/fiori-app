/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

sap.ui.define([
], (
) => {
	"use strict";

	class Page {
		#pdfjsPage = null;

		constructor(pdfjsPage) {
			this.#pdfjsPage = pdfjsPage;
		}

		get pageIndex() {
			return this.#pdfjsPage.pageNumber - 1;
		}

		/**
		 * @returns {number[]} The coordinates of the bottom left `(x1, y1)` and top right `(x2, y2)` corners of the
		 *     page in user units `[x1, y1, x2, y2]`;
		 * @public
		 */
		get viewBox() {
			return this.#pdfjsPage.view;
		}

		get rawDimensions() {
			return this.#pdfjsPage.getViewport({ scale: 1 }).rawDims;
		}

		get userUnit() {
			return this.#pdfjsPage.userUnit;
		}

		renderToCanvas(canvas, scale, offsetX = 0, offsetY = 0) {
			scale *= this.userUnit * 96 / 72; // Convert from PDF points to CSS pixels.

			// NOTE: We assume that the canvas has the same aspect ratio as the page.

			const viewport = this.#pdfjsPage.getViewport({ scale });

			// How PDF coordinates map to canvas coordinates:
			//
			// Pc = Mr × Mv × Pp
			//
			// Pc - point in canvas coordinates
			// Mr - `transform` passed to `this.#pdfjsPage.render()`, converts from CSS pixels to device pixels.
			// Mv - `viewport.transform` passed to `this.#pdfjsPage.render()`, converts from PDF coordinates to CSS pixels.
			// Pp - point in PDF coordinates
			//
			// NOTE: `viewport.transform` is kinda readonly for a particular `scale` and (`offsetX`, `offsetY`).
			// If we want to *offset* the page, we should use the `transform` parameter of `this.#pdfjsPage.render()`.

			return this.#pdfjsPage.render({
				// The PDF page is opaque, so there is no need for alpha channel. This improves performance.
				//
				// TODO(PDF): `alpha: false` results in a black background when we change the canvas size. Figure out
				// how to make the background white to avoid flickering. Especially bad flickering occurs when we zoom
				// in/out.
				canvasContext: canvas.getContext("2d", { alpha: false }),
				viewport,
				transform: [devicePixelRatio, 0, 0, devicePixelRatio, offsetX * devicePixelRatio, offsetY * devicePixelRatio],
				annotationMode: 0
			});
		}

		/**
		 * @typedef {object} RenderToImageResult
		 * @property {object} renderTask - The pdfjs RenderTask.
		 * @property {HTMLCanvasElement} canvas - The canvas which will contain the rendered image.
		 */

		/**
		 * Renders the page to an image.
		 *
		 * The image will have the same aspect ratio as the page and will be scaled to fit into a square with the side
		 * length `sideLength`.
		 *
		 * @param {number} sideLength - The side length of the square that the image will fit into.
		 * @returns {Promise<RenderToImageResult>} - A promise that resolves with the image dataURL, width, and height.
		 * @public
		 */
		renderToImage(sideLength) {
			const { pageWidth, pageHeight } = this.rawDimensions;
			const scale = sideLength / Math.max(pageWidth, pageHeight);
			const viewport = this.#pdfjsPage.getViewport({ scale });
			const width = Math.round(viewport.width);
			const height = Math.round(viewport.height);

			const canvas = document.createElement("canvas");
			canvas.width = width;
			canvas.height = height;

			const renderTask = this.#pdfjsPage.render({
				canvasContext: canvas.getContext("2d", { alpha: false /* See renderToCanvas for explanation. */ }),
				viewport,
				annotationMode: 0
			});

			return {
				renderTask,
				canvas
			};
		}

		cssPixelToPDFPoint(x, y, scale) {
			return this.#getViewport(scale).convertToPdfPoint(x, y);
		}

		pdfPointToCSSPixel(x, y, scale) {
			return this.#getViewport(scale).convertToViewportPoint(x, y);
		}

		#getViewport(scale) {
			return this.#pdfjsPage.getViewport({ scale: scale * this.userUnit * 96 / 72 });
		}
	}

	return Page;
});
