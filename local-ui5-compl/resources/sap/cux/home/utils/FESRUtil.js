/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";sap.ui.define(["sap/ui/performance/trace/FESRHelper"],function(e){"use strict";var t=function(e){e["PRESS"]="press";e["CHANGE"]="change";e["SELECT"]="select";return e}(t||{});const r=(e,t)=>{e.data("fesr-id",t);return e};const a=e=>e.data("fesr-id");const n=(t,r,a)=>{if(a){e.setSemanticStepname(t,r,a)}};var s={__esModule:true};s.FESR_EVENTS=t;s.addFESRId=r;s.getFESRId=a;s.addFESRSemanticStepName=n;return s});
//# sourceMappingURL=FESRUtil.js.map