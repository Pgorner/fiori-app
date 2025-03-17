/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2018 SAP SE. All rights reserved
 */
sap.ui.define(["sap/ui/core/format/DateFormat"],function(t){"use strict";var e=function(){this.oDisplayFormatterMap=r()};e.prototype.constructor=e;function r(){var t=new Map;t.set("Date",a);t.set(undefined,n);return t}function a(e){var r=t.getDateInstance({style:"short"});var a=r.format(e,true);return a}function n(t){return t}e.prototype.getFormattedValue=function(t,e){var r=t["sap:display-format"]!==undefined?t["sap:display-format"]:undefined;var a=new Date(e);if(a.toLocaleString()==="Invalid Date"){return"-"}var n=this.oDisplayFormatterMap.get(r)!==undefined?this.oDisplayFormatterMap.get(r).call(this,a):a;return n};return e},true);
//# sourceMappingURL=dateTimeFormatter.js.map