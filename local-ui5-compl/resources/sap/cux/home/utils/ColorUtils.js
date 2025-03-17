/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";sap.ui.define(["./Constants"],function(t){"use strict";const s=t["DEFAULT_BG_COLOR"];const o=t["LEGEND_COLORS"];const e=t["PAGE_SELECTION_LIMIT"];class r{constructor(){this._oColorList=o().slice(0,e)}getFreeColor(){const t=this._oColorList.find(t=>!t.assigned);let o=s().key;if(t){t.assigned=true;o=t.key}return o}addColor(t){this._fetchColor(t).assigned=true;return this}removeColor(t){this._fetchColor(t).assigned=false;return this}_fetchColor(t){return this._oColorList.find(function(s){return s.key===t})||{assigned:false}}_getColorMap(){return this._oColorList}}var i=new r;return i});
//# sourceMappingURL=ColorUtils.js.map