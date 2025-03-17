/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

sap.ui.define([
	"./Page"
], (
	Page
) => {
	"use strict";

	const TYPE_NAME = "sap.ui.vk.pdf.Document";

	class DocumentMetadata {
		getName() {
			return TYPE_NAME;
		}

		isA(typeName) {
			return Array.isArray(typeName)
				? typeName.includes(TYPE_NAME)
				: typeName === TYPE_NAME;
		}
	}

	const metadata = new DocumentMetadata();

	class Document {
		#pdfjsDocument = null;
		#scene = null;

		constructor(pdfjsDocument, scene = null) {
			this.#pdfjsDocument = pdfjsDocument;
			this.#scene = scene;
		}

		destroy() {
			this.#pdfjsDocument.destroy();
			this.#pdfjsDocument = null;

			this.#scene.getSceneBuilder().cleanup();
			this.#scene.destroy();
			this.#scene = null;
		}

		get pageCount() {
			return this.#pdfjsDocument.numPages;
		}

		async getPage(pageIndex) {
			const pdfjsPage = await this.#pdfjsDocument.getPage(pageIndex + 1);
			return new Page(pdfjsPage);
		}

		getMetadata() {
			return metadata;
		}

		isA(typeName) {
			return metadata.isA(typeName);
		}

		get scene() {
			return this.#scene;
		}
	}

	return Document;
});
