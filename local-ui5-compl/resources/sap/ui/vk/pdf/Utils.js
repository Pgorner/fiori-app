/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define([],()=>{"use strict";class t{static#t;static async loadPdfjsLib(){let i=t.#t;if(i==null){const t=sap.ui.require.toUrl("sap/ui/vk/thirdparty/pdf.js");const s=sap.ui.require.toUrl("sap/ui/vk/thirdparty/pdf.worker.js");this.#t=i=await import(t);i.GlobalWorkerOptions.workerSrc=s}return i}static getPdfjsLib(){return t.#t}static clearCanvas(t){const{width:i,height:s}=t;const r=t.getContext("2d",{alpha:false});r.fillStyle="white";r.fillRect(0,0,i,s)}}return t});
//# sourceMappingURL=Utils.js.map