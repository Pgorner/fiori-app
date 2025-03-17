/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log"],function(t){"use strict";t.info("Load typeUtilsCopy");var e={"[object Boolean]":"boolean","[object Number]":"number","[object String]":"string","[object Function]":"function","[object Array]":"array","[object Date]":"date","[object RegExp]":"regexp","[object Object]":"object"};var r=function(t){return!t?String(t):e[Object.prototype.toString.call(t)]||"object"};var n={isFunction:function(t){return r(t)==="function"},isArray:Array.isArray||function(t){return r(t)==="array"},isExist:function(t){if(typeof t==="undefined"||t===null){return false}return true}};return n});
//# sourceMappingURL=typeUtils.js.map