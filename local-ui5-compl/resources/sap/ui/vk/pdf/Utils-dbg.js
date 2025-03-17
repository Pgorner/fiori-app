/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

sap.ui.define([
], (
) => {
	"use strict";

	class Utils {
		static #pdfjsLib;

		static async loadPdfjsLib() {
			let pdfjsLib = Utils.#pdfjsLib;

			if (pdfjsLib == null) {
				const pdfjsLibUrl = sap.ui.require.toUrl("sap/ui/vk/thirdparty/pdf.js");
				const pdfjsLibWorkerUrl = sap.ui.require.toUrl("sap/ui/vk/thirdparty/pdf.worker.js");

				this.#pdfjsLib = pdfjsLib = await import(pdfjsLibUrl);

				pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsLibWorkerUrl;
			}

			return pdfjsLib;
		}

		static getPdfjsLib() {
			return Utils.#pdfjsLib;
		}

		static clearCanvas(canvas) {
			const { width, height } = canvas;
			const context = canvas.getContext("2d", { alpha: false });
			context.fillStyle = "white";
			context.fillRect(0, 0, width, height);
		}
	}

	return Utils;
});
