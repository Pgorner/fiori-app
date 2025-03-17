// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/Container"],function(r){"use strict";class t{#r=r.getRendererInternal();#t=null;constructor(r){this.#t=r}async getControl(){return this.#t}async destroy(){this.#r.removeFooterById(this.#t.getId());this.#t.destroy()}}return t});
//# sourceMappingURL=Footer.js.map