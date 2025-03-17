/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define([],()=>{"use strict";class e{#e=null;constructor(e){this.#e=e}get pageIndex(){return this.#e.pageNumber-1}get viewBox(){return this.#e.view}get rawDimensions(){return this.#e.getViewport({scale:1}).rawDims}get userUnit(){return this.#e.userUnit}renderToCanvas(e,t,i=0,s=0){t*=this.userUnit*96/72;const n=this.#e.getViewport({scale:t});return this.#e.render({canvasContext:e.getContext("2d",{alpha:false}),viewport:n,transform:[devicePixelRatio,0,0,devicePixelRatio,i*devicePixelRatio,s*devicePixelRatio],annotationMode:0})}renderToImage(e){const{pageWidth:t,pageHeight:i}=this.rawDimensions;const s=e/Math.max(t,i);const n=this.#e.getViewport({scale:s});const r=Math.round(n.width);const a=Math.round(n.height);const o=document.createElement("canvas");o.width=r;o.height=a;const d=this.#e.render({canvasContext:o.getContext("2d",{alpha:false}),viewport:n,annotationMode:0});return{renderTask:d,canvas:o}}cssPixelToPDFPoint(e,t,i){return this.#t(i).convertToPdfPoint(e,t)}pdfPointToCSSPixel(e,t,i){return this.#t(i).convertToViewportPoint(e,t)}#t(e){return this.#e.getViewport({scale:e*this.userUnit*96/72})}}return e});
//# sourceMappingURL=Page.js.map