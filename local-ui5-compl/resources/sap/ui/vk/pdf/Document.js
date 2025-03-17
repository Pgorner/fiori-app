/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["./Page"],e=>{"use strict";const t="sap.ui.vk.pdf.Document";class s{getName(){return t}isA(e){return Array.isArray(e)?e.includes(t):e===t}}const n=new s;class u{#e=null;#t=null;constructor(e,t=null){this.#e=e;this.#t=t}destroy(){this.#e.destroy();this.#e=null;this.#t.getSceneBuilder().cleanup();this.#t.destroy();this.#t=null}get pageCount(){return this.#e.numPages}async getPage(t){const s=await this.#e.getPage(t+1);return new e(s)}getMetadata(){return n}isA(e){return n.isA(e)}get scene(){return this.#t}}return u});
//# sourceMappingURL=Document.js.map