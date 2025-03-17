/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";sap.ui.define(["sap/ui/Device"],function(e){"use strict";const t={Mobile:600,Tablet:1024,Desktop:1440};var r=function(e){e["Mobile"]="Mobile";e["Tablet"]="Tablet";e["Desktop"]="Desktop";e["LargeDesktop"]="LargeDesktop";return e}(r||{});function o(){let o=arguments.length>0&&arguments[0]!==undefined?arguments[0]:e.resize.width;if(o<t.Mobile||e.system.phone){return r.Mobile}else if(o<t.Tablet){return r.Tablet}else if(o<t.Desktop){return r.Desktop}else{return r.LargeDesktop}}function i(e,t){const r={};t.forEach(t=>{r[t]=parseFloat(window.getComputedStyle(e).getPropertyValue(t))});return r}var s={__esModule:true};s.DeviceType=r;s.calculateDeviceType=o;s.fetchElementProperties=i;return s});
//# sourceMappingURL=Device-dbg.js.map